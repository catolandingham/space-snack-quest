# Space Snack Quest

## Source and build

The game's source is in `src/`. `index.html` is build output: never edit it by hand.

- `src/game/` is the game, in pieces the build joins in name order. Each piece starts with one comment line saying what it holds:
  `00-core.js` (sound, title, drawing helpers, the story queue), `10-ch1.js`, `20-ch2.js`, `30-ch3.js`, `40-ch4.js` (one per chapter),
  `50-story-frame.js` (the story update every chapter shares), `60-frame-draw.js` (the frame update and the main draw),
  `90-input-shell.js` (keys, taps, the debug link, `window.__ss`, the page and touch controls). The pieces are cut from one function,
  so no piece runs on its own; read them as one file in that order.
- `src/vendor-react.js` is the React runtime. Leave it alone.
- `src/index.template.html` is the page around the program.

```
npm run build
npm run check-build
```

`npm run build` writes `index.html` from `src/`. `npm run check-build` fails if the committed `index.html` is not a fresh build of `src/`. The build compacts the code with esbuild but keeps every name, so a name seen in the browser can be found in `src/game/`.

To give a short name a readable one, use the rename tool. It changes only that one variable (Babel's scope analysis), never an object key or another variable with the same short name, and refuses a new name that would collide:

```
npm run rename -- k ch2 src/game/20-ch2.js:22
```

The last part is a line where the old name appears. Each rename is recorded in `tools/renames.json` (old name, new name, where, why, date), so renames can be reviewed in a pull request; `npm run rename` with nothing after it applies any entry not yet applied. Then run `npm run build && npm test`.

`src/` is the readable copy of `index.html` at commit `15051ec`, made with Prettier 3.9.10 (`--print-width 140`). `node tools/equivalence.mjs` is the one-time proof that the build is the same program as that commit. `node tools/equivalence.mjs <ref>` checks that a fresh build plays the same as `index.html` at `<ref>` (40 Enter presses in each chapter, and the Chapter 2 keyboard route).

## Debug link

Add these to the address of `index.html` to jump into the game. Without them, nothing changes.

- `?ch=2` starts Chapter 2 from the title, even if it is still locked.
- `?ch=2&phase=wash1` starts Chapter 2, then jumps to that checkpoint (the same table Reset section uses, `applyG` in `src/game/20-ch2.js`).
- `?scene=P3` starts that scene's chapter, then opens the scene.
- `&debug=1` shows a line under the game, updated four times a second: chapter, scene, phase, room, who you control, pose, the prompt, the button label, the chip, security, and the kitchen warn and peek timers. The Copy button copies it. The backtick key hides and shows it.

For example, `index.html?ch=2&phase=wash1&debug=1` opens the kitchen sink with the line showing `phase wash1` and `control Squatch`.

## Phase 1: kitchen and diner clarity

Branch `phase-1-kitchen-clarity` makes Chapter 2 clear to a 10-year-old (plan section 3, tasks T5 to T12). Every new line the player reads is listed for Brian in `docs/PHASE-1-LINES-FOR-BRIAN.md`.

- The goal chip names who acts and what to do, from one table (`CH2_CHIPS`), and hides while a bubble is up. `tests/ch2-goal-chip.mjs`.
- Every switch between Squatch and Mops goes through `switchTo` and, in Chapter 2, shows a card with the reason; a "YOU: SQUATCH" or "YOU: MOPS" tag sits over the picture; room changes show one short line. `tests/ch2-switch.mjs`.
- Every Chapter 2 state offers a way forward (BACK · kitchen, Squatch in control after the soup, g4l resets to the next dishes) and Squatch is out of sight while Mops is out front. `tests/ch2-next-step.mjs` writes the action table to `tests/out/next-step.json`.
- No capture while the player is Mops; a shoo costs no stars; the LOCKUP card says who saw Squatch and where. `tests/ch2-capture-cause.mjs`.
- Speech bubbles sit over the speaker, one at a time; a voice from another room gets an ear at the door. `tests/bubble-anchor.mjs`.
- The soup bowl rests on Mops' head, with steam and a spoon. `tests/soup-on-head.mjs`.
- Every Chapter 2 action reads "VERB · thing" on the button and the picture, in letters at least 16 px. `tests/action-labels.mjs`.
- The help line names only controls that work. `tests/help-text.mjs`.

Test hooks added for these: `__ss.resetTo(phase)`, `pickAct()`, `walkBounds()`, `drain()`, `sqAway()`, `CH2_CHIPS`, `ch2ChipKey()`, `lastBubble`, `bubbleFrame`. `tests/game-page.mjs` is the shared start-up code for the new suites.

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

`docs/story-bible.md` is the Chapter 2 kitchen revision. Everything else in the story stays the original spine. Open conflicts outside that kitchen are in `docs/STORY-DECISIONS.md`. `docs/README.md` points at both, and at the section-reset checkpoints. `docs/MASTER-BACKLOG.md` is the status page. PR #4 is on `main` at `9999f0cd` (the same tree as kitchen C `6853902`). The site is not confirmed live. PR #5 is the open recovery branch, restacked onto that commit. The independent reset check is the list on that page.

From the repo root:

```
npm install
npm test
```

`npm test` runs every suite in `tests/` one at a time and prints one PASS or FAIL line per suite. It exits non-zero if any suite fails. To run one suite: `npm run test:one tests/kitchen.mjs`.

The tests find Chrome on their own: the `CHROME` environment variable if it is set, then Google Chrome in `/Applications` on a Mac, then `/usr/bin/google-chrome`. Set `CHROME` to use another Chrome or Chromium binary. Pictures the tests save go to `tests/out/`, which git ignores.

If `puppeteer-core` is missing, or Chrome cannot be found or started, the test prints the failed step and the command to fix it, then exits.
