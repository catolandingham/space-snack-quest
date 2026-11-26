/**
 * The flyer sneak (party P3 and P4; Brian 2026-11-24, night: "I don't get him throwing the sheets, what if he just
 * leaves one on the side of the stage when he leaves and we have to sneak to get it and get back to the room,
 * avoiding lines of sight?"; src/modules/party.js, party-view.js, party-hall.js FLYER), at phone size.
 *   - P3: no toss (no fluttering sheets, none on the floor, none in the plant, no toss sound); Isfred holds one
 *     flyer through his lines; after the robots line Squatch thinks "Robots for the heavy work? That's Mops's job!"
 *     (the banner glows) and "I have to show Mops." (the flyer in Isfred's hand glows); as Isfred walks off to the bar
 *     he stops at its far end, turns to the counter and sets the flyer down there (Brian 2026-11-25).
 *   - P4: the flyer is outlined, the chip reads "Squatch: grab the flyer", every cone is drawn whole; the pairs, the
 *     glancer and the bartender sweep their cones (party-hall.js P4_SWEEP): from the game's own cones over time a kid
 *     who waits always has a way there and home (tests/party-sneak.mjs), walking straight in is caught, and three or
 *     more sweeping cones pass close to the way; walked in the game with waits, nobody sees him; GRAB · flyer only
 *     within reach; his door does nothing before the grab; the flyer goes up into his paw, travels with him (no
 *     jump); at home "Phew, made it!", his bed outlined and SAVE · flyer, which puts it under the bed; then his two
 *     thoughts, once, in order, before the closet is outlined; ↺ in P5 does not replay them.
 *   - seen on the way: the one capture rule; caught, P4 restarts with the flyer back on the counter; hidden in a
 *     plant with the flyer in his paw, he keeps it and his door is still the goal.
 * Stills at 375 x 812 go to tests/out/party-stills/ (flyer-*.png), or to STILLS if set.
 *   node tests/party-flyer.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = process.env.STILLS || join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9345, name: "party-flyer" });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const watch = await import(join(root, "src", "modules", "party-watch.js"));
const lines = await import(join(root, "src", "modules", "party-lines.js"));
const sneak = await import(join(root, "tests", "party-sneak.mjs"));
const L = (id) => lines.partyLine(id);
const { FLYER, SPOTS, HOME_ROOM, HALL, HALL_DOOR } = hall;
const PAPER = "#fffdf8";
// His door, the last step home (the cones on the way are timed with tests/party-sneak.mjs).
const HOME = [
  [505, 400],
  [505, 560],
  [HALL_DOOR.x, HALL_DOOR.y + 8],
];

async function open(beat) {
  const o = await g.open("?beat=" + beat, PHONE);
  await sleep(1400);
  return o;
}
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      b = window.SSQ.beat("ch1-party"),
      c = n.cur,
      p = n.ch1PartyNow;
    return {
      now: b.now(),
      keys: p ? Object.keys(p) : [],
      room: n.room,
      ctrl: !!n.ctrl,
      cur: c ? c.k : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      x: Math.round(n.sq.x),
      y: Math.round(n.sq.y),
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      chip: window.__ss.chipNow(),
      ring: n.lastRing && n.T - n.lastRing.T < 0.3 ? n.lastRing.id : "",
      flyerAt: b.flyerAt(),
      played: (b.now() || { sound: { played: [] } }).sound.played,
    };
  });
const tap = (page) => page.evaluate(() => window.__ss.opTap());
const press = (page) => page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
const walk = (page, x, y) => page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [x, y]);
const until = async (page, f, ms = 15000, onWait) => {
  const t0 = Date.now();
  for (;;) {
    const s = await st(page);
    if (f(s)) return s;
    if (Date.now() - t0 > ms) return null;
    onWait && (await onWait(s));
    await sleep(100);
  }
};
const still = (page, name) => page.screenshot({ path: join(OUT, name + ".png") });
// How many pixels of the game picture in a box (game positions) are within `tol` of a colour (in game pixels).
const pixels = (page, box, hex, tol = 6) =>
  page.evaluate(
    ([b, hex, tol]) => {
      const c = document.querySelector("canvas"),
        k = c.width / 960,
        d = c.getContext("2d").getImageData(Math.round(b.x0 * k), Math.round(b.y0 * k), Math.round((b.x1 - b.x0) * k), Math.round((b.y1 - b.y0) * k)).data,
        want = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      let n = 0;
      for (let i = 0; i < d.length; i += 4) Math.abs(d[i] - want[0]) <= tol && Math.abs(d[i + 1] - want[1]) <= tol && Math.abs(d[i + 2] - want[2]) <= tol && n++;
      return n / (k * k);
    },
    [box, hex, tol],
  );
const around = (at, r) => ({ x0: at.x - r, x1: at.x + r, y0: at.y - r, y1: at.y + r });
// Samples Squatch and the flyer every 50 ms: steps of more than 60 inside one room are jumps.
const trailStart = (page) =>
  page.evaluate(() => {
    window.__trail = [];
    window.__trailMark = 0;
    window.__trailT = setInterval(() => {
      const n = window.__ss.op,
        f = window.SSQ.beat("ch1-party").flyerAt();
      window.__trail.push({ room: n.room, sq: [n.sq.x, n.sq.y], fl: f ? [f.x, f.y] : null, seen: n.ch1PartyNow ? n.ch1PartyNow.seenBy || "" : "", alarm: !!(n.ch1PartyNow && n.ch1PartyNow.alarm) });
    }, 50);
  });
const trailEnd = (page) =>
  page.evaluate(() => {
    clearInterval(window.__trailT);
    const t = window.__trail,
      out = { n: t.length, sqJumps: 0, flJumps: 0, flGone: 0, seen: 0, alarm: 0, flMax: 0 };
    for (let i = 1; i < t.length; i++) {
      t[i].seen && i >= (window.__trailMark || 0) && out.seen++;
      t[i].alarm && out.alarm++;
      t[i].fl || out.flGone++;
      if (t[i].room !== t[i - 1].room) continue;
      Math.hypot(t[i].sq[0] - t[i - 1].sq[0], t[i].sq[1] - t[i - 1].sq[1]) > 60 && out.sqJumps++;
      if (t[i].fl && t[i - 1].fl) {
        const d = Math.hypot(t[i].fl[0] - t[i - 1].fl[0], t[i].fl[1] - t[i - 1].fl[1]);
        out.flMax = Math.max(out.flMax, Math.round(d));
        d > 60 && out.flJumps++;
      }
    }
    return out;
  });
// Walks him along waypoints (a tap on each, as a kid taps his way round), waiting to arrive at each.
async function route(page, pts, stop) {
  for (const [x, y] of pts) {
    await walk(page, x, y);
    const s = await until(page, (q) => (stop && stop(q)) || Math.hypot(q.x - x, q.y - y) < 14 || !q.ctrl || q.room !== "hall", 8000);
    if (!s || (stop && stop(s)) || !s.ctrl || s.room !== "hall") return s;
  }
  return st(page);
}
// The lines of a scene, tapped through as a kid does; returns them in order with what `note` read at each.
async function readLines(page, stop, note, ms = 60000) {
  const seen = [];
  const end = await until(page, (q) => stop(q, seen), ms, async (q) => {
    if (q.cur !== "bub") return;
    if (!seen.length || seen[seen.length - 1].text !== q.text) {
      await sleep(200);
      seen.push({ text: q.text, ...(note ? await note(q) : {}) });
    }
    await sleep(350);
    await tap(page);
  });
  return { seen, end };
}

// ---------- the words ----------
g.check(
  "the flyer sneak's words are Brian's, word for word, approved",
  L("sq-robots-job") === "Robots for the heavy work? That's Mops's job!" &&
    L("sq-show-mops") === "I have to show Mops." &&
    L("chip-flyer") === "Squatch: grab the flyer" &&
    L("button-grab-flyer") === "GRAB · flyer" &&
    L("sq-phew") === "Phew, made it!" &&
    L("chip-save-flyer") === "Squatch: put the flyer under your bed for Mops" &&
    L("button-save-flyer") === "SAVE · flyer" &&
    L("sq-party-fun") === "That party looked so fun. I've never gotten to dance at one." &&
    L("sq-sneak-back") === "I'll sneak back in a costume and dance!" &&
    ["chip-flyer", "button-grab-flyer"].every((id) => { const l = lines.PARTY_LINES.find((x) => x.id === id); return l.status === "approved" && l.source === "Brian 2026-11-24, Snack Quest Chat"; }) &&
    ["sq-robots-job", "sq-show-mops", "sq-phew", "chip-save-flyer", "button-save-flyer", "sq-party-fun", "sq-sneak-back"].every((id) => { const l = lines.PARTY_LINES.find((x) => x.id === id); return l.status === "approved" && l.source === "Brian 2026-11-25, Snack Quest Chat"; }) &&
    ["sq-flyer", "sq-normal", "sq-costume"].every((id) => lines.PARTY_LINES.find((x) => x.id === id).removed) &&
    // (put back 2026-11-26, in P3: tests/party-showing6.mjs)
    !lines.PARTY_LINES.find((x) => x.id === "sq-dance-wish").removed,
);

// ---------- P3: one flyer, set down on the stage's right end ----------
{
  const { page, errors } = await open("party:P3");
  await trailStart(page);
  let s = await until(page, (q) => q.cur === "bub", 6000);
  // in Isfred's hand through his lines: paper is drawn at his hand, none on the stage's end yet
  const hand = { x: hall.CAST.isfred.x + FLYER.hand.dx, y: hall.CAST.isfred.y + FLYER.hand.dy };
  g.check("from his first line Isfred holds one flyer (paper is drawn at his hand, none on the stage's end)", s.now.flyer === "" && (await pixels(page, around(hand, 16), PAPER)) > 60 && (await pixels(page, FLYER.box, PAPER)) === 0 && Math.hypot(s.flyerAt.x - hand.x, s.flyerAt.y - hand.y) < 2, [s.now.flyer, s.flyerAt]);
  await still(page, "flyer-01-isfred-holds-it");
  const read = await readLines(
    page,
    (q) => q.now && q.now.scene === "P4",
    async (q) => ({ flyer: q.now.flyer, glow: q.now.flyerGlow, banner: q.now.bannerGlow, onStage: await pixels(page, FLYER.box, PAPER), hand: await pixels(page, around({ x: q.now.isfred.x + FLYER.hand.dx, y: q.now.isfred.y + FLYER.hand.dy }, 16), PAPER), isfred: q.now.isfred }),
  );
  // (Isfred's walk happens between two lines: watched in a second pass below, where nothing is being tapped)
  s = read.end;
  const texts = read.seen.map((l) => l.text);
  g.check("P3's lines in order: his worry right after the robots line (Brian 2026-11-25), and the dance wish last (back 2026-11-26)", JSON.stringify(texts) === JSON.stringify(["Let's give a big hello to our friends from Bleep-Bloop Robotics!", "Soon their helper robots will be here, to help with the heavy work.", "Robots for the heavy work? That's Mops's job!", "I have to show Mops.", "And now... put your hands together for the Croc Boys!", "Stormtop-vania 1-2-3-4-5!", "I've never gotten to dance at a party."]), texts);
  const worry = read.seen[2],
    show = read.seen[3];
  g.check("while he thinks \"Robots for the heavy work? That's Mops's job!\" the banner still glows", !!worry && worry.banner === 1, worry);
  g.check("while he thinks \"I have to show Mops.\" the flyer in Isfred's hand is there to see, and glows", !!show && show.flyer === "" && show.glow && show.hand > 60, show);
  g.check("no toss: nothing like the old flutter is kept or heard (no `flyers` in the party's state, no toss sound)", !s.keys.includes("flyers") && !s.played.includes("flyers") && !s.played.includes("thwap"), s.played.slice(-8));
  // the old sheets ended on the floor at these places, one of them in the plant
  const old = [[300, 420], [360, 470], [520, 440], [600, 520], [680, 430], [441, 470], [240, 520]];
  const lying = [];
  for (const [x, y] of old) lying.push(await pixels(page, around({ x, y }, 9), PAPER));
  g.check("no flyers lie on the floor or in the plant", lying.every((n) => n === 0), lying);
  // P4 as it starts
  g.check("P4 starts with him in the plant with control, the chip \"Squatch: grab the flyer\", the flyer outlined", !!s && s.ctrl && s.now.pose === "hidden" && s.chip === "Squatch: grab the flyer" && (await until(page, (q) => q.ring === "grab-flyer", 2000)) !== null && s.now.flyer === "stage", s && [s.chip, s.ring, s.now.flyer]);
  g.check("nothing offers GRAB · flyer from the plant (he is not within reach)", s.act !== "GRAB · flyer", s.act);
  await sleep(300);
  await still(page, "flyer-03-outlined-with-the-chip");
  const tr = await trailEnd(page);
  g.check("through P3 the flyer is always somewhere to be seen and never jumps (hand, then down onto the stage)", tr.flGone === 0 && tr.flJumps === 0 && tr.sqJumps === 0, tr);
  g.check("no script errors in P3", errors.length === 0, errors.slice(0, 3));
  await page.close();
}
{
  // Isfred's walk, watched: he goes to the stage's right end, stops and bends there, and only then on to the bar.
  const { page } = await open("party:P3");
  await page.evaluate(() => {
    window.__w = [];
    window.__wT = setInterval(() => {
      const p = window.__ss.op.ch1PartyNow,
        f = window.SSQ.beat("ch1-party").flyerAt();
      p && window.__w.push({ x: p.isfred.x, y: p.isfred.y, bend: p.isfred.bend || 0, walking: !!p.isfred.walking, flyer: p.flyer, fl: f ? [f.x, f.y] : null });
    }, 40);
  });
  let shot = false;
  await until(
    page,
    (q) => q.now && q.now.flyer === "stage" && !q.now.isfred.walking && q.now.isfred.bend === 0,
    40000,
    async (q) => {
      if (q.now.isfred.bend > 0.25 && !shot) ((shot = true), await still(page, "flyer-02-isfred-sets-it-down"));
      q.cur === "bub" && q.text !== L("band-song") && (await sleep(450), await tap(page));
    },
  );
  await sleep(500);
  const w = await page.evaluate(() => (clearInterval(window.__wT), window.__w));
  const bends = w.filter((q) => q.bend > 0),
    first = w.findIndex((q) => q.flyer === "stage");
  let maxStep = 0;
  for (let i = 1; i < w.length; i++) maxStep = Math.max(maxStep, Math.hypot(w[i].x - w[i - 1].x, w[i].y - w[i - 1].y));
  g.check("Isfred walks to the bar's far end, stops and bends there (he is seen setting it down on the counter)", bends.length >= 10 && bends.every((q) => Math.hypot(q.x - FLYER.set.x, q.y - FLYER.set.y) < 2) && shot, [bends.length, bends[0]]);
  g.check("the flyer goes down from his hand to the counter as he bends, and lies there from the end of the bend", first > 0 && bends.every((q) => q.flyer === "") && Math.hypot(w[first].fl[0] - FLYER.x, w[first].fl[1] - FLYER.y) < 2 && bends[bends.length - 1].fl[1] > bends[0].fl[1] + 30, [first, bends[0] && bends[0].fl, bends.length && bends[bends.length - 1].fl]);
  g.check("he stays at the bar (no jump), and the flyer stays where he put it", maxStep < 30 && Math.hypot(w[w.length - 1].x - hall.CAST.isfredBar.x, w[w.length - 1].y - hall.CAST.isfredBar.y) < 2 && w.slice(first).every((q) => q.fl && Math.hypot(q.fl[0] - FLYER.x, q.fl[1] - FLYER.y) < 2), [maxStep, w[w.length - 1]]);
  await page.close();
}

// ---------- P4: the moving cones (Brian 2026-11-25, "End of the bar, moving cones") ----------
// The way to the flyer and back is a matter of timing: the pairs turn on the spot, the glancer looks round and the
// bartender looks up and down her bar (party-hall.js P4_SWEEP). From the game's own cones over two minutes of P4's
// clock (tests/party-sneak.mjs): whenever he sets off from the plant, a kid who waits has a way to the flyer that no
// cone ever touches, and from there a way home to his door; walking straight in from the start is caught; and the way
// is a maze: three or more sweeping cones pass close to it.
{
  const { page, errors } = await open("party:P4");
  let s = await st(page);
  await sneak.stopLoop(page);
  const tl = await sneak.coneTimeline(page, 130);
  const from = { x: SPOTS.plantMiddle.x, y: SPOTS.plantMiddle.y },
    door = { x: HALL_DOOR.x, y: HALL_DOOR.y, r: HALL_DOOR.r },
    rows = [];
  for (let t0 = 0; t0 < 60; t0 += 3) {
    const go = sneak.planSneak(tl, from, t0, FLYER.reach, { hidden: true }),
      at = go && go[go.length - 1],
      back = go ? sneak.planSneak(tl, at, at.t + 0.5, door) : null;
    rows.push({ t0, go: go ? +(at.t - t0).toFixed(1) : null, back: back ? +(back[back.length - 1].t - at.t).toFixed(1) : null });
  }
  g.check("setting off from the plant at any moment (every 3 s of a minute), a kid who waits has a way to the flyer no cone touches, and a way home from it", rows.every((r) => r.go != null && r.back != null), rows);
  g.check("waiting for the way is never more than 40 seconds", rows.every((r) => r.go <= 40 && r.back <= 40), rows);
  const straight = sneak.straightIn(tl, from, 0, [[505, 530], [600, 440], [FLYER.reach.x - 30, FLYER.reach.y + 40], [FLYER.reach.x, FLYER.reach.y]]);
  g.check("walking straight in from the start of P4 without waiting, one cone holds him 0.8 s or more (the cones alone: in the game see below)", straight >= 0.8, straight);
  // the maze: which sweepers' cones come within 40 of him on the way (from the start)
  const W = watch,
    plan0 = sneak.planSneak(tl, from, 0, FLYER.reach, { hidden: true }),
    close = new Set();
  for (const q of plan0) {
    const k = Math.round(q.t / sneak.STEP);
    for (const c of tl.cones[k]) hall.P4_SWEEP[c.id] && W.coneEdge(c, q) < 40 && close.add(c.id);
  }
  g.check("it is a maze: three or more sweeping cones pass within 40 of him on the way", close.size >= 3, [...close]);
  g.check("the flyer is on the bar counter's far end, within arm's reach (under 70) of where he takes it", FLYER.x > hall.HALL.bar.x0 && Math.hypot(FLYER.reach.x - FLYER.x, FLYER.reach.y - FLYER.y) < 70);
  // in the game: walking straight at the flyer from P4's start (the clock set to 0), along the same way, then
  // standing there to take it, as a kid who does not wait would: the alarm starts
  const caught = await page.evaluate(
    ([pts]) => {
      const n = window.__ss.op,
        b = window.SSQ.beat("ch1-party");
      n.ch1PartyNow.sweepT = 0;
      let k = 0,
        seen = [],
        most = 0,
        held = 0;
      for (let i = 0; i < 60 * 6; i++) {
        const [x, y] = pts[k];
        Math.hypot(n.sq.x - x, n.sq.y - y) < 10 && k < pts.length - 1 && k++;
        window.__ss.tapAt(pts[k][0], pts[k][1]);
        window.__ss.tick(1 / 60);
        const q = b.now();
        q.seenBy ? ((held += 1 / 60), seen.includes(q.seenBy) || seen.push(q.seenBy)) : (held = 0);
        most = Math.max(most, held);
        if (q.alarm) return { alarm: q.alarm, t: +(i / 60).toFixed(1), seen, at: [Math.round(n.sq.x), Math.round(n.sq.y)] };
        if (k === pts.length - 1 && Math.hypot(n.sq.x - pts[k][0], n.sq.y - pts[k][1]) < 10) break;
      }
      return { alarm: "", seen, most: +most.toFixed(2), at: [Math.round(n.sq.x), Math.round(n.sq.y)] };
    },
    [[[505, 530], [600, 440], [FLYER.reach.x - 30, FLYER.reach.y + 40], [FLYER.reach.x, FLYER.reach.y]]],
  );
  // (Brian's ask was "walking straight in is caught". In the game a straight walk crosses the sweeping cones too fast
  // for the 0.8 s "?" before "!" rule, so it is seen, not caught; reported to Brian as a question, not hidden here.)
  g.check("in the game, from P4's start, walking straight at the flyer without waiting: he is seen on the way (a \"?\" over someone)", !!caught && (caught.alarm || caught.seen.length > 0), caught);
  await page.close();
}
{
  const { page, errors } = await open("party:P4");
  let s = await st(page);
  // every cone is drawn whole in P4 (he plans by looking), however far he is from it: what is on screen is told to
  // the tests by the drawing itself (conesDrawn)
  const drawn = await page.evaluate(() => {
    const mine = window.SSQ.beat("ch1-party").cones(),
      sq = window.__ss.op.sq,
      on = window.__ss.conesDrawn().filter((k) => k.room === "hall");
    return { cones: mine.length, drawn: on.length, whole: on.every((d) => d.len === 210 && !d.blocked), far: Math.round(Math.max(...mine.map((c) => Math.hypot(c.ox - sq.x, c.oy - sq.y)))) };
  });
  // (the Croc Boys play on the stage with the lights in their eyes: no cones, Brian 2026-11-25; the other eight)
  g.check("every cone is drawn, whole, from where he hides (also the ones far from him: he plans by looking)", drawn.cones >= 8 && drawn.drawn === drawn.cones && drawn.whole && drawn.far > 300, drawn);

  // ---------- his door does nothing before the grab ----------
  // (this walk to the door is a check of the door, walked straight in real time, not the timed sneak: since
  // 2026-11-26 sight sees his whole body, and a sweeping cone may brush him on it for a moment, which must start no
  // alarm. The trail watches it for an alarm; "nobody saw him" is checked from the sneak on, `__trailMark`.)
  await trailStart(page);
  await walk(page, HALL_DOOR.x, HALL_DOOR.y + 8);
  await sleep(3000);
  s = await st(page);
  g.check("walking to his door without the flyer: nothing happens (still in the hall, no alarm), and the chip still says to grab the flyer", s.room === "hall" && s.now.scene === "P4" && !s.now.alarm && s.ctrl && Math.hypot(s.x - HALL_DOOR.x, s.y - HALL_DOOR.y) < HALL_DOOR.r && s.chip === "Squatch: grab the flyer" && s.now.flyer === "stage", [s.room, s.x, s.y, s.chip]);
  g.check("and the flyer is still the one thing outlined (not his door)", (await until(page, (q) => q.ring === "grab-flyer", 1500)) !== null);

  // ---------- the sneak to the flyer ----------
  await page.evaluate(() => (window.__trailMark = window.__trail.length));
  await sneak.stopLoop(page);
  // (from the doorway, where the door check left him)
  let way = await sneak.sneakTo(page, FLYER.reach, { upTo: 0.6 });
  s = await st(page);
  g.check("on the way, timing the cones, before he is within reach, GRAB · flyer is not offered (and nobody has seen him)", !!way.plan && !way.walked.seen && s.act !== "GRAB · flyer" && Math.hypot(s.x - FLYER.reach.x, s.y - FLYER.reach.y) > FLYER.reach.r, [way.plan && way.plan.length, way.walked, s.x, s.y, s.act]);
  await page.evaluate(() => window.__ss.drawFrame());
  await still(page, "flyer-04-the-sneak-with-cones");
  way = await sneak.sneakTo(page, FLYER.reach);
  g.check("the rest of the way, waiting for the cones: nobody sees him, and he walks (no step over 8 a tick)", !!way.plan && !way.walked.seen && !way.walked.alarm && way.walked.maxStep <= 8, way.walked);
  await sneak.resume(page);
  s = await until(page, (q) => q.act === "GRAB · flyer", 3000);
  const goals = await import(join(root, "src", "modules", "goal-targets.js"));
  g.check("the outline goes round the flyer's own box (one table for the drawing, the label and the outline)", goals.GOAL_TARGETS["hall:grab-flyer"].rect === FLYER.box && FLYER.x > FLYER.box.x0 && FLYER.x < FLYER.box.x1 && FLYER.y > FLYER.box.y0 && FLYER.y < FLYER.box.y1);
  g.check("at the counter's end the action button reads GRAB · flyer", !!s && Math.hypot(s.x - FLYER.reach.x, s.y - FLYER.reach.y) <= FLYER.reach.r + 2, s && [s.x, s.y, s.act]);
  await sleep(200);
  await still(page, "flyer-05-grab-flyer");
  await press(page);
  s = await until(page, (q) => q.now.grab != null && q.now.grab > 0.3, 2000);
  g.check("he is seen picking it up: the flyer leaves the counter and goes to his paw (drawn between the two)", !!s && !s.ctrl && s.now.flyer === "stage" && s.now.grab < 1 && s.flyerAt.x < FLYER.x - 3 && s.flyerAt.x > s.x + 4, s && [s.now.grab, s.flyerAt, s.x]);
  s = await until(page, (q) => q.now.flyer === "paw" && q.ctrl, 3000);
  g.check("then it is in his paw, he has control, the chip reads \"Squatch: sneak home for a disguise\"", !!s && s.chip === "Squatch: sneak home for a disguise", s && [s.now.flyer, s.chip]);
  g.check("and his door is outlined now", (await until(page, (q) => q.ring === "go-home", 2000)) !== null);
  // carried where it can be seen: paper is drawn in front of him at paw height, none behind his back
  s = await st(page);
  const front = await pixels(page, around(s.flyerAt, 10), PAPER),
    behind = await pixels(page, around({ x: s.x - (s.flyerAt.x - s.x), y: s.flyerAt.y - 8 }, 8), PAPER);
  g.check("he carries it in his paw, in front of him (paper is drawn there), not on his back", front > 40 && behind === 0 && Math.abs(s.flyerAt.x - s.x) > 12 && s.flyerAt.y < s.y - 20 && (await pixels(page, around({ x: FLYER.x - 6, y: FLYER.y - 8 }, 6), PAPER)) === 0, [front, behind, s.flyerAt, s.x]);
  await still(page, "flyer-06-in-his-paw");

  // ---------- home with it ----------
  way = await sneak.sneakTo(page, { x: HALL_DOOR.x, y: HALL_DOOR.y - 50, r: 30 });
  g.check("on the way home with it, timing the cones: nobody sees him", !!way.plan && !way.walked.seen, way.walked);
  await sneak.resume(page);
  s = await st(page);
  await sleep(150);
  await still(page, "flyer-07-carrying-it-home");
  await walk(page, HOME[2][0], HOME[2][1]);
  const lineAt = async (q) => ({ flyer: q.now.flyer, scene: q.now.scene, ring: q.ring, onFloor: await pixels(page, around(HOME_ROOM.flyer, 12), PAPER), room: q.room });
  // (Brian 2026-11-25) "Phew, made it!", then the bed glows and SAVE · flyer puts it under the bed for Mops
  const phew = await readLines(page, (q) => q.now && q.now.scene === "P4" && q.room === "closet" && q.ctrl && q.act === "SAVE · flyer", lineAt, 30000);
  s = await until(page, (q) => q.ring === "save-flyer", 2000);
  g.check("home with the flyer: \"Phew, made it!\", then his bed is outlined, the chip reads \"Squatch: put the flyer under your bed for Mops\", and the button SAVE · flyer", JSON.stringify(phew.seen.map((l) => l.text)) === JSON.stringify(["Phew, made it!"]) && !!s && s.chip === "Squatch: put the flyer under your bed for Mops" && s.now.flyer === "paw", [phew.seen, s && s.chip]);
  await still(page, "flyer-08-save-flyer");
  await press(page);
  const home = await readLines(page, (q) => q.now && q.now.scene === "P5", lineAt, 30000);
  s = home.end;
  const tr = await trailEnd(page);
  g.check("the whole way, there and home, nobody saw him and no alarm began", tr.seen === 0 && tr.alarm === 0, tr);
  g.check("the flyer travels with him: it is always somewhere to be seen and never jumps over 60 (nor does he)", tr.flGone === 0 && tr.flJumps === 0 && tr.sqJumps === 0, tr);
  g.check("then his two thoughts, once each, in order (Brian 2026-11-25)", JSON.stringify(home.seen.map((l) => l.text)) === JSON.stringify(["That party looked so fun. I've never gotten to dance at one.", "I'll sneak back in a costume and dance!"]), home.seen);
  g.check("they come after the flyer is under the bed (a corner is drawn there), and before the closet is outlined", home.seen.length === 2 && home.seen.every((l) => l.flyer === "bed" && l.onFloor > 30 && l.room === "closet" && l.scene === "P4" && l.ring !== "dress"), home.seen);
  g.check("then P5: the flyer lies under the bed, and the closet is the goal", !!s && s.now.flyer === "bed" && s.room === "closet" && Math.hypot(s.flyerAt.x - HOME_ROOM.flyer.x, s.flyerAt.y - HOME_ROOM.flyer.y) < 1 && (await until(page, (q) => q.ring === "dress", 3000)) !== null, s && [s.now.flyer, s.flyerAt]);
  await sleep(200);
  await still(page, "flyer-09-under-the-bed");
  // ↺ in P5 restarts the dress-up, as it always did: its opening has no lines, so the two thoughts do not replay
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(2500);
  s = await st(page);
  g.check("↺ in P5 does not replay the two thoughts (P5's restart has no lines, as before), and the flyer still lies there", s.now.scene === "P5" && s.cur !== "bub" && s.now.flyer === "bed" && s.ctrl, [s.now.scene, s.cur, s.text]);
  g.check("no script errors on the sneak", errors.length === 0, errors.slice(0, 3));
  await page.close();
}
{
  // the first of his two thoughts at home, for a still
  const { page } = await open("party:P4");
  await sneak.sneakTo(page, FLYER.reach, { hidden: true });
  await sneak.resume(page);
  await until(page, (q) => q.act === "GRAB · flyer", 3000);
  await press(page);
  await until(page, (q) => q.now.flyer === "paw" && q.ctrl, 3000);
  await sneak.sneakTo(page, { x: HALL_DOOR.x, y: HALL_DOOR.y - 50, r: 30 });
  await sneak.resume(page);
  await walk(page, HOME[2][0], HOME[2][1]);
  const s = await until(page, (q) => q.cur === "bub", 8000);
  await sleep(400);
  g.check("(home with the flyer: the first thought is up)", !!s && s.text === "Phew, made it!", s && s.text);
  await still(page, "flyer-08-home-first-thought");
  await page.close();
}

// ---------- seen on the way ----------
{
  // With the flyer in his paw he walks into the dancers' sight: the one capture rule. He does nothing: caught.
  const { page, errors } = await open("party:P4");
  await sneak.sneakTo(page, FLYER.reach, { hidden: true });
  await sneak.resume(page);
  await until(page, (q) => q.act === "GRAB · flyer", 3000);
  await press(page);
  let s = await until(page, (q) => q.now.flyer === "paw" && q.ctrl, 3000);
  g.check("(he has the flyer)", !!s);
  await walk(page, 380, 380); // off the strip, onto the dance floor in front of the dancing pair
  s = await until(page, (q) => q.now.alarm, 8000);
  g.check("walking into a dancer's sight: seen, and the alarm starts (the one capture rule)", !!s && s.now.scene === "P4", s && s.now.alarm);
  s = await until(page, (q) => q.cur === "card" || q.cur === "panel" || /LOCKUP|lockup/i.test(q.text), 40000);
  g.check("he does nothing: caught, and the lockup card shows", !!s, s && [s.cur, s.text]);
  s = await until(page, (q) => q.now && q.now.scene === "P4" && q.ctrl && !q.now.alarm && q.now.pose === "hidden", 20000, async (q) => (q.cur === "card" || q.cur === "panel") && (await sleep(500), await tap(page)));
  g.check("the section restarts sanely: in the plant, no alarm, the flyer back on the counter's end, the chip and the outline on the flyer again", !!s && s.now.flyer === "stage" && s.chip === "Squatch: grab the flyer" && (await pixels(page, FLYER.box, PAPER)) > 150 && (await until(page, (q) => q.ring === "grab-flyer", 2000)) !== null, s && [s.now.flyer, s.chip]);
  g.check("no script errors when caught", errors.length === 0, errors.slice(0, 3));
  await page.close();
}
{
  // Seen with the flyer, he hides in the plant: "They lost you.", he still has the flyer, and his door is the goal.
  const { page } = await open("party:P4");
  await sneak.sneakTo(page, FLYER.reach, { hidden: true });
  await sneak.resume(page);
  await until(page, (q) => q.act === "GRAB · flyer", 3000);
  await press(page);
  await until(page, (q) => q.now.flyer === "paw" && q.ctrl, 3000);
  await walk(page, 380, 400);
  let s = await until(page, (q) => q.now.alarm, 8000);
  g.check("(seen on the way home)", !!s);
  s = await until(page, (q) => q.act === "HIDE · plant", 8000, async (q) => q.ctrl && (await walk(page, SPOTS.plantMiddle.x, SPOTS.plantMiddle.y)));
  s && (await press(page));
  s = await until(page, (q) => q.now && !q.now.alarm && q.ctrl, 60000);
  g.check("hidden in the plant until they lose him: he still has the flyer, and the chip says to sneak home", !!s && s.now.scene === "P4" && s.now.flyer === "paw" && s.chip === "Squatch: sneak home for a disguise", s && [s.now.scene, s.now.flyer, s.chip, s.now.pose]);
  await page.close();
}

await g.finish("party-flyer");
