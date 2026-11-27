/**
 * Beats 47 to 49 of the escape, rebuilt from the story pass of 2026-11-26 (src/modules/escape.js, escape-doors.js,
 * escape-vent-art.js), at phone size:
 *   47  the player walks Squatch from home to the bay himself, Mops behind him on his trail; through each doorway, the
 *       next one outlined; the night robot patrols the bay (seen: "!", the guard, caught: the LOCKUP card and the bay
 *       again); at the vent: "Goat-sized. You keep watch.", Mops goes in, ROLL · ball.
 *   48  the switch to Mops is announced; he steps straight into his room from the big vent (round 7: no crawl); the room is dark
 *       until LIGHT · lamp; then one thing at a time, each outlined: LOOK · wall (the wall, the letter), his lines,
 *       LOOK · toy bin, LOOK · stubs (the pen strokes ST out for M), his lines, WRITE · note one line per tap and signed
 *       by the fourth; Squatch's eyes at the grille twice; (round 7: "I hope he didn't read the order form." moves to beat 49); TAKE · pink slip, close;
 *       his lines; the room is the locked picture.
 *   49  Mops crawls out with the slip in his mouth; the switch to Squatch is announced; "Mmf! Mmf mmf!", "You're
 *       gumbling again!", the thought; GRAB · pink slip; the fold (paw print inside); his lines; the crayon plan's tick.
 * Also ↺ in the tunnel and at the note (still Mops), and the locked picture is the room.
 *   node tests/escape-vent.mjs
 */
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const { ESCAPE_LINES } = await import(M("escape-lines.js"));
const W = Object.fromEntries(ESCAPE_LINES.map((l) => [l.id, l.text]));
const { tagLines } = await import(M("escape-vent-art.js"));
const g = await startGame({ port: 9787, name: "escape-vent" });
const { ctx, page, errors } = await g.open("?beat=escape:sneak", { width: 375, height: 812, isMobile: true, hasTouch: true });
await page.evaluate(() => window.__ss.lockedReady);
await page.evaluate(() => new Promise((r) => setTimeout(r, 400))); // (the vent room's picture loads)

const run = await page.evaluate(
  async ({ W }) => {
    const ss = window.__ss,
      n = ss.op,
      E = window.SSQ.engine(),
      B = window.SSQ.beat("ch1-escape"),
      d = () => B.debug(),
      S = () => n.ch1Escape;
    const out = {};
    let watch = null,
      ticks = 0;
    const tick = (s = 0.05) => (ss.tick(s), watch && ++ticks % 3 === 0 && (ss.drawFrame(), watch()));
    const until = (f, s = 30) => {
      for (let i = 0; i < s / 0.05 && !f(); i++) tick();
      return f();
    };
    const say = () => (n.cur && n.cur.k === "bub" ? n.cur.b.text : n.cur && n.cur.k === "card" ? n.cur.text : n.cur && n.cur.id ? "[" + n.cur.id + "]" : "");
    const next = () => {
      const was = n.cur;
      for (let i = 0; i < 20 && n.cur === was; i++) (tick(0.1), (n.bt = 1), ss.opTap());
      tick();
    };
    const lines = () => {
      const got = [];
      for (let i = 0; i < 30; i++) {
        until(() => (n.cur && n.cur.k !== "until" && n.cur.k !== "run") || (n.ctrl && !n.cur && !n.q.length), 20);
        if (!n.cur || n.cur.k === "until") break;
        ss.drawFrame(); // (a kid sees each one before NEXT)
        got.push(say() + (n.cur.b && n.cur.b.style === "whisper" ? " (whisper)" : ""));
        next();
      }
      return got.filter(Boolean);
    };
    const press = () => {
      tick();
      const a = ss.offerNow();
      a && a.f && a.f();
      tick();
      return a ? a.verb + " · " + a.cap : "";
    };
    const who = () => (E.playing() === "mops" ? n.mo : n.sq);
    const walk = (x, y, s = 8) => {
      ss.drawFrame();
      ss.tapAt(x, y, false);
      until(() => !n.walkTo || Math.hypot(who().x - x, who().y - y) < 6, s);
      return { x: Math.round(who().x), y: Math.round(who().y) };
    };
    try {
    // 47: home to the bay, through the doorways, Mops behind him
    out.sneak = { chip: n.ch1Chip, step: S().step, rooms: [], marks: [], gaps: [] };
    for (let k = 0; k < 4 && n.room !== "hangar"; k++) {
      ss.drawFrame();
      out.sneak.marks.push(d().drew.door);
      const door = ss.spotsNow().find((q) => q.id === "es-door");
      walk(door.x, door.y, 10);
      // (the doorway takes him through as his feet reach its opening)
      until(() => n.room !== out.sneak.rooms[out.sneak.rooms.length - 1], 1);
      out.sneak.rooms.push(n.room);
      for (let i = 0; i < 30; i++) tick();
      out.sneak.gaps.push(Math.round(Math.hypot(n.mo.x - n.sq.x, n.mo.y - n.sq.y)));
    }
    out.bay = { room: n.room, robot: !!S().robot, phase: S().robot && S().robot.phase, chip: n.ch1Chip };
    // seen by the robot: standing in its cone, "?" then "!", it pulls the alarm; caught: the LOCKUP card, the bay again
    const r = S().robot;
    Object.assign(r, { x: 400, y: 452, f: -1, phase: "patrol" });
    n.sq.x = 250;
    n.sq.y = 452;
    until(() => r.phase !== "patrol", 3);
    out.seen = { phase: r.phase };
    until(() => S().guard, 10);
    out.seen.guard = !!S().guard;
    until(() => n.cur && n.cur.k === "card", 20);
    out.seen.card = n.cur && n.cur.k === "card" ? n.cur.text || n.cur.id : "";
    next();
    out.seen.joke = lines(); // (the LOCKUP card's joke line, if any)
    for (let i = 0; i < 20; i++) tick();
    out.seen.after = { step: S().step, room: n.room, guard: !!S().guard };
    // to the vent while the robot is busy elsewhere (the walk round its patrol is the player's)
    S().robot.phase = "asleep";
    walk(60, 570, 8);
    walk(636, 570, 8);
    walk(636, 330, 8);
    S().robot.phase = "patrol";
    S().robot.x = 250;
    walk(B.place.BAY.ventStand.x, B.place.BAY.ventStand.y, 8);
    out.vent = { lines: lines(), step: S().step, chip: n.ch1Chip };
    out.vent.press = press();
    // 48
    until(() => n.cur && n.cur.k === "card", 20);
    out.inside = { card: say(), by: n.cur && n.cur.by };
    next();
    until(() => n.ctrl, 5);
    // (round 7, r5 13:29, q: 125: no crawl; the big vent opens straight into his room)
    out.tunnel = { step: S().step, chip: n.ch1Chip, playing: E.playing(), vent: S().vent };
    until(() => S().step === "lamp", 2);
    ss.drawFrame();
    out.room = { step: S().step, lamp: d().drew.lamp, picture: d().drew.picture, next: d().drew.next, mark: !!d().drew.mark, chip: n.ch1Chip };
    const at = B.place.VENT_ROOM.at;
    const thing = (x) => (walk(x, at.y, 8), press());
    out.room.lampPress = thing(at.lamp);
    let eyes = 0;
    watch = () => d().drew && d().drew.eyes && (eyes = 1);
    until(() => S().step === "wall" && n.ctrl, 8);
    out.room.eyes1 = eyes;
    ss.drawFrame();
    out.room.lit = d().drew.lamp;
    out.wall = { press: thing(at.wall), said: lines() };
    out.toys = { chip: "", press: thing(at.toys), said: lines() };
    out.stubs = { press: thing(at.stubs) };
    // the stubs' close-up: the pen strokes ST out and writes M
    until(() => n.cur && n.cur.id === "esstubs", 3);
    for (let i = 0; i < 70; i++) tick();
    ss.drawFrame();
    const panel = window.SSQ.cutaway && window.SSQ.cutaway.last ? window.SSQ.cutaway.last() : null;
    out.stubs.panel = panel;
    out.stubs.said = lines();
    // WRITE · note, one line a tap; ↺ at the note puts it back to no lines, still Mops
    walk(at.note, at.y, 8);
    out.note = { press: press(), lines: [] };
    ss.drawFrame();
    out.note.lines.push(d().drew.note && d().drew.note.shown.length);
    ss.sectionReset();
    for (let i = 0; i < 4; i++) tick();
    out.note.restart = { step: S().step, lines: S().noteLines, playing: E.playing() };
    walk(at.note, at.y, 8);
    for (let k = 0; k < 4; k++) {
      press();
      ss.drawFrame();
      out.note.lines.push(d().drew.note ? d().drew.note.shown.length : -1);
    }
    out.note.shown = d().drew.note && d().drew.note.shown;
    eyes = 0;
    out.note.after = lines();
    out.note.eyes2 = eyes;
    watch = null;
    out.slip = { step: S().step, chip: n.ch1Chip, press: thing(at.slip), said: lines() };
    // 49
    until(() => n.room === "hangar", 10);
    out.out = { slip: S().slip, said: lines(), step: S().step, chip: n.ch1Chip, playing: E.playing() };
    n.sq.x = n.mo.x + 30;
    n.sq.y = n.mo.y;
    out.out.press = press();
    let fold = false,
      tickMark = false;
    watch = () => (d().drew && d().drew.fold && (fold = true), d().drew && d().drew.plan && d().drew.plan.ticks.door && (tickMark = true));
    out.out.after = lines();
    until(() => tickMark || S().step === "tohall", 5);
    watch = null;
    out.out.fold = fold;
    out.out.tick = tickMark;
    out.out.folded = S().folded;
    out.words = d().words;
    // 50: walking out of the bay, Mops a step behind him never boxes him in: a tap finds a way round the bay's things
    until(() => S().step === "tohall" && n.ctrl, 8);
    ss.drawFrame();
    ss.tapAt(300, 560, false);
    out.walkOut = { step: S().step, path: !!(n.walkTo && n.walkTo.path && n.walkTo.path.length), walkTo: n.walkTo, ctrl: n.ctrl, cur: n.cur && n.cur.k, sq: [n.sq.x, n.sq.y], mo: [n.mo.x, n.mo.y], room: n.room };
    } catch (err) {
      out.err = String(err.stack).slice(0, 600);
    }
    return out;
  },
  { W },
);
const o = run;
g.check("the run went to its end", !o.err, o.err);
const w = (...ids) => ids.map((k) => W[k]);
g.check("47: the goal is to sneak to the big vent; he walks there himself through each doorway (home, the hall, the hallway, the bay), the next one outlined", o.sneak.chip === W["chip-sneak"] && JSON.stringify(o.sneak.rooms) === JSON.stringify(["hall", "passage", "hangar"]) && JSON.stringify(o.sneak.marks) === JSON.stringify(["hall", "passage", "hangar"]), o.sneak);
g.check("47: Mops walks behind him the whole way (a step or two back)", o.sneak.gaps.every((x) => x < 130), o.sneak.gaps);
g.check("47: in the bay at night the robot is on its rounds", o.bay.room === "hangar" && o.bay.robot && o.bay.phase === "patrol", o.bay);
g.check("47: seen by the robot, it goes for the alarm and a guard comes; caught: the LOCKUP card, then the bay again (the sneak step)", o.seen.phase !== "patrol" && o.seen.guard && !!o.seen.card && o.seen.after.step === "sneak" && o.seen.after.room === "hangar" && !o.seen.after.guard, o.seen);
g.check("47: at the vent, \"Goat-sized. You keep watch.\"; Mops goes in; ROLL · ball", JSON.stringify(o.vent.lines) === JSON.stringify(w("mops-goat-sized")) && o.vent.step === "ball" && o.vent.chip === W["chip-ball"] && o.vent.press === W["button-ball"], o.vent);
g.check("48: the switch to Mops is announced, with why", o.inside.card === "You are MOPS now." && o.inside.by === W["switch-vent"], o.inside);
g.check("48 (round 7, r5 13:29, q: 125): no crawl: as Mops he steps straight from the big vent into his dark room (LIGHT · lamp next)", o.tunnel.step === "lamp" && o.tunnel.vent === "room" && o.tunnel.chip === W["chip-lamp"] && o.tunnel.playing === "mops", o.tunnel);
g.check("48: the room is the locked picture, dark until LIGHT · lamp (the lamp outlined)", o.room.picture && o.room.lamp === false && o.room.next === "es-lamp" && o.room.mark && o.room.chip === W["chip-lamp"] && o.room.lampPress === W["button-lamp"] && o.room.lit, o.room);
g.check("48: Squatch's eyes at the grille, in their small round picture, after the lamp and after the note", o.room.eyes1 && o.note.eyes2, { a: o.room.eyes1, b: o.note.eyes2 });
g.check("48: LOOK · wall: the wall, the letter, then his lines", o.wall.press === W["button-wall"] && JSON.stringify(o.wall.said) === JSON.stringify(["[eswall]", "[esletter]", ...w("mops-asked", "mops-cooks")]), o.wall);
g.check("48: LOOK · toy bin: the twin rocket under the board", o.toys.press === W["button-toys"] && JSON.stringify(o.toys.said) === JSON.stringify(["[estoys]"]), o.toys);
g.check("48: LOOK · stubs: the tags, the stubs, his chart; the pen strokes ST out and writes M; then his lines", o.stubs.press === W["button-stubs"] && o.stubs.panel && o.stubs.panel.crossed && o.stubs.panel.m && JSON.stringify(o.stubs.said) === JSON.stringify(["[esstubs]", ...w("mops-wrong", "mops-one-kind")]), o.stubs);
g.check("48: WRITE · note: one line a tap, signed by the fourth, word for word", o.note.press === W["button-note"] && JSON.stringify(o.note.lines) === JSON.stringify([1, 1, 2, 3, 4]) && JSON.stringify(o.note.shown) === JSON.stringify(w("note-1", "note-2", "note-3", "note-sign")), o.note);
g.check("48: ↺ at the note starts it again (no lines), still Mops", o.note.restart.step === "note" && o.note.restart.lines === 0 && o.note.restart.playing === "mops", o.note.restart);
{
  // (round 7, r5 13:44, 13:57 and 14:17, q: 133)
  const CA = await import(M("cutaway.js"));
  const VA = readFileSync(M("escape-vent-art.js"), "utf8");
  const slipFn = VA.slice(VA.indexOf("function slipDeskPanel"), VA.indexOf("export const VENT_PANELS"));
  g.check("48 (round 7, r5 13:44): every close-up at the vent desk waits for NEXT (none plays by itself)", ["eswall", "esletter", "estoys", "esstubs", "esslipdesk"].every((id) => CA.cutawaySteps(id).length > 0 && CA.cutawaySteps(id).every((st) => !st.auto)));
  g.check("48 (round 7, r5 13:57): the pay stub just says the kind and who paid", W["stub"] === "STARS CAKES. A NEW KIND." && W["stub-paid"] === "Paid by: MOPS", [W["stub"], W["stub-paid"]]);
  g.check("48 (round 7, r5 14:17): no Squatch eyes in the pink slip's close-up", !/drawEyesInset/.test(slipFn));
}
g.check("48 (round 7, r5 14:24, q: 133): no whisper at the grate any more (his worry moves to beat 49)", JSON.stringify(o.note.after) === "[]", o.note.after);
g.check("48: TAKE · pink slip: close, then his lines", o.slip.chip === W["chip-slip-take"] && o.slip.press === W["button-slip-take"] && JSON.stringify(o.slip.said.slice(0, 3)) === JSON.stringify(["[esslipdesk]", ...w("mops-slip", "mops-code-pen")]), o.slip);
g.check("49: out in the bay, the slip in his mouth; the switch to Squatch announced; his thought \"I hope he didn't read the order form.\" (round 7, q: 133); \"Mmf! Mmf mmf!\", \"You're gumbling again!\", the thought", o.out.slip === "mops" && JSON.stringify(o.slip.said.slice(3)) === JSON.stringify(["You are SQUATCH now.", W["sq-notice"] + " (whisper)", ...w("mops-mmf", "sq-gumbling"), W["sq-get-it"] + " (whisper)"]) && o.out.playing === "sq", { said: o.slip.said, out: o.out });
g.check("49: GRAB · pink slip; the fold (paw print inside); \"Got it! The code is on there.\", \"I'll carry it.\"; the plan's tick on the door", o.out.chip === W["chip-grab"] && o.out.press === W["button-grab"] && o.out.fold && o.out.folded && JSON.stringify(o.out.after) === JSON.stringify(w("mops-got-it", "sq-carry")) && o.out.tick, o.out);
g.check("the close-ups show their words (the board, the flyers, MARS, NO, TOYS, the note and its signature, the stubs)", ["IDEAS FOR GUARDIANS", "HAVE YOU SEEN?", "MARS", "NO", "TOYS", W["note-2"], W["note-3"], W["note-sign"], ...tagLines(W["blank-tag"])].every((x) => (o.words || []).includes(x)), o.words);
g.check("50: out of the bay, a tap on the floor finds a way round (Mops behind him is not in the way)", o.walkOut && o.walkOut.step === "tohall" && o.walkOut.path, o.walkOut);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("escape-vent");
