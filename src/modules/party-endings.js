/**
 * P8, the endings: both roads meet at home (party plan P8; no catch; ↺ restarts the ending).
 *   P8a, after an alarm: Mops comes in through the door, out of breath, sees the flyer on the floor (covered in
 *        fur, glowing), then looks at Squatch. Squatch: "Everyone out there has someone." Mops: "You have me."
 *   P8b, never caught: the wall speaker: "The party's over. Good night, Stormtop!" The band packs up. Guests leave
 *        through the hallway doorway two by two, the same pairs he watched from the plant (the two who came alone
 *        leave together), then the bartender, Isfred and the band, until Squatch stands alone in the empty hall
 *        (DECISIONS "Closing-time ending"). Mops comes in from the hallway mopping with his beard, looks up, and
 *        his cone fills with floating hearts (R98, R104; PR #35's look, as big as everyone's). No words. The kid
 *        walks Squatch to Mops and they walk home together through Squatch's door. The same two lines.
 * Then beat 20 (the TV story) as today: the engine's tvStory hand-over.
 */
import { CAST, EXIT, EXIT_LANE_MOUTH, MOPS_IN, SPOTS, HOME_ROOM, stepTo, stepClear, CLEAR_OF_SQUATCH } from "./party-hall.js";
import { lookAt } from "./party-watch.js";

// PLACEHOLDERS for Brian: how fast people walk out, the gap between one pair leaving and the next, how slowly Mops
// mops his way in, and how close Squatch walks to him before they go home.
// `comeOver`: if he has not walked to Mops this long after the hearts, Mops walks over to him (the review of PR #87).
// `clearOf`: someone walking out goes round Squatch this far from him; `giveWay`: how long they wait if he stands on
// their way to the doorway before heading straight for the doorway round him. `besideHome`: how far from Squatch Mops
// stops at home in P8a (the home room draws them big, so further than in the hall).
export const ENDING = Object.freeze({ leave: 110, gap: 1.2, pack: 1.6, mop: 45, reach: 70, walk: 150, puff: 1.4, look: 1.2, heart: 0.8, comeOver: 3, clearOf: CLEAR_OF_SQUATCH, giveWay: 1.5, besideHome: 170 });
// Who leaves, in order: the pairs, the two who came alone, then the bartender, Isfred and the band.
export const LEAVING = Object.freeze([["teal", "stilt"], ["robot", "octopus-guest"], ["camera", "backpack"], ["bartender"], ["isfred"], ["band0", "band1", "band2"]]);
// The home room: where Mops comes in (inside the picture), and where he stops to see the flyer (party-hall.js).
const HOME = Object.freeze({ door: HOME_ROOM.mopsDoor, inside: HOME_ROOM.mopsInside, flyerLook: HOME_ROOM.mopsFlyerLook, clear: HOME_ROOM.clear });
const step = stepTo;

/** `h`: { E, P, sq, say, control, chip, sound, finish () (hands over to beat 20), homeRoom }. */
export function createEndings(h) {
  const E = () => h.E();

  // ---------- P8b in the hall ----------
  function startClosing(p) {
    const e = E();
    p.scene = "P8b";
    p.lights = true;
    p.band = true;
    p.closeT = 0;
    p.close = { phase: "speak", t: 0, gi: -1, gt: 0, gone: {} };
    p.bartenderAt = p.bartenderAt || { x: CAST.bartender.x, y: CAST.bartender.y };
    p.bandAt = p.bandAt || CAST.band.map((b) => ({ x: b.x, y: b.y }));
    p.mops = null;
    for (const k of ["dance", "snack", "curious", "stare", "warn"]) p[k] = null;
    // nobody is watching for him any more: no "?" left over from the party
    p.seenBy = "";
    p.seenT = 0;
    p.conga && (p.conga.joined = false);
    for (const g of Object.values(p.people)) g.task = "";
    p.pose === "hidden" && ((p.pose = "stand"), e.set("sqPose", "stand"));
    e.forgetSaved();
    h.chip("");
    h.control(false);
    h.sound.one("chime");
    p.speakerOn = true;
    e.queue([
      h.say("pa", "speaker-closing"),
      e.run(() => {
        const q = h.P();
        // the party is over: he can walk about while everyone leaves (nobody looks for him any more)
        q && q.close && ((q.speakerOn = false), (q.close.phase = "pack"), (q.close.t = 0), (q.band = false), h.sound.song(-1), h.control(true));
      }),
    ]);
  }
  // The person object for a leaver id (guests, the bartender, Isfred, a band member).
  function body(p, id) {
    if (p.people[id]) return p.people[id];
    if (id === "bartender") return p.bartenderAt;
    if (id === "isfred") return p.isfred;
    if (id.startsWith("band")) return p.bandAt[+id.slice(4)];
    return null;
  }
  // The way out for each one: down off the stage first if on it, then to the hallway doorway, then through it.
  function pathFor(p, id, j) {
    const b = body(p, id),
      out = [];
    id.startsWith("band") && out.push({ x: b.x, y: 300 });
    id === "bartender" && out.push({ x: b.x, y: 340 });
    id !== "bartender" && id !== "isfred" && out.push({ x: EXIT_LANE_MOUTH.x - j * 10, y: EXIT_LANE_MOUTH.y + j * 4 });
    out.push({ x: EXIT[0].x + j * 6, y: EXIT[0].y + (j % 2 ? 12 : -8) }, { x: EXIT[1].x, y: EXIT[1].y + j * 4 });
    return out;
  }
  function tickClosing(p, dt, s, free) {
    const c = p.close,
      e = E();
    c.t += dt;
    if (c.phase === "pack") {
      // the band packs up, the lights come up
      p.lightK = Math.max(0, 1 - c.t / ENDING.pack);
      if (c.t >= ENDING.pack) ((c.phase = "leave"), (c.t = 0), (p.lights = false));
      return;
    }
    if (c.phase === "leave") {
      c.gt += dt;
      // the next group sets off once the last one has reached the doorway (so they leave in order, two by two)
      const atDoor = c.gi < 0 || LEAVING[c.gi].every((id) => c.gone[id] || (body(p, id) && body(p, id).x >= EXIT[0].x - 4));
      if (c.gi < LEAVING.length - 1 && atDoor && (c.gi < 0 || c.gt >= ENDING.gap)) {
        c.gi += 1;
        c.gt = 0;
        LEAVING[c.gi].forEach((id, j) => {
          const b = body(p, id);
          b && ((b.path = pathFor(p, id, j)), (b.task = "leave"));
        });
      }
      let still = c.gi < LEAVING.length - 1;
      for (const grp of LEAVING)
        for (const id of grp) {
          const b = body(p, id);
          if (!b || !b.path || c.gone[id]) continue;
          still = true;
          const to = b.path[0];
          b.face = Math.atan2(to.y - b.y, to.x - b.x);
          b.walk = true;
          // a footfall about every 0.3 s for each one walking out
          (b.stepT = (b.stepT || 0) + dt) > 0.3 && ((b.stepT = 0), h.sound.one("step"));
          // nobody walks through Squatch: a leaver goes round him (or waits, if he stands on the way out)
          const bx = b.x,
            by = b.y,
            // go round whoever is nearer on the way: Squatch, or Isfred while he still stands by the bar's top end
            fred = id !== "isfred" && !c.gone.isfred && !p.isfred.path ? p.isfred : null,
            round = fred && Math.hypot(fred.x - b.x, fred.y - b.y) < Math.hypot(s.x - b.x, s.y - b.y) ? fred : s,
            // (round Isfred they pass behind him: the bar counter is on his other side)
            arrived = stepClear(b, to.x, to.y, ENDING.leave, dt, round, ENDING.clearOf, round === fred);
          // if he stands on the way out, they wait a moment, then head for the doorway itself round him (nobody
          // waits for ever, so the party always ends)
          b.blockT = b.x === bx && b.y === by && !arrived ? (b.blockT || 0) + dt : 0;
          (arrived || (b.blockT > ENDING.giveWay && b.path.length > 1)) && ((b.blockT = 0), b.path.shift());
          b.path.length || (c.gone[id] = true);
        }
      if (!still) ((c.phase = "empty"), (c.t = 0));
      return;
    }
    if (c.phase === "empty" && c.t >= 1) {
      // Mops comes in from the hallway, head down, mopping with his beard
      c.phase = "mops";
      c.t = 0;
      // he comes down the strip from the hallway doorway, round the counter's top end, then out onto the floor
      p.mops = { x: MOPS_IN.from.x, y: MOPS_IN.from.y, f: -1, walk: true, heart: 0, wet: [], path: [EXIT[0], { x: EXIT_LANE_MOUTH.x + 20, y: EXIT_LANE_MOUTH.y + 30 }] };
      h.sound.hum(1);
      return;
    }
    if (c.phase === "mops") {
      const m = p.mops;
      // he goes round Squatch, and stops early if Squatch has come to meet him
      const to = (m.path && m.path[0]) || MOPS_IN.at,
        reached = stepClear(m, to.x, to.y, ENDING.mop, dt, s, ENDING.reach - 10);
      reached && m.path && m.path.length && m.path.shift();
      m.f = to.x < m.x ? -1 : 1;
      const there = (reached && to === MOPS_IN.at) || Math.hypot(s.x - m.x, s.y - m.y) < ENDING.reach;
      c.t % 0.9 < dt && h.sound.one("swish");
      (m.wet.length === 0 || Math.hypot(m.wet[m.wet.length - 1].x - m.x, m.wet[m.wet.length - 1].y - m.y) > 14) && m.wet.push({ x: m.x - 10, y: m.y + 2 });
      if (there) ((c.phase = "look"), (c.t = 0), (m.walk = false), h.sound.hum(0), h.sound.one("twinkle"), h.control(true));
      return;
    }
    if (c.phase === "look") {
      const m = p.mops;
      m.heart = Math.min(1, c.t / ENDING.heart);
      // a moment later, if he has not come, Mops walks over to him (stopping a step away)
      c.t > ENDING.comeOver && Math.hypot(s.x - m.x, s.y - m.y) > ENDING.reach - 6 && ((m.walk = true), step(m, s.x + (m.x > s.x ? 1 : -1) * (ENDING.reach - 10), s.y, ENDING.mop * 1.6, dt));
      m.f = s.x < m.x ? -1 : 1;
      m.a = lookAt(m.x, m.y - 6, { x: s.x, y: s.y + 8 });
      if (free && Math.hypot(s.x - m.x, s.y - m.y) < ENDING.reach) walkHomeTogether(p);
    }
  }
  // They walk home together through Squatch's door (nobody teleports), then the two lines at home.
  function walkHomeTogether(p) {
    const e = E(),
      m = p.mops,
      door = SPOTS.doorway;
    h.control(false);
    p.close.phase = "home";
    m.walk = true;
    h.sound.one("hooves");
    e.walkOff();
    e.queue([
      e.until((dt) => {
        const q = h.P();
        if (!q || !q.mops) return true;
        const a = e.step("sq", door.x - 14, door.y, ENDING.walk, dt),
          b = step(q.mops, door.x + 26, door.y - 6, ENDING.walk, dt);
        q.mops.f = q.mops.x > door.x ? -1 : 1;
        return a && b;
      }),
      e.until((dt) => {
        const q = h.P();
        if (!q || !q.mops) return true;
        const a = e.step("sq", door.x - 14, 636, ENDING.walk, dt),
          b = step(q.mops, door.x + 26, 640, ENDING.walk, dt);
        return a && b;
      }),
      e.run(() => {
        const q = h.P();
        q.mops = null;
        h.sound.one("door");
        e.enterRoom("closet", "Q1");
        e.place("sq", HOME_ROOM.doorIn.x, HOME_ROOM.doorIn.y);
        e.face("sq", -1);
        e.set("moPose", "stand");
        e.place("mops", 960, 476);
        e.face("mops", -1);
      }),
      e.until((dt) => e.step("sq", HOME.inside.x - ENDING.besideHome, h.homeRoom.inside.y + 20, ENDING.walk, dt)),
      e.until((dt) => e.step("mops", HOME.inside.x, HOME.inside.y, ENDING.walk, dt)),
      e.run(() => (e.still("mops"), e.face("mops", -1), e.face("sq", 1))),
      ...lines(),
    ]);
  }
  function lines() {
    const e = E();
    return [h.say("sq", "sq-someone"), h.say("mops", "mops-have-me"), e.run(() => h.finish())];
  }

  // ---------- P8a at home ----------
  function startAfterAlarm(p) {
    const e = E();
    p.scene = "P8a";
    p.flyer = "floor";
    p.glow = 0;
    p.puff = 0;
    e.forgetSaved();
    h.chip("");
    h.control(false);
    e.room() !== "closet" && e.enterRoom("closet", "Q1");
    e.set("scene", "Q1");
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    e.place("mops", HOME.door.x, HOME.door.y);
    e.face("mops", -1);
    e.queue([
      // he steps into the room, clear of the door, so Mops has room to come in
      e.until((dt) => h.sq().x <= HOME.clear.x || e.step("sq", HOME.clear.x, HOME.clear.y, ENDING.walk, dt)),
      e.run(() => (e.still("sq"), e.face("sq", 1), h.sound.one("door"))),
      e.until((dt) => e.step("mops", HOME.flyerLook.x, HOME.flyerLook.y, ENDING.walk, dt)),
      e.run(() => {
        const q = h.P();
        e.still("mops");
        q.puff = ENDING.puff;
        q.pt = 0;
        h.sound.one("huff");
      }),
      e.until(() => !h.P() || h.P().pt >= ENDING.puff),
      // he sees the flyer on the floor, covered in fur and glowing; then he looks at Squatch
      e.run(() => {
        const q = h.P();
        q.glow = 1;
        q.pt = 0;
        h.sound.one("sparkle");
        e.face("mops", 1);
      }),
      e.until(() => !h.P() || h.P().pt >= ENDING.look),
      e.run(() => {
        const q = h.P();
        q.glow = 0;
        e.face("mops", h.sq().x < e.pos("mops").x ? -1 : 1);
      }),
      e.until((dt) => {
        const sx = h.sq().x,
          side = sx < e.pos("mops").x ? 1 : -1;
        return e.step("mops", sx + side * ENDING.besideHome, h.sq().y, ENDING.walk * 0.7, dt);
      }),
      e.run(() => (e.still("mops"), e.face("sq", e.pos("mops").x > h.sq().x ? 1 : -1))),
      ...lines(),
    ]);
  }
  function tick(p, dt, s, free) {
    p.puff = Math.max(0, (p.puff || 0) - dt);
    if (p.scene === "P8b" && p.close) tickClosing(p, dt, s, free);
  }
  return { startClosing, startAfterAlarm, tick };
}
