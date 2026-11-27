/**
 * Beats 28 to 36 and 36b, the loading bay (src/modules/loading-bay.js), rebuilt from the story pass of 2026-11-26, at
 * phone size. The beat is played from behind the snack counter to the snack counter's front in the party hall, the
 * player's steps taken the way a kid would (stand on the spot, press the button), and each checked as it comes:
 *   - 28: the station speaker's line beside the hall speaker with sound waves; then the snack ship's lines in order;
 *   - 29: the hallway is the player's (follow Mops to the ship); the photo wall turns him back with "Later. The ship!";
 *     in the bay "Hide!" and ROLL · ball behind the cargo, where he is the ball;
 *   - 30: the robots roll under the scanner arch (NO FUR. PROCEED.), the station's crates come down, the robot mailbox
 *     takes a letter (Mail scanned.); the sneak to the plant past a patrolling robot (HIDE · plant); Isfred's lines;
 *     three workers each hand a robot their tool; Lou is stopped at the arch for his fuzzy hat, which stays on the floor;
 *   - 31 and 32: the promise; PEEK · form opens the form close-up: ORDER MORE ROBOTS on the pink, the office code 169556
 *     written on the pink and coming through on the yellow; the ship's ramp goes up before the ship leaves;
 *   - 33 to 35: the player is switched to Mops (a switch card) and takes, eats (the bite close-up), talks (the mumble
 *     whisper, "I can't understand you with paper in your mouth."), spits the copies into the bin, picks up the tagged
 *     box and gives it (the tag close-up), then is switched back to Squatch;
 *   - 36: the empty hallway; the office door opens with a robot; ROLL · ball in time gives the hairball close-up and its
 *     lines; too slow, the robot sees fur and the one capture rule runs (the lockup names "A robot");
 *   - 36b: three cleaning robots mop their lanes in the party hall; Mops in a lane stops one (its lines); plants block
 *     sight; reaching the snack counter hands over to the storm (the evening's startStorm, or the older program's step).
 * Also: the lines table for Brian matches the lines file; nothing but the lines file's words is said; ↺ at each step;
 * the chapter reset; the hand-over to the evening's start(); the old code gone; the snack's names in one file.
 *   node tests/loading-bay.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const { BAY_LINES } = await import(M("loading-bay-lines.js"));
const { BAY, BAY_SPOTS, HALLWAY, HALL_SNEAK } = await import(M("loading-bay-place.js"));
const { HALL, HALL_SPEAKER } = await import(M("party-hall.js"));
const WORDS = new Set(BAY_LINES.map((l) => l.text));
const line = (id) => BAY_LINES.find((l) => l.id === id).text;

const g = await startGame({ port: 9800, name: "loading-bay" });

// ---------- the lines table for Brian ----------
const doc = readFileSync(join(root, "docs", "CH1-LINES-FOR-BRIAN.md"), "utf8"),
  afterIndex = doc.slice(doc.indexOf("<!-- /section-index -->")),
  table = afterIndex.slice(afterIndex.indexOf("## Loading bay (beats 28 to 36, and 36b)"), afterIndex.indexOf("\n## ", afterIndex.indexOf("## Loading bay (beats 28 to 36, and 36b)") + 5));
const STATUS = { pending: "Pending", decided: "Decided", approved: "Approved", "in-game": "In the game already" };
const offTable = BAY_LINES.filter((l) => !table.split("\n").some((row) => row.includes(`| ${l.text.replace(/\|/g, "\\|")} |`) && row.trim().endsWith(`| ${STATUS[l.status]} |`)));
g.check("every line of the lines file is in Brian's lines table, word for word, with its status", offTable.length === 0, offTable.map((l) => l.text));
const notPending = BAY_LINES.filter((l) => /\((NEW|CHANGED)/.test(l.source || "") && l.status !== "pending");
g.check("every NEW or CHANGED line from the story pass is still pending", notPending.length === 0, notPending.map((l) => l.text));

// ---------- the snack's names in one place ----------
const mods = readdirSync(join(root, "src", "modules")).filter((f) => f.startsWith("loading-bay"));
const typed = mods.filter((f) => new RegExp("cakes-brand|stars-cakes|[a-z]ar" + "s cakes", "i").test(readFileSync(M(f), "utf8")));
g.check("the bay's crates carry the station's stamp (crate-stamp.js drawStationStamp, its words from snack-name.js): no loading bay file spells the snack's name", typed.length === 0 && /drawStationStamp/.test(readFileSync(M("loading-bay-art.js"), "utf8")), typed);

// the hallway's far ends take him through inside the hallway's walk bounds (x 60 to 900, 00-core.js): a doorway he
// cannot reach is a dead end (the first video stopped at x 893, short of a trigger at 916)
g.check("behind the cargo the ball sits against its side, so part of him always shows (never wholly behind it)", BAY.cargo.ball.x >= BAY.cargo.box.x1 + 10, BAY.cargo);
g.check("the hallway's walk-through ends are inside its walk bounds", HALLWAY.exitRight < 900 - 8 && HALLWAY.exitLeft > 60 + 8 && HALLWAY.trigger < HALLWAY.exitRight, HALLWAY);

// ---------- the beat, played ----------
const { page, errors } = await g.open("?beat=bay:pa", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
await page.evaluate(() => window.__ss.lockedReady);
await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
await page.evaluate(() => (window.requestAnimationFrame = () => 0));
g.check("the loading bay beat is registered (ch1-bay) and ?beat=bay:pa opens it behind the snack counter", await page.evaluate(() => !!window.SSQ.beat("ch1-bay") && window.SSQ.beat("ch1-bay").debug().state.step === "pa" && window.__ss.op.room === "hall"));

// One driver for every run: plays frames, answers each bubble with NEXT (as a kid, after a moment), and at each of the
// player's steps puts the right one on its spot and presses the button. `stopAt(state)` ends it early.
await page.evaluate(
  ({ BAY, BAY_SPOTS, HALL_SNEAK }) => {
    window.__bayDrive = (opts = {}) => {
      const ss = window.__ss,
        n = ss.op,
        beat = window.SSQ.beat("ch1-bay"),
        st = () => beat.debug().state || {},
        // the evening (evening.js) follows beat 36 in the hallway (37, the photo wall) and starts 36b from there
        ev = window.SSQ.beat("ch1-evening"),
        evStep = () => (n.ch1Evening && n.ch1Evening.step) || "",
        evBetween = () => !beat.active() && !!ev && ["walkin", "wall", "tohall", "hallsneak"].includes(evStep()),
        out = { lines: [], bubbles: {}, rooms: [], parts: [], steps: {}, jumps: [], seenInCutscene: [], drew: {}, samples: {}, cards: [] };
      let prev = null,
        lastLine = "";
      const sample = (k, v) => (out.samples[k] = out.samples[k] || v);
      const frame = () => {
        ss.tick(0.05);
        ss.drawFrame();
        if (opts.until && opts.until(st())) return "stop";
        out.evening = out.evening || [];
        evStep() && out.evening[out.evening.length - 1] !== evStep() && out.evening.push(evStep());
        const s = st(),
          d = beat.debug().drew || {};
        const at = { room: n.room, ctrl: n.ctrl, sq: { x: n.sq.x, y: n.sq.y }, mo: { x: n.mo.x, y: n.mo.y } };
        // nobody jumps more than 60 in a frame while the game moves them (the player's own steps are placed by the test)
        if (prev && prev.room === at.room && !prev.ctrl && !at.ctrl) for (const who of ["sq", "mo"]) Math.hypot(at[who].x - prev[who].x, at[who].y - prev[who].y) > 60 && out.jumps.push(who + " in " + at.room + " at " + s.step);
        prev = at;
        out.rooms[out.rooms.length - 1] !== n.room && out.rooms.push(n.room);
        s.step && out.parts[out.parts.length - 1] !== s.step && out.parts.push(s.step);
        !n.ctrl && beat.seenNow() && out.seenInCutscene.push(s.step);
        if (d.closeUp && d.closeUp.u === 1) out.drew["closeUp-" + d.closeUp.id] = d.closeUp;
        if (s.step === "robots" && d.shimmer) sample("shimmer", true);
        if (s.stopAt) sample("louStopped", { step: s.step, line: n.cur && n.cur.b ? n.cur.b.text : "", hat: s.workers.map((w) => w.hat) });
        if (s.hatOnFloor) sample("hatOnFloor", { step: s.step });
        if (d.mail) sample("mailByBox", true);
        // the bay camera's layer (round 7, q: 123): none on the bay's picture until the robot has put it up
        const cam = window.SSQ.cameraLayerDrawn();
        if (n.room === "hangar" && !s.camera) sample("noCameraYet", { handed: cam.handed });
        if (n.room === "hangar" && !s.camera && out.samples.noCameraYet && cam.handed !== out.samples.noCameraYet.handed) sample("cameraTooSoon", s.step);
        if (s.installAt >= 0) sample("installing", { robot: s.robots[2] && { x: s.robots[2].x, y: s.robots[2].y } });
        if (n.room === "hangar" && s.camera && s.step === "peek") sample("cameraOnPicture", { id: cam.lastId });
        if (d.passing && !s.workers[2].hat) sample("hairPass", true);
        if (s.robots && s.robots.some((r) => r.carry === "letter")) sample("letter", true);
        if (s.ship < 1 && s.ship > 0) sample("shipLeaving", { ramp: s.ramp });
        if (s.ramp > 0 && s.ship === 0) sample("rampWithoutShip", true);
        if (s.robots && s.robots.some((r) => r.carry && r.carry !== "letter")) sample("robotCarries", s.robots.map((r) => r.carry || ""));
        if (s.step === "walkby" && s.office >= 1) sample("officeOpen", { rollBy: s.rollBy });
        if (s.step === "walkby" && s.office > 0 && s.rollBy > 0) sample("robotOut", { f: s.robots[0].f, rollAfterTurn: +(s.rollBy - s.turnAt).toFixed(2) });
        if (s.step === "after" && n.room === "passage" && s.officeShut >= 1) sample("officeShutAfter", { drawn: window.SSQ.beat("ch1-bay").debug().drew.officeDrawn });
        if (s.hall && s.hall.shookAt) sample("mopsShook", true);
        if (n.cur && n.cur.k === "card") {
          const c = n.cur;
          out.cards[out.cards.length - 1] !== (c.text || c.who || "card") && out.cards.push(c.text || c.who || "card");
        }
        if (n.cur && n.cur.k === "bub") {
          const b = n.cur.b;
          if (b.text !== lastLine && s.step !== "done") {
            lastLine = b.text;
            for (let i = 0; i < 8; i++) (ss.tick(0.05), ss.drawFrame());
            const lb = window.__ss.lastBubble,
              d2 = beat.debug().drew || {};
            out.lines.push(b.text);
            out.bubbles[b.text] = out.bubbles[b.text] || { who: b.who, name: window.SSQ.speakerName(b.who), style: b.style || "", ear: !!b.ear, box: lb ? { x: lb.x, y: lb.y, w: lb.w, h: lb.h } : null, step: st().step, ring: d2.ring || "", closeUp: d2.closeUp ? d2.closeUp.id : "", papers: st().papers ? st().papers.where : "", room: n.room, asMops: !!st().asMops, box2: st().box };
            if (b.text === "Here's the code to unlock the door.") {
              // the pen writes the code while he says so: give it the time a reader takes
              for (let i = 0; i < 60; i++) (ss.tick(0.05), ss.drawFrame());
              const d3 = beat.debug().drew || {};
              d3.closeUp && (out.drew.codeWritten = d3.closeUp);
            }
          }
          n.bt = 1;
          ss.opTap();
          return;
        }
        if (n.cur && n.cur.k === "card") {
          n.bt = 1;
          ss.opTap();
          return;
        }
        lastLine = "";
        // beat 37 (the evening): he walks straight on into the hall's doorway, which starts 36b
        if (evBetween()) {
          if (n.ctrl && !n.cur && evStep() === "wall") ((n.sq.x = ev.place.HALLWAY.left.x), (n.sq.y = ev.place.HALLWAY.left.y));
          return;
        }
        // the player's steps
        if (n.ctrl && !n.cur && !s.alarm) {
          const S = s.step;
          if (!out.steps[S]) out.steps[S] = { chip: ss.chipNow(), ch1Step: n.ch1Step, room: n.room, offers: [] };
          if (opts.stopAt && opts.stopAt(s)) return "stop";
          const press = (place) => {
            place();
            ss.tick(0.05);
            const o = ss.offerNow();
            if (o) {
              const tag = o.verb + " · " + o.cap;
              out.steps[S].offers.includes(tag) || out.steps[S].offers.push(tag);
              o.f();
            }
            return o;
          };
          if (S === "counter") {
            const L0 = n.ch1Lunch || {};
            sample("counter", { pose: L0.pose, lunchStep: L0.step, outline: (beat.debug().drew || {}).outline || null, mopsPose: n.moPose, room: n.room });
            (n.sq.x = 930), (n.sq.y = 318);
          } else if (S === "hallway") ((n.sq.x = 935), (n.sq.y = 332));
          else if (S === "cargo") press(() => ((n.sq.x = BAY.cargo.ball.x), (n.sq.y = BAY.cargo.ball.y)));
          else if (S === "sneak") press(() => ((n.sq.x = BAY.plant.stand.x), (n.sq.y = BAY.plant.stand.y)));
          else if (S === "peek") press(() => 0);
          else if (S === "take" || S === "eat") press(() => ((n.mo.x = BAY_SPOTS.mopsWatch.x), (n.mo.y = BAY_SPOTS.mopsWatch.y)));
          else if (S === "talkto" || S === "give") press(() => ((n.mo.x = BAY_SPOTS.talk.x), (n.mo.y = BAY_SPOTS.talk.y)));
          else if (S === "spit") press(() => ((n.mo.x = BAY_SPOTS.spit.x), (n.mo.y = BAY_SPOTS.spit.y)));
          else if (S === "box") press(() => ((n.mo.x = BAY_SPOTS.boxPick.x), (n.mo.y = BAY_SPOTS.boxPick.y)));
          else if (S === "home") ((n.sq.x = 50), (n.sq.y = 336));
          else if (S === "walkby") {
            if (s.rollBy < 0 && s.office === 0) ((n.sq.x = 600), (n.sq.y = 360));
            else if (s.rollBy > 0 && !s.ball && !opts.tooSlow) press(() => 0);
            else if (s.rollBy < 0 && !s.ball && s.office >= 1) ((n.sq.x = 30), (n.sq.y = 340));
          } else if (S === "hall" && !opts.stayInHall) ((n.sq.x = HALL_SNEAK.goal.x), (n.sq.y = HALL_SNEAK.goal.y));
          if (S === "cargo" || S === "walkby") sample("ball-" + S, s.ball || st().ball);
        }
      };
      for (let i = 0; i < (opts.frames || 12000); i++) {
        if (frame() === "stop") break;
        if (!beat.active() && !opts.pastEnd && !evBetween()) break;
      }
      out.end = { evening: evStep(), step: st().step, room: n.room, ctrl: n.ctrl, ch1Step: n.ch1Step, chip: ss.chipNow(), active: beat.active(), code: beat.debug().code, papers: st().papers ? st().papers.where : "", box: st().box, sq: { x: n.sq.x, y: n.sq.y }, alarm: !!st().alarm };
      return out;
    };
  },
  { BAY, BAY_SPOTS, HALL_SNEAK },
);

const run = await page.evaluate(() => window.__bayDrive({ pastEnd: false }));
const B = (id) => run.bubbles[line(id)];

// 28
const pa = B("pa-ship");
g.check("28: the station speaker's line sits beside the hall speaker, to its left and level with it, sound waves coming off it", !!pa && !!pa.box && pa.box.x + pa.box.w <= HALL_SPEAKER.x0 && pa.box.y < HALL_SPEAKER.y1 + 20 && pa.ring === "hall", pa);
const order28 = ["pa-ship", "sq-stars-ship", "sq-new-kind", "sq-crate-kind", "mops-maybe", "mops-see", "sq-come", "mops-once", "mops-hide-when"].map(line);
g.check("28: then the snack ship's lines, word for word and in order", run.lines.slice(0, order28.length).join(" / ") === order28.join(" / "), run.lines.slice(0, order28.length));
// 29 (round 7, r5 0:20: no scripted stand-up; he stands and walks out himself, under the lunch crowd's cones)
g.check("29 (round 7, r5 0:20): after the talk Mops goes on ahead and the player has Squatch ducked behind the counter: \"Squatch: follow Mops to the ship\", the hallway doorway outlined, the lunch's sight still on", !!run.steps.counter && run.steps.counter.room === "hall" && run.steps.counter.chip === line("chip-follow") && run.steps.counter.ch1Step === "bay-counter" && !!run.samples.counter && run.samples.counter.pose === "ducked" && run.samples.counter.lunchStep === "handoff" && run.samples.counter.mopsPose === "hidden" && !!run.samples.counter.outline, { step: run.steps.counter, at: run.samples.counter });
g.check("29: the hallway is the player's: control, \"Squatch: follow Mops to the ship\"", !!run.steps.hallway && run.steps.hallway.room === "passage" && run.steps.hallway.chip === line("chip-follow") && run.steps.hallway.ch1Step === "bay-hallway", run.steps.hallway);
g.check("29: in the bay, \"Quick! The manager is coming!\" then \"Hide!\", and the goal is the cargo", run.lines.indexOf(line("mops-manager")) >= 0 && run.lines.indexOf(line("mops-hide")) === run.lines.indexOf(line("mops-manager")) + 1 && run.steps.cargo && run.steps.cargo.chip === line("chip-cargo"), run.steps.cargo);
g.check("29: behind the cargo the button reads ROLL · ball and he is the ball", run.steps.cargo && run.steps.cargo.offers.includes(line("button-ball")) && run.samples["ball-cargo"] !== undefined, run.steps.cargo);
// 30
g.check("30: the robots roll under the scanner arch and its field shimmers; NO FUR. PROCEED. is overheard (ear)", !!run.samples.shimmer && B("scanner-proceed") && B("scanner-proceed").ear, { shimmer: run.samples.shimmer, b: B("scanner-proceed") });
g.check("30 (round 7, r5 3:21): no robot posts a letter at the mailbox; the little box came down the ramp with the mail, which lies beside it", !run.samples.letter && !!run.samples.mailByBox, { letter: run.samples.letter, mail: run.samples.mailByBox });
g.check("30: the sneak to the plant: \"Squatch: sneak to the plant\", HIDE · plant there", run.steps.sneak && run.steps.sneak.chip === line("chip-plant") && run.steps.sneak.offers.includes(line("button-hide")), run.steps.sneak);
g.check("30: Isfred's lines, then Squatch's whisper \"Fur in the vents... that was me.\"", ["isfred-not-sure", "isfred-fur", "isfred-convinced", "sq-was-me"].every((id) => !!B(id)) && B("sq-was-me").style === "whisper", B("sq-was-me"));
g.check("30: the workers hand their tools to the robots", Array.isArray(run.samples.robotCarries) && run.samples.robotCarries.filter(Boolean).length >= 1, run.samples.robotCarries);
g.check("30: Lou walks in wearing the fuzzy hat, is stopped at the arch (FUR. STOP. / It's a HAT.) and the hat stays on the floor", !!run.samples.louStopped && run.samples.louStopped.hat[2] === true && !!run.samples.hatOnFloor && !!B("lou-hat") && B("lou-hat").who === "lou", { stop: run.samples.louStopped, hat: run.samples.hatOnFloor });
const hatOrder = ["scanner-stop", "lou-hat", "scanner-hair", "lou-hair"].map(line);
g.check("30 (round 7, r5 1:59, q: 116): fur stops, hair goes: FUR. STOP. / It's a HAT. / (hat off) HAIR. PROCEED. / It's just hair., the arch glowing green as it lets him through", run.lines.join("|").includes(hatOrder.join("|")) && !!run.samples.hairPass && B("lou-hair").name === "Lou", { lines: run.lines.filter((t) => hatOrder.includes(t)), pass: run.samples.hairPass });
g.check("30 (round 7, r6 7:46, q: 123): \"And a camera. Just in case.\", a robot rolls under the wall vent and puts the camera up, then \"I never watch the tapes. Unless something goes wrong.\"", !!B("isfred-camera") && !!B("isfred-tapes") && run.lines.indexOf(line("isfred-tapes")) > run.lines.indexOf(line("isfred-camera")) && !!run.samples.installing && Math.abs(run.samples.installing.robot.x - BAY_SPOTS.cameraWay[1].x) < 2, run.samples.installing);
g.check("30 (q: 123): the bay's picture has no camera before it is put up, and has it (the layer) after", !!run.samples.noCameraYet && !run.samples.cameraTooSoon && !!run.samples.cameraOnPicture && /^delivery-/.test(run.samples.cameraOnPicture.id), { too: run.samples.cameraTooSoon, on: run.samples.cameraOnPicture });
// 31, 32
g.check("31: the promise, then \"Weeee-eenn-nnttt!\"", ["isfred-dont-worry", "isfred-love", "isfred-visitors", "mops-bleat-happy"].every((id) => !!B(id)), run.lines.filter((t) => t.startsWith("Mops, don't") || t.startsWith("Weeee")));
g.check("32: \"Squatch: peek at the form\" and PEEK · form", run.steps.peek && run.steps.peek.chip === line("chip-peek") && run.steps.peek.offers.includes(line("button-peek")), run.steps.peek);
const f = run.drew.codeWritten;
const inside = (a, b) => a.x0 >= b.x0 - 1 && a.x1 <= b.x1 + 1 && a.y0 >= b.y0 - 1 && a.y1 <= b.y1 + 1;
g.check("32: the form close-up: ORDER MORE ROBOTS on the pink, with its box", !!f && f.parts && f.parts.words.text === "ORDER MORE ROBOTS" && inside(f.parts.box, f.parts.pink), f && f.parts && f.parts.words);
g.check("32: the office code 169556 written on the pink and coming through on the yellow while he says so", !!f && run.end.code === "169556" && f.parts.code.text === "169556" && f.parts.carbon.text === "169556", f && f.parts && [f.parts.code.text, f.parts.carbon.text]);
g.check("32: over the form close-up a short line's bubble sits further in from the right edge, so its speaker's name tag stays on the picture", !!B("isfred-wait") && !!B("isfred-wait").box && B("isfred-wait").box.x + B("isfred-wait").box.w <= 820, B("isfred-wait"));
g.check("32: the ramp goes up before the ship leaves (never a ramp with no ship)", !!run.samples.shipLeaving && run.samples.shipLeaving.ramp === 0 && !run.samples.rampWithoutShip, run.samples);
// 33 to 35, as Mops
g.check("33: the player is switched to Mops with a switch card", run.cards.length >= 1 && B("robot-copies") && run.steps.take && run.steps.take.chip === line("chip-take"), { cards: run.cards, take: run.steps.take });
g.check("33: TAKE · copies, then EAT · copies and the bite close-up (\"Delicious.\")", run.steps.take.offers.includes(line("button-take")) && run.steps.eat.offers.includes(line("button-eat")) && B("mops-delicious").closeUp === "bite", { take: run.steps.take, eat: run.steps.eat });
g.check("34: the robots' orders, then the robots go", ["robot-office", "robot-hall", "robots-cleaning"].every((id) => !!B(id)), run.lines.filter((t) => t.startsWith("Unit")));
const mumble = B("mops-mumble");
g.check("34: TALK · Squatch: the mumble is a whisper at the plant, then \"I can't understand you with paper in your mouth.\"", run.steps.talkto.offers.includes(line("button-talk")) && !!mumble && mumble.style === "whisper" && mumble.closeUp === "plant" && run.lines.indexOf(line("sq-paper-mouth")) > run.lines.indexOf(mumble && line("mops-mumble")), mumble);
g.check("35: SPIT · bin: \"Ptoo!\" and the copies stay in the bin", run.steps.spit.offers.includes(line("button-spit")) && !!B("mops-ptoo") && run.end.papers === "bin", { spit: run.steps.spit, papers: run.end.papers });
g.check("35: PICK UP · box, GIVE · box: \"Mail for you.\", the tag close-up, \"They never forget.\"", run.steps.box.offers.includes(line("button-box")) && run.steps.give.offers.includes(line("button-give")) && !!B("mops-mail") && B("sq-never-forget").closeUp === "tag", { box: run.steps.box, give: run.steps.give });
g.check("35: then the player is Squatch again (a second switch card), going home with Mops", run.cards.length >= 2 && run.steps.home && run.steps.home.chip === line("chip-home"), { cards: run.cards, home: run.steps.home });
// 36
g.check("36: the office door opens on the walk home (a robot inside), and ROLL · ball in time is the ball", !!run.samples.officeOpen && run.steps.walkby && run.steps.walkby.offers.includes(line("button-ball")), { open: run.samples.officeOpen, walkby: run.steps.walkby });
g.check("36 (round 7, r5 3:45, q: 133): the robot comes out looking away (out of the picture) first, so he has a moment to curl up himself; it turns his way after 2 s and then he has 1.5 s more", !!run.samples.robotOut && run.samples.robotOut.f === 0 && run.samples.robotOut.rollAfterTurn === 1.5, run.samples.robotOut);
g.check("36 (round 7, r5 3:58): once the robot has rolled off, the office door slides shut again, so the hallway's door looks as in every other scene", !!run.samples.officeShutAfter && run.samples.officeShutAfter.drawn === 0, run.samples.officeShutAfter);
g.check("36: the hairball close-up and its lines, in order", B("robot-what") && B("robot-what").closeUp === "hairball" && run.lines.join("|").includes([line("robot-what"), line("mops-hairball"), line("robot-compute")].join("|")), B("robot-what"));
g.check("36: then \"We have to watch out for these robots.\", the fur and hair question and \"Paperwork.\"", run.lines.join("|").includes([line("mops-robots"), line("sq-fur"), line("mops-paperwork")].join("|")), run.lines.slice(-6));
g.check("hall, hallway, bay, hallway, party hall", run.rooms.join(",") === "hall,passage,hangar,passage,hall", run.rooms);
// 36b
g.check("36b: in the party hall, \"Squatch: get past the robots\" with control", run.steps.hall && run.steps.hall.room === "hall" && run.steps.hall.chip === line("chip-hall"), run.steps.hall);
g.check("36b: reaching the snack counter hands over (the evening's storm, 38a)", !run.end.active && run.end.step === "done" && run.end.room === "hall" && ["tostorm", "storm"].includes(run.end.evening), run.end);
g.check("beat 36's end goes on to the evening's photo wall (37) in the hallway, and walking into the hall's doorway starts 36b", JSON.stringify((run.evening || []).filter((s) => s !== "tohall").slice(0, 3)) === JSON.stringify(["walkin", "wall", "hallsneak"]), run.evening);
// all through
g.check("in the cutscenes nobody's cone ever holds him", run.seenInCutscene.length === 0, run.seenInCutscene.slice(0, 5));
g.check("nobody the game walks jumps more than 60 between frames", run.jumps.length === 0, run.jumps.slice(0, 5));
g.check("only the lines file's words were said", run.lines.every((t) => WORDS.has(t)), run.lines.filter((t) => !WORDS.has(t)));
g.check("the workers' bubbles are named Dot, Bob and Lou", [B("dot-toaster"), B("bob-way-up"), B("lou-hat")].map((b) => b && b.name).join(",") === "Dot,Bob,Lou", [B("dot-toaster"), B("bob-way-up"), B("lou-hat")].map((b) => b && b.name));

// ---------- the photo wall in the hallway, on the way to the ship ----------
// (round 7, r5 0:27, q: 133: "Later. The ship!" is cut, and nothing turns him back at the photo wall now)
const later = await page.evaluate(({ HALLWAY }) => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay");
  n.q = [];
  n.cur = null;
  beat.jump("hallway");
  for (let i = 0; i < 10; i++) ss.tick(0.05);
  const W = HALLWAY.photoWall;
  n.sq.x = (W.x0 + W.x1) / 2;
  n.sq.y = W.y1 - 4;
  for (let i = 0; i < 3; i++) ss.tick(0.05);
  return { line: n.cur && n.cur.b ? n.cur.b.text : "", y: n.sq.y, step: beat.debug().state.step };
}, { HALLWAY });
g.check("29: walking up to the photo wall, nobody speaks and he is not turned back (\"Later. The ship!\" is cut)", later.line === "" && later.y === HALLWAY.photoWall.y1 - 4 && later.step === "hallway", later);

// ---------- 36: in the hallway home he starts inside its walk bounds (the kid-play robot found him at x 936) ----------
const homeIn = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay");
  n.q = [];
  n.cur = null;
  beat.jump("walkby");
  for (let i = 0; i < 400 && !(n.ctrl && n.room === "passage"); i++) ss.tick(0.05);
  return { room: n.room, x: Math.round(n.sq.x), y: Math.round(n.sq.y), mo: Math.round(n.mo.x), moY: Math.round(n.mo.y) };
});
// (and not on each other: the kid-play robot counts Mops as 46 either way round his feet)
g.check("36: on the walk home Squatch and Mops come into the hallway inside its walk bounds (x 60 to 900), side by side, not on each other", homeIn.room === "passage" && homeIn.x >= 60 && homeIn.x <= 900 && homeIn.mo <= 900 && (Math.abs(homeIn.x - homeIn.mo) > 52 || Math.abs(homeIn.y - homeIn.moY) > 52), homeIn);

// ---------- 36: too slow at the office door ----------
const slow = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay");
  n.q = [];
  n.cur = null;
  beat.jump("walkby");
  let card = null,
    alarm = false;
  window.__bayDrive({
    tooSlow: true,
    pastEnd: true,
    frames: 1500,
    until: (s) => {
      alarm = alarm || !!s.alarm;
      if (n.cur && n.cur.k === "card") card = JSON.stringify(n.cur, (k, v) => (typeof v === "function" ? undefined : v));
      return !!card;
    },
  });
  return { card, alarm };
});
g.check("36: too slow to roll, the robot sees fur: the alarm and the one capture rule (the lockup names a robot in the hallway)", slow.alarm && !!slow.card && /LOCKUP/.test(slow.card) && /A robot/.test(slow.card) && /hallway/.test(slow.card), slow);

// ---------- 29 (round 7, r5 0:20): at the counter, standing up in someone's sight is the one capture rule ----------
const counter = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay"),
    lunch = window.SSQ.beat("ch1-lunch");
  n.q = [];
  n.cur = null;
  beat.jump("counter");
  const out = { step: beat.debug().state.step, pose: n.ch1Lunch.pose, ctrl: n.ctrl };
  // ducked in the counter's aisle: hidden, whatever the crowd looks at, for 8 s
  for (let i = 0; i < 160; i++) (ss.tick(0.05), ss.drawFrame());
  out.ducked = { alarm: !!n.ch1Lunch.alarm, step: beat.debug().state.step };
  // stood up out of the aisle inside a watcher's cone: "?", then the alarm
  const c = lunch.debug().cones.find((q) => q.len > 60);
  n.sq.x = c.ox + Math.cos(c.a) * c.len * 0.5;
  n.sq.y = c.oy + Math.sin(c.a) * c.len * 0.5;
  for (let i = 0; i < 40 && !n.ch1Lunch.alarm; i++) {
    const cc = lunch.debug().cones.find((q) => q.id === c.id);
    (n.sq.x = cc.ox + Math.cos(cc.a) * cc.len * 0.5), (n.sq.y = cc.oy + Math.sin(cc.a) * cc.len * 0.5);
    ss.tick(0.05);
    ss.drawFrame();
  }
  out.seen = { alarm: !!n.ch1Lunch.alarm, chip: ss.chipNow() };
  // the place to hide is shown: back behind the counter (its aisle outlined, a place to walk to)
  for (let i = 0; i < 30; i++) (ss.tick(0.05), ss.drawFrame());
  out.hideShown = { outline: (beat.debug().drew || {}).outline || null, spots: ss.spotsNow().map((q) => q.id), phase: n.ch1Lunch.alarm && n.ch1Lunch.alarm.phase };
  // he walks back into the aisle: ducked, hidden; the search ends with "They lost you" and the goal is the doorway again
  (n.sq.x = 893), (n.sq.y = 420);
  let jail = false;
  for (let i = 0; i < 1600 && n.ch1Lunch.alarm; i++) {
    if (n.cur && n.cur.k === "bub") ((n.bt = 1), ss.opTap());
    jail = jail || (n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail");
    ss.tick(0.05);
    ss.drawFrame();
  }
  for (let i = 0; i < 10; i++) ss.tick(0.05);
  out.hidden = { alarm: !!n.ch1Lunch.alarm, pose: n.ch1Lunch.pose, jail, chip: ss.chipNow(), step: beat.debug().state.step };
  // ↺ there: the counter step again, ducked, no alarm
  beat.restart();
  out.again = { step: beat.debug().state.step, pose: n.ch1Lunch.pose, alarm: !!n.ch1Lunch.alarm, room: n.room };
  return out;
});
g.check("29 (round 7, r5 0:20): seen at the counter, the aisle behind it is outlined as the place to hide; ducked there, the search loses him and the goal is the doorway again", !!counter.hideShown.outline && counter.hideShown.outline.y0 >= 340 && counter.hideShown.spots.includes("bay-counter-hide") && !counter.hidden.alarm && counter.hidden.pose === "ducked" && !counter.hidden.jail && counter.hidden.chip === line("chip-follow") && counter.hidden.step === "counter", { shown: counter.hideShown, hidden: counter.hidden });
g.check("29 (round 7, r5 0:20): ducked in the counter's aisle no one sees him; stood up in a watcher's cone the lunch's alarm starts (\"Squatch: hide\"); ↺ puts him back behind the counter", counter.step === "counter" && counter.pose === "ducked" && !counter.ducked.alarm && counter.ducked.step === "counter" && counter.seen.alarm && /hide/.test(counter.seen.chip) && counter.again.step === "counter" && counter.again.pose === "ducked" && !counter.again.alarm && counter.again.room === "hall", counter);

// ---------- robots always show their cones, however far he is ----------
const robotCones = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay"),
    out = {};
  for (const step of ["sneak", "hall"]) {
    n.q = [];
    n.cur = null;
    beat.jump(step);
    for (let i = 0; i < 4; i++) ss.tick(0.05);
    ss.drawFrame();
    out[step] = ((beat.debug().drew || {}).cones || []).filter((c) => /^(robot|cleaner)/.test(c.id)).map((c) => ({ id: c.id, show: c.show }));
  }
  return out;
});
g.check("the robots' cones always show (the bay's sneak: all three; the party hall: all three)", robotCones.sneak.length === 3 && robotCones.hall.length === 3 && [...robotCones.sneak, ...robotCones.hall].every((c) => c.show === 1), robotCones);
// the party hall's doorway, where he comes in, is out of every lane's reach
g.check("36b: no robot's cone, at either end of its lane, reaches the doorway he comes in by", HALL_SNEAK.lanes.every((L) => {
  // (a cone 210 long, 0.42 either side of straight ahead, loading-bay.js CONE; with room for his outline)
  const dx = HALL_SNEAK.in.x - L.x1,
    dy = HALL_SNEAK.in.y - L.y;
  return Math.hypot(dx, dy) > 250 || Math.abs(Math.atan2(dy, dx)) > 0.42 + 0.2;
}), HALL_SNEAK.lanes);

// ---------- the lockup card names who saw him: the manager in the bay ----------
const byIsfred = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay");
  n.q = [];
  n.cur = null;
  beat.jump("sneak");
  for (let i = 0; i < 4; i++) ss.tick(0.05);
  const b = n.ch1Bay;
  b.robots.forEach((r) => (r.show = false));
  Object.assign(b.isfred, { show: true, x: 600, y: 420, f: 1, look: false });
  let card = null,
    alarm = false;
  // (he stands in front of Isfred and stays there; lines are read, nothing else is pressed)
  for (let i = 0; i < 1500 && !card; i++) {
    ss.tick(0.05);
    const s = n.ch1Bay || {};
    alarm = alarm || !!s.alarm;
    if (s.isfred) Object.assign(s.isfred, { x: 600, y: 420, f: 1 });
    if (s.step === "sneak" && !s.alarm) ((n.sq.x = 680), (n.sq.y = 420), (n.sqPose = "stand"), (s.ball = false));
    if (n.cur && n.cur.k === "card") card = JSON.stringify(n.cur, (k, v) => (typeof v === "function" ? undefined : v));
    else if (n.cur && n.cur.k === "bub") ((n.bt = 1), ss.opTap());
  }
  return { card, alarm, step: (n.ch1Bay || {}).step };
});
g.check("30: seen by Isfred, the lockup card names the manager in the delivery room", !!byIsfred.card && /The manager/.test(byIsfred.card) && /in the delivery room/.test(byIsfred.card), byIsfred);

// ---------- ↺ in the hallway after the hairball: the walk home through the hallway again ----------
const afterRestart = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay");
  n.q = [];
  n.cur = null;
  beat.jump("walkby");
  window.__bayDrive({ pastEnd: true, frames: 3000, until: (s) => s.step === "after" && n.cur && n.cur.k === "bub" });
  const before = { step: beat.debug().state.step, room: n.room };
  ss.sectionReset();
  for (let i = 0; i < 80; i++) ss.tick(0.05);
  return { before, after: beat.debug().state.step, room: n.room, hidden: n.sqPose };
});
g.check("↺ during the lines after the hairball starts the hallway walk home again (in the hallway, not the bay)", afterRestart.before.step === "after" && afterRestart.before.room === "passage" && afterRestart.after === "walkby" && afterRestart.room === "passage", afterRestart);

// ---------- 36b: seen in a lane; a plant between; Mops blocks a robot ----------
const hall = await page.evaluate(({ HALL, HALL_SNEAK }) => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay"),
    out = {};
  const fresh = () => {
    n.q = [];
    n.cur = null;
    beat.jump("hall");
    for (let i = 0; i < 4; i++) ss.tick(0.05);
  };
  // in front of robot 0, in its lane, standing: seen within a second
  fresh();
  let s = ss.op.ch1Bay,
    r = s.hall.robots[0];
  r.stop = 99;
  n.sq.x = r.x + r.dir * 90;
  n.sq.y = r.y;
  for (let i = 0; i < 30; i++) ss.tick(0.05);
  out.seen = { alarm: !!ss.op.ch1Bay.alarm };
  // the same, with the middle plant's leaves between the robot and him: never seen
  fresh();
  s = ss.op.ch1Bay;
  const L = HALL.plants[0].leaves,
    pot = HALL.plants[0].pot;
  s.hall.robots.forEach((q) => ((q.stop = 99), (q.x = 40), (q.y = 340), (q.f = -1)));
  r = s.hall.robots[0];
  // (the robot on the plant's left looking right; Squatch just behind the plant on its right, his feet at the pot's foot)
  Object.assign(r, { x: L.x0 - 60, y: pot.y1, f: 1, dir: 1 });
  n.sq.x = L.x1 + 16;
  n.sq.y = pot.y1;
  n.mo.x = 900;
  n.mo.y = 320;
  for (let i = 0; i < 40; i++) ss.tick(0.05);
  out.plant = { alarm: !!ss.op.ch1Bay.alarm, seenBy: ss.op.ch1Bay.seenBy };
  // and the same distance with no plant between: seen (so it was the plant)
  const dx = n.sq.x - r.x;
  fresh();
  s = ss.op.ch1Bay;
  s.hall.robots.forEach((q) => ((q.stop = 99), (q.x = 40), (q.y = 340), (q.f = -1)));
  Object.assign(s.hall.robots[0], { x: 560, y: 520, f: 1, dir: 1 });
  n.sq.x = 560 + dx;
  n.sq.y = 520;
  n.mo.x = 900;
  n.mo.y = 320;
  for (let i = 0; i < 40; i++) ss.tick(0.05);
  out.open = { alarm: !!ss.op.ch1Bay.alarm };
  // Mops standing in a lane: the robot stops and they say their lines
  fresh();
  s = ss.op.ch1Bay;
  r = s.hall.robots[1];
  n.sq.x = HALL_SNEAK.in.x;
  n.sq.y = HALL_SNEAK.in.y;
  n.mo.x = r.x + r.dir * 50;
  n.mo.y = r.y;
  const said = [];
  for (let i = 0; i < 60; i++) {
    ss.tick(0.05);
    if (n.cur && n.cur.b) (said[said.length - 1] !== n.cur.b.text && said.push(n.cur.b.text), (n.bt = 1), ss.opTap());
  }
  out.block = said;
  return out;
}, { HALL, HALL_SNEAK });
g.check("36b: standing in a robot's lane in front of it, he is seen (the alarm)", hall.seen.alarm, hall.seen);
g.check("36b: a plant between a robot and him blocks its sight (the same distance in the open: seen)", !hall.plant.alarm && !hall.plant.seenBy && hall.open.alarm, hall);
g.check("36b: Mops in a lane stops a robot: MOVE, GOAT. / You missed a corner. / CORNERS ARE NOT EFFICIENT.", hall.block.join("|") === [line("robot-move"), line("mops-corner"), line("robot-corners")].join("|"), hall.block);

// ---------- ↺ at each of the player's steps, and in a cutscene part ----------
const restarts = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay"),
    out = {};
  for (const p of ["hallway", "cargo", "sneak", "peek", "take", "talkto", "spit", "walkby", "hall", "robots", "form"]) {
    n.q = [];
    n.cur = null;
    beat.jump(p);
    for (let i = 0; i < 30; i++) (ss.tick(0.05), n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap()));
    ss.sectionReset();
    for (let i = 0; i < (p === "walkby" ? 80 : 3); i++) ss.tick(0.05);
    out[p] = { after: beat.debug().state.step, room: n.room, ctrl: n.ctrl, busy: !!(n.cur || n.q.length) };
  }
  return out;
});
const ROOM = { hallway: "passage", walkby: "passage", hall: "hall" };
const badRestart = Object.entries(restarts).filter(([p, r]) => r.after !== p || r.room !== (ROOM[p] || "hangar") || (["robots", "form"].includes(p) ? !r.busy : !r.ctrl && !r.busy));
g.check("↺ at each step starts that step again, in its room (and in a cutscene, that part)", badRestart.length === 0, restarts);
g.check("the chapter reset clears the loading bay", await page.evaluate(() => ((window.__ss.op.ch1Bay = { step: "form" }), window.SSQ.engine().resetChapter(), window.__ss.op.ch1Bay == null)));

// ---------- the hand-overs: the evening's start() after 36; its startStorm() after 36b ----------
const hand = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay"),
    called = [];
  const had = window.SSQ.beat("ch1-evening");
  const stand = { start: () => called.push({ k: "start", room: n.room }), startStorm: () => called.push({ k: "storm", room: n.room }) };
  had ? Object.assign(had, stand) : window.SSQ.registerBeat("ch1-evening", stand);
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(29);
  beat.jump("walkby");
  window.__bayDrive({ frames: 3000 });
  const afterBay = called.slice();
  // the evening calls the hall sneak after its photo wall
  beat.startHallSneak();
  window.__bayDrive({ frames: 600 });
  return { afterBay, all: called, active: beat.active() };
});
g.check("36 ends in the hallway with the evening's start() when that beat is there", hand.afterBay.length === 1 && hand.afterBay[0].k === "start" && hand.afterBay[0].room === "passage", hand);
g.check("36b, started by the evening (startHallSneak), ends at the snack counter with the evening's startStorm()", hand.all.length === 2 && hand.all[1].k === "storm" && hand.all[1].room === "hall" && !hand.active, hand);

// ---------- the old code is gone ----------
const game = readdirSync(join(root, "src", "game")).map((fl) => readFileSync(join(root, "src", "game", fl), "utf8")).join("\n");
const old = ["function ch1HideBay", "function ch1BayLines", "function ch1AtDelivery", "So futuristic and we still order on paper.", "Isfred! A crate is damaged in the mail room."].filter((s) => game.includes(s));
g.check("the old beats 28 to 36 code is gone from src/game", old.length === 0, old);
g.check("no page errors", errors.length === 0, errors.slice(0, 5));
await g.finish("loading-bay");
