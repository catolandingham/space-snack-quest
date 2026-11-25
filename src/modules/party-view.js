/**
 * What the party night draws, from its game state (split out of party.js; half-one review: "split ... the drawing
 * view out"). The hall is drawn by party-draw.js from one description of what is on screen (a "view"); this file
 * builds that view for every scene, and draws the party's things over the home room (the music notes at the door,
 * the flyer on the floor, his outfit, the guard who follows him home, Mops out of breath).
 */
import { HALL, CAST, CAMERA_AIM, HALL_SPEAKER } from "./party-hall.js";
import { drawCones } from "./party-watch.js";
import { drawHall } from "./party-draw.js";
import { drawDoorNotes, drawFlyer, drawOutfit, drawPerson, LOOKS, drawMark, drawBand, cameraLens } from "./party-art.js";
import { homeGuardCone } from "./party-alarm.js";
import { ventTufts } from "./party-vent.js";
import { wornNow, flyingNow, furShows } from "./party-outfit.js";
import { drawPyramid, drawPawIcon, drawSnackCloseUp } from "./party-snacks.js";
import { SONG_LIGHTS } from "./party-dance.js";
import { drawCountdown, drawFlash, drawPolaroid, drawBandNotes, drawClap, drawHiccups, drawSpeakerRing, drawPuffs, drawLoosePiece, drawTugWarning, drawFurryFlyer, drawHeartCone } from "./party-free-art.js";
import { PHOTO } from "./party-toys.js";
import { bounceHop, bumpMark, drawBump } from "./party-hallway.js";

const LATE = new Set(["P6", "P7", "P8a", "P8b"]);

/**
 * `h`: { E, P, sq, picture, guests (the approved art), cones (p), glancePhase (p), personAt (p, id), spots (),
 * goalId (p, room), pawShows (p), pawIcon, homeRoom, pace }.
 */
export function createView(h) {
  const E = () => h.E();

  function view(p, t) {
    const s = h.sq(),
      e = E(),
      late = LATE.has(p.scene),
      gone = (p.close && p.close.gone) || {},
      dancing = p.mode === "pairs";
    const guests = CAST.guests
      .filter((g) => !gone[g.id])
      .map((g) => {
        const at = p.alarm && p.alarm.w.id === g.id ? p.alarm.w : p.people[g.id],
          to = g.pair ? p.people[g.pair] : null;
        // P3 and P4: partners dance; the camera tourist and the glancer, with no partner, watch the band. From P6 on,
        // each guest dances when stopped and walks when going somewhere (party-free.js).
        const dance = p.alarm ? 0 : late ? (at.dance ? 1 : 0) : dancing && to ? 1 : 0;
        // a curious guest stops and turns his whole body to Squatch
        const turned = p.curious && p.curious.id === g.id && p.curious.phase !== "wait";
        return { id: g.id, x: at.x, y: at.y, dance: turned ? 0 : dance, lean: turned ? Math.sign(s.x - at.x) : to ? Math.sign(to.x - at.x) : 0 };
      });
    const marks = [];
    const cur = p.curious && p.curious.phase !== "wait" ? p.curious : null;
    if (cur) {
      // the double-take: a big "?" that grows over the turn, then stays big while that guest stares
      const w = p.people[cur.id],
        k = cur.phase === "turn" ? Math.min(1, cur.t / 2) : 1;
      w && marks.push({ x: w.x, y: w.y - 90 - 14 * k, mark: "?", size: 30 + 40 * k });
    } else if (p.seenBy && p.scene !== "P8b") {
      const w = h.personAt(p, p.seenBy);
      w && marks.push({ x: w.x, y: w.y - 84, mark: "?", size: 42 });
    }
    // the glancer's warning "?" as his head turns
    if (p.scene === "P2" && !p.alarm && h.glancePhase(p).phase === "warn") {
      const g = p.people.backpack;
      marks.push({ x: g.x, y: g.y - 84, mark: "?", size: 42 });
    }
    const a = p.alarm;
    const shout = a && (a.phase === "shout" || (a.phase === "run" && a.t < 0.5)) ? { x: a.w.x, y: a.w.y - 96 } : null;
    a && a.phase === "shout" && marks.push({ x: a.w.x + 40, y: a.w.y - 70, mark: "!", size: 42 });
    // Guards show "!" at once when they see him (party plan, Sight).
    a && a.guards.forEach((g) => g.room === "hall" && g.sees && marks.push({ x: g.x, y: g.y - 84, mark: "!", size: 42 }));
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
      shake = Math.max((p.vent && p.vent.shake) || 0, (p.tug && p.tug.shake) || 0, p.shake || 0);
    const bartender = a && a.w.id === "bartender" ? { x: a.w.x, y: a.w.y, f: Math.sign(a.w.x - a.w.hx) || -1 } : gone.bartender ? null : { x: (p.bartenderAt || CAST.bartender).x, y: (p.bartenderAt || CAST.bartender).y, f: p.bartenderAt && p.bartenderAt.walk ? 1 : -1 };
    const m = p.mops;
    return {
      t,
      picture: h.picture,
      banner: { glow: p.glow && p.scene !== "P8a" ? p.glow : 0 },
      lights: p.lights ? { dim: p.lightK == null ? 1 : p.lightK, color: SONG_LIGHTS[(p.song || 0) % 3] } : null,
      isfred: gone.isfred ? null : p.isfred,
      band: { playing: p.band, spots: p.bandAt || CAST.band, gone: ["band0", "band1", "band2"].map((id) => !!gone[id]) },
      guests,
      bartender,
      guards: a ? a.guards.filter((g) => g.room === "hall").map((g) => ({ x: g.x, y: g.y, f: Math.cos(g.a) < 0 ? -1 : 1 })) : [],
      tripod: gone.camera ? null : { ...tripodAt, aim: CAMERA_AIM },
      // closing time: nobody is watching for him any more (they are leaving), so no cones (rule 8: a cone always reacts)
      cones: p.scene === "P8b" ? [] : h.cones(p).filter((c) => !gone[c.id]),
      allCones: p.scene === "P1",
      noteCone: (c) => e.noteCone(c),
      // While a line is up or a scripted walk runs, nobody sees him, so no cone fills yellow (drawn equals sight).
      unseen: !(e.get("ctrl") && !e.current()) || p.scene === "P8b",
      squatch: outlineHidden ? { x: s.x, y: s.y, pose: "hidden" } : { x: s.x, y: s.y, f: s.f || 1, walk: e.walkPhase(), pose: p.pose === "peek" ? "peek" : "stand", flyer: p.flyer === "back", shake, outfit, tip: late ? p.tip : null, hop: bounceHop(p) },
      eyes,
      marks,
      shout,
      alarm: !!a && a.phase !== "shout" && a.phase !== "run" && a.phase !== "calm",
      tufts: ventTufts(p),
      warning: p.vent && p.vent.t > 0 && p.pose === "stand" ? { k: Math.min(1, p.vent.t * 4) } : null,
      floor: (ctx) => floor(ctx, p, t),
      extra: m ? [{ y: m.y, f: () => e.drawMopsOn(ctx0, m.x, m.y, e.hallSizes().squatch * 1.15, { f: m.f, walk: m.walk ? t * 8 : 0, headDown: !!m.walk, sweep: m.walk ? Math.sin(t * 6) * 4 : 0 }) }] : [],
    };
  }
  let ctx0 = null;
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
  // The flyers Isfred tosses (P3): they flutter down over the crowd; one lands in the plant.
  function drawFlyers(ctx, p) {
    if (p.flyers < 0 || LATE.has(p.scene)) return;
    const k = Math.min(1, p.flyers / h.pace.flyers);
    const ends = [
      [300, 420],
      [360, 470],
      [520, 440],
      [600, 520],
      [680, 430],
      [441, 470],
      [240, 520],
    ];
    ends.forEach(([x1, y1], i) => {
      const x0 = CAST.isfred.x,
        y0 = CAST.isfred.y - 70,
        x = x0 + (x1 - x0) * k + Math.sin(k * 10 + i) * 14 * (1 - k),
        y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 60;
      drawFlyer(ctx, x, y, 11, k * 4 + i);
    });
  }
  // Over the hall from P6 on: the pyramid, the music, the camera, the pieces in the air, the warnings.
  function drawLate(ctx, p, t) {
    const e = E(),
      s = h.sq(),
      scale = e.hallSizes().squatch,
      gone = (p.close && p.close.gone) || {};
    drawPyramid(ctx, p, s, t);
    for (const f of p.fallen || []) f.to === "plant" && drawLoosePiece(ctx, f.id, f.x, f.y, 22, f.rot);
    drawBump(ctx, bumpMark(p, scale));
    p.band && drawBandNotes(ctx, p.bandAt || CAST.band, t, p.song || 0);
    const cam = p.people.camera;
    if (p.photo && !gone.camera) drawCountdown(ctx, cam.x - 28, cam.y + 6, p.photo.phase === "count" ? p.photo.n : 0, t);
    p.clap > 0 && Object.entries(p.people).forEach(([id, g]) => id !== "camera" && drawClap(ctx, g.x, g.y - 80, t));
    const oc = p.people["octopus-guest"];
    p.oct && p.oct.mode === "chase" && drawHiccups(ctx, oc.x, oc.y, t);
    p.pawIcon && drawPawIcon(ctx, h.pawIcon.x, h.pawIcon.y, t);
    for (const f of flyingNow(p)) drawLoosePiece(ctx, f.id, f.x, f.y, f.w, f.rot);
    // the warning: the piece about to go, drawn big over him
    p.warn && p.warn.id && p.pose === "stand" && drawTugWarning(ctx, s.x, s.y - 50 * scale - 34, p.warn.id, t);
    p.speakerOn && drawSpeakerRing(ctx, HALL_SPEAKER, t);
    // the flash: a small burst at the camera's lens (never the whole room)
    gone.camera || drawFlash(ctx, p.flash, cameraLens({ x: cam.x - 28, y: cam.y + 6 }, CAMERA_AIM));
    // the Polaroid slides out to the camera's left, clear of Squatch standing in the shot
    p.photo && p.photo.pol > 0 && drawPolaroid(ctx, cam.x - 118, cam.y - 30, 1 - p.photo.pol / PHOTO.polaroid, (c, x, y, w, hh) => polaroidInside(c, x, y, w, hh, p, t));
  }
  // Inside the Polaroid: the band on the stage, and Squatch in his outfit in front of them.
  function polaroidInside(ctx, x, y, w, hh, p, t) {
    const e = E();
    ctx.fillStyle = "#b08968";
    ctx.fillRect(x, y + hh * 0.55, w, hh * 0.08);
    drawBand(ctx, [0.25, 0.5, 0.75].map((k) => ({ x: x + w * k, y: y + hh * 0.58 })), hh * 0.42, t, false);
    e.drawSquatch(ctx, x + w * 0.5, y + hh * 0.98, hh * 0.011, { f: 1 });
    drawOutfit(ctx, x + w * 0.5, y + hh * 0.98, hh * 0.011, wornNow(p), 1);
  }

  /** The hall (the party owns its drawing). Returns true when drawn. */
  function drawRoom(ctx, p) {
    const e = E(),
      t = e.time();
    ctx0 = ctx;
    p.pawIcon = h.pawShows(p);
    drawHall(ctx, e, h.guests, view(p, t));
    drawFlyers(ctx, p);
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
    if (p.flyer === "floor") p.scene === "P8a" ? drawFurryFlyer(ctx, h.homeRoom.flyer.x, h.homeRoom.flyer.y, t, p.glow || 0) : drawFlyer(ctx, h.homeRoom.flyer.x, h.homeRoom.flyer.y, 16, 0.5);
    const s = h.sq();
    const wear = p.scene === "P5" ? p.outfit : LATE.has(p.scene) ? wornNow(p) : null;
    wear && p.pose === "stand" && e.get("sqPose") === "stand" && drawOutfit(ctx, s.x, s.y, e.squatchScale(), wear, s.f || 1);
    if (p.puff > 0) {
      const m = e.pos("mops");
      drawPuffs(ctx, m.x + (m.f || -1) * 10, m.y - 62 * e.squatchScale(), t);
    }
    const g = p.alarm && p.alarm.homeGuard;
    if (g) {
      const c = homeGuardCone(p.alarm, e.coneSize());
      drawCones(ctx, [c], s, p.pose === "bed", true, (k) => e.noteCone(k));
      // As tall next to Squatch as in the hall (Squatch is 80% of a grown-up): the home room draws him bigger.
      drawPerson(ctx, g.x, g.y, (50 * e.squatchScale()) / 0.8, LOOKS.guard, Math.cos(g.a) < 0 ? -1 : 1, t);
      g.sees && drawMark(ctx, g.x, g.y - (50 * e.squatchScale()) / 0.8 - 26, "!", 48, t);
    }
    outline(p, "closet");
  }
  return { view, eyesAt, drawRoom, draw, furShows };
}
