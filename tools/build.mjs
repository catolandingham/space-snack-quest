/**
 * Builds index.html from src/.
 *   npm run build          writes index.html
 *   npm run check-build    builds to a temp file and fails if it differs from the committed index.html
 *
 * src/vendor-react.js + src/game.js are joined (they are one program: the React runtime opens the
 * wrapper function that game.js closes), compacted with esbuild, and put into src/index.template.html
 * where it says BUILD.
 *
 * esbuild removes whitespace and applies its safe syntax shortening, but does not rename anything
 * (no minifyIdentifiers). Names in index.html stay the same as in src/, so a name seen in the
 * browser can be searched for in src/game.js.
 */
import { transform } from "esbuild";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

export const ESBUILD_OPTIONS = { minifyWhitespace: true, minifySyntax: true, legalComments: "inline" };

export async function buildHtml() {
  const program = read("src/vendor-react.js") + read("src/game.js");
  const { code } = await transform(program, ESBUILD_OPTIONS);
  const template = read("src/index.template.html");
  const marker = "/*BUILD*/";
  if (template.split(marker).length !== 2) throw new Error(`src/index.template.html must contain ${marker} exactly once`);
  return template.split(marker).join(code);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const html = await buildHtml();
  if (process.argv.includes("--check")) {
    const dir = mkdtempSync(join(tmpdir(), "ssq-build-"));
    const out = join(dir, "index.html");
    writeFileSync(out, html);
    const same = readFileSync(out, "utf8") === read("index.html");
    rmSync(dir, { recursive: true, force: true });
    if (!same) {
      console.error("check-build FAILED: index.html does not match a fresh build of src/. Run npm run build and commit index.html.");
      process.exit(1);
    }
    console.log("check-build passed: index.html matches a fresh build of src/.");
  } else {
    writeFileSync(join(root, "index.html"), html);
    console.log(`Wrote index.html (${Buffer.byteLength(html)} bytes).`);
  }
}
