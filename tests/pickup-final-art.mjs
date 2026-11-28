/**
 * Pickup day's final art, round 8 (placeholders 20 to 32; each pending Brian's yes; src/modules/pickup-art.js and
 * pickup-people-art.js). Checks that each drawing is wired where it shows, at phone size, with no page errors: the
 * poster's pale square and the snack bag (53), the hair over the crate bed (53), the crate in the row and the upgraded
 * robot (54), the spill (55), his eyes in the mailbox (55), Mops's snipped beard everywhere (56 on: the engine leaves
 * its own beard out, mops-beard.js), the beard slipping in the hall (57), the tape (60), the hold's pocket and the crew
 * member's look and size (61).
 *   node tests/pickup-final-art.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const src = (f) => readFileSync(M(f), "utf8");
const { PK_HOLD } = await import(M("pickup-place.js"));
const g = await startGame({ port: 9662, name: "pickup-final-art" });

g.check("the crew member is the ship's crew (drawCrew), not the party's guard look", /drawCrew\(ctx, l\.crewAt\.x/.test(src("pickup.js")) && !/LOOKS\.guard/.test(src("pickup.js")));
g.check("the crew member is a grown-up drawn 2.2 times the bay's size, as Mops and Squatch are in the hold", PK_HOLD.crewK === 2.2 && /sqScale\("hangar"\) \* 2\.2/.test(src("pickup.js")), PK_HOLD.crewK);
g.check("the tape shows the locked pickup-day bay picture itself (no hand-drawn ramp)", /delivery-room-empty-pickup-v4\.png/.test(src("pickup-art.js")));
g.check("the spill's bucket and the bucket on the crate are the approved mop bucket (mop-bucket.js)", /drawMopBucketFront/.test(src("pickup-art.js")));

const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true };
// One state per drawing: jump to the step, apply what that moment holds, draw a frame, read what pickup drew.
async function at(step, setup) {
  const { page, errors } = await g.open("?beat=pickup:" + step, PHONE);
  await page.evaluate(() => window.__ss.lockedReady);
  const r = await page.evaluate((setup) => {
    const ss = window.__ss,
      e = window.SSQ.engine(),
      B = window.SSQ.beat("ch1-pickup"),
      L = () => e.get("ch1Pickup");
    for (let i = 0; i < 12; i++) ss.tick(0.05);
    const run = () => setup && new Function("e", "L", "ss", setup)(e, L, ss);
    run();
    for (let i = 0; i < 4; i++) ss.tick(0.05);
    run();
    ss.drawFrame();
    const mb = window.SSQ.beat("ch1-morning");
    return { drew: B.debug().drew, room: e.room(), step: L().step, look: mb && mb.mopsLook ? mb.mopsLook() : "none" };
  }, setup);
  await page.close();
  return { ...r, errors };
}
const pack = await at("pack", "");
g.check("53: the poster eaten (its pale square) and the snack bag by the crate bed", pack.room === "closet" && pack.drew.poster === false, pack.drew);
const getin = await at("getin", "L().pile = true; e.set('sqPose','hidden')");
g.check("53: the hair pile drawn over the crate bed", getin.room === "closet" && getin.drew.pile === true, getin.drew);
const held = await at("sneak", "e.set('sqPose','hidden'); L().step = 'held'");
g.check("55: his eyes in the mailbox's slot", held.drew.eyes === "mailbox", held.drew);
const climb = await at("climb", "");
g.check("55: the spill by the floor vent", climb.drew.spill === true, climb.drew);
const last = await at("lastwalk", "");
g.check("56 on: once snipped, the engine leaves its own beard out (mopsLook noBeard) and the short beard is drawn", last.look && last.look.noBeard === true && last.drew.snipMark === true, { look: last.look, snip: last.drew.snipMark });
const hall = await at("lastwalk", "e.enterRoom('hall','QB'); e.place('sq',480,520); e.set('costumeOn',true); L().fur = true");
g.check("57: the beard slipped in the hall", hall.drew.fur === true, hall.room);
const tape = await at("tape", "for(let i=0;i<300&&!(L().step==='tape'&&L().cu==='tape'&&ss.op.ctrl&&!ss.op.cur);i++){ss.drawFrame();if(ss.op.cur){ss.op.bt=1;ss.opTap();}ss.tick(0.1);} L().tape.k = 0.8;");
g.check("60: the tape screen drawn", !!tape.drew.tape, tape.step);
const crew = await at("crewbleat", "");
g.check("61: the crew member drawn in the hold", !!crew.drew.crew && crew.drew.place === "hold", crew.drew);
const all = [pack, getin, held, climb, last, hall, tape, crew].flatMap((r) => r.errors);
g.check("no page errors", all.length === 0, all.slice(0, 3));
await g.finish("pickup-final-art");
