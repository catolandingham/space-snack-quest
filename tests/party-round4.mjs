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
 *     party; ↺ and an alarm in the middle of it. Since 2026-11-25 the row is wider and staggered (no face in the
 *     hall row more than a quarter covered) and the Polaroid keeps it as it stood (no two faces overlap, the top
 *     hat on; each Croc Boy's face shows).
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
      lit: !!(p && p.tv && p.tv.lit != null),
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
// From P7's start: run home and hide under the bed; the guard looks round, Mops comes in and sends him off (their
// lines are tapped through, as a kid does), and then the card (Brian 2026-11-25, "Card after Mops sends the guard
// off"). `before` sets the party's state first. The lines seen on the way are kept in `toCard.talk`.
async function toCard(page, before) {
  before && (await set(page, before));
  await walk(page, hall.SPOTS.doorway.x, 605);
  let s = await until(page, (q) => q.room === "closet" && q.act === "HIDE · bed", 12000);
  if (!s) return null;
  await press(page);
  toCard.talk = [];
  return until(page, (q) => q.now && !!q.now.card, 40000, async (q) => {
    if (q.cur !== "bub") return;
    if (!toCard.talk.length || toCard.talk[toCard.talk.length - 1][1] !== q.text) (await sleep(150), toCard.talk.push([q.who, q.text, await bubbleName(page)]));
    await next(page);
  });
}
// Lines shown in order until `stop`, tapping NEXT on each: [who, text, name over the bubble].
async function readLines(page, stop, ms = 40000) {
  const seen = [];
  await until(page, (q) => stop(q, seen), ms, async (q) => {
    if (q.cur !== "bub") return;
    if (!seen.length || seen[seen.length - 1][1] !== q.text) {
      await sleep(150);
      seen.push([q.who, q.text, await bubbleName(page), q.lit]);
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
  // the game waits behind the card: Mops stands where he sent the guard off, Squatch stays under the bed, nothing runs
  // (before 2026-11-25 the guard waited behind it; now he has gone)
  const a0 = await page.evaluate(() => { const n = window.__ss.op; return [Math.round(n.mo.x), Math.round(n.mo.y), n.moPose, n.ch1PartyNow.pose, !!n.cur, !!n.ch1PartyNow.alarm]; });
  await sleep(1500);
  const a1 = await page.evaluate(() => { const n = window.__ss.op; return [Math.round(n.mo.x), Math.round(n.mo.y), n.moPose, n.ch1PartyNow.pose, !!n.cur, !!n.ch1PartyNow.alarm]; });
  g.check("the game waits behind the card (Mops in the room, Squatch under the bed, the guard gone, nothing moving)", JSON.stringify(a0) === JSON.stringify(a1) && a0[2] === "stand" && a0[3] === "bed" && !a0[5], [a0, a1]);
  // "Back to the party", with a finger
  await page.touchscreen.tap(T.back.x, T.back.y);
  s = await until(page, (q) => !q.full, 2000);
  g.check("a tap on \"Back to the party\" closes the card (still P7)", !!s && s.now.scene === "P7" && s.now.choice === "back", s && [s.now.scene, s.now.choice]);
  // (Brian 2026-11-25: with no words Mops heads back out to work, and Squatch sneaks out after him)
  s = await until(page, (q) => q.mo.pose === "hidden", 8000, async (q) => q.cur === "bub" && (await next(page)));
  g.check("with no words, Mops heads back out to work through the door (Squatch still under the bed till then)", !!s && s.now.pose === "bed" && s.cur !== "bub", s && [s.now.pose, s.mo]);
  await still(page, "r4-back-mops-goes-to-work");
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
  g.check("Mops has gone (he is nowhere in the room), and \"They lost you.\" was not said (Mops sent the guard off)", (s.mo.pose === "hidden" || s.mo.x > 960 || s.mo.x < 0) && s.note === 0, [s.mo, s.note]);
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
  s = await until(page, (q) => q.now && !!q.now.card, 40000, async (q) => q.cur === "bub" && (await sleep(150), await next(page)));
  g.check("under the bed before the alarm's own close-up has played: the card still comes, once Mops has sent the guard off", !!s && ["shout", "run", "pull"].includes(early) && !s.now.alarm && s.full === "party card", [early, s && s.now.alarm, s && s.full]);
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
// After the hat: Squatch's two questions and Mops's two answers (Brian 2026-11-24, night), then the TV.
const WHY_TALK = [
  ["sq", L("sq-why-hide")],
  ["sq", L("sq-why-guardians")],
  ["mops", L("mops-waiting")],
  ["mops", L("mops-heres-why")],
];
const after = await import(join(root, "src", "modules", "party-after-alarm.js"));
const talk = await import(join(root, "src", "modules", "party-talk.js"));
g.check(
  "the four lines after the hat are Brian's, word for word, approved and quiet (no meh)",
  JSON.stringify(WHY_TALK.map((l) => l[1])) === JSON.stringify(["But why do I have to hide from everyone but you?", "And why can't the Guardians and I be together?", "I've been waiting to show you this.", "Here's why you have to hide."]) &&
    ["sq-why-hide", "sq-why-guardians", "mops-waiting", "mops-heres-why"].every((id) => { const l = lines.PARTY_LINES.find((x) => x.id === id); return l && l.status === "approved" && l.quiet === true && l.source === "Brian 2026-11-24, Snack Quest Chat"; }),
);
// The game's own clock is stopped; only these ticks move it. Ticks until f(p, n) is true; returns the seconds, or -1.
const tickUntil = (page, f, max = 20) =>
  page.evaluate(`(() => { window.requestAnimationFrame = () => 0; const f = ${f}; for (let i = 0; i <= ${Math.round(max * 60)}; i++) { const n = window.__ss.op, p = n.ch1PartyNow; if (f(p, n)) { window.__ss.drawFrame(); return i / 60; } window.__ss.tick(1 / 60); } window.__ss.drawFrame(); return -1; })()`);
// How many pixels of the game picture in a box (game positions) are within `tol` of a colour.
const pixels = (page, box, hex, tol = 24) =>
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
const HORN = "#c9ad84"; // Mops's horns (the older program's drawing of him)
const TV_OFF = "#59657d"; // the TV's screen, off; on, it flickers between two pale blues
const tvLit = async (page) => (await pixels(page, { x0: after.TV.screen.x - 30, x1: after.TV.screen.x + 30, y0: after.TV.screen.y - 16, y1: after.TV.screen.y + 16 }, "#a7e2ff", 40)) > 400;
const tvDark = async (page) => (await pixels(page, { x0: after.TV.screen.x - 30, x1: after.TV.screen.x + 30, y0: after.TV.screen.y - 16, y1: after.TV.screen.y + 16 }, TV_OFF, 12)) > 400;
const atButton = (page, hex, r = 4, tol = 12) => pixels(page, { x0: after.TV.button.x - r, x1: after.TV.button.x + r, y0: after.TV.button.y - r, y1: after.TV.button.y + r }, hex, tol);
g.check(
  "the lines are Brian's, word for word",
  JSON.stringify(GUARD_TALK.map((l) => l[1])) === JSON.stringify(["Someone pulled the fur alarm.", "They saw someone run in here.", "Sure. I'm hiding a Wookiee in here.", "Ha! You're right. That's ridiculous.", "You coming to poker night?", "You know I don't have opposable thumbs."]) &&
    JSON.stringify(HOME_TALK.map((l) => l[1])) === JSON.stringify(["You went to the party.", "Everyone out there has someone.", "Everyone except me.", "You have me."]),
);
// The talk at home after the hat (Brian 2026-11-25, "Worry comes after You have me"): his worry, flyer held up, and
// Mops's answer, then the two questions.
const ROBOT_TALK = [
  ["sq", L("sq-robots-coming")],
  ["mops", L("mops-need-me")],
];
// Plays "Keep going" from the card to beat 20; returns what happened. `outfit` is what he wears, `lost` what is gone.
async function keepGoing(name, outfit, lost) {
  const { page, errors } = await open("party:P7");
  let s = await toCard(page, `(p) => ((p.outfit = ${JSON.stringify(outfit)}), (p.lostPieces = ${JSON.stringify(lost)}))`);
  const out = { errors, talk: toCard.talk.slice() };
  // (since 2026-11-25 Mops sends the guard off before the card, while Squatch is under the bed)
  out.guardFirst = !!s && s.now.pose === "bed" && !s.now.alarm && s.mo.pose === "stand";
  const T = await targets(page);
  await page.touchscreen.tap(T.keep.x, T.keep.y);
  s = await until(page, (q) => !q.full, 2000);
  out.closed = !!s && s.now.scene === "P8a";
  out.noNote = !!s && s.note === 0;
  // he comes out and fetches the flyer from by the door (it glows), then Mops looks at him
  s = await until(page, (q) => q.now && q.now.flyer === "take", 20000);
  out.fetch = !!s && s.now.flyerGlow !== undefined;
  name && (await still(page, `r4-keep-${name}-takes-the-flyer`));
  s = await until(page, (q) => q.now.costumeLook, 20000);
  out.cameOut = !!s && s.sqPose === "stand" && s.now.pose === "stand" && JSON.stringify(s.now.worn) === JSON.stringify(Object.fromEntries(Object.entries(outfit).map(([k, v]) => [k, lost.includes(k) ? "" : v])));
  out.look = !!s && s.cur !== "bub" && Math.abs(s.mo.x - s.x) < 260 && s.now.flyer === "paw";
  await sleep(300);
  name && (await still(page, `r4-keep-${name}-mops-looks`));
  out.home = await readLines(page, (q, seen) => seen.length >= 4 && q.cur !== "bub");
  // the lift (or the pat) plays itself: no taps from here
  s = await until(page, (q) => q.now && q.now.lift && q.now.lift.k > 0.45, 8000);
  out.lift = s ? s.now.lift : null;
  out.liftNoBubble = !!s && s.cur !== "bub";
  out.wornDuring = s ? s.now.worn : null;
  name && (await still(page, `r4-keep-${name}-lift`));
  // after the lift: his worry with the flyer held up, Mops's answer, then the two questions and two answers
  // (the six follow one another with no pause between them: read together, then split)
  const six = await readLines(page, (q, seen) => seen.length >= 6 && q.cur !== "bub");
  out.robots = six.slice(0, 2);
  out.why = six.slice(2);
  s = await st(page);
  out.tvOffForTalk = [...out.robots, ...out.why].every((l) => l[3] === false) && !s.lit && !!s.now;
  // the piece he lifted off lies on the floor between them (Mops does not carry it about)
  out.hatDown = s.now.lift && (s.now.lift.id ? s.now.lift.set === 1 && s.now.lift.rest.y + after.AFTER.hatUp >= s.y && s.now.lift.rest.y + after.AFTER.hatUp <= s.y + 12 && s.now.lift.rest.y < 600 && s.now.lift.rest.x > s.x + 40 && s.now.lift.rest.x < s.mo.x - 40 : s.now.lift.set == null);
  const hatRest = s.now.lift && s.now.lift.rest;
  // No words and no taps from here: Mops walks to the TV, presses its button with a horn, the TV comes on.
  const mopsWas = s.mo;
  out.walkBegan = (await tickUntil(page, '(p) => p && p.tv && p.tv.phase === "walk"', 4)) >= 0;
  await tickUntil(page, "() => false", 0.3);
  s = await st(page);
  out.walk = { tv: s.lit, bub: s.cur === "bub", dark: await tvDark(page), horn: await atButton(page, HORN), glow: await atButton(page, "#ffcf33", 16, 40), red: await atButton(page, "#e5533d", 4, 30), moved: Math.hypot(s.mo.x - mopsWas.x, s.mo.y - mopsWas.y) };
  out.jump = await page.evaluate(() => {
    // Mops walks there: no step of his is a jump (and Squatch stays where he is)
    const n = window.__ss.op,
      p = n.ch1PartyNow;
    let max = 0,
      was = [n.mo.x, n.mo.y],
      sq0 = [n.sq.x, n.sq.y];
    for (let i = 0; i < 1200 && p.tv && p.tv.phase === "walk"; i++) (window.__ss.tick(1 / 60), (max = Math.max(max, Math.hypot(n.mo.x - was[0], n.mo.y - was[1]))), (was = [n.mo.x, n.mo.y]));
    return { max, sq: Math.hypot(n.sq.x - sq0[0], n.sq.y - sq0[1]), phase: p.tv && p.tv.phase };
  });
  const hornBefore = await (async () => (await tickUntil(page, "() => true", 0), atButton(page, HORN)))();
  s = await st(page);
  out.atTv = { hornBefore, tv: s.lit, hatStayed: JSON.stringify(s.now.lift && s.now.lift.rest) === JSON.stringify(hatRest) };
  await tickUntil(page, `(p) => p.tv.phase === "press" && p.tv.k >= ${after.TV.peak}`, 4);
  s = await st(page);
  out.press = { horn: await atButton(page, HORN), tv: s.lit, lit: await tvLit(page), bub: s.cur === "bub", heard: (await played(page)).slice(-3), now: !!s.now };
  name === "tophat" && (await still(page, "r4-keep-horn-press"));
  out.onAfter = await tickUntil(page, '(p) => p.tv.phase === "on"', 4);
  await tickUntil(page, "() => false", 0.4);
  s = await st(page);
  out.on = { tv: s.lit, lit: await tvLit(page), now: !!s.now, bub: s.cur === "bub", horn: await atButton(page, HORN), mopsDown: s.mo.y };
  name === "tophat" && (await still(page, "r4-keep-tv-on"));
  // then beat 20 as today: its first panel, the party night over
  out.heldFor = await tickUntil(page, '(p, n) => !p || p.scene === "done" || (n.cur && (n.cur.k === "panel" || n.cur.k === "card"))', 8);
  s = await st(page);
  out.tv = s.tv && (!s.now || s.now.scene === "done") && (await page.evaluate(() => { const c = window.__ss.op.cur; return !!c && c.k === "card" && c.id === "fb" && c.text === "Years ago, on Stormtop..."; }));
  name === "tophat" && (await page.evaluate(() => window.__ss.drawFrame()), await still(page, "r4-keep-tv-story-first-picture"));
  // the TV story fills the whole picture (Brian 2026-11-25: "the more fullscreen TV"): its first card is dark in all four corners
  out.full = await page.evaluate(() => {
    const c = document.querySelector("canvas"),
      k = c.width / 960,
      x = c.getContext("2d");
    return [[30, 30], [930, 30], [30, 600], [930, 600]].map(([a, b]) => Array.from(x.getImageData(Math.round(a * k), Math.round(b * k), 1, 1).data).slice(0, 3));
  });
  await page.close();
  return out;
}
{
  const o = await keepGoing("tophat", { head: "tophat", face: "shades", body: "shirt", legs: "boots" }, []);
  g.check("before the card, Mops comes in and sends the guard off while Squatch is under the bed: the six lines, word for word, in order, each from its speaker", o.guardFirst && JSON.stringify(o.talk.map((l) => [l[0], l[1]])) === JSON.stringify(GUARD_TALK), o.talk);
  g.check("over the guard's bubble, a name (\"A guard\"), never blank; over Mops's, \"Mops\"", o.talk.filter((l) => l[0] === "mops").every((l) => l[2] === "Mops") && o.talk.filter((l) => l[0] === "guard").every((l) => l[2] === "A guard"), o.talk.map((l) => l[2]));
  g.check("a tap on \"Keep going\" closes the card: the ending (P8a), and no \"They lost you.\" was said", o.closed && o.noNote);
  g.check("Squatch comes out still in costume and takes the flyer he left by the door; Mops looks at him (the costume and the flyer glow, before any line)", o.fetch && o.cameOut && o.look, [o.fetch, o.cameOut, o.look]);
  g.check("Mops and Squatch: the four lines, word for word, in order", JSON.stringify(o.home.map((l) => [l[0], l[1]])) === JSON.stringify(HOME_TALK), o.home);
  g.check("with no words, Mops lifts the hat off him: it leaves his head and plays itself", o.lift && o.lift.id === "tophat" && o.liftNoBubble && o.wornDuring && o.wornDuring.head === "tophat", [o.lift, o.liftNoBubble]);
  g.check("the hat he lifted off is set down on the floor between them, and stays there when Mops walks to the TV", o.hatDown && o.atTv.hatStayed, [o.hatDown, o.atTv]);
  g.check("after the hat: \"But look. Robots are coming to do your job.\" and \"Nobody is replacing me. They need me here.\", word for word, each from its speaker", JSON.stringify(o.robots.map((l) => [l[0], l[1]])) === JSON.stringify(ROBOT_TALK), o.robots);
  g.check("then Squatch's two questions and Mops's two answers, word for word, in order, each from its speaker, with the TV still off", JSON.stringify(o.why.map((l) => [l[0], l[1]])) === JSON.stringify(WHY_TALK) && o.tvOffForTalk, [o.why, o.tvOffForTalk]);
  g.check("Mops answers only the first question: nothing he says names the Guardians", o.why.filter((l) => l[0] === "mops").every((l) => !/guardian/i.test(l[1])) && o.why.filter((l) => l[0] === "mops").length === 2);
  g.check("then, with no words, Mops walks to the TV (no jump; Squatch stays put); its button glows and the screen is still dark", o.walkBegan && !o.walk.tv && !o.walk.bub && o.walk.dark && o.walk.glow > 8 && o.walk.red > 8 && o.walk.horn === 0 && o.jump.max > 0 && o.jump.max <= 8 && o.jump.sq < 1 && o.jump.phase === "press", [o.walk, o.jump]);
  g.check("he presses the TV's button with his horn: the horn is drawn on the button at the press (and was not there as he walked up), with its click", o.press.horn >= 12 && o.walk.horn === 0 && o.atTv.hornBefore === 0 && o.press.heard.includes("click") && !o.press.bub, [o.atTv, o.press]);
  g.check("the TV comes on at the press, not before (the screen is drawn lit), and stays on while he stands back down", !o.atTv.tv && o.press.tv && o.press.lit && o.on.tv && o.on.lit && o.on.now && !o.on.bub && Math.abs(o.on.mopsDown - after.TV.stand.y) < 1, [o.atTv, o.press, o.on]);
  g.check("the lit TV is held a moment (a clear last frame), then beat 20 (the TV story), and the party night is over", o.heldFor >= 1 && o.heldFor <= 4 && o.tv, [o.heldFor, o.tv]);
  g.check("the TV story starts full screen: its \"Years ago, on Stormtop...\" card is dark in all four corners (tests/tv-story.mjs checks the pictures)", o.full.every((c) => Math.abs(c[0] - 0x1e) < 12 && Math.abs(c[1] - 0x24) < 12 && Math.abs(c[2] - 0x30) < 12), o.full);
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
  g.check("nothing on his head: a gentle pat (nothing is lifted or set down), then the six lines, the TV and beat 20", o.lift && o.lift.id === "" && o.liftNoBubble && o.cameOut && o.hatDown && o.robots.length === 2 && o.why.length === 4 && o.press.lit && o.tv, [o.lift, o.cameOut, o.tv]);
}

// ---------- ↺ in "Keep going" ----------
{
  const { page } = await open("party:P8a");
  // (it goes straight on into the talk, and the flyer is near the bed now: read the restart point right after a ↺)
  await page.evaluate(() => window.__ss.sectionReset());
  let s = await st(page);
  g.check("the ending's restart point: from under the bed, Mops in the room, the guard gone, no card, the flyer still under the bed", s.now.scene === "P8a" && s.room === "closet" && !s.now.alarm && !s.now.card && s.now.choice === "keep" && s.mo.pose === "stand" && s.now.flyer === "bed", [s.now.scene, s.now.pose, s.now.alarm, s.mo, s.now.flyer]);
  s = await until(page, (q) => q.cur === "bub", 30000);
  await next(page);
  await sleep(300);
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(600);
  s = await st(page);
  g.check("↺ in the middle of the talk: \"Keep going\" starts over from under the bed (no line up, the flyer back under the bed)", s.now.scene === "P8a" && s.cur !== "bub" && s.mo.pose === "stand" && !s.now.alarm && (s.now.pose === "bed" || s.now.flyer === "bed"), [s.now.scene, s.now.pose, s.cur, s.mo.pose, s.now.flyer]);
  s = await until(page, (q) => q.cur === "bub", 30000);
  g.check("and it plays again: Mops's first line", !!s && s.text === L("mops-went"), s && s.text);
  await page.close();
}

{
  // ↺ after the TV has come on: "Keep going" starts over with the TV off and no button drawn
  const { page } = await open("party:P8a");
  let s = await until(page, (q) => q.now && q.now.tv && q.lit, 90000, async (q) => q.cur === "bub" && (await sleep(120), await next(page)));
  g.check("(Keep going played through to the TV coming on)", !!s && s.lit && (await tvLit(page)), s && s.now.tv);
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(600);
  s = await st(page);
  g.check("↺ once the TV is on: \"Keep going\" starts over from under the bed, the TV off again", s.now.scene === "P8a" && !s.lit && !s.now.tv && !s.now.lift && s.mo.pose === "stand" && (await tvDark(page)), [s.now.scene, s.lit, s.now.tv]);
  await page.close();
}
{
  // ↺ in the middle of the new part: while the hat is being set down, and again in the middle of the horn press.
  // Each time "Keep going" starts over clean, and the third time it plays through to beat 20.
  const { page, errors } = await open("party:P8a");
  const play = (stop, ms = 90000) => until(page, stop, ms, async (q) => q.cur === "bub" && (await sleep(120), await next(page)));
  let s = await play((q) => q.now && q.now.lift && q.now.lift.set != null && q.now.lift.set < 1);
  g.check("(the hat is on its way down to the floor)", !!s, s && s.now.lift);
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(600);
  s = await st(page);
  g.check("↺ while the hat is being set down: \"Keep going\" starts over (nothing lifted, no TV, the flyer back under the bed)", s.now.scene === "P8a" && !s.now.lift && !s.now.tv && s.now.flyer === "bed", [s.now.pose, s.now.lift, s.now.tv, s.now.flyer]);
  s = await play((q) => q.now && q.now.tv && q.now.tv.phase === "press" && q.now.tv.k > 0.1);
  g.check("(Mops is in the middle of the horn press)", !!s, s && s.now.tv);
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(600);
  s = await st(page);
  // (the talk starts at once: Mops steps from where he sent the guard off to his place beside the middle)
  g.check("↺ in the middle of the horn press: it starts over, the TV off, Mops back where he sent the guard off (or stepping from there to his place for the talk)", s.now.scene === "P8a" && !s.now.lift && !s.now.tv && !s.lit && s.mo.x >= after.AFTER_SPOTS.mopsTalk.x - 2 && s.mo.x <= talk.TALK_SPOTS.sq.x + talk.TALK.beside + 2 && (await tvDark(page)), [s.now.pose, s.now.tv, s.mo]);
  s = await play((q) => q.tv && (!q.now || q.now.scene === "done"), 120000);
  g.check("and played once more it runs clean to beat 20 (no left-over wait from the runs before)", !!s && errors.length === 0, [!!s, errors.slice(0, 2)]);
  await page.close();
}
{
  // The first alarm's close-up (the hand on the alarm) can start while he is walking in through his own door. He
  // must still have control at home when it is over, to hide: before, the close-up put control back to "off" (he
  // was mid-walk when it began) and he stood there with no button until the guard came.
  let staged = null;
  for (const wait of [700, 450, 950, 250]) {
    const { page } = await open("party:P6");
    await set(page, (p) => (p.lostPieces = ["head"]));
    await place(page, 470, 420);
    let s = await until(page, (q) => q.now && q.now.scene === "P7", 8000);
    if (!s) { await page.close(); continue; }
    await sleep(wait);
    await walk(page, hall.SPOTS.doorway.x, 605);
    // the moment the close-up opens: was he in the middle of the scripted walk home?
    const at = await page.evaluate(async () => {
      const n = window.__ss.op;
      for (let i = 0; i < 300; i++) {
        if (document.querySelector('canvas[aria-label="fur alarm"]')) return { ctrl: !!n.ctrl, cur: n.cur ? n.cur.k : "", room: n.room, y: Math.round(n.sq.y) };
        await new Promise((r) => setTimeout(r, 20));
      }
      return null;
    });
    if (at && !at.ctrl && at.cur === "until") {
      // (a kid cannot press anything while the close-up fills the screen: wait for it to end)
      const over = await page.evaluate(async () => {
        for (let i = 0; i < 300; i++) {
          if (!document.querySelector('canvas[aria-label="fur alarm"]')) return true;
          await new Promise((r) => setTimeout(r, 20));
        }
        return false;
      });
      s = await until(page, (q) => q.room === "closet" && q.ctrl && q.act === "HIDE · bed", 1500);
      staged = { wait, at, got: !!s, closeUpOver: over, alarm: s && s.now.alarm };
      if (s) {
        await press(page);
        s = await until(page, (q) => q.full === "party card", 40000, async (q) => q.cur === "bub" && (await sleep(150), await next(page)));
        staged.card = !!s;
      }
      await page.close();
      break;
    }
    await page.close();
  }
  g.check("(staged: the alarm's close-up opened while he was walking in through his door)", !!staged, staged);
  g.check("when the close-up is over he has control at home and HIDE · bed is offered; he hides and the card comes", !!staged && staged.got && staged.closeUpOver && staged.card, staged);
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
// ---------- every face in the photo shows (Brian 2026-11-25, "make the fixes you think best") ----------
// Each person's face box (party-photo.js PHOTO_FACES, shares of their drawn height) and, for whoever stands in front
// of them, their face and body; Squatch's head with the piece on it (party-art.js PIECES, BODY_SPOTS) and his body.
// Heights: the guests' approved pictures (their own heights, the teal guest a grown-up), the Croc Boys 0.98 of one.
const art = await import(join(root, "src", "modules", "party-art.js"));
const { readFileSync } = await import("node:fs");
const pngHeight = (f) => readFileSync(join(root, "docs", "approved-art", "guests", f)).readUInt32BE(20);
const TEAL_H = pngHeight("teal.png");
const GUEST_FILE = { teal: "teal.png", backpack: "backpack.png", stilt: "stilt.png", "octopus-guest": "octopus.png", robot: "robot.png" };
function rowBoxes(adult, sqScale, head = "tophat") {
  const P = photo.PHOTO_ROW,
    out = [];
  for (const r of [...P.back, ...P.front]) {
    const band = r.id.startsWith("band"),
      h = band ? adult * 0.98 : (pngHeight(GUEST_FILE[r.id]) / TEAL_H) * adult,
      f = photo.PHOTO_FACES[band ? "band" : r.id];
    out.push({ id: r.id, y: r.y, face: { x0: r.x + f.x0 * h, x1: r.x + f.x1 * h, y0: r.y + f.y0 * h, y1: r.y + f.y1 * h }, body: { x0: r.x - 0.2 * h, x1: r.x + 0.2 * h, y0: r.y + f.y1 * h, y1: r.y } });
  }
  // Squatch: his head (and the piece on it) and his body, in his units, at his scale
  const s = P.squatch,
    spot = art.BODY_SPOTS.head,
    piece = art.PIECES.find((q) => q.id === head),
    ph = piece ? spot.w * piece.h : 0,
    top = piece ? spot.y - ph / 2 + 3 - ph / 2 : -45;
  out.push({ id: "squatch", y: s.y, face: { x0: s.x - 14 * sqScale, x1: s.x + 14 * sqScale, y0: s.y + top * sqScale, y1: s.y - 19.5 * sqScale }, body: { x0: s.x - 13 * sqScale, x1: s.x + 13 * sqScale, y0: s.y - 19.5 * sqScale, y1: s.y } });
  return out;
}
const overlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
const inBox = (x, y, b) => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1;
// How much of each face is under someone drawn in front of it (further down the screen; the same row counts both
// ways), on a 20 x 20 grid over the face.
function covered(boxes) {
  return boxes.map((a) => {
    const front = boxes.filter((b) => b !== a && b.y >= a.y);
    let hid = 0;
    for (let i = 0; i < 20; i++)
      for (let j = 0; j < 20; j++) {
        const x = a.face.x0 + ((i + 0.5) / 20) * (a.face.x1 - a.face.x0),
          y = a.face.y0 + ((j + 0.5) / 20) * (a.face.y1 - a.face.y0);
        front.some((b) => inBox(x, y, b.face) || inBox(x, y, b.body)) && hid++;
      }
    return { id: a.id, hid: hid / 400 };
  });
}
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
  // the first song ends: the band stops; since 2026-11-25 (Brian, showing-5 note 5) one thing at a time
  await set(page, (p, n, a) => (p.songT = a - 0.2), free.SONG_SECONDS);
  s = await until(page, (q) => q.now.shot && q.now.shot.phase === "settle", 3000);
  g.check("when the first song ends the photo moment begins: the band stops playing", !!s && s.now.sound.song === -1 && s.now.song === 0, s && [s.now.shot, s.now.sound.song]);
  // in the dance spotlight and at the bar, nothing is offered until everyone is in place
  await place(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4);
  await sleep(350);
  s = await st(page);
  g.check("during the photo moment, before everyone is in place, standing in the spotlight offers nothing (no DANCE, no JOIN yet)", s.act === "" && s.now.shot.phase !== "join", [s.act, s.now.shot.phase]);
  await place(page, hall.SNACK_SPOT.x - 10, hall.SNACK_SPOT.y + 10);
  await sleep(350);
  s = await st(page);
  g.check("and at the snack bar nothing either (no GRAB during the photo moment)", s.act === "", s.act);
  await place(page, 150, 585);
  const nCount = (await played(page)).length;
  const w = await runWatch(page, 30, "join");
  s = await st(page);
  // (a Croc Boy calls it from the stage, Brian 2026-11-25: "Group photo!")
  g.check("a Croc Boy calls \"Group photo!\" from the stage", (await liveLines(page)).includes("Group photo!"), await liveLines(page));
  g.check("the camera tourist carries the camera over, then everyone walks to the row (the band off the stage's end and across the floor); nobody jumps", w.phase === "join" && w.max <= Math.max(photo.PHOTO.walk, photo.PHOTO.carry) * 0.05 + 0.5, w);
  g.check("once everyone is in place the kid has PHOTO.joinTime before the count of 3", s.now.shot.phase === "join" && photo.PHOTO.joinTime > 0 && photo.PHOTO.count === 3, s.now.shot);
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
  const sqScale = await page.evaluate(() => window.SSQ.engine().hallSizes().squatch),
    hallCover = covered(rowBoxes(adult, sqScale));
  g.check("in the hall row no face is more than a quarter covered (Squatch in his place with the top hat on)", hallCover.every((c) => c.hid <= 0.25), hallCover.filter((c) => c.hid > 0));
  g.check("the row is wider and staggered: 64 or more apart along each row, each front place in a gap of the back row", [photo.PHOTO_ROW.back, [...photo.PHOTO_ROW.front, photo.PHOTO_ROW.squatch].sort((a, b) => a.x - b.x)].every((row) => row.every((r, i) => !i || r.x - row[i - 1].x >= 64)) && [...photo.PHOTO_ROW.front, photo.PHOTO_ROW.squatch].every((f) => photo.PHOTO_ROW.back.every((b) => Math.abs(b.x - f.x) >= 24)));
  // he presses it and walks into his place
  await press(page);
  const wj = await page.evaluate(() => {
    const op = window.__ss.op;
    let max = 0,
      was = [op.sq.x, op.sq.y];
    for (let i = 0; i < 60 && !op.ch1PartyNow.shot.in; i++) (window.__ss.tick(0.05), (max = Math.max(max, Math.hypot(op.sq.x - was[0], op.sq.y - was[1]))), (was = [op.sq.x, op.sq.y]));
    return { max: Math.round(max * 10) / 10, phase: op.ch1PartyNow.shot.phase };
  });
  s = await st(page);
  g.check("pressing it walks him into the gap (a walk, no jump), facing the camera, before the click", Math.hypot(s.x - photo.PHOTO_ROW.squatch.x, s.y - photo.PHOTO_ROW.squatch.y) < 2 && s.now.shot.in && ["join", "count"].includes(wj.phase) && wj.max <= photo.PHOTO.join * 0.05 + 0.5, [s.x, s.y, s.now.shot, wj]);
  await runWatch(page, 4, "count");
  s = await st(page);
  g.check("\"Say cheese!\" as the count starts", (await liveLines(page)).includes("Say cheese!") && s.now.shot.phase === "count", await liveLines(page));
  await sleep(120);
  await still(page, "r4-photo-say-cheese");
  const bub = await page.evaluate(() => { const b = window.__ss.lastBubble, n = window.__ss.op, k = window.SSQ.engine().hallSizes().squatch; return b ? b.x < n.sq.x + 19 * k && b.x + b.w > n.sq.x - 19 * k && b.y - 24 < n.sq.y && b.y + (b.h || 60) > n.sq.y - 72 * k : false; });
  g.check("the \"Say cheese!\" bubble does not cover Squatch in the row", bub === false, bub);
  const stars0 = s.now ? (await page.evaluate(() => window.__ss.op.stars || 0)) : 0;
  await runWatch(page, 4, "polaroid");
  await sleep(250);
  // (the count began before he pressed JOIN: its first beep is counted from the count's start)
  heard = await sounds(page, nCount);
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
  // The Polaroid keeps the row as it stood (one scale across and up), so its faces are the row's faces: no two
  // overlap, Squatch's head with the top hat included. Then, in the picture drawn: each Croc Boy's face is his
  // green crocodile head (the top hat once covered one).
  const pb = rowBoxes(adult, sqScale),
    pairs = [];
  pb.forEach((a, i) => pb.slice(i + 1).forEach((b) => overlap(a.face, b.face) > 0 && pairs.push([a.id, b.id])));
  g.check("in the Polaroid no two faces overlap, with the top hat on", pairs.length === 0, pairs);
  const seenFaces = await page.evaluate(() => {
    const cv = document.querySelector('canvas[aria-label="group photo"]');
    return { w: cv.clientWidth, h: cv.clientHeight, k: cv.width / cv.clientWidth };
  });
  const L = photo.polaroidLayout(seenFaces.w, seenFaces.h),
    toScreen = (x, y) => {
      // the Polaroid's frame: its middle at (w / 2, h * 0.47), tilted -0.035 once it has slid in
      const q = L.at(x, y),
        a = -0.035;
      return { x: seenFaces.w / 2 + q.x * Math.cos(a) - q.y * Math.sin(a), y: seenFaces.h * 0.47 + q.x * Math.sin(a) + q.y * Math.cos(a) };
    };
  const faceColours = await page.evaluate(
    (pts, k) => {
      const ctx = document.querySelector('canvas[aria-label="group photo"]').getContext("2d");
      return pts.map((g) => g.map((p) => Array.from(ctx.getImageData(Math.round(p.x * k), Math.round(p.y * k), 1, 1).data).slice(0, 3)));
    },
    pb.filter((b) => b.id !== "squatch").map((b) => {
      const pts = [];
      for (let i = 1; i <= 5; i++) for (let j = 1; j <= 5; j++) pts.push(toScreen(b.face.x0 + ((b.face.x1 - b.face.x0) * i) / 6, b.face.y0 + ((b.face.y1 - b.face.y0) * j) / 6));
      return pts;
    }),
    seenFaces.k,
  );
  const near = (c, h, tol) => [1, 3, 5].every((i, j) => Math.abs(c[j] - parseInt(h.slice(i, i + 2), 16)) <= tol);
  const faceReport = pb.filter((b) => b.id.startsWith("band")).map((b) => ({ id: b.id, green: faceColours[pb.filter((q) => q.id !== "squatch").indexOf(b)].filter((c) => near(c, "#3fae4a", 30)).length }));
  // his party shirt's long sleeves in the Polaroid too (Brian 2026-11-25): a third and half way down each arm
  const shirtArt = await import(join(root, "src", "modules", "party-shirt-art.js")),
    sq = photo.PHOTO_ROW.squatch,
    sleevePts = [-1, 1].flatMap((side) => [3, 4.5].map((d) => ({ x: sq.x + side * (10.5 + Math.sin(0.35) * d) * sqScale, y: sq.y + (-18 + Math.cos(0.35) * d) * sqScale }))),
    sleeveCs = await page.evaluate(
      (pts, k) => {
        const ctx = document.querySelector('canvas[aria-label="group photo"]').getContext("2d");
        return pts.map((p) => Array.from(ctx.getImageData(Math.round(p.x * k), Math.round(p.y * k), 1, 1).data).slice(0, 3));
      },
      sleevePts.map((q) => toScreen(q.x, q.y)),
      seenFaces.k,
    );
  // (the shirt's orange, a spot, or at this small size a blend of the two)
  const sleeveArt = await import(join(root, "src", "modules", "sleeve-art.js")),
    onShirt = (c) =>
      sleeveArt.SHIRT_SPOTS.some((hx) => {
        const a = [255, 138, 61],
          b = [1, 3, 5].map((i) => parseInt(hx.slice(i, i + 2), 16)),
          ab = a.map((v, j) => b[j] - v),
          t = Math.max(0, Math.min(1, ab.reduce((n, v, j) => n + v * (c[j] - a[j]), 0) / ab.reduce((n, v) => n + v * v, 0)));
        return Math.hypot(...a.map((v, j) => v + ab[j] * t - c[j])) <= 24;
      });
  g.check("in the Polaroid his party shirt has long sleeves (orange half way down both arms)", shirtArt.SLEEVE.wide > 0 && sleeveCs.every(onShirt), sleeveCs.map((c) => c.join(",")));
  g.check("in the Polaroid each Croc Boy's face shows: his green crocodile head over a quarter of his face's places", faceReport.every((f) => f.green >= 7), faceReport);
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
  await until(page, (q) => q.now.shot && q.now.shot.phase === "settle", 3000);
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
  let s = await until(page, (q) => q.now.shot && q.now.shot.phase === "settle", 3000);
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
  g.check("GRAB pressed as the first song ends: the photo moment begins and no snack close-up opens over it (he has control; JOIN · photo comes once everyone is in place)", !!s.now.shot && !s.now.snack && s.ctrl && s.act !== "GRAB · snacks", [s.now.shot, s.now.snack, s.ctrl, s.act]);
  await page.close();
}
{
  // ↺ in the middle of the photo moment: P6 starts over, the band on the stage, and the photo will come again.
  const { page } = await open("party:P6");
  await place(page, 150, 585);
  await set(page, (p, n, a) => (p.songT = a - 0.2), free.SONG_SECONDS);
  await until(page, (q) => q.now.shot && q.now.shot.phase === "settle", 3000);
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
  await until(page, (q) => q.now.shot && q.now.shot.phase === "gather", 10000);
  // (in the middle of the gathering)
  await runWatch(page, 3, "count");
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

// ---------- a guest's "?" is small and never over or near Squatch's head or hat (Brian 2026-11-25) ----------
// Brian: "The big question marks are a bit confusing - it's over his top hat?". Squatch, top hat on, stands right by a
// guest who sees him (below him, beside him on either side, below and to one side); one frame is drawn and the "?"
// read off the canvas: one "?", by that guest, small, and QUESTION.clear or more from Squatch's box, hat included.
{
  const { page, errors } = await open("party:P6");
  await page.evaluate(() => (window.requestAnimationFrame = () => 0));
  const view = await import(join(root, "src", "modules", "party-view.js"));
  const Q = view.QUESTION;
  const sizes = await page.evaluate(() => window.SSQ.engine().hallSizes());
  const rows = [];
  for (const id of ["camera", "backpack", "teal"]) {
    const g0 = (await st(page)).now.people[id];
    for (const [dx, dy] of [[0, 40], [0, 60], [-50, 10], [50, 10], [-40, 45], [40, 45], [0, -20]]) {
      const r = await page.evaluate(
        (id, dx, dy) => {
          const n = window.__ss.op,
            p = n.ch1PartyNow,
            g = p.people[id];
          n.sq.x = g.x + dx;
          n.sq.y = g.y + dy;
          // (a "?" filled all the way: since 2026-11-25 it starts at half size and grows, party-question.js)
          p.qs = { [id]: { k: 1, a: 1 } };
          p.pose = "stand";
          const P = CanvasRenderingContext2D.prototype,
            fill = P.fillText,
            c = document.querySelector("canvas"),
            k = c.width / 960,
            marks = [];
          P.fillText = function (t, x, y, ...r) {
            if (t === "?") {
              const m = this.getTransform();
              marks.push({ x: (m.a * x + m.c * y + m.e) / k, y: (m.b * x + m.d * y + m.f) / k, size: (parseFloat((this.font.match(/(\d+(\.\d+)?)px/) || [])[1]) * m.d) / k });
            }
            return fill.call(this, t, x, y, ...r);
          };
          window.__ss.drawFrame();
          P.fillText = fill;
          return { marks, g: { x: g.x, y: g.y }, sq: { x: n.sq.x, y: n.sq.y }, hat: window.SSQ.beat("ch1-party").now().worn.head };
        },
        id,
        dx,
        dy,
      );
      const k = sizes.squatch,
        box = { x0: r.sq.x - 22 * k, x1: r.sq.x + 22 * k, y0: r.sq.y - Q.top * k, y1: r.sq.y + 2 },
        // (drawMark: the words are 0.85 of the mark's size, 0.04 of it below its middle; its white oval is 0.46 by 0.56
        // of the size each side of the middle, and its outline 0.07)
        f = r.marks[0],
        m = f && { x: f.x, size: f.size / 0.85, y: f.y - (0.04 * f.size) / 0.85 },
        hx = m ? m.size * 0.5 : 0,
        hy = m ? m.size * 0.6 : 0,
        gap = m ? Math.hypot(Math.max(0, box.x0 - (m.x + hx), m.x - hx - box.x1), Math.max(0, box.y0 - (m.y + hy), m.y - hy - box.y1)) : -1;
      rows.push({ id, dx, dy, n: r.marks.length, hat: r.hat, gap: Math.round(gap), size: m && Math.round(m.size), byGuest: m ? Math.round(Math.abs(m.x - r.g.x)) : -1, aboveFeet: m ? m.y < r.g.y : false });
    }
  }
  g.check("in every place by a guest who sees him (top hat on), one \"?\" is drawn", rows.every((r) => r.n === 1 && r.hat === "tophat"), rows.filter((r) => r.n !== 1));
  g.check(`it keeps ${Q.clear} or more from Squatch, his top hat included (never over or near his head)`, rows.every((r) => r.gap >= Q.clear), rows.filter((r) => r.gap < Q.clear));
  g.check("it stays by its own guest (within 90 across, above his feet)", rows.every((r) => r.byGuest <= 90 && r.aboveFeet), rows.filter((r) => !(r.byGuest <= 90 && r.aboveFeet)));
  g.check(`it is small: about ${Math.round(Q.size * 100)}% of a grown-up's height (it was 64%)`, rows.every((r) => Math.abs(r.size - sizes.adult * Q.size) <= 2), [rows[0].size, sizes.adult]);
  g.check("no page errors (the \"?\" by the guest)", errors.length === 0, errors);
  await page.close();
}
await g.finish("party-round4");
