/**
 * Brian's notes on the party video of 2026-11-24 (round three), each as a check of what is drawn and what happens:
 *   - the dance: Squatch is drawn once (the pose arms are his only arms; boots on his legs replace his feet);
 *   - the camera's flash is a small burst at the lens, never the whole room going white;
 *   - no walk ring is drawn on a place the goal outline already marks (his door on the run home);
 *   - the hallway doorway: no beard, no humming notes; walking into it bounces him back a short way, quickly, with
 *     a bump, and he thinks his line every time; nothing yanks out of the doorway when the alarm starts;
 *   - the guard who follows him home: his cone starts at his eyes, as tall as he is drawn, the sight rule unchanged,
 *     and he searches (his head turns, he leans, a "?" over him);
 *   - after the guard gives up, the calm seen through the door gap shows Mops hurrying up the hall toward home.
 * Stills at 375 x 812 go to tests/out/party-stills/ (r3-*.png).
 *   node tests/party-round3.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const g = await startGame({ port: 9140, name: "party-round3" });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const toys = await import(join(root, "src", "modules", "party-toys.js"));
const hallway = await import(join(root, "src", "modules", "party-hallway.js"));
const art = await import(join(root, "src", "modules", "party-art.js"));
const dance = await import(join(root, "src", "modules", "party-dance.js"));
const look = await import(join(root, "src", "modules", "squatch-art.js"));

async function open(beat) {
  const o = await g.open("?beat=" + beat, PHONE);
  await page0(o.page);
  return o;
}
const page0 = async (page) => (await page.evaluate(() => window.__ss.lockedReady), await sleep(1200));
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur;
    return {
      now: window.SSQ.beat("ch1-party").now(),
      room: n.room,
      ctrl: !!n.ctrl,
      cur: c ? c.k : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      x: Math.round(n.sq.x),
      y: Math.round(n.sq.y),
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      ring: n.lastRing && n.T - n.lastRing.T < 0.3 ? n.lastRing.id : "",
      note: (n.log || []).filter((l) => l.k === "safe").map((l) => l.text).pop() || "",
      full: !!document.querySelector('canvas[aria-label="dance"]'),
    };
  });
const set = (page, f, arg) => page.evaluate(`(${f})(window.__ss.op.ch1PartyNow, window.__ss.op, ${JSON.stringify(arg || null)})`);
const place = (page, x, y) => page.evaluate((p) => ((window.__ss.op.sq.x = p[0]), (window.__ss.op.sq.y = p[1])), [x, y]);
const walk = (page, x, y) => page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [x, y]);
const press = (page) => page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
const next = (page) => page.evaluate(() => window.__ss.opTap());
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
const played = (page) => page.evaluate(() => (window.SSQ.beat("ch1-party").now() || { sound: { played: [] } }).sound.played);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const like = (a, h, tol = 10) => hex(h).every((v, j) => Math.abs(a[j] - v) <= tol);

// In the page: the game picture's pixels in a box (game positions), counted by colour, after drawing one frame now.
const countIn = (page, box, colours, tol = 4) =>
  page.evaluate(
    ([b, cols, tol]) => {
      window.__ss.drawFrame();
      const c = document.querySelector("canvas"),
        k = c.width / 960,
        x0 = Math.round(b.x0 * k),
        y0 = Math.round(b.y0 * k),
        w = Math.round((b.x1 - b.x0) * k),
        h = Math.round((b.y1 - b.y0) * k),
        d = c.getContext("2d").getImageData(x0, y0, w, h).data,
        out = cols.map(() => 0);
      for (let i = 0; i < d.length; i += 4) cols.forEach((col, j) => Math.abs(d[i] - col[0]) <= tol && Math.abs(d[i + 1] - col[1]) <= tol && Math.abs(d[i + 2] - col[2]) <= tol && out[j]++);
      return out;
    },
    [box, colours, tol],
  );
// In the page: draws the frame twice, with `change` applied for the second, and returns where the two differ
// (game positions): how many pixels, their bounding box, and how far the furthest is from `from`.
const frameDiff = (page, change, undo, from) =>
  page.evaluate(
    `(() => {
      const ss = window.__ss, n = ss.op, p = n.ch1PartyNow, c = document.querySelector("canvas"), k = c.width / 960, ctx = c.getContext("2d");
      const grab = () => (ss.drawFrame(), ctx.getImageData(0, 0, c.width, c.height).data);
      const a = grab();
      const keep = (${change})(p, n);
      const b = grab();
      (${undo})(p, n, keep);
      const from = ${JSON.stringify(from || null)};
      let count = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, far = 0, bright = 0;
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 12) {
          count++; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
          from && (far = Math.max(far, Math.hypot(x / k - from.x, y / k - from.y)));
          b[i] > 240 && b[i + 1] > 240 && b[i + 2] > 225 && bright++;
        }
      }
      return { count: Math.round(count / (k * k)), box: count ? [x0 / k, y0 / k, x1 / k, y1 / k].map(Math.round) : null, far: Math.round(far), bright: Math.round(bright / (k * k)) };
    })()`,
  );

// ---------- the hallway doorway: no beard; a bounce back and his line, every time ----------
{
  const { page, errors } = await open("party:P6");
  // Nothing swishes past the doorway and no notes drift out of it, over more than the old beard's whole rhythm
  // (it showed every 5 seconds): sampled where the beard was drawn (inside the doorway and 30 to each side) and
  // where its green humming notes rose (up to 60 left of it).
  const d = hall.HALL.hallwayDoor,
    where = { x0: d.x0 - 70, x1: Math.min(960, d.x1 + 30), y0: d.y0 - 30, y1: d.y1 };
  let most = [0, 0];
  for (let i = 0; i < 28; i++) {
    const c = await countIn(page, where, [hex("#f4f5f8"), hex("#2bc48a")], 3);
    most = most.map((v, j) => Math.max(v, c[j]));
    await sleep(200);
  }
  g.check("nothing white swishes past the hallway doorway and no notes come out of it (5.6 s watched)", most[0] === 0 && most[1] === 0, most);
  let s = await st(page);
  g.check("the party keeps no beard state", s.now.beard === undefined, s.now.beard);
  g.check("no humming and no swish in the hall", !(await played(page)).some((x) => x === "hum" || x === "swish" || x === "zip"), await played(page));

  // He walks into the doorway: bounced back a short way, quickly, with a bump; then his line.
  const tryDoor = () =>
    page.evaluate(() => {
      const ss = window.__ss,
        n = ss.op;
      n.sq.x = 830;
      n.sq.y = 322;
      ss.tapAt(940, 320);
      const tr = [];
      for (let i = 0; i < 400; i++) {
        ss.tick(1 / 60);
        tr.push([n.sq.x, n.sq.y, n.cur ? n.cur.k : "", n.ctrl ? 1 : 0]);
        if (n.cur && n.cur.k === "bub") break;
      }
      const deep = Math.max(...tr.map((q) => q[0])),
        iDeep = tr.findIndex((q) => q[0] === deep),
        iStop = tr.findIndex((q, i) => i >= iDeep && !q[3]),
        end = tr[tr.length - 1],
        // when he came to rest after the push (the first frame from which he no longer moves)
        iRest = tr.findIndex((q, i) => i > iDeep && Math.abs(q[0] - end[0]) < 0.5);
      let fastest = 0;
      for (let i = iDeep + 1; i <= iRest; i++) fastest = Math.max(fastest, (tr[i - 1][0] - tr[i][0]) * 60);
      return { deep, back: deep - end[0], seconds: (iRest - iDeep) / 60, fastest, y0: tr[iDeep][1], y1: end[1], bubble: end[2] === "bub", text: n.cur && n.cur.b ? n.cur.b.text : "", ctrlDuring: tr.slice(iStop).some((q) => q[3]), bounce: window.SSQ.beat("ch1-party").now().bounce || null };
    });
  const first = await tryDoor();
  g.check("walking into the hallway doorway he reaches it (not stopped far short of it)", first.deep >= hall.HALLWAY_ZONE.x0 && first.deep <= 900, first.deep);
  g.check("he is bounced back a short way (28 to 60)", first.back >= 28 && first.back <= 60 && Math.abs(first.y1 - first.y0) < 12, first);
  g.check("the bounce is quick, not a walk (under 0.35 s, faster than his run)", first.seconds > 0.05 && first.seconds <= 0.35 && first.fastest > 330, first);
  g.check("the kid has no control during the bounce", !first.ctrlDuring, first);
  g.check("then he thinks his line (the approved \"Mops!\" stands in until Brian's new words)", first.bubble && first.text === "Mops!", first.text);
  g.check("the bump sounds", (await played(page)).includes("bump"), await played(page));
  await sleep(150);
  await still(page, "r3-hallway-bounce-line");
  await next(page);
  s = await until(page, (q) => q.ctrl && !q.cur, 4000);
  g.check("after the line he has control again, outside the doorway, in the hall", !!s && s.room === "hall" && !hallway.inHallwayZone({ x: s.x, y: s.y }), s && [s.x, s.y]);
  g.check("he stands clear of Isfred (nobody stands inside anybody)", !!s && Math.hypot(s.x - s.now.isfred.x, s.y - s.now.isfred.y) >= 36, s && [s.x, s.y, s.now.isfred]);
  const second = await tryDoor();
  g.check("the line shows every time he tries, not only the first", second.bubble && second.text === "Mops!" && second.back >= 28, second);
  await next(page);
  // the bump mark is drawn while he is pushed back, at the doorway side of him, and is gone afterwards
  const mark = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    for (let i = 0; i < 60 && !(n.ctrl && !n.cur); i++) ss.tick(1 / 60);
    n.sq.x = 860;
    n.sq.y = 322;
    ss.tapAt(940, 320);
    let b = null;
    for (let i = 0; i < 200 && !b; i++) (ss.tick(1 / 60), (b = window.SSQ.beat("ch1-party").now().bounce));
    ss.tick(1 / 60);
    b = window.SSQ.beat("ch1-party").now().bounce;
    return { b, x: n.sq.x, y: n.sq.y };
  });
  g.check("a bump mark shows where he hit, on the doorway side of him", !!mark.b && mark.b.mark && mark.b.mark.x > mark.x, mark);
  if (mark.b && mark.b.mark) {
    const m = mark.b.mark;
    const lit = await countIn(page, { x0: m.x - m.r, x1: m.x + m.r, y0: m.y - m.r, y1: m.y + m.r }, [hex("#fffdf8"), hex("#ffcf33")], 6);
    g.check("the bump mark is really drawn (its white and yellow)", lit[0] + lit[1] > 12, lit);
    await still(page, "r3-hallway-bounce-bump");
  }
  g.check("no errors at the hallway", errors.length === 0, errors);
  await page.close();
}

// ---------- the alarm: nothing yanks out of the hallway doorway ----------
{
  const { page, errors } = await open("party:P7");
  const d = hall.HALL.hallwayDoor,
    where = { x0: d.x0 - 70, x1: Math.min(960, d.x1 + 110), y0: d.y0 - 30, y1: d.y1 };
  let most = 0;
  for (let i = 0; i < 12; i++) {
    most = Math.max(most, (await countIn(page, where, [hex("#f4f5f8")], 3))[0]);
    await sleep(120);
  }
  const s = await st(page);
  g.check("P7: no beard in the hallway doorway and none yanking out of it", most === 0 && s.now.beard === undefined, [most, s.now.beard]);
  g.check("P7: no zip sound", !(await played(page)).includes("zip"));
  g.check("no errors in P7", errors.length === 0, errors);
  await page.close();
}

// ---------- the camera's flash: a small burst at the lens ----------
{
  const { page, errors } = await open("party:P6");
  await place(page, 150, 590);
  await sleep(300);
  const cam = await page.evaluate(() => window.__ss.op.ch1PartyNow.people.camera);
  const lens = art.cameraLens({ x: cam.x - 28, y: cam.y + 6 }, hall.CAMERA_AIM);
  const df = await frameDiff(page, "(p) => { const was = p.flash; p.flash = 0.25; return was; }", "(p, n, was) => { p.flash = was; }", lens);
  g.check("the flash is drawn (a bright burst at the camera's lens)", df.count > 60 && df.bright > 20, df);
  g.check("the flash stays at the lens: nothing changes further than 40 from it (the room never goes white)", df.count > 0 && df.far <= 40, df);
  // fading: half way through it is still only at the lens
  const half = await frameDiff(page, "(p) => { const was = p.flash; p.flash = 0.12; return was; }", "(p, n, was) => { p.flash = was; }", lens);
  g.check("half way through, the flash is still only at the lens", half.count > 0 && half.far <= 40, half);
  // its length is unchanged: the camera's own rhythm sets it (0.25 s), then it is gone
  const len = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      p = n.ch1PartyNow;
    Object.assign(p.photo, { phase: "count", t: 2.99, n: 1 });
    let on = 0,
      started = false;
    for (let i = 0; i < 120; i++) {
      ss.tick(1 / 60);
      p.flash > 0 && ((started = true), on++);
      if (started && !(p.flash > 0)) break;
    }
    return on / 60;
  });
  g.check("the flash lasts as long as before (0.25 s)", Math.abs(len - toys.PHOTO.flash) < 0.04, len);
  await set(page, (p) => (p.flash = 0.2));
  await page.evaluate(() => window.__ss.drawFrame());
  await still(page, "r3-camera-flash-at-lens");
  g.check("no errors at the camera", errors.length === 0, errors);
  await page.close();
}

// ---------- no walk ring where the goal outline already marks the place ----------
{
  const ring = await import(join(root, "src", "modules", "walk-ring.js"));
  const door = { box: { x0: 426, x1: 528, y0: 600, y1: 622 }, spot: { verb: "", x: hall.HALL_DOOR.x, y: hall.HALL_DOOR.y, r: hall.HALL_DOOR.r } };
  g.check("rule: a tap on the outlined doorway, or in the place that takes him through it, shows no ring", !ring.walkRingShows({ x: 474, y: 581 }, door) && !ring.walkRingShows({ x: 477, y: 590 }, door) && !ring.walkRingShows({ x: 495, y: 566 }, door));
  g.check("rule: a tap on the open floor still shows the ring", ring.walkRingShows({ x: 300, y: 480 }, door) && ring.walkRingShows({ x: 474, y: 500 }, door));
  g.check("rule: with no goal outline on screen the ring always shows", ring.walkRingShows({ x: 474, y: 581 }, null));
  // a button's spot (HIDE · bed works anywhere in the room) hides the ring only on the outlined thing itself
  const bed = { box: { x0: 76, x1: 294, y0: 390, y1: 552 }, spot: { verb: "HIDE", x: 205, y: 500, r: 700 } };
  g.check("rule: a button that works anywhere in the room hides the ring only at its outlined thing", ring.walkRingShows({ x: 600, y: 500 }, bed) && !ring.walkRingShows({ x: 300, y: 560 }, bed));

  // In the game: drawn with and without the walk target, the picture differs only if a ring was drawn there.
  const ringAt = (page, x, y) =>
    page.evaluate(
      async ([x, y]) => {
        const ss = window.__ss,
          n = ss.op;
        ss.tapAt(x, y);
        const t = n.walkTo && { x: n.walkTo.x, y: n.walkTo.y };
        return { t, ring: n.lastRing && { id: n.lastRing.id, fresh: n.T - n.lastRing.T < 0.3 } };
      },
      [x, y],
    );
  const drawnAt = async (page, at) => {
    const df = await frameDiff(page, "(p, n) => { const w = n.walkTo; n.walkTo = null; return w; }", "(p, n, w) => { n.walkTo = w; }", at);
    return df;
  };
  {
    const { page, errors } = await open("party:P7");
    await sleep(300);
    let s = await until(page, (q) => q.ring === "go-home", 3000);
    g.check("P7: his door is outlined", !!s);
    await place(page, 520, 520);
    const a = await ringAt(page, 474, 605);
    const onDoor = a.t ? await drawnAt(page, a.t) : null;
    g.check("P7: tapping his outlined door draws no white ring above the outline", !!a.t && !!onDoor && onDoor.count === 0, { a, onDoor });
    await page.evaluate(() => window.__ss.drawFrame());
    await still(page, "r3-run-home-door-no-ring");
    const b = await ringAt(page, 300, 500);
    const onFloor = b.t ? await drawnAt(page, b.t) : null;
    g.check("P7: tapping the open floor still draws the walk ring there", !!b.t && !!onFloor && onFloor.count > 20 && onFloor.far <= 40, { b, onFloor });
    g.check("no errors (walk ring, P7)", errors.length === 0, errors);
    await page.close();
  }
  {
    // P5, dressed: the home door is outlined (go-party); a tap on it draws no ring either.
    const { page } = await open("party:P5");
    await set(page, (p) => ((p.outfit = { head: "tophat", face: "shades", body: "shirt", legs: "boots" }), (p.phase = "out")));
    await place(page, 600, 480);
    await until(page, (q) => q.ring === "go-party", 3000);
    const a = await ringAt(page, 880, 470);
    const onDoor = a.t ? await drawnAt(page, a.t) : null;
    g.check("P5: tapping the outlined home door draws no ring on it", !!a.t && !!onDoor && onDoor.count === 0, { a, onDoor });
    await page.close();
  }
}

// ---------- the dance: Squatch drawn once ----------
{
  const { page, errors } = await open("party:P6");
  await walk(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4);
  let s = await until(page, (q) => q.act === "DANCE · circle", 8000);
  await press(page);
  s = await until(page, (q) => q.full, 3000);
  g.check("the dance opens", !!s);
  await sleep(300);
  // A pixel of the dance view at a point given in Squatch's own units (feet at 0, up negative), for pose `m`.
  const size = await page.evaluate(() => {
    const c = document.querySelector('canvas[aria-label="dance"]');
    return { w: c.clientWidth, h: c.clientHeight, k: c.width / c.clientWidth };
  });
  const at = async (m, pts, outfit, lost) => {
    await set(page, (p, n, a) => ((p.dance.moves = a.m), (p.dance.pop = 0), a.outfit && (p.outfit = a.outfit), (p.lostPieces = a.lost || [])), { m, outfit, lost });
    await sleep(120);
    const L = dance.danceSquatch(size.w, size.h, { moves: m, pop: 0 });
    return page.evaluate(
      ([L, pts, k]) => {
        const c = document.querySelector('canvas[aria-label="dance"]'),
          ctx = c.getContext("2d");
        return pts.map(([ux, uy]) => {
          const x = L.x + (ux * Math.cos(L.rot) - uy * Math.sin(L.rot)) * L.scale,
            y = L.y + (ux * Math.sin(L.rot) + uy * Math.cos(L.rot)) * L.scale;
          return Array.from(ctx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data).slice(0, 3);
        });
      },
      [L, pts, size.k],
    );
  };
  const Q = look.SQUATCH_LOOK,
    restHands = look.armEnds(null).map((a) => [a.hand.x, a.hand.y]),
    isHis = (c) => like(c, Q.mask, 14) || like(c, Q.fur, 14) || like(c, Q.dark, 14) || like(c, "#1e2430", 14);
  const FULL = { head: "tophat", face: "shades", body: "shirt", legs: "boots" };
  g.check("the dance has four robot poses", dance.POSES.length === 4, dance.POSES.length);
  for (let m = 0; m < dance.POSES.length; m++) {
    const hands = look.armEnds(dance.POSES[m].arms).map((a) => [a.hand.x, a.hand.y]);
    const got = await at(m, [...hands, ...restHands], FULL);
    g.check(`pose ${m + 1}: a paw at the end of each pose arm`, like(got[0], Q.mask, 14) && like(got[1], Q.mask, 14), got.slice(0, 2));
    // the rest arms are gone: where his paws hang at rest there is nothing of his (unless this pose's own arm is there)
    const clearOfPose = restHands.map((r) => hands.every((h2) => Math.hypot(h2[0] - r[0], h2[1] - r[1]) > 6));
    g.check(`pose ${m + 1}: no second pair of arms (nothing of his where his paws hang at rest)`, got.slice(2).every((c, i) => !clearOfPose[i] || !isHis(c)), got.slice(2));
  }
  // Boots on his legs replace his feet: between the boots there is no paw and no leg.
  const between = [
    [-1.6, 0],
    [-1.8, -3.5],
    [1.4, -3.5],
    [-0.6, -0.6],
  ];
  let got = await at(0, between, FULL);
  g.check("boots on his legs replace his feet: nothing of his shows between the boots", got.every((c) => !isHis(c)), got);
  await sleep(100);
  await page.screenshot({ path: join(OUT, "r3-dance-drawn-once.png") });
  // His own feet come back when the boots are not on his legs: lost, or worn somewhere else.
  const feet = [
    [-2.5, 0],
    [3.5, 0],
  ];
  got = await at(0, feet, FULL, ["legs"]);
  g.check("with the boots knocked off, his own feet are drawn", got.every((c) => like(c, Q.mask, 14)), got);
  got = await at(0, feet, { head: "boots", face: "shades", body: "shirt", legs: "" });
  g.check("boots worn on his head do not take his feet away", got.every((c) => like(c, Q.mask, 14)), got);
  // every pose, for Brian's eye
  for (let m = 1; m < 4; m++) {
    await at(m, [], FULL);
    await page.screenshot({ path: join(OUT, `r3-dance-pose-${m + 1}.png`) });
  }
  g.check("no errors in the dance", errors.length === 0, errors);
  await page.close();
}

await g.finish("party-round3");
