# Spec notes

Story precedence: the original story stays, except the Chapter 2 kitchen sequence in `docs/story-bible.md`.

Open conflicts outside that kitchen are in `docs/STORY-DECISIONS.md`. Each one stays pending until Brian decides that item. The previous on-repo story note is in `docs/spine-archive.md`.

What is playable is the game and the root `README.md`. A story note does not add a mechanic. When a change lands, update the root README in the same pull request and name the branch.

## Section reset

Hold **Reset section** (the button, or the R key) for about three quarters of a second. It calls the same Chapter 2 restart capture uses. It clears the current chase and the unspoken queue, and it does not pay coins, change the register, or grant points.

Mapped checkpoints, checked against that restart:

| Phase before reset | Lands on |
| --- | --- |
| `back`, `g1door` | Gas back crate, still hidden |
| `g6`, `g6d` | Gas `G6` at the door |
| `g3hide`, `g3h` | The dock hide, timer 5.5 |
| `wash1` | Kitchen sink |
| `wash5` | Kitchen, by the crate |
| `g4` | Diner counter, Mops |
| `g1` and anything else in Chapter 2, including `g4k` | Gas entrance |

`g4k` using the gas entrance is the existing capture fallback. It is not confirmed as the cooking visit's own checkpoint. Chapters other than Chapter 2 are not mapped, and the control does nothing there.

## Kitchen composition

Composition C is the current kitchen drawing. It is pending independent visual QA. The picture is not the sign-off.

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
