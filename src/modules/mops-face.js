/**
 * Mops's snipped beard on the switch card and on the HUD's Mops face (Brian 2026-11-27, approving art sheet 2 on
 * PR #105: after the snip both show the snipped beard, to match the room). The older program draws both pictures
 * (60-frame-draw.js the switch card, 80-hud.js faceUrl); it asks here through window.SSQ. Pickup day says when the
 * beard is snipped (mops-beard.js, { noBeard: true, snipped: true }); the beard itself is pickup-people-art.js's.
 */
import { mopsBeardLook } from "./mops-beard.js";
import { drawSnippedBeard } from "./pickup-people-art.js";

const snippedNow = () => !!(mopsBeardLook() || {}).snipped;

/** Right after the older program draws Mops at (x, y), scale `k`, facing `f` on `ctx`: the snipped beard over him, once snipped. */
export function mopsBeardOver(ctx, x, y, k, f = 1) {
  return snippedNow() ? drawSnippedBeard(ctx, x, y, k, f) : false;
}

let faceSnipped = false;
/**
 * The HUD's Mops face redrawn when the snip comes (or goes, when the chapter starts over), as 80-hud.js draws it: a
 * 58 px circle, his head at 1.4 facing left. `drawMopsOn` is the engine's (ctx, x, y, scale, opts). True when redrawn.
 */
export function syncMopsFace(drawMopsOn) {
  const s = snippedNow();
  if (s === faceSnipped || typeof document === "undefined" || typeof drawMopsOn !== "function") return false;
  const img = document.querySelector('button[aria-label="Mops"] img');
  if (!img) return false;
  faceSnipped = s;
  const cv = document.createElement("canvas");
  cv.width = cv.height = 58;
  const ctx = cv.getContext("2d");
  ctx.beginPath();
  ctx.arc(29, 29, 29, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#ffe3c4";
  ctx.fillRect(0, 0, 58, 58);
  const x = 29 + 17 * 1.4,
    y = 29 + 29 * 1.4;
  drawMopsOn(ctx, x, y, 1.4, { f: -1, noBeard: s });
  if (s) drawSnippedBeard(ctx, x, y, 1.4, -1);
  img.src = cv.toDataURL();
  return true;
}
/** Tests: whether the HUD face shows the snipped beard now. */
export function mopsFaceSnipped() {
  return faceSnipped;
}
