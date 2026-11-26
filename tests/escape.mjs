/**
 * Beats 43 to 52, the escape (src/modules/escape.js), at phone size, from night one's end to pickup day's start. In
 * order, each checked as the player meets it:
 *   - the card "Six days later" waits for NEXT;
 *   - the robots tease Mops in the loading bay (no Squatch there; three robots); both lines wait for NEXT;
 *   - home: the pancake brochure is on the wall and glows while Mops talks about it; the wordless thought pictures (the
 *     crate to the ship, the locked office door) play by themselves; Squatch's two lines; his thought of the sheet
 *     going into the vent;
 *   - the bay at night: ROLL · ball at the vent, the vent glows; a robot patrols with its cone; rolled up at the vent,
 *     the picture goes inside;
 *   - the vent: Mops's back to the grille; the detective wall and the Mars letter (each waits for NEXT, readable sizes);
 *     the pink sheet glows during "I hope Mops doesn't notice..."; the new Guardian note is written and signed;
 *   - Mops comes out with the sheet in his mouth; GRAB · pink slip; it goes to Squatch's paw;
 *   - the hallway: Mops faces away; the sheet's close-up shows the code 169556; the keypad: a wrong key buzzes and the
 *     screen clears (no stars lost), the keyboard's digits work too, 169556 opens the door;
 *   - the office: RETURN · empty crate at the desk; the site: "Order new box" does nothing, "Return empty crate" books;
 *   - the snack counter: Mops's line; four snacks into the bag; Squatch's Guardians line; the plate; the last two on it
 *     (a tap on the plate works too); hearts and no line from Mops;
 *   - home: OPEN · closet, PUT IN · box, the box close-up, the slip in the box, the door shut, asleep in bed, beat 53.
 * Also: the night robot's one capture rule (seen: "!", it pulls the FUR alarm, a guard; rolled up: "They lost you.";
 * caught: the LOCKUP card and the step again), ↺ in every step, the chapter reset forgets the escape, the words are the
 * lines file's, and the old code is gone.
 *   node tests/escape.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const { ESCAPE_LINES } = await import(M("escape-lines.js"));
const P = await import(M("escape-place.js"));
const W = Object.fromEntries(ESCAPE_LINES.map((l) => [l.id, l.text]));
const g = await startGame({ port: 9781, name: "escape" });

// ---------- the words, without a browser ----------
const walk = readFileSync(join(root, "docs", "CH1-STORY-WALKTHROUGH.md"), "utf8");
const body = walk.slice(walk.indexOf("<!-- /section-index -->")),
  beats = body.slice(body.indexOf('### 43. "Six days later"'), body.indexOf("## Pickup day: leaving Stormtop"));
const story = ESCAPE_LINES.filter((l) => l.status === "pending" && l.source.includes("WALKTHROUGH"));
g.check("every pending story line is the walkthrough's, word for word", story.length >= 18 && story.every((l) => beats.includes(l.text.split(". ")[0])), story.filter((l) => !beats.includes(l.text.split(". ")[0])).map((l) => l.text));
g.check("lines still waiting for Brian stay pending (none marked approved without his yes)", ESCAPE_LINES.filter((l) => l.status === "approved").every((l) => /Brian/.test(l.source)), ESCAPE_LINES.filter((l) => l.status === "approved"));
g.check("the office code is 169556 (Brian, chat, 2026-11-26), six digits", P.OFFICE_CODE === "169556");
g.check("the keypad's keys are a finger wide on a phone (120 game px, about 43 phone px)", P.KEYPAD.r * 2 >= 120 && P.KEYPAD.step >= 128, P.KEYPAD);
// the old code for these beats is gone from src/game
const game = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
const gone = ["ch1TeaseLines", "ch1EscapeHome", "ch1ToVent", "ch1RollVent", "ch1VentLines", "ch1GrabPinkNow", "ch1ToPad", "ch1PadPress", "ch1OfficeIn", "ch1Booked", "ch1AllStart", "ch1BagSnack", "ch1LeaveFood", "ch1HideSlip", "4723"];
g.check("the old escape code (and the old code 4723) is gone from src/game", gone.every((f) => !game.includes(f)), gone.filter((f) => game.includes(f)));

const { ctx, page, errors } = await g.open("?beat=escape", { width: 375, height: 812, isMobile: true, hasTouch: true });
await page.evaluate(() => window.__ss.lockedReady);

// ---------- the whole escape, step by step ----------
const run = await page.evaluate(
  async ({ W, CODE }) => {
    const ss = window.__ss,
      n = ss.op,
      B = window.SSQ.beat("ch1-escape"),
      P = B.place,
      d = () => B.debug(),
      S = () => d().state;
    const out = {};
    const tick = (s = 0.05) => ss.tick(s);
    const until = (f, s = 30) => {
      for (let i = 0; i < s / 0.05 && !f(); i++) tick();
      return f();
    };
    const say = () => (n.cur && n.cur.k === "bub" ? n.cur.b.text : n.cur && n.cur.k === "card" ? n.cur.text : "");
    // NEXT, the way a kid presses it: after a moment, and again until the line is gone
    const next = () => {
      const was = n.cur;
      for (let i = 0; i < 20 && n.cur === was; i++) (tick(0.1), (n.bt = 1), ss.opTap());
      tick();
    };
    const waitsForNext = () => {
      const was = n.cur;
      for (let i = 0; i < 80; i++) tick();
      return n.cur === was;
    };
    const press = () => {
      tick();
      const a = ss.offerNow();
      a && a.f && a.f();
      tick();
      return a ? a.verb + " · " + a.cap : "";
    };
    const tap = (x, y) => (ss.drawFrame(), ss.tapAt(x, y, false), tick());
    // 43
    out.card = say();
    out.cardWaits = waitsForNext();
    next();
    // 44
    until(() => n.cur && n.cur.k === "bub");
    ss.drawFrame();
    out.tease = { room: n.room, sq: n.sqPose, robots: d().drew && d().drew.robots, line: say(), who: n.cur.b.who, waits: waitsForNext() };
    next();
    out.tease.mops = say();
    next();
    out.bleat = d().sounds.includes("mops-bleat");
    // 45
    until(() => n.cur && n.cur.k === "bub");
    ss.drawFrame();
    out.home = { room: n.room, line: say(), glow: !!(d().drew && d().drew.brochure && d().drew.brochure.glow) };
    next();
    const thinks = [];
    until(() => (S().think && !thinks.includes(S().think.kind) && thinks.push(S().think.kind), n.cur && n.cur.k === "bub"), 20);
    out.home.thinks = thinks;
    out.home.autoThink = !n.cur || n.cur.k === "bub"; // (they played by themselves, to the next line)
    out.sq1 = say();
    next();
    out.sq2 = say();
    next();
    until(() => S().think, 5);
    out.sqThink = S().think && S().think.kind;
    // 47
    until(() => S().step === "ball" && n.ctrl, 120);
    ss.drawFrame();
    out.ball = { room: n.room, night: !!n.ch1Night, chip: n.ch1Chip, robot: !!S().robot, cones: (d().drew.cones || []).length };
    // the button comes up by the vent only (the goal), not out in the bay
    n.sq.x = 420;
    n.sq.y = 560;
    tick();
    const away = ss.offerNow();
    n.sq.x = P.BAY.ventStand.x;
    n.sq.y = P.BAY.ventStand.y;
    out.ball.awayOffer = away ? away.verb : "";
    out.ball.press = press();
    out.ball.pose = n.sqPose;
    // 48
    until(() => n.cur && n.cur.k === "cutaway", 20);
    out.vent = { room: n.room, mopsFacesAway: n.mo.f > 0 && n.mo.x > n.sq.x };
    const panel = () => window.SSQ.cutaway.last();
    ss.drawFrame();
    out.vent.wall = { id: n.cur.id, waits: waitsForNext() };
    ss.drawFrame();
    out.vent.wall.drew = panel();
    next();
    ss.drawFrame();
    out.vent.letter = { id: n.cur.id, waits: waitsForNext() };
    ss.drawFrame();
    out.vent.letter.drew = panel();
    next();
    ss.drawFrame();
    out.vent.notice = { line: say(), style: n.cur && n.cur.b.style, glow: !!(d().drew && d().drew.glowSlip), sheet: !!(d().drew && d().drew.sheet) };
    next();
    until(() => n.cur && n.cur.k === "cutaway", 5);
    for (let i = 0; i < 90; i++) tick();
    ss.drawFrame();
    out.vent.note = { id: n.cur && n.cur.id, drew: panel() };
    next();
    // 49
    until(() => n.cur && n.cur.k === "bub", 20);
    out.out = { room: n.room, line: say(), slip: S().slip };
    next();
    out.out.think = say();
    out.out.style = n.cur && n.cur.b.style;
    next();
    until(() => S().step === "grab" && n.ctrl, 10);
    out.grab = { press: press() };
    until(() => S().slip === "paw", 5);
    out.grab.slip = S().slip;
    // 50
    until(() => n.cur && n.cur.k === "cutaway", 60);
    ss.drawFrame();
    out.slipview = { id: n.cur.id, drew: panel(), room: n.room, mopsAway: n.mo.f < 0 && n.mo.x < n.sq.x, waits: waitsForNext() };
    next();
    until(() => S().step === "pad" && n.ctrl, 10);
    ss.drawFrame();
    out.pad = { chip: n.ch1Chip, keys: Object.keys((d().drew.pad || {}).keys || {}).length };
    const stars = n.stars;
    const key = (k) => tap(P.keyAt(k).x, P.keyAt(k).y);
    key("9");
    ss.drawFrame();
    out.pad.buzz = !!(d().drew.pad && d().drew.pad.buzz) && d().sounds.includes("bzzt");
    for (let i = 0; i < 20; i++) tick();
    out.pad.cleared = S().typed === "";
    out.pad.stars = n.stars === stars;
    // the first digit from the keyboard, the rest by touch
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Digit" + CODE[0], key: CODE[0] }));
    tick();
    out.pad.keyboard = S().typed === CODE[0];
    for (const k of CODE.slice(1)) key(k);
    out.pad.typed = S().typed;
    // 51
    until(() => S().step === "computer" && n.ctrl, 20);
    out.office = { room: n.room, chip: n.ch1Chip };
    n.sq.x = P.OFFICE.sq.x;
    n.sq.y = P.OFFICE.sq.y;
    out.office.press = press();
    ss.drawFrame();
    out.site = { open: S().cu === "site", drew: d().drew.site ? Object.keys(d().drew.site) : null };
    tap((P.SITE.order.x0 + P.SITE.order.x1) / 2, (P.SITE.order.y0 + P.SITE.order.y1) / 2);
    out.site.orderNothing = S().step === "site";
    tap((P.SITE.ret.x0 + P.SITE.ret.x1) / 2, (P.SITE.ret.y0 + P.SITE.ret.y1) / 2);
    out.site.booked = S().bookAt >= 0;
    // 52
    until(() => n.cur && n.cur.k === "bub", 60);
    out.bar = { room: n.room, line: say() };
    next();
    until(() => S().step === "snacks" && n.ctrl, 5);
    const snack = (i) => (tap(P.SNACKS.at[i].x, P.SNACKS.at[i].y), until(() => !S().snacks.carry, 3));
    for (const i of [0, 1, 2, 3]) snack(i);
    out.bar.bag = S().snacks.bag;
    until(() => n.cur && n.cur.k === "bub", 3);
    out.bar.guardians = say();
    next();
    until(() => S().step === "food" && n.ctrl, 5);
    out.bar.plate = S().snacks.plate;
    snack(4);
    tap(P.SNACKS.plate.x, P.SNACKS.plate.y - 30); // the last one: a tap on the plate
    until(() => !S().snacks.carry, 3);
    out.bar.onPlate = S().snacks.onPlate.length;
    const lines = [];
    until(() => (n.cur && n.cur.k === "bub" && lines.push(n.cur.b.who), S().step === "closet" && n.ctrl), 60);
    out.bar.mopsSaid = lines.includes("mops");
    out.bar.hearts = d().steps.includes("hearts");
    // home
    out.home2 = { room: n.room, chip: n.ch1Chip };
    n.sq.x = P.HOME.closet.x;
    n.sq.y = P.HOME.closet.y;
    out.home2.open = press();
    out.home2.wardrobe = n.wardrobe;
    out.home2.put = press();
    until(() => n.cur && n.cur.k === "cutaway", 5);
    for (let i = 0; i < 50; i++) tick();
    ss.drawFrame();
    out.home2.box = { id: n.cur && n.cur.id, drew: panel() };
    next();
    until(() => n.sqPose === "sleep", 20);
    out.home2.sleep = n.sqPose === "sleep";
    out.home2.shut = n.wardrobe === "closed";
    out.home2.slip = S().slip;
    until(() => n.ch1Step === "pack1", 20);
    out.end = { step: n.ch1Step, active: B.active() };
    out.words = d().words;
    return out;
  },
  { W, CODE: P.OFFICE_CODE },
);
g.check('43: the card "Six days later" waits for NEXT', run.card === W["card-six-days"] && run.cardWaits, run.card);
g.check("44: the loading bay, three robots, no Squatch; the robot's line waits for NEXT", run.tease.room === "hangar" && run.tease.sq === "hidden" && run.tease.robots === 3 && run.tease.line === W["robot-replaced"] && run.tease.who === "robot" && run.tease.waits, run.tease);
g.check("44: Mops answers, word for word, and bleats (the mops-bleat sound pick)", run.tease.mops === W["mops-lying"] && run.bleat, run.tease);
g.check("45: home; the brochure on the wall glows while Mops talks about the pancake place", run.home.room === "closet" && run.home.line === W["mops-pancake"] && run.home.glow, run.home);
g.check("45: his wordless thought pictures (the crate to the ship, the locked office door) play by themselves", JSON.stringify(run.home.thinks) === '["crate","door"]' && run.home.autoThink, run.home);
g.check("46: Squatch's two lines, then his thought of the sheet going into the vent", run.sq1 === W["sq-slip"] && run.sq2 === W["sq-vent"] && run.sqThink === "vent", [run.sq1, run.sq2, run.sqThink]);
g.check("47: the bay at night, the goal, a patrolling robot with its cone", run.ball.room === "hangar" && run.ball.night && run.ball.chip === W["chip-ball"] && run.ball.robot && run.ball.cones === 1, run.ball);
g.check("47: ROLL · ball comes up by the vent; he rolls into the L2 ball", run.ball.awayOffer === "" && run.ball.press === W["button-ball"] && run.ball.pose === "ball", run.ball);
g.check("48: inside the vent Mops has his back to Squatch at the grille", run.vent.room === "duct" && run.vent.mopsFacesAway, run.vent);
g.check("48: the detective wall (MARS, HAVE YOU SEEN?, NO) and the Mars letter wait for NEXT", run.vent.wall.id === "eswall" && run.vent.wall.waits && run.vent.letter.id === "esletter" && run.vent.letter.waits, run.vent);
g.check("48: the letter reads on a phone (its words 38 game px, about 14 phone px)", run.vent.letter.drew && run.vent.letter.drew.size >= 38 && run.vent.letter.drew.lines.length >= 3, run.vent.letter.drew);
g.check('48: "I hope Mops doesn\'t notice..." is a thought, with the pink sheet on the desk glowing', run.vent.notice.line === W["sq-notice"] && run.vent.notice.style === "whisper" && run.vent.notice.glow && run.vent.notice.sheet, run.vent.notice);
g.check("48: the new Guardian note is written in full and signed — The Guardians, a white hair on it", run.vent.note.id === "esnote" && run.vent.note.drew.shown === W.note && run.vent.note.drew.signed && run.vent.note.drew.hair, run.vent.note);
g.check("49: Mops comes out with the sheet in his mouth; his line; Squatch's thought", run.out.room === "hangar" && run.out.slip === "mops" && run.out.line === W["mops-hurry"] && run.out.think === W["sq-get-it"] && run.out.style === "whisper", run.out);
g.check("49: GRAB · pink slip, and the slip goes to his paw", run.grab.press === W["button-grab"] && run.grab.slip === "paw", run.grab);
g.check("50: in the hallway Mops faces away; the sheet's close-up shows the code (and waits for NEXT)", run.slipview.room === "passage" && run.slipview.mopsAway && run.slipview.id === "esslip" && run.slipview.drew.code === "169556" && run.slipview.waits, run.slipview);
g.check("50: the keypad: the goal, ten keys", run.pad.chip === W["chip-code"] && run.pad.keys === 10, run.pad);
g.check("50: a wrong key buzzes, the screen clears, no stars are lost", run.pad.buzz && run.pad.cleared && run.pad.stars, run.pad);
g.check("50: the keyboard's digits work, and 169556 opens the door", run.pad.keyboard && run.pad.typed === "169556", run.pad);
g.check("51: the office, RETURN · empty crate at the desk", run.office.room === "office" && run.office.chip === W["chip-crate"] && run.office.press === W["button-computer"], run.office);
g.check('51: the site: "Order new box" does nothing, "Return empty crate" books the crate', run.site.open && run.site.orderNothing && run.site.booked, run.site);
g.check("52: the snack counter; Mops's line; four into the bag; Squatch's Guardians line", run.bar.room === "hall" && run.bar.line === W["mops-all"] && run.bar.bag === 4 && run.bar.guardians === W["sq-guardians"], run.bar);
g.check("52: the Guardians' plate, the last two on it (a tap on the plate works); hearts, and Mops says nothing", run.bar.plate && run.bar.onPlate === 2 && run.bar.hearts && !run.bar.mopsSaid, run.bar);
g.check("52: home, OPEN · closet, PUT IN · box", run.home2.room === "closet" && run.home2.chip === W["chip-slip"] && run.home2.open === W["button-closet"] && run.home2.wardrobe === "open" && run.home2.put === W["button-box"], run.home2);
g.check("52: the box close-up (MY GARDIAN BOX, MY GUARDIANS): the slip goes under the notes", run.home2.box.id === "esbox" && run.home2.box.drew.tucked && run.home2.box.drew.label === "MY GARDIAN BOX" && run.home2.box.drew.title === "MY GUARDIANS", run.home2.box);
g.check("52: the slip is in the box, the closet shut, Squatch asleep, then beat 53 (pack the crate)", run.home2.slip === "box" && run.home2.shut && run.home2.sleep && run.end.step === "pack1" && !run.end.active, { home: run.home2, end: run.end });
g.check("the drawings show the walkthrough's words", ["IDEAS FOR GUARDIANS", "HAVE YOU SEEN?", "MARS", "NO", "TOYS", "MOON PIES", "Order new box", "Return empty crate", "169556", W["note-sign"]].every((w) => run.words.includes(w)), run.words);

// ---------- the night robot and the one capture rule ----------
const rule = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    B = window.SSQ.beat("ch1-escape"),
    P = B.place,
    S = () => B.debug().state;
  const tick = (s = 0.05) => ss.tick(s);
  const until = (f, s = 30) => {
    for (let i = 0; i < s / 0.05 && !f(); i++) tick();
    return f();
  };
  const jump = () => ((n.q = []), (n.cur = null), ss.ch1JumpBeat(47), tick());
  const out = {};
  jump();
  // he stands by the vent; the robot comes along, looks up at the vent and sees him
  n.sq.x = P.BAY.ventStand.x - 80;
  n.sq.y = P.BAY.ventStand.y + 30;
  out.seen = until(() => S().robot.phase !== "patrol", 30) && S().robot.phase;
  ss.drawFrame();
  out.bang = until(() => S().robot.phase === "run", 2);
  out.alarm = until(() => S().robot.phase === "pull", 10) && ss.secOn ? true : !!window.SSQ.engine().secOn();
  out.guard = window.SSQ.engine().secOn();
  // rolled up where he stands: hidden, the guard gives up ("They lost you."), the robot goes back to its rounds
  tick();
  const a = ss.offerNow();
  out.anyRoll = a ? a.verb : "";
  a && a.f();
  until(() => !window.SSQ.engine().secOn(), 20);
  out.lost = !window.SSQ.engine().secOn() && n.sqPose === "ball";
  out.back = until(() => S().robot.phase === "patrol", 20);
  // caught: standing still in the open, the guard reaches him: the LOCKUP card, then the step again
  jump();
  n.sq.x = P.BAY.ventStand.x - 80;
  n.sq.y = P.BAY.ventStand.y + 30;
  until(() => n.cur && n.cur.id === "jail", 60);
  out.lockup = !!(n.cur && n.cur.id === "jail");
  for (let i = 0; i < 40 && n.cur; i++) ((n.bt = 1), ss.opTap(), tick(0.1));
  until(() => n.ctrl && !n.cur && !n.q.length, 10);
  out.after = { step: S() && S().step, ch1Step: n.ch1Step, robot: S() && S().robot && S().robot.phase, room: n.room };
  return out;
});
g.check("47: the robot sees him standing: \"!\" at once, it rolls to the FUR alarm, a guard comes", rule.seen === "bang" && rule.bang && rule.guard, rule);
g.check("47: rolled up anywhere while the guard is out (ROLL · ball), he is lost; the robot goes back to its rounds", rule.anyRoll === "ROLL" && rule.lost && rule.back, rule);
g.check("47: caught standing in the open: the LOCKUP card, then the ball step again", rule.lockup && rule.after.step === "ball" && rule.after.ch1Step === "es-ball" && rule.after.room === "hangar", rule);

// ---------- ↺ in every step, and the chapter reset ----------
const restarts = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    B = window.SSQ.beat("ch1-escape"),
    S = () => B.debug().state;
  const tick = (s = 0.05) => ss.tick(s);
  const out = {};
  for (const [beat, step] of [
    [47, "ball"],
    [48, "grab"],
    [50, "pad"],
    [51, "computer"],
    [52, "snacks"],
  ]) {
    ((n.q = []), (n.cur = null), ss.ch1JumpBeat(beat));
    for (let i = 0; i < 4; i++) tick();
    // something changes in the step, then ↺
    step === "pad" && ((S().typed = "16"), tick());
    step === "snacks" && ((S().snacks.bag = 2), (S().snacks.gone = { 0: 1, 1: 1 }));
    n.sq.x += 40;
    ss.sectionReset();
    for (let i = 0; i < 4; i++) tick();
    out[step] = { step: S().step, typed: S().typed, bag: S().snacks.bag, ctrl: n.ctrl };
  }
  // between steps: the vent's cutscene goes back to the ball step
  ((n.q = []), (n.cur = null), ss.ch1JumpBeat(47));
  tick();
  n.sq.x = B.place.BAY.ventStand.x;
  n.sq.y = B.place.BAY.ventStand.y;
  tick();
  ss.offerNow().f();
  for (let i = 0; i < 80 && S().step !== "vent"; i++) tick();
  out.between = S().step;
  ss.sectionReset();
  for (let i = 0; i < 4; i++) tick();
  out.betweenAfter = { step: S().step, room: n.room, ctrl: n.ctrl };
  window.__ss.ch1JumpBeat(22);
  out.reset = n.ch1Escape === null || n.ch1Escape === undefined;
  return out;
});
g.check("↺ in each step starts that step again (the keypad clears, the snacks come back)", ["ball", "grab", "pad", "computer", "snacks"].every((k) => restarts[k].step === k && restarts[k].ctrl) && restarts.pad.typed === "" && restarts.snacks.bag === 0, restarts);
g.check("↺ between steps (inside the vent) goes back to the ball step", restarts.between === "vent" && restarts.betweenAfter.step === "ball" && restarts.betweenAfter.room === "hangar" && restarts.betweenAfter.ctrl, restarts);
g.check("a jump back to Day 2 forgets the escape", restarts.reset, restarts);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("escape");
