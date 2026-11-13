// Blocks a push or merge to main, an edit under docs/locked-rooms/, and a commit of watermarked media.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const raw = await new Promise((resolve) => {
  let s = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (d) => (s += d));
  process.stdin.on("end", () => resolve(s));
});

let event = {};
try {
  event = raw.trim() ? JSON.parse(raw) : {};
} catch {
  event = {};
}

const deny = (message) => {
  process.stdout.write(JSON.stringify({ continue: false, permission: "deny", user_message: message, agent_message: message }));
  process.exit(0);
};

const command = String(event.command || "");
const tool = event.tool_input || event.input || {};
const path = String(tool.path || tool.file_path || tool.target_file || "");

if (/docs\/locked-rooms\//.test(command) || /docs\/locked-rooms\//.test(path)) {
  deny("docs/locked-rooms/ is locked. Brian has to say yes before those pictures change.");
}
if (/\bgit\s+push\b/.test(command) && /\bmain\b/.test(command)) {
  deny("Push to main is blocked. Open a pull request and wait for Brian's yes.");
}
if (/\bgh\s+pr\s+merge\b/.test(command) || (/\bgit\s+merge\b/.test(command) && /\bmain\b/.test(command))) {
  deny("Merging to main is blocked until Brian says yes in the pull request.");
}

if (/\bgit\s+commit\b/.test(command)) {
  let names = "";
  try {
    names = execSync("git diff --cached --name-only", { encoding: "utf8" });
  } catch {
    names = "";
  }
  const marks = ["shutterstock", "gettyimages", "istock"];
  for (const name of names.split("\n").map((s) => s.trim()).filter(Boolean)) {
    if (/watermark/i.test(name)) deny("That file name looks watermarked: " + name);
    if (!/\.(png|jpe?g|webp|gif|mp4|webm)$/i.test(name)) continue;
    let bytes = "";
    try {
      bytes = readFileSync(name).toString("latin1").toLowerCase();
    } catch {
      continue;
    }
    if (marks.some((m) => bytes.includes(m))) deny("Watermarked media cannot be committed: " + name);
  }
}

process.stdout.write(JSON.stringify({ continue: true, permission: "allow" }));
