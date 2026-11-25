/**
 * At home after the party (Brian's notes on the showing-4 videos, 2026-11-25; src/modules/party-alarm.js,
 * party-after-alarm.js, party-talk.js), at phone size with the game's clock stopped (only these ticks move it):
 *   - The guard who follows him home finds him only with his flashlight's beam: standing in the room out of the beam,
 *     even close behind the guard, he is not seen, and he need not be under the bed when the guard walks in. The
 *     guard looks round (and the other way) until Squatch is under the bed; standing in the beam he is caught.
 *   - Mops sends the guard off before the card: the guard steps aside to the back, Mops comes in along the front;
 *     their drawn bodies never overlap, from Mops's first step in until the guard is out of the door.
 *   - The talk (both endings): Squatch fetches the flyer and comes to the middle of the room without ever being drawn
 *     over Mops (he goes round the back of the room when Mops is in the way); the flyer is in his paw from then on,
 *     and held up for "But look. Robots are coming to do your job.".
 * Stills go to tests/out/party-stills/ (home-*.png).
 *   node tests/party-home.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9455, name: "party-home" });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const after = await import(join(root, "src", "modules", "party-after-alarm.js"));
const lines = await import(join(root, "src", "modules", "party-lines.js"));
const L = (id) => lines.partyLine(id);

async function open(beat) {
  const o = await g.open("?beat=" + beat, PHONE);
  await sleep(1400);
  await o.page.evaluate(() => (window.requestAnimationFrame = () => 0));
  return o;
}
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur;
    return { now: window.SSQ.beat("ch1-party").now(), room: n.room, cur: c ? c.k : "", text: c && c.b ? c.b.text : "", act: n.act ? n.act.verb + " · " + n.act.cap : "", sq: { x: n.sq.x, y: n.sq.y, f: n.sq.f }, mo: { x: n.mo.x, y: n.mo.y, f: n.mo.f, pose: n.moPose }, sqPose: n.sqPose };
  });
// Ticks the game (1/60 s each) until f(p, n) is true, tapping NEXT on any line after `tapAfter` seconds of it being
// up (a kid reads it); `each(n)` runs every tick. Returns the seconds it took, or -1.
const run = (page, f, max = 30, each = "() => {}") =>
  page.evaluate(`(() => {
    const f = ${f}, each = ${each};
    let up = 0;
    for (let i = 0; i <= ${Math.round(max * 60)}; i++) {
      const n = window.__ss.op, p = n.ch1PartyNow;
      if (f(p, n)) return (window.__ss.drawFrame(), i / 60);
      each(n);
      n.cur && n.cur.k === "bub" ? (up += 1 / 60) : (up = 0);
      up > 0.6 && (window.__ss.opTap(), (up = 0));
      window.__ss.tick(1 / 60);
    }
    window.__ss.drawFrame();
    return -1;
  })()`);
const still = async (page, name) => (await page.evaluate(() => window.__ss.drawFrame()), page.screenshot({ path: join(OUT, name + ".png") }));
// One character's drawn box (game positions) relative to his feet, by drawing the frame with him and without him.
const boxOf = (page, who) =>
  page.evaluate((who) => {
    const n = window.__ss.op,
      c = document.querySelector("canvas"),
      k = c.width / 960,
      x = c.getContext("2d"),
      grab = () => (window.__ss.drawFrame(), x.getImageData(0, 0, c.width, c.height).data),
      a = grab(),
      g = n.ch1PartyNow.alarm && n.ch1PartyNow.alarm.homeGuard,
      feet = who === "mops" ? { x: n.mo.x, y: n.mo.y, f: n.mo.f } : who === "sq" ? { x: n.sq.x, y: n.sq.y, f: n.sq.f || 1 } : { x: g.x, y: g.y, f: Math.cos(g.a) < 0 ? -1 : 1 };
    if (who === "mops") n.moPose = "hidden";
    else if (who === "sq") n.sq.x += 2000;
    else g.x += 2000;
    const b = grab();
    if (who === "mops") n.moPose = "stand";
    else if (who === "sq") n.sq.x -= 2000;
    else g.x -= 2000;
    let x0 = 1e9,
      x1 = -1e9,
      y0 = 1e9,
      y1 = -1e9;
    for (let i = 0; i < a.length; i += 4)
      if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 40) {
        const p = i / 4,
          px = (p % c.width) / k,
          py = Math.floor(p / c.width) / k;
        ((x0 = Math.min(x0, px)), (x1 = Math.max(x1, px)), (y0 = Math.min(y0, py)), (y1 = Math.max(y1, py)));
      }
    // (as if he faced right: mirrored when he faces left)
    const r = feet.f < 0 ? { x0: feet.x - x1, x1: feet.x - x0 } : { x0: x0 - feet.x, x1: x1 - feet.x };
    return { ...r, y0: y0 - feet.y, y1: y1 - feet.y, f: feet.f };
  }, who);
const placeBox = (b, x, y, f) => (f < 0 ? { x0: x - b.x1, x1: x - b.x0, y0: y + b.y0, y1: y + b.y1 } : { x0: x + b.x0, x1: x + b.x1, y0: y + b.y0, y1: y + b.y1 });
const overlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));

// ---------- the guard at home: only his beam finds him ----------
{
  const { page, errors } = await open("party:P7");
  // straight home (P7 restart: the alarm ringing), then stand in the room, not under the bed
  await page.evaluate((d) => window.__ss.tapAt(d.x, d.y + 15), hall.SPOTS.doorway);
  let t = await run(page, "(p, n) => n.room === 'closet' && n.ctrl", 15, `(n) => window.__ss.tapAt(${hall.SPOTS.doorway.x}, ${hall.SPOTS.doorway.y + 15})`);
  g.check("(he runs home through his door)", t >= 0, t);
  // he stands in the room, not under the bed, out of the beam while the guard walks in and looks round
  await page.evaluate(() => ((window.__ss.op.sq.x = 300), (window.__ss.op.sq.y = 420)));
  t = await run(page, "(p) => p.alarm && p.alarm.homeGuard && p.alarm.homeGuard.sweep > 0.2", 8);
  let s = await st(page);
  g.check("the guard walks in while Squatch is still standing in the room (not under the bed), and has not caught him", t >= 0 && s.now.pose === "stand" && s.now.alarm === "home", [t, s.now.pose, s.now.alarm]);
  // now he stands close behind the guard (the old rule saw anyone within 70 whichever way the guard faced)
  const spot = { x: s.now.homeGuard.x + 55, y: s.now.homeGuard.y + 20 };
  await page.evaluate((q) => ((window.__ss.op.sq.x = q.x), (window.__ss.op.sq.y = q.y)), spot);
  await run(page, "() => false", 0.3);
  s = await st(page);
  const gd = s.now.homeGuard;
  g.check("standing close behind him, within 70 but out of his beam: not seen", !gd.sees && Math.hypot(gd.x - spot.x, gd.y - spot.y) < 70 && s.now.alarm === "home", [gd, spot]);
  await still(page, "home-1-out-of-the-beam");
  // then he hides under the bed while the guard looks the other way
  const hid = await run(page, "(p, n) => n.act && n.act.verb === 'HIDE' && !(p.alarm.homeGuard && p.alarm.homeGuard.sees)", 3);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  t = await run(page, "(p) => p.pose === 'bed' || (p.alarm && p.alarm.phase === 'caught')", 6);
  s = await st(page);
  g.check("HIDE · bed is still offered and takes him under the bed (no catch)", hid >= 0 && t >= 0 && s.now.pose === "bed" && s.now.alarm !== "caught", [hid, t, s.now.pose, s.now.alarm]);
  g.check("no page errors (the beam)", errors.length === 0, errors);
  await page.close();
}
{
  // standing still out of the beam, the guard turns and looks the other way: he is caught in the end
  const { page } = await open("party:P7");
  await page.evaluate((d) => window.__ss.tapAt(d.x, d.y + 15), hall.SPOTS.doorway);
  await run(page, "(p, n) => n.room === 'closet' && n.ctrl", 15, `(n) => window.__ss.tapAt(${hall.SPOTS.doorway.x}, ${hall.SPOTS.doorway.y + 15})`);
  await page.evaluate((s) => ((window.__ss.op.sq.x = s.x), (window.__ss.op.sq.y = s.y)), { x: hall.HOME_ROOM.guardLook.x + 60, y: hall.HOME_ROOM.guardLook.y + 30 });
  const t = await run(page, "(p, n) => (p && p.alarm && p.alarm.phase === 'caught') || (n.cur && n.cur.id === 'jail')", 20);
  const s = await st(page);
  g.check("standing still where the guard first could not see him, he looks round the other way and catches him (the guard never just leaves him standing there)", t >= 0, [t, s.now && s.now.alarm, s.now && s.now.homeGuard]);
  await page.close();
}

// ---------- Mops sends the guard off: never drawn over each other ----------
{
  const { page, errors } = await open("party:P7");
  await page.evaluate((d) => window.__ss.tapAt(d.x, d.y + 15), hall.SPOTS.doorway);
  await run(page, "(p, n) => n.room === 'closet' && n.ctrl && n.act && n.act.verb === 'HIDE'", 15, `(n) => window.__ss.tapAt(${hall.SPOTS.doorway.x}, ${hall.SPOTS.doorway.y + 15})`);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  let t = await run(page, "(p, n) => n.moPose === 'stand' && n.mo.x < 940", 20);
  g.check("under the bed, once the guard has looked round, Mops comes in", t >= 0, t);
  // their drawn boxes, measured once each (feet-relative), then followed every tick until the guard is gone
  await run(page, "(p, n) => n.cur && n.cur.k === 'bub'", 10);
  // (the guard's own box from how tall the home room draws him, not measured: his beam is drawn with him)
  const tall = (await st(page)).now.homeGuard.tall,
    gb = { x0: -0.32 * tall, x1: 0.32 * tall, y0: -tall, y1: 6 },
    mb = await boxOf(page, "mops");
  await still(page, "home-2-guard-and-mops-talk");
  const worst = await page.evaluate(
    ([gb, mb]) => {
      const place = (b, x, y, f) => (f < 0 ? { x0: x - b.x1, x1: x - b.x0, y0: y + b.y0, y1: y + b.y1 } : { x0: x + b.x0, x1: x + b.x1, y0: y + b.y0, y1: y + b.y1 }),
        over = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
      let most = 0,
        at = null,
        up = 0,
        n = window.__ss.op;
      for (let i = 0; i < 60 * 60; i++) {
        const p = n.ch1PartyNow,
          g = p && p.alarm && p.alarm.homeGuard;
        if (!g) break;
        if (n.moPose === "stand") {
          const o = over(place(gb, g.x, g.y, Math.cos(g.a) < 0 ? -1 : 1), place(mb, n.mo.x, n.mo.y, n.mo.f || -1));
          o > most && ((most = o), (at = { g: [Math.round(g.x), Math.round(g.y)], m: [Math.round(n.mo.x), Math.round(n.mo.y)] }));
        }
        n.cur && n.cur.k === "bub" ? (up += 1 / 60) : (up = 0);
        up > 0.6 && (window.__ss.opTap(), (up = 0));
        window.__ss.tick(1 / 60);
      }
      return { most, at };
    },
    [gb, mb],
  );
  g.check("Mops and the guard are never drawn over each other, from the talk until the guard is out of the door (box overlap 0)", worst.most === 0, [worst, gb, mb]);
  t = await run(page, "(p) => !!p.card", 10);
  g.check("then, Squatch still under the bed, the card", t >= 0);
  g.check("no page errors (Mops and the guard)", errors.length === 0, errors);
  await page.close();
}
// The guard's way in, aside and out, and Mops's way in, checked from the numbers too: the guard steps aside to the
// back of the room and Mops comes in along the front, and both lanes are further apart than either is tall below his
// feet / above his head.
g.check("the guard waits at the back, Mops comes in along the front", after.AFTER_SPOTS.guardAside.y < 400 && after.AFTER_SPOTS.mopsPast.y > 560 && after.AFTER_SPOTS.mopsTalk.y > 560);

// ---------- the talk: Squatch fetches the flyer without walking through Mops ----------
for (const beat of ["party:P8a", "party:P8b"]) {
  const { page, errors } = await open(beat);
  if (beat === "party:P8b") {
    // closing time: everyone leaves, Mops comes in, the kid does nothing, Mops walks over, they go home together
    const t = await run(page, "(p, n) => n.room === 'closet'", 120);
    g.check("(closing time: they walk home together)", t >= 0, t);
  }
  // their drawn boxes, measured once both stand in the room (feet-relative), then followed every tick
  await run(page, "(p, n) => n.room === 'closet' && n.moPose === 'stand' && n.sqPose === 'stand' && n.sq.x < 860 && n.mo.x < 930", 20);
  const mb = await boxOf(page, "mops"),
    sb = await boxOf(page, "sq");
  const res = await page.evaluate(
    ([mb, sb]) => {
      const place = (b, x, y, f) => (f < 0 ? { x0: x - b.x1, x1: x - b.x0, y0: y + b.y0, y1: y + b.y1 } : { x0: x + b.x0, x1: x + b.x1, y0: y + b.y0, y1: y + b.y1 }),
        over = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
      const n = window.__ss.op;
      let most = 0,
        at = null,
        up = 0,
        paw = null,
        upHeld = null,
        robotsLine = false;
      for (let i = 0; i < 60 * 90; i++) {
        const p = n.ch1PartyNow;
        // (until Mops stands beside him to look at him: from then on Mops steps close on purpose, to lift the hat)
        if (!p || p.scene === "done" || p.costumeLook) break;
        // (walking in together through the door they start side by side: count from once both are in the room)
        if (n.room === "closet" && n.moPose === "stand" && n.sqPose === "stand" && n.sq.x < 880) {
          const o = over(place(mb, n.mo.x, n.mo.y, n.mo.f || -1), place(sb, n.sq.x, n.sq.y, n.sq.f || 1));
          o > most && ((most = o), (at = { m: [Math.round(n.mo.x), Math.round(n.mo.y)], s: [Math.round(n.sq.x), Math.round(n.sq.y)] }));
        }
        p.flyer === "paw" && paw == null && (paw = i / 60);
        n.cur && n.cur.k === "bub" ? (up += 1 / 60) : (up = 0);
        up > 0.6 && (window.__ss.opTap(), (up = 0));
        window.__ss.tick(1 / 60);
      }
      // on to his worry: the flyer is held up while he says it
      for (let i = 0; i < 60 * 60; i++) {
        const p = n.ch1PartyNow;
        if (!p || p.scene === "done") break;
        if (n.cur && n.cur.k === "bub" && n.cur.b.text === "But look. Robots are coming to do your job.") {
          robotsLine = true;
          upHeld = { up: p.flyerUp, flyer: p.flyer, over: over(place(mb, n.mo.x, n.mo.y, n.mo.f || -1), place(sb, n.sq.x, n.sq.y, n.sq.f || 1)) };
          break;
        }
        n.cur && n.cur.k === "bub" ? (up += 1 / 60) : (up = 0);
        up > 0.6 && (window.__ss.opTap(), (up = 0));
        window.__ss.tick(1 / 60);
      }
      return { most, at, paw, robotsLine, upHeld };
    },
    [mb, sb],
  );
  await still(page, "home-3-" + beat.slice(6) + "-flyer-held-up");
  g.check(`${beat}: Squatch fetches the flyer and comes to the middle of the room without being drawn over Mops`, res.most === 0, res);
  g.check(`${beat}: the flyer is in his paw before the talk, and held up for "${L("sq-robots-coming")}"`, res.paw != null && res.robotsLine && res.upHeld.flyer === "paw" && res.upHeld.up >= 1, res);
  g.check(`${beat}: after the hat Mops has stepped back: they are not drawn over each other while Squatch shows him the flyer`, res.robotsLine && res.upHeld.over === 0, res.upHeld);
  g.check(`no page errors (${beat})`, errors.length === 0, errors);
  await page.close();
}
// ---------- going home early (Brian 2026-11-25) ----------
// In the party in disguise his own door takes him home (once he has walked away from it); the party ends with the
// same card. "Back to the party": out again, the party carrying on. "Keep going": at home, OPEN · closet takes the
// costume off, Mops comes home after closing, and the talk (a pat: nothing on his head).
const goHomeEarly = async (page) => {
  const D = hall.HALL_DOOR;
  // away from his door first, then back to it (a tap each tick, as a kid's finger stays down)
  await run(page, "(p, n) => Math.hypot(n.sq.x - 480, n.sq.y - 450) < 20", 8, "() => window.__ss.tapAt(480, 450)");
  return run(page, "(p) => !!p.card", 15, `() => window.__ss.tapAt(${D.x}, ${D.y + 20})`);
};
{
  const { page, errors } = await open("party:P6");
  const t0 = await run(page, "(p, n) => n.room === 'closet'", 1, `() => 0`);
  g.check("walking in from his door the party does not send him straight home (he is just inside it)", t0 < 0 && (await st(page)).room === "hall");
  await run(page, "() => false", 2);
  let s = await st(page);
  const song = [s.now.song, s.now.songT];
  const t = await goHomeEarly(page);
  s = await st(page);
  g.check("through his own door in the party: he walks home, and the same card shows", t >= 0 && s.room === "closet" && !!s.now.card && s.now.scene === "P6", [t, s.room, s.now.card]);
  await still(page, "home-4-home-early-card");
  await page.evaluate(() => window.SSQ.beat("ch1-party").cardChoose("back"));
  const back = await run(page, "(p, n) => n.room === 'hall' && p.scene === 'P6' && n.ctrl", 12);
  s = await st(page);
  g.check("\"Back to the party\": he walks back out, and the party carries on from where it was", back >= 0 && s.now.song === song[0] && s.now.songT >= song[1] && s.now.songT < song[1] + 8, [back, song, s.now.song, s.now.songT]);
  // walking back in, he lands just inside his door: it does not take him home again until he has walked away
  const again = await run(page, "(p, n) => n.room === 'closet'", 3);
  g.check("back in the hall, standing just inside his door does not send him home again", again < 0, again);
  // home again, and "Keep going"
  await goHomeEarly(page);
  await page.evaluate(() => window.SSQ.beat("ch1-party").cardChoose("keep"));
  let k = await run(page, "(p, n) => p.scene === 'P8c' && n.ctrl && n.act && n.act.verb === 'OPEN'", 6, `() => window.__ss.tapAt(${120}, ${420})`);
  s = await st(page);
  g.check("\"Keep going\": at home, the party over for him (P8c); at his closet the button is OPEN · closet", k >= 0 && s.now.scene === "P8c" && s.act === "OPEN · closet" && s.mo.pose === "hidden", [k, s.now.scene, s.act, s.mo]);
  const ring = await run(page, "(p, n) => n.lastRing && n.lastRing.id === 'undress'", 2);
  g.check("the closet is outlined (the one thing to do)", ring >= 0);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  k = await run(page, "(p) => p.costumeOffT != null", 6);
  s = await st(page);
  g.check("OPEN · closet: the costume comes off into the closet (nothing worn), and Mops is not home yet", k >= 0 && Object.values(s.now.worn).every((v) => !v) && s.mo.pose === "hidden", [s.now.worn, s.mo]);
  await still(page, "home-5-costume-off");
  const mopsIn = await run(page, "(p, n) => n.moPose === 'stand'", 30);
  const lines = [];
  await run(page, "(p, n) => !p || p.scene === 'done' || (p.lift && p.lift.k > 0.5)", 60, "(n) => n.cur && n.cur.k === 'bub' && window.__homeLines.push(n.cur.b.text)".replace("window.__homeLines.push", "(window.__homeLines = window.__homeLines || []).push"));
  s = await st(page);
  const heard = await page.evaluate(() => [...new Set(window.__homeLines || [])]);
  g.check("Mops comes home after closing time, and the talk: \"You went to the party.\" first, with the flyer in Squatch's paw", mopsIn >= 0 && heard[0] === L("mops-went") && heard.includes(L("mops-have-me")) && s.now.flyer === "paw", [mopsIn, heard, s.now.flyer]);
  g.check("nothing on his head: Mops pats him (nothing lifted)", !!s.now.lift && s.now.lift.id === "", s.now.lift);
  await still(page, "home-6-home-early-pat");
  g.check("no page errors (home early)", errors.length === 0, errors);
  await page.close();
}
{
  // keeping the costume on, Mops still comes home; and ↺ in P8c starts it over at home in costume
  const { page } = await open("party:P8c");
  let s = await st(page);
  g.check("P8c's restart: at home, in his costume, Mops not home, the closet offered", s.now.scene === "P8c" && s.room === "closet" && Object.values(s.now.worn).some(Boolean) && s.mo.pose === "hidden", [s.now.scene, s.now.worn, s.mo]);
  // (Mops's coming home starts the talk: Squatch first fetches the flyer, then Mops walks in)
  const t = await run(page, "(p) => p.mopsComing", 25);
  // (P8c's own clock: the page ran a moment in real time before the test took over the ticks)
  const at = await page.evaluate(() => window.__ss.op.ch1PartyNow.mopsT);
  const inAt = await run(page, "(p, n) => n.moPose === 'stand'", 15);
  g.check("he keeps the costume on: Mops comes home all the same (15 seconds into P8c, a placeholder; he walks in once Squatch has the flyer)", t >= 0 && at >= 15 && at < 15.2 && inAt >= 0, [t, at, inAt]);
  await page.close();
}
await g.finish("party-home");
