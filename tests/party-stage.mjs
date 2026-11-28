/**
 * The party hall stage (Chapter 1, walkthrough beats 3 and 5; party plan V1 and V3).
 * Isfred stands on the stage at the mic, one cloth banner (ROBOTICS DELEGATION! over COMING SOON!) hangs above
 * it, the separate poster is gone (Brian 2026-11-23, comments 11 and 14), and the Croc Boys stand on the stage.
 * Checked by the pixels drawn, at computer size, during the sneak (party P2). Clear space under the banner: Isfred
 * (P2) and the Croc Boys playing (P6) stay 6 or more below its bottom edge (Brian 2026-11-25).
 *   node tests/party-stage.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8937, name: "party-stage" });
const { page, errors } = await g.open("?beat=party:P2", { width: 1280, height: 800, deviceScaleFactor: 1 });
await sleep(1800);
// game-space pixel at (x, y): the canvas is drawn at 960 wide
const px = (x, y) => page.evaluate(([x, y]) => { const c = document.querySelector("canvas"), k = c.width / 960; return Array.from(c.getContext("2d").getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data).slice(0, 3); }, [x, y]);
const near = (a, hex, tol = 40) => { const b = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); return a.every((v, i) => Math.abs(v - b[i]) <= tol); };
const { BANNER, CAST } = await import(new URL("../src/modules/party-hall.js", import.meta.url).href);
const state = await page.evaluate(() => ({ room: window.__ss.op.room, now: window.SSQ.beat("ch1-party").now() }));
g.check("the sneak is in the party hall", state.room === "hall" && state.now && state.now.scene === "P2", state);
g.check("the banner hangs above the stage (blue near its left end)", near(await px(BANNER.x0 + 40, BANNER.y0 + 8), "#3478f6"), await px(BANNER.x0 + 40, BANNER.y0 + 8));
g.check("the banner's second line is on the same cloth (white strip under the first line)", near(await px((BANNER.x0 + BANNER.x1) / 2 - 90, BANNER.y0 + (BANNER.y1 - BANNER.y0) * 0.72), "#fffdf8", 20), await px((BANNER.x0 + BANNER.x1) / 2 - 90, BANNER.y0 + 46));
g.check("no separate poster beside the stage (the window shows at 535, 205)", !near(await px(535, 205), "#fffaf0", 12), await px(535, 205));
const col = [];
for (let y = CAST.isfred.y - 60; y <= CAST.isfred.y - 20; y += 3) col.push(await px(CAST.isfred.x, y));
g.check("Isfred is drawn on the stage at the mic", col.some((c) => near(c, "#c9b6f2", 45)), col.slice(0, 4));
const band = [];
// (their shirts are found over the height the hall draws a grown-up, which grew 40% on 2026-11-24)
const adult = await page.evaluate(() => window.SSQ.engine().hallSizes().adult);
for (const b of CAST.band) for (let y = b.y - adult * 0.62; y <= b.y - adult * 0.15; y += 3) band.push(await px(b.x, y));
// (before 2026-11-25 the Croc Boys stood on the stage from the start; Brian: "Shouldn't he be doing announcement alone
// and then have them join?", so until Isfred calls them they are not there)
g.check("in the sneak (before Isfred calls them) the stage is Isfred's alone: no Croc Boy is drawn there", !band.some((c) => near(c, "#ffcf33", 40)) && !band.some((c) => near(c, "#3478f6", 40)), band.slice(0, 6));
const bandCones = await page.evaluate(() => window.SSQ.beat("ch1-party").cones().filter((c) => /^band/.test(c.id)).length);
g.check("and no band cone either (nobody is there to see)", bandCones === 0, bandCones);
g.check("no page errors", errors.length === 0, errors);

// ---------- clear space under the banner (Brian 2026-11-25, "make the fixes you think best") ----------
// Isfred's antennae touched the banner once everyone was 40% bigger. Measured from the picture: the banner's
// lowest blue in each column, and the top of whoever stands under it (the picture with them, less the same
// frame with them moved out of the hall), over a second and a half of their bobbing, the band's jumps and their
// notes. The banner is the game's own drawing (party-art.js drawBanner), not part of the locked hall picture.
const GAP = 6;
async function clearUnder(page, who) {
  return page.evaluate(
    async ({ who, B, GAP }) => {
      const n = window.__ss.op,
        p = n.ch1PartyNow,
        c = document.querySelector("canvas"),
        k = c.width / 960,
        ctx = c.getContext("2d"),
        grab = () => ctx.getImageData(0, 0, c.width, Math.round(320 * k)).data,
        W = c.width;
      window.requestAnimationFrame = () => 0;
      let worst = Infinity,
        at = null,
        seen = 0;
      for (let f = 0; f < 15; f++) {
        for (let i = 0; i < 6; i++) window.__ss.tick(1 / 60);
        window.__ss.drawFrame();
        const a = grab();
        // the same frame with them away (the clock does not move between the two pictures)
        const keep = who === "isfred" ? { ...p.isfred } : p.bandAt;
        if (who === "isfred") ((p.isfred.x = -4000), (p.isfred.y = 4000));
        else p.bandAt = [0, 1, 2].map(() => ({ x: -4000, y: 4000 }));
        window.__ss.drawFrame();
        const b = grab();
        if (who === "isfred") Object.assign(p.isfred, keep);
        else p.bandAt = keep;
        for (let x = Math.ceil(B.x0 * k); x < B.x1 * k; x++) {
          let low = -1,
            top = -1;
          for (let y = 0; y < 320 * k; y++) {
            const i = (y * W + x) * 4;
            // (the banner's blue, also under a song's coloured light: much bluer than red, and bright)
            y < (B.y1 + 30) * k && b[i + 2] - b[i] > 90 && b[i + 2] > 150 && (low = y);
            top < 0 && Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 60 && (top = y);
          }
          if (low < 0 || top < 0) continue;
          seen++;
          // (the banner's outline runs 2 below its last blue)
          const gap = top / k - (low / k + 2);
          gap < worst && ((worst = gap), (at = { x: Math.round(x / k), top: Math.round(top / k), banner: Math.round(low / k) + 2 }));
        }
      }
      return { worst: Math.round(worst * 10) / 10, at, seen };
    },
    { who, B: BANNER, GAP },
  );
}
{
  const r = await clearUnder(page, "isfred");
  g.check(`Isfred's antennae stay ${GAP} or more below the banner's bottom edge (measured over his bobbing)`, r.seen > 0 && r.worst >= GAP, r);
}
await page.close();
// ---------- the host announces alone, then the Croc Boys walk on (Brian 2026-11-25) ----------
{
  const o = await g.open("?beat=party:P3", { width: 1280, height: 800, deviceScaleFactor: 1 });
  await sleep(1500);
  const read = () => o.page.evaluate(() => { const n = window.__ss.op, b = window.SSQ.beat("ch1-party"), q = b.now(), c = n.cur; return { text: c && c.b ? c.b.text : "", cur: c ? c.k : "", band: q && q.bandState, playing: q && q.bandPlaying, at: q && q.bandAt, cones: b.cones().filter((k) => /^band/.test(k.id)).length, scene: q && q.scene }; });
  const seen = [];
  let walkOn = [],
    t0 = Date.now();
  for (;;) {
    const r = await read();
    seen.push(r);
    r.band === "walking" && walkOn.push(r.at);
    if (r.scene !== "P3" || Date.now() - t0 > 60000) break;
    if (r.cur === "bub" && r.text !== "Stormtop-vania 1-2-3-4-5!") (await sleep(300), await o.page.evaluate(() => window.__ss.opTap()));
    await sleep(80);
  }
  const before = seen.filter((r) => r.text && !/Croc Boys|Stormtop/.test(r.text) && seen.indexOf(r) < seen.findIndex((q) => /Croc Boys!/.test(q.text)));
  g.check("through Isfred's welcome and the robots line the Croc Boys are not on the stage (and see nothing)", before.length > 3 && before.every((r) => r.band === "off" && r.cones === 0), before.slice(0, 3));
  const firstWalk = walkOn[0],
    steps = walkOn.slice(1).map((a, i) => Math.max(...a.map((b, j) => Math.hypot(b.x - walkOn[i][j].x, b.y - walkOn[i][j].y))));
  g.check("after \"put your hands together for the Croc Boys!\" they walk on from the stage's left end, in a line, to their places (no jumps)", walkOn.length > 5 && firstWalk.every((b, j) => b.x < CAST.band[j].x - 100) && Math.max(...steps) < 30, [walkOn.length, firstWalk, Math.max(...steps)]);
  g.check("they play only once all three are in their places", seen.filter((r) => r.band === "walking").every((r) => !r.playing) && seen.some((r) => r.band === "on" && r.playing));
  const song = seen.find((r) => r.text === "Stormtop-vania 1-2-3-4-5!");
  g.check("their song comes after they are in place", !!song && song.band === "on", song);
  g.check("no page errors (the band walking on)", o.errors.length === 0, o.errors);
  await o.page.close();
}
{
  const o = await g.open("?beat=party:P6", { width: 1280, height: 800, deviceScaleFactor: 1 });
  await sleep(1800);
  const playing = await o.page.evaluate(() => !!window.__ss.op.ch1PartyNow.band);
  const r = await clearUnder(o.page, "band");
  g.check(`the Croc Boys' heads, their jumps and their music notes stay ${GAP} or more below the banner (measured while they play)`, playing && r.seen > 0 && r.worst >= GAP, [playing, r]);
  g.check("no page errors (the band playing)", o.errors.length === 0, o.errors);
  await o.page.close();
}
await g.finish("party stage");
