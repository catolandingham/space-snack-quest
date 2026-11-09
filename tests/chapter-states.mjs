/**
 * States across all four chapters for tests that look at what the game offers where (not a suite;
 * run-all.mjs skips it). Used by tests/ring-equals-trigger.mjs and tests/action-labels.mjs.
 *   STATES: [chapter, label, setup]
 *   setState: runs in the page (page.evaluate(setState, setup)); puts the game in that state with no
 *   bubble up and the player in control. Setup may write anything: these tests check geometry and words.
 */
export const STATES = [];
const ch2 = (label, steps) => STATES.push([2, label, { kind: "ch2", steps }]);
for (const ph of ["g1", "back", "g2", "wash1", "g3hide", "g4", "g4k", "wash5", "g6", "g6d"])
  ch2(ph, [["set", { jar: 30, has: "", done: ph === "wash5" ? 3 : 0, held: -1, greasy: false, fuel: ph === "g6" || ph === "g6d" }], ["reset", ph]]);
ch2("wash1 holding a dish", [["set", { done: 0, held: 1 }], ["reset", "wash1"], ["set", { held: 1 }]]);
ch2("g4 with coins", [["set", { jar: 0, has: "coins" }], ["reset", "g4"]]);
ch2("g4 with soup", [["set", { jar: 0, has: "soup" }], ["reset", "g4"]]);
ch2("g4k with soup", [["set", { has: "soup" }], ["reset", "g4k"]]);
ch2("g4k out front", [["set", { has: "soup" }], ["reset", "g4k"], ["op", { room: "diner" }]]);
ch2("the greasy pot", [["set", { done: 5, held: 6, greasy: true }], ["reset", "wash5"], ["set", { greasy: true }], ["swap", true]]);
ch2("g6d with coins", [["set", { jar: 0, has: "coins" }], ["call", "sceneG6"], ["set", { has: "coins", jar: 0 }]]);
ch2("g6 Mops with coins", [["set", { jar: 0, has: "coins" }], ["call", "g6Out"], ["swap", true], ["set", { has: "coins" }]]);
ch2("g1door", [["reset", "g1"], ["set", { phase: "g1door" }], ["swap", true]]);

const ch3 = (label, room, phase, mops, extra = {}, pose = null) => STATES.push([3, label, { kind: "ch3", room, phase, mops, extra, pose }]);
ch3("pad p1", "pad", "p1", false);
ch3("pad p2 (Mops)", "pad", "p2", true);
ch3("temple p3 (Squatch)", "temple", "p3", false);
ch3("temple p3 (Mops)", "temple", "p3", true);
ch3("temple p3, first mirror turned", "temple", "p3", true, { m1: true });
ch3("temple p3x", "temple", "p3x", true);
ch3("pad p4a", "pad", "p4a", false);
ch3("pad p4b", "pad", "p4b", false);
ch3("pad p4b, rope held", "pad", "p4b", false, { rope: "held" });
ch3("pad p4a, in the barrel", "pad", "p4a", false, {}, { sqPose: "hidden", spot: 70, sing: false });
ch3("pad p4a, singing", "pad", "p4a", false, {}, { sqPose: "hidden", spot: 70, sing: true });
ch3("temple p3, in the echo spot", "temple", "p3", false, {}, { sqPose: "hidden", spot: 71, sing: false });

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
ch1("O4 lobby", "sceneO4", { op: { scene: "O4", room: "lobby" } });
ch1("S1L hidden", "sceneS1L", { op: { scene: "S1L", room: "deck", sqPose: "hidden" } });
ch1("S4 in the crate", "sceneS4", { op: { scene: "S4", room: "hall", sqPose: "hidden" }, s4: { inCrate: true } });
ch1("S4 in the crate, pie found", "sceneS4", { op: { scene: "S4", room: "hall", sqPose: "hidden" }, s4: { inCrate: true }, found: ["pie500"] });
ch1("S6 plaque and poster found", "sceneS6", { op: { scene: "S6", room: "hall", sqPose: "stand" }, found: ["plaque", "wanted"], halves: true });
ch1("S6 hidden", "sceneS6", { op: { scene: "S6", room: "hall", sqPose: "hidden" } });
ch1("S7b sign", "sceneS6", { op: { scene: "S7b", room: "hall", sqPose: "stand" } });
ch1("S9 in the box", "sceneS9", { op: { scene: "S9", room: "hall", sqPose: "hidden" }, ch: { sing: false }, swap: false });
ch1("S9 singing", "sceneS9", { op: { scene: "S9", room: "hall", sqPose: "hidden" }, ch: { sing: true }, swap: false });
ch1("S12 hangar, all snacks", "sceneS12", { op: { scene: "S12", room: "hangar", sqPose: "stand" }, ch: { coolers: [true, true, true], tarp: false, nachos: false, crates: false, icecream: false }, trip: 3 });

const ch4 = (label, room, phase, mops, extra = {}, found = [], pose = null) => STATES.push([4, label, { kind: "ch4", room, phase, mops, extra, found, pose }]);
ch4("port m1", "port", "m1", false);
ch4("stand m2", "stand", "m2", true);
ch4("stand m2, poster read", "stand", "m2", true, {}, ["poster4"]);
ch4("van m3", "van", "m3", true);
ch4("van m3, floor mopped", "van", "m3", true, { scrub: 3 });
ch4("inside m4a", "inside", "m4a", false);
ch4("inside m4b", "inside", "m4b", false);
ch4("van m4v", "van", "m4v", false);
ch4("port m1, in the middle can", "port", "m1", false, {}, [], { sqPose: "hidden", spot: 91, sing: false });
ch4("port m1, singing", "port", "m1", false, {}, [], { sqPose: "hidden", spot: 91, sing: true });
ch4("stand m2h", "stand", "m2h", false);
ch4("inside m4a, searchlight", "inside", "m4a", false, { beam: 0.5 });
ch4("port m5", "port", "m5", false);
ch4("port m5, singing", "port", "m5", false, {}, [], { sing: true });
ch4("port m5d", "port", "m5d", false);


export function setState(setup) {
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
    ss.startOpening();
    // Drop the title-screen queue before the scene starts, so drain plays that scene and not the new opening.
    ss.op.q = []; ss.op.cur = null;
    ss[setup.call](); ss.drain(); clear();
    const t = setup.set;
    if (t.swap !== undefined) ss.swapTo(t.swap);
    Object.assign(n, t.op || {});
    Object.assign(ss.ch, t.ch || {});
    t.s4 && Object.assign(ss.s4, t.s4);
    t.s5 && Object.assign(ss.s5, t.s5);
    t.s5bro && Object.assign(ss.s5.bro, t.s5bro);
    t.trip !== undefined && ss.setTrip(t.trip);
    for (const f of t.found || []) n.found.add(f);
    if (t.halves) for (const h of ss.hall.halves || []) h && (h.on = true);
  } else if (setup.kind === "ch3") {
    ss.sceneP0(); ss.drain(); clear();
    Object.assign(ss.ch3, { phase: setup.phase, rov: [] }, setup.extra);
    n.room = setup.room; n.sqPose = "stand"; ss.ch.spot = -1; ss.ch.sing = false; ss.swapTo(setup.mops);
    if (setup.pose) { n.sqPose = setup.pose.sqPose || n.sqPose; setup.pose.spot !== undefined && (ss.ch.spot = setup.pose.spot); ss.ch.sing = !!setup.pose.sing; }
  } else if (setup.kind === "ch4") {
    ss.sceneM0(); ss.drain(); clear();
    Object.assign(ss.ch4, { phase: setup.phase, bot: null }, setup.extra);
    for (const f of setup.found) n.found.add(f);
    n.room = setup.room; n.sqPose = "stand"; ss.ch.spot = -1; ss.ch.sing = false; ss.swapTo(setup.mops);
    if (setup.pose) { n.sqPose = setup.pose.sqPose || n.sqPose; setup.pose.spot !== undefined && (ss.ch.spot = setup.pose.spot); ss.ch.sing = !!setup.pose.sing; }
  }
  clear();
  }
