/**
 * The glowing ring is drawn exactly where the action works (task T17).
 *   node tests/ring-equals-trigger.mjs
 *
 * In many states across all four chapters, every spot that can be used is made to glow, one frame is
 * drawn, and for every ring that frame drew:
 *   - standing at the ring's center offers that spot's action, and
 *   - standing 20 pixels outside the ring (8 directions, on the floor) does not.
 * Where two spots overlap, the one the picker tries first wins (as it always has). If that covers a
 * ring's center, the test instead finds a point inside the ring where its own action is offered, and
 * lists the overlap.
 * Every spot's place (center and radius, or box) in every state must match the committed snapshot
 * tests/data/ranges.json, so a changed range fails here. A spot whose center follows someone who moves
 * (Mops swaying in S2, the brochure) is marked "moves" there and only its size is compared.
 * After a deliberate range change, regenerate it with: UPDATE_RANGES=1 node tests/ring-equals-trigger.mjs
 * It also checks that no hand-typed ring box is left for a hotspot in the source: every ring is drawn
 * from a spot. oV (the old box glow) is left only for story pointers, the
 * glow around a thing a line talks about while no action there is possible (pointer in 00-core.js).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { root, sleep } from "./game-page.mjs";
import { startGame } from "./game-page.mjs";
import { sourceFiles } from "../tools/build.mjs";
import { STATES, setState } from "./chapter-states.mjs";

const g = await startGame({ port: 8792, name: "ring-equals-trigger" });

// No hand-typed ring boxes for hotspots.
{
  const src = sourceFiles().slice(1).map((f) => readFileSync(f, "utf8")).join("");
  const boxes = [...src.matchAll(/\boV\(([^)]*)\)/g)].map((m) => m[0]).filter((c) => !c.startsWith("oV(l, o, i, s, q"));
  g.check(
    "oV is called only by pointer (no hand-typed hotspot rings; the picture button is page text since Phase 3)",
    boxes.length === 1 && boxes.includes("oV(o, i, s, q, d)"),
    boxes,
  );
  g.check("no ring is drawn from n.pulse with a typed box", !/pulse\.has\([^)]*\)\s*&&\s*oV\(/.test(src));
}

const { ctx, page, errors } = await g.open("?ch=2");

// Ranges: every spot's place in every state, compared with the committed snapshot.
const RANGES = join(root, "tests", "data", "ranges.json");
const readRanges = (setup) =>
  page.evaluate(
    (setStateSrc, setup) => {
      (0, eval)("(" + setStateSrc + ")")(setup);
      const r = (v) => (typeof v === "number" ? Math.round(v * 100) / 100 : v);
      return window.__ss.spotsNow().filter(Boolean).map((e) => ({
        id: e.id, verb: e.verb || "", who: e.who || "",
        ...(e.box ? { box: { x0: r(e.box.x0), x1: r(e.box.x1), y0: r(e.box.y0), y1: r(e.box.y1) } } : e.r > 0 ? { x: r(e.x), y: r(e.y), r: e.r } : { anywhere: true }),
        ...(e.not ? { not: { x: r(e.not.x), y: r(e.not.y), r: e.not.r } } : {}),
      }));
    },
    setState.toString(),
    setup,
  );
if (process.env.UPDATE_RANGES) {
  // Three looks at each state, a moment apart: a center that differs follows someone who moves.
  const snap = {};
  for (const pass of [0, 1, 2]) {
    for (const [chapter, label, setup] of STATES) {
      const key = `ch${chapter} ${label}`;
      const now = await readRanges(setup);
      if (!snap[key]) snap[key] = now;
      else
        snap[key].forEach((s, i) => {
          const o = now[i];
          if (o && s.x !== undefined && (o.x !== s.x || o.y !== s.y)) (s.moves = true), delete s.x, delete s.y;
        });
    }
    await sleep(pass === 0 ? 700 : 2600);
  }
  mkdirSync(join(root, "tests", "data"), { recursive: true });
  writeFileSync(RANGES, JSON.stringify(snap, null, 1) + "\n");
  console.log(`wrote ${RANGES}`);
}
{
  const snap = JSON.parse(readFileSync(RANGES, "utf8"));
  let spots = 0;
  for (const [chapter, label, setup] of STATES) {
    const key = `ch${chapter} ${label}`;
    const want = snap[key];
    const now = await readRanges(setup);
    if (!want) {
      g.check(`${key}: the state is in tests/data/ranges.json`, false, "regenerate with UPDATE_RANGES=1");
      continue;
    }
    const strip = (s) => (s.moves ? { ...s, x: undefined, y: undefined, moves: undefined } : s);
    const diffs = [];
    if (now.length !== want.length) diffs.push(`${want.length} spots in the snapshot, ${now.length} now`);
    want.forEach((w, i) => {
      const o = now[i];
      const cmp = w.moves && o ? { ...o, x: undefined, y: undefined, moves: undefined } : o;
      if (JSON.stringify(cmp) !== JSON.stringify(strip(w))) diffs.push({ snapshot: w, now: o });
    });
    spots += want.length;
    g.check(`${key}: every spot's place matches tests/data/ranges.json`, diffs.length === 0, diffs);
  }
  g.check(`the ranges snapshot covers every state (${STATES.length} states, ${spots} spots)`, Object.keys(snap).length === STATES.length, Object.keys(snap).length);
}
const seen = new Set();
const perChapter = { 1: 0, 2: 0, 3: 0, 4: 0 };
for (const [chapter, label, setup] of STATES) {
  // The state is set and checked in one go, so no frame runs in between.
  const result = await page.evaluate((setStateSrc, setup) => {
    (0, eval)("(" + setStateSrc + ")")(setup);
    const ss = window.__ss, n = ss.op;
    // Every usable spot with a place glows, then one frame is drawn.
    const usable = ss.placedSpots();
    for (const e of usable) n.pulse.add(e.id);
    ss.drawFrame();
    const rings = ss.rings();
    const out = { usable: usable.map((e) => e.id + ":" + (e.verb || "walk in")), rings: [], scene: n.scene, room: n.room };
    const feetOf = (who) => (who === "sq" ? n.sq : who === "mo" ? n.mo : ss.ch.mops ? n.mo : n.sq);
    const b = ss.walkBounds();
    for (const ring of rings) {
      const spotNow = usable.find((e) => e.id === ring.id && (ring.box ? e.box && e.box.x0 === ring.box.x0 : e.x === ring.x && e.y === ring.y && e.r === ring.r));
      const feet = feetOf(ring.who);
      const keep = { x: feet.x, y: feet.y };
      const offeredAt = (x, y) => {
        feet.x = x; feet.y = y;
        const a = ss.offerNow();
        return a && a.spot ? a.spot.id + ":" + a.verb : "";
      };
      const want = spotNow ? spotNow.id + ":" + (spotNow.verb || "walk in") : ring.id + ":?";
      // A place to walk into (no verb, such as the scanner gate) is checked with the same test the game uses.
      if (spotNow && !spotNow.verb) {
        const inAt = (x, y) => { feet.x = x; feet.y = y; return ss.inSpot(spotNow); };
        const okIn = inAt(ring.x, ring.y);
        const bad = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => [ring.x + Math.cos((k * Math.PI) / 4) * (ring.r + 20), ring.y + Math.sin((k * Math.PI) / 4) * (ring.r + 20)]).filter(([x, y]) => inAt(x, y));
        feet.x = keep.x; feet.y = keep.y;
        out.rings.push({ id: ring.id, want, atCenter: okIn ? want : "", outsideChecked: 8, outsideBad: bad.map(String), matched: true });
        continue;
      }
      const c = ring.box ? { x: (ring.box.x0 + ring.box.x1) / 2, y: (ring.box.y0 + ring.box.y1) / 2 } : { x: ring.x, y: ring.y };
      let atCenter = offeredAt(c.x, c.y),
        overlap = "";
      if (atCenter !== want && atCenter) {
        // Another spot the picker tries first covers the center. Look for a point inside this ring where it wins.
        overlap = atCenter;
        const r = ring.box ? Math.max(ring.box.x1 - ring.box.x0, ring.box.y1 - ring.box.y0) / 2 : ring.r;
        search: for (let d = 4; d < r; d += 6)
          for (let k = 0; k < 16; k++) {
            const x = c.x + Math.cos((k * Math.PI) / 8) * d, y = c.y + Math.sin((k * Math.PI) / 8) * d;
            if (ring.box ? x <= ring.box.x0 || x >= ring.box.x1 || y <= ring.box.y0 || y >= ring.box.y1 : Math.hypot(x - ring.x, y - ring.y) >= ring.r) continue;
            if (offeredAt(x, y) === want) {
              atCenter = want;
              break search;
            }
          }
      }
      const outside = [];
      for (let k = 0; k < 8; k++) {
        const ang = (k * Math.PI) / 4;
        let x, y;
        if (ring.box) {
          x = Math.cos(ang) > 0.1 ? ring.box.x1 + 20 : Math.cos(ang) < -0.1 ? ring.box.x0 - 20 : c.x;
          y = Math.sin(ang) > 0.1 ? ring.box.y1 + 20 : Math.sin(ang) < -0.1 ? ring.box.y0 - 20 : c.y;
        } else {
          x = ring.x + Math.cos(ang) * (ring.r + 20);
          y = ring.y + Math.sin(ang) * (ring.r + 20);
        }
        if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) continue;
        const got = offeredAt(x, y);
        outside.push(got === want ? "OFFERED at " + Math.round(x) + "," + Math.round(y) : "");
      }
      feet.x = keep.x; feet.y = keep.y;
      out.rings.push({ id: ring.id, want, atCenter, overlap, outsideChecked: outside.length, outsideBad: outside.filter(Boolean), matched: !!spotNow });
    }
    return out;
  }, setState.toString(), setup);
  perChapter[chapter] += result.rings.length;
  for (const r of result.rings) {
    seen.add(`${chapter}:${r.want}`);
    g.check(`ch${chapter} ${label}: ring ${r.id} is drawn from a usable spot`, r.matched, r);
    g.check(
      `ch${chapter} ${label}: ring ${r.id}: the action (${r.want}) is offered at its center${r.overlap ? ` (overlap: ${r.overlap} wins at the center; offered elsewhere inside)` : ""}`,
      r.atCenter === r.want,
      r,
    );
    g.check(`ch${chapter} ${label}: ring ${r.id}: not offered 20 px outside (${r.outsideChecked} points)`, r.outsideBad.length === 0, r.outsideBad);
  }
  const unringed = result.usable.filter((u) => !result.rings.some((r) => r.want === u));
  g.check(`ch${chapter} ${label}: every usable spot with a place drew its ring`, unringed.length === 0, { unringed, usable: result.usable });
}
for (const ch of [1, 2, 3, 4]) g.check(`chapter ${ch}: rings checked (${perChapter[ch]})`, perChapter[ch] >= 5, perChapter);
g.check("the kitchen dish rack ring (rail) now draws", seen.has("2:rail:GRAB"), [...seen]);
console.log(`  spots checked: ${[...seen].sort().join(", ")}`);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ring-equals-trigger");
