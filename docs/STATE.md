# Space Snack Quest: where things stand
Sunday, November 8, 2026, about 8:50 PM PT. Decisions: `docs/DECISIONS.md`. Open asks: `docs/OPEN-ASKS.md`. Words: `docs/CH1-CARTOON-LINES.md`. Look: `docs/STYLE-GUIDE.md`.

## The game
- Live game = `main` of `catolandingham/space-snack-quest` at **10030f6** (Phases 0–3 and the Chapter 1 pass, PRs #7–#11). Render publishes `main`.
- Open PRs when this note was first written: #12–#16 (docs, audits, held fixes). PR #17 (room walks and the hoof-stamp cut) opened on 2026-11-09. None of them are merged. This decision-log sync is a separate docs PR. It is not merged until Brian writes his yes.
- **Running now:** the room-walk fix (P2) and the hoof-stamp line cut (P3), which Brian OK'd on Nov 8, are open as [PR #17](https://github.com/catolandingham/space-snack-quest/pull/17) on `cursor/later-chapter-walks-04ec` (cloud agent bc-1f6073a1-0bac-5c0f-a74a-eeae794204ec). It was not open at 8:45 PM PT on Nov 8. It is open now, and it is not merged. **Don't merge it without Brian's written yes in that PR.** That PR also edits `README.md`, `docs/MASTER-BACKLOG.md`, `docs/CHIP-ARMATURE-AUDIT.md`, `docs/project/DECISIONS-2026-11-08.md`, `docs/project/STATE-2026-11-08.md`, and adds `docs/LATER-CHAPTERS-LINES-FOR-BRIAN.md`. It edits `src/game/20-ch2.js`, `30-ch3.js`, `40-ch4.js`, `50-story-frame.js`, `60-frame-draw.js`, `90-input-shell.js`, and tests. This docs PR does not touch those code files.
- Not started: the P1 security trace, P4–P8, and the Chapter 1 rebuild (it waits on the finished cartoon).
- `docs/DECISIONS.md` and this file are the live copies. The dated snapshots `docs/project/DECISIONS-2026-11-08.md` and `docs/project/STATE-2026-11-08.md` are kept. Every earlier note is in the section below, and a replaced note is marked **Superseded** there.

## Chapter 1 cartoon: panels in story order
All panels are in `/workspace/ssq/mockups/`. The file numbers are older and don't match the story order.
| Order | Panel | File (script) | State |
|---|---|---|---|
| 1 | Hall, the PA announces the ship | `sketch-01m-hall-soft.png` (`hall_soft3.py`) | layout approved |
| 2 | Lunch bag | `sketch-02-lunch-bag.png` (`lunch_bag.py`) | approved ("Good") |
| 3 | Delivery ramp, day: robots arrive, the manager, Squatch eyes-only in the plant, the mail room + robot mailbox | `sketch-03-delivery-ramp.png` (`delivery_room.py`) | redrawn tonight (mail room, plant hide, peek-eyes); Brian hasn't seen this version |
| 4 | "Delicious." Mops bites the yellow copy, the pink copy is sucked into the wall vent | `sketch-04-delicious-vent.png` (`delicious_vent.py`) | redrawn tonight (mail room, plant hide, peek-eyes) |
| 5 | Gumbling | `sketch-05a-gumbling.png` (`gumble.py`) | approved earlier; redrawn tonight for the mail room and peek-eyes |
| 6 | Spit into the bin | `sketch-05b-spit-bin.png` (`gumble.py`, `gumble_extra.py`) | approved earlier; redrawn tonight for the mail room and peek-eyes |
| 7 | Night one: Squatch paw-signs the yellow copy and posts it in the robot mailbox | `sketch-07-night-mailbox.png` (`night_mailbox.py`) | drawn (mail room updated); words TBD |
| 8 | "Six days later" card | — | not drawn |
| 9 | Escape night: Squatch waits outside the grate as the L2 ball | `sketch-05c-ball-wait.png` (`ball_wait.py`) | L2 ball swapped in (8:44 PM) |
| 10 | Vent workstation (detective wall, IDEAS FOR GUARDIANS, pink slip, Squatch behind the grille) | `sketch-06-vent-workstation.png` (`vent_workstation.py`) | drawn (7:47 PM); Mops's thought bubble parked |
| 11 | Pink slip leaves the vent ("Hurry, hurry, pink slip, got it!" / "Get it before he sees it.") | — | not drawn; words need Brian's yes |
| 12 | Pickup day: the mail room is full and a robot opens a crate | `sketch-09-pickup-day.png` (`pickup_day.py`) | drawn; Mops moved off the arch; peek-eyes redraw going in; not shown to Brian yet |
| 13 | Costume at home: Mops trims his beard, closet with kits and JANITOR shirt | `sketch-08a-costume-shave.png` (`costume_home.py`) | redrawn at home with the closet (8:40 PM); not reviewed yet |
| 14 | Costume on | `sketch-08b-costume-on.png` (`costume_home.py`) | redrawn at home (8:40 PM); not reviewed yet |
| 15 | Boarding through the fur scanner arch | — | not drawn |
| 16 | FUR alarm zoom | — | not drawn |

Not a story panel: `sketch-07-guest-lineup.png` (guest reference sheet; 01–06 approved). Reference sheets for the ball: `sketch-ball-options*.png` (the pick is L2, `_ball_head_L2.png`). The older `beats1-7-*.png` / `beats8-18-*.png` boards are superseded by these panels, but they're the reference for the original peek-eyes. The older hall tries `sketch-01g`–`01l` are superseded by `01m`.

## In progress right now
- **Peek-eyes redraw:** every plant and box hide gets the game's original white eyes (`peek_eyes.py`). Applied so far in `delivery_room.py`, `delicious_vent.py`, `gumble.py` and `pickup_day.py`. Check the rest (night mailbox, workstation grille) after it lands.
- **The P2/P3 cloud-agent PR** (above).
- **Waiting on Brian:** the costume-at-home and pickup-day panels, the mailbox words, the pink-slip lines, and the whole Open list in DECISIONS.md §9.

## Next
1. Draw the pink-slip exit, boarding through the scanner and the FUR alarm zoom, without pausing between sketches.
2. Put all the panels together as one Chapter 1 cartoon in the order above, with every line in a bubble, for Brian's yes.
3. This file and `docs/DECISIONS.md` are that sync. Review, "Docs match main: yes", and Brian's written yes come before merge.
4. Then build Chapter 1 in small reviewed phases through the cloud agent.

---

## Earlier state, kept in full
From `docs/project/STATE-2026-11-08.md`, the snapshot of the Drive master taken 2026-11-08. Every note below is the original text. Nothing was deleted. A **Superseded** line means a later fact replaced that note. The later fact is named. Notes with no status line are history that still describes what happened then.

<!-- Snapshot of the Drive master (Wyttmab Drive / My Drive / Space Snack Quest / STATE.md) taken 2026-11-08. The Drive copy was the live one when this snapshot was taken. -->

# Space Snack Quest: state

**Superseded** as the live date. The live status is the top of this file (Sunday, November 8, 2026, about 8:50 PM PT, copied into the repo on November 9). Kept:

As of 2026-11-06 evening (Claude Code session on Brian's MacBook).

## What it is
A Sierra-style browser adventure ("Sneaky Sasquatch: Space Snack Quest"), four chapters, built by AI coding agents (Cursor cloud agents driven from a Grok bot called "Squatch Game" in the Movement Institute Grok workspace) between 2026-11-02 and 2026-11-06. Brian is the designer and playtester, not the programmer. Armature: "Home is where love doesn't have to hide."

## Where things live
- Code: GitHub `catolandingham/space-snack-quest` (private since 2026-11-05). One built file `index.html`, four test suites in `tests/`, docs in `docs/`. Live at Render service `space-snack-quest`, auto-deploys from `main`.
- Readable source: only Chapter 1 (revision "M1b", 2026-11-02 10:25). It is in `source-snapshots/space-snack-quest-code-2026-11-02.zip` here (`page/game.canvas.tsx` plus `page/build.sh`). Chapters 2 to 4 were built on 2026-11-03 inside a cloud agent and exist only in the minified `index.html`. Every PR since has been hand-edited into the minified file.
  **Superseded** by K1 (D1 Option A, Phase 0). Source is `src/game/*.js`. `npm run build` writes `index.html`. Nobody edits `index.html` by hand (W1).
- Story: `docs/story-bible.md` in the repo (the spine), with `docs/STORY-DECISIONS.md` for open story calls. Brian's own 13-rule cumulative review checklist is in `HANDOFF.md` inside the zip.
  **Superseded** in part. `docs/DECISIONS.md` is the single source of truth for decisions. `docs/story-bible.md` is still the Chapter 2 kitchen revision. `docs/STORY-DECISIONS.md` now records which of its eight questions are answered. The 13-rule checklist in the repo is `docs/REVIEW-RULES.md`.
- Reviews and archives (in the repo, `docs/`, written 2026-11-06, not yet committed as of this note): `CODE-REVIEW-2026-11-06.md`, `DESIGN-CHECKLISTS.md`, `grok-archive/` (every Grok thread, verbatim, with `FEEDBACK-INDEX.md`), `playtests/`.
  **Superseded.** Those docs are committed on `main`.
- Playtest recordings: on Brian's Desktop as `.aac` files (Nov 4 to 6). Transcripts go in `playtests/` here and in the repo.
- Sister game: `catolandingham/battle-ostriches` (Node, multiplayer). Reviewed one page in its `docs/`. Not the priority. Parked (OPEN-ASKS E16).
- Story judging: the `story-coach` skill (Brian McDonald's method as Jesse Bryan teaches it; armature, seven beats, domino, bones-muscle-skin) is the tool for judging scenes and goal lines. Master zip in Dropbox `Business/Wyttmab/Resources/Claude Skills/story-coach.skill`, deployed to claude.ai 2026-11-07. Call it with "story coach" or "does this scene belong".

## Open items
**Superseded** as a "what is open now" list. The live open list is `docs/DECISIONS.md` §9 and `docs/OPEN-ASKS.md`. The notes below are kept.

- D1 decided 2026-11-06: Option A (see DECISIONS.md). Phase 0 is merged to `main` as PR #7 (21b9c4a, 2026-11-06 21:35); Render deployed it at 21:39 PT; the live file at space-snack-quest.onrender.com matches the merged build (sha checked). Contents: T1 `npm test` runs six suites; T2 the readable copy is `src/game.js` (15,362 lines) plus `src/vendor-react.js`, `npm run build` writes `index.html`, and the build is proven the same program as the live one (same esbuild output, identical 40-press runs in all four chapters); T3 `CLAUDE.md` (45 lines) and `docs/REVIEW-RULES.md`; T4 `?ch=2&phase=wash1&debug=1` opens any scene with a state strip. Verified on Brian's MacBook: `npm run check-build` OK, all 6 suites pass. Merging this branch to `main` deploys the rebuilt `index.html` to Render (not byte-identical, same program).
  Phase 0 merged is still true (K1). "see DECISIONS.md" now means `docs/DECISIONS.md`. The source has since been split out of one `src/game.js` into `src/game/*.js` (Phase 2). The suite count has grown past six.
- Hermes job 1 (H1) ran on the mini on 2026-11-06 at about 22:00 and finished cleanly. Report: `reviews-2026-11-06/FEEDBACK-CODE-CHECK.md` here (fetched by scp, checksum verified); to be added to the repo's `docs/` after Phase 1 merges. Result: 64 rows, 33 match the bots' claims in live code, 2 partly (the locals line is live but the "WOOKIE ALERT" alarm is dead code; Chapter 1 and 2 captures differ), 3 dead code only (Space Chili line, Blorp's 1997 joke, Zip's riddle), 1 file missing (story-options.html was never in the repo), 7 need a person or a test (collisions, bubble stacking, cone look, cone hiding while Mops), 14 process items skipped. Hermes's copy of the repo: `/Users/Shared/hermes-inbox/ssq-hermes/space-snack-quest`.
  **Superseded** as "to be added." The report is in the repo as `docs/FEEDBACK-CODE-CHECK.md`.
- Phase 1 (T5 to T12, kitchen and diner clarity) merged to `main` as PR #8 on 2026-11-07 morning after two independent reviews and a rework (the first build had made guards blind to Squatch while Mops was played; fixed so Squatch is hidden instead, with positive-control tests). 14 test suites. Every new on-screen line is in `reviews-2026-11-06/PHASE-1-LINES-FOR-BRIAN.md`. Deferred from Phase 1: why-lines for switches in Chapters 1, 3 and 4 (needs Brian's wording); playtest issue 9 (window and sink placement) is decision D12. Merge commit 9215e8b; Render deployed it and the live file at space-snack-quest.onrender.com matches the merged build (sha checked 2026-11-07 morning).
  Phase 1 merged is still true. The lines file in the repo is `docs/PHASE-1-LINES-FOR-BRIAN.md`. Chapter 1 switch why-lines shipped in PR #11. Chapters 3 and 4 switch why-lines are L27 and still need Brian's yes. D12 is L13: do not move the kitchen window or sink until the player says what looked wrong.
- Phase 2 (T13 to T18) built 2026-11-07 on branch `phase-2-structure`, PR #9 open: keys-only Chapter 2 play-through test, phone joystick test, dead engine removed (3,515 lines), source split into nine files by chapter with a rename tool, one `spot()` helper for every ring and trigger (135 rings tested), "VERB · thing" prompts and goal chips in Chapters 1, 3 and 4 (143 new lines in `reviews-2026-11-06/PHASE-2-LINES-FOR-BRIAN.md`). Independent review: structure sound; wording fixes (chip rule, "lure", two-action chips, non-thing captions, a stale-chip draw bug) being applied before Brian sees the lines and decides the merge.
  **Superseded.** "PR #9 open" and "being applied before the merge" are replaced by the later note in this same snapshot, and by K1: Phase 2 is merged. The lines file is `docs/PHASE-2-LINES-FOR-BRIAN.md`.
- Brian's phone playtest 2026-11-07 (`playtests/2026-11-07-brian-phone-playtest-ch1.md`): keep and reuse the zoom-in card technique for key ideas (new rule); shrink the Reset section button and show it big only when stuck; the YOU tag overlaps the sound icon, so set one HUD zone rule with an overlap test (folds into T21, Phase 3).
  The playtest note is in the repo at `docs/playtests/2026-11-07-brian-phone-playtest-ch1.md`. "Show Reset big only when stuck" is **Superseded** by K7 (Reset stays small; a hint shows instead). The zoom-in card is K19. The YOU tag is removed (K4).
- Phase 2 merged to `main` as PR #9 on 2026-11-07 about 12:30 (final branch commit 89dd2a0, with Brian's four chip edits, the Nov 2 spine restored as `docs/original-story-spine.md`, and the chip audit); Render deploy confirmation was in progress at this note. Phase 3 started right after on branch `phase-3-fairness-hud` (one capture rule everywhere, face circles and small ↺ reset, HUD zones with overlap test, stall hint, kitchen warning and "They lost you.", tap to walk with the bubble rule, feel fixes, zoom-in cards for first hide and first switch).
  Phase 2 merged is still true. "Render deploy confirmation was in progress" is **Superseded** by the next note: the deploy was confirmed.
- Phase 2 deploy confirmed live (sha match, 2026-11-07 afternoon). Phase 3 built on `phase-3-fairness-hud`, PR #10 open, not merged; independent review found three blocking holes (restart late in the gas stop allows boarding without fuel; pump bots not sent home after a lure capture; the Chapter 2 keyboard route now caught once by Rusty with the test loosened to allow it) plus the phone chip row covering Gloop's window, COOK removed without Brian's call (being restored), and wording fixes; the rework is done and re-reviewed (all findings resolved; the cone test made deterministic). Merged to `main` as PR #10 (merge commit 1e84978) on 2026-11-07 at 17:14 PT and live: the served file matches the merged build (sha checked). All 24 suites pass. Live now has Phases 0 to 3. Open from Phase 3: in-picture text still under 14 px on a 375 px phone; Chapter 2's first switch keeps its old card; a bot seeing Mops is a shoo, not a lockup (decision D9); the phone HUD bar question (DECISIONS.md).
  "PR #10 open, not merged" is **Superseded** by the merge sentence in this same note. Phases 0 to 3 on `main` is still true, and the Chapter 1 pass (PR #11) is on `main` too (K1). Still open from this list: in-picture text under 14 px (K28). Chapter 2's first switch card is L5 (words owed). D9 shoo is L3, decided. The phone HUD question is **Superseded** by K14 (the bar stays).
- 2026-11-07 evening: Brian played Chapter 1 and found the night-out idea (D15) not built; it had been queued behind Phase 3. New way of working (DECISIONS.md): chapter by chapter, and "ready for play: Chapter N" means everything discussed for that chapter is in, with a short list of what is not. The Chapter 1 pass started at about 18:00 on branch `chapter-1-pass`: D15 (vent pull visible, brochure table and robot notice as the reason to go out, capture as consequence), switch cards with reasons for every Chapter 1 switch, the "A WOOKIE!" and slip-peek order fixes, the "You have me" lines, a Chapter 1 keys-only play-through test, and `docs/CHAPTER-1-LINES-FOR-BRIAN.md` with a "what Chapter 1 now has / still does not have" section for Brian to read before playing.
  "D15 not built" is **Superseded** by PR #11. The D15 story (notice sneak) is **Superseded** as the plan by S11 and S12 (the party). The live game still has D15 until the Chapter 1 rebuild. The way of working is W27.
- 2026-11-07 night: the Claude session restarted mid-pass and its clone was lost; the branch `chapter-1-pass` on GitHub holds two commits (651ca1e D15 night out; 1ad575e switch cards). A fresh clone is at the new scratchpad (`.../scratchpad/repos/space-snack-quest`) and the agent is finishing items 3 to 5 (order fixes and the "You have me" lines; the Chapter 1 play-through, vent, notice and switch tests; the lines file's "what Chapter 1 now has / still does not have" section) and the PR. Finished, reviewed and merged as PR #11 (merge commit ee59f4a) on 2026-11-07 at 23:11 PT; Render serves the merged build (sha checked). All 27 suites pass. Chapter 1 is "ready for play": everything discussed for it is in, with the short list of what is not at the top of `reviews-2026-11-06/CHAPTER-1-LINES-FOR-BRIAN.md` (vent numbers are first guesses; the lobby is harder because two watchers now see what their cones show; cones see through the new table and counter; a lobby catch restarts the night and costs the +250). Brian's rulings from the review are in DECISIONS.md. Next chapter pass: Chapter 2 (the Guardians-note flashback, D17 chore moments, the first-switch zoom card, D9 shoo versus lockup, chili versus coins), then Chapters 3 and 4 (D16, D18).
  PR #11 merged is still true. The lines file is `docs/CHAPTER-1-LINES-FOR-BRIAN.md`. "Chapter 1 is ready for play" described the game on `main` that night. The replot after that night (S2 onward) is the new Chapter 1, and it is not built yet. "Next chapter pass: Chapter 2..." as the immediate next build is **Superseded** in part by the pause note below and by K20 (only the room-walk fix and the hoof-stamp cut were OK'd). D17's cannot-fail rub is **Superseded** by L6. Chili versus coins is L4, and the gas half is **Superseded** in part by S3.
- Then, in order: his kid's replay recording of Chapters 1 and 2 on this build; D15 (Chapter 1 night out), D16 (Chapter 3 sense pass, then Chapter 4), D17 (chore mini-moments), D18 (travel scenes and optional mini-games); the nine spine departures and the switch why-lines in Chapters 1, 3 and 4. Work paused here on 2026-11-07 evening at 64% shared / 80% Fable so the week's credit is kept for those.
  **Superseded** as the work order. D15 shipped in PR #11. The pause was overtaken by the 2026-11-08 credit note below, which is itself **Superseded** in part by K20. Kid replay recordings are still open (O28).
- 2026-11-07 midday: Brian is away; the session runs unattended under the approvals in DECISIONS.md (merge Phase 2 when green; Phase 3 = one capture rule everywhere, phone HUD with face circles and small reset, kitchen warning and "they lost you", tap to walk with the bubble rule, feel fixes; new lines in approved shapes may merge, logged in a lines file). Credit at that point: all-models 53%, Fable 74%; stop line 75% / 85%. The chip audit against the Nov 2 spine is in the repo as `docs/CHIP-ARMATURE-AUDIT.md`: nine story departures with verdicts and three thin or doubled beats, held for Brian.
  Historical. The 85% Fable stop line is **Superseded** by W30 (90%). "Held for Brian" on each departure is **Superseded** by W27.
- Next: Brian's kid replays Chapter 2 on the new build (B1 recording); then Phase 2 (keys-only play-through test, phone tap test, delete the dead engine, split the file per chapter, ring equals trigger, captions in other chapters) and the 14 decisions, one at a time.
  **Superseded.** Phase 2 is merged. Kid replay of Chapters 1 and 2 is still open (O28).
- The plan is written (`reviews-2026-11-06/PLAN-2026-11-06.md`, 8 sections, 25 tasks T1 to T25, 14 decisions, three Hermes jobs). First wins T5 to T12 all target the kitchen and diner section from the 2026-11-06 kid playtest. Phase 0 (test harness, readable source, CLAUDE.md, scene link and state readout) comes first.
  The plan is in the repo as `docs/PLAN-2026-11-06.md`. "Phase 0 comes first" is **Superseded**: Phases 0 to 3 and the Chapter 1 pass are already merged.
- The review docs are untracked in the scratchpad clone on Brian's MacBook as of this note; they need a commit to a branch so they are not lost.
  **Superseded.** The review docs are on `main`.
- Three backlog claims point only at dead code (Chapter 1 "WOOKIE ALERT" alarm, Zip's "I have rings" riddle, Blorp's 1997 joke); the docs call two of them playable.
  Kept as a warning from that day. Zip's beat is a riddle, not songs (L17). Blorp's pea gag stays parked (L9). The 1997 joke was already dead code in the Hermes check.
- Credits: Grok Bot and the Movement Institute Cursor seat are at 100% of weekly usage until 2026-11-08. Claude Ultra plan: Fable week around 45% used, resets 2026-11-13. Work goes to cheaper models and Hermes (local Qwen on the Mac mini) where mechanical.
  **Superseded** as a current credit report. The later rule is W30, and what "Nov 13" means now is Open (O20).
- Brian's MacBook startup disk had under 1 GB free on 2026-11-06; agents and transcription fail without space.

## Next step
Run the planner, then pick the first win in the kitchen and diner section.

**Superseded.** The live next list is the "Next" section at the top of this file.

## Paused 2026-11-08 at the credit line
Chapter 1 is live and "ready for play" (PR #11, ee59f4a). The shared pool was at 73% of the 75% line, so Brian chose to wait for the Thursday 2026-11-13 reset before the Chapter 2 pass. Until then: Brian plays and records Chapter 1 and 2; the recordings go on his Desktop and are transcribed locally (free). Cursor's allowance is back 2026-11-08 and can build from the plan's briefs if Brian wants progress before Thursday. The Chapter 2 pass brief: the Guardians-note flashback (core), D17 chore moments, the first-switch zoom card, D9 shoo versus lockup, chili versus coins; then Chapters 3 and 4 (D16, D18).

**Superseded** in part by K20. Brian OK'd the room-walk fix (P2) and the hoof-stamp line cut (P3) on 2026-11-08. Those are the only Chapter 2 code changes launched. What "Nov 13" means now is Open (O20). Recordings of Chapters 1 and 2 are still open (O28). The Guardians flashback's place is Open (O18). D17's rub moment is **Superseded** by L6. Chili versus gas is L4, and the gas half is **Superseded** in part by S3.
