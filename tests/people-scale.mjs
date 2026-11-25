/**
 * Adult heads are about 85% of the door of the room they stand in, and Squatch is about 80% of an adult.
 * The party hall is the one exception (Brian 2026-11-24: everyone in the hall 40% bigger): there an adult is about
 * 119% of the hall's doorway (0.85 x 1.4). Every other room, and a room with no door, is as before.
 *   node tests/people-scale.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

// The party's cast and where Squatch stands at the party (src/modules/party-hall.js), in game positions.
const hall = await import(join(root, "src", "modules", "party-hall.js"));

const src = ["12-ch1-redesign.js", "14-ch1-day1.js", "10-ch1.js", "50-story-frame.js"]
  .map((f) => readFileSync(new URL("../src/game/" + f, import.meta.url), "utf8"))
  .join("\n");

const g = await startGame({ port: 8831, name: "people-scale" });
const { ctx, page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });
await page.evaluate(() => window.__ss.lockedReady);

const measured = await page.evaluate(async () => {
  const ss = window.__ss;
  const img = new Image();
  img.src = "docs/locked-rooms/hall-room-empty-v2.png";
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const gx = c.getContext("2d");
  gx.drawImage(img, 0, 0);
  const x = 1240;
  const col = gx.getImageData(x, 0, 1, img.height).data;
  let best = 0;
  let run = 0;
  let runY = 0;
  let bestY = 0;
  for (let y = 300; y < 520; y++) {
    const i = y * 4;
    const light = col[i] > 210 && col[i + 1] > 210 && Math.abs(col[i] - col[i + 1]) < 20;
    if (light) {
      if (!run) runY = y;
      run++;
      if (run > best) ((best = run), (bestY = runY));
    } else run = 0;
  }
  const door = best * (640 / img.height);
  const office = new Image();
  office.src = "docs/locked-rooms/office-room-empty-v2.png";
  await office.decode();
  const ox = ss.CH1_OFFICE_DOOR;
  const threshold = 330 * (640 / office.height);
  const doorLeft = (640 - 65) * (960 / office.width);
  const doorRight = (640 + 65) * (960 / office.width);
  return {
    doorSrc: best,
    doorY: bestY,
    door,
    adult: ss.ADULT_PX,
    alien: ss.ALIEN_ADULT,
    qt: ss.QT_ADULT,
    sq: ss.SQ_ADULT,
    office: ox,
    threshold,
    doorLeft,
    doorRight,
    officeW: office.width,
    officeH: office.height,
  };
});

const headOfDoor = measured.adult / measured.door;
const sqOfGuest = (measured.sq * 45) / measured.adult;
g.check(
  "in the hall, guest heads are about 119% of the locked hall door (85% made 40% bigger, Brian 2026-11-24)",
  measured.doorSrc > 90 && measured.doorSrc < 120 && Math.abs(headOfDoor - 0.85 * 1.4) < 0.03,
  { ...measured, headOfDoor },
);
g.check(
  "Squatch is about 80% of a guest, inside 70-90%",
  sqOfGuest > 0.7 && sqOfGuest < 0.9 && Math.abs(sqOfGuest - 0.8) < 0.02,
  { sqOfGuest, sq: measured.sq, adult: measured.adult },
);
g.check(
  "Qt adults and alien guests share that room's head height",
  Math.abs(measured.alien * 84 - measured.adult) < 0.05 && Math.abs(measured.qt * 50 - measured.adult) < 0.05,
  measured,
);
// The party guests where they stand from the sneak to the dress-up (P2 to P5), and the places Squatch stands
// among them (his doorway and the middle plant).
const feet = hall.CAST.guests.map((q) => [q.x, q.y]);
const sqAt = [hall.SPOTS.doorway, hall.SPOTS.plantMiddle];
let closest = 999;
let closestSq = 999;
for (let i = 0; i < feet.length; i++) {
  for (const s of sqAt) closestSq = Math.min(closestSq, Math.hypot(feet[i][0] - s.x, feet[i][1] - s.y));
  for (let j = i + 1; j < feet.length; j++) closest = Math.min(closest, Math.hypot(feet[i][0] - feet[j][0], feet[i][1] - feet[j][1]));
}
const counter = 600 * (640 / 830);
const backHeads = feet.filter((p) => p[1] <= 480).every((p) => p[1] - measured.adult < counter - 20);
g.check("party guests do not overlap Squatch or each other, and back-row heads clear the snack counter", feet.length === 6 && closest > 70 && closestSq > 70 && backHeads, {
  closest,
  closestSq,
  counter,
  feet,
});
g.check(
  "Squatch's office entry is the back-wall door",
  measured.office &&
    measured.office.x > measured.doorLeft &&
    measured.office.x < measured.doorRight &&
    measured.office.y > measured.threshold &&
    measured.office.y < measured.threshold + 50,
  measured,
);
g.check(
  "listed rooms use the shared scale, not the old per-scene numbers",
  !src.includes("const CH1_GUEST = 1.8") &&
    !src.includes('"#8a93a3", 1.4') &&
    !src.includes('hat", 2.1') &&
    src.includes("adultPxFor") &&
    src.includes("QT_ADULT") &&
    src.includes("ALIEN_ADULT") &&
    src.includes("sqDrawScale()"),
);

const rooms = await page.evaluate(async () => {
  const ss = window.__ss;
  const doorPx = {
    hall: 101 * (640 / 830),
    office: 160 * (640 / 830),
    hallway: 160 * (640 / 830),
    delivery: 101 * (640 / 830),
    home: 129 * (640 / 830),
  };
  const img = new Image();
  img.src = "docs/locked-rooms/office-room-empty-v2.png";
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const col = c.getContext("2d");
  col.drawImage(img, 0, 0);
  const data = col.getImageData(600, 0, 1, img.height).data;
  let run = 0;
  let best = 0;
  for (let y = 150; y < 400; y++) {
    const i = y * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const slab = r < 190 && r > 90 && g < 190 && Math.abs(r - b) < 50;
    if (slab) {
      run++;
      if (run > best) best = run;
    } else run = 0;
  }
  const rows = {};
  for (const id of Object.keys(doorPx)) {
    const adult = ss.adultPxFor(id);
    rows[id] = { door: doorPx[id], adult, share: adult / doorPx[id] };
  }
  return {
    rows,
    officeSrc: best,
    officeCanvas: best * (640 / img.height),
    officeAdult: ss.adultPxFor("office"),
    officeAlien: ss.alienScale("office") * 84,
    officeQt: ss.qtScale("office") * 50,
    duct: ss.adultPxFor("duct"),
    hall: ss.adultPxFor("hall"),
  };
});
for (const [name, row] of Object.entries(rooms.rows)) {
  if (name === "hall") g.check("hall adult head is 116-122% of the hall's door (40% bigger)", row.share > 1.16 && row.share < 1.22, row);
  else g.check(name + " adult head is 82-88% of that room's door", row.share > 0.82 && row.share < 0.88, row);
}
g.check("the office picture's door is about the 160px slab", rooms.officeSrc > 140 && rooms.officeSrc < 175, rooms);
g.check(
  "office Isfred and Qt scales use the office door",
  Math.abs(rooms.officeAlien - rooms.officeAdult) < 0.05 && Math.abs(rooms.officeQt - rooms.officeAdult) < 0.05,
  rooms,
);
g.check("a room with no door still measures 85% of the hall's doorway (only the hall itself grew)", Math.abs(rooms.duct - rooms.rows.hall.door * 0.85) < 0.05 && rooms.hall > rooms.duct * 1.35, rooms);

// The FUR alarm at the party (P7, src/modules/party.js and party-alarm.js): he runs home through his doorway, and a
// guard follows him in half a second later (pinned: home-search-delay); a guard who reaches him in the hall shows
// the one LOCKUP card, naming who saw him and where.
const security = await page.evaluate(
  ([door]) => {
    const ss = window.__ss;
    const n = ss.op;
    const b = window.SSQ.beat("ch1-party");
    const tap = () => {
      if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "panel" || n.cur.k === "wait")) ss.opTap();
    };
    const arm = () => {
      n.q = [];
      n.cur = null;
      b.jump("P7");
      for (let i = 0; i < 40 && n.ch1PartyNow.alarm.guards.length < 2; i++) ss.tick(0.05);
    };
    arm();
    // At his doorway: he walks through it, home.
    n.sq.x = door.x;
    n.sq.y = door.y;
    let doorAt = -1;
    let guardAt = -1;
    let caught = false;
    for (let i = 0; i < 400; i++) {
      tap();
      ss.tick(0.05);
      if (n.cur && n.cur.id === "jail") caught = true;
      if (doorAt < 0 && n.room === "closet") doorAt = i;
      const a = n.ch1PartyNow && n.ch1PartyNow.alarm;
      if (doorAt >= 0 && a && a.homeGuard) {
        guardAt = i;
        break;
      }
    }
    const home = { doorAt, guardAt, delay: doorAt < 0 || guardAt < 0 ? -1 : (guardAt - doorAt) * 0.05, caught, room: n.room };
    // Standing in the hall in front of a guard: he walks over and catches him.
    arm();
    let cause = "";
    let sawGuard = false;
    for (let i = 0; i < 400 && !cause; i++) {
      tap();
      const a = n.ch1PartyNow && n.ch1PartyNow.alarm;
      const g = a && a.guards && a.guards[0];
      if (g && g.room === "hall") {
        sawGuard = true;
        n.sq.x = g.x - 24;
        n.sq.y = g.y + 16;
      }
      ss.tick(0.05);
      const card = (n.cur && n.cur.id === "jail" && n.cur) || n.q.find((q) => q.id === "jail");
      if (card) cause = card.cause || "";
    }
    return { home, cause, sawGuard };
  },
  [{ x: hall.SPOTS.doorway.x, y: hall.SPOTS.doorway.y + 4 }],
);

g.check(
  "getting home through his doorway, the guard comes in about half a second after him",
  security.home && !security.home.caught && security.home.room === "closet" && security.home.delay > 0.35 && security.home.delay < 1.2,
  security.home,
);
g.check(
  "a guard's catch uses the one LOCKUP card (who saw him and where)",
  security.cause === "A tourist saw Squatch on the dance floor. Security caught him." && security.sawGuard,
  { cause: security.cause, sawGuard: security.sawGuard },
);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("people-scale");
