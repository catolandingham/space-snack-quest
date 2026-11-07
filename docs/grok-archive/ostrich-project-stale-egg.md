# Ostrich project thread: "Investigate stale pass-and-play egg feedback" (Ostrich Game bot ↔ Cursor agent bc-2e1cbfdf)

Source: view-only sheet in the Ostrich Game thread. Scraped 2026-11-06. PR #4, based on main; unmerged as of the scrape.

---

**Ostrich Game:**

Brian's in-person playtest found a reproducibility-targeted bug in the standard two-player pass-and-play game on main/live: at one point the Vulture received egg-nearby feedback saying there was an egg when the egg was no longer there. There HAD been an egg there in a previous round. Unknown whether a carry/drop, capture/hatch, role handoff, stale lastSense/lastAction state, or rendered message caused it. Investigate deeply, reproduce with a regression test before fixing, and keep the change narrowly scoped in a NEW branch/PR based on main (not PR #2 or #3). Preserve canonical egg sensing rules, spawn probabilities, movement, capture/win conditions, living visibility, badger speed boost and all game balance. Inspect both engine and pass-and-play UI/client message lifecycle, tests and restoration if relevant. Verify removed eggs never cause a later nearby message, that genuine current nearby eggs remain signalled, and that each animal gets its own fresh feedback at handoff. Report exact root cause, minimal repro, tests passing and any unresolved uncertainty. No merge or deploy. Do not take unrelated work from the other PRs.

**Agent:**

The vulture's "Egg nearby!" on a later handoff was the previous landing's snapshot, still being read out after the egg was gone. Sensing at the moment of the landing was already right. The fix is in https://github.com/catolandingham/battle-ostriches/pull/4, based on main. It is not merged and not deployed.

Root cause. A landing stores sniff.yes until the vulture's next move. That snapshot is what keeps the green "might be here" squares and what the vulture bot remembers. The pass-and-play screen also painted it as a live banner on every later vulture view, including the next handoff after the round advanced. One shared "already shown" key meant the ostrich never got its own copy of that sense, and a reload could pop the old yes/no again.

Carry, drop, cold, and smash do not leave a ghost egg for a new sniff. A carried egg is sensed at the ostrich, then set down on that same square. A cold or smashed egg keeps its old coordinates but is dead, and smellsEgg ignores it. Two-player has no hatch or capture, and the hunter's lastSense is not on this path.

Minimal repro. Eggs at (6,2), (2,5), and (3,5). Ostrich starts on (6,2). Vulture flies from (4,3) to (5,3): smell is true, distance 1. Ostrich carries to (7,2). The egg is now 2 squares from that landing, so a fresh smell is false, but sniff.yes is still true. On the vulture's next handoff the banner said "Egg nearby!".

What changed. The sense is stamped with its round. "Egg nearby!" and "No egg nearby" are said only during that round, once for the vulture and once for the ostrich. "Found egg!" still follows the visible found mark, which clears when that egg is carried off or goes cold. The yes/no snapshot and the green squares stay until the next vulture move, so the vulture does not learn whether the egg left. Smell range, spawns, movement, capture, wins, living visibility, and the badger boost are unchanged.

Tests. node test.js (19, including carry-away, a later "no", a new "yes", a cold egg, and Found egg). node e2e-sniff.js plays the handoff: fresh "Egg nearby!" for the vulture, "Vulture smells an egg nearby" for the ostrich, no nearby announcement after the carry, green squares still there, then a new landing beside the carried egg announces again. Also passed: e2e.js, e2e-pass.js (24 rounds), test3.js, testhunt.js, testteam.js, ai-test.js. This environment has Chrome and not WebKit, so the browser runs used Chrome. The new script tries WebKit first.

Uncertainty. The playtest was not recorded, so the sentence on screen was the banner (or a popup after a reload). The green squares still mark the last sniff's possible squares until the vulture moves again. They say "might", and they stay either way, so they are not a new reading. A 5-player badger dig test failed once on its own random tough-ground roll and passed on the rerun. This change does not touch digging.

**Ostrich Game:**

Now fit PR4 stale clue against CURRENT main which includes lobby/gameplay merges. Read actual result of changed UI before rebase conflict blind. Rebase/solve conflicts preserving main actual tests. Add explicit sequence bird arrives carries egg to Vulture vicinity, leaves, later arrives, empty/old status and previously stored clue not spoken again as live. Keep canonical last clue squares memory unchanged. Do not modify game logic or extra UI cue outside PR4 to avoid rebase overlap. Only tests known failing pre patch and passing if relevant once. Return updated test results and screenshot. Do not merge or deploy.

**Agent:**

PR 4 is rebased onto current main (the lobby and action-ring merges). It is not merged and not deployed: https://github.com/catolandingham/battle-ostriches/pull/4

On that main screen, before any conflict resolution, the later vulture turn was still speaking the stored clue. After the ostrich carried an egg into range, the banner kept saying No egg nearby. The one-shot popup did not repeat. The action ring sits on the vulture and covers neighboring squares, so board clicks have to go through the cell itself.

The ring's popup rule, the green last-clue squares, smell range, movement, and the living-ostrich guard are unchanged. Only the spoken banner is limited to the round of that sense.

The sequence now covered is: the ostrich arrives on the egg at (7,3), the vulture perches at (5,3) and hears a live "No egg nearby", the ostrich carries the egg to (6,3), and that old "no" is not spoken. The vulture lands at (6,4) and hears a live "Egg nearby!". The ostrich leaves with the egg to (7,2). On the next vulture turn the stored yes is not spoken, and the green clue squares are still there. Landing on the empty square (5,4) is its own live "No egg nearby".

Tests, run once

node test.js — 20 passed, including that sequence
node testplay.js — 11 passed (main's ring tests)
node e2e-sniff.js — passed on the current pass-and-play lobby

Later vulture turn: no live nearby banner, green clue squares still on the board.

[image: Later vulture turn with the old clue unspoken and the green squares still lit]

_(end of sheet)_
