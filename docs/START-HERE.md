# Start here

For any model or person picking this project up. Read this page, then `CLAUDE.md`. Ten minutes.

## What Brian is building

A funny sneaking adventure in a browser for a 10-year-old, played mostly on a phone. Squatch hides who he is on a space station; Mops the goat is his friend. Brian designs and playtests. He does not code and does not read GitHub. He judges by playing and by watching video in chat.

Right now one thing matters: **make Chapter 1 great**. Everything else waits.

## What the game should be

Everything Brian wants for Chapter 1 is already written down. It was checked on 2026-11-14 against every message he wrote. Use these four, in this order, and nothing else:

1. `docs/CH1-STORY-WALKTHROUGH.md`: the story in 61 small beats. What happens, the words, what the kid does. Day 1 is beats 1 to 21.
2. `docs/BRIAN-LENS.md`: how Brian judges a scene. One page.
3. `docs/locked-rooms/`: the room pictures. The game draws rooms from these.
4. `docs/grok-archive/squatchbot-brian-words.md`: Brian's own messages. Open it only when a beat is unclear. Search it; do not read it all.

Open pull requests and branches: only the ones named in `docs/CHAPTER-1-PROBLEMS.md` matter. Everything else is leftovers from old attempts. Do not continue, merge or copy from them.

The game does not yet play the way the walkthrough says. Closing that gap, one beat at a time, is the job. The other files in `docs/` are old plans and logs. Do not read them unless a problem names one. Do not write new ones.

## What went wrong before

Several models each announced a plan, changed many things at once, said it worked, and the game got worse. The causes, so you do not repeat them:

1. "It passed" meant "it passed on my machine". Now GitHub runs every test on every pull request. Only a green check on GitHub counts.
2. The tests checked code, not what a kid meets. Now a robot plays Chapter 1 by touch from start to score card (`tests/ch1-kid-play.mjs`).
3. Fixes were chosen by whatever was noticed last. Now there is one ranked list: `docs/CHAPTER-1-PROBLEMS.md`.
4. Big changes mixed fixes with new ideas, so nobody could tell what broke. Now: one problem, one pull request.
5. Brian was asked many questions at once with no background. Now: one question at a time, with the background he needs to answer it.
6. Moments Brian described as things the kid does by moving (sneak, steer away, step into the photo) were built as buttons that play the moment for him. Before building a beat, say back to Brian what the kid will do with his fingers, and get his yes.

## The loop

Do this, and only this, until the list is empty or Brian redirects you.

1. `git fetch`, then look at `gh pr list`. If someone else has pushed work on the same thing, stop and tell Brian.
2. Take the top unfixed problem in `docs/CHAPTER-1-PROBLEMS.md`. If it says "Needs Brian", ask him that one question first, with a picture if it is about looks.
3. Branch from `main`. Change the fewest lines that fix the cause written there. Edit `src/`, never `index.html`.
   If the fix changes a rule every chapter uses (walking, catching, cones, the big button, the goal bar) and its code sits in one chapter's file, first move only that code to a shared file (`00-core.js` for rules, `60-frame-draw.js` for drawing) in its own pull request that changes nothing in play. Then make the fix in a second pull request. Never mix a move and a fix.
4. Take the problem off the `KNOWN` list in `tests/ch1-kid-play.mjs`, or add the test the list names.
5. Run `npm run build`, then `node tests/ch1-kid-play.mjs`. It must reach the score card and pass.
6. Mark the problem fixed in `docs/CHAPTER-1-PROBLEMS.md`. Update `README.md` and `docs/MASTER-BACKLOG.md`.
7. Open a pull request. Wait for the green check on GitHub. A red check means not done.
8. Show Brian in chat: what a kid will notice, in two sentences, plus a picture or `npm run kid-video`. Ask for his yes.
9. Merge only on his yes, written into the pull request. Then go to step 1.

## Do not

- Do not start a second problem while one is open.
- Do not rebuild or tidy code that the problem does not need.
- Do not add or change words on screen, or any locked room picture, without Brian's yes.
- Do not add a feature. Ideas go in `docs/MASTER-BACKLOG.md` under "Still open".
- Do not say something works unless you ran it in this session and saw it.
- Do not read the whole code base. It is 18,000 lines. Use the map below and search for the function name.

## Map

| You need | Look in |
| --- | --- |
| Chapter 1 as played today (scenes Q1 to Q9, QA party, QB lunch, QP keypad) | `src/game/12-ch1-redesign.js`, `14-ch1-day1.js`, `14-ch1-day2.js` |
| Older Chapter 1 scenes (O and S names), still used for the opening | `src/game/10-ch1.js`, `11-ch1-hall.js` |
| Walking, tapping, solid furniture | `src/game/00-core.js` (`walkTap`, `oh`) |
| Getting caught and where a part starts over | `src/game/25-capture.js` (`CH1_CHECKPOINTS`), `20-ch2.js` (`reSec`) |
| Goal bar, stars, faces | `src/game/80-hud.js` |
| Big button, stick, test hooks (`window.__ss`) | `src/game/90-input-shell.js` |
| Drawing the picture | `src/game/60-frame-draw.js` |
| Sight cones (used by every chapter, but filed in Chapter 2's file) | `src/game/20-ch2.js` (`seenCone`) |
| Every decision Brian has made | `docs/DECISIONS.md` (this wins when docs disagree) |

Files `10` to `14` are Chapter 1, `20` Chapter 2, `30` Chapter 3, `40` Chapter 4; the rest are shared by all chapters. About 200 shared pieces are misfiled in chapter files, most in `20-ch2.js`. Move them only as step 3 says, never all at once.

Open any scene in a browser with `index.html?scene=Q4&debug=1`. Chapter 1 from the top is `?ch=1`.

## Talking to Brian

Plain words, short. No code terms. One numbered question at a time, at the end, with the background he needs. Show, do not describe: a picture or a video beats a paragraph. If you do not know something, look it up before answering.

## Cost

Reading costs money. Stay inside the files the problem names. Let GitHub run the full test suite; on your own machine run only the robot and the one test you touched.
