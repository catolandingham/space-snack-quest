/**
 * Pickup day's drawings of people and what they wear or shed (Chapter 1, beats 53 to 61; round 8, final art, each
 * pending Brian's yes): Mops's beard hair laid over Squatch in the crate (21), the passengers' luggage (25), Squatch's
 * eyes in the robot mailbox's slot (27), the ragged end of Mops's snipped beard (29), the goat beard falling off (30),
 * the ship's crew member (32). Drawn in the locked rooms' look: flat colours, the dark ink outline, one shade.
 * Motion stays where it is (pickup.js); these only draw a thing where they are told.
 */
import { drawPerson } from "./party-art.js";

const PP_INK = "#1e2430",
  PP_TAU = Math.PI * 2,
  PP_BEARD = "#f4f5f8", // Mops's beard, as the engine draws it (60-frame-draw.js)
  PP_STRAND = "#c9ced8",
  PP_GOAT = "#f7f4ee"; // the costume goat beard, as the engine draws it

function ppPaint(ctx, fill, line) {
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.strokeStyle = PP_INK), (ctx.lineWidth = line), (ctx.lineJoin = "round"), ctx.stroke());
}

// ---------- 21: Mops's beard hair over him in the crate ("fur stops, hair goes") ----------
/**
 * One long lock of Mops's beard hair, from (0, 0) along +x, `len` long: wide where it was cut, tapering to a few fine
 * wisps, a gentle S down its length, the beard's own white with two grey strand lines. Long, smooth and white, so it
 * reads as hair, not as his brown fur tufts.
 */
function drawHairLock(ctx, len, wave, lw) {
  const w0 = len * 0.16,
    pt = (u) => ({ x: u * len, y: Math.sin(u * Math.PI * 1.6) * len * 0.08 * wave });
  const n = 10,
    top = [],
    bot = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n,
      p = pt(u),
      hw = w0 * (1 - u * 0.75) * (i === 0 ? 0.85 : 1);
    top.push({ x: p.x, y: p.y - hw });
    bot.push({ x: p.x, y: p.y + hw });
  }
  ctx.beginPath();
  ctx.moveTo(top[0].x, top[0].y);
  for (let i = 1; i <= n; i++) ctx.lineTo(top[i].x, top[i].y);
  // the wisps at the tip
  const tip = pt(1);
  ctx.lineTo(tip.x + len * 0.1, tip.y - len * 0.04);
  ctx.lineTo(tip.x + len * 0.02, tip.y);
  ctx.lineTo(tip.x + len * 0.12, tip.y + len * 0.03);
  for (let i = n; i >= 0; i--) ctx.lineTo(bot[i].x, bot[i].y);
  ctx.closePath();
  ppPaint(ctx, PP_BEARD, lw);
  ctx.beginPath();
  for (const off of [-0.35, 0.3]) {
    for (let i = 1; i < n; i++) {
      const u = i / n,
        p = pt(u),
        hw = w0 * (1 - u * 0.75);
      i === 1 ? ctx.moveTo(p.x, p.y + off * hw) : ctx.lineTo(p.x, p.y + off * hw);
    }
  }
  ctx.strokeStyle = PP_STRAND;
  ctx.lineWidth = Math.max(0.8, lw * 0.55);
  ctx.lineCap = "round";
  ctx.stroke();
}
/**
 * The hair Mops laid over him on purpose (53, round 7 #116: "So today you're a pile of hair."), over the crate bed `box`
 * (the crate bed's box in the home picture, game positions): a soft white heap of his beard hair along the bed's top,
 * wavy grey strand lines through it, and long locks hanging down over the front, a few wisps at their ends. Long, smooth
 * and white, so it reads as hair, not as his brown fur.
 */
export function drawHairPile(ctx, box) {
  const w = box.x1 - box.x0,
    x0 = box.x0 + w * 0.05,
    x1 = box.x1 - w * 0.05,
    top = box.y0 + 6,
    base = box.y0 + 46;
  ctx.save();
  // the locks hanging over the front edge (behind the heap)
  [0.1, 0.27, 0.45, 0.62, 0.8, 0.93].forEach((u, i) => {
    ctx.save();
    ctx.translate(x0 + (x1 - x0) * u, base - 6);
    ctx.rotate(Math.PI / 2 + (i % 2 ? 0.12 : -0.1));
    drawHairLock(ctx, 30 + (i % 3) * 9, i % 2 ? 1 : -1, 1.8);
    ctx.restore();
  });
  // the heap: locks laid every way along the top, three rows deep, back row first, so it is a messy pile of hair
  const span = x1 - x0;
  for (let r = 0; r < 3; r++)
    for (let i = 0; i < 5; i++) {
      const u = (i + (r % 2 ? 0.5 : 0)) / 5,
        len = span * (0.3 + ((i + r) % 3) * 0.05);
      ctx.save();
      ctx.translate(x0 + span * u - len * 0.35, top + 8 + r * 11 + ((i * 7) % 5));
      ctx.rotate((((i * 5 + r * 3) % 7) - 3) * 0.09);
      drawHairLock(ctx, len, (i + r) % 2 ? 1 : -1, 1.8);
      ctx.restore();
    }
  // a few loose strands curling up off the top
  ctx.beginPath();
  for (const [u, d] of [
    [0.2, 1],
    [0.48, -1],
    [0.75, 1],
  ]) {
    const sx = x0 + (x1 - x0) * u,
      sy = top + 6;
    ctx.moveTo(sx, sy + 4);
    ctx.quadraticCurveTo(sx + d * 8, sy - 6, sx + d * 3, sy - 12);
  }
  ctx.strokeStyle = PP_INK;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.strokeStyle = PP_BEARD;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();
  return true;
}

// ---------- 25: the passengers' luggage ----------
/**
 * What a passenger brings to the ship (54): a rolling suitcase pulled behind them by its long handle (the side away
 * from where they walk), with a luggage tag and two stickers, `adultPx` the bay's grown-up height. The passengers
 * themselves are the approved guest pictures (guests.js); the suitcase is what tells they are travelling.
 */
export function drawPassengerCase(ctx, x, y, adultPx, f = 1, color = "#e5533d", t = 0) {
  const k = adultPx / 100,
    lw = Math.max(1, 1.8 * k),
    bx = x - f * 26 * k,
    cw = 18 * k,
    ch = 24 * k,
    tilt = -f * 0.18;
  ctx.save();
  ctx.translate(bx, y);
  ctx.rotate(tilt);
  // the handle, up to the hand
  ctx.beginPath();
  ctx.moveTo(-3 * k, -ch);
  ctx.lineTo(-3 * k, -ch - 20 * k);
  ctx.moveTo(3 * k, -ch);
  ctx.lineTo(3 * k, -ch - 20 * k);
  ctx.strokeStyle = PP_INK;
  ctx.lineWidth = lw * 1.6;
  ctx.stroke();
  ctx.strokeStyle = "#8a93a3";
  ctx.lineWidth = lw * 0.7;
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(-5 * k, -ch - 23 * k, 10 * k, 4 * k, 2 * k);
  ppPaint(ctx, "#2b2f3c", lw);
  // the case
  ctx.beginPath();
  ctx.roundRect(-cw / 2, -ch - 2 * k, cw, ch, 3.5 * k);
  ppPaint(ctx, color, lw);
  ctx.beginPath();
  for (const u of [-0.22, 0.22]) (ctx.moveTo(u * cw, -ch + 1 * k), ctx.lineTo(u * cw, -4 * k));
  ctx.strokeStyle = "rgba(30,36,48,.35)";
  ctx.lineWidth = lw * 0.8;
  ctx.stroke();
  // stickers: a small red planet, a gold star
  ctx.beginPath();
  ctx.arc(-cw * 0.22, -ch * 0.62, 2.6 * k, 0, PP_TAU);
  ppPaint(ctx, "#d9583b", lw * 0.5);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = (i % 2 ? 1.1 : 2.6) * k,
      a = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(cw * 0.2 + Math.cos(a) * r, -ch * 0.35 + Math.sin(a) * r);
  }
  ctx.closePath();
  ppPaint(ctx, "#ffcf33", 0);
  // the luggage tag on a loop
  ctx.beginPath();
  ctx.moveTo(cw * 0.3, -ch - 1 * k);
  ctx.lineTo(cw * 0.5 + 1 * k, -ch + 4 * k);
  ctx.strokeStyle = PP_INK;
  ctx.lineWidth = lw * 0.6;
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(cw * 0.5 - 1 * k, -ch + 3 * k, 6 * k, 8 * k, 1 * k);
  ppPaint(ctx, "#fffdf8", lw * 0.6);
  // two wheels
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(s * cw * 0.32, -1.2 * k, 2 * k, 0, PP_TAU);
    ppPaint(ctx, "#2b2f3c", lw * 0.5);
  }
  ctx.restore();
  return true;
}

// ---------- 27: Squatch inside the robot mailbox, his eyes in its slot ----------
/**
 * His eyes in the mailbox's slot (55, Brian #118 B: he hides inside it; it stays quiet): the slot's dark inside, the
 * brown of his fur round his eyes, two eyes looking out (left, right, then a blink every few seconds), and the slot's
 * flap pushed up a little over them. (x, y) is the slot's middle; `k` its size (1: a slot 34 game pixels wide).
 */
export function drawMailboxEyes(ctx, x, y, k = 1, t = 0) {
  const w = 34 * k,
    h = 10 * k,
    lw = Math.max(1, 1.6 * k);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, 2.5 * k);
  ppPaint(ctx, "#1c1410", lw);
  ctx.save();
  ctx.clip();
  // his fur round his eyes, lit a little from the slot
  ctx.beginPath();
  ctx.ellipse(x, y + 1 * k, w * 0.42, h * 0.75, 0, 0, PP_TAU);
  ctx.fillStyle = "#6b4428";
  ctx.fill();
  const look = Math.sin(t * 0.9) > 0.4 ? 1.4 : Math.sin(t * 0.9) < -0.4 ? -1.4 : 0,
    blink = t % 3.6 < 0.14;
  for (const d of [-6.5, 6.5]) {
    if (blink) {
      ctx.beginPath();
      ctx.moveTo(x + (d - 3.5) * k, y + 0.5 * k);
      ctx.lineTo(x + (d + 3.5) * k, y + 0.5 * k);
      ctx.strokeStyle = PP_INK;
      ctx.lineWidth = lw;
      ctx.stroke();
      continue;
    }
    ctx.beginPath();
    ctx.ellipse(x + d * k, y + 0.6 * k, 3.6 * k, 3.4 * k, 0, 0, PP_TAU);
    ppPaint(ctx, "#ffffff", lw * 0.6);
    ctx.beginPath();
    ctx.arc(x + (d + look) * k, y + 0.9 * k, 1.8 * k, 0, PP_TAU);
    ppPaint(ctx, PP_INK, 0);
    ctx.beginPath();
    ctx.arc(x + (d + look - 0.6) * k, y + 0.2 * k, 0.6 * k, 0, PP_TAU);
    ppPaint(ctx, "#ffffff", 0);
  }
  ctx.restore();
  // the flap, pushed up and out over his eyes
  ctx.beginPath();
  ctx.moveTo(x - w / 2 - 1 * k, y - h / 2);
  ctx.lineTo(x + w / 2 + 1 * k, y - h / 2);
  ctx.lineTo(x + w / 2 - 1 * k, y - h / 2 - 5 * k);
  ctx.lineTo(x - w / 2 + 1 * k, y - h / 2 - 5 * k);
  ctx.closePath();
  ppPaint(ctx, "#b9c0cc", lw);
  ctx.restore();
  return true;
}

// ---------- 29: Mops's beard, snipped ----------
/**
 * Mops's beard after the snip (56 on; a Chapter 2 plant), drawn in his own units like the engine's beard (feet at
 * (x, y), facing `f`, `k` his scale; the engine leaves its own beard out while this one shows): the same narrow white
 * beard from his chin, but ending a third of the way short of the floor in a straight, blunt cut, its strands' ends
 * uneven and a few short hairs sticking out of the cut, a grey cut edge. The rest of it is Squatch's goat beard.
 */
export function drawSnippedBeard(ctx, x, y, k, f = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k * (f < 0 ? -1 : 1), k);
  const q = Math.max(1.2, 2.2 / Math.max(0.6, k)) * 0.55; // the engine's outline, in his units
  const cut = -8.5;
  ctx.beginPath();
  ctx.moveTo(14.7, -23);
  ctx.quadraticCurveTo(12.8, -15, 13.6, cut + 0.5);
  // the cut: a straight line, ragged a little (strand ends at slightly different lengths)
  const ends = [0.6, -0.4, 0.9, -0.2, 0.7, -0.5, 0.4];
  ends.forEach((d, i) => ctx.lineTo(13.6 + (i + 1) * 1.37, cut + d));
  ctx.quadraticCurveTo(24.6, -15, 23.4, -23);
  ctx.closePath();
  ctx.fillStyle = PP_BEARD;
  ctx.fill();
  ctx.strokeStyle = PP_INK;
  ctx.lineWidth = q;
  ctx.lineJoin = "round";
  ctx.stroke();
  // the strand lines down to the cut, and the grey of the cut ends
  ctx.beginPath();
  ctx.moveTo(17, -18);
  ctx.lineTo(17.3, cut + 1.6);
  ctx.moveTo(20.5, -17);
  ctx.lineTo(20.3, cut + 1.6);
  ctx.strokeStyle = PP_STRAND;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(14.4, cut + 0.9);
  ctx.lineTo(23.2, cut + 0.9);
  ctx.strokeStyle = "#a9b0bd";
  ctx.lineWidth = 1.1;
  ctx.stroke();
  // a few short hairs poking out of the cut
  ctx.beginPath();
  for (const [hx, hl, ha] of [
    [15.2, 2.2, -0.3],
    [18.4, 1.6, 0.2],
    [21.6, 2.4, 0.35],
  ]) {
    ctx.moveTo(hx, cut + 0.8);
    ctx.lineTo(hx + Math.sin(ha) * hl, cut + 0.8 + Math.cos(ha) * hl);
  }
  ctx.strokeStyle = PP_INK;
  ctx.lineWidth = 0.55;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
  return true;
}

// ---------- 30: the goat beard falling off ----------
/**
 * The costume goat beard on its own (58 and the hall's slip, 57): the engine's goat-beard tuft (60-frame-draw.js, the
 * same teardrop of off-white hair) with its two grey hair lines and the thin black elastic loop a pretend beard hangs
 * from, its loop's top middle at (x, y), `q` his scale, turned `rot`. Turned and falling, the loop shows it was a
 * costume and his own fur shows under his chin.
 */
export function drawGoatBeard(ctx, x, y, q, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(q, q);
  // the elastic loop
  ctx.beginPath();
  ctx.ellipse(0, 4, 7.5, 5, 0, Math.PI * 1.05, Math.PI * 1.95);
  ctx.strokeStyle = PP_INK;
  ctx.lineWidth = 0.9;
  ctx.stroke();
  // the tuft
  ctx.beginPath();
  ctx.moveTo(-3, 3);
  ctx.quadraticCurveTo(-8.5, 10, -1, 17);
  ctx.lineTo(0, 19);
  ctx.lineTo(1, 17);
  ctx.quadraticCurveTo(8.5, 10, 3, 3);
  ctx.quadraticCurveTo(0, 1.5, -3, 3);
  ctx.closePath();
  ppPaint(ctx, PP_GOAT, 1.2);
  ctx.beginPath();
  ctx.moveTo(-1.5, 6);
  ctx.quadraticCurveTo(-3.5, 11, -0.8, 15);
  ctx.moveTo(1.8, 6);
  ctx.quadraticCurveTo(3.4, 10.5, 1, 14.5);
  ctx.strokeStyle = PP_STRAND;
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.restore();
  return true;
}

// ---------- 32: the ship's crew member ----------
// The crew member's look: the shipping company's flight crew, not a guard (Universal Postal Service, the site's name):
// a grey-blue jumpsuit, an orange cap and orange cuffs, a white envelope patch on the chest, a headset with a mic.
export const CREW_LOOK = Object.freeze({ skin: "#d8a07a", shirt: "#5f7896", sleeve: "#5f7896", pants: "#4d6481", cap: "#f08a24", shoes: "#2b2f3c" });
/**
 * The crew member (61): a grown-up (`h` tall: the hold draws everyone 2.2 times their bay size, so `h` is the bay's
 * grown-up height times that), built on the party's person drawing (party-art.js drawPerson) in the crew's look, with
 * what a flight crew wears drawn over: orange cuffs, a belt, the envelope patch and a headset. Feet at (x, y), facing
 * `f`.
 */
export function drawCrew(ctx, x, y, h, f = 1, t = 0) {
  drawPerson(ctx, x, y, h, CREW_LOOK, f, t);
  const k = h / 100,
    bob = Math.sin(t * 2 + x * 0.01) * h * 0.012;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(k * (f < 0 ? -1 : 1), k);
  const ow = Math.max(1, h * 0.022) / k;
  // a belt
  ctx.beginPath();
  ctx.roundRect(-15, -37, 30, 4, 1);
  ppPaint(ctx, "#2b2f3c", ow * 0.7);
  ctx.beginPath();
  ctx.roundRect(-2.5, -37.5, 5, 5, 1);
  ppPaint(ctx, "#ffcf33", ow * 0.5);
  // orange cuffs (the near arm hangs at his side; the far one behind)
  for (const cx of [-17.5, 17.5]) {
    ctx.beginPath();
    ctx.roundRect(cx - 3.8, -45, 7.6, 4, 1);
    ppPaint(ctx, "#f08a24", ow * 0.6);
  }
  // the envelope patch on the chest
  ctx.beginPath();
  ctx.roundRect(1.5, -66, 10, 7, 1);
  ppPaint(ctx, "#fffdf8", ow * 0.6);
  ctx.beginPath();
  ctx.moveTo(1.5, -66);
  ctx.lineTo(6.5, -62);
  ctx.lineTo(11.5, -66);
  ctx.strokeStyle = "#f08a24";
  ctx.lineWidth = 0.9;
  ctx.stroke();
  // the headset: a band over the cap, an earpiece, a mic on a thin arm to his mouth
  ctx.beginPath();
  ctx.arc(0, -84, 13.2, Math.PI * 1.08, Math.PI * 1.92);
  ctx.strokeStyle = PP_INK;
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(-11.5, -84, 3, 4, 0, 0, PP_TAU);
  ppPaint(ctx, "#2b2f3c", ow * 0.6);
  ctx.beginPath();
  ctx.moveTo(-11, -80);
  ctx.quadraticCurveTo(-8, -74, 2, -76);
  ctx.strokeStyle = PP_INK;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(3, -76, 1.6, 0, PP_TAU);
  ppPaint(ctx, "#2b2f3c", 0);
  ctx.restore();
  return true;
}
