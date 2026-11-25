/**
 * The morning, from waking up to Mops leaving (docs/BRIAN-ASKS-OPEN.md "Build next" item 1; the plan's
 * section 1 with Brian's answers of 2026-11-23). Played on a phone (375x812) with touches only.
 * - The steps come in this order, each waiting for a tap: the two cards; the room with Squatch asleep and Mops
 *   mopping round his loop (no words; tests/morning-mop-loop.mjs has the loop and a tap at each point of it; here
 *   the tap comes as he is back at the door end); the speaker's ding-dong, then its lines; Mops "Morning,
 *   Squatch."; Squatch "Party?"; Mops mopping along the floor to his bucket, a wet streak behind him (21a); the
 *   beard-wringing cutaway (two full-screen pictures); the speaker's Dog Zylan line; Mops "Floating in space! ..."; then the
 *   kid sings (SING ALONG) or walks to Mops (TALK · Mops); the goodbye; Mops walks out; home alone (the homework,
 *   tests/home-alone.mjs); "That evening…".
 * - The words are exactly the lines file's (src/modules/morning-lines.js), said by the right speaker.
 * - Nothing with words or something to tap moves on by itself: after every card, bubble, wait and cutaway picture
 *   that has words or a tap target, six game seconds pass and the same thing is still up. The one step that
 *   follows an animation is Mops's song line, after the stand-up that the Dog Zylan tap started; the card
 *   follows the walk-out the last goodbye tap started.
 * - Brian 30a (2026-11-24): a cutaway picture with no words and nothing to tap (the dunk, the homework desk)
 *   plays by itself and moves on within 4 seconds (2 at least), a tap does not skip it, and the big button is
 *   dimmed meanwhile (no NEXT). The wringing picture (a beard to tap) and the homework sheet (words) wait.
 * - Brian 31a: in the wringing picture the beard glows; a tap on it makes it squirt, the water is drawn flying
 *   and landing; then Mops says "Hey, stop that!" over the close-up (bubble beside his head, not on his face),
 *   once; the close-up comes back and waits for NEXT; another tap squirts again with no second line.
 * - While each waits, the action button reads NEXT and no "tap ▸" cue is drawn (Brian 18a: "just next").
 * - Squatch is asleep at the start and sitting up after the speaker's first line; Mops mops (head down) until
 *   he says good morning, then faces Squatch for every line; Mops is never in the rocking "sway" pose.
 * - The speaker's bubbles sit to the left of the speaker with the sound lines drawn; music notes come from the
 *   speaker once the song starts (sound off, the default, too).
 * - The cutaway covers the whole picture and its Mops is bigger than its bucket; he is on model (thin outlines,
 *   white legs, pink nose; mops-approved-nov8.png).
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
const g = await startGame({ port: 8976, name: "morning-order" });
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
        auto: (c && c.auto) || 0,
        btnDim: b ? +getComputedStyle(b).opacity : 1,
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
// Draws one frame; true if a "tap ▸" cue (any canvas text starting with "tap") was drawn in it.
const cueDrawn = (page) =>
  page.evaluate(() => {
    const P = CanvasRenderingContext2D.prototype,
      fill = P.fillText,
      seen = [];
    P.fillText = function (t, ...a) {
      seen.push(String(t));
      return fill.call(this, t, ...a);
    };
    try {
      window.__ss.drawFrame();
    } finally {
      P.fillText = fill;
    }
    return seen.some((t) => /^tap\b/i.test(t));
  });

// Brian 30a: a cutaway picture that plays by itself. A tap at its start must not skip it; then the game clock
// runs until it moves on. Returns how long it stayed up and what came next.
const playsAlone = (page) =>
  page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      c = n.cur,
      el0 = c.el || 0;
    ss.opTap();
    const skipped = n.cur !== c;
    let t = 0;
    for (; t < 8 && n.cur === c; t += 0.05) ss.tick(0.05);
    // The next step comes up on the next frame.
    ss.tick(0.05);
    return { skipped, t: Math.round((el0 + t) * 100) / 100, gone: n.cur !== c, next: n.cur ? n.cur.k + ":" + (n.cur.id || (n.cur.b && n.cur.b.text) || "") + ":" + (n.cur.panel ?? "") : "" };
  });

// Draws the cutaway picture up now and reads it: what cutaway.js says it drew, the longest dark run across Mops's
// legs, his nose colour, and (Brian 31a) whether a yellow glow is drawn just left of the beard.
const cutShot = (page) =>
  page.evaluate(() => {
    window.__ss.drawFrame();
    const last = window.SSQ.cutaway.last(),
      cv = document.querySelector("canvas"),
      k = cv.width / 960,
      px = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
    const rgb = (x, y) => {
      const i = (Math.round(y * k) * cv.width + Math.round(x * k)) * 4;
      return [px[i], px[i + 1], px[i + 2]];
    };
    // Across his legs (40 px above the floor line, left of the bucket): the longest run of outline-dark pixels.
    let run = 0,
      longest = 0;
    for (let x = 0; x < 480; x += 1 / k) {
      const [r, g, b] = rgb(x, 600);
      run = r < 80 && g < 80 && b < 90 ? run + 1 / k : 0;
      longest = Math.max(longest, run);
    }
    // The beard lit pale yellow (not white, not the bucket's deep yellow), above the bucket's rim.
    const beard = window.SSQ.beat("ch1-morning").debug().beard;
    let yellow = 0;
    for (let y = beard.y0; y < 450; y += 4)
      for (let x = beard.x0; x < beard.x1; x += 2) {
        const [r, g, b] = rgb(x, y);
        r > 235 && g > 215 && b > 120 && b < 215 && yellow++;
      }
    const n = last.mops.nose;
    return { ...last, legInk: longest, noseRgb: rgb(n.x, n.y), beard, yellow };
  });

// Plays from the title until the song step gives control back (or something goes wrong). Each waiting card,
// bubble, wait or cutaway picture is checked and then tapped away; a picture that plays by itself is watched.
async function playToSong(run, opts = {}) {
  const seen = [];
  const bad = { auto: [], next: [], cue: [], sway: [], face: [] };
  const alone = [];
  let s = await run.st();
  for (let i = 0; i < 80 && !(s.ctrl && s.chip); i++) {
    if (s.moPose === "sway") bad.sway.push(s.text || s.k);
    if (s.k === "cutaway" && s.auto) {
      seen.push(s);
      opts.at && (await opts.at(s, run));
      alone.push({ id: s.id, panel: s.panel, btn: s.btn, dim: s.btnDim, ...(await playsAlone(run.page)) });
      s = await run.st();
      continue;
    }
    if (["card", "bub", "wait", "cutaway"].includes(s.k)) {
      seen.push(s);
      if (!(await stillAfter6s(run.page))) bad.auto.push(s.text || s.k + ":" + s.id);
      await sleep(150);
      const s2 = await run.st();
      if (!/NEXT$/.test(s2.btn)) bad.next.push([s.text || s.k, s2.btn]);
      if (await cueDrawn(run.page)) bad.cue.push(s.text || s.k + ":" + s.id + ":" + s.panel);
      if (s.k === "bub" && s.who === "mops" && Math.sign(s.sq[0] - s.mo[0]) !== s.mo[2]) bad.face.push(s.text);
      // opts.at may tap on its own (it returns true then).
      if (!(opts.at && (await opts.at(s, run)))) await run.tapAt(480, 330);
      await sleep(450);
    } else await sleep(200);
    s = await run.st();
  }
  return { seen, bad, alone, last: s };
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
      // Mops goes round his mopping loop while the room waits (src/modules/mop-loop.js), so the test chooses
      // when to tap: as he comes back to the door end of his stretch, a full stretch from his bucket.
      sleepy.tapAt = await run.page.evaluate(() => {
        const ss = window.__ss,
          n = ss.op,
          lp = () => window.SSQ.beat("ch1-morning").debug().loop;
        for (let i = 0; i < 1500 && !(lp() && lp().round >= 1 && lp().ph === "down"); i++) ss.tick(1 / 30);
        return { ph: lp() && lp().ph, k: n.cur ? n.cur.k : "", mo: [n.mo.x, n.mo.y], pose: n.sqPose };
      });
      // Brian 20a: the tap on the sleeping room rings the speaker's ding-dong first; its words come after it.
      await run.tapAt(480, 330);
      sleepy.ding = await run.page.evaluate(() => {
        const ss = window.__ss,
          n = ss.op;
        let t = 0,
          fx = "";
        for (let i = 0; i < 300 && !(n.cur && n.cur.k === "bub"); i++) {
          ss.tick(1 / 60);
          t += 1 / 60;
          fx = fx || window.SSQ.beat("ch1-morning").debug().fx;
        }
        return { t, fx, who: n.cur && n.cur.b ? n.cur.b.who : "" };
      });
      return true;
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
    if (s.k === "bub" && s.text === L["sq-party"].text) {
      // Brian 21a: the tap on "Party?" sends Mops mopping along the floor to his bucket; then the close-up.
      await run.tapAt(480, 330);
      // While he mops there is nothing to tap: the big button is dimmed and says nothing new (not a live ACTION).
      await sleep(250);
      sleepy.mopButton = await run.page.evaluate(() => {
        const b = document.querySelector('[role="button"]');
        return { step: window.__ss.op.ch1Morning && window.__ss.op.ch1Morning.step, opacity: +getComputedStyle(b).opacity, label: b.getAttribute("aria-label") };
      });
      sleepy.mopping = await run.page.evaluate(() => {
        const ss = window.__ss,
          n = ss.op,
          path = [];
        for (let i = 0; i < 900 && !(n.cur && n.cur.k === "cutaway"); i++) {
          ss.tick(1 / 60);
          path.push([n.mo.x, n.mo.y, n.moPose, !!n.mo.moving, n.mo.f]);
        }
        let maxStep = 0;
        for (let i = 1; i < path.length; i++) maxStep = Math.max(maxStep, Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
        const xs = path.map((p) => p[0]);
        const d = window.SSQ.beat("ch1-morning").debug();
        return {
          frames: path.length,
          moved: Math.max(...xs) - Math.min(...xs),
          maxStep,
          poses: [...new Set(path.map((p) => p[2]))],
          walked: path.filter((p) => p[3]).length,
          faces: [...new Set(path.slice(0, -1).map((p) => p[4]))],
          end: path[path.length - 1],
          wet: d.wet,
          cut: !!(n.cur && n.cur.k === "cutaway" && n.cur.panel === 0),
        };
      });
      return true;
    }
    if (s.k === "cutaway" && s.panel === 1 && !sleepy.stop) {
      // Brian 31a: the glowing beard, tapped. First what the picture draws before the tap.
      sleepy.cut1 = await cutShot(run.page);
      const b = sleepy.cut1.beard;
      await run.tapAt((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
      // An impatient tap elsewhere and a NEXT while the water flies must not lose his line.
      await run.tapAt(150, 150);
      sleepy.impatient = await run.page.evaluate(() => (window.__ss.opTap(), window.__ss.op.cur && window.__ss.op.cur.k));
      sleepy.stop = await run.page.evaluate(() => {
        const ss = window.__ss,
          n = ss.op,
          frames = [];
        for (let i = 0; i < 120 && !(n.cur && n.cur.k === "bub"); i++) {
          ss.tick(1 / 60);
          ss.drawFrame();
          const l = window.SSQ.cutaway.last();
          frames.push({ splat: !!l.splat, glow: l.glow });
        }
        ss.drawFrame();
        const c = n.cur,
          hud = [...document.querySelectorAll("#ss-hud > *, [data-hud]")].filter((x) => x.offsetParent && getComputedStyle(x).visibility !== "hidden").length;
        return {
          frames: frames.length,
          landed: frames.some((f) => f.splat),
          glowAfter: frames.length ? frames[frames.length - 1].glow : null,
          k: c ? c.k : "",
          who: c && c.b ? c.b.who : "",
          text: c && c.b ? c.b.text : "",
          over: !!(c && c.over && c.over.k === "cutaway" && c.over.panel === 1),
          drawn: window.SSQ.cutaway.last(),
          bubble: window.__ss.lastBubble,
          squirt: window.SSQ.beat("ch1-morning").debug().squirt,
        };
      });
      // NEXT on the line: the close-up comes back and waits; another tap on the beard squirts with no second line.
      await run.tapAt(150, 150);
      await sleep(400);
      sleepy.back = await run.st();
      sleepy.backStill = await stillAfter6s(run.page);
      await run.tapAt((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
      sleepy.again = await run.page.evaluate(() => {
        const ss = window.__ss,
          n = ss.op,
          kinds = new Set();
        for (let i = 0; i < 180; i++) (ss.tick(1 / 60), kinds.add(n.cur ? n.cur.k : ""));
        return { kinds: [...kinds], squirt: window.SSQ.beat("ch1-morning").debug().squirt };
      });
      return false;
    }
    if (s.k === "cutaway") sleepy["cut" + s.panel] = await cutShot(run.page);
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
g.check("nothing with words or a tap target moves on by itself (six seconds after each such step, the same step is up)", A1.bad.auto.length === 0, A1.bad.auto);
{
  // Brian 30a: the dunk has no words and nothing to tap, so it plays by itself; the wringing picture (31a) waits.
  const d = A1.alone;
  g.check("Brian 30a: the dunk picture (no words, nothing to tap) is the only morning picture that plays by itself", d.length === 1 && d[0].id === "beard" && d[0].panel === 0, d);
  g.check("Brian 30a: it moves on by itself after 2 to 4 seconds, to the wringing picture", !!d[0] && d[0].gone && d[0].t >= 2 && d[0].t <= 4 && d[0].next === "cutaway:beard:1", d[0]);
  g.check("Brian 30a: a tap does not skip it (it plays to its end)", !!d[0] && !d[0].skipped, d[0]);
  g.check("Brian 30a: meanwhile the big button is dimmed and does not say NEXT", !!d[0] && !/NEXT/.test(d[0].btn) && d[0].dim < 0.6, d[0]);
}
{
  // Brian 31a: the beard in the wringing picture glows, squirts when tapped, and Mops says "Hey, stop that!".
  const c1 = sleepy.cut1,
    st = sleepy.stop,
    back = sleepy.back,
    again = sleepy.again;
  g.check("Brian 31a: in the wringing picture the beard glows (drawn lit pale yellow) before it is tapped", !!c1 && c1.glow && c1.yellow > 100, c1 && { glow: c1.glow, yellow: c1.yellow });
  g.check("Brian 31a: a tap on the beard makes it squirt, and the water is drawn landing on the floor", !!st && st.landed && !!st.squirt && st.squirt.taps === 1, st && { landed: st.landed, squirt: st.squirt });
  g.check('Brian 31a: then Mops says, word for word, "Hey, stop that!" over the close-up', !!st && st.k === "bub" && st.who === "mops" && st.text === L["mops-stop"].text && st.over && st.drawn.id === "beard" && st.drawn.panel === 1, st);
  g.check(
    "Brian 31a: his line waits until the water has landed (about two thirds of a second), and taps meanwhile do not lose it",
    !!st && !!st.squirt && st.drawn.t - st.squirt.at >= 0.6 && st.drawn.t - st.squirt.at < 1 && sleepy.impatient === "until",
    st && { wait: st.drawn.t - (st.squirt || {}).at, impatient: sleepy.impatient },
  );
  const bub = st && st.bubble,
    face = { x0: 400, x1: 670, y0: 100, y1: 380 };
  g.check(
    "Brian 31a: the bubble sits beside his head over the wall, not on his face or horns, inside the picture",
    !!bub && bub.text === L["mops-stop"].text && (bub.x >= face.x1 || bub.x + bub.w <= face.x0 || bub.y + bub.h <= face.y0) && bub.x + bub.w <= 960 && bub.y >= 0,
    bub,
  );
  g.check("Brian 31a: after the line the close-up comes back and waits for NEXT", !!back && back.k === "cutaway" && back.panel === 1 && sleepy.backStill && /NEXT$/.test(back.btn), { back, still: sleepy.backStill });
  g.check("Brian 31a: once tapped the beard stops glowing (the next thing is NEXT)", !!st && st.glowAfter === false, st && st.glowAfter);
  g.check("Brian 31a: another tap squirts again, with no second line", !!again && again.squirt.taps === 2 && !again.kinds.includes("bub") && again.kinds.every((k) => k === "cutaway"), again);
}
g.check("the action button reads NEXT while each step waits", A1.bad.next.length === 0, A1.bad.next);
g.check('Brian 18a: no "tap ▸" cue is drawn while a step waits (just NEXT)', A1.bad.cue.length === 0, A1.bad.cue);
g.check(
  "Brian 20a: the tap on the sleeping room rings the speaker's ding-dong (sound lines at the speaker) before its first words",
  !!sleepy.ding && sleepy.ding.t >= 0.8 && sleepy.ding.t < 2.5 && sleepy.ding.fx === "lines" && sleepy.ding.who === "speaker",
  sleepy.ding,
);
{
  const m = sleepy.mopping;
  g.check("Brian 21a: after \"Party?\" Mops mops a few steps along the floor, head down, legs walking, beard sweeping", !!m && m.moved >= 100 && m.poses.length === 1 && m.poses[0] === "mop" && m.walked > 30 && m.maxStep < 4, m);
  g.check("Brian 21a: he mops toward his bucket, facing it, and ends beside it", !!m && m.faces.length === 1 && m.faces[0] === -1 && Math.abs(m.end[0] - 690) < 1 && Math.abs(m.end[1] - 560) < 1, m);
  g.check("Brian 21a: a wet streak is left behind him on the floor", !!m && !!m.wet && m.wet.x1 - m.wet.x0 >= 100 && m.wet.y > 540, m && m.wet);
  g.check("Brian 21a: then the beard-wringing close-up comes straight after", !!m && m.cut, m);
  const mb = sleepy.mopButton;
  g.check("while Mops mops, the big button is dimmed with nothing to tap", !!mb && mb.step === "mopping" && mb.opacity < 0.6 && mb.label === "Action", mb);
}
g.check("Squatch is asleep and Mops mops (head down) at the start", sleepy.pose === "sleep" && sleepy.moPose === "mop", sleepy);
g.check("the quiet room is still waiting, Squatch asleep, when Mops has gone once round his loop", !!sleepy.tapAt && sleepy.tapAt.k === "wait" && sleepy.tapAt.pose === "sleep" && sleepy.tapAt.ph === "down" && Math.abs(sleepy.tapAt.mo[0] - 830) < 1, sleepy.tapAt);
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
  // Brian 2026-11-23: the close-up drew Mops off-model (outlines scaled up, legs like stripes, no nose).
  g.check(`in cutaway picture ${p + 1} Mops's outlines are thin, like the approved picture (5 px or less)`, !!c && c.mops.outline > 0 && c.mops.outline <= 5, c && c.mops);
  g.check(`in cutaway picture ${p + 1} his legs are white with thin outlines, not dark stripes`, !!c && c.legInk > 0 && c.legInk <= 8, c && c.legInk);
  {
    const [r, gg, b] = (c && c.noseRgb) || [0, 0, 0];
    g.check(`in cutaway picture ${p + 1} he has his pink nose`, r > 220 && gg > 140 && gg < 200 && b > 160 && b < 210, c && c.noseRgb);
  }
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
          // Once he is out of the door, home alone begins with its own goal (tests/home-alone.mjs).
          n.moPose !== "hidden" && chips.add(ss.chipNow() || "");
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
// Home alone (tests/home-alone.mjs has the details): the homework at the desk, then "That evening…".
await sleep(300);
s = await A.st();
g.check("once Mops is gone Squatch is home alone, with his homework as the goal", s.ctrl && !s.k && s.chip === "Squatch: do your homework", s);
await A.page.evaluate(() => (window.__ss.spotsNow() || []).find((x) => x.id === "homework").f());
await sleep(100);
// Brian 30a: the desk picture (no words, nothing to tap) plays by itself; the sheet (words to read) waits.
s = await A.st();
const desk = s.k === "cutaway" && s.id === "homework" && s.panel === 0 && s.auto ? { btn: s.btn, dim: s.btnDim, ...(await playsAlone(A.page)) } : { s };
g.check("Brian 30a: the homework desk picture plays by itself and moves on after 2 to 4 seconds, to the sheet", desk.gone && desk.t >= 2 && desk.t <= 4 && desk.next === "cutaway:homework:1" && !desk.skipped, desk);
g.check("Brian 30a: meanwhile the big button is dimmed and does not say NEXT", !/NEXT/.test(desk.btn || "NEXT") && desk.dim < 0.6, desk);
s = await A.st();
g.check("Brian 30a: the homework sheet (words to read) waits: six seconds later it is still up", s.k === "cutaway" && s.panel === 1 && !s.auto && (await stillAfter6s(A.page)), s);
for (let i = 0; i < 10; i++) {
  s = await A.st();
  if (s.k !== "cutaway") break;
  await A.tapAt(480, 330);
  await sleep(400);
}
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
// The step restart (hold ↺) in the evening keeps the evening: Mops does not come back for the song.
const holdRestart = (page) =>
  page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    ss.resetHold(true);
    for (let i = 0; i < 20; i++) ss.tick(0.05);
    ss.resetHold(false);
    for (let i = 0; i < 4; i++) ss.tick(0.05);
    const c = n.cur;
    const d = window.SSQ.beat("ch1-morning").debug();
    return { k: c ? c.k : "", step: n.ch1Morning ? n.ch1Morning.step : "", pose: n.sqPose, moPose: n.moPose, peek: ((window.SSQ.beat("ch1-party").now() || {}).scene === "P1"), chip: ss.chipNow(), ctrl: n.ctrl, walking: !!n.mo.walking, wet: d.wet, mo: [Math.round(n.mo.x), Math.round(n.mo.y)] };
  });
// Taps through the morning until the beat's step is `step` (and, if given, a `k` step is up); returns what is up then.
const tapUntilStep = (page, step, k) =>
  page.evaluate(
    (step, k) => {
      const ss = window.__ss,
        n = ss.op,
        ok = () => n.ch1Morning && n.ch1Morning.step === step && (!k || (n.cur && n.cur.k === k));
      for (let i = 0; i < 2000 && !ok(); i++) {
        if (n.cur && ["card", "bub", "wait", "cutaway"].includes(n.cur.k)) ((n.bt = 1), ss.opTap());
        ss.tick(1 / 30);
      }
      return { step: n.ch1Morning ? n.ch1Morning.step : "", k: n.cur ? n.cur.k : "" };
    },
    step,
    k || "",
  );
const asleepAgain = (r) => r.k === "wait" && r.step === "asleep" && r.pose === "sleep" && r.moPose === "mop" && !r.wet && r.mo[0] === 830 && r.mo[1] === 560;
const eveRestart = await holdRestart(A.page);
g.check("↺ in the evening keeps the evening (no song step, Mops stays gone)", eveRestart.step === "" && eveRestart.moPose === "hidden" && eveRestart.peek && /peek/.test(eveRestart.chip), eveRestart);
g.check("no page errors (sing run)", A.errors.length === 0, A.errors);

// ---------- Run C: hold ↺ in the middle of the morning ----------
{
  const C = await openMorning();
  let c = await C.st();
  for (let i = 0; i < 20 && !(c.k === "bub" && c.text === L["mops-morning"].text); i++) {
    await C.tapAt(480, 330);
    await sleep(450);
    c = await C.st();
  }
  const r = await holdRestart(C.page);
  g.check("↺ before the song plays the morning again from the room (no cards): Squatch asleep, Mops mopping, waiting for a tap", r.k === "wait" && r.step === "asleep" && r.pose === "sleep" && r.moPose === "mop", r);
  // Brian 21a's new steps: ↺ while Mops mops along the floor, and on the beard close-up, starts the room again
  // (Mops back where he mops at first, no wet streak left, no cards).
  const atMop = await tapUntilStep(C.page, "mopping");
  const rMop = await holdRestart(C.page);
  g.check("↺ while Mops mops along the floor (21a) plays the morning again from the room, with no wet streak left", atMop.step === "mopping" && asleepAgain(rMop), { atMop, rMop });
  const atCut = await tapUntilStep(C.page, "mopped", "cutaway");
  const rCut = await holdRestart(C.page);
  g.check("↺ on the beard close-up plays the morning again from the room", atCut.k === "cutaway" && asleepAgain(rCut), { atCut, rCut });
  const C1 = await playToSong(C);
  g.check("after ↺ the morning still plays through to the song step", C1.last.ctrl && C1.last.chip === L["chip-sing"].text && C1.seen.every((x) => x.k !== "card"), C1.last);
  // ↺ during Mops's walk out brings back the song step at most, with Mops solid again.
  await C.page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    (ss.spotsNow() || []).find((x) => x.id === "sing").f();
    for (let i = 0; i < 400 && !(n.ch1Morning && n.ch1Morning.step === "leave"); i++) (n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap()), ss.tick(0.05));
  });
  const w = await holdRestart(C.page);
  g.check("↺ while Mops walks out does not put the song step back", w.step !== "song" && w.chip !== L["chip-sing"].text, w);
  g.check("no page errors (↺ run)", C.errors.length === 0, C.errors);
}

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
let talkAt = null;
for (let i = 0; i < 30; i++) {
  const t = await B.st();
  if (t.k === "bub" && talked[talked.length - 1] !== t.text) {
    talked.push(t.text);
    talkAt = talkAt || { sq: t.sq, mo: t.mo };
    if (t.who === "mops" && Math.sign(t.sq[0] - t.mo[0]) !== t.mo[2]) B1.bad.face.push(t.text);
    if (t.text === L["mops-stay"].text) break;
    await B.tapAt(480, 330);
    await sleep(400);
  } else await sleep(200);
}
g.check("TALK · Mops goes straight to his goodbye (no singing)", JSON.stringify(talked) === JSON.stringify([L["mops-work"].text, L["mops-stay"].text]), talked);
g.check("talk run: Mops faces Squatch for every line", B1.bad.face.length === 0, B1.bad.face);
// Their drawings are about 160 (Mops) and 124 (Squatch) wide: 180 apart leaves a clear gap.
g.check("talk run: Squatch steps back so their drawings do not overlap while Mops talks", !!talkAt && Math.abs(talkAt.sq[0] - talkAt.mo[0]) >= 175, talkAt);
g.check("no page errors (talk run)", B.errors.length === 0, B.errors);
await g.finish("morning-order");
