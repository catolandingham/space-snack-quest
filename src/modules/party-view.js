/**
 * What the party night draws, from its game state (split out of party.js; half-one review: "split ... the drawing
 * view out"). The hall is drawn by party-draw.js from one description of what is on screen (a "view"); this file
 * builds that view for every scene, and draws the party's things over the home room (the music notes at the door,
 * the flyer on the floor, his outfit, the guard who follows him home, Mops out of breath).
 */
import { HALL, CAST, CAMERA_AIM, BAND_AIM, HALL_SPEAKER, FLYER } from "./party-hall.js";
import { drawCones } from "./party-watch.js";
import { guardLook, guardMark, torchShift } from "./party-guard-look.js";
import { drawHall, flyerInPaw } from "./party-draw.js";
import { drawDoorNotes, drawFlyer, drawOutfit, drawPerson, drawMark, cameraLens, BODY_SPOTS } from "./party-art.js";
import { homeGuardCone } from "./party-alarm.js";
import { ventTufts } from "./party-vent.js";
import { wornNow, flyingNow, furShows } from "./party-outfit.js";
import { drawPyramid, drawSnackCloseUp } from "./party-snacks-art.js";
import { SONG_LIGHTS } from "./party-dance.js";
import { drawCountdown, drawFlash, drawBandNotes, drawClap, drawHiccups, drawSpeakerRing, drawLoosePiece, drawHeartCone, liftAt, liftTo, setDownAt, drawPat, drawTv } from "./party-free-art.js";
import { TV } from "./party-after-alarm.js";
import { PHOTO_ROW } from "./party-photo.js";
import { bounceHop, bumpMark, drawBump } from "./party-hallway.js";
import { OCT } from "./party-octopus.js";

const LATE = new Set(["P6", "P7", "P8a", "P8b"]);
// A "?" or "!" is at least as tall as Squatch's head however big the hall draws people: its size and how far over
// a head its middle sits, as shares of a grown-up's height (42 and 18 when a grown-up was 66 tall).
const MARK = Object.freeze({ size: 0.635, over: 0.27 });

/**
 * `h`: { E, P, sq, picture, guests (the approved art), cones (p), glancePhase (p), personAt (p, id), spots (),
 * goalId (p, room), homeRoom, pace }.
 */
export function createView(h) {
  const E = () => h.E();
  // How tall a person is drawn in the hall (game pixels): a guest's approved picture, a guard, anyone else a grown-up.
  const tallOf = (id, adult) => (CAST.guests.some((g) => g.id === id) ? h.guests.height(id, adult) : id === "guard" ? adult * 1.02 : id === "isfred" ? adult * 1.18 : adult);

  function view(p, t) {
    const s = h.sq(),
      e = E(),
      late = LATE.has(p.scene),
      gone = (p.close && p.close.gone) || {},
      dancing = p.mode === "pairs",
      fl = flyerNow(p, t);
    const guests = CAST.guests
      .filter((g) => !gone[g.id])
      .map((g) => {
        const at = p.alarm && p.alarm.w.id === g.id ? p.alarm.w : p.people[g.id],
          to = g.pair ? p.people[g.pair] : null;
        // P3 and P4: partners dance; the camera tourist and the glancer, with no partner, watch the band. From P6 on,
        // each guest dances when stopped and walks when going somewhere (party-free.js).
        const dance = p.alarm ? 0 : late ? (at.dance ? 1 : 0) : dancing && to ? 1 : 0;
        // the octopus with his arms out: a chase, a hug, or his arms dropping as he gets bored (P6 only)
        const o = g.id === "octopus-guest" && p.scene === "P6" && p.oct && p.oct.arms > 0.02 ? p.oct : null,
          arms = o ? { k: o.arms, toward: Math.sign(s.x - at.x) || 1, hug: o.mode === "hug", hugK: o.mode === "hug" ? Math.min(1, o.ht / OCT.squeeze) : 0, bored: o.mode === "bored" } : null;
        return { id: g.id, x: at.x, y: at.y, dance: arms ? 0 : dance, lean: to ? Math.sign(to.x - at.x) : 0, arms };
      });
    const marks = [];
    // Marks sit over a person's head, however tall the hall draws them (head height comes from the hall's sizes).
    const adult = e.hallSizes().adult,
      size = Math.round(adult * MARK.size),
      over = (id) => tallOf(id, adult) + adult * MARK.over;
    if (p.seenBy && p.scene !== "P8b") {
      const w = h.personAt(p, p.seenBy);
      w && marks.push({ x: w.x, y: w.y - over(p.seenBy), mark: "?", size });
    }
    // the glancer's warning "?" as his head turns
    if (p.scene === "P2" && !p.alarm && h.glancePhase(p).phase === "warn") {
      const g = p.people.backpack;
      marks.push({ x: g.x, y: g.y - over("backpack"), mark: "?", size });
    }
    const a = p.alarm;
    const shout = a && (a.phase === "shout" || (a.phase === "run" && a.t < 0.5)) ? { x: a.w.x, y: a.w.y - over(a.w.id) - 12 } : null;
    a && a.phase === "shout" && marks.push({ x: a.w.x + 40, y: a.w.y - over(a.w.id) + 14, mark: "!", size });
    // Guards show "!" at once when they see him (party plan, Sight).
    a && a.guards.forEach((g) => g.room === "hall" && g.sees && marks.push({ x: g.x, y: g.y - over("guard"), mark: "!", size }));
    // No mark and no "FUR!" burst sits on Squatch (a guest just below him would put it on his head): it moves beside
    // that guest's head, on the side away from him, else above him.
    if (p.pose === "stand") {
      const k = e.hallSizes().squatch,
        sq = { x0: s.x - 22 * k, x1: s.x + 22 * k, y0: s.y - 72 * k, y1: s.y + 2 },
        on = (x, y, rx, ry) => x - rx < sq.x1 && x + rx > sq.x0 && y - ry < sq.y1 && y + ry > sq.y0,
        clear = (o, rx, ry) => {
          if (!on(o.x, o.y, rx, ry)) return;
          const away = Math.sign(o.x - s.x) || 1,
            tries = [[o.x + away * (rx + 24), o.y + 34], [o.x - away * (rx + 24), o.y + 34], [o.x, sq.y0 - ry - 6]],
            ok = tries.find(([x, y]) => !on(x, y, rx, ry)) || tries[0];
          ((o.x = ok[0]), (o.y = ok[1]));
        };
      for (const mk of marks) clear(mk, mk.size / 2, mk.size / 2);
      shout && clear(shout, 54, 36);
    }
    const outlineHidden = p.pose === "hidden" || p.pose === "bed";
    const eyes = p.pose === "hidden" ? eyesAt(p, t) : null;
    const cam = p.people.camera,
      tripodAt = late ? { x: cam.x - 28, y: cam.y + 6 } : CAST.guests.find((g) => g.id === "camera").tripod;
    const outfit = late ? wornNow(p) : null,
      shake = Math.max((p.vent && p.vent.shake) || 0, p.shake || 0);
    const bartender = a && a.w.id === "bartender" ? { x: a.w.x, y: a.w.y, f: Math.sign(a.w.x - a.w.hx) || -1 } : gone.bartender ? null : { x: (p.bartenderAt || CAST.bartender).x, y: (p.bartenderAt || CAST.bartender).y, f: p.bartenderAt && p.bartenderAt.walk ? 1 : -1 };
    const m = p.mops;
    return {
      t,
      picture: h.picture,
      banner: { glow: p.glow || 0 },
      lights: p.lights ? { dim: p.lightK == null ? 1 : p.lightK, color: SONG_LIGHTS[(p.song || 0) % 3] } : null,
      isfred: gone.isfred ? null : p.isfred,
      band: { playing: p.band, spots: p.bandAt || CAST.band, gone: ["band0", "band1", "band2"].map((id) => !!gone[id]) },
      guests,
      bartender,
      guards: a ? a.guards.filter((g) => g.room === "hall").map((g) => ({ x: g.x, y: g.y, f: Math.cos(g.a) < 0 ? -1 : 1 })) : [],
      // the camera points at the stage, and at the row while the group photo is on
      tripod: gone.camera ? null : { ...tripodAt, aim: aimNow(p) },
      // closing time: nobody is watching for him any more (they are leaving), so no cones (rule 8: a cone always reacts)
      cones: p.scene === "P8b" ? [] : h.cones(p).filter((c) => !gone[c.id]),
      // the peek teaches cones, and the flyer sneak is planned by looking: both draw every cone whole
      allCones: p.scene === "P1" || p.scene === "P4",
      noteCone: (c) => e.noteCone(c),
      // While a line is up or a scripted walk runs, nobody sees him, so no cone fills yellow (drawn equals sight).
      unseen: !(e.get("ctrl") && !e.current()) || p.scene === "P8b",
      // In a whole disguise nobody knows him: a cone that holds him stays dashed (only the "?" shows).
      fooled: late && !furShows(p),
      squatch: outlineHidden ? { x: s.x, y: s.y, pose: "hidden" } : { x: s.x, y: s.y, f: s.f || 1, walk: e.walkPhase(), pose: p.pose === "peek" ? "peek" : "stand", flyer: p.flyer === "paw", shake, outfit, hop: bounceHop(p) },
      eyes,
      marks,
      shout,
      alarm: !!a && a.phase !== "shout" && a.phase !== "run" && a.phase !== "calm",
      tufts: ventTufts(p),
      warning: p.vent && p.vent.t > 0 && p.pose === "stand" ? { k: Math.min(1, p.vent.t * 4) } : null,
      floor: (ctx) => floor(ctx, p, t),
      extra: [
        ...(m ? [{ y: m.y, f: () => e.drawMopsOn(ctx0, m.x, m.y, e.hallSizes().squatch * 1.15, { f: m.f, walk: m.walk ? t * 8 : 0, headDown: !!m.walk, sweep: m.walk ? Math.sin(t * 6) * 4 : 0 }) }] : []),
        ...(fl ? [{ y: fl.depth, f: () => drawFlyerLit(ctx0, fl) }] : []),
      ],
    };
  }
  // Where the camera points: the row during the photo moment (until everyone walks back), else the stage.
  // (the stage's middle while Isfred speaks; the Croc Boys once they play)
  const aimNow = (p) => (p.shot && ["gather", "settle", "count", "flash", "polaroid"].includes(p.shot.phase) ? PHOTO_ROW.aim : p.mode === "pairs" && !LATE.has(p.scene) ? BAND_AIM : CAMERA_AIM);
  let ctx0 = null;
  // The flyer in the hall, with a yellow glow while Squatch thinks about it.
  function drawFlyerLit(ctx, fl) {
    if (fl.glow) {
      // (the glow is its own soft yellow patch behind the paper, so the paper itself stays white)
      ctx.save();
      ctx.shadowColor = `rgba(255,207,51,${fl.glow})`;
      ctx.shadowBlur = 24;
      ctx.fillStyle = "#ffcf33";
      ctx.fillRect(fl.x - fl.size * 0.4, fl.y - fl.size * 0.55, fl.size * 0.8, fl.size * 1.1);
      ctx.restore();
    }
    drawFlyer(ctx, fl.x, fl.y, fl.size, fl.rot);
  }
  // On the floor, under everyone: pieces that fell, Mops's wet streak and his heart cone.
  function floor(ctx, p, t) {
    for (const f of p.fallen || []) f.to === "floor" && drawLoosePiece(ctx, f.id, f.x, f.y, 22, f.rot);
    const m = p.mops;
    if (!m) return;
    for (const w of m.wet) {
      ctx.fillStyle = "rgba(140,190,230,.35)";
      ctx.beginPath();
      ctx.ellipse(w.x, w.y, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const c = E().coneSize();
    if (m.heart > 0) {
      const a = m.a == null ? Math.PI : m.a;
      drawHeartCone(ctx, m.x, m.y - 30, a, c.half, c.len, t, m.heart);
      E().noteCone({ ox: m.x, oy: m.y - 30, a, half: c.half, len: c.len, heart: true });
    }
  }
  // His eyes in the plant he hides in; in P3 and P4 they move from pair to pair.
  function eyesAt(p, t) {
    const pl = HALL.plants.find((q) => q.id === (p.hideAt || "middle"));
    const look = p.follow || p.scene === "P4" ? Math.round(Math.sin(t * 0.9)) * 3 : 0;
    return { x: pl.eyes.x + look, y: pl.eyes.y };
  }
  // The one flyer in the hall (P3 and P4), wherever it is unless it is in Squatch's paw (he is drawn with it):
  // in Isfred's hand through his lines, going down onto the stage's right end as he bends, lying there, and going
  // up into Squatch's paw at GRAB · flyer. Returns { x, y, size, rot, glow, depth } or null.
  function flyerNow(p, t) {
    if (LATE.has(p.scene) || !["P3", "P4"].includes(p.scene)) return null;
    const lie = { x: FLYER.x, y: FLYER.y, size: FLYER.size, rot: 0.2 },
      mix = (a, b, k) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k - Math.sin(k * Math.PI) * 10, size: a.size + (b.size - a.size) * k, rot: a.rot + (b.rot - a.rot) * k });
    if (!p.flyer) {
      // still Isfred's: in his raised hand, then down to the stage as he bends
      const f = p.isfred,
        hand = { x: f.x + FLYER.hand.dx, y: f.y + FLYER.hand.dy, size: FLYER.hand.size, rot: -0.15 };
      return { ...(f.bend ? mix(hand, lie, f.bend) : hand), depth: f.y + 1 };
    }
    if (p.flyer !== "stage") return null;
    if (p.grab != null) {
      const s = h.sq();
      return { ...mix(lie, flyerInPaw(s.x, s.y, s.f || -1, E().hallSizes().squatch), p.grab), depth: Math.max(FLYER.y, s.y) + 1 };
    }
    return { ...lie, glow: p.flyerGlow ? 0.75 + 0.25 * Math.sin(t * 6) : 0, depth: FLYER.y };
  }
  // The flyer at home: in his paw as he comes in, going down to the floor by the door, lying there.
  function flyerAtHome(p) {
    const to = { x: h.homeRoom.flyer.x, y: h.homeRoom.flyer.y, size: 16, rot: 0.5 };
    if (p.flyer === "floor") return to;
    if (p.flyer !== "paw" && p.flyer !== "down") return null;
    const s = h.sq(),
      paw = flyerInPaw(s.x, s.y, s.f || -1, E().squatchScale()),
      k = p.flyer === "down" ? (p.put || 0) ** 2 * (3 - 2 * (p.put || 0)) : 0;
    return { x: paw.x + (to.x - paw.x) * k, y: paw.y + (to.y - paw.y) * k, size: paw.size + (to.size - paw.size) * k, rot: paw.rot + (to.rot - paw.rot) * k };
  }
  /** Tests: where the flyer is drawn now ({ x, y, size }), in the hall or at home, or null when there is none. */
  function flyerAt(p) {
    const e = E();
    if (e.room() === "closet") return flyerAtHome(p);
    if (e.room() !== "hall") return null;
    if (p.flyer === "paw") {
      const s = h.sq();
      return flyerInPaw(s.x, s.y, s.f || 1, e.hallSizes().squatch);
    }
    return flyerNow(p, e.time());
  }
  // Over the hall from P6 on: the pyramid, the music, the camera, the pieces in the air.
  function drawLate(ctx, p, t) {
    const e = E(),
      s = h.sq(),
      scale = e.hallSizes().squatch,
      gone = (p.close && p.close.gone) || {};
    drawPyramid(ctx, p, s, t);
    for (const f of p.fallen || []) f.to === "plant" && drawLoosePiece(ctx, f.id, f.x, f.y, 22, f.rot);
    drawBump(ctx, bumpMark(p, scale));
    const cam = p.people.camera;
    // the camera's three red lights, only during the group photo's count
    p.shot && p.shot.phase === "count" && !gone.camera && drawCountdown(ctx, cam.x - 28, cam.y + 6, p.shot.n, t);
    const adult = e.hallSizes().adult;
    p.clap > 0 && Object.entries(p.people).forEach(([id, g]) => id !== "camera" && drawClap(ctx, g.x, g.y - tallOf(id, adult) - 14, t));
    const oc = p.people["octopus-guest"];
    p.oct && (p.oct.mode === "chase" || p.oct.mode === "hug") && drawHiccups(ctx, oc.x, oc.y - tallOf("octopus-guest", adult), t);
    // the band's notes float out to the sides and toward the crowd, never up onto the banner
    p.band && drawBandNotes(ctx, p.bandAt || CAST.band, t, p.song || 0, adult * 0.98);
    for (const f of flyingNow(p)) drawLoosePiece(ctx, f.id, f.x, f.y, f.w, f.rot);
    p.speakerOn && drawSpeakerRing(ctx, HALL_SPEAKER, t);
    // the flash: a small burst at the camera's lens (never the whole room)
    gone.camera || drawFlash(ctx, p.flash, cameraLens({ x: cam.x - 28, y: cam.y + 6 }, aimNow(p)));
  }

  /** The hall (the party owns its drawing). Returns true when drawn. */
  function drawRoom(ctx, p) {
    const e = E(),
      t = e.time();
    ctx0 = ctx;
    drawHall(ctx, e, h.guests, view(p, t));
    LATE.has(p.scene) && drawLate(ctx, p, t);
    outline(p, "hall");
    return true;
  }
  function outline(p, room) {
    const id = h.goalId(p, room);
    if (!id) return;
    const s = h.spots().find((q) => q.id === id) || { id, verb: "", cap: "" };
    E().markGoal(s);
  }
  /** Drawn after the room: the snack close-up over the hall; over the home room, the party's things there. */
  function draw(ctx, p) {
    const e = E(),
      t = e.time();
    if (e.room() === "hall") return void (p.snack && drawSnackCloseUp(ctx, p, t, e.drawPawArm));
    if (e.room() !== "closet") return;
    p.scene === "P1" && p.phase === "home" && drawDoorNotes(ctx, h.homeDoor, t);
    p.flyer === "floor" && drawFlyer(ctx, h.homeRoom.flyer.x, h.homeRoom.flyer.y, 16, 0.5);
    const s = h.sq();
    const sk = e.squatchScale();
    // coming home with the flyer: in his paw, then put down on the floor by the door (where it lies from then on)
    const fh = flyerAtHome(p);
    fh && p.flyer !== "floor" && drawFlyer(ctx, fh.x, fh.y, fh.size, fh.rot);
    const
      standing = p.pose === "stand" && e.get("sqPose") === "stand";
    let wear = p.scene === "P5" ? p.outfit : LATE.has(p.scene) ? wornNow(p) : null;
    // Mops lifting the piece off his head: it is drawn in the air, not on him.
    const lifted = p.lift && p.lift.id ? p.lift : null;
    lifted && (wear = { ...wear, head: "" });
    if (wear && standing) {
      ctx.save();
      // while Mops looks at the costume, it glows (what the next line is about)
      p.costumeLook && ((ctx.shadowColor = `rgba(255,207,51,${0.75 + 0.25 * Math.sin(t * 6)})`), (ctx.shadowBlur = 26));
      drawOutfit(ctx, s.x, s.y, sk, wear, s.f || 1);
      ctx.restore();
    }
    if (p.lift && standing) {
      const m = e.pos("mops"),
        hs = BODY_SPOTS.head,
        from = { x: s.x, y: s.y + hs.y * sk - 8 * sk },
        to = liftTo(m, s, sk);
      if (lifted) {
        // (lifted off him, then set down on the floor between them, where it stays)
        const at = p.lift.set != null ? setDownAt(p.lift.held, p.lift.rest, p.lift.set) : liftAt(from, to, p.lift.k);
        drawLoosePiece(ctx, lifted.id, at.x, at.y, hs.w * sk, at.rot);
      } else drawPat(ctx, s.x, s.y - 50 * sk, p.lift.k, 26 * sk * 0.5);
    }
    // the TV's button, for the horn press (the TV itself is the room's)
    p.tv && drawTv(ctx, TV, t, p.tv.lit == null ? null : p.tv.lit);
    const g = p.alarm && p.alarm.homeGuard;
    if (g) {
      // As tall next to Squatch as in the hall (Squatch is 80% of a grown-up): the home room draws him bigger. He
      // carries a flashlight, and his search cone is drawn as its beam, from the flashlight in his hand (Brian
      // 2026-11-24); sight itself is unchanged (party-watch.js seenPointDrawn).
      const tall = homeGuardHeight(),
        f = Math.cos(g.a) < 0 ? -1 : 1,
        c = { ...homeGuardCone(p.alarm, e.coneSize(), torchShift(g, tall, f)), beam: true };
      drawCones(ctx, [c], s, p.pose === "bed", true, (k) => e.noteCone(k));
      // The cone lies under everyone, as in the hall (nothing is drawn over Squatch): standing in the room he is
      // drawn again on top of it, with what he wears, behind the guard or in front of him by where his feet are.
      const again = () => standing && (e.drawSquatch(ctx, s.x, s.y, sk, { f: s.f || 1, walk: e.walkPhase() }), wear && drawOutfit(ctx, s.x, s.y, sk, wear, s.f || 1));
      s.y <= g.y && again();
      drawPerson(ctx, g.x, g.y, tall, { ...guardLook(g), torch: true }, f, t);
      s.y > g.y && again();
      // "?" while he searches, "!" once he sees him
      const mk = guardMark(g, tall, f);
      mk && drawMark(ctx, mk.x, mk.y, mk.mark, mk.size, t);
    }
    outline(p, "closet");
  }
  // How tall the guard is drawn in the home room.
  function homeGuardHeight() {
    return (50 * E().squatchScale()) / 0.8;
  }
  return { view, eyesAt, drawRoom, draw, furShows, homeGuardHeight, flyerAt };
}
