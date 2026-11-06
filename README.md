# Space Snack Quest

## Progression tests

`tests/progression.mjs` plays the real game loop in headless Chrome. It checks the hangar door, the Mars reunion, Rusty's sighting through security and a section restart, pump sight, and the closet G-sign and bucket lanes.

`tests/gas-stop.mjs` checks the gas stop on its own: security leaves when Squatch hides, Mops walks to the diner door and presses enter, the tank gauge, and that pump-bot cones stay while Rusty's cone is hidden during Mops.

`tests/kitchen.mjs` checks the cook's walk out the kitchen door, the soup bowl on Mops, the timed hoof stamp, boarding at the ship, the red EXIT door, the soup-or-gas purchase, the scrub gag, and the rumble before the cook wakes.

Soup and the tank each cost 30. The tip jar still fills with 30 when a wash set finishes. Grabbing it turns the jar into coins, and buying soup spends those coins once: Mops has soup, the jar is 0, and the register is 30. A later jar buys the gas. Cooking a ticket does not pay coins.

Pump bots call security the same way Rusty does. Hiding sends security away. Getting caught shows the holding pen and restarts the current section. Their "report him or fuel him" line stays. Cone length and patrol speed are unchanged. The singing lure is still its own setback.

On Stormtop, the fear is specific: fur clogs the air scrubbers. After that, locals are still afraid of a Sasquatch, and that fear is not the scrubber fear. Troopers, searchlights, and gate bots are the ones who lock him up. Locals are not harmless. Squatch's lines move from panic to choosing a hiding place. Sightings, cones, and prices do not get easier.

If Gloop or Blorp recognizes him at the counter, they still say their own startled line and shove him, and they call security. Gloop's kitchen window is a short uncertain look, then the cook faints and security comes. Hiding or rolling sends security away. Getting caught still restarts that section and does not touch the jar. The holding pen looks different for Rusty, the pump bots, the counter, and the kitchen window.

Each scrub in the wash shows the dish, Squatch's paw, and a sponge. A plate still being washed says DIRTY DISH. The third scrub says CLEAN DISH and stays 3/3 until the picture clears. The card closes before the wash-set line and before the greasy-pot handoff, so those spoken lines stay whole. The cook still wakes on the same timer; Squatch's stomach rumbles just before she does. Mops wears a chef hat only while he is cooking in the kitchen. The kitchen is one floor. A full-height diner door stands on the left. The sink stays on the left of a continuous counter, the service window is the middle bay (about 300 wide, where Gloop hangs the next three tickets and can pass a hand), and a four-burner range with an oven door is built into the right end. Three spice jars sit on a rack on that counter, past the burners. Mops runs the sink-to-range distance. LEAVE SOUP stays on the crate hotspot and its label sits beside the door. After the greasy pot, Mops keeps the mop and stays in the kitchen. Hold Reset section (or the R key) to return to this section's capture checkpoint. It does not pay coins or skip ahead. None of that changes the three-scrub count, the 30-coin jar, cones, or security. The kitchen drawing at `6853902` passed visual review for that drawing. Reset section is in this branch at `17a03c2`. The evidence, and what is still open, is in `docs/MASTER-BACKLOG.md`.

## Left as they were

These came up in the notes and were not given a new behavior:

- Coins are not paid per dish. The jar is 30 at the end of a wash set.
- Mops already whispers in a few lines. Nothing new was added to that.
- Character size was checked and left alone. The closet zooms both of them, the duct draws Mops smaller so he fits the pipe, and the large portrait is a close-up.
- Only the old DUCK prompts became ROLL. Hiding in a crate, a barrel, or under the bed is unchanged.
- The bots' "You watch the crate" lines stay. They happen before Gloop sends them to the dock.
- The lockup card is the jail. There is no separate jail game.
- Cook and Gloop stay two speakers.

`docs/story-bible.md` is the Chapter 2 kitchen revision. Everything else in the story stays the original spine. Open conflicts outside that kitchen are in `docs/STORY-DECISIONS.md`. `docs/README.md` points at both, and at the section-reset checkpoints. `docs/MASTER-BACKLOG.md` is the status page: PR #4 `cursor/wash-presentation-f809` at `6853902`, PR #5 `cursor/p0-reliability-f809` at `17a03c2`. Composition C is the passed kitchen drawing. The independent reset check is the list on that page.

From the repo root:

```
npm install --no-save puppeteer-core
CHROME=/usr/bin/google-chrome node tests/progression.mjs
CHROME=/usr/bin/google-chrome node tests/gas-stop.mjs
CHROME=/usr/bin/google-chrome node tests/kitchen.mjs
CHROME=/usr/bin/google-chrome node tests/reliability.mjs
```

`CHROME` is the Chrome or Chromium binary. You can omit it when that binary is already at `/usr/bin/google-chrome`.

If `puppeteer-core` is missing, or Chrome cannot be found or started, the test prints the failed step and the command to fix it, then exits.
