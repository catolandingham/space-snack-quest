/**
 * Beats 25 to 27, the lunch sneak (src/modules/lunch-sneak.js), at phone size, from TAKE · lunch to beat 28's first
 * line. In order, each checked as the player meets it:
 *   - wordless walk in: Mops mops his way out through the hallway doorway, Squatch comes up through his own doorway with
 *     the lunch bag in his paw;
 *   - the sneak: the middle plant glows (HIDE · plant), then the crates (HIDE · crate), then the hallway doorway
 *     (SNEAK · hallway); chip "Squatch: take Mops his lunch"; hidden, the next place is outlined by this beat;
 *   - the hallway: Mops mopping stops and looks round (no words); "Squatch: give Mops his lunch", Mops glows, GIVE ·
 *     lunch; the bag flies to Mops's hoof, one heart, "My lunch! You're the best." (waits for NEXT); the wordless
 *     eating cutaway plays by itself (sandwich, then the bag, both eaten on screen);
 *   - "Squatch: go on", the left doorway outlined; walking there takes them both behind the snack counter, where he
 *     ducks; Mops's wordless one-pie bubble; "Squatch: grab one snack", TAKE · snack, the pie to his paw, eaten;
 *   - beat 28 starts unchanged ("Universal Postal Service ship arriving!").
 * Also: the fairness rules of the sneak (lunch-sneak-place.js, computed with the game's own cone test), the one capture
 * rule (seen -> FUR! -> alarm -> guards -> hidden -> "They lost you."; caught -> LOCKUP -> the step restarts hidden in
 * the last place), a seen snack grab (the pie stays), ↺ at every part, no new words, sizes against the hall, nothing
 * disappears without its cause, and the old lunch code is gone.
 *   node tests/lunch-sneak.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const linesFile = M("lunch-sneak-lines.js");
const { LUNCH_LINES = [] } = existsSync(linesFile) ? await import(linesFile) : {};
const L = Object.fromEntries(LUNCH_LINES.map((l) => [l.id, l.text]));
const placeFile = M("lunch-sneak-place.js");
const P = existsSync(placeFile) ? await import(placeFile) : null;
const W = await import(M("party-watch.js"));
const PENDING = ["Squatch! You should be hiding.", "I know you, Squatch, you're probably hungry... you know the rule, grab one snack."];
const SHIP = "Universal Postal Service ship arriving!";

const g = await startGame({ port: 9745, name: "lunch-sneak" });

// ---------- the sneak's fairness, from the numbers (no browser) ----------
const CONE = { half: 0.42, len: 210 }; // docs/TUNING-PINS.json cone-half, cone-length
const SPEED = 190; // Squatch's walk in the hall
if (P) {
  const { LUNCH_PLACES: PL, WATCHERS, watcherNow, RHYTHM: R, RHYTHM_LENGTH, DOOR_WAY } = P;
  const sees = (w, t, pt) => W.coneSees(W.coneFrom(w.id, w.x, w.y, watcherNow(w, t).a, CONE), pt);
  const legs = (pts) => pts.slice(1).map((b, i) => ({ a: pts[i], b, d: Math.hypot(b.x - pts[i].x, b.y - pts[i].y) }));
  const along = (S, s) => {
    for (const q of S) {
      if (s <= q.d) return { x: q.a.x + ((q.b.x - q.a.x) * s) / q.d, y: q.a.y + ((q.b.y - q.a.y) * s) / q.d };
      s -= q.d;
    }
    return S[S.length - 1].b;
  };
  const walkSeen = (pts, t0) => {
    const S = legs(pts),
      T = S.reduce((a, q) => a + q.d, 0) / SPEED;
    let run = 0,
      worst = 0;
    for (let t = 0; t <= T; t += 0.02) {
      const p = along(S, t * SPEED);
      run = WATCHERS.some((w) => sees(w, t0 + t, p)) ? run + 0.02 : 0;
      worst = Math.max(worst, run);
    }
    return worst;
  };
  const STRETCH = { "plant-crate": [PL.plant.stand, PL.crate.stand], "crate-door": [PL.crate.stand, ...DOOR_WAY] };
  const safe = { start: PL.start, plant: PL.plant.stand, crates: PL.crate.stand, doorway: PL.door.stand };
  const inCone = Object.entries(safe).filter(([, p]) => {
    for (let t = 0; t < RHYTHM_LENGTH * 2; t += 0.05) if (WATCHERS.some((w) => sees(w, t, p))) return true;
    return false;
  });
  g.check("the safe places (his doorway, the plant, the crates, the hallway doorway) are never in a cone", inCone.length === 0, inCone.map(([k]) => k));
  const fair = [],
    danger = [],
    other = [];
  for (const w of WATCHERS) {
    const pts = STRETCH[w.guards];
    // a kid reads "he looks away: go": leaving at any moment of "away" (before his "?") gets him there unseen
    let worst = 0;
    for (let s = 0; s < R.away; s += 0.05) worst = Math.max(worst, walkSeen(pts, s - w.at));
    fair.push({ id: w.id, worst: +worst.toFixed(2) });
    // and going while he looks is seen for the full "?" to "!" time
    danger.push({ id: w.id, seen: +walkSeen(pts, R.away + R.warn + R.turn - w.at).toFixed(2) });
    // one watcher a stretch: his cone never reaches the other stretch or the free first move
    for (const [name, p2] of Object.entries({ ...STRETCH, "door-plant": [PL.start, PL.plant.stand] }))
      if (name !== w.guards) {
        const S = legs(p2),
          len = S.reduce((a, q) => a + q.d, 0);
        for (let t = 0; t < RHYTHM_LENGTH; t += 0.1) for (let s = 0; s <= len; s += 8) sees(w, t, along(S, s)) && other.push(`${w.id} on ${name}`);
      }
  }
  g.check("leaving a hiding place while its watcher looks away, before his \"?\", gets him to the next place unseen (never near the \"!\")", fair.every((f) => f.worst < W.SEEN_TOO_LONG_SECONDS / 2), fair);
  g.check("going while the watcher looks is seen long enough for the \"!\"", danger.every((d) => d.seen >= W.SEEN_TOO_LONG_SECONDS), danger);
  g.check("one watcher a stretch: no cone reaches another stretch, or the free first move to the plant", other.length === 0, [...new Set(other)]);
  // the snack: standing up for the grab is shorter than the "?" warning, his turn and the "?" to "!" time together
  const up = P.LUNCH_PACE.up + P.LUNCH_PACE.reach + P.LUNCH_PACE.back;
  g.check("the snack grab is fair: up for less than the warning, the turn and the seen time together", up < R.warn + R.turn + W.SEEN_TOO_LONG_SECONDS, { up });
  // the counter watcher, looking, sees Squatch standing behind the counter; turned away, he does not
  const cw = P.COUNTER_WATCHER,
    at = P.COUNTER_SPOTS.sq,
    look = W.coneSees(W.coneFrom(cw.id, cw.x, cw.y, cw.look, CONE), at),
    away = W.coneSees(W.coneFrom(cw.id, cw.x, cw.y, cw.away, CONE), at);
  g.check("the guest at the counter sees Squatch standing up when he looks, not when he looks away", look && !away, { look, away });
} else g.check("lunch-sneak-place.js exists", false);

// ---------- the beat, played ----------
const { page, errors } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);
await page.evaluate(() => (window.requestAnimationFrame = () => 0));
const registered = await page.evaluate(() => !!(window.SSQ && window.SSQ.beat("ch1-lunch") && (window.__lu = window.SSQ.beat("ch1-lunch").place)));
g.check("the lunch sneak beat is registered (ch1-lunch)", registered);

const run = !registered
  ? null
  : await page.evaluate(
      ({ SHIP }) => {
        const ss = window.__ss,
          n = ss.op,
          beat = window.SSQ.beat("ch1-lunch"),
          out = { at: {}, chips: [], buttons: [], words: [], drew: {} };
        const tick = (s) => {
          for (let i = 0; i < Math.round(s / 0.05); i++) ss.tick(0.05);
        };
        const st = () => beat.debug().state || {};
        const offer = () => ((o) => (o ? o.verb + " · " + o.cap : ""))(ss.offerNow());
        const press = () => ((o) => (o && o.f ? (o.f(), o.verb + " · " + o.cap) : ""))(ss.offerNow());
        const next = () => ((n.bt = 1), ss.opTap());
        const until = (f, s = 12) => {
          for (let i = 0; i < s / 0.05 && !f(); i++) ss.tick(0.05);
          return !!f();
        };
        const snap = (name) => {
          ss.drawFrame();
          const d = beat.debug();
          out.at[name] = { room: n.room, step: st().step, ch1Step: n.ch1Step, ctrl: !!n.ctrl, chip: ss.chipNow(), offer: offer(), cur: n.cur ? n.cur.k : "", sq: { x: n.sq.x, y: n.sq.y }, pose: st().pose, bag: st().bag, pie: st().pie, pies: st().pies, drew: d.drew ? JSON.parse(JSON.stringify(d.drew)) : null };
          ss.chipNow() && out.chips.push(ss.chipNow());
          offer() && out.buttons.push(offer());
          return out.at[name];
        };
        // a watcher's clock: wait until he has just turned away (the moment a kid goes)
        const awayStart = (id) => until(() => {
          const l = st();
          const w = window.__lu.WATCHERS.find((q) => q.id === id);
          const p = window.__lu.watcherNow(w, l.t);
          return p.phase === "away" && p.k < 0.05;
        }, 10);
        // the home morning at TAKE · lunch
        ss.ch1JumpBeat(22);
        window.SSQ.beat("ch1-home-morning").jump("lunch");
        tick(0.3);
        const logFrom = n.log.length;
        out.take = press();
        tick(0.5);
        snap("walkin");
        out.walkinMops = !!(st().mops && st().mops.mop);
        out.walkinWait = until(() => n.ctrl && st().step === "plant", 4);
        snap("plant");
        // the words wait 20 s behind the glow, then come up (Outline; words if stuck)
        // step to the plant and hide
        n.sq.x = 396;
        n.sq.y = 552;
        tick(0.1);
        snap("atPlant");
        press();
        tick(0.2);
        snap("inPlant");
        // wait for the teal guest to look away, then walk to the crates (the steering stand-up) and hide
        awayStart("teal");
        n.ch1Lunch.pose = "stand";
        n.sqPose = "stand";
        for (let i = 0; i < 40; i++) {
          const to = { x: 600, y: 478 },
            d = Math.hypot(to.x - n.sq.x, to.y - n.sq.y);
          if (d < 4) break;
          n.sq.x += ((to.x - n.sq.x) / d) * Math.min(d, 190 * 0.05);
          n.sq.y += ((to.y - n.sq.y) / d) * Math.min(d, 190 * 0.05);
          ss.tick(0.05);
          out.seenOnFairWalk = Math.max(out.seenOnFairWalk || 0, st().seenT || 0);
        }
        out.alarmOnFairWalk = !!st().alarm;
        snap("atCrate");
        press();
        tick(0.2);
        snap("inCrate");
        // to the doorway, with the camera tourist looking away
        awayStart("camera");
        n.ch1Lunch.pose = "stand";
        n.sqPose = "stand";
        for (const to of [{ x: 740, y: 336 }, { x: 905, y: 320 }])
          for (let i = 0; i < 60; i++) {
            const d = Math.hypot(to.x - n.sq.x, to.y - n.sq.y);
            if (d < 4) break;
            n.sq.x += ((to.x - n.sq.x) / d) * Math.min(d, 190 * 0.05);
            n.sq.y += ((to.y - n.sq.y) / d) * Math.min(d, 190 * 0.05);
            ss.tick(0.05);
            out.seenOnFairWalk = Math.max(out.seenOnFairWalk || 0, st().seenT || 0);
          }
        out.alarmOnFairWalk = out.alarmOnFairWalk || !!st().alarm;
        snap("atDoor");
        press();
        until(() => n.room === "passage", 4);
        tick(0.6);
        snap("arrive");
        out.mopsMopping = !!(st().mops && st().mops.mop);
        const arriveT = n.T;
        until(() => n.ctrl, 6);
        out.arriveSecs = +(n.T - arriveT + 0.6).toFixed(2);
        snap("give");
        n.sq.x = 540;
        n.sq.y = 488;
        tick(0.1);
        snap("atMops");
        press();
        tick(0.25);
        snap("bagFlying");
        until(() => n.cur && n.cur.k === "bub", 3);
        snap("myLunch");
        out.lineWaits = (() => {
          tick(2);
          return n.cur && n.cur.k === "bub";
        })();
        next();
        tick(0.1);
        // the eating cutaway plays by itself: sandwich, then the bag
        out.cut = [];
        let cutSecs = 0;
        for (let i = 0; i < 120 && n.cur && n.cur.k === "cutaway"; i++) {
          ss.drawFrame();
          const c = window.SSQ.cutaway.last();
          c && c.lunch && out.cut.push({ t: +c.t.toFixed(2), sandwich: +c.lunch.sandwich.toFixed(2), bag: +c.lunch.bag.toFixed(2) });
          ss.tick(0.05);
          cutSecs += 0.05;
        }
        out.cutSecs = +cutSecs.toFixed(2);
        until(() => n.ctrl, 6);
        snap("back");
        n.sq.x = 50;
        n.sq.y = 345;
        tick(0.2);
        until(() => st().step === "one", 6);
        until(() => n.cur && n.cur.k === "bub", 3);
        snap("one");
        out.oneLine = n.cur && n.cur.b ? { who: n.cur.b.who, text: n.cur.b.text } : null;
        out.oneWaits = (() => {
          tick(3);
          return !!(n.cur && n.cur.k === "bub");
        })();
        next();
        until(() => n.ctrl && st().step === "snack", 8);
        snap("snack");
        out.closeUp = beat.debug().drew && beat.debug().drew.closeUp;
        out.snackWatcher = window.__lu.watcherNow(window.__lu.COUNTER_WATCHER, st().counterT).phase;
        press();
        tick(0.9);
        snap("grab");
        until(() => st().step === "chew", 3);
        snap("chew");
        until(() => n.cur && n.cur.k === "bub", 4);
        snap("handoff");
        out.ship = n.cur && n.cur.b && n.cur.b.text === SHIP;
        out.words = n.log.slice(logFrom).filter((e) => e.k === "bub" || e.k === "card").map((e) => e.text);
        out.steps = beat.debug().steps;
        out.sounds = beat.debug().sounds;
        // the hall after the lunch, drawn by the older program: the crates, and the plate with two pies left
        out.after = { pies: st().pies, pie: st().pie };
        return out;
      },
      { SHIP },
    );

if (run) {
  const A = run.at;
  g.check("TAKE · lunch starts it: the wordless walk in, Mops mopping in the hallway doorway, no chip, no control", run.take === "TAKE · lunch" && A.walkin.room === "hall" && A.walkin.step === "walkin" && !A.walkin.ctrl && A.walkin.chip === "" && run.walkinMops && run.walkinWait, A.walkin);
  g.check("the sneak: \"Squatch: take Mops his lunch\", the plant glows, HIDE · plant beside it", A.plant.chip === L["chip-sneak"] && A.plant.ch1Step === "lu-plant" && A.plant.drew && A.plant.drew.glow && A.plant.drew.glow.length === 1 && A.atPlant.offer === L["button-plant"], { plant: A.plant, at: A.atPlant.offer });
  g.check("hidden in the plant: his eyes, the crates glow and are outlined by this beat; a new restart point", A.inPlant.pose === "hidden" && A.inPlant.ch1Step === "lu-crate" && A.inPlant.drew.outline === "lu-crate", A.inPlant);
  g.check("leaving while she looks away gets him to the crates and the doorway with no alarm", !run.alarmOnFairWalk && run.seenOnFairWalk < 0.4 && A.atCrate.offer === L["button-crate"], { seen: run.seenOnFairWalk, crate: A.atCrate.offer });
  g.check("hidden behind the crates: the hallway doorway is outlined; SNEAK · hallway in its strip", A.inCrate.ch1Step === "lu-door" && A.inCrate.drew.outline === "lu-door" && A.atDoor.offer === L["button-door"], { crate: A.inCrate, door: A.atDoor.offer });
  g.check("the hallway: Mops is mopping, stops and looks round, with no words and no mark, in about 3 s", A.arrive.room === "passage" && run.mopsMopping && !A.arrive.ctrl && A.arrive.chip === "" && run.arriveSecs <= 3.6, { arrive: A.arrive, secs: run.arriveSecs });
  g.check("\"Squatch: give Mops his lunch\", Mops glows, GIVE · lunch beside him", A.give.chip === L["chip-give"] && A.give.drew && A.give.drew.glow && A.atMops.offer === L["button-give"], { give: A.give, offer: A.atMops.offer });
  g.check("the bag goes from his paw to Mops (flying, then in Mops's hoof), one heart, his line word for word, waiting for NEXT", A.atMops.drew.things.includes("bagInPaw") && A.bagFlying.drew.things.includes("bagFlying") && A.myLunch.drew.things.includes("bagWithMops") && !!A.myLunch.drew.heart && run.words.includes(L["mops-lunch"]) && run.lineWaits, { flying: A.bagFlying.drew, line: A.myLunch.drew });
  const cut = run.cut;
  const sandwichGone = cut.find((c) => c.sandwich === 0),
    bagGone = cut.find((c) => c.bag === 0);
  g.check("the eating cutaway plays by itself in 2 to 4 s: the sandwich eaten bite by bite, then the bag, both gone on screen", run.cutSecs >= 2 && run.cutSecs <= 4.0 && cut.length > 10 && cut[0].sandwich === 1 && cut[0].bag === 1 && sandwichGone && bagGone && sandwichGone.t < bagGone.t && cut.some((c) => c.bag > 0 && c.bag < 1), { secs: run.cutSecs, first: cut[0], sandwichGone, bagGone });
  g.check("chomps and crunches are heard with the bites", (run.sounds.chomp || 0) >= 3 && (run.sounds.crunch || 0) >= 3, run.sounds);
  g.check("after lunch: \"Squatch: go on\", the left doorway outlined, the bag eaten", A.back.chip === L["chip-back"] && A.back.drew && !!A.back.drew.outline && A.back.bag === "eaten", A.back);
  g.check("behind the counter: ducked, the plate glows, no chip; Mops says \"...you know the rule, grab one snack.\" (Brian 2026-11-26, word for word) in place of the thought bubble, waiting for NEXT", A.one.room === "hall" && A.one.pose === "ducked" && !A.one.ctrl && A.one.chip === "" && A.one.drew && A.one.drew.glow.length === 1 && !A.one.drew.thought && run.oneLine && run.oneLine.who === "mops" && run.oneLine.text === "...you know the rule, grab one snack." && L["mops-one-snack"] === run.oneLine.text && run.oneWaits, { one: A.one, line: run.oneLine, waits: run.oneWaits });
  g.check("\"Squatch: grab one snack\" and TAKE · snack come up as the counter guest turns away", A.snack.chip === L["chip-snack"] && A.snack.offer === L["button-snack"] && run.snackWatcher === "away", { snack: A.snack, watcher: run.snackWatcher });
  g.check("TAKE · snack: he stands up and takes ONE pie into his paw (two stay), then ducks and eats it", A.grab.pose === "up" && A.grab.pie === "paw" && A.grab.pies === 2 && A.chew.step === "chew" && run.after.pie === "eaten" && run.after.pies === 2, { grab: A.grab, chew: A.chew, after: run.after });
  g.check("then beat 28, unchanged: \"Universal Postal Service ship arriving!\"", run.ship, A.handoff);
  g.check("the steps in order", JSON.stringify(run.steps.filter((s) => ["walkin", "plant", "crate", "door", "tohall", "arrive", "give", "given", "back", "tocounter", "one", "snack", "grab", "chew", "handoff"].includes(s))) === JSON.stringify(["walkin", "plant", "crate", "door", "tohall", "arrive", "give", "given", "back", "tocounter", "one", "snack", "grab", "chew", "handoff"]), run.steps);
  // no new words: every chip, button and line is a whole line of the lines file (or beat 28's first line)
  const known = new Set([...LUNCH_LINES.map((l) => l.text), SHIP]);
  const said = [...new Set([...run.chips, ...run.buttons, ...run.words])];
  g.check("no new words: every chip, button and line is a whole line of lunch-sneak-lines.js", said.every((t) => known.has(t)), said.filter((t) => !known.has(t)));
  g.check("the pending lines are not shown", !run.words.some((t) => PENDING.includes(t)), run.words);
  g.check("footsteps only through footfalls.js, and heard", (run.sounds.pad || 0) > 0, run.sounds);
}
g.check("the lines file names a status and a source for every line, all in the game before, decided or approved by Brian", LUNCH_LINES.length >= 11 && LUNCH_LINES.every((l) => l.id && l.who && l.text && ["in-game", "decided", "approved"].includes(l.status) && l.source));

// ---------- sizes against the hall ----------
const sizes = !registered
  ? null
  : await page.evaluate(() => {
      const e = window.SSQ.engine(),
        h = e.hallSizes(),
        g = window.SSQ.guests,
        sq = 48.5 * h.squatch;
      return { adult: h.adult, sq, teal: g.height("teal", h.adult), camera: g.height("camera", h.adult), robot: g.height("robot", h.adult) };
    });
if (sizes && P) {
  const S = P.LUNCH_SIZES,
    crate = P.LUNCH_PLACES.crate.box.y1 - P.LUNCH_PLACES.crate.box.y0,
    pie = 36 * S.pie,
    bag = 68 * 0.88; // (home-morning-art.js MORNING_SIZES.bag.h, lunch-sneak-art.js BAG_IN_HALL)
  g.check("Squatch is 80% of the hall's grown-up; the guests are their approved heights", Math.abs(sizes.sq / sizes.adult - 0.8 * (48.5 / 45)) < 0.02 && sizes.teal === sizes.adult, sizes);
  g.check("the crates are about Squatch's height (he hides behind them), the pies and the bag are big enough for a phone (over a third of him)", crate / sizes.sq > 0.7 && crate / sizes.sq < 1.2 && pie / sizes.sq > 0.4 && bag / sizes.sq > 0.33, { crate: crate / sizes.sq, pie: pie / sizes.sq, bag: bag / sizes.sq });
  g.check("the plate is not under Squatch where he crouches (it is below his feet)", P.COUNTER_SPOTS.plate.y - 20 > P.COUNTER_SPOTS.sq.y, { plate: P.COUNTER_SPOTS.plate, sq: P.COUNTER_SPOTS.sq });
}

// ---------- the one capture rule, and the restart ----------
const capture = !registered
  ? null
  : await page.evaluate(() => {
      const ss = window.__ss,
        n = ss.op,
        beat = window.SSQ.beat("ch1-lunch"),
        out = {};
      const st = () => beat.debug().state || {};
      const until = (f, s) => {
        for (let i = 0; i < s / 0.05 && !f(); i++) ss.tick(0.05);
        return !!f();
      };
      const lu = window.__lu;
      n.q = [];
      n.cur = null;
      ss.ch1JumpBeat(25);
      // hide in the plant (a restart point), then step out in the teal guest's look and stand there
      n.sq.x = 396;
      n.sq.y = 552;
      ss.tick(0.05);
      ss.offerNow().f();
      ss.tick(0.1);
      until(() => lu.watcherNow(lu.WATCHERS[0], st().t).phase === "look", 8);
      n.ch1Lunch.pose = "stand";
      n.sqPose = "stand";
      n.sq.x = 498;
      n.sq.y = 520;
      until(() => !!st().alarm, 2);
      out.seen = !!st().alarm;
      out.shout = st().alarm && st().alarm.phase;
      out.chip = ss.chipNow();
      // the first time, the hand pulling the alarm, full screen, wordless; then the bell and the guards
      until(() => st().alarm && st().alarm.phase === "pull", 4);
      out.closeUp = !!document.querySelector('canvas[aria-label="fur alarm"]');
      until(() => st().alarm && st().alarm.guards.length === 2, 5);
      out.closeUpGone = !document.querySelector('canvas[aria-label="fur alarm"]');
      out.guards = st().alarm ? st().alarm.guards.length : 0;
      // hide in the plant: they search, give up, "They lost you."
      n.sq.x = 396;
      n.sq.y = 552;
      ss.tick(0.05);
      const hide = ss.offerNow();
      out.hideOffer = hide ? hide.verb + " · " + hide.cap : "";
      hide && hide.f();
      until(() => !st().alarm, 20);
      out.lostNote = !st().alarm;
      out.afterLost = { ctrl: n.ctrl, chip: ss.chipNow(), step: st().step, pose: st().pose };
      // seen again, and he stays out: a guard reaches him, the LOCKUP card, and the step restarts hidden in the plant
      until(() => lu.watcherNow(lu.WATCHERS[0], st().t).phase === "look", 8);
      n.ch1Lunch.pose = "stand";
      n.sqPose = "stand";
      n.sq.x = 498;
      n.sq.y = 520;
      until(() => !!st().alarm, 2);
      until(() => (n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail"), 30);
      out.jail = !!((n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail"));
      out.cause = n.cur && n.cur.cause;
      for (let i = 0; i < 20 && (n.cur || n.q.length); i++) ((n.bt = 1), ss.opTap(), ss.tick(0.1));
      ss.tick(0.1);
      const l = st();
      out.restarted = { step: l.step, ch1Step: n.ch1Step, pose: l.pose, sqPose: n.sqPose, alarm: !!l.alarm, ctrl: n.ctrl, x: n.sq.x, y: n.sq.y, room: n.room };
      // a seen snack grab: the pie stays on the plate, he ducks (hidden), the guards give up, TAKE · snack again
      n.q = [];
      n.cur = null;
      ss.ch1JumpBeat(27);
      ss.tick(0.05);
      until(() => lu.watcherNow(lu.COUNTER_WATCHER, st().counterT).phase === "look", 8);
      ss.offerNow() && ss.offerNow().f();
      until(() => !!st().alarm, 2);
      out.snackSeen = { alarm: !!st().alarm, pie: st().pie, pies: st().pies, pose: st().pose, chip: ss.chipNow() };
      until(() => !st().alarm, 25);
      out.snackAfter = { alarm: !!st().alarm, caught: !!(n.cur && n.cur.id === "jail"), step: st().step, ctrl: n.ctrl, offer: ((o) => (o ? o.verb + " · " + o.cap : ""))(ss.offerNow()) };
      return out;
    });
if (capture) {
  g.check("seen (standing in a look for 0.8 s): FUR! and the one capture rule starts; \"Squatch: hide\"", capture.seen && capture.shout === "shout" && capture.chip === L["chip-hide"], capture);
  g.check("the first time, the wordless close-up of the hand pulling the alarm (it ends by itself); then two guards come in", capture.closeUp && capture.closeUpGone && capture.guards === 2, capture);
  g.check("hidden in the plant through the search: \"They lost you.\", and the sneak goes on with control", capture.hideOffer === L["button-plant"] && capture.lostNote && capture.afterLost.ctrl && capture.afterLost.chip === L["chip-sneak"] && capture.afterLost.pose === "hidden", capture.afterLost);
  g.check("caught: the LOCKUP card names who saw him and where", capture.jail && /tourist/i.test(capture.cause || "") && /hall/.test(capture.cause || ""), { jail: capture.jail, cause: capture.cause });
  const r = capture.restarted;
  g.check("the section restarts at the last hiding place: hidden in the plant, no alarm, control, the crates next", r.room === "hall" && r.ch1Step === "lu-crate" && r.pose === "hidden" && !r.alarm && r.ctrl && Math.abs(r.x - 396) < 2, r);
  g.check("a seen snack grab: the pie stays on the plate, he ducks (hidden), no \"hide\" chip", capture.snackSeen.alarm && capture.snackSeen.pie === "plate" && capture.snackSeen.pies === 3 && capture.snackSeen.pose === "ducked" && capture.snackSeen.chip === "", capture.snackSeen);
  g.check("ducked behind the counter through the search: never caught, then TAKE · snack again", !capture.snackAfter.alarm && !capture.snackAfter.caught && capture.snackAfter.step === "snack" && capture.snackAfter.ctrl && capture.snackAfter.offer === L["button-snack"], capture.snackAfter);
}

// ---------- ↺ at every part ----------
const resets = !registered
  ? null
  : await page.evaluate(() => {
      const ss = window.__ss,
        n = ss.op,
        beat = window.SSQ.beat("ch1-lunch"),
        lu = window.__lu,
        out = {};
      const st = () => beat.debug().state || {};
      const settle = () => {
        for (let i = 0; i < 160 && !(n.ctrl && !n.cur && !n.q.length); i++) ss.tick(0.05);
        const l = st();
        return { ctrl: n.ctrl, step: l.step, ch1Step: n.ch1Step, room: n.room, pose: l.pose, inCone: beat.seenNow(), cur: n.cur ? n.cur.k : "" };
      };
      const fresh = (b) => ((n.q = []), (n.cur = null), ss.ch1JumpBeat(b), ss.tick(0.05));
      const reset = () => (ss.sectionReset(), ss.tick(0.05), settle());
      // the walk in (no control yet)
      ss.ch1JumpBeat(22);
      window.SSQ.beat("ch1-home-morning").jump("lunch");
      ss.tick(0.3);
      ss.offerNow().f();
      ss.tick(0.4);
      out.walkin = reset();
      // each step he controls
      for (const s of ["plant", "crate", "door", "give", "back", "snack"]) {
        fresh(22);
        beat.jump(s);
        for (let i = 0; i < 4; i++) ss.tick(0.05);
        n.sq.x += 30;
        out[s] = reset();
      }
      // between steps: the walk to the hallway, the bag flying / the line / the cutaway, the walk to the counter, the grab
      fresh(22);
      beat.jump("door");
      ss.tick(0.05);
      n.sq.x = 905;
      n.sq.y = 320;
      n.ch1Lunch.pose = "stand";
      ss.tick(0.05);
      ss.offerNow().f();
      ss.tick(1.0);
      out.toHallway = reset();
      fresh(22);
      beat.jump("give");
      ss.tick(0.05);
      n.sq.x = 540;
      n.sq.y = 488;
      ss.tick(0.05);
      ss.offerNow().f();
      for (let i = 0; i < 60 && !(n.cur && n.cur.k === "cutaway"); i++) ((n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap())), ss.tick(0.05));
      out.inCutaway = n.cur && n.cur.k === "cutaway";
      out.cutaway = reset();
      fresh(22);
      beat.jump("back");
      ss.tick(0.05);
      n.sq.x = 50;
      n.sq.y = 345;
      ss.tick(1.0);
      out.toCounter = reset();
      fresh(22);
      beat.jump("snack");
      ss.tick(0.05);
      ss.offerNow().f();
      ss.tick(0.3);
      out.grab = reset();
      return out;
    });
if (resets) {
  const bad = Object.entries(resets).filter(([k, r]) => typeof r === "object" && !(r.ctrl && ["plant", "crate", "door", "give", "back", "snack"].includes(r.step) && !r.inCone && r.ch1Step === "lu-" + r.step));
  g.check("↺ never strands him: at every part he gets control back on a step of the lunch, never standing in a cone", bad.length === 0, bad.length ? Object.fromEntries(bad) : resets);
  g.check("↺ in the eating cutaway goes back to GIVE · lunch (the bag back in his paw)", resets.inCutaway && resets.cutaway.step === "give", resets.cutaway);
}

// ---------- ↺ while the alarm's close-up is up; a chapter reset ----------
const edge = !registered
  ? null
  : await page.evaluate(() => {
      const ss = window.__ss,
        n = ss.op,
        beat = window.SSQ.beat("ch1-lunch"),
        lu = beat.place,
        st = () => n.ch1Lunch || {},
        until = (f, s) => {
          for (let i = 0; i < s / 0.05 && !f(); i++) ss.tick(0.05);
          return !!f();
        };
      // a fresh play, so the first alarm's close-up shows again
      n.q = [];
      n.cur = null;
      ss.ch1JumpBeat(22);
      window.SSQ.beat("ch1-home-morning").jump("lunch");
      ss.tick(0.3);
      ss.offerNow().f();
      until(() => n.ctrl && st().step === "plant", 5);
      n.sq.x = 396;
      n.sq.y = 552;
      ss.tick(0.05);
      ss.offerNow().f();
      ss.tick(0.1);
      until(() => lu.watcherNow(lu.WATCHERS[0], st().t).phase === "look", 8);
      n.ch1Lunch.pose = "stand";
      n.sqPose = "stand";
      n.sq.x = 498;
      n.sq.y = 520;
      until(() => st().alarm && st().alarm.phase === "pull", 4);
      const pulled = st().alarm && st().alarm.phase === "pull";
      ss.sectionReset();
      ss.tick(0.05);
      const closedAtOnce = !document.querySelector('canvas[aria-label="fur alarm"]');
      ss.tick(3.5);
      for (let i = 0; i < 70; i++) ss.tick(0.05);
      const after = { alarm: !!st().alarm, ctrl: n.ctrl, step: st().step, pose: st().pose, closeUp: !!document.querySelector('canvas[aria-label="fur alarm"]') };
      // a chapter reset forgets the lunch
      window.SSQ.engine().resetChapter();
      return { pulled, closedAtOnce, after, activeAfterReset: beat.active(), lunchAfterReset: n.ch1Lunch == null };
    });
if (edge) {
  g.check("↺ while the alarm's close-up is up: it closes, the alarm is gone and stays gone, he is hidden in the plant with control", edge.pulled && edge.closedAtOnce && !edge.after.alarm && !edge.after.closeUp && edge.after.ctrl && edge.after.pose === "hidden", edge);
  g.check("a chapter reset forgets the lunch (ch1Lunch cleared)", edge.lunchAfterReset && !edge.activeAfterReset, edge);
}

// ---------- the old code is gone ----------
const GAME = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
g.check("the old lunch is gone from src/game (its guests, sight, zooms, FEED buttons and restart)", !/CH1_LUNCH_WATCH|ch1LunchSee|ch1LunchRun|ch1GiveLunch|ch1Feed1|ch1OneDrop|ch1TakeOne|ch1RestartLunch|ch1ToMops|"onesnack"|"feed1"/.test(GAME));
g.check("the pending lines are no longer in src/game", !PENDING.some((t) => GAME.includes(t)));
g.check("no page errors", errors.length === 0, errors);
await page.close();
await g.finish("lunch-sneak");
