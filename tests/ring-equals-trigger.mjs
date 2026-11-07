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
 * It also checks that no hand-typed ring box is left for a hotspot in the source: every ring is drawn
 * from a spot. oV (the old box glow) is left only for the picture button and for story pointers, the
 * glow around a thing a line talks about while no action there is possible (pointer in 00-core.js).
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";
import { sourceFiles } from "../tools/build.mjs";

const g = await startGame({ port: 8792, name: "ring-equals-trigger" });

// No hand-typed ring boxes for hotspots.
{
  const src = sourceFiles().slice(1).map((f) => readFileSync(f, "utf8")).join("");
  const boxes = [...src.matchAll(/\boV\(([^)]*)\)/g)].map((m) => m[0]).filter((c) => !c.startsWith("oV(l, o, i, s, q"));
  g.check(
    "oV is called only by pointer and for the picture button (no hand-typed hotspot rings)",
    boxes.length === 2 && boxes.includes("oV(c - 74, 60, 66, 66, 30)") && boxes.includes("oV(o, i, s, q, d)"),
    boxes,
  );
  g.check("no ring is drawn from n.pulse with a typed box", !/pulse\.has\([^)]*\)\s*&&\s*oV\(/.test(src));
}

// States: [chapter, label, setup run in the page]. Setup may write anything; this test checks geometry.
const STATES = [];
const ch2 = (label, steps) => STATES.push([2, label, { kind: "ch2", steps }]);
for (const ph of ["g1", "back", "g2", "wash1", "g3hide", "g4", "g4k", "wash5", "g6", "g6d"])
  ch2(ph, [["set", { jar: 30, has: "", done: ph === "wash5" ? 3 : 0, held: -1, greasy: false }], ["reset", ph]]);
ch2("wash1 holding a dish", [["set", { done: 0, held: 1 }], ["reset", "wash1"], ["set", { held: 1 }]]);
ch2("g4 with coins", [["set", { jar: 0, has: "coins" }], ["reset", "g4"]]);
ch2("g4 with soup", [["set", { jar: 0, has: "soup" }], ["reset", "g4"]]);
ch2("g4k with soup", [["set", { has: "soup" }], ["reset", "g4k"]]);
ch2("g4k out front", [["set", { has: "soup" }], ["reset", "g4k"], ["op", { room: "diner" }]]);
ch2("the greasy pot", [["set", { done: 5, held: 6, greasy: true }], ["reset", "wash5"], ["set", { greasy: true }], ["swap", true]]);
ch2("g6d with coins", [["set", { jar: 0, has: "coins" }], ["call", "sceneG6"], ["set", { has: "coins", jar: 0 }]]);
ch2("g6 Mops with coins", [["set", { jar: 0, has: "coins" }], ["call", "g6Out"], ["swap", true], ["set", { has: "coins" }]]);
ch2("g1door", [["reset", "g1"], ["set", { phase: "g1door" }], ["swap", true]]);

const ch3 = (label, room, phase, mops, extra = {}) => STATES.push([3, label, { kind: "ch3", room, phase, mops, extra }]);
ch3("pad p1", "pad", "p1", false);
ch3("pad p2 (Mops)", "pad", "p2", true);
ch3("temple p3 (Squatch)", "temple", "p3", false);
ch3("temple p3 (Mops)", "temple", "p3", true);
ch3("temple p3, first mirror turned", "temple", "p3", true, { m1: true });
ch3("temple p3x", "temple", "p3x", true);
ch3("pad p4a", "pad", "p4a", false);
ch3("pad p4b", "pad", "p4b", false);
ch3("pad p4b, rope held", "pad", "p4b", false, { rope: "held" });

// Chapter 1: [scene function, then fields to set]. Fields: op (story state), ch (Chapter 1 flags), s4, s5, hall, swap, trip.
const ch1 = (label, call, set = {}) => STATES.push([1, label, { kind: "ch1", call, set }]);
ch1("O5 bed", "sceneO5");
ch1("O7 tv", "sceneO7");
ch1("S1 lunch on the shelf", "sceneS1", { op: { scene: "S1", room: "closet", lunch: "shelf" } });
ch1("S1 lunch held", "sceneS1", { op: { scene: "S1", room: "closet", lunch: "held" } });
ch1("S1L deck", "sceneS1L", { op: { scene: "S1L", room: "deck", sqPose: "stand" } });
ch1("S2 gallery", "sceneS2", { op: { scene: "S2", room: "hall" } });
ch1("S4 crate", "sceneS4", { op: { scene: "S4", room: "hall", sqPose: "stand" }, s4: { inCrate: false, botsOut: false } });
ch1("S5 window, brochure out", "sceneS5", { op: { scene: "S5", room: "window", sqPose: "stand" }, s5bro: { inBin: false } });
ch1("S5 window, brochure in the bin", "sceneS5", { op: { scene: "S5", room: "window", sqPose: "stand" }, s5bro: { inBin: true }, s5: { grabbed: false } });
ch1("S6 hall", "sceneS6", { op: { scene: "S6", room: "hall", sqPose: "stand" }, halves: true });
ch1("S7 terminal", "sceneS6", { op: { scene: "S7", room: "hall", sqPose: "stand" } });
ch1("S9 Squatch", "sceneS9", { op: { scene: "S9", room: "hall", sqPose: "stand", egg: null }, swap: false });
ch1("S9 Mops", "sceneS9", { op: { scene: "S9", room: "hall" }, ch: { got1: false }, swap: true });
ch1("S10 vent (Mops)", "sceneS10", { op: { scene: "S10", room: "hall" }, swap: true });
ch1("S10 vent (Squatch)", "sceneS10", { op: { scene: "S10", room: "hall", sqPose: "stand" }, swap: false });
ch1("S10d duct", "sceneS10", { op: { scene: "S10d", room: "duct" }, ch: { notesBall: true, got2: false }, swap: true });
ch1("S10d duct, half found", "sceneS10", { op: { scene: "S10d", room: "duct" }, ch: { notesBall: false, got2: true }, swap: true });
ch1("S11 lure (Squatch)", "sceneS11", { op: { scene: "S11", room: "hall", sqPose: "stand" }, ch: { doorOpen: false }, swap: false });
ch1("S11 keypad (Mops)", "sceneS11", { op: { scene: "S11", room: "hall" }, ch: { doorOpen: false }, swap: true });
ch1("S11 door open", "sceneS11", { op: { scene: "S11", room: "hall", sqPose: "stand" }, ch: { doorOpen: true, mopsHint: true, costume: false }, swap: false });
ch1("S12 hangar", "sceneS12", { op: { scene: "S12", room: "hangar", sqPose: "stand" }, ch: { coolers: [false, false, false], tarp: true, crates: true }, trip: 0 });
ch1("S12 hangar, all snacks", "sceneS12", { op: { scene: "S12", room: "hangar", sqPose: "stand" }, ch: { coolers: [true, true, true], tarp: false, nachos: false, crates: false, icecream: false }, trip: 3 });

const ch4 = (label, room, phase, mops, extra = {}, found = []) => STATES.push([4, label, { kind: "ch4", room, phase, mops, extra, found }]);
ch4("port m1", "port", "m1", false);
ch4("stand m2", "stand", "m2", true);
ch4("stand m2, poster read", "stand", "m2", true, {}, ["poster4"]);
ch4("van m3", "van", "m3", true);
ch4("van m3, floor mopped", "van", "m3", true, { scrub: 3 });
ch4("inside m4a", "inside", "m4a", false);
ch4("inside m4b", "inside", "m4b", false);
ch4("van m4v", "van", "m4v", false);

const { ctx, page, errors } = await g.open("?ch=2");
const seen = new Set();
const perChapter = { 1: 0, 2: 0, 3: 0, 4: 0 };
for (const [chapter, label, setup] of STATES) {
  const result = await page.evaluate((setup) => {
    const ss = window.__ss, n = ss.op;
    const clear = () => { n.q = []; n.cur = null; n.live = []; n.ctrl = true; };
    if (setup.kind === "ch2") {
      if (!String(n.scene || "").startsWith("G")) ss.sceneG0();
      clear();
      for (const st of setup.steps) {
        if (st[0] === "reset") ss.resetTo(st[1]);
        else if (st[0] === "set") Object.assign(ss.ch2, st[1]);
        else if (st[0] === "op") Object.assign(n, st[1]);
        else if (st[0] === "swap") ss.swapTo(st[1]);
        else if (st[0] === "call") ss[st[1]]();
      }
      ss.ch2.timer = 99; ss.ch2.peekT = 99; ss.ch2.sec = null;
    } else if (setup.kind === "ch1") {
      ss.startOpening(); ss[setup.call](); ss.drain(); clear();
      const t = setup.set;
      if (t.swap !== undefined) ss.swapTo(t.swap);
      Object.assign(n, t.op || {});
      Object.assign(ss.ch, t.ch || {});
      t.s4 && Object.assign(ss.s4, t.s4);
      t.s5 && Object.assign(ss.s5, t.s5);
      t.s5bro && Object.assign(ss.s5.bro, t.s5bro);
      t.trip !== undefined && ss.setTrip(t.trip);
      if (t.halves) for (const h of ss.hall.halves || []) h && (h.on = true);
    } else if (setup.kind === "ch3") {
      ss.sceneP0(); ss.drain(); clear();
      Object.assign(ss.ch3, { phase: setup.phase, rov: [] }, setup.extra);
      n.room = setup.room; n.sqPose = "stand"; ss.ch.spot = -1; ss.swapTo(setup.mops);
    } else if (setup.kind === "ch4") {
      ss.sceneM0(); ss.drain(); clear();
      Object.assign(ss.ch4, { phase: setup.phase, bot: null }, setup.extra);
      for (const f of setup.found) n.found.add(f);
      n.room = setup.room; n.sqPose = "stand"; ss.ch.spot = -1; ss.swapTo(setup.mops);
    }
    clear();
    // Every usable spot with a place glows, then one frame is drawn.
    const usable = ss.spotsNow().filter((e) => e && e.when !== false && (e.r > 0 || e.box));
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
  }, setup);
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
