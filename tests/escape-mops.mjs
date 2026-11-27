/**
 * Beats 43 and 44 of the escape, rebuilt from the story pass of 2026-11-26 (src/modules/escape.js, escape-mopoff.js,
 * escape-doors.js), at phone size:
 *   43   "Six days later" on the home calendar: six days crossed off one at a time, tomorrow says DELIVERY and has the
 *        one highlight; it waits for NEXT.
 *   44a  the switch to Mops is announced (the card, with why); the stick drives Mops; his beard cleans the dirty patches
 *        on the cart tracks (head down while he walks); he hums.
 *   44b  three robots zip in; the line is painted; ROBOT SIDE. GOAT SIDE.; the robots finish their side in 15 seconds
 *        (FAST full, SPARKLE low), knock the boxes over, chant DONE.; once their wheels dirty his side again; sticky
 *        cells need two passes; all clean ends it at once; the buzzer lines; the star close-up with its words; the star
 *        stays on his tag.
 *   44c  the robots' news and Mops's lines, word for word, in order.
 *   44d  Mops walks home himself: through the bay's doorway, the hallway (his line at the Employee of the Month wall), the hall (a guest
 *        waves: "Hi, Mops!"), home; the switch back to Squatch is announced.
 * Also: the logic without a browser (grades, bars, wheels), nobody walks over the walkway, ↺ in each Mops step, and a
 * chapter reset hands the stick back to Squatch.
 *   node tests/escape-mops.mjs
 */
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const { ESCAPE_LINES } = await import(M("escape-lines.js"));
const P = await import(M("escape-place.js"));
const MO = await import(M("escape-mopoff.js"));
const W = Object.fromEntries(ESCAPE_LINES.map((l) => [l.id, l.text]));
const g = await startGame({ port: 9783, name: "escape-mops" });

// ---------- the Mop-Off's rules, without a browser ----------
{
  const f = MO.freshFloor(),
    cells = MO.goatCells();
  const pass = (c) => (MO.mopGoat(f, { x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2 }, 0), MO.mopGoat(f, { x: -10, y: -10 }, 0));
  cells.forEach(pass);
  const once = MO.goatClean(f);
  cells.filter((c) => c.need > 1).forEach(pass);
  const all = MO.goatClean(f);
  MO.wheelsAcross(f);
  const after = MO.goatClean(f);
  g.check("44b: a sticky cell needs two passes; one pass over everything leaves them dirty", !once.all && once.k > 0.7 && all.all, { once, all });
  g.check("44b: the robot's wheels put dirt back on the cells they cross", !after.all && after.k < 1 && f.wheelsDone, after);
  g.check("44b: the star's words go by how much of his side sparkles (under half GOOD, half or more GREAT, all STAR)", MO.starFor({ k: 0.2, all: false }) === "star-good" && MO.starFor({ k: 0.5, all: false }) === "star-great" && MO.starFor({ k: 1, all: true }) === "star-star");
  const b0 = MO.bars(MO.freshFloor(), 15);
  g.check("44b: at 15 seconds the robots' FAST bar is full and their SPARKLE stays low; his are empty", b0.fast[0] === 1 && b0.sparkle[0] <= 0.3 && b0.fast[1] === 0 && b0.sparkle[1] === 0, b0);
  g.check("44b: the corners are four of his cells", cells.filter((c) => c.corner).length === 4);
  const pend = ESCAPE_LINES.filter((l) => /story pass/.test(l.source) && /CHANGED|NEW/.test(l.source));
  g.check("every CHANGED or NEW line from the story pass is pending (Brian approves as he watches)", pend.length > 60 && pend.every((l) => l.status === "pending"), pend.filter((l) => l.status !== "pending").map((l) => l.id));
  // and nothing from the story pass is marked approved or shown before unless it was (KEEP, or Brian's yes, or in the game already)
  const odd = ESCAPE_LINES.filter((l) => /story pass/.test(l.source) && l.status !== "pending" && !(l.status === "new" && /no words given/.test(l.source)) && !/KEEP|Brian|in-game|before/.test(l.source + l.status));
  g.check("no line from the story pass skips pending without a reason (KEEP, Brian's yes, or in the game already)", odd.length === 0, odd.map((l) => l.id));
}

const { ctx, page, errors } = await g.open("?beat=escape", { width: 375, height: 812, isMobile: true, hasTouch: true });
await page.evaluate(() => window.__ss.lockedReady);

const run = await page.evaluate(
  async ({ W }) => {
    const ss = window.__ss,
      n = ss.op,
      E = window.SSQ.engine(),
      B = window.SSQ.beat("ch1-escape"),
      d = () => B.debug(),
      S = () => n.ch1Escape;
    const out = {};
    const tick = (s = 0.05) => ss.tick(s);
    const until = (f, s = 30) => {
      for (let i = 0; i < s / 0.05 && !f(); i++) tick();
      return f();
    };
    const say = () => (n.cur && n.cur.k === "bub" ? n.cur.b.text : n.cur && n.cur.k === "card" ? n.cur.text : "");
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
    // the lines from here until the player has control again, each with NEXT
    const lines = (max = 30) => {
      const got = [];
      for (let i = 0; i < max; i++) {
        until(() => (n.cur && (n.cur.k === "bub" || n.cur.k === "card")) || (n.ctrl && !n.cur && !n.q.length), 20);
        if (!n.cur) break;
        got.push(say());
        next();
      }
      return got;
    };
    const press = () => {
      tick();
      const a = ss.offerNow();
      a && a.f && a.f();
      tick();
      return a ? a.verb + " · " + a.cap : "";
    };
    // a tap on the floor walks the one he is (Sierra style), round things; until he is there or stuck
    const walk = (x, y, s = 8) => {
      ss.drawFrame();
      ss.tapAt(x, y, false);
      const who = () => (E.playing() === "mops" ? n.mo : n.sq);
      until(() => !n.walkTo || Math.hypot(who().x - x, who().y - y) < 6, s);
      return { x: Math.round(who().x), y: Math.round(who().y) };
    };
    // 43
    until(() => n.cur, 3);
    for (let i = 0; i < 100; i++) tick();
    ss.drawFrame();
    out.week = { ...d().drew.week, cu: S().cu, waits: waitsForNext(), room: n.room };
    next();
    // 44a: the switch card
    until(() => n.cur && n.cur.k === "card", 5);
    out.switch1 = { text: say(), by: n.cur && n.cur.by, room: n.room };
    next();
    until(() => n.ctrl, 5);
    out.mop = { step: S().step, playing: E.playing(), chip: n.ch1Chip, hum: (n.live || []).some((b) => b.text === W["mops-hum"]) || n.log.some((r) => r.text === W["mops-hum"]) };
    // walking him over the patches; his head is down while he walks
    let down = false;
    for (const p of B.place.MOP_CALM.patches) {
      ss.drawFrame();
      ss.tapAt(p.x - 24, p.y, false);
      for (let i = 0; i < 160 && n.walkTo; i++) (tick(), i === 4 && (ss.drawFrame(), (down = down || !!S().mopping)));
    }
    out.mop.down = down;
    until(() => S().step !== "mop", 3);
    out.mop.after = S().step;
    // 44b
    until(() => n.cur && n.cur.k === "bub", 10);
    ss.drawFrame();
    out.sides = { line: say(), robots: d().drew.robots, paint: S().paint };
    next();
    until(() => n.ctrl && S().step === "mopoff", 5);
    out.contest = { chip: n.ch1Chip, playing: E.playing() };
    // nobody walks over anything: a tap on the mailbox leaves him at its edge (by day there is no ship and no walkway)
    const W0 = { x0: 822, x1: 934, y0: 430, y1: 486 };
    const onWalk = walk(878, 460, 4);
    out.contest.walkway = onWalk.x > W0.x0 && onWalk.x < W0.x1 && onWalk.y > W0.y0 && onWalk.y < W0.y1;
    // stand still while the robots do their side
    until(() => S().ct >= 15.2, 20);
    ss.drawFrame();
    out.contest.at15 = { bars: d().drew.bars, boxes: d().drew.floor.boxesDown, done: n.log.some((r) => r.text === W["robot-done"]) };
    until(() => S().ct >= 25.5, 15);
    out.contest.wheels = S().floor.wheelsDone;
    // now mop every cell (twice), serpentine
    const C = B.place.MOPOFF;
    const cols = [0, 1, 2].map((c) => C.goat.x0 + ((c + 0.5) * (C.goat.x1 - C.goat.x0)) / 3),
      rows = [0, 1, 2, 3].map((r) => C.floor.y0 + ((r + 0.5) * (C.floor.y1 - C.floor.y0)) / 4);
    for (let k = 0; k < 2 && S().step === "mopoff"; k++)
      for (const y of rows) for (const x of k % 2 ? [...cols].reverse() : cols) S().step === "mopoff" && (walk(x - 24 * (n.mo.f || 1), y, 3), walk(x - 24 * (n.mo.f || 1) + 2, y + 8, 1));
    out.contest.early = S().ct < C.goatTime;
    out.contest.endStep = S().step;
    out.buzz = lines(3);
    until(() => S().cu === "star", 5);
    tick(0.7);
    ss.drawFrame();
    out.star = { ...d().drew.star, id: S().star, waits: waitsForNext() };
    next();
    out.tagStar = B.tagStar();
    // 44c and the walk home's first two lines
    out.news = lines(20);
    out.home = { step: S().step, chip: n.ch1Chip, playing: E.playing(), ctrl: n.ctrl };
    // ↺ in the walk home: back where it started, still Mops
    const at0 = { x: Math.round(n.mo.x), y: Math.round(n.mo.y) };
    walk(300, 540, 3);
    ss.sectionReset();
    for (let i = 0; i < 4; i++) tick();
    out.home.restart = { step: S().step, playing: E.playing(), back: Math.round(n.mo.x) === at0.x && Math.round(n.mo.y) === at0.y };
    // 44d: out through the bay's left doorway, the hallway, the hall, home
    ss.drawFrame();
    out.home.doorMark = n.room;
    walk(120, 340, 6);
    walk(40, 336, 3);
    out.home.hallway = n.room;
    ss.drawFrame();
    out.home.hallwayDoor = d().drew.door;
    walk(B.place.PLAQUE.x, B.place.PLAQUE.y, 6);
    ss.tick(0.05);
    out.home.plaque = (ss.offerNow() && ss.offerNow().verb + " · " + ss.offerNow().cap) || "";
    out.home.plaqueLine = [...(n.live || []), ...n.log].filter((r) => r.text === W["mops-plaque"]).map((r) => r.text);
    walk(40, 346, 8);
    out.home.hall = n.room;
    walk(560, 400, 8);
    until(() => n.log.some((r) => r.text === W["guest-hi"]), 2);
    out.home.waved = n.log.some((r) => r.text === W["guest-hi"]);
    walk(476, 600, 8);
    out.home.room = n.room;
    until(() => n.cur && n.cur.k === "card", 10);
    out.home.switch = { text: say(), by: n.cur && n.cur.by };
    next();
    out.home.after = E.playing();
    out.home.tagStar = B.tagStar();
    // a chapter reset while the player is Mops: the stick drives Squatch again
    ((n.q = []), (n.cur = null), B.jump("mopoff"));
    tick();
    out.reset = { before: E.playing() };
    E.resetChapter();
    tick();
    out.reset.after = E.playing();
    return out;
  },
  { W },
);
const o = run;
g.check("43: the home calendar close, \"Six days later\" across it, six days crossed off, tomorrow DELIVERY (outlined); it waits for NEXT", o.week.card === W["card-six-days"] && o.week.xs === 6 && o.week.delivery && o.week.cu === "cal" && o.week.waits && o.week.room === "closet", o.week);
g.check("44a: the switch to Mops is announced, with why", o.switch1.text === "You are MOPS now." && o.switch1.by === W["switch-work"] && o.switch1.room === "hangar", o.switch1);
g.check("44a: the stick drives Mops; the goal is to mop; he hums", o.mop.step === "mop" && o.mop.playing === "mops" && o.mop.chip === W["chip-mop"] && o.mop.hum, o.mop);
g.check("44a: walking over the patches cleans them (his head down as he walks), and then the robots come", o.mop.down && o.mop.after === "sides", o.mop);
g.check("44b: three robots; the line painted; ROBOT SIDE. GOAT SIDE.", o.sides.line === W["robot-sides"] && o.sides.robots === 3, o.sides);
g.check("44b: the contest's goal; still Mops", o.contest.chip === W["chip-mopoff"] && o.contest.playing === "mops", o.contest);
g.check("44b: nobody walks over anything (a tap on the mailbox stops him at its edge)", o.contest.walkway === false, o.contest);
g.check("44b: at 15 seconds the robots are done (FAST full, SPARKLE low), the boxes are down, DONE.", o.contest.at15.bars.fast[0] === 1 && o.contest.at15.bars.sparkle[0] <= 0.3 && o.contest.at15.boxes && o.contest.at15.done, o.contest.at15);
g.check("44b: once, their wheels dirty his side", o.contest.wheels);
g.check("44b: making all of his side sparkle ends it at once", o.contest.early && o.contest.endStep !== "mopoff", o.contest);
g.check("44b: the buzzer lines, word for word, in order", JSON.stringify(o.buzz) === JSON.stringify([W["robot-time"], W["robot-goat"], W["robot-hq"]]), o.buzz);
g.check("44b: all of it clean, corners too: STAR GANITOR on his tag, close; it waits for NEXT; the star stays", o.star.id === "star-star" && o.star.words === W["star-star"] && o.star.landed && o.star.waits && o.tagStar, o.star);
const newsWant = ["robot-enjoy", "robot-order", "robot-more", "robot-no-ganitor", "mops-who", "robot-stormtop", "mops-form", "mops-replace", "mops-sent", "mops-lied", "mops-right", "mops-tell"].map((k) => W[k]);
g.check("44c, 44d: the robots' news and Mops's answer, then \"Squatch was right.\", word for word, in order", JSON.stringify(o.news) === JSON.stringify(newsWant), o.news);
g.check("44d: he walks home himself, as Mops (the goal says so)", o.home.step === "walkhome" && o.home.chip === W["chip-home"] && o.home.playing === "mops" && o.home.ctrl, o.home);
g.check("44d: ↺ on the walk home puts him back where it started, still Mops", o.home.restart.step === "walkhome" && o.home.restart.playing === "mops" && o.home.restart.back, o.home.restart);
g.check("44d: through the bay's doorway into the hallway; the next doorway (to the hall) is outlined", o.home.hallway === "passage" && o.home.hallwayDoor === "hall", o.home);
g.check("44d (round 7, r5 11:22, q: 128): no LOOK · plaque; walking past the Employee of the Month wall, Mops says his line", o.home.plaque !== "LOOK · plaque" && o.home.plaqueLine[0] === W["mops-plaque"], o.home);
g.check("44d: the hall, a guest waves (\"Hi, Mops!\"), then home", o.home.hall === "hall" && o.home.waved && o.home.room === "closet", o.home);
g.check("45a: at home the switch back to Squatch is announced, with why; the star is still on his tag", o.home.switch.text === "You are SQUATCH now." && o.home.switch.by === W["switch-home"] && o.home.after === "sq" && o.home.tagStar, o.home);
g.check("a chapter reset while he is Mops gives the stick back to Squatch", o.reset.before === "mops" && o.reset.after === "sq", o.reset);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("escape-mops");
