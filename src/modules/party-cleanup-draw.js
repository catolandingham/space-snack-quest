/**
 * The cleanup's picture (scene P9, party-cleanup.js), for party-view.js: the hall's floor mess and sparkles under
 * everyone, the tufts and the find with the one dashed outline, Mops (the player) with his beard greying as it fills,
 * his bucket, the Polaroid close-up over the hall, the heart that pops, and the "Spotless!" badge. At home after it
 * (P9b): what Mops found, held up, and the Polaroid by Squatch's bed once it is his. Words come from party-lines.js.
 */
import { partyLine } from "./party-lines.js";
import { highlightBox } from "./outline.js";
import { drawTuft, words, rr } from "./party-art.js";
import { drawLoosePiece, heart } from "./party-free-art.js";
import { drawGroupPolaroid } from "./party-photo.js";
import { wornNow } from "./party-outfit.js";
import { drawMopBucketBack, drawMopBucketFront } from "./mop-bucket.js";
import { drawDirtPatch, drawSpill, drawCrumbs, drawCleanSparkle, drawDirtyBeard, drawHeartPop, drawLittlePolaroid } from "./party-cleanup-art.js";
import { CLEAN, HALL_BUCKET, SPILLS, CRUMBS, VENT_TUFT, polaroidTargets } from "./party-cleanup.js";
import { HALL, HOME_ROOM } from "./party-hall.js";

/** The floor, under everyone: dirty patches, the spills, the knocked-down snacks, the find lying there, the sparkles. */
export function drawCleanFloor(ctx, p, t, patches) {
  const c = p.clean;
  if (!c) return;
  patches.forEach((q, i) => c.dirt[i] && drawDirtPatch(ctx, q.x, q.y, CLEAN.cell, i));
  SPILLS.forEach((s, i) => c.spills[i].passes < 2 && drawSpill(ctx, s.x, s.y, s.r, c.spills[i].passes ? 0.5 : 1, s.color));
  c.crumbs && !c.crumbs.done && drawCrumbs(ctx, CRUMBS.x, CRUMBS.y);
  if (!c.picked) {
    const f = c.find;
    f.kind === "photo" && drawLittlePolaroid(ctx, f.x, f.y, 26, 0.35);
    f.kind === "hat" && drawLoosePiece(ctx, "tophat", f.x, f.y, 22, 0.6);
    f.kind === "fur" && c.phase === "find" && drawTuft(ctx, f.x, f.y - 6, 22, 0.2);
    // a tuft of fur caught in the hat
    f.kind === "hat" && drawTuft(ctx, f.x + 10, f.y - 2, 10, 0.8);
  }
  for (const s of c.sparks) drawCleanSparkle(ctx, s.x, s.y, s.t / CLEAN.spark);
}

/** The tufts (the vent's swirl takes the first one), over the floor. */
export function drawCleanTufts(ctx, p) {
  const c = p.clean;
  if (!c) return;
  c.trail.forEach((tf, i) => {
    if (tf.state === "show") drawTuft(ctx, tf.x, tf.y, 16, tf.rot);
    if (tf.state === "slide" && i === 0 && c.slide) {
      const k = c.slide.k,
        x = VENT_TUFT.x + (HALL.vent.x - VENT_TUFT.x) * k,
        y = VENT_TUFT.y + (HALL.vent.y - VENT_TUFT.y) * k;
      drawTuft(ctx, x, y, 16 * (1 - 0.8 * k), tf.rot + k * 6);
    }
  });
}

/** The one dashed outline round what Mops goes to next (a tuft or the find); the bucket and his door use the goal table. */
export function drawCleanOutline(ctx, box, t) {
  box && highlightBox(ctx, box, t, 3);
}

/** The people layer: Mops (with his greying beard) and his bucket, each by its feet line. */
export function cleanExtras(ctx, E, p, t) {
  const c = p.clean,
    m = E.pos("mops"),
    scale = E.hallSizes().squatch * 1.15,
    walking = E.get("ctrl") && E.steering();
  return [
    { y: HALL_BUCKET.floor, f: () => (drawMopBucketBack(ctx, HALL_BUCKET.x, HALL_BUCKET.floor, HALL_BUCKET.k), drawMopBucketFront(ctx, HALL_BUCKET.x, HALL_BUCKET.floor, HALL_BUCKET.k, { water: true })) },
    {
      y: m.y,
      f: () => {
        const wringing = c && c.wringT != null;
        E.drawMopsOn(ctx, m.x, m.y, scale, { f: m.f || 1, walk: walking ? t * 8 : 0, headDown: true, sweep: walking ? Math.sin(t * 6) * 4 : wringing ? Math.sin(t * 30) * 3 : 0 });
        c && drawDirtyBeard(ctx, m.x, m.y, scale, m.f || 1, c.beard, true);
        // the heart over him when he finds the hat (or the fur): it rises and pops
        c && c.heartAt != null && !c.close && drawHeartPop(ctx, m.x, m.y - scale * 50, 14, (E.time() - c.heartAt) / CLEAN.heart);
      },
    },
  ];
}

/** Over the hall: the Polaroid close-up (his shirt, then his feet, outlined to tap), and the Spotless! badge. */
export function drawCleanOver(ctx, E, p, t, guests) {
  const c = p.clean;
  if (!c) return null;
  if (c.close) {
    const art = {
      adult: E.hallSizes().adult,
      sqScale: E.hallSizes().squatch,
      squatch: (cx, x, y, scale) => E.drawSquatch(cx, x, y, scale, { f: 1 }),
      guest: (cx, id, x, y, tall) => guests.drawId(cx, id, x, y, tall, 0),
    };
    drawGroupPolaroid(ctx, 960, 640, art, wornNow(p), 1);
    const T = polaroidTargets(E.hallSizes().squatch);
    !E.current() && c.close.step === "shirt" && highlightBox(ctx, T.shirt, t, 4);
    !E.current() && c.close.step === "feet" && highlightBox(ctx, T.feet, t, 4);
    c.heartAt != null && drawHeartPop(ctx, T.feet.x, T.feet.y - 20, 22, (E.time() - c.heartAt) / CLEAN.heart);
  }
  if (c.spotlessAt != null) {
    const k = (E.time() - c.spotlessAt) / CLEAN.badge;
    if (k >= 0 && k < 1) {
      ctx.save();
      ctx.globalAlpha = k > 0.8 ? (1 - k) / 0.2 : 1;
      rr(ctx, 330, 168, 300, 74, 37, "#ffcf33", 4);
      words(ctx, partyLine("badge-spotless"), 480, 206, 40, "#1e2430");
      ctx.restore();
    }
  }
  return c.close ? polaroidTargets(E.hallSizes().squatch) : null;
}

/**
 * At home after the cleanup (P9b): what Mops holds up (the Polaroid, the hat, or a tuft of fur), in front of him at
 * head height; the Polaroid by Squatch's bed once he has it; one heart after a fib.
 */
export function drawCleanHome(ctx, E, p, t) {
  const m = E.pos("mops"),
    sk = E.squatchScale();
  if (p.holdUp && E.get("moPose") !== "hidden") {
    const k = p.holdUp.k,
      x = m.x + (m.f || -1) * 44 * sk,
      y = m.y - (22 + 26 * k) * sk;
    p.holdUp.kind === "photo" ? drawLittlePolaroid(ctx, x, y, 22 * sk, -0.08) : p.holdUp.kind === "hat" ? drawLoosePiece(ctx, "tophat", x, y, 18 * sk, -0.2) : drawTuft(ctx, x, y, 14 * sk, 0.3);
  }
  p.keptPhoto === "bed" && drawLittlePolaroid(ctx, HOME_ROOM.bed.x + 70, HOME_ROOM.bed.y - 40, 40, -0.12);
  if (p.oneHeartAt != null) {
    const u = (E.time() - p.oneHeartAt) / 1.4;
    if (u > 0 && u < 1) {
      ctx.save();
      ctx.globalAlpha = u < 0.2 ? u / 0.2 : 1 - (u - 0.2) / 0.8;
      heart(ctx, m.x, m.y - 50 * sk - u * 40, 12 + 6 * u, "#ff6fa0");
      ctx.restore();
    }
  }
}
