/**
 * Beats 22 to 24, the home morning (src/modules/home-morning.js), at phone size, from the bedtime story's last
 * picture to the lunch out the door. In order, each checked as the player meets it:
 *   - wordless: the night goes on from the bedtime story (dark, Squatch asleep in his crate bed under the blanket,
 *     Mops asleep on his back beside it), the room comes up;
 *   - the station PA (Brian 2026-11-26, #41): the speaker's ding-dong and sound lines, its line (suggested words,
 *     waits for NEXT), then "Morning" from the speaker (notes rise from it; the music table's "day2am" row);
 *   - wordless: Mops wakes, rolls over and gets up, a heart as he looks at Squatch, and walks out of the door (heard);
 *     Squatch sits up, stretches, hops out over the crate's side and walks round its foot to the rocket (each part
 *     plays by itself, 2 to 4 seconds, nothing to tap; every walk round the furniture);
 *   - "Squatch: pick up the gift", only the rocket outlined, PICK UP · rocket; the note tied to it opens in a close-up
 *     with its approved words (waits for NEXT); he holds it up, one heart, and a thought bubble (bigger than the
 *     drawing in it, with a thought trail) shows his crayon drawing of the Guardians; then he says "The Guardians
 *     came! They always come when I'm scared." (waits for NEXT);
 *   - a thought bubble shows the Guardian Box before the chip names it; "Squatch: put the gift in the box", the
 *     wardrobe (taller on Day 2, Brian 2026-11-26) outlined, OPEN · closet; the door opens on the clothes up on the
 *     rail and the box on the closet floor below them, the box outlined, PUT IN · box;
 *   - the close-up (the first build's box view): the lid's MY GARDIAN BOX, the older notes, his crayon drawing MY
 *     GUARDIANS, the gift drops in with the folded note tied on, not read again (waits for NEXT); the box (2.4 times
 *     the approved size) goes back in the closet with the gift in it, the door shuts;
 *   - the lunch bag glows and is outlined; he walks over to it (Brian 2026-11-26, video note 0:30), and there he
 *     says "He forgot his lunch!";
 *   - the calendar is optional (Brian 2026-11-26): on the lunch goal, LOOK · calendar by the wardrobe opens today's
 *     close-up (days 1 to 13 crossed off, day 14 circled) and comes back to the lunch goal;
 *   - the lunch bag outlined; he walks to it; "He forgot his lunch!" waits for NEXT; "Squatch: take the lunch",
 *     TAKE · lunch; then the lunch sneak in the party hall (lunch-sneak.js), the bag in his paw.
 * Also: no new words (every word drawn is a whole line of home-morning-lines.js, or was on screen before), nothing he
 * is told to tap is under him, sizes against the room, nothing disappears, the old code is gone.
 *   node tests/home-morning.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const linesFile = join(root, "src", "modules", "home-morning-lines.js");
const { HOME_MORNING_LINES = [] } = existsSync(linesFile) ? await import(linesFile) : {};
const L = Object.fromEntries(HOME_MORNING_LINES.map((l) => [l.id, l.text]));
const GUARDIANS = "The Guardians came! They always come when I'm scared.";
const LUNCH = "He forgot his lunch!";

const g = await startGame({ port: 9743, name: "home-morning" });
const { page, errors } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);
// Sound on, as a player taps it (the music's cue is only followed while sound is on).
await new Promise((r) => setTimeout(r, 1200));
await page.click("#ss-sound");
await new Promise((r) => setTimeout(r, 600));
await page.evaluate(() => (window.requestAnimationFrame = () => 0));

const registered = await page.evaluate(() => !!(window.SSQ && window.SSQ.beat("ch1-home-morning")));
g.check("the home morning beat is registered (ch1-home-morning)", registered);

// The TV story and the bedtime story, tapped through fast, to the bedtime story's sleep.
const asleep = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  n.q = [];
  n.cur = null;
  window.SSQ.engine().tvStory();
  const bed = window.SSQ.beat("ch1-bedtime-story");
  for (let i = 0; i < 6000; i++) {
    if (bed.debug().phase === "fade") return true;
    ss.tick(0.05);
    const c = n.cur;
    c && ["card", "cutaway", "bub", "panel", "wait"].includes(c.k) && ((n.bt = 1), ss.opTap());
  }
  return false;
});
g.check("the bedtime story plays to Squatch asleep first", asleep);

const run = !(registered && asleep)
  ? null
  : await page.evaluate(
      ({ GUARDIANS, LUNCH, L_BAG }) => {
        const ss = window.__ss,
          n = ss.op,
          beat = window.SSQ.beat("ch1-home-morning"),
          out = { log: [], wordless: [], prompts: [], chips: [], outlines: [], under: [], fails: [], drawn: {} };
        const d = () => beat.debug();
        const step = () => (d().state || {}).step || "";
        const tick = (s) => {
          for (let i = 0; i < Math.round(s / 0.05); i++) ss.tick(0.05);
        };
        const next = () => ((n.bt = 1), ss.opTap());
        out.shownBefore = ss.shown();
        // the bedtime story's sleep, then Day 2 starts (no tap)
        for (let i = 0; i < 400 && !n.ch1Day2; i++) ss.tick(0.05);
        out.day2 = !!n.ch1Day2;
        // 1. the wordless parts: count how long each plays, and that nothing waits for a tap
        let phase = step(),
          since = 0,
          taps = 0;
        const sqAt = [];
        for (let i = 0; i < 400; i++) {
          if (step() !== phase) {
            out.wordless.push({ phase, secs: +since.toFixed(2) });
            phase = step();
            since = 0;
          }
          if (step() === "rocket" && n.ctrl) break;
          // the PA's line: the one thing to tap before he wakes (it waits for NEXT)
          if (n.cur && n.cur.k === "bub" && n.cur.b.who === "speaker") {
            if (!out.pa) {
              ss.drawFrame();
              out.pa = { who: n.cur.b.who, text: n.cur.b.text, step: step(), chip: ss.chipNow(), lines: !!(d().drew && d().drew.speakerLines), cue: window.SSQ.refinedCue(ss.warmWhy()), dings: (d().sounds || {}).dingDong || 0, mops: d().drew && d().drew.mops };
              tick(6);
              out.paHeld = !!(n.cur && n.cur.k === "bub" && n.cur.b.who === "speaker");
              ss.drawFrame();
              out.paLines6 = !!(d().drew && d().drew.speakerLines);
            }
            next();
            continue;
          }
          (n.cur && ["bub", "card", "cutaway"].includes(n.cur.k)) && taps++;
          n.ctrl && taps++;
          ss.drawFrame();
          const r = d().drew;
          r && r.mops && (out.mopsDrawn = out.mopsDrawn || []).push({ step: step(), turn: r.mops.turn, eyes: r.mops.eyes, x0: r.mops.x0 });
          r && r.mopsHeart && (out.mopsHeart = r.mopsHeart);
          r && r.speakerNotes && (out.notes = Math.max(out.notes || 0, r.speakerNotes));
          r && r.pose === "hopOut" && (out.hop = (out.hop || 0) + 1);
          step() === "mopsOut" && (out.mopsWalk = out.mopsWalk || []).push({ x: Math.round(n.mo.x), y: Math.round(n.mo.y), shown: n.moPose });
          r && r.dark != null && (out.dark = Math.max(out.dark || 0, r.dark));
          r && r.pose === "stretch" && (out.stretched = true);
          r && r.dark != null && r.dark > 0.5 && (out.darkMops = n.moPose);
          r && step() === "night" && (out.nightStart = out.nightStart || { dark: r.dark, mops: n.moPose, pose: r.pose, inBed: r.inBed, chip: ss.chipNow() });
          r && r.pose === "sitUp" && (out.satUp = out.satUp || []).push(r.inBed);
          (out.cues = out.cues || []).push({ step: step(), dark: r && r.dark != null ? r.dark : null, cue: window.SSQ.refinedCue(ss.warmWhy()) });
          sqAt.push([n.sq.x, n.sq.y]);
          ss.tick(0.05);
          since += 0.05;
        }
        out.tapsDuringWordless = taps;
        out.mopsAfter = n.moPose;
        // At a control step: what the chip and the button say, what is outlined (the goal outline the room drew).
        const atStep = (name) => {
          for (let i = 0; i < 6; i++) ss.tick(0.05);
          ss.drawFrame();
          const spots = (ss.spotsNow() || []).filter((s) => s && s.verb);
          const offer = ss.offerNow();
          const r = { name, step: step(), chip: ss.chipNow(), offer: offer ? offer.verb + " · " + offer.cap : "", spots: spots.length, outline: n.lastRing && n.T - n.lastRing.T < 0.3 ? { act: n.lastRing.act, box: n.lastRing.box } : null, sq: { x: n.sq.x, y: n.sq.y }, scale: window.SSQ.engine().squatchScale() };
          // The goal words on the phone's top bar (the HUD chip, a page element): "Outline; words if stuck" (Brian
          // 2026-11-22, DECISIONS.md): they wait while the outline shows, then come up after 20 s with no progress.
          const chipEl = () => {
            const el = [...document.querySelectorAll("div,span")].find((d) => d.children.length === 0 && d.textContent === r.chip);
            if (!el) return null;
            const b = el.getBoundingClientRect(),
              cs = getComputedStyle(el);
            return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), shown: cs.display !== "none" && cs.visibility !== "hidden" && b.width > 0, inside: b.x >= 0 && b.x + b.width <= innerWidth && b.y >= 0 };
          };
          r.wordsAtFirst = chipEl();
          for (let i = 0; i < 21 / 0.05; i++) ss.tick(0.05);
          ss.drawFrame();
          r.wordsIfStuck = chipEl();
          r.stillStep = step();
          out.prompts.push(r);
          return r;
        };
        // Walk him (as a kid would) to where a spot's action works.
        const walkTo = (x, y) => {
          n.walkTo = null;
          for (let i = 0; i < 400; i++) {
            const done = window.SSQ.engine().step("sq", x, y, 200, 0.05);
            ss.tick(0.05);
            if (done) break;
          }
          window.SSQ.engine().still("sq");
        };
        const press = () => {
          const o = ss.offerNow();
          o && o.f && o.f();
          return !!o;
        };
        // 2. the rocket
        const rocket = atStep("rocket");
        out.walkedTo = sqAt.slice(-1)[0];
        out.pads0 = d().sounds.pad || 0;
        press();
        tick(0.8);
        ss.drawFrame();
        out.noteUp = { cur: n.cur ? n.cur.k + ":" + n.cur.id : "", step: step(), drew: { ...window.SSQ.cutaway.last() } };
        tick(6);
        out.noteHeld = !!(n.cur && n.cur.k === "cutaway" && n.cur.id === "note");
        next();
        tick(0.3);
        ss.drawFrame();
        out.drawn.holdUp = d().drew && d().drew.heldUp;
        out.drawn.heart = d().drew && d().drew.heart;
        tick(1);
        ss.drawFrame();
        out.crayon = { drew: d().drew && d().drew.crayonThought, bub: !!(n.cur && n.cur.k === "bub") };
        tick(1.8);
        out.line1 = n.cur && n.cur.k === "bub" ? { who: n.cur.b.who, text: n.cur.b.text, chip: ss.chipNow() } : null;
        ss.drawFrame();
        out.crayonDuringLine = !!(d().drew && d().drew.crayonThought);
        tick(6);
        out.line1Held = !!(n.cur && n.cur.k === "bub" && n.cur.b.text === GUARDIANS);
        next();
        tick(0.6);
        ss.drawFrame();
        out.thought = { step: step(), drew: d().drew && d().drew.thought, chip: ss.chipNow(), ctrl: n.ctrl };
        tick(1.4);
        // 3. the closet: he carries the gift there
        const closetFar = atStep("closet-far");
        out.pads1 = d().sounds.pad || 0;
        walkTo(320, 420);
        ss.drawFrame();
        out.drawn.carried = d().drew && d().drew.carried;
        out.pads2 = d().sounds.pad || 0;
        const closet = atStep("closet");
        press();
        tick(2);
        const box = atStep("box");
        out.boxInCloset = d().box;
        out.closetOpen = d().closet;
        out.wardrobeOpen = n.wardrobe;
        press();
        tick(0.2);
        ss.drawFrame();
        out.boxMoving = d().box;
        tick(0.6);
        // the close-up: held over the box, then dropped in; it waits for NEXT
        const cu = [];
        for (let i = 0; i < 60; i++) {
          if (n.cur && n.cur.k === "cutaway") {
            ss.drawFrame();
            cu.push({ ...window.SSQ.cutaway.last() });
          }
          ss.tick(0.05);
        }
        tick(4);
        out.closeUp = { first: cu[0], last: cu[cu.length - 1], heldAfter: !!(n.cur && n.cur.k === "cutaway" && n.cur.id === "gbox"), thunks: d().sounds.hide || 0 };
        next();
        tick(0.25);
        ss.drawFrame();
        out.boxBack = d().box;
        tick(0.85);
        out.wardrobeShut = n.wardrobe;
        // 4. the lunch bag by the door glows: he walks over to it, and there he says his line (the calendar is not a step)
        ss.drawFrame();
        out.boxAfterShut = d().box;
        out.closetShut = d().closet;
        const toBag = atStep("toBag");
        ss.drawFrame();
        out.toBag = { outline: d().drew && d().drew.bagOutline, spots: (ss.spotsNow() || []).filter((x) => x && x.verb).length, line: !!(n.cur && n.cur.k === "bub") };
        walkTo(760, 505);
        tick(0.2);
        ss.drawFrame();
        out.line2 = n.cur && n.cur.k === "bub" ? { who: n.cur.b.who, text: n.cur.b.text, chip: ss.chipNow(), bagOutline: d().drew && d().drew.bagOutline, at: { x: Math.round(n.sq.x), y: Math.round(n.sq.y) } } : null;
        tick(6);
        out.line2Held = !!(n.cur && n.cur.k === "bub" && n.cur.b.text === LUNCH);
        next();
        tick(0.3);
        // 5. the lunch goal (at the bag); by the wardrobe the calendar can still be looked at (optional)
        const lunchAtBag = atStep("lunch-at-bag");
        walkTo(320, 420);
        const lunchFar = atStep("lunch-far");
        out.offers = (ss.spotsNow() || []).filter((x) => x && x.verb).map((x) => x.verb + " · " + x.cap);
        // the words painted on the lunch bag's picture (part of its drawing, not the game's text log): what the room's
        // canvas writes in one frame with the bag on the floor
        out.bagWords = (() => {
          const c = document.querySelector("canvas").getContext("2d"),
            said = [],
            fill = c.fillText;
          c.fillText = function (t, ...rest) {
            said.push(t);
            return fill.call(this, t, ...rest);
          };
          try {
            ss.drawFrame();
          } finally {
            delete c.fillText;
          }
          return said.filter((t) => t === L_BAG);
        })();
        const cal = lunchFar;
        press();
        tick(0.5);
        out.calendarOpen = !!n.ch1Calendar;
        ss.drawFrame();
        out.calendar = d().drew && d().drew.calendar;
        ss.tapAt(880, 540);
        tick(0.4);
        out.afterCalendar = { step: step(), ctrl: n.ctrl, chip: ss.chipNow(), cur: n.cur ? n.cur.k : "" };
        n.ctrl && (window.SSQ.engine().place("sq", 300, 398), tick(0.2));
        out.offersAfterCal = (ss.spotsNow() || []).filter((x) => x && x.verb).map((x) => x.verb + " · " + x.cap);
        ss.tapAt(133, 237);
        tick(0.4);
        out.tapCalendar = !!n.ch1Calendar;
        ss.tapAt(880, 540);
        tick(0.4);
        ss.drawFrame();
        out.boxInClosetAfter = window.SSQ.beat("ch1-home-morning").boxInCloset();
        walkTo(760, 505);
        const lunch = atStep("lunch");
        out.shownMorning = ss.shown();
        out.lunchCue = window.SSQ.refinedCue(ss.warmWhy());
        press();
        out.music = window.SSQ.homeMusic.debug();
        for (let i = 0; i < 200 && !(n.room === "hall" && n.ctrl); i++) ss.tick(0.05);
        ss.drawFrame();
        const lu = window.SSQ.beat("ch1-lunch") && window.SSQ.beat("ch1-lunch").debug().state;
        out.hall = { room: n.room, step: n.ch1Step, bag: lu ? lu.bag : "", chip: ss.chipNow() };
        out.debug = d();
        out.steps = d().steps;
        out.list = { rocket, closetFar, closet, box, toBag, cal, lunchFar, lunchAtBag, lunch };
        out.closetBox = closet && box;
        out.musicCues = { pa: out.pa && out.pa.cue };

        // 6. the step restart (↺) at the closet step puts him back there, on that step
        return out;
      },
      { GUARDIANS, LUNCH, L_BAG: L["sign-bag"] },
    );

const R = run || { prompts: [], wordless: [], list: {}, steps: [], debug: { sounds: {}, sizes: {}, things: {} }, drawn: {} };
const P = R.list;
g.check("Day 2 starts from the bedtime story's sleep", !!R.day2, R.day2);

// The Ganitor lines (the tag, the wall, the crayon): their words may show. Its PA line (pa-ganitor) is said inside the
// morning PA, checked below, and is marked merged (Brian 2026-11-26, #41).
const GAN = existsSync(join(root, "src", "modules", "ganitor.js")) ? await import(join(root, "src", "modules", "ganitor.js")) : { GANITOR_LINES: [] };
g.check("the Ganitor PA line is kept as the record, marked merged into the morning PA, and its words are inside it", (GAN.GANITOR_LINES.find((l) => l.id === "pa-ganitor") || {}).merged === "pa-morning");

// 1. the wordless start
const night = R.wordless.find((w) => w.phase === "night"),
  wake = R.wordless.find((w) => w.phase === "wake");
const mopsUpPart = R.wordless.find((w) => w.phase === "mopsUp"),
  mopsOutPart = R.wordless.find((w) => w.phase === "mopsOut");
g.check("night to morning plays by itself: the room goes dark and comes back (2 to 4 s)", night && night.secs >= 2 && night.secs <= 4 && R.dark > 0.9, { night, dark: R.dark });
g.check("Mops gets up and walks out by himself (each 2 to 4 s)", mopsUpPart && mopsUpPart.secs >= 2 && mopsUpPart.secs <= 4 && mopsOutPart && mopsOutPart.secs >= 2 && mopsOutPart.secs <= 4, { mopsUpPart, mopsOutPart });
g.check("he wakes, stretches, hops out over the crate's side and walks to the rocket by himself (2 to 4 s)", wake && wake.secs >= 2 && wake.secs <= 4 && R.stretched && R.hop > 2, { wake, stretched: R.stretched, hop: R.hop });
g.check("the wordless parts have nothing to tap and no line (no control, no bubble but the PA's)", R.tapsDuringWordless === 0, R.tapsDuringWordless);
// One night: the morning starts where the bedtime story ended (dark, Squatch asleep in the crate under the blanket,
// Mops asleep on his back beside it, drawn by the morning, Brian 2026-11-26 #33).
const NS = R.nightStart || {};
const MD = R.mopsDrawn || [];
g.check("the morning starts where the night ended: the room dark, Squatch asleep lying in his crate bed under the blanket (its front wall over him), no chip", NS.dark === 1 && NS.pose === "asleep" && NS.inBed && NS.inBed.eyes === "closed" && Math.abs(NS.inBed.a + Math.PI / 2) < 0.02 && NS.inBed.blanket === 1 && NS.chip === "", NS);
g.check("Mops sleeps on his back beside the bed (feet in the air, eyes closed) through the night and the PA, drawn by the morning (the room leaves him out), clear of the bed", MD.length > 5 && MD.filter((m) => m.step === "night" || m.step === "pa").every((m) => m.turn === 1 && m.eyes === "closed" && m.x0 >= 286) && NS.mops === "hidden", MD.slice(0, 2));
g.check("the PA wakes him: he opens his eyes and gets up (on his back, onto his side, on his feet), a heart as he looks at Squatch, then walks out (heard: hooves, the door)", MD.some((m) => m.step === "mopsUp" && m.turn > 0.4 && m.turn < 0.6) && MD.filter((m) => m.step === "mopsUp").slice(-1)[0].turn < 0.05 && MD.filter((m) => m.step === "mopsUp").slice(-1)[0].eyes === "" && !!R.mopsHeart && R.mopsAfter === "hidden" && (R.mopsWalk || []).length > 10 && (R.mopsWalk || []).slice(-1)[0].x > 880, { heart: R.mopsHeart, walk: (R.mopsWalk || []).slice(-2), after: R.mopsAfter });
const PA = R.pa || {};
g.check('the PA: after the room comes up, the wall speaker rings and says (suggested words, Brian #41) "Good morning, Stormtop! Ganitor Mops to the party hall. The new robot janitors arrive today!", sound lines round the speaker, no chip, Mops still asleep', PA.who === "speaker" && PA.text === L["pa-morning"] && L["pa-morning"] === "Good morning, Stormtop! Ganitor Mops to the party hall. The new robot janitors arrive today!" && PA.step === "pa" && PA.chip === "" && PA.lines && PA.dings === 1 && PA.mops && PA.mops.turn === 1, PA);
g.check("the PA's line waits for NEXT (still up after 6 seconds, the sound lines still on)", R.paHeld && R.paLines6);
g.check("the PA keeps Brian's approved \"Ganitor Mops to the party hall.\" inside it and is marked suggested in the lines file", /Ganitor Mops to the party hall\./.test(L["pa-morning"]) && HOME_MORNING_LINES.find((l) => l.id === "pa-morning").status === "suggested");
g.check("then music from the speaker: notes rise from it", R.notes >= 1, R.notes);
const SU = R.satUp || [];
g.check("he wakes in bed: he sits up from lying down, eyes open, the blanket sliding off", SU.length > 2 && SU[0].a < -1 && SU.slice(-1)[0].a > -0.1 && SU.slice(-1)[0].blanket < 0.1 && SU.every((u) => u.eyes === ""), [SU[0], SU.slice(-1)[0]]);
const S = R.debug.sounds || {};
g.check("Mops is heard leaving: his hooves as he walks, then the door", S.hoof >= 3 && S.door === 1, S);
// The music table (Brian 2026-11-26, music-picks.js): Goating in Space only on Day 1's first morning; this later
// daytime visit home plays the home rotation; while the night is still dark the bedtime music goes on.
const CUES = R.cues || [];
const darkCues = CUES.filter((c) => c.step === "night" && c.dark === 1),
  upCues = CUES.filter((c) => c.step === "night" && c.dark != null && c.dark < 0.9),
  dayCues = CUES.filter((c) => ["mopsUp", "mopsOut", "wake", "rocket"].includes(c.step));
const PICKS = await import(join(root, "src", "modules", "music-picks.js"));
g.check('the music follows the music table: the bedtime music goes on while the night is dark, quiet as the room comes up and through the PA, then the speaker plays Kevin MacLeod\'s "Morning" (the "day2am" row) until he takes the lunch; Goating in Space does not play (Day 1\'s first morning\'s) and the home rotation is untouched', darkCues.length > 3 && darkCues.every((c) => c.cue === "bedtime") && upCues.length > 3 && upCues.every((c) => c.cue === "") && PA.cue === "" && dayCues.length > 3 && dayCues.every((c) => c.cue === "day2am") && R.lunchCue === "day2am" && PICKS.fileFor("day2am") === "music/morning.mp3" && R.music && !R.music.owns && JSON.stringify(PICKS.listFor("home")) === JSON.stringify(["carefreeOnce", "morningOnce", "rainbowsOnce"]) && PICKS.fileFor("morning") === "music/goating-in-space.mp3", { dark: darkCues.slice(0, 2), up: upCues.slice(0, 2), pa: PA.cue, day: dayCues.slice(0, 2), lunch: R.lunchCue, owns: R.music && R.music.owns });

// 2. each control step: the chip, the one button, the one outline round its thing
const want = [
  ["rocket", L["chip-gift"], L["button-rocket"]],
  ["closet", L["chip-box"], L["button-closet"]],
  ["box", L["chip-box"], L["button-box"]],
  ["lunch", L["chip-lunch"], L["button-lunch"]],
];
for (const [k, chip, act] of want) {
  const p = P[k] || {};
  g.check(`${k}: the chip says "${chip}" and the button says "${act}"`, p.chip === chip && p.offer === act && p.spots === 1, p);
  g.check(`${k}: only the thing to use is outlined (the dashed outline is round "${act}")`, !!p.outline && p.outline.act === act, p.outline);
}
{
  const p = P.toBag || {};
  g.check('on the way to the bag: the chip says "' + L["chip-bag"] + '", no button, the bag outlined (and glowing)', p.chip === L["chip-bag"] && p.spots === 0 && R.toBag && R.toBag.spots === 0 && !!R.toBag.outline && !R.toBag.line, { p, toBag: R.toBag });
  g.check("toBag: on the phone the goal words wait while the outline shows, then come up after 20 s (words if stuck)", !(p.wordsAtFirst && p.wordsAtFirst.shown) && p.wordsIfStuck && p.wordsIfStuck.shown && p.stillStep === "toBag", { first: p.wordsAtFirst, stuck: p.wordsIfStuck });
}
for (const [k] of want) {
  const p = P[k] || {};
  // (at the wardrobe he has already waited 20 s across the room, and at the lunch step at the bag: the first look is
  // from there)
  const first = ((k === "lunch" ? P.lunchAtBag : P[k + "Far"]) || p).wordsAtFirst;
  g.check(`${k}: on the phone the goal words wait while the outline shows, then come up in the top bar after 20 s (words if stuck)`, !(first && first.shown) && p.wordsIfStuck && p.wordsIfStuck.shown && p.wordsIfStuck.inside && p.stillStep === k, { first, stuck: p.wordsIfStuck });
}
g.check("the words are today's: the chips and buttons the game had (no calendar chip: it is optional), PICK UP · rocket and PUT IN · box and OPEN · closet (approved)", L["chip-gift"] === "Squatch: pick up the gift" && L["chip-box"] === "Squatch: put the gift in the box" && !("chip-cal" in L) && L["chip-lunch"] === "Squatch: take the lunch" && L["button-rocket"] === "PICK UP · rocket" && L["button-box"] === "PUT IN · box" && L["button-closet"] === "OPEN · closet" && L["button-cal"] === "LOOK · calendar" && L["button-lunch"] === "TAKE · lunch");
g.check("the goal stays up while he walks: the wardrobe is outlined from across the room, the bag from the wardrobe", P.closetFar && P.closetFar.chip === L["chip-box"] && P.closetFar.outline && P.closetFar.outline.act === L["button-closet"] && P.lunchFar && P.lunchFar.chip === L["chip-lunch"] && P.lunchFar.outline && P.lunchFar.outline.act === L["button-lunch"], { closetFar: P.closetFar, lunchFar: P.lunchFar });
g.check("when he has seen the bag, TAKE · lunch works where he stands", P.lunchAtBag && P.lunchAtBag.offer === L["button-lunch"], P.lunchAtBag);
g.check("he gets up right beside the rocket: PICK UP works where he stands", P.rocket && P.rocket.offer === L["button-rocket"]);

// the note (Brian 2026-11-26, video note 0:24)
const NU = R.noteUp || {};
g.check('PICK UP: the note tied to the rocket opens in a close-up with its approved words, "Brave Sasquatches stay hidden. — The Guardians", before he holds the gift up', NU.cur === "cutaway:note" && NU.step === "note" && NU.drew && NU.drew.id === "note" && NU.drew.open === 1 && JSON.stringify(NU.drew.words) === JSON.stringify(["Brave Sasquatches", "stay hidden.", "— The Guardians"]) && L["note-words"] === "Brave Sasquatches stay hidden. — The Guardians", NU);
g.check("the note close-up waits for NEXT (still up after 6 seconds)", R.noteHeld);
// the rocket and the line
g.check("PICK UP: he holds the rocket up (drawn in his raised paw), with one heart over him", R.drawn.holdUp && R.drawn.holdUp.rocket.y0 < R.drawn.holdUp.head + 20 && !!R.drawn.heart, { hold: R.drawn.holdUp, heart: R.drawn.heart });
const CT = R.crayon && R.crayon.drew;
g.check("as he holds it up, a thought bubble over him shows his crayon drawing of the Guardians (two big furry Sasquatches), before any words", CT && CT.drawing && CT.drawing.figures.guardians === 2 && CT.box.y1 < CT.head.y && !R.crayon.bub, R.crayon);
g.check("on a phone the drawing in the thought bubble is at least 50 px wide", CT && (CT.drawing.x1 - CT.drawing.x0) * (375 / 960) >= 50, CT && CT.drawing);
// Brian 2026-11-26, video note 0:11: "The thought bubble is smaller than the drawing."
const inOval = (o, x, y) => ((x - o.cx) / o.rx) ** 2 + ((y - o.cy) / o.ry) ** 2 <= 1;
const fits = (t, m) => t && t.oval && t.content && [[t.content.x0 - m, t.content.y0 - m], [t.content.x1 + m, t.content.y0 - m], [t.content.x0 - m, t.content.y1 + m], [t.content.x1 + m, t.content.y1 + m]].every(([x, y]) => inOval(t.oval, x, y));
const trailOk = (t) => t && t.trail && t.trail.length === 3 && t.trail[0].r > t.trail[1].r && t.trail[1].r > t.trail[2].r && Math.hypot(t.trail[2].x - t.head.x, t.trail[2].y - t.head.y) < 30 && t.trail.every((c, i) => i === 0 || c.y > t.trail[i - 1].y);
g.check("the crayon thought bubble is clearly bigger than the drawing in it: every corner of the drawing, with 14 px of margin, is inside the cloud's inner edge", fits(CT, 14) && CT.drawing.x1 - CT.drawing.x0 <= CT.content.x1 - CT.content.x0 + 1, CT && { content: CT.content, oval: CT.oval, drawing: CT.drawing });
g.check("it has a classic thought trail: three circles, each smaller, going down to his head", trailOk(CT), CT && CT.trail);
g.check("the thought bubble is gone when he says his line (one bubble at a time)", R.crayonDuringLine === false);
g.check("then his line, word for word, in one bubble over him, with no chip", R.line1 && R.line1.who === "sq" && R.line1.text === GUARDIANS && R.line1.chip === "", R.line1);
g.check("the line waits for NEXT (still up after 6 seconds)", R.line1Held);
g.check("before the chip names the box, a thought bubble over him shows it (no words, no control)", R.thought && R.thought.step === "think" && R.thought.drew && R.thought.drew.box && R.thought.drew.box.y1 < R.thought.drew.head.y && R.thought.chip === "" && !R.thought.ctrl, R.thought);
g.check("the box's thought bubble is bigger than the box in it (with margin) and has the thought trail", R.thought && fits(R.thought.drew, 14) && trailOk(R.thought.drew), R.thought && R.thought.drew);
g.check("he carries the gift in his paw on the way to the wardrobe (it never vanishes)", !!R.drawn.carried, R.drawn.carried);
g.check("his footsteps sound only while he walks (footfalls.js)", R.pads2 > R.pads1 && R.pads1 === R.pads0, { before: R.pads0, standing: R.pads1, walked: R.pads2 });

// the closet and the box
g.check("OPEN · closet opens the door (squeaky hinge) and the Guardian Box shows on the closet floor", R.wardrobeOpen === "open" && R.boxInCloset && R.boxInCloset.where === "closet" && S.closetOpen === 1, { wardrobe: R.wardrobeOpen, box: R.boxInCloset, hinge: S.closetOpen });
g.check("PUT IN · box: he takes the box out of the closet onto the floor", R.boxMoving && R.boxMoving.where === "moving", R.boxMoving);
{
  // Brian 2026-11-26, video note 0:20: "We should make the closet taller... the clothes should be over the box."
  const TC = await import(join(root, "src", "modules", "tall-closet.js"));
  const clothesBottom = (TC.TALL_CLOSET.clothesEnd - TC.TALL_CLOSET.growPic) * (640 / 830),
    bx = (R.debug.things || {}).boxIn;
  g.check("on Day 2 the closet is drawn taller (a layer over the locked picture, about 85 px up), open and shut; open, the clothes hang on the rail above and the Guardian Box sits on the closet floor below them", R.closetOpen && R.closetOpen.open && Math.round(R.closetOpen.y0) < 120 && R.closetShut && !R.closetShut.open && Math.abs(TC.TALL_GROW - 84.8) < 0.5 && bx && bx.y0 > clothesBottom + 20 && bx.y1 <= R.closetOpen.y1, { open: R.closetOpen, shut: R.closetShut, clothesBottom, box: bx });
  const lockedFiles = readFileSync(join(root, "src", "modules", "tall-closet.js"), "utf8");
  g.check("the taller closet never changes the locked picture files: it copies pieces of them onto the game's canvas", /docs\/locked-rooms\/home-room-empty-open-v6\.png/.test(lockedFiles) && !/toDataURL|writeFile/.test(lockedFiles));
}
const cu = R.closeUp || {};
g.check('the close-up is the first build\'s box view: the open box with its lid labelled "MY GARDIAN BOX", the older notes in it, his crayon drawing titled "MY GUARDIANS" (two big Sasquatches), the gift held over it first', cu.first && cu.first.id === "gbox" && cu.first.label === "MY GARDIAN BOX" && cu.first.title === "MY GUARDIANS" && cu.first.notes >= 2 && cu.first.drawing && cu.first.drawing.figures.guardians === 2 && cu.first.held && !cu.first.landed, cu.first);
g.check("then the gift drops into the box and stays (a thunk), and the close-up waits for NEXT", cu.last && cu.last.landed && cu.heldAfter && cu.thunks === 1, { last: cu.last, held: cu.heldAfter, thunks: cu.thunks });
g.check("the gift goes in with the folded note still tied on, not read again (he read it when he picked it up); the note's words were shown once, approved, no Rule #1", cu.last && cu.last.note === null && cu.last.noteTied && cu.first.noteTied && (R.shownMorning || []).some((w) => w === "Brave Sasquatches") && (R.shownMorning || []).some((w) => w === "— The Guardians") && !(R.shownMorning || []).some((w) => /Rule/.test(w)), { note: cu.last && cu.last.note });
g.check("back in the room the box, the gift in it, goes back in the closet (Brian 2026-11-26), and stays there after", R.boxBack && R.boxBack.where === "moving" && R.boxBack.gift && R.boxAfterShut === null && R.boxInClosetAfter === true, { back: R.boxBack, shut: R.boxAfterShut, inCloset: R.boxInClosetAfter });
g.check("he shuts the closet (bump): the calendar on its door is back", R.wardrobeShut === "closed" && S.closetShut === 1, { wardrobe: R.wardrobeShut, bump: S.closetShut });

// the calendar
g.check("LOOK · calendar opens the calendar close-up", R.calendarOpen);
g.check("today's close-up: days 1 to 13 crossed off, the circled snack delivery day (14) is today", R.calendar && R.calendar.today === 14 && R.calendar.crossed.length === 13 && R.calendar.crossed[12] === 13, R.calendar);

// the lunch
g.check("as he gets to the bag (not before), the bag is outlined while he says his line, word for word, over him, no chip", R.line2 && R.line2.who === "sq" && R.line2.text === LUNCH && R.line2.chip === "" && !!R.line2.bagOutline && R.line2.at.x > 640 && R.toBag && !R.toBag.line, R.line2);
g.check("the lunch line waits for NEXT", R.line2Held);
g.check("TAKE · lunch hands over to the lunch sneak (lunch-sneak.js): the party hall, the bag in his paw", R.hall && R.hall.room === "hall" && R.hall.step === "lu-plant" && R.hall.bag === "paw" && R.hall.chip === "Squatch: take Mops his lunch in the hallway", R.hall);
g.check("the lunch bag has MOPS written on it (Brian 2026-11-26)", (R.bagWords || []).length >= 1 && L["sign-bag"] === "MOPS", R.bagWords);
g.check("the calendar is not a step (Brian 2026-11-26): on the lunch goal TAKE · lunch comes first (the one outlined) and LOOK · calendar is there too", JSON.stringify(R.offers) === JSON.stringify([L["button-lunch"], L["button-cal"]]) && P.lunchFar && P.lunchFar.chip === L["chip-lunch"], R.offers);
g.check("once he has looked, the button offers only the lunch (a kid pressing it is not sent back to the calendar), and a tap on the calendar still opens it", JSON.stringify(R.offersAfterCal) === JSON.stringify([L["button-lunch"]]) && R.tapCalendar, { offers: R.offersAfterCal, tap: R.tapCalendar });
g.check("closing the calendar goes back to the lunch goal, with control", R.afterCalendar && R.afterCalendar.step === "lunch" && R.afterCalendar.ctrl && R.afterCalendar.chip === L["chip-lunch"] && !R.afterCalendar.cur, R.afterCalendar);
g.check("the steps came in order", JSON.stringify(R.steps) === JSON.stringify(["night", "pa", "mopsUp", "mopsOut", "wake", "rocket", "note", "hold", "think", "closet", "toCloset", "box", "lift", "closeup", "putBack", "shut", "toBag", "notice", "lunch", "calendar", "lunch", "calendar", "lunch", "done"]), R.steps);

// Nobody walks through furniture (docs/REVIEW-RULES.md, Brian 2026-11-26, video note 0:18): every position the morning's
// scripted walks took in the game (Mops out, Squatch getting up, Squatch to the wardrobe), feet as standing-spots counts
// them, clear of the crate bed, the bucket and the Guardian box (tests/scripted-walks.mjs checks the walk lists).
{
  const FURN = JSON.parse(readFileSync(join(root, "tests", "data", "home-furniture.json"), "utf8")),
    F = FURN.foot.home,
    W = R.debug.walks || [],
    bad = [];
  for (const w of W) for (const [k, b] of Object.entries(FURN.home)) w.x + F.side > b.x0 && w.x - F.side < b.x1 && w.y + F.down > b.y0 && w.y - F.up < b.y1 && bad.length < 6 && bad.push({ ...w, thing: k });
  const kinds = new Set(W.map((w) => w.walk));
  g.check(`in the game every scripted walk went round the furniture (${W.length} steps: ${[...kinds].join(", ")})`, bad.length === 0 && ["mopsOut", "getUp", "toCloset"].every((k) => kinds.has(k)), bad);
}
// Nothing he is told to tap is under him (Fable's review): at OPEN, PUT IN and LOOK he stands right of the wardrobe.
const SQ = (p) => ({ x0: p.sq.x - 18 * p.scale, x1: p.sq.x + 18 * p.scale, y0: p.sq.y - 50 * p.scale, y1: p.sq.y });
const hit = (a, b) => a && b && a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const things = R.debug.things || {};
const CAL = { x0: 99, x1: 167, y0: 196, y1: 279 };
const Zs = R.debug.sizes || {};
const rb = things.rocket ? { x0: things.rocket.x - Zs.rocketW / 2, x1: things.rocket.x + Zs.rocketW / 2, y0: things.rocket.y - Zs.rocket, y1: things.rocket.y } : null;
const bagB = things.bag && Zs.bag ? { x0: things.bag.x - Zs.bag.w / 2, x1: things.bag.x + Zs.bag.w / 2, y0: things.bag.y - Zs.bag.h, y1: things.bag.y } : null;
g.check("nothing he is told to use is under him: the rocket, the box in the closet, the calendar, the bag", P.rocket && P.box && P.cal && P.lunch && !hit(SQ(P.rocket), rb) && !hit(SQ(P.box), things.boxIn) && !hit(SQ(P.cal), CAL) && !hit(SQ(P.lunch), bagB), { rocket: P.rocket && SQ(P.rocket), box: P.box && SQ(P.box), cal: P.cal && SQ(P.cal), lunch: P.lunch && SQ(P.lunch) });
const gap = (a, b) => Math.max(b.x0 - a.x1, a.x0 - b.x1);
g.check("open floor between him and the rocket when he wakes (at least 20 px)", P.rocket && rb && gap(SQ(P.rocket), rb) >= 20, P.rocket && rb && gap(SQ(P.rocket), rb));

// Sizes against the home room (Squatch at the room's scale 3, about 145 px; the approved box at its exact size)
const Z = R.debug.sizes || {};
g.check("Squatch is drawn at the room's own size (scale 3)", P.rocket && P.rocket.scale === 3, P.rocket && P.rocket.scale);
g.check("the rocket is a big toy he can hold up: about half of Squatch's height (0.4 to 0.55), smaller than the bed and the bucket", Z.rocket / Z.squatch >= 0.4 && Z.rocket / Z.squatch <= 0.55 && Z.rocket < 150 && Z.rocket < 71, Z);
g.check("the lunch bag is a big paper lunch bag (Brian 2026-11-26: MOPS on it must read): about half of Squatch's height (0.4 to 0.5), smaller than the bucket", Z.bag && Z.bag.h / Z.squatch >= 0.4 && Z.bag.h / Z.squatch <= 0.5 && Z.bag.h < 71, Z);
// On a 375-wide phone the picture is 375 / 960 of its size: the rocket and the bag must still be big enough to see.
const PHONE_K = 375 / 960;
g.check("on a 375-wide phone the rocket is at least 25 px tall and the bag at least 17 px", Z.rocket * PHONE_K >= 25 && Z.bag.h * PHONE_K >= 17, { rocket: Z.rocket * PHONE_K, bag: Z.bag && Z.bag.h * PHONE_K });
g.check("the Guardian Box is the approved box made 2.4 times bigger on Day 2 (52 x 36 on the 1280 x 830 picture, times 2.3)", Z.box && Math.abs(Z.box.w - 39 * 2.4) < 0.01 && Math.abs(Z.box.h - ((36 * 640) / 830) * 2.4) < 0.01, Z.box);
g.check("the box reads clearly bigger than the rocket: wider than the rocket is tall, more than twice its fins' width, and as tall (a box it fits in)", Z.box && Z.box.w > Z.rocket && Z.box.w >= 2 * Z.rocketW && Z.box.h >= Z.rocket, Z);
const cs = cu.last && cu.last.sizes;
g.check("in the close-up the rocket and the box keep the room's proportion (the box clearly bigger)", cs && Math.abs(cs.rocket / cs.box.w - Z.rocket / Z.box.w) < 0.01 && cs.box.w > cs.rocket, { closeUp: cs, room: Z });

// No new words
const known = new Set([...HOME_MORNING_LINES, ...GAN.GANITOR_LINES].map((l) => l.text));
// (the speech bubble's name tag, the calendar's close button, and the room's sleep mark were in the game before)
const before = new Set([...(R.shownBefore || []), "Squatch", "Speaker", "X", "z z z", "\u266a", "\u266b"]);
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// (a line drawn in pieces counts when each piece is a run of two or more whole words of one line; the lid label is
// drawn on two lines, MY GARDIAN / BOX)
const lid = L["sign-box"].split(" "),
  lidHalves = new Set([lid.slice(0, 2).join(" "), lid.slice(2).join(" ")]);
const piece = (w) => lidHalves.has(w.trim()) || (w.trim().split(/\s+/).length >= 2 && [...known].some((k) => new RegExp("(^|\\s)" + esc(w.trim()) + "(\\s|$)").test(k)));
const stray = (R.shownMorning || []).filter((w) => !before.has(w) && !known.has(w) && !piece(w));
g.check("no new words: every word drawn this morning is a whole line of home-morning-lines.js (or was on screen before)", R.shownMorning && stray.length === 0, stray);
g.check('the note\'s old "Rule #1" words are not shown', R.shownMorning && !(R.shownMorning || []).some((w) => /Rule #1/.test(w)));
g.check("the lines file names a status and a source for every line", HOME_MORNING_LINES.length >= 12 && HOME_MORNING_LINES.every((l) => l.id && l.who && l.text && l.status && l.source));

// The old code is gone
const GAME = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
const DAY2 = readFileSync(join(root, "src", "game", "14-ch1-day2.js"), "utf8");
g.check("the old gift, box, calendar and lunch steps are gone from src/game (and the old note's words from Day 2)", !/ch1TakeGift|ch1PutBox|ch1DropBox|ch1LookCal|"dropbox"|pick up the gift|circle delivery day/.test(GAME) && !/Rule #1|Brave Sasquatches/.test(DAY2));

// The step restart (↺) at the wardrobe step puts him back where that step began, on it
const restart = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(22);
  for (let i = 0; i < 10; i++) ss.tick(1 / 30);
  const before = { step: n.ch1Step, x: Math.round(n.sq.x), y: Math.round(n.sq.y) };
  n.sq.x += 200;
  ss.sectionReset();
  for (let i = 0; i < 10; i++) ss.tick(1 / 30);
  return { before, after: { step: n.ch1Step, x: Math.round(n.sq.x), y: Math.round(n.sq.y), ctrl: n.ctrl, chip: ss.chipNow() } };
});
g.check("↺ on the rocket step puts him back beside the rocket, same step, same goal", restart.before.step === "hm-rocket" && restart.after.step === "hm-rocket" && restart.after.x === restart.before.x && restart.after.ctrl && restart.after.chip === "Squatch: pick up the gift", restart);
// ↺ in the parts with no control (code review 2026-11-26: they used to leave him with control and no goal): back to
// the last step he had, with what was true then; in the night or the wake, the morning starts again from asleep.
const mid = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    hm = window.SSQ.beat("ch1-home-morning"),
    tick = (s) => {
      for (let i = 0; i < Math.round(s / 0.05); i++) ss.tick(0.05);
    },
    press = () => {
      const o = ss.offerNow();
      o && o.f();
    },
    next = () => ((n.bt = 1), ss.opTap()),
    after = () => {
      tick(0.3);
      const o = ss.offerNow();
      return { step: (hm.debug().state || {}).step, ctrl: n.ctrl, cur: n.cur ? n.cur.k : "", offer: o ? o.verb + " · " + o.cap : "", gift: (hm.debug().state || {}).gift, door: n.wardrobe };
    },
    open = (beat, step) => {
      n.q = [];
      n.cur = null;
      ss.ch1JumpBeat(beat);
      step && hm.jump(step);
      tick(0.5);
    },
    out = {};
  open(22);
  hm.start();
  tick(0.8);
  ss.sectionReset();
  out.night = after();
  // (the night 3.4 s, the room coming up on the night look since 2026-11-26, then the ding-dong's wait)
  tick(4.3);
  out.atPa = { step: (hm.debug().state || {}).step, bub: !!(n.cur && n.cur.k === "bub") };
  next();
  tick(12);
  out.nightThen = after();
  open(22);
  hm.start();
  tick(5);
  ss.sectionReset();
  out.paReset = after();
  open(22);
  press();
  tick(1.2);
  out.inNote = n.cur && n.cur.k === "cutaway" && n.cur.id === "note";
  ss.sectionReset();
  out.note = after();
  open(22);
  press();
  tick(0.6);
  next();
  tick(1.2);
  ss.sectionReset();
  out.hold = after();
  open(22);
  press();
  tick(0.6);
  next();
  tick(3.2);
  next();
  tick(0.6);
  ss.sectionReset();
  out.think = after();
  open(22, "box");
  press();
  tick(1.0);
  out.inCloseUp = n.cur && n.cur.k === "cutaway";
  ss.sectionReset();
  out.closeup = after();
  open(23);
  press();
  tick(0.4);
  out.inCalendar = !!n.ch1Calendar;
  ss.sectionReset();
  out.calendar = after();
  return out;
});
g.check("↺ in the night starts the morning again from asleep, and it plays on to the PA and then the rocket", mid.night.step === "night" && !mid.night.ctrl && mid.atPa.step === "pa" && mid.atPa.bub && mid.nightThen.step === "rocket" && mid.nightThen.offer === L["button-rocket"], { night: mid.night, pa: mid.atPa, then: mid.nightThen });
g.check("↺ during the PA or Mops leaving starts the morning again from asleep (no control)", mid.paReset.step === "night" && !mid.paReset.ctrl, mid.paReset);
g.check("↺ during the note close-up, his Guardians line or the thought bubble: back on the rocket step, the rocket on the floor", mid.inNote && ["note", "hold", "think"].every((k) => mid[k].step === "rocket" && mid[k].ctrl && mid[k].offer === L["button-rocket"] && mid[k].gift === "floor"), { note: mid.note, hold: mid.hold, think: mid.think });
g.check("↺ in the box close-up: back on the box step, door open, the gift in his paw", mid.inCloseUp && mid.closeup.step === "box" && mid.closeup.ctrl && mid.closeup.offer === L["button-box"] && mid.closeup.door === "open" && mid.closeup.gift === "held", mid.closeup);
g.check("↺ in the calendar close-up: back on the lunch step by the wardrobe, LOOK · calendar offered there", mid.inCalendar && mid.calendar.step === "lunch" && mid.calendar.ctrl && mid.calendar.offer === L["button-cal"] && !mid.calendar.cur, mid.calendar);
// He sees the bag from whichever side he comes, and TAKE · lunch then works where he stands (code review, 2026-11-26):
// from the left (the wardrobe), from the right (the doorway) and from above (the back wall).
const sides = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    hm = window.SSQ.beat("ch1-home-morning"),
    out = {};
  for (const [name, from] of [["left", [300, 398]], ["right", [945, 505]], ["above", [806, 380]]]) {
    n.q = [];
    n.cur = null;
    ss.ch1JumpBeat(22);
    hm.jump("toBag");
    n.sq.x = from[0];
    n.sq.y = from[1];
    for (let i = 0; i < 6; i++) ss.tick(0.05);
    let said = null;
    for (let i = 0; i < 400 && !said; i++) {
      window.SSQ.engine().step("sq", 846, 505, 160, 0.05);
      ss.tick(0.05);
      n.cur && n.cur.k === "bub" && (said = n.cur.b.text);
    }
    n.bt = 1;
    ss.opTap();
    for (let i = 0; i < 6; i++) ss.tick(0.05);
    const o = ss.offerNow();
    out[name] = { said, step: (hm.debug().state || {}).step, offer: o ? o.verb + " · " + o.cap : "" };
  }
  return out;
});
g.check("he sees the bag from the left, the right or above (\"He forgot his lunch!\"), and TAKE · lunch works where he stands", ["left", "right", "above"].every((k) => sides[k].said === LUNCH && sides[k].step === "lunch" && sides[k].offer === L["button-lunch"]), sides);
// Later on Day 2 he hides the pink slip in the Guardian Box (14-ch1-day2.js ch1HideSlip): the box is in the closet now,
// so the closet opens for it and the slip shows in the box there, then the door shuts as they go to bed.
const slip = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    hm = window.SSQ.beat("ch1-home-morning");
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(22);
  n.ch1HomeMorning.step = "done";
  Object.assign(n, { ch1Step: "slip", ctrl: true, ch1Hold: "slip", ch1Slipped: false, sqPose: "stand", wardrobe: "closed" });
  n.sq.x = 300;
  n.sq.y = 420;
  ss.tick(0.05);
  const o = ss.offerNow(),
    offer = o ? o.verb + " · " + o.cap : "";
  o && o.f();
  ss.tick(0.05);
  ss.drawFrame();
  const open = n.wardrobe,
    box = hm.debug().box;
  for (let i = 0; i < 200 && n.sqPose !== "sleep"; i++) ss.tick(0.05);
  return { offer, open, box, paper: n.ch1Paper, after: n.wardrobe };
});
g.check("hiding the pink slip later: the closet opens on the Guardian Box (with the gift) and the slip goes in, then the door shuts at bedtime", slip.offer === "PUT · slip" && slip.open === "open" && slip.box && slip.box.where === "closet" && slip.box.gift && slip.paper === "box" && slip.after === "closed", slip);
g.check("no page errors", errors.length === 0, errors);
await page.close();
await g.finish("home-morning");
