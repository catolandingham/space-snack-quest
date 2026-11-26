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
import { questionLook } from "./party-question.js";
import { partyLine } from "./party-lines.js";
import { drawShirt, drawShirtSleeves } from "./party-shirt-art.js";

export const INK = "#1e2430";
const TAU = Math.PI * 2;

// ---------- small shapes ----------
export function rr(ctx, x, y, w, h, r, fill, line) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  if (fill) ((ctx.fillStyle = fill), ctx.fill());
  if (line) ((ctx.lineWidth = line), (ctx.strokeStyle = INK), ctx.stroke());
}
export function oval(ctx, x, y, rx, ry, fill, line) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), 0, 0, TAU);
  if (fill) ((ctx.fillStyle = fill), ctx.fill());
  if (line) ((ctx.lineWidth = line), (ctx.strokeStyle = INK), ctx.stroke());
}
export function line(ctx, pts, color, w) {
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.lineWidth = w;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
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
 * armUp (0 to 1, one arm raised: dancing or pulling), lean (radians: his upper body leans forward from the hips),
 * headTurn (-1 to 1: his eyes, mouth and cap peak turn back or forward), torch (he holds a flashlight at his chest,
 * pointing the way he faces: TORCH) }.
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
  if (look.croc) {
    // a thick crocodile tail behind the legs, with darker bumps along it
    ctx.beginPath();
    ctx.moveTo(-4, -40);
    ctx.quadraticCurveTo(-20, -30, -34, -4);
    ctx.quadraticCurveTo(-30, -2, -26, -6);
    ctx.quadraticCurveTo(-14, -24, 4, -30);
    ctx.closePath();
    ctx.fillStyle = "#3fae4a";
    ctx.fill();
    ctx.lineWidth = ow;
    ctx.strokeStyle = INK;
    ctx.stroke();
    for (const [tx, ty] of [
      [-14, -31],
      [-21, -23],
      [-27, -14],
    ])
      oval(ctx, tx, ty, 2, 1.4, "#2a7a33");
  }
  // legs and shoes
  rr(ctx, -9, -34, 8, 32, 2, look.pants || "#3a3f52", ow);
  rr(ctx, 1, -34, 8, 32, 2, look.pants || "#3a3f52", ow);
  const shoe = look.crocs ? "#3fae4a" : look.shoes || "#2b2f3c";
  oval(ctx, -6, -1, 7, 3.5, shoe, ow);
  oval(ctx, 6, -1, 7, 3.5, shoe, ow);
  if (look.crocs) for (const sx of [-8, -4, 4, 8]) oval(ctx, sx, -1.5, 0.9, 0.9, "#1e5a25");
  // leaning in to look: everything above the hips tips forward (the way he faces)
  const lean = look.lean || 0,
    turn = (look.headTurn || 0) * 4;
  ctx.save();
  if (lean) (ctx.translate(0, -34), ctx.rotate(lean), ctx.translate(0, 34));
  // arms (behind the body), body
  const up = look.armUp || 0;
  rr(ctx, -21, -70, 7, 30, 3, look.sleeve || look.shirt, ow);
  oval(ctx, -17.5, -38, 3.6, 3.6, look.skin, ow);
  if (!look.torch) {
    ctx.save();
    ctx.translate(17.5, -68);
    ctx.rotate(-up * 2.6);
    rr(ctx, -3.5, -2, 7, 30, 3, look.sleeve || look.shirt, ow);
    oval(ctx, 0, 30, 3.6, 3.6, look.skin, ow);
    ctx.restore();
  }
  rr(ctx, -15, -72, 30, 40, 7, look.shirt, ow);
  if (look.croc) for (let i = 0; i < 4; i++) oval(ctx, -15, -68 + i * 9, 2.2, 3, "#2a7a33", ow * 0.6); // ridges down his back
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
  if (look.torch) {
    // his near arm bent across his chest, the flashlight in his hand (a grey barrel, a wide head, a lit lens)
    ctx.save();
    ctx.translate(15, -66);
    ctx.rotate(0.55);
    rr(ctx, -3.5, -2, 7, 19, 3, look.sleeve || look.shirt, ow);
    ctx.restore();
    rr(ctx, TORCH.x - 13, TORCH.y - 2.2, 9, 4.4, 1.5, "#8a93a3", ow);
    rr(ctx, TORCH.x - 5, TORCH.y - 3.6, 5, 7.2, 1.5, "#5c6472", ow);
    oval(ctx, TORCH.x, TORCH.y, 1.6, 3.4, "#fff3a8", ow * 0.8);
    oval(ctx, TORCH.x - 10, TORCH.y + 0.5, 3.4, 3.4, look.skin, ow);
  }
  // head
  const hy = -84,
    hr = 12;
  if (look.croc) {
    // A crocodile head seen side on (Brian 2026-11-24: "they don't look like crocs"): a long flat snout, longer
    // than the head is tall, a row of white zig-zag teeth along the jaw, two bumpy eyes on top, nostril bumps at
    // the tip, and darker green ridges along the head.
    const G = "#3fae4a",
      D = "#2a7a33";
    rr(ctx, -13, hy - 9, 22, 19, 7, G, ow); // the back of the head
    rr(ctx, 2, hy - 3, 34, 8, 3, G, ow); // upper jaw: long and flat
    rr(ctx, 2, hy + 5, 31, 6, 3, G, ow); // lower jaw
    // teeth: a white zig-zag where the jaws meet
    ctx.beginPath();
    ctx.moveTo(5, hy + 5);
    for (let i = 0; i < 7; i++) (ctx.lineTo(7 + i * 4, hy + 8.2), ctx.lineTo(9 + i * 4, hy + 5));
    ctx.closePath();
    ctx.fillStyle = "#fffdf8";
    ctx.fill();
    ctx.lineWidth = ow * 0.6;
    ctx.strokeStyle = INK;
    ctx.stroke();
    // nostril bumps at the snout tip
    oval(ctx, 32, hy - 4, 2.6, 2, G, ow * 0.8);
    oval(ctx, 32.5, hy - 4.4, 0.9, 0.7, INK);
    // eyes on bumps on top of the head
    for (const ex of [-6, 2]) {
      oval(ctx, ex, hy - 10, 4.4, 4.2, G, ow);
      oval(ctx, ex, hy - 10.5, 2.4, 2.4, "#fffdf8");
      oval(ctx, ex + 0.8, hy - 10.5, 1.3, 1.6, INK);
    }
    // darker ridges along the head and snout
    for (const [rx, ry] of [
      [-11, -4],
      [-8, 0],
      [8, -3],
      [14, -3],
      [20, -3],
    ])
      oval(ctx, rx, hy + ry, 1.6, 1.1, D);
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
    // his face: turned with `headTurn` (the eyes, the mouth, the cap's peak and its badge slide the way he looks)
    oval(ctx, -4 + turn, hy + 1, 1.8, 1.8, INK);
    oval(ctx, 4 + turn, hy + 1, 1.8, 1.8, INK);
    ctx.beginPath();
    ctx.arc(turn * 0.7, hy + 4, 3.5, 0.3, Math.PI - 0.3);
    ctx.lineWidth = ow * 0.8;
    ctx.strokeStyle = INK;
    ctx.stroke();
    if (look.cap) {
      rr(ctx, -12, hy - hr - 1, 24, 7, 3, look.cap, ow);
      rr(ctx, -2 + turn * 1.2, hy - hr + 3, 17, 3.5, 1.5, look.cap, ow);
      oval(ctx, turn, hy - hr + 2, 2, 2, "#ffcf33");
    }
  }
  ctx.restore();
  ctx.restore();
}

// The flashlight a guard holds at his chest (drawPerson `torch`): where its front is, in the person's own units
// (feet at 0, up negative, x the way he faces). His search cone is drawn as its beam from here.
export const TORCH = Object.freeze({ x: 15, y: -52 });

// The new cast's looks (party plan V3 and V4).
export const LOOKS = Object.freeze({
  bartender: { skin: "#e7b48f", shirt: "#e5533d", pants: "#3a3f52", hair: "#4a3020", bun: true, apron: true },
  guard: { skin: "#c98b62", shirt: "#2f5fb3", pants: "#24407a", cap: "#1d3770", badge: true },
  // The Croc Boys: look B, crocodiles in Crocs (Brian 2026-11-24, docs/approved-art/party/).
  band: [
    { croc: true, skin: "#3fae4a", shirt: "#ffcf33", pants: "#2b2f3c", crocs: true, instrument: "guitar" },
    { croc: true, skin: "#3fae4a", shirt: "#3478f6", pants: "#2b2f3c", crocs: true, instrument: "keytar" },
    { croc: true, skin: "#3fae4a", shirt: "#e5533d", pants: "#2b2f3c", crocs: true, instrument: "drum" },
  ],
});

/** A small drum on a stand in front of the third band member. */
export function drawDrum(ctx, x, y, h) {
  const k = h / 100;
  rr(ctx, x - 13 * k, y - 32 * k, 26 * k, 18 * k, 4 * k, "#e5533d", Math.max(1, 2 * k));
  oval(ctx, x, y - 32 * k, 13 * k, 3.5 * k, "#fffdf8", Math.max(1, 2 * k));
  line(ctx, [x - 8 * k, y - 14 * k, x - 12 * k, y], INK, Math.max(1, 2 * k));
  line(ctx, [x + 8 * k, y - 14 * k, x + 12 * k, y], INK, Math.max(1, 2 * k));
}

/** The three Croc Boys standing at their spots; `playing` makes them bob and strum. `looks` is for the picture sheet. */
export function drawBand(ctx, spots, h, t, playing, looks = LOOKS.band, gone = null, pose = false) {
  spots.forEach((s, i) => {
    if (gone && gone[i]) return;
    const jump = playing ? Math.abs(Math.sin(t * 6 + i)) * h * 0.04 : 0;
    // `pose`: the song is over and they pose for the crowd, an arm up high (the group photo's first step)
    const armUp = pose ? 0.95 : playing && i === 0 ? 0.3 + 0.2 * Math.sin(t * 8) : 0;
    drawPerson(ctx, s.x, s.y - jump, h, { ...looks[i], armUp }, 1, playing ? t : 0);
    looks[i].instrument === "drum" && drawDrum(ctx, s.x, s.y, h);
  });
}

/** The gap in the photo's front row, glowing on the floor where Squatch's feet go (`r` across), pulsing gently. */
export function drawGapGlow(ctx, x, y, r, t) {
  ctx.save();
  const k = 0.75 + 0.25 * Math.sin(t * 4);
  const g = ctx.createRadialGradient(x, y, 2, x, y, r * 1.6);
  g.addColorStop(0, `rgba(255,207,51,${0.75 * k})`);
  g.addColorStop(1, "rgba(255,207,51,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.6, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
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
  rr(ctx, x0 + 34, low - 12, w - 68, 24, 4, "#fffdf8");
  // At least 18 game pixels: 14 CSS pixels on an upright tablet (tests/canvas-text.mjs).
  words(ctx, partyLine("banner-1"), x0 + w / 2, mid, 19, "#ffffff");
  words(ctx, partyLine("banner-2"), x0 + w / 2, low + 1, 18, "#e5533d");
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
export function drawMark(ctx, x, y, mark, size, t = 0, q = null) {
  // a "?" that fills in (party-question.js): no white bubble, small and pale growing to full and dark
  if (mark === "?" && q) {
    const L = questionLook(q.k),
      fs = size * 0.85 * L.scale;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, q.a));
    ctx.font = `900 ${fs}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(1.5, fs * 0.12);
    ctx.strokeStyle = INK;
    ctx.strokeText("?", x, y + size * 0.04);
    ctx.fillStyle = L.color;
    ctx.fillText("?", x, y + size * 0.04);
    ctx.restore();
    return;
  }
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

// ---------- lights (V10) ----------
// The room's light while the band plays its first song: a soft pink tint over the hall (the three songs' colours are
// party-dance.js SONG_LIGHTS).
export const SONG_LIGHT = "rgba(255,95,168,.16)";
/** The lights dimmed, the dance spotlight on the floor at `spot`, the song's colour over the room. */
export function drawPartyLights(ctx, spot, t, dim = 1, color = SONG_LIGHT) {
  ctx.save();
  ctx.fillStyle = `rgba(12,16,32,${0.32 * dim})`;
  ctx.beginPath();
  ctx.rect(0, 0, 960, 640);
  ctx.ellipse(spot.x, spot.y, spot.rx, spot.ry, 0, 0, TAU, true);
  ctx.fill("evenodd");
  ctx.globalAlpha = Math.min(1, dim);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 960, 640);
  ctx.globalAlpha = 1;
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
// The camera's body sits this far above the tripod's feet; its lens is this far out along the way it points.
const CAMERA = Object.freeze({ up: 40, aimUp: 46, lens: 17 });
const cameraAngle = (x, y, aim) => Math.atan2(aim.y - (y - CAMERA.aimUp), aim.x - x);
/** The front of the camera's lens (game position), for a tripod standing at `tripod` and pointing at `aim`. */
export function cameraLens(tripod, aim) {
  const a = cameraAngle(tripod.x, tripod.y, aim);
  return { x: tripod.x + Math.cos(a) * CAMERA.lens, y: tripod.y - CAMERA.up + Math.sin(a) * CAMERA.lens };
}
/** The camera on its tripod, standing at (x, y) and pointing at `aim`. */
export function drawTripod(ctx, x, y, aim) {
  const a = cameraAngle(x, y, aim);
  line(ctx, [x, y - 34, x - 14, y], "#6b6256", 3);
  line(ctx, [x, y - 34, x + 13, y], "#6b6256", 3);
  line(ctx, [x, y - 34, x + 1, y + 4], "#6b6256", 3);
  ctx.save();
  ctx.translate(x, y - CAMERA.up);
  ctx.rotate(a);
  rr(ctx, -12, -8, 22, 15, 3, "#1e2430", 2);
  rr(ctx, 9, -5, 8, 9, 2, "#8fdcff", 2);
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
/**
 * One piece, centred at (x, y), `w` across, turned by `rot`. `onBody`: the shirt is on his body, so its long
 * sleeves are drawn along his arms by drawOutfit (party-shirt-art.js); on its own it hangs with its sleeves down.
 */
export function drawPiece(ctx, id, x, y, w, rot = 0, onBody = false) {
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
    drawShirt(ctx, w, h, lw, onBody);
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
 * { head, face, body, legs } -> piece id or "". The shirt on his body has long sleeves down his arms, drawn last
 * (over what he wears, as his arms are): `opts.arms` is how his arms are drawn (squatch-art.js armEnds; left out,
 * at rest; walkArms for the room's walking Squatch), `opts.pawLine` and `opts.pawR` his paws' outline and size.
 */
export function drawOutfit(ctx, x, y, scale, outfit, f = 1, opts = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * (f < 0 ? -1 : 1), scale);
  for (const spot of ["legs", "body", "face", "head"]) {
    const id = outfit && outfit[spot];
    if (!id) continue;
    const s = BODY_SPOTS[spot],
      p = PIECES.find((q) => q.id === id),
      h = s.w * (p ? p.h : 0.5);
    // (`hatTip`: the piece on his head tipped over, radians; the octopus's first hug knocks it askew)
    drawPiece(ctx, id, s.x, s.sit ? s.y - h / 2 + 3 : s.y, s.w, spot === "head" ? (opts && opts.hatTip) || 0 : 0, spot === "body");
  }
  const o = opts || {};
  outfit && outfit.body === "shirt" && drawShirtSleeves(ctx, o.arms || null, Math.max(1, BODY_SPOTS.body.w * 0.045), o);
  ctx.restore();
}
