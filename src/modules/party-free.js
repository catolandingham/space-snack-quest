/**
 * P6, the party in disguise (party plan P6; restart: just inside his door, the same outfit, the song that was
 * playing, the stars from snacks kept). Free play with no goal chips and no outlines after he walks in ("Optional
 * things: They discover them", 2026-11-22). The guests mill between the dance floor, the bar and the photo spot,
 * stopping to dance. The band plays three songs and the room's light changes with each; after the third, closing
 * time (P8b). Closing comes early once he has danced and done two other toys (the band goes straight to its last
 * song); otherwise the songs last COOL_HAT_SECONDS in all (a tuning pin: name and value unchanged).
 * In disguise a cone that holds him shows "?" only; a long second look from the same guest turns into "FUR!".
 * Once a piece is gone and fur shows, guests act as in P2: "?" then "!". Either way the one capture rule
 * (party-alarm.js) starts P7. The toys are in party-toys.js, the snack bar in party-snacks.js, the dance in
 * party-dance.js.
 */
import { partyLine } from "./party-lines.js";
import { MILL, DANCE_SPOT, SNACK_SPOT, HALLWAY_BACK, PYRAMID, CAST } from "./party-hall.js";
import { coneSees, lookAt, towardStage, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { startAlarm, ALARM } from "./party-alarm.js";
import { tickVent } from "./party-vent.js";
import { furShows, anyWorn, wornNow, tickPieces, bump, knockOff, bumpSpot, tipNext } from "./party-outfit.js";
import { tickConga, tickPhoto, tickOctopus, tickBeard, tickPlants, tickTug, inHallwayZone, yankBeard, PHOTO_BONUS, PHOTO, BEARD } from "./party-toys.js";
import { openSnacks, closeSnacks, tickSnacks, snackPointer, startTopple, tickTopple, SNACK_STARS, SNACK_LOOK_SECONDS } from "./party-snacks.js";
import { newDance, danceMove, tickDance, drawDanceCloseUp, DANCE } from "./party-dance.js";
import { openFullScreen, closeFullScreen } from "./fullscreen.js";

// R73 (Brian approved a 3 to 4 minute party; this slice uses 3 minutes). A tuning pin: name and value unchanged.
export const COOL_HAT_SECONDS = 180;
// The three songs share the party's length.
export const SONG_SECONDS = COOL_HAT_SECONDS / 3;
// PLACEHOLDERS for Brian: his first minute in the hall (nothing knocks a piece off, the octopus waits), how long a
// guest must look to grow curious, how long until they turn for a second look, the turn (the "?" warning), how long
// the second look lasts and how much of it sees through the disguise, how long before the same guest is curious
// again (tuned after the party robot: a plain "second look" rule caught a kid standing still on the dance floor
// in 3 seconds, because every guest faces the stage across it), how slowly guests mill and how long they stop to dance, and
// how close to the bar the paw icon shows.
export const FREE = Object.freeze({ firstMinute: 60, firstLook: 1, curiousAfter: 4, turn: 0.6, stare: 2.4, secondLook: 1.6, forget: 15, mill: 38, stops: [5, 7, 6, 8], pawNear: 260, shake: 0.4, warn: 1.2 });
// Who mills together: the dancing pair, the robot (his partner the octopus heads for the snacks), the glancer. The
// camera tourist stays with his camera.
const UNITS = Object.freeze([["teal", "stilt"], ["robot"], ["backpack"]]);
// The paw icon over the pyramid, which opens the snack close-up.
export const PAW_ICON = Object.freeze({ x: PYRAMID.x, y: PYRAMID.y - 58, r: 34 });
const step = (o, x, y, speed, dt) => {
  const dx = x - o.x,
    dy = y - o.y,
    d = Math.hypot(dx, dy),
    k = speed * dt;
  if (d <= k || d < 0.5) return ((o.x = x), (o.y = y), true);
  o.x += (dx / d) * k;
  o.y += (dy / d) * k;
  return false;
};
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
      tip: null,
      flying: [],
      fallen: [],
      clap: 0,
      stare: null,
      flash: 0,
      warn: null,
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
      let all = true;
      u.forEach((id, j) => {
        const g = p.people[id],
          x = u.length === 2 ? m.x + (j ? 36 : -36) : m.x,
          y = m.y + (j ? 4 : 0),
          moving = Math.hypot(x - g.x, y - g.y) > 1;
        moving && (g.face = Math.atan2(y - g.y, x - g.x));
        all = step(g, x, y, FREE.mill, dt) && all;
        g.dance = moving ? 0 : 1;
      });
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

  // ---------- sight in disguise ----------
  // In disguise a cone that holds him shows "?" only. A guest (or the bartender) who has had a good look grows
  // curious: a few seconds later, if he is still near, they turn to him with a big "?" (the warning, as the
  // glancer's in P2) and take a long second look at the place he stood. Still in that look at its end: "FUR!".
  // Walking out of it in time, nothing happens (2026-11-22 "Yellow, then suspicion"; party plan P6).
  function curiosity(p, dt, s, can, all) {
    const c = p.curious;
    for (const id of Object.keys(p.calm || {})) (p.calm[id] -= dt) <= 0 && delete p.calm[id];
    if (!c) {
      if (!can) return null;
      const w = all.find((q) => h.witness[q.id] && !(p.calm && p.calm[q.id]));
      if (!w) return ((p.lookT = 0), (p.lookId = ""), null);
      p.lookT = p.lookId === w.id ? (p.lookT || 0) + dt : 0;
      p.lookId = w.id;
      p.lookT >= FREE.firstLook && (p.curious = { id: w.id, phase: "wait", t: 0 });
      return null;
    }
    c.t += dt;
    const who = h.personAt(p, c.id);
    if (c.phase === "wait" && c.t >= FREE.curiousAfter) {
      const near = can && who && Math.hypot(s.x - who.x, s.y - who.y) < E().coneSize().len;
      if (!near) return void (p.curious = null);
      Object.assign(c, { phase: "turn", t: 0, at: { x: s.x, y: s.y - 20 } });
      E().sfx("bleep");
    } else if (c.phase === "turn" && c.t >= FREE.turn) Object.assign(c, { phase: "stare", t: 0, held: 0 });
    else if (c.phase === "stare") {
      const mine = all.find((q) => q.id === c.id);
      c.held = can && mine ? c.held + dt : 0;
      if (c.held >= FREE.secondLook) return c.id;
      if (c.t >= FREE.stare) ((p.curious = null), ((p.calm = p.calm || {})[c.id] = FREE.forget));
    }
    return null;
  }
  function sight(p, dt, s, can) {
    const all = can ? h.cones(p).filter((c) => coneSees(c, s)) : [];
    const fur = furShows(p);
    if (!fur) {
      const by = curiosity(p, dt, s, can, all);
      if (by) return alarm(p, by, s, whereOf(s));
      const c = p.curious;
      p.seenBy = c && c.phase !== "wait" ? c.id : all.length ? (all.find((q) => h.witness[q.id]) || all[0]).id : "";
      return;
    }
    p.curious = null;
    const seen = all.find((c) => h.witness[c.id]) || all[0] || null;
    if (!seen) return ((p.seenBy = ""), (p.seenT = 0));
    p.seenT = p.seenBy === seen.id ? p.seenT + dt : 0;
    p.seenBy = seen.id;
    p.seenT >= SEEN_TOO_LONG_SECONDS && alarm(p, seen.id, s, whereOf(s));
  }
  /** The one capture rule starts (P7): whoever saw him shouts FUR! and runs to the wall alarm. */
  function alarm(p, seerId, s, where, phase) {
    const id = h.witness[seerId] ? seerId : h.nearestGuest(p, s).id,
      w = h.personAt(p, id);
    endToys(p);
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
    h.sound.hum(0);
    E().forgetSaved();
    h.raise(p);
  }
  function endToys(p) {
    p.dance && closeDance(p, true);
    p.snack && (closeSnacks(p), h.control(true));
    p.conga && (p.conga.joined = false);
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
      },
      pointer(kind) {
        const q = h.P();
        if (kind !== "down" || !q || !q.dance) return;
        danceMove(q.dance);
        h.sound.one("robot");
        q.dance.moves % 3 === 1 && h.sound.one("cheer");
      },
    });
  }
  function closeDance(p, quiet) {
    closeFullScreen();
    danceView = null;
    p.dance = null;
    if (quiet) return;
    p.done.dance = true;
    p.clap = DANCE.clap;
    h.sound.one("clap");
    h.control(true);
  }

  // ---------- every frame ----------
  function tick(p, dt, s, free, paused) {
    const e = E(),
      scale = e.hallSizes().squatch;
    tickPieces(p, dt);
    p.flash = Math.max(0, p.flash - dt);
    if (p.scene === "P7") {
      // as the bell starts (after the first alarm's close-up, which hides the hall)
      p.alarm && ["ring", "search", "home"].includes(p.alarm.phase) && p.beard && !p.beard.gone && p.beard.yank < 0 && (yankBeard(p), h.sound.one("zip"));
      tickBeard(p, dt);
      return;
    }
    if (paused) return;
    p.ft += dt;
    const first = p.ft < FREE.firstMinute;
    // the songs, and closing time
    p.songT += dt;
    if (p.songT >= SONG_SECONDS && !(p.dance && p.dance.t < DANCE.least)) {
      if (p.song >= 2) return void (p.dance || p.snack ? (p.dance && closeDance(p), p.snack && (closeSnacks(p), h.control(true))) : h.toClosing());
      p.song += 1;
      p.songT = 0;
      h.sound.song(p.song);
    }
    p.dance && (tickDance(p.dance, dt), p.dance.song !== p.song && p.dance.t >= DANCE.least && closeDance(p));
    const others = ["conga", "photo", "snacks", "octopus", "hallway"].filter((k) => p.done[k]).length;
    if (p.done.dance && others >= 2 && p.song < 2 && !p.early) ((p.early = true), (p.song = 2), (p.songT = 0), h.sound.song(2));
    p.clap = Math.max(0, p.clap - dt);
    p.shake = Math.max(0, p.shake - dt);
    p.warn && (p.warn.t -= dt) <= 0 && (p.warn = null);
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
    if (ph === "flash" || ph === "photo") ((p.flash = 0.25), h.sound.one("flash"));
    ph === "photo" && ((p.done.photo = true), e.addStars(PHOTO_BONUS), h.sound.one("cheer"), h.sound.one("zzzt"));
    // the octopus
    const oc = tickOctopus(p, dt, s, { firstMinute: first, canChase: stand, hidden: p.pose !== "stand" });
    if (oc === "notice") {
      p.done.octopus = true;
      h.sound.one("hiccup");
      h.control(false);
      p.talker = "octopus-guest";
      e.queue([h.say("tourist", "octopus-hic"), h.say("sq", "sq-juke", "whisper"), e.run(() => h.P() && h.P().scene === "P6" && h.control(true))]);
    }
    if (oc === "hug") {
      h.sound.one("hiccup");
      h.sound.one("squish");
      hit(p, bump(p, s, scale, "floor", null, first), s);
    }
    // the hallway: Mops's beard
    const shown = p.beard && p.beard.show > 0.5;
    tickBeard(p, dt);
    !shown && p.beard.show > 0.5 && h.sound.one("swish");
    h.sound.hum(p.beard && !p.beard.gone ? 0.35 + 0.65 * p.beard.show : 0);
    if (stand && inHallwayZone(s) && !p.hallStop) meetMops(p);
    // the plants and the vent
    const pl = stand ? tickPlants(p, s, scale, first) : "";
    pl && h.sound.one("rip");
    hit(p, pl, s);
    if (anyWorn(p)) {
      const tg = tickTug(p, dt, s, scale, first);
      tg === "warn" && h.sound.one("whoosh");
      tg === "warn" && ((p.warn = { id: wornNow(p)[p.tip ? p.tip.spot : bumpSpot(p)] || "", t: FREE.warn }), (p.shake = FREE.shake), h.sound.one("fwip"));
      tg === "off" && h.sound.one("pieceOff");
    } else {
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
      if (first) hit(p, (tipNext(p), "tip"), s);
      else {
        const spot = bumpSpot(p);
        spot && (knockOff(p, spot, s, scale, "floor"), hit(p, "off", s));
      }
      p.stare = { t: SNACK_LOOK_SECONDS, at: { x: s.x, y: s.y } };
      h.sound.one("gasp");
    }
    sight(p, dt, s, stand);
  }
  // A bump's three signs: a sound, a short shake, the piece drawn big over him (or it flying off).
  function hit(p, what, s) {
    if (what !== "tip" && what !== "off") return;
    p.shake = FREE.shake;
    const id = what === "tip" && p.tip ? p.outfit[p.tip.spot] : "";
    id && (p.warn = { id, t: FREE.warn });
    h.sound.one(what === "off" ? "pieceOff" : "fwip");
  }
  // He heads for the hallway doorway: Mops's beard is there; he stops short, thinks "Mops!", and steps back.
  function meetMops(p) {
    const e = E(),
      first = !p.done.hallway;
    p.hallStop = true;
    p.done.hallway = true;
    p.beard.force = BEARD.shows;
    p.beard.show = 1;
    h.control(false);
    e.queue([
      e.run(() => h.sound.one("uhoh")),
      ...(first ? [h.say("sq", "sq-mops", "whisper")] : []),
      e.until((dt) => e.step("sq", HALLWAY_BACK.x, HALLWAY_BACK.y, 200, dt)),
      e.run(() => {
        const q = h.P();
        q && ((q.hallStop = false), q.scene === "P6" && h.control(true));
      }),
    ]);
    p.shake = FREE.shake;
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
