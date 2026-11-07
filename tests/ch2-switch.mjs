/**
 * Switches between Squatch and Mops are announced (task T6).
 * Plays Chapter 2 from ?ch=2 through the pump hide with keys, and checks a switch card shows
 * before the player gets control as Mops, the "YOU:" tag in the page text names Mops, walking
 * into the diner shows "Mops goes inside.", and asking for work switches back with a card.
 * Then plays all seven Chapter 2 story switches and checks each card's reason against the exact words
 * in docs/PHASE-1-LINES-FOR-BRIAN.md (6.1 to 6.7), and the six room-change lines (6.9 to 6.14).
 * Also checks that src/game.js changes x.mops only inside switchTo.
 *   node tests/ch2-switch.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root, readLines } from "./game-page.mjs";

const LINES = readLines();

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
  const ss = window.__ss;
  const n = ss.op;
  n.sq.x = 690; n.sq.y = 530; n.sq.moving = false;
  ss.switchLog = [];
  // Every frame until the switch card shows: could the player move Mops with no card up or waiting?
  window.__freeMops = 0;
  window.__cardSeen = false;
  const isCard = (r) => r && r.k === "card" && r.id === "switch";
  const watch = () => {
    if (isCard(n.cur)) window.__cardSeen = true;
    if (window.__cardSeen) return;
    const blocked = !!n.cur && ["bub", "card", "panel", "fb"].includes(n.cur.k);
    if (ss.ch.mops && n.ctrl && !blocked && !n.q.some(isCard)) window.__freeMops++;
    requestAnimationFrame(watch);
  };
  requestAnimationFrame(watch);
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
g.check("the switch card's reason is line 6.1 word for word", !!card && card.by === LINES["6.1"], { card, want: LINES["6.1"] });
const before = await page.evaluate(() => ({ free: window.__freeMops, log: window.__ss.switchLog.filter((r) => r.why === "g1-door") }));
g.check("the switch to Mops was queued while the player was still Squatch, with its card", before.log.length === 1 && before.log[0].before === false && before.log[0].card === true, before);
g.check("no frame let the player move Mops before the card", before.free === 0 && !controlBeforeCard, before);
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
g.check("going in the diner door shows line 6.9", s.room === "diner" && s.roomLine === LINES["6.9"], { s, want: LINES["6.9"] });

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
g.check("asking for work ends with You are SQUATCH now. and line 6.2", !!card && card.text === "You are SQUATCH now." && card.by === LINES["6.2"], { card: card || s, want: LINES["6.2"] });
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

// All seven story switches, each built from its checkpoint and played with Space.
const BOTS_HOME = { bots: [{ x: 420, y: 520, hx: 420, f: 1, look: 0 }, { x: 600, y: 520, hx: 600, f: 1, look: 0 }] };
const SWITCHES = [
  ["6.1", "MOPS", [["reset", "g1"], ["act", "HIDE"]]],
  ["6.2", "SQUATCH", [["scene", "G2"], ["act", "ASK"]]],
  ["6.3", "MOPS", [["reset", "g3hide"], ["set", BOTS_HOME], ["act", "HIDE"]]],
  ["6.4", "SQUATCH", [["set", { has: "soup" }], ["reset", "g4k"], ["act", "LEAVE SOUP"]]],
  ["6.5", "MOPS", [["set", { done: 5, held: 6, scrub: 2, mopN: 0, greasy: false }], ["reset", "wash5"], ["set", { held: 6, scrub: 2 }], ["act", "SCRUB"]]],
  ["6.6", "MOPS", [["set", { done: 5, held: 6, scrub: 0, mopN: 2, greasy: true, jar: 0, has: "" }], ["reset", "wash5"], ["set", { held: 6, greasy: true, mopN: 2 }], ["mops"], ["act", "MOP"]]],
  ["6.7", "SQUATCH", [["set", { jar: 30, has: "" }], ["reset", "wash5"], ["scene", "G6"], ["act", "GRAB"], ["act", "EXIT"], ["act", "GIVE"]]],
];
const ROOMS = [
  ["6.9", [["reset", "g1"], ["act", "HIDE"], ["drain"], ["act", "ENTER"]]],
  ["6.10", [["reset", "back"], ["act", "ENTER"]]],
  ["6.11", [["set", { has: "soup" }], ["reset", "g4k"], ["act", "FRONT"]]],
  ["6.12", [["set", { has: "soup" }], ["reset", "g4k"], ["act", "FRONT"], ["act", "BACK"]]],
  ["6.13", [["set", { jar: 0, has: "soup" }], ["reset", "g4"], ["act", "ENTER"]]],
  ["6.14", [["set", { jar: 30, has: "" }], ["reset", "wash5"], ["scene", "G6"], ["drain"], ["act", "GRAB"], ["act", "EXIT"]]],
];
const build = (steps) => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true;
  const act = (verb) => {
    const b = ss.walkBounds();
    const who = ss.ch.mops ? n.mo : n.sq;
    if (!ss.ch.mops && n.sqPose === "hidden") n.sqPose = "stand";
    for (let y = b.y0; y <= b.y1; y += 10)
      for (let x = b.x0; x <= b.x1; x += 10) {
        who.x = x; who.y = y;
        const a = ss.pickAct();
        if (a && a.verb === verb) return (a.f(), true);
      }
    return false;
  };
  for (const st of steps) {
    if (st[0] === "reset") ss.resetTo(st[1]);
    else if (st[0] === "set") Object.assign(ss.ch2, st[1]);
    else if (st[0] === "scene") ss["scene" + st[1]]();
    else if (st[0] === "drain") ss.drain();
    else if (st[0] === "mops") ss.swapTo(true);
    else if (st[0] === "act" && !act(st[1])) return "no " + st[1] + " offered";
  }
  return n.roomLine ? n.roomLine.text : "";
};
for (const [row, who, steps] of SWITCHES) {
  const { ctx, page, errors } = await g.open("?ch=2");
  const err = await page.evaluate(build, steps);
  // Earlier switch cards on the way (6.6 comes before 6.7) are tapped past; the last card seen is kept.
  let card = null;
  for (let i = 0; i < 60 && !(card && card.by === LINES[row]); i++) {
    await sleep(250);
    const c = await page.evaluate(() => {
      const c = window.__ss.op.cur;
      return c && c.k === "card" && c.id === "switch" ? { text: c.text, by: c.by } : null;
    });
    card = c || card;
    if (!(c && c.by === LINES[row])) await g.key(page, "Space");
  }
  g.check(`switch ${row}: card "You are ${who} now." with "${LINES[row]}"`, !err.startsWith("no ") && !!card && card.text === `You are ${who} now.` && card.by === LINES[row], { err, card });
  g.check(`no page errors (switch ${row})`, errors.length === 0, errors);
  await ctx.close();
}
for (const [row, steps] of ROOMS) {
  const { ctx, page, errors } = await g.open("?ch=2");
  const line = await page.evaluate(build, steps);
  g.check(`room change ${row}: "${LINES[row]}"`, line === LINES[row], { line, want: LINES[row] });
  g.check(`no page errors (room ${row})`, errors.length === 0, errors);
  await ctx.close();
}
// The picture button during the bots' search counts as hiding: no capture, same state as HIDE.
const endOfHide = async (how) => {
  const { ctx, page, errors } = await g.open("?ch=2");
  await page.evaluate((how) => {
    const ss = window.__ss;
    const n = ss.op;
    ss.ch2.cook = "gone"; ss.ch2.caught = 0;
    ss.resetTo("g3hide");
    ss.ch2.cook = "gone"; ss.ch2.timer = 1;
    n.sq.x = 300; n.sq.y = 520; n.sqPose = "stand";
    if (how === "picture") ss.picSwap();
    else {
      n.sq.x = 170; n.sq.y = 560;
      const a = ss.pickAct();
      a && a.verb === "HIDE" && a.f();
    }
  }, how);
  await sleep(2500); // past the countdown
  await page.evaluate(() => window.__ss.picSwap()); // try to switch back
  let s = null;
  for (let i = 0; i < 40; i++) {
    await sleep(300);
    s = await page.evaluate(() => {
      const n = window.__ss.op;
      const lines = [n.cur, ...n.q].filter(Boolean).map((r) => (r.b && r.b.text) || "");
      return { caught: window.__ss.ch2.caught, wookie: lines.includes("WOOKIE?!"), phase: window.__ss.ch2.phase, scene: n.scene, pose: n.sqPose, spot: window.__ss.ch.spot, sq: [Math.round(n.sq.x), Math.round(n.sq.y)] };
    });
    if (s.wookie || s.phase === "g4") break;
    await g.key(page, "Space");
  }
  g.check(`no page errors (g3hide ${how})`, errors.length === 0, errors);
  await ctx.close();
  return s;
};
const viaHide = await endOfHide("hide");
const viaPicture = await endOfHide("picture");
g.check("g3hide: the picture button, the countdown and switching back bring no capture", viaPicture.caught === 0 && !viaPicture.wookie, viaPicture);
g.check(
  "g3hide: the picture button ends in the same state as HIDE",
  ["phase", "scene", "pose", "spot"].every((key) => viaPicture[key] === viaHide[key]) && viaPicture.sq.join() === viaHide.sq.join() && viaHide.phase === "g4",
  { viaHide, viaPicture },
);

await g.finish("switch");
