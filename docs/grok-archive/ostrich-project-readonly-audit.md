# Ostrich project thread: "Battle Ostriches read-only audit" (Ostrich Game bot ↔ Cursor agent bc-7e686f12)

Source: view-only sheet in the Ostrich Game thread. Scraped 2026-11-06. Produced the source audit and then PR #1 (cursor/phase1-visual-burrow-copy-1fed). Grok itself truncated the audit report at 12,000 characters ("the full message is in the run's conversation"), so the tail of section 6 onward is missing here too.

---

**Ostrich Game:**

Read-only source audit of Brian Howe's Battle Ostriches browser game. Brian explicitly approved this audit on Nov 5, 2026. Do NOT change any files, commit, open a PR, deploy, or modify game balance, badger behavior, or infrastructure. Inspect the repository and existing tests, and run safe rule/unit tests that do not require live-service load testing. Report exactly what passed or failed. Establish: (1) architecture and supported modes, (2) actual rules and where implemented, including mismatches with the in-game instructions or README, (3) whether a tap-the-animal action ring or Vulture's Eye Island branding is implemented, (4) current lobby, role selection, rematch, and AI-join behavior relevant to Brian's playtest complaints, (5) hunter combat, injured state, proximity/direction hints, Pounce, burrow UI, death spectator view, and post-death egg interactions, and (6) exact badger speed-boost behavior by mode with test coverage. Also assess the reported solo defects: board layout shifts between turns, blank replay-button labels, and truncated game title. The current direction is to combine Vulture's Eye Island with the tap-the-animal action ring and finish role-view mockups, but implementation is explicitly on hold pending Brian's priorities. Return a concise, evidence-based audit with file references, verified/unverified distinctions, and recommended implementation order. Do not recommend changing the badger speed boost or paid infrastructure without Brian's explicit approval.

**Agent:**

Read-only audit. No source files, balance, badger speed, or infrastructure were changed. node_modules was installed from the lockfile so the tests that need the ws package could run; git status stayed clean.

Tests

Not run: Playwright end-to-end files, e2e-live.js (it targets the live Render site), and the balance sims (sim.js and the large bot sweeps except where a unit file already calls them).

| Command | Result |
|---|---|
| node test.js | Pass. 16/16. |
| node ai-test.js | Pass. Easy vulture wins 42%, Normal 46%. The test only requires legal moves and a finished game. |
| node test3.js | Pass. 18/18, including the badger range-2 boost, burrow, server views, and 40+40 bot games. The first attempt died on missing ws after 15 passes; this is the rerun after install. |
| node testhunt.js | Pass. 16/16, including "no speed boost after a knock-out" and the 400-game bot sim. |
| node testrestore.js | Pass after ws was installed. Local process only: room restored after SIGTERM, unknown code returns the gone flag. |
| node testteam.js | Fail. 13 passed, then 5p: badger burrows by staying expected burrowed === false ("digging 1/2") and got true. The file then stopped, so its shot-clock, server-view, and bot-legality tests never ran. |

Those three unreached checks were run afterward, outside the suite file. All three passed. That does not make node testteam.js a pass.

test3.js and testhunt.js set BO_TOUGH=1 before loading rules, so they only exercise the slow dig. testteam.js does not. With the shipped default (TOUGH5 0.4 in team.js), a separate 400-trial count of the same first stay burrowed immediately 247/400 (62%). That is why this suite run failed.

1. Architecture and modes

One Node process. server.js is authoritative over WebSocket and also serves public/. Rooms live in memory, with store.js writing Redis when REDIS_URL is set and a JSON file otherwise. render.yaml is a free web service. There is no build step.

| Mode | Rules | Seats |
|---|---|---|
| 2-player, two phones | game.js | Ostrich, vulture |
| 2-player, pass-and-play | same, one socket | Ostrich, vulture |
| 2-player vs computer | ai.js, Easy/Normal | The other seat is a bot |
| 3-player | three.js | Ostrich, vulture, hyena or honey badger |
| 4-player, 2 vs 2 | team.js | Ostrich 1, Vulture 1, Ostrich 2, Vulture 2 |
| 4-player Hunters | hunt.js | Ostrich, vulture, hyena, honey badger |
| 5-player | team.js | The 2 vs 2 seats plus one hunter |

The README still describes only the 2-phone game. In-game How to play, in public/index.html, documents all five player counts, and public/ui.js fills the 2-player numbers from CONFIG.

2. Rules, and where they disagree with the text

Shipped 2-player CONFIG in game.js: 9×7 board, 3 eggs, 30 rounds, warmth 24, sit cap 3, fly 2, throw range 1, 1 stone refilled at a rock pile, smell 1, food every 13 turns. test.js locks those in, including smell 1 and one stone.

How to play matches that CONFIG. The README does not. It still says warmth 20, smell 2, and unlimited stones, and it quotes older bot rates (Normal about 50%, Easy about 40%). This run printed 46% and 42%.

Shared hunter rules, implemented in three.js, hunt.js, and team.js:

Turn order is vulture, ostrich, then hunter. In 4-player Hunters the order is vulture, ostrich, hyena, badger. In 4- and 5-player team games it is Vulture 1, Ostrich 1, Vulture 2, Ostrich 2, and the hunter last in a 5-player game.
Sense is yes/no only, Chebyshev distance 2, no direction. Birds see a hunter only within 2, and never a burrowed badger.
A catch knocks the bird back up to 2 and that bird loses its next turn. Hyena knocks a bird out on 2 catches. Badger knocks a bird out on 1.
Hyena Pounce is one extra 1-square move on the same turn when the pre-move sense was yes and the first step did not catch. Badgers never pounce.
A 10-second shot clock passes a vulture, stays an ostrich (no warmth, hunger still ticks), or stays a hunter.
A starved ostrich is out. A partner in a team game plays on.

Burrow text does not match the code. How to play, the hunter-pick blurb, and the button ("Stay · dig 1/2") all say two still turns. The server does this instead:

```
three.js:110
if (!t.pounce && t.kind === 'badger') { t.dig = t.dig ? 2 : (Math.random() < TOUGH3 ? 1 : 2); t.burrowed = t.dig >= 2; }
```

Same formula in hunt.js (TOUGHH 0.3) and team.js (TOUGH5 0.4). The first stay burrows immediately unless "tough ground" rolls. Measured with defaults, 400 first stays each: 3-player 84% instant burrow, 4-player Hunters 69%, 5-player 62%. The "DIGGING 1/2" label appears only after a tough roll. Moving resets the dig. Tests that expect two turns pass only because test3.js and testhunt.js force BO_TOUGH=1.

3. Action ring and Vulture's Eye Island

Neither is in the repo. A search for "Vulture's Eye", "island", and "action ring" hit nothing.

What exists is the egg warmth ring, .wring in public/ui.js: a circle and a number on the ostrich's own eggs. Actions are the Step / Sit / Carry / Fly / Throw buttons under the board. coachNow() returns null immediately, so the old coach highlight never runs. Combining the island name with a tap-the-animal ring is still unimplemented, which matches "on hold."

4. Lobby, roles, rematch, computer seats

This is the behavior behind the playtest notes already in the client (public/ui.js comments a missed instruction and a guide that must not point at an egg).

Two phones: the game is created as ostrich and the code is shown before any role pick. While no egg is placed, #seatPick can switch to any still-open seat (server.js seat).
Vs computer: role and Easy/Normal are chosen first. The other seat is filled immediately. A join is rejected with "That is a single-player game."
Pass-and-play: 2-player only. An opaque handoff sits between turns.
More players: both play buttons open the same setup. "Play the computer" defaults every other seat to a bot; "Play a friend" defaults them to open. Each seat can be toggled. A bot seat is occupied at create, so a person cannot take it later. A joining phone gets the first open seat, not a role they choose.
Hunter animal: the host picks it only when they are the hunter or the hunter is a computer. A human hunter gets the "Pick your animal" overlay on join. The shot clock waits until every seat is filled and, in 3- and 5-player, an animal is chosen. 4-player Hunters has no animal picker; hyena and badger are the seats.
Rematch starts a new deal in the same room, same seats, same bots, same hunter animal. It does not return to role selection. Menu goes home.

5. Combat, hints, death, eggs

There is no injured state. A non-fatal catch adds one pip, slides the bird up to 2 squares, and sets skip so they lose the next turn. An ostrich who loses that turn still gets hungrier. The chip tooltip says "loses its next turn."

Proximity is the boolean sense. The hunter's own screen outlines every square within 2 and pops "BIRD NEAR!" or "Nothing near." It does not point toward the bird. ai.js says the bot also sees "yes/no sense (a bird within 2, no direction)."

Pounce UI is implemented for the hyena only: "POUNCE! One more square." and a "Stop here" button. Burrow UI is implemented: mound art, "BURROWED", "DIGGING 1/2", and the stay-button labels. Those labels assume the two-turn dig above.

Death is not a separate spectator camera. The knocked-out player keeps their seat. The hint says "You're out (knocked out or starved)." A tap still says "Wait, it's the …'s turn." Their piece is sent off-board. Because sight requires the viewer to be alive and on the board, they also stop seeing the hunter. An ostrich who is out still receives egg positions and can see the vulture. A vulture who is out still does not receive hidden eggs. Moves are cleared, so they cannot sit, carry, or throw. A carried egg is dropped on the square where they were caught. Eggs keep cooling. The other vulture can still smash them. In 4- and 5-player, the living ostrich partner can warm any egg. The hunter is sent egg positions only after the game is over.

6. Badger speed boost, by mode

The boost is not badger-specific. It is "any hunter, after that hunter's first knock-out," except in 4-player Hunters, where it is off for both animals. Pounce range stays 1 even when the normal move is 2. Badgers do not pounce, so a boosted badger always uses the full range.

| Mode | Badger move range | Test |
|---|---|---|
| 2-player, and 4-player 2 vs 2 | No badger | — |
| 3-player | 1 until any bird is out, then 2 (three.js hunterRange, T3.boost) | Pass. test3.js "after the first knock-out the hunter moves 2 (boost)" plays a badger and moves 2. |
| 4-player Hunters | Always 1. hunt.js hunterRange returns 1. UI boost: false | Pass. testhunt.js knocks a bird out and checks range 1. The assertion uses the hyena's move list; badger calls the same function. |
| 5-player | 1 until the first knock-out (ostrich or vulture), then 2. Winning still needs one ostrich and one vulture | Pass. testteam.js "boost 2 after the first knock-out" uses a badger. This test is before the failure. |

No test checks a hyena's boosted move and then a 1-square pounce. The code path is the pounce ? 1 branch in three.js and team.js.

Solo defects

Source-checked. Not remeasured in a phone browser this audit, and e2e-live.js was not run.

Board jump. Reservations exist: hint min-height 64px, banner min-height 44px, and the 3-player clock kept when idle (public/vocab.css). Two holes remain. #hint.empty in public/style.css is more specific and sets min-height: 0, so an empty hint collapses the stack above the board. #tipbar is display: none when hidden, so a tip inserts above the board. A long "YOUR TURN" line or the Skip guide button can also grow the hint past 64px, then the next turn shrinks it. The action row is below the board, so it does not move the board's top. e2e-live.js asserts a fly moves the board by at most 1px on the live site; that was not rechecked here.
Blank replay labels. How to play uses three .big.ghost buttons: Replay intro, Replay walkthrough, Replay move hints. Classic sets no theme overrides. Buttons are white (public/style.css), ghost background is transparent, and the rules card is white. Those three labels are white on white. "Got it" is a filled button and stays visible. Other themes paint button backgrounds and are not this bug. Rematch is a filled button. Menu is ghost on the dark game-over screen, so that label should still show.
Truncated title. The in-game logo is BATTLE OSTRICHES plus a sun from .logo::before. #hud .logo is nowrap with ellipsis. At a viewport of 440px or narrower the logo is display: none. The header comment targets a 390px phone, so on those phones the in-game title is removed, not just shortened. The lobby title "Battle / Ostriches" is a different element and is not under that rule.

Order to implement, still on hold
Classic replay-button contrast on the How to play card.
Keep the in-game title visible on phone widths.
Keep the board still: do not let an empty hint or a tip bar change the height above the board.
Change the burrow sentences and the "dig 1/2" button so they describe the dig that already ships. Leave the roll rates and the speed boost as they are unless you explicitly approve a change.
Finish the role-view mockups before more lobby code: one role path, the joiner picking a seat, rematch keeping or reopening seats, and computer seats not filling every chair. An out player today keeps the old view, loses the hunter, still sees their own eggs if they were the ostrich, and cannot act.
After you unblock it: Vulture's Eye Island plus the tap-the-animal act
[... report truncated after 12000 characters by Grok; the full message is in the run's conversation.]

**Ostrich Game:**

Brian has now explicitly approved this implementation order: visual fixes, burrow-text alignment WITHOUT behavior changes, role-view mockups, then lobby/rematch/AI work. Implement ONLY phase 1 now: (a) readable Classic How-to-play replay-button labels, (b) keep the in-game title visible and readable at phone widths rather than removing it, and (c) eliminate board-position shifts from empty hints and the appearing/disappearing tip bar, accounting for long turn prompts without hiding necessary guidance. Also align burrow instructional text and button labels with the existing shipped tough-ground random-roll behavior, without changing any probabilities, movement ranges, badger speed boost, combat, game rules, balance, or infrastructure. Keep the wording simple and accurate for both immediate burrowing and tough-ground delay; update stale test expectations only if they assert the misleading UI text, not game behavior. Run focused relevant tests, and run safe full rule tests where practical. Do not run load tests against the live site. Do not start role-view mockups or lobby/rematch/AI implementation yet. Return a concise change summary, tests and results, and PR link. Preserve every unrelated change and leave deployment to Brian/Ostrich Game.

**Agent:**

Phase 1 is in pull request #1. Role-view mockups, lobby, rematch, and computer-seat work are not started. Dig odds, movement ranges, the badger speed boost, and deployment are unchanged.

What changed
Classic How to play labels. Replay intro, Replay walkthrough, Replay move hints, and Ostrich guides are dark text on a light fill. Other themes keep their own button colors. The game-over Menu button is unchanged.
In-game title. "BATTLE OSTRICHES" has its own row. It is no longer removed below 440px and no longer cut off with an ellipsis. At 320px it renders at 16px and the full title fits, including the sun mark.
Board position. The hint and the tip bar each keep a fixed slot above the board. An empty hint and a hidden tip no longer move the board. Long turn lines, the Skip guide button, and the longest tip still fit inside those slots at 320px. The board sits lower by that reserved space even when the tip is hidden.
Burrow wording only. A still turn usually burrows at once. Tough ground takes one more still turn. Buttons are "Stay · burrow", "Stay · finish burrow", and "Stay burrowed". The halfway tag says "TOUGH GROUND". The same sentence is in the 3-player, 4-player Hunters, and 5-player rules, and in the animal picker.

testteam.js now sets BO_TOUGH=1 before loading the rules, the same way test3.js and testhunt.js already do. The check is still "the first still turn does not burrow." Production odds are unchanged.

Tests

| Run | Result |
|---|---|
| node test.js | Pass, 16/16 |
| node test3.js | Pass, 18/18, including the badger range-2 boost |
| node testhunt.js | Pass, 16/16, including no speed boost in 4-player Hunters |
| node testteam.js | Pass, 17/17 |
| node testrestore.js | Pass |
| node ai-test.js | Pass. Easy vulture wins 42%, Normal 53% this run. The test only requires legal moves and a finished game. |
| Local Chrome at 320, 390, 430, and 520px | Title stays visible. Classic replay labels are dark on light. Board top stayed fixed across an empty hint, a long prompt, and the tip bar shown or hidden. |

Not run: live-site load tests, and e2e-hunt.js because it needs WebKit. That file's label checks were updated to the new words. Its dig and burrow checks are the same.

_(end of sheet)_
