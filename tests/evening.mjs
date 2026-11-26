/**
 * Beats 37 to 42, the evening of Day 2 and night one (src/modules/evening.js), at phone size. Checked as the player
 * meets them:
 *   - the words: every line in evening-lines.js, the pending ones still pending, no spoken line of its own invention;
 *   - beat 37: the hallway; LOOK · photos opens the gallery (5 photos, arrows, an X always there); photo #4 hangs
 *     crooked and lifting it shows the crayon drawing, which stays on the wall (ch1Crayon); the X closes it with no
 *     robot; past photo 5 the gallery closes, a robot rolls through, Squatch rolls into the L2 ball and "BEEP BEEP";
 *   - beat 38: the hall: the overheard Moon Pie line (with the ear), the family in the hallway doorway reading, "Quick,
 *     hide."; standing in the open when they look up is the one capture rule; HIDE · counter rolls him up behind the
 *     counter, the family walks round, its picture bubble, the brochure put down, GRAB · brochure, the close-up;
 *   - beat 39: "Are those other Sasquatches?" / Mops's back-to-work line, the home doorway outlined (the goal words
 *     wait while it is), home;
 *   - beat 40: SHOW · brochure, held up, Mops's Mars line; beat 41: SLEEP · bed, the light goes down, Mops tips over and
 *     sleeps on his back with his feet up, the snores, and nobody walks through him;
 *   - beat 42: the night robot's rhythm (R64) and sight; the bin, the paw order close-up (a paw print, not a check; the
 *     yellow torn off), POST · mailbox, the robots wake, the vent takes the pink sheet; a fair way back; seen in the
 *     bay: the robot runs to the bay's FUR alarm, guards, hide, "They lost you."; seen and standing: the LOCKUP card;
 *   - ↺ in every step, the debug link, the music's cues, beat 43 after night one, and the old code is gone.
 *   node tests/evening.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const { EVENING_LINES } = await import(M("evening-lines.js"));
const PL = await import(M("evening-place.js"));
const W = await import(M("party-watch.js"));
const g = await startGame({ port: 9781, name: "evening" });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true };

// ---------- the words ----------
const SPOKEN = EVENING_LINES.filter((l) => !["chip", "button", "sign", "lockup"].includes(l.who));
g.check("no spoken line is new (every spoken line is from the walkthrough or approved)", SPOKEN.every((l) => l.status !== "suggested"), SPOKEN.filter((l) => l.status === "suggested"));
const PENDING = ["I swear we had more Moon Pies...", "is that what they stole at lunch?", "Quick, hide.", "Are those other Sasquatches?", "I need to get back to work, we'll talk about it tonight.", "Didn't you hear what the manager said?", "They need me here, they're not going to replace me.", "Plus the Guardians are here.", "Mail scanned. Pawature accepted.", "ORDER MORE ROBOTS", "MARK · order", "GRAB · copies"];
g.check("the pending lines are still pending", PENDING.every((t) => (EVENING_LINES.find((l) => l.text === t) || {}).status === "pending"), PENDING.filter((t) => (EVENING_LINES.find((l) => l.text === t) || {}).status !== "pending"));
g.check("the tourists' cut lines are gone (Call 16)", !EVENING_LINES.some((l) => /We ate at a pancake place|Here, a brochure/.test(l.text)));
// (Brian 2026-11-26, [40 0:05]: a line over about 12 words is split into bubbles, its words unchanged)
const long = SPOKEN.filter((l) => l.text.split(/\s+/).length > 12);
g.check("no bubble holds more than 12 words (longer lines are split into two or three bubbles)", long.length === 0, long.map((l) => l.text));
g.check("the split lines read word for word as the walkthrough's", ["tourist-moonpies", "tourist-moonpies-2"].map((id) => SPOKEN.find((l) => l.id === id).text).join(" ") === "I swear we had more Moon Pies... is that what they stole at lunch?" && ["mops-mars", "mops-mars-2", "mops-mars-3"].map((id) => SPOKEN.find((l) => l.id === id).text).join(" ") === "Didn't you hear what the manager said? They need me here, they're not going to replace me. Plus the Guardians are here.");
g.check("the office code on the pink sheet is Brian's 169556", EVENING_LINES.find((l) => l.id === "sign-code").text === "169556");

// ---------- the night robot's rhythm, from the numbers (no browser) ----------
const L = PL.nightLook;
g.check("R64: the night robot looks down 2 s, turns 0.3 s with no catch, looks at the back wall 4 s", L(0.5).phase === "down" && L(2.1).catch === false && L(3).phase === "up" && Math.abs(L(3).a + Math.PI / 2) < 1e-9 && Math.abs(L(0.5).a - Math.PI / 2) < 1e-9 && L(6.4).catch === false && Math.abs(PL.NIGHT_CYCLE - 6.6) < 1e-9);
const CONE = { half: 0.42, len: 210 };
const RS = await import(M("room-sizes.js"));
const K = RS.adultPxFor("hangar") / RS.adultPxFor("hall"); // the bay's Squatch against the hall's (sight is measured at his size)
const seesBay = (c, sq) => W.coneSees({ ...c, ox: sq.x + (c.ox - sq.x) / K, oy: sq.y + (c.oy - sq.y) / K, len: c.len / K }, sq);
const robotCone = (t) => W.coneFrom("r", PL.BAY.robot.x, PL.BAY.robot.y, L(t).a, CONE);
const everSeen = (p) => {
  for (let t = 0; t < PL.NIGHT_CYCLE; t += 0.05) if (L(t).catch && seesBay(robotCone(t), p)) return true;
  return false;
};
g.check("the bin, the mailbox, the plant, the doorway and under the vent are never in the night robot's cone", ["bin", "mail", "plant", "door", "underVent"].every((k) => !everSeen(PL.BAY[k])), ["bin", "mail", "plant", "door", "underVent"].filter((k) => everSeen(PL.BAY[k])));
g.check("the front of the bay is seen while it looks down, the back while it looks up", seesBay(robotCone(1), { x: 480, y: 585 }) && !seesBay(robotCone(4), { x: 480, y: 585 }) && seesBay(robotCone(4), { x: 480, y: 330 }) && !seesBay(robotCone(1), { x: 480, y: 330 }));

// ---------- in the game ----------
const { page, errors } = await g.open("?beat=evening:37", PHONE);
await new Promise((r) => setTimeout(r, 900));
await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  window.__run = (secs, until) => {
    for (let i = 0; i < secs * 20; i++) {
      if (until && until()) return true;
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
  window.__tapView("photo wall", b.viewTargets().photo);
  window.__run(0.8);
  await new Promise((q) => setTimeout(q, 150));
  return { seen, before, after: window.__ss.op.ch1Crayon, drew: b.debug().view.drew };
});
g.check("photo #4 hangs crooked; lifting it shows his crayon drawing and leaves it on the wall", r.seen[2].photo === 4 && r.seen[2].crooked && r.seen[0].crooked === false && !r.before && r.after === true && r.drew.lifted, r);
r = await ev(() => {
  const b = window.SSQ.beat("ch1-evening");
  window.__tapView("photo wall", b.viewTargets().close);
  return { step: window.__st(), open: !!document.querySelector('canvas[aria-label="photo wall"]'), robot: !!(window.__ss.op.ch1Evening.robot) };
});
g.check("the X closes the gallery any time, with no robot", r.step === "wall" && !r.open && !r.robot, r);
r = await ev(async () => {
  window.__press("LOOK · photos");
  const b = window.SSQ.beat("ch1-evening");
  await new Promise((q) => setTimeout(q, 150));
  for (let i = 0; i < 5; i++) (window.__tapView("photo wall", b.viewTargets().next), await new Promise((q) => setTimeout(q, 80)));
  const out = { step: window.__st(), open: !!document.querySelector('canvas[aria-label="photo wall"]') };
  window.__run(4, () => window.__ss.op.sqPose === "ball" && window.__ss.op.cur && window.__ss.op.cur.k === "bub");
  out.pose = window.__ss.op.sqPose;
  out.bub = window.__ss.op.cur && window.__ss.op.cur.b && window.__ss.op.cur.b.text;
  out.who = window.__ss.op.cur && window.__ss.op.cur.b && window.__ss.op.cur.b.who;
  window.__run(12, () => window.__st() === "wall" && window.__ss.op.ctrl);
  out.after = window.__st();
  out.look = !!window.__spot("LOOK · photos");
  out.poseAfter = window.__ss.op.sqPose;
  return out;
});
g.check("past photo 5: the gallery closes, a robot rolls through, Squatch rolls up (the L2 ball), BEEP BEEP", r.step === "robot" && !r.open && r.pose === "ball" && r.bub === "BEEP BEEP" && r.who === "robot", r);
g.check("after the robot he stands up and the gallery is not offered again this visit", r.after === "wall" && !r.look && r.poseAfter === "stand", r);

// beat 38
r = await ev(() => {
  const n = window.__ss.op;
  n.sq.x = 60;
  n.sq.y = 330;
  window.__run(8, () => window.__st() === "line" && n.cur && n.cur.k === "bub");
  return { room: n.room, text: n.cur.b.text, ear: !!n.cur.b.ear, who: n.cur.b.who };
});
g.check("walking into the doorway takes them to the snack bar, where Squatch overhears the line (the ear)", r.room === "hall" && r.text === "I swear we had more Moon Pies..." && r.ear, r);
r = await ev(() => {
  const n = window.__ss.op;
  window.__run(12, () => n.cur && n.cur.b && n.cur.b.who === "mops");
  const fam = (n.ch1Evening.family || []).map((f) => ({ x: Math.round(f.x), a: +f.a.toFixed(2) }));
  return { text: n.cur.b.text, fam, line: n.ch1Evening.line };
});
g.check("the people in line leave; the family is in the hallway doorway reading their brochure when Mops says \"Quick, hide.\"", r.text === "Quick, hide." && !r.line && r.fam.length === 3 && r.fam[0].x < 960 && Math.abs(r.fam[0].a - Math.PI / 2) < 0.01, r);
// a kid who does not hide: they look up and see him
r = await page.evaluate(`(() => {
  const n = window.__ss.op;
  window.__run(2, () => window.__st() === "hide" && n.ctrl);
  const save = JSON.stringify(n.ch1Evening), x = n.sq.x, y = n.sq.y;
  window.__run(${PL.FAMILY.read + 2.5}, () => !!n.ch1Evening.alarm);
  const out = { alarm: !!n.ch1Evening.alarm, by: n.ch1Evening.alarm && n.ch1Evening.alarm.w.id, chip: n.ch1Chip, hide: !!window.__spot("HIDE · counter") };
  n.ch1Evening = JSON.parse(save);
  n.sq.x = x; n.sq.y = y; n.ctrl = true;
  return out;
})()`);
g.check("standing in the open when the family looks up from the brochure: the one capture rule (FUR!, \"Squatch: hide\")", r.alarm && r.by === "camera" && r.chip === "Squatch: hide" && r.hide, r);
r = await ev(() => {
  const n = window.__ss.op;
  n.ch1Evening.familyT = 0;
  const pressed = window.__press("HIDE · counter");
  window.__run(3, () => window.__st() === "watch");
  const hidden = { pose: n.ch1Evening.pose, sqPose: n.sqPose, x: Math.round(n.sq.x), y: Math.round(n.sq.y) };
  let bubble = false,
    putting = false;
  window.__run(25, () => ((bubble = bubble || n.ch1Evening.bubble > 0), (putting = putting || n.ch1Evening.brochure === "putting"), window.__st() === "brochure" && n.ctrl));
  return { pressed, hidden, bubble, putting, step: window.__st(), brochure: n.ch1Evening.brochure, alarm: !!n.ch1Evening.alarm, family: n.ch1Evening.family };
});
g.check("HIDE · counter: rolled up in the aisle behind the counter, nobody sees him", r.pressed && r.hidden.pose === "hidden" && r.hidden.x > 862 && r.hidden.x < 924 && !r.alarm, r);
g.check("hidden, he watches the family's picture bubble, the brochure put down on the counter, and the family leave", r.bubble && r.putting && r.step === "brochure" && r.brochure === "counter" && !r.family, r);
r = await ev(async () => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  const pressed = window.__press("GRAB · brochure");
  window.__run(0.7);
  await new Promise((q) => setTimeout(q, 200));
  const view = b.viewTargets();
  window.__tapView("brochure", view.close);
  window.__run(0.1);
  const t0 = window.__texts().length;
  window.__run(14, () => window.__st() === "gohome" && n.ctrl);
  return { pressed, view: view && view.kind, closed: !document.querySelector('canvas[aria-label="brochure"]'), lines: window.__texts().slice(t0 - 2), step: window.__st(), mops: n.moPose, ring: n.lastRing && n.lastRing.id, chip: window.__ss.chipNow(), brochure: n.ch1Brochure };
});
g.check("GRAB · brochure opens the brochure's close-up; its X closes it", r.pressed && r.view === "brochure" && r.closed, r);
g.check("beat 39: \"Are those other Sasquatches?\", then Mops's back-to-work line, and Mops goes", r.lines.includes("Are those other Sasquatches?") && r.lines.includes("I need to get back to work, we'll talk about it tonight.") && r.mops === "hidden" && r.brochure, r);
r = await ev(() => {
  const n = window.__ss.op;
  window.__ss.drawFrame();
  return { ring: n.lastRing && n.lastRing.id, words: document.body.innerText.includes("Squatch: go home") };
});
g.check("no goal bar: the home doorway is outlined and the goal words wait", r.ring === "ev-home" && !r.words, r);

// beats 40 and 41
r = await ev(() => {
  const n = window.__ss.op;
  n.sq.x = 477;
  n.sq.y = 590;
  window.__run(14, () => window.__st() === "show" && n.ctrl);
  const pressed = window.__press("SHOW · brochure");
  window.__run(0.6);
  window.__ss.drawFrame();
  const held = window.SSQ.beat("ch1-evening").debug();
  window.__run(4, () => n.cur && n.cur.k === "bub");
  return { room: n.room, pressed, held: held.drew && held.drew.held, line: n.cur && n.cur.b.text };
});
g.check("beat 40: home in the evening, SHOW · brochure, he holds it up (no words), Mops's Mars line", r.room === "closet" && r.pressed && r.held && r.held.w > 50 && r.line && r.line.startsWith("Didn't you hear what the manager said?"), r);
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  window.__run(6, () => window.__st() === "bed" && n.ctrl);
  const pressed = window.__press("SLEEP · bed");
  const seen = { tip: 0, roll: 0, zzz: 0, dim: 0, bedtime: false };
  window.__run(40, () => {
    const s = n.ch1Evening;
    s.mopsSleep && ((seen.tip = Math.max(seen.tip, s.mopsSleep.tip)), (seen.roll = Math.max(seen.roll, s.mopsSleep.roll)));
    seen.zzz = Math.max(seen.zzz, s.zzz);
    seen.dim = Math.max(seen.dim, s.dim);
    s.dim > 0.5 && !n.ctrl && (seen.bedtime = seen.bedtime || window.SSQ.refinedCue("home") === "bedtime");
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
g.check("beat 41: SLEEP · bed; the light goes down (the bedtime music); Mops tips over like a fainting goat, sleeps on his back, snores", r.pressed && r.seen.tip >= 1 && r.seen.roll >= 1 && r.seen.zzz > 0 && r.seen.dim >= 1 && r.seen.bedtime, r);
g.check("night one: Squatch is still in bed, the kid's to move; his first move gets him out of bed beside it", r.step === "out" && r.inBed && !r.up.bed && r.up.ctrl && r.up.x === 340 && r.up.y === 470, r);
g.check("night one: Mops lies asleep on the floor and nobody walks through him; the sneaking music is on", r.solid && r.sneak, r);

// beat 42
r = await ev(() => {
  const n = window.__ss.op;
  const music = window.SSQ.refinedCue("sneak");
  const walk = (x, y, step) => ((n.sq.x = x), (n.sq.y = y), window.__run(10, () => window.__st() === step && n.ctrl));
  const a = walk(860, 440, "nighthall"),
    b = walk(905, 320, "nightway"),
    c = walk(900, 330, "bin");
  return { a, b, c, room: n.room, d: n.ch1D, music };
});
g.check("the kid sneaks out himself: home, the hall, the hallway, into the loading bay at night", r.a && r.b && r.c && r.room === "hangar" && r.d, r);
r = await ev(async () => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  const pressed = window.__press("GRAB · copies");
  window.__run(0.7);
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
  return { pressed, view: t.kind, words: [...new Set(words)], before, after: n.ch1Paw, pressing, through, step: window.__st(), open: !!document.querySelector('canvas[aria-label="order papers"]'), papers: n.ch1Evening.papers };
});
g.check("the close-up draws the pink sheet's words: ORDER MORE ROBOTS, the office code 169556, and MARK · order", ["ORDER MORE ROBOTS", "169556", "MARK · order"].every((w) => r.words.includes(w)), r.words);
g.check("GRAB · copies opens the paw-order close-up; his paw on the box marks it (a paw print)", r.pressed && r.view === "order" && !r.before && r.after === 1 && r.pressing && r.pressing.mark > 0, r);
g.check("the yellow copy, with the print pressed through, tears off into his paw, and the close-up closes itself", r.through && r.through.tear > 0 && r.step === "post" && !r.open && r.papers === "both", r);
r = await ev(() => {
  const n = window.__ss.op;
  const pressed = window.__press("POST · mailbox");
  window.__run(3, () => n.cur && n.cur.k === "bub");
  const line = n.cur && n.cur.b && n.cur.b.text,
    who = n.cur && n.cur.b && n.cur.b.who;
  const seen = { woke: false, ran: false, suck: 0, ctrlDuring: false };
  window.__run(20, () => {
    const s = n.ch1Evening;
    seen.woke = seen.woke || !!(s.woke && s.woke[0].lit > 0.9);
    seen.suck = Math.max(seen.suck, s.suck);
    window.__st() === "robots" && n.ctrl && (seen.ctrlDuring = true);
    return window.__st() === "back" && n.ctrl;
  });
  const at = { x: Math.round(n.sq.x), y: Math.round(n.sq.y) };
  return { pressed, line, who, seen, step: window.__st(), at, sucked: n.ch1PinkSucked, mailed: n.ch1Mailed, paper: n.ch1Paper, pink: n.ch1Evening.pink };
});
g.check("POST · mailbox: \"Mail scanned. Pawature accepted.\" from the mailbox", r.pressed && r.line === "Mail scanned. Pawature accepted." && r.who === "ups" && r.mailed === 1, r);
g.check("then, with no control, the robots wake and roll out, he runs under the big wall vent and it takes the pink sheet", r.seen.woke && r.seen.suck > 0.5 && !r.seen.ctrlDuring && r.step === "back" && r.sucked === 1 && r.pink === "vent" && r.paper === "vent" && Math.hypot(r.at.x - PL.BAY.underVent.x, r.at.y - PL.BAY.underVent.y) < 4, r);
// A fair way back, walked as a kid does (every step checked against the room's solids): from under the vent left
// along the back to beside the mail room's wall and down past it to the front corner, where nobody can see him at any
// moment (he can wait there as long as he likes); then, when the night robot has just turned to the back wall, along
// the front past its column, and up to the doorway. The column crossing takes far less than the robot's 4 s look.
r = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    look = b.place.nightLook;
  const seenHere = () => b.seenNow();
  const standSeen = seenHere();
  const solids = window.__ss.solids();
  let seenOnWay = 0,
    inSolid = 0,
    cornerSeen = 0,
    inColumn = 0;
  const walk = (legs) => {
    for (const w of legs)
      for (let i = 0; i < 400; i++) {
        const dx = w.x - n.sq.x,
          dy = w.y - n.sq.y,
          d = Math.hypot(dx, dy);
        if (d < 2) break;
        const k = Math.min(d, 190 * 0.05);
        n.sq.x += (dx / d) * k;
        n.sq.y += (dy / d) * k;
        seenHere() && seenOnWay++;
        n.sq.x > 360 && n.sq.x < 600 && (inColumn += 0.05);
        solids.some((q) => n.sq.x > q.x0 && n.sq.x < q.x1 && n.sq.y > q.y0 && n.sq.y < q.y1) && inSolid++;
        window.__ss.tick(0.05);
        if (window.__st() !== "back") return;
      }
  };
  walk([{ x: 650, y: 342 }, { x: 650, y: 585 }]);
  // waiting in the front corner through a whole turn of the robot's look: never seen
  for (let i = 0; i < 140; i++) (seenHere() && cornerSeen++, window.__ss.tick(0.05));
  window.__run(8, () => look(n.ch1Evening.nightT).phase === "up" && look(n.ch1Evening.nightT - 0.06).phase !== "up");
  walk([{ x: 300, y: 585 }, { x: 70, y: 330 }]);
  window.__run(4, () => window.__st() === "backway" && n.ctrl);
  return { standSeen, seenOnWay, cornerSeen, inColumn: +inColumn.toFixed(2), inSolid, step: window.__st(), room: n.room, alarm: !!(n.ch1Evening && n.ch1Evening.alarm) };
});
g.check("a fair way back: under the vent and in the front corner nobody sees him; along the front while the robot looks at the back wall nobody does, and the column takes under half its 4 s look", !r.standSeen && r.cornerSeen === 0 && r.seenOnWay === 0 && r.inColumn < 2 && r.inSolid === 0 && !r.alarm && r.step === "backway" && r.room === "passage", r);
r = await ev(() => {
  const n = window.__ss.op;
  const walk = (x, y, step) => ((n.sq.x = x), (n.sq.y = y), window.__run(10, () => window.__st() === step && n.ctrl));
  const a = walk(60, 330, "backhall"),
    b = walk(477, 590, "tobed");
  const pressed = window.__press("SLEEP · bed");
  window.__run(10, () => n.cur && n.cur.k === "card");
  return { a, b, pressed, card: n.cur && n.cur.text, done: !n.ch1Evening || n.ch1Evening.step === "done", lights: n.ch1Lights };
});
g.check("home to bed: SLEEP · bed, he falls asleep, and beat 43 starts (\"Six days later\")", r.a && r.b && r.pressed && r.card === "Six days later" && r.done && r.lights === 1, r);

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
g.check("during the alarm every hiding place is offered (the plant, the ball)", r.offers.includes("ROLL · ball") && r.offers.includes("HIDE · plant"), r);
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
    [38, "watch", "hide"],
    [40, "mars", "show"],
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
