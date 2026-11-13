/**
 * Adult heads are about 85% of the locked party-hall door, and Squatch is about 80% of an adult.
 * The current guest scale (1.8) is far too tall for that door, so this fails on those numbers.
 *   node tests/people-scale.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const src = ["12-ch1-redesign.js", "14-ch1-day1.js", "10-ch1.js", "50-story-frame.js"]
  .map((f) => readFileSync(new URL("../src/game/" + f, import.meta.url), "utf8"))
  .join("\n");

const g = await startGame({ port: 8831, name: "people-scale" });
const { ctx, page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });
await page.evaluate(() => window.__ss.lockedReady);

const measured = await page.evaluate(async () => {
  const ss = window.__ss;
  const img = new Image();
  img.src = "docs/locked-rooms/hall-room-empty-v1.png";
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
    guests: ss.CH1_GUESTS,
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
  "guest heads are about 85% of the locked hall door",
  measured.doorSrc > 90 && measured.doorSrc < 120 && headOfDoor > 0.82 && headOfDoor < 0.88,
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
const feet = measured.guests || [];
let closest = 999;
let closestSq = 999;
for (let i = 0; i < feet.length; i++) {
  closestSq = Math.min(closestSq, Math.hypot(feet[i][0] - 400, feet[i][1] - 530));
  for (let j = i + 1; j < feet.length; j++) closest = Math.min(closest, Math.hypot(feet[i][0] - feet[j][0], feet[i][1] - feet[j][1]));
}
const counter = 600 * (640 / 830);
const backHeads = feet.filter((p) => p[1] <= 480).every((p) => p[1] - measured.adult < counter - 20);
g.check("party guests do not overlap Squatch or each other, and back-row heads clear the snack counter", closest > 70 && closestSq > 70 && backHeads, {
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
  g.check(name + " adult head is 82-88% of that room's door", row.share > 0.82 && row.share < 0.88, row);
}
g.check("the office picture's door is about the 160px slab", rooms.officeSrc > 140 && rooms.officeSrc < 175, rooms);
g.check(
  "office Isfred and Qt scales use the office door",
  Math.abs(rooms.officeAlien - rooms.officeAdult) < 0.05 && Math.abs(rooms.officeQt - rooms.officeAdult) < 0.05,
  rooms,
);
g.check("a room with no door keeps the hall adult height", Math.abs(rooms.duct - rooms.hall) < 0.05, rooms);

const security = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const tap = () => {
    if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "panel")) ss.opTap();
  };
  const arm = (x, y) => {
    n.scene = "QA";
    n.room = "hall";
    n.ch1Party = true;
    n.ch1D = false;
    n.ch1Office = false;
    n.ch1Disguise = true;
    n.ch1Flyer = true;
    n.ch1PartyOver = false;
    n.ch1PartyDid = {};
    n.ch1Raid = null;
    n.ch1Search = false;
    n.guard = null;
    n.ctrl = true;
    n.q = [];
    n.cur = null;
    n.log = [];
    n.walkTo = null;
    n.sqPose = "stand";
    n.sq.x = x;
    n.sq.y = y;
    ss.hall.camX = 0;
  };
  arm(400, 540);
  const snag = ss.spotsNow().find((s) => s && s.verb === "SNAG");
  if (!snag) return { error: "no snag" };
  snag.f();
  let armed = -1;
  let opened = -1;
  let entered = -1;
  let caught = false;
  for (let i = 0; i < 500; i++) {
    tap();
    const r = n.ch1Raid;
    const lead = r && r.guards && r.guards[0];
    const near =
      lead &&
      Math.hypot(lead.x - ss.CH1_HOME_DOOR.x, lead.y - ss.CH1_HOME_DOOR.y) < 28 &&
      Math.hypot(n.sq.x - ss.CH1_HOME_DOOR.x, n.sq.y - ss.CH1_HOME_DOOR.y) < 48;
    if (near && armed < 0) armed = i;
    ss.tick(0.05);
    if (n.cur && n.cur.id === "jail") caught = true;
    if (armed >= 0 && !n.ch1Raid && opened < 0) opened = i;
    if (n.room === "closet" && n.ch1Search) {
      entered = i;
      break;
    }
  }
  const home = {
    armed,
    opened,
    entered,
    delay: armed < 0 || opened < 0 ? -1 : (opened - armed) * 0.05,
    caught,
    room: n.room,
    search: !!n.ch1Search,
  };
  arm(400, 540);
  ss.spotsNow().find((s) => s && s.verb === "SNAG").f();
  let cause = "";
  let sawGuard = false;
  for (let i = 0; i < 400 && !cause; i++) {
    tap();
    const r = n.ch1Raid;
    const g = r && r.guards && r.guards[0];
    if (g) {
      sawGuard = true;
      n.sqPose = "stand";
      n.sq.x = g.x + 24;
      n.sq.y = g.y + 16;
      n.walkTo = { x: g.x, y: g.y, room: "hall", lx: n.sq.x, ly: n.sq.y, lt: n.T, at: n.T };
    }
    ss.tick(0.05);
    if (n.cur && n.cur.id === "jail") cause = n.cur.cause || "";
  }
  return { home, cause, sawGuard };
});

g.check(
  "getting home skips the 9-second countdown and the guard enters about half a second after the door",
  security.home && !security.home.caught && security.home.search && security.home.delay > 0.35 && security.home.delay < 1.2,
  security.home,
);
g.check(
  "a guard's sight uses the existing hall lockup",
  security.cause === "A tourist saw Squatch in the hall. Security caught him." && security.sawGuard,
  { cause: security.cause, sawGuard: security.sawGuard },
);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("people-scale");
