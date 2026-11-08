# Spec notes

## Where to start

Every agent reads `CLAUDE.md` at the repo root first. It holds the short rules, how to build and test, and how to open a scene for debugging.

| Doc | What it is |
| --- | --- |
| [`../CLAUDE.md`](../CLAUDE.md) | Rules for every agent, under 60 lines |
| [`REVIEW-RULES.md`](REVIEW-RULES.md) | Brian's full review checklist, word for word from the Nov 2 handoff |
| [`PLAN-2026-11-06.md`](PLAN-2026-11-06.md) | The plan: phases, decisions, and a brief for every task (T1 to T28) |
| [`CODE-REVIEW-2026-11-06.md`](CODE-REVIEW-2026-11-06.md) | How the code is laid out, what the tests cover, and what blocks progress |
| [`DESIGN-CHECKLISTS.md`](DESIGN-CHECKLISTS.md) | Design checklists for scenes and prompts |
| [`MASTER-BACKLOG.md`](MASTER-BACKLOG.md) | Status of every backlog item |
| [`HERMES-GO.md`](HERMES-GO.md) | The first Hermes job |
| [`playtests/`](playtests/) | Transcribed playtest recordings |
| [`grok-archive/`](grok-archive/) | Everything the Grok threads held, with a feedback index |
| [`story-bible.md`](story-bible.md) | The Chapter 2 kitchen revision |
| [`STORY-DECISIONS.md`](STORY-DECISIONS.md) | Open story conflicts waiting on Brian |
| [`HELD-DECISIONS-FOR-BRIAN.md`](HELD-DECISIONS-FOR-BRIAN.md) | One row per decision still waiting on Brian: the question, the options, a recommendation, and a reply code |
| [`original-story-spine.md`](original-story-spine.md) | Brian's Nov 2 story spine, scene by scene (only the Chapter 2 kitchen was revised since, in `story-bible.md`) |
| [`CHAPTER-1-LINES-FOR-BRIAN.md`](CHAPTER-1-LINES-FOR-BRIAN.md) | The Chapter 1 pass: what Chapter 1 now has and still does not have, then every new line with one alternative |
| [`CHIP-ARMATURE-AUDIT.md`](CHIP-ARMATURE-AUDIT.md) | Every goal chip placed on the story's seven beats, with a verdict where the game departs from the spine |
| [`spine-archive.md`](spine-archive.md) | The previous on-repo story note |

## Story precedence

Story precedence: the original story stays, except the Chapter 2 kitchen sequence in `docs/story-bible.md`.

Open conflicts outside that kitchen are in `docs/STORY-DECISIONS.md`. Each one stays pending until Brian decides that item. The previous on-repo story note is in `docs/spine-archive.md`.

What is playable is the game and the root `README.md`. A story note does not add a mechanic. When a change lands, update the root README in the same pull request and name the branch.

## Capture

One rule in every chapter (Brian's D1, 2026-11-07; Phase 3 task T19; since the Chapter 1 pass it covers the night out in the lobby too, where HIDE! runs Squatch into the closet and a catch starts the night over): someone sees Squatch, security comes, and he has time to hide. Hidden: security leaves and "They lost you." shows. Caught: the LOCKUP card names who saw him and where, the captor's joke follows, and the section restarts from its checkpoint with coins and stars kept. No catch takes stars. A bot that sees Mops shoos him back (D9) with no card. All of it is in `src/game/25-capture.js` (`capture`, `shoo`, `CAPTURES`, and the checkpoint tables `CH1_CHECKPOINTS`, `CH3_CHECKPOINTS`, `CH4_CHECKPOINTS`); Chapter 2's table is `applyG`. `tests/capture-rule.mjs` checks it.

## Section reset

Hold **Reset section** (the button, or the R key) for about three quarters of a second. It calls the same Chapter 2 restart capture uses. It clears the current chase and the unspoken queue, and it does not pay coins, change the register, or grant points.

Mapped checkpoints in the build. The rows the independent pass drove are listed in `docs/MASTER-BACKLOG.md`.

| Phase before reset | Lands on |
| --- | --- |
| `back`, `g1door` | Gas back crate, still hidden |
| `g6`, `g6d`, tank full | Gas `G6` at the door, Squatch at the lure (bots home) |
| `g6` before the tank, Mops has the coins | Gas `G6`, Mops with the coins by the pump |
| `g6d`, or `g6` before the tank without coins | Diner, Mops by the new jar (BOARD needs a full tank) |
| `g3`, `g3hide`, `g3h` | The dock hide, timer 5.5 |
| `wash1` | Kitchen sink |
| `wash5` | Kitchen, by the crate |
| `g4` | Diner counter, Mops |
| `g2` | Diner, at the counter |
| `g4k` | Kitchen cooking visit, Mops by the crate, Squatch hidden in it |
| `g4l` | Resumes at `wash5` (the soup is left; the next dishes start) |
| `g1` | Gas entrance |
| Anything else in a chapter | The latest real section of that visit, not the gas entrance |

`g4k` restarts the cooking visit in the kitchen. `g4l` (the soup already left in the crate) resumes at `wash5`, the next dishes, because Mops had nothing left to do there (Phase 1, T7). Neither dumps to the gas entrance. A phase that is not in the table restarts the latest real section, not Chapter 1. Chapters 1, 3 and 4 use their checkpoint tables (see Capture); a scene with no entry restarts the visit that was saved when that scene started. The hold is the Reset section button (or R), about three quarters of a second, under one second. Releasing it and pressing again arms it once more. Dialogue is cancelled and the same restart runs. The jar, the register, the coins in hand, and the star total are copied out and put back. Finds are not granted again. Shipped in PR #5 at `17a03c2`. The independent pass drove wash 5, wash 1, `g1`, and unknown `g5`.

## Kitchen composition

Composition C at commit `6853902` passed its visual review for that drawing only. There is no open layout review. Later work does not redraw the kitchen. That drawing is on `main` as squash `9999f0cd`. The site is not confirmed live.

One floor line. The diner door is full height and shares that line with the counter. Washing is the left bay, the pass window is the middle bay (300 wide), and the range is the right bay. The oven door, four burners, and knobs are in the counter, not a cabinet standing in the aisle. Three jars sit on a rack on the counter, past the burners.

Hotspots, radii unchanged:

| Action | Where |
| --- | --- |
| Scrub / mop | Sink `KV` (480, 430), radius 80 / 90 |
| Grab a ticket | Pass floor (660, 430), radius 80 |
| Cook | Range `Hn` (800, 430), within 110 of (800, 500) |
| Front door | (53, 500), radius 100 |
| Open the spice rack | `la` (912, 430), radius 80 |
| Leave soup | Crate hotspot x stays 180. The drawn chip is beside the door |
| Window cone | Still from (690, 220), angle 1.95, length 520 |

Ticket ink stays about 20 canvas pixels, which is about 8 screen pixels on a 390-wide phone.
