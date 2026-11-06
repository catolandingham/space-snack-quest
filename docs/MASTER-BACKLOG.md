# Master backlog

Precedence: the original story stays canon except the Chapter 2 kitchen sequence.

- Kitchen revision, and only that revision: `docs/story-bible.md`
- Choices still waiting on Brian, outside that kitchen: `docs/STORY-DECISIONS.md`
- Previous on-repo story note, not deleted: `docs/spine-archive.md`

A pending item stays pending until Brian decides that item. This page does not mark the rest of the backlog done. The full original attachment was not in the workspace, so it is not listed as shipped and it is not replaced.

What the game already plays is the root `README.md` and the build. Where that and an older story idea disagree outside the kitchen, the disagreement is a hold in `docs/STORY-DECISIONS.md`, not a change to the game.

## Register

PR #4 is squash-merged. `main` is `9999f0cd`. That commit has the same tree as kitchen C `6853902`. The site is not confirmed live. PR #5 is open on `main` and is not merged.

| PR | Branch | Head | Base | State |
| --- | --- | --- | --- | --- |
| #4 | `cursor/wash-presentation-f809` | `6853902`, squash `9999f0cd` | `main` | Merged. Not confirmed live |
| #5 | `cursor/p0-reliability-f809` | Restack of `17a03c2` and `0ab2781` onto `9999f0cd` | `main` | Open. Not merged. Not deployed |

The recovery commits are replayed onto `9999f0cd`. Their changes match `17a03c2` and `0ab2781`. The kitchen commits are not in this pull request.

## SS40–SS44

Kitchen C at `6853902` is the pass for these five checks. The ground drawing is one floor line: the full-height diner door, the counter, and the spice rack share it. Pastdraw is the galley through `db3a82c`. QA note `df55e0c` reviewed `d4e3714` (that note is not a commit) and is part of pastdraw.

| ID | Check | `main` `32156c7` | Pastdraw | Kitchen C `6853902` |
| --- | --- | --- | --- | --- |
| SS40 | Window, Gloop's arm and hand, tickets through the pass | Older galley. This pass does not apply | `d4e3714`: phone tickets and the arm failed that review. `db3a82c`: arm, hand, and ticket ink passed | PASS. Pass about 300 wide. The arm reaches the right ticket. The hand is visible |
| SS41 | Tickets move right to left, the rail scales, NEXT stays on the left | Older galley. This pass does not apply | `d4e3714`: a one-ticket rail stayed full width. `db3a82c`: the rail scales | PASS |
| SS42 | The oven is a real cook station | Older galley. This pass does not apply | `d4e3714`: the oven sat under the pass and the COOK label was hidden | PASS. Four burners in the counter. Cook hotspot x 800 |
| SS43 | Spice storage sits on the counter | Older galley. This pass does not apply | `db3a82c`: the spice area was still a strange high cabinet | PASS. Three jars on a rack on the counter, with posts down to the counter |
| SS44 | Soup on the crate, label clear of the door | Older galley. This pass does not apply | `db3a82c` failed. The LEAVE SOUP chip covered the DINER door | PASS. The bowl is on the crate. The chip is beside the door. DINER reads |

No further layout review is open for that drawing. Later work does not redraw the kitchen.

## Story rows

These rows record what was on screen. They do not resolve `docs/STORY-DECISIONS.md`. Brian still decides each item.

An older mark said `32156c7` / current false for DE1, DE2, DE3, DE5, and DE8. That mark is retired. The status is the capture below.

The story shots are from the capture on this stack before `17a03c2`. PR #5 does not retune TV, stars, prices, or those notes. The soup purchase and the Chapter 2 pen were played again at `17a03c2`.

| ID | On screen | Still open |
| --- | --- | --- |
| DE1 | Station PA: "WOOKIE SPOTTED IN SPACE! Last seen near Stormtop." Hide badge "HIDE! 6". Gloop: "Bots! Go watch the dock." | Whether the TV hide stays. The crate-watch exchange was not in the saved shots |
| DE2 | "+50 SECRET!", "+100 SNEAKY!", "+25 FUNNY FIND!", and "★ = points for finds." | What the stars are for. A Chapter 1 loss of 100 stars was not in the capture |
| DE3 | At `17a03c2` a soup buy stayed durable across Reset section: jar 0, register 30, soup in hand. The chapter map on screen is "Talk to Grandma Gloop at the diner counter" and the fuel line | More dishes after soup and gas. A chili wash was not the scene on screen |
| DE5 | Soup note: "You're not alone out here." signed "— The Guardians", with a paw print | The Chapter 1 box, "Brave Sasquatches stay hidden", and the lid spelling were not in the capture |
| DE8 | Chapter 1 alarm: "WOOKIE ALERT! PROTECT THE AIR SCRUBBERS!" At `17a03c2`, Rusty said "SECURITY! A Squatch on the lot!" while control was still on. LOCKUP followed about two seconds later. Space then landed at the gas entrance (760, 540) with jar 12 and coins still in hand | Whether the two captures stay separate. A later Mops pen was not played |

DE4, DE6, and DE7 stay pending in `docs/STORY-DECISIONS.md`. This page does not mark them verified. Zip's songs and Harry's dance were not on screen. The pea gag was not on screen.

## Reset section

Shipped in PR #5 at `17a03c2`. The control is the Reset section button and the R key, held about three quarters of a second. It is the build, not an open design goal.

Independent QA at `17a03c2` used the mouse, the keyboard, and a coarse-pointer finger:

- A short click, and R released before 0.75s, left the player where he was.
- A finished hold restarted once. A later hold restarted again.
- Bought soup survived: jar 0, register 30, soup in hand, 55 stars, the find kept. Landing was the wash 5 crate, (230, 520).
- A finished wash set left the jar at 30. Reset left it at 30.
- Unknown phase `g5`, after a wash 5 note, returned to wash 5 with the soup. The gas entrance and a chapter wipe did not run.
- Rusty warned first, then the pen, then the gas entrance with control back. Space cleared the card. The landing did not catch him again.
- Phone width 396: Reset section at (14, 605), 148 by 44, canvas overlap 0. A finger hold restarted the section and kept the soup. The pen, NEXT, and Reset sat apart.
- The desktop R bar sits on the canvas floor. The button sits under the keyboard sentence.
- Pump sight: open ground is visible. Under the pump, the far side, and a ray through the body stay blocked.
- A walk into the kitchen crate stopped on the crate's free left edge, x 130.

The pass drove wash 5, wash 1, `g1`, and unknown `g5`. The other checkpoint rows are the implementation table in `docs/README.md`. The play-mode chapter restart was not played. This is not a full pass of every note in the backlog.

## Still open

- Boarding caption. A g3 shot in the story capture is the dock line, not an explicit boarding caption.
- DE4, DE6, and DE7.
- Checkpoint rows the independent pass did not drive.
- Soup BUY and Chapter 2 boarding were not re-played in the closet-crate measurement below.
- Discoverability, still open for Brian. The closet yellow ring is lit from the first moment of control, while the touch button stays blue Action until the feet are inside the hide radius. A short left pulse that stops on the G leaves the button blue, and a press does nothing. Whether the ring should wait until the button can hide is not decided here. The radius and the 9 second line stay as they are. This does not resolve a story hold.
- Discoverability, still open for Brian. After the lunch is held, the chip stays "Bring Mops his lunch". It never becomes GIVE. Away from a plant or the box the touch button stays blue Action. Tab and G leave the chip, the verb, and the pose unchanged. Whether a prompt should appear when he is close enough to hand the lunch over is not decided here. The 110 reach, the cones, and the hide spots stay as they are. This does not resolve a story hold.
- Any item not named in the tables above.

## Closet crate hide

Live `https://space-snack-quest.onrender.com/` was fetched with the cache off. The body is 587516 bytes, sha256 `5d25303aa9fd7656fe0bb12fd40580b07570763e4451bacccf7b4dd9c46c44c4`, the same bytes as `main` `15051ec`. The page source contains `o5T>9` and does not contain `o5T>6`. This is not a different build. The timer and the radius were not changed. This does not resolve a story hold.

The yellow ring is `pulse` `bed`. It is on at the spawn, (760, 480), while the touch control is still the blue Action button (`rgb(52, 120, 246)`, label `Action`). The ring is not the hitbox.

A real play from the title, then short left pulses on that live page:

| Feet | Distance to (220, 560) | Button |
| --- | --- | --- |
| (357.5, 480), on the G sign, ring still lit. Clock 5.08s, `o5T` 5.08 | 159. Radius is 120 | Blue Action. A click leaves him standing |
| (330.7, 480) | 137 | Blue Action |
| (300, 480) | 113 | Green HIDE, `rgb(43, 196, 138)` |

Short pulses that stop at the G never arm HIDE. E and the blue Action button do nothing there. The guard line in this build is `o5T>9`. Reaching the G at 5.08s leaves about 4 seconds before that line. A report of 3–6 seconds matches that wait at the ring. It is not a 3 second timer in `15051ec`.

An earlier note on this page measured a continuous hold that crossed x 300. That input is not the short-pulse stop at the G. It does not contradict the live button.

## Deck lunch handoff

Same file as the closet check. sha256 `5d25303aa9fd7656fe0bb12fd40580b07570763e4451bacccf7b4dd9c46c44c4`. Played from the title with the keyboard. No scene was placed. The lunch GRAB succeeds, and the deck opens with the chip "Bring Mops his lunch", lunch held, pose standing.

Tab, then G, on that deck: scene stays S1L, verb stays empty, chip stays "Bring Mops his lunch", pose stays stand, button stays blue Action.

Hiding at the right plant, feet (830, 461), distance to Mops about 233: the button becomes green LEAVE. Seven seconds hidden, through the patrol, leaves the chip on "Bring Mops his lunch" and the scene on S1L. LEAVE returns him to standing, and the button returns to green HIDE. The chip is still "Bring Mops his lunch".

The handoff is standing inside 110 of Mops. After LEAVE, the lower lane at y≈487 stays under the upward cones and clear of the floor vent. Waiting there until the moving tourist is at x 460, then walking up, reaches feet (792.6, 337.1). Distance to Mops is 108. The chip clears on that frame. The button is still blue Action. The next scene is S2. No capture line plays. The frame shows +100.

The objective does not become a GIVE verb at any of those feet. Blue Action is the button whenever he is outside a hide spot. Green HIDE and green LEAVE are the plant and the box. They do not hand the lunch over.

A separate walk on y≈528 through x≈650 clips the floor vent. Security rushes, and the line is "Just a fuzzy mop! Very fuzzy." The chip stays "Bring Mops his lunch". That line is in the same capture set as "It walks. Fancy rug." The radius, the cones, and the 110 reach were not changed.

## Changelog

2026-11-06. Deck lunch on the same `15051ec` file. From the title, with the keyboard. Hiding at the right plant for 7 seconds keeps the chip "Bring Mops his lunch" and the button on LEAVE. Standing at (792.6, 337.1), distance 108, after the moving tourist is at x 460, clears the chip and enters S2. Tab and G do nothing on the deck. No reach, cone, or timer change.

2026-11-06. Live closet check on `15051ec` / sha256 `5d25303a…`. The served page matches that commit. Short left pulses stop on the G at (357.5, 480), distance 159, with the yellow ring lit and the touch button still blue Action. A click does not hide him. Green HIDE appears at (300, 480), distance 113. The guard line is `o5T>9`. No timer or radius change.

2026-11-06. Recorded PR #4 at `6853902` and PR #5 at `17a03c2`. SS40–SS44 pass on kitchen C, with pastdraw and `main` called out separately. DE1, DE2, DE3, DE5, and DE8 use the shots and the recovery pass. Reset section is shipped in PR #5, with the independent checks listed above. The rest stays open.

2026-11-06. PR #4 is on `main` at `9999f0cd`. Deploy is not confirmed. PR #5 is restacked onto that commit and stays open.
