/**
 * Locked room pictures stay byte-for-byte, and each room still paints its picture.
 *   node tests/locked-art.mjs
 *
 * The pixels themselves are checked by tests/locked-rooms.mjs. This suite fails first
 * if a listed file changes, or if the game stops pointing a room at that file.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");
const fails = [];
const check = (label, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok || detail === undefined ? "" : " " + detail}`);
  if (!ok) fails.push(label);
};

const readme = read("docs/locked-rooms/README.md");
const listed = [...readme.matchAll(/^\| `([^`]+\.png)` \|/gm)].map((m) => m[1]);
const manifest = JSON.parse(read("docs/locked-rooms/manifest.json"));
const hashed = Object.keys(manifest.files).sort();
check(
  "the manifest lists every picture in docs/locked-rooms/README.md",
  listed.length > 0 && listed.slice().sort().join() === hashed.join(),
  `readme=${listed.join(",")} manifest=${hashed.join(",")}`,
);

for (const name of listed) {
  const file = join(root, "docs/locked-rooms", name);
  let sha = "";
  try {
    sha = createHash("sha256").update(readFileSync(file)).digest("hex");
  } catch (err) {
    check(name + " is on disk", false, String(err));
    continue;
  }
  check(name + " matches its locked sha256", sha === manifest.files[name], sha);
}

const game = readdirSync(join(root, "src/game"))
  .filter((f) => f.endsWith(".js"))
  .map((f) => read(join("src/game", f)))
  .join("\n");
const pixelSuite = read("tests/locked-rooms.mjs");
const rooms = {
  "hall-room-empty-v2.png": ["hall", 'drawLockedRoom("hall")'],
  "hallway-room-empty-v6.png": ["hallway", 'drawLockedRoom("hallway")', 'drawLockedRoom(n.ch1Office ? "office" : "hallway")'],
  "office-room-empty-v2.png": ["office", 'drawLockedRoom("office")'],
  "home-room-empty-closed-v6.png": ["home-closed", 'drawLockedRoom(n.wardrobe === "open" ? "home-open" : "home-closed")'],
  "home-room-empty-open-v6.png": ["home-open", 'drawLockedRoom(n.wardrobe === "open" ? "home-open" : "home-closed")'],
  "delivery-room-empty-day-v2.png": ["delivery-day", "drawLockedRoom(ch1DeliveryArt())"],
  "delivery-room-empty-day-noship-v2.png": ["delivery-noship", "drawLockedRoom(ch1DeliveryArt())"],
  "delivery-room-empty-night-v2.png": ["delivery-night", "drawLockedRoom(ch1DeliveryArt())"],
  "delivery-room-empty-pickup-v3.png": ["delivery-pickup", "drawLockedRoom(ch1DeliveryArt())"],
};

for (const [name, [id, ...draws]] of Object.entries(rooms)) {
  const path = "docs/locked-rooms/" + name;
  const pointed = game.includes('"' + path + '"') && (game.includes(id + ":") || game.includes('"' + id + '"'));
  check(id + " still points at " + name, pointed, "LOCKED_ROOMS");
  for (const draw of draws) check(id + " is still drawn (" + draw + ")", game.includes(draw));
  check("the picture test still checks " + name, pixelSuite.includes(path));
}

if (fails.length) {
  console.error(fails.length + " locked-art checks failed");
  process.exit(1);
}
console.log("locked art is unchanged and still used");
