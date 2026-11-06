# Spec notes

The playable rules are the game and the root `README.md`. Those are newer than the archived notes in this folder. When a change lands, update the root README in the same pull request and name the branch. Do not mark an archived note as shipped, and do not revert the game to match an archive.

## Archived anchors

- `docs/MASTER-BACKLOG.md` is an archived registry shell. The approved attachment body was not in the workspace, so this file does not copy that registry and does not say the backlog is done.
- `docs/original-story-spine.md` is an archived story anchor with the same limit. Later kitchen, security, and price work stays in the game.

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
