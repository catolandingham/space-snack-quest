/**
 * Beat 21, the bedtime story (why Moon Pies), rebuilt as a module (src/modules/bedtime-story.js) in place of the
 * caption box the game showed before ("ch1moon"). After the TV story's "Now" card:
 *   1. with no words and no tap, Squatch walks to his crate bed and climbs in, and Mops comes over beside it (each
 *      wordless part plays 2 to 4 seconds); then Squatch asks, in one bubble over him, "Tell me about when we first
 *      met?" (Brian, 2026-11-26, video note 0:12), waiting for NEXT;
 *   2. full-screen story pictures, each waiting for NEXT: the crate, the baby, the beard, Mops's
 *      "...Weeee-eenn-nnttt?" (Brian, video note 0:28: "Goats say "weeeent" not baaaah"); the captions word for word
 *      from commit 71ec66e; only Mops and baby Squatch in them, at the room's sizes;
 *   3. Mops's bedtime line, as it was, in one bubble over Mops, waiting for NEXT; then (Brian, 2026-11-26) a full-screen
 *      picture of Squatch's crayon drawing of the Guardians with Mops's Guardians line (approved) over him;
 *   4. falling asleep, every part wordless and 2 to 4 seconds (Brian: "a bit more natural transition and then some
 *      snoring"): a yawn and stretch, he lies down, Mops tucks him in with a blanket, Mops walks to the door, the
 *      light goes down to a night-blue dim and Mops goes out, three snores (each heard, each with a rising "z z z"),
 *      the fade to black; then Day 2 begins and the room comes up from black (the home morning's night does it when
 *      the home morning is here; otherwise the bedtime story fades it in).
 * No goal chip shows at any point from the Now card to Day 2 (the old video showed "Squatch: pick up the gift" over
 * the sleeping room). The old fourth picture (the mop bucket) is on (Brian 2026-11-26), and Mops's bleat is asked for
 * under his goat sound. The old "ch1moon" panel is gone.
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
  weent: "...Weeee-eenn-nnttt?", // the old picture had "...Baaa?" (Brian 2026-11-26: goats say "weeeent")
  bucket: "Tourists were coming! Mops hid him in the mop bucket.",
  nothing: "Nothing to see here!",
};
const MOPS_LINE = "You came to me in a Moon Pie crate. You've loved Moon Pies ever since.";
const ASK = "Tell me about when we first met?";
const linesFile = join(root, "src", "modules", "bedtime-story-lines.js");
const { BEDTIME_STORY_LINES = [], BEDTIME_SWITCHES = {} } = existsSync(linesFile) ? await import(linesFile) : {};
const L = Object.fromEntries(BEDTIME_STORY_LINES.map((l) => [l.id, l]));

const g = await startGame({ port: 9741, name: "bedtime-story" });
const { page, errors } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);
// Sound on (the music and the bleat are heard): the sound button, as a player taps it.
await new Promise((r) => setTimeout(r, 1200));
await page.click("#ss-sound");
await new Promise((r) => setTimeout(r, 600));
const soundOn = await page.evaluate(() => !!window.SSQ.engine() && window.SSQ.engine().soundState() === "on");

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
// 6 seconds with no tap (it must still be up), then tapped. Every few frames the room is drawn and the page's goal
// chip is read (it must never show before Day 2).
const run = !(started && tvDone)
  ? { steps: [], wordless: [], pics: [], held: [], lines: [], askAt: null, shownBefore: [], newWords: [], room: [], chips: [], fadeIn: [], debug: null, music: [], picMusic: [], bleats: [] }
  : await page.evaluate(() => {
      const ss = window.__ss,
        n = ss.op,
        beat = window.SSQ.beat("ch1-bedtime-story"),
        out = { steps: [], wordless: [], pics: [], held: [], lines: [], askAt: null, shownBefore: [], newWords: [], day2: false, scene: "", room: [], chips: [], fadeIn: [], debug: null, music: [], picMusic: [], bleats: [] };
      const picksBefore = window.SSQ.soundPicksPlayed().length;
      let mark = picksBefore;
      const chip = () => {
        const el = document.getElementById("ss-chip");
        return el && el.style.display !== "none" ? el.textContent : "";
      };
      (n.bt = 1), ss.opTap();
      out.shownBefore = ss.shown();
      let since = 0,
        phase = "";
      const note = (s) => out.steps[out.steps.length - 1] !== s && out.steps.push(s);
      const wordless = ["walk", "bed", "yawn", "lie", "tuck", "door", "lights", "snore1", "snore2", "snore3", "fade"];
      for (let i = 0; i < 6000 && !n.ch1Day2; i++) {
        const c = n.cur;
        const d = beat.debug();
        if (d.phase && d.phase !== phase) {
          wordless.includes(phase) && out.wordless.push({ phase, secs: +since.toFixed(2) });
          since = 0;
          phase = d.phase;
          note("phase:" + phase);
        }
        if (c && c.k === "cutaway") {
          ss.drawFrame();
          const drew = window.SSQ.cutaway.last();
          note("pic:" + (drew && drew.pic));
          out.pics.push({ id: c.id, panel: c.panel, drew });
          for (let k = 0; k < 120; k++) ss.tick(0.05);
          out.picMusic.push({ pic: drew && drew.pic, cue: window.SSQ.musicNow().cue });
          // (the sounds asked for from the tap that brought this picture up until it is tapped away)
          out.bleats.push({ pic: drew && drew.pic, picks: window.SSQ.soundPicksPlayed().slice(mark).map((p) => p.name) });
          mark = window.SSQ.soundPicksPlayed().length;
          out.held.push(!!n.cur && n.cur === c);
          (n.bt = 1), ss.opTap();
          since = 0;
          continue;
        }
        if (c && c.k === "bub") {
          note("bub:" + c.b.who);
          if (c.b.who === "sq" && !out.askAt) {
            out.newWords = ss.shown().filter((w) => !out.shownBefore.includes(w));
            out.askAt = { pose: n.sqPose, sq: { x: n.sq.x, y: n.sq.y }, mops: { x: Math.round(n.mo.x), y: Math.round(n.mo.y), f: n.mo.f, pose: n.moPose } };
          }
          out.lines.push({ who: c.b.who, text: c.b.text });
          mark = window.SSQ.soundPicksPlayed().length;
          ss.drawFrame();
          out.chips.push({ phase: "bubble " + c.b.who, chip: chip() });
          for (let k = 0; k < 120; k++) ss.tick(0.05);
          out.held.push(!!n.cur && n.cur === c);
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
        since += 0.05;
        // (the tick that ends the fade starts Day 2: from there on it is the morning's chip, not the bedtime's)
        if (n.ch1Day2) break;
        if (i % 2 === 0) {
          ss.drawFrame();
          const r = beat.debug().drew;
          r && out.room.push({ phase, t: +since.toFixed(2), ...r });
          out.chips.push({ phase, chip: chip() });
          out.music.push({ phase, cue: window.SSQ.musicNow().cue, warm: ss.warmCue });
        }
      }
      wordless.includes(phase) && out.wordless.push({ phase, secs: +since.toFixed(2) });
      out.day2 = !!n.ch1Day2;
      out.scene = n.scene;
      out.debug = beat.debug();
      // Day 2's first moments: the room comes up from black.
      // (with the home morning here, its night does it: it starts dark and comes up)
      const hm = window.SSQ.beat("ch1-home-morning");
      // (the words before it comes up are the morning's own: the bedtime story's words end at the fade)
      out.shownAtDay2 = ss.shown();
      for (let k = 0; k < 90; k++) {
        // (the morning's first line in the dark, the PA calling Mops to work, waits for NEXT: tap it)
        n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap());
        ss.drawFrame();
        const r = beat.debug().drew,
          m = hm && hm.debug().drew;
        out.fadeIn.push(Math.max(r && r.fadeIn ? r.black : 0, m && m.dark != null ? m.dark : 0));
        out.ownFadeIn = (out.ownFadeIn || 0) + (r && r.fadeIn ? 1 : 0);
        out.morningHere = !!hm;
        ss.tick(0.05);
      }
      out.shownAfter = ss.shown();
      // the bedtime music is over once the story is (Day 2 has begun)
      out.showingAfter = beat.showing();
      out.cueAfter = window.SSQ.refinedCue("home");
      out.picksAll = window.SSQ.soundPicksPlayed().slice(picksBefore).map((p) => p.name);
      return out;
    });

const order = run.steps.filter((s) => !s.startsWith("phase:end"));
const want = ["phase:walk", "phase:bed", "phase:ask", "bub:sq", "phase:story", "pic:crate", "pic:baby", "pic:beard", "pic:weent", "pic:bucket", "pic:hide", "phase:line", "bub:mops", "phase:guardians", "pic:guardians", "phase:yawn", "phase:lie", "phase:tuck", "phase:door", "phase:lights", "phase:snore1", "phase:snore2", "phase:snore3", "phase:fade"];
g.check("the bedtime story plays in order: to bed (Mops comes), the ask, crate, baby, beard, ...Weeee-eenn-nnttt?, the mop bucket (two pictures), Mops's line, the Guardians picture, yawn, lie down, tuck in, Mops to the door, lights down, three snores, fade", JSON.stringify(order) === JSON.stringify(want), order);
g.check("no words show from the Now card until Squatch asks", run.newWords.filter((w) => w !== ASK && w !== "Squatch").length === 0, run.newWords);
const wl = run.wordless;
g.check("each wordless part (to bed, into bed, yawn, lie down, tuck in, to the door, lights, each snore, the fade) plays by itself for 2 to 4 seconds", wl.length === 11 && wl.every((w) => w.secs >= 2 && w.secs <= 4.05), wl);
const hop = run.room.filter((r) => r.phase === "bed" && r.squatch);
g.check("he climbs into bed: drawn going from beside the bed to where the room draws him sitting", hop.length > 0 && hop[0].squatch.x > 300 && hop.some((r) => r.squatch.x < 215), hop.slice(0, 2));
g.check("Mops comes over and stays beside the bed (facing him) for the story", run.debug && run.debug.mopsAt && run.debug.mopsAt.x < 420 && run.debug.mopsAt.f === -1, run.debug && run.debug.mopsAt);

// The ask
const ask = run.lines.find((l) => l.who === "sq");
g.check('Squatch asks in one bubble over him: "Tell me about when we first met?"', ask && ask.text === ASK && run.lines.filter((l) => l.who === "sq").length === 1, run.lines);
g.check("he asks sitting in his bed, with Mops beside the bed", run.askAt && run.askAt.pose === "sit" && run.askAt.mops.x < 420 && run.askAt.mops.pose === "stand", run.askAt);
g.check("the ask's words are in the lines file, approved word for word (Brian 2026-11-26)", L["sq-first-met"] && L["sq-first-met"].text === ASK && L["sq-first-met"].who === "sq" && L["sq-first-met"].status === "approved");
g.check("the wordless pat and the thought bubble are gone (no pat sound, no thought drawn)", run.debug && !("pat" in run.debug.sounds) && run.room.every((r) => !r.thought), run.debug && run.debug.sounds);

// The pictures
const story = run.pics.filter((p) => p.id === "moonpie"),
  pics = story.map((p) => p.drew || {});
g.check("the six story pictures are the full-screen cutaway of the crate story, then one Guardians picture", story.length === 6 && story.every((p) => p.drew && p.drew.full) && run.pics.length === 7 && run.pics[6].id === "guardians", run.pics.map((p) => p.id));
g.check("every picture and line waits for NEXT (still up after 6 seconds with no tap)", run.held.length === 9 && run.held.every(Boolean), run.held);
const shown = new Set(run.shownAtDay2 || run.shownAfter || []);
const joined = [...shown].join(" ");
const onScreen = (t) => shown.has(t) || joined.includes(t);
g.check("the captions show word for word as commit 71ec66e had them", ["crate", "baby", "beard", "bucket", "nothing"].every((k) => onScreen(OLD[k])), ["crate", "baby", "beard", "bucket", "nothing"].filter((k) => !onScreen(OLD[k])));
g.check("Mops's goat sound is ...Weeee-eenn-nnttt? in a bubble over him in its own picture, with no caption under it", onScreen(OLD.weent) && pics.find((p) => p.pic === "weent" && p.bubble && !p.caption && p.bubble.y1 < p.mopsHead.y + 10), pics.find((p) => p.pic === "weent"));
g.check('no "Baaa" anywhere in the bedtime story (on screen or in its lines)', !joined.includes("Baa") && BEDTIME_STORY_LINES.every((l) => !/baa/i.test(l.text)));
g.check("the lines file holds the old captions word for word, the goat sound and Mops's line", L["cap-crate"] && L["cap-crate"].text === OLD.crate && L["cap-baby"].text === OLD.baby && L["cap-beard"].text === OLD.beard && L["mops-weent"] && L["mops-weent"].text === OLD.weent && L["mops-moon-pie"].text === MOPS_LINE);
g.check("the old crate story's words are approved (Brian 2026-11-26: keep them); the goat sound is Brian's; Mops's line is 'in-game, needs-yes'", ["cap-crate", "cap-baby", "cap-beard", "cap-bucket", "mops-nothing", "sign-moon-pies"].every((id) => L[id] && L[id].status === "approved") && L["mops-weent"].status.startsWith("Brian 2026-11-26") && L["mops-moon-pie"] && L["mops-moon-pie"].status === "in-game, needs-yes");
const known = new Set(BEDTIME_STORY_LINES.map((l) => l.text));
const fromStory = (run.shownAtDay2 || run.shownAfter || []).filter((w) => !run.shownBefore.includes(w));
// A caption or bubble wrapped on a phone is drawn a line at a time: a drawn piece counts when it is a whole line of
// the lines file, or a run of whole words of one (a wrapped bubble's middle line is a run from neither end). (The
// TV story's last card, "Now", and the bubbles' name tags come from before this beat.)
const before = new Set(["Now", "Mops", "Squatch"]);
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const piece = (w) => !!w.trim() && [...known].some((k) => new RegExp("(^|\\s)" + esc(w.trim()) + "(\\s|$)").test(k));
const stray = fromStory.filter((w) => !(known.has(w) || before.has(w) || piece(w)));
g.check("no other new words show in the bedtime story (every word drawn is in the lines file)", stray.length === 0, stray);
g.check("the fourth picture is on (Brian 2026-11-26): Mops hides the baby in his mop bucket, then \"Nothing to see here!\" in a bubble over him", BEDTIME_SWITCHES.bucketPicture === true && pics.some((p) => p.pic === "bucket" && p.caption) && pics.some((p) => p.pic === "hide" && p.bubble && !p.caption) && onScreen(OLD.bucket) && onScreen(OLD.nothing));
g.check("Mops's bleat is asked for once, as his \"...Weeee-eenn-nnttt?\" comes up (the mops-bleat sound hook)", run.debug && run.debug.sounds.bleat === 1, run.debug && run.debug.sounds);
// The bleat plays (window.SSQ.playSoundPick, the same player as the morning song's bleat), and nothing else does.
g.check("sound is on for this run (the sound button)", soundOn);
const weentPick = run.bleats.find((b) => b.pic === "weent");
g.check("the goat bleat plays as \"...Weeee-eenn-nnttt?\" comes up: sounds/goat-bleat.mp3 is asked for there through window.SSQ.playSoundPick", !!weentPick && JSON.stringify(weentPick.picks) === '["mops-bleat"]', run.bleats);
g.check("no other picture or part of the bedtime story plays a bleat (one in the whole story)", JSON.stringify(run.picksAll) === '["mops-bleat"]' && run.bleats.filter((b) => b.picks.length).length === 1, { all: run.picksAll, bleats: run.bleats });
await new Promise((r) => setTimeout(r, 1500));
const startedBleat = await page.evaluate(() => window.SSQ.soundPicksPlayed().filter((p) => p.name === "mops-bleat" && p.started).length);
g.check("the bleat clip loaded and started (its sound reached the effects level)", startedBleat >= 1, startedBleat);
// One player for the bleat (music-picks.js playSound): the bedtime story reaches it through window.SSQ.playSoundPick,
// the morning song's line and Goating in Space call it directly; no other module asks for the bleat.
const MODS = Object.fromEntries(readdirSync(join(root, "src", "modules")).filter((f) => f.endsWith(".js")).map((f) => [f, readFileSync(join(root, "src", "modules", f), "utf8")]));
const askers = Object.keys(MODS).filter((f) => /"mops-bleat"/.test(MODS[f])).sort();
g.check("the bleat is asked for only by the bedtime story, the morning song's bleat line and Goating in Space's gaps (and named in the music table)", JSON.stringify(askers) === JSON.stringify(["bedtime-story-sound.js", "home-music.js", "morning-sound.js", "music-picks.js"]), askers);
g.check("window.SSQ.playSoundPick plays through music-picks.js playSound (no second sound system)", /playSoundPick\(name\)[\s\S]{0,200}playSound\(b\.ctx, b\.fx, name/.test(MODS["bridge.js"]));
// The music (Brian's music table, 2026-11-26): bedtime plays Reawakening, nothing hard-coded.
const PICKS = await import(join(root, "src", "modules", "music-picks.js"));
const bedMusic = run.music.filter((m) => m.phase && m.phase !== "end");
g.check("from the walk to bed until the fade, the music follows the \"bedtime\" cue (every frame)", bedMusic.length > 100 && bedMusic.every((m) => m.cue === "bedtime"), bedMusic.filter((m) => m.cue !== "bedtime").slice(0, 5));
g.check("and through every story picture and the Guardians picture", run.picMusic.length === 7 && run.picMusic.every((m) => m.cue === "bedtime"), run.picMusic);
g.check("after the fade the bedtime story is over: not showing, and the home cue is no longer \"bedtime\" from it", run.showingAfter === false && (run.cueAfter === "home" || run.cueAfter === "bedtime"), { showing: run.showingAfter, cue: run.cueAfter });
g.check("the bedtime cue plays Reawakening (music-picks.js), and only it", PICKS.fileFor("bedtime") === "music/reawakening.mp3" && PICKS.listFor("bedtime").length === 1);
g.check("only Mops and baby Squatch are in the pictures (no parents, nobody else)", pics.length === 6 && pics.every((p) => Array.isArray(p.cast) && p.cast.every((c) => c === "mops" || c === "baby")) && pics.some((p) => p.cast.includes("baby")), pics.map((p) => p.cast));
// Sizes (Brian: "Look at how small mops and squatch are versus box."): the crate and Mops in the room's own
// proportion (the crate bed in the locked home room and Mops as the room draws him), the same in every picture.
const sz = pics.filter((p) => p.sizes).map((p) => p.sizes);
g.check("Mops and the crate are the same size in every picture", sz.length === 6 && sz.every((s) => s.mops === sz[0].mops && s.crate.h === sz[0].crate.h), sz);
const room = run.debug && run.debug.roomSizes;
const ratio = sz[0] ? sz[0].mops / sz[0].crate.h : 0,
  roomRatio = room ? room.mops / room.crate.h : 0;
g.check("Mops is as tall against the crate as in the home room (within 5%), and no smaller than the crate's front", ratio > 0 && Math.abs(ratio / roomRatio - 1) < 0.05 && sz[0].mops >= sz[0].crate.h * 0.9, { ratio, roomRatio, story: sz[0], room });
g.check("Mops is drawn big: at least 160 px tall on the 640-tall picture (a grown-up in the TV story is 174)", sz[0] && sz[0].mops >= 160, sz[0]);
g.check("baby Squatch is a baby: a third to three fifths of Mops's height, and smaller than the crate", sz[0] && sz[0].baby >= sz[0].mops / 3 && sz[0].baby <= (sz[0].mops * 3) / 5 && sz[0].baby < sz[0].crate.h, sz[0]);

// Mops's line
const mopsLine = run.lines.find((l) => l.who === "mops");
g.check("Mops says his bedtime line, as it was, in one bubble over him", mopsLine && mopsLine.text === MOPS_LINE, run.lines);

// The Guardians (Brian, 2026-11-26): after Mops's line, the crayon drawing full screen and Mops's Guardians line
const GUARDIANS = "And you've always had your Guardians, watching over you.";
const gp = (run.pics.find((p) => p.id === "guardians") || {}).drew || {};
g.check("then a full-screen picture of Squatch's crayon drawing of the Guardians: two big furry Sasquatches (and little Squatch), filling most of the picture", gp.full && gp.pic === "guardians" && gp.drawing && gp.drawing.figures.guardians === 2 && gp.drawing.x1 - gp.drawing.x0 >= 450, gp);
g.check("Mops says his Guardians line in a bubble over him in that picture (waits for NEXT)", onScreen(GUARDIANS) && gp.bubble && gp.bubble.y1 < gp.mopsHead.y + 10 && gp.bubble.x0 < gp.mopsHead.x && gp.bubble.x1 > gp.mopsHead.x && gp.cast.join() === "mops", gp);
g.check("Mops is drawn there with the room's own drawing, given only his facing (no eyes, mouth or pose options: nothing knowing)", gp.mopsLook === "f,mop,walk", gp.mopsLook);
g.check("the Guardians line is one lines-file entry, approved (Brian 2026-11-26, chat 18b A)", L["mops-guardians"] && L["mops-guardians"].text === GUARDIANS && L["mops-guardians"].who === "mops" && L["mops-guardians"].status === "approved" && L["mops-guardians"].source === "Brian 2026-11-26, chat 18b A");

// Falling asleep
const at = (p) => run.room.filter((r) => r.phase === p);
const yawn = at("yawn");
g.check("he gives a big yawn and stretches: both arms go up and his mouth opens wide, sitting in bed", yawn.some((r) => r.squatch && r.squatch.yawn > 0.8 && Math.abs(r.squatch.arms[0]) > 2.5 && Math.abs(r.squatch.arms[1]) > 2.5 && r.squatch.a === 0), yawn.filter((_, i) => i % 6 === 0).map((r) => r.squatch));
const lieEnd = at("lie").slice(-1)[0];
g.check("he lies down on his side on the mattress and his eyes close", lieEnd && lieEnd.squatch && Math.abs(lieEnd.squatch.a + Math.PI / 2) < 0.02 && lieEnd.squatch.eyes === "closed" && lieEnd.squatch.x === 266 && lieEnd.squatch.y === 386, lieEnd);
const tuck = at("tuck");
g.check("Mops steps in to the bed and pulls a blanket up over him", tuck.some((r) => r.mops.x < 360 && r.blanket && r.blanket.cover > 0 && r.blanket.cover < 1) && tuck.slice(-1)[0].blanket && tuck.slice(-1)[0].blanket.cover === 1, tuck.filter((_, i) => i % 6 === 0).map((r) => ({ mops: r.mops, blanket: r.blanket })));
g.check("then Mops walks to the doorway on the right wall", run.debug && run.debug.door && run.debug.door.x >= 860, run.debug && run.debug.door);
const lights = at("lights");
g.check("at the door the room light goes down to a night-blue dim, and Mops goes out", lights.length > 0 && lights[0].dim < 0.1 && lights.slice(-1)[0].dim >= 0.55 && lights[0].mops.shown && !lights.slice(-1)[0].mops.shown, lights.filter((_, i) => i % 5 === 0).map((r) => ({ dim: r.dim, mops: r.mops })));
const snores = [1, 2, 3].map((k) => run.room.filter((r) => r.zzz && r.zzz.snore === k));
g.check("he snores three times: each snore is heard (three snore sounds)", run.debug && run.debug.sounds.snore === 3, run.debug && run.debug.sounds);
g.check("each snore sends a z z z up over his head: it rises, shows clearly, and is bigger than the last", snores.every((z) => z.length > 3 && z[z.length - 1].zzz.y < z[0].zzz.y - 40 && z.some((r) => r.zzz.a > 0.9)) && snores[1][0].zzz.size > snores[0][0].zzz.size && snores[2][0].zzz.size > snores[1][0].zzz.size, snores.map((z) => z.length && [z[0].zzz, z[z.length - 1].zzz]));
g.check("the room stays night-blue while he snores, lying asleep under the blanket", [1, 2, 3].every((k) => at("snore" + k).every((r) => r.dim >= 0.55 && r.squatch && r.squatch.eyes === "closed" && r.blanket && r.blanket.cover === 1)));
const fade = at("fade");
g.check("then the room fades to black", fade.length > 0 && fade[0].black < 0.1 && fade.slice(-1)[0].black > 0.95);
g.check("a yawn, the blanket's rustle and the light's click are heard once each", run.debug && run.debug.sounds.yawn === 1 && run.debug.sounds.rustle === 1 && run.debug.sounds.click === 1, run.debug && run.debug.sounds);
g.check("Mops's hooves sound only while he walks (footfalls.js)", run.debug && run.debug.hooves.length > 0 && run.debug.hooves.every((h) => h.moved), run.debug && run.debug.hooves);
g.check("Squatch ends asleep, lying down, before Day 2", run.debug && run.debug.lastPoseBeforeDay2 === "asleep, lying down", run.debug && run.debug.lastPoseBeforeDay2);
// No goal while he sleeps (2026-11-26: the old video showed "Squatch: pick up the gift" over the sleeping room).
const chips = run.chips.filter((c) => c.chip);
g.check("no goal chip shows at any point from the Now card until Day 2 begins", run.chips.length > 100 && chips.length === 0, chips.slice(0, 5));
g.check("only one fade in: with the home morning here, the bedtime story does not draw its own", !run.morningHere || !run.ownFadeIn, { morning: run.morningHere, own: run.ownFadeIn });
g.check("then Day 2 begins (the morning, scene QB) and the room fades in from black", run.day2 && run.scene === "QB" && run.fadeIn[0] > 0.8 && run.fadeIn.slice(-1)[0] < 0.01, { day2: run.day2, scene: run.scene, fadeIn: run.fadeIn.filter((_, i) => i % 5 === 0) });

// The old panel is gone
const GAME = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
const HTML = readFileSync(join(root, "index.html"), "utf8");
g.check('the old "ch1moon" panel and drawCh1Moon are gone from src/game and the build', !/ch1moon|drawCh1Moon/.test(GAME) && !/ch1moon|drawCh1Moon/.test(HTML));
g.check("no page errors", errors.length === 0, errors);
await page.close();
await g.finish("bedtime-story");
