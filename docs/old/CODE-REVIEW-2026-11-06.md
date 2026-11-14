# Code review, Space Snack Quest, 2026-11-06

Reviewer: Agent B (Claude), reading the repo at `main` = `15051ec`. Nothing was committed. Two kinds of claims appear below. **[ran]** means I executed something on this Mac and saw the result. **[read]** means I read the code and believe it; I did not play that path.

**How to find the line numbers in this review.** `index.html` is one file of 12 real lines; line 12 is 414,456 characters long and holds the whole program, minified (squeezed onto one line with short variable names). Line numbers in `index.html` are useless. Every line number below refers to a pretty-printed copy made with this command from the repo root (prettier 3.9.10, Node 26):

```
python3 -c "import re;s=open('index.html').read();open('bundle.js','w').write(re.findall(r'<script>(.*?)</script>',s,re.S)[-1])"
npx prettier@3 --print-width 140 bundle.js > pretty.js
```

That gives a 26,918-line `pretty.js`. "L19062" means line 19062 of that file. Keep `bundle.js` and `pretty.js` out of git.

## Summary

The game runs, all four test suites pass on this Mac, and most of what the backlog calls shipped really is in the code (23 of 36 items implemented as described, 6 partial, 1 not found, 6 can't tell). The code itself is in a risky state. The five biggest problems:

1. **The source code is not in the repo.** `index.html` is build output (React runtime plus the game, minified). Commit `8b96f84` says "built from live 6b464e6 source", so a source folder exists somewhere outside git. Since PR #1 every fix has been hand-typed into the minified line (the reset code at L19062-L19339 has readable names; everything around it has names like `k`, `n`, `qSec`). The next rebuild from the real source would silently drop all five PRs. [read, git history]
2. **A whole second, dead game is still inside the file.** About 2,300 lines (L12152-L14406, L15283-L15587) are an older engine with its own four levels, keypad, dish mini-game, click-to-walk and guard AI. Nothing on the title screen can reach it (L26150-L26154 always start the story engine). The on-screen help still describes its controls (Shift to run, Tab to switch, Q to sing, hold E for opera), none of which do anything in the real game. [read, verified by grep]
3. **Interaction range, highlight ring and caption are three unrelated numbers in three places.** 93 of the 129 action hotspots have `r: 0`, so the shared distance check (L15890-L15893) is skipped and the real range is a hand-typed `hV(..., 80)` inside each scene (L19528-L19776 for Chapter 2). The glowing rings are drawn with their own hand-typed boxes (about 45 sites, L16417-L25999). One ring ("rail", the ticket rail in the kitchen) is added to the pulse set but never drawn at all. [read]
4. **Two capture rules live in the same chapter.** Rusty, the pump bots, the counter and the kitchen window send you to LOCKUP and restart the section with your coins (L19349-L19061). The dock bots, the lure, the kitchen bots and every Chapter 1 catch instead take 100 stars and put you back a few steps with no card (`Pn`, L18991-L19012). A player cannot learn one rule. [read; LOCKUP path also ran in tests]
5. **On a phone the canvas is 359 by 239 CSS pixels and all in-game text shrinks with it.** Prompt captions drawn at 14 units become about 5 pixels tall; "TANK EMPTY", "KITCHEN", "FUEL", "COINS ONLY" were barely legible in my 375-px screenshot, and 190 px of blank space sits above the game. [ran, headless Chrome at 375x812]

Also worth knowing: there is no save inside a chapter (only the unlocked-chapter number and the best score are stored, L12060-L12070, L22534-L22538); the backlog still says PR #5 is open when `main` already contains it; and `tests/reliability.mjs` crashes at the end on any machine that is not a Cursor cloud box because it writes screenshots to `/opt/cursor/artifacts/` (lines 191-192 of that file).

## 1. Architecture of index.html

### Layout of the pretty-printed file [read]

| Lines | What it is |
| --- | --- |
| L1-L11640 | React 18 runtime (scheduler, react, react-dom). Not game code. |
| L11641-L11708 | Small helpers: `Eb` (theme object), `wb` (is this a touch device), `Nb` (is landscape), `Rb` (short screen side). |
| L11709-L26435 | **The whole game engine**, one function `s8(canvas, options)`. 14,700 lines, 457 inner functions, hundreds of shared variables. It returns the object the React shell calls (`actionDown`, `tapAt`, `setJoy`, `resetHold`, ...) and sets `window.__ss` for tests (L26312-L26420). |
| L26436-L26509 | `q8`: the touch joystick (React). |
| L26510-L26571 | `r8`: the round ACTION button (React). Its label comes from the engine through `onVerb`. Green when there is an action, blue when not; pulses when the label starts with `!`. |
| L26573-L26880 | `k1`: the page shell (canvas, keypad grid, choice buttons, three copies of the Reset section button, the keyboard help line). |
| L26881-L26888 | Mounts `k1` into `#root`. |

### Two engines, one dead [read]

`p.state` (L12071-L12117) is the top-level mode. The live game uses only `"title"` and `"op"` (the story engine). Eleven other values (`play`, `scene`, `keypad`, `choice`, `dish`, `hug`, `read`, `overlay`, `chapterWin`, `party`, `card`/`fb` in the old sense) belong to an older engine:

- Level definitions with their own titles: "Stormtop Station" L12492, "Asteroid Belt Gas Stop" L13237, "Phobos, the Tiny Moon" L13490, "Mars!" L13722.
- Its entry `X1` (L13854) is called only at L14205, when `p.state === "chapterWin"`, which only the old engine sets (L13976). The title screen (`I0`, L26150-L26154) always calls `qh()` (story opening) then one of `Ws`/`aq`/`nq` (Chapter 2/3/4 story scenes).
- Its features: click-to-walk `fn`/`findPath` L12304 (used only at L12218, L12762, L14060, L14265, all old engine), keypad L14155, "SPARKLY! +6 coins" dish mini-game L14130-L14153, hug mash L14118-L14129, guard AI L14211-L14406, old draw L15283-L15587.
- `tf` (Tab, switch to Mops, L14114) and `st` (Q, sing, L12200) only act when `p.state === "play"`. There is no Shift, KeyQ or Tab handling anywhere in the story-engine range L15600-L26150 (grep found none).

So the old engine is unreachable, but it is still exported on `window.__ss` (`startChapter`, `getPlayer`, `getGuards`, `findPath`, `getKeypadCode`), still drawn into the help text (L26756), and still adds ~2,300 lines an agent must read around.

### Story engine state [read]

- `p` L12071: top-level mode, `verb` (the action label), `hold`, `cam`.
- `n` L15687-L15790: the story state. `scene` (47 string values, e.g. `S1`, `O4`, `G2k`, `P3`, `M5`), `room` (closet, hall, lobby, deck, window, duct, hangar, gas, diner, kitchen, pad, temple, port, stand, van, inside), `sq` and `mo` (Squatch and Mops position/facing), `sqPose` (sit, stand, hidden, ball, under, sing), `ctrl` (player has control), `q`/`cur` (dialogue queue), `act` (the one current action), `chip` (objective text), `pulse` (set of ring ids), `stars`, `found`, `live` (auto-expiring one-liners).
- `x` L17817: Chapter 1 flags (`mops` = Mops is the controlled character, `spot` = which hiding spot, `sing`).
- `B` L17213: the hall camera (`camX`).
- `k` L18884-L18915: Chapter 2 (`phase`, `jar`, `reg`, `has`, `sec` = the security chaser, `bots`, `timer`, `peek`, `warn`, `cook`, `resetHold`, `check`). `SA` L18916-L18948 is a copy of the same literal used to reset it.
- `Q` L20967: Chapter 3. `H` L21926: Chapter 4 (`best`).

There is no scene table. A scene is a function that sets `n.scene`, `n.room`, positions, and pushes a list onto the dialogue queue. Transitions are function calls inside queue callbacks (`N(t2)` at L20013 moves G3 to G4).

### Scene functions by chapter [read]

Chapter 1 (S and O scenes): opening `qh` L16036, O4 lobby `ch` L16301, O5 closet `Gs` L16454, O7 `ph` L16612, S1 `Ah` L16704, S1L `Mh` L16916, S2 `Oh` L17250, S3 `Rh` L17434, S4 `Uh` L17589, S5 `Dh` L17712, S6 `Gh` L17916, S8 `js` L18183, S9 `Ph` L18266, S10 `Ih` L18517, S11 `Kh` L18641, S12 `Xh` L18744, tally `jh` L18825.

Chapter 2 (G): G0 `Ws` L19777, G2 `Wh` L19822, G3 `e2` L19981, G4 `t2` L20015, G5 `a2` L20078, G6 `n2` L20104, leave `l2` L20119, tally `o2` L20183. Per-frame logic: Rusty `MA` about L19340, pump bots and kitchen bots `EA` about L19379, kitchen wash/cook/peek `wA` L19443-L19512, dispatcher `NA` L19512-L19526, hotspot picker `RA` L19528-L19776.

Chapter 3 (P): P0 `aq` L21305, P3 `s2` L21376, P4 `q2` L21444, tally `r2` L21538, hotspots about L21140-L21301.

Chapter 4 (M): M0 `nq` L22217, M2 `b2` L22256, M3 `p2` L22327, M4 `A2` L22362, M5 `g2` L22441, tally `x2` L22541, final score and best L22523-L22538, hotspots about L22065-L22214.

### Frame loop and timing [read]

`W2` L26297-L26311: each animation frame, the real elapsed time is capped at 0.25 s and cut into 0.05 s steps; each step calls `ep` (L14407) which, in `"op"` mode, calls `y5` (L24176-L24323), then one draw `Ap` (L15587). This is the "fixed-step" fix from `01c0ec1`. It keeps game time honest on slow devices; it does not give a slow player more time (see section 4).

### Input [read]

- Keyboard `j2` L26155-L26204: Escape = skip flashback, M and minus/equals = volume, 1-4 on the title = chapter, R = arm reset (not on key repeat), E = action, Enter/Space = advance, arrows/WASD read later by `oh` L15897-L15903. Keyup `_2` L26205; window blur `F2` L26208 drops all keys and the reset hold. A second, separate keydown listener for the gallery panel sits at L17324.
- Mouse and touch on the canvas: `tapAt` `O5` L26233-L26296. In story mode a tap anywhere is `nf()` (L15880-L15888): if a bubble is up, advance it (ignored if the bubble is under 0.3 s old); otherwise fire the one current action. Top-right 64 px square = volume; top-right skip box during flashbacks. **There is no tap-to-walk in the story engine.** Movement is only arrows/WASD or the joystick.
- Touch shell: joystick `q8` L26436 (push distance is ignored beyond normalizing; "push far to run" in its aria-label is not implemented, speed is a constant 190 or 230 at L24288), ACTION button `r8` L26510 (pointerdown = `actionDown`), Reset section button in three copies (portrait touch L26713-L26740, desktop L26760-L26780, landscape touch L26820-L26845), each wiring `resetHold(true/false)`.
- A 250 ms interval refocuses the canvas whenever focus falls to the body (L26657-L26668), so "Click the game first so it hears your keys" (L26756) is mostly moot.
- Audio unlock on the first touchend/click/pointerup/keydown (`J2` L26213-L26214, `VV` L11754).

### Dialogue and bubbles [read]

The queue `n.q` holds items `{k: "bub"|"card"|"panel"|"fb"|"do"|"wait"|"until"}`. `J` appends (L15795), `TV` interrupts (L15798), `kV` pushes a live one-liner that auto-expires after 1.4 s + 0.035 s per character (L15802), `Dt` logs (L15805), `de()` says "something blocking is on screen" (L15808), `gp` starts an item (L15811-L15834), `lh` pumps the queue up to 60 items per frame (L15835-L15859). Bubbles never auto-advance: every one of the 274 `v("...")` lines needs a tap or E. The action label becomes `NEXT`, then `!NEXT` (pulsing) after 3 s on one bubble (L24232). Skip (`N0`/`Cs` L15864-L15879) works only while a flashback (`fb`) is queued.

### Prompts (the HIDE / ACTION / BUY pill) [read]

The engine holds exactly one candidate action at a time, `n.act = {verb, cap, x, y, r, hot, f}`. Each scene's update code picks it every frame (Chapter 1 via `Bp`/`Hp`/`Zp`/`$p`/`tA` at L24302-L24306, Chapter 2 via `RA` at L19526, later chapters in their own updates). `Bs()` L15890-L15893 then returns it if the player is within `r`. The label reaches the React button through `t.onVerb` (L24321-L24322) and is drawn as `verb · cap` above the hotspot by `drawCap` L19197-L19203, but only 7 of 129 hotspots have a `cap` (diner door, ship x2, kitchen, the lot, diner, and one more). Full extraction of hotspots: 129 objects with `verb:`; 93 with `r: 0`; 36 with a real radius, and all of those 36 are in the dead old engine (L12831-L13938) except O5's bed (`r: 120`, L16471) and three in O7 (`r: 95`, L16235-L16283).

### Vision cones and security [read, LOCKUP also ran]

- `vt` L18951-L18960: is the point inside a wedge (origin, angle, half-angle, length) and in line of sight. `_h` L18961-L18974 samples 16 points along the ray against `ih()` solids (L15928-L15965), extending each solid 90 px up and, in the gas lot, 72 px down (the "pump cover" fix).
- Cones: Rusty `Jh` (280 long, ±0.85 rad, from y=400), pump bots `Zh` (230, ±0.6), kitchen window (520, ±0.75, L19463), lobby cones `hh` L16324-L16330, civilian NPCs `pf` L20253-L20285 (165 long, 300 for security types).
- Security: `sSec` spawns a chaser at x=980 (L19345-L19347). `qSec` L19349-L19061: if Squatch is `hidden` (or a `ball`, kitchen only) the chaser backs off for 1.6 s and leaves; otherwise it runs at 170 px/s and at 48 px shows the LOCKUP card with lines chosen by `n.jailBy` (pump, diner, sink, rust), then `reSec`.
- Chapter 1 style catches: `Pn` L18991-L19012 freezes control, plays lines, takes 100 stars, repositions. Lobby guard `Rp` L16402-L16414 ("Gotcha!", 3 s grace). Lobby guard speeds 150 and 320 px/s (L16427) against Squatch's 190.
- Timers: closet O5 9 s before the bot enters (L24263, `Up`), dock hide 5.5 s (`V2` L19972-L19980, drawn as "HIDE! 6" at L20794), kitchen window warn 1.5/1.1 s then peek 2.2 s then 0.9 s "eye" (L19493-L19511), pump-bot daze 6.5 s (L19396), door bot 8 s (L18330).

### Checkpoints, Reset section, save [read, reset also ran]

- `noteSection` L19109-L19138 runs every frame (L24181) and snapshots scene, room, phase, both positions, poses, camera, timers into `k.check` once per scene+phase.
- `restoreCheck` L19139-L19162, `clearRun` L19163-L19196 (drops the queue, the chaser, Rusty's state, all kitchen timers).
- `applyG` L19204-L19318 is the hand-written table for 14 Chapter 2 phases (matches `docs/README.md`). `reSec` L19320-L19339: Chapter 1 and 3/4 scenes restore `k.check`; G scenes use `applyG`, else `k.check`.
- `sectionReset` L19062-L19077 copies jar, register, held item, stars and finds out, runs `reSec`, copies them back. Hold logic: `armReset` L19078, timer at L24177-L24180 (0.75 s, one-shot via `fired`), bar `drawReset` L19081-L19090 at canvas (690,598).
- Persistent storage: `ssq-unlocked` (L12060-L12070, set at each chapter start L19778, L21306, L22219 and at the end), `ssq-best` (L22534-L22538), `ssq-vol`. Nothing inside a chapter is saved; a reload starts the chapter over.

### Rendering, sprites, audio [read]

Everything is drawn with canvas primitives (`m` rect L14502, `r` fill/stroke L14518, `g` text L14533, circles, paths). No image or audio files. Rooms are drawn in big per-room blocks roughly L20400-L26149 (gas L20400-L20600, diner L20500-L20600, kitchen L20700-L20800, Phobos L21600-L21850, Mars L22580-L22760, hall L23000-L23300, closet L24700-L24800, lobby L24985-L25100). Rings `oV` L24588. Sound is synthesized with Web Audio (`D` L11807-L11940: grab, pickup, alarm, slip, caught, bzzt, key, open, baa, hide, snore, splash, zap; songs `co` L12046; resume on visibility `Ve` L11768).

### Duplicated logic and what makes the file hard to change safely [read]

- Two engines (above).
- The Reset button JSX three times (L26713, L26760, L26820).
- The Chapter 2 state literal twice (L18884 and L18916).
- About 90 inline `hV(..., radius)` distance checks and about 45 ring draw sites with their own box sizes that have to agree with each other by hand.
- Room walk bounds (`sn` L15905-L15926), solids (`ih` L15928-L15965), and the drawing code are three separate lists of hard-coded numbers for each room.
- Scene flow lives in nested callbacks (`N(() => ...)`) inside queue lists, so "what happens after X" is found only by reading.
- The help line (L26756) and the aria-label "push far to run" (L26485) describe controls that are not there.

## 2. The test suites

How they run [ran]: each suite serves `index.html` on a local port, launches headless Chrome through `puppeteer-core`, waits for `window.__ss`, and drives the engine directly. They need `puppeteer-core` (not in the repo; there is no `package.json`) and a Chrome binary. The README's default path `/usr/bin/google-chrome` is Linux-only; on a Mac you must set `CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`. I installed `puppeteer-core` in a scratch folder outside the repo and copied the tests and `index.html` there; nothing was installed globally and nothing was added to the repo.

Results on this Mac (Node 26.7, Chrome from /Applications) [ran]:

| Suite | Checks | Result |
| --- | --- | --- |
| `tests/progression.mjs` | 10 | all PASS, "all progression gates passed" |
| `tests/gas-stop.mjs` | 16 | all PASS, "gas-stop checks passed" |
| `tests/kitchen.mjs` | 46 | all PASS, "kitchen checks passed" |
| `tests/reliability.mjs` | 8 | all 8 PASS, then the script **crashes** (`ENOENT /opt/cursor/artifacts/reliability_gas_restart.png`, lines 191-192) and exits non-zero before printing "reliability checks passed". |

What they cover versus what they claim [read the tests]:

- Almost every check teleports into a scene by writing state through `__ss` (`ss.sceneG1()`, `n.scene = "G1"; n.sq.x = 760; ss.ch2.phase = "g1"`) and then pokes one thing. Counts of such teleports: kitchen 40, gas-stop 13, reliability 12, progression 3. Only `progression.mjs` presses movement keys (13 `keys([...])` calls), and only for short walks.
- No suite plays a chapter from the title screen to its end. The chain G0 to G6, and all of Chapters 3 and 4 except the M5 reunion walk, are never driven as a player would.
- No suite taps the canvas (`tapAt` is used 0 times) and no suite touches the joystick or the on-screen ACTION button. The "phone" checks measure the Reset button's rectangle (reliability) and ticket-number pixel height (kitchen); they do not play on a phone.
- Many "visual" checks are single-pixel colour reads at fixed coordinates (soup bowl, chef hat, cone colour, oven door). They prove a colour is at a pixel, not that a human would read the picture.
- "hiding from counter security" (kitchen.mjs line 682) hides Squatch by writing `sqPose = "hidden"` directly. A player has no HIDE action in the diner while controlling Mops (see section 4), so this check passes a path the player cannot take.
- The tests are real and useful for what they do: the checkpoint table, the 0.75 s hold, the LOCKUP loop, the pump line of sight, and the Rusty softlock all have honest regression checks.

## 3. Backlog cross-check

Legend: **implemented** = found in code as described; **partial** = some of it; **not found**; **can't tell** = would need a human eye or data not in the repo.

| Item (from MASTER-BACKLOG.md and README.md) | Status | Where |
| --- | --- | --- |
| Register: PR #4 merged at `9999f0c` | implemented | `git log` [ran] |
| Register: "PR #5 is open, not merged, not deployed" | **stale** | `main` is `15051ec` = "Restart each section from its own checkpoint (#5)". The backlog is behind. Deployment: can't tell. |
| SS40 pass window, Gloop's arm, tickets through the pass | implemented | Saw the ORDERS window with the arm and #1 NEXT, #2, #3 in my kitchen screenshot [ran]; order-rail test passes. |
| SS41 tickets right-to-left, rail scales, NEXT stays left | implemented (by test) | kitchen test "order rail matches the tickets" passes [ran]; not checked by eye. |
| SS42 oven is a real cook station at x 800 | implemented | `Hn = {x: 800, y: 430}` L18872; COOK within 110 px of (800,500) L19692-L19700; four burners and oven door visible in screenshot [ran]. But see section 4: COOK does nothing but count. |
| SS43 three spice jars on the counter | implemented | Three jars on a rack at the right in my screenshot [ran]. |
| SS44 soup on the crate, chip clear of the door | implemented (by test) | "LEAVE SOUP sits on the crate" passes [ran]; chip code L20759-L20800; I did not see the soup state by eye. |
| DE1 PA line "WOOKIE SPOTTED IN SPACE!", "HIDE! 6", "Bots! Go watch the dock." | implemented | strings present once each; "HIDE! " + ceil(5.5) = 6 at L20794 and `V2` L19976. |
| DE2 "+50 SECRET!", "+100 SNEAKY!", "+25 FUNNY FIND!", "★ = points for finds." | implemented | all four strings present. The "loss of 100 stars" the backlog could not capture is in code: `Pn` L19004 (`−100 CAUGHT`). |
| DE3 soup buy survives Reset section (jar 0, reg 30, soup) | implemented | `sectionReset` L19072-L19076; kitchen test passes [ran]. |
| DE3 "chapter map on screen says Talk to Grandma Gloop at the diner counter" | **not found in the live game** | That string exists only at L13345, inside the dead old engine's level definition. The story engine has no chapter map. |
| DE5 soup note "You're not alone out here", "— The Guardians", paw print | implemented / can't tell | "You're not alone" L20875, "The Guardians" 9 places; paw print is a drawing, can't tell. |
| DE5 Chapter 1 box, "Brave Sasquatches stay hidden", lid spelling | implemented | "Brave Sasquatches stay hidden" 3 places, "GARDIAN" 5 places. |
| DE8 "WOOKIE ALERT! PROTECT THE AIR SCRUBBERS!" | implemented | string present once. |
| DE8 Rusty warns with control still on, LOCKUP about 2 s later, lands at (760,540), jar kept | implemented | `MA` does not drop control L19365-L19369; chaser from x=980 at 170 px/s ≈ 1.8 s; `applyG("g1")` L19303-L19316; jar restored L19076. Progression test passes [ran]. |
| Reset: hold about 0.75 s, R key and button, one-shot | implemented | L24177-L24180, L26191, L26206, L19078; reliability test passes [ran]. |
| Reset: keeps jar, register, item, stars, finds; cancels dialogue; no coins paid | implemented | L19072-L19076, `clearRun` L19163. |
| Reset: checkpoint table (14 phases) | implemented | `applyG` L19204-L19318 matches `docs/README.md` row for row. |
| Reset: unknown phase returns to latest real section, not Chapter 1 | implemented | L19334-L19336 and reliability test [ran]. |
| Reset: Chapter 1 scenes stay on their scene; Zip and Harry keep their own | implemented | L19324-L19331. |
| Reset: phone 396 wide, button 148 by 44 | implemented | measured at 375 wide: (14,578) 148 by 44, canvas overlap 0 [ran]. |
| Reset: desktop R bar on the canvas floor | implemented | `drawReset` L19081-L19090 at (690,598). On a phone this bar is about 5 px tall. |
| Reset: "the play-mode chapter restart was not played" | not needed | that branch (L19065-L19069) is the dead old engine. |
| Reset: checkpoint rows not driven (g2, g3, g3h, g4l) | partial | kitchen test drives back, g1door, g6, g6d, g3hide, wash1, wash5, g4, g1, g4k [ran]; g2, g3, g3h, g4l are only read. |
| Still open: boarding caption | implemented, backlog is behind | BOARD has `cap: "ship"` at L18822 (hangar) and L19576 (G6), drawn by `drawCap` as "BOARD · ship". |
| Pump sight: open ground visible, under and through blocked | implemented | `_h` L18961-L18974; tests pass [ran]. |
| Walk into kitchen crate stops at x 130 | implemented | solids `ih` L15950, push-out `R0` L15966. |
| README: soup 30, tank 30, jar fills to 30 at wash-set end | implemented | BUY L19666-L19690, jar L19902/L19910. |
| README: cooking a ticket pays nothing | implemented | COOK L19692-L19700 changes no money. |
| README: pump bots call security like Rusty; hiding sends it away; capture restarts the section; "report him or fuel him" stays | implemented | `EA` L19405-L19415, `qSec`, lines at L19043; gas-stop test [ran]. |
| README: singing lure is its own setback | implemented | `OA` L19432-L19441 uses `Pn` (−100 stars, no LOCKUP). |
| README: holding pen looks different per captor | implemented | lines L19040-L19058; drawing branches `who === "sink"` etc. L25381-L25407; kitchen test [ran]. |
| README: scrub card DIRTY DISH / CLEAN DISH, 3/3 | implemented | strings present; kitchen test [ran]. |
| README: cook wakes on the same 6 s timer, rumble just before | implemented | 5.15 s rumble, 6 s wake L19449-L19451. |
| README: Mops wears a chef hat only while cooking | can't tell by code | no word "hat" in the kitchen draw; the test passes on a pixel colour [ran]. |
| README: "Squatch's lines move from panic to choosing a hiding place" | can't tell | wording judgment. |
| DE4 pea gag, DE6 Zip songs, DE7 Harry dance | pending by design | "third ear" string is in the dead old engine only; Zip riddle and the four-press DANCE prompt exist (L22141). Not counted. |

Tally over the 36 rows above (excluding the pending DE4/6/7 row): **implemented 23, partial 6 (counting "by test" and "backlog is behind" rows), not found 1, can't tell 6.** Two backlog statements are stale rather than wrong: PR #5 is merged, and the boarding caption already exists.

## 4. Dead ends and confusing interactions

1. **Ring, caption and trigger disagree.** Example, kitchen ticket rail: GRAB appears only within 80 px of the floor point (660,430) (L19744), the caption is drawn at (660,120), and the ring id "rail" is added (L19296, L19754) but there is no `n.pulse.has("rail")` draw site, so nothing glows. The player sees tickets high on the wall and must find an invisible spot on the floor. Same pattern: diner door ENTER needs Mops within 90 px of (door x, door y + 70) (L19533) while the "kdoor" ring box is 100 by 160 from y=230 (L20532). [read]
2. **No HIDE in phase "back".** `RA` L19544: `(i === "g1" || i === "back") && ... && i === "g1"`. The `back` half can never be true. Probably harmless (Squatch is already hidden there) but it is the kind of edit that shows nobody could run the code in their head. [read]
3. **Diner recognition has no escape.** If Gloop or Blorp recognizes Squatch at the counter (`pf` L20253-L20285), `sSec("diner")` fires. The only hide checks are `sqPose === "hidden"` or a kitchen ball (L19352-L19355). In the diner the player controls Mops and the hotspot picker offers Squatch nothing (L19601-L19691 are all `x.mops` branches). So recognition means certain LOCKUP. In normal play Squatch stands at x=160 and may never be seen, but the test for "hiding from counter security" fakes the hide. [read]
4. **The kitchen warning is too short to read.** The only cue before the window peek is the live line "Order up?" plus a sound (L19511). The warn window is 1.5 s (wash1) or 1.1 s (wash5), then a 2.2 s peek, then 0.9 s before "SECURITY!" (L19493-L19499). The live line expires in about 1.7 s (L15802). ROLL is offered only while warn or peek is on (L19719-L19730). On a phone that line is about 5 px tall. [read; phone size ran]
5. **Two capture rules in one chapter.** LOCKUP + section restart + coins kept (Rusty, pump bots, counter, window) versus −100 stars + reposition + no card (dock bots L19515-L19526, lure L19432, "bots6" L19416, kitchen bots shooing Mops L19388-L19395, every Chapter 1 catch). A player cannot predict which will happen. [read]
6. **Timers on slow devices.** The fixed step (L26297-L26311) means a 5 fps device still runs 5.5 s of game time in 5.5 s of real time. That is fair to the clock and unfair to the eye: with the kitchen numbers above, a 5 fps device shows about 5 frames of "Order up?". The 0.25 s cap means a long frame hitch loses game time (good, no sudden catch-up), but there is no pause when the tab is hidden other than the animation frame stopping. [read]
7. **The 0.3 s bubble guard eats taps.** `nf` L15881: a tap in the first 0.3 s after a bubble appears does nothing, with no feedback. Fast tappers will think the game is stuck. [read]
8. **The help line lies.** "Shift runs", "hold while hiding = opera", "Tab = switch to Mops" (L26756) and "push far to run" (L26485) are old-engine features. In the story engine Tab, Q, Shift and the hold do nothing; character swaps are scripted (`swapTo` L18337). [read, verified by grep]
9. **Tapping the canvas is not walking.** A Sierra player's first instinct is to click where they want to go. In story mode a canvas tap advances dialogue or fires the current action (L26245-L26248). With "HIDE" showing, a tap meant as "walk left" hides you. [read]
10. **A prompt that does nothing: COOK.** Any time Mops is within 110 px of the range it shows COOK, and pressing it only says "Cooking ticket N." and counts up forever (L19692-L19700). It never consumes a ticket, never pays, never ends. [read]
11. **Stale prompt during cutscenes.** `n.act` is recomputed only while `n.ctrl` is true (L19526, L24302-L24306). When a scene takes control the old action can stay on the button, which is why the BUY-clear patch (L19681) was needed. The same bug exists for every other verb. [read]
12. **Nothing says "you are hidden" or "they lost you".** Security leaving is a sprite walking off; there is no line or card. The LOCKUP card explains the fail; the success is silent. [read]
13. **No save inside a chapter.** Close the tab in the kitchen and you restart Chapter 2 from G0 (L12060-L12070 store only the chapter number). The checkpoints exist in memory (`k.check`) but are not written anywhere. [read]
14. **Phone layout at 375 px wide** [ran]: canvas 359 by 239 CSS px (scale 0.374). The chapter pill, "TANK EMPTY", "FUEL", "COINS ONLY", "KITCHEN" and the reset bar are 4 to 6 px tall. 190 px of white space sits above the game because `body` centers vertically (index.html line 3). The joystick (128), ACTION (104) and Reset (148) wrap to two rows under the game. In landscape the canvas is capped at 1.5 times the short side (L26790). Every tap on the canvas also fires "unlock audio" and sets touch mode (L26234).
15. **Lobby guards outrun you.** Guard speeds 150 (the first) and 320 px/s (L16427) against Squatch at 190 px/s (L24288). The catch radius is 46 px (L16420). After "Gotcha!" you get 3 s of grace (L16411). Not a dead end, but the only way out is the HIDE! prompt, which has `r: 0` and sits at (480,575) (L16351) so it is always available. The player is never told that.

## 5. Sierra-style UX and game-feel review

**Does the player always know what to do next?** Sometimes. The objective chip (`n.chip`, 15 strings, e.g. "Bring Mops his lunch", "Walk to the diner door") is good when set, but most scenes leave it empty and rely on a pulsing ring. Rings are not always drawn (the "rail" case), and the ACTION label only changes when you are already standing on the invisible trigger point. Chapter openings are 5 to 10 bubble taps before control (G0 `Ws` L19777-L19821 is six lines; the Chapter 3 and 4 arrivals in the kitchen test output are longer).

**Does the player know why something happened?** For LOCKUP, yes: a card, a joke line per captor, and "Holding pen. This section starts over." For the −100 star catches, only a floating "−100 CAUGHT" and lines. For hiding successfully, nothing. For the kitchen window, the "Order up?" line is the cause but it disappears before most players read it.

**Is feedback immediate?** Button presses that do something give a sound and a label change. Presses that do nothing (the 0.3 s guard, COOK, Tab) give nothing. Walking into a solid gives nothing but a stop.

**Consistent visual grammar?** The floor line and the scale are consistent within a room; the kitchen is one floor (confirmed by eye [ran]). Interactive things are marked by a yellow dashed ring when the scene adds one, but a ring is not a trigger and some triggers have no ring. Captions appear on 7 of 129 actions.

**Telling instead of showing.** 274 bubble lines versus 44 live one-liners. Arrival texts state the rule ("Locals still fear Sasquatches. Troopers are the greater danger. Neither is safe.") rather than showing a trooper walk past. The scrubber fear is told in Chapter 1 and then told again as "not the scrubbers" in Chapter 2.

### Improvements, ranked by effect on clarity and enjoyment

1. **One capture rule.** Everything that catches Squatch shows the same card and restarts the section, or everything costs stars and repositions. Code: `Pn` L18991-L19012, `qSec` L19349-L19061, the dock/lure/bots callers L19416-L19526, Chapter 1 catch sites.
2. **Every prompt says where and the caption is readable.** Give every hotspot a `cap` ("HIDE · crate", "GRAB · ticket") and show it on the ACTION button itself (`r8` L26510) rather than 5 px tall on the canvas. Code: the hotspot objects at L16743-L18822, L19528-L19776, L21140-L21301, L22065-L22214.
3. **Ring = trigger.** One helper that takes an id, a point and a radius, used by both the picker (`RA` and the Chapter 1 pickers) and the ring drawer (`oV` L24588 and its 45 call sites). This also finds the missing "rail" ring and the door offset.
4. **A warning you can see.** Replace the 1.1 to 1.5 s "Order up?" text with a visible change on the window (light, an eye, Gloop's shadow) that stays until the peek ends, and lengthen the warn to at least 2.5 s. Code: `wA` L19443-L19512, kitchen draw L20700-L20800.
5. **Phone first.** Put the HUD (chapter, tank, jar, chip) and the caption in the DOM under the canvas, not in the canvas; drop the vertical centering so the canvas sits at the top in portrait (index.html line 3); draw the reset-hold progress inside the Reset button (`k1`).
6. **Tell the truth about controls.** Delete Shift/Tab/Q/opera from the help line (L26756) and "push far to run" (L26485), or implement them in the story engine.
7. **Tap-to-walk.** On a canvas tap with no bubble up, set a walk target; keep bubble taps for advancing. `findPath` L12304 already exists. Code: `O5` L26245-L26248, `y5` movement L24282-L24294.
8. **Say when you are safe.** A short line or chip ("They lost you") when `k.sec` leaves (L19352-L19357) and when the HIDE countdown ends.
9. **Dialogue pacing.** Remove the 0.3 s guard or show the tap landing; make Skip work for any cutscene (`N0` L15864); consider auto-advance after a long delay.
10. **Save inside a chapter.** Write `k.check` plus jar, register, item, stars and finds to `localStorage` in `noteSection` (L19109) and offer Continue on the title (L15283-L15310).
11. **Keep the objective chip on screen in every controllable scene.** Audit the 15 `n.chip =` sites; add one per scene that currently clears it.
12. **Retire COOK or make it mean something** (consume a ticket, advance the cook's wake). L19692-L19700.
13. **Show, don't state, the fear.** Replace the arrival rule-lines (G0, P0, M0 openings) with a trooper or a wanted poster the player walks past.

## 6. Code health that blocks progress

For a solo non-programmer owner working through agents, in order:

1. **Recover the source and stop editing the build.** Ask the agent that wrote `8b96f84` ("built from live 6b464e6 source") where the source folder is, commit it under `src/`, add a `package.json` with `npm run build` (esbuild) that writes `index.html`, and make the rule "never edit index.html by hand". Evidence that this matters: the pretty-printed bundle went from 34,502 lines at `01c0ec1` to 26,099 at `db52e8f` (a rebuild, 30,115 lines removed, 21,712 added), then every PR since is a hand edit of 23 to 373 lines. The next rebuild from the real source will erase PRs #1 to #5 unless the same changes were also made in the source. [read, git history]
2. **Delete the old engine.** About 2,300 lines (L12152-L14406, L15283-L15587, old level data, old `__ss` exports) plus the help text. Nothing reaches it. Every agent that reads the file today reads it.
3. **A scene and hotspot data table.** One list per room: `{id, verb, cap, x, y, r, ring, when(), do()}`. The picker, the ring drawer, the caption and the tests all read the same row. This is the single change that makes "the ring is only a visual pointer" impossible to reintroduce.
4. **A real test harness.** `package.json` with `puppeteer-core` as a devDependency and `npm test`; fix `reliability.mjs` to write screenshots to a repo-relative `shots/` folder (today it needs `/opt/cursor/artifacts/`); one test that plays Chapter 2 from G0 to the ship with keys only; one test that uses `tapAt` at 375 px. Keep the existing 80 checks; they are good regression guards.
5. **A debug menu and a state overlay.** The scene functions are already on `window.__ss`. Add `?scene=G4&phase=g4` handling at startup (L26150) that calls `applyG`/the scene function, and a key (say backtick) that draws `scene, phase, pose, ctrl, act.verb, sec, the live timers` in a corner. Brian's narrated playtests then come back as "scene G5k, phase wash5, warn 0.4" instead of "the kitchen bit".
6. **Keep the docs truthful.** The backlog says PR #5 is open (it is merged) and "boarding caption" is open (it is in code). A line in each PR that says "docs updated to match `main`" would have caught both.
7. **Disk note for whoever runs the tests on this Mac:** the startup volume had about 800 MB free on 2026-11-06. Chrome and `npm install` both need temp space; clear space before running the suites here.
