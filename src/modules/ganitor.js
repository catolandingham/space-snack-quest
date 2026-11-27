/**
 * "Ganitor": goat + janitor, Mops's job title, an ongoing joke (Brian, 2026-11-26: "Ganitor is what mops is - goat
 * janitor - that should be an ongoing reference in the game"; he chose all five places, "a b c d e"):
 *   A  a GANITOR name tag on Mops's shirt, in every scene (drawGanitorTag: where the patch on his pocket was; the rest
 *      of Mops is unchanged). The word shows where Mops is drawn big enough for it to read (the close-ups); smaller,
 *      the tag is a clear white tag with two pencil lines.
 *   B  the station PA calls him to work on Day 2: its words are inside the morning PA (home-morning-lines.js pa-morning,
 *      Brian 2026-11-26 #41), which the wall speaker says with sound lines round it; pa-ganitor is kept as the record
 *   C  in the hallway, an Employee of the Month photo of Mops labelled MOPS, GANITOR (drawGanitorWall), a layer drawn
 *      over the locked hallway picture (the picture itself is not changed)
 *   D  a robot janitor notice: not built (wordings for Brian in the round's report)
 *   E  Squatch's crayon drawings name Mops MOPS THE GANITOR where Mops is in one: the crayon card on the hallway wall
 *      ("ME" and Mops; drawHallwayCrayon). The crayon Guardians drawing has no Mops in it, so it has no label.
 * Every drawing here is a PLACEHOLDER waiting for Brian's eye. Every word is in GANITOR_LINES.
 */

export const GANITOR_LINES = Object.freeze(
  [
    { id: "sign-tag", who: "sign", text: "GANITOR", status: "approved", source: "Brian, chat 2026-11-26 (A: a GANITOR name tag on Mops's shirt)" },
    { id: "pa-ganitor", who: "speaker", text: "Ganitor Mops to the party hall.", status: "approved", merged: "pa-morning", source: "Brian, chat 2026-11-26 (B, approved words). Merged into the morning PA (home-morning-lines.js pa-morning, Brian 2026-11-26 #41), which says these words inside its own line; not said on its own" },
    { id: "sign-wall", who: "sign", text: "MOPS, GANITOR", status: "approved", source: "Brian, chat 2026-11-26 (C: the Employee of the Month photo's label)" },
    { id: "sign-crayon", who: "sign", text: "MOPS THE GANITOR", status: "approved", source: "Brian, chat 2026-11-26 (E: on Squatch's crayon drawings where Mops is in one)" },
    { id: "sign-crayon-me", who: "sign", text: "ME", status: "approved", source: "Brian 2026-11-13 (the crayon labels ME / MOPS, CH1-LINES-FOR-BRIAN row 130); unchanged" },
  ].map((l) => Object.freeze(l)),
);
/** The words of one Ganitor line, by id. Throws on an unknown id. */
export function ganitorWords(id) {
  const l = GANITOR_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no ganitor line ${id}`);
  return l.text;
}

/**
 * The name tag, in Mops's own units (his drawing, 60-frame-draw.js Fe and cutaway.js: feet at 0, 0, facing right):
 * a white tag across the top of his chest pocket. `word`: its letters' height in his units; the word is written only
 * when that is at least `readPx` game pixels (so it reads on a phone, about 8 CSS px, and an iPad, about 15).
 */
export const GANITOR_TAG = Object.freeze({ x0: 1.2, y0: -21.9, w: 9.6, h: 4.4, word: 2.5, readPx: 18, ink: "#1e2430", edge: "#1d4fb8" });

const TAG_INK = GANITOR_TAG.ink;
// Tests: every tag drawn since the count was last read ({ readable, scale }), the last 40.
const tagLog = [];
/** Tests: the tags drawn since the last call (and forgets them). */
export function ganitorTagsDrawn() {
  return tagLog.splice(0, tagLog.length);
}
/**
 * Draws the tag on `ctx`, already turned into Mops's units (his scale `scale`: game pixels to one of his units, for
 * whether the word can be read; `line`: the outline's width in his units). Mirrored Mops (facing left) gets his tag
 * mirrored too, but its word is always written the right way round. Returns what it drew (tests).
 */
export function drawGanitorTag(ctx, scale, line = 0.8) {
  const T = GANITOR_TAG,
    readable = T.word * Math.abs(scale || 0) >= T.readPx;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(T.x0, T.y0, T.w, T.h, 0.9);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = line;
  ctx.strokeStyle = T.edge;
  ctx.stroke();
  const cx = T.x0 + T.w / 2,
    cy = T.y0 + T.h / 2;
  if (readable) {
    // The word is written in game pixels, upright and the right way round even when he faces left (his drawing is
    // mirrored then): the picture's own scale (`base`, device pixels to a game pixel) at the tag's middle.
    const m = ctx.getTransform(),
      k = Math.abs(scale),
      base = Math.hypot(m.a, m.b) / k,
      p = m.transformPoint({ x: cx, y: cy + 0.15 });
    ctx.setTransform(base, 0, 0, base, p.x, p.y);
    ctx.font = `900 ${+(T.word * k).toFixed(1)}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = TAG_INK;
    ctx.fillText(ganitorWords("sign-tag"), 0, 0, (T.w - 1) * k);
  } else {
    // too small to read: two short pencil lines, so it still reads as a name tag
    ctx.lineWidth = Math.max(0.35, line * 0.6);
    ctx.strokeStyle = "rgba(30,36,48,.6)";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(T.x0 + 1.6, cy - 0.7);
    ctx.lineTo(T.x0 + T.w - 1.6, cy - 0.7);
    ctx.moveTo(T.x0 + 1.6, cy + 0.9);
    ctx.lineTo(T.x0 + T.w * 0.62, cy + 0.9);
    ctx.stroke();
  }
  ctx.restore();
  const out = { readable, scale: +Math.abs(scale || 0).toFixed(2) };
  tagLog.push(out);
  tagLog.length > 40 && tagLog.shift();
  return out;
}

/**
 * C: the Employee of the Month photo, on the hallway's back wall right of the locked picture's photo grid (game
 * positions; the grid ends at about x 685). A framed photo of Mops (his own drawing, head and shirt, with his tag) and
 * a plaque under it: MOPS, GANITOR. PLACEHOLDER layer drawn over the locked picture (not part of it), waiting for
 * Brian's yes.
 */
export const GANITOR_WALL = Object.freeze({
  frame: Object.freeze({ x0: 714, y0: 84, x1: 820, y1: 196 }),
  plaque: Object.freeze({ x: 767, y: 218, h: 30, word: 19 }),
});
/**
 * Draws the wall layer on `ctx` (game positions). `drawMops(ctx, x, y, scale, opts)` is the engine's Mops drawing.
 * Returns what it drew (tests).
 */
export function drawGanitorWall(ctx, drawMops) {
  const W = GANITOR_WALL,
    f = W.frame,
    p = W.plaque;
  ctx.save();
  // the photo: a gold frame, a pale blue sky, Mops from his chest up (his own drawing, clipped to the photo)
  ctx.fillStyle = "rgba(30,36,48,.18)";
  ctx.fillRect(f.x0 + 4, f.y0 + 5, f.x1 - f.x0, f.y1 - f.y0);
  ctx.fillStyle = "#e9c46a";
  ctx.fillRect(f.x0, f.y0, f.x1 - f.x0, f.y1 - f.y0);
  ctx.lineWidth = 3;
  ctx.strokeStyle = TAG_INK;
  ctx.strokeRect(f.x0, f.y0, f.x1 - f.x0, f.y1 - f.y0);
  const ix0 = f.x0 + 8,
    iy0 = f.y0 + 8,
    iw = f.x1 - f.x0 - 16,
    ih = f.y1 - f.y0 - 16;
  ctx.fillStyle = "#d8ecfb";
  ctx.fillRect(ix0, iy0, iw, ih);
  ctx.save();
  ctx.beginPath();
  ctx.rect(ix0, iy0, iw, ih);
  ctx.clip();
  // (his feet below the photo's bottom: it shows his head, his horns and the top of his shirt with the tag; the
  // middle of the photo is about 12 of his units right of his feet and 30 up)
  const k = 3.2;
  drawMops && drawMops(ctx, ix0 + iw / 2 - 12 * k, iy0 + ih / 2 + 30 * k, k, { f: 1, walk: 0 });
  ctx.restore();
  ctx.lineWidth = 2;
  ctx.strokeStyle = TAG_INK;
  ctx.strokeRect(ix0, iy0, iw, ih);
  // the plaque under it
  ctx.font = `900 ${p.word}px system-ui, -apple-system, sans-serif`;
  const word = ganitorWords("sign-wall"),
    w = ctx.measureText(word).width + 24;
  ctx.beginPath();
  ctx.roundRect(p.x - w / 2, p.y - p.h / 2, w, p.h, 6);
  ctx.fillStyle = "#3a2a18";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#e9c46a";
  ctx.stroke();
  ctx.fillStyle = "#fff6d8";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(word, p.x, p.y + 1);
  ctx.restore();
  return { frame: f, plaque: { x0: p.x - w / 2, x1: p.x + w / 2, y0: p.y - p.h / 2, y1: p.y + p.h / 2 }, word };
}

/**
 * E: Squatch's crayon drawing taped on the hallway wall (the keepsake, behind the crooked photo #4; the older
 * program's card, 14-ch1-day2.js drawCh1Passage: a white card with his labels "ME" and "MOPS", approved 2026-11-13):
 * Mops's label is MOPS THE GANITOR now. The card is a little bigger than before so the longer label fits on two lines
 * at the same letter size. PLACEHOLDER card. Returns what it drew (tests).
 */
export const HALLWAY_CRAYON = Object.freeze({ x0: 586, y0: 110, w: 108, h: 84, size: 18 });
export function drawHallwayCrayon(ctx) {
  const C = HALLWAY_CRAYON,
    cx = C.x0 + C.w / 2,
    lines = [ganitorWords("sign-crayon-me")];
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(C.x0, C.y0, C.w, C.h, 6);
  ctx.fillStyle = "#fffdf8";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = TAG_INK;
  ctx.stroke();
  ctx.font = `800 ${C.size}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = TAG_INK;
  // Mops's label, wrapped a word at a time to the card's width
  for (const w of crayonGanitorLabel().split(" ")) {
    const k = lines.length - 1,
      joined = k > 0 ? lines[k] + " " + w : "";
    k > 0 && ctx.measureText(joined).width <= C.w - 10 ? (lines[k] = joined) : lines.push(w);
  }
  lines.forEach((t, k) => ctx.fillText(t, cx, C.y0 + 20 + k * 22, C.w - 8));
  ctx.restore();
  return (lastCrayon = { box: { x0: C.x0, y0: C.y0, x1: C.x0 + C.w, y1: C.y0 + C.h }, lines });
}
let lastCrayon = null;
/** Tests: what the crayon card drew last (or null), and forgets it. */
export function hallwayCrayonDrawn() {
  const c = lastCrayon;
  lastCrayon = null;
  return c;
}
/** E: the label a crayon drawing of Squatch's writes for Mops wherever Mops is in one. */
export function crayonGanitorLabel() {
  return ganitorWords("sign-crayon");
}
