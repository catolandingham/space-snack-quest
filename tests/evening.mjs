/**
 * Beats 37 to 42c, the evening of Day 2 and night one rebuilt from the story pass (src/modules/evening.js), at phone
 * size. Checked as the player meets them:
 *   - the words: every story-pass line built word for word and still pending, Brian's Nov 8 lines across their bubbles,
 *     no bubble too long (line-split.js), the office code;
 *   - 37: the gallery, holding LIFT · photo swings photo 4 up over the crayon drawing (ME, MOPS) and back; past photo 5
 *     the robot from the hall's end: rolled up it passes (BEEP BEEP), standing it sees him (the capture rule);
 *   - 38a: Jupiter's storm, the PA, "Guests! Quick, hide.", the guests seeing a kid who stays out, HIDE · counter, PEEK
 *     · window, the family's Mars talk, DUCK · down; still up, their cones find his eyes;
 *   - 38b and 39: as Mops, GREET · kid and TALK · family; the brochure handed to Mops (its close-up) and passed down;
 *   - 39b: OPEN · box, BITE · cake, "No fizz.", the chart's X, the crate's letters, "MARS!";
 *   - 40 and 41: the fight, STOMP · to bed, the turned back, lights out with no song, Mops asleep, the idea;
 *   - 42: the bucket bump, the night rooms, GRAB · copies, PUT BACK · bin and GO BACK, MARK · box, the loud post, the
 *     crate by the vent, the pink sheet in the vent, home and beat 43; the capture rule in the bay; ↺; the debug link.
 *   node tests/evening.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const { EVENING_LINES } = await import(M("evening-lines.js"));
const { FAMILY } = await import(M("snack-name.js"));
const PL = await import(M("evening-place.js"));
const W = await import(M("party-watch.js"));
const g = await startGame({ port: 9781, name: "evening" });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true };

// ---------- the words ----------
const SPOKEN = EVENING_LINES.filter((l) => !["chip", "button", "sign", "lockup", "card"].includes(l.who));
const { splitLine } = await import(M("line-split.js"));
g.check("no spoken line is new without the story pass (no spoken line is only \"suggested\")", SPOKEN.every((l) => l.status !== "suggested"), SPOKEN.filter((l) => l.status === "suggested"));
g.check("every story-pass spoken line is built and still pending (Brian approves as he watches)", SPOKEN.filter((l) => /story pass/.test(l.source)).every((l) => l.status === "pending"), SPOKEN.filter((l) => /story pass/.test(l.source) && l.status !== "pending").map((l) => l.id));
g.check("the missing snack line is cut (story pass, thread 24)", !EVENING_LINES.some((l) => new RegExp("moo" + "n pies?", "i").test(l.text)));
// (Brian 2026-11-26: a line over about 12 words is split into bubbles, its words unchanged; line-split.js is the rule)
const long = SPOKEN.filter((l) => splitLine(l.text).length > 1);
g.check("no bubble needs splitting (line-split.js): every line is short enough for one bubble", long.length === 0, long.map((l) => l.text));
const said = (ids) => ids.map((id) => EVENING_LINES.find((l) => l.id === id).text).join(" ");
g.check("Brian's lines read word for word: the Nov 8 whisper across its bubbles, and his Nov 27 words at the bar", said(["sq-floors", "sq-robots-do"]) === "The floors don't mop themselves... But those robots do." && said(["mom-only-goat"]) === "The only goat janitor in the whole galaxy." && said(["dad-brochure"]) === "In fact, I've got a brochure here.");
g.check("round 7: every new or changed line of the brochure scene is still pending (Brian approves as he watches)", EVENING_LINES.filter((l) => /review 2026-11-27/.test(l.source)).length >= 20 && EVENING_LINES.filter((l) => /review 2026-11-27/.test(l.source)).every((l) => l.status === "pending"));
g.check("the office code on the pink sheet is Brian's 169556", EVENING_LINES.find((l) => l.id === "sign-code").text === "169556");

// ---------- the night robot's rhythm, from the numbers (no browser) ----------
const L = PL.nightLook;
g.check("R64: the night robot looks down 2 s, turns 0.3 s with no catch, looks at the back wall 4 s", L(0.5).phase === "down" && L(2.1).catch === false && L(3).phase === "up" && Math.abs(L(3).a + Math.PI / 2) < 1e-9 && Math.abs(L(0.5).a - Math.PI / 2) < 1e-9 && L(6.4).catch === false && Math.abs(PL.NIGHT_CYCLE - 6.6) < 1e-9);
const CONE = { half: 0.42, len: 210 };
const RS = await import(M("room-sizes.js"));
const K = RS.adultPxFor("hangar") / RS.adultPxFor("hall"); // the bay's Squatch against the hall's (sight is measured at his size)
const seesBay = (c, sq) => W.coneSees({ ...c, ox: sq.x + (c.ox - sq.x) / K, oy: sq.y + (c.oy - sq.y) / K, len: c.len / K }, sq);
const robotCone = (t) => W.coneFrom("r", PL.EV_BAY.robot.x, PL.EV_BAY.robot.y, L(t).a, CONE);
const everSeen = (p) => {
  for (let t = 0; t < PL.NIGHT_CYCLE; t += 0.05) if (L(t).catch && seesBay(robotCone(t), p)) return true;
  return false;
};
const BAY_PTS = { bin: PL.EV_BAY.bin, mail: PL.EV_BAY.mail, plant: PL.EV_BAY.plant, door: PL.EV_BAY.door, crate: PL.EV_BAY.crate.stand };
g.check("the bin, the mailbox, the plant, the doorway and the crate by the floor vent are never in the night robot's cone", Object.values(BAY_PTS).every((p) => !everSeen(p)), Object.keys(BAY_PTS).filter((k) => everSeen(BAY_PTS[k])));
g.check("the front of the bay is seen while it looks down, the back while it looks up", seesBay(robotCone(1), { x: 480, y: 585 }) && !seesBay(robotCone(4), { x: 480, y: 585 }) && seesBay(robotCone(4), { x: 480, y: 330 }) && !seesBay(robotCone(1), { x: 480, y: 330 }));

// ---------- in the game ----------
const { page, errors } = await g.open("?beat=evening:37", PHONE);
await new Promise((r) => setTimeout(r, 900));
await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  window.__run = (secs, until, each) => {
    for (let i = 0; i < secs * 20; i++) {
      if (until && until()) return true;
      each && each();
      if (n.cur && (n.cur.k === "bub" || n.cur.k === "card") && (n.bt || 0) > 0.6) ((n.bt = 1), ss.opTap());
      ss.tick(0.05);
    }
    return until ? !!until() : true;
  };
  window.__spot = (label) => ss.spotsNow().find((q) => q && q.verb + " · " + q.cap === label) || null;
  window.__press = (label) => {
    const s = window.__spot(label);
    if (!s) return false;
    s.x != null && ((n.sq.x = s.x), (n.sq.y = s.y));
    ss.tick(0.05);
    const o = ss.offerNow();
    if (!o || o.verb + " · " + o.cap !== label) return false;
    o.f();
    return true;
  };
  window.__st = () => (n.ch1Evening || {}).step;
  window.__tapView = (label, at, kind = "both") => {
    const cv = document.querySelector(`canvas[aria-label="${label}"]`);
    if (!cv) return false;
    for (const k of kind === "both" ? ["pointerdown", "pointerup"] : [kind]) cv.dispatchEvent(new PointerEvent(k, { clientX: at.x, clientY: at.y, pointerId: 7, bubbles: true }));
    return true;
  };
  window.__texts = () => n.log.filter((e) => e.k === "bub" || e.k === "card").map((e) => e.text);
  window.__jump = (b) => ((n.q = []), (n.cur = null), ss.ch1JumpBeat(b), ss.tick(0.05));
});
const ev = (f, a) => page.evaluate(f, a);
const frame = () => new Promise((r) => setTimeout(r, 160));

// beat 37
let r = await ev(() => ({ step: window.__st(), room: window.__ss.op.room, ctrl: window.__ss.op.ctrl, ring: window.__ss.op.lastRing && window.__ss.op.lastRing.id, chip: window.__ss.chipNow() }));
g.check("the debug link opens beat 37 in the hallway; the photos are outlined and are the goal (round 7, r5 4:05, q: 128: \"the picture should light up\")", r.step === "wall" && r.room === "passage" && r.ctrl && r.ring === "ev-photos" && r.chip === "Squatch: look at the photos", r);
r = await ev(() => {
  const spots = window.__ss.spotsNow().map((s) => s.id);
  return { spots, look: !!window.__press("LOOK · photos"), step: window.__st() };
});
await frame();
r.view = await ev(() => window.SSQ.beat("ch1-evening").viewTargets());
g.check("LOOK · photos opens the gallery full screen, an X always there", r.look && r.step === "gallery" && r.view && r.view.kind === "gallery" && r.view.close && r.view.i === 0, r);
r = await ev(async () => {
  const b = window.SSQ.beat("ch1-evening"),
    seen = [];
  for (let i = 0; i < 3; i++) {
    const t = b.viewTargets();
    window.__tapView("photo wall", t.next);
    await new Promise((q) => setTimeout(q, 120));
    seen.push(b.debug().view.drew);
  }
  const before = window.__ss.op.ch1Crayon;
  // a tap on LIFT · photo does not lift it: it has to be held (about a second), and it swings back when let go
  const L = b.viewTargets().lift;
  window.__tapView("photo wall", L, "pointerdown");
  window.__run(0.4);
  await new Promise((q) => setTimeout(q, 120));
  const half = b.debug().view.drew.lift;
  window.__run(0.8);
  // the words drawn while it is up (the gallery's own canvas)
  const words = [],
    CP = CanvasRenderingContext2D.prototype,
    keep = CP.fillText;
  CP.fillText = function (t) {
    this.canvas.getAttribute("aria-label") === "photo wall" && words.push(String(t));
    return keep.apply(this, arguments);
  };
  await new Promise((q) => setTimeout(q, 200));
  CP.fillText = keep;
  const up = { ...b.debug().view.drew, crayonWords: [...new Set(words)] };
  window.__tapView("photo wall", L, "pointerup");
  window.__run(1.2);
  await new Promise((q) => setTimeout(q, 120));
  return { seen, before, half, up, after: window.__ss.op.ch1Crayon, back: b.debug().view.drew };
});
g.check("photo #4 hangs crooked, with a corner of crayon paper poking out; LIFT · photo is offered on it", r.seen[2].photo === 4 && r.seen[2].crooked && r.seen[0].crooked === false && !r.before, r.seen);
g.check("holding LIFT · photo swings the frame up on its nail like a flap (about a second); his crayon drawing is underneath; his thought", r.half > 0.1 && r.half < 0.9 && r.up.lift === 1 && r.up.lifted && r.up.thought && r.after === true, { half: r.half, up: r.up });
g.check("letting go swings the frame back down", r.back.lift === 0, r.back);
g.check("the drawing's labels are two crayon tags, ME and MOPS (no GANITOR on the drawing: only the plaque says it)", r.up.crayonWords && r.up.crayonWords.includes("ME") && r.up.crayonWords.includes("MOPS") && !r.up.crayonWords.some((w) => /GANITOR/.test(w) && !/MOPS, GANITOR/.test(w)), r.up.crayonWords);
r = await ev(() => {
  const b = window.SSQ.beat("ch1-evening");
  window.__tapView("photo wall", b.viewTargets().close);
  return { step: window.__st(), open: !!document.querySelector('canvas[aria-label="photo wall"]'), robot: !!(window.__ss.op.ch1Evening.robot) };
});
g.check("the X closes the gallery any time, with no robot", r.step === "wall" && !r.open && !r.robot, r);
// past photo 5: a robot comes in through the hall's doorway; the kid rolls up (a ball fools a quick look)
r = await ev(async () => {
  window.__press("LOOK · photos");
  const b = window.SSQ.beat("ch1-evening"),
    n = window.__ss.op;
  await new Promise((q) => setTimeout(q, 150));
  for (let i = 0; i < 6; i++) (b.viewAct(), await new Promise((q) => setTimeout(q, 60)));
  const out = { step: window.__st(), open: !!document.querySelector('canvas[aria-label="photo wall"]'), ctrl: n.ctrl, ball: !!window.__spot("ROLL · ball"), robot: { ...n.ch1Evening.robot } };
  // one real second to act: the robot waits just outside the hall's doorway
  window.__run(1.5);
  out.waiting = n.ch1Evening.robot && n.ch1Evening.robot.x < 0;
  out.rolled = window.__press("ROLL · ball");
  const path = [];
  window.__run(14, () => window.__st() === "past" && n.ctrl && !n.ch1Evening.robot, () => {
    const r2 = n.ch1Evening.robot;
    r2 && path.push([Math.round(r2.x), Math.round(r2.y)]);
    n.cur && n.cur.b && (out.bub = out.bub || n.cur.b.text);
  });
  out.path = path.filter((_, i) => i % 10 === 0);
  out.after = window.__st();
  out.alarm = !!n.ch1Evening.alarm;
  out.look = !!window.__spot("LOOK · photos");
  return out;
});
g.check("past photo 5 the gallery closes and the kid has control: ROLL · ball is offered; the robot waits a second outside the hall's doorway", r.step === "dodge" && !r.open && r.ctrl && r.ball && r.robot.x < 0 && r.waiting, r);
g.check("the robot comes in through the hall's doorway (the hall end) and rolls out through the bay's; rolled up, the ball fools it: BEEP BEEP, no alarm", r.rolled && r.path.length > 3 && r.path[1][0] < 200 && r.path[r.path.length - 1][0] > 800 && r.bub === "BEEP BEEP" && !r.alarm && r.after === "past" && !r.look, r);
// a kid who does not roll up: the robot sees him (cone held half a second, "?"), the alarm, guards, caught
r = await ev(() => {
  const n = window.__ss.op;
  window.__jump(37);
  const b = window.SSQ.beat("ch1-evening");
  window.__press("LOOK · photos");
  for (let i = 0; i < 6; i++) b.viewAct();
  n.sq.x = 300;
  n.sq.y = 400;
  const out = {};
  window.__run(8, () => !!n.ch1Evening.alarm, () => (n.ch1Evening.seenT > 0 && (out.registering = true)));
  out.alarm = n.ch1Evening.alarm && { who: n.ch1Evening.alarm.who, where: n.ch1Evening.alarm.where, place: n.ch1Evening.alarm.place };
  window.__run(20, () => n.cur && n.cur.k === "card");
  out.card = n.cur && n.cur.k === "card" ? n.cur.text || "" : "";
  out.log = window.__texts().filter((t) => /LOCKUP|robot|hallway/i.test(t)).slice(-3);
  return out;
});
g.check("standing in the robot's way: its cone registers him (a \"?\"), then the one capture rule in the hallway (a robot, in the hallway)", r.registering && r.alarm && r.alarm.who === "who-robot" && r.alarm.where === "where-hallway" && r.alarm.place === "hallway", r);

// beat 38a: Jupiter's big red storm
// 36b to 39, round 7 (Brian's video notes of 2026-11-27, r5 4:49 to 6:08; question 119, the pick A)
r = await ev(() => {
  const n = window.__ss.op;
  // (a button of Mops's: offered where he stands)
  window.__pressMo = (label) => {
    ss.tick(0.05);
    const o = ss.offerNow();
    if (!o || o.verb + " · " + o.cap !== label) return false;
    o.f();
    return true;
  };
  const ss = window.__ss;
  window.__jump(37);
  n.sq.x = 60;
  n.sq.y = 330;
  // the hall's doorway starts the party hall's cleaning robots (36b, loading-bay.js): Mops says where, HIDE · bar
  const bay = window.SSQ.beat("ch1-bay"),
    said = [],
    sneak = [];
  const hear = () => {
    window.__st() && sneak[sneak.length - 1] !== window.__st() && sneak.push(window.__st());
    n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text);
    n.cur && n.cur.k === "card" && (window.__card = n.cur.text + " " + (n.cur.by || ""));
  };
  window.__run(30, () => bay.active() && n.ctrl && !n.cur && n.room === "hall", hear);
  ss.drawFrame();
  const out = { room: n.room, bayStep: (n.ch1Bay || {}).step, chip: n.ch1Chip, first: said.slice(), hide: !!window.__spot("HIDE · bar"), outline: bay.debug().drew && bay.debug().drew.outline, robots: (n.ch1Bay.hall || {}).robots.length, seen: !!n.ch1Bay.alarm };
  out.pressed = window.__press("HIDE · bar");
  said.length = 0;
  let hiddenAtPa = null,
    cleaners = 0,
    player = "";
  window.__run(60, () => window.__st() === "window", () => {
    hear();
    cleaners = Math.max(cleaners, (n.ch1Evening.cleaners || []).length);
    n.cur && n.cur.b && n.cur.b.text === "The Great Red Storm is passing!" && (hiddenAtPa = n.ch1Evening.pose);
  });
  player = ss.ch.mops ? "mops" : "sq";
  ss.drawFrame();
  const d = window.SSQ.beat("ch1-evening").debug();
  return { ...out, sneak, said, hiddenAtPa, cleaners, left: (d.state.cleaners || []).length, player, pose: d.state.pose, storm: d.state.storm, cards: [window.__card] };
});
g.check("36b: as they walk into the hall Mops says \"Behind the bar. Quick.\"; the aisle behind the bar is outlined; HIDE · bar, at once (the robots clean)", r.room === "hall" && r.bayStep === "hall" && r.first.join("|") === "Behind the bar. Quick." && r.chip === "Squatch: hide behind the bar" && r.hide && r.robots === 3 && !r.seen && r.outline && r.outline.x0 === PL.EV_BAR.aisle.x0, r);
g.check("HIDE · bar hands over to the evening with the three robots; he is rolled up behind the bar before the announcement", r.pressed && r.sneak.includes("tostorm") && r.cleaners === 3 && r.hiddenAtPa === "hidden" && r.pose === "hidden", r);
g.check("Mops at the bar's front: MOVE, GOAT. / You missed a corner. / CORNERS ARE NOT EFFICIENT.; then the PA; the robots stop and roll out", r.said.join("|") === "MOVE, GOAT.|You missed a corner.|CORNERS ARE NOT EFFICIENT.|The Great Red Storm is passing!|Best view: the big window.|GUESTS PRESENT. CLEANING PAUSED." && r.left === 0 && r.storm > 0.5, r);
g.check("the switch is announced: the player is Mops now, and why", r.player === "mops" && /You are MOPS now\. Squatch stays hidden\. Mops meets the guests\./.test(r.cards.join(" ")), r);
r = await ev(() => {
  const n = window.__ss.op,
    ss = window.__ss;
  const said = [],
    ears = [];
  let alarm = false;
  window.__run(60, () => window.__st() === "greet" && n.ctrl, () => {
    n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && (said.push(n.cur.b.text), ears.push(!!n.cur.b.ear));
    alarm = alarm || !!n.ch1Evening.alarm;
  });
  ss.drawFrame();
  const d = window.SSQ.beat("ch1-evening").debug();
  const off = ss.offerNow();
  return { said, ears, alarm, step: window.__st(), chip: n.ch1Chip, guests: (d.state.guests || []).map((q) => q.role + ":" + q.to), offer: off && off.verb + " · " + off.cap, eyes: !!d.state.peek, pose: d.state.pose, stepId: n.ch1Step };
});
g.check("the guests walk in to the window; the family's Mars talk is overheard (the ear), and no other food is named (question 120)", r.said.slice(0, 5).join("|") === "Whoa. It's SO red.|Red like Mars.|Oh, we loved Mars.|What did you like best?|The " + FAMILY.NAME + "!" && r.ears.slice(0, 5).every(Boolean) && !r.said.some((t) => new RegExp("pan" + "cake", "i").test(t)), r);
g.check("the kid sees the goat: \"A GOAT! Can I pet him?\" / \"That's the Ganitor. He's famous.\" / \"The only goat janitor in the whole galaxy.\"", r.said.slice(5).join("|") === "A GOAT! Can I pet him?|That's the Ganitor. He's famous.|The only goat janitor in the whole galaxy.", r);
g.check("the family comes over to the bar (the other guest stays at the window); Squatch stays rolled up, no eyes peek, nobody sees him; GREET · kid is Mops's", r.step === "greet" && r.guests.join(",") === "dad:bar,mom:bar,kid:bar,guest:window" && r.pose === "hidden" && !r.eyes && !r.alarm && r.offer === "GREET · kid" && r.chip === "Mops: say hello to the kid" && r.stepId === "ev-greet", r);
r = await ev(() => {
  const n = window.__ss.op,
    ss = window.__ss;
  const pressed = window.__pressMo("GREET · kid");
  const said = [];
  let pat = false,
    bleat = window.SSQ.soundPicksPlayed ? window.SSQ.soundPicksPlayed().length : 0;
  window.__run(30, () => window.__st() === "ask" && n.ctrl, () => {
    n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text);
    pat = pat || n.ch1Evening.pat >= 0;
  });
  const kid = n.ch1Evening.guests.find((q) => q.role === "kid");
  const off = ss.offerNow();
  return { pressed, said, pat, step: window.__st(), offer: off && off.verb + " · " + off.cap, guests: n.ch1Evening.guests.map((q) => q.role + ":" + q.to), chip: n.ch1Chip };
});
g.check("GREET · kid: the kid steps up and pets him (wordless); \"Come on. Bedtime.\"; the family turns to go; TALK · family", r.pressed && r.pat && r.said.join("|") === "Come on. Bedtime." && r.step === "ask" && r.offer === "TALK · family" && r.guests.slice(0, 3).join(",") === "dad:leave,mom:leave,kid:leave" && r.chip === "Mops: ask the family about the " + FAMILY.name, r);
r = await ev(async () => {
  const n = window.__ss.op,
    ss = window.__ss,
    b = window.SSQ.beat("ch1-evening");
  const pressed = window.__pressMo("TALK · family");
  const said = [];
  let wide = false,
    up = false;
  const hear = () => {
    n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text);
    wide = wide || !!n.ch1Evening.mopsWide;
    up = up || n.ch1Evening.brochure === "up";
    n.cur && n.cur.k === "card" && (window.__card = n.cur.text + " " + (n.cur.by || ""));
  };
  window.__run(60, () => b.viewOpen() === "brochure", hear);
  const open = b.viewOpen(),
    has = n.ch1Evening.brochure;
  // the words the brochure close-up draws (its picture only)
  const bw = [],
    CP = CanvasRenderingContext2D.prototype,
    keep = CP.fillText;
  CP.fillText = function (t) {
    this.canvas.getAttribute("aria-label") === "brochure" && bw.push(String(t));
    return keep.apply(this, arguments);
  };
  await new Promise((q) => setTimeout(q, 250));
  CP.fillText = keep;
  // it waits for a tap
  window.__run(4);
  const waited = b.viewOpen() === "brochure" && window.__st() === "read";
  window.__run(1);
  const t = b.viewTargets();
  window.__tapView("brochure", t.close);
  const n0 = said.length;
  let tossed = false;
  window.__run(60, () => window.__st() === "gohome" && n.ctrl, () => (hear(), (tossed = tossed || n.ch1Evening.brochure === "toss")));
  return { pressed, said, n0, wide, up, open, has, waited, tossed, brochureWords: [...new Set(bw)], step: window.__st(), player: ss.ch.mops ? "mops" : "sq", pose: n.ch1Evening.pose, brochure: n.ch1Evening.brochure, got: n.ch1Brochure, guests: n.ch1Evening.guests, mops: n.moPose, cards: [window.__card] };
});
g.check("TALK · family: Mops asks, in Brian's words; the best he ever had, and fizzy (Mops stops, eyes wide); Wookiees; only at their stand", r.pressed && r.said.slice(0, r.n0).join("|") === "Hey. What were you saying about " + FAMILY.name + "?|The best I've ever had.|And FIZZY!|A family of Wookiees makes them.|You can only get them at their stand.|In fact, I've got a brochure here." && r.wide && !r.said.some((t) => /Sasquatch/.test(t)), r);
g.check("Dad holds the brochure up and hands it to Mops: its close-up opens and waits for a tap", r.up && r.open === "brochure" && r.has === "mops" && r.waited, r);
g.check("the brochure is for the stand: no words but his family's name (snack-name.js FAMILY) on the cake box", r.brochureWords.length === 1 && r.brochureWords[0] === FAMILY.NAME, r.brochureWords);
g.check("the guests leave; the switch back is announced; Mops passes the brochure over the bar: \"Take this home.\" / \"We'll talk tonight.\"; Mops goes back to work", r.said.slice(r.n0).join("|") === "Take this home.|We'll talk tonight." && r.tossed && r.guests === null && r.player === "sq" && /You are SQUATCH now\. The guests are gone\. Squatch can come out\./.test(r.cards.join(" ")) && r.pose === "stand" && r.brochure === "paw" && r.got === true && r.step === "gohome" && r.mops === "hidden", r);
// without the bay's 36b (the debug link's beat 38): the same hide, his own button
r = await ev(() => {
  const n = window.__ss.op;
  window.__jump(38);
  window.__ss.drawFrame();
  const out = { step: window.__st(), spot: !!window.__spot("HIDE · bar"), player: window.__ss.ch.mops ? "mops" : "sq" };
  out.pressed = window.__press("HIDE · bar");
  window.__run(60, () => window.__st() === "greet" && n.ctrl);
  return { ...out, step2: window.__st(), pose: n.ch1Evening.pose, player2: window.__ss.ch.mops ? "mops" : "sq" };
});
g.check("the debug link's beat 38: HIDE · bar, then the same storm and guests with no robots", r.step === "hide" && r.spot && r.player === "sq" && r.pressed && r.step2 === "greet" && r.pose === "hidden" && r.player2 === "mops", r);
// ↺ while the player is Mops brings the step back, still as Mops; a jump to a Squatch step gives Squatch back
r = await ev(() => {
  const n = window.__ss.op,
    ss = window.__ss;
  window.__jump(39);
  const a = { step: window.__st(), player: ss.ch.mops ? "mops" : "sq", offer: (ss.tick(0.05), ss.offerNow()) };
  window.__jump(139);
  return { a: { ...a, offer: a.offer && a.offer.verb + " · " + a.offer.cap }, step: window.__st(), player: ss.ch.mops ? "mops" : "sq", brochure: n.ch1Evening.brochure };
});
g.check("the debug link's beat 39 opens at TALK · family as Mops; beat 139 at the walk home as Squatch, the brochure in his paw", r.a.step === "ask" && r.a.player === "mops" && r.a.offer === "TALK · family" && r.step === "gohome" && r.player === "sq" && r.brochure === "paw", r);
// (from the independent review) the player is never left as Mops; Mops stays at the bar; his two goals are outlined
r = await ev(() => {
  const n = window.__ss.op,
    ss = window.__ss,
    b = window.SSQ.beat("ch1-evening");
  window.__jump(138);
  ss.drawFrame();
  const greet = b.debug().drew.outline,
    kid = n.ch1Evening.guests.find((q) => q.role === "kid");
  // he tries to walk off across the hall: he gets a step or two, no further
  let far = 0;
  for (let i = 0; i < 60; i++) {
    n.walkTo = { x: 300, y: 400, room: n.room, lx: n.mo.x, ly: n.mo.y, lt: n.T };
    ss.tick(0.05);
    far = Math.max(far, Math.hypot(n.mo.x - b.place.STORM.mops.x, n.mo.y - b.place.STORM.mops.y));
  }
  n.walkTo = null;
  const asMops = ss.ch.mops;
  window.__jump(39);
  ss.drawFrame();
  const ask = b.debug().drew.outline;
  // the evening goes away while he is Mops (a jump to another beat): Squatch is the player again
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(22);
  for (let i = 0; i < 4; i++) ss.tick(0.05);
  const after = ss.ch.mops ? "mops" : "sq";
  // (back to where the next checks go on from: the walk home)
  window.__jump(139);
  return { greet, kid: { x: kid.x, y: kid.y }, far: Math.round(far), asMops, ask, after };
});
g.check("GREET · kid has the dashed outline round the kid; TALK · family round the family", r.greet && r.greet.x0 < r.kid.x && r.greet.x1 > r.kid.x && r.greet.x1 - r.greet.x0 < 60 && r.ask && r.ask.x1 - r.ask.x0 > 80, r);
g.check("as Mops the player can shuffle a step or two at the bar and no further (the family comes to him)", r.asMops && r.far > 0 && r.far <= 42, r.far); // (30, evening-place.js STORM.mopsRoam, and one frame's step)
g.check("when the evening goes away while the player is Mops (a jump to another beat), the player is Squatch again", r.after === "sq", r);
r = await ev(() => {
  const n = window.__ss.op;
  window.__ss.drawFrame();
  return { ring: n.lastRing && n.lastRing.id, words: document.body.innerText.includes("Squatch: go home") };
});
g.check("no goal bar: the home doorway is outlined and the goal words wait", r.ring === "ev-home" && !r.words, r);

// beat 39b: home alone
r = await ev(() => {
  const n = window.__ss.op;
  n.sq.x = 477;
  n.sq.y = 590;
  window.__run(14, () => window.__st() === "box" && n.ctrl);
  const out = { room: n.room, step: window.__st(), mops: n.moPose, open: !!window.__spot("OPEN · box") };
  out.opened = window.__press("OPEN · box");
  window.__run(3, () => window.__st() === "bite" && n.ctrl);
  out.bite = window.__press("BITE · cake");
  window.__run(0.8);
  window.__ss.drawFrame();
  out.cake = window.SSQ.beat("ch1-evening").debug().drew.cake;
  const said = [];
  window.__run(6, () => window.__st() === "crate" && n.ctrl, () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text));
  out.said = said;
  out.chartSpot = !!window.__spot("X · chart");
  out.crate = !!window.__spot("HOLD UP · brochure");
  out.chart = window.SSQ.cakeChartDrawn ? window.SSQ.cakeChartDrawn() : null;
  out.ring = n.lastRing && n.lastRing.id;
  return out;
});
g.check("beat 39b: home alone (Mops is not back); OPEN · box (the Guardians' box); BITE · cake: a crunch, silence, \"No fizz.\"", r.room === "closet" && r.step === "box" && r.mops === "hidden" && r.open && r.opened && r.bite && r.cake === 1 && r.said.join("|") === "No fizz.", r);
g.check("round 7 (question 129): no X · chart step; the chart over his bed is a picture only (a title, cakes each crossed out, no label); HOLD UP · brochure is next", !r.chartSpot && r.crate && !!r.chart && r.chart.label === "" && r.chart.crossed === r.chart.tried && r.chart.tried >= 6, r);
r = await ev(async () => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  const pressed = window.__press("HOLD UP · brochure");
  window.__run(1);
  await new Promise((q) => setTimeout(q, 200));
  const drew = b.debug().view && b.debug().view.drew,
    t = b.viewTargets();
  // it waits for a tap
  window.__run(4);
  const waited = b.viewOpen() === "crate" && window.__st() === "hold";
  window.__tapView("crate", t.close);
  const said = [];
  window.__run(8, () => window.__st() === "evening", () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text));
  const stamp = window.SSQ.crateStampDrawn ? window.SSQ.crateStampDrawn() : null;
  return { pressed, kind: t && t.kind, drew, waited, said, step: window.__st(), crayonNow: stamp && stamp.crayonNow };
});
g.check("HOLD UP · brochure (question 121): one close-up, the family's name on the paper beside the faded stamp on the wood; no slide, no crayon; it waits for a tap", r.pressed && r.kind === "crate" && r.drew && r.drew.paper === FAMILY.NAME && r.drew.letters === FAMILY.NAME.slice(1).replace(/ /g, "") && r.drew.crayon === false && r.waited, r);
g.check("\"We always thought it said STARS.\" / \"Maybe it's MARS!\"", r.said.join("|") === "We always thought it said STARS.|Maybe it's MARS!", r);
g.check("no crayon ST layer on his crate bed (crate-stamp.js STAMP_CRAYON)", r.crayonNow === false, r.crayonNow);
// beat 40: the fight
r = await ev(() => {
  const n = window.__ss.op;
  const cards = [];
  window.__heartsIn = 0;
  window.__run(16, () => window.__st() === "show" && n.ctrl, () => {
    n.cur && n.cur.k === "card" && cards.push(n.cur.text);
    // (his hearts as he comes home: the frame's own drawing)
    if (n.ch1Evening.heartsAt >= 0) (window.__ss.drawFrame(), (window.__heartsIn = Math.max(window.__heartsIn, window.SSQ.beat("ch1-evening").debug().drew.hearts || 0)));
  });
  window.__run(3);
  const pressed = window.__press("SHOW · brochure");
  window.__run(0.6);
  window.__ss.drawFrame();
  const held = window.SSQ.beat("ch1-evening").debug().drew;
  const said = [];
  window.__run(60, () => window.__st() === "choose" && n.ctrl, () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text));
  return { cards: [...new Set(cards)], pressed, held: held && held.held, hearts: held && held.hearts, heartsIn: window.__heartsIn, said, step: window.__st(), ask: !!window.__spot("ASK · again"), stomp: !!window.__spot("STOMP · to bed") };
});
g.check("beat 40: \"That evening…\"; Mops comes home: two or three hearts as he first sees him, then none (question 126); SHOW · brochure, he holds it up", r.cards.includes("That evening…") && r.heartsIn >= 2 && r.heartsIn <= 3 && r.pressed && r.held && r.held.w > 50 && !r.hearts, r);
g.check("the fight (question 122): maybe MARS, he came in that crate, the man said Wookiees, YOU thought I was a Wookiee, one of a kind, the manager, safe here, the Guardians", r.said.join("|") === "Mops! Look. Maybe my crate says MARS.|...Maybe.|I came in that crate. Maybe I came from Mars!|Can we go?|The man said Wookiees. You're not a Wookiee.|YOU thought I was a Wookiee!|Squatch. There are no other Sasquatches.|You're one of a kind. Like me.|I know what it's like to be one of a kind.|You heard the manager.|They need me here.|What if they replace you anyway?|They won't.|And we're safe here.|Safe? I have to HIDE here.|The Guardians are here." && !r.said.some((t) => /SASQUATCHES|Stars\./.test(t)), r);
g.check("then the player picks: ASK · again (where he stands) or STOMP · to bed (at the bed)", r.step === "choose" && r.ask, r);
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  const pressed = window.__press("STOMP · to bed");
  const said = [];
  let back = false,
    hearts = [];
  window.__run(40, () => window.__st() === "bed" && n.ctrl, () => {
    n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text);
    window.__ss.drawFrame();
    hearts.push(b.debug().drew.hearts || 0);
    back = back || !!b.viewOpen();
  });
  return { pressed, said, back, hearts, step: window.__st(), turned: n.ch1Evening.turned };
});
g.check("STOMP · to bed: Mops calls him back first; \"Why won't you help me find my family?\" ... \"Squatch... I already...\" and he turns his back in the room (no close-up)", r.pressed && r.said[0] === "Squatch. Wait." && r.said[1] === "Why won't you help me find my family?" && r.said[2] === "Squatch... I already..." && !r.back && r.turned, r);
g.check("it ends on his line (question 122: B): \"I AM your family.\" / \"Maybe my REAL family wouldn't make me hide!\" / (no take-back, no forgiving line) / \"Bed. The floors don't mop themselves.\"", r.said.slice(3).join("|") === "I AM your family.|Maybe my REAL family wouldn't make me hide!|Bed. The floors don't mop themselves.", r);
g.check("no hearts anywhere in the fight", r.hearts.every((h) => !h), r.hearts.filter(Boolean).length);
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  window.__run(6, () => window.__st() === "bed" && n.ctrl);
  const pressed = window.__press("SLEEP · bed");
  const seen = { tip: 0, roll: 0, zzz: 0, dim: 0, bedtime: false, ideas: [], said: [] };
  window.__run(50, () => {
    const s = n.ch1Evening;
    s.idea && seen.ideas[seen.ideas.length - 1] !== s.idea.id && seen.ideas.push(s.idea.id);
    n.cur && n.cur.b && seen.said[seen.said.length - 1] !== n.cur.b.text && seen.said.push(n.cur.b.text);
    s.mopsSleep && ((seen.tip = Math.max(seen.tip, s.mopsSleep.tip)), (seen.roll = Math.max(seen.roll, s.mopsSleep.roll)));
    seen.zzz = Math.max(seen.zzz, s.zzz);
    seen.dim = Math.max(seen.dim, s.dim);
    s.dim > 0.5 && !n.ctrl && (seen.quiet = seen.quiet !== false && window.SSQ.refinedCue("home") === "");
    return window.__st() === "out" && n.ctrl;
  });
  const solid = window.__ss.solids().some((q) => q.x1 === 536 && q.y0 === 562 && q.y1 === 592);
  const inBed = !!n.ch1Evening.bed;
  // his first move gets him out of bed (the kid's to start)
  n.walkTo = { x: 600, y: 470, room: n.room, lx: n.sq.x, ly: n.sq.y, lt: n.T };
  window.__ss.tick(0.05);
  window.__run(4, () => !n.ch1Evening.bed && n.ctrl);
  const up = { bed: !!n.ch1Evening.bed, x: Math.round(n.sq.x), y: Math.round(n.sq.y), ctrl: n.ctrl };
  return { pressed, seen, inBed, up, step: window.__st(), sqPose: n.sqPose, solid, sneak: n.ch1Sneak };
});
g.check("beat 41: SLEEP · bed; the light goes down with no song tonight; Mops tips over like a fainting goat and sleeps on his side, his head on his bucket; snores", r.pressed && r.seen.tip >= 1 && r.seen.roll >= 1 && r.seen.zzz > 0 && r.seen.dim >= 1 && r.seen.quiet === true, r);
g.check("beat 41: his eyes open; the idea above his head in pictures (Mops mopping, robots mopping, the ship to the red dot), his whisper, then the form", r.seen.ideas.join(",") === "mopping,robots,ship,form" && r.seen.said.join("|") === "The floors don't mop themselves...|But those robots do.|The form!", r.seen);
g.check("night one: Squatch is still in bed, the kid's to move; his first move gets him out of bed beside it", r.step === "out" && r.inBed && !r.up.bed && r.up.ctrl && r.up.x === 340 && r.up.y === 470, r);
g.check("night one: Mops lies asleep on the floor and nobody walks through him; the sneaking music is on", r.solid && r.sneak, r);

// beat 42a: sneak out past sleeping Mops (a bump on his bucket: a clang, "Weee...?", and back beside the bed)
r = await ev(() => {
  const n = window.__ss.op;
  n.sq.x = 566;
  n.sq.y = 496;
  window.__ss.tick(0.05);
  const said = [];
  window.__run(6, () => window.__st() === "out" && n.ctrl && !n.ch1Evening.bumping, () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text));
  return { said, back: { x: Math.round(n.sq.x), y: Math.round(n.sq.y) }, bumps: n.ch1Evening.bumps, alarm: !!n.ch1Evening.alarm, chip: window.SSQ.beat("ch1-evening") && n.ch1Chip };
});
g.check("bumping Mops's bucket at night: a clang, Mops snorts \"Weee...?\", and he is back beside his bed (no capture)", r.said.join("|") === "Weee...?" && r.bumps === 1 && !r.alarm && r.back.x === 340 && r.back.y === 470, r);
r = await ev(() => {
  const n = window.__ss.op;
  const walk = (x, y, step) => ((n.sq.x = x), (n.sq.y = y), window.__run(10, () => window.__st() === step && n.ctrl));
  const a = walk(860, 440, "nighthall");
  window.__ss.drawFrame();
  const hall = window.SSQ.beat("ch1-evening").debug();
  const b = walk(905, 320, "nightway"),
    c = walk(900, 330, "bin");
  return { a, b, c, room: n.room, d: n.ch1D, chip: n.ch1Chip, hallVent: hall.night && hall.night.hall };
});
g.check("the kid sneaks out himself: home, the hall (its night look), the hallway, into the loading bay at night; the goal: \"Squatch: get the form from the bin\"", r.a && r.b && r.c && r.room === "hangar" && r.d && r.chip === "Squatch: get the form from the bin", r);
// beat 42b: the choice
r = await ev(async () => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  const pressed = window.__press("GRAB · copies");
  const said = [];
  window.__run(8, () => b.viewOpen() === "order", () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text));
  window.__run(0.7);
  await new Promise((q) => setTimeout(q, 200));
  const t = b.viewTargets();
  const choose = b.debug().view.drew.choose;
  // PUT BACK · bin: the short ending, the cards one at a time, then GO BACK · to the form
  window.__tapView("order papers", t.putBack);
  window.__run(0.2);
  await new Promise((q) => setTimeout(q, 150));
  const cutaway = b.debug().view.drew.ending;
  window.__run(3.6);
  await new Promise((q) => setTimeout(q, 150));
  const cards = [];
  for (let i = 0; i < 4; i++) {
    window.__tapView("order papers", b.viewTargets().tap);
    window.__run(0.1);
    await new Promise((q) => setTimeout(q, 120));
    cards.push(b.debug().view.drew.card);
  }
  const goBack = b.debug().view.drew.goBack;
  window.__tapView("order papers", b.viewTargets().goBack);
  window.__run(0.7);
  await new Promise((q) => setTimeout(q, 150));
  return { pressed, said, choose, cutaway, cards, goBack, again: b.debug().view.drew.choose, papers: n.ch1Evening.papers, step: window.__st() };
});
g.check("GRAB · copies: his whisper, \"If they replace Mops...\" / \"Maybe he would come with me.\" / \"Or put it back. And stay.\"; the close-up with the two pictures to pick from", r.pressed && r.said.join("|") === "If they replace Mops...|Maybe he would come with me.|Or put it back. And stay." && r.choose, r);
g.check("PUT BACK · bin: a wordless cutaway, years later, \"Squatch put it back.\" ... \"THE END?\", then GO BACK · to the form, back at the choice", r.cutaway === "cutaway" && r.cards.join("|") === "Squatch put it back.|Mops kept mopping. Squatch kept hiding.|They lived happily-ish ever after.|THE END?" && r.goBack && r.again && r.papers === "paw" && r.step === "order", r);
r = await ev(async () => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  // the words the close-up draws (read from its own canvas's calls while it is up)
  const words = [],
    P = CanvasRenderingContext2D.prototype,
    keep = P.fillText;
  P.fillText = function (t) {
    this.canvas.getAttribute("aria-label") === "order papers" && words.push(t);
    return keep.apply(this, arguments);
  };
  await new Promise((q) => setTimeout(q, 300));
  P.fillText = keep;
  window.__tapView("order papers", b.viewTargets().mark);
  window.__run(0.1);
  await new Promise((q) => setTimeout(q, 120));
  const t = b.viewTargets();
  const before = n.ch1Paw;
  window.__tapView("order papers", t.box, "pointerdown");
  window.__run(0.2);
  await new Promise((q) => setTimeout(q, 150));
  const pressing = b.debug().view && b.debug().view.drew;
  window.__run(0.6);
  await new Promise((q) => setTimeout(q, 150));
  const through = b.debug().view && b.debug().view.drew;
  window.__tapView("order papers", t.box, "pointerup");
  window.__run(3, () => window.__st() === "post" && n.ctrl);
  window.__ss.drawFrame();
  return { words: [...new Set(words)], before, after: n.ch1Paw, pressing, through, step: window.__st(), open: !!document.querySelector('canvas[aria-label="order papers"]'), papers: n.ch1Evening.papers, ring: n.lastRing && n.lastRing.id };
});
g.check("the close-up draws ORDER MORE ROBOTS, the office code 169556 in pen (pen-digits.js, as in the bay and the escape), and the two buttons MARK · box and PUT BACK · bin", ["ORDER MORE ROBOTS", "MARK · box", "PUT BACK · bin"].every((w) => r.words.includes(w)) && !!r.through && (r.through.pen || []).includes("169556"), { words: r.words, pen: r.through && r.through.pen });
g.check("MARK · box: his paw on the box marks it (a paw print), it presses through, the yellow tears off; the mailbox is outlined", !r.before && r.after === 1 && r.pressing && r.pressing.mark > 0 && r.through.tear > 0 && r.step === "post" && !r.open && r.papers === "both" && r.ring === "ev-post", r);
// beat 42c: post it (round 7, r5 9:29 and 13:18, q: 125): the robots sleep (zzz, no cones) until the loud post wakes
// them; he hides in the crate by the floor vent, which takes the pink sheet (paper: no alarm)
r = await ev(() => {
  const n = window.__ss.op,
    s = () => n.ch1Evening,
    b = window.SSQ.beat("ch1-evening");
  window.__ss.drawFrame();
  const before = { awake: !!s().awake, cones: (b.debug().drew && b.debug().drew.cones) || null, robotCones: window.__ss.conesNow ? window.__ss.conesNow().length : null };
  const pressed = window.__press("POST · mailbox");
  const said = [];
  window.__run(8, () => s().postHide && n.ctrl, () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text + (n.cur.b.ear ? " (ear)" : "")));
  const out = { before, pressed, said, awake: !!s().awake, alarm: !!s().alarm, offers: window.__ss.spotsNow().map((q) => q.verb + " · " + q.cap), chip: window.__ss.chipNow(), mailed: n.ch1Mailed };
  // he slips out of the mail room and along the front to the crate by the floor vent, while the robot looks up
  for (const w of [{ x: 700, y: 463 }, { x: 645, y: 463 }]) ((n.sq.x = w.x), (n.sq.y = w.y), window.__ss.tick(0.05));
  window.__run(8, () => b.place.nightLook(s().nightT).phase === "up");
  for (const w of [{ x: 560, y: 560 }, { x: 420, y: 566 }, { x: 300, y: 566 }]) ((n.sq.x = w.x), (n.sq.y = w.y), window.__ss.tick(0.05));
  out.hid = window.__press("HIDE · crate");
  const after = [];
  window.__run(40, () => window.__st() === "back" && n.ctrl, () => {
    n.cur && n.cur.b && after[after.length - 1] !== n.cur.b.text && after.push(n.cur.b.text);
    out.maxSuck = Math.max(out.maxSuck || 0, s().suck);
    s().alarm && (out.alarmAfter = true);
  });
  out.after = after;
  out.step = window.__st();
  out.pink = s().pink;
  out.sucked = n.ch1PinkSucked;
  return out;
});
g.check("night one before the post: the robots are asleep (round 7, q: 125)", r.before.awake === false, r.before);
g.check("POST · mailbox is loud: \"MAIL SCANNED.\" / \"PAWATURE ACCEPTED.\", \"Shhh!\"; the robots wake: \"NIGHT SHIFT.\" \"CLEANING.\"; no alarm; \"Squatch: hide\"", r.pressed && r.said.join("|") === "MAIL SCANNED.|PAWATURE ACCEPTED.|Shhh!|NIGHT SHIFT.|CLEANING." && r.awake && !r.alarm && r.mailed === 1 && r.chip === "Squatch: hide", r);
g.check("the one place to go is the crate by the floor vent: HIDE · crate", r.offers.join("|") === "HIDE · crate", r.offers);
g.check("in the crate the floor vent takes the pink sheet (\"No! The pink one!\") with no alarm (paper never rings it); \"...The yellow one got mailed.\" / \"It's done.\"", r.hid && r.maxSuck > 0.5 && r.pink === "vent" && r.sucked === 1 && !r.alarmAfter && r.after.join("|") === "No! The pink one!|...The yellow one got mailed.|It's done." && r.step === "back", r);
r = await ev(() => {
  const n = window.__ss.op;
  const walk = (x, y, step) => ((n.sq.x = x), (n.sq.y = y), window.__run(10, () => window.__st() === step && n.ctrl));
  // round the night robot: wait for its look at the back wall, then along the front
  const look = window.SSQ.beat("ch1-evening").place.nightLook;
  walk(650, 585, "back");
  window.__run(8, () => look(n.ch1Evening.nightT).phase === "up" && look(n.ch1Evening.nightT - 0.06).phase !== "up");
  const a0 = walk(70, 330, "backway");
  const a = walk(60, 330, "backhall"),
    b = walk(477, 590, "tobed");
  const pressed = window.__press("SLEEP · bed");
  const es = window.SSQ.beat("ch1-escape");
  window.__run(10, () => es.active());
  const week = es.active() && es.debug().state;
  return { a0, a, b, pressed, escape: es.active(), cu: week && week.cu, done: !n.ch1Evening || n.ch1Evening.step === "done", lights: n.ch1Lights };
});
g.check("home to bed: SLEEP · bed, he falls asleep, and beat 43 starts (the escape: \"Six days later\" on the home calendar)", r.a0 && r.a && r.b && r.pressed && r.escape && r.cu === "cal" && r.done && r.lights === 1, r);

// the one capture rule in the bay
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    look = b.place.nightLook;
  window.__jump(144); // (round 7, q: 125: the robots sleep until the post, so the capture rule is tried on the way back)
  window.__run(8, () => look(n.ch1Evening.nightT).phase === "down" && look(n.ch1Evening.nightT).catch);
  n.sq.x = 480;
  n.sq.y = 585;
  window.__run(1, () => !!n.ch1Evening.alarm);
  const a = n.ch1Evening.alarm;
  const out = { alarm: !!a, by: a && a.w.id, place: a && a.place };
  // (he dashes for the plant at once, before the guards come in)
  const save = { x: n.sq.x, y: n.sq.y };
  window.__run(6, () => n.ch1Evening.alarm && n.ch1Evening.alarm.phase === "search");
  const w = n.ch1Evening.alarm.w;
  out.ran = Math.hypot(w.x - b.place.BAY.alarmRun.x, w.y - b.place.BAY.alarmRun.y) < 4;
  out.guards = n.ch1Evening.alarm.guards.map((g) => g.room);
  out.offers = window.__ss.spotsNow().map((s) => s.verb + " · " + s.cap);
  return out;
});
// a robot reacts only once its drawn cone has stayed on him about half a second ("?" while it registers him), and a
// cone that stops short of him never sees him
const reg = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  window.__jump(144); // (round 7, q: 125: the robots sleep until the post, so the capture rule is tried on the way back)
  window.__run(8, () => b.place.nightLook(n.ch1Evening.nightT).phase === "down" && b.place.nightLook(n.ch1Evening.nightT - 0.06).phase !== "down");
  // just past the cone's end, straight below the robot: the cone stops short of him
  n.sq.x = 480;
  n.sq.y = 372 + 210 + 100;
  const short = b.seenNow();
  n.sq.y = 585;
  const on = b.seenNow();
  for (let i = 0; i < 6; i++) window.__ss.tick(0.05);
  const at03 = { alarm: !!n.ch1Evening.alarm, q: (b.debug().state.qs || {}) };
  window.__ss.drawFrame();
  const marks = [];
  const P = CanvasRenderingContext2D.prototype,
    keep = P.fillText;
  P.fillText = function (t) {
    marks.push(t);
    return keep.apply(this, arguments);
  };
  window.__ss.drawFrame();
  P.fillText = keep;
  for (let i = 0; i < 6; i++) window.__ss.tick(0.05);
  return { short, on, alarmAt03: at03.alarm, questionDrawn: marks.includes("?"), alarmAt06: !!n.ch1Evening.alarm };
});
g.check("a robot's cone that stops short of him does not see him; on him it registers for half a second (a \"?\") before the alarm", !reg.short && reg.on && !reg.alarmAt03 && reg.questionDrawn && reg.alarmAt06, reg);
g.check("seen in the bay: the robot shows \"!\" and runs to the FUR alarm on the bay's wall; guards come", r.alarm && r.by === "night-robot" && r.place === "bay" && r.ran && r.guards.length === 2 && r.guards.every((q) => q === "hangar"), r);
g.check("during the alarm the real hiding places are offered (the plant, the crate by the vent), not the ball (a ball never fools a search)", !r.offers.includes("ROLL · ball") && r.offers.includes("HIDE · plant") && r.offers.includes("HIDE · crate"), r);
// again, and this time he hides in the plant as soon as the robot shouts
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    look = b.place.nightLook;
  window.__jump(144); // (round 7, q: 125: the robots sleep until the post, so the capture rule is tried on the way back)
  window.__run(8, () => look(n.ch1Evening.nightT).phase === "down" && look(n.ch1Evening.nightT).catch);
  n.sq.x = 480;
  n.sq.y = 585;
  window.__run(1, () => !!n.ch1Evening.alarm);
  return { alarm: !!n.ch1Evening.alarm };
});
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  n.sq.x = b.place.BAY.plant.x;
  n.sq.y = b.place.BAY.plant.y;
  window.__ss.tick(0.05);
  const o = window.__ss.offerNow();
  o && o.verb === "HIDE" && o.f();
  const lost0 = b.debug().lost;
  for (let i = 0; i < 600 && n.ch1Evening.alarm; i++) window.__ss.tick(0.05);
  const lost = b.debug().lost === lost0 + 1;
  return { hid: o && o.verb + " · " + o.cap, over: !n.ch1Evening.alarm, lost, step: window.__st(), ctrl: n.ctrl, jail: !!(n.cur && n.cur.id === "jail") };
});
g.check("hidden in the plant through the search: the guards give up (\"They lost you.\"), the step goes on", r.hid === "HIDE · plant" && r.over && r.lost && r.step === "back" && r.ctrl && !r.jail, r);
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    look = b.place.nightLook;
  window.__jump(144); // (round 7, q: 125: the robots sleep until the post, so the capture rule is tried on the way back)
  window.__run(8, () => look(n.ch1Evening.nightT).phase === "down" && look(n.ch1Evening.nightT).catch);
  n.sq.x = 480;
  n.sq.y = 585;
  let card = "";
  for (let i = 0; i < 600 && !card; i++) {
    window.__ss.tick(0.05);
    n.cur && n.cur.id === "jail" && (card = n.cur.cause || "");
  }
  window.__run(20, () => n.ctrl && !n.cur && window.__st() === "back");
  return { card, step: window.__st(), x: Math.round(n.sq.x), alarm: !!(n.ch1Evening && n.ch1Evening.alarm) };
});
g.check("seen and standing still: a guard catches him, the LOCKUP card names a robot in the delivery room, the step restarts", r.card === "A robot saw Squatch in the delivery room. Security caught him." && r.step === "back" && !r.alarm, r);

// ↺: in each step he controls the step comes back; between steps, back to the last one he controlled
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    out = {};
  for (const [beat, nonControl, want] of [
    [37, "gallery", "wall"],
    [38, "storm", "hide"],
    [138, "pet", "greet"],
    [39, "talk", "ask"],
    [141, "hold", "crate"],
    [40, "fight", "show"],
    [41, "asleep", "bed"],
    [142, "order", "bin"],
    [143, "robots", "post"],
  ]) {
    window.__jump(beat);
    n.ch1Evening.step = nonControl;
    n.ctrl = false;
    window.__ss.sectionReset();
    window.__ss.tick(0.05);
    out[nonControl] = window.__st() + (n.ctrl ? "" : " (no control)");
    out[nonControl + "Ok"] = window.__st() === want && n.ctrl;
  }
  window.__jump(142);
  window.__run(0.3);
  n.sq.x = 300;
  window.__ss.sectionReset();
  window.__ss.tick(0.05);
  out.binBack = window.__st() === "bin" && Math.round(n.sq.x) !== 300;
  return out;
});
g.check("↺ in a part with no control goes back to the last step he controlled; in a step he controls, that step starts again", Object.keys(r).filter((k) => k.endsWith("Ok") || k === "binBack").every((k) => r[k]), r);

// the bay's furniture (the guards' way round it) is the room's own; hidden in the bay's plant his two eyes show in it
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    B = b.place.BAY;
  window.__jump(144); // (round 7, q: 125: the robots sleep until the post, so the capture rule is tried on the way back)
  const solids = window.__ss.solids();
  const same = b.place.BAY_FURNITURE.every((f) => solids.some((q) => q.x0 === f.x0 && q.x1 === f.x1 && q.y0 === f.y0 && q.y1 === f.y1));
  // (the plant is a hiding place during an alarm only: walking past it the button stays on the next thing)
  n.sq.x = B.plant.x;
  n.sq.y = B.plant.y;
  window.__ss.tick(0.05);
  const calmOffer = (window.__ss.offerNow() || {}).verb || "";
  // seen first, in the robot's look
  n.sq.x = 300;
  n.sq.y = 585;
  window.__run(8, () => b.place.nightLook(n.ch1Evening.nightT).phase === "down");
  n.sq.x = 480;
  n.sq.y = 585;
  window.__run(1, () => !!n.ch1Evening.alarm);
  n.sq.x = B.plant.x;
  n.sq.y = B.plant.y;
  window.__ss.tick(0.05);
  const o = window.__ss.offerNow();
  o && o.verb === "HIDE" && o.f();
  window.__ss.tick(0.05);
  const P = CanvasRenderingContext2D.prototype,
    el = P.ellipse,
    eyes = [];
  P.ellipse = function (x, y, rx) {
    rx >= 5 && rx <= 8 && eyes.push([x, y]);
    return el.apply(this, arguments);
  };
  window.__ss.drawFrame();
  P.ellipse = el;
  const box = B.plant.box,
    inLeaves = eyes.filter(([x, y]) => x > box.x0 && x < box.x1 && y > box.y0 && y < box.y1);
  return { same, calmOffer, hid: o && o.verb + " · " + o.cap, pose: n.ch1Evening.pose, eyes: inLeaves.length };
});
g.check("the bay's furniture in evening-place.js is the room's own (the older program's solids)", r.same, r);
g.check("the bay's plant is offered as a hiding place during an alarm, not on the way past it; hidden there, his two eyes show in its leaves", r.calmOffer !== "HIDE" && r.hid === "HIDE · plant" && r.pose === "hidden" && r.eyes >= 2, r);
// ↺ while he walks in through a night doorway: control comes back in a step of the room he is in
r = await ev(() => {
  const n = window.__ss.op,
    out = {};
  for (const [beat, x, y] of [[42, 860, 440], [144, 70, 330]]) {
    window.__jump(beat);
    n.ch1Evening.bed = null;
    n.sq.x = x;
    n.sq.y = y;
    window.__run(3, () => !n.ctrl && n.room !== (beat === 42 ? "closet" : "hangar"));
    window.__ss.tick(0.1);
    const mid = { room: n.room, step: window.__st(), ctrl: n.ctrl };
    window.__ss.sectionReset();
    window.__run(2, () => n.ctrl);
    const ev = window.SSQ.beat("ch1-evening");
    out[beat] = { mid, room: n.room, step: window.__st(), ctrl: n.ctrl, ok: n.ctrl && ev.debug().state && n.room === { out: "closet", nighthall: "hall", back: "hangar", backway: "passage" }[window.__st()] };
  }
  return out;
});
g.check("↺ while walking in through a doorway at night: control comes back in a step that belongs to the room he is in", r[42].ok && r[144].ok && !r[42].mid.ctrl && r[42].mid.room === "hall" && !r[144].mid.ctrl && r[144].mid.room === "passage", r);

// the old code is gone from src/game; the debug link
const game = readdirSync(join(root, "src", "game"))
  .map((f) => readFileSync(join(root, "src", "game", f), "utf8"))
  .join("\n");
const gone = ["function ch1LookPhotos", "function ch1HideFamily", "function ch1MarsTalk", "function ch1NightOut", "function ch1GrabCopies", "function ch1PostYellow", "function ch1OutHome", "function drawCouple", "ch1BrochureBig", "ch1SuckT"];
g.check("the old beat 37 to 42 code is gone from src/game", gone.every((x) => !game.includes(x)), gone.filter((x) => game.includes(x)));
const p2 = await g.open("?beat=evening:142", PHONE);
await new Promise((q) => setTimeout(q, 900));
r = await p2.page.evaluate(() => ({ step: (window.__ss.op.ch1Evening || {}).step, room: window.__ss.op.room, ring: window.__ss.op.lastRing && window.__ss.op.lastRing.id }));
g.check("?beat=evening:142 opens the loading bay at night with the bin outlined", r.step === "bin" && r.room === "hangar" && r.ring === "ev-bin", r);

g.check("no page errors", errors.length === 0 && p2.errors.length === 0, [...errors, ...p2.errors].slice(0, 5));
await g.finish("evening");
