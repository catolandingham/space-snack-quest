/**
 * Beat 21, the bedtime story (why Moon Pies), rebuilt as a module (src/modules/bedtime-story.js) in place of the
 * caption box the game showed before ("ch1moon"). After the TV story's "Now" card:
 *   1. with no words and no tap, Squatch walks to his crate bed and pats it, and a thought bubble shows a little
 *      Moon Pie crate; he climbs into bed and Mops comes over beside it (each wordless part plays 2 to 4 seconds);
 *   2. full-screen story pictures, each waiting for NEXT: the crate, the baby, the beard, Mops's "...Baaa?"; the
 *      captions word for word from commit 71ec66e; only Mops and baby Squatch in them, at the room's sizes;
 *   3. Mops's bedtime line, as it was, in one bubble over Mops, waiting for NEXT;
 *   4. Squatch falls asleep (the sleep pose, a gentle snore), then Day 2 begins as before.
 * The old fourth picture (the mop bucket) is off behind its switch. The old "ch1moon" panel is gone.
 *   node tests/bedtime-story.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

// The captions as commit 71ec66e had them (its crate story array), word for word.
const OLD = {
  crate: "A delivery crate of Moon Pies came to Stormtop.",
  baby: "Inside: a sleeping baby Sasquatch. Covered in crumbs.",
  beard: "He woke up, grabbed Mops's beard, and giggled.",
  baa: "...Baaa?",
  bucket: "Tourists were coming! Mops hid him in the mop bucket.",
  nothing: "Nothing to see here!",
};
const MOPS_LINE = "You came to me in a Moon Pie crate. You've loved Moon Pies ever since.";
const linesFile = join(root, "src", "modules", "bedtime-story-lines.js");
const { BEDTIME_STORY_LINES = [], BEDTIME_SWITCHES = {} } = existsSync(linesFile) ? await import(linesFile) : {};
const L = Object.fromEntries(BEDTIME_STORY_LINES.map((l) => [l.id, l]));

const g = await startGame({ port: 9741, name: "bedtime-story" });
const { page, errors } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);

// Beat 20 as the party's endings start it, with the queue cleared; tap through it to its "Now" card.
const started = await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = [];
  n.cur = null;
  window.SSQ.engine().tvStory();
  return !!window.SSQ.beat("ch1-bedtime-story");
});
g.check("the bedtime story beat is registered (ch1-bedtime-story)", started);
const tvDone = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  for (let i = 0; i < 400; i++) {
    ss.tick(0.05);
    const c = n.cur;
    if (c && c.k === "card" && c.text === "Now") return true;
    c && ["card", "cutaway", "bub", "panel"].includes(c.k) && ((n.bt = 1), ss.opTap());
  }
  return false;
});
g.check("the TV story plays to its Now card first", tvDone);

// From the Now card on: tap it, then play. Wordless parts are timed with no tap; every picture and line is held
// 6 seconds with no tap (it must still be up), then tapped.
const run = !(started && tvDone)
  ? { steps: [], wordless: [], pics: [], held: [], line: null, shownBefore: [], newWords: [], sleepFor: 0, room: [], debug: null }
  : await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bedtime-story"),
    out = { steps: [], wordless: [], pics: [], held: [], line: null, shownBefore: [], newWords: [], lastPose: "", sleepFor: 0, day2: false, scene: "", poses: [], mops: [], room: [], debug: null };
  (n.bt = 1), ss.opTap();
  out.shownBefore = ss.shown();
  let t = 0,
    since = 0,
    phase = "",
    firstPic = false;
  const note = (s) => out.steps[out.steps.length - 1] !== s && out.steps.push(s);
  for (let i = 0; i < 4000 && !n.ch1Day2; i++) {
    const c = n.cur;
    const d = beat.debug();
    if (d.phase && d.phase !== phase) {
      phase && !firstPic && out.wordless.push({ phase, secs: +since.toFixed(2) });
      since = 0;
      phase = d.phase;
      note("phase:" + phase);
    }
    if (c && c.k === "cutaway") {
      if (!firstPic) {
        firstPic = true;
        out.newWords = ss.shown().filter((w) => !out.shownBefore.includes(w));
        out.wordless.push({ phase, secs: +since.toFixed(2) });
      }
      ss.drawFrame();
      const drew = window.SSQ.cutaway.last();
      note("pic:" + (drew && drew.pic));
      out.pics.push({ id: c.id, panel: c.panel, drew });
      for (let k = 0; k < 120; k++) ss.tick(0.05);
      out.held.push(!!n.cur && n.cur === c);
      (n.bt = 1), ss.opTap();
      since = 0;
      continue;
    }
    if (c && c.k === "bub") {
      note("bub:" + c.b.who);
      out.line = { who: c.b.who, text: c.b.text };
      for (let k = 0; k < 120; k++) ss.tick(0.05);
      out.held.push(!!n.cur && n.cur === c);
      out.mops.push({ x: n.mo.x, y: n.mo.y, f: n.mo.f, pose: n.moPose });
      (n.bt = 1), ss.opTap();
      since = 0;
      continue;
    }
    if (c && ["card", "panel", "fb", "wait"].includes(c.k)) {
      note(c.k + ":" + (c.id || c.text || ""));
      (n.bt = 1), ss.opTap();
      continue;
    }
    ss.tick(0.05);
    t += 0.05;
    since += 0.05;
    if (i % 4 === 0 && !(n.cur && n.cur.k === "cutaway")) {
      ss.drawFrame();
      const r = beat.debug().drew;
      r && out.room.push({ phase, ...r });
    }
    out.poses.push(n.sqPose);
    if (phase === "asleep") out.sleepFor += 0.05;
  }
  out.day2 = !!n.ch1Day2;
  out.scene = n.scene;
  out.lastPose = out.poses.filter((p) => p).slice(-1)[0] || "";
  out.debug = beat.debug();
  out.shownAfter = ss.shown();
  return out;
});

const order = run.steps.filter((s) => !s.startsWith("phase:end"));
const want = ["phase:walk", "phase:pat", "phase:bed", "phase:story", "pic:crate", "pic:baby", "pic:beard", "pic:baa", "phase:line", "bub:mops", "phase:asleep"];
g.check("the bedtime story plays in order: walk to bed, pat, into bed (Mops comes), crate, baby, beard, ...Baaa?, Mops's line, asleep", JSON.stringify(order) === JSON.stringify(want), order);
g.check("the ask is wordless: no new words are drawn from the Now card to the first picture", run.newWords.length === 0, run.newWords);
const wl = run.wordless.filter((w) => ["walk", "pat", "bed"].includes(w.phase));
// (the "story" part is the instant the first picture comes up)
g.check("each wordless part plays by itself for 2 to 4 seconds (no tap)", wl.length === 3 && wl.every((w) => w.secs >= 2 && w.secs <= 4), run.wordless);
const pats = run.room.filter((r) => r.phase === "pat");
g.check("he pats his crate bed: his paw reaches the bed while he stands beside it", pats.some((r) => r.squatch && r.squatch.paw && r.squatch.paw.x <= 300 && r.squatch.paw.x >= 230), pats.slice(0, 3));
const thought = run.room.filter((r) => r.thought);
g.check("a thought bubble with a little Moon Pie crate in it shows over him while he asks", thought.length > 0 && thought.every((r) => r.thought.crate && r.thought.box.y1 < r.thought.head.y), thought.slice(0, 2));
g.check("Mops comes over and stays beside the bed (facing him) for the story", run.debug && run.debug.mopsAt && run.debug.mopsAt.x < 420 && run.debug.mopsAt.f === -1, run.debug && run.debug.mopsAt);
g.check("Mops's hooves sound only while he walks (footfalls.js)", run.debug && run.debug.hooves.length > 0 && run.debug.hooves.every((h) => h.moved), run.debug && run.debug.hooves);

// The pictures
const pics = run.pics.map((p) => p.drew || {});
g.check("every story picture is the full-screen cutaway of the crate story", run.pics.length === 4 && run.pics.every((p) => p.id === "moonpie" && p.drew && p.drew.full), run.pics.map((p) => p.id));
g.check("every picture and line waits for NEXT (still up after 6 seconds with no tap)", run.held.length === 5 && run.held.every(Boolean), run.held);
const shown = new Set(run.shownAfter || []);
const joined = [...shown].join(" ");
const onScreen = (t) => shown.has(t) || joined.includes(t);
g.check("the captions show word for word as commit 71ec66e had them", ["crate", "baby", "beard"].every((k) => onScreen(OLD[k])) && pics.find((p) => p.pic === "baa") && pics.find((p) => p.pic === "baa").bubble, ["crate", "baby", "beard"].filter((k) => !onScreen(OLD[k])));
g.check("...Baaa? is a bubble over Mops in its own picture, with no caption under it", onScreen(OLD.baa) && pics.find((p) => p.pic === "baa" && p.bubble && !p.caption && p.bubble.y1 < p.mopsHead.y + 10), pics.find((p) => p.pic === "baa"));
g.check("the lines file holds the old words, word for word", L["cap-crate"] && L["cap-crate"].text === OLD.crate && L["cap-baby"].text === OLD.baby && L["cap-beard"].text === OLD.beard && L["mops-baa"].text === OLD.baa && L["mops-moon-pie"].text === MOPS_LINE);
g.check("the old words are 'restored from 71ec66e, needs-yes'; Mops's line is 'in-game, needs-yes'", ["cap-crate", "cap-baby", "cap-beard", "mops-baa"].every((id) => L[id] && L[id].status === "restored from 71ec66e, needs-yes") && L["mops-moon-pie"] && L["mops-moon-pie"].status === "in-game, needs-yes");
const known = new Set(BEDTIME_STORY_LINES.map((l) => l.text));
const fromStory = (run.shownAfter || []).filter((w) => !run.shownBefore.includes(w));
// A caption or bubble wrapped on a phone is drawn a line at a time: a drawn piece counts when it is a whole line of
// the lines file, or a run of two or more whole words of one, from its start or to its end. (The TV story's last
// card, "Now", and the bubble's name tag "Mops" come from before this beat.)
const before = new Set(["Now", "Mops"]);
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const piece = (w) => w.trim().split(/\s+/).length >= 2 && [...known].some((k) => new RegExp("(^" + esc(w) + "(\\s|$))|((^|\\s)" + esc(w) + "$)").test(k));
const stray = fromStory.filter((w) => !(known.has(w) || before.has(w) || piece(w)));
g.check("no other new words show in the bedtime story (every word drawn is in the lines file)", stray.length === 0, stray);
g.check("the bucket picture is off behind its one switch", BEDTIME_SWITCHES.bucketPicture === false && !pics.some((p) => p.pic === "bucket") && !onScreen(OLD.bucket) && !onScreen(OLD.nothing));
g.check("only Mops and baby Squatch are in the pictures (no parents, nobody else)", pics.length === 4 && pics.every((p) => Array.isArray(p.cast) && p.cast.every((c) => c === "mops" || c === "baby")) && pics.some((p) => p.cast.includes("baby")), pics.map((p) => p.cast));
// Sizes (Brian: "Look at how small mops and squatch are versus box."): the crate and Mops in the room's own
// proportion (the crate bed in the locked home room and Mops as the room draws him), the same in every picture.
const sz = pics.filter((p) => p.sizes).map((p) => p.sizes);
g.check("Mops and the crate are the same size in every picture", sz.length === 4 && sz.every((s) => s.mops === sz[0].mops && s.crate.h === sz[0].crate.h), sz);
const room = run.debug && run.debug.roomSizes;
const ratio = sz[0] ? sz[0].mops / sz[0].crate.h : 0,
  roomRatio = room ? room.mops / room.crate.h : 0;
g.check("Mops is as tall against the crate as in the home room (within 5%), and no smaller than the crate's front", ratio > 0 && Math.abs(ratio / roomRatio - 1) < 0.05 && sz[0].mops >= sz[0].crate.h * 0.9, { ratio, roomRatio, story: sz[0], room });
g.check("Mops is drawn big: at least 160 px tall on the 640-tall picture (a grown-up in the TV story is 174)", sz[0] && sz[0].mops >= 160, sz[0]);
g.check("baby Squatch is a baby: a third to three fifths of Mops's height, and smaller than the crate", sz[0] && sz[0].baby >= sz[0].mops / 3 && sz[0].baby <= (sz[0].mops * 3) / 5 && sz[0].baby < sz[0].crate.h, sz[0]);

// Mops's line, then sleep, then Day 2
g.check("Mops says his bedtime line, as it was, in one bubble over him", run.line && run.line.who === "mops" && run.line.text === MOPS_LINE, run.line);
g.check("Squatch ends asleep (the sleep pose) before Day 2", run.debug && run.debug.lastPoseBeforeDay2 === "sleep", run.debug && run.debug.lastPoseBeforeDay2);
g.check("falling asleep plays by itself for 2 to 4 seconds, with a gentle snore", run.sleepFor >= 2 && run.sleepFor <= 4.2 && run.debug && run.debug.snores > 0, { secs: run.sleepFor, snores: run.debug && run.debug.snores });
g.check("then Day 2 begins as before (the gift morning, scene QB)", run.day2 && run.scene === "QB", { day2: run.day2, scene: run.scene });

// The old panel is gone
const GAME = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
const HTML = readFileSync(join(root, "index.html"), "utf8");
g.check('the old "ch1moon" panel and drawCh1Moon are gone from src/game and the build', !/ch1moon|drawCh1Moon/.test(GAME) && !/ch1moon|drawCh1Moon/.test(HTML));
g.check("no page errors", errors.length === 0, errors);
await page.close();
await g.finish("bedtime-story");
