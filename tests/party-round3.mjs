/**
 * Brian's notes on the party video of 2026-11-24 (round three), each as a check of what is drawn and what happens:
 *   - the dance: Squatch is drawn once (the pose arms are his only arms; boots on his legs replace his feet);
 *   - the camera's flash is a small burst at the lens, never the whole room going white;
 *   - no walk ring is drawn on a place the goal outline already marks (his door on the run home);
 *   - the hallway doorway: no beard, no humming notes; walking into it bounces him back a short way, quickly, with
 *     a bump, and he thinks his line every time; nothing yanks out of the doorway when the alarm starts;
 *   - the guard who follows him home carries a flashlight: his search cone is drawn as its beam, from the flashlight
 *     in his hand, the sight rule unchanged, and he searches (his head turns, he leans, a "?" over him).
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
const photo = await import(join(root, "src", "modules", "party-photo.js"));
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
// Stops the game's clock on the frame it is at (for a still of one exact moment), drawing that frame once more.
const freeze = (page) => page.evaluate(() => ((window.requestAnimationFrame = () => 0), window.__ss.drawFrame()));
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
      return { deep, back: deep - end[0], seconds: (iRest - iDeep) / 60, fastest, y0: tr[iDeep][1], y1: end[1], bubble: end[2] === "bub", text: n.cur && n.cur.b ? n.cur.b.text : "", ctrlDuring: iStop < 0 || tr.slice(iStop).some((q) => q[3]), bounce: window.SSQ.beat("ch1-party").now().bounce || null };
    });
  const first = await tryDoor();
  g.check("walking into the hallway doorway he reaches it (not stopped far short of it)", first.deep >= hall.HALLWAY_ZONE.x0 && first.deep <= 900, first.deep);
  g.check("he is bounced back a short way (28 to 60)", first.back >= 28 && first.back <= 60 && Math.abs(first.y1 - first.y0) < 12, first);
  g.check("the bounce is quick, not a walk (under 0.35 s, faster than his run)", first.seconds > 0.05 && first.seconds <= 0.35 && first.fastest > 330, first);
  g.check("the kid has no control during the bounce", !first.ctrlDuring, first);
  g.check("then he thinks \"I can't go there. Mops will see me.\"", first.bubble && first.text === "I can't go there. Mops will see me.", first.text);
  g.check("the bump sounds", (await played(page)).includes("bump"), await played(page));
  await sleep(150);
  await still(page, "r3-hallway-bounce-line");
  await next(page);
  s = await until(page, (q) => q.ctrl && !q.cur, 4000);
  g.check("after the line he has control again, outside the doorway, in the hall", !!s && s.room === "hall" && !hallway.inHallwayZone({ x: s.x, y: s.y }), s && [s.x, s.y]);
  g.check("he stands clear of Isfred (nobody stands inside anybody)", !!s && Math.hypot(s.x - s.now.isfred.x, s.y - s.now.isfred.y) >= 36, s && [s.x, s.y, s.now.isfred]);
  const second = await tryDoor();
  g.check("the line shows every time he tries, not only the first", second.bubble && second.text === "I can't go there. Mops will see me." && second.back >= 28, second);
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
{
  // The last song ends in the very moment he is pushed back: closing time waits until his line is read.
  const { page, errors } = await open("party:P6");
  const r = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      b = window.SSQ.beat("ch1-party"),
      p = n.ch1PartyNow;
    p.song = 2;
    n.sq.x = 860;
    n.sq.y = 322;
    ss.tapAt(940, 320);
    let hit = false;
    for (let i = 0; i < 200 && !(n.cur && n.cur.k === "bub"); i++) {
      ss.tick(1 / 60);
      // the song's clock is put at its end as the push back begins (the test sets the clock, never the result)
      if (!hit && b.now().bounce) ((hit = true), (n.ch1PartyNow.songT = 1e6));
    }
    const during = { hit, scene: b.now().scene, text: n.cur && n.cur.b ? n.cur.b.text : "" };
    ss.opTap();
    for (let i = 0; i < 90 && b.now().scene === "P6"; i++) ss.tick(1 / 60);
    return { during, after: b.now().scene, close: b.now().close };
  });
  g.check("a push back as the last song ends: his line comes first, still in the party", r.during.hit && r.during.scene === "P6" && r.during.text === "I can't go there. Mops will see me.", r.during);
  g.check("and closing time follows once the line is read", r.after === "P8b", r);
  g.check("no errors (push back at closing)", errors.length === 0, errors);
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
    // the group photo's count, at its last moment (the first song has just ended and everyone has set off)
    p.songT = 60;
    ss.tick(1 / 60);
    Object.assign(p.shot, { phase: "count", t: 2.99, n: 1 });
    let on = 0,
      started = false;
    for (let i = 0; i < 120; i++) {
      ss.tick(1 / 60);
      p.flash > 0 && ((started = true), on++);
      if (started && !(p.flash > 0)) break;
    }
    return on / 60;
  });
  g.check("the flash lasts as long as before (0.25 s)", Math.abs(len - photo.PHOTO.flash) < 0.04, len);
  await set(page, (p) => (p.flash = 0.2));
  await page.evaluate(() => window.__ss.drawFrame());
  await still(page, "r3-camera-flash-at-lens");
  g.check("no errors at the camera", errors.length === 0, errors);
  await page.close();
}

// ---------- no walk-tap ring anywhere (Brian 2026-11-26, #51: "remove the white walk-tap ring everywhere") ----------
{
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
    g.check("P7: tapping the open floor draws no ring there either (#51: no walk-tap ring anywhere)", !!b.t && !!onFloor && onFloor.count === 0, { b, onFloor });
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
    // (the dance now moves on by itself, glowing spots and stumbles: the test holds him in pose `m`, nothing glowing)
    await set(page, (p, n, a) => (Object.assign(p.dance, { moves: a.m, pose: a.m, pop: 0, live: false, hold: 1e6, stumble: 0, party: 0, fx: [] }), a.outfit && (p.outfit = a.outfit), (p.lostPieces = a.lost || [])), { m, outfit, lost });
    await sleep(120);
    const L = dance.danceSquatch(size.w, size.h, { moves: m, pose: m, pop: 0 });
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
  // Brian 2026-11-24, "touch the glowing spots": a pose for each of the seven spots on his body, then standing
  // ready, the stumble and the cheer (before: four robot poses, one per tap). Every one is checked below.
  g.check("the dance has ten poses: one for each of his seven spots, standing ready, the stumble, the cheer", dance.POSES.length === 10 && Object.keys(dance.SPOTS).every((s) => dance.poseIndex(s) >= 0), dance.POSES.length);
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

// ---------- the guard who follows him home: his cone from his eyes, his searching look ----------
const watch = await import(join(root, "src", "modules", "party-watch.js"));
// In the page: he runs home from P7's restart (the kid taps his door), then (if asked) hides under the bed, and the
// clock runs until the guard has walked in and started looking round. Everything happens in game ticks.
const runHome = (page, hide) =>
  page.evaluate((hide) => {
    const ss = window.__ss,
      n = ss.op,
      guard = () => n.ch1PartyNow && n.ch1PartyNow.alarm && n.ch1PartyNow.alarm.homeGuard;
    ss.tapAt(477, 600);
    for (let i = 0; i < 900 && n.room !== "closet"; i++) ss.tick(1 / 30);
    for (let i = 0; i < 300 && !(n.ctrl && !n.cur); i++) ss.tick(1 / 30);
    for (let i = 0; i < 20 && !(n.act && n.act.verb === "HIDE"); i++) ss.tick(1 / 30);
    const act = n.act ? n.act.verb : "";
    if (hide) {
      ss.actionDown();
      ss.actionUp();
      for (let i = 0; i < 300 && n.ch1PartyNow.pose !== "bed"; i++) ss.tick(1 / 30);
      // under the bed the "more to find" card shows (round four); "Back to the party": the guard comes in and looks
      for (let i = 0; i < 60 && !n.ch1PartyNow.card; i++) ss.tick(1 / 30);
      window.SSQ.beat("ch1-party").cardChoose("back");
    }
    for (let i = 0; i < 600 && !(guard() && guard().sweep > 0.05); i++) ss.tick(1 / 30);
    return { room: n.room, pose: n.ch1PartyNow.pose, guard: !!guard(), act };
  }, hide);
// In the page: one frame drawn now, with what it drew read off the canvas calls: the "?" and "!" marks (where),
// the guard's head and eyes (drawPerson's ovals), and the cones (the numbers they were drawn from). Game positions.
const drawnNow = (page) =>
  page.evaluate(() => {
    const P = CanvasRenderingContext2D.prototype,
      fill = P.fillText,
      ell = P.ellipse,
      c = document.querySelector("canvas"),
      k = c.width / 960,
      at = (m, x, y) => ({ x: (m.a * x + m.c * y + m.e) / k, y: (m.b * x + m.d * y + m.f) / k }),
      marks = [],
      ovals = [];
    P.fillText = function (t, x, y, ...r) {
      (t === "?" || t === "!") && marks.push({ t, ...at(this.getTransform(), x, y) });
      return fill.call(this, t, x, y, ...r);
    };
    P.ellipse = function (x, y, rx, ry, ...r) {
      ovals.push({ rx, ry, ...at(this.getTransform(), x, y) });
      return ell.call(this, x, y, rx, ry, ...r);
    };
    window.__ss.drawFrame();
    P.fillText = fill;
    P.ellipse = ell;
    const g = window.SSQ.beat("ch1-party").now().homeGuard;
    return { marks, lens: ovals.find((o) => o.rx === 1.6 && o.ry === 3.4) || null, eyes: ovals.filter((o) => o.rx === 1.8 && o.ry === 1.8), head: ovals.find((o) => o.rx === 12 && o.ry === 12) || null, cones: window.__ss.conesDrawn().filter((q) => q.room === "closet"), g, sq: { x: window.__ss.op.sq.x, y: window.__ss.op.sq.y } };
  });
{
  const size = { half: 0.42, len: 210 };
  // The sight rule itself, in numbers: a cone lifted for the drawing sees exactly what the unlifted cone sees, and
  // exactly what the rule saw before (from 28 above the guard's feet to 20 above Squatch's).
  let differs = 0,
    seen = 0;
  const guardLook = await import(join(root, "src", "modules", "party-guard-look.js"));
  for (const f of [-1, 1])
    for (let a = Math.PI - 0.6; a <= Math.PI + 0.6; a += 0.15)
      for (let x = 400; x <= 900; x += 20)
        for (let y = 360; y <= 580; y += 20) {
          const c = watch.coneFrom("g", 770, 470, a, size, guardLook.torchShift({ turn: Math.sin(a * 7) }, 187.5, f)),
            was = watch.distToCone(x, y - 20, 770, 470 - 28, a, size.half, size.len) <= 0;
          watch.coneSees(c, { x, y }) !== was && differs++;
          was && seen++;
        }
  g.check("rule: drawing the cone as the flashlight's beam changes nothing about who is seen (5,400 places and looks compared with the rule as it was)", differs === 0 && seen > 200, { differs, seen });
  {
    // What the kid reads off the picture: the beam finds him when it lands on his head. The point of him the beam
    // is drawn to see must be on his own head as drawn at home (three times hall size), whichever way the guard
    // faces and however he leans.
    const Q = look.SQUATCH_LOOK,
      sc = 3,
      headY = -(Q.leg + Q.bodyH + Q.head * 0.75) * sc,
      on = [];
    for (const f of [-1, 1])
      for (const turn of [-1, 0, 1]) {
        const pt = watch.seenPointDrawn({ x: 0, y: 0 }, guardLook.torchShift({ turn }, 187.5, f));
        on.push(((pt.x / (Q.head * 0.92 * sc)) ** 2 + ((pt.y - headY) / (Q.head * 0.85 * sc)) ** 2 <= 1 ? 1 : 0));
      }
    g.check("rule: the point of him the beam is drawn to see is on his head (so the beam finds him when it lands on his head)", on.every(Boolean), on);
  }

  const { page, errors } = await open("party:P7");
  const home = await runHome(page, true);
  g.check("he runs home, hides under the bed, and the guard follows him in", home.room === "closet" && home.pose === "bed" && home.guard, home);
  // Over the guard's whole look round: where his cone is drawn from, his head, his lean, the mark over him.
  const frames = [];
  for (let i = 0; i < 40; i++) {
    const d = await drawnNow(page);
    // (his look round ends when he leaves, or, after a party alarm, when Mops comes in and he stands aside: 2026-11-25)
    if (!d.g || d.g.leaving || d.g.held) break;
    frames.push(d);
    await page.evaluate(() => {
      for (let j = 0; j < 2; j++) window.__ss.tick(1 / 30);
    });
  }
  const f0 = frames[0];
  g.check("the guard is drawn much bigger than in the hall (about 187 tall)", !!f0 && f0.g.tall > 150, f0 && f0.g.tall);
  g.check(
    "his search cone is drawn as his flashlight's beam: it starts at the flashlight's lens in his hand (as drawn), never at his legs",
    frames.length > 10 && frames.every((d) => d.cones.length === 1 && d.lens && Math.hypot(d.cones[0].ox - d.lens.x, d.cones[0].oy - d.lens.y) < 3 && d.cones[0].oy < d.g.y - d.g.tall * 0.4 && d.cones[0].oy > d.g.y - d.g.tall * 0.7),
    frames.slice(0, 2).map((d) => [d.cones, d.lens, d.g.y, d.g.tall]),
  );
  g.check("the cone's size is unchanged (the pinned length and width)", frames.every((d) => d.cones[0].len === 210 && d.cones[0].half === 0.42), f0 && f0.cones);
  g.check("under the bed he is not seen: the guard never sees him", frames.every((d) => !d.g.sees));
  const turns = frames.map((d) => d.g.turn);
  g.check("his head turns from side to side as he looks (both ways)", Math.max(...turns) > 0.6 && Math.min(...turns) < -0.6, [Math.min(...turns), Math.max(...turns)]);
  // measured on the drawing: his eyes sit to one side of his head's middle, then to the other
  const eyeOff = frames.filter((d) => d.head && d.eyes.length === 2).map((d) => ({ turn: d.g.turn, off: ((d.eyes[0].x + d.eyes[1].x) / 2 - d.head.x) * d.g.f, lean: (d.head.x - d.g.x) * d.g.f }));
  const fwd = eyeOff.filter((q) => q.turn > 0.6).map((q) => q.off),
    back = eyeOff.filter((q) => q.turn < -0.6).map((q) => q.off);
  g.check("drawn: his eyes slide across his face as his head turns (4 px or more each way)", fwd.length > 0 && back.length > 0 && Math.min(...fwd) > 4 && Math.max(...back) < -4, { fwd: fwd.slice(0, 3), back: back.slice(0, 3) });
  g.check("drawn: he leans in to look (his head ahead of his feet, the way he faces)", eyeOff.length > 0 && eyeOff.every((q) => q.lean > 3), eyeOff.slice(0, 4).map((q) => q.lean));
  g.check(
    "a \"?\" is drawn over his head all the time he looks, and no \"!\"",
    frames.every((d) => d.marks.length === 1 && d.marks[0].t === "?" && d.marks[0].y < d.g.y - d.g.tall && Math.abs(d.marks[0].x - d.g.x) < 40),
    frames.slice(0, 2).map((d) => d.marks),
  );
  g.check("no line is spoken while he searches", (await st(page)).cur !== "bub");
  await page.evaluate(() => window.__ss.drawFrame());
  await still(page, "r3-home-guard-searching");
  g.check("no errors (the guard at home, hidden)", errors.length === 0, errors);

  await page.close();
}
{
  // Not hidden: he is seen as before (the guard's "!" and he walks at him), and the cone he is seen by is the one drawn.
  const { page, errors } = await open("party:P7");
  const home = await runHome(page, false);
  await freeze(page); // from here only the test's own ticks move the game
  g.check("at home, not hidden: HIDE · bed is offered", home.room === "closet" && home.act === "HIDE", home);
  let saw = null;
  for (let i = 0; i < 80 && !saw; i++) {
    const d = await drawnNow(page);
    if (d.g && d.g.sees) ((saw = d), await freeze(page));
    else
      await page.evaluate(() => {
        const n = window.__ss.op;
        // he stands where the kid left him, in the room (the test holds him still)
        window.__ss.tick(1 / 30);
        n.walkTo = null;
      });
  }
  g.check("standing in the room he is seen (as before the beam): the guard's \"!\" is drawn, no \"?\"", !!saw && saw.marks.length === 1 && saw.marks[0].t === "!", saw && saw.marks);
  if (saw) {
    // On the picture: when he is seen from further than the guard's reach of 70, the beam as drawn lies on his
    // head as drawn (some part of his head is inside it).
    const c = saw.cones[0],
      Qh = look.SQUATCH_LOOK,
      sc = saw.g.tall / 62.5,
      hy = saw.sq.y - (Qh.leg + Qh.bodyH + Qh.head * 0.75) * sc;
    let onHead = 0;
    for (let ax = -1; ax <= 1; ax += 0.25) for (let ay = -1; ay <= 1; ay += 0.25) ax * ax + ay * ay <= 1 && watch.distToCone(saw.sq.x + ax * Qh.head * 0.92 * sc, hy + ay * Qh.head * 0.85 * sc, c.ox, c.oy, c.a, c.half, c.len) <= 0 && onHead++;
    const far = Math.hypot(saw.sq.x - saw.g.x, saw.sq.y - saw.g.y) >= 70;
    g.check("when he is seen (from further than the guard's reach), the beam as drawn lies on his head", far && onHead > 0, { far, onHead, c, sq: saw.sq });
    // Nothing is drawn over Squatch: inside the yellow cone the fur of his head keeps its own colour (the cone lies
    // under him, as in the hall). Sampled at four places on his brow and temples, in his own units.
    const Q = look.SQUATCH_LOOK,
      spots = [
        [11.5, -35.5, Q.fur],
        [-11.5, -35.5, Q.fur],
        [9, -38, Q.fur],
        [-9, -38, Q.fur],
      ];
    const got = await page.evaluate((spots) => {
      const n = window.__ss.op,
        cv = document.querySelector("canvas"),
        k = cv.width / 960,
        sc = window.SSQ.engine().squatchScale();
      return spots.map(([ux, uy]) => {
        const x = n.sq.x + ux * sc * (n.sq.f || 1),
          y = n.sq.y + uy * sc;
        return { x, y, c: Array.from(cv.getContext("2d").getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data).slice(0, 3) };
      });
    }, spots);
    const inYellow = got.filter((q) => watch.distToCone(q.x, q.y, c.ox, c.oy, c.a, c.half, c.len) <= 0).length;
    g.check("the cone lies under Squatch: inside the yellow the fur of his head keeps its own colour", inYellow > 0 && got.every((q, i) => like(q.c, spots[i][2], 10)), { inYellow, got: got.map((q) => q.c) });
    await still(page, "r3-home-guard-sees-him");
  }
  g.check("no errors (the guard at home, seen)", errors.length === 0, errors);
  await page.close();
}

await g.finish("party-round3");
