/**
 * The quiet room before the first tap: Mops visibly mops (Brian, 2026-11-24, after watching the morning video:
 * "it would help if you could see the janitor walking around, mopping the floor with his beard, because him
 * standing in one place, you don't immediately understand what's happening. And the water on the floor kind of
 * following, and him very visually rubbing his beard back and forth to mop it ... And then walking back to the
 * bucket to squeeze it out.").
 *
 * While Squatch sleeps and the room waits for the tap, Mops goes round and round (the scene never moves on by
 * itself; this is an animation, not a step of the story):
 *   down      at the door end of his stretch he puts his head down, beard on the floor
 *   mop       he mops along the floor to his bucket: a step forward as the beard pushes out, then it pulls back;
 *             a wet shine follows the beard and dries from the far end; a soft swish on every stroke
 *   lift      beside the bucket his head comes up
 *   toBucket  a step up to the painted bucket
 *   wring     he wrings his beard over it: two squeezes, drops fall into the water (a quiet squeeze, drips)
 *   back      he walks back out to the door end, head up
 * The tap can come at any point: hold() stops him where he is, still mopping, and the morning goes on from there.
 *
 * His beard is his mop: no mop prop. The locked room picture is never changed: the shine, the wrung beard and
 * the drops are drawn on top of it, as the wet streak is.
 * Every sound here is also drawn (the beard's stroke, the squeeze, each drop landing).
 */
import { MORNING_SOUND } from "./morning-sound.js";

/** Placeholder numbers, by eye (Brian has not tuned them): how far, how fast, how long. Game pixels and seconds. */
export const MOP_LOOP = Object.freeze({
  settle: 0.6, // seconds his head takes to go down at the door end before the first stroke
  stride: 35, // how far he steps forward on each push of the beard (four pushes take him to the bucket)
  walk: 70, // pixels a second as he steps forward mopping (the same pace as his mopping after "Party?")
  lift: 0.3, // seconds his head takes to come up beside the bucket
  toBucket: 60, // pixels a second on the step up to the bucket
  back: 80, // pixels a second walking back out to the door end
  // How far the beard's end swings, in his own drawing units (the engine draws him 3 game pixels to each): out in front of him, and
  // back between his front legs. (Further out it would touch the painted bucket at the end of his stretch.)
  sweep: Object.freeze({ out: 6, back: 10 }),
  idleSweep: 1.6, // the small sweep while he mops on the spot (after the tap, until "Morning, Squatch.")
  ease: 0.35, // seconds the beard takes to settle into the small sweep after the tap
  easeIn: 0.2, // seconds it takes to swing from there into the first stroke after "Party?"
  shineDries: 5, // seconds a mopped bit of floor stays wet
  shineFade: 1.5, // then it fades over this long
  shineStep: 5, // a new bit of shine each time the beard has moved on this far
  // The wring at the bucket: how long, when he squeezes, when each drop lands in the water, how long it falls.
  wring: Object.freeze({ secs: 2.7, squeeze: Object.freeze([0.3, 1.4]), squeezeFor: 0.55, drips: Object.freeze([0.72, 0.98, 1.82, 2.06, 2.3]), fall: 0.24, ripple: 0.35 }),
});
const INK = "#1e2430",
  WATER = "rgb(143,220,255)",
  BEARD = "#f4f5f8",
  STRAND = "#9aa3b3";
const clamp01 = (v) => Math.max(0, Math.min(1, v));

/** The beard's small sweep when nothing else says (the engine's own, for the same look). */
const idle = (time) => Math.sin(time * 3.4) * MOP_LOOP.idleSweep;
/** A stroke's turn: from far back (-1) out to far forward (+1) on even strokes, back again on odd ones. */
const strokeTurn = (t, every) => {
  const k = Math.floor(t / every),
    u = t / every - k;
  return (k % 2 ? 1 : -1) * Math.cos(Math.PI * u);
};
/** The beard's sweep (drawing units) for a turn of -1 (far back) to +1 (far out). */
const sweepAt = (turn) => {
  const S = MOP_LOOP.sweep;
  return (S.out - S.back) / 2 + (turn * (S.out + S.back)) / 2;
};

/**
 * A wet patch of floor: light blue with a white glint, as the morning has drawn it since Brian's 21a.
 * `pts` are [{ x, a }] along the floor from left to right (a: how wet, 0 to 1); `y` is the patch's middle.
 */
export function drawWet(ctx, pts, y) {
  if (!pts || pts.length < 2) return;
  const x0 = pts[0].x,
    x1 = pts[pts.length - 1].x;
  if (!(x1 - x0 > 1)) return;
  const grad = (rgb, k) => {
    const gr = ctx.createLinearGradient(x0 - 6, 0, x1 + 6, 0);
    for (const p of pts) gr.addColorStop(clamp01((p.x - x0 + 6) / (x1 - x0 + 12)), `rgba(${rgb},${(k * clamp01(p.a)).toFixed(3)})`);
    return gr;
  };
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x0 - 6, y - 8, x1 - x0 + 12, 16, 8);
  ctx.fillStyle = grad("143,220,255", 0.7);
  ctx.fill();
  if (x1 - x0 > 14) {
    ctx.beginPath();
    ctx.moveTo(x0 + 6, y - 2);
    ctx.lineTo(x1 - 6, y - 2);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = grad("255,255,255", 0.8);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * The loop. `E` is the morning's engine; `m` in each call is the beat's progress; `places` its MORNING_PLACES
 * (mopFrom: the door end; mops: beside the bucket; wring: at the bucket; water: the painted bucket's water);
 * `sound` plays a sound by name. The loop's own progress is kept in the beat's progress (`loop`, `shine`),
 * so the step restart (↺) starts it again with the room.
 */
export function createMopLoop({ E, places, sound }) {
  const W = MOP_LOOP.wring,
    far = places.mopFrom,
    near = places.mops,
    every = MORNING_SOUND.mopSoftEvery,
    strokes = 2 * Math.round((far.x - near.x) / MOP_LOOP.stride); // a push and a pull for each stride
  const fresh = () => ({ ph: "down", t: 0, round: 0, k: 0, landed: 0 });
  const L = (m) => (m && m.loop) || null;
  function go(l, ph) {
    l.ph = ph;
    l.t = 0;
    l.k = 0;
    ph === "wring" && (l.landed = 0);
  }
  // Events of a list whose time falls in (from, to].
  const due = (list, from, to) => list.filter((at) => at > from && at <= to).length;

  /** How his head and beard are drawn now (the engine's drawMops options), or null for the engine's own look. */
  function look(m) {
    const e = E(),
      l = L(m),
      pose = e.get("moPose"),
      back = sweepAt(-1);
    if (pose === "wring") {
      const sq = squeeze(l ? l.t : 0);
      return { noBeard: true, headDrop: 1 + 2.5 * sq };
    }
    if (pose !== "mop") return null;
    // After "Party?", mopping to the bucket: the beard goes out and back with each "swish, squeak" (a stroke
    // every mopEvery, quicker than the sleeping strokes: Squatch is awake now). It swings into the first stroke
    // from its small sweep, not in one frame.
    if (m.step === "mopping") {
      const t = m.t || 0,
        k = clamp01(t / MOP_LOOP.easeIn),
        to = sweepAt(strokeTurn(t, MORNING_SOUND.mopEvery));
      return { sweep: k < 1 ? idle(e.time()) * (1 - k) + to * k : to };
    }
    if (!l) return { sweep: idle(e.time()) };
    switch (l.ph) {
      case "down": {
        const k = clamp01(l.t / MOP_LOOP.settle);
        return { headDrop: 6 * k, sweep: back * k };
      }
      case "mop":
        return { sweep: sweepAt(strokeTurn(l.t, every)) };
      case "lift": {
        const k = 1 - clamp01(l.t / MOP_LOOP.lift);
        return { headDrop: 6 * k, sweep: back * k };
      }
      case "held": {
        // The tap stopped him: head down (from wherever it was), the beard settling into its small sweep.
        const k = clamp01(l.t / MOP_LOOP.ease);
        return { headDrop: l.drop + (6 - l.drop) * k, sweep: l.sweep + (idle(e.time()) - l.sweep) * k };
      }
    }
    return null;
  }
  // How hard he is squeezing, 0 to 1, `t` seconds into the wring: up fast and down again on each squeeze.
  function squeeze(t) {
    for (const at of W.squeeze) if (t >= at && t < at + W.squeezeFor) return Math.sin((Math.PI * (t - at)) / W.squeezeFor);
    return 0;
  }
  // Where his beard's end is on the floor (game x), from where he stands and how the beard swings.
  function tipX(m) {
    const e = E(),
      mo = e.pos("mops"),
      lk = look(m);
    // His drawing units are the engine's scale (game pixels each).
    return mo.x + (mo.f || -1) * (places.beardTip + e.squatchScale() * ((lk && lk.sweep) || 0));
  }
  // The wrung beard, from under his chin out over the bucket's rim to just above the water.
  function rope(m) {
    const mo = E().pos("mops"),
      U = E().squatchScale(),
      l = L(m),
      sq = squeeze(l ? l.t : 0),
      f = mo.f || -1,
      // Under his chin, in his own drawing units (19 ahead of his middle, 21 up; his head dips as he squeezes).
      root = { x: mo.x + f * 19 * U, y: mo.y - 21 * U + 2.5 * sq * U },
      water = places.water,
      tip = { x: (water.x0 + water.x1) / 2 + 6, y: water.y - 22 + 3 * sq };
    return { root, tip, ctrl: { x: tip.x + 5, y: root.y - 3 }, sq };
  }

  return {
    look,
    /** A new morning (or ↺): the loop starts again with the room. */
    start(m) {
      m.loop = fresh();
      m.shine = [];
    },
    /**
     * Every frame while the quiet room waits for its tap: moves Mops round his loop, lays the shine, and plays
     * the stroke, squeeze and drip sounds as their moments pass.
     */
    tick(m, dt) {
      const e = E(),
        l = L(m);
      if (!l || l.ph === "held") return;
      const t0 = l.t;
      l.t += dt;
      switch (l.ph) {
        case "down":
          e.set("moPose", "mop");
          e.face("mops", -1);
          e.still("mops");
          l.t >= MOP_LOOP.settle && go(l, "mop");
          break;
        case "mop": {
          // One stroke of the beard every `every` seconds; he steps forward on each push (the even strokes).
          const stroke = Math.min(strokes - 1, Math.floor(l.t / every)),
            to = far.x - MOP_LOOP.stride * (Math.floor(stroke / 2) + 1);
          for (; l.k <= stroke; l.k++) sound.play("mopSoft", l.k);
          e.step("mops", Math.max(near.x, to), near.y, MOP_LOOP.walk, dt);
          e.face("mops", -1);
          // The shine: a new bit each time the beard's end has gone further than it had.
          const x = tipX(m),
            last = m.shine[m.shine.length - 1];
          (!last || x < last.x - MOP_LOOP.shineStep) && m.shine.push({ x: Math.round(x), t: e.time() });
          l.t >= strokes * every && e.pos("mops").x <= near.x + 0.5 && go(l, "lift");
          break;
        }
        case "lift":
          e.still("mops");
          l.t >= MOP_LOOP.lift && (e.set("moPose", "stand"), go(l, "toBucket"));
          break;
        case "toBucket":
          if (e.step("mops", places.wring.x, places.wring.y, MOP_LOOP.toBucket, dt)) {
            e.still("mops");
            e.face("mops", -1);
            e.set("moPose", "wring");
            go(l, "wring");
          }
          break;
        case "wring":
          for (let i = due(W.squeeze, t0, l.t); i > 0; i--) sound.play("squeeze");
          for (let i = due(W.drips, t0, l.t); i > 0; i--) sound.play("dripSoft", l.landed++);
          l.t >= W.secs && (e.set("moPose", "stand"), go(l, "back"));
          break;
        case "back":
          if (e.step("mops", far.x, far.y, MOP_LOOP.back, dt)) {
            l.round++;
            go(l, "down");
            e.set("moPose", "mop");
            e.face("mops", -1);
            e.still("mops");
          }
          break;
      }
      // Dried shine is forgotten.
      const now = e.time(),
        life = MOP_LOOP.shineDries + MOP_LOOP.shineFade;
      while (m.shine.length && now - m.shine[0].t > life) m.shine.shift();
    },
    /** The tap on the quiet room: he stops where he is and goes on mopping on the spot (the morning's ding()). */
    hold(m) {
      const e = E(),
        l = L(m);
      if (!l || l.ph === "held") return;
      const lk = look(m) || {},
        pose = e.get("moPose");
      l.drop = lk.headDrop != null ? lk.headDrop : pose === "mop" ? 6 : 0;
      l.sweep = lk.sweep || 0;
      go(l, "held");
      e.still("mops");
      e.set("moPose", "mop");
    },
    /** Every frame after the tap: the beard settles (and the shine goes on drying by the clock). */
    settle(m, dt) {
      const l = L(m);
      l && l.ph === "held" && (l.t += dt);
    },
    /** Where the wet under his beard is now (game x), while he mops. */
    tipX,
    /** Drawn on the room, under the people: the shine his beard has left, drying from its old end. */
    drawShine(ctx, m) {
      const s = m.shine,
        now = E().time();
      if (!s || s.length < 2) return;
      const a = (p) => clamp01(1 - (now - p.t - MOP_LOOP.shineDries) / MOP_LOOP.shineFade);
      // The bits were laid from the door end toward the bucket: left to right is newest to oldest.
      const pts = s
        .filter((p) => a(p) > 0)
        .map((p) => ({ x: p.x, a: a(p) }))
        .reverse();
      drawWet(ctx, pts, near.y + 12);
    },
    /** Drawn over the people: the wrung beard out over the bucket, the squeeze marks, the drops and their rings. */
    drawWring(ctx, m) {
      const l = L(m);
      if (!l || l.ph !== "wring" || E().get("moPose") !== "wring") return;
      const r = rope(m),
        at = (u) => ({
          x: (1 - u) * (1 - u) * r.root.x + 2 * u * (1 - u) * r.ctrl.x + u * u * r.tip.x,
          y: (1 - u) * (1 - u) * r.root.y + 2 * u * (1 - u) * r.ctrl.y + u * u * r.tip.y,
        });
      // A tapered band along the curve, pinched in the middle as he squeezes, ragged at its end.
      const N = 10,
        left = [],
        right = [];
      for (let i = 0; i <= N; i++) {
        const u = i / N,
          p = at(u),
          q = at(Math.min(1, u + 0.02)),
          p0 = at(Math.max(0, u - 0.02)),
          dx = q.x - p0.x,
          dy = q.y - p0.y,
          d = Math.hypot(dx, dy) || 1,
          w = (11 - 4.5 * u) * (1 - 0.3 * r.sq * Math.sin(Math.PI * u));
        left.push({ x: p.x - (dy / d) * w, y: p.y + (dx / d) * w });
        right.push({ x: p.x + (dy / d) * w, y: p.y - (dx / d) * w });
      }
      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (const p of left.slice(1)) ctx.lineTo(p.x, p.y);
      const e0 = left[N],
        e1 = right[N];
      ctx.lineTo((e0.x * 2 + e1.x) / 3 + 1, e0.y + 5);
      ctx.lineTo((e0.x + e1.x) / 2, e0.y + 1);
      ctx.lineTo((e0.x + e1.x * 2) / 3 - 1, e1.y + 5);
      for (const p of right.slice().reverse()) ctx.lineTo(p.x, p.y);
      ctx.closePath();
      ctx.fillStyle = BEARD;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = INK;
      ctx.stroke();
      // The hair runs round it, like a twisted rope; the strands slide as he squeezes.
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = STRAND;
      for (let i = 0; i < 4; i++) {
        const u = (0.16 + i * 0.2 + 0.12 * r.sq) % 1,
          k = Math.round(u * N),
          a = left[k],
          b = right[Math.min(N, k + 1)];
        ctx.beginPath();
        ctx.moveTo(a.x + (b.x - a.x) * 0.2, a.y + (b.y - a.y) * 0.2);
        ctx.lineTo(a.x + (b.x - a.x) * 0.8, a.y + (b.y - a.y) * 0.8);
        ctx.stroke();
      }
      // Squeeze marks: two short dark strokes each side of the beard while he squeezes.
      if (r.sq > 0.25) {
        const mid = at(0.55);
        ctx.globalAlpha = clamp01(r.sq * 1.4);
        ctx.lineWidth = 3;
        ctx.strokeStyle = INK;
        for (const [dx, dy] of [
          [-20, -16],
          [-26, -4],
          [16, -22],
          [24, -12],
        ]) {
          ctx.beginPath();
          ctx.moveTo(mid.x + dx * 0.72, mid.y + dy * 0.72);
          ctx.lineTo(mid.x + dx, mid.y + dy);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      // Each drop falls from the beard's end and lands in the water as its drip sounds; then a ring spreads on
      // the water and two small drops hop up over the rim.
      const water = places.water,
        drop = (x, y, k) => {
          ctx.beginPath();
          ctx.moveTo(x, y - 8 * k);
          ctx.quadraticCurveTo(x + 6 * k, y - 1 * k, x, y + 4.5 * k);
          ctx.quadraticCurveTo(x - 6 * k, y - 1 * k, x, y - 8 * k);
          ctx.fillStyle = WATER;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = INK;
          ctx.stroke();
        };
      W.drips.forEach((land, i) => {
        const x = r.tip.x - 9 + ((i * 7) % 17),
          y0 = r.tip.y + 8,
          y1 = water.y,
          u = (l.t - (land - W.fall)) / W.fall,
          k = (l.t - land) / W.ripple;
        if (u >= 0 && u < 1) drop(x, y0 + (y1 - y0) * u * u, 1);
        else if (k >= 0 && k < 1) {
          ctx.globalAlpha = 1 - k;
          ctx.beginPath();
          ctx.ellipse(x, y1 + 1, 4 + 9 * k, 1.5 + 2.5 * k, 0, 0, Math.PI * 2);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
          ctx.globalAlpha = 1;
          for (const side of [-1, 1]) drop(x + side * (5 + 9 * k), y1 - 6 - 26 * k * (1 - k) * 2, 0.55);
        }
      });
      ctx.restore();
    },
    /** For tests: where the loop is, how the beard swings, and the shine on the floor. */
    debug(m) {
      const l = L(m),
        s = (m && m.shine) || [],
        lk = m && E() ? look(m) : null;
      return {
        loop: l ? { ph: l.ph, t: l.t, round: l.round, sweep: (lk && lk.sweep) || 0, out: sweepAt(1), back: sweepAt(-1), landed: l.landed } : null,
        shine: s.length > 1 ? { x0: s[s.length - 1].x, x1: s[0].x, y: near.y + 12, n: s.length } : null,
      };
    },
  };
}
