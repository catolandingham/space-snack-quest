/**
 * Draws the vent room's locked picture once (Brian, 2026-11-26, notes page question 56: a locked, cleaned-up vent
 * room): the room with no one in it, the lamp off, nothing on the desk, the grille empty (escape-art.js
 * drawVentRoomPicture), at the locked pictures' size, 1280 x 830 (the game paints it at 960 x 640).
 *   node tools/vent-room-picture.mjs            writes docs/locked-rooms/vent-room-empty-v1.png
 * Do not run it again to change the picture: a locked picture changes only with Brian's yes and a new version (v2),
 * as docs/locked-rooms/README.md says.
 */
import { build } from "esbuild";
import { writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { chromePath } from "../tests/chrome-path.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "docs/locked-rooms/vent-room-empty-v1.png");
if (existsSync(out) && !process.argv.includes("--again")) {
  console.log("vent-room-empty-v1.png is locked; a change needs Brian's yes and a new version (v2)");
  process.exit(0);
}
const bundle = await build({
  stdin: {
    contents: `import { drawVentRoomPicture } from "./src/modules/escape-art.js";
      const cv = document.createElement("canvas");
      cv.width = 1280; cv.height = 830;
      const ctx = cv.getContext("2d");
      ctx.scale(1280 / 960, 830 / 640);
      drawVentRoomPicture(ctx);
      window.picture = cv.toDataURL("image/png");`,
    resolveDir: root,
  },
  bundle: true,
  write: false,
  format: "iife",
});
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true });
const page = await browser.newPage();
await page.setContent("<!doctype html><html><body></body></html>");
await page.addScriptTag({ content: bundle.outputFiles[0].text });
const url = await page.evaluate(() => window.picture);
await browser.close();
writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
console.log("wrote", out);
