/**
 * The party crowd uses the Nov 11 creature bodies, not one shared humanoid.
 * Horns is Isfred on the stage, not a second copy in the crowd.
 *   node tests/party-guests.mjs
 */
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/game/12-ch1-redesign.js", import.meta.url), "utf8");
const block = src.slice(src.indexOf("const CH1_GUESTS"), src.indexOf("function ch1PartySolids"));
const kinds = [...block.matchAll(/"([a-z]+)"/g)].map((m) => m[1]);
const draw = src.slice(src.indexOf("function drawCh1Alien"), src.indexOf("function drawCh1Tripod"));
const branches = ["antenna", "croc", "hat", "hair", "spots", "blob", "horns"].filter((k) => draw.includes('kind === "' + k + '"'));
const cape = draw.includes('r("#1f9d8a"') && draw.includes('r("#e5533d"');
let failed = 0;
const check = (name, ok, detail) => {
  console.log((ok ? "PASS " : "FAIL ") + name + (ok || detail === undefined ? "" : " " + JSON.stringify(detail)));
  ok || failed++;
};
check("the crowd has at least 5 distinct body types", new Set(kinds).size >= 5, kinds);
check("those types are the Nov 11 creatures", ["antenna", "croc", "hat", "hair", "spots", "blob"].every((k) => kinds.includes(k)), kinds);
check("horns is not standing in the crowd", !kinds.includes("horns"), kinds);
check("each Nov 11 body is drawn on its own", branches.length >= 6, branches);
check("the cape guest is its own body", cape);
check("the cape cloth is the Nov 11 cloth", draw.includes("m(-16, -40, 10, 22, 4)"));
check("the body is not flipped, only the eye and the croc snout", draw.includes("e.scale(sc, sc)") && draw.includes("F(f * 4") && !draw.includes("e.scale(sc * f, sc)"));
check("arms hang on the body instead of floating beside it", draw.includes("hang(") && !draw.includes("m(-36, -56"));
if (failed) {
  console.error("Failed: party guests");
  process.exit(1);
}
console.log("party-guests checks passed");
