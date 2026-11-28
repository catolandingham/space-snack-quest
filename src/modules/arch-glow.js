/**
 * The fur scanner arch lit up (round 8 final art, Brian's yes 2026-11-27), drawn on the locked bay pictures' own arch
 * (delivery_room.py: the grey bar with its round blue lamp in the middle, the field between the posts with two pale
 * blue scan lines, the blue strip on the floor). Lit, the same parts change colour: the lamp, the two scan lines and
 * the floor strip take the light's colour, a scan bar sweeps down the field, and the field takes a light flat tint.
 * Green lets him through (Day 2 "HAIR. PROCEED.", pickup day); red and yellow are pickup day's other lights.
 */
import { LOCKED_LOOK, lookShine } from "./locked-look.js";

export const ARCH_GLOW_COLORS = Object.freeze({ green: "43,196,138", red: "229,83,61", yellow: "255,207,51" });

/**
 * Draws the glow on the arch whose field (between the posts, under the bar) is `field` {x0, x1, y0, y1} in game
 * positions; `color` a key of ARCH_GLOW_COLORS; `k` 0 to 1 how far it is up; `t` the clock in seconds.
 */
export function drawArchGlow(ctx, field, color, k, t) {
  const rgb = ARCH_GLOW_COLORS[color] || ARCH_GLOW_COLORS.green,
    a = Math.max(0, Math.min(1, k * 2)),
    w = field.x1 - field.x0,
    h = field.y1 - field.y0,
    cx = (field.x0 + field.x1) / 2;
  if (a <= 0) return;
  ctx.save();
  // the field's flat tint
  ctx.globalAlpha = a;
  ctx.fillStyle = `rgba(${rgb},0.16)`;
  ctx.fillRect(field.x0, field.y0, w, h);
  // the two scan lines and the floor strip, in the light's colour
  ctx.fillStyle = `rgb(${rgb})`;
  for (const v of [14, 43]) ctx.fillRect(field.x0, field.y0 + v - 1.5, w, 3);
  ctx.fillRect(field.x0, field.y1 - 5, w, 4);
  // the scan bar sweeping down, over and over
  const u = (t * 1.6) % 1,
    y = field.y0 + 4 + (h - 12) * u;
  ctx.fillStyle = `rgba(${rgb},0.45)`;
  ctx.fillRect(field.x0, y - 5, w, 10);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillRect(field.x0, y - 1, w, 2);
  // the lamp on the bar: a soft halo, the lamp in the light's colour, the rooms' ink round it and the white shine dot
  const ly = field.y0 - 13,
    pulse = 0.5 + 0.5 * Math.sin(t * 10);
  ctx.fillStyle = `rgba(${rgb},${(0.25 + 0.2 * pulse).toFixed(2)})`;
  ctx.beginPath();
  ctx.arc(cx, ly, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, ly, 5.2, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${rgb})`;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = LOCKED_LOOK.ink;
  ctx.stroke();
  lookShine(ctx, cx - 1.6, ly - 1.6, 1.4);
  ctx.restore();
}
