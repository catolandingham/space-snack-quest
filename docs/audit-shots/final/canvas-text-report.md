# Canvas text report

Checked at the iPad sizes from `tests/screen-fit.mjs` (upright 820×1180, sideways 1180×820). Minimum type is 14 CSS px. On the upright iPad the picture is about 84% of 960, so 17px on the canvas is about 14.2 CSS px. Contrast minimum is 3:1. Words were not changed.

Before and after shots are in this folder: `before-home.png`, `after-home.png`, and the same for `photos`, `party`, `office`, and `tape`.

## PASSED

These were the failures Brian named. They now clear 14 CSS px at both iPad sizes. REC also clears 3:1.

| Text | What changed |
| --- | --- |
| Rule #1 | 17px. The gift card drawn in code is larger, so the words sit inside it. |
| Brave Sasquatches stay hidden. | 17px, wrapped onto two lines inside that same larger card. |
| ME and MOPS | 17px. A larger label plate is drawn in code over the photo. The locked hallway picture was not changed. |
| Isfred Bar Neshuman | The speaker-name chip is 17px and a little wider. The desk plate in the locked office picture was not the small text, and it was not redrawn. |
| REC | 17px, white, on a dark red plate drawn in code over the tape screen. White on that plate is brighter than the old red and clears 3:1 (it is about 4.5:1 or better). The monitor glass is light gray, so a brighter red on the glass itself would have been harder to read. |
| ROBOTICS DELEGATION! | 17px. The blue banner drawn in code is wider so the words stay inside it. |
| COMING SOON! | 17px. The poster drawn in code is larger so the words stay inside it. |

No locked room PNG was edited. `tests/locked-rooms.mjs` still checks those pictures.

## FAILED

New screens, not fixed. Brian decides.

| Screen | Text | Where | Why |
| --- | --- | --- | --- |
| song | Mops | both iPad sizes | name chip contrast 2.24:1 on the pink song bubble |
| dress-up | top hat, sunglasses, shirt, boots, scarf, bow tie, button nose, pipe | iPad upright | 11.7 CSS px |
| dress-up | those same eight labels | iPad sideways | 13.5 CSS px |

Opening cards, the dance, karaoke, the snack cut-in, the lockup card, and the tally did not add a size, contrast, or overlap failure.

## NOT ASSESSED

- Floating song notes (♪ and ♫). They move, so the color behind them changes. Measured contrast was about 1.22:1 to 2.50:1. That is not a fixed check.
- DOM labels (the goal chip and the faces) are not canvas text.

## GUESSED

CSS px is the canvas font size times the canvas CSS width divided by 960. Contrast is one pixel behind the letters. Wrapping "Brave Sasquatches stay hidden." onto two lines keeps the same words.

Not yet played by a person
