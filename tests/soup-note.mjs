/**
 * The soup note must not tell Squatch that Mops wrote it. Chapter 4 still asks who the Guardians were.
 * Walks the note (leave the soup, the note, the stamp, "...Eat up, kiddo.") and checks every bubble.
 *   node tests/soup-note.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8792, name: "soup-note" });
const src = readFileSync(new URL("../src/game/20-ch2.js", import.meta.url), "utf8");
const ch4 = readFileSync(new URL("../src/game/40-ch4.js", import.meta.url), "utf8");
g.check("the spoiler line is gone from Chapter 2", !src.includes("A hoof stamp. Mops signed it."));
g.check("Chapter 4 still asks who the Guardians were", ch4.includes("...Then who were the Guardians?"));

const { ctx, page, errors } = await g.open("?ch=2");
const played = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.log = [];
  ss.ch2.has = "soup";
  ss.resetTo("g4k");
  ss.ch2.has = "soup";
  n.q = []; n.cur = null; n.ctrl = true;
  n.mo.x = 170; n.mo.y = 540;
  const spot = ss.spotsNow().find((sp) => sp && sp.verb === "LEAVE SOUP" && sp.when);
  if (!spot) return { err: "no LEAVE SOUP" };
  spot.f();
  ss.drain();
  const bub = n.log.filter((e) => e.k === "bub").map((e) => e.text);
  const panel = n.log.filter((e) => e.k === "panel").map((e) => e.text);
  return { err: "", bub, panel, scene: n.scene, room: n.room };
});
const writer = /mops/i;
const namesWriter = played.bub.filter((t) => writer.test(t) && /sign|wrote|written|writer|note/i.test(t));
g.check("the note sequence plays", !played.err && played.scene.startsWith("G"), played);
g.check("the note panel, the Guardians line, the stamp, and Eat up stay", 
  played.panel.includes("note2") &&
    played.bub.includes("THE GUARDIANS FOUND ME IN SPACE!") &&
    played.panel.includes("stamp") &&
    played.bub.includes("...Eat up, kiddo."),
  played);
g.check("no bubble names Mops as the note-writer before Chapter 4", namesWriter.length === 0 && !played.bub.includes("A hoof stamp. Mops signed it."), { namesWriter, bub: played.bub });
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("soup-note");
