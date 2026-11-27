/**
 * No standing spot in Chapter 1's rooms overlaps furniture or props (Brian 2026-11-25, showing-5 note 11: "Mops
 * stands on the bucket"). Every place someone is put or walked to and stands (the party at home and in the hall,
 * the talk, Mops sending the guard off, the morning, home alone, the bedtime story, and Mops lying asleep there) is
 * checked against the room's things:
 *   home  the crate bed, the painted bucket and the Guardian box (the locked home picture v6; the same boxes the
 *         room's solids use, src/game/00-core.js), with the room drawing people big: a person standing there takes
 *         up FOOT.home round their feet, up to their knees, so a body drawn over a low prop counts
 *   hall  the party hall's solids (party-hall.js HALL_SOLIDS: the stage, the snack bar, its stools, the plant pots),
 *         a person's feet as the party's solids count them (party.js solids)
 * Spots that are inside a thing on purpose (hiding in a plant, under the bed, the far end of the hall where the
 * alarm and the hallway doorway are, past the bar) are listed with their reason.
 *   node tests/standing-spots.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mod = (f) => import(pathToFileURL(join(root, "src", "modules", f)).href);
const { HOME_ROOM, HALL_SOLIDS, SPOTS, CAST, MILL, SNACK_SPOT, OCTOPUS_SNACKS, DANCE_SPOT } = await mod("party-hall.js");
const { TALK_SPOTS, TALK, TV } = await mod("party-talk.js");
const { AFTER_SPOTS } = await mod("party-after-alarm.js");
const { MORNING_PLACES } = await mod("morning.js");
const { HOME_SPOTS } = await mod("home-alone.js");
const { PHOTO_ROW } = await mod("party-photo.js");
const { BEDTIME_SPOTS } = await mod("bedtime-story.js");
const { HOME_MORNING_SPOTS } = await mod("home-morning.js");
const EVP = await mod("evening-place.js");
const { LUNCH_SOLIDS } = await mod("lunch-sneak-place.js");

let fails = 0;
const check = (name, ok, info) => (console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok || info == null ? "" : "\n      " + JSON.stringify(info)}`), ok || fails++);
const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

// ---------- home ----------
// A person's feet as the solids count them (party.js solids: 25 either side, 14 behind, 8 in front); at home, where
// the room draws people three times bigger, up to the shins as well (30 behind), so someone drawn standing on a low
// prop (Mops on the bucket, 2026-11-25) counts. The floor each home thing takes up: the same boxes as the home room's
// solids in src/game/00-core.js ("the locked picture: these boxes match the bucket, Guardian Box and bed drawn in it");
// the Guardian box is where it stands out of the closet on Day 2 (home-morning-art.js). Both in
// tests/data/home-furniture.json (tests/scripted-walks.mjs uses them too).
const FURN = JSON.parse(readFileSync(join(root, "tests", "data", "home-furniture.json"), "utf8"));
const FOOT = FURN.foot;
const HOME_FURNITURE = FURN.home;
const S = TALK_SPOTS.sq;
const homeSpots = {
  ...Object.fromEntries(Object.entries(HOME_ROOM).filter(([k]) => !["bed", "flyer"].includes(k)).map(([k, v]) => ["party " + k, v])),
  "talk: Squatch": S,
  "talk: Squatch takes the flyer": TALK_SPOTS.take,
  "talk: Mops beside him": { x: S.x + TALK.beside, y: S.y + 6 },
  "talk: Mops close (the hat)": { x: S.x + TALK.close, y: S.y + 6 },
  "talk: Mops at the TV": TV.stand,
  ...Object.fromEntries(Object.entries(AFTER_SPOTS).map(([k, v]) => ["after the alarm: " + k, v])),
  ...Object.fromEntries(["outOfBed", "mops", "mopFrom", "wring", "door"].map((k) => ["morning " + k, MORNING_PLACES[k]])),
  "morning: Squatch steps back (talk floor, left of Mops)": { x: MORNING_PLACES.mops.x - MORNING_PLACES.talkGap, y: MORNING_PLACES.talkFloor },
  ...Object.fromEntries(Object.entries(HOME_SPOTS).map(([k, v]) => ["home alone " + k, v])),
  // the bedtime story (beat 21): Squatch in bed is on the bed on purpose (not listed)
  ...Object.fromEntries(Object.entries(BEDTIME_SPOTS).filter(([k]) => k !== "inBed").map(([k, v]) => ["bedtime " + k, v])),
  // the home morning (beats 22 to 24): getting out of bed starts on the bed on purpose (not listed)
  ...Object.fromEntries(Object.entries(HOME_MORNING_SPOTS).filter(([k]) => k !== "bed").map(([k, v]) => ["home morning " + k, v])),
  // the evening (beats 40 to 42, evening.js): where he stops, where Mops stands, beside the bed at night; Mops's way to
  // his sleeping place (he lies there: its floor is checked below)
  ...Object.fromEntries(["stop", "mops", "up", "sleepVia"].map((k) => ["evening " + k, EVP.HOME[k]])),
};
// Squatch under his bed, and his flop onto it, are on the bed on purpose (not listed above).
const homeBad = [];
for (const [name, p] of Object.entries(homeSpots)) {
  const f = FOOT.home,
    box = { x0: p.x - f.side, x1: p.x + f.side, y0: p.y - f.up, y1: p.y + f.down };
  for (const [thing, b] of Object.entries(HOME_FURNITURE)) hit(box, b) && homeBad.push({ spot: name, at: [p.x, p.y], thing });
}
check(`home: none of ${Object.keys(homeSpots).length} standing spots overlaps the bed, the bucket or the Guardian box`, homeBad.length === 0, homeBad);
// Mops asleep on the floor at bedtime (Brian 2026-11-26, #33: tipped over, then on his back, feet in the air), "near the
// crate bed (not overlapping it)": his whole drawn body, on his side and on his back, at a Mops size of 3.45 game px a unit
// (no smaller than the room draws him: tests/bedtime-story.mjs checks the size he is drawn asleep at), and the floor under it (FOOT.home.up above the floor line), clear
// of the bed, the bucket and the Guardian box.
{
  const { mopsTurnedBox, MOPS_ASLEEP } = await mod("mops-asleep-art.js");
  const bad = [];
  for (const turn of [0, 0.25, 0.5, 0.75, 1]) {
    const { box } = mopsTurnedBox(MOPS_ASLEEP.x, MOPS_ASLEEP.floor, 3.45, MOPS_ASLEEP.f, turn, MOPS_ASLEEP.headDrop);
    const floor = { x0: box.x0, x1: box.x1, y0: MOPS_ASLEEP.floor - FOOT.home.up, y1: MOPS_ASLEEP.floor + FOOT.home.down };
    for (const [thing, f] of Object.entries(HOME_FURNITURE)) hit(floor, f) && bad.push({ turn, thing, box });
    box.x0 < HOME_FURNITURE.bed.x1 && bad.push({ turn, thing: "bed (drawn over it)", box });
  }
  check("home: Mops falling asleep and asleep on his back beside the bed overlaps no bed, bucket or Guardian box", bad.length === 0, bad);
}
// the two places Mops stood on the bucket in showing 5 would fail this check (they are kept here as its proof)
const onBucket = (p) => hit({ x0: p.x - FOOT.home.side, x1: p.x + FOOT.home.side, y0: p.y - FOOT.home.up, y1: p.y + FOOT.home.down }, HOME_FURNITURE.bucket);
check("the check catches showing 5's Mops on the bucket (sending the guard off at 600, 578; the talk at 570, 596)", onBucket({ x: 600, y: 578 }) && onBucket({ x: 570, y: 596 }));

// ---------- the party hall ----------
const hallSpots = {
  doorway: SPOTS.doorway,
  ...Object.fromEntries(CAST.guests.map((g) => ["guest " + g.id, g])),
  "isfred at the bar": CAST.isfredBar,
  ...Object.fromEntries(MILL.map((m) => ["mill " + m.id, m])),
  "snack spot": SNACK_SPOT,
  "octopus at the snacks": OCTOPUS_SNACKS,
  "dance spot": DANCE_SPOT,
  ...Object.fromEntries([...PHOTO_ROW.back, ...PHOTO_ROW.front].map((r) => ["photo row " + r.id, r])),
  "photo: Squatch's gap": PHOTO_ROW.squatch,
  "photo: the camera": PHOTO_ROW.camera,
};
// On purpose: hiding in a plant (SPOTS.plantMiddle, plantBack); the peek below the picture; Isfred and the band on
// the stage (CAST.isfred, CAST.band, PHOTO_ROW.stageEnd: the stage is solid for walkers); the bartender behind his
// counter (CAST.bartender); the alarm and the guards' way in at the hallway doorway past the bar (SPOTS.alarmRun,
// guardIn).
const hallBad = [];
for (const [name, p] of Object.entries(hallSpots)) {
  if (!p) continue;
  const f = FOOT.hall,
    box = { x0: p.x - f.side, x1: p.x + f.side, y0: p.y - f.up, y1: p.y + f.down };
  HALL_SOLIDS.forEach((b, i) => hit(box, b) && hallBad.push({ spot: name, at: [p.x, p.y], solid: i }));
}
check(`hall: none of ${Object.keys(hallSpots).length} standing spots overlaps the stage, the bar, the stools or the plant pots`, hallBad.length === 0, hallBad);
// ---------- the guards' walks in the hall (Brian 2026-11-26, showing 6: "Security looks like they're on top of plant") ----------
// Each guard walks in from the hallway doorway, round his search points (party-alarm.js SEARCH) more than once, to the
// places Squatch hides (where he was last seen) and back out; at every step of 1/60 s his feet box (as the party's
// solids count it) touches no stage, stool or plant pot. The bar's strip is where the guards come in, so it is left out.
{
  const { SEARCH, guardStep, ALARM, PLANT_LEAVES, catchReach } = await mod("party-alarm.js");
  // (a plant counts as its pot and, behind it, its leaves: PLANT_LEAVES taller on the floor)
  const furniture = HALL_SOLIDS.map((b, i) => ({ ...b, i, y0: b.y0 - (b.plant ? PLANT_LEAVES : 0) })).filter((b) => !b.bar);
  const f = FOOT.hall,
    bad = [];
  let steps = 0;
  for (const start of [0, 3]) {
    const g = { x: SPOTS.guardIn.x, y: SPOTS.guardIn.y },
      route = [...Array.from({ length: SEARCH.length * 2 }, (_, k) => SEARCH[(start + k) % SEARCH.length]), SPOTS.plantMiddle, SPOTS.plantBack, SEARCH[2], { x: SPOTS.guardIn.x + 40, y: SPOTS.guardIn.y }];
    for (const to of route)
      for (let i = 0; i < 60 * 20 && !guardStep(g, to.x, to.y, ALARM.guard, 1 / 60); i++) {
        steps++;
        const box = { x0: g.x - f.side, x1: g.x + f.side, y0: g.y - f.up, y1: g.y + f.down };
        for (const b of furniture) hit(box, b) && bad.length < 8 && bad.push({ from: start, to, at: [Math.round(g.x), Math.round(g.y)], solid: b.i });
      }
  }
  check(`hall: the guards' search walks (${steps} steps) never put a guard's feet on the stage, a stool, a plant pot or the leaves behind it`, bad.length === 0 && steps > 1000, bad);
  // A guard after Squatch as he runs round the middle plant, past the edge of its leaves (the place moves every step):
  // the guard goes round the pot, never on it.
  const chaser = { x: SPOTS.guardIn.x, y: SPOTS.guardIn.y },
    pot = HALL_SOLIDS.find((b) => b.plant && b.x0 > 300),
    cx = (pot.x0 + pot.x1) / 2,
    cy = (pot.y0 + pot.y1) / 2,
    chaseBad = [];
  let near = 1e9;
  for (let i = 0; i < 60 * 30; i++) {
    const t = i / 60,
      him = { x: cx + Math.cos(t * 1.2) * 100, y: cy + Math.sin(t * 1.2) * 85 };
    guardStep(chaser, him.x, him.y, ALARM.guard, 1 / 60);
    t > 8 && (near = Math.min(near, Math.hypot(him.x - chaser.x, him.y - chaser.y) - catchReach(him)));
    const box = { x0: chaser.x - f.side, x1: chaser.x + f.side, y0: chaser.y - f.up, y1: chaser.y + f.down };
    for (const b of furniture) hit(box, b) && chaseBad.length < 8 && chaseBad.push({ t: +t.toFixed(2), at: [Math.round(chaser.x), Math.round(chaser.y)], solid: b.i });
  }
  check("hall: a guard chasing him round the middle plant goes round the pot, never over it, and gets to him (within the catch reach)", chaseBad.length === 0 && near < 0, { chaseBad, near: Math.round(near) });
  // And him standing right behind a pot, as close as his own feet may go (8 above its back edge), in the leaves where
  // guards do not walk: a guard still catches him there, from the far side of the leaves (the one capture rule;
  // party-alarm.js catchReach adds the leaves to the pinned reach there, and only there).
  const reachOf = (b) => {
    const at = { x: (b.x0 + b.x1) / 2, y: b.y0 - 8 },
      gd = { x: SPOTS.guardIn.x, y: SPOTS.guardIn.y };
    let best = 1e9;
    for (let i = 0; i < 60 * 30; i++) (guardStep(gd, at.x, at.y, ALARM.guard, 1 / 60), (best = Math.min(best, Math.hypot(at.x - gd.x, at.y - gd.y))));
    return { d: Math.round(best), reach: Math.round(catchReach(at)) };
  };
  const pots = HALL_SOLIDS.filter((b) => b.plant).map(reachOf);
  check("hall: with him right behind a plant pot, a guard gets within the catch reach of him (both plants); in the open the reach is the pinned one", pots.every((p) => p.d < p.reach) && catchReach({ x: 600, y: 560 }) === ALARM.reach, pots);
}
// ---------- the loading bay (beats 28 to 36, src/modules/loading-bay.js) ----------
{
  const { BAY, BAY_SPOTS } = await mod("loading-bay-place.js");
  // the bay's furniture: the older program's solids for it, read from src/game/00-core.js (CH1_FURNITURE.hangar)
  const core = readFileSync(join(root, "src", "game", "00-core.js"), "utf8"),
    block = core.slice(core.indexOf("hangar: [", core.indexOf("CH1_FURNITURE")), core.indexOf("],", core.indexOf("hangar: [", core.indexOf("CH1_FURNITURE"))));
  const BAY_FURNITURE = Object.fromEntries([...block.matchAll(/\{ x0: (\d+), x1: (\d+), y0: (\d+), y1: (\d+)[^}]*\}, \/\/ ([^\n(]+)/g)].map((m) => [m[5].trim(), { x0: +m[1], x1: +m[2], y0: +m[3], y1: +m[4] }]));
  check("loading bay: its seven pieces of furniture are read from the older program's solids", Object.keys(BAY_FURNITURE).length === 7, Object.keys(BAY_FURNITURE));
  const F = FOOT.hall,
    feet = (p) => ({ x0: p.x - F.side, x1: p.x + F.side, y0: p.y - F.up, y1: p.y + F.down }),
    onThing = (p, people = {}) =>
      [...Object.entries(BAY_FURNITURE), ...Object.entries(people).map(([k, q]) => [k, feet(q)])].filter(([, b]) => hit(feet(p), b)).map(([k]) => k);
  const spots = { ...Object.fromEntries(Object.entries(BAY_SPOTS).filter(([, v]) => v && v.x != null)), "door step": BAY.door.step };
  BAY_SPOTS.workers.forEach((w) => (spots["worker " + w.name] = w));
  BAY_SPOTS.robots.forEach((r, i) => (spots["robot " + (i + 1)] = r));
  // (the spots used once the ship has gone: the scanner's posts are solid only with a ship docked, 00-core.js)
  const AFTER_SHIP = new Set(["talk", "spit", "boxPick", "sqOut"]);
  const bad = Object.entries(spots).map(([k, p]) => [k, onThing(p).filter((t) => !(AFTER_SHIP.has(k) && t.startsWith("scanner")))]).filter(([, t]) => t.length);
  check(`loading bay: none of ${Object.keys(spots).length} standing spots overlaps the plant, the bin, the scanner, the mail room's wall or the mailbox`, bad.length === 0, bad);
  // every walk in the bay, step by step, with the people standing there at that moment as obstacles too
  const R = BAY_SPOTS.robots,
    W = BAY_SPOTS.workers,
    inPast = (to) => [BAY.door, BAY.door.step, ...BAY_SPOTS.behindMops, to],
    mops = { "Mops (waiting)": BAY_SPOTS.mopsWatch },
    robots = Object.fromEntries(R.map((r, i) => ["robot " + (i + 1), r]));
  const isf = { Isfred: BAY_SPOTS.isfred },
    workers = Object.fromEntries(W.map((q) => [q.name, q])),
    rampUp = (w) => [w, { x: BAY.rampFoot.x, y: w.y }, BAY.rampFoot, BAY.shipDoor];
  const ways = [
    ["Mops in through the doorway", [BAY.door, BAY.door.step, BAY_SPOTS.mopsIn], {}],
    ["Squatch in through the doorway", [BAY.door, BAY.door.step, BAY_SPOTS.sqIn], {}],
    ...R.map((r, i) => [`robot ${i + 1} down the ramp to its place`, [BAY.rampFoot, r], { ...mops, ...Object.fromEntries(R.map((q, j) => ["robot " + (j + 1), q]).slice(i + 1)) }]),
    ["Isfred in past Mops", inPast(BAY_SPOTS.isfred), { ...mops, ...robots }],
    ["robot 3 to the robot mailbox and back", [R[2], BAY.mailDoor, BAY.mailbox.post, BAY.mailDoor, R[2]], { ...mops, ...isf, "robot 1": R[0], "robot 2": R[1] }],
    ...W.map((w, i) => [`${w.name} in past Mops`, [BAY.door, BAY.door.step, BAY_SPOTS.behindMops[0], ...BAY_SPOTS.workerWay, { x: w.x, y: BAY_SPOTS.workerWay[1].y }, w], { ...mops, ...isf, ...robots, ...Object.fromEntries(W.slice(0, i).map((q) => [q.name, q])) }]),
    ...R.map((r, i) => [`robot ${i + 1} down to take ${W[i].name}'s tool and back`, [r, { x: r.x, y: r.y + 22 }, r], { ...mops, ...isf, ...workers }]),
    ...W.map((w, i) => [`${w.name} up the ramp`, rampUp(w), { ...mops, ...isf, ...robots, ...Object.fromEntries(W.slice(i + 1).map((q) => [q.name, q])) }]),
    ["robot 1 to the office with the form", [BAY_SPOTS.robotSign, ...BAY_SPOTS.officeWay, BAY.door.step, BAY.door], { ...mops, ...isf, "robot 2": R[1], "robot 3": R[2] }],
    ["robot 1 back to Mops with the copies", inPast(BAY_SPOTS.robotToMops), { ...mops, "robot 2": R[1], "robot 3": R[2] }],
    ["robot 1 out", [BAY_SPOTS.robotToMops, BAY_SPOTS.behindMops[1], BAY_SPOTS.behindMops[0], BAY.door.step, BAY.door], { ...mops, "robot 2": R[1], "robot 3": R[2] }],
    ...[1, 2].map((i) => [`robot ${i + 1} out to the hallway`, [R[i], { x: R[i].x, y: BAY_SPOTS.robotsOut[0].y }, ...BAY_SPOTS.robotsOut, BAY.door.step, BAY.door], mops]),
    ["Squatch and Mops out through the doorway", [BAY_SPOTS.sqOut, BAY.door.step, BAY.door], {}],
  ];
  const walkBad = [];
  for (const [name, way, people] of ways)
    for (let i = 1; i < way.length; i++) {
      const a = way[i - 1],
        b = way[i],
        k = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 4);
      for (let j = 0; j <= k; j++) {
        const p = { x: a.x + ((b.x - a.x) * j) / k, y: a.y + ((b.y - a.y) * j) / k },
          // (where a walk starts or ends beside someone, being next to them is the point: only the way between counts)
          t = onThing(p, i === 1 && j === 0 ? {} : people);
        t.length && walkBad.push(`${name} at ${Math.round(p.x)},${Math.round(p.y)}: ${t}`);
      }
    }
  check(`loading bay: all ${ways.length} walks go round the furniture and the people standing there, checked every 4 pixels`, walkBad.length === 0, [...new Set(walkBad)].slice(0, 8));
}
// ---------- draw order: ties always resolve the same way ----------
const { drawOrder } = await mod("party-draw.js");
const tie = [{ id: "a", y: 500 }, { id: "b", y: 500 }, { id: "c", y: 480 }, { id: "d", y: 500 }];
const orders = new Set();
for (let k = 0; k < 6; k++) orders.add(drawOrder(k % 2 ? tie.slice() : [...tie]).map((p) => p.id).join(""));
check("draw order: front last, and people on the same feet line always in the order they are listed", orders.size === 1 && [...orders][0] === "cabd", [...orders]);
// ---------- the evening (evening.js) ----------
// Mops asleep on his back at home: the floor he lies on (mopsSleepBox, a solid while he sleeps) is clear of the bed and
// of where Squatch gets out of bed; his head rests against the bucket (the box ends at its left side).
{
  // (his scale at home is the room's, 3: Mops's head at the bucket, measured in tests/evening-physics.mjs)
  const H = EVP.HOME,
    lie = EVP.mopsSleepBox(3),
    up = { x0: H.up.x - FOOT.home.side, x1: H.up.x + FOOT.home.side, y0: H.up.y - FOOT.home.up, y1: H.up.y + FOOT.home.down };
  check("evening: Mops lies on open floor (not on the bed or the bucket, not where Squatch gets out of bed)", !hit(lie, HOME_FURNITURE.bed) && !hit(lie, HOME_FURNITURE.bucket) && !hit(lie, up) && lie.x1 === HOME_FURNITURE.bucket.x0, { lie, up });
}
// The snack bar (beat 38): Squatch in the strip, Mops, the two in line, the family at the counter's front. On purpose:
// Squatch hidden in the aisle behind the counter (BAR.hidden), the family reading in the hallway doorway past the bar.
{
  const B = EVP.BAR,
    spots = { "evening Squatch at the counter's top": B.sq, "evening Mops": B.mops, "evening family's way round": B.via, ...Object.fromEntries(B.line.map((p) => ["evening in line " + p.id, p])), ...Object.fromEntries(B.family.map((p) => ["evening family " + p.id, p.at])) },
    bad = [];
  for (const [name, p] of Object.entries(spots)) {
    const f = FOOT.hall,
      box = { x0: p.x - f.side, x1: p.x + f.side, y0: p.y - f.up, y1: p.y + f.down };
    // (Day 2's hall: the lunch's furniture, with the strip to the hallway doorway open and the crates it left,
    // lunch-sneak-place.js LUNCH_SOLIDS, the list evening.js walks on)
    LUNCH_SOLIDS.forEach((b, i) => hit(box, b) && bad.push({ spot: name, at: [p.x, p.y], solid: i }));
  }
  check(`evening: none of ${Object.keys(spots).length} standing spots at the snack bar overlaps the hall's furniture or the crates`, bad.length === 0, bad);
}
// The loading bay at night (beat 42): the robots' places and Squatch's stops are clear of its furniture.
{
  const Y = EVP.BAY,
    spots = { "bay robot": Y.robot, ...Object.fromEntries(Y.parked.map((p) => ["bay parked " + p.id, p])), ...Object.fromEntries(Y.woke.map((p, i) => ["bay woken robot " + i, p])), "bay stop": Y.stop, "bay bin": Y.bin, "bay mailbox": Y.mail, "bay under the vent": Y.underVent, ...Object.fromEntries(Y.run.map((p, i) => ["bay run " + i, p])) },
    bad = [];
  for (const [name, p] of Object.entries(spots)) {
    const box = { x0: p.x - 22, x1: p.x + 22, y0: p.y - 14, y1: p.y + 8 };
    EVP.BAY_FURNITURE.forEach((b, i) => hit(box, b) && bad.push({ spot: name, at: [p.x, p.y], solid: i }));
  }
  check(`evening: none of ${Object.keys(spots).length} standing spots in the loading bay overlaps its furniture`, bad.length === 0, bad);
}
console.log(fails ? `${fails} check(s) failed.` : "standing-spots checks passed");
process.exit(fails ? 1 : 0);
