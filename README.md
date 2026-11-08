# Space Snack Quest

## Source and build

The game's source is in `src/`. `index.html` is build output: never edit it by hand.

- `src/game/` is the game, in pieces the build joins in name order. Each piece starts with one comment line saying what it holds:
  `00-core.js` (sound, title, drawing helpers, the story queue, spots), `10-ch1.js` and `11-ch1-hall.js` (Chapter 1, in two parts),
  `20-ch2.js`, `30-ch3.js`, `40-ch4.js` (one per chapter),
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
- Every switch between Squatch and Mops goes through `switchTo` and, in Chapter 2, shows a card with the reason; room changes show one short line. (A "YOU:" tag over the picture was removed in Phase 2 at Brian's request.) `tests/ch2-switch.mjs`.
- Every Chapter 2 state offers a way forward (BACK · kitchen, Squatch in control after the soup, g4l resets to the next dishes) and Squatch is out of sight while Mops is out front. `tests/ch2-next-step.mjs` writes the action table to `tests/out/next-step.json`.
- No capture while the player is Mops; a shoo costs no stars; the LOCKUP card says who saw Squatch and where. `tests/ch2-capture-cause.mjs`.
- Speech bubbles sit over the speaker, one at a time; a voice from another room gets an ear at the door. `tests/bubble-anchor.mjs`.
- The soup bowl rests on Mops' head, with steam and a spoon. `tests/soup-on-head.mjs`.
- Every Chapter 2 action reads "VERB · thing" on the button and the picture, in letters at least 16 px. `tests/action-labels.mjs`.
- The help line names only controls that work. `tests/help-text.mjs`.

Test hooks added for these: `__ss.resetTo(phase)`, `pickAct()`, `walkBounds()`, `drain()`, `sqAway()`, `CH2_CHIPS`, `ch2ChipKey()`, `lastBubble`, `bubbleFrame`. `tests/game-page.mjs` is the shared start-up code for the new suites.

## Phase 2: tests, dead engine out, files by chapter, rings, captions

Branch `phase-2-structure` (plan section 4, tasks T13 to T18). Every new line the player reads, and every place a ring moved, is listed for Brian in `docs/PHASE-2-LINES-FOR-BRIAN.md`, with what is not finished.

- `tests/ch2-playthrough.mjs` plays Chapter 2 from `?ch=2` to the tally card with real key presses (arrows, E, Enter), following `tests/routes/ch2.json`. It never writes to the game. A step stuck for 20 seconds fails with its number and the debug strip's state line. `ROUTE_LOG=1` prints each step. About 95 seconds.
- `tests/phone-tap.mjs` plays the same route's start on a 375 by 812 phone with touches only (joystick, ACTION button, a tap on the picture) through the diner and the first kitchen dish. Both use `tests/route-player.mjs`.
- The old level engine (keypad, dish mini-game, guard AI, old levels and their exports) is gone. `node tools/equivalence.mjs <ref>` shows a fresh build plays the same as `index.html` at `<ref>`.
- The source is in pieces by chapter (see "Source and build"), and `npm run rename` renames one variable safely.
- One helper, `spot` in `src/game/00-core.js`, holds every action in all four chapters: what the button says, where the player's feet must be, and the ring, which is drawn from those same numbers. `tests/ring-equals-trigger.mjs` checks every ring in 77 states.
- Every action in Chapters 1, 3 and 4 reads "VERB · thing", and those chapters have goal chips from one table each (`CH1_CHIPS`, `CH3_CHIPS`, `CH4_CHIPS`). `tests/action-labels.mjs` (all chapters) and `tests/chapter-chips.mjs`.

Test hooks added: `__ss.spotsNow()`, `placedSpots()`, `offerNow()`, `drawFrame()`, `rings()`, `inSpot()`, `chipNow()`, `chipKeyNow()`, `CH1_CHIPS`, `CH3_CHIPS`, `CH4_CHIPS`. `tests/chapter-states.mjs` holds the states the ring and caption tests share.

## Phase 3: one capture rule, phone HUD, tap to walk

Branch `phase-3-fairness-hud` (plan section 4, tasks T19 to T23, with Brian's decisions of 2026-11-07). Every new line the player reads is listed for Brian in `docs/PHASE-3-LINES-FOR-BRIAN.md`, with what is not finished.

- One capture rule in every chapter: seen, security comes, time to hide ("They lost you." if hidden), caught shows the LOCKUP card with who saw Squatch and where, then the section restarts from its checkpoint with coins and stars kept. No catch takes stars. `src/game/25-capture.js`; `tests/capture-rule.mjs`.
- The HUD is page text over the picture in fixed zones: chapter, ↺ and stars top left; the goal chip top center; the faces top right. The ↺ button (hold) replaces the big Reset section button; the sound button is under the picture. After 60 seconds without progress the chip shows how to do the step. On a phone the game sits at the top of the screen. `src/game/80-hud.js`; `tests/hud-layout.mjs`.
- The kitchen window warning lasts 2.5 seconds and shows: the window frame flashes and Gloop fills the window until her look ends. `tests/kitchen-warning.mjs`.
- A tap on the picture walks there when no bubble or card is up; the big button acts. `tests/phone-tap.mjs` reaches the diner with taps and the button only.
- Small feel fixes: an early tap on a bubble is kept and shown; the action clears when a scene takes control; the awards say what they were for. COOK stays as on main. `tests/feel-fixes.mjs`.
- Zoom-in cards (the opening's spotlight card) teach the first hide and the first switch in Chapter 1. `tests/zoom-cards.mjs`.

Test hooks added: `__ss.capture()`, `shoo()`, `lostYou()`, `startSec()`, `CAPTURES`, `LOCKUP_RESTART`, `hallAlarm`, `hallAlarmStart()`, `CH1_CHECKPOINTS`, `CH3_CHECKPOINTS`, `CH4_CHECKPOINTS`, `stallFor()`, `methodLine()`, `METHOD_LINES`.

## Chapter 1 pass: the night out has a purpose, switches say why

Branch `chapter-1-pass`. Not merged. Every new line waits for Brian's yes in `docs/CHAPTER-1-LINES-FOR-BRIAN.md`, which starts with what Chapter 1 now has and still does not have.

- The night out (O3 to O6, Brian's D15): Squatch sneaks into the lobby to find out what is going on and reads a NOTICE on a brochure table ("ROBOT JANITORS COMING."). The vent's pull is drawn at all times; a tuft of fur drifts toward it, and 1.5 seconds in the pull sets off "FUR IN THE VENT!". Sightings and the vent go through the one capture rule (HIDE! into the closet, or LOCKUP and the night starts over). The notice comes back in O5, O6 and S3. `tests/ch1-lobby.mjs`.
- Every Squatch and Mops switch in S9, S10 and S11 shows a switch card with a reason (the first, taught by the zoom-in card, does not). `tests/ch1-switch.mjs`.
- Order fixes: nobody says "robot" before the notice or "Wookie" before the flashback; the S6 and S7 slip peeks no longer name the hangar code; O3 and O6 have the spine's "Everybody has somebody" and "You have me".
- `tests/ch1-playthrough.mjs` plays Chapter 1 from `?ch=1` to the tally card with real key presses (and mouse clicks on the faces, since there is no switching key), following `tests/routes/ch1.json`, and must end never caught. About 4 minutes.

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
