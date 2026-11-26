/**
 * The voices under speech bubbles (src/modules/speech-voice.js; Brian 2026-11-26, showing 7 at 0:05: "like the
 * Charlie Brown teacher noise... maybe we can do that anytime there's someone speaking"), and where bubble tails end
 * (src/modules/bubble-tail.js; same note: "make it more obvious who the speaker or thinker is"). No browser:
 *   - every speaker with a bubble in the game's lines files (party, morning, home alone, TV story) has a voice, and so
 *     does every bubble speaker the party and morning modules use (say("who", ...));
 *   - Mops keeps his own meh (no babble); no babble for a sung line or for Squatch's thoughts;
 *   - pitches: the Croc Boys lowest, Isfred in the middle, Squatch higher; two guests' lines sound different;
 *   - a longer line babbles longer; every syllable starts silent (no click) and everything ends at the node given;
 *   - the voices sit under the music (sound-mix.js MIX.voices below MIX.music);
 *   - a tail ends inside its target box, for a target below, beside, above or under the bubble, and a thought trail's
 *     three circles shrink toward the thinker.
 *   node tests/speech-voices.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./game-page.mjs";

const V = await import(join(root, "src", "modules", "speech-voice.js"));
const T = await import(join(root, "src", "modules", "bubble-tail.js"));
const { MIX } = await import(join(root, "src", "modules", "sound-mix.js"));
const { PARTY_LINES } = await import(join(root, "src", "modules", "party-lines.js"));
const { MORNING_LINES } = await import(join(root, "src", "modules", "morning-lines.js"));
const { HOME_ALONE_LINES } = await import(join(root, "src", "modules", "home-alone-lines.js"));
const { TV_STORY_LINES } = await import(join(root, "src", "modules", "tv-story-lines.js"));
let failed = 0;
const check = (name, ok, detail) => (console.log(`${ok ? "PASS" : "FAIL"} ${name}`), ok || (failed++, console.log(JSON.stringify(detail))));

// Lines that are not said by someone in a bubble: cards, chips, buttons, tags, signs and the like.
const NOT_SPOKEN = new Set(["card", "chip", "button", "tag", "banner", "meter", "lockup", "note", "cue", "sheet", "sign", "label", "caption", "badge"]);
const tv = Array.isArray(TV_STORY_LINES) ? TV_STORY_LINES : Object.values(TV_STORY_LINES).flat();
const speakers = new Set([...PARTY_LINES, ...MORNING_LINES, ...HOME_ALONE_LINES, ...tv].map((l) => l.who).filter((w) => w && !NOT_SPOKEN.has(w)));
const missing = [...speakers].filter((w) => !V.LINE_SPEAKERS[w] || V.LINE_SPEAKERS[w].some((b) => !V.VOICES[b]));
check("every speaker with a bubble in the lines files has a voice entry", speakers.size >= 8 && missing.length === 0, { speakers: [...speakers], missing });

// Every bubble speaker the modules use: say("who", ...), h.say, e.say, ambient("who", ...)
const used = new Set();
for (const f of readdirSync(join(root, "src", "modules")).filter((f) => f.endsWith(".js"))) {
  const src = readFileSync(join(root, "src", "modules", f), "utf8");
  for (const m of src.matchAll(/\b(?:say|ambient)\("([a-z]+)"/g)) used.add(m[1]);
}
const noVoice = [...used].filter((w) => !V.VOICES[w]);
check("every bubble speaker the modules use (say / ambient) has a voice entry", used.size >= 8 && noVoice.length === 0, { used: [...used], noVoice });

const say = (who, text, style) => V.babbleFor({ who, text, style });
check("Mops keeps his own meh: no babble for him", V.VOICES.mops.own === "meh" && say("mops", "I have to go to work now.") === null);
check("no babble under a sung line", say("band", "Stormtop-vania 1-2-3-4-5!", "song") === null && say("official", "La la la", "song") === null);
check("no babble for Squatch's thoughts (his whisper lines)", say("sq", "Robots?", "whisper") === null);
check("Squatch speaking out loud gets one", !!say("sq", "Party?"));
check("pitches: the Croc Boys lowest, Isfred in the middle, Squatch higher", V.VOICES.band.f < V.VOICES.official.f && V.VOICES.official.f < V.VOICES.sq.f, V.VOICES);
const g1 = say("tourist", "FUR!"),
  g2 = say("tourist", "Say cheese!");
check("two guests' lines are pitched differently", g1 && g2 && g1.syllables[0].f !== g2.syllables[0].f, [g1, g2]);
const short = say("official", "Hello!"),
  long = say("official", "Let's give a big hello to our friends from Bleep-Bloop Robotics!");
check("a longer line babbles longer (length matched to the line)", long.len > short.len * 2 && long.len < 2.5, [short.len, long.len]);

// played into a fake audio context
function fakeContext() {
  const nodes = [];
  const param = (v = 0) => {
    const p = { value: v, first: null, calls: [] };
    for (const m of ["setValueAtTime", "exponentialRampToValueAtTime", "linearRampToValueAtTime", "setTargetAtTime"]) p[m] = (val) => (p.first == null && (p.first = p.value), p.calls.push([m, val]));
    return p;
  };
  const node = (kind, extra = {}) => {
    const n = { kind, out: [], connect(to) { n.out.push(to); return to; }, disconnect() {}, start() {}, stop() {}, ...extra };
    nodes.push(n);
    return n;
  };
  return {
    nodes,
    currentTime: 0,
    createGain: () => node("gain", { gain: param(1) }),
    createOscillator: () => node("osc", { frequency: param(440), type: "" }),
    createBiquadFilter: () => node("filter", { frequency: param(350), Q: param(1), type: "" }),
  };
}
const c = fakeContext(),
  dest = { kind: "dest", out: [] };
V.playBabble({ c, o: dest }, 0, long);
const syllableGains = c.nodes.filter((n) => n.kind === "gain" && n.gain.calls.length);
check("every syllable starts silent (no click on its first sample)", syllableGains.length === long.syllables.length && syllableGains.every((g) => g.gain.first <= 0.001), syllableGains.map((g) => g.gain.first));
const reaches = (n, seen = new Set()) => (n === dest ? true : seen.has(n) ? false : (seen.add(n), n.out.length > 0 && n.out.every((o) => reaches(o, seen))));
check("everything it makes ends at the node it was given (the effects level)", c.nodes.every((n) => reaches(n)), c.nodes.map((n) => n.kind));
// the three styles Brian can choose from (#4): each starts silent and plays only into the node given
for (const style of ["A", "B", "C"]) {
  const c2 = fakeContext(),
    d2 = { kind: "dest", out: [] };
  V.playBabble({ c: c2, o: d2 }, 0, long, style);
  const gs = c2.nodes.filter((n) => n.kind === "gain" && n.gain.calls.length),
    reach2 = (n, seen = new Set()) => (n === d2 ? true : seen.has(n) ? false : (seen.add(n), n.out.length > 0 && n.out.every((o) => reach2(o, seen))));
  check(`voice style ${style}: a syllable each, every one starting silent, all ending at the node given`, gs.length === long.syllables.length && gs.every((g) => g.gain.first <= 0.001) && c2.nodes.every((n) => reach2(n)), gs.length);
}
check("the game uses the recorded syllables (Brian's pick of 2026-11-26; one line to switch: speech-voice.js VOICE_STYLE)", V.VOICE_STYLE === "S");
// the recorded syllables
const { existsSync } = await import("node:fs");
const sets = [...Object.values(V.VOICES), ...Object.values(V.GUEST_VOICES)].filter((v) => !v.own);
check("every voice (and every guest's) uses a set of recorded syllables, and all four files of each set are in sounds/voices/", sets.every((v) => V.VOICE_SETS.includes(v.set) && v.rate > 0.5 && v.rate < 1.6) && V.VOICE_SETS.every((set) => [0, 1, 2, 3].every((i) => existsSync(join(root, V.voiceFile(set, i))))), sets);
const syl = (who, text, style, guest) => V.syllablesFor({ who, text, style }, guest);
check("syllables: none for Mops (his meh), a sung line or a thought",  syl("mops", "Morning, Squatch.") === null &&  syl("band", "Stormtop-vania 1-2-3-4-5!", "song") === null &&  syl("sq", "Robots?", "whisper") === null);
const isf =  syl("official", "Let's give a big hello to our friends from Bleep-Bloop Robotics!"),
  shortL =  syl("official", "Hello!");
check("syllables: about every 0.09 s, a short pause every 5, and a longer line has more", isf.at.length > shortL.at.length && Math.abs(isf.at[1] - isf.at[0] - V.SYLLABLES.every) < 0.001 && isf.at[5] - isf.at[4] > V.SYLLABLES.every + 0.1, isf.at.slice(0, 7));
check("syllables: Isfred and the grown-ups a man's standard voice, the Croc Boys the deep one, Squatch pitched up a little", isf.set === "male_standard" &&  syl("band", "Group photo!").set === "male_deep" &&  syl("sq", "Party?").rate > 1.1 &&  syl("guard", "Someone pulled the fur alarm.").set === "male_standard");
check("syllables: each guest their own voice: the robot guest the robot one, some guests a woman's",  syl("tourist", "Say cheese!", "", "robot").set === "robot" && ["female_standard", "female_light"].includes(syl("tourist", "Hi!", "", "teal").set) && ["female_standard", "female_light"].includes(syl("tourist", "Hi!", "", "backpack").set) &&  syl("tourist", "Say cheese!", "", "camera").set === "male_standard");
check("a trombone with a mute: sawtooth through a low filter", c.nodes.filter((n) => n.kind === "osc").every((o) => o.type === "sawtooth") && c.nodes.filter((n) => n.kind === "filter").every((f) => f.type === "lowpass"));
check("the voices sit under the music (MIX.voices below MIX.music and the effects)", MIX.voices > 0 && MIX.voices < MIX.music && MIX.voices < MIX.effects, MIX);

// tails: every one ends inside its target
const bubble = { x: 300, y: 100, w: 200, h: 80 },
  inside = (p, b) => p.x >= b.x0 && p.x <= b.x1 && p.y >= b.y0 && p.y <= b.y1,
  targets = {
    below: { x0: 380, x1: 420, y0: 220, y1: 260 },
    belowFarLeft: { x0: 120, x1: 160, y0: 260, y1: 300 },
    beside: { x0: 540, x1: 580, y0: 120, y1: 160 },
    left: { x0: 200, x1: 240, y0: 110, y1: 150 },
    above: { x0: 360, x1: 400, y0: 20, y1: 60 },
    plant: { x0: 399.75, y0: 439.5, x1: 483.75, y1: 518.2 },
  };
const ctx = new Proxy({}, { get: (o, k) => (k in o ? o[k] : () => {}), set: (o, k, v) => ((o[k] = v), true) });
const bad = [];
for (const [name, t] of Object.entries(targets))
  for (const kind of ["speech", "thought"]) {
    const d = T.drawBubbleTail(ctx, bubble, t, kind, "#fff", "#1e2430", 4);
    (!d || !inside(d.end, t) || d.kind !== kind) && bad.push({ name, kind, d });
  }
check("a tail ends inside its target box, below, beside, left, above or far off (speech and thought)", bad.length === 0, bad);
const th = T.drawBubbleTail(ctx, bubble, targets.plant, "thought", "#fff", "#1e2430", 3);
check("a thought trail is three thin circles shrinking toward the thinker", th.circles.length === 3 && th.circles[0].r > th.circles[1].r && th.circles[1].r > th.circles[2].r && T.TAIL.thoughtLine <= 2, th);
const sp = T.drawBubbleTail(ctx, bubble, targets.beside, "speech", "#fff", "#1e2430", 4);
check("a speaker beside the bubble gets the tail from the bubble's side facing him", sp.side === "right", sp);

console.log(failed ? `${failed} failed` : "speech-voices checks passed");
process.exit(failed ? 1 : 0);
