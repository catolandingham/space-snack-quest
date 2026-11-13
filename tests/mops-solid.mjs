/**
 * Mops is a solid body from the left, right, above, and below, in the home room and the hall.
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8871, name: "mops solid" });
const { page, ctx } = await g.open("?ch=1");
await page.click("canvas");
const sides = [
  ["left", -90, 0, "ArrowRight"],
  ["right", 90, 0, "ArrowLeft"],
  ["above", 0, -90, "ArrowDown"],
  ["below", 0, 90, "ArrowUp"],
];
for (const room of ["closet", "hall"]) {
  for (const [name, dx, dy, key] of sides) {
    await page.evaluate(
      (room, dx, dy) => {
        const op = window.__ss.op;
        op.room = room;
        op.scene = "Q1";
        op.ctrl = true;
        op.sqPose = "stand";
        op.moPose = "stand";
        op.mo.x = 480;
        op.mo.y = 500;
        op.sq.x = 480 + dx;
        op.sq.y = 500 + dy;
      },
      room,
      dx,
      dy,
    );
    await page.keyboard.down(key);
    const end = await page.evaluate(() => {
      for (let i = 0; i < 50; i++) window.__ss.tick(1 / 30);
      return { x: window.__ss.op.sq.x, y: window.__ss.op.sq.y };
    });
    await page.keyboard.up(key);
    const dist = Math.hypot(end.x - 480, end.y - 500);
    g.check(`${room} from the ${name}`, dist >= 40, { dist, end });
  }
}
await ctx.close();
await g.finish("mops solid");
