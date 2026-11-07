/**
 * The soup sits on Mops' head and looks like soup (task T10).
 * In g4 with the soup, samples the picture for one second: the bowl's bottom edge stays within
 * 4 px of the top of Mops' head at every bob, the bowl is at least 48 px wide, soup-colored pixels
 * (#f2b84b) fill the top of the bowl, and the white bowl reaches down to the head.
 *   node tests/soup-on-head.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8786, name: "soup-on-head" });
const { ctx, page, errors } = await g.open("?ch=2");

for (const f of [-1, 1]) {
  await page.evaluate((f) => {
    const ss = window.__ss;
    ss.ch2.jar = 0; ss.ch2.has = "soup";
    ss.resetTo("g4");
    const n = ss.op;
    n.mo.x = 560; n.mo.y = 520; n.mo.f = f; n.mo.moving = false; n.live = [];
    ss.ch2.has = "soup";
  }, f);
  await sleep(900); // let the room fade after the reset finish
  const rows = [];
  for (let i = 0; i < 10; i++) {
    rows.push(
      await page.evaluate(() => {
        const n = window.__ss.op;
        const s = n.soupAt;
        const c = document.querySelector("canvas");
        const g2 = c.getContext("2d", { willReadFrequently: true });
        const headTop = n.mo.y - 37.5 * 1.6 * 1.15;
        const hx = n.mo.x + 17 * 1.6 * 1.15 * (n.mo.f || 1);
        let soup = 0;
        const box = g2.getImageData(Math.round(hx - 26), Math.round(headTop - 34), 52, 24).data;
        for (let j = 0; j < box.length; j += 4) if (box[j] > 225 && box[j + 1] > 165 && box[j + 1] < 200 && box[j + 2] > 50 && box[j + 2] < 100) soup++;
        const white = g2.getImageData(Math.round(hx), Math.round(headTop - 6), 1, 1).data;
        // No gap: from 5 px above the head top to 5 px below it, the column is bowl or head (white) or outline (dark).
        const col = g2.getImageData(Math.round(hx), Math.round(headTop - 5), 1, 11).data;
        let gap = 0;
        for (let j = 0; j < col.length; j += 4) {
          const wht = col[j] > 220 && col[j + 1] > 220 && col[j + 2] > 220;
          const dark = col[j] < 90 && col[j + 1] < 90 && col[j + 2] < 100;
          if (!wht && !dark) gap++;
        }
        return {
          bottom: s && Math.round(s.bottom * 10) / 10,
          headTop: Math.round(headTop * 10) / 10,
          drawnTop: s && Math.round(s.headTop * 10) / 10,
          w: s && s.w,
          soup,
          white: [white[0], white[1], white[2]],
          gap,
        };
      }),
    );
    await sleep(100);
  }
  const side = f > 0 ? "facing right" : "facing left";
  g.check(`${side}: the bowl's bottom stays within 4 px of the head top at every bob`, rows.every((r) => r.bottom != null && Math.abs(r.bottom - r.headTop) <= 4), rows);
  g.check(`${side}: the bowl is drawn from Mops' own head position`, rows.every((r) => Math.abs(r.drawnTop - r.headTop) < 0.5), rows[0]);
  g.check(`${side}: the bowl is at least 48 px wide`, rows.every((r) => r.w >= 48), rows[0]);
  g.check(`${side}: soup-colored pixels fill the top of the bowl`, rows.every((r) => r.soup > 40), rows.map((r) => r.soup));
  g.check(`${side}: no gap between the bowl and his head (anti-aliased edges allowed)`, rows.every((r) => r.gap <= 2), rows.map((r) => r.gap));
  g.check(`${side}: the white bowl reaches down to his head`, rows.every((r) => r.white[0] > 230 && r.white[1] > 230 && r.white[2] > 230), rows.map((r) => r.white));
}
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("soup-on-head");
