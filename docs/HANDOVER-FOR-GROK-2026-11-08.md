# Handover for the Squatch Game bot, written 2026-11-08

## 1. What this document is and who it is for

This is the full handover of "Sneaky Sasquatch: Space Snack Quest" from Brian's Claude Code sessions (2026-11-06 to 2026-11-08) to the Grok bot called "Squatch Game", which built the game from 2026-11-02 to 2026-11-06.
You have none of the context from those sessions. Read this file first. Section 5 lists every comment Brian made and where it landed.

## 2. Where everything lives

**The repo.** `catolandingham/space-snack-quest` on GitHub. It is private. The branch `main` is the truth. If a doc and `main` disagree, `main` wins.
- The source is `src/game/*.js` (nine files, split by chapter). `index.html` is build output. Never edit it by hand. `npm run build` writes it.
- `npm test` runs 27 test suites. One suite alone: `node tests/<name>.mjs`. Tests run on Brian's Mac with headless Chrome and cost no Grok or Cursor credit.
- A scene link opens any checkpoint: `index.html?ch=2&phase=wash1&debug=1`. `?scene=P3` opens a scene. `debug=1` shows a state strip.
- Find code by quoted text, not line numbers. Rename things only with `npm run rename`.
- Rules for every agent are in `CLAUDE.md` (short) and `docs/REVIEW-RULES.md` (Brian's 23 rules, word for word).

**The live site.** `space-snack-quest.onrender.com`. Render deploys it by itself every time `main` changes. Merging to `main` therefore publishes to players. The rule is: no merge without Brian's yes written in the pull request.

**The Drive folder.** `Wyttmab Drive / My Drive / Space Snack Quest /`. It holds:
- `STATE.md`: the live state and open items. `DECISIONS.md`: every dated decision with its reason. Read both before you start. If you cannot open the Drive, read the snapshots in the repo at `docs/project/STATE-2026-11-08.md` and `docs/project/DECISIONS-2026-11-08.md` (copies taken 2026-11-08; the Drive files are the live ones).
- `playtests/`: Brian's three playtest files. The 2026-11-07 phone note (`2026-11-07-brian-phone-playtest-ch1.md`) is here and in the repo's `docs/playtests/` since 2026-11-08.
- `reviews-2026-11-06/`: copies of the review docs, `FEEDBACK-CODE-CHECK.md` (the 64-row check Hermes made; also in the repo's `docs/` since 2026-11-08) and `CHIP-ARMATURE-AUDIT.md`.
- `source-snapshots/`: the old TypeScript from 2026-11-02. It is the old engine, so it is reference only.

**The Grok archive.** `docs/grok-archive/` in the repo holds every Grok thread word for word, with `FEEDBACK-INDEX.md` (Brian's asks, numbered A1 to A27, B1 to B29, C1 to C8).
Brian's rule (2026-11-06): the archive was made once. The Grok threads are not re-read. Use the index and this file.

**Docs in the repo (`docs/`).**

| Doc | What it is |
| --- | --- |
| `README.md` | Table of every doc, plus the capture rule, the Reset table and the kitchen layout |
| `REVIEW-RULES.md` | Brian's 23 review rules and the zoom-in card technique |
| `PLAN-2026-11-06.md` | The plan: phases, tasks T1 to T28, decisions D0 to D14, and section 5 that maps each feedback row to a task |
| `CODE-REVIEW-2026-11-06.md` | How the code was laid out on 2026-11-06 and what blocked progress |
| `DESIGN-CHECKLISTS.md` | Checklists for scenes and prompts (Ron Gilbert's rules and usability checks) |
| `MASTER-BACKLOG.md` | Status of every backlog item and every PR |
| `STORY-DECISIONS.md` | Eight open story questions, all still pending |
| `story-bible.md` | The Chapter 2 kitchen canon (Mops cooks, Squatch washes) |
| `original-story-spine.md` | Brian's 2026-11-02 story spine, scene by scene. A first pass, not binding |
| `CHIP-ARMATURE-AUDIT.md` | Every goal chip placed on the seven beats, with nine departures from the spine and a verdict on each |
| `PHASE-1-LINES-FOR-BRIAN.md`, `PHASE-2-...`, `PHASE-3-...`, `CHAPTER-1-LINES-FOR-BRIAN.md` | Every new on-screen line, with one other way to say it, and each file's list of what is not finished |
| `HERMES-GO.md` | The first job given to Hermes |
| `playtests/` | Brian's two transcribed recordings and the 2026-11-07 phone note |

**Words used in this document.**
- **Chip**: the goal line at the top of the screen, such as "Squatch: wash the dishes at the sink".
- **Cone / ring**: a cone is the drawn area a watcher can see. A ring is the glowing circle on the floor where an action works.
- **Checkpoint**: the place a section restarts after a catch or a reset.
- **Armature**: the one sentence the whole story proves (see section 3).
- **Spine / beat**: the spine is Brian's written story. A beat is one of seven steps: Once upon a time, Every day, Until one day, Because of that, Because of that, Until finally, Ever since.
- **Lines file**: a doc listing every new on-screen line so Brian can change the words.
- **PR**: a pull request, one batch of changes on GitHub.
- **Cursor**: the cloud coding agent you used. **Hermes**: a free local model on Brian's Mac mini, for mechanical jobs. **Claude**: reviewer and judgment work.
- **Soft lock**: the player is stuck with no way forward except a restart.

## 3. How the work was thought about

**The core.** The armature is "Home is where love doesn't have to hide." The story is about hiding versus being seen, and love that hides. The seven beats must be clear and in order, in the whole game and again inside each chapter.

**The spine is a first pass.** Brian's 2026-11-07 ruling: the Nov 2 spine is not binding. A departure from it is judged only by consistency with the core. Claude settles departures by that test. Brian does not rule on each one.

**Brian's review rules in one paragraph.** Teach one idea at a time, with one speech bubble at a time and a pause before the next idea. Name nothing before it has been shown on screen. Clarity beats cleverness: a 10-year-old must get it, and a short cutscene beats a clever clue. Show, don't tell: draw the dirty dish and the paw, never describe them in a caption. Every scripted line is word for word from the spine, and any new or changed line needs Brian's yes. Everyone who can see Squatch reacts, every sighting has a felt result, and nothing auto-advances. The full text is in `docs/REVIEW-RULES.md`.

**The chip rule (Brian, 2026-11-06).** The first time a mechanic appears, the goal chip names the step. Afterwards the chip names only the goal. Why: the player discovers the method, and the chip never gives it away twice.

**"Ready for play: Chapter N" (Brian, 2026-11-07).** It means everything discussed for that chapter is in the build, followed by a short list of what is not. Work goes one chapter at a time. Chapter 1 is "ready for play" as of PR #11.

**Working rules.**
- One capture rule everywhere: seen, alarm, security comes, a few seconds to hide. Hidden gives "They lost you." Caught gives the LOCKUP card naming who saw Squatch and where, then the section restarts. Do not add a second capture path.
- What you see is what sees you. A ring and its trigger come from the same spot entry (`spot()`), so the glow equals the range. A drawn cone equals the area that detects, and a test checks it.
- Every new on-screen line goes into a lines file for Brian, with one other way to say it.
- An independent reviewer agent reads every diff against `CLAUDE.md`. The author never grades the work.
- Tests prove claims. Add a test with each fix. A text match alone never counts as a pass. Brian's recordings judge how it plays. Nobody drives a browser by hand to playtest.
- Difficulty changes (wider cones, tighter timers) wait for Brian's yes.
- Before you say "pushed", check the remote hash (`git ls-remote`). Agents reported pushes that had not happened.
- Every PR updates `README.md` and `docs/MASTER-BACKLOG.md` and says "Docs match main: yes."

## 4. What has shipped, by merged pull request

**#7, Phase 0: tools (merged 2026-11-06 21:35, 21b9c4a).** The player sees no change.
- The readable copy of the live build became the real source in `src/`, and `npm run build` writes `index.html`.
- A proof showed the new build is the same program as the old one.
- `npm test` runs every suite on Brian's Mac.
- `CLAUDE.md` and `docs/REVIEW-RULES.md` were added.
- The scene link and `debug=1` state strip were added.

**#8, Phase 1: kitchen and diner clarity (9215e8b, 2026-11-07 morning).**
- The goal chip says who acts and what to do in every Chapter 2 step ("Squatch: wash the dishes at the sink").
- Every switch between Squatch and Mops shows a card with the reason ("You are MOPS now..."), and a doorway line says "Mops goes inside."
- Speech bubbles sit over the speaker, one at a time, with an ear icon for voices in another room.
- Every Chapter 2 action reads "VERB · thing" in text a phone can read; the soup bowl rides on Mops's head; the help line names only controls that work.
- No dead ends (BACK · kitchen); Mops is shooed with no lockup; the LOCKUP card names who saw Squatch and where.

**#9, Phase 2: structure (25c1933, 2026-11-07 about 12:30).**
- The dead second engine (3,515 lines) was removed and the source split into nine files by chapter.
- Every glowing ring is now drawn from the spot that decides where the action works (135 rings tested).
- Chapters 1, 3 and 4 got "VERB · thing" labels and goal chips (143 new lines).
- The YOU: SQUATCH tag is gone. Sound starts on any first touch and shows "Sound is blocked by this browser." when a browser keeps it off.
- Keys-only and phone-tap tests play Chapter 2 start to finish; Brian's four chip edits and the chip audit landed.

**#10, Phase 3: one capture rule, phone HUD, tap to walk (1e84978, 2026-11-07 17:14 PT).**
- Every chapter uses the same capture rule. No catch takes stars; the chapter bonus is "Never caught! +250".
- The HUD is page text in fixed zones (chapter and small ↺ top left, goal chip top center, face circles top right). On a phone it is a bar above the picture.
- Tap the picture to walk there (a tap on a bubble still means "next"). A stuck player gets a hint after 60 seconds.
- The kitchen window warning shows for 2.5 seconds; drawn cones show the area that really sees.
- Zoom-in cards teach the first hide and the first switch. The Chapter 2 keyboard route is never caught.

**#11, Chapter 1 pass (ee59f4a, 2026-11-07 23:11 PT).**
- The night out has a goal: a brochure table holds a notice, "ROBOT JANITORS COMING."
- A vent in the lobby shows ripples and a fur tuft as a warning before the alarm.
- Every Chapter 1 switch (S9 to S11) says why. The "You have me" lines are in. Nobody says "robot" before the notice, "Wookie" before the flashback, or the hangar code before Mops does.
- The morning PA report follows what really happened on the night out.
- A test plays the whole chapter with keys (`tests/ch1-playthrough.mjs`).

## 5. The complete register of Brian's comments

Status words: **done** (in `main`), **partly** (some is in, the rest is named), **held** (waits for Brian or a later pass), **won't do** (with the reason). "Hermes" means the code check in `FEEDBACK-CODE-CHECK.md`: it confirms a line of text exists in live code, not that the game behaves right.
"PR" numbers are in section 4. "T" numbers are tasks in `docs/PLAN-2026-11-06.md`. "Plan D" numbers are the plan's decisions D0 to D14 (section 6).
A note on numbering: `DECISIONS.md` has two different things called D1. The first entry (2026-11-06) is the source-of-truth choice, called plan D0 here. The capture rule is D1 in all other places.

### 5a. Brian's Grok asks, section A (27 rows, typed messages in the Squatch thread)

| Id | Brian's words (short) | What was done | Status |
| --- | --- | --- | --- |
| A1 | "Can we put it in a private one?" | Repo made private 2026-11-05 | done |
| A2 | "This will just be for my grokbot, not the team right?" | Account matter, no game task | won't do (not game code) |
| A3 | "I see cloud agents error. Are you able to deal with that?" | Replaced by the verify rule in `CLAUDE.md` (T3, PR #7) | done |
| A4 | "easier for me to review within this app versus GitHub" | `CLAUDE.md`: report to Brian in plain English in chat | done |
| A5 | "I thought there was some additional items" | Split into B9 to B15 below | done (see those rows) |
| A6 | "build this all in... ideally parallel" | Parallel only where files do not overlap (plan section 8) | done |
| A7 | Locals still afraid after Saturn, "think about implications for gameplay" | Gas-stop line live ("Locals still fear Sasquatches..."); old alarm text was dead code, removed in PR #9. Hermes: partly. Showing it, not telling, is T28 | partly (T28 held) |
| A8 | "squatch getting more comfortable in his own skin" | Shown in dialogue ("Trash cans. I'll use them on purpose."). Mechanics unchanged | done |
| A9 | "different funny ways of being captured" | Four vignettes live (Hermes: match). PR #8 puts a plain cause line before each joke. "Pen's open" became "Lockup's open." | done |
| A10 | "play the game live and offer realtime commentary" | Narrated recordings, plus the `debug=1` state strip (PR #7) | done |
| A11 | "should we do first chapter now" then "A" (merge) | PRs 1 to 3 merged (32156c7) | done |
| A12 | "tell me how to reconnect" (Render; the bot read his Gmail) | No game task. Brian should review that account access | won't do (account matter) |
| A13 | "take one idea at a time, and do it all the way" | Review rules 6 and 18; shape of the plan | done (as a rule) |
| A14 | Build what does not conflict, hold the rest | PR #4 six items live (Hermes: match). Chef hat needs an eye in the replay | done (replay checks the chef hat) |
| A15 | "kitchen window needs to be way bigger" | Superseded by kitchen C. Raised again 2026-11-06 (N9) | partly (see N9) |
| A16 | "How can we do a more comprehensive review?" | Code review, design checklists, Hermes check, the plan | done |
| A17 | "Do we have a single source of truth?" | `MASTER-BACKLOG.md`, the repo as truth, `STATE.md` in Drive | done (kept in sync each PR) |
| A18 | "an equivalent of when we hit the side of a pinball table" | Reset section; since 2026-11-07 a small hold-to-use ↺ plus a stall hint | done |
| A19 | "Go with new spine" then "just for the kitchen" | `story-bible.md`; other chapters stay on the original spine | done |
| A20 | "Show me options and try to give visuals" | `story-options.html` never reached the repo. Decisions are now in plain words in section 6 | won't do (file missing; replaced) |
| A21 | "How can you look at it with fresh eyes?" | Three layouts shown; led to kitchen C | done |
| A22 | "I need a lot more details... I don't understand that." (TV question) | Rewritten as plan D2; still unanswered | held (Brian) |
| A23 | "I kind of like C... Window could be a bit smaller... spices aren't quite right" | Kitchen C built and passed a visual check. Smaller window not confirmed | partly (replay) |
| A24 | "Hows it going??" / "What's next??" | `CLAUDE.md`: no merge without Brian's yes in the PR | done |
| A25 | "keep going, what's next?" (fresh-player Chapter 1 audit) | Crate hide and lunch cues: T17, T18 (PR #9) and the zoom-in card (PR #10). `ch1-playthrough` reaches the ship (PR #11) | done |
| A26 | "Manager office seems really strangely placed" | Not built. Plan D8 and T27: move it beside storage | held (Brian) |
| A27 | "are we continuing with other tests??" | Tests run locally for free (PR #7); 27 suites | done |

### 5b. Brian's Grok asks, section B (29 rows, the 24-minute recording as relayed by the bots)

| Id | Brian's ask (short) | What was done | Status |
| --- | --- | --- | --- |
| B1 | Skip button and progress dots | Present for flashbacks. Skip for any seen cutscene is plan D14 | held (D14) |
| B2 | Collision snags near the G sign and bucket | Fixed in PR #1 of the old numbering; recheck in replay | done |
| B3 | Intermittent Hide | Ring equals trigger (T17, PR #9); "HIDE · crate" (T11, PR #8) | done |
| B4 | Stacked bubbles, layout jump | One bubble at a time, ambient chatter queued (T9, PR #8) | done |
| B5 | Cone hierarchy, character size | Cones drawn as the real sight area (PR #10). Size left as is unless Brian asks | partly (size held) |
| B6 | Ganitor lines, song preview, airlock egg | Present (Hermes: match). Egg not seen by eye | partly (replay) |
| B7 | Rusty capture softlock | Fixed; one capture rule (PR #10); keyboard route never caught | done |
| B8 | Rusty sight glitches, pump cover | Fixed with tests. On 2026-11-07 Brian found Rusty too narrow (row E22) | partly (E22) |
| B9 | Low-fuel clarity | TANK EMPTY / FULL banner (Hermes: match); phone HUD bar (PR #10) | partly (in-picture text under 14 px on phones) |
| B10 | Mops walks to the door and presses action | Present; "Mops goes inside." line (T6, PR #8) | done |
| B11 | No cones while Mops | Present. Conflicts with the spine's soup sneak: plan D9 | held (D9) |
| B12 | Pump bots show cones | Present | done |
| B13 | Seen, security, hide, lock up, restart the section | Every chapter, PR #10 (D1 capture) | done |
| B14 | Kitchen rewrite (cook faints, Mops cooks, Squatch washes) | Canon in `story-bible.md`, live. The cook's "A WOOKIE!" plays before she is drawn | partly (that order is an open row) |
| B15 | Hunger and visible prices | Soup 30, tank 30; "BUY · soup 30" (T11) | done |
| B16 | Soup on Mops's head | Bowl rides the head (T10, PR #8) | done |
| B17 | Oven and ticket logic | COOK still pays nothing and cooks no ticket. Plan T22 asked Brian to pick: make it matter or remove it | held (Brian picks) |
| B18 | Keep the mop handoff | Live | done |
| B19 | Paw and sponge scrub | Live. D17 would make it hands-on | done (D17 held) |
| B20 | Roll instead of duck | Live (Hermes: no DUCK left) | done |
| B21 | Slow hoof-stamp scene | Live (Hermes: match); look in replay | partly (replay) |
| B22 | Stop post-dock arguing | Plan D2: still open which exchange he meant | held (D2) |
| B23 | Exit, boarding, caption flow | Live; caption moved to the ship. Boarding clarity to be seen | partly (replay) |
| B24 | Remove "Just like that first night" | Gone (Hermes: absent) | done |
| B25 | Clear Gloop sight cone | Window warning visible 2.5 s (T20, PR #10) | done |
| B26 | Arrival warning about locals | Same as A7 | partly (T28 held) |
| B27 | Mops whisper is fine | Left as is | done (no change) |
| B28 | Coin per dish | Jar is 30 per finished wash set. Open: chili versus coins | held (Ch2 pass) |
| B29 | Crib hop, dialogue controls, audio | Present (Hermes: match); not heard by ear | partly (replay) |

### 5c. Brian's Grok asks, section C (8 rows, story decisions Brian has not made)

| Id | Question | What was done | Status |
| --- | --- | --- | --- |
| C1 | TV hiding beat | Plan D2: keep the TV, cut the crate argument after "Go watch the dock" | held (D2) |
| C2 | What are stars for | Plan D1 (capture): finds-only score, no loss when caught, +250 kept as "Never caught!" (PR #10) | done |
| C3 | After soup and gas | Plan D3: done after gas; old chili line removed with the dead engine (PR #9) | held (chili versus coins) |
| C4 | Blorp pea gag | Plan D4: park it until Chapter 2 plays clean | held |
| C5 | Guardians reveal | Ruled core by Claude 2026-11-07: a flashback shows the player that Mops wrote the note. Not built yet | held (Ch2 pass) |
| C6 | Zip's songs | The riddle was in dead code (removed). Chapter 3 gets the D16 sense pass | held (D16) |
| C7 | Harry dance | Plan D7: keep it small, four presses with Mops's "Baaa" | held |
| C8 | Chapter 1 capture versus Chapter 2 | Unified, PR #10; the lobby too, PR #11 | done |

Sections D (Ostrich game) and E (G Bot) of the index belong to other repos. One lesson from D36 was reused here: never show an outcome without the event that caused it (review rule 13).

### 5d. The 2026-11-04 recording, Chapter 2 (43 rows, P1 to P43)

Source: `docs/playtests/2026-11-04-game-building-session-chapter-two.md`. Times are audio times.

| Id | Time | Brian's words (short) | What was done | Status |
| --- | --- | --- | --- | --- |
| P1 | 00:30 | Rusty's capture "doesn't really make sense" | One capture rule and cause card (PR #8, #10) | done |
| P2 | 00:45 | "total glitch when he gets stuck" | Fixed; reset ↺ (PR #10) | done |
| P3 | 01:37 | Fuel gauge placement confusing | TANK banner at top right; phone bar (PR #10) | partly (phone text) |
| P4 | 01:44 | Rusty "keeps totally glitching what he sees" | Fixed with tests | done |
| P5 | 02:04 | Goat "does a weird jump" going inside | "Mops goes inside." line (PR #8) | done |
| P6 | 02:27 | Better way to show low fuel | Banner and chip | partly (phone text) |
| P7 | 02:56 | "Rusty looks like Mario" | Plan D13: swap the red "R" cap for a grease cap and fuel-drop badge | held (Brian) |
| P8 | 03:06 | Goat should "walk in the door and press action" | Present (B10) | done |
| P9 | 03:15 | No sight lines while the goat | Cones hidden while Mops. Plan D9 holds the soup-sneak stretch | partly (D9) |
| P10 | 03:52 | Why whisper "kitchen has a back door" when inside | Brian then said "that's fine" (B27) | won't do (he accepted it) |
| P11 | 04:08 | "How did you switch back? You just hit next?" | Switch cards with a reason (T6, PR #8); face tap (PR #10) | done |
| P12 | 04:16 | Hiding behind the pump is logical, but Rusty sees him | Fixed with tests | done |
| P13 | 05:19 | Slipping under Rusty's sight "feels like a glitch" | Props block the space under the sprite | done |
| P14 | 06:02 | Scrub shows a dirty dish and paw as sponge | Live (B19) | done |
| P15 | 07:19 | Gloop sees Squatch "but she's okay with it" | Everyone who sees him reacts; one capture rule | done |
| P16 | 07:44 | On landing Mops says locals are less worried, but be careful | Line live (A7); showing it is T28 | partly |
| P17 | 08:29 | Window, "done" line, spices, door sizes off; half of Gloop shows | Kitchen C. Window and sink raised again as N9 | partly (D12) |
| P18 | 09:32 | Ducking looks weird; roll into a ball | Roll live | done |
| P19 | 10:13 | Gloop saw him, "wasn't that concerned", then heard the announcement | One capture rule | done |
| P20 | 10:30 | Every sighting sends security; hide and they leave; caught restarts the section | PR #10, every chapter | done |
| P21 | 11:37 | Pump bots have no vision lines | Cones drawn | done |
| P22 | 11:47 | Orders window faces out with no cook behind it | Cook added (canon) | done |
| P23 | 12:19 | Cook sees him and faints; Mops cooks in a chef hat; Squatch washes | Canon, live | done |
| P24 | 13:06 | Pump bots still need sight lines inside | Cones drawn | done |
| P25 | 13:26 | Mops out front "scared, just like that first night" no longer fits | Line removed | done |
| P26 | 14:17 | "Gas money or soup" makes no sense | Hunger reason and prices shown | done |
| P27 | 15:35 | Stomach rumbles, so Mops fetches food | Live | done |
| P28 | 16:07 | Show coins, gas price, food price; coin per dish? | Prices on button (T11). Coin per dish still open | partly (Ch2 pass) |
| P29 | 16:48 | Coins on Mops's head, then soup; "not obvious it is soup" | Bowl with steam on the head (T10) | done |
| P30 | 17:12 | LEAVE SOUP label "off to the side" | Moved in kitchen C | done |
| P31 | 17:42 | Slow scene of the hoof making the paw-print stamp | Live (B21); look in replay | partly (replay) |
| P32 | 18:39 | After "go watch the dock", no reason to keep arguing | Plan D2 | held (D2) |
| P33 | 18:46 | Cut back to the janitor in the diner is "super confusing" | Room-change line (T6); D2 | partly |
| P34 | 19:13 | "Tickets are piling up, goat": why would tickets matter? | Cook canon explains tickets | done |
| P35 | 20:22 | Likes the mop handoff; the janitor can stay in the kitchen | Live | done |
| P36 | 20:53 | Cook wakes after the rumble, screams, runs out; Gloop thinks the janitor did it | Live | done |
| P37 | 21:40 | Purple "ball" looks right at Squatch, unconcerned | Watcher drawn as Gloop with a cone (T20) | partly (replay) |
| P38 | 22:15 | "Should there be a button to switch back and forth?" | Plan D10 said no free switch. Since PR #10, tapping a face switches when a switch is possible | done |
| P39 | 22:40 | EXIT: red door says EXIT but you go to the side | Trigger sits at the door it rings (T17, PR #9) | partly (replay) |
| P40 | 22:50 | "Why you're having this thing from the crate" (the bots' crate business) | Plan D2 | held (D2) |
| P41 | 23:34 | Pump bot trying to fuel Squatch is weird; "report him or fuel him?" | Line exists | done |
| P42 | 23:58 | Behind the crates, or boarding the ship? | Boarding to be seen in replay | partly (replay) |
| P43 | 24:16 | "Next stop" text on the left of the screen | Moved to the ship | partly (replay) |

### 5e. The 2026-11-06 recording, kitchen and diner (13 rows, N1 to N13)

Source: `docs/playtests/2026-11-06-game-interface-and-navigation-issues.md`. A young player, 11 minutes, reset about eight times.

| Id | Time | Brian's words (short) | What was done | Status |
| --- | --- | --- | --- | --- |
| N1 | 00:08 | Speech bubbles at the bottom while the speakers are at the top | Bubbles over the speaker (T9, PR #8) | done |
| N2 | 00:27 | "Walk to the diner door" is confusing; tapping it seems to bring the pump bots | Chip names who acts (T5); tap to walk (PR #10) | done |
| N3 | 01:15 | "Oh, wait, you switched to the goat? How do you switch?" | Switch card with reason (T6) | done |
| N4 | 01:50 | Soup "like an inch above his head" | Bowl rides the head (T10) | done |
| N5 | 02:40 | "How do I get back there?" (hide behind me) | "HIDE · crate", chip names the crate, zoom-in card (T5, T11, PR #10) | done |
| N6 | 03:29 | Mops appears in the other room; bubbles over blank air; "former janitor's shoe"; caught, loses points, no way out | Room-change line, bubbles at the speaker, no capture while Mops, no star loss | done |
| N7 | 05:43 | Both characters in the diner "and there's no way to get out" | No dead ends (T7) | done |
| N8 | 06:08 | "Walk to the diner door" in the kitchen; "All of a sudden I'm locked up" | Correct chip per step; LOCKUP card says why (T5, T8) | done |
| N9 | 06:42 | "The window and the sink being in the wrong spot again" | Not touched. Plan D12: ask the player what looked wrong, then a recording | held (Brian) |
| N10 | 07:01 | "Do I do that as Sasquatch or Mops? What's that thing on Mops' head?" | Chip names who acts; bowl reads as soup | done |
| N11 | 07:10 | As Mops "there's nothing to do and no way to switch back" | Forward action in every phase (T7) | done |
| N12 | 08:38 | Found the dish job "just by luck" | Chip and "WASH · sink" (T5, T11) | done |
| N13 | 10:40 | Locked up after a dish; "counters close" means nothing | LOCKUP card names who and where; joke now "Counter's closed. Lockup's open." (T8) | done |

### 5f. The 2026-11-07 phone playtest notes (7 rows)

Source: Drive `playtests/2026-11-07-brian-phone-playtest-ch1.md`, Chapter 1 opening on his phone.

| Id | Brian's words (short) | What was done | Status |
| --- | --- | --- | --- |
| M1 | "I love the zoom in on 'this is Squatch'. We can and should use this technique" | Rule in `REVIEW-RULES.md`. Cards for the first hide and first switch in Chapter 1 (PR #10). Chapter 2's first switch keeps its old card | partly (Ch2 pass) |
| M2 | Reset button too big for something rarely needed | Small hold-to-use ↺; the stall hint appears after 60 seconds, not 30 (PR #10) | done |
| M3 | YOU tag overlaps the sound icon; "think about a universal and consistent rule" | HUD zones and `tests/hud-layout.mjs` (375 and 1100 wide, eight states). Sound sits under the picture (PR #10) | done |
| M4 | "Is YOU: SQUATCH really needed?" (show only where both play) | Superseded by M5 | done (superseded) |
| M5 | Remove the YOU tag (decision 2026-11-07) | Gone in PR #9; face circles answer who and how to switch (PR #10) | done |
| M6 | Sound is intermittent on iPhone in Brave | Audio starts on any first touch (commit 62f8778, PR #9) | done |
| M7 | Sound works in Safari, silent in Brave until Shields is off | Not a game bug. The speaker shows "Sound is blocked by this browser." | done |

### 5g. Brian's chat comments with Claude, 2026-11-06 to 2026-11-08 (34 rows)

These are the decisions in `DECISIONS.md` and the rulings from the Chapter 1 review. `DECISIONS.md` records them in Claude's words, so the quotes are short and may not be his exact phrasing. The exact chat is in the Claude session transcripts.

| Id | Date | Brian's comment (short) | What was done | Status |
| --- | --- | --- | --- | --- |
| E1 | 11-06 | The game's truth is the GitHub repo, not the Grok chat; archive Grok once | `docs/grok-archive/`; threads not re-read | done |
| E2 | 11-06 | No browser-driven playtests by Claude (compute cost) | `CLAUDE.md`: tests guard, recordings judge | done |
| E3 | 11-06 | Cut work early only at high risk of running out of credit | Standing rule; see E18 and E32 | done |
| E4 | 11-06 | Plan D0: the readable copy becomes the real source | PR #7 | done |
| E5 | 11-06 | Merge Phase 0 | PR #7, 21b9c4a | done |
| E6 | 11-06 | Chip rule: first appearance names the step, then only the goal | Applied in chip tables and the chip audit; his four chip edits in 89dd2a0 | done |
| E7 | 11-06 | Counter action reads ASK · for work, not ORDER · counter | PR #8 (row 11.9) | done |
| E8 | 11-06 | Joke "Counter's closed. Lockup's open." (his son did not know "pen") | PR #8 | done |
| E9 | 11-07 | Merge Phase 1 once the confirmation run is green | PR #8 | done |
| E10 | 11-06 | The project folder is the Wyttmab Drive folder | `STATE.md` and `DECISIONS.md` live there | done |
| E11 | 11-07 | Remove the YOU: SQUATCH / YOU: MOPS tag | PR #9 | done |
| E12 | 11-07 | Reuse the zoom-in card to teach key ideas | `REVIEW-RULES.md` Techniques; `teach(id, at)` | done |
| E13 | 11-07 | Reset is a small ↺, never enlarged; a stuck player gets a hint | ↺ plus a 60-second stall hint that shows the method line (PR #10) | done |
| E14 | 11-07 | One HUD zone rule with an overlap test | `tests/hud-layout.mjs` (PR #10) | done |
| E15 | 11-07 | Face circles replace the YOU tag; tap to switch | Active face always shown, the other dim and shown only when a switch is possible. His own version kept both always on | done (trimmed version; he may prefer his own) |
| E16 | 11-07 | Merge Phase 2, then run Phase 3 unattended; new lines in approved shapes may merge and go in a lines file | PRs #9 and #10 | done |
| E17 | 11-07 | Held: the nine story departures, the switch why-lines for Chapters 1, 3 and 4, any difficulty change | Chapter 1 why-lines done (PR #11). Chapters 3 and 4 why-lines and departures still held | partly |
| E18 | 11-07 | Fable stop line is 90%, not 85%; all-models line stays 75% | In effect; see section 7 | done |
| E19 | 11-07 | D15: the night out gets a purpose and a visible hazard (vent, tuft, brochure notice; capture is a consequence) | PR #11, with two Claude adjustments | done |
| E20 | 11-07 | D16: Chapter 3 sense pass (seven-beat skeleton, a cause for each oddity, name Phobos on arrival), then Chapter 4 | Not started | held (queue) |
| E21 | 11-07 | D17: SCRUB · dish and MOP · pot become a few seconds of hands-on rubbing that cannot be failed | Not started. The old dish mini-game is in git history before commit 6f6a912 | held (queue) |
| E22 | 11-07 | Rusty's sight at the gas stop feels too narrow; the drawn cone must equal the detecting area | Cone equals detection with a test (PR #10). Widening is a difficulty change and waits for his feel after playing | partly |
| E23 | 11-07 | D18: ship-window travel scenes with a card, and optional tic-tac-toe or Connect 4 against the Ganitor robot | Not started. The travel card alone is the cheapest piece | held (queue) |
| E24 | 11-07 | Open question: phone HUD as a 126 px bar above the picture, or a translucent overlay | Bar shipped (PR #10); Brian has not chosen | held (Brian) |
| E25 | 11-07 | The Nov 2 spine is not binding; judge departures by the core; "ready for play" means all discussed items are in; chapter by chapter | Working rule (section 3) | done |
| E26 | 11-07 | (Claude's rulings, made by the test Brian set; no separate reply from Brian is recorded) keep "Everybody has somebody / You have me"; fix the "A WOOKIE!" and slip-peek order; toy rocket stays; the Guardians-note flashback is core | All in PR #11 except the flashback | partly (flashback is Ch2 pass) |
| E27 | 11-07 | Chapter 1 review: clicking a face is how you switch on a computer; no key needed | No key added | done |
| E28 | 11-07 | Chapter 1 review: the "ROBOTICS DELEGATION!" banner in the door-crack view stays | Kept | done |
| E29 | 11-07 | Chapter 1 review: no teaching card for the vent | None added | done |
| E30 | 11-07 | Chapter 1 review: make the fur tuft bigger and show it earlier so it works as a warning | Commit 77adbdb | done |
| E31 | 11-07 | Chapter 1 review: the S3 PA line must not report fur after a clean night | Commit 5aea76f; the report follows what happened | done |
| E32 | 11-08 | Wait for the credit reset (Thursday 2026-11-13, about 11:00 PT) before the Chapter 2 pass; the 75% line stays; Cursor may bulk build meanwhile | In effect; see section 7 | done |
| E33 | 11-07 | "We have no idea what ghost bonus is, and I don't think it's clear to the player either." Then: "Oh, it's the difference between being spotted versus being caught." | Named by what the code actually checks: only a catch clears it, so it is "Never caught! +250" with the reason line; each +100 award also says what it was for (Phase 3 lines 22.1 to 22.14). Whether the bonus should exist at all belongs with the stars decision (D2) | done; D2 still open |
| E34 | 11-07 | Plan D9 and D11 as scoped: D11 tap to walk with a bubble rule; D9 Mops seen is a shoo | D11 done (PR #10). D9 shipped as the recommendation and is listed for Brian to confirm | partly (D9 held) |

## 6. The queue, in order, with what each item needs from Brian

**Step 0. Brian plays and records.** Brian and his kid replay Chapters 1 and 2 on the current build. He records them on his Desktop and the recordings are transcribed locally. Nothing below starts without that feedback on the chapter it touches.

**Step 1. The Chapter 2 pass (after Thursday 2026-11-13).** Five parts.
1. The Guardians-note flashback. A "Years ago, on Stormtop..." scene shows the player that Mops wrote the note, while Squatch does not know. It follows the spine's FB3. It is core, because Chapter 4's "Then who were the guardians?" needs a secret the player holds. Needs: Brian's yes on the new lines, then it ships through a lines file.
2. D17 chore moments (E21). Needs: Brian's feel judgment after he plays it.
3. The first-switch zoom card in Chapter 2, to replace the old switch card. Needs: Brian's yes on the one line.
4. D9: when a bot sees Mops, is it a shoo (now) or a LOCKUP? Needs: Brian's answer.
5. Chili versus coins (row B28 and C3). Does Chapter 2 keep the coins-and-soup chain, or return to the spine's chili for Rustbucket? Claude's audit says the build has the stronger turn. Needs: Brian's call.

**Step 2. The Chapter 3 sense pass (D16), then Chapter 4.** First a one-page seven-beat skeleton inside the game's beat 5 that gives a cause for each oddity Brian hit: why the ship stops at Phobos, who Zip is and why he goes to Mars daily, what the temple is, why the rovers, what the lockup is there, how they leave. Needs: Brian reads the skeleton and says yes. Then one pass changes only text, labels and cards. The scene shapes stay. Name Phobos as the little moon by Mars on arrival. Chapters 3 and 4 also need switch why-lines (E17).

**Step 3. D18 travel scenes and optional mini-games.** Each leg gets a ship-window scene and one card saying where and why. It fills the empty "Every day" beat in Chapters 2 to 4. Mini-games are skippable, at most one per leg, and Mops speaks in them. Needs: Brian's yes on the card lines.

**Step 4. Open decisions.** Each has a recommendation in the plan. None has an answer from Brian yet unless noted.

| Plan D | Question | Recommendation | Status |
| --- | --- | --- | --- |
| D2 | TV hiding beat, and the crate argument after "Go watch the dock" | Keep the TV; cut the crate argument | held |
| D3 | After soup and gas | Done after gas | held |
| D4 | Blorp's pea gag | Park it | held |
| D5 | Guardians reveal | Follow the spine; the player learns in Chapter 2 | settled by E26 |
| D6 | Zip's songs | No song list; the riddle is the beat. Needs a riddle written, since the old one was deleted | held (D16) |
| D7 | Harry dance | Keep it small | held |
| D8 | Manager's office | Move it beside storage after the ring change (done in PR #9) | held |
| D9 | Mops and the kitchen bots | Shoo, and draw cones only in the soup sneak | held |
| D10 | A switch button | No free switch (later changed by E15) | settled |
| D12 | Kitchen layout again | Ask the player what looked wrong first | held |
| D13 | Rusty looks like Mario | Swap the cap for a grease cap | held |
| D14 | Skip for any seen cutscene | Allow Skip, keep "nothing auto-advances" | held |
| (new) | Phone HUD: bar or overlay | Bar shipped | held |

The nine spine departures in `CHIP-ARMATURE-AUDIT.md` carry verdicts. Resolved by E26: the heart lines, the "Wookie" order, the Moon Pie versus toy rocket, the slip peeks. Still Brian's call: the Chapter 2 ending (departure 2), ship versus van, "Health rules" for the pancake line, the long Ever since card, Blorp's pea, and "Bots! Go watch the dock." The audit also names a structural gap: beat 5 spans three chapters and beat 2 is empty in Chapters 2 to 4. D16 and D18 address both.

**Step 5. In-picture text on phones.** Speech bubbles, cards and "VERB · thing" labels are drawn in the picture and read at about 8 to 15 px on a 375 px phone. The HUD is already 14 px or more. Needs: its own pass, then Brian's phone recording.

**Other open rows.** The vent numbers are first guesses (circle 80 px, fur goes in after 1.5 s). The Chapter 1 lobby is harder than before because two watchers now see what their cones show, and cones still see through the new table and counter. The cook's "A WOOKIE!" plays before she is drawn. Plan tasks never built: T24 (save and Continue), T26 (write Brian's answers into `STORY-DECISIONS.md`), T27 (manager's office), T28 (show the locals' fear), H2 and H3 (Hermes lists). The `kitchen` test fails now and then on a loaded machine.

## 7. The credit situation, and what can safely be done before Brian is back

**Why work is paused.** The shared Claude pool stood at 64% on the evening of 2026-11-07 and 73% on 2026-11-08, against Brian's 75% stop line. Fable stood at 80% against a 90% line. Brian chose to wait for the weekly reset on Thursday 2026-11-13 (about 11:00 PT) before the Chapter 2 pass. Grok Bot and the Movement Institute Cursor seat were at 100% of their allowance until 2026-11-08. Cursor's allowance returns on 2026-11-08, and Brian said it may be used for bulk building.

**What a bot may pick up without Brian present.** Only tasks that add no new story words and change no difficulty. Work on a branch, add a test, get an independent review, update the docs, and do not merge. Merging waits for Brian's yes.
- T25: make `MASTER-BACKLOG.md` match `git log` (docs only).
- H3: export the as-built script, every line in play order per scene, into `docs/SCRIPT-AS-BUILT.md` (docs only; Brian reads it).
- Cook's order: draw the cook before she says "A WOOKIE!" (no new words).
- Test steadiness: stop the `kitchen` test failing on a busy machine.
- In-picture text size on phones: enlarge text with no wording change, checked by a new test at 375 px. Hold the merge until Brian sees it on his phone.
- T24 save and Continue is buildable, but it adds one new word ("Continue") on the title screen. Build it, put the word in a lines file, and wait for Brian's yes.

**What must wait for Brian.** Every item in steps 1 to 4 above, any new line, any cone, timer or speed change (including Rusty's width), any change to the spine's story, the manager's office move, and anything that touches the chapter order of beats.

**Before you start.** Read `STATE.md` and `DECISIONS.md` in the Drive folder, then `CLAUDE.md`. Ask Brian for anything this file lists as held. Write what you did into `STATE.md` and `DECISIONS.md` before you stop.
