/**
 * Where the test suites find Chrome.
 * 1. The CHROME environment variable, if set.
 * 2. Google Chrome on a Mac, if it is installed in /Applications.
 * 3. /usr/bin/google-chrome (Linux).
 */
import { existsSync } from "node:fs";

const MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export function chromePath() {
  if (process.env.CHROME) return process.env.CHROME;
  if (existsSync(MAC_CHROME)) return MAC_CHROME;
  return "/usr/bin/google-chrome";
}
