/**
 * No standing spot in Chapter 1's rooms overlaps furniture or props (Brian 2026-11-25, showing-5 note 11: "Mops
 * stands on the bucket"). Every place someone is put or walked to and stands (the party at home and in the hall,
 * the talk, Mops sending the guard off, the morning, home alone, the bedtime story) is checked against the room's things:
 *   home  the crate bed, the painted bucket and the Guardian box (the locked home picture v6; the same boxes the
 *         room's solids use, src/game/00-core.js), with the room drawing people big: a person standing there takes
 *         up FOOT.home round their feet, up to their knees, so a body drawn over a low prop counts
 *   hall  the party hall's solids (party-hall.js HALL_SOLIDS: the stage, the snack bar, its stools, the plant pots),
 *         a person's feet as the party's solids count them (party.js solids)
 * Spots that are inside a thing on purpose (hiding in a plant, under the bed, the far end of the hall where the
 * alarm and the hallway doorway are, past the bar) are listed with their reason.
 *   node tests/standing-spots.mjs
 */
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

let fails = 0;
const check = (name, ok, info) => (console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok || info == null ? "" : "\n      " + JSON.stringify(info)}`), ok || fails++);
const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

// ---------- home ----------
// A person's feet as the solids count them (party.js solids: 25 either side, 14 behind, 8 in front); at home, where
// the room draws people three times bigger, up to the shins as well (30 behind), so someone drawn standing on a low
// prop (Mops on the bucket, 2026-11-25) counts.
const FOOT = Object.freeze({ home: { side: 25, up: 30, down: 8 }, hall: { side: 25, up: 14, down: 8 } });
// The floor each thing takes up (the same boxes as the home room's solids in src/game/00-core.js, "the locked
// picture: these boxes match the bucket, Guardian Box and bed drawn in it").
const HOME_FURNITURE = {
  bed: { x0: 83, x1: 286, y0: 409, y1: 526 },
  bucket: { x0: 536, x1: 596, y0: 500, y1: 571 },
  // Day 2 on: out of the closet, on the floor between the wardrobe and the bed's top corner (home-morning-art.js)
  "Guardian box": { x0: 188, x1: 236, y0: 366, y1: 394 },
};
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
};
// Squatch under his bed, and his flop onto it, are on the bed on purpose (not listed above).
const homeBad = [];
for (const [name, p] of Object.entries(homeSpots)) {
  const f = FOOT.home,
    box = { x0: p.x - f.side, x1: p.x + f.side, y0: p.y - f.up, y1: p.y + f.down };
  for (const [thing, b] of Object.entries(HOME_FURNITURE)) hit(box, b) && homeBad.push({ spot: name, at: [p.x, p.y], thing });
}
check(`home: none of ${Object.keys(homeSpots).length} standing spots overlaps the bed, the bucket or the Guardian box`, homeBad.length === 0, homeBad);
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
// ---------- draw order: ties always resolve the same way ----------
const { drawOrder } = await mod("party-draw.js");
const tie = [{ id: "a", y: 500 }, { id: "b", y: 500 }, { id: "c", y: 480 }, { id: "d", y: 500 }];
const orders = new Set();
for (let k = 0; k < 6; k++) orders.add(drawOrder(k % 2 ? tie.slice() : [...tie]).map((p) => p.id).join(""));
check("draw order: front last, and people on the same feet line always in the order they are listed", orders.size === 1 && [...orders][0] === "cabd", [...orders]);
console.log(fails ? `${fails} check(s) failed.` : "standing-spots checks passed");
process.exit(fails ? 1 : 0);
