# Space Snack Quest: rules for every agent

A Sierra-style browser adventure for a 10-year-old (keyboard, mouse, touch).
Owner: Brian, designer and playtester, not a programmer. Clarity beats cleverness.

## Code
- Source is src/. index.html is build output: never edit it by hand. Build: npm run build.
- Tests: npm test (all). One suite: node tests/<name>.mjs. Chrome is found on a Mac; else set CHROME.
- Debug: index.html?ch=2&phase=wash1&debug=1 opens a checkpoint with the state strip. ?scene=P3 opens a scene.
- Find code by quoted anchors, not line numbers. Rename only with npm run rename.

## Brian's design rules (full text: docs/REVIEW-RULES.md)
1. Every beat has a cause, a need it answers, and an effect. Armature: "Home is where love doesn't have to hide."
2. A 10-year-old must get it. Short lines. A cutscene beats a clever clue.
3. One new idea per beat. One bubble at a time. Nothing auto-advances.
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

## Conventions
- Capture: one rule everywhere. Seen, alarm, security comes, time to hide, "They lost you" if hidden;
  caught shows the lockup card naming who saw him and where, then the section restarts.
  Do not add a new capture path. (Star rules: see docs/STORY-DECISIONS.md D1.)
- Prompts: every action reads "VERB · thing" (for example "HIDE · crate", "BUY · soup 30"), and the thing
  is visible where the prompt sits. The chip names who acts: "Mops: walk to the diner door."
- A ring and its trigger come from the same spot entry. Never hand-type a ring box.
- Every switch between Squatch and Mops goes through switchTo(who, why) and is announced.
- HUD: page text over the picture in fixed zones (top left: chapter, ↺, stars; top center: goal chip;
  top right: faces). Do not draw status into the canvas. tests/hud-layout.mjs fails on any overlap.
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
