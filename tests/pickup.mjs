/**
 * Pickup day (src/modules/pickup.js), Chapter 1 beats 53 to 61, at phone size, played the way the playthrough robot
 * plays: NEXT on every bubble and card, and at each step the player controls, the walker stands on the step's spot and
 * presses its button. Checked as the player meets them:
 *   53: the note on the pillow (READ · note), its close-up; OPEN · box and the pink corner, PACK · note covers it; the
 *       switch to Mops; the four tufts wiped by walking (the next one outlined); the white hair held close; PACK · box,
 *       PACK · bucket, four things off the walls (pale squares); the PA; PUT ON · label; GET IN · crate; the push as
 *       Mops through the hall (the guests' "Hi, Mops!") and the hallway (the robot reads the label) to the mail room;
 *   54: the slat view (his eyes in the corner), the new robots' lines, the bag opened, Lou's hat in the bin;
 *   55: Mops walks to the crate, KNOCK · crate, BLEAT · robot (the robots turn to him); CLIMB OUT · crate; ROLL · ball
 *       is offered where he stands; HIDE · plant; the held moment ("GOAT HAIR. PROCEED."); the idea; the walk home.
 *   56 to 61: played the same way to the tally card (the snip, the dress-up's button, three bleats, the last walk, the
 *       scanner, the office, the tapes, the hold).
 * Also: every line's words come from the lines files; ↺ in a step he controls brings it back, and between steps goes
 * back to the last one he did; the chapter reset forgets pickup day; a robot that sees him sneaking shows "?", then the
 * alarm and a guard; a guest's cone on him in costume ("?", BLEAT · guest, the beard slipping, PRESS · beard); the old
 * code is gone from src/game.
 *   node tests/pickup.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const { PICKUP_LINES } = await import(M("pickup-lines.js"));
const g = await startGame({ port: 9789, name: "pickup" });

// ---------- without a browser ----------
const ids = PICKUP_LINES.map((l) => l.id);
g.check("every pickup line has a unique id", new Set(ids).size === ids.length);
g.check("no line is marked approved without Brian's yes in its source", PICKUP_LINES.filter((l) => l.status === "approved").every((l) => /Brian/.test(l.source)));
g.check("every button reads VERB · thing", PICKUP_LINES.filter((l) => l.who === "button").every((l) => / · /.test(l.text)), PICKUP_LINES.filter((l) => l.who === "button" && !/ · /.test(l.text)));
{
  const pass = readFileSync(join(root, "docs", "CH1-STORY-WALKTHROUGH.md"), "utf8");
  g.check("the decided words stay word for word (\"More bleat. Less roar.\", the office lines)", ["More bleat. Less roar.", "Send in Mops for his Employee of the Month photo.", "I never ordered a replacement! Get me the security tapes."].every((w) => pass.includes(w) && PICKUP_LINES.some((l) => l.text === w)));
}
const game = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
const gone = ["ch1PackStart", "ch1PackBox", "ch1PackBucket", "ch1ToPickup", "ch1PickupWatch", "ch1CostumeReady", "ch1Jacket", "ch1LastWalk", "ch1TakeDrawing", "ch1ToScanner", "ch1Leave()", "ch1AtScanner", "ch1Board", "ch1Trim", "drawPickupLoad", '"pack1"', '"keepsake"'];
g.check("the old beats 53 to 61 are gone from src/game", gone.every((f) => !game.includes(f)), gone.filter((f) => game.includes(f)));

const { page, errors } = await g.open("?beat=pickup", { width: 375, height: 812, isMobile: true, hasTouch: true });
await page.evaluate(() => window.__ss.lockedReady);

const run = await page.evaluate(
  async ({ L }) => {
    const ss = window.__ss,
      n = ss.op,
      B = window.SSQ.beat("ch1-pickup"),
      d = () => B.debug(),
      S = () => d().state,
      W = Object.fromEntries(L.map((l) => [l.id, l.text]));
    const out = { said: [], acts: [], steps: [], marks: {}, cu: {} };
    const tick = (s = 0.05) => ss.tick(s);
    const say = () => (n.cur && n.cur.k === "bub" ? n.cur.b.text : n.cur && n.cur.k === "card" ? n.cur.text : "");
    // NEXT on whatever is up, until control comes back or the step changes to `until`
    const nextAll = (stopStep, max = 400) => {
      for (let i = 0; i < max; i++) {
        if (stopStep && S() && S().step === stopStep && n.ctrl && !n.cur) return true;
        if (n.cur) {
          n.cur.k === "panel" && n.cur.id === "tally" && (out.tally = true);
          const s = say();
          !out.tally && s && out.said[out.said.length - 1] !== s && out.said.push(s);
          ss.drawFrame();
          (n.bt = 1), ss.opTap();
          tick(0.1);
        } else tick(0.1);
        if (!stopStep && n.ctrl && !n.cur && n.q.length === 0) return true;
      }
      return false;
    };
    // the walker stands on the step's first spot; a button is pressed
    const play = (label) => {
      tick();
      const sp = ss.spotsNow().filter((s) => s && (s.r > 0 || s.box) && !s.extra)[0];
      if (!sp) return (out.acts.push(label + ": no spot"), false);
      const who = sp.who === "mo" ? n.mo : n.sq;
      who.x = sp.x;
      who.y = sp.y;
      ss.drawFrame();
      tick();
      if (!sp.verb) return (out.acts.push("WALK · " + sp.id), true);
      const a = ss.offerNow();
      if (!a || !a.f) return (out.acts.push(label + ": no button"), false);
      out.acts.push(a.verb + " · " + a.cap);
      a.f();
      tick();
      return true;
    };
    // ---- 53 ----
    for (let i = 0; i < 40 && !(n.ctrl && S().step === "note"); i++) tick(0.1);
    ss.drawFrame();
    out.note0 = { step: S().step, room: n.room, chip: n.ch1Chip, mark: !!d().drew.mark, walls: d().drew.walls };
    play("note");
    ss.drawFrame();
    out.cu.note = d().drew.note;
    nextAll("box");
    play("box");
    ss.drawFrame();
    out.cu.box = d().drew.box;
    play("packnote");
    nextAll("mop");
    out.mopDriving = d().driving;
    for (let k = 0; k < 4; k++) {
      ss.drawFrame();
      k === 0 && (out.marks.tuft = d().drew.next);
      play("mop");
      for (let j = 0; j < 4; j++) tick();
    }
    out.tufts = S().tufts;
    out.hairCu = S().cu;
    nextAll("pack");
    play("pack");
    play("bucket");
    for (let k = 0; k < 4; k++) play("walls");
    ss.drawFrame();
    out.wallsLeft = d().drew.walls;
    nextAll("label");
    play("label");
    play("getin");
    nextAll("push");
    out.push0 = { room: n.room, driving: d().driving, sqPose: n.sqPose, crate: S().crate };
    // the push: walk to each doorway (the robot stands in it), through the hall and the hallway, to the mail room
    for (let k = 0; k < 6 && S().step === "push"; k++) {
      const room = n.room;
      if (room === "hall") {
        // past the first guest first (a guest waves at Mops)
        n.mo.x = 560;
        n.mo.y = 470;
        tick();
        tick();
      }
      if (room === "passage") {
        n.mo.x = 560;
        n.mo.y = 420;
        tick();
        tick();
      }
      play("push " + room);
      for (let j = 0; j < 6; j++) tick();
    }
    out.pushLog = n.log.filter((e) => e.k === "live").map((e) => e.text);
    // ---- 54 ----
    nextAll("warn", 800);
    out.slatSaid = out.said.slice();
    out.hat = S().hat;
    out.bag = S().things && S().things.bag.where;
    // ---- 55 ----
    out.warn0 = { driving: d().driving, step: S().step };
    play("warn");
    tick();
    play("knock");
    nextAll("bleat");
    play("bleat");
    nextAll("climb");
    out.botsFaceMops = S().bots.filter((b) => b.kind === "new").every((b) => b.f < 0);
    play("climb");
    tick();
    out.ballOffered = ss.spotsNow().some((s) => s && s.verb === "ROLL");
    play("sneak");
    nextAll("home", 1200);
    out.heldSteps = d().steps.slice(-6);
    out.his = S().things.his.where;
    out.homeRoom = n.room;
    for (let k = 0; k < 6 && S() && S().step === "home"; k++) {
      play("home " + n.room);
      for (let j = 0; j < 6; j++) tick();
    }
    // ---- 56 to 61: played the same way, to the tally card ----
    const seen = {};
    let waited = 0;
    for (let i = 0; i < 3000; i++) {
      if (n.cur && n.cur.k === "panel" && n.cur.id === "tally") {
        out.tally = true;
        break;
      }
      if (n.cur || !n.ctrl || n.q.length) {
        nextAll("", 60);
        continue;
      }
      const st = S();
      if (!st || !B.active()) break;
      ss.drawFrame();
      const dr = d().drew || {};
      seen[st.step] = seen[st.step] || { room: n.room, cu: st.cu, chip: n.ch1Chip, mark: !!dr.mark, mirror: dr.mirror, dress: dr.dress && dr.dress.meter, tape: dr.tape && dr.tape.next, crew: dr.crew, place: st.place };
      // (nothing to press yet, e.g. the week's box still coming down the ramp: wait a moment)
      if (!ss.spotsNow().some((q) => q && (q.r > 0 || q.box) && !q.extra)) {
        for (let j = 0; j < 4; j++) tick(0.1);
        if ((waited = (waited || 0) + 1) > 60) break;
        continue;
      }
      waited = 0;
      if (!play(st.step + " " + n.room)) out.acts.pop();
      for (let j = 0; j < 4; j++) tick();
    }
    out.seen = seen;
    out.costume = n.costumeOn;
    out.end = { step: S() && S().step, scene: n.scene, room: n.room, ch1Step: n.ch1Step, active: B.active(), cur: n.cur && (n.cur.id || n.cur.k) };
    out.allSaid = out.said;
    out.steps = d().steps;
    return out;
  },
  { L: PICKUP_LINES },
);
const W = Object.fromEntries(PICKUP_LINES.map((l) => [l.id, l.text]));
g.check("53: home in the morning, the note's outline, READ · note", run.note0.room === "closet" && run.note0.chip === W["chip-note"] && run.note0.mark && run.acts[0] === "READ · note", run.note0);
g.check("53: the note close-up shows the Guardian note, signed", run.cu.note && run.cu.note.signed, run.cu.note);
g.check("53: \"They know!\" and \"They're not mad.\"", run.said.includes(W["sq-know"]) && run.said.includes(W["sq-not-mad"]));
g.check("53: the box close-up shows the pink corner, then PACK · note", run.cu.box && run.cu.box.pinkShows && run.acts.includes("PACK · note"), run.cu.box);
g.check("53: \"Safe.\", then Mops's two lines, then the player is Mops", run.said.includes(W["sq-safe"]) && run.said.includes(W["mops-tuft"]) && run.mopDriving === "mops");
g.check("53: the four tufts are wiped by walking (the next one is the walk spot)", run.tufts.every(Boolean) && run.marks.tuft === "pk-tuft" && run.hairCu === "hair", { tufts: run.tufts, mark: run.marks.tuft, cu: run.hairCu });
g.check("53: PACK · box, PACK · bucket, four things off the walls, PUT ON · label, GET IN · crate", ["PACK · box", "PACK · bucket", "TAKE · chart", "TAKE · brochure", "TAKE · drawing", "PUT ON · label", "GET IN · crate"].every((a) => run.acts.includes(a)) && run.wallsLeft.length === 0, run.acts);
g.check("53: the bare walls, the PA, \"In you go.\"", [W["sq-empty"], W["mops-empty"], W["pa-ship"], W["mops-in"], W["mops-sound"]].every((w) => run.said.includes(w)));
g.check("53: the push: the player is Mops, Squatch hidden in the crate", run.push0.driving === "mops" && run.push0.sqPose === "hidden" && run.push0.crate === "push", run.push0);
g.check("53: a guest waves at Mops in the hall; the hallway robot reads the label", run.pushLog.includes(W["guest-hi"]) && run.pushLog.includes(W["robot-label"]), run.pushLog);
g.check("54: the new robots' lines and the hat", [W["scan-no-fur"], W["bot-new-rule"], W["bot-scan-every"], W["bot-never"], W["bot-why-here"], W["scan-fur-stop"], W["bot-hat"], W["sq-that-was-me"]].every((w) => run.slatSaid.includes(w)) && run.hat.where === "bin" && run.bag === "ship", { hat: run.hat, bag: run.bag });
g.check("55: the player is Mops at the bay door", run.warn0.driving === "mops" && run.warn0.step === "warn", run.warn0);
g.check("55: KNOCK · crate, BLEAT · robot; the robots turn to Mops", run.acts.includes("KNOCK · crate") && run.acts.includes("BLEAT · robot") && run.botsFaceMops);
g.check("55: CLIMB OUT · crate; ROLL · ball offered where he stands; HIDE · plant", run.acts.includes("CLIMB OUT · crate") && run.ballOffered && run.acts.includes("HIDE · plant"));
g.check("55: the held moment: his crate scanned, the white hair, \"GOAT HAIR. PROCEED.\", up the ramp", run.said.includes(W["scan-goat-hair"]) && run.said.includes(W["bot-one-box"]) && run.his === "ship", { his: run.his });
g.check("55: the walk home, and their lines at home", [W["sq-stopped-hat"], W["sq-lets-goats"], W["sq-make-goat"]].every((w) => run.said.includes(w)), run.end);
g.check("56: SNIP · beard as Mops; the dress-up's big button puts on the beard, the horns, the jacket; BLEAT · Mops three times", ["SNIP · beard", "PUT ON · beard", "PUT ON · horns", "PUT ON · jacket", "BLEAT · Mops"].every((a) => run.acts.includes(a)) && run.acts.filter((a) => a === "BLEAT · Mops").length === 3, run.acts);
g.check("56: \"More bleat. Less roar.\" answers his roar; the mirror: \"Two goats.\"", [W["sq-bleat-1"], W["mops-less-roar"], W["sq-dont-weent"], W["mops-close-enough"], W["mops-two-goats"], W["mops-not-one"]].every((w) => run.said.includes(w)));
g.check("57: the last walk through the hall and the hallway in costume", run.seen.lastwalk && run.costume === true, run.seen.lastwalk);
g.check("58: PICK UP · box, the robot's \"TWO GOATS?\", BLEAT · robot, GO · ship as Mops, BOARD · scanner, PRESS · beard, CLIMB · ramp", ["PICK UP · box", "BLEAT · robot", "GO · ship", "BOARD · scanner", "PRESS · beard", "CLIMB · ramp"].every((a) => run.acts.includes(a)) && run.said.includes(W["bot-two-goats"]), run.acts);
g.check("58: \"It's attached.\", \"GOAT. PROCEED.\", then the scanner in three bubbles", [W["mops-attached"], W["scan-goat"], W["scan-hair-58"], W["scan-probably"], W["scan-proceed"], W["sq-weent"]].every((w) => run.said.includes(w)));
g.check("59: Isfred's five lines, word for word, then \"Later that evening...\"", ["isfred-photo", "bot-not-here", "isfred-not-here", "bot-replaced-shipment", "isfred-tapes", "card-later"].every((id) => run.said.includes(W[id])));
g.check("60: the tapes: PLAY · tape, ZOOM · in, NEXT · tape; \"That is not a goat.\" / \"A Wookiee!\"", ["PLAY · tape", "ZOOM · in", "NEXT · tape"].every((a) => run.acts.includes(a)) && [W["isfred-what"], W["isfred-not-goat"], W["isfred-wookiee"], W["isfred-ship"]].every((w) => run.said.includes(w)), run.acts);
g.check("61: OPEN · box, BITE · cake, \"No fizz.\", the call, HIDE · crate, \"Found him.\", \"He's with me.\"", ["OPEN · box", "BITE · cake", "HIDE · crate"].every((a) => run.acts.includes(a)) && [W["sq-no-fizz"], W["ship-call"], W["ship-wookiee"], W["sq-sasquatch"], W["crew-found"], W["mops-with-me"], W["crew-both-off"]].every((w) => run.said.includes(w)), run.acts);
g.check("the end of Chapter 1: the tally card", run.tally === true, run.end);
// every bubble and card shown is a pickup line (or a piece of one), the Guardian note's or the frame's words
// (escape-lines.js), a switch card, or the chapter's own end; nothing else is said
{
  const { ESCAPE_LINES } = await import(M("escape-lines.js"));
  const known = [...PICKUP_LINES, ...ESCAPE_LINES].map((l) => l.text);
  const stray = run.allSaid.filter((s) => !known.some((t) => t === s || t.includes(s)) && !/^You are (MOPS|SQUATCH) now/.test(s) && !/^LOCKUP|Chapter|Never caught/.test(s));
  g.check("every line shown comes from the lines files (no words made up in the code)", stray.length === 0, stray);
}
// ---------- ↺, the chapter reset, the robots' capture rule, the costume's rule (a fresh page: still Chapter 1) ----------
const page2 = (await g.open("?beat=pickup", { width: 375, height: 812, isMobile: true, hasTouch: true })).page;
await page2.evaluate(() => window.__ss.lockedReady);
const more = await page2.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    B = window.SSQ.beat("ch1-pickup"),
    S = () => n.ch1Pickup; // (the live state: a change here is a change in the game)
  const tick = (s = 0.05) => ss.tick(s);
  const out = { restart: {}, cut: {} };
  // each of these steps he controls: jumped to, changed, then ↺ brings back its start
  for (const step of ["walls", "sneak", "dress", "lastwalk", "tape"]) {
    ((n.q = []), (n.cur = null), (n.ch1Escape = null), B.jump(step));
    for (let i = 0; i < 300 && !(n.ctrl && !n.cur && S().step === step); i++) ((n.cur && ((n.bt = 1), ss.opTap())), tick(0.1));
    for (let i = 0; i < 4; i++) tick(); // (the step's start is saved on its first frame with control)
    const at = { x: Math.round(n.sq.x), y: Math.round(n.sq.y) };
    step === "walls" && (S().walls = { chart: 1 });
    step === "dress" && (S().dress.on = { beard: "chin" });
    step === "tape" && (S().tape.next = "zoom");
    n.sq.x += 40;
    ss.sectionReset();
    for (let i = 0; i < 4; i++) tick();
    out.restart[step] = { step: S().step, ctrl: n.ctrl, back: Math.round(n.sq.x) === at.x && Math.round(n.sq.y) === at.y, walls: Object.keys(S().walls || {}).length, dress: S().dress ? Object.keys(S().dress.on).length : 0, next: S().tape ? S().tape.next : "" };
  }
  // the steps he does not control go back to the last one he did (pickup.js PK_RESTART_TO)
  for (const [step, from] of [["slat", "push"], ["held", "sneak"], ["mirror", "practice"], ["climbing", "ramp"], ["found", "hide"]]) {
    ((n.q = []), (n.cur = null), B.jump(from));
    tick();
    (n.q = []), (n.cur = null);
    S().step = step;
    n.ch1Step = "";
    n.q = [{ k: "wait", t: 0 }];
    ss.sectionReset();
    for (let i = 0; i < 4; i++) tick();
    out.cut[step] = S().step;
  }
  // 55: standing in front of the robots once they turn back to the row: "?", "!", the FUR alarm, a guard
  ((n.q = []), (n.cur = null), B.jump("sneak"));
  for (let i = 0; i < 4; i++) tick();
  n.sq.x = 900;
  n.sq.y = 606;
  let mark = "";
  for (let i = 0; i < 200 && !S().guard; i++) (tick(), (mark = mark || (S().bots.find((b) => b.mark === "?") ? "?" : "")));
  out.alarm = { registered: mark, guard: !!S().guard, alarmOn: B.alarmOn() };
  // 57: in a guest's cone in costume: "?" (dashed), BLEAT · guest pops it; left in a cone too long the beard slips and
  // PRESS · beard is offered
  ((n.q = []), (n.cur = null), B.jump("lastwalk"));
  for (let i = 0; i < 4; i++) tick();
  window.SSQ.engine().enterRoom("hall", "QB");
  const g1 = B.place.PK_HALL.guests[0];
  const inCone = () => {
    for (let x = 200; x < 900; x += 20)
      for (let y = 380; y < 600; y += 20) {
        n.sq.x = x;
        n.sq.y = y;
        tick(0.01);
        if (Object.values(S().watch).some((w) => w.mark === "?")) return true;
      }
    return false;
  };
  out.cone = { seen: inCone() };
  out.cone.bleat = ss.spotsNow().some((q) => q.verb === "BLEAT" && q.cap === "guest");
  const sp = ss.spotsNow().find((q) => q.verb === "BLEAT");
  sp && sp.f();
  out.cone.popped = Object.values(S().watch).every((w) => w.mark !== "?");
  // again, with a fresh guest look, and wait without a bleat: the beard slips
  for (const w of Object.values(S().watch)) Object.assign(w, { fooled: false, seenT: 0, mark: "" });
  let slipped = false;
  for (let i = 0; i < 120 && !slipped; i++) (tick(0.05), (slipped = S().fur));
  out.cone.slipped = slipped;
  out.cone.press = ss.spotsNow().some((q) => q.verb === "PRESS");
  ss.drawFrame();
  out.cone.drew = (B.debug().drew.guests || []).some((q) => q.filled) || !Object.values(S().watch).some((w) => w.mark);
  // the chapter reset forgets pickup day
  window.SSQ.engine().resetChapter();
  out.reset = n.ch1Pickup === null;
  return out;
});
g.check("↺ in a step he controls starts that step again, him back where it started (the walls back up, the costume back on the shelf, the tape at its start)", Object.entries(more.restart).every(([k, r]) => r.step === k && r.ctrl && r.back) && more.restart.walls.walls === 0 && more.restart.dress.dress === 0 && more.restart.tape.next === "play", more.restart);
g.check("↺ in a step he does not control goes back to the last step he did", more.cut.slat === "push" && more.cut.held === "sneak" && more.cut.mirror === "practice" && more.cut.climbing === "ramp" && more.cut.found === "hide", more.cut);
g.check("55: a robot that sees him shows \"?\" first, then the FUR alarm and a guard (no music: the alarm is on)", more.alarm.registered === "?" && more.alarm.guard && more.alarm.alarmOn, more.alarm);
g.check("57: a guest's cone on him in costume shows \"?\"; BLEAT · guest pops it; too long without a bleat and the beard slips, PRESS · beard", more.cone.seen && more.cone.bleat && more.cone.popped && more.cone.slipped && more.cone.press, more.cone);
g.check("the chapter reset forgets pickup day", more.reset);
g.check("no page errors", errors.length === 0, errors);
console.log(JSON.stringify({ acts: run.acts, end: run.end }));
await g.finish("pickup");
