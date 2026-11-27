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
// (the walkthrough's words, pending or approved since: Brian approved the written ones as written, 2026-11-26)
const story = ESCAPE_LINES.filter((l) => (l.status === "pending" || l.status === "approved") && l.source.includes("WALKTHROUGH"));
g.check("every story line from the walkthrough is its words, word for word (the whole line)", story.length >= 10 && story.every((l) => beats.includes(l.text)), story.filter((l) => !beats.includes(l.text)).map((l) => l.text));
g.check("lines still waiting for Brian stay pending (none marked approved without his yes)", ESCAPE_LINES.filter((l) => l.status === "approved").every((l) => /Brian/.test(l.source)), ESCAPE_LINES.filter((l) => l.status === "approved"));
g.check("the office code is 169556 (Brian, chat, 2026-11-26), six digits", P.OFFICE_CODE === "169556");
g.check("the keypad's keys are a finger wide on a phone (120 game px, about 43 phone px)", P.KEYPAD.r * 2 >= 120 && P.KEYPAD.step >= 128, P.KEYPAD);
// the scripted walks in the office and the bay go round their things, step by step
{
  const W = await import(M("bay-watch.js"));
  const walkClear = (pts, solids) => {
    const bad = [];
    for (let k = 1; k < pts.length; k++)
      for (let u = 0; u <= 1; u += 0.01) {
        const x = pts[k - 1].x + (pts[k].x - pts[k - 1].x) * u,
          y = pts[k - 1].y + (pts[k].y - pts[k - 1].y) * u;
        solids.some((b) => x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) && bad.length < 3 && bad.push([Math.round(x), Math.round(y)]);
      }
    return bad;
  };
  const office = walkClear([P.OFFICE.sq, ...P.OFFICE.out, P.OFFICE.door], P.OFFICE.solids);
  const bay = [];
  const spots = [P.BAY.ventStand, P.BAY.mopsVent, ...P.BAY.toAlarm, ...P.BAY.toDock, W.BAY_DOOR.in, W.BAY_DOOR.round, { x: P.BAY.patrol.x0, y: P.BAY.patrol.y }, { x: P.BAY.patrol.x1, y: P.BAY.patrol.y }].filter((q) => W.BAY_SOLIDS.some((b) => q.x > b.x0 && q.x < b.x1 && q.y > b.y0 && q.y < b.y1));
  g.check("the walk out of the office goes round the desk and chair; the walk into the bay round its things; nobody stands in them", office.length === 0 && bay.length === 0 && spots.length === 0, { office, bay, spots });
  g.check("rolling up counts as at the vent over the whole of the ROLL button's circle (one number)", typeof P.BAY.ventReach === "number" && P.BAY.ventReach >= 50);
}
// the old code for these beats is gone from src/game
const game = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
const gone = ["ch1TeaseLines", "ch1EscapeHome", "ch1ToVent", "ch1RollVent", "ch1VentLines", "ch1GrabPinkNow", "ch1ToPad", "ch1PadPress", "ch1OfficeIn", "ch1Booked", "ch1AllStart", "ch1BagSnack", "ch1LeaveFood", "ch1HideSlip", "4723"];
g.check("the old escape code (and the old code 4723) is gone from src/game", gone.every((f) => !game.includes(f)), gone.filter((f) => game.includes(f)));
// the code is typed in three places (the keypad's, night one's close-up in 14-ch1-day2.js, the old keypad picture in
// 50-story-frame.js): they must be the same digits
g.check("the office code is the same everywhere it is drawn", game.includes(`CH1_OFFICE_CODE = "${P.OFFICE_CODE}"`) && game.includes(`"${[...P.OFFICE_CODE].join(" ")}"`));

const { ctx, page, errors } = await g.open("?beat=escape:ball", { width: 375, height: 812, isMobile: true, hasTouch: true });
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
    const panel = () => window.SSQ.cutaway.last();
    // 43 to 46: tests/escape-mops.mjs and tests/escape-home.mjs (the rebuild of 2026-11-26 night); this run starts at the ball
    // 47 (the walk to the vent is tests/escape-vent.mjs)
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
    // rolled up on the floor in front of the vent's wall, a shadow under him (clear of the wall's foot, y 254, and of
    // the mail room's wall in front, y 359)
    ss.drawFrame();
    out.ball.shadow = d().drew.ballShadow;
    out.ball.at = { y: Math.round(n.sq.y) };
    // 48 and 49 (the vent, played as Mops; out, the grab): tests/escape-vent.mjs; here, from the grab on
    ((n.q = []), (n.cur = null), B.jump("grab"));
    tick();
    out.grab = { press: (() => ((n.sq.x = n.mo.x + 30), (n.sq.y = n.mo.y), press()))() };
    until(() => S().slip === "paw", 5);
    out.grab.slip = S().slip;
    for (let i = 0; i < 6 && S().step !== "tohall"; i++) (until(() => (n.cur && n.cur.k === "bub") || S().step === "tohall", 10), n.cur && n.cur.k === "bub" && next());
    // 50: he walks out of the bay to the office door himself (the doorway: escape-vent.mjs walks them all)
    const said = (max = 20) => {
      const got = [];
      for (let i = 0; i < max; i++) {
        until(() => (n.cur && n.cur.k !== "until" && n.cur.k !== "run") || (n.ctrl && !n.cur && !n.q.length), 20);
        if (!n.cur || n.cur.k === "until") break;
        got.push(say() || "[" + n.cur.id + "]");
        next();
      }
      return got;
    };
    until(() => S().step === "tohall" && n.ctrl, 10);
    out.tohall = { chip: n.ch1Chip };
    const door = ss.spotsNow().find((q) => q.id === "es-door");
    door && ((n.sq.x = door.x), (n.sq.y = door.y));
    for (let i = 0; i < 4; i++) tick();
    out.tohall.room = n.room;
    ss.drawFrame();
    out.hallNight = !!(d().drew && d().drew.night) || null;
    out.tohall.sign = d().drew.sign;
    n.sq.x = P.HALLWAY.sq.x;
    n.sq.y = P.HALLWAY.sq.y;
    out.tohall.press = press();
    ss.drawFrame();
    out.pad = { chip: n.ch1Chip, keys: Object.keys((d().drew.pad || {}).keys || {}).length, slip: d().drew.pad && d().drew.pad.slip };
    // the folded slip, tapped: bigger
    tap(150, 360);
    ss.drawFrame();
    out.pad.bigger = d().drew.pad && d().drew.pad.slip && d().drew.pad.slip.x1 - d().drew.pad.slip.x0 > out.pad.slip.x1 - out.pad.slip.x0;
    const stars = n.stars;
    const key = (k) => tap(P.keyAt(k).x, P.keyAt(k).y);
    key("9");
    ss.drawFrame();
    out.pad.buzz = !!(d().drew.pad && d().drew.pad.buzz) && d().sounds.includes("bzzt");
    out.pad.shh = n.log.some((r) => r.text === W["mops-shh"]);
    for (let i = 0; i < 20; i++) tick();
    out.pad.cleared = S().typed === "";
    out.pad.stars = n.stars === stars;
    // the first digit from the keyboard, the rest by touch
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Digit" + CODE[0], key: CODE[0] }));
    tick();
    out.pad.keyboard = S().typed === CODE[0];
    for (const k of CODE.slice(1)) key(k);
    out.pad.typed = S().typed;
    ss.drawFrame();
    out.pad.open = d().drew.pad && d().drew.pad.open;
    // 51
    until(() => S().step === "computer" && n.ctrl, 20);
    out.office = { room: n.room, chip: n.ch1Chip };
    ss.drawFrame();
    out.office.night = !!(d().drew && d().drew.night);
    out.office.fun = d().drew.fun;
    out.office.solids = ss.solids().filter((b) => b.id).map((b) => b.id);
    // Mops is drawn in the office (the office picture's own drawing has none): his pixels go when he is hidden
    {
      const cv = document.querySelector("canvas"),
        k = cv.width / 960,
        cx = cv.getContext("2d", { willReadFrequently: true }),
        box = () => cx.getImageData(Math.round((n.mo.x - 40) * k), Math.round((n.mo.y - 90) * k), Math.round(80 * k), Math.round(90 * k)).data;
      ss.drawFrame();
      const a = box();
      n.moPose = "hidden";
      ss.drawFrame();
      const b = box();
      n.moPose = "stand";
      let diff = 0;
      for (let i = 0; i < a.length; i += 4) Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) > 60 && diff++;
      out.office.mopsPixels = diff;
    }
    // the fun things, each once
    const fun = (id) => {
      const O = P.OFFICE[id].at;
      n.sq.x = O.x;
      n.sq.y = O.y;
      const got = [press()];
      got.push(...said());
      until(() => S().step === "computer" && n.ctrl, 5);
      return got;
    };
    out.fun = { chair: fun("chair"), mug: fun("mug"), drawer: fun("drawer") };
    const stars0 = n.stars;
    out.fun.frame = fun("frame");
    out.fun.secret = n.stars - stars0;
    // heading for the computer: the robot's light, "Robot! Duck!", HIDE · desk
    n.sq.x = P.OFFICE.sq.x;
    n.sq.y = P.OFFICE.sq.y;
    out.duck = { first: press() };
    Object.assign(out.duck, { said: said(), step: S().step, chip: n.ch1Chip });
    n.sq.x = P.OFFICE.hide.at.x;
    n.sq.y = P.OFFICE.hide.at.y;
    out.duck.press = press();
    out.duck.hidden = n.sqPose;
    until(() => S().step === "computer" && n.ctrl, 6);
    out.duck.after = { step: S().step, pose: n.sqPose };
    n.sq.x = P.OFFICE.sq.x;
    n.sq.y = P.OFFICE.sq.y;
    out.office.press = press();
    ss.drawFrame();
    out.site = { open: S().cu === "site", ghjk: !!(d().drew.site && d().drew.site.ghjk) };
    out.site.hooves = said();
    tap((P.SITE.order.x0 + P.SITE.order.x1) / 2, (P.SITE.order.y0 + P.SITE.order.y1) / 2);
    out.site.order = said();
    out.site.orderNothing = S().step === "site" && S().bookAt < 0;
    tap((P.SITE.ret.x0 + P.SITE.ret.x1) / 2, (P.SITE.ret.y0 + P.SITE.ret.y1) / 2);
    out.site.booked = S().bookAt >= 0;
    until(() => S().step === "label" && n.ctrl, 8);
    ss.drawFrame();
    out.site.label = d().drew.site && d().drew.site.label;
    out.site.chip = n.ch1Chip;
    out.site.take = press();
    out.site.going = said(2);
    out.site.label2 = S().label;
    // 52: he walks out of the office, through the hallway, to the snack bar himself (Mops behind him)
    until(() => S().step === "tobar" && n.ctrl, 10);
    out.bar = { chip: n.ch1Chip, rooms: [] };
    for (let k = 0; k < 3 && n.room !== "hall"; k++) {
      const dr = ss.spotsNow().find((q) => q.id === "es-door");
      dr && ((n.sq.x = dr.x), (n.sq.y = dr.y));
      for (let i = 0; i < 4; i++) tick();
      out.bar.rooms.push(n.room);
    }
    ss.drawFrame();
    out.bar.mark = !!d().drew.mark;
    n.sq.x = P.BAR.sq.x;
    n.sq.y = P.BAR.sq.y;
    tick();
    out.bar.said = said(3);
    out.bar.room = n.room;
    until(() => S().step === "snacks" && n.ctrl, 5);
    out.bar.night = !!(d().drew && d().drew.night);
    const snack = (i) => (tap(P.SNACKS.at[i].x, P.SNACKS.at[i].y), until(() => !S().snacks.carry, 3));
    for (const i of [0, 1, 2, 3]) snack(i);
    out.bar.bag = S().snacks.bag;
    out.bar.guardians = said(2);
    until(() => S().step === "food" && n.ctrl, 5);
    out.bar.plate = S().snacks.plate;
    tap(P.SNACKS.plate.x, P.SNACKS.plate.y - 30); // a tap on the plate: his last Stars Cake goes on it
    until(() => !S().snacks.carry, 3);
    out.bar.onPlate = S().snacks.onPlate.map((i) => P.SNACKS.kinds[i]);
    out.bar.favorite = said(1);
    const who = [];
    until(() => (n.cur && n.cur.k === "bub" && who.push(n.cur.b.who), S().step === "gohome" && n.ctrl), 20);
    out.bar.mopsSaid = who.includes("mops");
    out.bar.hearts = d().steps.includes("hearts");
    // home, walked
    out.bar.home = { chip: n.ch1Chip };
    const dr = ss.spotsNow().find((q) => q.id === "es-door");
    dr && ((n.sq.x = dr.x), (n.sq.y = dr.y));
    until(() => S().step === "closet" && n.ctrl, 10);
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
    out.home2.after = said(4).map((x, i) => (i === 0 && n.log.some((r) => r.text === x && r.style === "whisper") ? x + " (whisper)" : x));
    until(() => n.sqPose === "sleep", 20);
    out.home2.sleep = n.sqPose === "sleep";
    out.home2.shut = n.wardrobe === "closed";
    out.home2.slip = S().slip;
    until(() => n.ch1Step === "pk-note", 20);
    out.end = { step: n.ch1Step, active: B.active() };
    out.words = d().words;
    return out;
  },
  { W, CODE: P.OFFICE_CODE },
);
g.check("47: rolled up by the vent: on the floor in front of the wall, a shadow under him", run.ball.shadow && run.ball.at.y - 40 > 254 && run.ball.at.y + 8 < 359, run.ball);
g.check("51, 52: night in the office and at the snack counter; the office's desk, chair and cabinet are solid", run.office.night && run.bar.night && ["desk", "chair", "cabinet"].every((k) => run.office.solids.includes(k)), { office: run.office, bar: run.bar });
g.check("47: the bay at night, the goal, a patrolling robot with its cone", run.ball.room === "hangar" && run.ball.night && run.ball.chip === W["chip-ball"] && run.ball.robot && run.ball.cones === 1, run.ball);
g.check("47: ROLL · ball comes up by the vent; he rolls into the L2 ball", run.ball.awayOffer === "" && run.ball.press === W["button-ball"] && run.ball.pose === "ball", run.ball);
g.check("49: GRAB · pink slip, and the slip goes to his paw", run.grab.press === W["button-grab"] && run.grab.slip === "paw", run.grab);
g.check("50: he walks to the office door himself (the goal says so); a sign on the door: CLOSED. Back at 9.", run.tohall.chip === W["chip-door"] && run.tohall.room === "passage" && run.tohall.sign === W["sign-closed"], run.tohall);
g.check("50: TYPE · code: the keypad, ten keys, the folded slip beside it (its pen corner); a tap makes the slip bigger", run.tohall.press === W["button-code"] && run.pad.chip === W["chip-code"] && run.pad.keys === 10 && !!run.pad.slip && run.pad.bigger, run.pad);
g.check("50: a wrong key buzzes, Mops whispers \"Shh! Try again.\", the screen clears, no stars are lost", run.pad.buzz && run.pad.shh && run.pad.cleared && run.pad.stars, run.pad);
g.check("50: the keyboard's digits work, and 169556 opens the door (OPEN on the keypad)", run.pad.keyboard && run.pad.typed === "169556" && run.pad.open === W["pad-open"], run.pad);
g.check("51: the office, the goal; the fun things are there to find", run.office.room === "office" && run.office.chip === W["chip-computer"] && JSON.stringify(run.office.fun) === JSON.stringify(["es-chair", "es-mug", "es-drawer", "es-frame"]), run.office);
g.check("51: SPIN · chair; LOOK · mug (GALAXY'S OKAYEST MANAGER); OPEN · drawer (\"No fizz.\", \"One snack. That's the rule.\"); LOOK · frame (NEXT MONTH: MOPS, a secret: +50)", JSON.stringify(run.fun.chair) === JSON.stringify([W["button-chair"]]) && JSON.stringify(run.fun.mug) === JSON.stringify([W["button-mug"], "[esmug]"]) && JSON.stringify(run.fun.drawer) === JSON.stringify([W["button-drawer"], "[esdrawer]", W["sq-no-fizz"], W["sq-one-snack"]]) && JSON.stringify(run.fun.frame) === JSON.stringify([W["button-frame"], "[esframe]"]) && run.fun.secret === 50, run.fun);
g.check("51: the first time he goes to use the computer, \"Robot! Duck!\"; HIDE · desk; the light passes; he comes out", run.duck.first === W["button-computer"] && JSON.stringify(run.duck.said) === JSON.stringify([W["mops-duck"]]) && run.duck.chip === W["chip-hide-desk"] && run.duck.press === W["button-hide-desk"] && run.duck.hidden === "hidden" && run.duck.after.step === "computer" && run.duck.after.pose === "stand", run.duck);
g.check("51: RETURN · empty crate: Mops tries first (ghjk), \"Hooves. You do it.\"", run.office.press === W["button-computer"] && run.site.open && run.site.ghjk && JSON.stringify(run.site.hooves) === JSON.stringify([W["mops-hooves"]]), run.site);
g.check("51: \"Order new box\": Mops, \"Not that one!\", nothing booked; \"Return empty crate\" books it", JSON.stringify(run.site.order) === JSON.stringify([W["mops-not-that"]]) && run.site.orderNothing && run.site.booked, run.site);
g.check("51: the label prints (EMPTY. FOR PICKUP.); TAKE · label; \"We're really going.\" twice", !!run.site.label && run.site.chip === W["chip-label"] && run.site.take === W["button-label"] && run.site.label2 && JSON.stringify(run.site.going) === JSON.stringify([W["sq-going"], W["mops-going"]]), run.site);
g.check("51: Mops is drawn in the office with him", run.office.mopsPixels > 300, run.office);
g.check("52: he walks to the snack bar himself (office, hallway, hall; the aisle outlined); Mops's lines, word for word", run.bar.chip === W["chip-bar"] && JSON.stringify(run.bar.rooms) === JSON.stringify(["passage", "hall"]) && run.bar.mark && JSON.stringify(run.bar.said) === JSON.stringify([W["mops-one"], W["mops-long"], W["mops-all"]]), run.bar);
g.check("52: four into the bag; then \"What about the Guardians?\" / \"I'll leave them some food.\"; the plate", run.bar.bag === 4 && JSON.stringify(run.bar.guardians) === JSON.stringify([W["sq-what-guardians"], W["sq-leave-food"]]) && run.bar.plate, run.bar);
g.check("52: his last Stars Cake on the plate, \"Their favorite. I think.\"; Mops says nothing, a heart; then he walks home", JSON.stringify(run.bar.onPlate) === JSON.stringify(["cake"]) && JSON.stringify(run.bar.favorite) === JSON.stringify([W["sq-favorite"]]) && run.bar.hearts && !run.bar.mopsSaid && run.bar.home.chip === W["chip-home-night"], run.bar);
g.check("52: home, OPEN · closet, PUT IN · box", run.home2.room === "closet" && run.home2.chip === W["chip-slip"] && run.home2.open === W["button-closet"] && run.home2.wardrobe === "open" && run.home2.put === W["button-box"], run.home2);
g.check("52: the box close-up (MY GARDIAN BOX, MY GUARDIANS): the slip goes under the notes", run.home2.box.id === "esbox" && run.home2.box.drew.tucked && run.home2.box.drew.label === "MY GARDIAN BOX" && run.home2.box.drew.title === "MY GUARDIANS", run.home2.box);
g.check("52: the slip is in the box, the closet shut, Squatch asleep, then beat 53 (pickup day: read the note)", run.home2.slip === "box" && run.home2.shut && run.home2.sleep && run.end.step === "pk-note" && !run.end.active, { home: run.home2, end: run.end });
g.check("52: \"Mops can never see this.\" (a thought), \"Big day tomorrow.\", and their song", JSON.stringify(run.home2.after) === JSON.stringify([W["sq-never"] + " (whisper)", W["mops-big-day"], W["sq-sing"], W["mops-sing"]]), run.home2.after);
g.check("the drawings show the walkthrough's words", ["STARS CAKES", "Order new box", "Return empty crate", "OPEN", "CLOSED.", "EMPTY. FOR PICKUP.", "Pickup booked.", "ghjk"].every((w) => run.words.includes(w)), run.words);

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
  const jump = () => ((n.q = []), (n.cur = null), B.jump("ball"), tick());
  const out = {};
  jump();
  const solids = ss.solids(),
    inSolid = (x, y) => solids.find((b) => x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1);
  // he stands in front of the walkway, in the robot's way; frame by frame: its drawn cone, its mark, its phase
  n.sq.x = 600;
  n.sq.y = 440;
  const frames = [];
  for (let i = 0; i < 600 && S().robot.phase === "patrol"; i++) {
    ss.drawFrame();
    const c = (B.debug().drew.cones || [])[0];
    frames.push({ inside: !!(c && c.inside), mark: S().robot.mark || "", phase: S().robot.phase });
    tick();
  }
  out.seen = S().robot.phase;
  // the "?" shows only while the drawn cone is on him; the "!" comes only after it has been on him for 0.5 s
  let run = 0,
    early = 0,
    markOff = 0,
    asked = 0;
  for (const f of frames) {
    run = f.inside ? run + 1 : 0;
    f.mark && !f.inside && markOff++;
    f.mark === "?" && asked++;
    f.mark === "!" && run * 0.05 < 0.45 && early++;
  }
  out.cone = { frames: frames.length, early, markOff, asked };
  out.bang = until(() => S().robot.phase === "run", 2);
  // its run to the FUR alarm, and the guard who comes in: every step clear of the bay's things, his flashlight cone
  // drawn the whole time he is out
  const steps = [],
    noBeam = [];
  for (let i = 0; i < 400 && !S().guard; i++) (tick(), steps.push([S().robot.x, S().robot.y]));
  out.guard = !!S().guard;
  // rolled up where he stands while the guard is out: hidden, the guard gives up ("They lost you."), the robot goes
  // back to its rounds
  tick();
  const a = ss.offerNow();
  out.anyRoll = a ? a.verb : "";
  a && a.f();
  for (let i = 0; i < 800 && S().guard; i++) {
    ss.drawFrame();
    const g = B.debug().drew.guard;
    g ? steps.push([g.x, g.y]) : noBeam.push(i);
    tick();
  }
  out.lost = !S().guard && n.sqPose === "ball" && !(n.cur && n.cur.id === "jail");
  out.beam = noBeam.length;
  out.back = until(() => S().robot.phase === "patrol", 20);
  out.inThings = steps.filter(([x, y]) => inSolid(x, y)).slice(0, 4);
  // standing where the patrol's cone never reaches (the floor's front left corner, behind it as it looks up at the vent,
  // below it as it rolls back): no "?" and no alarm through two whole rounds
  jump();
  n.sq.x = 100;
  n.sq.y = 590;
  let marks = 0;
  for (let i = 0; i < 2 * 22 * 20; i++) (tick(), S().robot.mark && marks++);
  out.short = { marks, phase: S().robot.phase };
  // caught: standing still in the guard's way: the LOCKUP card, then the step again
  jump();
  n.sq.x = 600;
  n.sq.y = 440;
  until(() => n.cur && n.cur.id === "jail", 90);
  out.lockup = !!(n.cur && n.cur.id === "jail");
  for (let i = 0; i < 40 && n.cur; i++) ((n.bt = 1), ss.opTap(), tick(0.1));
  until(() => n.ctrl && !n.cur && !n.q.length, 10);
  out.after = { step: S() && S().step, ch1Step: n.ch1Step, robot: S() && S().robot && S().robot.phase, room: n.room, guard: !!(S() && S().guard) };
  // every route in the bay, step by step, keeps clear of the bay's things (its solids: bay-watch.js BAY_SOLIDS)
  const walk = (pts) => {
    const bad = [];
    for (let k = 1; k < pts.length; k++)
      for (let u = 0; u <= 1; u += 0.02) {
        const x = pts[k - 1].x + (pts[k].x - pts[k - 1].x) * u,
          y = pts[k - 1].y + (pts[k].y - pts[k - 1].y) * u,
          b = inSolid(x, y);
        b && bad.length < 3 && bad.push([Math.round(x), Math.round(y), b]);
      }
    return bad;
  };
  const Y = P.BAY;
  out.routes = {
    solids: solids.length,
    patrol: walk([{ x: Y.patrol.x0, y: Y.patrol.y }, { x: Y.patrol.x1, y: Y.patrol.y }]),
    toAlarm: walk([{ x: Y.patrol.x1, y: Y.patrol.y }, ...Y.toAlarm]),
    toDock: walk([{ x: Y.patrol.x0, y: Y.patrol.y }, ...Y.toDock]),
  };
  return out;
});
g.check("47: the robot reacts only once its drawn cone has been on him for 0.5 s (a \"?\" filling in first), never when it is not on him", rule.seen === "bang" && rule.cone.asked > 0 && rule.cone.early === 0 && rule.cone.markOff === 0, rule.cone);
g.check("47: standing where its cone never reaches, no \"?\" and no alarm through two rounds", rule.short.marks === 0 && rule.short.phase === "patrol", rule.short);
g.check("47: it pulls the FUR alarm and a guard (security, as the party's guard) comes in; his flashlight cone shows the whole time", rule.bang && rule.guard && rule.beam === 0, rule);
g.check("47: rolled up anywhere while the guard is out (ROLL · ball), he is lost; the robot goes back to its rounds", rule.anyRoll === "ROLL" && rule.lost && rule.back, rule);
g.check("47: caught standing in the guard's way: the LOCKUP card, then the ball step again (no guard, the robot on its rounds)", rule.lockup && rule.after.step === "ball" && rule.after.ch1Step === "es-ball" && rule.after.room === "hangar" && !rule.after.guard && rule.after.robot === "patrol", rule);
g.check("47: the robot's run and the guard's walk never go into the walkway, the plant, the bin or the mail room's walls", rule.inThings.length === 0, rule.inThings);
g.check("47: every route in the bay (the walk in, the patrol, to the FUR alarm, to the dock) keeps clear of its things", rule.routes.solids >= 7 && Object.entries(rule.routes).every(([k, v]) => k === "solids" || v.length === 0), rule.routes);

// ---------- ↺ in every step, and the chapter reset ----------
const restarts = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    B = window.SSQ.beat("ch1-escape"),
    S = () => n.ch1Escape; // (the live state: a change here is a change in the game)
  const tick = (s = 0.05) => ss.tick(s);
  const out = {};
  // each step the player controls: jumped to, changed, then ↺ (the step restart brings back its start)
  for (const [beat, step, sub] of [
    [47, "ball"],
    [48, "grab"],
    [50, "pad"],
    [51, "computer"],
    [51, "site"],
    [52, "snacks"],
    [52, "food"],
    [52, "closet"],
    [52, "box"],
  ]) {
    ((n.q = []), (n.cur = null), B.jump(step === "food" ? "snacks" : step === "box" ? "closet" : step));
    step === "closet" || step === "box" ? B.jump("closet") : null;
    step === "site" && B.jump("site");
    step === "food" && (Object.assign(S(), { step: "food" }), (S().snacks.plate = true), (n.ch1Step = "es-food"));
    step === "box" && ((n.sq.x = B.place.HOME.closet.x), (n.sq.y = B.place.HOME.closet.y), tick(), ss.offerNow().f());
    for (let i = 0; i < 4; i++) tick();
    const at = { x: Math.round(n.sq.x), y: Math.round(n.sq.y) };
    // something changes in the step, then ↺
    step === "pad" && ((S().typed = "16"), tick());
    (step === "snacks" || step === "food") && ((S().snacks.bag = 2), (S().snacks.gone = { 0: 1, 1: 1 }));
    n.sq.x += 40;
    ss.sectionReset();
    for (let i = 0; i < 4; i++) tick();
    out[step] = { step: S().step, typed: S().typed, bag: S().snacks.bag, ctrl: n.ctrl, back: Math.round(n.sq.x) === at.x && Math.round(n.sq.y) === at.y, wardrobe: n.wardrobe };
  }
  // the steps he does not control go back to the last step he did (escape.js RESTART_TO); a hand-made state for each
  // (the step's name, with a story wait up so the step restart has nothing saved for it)
  out.cut = {};
  for (const [step, from] of [["home", "walkhome"], ["togoat", "sneak"], ["rolled", "ball"], ["inside", "ball"], ["out", "slip"], ["open", "pad"], ["booked", "site"], ["atbar", "tobar"], ["guardians", "snacks"], ["hearts", "food"], ["arrive", "gohome"], ["boxview", "closet"], ["bed", "closet"]]) {
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
  // between steps, for real: the vent's cutscene goes back to the ball step
  ((n.q = []), (n.cur = null), B.jump("ball"));
  tick();
  n.sq.x = B.place.BAY.ventStand.x;
  n.sq.y = B.place.BAY.ventStand.y;
  tick();
  ss.offerNow().f();
  for (let i = 0; i < 400 && S().step !== "inside"; i++) tick();
  out.between = S().step;
  ss.sectionReset();
  for (let i = 0; i < 4; i++) tick();
  out.betweenAfter = { step: S().step, room: n.room, ctrl: n.ctrl };
  // the chapter reset (ch1ResetState) forgets the escape
  window.SSQ.engine().resetChapter();
  out.reset = n.ch1Escape === null;
  return out;
});
const ctrlSteps = ["ball", "grab", "pad", "computer", "site", "snacks", "food", "closet", "box"];
g.check("↺ in each step he controls starts that step again, with him back where it started (the keypad clears, the snacks come back)", ctrlSteps.every((k) => restarts[k].step === k && restarts[k].ctrl && restarts[k].back) && restarts.pad.typed === "" && restarts.snacks.bag === 0 && restarts.food.bag === 0 && restarts.box.wardrobe === "open", restarts);
const want = { home: "walkhome", togoat: "sneak", rolled: "ball", inside: "ball", out: "slip", open: "pad", booked: "site", atbar: "tobar", guardians: "snacks", hearts: "food", arrive: "gohome", boxview: "closet", bed: "closet" };
g.check("↺ in a step he does not control goes back to the last step he did (hand-made states)", Object.entries(want).every(([k, v]) => restarts.cut[k] === v), restarts.cut);
g.check("↺ between steps (inside the vent, played there) goes back to the ball step", restarts.between === "inside" && restarts.betweenAfter.step === "ball" && restarts.betweenAfter.room === "hangar" && restarts.betweenAfter.ctrl, restarts);
g.check("the chapter reset (ch1ResetState) forgets the escape", restarts.reset, restarts);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("escape");
