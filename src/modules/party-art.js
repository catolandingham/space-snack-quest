/**
 * The party night's own drawings (party plan section 5, V1 to V15), drawn by the game on top of the locked hall
 * picture, which never changes. Every drawing here is shown to Brian on the picture sheet before it counts as his
 * look (tools/party-sheet.mjs). Positions are game positions (960 x 640) unless a function says otherwise.
 *
 * People drawn here (the bartender, the guards, the Croc Boys) are in the approved guests' style: flat colours, a
 * dark outline, a big round head and a rounded body, at the approved sheet's proportions (the teal guest is the
 * grown-up: head about a fifth of the height). The six approved guests themselves are pictures (guests.js).
 * Words come only from party-lines.js.
 */
import { partyLine } from "./party-lines.js";

export const INK = "#1e2430";
const TAU = Math.PI * 2;

// ---------- small shapes ----------
function rr(ctx, x, y, w, h, r, fill, line) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  if (fill) ((ctx.fillStyle = fill), ctx.fill());
  if (line) ((ctx.lineWidth = line), (ctx.strokeStyle = INK), ctx.stroke());
}
function oval(ctx, x, y, rx, ry, fill, line) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), 0, 0, TAU);
  if (fill) ((ctx.fillStyle = fill), ctx.fill());
  if (line) ((ctx.lineWidth = line), (ctx.strokeStyle = INK), ctx.stroke());
}
function line(ctx, pts, color, w) {
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.lineWidth = w;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}
function heart(ctx, x, y, s, fill) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.45, y - s, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.45, y - s, x + s, y - s * 0.3, x, y + s * 0.35);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = Math.max(1, s * 0.12);
  ctx.strokeStyle = INK;
  ctx.stroke();
}
/** Bold words drawn on the picture (the banner, the meter): at least 18 game pixels, so 14 on a phone-held tablet. */
export function words(ctx, text, x, y, size, color, align = "center", weight = 900) {
  ctx.font = `${weight} ${size}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

// ---------- people in the approved style ----------
/**
 * A person with feet at (x, y), `h` game pixels tall, facing us (`f` -1 turns them). `look` picks the colours and
 * the extras: { skin, shirt, pants, shoes, hair, cap, apron, badge, crocs, croc (a crocodile head), instrument,
 * armUp (0 to 1, one arm raised: dancing or pulling) }.
 */
export function drawPerson(ctx, x, y, h, look, f = 1, t = 0) {
  const k = h / 100,
    lw = Math.max(1, h * 0.022),
    bob = Math.sin(t * 2 + x * 0.01) * h * 0.012;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(k * (f < 0 ? -1 : 1), k);
  const ow = lw / k;
  oval(ctx, 0, 1, 16, 3, "rgba(30,36,48,.16)");
  // legs and shoes
  rr(ctx, -9, -34, 8, 32, 2, look.pants || "#3a3f52", ow);
  rr(ctx, 1, -34, 8, 32, 2, look.pants || "#3a3f52", ow);
  const shoe = look.crocs ? "#3fae4a" : look.shoes || "#2b2f3c";
  oval(ctx, -6, -1, 7, 3.5, shoe, ow);
  oval(ctx, 6, -1, 7, 3.5, shoe, ow);
  if (look.crocs) for (const sx of [-8, -4, 4, 8]) oval(ctx, sx, -1.5, 0.9, 0.9, "#1e5a25");
  // arms (behind the body), body
  const up = look.armUp || 0;
  rr(ctx, -21, -70, 7, 30, 3, look.sleeve || look.shirt, ow);
  oval(ctx, -17.5, -38, 3.6, 3.6, look.skin, ow);
  ctx.save();
  ctx.translate(17.5, -68);
  ctx.rotate(-up * 2.6);
  rr(ctx, -3.5, -2, 7, 30, 3, look.sleeve || look.shirt, ow);
  oval(ctx, 0, 30, 3.6, 3.6, look.skin, ow);
  ctx.restore();
  rr(ctx, -15, -72, 30, 40, 7, look.shirt, ow);
  if (look.bandShirt) {
    // the band's matching shirt: a white stripe with a little crocodile tooth zig-zag
    rr(ctx, -15, -58, 30, 7, 1, "#fffdf8");
    line(ctx, [-12, -54, -9, -57, -6, -54, -3, -57, 0, -54, 3, -57, 6, -54, 9, -57, 12, -54], "#3fae4a", 1.4);
  }
  if (look.apron) {
    rr(ctx, -11, -62, 22, 36, 3, "#fffdf8", ow * 0.8);
    rr(ctx, -6, -48, 12, 7, 2, "#e8e2d4", ow * 0.6);
    line(ctx, [-11, -62, -6, -72], INK, ow * 0.7);
    line(ctx, [11, -62, 6, -72], INK, ow * 0.7);
  }
  if (look.badge) oval(ctx, 7, -62, 2.6, 2.6, "#ffcf33", ow * 0.7);
  if (look.instrument === "guitar") {
    ctx.save();
    ctx.translate(2, -48);
    ctx.rotate(-0.55);
    oval(ctx, -4, 4, 9, 7, "#e07b00", ow);
    oval(ctx, -4, 4, 2.5, 2.5, INK);
    rr(ctx, 3, 1.5, 22, 4, 1, "#8b5a3c", ow);
    ctx.restore();
  } else if (look.instrument === "keytar") {
    rr(ctx, -20, -52, 40, 9, 2, "#e5533d", ow);
    for (let i = -16; i <= 14; i += 5) rr(ctx, i, -50, 3, 5, 0.5, "#fffdf8");
  }
  // head
  const hy = -84,
    hr = 12;
  if (look.croc) {
    // a crocodile head: round top, long snout with teeth, eyes on bumps
    oval(ctx, -5, hy - 8, 4, 4, "#3fae4a", ow);
    oval(ctx, 5, hy - 8, 4, 4, "#3fae4a", ow);
    rr(ctx, -12, hy - 6, 24, 18, 8, "#3fae4a", ow);
    rr(ctx, 2, hy + 1, 26, 10, 4, "#3fae4a", ow);
    for (let i = 6; i < 26; i += 5) line(ctx, [i, hy + 11, i + 1.6, hy + 13.5, i + 3.2, hy + 11], "#fffdf8", 1.4);
    oval(ctx, -5, hy - 8, 1.6, 1.6, INK);
    oval(ctx, 5, hy - 8, 1.6, 1.6, INK);
    oval(ctx, 25, hy + 3, 1, 1, INK);
  } else {
    oval(ctx, 0, hy, hr, hr, look.skin, ow);
    if (look.hair) {
      ctx.beginPath();
      ctx.arc(0, hy - 1, hr, Math.PI * 1.05, Math.PI * 1.95);
      ctx.fillStyle = look.hair;
      ctx.fill();
      ctx.lineWidth = ow;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
    if (look.bun) oval(ctx, 0, hy - hr - 3, 5, 4, look.hair || "#4a3020", ow);
    if (look.antennae) {
      line(ctx, [-4, hy - hr, -5, hy - hr - 8], INK, ow);
      line(ctx, [4, hy - hr, 5, hy - hr - 8], INK, ow);
    }
    oval(ctx, -4, hy + 1, 1.8, 1.8, INK);
    oval(ctx, 4, hy + 1, 1.8, 1.8, INK);
    ctx.beginPath();
    ctx.arc(0, hy + 4, 3.5, 0.3, Math.PI - 0.3);
    ctx.lineWidth = ow * 0.8;
    ctx.strokeStyle = INK;
    ctx.stroke();
    if (look.cap) {
      rr(ctx, -12, hy - hr - 1, 24, 7, 3, look.cap, ow);
      rr(ctx, -2, hy - hr + 3, 17, 3.5, 1.5, look.cap, ow);
      oval(ctx, 0, hy - hr + 2, 2, 2, "#ffcf33");
    }
  }
  ctx.restore();
}

// The new cast's looks (party plan V3 and V4).
export const LOOKS = Object.freeze({
  bartender: { skin: "#e7b48f", shirt: "#e5533d", pants: "#3a3f52", hair: "#4a3020", bun: true, apron: true },
  guard: { skin: "#c98b62", shirt: "#2f5fb3", pants: "#24407a", cap: "#1d3770", badge: true },
  // The Croc Boys, look A: three guest types in matching band shirts and green Crocs.
  bandA: [
    { skin: "#8b5a3c", shirt: "#3fae4a", pants: "#2b2f3c", hair: "#2b1d14", bandShirt: true, crocs: true, instrument: "guitar" },
    { skin: "#8ea6bf", shirt: "#3fae4a", pants: "#2b2f3c", antennae: true, bandShirt: true, crocs: true, instrument: "keytar" },
    { skin: "#e7b48f", shirt: "#3fae4a", pants: "#2b2f3c", hair: "#7a4a24", bandShirt: true, crocs: true, instrument: "drum" },
  ],
  // Look B: crocodile-headed aliens in Crocs.
  bandB: [
    { croc: true, skin: "#3fae4a", shirt: "#ffcf33", pants: "#2b2f3c", crocs: true, instrument: "guitar" },
    { croc: true, skin: "#3fae4a", shirt: "#3478f6", pants: "#2b2f3c", crocs: true, instrument: "keytar" },
    { croc: true, skin: "#3fae4a", shirt: "#e5533d", pants: "#2b2f3c", crocs: true, instrument: "drum" },
  ],
});

/** A small drum on a stand in front of a band member (look A or B, the third one). */
export function drawDrum(ctx, x, y, h) {
  const k = h / 100;
  rr(ctx, x - 13 * k, y - 32 * k, 26 * k, 18 * k, 4 * k, "#e5533d", Math.max(1, 2 * k));
  oval(ctx, x, y - 32 * k, 13 * k, 3.5 * k, "#fffdf8", Math.max(1, 2 * k));
  line(ctx, [x - 8 * k, y - 14 * k, x - 12 * k, y], INK, Math.max(1, 2 * k));
  line(ctx, [x + 8 * k, y - 14 * k, x + 12 * k, y], INK, Math.max(1, 2 * k));
}

/** The three Croc Boys standing at their spots, look "A" or "B"; `playing` makes them bob and strum. */
export function drawBand(ctx, spots, h, lookId, t, playing) {
  const looks = lookId === "B" ? LOOKS.bandB : LOOKS.bandA;
  spots.forEach((s, i) => {
    const jump = playing ? Math.abs(Math.sin(t * 6 + i)) * h * 0.04 : 0;
    drawPerson(ctx, s.x, s.y - jump, h, { ...looks[i], armUp: playing && i === 0 ? 0.3 + 0.2 * Math.sin(t * 8) : 0 }, 1, playing ? t : 0);
    looks[i].instrument === "drum" && drawDrum(ctx, s.x, s.y, h);
  });
}

// ---------- the banner (V1) ----------
/** The one cloth banner on two ropes from the ceiling over the stage. `glow` (0 to 1) lights it when a line names it. */
export function drawBanner(ctx, box, glow, t = 0) {
  const { x0, x1, y0, y1 } = box,
    w = x1 - x0,
    sag = 6;
  line(ctx, [x0 + 14, 0, x0 + 14, y0 + 4], INK, 2);
  line(ctx, [x1 - 14, 0, x1 - 14, y0 + 4], INK, 2);
  ctx.save();
  if (glow > 0) {
    ctx.shadowColor = "rgba(255,207,51," + (0.6 + 0.4 * Math.sin(t * 6)) * glow + ")";
    ctx.shadowBlur = 26 * glow;
  }
  // The cloth: a gentle sag along the bottom edge.
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y0);
  ctx.lineTo(x1, y1);
  ctx.quadraticCurveTo(x0 + w / 2, y1 + sag, x0, y1);
  ctx.closePath();
  ctx.fillStyle = "#3478f6";
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.restore();
  const mid = y0 + (y1 - y0) * 0.33,
    low = y0 + (y1 - y0) * 0.72;
  rr(ctx, x0 + 34, low - 11, w - 68, 22, 4, "#fffdf8");
  words(ctx, partyLine("banner-1"), x0 + w / 2, mid, 18, "#ffffff");
  words(ctx, partyLine("banner-2"), x0 + w / 2, low + 1, 16, "#e5533d");
  // a little robot doodle at each end
  for (const rx of [x0 + 17, x1 - 17]) {
    rr(ctx, rx - 8, mid - 4, 16, 13, 3, "#dfe4ea", 1.5);
    oval(ctx, rx - 3.5, mid + 2, 1.6, 1.6, INK);
    oval(ctx, rx + 3.5, mid + 2, 1.6, 1.6, INK);
    line(ctx, [rx, mid - 4, rx, mid - 10], INK, 1.5);
    oval(ctx, rx, mid - 11, 2, 2, "#e5533d");
    rr(ctx, rx - 6, mid + 11, 12, 12, 2, "#dfe4ea", 1.5);
  }
}

// ---------- the door at home (V2) ----------
/** Music notes drifting in under (and round) Squatch's home door, and the door's edge thumping to the beat. */
export function drawDoorNotes(ctx, door, t) {
  const cx = (door.x0 + door.x1) / 2,
    beat = Math.max(0, Math.sin(t * Math.PI * 2 * 2)) ** 6;
  // thump lines at the door edge
  for (const s of [-1, 1]) line(ctx, [door.x0 - 4 - beat * 8, (door.y0 + door.y1) / 2 + s * 20, door.x0 - 12 - beat * 14, (door.y0 + door.y1) / 2 + s * 30], "rgba(30,36,48," + (0.25 + 0.6 * beat) + ")", 3);
  const colors = ["#ff5fa8", "#3478f6", "#e07b00", "#2bc48a"];
  for (let i = 0; i < 4; i++) {
    const k = (t * 0.45 + i / 4) % 1,
      x = cx - k * 150,
      y = door.y1 - 18 - k * 60 + Math.sin(k * 9 + i) * 8,
      a = k < 0.15 ? k / 0.15 : k > 0.75 ? (1 - k) / 0.25 : 1;
    ctx.save();
    ctx.globalAlpha = a;
    drawNote(ctx, x, y, 9, colors[i]);
    ctx.restore();
  }
}
/** One music note, as a shape (a head and a stem with a flag). */
export function drawNote(ctx, x, y, s, color) {
  oval(ctx, x, y, s * 0.6, s * 0.45, color, 2);
  line(ctx, [x + s * 0.55, y, x + s * 0.55, y - s * 1.6, x + s * 1.1, y - s * 1.2], INK, 2);
}

// ---------- the flyer (V11) ----------
/** A Bleep-Bloop flyer: white paper with a robot doodle, `s` across, turned by `rot`. */
export function drawFlyer(ctx, x, y, s, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot || 0);
  rr(ctx, -s / 2, -s * 0.65, s, s * 1.3, 2, "#fffdf8", Math.max(1, s * 0.08));
  rr(ctx, -s * 0.25, -s * 0.4, s * 0.5, s * 0.38, 1.5, "#3478f6");
  oval(ctx, -s * 0.1, -s * 0.22, s * 0.05, s * 0.05, "#fffdf8");
  oval(ctx, s * 0.1, -s * 0.22, s * 0.05, s * 0.05, "#fffdf8");
  line(ctx, [-s * 0.3, s * 0.15, s * 0.3, s * 0.15], "#e5533d", Math.max(1, s * 0.08));
  line(ctx, [-s * 0.3, s * 0.35, s * 0.2, s * 0.35], "#8a93a3", Math.max(1, s * 0.06));
  ctx.restore();
}

// ---------- the vent (V9) ----------
/** Soft swirls always turning slowly inward over the locked picture's own swirls. */
export function drawVentSwirl(ctx, vent, t) {
  ctx.save();
  ctx.lineCap = "round";
  for (let arm = 0; arm < 4; arm++) {
    for (let i = 0; i < 6; i++) {
      // Each dash moves from the outside toward the grille, then starts again.
      const k = 1 - ((t * 0.35 + i / 6) % 1),
        a0 = arm * (TAU / 4) + k * 2.2 + t * 0.2,
        r = 18 + k * 80;
      ctx.beginPath();
      ctx.ellipse(vent.x, vent.y, r, r * 0.55, 0, a0, a0 + 0.35);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `rgba(90,160,230,${0.15 + 0.5 * (1 - k)})`;
      ctx.stroke();
    }
  }
  ctx.restore();
}
/** A tuft of brown fur (Squatch's), `s` across. */
export function drawTuft(ctx, x, y, s, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot || 0);
  const lw = Math.max(1, s * 0.07);
  // a fluffy clump: three overlapping puffs with wispy hairs coming off it
  for (const [px, py, pr] of [
    [-0.22, 0.05, 0.3],
    [0.2, 0.02, 0.3],
    [0, -0.15, 0.32],
  ])
    oval(ctx, px * s, py * s, pr * s, pr * s * 0.9, "#6b4428", lw);
  for (const [px, py, pr] of [
    [-0.22, 0.05, 0.3],
    [0.2, 0.02, 0.3],
    [0, -0.15, 0.32],
  ])
    oval(ctx, px * s, py * s, pr * s - lw, pr * s * 0.9 - lw, "#6b4428");
  for (const [x0, y0, x1, y1] of [
    [-0.45, -0.05, -0.62, -0.25],
    [0.45, -0.1, 0.62, -0.32],
    [0.05, -0.45, 0.12, -0.66],
    [-0.15, -0.42, -0.3, -0.6],
  ])
    line(ctx, [x0 * s, y0 * s, x1 * s, y1 * s], "#6b4428", Math.max(1.5, s * 0.08));
  line(ctx, [-0.1 * s, -0.1 * s, -0.15 * s, -0.25 * s], "#9a6a40", Math.max(1, s * 0.06));
  line(ctx, [0.12 * s, -0.05 * s, 0.18 * s, -0.22 * s], "#9a6a40", Math.max(1, s * 0.06));
  ctx.restore();
}

// ---------- warnings (V15) ----------
/**
 * The big warning sign over Squatch: a white disc with a red edge, about his head's height across twice over, with
 * `inside` (a function drawing the warning's own icon, centred, `s` across) in it. It pops in with `k` (0 to 1).
 */
export function drawWarning(ctx, x, y, s, inside, k = 1, t = 0) {
  const pop = 0.7 + 0.3 * Math.min(1, k) + 0.05 * Math.sin(t * 12);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop, pop);
  oval(ctx, 0, 0, s * 0.62, s * 0.62, "#fffdf8");
  ctx.lineWidth = Math.max(2, s * 0.08);
  ctx.strokeStyle = "#e5533d";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-s * 0.12, s * 0.58);
  ctx.lineTo(0, s * 0.8);
  ctx.lineTo(s * 0.12, s * 0.58);
  ctx.fillStyle = "#e5533d";
  ctx.fill();
  inside(ctx, s * 0.8);
  ctx.restore();
}
/** "?" or "!" over a watcher: at least as tall as Squatch's head, in a white bubble so it reads on any floor. */
export function drawMark(ctx, x, y, mark, size, t = 0) {
  const s = size,
    wob = mark === "!" ? Math.sin(t * 18) * s * 0.05 : 0;
  ctx.save();
  ctx.translate(x + wob, y);
  oval(ctx, 0, 0, s * 0.46, s * 0.56, "#fffdf8", Math.max(1.5, s * 0.07));
  words(ctx, mark, 0, s * 0.04, s * 0.85, mark === "!" ? "#e5533d" : "#d99a00");
  ctx.restore();
}
/** "FUR!" shouted by whoever saw him: a jagged shout burst over their head. */
export function drawShout(ctx, x, y, t) {
  const s = 1 + 0.06 * Math.sin(t * 20);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU,
      r = i % 2 ? 26 : 36;
    ctx.lineTo(Math.cos(a) * r * 1.5, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fillStyle = "#ffcf33";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  words(ctx, partyLine("guest-fur"), 0, 1, 22, "#e5533d");
  ctx.restore();
}

// ---------- the wall alarm (V12) ----------
/**
 * The red FUR alarm's light flashing (drawn over the locked picture's alarm, `box`), and the bell's ring lines.
 */
export function drawAlarmFlash(ctx, box, t) {
  const on = Math.sin(t * 14) > 0;
  const cx = (box.x0 + box.x1) / 2,
    cy = (box.y0 + box.y1) / 2;
  if (on) {
    const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, 70);
    g.addColorStop(0, "rgba(255,60,40,.55)");
    g.addColorStop(1, "rgba(255,60,40,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - 70, cy - 70, 140, 140);
  }
  for (const s of [-1, 1])
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, 16 + i * 9 + (on ? 3 : 0), s < 0 ? Math.PI * 0.75 : -Math.PI * 0.25, s < 0 ? Math.PI * 1.25 : Math.PI * 0.25);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#e5533d";
      ctx.stroke();
    }
}
/**
 * The close-up of a hand pulling the alarm, filling a `w` x `h` screen: the locked hall's own alarm, enlarged from
 * `picture` (its box `src` in picture pixels), and the guest's hand pulling the handle down (`k` 0 to 1).
 */
export function drawAlarmCloseUp(ctx, w, h, picture, src, k, t) {
  ctx.fillStyle = "#f4f1ea";
  ctx.fillRect(0, 0, w, h);
  const s = Math.min(w / (src.x1 - src.x0 + 40), h / (src.y1 - src.y0 + 60)) * 0.8,
    cw = (src.x1 - src.x0) * s,
    ch = (src.y1 - src.y0) * s,
    x = (w - cw) / 2,
    y = (h - ch) / 2 - h * 0.05;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  if (picture && picture.complete && picture.naturalWidth) ctx.drawImage(picture, src.x0, src.y0, src.x1 - src.x0, src.y1 - src.y0, x, y, cw, ch);
  else rr(ctx, x, y, cw, ch, 8, "#e5533d", 4);
  ctx.restore();
  const on = Math.sin(t * 14) > 0 && k >= 1;
  if (on) {
    const g = ctx.createRadialGradient(w / 2, y + ch / 2, 10, w / 2, y + ch / 2, Math.max(w, h) * 0.6);
    g.addColorStop(0, "rgba(255,60,40,.45)");
    g.addColorStop(1, "rgba(255,60,40,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  // The hand: a guest's teal sleeve coming up from the bottom, the brown hand's fingers hooked over the handle,
  // pulling it down.
  const hx = x + cw * 0.5,
    hy = y + ch * (0.5 + 0.2 * Math.min(1, k)),
    a = Math.max(26, cw * 0.2);
  rr(ctx, hx - a * 0.55, hy + a * 0.35, a * 1.1, h - hy, a * 0.3, "#4b9a92", 5);
  rr(ctx, hx - a * 0.62, hy - a * 0.2, a * 1.24, a * 0.85, a * 0.35, "#8b5a3c", 5);
  for (let i = 0; i < 4; i++) rr(ctx, hx - a * 0.6 + i * a * 0.31, hy - a * 0.62, a * 0.27, a * 0.6, a * 0.13, "#8b5a3c", 4);
  if (k >= 1) for (const sx of [-1, 1]) line(ctx, [w / 2 + sx * cw * 0.62, y + ch * 0.3, w / 2 + sx * cw * 0.8, y + ch * 0.2], "#e5533d", 6);
}

// ---------- the hallway doorway (V8) ----------
/** Mops's long white beard swishing past the hallway doorway (`door`), seen only inside the doorway. */
export function drawBeardInDoorway(ctx, door, t, show = 1) {
  if (show <= 0) return;
  const swing = Math.sin(t * 1.6);
  ctx.save();
  ctx.beginPath();
  ctx.rect(door.x0 - 30, door.y0, door.x1 - door.x0 + 60, door.y1 - door.y0);
  ctx.clip();
  const bx = door.x0 + 6 + swing * 18,
    by = door.y1 - 6;
  ctx.globalAlpha = show;
  ctx.beginPath();
  ctx.moveTo(bx - 26, door.y0 + 10);
  ctx.quadraticCurveTo(bx - 32, by - 30, bx - 14 + swing * 8, by);
  ctx.quadraticCurveTo(bx + 2, by - 10, bx + 14 - swing * 6, by + 2);
  ctx.quadraticCurveTo(bx + 18, by - 40, bx + 10, door.y0 + 10);
  ctx.closePath();
  ctx.fillStyle = "#f4f5f8";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#9aa1ad";
  ctx.stroke();
  for (let i = 0; i < 3; i++) line(ctx, [bx - 18 + i * 9, door.y0 + 26, bx - 14 + i * 9 + swing * 4, by - 14], "#c9ced8", 1.5);
  ctx.restore();
}

// ---------- lights (V10) ----------
// The room's light for each of the band's three songs (party plan P6): a soft tint over the hall.
export const SONG_LIGHTS = Object.freeze(["rgba(255,95,168,.16)", "rgba(43,196,170,.16)", "rgba(255,190,60,.18)"]);
/** The lights dimmed, the dance spotlight on the floor at `spot`, the song's colour over the room. */
export function drawPartyLights(ctx, spot, song, t, dim = 1) {
  ctx.save();
  ctx.fillStyle = `rgba(12,16,32,${0.32 * dim})`;
  ctx.beginPath();
  ctx.rect(0, 0, 960, 640);
  ctx.ellipse(spot.x, spot.y, spot.rx, spot.ry, 0, 0, TAU, true);
  ctx.fill("evenodd");
  if (song >= 0) {
    ctx.fillStyle = SONG_LIGHTS[song % 3];
    ctx.fillRect(0, 0, 960, 640);
  }
  const g = ctx.createRadialGradient(spot.x, spot.y, 4, spot.x, spot.y, spot.rx);
  g.addColorStop(0, "rgba(255,250,210,.38)");
  g.addColorStop(1, "rgba(255,250,210,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(spot.x, spot.y, spot.rx, spot.ry, 0, 0, TAU);
  ctx.fill();
  // the beam from above
  ctx.fillStyle = `rgba(255,250,210,${0.08 + 0.03 * Math.sin(t * 3)})`;
  ctx.beginPath();
  ctx.moveTo(spot.x - 18, 0);
  ctx.lineTo(spot.x + 18, 0);
  ctx.lineTo(spot.x + spot.rx, spot.y);
  ctx.lineTo(spot.x - spot.rx, spot.y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ---------- the camera (V14) ----------
/** The camera on its tripod, standing at (x, y) and pointing at `aim`; its red light blinks while `counting`. */
export function drawTripod(ctx, x, y, aim, counting, t) {
  const a = Math.atan2(aim.y - (y - 46), aim.x - x);
  line(ctx, [x, y - 34, x - 14, y], "#6b6256", 3);
  line(ctx, [x, y - 34, x + 13, y], "#6b6256", 3);
  line(ctx, [x, y - 34, x + 1, y + 4], "#6b6256", 3);
  ctx.save();
  ctx.translate(x, y - 40);
  ctx.rotate(a);
  rr(ctx, -12, -8, 22, 15, 3, "#1e2430", 2);
  rr(ctx, 9, -5, 8, 9, 2, "#8fdcff", 2);
  ctx.restore();
  if (counting && Math.sin(t * 8) > 0) oval(ctx, x - 6, y - 51, 3, 3, "#ff3b30", 1);
}

// ---------- Mops's heart cone (V13) ----------
/** Mops's warm cone, as big as everyone's, with hearts floating up in it (PR #35's look, R98 and R104). */
export function drawHeartCone(ctx, ox, oy, a, half, len, t) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.arc(ox, oy, len, a - half, a + half);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,140,180,.30)";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(214,70,120,.8)";
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const k = (t * 0.4 + i / 5) % 1,
      d = 30 + k * (len - 40),
      off = Math.sin(i * 2.1 + t) * half * 0.6;
    heart(ctx, ox + Math.cos(a + off) * d, oy + Math.sin(a + off) * d - k * 10, 7 + 3 * Math.sin(k * Math.PI), "#ff6fa0");
  }
  ctx.restore();
}

// ---------- the outfit (P5) ----------
/**
 * The eight dress-up pieces, each drawn centred in a box `w` across. Natural height is `w * h` below. They are big
 * real things (party plan P5), drawn the same in the closet, on Squatch in the dress-up, and on Squatch in the hall.
 */
export const PIECES = Object.freeze([
  { id: "tophat", h: 0.95 },
  { id: "shades", h: 0.38 },
  { id: "shirt", h: 0.8 },
  { id: "boots", h: 0.62 },
  { id: "scarf", h: 0.6 },
  { id: "bow", h: 0.45 },
  { id: "stache", h: 0.35 },
  { id: "tutu", h: 0.48 },
]);
export function drawPiece(ctx, id, x, y, w, rot = 0) {
  const p = PIECES.find((q) => q.id === id);
  if (!p) return;
  const h = w * p.h,
    lw = Math.max(1, w * 0.045);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  if (id === "tophat") {
    rr(ctx, -w * 0.5, h * 0.3, w, h * 0.18, h * 0.08, "#1e2430", lw);
    rr(ctx, -w * 0.3, -h * 0.5, w * 0.6, h * 0.84, h * 0.06, "#2b2f3c", lw);
    rr(ctx, -w * 0.3, h * 0.12, w * 0.6, h * 0.14, 0, "#e5533d");
  } else if (id === "shades") {
    rr(ctx, -w * 0.48, -h * 0.3, w * 0.42, h * 0.75, h * 0.3, "#1e2430", lw);
    rr(ctx, w * 0.06, -h * 0.3, w * 0.42, h * 0.75, h * 0.3, "#1e2430", lw);
    line(ctx, [-w * 0.06, -h * 0.1, w * 0.06, -h * 0.1], "#1e2430", lw * 1.5);
    line(ctx, [-w * 0.36, -h * 0.1, -w * 0.24, h * 0.05], "#8a93a3", lw);
    line(ctx, [w * 0.18, -h * 0.1, w * 0.3, h * 0.05], "#8a93a3", lw);
  } else if (id === "shirt") {
    ctx.beginPath();
    ctx.moveTo(-w * 0.22, -h * 0.5);
    ctx.lineTo(-w * 0.5, -h * 0.28);
    ctx.lineTo(-w * 0.38, -h * 0.05);
    ctx.lineTo(-w * 0.3, -h * 0.12);
    ctx.lineTo(-w * 0.3, h * 0.5);
    ctx.lineTo(w * 0.3, h * 0.5);
    ctx.lineTo(w * 0.3, -h * 0.12);
    ctx.lineTo(w * 0.38, -h * 0.05);
    ctx.lineTo(w * 0.5, -h * 0.28);
    ctx.lineTo(w * 0.22, -h * 0.5);
    ctx.quadraticCurveTo(0, -h * 0.3, -w * 0.22, -h * 0.5);
    ctx.closePath();
    ctx.fillStyle = "#ff8a3d";
    ctx.fill();
    ctx.lineWidth = lw;
    ctx.strokeStyle = INK;
    ctx.stroke();
    for (const [fx, fy, c] of [
      [-0.15, -0.05, "#2bc48a"],
      [0.14, 0.18, "#3478f6"],
      [-0.1, 0.32, "#ffcf33"],
      [0.16, -0.2, "#ff5fa8"],
    ])
      oval(ctx, w * fx, h * fy, w * 0.07, w * 0.07, c);
  } else if (id === "boots") {
    for (const s of [-1, 1]) {
      rr(ctx, s * w * 0.27 - w * 0.17, -h * 0.5, w * 0.3, h * 0.8, w * 0.04, "#ffcf33", lw);
      rr(ctx, s * w * 0.27 - w * 0.17 + (s > 0 ? 0 : -w * 0.08), h * 0.15, w * 0.38, h * 0.35, h * 0.12, "#ffcf33", lw);
      line(ctx, [s * w * 0.27 - w * 0.17, -h * 0.25, s * w * 0.27 + w * 0.13, -h * 0.25], "#d9a514", lw);
    }
  } else if (id === "scarf") {
    rr(ctx, -w * 0.5, -h * 0.5, w, h * 0.4, h * 0.18, "#e5533d", lw);
    rr(ctx, w * 0.12, -h * 0.25, w * 0.22, h * 0.75, w * 0.05, "#e5533d", lw);
    for (let i = 0; i < 4; i++) line(ctx, [-w * 0.4 + i * w * 0.25, -h * 0.48, -w * 0.4 + i * w * 0.25, -h * 0.14], "#fffdf8", lw);
  } else if (id === "bow") {
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(s * w * 0.5, -h * 0.5);
      ctx.lineTo(s * w * 0.5, h * 0.5);
      ctx.closePath();
      ctx.fillStyle = "#3478f6";
      ctx.fill();
      ctx.lineWidth = lw;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
    oval(ctx, 0, 0, w * 0.1, h * 0.28, "#ffcf33", lw);
  } else if (id === "stache") {
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.3);
      ctx.quadraticCurveTo(s * w * 0.3, -h * 0.7, s * w * 0.5, h * 0.1);
      ctx.quadraticCurveTo(s * w * 0.28, h * 0.1, 0, h * 0.4);
      ctx.closePath();
      ctx.fillStyle = "#3a2416";
      ctx.fill();
      ctx.lineWidth = lw;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
  } else if (id === "tutu") {
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const x0 = -w * 0.5 + (i / 8) * w;
      i === 0 ? ctx.moveTo(x0, h * 0.3) : ctx.lineTo(x0, i % 2 ? h * 0.5 : h * 0.3);
    }
    ctx.lineTo(w * 0.3, -h * 0.3);
    ctx.lineTo(-w * 0.3, -h * 0.3);
    ctx.closePath();
    ctx.fillStyle = "#ffb3d1";
    ctx.fill();
    ctx.lineWidth = lw;
    ctx.strokeStyle = INK;
    ctx.stroke();
    rr(ctx, -w * 0.3, -h * 0.4, w * 0.6, h * 0.2, h * 0.08, "#ff5fa8", lw);
  }
  ctx.restore();
}

/**
 * Where the four body spots are on Squatch, in his own units (feet at 0, up is negative; squatch-art.js shapes):
 * the middle of the spot and how wide a piece is drawn there. A head piece sits on top of his head.
 */
export const BODY_SPOTS = Object.freeze({
  head: { x: 0, y: -47, w: 26, sit: true },
  face: { x: 0, y: -29, w: 21 },
  body: { x: 0, y: -14, w: 25 },
  legs: { x: 0, y: -3, w: 21 },
});
/**
 * Draws the outfit on Squatch standing at feet (x, y), `scale` game pixels to his unit, facing `f`. `outfit` is
 * { head, face, body, legs } -> piece id or "". `tip` is { spot, a } to draw one piece tipping (the vent's tug).
 */
export function drawOutfit(ctx, x, y, scale, outfit, f = 1, tip = null) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * (f < 0 ? -1 : 1), scale);
  for (const spot of ["legs", "body", "face", "head"]) {
    const id = outfit && outfit[spot];
    if (!id) continue;
    const s = BODY_SPOTS[spot],
      p = PIECES.find((q) => q.id === id),
      h = s.w * (p ? p.h : 0.5),
      a = tip && tip.spot === spot ? tip.a : 0;
    drawPiece(ctx, id, s.x, s.sit ? s.y - h / 2 + 3 : s.y, s.w, a);
  }
  ctx.restore();
}
