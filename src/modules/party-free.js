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
 * (party-alarm.js) starts P7. The toys are in party-toys.js and party-octopus.js, the snack bar in party-snacks.js
 * (GRAB · snacks at the bar opens it), the dance in party-dance.js.
 */
import { BAND_FADE, bandTrackNow } from "./party-band-order.js";
import { drawDanceWords } from "./dance-words.js";
import { partyLine } from "./party-lines.js";
import { MILL, DANCE_SPOT, SNACK_SPOT, PYRAMID, CAST, HALL, stepTo, stepClear, CLEAR_OF_SQUATCH } from "./party-hall.js";
import { coneSees, lookAt, towardStage, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { startAlarm, ALARM } from "./party-alarm.js";
import { tickVent } from "./party-vent.js";
import { furShows, anyWorn, wornNow, tickPieces, knockNext, knockOff, nextSpot } from "./party-outfit.js";
import { tickConga } from "./party-toys.js";
import { tickPhoto, startPhoto, goBack, photoActive, photoOpen, photoDone, photoSeen, drawGroupPolaroid, PHOTO, PHOTO_BONUS, PHOTO_ROW, POLAROID_LABEL } from "./party-photo.js";
import { tickOctopus, chasing, OCT, lunge, startChase } from "./party-octopus.js";
import { inHallwayZone, startBounce, tickBounce } from "./party-hallway.js";
import { openSnacks, tickTopple, snackRecord, SNACK_LOOK_SECONDS } from "./party-snacks.js";
import { snackFrame, snackTouch, snackShut } from "./party-snacks-play.js";
import { newDance, danceClose, danceTried, DANCE } from "./party-dance.js";
import { drawDanceCloseUp, drawCloseButton } from "./party-dance-art.js";
import { drawDanceEnd } from "./party-dance-end.js";
import { danceFrame, danceTouch } from "./party-dance-play.js";
import { openFullScreen, closeFullScreen } from "./fullscreen.js";

// R73 (Brian approved a 3 to 4 minute party; this slice uses 3 minutes). A tuning pin: name and value unchanged.
export const COOL_HAT_SECONDS = 180;
// The three songs share the party's length.
export const SONG_SECONDS = COOL_HAT_SECONDS / 3;
// PLACEHOLDER for Brian: coming back to the party after hiding at home, at least this much of it is left.
export const BACK_MIN_SECONDS = 60;
// Seconds of nothing between the guests' clap for his dance and the group photo's start, when he leaves his first
// dance before the first song ends (Brian 2026-11-26, showing 6: "Seems to be a long break after finishing dance now
// and picture?"; the photo waited for the song's end, 28 seconds in that video). The first song ends early instead.
export const PHOTO_AFTER_DANCE = 0.5;
// PLACEHOLDERS for Brian:
//   firstMinute  his first minute in the hall: the octopus waits
//   mill, stops  how slowly guests mill and how long they stop to dance
//   shake        how long he shakes when a piece is knocked off
//   clearOf      guests walking go round Squatch this far from him (nobody walks through anybody); giveWay  how long a
//                group waits when he stands on the spot it is heading for, before it heads for another
export const FREE = Object.freeze({ firstMinute: 60, mill: 38, stops: [5, 7, 6, 8], shake: 0.4, clearOf: CLEAR_OF_SQUATCH, giveWay: 1.5 });
// Who mills together: the dancing pair, the robot (his partner the octopus heads for the snacks), the glancer. The
// camera tourist stays with his camera.
const UNITS = Object.freeze([["teal", "stilt"], ["robot"], ["backpack"]]);
// The snack pyramid on the counter, as the thing the GRAB · snacks label names (game positions).
export const PYRAMID_BOX = Object.freeze({ x0: PYRAMID.x - 34, x1: PYRAMID.x + 34, y0: PYRAMID.y - 44, y1: PYRAMID.y + 6 });
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
      flyer: "bed",
      // the one group photo, when the first song ends (party-photo.js); a restart after it does not bring it again
      shot: keep.shot && keep.shot.phase === "done" ? { phase: "done" } : null,
      // the dance's speed he reached, and what it has paid (a restart keeps both: no farming by restarting)
      danceLevel: keep.danceLevel || 0,
      dancePay: keep.dancePay || {},
    });
    for (const g of Object.values(p.people)) Object.assign(g, { task: "", wait: 0, face: null, dance: 1 });
    UNITS.forEach((u, i) => (p.people[u[0]].spot = -1 - i));
    // (which of the band's tracks plays is party.js's every frame: party-band-order.js)
  }

  /**
   * Back to the party after hiding at home (Brian 2026-11-24): P6 goes on from where it was, with what he found, the
   * song and the clock, his disguise whole again, and at least BACK_MIN_SECONDS left on the clock.
   */
  function resume(p) {
    // (leftDoor: he walks back in through his own door, which takes him home again only once he has walked away
    // from it: party-home-early.js)
    Object.assign(p, { leftDoor: false, scene: "P6", phase: "free", alarm: null, band: true, lights: true, lost: false, calmed: false, choice: "", mopsIn: false, lostPieces: [], fallen: [], flying: [], seenBy: "", seenT: 0, stare: null, bounce: null, pose: "stand" });
    for (const g of Object.values(p.people)) Object.assign(g, { task: "", wait: 0 });
    p.oct && Object.assign(p.oct, { mode: "back", arms: 0 });
    // an alarm in the middle of the photo moment: it is over, and the band walks back to the stage first
    photoActive(p) && ((p.band = false), goBack(p));
    const left = (2 - p.song) * SONG_SECONDS + (SONG_SECONDS - p.songT);
    left < BACK_MIN_SECONDS && ((p.song = 2), (p.songT = SONG_SECONDS - BACK_MIN_SECONDS));
    // the band's track at once (party.js keeps it right every frame after)
    h.sound.song(p.band ? bandTrackNow(p) : -1);
    E().forgetSaved();
    h.chip("");
    h.control(true);
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
    // Whoever was already looking at him keeps looking (the "?" stays over the same head); with several cones on
    // him, the time he has been seen does not start over when another guest's cone catches him too.
    const seen = all.find((c) => c.id === p.seenBy && h.witness[c.id]) || all.find((c) => h.witness[c.id]) || all[0] || null;
    if (!seen) return ((p.seenBy = ""), (p.seenT = 0));
    p.seenT = furShows(p) && p.seenBy ? p.seenT + dt : 0;
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
    snackShut(p, h);
    p.conga && (p.conga.joined = false);
    // the photo moment ends where it is (the Polaroid closes; everyone walks back once the party goes on)
    if (photoActive(p)) (p.shot.phase === "polaroid" && closeFullScreen(), goBack(p));
    // the octopus drops his arms and lets go
    chasing(p.oct) && (p.oct.mode === "hug" && h.control(true), Object.assign(p.oct, { mode: "back", rest: OCT.rest, arms: 0 }));
  }

  // ---------- the dance ----------
  function openDance(p) {
    const e = E();
    h.control(false);
    // at the speed he reached last time (Brian 2026-11-25: leaving and coming back keeps his speed)
    p.dance = newDance(p.danceLevel || 0);
    p.dance.song = p.song;
    h.sound.one("cheer");
    danceView = openFullScreen({
      label: "dance",
      restart: () => e.restartPart(),
      draw(ctx, w, hgt, t) {
        const q = h.P();
        if (!q || !q.dance) return;
        drawDanceCloseUp(ctx, w, hgt, h.guests, wornNow(q), t, q.dance, q.song);
        drawDanceWords(ctx, w, hgt, q.dance);
        q.dance.over && drawDanceEnd(ctx, w, hgt, "", q.dance.level);
        drawCloseButton(ctx, danceClose(w));
      },
      pointer(kind, x, y) {
        const q = h.P();
        if (kind !== "down" || !q || !q.dance) return;
        // the way out: the close button in the corner (the dance counts once he has hit his first three spots)
        const cb = danceClose(danceView ? danceView.size().w : 375);
        if (Math.hypot(x - cb.x, y - cb.y) < cb.r) return void closeDance(q);
        // a tap on the glowing spot, on him, or nowhere; once the routine is over, "Dance again" or "Back to the
        // party" (party-dance-play.js)
        danceTouch(q, x, y, danceView ? danceView.size() : { w: 375, h: 812 }, h) === "back" && closeDance(q);
      },
    });
  }
  // `forAlarm`: the alarm closes it (control stays off for the capture rule). Otherwise the guests clap and he has
  // control again; the dance counts once he has hit his first three spots.
  function closeDance(p, forAlarm) {
    const tried = danceTried(p.dance);
    closeFullScreen();
    danceView = null;
    p.dance = null;
    if (forAlarm) return;
    tried && ((p.done.dance = true), (p.clap = DANCE.clap), h.sound.one("clap"));
    // the group photo follows the clap at once (the first song ends early): no long wait with nothing happening. (A
    // first dance over before the first song's conga, CONGA.start, skips that conga; the next song has its own.)
    tried && p.song === 0 && !p.shot && (p.songT = Math.max(p.songT, SONG_SECONDS - DANCE.clap - PHOTO_AFTER_DANCE));
    h.control(true);
  }


  // ---------- the group photo ----------
  // The first song has ended: the band stops, and everyone sets off for the row (party-photo.js).
  function beginPhoto(p) {
    p.conga && ((p.conga.on = false), (p.conga.joined = false));
    chasing(p.oct) && p.oct.mode === "hug" && h.control(true);
    // (after the photo he walks back to the snacks and rests before he chases anyone)
    p.oct && Object.assign(p.oct, { mode: "back", rest: OCT.rest, arms: 0 });
    p.band = false;
    // the song ends on a fade, not a record scratch, and the crowd cheers and claps (Brian 2026-11-26: "really abrupt
    // transition from them singing to stopping")
    h.sound.song(-1, BAND_FADE);
    h.sound.one("cheer");
    h.sound.one("clap");
    // the hall settles first; the pose, the call, the camera and the rows follow one at a time (party-photo.js)
    startPhoto(p);
  }
  // JOIN · photo: he walks into the gap left for him in the front row and stands there, facing the camera.
  function join(p) {
    const e = E();
    h.control(false);
    e.walkOff();
    e.queue([
      e.until((dt) => !h.P() || !photoOpen(h.P()) || e.step("sq", PHOTO_ROW.squatch.x, PHOTO_ROW.squatch.y, PHOTO.join, dt)),
      e.run(() => {
        const q = h.P();
        if (!q || q.scene !== "P6") return;
        // too late (the click came while he walked): he just has control again
        if (!photoOpen(q)) return void h.control(true);
        e.still("sq");
        e.face("sq", 1);
        q.shot.in = true;
        h.chip("");
      }),
    ]);
  }
  // The Polaroid of the group fills the screen; a tap closes it, and everyone walks back.
  function openPolaroid(p) {
    const e = E();
    let shown = 0;
    const art = {
      adult: e.hallSizes().adult,
      sqScale: e.hallSizes().squatch,
      squatch: (ctx, x, y, scale) => e.drawSquatch(ctx, x, y, scale, { f: 1 }),
      guest: (ctx, id, x, y, tall) => h.guests.drawId(ctx, id, x, y, tall, 0),
    };
    openFullScreen({
      label: POLAROID_LABEL,
      restart: () => e.restartPart(),
      draw(ctx, w, hgt, t) {
        const q = h.P();
        if (!q || !q.shot) return;
        shown = t;
        drawGroupPolaroid(ctx, w, hgt, art, wornNow(q), t / 0.5);
      },
      pointer(kind) {
        const q = h.P();
        if (kind !== "down" || shown < PHOTO.closeAfter || !q || !q.shot || q.shot.phase !== "polaroid") return;
        closeFullScreen();
        goBack(q);
        h.control(true);
      },
    });
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
    photoActive(p) || (p.songT += dt);
    // (the song's end waits for a push back at the hallway doorway and its line to finish, for a hug to let go, and
    // for the pyramid's crash and the stare to be over: one moment at a time)
    if (p.songT >= SONG_SECONDS && !(p.dance && p.dance.t < DANCE.least) && !p.bounce && !chasing(p.oct) && !photoActive(p) && !crashing(p)) {
      // the first song ends: the group photo, once (the second song starts when everyone is back)
      if (p.song === 0 && !photoDone(p)) return void (p.dance || p.snack ? (p.dance && closeDance(p), snackShut(p, h)) : beginPhoto(p));
      if (p.song >= 2) return void (p.dance || p.snack ? (p.dance && closeDance(p), snackShut(p, h)) : h.toClosing());
      p.song += 1;
      p.songT = 0;
    }
    p.dance && (danceFrame(p, dt, h), p.dance.song !== p.song && p.dance.t >= DANCE.least && closeDance(p));
    // (trying the hallway doorway is not a toy: Brian 2026-11-24)
    const others = ["conga", "photo", "snacks", "octopus"].filter((k) => p.done[k]).length;
    // (never before the group photo has had its moment: it comes when the first song ends)
    if (p.done.dance && others >= 2 && p.song < 2 && !p.early && photoDone(p)) ((p.early = true), (p.song = 2), (p.songT = 0));
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
    // the group photo
    const ph = tickPhoto(p, dt, s);
    // the Croc Boys pose and the crowd claps; one Croc Boy calls it from the stage (Brian 2026-11-25); everyone in
    // place: the gap glows and only now the chip and JOIN · photo
    ph === "pose" && ((p.clap = PHOTO.pose), h.sound.one("clap"));
    ph === "call" && e.ambient("band", partyLine("band-group-photo"));
    // (the chip and JOIN · photo come with the count: before it, stepping in gets him seen, #46)
    ph === "cheese" && (h.chip("chip-join-photo"), h.sound.one("beep"), (p.talker = "camera"), e.ambient("tourist", partyLine("guest-cheese")));
    (ph === "click" || ph === "photo") && E().get("ch1Chip") === partyLine("chip-join-photo") && h.chip("");
    ph === "beep" && h.sound.one("beep");
    if (ph === "click" || ph === "photo") ((p.flash = PHOTO.flash), h.sound.one("flash"));
    ph === "photo" && (p.done.photo || ((p.done.photo = true), e.addStars(PHOTO_BONUS)), h.sound.one("cheer"), h.sound.one("zzzt"));
    ph === "click" && p.shot.in && h.control(true);
    ph === "close-up" && openPolaroid(p);
    // everyone is back and the band is on the stage: the second song
    ph === "done" && ((p.band = true), (p.song = 1), (p.songT = 0), h.sound.song(bandTrackNow(p)));
    // standing in his place in the row before the 3-2-1, or still there 2 s after the click: they see him (#46)
    if (!p.alarm && p.pose === "stand" && photoSeen(p, s, dt, free)) {
      const row = ["teal", "backpack", "octopus-guest", "robot", "stilt"].map((id) => [id, p.people[id]]).filter(([, g]) => g);
      row.sort((a, b) => Math.hypot(a[1].x - s.x, a[1].y - s.y) - Math.hypot(b[1].x - s.x, b[1].y - s.y));
      goBack(p);
      return void alarm(p, row.length ? row[0][0] : "teal", s, "where-hall");
    }
    // the octopus (he stands in the photo's row with the others until it is over)
    // (he does not start, or move in, while the pyramid is crashing or everyone is staring: one moment at a time)
    const oc = photoActive(p) && p.shot.phase !== "back" ? "" : tickOctopus(p, dt, s, { firstMinute: first, canChase: stand && !crashing(p), hidden: p.pose !== "stand" });
    if (oc === "notice") {
      p.done.octopus = true;
      h.sound.one("hiccup");
      // The first time (Brian 2026-11-25, showing-5 note 7): his line, then he lunges and gives Squatch a first,
      // harmless hug; only after it does Squatch think what those arms will do, and what to do about it; then the
      // real chase. Later chases start straight away.
      if (!p.oct.said) {
        p.oct.said = true;
        h.control(false);
        p.talker = "octopus-guest";
        e.queue([h.say("tourist", "octopus-hic"), e.run(() => h.P() && lunge(h.P()))]);
      } else h.chip("chip-octopus");
    }
    // A hug holds him for a squeeze (a squish, a shake, hearts; the first one tips his hat). The first is just a
    // hug: he is let go and the chase goes on. The second one (and any after it) knocks a piece off as he is let go.
    if (oc === "hug") (h.control(false), h.sound.one("squish"), (p.shake = OCT.squeeze));
    if (oc === "letgo" && p.oct.mode === "ready") {
      // after the first hug: Squatch's two thoughts, then the real chase (the chip says what to do)
      e.queue([
        h.say("sq", "sq-arms", "whisper"),
        h.say("sq", "sq-juke", "whisper"),
        e.run(() => {
          const q = h.P();
          if (!q || q.scene !== "P6") return;
          startChase(q);
          // (an alarm or the photo may have ended the octopus's chase meanwhile: then no chip)
          chasing(q.oct) && h.chip("chip-octopus");
          h.control(true);
        }),
      ]);
    } else if (oc === "letgo" || oc === "off") {
      h.control(true);
      oc === "off" && (knock(p, s, scale), h.chip(""));
    }
    // his 20 seconds are up: a bored sigh, his arms drop, and he walks back to the snacks
    oc === "bored" && (h.sound.one("huff"), h.chip(""));
    // (he gave up because Squatch hid: the chase is over)
    p.oct && !chasing(p.oct) && p.oct.chipOn && E().get("ch1Chip") === partyLine("chip-octopus") && h.chip("");
    p.oct && (p.oct.chipOn = chasing(p.oct));
    // the hallway doorway: he cannot go that way yet
    // (the rest of this frame is skipped, so no alarm starts in the same frame as the push back)
    if (stand && inHallwayZone(s) && !p.bounce) return void bounceBack(p, s);
    // The vent (party-vent.js): in costume, staying too close it sucks his next piece in (Brian 2026-11-25, R108);
    // with nothing left on at all, the no-disguise fur rule, as in P2. The plants do nothing to a disguise.
    {
      // (nothing knocks a piece off in his first minute, the vent included)
      const v = tickVent(p, dt, s, stand && !(first && anyWorn(p)), anyWorn(p));
      v === "warn" && (h.sound.one("suction"), h.sound.one("fwip"));
      if (v === "piece") {
        const spot = nextSpot(p);
        spot && (knockOff(p, spot, s, scale, "vent", { x: HALL.vent.x, y: HALL.vent.y }), (p.shake = FREE.shake), h.sound.one("suckIn"), h.sound.one("pieceOff"));
      }
      if (v === "fur") return void (h.sound.one("suckIn"), alarm(p, h.nearestGuest(p, s).id, s, "where-vent"));
    }
    // the snack bar: the close-up (party-snacks-play.js), and the pyramid's chain
    snackFrame(p, dt, h, alarm);
    const tp = tickTopple(p, dt);
    tp === "crash" && h.sound.one("crash");
    if (tp === "cup") {
      h.sound.one("crash");
      // the pyramid's flying cup knocks a piece off (a big moment, like the octopus's second hug and the vent), and
      // everyone stares
      knock(p, s, scale);
      p.stare = { t: SNACK_LOOK_SECONDS, at: { x: s.x, y: s.y } };
      h.sound.one("gasp");
    }
    sight(p, dt, s, stand);
  }
  // True from the pyramid starting to fall until everyone has stopped staring (party-snacks.js keeps the chain's
  // progress in p.snacks.chain, 0 to 1, and this file the stare).
  const crashing = (p) => !!p.stare || (!!p.snacks && p.snacks.chain >= 0 && p.snacks.chain < 1);
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
    // While the octopus is after him: no bar, snacks, dance or photo button (Brian 2026-11-25): just get away.
    if (chasing(p.oct)) return out;
    const s = h.sq();
    // The photo moment: the one thing offered is his place in the row (no DANCE, no snacks), from anywhere in the hall.
    if (photoActive(p)) {
      if (photoOpen(p)) {
        const [verb, cap] = partyLine("button-join").split(" · "),
          at = PHOTO_ROW.squatch,
          tall = 50 * E().hallSizes().squatch;
        out.push({ id: "photo", verb, cap, who: "sq", x: at.x, y: at.y, r: 900, thing: { x0: at.x - 24, x1: at.x + 24, y0: at.y - tall, y1: at.y }, f: () => join(h.P()) });
      }
      return out;
    }
    if (!furShows(p) && !(p.conga && p.conga.joined))
      out.push({ id: "dance", verb: partyLine("button-dance").split(" · ")[0], cap: partyLine("button-dance").split(" · ")[1], who: "sq", x: DANCE_SPOT.x, y: DANCE_SPOT.y, r: DANCE_SPOT.rx, thing: { x0: DANCE_SPOT.x - DANCE_SPOT.rx, x1: DANCE_SPOT.x + DANCE_SPOT.rx, y0: DANCE_SPOT.y - DANCE_SPOT.ry, y1: DANCE_SPOT.y + DANCE_SPOT.ry }, when: inSpot(s), f: () => openDance(h.P()) });
    // The snack bar: standing at it, the action button alone offers the snacks (no ring and no little picture over
    // the pyramid: Brian 2026-11-24). Not once the pyramid has fallen, and not once he has taken every snack.
    if (!p.snacks.toppled && snackRecord(p.snacks).left > 0) {
      const [verb, cap] = partyLine("button-grab").split(" · ");
      out.push({ id: "snacks", verb, cap, who: "sq", x: SNACK_SPOT.x, y: SNACK_SPOT.y, r: SNACK_SPOT.r, thing: PYRAMID_BOX, f: () => grab(h.P()) });
    }
    return out;
  }
  // GRAB · snacks: he steps up to the bar and the snack close-up opens.
  function grab(p) {
    const e = E();
    h.control(false);
    e.walkOff();
    e.queue([
      e.until((dt) => e.step("sq", SNACK_SPOT.x, SNACK_SPOT.y, 240, dt)),
      e.run(() => {
        const q = h.P();
        if (!q || q.scene !== "P6") return;
        // the photo moment began while he walked to the bar: no snacks now, he just has control again
        if (photoActive(q)) return void h.control(true);
        openSnacks(q);
        e.sfx("open");
      }),
    ]);
  }
  /** A finger in the snack close-up. True when the close-up took it. */
  function pointer(p, kind, x, y) {
    if (!p.snack) return false;
    return snackTouch(p, kind, x, y, h);
  }
  return { start, resume, tick, spots, pointer, alarm, closeDance, inSpot };
}
