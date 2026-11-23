/**
 * The party guests, drawn from the six pictures Brian approved on Nov 8 (docs/approved-art/guests/README.md;
 * Squatchbot #1349, his pick for the party: "The six approved Nov 8 pictures").
 *
 * The older program places six guests by kind (CH1_GUESTS in 12-ch1-redesign.js); each kind gets one picture.
 * A picture that has not loaded yet, or failed to load, is not drawn, and the older program draws its own
 * guest in its place, so the party never has a gap.
 */

const DIR = "docs/approved-art/guests/";
// Guest id -> picture file. Ids are what the sight cones are called too (party-watch.js).
export const GUEST_ART = {
  teal: "teal.png",
  camera: "camera.png",
  backpack: "backpack.png",
  stilt: "stilt.png",
  "octopus-guest": "octopus.png",
  robot: "robot.png",
};
// The older program's guest kinds -> which approved guest stands there.
export const GUEST_FOR_KIND = {
  hair: "teal",
  hat: "camera",
  croc: "backpack",
  antenna: "stilt",
  blob: "octopus-guest",
  spots: "robot",
};
// The teal guest is a grown-up's height; the others keep their heights from the approved sheet.
const TEAL_PX = 622;

export function createGuestArt() {
  const images = {};
  if (typeof Image !== "undefined")
    for (const [id, file] of Object.entries(GUEST_ART)) {
      const img = new Image();
      img.src = DIR + file;
      images[id] = img;
    }
  return {
    /** The approved guest for one of the older program's kinds, or null. */
    idFor(kind) {
      return GUEST_FOR_KIND[kind] || null;
    },
    /**
     * Draws the guest standing at feet (x, y), the teal guest `adultPx` tall, bobbing gently with `time`.
     * Returns false when the picture is not ready, so the caller draws its own guest instead.
     */
    draw(ctx, kind, x, y, adultPx, time) {
      const img = images[GUEST_FOR_KIND[kind]];
      if (!img || !img.complete || !img.naturalWidth) return false;
      const k = adultPx / TEAL_PX,
        w = img.naturalWidth * k,
        h = img.naturalHeight * k,
        bob = Math.sin((time || 0) * 2 + x * 0.01) * 1.5;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y + 2, w * 0.4, 4, 0, 0, 7);
      ctx.fillStyle = "rgba(30,36,48,.16)";
      ctx.fill();
      ctx.drawImage(img, x - w / 2, y - h + bob, w, h);
      ctx.restore();
      return true;
    },
  };
}
