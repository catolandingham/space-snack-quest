# Review rules

Copied word for word on 2026-11-06 from the "Process: review checklist" section of `HANDOFF.md` (HANDOFF: Space Snack Quest v3, updated 2026-11-02, in the Grok workspace zip). Do not edit these rules without Brian's yes. `CLAUDE.md` at the repo root holds the short form.

## Process: review checklist (CUMULATIVE; never drop a check, only add)
Run EVERY scene through ALL of these, both at script time and on screenshots after it's built.
1. **Domino rule.** Each step has a CAUSE (why now, because of the last step), a NEED (what the player already felt from earlier play), an EFFECT (what it knocks over next) and touches the ARMATURE. If it fails 1–3, add a setup or cut it.
2. **One armature:** "Home is where love doesn't have to hide." (hiding vs being seen; love that hides).
3. **Every side quest is funny or drives the story.** No fat.
4. **Clarity beats cleverness.** Use a cutscene rather than a confusing clue. A 10-year-old must get it. Short, punchy lines.
5. **Flashbacks** open with a plain "Years ago, on Stormtop..." card and end with a plain "Now" card, desaturated with a thin border. Live cutscenes get no card.
6. **One idea at a time, and a slow opening.** One new idea per beat, then a player action or a ≥2.5s breather before the next idea. At most one new mechanic per beat. One speech bubble at a time.
7. **Nothing is mentioned before it's shown.** Every referenced object is visible, sits where the line says, and is highlighted when it matters.
8. **Everything makes sense at the moment it's seen.** Every person and object has an in-world reason for being there, shown: who has it, why it's there, how Squatch gets it. Setup comes first. Only show info the player can understand at that moment (e.g. no "ask Zip, Phobos" in Ch1).
9. **Five screenshot-review questions per beat:**
   - (a) Shown, not told: is anything described in text that should be drawn?
   - (b) Set up: has the player been prepared to understand this object or person, and why it matters?
   - (c) One new idea only?
   - (d) Would a 10-year-old get it without explanation?
   - (e) Is every referenced object visible?
10. **Strangers:** Squatch never talks to strangers until Ch4.4. Their clues come through Mops talking, overhearing (ear icon), or objects.
11. **Singing** is a distraction (lure spots only) plus the bond (scripted moments only). No random or ambient singing, no opera, no goat gags unless a scene gives them a purpose.
12. **Verbatim script, and drift audits.** Also audit existing cutscenes against the chat-approved beats. Every line, card and panel is implemented WORD FOR WORD from the spine. If it doesn't fit, split it across bubbles; never rewrite it. There's an exact-text test.
13. **Dialogue presentation:**
    - Story lines are speech bubbles over the speaker (name tag, large text, clamped to the screen edges), with a pop-in and a blip, and a pulsing "tap ▸".
    - The game pauses (no movement, timers or NPCs) until the tap.
    - Ambient chatter is small auto-fading bubbles over the speaker.
    - Overheard lines get an ear icon.
    - No bottom-left dialogue box. The objective chip is hidden while a bubble is up.
14. **Nothing auto-advances.** Every cutscene card, panel, frame and line waits for a tap/click with a pulsing "tap ▸", including the "Years ago" and "Now" cards.
15. **Simple visual style.** Gameplay looks like the cutscenes: bold flat shapes, a limited palette, no clutter, only what matters, and interactive objects clearly highlighted (pulse/glow).
16. **Drawn, not described.** Never put a visual in caption text when it can be drawn (crayon drawings, hair on a note, coffee stains, torn edges, paw prints). No "(narration in parentheses)" lines.
17. **Exact-text rule for briefs:** report scripts to Brian verbatim (speaker + exact text, every card), as clear and warm as the chat version.
18. **One bubble at a time.**
    - Never two bubbles visible at once. A scripted exchange is shown one line at a time.
    - Ambient chatter is queued in sequence, never overlapping.
    - Bubbles clamp to the screen and never collide with each other or the chip.
    - No hint banner or chip while a bubble is up.
    - A mandatory overheard line pauses for a tap.
19. **Consistent sighting rule.**
    - EVERY person or bot with vision reacts whenever Squatch is unhidden in its line of sight: a scream or alert, then security comes.
    - Nobody "randomly doesn't care".
    - Each viewer shows a view cone (bots) or an eye icon plus a soft cone (people), so the player can see who can see him.

20. **First mention.** No character, object or concept is named before it's introduced on screen (e.g. robots before the delegation, Wookie before the flashback, Zip/Phobos, GANITOR). Keep the First-mention list below; there's a test.
21. **Every sighting or alarm has a felt consequence.**
    - Security rushes over, and you get a few seconds to hide.
    - If caught, Mops swoops in: "Just a fuzzy mop! Very fuzzy." / "Shedding season." Then back to the checkpoint.
    - The only exception is O4, the scripted chase home.
22. **Audits judge meaning, not just strings.** A string-presence check alone NEVER counts as a pass (that's how the M1b audit passed bad scenes). Every report includes the per-beat screenshot review table (checks 9 + 6–8, 16, 18–21).
23. **Points.**
    - Every collectible has an in-world reason for being there (who left it, why), comes after its first mention, and passes the Domino rule.
    - No collectibles or score during the opening O0–O9.
    - Getting caught always costs −100 and returns you to the checkpoint; the score never drops below 0; O4 is exempt.
    - Tally card and final score screen wait for a tap.

## Techniques
- **Zoom-in card for a first idea** (Brian, 2026-11-07): the first time a key idea appears (the first hide, the first switch), teach it with the opening's "This is Squatch" card: the room goes dark except a spotlight on the thing, one plain line beside it, wait for a tap, once per play-through (`teach` in `src/game/25-capture.js`).

## Mistake: locked art was redrawn
2026-11-13. An agent redrew Brian's locked room art. The no-redraw rule was already in `docs/locked-rooms/README.md`, but that file existed only on the PR #21 branch when PR #25 was built, and `CLAUDE.md` said nothing about locked rooms, so the agent never saw the rule. The rule is now in `CLAUDE.md` and `AGENTS.md`, word for word: "Do not redraw a room freehand, and do not change these files, without Brian's yes and a new locked version." Mops's beard is his mop; no separate mop prop.

## Mistake: optional inspection interrupted getting out of bed
2026-11-16. The first calendar implementation offered its walking LOOK target while Squatch was seated, and could pause the automatic hop out of bed. Optional inspections must not interrupt a movement transition. Test both the seated state (no walking target) and the active hop (no inspection), as well as normal picture taps and keyboard use. For a drawn paper cutout, fill may close the erased region, but its outline must stay open where the bite meets the page edge; otherwise the missing paper looks like an opaque object pasted on top. Check the rendered pixels and still, not only the bitten flag.

The later full touch run exposed a test-driver gap: it waited whenever walking was disabled, even though the calendar offered a visible NEXT button. A new modal needs a real touch close-and-continue check, and the exploratory test player must follow visible controls while movement is paused. Fix the driver's input route; never bypass the modal, mutate story state, remove its completion check or add a known-failure exemption to make that run green.

## Mistake: a big doc's section index went stale
2026-11-23. A changelog line was added to `docs/MASTER-BACKLOG.md` and the section index at its top was not updated, so `tests/section-index.mjs` failed in the full run. After any edit to a doc with a section index, run `node scripts/md-section.mjs stamp <file>`.

## Mistake: a rebuilt beat forgot the step restart
2026-11-23. The first build of the morning module (src/modules/morning.js) let the hold-to-restart (↺) empty the story queue before the song step, which froze the morning, and in the evening it brought back the song step with Mops. The restart saves a step only once the kid has control and keys it by scene, room and ch1Step, so a beat that runs long without control, or two steps with the same key, needs its own answer. A rebuilt beat says what ↺ does at each of its steps and has a test for it (tests/morning-order.mjs, "↺").

## Mistake: pictures sent to Brian with labels and outlines on top of Squatch
2026-11-23. The first home-alone pictures (PR #84) were checked against the locked rooms, but not for what the game draws on top: the "VERB · thing" labels covered the TV, the closet top, the bed and Squatch's head, the desk's dashed outline ran across Squatch, and an old purple bar crossed the bed in front of him. Brian caught all three. Before sending a picture, look at every label, outline and drawn prop and ask: does it cover Squatch, a bubble, or the thing another line or label names? Labels now follow one rule (`src/modules/cap-place.js`), outlines leave people out (`drawGoalOutline`'s `avoid`), and `tests/home-alone.mjs` and `tests/bed-look.mjs` check them.
