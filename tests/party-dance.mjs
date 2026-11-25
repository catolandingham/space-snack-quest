/**
 * The dance: touch the glowing spots (party plan P6, "Dance"; Brian 2026-11-24: "different parts of his body are
 * lighting up ... you have to touch each part of his body where he needs to put his hand", then points for doing
 * it correctly, a time limit, and on a miss "Lose that spot, keep dancing"; src/modules/party-dance.js,
 * party-dance-art.js, party-dance-play.js), at phone size (375 x 812):
 *   - the numbers on their own (no browser): three routines of eight spots, a different order for each song, never
 *     the same spot twice running; every spot's target is 44 px or more across and clear of the next one; in each
 *     spot's pose his paw is on that spot; the cap on stars;
 *   - one spot glows, on him, bright; a ring closes round it and the ring drawn matches the time really left;
 *   - a tap on the glowing spot in time: his paw goes there, that pose, +5 stars shown by the spot and added;
 *   - too slow, or a tap somewhere else on him: no stars, a stumble, the next spot glows, the dance goes on;
 *   - a tap that is not on him does nothing;
 *   - every spot of a routine hit: the bonus once and the big cheer; a routine with a miss: a smaller cheer; then
 *     the next routine; the cap holds (a second routine in the same song pays nothing);
 *   - doing nothing for a long time never ends the dance; it counts as tried after his first three spots;
 *   - its sounds are asked through the party's sounds, and nothing sounds with sound off; no words are drawn.
 *   - he is framed below the band (Brian 2026-11-25: his top hat hid it): hat to boots on the screen, the band's
 *     heads showing above his hat in every pose, with every head piece;
 * Once the dance is open the game's clock is stopped: only the test's own ticks move it (60 a second), with the
 * shipped numbers. Stills go to tests/out/party-stills/ (dance-*.png), or to STILLS if set.
 *   node tests/party-dance.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = process.env.STILLS || join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const W = 375,
  H = 812;
const PHONE = { width: W, height: H, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9211, name: "party-dance" });
const D = await import(join(root, "src", "modules", "party-dance.js"));
const look = await import(join(root, "src", "modules", "squatch-art.js"));
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const card = await import(join(root, "src", "modules", "party-card.js"));
const { DANCE, SPOTS, ROUTINES, POSES } = D;

// ---------- the numbers, on their own ----------
{
  g.check("three routines of eight spots, each spot a real one", ROUTINES.length === 3 && ROUTINES.every((r) => r.length === 8 && r.every((s) => SPOTS[s])));
  g.check("each song has its own order", new Set(ROUTINES.map((r) => r.join())).size === 3);
  g.check("a routine never asks for the same spot twice running, nor from its end to its start", ROUTINES.every((r) => r.every((s, i) => s !== r[(i + 1) % r.length])));
  const fresh = (song) => ({ ...D.newDance(), song });
  const sizes = Object.keys(SPOTS).map((s) => D.spotOnScreen(W, H, fresh(0), s));
  g.check("on a 375 px wide phone every spot's target is 44 px or more across", sizes.every((s) => s.r * 2 >= 44), sizes.map((s) => Math.round(s.r * 2)));
  g.check("every target is on the screen, clear of the close button and the ↺", sizes.every((s) => s.x - s.r > 0 && s.x + s.r < W && s.y - s.r > 70 && s.y + s.r < H), sizes.map((s) => [Math.round(s.x), Math.round(s.y)]));
  let nearest = 1e9;
  for (const r of ROUTINES)
    r.forEach((s, i) => {
      const a = D.spotOnScreen(W, H, fresh(0), s),
        b = D.spotOnScreen(W, H, fresh(0), r[(i + 1) % r.length]);
      nearest = Math.min(nearest, Math.hypot(a.x - b.x, a.y - b.y) - a.r - b.r);
    });
  g.check("each spot is well apart from the next one: their targets never touch", nearest >= 8, Math.round(nearest));
  // In each spot's pose, the paw of that side is on the spot.
  const off = Object.keys(SPOTS).map((s) => {
    const pose = POSES[D.poseIndex(s)],
      hands = look.armEnds(pose.arms).map((a) => Math.hypot(a.hand.x - SPOTS[s].x, a.hand.y - SPOTS[s].y));
    return [s, +Math.min(...hands).toFixed(1)];
  });
  g.check("in each spot's pose a paw is on that spot (inside its glow)", off.every(([, d]) => d <= D.SPOT_R * 0.6), off);
  g.check("every spot has a pose of its own, and no two poses are the same drawing", Object.keys(SPOTS).every((s) => D.poseIndex(s) >= 0) && new Set(POSES.map((q) => JSON.stringify([q.rot, q.arms]))).size === POSES.length, POSES.length);
  // The cap: a song pays for eight spots and one bonus, however long he dances; a new song pays again.
  const pay = {};
  let got = 0;
  for (let i = 0; i < 30; i++) got += D.dancePays(pay, 0, "hit");
  for (let i = 0; i < 4; i++) got += D.dancePays(pay, 0, "perfect");
  g.check("the cap: one song pays at most eight spots and one bonus", got === 8 * DANCE.spotStars + DANCE.perfectStars, got);
  g.check("a new song pays again, and the whole party's dancing pays at most 195", D.dancePays(pay, 1, "hit") === DANCE.spotStars && 3 * (8 * DANCE.spotStars + DANCE.perfectStars) === 195);
  // (3 seconds a spot since 2026-11-25, a starting number for a 10-year-old on a phone; it was 2.5)
  // His top hat hid the band (Brian 2026-11-25, "make the fixes you think best"): he is framed below the band, hat to
  // boots on the screen, in every pose, with every piece he can wear on his head, popping and hopping in a cheer.
  const art = await import(join(root, "src", "modules", "party-art.js")),
    hs = art.BODY_SPOTS.head,
    tops = art.PIECES.map((q) => {
      const ph = hs.w * q.h;
      return { id: q.id, top: -(hs.y - ph / 2 + 3 - ph / 2) + Math.max(1, hs.w * 0.045) / 2 };
    });
  g.check("DANCE_TOP is above his tallest: every head piece's top, a cheer's hop and the pop", tops.every((q) => (q.top + 2.4) * 1.05 <= D.DANCE_TOP), tops);
  const frames = [];
  for (const [w, h] of [
    [W, H],
    [1100, 800],
  ]) {
    const band = D.danceBand(w, h);
    for (const pose of POSES) {
      const at = D.danceSquatch(w, h, { ...D.newDance(), pose: POSES.indexOf(pose), pop: 1 }),
        top = Math.min(...tops.map((q) => D.onScreen(at, 0, -(q.top + 2.4)).y)),
        boots = D.onScreen(at, 0, 4).y;
      frames.push({ w, h, pose: pose.id, top: Math.round(top), bandFeet: Math.round(band.feet), boots: Math.round(boots) });
    }
  }
  g.check("on a phone and a computer, in all ten poses, his tallest hat stays below the band's feet and his boots on the screen", frames.every((f) => f.top > f.bandFeet && f.boots < f.h), frames.filter((f) => !(f.top > f.bandFeet && f.boots < f.h)));
  g.check("the numbers: 3 seconds a spot, 5 stars a spot, 25 for a whole routine", DANCE.spotSeconds === 3 && DANCE.spotStars === 5 && DANCE.perfectStars === 25);
}

// ---------- in the game ----------
async function open(soundOn) {
  const o = await g.open("?beat=party:P6", PHONE);
  await sleep(1200);
  await o.page.evaluate(() => {
    window.__osc = 0;
    const A = window.AudioContext || window.webkitAudioContext,
      osc = A.prototype.createOscillator,
      src = A.prototype.createBufferSource;
    A.prototype.createOscillator = function () {
      window.__osc++;
      return osc.call(this);
    };
    A.prototype.createBufferSource = function () {
      window.__osc++;
      return src.call(this);
    };
    // the words drawn on the dance (its canvas is the whole screen), in screen pixels
    window.__texts = [];
    const fill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, x, y, ...rest) {
      if (this.canvas.getAttribute("aria-label") === "dance") {
        const m = this.getTransform(),
          k = this.canvas.width / this.canvas.clientWidth;
        window.__texts.push({ text: String(text), x: (m.a * x + m.e) / k, y: (m.d * y + m.f) / k, alpha: this.globalAlpha });
      }
      return fill.call(this, text, x, y, ...rest);
    };
  });
  soundOn && (await o.page.click("#ss-sound"));
  await o.page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4]);
  await o.page.waitForFunction(() => window.__ss.op.act && window.__ss.op.act.verb === "DANCE", { timeout: 9000 });
  await o.page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  await o.page.waitForFunction(() => !!document.querySelector('canvas[aria-label="dance"]') && window.__ss.op.ch1PartyNow.dance, { timeout: 4000 });
  // From here only the test's own ticks move the game; the dance view draws when the test asks (its frame loop's
  // next call is kept instead of run).
  await o.page.evaluate(() => {
    window.__frames = {};
    window.requestAnimationFrame = (f) => ((window.__frames[f.name || "game"] = f), 0);
  });
  await sleep(120);
  return o;
}
const draw = (page) => page.evaluate(() => ((window.__texts.length = 0), window.__frames.frame && window.__frames.frame()));
const run = async (page, secs) => {
  await page.evaluate((n) => {
    for (let i = 0; i < n; i++) window.__ss.tick(1 / 60);
  }, Math.round(secs * 60));
  await draw(page);
};
// Ticks until `f(dance, p, n)` is true (at most `max` seconds). Returns the seconds it took, or -1.
const runUntil = async (page, f, max = 10) => {
  const took = await page.evaluate(`(() => { const f = ${f}; for (let i = 0; i <= ${Math.round(max * 60)}; i++) { const n = window.__ss.op, p = n.ch1PartyNow; if (p && f(p.dance, p, n)) return i / 60; window.__ss.tick(1 / 60); } return -1; })()`);
  await draw(page);
  return took;
};
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      p = n.ch1PartyNow,
      d = p && p.dance;
    return {
      d: d ? JSON.parse(JSON.stringify(d)) : null,
      full: !!document.querySelector('canvas[aria-label="dance"]'),
      song: p && p.song,
      done: p && { ...p.done },
      pay: p && JSON.parse(JSON.stringify(p.dancePay || {})),
      clap: p && p.clap,
      ctrl: !!n.ctrl,
      stars: n.stars || 0,
      played: window.SSQ.beat("ch1-party").now().sound.played,
      texts: window.__texts.slice(),
      osc: window.__osc,
    };
  });
const live = (page) => runUntil(page, "(d) => d && d.live", 6);
const tapGlow = async (page) => {
  const s = await st(page);
  await page.touchscreen.tap(s.d.seen.glow.x, s.d.seen.glow.y);
  await draw(page);
  return s.d.seen.glow;
};
// The dance picture's colour at a screen point, as [r, g, b].
const colour = (page, x, y) =>
  page.evaluate(
    ([x, y]) => {
      const c = document.querySelector('canvas[aria-label="dance"]'),
        k = c.width / c.clientWidth;
      return Array.from(c.getContext("2d").getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data).slice(0, 3);
    },
    [x, y],
  );
const near = (a, b, tol) => a.every((v, i) => Math.abs(v - b[i]) <= tol);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const still = (page, name) => page.screenshot({ path: join(OUT, name + ".png") });

{
  const { page, errors } = await open(true);
  let s = await st(page);
  const stars0 = s.stars,
    routine = ROUTINES[s.song % 3];
  g.check("the dance opens with him standing ready and no spot glowing yet", s.full && s.d && !s.d.live && s.d.moves === 0);
  await draw(page);
  const before = await colour(page, D.spotOnScreen(W, H, s.d, routine[0]).x, D.spotOnScreen(W, H, s.d, routine[0]).y);
  const wait = await live(page);
  s = await st(page);
  const glow = s.d.seen.glow,
    want = D.spotOnScreen(W, H, s.d, routine[0]);
  g.check("then one spot glows: the first of this song's routine", wait >= 0 && D.spotNow(s.d) === routine[0] && !!glow, [wait, D.spotNow(s.d)]);
  g.check("the glow is drawn on that spot of his body, 44 px or more across", !!glow && Math.hypot(glow.x - want.x, glow.y - want.y) < 2 && glow.r * 2 >= 44, glow);
  const lit = await colour(page, glow.x, glow.y);
  g.check("the glow is bright and changes the picture where it is", lit[0] > 225 && lit[1] > 215 && !near(lit, before, 30), { before, lit });
  // the ring: drawn where the time left says, and closing as the time runs
  const ringAt = async () => {
    const q = (await st(page)).d.seen.glow;
    // along a line up and to the left from the spot's middle, the furthest pixel of the ring's own colour
    const col = q.left > 0.5 ? "#2bc48a" : q.left > 0.25 ? "#ffb300" : "#e5533d";
    let far = 0;
    for (let r = q.r * 0.8; r < q.r * 2.8; r += 1) (near(await colour(page, q.x - r * 0.7071, q.y - r * 0.7071), hex(col), 24) && (far = r));
    return { drawn: far, left: q.left, r: q.r };
  };
  let ring = await ringAt();
  g.check("a full ring stands well outside the spot", ring.left > 0.97 && ring.drawn > ring.r * 2.1, ring);
  await still(page, "dance-01-a-glowing-spot");
  await run(page, 1);
  s = await st(page);
  ring = await ringAt();
  const real = s.d.left / DANCE.spotSeconds;
  const ringWant = 1 - 1 / DANCE.spotSeconds;
  g.check(`after 1 second of ${DANCE.spotSeconds} the ring says ${Math.round(ringWant * 100)}% left, as the clock does`, Math.abs(real - ringWant) < 0.02 && Math.abs(ring.left - real) < 0.02, [real, ring.left]);
  g.check("and it is drawn there: closer to the spot, by the share of time gone", Math.abs(ring.drawn - ring.r * (1 + 1.3 * real)) <= 6, ring);
  await still(page, "dance-02-the-ring-closing");

  // ---------- in time ----------
  await tapGlow(page);
  s = await st(page);
  g.check("a tap on the glowing spot in time: his first spot, 5 stars", s.d.moves === 1 && s.stars === stars0 + DANCE.spotStars && s.d.marks.join() === "1", [s.d.moves, s.stars - stars0]);
  g.check("he strikes that spot's pose", s.d.pose === D.poseIndex(routine[0]) && !s.d.live, s.d.pose);
  await run(page, 0.15);
  s = await st(page);
  const plus = s.texts.find((t) => t.text === "+5");
  g.check("\"+5\" is drawn by the spot he hit", !!plus && Math.hypot(plus.x - glow.x, plus.y - glow.y) < glow.r * 3.2, plus || s.texts);
  // where the pose puts his paw (the end of that arm), which is inside the spot's glow
  const hand = look.armEnds(POSES[s.d.pose].arms).map((a) => a.hand).sort((a, b) => Math.hypot(a.x - SPOTS[routine[0]].x, a.y - SPOTS[routine[0]].y) - Math.hypot(b.x - SPOTS[routine[0]].x, b.y - SPOTS[routine[0]].y))[0],
    handAt = D.onScreen(D.danceSquatch(W, H, s.d), hand.x, hand.y),
    paw = await colour(page, handAt.x, handAt.y);
  g.check("his paw is on the spot (drawn over his clothes)", Math.hypot(handAt.x - want.x, handAt.y - want.y) < want.r && near(paw, hex(look.SQUATCH_LOOK.mask), 16), [paw, handAt, want]);
  g.check("the hit is heard through the party's sounds", s.played.includes("robot"));
  await still(page, "dance-03-pose-1-a-hit-scores");

  // ---------- too slow ----------
  await live(page);
  s = await st(page);
  g.check("the next spot glows, a different one", D.spotNow(s.d) === routine[1] && routine[1] !== routine[0]);
  const starsA = s.stars,
    took = await runUntil(page, "(d) => !d.live", 5);
  s = await st(page);
  g.check(`the ring closes after the real limit, ${DANCE.spotSeconds} seconds, not before`, Math.abs(took - DANCE.spotSeconds) <= 2 / 60, took);
  g.check("too slow: no stars for that spot, a stumble, and a cross on its mark", s.stars === starsA && s.d.stumble > 0 && s.d.marks.join() === "1,-1" && s.d.moves === 1, [s.stars - starsA, s.d.stumble, s.d.marks]);
  g.check("the miss is heard (\"uhoh\"), and the dance is still open", s.played.includes("uhoh") && s.full && !!s.d);
  await run(page, DANCE.stumble * 0.35);
  await still(page, "dance-04-too-slow-a-stumble");
  const back = await live(page);
  s = await st(page);
  g.check("after the stumble the next spot glows: the dance carries on", back >= 0 && back <= DANCE.stumble + 0.1 && D.spotNow(s.d) === routine[2], [back, D.spotNow(s.d)]);

  // ---------- a tap that is not on him ----------
  const leftB = s.d.left;
  await page.touchscreen.tap(30, 300);
  await page.touchscreen.tap(340, 780);
  s = await st(page);
  g.check("a tap that is not on him does nothing: the same spot still glows, no mark, no stars", s.d.live && D.spotNow(s.d) === routine[2] && s.d.left === leftB && s.d.marks.length === 2 && s.stars === starsA, [s.d.live, s.d.marks]);

  // ---------- a tap on him, on the wrong spot ----------
  const here = s.d.seen.glow,
    wrong = Object.keys(SPOTS).map((k) => D.spotOnScreen(W, H, s.d, k)).filter((q) => Math.hypot(q.x - here.x, q.y - here.y) > here.r + 30).sort((a, b) => Math.hypot(b.x - here.x, b.y - here.y) - Math.hypot(a.x - here.x, a.y - here.y))[2],
    belly = D.spotOnScreen(W, H, s.d, "belly"),
    at = Math.hypot(belly.x - here.x, belly.y - here.y) > here.r + 30 ? belly : wrong;
  await page.touchscreen.tap(at.x, at.y);
  await draw(page);
  s = await st(page);
  g.check("a tap somewhere else on him: that spot is lost (no stars, a stumble), and the dance goes on", s.stars === starsA && s.d.stumble > 0 && s.d.marks.join() === "1,-1,-1" && s.full, [s.d.marks, s.stars - starsA]);
  await run(page, 0.2);
  await still(page, "dance-05-wrong-spot-a-cross");

  // ---------- the rest of this routine: all hit, but it had misses ----------
  const poses = [];
  for (let i = 3; i < 8; i++) {
    await live(page);
    await tapGlow(page);
    await run(page, 0.2);
    poses.push((await st(page)).d.pose);
    i >= 3 && i <= 6 && (await still(page, `dance-0${i + 3}-pose-${i - 1}`));
  }
  s = await st(page);
  g.check("each spot he hits is its own pose", new Set(poses).size >= 4, poses);
  g.check("a routine with misses ends with the smaller cheer, no bonus", s.d.round === 1 && s.d.party > 0 && !s.d.big && s.stars === stars0 + 6 * DANCE.spotStars, [s.d.round, s.d.big, s.stars - stars0]);
  g.check("the smaller cheer is heard (\"clap\"), not the big one", s.played.includes("clap") && !s.played.includes("sparkle"));
  await run(page, 0.5);
  await still(page, "dance-10-smaller-cheer-after-a-miss");

  // ---------- the cap in this song: two spots are still unpaid ----------
  await live(page);
  s = await st(page);
  g.check("then the next routine starts, with a clean row of marks", s.d.i === 0 && s.d.marks.length === 0 && D.spotNow(s.d) === routine[0]);
  for (let i = 0; i < 8; i++) (await live(page), await tapGlow(page), await run(page, 0.05));
  s = await st(page);
  g.check("every spot of a routine hit: the bonus, the big cheer", s.d.big && s.d.party > 0 && s.pay[s.song].bonus, s.d);
  g.check("the cap: this song has now paid eight spots and one bonus, 65 stars in all", s.stars === stars0 + 8 * DANCE.spotStars + DANCE.perfectStars && s.pay[s.song].spots === 8, [s.stars - stars0, s.pay]);
  g.check("the big cheer is heard", s.played.includes("cheer") && s.played.includes("sparkle"));
  await run(page, 0.5);
  s = await st(page);
  g.check("the bonus is shown over his head: \"+25\"", s.texts.some((t) => t.text === "+25"), s.texts);
  await still(page, "dance-11-the-big-cheer");
  // a third routine in the same song, every spot hit: nothing more
  const starsC = s.stars;
  let shown = 0;
  for (let i = 0; i < 8; i++) {
    await live(page);
    await tapGlow(page);
    await run(page, 0.15);
    shown += (await st(page)).texts.filter((t) => /^\+/.test(t.text)).length;
  }
  s = await st(page);
  g.check("the cap holds: another whole routine in the same song pays nothing, and shows no \"+\"", s.stars === starsC && shown === 0 && s.d.big && s.d.round === 3, [s.stars - starsC, shown, s.d.round]);
  const words = new Set();
  for (let i = 0; i < 20; i++) (await run(page, 0.1), (await st(page)).texts.forEach((t) => words.add(t.text)));
  g.check("the dance draws no words, only the numbers of stars", [...words].every((t) => /^\+\d+$/.test(t)), [...words]);

  // ---------- the close button, and "tried" ----------
  await page.touchscreen.tap(W - 36, 36);
  s = await st(page);
  g.check("the close button ends it; having hit three spots or more, the dance counts", !s.full && s.ctrl && s.done.dance === true && s.clap > 0, [s.full, s.done]);
  g.check("no page errors in the dance", errors.length === 0, errors);
  await page.close();
}
{
  // Doing nothing never ends it (a fresh dance near the start of a song, so the song itself does not end it).
  const { page, errors } = await open(false);
  const stars0 = (await st(page)).stars;
  // (a whole routine's time: the first pause, then each of its spots run out and stumbled, and a little more)
  const idle = Math.ceil(DANCE.first + D.ROUTINE_LENGTH * (DANCE.spotSeconds + DANCE.stumble) + 2);
  await run(page, idle);
  const s = await st(page);
  g.check(`${idle} seconds of doing nothing (a routine's time): every spot lost, no stars, and he is still dancing`, s.full && !!s.d && s.stars === stars0 && s.d.round >= 1 && s.d.moves === 0 && s.d.marks.every((m) => m === -1), [s.full, s.stars - stars0, s.d && s.d.round, s.d && s.d.marks]);
  g.check("a routine with every spot lost still ends with the smaller cheer, never the bonus", s.d.round >= 1 && !s.d.big && Object.keys(s.pay).length === 0, s.pay);
  g.check("no page errors doing nothing", errors.length === 0, errors);
  await page.close();
}
{
  // "Tried" is his first three spots: two hits do not count, the third does. Sound is off here.
  const { page, errors } = await open(false);
  for (let i = 0; i < 2; i++) (await live(page), await tapGlow(page));
  await page.touchscreen.tap(W - 36, 36);
  let s = await st(page);
  g.check("two spots hit, then closed: not yet a dance", !s.full && !s.done.dance, s.done);
  g.check("and the try-again card's \"dance\" picture stays a \"?\"", !card.found(s.done).got.dance, s.done);
  g.check("with sound off the dance made no sound", s.osc === 0, s.osc);
  await page.close();
  const o = await open(false);
  for (let i = 0; i < 3; i++) (await live(o.page), await tapGlow(o.page));
  await run(o.page, DANCE.spotSeconds + 0.7); // one spot lost too: sound off for a miss as well
  await o.page.touchscreen.tap(W - 36, 36);
  s = await st(o.page);
  g.check("his first three spots hit, then closed: it counts as danced", !s.full && s.done.dance === true, s.done);
  g.check("and the try-again card's \"dance\" picture fills in (and no other)", card.found(s.done).got.dance && !card.found(s.done).got.snacks, s.done);
  g.check("with sound off, hits and a miss made no sound", s.osc === 0 && s.played.includes("robot") && s.played.includes("uhoh"), [s.osc, s.played.slice(-6)]);
  g.check("no page errors", errors.length === 0 && o.errors.length === 0, [errors, o.errors]);
  await o.page.close();
}
// ---------- the band shows above his top hat, in every pose (Brian 2026-11-25) ----------
{
  const { page, errors } = await open(false);
  const k = await page.evaluate(() => {
    const c = document.querySelector('canvas[aria-label="dance"]');
    return c.width / c.clientWidth;
  });
  const band = D.danceBand(W, H),
    t = band.tall / 100,
    // the middle Croc Boy's crocodile head (party-art.js drawPerson: x -13 to 36, y -98 to -73 of his height), raised
    // by half his biggest jump; a 12 x 12 grid over it
    head = [];
  for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) head.push([band.xs[1] + (-13 + (49 * (i + 0.5)) / 12) * t, band.feet + (-98 + (25 * (j + 0.5)) / 12 - 2) * t]);
  const hidden = [];
  for (let i = 0; i < POSES.length; i++) {
    const got = await page.evaluate(
      (i, pts, k) => {
        const n = window.__ss.op,
          dd = n.ch1PartyNow.dance;
        Object.assign(dd, { pose: i, stumble: 0, party: 0, pop: 0, live: false });
        window.__frames.frame && window.__frames.frame();
        const ctx = document.querySelector('canvas[aria-label="dance"]').getContext("2d");
        return { hat: n.ch1PartyNow.outfit.head, cs: pts.map(([x, y]) => Array.from(ctx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data).slice(0, 3)) };
      },
      i,
      head,
      k,
    );
    const green = got.cs.filter((c) => near(c, hex("#3fae4a"), 40)).length;
    (got.hat !== "tophat" || green < 30) && hidden.push({ pose: POSES[i].id, hat: got.hat, green });
    i === D.poseIndex("cheer") && (await still(page, "dance-12-band-above-his-hat"));
  }
  g.check("in every pose, with the top hat on, the middle Croc Boy's crocodile head shows (not under the hat)", hidden.length === 0, hidden);
  g.check("no page errors (the band above his hat)", errors.length === 0, errors);
  await page.close();
}
await g.finish("party-dance");
