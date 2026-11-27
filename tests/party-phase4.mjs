/**
 * Brian's notes and answers of 2026-11-26, in the game at phone size (the party night):
 *   closing   after the last song: the crowd cheers, the band bows, the lights dim a step, then the speaker's chime and
 *             line with its sound-wave arcs drawn (phase 4 items 1 and 2); after the line his door takes him home on
 *             his own, Mops comes home and the talk starts there (#50); Mops turns to him and hearts float up, no
 *             yellow glow (#48, phase 4 item 5);
 *   at home   home early ("Keep going", P8c) the party is still on: the band through his door and notes under it, no
 *             home music until Mops comes home (phase 4 item 6);
 *   the photo with him standing by the dance spot, everyone reaches the rows in seconds (phase 4 item 7); the song
 *             ends on a fade with a cheer and claps, never a record scratch (item 3); standing in his place before
 *             the 3-2-1 gets him seen; a kid who presses JOIN · photo at the count and steps out after the Polaroid is
 *             in it and never seen (#46);
 *   the vent  its pull is a rush of air (suction), never the squeaky slurp (item 8);
 *   the chase the band fades out and Run Amok plays while the octopus chases him (#44);
 *   the guard at home his flashlight is on only while he searches (#27).
 *   node tests/party-phase4.mjs
 */
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const hall = await import(join(root, "src", "modules", "party-hall.js"));
const lines = await import(join(root, "src", "modules", "party-lines.js"));
const L = (id) => lines.partyLine(id);
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9475, name: "party-phase4" });
async function open(beat, frozen = true) {
  const o = await g.open("?beat=" + beat, PHONE);
  await sleep(1500);
  frozen && (await o.page.evaluate(() => (window.requestAnimationFrame = () => 0)));
  return o;
}

// ---------- closing time, the speaker, walking home on his own, Mops's hearts ----------
{
  const { page, errors } = await open("party:P8b");
  const r = await page.evaluate((S) => {
    const ss = window.__ss,
      n = ss.op,
      b = window.SSQ.beat("ch1-party"),
      c = document.querySelector("canvas"),
      k = c.width / 960,
      grab = () => Array.from(c.getContext("2d").getImageData(Math.round(S.x1 * k), Math.round(S.y0 * k), Math.round(40 * k), Math.round((S.y1 - S.y0) * k)).data).join(","),
      out = { phases: [], dimMax: 0, bow: false, arcs: null, played: [] };
    // (closing time from its start: the page has been running a moment already)
    b.jump("P8b");
    let t = 0,
      last = "";
    for (let i = 0; i < 60 * 12; i++) {
      ss.tick(1 / 60);
      t += 1 / 60;
      const p = n.ch1PartyNow;
      const ph = p.close ? p.close.phase : "";
      ph !== last && (out.phases.push([ph, Math.round(t * 10) / 10]), (last = ph));
      ph === "dim" && (out.dimMax = Math.max(out.dimMax, p.lightK || 0));
      if (ph === "speak" && n.cur && n.cur.k === "bub" && out.arcs == null) {
        ss.drawFrame();
        const on = grab();
        p.speakerOn = false;
        ss.drawFrame();
        const off = grab();
        p.speakerOn = true;
        out.arcs = { speaking: n.cur.b.who, text: n.cur.b.text, differ: on !== off };
      }
      n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap());
      if (ph === "leave") break;
    }
    out.played = b.now().sound.played.slice();
    return out;
  }, hall.HALL_SPEAKER);
  const at = (ph) => (r.phases.find((q) => q[0] === ph) || [0, null])[1];
  g.check("closing: the crowd cheers and the band bows, then the lights dim a step, then the speaker (2 to 4 s each)", at("cheer") != null && at("dim") - at("cheer") >= 2 && at("dim") - at("cheer") <= 4 && at("speak") - at("dim") >= 1.5 && at("speak") - at("dim") <= 4 && r.dimMax > 1.2, r.phases);
  g.check("closing: cheer, claps and the band's flourish before the chime", ["cheer", "clap", "tada"].every((s) => r.played.indexOf(s) >= 0 && r.played.indexOf(s) < r.played.indexOf("chime")), r.played);
  g.check("closing: while the speaker says its line, its sound-wave arcs are drawn beside it (phase 4 item 1)", !!r.arcs && r.arcs.speaking === "pa" && r.arcs.text === L("speaker-closing") && r.arcs.differ, r.arcs);
  // he walks home through his own door; Mops comes home and the talk starts there
  const h = await page.evaluate((D) => {
    const ss = window.__ss,
      n = ss.op,
      out = { rooms: [], hearts: null, glow: false, first: "" };
    n.sq.x = 300;
    n.sq.y = 420;
    for (let i = 0; i < 20; i++) ss.tick(1 / 60);
    n.sq.x = D.x;
    n.sq.y = D.y;
    for (let i = 0; i < 60 * 30; i++) {
      ss.tick(1 / 60);
      const p = n.ch1PartyNow;
      if (!p) break;
      out.rooms[out.rooms.length - 1] !== n.room && out.rooms.push(n.room);
      p.mopsHeartsAt != null && out.hearts == null && (out.hearts = { mopsIn: n.moPose !== "hidden", line: n.cur && n.cur.k === "bub" ? n.cur.b.text : "" });
      if (n.cur && n.cur.k === "bub") {
        out.first = n.cur.b.text;
        break;
      }
    }
    out.costumeLook = "costumeLook" in (n.ch1PartyNow || {});
    return out;
  }, { x: hall.HALL_DOOR.x, y: hall.HALL_DOOR.y });
  g.check("#50 at closing time his own door takes him home; Mops comes home and the talk starts there", JSON.stringify(h.rooms) === JSON.stringify(["hall", "closet"]) && h.first === L("mops-went"), h);
  g.check("#48 Mops turns to him and hearts float up before he speaks; no yellow glow on Squatch", !!h.hearts && h.hearts.mopsIn && !h.costumeLook, h);
  await page.evaluate(() => {
    const ss = window.__ss;
    ss.op.ch1PartyNow.mopsHeartsAt = window.SSQ.engine().time() - 0.24;
    ss.drawFrame();
  });
  const pink = await page.evaluate(() => {
    const c = document.querySelector("canvas"),
      k = c.width / 960,
      m = window.SSQ.engine().pos("mops"),
      d = c.getContext("2d").getImageData(Math.round((m.x - 140) * k), Math.round((m.y - 320) * k), Math.round(240 * k), Math.round(220 * k)).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) d[i] > 230 && d[i + 1] > 70 && d[i + 1] < 150 && d[i + 2] > 120 && d[i + 2] < 200 && n++;
    return n;
  });
  g.check("#48 the hearts are drawn above Mops", pink > 30, pink);
  g.check("no page errors (closing)", errors.length === 0, errors);
}

// ---------- home early: the party is still on next door ----------
{
  const { page, errors } = await open("party:P8c");
  const r = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      b = window.SSQ.beat("ch1-party");
    for (let i = 0; i < 30; i++) ss.tick(1 / 60);
    const before = { room: n.room, song: b.now().sound.song, cue: b.musicCue() };
    n.ch1PartyNow.mopsT = 99;
    for (let i = 0; i < 10; i++) ss.tick(1 / 60);
    const after = { song: b.now().sound.song, cue: b.musicCue() };
    return { before, after };
  });
  g.check("phase 4 item 6: home early (P8c) the band plays on through his door, and the home music waits", r.before.room === "closet" && r.before.song >= 0 && r.before.cue === "", r);
  g.check("phase 4 item 6: once Mops comes home the party is over for him: no band, the home music", r.after.song === -1 && r.after.cue === "home", r);
  g.check("no page errors (home early)", errors.length === 0, errors);
}

// ---------- the photo: no stall, the fade, the rule ----------
{
  const { page, errors } = await open("party:P6");
  const r = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      b = window.SSQ.beat("ch1-party"),
      p = n.ch1PartyNow;
    for (let i = 0; i < 30; i++) ss.tick(1 / 60);
    const songBefore = b.now().sound.song;
    // he stands on the dance spot (where a kid stands after a dance), right on the way to the rows
    n.sq.x = 470;
    n.sq.y = 360;
    p.songT = 59.9;
    let t = 0,
      gather = null,
      join = null;
    for (let i = 0; i < 60 * 15 && !join; i++) {
      ss.tick(1 / 60);
      t += 1 / 60;
      n.sq.x = 470;
      n.sq.y = 360;
      p.shot && p.shot.phase === "gather" && gather == null && (gather = t);
      p.shot && p.shot.phase === "join" && (join = t);
      n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap());
    }
    const played = b.now().sound.played.slice();
    // standing in his place before the 3-2-1: seen
    n.sq.x = 602;
    n.sq.y = 356;
    for (let i = 0; i < 10; i++) ss.tick(1 / 60);
    return { songBefore, gather, join, played, alarm: !!p.alarm, scene: b.now().scene };
  });
  g.check("phase 4 item 7: with him by the dance spot everyone still reaches the rows within 6 s (no stall)", r.gather != null && r.join != null && r.join - r.gather < 6, r);
  g.check("phase 4 item 3: the song ends on a fade, the crowd cheers and claps, no record scratch", r.songBefore >= 0 && ["fade", "cheer", "clap"].every((s) => r.played.includes(s)) && !r.played.includes("scratch"), r.played.slice(-12));
  g.check("#46 stepping into his place before the 3-2-1 gets him seen (the alarm)", r.alarm && r.scene === "P7", r);
  g.check("no page errors (photo)", errors.length === 0, errors);
}
{
  // a kid who makes it: JOIN · photo at the count, closes the Polaroid, steps out at once (real time, by touch)
  const { page, errors } = await open("party:P6", false);
  await page.evaluate(() => {
    const n = window.__ss.op;
    n.sq.x = 560;
    n.sq.y = 470;
    n.ch1PartyNow.songT = 59.9;
  });
  const st = () => page.evaluate(() => ({ act: window.__ss.op.act ? window.__ss.op.act.verb + " · " + window.__ss.op.act.cap : "", ctrl: !!window.__ss.op.ctrl, phase: window.__ss.op.ch1PartyNow.shot ? window.__ss.op.ch1PartyNow.shot.phase : "", alarm: !!window.__ss.op.ch1PartyNow.alarm, full: !!document.querySelector('canvas[aria-label="group photo"]'), got: window.__ss.op.ch1PartyNow.shot ? window.__ss.op.ch1PartyNow.shot.got : null, cur: window.__ss.op.cur ? window.__ss.op.cur.k : "" }));
  let s = null,
    joinedBefore = false;
  for (let i = 0; i < 200; i++) {
    s = await st();
    s.cur === "bub" && (await page.evaluate(() => window.__ss.opTap()));
    s.act === "JOIN · photo" && s.phase !== "count" && (joinedBefore = true);
    if (s.act === "JOIN · photo" && s.ctrl) break;
    await sleep(100);
  }
  g.check("#46 JOIN · photo is offered only once the 3-2-1 has started", !!s && s.phase === "count" && !joinedBefore, s);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  for (let i = 0; i < 80 && !(s = await st()).full; i++) await sleep(100);
  await sleep(800);
  const box = await page.evaluate(() => {
    const r = document.querySelector('canvas[aria-label="group photo"]').getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.touchscreen.tap(box.x, box.y);
  await sleep(150);
  await page.evaluate(() => window.__ss.tapAt(560, 470));
  await sleep(3000);
  s = await st();
  const done = await page.evaluate(() => window.__ss.op.ch1PartyNow.done.photo);
  g.check("#46 a kid who joins at the count and steps out after the photo is in it and never seen", done === true && !s.alarm, { s, done });
  g.check("no page errors (photo, by touch)", errors.length === 0, errors);
}

// ---------- the vent's suction ----------
{
  const { page, errors } = await open("party:P2");
  const r = await page.evaluate((V) => {
    const ss = window.__ss,
      n = ss.op;
    for (let i = 0; i < 60 * 4; i++) {
      n.sq.x = V.x + 30;
      n.sq.y = V.y - 10;
      ss.tick(1 / 60);
      if (window.SSQ.beat("ch1-party").now().sound.played.includes("suction")) break;
    }
    return window.SSQ.beat("ch1-party").now().sound.played;
  }, hall.HALL.vent);
  g.check("phase 4 item 8: the vent's pull is a rush of air (suction), never the squeaky slurp", r.includes("suction") && !r.includes("slurp"), r.slice(-6));
  g.check("no page errors (vent)", errors.length === 0, errors);
}

// ---------- the chase music ----------
{
  const { page, errors } = await open("party:P6");
  const r = await page.evaluate(() => {
    const ss = window.__ss,
      p = ss.op.ch1PartyNow,
      b = window.SSQ.beat("ch1-party");
    for (let i = 0; i < 20; i++) ss.tick(1 / 60);
    const before = b.now().sound;
    p.oct.mode = "chase";
    ss.tick(1 / 60);
    const during = b.now().sound;
    p.oct.mode = "snacks";
    ss.tick(1 / 60);
    const after = b.now().sound;
    return { before: [before.song, before.chase.on], during: [during.song, during.chase.on], after: [after.song, after.chase.on] };
  });
  g.check("#44 while the octopus chases him the band stops and Run Amok plays; after, the band again", r.before[0] >= 0 && !r.before[1] && r.during[0] === -1 && r.during[1] && r.after[0] >= 0 && !r.after[1], r);
  g.check("no page errors (chase)", errors.length === 0, errors);
}

// ---------- the guard's flashlight at home ----------
{
  const { page, errors } = await open("party:P7");
  const r = await page.evaluate((D) => {
    const ss = window.__ss,
      n = ss.op,
      p = () => n.ch1PartyNow;
    n.sq.x = D.x;
    n.sq.y = D.y;
    for (let i = 0; i < 60 * 20; i++) {
      ss.tick(1 / 60);
      const a = p().alarm;
      if (n.room === "closet" && a && a.homeGuard && a.homeGuard.door > 1) break;
    }
    const beam = () => (ss.drawFrame(), ss.conesDrawn().filter((c) => c.room === "closet").length);
    const searching = beam();
    p().alarm.homeGuard.held = true;
    const held = beam();
    return { room: n.room, guard: !!(p().alarm && p().alarm.homeGuard), searching, held };
  }, { x: hall.HALL_DOOR.x, y: hall.HALL_DOOR.y });
  g.check("#27 the home guard's flashlight beam shows while he searches, and is off once he stops (talking to Mops)", r.room === "closet" && r.guard && r.searching > 0 && r.held === 0, r);
  g.check("no page errors (guard)", errors.length === 0, errors);
}
await g.finish("party-phase4");
