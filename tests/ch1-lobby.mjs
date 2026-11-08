/**
 * The night out (D15): the vent's pull, the notice and its chips (Chapter 1 pass, item 4).
 *   node tests/ch1-lobby.mjs
 *
 * (a) The puzzle: every way from the closet door to the brochure table crosses the vent's pull or a
 *     sightline (a cell some cone covers some of the time), and each kind of way exists.
 * (b) The vent: its pull is drawn (the floor just inside the circle is tinted, just outside is not);
 *     within 1.5 times the circle the tuft shows before the clock starts; in the pull it drifts; during a
 *     sighting chase the pull keeps counting, so the tuft never freezes; walking straight through with the arrow keys never sets off the
 *     alarm; staying in the pull sets it off, and standing still until security arrives shows the LOCKUP
 *     card with row 25.10, then the night starts over at the closet door with the notice unread.
 *     HIDE! after the alarm takes Squatch into the closet with "They lost you." and the door to try again.
 * (c) The watchers shout the spine's fur words (rows 25.2 to 25.4), never "A WOOKIE!", and each one sees
 *     a point inside its drawn cone.
 * (d) The notice: READ · notice at the table (row 18.204), the close-up shows rows 25.5 to 25.7, the
 *     whisper is row 25.8, and Squatch holds the notice; ENTER · closet (18.205) leads to O5 with the
 *     inspection line (25.14, with the ear).
 * (e) The chips follow the chip rule: 18.201 until he sees the table, then 18.202, then 18.203; 18.5
 *     while security is coming.
 */
import { startGame, readLines } from "./game-page.mjs";

const L = readLines();
const g = await startGame({ port: 8802, name: "ch1-lobby" });
const { page, errors } = await g.open("?ch=2");
const fresh = () =>
  page.evaluate(() => {
    const ss = window.__ss, n = ss.op;
    ss.startOpening(); ss.drain(); ss.sceneO4();
    n.q = []; n.cur = null; n.live = []; n.ctrl = true;
    return ss.lobby();
  });

// (a) Routes, on a 10-pixel grid of the lobby floor.
{
  await fresh();
  const r = await page.evaluate(() => {
    const ss = window.__ss, lb = ss.lobby(), b = ss.walkBounds(), solids = ss.solids();
    const wedge = (px, py, c) => {
      const dx = px - c.ox, dy = py - c.oy, d = Math.hypot(dx, dy);
      if (d > c.len || d < 1) return false;
      let a = Math.atan2(dy, dx) - c.a;
      while (a > Math.PI) a -= 2 * Math.PI;
      while (a < -Math.PI) a += 2 * Math.PI;
      return Math.abs(a) < c.half;
    };
    // The cones' own sweep, sampled over a minute of play.
    const n = ss.op, keepT = n.T, sweeps = [];
    for (let t = 0; t < 60; t += 0.05) { n.T = t; sweeps.push(ss.lobby().cones); }
    n.T = keepT;
    const cells = new Map();
    for (let x = Math.ceil(b.x0 / 10) * 10; x <= b.x1; x += 10)
      for (let y = Math.ceil(b.y0 / 10) * 10; y <= b.y1; y += 10) {
        if (solids.some((s) => x > s.x0 && x < s.x1 && y > s.y0 && y < s.y1)) continue;
        const seen = sweeps.some((cs) => cs.some((c) => wedge(x, y - 30, c)));
        cells.set(x + "," + y, { seen, vent: Math.hypot(x - lb.vent.x, y - lb.vent.y) < lb.vent.r });
      }
    const reaches = (ok) => {
      const seen = new Set(["480,560"]), q = [[480, 560]];
      while (q.length) {
        const [x, y] = q.shift();
        if (Math.hypot(x - lb.table.x, y - (lb.table.y + 50)) < 80) return true;
        for (const [dx, dy] of [[10, 0], [-10, 0], [0, 10], [0, -10]]) {
          const k = x + dx + "," + (y + dy), c = cells.get(k);
          if (c && !seen.has(k) && ok(c)) (seen.add(k), q.push([x + dx, y + dy]));
        }
      }
      return false;
    };
    return { start: cells.get("480,560"), clear: reaches((c) => !c.seen && !c.vent), viaVent: reaches((c) => !c.seen), viaCones: reaches((c) => !c.vent) };
  });
  g.check("the closet door is out of the vent and every cone", !!r.start && !r.start.seen && !r.start.vent, r);
  g.check("no way to the table avoids both the vent's pull and every sightline", !r.clear, r);
  g.check("there is a way through the vent's pull that no cone ever covers", r.viaVent, r);
  g.check("there is a way around the vent that crosses a sightline", r.viaCones, r);
}

// (b) The vent.
{
  const lb = await fresh();
  const tint = await page.evaluate((v) => {
    const ss = window.__ss, n = ss.op;
    n.sq.x = 200; n.sq.y = 560;
    ss.drawFrame();
    const cv = document.querySelector("canvas"), k = cv.width / 960, cx = cv.getContext("2d");
    const px = (x, y) => Array.from(cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data);
    return { inside: px(v.x, v.y + v.r - 6), outside: px(v.x, v.y + v.r + 10) };
  }, lb.vent);
  g.check("the pull is drawn before it can bite: the floor inside the circle is tinted, outside is not", tint.inside.join() !== tint.outside.join() && tint.inside[2] > tint.inside[0], tint);
  const near = await page.evaluate((v) => {
    const ss = window.__ss, n = ss.op;
    n.sq.x = v.x; n.sq.y = v.y + v.r * 1.3;
    for (let i = 0; i < 6; i++) ss.tick(0.05);
    const warn = ss.lobby();
    n.sq.x = v.x; n.sq.y = v.y + v.r - 10;
    for (let i = 0; i < 6; i++) ss.tick(0.05);
    const a = ss.lobby();
    n.sq.x = v.x; n.sq.y = v.y + v.r * 1.5 + 30;
    for (let i = 0; i < 20; i++) ss.tick(0.05);
    return { warn, inPull: a, after: ss.lobby() };
  }, lb.vent);
  g.check("within 1.5 times the circle the tuft shows before the clock starts", near.warn.tuft && near.warn.near && near.warn.pull === 0, near.warn);
  g.check("near the vent the tuft shows and nothing else happens yet", near.inPull.tuft && near.inPull.pull > 0 && !near.inPull.looked, near.inPull);
  g.check("out of the pull the tuft drifts back and is gone", !near.after.tuft && near.after.pull === 0 && !near.after.looked, near.after);

  // During a sighting chase the pull keeps counting (in) and draining (out), so the tuft moves with him.
  await fresh();
  const chase = await page.evaluate((v) => {
    const ss = window.__ss, n = ss.op, c = ss.lobby().cones[1];
    n.sq.x = c.ox + Math.cos(c.a) * 110; n.sq.y = c.oy + Math.sin(c.a) * 110 + 30;
    ss.tick(0.02);
    for (let i = 0; i < 40 && n.hopTo; i++) ss.tick(0.05);
    const seen = ss.lobby().runner || ss.lobby().looked;
    n.sq.x = v.x; n.sq.y = v.y;
    for (let i = 0; i < 6; i++) ss.tick(0.05);
    const inn = ss.lobby().pull;
    n.sq.x = v.x; n.sq.y = v.y + v.r * 1.5 + 40;
    for (let i = 0; i < 3; i++) ss.tick(0.05);
    return { seen, inn, out: ss.lobby().pull };
  }, lb.vent);
  g.check("during a sighting chase the pull still rises in the circle and drains out of it (the tuft never freezes)", chase.seen && chase.inn > 0.2 && chase.out < chase.inn, chase);

  // Walking straight through with the keys: the tuft shows, the alarm does not. The column x = 650 is
  // the gap between the man in the suit's cone and the clerk's; the walk starts as the suit's cone swings
  // away from it (game time 0.8 s: its sweep is at the far side), as a player would wait for.
  await fresh();
  await page.evaluate(() => {
    const n = window.__ss.op;
    n.T = 0.8; n.sq.x = 650; n.sq.y = 580; window.__maxPull = 0;
    const w = () => { window.__maxPull = Math.max(window.__maxPull, window.__ss.op.pull || 0); requestAnimationFrame(w); };
    requestAnimationFrame(w);
  });
  await page.keyboard.down("ArrowUp");
  await page.waitForFunction(() => window.__ss.op.sq.y < 340 || !window.__ss.op.ctrl, { timeout: 8000 });
  await page.keyboard.up("ArrowUp");
  const pass = await page.evaluate(() => ({ lobby: window.__ss.lobby(), max: window.__maxPull, alarm: window.__ss.op.live.some((l) => l.text === "FUR IN THE VENT!"), y: window.__ss.op.sq.y }));
  g.check("walking straight through the pull with the arrow keys: the tuft shows, no alarm", pass.max > 0.3 && pass.max < pass.lobby.bite && !pass.lobby.looked && !pass.alarm && pass.y < 340, pass);

  // Staying in the pull.
  await fresh();
  await page.evaluate((v) => { const n = window.__ss.op; n.sq.x = v.x; n.sq.y = v.y + 20; n.log.length = 0; }, lb.vent);
  await page.waitForFunction(() => window.__ss.lobby().looked, { timeout: 6000 });
  const alarm = await page.evaluate(() => ({ lobby: window.__ss.lobby(), fur: window.__ss.op.log.some((e) => e.text === "FUR IN THE VENT!"), chip: window.__ss.chipNow(), offer: window.__ss.offerNow() && window.__ss.offerNow().verb }));
  g.check("staying in the pull: the fur goes in, FUR IN THE VENT! (row 25.9), security comes", alarm.fur && alarm.lobby.by === "lobbyvent" && alarm.lobby.guards.length > 0 && L["25.9"] === "FUR IN THE VENT!", alarm);
  g.check("while security comes the chip is row 18.5 and HIDE! · closet is offered", alarm.chip === L["18.5"] && alarm.offer === "HIDE!", alarm);
  await page.waitForFunction(() => { const c = window.__ss.op.cur; return c && c.id === "jail"; }, { timeout: 15000 });
  const card = await page.evaluate(() => window.__ss.op.cur.cause);
  g.check("standing still, security reaches him: LOCKUP with row 25.10", card === L["25.10"], { card, want: L["25.10"] });
  await page.evaluate(() => window.__ss.drain());
  const back = await page.evaluate(() => { const n = window.__ss.op; return { scene: n.scene, room: n.room, x: n.sq.x, y: n.sq.y, ctrl: n.ctrl, lobby: window.__ss.lobby() }; });
  g.check("the night starts over at the closet door, notice unread, no alarm", back.scene === "O4" && back.room === "lobby" && back.x === 480 && back.y === 560 && back.ctrl && !back.lobby.noticeRead && !back.lobby.looked && back.lobby.pull === 0, back);

  // HIDE! after the alarm.
  await page.evaluate((v) => { const n = window.__ss.op; n.sq.x = v.x; n.sq.y = v.y + 20; n.log.length = 0; }, lb.vent);
  await page.waitForFunction(() => window.__ss.lobby().looked, { timeout: 6000 });
  await page.evaluate(() => { const a = window.__ss.offerNow(); a && a.verb === "HIDE!" && a.f(); });
  await page.waitForFunction(() => window.__ss.op.scene === "O3b", { timeout: 6000 });
  const hid = await page.evaluate(() => { const ss = window.__ss, n = ss.op; n.sq.x = 790; n.sq.y = 470; const a = ss.offerNow(); return { room: n.room, lost: n.log.some((e) => e.text === "They lost you."), offer: a && a.verb + " · " + a.cap }; });
  g.check('HIDE! runs him into the closet: "They lost you." and the door offers SNEAK OUT again', hid.room === "closet" && hid.lost && hid.offer === "SNEAK OUT · door", hid);
}

// (c) The watchers.
for (const [k, row] of [[0, "25.2"], [1, "25.3"], [2, "25.4"]]) {
  await fresh();
  const r = await page.evaluate((k) => {
    const ss = window.__ss, n = ss.op, c = ss.lobby().cones[k];
    n.sq.x = c.ox + Math.cos(c.a) * 110; n.sq.y = c.oy + Math.sin(c.a) * 110 + 30;
    ss.tick(0.02);
    return { lobby: ss.lobby(), live: n.live.map((l) => l.text) };
  }, k);
  g.check(`watcher ${k + 1} sees a point inside its drawn cone and shouts row ${row}`, r.lobby.runner && r.live.includes(L[row]) && !r.live.includes("A WOOKIE!"), r);
}

// (d) and (e): the notice and the chips.
{
  await fresh();
  const s = await page.evaluate(() => {
    const ss = window.__ss, n = ss.op, out = {};
    out.start = ss.chipNow();
    const t = ss.lobby().table;
    n.sq.x = t.x - 110; n.sq.y = t.y + 210; ss.tick(0.05);
    out.seen = ss.chipNow();
    n.sq.x = t.x - 20; n.sq.y = t.y + 50; ss.tick(0.05);
    const a = ss.offerNow();
    out.offer = a && a.verb + " · " + a.cap;
    a && a.f();
    for (let i = 0; i < 4; i++) ss.tick(0.05);
    out.cur = n.cur && n.cur.k + ":" + n.cur.id;
    ss.drawFrame();
    out.shown = ss.shown();
    n.cur = null; ss.tick(0.05);
    out.whisper = n.cur && n.cur.b && n.cur.b.text;
    n.cur = null; ss.tick(0.05);
    out.home = ss.chipNow();
    out.lobby = ss.lobby();
    return out;
  });
  g.check("chip before he sees the table is row 18.201", s.start === L["18.201"], s.start);
  g.check("chip once the table is in view is row 18.202", s.seen === L["18.202"], s.seen);
  g.check("at the table the button reads row 18.204", s.offer === L["18.204"], s.offer);
  g.check("reading opens the notice close-up", s.cur === "panel:notice", s.cur);
  g.check("the notice shows rows 25.5 to 25.7", ["ROBOT JANITORS", "COMING.", L["25.7"], L["25.5"]].every((w) => s.shown.includes(w)) && L["25.6"] === "ROBOT JANITORS COMING.", s.shown.filter((w) => /ROBOT|COMING|fur|NOTICE/.test(w)));
  g.check("after the notice Squatch whispers row 25.8 and holds the notice", s.whisper === L["25.8"] && s.lobby.holdNotice && s.lobby.noticeRead, s.lobby);
  g.check("then the chip is row 18.203", s.home === L["18.203"], s.home);
  const o5 = await page.evaluate(() => {
    const ss = window.__ss, n = ss.op;
    n.sq.x = 480; n.sq.y = 560;
    const a = ss.offerNow(), offer = a && a.verb + " · " + a.cap;
    a && a.f();
    for (let i = 0; i < 80 && n.scene !== "O5"; i++) ss.tick(0.05);
    const b = [n.cur, ...n.q].find((r) => r && r.k === "bub");
    return { offer, scene: n.scene, line: b && b.b.text, ear: b && b.b.ear, who: b && b.b.who };
  });
  g.check("ENTER · closet (row 18.205) takes him home to O5", o5.offer === L["18.205"] && o5.scene === "O5", o5);
  g.check("O5 opens with Security's voice through the door, row 25.14 with the ear", o5.line === L["25.14"] && o5.ear === true && o5.who === "bot", o5);
}
g.check("no page errors", errors.length === 0, errors);
await g.finish("ch1-lobby");
