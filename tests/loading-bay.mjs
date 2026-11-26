/**
 * Beats 28 to 36, the loading bay (src/modules/loading-bay.js), at phone size, from the lunch's end behind the snack
 * counter to beat 37's first step in the hallway. In order, each checked as the player meets it:
 *   - 28: the wall speaker's line sits beside the hall speaker (not the old banner) while sound waves come off it; then
 *     Mops, Squatch, Mops, each waiting for NEXT;
 *   - 29: the walk hall -> hallway -> bay is a cutscene (no control, nothing offered in the hallway, nobody jumps);
 *     in the bay "Squatch: hide in the plant", the plant outlined, HIDE · plant at the plant; hidden, only his eyes in
 *     the middle of its leaves;
 *   - 30 to 35, watched from the plant with no control: nobody's cone ever holds him; the ship docks (the locked "day"
 *     picture shows in the window), three robots roll down, Isfred shakes each worker's hand and they leave up the
 *     ramp; the promise; the form close-up (the white, the big pink with ORDER MORE ROBOTS, the small yellow stuck under
 *     the pink; the office code on the pink and the same on the yellow); the wall speaker chimes and Isfred and the
 *     robot leave with the papers; the robot comes back with only the pink and the yellow; the bite close-up and its
 *     chomp; Mops at the plant (the close-up shows the eyes, him and the bin); Squatch's bubble from the eyes; the
 *     copies fly into the bin by the plant and stay there;
 *   - 36: Mops waves him out; Mops's hearts; the hallway robots at the office door glow on Mops's line; their cones
 *     never hold him; they leave; beat 37 (ch1Step "photos", "Squatch: go on").
 * Also: only the lines file's words, pending lines still pending; ↺ in every part; the debug link; the old code gone.
 *   node tests/loading-bay.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const { BAY_LINES } = await import(M("loading-bay-lines.js"));
const { BAY, BAY_PARTS } = await import(M("loading-bay-place.js"));
const { HALL_SPEAKER } = await import(M("party-hall.js"));
const WORDS = new Set(BAY_LINES.map((l) => l.text));

const g = await startGame({ port: 9800, name: "loading-bay" });

// ---------- the lines file ----------
const walk = readFileSync(join(root, "docs", "CH1-STORY-WALKTHROUGH.md"), "utf8");
// (beats 28 to 36 only: from "### 28." to "### 37.", after the section index)
const body = walk.slice(walk.indexOf("<!-- /section-index -->")),
  beats = body.slice(body.indexOf("### 28. The ship is coming"), body.indexOf("### 37."));
const said = BAY_LINES.filter((l) => !["chip", "button"].includes(l.who));
const notInWalk = said.filter((l) => !beats.includes(`"${l.text}"`) && !beats.includes(`"${l.text} ☐"`));
g.check("every spoken or painted line is word for word in the walkthrough's beats 28 to 36", notInWalk.length === 0, notInWalk.map((l) => l.text));
// what the walkthrough says of each line: "*(pending" or "*(decided" right after its words
const marked = (l) => ((beats.split(`"${l.text}`)[1] || "").match(/\*\((pending|decided)/) || [])[1];
const statusWrong = said.filter((l) => (marked(l) === "pending") !== (l.status === "pending"));
g.check("each line's status follows the walkthrough: pending stays pending, decided is decided or approved", statusWrong.length === 0, statusWrong.map((l) => [l.id, l.status, marked(l)]));

// ---------- the beat, played ----------
const { page, errors } = await g.open("?beat=bay:pa", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
await page.evaluate(() => window.__ss.lockedReady);
await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
await page.evaluate(() => (window.requestAnimationFrame = () => 0));
g.check("the loading bay beat is registered (ch1-bay) and ?beat=bay:pa opens it behind the snack counter", await page.evaluate(() => !!window.SSQ.beat("ch1-bay") && window.SSQ.beat("ch1-bay").debug().state.step === "pa" && window.__ss.op.room === "hall"));

const run = await page.evaluate(
  ({ BAY, HALL_SPEAKER }) => {
    const ss = window.__ss,
      n = ss.op,
      beat = window.SSQ.beat("ch1-bay"),
      E = window.SSQ.engine(),
      out = { lines: [], bubbles: {}, rooms: [], ctrlDuring: [], offersInHallway: [], jumps: [], seen: [], parts: [], drew: {}, shakes: new Set(), mopsSaw: false, eyesHidden: null, papersSeen: new Set() };
    const st = () => beat.debug().state || {};
    let prev = null,
      lastLine = "";
    const frame = () => {
      ss.tick(0.05);
      ss.drawFrame();
      const s = st(),
        d = beat.debug().drew;
      // nobody jumps more than 60 inside a room in one frame
      const at = { room: n.room, sq: { x: n.sq.x, y: n.sq.y }, mo: { x: n.mo.x, y: n.mo.y } };
      if (prev && prev.room === at.room) for (const who of ["sq", "mo"]) Math.hypot(at[who].x - prev[who].x, at[who].y - prev[who].y) > 60 && out.jumps.push(who + " in " + at.room);
      prev = at;
      out.rooms[out.rooms.length - 1] !== n.room && out.rooms.push(n.room);
      s.step && out.parts[out.parts.length - 1] !== s.step && out.parts.push(s.step);
      if (s.step !== "hide" && s.step !== "done" && n.ctrl) out.ctrlDuring.push(s.step);
      if (s.step === "walk" && n.room === "passage") ss.offerNow() && out.offersInHallway.push(ss.offerNow().verb);
      beat.seenNow() && out.seen.push(s.step + " " + n.room);
      beat.mopsSees() && (out.mopsSaw = true);
      s.shaking >= 0 && s.shaking != null && out.shakes.add(s.shaking);
      s.papers && out.papersSeen.add(s.papers.where);
      if (d && d.closeUp && d.closeUp.u === 1) out.drew["closeUp-" + d.closeUp.id] = d.closeUp;
      if (d && d.ring) out.drew.ring = d.ring;
      // a bubble: note it, read where it sits, then NEXT (as a kid, after a moment)
      if (n.cur && n.cur.k === "bub") {
        const b = n.cur.b;
        if (b.text !== lastLine) {
          lastLine = b.text;
          for (let i = 0; i < 8; i++) (ss.tick(0.05), ss.drawFrame());
          const lb = window.__ss.lastBubble;
          out.lines.push(b.text);
          out.bubbles[b.text] = { who: b.who, box: lb ? { x: lb.x, y: lb.y, w: lb.w, h: lb.h } : null, head: lb && lb.head ? { ...lb.head } : null, step: st().step, ring: (beat.debug().drew || {}).ring || "", closeUp: (beat.debug().drew || {}).closeUp ? beat.debug().drew.closeUp.id : "", papers: st().papers ? st().papers.where : "", glow: !!st().glow, room: n.room };
        }
        n.bt = 1;
        ss.opTap();
        return;
      }
      lastLine = "";
    };
    // beat 28 and the walk
    for (let i = 0; i < 3000 && !(st().step === "hide" && n.ctrl); i++) frame();
    out.hide = { chip: ss.chipNow(), room: n.room, ctrl: n.ctrl, ch1Step: n.ch1Step, sq: { x: n.sq.x, y: n.sq.y } };
    // walk him to the plant (the game's own walk), then the offer and the outline there
    n.walkTo = { x: BAY.plant.stand.x, y: BAY.plant.stand.y, room: n.room };
    for (let i = 0; i < 120 && Math.hypot(n.sq.x - BAY.plant.stand.x, n.sq.y - BAY.plant.stand.y) > 30; i++) frame();
    out.hide.offer = ((o) => (o ? o.verb + " · " + o.cap : ""))(ss.offerNow());
    n.lastRing = null;
    ss.drawFrame();
    out.hide.outline = n.lastRing ? n.lastRing.id : "";
    ss.offerNow() && ss.offerNow().f();
    frame();
    out.hidden = { pose: n.sqPose, step: st().step };
    // the eyes in the middle of the leaves: white there now
    const cv = document.querySelector("canvas"),
      cx = cv.getContext("2d"),
      m = cx.getTransform(),
      px = (x, y) => [...cx.getImageData(Math.round(m.a * x + m.e), Math.round(m.d * y + m.f), 1, 1).data];
    let white = 0;
    for (let i = 0; i < 30; i++) (frame(), (white = Math.max(white, ...[-9, 9].map((dx) => (px(BAY.plant.eyes.x + dx - 2, BAY.plant.eyes.y - 2)[0] > 220 ? 1 : 0)))));
    out.eyesWhite = white;
    // beats 30 to 36
    let shipPx = null;
    for (let i = 0; i < 6000 && beat.active(); i++) {
      frame();
      if (!shipPx && st().step === "robots") shipPx = px((BAY.window.x0 + BAY.window.x1) / 2, (BAY.window.y0 + BAY.window.y1) / 2 - 20);
    }
    out.shipPx = shipPx;
    out.end = { ch1Step: n.ch1Step, chip: ss.chipNow(), room: n.room, ctrl: n.ctrl, active: beat.active(), step: st().step, papers: st().papers.where, sounds: beat.debug().sounds, code: beat.debug().code };
    out.shakes = [...out.shakes];
    out.papersSeen = [...out.papersSeen];
    return out;
  },
  { BAY, HALL_SPEAKER },
);

// beat 28
const pa = run.bubbles["Universal Postal Service ship arriving!"];
g.check("28: the wall speaker's line sits beside the hall speaker, to its left and level with it (not the old banner)", !!pa && !!pa.box && pa.box.x + pa.box.w <= HALL_SPEAKER.x0 && pa.box.y < HALL_SPEAKER.y1 + 20, pa);
g.check("28: sound waves come off the hall speaker while it talks", pa && pa.ring === "hall", pa);
g.check("28: then Mops, Squatch, Mops, word for word, in order", run.lines.slice(0, 4).join(" / ") === ["Universal Postal Service ship arriving!", "I better go see what that is.", "Please let me follow you, I'll be really sneaky.", "Okay, just this time, but hide carefully."].join(" / "), run.lines.slice(0, 4));
// beat 29
g.check("29: hall, hallway, loading bay, then the hallway again on the way home", run.rooms.join(",") === "hall,passage,hangar,passage", run.rooms);
g.check("29: the walk is a cutscene: no control, and nothing in the hallway is offered", !run.ctrlDuring.length && !run.offersInHallway.length, { ctrl: run.ctrlDuring, offers: run.offersInHallway });
g.check("nobody jumps more than 60 between frames inside a room", run.jumps.length === 0, run.jumps);
g.check("29: in the bay, \"Squatch: hide in the plant\" with control", run.hide.chip === "Squatch: hide in the plant" && run.hide.ctrl && run.hide.room === "hangar" && run.hide.ch1Step === "bay-hide", run.hide);
g.check("29: at the plant, HIDE · plant, and the plant is outlined", run.hide.offer === "HIDE · plant" && run.hide.outline === "d2-HIDE-plant", run.hide);
g.check("29: hidden: only his eyes, white, in the middle of the plant's leaves", run.hidden.pose === "hidden" && run.eyesWhite === 1, run.hidden);
// beats 30 to 35
g.check("30 to 36: no cone of a robot, Isfred or a worker ever holds him", run.seen.length === 0, run.seen.slice(0, 5));
g.check("30 to 36: no control until beat 37", !run.ctrlDuring.length, run.ctrlDuring);
g.check("every part plays, in order", JSON.stringify(run.parts) === JSON.stringify(["pa", "walk", "hide", ...BAY_PARTS, "done"]), run.parts);
g.check("30: the ship docks: the locked day picture's grey ship shows in the window", !!run.shipPx && run.shipPx[0] > 150 && run.shipPx[2] > 150 && Math.abs(run.shipPx[0] - run.shipPx[2]) < 40, run.shipPx);
g.check("30: Isfred shakes each of the three workers' hands", JSON.stringify(run.shakes.sort()) === "[0,1,2]", run.shakes);
const f = run.drew["closeUp-form"];
const inside = (a, b) => a.x0 >= b.x0 - 1 && a.x1 <= b.x1 + 1 && a.y0 >= b.y0 - 1 && a.y1 <= b.y1 + 1;
g.check("32: the form close-up shows the white copy, the big pink and a smaller yellow stuck under the pink's corner", !!f && !!f.parts && f.parts.yellow.x1 - f.parts.yellow.x0 < f.parts.pink.x1 - f.parts.pink.x0 && f.parts.yellow.x0 < f.parts.pink.x1 && f.parts.yellow.y0 < f.parts.pink.y1 && inside(f.parts.white, f.box), f && f.parts);
g.check("32: ORDER MORE ROBOTS on the pink, with its box", !!f && f.parts.words.text === "ORDER MORE ROBOTS" && inside(f.parts.box, f.parts.pink), f && f.parts.words);
g.check("32: the office code (169556, Brian 2026-11-26) written on the pink and the same coming through on the yellow", !!f && run.end.code === "169556" && f.parts.code.text === "169556" && f.parts.carbon.text === "169556", f && f.parts.code);
g.check("32: the close-up's words are big enough to read on a phone (code 16 px or more at 375 wide)", !!f && f.parts.code.size * (355 / 960) >= 16, f && f.parts.code.size);
g.check("32: Mops's paper joke over the close-up, its bubble clear of it", (() => { const b = run.bubbles["So futuristic and we still order on paper."]; return !!b && b.closeUp === "form" && (b.box.x + b.box.w <= f.box.x0 + 2 || b.box.y + b.box.h <= f.box.y0 + 2); })(), run.bubbles["So futuristic and we still order on paper."]);
g.check("32: the wall speaker chimes (its ding-dong) and the papers go out to the office", (run.end.sounds.dingDong || 0) >= 1 && run.papersSeen.includes("office"), run.papersSeen);
const r33 = run.bubbles["Left one of the copies in the office. What do I do with the other two?"];
g.check("33: the robot comes back holding the two other copies (no white one)", !!r33 && r33.who === "robot" && r33.papers === "robot0", r33);
g.check("33: Mops takes them, and bites them by the vent, in a close-up (a chomp)", run.papersSeen.includes("mops-hoof") && !!run.drew["closeUp-bite"] && run.bubbles["Delicious."].closeUp === "bite" && (run.end.sounds.chomp || 0) >= 1, run.bubbles["Delicious."]);
const gum = run.bubbles["You're gumbling! (goat mumbling)"];
g.check("34: \"Mmf mrrf!\" by the plant in a close-up; Squatch's line from his eyes in the plant", run.bubbles["Mmf mrrf!"].closeUp === "plant" && !!gum && gum.box && Math.abs(gum.box.x + gum.box.w / 2 - BAY.plant.eyes.x) < 200 && gum.box.y + gum.box.h < BAY.plant.eyes.y, { mmf: run.bubbles["Mmf mrrf!"], gum });
g.check("35: the copies fly into the bin by the plant and stay there", run.papersSeen.includes("flying") && run.bubbles["Ptoo!"].papers === "bin" && run.end.papers === "bin", run.papersSeen);
// beat 36
g.check("36: Mops's cone holds him (hearts) once he is out of the plant", run.mopsSaw);
g.check("36: in the hallway the robots glow on Mops's line", run.bubbles["We got to watch out for these robots."].glow && run.bubbles["We got to watch out for these robots."].room === "passage");
// the hallway's lines sit beside the speaker's head: not on it, and no further than 60 from it (the photo wall's heading
// once pushed one to the far corner)
const besideHead = ["We got to watch out for these robots.", "What's the difference between fur and hair?", "Paperwork."].map((t) => {
  const b = run.bubbles[t] || {},
    x = b.box,
    h = b.head;
  if (!x || !h) return { t, bad: "no box" };
  const over = x.x < h.x + h.w && x.x + x.w > h.x && x.y < h.y + h.h && x.y + x.h > h.y,
    gap = Math.max(h.x - (x.x + x.w), x.x - (h.x + h.w), h.y - (x.y + x.h), x.y - (h.y + h.h), 0);
  return { t, over, gap: Math.round(gap) };
});
g.check("36: in the hallway each bubble sits beside its speaker's head, not on it", besideHead.every((b) => b.over === false && b.gap <= 60), besideHead);
g.check("36: then the fur and hair question and \"Paperwork.\"", run.lines.slice(-2).join(" / ") === "What's the difference between fur and hair? / Paperwork.", run.lines.slice(-2));
g.check("36 ends with beat 37: the hallway, \"Squatch: go on\", control (ch1WalkHomeDone)", run.end.room === "passage" && run.end.ch1Step === "photos" && run.end.chip === "Squatch: go on" && run.end.ctrl && !run.end.active, run.end);
g.check("only the lines file's words were said", run.lines.every((t) => WORDS.has(t)), run.lines.filter((t) => !WORDS.has(t)));

// ---------- ↺ in every part ----------
const restarts = await page.evaluate((parts) => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay"),
    out = {};
  for (const p of parts) {
    n.q = [];
    n.cur = null;
    ss.ch1JumpBeat(29);
    beat.jump(p);
    for (let i = 0; i < 30; i++) ss.tick(0.05);
    const before = beat.debug().state.step;
    ss.sectionReset();
    for (let i = 0; i < 2; i++) ss.tick(0.05);
    out[p] = { before, after: beat.debug().state.step, hidden: n.sqPose, room: n.room, queued: n.q.length + (n.cur ? 1 : 0) };
  }
  // behind the counter (beat 28): its lines again from the first, with no control
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(28);
  for (let i = 0; i < 20; i++) (ss.tick(0.05), n.cur && n.cur.k === "bub" && n.cur.b.text.startsWith("Universal") && ((n.bt = 1), ss.opTap()));
  ss.sectionReset();
  ss.tick(0.05);
  out.pa = { after: beat.debug().state.step, room: n.room, ctrl: n.ctrl, line: n.cur && n.cur.b ? n.cur.b.text : "" };
  // the hide step: walked off, ↺ brings back its start (where he came in, with control and the plant to hide in)
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(29);
  for (let i = 0; i < 4; i++) ss.tick(0.05);
  n.sq.x = 700;
  n.sq.y = 560;
  ss.tick(0.05);
  ss.sectionReset();
  ss.tick(0.05);
  out.hide = { after: beat.debug().state.step, room: n.room, ctrl: n.ctrl, x: Math.round(n.sq.x), y: Math.round(n.sq.y), pose: n.sqPose };
  // the walk home, already in the hallway: back to the start of the walk home, in the plant
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(29);
  beat.jump("home");
  for (let i = 0; i < 2000 && n.room !== "passage"; i++) (ss.tick(0.05), n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap()));
  ss.sectionReset();
  ss.tick(0.05);
  out.hallway = { after: beat.debug().state.step, room: n.room, pose: n.sqPose, robots: beat.debug().state.robots.filter((r) => r.show && r.room === "passage").length };
  // in the walk: back to the bay's hide step, with control
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(28);
  for (let i = 0; i < 400 && beat.debug().state.step !== "walk"; i++) (ss.tick(0.05), n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap()));
  for (let i = 0; i < 20; i++) ss.tick(0.05);
  ss.sectionReset();
  ss.tick(0.05);
  out.walk = { after: beat.debug().state.step, ctrl: n.ctrl, room: n.room, chip: ss.chipNow() };
  return out;
}, BAY_PARTS);
const special = { walk: (r) => r.after === "hide" && r.ctrl && r.room === "hangar", pa: (r) => r.after === "pa" && r.room === "hall" && !r.ctrl && r.line === "Universal Postal Service ship arriving!", hide: (r) => r.after === "hide" && r.ctrl && r.room === "hangar" && r.x === 236 && r.y === 470 && r.pose === "stand", hallway: (r) => r.after === "home" && r.room === "hangar" && r.pose === "hidden" && r.robots === 0 };
const badRestart = Object.entries(restarts).filter(([p, r]) => (special[p] ? !special[p](r) : !(r.after === p && r.room === "hangar" && r.hidden === "hidden" && r.queued > 0)));
g.check("↺ in each part of the cutscene starts that part again (beat 28: its first line; the hide step: where he came in; the walk: the hide step; the hallway: the walk home's start, in the plant)", badRestart.length === 0, restarts);
g.check("the chapter reset clears the loading bay", await page.evaluate(() => (window.__ss.op.ch1Bay = { step: "sign" }, window.SSQ.engine().resetChapter(), window.__ss.op.ch1Bay == null)));

// ---------- the old code is gone ----------
const game = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
const old = ["function ch1HideBay", "function ch1BayLines", "function ch1AtDelivery", "So futuristic and we still order on paper.", "Isfred! A crate is damaged in the mail room."].filter((s) => game.includes(s));
g.check("the old beats 28 to 36 code is gone from src/game", old.length === 0, old);
g.check("no page errors", errors.length === 0, errors.slice(0, 5));
await g.finish("loading-bay");
