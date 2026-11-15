/**
 * Scene 1 morning (Brian, 2026-11-14; docs/CHAPTER-1-PROBLEMS.md "Do first: scene 1", step 3).
 * Chapter 1 from the start on a phone:
 * - after the cards, short bubbles while Squatch is still in bed: "Morning, Squatch." "Big party in the hall tonight."
 *   Squatch: "Party?" Mops: "Stay in here." Mops is not cleaning (no "polish"),
 * - the song is at the door (Mops's goodbye),
 * - the room is the locked picture from the first moment (no switch when the song starts),
 * - only one bucket: nothing yellow is drawn where the old code bucket used to sit,
 * - the goal bar never says "ship" in scene 1,
 * - no yellow ring around Squatch for the song (it happens where he stands),
 * - after Mops leaves there is the "That evening…" card, then the peek goal,
 * - no touch help line and no "Tap the floor" note.
 * - the peek (step 4): the hall is already full on the first hall frame, Squatch stays in his doorway,
 *   the goal bar is empty, he hears muffled talk, then thinks "Robots?" once, then hides in the plant.
 *   node tests/scene1-morning.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8923, name: "scene1-morning" });
const v = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const { page, errors } = await g.open("?ch=1", v);
const st = () =>
  page.evaluate(() => {
    const n = window.__ss.op;
    const cur = n.cur || {};
    return {
      scene: n.scene,
      cur: cur.k || "",
      who: (cur.b && cur.b.who) || cur.who || "",
      text: (cur.b && cur.b.text) || cur.text || "",
      ctrl: n.ctrl,
      chip: n.chip || "",
      pose: n.sqPose,
      moPose: n.moPose,
      sq: [n.sq.x, n.sq.y],
      ring: n.lastRing && n.T - n.lastRing.T < 0.2 ? Math.hypot(n.lastRing.x - n.sq.x, n.lastRing.y - n.sq.y) : null,
      page: document.body.innerText,
    };
  });
const tap = async () => {
  await page.touchscreen.tap(v.width / 2, v.height * 0.3);
  await sleep(500);
};
// Yellow pixels inside the old code bucket's spot (x 585-635, y 520-560), which is plain floor in the picture.
const oldBucketYellow = () =>
  page.evaluate(() => {
    const cv = document.querySelector("canvas"),
      k = cv.width / 960,
      d = cv.getContext("2d").getImageData(Math.round(600 * k), Math.round(525 * k), Math.round(40 * k), Math.round(30 * k)).data;
    let y = 0;
    for (let i = 0; i < d.length; i += 4) d[i] > 230 && d[i + 1] > 180 && d[i + 2] < 90 && y++;
    return y;
  });

const chips = new Set();
let morning = null;
for (let i = 0; i < 20; i++) {
  const s = await st();
  chips.add(s.chip);
  if (s.cur === "bub" && /Morning, Squatch/.test(s.text)) {
    morning = s;
    break;
  }
  await tap();
}
g.check("Mops says good morning after the cards", !!morning, morning);
// Then the short lines, one bubble each: the party, Squatch wants to go, the rule.
const said = [];
for (let i = 0; i < 12; i++) {
  const t = await st();
  if (t.ctrl) break;
  if (t.cur === "bub" && said[said.length - 1] !== t.text) said.push(t.text);
  await tap();
}
g.check(
  "then: Big party in the hall tonight. / Party? / Stay in here.",
  JSON.stringify(said.slice(0, 4)) === JSON.stringify(["Morning, Squatch.", "Big party in the hall tonight.", "Party?", "Stay in here."]),
  said,
);
g.check("Squatch is still in bed for the morning line", morning && morning.pose === "sit", morning && morning.pose);
g.check("Mops is not cleaning in scene 1", morning && morning.moPose !== "polish", morning && morning.moPose);
g.check("the room is the locked picture from the start (scene O1)", (await page.evaluate(() => window.__ss.op.scene)) === "O1");
g.check("only one bucket while Squatch wakes up", (await oldBucketYellow()) === 0, await oldBucketYellow());
let s = await st();
g.check("no touch help line and no Tap the floor note", !/Stick: walk|Tap the floor/.test(s.page), s.page.slice(0, 300));
// Walk out of bed and around.
await page.keyboard.down("ArrowRight");
await sleep(900);
await page.keyboard.up("ArrowRight");
await page.keyboard.down("ArrowUp");
await sleep(500);
await page.keyboard.up("ArrowUp");
await sleep(700);
s = await st();
chips.add(s.chip);
g.check("after walking, the goal is to sing along with Mops", /sing along with Mops/.test(s.chip), s.chip);
g.check("no yellow ring around Squatch for the song", s.ring === null || s.ring >= 40, s.ring);
g.check("only one bucket in the song part", (await oldBucketYellow()) === 0, await oldBucketYellow());
await sleep(1500);
const hum = await page.evaluate(() => ({ x: window.__ss.op.mo.x, pose: window.__ss.op.moPose }));
g.check("Mops walks to the door and hums there", hum.x > 760 && hum.pose === "sway", hum);
await page.keyboard.press("KeyE");
let evening = false;
for (let i = 0; i < 80; i++) {
  s = await st();
  chips.add(s.chip);
  if (s.cur === "card" && /^That evening/.test(s.text)) evening = true;
  if (s.ctrl && /peek out the door/.test(s.chip)) break;
  if (s.cur === "bub" || s.cur === "card" || s.cur === "wait") await tap();
  else await sleep(300);
}
g.check('"That evening…" card before the peek', evening);
g.check("then the goal is to peek out the door", s.ctrl && /peek out the door/.test(s.chip), s.chip);
// The peek: stand at the door and use it.
await page.evaluate(() => {
  const n = window.__ss.op;
  ((n.sq.x = 820), (n.sq.y = 480));
  const o = window.__ss.offerNow();
  o && o.f();
});
const peek = { firstHallParty: null, door: null, chips: new Set(), said: [] };
for (let i = 0; i < 120; i++) {
  const p = await page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur || {};
    return { room: n.room, party: !!n.ch1Party, chip: n.chip || "", cur: c.k || "", text: (c.b && c.b.text) || c.text || "", sq: [n.sq.x, n.sq.y] };
  });
  if (p.room === "hall") {
    if (peek.firstHallParty === null) peek.firstHallParty = p.party;
    if (/^Mmf/.test(p.text) && !peek.door) peek.door = p.sq;
    if (!/Croc Boys/.test(p.text)) peek.chips.add(p.chip);
    if (p.cur === "bub" && peek.said[peek.said.length - 1] !== p.text) peek.said.push(p.text);
  }
  if (/Croc Boys/.test(p.text)) break;
  if (p.cur === "bub" || p.cur === "card" || p.cur === "wait") await tap();
  else await sleep(250);
}
g.check("the hall is already full when Squatch peeks", peek.firstHallParty === true, peek.firstHallParty);
g.check("he stays in his doorway for the muffled talk", !!peek.door && peek.door[1] > 600, peek.door);
g.check("the goal bar is empty during the peek", [...peek.chips].every((c) => !c), [...peek.chips]);
const mm = peek.said.indexOf("Mmf mmf... mm-mmf... mmf!"),
  rb = peek.said.indexOf("Robots?"),
  wel = peek.said.findIndex((t) => /^Welcome, everybody/.test(t));
g.check("muffled talk, then Robots?, then the announcement", mm >= 0 && rb > mm && wel > rb, peek.said);
g.check("Robots? only once", peek.said.filter((t) => t === "Robots?").length === 1, peek.said);
g.check("the goal bar never says ship in scene 1", ![...chips].some((c) => /ship/i.test(c)), [...chips]);
g.check("no page errors", errors.length === 0, errors);
await g.finish("scene1-morning");
