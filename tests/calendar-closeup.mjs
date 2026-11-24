/**
 * Brian Nov 16: tappable calendar, subtle bite, invented months, sponsor and family plans.
 * Brian G 556 (2026-11-23): the bite is there from the start ("It should just have a bite out already"); touching
 * the printed Moon Pie takes no bite.
 * Brian 2026-11-23 (chat): "It's the calendar paw that doesn't make sense": no paw is drawn on the close-up, before or
 * after a touch (touching changes nothing anyway).
 * Uses the real picture taps and Space, not direct calls to the new feature.
 * CALENDAR_SHOTS=1 saves review stills outside the repository.
 */
import { startGame, sleep, toEvening } from "./game-page.mjs";
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
  // The calendar can be looked at once Squatch is home alone: after Mops leaves (tests/home-alone.mjs) and in
  // the evening, checked here.
  await toEvening(page);
  const before = await page.evaluate(() => {
    const n = window.__ss.op;
    window.calendarQueue = n.q;
    window.calendarCur = n.cur;
    return { scene: n.scene, x: n.sq.x, y: n.sq.y };
  });
  g.check(`${tag}: the morning reaches bedroom control in the evening`, before.scene === "Q1" && (await page.evaluate(() => window.__ss.op.ch1PeekReady)), before);
  await page.evaluate(() => {
    window.calendarPrinted = new Set();
    const draw = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function(text, ...args) {
      window.calendarPrinted.add(String(text));
      return draw.call(this, text, ...args);
    };
  });
  await tap(179, 214);
  g.check(`${tag}: tapping calendar opens close-up`, await page.evaluate(() => !!window.__ss.op.ch1Calendar));
  g.check(`${tag}: close-up is actually drawn (red header across center)`, await page.evaluate(() => {
    const cv = document.querySelector("canvas"), k = cv.width / 960;
    const p = cv.getContext("2d").getImageData(140 * k, 110 * k, 1, 1).data;
    return p[0] > 180 && p[1] < 120 && p[2] < 100;
  }));
  g.check(`${tag}: invented months and sponsor are actually printed`, await page.evaluate(() =>
    ["MOONMUNCH", "FUZZUARY", "Sponsored by MOON PIES"].every(s => window.calendarPrinted.has(s))));
  g.check(`${tag}: family Olympics and scattered story-fitting plans are printed`, await page.evaluate(() =>
    ["family", "Olympics", "night", "Sock hunt", "Wash outside windows", "(remember space suit!)", "Blanket", "fort night"].every(s => window.calendarPrinted.has(s))));
  g.check(`${tag}: superseded months and routine homework/song reminders are absent`, await page.evaluate(() =>
    ![...window.calendarPrinted].some(s => /NAPRIL|Homework|Sing with|FUZZUARY.*\//.test(s))));
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
  await page.evaluate(() => {
    const cv = document.querySelector("canvas"), k = cv.width / 960;
    window.calendarGridBeforeBite = cv.getContext("2d").getImageData(130 * k, 185 * k, 660 * k, 320 * k).data;
  });
  const nibbleAt = (x, y) =>
    page.evaluate(([x, y]) => {
      const cv = document.querySelector("canvas"), k = cv.width / 960;
      const p = cv.getContext("2d").getImageData(x * k, y * k, 1, 1).data;
      return p[0] < 220 && p[1] < 220 && p[2] < 220;
    }, [x, y]);
  g.check(`${tag}: the paper is already bitten before any touch`, (await nibbleAt(808, 390)) && (await nibbleAt(798, 391)));
  // Squatch's paw is a dark brown arm (#6b4428, outline #3a2416) rising from the bottom edge.
  const pawPixels = (x0, y0, x1, y1) =>
    page.evaluate(([x0, y0, x1, y1]) => {
      const cv = document.querySelector("canvas"), k = cv.width / 960;
      const d = cv.getContext("2d").getImageData(x0 * k, y0 * k, (x1 - x0) * k, (y1 - y0) * k).data;
      let hits = 0;
      for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - 107) < 14 && Math.abs(d[i + 1] - 68) < 14 && Math.abs(d[i + 2] - 40) < 14) hits++;
      return hits;
    }, [x0, y0, x1, y1]);
  const pawBefore = await pawPixels(700, 590, 860, 640);
  // A held drag across the paper (the old paw followed the finger), then a tap; nothing brown anywhere it went.
  const drag = async () => {
    const rect = await page.$eval("canvas", (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    const at = (x, y) => [rect.x + (x * rect.w) / 960, rect.y + (y * rect.h) / 640];
    if (viewport.hasTouch) (await page.touchscreen.touchStart(...at(592, 385)), await page.touchscreen.touchMove(...at(600, 470)));
    else (await page.mouse.move(...at(592, 385)), await page.mouse.down(), await page.mouse.move(...at(600, 470), { steps: 4 }));
    await sleep(150);
    const held = await pawPixels(480, 400, 720, 640);
    if (viewport.hasTouch) await page.touchscreen.touchEnd();
    else await page.mouse.up();
    await sleep(350);
    return held;
  };
  const pawHeld = await drag();
  await tap(592, 385);
  const pawAfter = (await pawPixels(530, 560, 660, 640)) + (await pawPixels(700, 590, 860, 640));
  g.check(`${tag}: no paw is drawn on the close-up, before, during a drag, or after a touch`, pawBefore === 0 && pawHeld === 0 && pawAfter === 0, { pawBefore, pawHeld, pawAfter });
  g.check(`${tag}: bite opens through the right paper edge without a closing ink line`, await page.evaluate(() => {
    const cv = document.querySelector("canvas"), k = cv.width / 960;
    const p = cv.getContext("2d").getImageData(819 * k, 390 * k, 1, 1).data;
    return p[0] > 90 && p[1] > 90 && p[2] > 90;
  }));
  g.check(`${tag}: touching the printed snack changes nothing: the dated grid and pie are the same`, await page.evaluate(() => {
    const cv = document.querySelector("canvas"), k = cv.width / 960;
    const after = cv.getContext("2d").getImageData(130 * k, 185 * k, 660 * k, 320 * k).data;
    return after.every((v, i) => Math.abs(v - window.calendarGridBeforeBite[i]) < 3);
  }));
  g.check(`${tag}: small edge nibble is visible`, await page.evaluate(() => {
    const cv = document.querySelector("canvas"), k = cv.width / 960;
    const p = cv.getContext("2d").getImageData(808 * k, 390 * k, 1, 1).data;
    return p[0] < 220 && p[1] < 220 && p[2] < 220;
  }));
  g.check(`${tag}: revised bite is slightly deeper without reaching the grid`, await page.evaluate(() => {
    const cv = document.querySelector("canvas"), k = cv.width / 960;
    const p = cv.getContext("2d").getImageData(798 * k, 391 * k, 1, 1).data;
    return p[0] < 220 && p[1] < 220 && p[2] < 220;
  }));
  if (process.env.CALENDAR_SHOTS) await page.screenshot({ path: `/tmp/calendar-${viewport.width}-bite.png` });
  await tap(880, 540);
  g.check(`${tag}: X restores bedroom without moving Squatch`, await page.evaluate((b) => {
    const n = window.__ss.op;
    return !n.ch1Calendar && n.ctrl && n.sq.x === b.x && n.sq.y === b.y;
  }, before));
  await tap(179, 214);
  g.check(`${tag}: re-open still shows the bite`, (await page.evaluate(() => !!window.__ss.op.ch1Calendar)) && (await nibbleAt(808, 390)));
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
  // Playing the actual opening again still reaches the evening's peek goal.
  g.check(`${tag}: a new game still plays through to the evening`, /peek out the door/.test(await toEvening(page)));
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
      ch1Day2: true, ch1PeekReady: false, ch1Step: "cal", ctrl: true });
    n.sq.x = 230; n.sq.y = 392;
  });
  await tap(179, 214);
  g.check(`${tag}: day-two calendar uses close-up`, await page.evaluate(() => !!window.__ss.op.ch1Calendar));
  const next = await page.$('[role="button"]');
  const nextBox = await next.boundingBox();
  if (viewport.hasTouch) await page.touchscreen.tap(nextBox.x + nextBox.width / 2, nextBox.y + nextBox.height / 2);
  else await page.mouse.click(nextBox.x + nextBox.width / 2, nextBox.y + nextBox.height / 2);
  await sleep(350);
  g.check(`${tag}: visible NEXT button closes the day-two inspection`, await page.evaluate(() => !window.__ss.op.ch1Calendar));
  for (let i = 0; i < 6; i++) { await page.keyboard.press("Space"); await sleep(350); }
  g.check(`${tag}: day-two close continues to lunch`, await page.evaluate(() => window.__ss.op.ch1Step === "lunch"));
  await page.evaluate(() => window.__ss.startOpening());
  g.check(`${tag}: a new game closes the overlay`, await page.evaluate(() => !window.__ss.op.ch1Calendar));
  g.check(`${tag}: seated Squatch is not offered a walking LOOK target`, await page.evaluate(() => {
    Object.assign(window.__ss.op, { ctrl: true, cur: null, q: [], hopOut: -1, sqPose: "sit" });
    return !window.__ss.spotsNow().some(s => s.id === "home-calendar");
  }));
  g.check(`${tag}: calendar cannot interrupt a hop out of bed`, await page.evaluate(() => {
    const n = window.__ss.op;
    Object.assign(n, { ctrl: true, cur: null, q: [], hopOut: 0.1, sqPose: "stand" });
    window.__ss.tapAt(179, 214);
    return !n.ch1Calendar && !window.__ss.spotsNow().some(s => s.id === "home-calendar");
  }));
  g.check(`${tag}: no script errors`, errors.length === 0, errors);
  await ctx.close();
}
await g.finish("calendar-closeup");
