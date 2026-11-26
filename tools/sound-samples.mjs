/**
 * Sound samples for Brian to choose from (Brian 2026-11-26): the voice under speech bubbles. (The three made-up crowd
 * options were turned down the same day: "I don't like any of the crowd sounds"; the crowd waits for a recording.)
 * Renders each option silently in Chrome (an offline audio context, the game's own
 * recipes in src/modules) and writes 9-second mp3s with ffmpeg. The levels are evened out for listening (ffmpeg
 * loudnorm to -20 LUFS); in the game each plays at its own level under the music. Not a test.
 *   node tools/sound-samples.mjs <out folder>
 *     voice-A-muted-trombone.mp3, voice-B-mumbly-hum.mp3, voice-C-blips.mp3 (speech-voice.js, four lines in turn)
 */
import http from "node:http";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromePath } from "../tests/chrome-path.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2];
if (!out) (console.error("Usage: node tools/sound-samples.mjs <out folder>"), process.exit(2));
mkdirSync(out, { recursive: true });
const port = 9480 + Number(process.env.SSQ_PORT_OFFSET || 0);
const page0 = `<!doctype html><meta charset="utf-8"><script type="module">
import { babbleFor, playBabble } from "/src/modules/speech-voice.js";
const RATE = 44100, LEN = 9;
async function render(fill) {
  const c = new OfflineAudioContext(1, RATE * LEN, RATE), g = c.createGain();
  g.connect(c.destination);
  fill({ c, o: g });
  return Array.from((await c.startRendering()).getChannelData(0));
}
window.samples = async () => {
  const outs = {};
  const lines = [["official", "Let's give a big hello to our friends from Bleep-Bloop Robotics!"], ["tourist", "Say cheese!"], ["bartender", "Wait a second... fur!"], ["guard", "Someone pulled the fur alarm."]];
  for (const k of ["A", "B", "C"]) outs["voice-" + k] = await render((A) => { let t = 0.2; for (const [who, text] of lines) { const p = babbleFor({ who, text }); playBabble(A, t, p, k); t += p.len + 0.6; } });
  return outs;
};
window.ready = true;
</script>`;
const server = http.createServer((req, res) => {
  const p = new URL(req.url, "http://x").pathname;
  if (p === "/") return res.writeHead(200, { "content-type": "text/html" }), res.end(page0);
  const f = normalize(join(root, p));
  if (!f.startsWith(join(root, "src", "modules")) || !f.endsWith(".js")) return res.writeHead(404), res.end();
  res.writeHead(200, { "content-type": "text/javascript" });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(port, "127.0.0.1", r));
const puppeteer = (await import("puppeteer-core")).default;
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: "new", args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}/`);
await page.waitForFunction(() => window.ready === true);
const data = await page.evaluate(() => window.samples());
await browser.close();
server.close();
const NAMES = { "voice-A": "voice-A-muted-trombone", "voice-B": "voice-B-mumbly-hum", "voice-C": "voice-C-blips" };
const tmp = join(out, ".work");
mkdirSync(tmp, { recursive: true });
for (const [k, samples] of Object.entries(data)) {
  // a 16-bit mono wav, then an mp3 with its loudness evened out
  const n = samples.length,
    buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(44100, 24);
  buf.writeUInt32LE(88200, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(samples[i] * 32767))), 44 + i * 2);
  const wav = join(tmp, k + ".wav");
  writeFileSync(wav, buf);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", wav, "-af", "loudnorm=I=-20:TP=-2", "-ar", "44100", "-b:a", "128k", join(out, NAMES[k] + ".mp3")]);
  console.log("wrote " + NAMES[k] + ".mp3");
}
rmSync(tmp, { recursive: true, force: true });
