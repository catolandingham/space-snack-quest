# Spec notes

Story precedence: the original story stays, except the Chapter 2 kitchen sequence in `docs/story-bible.md`.

Open conflicts outside that kitchen are in `docs/STORY-DECISIONS.md`. Each one stays pending until Brian decides that item. The previous on-repo story note is in `docs/spine-archive.md`.

What is playable is the game and the root `README.md`. A story note does not add a mechanic. When a change lands, update the root README in the same pull request and name the branch.

## Section reset

Hold **Reset section** (the button, or the R key) for about three quarters of a second. It calls the same Chapter 2 restart capture uses. It clears the current chase and the unspoken queue, and it does not pay coins, change the register, or grant points.

Mapped checkpoints in the build. The rows the independent pass drove are listed in `docs/MASTER-BACKLOG.md`.

| Phase before reset | Lands on |
| --- | --- |
| `back`, `g1door` | Gas back crate, still hidden |
| `g6`, `g6d` | Gas `G6` at the door |
| `g3`, `g3hide`, `g3h` | The dock hide, timer 5.5 |
| `wash1` | Kitchen sink |
| `wash5` | Kitchen, by the crate |
| `g4` | Diner counter, Mops |
| `g2` | Diner, at the counter |
| `g4k`, `g4l` | Kitchen cooking visit, Mops by the crate |
| `g1` | Gas entrance |
| Anything else in a chapter | The latest real section of that visit, not the gas entrance |

`g4k` and `g4l` restart the cooking visit in the kitchen. They do not dump to the gas entrance. A phase that is not in the table restarts the latest real section, not Chapter 1. Chapter 1 scenes restart the visit that was saved when that scene started. Zip and Harry keep their own capture. The hold is the Reset section button (or R), about three quarters of a second, under one second. Releasing it and pressing again arms it once more. Dialogue is cancelled and the same restart runs. The jar, the register, the coins in hand, and the star total are copied out and put back. Finds are not granted again. Shipped in PR #5 at `17a03c2`. The independent pass drove wash 5, wash 1, `g1`, and unknown `g5`.

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
