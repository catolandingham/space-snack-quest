/**
 * "Full screen" (party plan, rules): the whole phone screen, not just the game picture, with the stick and the
 * action button hidden until it ends. Used for the dress-up and the fur-alarm close-up (and, in half two, the
 * dance). It is a canvas laid over the whole page; it draws with `draw(ctx, w, h, t)` (screen pixels) every frame
 * and passes the finger or mouse to `pointer(kind, x, y)` ("down", "move", "up"). With `restart`, the view keeps
 * its own ↺ in the top-left corner (the page's ↺ is under the view): held for as long as the page's, it calls
 * `restart()`.
 */
// The ↺ in the corner: where it sits and how big (a 44-pixel target, like the page's), and how long it is held.
export const RESTART = Object.freeze({ x: 10, y: 10, size: 48, hold: 0.75 });
let open = null;

/** The page's stick and action button (the first button on the page is the action button). */
function controls() {
  return [document.querySelector('[aria-label="Move"]'), document.querySelector('[role="button"]')].filter(Boolean);
}

export function openFullScreen({ draw, pointer, label, restart }) {
  closeFullScreen();
  const cv = document.createElement("canvas");
  cv.setAttribute("aria-label", label || "close-up");
  cv.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:100vh;height:100dvh;z-index:2147483000;touch-action:none;background:#ffffff";
  document.body.appendChild(cv);
  const hidden = controls().map((el) => [el, el.style.visibility]);
  hidden.forEach(([el]) => (el.style.visibility = "hidden"));
  const ctx = cv.getContext("2d");
  let w = 0,
    h = 0,
    raf = 0,
    closed = false;
  const t0 = performance.now();
  const size = () => {
    const r = cv.getBoundingClientRect(),
      dpr = Math.min(3, window.devicePixelRatio || 1);
    w = Math.round(r.width) || window.innerWidth;
    h = Math.round(r.height) || window.innerHeight;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  window.addEventListener("resize", size);
  let held = 0; // when the ↺ was pressed (ms), or 0
  const onRestart = (x, y) => restart && x >= RESTART.x && x <= RESTART.x + RESTART.size && y >= RESTART.y && y <= RESTART.y + RESTART.size;
  const frame = () => {
    try {
      draw(ctx, w, h, (performance.now() - t0) / 1000);
      restart && drawRestart(ctx, held ? Math.min(1, (performance.now() - held) / 1000 / RESTART.hold) : 0);
      if (held && performance.now() - held >= RESTART.hold * 1000) ((held = 0), restart());
    } catch (err) {
      console.error(err);
    }
    // A draw that closed the view (the close-up ending) must not draw again.
    closed || (raf = requestAnimationFrame(frame));
  };
  frame();
  const at = (ev) => {
    const r = cv.getBoundingClientRect();
    return [ev.clientX - r.left, ev.clientY - r.top];
  };
  let down = false;
  const on = (kind) => (ev) => {
    ev.preventDefault();
    const [x, y] = at(ev);
    if (kind === "down" && onRestart(x, y)) return void (held = performance.now());
    if (kind === "up" && held) return void (held = 0);
    if (held) return;
    if (kind === "down") ((down = true), cv.setPointerCapture && cv.setPointerCapture(ev.pointerId));
    if (kind === "move" && !down) return;
    if (kind === "up") down = false;
    pointer && pointer(kind, x, y);
  };
  cv.addEventListener("pointerdown", on("down"));
  cv.addEventListener("pointermove", on("move"));
  cv.addEventListener("pointerup", on("up"));
  cv.addEventListener("pointercancel", on("up"));
  open = {
    el: cv,
    size: () => ({ w, h }),
    close() {
      closed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      cv.remove();
      hidden.forEach(([el, v]) => (el.style.visibility = v));
      open === this && (open = null);
    },
  };
  return open;
}

/** Closes the full-screen view if one is open (a restart closes it too). */
export function closeFullScreen() {
  open && open.close();
}

/** The open full-screen view, or null (tests). */
export function fullScreenOpen() {
  return open;
}

/** The view's own ↺: a white disc with the arrow, filling as it is held. */
function drawRestart(ctx, k) {
  const r = RESTART.size / 2,
    cx = RESTART.x + r,
    cy = RESTART.y + r;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
  ctx.fillStyle = "#fffaf0";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#1e2430";
  ctx.stroke();
  if (k > 0) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r - 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,207,51,.8)";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.45, -Math.PI * 0.2, Math.PI * 1.45);
  ctx.lineWidth = 4;
  ctx.stroke();
  const ax = cx + Math.cos(-Math.PI * 0.2) * r * 0.45,
    ay = cy + Math.sin(-Math.PI * 0.2) * r * 0.45;
  ctx.beginPath();
  ctx.moveTo(ax - 7, ay - 5);
  ctx.lineTo(ax + 2, ay + 1);
  ctx.lineTo(ax - 8, ay + 6);
  ctx.stroke();
  ctx.restore();
}
