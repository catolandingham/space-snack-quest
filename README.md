# Space Snack Quest

## Progression tests

`tests/progression.mjs` plays the real game loop in headless Chrome. It checks the hangar door, the Mars reunion, Rusty's gas-stop capture, pump sight, and the closet G-sign and bucket lanes.

From the repo root:

```
npm install --no-save puppeteer-core
CHROME=/usr/bin/google-chrome node tests/progression.mjs
```

`CHROME` is the Chrome or Chromium binary. You can omit it when that binary is already at `/usr/bin/google-chrome`.

If `puppeteer-core` is missing, or Chrome cannot be found or started, the test prints the failed step and the command to fix it, then exits.
