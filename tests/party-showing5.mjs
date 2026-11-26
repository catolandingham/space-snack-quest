/**
 * Brian's decisions on party showing 5 (2026-11-25), at phone size with the game's clock stopped (only these ticks
 * move it). Each check names its note:
 *   1  the camera's tripod is out of sight until the group photo; the Croc Boys show no cones while they play on the
 *      stage, and their cones come back when they step down for the photo
 *   2  home with the flyer: "Phew, made it!", the bed glows (it is the goal), the chip, SAVE · flyer lays it on top of
 *      the bed (since 2026-11-26, #42), then his two new thoughts (the two dropped ones are not said); the party's
 *      music keeps coming through his door the whole time; in the talk he takes it from his bed
 *   3  the crowd's murmur is off while the band plays; the vent sucks a piece of his costume in (after his first
 *      minute), and still takes fur with nothing on
 *   4  the dance spot's outline shows whenever he can dance, and not while he dances
 *   5  the group photo one thing at a time: settle, pose (the crowd claps), the call (nothing else moving), the
 *      camera carried over, the rows, then the glowing gap, the chip and JOIN · photo, and not before
 *   6  a "?" starts small and pale, fills while he stays in sight, and fades once he is out of sight
 *   7  the octopus: his line, a lunge and a first hug (hat tipped, nothing off), only then Squatch's two thoughts, then
 *      the chase at OCT_SPEED with the chip and no bar, snack, dance or photo button
 *   10 once Mops has sent the guard off, the alarm is over for good: no bell, no beam, no "run home and hide!", and
 *      the card follows the guard leaving
 *   8  the alarm listening page: five options, each plays when tapped, no page errors, nothing downloaded
 *   node tests/party-showing5.mjs
 */
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { startGame, sleep, root } from "./game-page.mjs";

const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9472, name: "party-showing5" });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const lines = await import(join(root, "src", "modules", "party-lines.js"));
const oct = await import(join(root, "src", "modules", "party-octopus.js"));
const photo = await import(join(root, "src", "modules", "party-photo.js"));
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
      c = n.cur,
      beat = window.SSQ.beat("ch1-party");
    return { now: beat.now(), room: n.room, cur: c ? c.k : "", text: c && c.b ? c.b.text : "", act: n.act ? n.act.verb + " · " + n.act.cap : "", chip: n.ch1Chip || "", ctrl: !!n.ctrl, ring: n.lastRing && n.T - n.lastRing.T < 0.2 ? n.lastRing.id : "", spots: (beat.spots() || []).map((s) => s.id) };
  });
// Ticks the game (1/60 s a tick) until f(p, n) is true, tapping NEXT on any line after 0.6 s; `each(n, p)` runs every
// tick. Every line shown is kept in window.__said. Returns the seconds it took, or -1.
const run = (page, f, max = 30, each = "() => {}") =>
  page.evaluate(`(() => {
    const f = ${f}, each = ${each};
    window.__said = window.__said || [];
    let up = 0;
    for (let i = 0; i <= ${Math.round(max * 60)}; i++) {
      const n = window.__ss.op, p = n.ch1PartyNow;
      p && each(n, p);
      if (f(p, n)) return (window.__ss.drawFrame(), i / 60);
      if (n.cur && n.cur.k === "bub") {
        const t = n.cur.b.text;
        window.__said[window.__said.length - 1] !== t && window.__said.push(t);
        up += 1 / 60;
      } else up = 0;
      up > 0.6 && ((n.bt = 1), window.__ss.opTap(), (up = 0));
      window.__ss.tick(1 / 60);
    }
    window.__ss.drawFrame();
    return -1;
  })()`);
const said = (page) => page.evaluate(() => (window.__said || []).slice());
const cones = (page) => page.evaluate(() => window.SSQ.beat("ch1-party").cones().map((c) => c.id));

// ---------- 2: home with the flyer ----------
{
  const { page, errors } = await open("party:P4");
  // the flyer in his paw, straight home through his door
  await page.evaluate(() => {
    const n = window.__ss.op,
      p = n.ch1PartyNow;
    p.flyer = "paw";
    p.flyerGlow = false;
    // out of the plant, standing
    p.pose = "stand";
    n.sqPose = "stand";
  });
  const music = [];
  let t = await run(page, "(p, n) => n.room === 'closet' && n.cur && n.cur.k === 'bub'", 15, `(n) => n.room === "hall" && n.ctrl && ((n.sq.x = ${hall.HALL_DOOR.x}), (n.sq.y = ${hall.HALL_DOOR.y}))`);
  let s = await st(page);
  g.check("2: home with the flyer, the first thing he says is \"Phew, made it!\"", t >= 0 && s.text === L("sq-phew"), [t, s.text]);
  music.push(s.now.sound.song);
  t = await run(page, "(p, n) => n.ctrl && !n.cur", 6);
  await run(page, "() => false", 0.2);
  s = await st(page);
  g.check("2: then the chip \"Squatch: put the flyer on your bed for Mops\", his bed outlined (it glows), and SAVE · flyer", s.chip === L("chip-save-flyer") && s.ring === "save-flyer" && s.act === L("button-save-flyer") && s.now.flyer === "paw", [s.chip, s.ring, s.act, s.now.flyer]);
  music.push(s.now.sound.song);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  t = await run(page, "(p) => p.scene === 'P5'", 20);
  s = await st(page);
  music.push(s.now.sound.song);
  const heard = await said(page);
  g.check("2: SAVE · flyer lays it on top of the bed (Brian 2026-11-26, #42), then \"That party looked so fun...\" and \"I'll sneak back in a costume and dance!\", then P5", t >= 0 && s.now.flyer === "bed" && JSON.stringify(heard.slice(-2)) === JSON.stringify([L("sq-party-fun"), L("sq-sneak-back")]), [t, s.now.flyer, heard]);
  const flyerAt = await page.evaluate(() => window.SSQ.beat("ch1-party").flyerAt());
  g.check("2: the flyer is drawn on the bed", !!flyerAt && Math.hypot(flyerAt.x - hall.HOME_ROOM.flyer.x, flyerAt.y - hall.HOME_ROOM.flyer.y) < 1, flyerAt);
  // (the dance wish is said again since 2026-11-26, in P3 before the sneak, not at home: tests/party-showing6.mjs)
  g.check("2: the dropped lines are not said (\"I deserve one night of normal.\", \"Costume on. Then I dance!\"), and at home not the dance wish", !heard.includes(L("sq-normal")) && !heard.includes(L("sq-costume")) && !heard.includes(L("sq-dance-wish")), heard);
  g.check("2: the party's music plays the whole time he is home (muffled through his door)", music.every((m) => m >= 0) && s.now.sound.song >= 0, music);
  g.check("no page errors (2)", errors.length === 0, errors);
  await page.close();
}
// ---------- 2: in the talk he takes the flyer from the bed ----------
{
  const { page, errors } = await open("party:P8a");
  // (from its start: the page ran a moment before the clock was stopped)
  await page.evaluate(() => window.__ss.sectionReset());
  const t = await run(page, "(p) => p.flyer === 'take'", 20);
  const s = await page.evaluate(() => ({ x: window.__ss.op.sq.x, y: window.__ss.op.sq.y }));
  g.check("2: in the talk Squatch takes the flyer from his bed (he stands at the bed's front corner to take it)", t >= 0 && Math.hypot(s.x - hall.HOME_ROOM.saveAt.x, s.y - hall.HOME_ROOM.saveAt.y) < 4, [t, s]);
  g.check("no page errors (2, the talk)", errors.length === 0, errors);
  await page.close();
}

// ---------- 1, 3 (murmur), 4, 5: the party in disguise and the group photo ----------
{
  const { page, errors } = await open("party:P6");
  let s = await st(page);
  g.check("1: in the party the band plays and the Croc Boys show no cones (the stage lights are in their eyes)", s.now.bandPlaying && !(await cones(page)).some((id) => id.startsWith("band")), await cones(page));
  g.check("1: the camera's tripod is out of sight before the group photo (it comes out with the photo's camera step)", !s.now.shot && !photo.tripodOut({ shot: null }) && !photo.tripodOut({ shot: { phase: "call" } }) && photo.tripodOut({ shot: { phase: "camera" } }), s.now.shot);
  g.check("3: no crowd murmur while the band plays", s.now.sound.ambience !== "murmur", s.now.sound.ambience);
  g.check("4: the dance spot is outlined (he can dance)", await page.evaluate(() => !!window.SSQ.beat("ch1-party").now() && window.SSQ.beat("ch1-party").spots().some((q) => q.id === "dance")), null);
  // to the song's end: the photo moment, step by step
  await page.evaluate(() => {
    const p = window.__ss.op.ch1PartyNow;
    p.songT = 1e4;
    window.__ss.op.sq.x = 300;
    window.__ss.op.sq.y = 545;
  });
  const steps = [];
  await run(page, "(p) => p.shot && p.shot.phase === 'join'", 30, `(n, p) => {
    const sh = p.shot, ph = sh ? sh.phase : "";
    const cam = p.people.camera;
    const last = window.__steps = window.__steps || [];
    ph === "call" && p.bandAt && (window.__callStep = Math.max(window.__callStep || 0, p.bandAt[1].y - ${hall.CAST.band[1].y}));
    (!last.length || last[last.length - 1].ph !== ph) && last.push({ ph, chip: n.ch1Chip || "", join: window.SSQ.beat("ch1-party").spots().some((q) => q.id === "photo"), cam: [Math.round(cam.x), Math.round(cam.y)], band: p.bandAt ? p.bandAt.map((b) => Math.round(b.y)) : null, guests: Object.fromEntries(Object.entries(p.people).map(([id, q]) => [id, Math.round(q.x) + "," + Math.round(q.y)])), cones: window.SSQ.beat("ch1-party").cones().filter((c) => c.id.startsWith("band")).length, ambience: window.SSQ.beat("ch1-party").now().sound.ambience });
  }`);
  steps.push(...(await page.evaluate(() => window.__steps)));
  s = await st(page);
  const phases = steps.map((x) => x.ph).filter(Boolean);
  g.check("5: one thing at a time: settle, pose, call, camera, gather, then join", JSON.stringify(phases) === JSON.stringify(["settle", "pose", "call", "camera", "gather", "join"]), phases);
  const byPh = Object.fromEntries(steps.map((x) => [x.ph, x]));
  g.check("5: no chip and no JOIN · photo until everyone is in place", steps.filter((x) => x.ph !== "join").every((x) => !x.join && x.chip !== L("chip-join-photo")), steps.map((x) => [x.ph, x.join, x.chip]));
  // (since 2026-11-26, #46: the chip and JOIN · photo come with the 3-2-1; before it, stepping in gets him seen)
  g.check("5: everyone in place: still no chip and no JOIN · photo until the 3-2-1", s.chip !== L("chip-join-photo") && !s.spots.includes("photo"), [s.chip, s.spots]);
  await run(page, "(p) => p.shot && p.shot.phase === 'count'", 5);
  s = await st(page);
  g.check("5: then, with the 3-2-1, the gap glows, the chip reads \"Squatch: join the group photo\" and JOIN · photo is offered", s.chip === L("chip-join-photo") && s.spots.includes("photo"), [s.chip, s.spots]);
  g.check("5: nobody moves while the Croc Boy calls \"Group photo!\" and the camera tourist carries the tripod over alone", !!byPh.call && !!byPh.camera && JSON.stringify(byPh.call.guests) === JSON.stringify(byPh.camera.guests), [byPh.call && byPh.call.guests, byPh.camera && byPh.camera.guests]);
  g.check("1: the Croc Boys show no cones on the stage until they step down for the photo, then their cones come back", ["settle", "pose", "call", "camera"].every((ph) => byPh[ph] && byPh[ph].cones === 0) && !!byPh.gather && byPh.gather.cones === 3, steps.map((x) => [x.ph, x.cones]));
  g.check("5: one Croc Boy steps forward for the call (the middle one, toward the edge of the stage)", !!byPh.call && !!byPh.camera && (await page.evaluate(() => window.__callStep || 0)) > 8, await page.evaluate(() => window.__callStep));
  g.check("5: the walk to the rows is a little slower than before (125, was 150)", photo.PHOTO.walk === 125, photo.PHOTO.walk);
  // the step's own sounds: the clap at the pose
  const played = s.now.sound.played;
  g.check("5: the crowd claps when the band poses", played.includes("clap"), played.slice(-12));
  g.check("no page errors (1, 3, 4, 5)", errors.length === 0, errors);
  await page.close();
}
// ---------- 4: the dance spot's outline hides while he dances ----------
{
  const { page } = await open("party:P6");
  const ring = () => page.evaluate(() => window.SSQ.beat("ch1-party").now() && !!window.__ss.op.ch1PartyNow && !window.__ss.op.ch1PartyNow.dance && window.SSQ.beat("ch1-party").spots().some((q) => q.id === "dance"));
  const before = await ring();
  await page.evaluate((d) => ((window.__ss.op.sq.x = d.x), (window.__ss.op.sq.y = d.y + 4)), hall.DANCE_SPOT);
  await run(page, "(p, n) => n.act && n.act.verb === 'DANCE'", 3);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  await run(page, "(p) => !!p.dance", 3);
  const during = await ring();
  g.check("4: the dance spot's outline shows when he can dance, and not while he dances", before && !during, [before, during]);
  await page.close();
}

// ---------- 6: the "?" fills in, then fades ----------
{
  const { page, errors } = await open("party:P2");
  // stand him in the glancer's sight for half the look's time, then out of it
  const k = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      p = n.ch1PartyNow,
      c = window.SSQ.beat("ch1-party").cones().find((q) => q.id === "isfred") || window.SSQ.beat("ch1-party").cones()[0];
    // a point well inside that cone
    const at = { x: c.ox + Math.cos(c.a) * 120, y: c.oy + Math.sin(c.a) * 120 + 40 };
    const out = [];
    for (let i = 0; i < 30; i++) ((n.sq.x = at.x), (n.sq.y = at.y), ss.tick(1 / 60), out.push(p.qs ? JSON.parse(JSON.stringify(p.qs)) : null));
    const ids = Object.keys(p.qs || {});
    (n.sq.x = 900), (n.sq.y = 580);
    const fade = [];
    for (let i = 0; i < 60; i++) (ss.tick(1 / 60), fade.push(p.qs ? JSON.parse(JSON.stringify(p.qs)) : null));
    return { ids, first: out.find((q) => q && Object.keys(q).length), last: out[out.length - 1], fade: fade.map((q) => (q ? Object.values(q).map((v) => Math.round(v.a * 100) / 100) : [])), alarm: !!p.alarm };
  });
  const first = k.first && Object.values(k.first)[0],
    last = k.last && Object.values(k.last)[0];
  g.check("6: the \"?\" starts small and pale (fill near 0) and fills in while he stays in sight", !!first && !!last && first.k < 0.2 && last.k > first.k + 0.2 && !k.alarm, k);
  g.check("6: out of sight first, it fades away (no alarm)", !k.alarm && k.fade[0].length > 0 && k.fade[k.fade.length - 1].length === 0, k.fade.filter((_, i) => i % 6 === 0));
  g.check("no page errors (6)", errors.length === 0, errors);
  await page.close();
}

// ---------- 7: the octopus ----------
{
  const { page, errors } = await open("party:P6");
  // past his first minute, the octopus at the snacks, Squatch beside him
  await page.evaluate((o) => {
    const n = window.__ss.op,
      p = n.ch1PartyNow,
      g = p.people["octopus-guest"];
    p.ft = 70;
    g.x = o.x;
    g.y = o.y;
    p.oct = { mode: "snacks", t: 0, hugs: 0, rest: 0, said: false, arms: 0, wait: 0, ht: 0 };
    n.sq.x = o.x - 90;
    n.sq.y = o.y - 20;
  }, hall.OCTOPUS_SNACKS);
  const order = [];
  const each = `(n, p) => {
    const o = p.oct; if (!o) return;
    const last = window.__oct = window.__oct || [];
    const key = o.mode + (n.cur && n.cur.k === "bub" ? ":" + n.cur.b.text : "");
    (!last.length || last[last.length - 1].key !== key) && last.push({ key, hugs: o.hugs, chip: n.ch1Chip || "", lost: (p.lostPieces || []).length, spots: window.SSQ.beat("ch1-party").spots().map((s) => s.id), tip: o.mode === "hug" ? 1 : 0 });
  }`;
  const t = await run(page, "(p, n) => p.oct && p.oct.mode === 'chase' && n.ctrl && !n.cur", 20, each);
  const seen = await page.evaluate(() => window.__oct);
  const keys = seen.map((x) => x.key);
  const iHic = keys.findIndex((k) => k.endsWith(L("octopus-hic"))),
    iLunge = keys.indexOf("lunge"),
    iHug = keys.indexOf("hug"),
    iArms = keys.findIndex((k) => k.endsWith(L("sq-arms"))),
    iJuke = keys.findIndex((k) => k.endsWith(L("sq-juke"))),
    iChase = keys.indexOf("chase");
  g.check("7: \"*hic* Fellow tourist!\", then the lunge, then a first hug, then \"Those arms...\" and \"I gotta juke this fool.\", then the chase", t >= 0 && iHic >= 0 && iHic < iLunge && iLunge < iHug && iHug < iArms && iArms < iJuke && iJuke < iChase, keys);
  g.check("7: the first hug knocks nothing off", seen.every((x) => x.lost === 0), seen.map((x) => [x.key, x.lost]));
  const chase = seen[iChase];
  g.check("7: during the chase the chip reads \"Squatch: get away from the octopus!\" and there is no bar, snack, dance or photo button", !!chase && chase.chip === L("chip-octopus") && !chase.spots.some((id) => ["snacks", "dance", "photo"].includes(id)), chase);
  g.check("7: the octopus chases nearly as fast as Squatch walks (170 against his 190)", oct.OCT_SPEED === 170, oct.OCT_SPEED);
  // after the chase: the chip is gone
  const t2 = await run(page, "(p) => p.oct && (p.oct.mode === 'bored' || p.oct.mode === 'back')", 25, "(n) => { n.sq.x = 150 + (Math.floor(window.__ss.op.T * 0.5) % 2) * 600; n.sq.y = 480; }");
  await run(page, "() => false", 0.5);
  const s = await st(page);
  g.check("7: when the chase is over the chip is gone", t2 >= 0 && s.chip !== L("chip-octopus"), [t2, s.chip]);
  g.check("no page errors (7)", errors.length === 0, errors);
  await page.close();
}

// ---------- 3: the vent and his costume ----------
{
  const { page, errors } = await open("party:P6");
  await page.evaluate((v) => {
    const n = window.__ss.op;
    n.ch1PartyNow.ft = 70;
    n.sq.x = v.x + 30;
    n.sq.y = v.y - 10;
  }, hall.HALL.vent);
  const t = await run(page, "(p) => (p.lostPieces || []).length > 0", 4, `(n) => ((n.sq.x = ${hall.HALL.vent.x + 30}), (n.sq.y = ${hall.HALL.vent.y - 10}))`);
  const s = await st(page);
  g.check("3: in costume, staying by the vent it sucks a piece in (his hat first), and no alarm", t >= 0 && s.now.gone[0] === "head" && !s.now.alarm, [t, s.now.gone, s.now.alarm]);
  g.check("no page errors (3, the vent)", errors.length === 0, errors);
  await page.close();
}
{
  const { page } = await open("party:P6");
  await page.evaluate((v) => {
    const n = window.__ss.op;
    n.ch1PartyNow.ft = 10;
    n.sq.x = v.x + 30;
    n.sq.y = v.y - 10;
  }, hall.HALL.vent);
  await run(page, "() => false", 3, `(n) => ((n.sq.x = ${hall.HALL.vent.x + 30}), (n.sq.y = ${hall.HALL.vent.y - 10}))`);
  const s = await st(page);
  g.check("3: in his first minute the vent takes nothing", s.now.gone.length === 0, s.now.gone);
  await page.close();
}

// ---------- 10: the alarm is over for good once Mops has sent the guard off ----------
{
  const { page, errors } = await open("party:P7");
  await run(page, "(p, n) => n.room === 'closet' && n.ctrl && n.act && n.act.verb === 'HIDE'", 15, `(n) => window.__ss.tapAt(${hall.SPOTS.doorway.x}, ${hall.SPOTS.doorway.y + 15})`);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  // the last line of their talk, "You know I don't have opposable thumbs."
  let t = await run(page, `(p, n) => n.cur && n.cur.k === "bub" && n.cur.b.text === ${JSON.stringify(L("mops-thumbs"))}`, 40);
  g.check("(Mops comes in and they talk)", t >= 0, t);
  await page.evaluate(() => (window.__bells = 0));
  // from the guard leaving until the card: what plays, what shows
  const after = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      out = { chips: new Set(), beams: 0, bells: 0, steps: 0, frames: 0 };
    (n.bt = 1), ss.opTap();
    const heard0 = window.SSQ.beat("ch1-party").now().sound.played.length;
    if (heard0 >= 290) return { tooLong: heard0 };
    for (let i = 0; i < 60 * 20 && !(n.ch1PartyNow && n.ch1PartyNow.card); i++) {
      ss.tick(1 / 60);
      out.frames++;
      out.chips.add(n.ch1Chip || "");
      const p = n.ch1PartyNow;
      if (p && p.alarm && p.alarm.homeGuard && !p.alarm.over) out.notOver = true;
    }
    const played = window.SSQ.beat("ch1-party").now().sound.played;
    return { chips: [...out.chips], card: !!(n.ch1PartyNow && n.ch1PartyNow.card), alarmNow: n.ch1PartyNow && n.ch1PartyNow.alarm, played: played.slice(heard0), notOver: !!out.notOver, frames: out.frames, heard0 };
  });
  g.check("10: after Mops sends the guard off the alarm is over: no \"run home and hide!\" while the guard leaves, and the card follows", after.card && !after.chips.includes(L("chip-run")) && !after.notOver, after);
  g.check("10: no bell rings again once the guard has been sent off (his footsteps as he walks out, then the door)", !after.tooLong && !after.played.includes("bell") && !after.played.includes("alarm") && after.played.includes("door"), after.played);
  // past the card ("Keep going"): the talk at home; nothing rings, nobody comes back, no chip to run
  const later = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    window.SSQ.beat("ch1-party").cardChoose("keep");
    const from = window.SSQ.beat("ch1-party").now().sound.played.length,
      chips = new Set();
    let alarm = false;
    for (let i = 0; i < 60 * 8; i++) (n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap()), ss.tick(1 / 60), chips.add(n.ch1Chip || ""), n.ch1PartyNow && n.ch1PartyNow.alarm && (alarm = true));
    const now = window.SSQ.beat("ch1-party").now();
    return { played: now ? now.sound.played.slice(from) : [], chips: [...chips], alarm };
  });
  g.check("10: after the card (\"Keep going\"), nothing restarts the alarm: no bell, no guard, no \"run home and hide!\"", !later.alarm && !later.played.includes("bell") && !later.played.includes("alarm") && !later.chips.includes(L("chip-run")), later);
  g.check("no page errors (10)", errors.length === 0, errors);
  await page.close();
}

// ---------- 8: the alarm listening page ----------
{
  const page = await g.browser.newPage();
  const errs = [],
    requests = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("request", (r) => requests.push(r.url()));
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(pathToFileURL(join(root, "tools", "alarm-choices.html")).href);
  const r = await page.evaluate(async () => {
    const b = [...document.querySelectorAll("button")];
    for (const x of b) (x.click(), await new Promise((ok) => setTimeout(ok, 80)));
    return { n: b.length, names: b.map((x) => x.querySelector(".name").textContent), wide: document.documentElement.scrollWidth };
  });
  g.check("8: the alarm page has five options, each with a short name, and plays each with no page error", r.n === 5 && errs.length === 0, { ...r, errs });
  g.check("8: the alarm page loads nothing from anywhere (no downloads)", requests.every((u) => u.startsWith("file:")), requests);
  g.check("8: the alarm page fits a phone (no sideways scroll)", r.wide <= 375, r.wide);
  await page.close();
}
await g.finish();
