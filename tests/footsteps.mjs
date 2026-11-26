/**
 * Footsteps only while someone actually moves, across Chapter 1 (Brian 2026-11-25, showing-5 note 9: at 2:10 of the
 * keep-going video boots kept sounding while the guard stood still at home talking to Mops). The game is ticked by
 * hand at phone size; every frame the test notes where everyone who walks is (its own reading of the game state,
 * not the footstep code's), and each time a footstep sound plays it checks that someone in the room Squatch is in
 * moved in the frame before:
 *   - the FUR alarm (P7): the guards walking the hall, the guard who follows him home, his search, Mops sending him
 *     off (they stand and talk: no footsteps), the guard leaving;
 *   - closing time (P8b): the guests walking out;
 *   - the morning: Mops's hooves as he walks out.
 *   node tests/footsteps.mjs
 */
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9466, name: "footsteps" });
const { footfall } = await import(join(root, "src", "modules", "footfalls.js"));

// ---------- the rule itself ----------
{
  const w = {};
  let n = 0;
  for (let i = 0; i < 60; i++) footfall(w, 100, 100, 1 / 60, 0.3) && n++;
  const standing = n;
  for (let i = 0; i < 60; i++) footfall(w, 100 + i * 2, 100, 1 / 60, 0.3) && n++;
  g.check("the footfall rule: standing a second sounds nothing; walking a second sounds about one every 0.3 s", standing === 0 && n - standing >= 3 && n - standing <= 4, { standing, walking: n - standing });
}

// Every frame: where each walker in Squatch's room is (game positions), read from the game state.
const WALKERS = `(n) => {
  const p = n.ch1PartyNow, out = {};
  if (p && p.scene && p.scene !== "done") {
    const a = p.alarm;
    if (n.room === "hall") {
      a && a.guards.forEach((g, i) => g.room === "hall" && (out["guard" + i] = [g.x, g.y]));
      a && (out.witness = [a.w.x, a.w.y]);
      Object.entries(p.people || {}).forEach(([id, g]) => (out[id] = [g.x, g.y]));
      p.isfred && (out.isfred = [p.isfred.x, p.isfred.y]);
      (p.bandAt || []).forEach((b, i) => (out["band" + i] = [b.x, b.y]));
      p.bartenderAt && (out.bartender = [p.bartenderAt.x, p.bartenderAt.y]);
      p.mops && (out.mopsHall = [p.mops.x, p.mops.y]);
    }
    if (n.room === "closet") {
      a && a.homeGuard && (out.homeGuard = [a.homeGuard.x, a.homeGuard.y]);
      n.moPose !== "hidden" && (out.mops = [n.mo.x, n.mo.y]);
    }
  } else n.room === "closet" && (out.mops = [n.mo.x, n.mo.y]);
  return out;
}`;
// Ticks the game `secs` (1/60 s a frame), tapping NEXT on any line after 0.6 s; `act(n, p)` runs each frame (the
// kid's moves). Returns every footstep sound with whether someone in the room had just moved.
const play = (page, secs, act, sound) =>
  page.evaluate(
    `(() => {
    const walkers = ${WALKERS}, act = ${act};
    const ss = window.__ss, n = ss.op, out = [];
    let before = walkers(n), up = 0;
    const heard = () => ${sound};
    let count = heard().length;
    for (let i = 0; i < ${Math.round(secs * 60)}; i++) {
      act(n, n.ch1PartyNow);
      n.cur && ["bub", "card", "wait", "panel"].includes(n.cur.k) ? (up += 1 / 60) : (up = 0);
      up > 0.6 && ((n.bt = 1), ss.opTap(), (up = 0));
      ss.tick(1 / 60);
      const now = walkers(n), h = heard();
      const moved = Object.keys(now).filter((k) => before[k] && Math.hypot(now[k][0] - before[k][0], now[k][1] - before[k][1]) > 0.2);
      // (the footstep is decided from the frame before: whoever walked then)
      for (let k = count; k < h.length; k++) out.push({ i, room: n.room, moved: out.lastMoved || [], movedNow: moved, what: h[k].name || h[k], scene: n.ch1PartyNow && n.ch1PartyNow.scene, alarm: n.ch1PartyNow && n.ch1PartyNow.alarm && n.ch1PartyNow.alarm.phase });
      out.lastMoved = moved;
      count = h.length;
      before = now;
      if (window.__stop && window.__stop(n)) break;
    }
    return out.filter((x) => typeof x === "object" && x.i != null);
  })()`,
  );
const partySteps = "window.SSQ.beat('ch1-party').now() ? window.SSQ.beat('ch1-party').now().sound.played.filter((x) => x === 'step').map((x) => ({ name: x })) : []";

// ---------- the FUR alarm and the guard at home (P7) ----------
{
  const { page, errors } = await g.open("?beat=party:P7", PHONE);
  await sleep(1400);
  await page.evaluate(() => (window.requestAnimationFrame = () => 0));
  // The kid: waits a few seconds while the guards walk the hall, then heads for his door, home, under the bed (as
  // soon as he can), and waits there through Mops and the guard's talk until the card.
  await page.evaluate(() => {
    window.__t = 0;
    window.__stop = (n) => !!(n.ch1PartyNow && n.ch1PartyNow.card);
  });
  const act = `(n, p) => {
    window.__t += 1 / 60;
    if (!n.ctrl || n.cur || !p) return;
    if (n.room === "hall" && window.__t > 3) { n.sq.x = 477; n.sq.y = 592; }
    if (n.room === "closet" && p.pose !== "bed") { const s = window.SSQ.beat("ch1-party").spots().find((q) => q.id === "hidebed"); s && s.f(); }
  }`;
  const steps = await play(page, 70, act, partySteps);
  const st = await page.evaluate(() => ({ card: !!window.SSQ.beat("ch1-party").now().card }));
  // (only a guard's feet make these footsteps: a guest milling past does not count)
  const bad = steps.filter((s) => !s.moved.some((k) => k.startsWith("guard") || k === "homeGuard"));
  g.check("the alarm and the guard at home: footsteps were heard (the guards walking)", steps.length >= 3, steps.length);
  g.check("the alarm and the guard at home: every footstep came while someone in the room walked (none while Mops and the guard stood talking)", st.card && bad.length === 0, { card: st.card, bad: bad.slice(0, 6), heard: steps.length });
  g.check("no page errors (alarm)", errors.length === 0, errors);
}

// ---------- closing time (P8b): everyone walks out ----------
{
  const { page, errors } = await g.open("?beat=party:P8b", PHONE);
  await sleep(1400);
  await page.evaluate(() => {
    window.requestAnimationFrame = () => 0;
    window.__stop = (n) => !!(n.ch1PartyNow && n.ch1PartyNow.close && n.ch1PartyNow.close.phase === "mops");
  });
  const steps = await play(page, 60, "() => {}", partySteps);
  const bad = steps.filter((s) => !s.moved.length);
  g.check("closing time: footsteps were heard (the guests walking out)", steps.length >= 3, steps.length);
  g.check("closing time: every footstep came while a guest walked", bad.length === 0, bad.slice(0, 6));
  g.check("no page errors (closing time)", errors.length === 0, errors);
}

// ---------- the morning: Mops's hooves as he walks out ----------
{
  const { page, errors } = await g.open("?ch=1", PHONE);
  await sleep(1500);
  await page.evaluate(() => {
    window.requestAnimationFrame = () => 0;
    const ss = window.__ss,
      n = ss.op;
    for (let i = 0; i < 6000; i++) {
      const m = n.ch1Morning;
      if (m && m.step === "song" && n.ctrl && !n.cur && (ss.spotsNow() || []).some((x) => x.id === "sing")) break;
      n.cur && ["bub", "card", "wait", "cutaway", "panel"].includes(n.cur.k) && ((n.bt = 1), ss.opTap());
      ss.tick(0.05);
    }
  });
  // (the morning logs a sound only when it plays: sound on now, at the song step; with it on from the start, a step
  // that waits for a sound to finish would wait on the real clock)
  await page.click("#ss-sound").catch(() => {});
  await sleep(400);
  await page.evaluate(() => {
    const ss = window.__ss;
    const sing = (ss.spotsNow() || []).find((x) => x.id === "sing");
    window.__noSing = !sing;
    sing && sing.f();
    window.__stop = (n) => !!n.ch1Morning && n.ch1Morning.step !== "leave" && window.__left;
  });
  const act = `(n) => { n.ch1Morning && n.ch1Morning.step === "leave" && (window.__left = true); }`;
  const hooves = "(window.SSQ.morningSound.debug().log || []).filter((x) => x.name === 'hoof')";
  const steps = await play(page, 60, act, hooves);
  const bad = steps.filter((s) => !s.moved.includes("mops") && !s.movedNow.includes("mops"));
  g.check("the morning: Mops's hooves were heard as he walked out", steps.length >= 3, [steps.length, await page.evaluate(() => window.__noSing)]);
  g.check("the morning: every hoof came while Mops walked", bad.length === 0, bad.slice(0, 6));
  g.check("no page errors (morning)", errors.length === 0, errors);
}
await g.finish();
