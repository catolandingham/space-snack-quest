/**
 * How the older program draws Mops's beard outside the morning (the engine's drawMops options, or null for its own
 * beard). Pickup day sets it: once his beard is snipped (56 on) the engine leaves its beard out and pickup.js draws the
 * short, snipped one in its place (pickup-people-art.js drawSnippedBeard). The morning's own mopping look comes first
 * (morning.js mopsLook). Its own small file so the morning and pickup day need not import each other.
 */
let mopsBeardLookFn = null;
/** `fn` returns the options for the engine's drawMops (for example { noBeard: true }), or null. */
export function setMopsBeardLook(fn) {
  mopsBeardLookFn = typeof fn === "function" ? fn : null;
}
/** The options now, or null. */
export function mopsBeardLook() {
  return mopsBeardLookFn ? mopsBeardLookFn() || null : null;
}
