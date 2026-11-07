# Ostrich project thread: "Add animal action ring and clearer hunter feedback" (Ostrich Game bot ↔ Cursor agent bc-861b5889)

Source: view-only sheet in the Ostrich Game thread. Scraped 2026-11-06. Branch cursor/gameplay-action-ring-3c36, PR #2 (merged and deployed 2026-11-05 evening together with PR #3). The action ring it built was later abandoned by Brian on 2026-11-06 ("just go back to buttons at the bottom of the screen").

---

**Ostrich Game:**

Implement a separate, reviewable gameplay-UI PR for Battle Ostriches from starting_ref cursor/classic-ui-fixes-1d72 (PR #1). Brian explicitly approved starting this work in parallel with the existing lobby branch. DO NOT merge, deploy, change Render, or add paid infrastructure. Another cloud agent owns the lobby/role/rematch UI in bc-b3ba6df1-117b-5591-bc2c-7aeaab8940cd: avoid lobby rewrites; focus on gameplay rendering, interaction, and server state needed for the features below.

Brian's agreed design direction combines Vulture's Eye Island with a tap-the-animal action ring. First inspect the existing Vulture's Eye Island client, action buttons, state payloads, visibility rules, tests, and README. Implement a usable touch/mouse-friendly ring or radial action control around the current player's animal for the actions that are actually legal in current state, with clear disabled/explanatory states when needed. Do not put unrelated lobby controls into the ring. Preserve existing keyboard/accessible alternatives and avoid board layout shifts and crowded overlays. Ring must work on phone and desktop.

Also implement these recorded-playtest clarity items: (1) Hyena direction/range information explained and rendered unambiguously, so a hunter can understand what northwest/south/east etc. means; (2) when Pounce is available, make it obvious that the Hyena can catch a nearby bird and gets another turn, without altering the existing rule; (3) injured state visually obvious; (4) dead/eliminated human player receives a read-only god view of all players and relevant board state, never actions or hidden information before elimination. Add an optional turn counter/timer setting default ON in the least intrusive appropriate place, coordinating through settings/state seams rather than rebuilding the lobby. If existing counter semantics are ambiguous, preserve them exactly and describe them.

HARD CONSTRAINTS: never change badger speed boost; do not change hit/catch counts, movement, hunter visibility, capture rules, spawn/probabilities, game balance, or core win conditions. Do NOT implement one-hit capture, proximity alerts, hyena flicker, egg-count outcomes, or other open audio brainstorms. No global brown/tan rebrand in this PR. Preserve Vulture's Eye Island.

Add focused server/client tests for action availability, god-view visibility/no dead actions, default-on counter setting, and any server-backed changes. Run all existing tests plus a local browser playtest at phone and desktop sizes if feasible. Keep scope tight and document any deferred portion plainly. Commit, push, open a PR with the same title, and report the PR URL, behavior changes, test evidence, and any integration risks with the separate lobby PR.

**Agent:**

I'll start from the classic-UI branch and inspect how Vulture's Eye Island, action buttons, and visibility already work before adding the action ring and playtest clarity items.

**Ostrich Game:**

Please retry the same approved implementation from the original brief. The previous run stopped after its initial inspection message with no changes or error details. Continue from starting_ref cursor/classic-ui-fixes-1d72. Do not merge or deploy. If you hit a concrete blocker, report the exact failing step and error instead of stopping silently. Otherwise complete the branch, tests, and PR as originally scoped.

**Agent:**

The gameplay UI is in https://github.com/catolandingham/battle-ostriches/pull/2. It is based on PR #1 (cursor/phase1-visual-burrow-copy-1fed). cursor/classic-ui-fixes-1d72 is not on the remote. Nothing was merged or deployed.

The board is unchanged. There is no separate Vulture's Eye Island screen in the repo, so the new control floats on the current board.

The ✦ on your animal opens a ring of the actions that are legal this turn. A choice that exists but cannot be used stays visible and says why. The buttons under the board still work.
Hyena sense is still only yes or no in the same 2-square box. North is the top of the board, diagonals are labeled, and the line under the hint says "No arrow. North is up."
When Pounce is available, the hint says a bird is within 2, landing on it catches it, and that extra move is still this turn. The animal is tagged CAN CATCH. The rule is the same.
A catch that has not knocked a bird out shows HURT. OUT is still elimination.
An eliminated human bird gets a read-only view of the animals and the eggs, with no actions. Until then, living players keep the old visibility, including a living hunter who still does not see birds or eggs.
The ⏱ button in the header shows the round counter and the shot clock. It defaults on. Hiding it does not stop the 10-second clock. Rounds left is still rounds - round + 1, counting the current round.

Badger speed boost, catch counts, movement, and win conditions are unchanged.

Tests. testplay.js 7/7, plus test.js 16, test3.js 18, testhunt.js 16, testteam.js 17, testrestore.js, and ai-test.js. A WebKit playtest at 390×844 and 1280×800 opened the ostrich and vulture rings, sat from the ring, toggled the timer without moving the board, and showed the hyena compass. The existing WebKit e2e files crashed on the first click in this environment because starting WebAudio kills the browser. The same clicks worked in the playtest with audio left off.

Lobby branch. This PR touches server.js views, public/ui.js, public/three-ui.js, and the header. It does not rewrite the lobby. The timer seam for that branch is room.settings.showTimers, the view field showTimers, and localStorage bo_timers.

**Ostrich Game:**

Brian reviewed the phone action-ring screenshot and chose on-player actions, not duplicate bottom controls. Update PR #2 accordingly using contextual action design / progressive disclosure: tapping the current animal reveals only its relevant actions adjacent to it. REMOVE the redundant visible bottom action bar for normal pointer/touch play rather than showing Step/Carry/Sit twice. Preserve a keyboard and screen-reader accessible path (visually hidden until focused, or a compact clearly-labelled accessible alternative), and preserve direct tapping of highlighted movement targets. Do not make players choose Step redundantly if selecting a highlighted destination already performs the move. Keep unavailable actions from crowding the ring; Brian said only relevant actions. A short explanation can remain in the existing hint area for unavailable actions. Remove the unnecessary 'Vulture smells nothing' popup from the Ostrich view; keep useful Vulture-only smell information with the Vulture and do not change hidden-information rules.

Also fix the close/tap target readability if needed: the current small ✦/✕ is easy to miss and the ring labels can overlap other board indicators. Do not change balance, badger speed, capture counts, hunter visibility, spawn odds, or win rules. Update focused tests and rerun all server tests and phone/desktop browser playtests. Save updated phone screenshots as artifacts for in-chat review. Push to the same PR #2 and report exact changes/test results/artifact paths. No merge/deploy.

**Agent:**

PR #2 is updated: https://github.com/catolandingham/battle-ostriches/pull/2. Nothing was merged or deployed.

The bottom Step, Carry, Sit, Fly, and Throw bar is no longer on screen for normal play. Tapping the yellow Actions label on your animal opens only the actions that apply, beside the animal. Close is that same label. A glowing square still steps or flies on its own, so Step and Fly are not listed again. Sit appears only when you can sit, and Throw only when you hold a stone. If Sit is used up or the vulture has no stone, the hint says so. The old buttons stay in the tab order and show up only while one of them is focused.

The ostrich no longer gets a "Vulture smells nothing" popup. The vulture still sees "Egg nearby!" and "No egg nearby."

Tests. testplay.js 7/7, test.js 16, test3.js 18, testhunt.js 16, testteam.js 17, testrestore.js, and ai-test.js all passed. WebKit at 390×844 and 1280×800 checked Throw-only for the vulture, a step by tapping a glowing square with no Actions chip, Carry and Sit with no Step once the ostrich is on an egg, a bottom bar smaller than 8px, and no "smells nothing" text on the ostrich.

Phone screenshots

/opt/cursor/artifacts/phone-ostrich-actions.png
/opt/cursor/artifacts/phone-vulture-actions.png
/opt/cursor/artifacts/phone-no-smell-popup.png

Desktop shots are desktop-ostrich-actions.png and desktop-vulture-actions.png in the same folder.

**Ostrich Game:**

Brian explicitly said to look into earlier gameplay changes we haven't done yet, then implement actionable items. Please continue PR #2 with the following, rebasing onto current main where appropriate while preserving #1 and #2 work and the new merged lobby. Never merge or deploy. 1) Bird-facing visible-hunter proximity warning: when a living bird first sees a hunter this turn (see-range entry), show a clear one-shot HYENA NEAR/HONEY BADGER NEAR message. Not for a burrowed badger; don't reveal direction or make hunters permanently visible. Test enter range, leave range, hidden burrow. Playtest quotes /workspace/game-feedback/transcripts/02_4m_transcript.txt ~230-242 asked for an alert and other transcripts concurred. This is now explicitly authorized by Brian (not general authority to change balance). 2) Bug: eliminated bird reportedly still covers egg and prevents vulture smash. Reproduce at KO/starvation/OUT, then add regression and narrowly fix: eliminated bird must leave board/OFF and not block throw/smash. Leave living bird protect/throw intact. 3) Verify Honey Badger sees self even while burrowed/digging, fix only if reproducible. Do not change badger speed/dig odds, spawn probabilities, capture/win, movement, balance, or the stale egg-sense investigation (separate agent). Reconcile with merged lobby not overwriting it. Tests, updated screenshots if they affect UI.

**Agent:**

PR #2 is updated and rebased onto current main: https://github.com/catolandingham/battle-ostriches/pull/2. The merged lobby stays, and the classic-label work and the action ring stay on top of it. Nothing was merged or deployed.

A living bird now gets one HYENA NEAR or HONEY BADGER NEAR when a hunter enters the existing see range. Leaving and coming back alerts once more. A burrowed badger does not alert and is still hidden. The message has no direction.

An eliminated ostrich is parked off the board. If a position was still sitting on an egg, a vulture stone on that square smashes the egg. A living ostrich on an egg still makes the stone bounce. Theme sprites for an off-board bird are removed so a ghost bird does not keep covering the egg.

A honey badger already received its own position while digging and while burrowed, in both 3-player and Hunters. That path is unchanged, and a regression test now locks it. The lobby clock switch still turns the shot clock off. Badger speed, dig odds, captures, movement, and win rules are unchanged.

Tests. testplay.js 11/11, test.js 16, test3.js 18, testhunt.js 16, testteam.js 17, testlobby.js 16, and testrestore.js passed. WebKit showed the hyena alert, no alert while the badger was burrowed, then the badger alert once it was visible.

Screenshots

/opt/cursor/artifacts/phone-hyena-near.png
/opt/cursor/artifacts/phone-badger-near.png
/opt/cursor/artifacts/desktop-hyena-near.png

**Ostrich Game:**

Correction from Brian: 'I couldn't see the honey badger at all, not just when he was buried, when I was him.' Your previous check only proved own position in state, not visible rendering. Reopen that item: reproduce the actual Honey Badger player's screen in its supported game modes, including all existing 4-player Hunters after new lobby roles, legacy routes as appropriate, initial unburrowed start and during burrow. Inspect every render pipeline/theme sprites, DOM art, coordinates and client transformations rather than inferring correctness from state position. Capture a before screenshot reproducing invisible badger and an after screenshot with it visible. Add browser regression asserting visible own Honey Badger graphic BEFORE burrow as well as after. Keep rules unchanged. Continue existing PR #2; do not merge/deploy. If legacy live game no longer exposes 3-player attacker selection, use engine setup or test harness and report exact repro path and board browser screenshot. Do not weaken the old state tests as a substitute.

**Agent:**

The honey badger was on the right square the whole time. The paint is what failed, both before burrow and while burrowed.

What was wrong. On the badger player's brown board the body was #17171a and the burrow was #8a5a2b, so the animal and the mound sat on the same brown as the cells. Separately, every theme other than classic set .cell .pc { visibility: hidden } and only drew ostrich and vulture sprites, so a hunter piece was not painted at all. The nature theme also recolored the first path of every piece to brown.

Repro, live lobby, no harness.

4-player Hunters: Play with friends, add three computers, choose Honey badger, start. The opening board is unburrowed. The piece is .pc.ph.hbadger.mine at 32×32 on cell rgb(107, 74, 31).
3-player still has the attacker pick: Play a game yourself, two computers, Hunter, then Honey badger, start. Same piece, classed hbadger mine.

What changed. The badger's body is now pale with a dark outline, and the burrow is a sand mound with eyes. Hunter pieces stay visible on every theme. Burrow rules, who else can see a burrowed badger, speed, and dig odds are unchanged. The old state test that the badger still receives its own position is still there.

Check. node e2e-badger-see.js passed twice. It asserts a visible own graphic before burrow and while burrowed, in both modes, and that the piece stays visible on every theme. node testplay.js still passes, including that position test.

Before and after, the badger player's own board:

[images: Before: own honey badger, unburrowed; After: own honey badger, unburrowed; Before: burrowed; After: burrowed]

Nature theme, same seat, where the piece used to be hidden: after-badger-nature.png. 3-player after shots: unburrowed, burrowed.

Pushed to PR #2. Not merged, not deployed.

**Ostrich Game:**

Brian has confirmed he still wants the far-off view of the island, and I told him we haven't given up on it. Please check whether you understand exactly what that idea was from the design transcripts and intended earlier prototypes, but DO NOT do further coding or branch changes for this now. If you can give a short useful interpretation, reply with it, especially if any old prototype/mockups already exist. Otherwise there is no need to reply. Current active work is on separate agent.

**Agent:**

The far-off island view is not specified in anything available here, and there is no island prototype in the repo.

The Nov 5 brief and the read-only audit only name Vulture's Eye Island as an unimplemented piece to combine with the tap-the-animal ring. The audit says a search for that name, "island," and "action ring" hit nothing, and lists it separately from a death-spectator camera. The only attached mockup from that work, battle-ostriches-role-mockups-v2.html, was the lobby and role flow, and it is not on this machine. The playtest transcript path cited earlier is not here either.

What this branch did with the name was keep the existing board and put the action ring on it. That is not a far view of the island. No branch changes were made.

_(end of sheet)_
