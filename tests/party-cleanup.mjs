/**
 * After the party, the player is Mops cleaning the empty hall, and at home Squatch tells the truth or fibs (Brian,
 * story pass 28-52, section E2; src/modules/party-cleanup.js, party-truth.js, party-talk.js). At phone size:
 *   - P9 starts with the switch done (the player is Mops), the chip "Mops: mop the party hall", the hall dirty, no
 *     timer (standing still for 6 s changes nothing and ends nothing);
 *   - his beard cleans the floor patches it passes; a sticky spill needs two passes; the beard fills, stops
 *     cleaning, the bucket is outlined and WRING · beard is offered there; the first wring plays the morning's
 *     beard pictures and empties the beard;
 *   - then the fur, in order: "Fur?", the vent takes the first tuft, "No, no, no.", the trail one tuft at a time with
 *     its outline, "Oh no." at the third, "Nobody saw that." as he mops it;
 *   - the three finds: the Polaroid (he joined the group photo): PICK UP · photo, the close-up, his shirt then his
 *     feet ("That's MY shirt.", "Weee...?!", "Squatch."); his top hat where it fell (PICK UP · hat, "That's MY hat.");
 *     else fur in his own doorway (PICK UP · fur);
 *   - "Spotless!" once the whole hall is clean;
 *   - his doorway home: "You are SQUATCH now.", Mops comes in, "Squatch." / "Did you go to the party?", the two
 *     buttons; TELL and FIB each say their lines in order and both meet at "You never have to hide from me." and the
 *     approved lines after it, to the TV;
 *   - the endings lead here: closing time with Squatch home first (the wall speaker's call, then the switch), and
 *     "Keep going" after the alarm ("Stay in here." first);
 *   - a robot that only steers, taps and presses the big button (what a kid can do) gets through the whole cleanup.
 * Stills at 375 x 812 go to tests/out/party-stills/cleanup-*.png.
 *   node tests/party-cleanup.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9131, name: "party-cleanup" });
const C = await import(join(root, "src", "modules", "party-cleanup.js"));
const L = await import(join(root, "src", "modules", "party-lines.js"));
const line = (id) => L.partyLine(id);

const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur,
      now = window.SSQ.beat("ch1-party").now();
    return {
      now,
      clean: now && now.clean,
      room: n.room,
      ctrl: !!n.ctrl,
      cur: c ? c.k : "",
      id: c ? c.id || "" : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      by: c && c.by ? c.by : "",
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      chip: window.__ss.chipNow(),
      ring: n.lastRing && n.T - n.lastRing.T < 0.3 ? n.lastRing.id : "",
      mo: { x: n.mo.x, y: n.mo.y },
      tv: !!n.tvOn,
      done: !!(n.ch1PartyNow && n.ch1PartyNow.scene === "done"),
    };
  });
const tap = (page, x, y) => page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [x, y]);
const press = (page) => page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
const next = (page) => page.evaluate(() => window.__ss.opTap());
const until = async (page, f, ms = 15000, onWait) => {
  const t0 = Date.now();
  for (;;) {
    const s = await st(page);
    if (f(s)) return s;
    if (Date.now() - t0 > ms) return null;
    onWait && (await onWait(s));
    await sleep(80);
  }
};
const still = (page, name) => page.screenshot({ path: join(OUT, "cleanup-" + name + ".png") });
// Lines (and cards and cutaway pictures) in order, tapping NEXT on each, until `stop`.
async function readLines(page, stop, ms = 40000, seen = []) {
  await until(
    page,
    (q) => stop(q, seen),
    ms,
    async (q) => {
      if (q.cur === "bub" || q.cur === "card" || (q.cur === "cutaway" && !q.id.startsWith("x"))) {
        const key = q.cur === "card" ? "card:" + q.text : q.cur === "cutaway" ? "cutaway" : q.text;
        seen[seen.length - 1] !== key && seen.push(key);
        await sleep(150);
        await next(page);
      }
    },
  );
  return seen;
}
// Walk Mops to (x, y) by tapping the floor (as a kid does); true when he got there.
async function walkTo(page, x, y, ms = 6000) {
  await tap(page, x, y);
  const s = await until(page, (q) => Math.hypot(q.mo.x - x, q.mo.y - y) < 12 || (q.cur && q.cur !== "until"), ms);
  return !!s;
}
// The beard's tip onto (x, y): come from the left so he faces right and his beard reaches it.
async function mopAt(page, x, y) {
  await walkTo(page, Math.max(70, x - C.BEARD_TIP.dx - 50), y);
  await walkTo(page, x - C.BEARD_TIP.dx + 6, y);
}
// Zig-zag the floor until the beard is full.
async function mopUntilFull(page) {
  const rows = [330, 390, 450, 510, 570];
  for (let i = 0; i < 40; i++) {
    const s = await st(page);
    if (s.clean.beard >= 1) return s;
    const y = rows[i % rows.length];
    await walkTo(page, i % 2 ? 90 : 760, y, 7000);
  }
  return st(page);
}
// Through the fur and the trail: answer each line, mop each tuft shown. Returns the lines seen.
async function followFur(page, seen = []) {
  for (let i = 0; i < 40; i++) {
    const s = await st(page);
    if (s.cur === "bub" || s.cur === "card") {
      seen[seen.length - 1] !== s.text && seen.push(s.text);
      await sleep(120);
      await next(page);
      continue;
    }
    if (s.clean.phase === "find" || s.clean.phase === "close-up" || s.clean.phase === "home") return seen;
    const t = s.clean.trail.find((q) => q.state === "show");
    if (t && s.ctrl && s.clean.ti >= 1) await mopAt(page, t.x, t.y);
    else await sleep(150);
  }
  return seen;
}
async function openP9(setup) {
  const o = await g.open("?beat=party:P9", PHONE);
  await sleep(1200);
  if (setup) {
    await o.page.evaluate(`(${setup})(window.__ss.op.ch1PartyNow)`);
    await o.page.evaluate(() => window.SSQ.beat("ch1-party").restart());
    await sleep(300);
  }
  await until(o.page, (q) => q.ctrl && !q.cur, 8000);
  return o;
}
// Mop until full, then wring at the bucket (the first wring plays the beard pictures).
async function fillAndWring(page) {
  await mopUntilFull(page);
  await walkTo(page, C.WRING_AT.x, C.WRING_AT.y);
  const s = await until(page, (q) => q.act === "WRING · beard", 3000);
  await press(page);
  const seen = await readLines(page, (q) => q.clean && q.clean.wrung >= 1 && q.ctrl, 15000);
  return { s, seen };
}

// ---------- the start, no timer, the mop, the spill, the full beard, the wring, the fur ----------
{
  const { page, errors } = await openP9();
  let s = await st(page);
  g.check("P9: the player is Mops in the empty hall", s.now.scene === "P9" && s.now.player === "mops" && s.room === "hall", [s.now.scene, s.now.player, s.room]);
  g.check('the chip says "Mops: mop the party hall"', s.chip === line("chip-mop"), s.chip);
  g.check("the hall is dirty (most patches)", s.clean.dirty > s.clean.patches * 0.9, [s.clean.dirty, s.clean.patches]);
  await still(page, "01-dirty-hall");
  // no timer: 6 s of nothing changes nothing and ends nothing
  const a = s;
  await sleep(6000);
  s = await st(page);
  g.check("no timer: standing still for 6 s, nothing is cleaned, nothing ends, nobody comes", s.now.scene === "P9" && s.clean.dirty === a.clean.dirty && s.clean.timer === false && s.ctrl && !s.cur && s.clean.phase === "mop", [s.now.scene, s.clean.dirty, a.clean.dirty, s.cur]);
  g.check("no countdown or clock in the cleanup's state", !("clock" in s.clean) && !("left" in s.clean), Object.keys(s.clean));
  // a pass over clean floor: patches come clean and the beard fills a little
  await walkTo(page, 380, 330);
  s = await st(page);
  g.check("his beard cleans the floor it passes over", s.clean.dirty < a.clean.dirty - 5 && s.clean.beard > 0, [a.clean.dirty, s.clean.dirty, s.clean.beard]);
  await still(page, "02-a-clean-trail");
  // the full beard
  s = await mopUntilFull(page);
  g.check("the beard fills", s.clean.beard >= 1, s.clean.beard);
  s = await until(page, (q) => q.chip === line("chip-wring"), 2000);
  g.check('full: the chip says "Mops: wring your beard at the bucket"', !!s, s && s.chip);
  s = await until(page, (q) => q.ring === "wring", 2000);
  g.check("full: the bucket is outlined", !!s);
  const d0 = (await st(page)).clean.dirty;
  await walkTo(page, 120, 560);
  s = await st(page);
  g.check("a full beard cleans nothing", s.clean.dirty === d0, [d0, s.clean.dirty]);
  await still(page, "03-full-beard-bucket-outlined");
  await walkTo(page, C.WRING_AT.x, C.WRING_AT.y);
  s = await until(page, (q) => q.act === "WRING · beard", 3000);
  g.check("WRING · beard at the bucket", !!s, (await st(page)).act);
  await press(page);
  const seen = await readLines(page, (q) => q.clean && q.clean.wrung >= 1 && q.ctrl, 15000);
  s = await st(page);
  g.check("the first wring plays the beard pictures, then the beard is empty (it cleans what it stands by at once)", seen.includes("cutaway") && s.clean.beard < 0.2 && s.clean.wrung === 1, [seen, s.clean.beard]);
  // the fur
  s = await until(page, (q) => q.cur === "bub", 5000);
  g.check('then the fur: "Fur?"', !!s && s.text === line("mops-fur"), s && s.text);
  await still(page, "04-fur");
  const lines = await followFur(page);
  s = await st(page);
  const want = [line("mops-fur"), line("mops-no-no"), line("mops-oh-no"), line("mops-nobody-saw")];
  g.check("the fur's lines, in order", JSON.stringify(lines) === JSON.stringify(want), lines);
  g.check("the vent took the first tuft; the trail's tufts are all mopped", s.clean.trail[0].state === "vent" && s.clean.trail.slice(1).every((t) => t.state === "gone"), s.clean.trail);
  g.check("no photo, no hat on the floor: the trail ends at fur in his doorway", s.clean.find.kind === "fur", s.clean.find);
  await walkTo(page, s.clean.find.x, s.clean.find.y - 30);
  s = await until(page, (q) => q.act === "PICK UP · fur", 3000);
  g.check("PICK UP · fur", !!s, (await st(page)).act);
  errors.length && g.check("no page errors", false, errors);
}

// ---------- ↺ in the cleanup starts it over clean ----------
{
  const { page } = await openP9();
  await fillAndWring(page);
  await readLines(page, (q) => q.clean && q.clean.ti >= 1 && q.ctrl, 10000);
  await page.evaluate(() => window.__ss.sectionReset());
  const s = await until(page, (q) => q.now.scene === "P9" && q.ctrl && !q.cur, 8000);
  g.check("↺ in the cleanup: the hall dirty again, the beard empty, no wring yet, no fur, nothing picked up, still Mops", !!s && s.clean.dirty > s.clean.patches * 0.95 && s.clean.beard < 0.1 && s.clean.wrung === 0 && s.clean.ti === -1 && s.clean.trail.every((t) => t.state === "wait") && !s.clean.found && s.now.player === "mops" && s.chip === line("chip-mop"), s && [s.clean.dirty, s.clean.wrung, s.clean.ti, s.now.player, s.chip]);
}

// ---------- a sticky spill needs two passes ----------
{
  const { page } = await openP9();
  const sp = C.SPILLS[0];
  // (straight there along the back, so the beard still has room when he reaches the spill)
  await page.evaluate((p) => ((window.__ss.op.mo.x = p[0]), (window.__ss.op.mo.y = p[1])), [sp.x - 110, sp.y]);
  await sleep(200);
  await walkTo(page, sp.x + 90, sp.y);
  let s = await st(page);
  const one = s.clean.spills[0];
  await still(page, "02b-spill-after-one-pass");
  await walkTo(page, sp.x - 110, sp.y);
  s = await st(page);
  g.check("a sticky spill needs two passes (one leaves it, the second takes it)", one === 1 && s.clean.spills[0] === 2, [one, s.clean.spills[0], s.clean.beard]);
}

// ---------- the tufts show one at a time, outlined ----------
{
  const { page } = await openP9();
  await fillAndWring(page);
  await readLines(page, (q) => q.clean && q.clean.ti >= 1 && q.ctrl, 10000);
  const s = await st(page);
  g.check("one tuft at a time: only the next one shows", s.clean.trail.filter((t) => t.state === "show").length === 1 && s.clean.trail.filter((t) => t.state === "wait").length === 3, s.clean.trail);
  g.check("the tuft he goes to next has the dashed outline", !!s.clean.lit && Math.abs((s.clean.lit.x0 + s.clean.lit.x1) / 2 - s.clean.trail[1].x) < 2, s.clean.lit);
  await still(page, "05-trail-tuft-outlined");
}

// ---------- the photo: he joined the group photo ----------
{
  const { page } = await openP9(() => {}).then(async (o) => o);
  await page.evaluate(() => (window.__ss.op.ch1PartyNow.shot = { phase: "done", got: true }));
  await page.evaluate(() => window.SSQ.beat("ch1-party").restart());
  await until(page, (q) => q.ctrl && !q.cur, 8000);
  await fillAndWring(page);
  await followFur(page);
  let s = await st(page);
  g.check("he joined the photo: the trail ends at the Polaroid", s.clean.find.kind === "photo", s.clean.find);
  await still(page, "06-polaroid-on-the-floor");
  await walkTo(page, s.clean.find.x, s.clean.find.y + 30);
  s = await until(page, (q) => q.act === "PICK UP · photo", 3000);
  g.check("PICK UP · photo", !!s, (await st(page)).act);
  await press(page);
  s = await until(page, (q) => q.clean.close === "shirt", 3000);
  g.check("the Polaroid close-up: his shirt first", !!s);
  await still(page, "07-polaroid-close-up-shirt");
  const T = s.clean.targets;
  // a tap on his feet first does nothing (one new thing at a time)
  await tap(page, T.feet.x, T.feet.y);
  await sleep(300);
  s = await st(page);
  g.check("a tap on his feet before his shirt does nothing", s.clean.close === "shirt" && !s.cur, [s.clean.close, s.cur]);
  await tap(page, T.shirt.x, T.shirt.y);
  s = await until(page, (q) => q.cur === "bub", 2000);
  g.check('his shirt: "That\'s MY shirt."', !!s && s.text === line("mops-my-shirt"), s && s.text);
  await next(page);
  s = await until(page, (q) => q.clean.close === "feet" && !q.cur, 3000);
  await still(page, "08-polaroid-close-up-feet");
  await tap(page, T.feet.x, T.feet.y);
  await sleep(500);
  await still(page, "09-the-heart-pops");
  const seen = await readLines(page, (q) => q.clean.found && q.ctrl, 10000);
  g.check('his feet: the heart pops, "Weee...?!", "Squatch."', JSON.stringify(seen) === JSON.stringify([line("mops-weee"), line("mops-squatch")]), seen);
  s = await st(page);
  g.check('then "Mops: go home", his doorway outlined', s.chip === line("chip-mops-home") && !!(await until(page, (q) => q.ring === "go-home", 2000)), s.chip);
  // home, the switch back, and the talk: TELL
  await tap(page, 477, 620);
  const talk = await readLines(page, (q) => q.now && q.now.truthOpen, 25000);
  s = await st(page);
  g.check("home: the card says Squatch again, then Mops asks", talk.includes("card:You are SQUATCH now.") && talk.slice(-2).join("|") === [line("mops-squatch"), line("mops-did-you-go")].join("|") && s.now.player === "sq", talk);
  await still(page, "10-truth-or-fib");
  const tg = await page.evaluate(() => window.SSQ.beat("ch1-party").truthTargets());
  g.check("the two buttons are on the screen", !!tg && !!tg.tell && !!tg.fib, tg);
  await page.mouse.click(tg.tell.x, tg.tell.y);
  const after = await readLines(page, (q, seen) => seen.includes(line("mops-heres-why")), 40000);
  const tell = [line("sq-yes-went"), line("sq-just-dance"), line("mops-i-know"), line("mops-nice-shirt"), line("mops-never-hide"), line("sq-someone"), line("sq-except"), line("mops-have-me")];
  g.check("TELL: the truth's lines in order, then the approved ones", JSON.stringify(after.slice(0, tell.length)) === JSON.stringify(tell), after);
  s = await st(page);
  g.check("TELL: the Polaroid is his, by his bed", s.now.keptPhoto === "bed", s.now.keptPhoto);
  g.check("the talk goes on to the flyer and the TV as built", after.includes(line("sq-robots-coming")) && after.includes(line("mops-heres-why")), after);
}

// ---------- the hat, and FIB ----------
{
  const { page } = await openP9();
  await page.evaluate(() => (window.__ss.op.ch1PartyNow.fallen = [{ id: "tophat", x: 560, y: 470, rot: 0.6, to: "floor" }]));
  await page.evaluate(() => window.SSQ.beat("ch1-party").restart());
  await until(page, (q) => q.ctrl && !q.cur, 8000);
  await fillAndWring(page);
  await followFur(page);
  let s = await st(page);
  g.check("no photo, his top hat on the floor: the trail ends at the hat", s.clean.find.kind === "hat" && s.clean.find.x === 560, s.clean.find);
  await still(page, "11-the-hat");
  await walkTo(page, s.clean.find.x, s.clean.find.y + 30);
  s = await until(page, (q) => q.act === "PICK UP · hat", 3000);
  g.check("PICK UP · hat", !!s, (await st(page)).act);
  await press(page);
  const seen = await readLines(page, (q) => q.clean.found && q.ctrl, 10000);
  const fallen = await page.evaluate(() => JSON.stringify(window.__ss.op.ch1PartyNow.fallen || []));
  g.check("the hat is off the floor once he has it (nothing lies there any more)", !fallen.includes("tophat"), fallen);
  g.check('the hat: "That\'s MY hat.", the heart, "Weee...?!", "Squatch."', JSON.stringify(seen) === JSON.stringify([line("mops-my-hat"), line("mops-weee"), line("mops-squatch")]), seen);
  await tap(page, 477, 620);
  await readLines(page, (q) => q.now && q.now.truthOpen, 25000);
  const tg = await page.evaluate(() => window.SSQ.beat("ch1-party").truthTargets());
  await page.mouse.click(tg.fib.x, tg.fib.y);
  const after = await readLines(page, (q, seen) => seen.includes(line("mops-have-me")), 40000);
  const fib = [line("sq-stayed-in"), line("mops-went"), line("sq-sorry-fib"), line("mops-never-hide"), line("sq-someone"), line("sq-except"), line("mops-have-me")];
  g.check("FIB: the fib's lines in order (\"You went to the party.\" as the answer), then the same approved ones", JSON.stringify(after.slice(0, fib.length)) === JSON.stringify(fib), after);
  s = await st(page);
  g.check("FIB: nothing is taken away (no stars lost, nobody punished)", s.now.scene === "P9b" && !s.now.alarm, [s.now.scene, s.now.alarm]);
}

// ---------- Spotless! ----------
{
  const { page } = await openP9();
  await fillAndWring(page);
  await followFur(page);
  await page.evaluate(() => window.SSQ.beat("ch1-party").cleanAll());
  const s = await until(page, (q) => q.clean.spotless, 3000);
  g.check('the whole hall clean: "Spotless!" (no points)', !!s);
  await sleep(300);
  await still(page, "12-spotless");
}

// ---------- the endings lead here ----------
{
  // closing time, Squatch home first: the wall speaker, then the switch card, then the hall
  const { page } = await g.open("?beat=party:P8b", PHONE);
  await sleep(1400);
  await until(page, (q) => q.ctrl && q.now.close && q.now.close.phase !== "speak", 20000, async (q) => q.cur === "bub" && (await next(page)));
  await tap(page, 477, 620);
  const seen = await readLines(page, (q) => q.now && q.now.scene === "P9" && q.ctrl && !q.cur, 30000);
  g.check("closing time, home on his own: the wall speaker calls Mops, then the switch card, then the hall", seen.includes(line("pa-mops-hall")) && seen.includes("card:You are MOPS now.") && seen.indexOf(line("pa-mops-hall")) < seen.indexOf("card:You are MOPS now."), seen);
  await still(page, "13-from-closing-time");
}
{
  // after the alarm, "Keep going": "Stay in here." before Mops goes
  const { page } = await g.open("?beat=party:P8a", PHONE);
  await sleep(1400);
  const seen = await readLines(page, (q) => q.now && q.now.scene === "P9" && q.ctrl && !q.cur, 30000);
  g.check('after the alarm: the wall speaker, "Stay in here.", the switch card, the hall', seen.slice(0, 3).join("|") === [line("pa-mops-hall"), line("mops-stay-in"), "card:You are MOPS now."].join("|"), seen);
  // ...and when Mops comes home, Squatch comes out from under the bed for the talk
  await page.evaluate(() => {
    const p = window.__ss.op.ch1PartyNow;
    p.clean.found = true;
    p.clean.phase = "home";
  });
  await tap(page, 477, 620);
  const home = await readLines(page, (q) => q.now && q.now.truthOpen, 25000);
  const s = await st(page);
  g.check("home after the alarm: Squatch is out from under the bed, Mops asks", s.now.pose === "stand" && home.includes(line("mops-did-you-go")), [s.now.pose, home]);
}

// ---------- a robot that does only what a kid can do gets through the cleanup ----------
{
  const { page, errors } = await openP9();
  const t0 = Date.now();
  // it steers (taps on the floor), reads the chip and the outlines, presses the big button, taps NEXT
  for (let i = 0; i < 400; i++) {
    const s = await st(page);
    if (s.now.scene === "P9b") break;
    if (s.cur === "bub" || s.cur === "card" || s.cur === "cutaway") {
      await sleep(120);
      await next(page);
      continue;
    }
    if (!s.ctrl) {
      await sleep(120);
      continue;
    }
    if (s.clean.close) {
      const T = s.clean.targets;
      const b = s.clean.close === "shirt" ? T.shirt : s.clean.close === "feet" ? T.feet : null;
      b ? await tap(page, b.x, b.y) : await sleep(150);
      continue;
    }
    if (s.act && s.act !== "") {
      await press(page);
      await sleep(200);
      continue;
    }
    if (s.ring === "wring") await walkTo(page, C.WRING_AT.x, C.WRING_AT.y);
    else if (s.ring === "go-home") await tap(page, 477, 620), await sleep(800);
    else if (s.clean.lit) await mopAt(page, (s.clean.lit.x0 + s.clean.lit.x1) / 2, (s.clean.lit.y0 + s.clean.lit.y1) / 2 + 4);
    else await walkTo(page, 90 + Math.random() * 680, 320 + Math.random() * 260, 4000);
  }
  const s = await st(page);
  g.check("a robot that only steers, taps and presses the big button gets through the cleanup and home", s.now.scene === "P9b", [s.now.scene, s.clean && s.clean.phase, Math.round((Date.now() - t0) / 1000) + " s"]);
  errors.length && g.check("no page errors", false, errors);
}

await g.finish("party-cleanup");
