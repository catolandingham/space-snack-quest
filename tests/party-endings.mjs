/**
 * The FUR alarm and the run home (P7), and both endings (P8a, P8b): party plan P7 and P8; src/modules/party.js,
 * party-endings.js, party-capture.js. At phone size:
 *   - P7's restart: the alarm ringing, the guards coming in at the hallway doorway, Squatch on the dance floor
 *     with the pieces he lost still gone, the chip "Squatch: run home and hide!", his door outlined;
 *   - from P6, seen with fur showing, the alarm begins and the band stops (nothing yanks out of the hallway doorway);
 *   - the kid steers home himself (nothing walks him); HIDE · bed; "They lost you." with its chime; the calm seen
 *     from the door gap; then P8a: Mops comes in out of breath, the flyer glows, "Everyone out there has
 *     someone." then "You have me.", then beat 20 (the TV story);
 *   - hiding in a plant in P7: "They lost you.", then his door is the goal; walking home gives P8a;
 *   - P8b: the wall speaker's line (name "Station PA"), the band packs up, everyone leaves through the hallway
 *     doorway in the pairs, then the bartender, Isfred and the band, each walking out (nobody vanishes), Mops
 *     mops in, his heart cone is as big as everyone's, the kid walks to him, they walk home through Squatch's
 *     door, the two lines, beat 20;
 *   - no catch in P8; ↺ restarts an ending; Joe's home theme never plays during the party night; the ta-da and
 *     the band's start are not silent (the chime and the cheer play).
 * Stills at 375 x 812 go to tests/out/party-stills/ (p7-*.png, p8-*.png).
 *   node tests/party-endings.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const g = await startGame({ port: 9102, name: "party-endings" });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const endings = await import(join(root, "src", "modules", "party-endings.js"));

async function open(beat) {
  const o = await g.open("?beat=" + beat, PHONE);
  await sleep(1400);
  return o;
}
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur;
    return {
      now: window.SSQ.beat("ch1-party").now(),
      room: n.room,
      scene: n.scene,
      ctrl: !!n.ctrl,
      cur: c ? c.k : "",
      id: c ? c.id || "" : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      x: Math.round(n.sq.x),
      y: Math.round(n.sq.y),
      puff: n.ch1PartyNow ? n.ch1PartyNow.puff || 0 : 0,
      glow: n.ch1PartyNow ? n.ch1PartyNow.glow || 0 : 0,
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      chip: window.__ss.chipNow(),
      ring: n.lastRing && n.T - n.lastRing.T < 0.3 ? n.lastRing.id : "",
      // "They lost you." is shown as the HUD note and logged as a "safe" line
      note: (n.log || []).filter((l) => l.k === "safe").map((l) => l.text).pop() || "",
      warm: window.__ss.warmWhy ? window.__ss.warmWhy() : "?",
      tv: !!n.tvOn,
      walks: (n.ch1Walks || []).map((w) => w.phase + ":" + w.room),
    };
  });
const set = (page, f, arg) => page.evaluate(`(${f})(window.__ss.op.ch1PartyNow, window.__ss.op, ${JSON.stringify(arg || null)})`);
const place = (page, x, y) => page.evaluate((p) => ((window.__ss.op.sq.x = p[0]), (window.__ss.op.sq.y = p[1])), [x, y]);
const walk = (page, x, y) => page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [x, y]);
const press = (page) => page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
const next = (page) => page.evaluate(() => window.__ss.opTap());
const until = async (page, f, ms = 15000, onWait) => {
  const t0 = Date.now();
  for (;;) {
    const s = await st(page);
    if (f(s)) return s;
    if (Date.now() - t0 > ms) return null;
    onWait && (await onWait(s));
    await sleep(100);
  }
};
const still = (page, name) => page.screenshot({ path: join(OUT, name + ".png") });
const bubbleName = (page) => page.evaluate(() => (window.__ss.lastBubble ? String(window.__ss.lastBubble.name) : "none"));
const played = (page) => page.evaluate(() => (window.SSQ.beat("ch1-party").now() || { sound: { played: [] } }).sound.played);
// Lines shown in order until `stop` says so, tapping NEXT on each.
async function readLines(page, stop, ms = 30000) {
  const seen = [];
  await until(
    page,
    (q) => stop(q, seen),
    ms,
    async (q) => {
      if (q.cur === "bub" || q.cur === "card" || q.cur === "panel") {
        const key = q.cur === "panel" ? "panel:" + q.id : q.text;
        seen[seen.length - 1] !== key && seen.push(key);
        await sleep(200);
        await next(page);
      }
    },
  );
  return seen;
}

// ---------- P7 from its restart ----------
{
  const { page, errors } = await open("party:P7");
  let s = await st(page);
  g.check("P7 starts with the alarm ringing and Squatch on the dance floor", s.now.scene === "P7" && ["ring", "search"].includes(s.now.alarm) && Math.hypot(s.x - hall.DANCE_SPOT.x, s.y - hall.DANCE_SPOT.y) < 20, [s.now.alarm, s.x, s.y]);
  g.check("the chip says \"Squatch: run home and hide!\"", s.chip === "Squatch: run home and hide!", s.chip);
  s = await until(page, (q) => q.ring === "go-home", 3000);
  g.check("his door is outlined", !!s);
  await still(page, "p7-alarm-run-home");
  // he steers home himself: nothing walks him while the kid does nothing
  const a = await st(page);
  await sleep(1200);
  const b = await st(page);
  g.check("nothing walks him home (the kid steers)", Math.hypot(a.x - b.x, a.y - b.y) < 4 || b.now.alarm === "caught", [a.x, a.y, b.x, b.y]);
  await page.evaluate(() => window.SSQ.beat("ch1-party").restart());
  await sleep(400);
  await walk(page, hall.SPOTS.doorway.x, 605);
  s = await until(page, (q) => q.room === "closet", 10000);
  g.check("he runs home through his door (a walk through the door, not a jump)", !!s && s.walks.slice(-3).join(",").includes("edge:hall"), s && s.walks.slice(-4));
  s = await until(page, (q) => q.act === "HIDE · bed", 4000);
  g.check("at home: HIDE · bed", !!s);
  await press(page);
  s = await until(page, (q) => q.note === "They lost you.", 15000);
  g.check("the guard gives up: \"They lost you.\"", !!s);
  g.check("\"They lost you.\" plays its sound (the board's phew and two happy notes)", (await played(page)).includes("lost"));
  await still(page, "p7-they-lost-you");
  s = await until(page, (q) => q.now && q.now.scene === "P8a", 20000);
  g.check("after the calm (seen from the door gap): P8a at home", !!s && s.room === "closet", s && s.now && s.now.scene);
  g.check("Joe's home theme never played through the party night", s && s.warm === "", s && s.warm);
  s = await until(page, (q) => q.now && q.now.scene === "P8a" && (q.puff > 0 || q.glow > 0), 12000, null);
  await sleep(200);
  await still(page, "p8a-mops-out-of-breath");
  const mops = await page.evaluate(() => ({ x: window.__ss.op.mo.x, puff: window.__ss.op.ch1PartyNow.puff, k: window.SSQ.engine().squatchScale() }));
  g.check("P8a: Mops comes in out of breath (the puffs are drawn), inside the room picture", mops.puff > 0 && mops.x + 26 * mops.k <= 960, mops);
  const glowed = await until(page, (q) => q.glow > 0, 6000);
  g.check("then the flyer on the floor glows (fur on it)", !!glowed);
  s = await until(page, (q) => q.now && q.now.scene === "P8a" && (q.now.done !== undefined) && q.cur === "bub", 15000);
  await still(page, "p8a-lines");
  const lines = await readLines(page, (q) => q.tv);
  g.check("P8a: \"Everyone out there has someone.\" then \"You have me.\", then the TV story (beat 20)", lines[0] === "Everyone out there has someone." && lines[1] === "You have me.", lines);
  s = await st(page);
  g.check("beat 20 begins (the TV is on) and the party night is over", s.tv && !s.now, [s.tv, s.now]);
  g.check("no errors in P7 and P8a", errors.length === 0, errors);
  await page.close();
}

// ---------- the alarm from P6: the band stops (no beard in the doorway to yank out; tests/party-round3.mjs) ----------
{
  const { page } = await open("party:P6");
  await set(page, (p) => (p.lostPieces = ["head"]));
  await place(page, 770, 455);
  let s = await until(page, (q) => q.now && q.now.scene === "P7" && ["pull", "ring", "search"].includes(q.now.alarm), 15000);
  g.check("seen with fur showing: P7 begins", !!s);
  s = await until(page, (q) => ["ring", "search", "home"].includes(q.now.alarm), 10000);
  g.check("the bell starts and the band stops (no song in P7); no zip of a beard", !!s && !(await played(page)).includes("zip") && s.now.sound.song === -1, s && s.now.sound.song);
  await page.close();
}

// ---------- P7: hiding in a plant, then home ----------
{
  const { page } = await open("party:P7");
  const sp = hall.SPOTS.plantMiddle;
  await place(page, sp.x, sp.y);
  let s = await until(page, (q) => q.act === "HIDE · plant", 4000);
  g.check("in P7 the plants hide him", !!s);
  await press(page);
  s = await until(page, (q) => q.note === "They lost you.", 15000);
  g.check("hidden in the plant, the guards give up: \"They lost you.\"", !!s);
  s = await until(page, (q) => q.now && !q.now.alarm && q.ctrl, 15000);
  g.check("the calm is shown, then he has control again", !!s);
  // still hidden in the plant, the next step shows: his door is outlined
  s = await until(page, (q) => q.ring === "go-home", 3000);
  g.check("still hidden in the plant after \"They lost you.\", his door is outlined (the next step)", !!s && s.now.pose === "hidden", s && [s.ring, s.now.pose]);
  await walk(page, hall.SPOTS.doorway.x, 600);
  s = await until(page, (q) => q.now && q.now.scene === "P8a", 12000);
  g.check("walking home through his door gives P8a", !!s);
  await page.close();
}

// ---------- P8b, never caught ----------
{
  const { page, errors } = await open("party:P8b");
  let s = await until(page, (q) => q.cur === "bub", 3000);
  g.check("closing time: the wall speaker says \"The party's over. Good night, Stormtop!\"", !!s && s.text === "The party's over. Good night, Stormtop!", s && s.text);
  await sleep(200);
  g.check("its name is the game's own \"Station PA\"", (await bubbleName(page)) === "Station PA", await bubbleName(page));
  await still(page, "p8b-speaker");
  await next(page);
  // the party is over: he can walk about while everyone leaves, and nobody watches for him (no cones)
  s = await until(page, (q) => q.ctrl, 4000);
  g.check("once the speaker is done he has control while everyone leaves", !!s);
  await sleep(400);
  const coneCount = await page.evaluate(() => window.__ss.conesDrawn().filter((c) => !c.heart).length);
  g.check("closing time draws no cones (nobody is watching for him)", coneCount === 0, coneCount);
  // and no "?" or "!" is drawn over anyone (measured where the picture draws them)
  const marks = await page.evaluate(async () => {
    const fill = CanvasRenderingContext2D.prototype.fillText,
      got = [];
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) {
      (t === "?" || t === "!") && got.push(t);
      return fill.call(this, t, ...r);
    };
    await new Promise((ok) => setTimeout(ok, 400));
    CanvasRenderingContext2D.prototype.fillText = fill;
    return got.length;
  });
  g.check("closing time draws no \"?\" or \"!\" over anyone", marks === 0, marks);
  // he stands right on the way out: nobody walks through him
  await place(page, 760, 360);
  const order = [],
    lastAt = {};
  let closest = 999,
    closestWho = null,
    closestFred = 999,
    lastSq = null;
  const waitFrom = Date.now();
  s = await until(
    page,
    (q) => q.now && q.now.close && q.now.close.phase === "empty",
    60000,
    async (q) => {
      const p = await page.evaluate(() => {
        const P = window.__ss.op.ch1PartyNow,
          out = {};
        // [x, y, walking out now]
        for (const [id, g] of Object.entries(P.people)) out[id] = [g.x, g.y, g.task === "leave"];
        out.isfred = [P.isfred.x, P.isfred.y, P.isfred.task === "leave"];
        out.bartender = [P.bartenderAt.x, P.bartenderAt.y, P.bartenderAt.task === "leave"];
        P.bandAt.forEach((b, i) => (out["band" + i] = [b.x, b.y, b.task === "leave"]));
        return out;
      });
      for (const id of q.now.close ? q.now.close.gone : []) order.includes(id) || order.push(id);
      // the closest anyone walking out comes to him (someone standing still is solid, so he cannot walk into them)
      const sqStill = lastSq && lastSq[0] === q.x && lastSq[1] === q.y;
      lastSq = [q.x, q.y];
      for (const [id, at] of Object.entries(p)) {
        if (order.includes(id)) continue;
        lastAt[id] = at;
        // (only while he stands still: when the kid walks him up to someone, that is his doing, not theirs)
        const d = Math.hypot(at[0] - q.x, at[1] - q.y);
        at[2] && sqStill && d < closest && ((closest = d), (closestWho = [id, Math.round(at[0]), Math.round(at[1]), q.x, q.y]));
        // and nobody walks through Isfred while he still stands by the bar
        const f = p.isfred,
          df = Math.hypot(at[0] - f[0], at[1] - f[1]);
        id !== "isfred" && at[2] && !f[2] && !order.includes("isfred") && df < closestFred && (closestFred = df);
      }
      // after a while he steps out of the way, as a kid would
      Date.now() - waitFrom > 6000 && Math.hypot(q.x - 420, q.y - 560) > 10 && (await walk(page, 420, 560));
      q.now.close && q.now.close.gone.length === 4 && !order.saved && ((order.saved = 1), await still(page, "p8b-leaving-in-pairs"));
    },
  );
  for (const id of s && s.now.close ? s.now.close.gone : []) order.includes(id) || order.push(id);
  g.check("everyone leaves (the hall is empty)", !!s && order.length === 11, order);
  const groupOf = (id) => endings.LEAVING.findIndex((grp) => grp.includes(id));
  g.check("nobody walks through Squatch on the way out (they go round him, or wait)", closest >= 30, [Math.round(closest), closestWho]);
  g.check("nobody walks through Isfred on the way out (they go round him)", closestFred >= 30, Math.round(closestFred));
  g.check("they leave in the pairs, then the bartender, Isfred and the band", order.every((id, i) => i === 0 || groupOf(id) >= groupOf(order[i - 1])), order);
  const walkedOut = Object.entries(lastAt).filter(([, at]) => at[0] < 880);
  g.check("nobody vanishes: everyone was last seen at the hallway doorway, walking out", walkedOut.length === 0, walkedOut);
  await still(page, "p8b-empty-hall");
  s = await until(page, (q) => q.now.mops && q.now.mops.heart >= 1, 20000);
  g.check("Mops comes in mopping and his cone fills with hearts", !!s);
  const drawn = await page.evaluate(() => window.__ss.conesDrawn());
  const heartCone = drawn.find((c) => c.heart);
  const size = await page.evaluate(() => window.SSQ.engine().coneSize());
  g.check("his heart cone is drawn as big as everyone's (the guests' cone length and width)", !!heartCone && heartCone.len === size.len && heartCone.half === size.half, heartCone);
  await still(page, "p8b-mops-hearts");
  let words = 0;
  for (let i = 0; i < 15; i++) ((await st(page)).cur === "bub" && words++, await sleep(100));
  g.check("no words at Mops's hearts (sampled for 1.5 seconds)", words === 0, words);
  g.check("no catch in P8: no cone fills and nobody shouts", s && !s.now.alarm);
  // the kid does nothing: a moment later Mops walks over to him, and they go home together
  s = await until(page, (q) => q.room === "closet", 25000);
  g.check("they walk home together through his door", !!s && s.walks.slice(-3).join(",").includes("edge:hall"), s && s.walks.slice(-3));
  const lines = await readLines(page, (q) => q.tv);
  g.check("at home: the same two lines, then beat 20", lines[0] === "Everyone out there has someone." && lines[1] === "You have me.", lines);
  g.check("no errors in P8b", errors.length === 0, errors);
  await page.close();
}

// ---------- P8b from the party: a "?" a guest showed in P6 does not stay up at closing time ----------
{
  const { page } = await open("party:P6");
  // in his own time the last song ends while a guest's cone shows "?" over him (the test sets the song clock)
  await place(page, 770, 455);
  await until(page, (q) => q.now && q.now.seenBy, 4000);
  await set(page, (p) => ((p.song = 2), (p.songT = 59.9)));
  const s = await until(page, (q) => q.cur === "bub" && q.now.scene === "P8b", 6000);
  await sleep(300);
  const marks = await page.evaluate(async () => {
    const fill = CanvasRenderingContext2D.prototype.fillText,
      got = [];
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) {
      (t === "?" || t === "!") && got.push(t);
      return fill.call(this, t, ...r);
    };
    await new Promise((ok) => setTimeout(ok, 400));
    CanvasRenderingContext2D.prototype.fillText = fill;
    return got.length;
  });
  g.check("closing time from the party: no \"?\" left over a guest", !!s && marks === 0, [!!s, marks]);
  await page.close();
}

// ---------- P8b: a kid who stands on the way out the whole time still sees the party end ----------
{
  const { page } = await open("party:P8b");
  await until(page, (q) => q.cur === "bub", 3000);
  await next(page);
  await until(page, (q) => q.ctrl, 4000);
  // he stands where everyone turns for the hallway doorway, and never moves
  await place(page, hall.EXIT[0].x, hall.EXIT[0].y);
  let closest = 999;
  const s = await until(
    page,
    (q) => q.now && q.now.close && q.now.close.phase !== "pack" && q.now.close.phase !== "leave",
    60000,
    async (q) => {
      const d = await page.evaluate(() => {
        const P = window.__ss.op.ch1PartyNow,
          n = window.__ss.op,
          w = [...Object.values(P.people), P.isfred, P.bartenderAt, ...P.bandAt].filter((b) => b && b.task === "leave");
        return Math.min(999, ...w.map((b) => Math.hypot(b.x - n.sq.x, b.y - n.sq.y)));
      });
      closest = Math.min(closest, d);
    },
  );
  g.check("standing on the way out, he does not stop the party ending: everyone still leaves", !!s, s && s.now.close);
  g.check("and they go round him, never through him", closest >= 30, Math.round(closest));
  await page.close();
}

// ---------- ↺ in P7 and in P8a part way through ----------
{
  const { page } = await open("party:P7");
  await place(page, 300, 500);
  await sleep(1500);
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(600);
  const s = await st(page);
  g.check("↺ in P7: the alarm ringing again, Squatch back on the dance floor", s.now && s.now.scene === "P7" && ["ring", "search"].includes(s.now.alarm) && Math.hypot(s.x - hall.DANCE_SPOT.x, s.y - hall.DANCE_SPOT.y) < 20, s.now && [s.now.alarm, s.x, s.y]);
  await page.close();
}
{
  const { page } = await open("party:P8a");
  await sleep(2500);
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(400);
  const s = await st(page);
  g.check("↺ in P8a part way through: Mops comes in again from the door", s.now && s.now.scene === "P8a" && s.room === "closet", s.now && s.now.scene);
  await page.close();
}

// ---------- ↺ in an ending, and the half-one sounds that were silent ----------
{
  const { page } = await open("party:P8b");
  await next(page);
  await sleep(2500);
  await page.evaluate(() => window.SSQ.beat("ch1-party").restart());
  const s = await until(page, (q) => q.cur === "bub", 3000);
  g.check("↺ restarts the ending from its start", !!s && s.text === "The party's over. Good night, Stormtop!", s && s.text);
  await page.close();
}
{
  const { page } = await open("party:P3");
  const s = await until(page, (q) => q.now && q.now.scene === "P4", 40000, async (q) => q.cur === "bub" && (await sleep(150), await next(page)));
  const pl = await played(page);
  g.check("the band's start is not silent (the crowd cheers) and its song plays", !!s && pl.includes("cheer") && pl.includes("song0"), pl);
  await page.close();
}

await g.finish("party-endings");
