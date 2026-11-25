# Space Snack Quest: rules for every agent

A Sierra-style browser adventure for a 10-year-old (keyboard, mouse, touch).
Owner: Brian, designer and playtester, not a programmer. Clarity beats cleverness.

New here? Read docs/START-HERE.md first: what matters now (Chapter 1), the ranked problem list, and the loop to follow.
What to build: `docs/BRIAN-ASKS-OPEN.md`, everything Brian asked for that is not in the game yet, in his own words. Read "Build next" before choosing work. Brian's messages are the spec; the other docs are summaries that lag (2026-11-23: his newest music and morning asks sat unbuilt while work followed older lists). When something on it is built, remove its line in the same change.
Before sending Brian any picture, check everything visible in it against the approved look (locked rooms, approved characters), not only what you changed.

## Code
- Source is src/. index.html is build output: never edit it by hand. Build: npm run build.
- Tests: npm test (all). One suite: node tests/<name>.mjs. Chrome is found on a Mac; else set CHROME.
- Debug: index.html?ch=2&phase=wash1&debug=1 opens a checkpoint with the state strip. ?scene=P3 opens a scene. On localhost, ?beat=day2 opens Day 2. The live site ignores it.
- Find code by quoted anchors, not line numbers. Rename only with npm run rename.
- New code goes in `src/modules/` as real modules (ES modules, bundled by esbuild into their own script that runs before the older program). New code meets the older program only through `window.SSQ` (`src/modules/bridge.js`): a rebuilt beat registers there by id; when a beat first needs engine functions (walking, catching, drawing), a hand-over for exactly those is added to the bridge. The older program guards every use (`window.SSQ && ...`) so the game still runs if the module script fails. Do not add new pieces to `src/game/`. When a beat is rebuilt as a module, delete its old code in `src/game/` in the same change. `tests/module-build.mjs` checks each part sits in its own script; to prove a step changed nothing a player sees, compare builds with `node tools/compare-builds.mjs <git ref>`.

## Brian's design rules (full text: docs/REVIEW-RULES.md)
1. Every beat has a cause, a need it answers, and an effect. Armature: "Home is where love doesn't have to hide."
2. A 10-year-old must get it. Short lines. A cutscene beats a clever clue.
3. One new idea per beat. One bubble at a time. Nothing auto-advances, except (Brian, 2026-11-24, "30a") a cutaway picture with no words and nothing to tap: it plays by itself for 2 to 4 seconds, ending on a clear last frame, then the game goes on. One with a line or something to tap still waits for NEXT.
4. Nothing is named before it is shown; what a line mentions is visible and glows when it matters.
5. Draw it, don't describe it. No narration in parentheses.
6. Script lines are word for word from the spine. New or changed lines need Brian's yes.
7. Squatch talks to no stranger until Chapter 4.4. Singing only at lure spots and scripted bond moments.
8. Everyone who can see Squatch reacts every time, and shows a cone or an eye.
9. Every sighting has a felt consequence. Audits judge meaning; a string match is never a pass.
10. Bubbles sit over the speaker; overheard lines get an ear icon. No chip while a bubble is up.
11. The player always knows the goal, the next small step, and why something just happened.
12. Every side quest is funny or moves the story.
13. Never show an outcome without the event that caused it.
14. Locked room pictures. The rule in docs/locked-rooms/README.md, word for word: "Do not redraw a room freehand, and do not change these files, without Brian's yes and a new locked version." Mops's beard is his mop; no separate mop prop. Do not replace or restyle a locked picture. Any visual change needs Brian's approval first.

## Conventions
- Capture: one rule everywhere. Seen, alarm, security comes, time to hide, "They lost you" if hidden;
  caught shows the lockup card naming who saw him and where, then the section restarts.
  Do not add a new capture path. (Star rules: see docs/STORY-DECISIONS.md D1.)
- Prompts: every action reads "VERB · thing" (for example "HIDE · crate", "BUY · soup 30"), and the thing
  is visible where the prompt sits. The chip names who acts: "Mops: walk to the diner door."
- A ring and its trigger come from the same spot entry. Never hand-type a ring box.
- Every switch between Squatch and Mops goes through switchTo(who, why) and is announced.
- HUD: page text in fixed zones (top left: chapter, ↺, stars; top center: goal chip; top right: faces, shown only
  where a switch to the other character is possible, Brian 19a),
  over the picture on a computer and in a bar above it on a phone. Do not draw status into the canvas.
  tests/hud-layout.mjs checks, at 375x812 and 1100x800 in eight states, that HUD boxes do not overlap each
  other or the sound button, stay in their zone, use text of 14 px or more, hide under cards and
  flashbacks, that ↺ and the faces are 44 px targets, and that no face shows where no switch is possible.
  It does not check text drawn in the canvas.
- A new key idea is taught once with a zoom-in card (spotlight on the thing, one line): teach(id, at).

## How work gets done
- Every task states how to verify it. Done = the verify command passes, npm test passes,
  and a separate reviewer agent read the diff against this file. Authors never grade their own work.
- Add a test with each fix. Tests guard regressions. Brian's recordings judge how it plays.
  Do not drive a browser by hand to playtest.
- When an agent makes a mistake, write the fix into this file or docs/REVIEW-RULES.md in the same PR.
- Prefer small files and data tables over numbers typed in many places.
- Every PR updates README.md and docs/MASTER-BACKLOG.md and says "Docs match main: yes."
- Report to Brian in plain English in chat: what the player will notice, one screenshot, the verify output.
- No merge or deploy without Brian's yes, written in the PR.
- Reports and PR bodies use `docs/HANDOVER-TEMPLATE.md`. Anything not checked is NOT ASSESSED, never passed. End with "Not yet played by a person" unless `QA-LOG.md` covers that commit.
- Big docs have a section index. Read the index and one section (`node scripts/md-section.mjs extract <file> "<heading>"`). Do not read `docs/DECISIONS.md`, `docs/CH1-LINES-FOR-BRIAN.md`, `docs/MASTER-BACKLOG.md`, `docs/STATE.md`, or `docs/CH1-STORY-WALKTHROUGH.md` whole unless asked.
- `docs/TUNING-PINS.json` is the approved numbers. Changing one needs Brian's written yes in the PR, called out in the PR body.
