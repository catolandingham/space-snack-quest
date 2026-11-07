/**
 * Builds index.html from src/.
 *   npm run build          writes index.html
 *   npm run check-build    builds to a temp file and fails if it differs from the committed index.html
 *
 * src/vendor-react.js and the pieces in src/game/ are joined in name order (00-core.js, 10-ch1.js, ...).
 * They are one program: the React runtime opens the wrapper function that the last piece closes, and
 * the pieces are cut from one function at function boundaries, so no piece runs on its own. The
 * joined program is compacted with esbuild and put into src/index.template.html where it says BUILD.
 * Each piece starts with a one-line comment saying what it holds; esbuild drops comments, so the
 * comments never reach index.html.
 *
 * esbuild removes whitespace and applies its safe syntax shortening, but does not rename anything
 * (no minifyIdentifiers). Names in index.html stay the same as in src/, so a name seen in the
 * browser can be searched for in src/game/. To change a name, use npm run rename (tools/rename.mjs).
 */
import { transform } from "esbuild";
import { readFileSync, writeFileSync, mkdtempSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

// The program's files in build order (absolute paths).
export function sourceFiles() {
  const pieces = readdirSync(join(root, "src", "game"))
    .filter((f) => f.endsWith(".js"))
    .sort();
  return [join(root, "src", "vendor-react.js"), ...pieces.map((f) => join(root, "src", "game", f))];
}

export const ESBUILD_OPTIONS = { minifyWhitespace: true, minifySyntax: true, legalComments: "inline" };

export async function buildHtml() {
  const program = sourceFiles()
    .map((f) => readFileSync(f, "utf8"))
    .join("");
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
