// The party picture sheet for Brian: every new party drawing (party plan V1 to V15, both halves), drawn by the
// game's own code on the locked hall picture, at computer size and at phone width.
//   npm run build && node tools/party-sheet.mjs            -> tests/out/party-sheet/
//   PARTY_SHEET_OUT=/some/folder node tools/party-sheet.mjs
// It writes one PNG per picture, sheet.html (the sheet with a line under each picture), and two pictures of the
// whole sheet: sheet-phone.png (375 wide, as a phone shows it) and sheet-computer.png (1280 wide).
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const OUT = process.env.PARTY_SHEET_OUT || join(root, "tests", "out", "party-sheet");
mkdirSync(OUT, { recursive: true });
const bundle = await build({ entryPoints: [join(root, "tools", "party-sheet-page.js")], bundle: true, format: "iife", write: false });
const script = bundle.outputFiles[0].text;

// What each picture shows, in plain words (the sheet's captions). Full-screen pictures are drawn at phone size
// (375 x 812) and computer size (1100 x 800); hall pictures are 960 x 640, shown 375 wide on the phone sheet.
const CAPTIONS = {
  v01_banner: "V1. One cloth banner on two ropes over the stage: ROBOTICS DELEGATION! over COMING SOON!, a robot doodle at each end. No poster.",
  v01_banner_zoom: "V1, close. The banner glowing (when a line names it).",
  v02_home_door: "V2. At home that evening: music notes drift in round the door, and its edge thumps to the beat (sound starts off).",
  v02_peek: "V2. The peek: only Squatch's head and paws in the doorway gap. Every cone drawn dashed; all face the stage, away from him.",
  v02_peek_zoom: "V2, close. His head and his paws on the door frame.",
  v03_cast: "V3. One cast style: the six approved guests at their sheet heights, Isfred at the mic, the bartender (apron) behind the bar, two guards in blue (they come in only when the alarm rings).",
  v04_band_A: "V4, look A. The Croc Boys: three guest types in matching band shirts and green Crocs, guitar, keytar, drum.",
  v04_band_B: "V4, look B. The Croc Boys: crocodile-headed aliens in Crocs. Point at A or B.",
  v04_band_both: "V4. The two Croc Boys looks side by side: A (left) and B (right). Point at one.",
  v05_dance_phone: "V5. The dance, full phone screen (half two): Squatch big in his outfit in the spotlight, guests clapping, the band at the back.",
  v05_dance_computer: "V5. The same on a computer, a sillier outfit.",
  v06_dress_phone_start: "V6. Dress-up, full phone screen: the open closet with eight real pieces, Squatch big on white. Here boots are being dragged.",
  v06_dress_phone_absurd: "V6. One absurd outfit: boots on his head, a mustache on his face, a tutu on his body, sunglasses on his legs. Meter full, GO · party below him.",
  v06_dress_computer: "V6. Dress-up on a computer, halfway dressed.",
  v07_outfit_hall: "V7. The outfit he chose, on him in the hall, at the spots he chose.",
  v07_outfit_zoom: "V7, close. The absurd outfit, and a sensible one.",
  v08_beard: "V8. Mops's long white beard swishing past the hallway doorway (half two).",
  v09_vent_tuft: "V9. The vent: swirls always turning slowly inward. Too close without a disguise: a tuft drifts in, a big fur sign over him, and he shakes.",
  v09_vent_tug: "V9. In disguise (half two): the vent tugs a piece; the piece tips, drawn big over him.",
  v10_lights_song1: "V10. The dance spotlight in front of the stage, and the light for song 1.",
  v10_lights_song2: "V10. Song 2's light.",
  v10_lights_song3: "V10. Song 3's light.",
  v11_flyer_back: "V11. Walking home: a flyer stuck to his back fur.",
  v11_flyer_floor: "V11. At home the flyer drops on the floor by the door.",
  v12_alarm_phone: "V12. The fur-alarm close-up, full phone screen: the locked hall's own alarm, enlarged, a hand pulling it, the light flashing.",
  v12_alarm_computer: "V12. The same on a computer, mid-pull.",
  v12_alarm_hall: "V12. In the hall: whoever saw him shouts FUR! under the alarm, its light flashes, guards come in from the hallway with cones.",
  v13_heart_cone: "V13. Mops's heart cone, as big as everyone's (half two, closing time).",
  v14_camera_conga: "V14. The camera on its tripod in the crowd, pointing at the band, counting 3-2-1; a conga line with Squatch on the end (half two).",
  v15_warnings: "V15. A guest's \"?\" when Squatch is in his cone (here the glancer looking across the lane).",
  v15_caught_mark: "V15. \"!\" when he stays in sight too long: the alarm starts.",
  v15_eyes_plant: "V15. Hidden in the plant: only his eyes in the leaves, watching the pairs dance.",
};
const FULL = { v05_dance_phone: "phone", v05_dance_computer: "computer", v06_dress_phone_start: "phone", v06_dress_phone_absurd: "phone", v06_dress_computer: "computer", v12_alarm_phone: "phone", v12_alarm_computer: "computer" };

const g = await startGame({ port: 8994, name: "party-sheet" });
const { page } = await g.open("?ch=1", { width: 1280, height: 800, deviceScaleFactor: 1 });
await sleep(1500);
await page.addScriptTag({ content: script });
const ids = await page.evaluate(() => window.PARTY_SHEET.ids);
for (const id of ids) {
  const url = await page.evaluate((i) => window.PARTY_SHEET.render(i), id);
  writeFileSync(join(OUT, id + ".png"), Buffer.from(url.split(",")[1], "base64"));
}
const card = (id) => {
  const kind = FULL[id];
  const style = kind === "phone" ? "width:375px;max-width:100%" : kind === "computer" ? "width:100%;max-width:960px" : "width:100%;max-width:960px";
  return `<figure><img src="${id}.png" style="${style}"><figcaption>${CAPTIONS[id] || id}</figcaption></figure>`;
};
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Party pictures</title><style>body{margin:0;padding:12px;font:16px/1.4 system-ui,sans-serif;color:#1e2430;background:#f4f1ea}h1{font-size:22px}figure{margin:0 0 22px;background:#fff;border-radius:10px;padding:8px}img{display:block;border-radius:6px}figcaption{padding:6px 4px 0}</style></head>
<body><h1>Party night: every new picture (showing 1)</h1><p>Drawn by the game on top of the locked hall picture, which is unchanged. On a phone the hall pictures show at this width (375). Full-screen pictures fill the phone.</p>
${ids.map(card).join("\n")}</body></html>`;
writeFileSync(join(OUT, "sheet.html"), html);
for (const [name, width] of [
  ["sheet-phone.png", 375],
  ["sheet-computer.png", 1280],
]) {
  const p = await (await page.browser().createBrowserContext()).newPage();
  await p.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await p.goto("file://" + join(OUT, "sheet.html"));
  await sleep(500);
  await p.screenshot({ path: join(OUT, name), fullPage: true });
}
console.log(`saved ${ids.length} pictures and the sheet in ${OUT}`);
await g.finish("party-sheet");
