/**
 * Brian Nov 16: tappable bedroom calendar, wordless paper-bite joke.
 * Uses the real picture taps and Space, not direct calls to the new feature.
 * CALENDAR_SHOTS=1 saves review stills outside the repository.
 */
import { startGame, sleep } from "./game-page.mjs";
const g = await startGame({ port: 8947, name: "calendar-closeup" });
for (const viewport of [
  { width: 1180, height: 820 },
  { width: 375, height: 812, isMobile: true, hasTouch: true },
]) {
  const { page, ctx, errors } = await g.open("?ch=1", viewport);
  const tag = `${viewport.width}px`;
  const tap = async (x, y) => {
    const rect = await page.$eval("canvas", el => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    const px = rect.x + x * rect.w / 960, py = rect.y + y * rect.h / 640;
    if (viewport.hasTouch) await page.touchscreen.tap(px, py);
    else await page.mouse.click(px, py);
    await sleep(350);
  };
  for (let i = 0; i < 16; i++) {
    if (await page.evaluate(() => window.__ss.op.ctrl)) break;
    await page.keyboard.press("Space");
    await sleep(350);
  }
  const before = await page.evaluate(() => {
    const n = window.__ss.op;
    window.calendarQueue = n.q;
    window.calendarCur = n.cur;
    return { scene: n.scene, x: n.sq.x, y: n.sq.y };
  });
  g.check(`${tag}: opening reaches bedroom control`, before.scene === "O1", before);
  await tap(179, 214);
  g.check(`${tag}: tapping calendar opens close-up`, await page.evaluate(() => !!window.__ss.op.ch1Calendar));
  g.check(`${tag}: close-up is actually drawn (red header across center)`, await page.evaluate(() => {
    const cv = document.querySelector("canvas"), k = cv.width / 960;
    const p = cv.getContext("2d").getImageData(480 * k, 155 * k, 1, 1).data;
    return p[0] > 180 && p[1] < 120 && p[2] < 100;
  }));
  if (process.env.CALENDAR_SHOTS) await page.screenshot({ path: `/tmp/calendar-${viewport.width}-whole.png` });
  await page.keyboard.down("ArrowRight");
  await sleep(450);
  await page.keyboard.up("ArrowRight");
  const paused = await page.evaluate(() => {
    const n = window.__ss.op;
    return { scene: n.scene, x: n.sq.x, y: n.sq.y, queueSame: n.q === window.calendarQueue && n.cur === window.calendarCur, chip: window.__ss.chipDrawn() };
  });
  g.check(`${tag}: scene, queue and feet pause under close-up`,
    paused.scene === before.scene && paused.x === before.x && paused.y === before.y && paused.queueSame, paused);
  g.check(`${tag}: walk instruction hidden in close-up`, !paused.chip, paused);
  await tap(560, 393);
  g.check(`${tag}: touching printed snack bites paper`, await page.evaluate(() => !!window.__ss.op.ch1CalendarBitten));
  g.check(`${tag}: released paw clears the joke`, await page.evaluate(() => window.__ss.op.ch1Calendar.paw.x === 780));
  if (process.env.CALENDAR_SHOTS) await page.screenshot({ path: `/tmp/calendar-${viewport.width}-bite.png` });
  await tap(880, 540);
  g.check(`${tag}: X restores bedroom without moving Squatch`, await page.evaluate((b) => {
    const n = window.__ss.op;
    return !n.ch1Calendar && n.ctrl && n.sq.x === b.x && n.sq.y === b.y;
  }, before));
  await tap(179, 214);
  g.check(`${tag}: re-open keeps paper bite`, await page.evaluate(() => !!window.__ss.op.ch1Calendar && window.__ss.op.ch1CalendarBitten));
  await page.keyboard.press("Space");
  g.check(`${tag}: Space also closes`, await page.evaluate(() => !window.__ss.op.ch1Calendar));
  await tap(179, 214);
  await page.keyboard.down("KeyR");
  await sleep(1000);
  await page.keyboard.up("KeyR");
  g.check(`${tag}: reset hold fires and dismisses close-up`, await page.evaluate(() => {
    const n = window.__ss.op;
    return !n.ch1Calendar && window.__ss.ch2.resetHold.fired && n.q !== window.calendarQueue;
  }));
  // The existing section-reset path is not a new-game path. Start a fresh opening for the next check.
  await page.evaluate(() => window.__ss.startOpening());
  for (let i = 0; i < 16; i++) {
    if (await page.evaluate(() => window.__ss.op.ctrl)) break;
    await page.keyboard.press("Space"); await sleep(350);
  }
  // Continuing the actual opening still reaches the song.
  await page.keyboard.down("ArrowRight"); await sleep(1100); await page.keyboard.up("ArrowRight");
  g.check(`${tag}: walking still advances to song`, await page.evaluate(() => window.__ss.op.ch1Song));
  // A reachable keyboard action beside the wardrobe, not inside the bed.
  await page.evaluate(() => {
    const n = window.__ss.op;
    n.sq.x = 230; n.sq.y = 392; n.walkTo = null;
    window.__ss.tick(0.05);
  });
  g.check(`${tag}: LOOK offered beside wardrobe`, await page.evaluate(() => window.__ss.offerNow()?.cap === "calendar"));
  await page.keyboard.press("Space"); await sleep(350);
  g.check(`${tag}: keyboard LOOK opens`, await page.evaluate(() => !!window.__ss.op.ch1Calendar));
  await page.keyboard.press("Space");
  // No calendar inspection during a costume reveal or through an open wardrobe door.
  await page.evaluate(() => { window.__ss.op.wardrobe = "open"; });
  await tap(179, 214);
  g.check(`${tag}: open wardrobe does not expose calendar front`, await page.evaluate(() => !window.__ss.op.ch1Calendar));
  // Day 2 must show the close-up, then still continue to the lunch.
  await page.evaluate(() => {
    const n = window.__ss.op;
    Object.assign(n, { q: [], cur: null, scene: "QB", room: "closet", wardrobe: "closed",
      ch1Day2: true, ch1Song: false, ch1PeekReady: false, ch1Step: "cal", ctrl: true });
    n.sq.x = 230; n.sq.y = 392;
  });
  await tap(179, 214);
  g.check(`${tag}: day-two calendar uses close-up`, await page.evaluate(() => !!window.__ss.op.ch1Calendar));
  await tap(880, 540);
  for (let i = 0; i < 6; i++) { await page.keyboard.press("Space"); await sleep(350); }
  g.check(`${tag}: day-two close continues to lunch`, await page.evaluate(() => window.__ss.op.ch1Step === "lunch"));
  await page.evaluate(() => window.__ss.startOpening());
  g.check(`${tag}: new game resets bite and overlay`, await page.evaluate(() => !window.__ss.op.ch1CalendarBitten && !window.__ss.op.ch1Calendar));
  g.check(`${tag}: no script errors`, errors.length === 0, errors);
  await ctx.close();
}
await g.finish("calendar-closeup");
