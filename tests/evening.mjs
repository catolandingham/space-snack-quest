/**
 * Beats 37 to 42c, the evening of Day 2 and night one rebuilt from the story pass (src/modules/evening.js), at phone
 * size. Checked as the player meets them:
 *   - the words: every story-pass line built word for word and still pending, Brian's Nov 8 lines across their bubbles,
 *     no bubble too long (line-split.js), the office code;
 *   - 37: the gallery, holding LIFT · photo swings photo 4 up over the crayon drawing (ME, MOPS) and back; past photo 5
 *     the robot from the hall's end: rolled up it passes (BEEP BEEP), standing it sees him (the capture rule);
 *   - 38a: Jupiter's storm, the PA, "Guests! Quick, hide.", the guests seeing a kid who stays out, HIDE · counter, PEEK
 *     · window, the family's Mars talk, DUCK · down; still up, their cones find his eyes;
 *   - 38b and 39: the pancake talk, the close-up, the brochure in the bin, its five taps and the lines after;
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
g.check("Brian's Nov 8 lines read word for word across their bubbles", said(["sq-look-like", "sq-not-hidden", "sq-like-me"]) === "They look just like the Guardians. But they're not hidden. Just like me." && said(["dad-wookiees", "dad-sasquatches"]) === "I thought it was a pancake stand run by Wookiees. But I talked to them, and they said they were Sasquatches." && said(["sq-floors", "sq-robots-do"]) === "The floors don't mop themselves... But those robots do.");
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
g.check("the bin, the mailbox, the plant, the doorway and under the vent are never in the night robot's cone", ["bin", "mail", "plant", "door", "underVent"].every((k) => !everSeen(PL.EV_BAY[k])), ["bin", "mail", "plant", "door", "underVent"].filter((k) => everSeen(PL.EV_BAY[k])));
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
g.check("the debug link opens beat 37 in the hallway; the hall's doorway is outlined, the optional photo wall is not", r.step === "wall" && r.room === "passage" && r.ctrl && r.ring === "ev-hall", r);
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
r = await ev(() => {
  const n = window.__ss.op;
  window.__jump(37);
  n.sq.x = 60;
  n.sq.y = 330;
  // the hall's doorway starts the party hall's cleaning robots (36b, loading-bay.js); he crosses to the counter's front
  const bay = window.SSQ.beat("ch1-bay"),
    sneak = [];
  window.__run(40, () => window.__st() === "storm", () => {
    window.__st() && sneak[sneak.length - 1] !== window.__st() && sneak.push(window.__st());
    bay.active() && n.ctrl && !n.cur && ((n.sq.x = bay.place.HALL_SNEAK.goal.x), (n.sq.y = bay.place.HALL_SNEAK.goal.y));
  });
  const out = { room: n.room, step: window.__st(), sneak };
  const said = [];
  window.__run(20, () => window.__st() === "hide" && n.ctrl, () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text));
  window.__run(1.5);
  window.__ss.drawFrame();
  const d = window.SSQ.beat("ch1-evening").debug();
  return { ...out, said, step2: window.__st(), storm: d.state.storm, guests: (d.state.guests || []).map((g) => g.role), ring: n.lastRing && n.lastRing.id, counter: !!window.__spot("HIDE · counter") };
});
g.check("the hall's doorway starts 36b (the bay's cleaning robots: this beat waits), and 36b's end starts the storm", JSON.stringify(r.sneak.filter((s) => s !== "tohall")) === JSON.stringify(["wall", "hallsneak", "tostorm"]) && r.step === "storm", r);
g.check("into the hall: Jupiter's big red storm rolls into the big window; the PA calls everyone to it; Mops: hide behind the counter", r.room === "hall" && r.step === "storm" && r.said.join("|") === "The Great Red Storm is passing!|Best view: the big window.|Guests! Quick, hide.|Behind the counter!" && r.storm > 0.5, r);
g.check("guests come in through the hallway doorway; the counter is outlined: HIDE · counter", r.step2 === "hide" && r.guests.join(",") === "dad,mom,kid,guest" && r.ring === "ev-counter" && r.counter, r);
// a kid who does not hide: the guests walking in see him
r = await ev(() => {
  const n = window.__ss.op;
  window.__run(12, () => !!n.ch1Evening.alarm);
  return { alarm: !!n.ch1Evening.alarm, by: n.ch1Evening.alarm && n.ch1Evening.alarm.w.id };
});
g.check("standing in the open as the guests come in: they see him (the one capture rule)", r.alarm && ["camera", "teal", "octopus-guest", "backpack"].includes(r.by), r);
r = await ev(() => {
  const n = window.__ss.op;
  window.__jump(38);
  const pressed = window.__press("HIDE · counter");
  window.__run(4, () => window.__st() === "peek" && n.ctrl);
  return { pressed, step: window.__st(), pose: n.ch1Evening.pose, sqPose: n.sqPose, peek: !!window.__spot("PEEK · window") };
});
g.check("HIDE · counter: behind the counter, rolled up; PEEK · window is offered", r.pressed && r.step === "peek" && r.pose === "hidden" && r.peek, r);
r = await ev(() => {
  const n = window.__ss.op;
  const pressed = window.__press("PEEK · window");
  const said = [],
    ears = [];
  window.__run(30, () => window.__st() === "duck" && n.ctrl, () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && (said.push(n.cur.b.text), ears.push(!!n.cur.b.ear)));
  window.__ss.drawFrame();
  const d = window.SSQ.beat("ch1-evening").debug();
  return { pressed, said, ears, step: window.__st(), peek: d.state.peek, duck: !!window.__spot("DUCK · down"), seenDuring: d.state.alarm };
});
g.check("PEEK · window: his eyes over the counter; the family at the window talks about Mars (overheard, the ear)", r.pressed && r.said.join("|") === "Whoa. It's SO red.|Red like Mars.|Oh, we loved Mars.|What did you like best?|The PANCAKES!|Now I'm hungry." && r.ears.every(Boolean) && !r.seenDuring, r);
g.check("then they turn to the snack bar: DUCK · down is offered", r.step === "duck" && r.peek && r.duck, r);
// staying up: their cones reach his eyes; the one capture rule
r = await ev(() => {
  const n = window.__ss.op;
  const out = {};
  window.__run(12, () => !!n.ch1Evening.alarm, () => n.ch1Evening.seenT > 0 && (out.registering = true));
  out.alarm = !!n.ch1Evening.alarm;
  return out;
});
g.check("still peeking as they come: a guest's cone holds his eyes (a \"?\"), then the alarm", r.registering && r.alarm, r);
r = await ev(() => {
  const n = window.__ss.op;
  window.__jump(138);
  window.__press("PEEK · window");
  window.__run(30, () => window.__st() === "duck" && n.ctrl);
  const ducked = window.__press("DUCK · down");
  const said = [];
  let shock = false;
  window.__run(40, () => window.__st() === "brochure" && n.ctrl, () => {
    n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text);
    if (window.SSQ.beat("ch1-evening").viewOpen() === "shock") ((shock = true), window.SSQ.beat("ch1-evening").viewAct());
  });
  return { ducked, said, shock, step: window.__st(), alarm: !!n.ch1Evening.alarm, brochure: n.ch1Evening.brochure, coffee: n.ch1Evening.coffee, guests: n.ch1Evening.guests };
});
g.check("ducked: the family at the bar asks Mops for pancakes, in Brian's Nov 8 words, and says SASQUATCHES", r.ducked && !r.alarm && ["Got any pancakes?", "Pancakes? We don't have no pancakes.", "By the way, the best pancakes in the galaxy are on Mars.", "I thought it was a pancake stand run by Wookiees.", "But I talked to them, and they said they were Sasquatches."].every((t, i) => r.said[i] === t), r.said);
g.check("at \"Sasquatches\" the close-up shows Mops's face, his beard stopped, and Squatch's eyes just as wide", r.shock, r);
g.check("the brochure: Dad holds it up, the guest gets coffee on it and tosses it over the counter into the bin; they leave", r.said.includes("Here's a brochure I got on it.") && r.said.includes("Ugh. Coffee.") && r.said[r.said.length - 1] === "Bedtime." && r.brochure === "bin" && r.coffee === 1 && r.guests === null && r.step === "brochure", r);
// beat 39: the brochure close-up
r = await ev(async () => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  const pressed = window.__press("GRAB · brochure");
  window.__run(1);
  // the words the brochure close-up draws before anything is tapped (its picture only: no thought yet)
  const bw = [],
    CP = CanvasRenderingContext2D.prototype,
    keep = CP.fillText;
  CP.fillText = function (t) {
    this.canvas.getAttribute("aria-label") === "brochure" && bw.push(String(t));
    return keep.apply(this, arguments);
  };
  await new Promise((q) => setTimeout(q, 200));
  CP.fillText = keep;
  const t = b.viewTargets(),
    thoughts = [];
  for (const part of ["window", "pancakes", "cake", "paw"]) {
    window.__tapView("brochure", t.parts[part]);
    await new Promise((q) => setTimeout(q, 140));
    thoughts.push(b.debug().view.drew.thought + (b.debug().view.drew.mark ? " +mark" : ""));
  }
  const words = [];
  window.__tapView("brochure", t.parts.cooks);
  window.__run(30, () => window.__st() === "gohome" && n.ctrl, () => n.cur && n.cur.b && words[words.length - 1] !== n.cur.b.text && words.push(n.cur.b.text));
  return { pressed, thoughts, words, step: window.__st(), open: b.viewOpen(), brochureWords: [...new Set(bw)] };
});
g.check("GRAB · brochure opens its close-up; tapping the window, the pancakes, the cake and the paw print: \"Mars.\", \"Yum.\", \"It FIZZES.\", the Guardians' mark beside it", r.pressed && r.thoughts.join("|") === "Mars.|Yum.|It FIZZES.|Like the Guardians' mark. Almost. +mark", r);
g.check("tapping the two cooks: \"They look just like the Guardians.\" ... \"Are those other Sasquatches?\", then Mops: back to work, tonight", r.words.join("|") === "They look just like the Guardians.|But they're not hidden.|Just like me.|Are those other Sasquatches?|I have to get back to work.|We'll talk tonight." && r.step === "gohome" && r.open === "", r);
g.check("the brochure has no words but his family's name (snack-name.js FAMILY) on the cake box in its picture", r.brochureWords.length === 1 && r.brochureWords[0] === FAMILY.NAME, r.brochureWords);
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
  window.__run(6, () => window.__st() === "chart" && n.ctrl, () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text));
  out.said = said;
  out.chartSpot = !!window.__spot("X · chart");
  out.ring = n.lastRing && n.lastRing.id;
  return out;
});
g.check("beat 39b: home alone (Mops is not back); OPEN · box (the Guardians' box); BITE · cake: a crunch, silence, \"No fizz.\"", r.room === "closet" && r.step === "box" && r.mops === "hidden" && r.open && r.opened && r.bite && r.cake === 1 && r.said.join("|") === "No fizz." && r.chartSpot, r);
r = await ev(async () => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  const pressed = window.__press("X · chart");
  window.__run(1);
  await new Promise((q) => setTimeout(q, 150));
  const t = b.viewTargets();
  window.__tapView("cake chart", t.cake);
  window.__run(0.6);
  await new Promise((q) => setTimeout(q, 120));
  const half = b.debug().view.drew.x;
  window.__tapView("cake chart", t.cake);
  window.__run(3, () => window.__st() === "crate" && n.ctrl);
  return { pressed, view: t.kind, half, step: window.__st(), chartX: n.ch1Evening.chartX, crate: !!window.__spot("HOLD UP · brochure") };
});
g.check("X · chart: the chart close-up; two taps draw this week's X (one stroke each); then HOLD UP · brochure at the crate", r.pressed && r.view === "chart" && r.half === 0.5 && r.chartX && r.step === "crate" && r.crate, r);
r = await ev(async () => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  window.__ss.drawFrame();
  const before = b.debug().drew.stamp;
  const pressed = window.__press("HOLD UP · brochure");
  window.__run(1);
  await new Promise((q) => setTimeout(q, 150));
  const t = b.viewTargets(),
    lit = [];
  for (let i = 0; i < 3; i++) {
    window.__tapView("crate", t.card);
    window.__run(0.1);
    await new Promise((q) => setTimeout(q, 120));
    lit.push(b.debug().view.drew.lit);
  }
  const said = [];
  window.__run(6, () => window.__st() === "evening", () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text));
  return { before, pressed, lit, letters: b.debug().view ? b.debug().view.drew.letters : "", said, st: n.ch1Evening.stampST, step: window.__st() };
});
g.check("HOLD UP · brochure: sliding the brochure along the crate's stamp lights its letters in pairs; the M lands; he rubs out his crayon ST", r.pressed && r.lit[0] > 0 && r.lit[2] === 8 && r.st === 0, r);
g.check("\"Not STARS...\" / \"MARS!\"", r.said.join("|") === "Not STARS...|MARS!", r);
// beat 40: the fight
r = await ev(() => {
  const n = window.__ss.op;
  const cards = [];
  window.__run(16, () => window.__st() === "show" && n.ctrl, () => n.cur && n.cur.k === "card" && cards.push(n.cur.text));
  const pressed = window.__press("SHOW · brochure");
  window.__run(0.6);
  window.__ss.drawFrame();
  const held = window.SSQ.beat("ch1-evening").debug().drew;
  const said = [];
  window.__run(60, () => window.__st() === "choose" && n.ctrl, () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text));
  return { cards: [...new Set(cards)], pressed, held: held && held.held, hearts: held && held.hearts, said, step: window.__st(), ask: !!window.__spot("ASK · again"), stomp: !!window.__spot("STOMP · to bed") };
});
g.check("beat 40: \"That evening…\"; Mops comes home with his hearts; SHOW · brochure, he holds it up", r.cards.includes("That evening…") && r.pressed && r.held && r.held.w > 50 && r.hearts === 3, r);
g.check("the fight, one short bubble each: MARS!, one of a kind, the manager, safe here, the Guardians", r.said.join("|") === "Mops! My crate says MARS!|It says Stars.|Can we go to Mars?|Squatch. There are no other Sasquatches.|You're one of a kind. Like me.|I know what it's like to be one of a kind.|The man said SASQUATCHES. You heard him!|And they look like ME.|You heard the manager.|They need me here.|What if they replace you anyway?|They won't.|And we're safe here.|Safe? I have to HIDE here.|The Guardians are here.", r.said);
g.check("then the player picks: ASK · again (where he stands) or STOMP · to bed (at the bed)", r.step === "choose" && r.ask, r);
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  const pressed = window.__press("STOMP · to bed");
  const said = [];
  let back = false,
    hearts = [];
  window.__run(40, () => window.__st() === "bed" && n.ctrl, () => {
    n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && (said.push(n.cur.b.text), hearts.push(n.ch1Evening.hearts));
    b.viewOpen() === "back" && ((back = true), b.viewAct());
  });
  return { pressed, said, back, hearts, step: window.__st(), turned: n.ch1Evening.turned };
});
g.check("STOMP · to bed: Mops calls him back first; \"Why won't you help me find my family?\" ... \"Squatch... I already...\" and he turns his back (no hearts, the close-up)", r.pressed && r.said[0] === "Squatch. Wait." && r.said[1] === "Why won't you help me find my family?" && r.said[2] === "Squatch... I already..." && r.back && r.turned, r);
g.check("\"I AM your family.\" / \"Maybe my REAL family wouldn't make me hide!\" / \"...I didn't mean that.\" / one small heart / \"Bed. The floors don't mop themselves.\"", r.said.slice(3).join("|") === "I AM your family.|Maybe my REAL family wouldn't make me hide!|...I didn't mean that.|We say things we don't mean all the time.|Bed. The floors don't mop themselves." && r.hearts[3] === 0 && r.hearts[6] > 0 && r.step === "bed", r);
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
  const solid = window.__ss.solids().some((q) => q.x1 === 536 && q.y0 === 550 && q.y1 === 580);
  const inBed = !!n.ch1Evening.bed;
  // his first move gets him out of bed (the kid's to start)
  n.walkTo = { x: 600, y: 470, room: n.room, lx: n.sq.x, ly: n.sq.y, lt: n.T };
  window.__ss.tick(0.05);
  window.__run(4, () => !n.ch1Evening.bed && n.ctrl);
  const up = { bed: !!n.ch1Evening.bed, x: Math.round(n.sq.x), y: Math.round(n.sq.y), ctrl: n.ctrl };
  return { pressed, seen, inBed, up, step: window.__st(), sqPose: n.sqPose, solid, sneak: n.ch1Sneak };
});
g.check("beat 41: SLEEP · bed; the light goes down with no song tonight; Mops tips over like a fainting goat, sleeps on his back, snores", r.pressed && r.seen.tip >= 1 && r.seen.roll >= 1 && r.seen.zzz > 0 && r.seen.dim >= 1 && r.seen.quiet === true, r);
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
// beat 42c: post it, and pay for it
r = await ev(() => {
  const n = window.__ss.op,
    s = () => n.ch1Evening;
  const pressed = window.__press("POST · mailbox");
  const said = [];
  window.__run(6, () => !!s().alarm, () => n.cur && n.cur.b && said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text + (n.cur.b.ear ? " (ear)" : "")));
  const out = { pressed, said, alarm: s().alarm && { by: s().alarm.w.id, place: s().alarm.place }, offers: window.__ss.spotsNow().map((q) => q.verb + " · " + q.cap), mailed: n.ch1Mailed };
  // he runs out of the mail room and up to the crate by the big wall vent, and hides in it
  for (const w of [{ x: 700, y: 463 }, { x: 645, y: 463 }, { x: 645, y: 336 }, { x: 850, y: 334 }]) ((n.sq.x = w.x), (n.sq.y = w.y), window.__ss.tick(0.05));
  out.hid = window.__press("HIDE · crate");
  const after = [];
  window.__run(40, () => window.__st() === "back" && n.ctrl, () => {
    n.cur && n.cur.b && after[after.length - 1] !== n.cur.b.text && after.push(n.cur.b.text);
    out.maxSuck = Math.max(out.maxSuck || 0, s().suck);
  });
  out.after = after;
  out.step = window.__st();
  out.pink = s().pink;
  out.sucked = n.ch1PinkSucked;
  out.lost = window.SSQ.beat("ch1-evening").debug().lost;
  return out;
});
g.check("POST · mailbox is loud: \"MAIL SCANNED.\" / \"PAWATURE ACCEPTED.\", \"Shhh!\"; the night robot hears: the alarm (the one capture rule)", r.pressed && r.said.join("|").startsWith("MAIL SCANNED.|PAWATURE ACCEPTED.|Shhh!") && r.alarm && r.alarm.by === "night-robot" && r.alarm.place === "bay" && r.mailed === 1, r);
g.check("the one hiding place is the crate by the big wall vent: HIDE · crate", r.offers.join("|") === "HIDE · crate", r.offers);
g.check("in the crate the vent's swirls take the pink sheet (\"No! The pink one!\"); they lose him; \"...The yellow one got mailed.\" / \"It's done.\"", r.hid && r.maxSuck > 0.5 && r.pink === "vent" && r.sucked === 1 && r.after.join("|") === "No! The pink one!|...The yellow one got mailed.|It's done." && r.lost >= 1 && r.step === "back", r);
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
  return { a0, a, b, pressed, escape: es.active(), cu: week && week.cu, done: !n.ch1Evening || n.ch1Evening.step === "done", lights: n.ch1Lights, crayonGone: window.SSQ.beat("ch1-evening").crayonGone() };
});
g.check("home to bed: SLEEP · bed, he falls asleep, and beat 43 starts (the escape: \"Six days later\" on the home calendar)", r.a0 && r.a && r.b && r.pressed && r.escape && r.cu === "cal" && r.done && r.lights === 1 && r.crayonGone, r);

// the one capture rule in the bay
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    look = b.place.nightLook;
  window.__jump(142);
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
  window.__jump(142);
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
  window.__jump(142);
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
g.check("hidden in the plant through the search: the guards give up (\"They lost you.\"), the step goes on", r.hid === "HIDE · plant" && r.over && r.lost && r.step === "bin" && r.ctrl && !r.jail, r);
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    look = b.place.nightLook;
  window.__jump(142);
  window.__run(8, () => look(n.ch1Evening.nightT).phase === "down" && look(n.ch1Evening.nightT).catch);
  n.sq.x = 480;
  n.sq.y = 585;
  let card = "";
  for (let i = 0; i < 600 && !card; i++) {
    window.__ss.tick(0.05);
    n.cur && n.cur.id === "jail" && (card = n.cur.cause || "");
  }
  window.__run(20, () => n.ctrl && !n.cur && window.__st() === "bin");
  return { card, step: window.__st(), x: Math.round(n.sq.x), alarm: !!(n.ch1Evening && n.ch1Evening.alarm) };
});
g.check("seen and standing still: a guard catches him, the LOCKUP card names a robot in the delivery room, the step restarts", r.card === "A robot saw Squatch in the delivery room. Security caught him." && r.step === "bin" && !r.alarm, r);

// ↺: in each step he controls the step comes back; between steps, back to the last one he controlled
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    out = {};
  for (const [beat, nonControl, want] of [
    [37, "gallery", "wall"],
    [38, "storm", "hide"],
    [138, "talk", "peek"],
    [141, "slide", "crate"],
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
  window.__jump(142);
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
