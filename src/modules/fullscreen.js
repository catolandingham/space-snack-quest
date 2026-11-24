/**
 * "Full screen" (party plan, rules): the whole phone screen, not just the game picture, with the stick and the
 * action button hidden until it ends. Used for the dress-up and the fur-alarm close-up (and, in half two, the
 * dance). It is a canvas laid over the whole page; it draws with `draw(ctx, w, h, t)` (screen pixels) every frame
 * and passes the finger or mouse to `pointer(kind, x, y)` ("down", "move", "up").
 */
let open = null;

/** The page's stick and action button (the first button on the page is the action button). */
function controls() {
  return [document.querySelector('[aria-label="Move"]'), document.querySelector('[role="button"]')].filter(Boolean);
}

export function openFullScreen({ draw, pointer, label }) {
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
  const frame = () => {
    try {
      draw(ctx, w, h, (performance.now() - t0) / 1000);
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
    if (kind === "down") ((down = true), cv.setPointerCapture && cv.setPointerCapture(ev.pointerId));
    if (kind === "move" && !down) return;
    if (kind === "up") down = false;
    pointer && pointer(kind, ...at(ev));
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
