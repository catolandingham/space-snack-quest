<!-- section-index -->
**Section index.** Read this index, then only the section you need. Do not read this file whole.

| Lines | Heading |
| --- | --- |
| 12–17 | # Refactor plan |
| 18–37 | ## The numbers |
| 38–51 | ## Steps |
| 52–63 | ## Open pull requests |
| 64–69 | ## Needs a decision from Brian |
<!-- /section-index -->
# Refactor plan

How to split the game into real modules without changing how it plays. The map is `docs/DEPMAP.md` (and `docs/depmap.json`). Regenerate both with `npm run depmap`. Do not edit the map by hand.

Nothing in this plan is permission to change words, pictures, timing, or balance. `docs/TUNING-PINS.json` stays as it is. Room art stays the locked pictures.

## The numbers

The build joins 16 files into one function, `s8`, which starts at line 71 of `src/game/00-core.js`. The lines above that are small helpers outside the function. The React runtime wraps the function. It is not the shared scope.

- **1,060** names are declared in the fragments.
- **548** of those are used by more than one file. These are the shared names. Three more names (`_n`, `ed`, `ro`) are declared in the React runtime and used by more than one fragment. They stay in the runtime.
- **12** globals (`Math`, `window`, and the like) are also used by more than one file. The game does not declare them. **26** globals appear in total.
- **512** names are touched by only one file (**367** functions and **145** variables). Those are the easy moves.
- **724** cross-file calls (**4,473** call sites).
- **10** load-order links. All of them point at `90-input-shell.js`, which reads names while the game is still starting. No name is used at start-up before it exists.
- `n` (the story state) is used by all **16** files.
- `e` (the drawing surface) is used by **15** files. `25-capture.js` does not touch it.
- `B` (the hall and chapter state) is created in `11-ch1-hall.js` and used by **12** files, including `00-core.js`, which is earlier in the join.
- `ch2` is created in `20-ch2.js` and used by **9** files.
- `p` (the prompt) is created in `00-core.js` and used by **8** files.

The most tangled file is `60-frame-draw.js` (the frame update and the main draw): 184 names it does not define, 143 calls out, 73 calls in. Next is `90-input-shell.js` (230 names it does not define). The quietest is `80-hud.js`.

A function written in an early file can mention a name that a later file creates (`B` is the clear case). That works today because the function does not run until after the later line. A split that copies values at the top of the file would break it. The shared names have to stay one object the whole game can see.

## Steps

Each step is its own pull request, stacked on the one before it. Do not merge any of them without Brian's yes. After each step: `npm test`, `npm run check-build`, and `node tools/equivalence.mjs main`. For any step that changes the built game, also compare phone-sized screenshots of Chapter 1 and Chapter 2 with the build before the step. Stop when those do not match.

1. **The map.** This pull request. The game program is unchanged. `tests/depmap.mjs` fails if the map drifts.

2. **Modules that still run in this order.** Keep the fragment files as the source of the game. Change only the build, so it bundles them as modules instead of pasting strings, and they still run inside one function in this same order. Do not hand-edit chapter code in that pull request. Open pull requests 33, 35, 38, and 60 already edit the fragments and `index.html`. A build-only change rebases more easily, but `index.html` will still conflict if the bundle bytes change. Proof is the three commands above, plus the screenshots. If the screenshots differ, stop.

3. **Move the easy functions.** Move functions that only one file touches, starting with drawing helpers, math, and sound in `00-core.js`. One small group per pull request. Leave every `let` and `const` where it is until step 4. Function declarations can move inside `s8` without changing play, because the joined function sees them all before it runs. Do not reorder the statements that are not function declarations.

4. **One state object.** Put the shared names (`n`, `ch2`, `B`, `p`, `e`, and the rest of the 548) on one object the modules import. Parameters of `s8` stay parameters. Leave the React runtime's own names where they are. Do this in the build with Babel's scope rules, the same idea as `npm run rename`, so a local that happens to be named `e` is not touched. Then the fragment files can become real imports. `B` must be the same object for a function in `00-core.js` and the line that creates it in `11-ch1-hall.js`.

5. **One chapter at a time, data files.** After step 4, move a chapter's lines, spots, and scene order into data. Chapter 1 first, and only the parts the map shows are not used by later chapters. New or changed words need Brian's yes. This step is not behavior-only if any line changes. Do not start it under the "no change in play" rule.

## Open pull requests

These are open and touch the same ground. Do not merge this work over them.

- **#33** adds `src/game/01-music.js` and edits `00-core.js`, `12-ch1-redesign.js`, `13-ch1-slice.js`, `14-ch1-day1.js`, `20-ch2.js`, `60-frame-draw.js`, `90-input-shell.js`, and `index.html`. After a rebase, run `npm run depmap` again. The new file will appear in the map.
- **#35** edits `20-ch2.js`, `60-frame-draw.js`, and `index.html`.
- **#38** edits `14-ch1-day1.js`, `25-capture.js`, and `index.html`.
- **#60** edits the Chapter 1 fragments, `25-capture.js`, `60-frame-draw.js`, and `index.html`.
- **#34** edits `README.md`, the backlog, and a few tests. It does not change the game function.

`README.md` and `docs/MASTER-BACKLOG.md` will conflict with all of these. The game files will not conflict with this pull request, because this pull request does not edit them.

## Needs a decision from Brian

- Whether to start step 2 while pull requests 33, 35, 38, and 60 are still open. The safe choice is to wait, then rebase the map and do step 2 on the result.
- Step 5 changes where lines live. Any new wording still needs his yes. This plan does not ask for new wording.
- No change to locked pictures, tuning pins, or the capture rule.
