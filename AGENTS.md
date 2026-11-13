# Space Snack Quest

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
14. Locked room pictures. The rule in docs/locked-rooms/README.md, word for word: "Do not redraw a room freehand, and do not change these files, without Brian's yes and a new locked version." Mops's beard is his mop; no separate mop prop. Do not replace or restyle a locked picture. Any visual change needs Brian's approval first.

## Play rules Brian set on 2026-11-13
1. A speaker's bubble comes from that speaker, or from the spot they are hiding in. The tail points at them. The bubble does not cover a face.
2. When someone hides in a plant, the eyes sit low in the front leaves, on the plant (C21, reconfirmed 2026-11-13).
3. A chip or hint only describes what the player can do right now.
4. Do not auto-walk the player to a goal they are meant to reach. Walking in through a door is still the room change.
5. A goal hint is an outline of the real thing, never a circle and never a box.
6. Words and hints only mention things that are actually in that room.
7. Someone addressing the party stands on the stage, and the guests face them.
8. A prop points the way it would in real life. The party camera points at the stage.
9. Every touch label is a real tap target, at least 44 pixels.
10. Do not fade in from black unless the moment is a cutscene. The dress-up board fades up over the room.
11. A stage direction is shown with a picture or a sound, not with words in parentheses.
12. A story pause waits for a tap, unless it is a cutscene. Wordless walks can still play themselves (W23).
13. Locked room pictures only. No new on-screen words without Brian's yes.

## Conventions
- Capture: one rule everywhere. Seen, alarm, security comes, time to hide, "They lost you" if hidden; caught shows the lockup card naming who saw him and where, then the section restarts. Do not add a new capture path.
- Prompts: every action reads "VERB · thing", and the thing is visible where the prompt sits. The chip names who acts.
- A ring and its trigger come from the same spot entry. Never hand-type a ring box.
- Every switch between Squatch and Mops goes through switchTo(who, why) and is announced.
- HUD: page text in fixed zones. Do not draw status into the canvas. tests/hud-layout.mjs checks 375x812 and 1100x800.
- A new key idea is taught once with a zoom-in card: teach(id, at).

## How work gets done
- Every task states how to verify it. Done = the verify command passes, npm test passes, and a separate reviewer agent read the diff against this file. Authors never grade their own work.
- Add a test with each fix. Tests guard regressions.
- Phone playthroughs (375x812, taps only) are tests/ch1-playthrough.mjs and tests/ch2-playthrough.mjs. CI runs them and keeps the video.
- When an agent makes a mistake, write the fix into this file or docs/REVIEW-RULES.md in the same PR.
- Prefer small files and data tables over numbers typed in many places.
- Every PR updates README.md and docs/MASTER-BACKLOG.md and says "Docs match main: yes."
- Report to Brian in plain English: what the player will notice, one screenshot, the verify output.
- No merge or deploy without Brian's yes, written in the PR. Hooks block a push or merge to main, edits under docs/locked-rooms/, and a commit of watermarked media.
- Balance numbers (prices, timers, notice radius, photo points) stay put unless Brian says yes. tests/rules-guard.mjs watches them.
