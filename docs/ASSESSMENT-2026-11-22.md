# Assessment, 2026-11-22

Written by Snack Quest Chat (Claude Opus 5.5) on the Mac mini, Sunday evening. Brian asked: what can be built from what exists without needing much more from him, and can it get a lot better?

## The plain answer

Yes, Chapter 1 in v1 can get noticeably better without much from you, and v1 should be the base. About half of the open problems on the ranked list are things you already decided in writing; they are code work and need only your yes on a screenshot at the end. The other half need your eyes or your words: new pictures, a few looks, one or two picks, and wording.

What code alone will not do is make it fun. It will make Chapter 1 match your walkthrough and stop doing things you said not to do. Whether it then plays well is something only you (and your kid) can judge by playing. Every fix ends as "not yet played by a person" until you play it.

v2 is not a better base. It has a clearer picture on a phone and a homework page, but it has 2 tests (which cannot run on this Mac as written), it puts sight cones on ordinary guests against your Nov 16 rule, it has no goal bar, and in my play a guest caught Squatch while I was only tapping through a line.

## 1. Are the v1 tests a real guard?

**Count:** `npm test` on this Mac, 2026-11-22 at about 6:25 PM PT, on `main` at `4d1faa2`: **all 54 suites passed, 2,036 individual checks passed, 0 failed.** One known problem was logged and allowed: a tap on a spot behind furniture stops short (problem 2), 4 times. The kid robot reached the Chapter 1 score card in 485 seconds and was caught twice. The run took about 27 minutes. (The first try failed because this fresh copy had no installed packages; `npm ci` fixed that.)

**Mostly yes, with four holes.** At least 46 of the 55 suites open the real game in Chrome (through the shared helper `tests/game-page.mjs`) and check what happens on screen or in the game's state after it runs. The other 9 I did not open. About a dozen suites also match text in the source code, but in each case that is a small part of a bigger suite.

The five I read closely:

| Test | What it really checks | Verdict |
| --- | --- | --- |
| `ch1-kid-play.mjs` | Plays Chapter 1 at phone size with real touch taps, from the first screen to the score card, and measures what a kid would hit (button size, page jump, ring on Squatch, taps that stop at furniture, errors). | Behavior. The best test here. But it steers by reading the game, dodges cones it can see, skips the three party buttons (SNAG, SUCK, STAND), and lets anything on its KNOWN list pass. So passing means "a careful robot can finish", not "a kid will". |
| `ch1-playthrough.mjs` | Runs the whole Chapter 1 story to the score card, checks 48 actions in order and every story line word for word. | Behavior for story order and exact lines. But it teleports Squatch onto each spot and fires the action directly. It never walks, so it can never be seen or caught. It guards the words and the order, not whether a kid can get there. |
| `capture-rule.mjs` | One catch rule everywhere: the LOCKUP card, the cause line, the restart, stars kept, "They lost you." when hidden. | Mixed. Part (a) is pattern matching on the source code. Parts (b) and (c) drive the game and check real outcomes. But every Chapter 1 check uses the old scenes (O4, S1L, S9), not the scenes a kid plays today (Q1 to Q9, QA). It does not guard today's Chapter 1 catches. |
| `party-catch.mjs` | A catch at the party restarts in the party, a little back, guards gone, not inside the plant pot. | Behavior, for the fix to problem 1. Sets the scene up by hand rather than playing to it. |
| `scene1-morning.mjs` | The morning, the song, "That evening…", the peek, the sneak (seen while the guest looks, hidden while he faces the stage). | Behavior, with real timing. A good guard for beats 1 to 4. |

**The holes, plainly:**
1. Looks are not guarded. Pixel-color checks can tell a jacket is blue; they cannot tell a party reads as evening, or a guest looks taller than Squatch. Your eyes are the guard for looks.
2. The full story test teleports, so walking and catching across the chapter are guarded only by the kid robot, which avoids danger on purpose.
3. Today's Chapter 1 catches are not in the catch-rule test.
4. GitHub's automatic checks are off (commit f721953: "while GitHub's checks are off, paste the local pass count"), so passing is only ever on one machine.

**Conclusion:** the suite is real enough to refactor and fix on top of. It will catch most "this used to work and now it's broken" mistakes in story and walking. It will not catch "this looks wrong" or "this isn't fun". The bias you set holds: fix v1 on its tests, do not rewrite.

## 2. The open problems, by who can fix them

From `docs/CHAPTER-1-PROBLEMS.md` (ranked list, the party-hall checklist, and the beat 1 items). Fixed items are left out.

**Code alone** (you already decided; you only check a screenshot at the end):

| # | Problem | Why no new decision is needed |
| --- | --- | --- |
| 2 | Tapping a spot behind furniture walks Squatch into it and stops | Plain bug. A path finder already exists in the test robot. |
| Hall 2 | Bartender in front of the counter; extra snacks drawn on it; no hiding spot behind it | R107, Nov 15 |
| Hall 3 | Guests scattered, Squatch-sized, one on the vent, some in the doorway | Room sheet, C10, R67, beat 4 |
| Hall 4 (part) | Yellow arrow at bottom right, photo circle by the door, ring on the floor | BRIAN-LENS: never an arrow or a floor circle. I also saw a yellow circle with an arrow at the bedroom door in today's game. |
| Hall 6 | Vent swirls still; fur not pulled in; SUCK button instead of the vent tug | A22, D15, S61, R108; the old lobby already has the fur drift to reuse |
| 9 | SNAG, SUCK and STAND are buttons; the dance plays itself | Your own words, beat 16 (t126u) |
| 11 | Ordinary guests should show "?" then "!" instead of cones; cones only on guards and robots | Your Nov 11 rule (t332), restated Nov 16 |
| 14 | HUG · octopus and SNAP · photo buttons do the moment for the kid | Walkthrough beats 12 and 13 |
| 15 | Running home happens by itself | Walkthrough beat 18; you answered the catch part on Nov 14 |
| 17 | Mops finds the flyer and fur at the wrong time, with a line that isn't yours | Walkthrough beat 19 has the right moment and the right lines |
| 8 | Mops's heart cone lights too soon (pull request 35) | You set the rule (R98, R104); the cause is not found yet |
| 1 (rest) | The test robot still skips the party buttons | Goes away with problem 9 |

**Needs you:**

| # | What | What kind of answer |
| --- | --- | --- |
| 3 | Hangar robot catches Squatch with no warning when close | One pick: draw the danger circle, or no close catch while it looks away |
| Hall 4 (part) | Make the octopus and the photo camera read as what they are | Look at a picture and say yes |
| Hall 5 | Evening light, dimming for the band | Look at a picture and say yes |
| 19 | The Croc Boys are barely there | New drawing; your yes on how they look |
| 16 | The TV story should be full-screen pictures; two captions are unapproved | New pictures plus your words |
| 18 | The bedtime story has no pictures | New pictures; your yes |
| Beat 1 | Homework at the desk | Wording awaits your yes |
| Beat 1 | Purple bed bar, bucket readability, Mops taking the bucket, music | Your call on each |
| Hall | "COMING SOON!" poster words | Still need your yes (room sheet). Today the words overlap the poster's edge. |

**Unclear:**

| # | What | Why |
| --- | --- | --- |
| 10 | A start-over with no card, seen once | Never seen again; the robot now fails if it happens |
| Docs | The problem list says pull requests 57 and 58 are unmerged; git shows both merged | The list is out of date in places; it needs a tidy pass against git |

Approved but not built (no new decision needed, just work): closet look, bed flop and hop with their approved lines.

## 3. What I saw playing both

I played about five minutes of each in the app's browser, mostly at phone size (375 by 812, touch), the way the kid robot plays. Screenshots are in `docs/assessment-2026-11-22/`.

**v1 (`?ch=1`):**
- On a computer with a mouse, the SING button exists but is hidden until you press "Show touch controls". A kid on a laptop would be stuck at "sing along with Mops". (`v1-01-computer-sing-button-hidden.jpg`)
- On a phone held upright the picture is small; Squatch is about 20 pixels tall. Sideways is about twice as big (already known). (`v1-02-phone-upright-morning.jpg`)
- The morning, the song and the goodbye ran in the right order with one bubble at a time.
- The peek showed the full hall with Isfred on the stage and the banner. The hall still fails most of the graded checklist: guests Squatch-sized and scattered, a guest at the vent, the bartender in front of the counter, and "COMING SOON!" printed across the poster's edge. (`v1-03-hall-peek.png`)
- The sneak worked as built: I waited for the yellow guest to look back at the stage, tapped the plant, got there unseen, and HIDE came up. That is the first real "sneak" moment and it felt right. A ring is still drawn on the floor around the plant. (`v1-04-sneak-reached-plant.jpg`)
- One press of SHUFFLE dressed Squatch completely; the kid chooses nothing. (`v1-05-disguise-screen.jpg`)
- The party opened with TAKE · robot flyer and a guest saying "Love the shirt." (`v1-06-party.png`)

**v2 (`prototypes/space-snack-quest/index.html`):**
- On a phone the picture fills the width, with no stick and no big button. It is bigger and cleaner than v1 upright. (`v2-01-phone-morning.jpg`)
- Mops has a dashed sight cone from the first frame.
- Squatch got out of bed and walked on his own; for the whole morning the kid only taps lines and presses SING.
- It has the homework page ("SPACE MATH"). (`v2-02-homework.jpg`)
- No goal bar. Tapping the bedroom floor did not walk him; PEEK appears as a button at the door.
- In the hall, tapping to read a line also walked Squatch, and a guest caught him while I was only reading: "LOCKUP, A guest saw Squatch!" (`v2-03-caught-while-tapping-text.png`)
- Ordinary guests have dashed cones, against your Nov 16 rule. (`v2-04-hall-cones-on-guests.jpg`)

**Not checked by me:** anything after the party starts in v1, anything after the hall in v2, sound, iPad size, and the later chapters.

## What the Grok threads add (read after the first draft of this page)

I copied all three threads in full and checked every recording (list in `docs/grok-archive/README.md`). Four things from them change the picture:

1. **Your spec moved after the Nov 14 walkthrough that v1 follows.** In G Bot, after Nov 17 (those messages refer to Nov 16 and Nov 17 as past), you set a new morning order: Squatch wakes to a speaker announcement while Mops keeps mopping, a beard-wringing cutaway, the song announced, "Floating in space" playing on in the room, then Mops leaves for work (G Bot #561). You also said only things the player must do get a yellow outline (#567), and PEEK appears at the door because he hears the party (#569). v1's morning does not do this yet. So some "code alone" items above first need one check with you: which version is current.
2. **A conflict on sight cones.** On Nov 16 the rule was cones only on guards and robots, with a "?" over ordinary guests (problem 11). In G Bot #603 you flagged that "only some of the aliens have the sight cones" as wrong. That needs your call before anyone builds cones. **Answered 2026-11-22:** cones on every character, dashed until Squatch enters the line of sight, then yellow; guests show "?" first and "!" only if he stays too long; guards and robots show "!" right away; hearts from Mops, as in the earlier v1 version. Recorded in `docs/DECISIONS.md`.
3. **You said the early versions played better.** "we actually significantly devolved from the early versions to most recent versions" (G Bot #583), and "Some of our concepts improved as we went later on. It's just that I think the execution got really messy" (#586). Earlier: "before at least the controls were obvious and te play worked" (#108). v1's history goes back to Nov 2, so those early builds can be rebuilt and played side by side (the Nov 7 build is `ee59f4a`) without touching current work. That is something I can set up for you without much from you.
4. **You named the real problem yourself:** "The problem was bloat and drift, not lack of clarity." (G Bot #520), and "we didn't get rid of the wrong ideas as we went" (#433). v2 was the answer to that. In its own words, v2 then did "the opposite on almost every point" you had decided (G Bot #572, the bot's claim), and your last v2 notes (#603) list nine things still wrong.

## 4. Base decision

**Decided 2026-11-22 at your request (you deferred to me): v1 is the base, and Chapter 1 is rebuilt inside it beat by beat into clean new files, with the old code for each beat deleted as its replacement lands and all tests passing after every change. v2 stays as a reference to copy approved pieces from.** Full reasoning in `docs/DECISIONS.md`, "Which repo is the base, 2026-11-22". Under the hood, v2's only playable code is one file marked "PROTOTYPE - NOT FOR PRODUCTION" and its production folder is empty, so v2 as the base would mean building the real game from nothing, without tests. The first draft of this section follows.

My recommendation: **v1 is the base.** Fix it one problem at a time, on its tests, in the order above. Leave v2 as a reference: its phone layout and its homework page are worth borrowing later, one piece at a time, with your yes.

Why: v1's tests are real enough to catch breakage; v1 already plays the whole chapter end to end (the kid robot reaches the score card); and the open problems are small and separate, not a sign the structure is wrong. v2 would need its test kit rebuilt to run here, and it already breaks two rules you set.

What v1 as the base does not fix by itself: the bloat you named. v1 still carries old scenes (the O and S scenes) that tests lean on, and docs that disagree with your newer G Bot decisions. The rules for each sitting deal with that slowly: clean only what a fix touches, delete dead code only when a test proves nothing uses it, and keep one short spec (`docs/WHAT-GOOD-LOOKS-LIKE.md`) that wins over older docs once you have corrected it.

This goes into `docs/DECISIONS.md` only after you say yes.

## 5. Verified, not verified

| | Status |
| --- | --- |
| v1 test count | Verified: 54 of 54 suites, 2,036 checks, 0 failures |
| v1 plays from the start to the party at phone size | Verified by me, about 5 minutes |
| v1 plays to the score card | Verified only by the test robot (see section 1) |
| v2 plays from the title to the hall sneak | Verified by me, about 4 minutes |
| v2 tests pass | Not verified. They need Cursor's cloud machine. |
| Looks match your locked rooms and the room sheet | Not verified beyond what the screenshots show |
| Fun for a 10-year-old | Not verified. Not yet played by a person. |

## 6. What needs you

1. Play v1 and v2 for ten minutes each and tell me what you saw. v1: open the game with `?ch=1`. v2: the prototype page. I can open both in the app's browser for you, and the Nov 7 build too, so you can compare against the early version you liked.
2. Say yes or no to v1 as the base.
3. Read and correct `docs/WHAT-GOOD-LOOKS-LIKE.md`, `docs/REJECTED.md` and `docs/PROMISED-NOT-DELIVERED.md` (drafts from the threads). Once corrected, the first one wins over older docs.
4. Sight cones: answered 2026-11-22 (see `docs/DECISIONS.md`). Disguised: yellow, then suspicion, then "fur!" the second time (also recorded).
5. Problem 3, the hangar robot: draw the danger circle, or no close catch while it looks away?
6. The repos are public. The full thread copies and the Nov 8 transcript are kept outside the repo on the mini. Should the three short files (your words, game only) go into the public repo, or stay private too?
