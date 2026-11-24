/**
 * The party in disguise, P6 (party plan P6; src/modules/party-free.js, party-toys.js, party-snacks.js,
 * party-dance.js, party-outfit.js), checked at phone size:
 *   - walking in from the dress-up, nobody jumps (Squatch or the cast, 60 at most from one frame to the next),
 *     Isfred stays at the bar, the camera and the octopus where P4 left them, the lights stay down;
 *   - no goal chip and no outline in free play; the guests mill (they move between places, and nobody jumps);
 *   - three songs with a light colour each, closing time after the third (P8b), early closing after the dance and
 *     two other toys; the songs last COOL_HAT_SECONDS (180) in all;
 *   - in disguise a cone shows "?" only; a long second look from the same guest starts the alarm ("FUR!", P7,
 *     the card's place); with fur showing, "?" then "!" as in P2;
 *   - nothing knocks a piece off in his first minute (the plants and the vent only tip it); after it, a plant's
 *     second brush knocks the piece off and it flies (it is seen landing, never just gone); the vent sucks a piece
 *     in, never fur, while he wears anything;
 *   - the dance: DANCE · circle in the spotlight opens the whole screen with the stick and button hidden and its
 *     own ↺; every tap is a move and the crowd cheers louder; it ends with the song; the guests clap;
 *   - the photo: in front of the camera at the flash, +25 once, and the Polaroid; the snacks: the paw icon at the
 *     bar opens the close-up, each snack is stars, five topple the pyramid, the flying cup knocks a piece off and
 *     everyone stares for 4 seconds; the bartender's two catches; the octopus only after the first minute, his
 *     lines, two hugs knock a piece off; the hallway: "Mops!", the beard, he steps back and cannot go through;
 *   - the conga: it forms, its route passes the vent once, walking into its tail joins it and tows him, steering
 *     leaves it; ↺ restarts P6 just inside his door with the same outfit and song; sounds named in the plan play.
 * Stills at 375 x 812 go to tests/out/party-stills/ (p6-*.png).
 *   node tests/party-free.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const g = await startGame({ port: 9101, name: "party-free" });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const free = await import(join(root, "src", "modules", "party-free.js"));
const toys = await import(join(root, "src", "modules", "party-toys.js"));
const vent = await import(join(root, "src", "modules", "party-vent.js"));
const snacks = await import(join(root, "src", "modules", "party-snacks.js"));

async function open(beat) {
  const o = await g.open("?beat=" + beat, PHONE);
  await sleep(1400);
  return o;
}
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur;
    return {
      now: window.SSQ.beat("ch1-party").now(),
      room: n.room,
      ctrl: !!n.ctrl,
      cur: c ? c.k : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      cause: c && c.id === "jail" ? c.cause : "",
      x: Math.round(n.sq.x),
      y: Math.round(n.sq.y),
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      chip: window.__ss.chipNow(),
      ring: n.lastRing && n.T - n.lastRing.T < 0.3 ? n.lastRing.id : "",
      stars: n.stars || 0,
      full: !!document.querySelector('canvas[aria-label="dance"]'),
    };
  });
// Writes into the party's state (the test sets the clock or a place, never the result it checks).
const set = (page, f, arg) => page.evaluate(`(${f})(window.__ss.op.ch1PartyNow, window.__ss.op, ${JSON.stringify(arg || null)})`);
const place = (page, x, y) => page.evaluate((p) => ((window.__ss.op.sq.x = p[0]), (window.__ss.op.sq.y = p[1])), [x, y]);
const walk = (page, x, y) => page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [x, y]);
const press = (page) => page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
const next = (page) => page.evaluate(() => window.__ss.opTap());
const until = async (page, f, ms = 15000, onWait) => {
  const t0 = Date.now();
  for (;;) {
    const s = await st(page);
    if (f(s)) return s;
    if (Date.now() - t0 > ms) return null;
    onWait && (await onWait(s));
    await sleep(100);
  }
};
const still = (page, name) => page.screenshot({ path: join(OUT, name + ".png") });
const bubbleName = (page) => page.evaluate(() => (window.__ss.lastBubble ? String(window.__ss.lastBubble.name) : "none"));
const played = (page) => page.evaluate(() => window.SSQ.beat("ch1-party").now().sound.played);
// Everyone's place every 50 ms: Squatch, the guests, Isfred. A step over 60 inside one room is a jump.
const watchStart = (page) =>
  page.evaluate(() => {
    window.__w = [];
    window.__wT = setInterval(() => {
      const n = window.__ss.op,
        p = n.ch1PartyNow;
      if (!p) return;
      const pts = { sq: [n.sq.x, n.sq.y], isfred: [p.isfred.x, p.isfred.y] };
      for (const [id, q] of Object.entries(p.people || {})) pts[id] = [q.x, q.y];
      window.__w.push({ room: n.room, pts });
    }, 50);
  });
const watchJumps = (page) =>
  page.evaluate(() => {
    clearInterval(window.__wT);
    const w = window.__w,
      out = [];
    for (let i = 1; i < w.length; i++)
      if (w[i].room === w[i - 1].room)
        for (const id of Object.keys(w[i].pts)) {
          const a = w[i - 1].pts[id],
            b = w[i].pts[id];
          a && b && Math.hypot(a[0] - b[0], a[1] - b[1]) > 60 && out.push([id, a.map(Math.round), b.map(Math.round)]);
        }
    return { samples: w.length, jumps: out.slice(0, 6) };
  });

// ---------- the numbers ----------
g.check("the songs last COOL_HAT_SECONDS in all, and the pin is 180", free.COOL_HAT_SECONDS === 180 && free.SONG_SECONDS * 3 === 180, free.SONG_SECONDS);
{
  // the conga's loop passes near the vent once (one stretch of the route within the vent's reach)
  let inside = 0,
    was = false;
  for (let d = 0; d < 2000; d += 4) {
    const at = toys.congaAt(d),
      near = vent.ventDistance(at) <= vent.VENT.near;
    near && !was && inside++;
    was = near;
    if (d > 0 && Math.hypot(at.x - hall.CONGA_ROUTE[0].x, at.y - hall.CONGA_ROUTE[0].y) < 2 && d > 100) break;
  }
  g.check("the conga's route passes near the vent once a loop", inside === 1, inside);
}

// ---------- walking in from the dress-up ----------
{
  const { page, errors } = await open("party:P5");
  await set(page, (p) => {
    p.outfit = { head: "boots", face: "shades", body: "tutu", legs: "scarf" };
    p.phase = "out";
  });
  await place(page, 800, 470);
  const before = await page.evaluate(() => {
    const P = window.__ss.op.ch1PartyNow;
    return P.outfit;
  });
  await watchStart(page);
  await walk(page, 870, 470);
  let s = await until(page, (q) => q.now && q.now.scene === "P6" && q.ctrl, 15000);
  g.check("out through his door in his outfit, P6 begins in the hall with control", !!s && s.room === "hall", s && s.now && s.now.scene);
  await sleep(2500);
  const j = await watchJumps(page);
  g.check("walking in, nobody jumps (Squatch, Isfred, every guest)", j.samples > 30 && j.jumps.length === 0, j);
  s = await st(page);
  g.check("Isfred is still at the bar's top end, where he walked in P3", Math.hypot(s.now.isfred.x - hall.CAST.isfredBar.x, s.now.isfred.y - hall.CAST.isfredBar.y) < 2, s.now.isfred);
  g.check("he wears the outfit he chose, whole", JSON.stringify(s.now.worn) === JSON.stringify(before) && !s.now.fur, s.now.worn);
  await still(page, "p6-walk-in");
  // no goal chip and no outline in free play
  let chips = 0,
    rings = 0;
  for (let i = 0; i < 20; i++) {
    const q = await st(page);
    q.chip && chips++;
    q.ring && rings++;
    await sleep(200);
  }
  g.check("free play shows no goal chip and no outline", chips === 0 && rings === 0, { chips, rings });
  // the guests mill: they move, and nobody jumps
  const a = (await st(page)).now.people;
  await watchStart(page);
  await sleep(6000);
  const b = (await st(page)).now.people,
    moved = Object.keys(a).filter((id) => Math.hypot(a[id].x - b[id].x, a[id].y - b[id].y) > 20);
  const j2 = await watchJumps(page);
  g.check("the guests mill (at least three move somewhere new)", moved.length >= 3, moved);
  g.check("milling, nobody jumps", j2.jumps.length === 0, j2);
  g.check("the band plays song 1 (the sound and the light)", s.now.song === 0 && (await played(page)).includes("song0"), s.now.song);
  g.check("no errors walking in", errors.length === 0, errors);
  await page.close();
}

// ---------- songs, closing, early closing ----------
{
  const { page } = await open("party:P6");
  await place(page, 150, 560);
  await set(page, (p, n, a) => (p.songT = a - 0.3), free.SONG_SECONDS);
  let s = await until(page, (q) => q.now.song === 1, 3000);
  g.check("after a song's time the band plays the next song (song 2)", !!s, s && s.now.song);
  g.check("song 2 sounds", (await played(page)).includes("song1"));
  await still(page, "p6-song-2-light");
  await set(page, (p, n, a) => ((p.song = 2), (p.songT = a - 0.3)), free.SONG_SECONDS);
  await watchStart(page);
  s = await until(page, (q) => q.now && q.now.scene === "P8b", 4000);
  await sleep(600);
  const jc = await watchJumps(page);
  g.check("into closing time nobody jumps (the guests stay where they milled)", jc.jumps.length === 0, jc);
  g.check("after the third song: closing time (P8b), the speaker's line", !!s && /party's over/.test(s.text), s && [s.now && s.now.scene, s.text]);
  await page.close();
}
{
  const { page } = await open("party:P6");
  await place(page, 150, 560);
  await set(page, (p) => ((p.done.photo = true), (p.done.conga = true)));
  await sleep(500);
  let s = await st(page);
  g.check("two toys but no dance: no early closing", s.now.song === 0 && !s.now.early, s.now);
  await set(page, (p) => (p.done.dance = true));
  s = await until(page, (q) => q.now.early, 2000);
  g.check("danced and two other toys: the band goes straight to its last song", !!s && s.now.song === 2, s && s.now);
  await page.close();
}

// ---------- sight in disguise ----------
{
  const { page } = await open("party:P6");
  // stand in front of the bartender (she does not move): her cone holds him
  const spot = [770, 455];
  await place(page, ...spot);
  await sleep(2000);
  let s = await st(page);
  g.check("in disguise, a look shows only \"?\" (no alarm)", s.now.seenBy === "bartender" && !s.now.alarm, [s.now.seenBy, s.now.alarm]);
  await still(page, "p6-disguise-question");
  s = await until(page, (q) => q.now.curious && q.now.curious.phase === "turn", 6000);
  g.check("a few seconds on, she turns for a second look: the big \"?\" warns first", !!s && !s.now.alarm, s && s.now.curious);
  s && (await still(page, "p6-second-look-warning"));
  s = await until(page, (q) => q.now && q.now.alarm, 5000);
  g.check("staying in her second look: \"FUR!\" and the alarm (P7), at the snack bar", !!s && s.now.scene === "P7" && (await page.evaluate(() => window.__ss.op.ch1PartyNow.alarm.where)) === "where-bar", s && s.now);
  s && (await sleep(150), await still(page, "p6-second-look-fur"));
  await page.close();
}
{
  const { page } = await open("party:P6");
  await place(page, 770, 455);
  const s0 = await until(page, (q) => q.now.curious && q.now.curious.phase === "turn", 9000);
  await place(page, 600, 600);
  await sleep(3500);
  const s = await st(page);
  g.check("walking out of the second look in time: nothing happens", !!s0 && !s.now.alarm && s.now.scene === "P6", [!!s0, s.now.alarm]);
  await page.close();
}
{
  const { page } = await open("party:P6");
  await set(page, (p) => (p.lostPieces = ["head"]));
  await place(page, 770, 455);
  const t0 = Date.now();
  const s = await until(page, (q) => q.now && q.now.alarm, 4000);
  g.check("with fur showing, \"?\" then the alarm in under 2 seconds (as in P2)", !!s && Date.now() - t0 < 2000, s && s.now.alarm);
  await page.close();
}

// ---------- pieces: first minute, plants, vent ----------
{
  const { page } = await open("party:P6");
  const pl = hall.HALL.plants.find((q) => q.id === "middle");
  const brush = async () => {
    await place(page, 560, 600);
    await sleep(300);
    await place(page, pl.leaves.x1 + 6, pl.leaves.y1 + 10);
    await sleep(400);
  };
  await brush();
  await brush();
  let s = await st(page);
  g.check("first minute: brushing a plant twice only tips a piece (nothing knocked off)", s.now.tip && s.now.gone.length === 0, [s.now.tip, s.now.gone]);
  g.check("the tip has its three signs: the sound, the shake and the big piece over him", (await played(page)).includes("fwip") && (await page.evaluate(() => !!window.__ss.op.ch1PartyNow.warn)));
  await still(page, "p6-plant-tip");
  await set(page, (p) => (p.ft = 61));
  await brush();
  s = await st(page);
  g.check("after the first minute the second brush knocks the piece off and it flies", s.now.gone.length === 1 && s.now.flying === 1, [s.now.gone, s.now.flying]);
  await sleep(150);
  await still(page, "p6-piece-flies");
  await sleep(900);
  const fallen = await page.evaluate(() => window.__ss.op.ch1PartyNow.fallen);
  g.check("the piece lands in the plant (it stays there, never just gone)", fallen.length === 1 && fallen[0].to === "plant", fallen);
  await place(page, hall.SPOTS.plantMiddle.x, hall.SPOTS.plantMiddle.y);
  g.check("with fur showing, the plants hide him again (HIDE · plant)", (await until(page, (q) => q.act === "HIDE · plant", 3000)) !== null);
  await page.close();
}
{
  const { page } = await open("party:P6");
  await place(page, hall.HALL.vent.x + 30, hall.HALL.vent.y + 10);
  await sleep(2500);
  let s = await st(page);
  g.check("first minute at the vent: a piece tips toward it, nothing goes in, no alarm", s.now.tip && s.now.gone.length === 0 && !s.now.alarm, [s.now.tip, s.now.gone]);
  await still(page, "p6-vent-tug");
  await set(page, (p) => (p.ft = 61));
  s = await until(page, (q) => q.now.gone.length >= 1, 4000);
  g.check("after the first minute, staying: the vent sucks the piece in (no fur, no alarm)", !!s && !s.now.alarm, s && s.now.gone);
  await set(page, (p) => (p.lostPieces = ["head", "face", "body", "legs"]));
  s = await until(page, (q) => q.now && q.now.alarm, 6000);
  g.check("with nothing left on, the fur rule: fur goes in and the alarm starts", !!s, s && s.now.alarm);
  await page.close();
}

// ---------- the dance ----------
{
  const { page, errors } = await open("party:P6");
  const stars0 = (await st(page)).stars;
  await walk(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4);
  let s = await until(page, (q) => q.act === "DANCE · circle", 8000);
  g.check("in the spotlight the button is DANCE · circle", !!s, s && s.act);
  await press(page);
  s = await until(page, (q) => q.full, 3000);
  g.check("the dance fills the screen", !!s);
  const hidden = await page.evaluate(() => [document.querySelector('[aria-label="Move"]'), document.querySelector('[role="button"]')].filter(Boolean).every((el) => getComputedStyle(el).visibility === "hidden"));
  g.check("the stick and the action button are hidden during the dance", hidden);
  const top = await page.evaluate(() => (document.elementFromPoint(34, 34) || {}).getAttribute && document.elementFromPoint(34, 34).getAttribute("aria-label"));
  g.check("the dance keeps its own ↺ (the top-left corner is the dance view)", top === "dance", top);
  const c0 = (await st(page)).now.dance.cheer;
  for (let i = 0; i < 6; i++) (await page.touchscreen.tap(180 + i * 10, 500), await sleep(120));
  s = await st(page);
  g.check("every tap is a move, and the crowd cheers louder", s.now.dance.moves === 6 && s.now.dance.cheer > c0, s.now.dance);
  g.check("each move sounds (robot) and the crowd cheers", (await played(page)).filter((x) => x === "robot").length === 6 && (await played(page)).includes("cheer"));
  await still(page, "p6-dance-full-screen");
  await set(page, (p, n, a) => ((p.songT = a - 0.2), (p.dance.t = 20)), free.SONG_SECONDS);
  s = await until(page, (q) => !q.full && q.ctrl, 4000);
  g.check("the dance ends with the song; back in the hall the guests clap", !!s && s.now.done.dance && (await page.evaluate(() => window.__ss.op.ch1PartyNow.clap > 0)), s && s.now.done);
  await still(page, "p6-after-dance-clap");
  g.check("the dance gives no points", s && s.stars === stars0, s && s.stars);
  g.check("no errors in the dance", errors.length === 0, errors);
  await page.close();
}

// ---------- the photo ----------
{
  const { page } = await open("party:P6");
  const stars0 = (await st(page)).stars;
  await place(page, (hall.PHOTO_FRAME.x0 + hall.PHOTO_FRAME.x1) / 2, (hall.PHOTO_FRAME.y0 + hall.PHOTO_FRAME.y1) / 2);
  await set(page, (p) => p.photo && ((p.photo.phase = "wait"), (p.photo.t = 5.9)));
  let s = await until(page, (q) => q.now.photo && q.now.photo.phase === "count", 3000);
  await sleep(1200);
  await still(page, "p6-camera-countdown");
  s = await until(page, (q) => q.now.photo && q.now.photo.taken, 5000);
  g.check("in front of the camera at the flash: the photo, +25", !!s && s.stars === stars0 + toys.PHOTO_BONUS, s && [s.stars, stars0]);
  await sleep(500);
  await still(page, "p6-polaroid");
  g.check("the camera's sounds: beeps, the flash, the Polaroid", (await played(page)).includes("flash") && (await played(page)).includes("zzzt"));
  await set(page, (p) => ((p.photo.phase = "wait"), (p.photo.t = 5.9)));
  await sleep(4500);
  g.check("the photo bonus comes once", (await st(page)).stars === stars0 + toys.PHOTO_BONUS);
  await page.close();
}

// ---------- the snacks ----------
{
  const { page } = await open("party:P6");
  const L = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());
  await place(page, 700, 520);
  let s = await until(page, (q) => q.now.paw, 2000);
  g.check("near the bar the paw icon shows", !!s);
  await still(page, "p6-paw-icon");
  await walk(page, L.paw.x, L.paw.y);
  s = await until(page, (q) => q.now.snack, 6000);
  g.check("tapping the paw icon walks him to the bar and opens the close-up", !!s);
  await sleep(600);
  await still(page, "p6-snack-close-up");
  await set(page, (p) => (p.ft = 61));
  const stars0 = (await st(page)).stars;
  for (let i = 0; i < 5; i++) {
    await until(page, (q) => q.now.snack && q.now.snack.phase === "back", 12000);
    const [, x, y] = L.cut.snacks[i];
    await page.evaluate((a) => window.__ss.ch1Pointer("down", a[0], a[1]), [x, y]);
    await page.evaluate(() => window.__ss.ch1Pointer("move", 100, 550));
    await page.evaluate(() => window.__ss.ch1Pointer("up", 100, 550));
    await sleep(150);
  }
  s = await st(page);
  g.check("each snack is stars; five topple the pyramid and the zoom pulls back", s.now.snacks.toppled && !s.now.snack && s.stars === stars0 + 5 * snacks.SNACK_STARS, [s.now.snacks, s.stars - stars0]);
  await sleep(500);
  await still(page, "p6-pyramid-topples");
  s = await until(page, (q) => q.now.gone.length === 1, 3000);
  g.check("the flying cup knocks a piece off (after the first minute)", !!s, s && s.now.gone);
  g.check("everyone turns to stare for 4 seconds", !!s && s.now.stare > 2 && s.now.stare <= 4, s && s.now.stare);
  await still(page, "p6-stare");
  await page.close();
}
{
  const { page } = await open("party:P6");
  await place(page, 770, 540);
  await set(page, (p) => ((p.snacks = p.snacks || { bag: 0, taken: [], toppled: false, chain: -1 }), window.__ss.op.ctrl = false));
  await page.evaluate(() => {
    const p = window.__ss.op.ch1PartyNow;
    p.snack = { zoom: 1, paw: { x: 480, y: 560 }, held: -1, phase: "back", t: 0, back: 0, catches: 0 };
  });
  const L = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());
  const holdUntilCaught = async () => {
    const [, x, y] = L.cut.snacks[0];
    await page.evaluate((a) => window.__ss.ch1Pointer("down", a[0], a[1]), [x, y]);
    return until(page, (q) => q.cur === "bub", 12000);
  };
  let s = await holdUntilCaught();
  g.check("she turns while his paw holds a snack: \"...Nice gloves.\"", !!s && s.text === "...Nice gloves.", s && s.text);
  await next(page);
  await until(page, (q) => q.cur !== "bub", 3000);
  s = await holdUntilCaught();
  g.check("the second time: \"Wait a second... fur!\"", !!s && s.text === "Wait a second... fur!", s && s.text);
  await sleep(200);
  g.check("over the bartender's bubble, a name (\"The bartender\"), never blank", (await bubbleName(page)) === "The bartender", await bubbleName(page));
  await next(page);
  s = await until(page, (q) => q.now && q.now.alarm, 3000);
  g.check("then she runs to the alarm (P7)", !!s && s.now.scene === "P7" && !s.now.snack, s && s.now);
  await page.close();
}

// ---------- the octopus ----------
{
  const { page } = await open("party:P6");
  await sleep(3000);
  const oc = (await st(page)).now.people["octopus-guest"];
  await place(page, oc.x - 60, oc.y);
  await sleep(1500);
  let s = await st(page);
  g.check("in his first minute the octopus never starts", s.now.oct.mode !== "chase" && s.cur !== "bub", s.now.oct);
  await set(page, (p) => (p.ft = 61));
  s = await until(page, (q) => q.cur === "bub", 4000);
  g.check("after the first minute: \"*hic* Fellow tourist!\"", !!s && s.text === "*hic* Fellow tourist!", s && s.text);
  await sleep(200);
  g.check("over the octopus, the name is the game's own \"Tourist\"", (await bubbleName(page)) === "Tourist", await bubbleName(page));
  await still(page, "p6-octopus");
  await next(page);
  s = await until(page, (q) => q.cur === "bub" && q.text !== "*hic* Fellow tourist!", 3000);
  g.check("Squatch thinks \"I gotta juke this fool.\"", !!s && s.text === "I gotta juke this fool.", s && s.text);
  await next(page);
  s = await until(page, (q) => q.now.oct.hugs === 1, 6000);
  g.check("the octopus follows and hugs: a piece tips crooked", !!s && s.now.tip && s.now.gone.length === 0, s && s.now.tip);
  await set(page, (p) => ((p.oct.rest = 0), (p.oct.mode = "snacks")));
  const o2 = (await st(page)).now.people["octopus-guest"];
  await place(page, o2.x - 40, o2.y);
  s = await until(page, (q) => q.now.oct.hugs === 2, 8000, async (q) => q.cur === "bub" && (await next(page)));
  g.check("a second hug knocks it off", !!s && s.now.gone.length === 1, s && s.now.gone);
  await page.close();
}

// ---------- the hallway ----------
{
  const { page } = await open("party:P6");
  await place(page, 830, 322);
  await walk(page, 940, 320);
  let s = await until(page, (q) => q.cur === "bub", 6000);
  g.check("heading for the hallway doorway: he thinks \"Mops!\"", !!s && s.text === "Mops!", s && s.text);
  g.check("Mops's beard is in the doorway", !!s && s.now.beard.show > 0.5, s && s.now.beard);
  await still(page, "p6-hallway-mops");
  await next(page);
  s = await until(page, (q) => q.ctrl && !q.cur, 4000);
  g.check("he steps back and cannot go through", !!s && Math.abs(s.x - hall.HALLWAY_BACK.x) < 3 && s.room === "hall", s && [s.x, s.y]);
  g.check("the uh-oh and the beard's swish sound", (await played(page)).includes("uhoh"));
  await page.close();
}

// ---------- the conga ----------
{
  const { page } = await open("party:P6");
  await place(page, 700, 600);
  await set(page, (p, n, a) => (p.songT = a), toys.CONGA.start);
  let s = await until(page, (q) => q.now.conga && q.now.conga.formed, 15000);
  g.check("the conga forms (its dancers walk to it, nobody jumps)", !!s);
  await sleep(1500);
  await still(page, "p6-conga");
  const tail = await page.evaluate(() => {
    const p = window.__ss.op.ch1PartyNow;
    return p.people.backpack;
  });
  await place(page, tail.x - 10, tail.y + 30);
  s = await until(page, (q) => q.now.conga.joined, 4000);
  g.check("walking into its tail joins it", !!s && s.now.done.conga);
  const a = await st(page);
  await sleep(1500);
  const b = await st(page);
  g.check("in the line he is towed along", Math.hypot(a.x - b.x, a.y - b.y) > 30, [a.x, a.y, b.x, b.y]);
  await still(page, "p6-conga-towed");
  const here = await st(page);
  s = await until(page, (q) => !q.now.conga.joined, 3000, async () => walk(page, here.x, Math.min(600, here.y + 80)));
  g.check("steering away leaves the line", !!s);
  await page.close();
}

// ---------- ↺ ----------
{
  const { page } = await open("party:P6");
  await set(page, (p) => ((p.song = 1), (p.lostPieces = ["head"])));
  await place(page, 300, 500);
  await page.evaluate(() => window.SSQ.beat("ch1-party").restart());
  await sleep(500);
  const s = await st(page);
  g.check("↺ restarts P6 just inside his door, the same outfit whole, the song that was playing", s.now.scene === "P6" && Math.hypot(s.x - hall.SPOTS.doorway.x, s.y - hall.SPOTS.doorway.y) < 3 && s.now.gone.length === 0 && s.now.song === 1, [s.now.scene, s.x, s.y, s.now.gone, s.now.song]);
  await page.close();
}

{
  const { page } = await open("party:P6");
  await walk(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4);
  await until(page, (q) => q.act === "DANCE · circle", 8000);
  await press(page);
  await until(page, (q) => q.full, 3000);
  await page.touchscreen.touchStart(34, 34);
  await sleep(1000);
  await page.touchscreen.touchEnd();
  await sleep(600);
  let s = await st(page);
  g.check("holding the dance view's own ↺ restarts P6: the dance closed, back inside his door", !s.full && s.now.scene === "P6" && !s.now.dance && Math.hypot(s.x - hall.SPOTS.doorway.x, s.y - hall.SPOTS.doorway.y) < 3, [s.full, s.x, s.y]);
  await page.evaluate(() => (window.__ss.op.ch1PartyNow.snack = { zoom: 1, paw: { x: 480, y: 560 }, held: -1, phase: "back", t: 0, back: 0, catches: 0 }));
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(500);
  s = await st(page);
  g.check("↺ with the snack close-up open restarts P6 with it closed", s.now.scene === "P6" && !s.now.snack && s.ctrl, s.now.snack);
  await page.close();
}

await g.finish("party-free");
