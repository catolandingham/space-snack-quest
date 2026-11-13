/**
 * The help line tells the truth (task T12).
 * Page text names only controls that work: no "Shift", "Tab", "opera" or "push far" anywhere on the
 * page (text or labels), and it shows the keyboard help on a desktop window and the touch help when
 * touch controls are on (desktop with "Show touch controls", and a 375 by 812 phone).
 *   node tests/help-text.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const KEY_HELP = "Arrows or WASD: walk. E: do the action in the white label. Space or Enter: next line. Hold R: restart this section. Esc: skip a flashback. M: sound.";
import { readLines } from "./game-page.mjs";
// Row 21.1 (Phase 3: the ↺ button replaced "Reset section").
const TOUCH_HELP = readLines()["21.1"];
const BANNED = [/\bShift\b/, /\bTab\b/, /opera/i, /push far/i];

const g = await startGame({ port: 8788, name: "help-text" });
const read = (page) =>
  page.evaluate(() => {
    const labels = [...document.querySelectorAll("[aria-label]")].map((el) => el.getAttribute("aria-label")).join(" | ");
    return { text: document.body.innerText, labels };
  });
const clean = (r) => BANNED.filter((re) => re.test(r.text) || re.test(r.labels)).map(String);

for (const [name, query] of [["title", ""], ["Chapter 2", "?ch=2"]]) {
  const { ctx, page, errors } = await g.open(query);
  let r = await read(page);
  g.check(`${name}, desktop: the keyboard instructions are gone`, !r.text.includes(KEY_HELP), r.text.slice(0, 400));
  g.check(`${name}, desktop: no Shift, Tab, opera or push far`, clean(r).length === 0, clean(r));
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /touch controls/i.test(x.textContent || x.getAttribute("aria-label") || ""));
    b && b.click();
  });
  await sleep(300);
  r = await read(page);
  g.check(`${name}, desktop with touch controls: touch help is on the page`, r.text.includes(TOUCH_HELP), r.text.slice(0, 400));
  g.check(`${name}, desktop with touch controls: no Shift, Tab, opera or push far`, clean(r).length === 0, clean(r));
  g.check(`no page errors (${name})`, errors.length === 0, errors);
  await ctx.close();
}
for (const vp of [
  { name: "phone 375 upright", width: 375, height: 812, isMobile: true, hasTouch: true },
  { name: "phone 812 sideways", width: 812, height: 375, isMobile: true, hasTouch: true },
]) {
  const { ctx, page, errors } = await g.open("?ch=2", vp);
  const r = await read(page);
  g.check(`${vp.name}: touch help is on the page`, r.text.includes(TOUCH_HELP), r.text.slice(0, 400));
  g.check(`${vp.name}: no Shift, Tab, opera or push far`, clean(r).length === 0, clean(r));
  g.check(`no page errors (${vp.name})`, errors.length === 0, errors);
  await ctx.close();
}
await g.finish("help-text");
