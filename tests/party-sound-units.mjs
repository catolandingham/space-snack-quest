/**
 * Every party sound (src/modules/party-board-sounds.js BOARD, and the band in party-sound.js), played into a fake
 * AudioContext, follows Brian's sound rules:
 *   - every sound starts silent and fades in (each enveloped gain is at or below 0.001 before its first ramp), so
 *     no noise clicks on its first sample (the sound review of 2026-11-24, point 3);
 *   - everything it makes ends at the place it was given (the master volume): nothing is wired around it;
 *   - with sound off nothing is made at all.
 *   node tests/party-sound-units.mjs
 */
import { join } from "node:path";
import { root } from "./game-page.mjs";

const { BOARD } = await import(join(root, "src", "modules", "party-board-sounds.js"));
const { createPartySound, SONGS, FORM } = await import(join(root, "src", "modules", "party-sound.js"));
let failed = 0;
const check = (name, ok, detail) => (console.log(`${ok ? "PASS" : "FAIL"} ${name}`), ok || (failed++, console.log(JSON.stringify(detail))));

function fakeContext() {
  const nodes = [];
  const param = (v = 0) => {
    const p = { value: v, first: null, calls: [] };
    for (const m of ["setValueAtTime", "exponentialRampToValueAtTime", "linearRampToValueAtTime", "setTargetAtTime"])
      p[m] = (val) => (p.first == null && (p.first = p.value), p.calls.push([m, val]));
    return p;
  };
  const node = (kind, extra = {}) => {
    const n = { kind, out: [], connect(to) { n.out.push(to); return to; }, disconnect() {}, start() { n.started = true; }, stop() {}, ...extra };
    // a modulator (vibrato, tremolo) feeds a parameter: it reaches wherever the parameter's node goes
    for (const v of Object.values(n)) v && v.calls && (v.owner = n);
    nodes.push(n);
    return n;
  };
  const c = {
    sampleRate: 8000,
    currentTime: 0,
    nodes,
    createOscillator: () => node("osc", { frequency: param(440), type: "sine" }),
    createGain: () => node("gain", { gain: param(1) }),
    createBiquadFilter: () => node("filter", { frequency: param(1000), Q: param(1), type: "lowpass" }),
    createBufferSource: () => node("src", { buffer: null, loop: false }),
    createBuffer: (ch, len, rate) => ({ sampleRate: rate, duration: len / rate, getChannelData: () => new Float32Array(len) }),
  };
  for (const n of ["createGain", "createOscillator", "createBiquadFilter", "createBufferSource"]) {
    const f = c[n];
    c[n] = () => Object.assign(f(), { context: c });
  }
  return c;
}
// Does node n reach `out` through its connections?
const reaches = (n, out, seen = new Set()) => n === out || (!seen.has(n) && (seen.add(n), n.owner ? reaches(n.owner, out, seen) : (n.out || []).some((m) => reaches(m, out, seen))));

const bad = [],
  stray = [];
for (const [name, fn] of Object.entries(BOARD)) {
  const c = fakeContext(),
    out = c.createGain();
  fn({ c, o: out }, 1);
  for (const n of c.nodes) {
    if (n.kind === "gain" && n.gain.calls.length && n.gain.first > 0.001) bad.push([name, n.gain.first]);
    if ((n.kind === "osc" || n.kind === "src") && n.started && !reaches(n, out)) stray.push(name);
  }
}
check("every party sound starts silent and fades in (no click on the first sample)", bad.length === 0, bad.slice(0, 5));
check("every party sound ends at the master volume it was given", stray.length === 0, [...new Set(stray)]);

// The band: bars scheduled through the master volume, the break bars silent but for the shout and the fill.
{
  const c = fakeContext(),
    master = c.createGain();
  let on = "on";
  const sound = createPartySound(() => ({ soundState: () => on, audioCtx: () => c, masterGain: () => master }));
  sound.song(0);
  for (let t = 0; t < 30; t += 0.1) ((c.currentTime = t), sound.tick());
  const srcs = c.nodes.filter((n) => (n.kind === "osc" || n.kind === "src") && n.started);
  check("the band plays through the master volume", srcs.length > 100 && srcs.every((n) => reaches(n, master)), srcs.length);
  check("the songs follow the form: 12 bars, then the 2-bar break where the band shouts", FORM.length === 14 && FORM.slice(12).every((b) => b === "break") && SONGS.length === 3);
  const before = c.nodes.length;
  on = "off";
  sound.one("crash");
  sound.one("cheer");
  for (let t = 30; t < 35; t += 0.1) ((c.currentTime = t), sound.tick());
  check("with sound off nothing is made", c.nodes.length === before, c.nodes.length - before);
}
// The alarm (Brian 2026-11-26: "boing, boing, boing" is gone): each whoop's level, worked out from its gain's own
// automation, stays within 3 dB of its peak from 0.02 s to 0.45 s into it (the alarm page's whoop holds; a plucked
// one falls away from the start).
{
  const gains = [];
  const c = {
    currentTime: 0,
    createGain() {
      const pts = [];
      const g = { gain: { value: 1, setValueAtTime: (v, t) => pts.push(["set", v, t]), exponentialRampToValueAtTime: (v, t) => pts.push(["exp", v, t]), linearRampToValueAtTime: (v, t) => pts.push(["lin", v, t]), setTargetAtTime() {} }, connect: (x) => x, disconnect() {}, pts };
      gains.push(g);
      return g;
    },
    createOscillator: () => ({ frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, connect: (x) => x, start() {}, stop() {}, type: "" }),
  };
  BOARD.alarm({ c, o: { connect() {} } }, 10);
  // the level at time x from a list of automation points (exponential ramps between points)
  const level = (pts, x) => {
    let prev = null;
    for (const [kind, v, t] of pts) {
      if (t >= x) return !prev || kind === "set" ? (prev ? prev[1] : v) : prev[1] * (v / prev[1]) ** ((x - prev[2]) / (t - prev[2]));
      prev = [kind, v, t];
    }
    return prev ? prev[1] : 0;
  };
  const whoops = gains.filter((g) => g.pts.length),
    worst = whoops.map((g) => {
      const t0 = g.pts[0][2],
        peak = Math.max(...g.pts.map((q) => q[1])),
        dbs = [];
      for (let x = 0.02; x <= 0.45; x += 0.01) dbs.push(20 * Math.log10(level(g.pts, t0 + x) / peak));
      return Math.round(Math.min(...dbs) * 10) / 10;
    });
  check("the alarm is three whoops, each holding within 3 dB of its peak from 0.02 s to 0.45 s (no boing)", whoops.length === 3 && worst.every((d) => d > -3), worst);
}
console.log(failed ? `${failed} checks failed` : "party-sound-units checks passed");
process.exit(failed ? 1 : 0);
