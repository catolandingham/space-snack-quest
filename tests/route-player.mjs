/**
 * Plays a route file (tests/routes/*.json) through the game's real input path. Not a suite itself
 * (run-all.mjs skips it). Used by tests/ch1-playthrough.mjs and tests/ch2-playthrough.mjs (keys) and
 * tests/phone-tap.mjs (touch).
 *
 * The player never writes to the game. It reads window.__ss only to steer (where am I, what does the
 * button say, which way is Rusty walking, are the bots close) and to check, the way a player watches
 * the screen.
 *
 * Step kinds in a route:
 *   next  press "next line" until the player has control (and, if given, the phase or panel shows)
 *   walk  push toward a point until the button reads the "until" words (or the point is reached)
 *   act   do the action once the button reads these words ("times" for more than one press)
 *   wait  until a named thing a player can see (WAITS below)
 *   face  click Squatch's or Mops's face, top right (the game has no key for switching)
 * A next step may name a scene (Chapter 1) instead of a phase, and "loose" stops at control even while
 * the scene still has a step queued (O1 waits for the walk). A walk may end on untilScene (the scene
 * changed) or untilWait (a WAITS entry is true) instead of a point or a button. "ms" gives a long
 * cutscene more time than STUCK_MS before a next step counts as stuck.
 *
 * One reflex runs during every step, because a player reacts to it wherever they are: when Gloop
 * calls "Order up?" in the kitchen and the button reads ROLL, do it and stay still until she stops
 * looking.
 *
 * An input is { push(dx, dy), act(), next() }: push(0, 0) lets go.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sleep, root } from "./game-page.mjs";

export const STUCK_MS = 20000;

export function readRoute(name) {
  return JSON.parse(readFileSync(join(root, "tests", "routes", name), "utf8"));
}

export const look = (page) =>
  page.evaluate(() => {
    const ss = window.__ss, n = ss.op, k = ss.ch2;
    const who = ss.ch.mops ? n.mo : n.sq;
    return {
      phase: k.phase, scene: n.scene, ctrl: !!n.ctrl, room: n.room,
      cur: n.cur ? n.cur.k + (n.cur.id ? ":" + n.cur.id : "") : "",
      blocking: !!n.cur && ["bub", "card", "panel", "fb"].includes(n.cur.k),
      queued: n.q.length,
      button: String(ss.game.verb || "").replace(/^!/, ""),
      x: who.x, y: who.y, mops: !!ss.ch.mops, pose: n.sqPose,
      looking: (k.warn || 0) > 0 || (k.peek || 0) > 0 || (k.eye || 0) > 0,
      rustF: k.rust ? k.rust.f : 0, rustX: k.rust ? k.rust.x : 0, rustPause: k.rust ? k.rust.pause : 0,
      bots: (k.bots || []).map((b) => ({ x: b.x, look: b.look || 0 })),
      done: k.done, caught: k.caught, sec: !!k.sec,
      line: ss.debugState(),
      // Chapter 1
      mopsHint: !!ss.ch.mopsHint,
      suitCone: n.scene === "O4" ? ss.lobby().cones[1].a : 0,
      lure: ss.ch.lureBot && ss.ch.lureBot.home ? { x: ss.ch.lureBot.x, y: ss.ch.lureBot.y, hx: ss.ch.lureBot.home.x, hy: ss.ch.lureBot.home.y } : null,
      deckT1: ss.s1.tour && ss.s1.tour[1] ? { x: ss.s1.tour[1].x, dir: ss.s1.tour[1].dir, pause: ss.s1.tour[1].pause } : null,
    };
  });

// Things a player can see and wait for.
const WAITS = {
  // Rusty walks right (his cone points right), far enough along that Squatch can pass behind him.
  rustyGoingRight: (s) => s.rustF > 0 && s.rustPause <= 0 && s.rustX > 380,
  // Rusty walks left (his cone points left), away from the crate on his right.
  rustyGoingLeft: (s) => s.rustF < 0 && s.rustPause <= 0 && s.rustX > 420,
  // Rusty walks left and is close to his left end (x 330), where he will stop and turn.
  rustyNearLeftEnd: (s) => s.rustF < 0 && s.rustPause <= 0 && s.rustX <= 400,
  // The singing has pulled both bots close to the crate.
  botsClose: (s) => s.bots.length > 0 && s.bots.some((b) => b.x < 190 + 82 + 40),
  // The bots stand looking at the crate, so Squatch can run.
  botsLooking: (s) => s.ctrl && !s.blocking && s.bots.length > 0 && s.bots.every((b) => b.look > 0.5),
  // Chapter 1, O4: the man in the suit's cone points straight down or further left, so it needs about two
  // seconds to reach the gap at x 650 between his cone and the clerk's (only its far end reaches it).
  suitConeAway: (s) => s.scene === "O4" && s.ctrl && !s.blocking && s.suitCone > Math.PI / 2,
  // Chapter 1. A story bubble is up (S6: Squatch has reached Mops and the ask begins).
  talking: (s) => s.blocking,
  // S1L: the walking tourist is on the left half of the deck and heading left, away from the right edge.
  deckTouristLeft: (s) => s.scene === "S1L" && !!s.deckT1 && s.deckT1.x < 640 && s.deckT1.dir < 0 && s.deckT1.pause <= 0,
  // S9: the song has pulled the bot well away from the trash, where Mops is going.
  lureLeftTrash: (s) => !!s.lure && Math.hypot(s.lure.x - s.lure.hx, s.lure.y - s.lure.hy) > 60,
  // S11: the song has pulled the bot off the door (the keypad works once it is 150 away).
  lureOffDoor: (s) => !!s.lure && Math.hypot(s.lure.x - 1300, s.lure.y - 200) > 165,
  // S11: the scanner said NO WOOKIES and Mops thought of his goat costume.
  scannerSaidNo: (s) => s.mopsHint,
};

/**
 * Plays steps in order. Returns { failed, rolls, steps }: failed is null, or
 * { step, say, why, state } for the first step that made no progress for STUCK_MS.
 */
export async function playRoute(page, input, steps, { log = !!process.env.ROUTE_LOG } = {}) {
  let rolls = 0;
  const reflex = async (s) => {
    if (!(s.ctrl && !s.blocking && s.button === "ROLL · into a ball")) return false;
    await input.push(0, 0);
    await input.act();
    rolls++;
    for (let i = 0; i < 100; i++) {
      await sleep(100);
      const t = await look(page);
      if (!t.looking || t.pose !== "ball") break;
    }
    return true;
  };

  async function run(i, step) {
    const started = Date.now();
    const stuck = async (why) => {
      await input.push(0, 0);
      const s = await look(page);
      return { step: i + 1, say: step.say, why, state: s.line };
    };
    if (step.next) {
      const want = step.next;
      for (;;) {
        const s = await look(page);
        if (want.panel && s.cur === "panel:" + want.panel) return null;
        if (!want.panel && s.ctrl && !s.blocking && (want.loose || !s.queued) && (!want.phase || s.phase === want.phase) && (!want.scene || s.scene === want.scene)) return null;
        if (s.blocking) await input.next();
        else await reflex(s);
        await sleep(380);
        if (Date.now() - started > (step.ms || STUCK_MS)) return stuck("still waiting for " + JSON.stringify(want));
      }
    }
    if (step.walk) {
      const [tx, ty] = step.walk;
      let lastMove = Date.now(), lx = null, ly = null;
      for (;;) {
        const s = await look(page);
        if (await reflex(s)) { lastMove = Date.now(); continue; }
        if (step.until && s.button === step.until && s.ctrl && !s.blocking) { await input.push(0, 0); return null; }
        if (step.untilScene && s.scene === step.untilScene) { await input.push(0, 0); return null; }
        if (step.untilWait && WAITS[step.untilWait](s)) { await input.push(0, 0); return null; }
        const dx = tx - s.x, dy = ty - s.y;
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
          await input.push(0, 0);
          if (!step.until && !step.untilScene && !step.untilWait) return null;
          if (s.blocking) await input.next();
          await sleep(100);
          if (Date.now() - started > STUCK_MS * 3) return stuck(`at (${tx}, ${ty}), still waiting for ${step.untilScene || step.untilWait || step.until}`);
          continue;
        }
        if (!s.ctrl || s.blocking) {
          await input.push(0, 0);
          if (s.blocking) await input.next();
          await sleep(200);
        } else {
          await input.push(dx > 8 ? 1 : dx < -8 ? -1 : 0, dy > 8 ? 1 : dy < -8 ? -1 : 0);
          await sleep(60);
        }
        if (lx === null || Math.hypot(s.x - lx, s.y - ly) > 2) { lx = s.x; ly = s.y; lastMove = Date.now(); }
        if (Date.now() - lastMove > STUCK_MS || Date.now() - started > STUCK_MS * 3)
          return stuck(step.until ? `walking to (${tx}, ${ty}), the button never read "${step.until}"` : `could not reach (${tx}, ${ty})`);
      }
    }
    if (step.act) {
      const times = step.times || 1;
      for (let t = 0; t < times; t++) {
        for (;;) {
          const s = await look(page);
          if (await reflex(s)) continue;
          if (s.ctrl && !s.blocking && s.button === step.act) break;
          if (Date.now() - started > STUCK_MS) return stuck(`the button never read "${step.act}" (it reads "${s.button}")`);
          await sleep(100);
        }
        await input.act();
        await sleep(t + 1 < times ? 250 : 150);
      }
      return null;
    }
    if (step.face) {
      for (;;) {
        const s = await look(page);
        if (s.ctrl && !s.blocking) break;
        if (s.blocking) await input.next();
        if (Date.now() - started > STUCK_MS) return stuck("never had control to tap a face");
        await sleep(150);
      }
      await input.face(step.face);
      await sleep(250);
      return null;
    }
    if (step.wait) {
      const ok = WAITS[step.wait];
      if (!ok) return stuck(`no wait called ${step.wait}`);
      for (;;) {
        const s = await look(page);
        if (await reflex(s)) continue;
        if (ok(s)) return null;
        if (Date.now() - started > STUCK_MS) return stuck(`still waiting for ${step.wait}`);
        await sleep(80);
      }
    }
    return stuck("the route step has no kind");
  }

  for (const [i, step] of steps.entries()) {
    const failed = await run(i, step);
    if (log) {
      const s = await look(page);
      console.log(`  step ${i + 1} ${failed ? "STUCK" : "done"}: ${step.say} | x ${Math.round(s.x)} y ${Math.round(s.y)} | ${s.line}`);
    }
    if (failed) {
      await input.push(0, 0);
      return { failed, rolls, steps: i + 1 };
    }
  }
  await input.push(0, 0);
  return { failed: null, rolls, steps: steps.length };
}

// Keys, sent through Chrome's real keyboard: arrows to walk, E to act, Enter for the next line.
export function keyboardInput(page) {
  const held = new Set();
  const tap = async (code) => {
    await page.keyboard.down(code);
    await sleep(40);
    await page.keyboard.up(code);
  };
  return {
    async push(dx, dy) {
      const codes = [];
      if (dx > 0) codes.push("ArrowRight");
      if (dx < 0) codes.push("ArrowLeft");
      if (dy > 0) codes.push("ArrowDown");
      if (dy < 0) codes.push("ArrowUp");
      for (const c of [...held]) if (!codes.includes(c)) { await page.keyboard.up(c); held.delete(c); }
      for (const c of codes) if (!held.has(c)) { await page.keyboard.down(c); held.add(c); }
    },
    act: () => tap("KeyE"),
    next: () => tap("Enter"),
    // A mouse click on a face button (#ss-face-squatch, #ss-face-mops), through Chrome like a player's.
    async face(who) {
      const box = await page.$eval("#ss-face-" + who, (el) => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await page.mouse.click(box.x, box.y);
    },
  };
}
