/**
 * The dance's drawings (party-dance.js is the rules). Full screen: the band at the back, a ring of guests
 * clapping, Squatch big in his outfit in the spotlight. What a kid reads off it, with no words and no sound:
 *   - which spot to tap: one spot on him glows, with rays turning round it;
 *   - how long he has: a ring closes in on the spot, green, then amber, then red as it gets close;
 *   - that a tap scored: he snaps into that pose with his paw on the spot, a burst, and "+5" with a star rises;
 *   - that a miss cost only that spot: a grey cross where the glow was, he stumbles, and the next spot glows;
 *   - how the routine is going: a row of eight marks across the top, a gold star for each spot hit, a grey cross
 *     for each one lost; all eight gold is the big cheer (confetti, the crowd jumping, the bonus over his head).
 * He is drawn once: a pose's arms are his arms, and his paws are drawn again on top of his clothes so the paw on
 * the spot always shows (Brian 2026-11-24: "two sets of arms ... two sets of shoes").
 */
import { drawBand, drawOutfit, oval, line } from "./party-art.js";
import { bootsOnFeet } from "./party-outfit.js";
import { drawSquatchArt, armEnds, SQUATCH_LOOK } from "./squatch-art.js";
import { DANCE, SONG_LIGHTS, ROUTINE_LENGTH, danceSquatch, danceBand, onScreen, spotOnScreen, spotStanding, spotNow, ringLeft, ringRadius, unit } from "./party-dance.js";

const FLOORS = ["#5a2c4f", "#1f4f52", "#5a4a22"];
const INK = "#1e2430",
  GOLD = "#ffcf33",
  TAU = Math.PI * 2;
const clamp = (k) => Math.max(0, Math.min(1, k));
/** The timer ring's colour for the share of time left. */
export const ringColour = (left) => (left > 0.5 ? "#2bc48a" : left > 0.25 ? "#ffb300" : "#e5533d");

function star(ctx, x, y, r, fill, lw = 0) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5,
      k = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * k, y + Math.sin(a) * k);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (lw) ((ctx.lineWidth = lw), (ctx.strokeStyle = INK), (ctx.lineJoin = "round"), ctx.stroke());
}
function cross(ctx, x, y, r, color, lw) {
  line(ctx, [x - r, y - r, x + r, y + r], color, lw);
  line(ctx, [x + r, y - r, x - r, y + r], color, lw);
}
// A number of stars won, drawn where it happened: "+5" and a star, gold with a dark edge so it reads on anything.
function plus(ctx, x, y, n, size, alpha) {
  ctx.save();
  ctx.globalAlpha = clamp(alpha);
  ctx.font = `900 ${size}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = size * 0.22;
  ctx.strokeStyle = INK;
  ctx.strokeText("+" + n, x - size * 0.35, y);
  ctx.fillStyle = GOLD;
  ctx.fillText("+" + n, x - size * 0.35, y);
  star(ctx, x + size * (0.55 + 0.28 * String(n).length), y - size * 0.04, size * 0.42, GOLD, size * 0.09);
  ctx.restore();
}
/** The glowing spot and its closing ring. Returns what it drew: { x, y, r, ring, left }. */
function drawGlow(ctx, s, left, t) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 9),
    ring = ringRadius(s.r, left);
  const halo = ctx.createRadialGradient(s.x, s.y, s.r * 0.4, s.x, s.y, s.r * 2.1);
  halo.addColorStop(0, "rgba(255,244,140,.95)");
  halo.addColorStop(1, "rgba(255,244,140,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.r * 2.1, 0, TAU);
  ctx.fill();
  // rays turning round it
  for (let i = 0; i < 8; i++) {
    const a = t * 2 + (i / 8) * TAU;
    line(ctx, [s.x + Math.cos(a) * s.r * 1.12, s.y + Math.sin(a) * s.r * 1.12, s.x + Math.cos(a) * s.r * (1.3 + 0.12 * pulse), s.y + Math.sin(a) * s.r * (1.3 + 0.12 * pulse)], "#fff6aa", Math.max(3, s.r * 0.12));
  }
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.r * (0.94 + 0.06 * pulse), 0, TAU);
  ctx.fillStyle = `rgba(255,246,170,${0.5 + 0.3 * pulse})`;
  ctx.fill();
  ctx.lineWidth = Math.max(4, s.r * 0.16);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  // the timer: a ring closing in on the spot (dark behind it, so it reads on the crowd and the floor)
  for (const [lw, color] of [
    [Math.max(9, s.r * 0.34), "rgba(30,36,48,.75)"],
    [Math.max(6, s.r * 0.22), ringColour(left)],
  ]) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, ring, 0, TAU);
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  return { x: s.x, y: s.y, r: s.r, ring, left };
}
// The row of marks across the top: one for each spot of the routine.
function drawMarks(ctx, w, h, d, t) {
  const gap = Math.min(40, (w - 150) / ROUTINE_LENGTH),
    r = gap * 0.36,
    y = Math.max(86, h * 0.105),
    x0 = w / 2 - (gap * (ROUTINE_LENGTH - 1)) / 2;
  for (let i = 0; i < ROUTINE_LENGTH; i++) {
    const x = x0 + i * gap,
      m = d.marks[i];
    oval(ctx, x, y, r, r, m === 1 ? "#3a2d55" : m === -1 ? "#8d8a96" : "rgba(255,255,255,.18)");
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    if (m === 1) star(ctx, x, y, r * 0.86, GOLD);
    else if (m === -1) cross(ctx, x, y, r * 0.42, "#ffffff", 3.5);
    else if (d.live && i === d.marks.length) (ctx.beginPath(), ctx.arc(x, y, r + 3 + 2 * Math.sin(t * 9), 0, TAU), (ctx.lineWidth = 3), (ctx.strokeStyle = GOLD), ctx.stroke());
  }
}

/**
 * Draws the dance on a `w` x `h` screen. `guestArt` draws the approved guests; `outfit` is what he has on now;
 * `d` is the dance (party-dance.js newDance); `song` picks the floor and the light. Returns the glowing spot it
 * drew ({ x, y, r, ring, left }), or null.
 */
export function drawDanceCloseUp(ctx, w, h, guestArt, outfit, t, d, song = 0) {
  d = d || {};
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#1b1f3a");
  g.addColorStop(1, "#3a2d55");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const B = danceBand(w, h),
    floorY = B.floor,
    s = unit(w, h),
    party = d.party > 0 && !(d.stumble > 0),
    big = party && d.big;
  ctx.fillStyle = FLOORS[song % 3];
  ctx.fillRect(0, floorY, w, h - floorY);
  ctx.fillStyle = SONG_LIGHTS[song % 3];
  ctx.fillRect(0, 0, w, h);
  // the band at the back, small, on a raised stage (above his hat: Brian 2026-11-25)
  ctx.fillStyle = "#b08968";
  ctx.fillRect(w * 0.1, B.feet, w * 0.8, h * 0.03);
  ctx.fillStyle = "#8b6a4f";
  ctx.fillRect(w * 0.1, B.feet + h * 0.03, w * 0.8, floorY - B.feet - h * 0.03);
  drawBand(ctx, B.xs.map((x) => ({ x, y: B.feet })), B.tall, t, true);
  // the spotlight
  const sp = ctx.createRadialGradient(w / 2, h * 0.88, 10, w / 2, h * 0.88, w * 0.48);
  sp.addColorStop(0, "rgba(255,250,210,.6)");
  sp.addColorStop(1, "rgba(255,250,210,0)");
  ctx.fillStyle = sp;
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.88, w * 0.48, h * 0.08, 0, 0, TAU);
  ctx.fill();
  // the ring of guests, clapping: they bounce higher and their cheer lines grow as the crowd cheers louder
  const ring = ["teal", "camera", "backpack", "stilt", "octopus-guest", "robot"],
    cheer = d.cheer == null ? 0.4 : d.cheer;
  ring.forEach((id, i) => {
    const k = i / (ring.length - 1),
      x = w * (0.08 + 0.84 * k),
      hop = Math.abs(Math.sin(t * (4 + cheer * 6) + i)) * h * 0.012 * (1 + cheer * 2),
      y = floorY + h * 0.07 + Math.sin(k * Math.PI) * -h * 0.04 - hop;
    guestArt.drawId(ctx, id, x, y, s * 30, t * 1.5, 1, 0);
    // the cheer, drawn (sound may be off): lines bursting over each head, longer when it is louder
    const top = y - s * 34;
    for (const a of [-0.6, 0, 0.6]) line(ctx, [x + Math.sin(a) * s * 3, top - s * 2, x + Math.sin(a) * s * (3 + 5 * cheer), top - s * (2 + 6 * cheer)], GOLD, Math.max(2, s * 0.6));
  });
  // Squatch, big: in the pose of the spot he last hit; stumbling after a miss; hopping, arms up, in the cheer.
  const at = danceSquatch(w, h, d),
    sc = at.scale,
    wob = d.stumble > 0 ? 1 - d.stumble / DANCE.stumble : -1,
    sway = wob >= 0 ? Math.sin(wob * Math.PI * 3) * (1 - wob) : 0,
    hop = party ? Math.abs(Math.sin(t * 10)) * sc * 2.4 : 0,
    arms = wob >= 0 ? at.pose.arms.map((a, i) => ({ ...a, a: a.a + Math.sin(wob * 14 + i * 2) * 0.5 })) : at.pose.arms;
  ctx.save();
  ctx.translate(at.x + sway * sc * 3, at.y - hop);
  ctx.rotate(at.rot + sway * 0.38);
  drawSquatchArt(ctx, 0, 0, sc, { line: Math.max(2, sc * 0.5), arms, feet: !bootsOnFeet(outfit) });
  drawOutfit(ctx, 0, 0, sc, outfit || {}, 1, { arms, pawLine: Math.max(2, sc * 0.45) / sc, pawR: 2.5 });
  // His forearms and paws again, over what he wears: a paw on his belly or his hip is on top of his shirt, with
  // the arm that put it there, never a paw by itself (the same arm, drawn along itself: still one pair of arms).
  // In the party shirt the long sleeves are those arms (drawOutfit draws them last, with his paws out of the cuffs).
  (outfit && outfit.body === "shirt" ? [] : armEnds(arms)).forEach((a, i) => {
    if (a.elbow !== a.hand)
      for (const [lw, color] of [
        [3.6 * sc + Math.max(2, sc * 0.5) * 2, INK],
        [3.6 * sc, i === 0 ? SQUATCH_LOOK.dark : SQUATCH_LOOK.fur],
      ])
        line(ctx, [a.elbow.x * sc, a.elbow.y * sc, a.hand.x * sc, a.hand.y * sc], color, lw);
    oval(ctx, a.hand.x * sc, a.hand.y * sc, 2.5 * sc, 2.5 * sc, SQUATCH_LOOK.mask, Math.max(2, sc * 0.45));
  });
  ctx.restore();
  if (wob >= 0) {
    // dizzy: little stars going round over his head
    const top = onScreen(at, 0, -52);
    for (let i = 0; i < 3; i++) star(ctx, top.x + sway * sc * 3 + Math.cos(t * 9 + i * 2.1) * sc * 9, top.y + Math.sin(t * 9 + i * 2.1) * sc * 2.5, sc * 1.8, GOLD, 2);
  }
  // the glowing spot and its ring
  const spot = spotNow(d),
    glow = spot ? drawGlow(ctx, spotOnScreen(w, h, d, spot), ringLeft(d), t) : null;
  // what just happened, where it happened
  for (const f of d.fx || []) {
    const k = clamp(f.t / 1.1);
    if (f.kind === "bonus") {
      if (f.t < 0) continue;
      const top = onScreen({ ...at, rot: 0 }, 0, -66);
      plus(ctx, top.x, top.y - hop - k * sc * 5, f.stars, Math.max(40, sc * 7), 1.6 - k * 1.6);
      continue;
    }
    // (where the spot is on him standing straight: he may be mid-stumble or mid-cheer by now)
    const p = spotStanding(w, h, f.spot);
    if (f.kind === "hit") {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1 + k * 1.4), 0, TAU);
      ctx.lineWidth = Math.max(3, p.r * 0.2 * (1 - k));
      ctx.strokeStyle = `rgba(255,207,51,${1 - k})`;
      ctx.stroke();
      f.stars > 0 && plus(ctx, p.x, p.y - p.r * 1.3 - k * p.r * 1.6, f.stars, Math.max(28, p.r * 1.05), 1.5 - k * 1.5);
    } else {
      // a miss: the spot goes grey, with a cross
      ctx.save();
      ctx.globalAlpha = clamp(1.4 - k * 1.4);
      oval(ctx, p.x, p.y, p.r, p.r, "rgba(141,138,150,.75)");
      cross(ctx, p.x, p.y, p.r * 0.5, INK, Math.max(8, p.r * 0.3));
      cross(ctx, p.x, p.y, p.r * 0.5, "#ffffff", Math.max(4, p.r * 0.16));
      ctx.restore();
    }
  }
  if (big) {
    // the big cheer: confetti coming down
    const age = DANCE.bigCheer - d.party;
    for (let i = 0; i < 36; i++) {
      const x = ((i * 97) % 100) / 100,
        y = ((age * (0.35 + ((i * 31) % 10) / 22) + ((i * 53) % 100) / 100) % 1) * h * 0.9;
      ctx.save();
      ctx.translate(w * x + Math.sin(age * 5 + i) * 10, y);
      ctx.rotate(age * 6 + i);
      ctx.fillStyle = [GOLD, "#ff5fa8", "#2bc4aa", "#8fdcff", "#ffffff"][i % 5];
      ctx.fillRect(-5, -3, 10, 6);
      ctx.restore();
    }
  }
  drawMarks(ctx, w, h, { marks: d.marks || [], live: d.live }, t);
  return glow;
}

/** The close button: a white disc with a cross, no words. */
export function drawCloseButton(ctx, b) {
  oval(ctx, b.x, b.y, b.r - 2, b.r - 2, "#ffffff", 3);
  line(ctx, [b.x - 10, b.y - 10, b.x + 10, b.y + 10], INK, 5);
  line(ctx, [b.x + 10, b.y - 10, b.x - 10, b.y + 10], INK, 5);
}
