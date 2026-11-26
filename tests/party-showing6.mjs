/**
 * Brian's notes on party showing 6 (2026-11-26). Each check names its note:
 *   1  "It looks like he's right in the octopus' cone, what am I missing??": sight sees Squatch's whole drawn body,
 *      so a cone drawn on any part of him sees him, and a cone that does not see him is not drawn on him. Checked
 *      against what is drawn: his outline (party-watch.js SQUATCH_OUTLINE) holds every pixel of his drawing, and for
 *      every guest's (and everyone else's) cone in P2, P4 (its moving cones, over time) and P6, at places all over the
 *      hall floor, the cone as drawn (the numbers the drawing used) covers pixels of his drawing exactly when the
 *      sight test sees him.
 *   2  "The background noise here still throws me off- sounds like a HVAC system": the crowd's sound in the hall has
 *      no steady noise in it (no noise source at all: voices, a laugh, a glass).
 *   3  "I don't think we should default to the vocal part of this song": every place music plays is in one table
 *      (music-picks.js); away from bedtime none plays the theme's singing (from 0:19.5); Joe's song is kept inside
 *      its opening tune, going back to its start at the end with a fade.
 *   4  "Seems to be a long break after finishing dance now and picture?": after his first dance, the guests clap for
 *      him and the group photo starts under a second after the clap ends.
 *   (5, the guards never standing or walking over furniture: tests/standing-spots.mjs.)
 *   node tests/party-showing6.mjs
 */
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const W = await import(join(root, "src", "modules", "party-watch.js"));
const picks = await import(join(root, "src", "modules", "music-picks.js"));
const board = await import(join(root, "src", "modules", "party-board-sounds.js"));
const dance = await import(join(root, "src", "modules", "party-dance.js"));
const free = await import(join(root, "src", "modules", "party-free.js"));
const { existsSync, readFileSync } = await import("node:fs");
const credits = readFileSync(join(root, "music", "CREDITS.txt"), "utf8");
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9473, name: "party-showing6" });

async function open(beat, view) {
  const o = await g.open("?beat=" + beat, view);
  await sleep(1500);
  await o.page.evaluate(() => (window.requestAnimationFrame = () => 0));
  return o;
}

// ---------- 1: his outline holds every pixel of his drawing ----------
const inOutline = (x, y) => {
  const P = W.SQUATCH_OUTLINE;
  let inside = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const [xi, yi] = P[i],
      [xj, yj] = P[j];
    yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi && (inside = !inside);
  }
  return inside;
};
{
  const { page, errors } = await open("party:P4", { width: 1100, height: 800 });
  const masks = await page.evaluate(() => {
    const E = window.SSQ.engine(),
      sc = E.hallSizes().squatch,
      out = [];
    for (const f of [1, -1])
      for (const walk of [0, 1.6, 3.1, 4.7]) {
        const cv = document.createElement("canvas");
        cv.width = 200;
        cv.height = 200;
        const c = cv.getContext("2d");
        E.drawSquatch(c, 100, 150, sc, { f, walk });
        const d = c.getImageData(0, 0, 200, 200).data,
          px = [];
        for (let y = 0; y < 200; y++) for (let x = 0; x < 200; x++) d[(y * 200 + x) * 4 + 3] > 40 && px.push([x + 0.5 - 100, y + 0.5 - 150]);
        out.push({ f, walk, px });
      }
    return out;
  });
  let outside = 0,
    worst = null,
    pixels = 0;
  for (const m of masks)
    for (const [x, y] of m.px) {
      pixels++;
      // (within a pixel of the outline counts: the edge of an anti-aliased drawing)
      const ok = [-1, 0, 1].some((dx) => [-1, 0, 1].some((dy) => inOutline(x + dx, y + dy)));
      ok || (outside++, worst || (worst = { f: m.f, walk: m.walk, x, y }));
    }
  // the outline's own area, next to his drawing's (it must hug him, not be a box round him)
  let area = 0;
  for (let y = -90; y < 10; y++) for (let x = -40; x < 40; x++) inOutline(x + 0.5, y + 0.5) && area++;
  const drawn = Math.max(...masks.map((m) => m.px.length));
  g.check("1: his outline holds every pixel of his drawing (standing and walking, facing either way)", pixels > 4000 && outside === 0, { outside, worst });
  g.check("1: and it hugs him: its area is at most 1.3 times his drawing's (it holds his widest step)", area <= drawn * 1.3, { area, drawn });
  g.check("no page errors (1, outline)", errors.length === 0, errors);
  await page.close();
}

// ---------- 1: a cone across his head or chest sees him (Brian's octopus moment) ----------
{
  const sq = { x: 500, y: 450 },
    size = { half: 0.12, len: 210 },
    head = W.coneFrom("octopus-guest", 400, 420, W.lookAt(400, 420, { x: 500, y: 390 }), size),
    chest = W.coneFrom("octopus-guest", 400, 420, W.lookAt(400, 420, { x: 500, y: 410 }), size),
    old = (c) => W.distToCone(sq.x, sq.y - W.SQUATCH_SEEN_ABOVE_FEET, c.ox, c.oy, c.a, c.half, c.len) <= 0;
  g.check("1: a narrow cone across his head, or his chest, sees him (the old single point low on him did not)", W.coneSees(head, sq) && W.coneSees(chest, sq) && !old(head) && !old(chest), [W.coneSees(head, sq), W.coneSees(chest, sq), old(head), old(chest)]);
}

// ---------- 1: the cone as drawn is on him exactly when the sight test sees him ----------
// In the page: Squatch is put at each place (stepped out of hiding once first), the game ticks one frame and draws it;
// the cones the drawing used are read back, with how many pixels of his drawing each covers (the wedge as the
// drawing fills it, clipped to the room). The sight test (party-watch.js coneSees) is run here on the game's cones.
async function coneTruth(beat, times) {
  const { page, errors } = await open(beat, { width: 1100, height: 800 });
  // out of hiding: a few steps along the floor
  await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    ss.tapAt(n.sq.x + 40, n.sq.y);
    for (let i = 0; i < 30; i++) ss.tick(1 / 60);
  });
  const rows = await page.evaluate(
    (times, room) => {
      const ss = window.__ss,
        n = ss.op,
        b = window.SSQ.beat("ch1-party"),
        E = window.SSQ.engine(),
        sc = E.hallSizes().squatch,
        cv = document.createElement("canvas");
      cv.width = 200;
      cv.height = 200;
      const c = cv.getContext("2d"),
        out = [];
      for (const t of times)
        for (let x = 90; x <= 870; x += 52)
          for (let y = 320; y <= 585; y += 33) {
            const p = n.ch1PartyNow;
            if (!p || p.alarm) return { stopped: true, out };
            t.sweep != null && (p.sweepT = t.sweep);
            t.gt != null && (p.gt = t.gt);
            p.pose = "stand";
            n.sqPose = "stand";
            p.seenT = 0;
            p.seenBy = "";
            n.sq.x = x;
            n.sq.y = y;
            ss.tick(1 / 60);
            n.sq.x = x;
            n.sq.y = y;
            t.sweep != null && (p.sweepT = t.sweep);
            t.gt != null && (p.gt = t.gt);
            ss.drawFrame();
            const drawn = ss.conesDrawn().filter((k) => k.room === "hall" && k.id),
              sight = b.cones(),
              f = n.sq.f || 1;
            // his drawing, where it is: the pixels it covers
            c.clearRect(0, 0, 200, 200);
            E.drawSquatch(c, 100, 150, sc, { f, walk: 0 });
            const d = c.getImageData(0, 0, 200, 200).data,
              px = [];
            for (let yy = 0; yy < 200; yy++) for (let xx = 0; xx < 200; xx++) d[(yy * 200 + xx) * 4 + 3] > 40 && px.push([x + xx + 0.5 - 100, y + yy + 0.5 - 150]);
            // how many of his pixels the wedge covers, and how near it comes to the nearest one (0 on him)
            const over = (k) => {
              let hits = 0,
                near = 1e9;
              for (const [qx, qy] of px) {
                if (qx < room.x0 || qx > room.x1 || qy < room.y0 || qy > room.y1) continue;
                const dx = qx - k.ox,
                  dy = qy - k.oy;
                let a = Math.atan2(dy, dx) - k.a;
                while (a > Math.PI) a -= 2 * Math.PI;
                while (a < -Math.PI) a += 2 * Math.PI;
                let dist;
                if (Math.abs(a) <= k.half) dist = Math.max(0, Math.hypot(dx, dy) - k.len);
                else {
                  const edge = (g) => {
                    const ux = Math.cos(g),
                      uy = Math.sin(g),
                      t = Math.max(0, Math.min(k.len, dx * ux + dy * uy));
                    return Math.hypot(dx - ux * t, dy - uy * t);
                  };
                  dist = Math.min(edge(k.a - k.half), edge(k.a + k.half));
                }
                dist <= 0 && hits++;
                near = Math.min(near, dist);
              }
              return { hits, near: Math.round(near * 10) / 10 };
            };
            out.push({ t, sq: { x, y }, drawn: drawn.map((k) => ({ id: k.id, ox: k.ox, oy: k.oy, a: k.a, half: k.half, len: k.len, ...over(k) })), sight: sight.map((k) => ({ id: k.id, ox: k.ox, oy: k.oy, a: k.a, half: k.half, len: k.len })) });
          }
      return { stopped: false, out };
    },
    times,
    W.ROOM_INSIDE,
  );
  await page.close();
  const bad = [];
  let seen = 0,
    clear = 0,
    pairs = 0;
  for (const r of rows.out)
    for (const s of r.sight) {
      pairs++;
      const sees = W.coneSees(s, r.sq),
        d = r.drawn.find((k) => k.id === s.id),
        same = d && Math.abs(d.ox - s.ox) < 0.01 && Math.abs(d.oy - s.oy) < 0.01 && Math.abs(d.a - s.a) < 1e-6,
        over = d ? d.hits : 0,
        near = d ? d.near : 1e9;
      sees ? seen++ : clear++;
      // Seen: his cone is drawn, as tested, and on his drawing (touching it, or within 5 pixels: his outline holds his
      // widest step, party-watch.js, and he is drawn standing here). Not seen: no more than 2 of his pixels under the
      // drawn cone (the drawing's anti-aliased edge).
      const ok = sees ? !!d && same && near <= 5 : !d || over <= 2;
      ok || (bad.length < 6 && bad.push({ id: s.id, sq: r.sq, t: r.t, sees, drawn: !!d, same, over, near }));
    }
  return { bad, seen, clear, pairs, stopped: rows.stopped, errors };
}
for (const [beat, times, what] of [
  ["party:P4", [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5].map((s) => ({ sweep: s })), "P4, the flyer sneak's moving cones, 8 moments"],
  ["party:P2", [0, 3.7, 4.5].map((gt) => ({ gt })), "P2, the glancer facing the stage, turning, looking across"],
  ["party:P6", [{}], "P6, the party in disguise"],
]) {
  const r = await coneTruth(beat, times);
  g.check(`1: ${what}: for every cone at ${r.pairs} cone-and-place pairs, the drawn cone is on his drawing exactly when it sees him (seen ${r.seen}, not seen ${r.clear})`, !r.stopped && r.bad.length === 0 && r.seen > 10 && r.clear > 100, r);
  g.check(`no page errors (1, ${beat})`, r.errors.length === 0, r.errors);
}

// ---------- 2: no steady noise in the crowd ----------
{
  // A stand-in for the browser's sound engine that counts what is made (a noise is a looping buffer source).
  const made = { noise: 0, osc: 0 };
  const node = () => ({ connect() {}, disconnect() {}, gain: param(), frequency: param(), Q: param(), type: "" });
  function param() {
    return { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} };
  }
  const c = {
    sampleRate: 48000,
    currentTime: 0,
    createGain: node,
    createBiquadFilter: node,
    createOscillator: () => (made.osc++, { ...node(), start() {}, stop() {} }),
    createBufferSource: () => (made.noise++, { ...node(), start() {}, stop() {} }),
    createBuffer: (ch, len) => ({ getChannelData: () => new Float32Array(len) }),
  };
  for (let k = 0; k < 4; k++) board.BOARD.murmur({ c, o: node() }, k * 3, 2.8);
  g.check("2: the crowd in the hall is voices, laughs and a glass: no noise at all under it (it was a steady filtered hiss)", made.noise === 0 && made.osc >= 40, made);
}

// ---------- 3: the music table (Brian's picks of 2026-11-26) ----------
{
  picks.newVisits();
  const rows = Object.entries(picks.MUSIC_PICKS);
  const want = { title: "music/main-theme-from-brian.mp3", morning: "music/goating-in-space.mp3", home: "music/carefree.mp3", tv: "music/odyssey.mp3", hall: "music/lobby-time.mp3", sneak: "music/sneaky-snitch.mp3", caught: "music/der-kleber-sting.mp3", band: "music/stormtop-sylvania.mp3" };
  const got = Object.fromEntries(Object.keys(want).map((k) => [k, picks.fileFor(k)]));
  g.check("3: every moment has its row and Brian's track: title Joe's tune, morning Goating in Space, home Carefree, TV Odyssey, hall Lobby Time, sneaking Sneaky Snitch, caught Der Kleber Sting, band Stormtop-Sylvania", JSON.stringify(got) === JSON.stringify(want), got);
  g.check("3: the band's second song is Funky Chunk, and they alternate", picks.fileFor("band", 1) === "music/funky-chunk.mp3" && picks.fileFor("band", 2) === "music/stormtop-sylvania.mp3");
  g.check("3: home is a rotation (a list stepped through a visit at a time), and the gift is the same visit", Array.isArray(picks.MUSIC_PICKS.home) && picks.MUSIC_PLACE.gift === "home");
  g.check("3: a mops-bleat hook waits for its file, and the closing hum is silent until Brian picks", "mops-bleat" in picks.SOUND_PICKS && picks.fileFor("closing-hum") === null);
  g.check("3: singing plays only in the morning (Goating in Space) and from the band; elsewhere no words, or silence", rows.every(([k]) => picks.listFor(k).every((n) => picks.SPANS[n].words === false) || picks.SINGING_OK.includes(k)) && JSON.stringify(picks.SINGING_OK) === JSON.stringify(["morning", "band"]), rows);
  g.check("3: the theme's opening tune ends before its singing starts (0:19)", picks.SPANS.themeTune.to <= 19 && picks.SPANS.themeTune.file === "theme");
  g.check("3: every file in the table is in music/, credited in music/CREDITS.txt", Object.values(picks.MUSIC_FILES).every((f) => existsSync(join(root, f.url))) && ["Carefree", "Der Kleber Sting", "Funky Chunk", "Lobby Time", "Morning", "Odyssey", "Rainbows", "Reawakening", "Sneaky Snitch"].every((t) => credits.includes('"' + t + '" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License, http://creativecommons.org/licenses/by/4.0/')) && credits.includes("Goating in Space, Brian's song made with Suno, 2026-11-26") && credits.includes("Stormtop-Sylvania, Brian's song made with Suno, 2026-11-26"));
  // the older program's music element, past the tune's end: back to its start, silent for that frame; then a fade
  picks.newVisits();
  const el = { src: "http://x/music/main-theme-from-brian.mp3", currentTime: 18.6 };
  picks.keepInSpan({ ...el }, "title");
  const k0 = picks.keepInSpan(el, "title"),
    back = el.currentTime,
    kMid = picks.keepInSpan({ ...el, currentTime: 9 }, "title"),
    kEnd = picks.keepInSpan({ ...el, currentTime: 18.2 }, "title");
  g.check("3: Joe's song past 0:18.5 goes back to 0:01, and fades out over its last 0.8 s", k0 === 0 && back === 1 && kMid === 1 && kEnd > 0 && kEnd < 0.5, { k0, back, kMid, kEnd });
  // Visits, as the older program's cue comes every frame (seeCue, with a clock in seconds): home is a rotation, once a
  // visit; a cue that flickers for less than HOLD is not a new visit; "" (no music cue) leaves the element alone.
  picks.newVisits();
  let now = 0;
  const frames = (cue, secs) => {
    for (let k = 0; k < secs * 60; k++) picks.seeCue(cue, (now += 1 / 60));
  };
  const el2 = { src: "http://x/music/main-theme-from-brian.mp3", currentTime: 7 };
  frames("title", 2);
  const title = [picks.visitNow().file, picks.keepInSpan(el2, "title")];
  frames("", 0.5); // (a moment of no cue: not a new visit)
  const blip = picks.visitNow().place;
  frames("home", 2);
  const home1 = picks.keepInSpan(el2, "home"),
    swapped = el2.src === "music/carefree.mp3" && el2.currentTime === 0;
  el2.currentTime = 50;
  const mid = picks.keepInSpan(el2, "home");
  el2.currentTime = picks.SPANS.carefreeOnce.to - 0.3;
  const fading = picks.keepInSpan(el2, "home");
  el2.currentTime = picks.SPANS.carefreeOnce.to + 0.1;
  const over = picks.keepInSpan(el2, "home");
  frames("", 0.4); // a roomWalk's moment, or a frame between steps
  frames("gift", 1.5); // the gift: the same visit
  el2.currentTime = 3;
  const after = picks.keepInSpan(el2, "gift");
  frames("tv", 0.3); // one flicker of the TV cue
  const flick = picks.visitNow().place;
  frames("tv", 2); // the TV story
  const tv = picks.visitNow().file;
  frames("home", 2); // home again: a new visit, the next track
  const home2 = picks.visitNow().file;
  frames("party", 0); // (a cue not in the table is no music)
  frames("", 2);
  const none = picks.keepInSpan(el2, "");
  frames("home", 2);
  const home3 = picks.visitNow().file;
  frames("", 2);
  frames("home", 2);
  const home4 = picks.visitNow().file;
  const r = { title, blip, home1, swapped, mid, fading, over, after, flick, tv, home2, none, home3, home4 };
  const m = picks.MUSIC_FILES.carefree.match;
  g.check("3: the title plays Joe's tune at once; a half-second gap is not a new visit", title[0] === "music/main-theme-from-brian.mp3" && blip === "title", r);
  g.check("3: at home the first rotation track (Carefree) starts from its top, plays, fades over its last 0.8 s, then stays quiet for the rest of that visit (a moment's gap and the gift are the same visit)", home1 === 0 && swapped && Math.abs(mid - m) < 1e-9 && fading > 0 && fading < 0.5 * m && over === 0 && after === 0, r);
  g.check("3: a one-frame flicker to the TV cue is not a new visit; the TV story plays Odyssey", flick === "home" && tv === "music/odyssey.mp3", r);
  g.check("3: each new visit home takes the next track: Carefree, Morning, Rainbows, then Carefree again; with no cue the element is left to its own fade", home2 === "music/morning.mp3" && home3 === "music/rainbows.mp3" && home4 === "music/carefree.mp3" && none === 1, r);
  g.check("3: bedtime (its cue comes with the bedtime story's branch) plays Reawakening", picks.fileFor("bedtime") === "music/reawakening.mp3");
  // in the game: the theme cue on the title is kept in the tune
  const { page, errors } = await open("party:P6", { width: 1100, height: 800 });
  const live = await page.evaluate(() => {
    const a = { src: location.origin + "/music/main-theme-from-brian.mp3", currentTime: 25 };
    window.SSQ.musicSpan(a, "title");
    a.currentTime = 25;
    const k = window.SSQ.musicSpan(a, "title");
    return { k, t: a.currentTime };
  });
  g.check("3: in the game, the theme's cues go through the table (a theme at 0:25 is sent back to 0:01)", live.k === 0 && live.t === 1, live);
  g.check("no page errors (3)", errors.length === 0, errors);
  await page.close();
}

// ---------- the Croc Boys' song: Brian's recording while the band plays ----------
{
  const o = await g.open("?beat=party:P6", PHONE);
  await sleep(1200);
  await o.page.click("#ss-sound");
  let d = null;
  for (let i = 0; i < 40 && !(d && d.band.playing); i++) {
    await sleep(250);
    d = await o.page.evaluate(() => window.SSQ.beat("ch1-party").now().sound);
  }
  g.check("the band plays Brian's \"Stormtop-Sylvania\" (music/stormtop-sylvania.mp3) for their first song, through the band's bus", !!d && d.band.playing === "music/stormtop-sylvania.mp3" && d.song === 0 && d.played.includes("band-recording:music/stormtop-sylvania.mp3"), d && { band: d.band, song: d.song });
  // the band stops (the photo, an alarm): the recording stops with it
  await o.page.evaluate(() => window.__ss.op.ch1PartyNow && (window.__ss.op.ch1PartyNow.band = false));
  await sleep(600);
  d = await o.page.evaluate(() => window.SSQ.beat("ch1-party").now().sound);
  g.check("and stops when the band stops", !d.band.playing && d.song === -1, { band: d.band, song: d.song });
  // the second song: Funky Chunk
  await o.page.evaluate(() => { const p = window.__ss.op.ch1PartyNow; p.band = true; p.song = 1; });
  for (let i = 0; i < 40 && !(d && d.band.playing === "music/funky-chunk.mp3"); i++) {
    await sleep(250);
    d = await o.page.evaluate(() => window.SSQ.beat("ch1-party").now().sound);
  }
  g.check("their second song is Funky Chunk (music/funky-chunk.mp3)", d.band.playing === "music/funky-chunk.mp3" && d.song === 1, { band: d.band, song: d.song });
  // the FUR! moment: the sting
  const sting = await o.page.evaluate(() => {
    const s = window.SSQ.beat("ch1-party").now().sound;
    return s.sting;
  });
  g.check("the FUR! moment's sting (Der Kleber Sting) is loaded once sound is on", sting === true, sting);
  g.check("no page errors (the band's song)", o.errors.length === 0, o.errors);
  await o.page.close();
}

// ---------- the FUR! moment plays the sting; P2's sneak to the plant has the sneak music ----------
{
  const { page, errors } = await open("party:P2", { width: 1100, height: 800 });
  const r = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      b = window.SSQ.beat("ch1-party");
    // out of the plant, in the open: the music cue is the sneak's
    ss.tapAt(n.sq.x + 40, n.sq.y);
    for (let i = 0; i < 20; i++) ss.tick(1 / 60);
    const cue = b.musicCue();
    // seen in front of the stage until the alarm starts
    for (let i = 0; i < 60 * 6 && !n.ch1PartyNow.alarm; i++) ((n.sq.x = 440), (n.sq.y = 330), ss.tick(1 / 60));
    return { cue, alarm: !!n.ch1PartyNow.alarm, played: b.now().sound.played.slice(-12), after: b.musicCue() };
  });
  g.check("P2, sneaking to the plant (no band yet): the music cue is the sneak's (Sneaky Snitch)", r.cue === "sneak", r);
  g.check("the FUR! moment plays the sting, once, and the sneak music stops for the alarm", r.alarm && r.played.filter((x) => x === "sting").length === 1 && r.after === "", r);
  g.check("no page errors (sting)", errors.length === 0, errors);
  await page.close();
}

// ---------- 4: the group photo follows the dance ----------
{
  const { page, errors } = await open("party:P6", PHONE);
  const hall = await import(join(root, "src", "modules", "party-hall.js"));
  await page.evaluate((d) => ((window.__ss.op.sq.x = d.x), (window.__ss.op.sq.y = d.y + 4)), hall.DANCE_SPOT);
  const tick = (f, max) =>
    page.evaluate(
      (f, max) => {
        const test = new Function("p", "n", "return (" + f + ")(p, n)");
        for (let i = 0; i <= max * 60; i++) {
          const n = window.__ss.op;
          if (test(n.ch1PartyNow, n)) return i / 60;
          window.__ss.tick(1 / 60);
        }
        return -1;
      },
      f,
      max,
    );
  await tick("(p, n) => n.act && n.act.verb === 'DANCE'", 3);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  await tick("(p) => !!p.dance", 3);
  // a short first dance, early in the first song: three spots hit, then the routine is over
  const at = await page.evaluate((tried) => {
    const p = window.__ss.op.ch1PartyNow;
    Object.assign(p.dance, { moves: tried, finished: true, t: 20 });
    return p.songT;
  }, dance.DANCE.tried);
  await tick("(p) => p.dance && p.dance.over", 6);
  await page.evaluate(() => window.__ss.drawFrame());
  const end = await page.evaluate(() => window.__ss.op.ch1PartyNow.dance.seen.end);
  await page.touchscreen.tap(end.back.x, end.back.y);
  const s0 = await page.evaluate(() => ({ dance: !!window.__ss.op.ch1PartyNow.dance, clap: window.__ss.op.ch1PartyNow.clap, songT: window.__ss.op.ch1PartyNow.songT }));
  const took = await tick("(p) => !!p.shot", 20);
  const gap = took - dance.DANCE.clap;
  g.check("4: \"Back to the party\" after his first dance: the guests clap, then the group photo starts under a second after the clap ends (it waited for the song's end, about 28 s in the video)", !s0.dance && s0.clap > 0 && took >= dance.DANCE.clap - 0.05 && gap < 1, { songTAtDance: at, took, clap: dance.DANCE.clap, gap: +gap.toFixed(2), PHOTO_AFTER_DANCE: free.PHOTO_AFTER_DANCE });
  g.check("no page errors (4)", errors.length === 0, errors);
  await page.close();
}

await g.finish("party-showing6");
