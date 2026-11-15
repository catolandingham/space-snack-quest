/**
 * Each locked room, drawn empty by the game, matches its approved picture.
 *   node tests/locked-rooms.mjs
 */
import { startGame } from "./game-page.mjs";

const ROOMS = [
  ["hall", "Party hall"],
  ["hallway", "Hallway"],
  ["office", "Office"],
  ["home-closed", "Home, wardrobe closed"],
  ["home-open", "Home, wardrobe open"],
  ["delivery-day", "Loading bay, day, ship"],
  ["delivery-noship", "Loading bay, day, no ship"],
  ["delivery-night", "Loading bay, night"],
  ["delivery-pickup", "Loading bay, pickup"],
];

const g = await startGame({ port: 8828, name: "locked-rooms" });
const { ctx, page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });
await page.evaluate(() => window.__ss.lockedReady);

for (const [id, label] of ROOMS) {
  const diff = await page.evaluate((id) => {
    const ss = window.__ss;
    const img = new Image();
    const known = {
      hall: "docs/locked-rooms/hall-room-empty-v1.png",
      hallway: "docs/locked-rooms/hallway-room-empty-v6.png",
      office: "docs/locked-rooms/office-room-empty-v2.png",
      "home-closed": "docs/locked-rooms/home-room-empty-closed-v4.png",
      "home-open": "docs/locked-rooms/home-room-empty-open-v4.png",
      "delivery-day": "docs/locked-rooms/delivery-room-empty-day-v2.png",
      "delivery-noship": "docs/locked-rooms/delivery-room-empty-day-noship-v2.png",
      "delivery-night": "docs/locked-rooms/delivery-room-empty-night-v2.png",
      "delivery-pickup": "docs/locked-rooms/delivery-room-empty-pickup-v3.png",
    };
    return new Promise((resolve) => {
      img.onload = () => {
        ss.paintLocked(id);
        const canvas = document.querySelector("canvas");
        const w = canvas.width, h = canvas.height;
        const game = canvas.getContext("2d").getImageData(0, 0, w, h).data;
        const ref = document.createElement("canvas");
        ref.width = w;
        ref.height = h;
        ref.getContext("2d").drawImage(img, 0, 0, w, h);
        const want = ref.getContext("2d").getImageData(0, 0, w, h).data;
        let bad = 0;
        for (let i = 0; i < want.length; i += 4) {
          if (Math.abs(want[i] - game[i]) > 18 || Math.abs(want[i + 1] - game[i + 1]) > 18 || Math.abs(want[i + 2] - game[i + 2]) > 18) bad++;
        }
        resolve({ bad, total: want.length / 4, width: w, height: h });
      };
      img.onerror = () => resolve({ missing: true });
      img.src = known[id];
    });
  }, id);
  const share = diff.total ? diff.bad / diff.total : 1;
  g.check(label + " matches its locked picture", !diff.missing && share <= 0.02, { ...diff, share: Math.round(share * 1000) / 1000 });
}

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("locked-rooms");
