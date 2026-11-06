# Master backlog

Precedence: the original story stays canon except the Chapter 2 kitchen sequence.

- Kitchen revision, and only that revision: `docs/story-bible.md`
- Choices still waiting on Brian, outside that kitchen: `docs/STORY-DECISIONS.md`
- Previous on-repo story note, not deleted: `docs/spine-archive.md`

A pending item stays pending until Brian decides that item. This page does not mark the rest of the backlog done. The full original attachment was not in the workspace, so it is not listed as shipped and it is not replaced.

What the game already plays is the root `README.md` and the build. Where that and an older story idea disagree outside the kitchen, the disagreement is a hold in `docs/STORY-DECISIONS.md`, not a change to the game.

QA note `df55e0c` reviewed build `d4e3714` (that note is not a commit). It found the phone tickets, the rail, Gloop's arm, and several labels failing even though the suites passed. That layout stayed partial.

Composition C, commit `6853902` only, is **passed**. That pass is the kitchen drawing scoped to that commit: one floor, full-height diner door, sink left, pass in the middle, range on the right, spice rack on the counter. No further layout review is open. Do not redraw the kitchen as part of a later reliability fix.

P0 reliability is the checkpoint table in `docs/README.md`. Reset uses the capture restart, keeps the jar and the stars, and does not send an unknown section to Chapter 1.
