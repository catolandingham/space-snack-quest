// Bundled by tools/party-sheet.mjs and run inside the game page (never part of the game): draws every new party
// picture for Brian's picture sheet with the game's own drawing code, and hands each back as a PNG data URL.
import { drawHall } from "../src/modules/party-draw.js";
import { withSnackLayers } from "../src/modules/crate-stamp.js";
import { BAND_A } from "./party-half-two-art.js";
import { drawHeartCone, drawCountdown, drawBandNotes, drawClap, drawHiccups, drawSpeakerRing, drawLoosePiece, drawFlash } from "../src/modules/party-free-art.js";
import { SONG_LIGHTS } from "../src/modules/party-dance.js";
import { drawDanceCloseUp } from "../src/modules/party-dance-art.js";
import { drawPyramid, drawSnackCloseUp } from "../src/modules/party-snacks-art.js";
import { drawSnackPaw } from "../src/modules/party-snacks-paw.js";
import { congaAt, CONGA } from "../src/modules/party-toys.js";
import { HALL_SPEAKER } from "../src/modules/party-hall.js";
import { HALL, CAST, SPOTS, GLANCE, HALL_PICTURE, CAMERA_AIM } from "../src/modules/party-hall.js";
import { coneFrom, towardStage, lookAt } from "../src/modules/party-watch.js";
import { createGuestArt } from "../src/modules/guests.js";
import { drawDoorNotes, drawFlyer, drawAlarmCloseUp, cameraLens } from "../src/modules/party-art.js";
import * as dress from "../src/modules/dress-up.js";

const guests = createGuestArt();
const load = (src) =>
  new Promise((res) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => res(i);
    i.src = src;
  });
const pics = {};
const ready = (async () => {
  pics.hall = withSnackLayers("hall", await load(HALL_PICTURE)); // (the tin's new lid, as the game shows it)
  pics.home = withSnackLayers("home-closed", await load("docs/locked-rooms/home-room-empty-closed-v6.png"));
  pics.homeOpen = withSnackLayers("home-open", await load("docs/locked-rooms/home-room-empty-open-v6.png"));
  // the guest pictures load in createGuestArt; wait for them too
  await new Promise((r) => setTimeout(r, 600));
})();

const E = () => window.SSQ.engine();
const size = () => E().coneSize();
const ABSURD = { head: "boots", face: "stache", body: "tutu", legs: "shades" };
const SMART = { head: "tophat", face: "shades", body: "shirt", legs: "boots" };

function guestsFacingStage(extra = {}) {
  return CAST.guests.map((g) => ({ id: g.id, x: g.x, y: g.y, ...(extra[g.id] || {}) }));
}
function stageCones(people, glancerLook) {
  const c = [];
  for (const g of people) c.push(coneFrom(g.id, g.x, g.y, g.id === "backpack" && glancerLook ? GLANCE.a : towardStage(g.x, g.y), size()));
  c.push(coneFrom("isfred", CAST.isfred.x, CAST.isfred.y, Math.PI / 2, size()));
  CAST.band.forEach((b, i) => c.push(coneFrom("band" + i, b.x, b.y, Math.PI / 2 + (i - 1) * 0.25, size())));
  c.push(coneFrom("bartender", CAST.bartender.x, CAST.bartender.y, Math.PI, size()));
  return c;
}
function pairCones(people) {
  const by = Object.fromEntries(people.map((p) => [p.id, p]));
  return people.map((p) => {
    const g = CAST.guests.find((q) => q.id === p.id);
    const to = g && g.pair ? by[g.pair] : null;
    return coneFrom(p.id, p.x, p.y, to ? lookAt(p.x, p.y, { x: to.x, y: to.y - 28 }) : towardStage(p.x, p.y), size());
  });
}
function base(t = 1.2) {
  return {
    t,
    picture: pics.hall,
    banner: { glow: 0 },
    isfred: { x: CAST.isfred.x, y: CAST.isfred.y },
    band: { playing: false },
    guests: guestsFacingStage(),
    bartender: { x: CAST.bartender.x, y: CAST.bartender.y, f: -1 },
    tripod: { ...CAST.guests.find((g) => g.id === "camera").tripod, aim: { x: 330, y: 250 } },
    cones: [],
  };
}
function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}
function hall(view) {
  const c = canvas(960, 640),
    ctx = c.getContext("2d");
  drawHall(ctx, E(), guests, view);
  return c;
}
function crop(src, x, y, w, h, out = 960) {
  const c = canvas(out, Math.round((out * h) / w));
  c.getContext("2d").drawImage(src, x, y, w, h, 0, 0, c.width, c.height);
  return c;
}

const R = {};
R.v01_banner = () => hall({ ...base(), guests: [], isfred: null, band: null, bartender: null, tripod: null, banner: { glow: 0 } });
R.v01_banner_zoom = () => crop(hall({ ...base(), banner: { glow: 1 } }), 200, 60, 330, 220);
R.v02_home_door = () => {
  const c = canvas(960, 640),
    ctx = c.getContext("2d");
  ctx.drawImage(pics.home, 0, 0, 960, 640);
  drawDoorNotes(ctx, { x0: 912, x1: 940, y0: 358, y1: 468 }, 1.3);
  E().drawSquatch(ctx, 700, 470, E().squatchScale(), { f: 1 });
  return c;
};
R.v02_peek = () => {
  const v = base(2.4);
  v.squatch = { x: SPOTS.peek.x, y: SPOTS.peek.y, pose: "peek" };
  v.cones = stageCones(v.guests);
  v.allCones = true;
  return hall(v);
};
R.v02_peek_zoom = () => crop(R.v02_peek(), 330, 460, 300, 180);
R.v03_cast = () => hall({ ...base(), guards: [{ x: 760, y: 330, f: -1 }, { x: 820, y: 360, f: -1 }] });
R.v04_band_A = () => crop(hall({ ...base(), band: { playing: true, looks: BAND_A } }), 230, 150, 260, 140, 520);
R.v04_band_B = () => crop(hall({ ...base(), band: { playing: true } }), 230, 150, 260, 140, 520);
R.v04_band_both = () => {
  const a = R.v04_band_A(),
    b = R.v04_band_B(),
    c = canvas(a.width * 2 + 20, a.height),
    ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(a, 0, 0);
  ctx.drawImage(b, a.width + 20, 0);
  return c;
};
R.v05_dance_phone = () => {
  const c = canvas(375, 812);
  drawDanceCloseUp(c.getContext("2d"), 375, 812, guests, SMART, 1.1, { moves: 1, cheer: 0.5, pop: 0 }, 0);
  return c;
};
R.v05_dance_computer = () => {
  const c = canvas(1100, 800);
  drawDanceCloseUp(c.getContext("2d"), 1100, 800, guests, ABSURD, 1.1, { moves: 2, cheer: 0.9, pop: 0 }, 1);
  return c;
};
function dressShot(w, h, outfit, drag) {
  const c = canvas(w, h),
    L = dress.layout(w, h),
    st = { outfit: { ...outfit }, drag: null };
  if (drag) st.drag = { id: drag, x: L.sq.x - 20, y: L.sq.y - L.sq.scale * 30 };
  dress.draw(c.getContext("2d"), L, st, 1, 0);
  return c;
}
R.v06_dress_phone_start = () => dressShot(375, 812, dress.newOutfit(), "boots");
R.v06_dress_phone_absurd = () => dressShot(375, 812, ABSURD);
R.v06_dress_computer = () => dressShot(1100, 800, { head: "tophat", face: "", body: "scarf", legs: "" }, "shades");
R.v07_outfit_hall = () => {
  const v = base();
  v.squatch = { x: 520, y: 540, f: 1, pose: "stand", outfit: ABSURD };
  return hall(v);
};
R.v07_outfit_zoom = () => {
  const v = base();
  v.squatch = { x: 520, y: 540, f: 1, pose: "stand", outfit: ABSURD };
  const a = hall(v);
  v.squatch.outfit = SMART;
  v.squatch.x = 600;
  const b = hall(v);
  const c = canvas(640, 320),
    ctx = c.getContext("2d");
  ctx.drawImage(a, 460, 450, 120, 120, 0, 0, 320, 320);
  ctx.drawImage(b, 540, 450, 120, 120, 320, 0, 320, 320);
  return c;
};
R.v09_vent_tuft = () => {
  const v = base(2);
  v.squatch = { x: 240, y: 520, f: -1, pose: "stand", shake: 1 };
  v.tufts = [{ x: 215, y: 505, s: 11, rot: -0.4 }];
  v.warning = { k: 1 };
  return crop(hall(v), 100, 380, 280, 180, 700);
};
for (const song of [0, 1, 2])
  R["v10_lights_song" + (song + 1)] = () => {
    const v = base(1);
    v.lights = { dim: 1, color: SONG_LIGHTS[song] };
    v.band = { playing: true };
    v.guests = pairDance();
    const c = hall(v);
    drawBandNotes(c.getContext("2d"), CAST.band, 1.2 + song * 0.3, song);
    return c;
  };
function pairDance() {
  return CAST.guests.map((g) => ({ id: g.id, x: g.x, y: g.y, dance: 1, lean: g.pair ? (CAST.guests.find((q) => q.id === g.pair).x > g.x ? 1 : -1) : 0 }));
}
R.v11_flyer_back = () => {
  const v = base();
  v.lights = { dim: 1 };
  v.band = { playing: true };
  v.guests = pairDance();
  v.cones = pairCones(v.guests);
  v.squatch = { x: 455, y: 585, f: 1, pose: "stand", flyer: true };
  return crop(hall(v), 380, 500, 160, 120, 480);
};
R.v11_flyer_floor = () => {
  const c = canvas(960, 640),
    ctx = c.getContext("2d");
  ctx.drawImage(pics.home, 0, 0, 960, 640);
  drawFlyer(ctx, 860, 470, 16, 0.5);
  E().drawSquatch(ctx, 700, 470, E().squatchScale(), { f: 1 });
  return crop(c, 620, 340, 320, 200, 640);
};
R.v12_alarm_phone = () => {
  const c = canvas(375, 812);
  drawAlarmCloseUp(c.getContext("2d"), 375, 812, pics.hall, HALL.alarmPicture, 1, 0.05);
  return c;
};
R.v12_alarm_computer = () => {
  const c = canvas(1100, 800);
  drawAlarmCloseUp(c.getContext("2d"), 1100, 800, pics.hall, HALL.alarmPicture, 0.6, 0.05);
  return c;
};
R.v12_alarm_hall = () => {
  const v = base(0.05);
  v.guests = guestsFacingStage({ backpack: { x: SPOTS.alarmRun.x, y: SPOTS.alarmRun.y } });
  v.alarm = true;
  v.shout = { x: SPOTS.alarmRun.x - 20, y: SPOTS.alarmRun.y - 110 };
  v.guards = [{ x: 860, y: 360, f: -1 }, { x: 905, y: 330, f: -1 }];
  v.cones = v.guards.map((g, i) => coneFrom("guard" + i, g.x, g.y, lookAt(g.x, g.y, { x: 470, y: 560 }), size()));
  v.squatch = { x: 470, y: 590, f: 1, pose: "stand" };
  return hall(v);
};
R.v13_heart_cone = () => {
  const v = base(1.5);
  v.guests = [];
  v.band = null;
  v.isfred = null;
  v.bartender = null;
  v.tripod = null;
  const c = hall(v),
    ctx = c.getContext("2d"),
    mx = 840,
    my = 330,
    sc = E().hallSizes().squatch * 1.15;
  drawHeartCone(ctx, mx - 10, my - 32, lookAt(mx, my, { x: 520, y: 520 }), size().half, size().len, 1.5);
  E().drawSquatch(ctx, 520, 520, E().hallSizes().squatch, { f: 1 });
  // Mops is drawn by the game on its own canvas: borrow it for one moment (no frame runs in between) and copy back.
  const gc = document.querySelector("canvas"),
    g = gc.getContext("2d"),
    k = gc.width / 960;
  E().drawMopsOn(ctx, mx, my, sc, { f: -1 });
  return c;
};
R.v14_camera_conga = () => {
  const v = base(1);
  v.guests = [
    ...guestsFacingStage().filter((g) => !["teal", "stilt", "octopus-guest"].includes(g.id)),
    { id: "teal", x: 520, y: 470, dance: 0.6 },
    { id: "stilt", x: 560, y: 474, dance: 0.6 },
    { id: "octopus-guest", x: 602, y: 478, dance: 0.6 },
  ];
  v.squatch = { x: 640, y: 484, f: 1, pose: "stand", outfit: SMART };
  const c = hall(v);
  drawCountdown(c.getContext("2d"), v.tripod.x, v.tripod.y, 2, 1);
  return c;
};
R.v15_warnings = () => {
  const v = base(2.2);
  v.cones = stageCones(v.guests, true);
  v.squatch = { x: 470, y: 560, f: 1, pose: "stand" };
  v.marks = [{ x: 600, y: 395, mark: "?", size: 34 }];
  return hall(v);
};
R.v15_caught_mark = () => {
  const v = base(2.2);
  v.cones = stageCones(v.guests, true);
  v.cones.find((c) => c.id === "backpack").hot = true;
  v.squatch = { x: 462, y: 565, f: 1, pose: "stand" };
  v.marks = [{ x: 600, y: 395, mark: "!", size: 34 }];
  return hall(v);
};
R.v15_eyes_plant = () => {
  const v = base(1.4);
  v.band = { playing: true };
  v.lights = { dim: 1 };
  v.guests = pairDance();
  v.squatch = { x: SPOTS.plantMiddle.x, y: SPOTS.plantMiddle.y, pose: "hidden" };
  v.eyes = HALL.plants[0].eyes;
  return hall(v);
};

// ---------- half two (P6 to P8): every new drawing, as the game draws it ----------
const P6 = { head: "boots", face: "stache", body: "tutu", legs: "shades" };
function partyView(t = 1.3, song = 0) {
  const v = base(t);
  v.lights = { dim: 1, color: SONG_LIGHTS[song] };
  v.band = { playing: true };
  v.guests = pairDance();
  v.isfred = { x: CAST.isfredBar.x, y: CAST.isfredBar.y };
  return v;
}
R.h2_conga = () => {
  const v = partyView(1.6, 1),
    d = 300;
  const line = ["teal", "stilt", "backpack"].map((id, i) => ({ id, ...congaAt(d - i * CONGA.gap), dance: 1 }));
  v.guests = [...pairDance().filter((g) => !line.some((q) => q.id === g.id)), ...line];
  const tail = congaAt(d - 3 * CONGA.gap);
  v.squatch = { x: tail.x, y: tail.y, f: 1, walk: 3, pose: "stand", outfit: P6 };
  return hall(v);
};
R.h2_camera_count = () => {
  const v = partyView(1.1);
  const c = hall(v),
    ctx = c.getContext("2d"),
    tp = v.tripod;
  drawCountdown(ctx, tp.x, tp.y, 1, 1);
  return crop(c, 250, 300, 300, 240, 600);
};
R.h2_flash = () => {
  const c = hall(partyView(1.1)),
    ctx = c.getContext("2d");
  const cam = CAST.guests.find((q) => q.id === "camera");
  drawFlash(ctx, 0.25, cameraLens({ x: cam.x - 28, y: cam.y + 6 }, CAMERA_AIM));
  return crop(c, 250, 300, 300, 240, 600);
};
R.h2_pyramid = () => {
  const v = partyView(1.4);
  v.squatch = { x: 760, y: 540, f: 1, pose: "stand", outfit: P6 };
  const c = hall(v),
    ctx = c.getContext("2d");
  drawPyramid(ctx, { snacks: { bag: 2, chain: -1, toppled: false } }, v.squatch, 1);
  return crop(c, 640, 400, 320, 220, 640);
};
R.h2_pyramid_topple = () => {
  const v = partyView(1.4);
  v.squatch = { x: 720, y: 520, f: 1, pose: "stand", outfit: { ...P6, head: "" } };
  const c = hall(v),
    ctx = c.getContext("2d");
  drawPyramid(ctx, { snacks: { bag: 5, chain: 0.4, toppled: true } }, v.squatch, 1);
  drawLoosePiece(ctx, "boots", 760, 470, 22, 2.2);
  return crop(c, 600, 380, 360, 240, 720);
};
for (const phase of ["back", "glance", "face"])
  R["h2_snack_closeup_" + phase] = () => {
    const c = hall(partyView(1.4)),
      ctx = c.getContext("2d");
    const p = { snack: { zoom: 1, paw: { x: 470, y: 330 }, held: 4, phase, t: 0 }, snacks: { bag: 2, taken: [0, 2], toppled: false } };
    drawSnackCloseUp(ctx, p, 1, drawSnackPaw);
    return c;
  };
R.h2_piece_fly = () => {
  const v = partyView(2);
  v.squatch = { x: 460, y: 540, f: 1, pose: "stand", outfit: { ...P6, head: "" }, shake: 1 };
  const c = hall(v),
    ctx = c.getContext("2d");
  drawLoosePiece(ctx, P6.head, 530, 470, 25, 1.5);
  return crop(c, 360, 380, 260, 200, 650);
};
R.h2_clap_and_hiccups = () => {
  const v = partyView(1.3);
  const c = hall(v),
    ctx = c.getContext("2d");
  v.guests.forEach((g) => g.id !== "octopus-guest" && drawClap(ctx, g.x, g.y - 80, 1.3));
  const o = v.guests.find((g) => g.id === "octopus-guest");
  drawHiccups(ctx, o.x, o.y, 1.3);
  return c;
};
R.h2_closing_speaker = () => {
  const c = hall({ ...partyView(1.3), lights: null }),
    ctx = c.getContext("2d");
  drawSpeakerRing(ctx, HALL_SPEAKER, 1.3);
  return crop(c, 560, 60, 260, 160, 520);
};
R.h2_leaving_in_pairs = () => {
  const v = { ...partyView(1.3), lights: null };
  v.band = { playing: false };
  v.guests = [
    { id: "teal", x: 868, y: 318, dance: 0 },
    { id: "stilt", x: 900, y: 330, dance: 0 },
    { id: "robot", x: 760, y: 360, dance: 0 },
    { id: "octopus-guest", x: 790, y: 380, dance: 0 },
    { id: "camera", x: 560, y: 420, dance: 0 },
    { id: "backpack", x: 600, y: 430, dance: 0 },
  ];
  v.squatch = { x: 420, y: 520, f: 1, pose: "stand", outfit: P6 };
  return hall(v);
};
R.h2_mops_mopping_in = () => {
  const v = { ...base(1.5), guests: [], band: null, isfred: null, bartender: null, tripod: null };
  v.squatch = { x: 420, y: 520, f: 1, pose: "stand", outfit: P6 };
  const c = hall(v),
    ctx = c.getContext("2d");
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = "rgba(140,190,230,.35)";
    ctx.beginPath();
    ctx.ellipse(900 - i * 14, 362 + i * 6, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  E().drawMopsOn(ctx, 800, 390, E().hallSizes().squatch * 1.15, { f: -1, walk: 3, headDown: true, sweep: 3 });
  return c;
};

window.PARTY_SHEET = {
  ids: Object.keys(R),
  async render(id) {
    await ready;
    return R[id]().toDataURL("image/png");
  },
};
