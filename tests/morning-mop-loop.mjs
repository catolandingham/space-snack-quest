/**
 * The quiet room before the first tap (Brian, 2026-11-24, after watching the morning video: "It's hard to tell
 * the difference between the whistle and the squeaking. Can we make the snore and whistle a bit more prominent?
 * ... see the janitor walking around, mopping the floor with his beard ... the water on the floor kind of
 * following, and him very visually rubbing his beard back and forth to mop it ... And then walking back to the
 * bucket to squeeze it out."). Played on a phone (375x812). src/modules/mop-loop.js.
 * - While Squatch sleeps Mops goes round and round: head down at the door end, mopping along the floor to his
 *   bucket (legs walking, beard sweeping back and forth, measured in the drawn picture), a step up to the bucket,
 *   wringing his beard over it (the beard and falling drops are drawn over the painted bucket), then walking back
 *   out, and round again. The scene still waits for the tap.
 * - A wet shine follows his beard along the floor and dries from the far end (measured in the drawn picture).
 * - He never stands in the bed, on Squatch, the desk, the lunch bag or the bucket, and stays inside the picture.
 * - A tap at any point of the loop: Mops stops where he is (nobody jumps), the ding-dong, the speaker, "Morning,
 *   Squatch." (he faces Squatch, where he stood), "Party?", then he mops to his bucket from wherever he stands,
 *   on either side of it (two strokes at least, even from beside it), ends beside it facing it, and the morning
 *   plays on to the song step.
 * - Hold ↺ during the loop: the room again from the start, no shine left.
 * - Sound: the snore is clearly louder than a sleeping mop stroke; a sleeping stroke has no squeak (nothing up
 *   where the snore's whistle is); strokes play only as he mops, each at a turn of the beard; the quiet squeeze
 *   and drips play only at the bucket, each drip as a drawn drop lands; nothing with sound off.
 *   node tests/morning-mop-loop.mjs
 */
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { startGame, sleep } from "./game-page.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { MORNING_LINES } = await import(pathToFileURL(join(root, "src", "modules", "morning-lines.js")).href);
const { MORNING_PLACES } = await import(pathToFileURL(join(root, "src", "modules", "morning.js")).href);
const { MORNING_SOUND } = await import(pathToFileURL(join(root, "src", "modules", "morning-sound.js")).href);
const L = Object.fromEntries(MORNING_LINES.map((l) => [l.id, l.text]));
const g = await startGame({ port: 8996, name: "morning-mop-loop" });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
// The home room, locked picture v6, in game positions (measured from the drawn picture).
const ROOM = { left: 36, right: 926, bed: [85, 390, 290, 540], desk: [400, 268, 512, 345], bag: [440, 315, 480, 345], bucket: [536, 500, 596, 572], water: [545, 502, 586, 516] };
const FAR = MORNING_PLACES.mopFrom,
  NEAR = MORNING_PLACES.mops;

// Helpers that run in the page.
const inPage = () => {
  window.__t = {
    // Taps through the cards to the quiet room (Squatch asleep, the wait step up).
    toRoom() {
      const ss = window.__ss,
        n = ss.op;
      for (let i = 0; i < 200 && !(n.cur && n.cur.k === "wait"); i++) (n.cur && n.cur.k === "card" && ((n.bt = 1), ss.opTap()), ss.tick(1 / 30));
      return !!(n.cur && n.cur.k === "wait");
    },
    now() {
      const ss = window.__ss,
        n = ss.op,
        d = window.SSQ.beat("ch1-morning").debug();
      return { k: n.cur ? n.cur.k : "", step: d.step, x: n.mo.x, y: n.mo.y, f: n.mo.f, pose: n.moPose, moving: !!n.mo.moving, sq: [n.sq.x, n.sq.y], loop: d.loop || null, shine: d.shine || null, wet: d.wet };
    },
    // Runs the game clock until `ok(now)`; returns the frames on the way (one a tick).
    run(secs, until) {
      const ss = window.__ss,
        out = [];
      for (let t = 0; t < secs; t += 1 / 30) {
        ss.tick(1 / 30);
        const s = this.now();
        out.push(s);
        if (until && until(s)) break;
      }
      return out;
    },
    // What is drawn now, read from the picture: pixels of the beard's colour, of water blue, in a box.
    count(box, kind) {
      window.__ss.drawFrame();
      const cv = document.querySelector("canvas"),
        k = cv.width / 960,
        x0 = Math.floor(box[0] * k),
        y0 = Math.floor(box[1] * k),
        w = Math.ceil((box[2] - box[0]) * k),
        h = Math.ceil((box[3] - box[1]) * k),
        d = cv.getContext("2d").getImageData(x0, y0, w, h).data;
      let c = 0,
        minX = 1e9,
        maxX = -1;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i],
          gg = d[i + 1],
          b = d[i + 2];
        const hit = kind === "beard" ? Math.abs(r - 244) < 4 && Math.abs(gg - 245) < 4 && Math.abs(b - 248) < 4 : r < 200 && gg > 200 && b > 236;
        if (hit) {
          c++;
          const x = (x0 + ((i / 4) % w)) / k;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
        }
      }
      return { c, minX: c ? minX : null, maxX: c ? maxX : null };
    },
    // Points of the loop a test taps at.
    points: {
      mopFar: (s) => s.loop.ph === "mop" && s.x < 800 && s.x > 780,
      mopNear: (s) => s.loop.ph === "mop" && s.x < 705,
      lift: (s) => s.loop.ph === "lift",
      toBucket: (s) => s.loop.ph === "toBucket" && s.y < 552,
      wring: (s) => s.loop.ph === "wring" && s.loop.t > 1,
      back: (s) => s.loop.ph === "back" && s.x > 740,
      round2: (s) => s.loop.round === 1 && s.loop.ph === "down",
    },
    // Is the floor wet (the shine drawn) at game x on the lane's shine line?
    wetAt(x, y) {
      return this.count([x - 3, y - 3, x + 3, y + 3], "water").c > 0;
    },
  };
};

async function open(soundOn) {
  const o = await g.open("?ch=1", PHONE);
  await o.page.evaluate(() => {
    window.__ctxMade = 0;
    const A = window.AudioContext || window.webkitAudioContext;
    const W = function (...a) {
      window.__ctxMade++;
      return new A(...a);
    };
    W.prototype = A.prototype;
    window.AudioContext = W;
    window.webkitAudioContext = W;
  });
  if (soundOn) await o.page.click("#ss-sound");
  await o.page.evaluate(inPage);
  // The page's own clock must not run the loop between our steps: stop its frame callback.
  await o.page.evaluate(() => (window.requestAnimationFrame = () => 0));
  await sleep(120);
  return o;
}

// ---------- The loop, the shine, where he walks (sound off) ----------
{
  const { page, errors, ctx } = await open(false);
  const R = await page.evaluate(() => {
    const T = window.__t;
    const ok = T.toRoom();
    const start = T.now();
    const frames = [],
      shots = {};
    let wringSeen = false;
    // Two and a bit rounds, frame by frame.
    for (let i = 0; i < 30 * 45; i++) {
      window.__ss.tick(1 / 30);
      const s = T.now();
      frames.push(s);
      const lp = s.loop || {};
      // The beard's drawn end at the floor, at its two turns in the first round.
      if (lp.round === 0 && lp.ph === "mop") {
        const at = T.count([s.x - 110, s.y - 9, s.x + 10, s.y - 3], "beard");
        if (at.c) {
          const lead = s.x - at.minX;
          shots.fwd = Math.max(shots.fwd ?? -1e9, lead);
          shots.back = Math.min(shots.back ?? 1e9, lead);
        }
        // The drawn beard never reaches the painted bucket, even at its furthest out beside it.
        shots.beardOnBucket = Math.max(shots.beardOnBucket || 0, T.count([536, 500, 598, 572], "beard").c);
        shots.beardNearest = Math.min(shots.beardNearest ?? 1e9, at.c ? at.minX : 1e9);
        // Mid-way: wet behind the beard (toward the door), dry ahead of it (toward the bucket).
        if (!shots.mid && s.x < 760 && s.x > 740) shots.mid = { x: s.x, behind: T.wetAt(s.x + 30, s.y + 12), start: T.wetAt(800, s.y + 12), ahead: T.wetAt(s.x - 110, s.y + 12), shine: s.shine };
      }
      if (lp.round === 0 && lp.ph === "wring") {
        // Over the painted bucket: the beard, and drops in the air above the water.
        const beard = T.count([556, 462, 606, 500], "beard").c,
          drops = T.count([556, 484, 590, 501], "water").c;
        shots.wringBeard = Math.max(shots.wringBeard || 0, beard);
        shots.wringDrops = Math.max(shots.wringDrops || 0, drops);
        if (!wringSeen) ((wringSeen = true), (shots.atWring = { x: s.x, y: s.y, f: s.f, pose: s.pose, farWet: T.wetAt(800, 572), nearWet: T.wetAt(700, 572) }));
        shots.wringEnd = { farWet: T.wetAt(800, 572), nearWet: T.wetAt(700, 572) };
      }
      if (lp.round === 0 && lp.ph === "back" && !shots.away && s.x > 800) shots.away = { beard: T.count([556, 462, 606, 500], "beard").c, drops: T.count([556, 484, 590, 501], "water").c };
      if (lp.round === 1 && lp.ph === "down" && !shots.round2) shots.round2 = { x: s.x, y: s.y, f: s.f, anyWet: [650, 700, 750, 800].some((x) => T.wetAt(x, 572)) };
    }
    const cv = document.querySelector("canvas").getBoundingClientRect();
    return { ok, start, frames, shots, scale: cv.width / 960, end: T.now() };
  });
  const F = R.frames,
    S = R.shots;
  g.check("the quiet room: Squatch asleep, Mops at the door end of his stretch, head down", R.ok && R.start.step === "asleep" && R.start.pose === "mop" && Math.abs(R.start.x - FAR.x) < 1 && Math.abs(R.start.y - FAR.y) < 1, R.start);
  const phases = F.map((f) => (f.loop ? f.loop.ph : "?")).filter((p, i, a) => i === 0 || p !== a[i - 1]);
  g.check("Mops goes round: head down, mopping, up from the floor, to the bucket, wringing, walking back, and again", phases.slice(0, 12).join(" ") === "down mop lift toBucket wring back down mop lift toBucket wring back", phases);
  g.check("the scene still waits for the tap (45 seconds later the same wait is up, Squatch asleep)", R.end.k === "wait" && R.end.step === "asleep" && F.every((f) => f.k === "wait"), R.end);
  const mop = F.filter((f) => f.loop && f.loop.round === 0 && f.loop.ph === "mop");
  const xs = mop.map((f) => f.x);
  g.check("he mops along the floor toward his bucket: over 100 across, head down, legs walking, facing the bucket", mop.length > 60 && Math.max(...xs) - Math.min(...xs) >= 100 && mop.every((f) => f.pose === "mop" && f.f === -1) && mop.filter((f) => f.moving).length > 30 && Math.abs(Math.min(...xs) - NEAR.x) < 1, { n: mop.length, from: Math.max(...xs), to: Math.min(...xs) });
  let maxStep = 0;
  for (let i = 1; i < F.length; i++) maxStep = Math.max(maxStep, Math.hypot(F[i].x - F[i - 1].x, F[i].y - F[i - 1].y));
  g.check("he walks at an even pace all the way round (no jump between frames)", maxStep < 4, maxStep);
  const travel = (S.fwd ?? 0) - (S.back ?? 0);
  g.check("his beard sweeps back and forth on the floor, big enough to see on a phone (the drawn beard end moves over 14 px on the phone screen)", travel * R.scale >= 14, { travelGame: travel, onPhone: travel * R.scale, fwd: S.fwd, back: S.back });
  const turns = mop.map((f) => f.loop.sweep).filter((v, i, a) => i > 0 && i < a.length - 1 && ((v >= a[i - 1] && v > a[i + 1]) || (v <= a[i - 1] && v < a[i + 1]))).length;
  g.check("the beard goes back and forth several times on the way (5 turns or more)", turns >= 5, turns);
  g.check("his beard never touches the painted bucket, even swung furthest out at the end of his stretch (drawn beard measured)", S.beardOnBucket === 0 && S.beardNearest > ROOM.bucket[2] + 3 && S.beardNearest < ROOM.bucket[2] + 40, { onBucket: S.beardOnBucket, nearest: S.beardNearest, bucketEdge: ROOM.bucket[2] });
  g.check("the wet shine follows his beard: wet behind it, dry floor ahead of it", !!S.mid && S.mid.behind && S.mid.start && !S.mid.ahead, S.mid);
  g.check("the shine dries after a while, from the far end: by the end of the wring the door end is dry", !!S.atWring && S.atWring.nearWet && !!S.wringEnd && !S.wringEnd.farWet, { atWring: S.atWring, wringEnd: S.wringEnd });
  g.check("when he starts the next round the old shine has dried away", !!S.round2 && !S.round2.anyWet && Math.abs(S.round2.x - FAR.x) < 1, S.round2);
  const shines = F.filter((f) => f.shine).map((f) => f.shine);
  g.check("the shine stays on the floor of his stretch (never over the bucket or the bed)", shines.length > 100 && shines.every((s) => s.x0 > ROOM.bucket[2] + 4 && s.x1 < ROOM.right - 10 && s.y > ROOM.bucket[3] - 4 && s.y < 600), shines[0]);
  g.check("he walks back to the painted bucket and stands at it to wring, facing it", !!S.atWring && S.atWring.pose === "wring" && S.atWring.f === -1 && Math.abs(S.atWring.x - MORNING_PLACES.wring.x) < 1 && Math.abs(S.atWring.y - MORNING_PLACES.wring.y) < 1, S.atWring);
  g.check("the wring is drawn: his beard out over the painted bucket, and drops falling into it", S.wringBeard > 40 && S.wringDrops > 8, { beard: S.wringBeard, drops: S.wringDrops });
  g.check("nothing is drawn over the bucket once he has walked away", !!S.away && S.away.beard === 0 && S.away.drops === 0, S.away);
  // Where he is, every frame: his whole drawing (about 82 each side with the beard, 140 tall) and his hooves.
  const hit = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
  const bad = { bed: 0, sq: 0, desk: 0, bag: 0, bucket: 0, out: 0 };
  for (const f of F) {
    const body = [f.x - 82, f.y - 140, f.x + 82, f.y + 4],
      hooves = [f.x - 48, f.y - 34, f.x + 48, f.y + 3];
    hit(body, ROOM.bed) && bad.bed++;
    hit(body, [f.sq[0] - 75, f.sq[1] - 135, f.sq[0] + 75, f.sq[1] + 12]) && bad.sq++;
    hit(body, ROOM.desk) && bad.desk++;
    hit(body, ROOM.bag) && bad.bag++;
    hit(hooves, ROOM.bucket) && bad.bucket++;
    (body[0] < ROOM.left || body[2] > ROOM.right || f.y > 606) && bad.out++;
  }
  g.check("he never stands in the bed, on Squatch, the desk, the lunch bag or the bucket, and stays inside the picture", Object.values(bad).every((v) => v === 0), bad);
  g.check("no page errors (the loop)", errors.length === 0, errors);
  await ctx.close();
}

// ---------- A tap at any point of the loop ----------
// Plays on from the tap to the song step: every waiting step is tapped away, pictures that play alone are watched.
const playOn = (page, lines) =>
  page.evaluate((lines) => {
    const ss = window.__ss,
      n = ss.op,
      T = window.__t,
      at0 = T.now(),
      seen = [],
      path = [[n.mo.x, n.mo.y]];
    const key = () => {
      const c = n.cur;
      return !c ? "" : c.k === "bub" ? c.b.who + ":" + c.b.text : c.k === "cutaway" ? "cutaway:" + c.id + ":" + c.panel : c.k;
    };
    let morning = null,
      along = null,
      mopFrames = [];
    n.bt = 1;
    ss.opTap(); // the tap on the quiet room
    // The tap's ding-dong step runs on the next frame.
    ss.tick(1 / 30);
    ss.tick(1 / 30);
    path.push([n.mo.x, n.mo.y]);
    const stopped = T.now();
    // Half a second on (the ding-dong is still ringing): his beard is down on the floor where he stands.
    for (let i = 0; i < 14; i++) (ss.tick(1 / 30), path.push([n.mo.x, n.mo.y]));
    const held = { pose: n.moPose, beardOnBucket: T.count([536, 500, 598, 572], "beard").c, beardOnFloor: T.count([n.mo.x - 110, n.mo.y - 9, n.mo.x + 110, n.mo.y - 3], "beard").c };
    for (let i = 0; i < 6000 && !(n.ctrl && n.ch1Morning && n.ch1Morning.step === "song"); i++) {
      const k = key();
      k && seen[seen.length - 1] !== k && seen.push(k);
      const c = n.cur,
        m = n.ch1Morning;
      if (c && c.k === "bub" && c.b.text === lines.morning && !morning) morning = T.now();
      if (m && m.step === "mopping") {
        along = along || T.now();
        mopFrames.push({ pose: n.moPose, f: n.mo.f, moving: !!n.mo.moving });
      }
      if (c && (c.k === "bub" || c.k === "wait" || (c.k === "cutaway" && !c.auto)) && i % 6 === 5) ((n.bt = 1), ss.opTap());
      ss.tick(1 / 30);
      path.push([n.mo.x, n.mo.y]);
    }
    let jump = 0;
    for (let i = 1; i < path.length; i++) jump = Math.max(jump, Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
    const m = n.ch1Morning;
    return { at0, stopped, held, seen, jump, morning, along, mopFrames, end: T.now(), ctrl: !!n.ctrl, chip: ss.chipNow(), step: m ? m.step : "", wetEnd: window.SSQ.beat("ch1-morning").debug().wet };
  }, lines);

// Where in the loop the tap comes (the checks run in the page: `when` there, by name).
const POINTS = [
  ["while he mops, far from the bucket", "mopFar"],
  ["while he mops, a step from the bucket", "mopNear"],
  ["as he lifts his head beside the bucket", "lift"],
  ["on his step up to the bucket", "toBucket"],
  ["while he wrings his beard at the bucket", "wring"],
  ["while he walks back out", "back"],
  ["in his second round, head going down at the door end", "round2"],
];
const want = ["speaker:" + L["speaker-party"], "speaker:" + L["speaker-invite"], "mops:" + L["mops-morning"], "sq:" + L["sq-party"], "cutaway:beard:0", "cutaway:beard:1", "speaker:" + L["speaker-song"], "mops:" + L["mops-song"]];
for (const [name, when] of POINTS) {
  const { page, errors, ctx } = await open(false);
  const at = await page.evaluate((point) => {
    const T = window.__t,
      when = T.points[point];
    T.toRoom();
    const fr = T.run(40, (s) => !!s.loop && when(s));
    const last = fr[fr.length - 1];
    return { ...last, reached: !!last && !!last.loop && when(last) };
  }, when);
  const ok = !!at && at.reached;
  const r = ok ? await playOn(page, { morning: L["mops-morning"] }) : null;
  const d = r && { at: [at.x, at.y, at.loop.ph], stopped: [r.stopped.x, r.stopped.y, r.stopped.pose], jump: r.jump, seen: r.seen, morning: r.morning && [r.morning.x, r.morning.y, r.morning.f, r.morning.pose], along: r.along && [r.along.x, r.along.y, r.along.f], end: [r.end.x, r.end.y, r.end.f], step: r.step };
  g.check(`tap ${name}: the loop reached that point`, ok, at);
  if (!r) continue;
  g.check(`tap ${name}: Mops stops where he is, still mopping (nobody jumps: under 60 between any two frames, all the way to the song)`, Math.hypot(r.stopped.x - at.x, r.stopped.y - at.y) < 1 && r.stopped.pose === "mop" && r.jump < 60, d);
  g.check(`tap ${name}: half a second later his beard is on the floor where he stands, not on the painted bucket (drawn beard measured)`, r.held.pose === "mop" && r.held.beardOnFloor > 0 && r.held.beardOnBucket === 0, r.held);
  g.check(`tap ${name}: the ding-dong, the speaker, "Morning, Squatch.", "Party?", the close-up and the song line come in order`, JSON.stringify(r.seen.filter((k) => k !== "until" && k !== "run" && k !== "wait").slice(0, want.length)) === JSON.stringify(want), r.seen);
  g.check(`tap ${name}: he says "Morning, Squatch." where he stopped, head up, facing Squatch`, !!r.morning && Math.hypot(r.morning.x - at.x, r.morning.y - at.y) < 1 && r.morning.pose === "stand" && r.morning.f === Math.sign(r.morning.sq[0] - r.morning.x), d);
  // Everywhere in his loop he is at most a step to the left of the bucket spot, so he faces the bucket all the way.
  g.check(
    `tap ${name}: after "Party?" he mops from where he stands (${at.x < NEAR.x - 2 ? "left" : "right"} of his bucket spot) to it, head down, facing the bucket all the way, and ends beside it`,
    !!r.along && Math.hypot(r.along.x - at.x, r.along.y - at.y) < 4 && r.mopFrames.every((f) => f.pose === "mop" && f.f === -1) && Math.abs(r.end.x - NEAR.x) < 1 && Math.abs(r.end.y - NEAR.y) < 1,
    { ...d, faces: [...new Set(r.mopFrames.map((f) => f.f))] },
  );
  // Brian 21a ("the close-up would only make sense if he was just mopping the floor just beforehand"): even from
  // beside the bucket he mops two strokes (a second) before the close-up.
  g.check(`tap ${name}: he mops for a second or more before the close-up, wherever he stood`, r.mopFrames.length >= 29 && r.mopFrames.length <= 75, r.mopFrames.length);
  g.check(`tap ${name}: the morning plays on to the song step, Mops beside his bucket facing Squatch`, r.ctrl && r.step === "song" && r.chip === L["chip-sing"] && r.end.f === -1 && r.end.pose === "stand", d);
  g.check(`tap ${name}: no page errors`, errors.length === 0, errors);
  await ctx.close();
}

// ---------- Hold ↺ during the loop ----------
{
  const { page, errors, ctx } = await open(false);
  const r = await page.evaluate(() => {
    const T = window.__t,
      ss = window.__ss;
    T.toRoom();
    T.run(40, (s) => !!s.loop && s.loop.ph === "wring" && s.loop.t > 0.5);
    const before = T.now();
    ss.resetHold(true);
    for (let i = 0; i < 20; i++) ss.tick(0.05);
    ss.resetHold(false);
    for (let i = 0; i < 4; i++) ss.tick(0.05);
    const after = T.now();
    const round = T.run(20, (s) => !!s.loop && s.loop.ph === "wring");
    return { before, after, again: round[round.length - 1] };
  });
  g.check("↺ while he wrings at the bucket: the room again from its start (Squatch asleep, Mops head down at the door end, no shine left, waiting for a tap)", r.before.loop.ph === "wring" && r.after.k === "wait" && r.after.step === "asleep" && r.after.pose === "mop" && Math.abs(r.after.x - FAR.x) < 1 && !r.after.shine && !r.after.wet && r.after.loop.round === 0, r);
  g.check("after ↺ he goes round again", !!r.again && r.again.loop.ph === "wring", r.again);
  g.check("no page errors (↺ in the loop)", errors.length === 0, errors);
  await ctx.close();
}

// ---------- Sound ----------
{
  const { page, errors, ctx } = await open(true);
  await sleep(300);
  // How loud each sound is, rendered alone (at the level it plays at): all of it, and only what is up where the
  // snore's whistle is (above 1 kHz).
  const lv = await page.evaluate(async (snoreLevel) => {
    const m = window.SSQ.morningSound.measure;
    return {
      snore: await m("snore", { level: snoreLevel }),
      rumble: await m("snore", { level: snoreLevel, from: 0, to: 1.2 }),
      whistle: await m("snore", { level: snoreLevel, from: 1.5, to: 2.2 }),
      whistleHigh: await m("snore", { level: snoreLevel, from: 1.5, to: 2.2, highpass: 1000 }),
      stroke: await m("mopSoft"),
      strokeHigh: await m("mopSoft", { highpass: 1000 }),
      squeakyHigh: await m("mop", { highpass: 1000 }),
      squeeze: await m("squeeze"),
      squeezeHigh: await m("squeeze", { highpass: 1000 }),
      drip: await m("dripSoft"),
      dripHigh: await m("dripSoft", { highpass: 1000 }),
      whistleOld: await m("snore", { level: 0.22, from: 1.5, to: 2.2, highpass: 1000 }),
      ding: await m("dingDong"),
    };
  }, MORNING_SOUND.snoreLevel);
  const db = (a, b) => (a && b ? Math.round(200 * Math.log10(a / b)) / 10 : null);
  const D = lv.snore && lv.stroke && lv.squeeze && lv.drip ? { rumbleOverStroke: db(lv.rumble.rms, lv.stroke.rms), whistleOverStroke: db(lv.whistle.rms, lv.stroke.rms), whistleOverStrokeHigh: db(lv.whistleHigh.rms, lv.strokeHigh.rms), strokeHighUnderStroke: db(lv.stroke.rms, lv.strokeHigh.rms), oldStrokeHighOverNew: db(lv.squeakyHigh.rms, lv.strokeHigh.rms), snorePeak: lv.snore.peak, dingOverRumble: db(lv.ding.rms, lv.rumble.rms), whistleOverSqueezeHigh: db(lv.whistleHigh.rms, lv.squeezeHigh.rms), whistleOverDripHigh: db(lv.whistleHigh.rms, lv.dripHigh.rms), whistleOverOldWhistle: db(lv.whistleHigh.rms, lv.whistleOld.rms) } : lv;
  g.check("the snore is clearly the main sound: its rumble is 6 dB or more over a sleeping mop stroke, and its whistle is louder than the stroke too", D.rumbleOverStroke >= 6 && D.whistleOverStroke >= 3, D);
  g.check("a sleeping mop stroke has no squeak: up where the whistle is (above 1 kHz) it is 12 dB or more under the whistle, and far under the old swish-squeak", D.whistleOverStrokeHigh >= 12 && D.oldStrokeHighOverNew >= 12, D);
  g.check("the snore's whistle is louder than it was at the old level, 0.22 (3 dB or more, measured), the snore does not clip, and it stays under the ding-dong that wakes him", D.whistleOverOldWhistle >= 3 && D.snorePeak < 0.7 && D.dingOverRumble >= 2, D);
  g.check("the squeeze and the drips at the bucket cannot be taken for the whistle: up where the whistle is (above 1 kHz) each is 12 dB or more under it", D.whistleOverSqueezeHigh >= 12 && D.whistleOverDripHigh >= 12, D);
  console.log("NOTE levels (dB): " + JSON.stringify(D));

  // In the room: which sound plays when, against what Mops is doing (the game clock; real time passes too, so
  // the snores booked on the audio clock come).
  const R = await page.evaluate(async () => {
    const T = window.__t,
      snd = window.SSQ.morningSound,
      beat = window.SSQ.beat("ch1-morning"),
      seen = [];
    T.toRoom();
    let had = snd.debug().log.length;
    const b0 = snd.debug().breaths;
    for (let i = 0; i < 30 * 27; i++) {
      window.__ss.tick(1 / 30);
      const d = beat.debug(),
        log = snd.debug().log;
      for (; had < log.length; had++) seen.push({ name: log[had].name, ph: d.loop.ph, round: d.loop.round, t: Math.round(d.loop.t * 1000) / 1000, sweep: d.loop.sweep, out: d.loop.out, back: d.loop.back, landed: d.loop.landed, k: window.__ss.op.cur ? window.__ss.op.cur.k : "" });
      i % 3 === 0 && (await new Promise((ok) => setTimeout(ok, 30)));
    }
    return { seen, breaths: snd.debug().breaths - b0, via: snd.debug().via, snoring: snd.debug().snoring };
  });
  const by = (name) => R.seen.filter((x) => x.name === name);
  const strokes = by("mopSoft"),
    r0 = (list) => list.filter((x) => x.round === 0);
  g.check("he keeps snoring all through the loop, through the sound-effects level", R.snoring && R.breaths >= 2 && R.via === "effects", { breaths: R.breaths, via: R.via });
  g.check("a soft swish for each stroke of his beard, only while he mops, each at a turn of the beard (drawn at its far back or far forward)", r0(strokes).length >= 6 && strokes.every((x) => x.ph === "mop" && Math.min(Math.abs(x.sweep - x.out), Math.abs(x.sweep - x.back)) < 0.05 * (x.out - x.back)), strokes);
  g.check('no "swish, squeak" stroke while Squatch sleeps (the squeak is gone from the sleeping strokes)', by("mop").length === 0, by("mop"));
  const sq = by("squeeze"),
    drips = by("dripSoft");
  g.check("the quiet squeeze plays twice a round, only while he wrings at the bucket", r0(sq).length === 2 && sq.every((x) => x.ph === "wring"), sq);
  g.check("each drip sounds as a drawn drop lands in the bucket (five a round, only in the wring)", r0(drips).length === 5 && drips.every((x) => x.ph === "wring") && r0(drips).every((x, i) => x.landed === i + 1), drips);
  const other = R.seen.filter((x) => !["snore", "mopSoft", "squeeze", "dripSoft"].includes(x.name));
  g.check("nothing else sounds in the quiet room (no sound while he walks back or steps to the bucket)", other.length === 0 && R.seen.filter((x) => x.name !== "snore").every((x) => x.ph === "mop" || x.ph === "wring"), other);
  g.check("no page errors (sound on)", errors.length === 0, errors);
  await ctx.close();
}
{
  const { page, errors, ctx } = await open(false);
  const r = await page.evaluate(() => {
    const T = window.__t;
    T.toRoom();
    T.run(27);
    const d = window.SSQ.morningSound.debug();
    return { made: window.__ctxMade, log: d.log.length, breaths: d.breaths, round: T.now().loop.round };
  });
  g.check("sound off: he still goes round, no sound engine is made and nothing plays", r.round >= 1 && r.made === 0 && r.log === 0 && r.breaths === 0, r);
  g.check("no page errors (sound off)", errors.length === 0, errors);
  await ctx.close();
}
await g.finish("morning-mop-loop");
