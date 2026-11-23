/**
 * The morning, from waking up to Mops leaving (docs/BRIAN-ASKS-OPEN.md "Build next" item 1; the plan's
 * section 1 with Brian's answers of 2026-11-23). Played on a phone (375x812) with touches only.
 * - The steps come in this order, each waiting for a tap: the two cards; the room with Squatch asleep and Mops
 *   mopping (no words); the speaker's lines; Mops "Morning, Squatch."; Squatch "Party?"; the beard-wringing
 *   cutaway (two full-screen pictures); the speaker's Dog Zylan line; Mops "Floating in space! ..."; then the
 *   kid sings (SING ALONG) or walks to Mops (TALK · Mops); the goodbye; Mops walks out; "That evening…".
 * - The words are exactly the lines file's (src/modules/morning-lines.js), said by the right speaker.
 * - Nothing moves on by itself: after every card, bubble, wait and cutaway picture, six game seconds pass and
 *   the same thing is still up. The one step that follows an animation is Mops's song line, after the
 *   stand-up that the Dog Zylan tap started; the card follows the walk-out the last goodbye tap started.
 * - While each waits, the action button reads NEXT and the "tap ▸" cue is drawn.
 * - Squatch is asleep at the start and sitting up after the speaker's first line; Mops mops (head down) until
 *   he says good morning, then faces Squatch for every line; Mops is never in the rocking "sway" pose.
 * - The speaker's bubbles sit to the left of the speaker with the sound lines drawn; music notes come from the
 *   speaker once the song starts (sound off, the default, too).
 * - The cutaway covers the whole picture and its Mops is bigger than its bucket.
 * - Squatch gets out of bed smoothly (no hop, no jump between frames) and the joystick does not move him
 *   while he is asleep or sitting.
 * - SING ALONG is not offered while Mops's song line is up; then the chip reads "Squatch: sing along with Mops"
 *   and the song ending moves nothing on (no timer).
 * - Mops and Squatch never stand inside each other; Mops walks out at an even pace and the chip is hidden
 *   while he walks.
 *   node tests/morning-order.mjs
 */
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { startGame, sleep } from "./game-page.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { MORNING_LINES } = await import(pathToFileURL(join(root, "src", "modules", "morning-lines.js")).href);
const L = Object.fromEntries(MORNING_LINES.map((l) => [l.id, l]));
const g = await startGame({ port: 8971, name: "morning-order" });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };

async function openMorning() {
  const { page, errors } = await g.open("?ch=1", PHONE);
  const canvasBox = await page.evaluate(() => {
    const r = document.querySelector("canvas").getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  // A finger tap on the picture (game position x, y).
  const tapAt = async (x, y) => {
    const px = canvasBox.x + (x / 960) * canvasBox.w,
      py = canvasBox.y + (y / 640) * canvasBox.h;
    await page.touchscreen.touchStart(px, py);
    await sleep(40);
    await page.touchscreen.touchEnd();
  };
  const st = () =>
    page.evaluate(() => {
      const ss = window.__ss,
        n = ss.op,
        c = n.cur,
        beat = window.SSQ && window.SSQ.beat("ch1-morning");
      const b = document.querySelector('[role="button"]');
      const btn = b
        ? [...b.childNodes]
            .filter((x) => x.nodeType === 3 || (x.nodeType === 1 && x.tagName !== "STYLE"))
            .map((x) => x.textContent)
            .join("")
            .trim()
        : "";
      const r = b && b.getBoundingClientRect();
      return {
        k: c ? c.k : "",
        who: c && c.b ? c.b.who : "",
        text: c ? (c.b ? c.b.text : c.text || "") : "",
        style: c && c.b ? c.b.style : "",
        id: c ? c.id || "" : "",
        panel: c && c.panel !== undefined ? c.panel : null,
        ctrl: !!n.ctrl,
        chip: ss.chipNow() || "",
        btn,
        btnAt: r ? [r.x + r.width / 2, r.y + r.height / 2] : null,
        pose: n.sqPose,
        moPose: n.moPose,
        sq: [n.sq.x, n.sq.y, n.sq.f],
        mo: [n.mo.x, n.mo.y, n.mo.f],
        hop: n.hopOut,
        scene: n.scene,
        beat: beat ? beat.debug() : null,
      };
    });
  return { page, errors, tapAt, st };
}

// Marks what is up now and lets six game seconds pass; true if the same thing is still up after.
const stillAfter6s = (page) =>
  page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      c = n.cur;
    if (!c) return false;
    const mark = {};
    c.__mark = mark;
    for (let i = 0; i < 60; i++) ss.tick(0.1);
    return n.cur === c && n.cur.__mark === mark;
  });
// Draws one frame; true if the morning drew its "tap ▸" cue in it.
const cueDrawn = (page) =>
  page.evaluate(() => {
    const beat = window.SSQ && window.SSQ.beat("ch1-morning");
    if (!beat) return false;
    const before = beat.debug().cue;
    window.__ss.drawFrame();
    return beat.debug().cue > before;
  });

// Plays from the title until the song step gives control back (or something goes wrong). Each waiting card,
// bubble, wait or cutaway picture is checked and then tapped away.
async function playToSong(run, opts = {}) {
  const seen = [];
  const bad = { auto: [], next: [], cue: [], sway: [], face: [] };
  let s = await run.st();
  for (let i = 0; i < 80 && !(s.ctrl && s.chip); i++) {
    if (s.moPose === "sway") bad.sway.push(s.text || s.k);
    if (["card", "bub", "wait", "cutaway"].includes(s.k)) {
      seen.push(s);
      if (!(await stillAfter6s(run.page))) bad.auto.push(s.text || s.k + ":" + s.id);
      await sleep(150);
      const s2 = await run.st();
      if (!/NEXT$/.test(s2.btn)) bad.next.push([s.text || s.k, s2.btn]);
      if (!(await cueDrawn(run.page))) bad.cue.push(s.text || s.k + ":" + s.id + ":" + s.panel);
      if (s.k === "bub" && s.who === "mops" && Math.sign(s.sq[0] - s.mo[0]) !== s.mo[2]) bad.face.push(s.text);
      // opts.at may tap on its own (it returns true then).
      if (!(opts.at && (await opts.at(s, run)))) await run.tapAt(480, 330);
      await sleep(450);
    } else await sleep(200);
    s = await run.st();
  }
  return { seen, bad, last: s };
}

// ---------- Run A: the kid sings ----------
const A = await openMorning();
const sleepy = {};
const A1 = await playToSong(A, {
  at: async (s, run) => {
    if (s.k === "wait" && !sleepy.pose) {
      sleepy.pose = s.pose;
      sleepy.moPose = s.moPose;
      sleepy.beat = s.beat;
      // The joystick (here the arrow keys) does nothing while Squatch is asleep.
      await run.page.keyboard.down("ArrowRight");
      await sleep(500);
      await run.page.keyboard.up("ArrowRight");
      const t = await run.st();
      sleepy.after = { sq: t.sq, pose: t.pose, hop: t.hop };
    }
    if (s.k === "bub" && s.text === L["speaker-party"].text) {
      sleepy.woke = { pose: s.pose, moPose: s.moPose, fx: s.beat && s.beat.fx };
      sleepy.place = await run.page.evaluate(() => ({ b: window.__ss.lastBubble, box: window.SSQ.speakerBox() }));
      await run.page.keyboard.down("ArrowRight");
      await sleep(400);
      await run.page.keyboard.up("ArrowRight");
      const t = await run.st();
      sleepy.sitAfter = { sq: t.sq, pose: t.pose, hop: t.hop };
    }
    if (s.k === "bub" && s.text === L["mops-morning"].text) sleepy.morning = { moPose: s.moPose, mo: s.mo, sq: s.sq };
    if (s.k === "cutaway") sleepy["cut" + s.panel] = await run.page.evaluate(() => (window.__ss.drawFrame(), window.SSQ.cutaway.last()));
    if (s.k === "bub" && s.text === L["speaker-song"].text) {
      // The tap on this line starts the song and the stand-up; record the stand-up frame by frame.
      await run.tapAt(480, 330);
      sleepy.standUp = await run.page.evaluate(() => {
        const ss = window.__ss,
          n = ss.op,
          path = [];
        let fx = "";
        for (let i = 0; i < 400 && !(n.cur && n.cur.k === "bub"); i++) {
          ss.tick(1 / 60);
          path.push([n.sq.x, n.sq.y, n.sqPose, n.hopOut]);
          fx = window.SSQ.beat("ch1-morning").debug().fx;
        }
        let maxStep = 0;
        for (let i = 1; i < path.length; i++) maxStep = Math.max(maxStep, Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
        const c = n.cur;
        return { frames: path.length, maxStep, end: path[path.length - 1], hopped: path.some((p) => p[3] >= 0), fx, next: c && c.b ? c.b.text : "" };
      });
      return true;
    }
    return false;
  },
});
const order = A1.seen.map((s) => (s.k === "cutaway" ? "cutaway:" + s.id + ":" + s.panel : s.k === "wait" ? "wait" : s.k === "card" ? "card:" + s.text : s.who + ":" + s.text));
const want = [
  "card:" + L["card-jupiter"].text,
  "card:" + L["card-squatch"].text,
  "wait",
  "speaker:" + L["speaker-party"].text,
  "speaker:" + L["speaker-invite"].text,
  "mops:" + L["mops-morning"].text,
  "sq:" + L["sq-party"].text,
  "cutaway:beard:0",
  "cutaway:beard:1",
  "speaker:" + L["speaker-song"].text,
];
g.check("the morning comes in Brian's order, word for word from the lines file", JSON.stringify(order.slice(0, want.length)) === JSON.stringify(want), order);
g.check("then Mops: Floating in space! It's our favorite song!", sleepy.standUp && sleepy.standUp.next === L["mops-song"].text, sleepy.standUp);
g.check("nothing moves on by itself (six seconds after each step, the same step is up)", A1.bad.auto.length === 0, A1.bad.auto);
g.check("the action button reads NEXT while each step waits", A1.bad.next.length === 0, A1.bad.next);
g.check('the "tap ▸" cue is drawn while each step waits', A1.bad.cue.length === 0, A1.bad.cue);
g.check("Squatch is asleep and Mops mops (head down) at the start", sleepy.pose === "sleep" && sleepy.moPose === "mop", sleepy);
g.check("the joystick does not move Squatch while he is asleep", !!sleepy.after && sleepy.after.pose === "sleep" && sleepy.after.hop < 0 && Math.abs(sleepy.after.sq[0] - 205) < 1, sleepy.after);
g.check("the speaker's line wakes him: Squatch sits up, Mops keeps mopping, sound lines at the speaker", !!sleepy.woke && sleepy.woke.pose === "sit" && sleepy.woke.moPose === "mop" && sleepy.woke.fx === "lines", sleepy.woke);
g.check("the joystick does not move Squatch while he sits in bed (no hop)", !!sleepy.sitAfter && sleepy.sitAfter.pose === "sit" && sleepy.sitAfter.hop < 0, sleepy.sitAfter);
{
  const p = sleepy.place || {},
    b = p.b,
    k = p.box;
  const left = b && k && b.x + b.w <= k.x0 && b.y < k.y1 && b.y + b.h > k.y0 - 40;
  g.check("the speaker's bubble sits to the left of the speaker, level with it", !!left, p);
}
g.check("Mops stops mopping and faces Squatch to say good morning", !!sleepy.morning && sleepy.morning.moPose === "stand" && sleepy.morning.mo[2] === -1, sleepy.morning);
g.check("Mops faces Squatch for every line he says", A1.bad.face.length === 0, A1.bad.face);
for (const p of [0, 1]) {
  const c = sleepy["cut" + p];
  g.check(`cutaway picture ${p + 1} covers the whole picture`, !!c && c.full === true && c.id === "beard" && c.panel === p, c);
  g.check(`in cutaway picture ${p + 1} Mops is bigger than the bucket`, !!c && c.mops.h > c.bucket.h && c.mops.w > c.bucket.w, c);
}
g.check(
  "Squatch gets out of bed smoothly, ending on the floor in front of the bed, no hop",
  !!sleepy.standUp && sleepy.standUp.maxStep < 6 && !sleepy.standUp.hopped && sleepy.standUp.end[2] === "stand" && sleepy.standUp.end[1] > 540,
  sleepy.standUp,
);
g.check("music notes come from the speaker once the song starts (sound is off)", !!sleepy.standUp && sleepy.standUp.fx === "notes", sleepy.standUp);
g.check("Mops never rocks (no sway pose)", A1.bad.sway.length === 0, A1.bad.sway);
const songUp = A1.seen.find((s) => s.text === L["mops-song"].text);
g.check("SING ALONG is not offered while Mops's song line is up", !!songUp && !/SING/.test(songUp.btn), songUp && songUp.btn);
let s = A1.last;
g.check("then the kid has control and the chip says: Squatch: sing along with Mops", s.ctrl && s.chip === L["chip-sing"].text, s);
g.check("the action button reads SING ALONG", s.btn.replace(/^!/, "") === L["button-sing"].text, s.btn);
g.check("the notes keep coming while the song plays", s.beat && s.beat.fx === "notes", s.beat);
const wait40 = await A.page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  for (let i = 0; i < 400; i++) ss.tick(0.1);
  return { ctrl: n.ctrl, cur: n.cur ? n.cur.k : "", mo: n.moPose };
});
g.check("the song ending moves nothing on (40 seconds later the kid still has control, no bubble)", wait40.ctrl && !wait40.cur && wait40.mo === "stand", wait40);
// Sing.
s = await A.st();
await A.page.touchscreen.tap(s.btnAt[0], s.btnAt[1]);
await sleep(500);
const sung = [];
let atSing = null,
  walk = null;
for (let i = 0; i < 40; i++) {
  s = await A.st();
  if (s.moPose === "sway") A1.bad.sway.push(s.text);
  if (s.k === "bub" && sung[sung.length - 1] !== s.text) {
    sung.push(s.text);
    if (s.text === L["sq-sing"].text) atSing = s;
    if (s.who === "mops" && Math.sign(s.sq[0] - s.mo[0]) !== s.mo[2]) A1.bad.face.push(s.text);
    const still = await stillAfter6s(A.page);
    still || A1.bad.auto.push(s.text);
    if (s.text === L["mops-stay"].text) {
      await A.tapAt(480, 330);
      // The walk out, frame by frame.
      walk = await A.page.evaluate(() => {
        const ss = window.__ss,
          n = ss.op,
          path = [];
        let chips = new Set();
        for (let i = 0; i < 600 && n.moPose !== "hidden"; i++) {
          ss.tick(1 / 60);
          path.push([n.mo.x, n.mo.y]);
          chips.add(ss.chipNow() || "");
        }
        let maxStep = 0;
        for (let i = 1; i < path.length; i++) maxStep = Math.max(maxStep, Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
        return { frames: path.length, maxStep, gone: n.moPose === "hidden", chips: [...chips], cur: n.cur ? n.cur.text || n.cur.k : "" };
      });
      break;
    }
    await A.tapAt(480, 330);
    await sleep(400);
  } else await sleep(200);
}
g.check("singing: Squatch's line, Mops's answer, then the goodbye", JSON.stringify(sung) === JSON.stringify([L["sq-sing"].text, L["mops-sing"].text, L["mops-work"].text, L["mops-stay"].text]), sung);
g.check("Squatch sings where he stands, facing Mops", !!atSing && atSing.pose === "sing" && Math.sign(atSing.mo[0] - atSing.sq[0]) === atSing.sq[2] && Math.abs(atSing.sq[0] - s.sq[0]) < 1, atSing);
g.check("Mops and Squatch are not inside each other while they sing", !!atSing && Math.hypot(atSing.mo[0] - atSing.sq[0], atSing.mo[1] - atSing.sq[1]) >= 46, atSing);
g.check("Mops walks out at an even pace (no jump) and is gone", !!walk && walk.gone && walk.maxStep < 4, walk);
g.check("the chip is hidden while he walks out", !!walk && walk.chips.every((c) => !c), walk);
g.check("Mops never rocks while singing or leaving", A1.bad.sway.length === 0, A1.bad.sway);
let evening = false;
for (let i = 0; i < 30; i++) {
  s = await A.st();
  if (s.k === "card" && s.text === L["card-evening"].text) {
    evening = true;
    const still = await stillAfter6s(A.page);
    still || A1.bad.auto.push(s.text);
    await A.tapAt(480, 330);
    await sleep(400);
    continue;
  }
  if (s.ctrl && /peek/.test(s.chip)) break;
  await sleep(200);
}
g.check('then the "That evening…" card, then the peek goal', evening && s.ctrl && /peek out the door/.test(s.chip), s);
g.check("the card waited for a tap too", A1.bad.auto.length === 0, A1.bad.auto);
g.check("the morning beat is finished once the evening starts", s.beat && s.beat.step === "", s.beat);
g.check("no page errors (sing run)", A.errors.length === 0, A.errors);

// ---------- Run B: the kid does not sing; walks to Mops and talks ----------
const B = await openMorning();
const B1 = await playToSong(B);
s = B1.last;
g.check("talk run: control at the song step", s.ctrl && s.chip === L["chip-sing"].text, s);
// Tap the floor beside Mops to walk there.
let talkBtn = "";
for (let i = 0; i < 30 && !/TALK/.test(talkBtn); i++) {
  if (i % 6 === 0) await B.tapAt(s.mo[0] - 90, s.mo[1] + 10);
  await sleep(250);
  const t = await B.st();
  talkBtn = t.btn;
  s = t;
}
g.check("beside Mops the action button reads TALK · Mops", talkBtn.replace(/^!/, "") === L["button-talk"].text, talkBtn);
g.check("walking up to Mops, Squatch does not stand inside him", Math.hypot(s.mo[0] - s.sq[0], s.mo[1] - s.sq[1]) >= 46, [s.sq, s.mo]);
await B.page.touchscreen.tap(s.btnAt[0], s.btnAt[1]);
await sleep(500);
const talked = [];
for (let i = 0; i < 30; i++) {
  const t = await B.st();
  if (t.k === "bub" && talked[talked.length - 1] !== t.text) {
    talked.push(t.text);
    if (t.who === "mops" && Math.sign(t.sq[0] - t.mo[0]) !== t.mo[2]) B1.bad.face.push(t.text);
    if (t.text === L["mops-stay"].text) break;
    await B.tapAt(480, 330);
    await sleep(400);
  } else await sleep(200);
}
g.check("TALK · Mops goes straight to his goodbye (no singing)", JSON.stringify(talked) === JSON.stringify([L["mops-work"].text, L["mops-stay"].text]), talked);
g.check("talk run: Mops faces Squatch for every line", B1.bad.face.length === 0, B1.bad.face);
g.check("no page errors (talk run)", B.errors.length === 0, B.errors);
await g.finish("morning-order");
