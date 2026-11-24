// Takes a full-size still of the party hall during the sneak (party P2), for the picture check in docs/START-HERE.md.
//   CHROME=/path/to/chrome node tools/hall-still.mjs   ->  tests/out/hall-still.png
// Every new party picture, both halves, is on the picture sheet: node tools/party-sheet.mjs.
import { startGame, sleep } from "../tests/game-page.mjs";
const g = await startGame({ port: 8933, name: "hall-still" });
const { page } = await g.open("?beat=party:P2", { width: 1280, height: 800, deviceScaleFactor: 1 });
await sleep(1800);
await (await page.$("canvas")).screenshot({ path: "tests/out/hall-still.png" });
console.log("saved tests/out/hall-still.png");
process.exit(0);
