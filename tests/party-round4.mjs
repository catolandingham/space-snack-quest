/**
 * Party round four (Brian's answers of 2026-11-24, asks/video-notes-2026-11-24/ANSWERS.md): the "more to find"
 * card and the new ending after an alarm (src/modules/party-card.js, party-after-alarm.js), at phone size.
 *   - The card shows once he is under the bed: the whole screen, its own ↺, the game waiting behind it; its words
 *     word for word; five pictures, the found ones filled in and the rest "?" tiles; two big buttons, or with
 *     everything found the other line and only "Keep going". It fits a phone and a computer screen.
 *   - "Back to the party": the guard comes in, sweeps the room and leaves; "They lost you."; Mops does not come; he
 *     comes out, puts back the pieces he lost at his closet and walks out through his door; the party carries on
 *     with what he found, the song and the clock (at least 60 seconds left); a later alarm brings the card again.
 *   - "Keep going" (P8a): the guard sweeps the room; Mops comes in while the guard is still there; their six lines
 *     word for word (the guard's name over his bubble, never blank); the guard leaves; no "They lost you."; Squatch
 *     comes out still in costume; Mops looks at the costume (it glows); the four lines; with no words Mops lifts the
 *     piece on his head off him (whichever piece it is; none: a pat), which plays itself; then beat 20.
 *   - ↺: the card's own ↺ restarts P7; ↺ in "Keep going" restarts it from under the bed.
 *   - The group photo (src/modules/party-photo.js): no countdown or flash before the first song ends; then the band
 *     stops, the guests and the Croc Boys walk into two rows by the back wall (nobody jumps; clear of the hallway
 *     doorway and the snack bar; the alarm box showing), the camera tourist faces them, only JOIN · photo is
 *     offered (no DANCE, no GRAB), "Say cheese!", 3-2-1, the click; in his place: +25 once and the Polaroid filling
 *     the screen until a tap; not there: no close-up; everyone walks back and the second song starts; one photo a
 *     party; ↺ and an alarm in the middle of it.
 * Stills at 375 x 812 go to tests/out/party-stills/ (r4-*.png).
 *   node tests/party-round4.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const g = await startGame({ port: 9330, name: "party-round4" });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const free = await import(join(root, "src", "modules", "party-free.js"));
const card = await import(join(root, "src", "modules", "party-card.js"));
const lines = await import(join(root, "src", "modules", "party-lines.js"));
const L = (id) => lines.partyLine(id);

async function open(beat) {
  const o = await g.open("?beat=" + beat, PHONE);
  await sleep(1400);
  return o;
}
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur,
      p = n.ch1PartyNow;
    return {
      now: window.SSQ.beat("ch1-party").now(),
      room: n.room,
      ctrl: !!n.ctrl,
      cur: c ? c.k : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      who: c && c.b ? c.b.who : "",
      x: Math.round(n.sq.x),
      y: Math.round(n.sq.y),
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      chip: window.__ss.chipNow(),
      note: (n.log || []).filter((l) => l.k === "safe").length,
      tv: !!n.tvOn,
      mo: { x: Math.round(n.mo.x), y: Math.round(n.mo.y), pose: n.moPose },
      sqPose: n.sqPose,
      wardrobe: n.wardrobe,
      walks: (n.ch1Walks || []).map((w) => w.phase + ":" + w.room),
      full: (document.querySelector('canvas[aria-label="party card"]') && "party card") || "",
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
const bubbleName = (page) => page.evaluate(() => (window.__ss.lastBubble ? String(window.__ss.lastBubble.name) : "none"));
const played = (page) => page.evaluate(() => (window.SSQ.beat("ch1-party").now() || { sound: { played: [] } }).sound.played);
const targets = (page) => page.evaluate(() => window.SSQ.beat("ch1-party").cardTargets());
// Every word drawn on the card's own canvas over a few frames, with its size in screen pixels.
const cardWords = (page) =>
  page.evaluate(async () => {
    const cv = document.querySelector('canvas[aria-label="party card"]'),
      fill = CanvasRenderingContext2D.prototype.fillText,
      got = new Map();
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) {
      this.canvas === cv && got.set(String(t), Math.round(parseFloat((String(this.font).match(/(\d+(\.\d+)?)px/) || [0, 0])[1])));
      return fill.call(this, t, ...r);
    };
    await new Promise((ok) => setTimeout(ok, 250));
    CanvasRenderingContext2D.prototype.fillText = fill;
    return [...got.entries()];
  });
// The colour in the corner of each tile on the card (screen pixels): light when found, dark when not.
const tileLight = (page) =>
  page.evaluate(() => {
    const cv = document.querySelector('canvas[aria-label="party card"]'),
      k = cv.width / cv.getBoundingClientRect().width,
      T = window.SSQ.beat("ch1-party").cardTargets();
    return Object.fromEntries(T.tiles.map((t) => [t.id, cv.getContext("2d").getImageData(Math.round((t.x - t.s / 2 + 9) * k), Math.round((t.y - t.s / 2 + 9) * k), 1, 1).data[0] > 200]));
  });
// From P7's start: run home and hide under the bed, to the card. `before` sets the party's state first.
async function toCard(page, before) {
  before && (await set(page, before));
  await walk(page, hall.SPOTS.doorway.x, 605);
  let s = await until(page, (q) => q.room === "closet" && q.act === "HIDE · bed", 12000);
  if (!s) return null;
  await press(page);
  return until(page, (q) => q.now && !!q.now.card, 6000);
}
// Lines shown in order until `stop`, tapping NEXT on each: [who, text, name over the bubble].
async function readLines(page, stop, ms = 40000) {
  const seen = [];
  await until(page, (q) => stop(q, seen), ms, async (q) => {
    if (q.cur !== "bub") return;
    if (!seen.length || seen[seen.length - 1][1] !== q.text) {
      await sleep(150);
      seen.push([q.who, q.text, await bubbleName(page)]);
    }
    await next(page);
  });
  return seen;
}

// ---------- the card's layout, on a phone and on a computer ----------
for (const [w, h] of [[375, 812], [1100, 800], [320, 568]])
  for (const all of [false, true]) {
    const Lo = card.cardLayout(w, h, all),
      boxes = [...Lo.tiles.map((t) => ({ x0: t.x - Lo.tile / 2, x1: t.x + Lo.tile / 2, y0: t.y - Lo.tile / 2, y1: t.y + Lo.tile / 2 })), ...Lo.buttons.map((b) => ({ x0: b.x, x1: b.x + b.w, y0: b.y, y1: b.y + b.h }))],
      inside = boxes.every((b) => b.x0 >= 8 && b.x1 <= w - 8 && b.y0 >= Lo.title.y + Lo.title.size * 1.6 && b.y1 <= h - 8),
      apart = boxes.every((a, i) => boxes.every((b, j) => i >= j || a.x1 <= b.x0 || b.x1 <= a.x0 || a.y1 <= b.y0 || b.y1 <= a.y0));
    g.check(`the card fits a ${w} x ${h} screen${all ? " (everything found)" : ""}: five tiles and ${all ? "one button" : "two buttons"}, on the screen, under the title, none overlapping, each button a big target`, Lo.tiles.length === 5 && Lo.buttons.length === (all ? 1 : 2) && inside && apart && Lo.buttons.every((b) => b.h >= 60 && b.w >= 200) && Lo.tile >= 76, { tile: Lo.tile, buttons: Lo.buttons });
  }
g.check("the card's things are the dance, the photo, the snacks, the conga and the octopus (not the hallway)", card.CARD_THINGS.join(",") === "dance,photo,snacks,conga,octopus");

// ---------- the card, nothing found yet; then "Back to the party" ----------
{
  const { page, errors } = await open("party:P7");
  // the party as it was: song 2 with 10 seconds played, one piece lost
  // (the hat he lost lies on the hall's floor)
  let s = await toCard(page, (p) => ((p.song = 1), (p.songT = 10), (p.lostPieces = ["head"]), (p.fallen = [{ id: p.outfit.head, x: 500, y: 400, rot: 0.6, to: "floor" }])));
  g.check("under the bed in P7, the card fills the screen (the stick and the button are hidden)", !!s && s.full === "party card" && s.now.pose === "bed" && (await page.evaluate(() => [document.querySelector('[aria-label="Move"]'), document.querySelector('[role="button"]')].filter(Boolean).every((el) => getComputedStyle(el).visibility === "hidden"))), s && [s.full, s.now.pose]);
  const top = await page.evaluate(() => (document.elementFromPoint(34, 34) || { getAttribute: () => "" }).getAttribute("aria-label"));
  g.check("the card keeps its own ↺ (the top-left corner is the card)", top === "party card", top);
  const words = await cardWords(page),
    text = words.map((w) => w[0]),
    title = text.filter((t) => t !== "?" && t !== L("button-back") && t !== L("button-keep")).join(" ");
  g.check('its words: "There\'s more to find at the party!", "Back to the party", "Keep going"', title === "There's more to find at the party!" && text.includes("Back to the party") && text.includes("Keep going"), text);
  g.check("every word on the card is at least 18 pixels tall on a phone", words.every((w) => w[1] >= 18), words);
  let T = await targets(page);
  g.check("with nothing found, all five things are \"?\" tiles (dark), none filled in", Object.values(T.got).every((v) => !v) && Object.values(await tileLight(page)).every((v) => !v) && text.includes("?"), [T.got, await tileLight(page)]);
  await still(page, "r4-card-nothing-found");
  // the game waits behind the card: the guard does not move, the alarm's clock stands still
  const a0 = await page.evaluate(() => { const a = window.__ss.op.ch1PartyNow.alarm; return [a.t, a.homeGuard ? a.homeGuard.x : -1, a.homeGuard ? a.homeGuard.sweep : -1]; });
  await sleep(1500);
  const a1 = await page.evaluate(() => { const a = window.__ss.op.ch1PartyNow.alarm; return [a.t, a.homeGuard ? a.homeGuard.x : -1, a.homeGuard ? a.homeGuard.sweep : -1]; });
  g.check("the game waits behind the card (the guard and the alarm's clock stand still)", JSON.stringify(a0) === JSON.stringify(a1), [a0, a1]);
  // "Back to the party", with a finger
  await page.touchscreen.tap(T.back.x, T.back.y);
  s = await until(page, (q) => !q.full, 2000);
  g.check("a tap on \"Back to the party\" closes the card (still P7)", !!s && s.now.scene === "P7" && s.now.choice === "back", s && [s.now.scene, s.now.choice]);
  s = await until(page, (q) => q.now.homeGuard && q.now.homeGuard.turn != null && Math.abs(q.now.homeGuard.turn) > 0.3, 8000);
  g.check("the guard comes in and sweeps the room with his flashlight (his head turning as he looks)", !!s && s.now.pose === "bed", s && s.now.homeGuard);
  await still(page, "r4-back-guard-sweeps");
  s = await until(page, (q) => q.note > 0, 12000);
  g.check("he gives up and leaves: \"They lost you.\"", !!s && !s.now.homeGuard, s && s.now.homeGuard);
  // out from under the bed, to his closet, the piece he lost goes back on
  s = await until(page, (q) => q.wardrobe === "open", 12000);
  g.check("he comes out and goes to his closet (it opens), the lost piece still off", !!s && s.sqPose === "stand" && s.now.gone.length === 1, s && [s.sqPose, s.now.gone]);
  const lyingBefore = await page.evaluate(() => window.__ss.op.ch1PartyNow.fallen.length);
  s = await until(page, (q) => q.now.gone.length === 0, 4000);
  const lying = await page.evaluate(() => window.__ss.op.ch1PartyNow.fallen.length);
  g.check("once the piece is back on him it no longer lies on the hall's floor (it did until then)", lyingBefore === 1 && lying === 0, [lyingBefore, lying]);
  await sleep(60);
  await still(page, "r4-back-disguise-back-on");
  g.check("he is seen putting his disguise back on: the piece pops back on him at the closet", !!s && s.wardrobe === "open" && !s.now.fur, s && [s.wardrobe, s.now.fur]);
  g.check("Mops has not come (he is nowhere in the room) and no line was spoken", s.mo.pose === "hidden" || s.mo.x > 960 || s.mo.x < 0, s.mo);
  // out through his door, and the party goes on
  await page.evaluate(() => {
    window.__w = [];
    window.__wT = setInterval(() => { const n = window.__ss.op; window.__w.push([n.room, n.sq.x, n.sq.y]); }, 50);
  });
  s = await until(page, (q) => q.now && q.now.scene === "P6" && q.ctrl, 15000);
  const jumps = await page.evaluate(() => { clearInterval(window.__wT); const w = window.__w; let n = 0; for (let i = 1; i < w.length; i++) w[i][0] === w[i - 1][0] && Math.hypot(w[i][1] - w[i - 1][1], w[i][2] - w[i - 1][2]) > 60 && n++; return n; });
  g.check("he walks back out through his door (a walk, no jump) into the party, with control", !!s && s.room === "hall" && s.walks.slice(-3).join(",").includes("edge:closet") && jumps === 0, s && [s.room, s.walks.slice(-3), jumps]);
  g.check("the party carries on from where it was: the same song and clock, the band playing, his disguise whole", !!s && s.now.song === 1 && s.now.songT >= 10 && s.now.songT < 40 && s.now.sound.song === 1 && !s.now.fur && !s.now.alarm, s && [s.now.song, s.now.songT, s.now.sound.song]);
  await sleep(600);
  await still(page, "r4-back-at-the-party");
  // a later alarm brings the same card, now with what he has found since
  await set(page, (p) => ((p.done.dance = true), (p.done.octopus = true), (p.lostPieces = ["head"])));
  await place(page, 770, 455);
  s = await until(page, (q) => q.now && q.now.scene === "P7" && ["ring", "search"].includes(q.now.alarm), 15000);
  g.check("seen again with fur showing: the alarm again (P7)", !!s);
  s = await toCard(page);
  T = await targets(page);
  const light = await tileLight(page);
  g.check("a later alarm brings the same card, the dance and the octopus now filled in and the other three still \"?\"", !!s && T.got.dance && T.got.octopus && !T.got.photo && !T.got.snacks && !T.got.conga && light.dance && light.octopus && !light.photo && !light.snacks && !light.conga, [T && T.got, light]);
  await still(page, "r4-card-two-found");
  g.check("no errors on the way back to the party", errors.length === 0, errors);
  await page.close();
}
{
  // The clock: coming back with less than a minute of party left, there is a minute again; with more, nothing changes.
  const { page } = await open("party:P7");
  let s = await toCard(page, (p) => ((p.song = 2), (p.songT = 50)));
  const T = await targets(page);
  await page.touchscreen.tap(T.back.x, T.back.y);
  s = await until(page, (q) => q.now && q.now.scene === "P6" && q.ctrl, 40000);
  const left = s ? (2 - s.now.song) * free.SONG_SECONDS + (free.SONG_SECONDS - s.now.songT) : -1;
  g.check("coming back with 10 seconds of party left, there are 60 again (a placeholder)", !!s && left <= free.BACK_MIN_SECONDS && left > free.BACK_MIN_SECONDS - 3, left);
  g.check("with nothing lost he goes straight out (the closet stays shut)", !!s && s.wardrobe !== "open", s && s.wardrobe);
  await page.close();
}

{
  // The first alarm of a play shows the hand pulling the alarm (a close-up). A kid who is already under his bed by
  // then still gets the card, after the close-up, once the search has come home; the alarm is never left stuck.
  const { page } = await open("party:P6");
  await set(page, (p) => (p.lostPieces = ["head"]));
  await place(page, 770, 455);
  let s = await until(page, (q) => q.now && q.now.scene === "P7", 6000);
  await place(page, hall.SPOTS.doorway.x, 585);
  await walk(page, hall.SPOTS.doorway.x, 605);
  s = await until(page, (q) => q.room === "closet" && q.act === "HIDE · bed", 12000);
  const early = s ? s.now.alarm : "";
  await press(page);
  s = await until(page, (q) => q.now && !!q.now.card, 12000);
  g.check("under the bed before the alarm's own close-up has played: the card still comes, once the search is home", !!s && ["shout", "run", "pull"].includes(early) && s.now.alarm === "home" && s.full === "party card", [early, s && s.now.alarm, s && s.full]);
  await page.close();
}

// ---------- everything found: the other line, one button ----------
{
  const { page } = await open("party:P7");
  const s = await toCard(page, (p) => (p.done = { dance: true, photo: true, snacks: true, conga: true, octopus: true }));
  const words = await cardWords(page),
    text = words.map((w) => w[0]),
    T = await targets(page);
  g.check('everything found: "You found everything at the party!" with only "Keep going"', !!s && text.filter((t) => t !== L("button-keep")).join(" ") === "You found everything at the party!" && text.includes("Keep going") && !text.includes("Back to the party") && !text.includes("?") && T.all && !T.back && !!T.keep, text);
  g.check("all five pictures are filled in", Object.values(await tileLight(page)).every(Boolean), await tileLight(page));
  await still(page, "r4-card-everything-found");
  // the card's own ↺, held with a finger: P7 starts over
  await page.touchscreen.touchStart(34, 34);
  await sleep(1000);
  await page.touchscreen.touchEnd();
  await sleep(700);
  const r = await st(page);
  g.check("holding the card's own ↺ restarts P7: the card gone, the alarm ringing, Squatch back on the dance floor", !r.full && r.now.scene === "P7" && r.room === "hall" && ["ring", "search"].includes(r.now.alarm) && !r.now.card, [r.full, r.now.scene, r.room, r.now.alarm]);
  await page.close();
}

// ---------- "Keep going": the guard, Mops, the talk, the hat ----------
const GUARD_TALK = [
  ["guard", L("guard-alarm")],
  ["guard", L("guard-ran")],
  ["mops", L("mops-wookiee")],
  ["guard", L("guard-ridiculous")],
  ["guard", L("guard-poker")],
  ["mops", L("mops-thumbs")],
];
const HOME_TALK = [
  ["mops", L("mops-went")],
  ["sq", L("sq-someone")],
  ["sq", L("sq-except")],
  ["mops", L("mops-have-me")],
];
g.check(
  "the lines are Brian's, word for word",
  JSON.stringify(GUARD_TALK.map((l) => l[1])) === JSON.stringify(["Someone pulled the fur alarm.", "They saw someone run in here.", "Sure. I'm hiding a Wookiee in here.", "Ha! You're right. That's ridiculous.", "You coming to poker night?", "You know I don't have opposable thumbs."]) &&
    JSON.stringify(HOME_TALK.map((l) => l[1])) === JSON.stringify(["You went to the party.", "Everyone out there has someone.", "Everyone except me.", "You have me."]),
);
// Plays "Keep going" from the card to beat 20; returns what happened. `outfit` is what he wears, `lost` what is gone.
async function keepGoing(name, outfit, lost) {
  const { page, errors } = await open("party:P7");
  let s = await toCard(page, `(p) => ((p.outfit = ${JSON.stringify(outfit)}), (p.lostPieces = ${JSON.stringify(lost)}))`);
  const T = await targets(page);
  await page.touchscreen.tap(T.keep.x, T.keep.y);
  s = await until(page, (q) => !q.full, 2000);
  const out = { errors, closed: !!s && s.now.scene === "P8a" };
  s = await until(page, (q) => q.now.homeGuard && q.now.homeGuard.turn != null && Math.abs(q.now.homeGuard.turn) > 0.3, 8000);
  out.sweeps = !!s && s.now.pose === "bed" && s.mo.pose === "hidden";
  // Mops comes in while the guard is still there; the first line
  s = await until(page, (q) => q.cur === "bub", 15000);
  out.mopsIn = !!s && !!s.now.homeGuard && s.mo.pose === "stand" && s.mo.x > 40 && s.mo.x < 940 && s.now.pose === "bed";
  await sleep(250);
  name && (await still(page, "r4-keep-guard-and-mops"));
  out.guardName = await bubbleName(page);
  out.bubbleOnGuard = await page.evaluate(() => {
    // the guard's bubble sits over his head, on the picture, and not over Mops
    const b = window.__ss.lastBubble,
      n = window.__ss.op,
      gd = n.ch1PartyNow.alarm.homeGuard;
    return { on: b.x >= 0 && b.x + b.w <= 960 && b.y - 24 >= 0, over: Math.abs(b.x + b.w / 2 - gd.x) < 260 && b.y + (b.h || 60) < gd.y - 60 };
  });
  out.talk = await readLines(page, (q, seen) => seen.length >= 6 && q.cur !== "bub");
  s = await until(page, (q) => !q.now.homeGuard && !q.now.alarm, 8000);
  out.guardLeft = !!s;
  out.noNote = s ? s.note === 0 : false;
  s = await until(page, (q) => q.now.costumeLook, 12000);
  out.cameOut = !!s && s.sqPose === "stand" && s.now.pose === "stand" && JSON.stringify(s.now.worn) === JSON.stringify(Object.fromEntries(Object.entries(outfit).map(([k, v]) => [k, lost.includes(k) ? "" : v])));
  out.look = !!s && s.cur !== "bub" && Math.abs(s.mo.x - s.x) < 260;
  await sleep(300);
  name && (await still(page, `r4-keep-${name}-mops-looks`));
  out.home = await readLines(page, (q, seen) => seen.length >= 4 && q.cur !== "bub");
  // the lift (or the pat) plays itself: no taps from here
  s = await until(page, (q) => q.now && q.now.lift && q.now.lift.k > 0.45, 8000);
  out.lift = s ? s.now.lift : null;
  out.liftNoBubble = !!s && s.cur !== "bub";
  out.wornDuring = s ? s.now.worn : null;
  name && (await still(page, `r4-keep-${name}-lift`));
  s = await until(page, (q) => q.tv, 12000);
  out.tv = !!s && !s.now;
  await page.close();
  return out;
}
{
  const o = await keepGoing("tophat", { head: "tophat", face: "shades", body: "shirt", legs: "boots" }, []);
  g.check("a tap on \"Keep going\" closes the card: the ending (P8a)", o.closed);
  g.check("the guard comes in and sweeps the room (Squatch under the bed, Mops not there yet)", o.sweeps);
  g.check("Mops comes in while the guard is still there (Squatch still under the bed)", o.mopsIn);
  g.check("the guard and Mops: the six lines, word for word, in order, each from its speaker", JSON.stringify(o.talk.map((l) => [l[0], l[1]])) === JSON.stringify(GUARD_TALK), o.talk);
  g.check("over the guard's bubble, a name (\"A guard\"), never blank; over Mops's, \"Mops\"", o.guardName === "A guard" && o.talk.filter((l) => l[0] === "mops").every((l) => l[2] === "Mops") && o.talk.filter((l) => l[0] === "guard").every((l) => l[2] === "A guard"), [o.guardName, o.talk.map((l) => l[2])]);
  g.check("the guard's bubble is on the picture, over his head", o.bubbleOnGuard.on && o.bubbleOnGuard.over, o.bubbleOnGuard);
  g.check("then the guard leaves, and no \"They lost you.\" interrupts", o.guardLeft && o.noNote, [o.guardLeft, o.noNote]);
  g.check("Squatch comes out from under the bed still in costume, and Mops looks at it (it glows, before any line)", o.cameOut && o.look, [o.cameOut, o.look]);
  g.check("Mops and Squatch: the four lines, word for word, in order", JSON.stringify(o.home.map((l) => [l[0], l[1]])) === JSON.stringify(HOME_TALK), o.home);
  g.check("with no words, Mops lifts the hat off him: it leaves his head and plays itself", o.lift && o.lift.id === "tophat" && o.liftNoBubble && o.wornDuring && o.wornDuring.head === "tophat", [o.lift, o.liftNoBubble]);
  g.check("then beat 20 (the TV story), and the party night is over", o.tv);
  g.check("no errors in \"Keep going\"", o.errors.length === 0, o.errors);
}
{
  // whichever piece he wears on his head: boots there
  const o = await keepGoing("boots-on-head", { head: "boots", face: "stache", body: "tutu", legs: "shades" }, []);
  g.check("boots on his head: it is the boots Mops lifts off", o.lift && o.lift.id === "boots" && o.tv && JSON.stringify(o.home.map((l) => l[1])) === JSON.stringify(HOME_TALK.map((l) => l[1])), [o.lift, o.tv]);
}
{
  // nothing on his head (the hat was knocked off at the party): a gentle pat
  const o = await keepGoing("no-hat", { head: "tophat", face: "shades", body: "shirt", legs: "boots" }, ["head"]);
  g.check("nothing on his head: a gentle pat (nothing is lifted), then beat 20", o.lift && o.lift.id === "" && o.liftNoBubble && o.cameOut && o.tv, [o.lift, o.cameOut, o.tv]);
}

// ---------- ↺ in "Keep going" ----------
{
  const { page } = await open("party:P8a");
  let s = await st(page);
  g.check("the ending's restart point: under the bed, the guard about to come in, no card", s.now.scene === "P8a" && s.room === "closet" && s.now.pose === "bed" && s.now.alarm === "home" && !s.now.card && s.now.choice === "keep", [s.now.scene, s.now.pose, s.now.alarm]);
  s = await until(page, (q) => q.cur === "bub", 15000);
  await next(page);
  await sleep(300);
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(600);
  s = await st(page);
  g.check("↺ in the middle of the guard's talk: \"Keep going\" starts over from under the bed (no line up, Mops gone, the guard back at the door)", s.now.scene === "P8a" && s.now.pose === "bed" && s.cur !== "bub" && s.mo.pose === "hidden" && (!s.now.homeGuard || s.now.homeGuard.x > 880) && s.now.alarm === "home", [s.now.scene, s.now.pose, s.cur, s.mo.pose, s.now.homeGuard]);
  s = await until(page, (q) => q.cur === "bub", 15000);
  g.check("and it plays again: the guard's first line", !!s && s.text === L("guard-alarm"), s && s.text);
  await page.close();
}

// ---------- the group photo ----------
const photo = await import(join(root, "src", "modules", "party-photo.js"));
const hallway = await import(join(root, "src", "modules", "party-hallway.js"));
// Runs the game `secs` seconds in the page, sampling everyone's place each tick: the longest step anyone took, and
// (with `until`) stopping when the photo reaches that phase.
const runWatch = (page, secs, stopAt) =>
  page.evaluate(
    (n, stopAt) => {
      const op = window.__ss.op,
        p = op.ch1PartyNow,
        pts = () => ({ sq: [op.sq.x, op.sq.y], ...Object.fromEntries(Object.entries(p.people).map(([id, q]) => [id, [q.x, q.y]])), ...Object.fromEntries((p.bandAt || []).map((b, i) => ["band" + i, [b.x, b.y]])) });
      let was = pts(),
        max = 0,
        who = "";
      for (let i = 0; i < n; i++) {
        window.__ss.tick(0.05);
        const now = pts();
        for (const id of Object.keys(now)) {
          const d = was[id] ? Math.hypot(now[id][0] - was[id][0], now[id][1] - was[id][1]) : 0;
          d > max && ((max = d), (who = id));
        }
        was = now;
        if (stopAt && p.shot && p.shot.phase === stopAt) break;
      }
      return { max: Math.round(max * 10) / 10, who, phase: p.shot ? p.shot.phase : "" };
    },
    Math.round(secs / 0.05),
    stopAt || "",
  );
const sounds = async (page, from) => (await played(page)).slice(from);
const liveLines = (page) => page.evaluate(() => (window.__ss.op.log || []).filter((l) => l.k === "live").map((l) => l.text));
{
  const { page, errors } = await open("party:P6");
  await place(page, 150, 585);
  // through the first song: no countdown and no flash at any time
  const n0 = (await played(page)).length;
  await page.evaluate(() => { for (let i = 0; i < 1000; i++) window.__ss.tick(0.05); });
  let s = await st(page);
  let heard = await sounds(page, n0);
  g.check("through 50 seconds of the first song: no camera countdown, no flash, no photo moment", !s.now.shot && s.now.song === 0 && !heard.includes("beep") && !heard.includes("flash") && s.now.flash === 0, [s.now.shot, heard.filter((x) => x === "beep" || x === "flash")]);
  // the first song ends: the band stops and everyone sets off
  await set(page, (p, n, a) => (p.songT = a - 0.2), free.SONG_SECONDS);
  s = await until(page, (q) => q.now.shot && q.now.shot.phase === "gather", 3000);
  g.check("when the first song ends the photo moment begins: the band stops playing", !!s && s.now.sound.song === -1 && s.now.song === 0, s && [s.now.shot, s.now.sound.song]);
  // in the dance spotlight and at the bar, only JOIN · photo is offered
  await place(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4);
  await sleep(350);
  s = await st(page);
  g.check("during the photo moment, standing in the spotlight offers JOIN · photo, never DANCE", s.act === "JOIN · photo", s.act);
  await place(page, hall.SNACK_SPOT.x - 10, hall.SNACK_SPOT.y + 10);
  await sleep(350);
  s = await st(page);
  g.check("and at the snack bar too (no GRAB during the photo moment)", s.act === "JOIN · photo", s.act);
  await place(page, 150, 585);
  const w = await runWatch(page, 12, "settle");
  s = await st(page);
  g.check("everyone walks to the row (the band off the stage's end and across the floor): nobody jumps", w.phase === "settle" && w.max <= photo.PHOTO.walk * 0.05 + 0.5, w);
  // where they stand: two rows by the back wall, clear of the hallway doorway and the snack bar, under the alarm box
  const adult = await page.evaluate(() => window.SSQ.engine().hallSizes().adult);
  const row = [...photo.PHOTO_ROW.back, ...photo.PHOTO_ROW.front],
    at = (id) => (id.startsWith("band") ? s.now.band[+id.slice(4)] : s.now.people[id]),
    there = row.every((r) => Math.hypot(at(r.id).x - r.x, at(r.id).y - r.y) < 2);
  g.check("the guests and the Croc Boys stand in their places in the row (five behind, three in front, a gap for Squatch)", there && row.length === 8 && s.now.band.every((b) => b.y > 300), row.map((r) => [r.id, at(r.id)]));
  g.check(
    "the row blocks neither the hallway doorway nor the snack bar, and the alarm box shows over their heads",
    row.every((r) => !hallway.inHallwayZone({ x: r.x, y: r.y }) && r.x < hall.HALLWAY_LANE.x0 - 40 && Math.hypot(r.x - hall.SNACK_SPOT.x, r.y - hall.SNACK_SPOT.y) > 110 && r.y - adult * 1.05 > hall.HALL.alarm.y1) && photo.PHOTO_ROW.squatch.x > 600 && photo.PHOTO_ROW.squatch.x < 660,
    [hall.HALL.alarm, adult],
  );
  const cam = s.now.people.camera;
  g.check("the camera tourist has carried his camera over and stands facing the row", Math.hypot(cam.x - photo.PHOTO_ROW.camera.x, cam.y - photo.PHOTO_ROW.camera.y) < 2 && cam.y > photo.PHOTO_ROW.squatch.y + 100, cam);
  // the label on his place
  s = await until(page, (q) => q.act === "JOIN · photo", 2000);
  const label = await page.evaluate(() => { const n = window.__ss.op; return n.lastCap ? { text: n.lastCap.text, box: n.lastCap.box } : null; });
  g.check("JOIN · photo is offered from across the hall, its label at the gap in the row", !!s && !!label && label.text === "JOIN · photo" && Math.abs((label.box.x0 + label.box.x1) / 2 - photo.PHOTO_ROW.squatch.x) < 120 && label.box.y1 < 420 && label.box.x1 <= 960 && label.box.y0 >= 0, label);
  await still(page, "r4-photo-row-and-label");
  // he presses it and walks into his place
  const n1 = (await played(page)).length;
  await press(page);
  const wj = await runWatch(page, 8, "count");
  s = await st(page);
  g.check("pressing it walks him into the gap (a walk, no jump), facing the camera", Math.hypot(s.x - photo.PHOTO_ROW.squatch.x, s.y - photo.PHOTO_ROW.squatch.y) < 2 && s.now.shot.in && wj.max <= photo.PHOTO.join * 0.05 + 0.5, [s.x, s.y, s.now.shot, wj]);
  g.check("\"Say cheese!\" as the count starts", (await liveLines(page)).includes("Say cheese!") && s.now.shot.phase === "count", await liveLines(page));
  await sleep(120);
  await still(page, "r4-photo-say-cheese");
  const bub = await page.evaluate(() => { const b = window.__ss.lastBubble, n = window.__ss.op, k = window.SSQ.engine().hallSizes().squatch; return b ? b.x < n.sq.x + 19 * k && b.x + b.w > n.sq.x - 19 * k && b.y - 24 < n.sq.y && b.y + (b.h || 60) > n.sq.y - 72 * k : false; });
  g.check("the \"Say cheese!\" bubble does not cover Squatch in the row", bub === false, bub);
  const stars0 = s.now ? (await page.evaluate(() => window.__ss.op.stars || 0)) : 0;
  await runWatch(page, 4, "polaroid");
  await sleep(250);
  heard = await sounds(page, n1);
  const stars1 = await page.evaluate(() => window.__ss.op.stars || 0);
  g.check("3, 2, 1 (a beep each), the click and its flash at the lens; he is in the photo: +25", heard.filter((x) => x === "beep").length === 3 && heard.includes("flash") && stars1 === stars0 + photo.PHOTO_BONUS, [heard, stars1 - stars0]);
  const pol = await page.evaluate(async () => {
    const cv = document.querySelector('canvas[aria-label="group photo"]');
    if (!cv) return null;
    // the pictures drawn on the Polaroid over a few frames: the approved guests
    const di = CanvasRenderingContext2D.prototype.drawImage;
    const srcs = new Set();
    CanvasRenderingContext2D.prototype.drawImage = function (img, ...r) { this.canvas === cv && img && img.src && srcs.add(img.src.split("/").pop()); return di.call(this, img, ...r); };
    await new Promise((ok) => setTimeout(ok, 900));
    CanvasRenderingContext2D.prototype.drawImage = di;
    return { guests: [...srcs].sort(), top: (document.elementFromPoint(34, 34) || { getAttribute: () => "" }).getAttribute("aria-label") };
  });
  g.check("the Polaroid of the group fills the screen (the five guests of the row drawn in it), with its own ↺", !!pol && ["backpack.png", "octopus.png", "robot.png", "stilt.png", "teal.png"].every((f) => pol.guests.includes(f)) && !pol.guests.includes("camera.png") && pol.top === "group photo", pol);
  await still(page, "r4-photo-polaroid");
  await sleep(400);
  s = await st(page);
  g.check("it waits for a tap (nothing moves on by itself)", s.now.shot.phase === "polaroid" && !!(await page.evaluate(() => document.querySelector('canvas[aria-label="group photo"]'))));
  await page.touchscreen.tap(190, 600);
  s = await until(page, (q) => q.now.shot && q.now.shot.phase === "back" && q.ctrl, 2000);
  g.check("a tap closes it, he has control again and everyone sets off back", !!s && !(await page.evaluate(() => document.querySelector('canvas[aria-label="group photo"]'))) && s.now.done.photo, s && s.now.shot);
  await place(page, 150, 585);
  const wb = await runWatch(page, 14, "done");
  s = await st(page);
  g.check("the Croc Boys walk back onto the stage (nobody jumps), and the second song starts", wb.phase === "done" && wb.max <= 12.5 && s.now.band.every((b, i) => Math.hypot(b.x - hall.CAST.band[i].x, b.y - hall.CAST.band[i].y) < 2) && s.now.song === 1 && s.now.sound.song === 1, [wb, s.now.band, s.now.song]);
  await place(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4);
  s = await until(page, (q) => q.act === "DANCE · circle", 3000);
  g.check("after the photo the DANCE button is back in the spotlight", !!s, s && s.act);
  // no second photo: the second song ends and the third starts, with no countdown
  await place(page, 150, 585);
  const n2 = (await played(page)).length;
  await set(page, (p, n, a) => (p.songT = a - 0.2), free.SONG_SECONDS);
  s = await until(page, (q) => q.now.song === 2, 3000);
  await runWatch(page, 6);
  heard = await sounds(page, n2);
  g.check("one photo a party: the second song ends with no photo moment, no countdown and no flash", !!s && !heard.includes("beep") && !heard.includes("flash") && (await st(page)).now.shot.phase === "done", heard.filter((x) => x === "beep" || x === "flash"));
  g.check("the photo bonus came once", (await page.evaluate(() => window.__ss.op.stars || 0)) === stars0 + photo.PHOTO_BONUS);
  g.check("no errors at the group photo", errors.length === 0, errors);
  await page.close();
}
{
  // He does not walk over: the photo is taken without him, no close-up, and the party goes on.
  const { page } = await open("party:P6");
  await place(page, 150, 585);
  const stars0 = await page.evaluate(() => window.__ss.op.stars || 0);
  await set(page, (p, n, a) => (p.songT = a - 0.2), free.SONG_SECONDS);
  await until(page, (q) => q.now.shot && q.now.shot.phase === "gather", 3000);
  const n0 = (await played(page)).length;
  const w = await runWatch(page, 40, "done");
  const s = await st(page);
  const heard = await sounds(page, n0);
  g.check("not in the row: the photo is taken without him (the click and its flash), with no close-up and no stars", w.phase === "done" && heard.includes("flash") && !heard.includes("zzzt") && !s.now.done.photo && (await page.evaluate(() => window.__ss.op.stars || 0)) === stars0 && !(await page.evaluate(() => document.querySelector('canvas[aria-label="group photo"]'))), [w, heard.filter((x) => x !== "step")]);
  g.check("everyone goes back and the second song starts", s.now.song === 1 && s.now.sound.song === 1 && s.ctrl, [s.now.song, s.ctrl]);
  await page.close();
}
{
  // One moment at a time. The first song ends while the pyramid is crashing: the photo waits for the crash and the
  // stare to be over. And GRAB pressed just before the song ends: the photo begins, and no snack close-up opens over it.
  const { page } = await open("party:P6");
  await place(page, 150, 585);
  await page.evaluate((a) => {
    const p = window.__ss.op.ch1PartyNow;
    ((p.snacks.toppled = true), (p.snacks.chain = 0), (p.songT = a));
  }, free.SONG_SECONDS);
  const seen = await page.evaluate(() => {
    const p = window.__ss.op.ch1PartyNow;
    let early = 0,
      n = 0;
    for (let i = 0; i < 400 && (p.snacks.chain < 1 || p.stare); i++) (window.__ss.tick(0.05), n++, p.shot && early++);
    return { early, n };
  });
  let s = await until(page, (q) => q.now.shot && q.now.shot.phase === "gather", 3000);
  g.check("the first song ending during the pyramid's crash and the stare: the photo moment waits, then begins", seen.early === 0 && seen.n > 60 && !!s, seen);
  await page.close();
}
{
  const { page } = await open("party:P6");
  await place(page, hall.SNACK_SPOT.x - 50, hall.SNACK_SPOT.y + 30);
  let s = await until(page, (q) => q.act === "GRAB · snacks", 3000);
  await set(page, (p, n, a) => (p.songT = a - 0.1), free.SONG_SECONDS);
  await press(page);
  s = await until(page, (q) => q.now.shot && q.ctrl, 4000);
  await sleep(500);
  s = await st(page);
  g.check("GRAB pressed as the first song ends: the photo moment begins and no snack close-up opens over it (he has control, JOIN · photo is offered)", !!s.now.shot && !s.now.snack && s.ctrl && s.act === "JOIN · photo", [s.now.shot, s.now.snack, s.ctrl, s.act]);
  await page.close();
}
{
  // ↺ in the middle of the photo moment: P6 starts over, the band on the stage, and the photo will come again.
  const { page } = await open("party:P6");
  await place(page, 150, 585);
  await set(page, (p, n, a) => (p.songT = a - 0.2), free.SONG_SECONDS);
  await until(page, (q) => q.now.shot && q.now.shot.phase === "gather", 3000);
  await runWatch(page, 3);
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(600);
  const s = await st(page);
  g.check("↺ during the photo moment restarts P6: the band back on the stage playing, no photo moment on", s.now.scene === "P6" && !s.now.shot && s.now.sound.song === 0 && s.ctrl && Math.hypot(s.x - hall.SPOTS.doorway.x, s.y - hall.SPOTS.doorway.y) < 3, [s.now.shot, s.now.sound.song, s.x, s.y]);
  await page.close();
}
{
  // An alarm in the middle of the photo moment (fur showing): the photo is over; back at the party the band walks
  // back to the stage before the next song.
  const { page } = await open("party:P6");
  await set(page, (p, n, a) => ((p.songT = a - 0.2), (p.lostPieces = ["head"])), free.SONG_SECONDS);
  await place(page, 150, 585);
  await until(page, (q) => q.now.shot && q.now.shot.phase === "gather", 3000);
  await runWatch(page, 9, "settle");
  await place(page, 630, 430);
  let s = await until(page, (q) => q.now && q.now.scene === "P7", 6000);
  g.check("seen with fur showing during the photo moment: the alarm (the photo moment is over)", !!s && s.now.shot.phase === "back", s && s.now.shot);
  s = await toCard(page);
  const T = await targets(page);
  T && (await page.touchscreen.tap(T.back.x, T.back.y));
  s = await until(page, (q) => q.now && q.now.scene === "P6" && q.ctrl, 40000);
  await place(page, 150, 585);
  const wb = await runWatch(page, 20, "done");
  s = await st(page);
  g.check("back at the party the Croc Boys walk back to the stage, and the second song starts", !!s && wb.phase === "done" && s.now.song === 1 && s.now.sound.song === 1 && s.now.band.every((b, i) => Math.hypot(b.x - hall.CAST.band[i].x, b.y - hall.CAST.band[i].y) < 2), [wb, s && s.now.song]);
  const camHome = hall.CAST.guests.find((q) => q.id === "camera");
  g.check("and the camera tourist has carried his camera back to his own spot", !!s && Math.hypot(s.now.people.camera.x - camHome.x, s.now.people.camera.y - camHome.y) < 2, s && s.now.people.camera);
  await page.close();
}

await g.finish("party-round4");
