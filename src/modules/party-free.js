/**
 * P6, the party in disguise (party plan P6; restart: just inside his door, the same outfit, the song that was
 * playing, the stars from snacks kept). Free play with no goal chips and no outlines after he walks in ("Optional
 * things: They discover them", 2026-11-22). The guests mill between the dance floor, the bar and the photo spot,
 * stopping to dance. The band plays three songs and the room's light changes with each; after the third, closing
 * time (P8b). Closing comes early once he has danced and done two other toys (the band goes straight to its last
 * song); otherwise the songs last COOL_HAT_SECONDS in all (a tuning pin: name and value unchanged).
 * In a whole disguise a cone that holds him shows "?" only, and nobody ever looks twice: nothing tips, and a piece
 * comes off only in the two big moments, the snack pyramid crashing and the octopus's second hug (Brian 2026-11-24,
 * "Lose it all"). Once a piece is gone and fur shows, guests act as in P2: "?" then "!", and the one capture rule
 * (party-alarm.js) starts P7. The toys are in party-toys.js, the snack bar in party-snacks.js, the dance in
 * party-dance.js.
 */
import { partyLine } from "./party-lines.js";
import { MILL, DANCE_SPOT, SNACK_SPOT, PYRAMID, CAST, stepTo, stepClear, CLEAR_OF_SQUATCH } from "./party-hall.js";
import { coneSees, lookAt, towardStage, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { startAlarm, ALARM } from "./party-alarm.js";
import { tickVent } from "./party-vent.js";
import { furShows, anyWorn, wornNow, tickPieces, knockNext } from "./party-outfit.js";
import { tickConga, tickPhoto, PHOTO_BONUS, PHOTO } from "./party-toys.js";
import { tickOctopus, chasing, OCT } from "./party-octopus.js";
import { inHallwayZone, startBounce, tickBounce } from "./party-hallway.js";
import { openSnacks, closeSnacks, tickSnacks, snackPointer, startTopple, tickTopple, SNACK_STARS, SNACK_LOOK_SECONDS } from "./party-snacks.js";
import { newDance, danceMove, tickDance, drawDanceCloseUp, drawCloseButton, danceClose, DANCE } from "./party-dance.js";
import { openFullScreen, closeFullScreen } from "./fullscreen.js";

// R73 (Brian approved a 3 to 4 minute party; this slice uses 3 minutes). A tuning pin: name and value unchanged.
export const COOL_HAT_SECONDS = 180;
// The three songs share the party's length.
export const SONG_SECONDS = COOL_HAT_SECONDS / 3;
// PLACEHOLDERS for Brian:
//   firstMinute  his first minute in the hall: the octopus waits
//   mill, stops  how slowly guests mill and how long they stop to dance; pawNear  how close the paw icon shows
//   shake        how long he shakes when a piece is knocked off
//   clearOf      guests walking go round Squatch this far from him (nobody walks through anybody); giveWay  how long a
//                group waits when he stands on the spot it is heading for, before it heads for another
export const FREE = Object.freeze({ firstMinute: 60, mill: 38, stops: [5, 7, 6, 8], pawNear: 260, shake: 0.4, clearOf: CLEAR_OF_SQUATCH, giveWay: 1.5 });
// Who mills together: the dancing pair, the robot (his partner the octopus heads for the snacks), the glancer. The
// camera tourist stays with his camera.
const UNITS = Object.freeze([["teal", "stilt"], ["robot"], ["backpack"]]);
// The paw icon over the pyramid, which opens the snack close-up.
export const PAW_ICON = Object.freeze({ x: PYRAMID.x, y: PYRAMID.y - 58, r: 34 });
const step = stepTo;
const inSpot = (s) => ((s.x - DANCE_SPOT.x) / DANCE_SPOT.rx) ** 2 + ((s.y - DANCE_SPOT.y) / DANCE_SPOT.ry) ** 2 <= 1;
/** Which "where-*" line names where he is (the LOCKUP card). */
export function whereOf(s) {
  if (inSpot(s)) return "where-dance";
  if (s.x > 740 && s.y > 340) return "where-bar";
  return "where-hall";
}

/**
 * `h` is the party's own helpers: { E, sq, say, chip, control, cones (p), nearestGuest (p, s), personAt (p, id),
 * witness (who can raise the alarm, and the LOCKUP line naming them), raise (p), sound, guests (the approved art),
 * toClosing () (P8b) }.
 */
export function createFreePlay(h) {
  const E = () => h.E();
  let danceView = null;

  /** P6 begins (walking in after the dress-up, or a restart just inside his door). */
  function start(p, keep) {
    Object.assign(p, {
      ft: 0,
      song: keep.song || 0,
      songT: 0,
      done: { ...(keep.done || {}) },
      snacks: keep.snacks || { bag: 0, taken: [], toppled: false, chain: -1 },
      looks: {},
      lostPieces: [],
      flying: [],
      fallen: [],
      clap: 0,
      stare: null,
      flash: 0,
      shake: 0,
      flyer: "floor",
    });
    for (const g of Object.values(p.people)) Object.assign(g, { task: "", wait: 0, face: null, dance: 1 });
    UNITS.forEach((u, i) => (p.people[u[0]].spot = -1 - i));
    h.sound.song(p.song);
  }

  // ---------- the guests mill ----------
  function mill(p, dt) {
    const used = new Set(UNITS.map((u) => p.people[u[0]].spot));
    UNITS.forEach((u, i) => {
      const lead = p.people[u[0]];
      if (u.some((id) => p.people[id].task)) return;
      if (lead.spot < 0 || (lead.wait <= 0 && lead.arrived)) {
        // the next place: one no other group is at, chosen in a fixed order
        let k = lead.spot < 0 ? (i * 2 + 1) % MILL.length : lead.spot;
        for (let n = 0; n < MILL.length; n++) {
          k = (k + 1 + i) % MILL.length;
          if (!used.has(k)) break;
        }
        used.delete(lead.spot);
        used.add(k);
        lead.spot = k;
        lead.arrived = false;
        lead.stops = (lead.stops || 0) + 1;
      }
      const m = MILL[lead.spot];
      let all = true,
        left = 0;
      u.forEach((id, j) => {
        const g = p.people[id],
          x = u.length === 2 ? m.x + (j ? 36 : -36) : m.x,
          y = m.y + (j ? 4 : 0),
          moving = Math.hypot(x - g.x, y - g.y) > 1;
        moving && (g.face = Math.atan2(y - g.y, x - g.x));
        all = stepClear(g, x, y, FREE.mill, dt, h.sq(), FREE.clearOf) && all;
        left += Math.hypot(x - g.x, y - g.y);
        g.dance = moving ? 0 : 1;
      });
      // he stands on (or right by) their spot: when they stop getting closer for a moment, they give up on it and head
      // for another
      if (all || left < (lead.best ?? Infinity) - 1) ((lead.best = all ? Infinity : left), (lead.blockT = 0));
      else lead.blockT = (lead.blockT || 0) + dt;
      if (lead.blockT > FREE.giveWay) return void ((lead.blockT = 0), (lead.best = Infinity), (lead.arrived = true), (lead.wait = 0));
      if (all && !lead.arrived) ((lead.arrived = true), (lead.wait = FREE.stops[(lead.stops + i) % FREE.stops.length]));
      if (all) {
        lead.wait -= dt;
        // stopped: partners face each other, a guest alone faces the band
        u.forEach((id, j) => {
          const g = p.people[id],
            to = u.length === 2 ? p.people[u[1 - j]] : null;
          g.face = to ? lookAt(g.x, g.y, { x: to.x, y: to.y - 28 }) : towardStage(g.x, g.y);
        });
      }
    });
    const cam = p.people.camera;
    cam && (cam.face = towardStage(cam.x, cam.y));
  }

  // ---------- sight ----------
  // In a whole disguise nobody knows him: a cone that holds him shows "?" over that guest and nothing more, however
  // long he stays (Brian 2026-11-24: "No yellow in disguise"; "Lose it all"). Once fur shows it is P2's rule again:
  // "?" and, if he stays in that cone too long, "FUR!".
  function sight(p, dt, s, can) {
    const all = can ? h.cones(p).filter((c) => coneSees(c, s)) : [];
    const seen = all.find((c) => h.witness[c.id]) || all[0] || null;
    if (!seen) return ((p.seenBy = ""), (p.seenT = 0));
    p.seenT = furShows(p) && p.seenBy === seen.id ? p.seenT + dt : 0;
    p.seenBy = seen.id;
    p.seenT >= SEEN_TOO_LONG_SECONDS && alarm(p, seen.id, s, whereOf(s));
  }
  /** The one capture rule starts (P7): whoever saw him shouts FUR! and runs to the wall alarm. */
  function alarm(p, seerId, s, where, phase) {
    const id = h.witness[seerId] ? seerId : h.nearestGuest(p, s).id,
      w = h.personAt(p, id);
    endToys(p);
    // the alarm is the look's consequence, so no "?" stays up over that guest
    ((p.seenBy = ""), (p.seenT = 0));
    // the guests back away from where they stand now, and drift back there after
    for (const g of Object.values(p.people)) {
      const dx = g.x - 480,
        dy = g.y - 450,
        d = Math.hypot(dx, dy) || 1;
      Object.assign(g, { hx: g.x, hy: g.y, ax: (dx / d) * ALARM.backAway, ay: (dy / d) * ALARM.backAway * 0.6, task: "alarm", dance: 0 });
    }
    startAlarm(p, { id, x: w.x, y: w.y }, where, h.witness[id]);
    phase && (p.alarm.phase = phase);
    toP7(p);
  }
  function toP7(p) {
    p.scene = "P7";
    p.band = false;
    h.sound.song(-1);
    E().forgetSaved();
    h.raise(p);
  }
  function endToys(p) {
    p.dance && closeDance(p, true);
    p.snack && (closeSnacks(p), h.control(true));
    p.conga && (p.conga.joined = false);
    // the octopus drops his arms and lets go
    chasing(p.oct) && (p.oct.mode === "hug" && h.control(true), Object.assign(p.oct, { mode: "back", rest: OCT.rest, arms: 0 }));
  }

  // ---------- the dance ----------
  function openDance(p) {
    const e = E();
    h.control(false);
    p.dance = newDance();
    p.dance.song = p.song;
    h.sound.one("cheer");
    danceView = openFullScreen({
      label: "dance",
      restart: () => e.restartPart(),
      draw(ctx, w, hgt, t) {
        const q = h.P();
        if (!q || !q.dance) return;
        drawDanceCloseUp(ctx, w, hgt, h.guests, wornNow(q), t, q.dance, q.song);
        drawCloseButton(ctx, danceClose(w));
      },
      pointer(kind, x, y) {
        const q = h.P();
        if (kind !== "down" || !q || !q.dance) return;
        // the way out: the close button in the corner (the dance counts once he has made a few moves)
        const cb = danceClose(danceView ? danceView.size().w : 375);
        if (Math.hypot(x - cb.x, y - cb.y) < cb.r) return void closeDance(q);
        danceMove(q.dance);
        h.sound.one("robot");
        q.dance.moves % 3 === 1 && h.sound.one("cheer");
      },
    });
  }
  // `forAlarm`: the alarm closes it (control stays off for the capture rule). Otherwise the guests clap and he has
  // control again; the dance counts once he made a few moves.
  function closeDance(p, forAlarm) {
    const moves = p.dance ? p.dance.moves : 0;
    closeFullScreen();
    danceView = null;
    p.dance = null;
    if (forAlarm) return;
    moves >= 3 && ((p.done.dance = true), (p.clap = DANCE.clap), h.sound.one("clap"));
    h.control(true);
  }


  // ---------- every frame ----------
  function tick(p, dt, s, free, paused) {
    const e = E(),
      scale = e.hallSizes().squatch;
    tickPieces(p, dt);
    p.flash = Math.max(0, p.flash - dt);
    if (p.scene === "P7") return;
    if (paused) return;
    p.ft += dt;
    const first = p.ft < FREE.firstMinute;
    // the songs, and closing time
    p.songT += dt;
    // (closing time waits for a push back at the hallway doorway and its line to finish, and for a hug to let go)
    if (p.songT >= SONG_SECONDS && !(p.dance && p.dance.t < DANCE.least) && !p.bounce && !(p.oct && p.oct.mode === "hug")) {
      if (p.song >= 2) return void (p.dance || p.snack ? (p.dance && closeDance(p), p.snack && (closeSnacks(p), h.control(true))) : h.toClosing());
      p.song += 1;
      p.songT = 0;
      h.sound.song(p.song);
    }
    p.dance && (tickDance(p.dance, dt), p.dance.song !== p.song && p.dance.t >= DANCE.least && closeDance(p));
    // (trying the hallway doorway is not a toy: Brian 2026-11-24)
    const others = ["conga", "photo", "snacks", "octopus"].filter((k) => p.done[k]).length;
    if (p.done.dance && others >= 2 && p.song < 2 && !p.early) ((p.early = true), (p.song = 2), (p.songT = 0), h.sound.song(2));
    p.clap = Math.max(0, p.clap - dt);
    p.shake = Math.max(0, p.shake - dt);
    p.stare && (p.stare.t -= dt) <= 0 && (p.stare = null);
    mill(p, dt);
    const stand = free && p.pose === "stand" && !p.dance && !p.snack;
    // the conga line
    const cg = tickConga(p, dt, p.songT, s, {
      canJoin: stand,
      steering: e.steering(),
      tow: (to, speed, dt2) => e.step("sq", to.x, to.y, speed, dt2),
    });
    cg === "join" && ((p.done.conga = true), h.sound.one("conga"));
    p.conga && p.conga.joined && (p.congaBeat = (p.congaBeat || 0) + dt) > 0.8 && ((p.congaBeat = 0), h.sound.one("conga"));
    // the camera
    const ph = tickPhoto(p, dt, s, stand);
    if (ph === "count") {
      h.sound.one("beep");
      Math.hypot(s.x - p.people.camera.x, s.y - p.people.camera.y) < PHOTO.cheeseNear && ((p.talker = "camera"), e.ambient("tourist", partyLine("guest-cheese")));
    }
    ph === "beep" && h.sound.one("beep");
    if (ph === "flash" || ph === "photo") ((p.flash = PHOTO.flash), h.sound.one("flash"));
    ph === "photo" && ((p.done.photo = true), e.addStars(PHOTO_BONUS), h.sound.one("cheer"), h.sound.one("zzzt"));
    // the octopus
    const oc = tickOctopus(p, dt, s, { firstMinute: first, canChase: stand, hidden: p.pose !== "stand" });
    if (oc === "notice") {
      p.done.octopus = true;
      h.sound.one("hiccup");
      // His line and Squatch's two thoughts, the first time he chases (his arms are already out): what those arms
      // will do, then what to do about it. After that he just hiccups along.
      if (!p.oct.said) {
        p.oct.said = true;
        h.control(false);
        p.talker = "octopus-guest";
        e.queue([h.say("tourist", "octopus-hic"), h.say("sq", "sq-arms", "whisper"), h.say("sq", "sq-juke", "whisper"), e.run(() => h.P() && h.P().scene === "P6" && h.control(true))]);
      }
    }
    // A hug holds him for a squeeze (a squish, a shake, hearts). The first is just a hug: he is let go and the
    // chase goes on. The second one (and any after it) knocks a piece off as he is let go.
    if (oc === "hug") (h.control(false), h.sound.one("squish"), (p.shake = OCT.squeeze));
    if (oc === "letgo" || oc === "off") {
      h.control(true);
      oc === "off" && knock(p, s, scale);
    }
    // his 20 seconds are up: a bored sigh, his arms drop, and he walks back to the snacks
    oc === "bored" && h.sound.one("huff");
    // the hallway doorway: he cannot go that way yet
    // (the rest of this frame is skipped, so no alarm starts in the same frame as the push back)
    if (stand && inHallwayZone(s) && !p.bounce) return void bounceBack(p, s);
    // The plants and the vent do nothing to a disguise. With nothing left on at all, the vent's no-disguise fur
    // rule is back (party-vent.js), as in P2.
    if (!anyWorn(p)) {
      const v = tickVent(p, dt, s, stand);
      v === "warn" && (h.sound.one("whoosh"), h.sound.one("fwip"));
      if (v === "fur") return void (e.sfx("zap"), alarm(p, h.nearestGuest(p, s).id, s, "where-vent"));
    }
    // the snack bar: the bartender in the close-up, and the pyramid's chain
    const glanced = p.snack && p.snack.phase;
    const sn = tickSnacks(p, dt);
    glanced === "back" && p.snack && p.snack.phase === "glance" && h.sound.one("dun");
    sn === "catch1" && (e.sfx("bleep"), e.queue([h.say("bartender", "bartender-gloves")]));
    if (sn === "catch2") {
      e.sfx("bleep");
      e.queue([
        h.say("bartender", "bartender-fur"),
        e.run(() => {
          const q = h.P();
          q && q.scene === "P6" && alarm(q, "bartender", h.sq(), "where-bar", "run");
        }),
      ]);
    }
    const tp = tickTopple(p, dt);
    tp === "crash" && h.sound.one("crash");
    if (tp === "cup") {
      h.sound.one("crash");
      // the pyramid's flying cup knocks a piece off (one of the two big moments), and everyone stares
      knock(p, s, scale);
      p.stare = { t: SNACK_LOOK_SECONDS, at: { x: s.x, y: s.y } };
      h.sound.one("gasp");
    }
    sight(p, dt, s, stand);
  }
  // A big moment knocks his next piece off: it flies off him on screen, with its sound and a short shake.
  function knock(p, s, scale) {
    if (!knockNext(p, s, scale)) return;
    p.shake = FREE.shake;
    h.sound.one("pieceOff");
  }
  // He walks into the hallway doorway: pushed back a short way, quickly, with a small bump (a sound, a hop, a mark
  // where he hit), and then he thinks his line. Every time he tries (Brian 2026-11-24).
  function bounceBack(p, s) {
    const e = E();
    h.control(false);
    p.bounced = (p.bounced || 0) + 1;
    startBounce(p, s);
    h.sound.one("bump");
    e.queue([
      e.until((dt) => {
        const q = h.P();
        if (!q || !q.bounce) return true;
        const at = tickBounce(q, dt);
        e.place("sq", at.x, at.y);
        return at.done;
      }),
      e.run(() => h.sound.one("uhoh")),
      h.say("sq", "sq-hallway", "whisper"),
      // the push back is over only once his line is read: until then nothing else in the party starts
      e.run(() => {
        const q = h.P();
        q && ((q.bounce = null), q.scene === "P6" && h.control(true));
      }),
    ]);
  }

  // ---------- the kid's actions ----------
  function spots(p) {
    const out = [];
    if (p.scene !== "P6" || p.pose !== "stand" || p.dance || p.snack) return out;
    const s = h.sq();
    if (!furShows(p) && !(p.conga && p.conga.joined))
      out.push({ id: "dance", verb: "DANCE", cap: partyLine("button-dance").split(" · ")[1], who: "sq", x: DANCE_SPOT.x, y: DANCE_SPOT.y, r: DANCE_SPOT.rx, thing: { x0: DANCE_SPOT.x - DANCE_SPOT.rx, x1: DANCE_SPOT.x + DANCE_SPOT.rx, y0: DANCE_SPOT.y - DANCE_SPOT.ry, y1: DANCE_SPOT.y + DANCE_SPOT.ry }, when: inSpot(s), f: () => openDance(h.P()) });
    return out;
  }
  /** True while the paw icon shows: near the bar, the pyramid still standing. */
  function pawShows(p) {
    const s = h.sq();
    return p.scene === "P6" && !p.snack && !p.dance && p.pose === "stand" && !p.snacks.toppled && Math.hypot(s.x - SNACK_SPOT.x, s.y - SNACK_SPOT.y) < FREE.pawNear;
  }
  /** A tap on the picture (game positions): the paw icon walks him to the bar and opens the close-up. */
  function tap(p, x, y) {
    if (!pawShows(p) || !E().get("ctrl") || Math.hypot(x - PAW_ICON.x, y - PAW_ICON.y) > PAW_ICON.r) return false;
    const e = E();
    h.control(false);
    e.walkOff();
    e.queue([
      e.until((dt) => e.step("sq", SNACK_SPOT.x, SNACK_SPOT.y, 240, dt)),
      e.run(() => {
        const q = h.P();
        q && q.scene === "P6" && (openSnacks(q), e.sfx("open"));
      }),
    ]);
    return true;
  }
  /** A finger in the snack close-up. True when the close-up took it. */
  function pointer(p, kind, x, y) {
    if (!p.snack) return false;
    const e = E();
    const r = snackPointer(p, kind, x, y);
    r === "grab" && h.sound.one("crinkle");
    if (r === "bag" || r === "topple") ((p.done.snacks = true), e.addStars(SNACK_STARS), e.sfx("pickup"), h.sound.one("tink"));
    if (r === "topple") (closeSnacks(p), startTopple(p), h.sound.one("crash"), h.control(true));
    r === "close" && (closeSnacks(p), h.control(true));
    return true;
  }
  return { start, tick, spots, tap, pointer, pawShows, alarm, closeDance, inSpot };
}
