/**
 * Mops's hearts, one rule for the chapter (src/modules/mops-hearts.js; Brian 2026-11-27, video notes r5 3:45, 7:18,
 * 8:14; question 126, the pick A): two or three the first time he sees Squatch in a scene, then none; one heart at a
 * story moment; none in the fight (tests/evening.mjs checks the fight and the walk home).
 *   node tests/mops-hearts.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const H = await import(M("mops-hearts.js"));
const g = await startGame({ port: 9655, name: "mops-hearts" });
g.check("first sight: two or three hearts, for 2 to 3 seconds; a story moment: one heart", H.FIRST_SIGHT.count >= 2 && H.FIRST_SIGHT.count <= 3 && H.FIRST_SIGHT.seconds >= 2 && H.FIRST_SIGHT.seconds <= 3 && H.STORY_HEART.count === 1, H);
const at = (t) => H.firstSightHearts(t).length;
g.check("the hearts set off one after another and are gone after their time: none before, none after, never more than the count", at(-1) === 0 && at(0.2) >= 1 && at(H.FIRST_SIGHT.seconds + 0.01) === 0 && at(60) === 0 && [0.2, 0.6, 1, 1.4, 1.8, 2.2].every((t) => at(t) <= H.FIRST_SIGHT.count), [0.2, 0.6, 1, 1.4, 1.8, 2.2].map(at));
// no scene draws hearts on a loop any more: every Mops heart drawing goes by an age through this rule
const src = (f) => readFileSync(M(f), "utf8");
g.check("the warm cone's hearts, the lunch hallway's hearts and the story hearts all go by mops-hearts.js", /firstSightHearts\(age\)/.test(src("party-free-art.js")) && /firstSightHearts\(age\)/.test(src("lunch-sneak-art.js")) && /STORY_HEART\.count/.test(src("escape-art.js")) && /firstSightHearts\(/.test(src("evening.js")));

// in the game: the loading bay's walk home (Brian's note r5 3:45): his cone holds Squatch all the way; the hearts show once
const { page, errors } = await g.open("?beat=bay:home", { width: 375, height: 812, isMobile: true, hasTouch: true });
await new Promise((r) => setTimeout(r, 900));
const bay = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-bay"),
    seen = [];
  for (let i = 0; i < 200; i++) {
    n.cur && n.cur.b && ((n.bt = 1), ss.opTap());
    // (he stands in front of Mops, in his cone, unrolled and out of the plant)
    if (n.ctrl && !n.cur) {
      const b = n.ch1Bay;
      b.hidden = false;
      b.ball = false;
      n.sqPose = "stand";
      n.sq.x = n.mo.x + (n.mo.f || 1) * 90;
      n.sq.y = n.mo.y;
    }
    ss.tick(0.05);
    ss.drawFrame();
    const c = ((beat.debug().drew || {}).cones || []).find((q) => q.hearts);
    seen.push(c ? (c.heartsUp ? 2 : 1) : 0);
  }
  const first = seen.indexOf(2),
    lastUp = seen.lastIndexOf(2),
    warmAfter = seen.slice(lastUp + 1).filter((v) => v === 1).length;
  return { step: (n.ch1Bay || {}).step, room: n.room, first, upFrames: seen.filter((v) => v === 2).length, warmAfter, total: seen.length };
});
g.check("the loading bay (after the box): Mops's warm cone holds Squatch; its hearts float up once, for 2 to 3 seconds, then the cone stays warm with no hearts", bay.first >= 0 && bay.upFrames * 0.05 <= H.FIRST_SIGHT.seconds + 0.2 && bay.upFrames * 0.05 >= 1.5 && bay.warmAfter > 20, bay);
g.check("no page errors", errors.length === 0, errors.slice(0, 3));
await g.finish("mops-hearts");
