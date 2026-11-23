# Chapter 1 design check, 2026-11-22

Why: Brian caught that a question assumed a hangar bay code the approved design does not have ("If you pay attention to the approved design of when they leave the first planet you'll see there is no hangar bay code"). So every one of the 61 beats in `docs/CH1-STORY-WALKTHROUGH.md` was checked against the newest design (`docs/DECISIONS.md` 2026-11-22 sections, then `docs/WHAT-GOOD-LOOKS-LIKE.md`, then the walkthrough) and against what v1's code does today.

How: four Sonnet helpers read the code (one also ran the game for beats 22 to 42), one report per stretch of beats, with `file:line` anchors. They read code; on-screen claims are from code unless the report says it played it. Not checked by a person.

| Beats | Report | Matches | Differs, code fix | Differs, design unclear | Missing | Old-design leftovers |
| --- | --- | --- | --- | --- | --- | --- |
| 1 to 8 | `beats-01-08.md` | 0 | 7 | 1 | 1 | 11 |
| 9 to 21 | `beats-09-21.md` | 1 | 10 | 1 | 1 | 8 |
| 22 to 42 | `beats-22-42.md` | 9 | 8 | 3 | 1 | 7 |
| 43 to 61 | `beats-43-61.md` | 11 | 5 | 2 | 1 | 6 groups |

About 21 of 61 beats match the newest design today. Most differences are the newer decisions (morning order, outlines, cones, dress-up) not yet built, plus old-design leftovers: the hangar code, the "Cool hat!" timer, the SNAG, SUCK and STAND party buttons, rings and arrows, a computer drawn in the hallway (decision R46 puts it in the manager's office), a stray bin paper drawn in every room on Day 2, and dead older scene chains in `src/game/10-ch1.js`, `11-ch1-hall.js` and `12-ch1-redesign.js`.

The design questions each report raised were settled on 2026-11-22: most by Claude from Brian's own words and the repo's rules (listed in `docs/DECISIONS.md`, "Claude's design calls", for Brian to veto), and the rest put to Brian with a recommendation.

Use: when a sitting rebuilds a beat, read that beat's block in the matching report first, delete the leftovers it lists for that beat in the same change, and update the block.

Correction: beat 10 (dance game) is marked MATCHES in `beats-09-21.md` because the code is there. Grok Bot's audit (#351) found it could not be played by touch ("Every tap scores 0; only keyboard arrow keys work."). Not rechecked today. It is out for now (`docs/DECISIONS.md`).

## Second pass: four fresh angles (2026-11-22)

After Brian asked for "one more pass to see what else you think you understand but don't yet", four Sonnet helpers each looked from one angle, without seeing each other's work: `angles/story-logic.md` (causes and effects across the 61 beats), `angles/missing-words.md` (Brian's words in no doc), `angles/contradictions.md` (docs that disagree), `angles/missing-assets.md` (pictures, sounds and words the design needs that do not exist yet: 83 pending lines across 41 beats). What they found was settled the same day in `docs/DECISIONS.md` ("Story and points, settled 2026-11-22", "Claude's design calls", and the party-hall bar request). The assets list is the to-do list for pictures and words Brian must see or approve.

## Brian's repeat complaints (2026-11-22)

Brian asked for particular attention to "the places where I flagged issues like then it let me climb the walls etc, and places I made repeat requests like the length of the bar, getting sound right, etc". `angles/repeat-issues.md` lists 24 issues he raised more than once, with every citation; 16 were reported fixed and came back. `angles/repeat-guards.md` checks each against today's tests: none fully guarded, 15 partly, 9 not at all; it proposes one regression test per issue and the order to write them.
