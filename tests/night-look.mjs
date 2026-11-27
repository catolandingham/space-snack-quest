/**
 * The night look (src/modules/night-look.js; Brian, 2026-11-26: "Make sure it's not just the hall dark at night, but
 * all rooms are different at night versus daytime."):
 *   - when it is night: from the party night's start (the party beat's state is set) until Day 2 begins, and whenever
 *     the older program marks a night scene (ch1Night);
 *   - each night beat draws its room's night look (the tinted picture, or the bay's own locked night picture) and
 *     each day beat does not: the party at home (P1, P8) and in the hall (P2, P6 with the band's lights), the
 *     evening at home after the party (TV story and bedtime; the bedtime story's crate front and Mops's mop bucket
 *     under the night look, its lights-out dim on top), against Day 1's morning at home and Day 2 at home, in
 *     the hall and in the hallway;
 *   - Day 2's start: dark, the black lifts on the night look, then the morning comes up (home-morning.js NIGHT_LIFT);
 *   - pixels: the night room's wall is darker and bluer than the same wall by day, and the lit things (the hall's
 *     window onto space and its FUR alarm, home's TV screen) stay as bright as by day.
 * Stills at 375 px go to tests/out/night-stills/ (day and night of each room).
 *   node tests/night-look.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = join(root, "tests", "out", "night-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true };
const NL = await import(join(root, "src", "modules", "night-look.js"));
const g = await startGame({ port: 9741, name: "night-look" });

// ---------- when it is night (no page) ----------
const at = (s) => NL.isNightNow((k) => s[k]);
g.check("Day 1 morning (no party yet) is day", !at({}));
g.check("the party night (its state set, Day 2 not begun) is night", at({ ch1PartyNow: { scene: "P2" } }));
g.check("after the party, the TV story and bedtime (party done, Day 2 not begun) is night", at({ ch1PartyNow: { scene: "done" } }));
g.check("once Day 2 begins it is day", !at({ ch1PartyNow: { scene: "done" }, ch1Day2: true }));
g.check("a night scene of the older program (ch1Night) is night, even on Day 2", at({ ch1Night: true, ch1Day2: true }));
g.check("every room has a lit list or its own night picture", ["hall", "closet", "passage", "office", "hangar"].every((r) => Array.isArray(NL.LIT_BY_NIGHT[r]) || NL.nightPictureFor(r)));

// ---------- in the game ----------
// Frames: the frame drawn now, what night look it drew, and colours at game points (the canvas is the 960 x 640
// picture scaled by k).
const frame = (page, pts) =>
  page.evaluate((pts) => {
    const ss = window.__ss,
      c = document.querySelector("canvas"),
      k = c.width / 960,
      x = c.getContext("2d");
    window.SSQ.nightDrawn();
    ss.drawFrame();
    const drew = window.SSQ.nightDrawn(),
      px = {};
    for (const [id, p] of Object.entries(pts)) {
      const d = x.getImageData(Math.round(p.x * k), Math.round(p.y * k), 1, 1).data;
      px[id] = [d[0], d[1], d[2]];
    }
    const n = ss.op;
    return { drew, px, room: n.room, scene: n.scene, night: window.SSQ.nightNow() };
  }, pts);
const still = async (page, name) => {
  await page.setViewport({ ...PHONE, deviceScaleFactor: 2 });
  await sleep(150);
  await page.evaluate(() => window.__ss.drawFrame());
  await page.screenshot({ path: join(OUT, name + ".png") });
};
async function open(q) {
  const o = await g.open(q, PHONE);
  await o.page.evaluate(() => window.__ss.lockedReady);
  await sleep(900);
  await o.page.evaluate(() => (window.requestAnimationFrame = () => 0));
  return o;
}
const bright = (p) => p[0] + p[1] + p[2];
// (blue against red: night is bluer)
const blueShare = (p) => p[2] / Math.max(1, p[0]);
const same = (a, b, tol = 12) => a.every((v, i) => Math.abs(v - b[i]) <= tol);

// Points (game positions) on each room's picture where nobody stands and nothing is drawn over it.
const HALL_PTS = { wall: { x: 720, y: 40 }, window: { x: 150, y: 120 }, fur: { x: 893, y: 156 } };
const HOME_PTS = { wall: { x: 330, y: 90 }, tv: { x: 600, y: 160 } };
const PASSAGE_PTS = { wall: { x: 120, y: 120 } };

const results = {};
// Day 1's morning at home (no party yet)
{
  const { page, ctx, errors } = await open("?ch=1");
  await page.evaluate(() => {
    const n = window.__ss.op;
    window.SSQ.engine().enterRoom("closet", "Q1");
    n.q = [];
    n.cur = null;
  });
  results.homeDay = await frame(page, HOME_PTS);
  g.check("Day 1 morning at home: day (no night look drawn)", !results.homeDay.night && !results.homeDay.drew.closet, results.homeDay);
  await still(page, "home-day1-morning");
  // the TV story's evening and bedtime: the party is over (its state "done", as party.js finish() saves it), home, Day 2 not begun
  await page.evaluate(() => {
    const n = window.__ss.op;
    n.ch1PartyNow = { scene: "done" };
    n.ch1Day2 = false;
  });
  results.homeEvening = await frame(page, HOME_PTS);
  g.check("the evening at home after the party (TV story, bedtime): the home room's night look", results.homeEvening.night && results.homeEvening.drew.closet && results.homeEvening.drew.closet.tint > 0.3, results.homeEvening);
  await still(page, "home-evening");
  // Day 2 begins
  await page.evaluate(() => (window.__ss.op.ch1Day2 = true));
  results.homeDay2 = await frame(page, HOME_PTS);
  g.check("Day 2 at home (the party state still set): day again", !results.homeDay2.night && !results.homeDay2.drew.closet, results.homeDay2);
  g.check("no page errors (home)", errors.length === 0, errors);
  await ctx.close();
}
// Day 2 by its own link, in the hall and the hallway (the older program's jump beats)
{
  const { page, ctx, errors } = await open("?beat=day2");
  results.day2 = await frame(page, HOME_PTS);
  g.check("Day 2 (its link): day", !results.day2.night && !Object.keys(results.day2.drew).length, results.day2);
  // (with its zoom-in card and queue cleared, so the room shows plain)
  // Day 2 at home (beat 22) by day, then in a night scene of the older program (ch1Night: night one): the taller closet,
  // drawn from the home picture, is cut from the night look too (no bright closet)
  // (a point in the part the taller closet adds above the picture's own closet: wall in the picture)
  const CLOSET = { closet: { x: 70, y: 150 } };
  await page.evaluate(() => (window.__ss.ch1JumpBeat(22), Object.assign(window.__ss.op, { ch1Zoom: null, q: [], cur: null }), window.__ss.settleRoom()));
  const closetDay = await frame(page, CLOSET);
  await page.evaluate(() => (window.__ss.op.ch1Night = true));
  const closetNight = await frame(page, CLOSET);
  await page.evaluate(() => (window.__ss.op.ch1Night = false));
  g.check("Day 2 at home at night (ch1Night): the taller closet is the night one", closetNight.night && closetNight.drew.closet && bright(closetDay.px.closet) < 600 && bright(closetNight.px.closet) < bright(closetDay.px.closet) * 0.7, { day: closetDay.px.closet, night: closetNight.px.closet });
  // the lunch sneak (beat 25, Day 2's lunch): day
  await page.evaluate(() => (window.__ss.ch1JumpBeat(25), Object.assign(window.__ss.op, { ch1Zoom: null, q: [], cur: null }), window.__ss.settleRoom()));
  results.lunch = await frame(page, HALL_PTS);
  g.check("the lunch sneak (beat 25): day", !results.lunch.night && !Object.keys(results.lunch.drew).length, results.lunch);
  await still(page, "lunch-sneak-day2");
  await page.evaluate(() => (window.__ss.ch1JumpBeat(27), Object.assign(window.__ss.op, { ch1Zoom: null, q: [], cur: null }), window.__ss.settleRoom()));
  results.hallDay = await frame(page, HALL_PTS);
  g.check("Day 2 in the hall (beat 27): day", results.hallDay.room === "hall" && !results.hallDay.night && !results.hallDay.drew.hall, results.hallDay);
  await still(page, "hall-day2");
  await page.evaluate(() => (window.__ss.ch1JumpBeat(37), Object.assign(window.__ss.op, { ch1Zoom: null, q: [], cur: null }), window.__ss.settleRoom()));
  results.passageDay = await frame(page, PASSAGE_PTS);
  g.check("Day 2 in the hallway (beat 37): day", results.passageDay.room === "passage" && !results.passageDay.night && !results.passageDay.drew.passage, results.passageDay);
  await still(page, "hallway-day2");
  // the same hallway in a night scene of the older program (ch1Night): tinted, the keypad kept lit
  await page.evaluate(() => (window.__ss.op.ch1Night = true));
  results.passageNight = await frame(page, PASSAGE_PTS);
  g.check("the hallway in a night scene (ch1Night): its night look", results.passageNight.night && results.passageNight.drew.passage && results.passageNight.drew.passage.lit === 1, results.passageNight);
  await still(page, "hallway-night");
  await page.evaluate(() => (window.__ss.op.ch1Night = false));
  // the loading bay at night (night one, beat 42b: the evening's bin, debug beat 142): its own locked night picture
  await page.evaluate(() => (window.__ss.ch1JumpBeat(142), window.__ss.settleRoom()));
  results.bayNight = await frame(page, {});
  g.check("the loading bay at night (beat 42b): its locked night picture", results.bayNight.room === "hangar" && results.bayNight.drew.hangar && results.bayNight.drew.hangar.picture, results.bayNight);
  g.check("no page errors (Day 2)", errors.length === 0, errors);
  await ctx.close();
}
// The party night: at home (P1) and in the hall (P2), the band's lights (P6), closing time (P8b), home early (P8c)
for (const [beat, room, name, pts] of [
  ["party", "closet", "home-party-P1", HOME_PTS],
  ["party:P2", "hall", "hall-party-P2", HALL_PTS],
  ["party:P6", "hall", "hall-party-P6-lights", HALL_PTS],
  ["party:P8b", "hall", "hall-party-P8b-closing", HALL_PTS],
  ["party:P8c", "closet", "home-party-P8c", HOME_PTS],
]) {
  const { page, ctx, errors } = await open("?beat=" + beat);
  const f = await frame(page, pts);
  results[name] = f;
  g.check(`${beat}: the ${room === "hall" ? "hall" : "home room"} draws its night look`, f.night && f.room === room && f.drew[room] && f.drew[room].tint > 0.3, f);
  await still(page, name);
  if (beat === "party") {
    // Squatch behind his bed: the piece of the bed the room cuts from its picture and draws again over him is the
    // night one too (no bright patch)
    const BED = { x: 120, y: 520 };
    const away = await frame(page, { bed: BED });
    await page.evaluate(() => Object.assign(window.__ss.op.sq, { x: 200, y: 500 }));
    const behind = await frame(page, { bed: BED });
    g.check("at night the bed's piece drawn over Squatch behind it is the night one", same(away.px.bed, behind.px.bed, 6) && bright(behind.px.bed) < 500, { away: away.px.bed, behind: behind.px.bed });
  }
  g.check(`no page errors (${beat})`, errors.length === 0, errors);
  await ctx.close();
}

// The bedtime story (beat 21) after the party: in bed under the night look (the crate's front wall drawn over him and
// Mops's mop bucket from the night look too), then the lights-out dim on top of it
{
  const { page, ctx, errors } = await open("?ch=1");
  const BED_PTS = { ...HOME_PTS, crate: { x: 150, y: 480 }, bucket: { x: 559, y: 548 }, bucketFloor: { x: 528, y: 572 } };
  await page.evaluate(() => (window.SSQ.engine().enterRoom("closet", "Q1"), Object.assign(window.__ss.op, { q: [], cur: null })));
  results.bedDay = await frame(page, BED_PTS);
  await page.evaluate(() => {
    const n = window.__ss.op;
    n.q = [];
    n.cur = null;
    // (the party is over, as party.js finish() saves it, and beat 20 starts as the party's endings start it)
    n.ch1PartyNow = { scene: "done" };
    window.SSQ.engine().tvStory();
  });
  // tap through the TV story and the bedtime story's pictures and lines, stopping in bed (the ask) and at the snores
  const until = (phases) =>
    page.evaluate((phases) => {
      const ss = window.__ss,
        n = ss.op,
        beat = window.SSQ.beat("ch1-bedtime-story");
      for (let i = 0; i < 8000 && !n.ch1Day2; i++) {
        const d = beat.debug();
        if (phases.includes(d.phase) && !(n.cur && n.cur.k === "cutaway")) return d.phase;
        const c = n.cur;
        c && ["card", "cutaway", "bub", "panel"].includes(c.k) && !c.auto && ((n.bt = 1), ss.opTap());
        ss.tick(0.05);
      }
      return "";
    }, phases);
  const inBed = await until(["ask", "line"]);
  results.bedAsk = await frame(page, BED_PTS);
  const crate1 = await page.evaluate(() => window.SSQ.beat("ch1-bedtime-story").debug().drew);
  g.check("bedtime (in bed, before lights out): the home room's night look, the crate's front wall drawn over him", !!inBed && results.bedAsk.night && results.bedAsk.drew.closet && crate1 && crate1.crateFront, { inBed, f: results.bedAsk, crate1 });
  await still(page, "home-bedtime-in-bed");
  await until(["snore2"]);
  for (let i = 0; i < 20; i++) await page.evaluate(() => window.__ss.tick(0.05));
  results.bedSnore = await frame(page, BED_PTS);
  const dim = await page.evaluate(() => window.SSQ.beat("ch1-bedtime-story").debug().drew);
  g.check("lights out: the bedtime story's dim goes on top of the night look", results.bedSnore.night && results.bedSnore.drew.closet && dim && dim.dim > 0.4 && bright(results.bedSnore.px.wall) < bright(results.bedAsk.px.wall) * 0.8, { dim, ask: results.bedAsk.px.wall, snore: results.bedSnore.px.wall });
  await still(page, "home-bedtime-lights-out");
  // Day 2's start (the home morning, beat 22): dark, then the black lifts on the night look, then the morning comes up
  // (ticks to the night step, then through it, recording each frame; `stopAt`: stop once the black is under it)
  const dawnRun = (stopAt) =>
    page.evaluate((stopAt) => {
      const ss = window.__ss,
        n = ss.op,
        hm = window.SSQ.beat("ch1-home-morning"),
        step = () => hm.debug().state && hm.debug().state.step,
        out = [];
      for (let i = 0; i < 8000 && step() !== "night"; i++) {
        const c = n.cur;
        c && ["card", "cutaway", "bub", "panel"].includes(c.k) && !c.auto && ((n.bt = 1), ss.opTap());
        ss.tick(0.05);
      }
      for (let i = 0; i < 120 && step() === "night"; i++) {
        ss.drawFrame();
        const d = hm.debug().drew || {};
        out.push({ t: +hm.debug().state.t.toFixed(2), dark: d.dark, k: d.nightK });
        if (d.dark != null && d.dark < stopAt) break;
        ss.tick(0.05);
      }
      return { out, day2: !!n.ch1Day2, step: step() };
    }, stopAt);
  const dawn1 = await dawnRun(0.01);
  await still(page, "home-day2-start-night");
  const dawn2 = await dawnRun(-1),
    dawn = { out: [...dawn1.out, ...dawn2.out], day2: dawn2.day2, step: dawn2.step };
  const clear = dawn.out.filter((f) => f.dark === 0 && f.k === 1),
    falls = dawn.out.every((f, i) => !i || (f.k <= dawn.out[i - 1].k && f.dark <= dawn.out[i - 1].dark));
  const mid = clear[0];
  g.check("Day 2's start: dark, then the black lifts all the way on the night look (full night tint, several frames), then the morning comes up (no tint left); the black and the tint only ever go down", dawn.day2 && dawn.out.length > 10 && dawn.out[0].dark === 1 && dawn.out[0].k === 1 && clear.length >= 5 && falls && dawn.out[dawn.out.length - 1].k < 0.1, { first: dawn.out[0], mid, last: dawn.out[dawn.out.length - 1], step: dawn.step });
  results.dawnDay = await frame(page, BED_PTS);
  g.check("after Day 2's start: day (no night look)", !results.dawnDay.night && !results.dawnDay.drew.closet, results.dawnDay);
  g.check("no page errors (bedtime)", errors.length === 0, errors);
  await ctx.close();
}

// ---------- pixels: night is darker and bluer; the lit things stay lit ----------
g.check("in bed at night the crate's front wall drawn over him is the night one (much darker than by day)", bright(results.bedAsk.px.crate) < bright(results.bedDay.px.crate) * 0.7, { night: results.bedAsk.px.crate, day: results.bedDay.px.crate });
g.check("at night the floor patch under Mops's mop bucket comes from the night look", bright(results.bedAsk.px.bucketFloor) < bright(results.bedDay.px.bucketFloor) * 0.7, { night: results.bedAsk.px.bucketFloor, day: results.bedDay.px.bucketFloor });
g.check("at night Mops's mop bucket (drawn in code) is under the night tint too", bright(results.bedAsk.px.bucket) < bright(results.bedDay.px.bucket) * 0.75, { night: results.bedAsk.px.bucket, day: results.bedDay.px.bucket });
const H = results["hall-party-P2"],
  D = results.hallDay;
g.check("the hall's wall at night is much darker than by day", bright(H.px.wall) < bright(D.px.wall) * 0.65, { night: H.px.wall, day: D.px.wall });
g.check("the hall's wall at night is bluer than by day", blueShare(H.px.wall) > blueShare(D.px.wall) * 1.12, { night: H.px.wall, day: D.px.wall });
g.check("the hall's window onto space stays as bright at night as by day (kept lit)", same(H.px.window, D.px.window), { night: H.px.window, day: D.px.window });
g.check("the hall's FUR alarm stays as bright at night as by day (kept lit)", same(H.px.fur, D.px.fur), { night: H.px.fur, day: D.px.fur });
for (const k of ["home-party-P1", "home-party-P8c", "homeEvening"])
  g.check(`home at night (${k}): the wall much darker and bluer than Day 1's morning`, bright(results[k].px.wall) < bright(results.homeDay.px.wall) * 0.65 && blueShare(results[k].px.wall) > blueShare(results.homeDay.px.wall) * 1.12, { night: results[k].px.wall, day: results.homeDay.px.wall });
for (const k of ["home-party-P1", "homeEvening"]) g.check(`home at night (${k}): the TV's screen keeps its look (kept as by day)`, same(results[k].px.tv, results.homeDay.px.tv), { night: results[k].px.tv, day: results.homeDay.px.tv });
g.check("home on Day 2 is the same as Day 1's morning (day)", same(results.homeDay2.px.wall, results.homeDay.px.wall, 4), { day2: results.homeDay2.px.wall, day1: results.homeDay.px.wall });
g.check("the hallway at night: the wall much darker than by day", bright(results.passageNight.px.wall) < bright(results.passageDay.px.wall) * 0.65, { night: results.passageNight.px.wall, day: results.passageDay.px.wall });

await g.finish("night-look");
