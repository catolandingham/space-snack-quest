/**
 * The party's sounds (src/modules/party-sound.js, party-board-sounds.js; the sound plan of 2026-11-24; Brian
 * "34(A)", "35 (A)", question 36): heard, not just asked for.
 *   - Sound off (the default): the party makes no sound at all (no oscillator, no recording), but the band's
 *     notes are still drawn.
 *   - Sound on: the Croc Boys play (oscillators run through the master volume), the band stops dead in each
 *     song's break and its line "Stormtop-vania 1-2-3-4-5!" shows over the band; at home the band is muffled and
 *     Joe's home theme stays off all party night; before the peek the party is heard through his door.
 *   - The Kenney recordings (sounds/, CC0) are in the repo, credited, and decode; the crash plays them.
 *   node tests/party-sound.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const g = await startGame({ port: 9106, name: "party-sound" });
const sound = await import(join(root, "src", "modules", "party-sound.js"));

async function open(beat, on) {
  const o = await g.open("?beat=" + beat, PHONE);
  await o.page.evaluate(() => {
    window.__ps = { osc: 0, bufs: 0 };
    const A = window.AudioContext || window.webkitAudioContext,
      osc = A.prototype.createOscillator,
      src = A.prototype.createBufferSource;
    A.prototype.createOscillator = function () {
      window.__ps.osc++;
      return osc.call(this);
    };
    A.prototype.createBufferSource = function () {
      window.__ps.bufs++;
      return src.call(this);
    };
  });
  on && (await o.page.click("#ss-sound"));
  await sleep(1200);
  return o;
}
const dbg = (page) => page.evaluate(() => ({ ...window.SSQ.beat("ch1-party").now().sound, ps: window.__ps, warm: window.__ss.warmWhy(), on: window.SSQ.engine().soundState() }));

// ---------- the recordings ----------
for (const files of Object.values(sound.RECORDINGS)) for (const f of files) g.check("the recording " + f + " is in the repo", existsSync(join(root, f)));
const credits = existsSync(join(root, "sounds", "CREDITS.txt")) ? readFileSync(join(root, "sounds", "CREDITS.txt"), "utf8") : "";
g.check("the recordings are credited to Kenney, CC0", /Kenney/.test(credits) && /CC0/.test(credits));

// ---------- sound off ----------
{
  const { page, errors } = await open("party:P6", false);
  await sleep(4000);
  const d = await dbg(page);
  g.check("sound off: the party makes no sound (no oscillator, no recording)", d.on !== "on" && d.ps.osc === 0 && d.ps.bufs === 0, d);
  g.check("no errors with sound off", errors.length === 0, errors);
  await page.close();
}

// ---------- sound on ----------
{
  const { page, errors } = await open("party:P6", true);
  let d = await dbg(page);
  // (Brian's band order, 2026-11-26: Funky Chunk, the 2nd of the band's list, until he dances)
  g.check("sound on: the Croc Boys play (Funky Chunk before he dances) through the master volume", d.on === "on" && d.song === 1, d);
  await sleep(2000);
  d = await dbg(page);
  g.check("the band's notes are really made (oscillators run)", d.ps.osc > 20, d.ps);
  // the crowd's recording (Brian 2026-11-26: "crowd 1 with the band on top"): loaded and playing under the band
  g.check("the party's crowd recording (sounds/party-crowd.mp3) plays in the hall, under the band", d.crowd.loaded && d.crowd.playing && !d.crowd.muffled && d.played.includes("crowd-recording:sounds/party-crowd.mp3"), d.crowd);
  // the break: the band stops dead and shouts its line, shown over the band (he waits behind the crowd, out of sight)
  await page.evaluate(() => ((window.__ss.op.sq.x = 150), (window.__ss.op.sq.y = 590)));
  let shout = false;
  for (let i = 0; i < 24 && !shout; i++) {
    shout = await page.evaluate(() => (window.__ss.op.log || []).some((l) => l.k === "live" && l.text === "Stormtop-vania 1-2-3-4-5!"));
    await sleep(500);
  }
  // (Funky Chunk has no words: the band sings out its line only over Stormtop-Sylvania, which plays while he dances)
  g.check("while Funky Chunk plays the band sings out no line (it has no words)", !shout);
  // the recordings decode (the crash and the footsteps play them through the master volume)
  const decoded = await page.evaluate(async (files) => {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    let ok = 0;
    for (const f of files) {
      const b = await fetch(f).then((r) => r.arrayBuffer());
      (await c.decodeAudioData(b)).duration > 0.05 && ok++;
    }
    return ok;
  }, [...sound.RECORDINGS.crash, ...sound.RECORDINGS.step]);
  g.check("every recording decodes in the browser", decoded === sound.RECORDINGS.crash.length + sound.RECORDINGS.step.length, decoded);
  g.check("no errors with sound on", errors.length === 0, errors);
  await page.close();
}
{
  const { page } = await open("party", true);
  const d = await dbg(page);
  g.check("before the peek, at home: the party's crowd is heard through his door (muffled)", d.crowd.want && d.crowd.muffled, d.crowd);
  g.check("and Joe's home theme stays off", d.warm === "", d.warm);
  await page.close();
}
{
  const { page } = await open("party:P5", true);
  await sleep(500);
  const d = await dbg(page);
  g.check("at home in the dress-up: the band plays on, muffled, and Joe's theme stays off", d.song === 1 && d.warm === "", d);
  await page.close();
}

// ---------- Mops's gentle lines never bleat (the bubble sound, #88; party-lines.js `quiet`) ----------
{
  const { page } = await open("party:P8b", true);
  const lines = await import(join(root, "src", "modules", "party-lines.js"));
  const quiet = lines.PARTY_LINES.filter((l) => l.quiet && !l.removed);
  g.check('"You have me." is marked quiet', quiet.some((l) => l.text === "You have me."), quiet.map((l) => l.text));
  // Each bubble opens in a scene of its own, where it is Mops's first line: the meh would play if it were allowed.
  const heard = await page.evaluate(async (texts) => {
    const snd = window.SSQ.morningSound,
      out = {};
    const one = async (text, scene, who = "mops") => {
      const from = snd.debug().log.length;
      window.SSQ.bubbleSound({ who, text, style: "say" }, scene);
      await new Promise((r) => setTimeout(r, 150));
      return snd.debug().log.slice(from).map((e) => e.name);
    };
    let k = 0;
    // (each line is spoken by its own speaker: Squatch's quiet lines are his, and he never bleats)
    for (const [t, who] of texts) out[t] = await one(t, "quiet-test-" + k++, who);
    out.loud = await one("Morning, Squatch.", "quiet-test-loud");
    // a quiet line does not use the scene's meh up
    const mops = texts.find(([, who]) => who === "mops")[0];
    out.after = [await one(mops, "quiet-test-same"), await one("Morning, Squatch.", "quiet-test-same")];
    return out;
  }, quiet.map((l) => [l.text, l.who]));
  g.check("Mops's two new lines before the TV are quiet too", ["I've been waiting to show you this.", "Here's why you have to hide."].every((t) => quiet.some((l) => l.who === "mops" && l.text === t)));
  for (const l of quiet) g.check(`"${l.text}" gets the bubble's soft tick and no meh`, heard[l.text].includes("tick") && !heard[l.text].includes("meh") && !heard[l.text].includes("grumpy"), heard[l.text]);
  g.check("another first line of Mops's in a scene still gets the meh (the check can fail)", heard.loud.includes("tick") && heard.loud.includes("meh"), heard.loud);
  g.check("a quiet line does not use the scene's meh up", !heard.after[0].includes("meh") && heard.after[1].includes("meh"), heard.after);
  await page.close();
}

await g.finish("party-sound");
