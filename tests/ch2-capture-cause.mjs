/**
 * Fair captures in Chapter 2, and every LOCKUP card says why (task T8).
 * (a) Reset section into g4 and stand still as Mops for 15 seconds: no security, no LOCKUP
 *     (Squatch waits hidden). Positive control: Squatch standing in Gloop's view is seen even while the player is Mops.
 * (b) Each captor's catch opens LOCKUP, and the card's first line names a captor and a place.
 * (c) The kitchen bots shooing Mops costs no stars and is not counted as a capture.
 * (d) Kitchen bots cannot shoo Mops when he is out front; the kitchen search does not run out while the player is Mops.
 *   node tests/ch2-capture-cause.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8784, name: "capture-cause" });

// (a) Mops standing still out front for 15 seconds.
{
  const { ctx, page, errors } = await g.open("?ch=2");
  await page.evaluate(() => {
    const ss = window.__ss;
    ss.ch2.jar = 30; ss.ch2.has = "";
    ss.resetTo("g4");
  });
  let seen = null;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    const s = await page.evaluate(() => {
      const n = window.__ss.op;
      return { sec: !!window.__ss.ch2.sec, card: n.cur && n.cur.k === "card" ? n.cur.text : "", q: n.q.some((r) => r.k === "card" && r.id === "jail") };
    });
    if (s.sec || s.card === "LOCKUP" || s.q) {
      seen = s;
      break;
    }
  }
  g.check("Reset section in g4, Mops still for 15 s: no security and no LOCKUP", !seen, seen);
  // Positive control: Squatch standing at the counter in Gloop's view is seen, whoever the player moves.
  await page.evaluate(() => {
    const n = window.__ss.op;
    n.sqPose = "stand"; n.sq.x = 373; n.sq.y = 300;
  });
  let worst = null;
  for (let i = 0; i < 30; i++) {
    await sleep(100);
    worst = await page.evaluate(() => ({ sec: !!window.__ss.ch2.sec, who: window.__ss.ch2.sec && window.__ss.ch2.sec.who, mops: window.__ss.ch.mops }));
    if (worst.sec) break;
  }
  g.check("positive control: Squatch standing in Gloop's view is seen while the player is Mops", worst.sec && worst.mops, worst);
  g.check("no page errors (a)", errors.length === 0, errors);
  await ctx.close();
}

// (b) Each captor's catch.
const captors = [
  { by: "pump", phase: "g6", room: "gas", scene: "G6", captor: /pump bot/i, place: /lot/ },
  { by: "diner", who: "gloop", phase: "g4", room: "diner", scene: "G4", captor: /Gloop/, place: /counter/ },
  { by: "diner", who: "blorp", phase: "g4", room: "diner", scene: "G4", captor: /Blorp/, place: /diner/ },
  { by: "sink", phase: "wash1", room: "kitchen", scene: "G2k", captor: /Gloop/, place: /sink/ },
  { by: "rust", phase: "g1", room: "gas", scene: "G1", captor: /Rusty/, place: /pump/ },
];
for (const c of captors) {
  const { ctx, page, errors } = await g.open("?ch=2");
  await page.evaluate((c) => {
    const ss = window.__ss;
    const n = ss.op;
    ss.resetTo(c.phase);
    n.scene = c.scene; n.room = c.room; ss.swapTo(false);
    n.sqPose = "stand"; n.sq.x = 480; n.sq.y = 520; n.sq.moving = false;
    ss.ch2.rust.nap = c.by === "rust";
    ss.ch2.sec = { x: 500, y: 520, hide: 0, mode: "come", by: c.by, who: c.who || "" };
  }, c);
  let card = null;
  for (let i = 0; i < 30 && !card; i++) {
    await sleep(100);
    card = await page.evaluate(() => {
      const cur = window.__ss.op.cur;
      return cur && cur.k === "card" && cur.id === "jail" ? { text: cur.text, by: cur.by, cause: cur.cause, next: window.__ss.op.q.map((r) => (r.b && r.b.text) || "") } : null;
    });
  }
  const name = `${c.by}${c.who ? " (" + c.who + ")" : ""}`;
  g.check(`${name}: the catch opens LOCKUP`, !!card && card.text === "LOCKUP", card);
  g.check(`${name}: the first card line names who saw him and where`, !!card && c.captor.test(card.cause || "") && c.place.test(card.cause || ""), card);
  g.check(`${name}: the joke comes after the cause`, !!card && card.next.length > 0, card);
  g.check(`no page errors (${name})`, errors.length === 0, errors);
  await ctx.close();
}

// (c) The bots shoo Mops in the kitchen: no stars lost, not a capture.
{
  const { ctx, page, errors } = await g.open("?ch=2");
  const before = await page.evaluate(() => {
    const ss = window.__ss;
    const n = ss.op;
    ss.ch2.has = "soup";
    ss.resetTo("g4k");
    n.stars = 500; n.starOn = true; ss.ch2.caught = 0;
    ss.ch2.out = 0; ss.ch2.argueT = 9; ss.ch2.bots[0].f = -1;
    n.mo.x = 300; n.mo.y = 520; n.mo.moving = false;
    return { stars: n.stars, caught: ss.ch2.caught };
  });
  let shoo = null;
  for (let i = 0; i < 20 && !shoo; i++) {
    await sleep(100);
    shoo = await page.evaluate(() => {
      const n = window.__ss.op;
      const all = [n.cur, ...n.q].filter(Boolean).map((r) => (r.b && r.b.text) || "");
      return all.some((t) => /Shoo/i.test(t)) ? all : null;
    });
  }
  g.check("the bots shoo Mops when he walks into their view", !!shoo, shoo);
  g.check("the shoo line is the plain one", !!shoo && shoo.includes("No goats with food past here! Shoo!"), shoo);
  for (let i = 0; i < 6; i++) {
    await g.key(page, "Space");
    await sleep(400);
  }
  const after = await page.evaluate(() => ({ stars: window.__ss.op.stars, caught: window.__ss.ch2.caught, ctrl: window.__ss.op.ctrl, x: Math.round(window.__ss.op.mo.x) }));
  g.check("the shoo costs no stars", after.stars === before.stars, { before, after });
  g.check("the shoo is not counted as a capture", after.caught === 0, after);
  g.check("after the shoo Mops is back in control", after.ctrl, after);
  g.check("no page errors (c)", errors.length === 0, errors);
  await ctx.close();
}

// (d) Out front, the kitchen bots cannot see Mops; the kitchen search waits while the player is Mops.
{
  const { ctx, page, errors } = await g.open("?ch=2");
  await page.evaluate(() => {
    const ss = window.__ss;
    const n = ss.op;
    ss.ch2.has = "soup";
    ss.resetTo("g4k");
    n.room = "diner";
    ss.ch2.out = 0; ss.ch2.argueT = 9; ss.ch2.bots[0].f = -1;
    n.mo.x = 300; n.mo.y = 520;
  });
  await sleep(1500);
  const front = await page.evaluate(() => {
    const n = window.__ss.op;
    return { lines: [n.cur, ...n.q].filter(Boolean).map((r) => (r.b && r.b.text) || ""), ctrl: n.ctrl };
  });
  g.check("kitchen bots do not shoo Mops in the diner", front.ctrl && !front.lines.some((t) => /Shoo/i.test(t)), front);
  await page.evaluate(() => {
    const ss = window.__ss;
    ss.resetTo("g3hide");
    ss.swapTo(true);
    ss.ch2.timer = 0.5;
  });
  await sleep(1500);
  const search = await page.evaluate(() => {
    const n = window.__ss.op;
    return { lines: [n.cur, ...n.q].filter(Boolean).map((r) => (r.b && r.b.text) || ""), caught: window.__ss.ch2.caught };
  });
  g.check("the bots' search does not catch Squatch while the player is Mops", search.caught === 0 && !search.lines.includes("WOOKIE?!"), search);
  g.check("no page errors (d)", errors.length === 0, errors);
  await ctx.close();
}

// (e) Kitchen window. Positive control: Squatch standing in Gloop's cone at the sink while the player
// is Mops calls security. Hidden, he does not. The picture button puts him in the crate and back.
for (const pose of ["stand", "hidden"]) {
  const { ctx, page, errors } = await g.open("?ch=2");
  await page.evaluate((pose) => {
    const ss = window.__ss;
    const n = ss.op;
    ss.ch2.done = 0; ss.ch2.held = -1;
    ss.resetTo("wash1");
    ss.swapTo(true);
    n.sqPose = pose; n.sq.x = 624; n.sq.y = 437;
    ss.ch2.peek = 3; ss.ch2.eye = 0; ss.ch2.cook = "down"; ss.ch2.sec = null;
  }, pose);
  let sec = null;
  for (let i = 0; i < 25; i++) {
    await sleep(100);
    sec = await page.evaluate(() => (window.__ss.ch2.sec ? window.__ss.ch2.sec.by : null));
    if (sec) break;
  }
  if (pose === "stand") g.check("positive control: Gloop's window sees a standing Squatch while the player is Mops", sec === "sink", { sec });
  else g.check("Gloop's window does not see Squatch hidden while the player is Mops", sec === null, { sec });
  g.check(`no page errors (window, ${pose})`, errors.length === 0, errors);
  await ctx.close();
}
{
  const { ctx, page, errors } = await g.open("?ch=2");
  const swap = await page.evaluate(() => {
    const ss = window.__ss;
    const n = ss.op;
    ss.ch2.done = 0; ss.ch2.held = -1;
    ss.resetTo("wash1");
    ss.ch2.cook = "down"; ss.ch2.peekT = 99;
    n.sq.x = 500; n.sq.y = 470; n.sqPose = "stand";
    ss.picSwap();
    const asMops = { mops: ss.ch.mops, pose: n.sqPose, x: n.sq.x, spot: ss.ch.spot };
    ss.picSwap();
    const back = { mops: ss.ch.mops, pose: n.sqPose, x: n.sq.x, y: n.sq.y };
    return { asMops, back };
  });
  g.check("the picture button puts Squatch in the crate while the player is Mops", swap.asMops.mops && swap.asMops.pose === "hidden" && swap.asMops.spot === 63 && swap.asMops.x === 170, swap);
  g.check("switching back puts Squatch where he was", !swap.back.mops && swap.back.pose === "stand" && swap.back.x === 500 && swap.back.y === 470, swap);
  g.check("no page errors (picture button)", errors.length === 0, errors);
  await ctx.close();
}

await g.finish("capture-cause");
