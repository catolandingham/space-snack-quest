/**
 * The morning song (src/modules/morning.js; Brian's answers of 2026-11-23), with sound on:
 * - the action button reads SING ALONG; they sing where they stand, facing each other (no walk to the door),
 * - Squatch's line, then Mops's answer in the old words, Squatch in the singing pose, Mops never rocking,
 * - the song bubbles stay off both faces, and the sing-along chip is still the goal while they sing,
 * - Brian's recording plays from the speaker and dips under each sung line (instead of "singing or music,
 *   never both"); Joe's theme stays off and the made-up tune does not play,
 * - then the goodbye, Mops walks out, home alone with the homework, "That evening…", and only then the peek goal.
 * The floor arrows are gone (scene 1 review, 2026-11-14).
 *   node tests/opening-song.mjs
 */
import { readFileSync } from "node:fs";
import { startGame, sleep, toMorningSong } from "./game-page.mjs";

const g = await startGame({ port: 8844, name: "opening-song" });
const { ctx, page, errors } = await g.open("?ch=1");
// Sound is off until the player taps the speaker (2026-11-23): turn it on, as a player would.
await page.click("#ss-sound");
await toMorningSong(page);
// Let the recording load and start (it was started by the Dog Zylan tap).
for (let i = 0; i < 40 && !(await page.evaluate(() => window.SSQ.homeMusic.debug().playing)); i++) await sleep(200);

const song = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const at = { sq: [n.sq.x, n.sq.y], mo: [n.mo.x, n.mo.y] };
  const offer = ss.offerNow();
  offer.f();
  const lines = [];
  const music = [];
  const faces = [];
  let chipDuring = "",
    pose = "",
    moved = 0,
    sway = false,
    facing = true;
  for (let i = 0; i < 12; i++) {
    const c = n.cur;
    if (n.moPose === "sway") sway = true;
    if (c && c.k === "bub") {
      if (!lines.includes(c.b.text)) lines.push(c.b.text);
      ss.tick(0.3);
      const m = window.SSQ.homeMusic.debug();
      music.push({ text: c.b.text, song: c.b.style === "song", target: m.target, playing: m.playing, warm: ss.music === "warm" });
      if (c.b.style === "song") {
        if (!chipDuring) ((chipDuring = n.ch1Chip), (pose = n.sqPose));
        facing = facing && Math.sign(n.mo.x - n.sq.x) === n.sq.f && Math.sign(n.sq.x - n.mo.x) === n.mo.f;
      }
      moved = Math.max(moved, Math.hypot(n.sq.x - at.sq[0], n.sq.y - at.sq[1]), Math.hypot(n.mo.x - at.mo[0], n.mo.y - at.mo[1]));
      ss.drawFrame();
      const b = ss.lastBubble;
      if (b && b.head) {
        const top = b.y - 16;
        const hit = b.x < b.head.x + b.head.w && b.x + b.w > b.head.x && top < b.head.y + b.head.h && top + b.h + 16 > b.head.y;
        faces.push({ who: b.who, hit });
      }
      if (/Stay in here/.test(c.b.text)) break;
    }
    n.bt = 1;
    ss.opTap();
    ss.tick(0.05);
  }
  n.bt = 1;
  ss.opTap();
  let left = false;
  for (let i = 0; i < 200 && n.moPose !== "hidden"; i++) ss.tick(0.05);
  left = n.moPose === "hidden";
  // Home alone (src/modules/home-alone.js): the homework at the desk comes before "That evening…".
  const homeChip = ss.chipNow();
  const hw = (ss.spotsNow() || []).find((x) => x.id === "homework");
  hw && hw.f();
  let evening = false,
    chipOnCard = "";
  for (let i = 0; i < 60 && !n.ctrl; i++) {
    if (n.cur && n.cur.k === "card" && /^That evening/.test(n.cur.text || "")) ((evening = true), (chipOnCard = n.ch1Chip));
    n.bt = 1;
    ss.opTap();
    ss.tick(0.1);
  }
  return { verb: offer && offer.verb, lines, music, faces, chipDuring, pose, moved, sway, facing, left, homeChip, homework: !!hw, evening, chipOnCard, ctrl: n.ctrl, chipAfter: n.ch1Chip };
});
g.check("SING ALONG is the action", song.verb === "SING ALONG", song.verb);
g.check("they sing where they stand: nobody walks for the song", song.moved < 1, song.moved);
g.check("Squatch sings first, Mops answers with the old line", song.lines[0] === "♪ I'm floating in space! ♪" && song.lines[1] === "♪ Weeee-eenn-nnttt! ♪", song.lines);
g.check("then the goodbye: I have to go to work now. / Stay in here.", song.lines[2] === "I have to go to work now." && song.lines[3] === "Stay in here.", song.lines);
g.check("Mops and Squatch face each other while they sing", song.facing, song);
g.check("Mops never rocks", !song.sway);
g.check("he is in the singing pose for his line", song.pose === "sing", song.pose);
g.check("the sing-along chip is still the goal while he is singing", song.chipDuring === "Squatch: sing along with Mops", song.chipDuring);
g.check("song bubbles stay off both faces", song.faces.length >= 2 && song.faces.every((f) => !f.hit), song.faces);
const sung = song.music.filter((m) => m.song),
  said = song.music.filter((m) => !m.song);
g.check("the recording plays and dips under each sung line", sung.length === 2 && sung.every((m) => m.playing && m.target < 0.5), sung);
g.check("and is back up for the spoken goodbye", said.length >= 1 && said.every((m) => m.playing && m.target >= 0.39), said);
g.check("Joe's theme stays off during the morning song", song.music.every((m) => !m.warm), song.music);
g.check("Mops walks out after the goodbye", song.left, song);
g.check("once Mops is gone Squatch is home alone with his homework to do", song.homeChip === "Squatch: do your homework" && song.homework, song);
g.check('the "That evening…" card comes after the homework', song.evening, song);
g.check("the peek goal waits until the card is gone and control is back", song.chipOnCard !== "Squatch: peek out the door" && song.ctrl && song.chipAfter === "Squatch: peek out the door", song);
g.check("the floor arrows are gone (scene 1 review)", !/function drawWalkNudge/.test(readFileSync(new URL("../src/game/12-ch1-redesign.js", import.meta.url), "utf8")));
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("opening-song");
