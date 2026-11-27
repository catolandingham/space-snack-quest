/**
 * Beat 20, the TV story (Brian 2026-11-25, "1"): the old Wookiee picture story from commit 71ec66e is back in
 * place of the stand-in, full screen, each picture waiting for NEXT.
 *   - it plays in order: the "Years ago, on Stormtop..." card, tour, shed, clog, the "*gasp*", the Station
 *     Official and the TOURS ship, the "Now" card; then bedtime goes on (the snack card) as before;
 *   - every word is the old approved wording (src/modules/tv-story-lines.js), word for word, and shows on screen;
 *   - each picture fills the screen and waits (it is still up after 6 seconds with no tap);
 *   - Brian's Wookiee recording is asked for on the tour, the shed and the ship pictures, and nowhere else;
 *   - sizes: a grown-up is the same height in every picture, a Wookiee 1.2 to 1.5 grown-ups, and the TOURS
 *     ship's door is made for a Wookiee (he is about 85% of it, the game's grown-up-to-door rule); the Wookiees
 *     all walk into the ship by the end of their picture;
 *   - the stand-in's words ("Fur in the scrubber.", "Onto the ship.") are gone from the build, and the recording
 *     is in sounds/ under a name with no person's name in it.
 *   node tests/tv-story.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const { TV_STORY_LINES } = await import(join(root, "src", "modules", "tv-story-lines.js"));
const L = Object.fromEntries(TV_STORY_LINES.map((l) => [l.id, l.text]));
const OLD = readFileSync(join(root, "index.html"), "utf8");

const g = await startGame({ port: 9731, name: "tv-story" });
const { page, errors } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);

// Start beat 20 the way the party's endings do (the engine's tvStory), with the queue cleared.
const started = await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = [];
  n.cur = null;
  if (!window.SSQ || !window.SSQ.engine() || !window.SSQ.beat("ch1-tv-story")) return false;
  window.SSQ.engine().tvStory();
  return true;
});
g.check("the TV story beat is registered and starts", started);
// Its first step: Squatch puts the tape in, a wordless picture that plays by itself (Brian 2026-11-26, #39)
const tape = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  for (let k = 0; k < 10 && !(n.cur && n.cur.k === "cutaway"); k++) ss.tick(0.05);
  ss.drawFrame();
  const c = n.cur,
    first = c ? { k: c.k, id: c.id, panel: c.panel, auto: c.auto || 0, drew: window.SSQ.cutaway.last() } : null;
  let t = 0;
  for (; t < 6 && n.cur === c; t += 0.05) (ss.tick(0.05), ss.drawFrame());
  return { first, went: Math.round(t * 100) / 100 };
});
g.check("first the tape goes in: a wordless picture of his paw pushing it into the player; it plays by itself (2 to 3 s)", !!tape.first && tape.first.id === "tvtape" && tape.first.panel === 0 && tape.first.drew && tape.first.drew.pic === "tape" && tape.went >= 2 && tape.went <= 3, tape);

const seen = [];
let waited = null;
for (let i = 0; started && i < 40; i++) {
  const s = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    // (a wordless picture plays by itself: the tape going in; it is ticked through)
    for (let k = 0; k < 80 && (!(n.cur && ["card", "cutaway", "panel", "bub"].includes(n.cur.k)) || (n.cur.k === "cutaway" && n.cur.auto)); k++) ss.tick(0.05);
    ss.drawFrame();
    const c = n.cur,
      last = window.SSQ.cutaway.last();
    return {
      k: c ? c.k : "",
      id: c ? c.id || "" : "",
      panel: c && c.k === "cutaway" ? c.panel : null,
      text: c && c.k === "card" ? c.text : "",
      drew: c && c.k === "cutaway" ? last : null,
      shown: ss.shown(),
      roars: window.SSQ.beat("ch1-tv-story") ? window.SSQ.beat("ch1-tv-story").roars() : [],
    };
  });
  seen.push(s);
  if (s.k === "panel" && s.id === "ch1moon") break;
  // the first picture: no tap for 6 seconds, it is still up (it waits for NEXT)
  if (s.k === "cutaway" && s.id === "wookiee" && waited == null) {
    waited = await page.evaluate(() => {
      const ss = window.__ss;
      for (let k = 0; k < 120; k++) ss.tick(0.05);
      const c = ss.op.cur;
      return !!c && c.k === "cutaway" && c.id === "wookiee" && c.panel === 0;
    });
  }
  // the ship picture: let the Wookiees walk to the end of their walk
  if (s.k === "cutaway" && s.drew && s.drew.pic === "banish")
    s.end = await page.evaluate(() => {
      const ss = window.__ss;
      for (let k = 0; k < 140; k++) ss.tick(0.05);
      ss.drawFrame();
      return window.SSQ.cutaway.last();
    });
  await page.evaluate(() => ((window.__ss.op.bt = 1), window.__ss.opTap()));
}

const order = seen.filter((s) => s.k !== "until").map((s) => (s.k === "card" ? "card:" + s.text : s.k === "cutaway" ? "pic:" + (s.drew && s.drew.pic) : s.k + ":" + s.id));
const want = ["pic:news", "card:" + L["card-years-ago"], "pic:tour", "pic:shed", "pic:clog", "pic:gasp", "pic:banish", "card:" + L["card-now"], "panel:ch1moon"];
g.check("the story plays in order: the tape goes in, the STORMTOP NEWS card (Brian 2026-11-26, #39), Years ago, tour, shed, clog, *gasp*, the ship, Now; then bedtime as before", JSON.stringify(order) === JSON.stringify(want), order);
g.check("every picture is the full-screen cutaway: the tape and the news card, then the Wookiee story", seen.filter((s) => s.k === "cutaway").length === 6 && seen.filter((s) => s.k === "cutaway").every((s) => (s.id === "wookiee" || s.id === "tvtape") && s.drew && s.drew.full), seen.filter((s) => s.k === "cutaway").map((s) => s.id));
g.check("a picture waits for NEXT (still up after 6 seconds with no tap)", waited === true, waited);

const final = seen[seen.length - 1] || { shown: [], roars: [] };
const shown = new Set(final.shown);
const wordsOf = (t) => t;
const mustShow = ["news-title", "card-years-ago", "cap-tour", "cap-shed", "cap-clog", "tourist-gasp", "official-no-fur", "card-now", "tag-tourist", "tag-official", "sign-scrubber", "sign-tours", "label-years-ago"];
// captions and bubbles may be wrapped on a phone: every word of each line must have been drawn, in order, across its lines
const drawn = [...shown].join(" \u0001 ");
const lineShown = (t) => [...shown].some((s) => s === t) || drawn.replace(/ \u0001 /g, " ").includes(wordsOf(t));
const missing = mustShow.filter((id) => !lineShown(L[id]));
g.check("every line of the story shows on screen word for word (tv-story-lines.js)", missing.length === 0, missing);
g.check("the captions are the old approved wording", L["cap-tour"] === "A Wookie tour group came to visit Stormtop." && L["cap-shed"] === "They shed. A LOT." && L["cap-clog"] === "The fur clogged the air scrubbers. Everyone gasped for air!" && L["official-no-fur"] === "We rely on the air scrubbers to keep us breathing. NO FUR." && L["tourist-gasp"] === "*gasp*", L);
g.check("every line is approved, with its source (the old story's, or Brian's own words of 2026-11-26), except the news title, a suggestion waiting for his yes", TV_STORY_LINES.every((l) => (l.id === "news-title" ? l.status === "needs-yes" && /Suggested/.test(l.source) : l.status === "approved" && (/71ec66e/.test(l.source) || /Brian 2026-11-26/.test(l.source)))));

const roars = final.roars;
g.check("Brian's Wookiee recording is asked for on the tour, the shed and the ship, and nowhere else", JSON.stringify(roars) === JSON.stringify(["tour", "shed", "banish"]), roars);

// Sizes
const pics = Object.fromEntries(seen.filter((s) => s.drew && s.id === "wookiee").map((s) => [s.drew.pic, s.drew]));
const adults = Object.values(pics).map((d) => d.adult);
g.check("a grown-up is the same height in every picture", adults.length === 5 && adults.every((a) => a === adults[0]), adults);
const ratio = pics.tour ? pics.tour.wookiee / pics.tour.adult : 0;
g.check("a Wookiee is 1.2 to 1.5 grown-ups tall, the same in the tour and on the ship", ratio >= 1.2 && ratio <= 1.5 && pics.banish && pics.banish.wookiee === pics.tour.wookiee, [ratio, pics.banish && pics.banish.wookiee]);
const doorShare = pics.banish ? pics.banish.wookiee / pics.banish.door.h : 0;
g.check("the TOURS ship's door is made for a Wookiee (he is 80 to 90% of its height)", doorShare >= 0.8 && doorShare <= 0.9, doorShare);
g.check("the official is a grown-up, smaller than a Wookiee, and fits the door", pics.banish && pics.banish.official < pics.banish.wookiee && pics.banish.official < pics.banish.door.h, pics.banish);
const shipSeen = seen.find((s) => s.drew && s.drew.pic === "banish");
g.check("the Wookiees start outside the ship and have all walked in by the end of their picture", shipSeen && shipSeen.drew.outside === 3 && shipSeen.end && shipSeen.end.outside === 0, shipSeen && [shipSeen.drew.outside, shipSeen.end && shipSeen.end.outside]);
g.check("the official's bubble sits inside the picture, its name tag clear of the YEARS AGO mark, and above his head", pics.banish && pics.banish.bubble && pics.banish.bubble.x0 >= 0 && pics.banish.bubble.x1 <= 960 && pics.banish.bubble.y0 >= 80 && pics.banish.bubble.y1 < pics.banish.head.y, pics.banish && [pics.banish.bubble, pics.banish.head]);

// The build
g.check("the stand-in's words are gone from the build", !OLD.includes("Fur in the scrubber.") && !OLD.includes("Onto the ship."));
const GAME = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
g.check("the old Wookiee story and its whoopee-cushion sounds are gone from the older program (Brian S 192)", !/function _i\(|function wf\(|"SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYxLjcuMTAzAAAAAAAAAAAAAAD\/83DAAAAAAAAAAAAASW5mbwAAAA8AAAAjAAAS|"Fur in the scrubber\."|"Nobody can live outside/.test(GAME));
g.check("the Wookiee recording is in sounds/ as wookiee-roar.mp3 and credited", existsSync(join(root, "sounds", "wookiee-roar.mp3")) && /wookiee-roar/.test(readFileSync(join(root, "sounds", "CREDITS.txt"), "utf8")));
g.check("no page errors", errors.length === 0, errors);
await page.close();
await g.finish("tv-story");
