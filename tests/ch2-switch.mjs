/**
 * Switches between Squatch and Mops are announced (task T6).
 * Plays Chapter 2 from ?ch=2 through the pump hide with keys, and checks a switch card shows
 * before the player gets control as Mops, the "YOU:" tag in the page text names Mops, walking
 * into the diner shows "Mops goes inside.", and asking for work switches back with a card.
 * Also checks that src/game.js changes x.mops only inside switchTo.
 *   node tests/ch2-switch.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const g = await startGame({ port: 8783, name: "switch" });

// Only switchTo assigns x.mops.
{
  const src = readFileSync(join(root, "src", "game.js"), "utf8").split("\n");
  const hits = src.map((line, i) => [i, line]).filter(([, line]) => /x\.mops = /.test(line));
  const owner = (i) => {
    for (let j = i; j >= 0; j--) {
      const m = src[j].match(/^\s*function ([A-Za-z0-9_$]+)\(/);
      if (m) return m[1];
    }
    return "";
  };
  g.check("x.mops is assigned only inside switchTo", hits.length >= 1 && hits.every(([i]) => owner(i) === "switchTo"), hits.map(([i, l]) => `${i + 1}: ${l.trim()}`));
}

const { ctx, page, errors } = await g.open("?ch=2");
const state = () =>
  page.evaluate(() => {
    const ss = window.__ss;
    const n = ss.op;
    const cur = n.cur;
    const tag = document.getElementById("ss-who");
    return {
      scene: n.scene,
      phase: ss.ch2.phase,
      room: n.room,
      mops: !!ss.ch.mops,
      ctrl: n.ctrl,
      busy: !!cur || n.q.length > 0,
      cur: cur ? { k: cur.k, id: cur.id, text: cur.text || (cur.b && cur.b.text), by: cur.by } : null,
      tag: tag ? tag.textContent : null,
      tagShown: !!tag && getComputedStyle(tag).display !== "none",
      tagInCanvas: !!(tag && tag.closest("canvas")),
      roomLine: n.roomLine ? n.roomLine.text : "",
    };
  });

// The opening lines of Chapter 2, then control as Squatch.
let s = await state();
for (let i = 0; i < 40 && !(s.scene === "G1" && s.ctrl && !s.busy); i++) {
  await g.key(page, "Space");
  await sleep(350);
  s = await state();
}
g.check("Chapter 2 opens with Squatch in control at the pump", s.scene === "G1" && !s.mops && s.ctrl, s);
g.check("the tag says YOU: SQUATCH in page text", s.tag === "YOU: SQUATCH" && s.tagShown && !s.tagInCanvas, s);

// HIDE behind the crate with the E key.
await page.evaluate(() => {
  const n = window.__ss.op;
  n.sq.x = 690; n.sq.y = 530; n.sq.moving = false;
});
await sleep(150);
await g.key(page, "KeyE");
await sleep(150);
let card = null;
let controlBeforeCard = false;
for (let i = 0; i < 40; i++) {
  s = await state();
  if (s.cur && s.cur.k === "card" && s.cur.id === "switch") {
    card = s.cur;
    break;
  }
  if (s.mops && s.ctrl && !s.busy) controlBeforeCard = true;
  await g.key(page, "Space");
  await sleep(350);
}
g.check("a switch card shows after the hide", !!card, s);
g.check("the switch card says You are MOPS now.", !!card && card.text === "You are MOPS now.", card);
g.check("the switch card says why", !!card && typeof card.by === "string" && card.by.length > 10, card);
g.check("the player never had Mops before the card", !controlBeforeCard);
const whileCard = await state();
g.check("the card waits for a tap", whileCard.cur && whileCard.cur.id === "switch" && (await sleep(1500), (await state()).cur?.id === "switch"));
for (let i = 0; i < 10 && (s.busy || !s.ctrl); i++) {
  await g.key(page, "Space");
  await sleep(350);
  s = await state();
}
g.check("after the card, Mops is in control", s.mops && s.ctrl && !s.busy, s);
g.check("the tag says YOU: MOPS", s.tag === "YOU: MOPS" && s.tagShown && !s.tagInCanvas, s);

// Walk in the diner door: the room change has its line.
await page.evaluate(() => {
  const n = window.__ss.op;
  n.mo.x = 300; n.mo.y = 470; n.mo.moving = false;
});
await sleep(150);
await g.key(page, "KeyE");
await sleep(120);
s = await state();
g.check("going in the diner door says Mops goes inside.", s.room === "diner" && s.roomLine === "Mops goes inside.", s);

// ORDER at the counter: the switch back to Squatch is announced too.
await page.evaluate(() => {
  const n = window.__ss.op;
  n.mo.x = 480; n.mo.y = 470; n.mo.moving = false;
});
await sleep(150);
await g.key(page, "KeyE");
card = null;
for (let i = 0; i < 20; i++) {
  await sleep(350);
  s = await state();
  if (s.cur && s.cur.id === "switch") {
    card = s.cur;
    break;
  }
  await g.key(page, "Space");
}
g.check("asking for work ends with You are SQUATCH now.", !!card && card.text === "You are SQUATCH now." && card.by.length > 10, card || s);
for (let i = 0; i < 6 && (s.busy || !s.ctrl); i++) {
  await g.key(page, "Space");
  await sleep(350);
  s = await state();
}
g.check("back on the lot, the tag says YOU: SQUATCH", s.tag === "YOU: SQUATCH" && !s.mops && s.ctrl, s);

// Reset section switches silently and the tag follows.
await page.evaluate(() => window.__ss.resetTo("g4"));
await sleep(200);
s = await state();
g.check("Reset section into the diner shows YOU: MOPS with no card", s.tag === "YOU: MOPS" && !s.cur, s);

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("switch");
