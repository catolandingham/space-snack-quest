# Space Snack Quest

## Progression tests

`tests/progression.mjs` plays the real game loop in headless Chrome. It checks the hangar door, the Mars reunion, Rusty's sighting through security and a section restart, pump sight, and the closet G-sign and bucket lanes.

`tests/gas-stop.mjs` checks the gas stop on its own: security leaves when Squatch hides, Mops walks to the diner door and presses enter, the tank gauge, and that pump-bot cones stay while Rusty's cone is hidden during Mops.

`tests/kitchen.mjs` checks the cook's walked exit, the soup bowl on Mops, the timed hoof stamp, boarding at the ship, the red EXIT door, and that soup still costs 30 coins.

Pump bots on the lot keep their own setback when they see Squatch. Rusty is the one who calls security. That split is intentional; it does not change how hard the bots are.

From the repo root:

```
npm install --no-save puppeteer-core
CHROME=/usr/bin/google-chrome node tests/progression.mjs
CHROME=/usr/bin/google-chrome node tests/gas-stop.mjs
CHROME=/usr/bin/google-chrome node tests/kitchen.mjs
```

`CHROME` is the Chrome or Chromium binary. You can omit it when that binary is already at `/usr/bin/google-chrome`.

If `puppeteer-core` is missing, or Chrome cannot be found or started, the test prints the failed step and the command to fix it, then exits.
