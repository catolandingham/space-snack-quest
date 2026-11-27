/**
 * The station's snack has its new name everywhere (Brian, 2026-11-26, question 86; the name: src/modules/snack-name.js).
 *   (a) The name is spelled in one place, src/modules/snack-name.js: no other file in src/, tests/ or tools/ spells
 *       it (they all read it from there), and nothing in src/, tests/, tools/ or the built index.html says the old
 *       name as words. Ids that keep the old name joined up ("moonpie", "mops-moon-pie", "sign-moon-pies") are ids,
 *       never shown; README.md lists them.
 *   (b) No lines file (src/modules/*-lines.js) has a line with the old name.
 *   (c) No word the canvas draws in the main scenes says the old name: every Chapter 1 beat the game can jump to,
 *       the party night's scenes, the calendar close-up, the panels (the delivery notice, the snack site, the Chapter 4
 *       poster), the old crate flashback and the bedtime story's pictures, by day and by night. The bedtime story's
 *       crate shows the family stamp as it arrived (no crayon). The snack site and the calendar show the new name.
 *   (d) The party hall's snack tin, painted in the locked hall picture with the old name, gets a new lid as a layer.
 *       Squatch's crate bed, his family's crate, carries its own stamp, layered over the locked home picture (the file
 *       never changes): fat red letters, the first one scraped off (FAMILY.FADED), with his crayon "ST" in the scraped gap, by day and at
 *       night, and the old badge's navy is gone from the crate. The station's crates have the thin blue stamp.
 *   node tests/snack-name.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";
import { SNACK, FAMILY, SNACK_LINES } from "../src/modules/snack-name.js";
import { CRATE_BED, HALL_TIN } from "../src/modules/crate-stamp.js";

const g = await startGame({ port: 9520, name: "snack-name" });

// The old name, as words (built from pieces so this file does not say it either).
const OLD = new RegExp("moo" + "n pies?", "i");
// The new name and its family stamp in any form: the snack's own words, its capitals, and the faded stamp.
const NEW = new RegExp("(?<![a-z])(st|m)?ar" + "s cakes?\\b", "i");

// (a) Files.
const walk = (dir) =>
  readdirSync(join(root, dir)).flatMap((f) => {
    const p = join(dir, f);
    if (f === "node_modules" || f === "out" || f.startsWith(".")) return [];
    return statSync(join(root, p)).isDirectory() ? walk(p) : /\.(m?js|json|html)$/.test(f) ? [p] : [];
  });
const files = ["src", "tests", "tools"].flatMap(walk);
const oldWords = [],
  spelled = [];
for (const f of files) {
  const text = readFileSync(join(root, f), "utf8");
  text.split("\n").forEach((line, i) => {
    OLD.test(line) && oldWords.push(`${f}:${i + 1}`);
    NEW.test(line) && f !== join("src", "modules", "snack-name.js") && spelled.push(`${f}:${i + 1}`);
  });
}
g.check("the snack's name is spelled only in src/modules/snack-name.js", spelled.length === 0, spelled);
g.check("no file in src/, tests/ or tools/ says the old name as words", oldWords.length === 0, oldWords);
const html = readFileSync(join(root, "index.html"), "utf8");
g.check("the built page (index.html) never says the old name", !OLD.test(html), (html.match(new RegExp(".{40}" + OLD.source + ".{20}", "i")) || [])[0]);
g.check(
  "the name's forms and the family stamp: the name, one of them, capitals; the crayon and the faded stamp read as the station's name",
  SNACK.one + "s" === SNACK.name && SNACK.NAME === SNACK.name.toUpperCase() && FAMILY.CRAYON + FAMILY.FADED === SNACK.NAME && FAMILY.NAME.slice(1) === FAMILY.FADED && FAMILY.NAME !== SNACK.NAME,
  { SNACK, FAMILY },
);

// (b) Lines files.
const lineFiles = readdirSync(join(root, "src", "modules")).filter((f) => /-lines\.js$/.test(f) || f === "snack-name.js");
const badLines = [];
let lineCount = 0;
for (const f of lineFiles) {
  const mod = await import(new URL(`../src/modules/${f}`, import.meta.url).href);
  const seen = new Set();
  const visit = (v, path) => {
    if (!v || typeof v !== "object" || seen.has(v)) return;
    seen.add(v);
    if (typeof v.text === "string") (lineCount++, OLD.test(v.text) && badLines.push(`${f} ${path}: ${v.text}`));
    for (const [k, x] of Object.entries(v)) visit(x, path + "." + k);
  };
  for (const [k, v] of Object.entries(mod)) visit(v, k);
}
g.check(`no line in the ${lineFiles.length} lines files says the old name (${lineCount} lines read)`, lineCount > 50 && badLines.length === 0, badLines);
g.check("the painted words are in the snack's lines: the station's stamp, the hall tin's lid, the faded stamp and his crayon", SNACK_LINES.map((l) => l.text).join("|") === `${SNACK.NAME}|${SNACK.name}|_${FAMILY.FADED}|${FAMILY.CRAYON}`, SNACK_LINES);

// (c) and (d) In the game.
const { page, errors } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);
await page.evaluate(() => {
  window.__words = new Set();
  const fill = CanvasRenderingContext2D.prototype.fillText,
    stroke = CanvasRenderingContext2D.prototype.strokeText;
  CanvasRenderingContext2D.prototype.fillText = function (t, ...a) {
    window.__words.add(String(t));
    return fill.call(this, t, ...a);
  };
  CanvasRenderingContext2D.prototype.strokeText = function (t, ...a) {
    window.__words.add(String(t));
    return stroke.call(this, t, ...a);
  };
});
const scan = await page.evaluate(async () => {
  const ss = window.__ss,
    n = ss.op,
    party = window.SSQ.beat("ch1-party");
  const states = [];
  const draw = (name, setup) => {
    try {
      setup();
      for (let i = 0; i < 6; i++) ss.tick(0.05);
      ss.drawFrame();
      states.push(name);
    } catch (e) {
      states.push(name + " (could not open: " + e.message + ")");
    }
  };
  const reset = () => {
    n.ch1PartyNow = null;
    n.ch1Calendar = null;
    n.ch1Morning = null;
    n.q = [];
    n.cur = null;
  };
  for (let b = 1; b <= 61; b++) draw("beat " + b, () => (reset(), ss.ch1JumpBeat(b)));
  for (const s of ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P8b"]) draw("party " + s, () => (reset(), party.jump(s)));
  draw("calendar close-up", () => (reset(), ss.ch1JumpBeat(22), (n.ch1Calendar = { ctrl: true, next: null, age: 1 })));
  for (const id of ["sched", "ch1site", "ch1moon", "poster4"]) draw("panel " + id, () => (reset(), ss.ch1JumpBeat(22), (n.cur = { k: "panel", id })));
  draw("old crate flashback", () => (reset(), ss.ch1JumpBeat(22), (n.cur = { k: "fb", pic: "fb1crate", cap: "" })));
  // the bedtime story's crate picture (beat 21, cutaway "moonpie"), alone: the crate as it arrived
  const all = [...window.__words];
  window.__words = new Set();
  const before = window.SSQ.crateStampDrawn().stamps;
  draw("bedtime story crate picture", () => (reset(), ss.ch1JumpBeat(22), (n.cur = { k: "cutaway", id: "moonpie", panel: 0 })));
  const d = window.SSQ.crateStampDrawn();
  const bedtimeCrate = { words: [...window.__words], stamped: d.stamps - before, last: d.last };
  for (let i = 1; i < 8; i++) draw("bedtime story picture " + (i + 1), () => (reset(), ss.ch1JumpBeat(22), (n.cur = { k: "cutaway", id: "moonpie", panel: i })));
  return { states, words: [...all, ...window.__words], bedtimeCrate };
});
const opened = scan.states.filter((s) => !/could not open/.test(s));
const shownOld = scan.words.filter((w) => new RegExp("moo" + "n pies?", "i").test(w));
g.check(`no word drawn in ${opened.length} main scenes says the old name`, opened.length >= 20 && shownOld.length === 0, { shownOld, notOpened: scan.states.filter((s) => /could not open/.test(s)) });
g.check(
  "the new name is drawn: the calendar's sponsor, the snack site's header, the delivery notice, the station's crate stamp",
  [`Sponsored by ${SNACK.NAME}`, SNACK.NAME, `${SNACK.NAME} ×500`].every((w) => scan.words.includes(w)),
  scan.words.filter((w) => NEW.test(w)),
);

g.check(
  `the bedtime story's crate, as it arrived, has the family's worn stamp "${FAMILY.FADED}" and no crayon yet (he was a baby)`,
  scan.bedtimeCrate.stamped > 0 && !!scan.bedtimeCrate.last && scan.bedtimeCrate.last.letters.text === FAMILY.FADED && scan.bedtimeCrate.last.crayon === null && !scan.bedtimeCrate.words.some((w) => OLD.test(w)),
  scan.bedtimeCrate,
);

// (d) The crate bed's stamp, by day and at night.
const bed = async (night) =>
  page.evaluate(
    (night, B) => {
      const ss = window.__ss,
        n = ss.op;
      n.q = [];
      n.cur = null;
      n.ch1Calendar = null;
      ss.ch1JumpBeat(22);
      n.ch1Zoom = null;
      n.ch1Hold = "";
      n.sq.x = 760;
      n.sq.y = 560;
      n.moPose = "hidden";
      night ? (n.ch1Night = true) : (n.ch1Night = false);
      const before = window.SSQ.crateStampDrawn().handed;
      for (let i = 0; i < 4; i++) ss.tick(0.05);
      ss.drawFrame();
      const drawn = window.SSQ.crateStampDrawn();
      const cv = document.querySelector("canvas"),
        k = cv.width / 960,
        kx = 960 / B.picture.w,
        ky = 640 / B.picture.h;
      const count = (box, test) => {
        const x = Math.round(box.x0 * kx * k),
          y = Math.round(box.y0 * ky * k),
          w = Math.max(1, Math.round((box.x1 - box.x0) * kx * k)),
          h = Math.max(1, Math.round((box.y1 - box.y0) * ky * k));
        const d = cv.getContext("2d").getImageData(x, y, w, h).data;
        let c = 0;
        for (let i = 0; i < d.length; i += 4) test(d[i], d[i + 1], d[i + 2]) && c++;
        return { c, of: w * h };
      };
      const m = drawn.made;
      return {
        night: window.SSQ.nightNow(),
        handedThisFrame: drawn.handed - before,
        made: m,
        // fat red letters (by night a darker red under the blue tint)
        red: m ? count(m.letters, (r, g, b) => r > 1.6 * g && r > 1.6 * b && r > (night ? 70 : 130)) : null,
        // his crayon in the gap
        crayon: m ? count(m.gap, (r, g, b) => b > r + 30 && b > g + 20) : null,
        // the old badge's navy pill
        navy: count(B.badge, (r, g, b) => Math.abs(r - 43) < 22 && Math.abs(g - 58) < 22 && Math.abs(b - 103) < 26 && !night),
      };
    },
    night,
    CRATE_BED,
  );
const day = await bed(false),
  night = await bed(true);
for (const [tag, r] of [
  ["by day", day],
  ["at night", night],
]) {
  g.check(`${tag}: the home picture is drawn with the crate bed's stamp layer`, r.handedThisFrame > 0 && !!r.made && r.night === (tag === "at night"), r);
  g.check(
    `${tag}: the stamp is fat red letters "${FAMILY.FADED}" after a scraped gap with his crayon "${FAMILY.CRAYON}"`,
    !!r.made && r.made.letters.text === FAMILY.FADED && r.made.crayon.text === FAMILY.CRAYON && r.made.feet.length === 2 && r.red.c > r.red.of * 0.12 && r.crayon.c > 8,
    { red: r.red, crayon: r.crayon, made: r.made },
  );
}
g.check("by day: the old badge's navy pill is gone from the crate", day.navy.c < day.navy.of * 0.02, day.navy);
// The party hall's snack tin (painted in the locked hall picture with the old name on its lid) gets a new lid.
const hall = await page.evaluate(
  (T) => {
    const ss = window.__ss,
      n = ss.op;
    n.q = [];
    n.cur = null;
    window.SSQ.beat("ch1-party").jump("P2");
    const before = window.SSQ.crateStampDrawn().handedHall;
    for (let i = 0; i < 4; i++) ss.tick(0.05);
    ss.drawFrame();
    const d = window.SSQ.crateStampDrawn();
    return { handedThisFrame: d.handedHall - before, tin: d.tin };
  },
  HALL_TIN.lid,
);
// The lid itself, in the hall picture as the game gets it by day (full size): the little yellow star is there, where the
// locked file has the old lid's blue and white.
const lid = await page.evaluate(async (T) => {
  const ss = window.__ss;
  ss.op.q = [];
  ss.op.cur = null;
  ss.ch1JumpBeat(22); // (Day 2: day)
  const img = new Image();
  img.src = "docs/locked-rooms/hall-room-empty-v2.png";
  await img.decode();
  const pic = window.SSQ.nightPicture("hall", img);
  const read = (source) => {
    const c = document.createElement("canvas");
    c.width = 1280;
    c.height = 830;
    const x = c.getContext("2d");
    x.drawImage(source, 0, 0);
    const px = x.getImageData(Math.round(T.cx + 6.6 * Math.sin(T.tilt)) - 2, Math.round(T.cy - 6.6 * Math.cos(T.tilt)) - 2, 5, 5).data;
    let n = 0;
    for (let i = 0; i < px.length; i += 4) px[i] > 200 && px[i + 1] > 150 && px[i + 2] < 120 && n++;
    return n;
  };
  return { night: window.SSQ.nightNow(), layered: pic !== img, starNow: read(pic), starInFile: read(img) };
}, HALL_TIN.lid);
g.check("by day the hall picture comes with the new lid: its yellow star is where the locked file has none", !lid.night && lid.layered && lid.starNow >= 3 && lid.starInFile === 0, lid);
g.check(`the hall picture is drawn with the tin's new lid: "${SNACK.name}" under a star`, hall.handedThisFrame > 0 && !!hall.tin && hall.tin.words.join(" ") === SNACK.name, hall);

// The picture files are as main has them (git's own record of each file's contents).
const git = (...a) => {
  try {
    return execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};
const pics = ["home-room-empty-closed-v6.png", "home-room-empty-open-v6.png", "hall-room-empty-v2.png"].map((f) => {
  const p = "docs/locked-rooms/" + f;
  // (main as origin/main has it; on a checkout without it, the last commit, which the branch's own history guards)
  return { f, now: git("hash-object", p), main: git("rev-parse", "origin/main:" + p) || git("rev-parse", "HEAD:" + p) };
});
g.check("the locked home and hall pictures are not edited (the stamp and the tin's lid are layers drawn over them)", pics.every((p) => p.now && p.main && p.now === p.main), pics);
g.check("no page errors", errors.length === 0, errors);
await g.finish("snack-name");
