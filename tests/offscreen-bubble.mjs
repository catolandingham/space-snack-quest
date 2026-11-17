/**
 * A bubble is not shown when its speaker is off the picture.
 * Hiding Squatch is still in the picture, so his line stays.
 *   node tests/offscreen-bubble.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8883, name: "offscreen-bubble" });
const { page } = await g.open("?ch=1");
const out = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const say = (who, text, ear) => {
    n.q = [{ k: "bub", b: { who, text, style: "say", ear: !!ear } }];
    n.cur = null;
    n.log = [];
    ss.tick(0.05);
    const up = n.cur && n.cur.k === "bub" && n.cur.b.text === text;
    const skipped = n.log.some((e) => e.k === "offscreen" && e.text === text);
    return { up: !!up, skipped };
  };
  n.room = "hall";
  n.scene = "Q3";
  n.moPose = "hidden";
  n.mo.x = 1200;
  n.mo.y = 520;
  const mop = say("mops", "Just a fuzzy mop! Very fuzzy.");
  n.room = "passage";
  n.ch1D = false;
  n.ch1Beep = false;
  const beep = say("ups", "BEEP BEEP");
  n.ch1Beep = true;
  const beepOn = say("ups", "BEEP BEEP");
  n.ch1Beep = false;
  n.sqPose = "hidden";
  n.sq.x = 220;
  n.sq.y = 530;
  const hide = say("sq", "I've never gotten to dance at a party.");
  n.moPose = "stand";
  n.mo.x = 480;
  n.mo.y = 520;
  const here = say("mops", "You have me.");
  n.moPose = "hidden";
  const ear = say("mops", "Security's voice.", true);
  return { mop, beep, beepOn, hide, here, ear };
});
g.check("an off-screen Mops gets no bubble", !out.mop.up && out.mop.skipped, out.mop);
g.check("the UPS beep stays hidden until the robot is drawn", !out.beep.up && out.beep.skipped, out.beep);
g.check("the UPS beep shows when the robot is in the hallway", out.beepOn.up && !out.beepOn.skipped, out.beepOn);
g.check("hiding Squatch still gets his line", out.hide.up && !out.hide.skipped, out.hide);
g.check("Mops on screen still gets his line", out.here.up && !out.here.skipped, out.here);
g.check("an overheard line still shows", out.ear.up && !out.ear.skipped, out.ear);
await g.finish("offscreen-bubble");
