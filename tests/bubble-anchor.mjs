/**
 * Speech bubbles sit over the speaker, one at a time (task T9).
 * Plays the Chapter 2 scenes (sceneG0 to sceneG6 and the actions between them) with Space presses.
 * Every bubble drawn must sit within 120 px vertically and 220 px horizontally of where its speaker
 * is drawn, or be an ear bubble at a door or edge when the speaker is in another room.
 * Never more than one bubble in a frame.
 *   node tests/bubble-anchor.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8785, name: "bubble-anchor" });

// Steps run in the page. "act" finds the action on the floor and does it.
const SCENES = [
  { name: "G0 arrival", steps: [["scene", "G0"]] },
  { name: "G1 hide by the pump", steps: [["reset", "g1"], ["act", "HIDE"]] },
  { name: "G2 Mops asks for work", steps: [["scene", "G2"], ["act", "ASK"]] },
  { name: "Squatch goes in the kitchen door", steps: [["reset", "back"], ["act", "ENTER"]] },
  { name: "G3 the broadcast", steps: [["set", { done: 3 }], ["reset", "wash1"], ["scene", "G3"]] },
  { name: "G3 hide from the bots", steps: [["reset", "g3hide"], ["act", "HIDE"]] },
  { name: "G4 Mops out front", steps: [["set", { jar: 30, has: "" }], ["reset", "g3hide"], ["scene", "G4"]] },
  { name: "G4 buying the soup", steps: [["set", { jar: 0, has: "coins" }], ["reset", "g4"], ["act", "BUY"]] },
  { name: "G4 the soup in the crate, then G5", steps: [["set", { has: "soup" }], ["reset", "g4k"], ["act", "LEAVE SOUP"]] },
  { name: "G4 the bots argue while Mops is out front", steps: [["set", { has: "soup" }], ["reset", "g4k"], ["act", "FRONT"], ["set", { argueT: 0.2, out: -1 }]], watch: 7000 },
  { name: "G5 next dishes", steps: [["set", { done: 3, held: -1 }], ["reset", "wash5"], ["scene", "G5"]] },
  { name: "G6 the new jar", steps: [["set", { jar: 30, has: "" }], ["reset", "wash5"], ["scene", "G6"]] },
  { name: "G6 the tank", steps: [["set", { jar: 30, has: "" }], ["reset", "wash5"], ["scene", "G6"], ["act", "GRAB"], ["act", "EXIT"], ["act", "GIVE"]] },
];

const DOORS = { kitchen: [60], diner: [60, 880], gas: [85, 300] };

const { ctx, page, errors } = await g.open("?ch=2");
let checked = 0;
for (const sc of SCENES) {
  const err = await page.evaluate((steps) => {
    const ss = window.__ss;
    const n = ss.op;
    const k = ss.ch2;
    n.q = []; n.cur = null; n.live = []; n.ctrl = true;
    const act = (verb) => {
      const b = ss.walkBounds();
      const who = ss.ch.mops ? n.mo : n.sq;
      if (!ss.ch.mops && n.sqPose === "hidden") n.sqPose = "stand";
      for (let y = b.y0; y <= b.y1; y += 10)
        for (let x = b.x0; x <= b.x1; x += 10) {
          who.x = x; who.y = y;
          const a = ss.pickAct();
          if (a && a.verb === verb) return (a.f(), true);
        }
      return false;
    };
    for (const st of steps) {
      if (st[0] === "reset") ss.resetTo(st[1]);
      else if (st[0] === "set") Object.assign(k, st[1]);
      else if (st[0] === "scene") ss["scene" + st[1]]();
      else if (st[0] === "call") ss[st[1]]();
      else if (st[0] === "act" && !act(st[1])) return "no " + st[1] + " offered";
    }
    return "";
  }, sc.steps);
  g.check(`${sc.name}: the scene starts`, !err, err);
  const deadline = Date.now() + (sc.watch || 0);
  let quiet = 0;
  let bad = [];
  let many = 0;
  let seen = 0;
  for (let i = 0; i < 80; i++) {
    await sleep(160);
    const s = await page.evaluate(() => {
      const ss = window.__ss;
      const n = ss.op;
      const k = ss.ch2;
      const b = ss.lastBubble;
      // Judge only a bubble that is still up now: since T22 a Space pressed early on a bubble is kept and
      // applied at 0.3 s, so the story can move on (even change room) between the last draw and this read.
      const up = b && ((n.cur && n.cur.k === "bub" && n.cur.b.text === b.text) || n.live.some((l) => l.text === b.text));
      const fresh = b && up && performance.now() - b.at < 100 ? b : null;
      const botsRoom = k.bots && k.bots.length ? (k.phase === "g6" ? "gas" : "kitchen") : "";
      const where = (who) => {
        if (who === "sq") return n.sq.x < -100 ? null : { x: n.sq.x, y: n.sq.y - 70 };
        if (who === "mops") return n.mo.x < -100 ? null : { x: n.mo.x, y: n.mo.y - 60 };
        if (who === "gloop") return n.room === "kitchen" ? { x: 690, y: 190 } : n.room === "gas" ? { x: 200, y: 200 } : { x: 480, y: 190 };
        if (who === "rust") return { x: k.rust.x, y: 400 };
        if (who === "blorp") return { x: 240, y: 340 };
        if (who === "cook") return { x: k.cookX || 640, y: (k.cookY || 530) - 60 };
        if (who === "bot" || who === "bot2") {
          const o = k.bots[who === "bot" ? 0 : 1];
          if (o && botsRoom === n.room) return { x: o.x, y: o.y - 40 };
          if (k.sec) return { x: k.sec.x, y: k.sec.y - 40 };
          return null;
        }
        return null;
      };
      const otherRoom = fresh && (fresh.who === "bot" || fresh.who === "bot2") && botsRoom && botsRoom !== n.room;
      return {
        b: fresh && { who: fresh.who, text: fresh.text, x: Math.round(fresh.x), y: Math.round(fresh.y), w: Math.round(fresh.w), h: Math.round(fresh.h), ear: fresh.ear },
        at: fresh ? where(fresh.who) : null,
        otherRoom,
        count: ss.bubbleFrame,
        room: n.room,
        busy: !!n.cur || n.q.length > 0,
        tap: !!n.cur && ["bub", "card", "panel", "wait"].includes(n.cur.k),
        live: n.live.length,
      };
    });
    if (s.count > 1) many++;
    if (s.b) {
      seen++;
      const b = s.b;
      let ok;
      if (b.ear) {
        const doorNear = (DOORS[s.room] || []).some((x) => b.x - 220 <= x && x <= b.x + b.w + 220);
        ok = doorNear || b.x <= 60 || b.x + b.w >= 900;
      } else if (s.otherRoom) ok = false;
      else if (!s.at) ok = false;
      else {
        const dx = Math.max(0, b.x - s.at.x, s.at.x - (b.x + b.w));
        const dy = Math.max(0, b.y - s.at.y, s.at.y - (b.y + b.h));
        ok = dx <= 220 && dy <= 120;
      }
      if (!ok && bad.length < 4) bad.push({ ...s.b, room: s.room, speakerAt: s.at, otherRoom: s.otherRoom });
    }
    if (s.tap) await g.key(page, "Space");
    quiet = !s.busy && !s.live ? quiet + 1 : 0;
    if (quiet >= 3 && Date.now() > deadline) break;
  }
  checked += seen;
  g.check(`${sc.name}: every bubble sits over its speaker or is an ear bubble at a door (${seen} samples)`, bad.length === 0 && seen > 0, bad);
  g.check(`${sc.name}: never two bubbles at once`, many === 0, { many });
}
g.check("bubbles were sampled", checked > 20, { checked });
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("bubble-anchor");
