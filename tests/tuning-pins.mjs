/**
 * A pin is a Brian-approved number. The snippet must still be in that file.
 *   node tests/tuning-pins.mjs
 */
import { readFileSync } from "node:fs";

const pins = JSON.parse(readFileSync(new URL("../docs/TUNING-PINS.json", import.meta.url), "utf8")).pins;
let failed = 0;
const seen = new Set();
for (const pin of pins) {
  if (!pin.id || !pin.file || !pin.snippet || !pin.source || seen.has(pin.id)) {
    console.log("FAIL pin " + (pin.id || "?") + " is incomplete or repeated");
    failed++;
    continue;
  }
  seen.add(pin.id);
  const text = readFileSync(new URL("../" + pin.file, import.meta.url), "utf8");
  const count = text.split(pin.snippet).length - 1;
  const ok = count === 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${pin.id}`);
  if (!ok) {
    failed++;
    console.log(JSON.stringify({ file: pin.file, snippet: pin.snippet, count }));
  }
}
if (failed) {
  console.error(failed + " tuning pins failed");
  process.exit(1);
}
console.log(pins.length + " tuning pins passed");
