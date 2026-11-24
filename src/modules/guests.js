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
      return this.drawId(ctx, GUEST_FOR_KIND[kind], x, y, adultPx, time);
    },
    /**
     * The same, by guest id (GUEST_ART). `dance` (0 to 1) makes them do the robot dance with a partner: they lean
     * toward the partner (`lean`, -1 left or 1 right) and both snap through the same stiff moves in step, mirrored,
     * with the same bounce, so the two read as a pair at phone size.
     */
    drawId(ctx, id, x, y, adultPx, time, dance = 0, lean = 0) {
      const img = images[id];
      if (!img || !img.complete || !img.naturalWidth) return false;
      const t = time || 0,
        k = adultPx / TEAL_PX,
        w = img.naturalWidth * k,
        h = img.naturalHeight * k,
        bob = (1 - dance) * Math.sin(t * 2 + x * 0.01) * 1.5 - dance * Math.abs(Math.sin(t * 5)) * 6,
        tilt = dance * (lean * 0.12 + Math.round(Math.sin(t * 2.5)) * 0.16 * (lean || 1));
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y + 2, w * 0.4, 4, 0, 0, 7);
      ctx.fillStyle = "rgba(30,36,48,.16)";
      ctx.fill();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      ctx.drawImage(img, -w / 2, -h + bob, w, h);
      ctx.restore();
      return true;
    },
    /** How tall the guest is drawn, in game pixels, with the teal guest `adultPx` tall (heights from the approved sheet). */
    height(id, adultPx) {
      const img = images[id];
      return img && img.naturalHeight ? (img.naturalHeight * adultPx) / TEAL_PX : adultPx;
    },
  };
}
