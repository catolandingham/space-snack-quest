/**
 * Scene 1 morning (Brian, 2026-11-14; rebuilt as src/modules/morning.js with his answers of 2026-11-23).
 * Chapter 1 from the start on a phone (the step-by-step order is tests/morning-order.mjs):
 * - after the cards, Squatch is asleep in bed and Mops mops; the wall speaker's party line wakes Squatch, who
 *   sits up in bed, then Mops "Morning, Squatch." and Squatch "Party?",
 * - the room is the locked picture from the first moment, with only one bucket (nothing yellow where the old
 *   code bucket used to sit),
 * - the song: the goal "Squatch: sing along with Mops", Mops stays by the bucket (no walk to the door, no hum),
 *   no yellow ring around Squatch,
 * - the goal bar never says "ship" in scene 1,
 * - after Mops leaves Squatch is home alone with his homework, then the "That evening…" card, then the peek goal,
 * - no touch help line and no "Tap the floor" note.
 * - the peek (party P1): the hall is already full on the first hall frame, only his head shows in his doorway,
 *   the goal bar is empty, he hears muffled talk, then thinks "Robots?" once.
 * - the sneak (party P2): the player steers him to the plant. Stepping out while the glancer looks across the
 *   lane gets a "?" and then the alarm; ↺ puts him back in his doorway; going while the glancer faces the stage
 *   and pressing HIDE at the plant hides him, and the welcome starts.
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
      mo: [n.mo.x, n.mo.y],
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
let wake = null;
for (let i = 0; i < 20; i++) {
  const s = await st();
  chips.add(s.chip);
  if (s.cur === "bub" && s.who === "speaker") {
    wake = s;
    break;
  }
  await tap();
}
g.check("after the cards the wall speaker's party line wakes Squatch", !!wake && /Big party in the hall tonight/.test(wake.text), wake);
g.check("Squatch sits up in bed for it", wake && wake.pose === "sit", wake && wake.pose);
g.check("Mops is mopping, not polishing or rocking", wake && wake.moPose === "mop", wake && wake.moPose);
g.check("the room is the locked picture from the start", wake && wake.scene === "Q1", wake && wake.scene);
g.check("only one bucket while Squatch wakes up", (await oldBucketYellow()) === 0, await oldBucketYellow());
const said = [];
for (let i = 0; i < 12; i++) {
  const t = await st();
  if (t.cur === "cutaway") break;
  if (t.cur === "bub" && said[said.length - 1] !== t.text) said.push(t.text);
  await tap();
}
g.check("then Mops: Morning, Squatch. / Squatch: Party?", said.includes("Morning, Squatch.") && said.indexOf("Party?") > said.indexOf("Morning, Squatch."), said);
let s = await st();
g.check("no touch help line and no Tap the floor note", !/Stick: walk|Tap the floor/.test(s.page), s.page.slice(0, 300));
// Tap on through the cutaway and the song's start until the kid has control.
for (let i = 0; i < 20 && !(s.ctrl && s.chip); i++) {
  if (["bub", "card", "wait", "cutaway"].includes(s.cur)) await tap();
  else await sleep(300);
  s = await st();
  chips.add(s.chip);
}
g.check("then the goal is to sing along with Mops", /sing along with Mops/.test(s.chip), s.chip);
g.check("no yellow ring around Squatch for the song", s.ring === null || s.ring >= 40, s.ring);
g.check("only one bucket in the song part", (await oldBucketYellow()) === 0, await oldBucketYellow());
await sleep(1500);
const stay = await st();
g.check("Mops stays by the bucket for the song (no walk to the door, no hum)", Math.abs(stay.mo[0] - s.mo[0]) < 1 && stay.moPose === "stand", { before: s.mo, after: stay.mo, pose: stay.moPose });
await page.keyboard.press("KeyE");
let evening = false,
  homework = false;
for (let i = 0; i < 80; i++) {
  s = await st();
  chips.add(s.chip);
  if (s.cur === "card" && /^That evening/.test(s.text)) evening = true;
  if (s.ctrl && /peek out the door/.test(s.chip)) break;
  // Home alone after Mops leaves: the homework at the desk (tests/home-alone.mjs) comes before the evening.
  if (s.ctrl && /do your homework/.test(s.chip)) {
    homework = true;
    await page.evaluate(() => (window.__ss.spotsNow() || []).find((x) => x.id === "homework").f());
    continue;
  }
  if (s.cur === "bub" || s.cur === "card" || s.cur === "wait" || s.cur === "cutaway") await tap();
  else await sleep(300);
}
g.check("after Mops leaves, home alone with the homework goal", homework);
g.check('"That evening…" card before the peek', evening);
g.check("then the goal is to peek out the door", s.ctrl && /peek out the door/.test(s.chip), s.chip);
// The peek (party P1, src/modules/party.js): stand at the door and use it.
await page.evaluate(() => {
  const n = window.__ss.op;
  ((n.sq.x = 860), (n.sq.y = 480));
});
await sleep(200);
await page.keyboard.press("KeyE");
const peek = { firstHallParty: null, door: null, chips: new Set(), said: [] };
const hallNow = () =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur || {},
      k = window.SSQ.beat("ch1-party").now();
    return { room: n.room, party: !!k, chip: window.__ss.chipNow() || "", cur: c.k || "", text: (c.b && c.b.text) || c.text || "", sq: [n.sq.x, n.sq.y], ctrl: n.ctrl, pose: n.sqPose, sneak: k && k.scene === "P2" ? { glance: k.glance, alarm: k.alarm, seenBy: k.seenBy } : null, scene: k ? k.scene : "" };
  });
const note = (p) => {
  if (p.room !== "hall") return;
  if (peek.firstHallParty === null) peek.firstHallParty = p.party;
  if (/^Mmf/.test(p.text) && !peek.door) peek.door = p.sq;
  if ((p.cur === "bub" || p.cur === "card") && peek.said[peek.said.length - 1] !== p.text) peek.said.push(p.text);
};
// Tap through the peek until the player gets Squatch back (the sneak).
let p = await hallNow();
for (let i = 0; i < 80 && !(p.ctrl && p.sneak); i++) {
  note(p);
  if (p.room === "hall" && !p.sneak) peek.chips.add(p.chip);
  if (p.cur === "bub" || p.cur === "card" || p.cur === "wait") (await sleep(350), await tap());
  else await sleep(250);
  p = await hallNow();
}
g.check("the hall is already full when Squatch peeks", peek.firstHallParty === true, peek.firstHallParty);
g.check("he stays in his doorway for the muffled talk (only his head shows in the gap)", !!peek.door && peek.door[1] > 600, peek.door);
g.check("the goal bar is empty during the peek", [...peek.chips].every((c) => !c), [...peek.chips]);
// The sneak (party P2): the player steers Squatch to the plant.
g.check("then the player sneaks: Squatch is in his doorway with the goal to sneak to the plant", p.ctrl && !!p.sneak && p.sq[1] >= 585 && /sneak to the plant/.test(p.chip), p);
// Wait until the glancer looks across the lane, then step into his sight.
for (let i = 0; i < 80 && !(p.sneak && p.sneak.glance === "look"); i++) (await sleep(100), (p = await hallNow()));
await page.evaluate(() => ((window.__ss.op.sq.x = 455), (window.__ss.op.sq.y = 500)));
await sleep(150);
p = await hallNow();
// Brian, 2026-11-22: the watcher shows "?" first, and "!" only if Squatch stays in sight too long.
g.check('stepping out while he looks: a "?" first, not caught yet', !!p.sneak && p.sneak.seenBy === "backpack" && !p.sneak.alarm, p.sneak);
for (let i = 0; i < 20 && p.sneak && !p.sneak.alarm; i++) (await sleep(100), (p = await hallNow()));
g.check("staying in his sight: Squatch is seen and the alarm starts (the one capture rule)", !!p.sneak && p.sneak.alarm === "shout", p.sneak);
// Hold ↺: the sneak starts over in his doorway (tests/party-scenes.mjs plays the whole alarm).
await page.evaluate(() => window.__ss.sectionReset());
await sleep(400);
p = await hallNow();
g.check("then Squatch is back in his doorway to try again", p.ctrl && !!p.sneak && !p.sneak.alarm && p.sq[1] >= 585, p);
// Now go while he faces the stage: up and left to the plant.
for (let i = 0; i < 80 && !(p.sneak && p.sneak.glance === "stage"); i++) (await sleep(100), (p = await hallNow()));
await page.keyboard.down("ArrowLeft");
let hideBtn = false;
for (let i = 0; i < 30; i++) {
  hideBtn = await page.evaluate(() => !!(window.__ss.op.act && window.__ss.op.act.verb === "HIDE"));
  if (hideBtn) break;
  i === 3 && (await page.keyboard.down("ArrowUp"));
  await sleep(80);
}
await page.keyboard.up("ArrowUp");
await page.keyboard.up("ArrowLeft");
p = await hallNow();
g.check("near the plant the button says HIDE", hideBtn, p);
await page.keyboard.press("KeyE");
for (let i = 0; i < 20 && p.pose !== "hidden"; i++) (await sleep(100), (p = await hallNow()));
g.check("going while he faces the stage: Squatch hides in the plant", p.pose === "hidden" && p.scene === "P3", p);
for (let i = 0; i < 60; i++) {
  note(p);
  if (/Croc Boys/.test(p.text)) break;
  if (p.cur === "bub" || p.cur === "card" || p.cur === "wait") (await sleep(350), await tap());
  else await sleep(250);
  p = await hallNow();
}
const mm = peek.said.indexOf("Mmf mmf... mm-mmf... mmf!"),
  rb = peek.said.indexOf("Robots?"),
  wel = peek.said.findIndex((t) => /^Let's give a big hello/.test(t));
g.check("muffled talk, then Robots?, then the announcement", mm >= 0 && rb > mm && wel > rb, peek.said);
g.check("Robots? only once", peek.said.filter((t) => t === "Robots?").length === 1, peek.said);
g.check("the goal bar never says ship in scene 1", ![...chips].some((c) => /ship/i.test(c)), [...chips]);
g.check("no page errors", errors.length === 0, errors);
await g.finish("scene1-morning");
