# Ostrich project thread: "Build adaptive Ostrich lobby and rematch flow" (Ostrich Game bot ↔ Cursor agent bc-b3ba6df1)

Source: view-only sheet in the Ostrich Game thread. Scraped 2026-11-06. Branch cursor/lobby-roles-rematch-40cd, PR #3 (merged and deployed 2026-11-05 evening; this is the lobby Brian later called a "massive regression").

---

**Ostrich Game:**

Brian explicitly said 'Go ahead and build things' after reviewing the revised lobby direction. Implement the lobby/roles/rematch/AI flow in a NEW branch from current main, separate from open PR #1 (visual fixes and burrow copy); do not merge or deploy PR #1 or this work. Attached /workspace/battle-ostriches-role-mockups-v2.html is the design proposal Brian discussed; treat it as direction, not a requirement to preserve every visual detail. Full source audit findings from the prior agent apply: current main has two-phone, pass-and-play, solo, and 3/4/4h/5 multiplayer modes; bots currently occupy seats at creation, joiners get first open seat, and rematch locks roles. Requirements from Brian's explicit voice memo and follow-ups: (1) Home's primary options are Play with friends and Play solo; Pass & Play remains available as a small secondary link, not a third primary button. (2) Play with friends shows a shareable room code immediately; NO player-count-first screen and NO fixed seats that must be filled before roles. Joined humans determine the room's player count. (3) Normal flow is simply choose/switch roles, optionally add bot(s), Start game. Bots are offered at Start, not through a separate Add Computer screen. Do not block the host into only Ostrich/Vulture. (4) Infer setup automatically when unique (2p birds, 3p Hunter, 5p 2v2+hunter). For 4p, offer a lightweight 2v2 vs Hunters choice because available roles differ; for unsupported human counts provide a clear lightweight recovery/setup choice, not a dead end or count-first flow. Preserve the real supported game rules and role sets. (5) Solo allows choosing how many bots to play against and then roles/start, preserving supported setups and easy/normal where appropriate. (6) All roles for the selected setup should be visible on one screen and switchable before Start; choosing Hunter then asks Hyena vs Honey Badger instead of cluttering the lobby. (7) Turn timer/counter setting remains optional, default ON, tucked into an expandable gear/settings control, not a required settings screen. (8) Rematch offers Same roles or Change roles; a clear New Game path exists. Anyone who joins the room between games is added automatically, subject to supported setup handling. Fix computer join/start logic so bots fill remaining roles correctly at Start rather than leaving the lobby waiting for humans. (9) Preserve game behavior, combat, balance, dig probabilities, and especially all badger speed boosts exactly. No paid infrastructure, no deletion of services, no action-ring implementation yet. (10) Visual direction: keep the animal art and a cleaner light sky/cream background rather than the mockup's brown/tan, but do not make a broad rebrand or sacrifice phone readability. Build robustly with the existing architecture rather than a static mockup. Add focused tests for role switching, dynamic join counts, bots at Start, solo bot count, 4p setup selection, rematch role changes, and late joiners where practical. Run safe unit/rule tests and browser tests available. Do not load-test the live service. Return a PR link, exact tests/results, any deliberate UX decisions or remaining limitations, and any test coverage gaps.

**Agent:**

The join-first lobby is in https://github.com/catolandingham/battle-ostriches/pull/3, on cursor/lobby-roles-rematch-40cd from current main. It is not deployed, and PR #1 was not merged or deployed.

Home is Play with friends and Play solo, with Pass & Play as a small link. A friends room shows a code immediately. The people who join set the size. Two, three, and five players pick their setup automatically. Four players choose 2 vs 2 or Hunters. Six or more can play as 5 or wait. Every role for that setup is on one screen and can be switched until Start. Hunter asks Hyena or Honey Badger. Computers are added on that same screen and fill unclaimed roles when the host starts. Rematch offers Same roles, Change roles, and New Game. Someone who joins between games is included when the rules still have a place for them.

Combat, dig odds, and badger speed boosts are unchanged. The board themes are unchanged. The lobby and home use a light sky and cream background.

Passed

node test.js — 16 rule tests
node testlobby.js — 15 lobby checks, plus websocket checks for role switching, host-only Start, bots filling open roles, solo count and difficulty, the turn timer, a full room rejecting another player, late-join expand, and change-roles
node ai-test.js
node test3.js — 18
node testhunt.js — 16
node testteam.js — 17 (one run missed the probabilistic "digging 1/2" assert; a rerun passed; dig odds were not changed)
node testrestore.js
node e2e-lobby.js, e2e.js, e2e-pass.js, e2e-three.js, e2e-hunt.js, e2e-team.js, e2e-tooltip.js, e2e-shared.js, e2e-hardstop.js, e2e-share.js
node e2e-invite.js — all 13 themes, plus solo Ostrich and Vulture

Not run

e2e-live.js was updated for the new buttons and was not aimed at the live service
e2e-consistency.js still stops on the existing throw hint, which says "red-orange" rather than "glowing"

Decisions

One person waiting on a friends code can already claim Ostrich or Vulture. Start stays off until a friend joins or a computer is added.
A valid group starts in one tap. Adding computers is inline on that screen. People who never picked a role get the next open one at Start, then computers take the rest. The host can be any role.
A computer hunter is a Hyena unless the host picks Honey Badger. In the 4-player Hunters game, Hyena and Honey Badger are separate roles.
The turn timer is in the gear, on by default, and applies to the 3+ player shot clock. Easy/Normal is in that same gear when computers are playing. The host sets those and starts the game. Anyone can change their own role, and anyone can choose the rematch.
The timer is not changed mid-match. Same roles keeps it.
Pass & Play is still the one-phone 2-player game. Change roles is not shown there. New Game is.
Rooms hold at most 8 people. "Play as 5" uses the host and the next four. Names are Player 1, Player 2, and so on.
The older create messages used by the rule tests still open a game directly.

Limitations

Eggs are hidden after Start, not while a friends room is still waiting.
make-*-shots.js and wk-live.js still click the old home buttons.
No action ring, and no balance, dig, or badger-speed changes.

**Ostrich Game:**

Brian wants to review the work in chat, not only through PR links. Produce actual phone screenshots of PR #3 from a local browser, without changing game behavior or deploying: home, friends room with immediate code and roles, four-player setup choice with bots control, and rematch choices. Save the screenshots as final-run artifacts and report their paths, plus any visible UI problem you notice. You may include a small standalone contact sheet image if useful. Do not create another PR or change the scope; if you find a functional bug, report it rather than expanding into a redesign. No merge/deploy.

**Agent:**

Phone screenshots of the local PR #3 lobby are saved. Nothing was changed, merged, or deployed.

[images: Home; Friends room; Four-player choice; Rematch]

Paths

/opt/cursor/artifacts/phone_home.png
/opt/cursor/artifacts/phone_friends_room.png — code DGWV is on screen with the two role cards
/opt/cursor/artifacts/phone_four_player_choice.png — one person plus three computers, so the 4-player choice is showing
/opt/cursor/artifacts/phone_rematch.png — Same roles, Change roles, and New Game
/opt/cursor/artifacts/phone_contact_sheet.png — all four, smaller

What shows

Home is two primary buttons, with Pass & Play as the small link underneath. The friends room shows the code immediately, Copy and Share, and the Ostrich and Vulture cards. Adding three computers lists Computer 1–3 and asks for a setup. Start stays disabled until that choice is made. Rematch shows all three buttons.

Visible problem

The words on the white cards are white, so they disappear. Measured on the page: role titles and the setup buttons are rgb(255, 255, 255) on a rgb(255, 255, 255) background.

The role cards do contain "Ostrich" and "Vulture". Only the gray subtitles ("hide eggs", "hunt eggs") can be seen.
The two setup buttons do contain "2 vs 2" and "Hunters", with their subtitles. Both buttons look empty. The tan note above them, "4 players can be 2 vs 2 or Hunters.", is still readable.

The +1 / +2 / +3 chips are black on blue when open. After +3 is chosen they collapse behind Add computers, so this shot shows the three computer rows rather than the chips.

The rematch line "0 egg(s)" is from forcing the end screen before any eggs were placed, so the buttons could be captured. It is not a finished game.

**Ostrich Game:**

Fix the confirmed white-on-white text bug you found in PR #3: rolecard titles and setup-opt titles are rgb(255,255,255) on white cards and therefore invisible. Ensure all role/setup labels and their subtitles have accessible contrast in every theme and in selected/taken/disabled states. Also improve the black-on-blue computer-count chips to readable contrast. Keep Brian's approved light home/lobby and all gameplay/balance unchanged. Add a focused regression check for computed contrast/visible text and rerun relevant lobby browser tests. Capture new phone_friends_room and phone_four_player_choice screenshots with the corrected labels and report artifact paths for in-chat review. Push the small fix to the same PR #3; no merge/deploy.

**Agent:**

The white-on-white labels are fixed and pushed to PR #3. Nothing was merged or deployed.

Role and setup cards now use dark text on white, including the selected, taken, and disabled states. The selected computer-count chip is white text on navy instead of black on bright blue. Those colors are locked for every theme so the board themes cannot paint the lobby text white again. The light home and lobby, and the game itself, are unchanged.

[images: Friends room with role names; Four-player choice with visible labels]

Screenshots

/opt/cursor/artifacts/phone_friends_room_fixed.png — Ostrich and Vulture, with their subtitles
/opt/cursor/artifacts/phone_four_player_choice_fixed.png — "2 vs 2" and "Hunters", with their subtitles

Tests

node e2e-lobby-contrast.js passed. It checks role titles and subtitles (selected and disabled), both setup choices (plain and selected), and the computer-count chips (plain and selected) in all 13 themes. Each label has to be on screen and at least 4.5:1 contrast.
node e2e-lobby.js passed.

The +1 / +2 / +3 chips sit inside Add computers, so they are not open in the four-player shot. That shot was taken after +3 was already chosen. The contrast test covers those chips directly.

**Ostrich Game:**

Brian explicitly approved doing the independent UX/UI pass now. Implement it on the same PR #3, preserving all earlier work and constraints. No merge/deploy, no paid infrastructure, no game balance changes, never change badger speed.

Brian's latest explicit feedback: the friends room feels busy; simplify it. Remove the separate four-player 'Choose setup' step: 'won't you just decide what type of game you're playing on what roles you choose?' Yes, role choices should infer 2v2 vs Hunters. Design a natural role-first flow with all four available animal/role choices for four participants: Ostrich/Vulture roles with no hunters means 2v2; Hyena + Honey Badger selected means Hunters. Make invalid/incomplete role mixes recoverable inline without a redundant setup screen. For bots/empty roles at Start, infer from claimed hunter roles where possible, otherwise choose the existing default deterministically (document it); a host may adjust roles rather than click a setup-mode button. Preserve 2/3/5 player inference and rematch/late-join behavior; adapt four-player rematch/change-roles to this model.

Run a self-directed usability/accessibility pass (Nielsen-style visibility of system status, match to real-world role selection, minimalist/progressive disclosure; not a heavy framework): on the friends room, prioritize room code + ONE Share button; remove the visible long URL input, redundant Copy button, repetitive explanatory banners, and 'No seats to fill...' copy. Keep copying fallback when native Share is unavailable, plus an accessible way to read/copy the code. Put secondary help/sound/theme/settings tools into one compact gear menu (or one simple More control) rather than four separate top buttons; keep readable labels/aria and do not hide essential Start/roles. Reduce boxes/borders and repeated computer rows: use a compact computers summary and +/- or count control, with roles assigned at Start. Keep roles and Start prominent. Do not change the home visual design except tools consolidation if appropriate, and preserve all 13 theme contrast tests.

Test yourself on phone 390x844 and desktop 1280x800, cover initial friend room, second joiner, 4p role-driven 2v2, role-driven Hunters, invalid/incomplete roles, bots Start, solo, gear tools, rematch/late join, keyboard access. Update existing tests rather than leaving them clicking deleted setup controls. Run relevant full multiplayer/rule tests and accessibility contrast checks. Capture actual new screenshots of the simplified friends room and 4p role-choice flow, plus any useful comparison, and report artifact paths for in-chat review. Push to same PR #3, document UX choices and tests. Work autonomously; do not wait for Brian on routine visual decisions.

**Agent:**

The simpler friends room is on PR #3. Nothing was merged or deployed, and badger speed is unchanged.

[images: Simplified friends room; Four roles decide the game]

Screenshots

/opt/cursor/artifacts/phone_friends_room_simple.png — phone, code plus one Share button, Ostrich and Vulture
/opt/cursor/artifacts/phone_four_player_roles.png — phone, four animals and a computer count, labeled 2 vs 2 until a hunter is picked
/opt/cursor/artifacts/desktop_friends_room.png — the same room at 1280×800

How four players work now

There is no Choose setup step. With four participants, the roles are Ostrich, Vulture, Hyena, and Honey Badger. Ostriches and vultures alone mean 2 vs 2, up to two of each. Picking Hyena or Honey Badger switches the room to Hunters, which has one ostrich and one vulture. If that leaves someone without a seat, one line says who should switch, and Start stays off until they do. Empty seats fill at Start in a fixed order: Ostrich 1, Vulture 1, Ostrich 2, Vulture 2, or Ostrich, Vulture, Hyena, Honey Badger. A computer hunter in a 3- or 5-player game is still a Hyena unless Honey Badger was chosen. Two, three, and five players still infer one setup. A late joiner who turns a hunter game into four players keeps Hunters and takes the open hunter seat.

What got quieter

The room shows the code and one Share button. The long link is only for screen readers and for copying when Share is unavailable. Help, sound, theme, the turn timer, and computer difficulty are in the gear. Computers are a minus, a count, and a plus, not a row of seats. Home is the same two buttons, with those tools moved into one gear.

Tests

Passed: test.js, test3.js, testhunt.js, testteam.js, testlobby.js, e2e-lobby.js (390×844 and 1280×800, keyboard, and an invalid mix), e2e-lobby-contrast.js across all 13 themes, e2e-hunt.js, e2e-team.js, e2e-three.js, e2e.js, e2e-pass.js, and e2e-share.js. The tough-ground dig check in testteam.js failed once and then passed. Dig odds were not changed.

_(end of sheet)_
