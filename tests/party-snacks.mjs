/**
 * The snack bar's close-up (party plan P6, "Snacks"; Brian 2026-11-24, video notes, "Snacks and the dance";
 * src/modules/party-snacks.js, party-snacks-art.js, party-snacks-play.js, party-snacks-stack.js), at phone size.
 * The rule itself is checked in tests/party-snack-stack.mjs; this suite checks the game:
 *   - the hall's pyramid and the close-up's are the same snacks in the same places, from one table, and stay so
 *     as snacks are taken and slide;
 *   - the close-up is bright and sharp (no dimmed, blurred hall behind it);
 *   - the bartender (Brian 2026-11-25, "1"): her back, side-on while she turns, and her front are three different
 *     drawings; no eye sign beside her (Brian: "I don't think we need the extra eye icon"); her sight starts from
 *     her face and lies over the pyramid only when she faces him;
 *   - his paw (Brian 2026-11-25, "C"): his arm is in his party shirt's long sleeve with a fur cuff, waiting,
 *     reaching and holding, with no bare arm below the cuff; the snack in his paw is drawn once;
 *   - a tap takes a snack (no dragging): his paw reaches out, the snack leaves the pile and lands in the bag, the
 *     bag shows the count, each snack is stars;
 *   - "Got one!" once, after the first snack; LEAVE · bar is drawn the whole time, big enough to read, and leaves;
 *   - loose snacks jiggle, snacks stood on are pressed; an edge pull is a settle drawn as a slide; a pull two
 *     snacks stand on shows the pile going, then the hall's topple (a piece knocked off, the 4 second stare),
 *     with no stars for that pull;
 *   - her two catches are unchanged, and a snack tapped as she starts to turn is still safe;
 *   - every snack taken: the record for Day 2, GRAB · snacks no longer offered, and "Snack Bandit" on the Chapter 1 tally, with
 *     no extra points; nothing sounds with sound off;
 *   - after the merge with party round four: GRAB · snacks on the action button alone opens the close-up (no paw
 *     icon); a snack in his paw is paid when the close-up is closed from outside (the song ending, an alarm); the
 *     octopus says nothing while the pile falls and everyone stares; the try-again card's "snacks" picture fills in.
 * The game's clock is stopped once the party is open: only the test's own ticks move it (60 a second), with the
 * shipped numbers. Stills at 375 x 812 go to tests/out/party-stills/ (snack-*.png), or to STILLS if set.
 *   node tests/party-snacks.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = process.env.STILLS || join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9210, name: "party-snacks" });
const mod = await import(join(root, "src", "modules", "party-snacks.js"));
const stack = await import(join(root, "src", "modules", "party-snacks-stack.js"));
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const play = await import(join(root, "src", "modules", "party-snacks-play.js"));
const card = await import(join(root, "src", "modules", "party-card.js"));
const free = await import(join(root, "src", "modules", "party-free.js"));
const { BAR, CUT, SNACK_STARS, SNACK_LOOK_SECONDS, slotAt } = mod;
const FILL = { cup: "#8fdcff", pie: "#6b3a1c", cake: "#fffdf8" }; // the colour at each kind's middle
const WALL = "#f1e3ea";
const INK_HEX = "#1e2430";
// Where slot i sits on the hall's counter (the art module's own; it needs a browser to import, so the same sum here).
const hallAt = (i) => ({ x: hall.PYRAMID.x + (stack.SLOTS[i].col - 3) * 7.5, y: hall.PYRAMID.y - 8 - stack.SLOTS[i].row * 13 });
const slot = (row, n) => stack.SLOTS.map((s, i) => ({ ...s, i })).filter((s) => s.row === row).sort((a, b) => a.col - b.col)[n].i;

async function open(soundOn) {
  const o = await g.open("?beat=party:P6", PHONE);
  await sleep(1200);
  await o.page.evaluate(() => {
    // what the picture's words are, where, and how big (canvas text is not in the page)
    window.__texts = [];
    const fill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, x, y, ...rest) {
      const m = this.getTransform(),
        k = this.canvas.width / 960,
        px = parseFloat((this.font.match(/([\d.]+)px/) || [0, 0])[1]) * Math.hypot(m.a, m.b);
      window.__texts.push({ text: String(text), x: (m.a * x + m.c * y + m.e) / k, y: (m.b * x + m.d * y + m.f) / k, css: (px * this.canvas.getBoundingClientRect().width) / this.canvas.width });
      return fill.call(this, text, x, y, ...rest);
    };
    // words painted over by a fill of the whole picture (the close-up covers the hall) are not on screen
    const rect = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function (x, y, w, h) {
      x <= 0 && y <= 0 && w >= 960 && h >= 640 && this.globalAlpha >= 1 && (window.__texts.length = 0);
      return rect.call(this, x, y, w, h);
    };
    window.__osc = 0;
    const A = window.AudioContext || window.webkitAudioContext,
      osc = A.prototype.createOscillator,
      src = A.prototype.createBufferSource;
    A.prototype.createOscillator = function () {
      window.__osc++;
      return osc.call(this);
    };
    A.prototype.createBufferSource = function () {
      window.__osc++;
      return src.call(this);
    };
  });
  soundOn && (await o.page.click("#ss-sound"));
  // from here only the test's own ticks move the game
  await o.page.evaluate(() => ((window.requestAnimationFrame = () => 0), window.__ss.drawFrame()));
  return o;
}
const draw = (page) => page.evaluate(() => ((window.__texts.length = 0), window.__ss.drawFrame()));
const run = async (page, secs) => {
  await page.evaluate((n) => {
    for (let i = 0; i < n; i++) window.__ss.tick(1 / 60);
  }, Math.round(secs * 60));
  await draw(page);
};
// Ticks until `f(p.snack, p.snacks, p, n)` is true (at most `max` seconds). Returns the seconds it took, or -1.
// `skip` taps away any line that comes up meanwhile (another guest's), as a kid would.
const runUntil = async (page, f, max = 20, skip = false) => {
  const took = await page.evaluate(`(() => { const f = ${f}; for (let i = 0; i <= ${Math.round(max * 60)}; i++) { const n = window.__ss.op, p = n.ch1PartyNow; if (p && f(p.snack, p.snacks, p, n)) return i / 60; ${skip} && n.cur && n.cur.k === "bub" && n.bt > 0.4 && window.__ss.opTap(); window.__ss.tick(1 / 60); } return -1; })()`);
  await draw(page);
  return took;
};
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      p = n.ch1PartyNow,
      c = n.cur,
      b = window.SSQ.beat("ch1-party");
    return {
      scene: p && p.scene,
      snack: p && p.snack ? JSON.parse(JSON.stringify(p.snack)) : null,
      snacks: p && p.snacks ? JSON.parse(JSON.stringify(p.snacks)) : null,
      now: b.now(),
      record: b.snackRecord(),
      honor: b.snackHonor(),
      ctrl: !!n.ctrl,
      cur: c ? c.k : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      stars: n.stars || 0,
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      oct: p && p.oct ? p.oct.mode : "",
      played: b.now().sound.played,
      texts: window.__texts.slice(),
      bubble: window.__ss.lastBubble ? { x: window.__ss.lastBubble.x, y: window.__ss.lastBubble.y, w: window.__ss.lastBubble.w, h: window.__ss.lastBubble.h || 60 } : null,
      osc: window.__osc,
    };
  });
const tap = (page, x, y) => page.evaluate((a) => window.__ss.ch1Pointer("down", a[0], a[1]), [x, y]);
const tapSlot = (page, i) => tap(page, slotAt(i).x, slotAt(i).y);
// NEXT, as a kid presses it: a moment after the line comes up (a tap in a line's first 0.3 s is ignored).
// (A first press may only finish writing the line out; he presses until the line is gone.)
const next = async (page) => {
  for (let i = 0; i < 4; i++) {
    await run(page, 0.45);
    if ((await page.evaluate(() => (window.__ss.op.cur ? window.__ss.op.cur.k : ""))) !== "bub") return;
    await page.evaluate(() => window.__ss.opTap());
    await run(page, 0.1);
  }
};
// The picture's colour at game positions, as "#rrggbb".
const colours = (page, pts) =>
  page.evaluate((pts) => {
    const c = document.querySelector("canvas"),
      k = c.width / 960,
      ctx = c.getContext("2d");
    return pts.map(([x, y]) => {
      const d = ctx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
      return "#" + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
  }, pts);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const like = (a, b, tol = 12) => hex(a).every((v, j) => Math.abs(v - hex(b)[j]) <= tol);
// How wide the bartender's shirt is drawn along a row of the picture (the leftmost to the rightmost red pixel).
const shirtWidth = (page, y) =>
  page.evaluate((y) => {
    const c = document.querySelector("canvas"),
      k = c.width / 960,
      d = c.getContext("2d").getImageData(Math.round(600 * k), Math.round(y * k), Math.round(360 * k), 1).data;
    let a = -1,
      b = -1;
    for (let i = 0; i < d.length / 4; i++) if (Math.abs(d[i * 4] - 229) < 14 && Math.abs(d[i * 4 + 1] - 83) < 14 && Math.abs(d[i * 4 + 2] - 61) < 14) (a < 0 && (a = i), (b = i));
    return a < 0 ? 0 : (b - a + 1) / k;
  }, y);
const still = (page, name) => page.screenshot({ path: join(OUT, name + ".png") });
// A part of the game picture, enlarged (the hall's pyramid is small on a phone).
const zoomStill = async (page, name, box, times) => {
  const url = await page.evaluate(
    ([b, times]) => {
      const c = document.querySelector("canvas"),
        k = c.width / 960,
        o = document.createElement("canvas");
      o.width = (b.x1 - b.x0) * times;
      o.height = (b.y1 - b.y0) * times;
      const x = o.getContext("2d");
      x.imageSmoothingEnabled = false;
      x.drawImage(c, b.x0 * k, b.y0 * k, (b.x1 - b.x0) * k, (b.y1 - b.y0) * k, 0, 0, o.width, o.height);
      return o.toDataURL("image/png");
    },
    [box, times],
  );
  writeFileSync(join(OUT, name + ".png"), Buffer.from(url.split(",")[1], "base64"));
};
// His paw is in his party shirt's long sleeve (Brian 2026-11-25, paw "C"): what the close-up drew last (the
// sleeve's middle line and its cuff, from the game), checked in the picture. Along the sleeve's middle, below the
// cuff, the picture is the sleeve's orange; and below the cuff's lowest point, within 60 of the sleeve's middle,
// there is no patch of his fur's colour (the old paw was a bare furry arm from the picture's bottom edge up to
// the paw). Checked against the old paw: it fails there.
const FUR = "#6b4428",
  SLEEVE = "#ff8a3d";
async function sleeveSeen(page) {
  const d = await page.evaluate(() => window.SSQ.beat("ch1-party").snackDrawn()),
    w = d && d.paw;
  if (!w) return { drawn: false };
  const inBag = (q) => q.x > CUT.bag.x0 - 10 && q.x < CUT.bag.x1 + 10 && q.y > CUT.bag.y0;
  const mid = w.sleeve.filter((q) => q.y < 637 && Math.hypot(q.x - w.cuff.x, q.y - w.cuff.y) > 40 && !inBag(q)),
    onMid = await colours(page, mid.map((q) => [q.x, q.y]));
  // every pixel below the cuff within 60 of the sleeve's middle line (where his arm is), and the bottom row
  const fur = await page.evaluate(
    (top, F, line) => {
      const c = document.querySelector("canvas"),
        k = c.width / 960,
        y0 = Math.round(top * k),
        h = c.height - y0;
      if (h <= 0) return { rows: 0, fur: 0, orange: 0, at: [] };
      const d = c.getContext("2d").getImageData(0, y0, c.width, h).data,
        near = (i, r, g, b, tol) => Math.abs(d[i] - r) <= tol && Math.abs(d[i + 1] - g) <= tol && Math.abs(d[i + 2] - b) <= tol,
        segDist = (x, y, a, b) => {
          const dx = b.x - a.x,
            dy = b.y - a.y,
            t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1)));
          return Math.hypot(x - a.x - dx * t, y - a.y - dy * t);
        };
      let fur = 0,
        orange = 0,
        at = [];
      for (let i = 0; i < d.length; i += 4) {
        const x = ((i / 4) % c.width) / k,
          y = (y0 + Math.floor(i / 4 / c.width)) / k;
        let m = Infinity;
        for (let j = 1; j < line.length; j++) m = Math.min(m, segDist(x, y, line[j - 1], line[j]));
        if (m > 60) continue;
        // (a patch of fur, not one blended pixel at a snack's edge: the pixel and the four 3 away are all fur)
        const W4 = c.width * 4,
          patch = [i, i - 12, i + 12, i - 3 * W4, i + 3 * W4].every((q) => q >= 0 && q < d.length && near(q, F[0], F[1], F[2], 6));
        patch && (fur++, at.length < 6 && at.push([Math.round(x), Math.round(y)]));
        near(i, 255, 138, 61, 14) && orange++;
      }
      return { rows: h, fur, orange, at };
    },
    w.cuff.low + 2,
    hex(FUR),
    w.sleeve,
  );
  return { drawn: true, mid: mid.length, midOrange: onMid.filter((c) => like(c, SLEEVE, 14)).length, midFur: onMid.filter((c) => like(c, FUR, 6)).length, below: fur, cuff: w.cuff };
}
// How many times the snack in his paw is drawn this frame (a fill in its colour with its middle at the paw's
// snack place): once, by the paw, between his palm and fingers.
async function heldDraws(page, colour) {
  return page.evaluate((colour) => {
    const n = window.__ss.op,
      c = n.ch1PartyNow.snack,
      cv = document.querySelector("canvas"),
      k = cv.width / 960,
      at = { x: c.paw.x, y: c.paw.y - 34 },
      ctx = cv.getContext("2d"),
      fill = CanvasRenderingContext2D.prototype.fill;
    let hits = 0;
    CanvasRenderingContext2D.prototype.fill = function (...a) {
      const m = this.getTransform();
      this === ctx && String(this.fillStyle).toLowerCase() === colour && Math.abs(m.e / k - at.x) < 2 && Math.abs(m.f / k - at.y) < 2 && hits++;
      return fill.apply(this, a);
    };
    window.__ss.drawFrame();
    CanvasRenderingContext2D.prototype.fill = fill;
    return hits;
  }, colour);
}
// Stands him at the bar (where the action button offers the snacks).
const atBar = async (page) => {
  await page.evaluate((p) => ((window.__ss.op.sq.x = p.x - 10), (window.__ss.op.sq.y = p.y + 10)), hall.SNACK_SPOT);
  await run(page, 0.2);
};
// At the bar he presses GRAB · snacks (the action button alone: Brian 2026-11-24) and the close-up opens fully,
// her back turned. Returns -1 if the button does not offer it.
async function toBar(page) {
  await atBar(page);
  if ((await st(page)).act !== "GRAB · snacks") return -1;
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  return runUntil(page, "(c) => c && c.zoom >= 1", 8);
}
// What the two pictures show in each slot ("cup", "pie", "cake", or "" for no snack), read from the pixels.
const kindAt = (c) => Object.keys(FILL).find((k) => like(c, FILL[k], 10)) || "";
// (sampled a little below each snack's middle: the pie has a pale stripe across its middle)
const hallKinds = async (page) => (await colours(page, stack.SLOTS.map((_, i) => [hallAt(i).x, hallAt(i).y + 2]))).map(kindAt);
const cutKinds = async (page) => (await colours(page, stack.SLOTS.map((_, i) => [slotAt(i).x, slotAt(i).y + 14]))).map(kindAt);
const want = (slots) => slots.map((id) => (id < 0 ? "" : stack.kindOf(id)));
// Waits until her back is turned with at least `need` seconds of it left.
const backTurned = (page, need = 1.2) => runUntil(page, `(c) => c && c.phase === "back" && c.t >= ${BAR.away} && c.t <= ${BAR.away} + ${JSON.stringify(BAR.backs)}[c.back % ${BAR.backs.length}] - ${need} && !c.reach`, 20);

// ---------- one table for both pictures ----------
{
  const { page, errors } = await open();
  await atBar(page);
  // (the paw icon was a white disc with a brown paw in it, 58 and then 92 above the pyramid's foot)
  const over = await colours(page, [[hall.PYRAMID.x, hall.PYRAMID.y - 92], [hall.PYRAMID.x, hall.PYRAMID.y - 87], [hall.PYRAMID.x - 16, hall.PYRAMID.y - 92]]);
  g.check("at the bar the action button reads GRAB · snacks, and no paw icon is drawn over the pyramid", (await st(page)).act === "GRAB · snacks" && over.every((c) => !like(c, "#fffdf8", 6) && !like(c, "#6b4428", 16)), [(await st(page)).act, over]);
  const full = want(stack.fullStack());
  let hk = await hallKinds(page);
  g.check("the hall's pyramid is the table's ten snacks, each kind in its place", hk.join() === full.join(), hk);
  await still(page, "snack-01-hall-bar");
  await zoomStill(page, "snack-02-hall-pyramid-enlarged", { x0: hall.PYRAMID.x - 60, y0: hall.PYRAMID.y - 70, x1: hall.PYRAMID.x + 60, y1: hall.PYRAMID.y + 20 }, 6);
  g.check("GRAB · snacks opens the close-up", (await toBar(page)) >= 0);
  let ck = await cutKinds(page);
  g.check("the close-up's pyramid is the same ten snacks in the same places", ck.join() === full.join(), ck);
  const bright = await colours(page, [[60, 40], [500, 60], [60, 300]]);
  g.check("the close-up is bright and sharp: the bar's own wall, nothing dimmed or blurred behind it", bright.every((c) => like(c, WALL, 3)), bright);
  await still(page, "snack-03-close-up-same-snacks");
  // his paw waiting: the mitten and cuff, his sleeve below them to the picture's edge, no bare arm
  let sl = await sleeveSeen(page);
  g.check("his paw waiting: a sleeve under the fur cuff at the picture's edge, and no fur below the cuff", sl.drawn && sl.below.rows > 0 && sl.below.orange > 0 && sl.below.fur === 0, sl);

  // ---------- the bartender (Brian 2026-11-25: bartender "1", no eye sign) ----------
  // She is drawn as three different pictures, read from the colour at three places well inside each: her head
  // below her bun (hair from behind, skin from the front), her far side at the apron's height (red shirt from
  // behind, the apron's white edge side-on and from the front), and past her right side (her shirt from behind
  // and from the front, the wall side-on, where she is narrow).
  const B = CUT.bartender,
    E = B.eyes,
    head = [B.x + 20, 280],
    apron = [B.x - 49, 450],
    beyond = [B.x + 70, 450],
    inSight = [250, 120],
    // where the eye sign was (a white disc 40 across, its middle at 682, 240): its middle and four places inside it
    signAt = [[682, 240], [662, 252], [702, 252], [682, 266], [682, 214]],
    noSign = (cs) => cs.every((c) => !like(c, "#fffdf8", 4) && !like(c, "#d8cdbd", 4) && !like(c, "#ffffff", 4)),
    view = async () => {
      const [h, a, b] = await colours(page, [head, apron, beyond]);
      return { head: h, apron: a, beyond: b, sign: await colours(page, signAt), sight: (await colours(page, [inSight]))[0], wide: await shirtWidth(page, 420) };
    };
  let s = await st(page);
  const back = await view();
  g.check("her back turned: hair where her face would be, her red shirt across her back, no sight over the pyramid", like(back.head, "#4a3020") && like(back.apron, "#e5533d") && like(back.beyond, "#e5533d") && like(back.sight, WALL, 3), back);
  g.check("no eye sign beside her, her back turned (its old place is the bar's wall or her)", noSign(back.sign), back.sign);
  await still(page, "snack-04-her-back-turned");
  await runUntil(page, `(c) => c.phase === "glance" && c.t >= ${BAR.glance * 0.5}`, 12);
  const mid = await view();
  // (the glance ends facing him; half way round she is side-on)
  g.check("turning: she is drawn side-on (the apron's edge at her side, narrow: the wall shows past her)", like(mid.apron, "#fffdf8") && !like(mid.beyond, "#e5533d", 30) && mid.wide > 0 && mid.wide < back.wide * 0.6, mid);
  g.check("no eye sign beside her while she turns", noSign(mid.sign), mid.sign);
  await still(page, "snack-05-she-turns");
  s = await st(page);
  g.check("her turn is heard too (\"dun\")", s.played.includes("dun"));
  await runUntil(page, `(c) => c.phase === "face" && c.t >= 0.4`, 3);
  const front = await view();
  g.check("facing him: her face, her apron, her sight lying over the pyramid", like(front.head, "#e7b48f") && like(front.apron, "#fffdf8") && like(front.beyond, "#e5533d") && !like(front.sight, WALL, 3) && front.wide > back.wide * 0.8, front);
  g.check("no eye sign beside her facing him", noSign(front.sign), front.sign);
  // her sight starts from her face: round the place the cone is drawn from (the game's own table) the picture is
  // her face (skin, her eyes' white and dark), never the wall or the cone's yellow
  const lay = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout().cut.bartender.eyes),
    round = await colours(page, [-6, 0, 6].flatMap((dx) => [-6, 0, 6].map((dy) => [lay.x + dx, lay.y + dy]))),
    face = (c) => like(c, "#e7b48f", 14) || like(c, "#fffdf8", 14) || like(c, INK_HEX, 40);
  g.check("her sight starts from her face (round the cone's place, read from the game, is her face)", lay.x === E.x && lay.y === E.y && round.every(face) && round.some((c) => like(c, "#e7b48f", 14)), [lay, round]);
  s = await st(page);
  g.check("his paw waits out of sight while she faces him", s.snack.paw.y > 640, s.snack.paw);
  await still(page, "snack-06-she-faces-him");

  // ---------- LEAVE · bar, and the count ----------
  const leaveText = s.texts.find((t) => t.text === "LEAVE · bar"),
    L = CUT.leave;
  g.check("LEAVE · bar is drawn in its button, 14 px or more on a phone", !!leaveText && leaveText.x > L.x0 && leaveText.x < L.x1 && leaveText.y > L.y0 && leaveText.y < L.y1 && leaveText.css >= 14, leaveText);
  // measured on the page: the picture's real width on this phone
  const perGame = (await page.evaluate(() => document.querySelector("canvas").getBoundingClientRect().width)) / 960,
    leavePx = [(L.x1 - L.x0) * perGame, (L.y1 - L.y0) * perGame],
    cellPx = [CUT.cell.w * perGame, CUT.cell.h * perGame];
  g.check("LEAVE · bar is a 44 px target on a phone, both ways", leavePx[0] >= 44 && leavePx[1] >= 44, leavePx);
  g.check("each snack's own tap place is 44 px on a phone, both ways", cellPx[0] >= 44 && cellPx[1] >= 44, cellPx);
  g.check("LEAVE · bar covers no snack and the bag does not either", stack.SLOTS.every((_, i) => !(slotAt(i).x + CUT.cell.w / 2 > L.x0 && slotAt(i).y + CUT.cell.h / 2 > L.y0) && slotAt(i).x - CUT.cell.w / 2 >= CUT.bag.x1 - 14));
  const inBag = (t) => t.x > CUT.bag.x0 && t.x < CUT.bag.x1 && t.y > CUT.bag.y0 && t.y < 640;
  g.check("the bag shows a count, 0 to begin with", s.texts.some((t) => t.text === "0" && inBag(t) && t.css >= 14), s.texts);
  g.check("the close-up's only words are LEAVE · bar and the number", s.texts.every((t) => t.text === "LEAVE · bar" || /^\d+$/.test(t.text)), s.texts.map((t) => t.text));

  // ---------- a tap takes a snack ----------
  await backTurned(page);
  const stars0 = (await st(page)).stars;
  await tapSlot(page, 0);
  s = await st(page);
  g.check("a tap on a snack sends his paw for it (no drag)", !!s.snack.reach && s.snack.reach.slot === 0 && s.snack.held < 0);
  await run(page, BAR.reach * 0.8);
  sl = await sleeveSeen(page);
  g.check("his paw reaching: his arm is the orange sleeve all the way down, no fur below the cuff", sl.drawn && sl.mid >= 4 && sl.midOrange === sl.mid && sl.below.orange > 0 && sl.below.fur === 0, sl);
  await still(page, "snack-07a-paw-reaches-in-its-sleeve");
  await run(page, BAR.reach * 0.2 + 0.1);
  s = await st(page);
  g.check("his paw closes on it: the snack is out of the pile and in his paw", s.snack.held === 0 && s.snacks.slots[0] === -1 && Math.abs(s.snack.paw.y - slotAt(0).y) < 120, s.snack);
  await still(page, "snack-07-paw-takes-a-snack");
  sl = await sleeveSeen(page);
  g.check("his paw holding the snack: his arm is the orange sleeve all the way down, no fur below the cuff", sl.drawn && sl.mid >= 4 && sl.midOrange === sl.mid && sl.below.orange > 0 && sl.below.fur === 0, sl);
  g.check("the snack in his paw is drawn once (by his paw, between his palm and fingers)", (await heldDraws(page, FILL[stack.kindOf(s.snack.held)] || "#e5533d")) === 1);
  await runUntil(page, "(c, s) => s.bag === 1", 3);
  s = await st(page);
  g.check("it lands in the bag: the count is 1 and he has the stars", s.snacks.bag === 1 && s.stars === stars0 + SNACK_STARS && s.texts.some((t) => t.text === "1" && inBag(t)), [s.snacks.bag, s.stars - stars0]);
  await run(page, 0.05);
  s = await st(page);
  g.check("after his first snack he thinks \"Got one!\"", s.cur === "bub" && s.text === "Got one!", [s.cur, s.text]);
  g.check("the thought sits in the picture, over his paw at the bag", !!s.bubble && s.bubble.x >= 0 && s.bubble.x + s.bubble.w <= 960 && s.bubble.y >= 0 && s.bubble.x < 320, s.bubble);
  g.check("LEAVE · bar is still on screen with the thought up", s.texts.some((t) => t.text === "LEAVE · bar"));
  await still(page, "snack-08-got-one-and-leave");
  const frozen = (await st(page)).snack.t;
  await run(page, 1);
  g.check("the bar waits while the thought is up (nothing auto-advances)", (await st(page)).snack.t === frozen && (await st(page)).cur === "bub");
  await next(page);
  await run(page, 0.3);
  g.check("a tap sends the thought away", (await st(page)).cur !== "bub");
  hk = null;
  ck = await cutKinds(page);
  g.check("the close-up shows the pile without the snack he took", ck.join() === want((await st(page)).snacks.slots).join(), ck);

  // ---------- loose and pressed ----------
  // Loose snacks jiggle: the two cups under the taken cake now have nothing on them; the pies under them do.
  const tilt = async (i) => {
    // how the snack is drawn over half a second (its own place in the picture): a jiggling snack is drawn
    // differently from frame to frame, a pressed one the same every time
    const seen = new Set();
    for (let k = 0; k < 8; k++) {
      await run(page, 0.07);
      seen.add(
        await page.evaluate((at) => {
          const c = document.querySelector("canvas"),
            k = c.width / 960,
            d = c.getContext("2d").getImageData(Math.round((at.x - 36) * k), Math.round((at.y - 40) * k), Math.round(72 * k), Math.round(80 * k)).data;
          let h = 0;
          for (let i = 0; i < d.length; i += 4) h = (h * 31 + d[i] + d[i + 1] * 3 + d[i + 2] * 7) | 0;
          return h;
        }, slotAt(i)),
      );
    }
    return seen.size;
  };
  await backTurned(page, 3);
  const loose = await tilt(slot(2, 0)),
    pressed = await tilt(slot(0, 1));
  g.check("a loose snack jiggles; a snack that is stood on keeps still", loose > 1 && pressed === 1, { loose, pressed, snack: (await st(page)).snack, cur: (await st(page)).cur });
  // A squashed snack (two on it) is drawn flatter than the same kind with one on it: its top edge sits lower.
  const topOf = async (i) => {
    const pts = [];
    for (let dy = -60; dy <= -10; dy += 2) pts.push([slotAt(i).x, slotAt(i).y + dy]);
    const cs = await colours(page, pts);
    return -60 + 2 * cs.findIndex((c) => !like(c, WALL, 3) && !like(c, "#e3cfd9", 3));
  };
  const tops = { end: await topOf(slot(0, 0)), middle: await topOf(slot(0, 1)) };
  g.check("a snack with two on it is drawn squashed lower than one with one on it", tops.middle > tops.end, tops);
  await still(page, "snack-09-loose-and-pressed");

  // ---------- a second snack: no thought this time; then an edge pull settles ----------
  await backTurned(page);
  await tapSlot(page, slot(2, 0));
  await runUntil(page, "(c, s) => s.bag === 2", 3);
  await run(page, 0.3);
  s = await st(page);
  g.check("\"Got one!\" comes once: the second snack brings no thought", s.snacks.bag === 2 && s.cur !== "bub", [s.snacks.bag, s.cur, s.text]);
  await backTurned(page);
  // the end pie: one cup sits on it (the other cup of that row is gone, so the left end pie has none: use the right)
  const endPie = slot(1, 2);
  g.check("(the end pie has one snack on it)", stack.load((await st(page)).snacks.slots, endPie) === "pressed");
  await tapSlot(page, endPie);
  await runUntil(page, "(c) => c.slides.length > 0", 2);
  // first the cup hangs over the gap he made (the gap shows, the cup has not moved yet)
  await run(page, BAR.hang * 0.5);
  const up = slotAt(slot(2, 1)),
    down = slotAt(endPie),
    cupAt = async () => (await colours(page, [[up.x, up.y + 14], [(up.x + down.x) / 2, (up.y + down.y) / 2 + 14], [down.x, down.y + 14]])).map((c) => (like(c, FILL.cup, 10) ? "cup" : "-")).join("");
  const hanging = await cupAt();
  await runUntil(page, `(c) => c.slides[0] && c.slides[0].t >= ${BAR.settle * 0.45}`, 2);
  const sliding = await cupAt();
  s = await st(page);
  g.check("pulling a snack with one on it: that one slides down into the gap (a settle, no crash)", s.snack.slides.length === 1 && s.snack.fall < 0 && s.snacks.slots[endPie] >= 0 && stack.kindOf(s.snacks.slots[endPie]) === "cup" && stack.stands(s.snacks.slots), s.snack.slides);
  g.check("the settle is heard (\"bump\")", s.played.includes("bump"));
  // read from the picture at three places (its old place, half way, the gap): first up, then on its way, then down
  g.check("the slide is drawn: the cup hangs over the gap, then is on its way between the two places", hanging === "cup--" && sliding[1] === "c" && sliding !== hanging, [hanging, sliding]);
  await still(page, "snack-10-a-settle");
  await runUntil(page, "(c, s) => s.bag === 3 && c.slides.length === 0", 3);
  g.check("and it ends in the gap", (await cupAt()) === "--cup", await cupAt());
  ck = await cutKinds(page);
  g.check("after the settle the close-up shows the pile as the rule left it", ck.join() === want((await st(page)).snacks.slots).join(), ck);

  // ---------- the same pile in the hall ----------
  s = await st(page);
  g.check("the record for Day 2 so far: three taken, seven left, not every snack", s.record.bag === 3 && s.record.left === 7 && !s.record.all && !s.record.toppled && s.honor === "", s.record);
  await still(page, "snack-11-bag-with-a-count");
  await tap(page, CUT.close.x, CUT.close.y);
  await draw(page);
  s = await st(page);
  g.check("LEAVE · bar leaves: the close-up is gone and he can walk", !s.snack && s.ctrl && s.scene === "P6", [!!s.snack, s.ctrl, s.cur, s.text]);
  hk = await hallKinds(page);
  g.check("back in the hall the pyramid is the same pile: the same snacks gone, the slid cup in its new place", hk.join() === want(s.snacks.slots).join(), hk);
  await still(page, "snack-12-hall-bar-same-pile");
  await zoomStill(page, "snack-13-hall-pyramid-same-pile-enlarged", { x0: hall.PYRAMID.x - 60, y0: hall.PYRAMID.y - 70, x1: hall.PYRAMID.x + 60, y1: hall.PYRAMID.y + 20 }, 6);

  g.check("GRAB · snacks opens the close-up again, the pile as he left it", (await toBar(page)) >= 0 && (await cutKinds(page)).join() === want(s.snacks.slots).join());
  g.check("no page errors", errors.length === 0, errors);
  await page.close();
}

// ---------- the pull that brings it down ----------
{
  const { page, errors } = await open();
  // (the octopus is at his end of the bar by now or soon; in his first minute he starts nothing)
  await runUntil(page, '(c, s, p) => p.oct && p.oct.mode === "snacks"', 30);
  await toBar(page);
  await backTurned(page);
  await page.evaluate(() => (window.__ss.op.ch1PartyNow.ft = 61)); // past his first minute in the hall, when a piece can come off
  const middle = slot(0, 1);
  g.check("(the middle cup of the counter row has two snacks on it)", stack.load((await st(page)).snacks.slots, middle) === "squashed");
  const starsB = (await st(page)).stars;
  let s;
  await tapSlot(page, middle);
  await runUntil(page, "(c) => c.fall >= 0", 2);
  await run(page, BAR.fall * 0.5);
  s = await st(page);
  g.check("pulling a snack two stand on: the pile is going, still in the close-up for a moment", !!s.snack && s.snack.fall > 0 && !s.snacks.toppled, s.snack && s.snack.fall);
  await still(page, "snack-14-the-moment-before-the-crash");
  await runUntil(page, "(c) => !c", 2);
  s = await st(page);
  g.check("then the zoom pulls back and the hall's topple starts", !s.snack && s.snacks.toppled && s.snacks.chain >= 0 && s.ctrl, s.snacks);
  g.check("no stars for the pull that brought it down", s.stars === starsB, s.stars - starsB);
  // From here until everyone has stopped staring, or an alarm ends the free play (stood still with a piece off and
  // everyone staring, he is seen: the alarm comes 0.8 seconds after the cup), the octopus (two steps away,
  // past his first minute, Squatch standing free) starts nothing: no line stops the fall in mid-air. Every tick
  // is watched. (Without the hall's "one moment at a time" rule he notices on the first tick: seen failing so.)
  const watch = (until) =>
    page.evaluate(`(() => { const until = ${until}; const n = window.__ss.op, p = n.ch1PartyNow; let ticks = 0, spoke = 0, chased = 0;
      for (; ticks < 1200 && p.scene === "P6" && !until(p); ticks++) { window.__ss.tick(1 / 60); n.cur && n.cur.k === "bub" && spoke++; p.oct && p.oct.mode === "chase" && chased++; }
      const g = p.people["octopus-guest"];
      return { ticks, spoke, chased, near: Math.round(Math.hypot(n.sq.x - g.x, n.sq.y - g.y)), mode: p.oct.mode, ft: Math.round(p.ft), scene: p.scene }; })()`);
  await run(page, 0.6);
  await still(page, "snack-15-the-topple-in-the-hall");
  s = await st(page);
  g.check("(the octopus is at the snacks, within his noticing distance of Squatch, past the first minute)", s.oct === "snacks" && s.ctrl, s.oct);
  const q1 = await watch("(p) => (p.lostPieces || []).length === 1");
  await draw(page);
  s = await st(page);
  g.check("the flying cup knocks a piece of his disguise off, and everyone stares for 4 seconds", s.now.gone.length === 1 && s.now.stare > SNACK_LOOK_SECONDS - 2 && s.now.stare <= SNACK_LOOK_SECONDS, [s.now.gone, s.now.stare]);
  g.check("the crash is heard", s.played.includes("crash"));
  g.check("the record for Day 2 after the fall: toppled, not every snack", s.record.toppled && !s.record.all && s.honor === "", s.record);
  g.check("with the pile down GRAB · snacks is not offered", s.act !== "GRAB · snacks" && s.scene === "P6", [s.act, s.scene]);
  const q2 = await watch("(p) => p.snacks.chain >= 1 && !p.stare");
  g.check("while the pile falls and everyone stares, the octopus says nothing and starts no chase", q1.ticks > 10 && q2.ticks > 30 && q1.spoke + q2.spoke === 0 && q1.chased + q2.chased === 0 && q2.near < 150 && q2.ft > 60, [q1, q2]);
  g.check("no page errors in the fall", errors.length === 0, errors);
  await page.close();
}

// ---------- LEAVE · bar while his paw is busy ----------
{
  const { page, errors } = await open();
  await toBar(page);
  await backTurned(page);
  const stars0 = (await st(page)).stars;
  // his paw has the cake and is on its way to the bag: he leaves
  await tapSlot(page, 0);
  await runUntil(page, "(c) => c.held === 0", 2);
  await tap(page, CUT.close.x, CUT.close.y);
  await run(page, 0.1);
  let s = await st(page);
  g.check("the try-again card's \"snacks\" picture fills in from it (and no other)", card.found(s.now.done).got.snacks && !card.found(s.now.done).got.dance, s.now.done);
  g.check("LEAVE · bar with a snack in his paw: it goes in the bag and he gets its stars", !s.snack && s.snacks.bag === 1 && s.snacks.slots[0] === -1 && s.stars === stars0 + SNACK_STARS && s.now.done.snacks === true, [s.snacks.bag, s.stars - stars0, s.now.done]);
  // his paw is only reaching: he leaves, and nothing was taken
  await toBar(page);
  await backTurned(page);
  await tapSlot(page, 1);
  await run(page, BAR.reach * 0.4);
  await tap(page, CUT.close.x, CUT.close.y);
  await run(page, 0.1);
  s = await st(page);
  g.check("LEAVE · bar while his paw is still reaching: nothing is taken, nothing is paid", !s.snack && s.snacks.bag === 1 && s.snacks.slots[1] === 1 && s.stars === stars0 + SNACK_STARS, [s.snacks.bag, s.snacks.slots, s.stars - stars0]);
  g.check("no page errors leaving mid-reach", errors.length === 0, errors);
  await page.close();
}

// ---------- her two catches, unchanged ----------
{
  const { page, errors } = await open();
  await toBar(page);
  // tapped just as she starts to turn: his paw is home again before she faces him
  await runUntil(page, '(c) => c.phase === "glance"', 12);
  await tapSlot(page, 0);
  await runUntil(page, "(c, s) => s.bag === 1", 3);
  await next(page); // "Got one!" (the bar waits while it is up)
  await runUntil(page, '(c) => c.phase === "back"', 6);
  let s = await st(page);
  g.check("a snack tapped the moment she starts to turn is still safe: she faced him and saw nothing", s.snack.catches === 0 && s.snacks.bag === 1 && s.snack.back === 1, [s.snack.catches, s.snacks.bag, s.snack.back]);
  // tapped while she faces him: caught
  await runUntil(page, `(c) => c.phase === "face" && c.t > 0.3`, 12);
  await tapSlot(page, 1);
  await run(page, BAR.seen + 0.1);
  s = await st(page);
  g.check("his paw out while she faces him: \"...Nice gloves.\"", s.cur === "bub" && s.text === "...Nice gloves." && s.snack.catches === 1, [s.cur, s.text]);
  g.check("she still faces him while she says it", s.snack.phase === "face");
  g.check("he did not get that snack (his paw never reached it)", s.snacks.bag === 1 && s.snacks.slots[1] === 1);
  await still(page, "snack-16-caught-nice-gloves");
  await next(page);
  await runUntil(page, '(c) => c.phase === "back"', 6);
  g.check("after a catch she turns back to her shelf", (await st(page)).snack.phase === "back");
  await runUntil(page, '(c) => c.phase === "face" && c.t > 0.3', 14);
  await tapSlot(page, 1);
  await run(page, BAR.seen + 0.1);
  s = await st(page);
  g.check("the second time: \"Wait a second... fur!\"", s.cur === "bub" && s.text === "Wait a second... fur!", [s.cur, s.text, s.snack, s.scene]);
  await next(page);
  await runUntil(page, '(c, s, p) => p.scene === "P7"', 4);
  s = await st(page);
  g.check("and she runs to the alarm (P7), the close-up closed", s.scene === "P7" && !s.snack && !!s.now.alarm, [s.scene, !!s.snack]);
  g.check("no page errors in the catches", errors.length === 0, errors);
  await page.close();
}

// ---------- closed from outside with a snack in his paw ----------
{
  // The rule on its own (no browser): whatever closes the close-up from outside (an alarm, closing time, the
  // photo) goes through snackShut, which bags the snack in his paw and pays it in the same call.
  let stars = 0,
    ctrl = null;
  const p = { scene: "P6", done: {} },
    h = { E: () => ({ addStars: (n) => (stars += n), sfx() {}, queue() {} }), sound: { one() {} }, control: (v) => (ctrl = v), say: () => null, P: () => p, sq: () => ({ x: 0, y: 0 }) };
  mod.openSnacks(p);
  for (let i = 0; i < 600 && p.snack.zoom < 1; i++) mod.tickSnacks(p, 1 / 60);
  mod.snackPointer(p, "down", slotAt(0).x, slotAt(0).y);
  for (let i = 0; i < 120 && p.snack.held < 0; i++) mod.tickSnacks(p, 1 / 60);
  const held = p.snack.held;
  play.snackShut(p, h);
  g.check("closed from outside with a snack in his paw: it is in the bag and its 5 stars are paid at once", held === 0 && !p.snack && p.snacks.bag === 1 && stars === SNACK_STARS && p.done.snacks === true && ctrl === true, [held, stars, p.snacks.bag]);
  play.snackShut(p, h);
  g.check("and never paid twice", stars === SNACK_STARS, stars);
}
{
  // In the game: the first song ends while his paw carries a snack. The close-up closes for the group photo and
  // the snack is paid, on that same frame.
  const { page, errors } = await open();
  await toBar(page);
  const stars0 = (await st(page)).stars;
  // her back is turned as the song ends (her rhythm is fixed from the moment the close-up opens)
  await runUntil(page, `(c, s, p) => p.songT >= ${free.SONG_SECONDS} - ${BAR.reach + BAR.carry / 2}`, 80);
  let s = await st(page);
  g.check("(her back is turned, so this is no catch)", s.snack && s.snack.phase === "back" && s.snack.catches === 0, s.snack && [s.snack.phase, s.snack.t]);
  await tapSlot(page, 0);
  const shut = await page.evaluate(() => {
    const n = window.__ss.op,
      p = n.ch1PartyNow;
    let held = -1,
      i = 0;
    for (; i < 240 && p.snack; i++) ((held = p.snack.held), window.__ss.tick(1 / 60));
    return { held, i, stars: n.stars || 0, bag: p.snacks.bag, done: !!p.done.snacks };
  });
  g.check("the song ends with a snack in his paw: the close-up closes, the snack is in the bag and paid on that frame", shut.held === 0 && shut.i < 240 && shut.bag === 1 && shut.stars === stars0 + SNACK_STARS && shut.done, shut);
  await run(page, 1);
  s = await st(page);
  g.check("and it is paid once (the group photo moment has begun)", s.stars === stars0 + SNACK_STARS && !!s.now.shot, [s.stars - stars0, !!s.now.shot]);
  g.check("no page errors", errors.length === 0, errors);
  await page.close();
}

// ---------- every snack: the honor and the record ----------
{
  const { page, errors } = await open();
  await toBar(page);
  const stars0 = (await st(page)).stars;
  for (let i = 0; i < stack.SNACK_COUNT; i++) {
    await backTurned(page);
    await tapSlot(page, i);
    await runUntil(page, `(c, s) => s.bag === ${i + 1}`, 3);
    await run(page, 0.1);
    (await st(page)).cur === "bub" && (await next(page));
  }
  let s = await st(page);
  g.check("from the top down, with her back turned, he takes all ten: no crash, no catch", s.snacks.bag === 10 && !s.snacks.toppled && s.snack.catches === 0 && stack.snacksLeft(s.snacks.slots) === 0, s.snacks);
  g.check("each of the ten is stars, and nothing more for taking them all", s.stars === stars0 + 10 * SNACK_STARS, s.stars - stars0);
  g.check("the bag's count is 10, and LEAVE · bar is still there", s.texts.some((t) => t.text === "10") && s.texts.some((t) => t.text === "LEAVE · bar"));
  g.check("the record for Day 2: every snack taken, none left", s.record.all && s.record.left === 0 && s.record.bag === 10 && !s.record.toppled, s.record);
  await still(page, "snack-17-every-snack-taken");
  await tap(page, CUT.close.x, CUT.close.y);
  await atBar(page);
  s = await st(page);
  g.check("after LEAVE · bar the bar is empty and GRAB · snacks is not offered again", !s.snack && s.ctrl && s.act !== "GRAB · snacks" && (await hallKinds(page)).every((k) => k === ""), s.act);
  // The end of Chapter 1: the tally reads the party's record. The party is over by then: its state is the record
  // the ending keeps (party.js finish), set here as the ending sets it.
  const tally = await page.evaluate(() => {
    const n = window.__ss.op,
      b = window.SSQ.beat("ch1-party");
    n.ch1PartyNow = { scene: "done", outfit: n.ch1PartyNow.outfit, snacks: b.snackRecord() };
    const stars = n.stars,
      lines = window.__ss.chTally();
    n.cur = { k: "panel", id: "tally" };
    window.__texts.length = 0;
    window.__ss.drawFrame();
    return { lines, stars, after: n.stars, record: b.snackRecord(), drawn: window.__texts.slice() };
  });
  g.check("the Chapter 1 tally shows \"Snack Bandit: took every snack at the party.\"", tally.lines.includes("Snack Bandit: took every snack at the party."), tally.lines);
  g.check("the honor gives no points", tally.after === tally.stars && tally.lines[tally.lines.length - 1].endsWith(String(tally.stars)), [tally.stars, tally.after]);
  g.check("the record still reads after the party is over", tally.record.all && tally.record.left === 0, tally.record);
  const rows = tally.drawn.filter((t) => tally.lines.some((l) => l.startsWith(t.text.slice(0, 12))) || /Chapter score/.test(t.text));
  g.check("every tally row is drawn on the card (the last one too), the honor among them", tally.drawn.some((t) => t.text.startsWith("Snack Bandit")) && tally.drawn.every((t) => t.y > 20 && t.y < 625), tally.drawn.map((t) => [t.text.slice(0, 16), Math.round(t.y)]));
  g.check("(the tally's rows were read)", rows.length >= 6, rows.length);
  await still(page, "snack-18-snack-bandit-on-the-tally");
  g.check("no page errors taking every snack", errors.length === 0, errors);
  await page.close();
}
{
  // Not every snack: no honor line.
  const { page } = await open();
  await toBar(page);
  await backTurned(page);
  await tapSlot(page, 0);
  await runUntil(page, "(c, s) => s.bag === 1", 3);
  const lines = await page.evaluate(() => window.__ss.chTally());
  g.check("no \"Snack Bandit\" line unless he took every snack", !lines.some((l) => /Snack Bandit/.test(l)), lines);
  g.check("with sound off the snack bar made no sound", (await st(page)).osc === 0, (await st(page)).osc);
  await page.close();
}
await g.finish("party-snacks");
