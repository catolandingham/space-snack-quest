/**
 * The party hall stage (Chapter 1, walkthrough beats 3 and 5; party plan V1 and V3).
 * Isfred stands on the stage at the mic, one cloth banner (ROBOTICS DELEGATION! over COMING SOON!) hangs above
 * it, the separate poster is gone (Brian 2026-11-23, comments 11 and 14), and the Croc Boys stand on the stage.
 * Checked by the pixels drawn, at computer size, during the sneak (party P2).
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
for (const b of CAST.band) for (let y = b.y - 40; y <= b.y - 10; y += 3) band.push(await px(b.x, y));
g.check("the Croc Boys stand on the stage", band.some((c) => near(c, "#ffcf33", 40)) && band.some((c) => near(c, "#3478f6", 40)), band.slice(0, 6));
g.check("no page errors", errors.length === 0, errors);
await g.finish("party stage");
