# Docs

Every agent reads [`CLAUDE.md`](../CLAUDE.md) first. It holds the short rules, how to build and test, and how to open a scene.

If two docs disagree, [`DECISIONS.md`](DECISIONS.md) wins. Where the build stands is [`STATE.md`](STATE.md). What is playable is the game and the root `README.md`. A story note does not add a mechanic.

## Source of truth

| Doc | What it is |
| --- | --- |
| [`DECISIONS.md`](DECISIONS.md) | Every decision. This file wins |
| [`STATE.md`](STATE.md) | Where things stand, through R63, updated after the Chapter 1 redesign and the party landed on `main` |
| [`OPEN-ASKS.md`](OPEN-ASKS.md) | Every open ask. The codes point into `DECISIONS.md` |
| [`HANDOVER-FOR-GROK-2026-11-08.md`](HANDOVER-FOR-GROK-2026-11-08.md) | The 2026-11-08 handover: how the project was handed to the Squatch Game bot, and where Brian's comments landed. Newer facts are in `STATE.md` and `DECISIONS.md` |
| [`CH1-LINES-FOR-BRIAN.md`](CH1-LINES-FOR-BRIAN.md) | Words in the redesigned Chapter 1 that a new game plays. Tests read this file. Pull request #25 is editing it, so this cleanup does not |
| [`CH1-CARTOON-LINES.md`](CH1-CARTOON-LINES.md) | The full Chapter 1 cartoon, in story order, through R63. `STATE.md` calls this the words file. It includes lines that are not in the game yet. Each of those is marked NEEDS BRIAN |
| [`STYLE-GUIDE.md`](STYLE-GUIDE.md) | Look rules for sketches and the Chapter 1 build |
| [`story-bible.md`](story-bible.md) | The Chapter 2 kitchen sequence. It does not rewrite the other chapters |
| [`REVIEW-RULES.md`](REVIEW-RULES.md) | Brian's full review checklist |
| [`MASTER-BACKLOG.md`](MASTER-BACKLOG.md) | Status of every backlog item. Points at `DECISIONS.md` |
| [`../README.md`](../README.md) | What a player meets, and how to build |

## Other working notes

| Doc | What it is |
| --- | --- |
| [`STORY-DECISIONS.md`](STORY-DECISIONS.md) | The older eight story questions. Answered items are not shown as pending |
| [`original-story-spine.md`](original-story-spine.md) | Brian's Nov 2 story spine. It is not binding (W27 in `DECISIONS.md`) |
| [`DESIGN-CHECKLISTS.md`](DESIGN-CHECKLISTS.md) | Checklists for scenes and prompts |
| [`PHASE-1-LINES-FOR-BRIAN.md`](PHASE-1-LINES-FOR-BRIAN.md), [`PHASE-2-LINES-FOR-BRIAN.md`](PHASE-2-LINES-FOR-BRIAN.md), [`PHASE-3-LINES-FOR-BRIAN.md`](PHASE-3-LINES-FOR-BRIAN.md) | Line tables from those merged phases. Tests read them at these paths. They are not a second copy of the Chapter 1 cartoon |
| [`LATER-CHAPTERS-LINES-FOR-BRIAN.md`](LATER-CHAPTERS-LINES-FOR-BRIAN.md) | One Chapter 2 line that was cut |
| [`LATER-CHAPTERS-IMPROVEMENTS.md`](LATER-CHAPTERS-IMPROVEMENTS.md) | Proposals for Chapters 2 to 4. A proposal that `DECISIONS.md` has replaced is marked there |
| [`playtests/`](playtests/) | Transcribed playtest recordings |
| [`grok-archive/`](grok-archive/) | Squatch and G Bot threads. Ostrich-only files were removed. See that folder's README |

The sections below (capture, section reset, kitchen composition) are working notes for those systems. `DECISIONS.md` wins if they disagree.

## History

Marked here, or moved to [`history/`](history/). Not deleted.

| Doc | Where it stands |
| --- | --- |
| [`history/STATE-2026-11-08.md`](history/STATE-2026-11-08.md) | Superseded state snapshot. Pointer: [`project/STATE-2026-11-08.md`](project/STATE-2026-11-08.md) |
| [`history/DECISIONS-2026-11-08.md`](history/DECISIONS-2026-11-08.md) | Superseded decisions snapshot. Pointer: [`project/DECISIONS-2026-11-08.md`](project/DECISIONS-2026-11-08.md) |
| [`CHAPTER-1-LINES-FOR-BRIAN.md`](CHAPTER-1-LINES-FOR-BRIAN.md) | History of the Chapter 1 pass (PR #11), the night-out scenes. Left at this path because the tests read it here |
| [`spine-archive.md`](spine-archive.md) | The previous on-repo story note. Left here because `MASTER-BACKLOG.md` names this path |
| [`PLAN-2026-11-06.md`](PLAN-2026-11-06.md) | The 2026-11-06 plan (tasks T1 to T28). The phases it names are merged. Left here because later docs link this path |
| [`CODE-REVIEW-2026-11-06.md`](CODE-REVIEW-2026-11-06.md) | Code review from before the readable `src/` copy. Left here because the plan and the Hermes job cite it |
| [`HERMES-GO.md`](HERMES-GO.md) | The finished Hermes job. The report is [`FEEDBACK-CODE-CHECK.md`](FEEDBACK-CODE-CHECK.md) |
| [`CHIP-ARMATURE-AUDIT.md`](CHIP-ARMATURE-AUDIT.md) | Chip audit against the spine, on the phase-2 branch |

## Left in place on purpose

No two markdown files in this repo have the same checksum, so nothing was deleted as a duplicate.

These were not deleted, because it is not clear they are safe to drop:

- `CH1-LINES-FOR-BRIAN.md` and `CH1-CARTOON-LINES.md` both describe Chapter 1 words. They are not copies. One is the redesign that is in the game. The other is the full cartoon, including lines still marked NEEDS BRIAN. `STATE.md` points at the cartoon file. The root README points at the in-game file.
- `gbot-thread.md` mentions Battle Ostriches and Space Snack Quest in one thread. See [`grok-archive/README.md`](grok-archive/README.md).
- `HANDOVER-FOR-GROK-2026-11-08.md` still says the Drive copies were the live ones, and that `grok-archive/` held every thread. That was true on the day it was written. It was not rewritten.
- `original-story-spine.md` calls itself the single source of truth. W27 in `DECISIONS.md` says the Nov 2 spine is not binding.
- `CHIP-ARMATURE-AUDIT.md` may be stale next to the Chapter 1 redesign. It was not checked line by line against the current game in this cleanup.

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

Composition C at commit `6853902` passed its visual review for that drawing only. There is no open layout review for that drawing (R28). Later work does not redraw the kitchen. That drawing landed on `main` as squash `9999f0cd`. "The site is not confirmed live" is **Superseded**: Render publishes `main`, and current `main` is `10030f6`.

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
