# Project thread: "QA kitchen presentation pass" (Squatch Game bot ↔ Cursor QA agent)

Source: the view-only sheet behind the "Messaged / Message from QA kitchen presentation pass" markers in the Squatch Game thread. Scraped 2026-11-06. This is the independent visual QA agent for PR #4 (presentation + kitchen layout), the art-direction critique that produced the SIDE / RANGE / BAY (shown to Brian as A / B / C) kitchen options, PR #5 recovery QA, the docs-only status commit 0ab2781, and the live-deploy check of 15051ec5. Image cards are kept as alt text. Agent Store trailer lines omitted. The page repeated the final live-PASS report three times; it is kept once.

---

**Squatch Game:**

Independent QA for PR #4 cursor/wash-presentation-f809 commit 8cc231a in private https://github.com/catolandingham/space-snack-quest. Use visual/runtime QA, not just string assertions or trusting implementation. User wants clear unambiguous ideas fully completed but no difficulty/economy changes. Check all six C1 scrub dirty dish + paw + sponge (in wash1 and wash5), rumble occurs before cook wakes with unchanged timing, chef hat only while Mops cooks (off mopping), oven visible at ticket station, LEAVE SOUP prompt centered, mop handoff and stays. Inspect screenshots on desktop and narrow/mobile canvas for readability. Run all tests. Report exact pass/fail with visual evidence and any issues. No code changes, merge or deploy.

**QA Agent:**

PR #4 at 8cc231a fails visual QA. Three of the six pictures are not clear. Timing, prices, and the scrub count are unchanged. No code was changed, and nothing was merged or deployed.

The repo tests all passed: progression 9, gas stop 16, kitchen 38, and zero failures. Those checks sample single pixels and coordinates, so they miss the picture problems below.

| Check | Result |
|---|---|
| Scrub card: dirty dish, paw, and sponge, in wash 1 and wash 5 | Fail |
| Rumble before the cook wakes, same wake time | Pass |
| Chef hat only while Mops cooks, off while mopping | Fail |
| Oven visible at the ticket station | Pass |
| LEAVE SOUP centered on the crate | Pass |
| Mop handoff, and Mops stays | Fail |
| No difficulty or economy change | Pass |

Scrub card: fail

Wash 1 and wash 5 both open the same card. Scrubs 1 and 2 are counted correctly: two dirt marks, then one, plus a plate, a paw, and a yellow bar. The sentence under them says "No sponge. The paw is the sponge." The yellow bar has no sponge shape, so the card says there is no sponge and draws something that is not clearly a sponge.

[image: Scrub card contradicts itself]

The third scrub, in both wash rooms, paints the first scrub again. The finishing scrub sets the counter back to 0 before the frame draws, so the card shows three dirt marks and SCRUB 1/3. The same wrong card covers the greasy-pot ending.

[images: Wash 5 third scrub shows SCRUB 1/3; Wash 1 second scrub is the correct 2/3]

The jar did not change. One finished dish left the jar at 0. The kitchen test still saw the jar fill with 30 only at the end of a set.

Rumble: pass

On this commit the rumble starts at 5.2 seconds of the cook timer, while she is still the green "out cold" mark. She is still down at exactly 6.0 seconds and standing by 6.05 seconds. On main, with no rumble, she is also still down at 6.0 seconds and standing by 6.05 seconds. The wake time matches.

[images: Rumble while the cook is still down; Cook stands after the rumble]

The banner crosses the ticket rail. The word RUMBLE and the speech bubble stay readable on the desktop canvas and on a 390px-wide phone.

Chef hat: fail

The on/off rule works. A white-and-red mark is present through the wash 5 cooking visit, including while he is walking, and it is absent while the blue MOP label is on and absent in wash 1. It does not sit on his head. It floats about 45 pixels above his ears, centered on his feet, so it reads as a stray pill. He is still holding the mop while that mark is up.

[images: Hat floats above Mops; Hat is off while he mops]

Oven: pass

With the station clear, a dark oven with a window, a yellow handle, and the word OVEN sits directly under ticket #6. After something is cooked, a red light shows in the window. Standing on it covers part of the body. The label and the appliance stay recognizable on desktop and on a landscape phone.

[image: Oven under the ticket]

LEAVE SOUP: pass

At Mops (150, 450), which is inside the kitchen walk area, the cream label reads LEAVE SOUP. Its box is centered at x 179.5, on the crate, and the words are centered in the box. It is wider than the crate and about 10 pixels right of the crate's middle. It still reads as the crate's label, not a label off to the side. The touch button repeats the same words.

[image: LEAVE SOUP on the crate]

Mop handoff and stay: fail

The handoff itself works. Mops comes to the greasy pot with the mop, the hat mark is off, three mops finish the pot, and the jar stays at 12. He then walks to (160, 520) and is still in the kitchen while "That goat washes FAST." is up. He does not exit off the left.

That standing point is inside the crate, and the crate draws in front of him. What you see is the mop sticking out of the crates and Squatch beside the oven. Mops himself is covered. A second later he is still there, still covered.

[image: Mops is hidden behind the crate]

Readability

Desktop, canvas about 960 pixels wide: the scrub sentence, RUMBLE, OVEN, and LEAVE SOUP are readable. The hat mark is not readable as a hat.

Phone landscape, canvas 525 pixels wide: LEAVE SOUP, RUMBLE, DIRTY DISH, and OVEN can be read.

Phone portrait, canvas 374 pixels wide: DIRTY DISH and the big touch button are clear. The scrub sentence and OVEN are small. LEAVE SOUP on the canvas is small but still legible, and the green button is large.

[images: Portrait phone, scrub card and the SCRUB button; Portrait phone, rumble]

A 320-pixel-wide canvas shrinks LEAVE SOUP to about 5 pixels and OVEN to about 4. The words are barely there.

[images: 320px-wide canvas, LEAVE SOUP is barely readable; Landscape phone, LEAVE SOUP is readable]

**Squatch Game:**

Re-QA PR #4 at new head 5f7dd8b6072b7959ab517054931bad456471fdd6, specifically the three failures your prior visual QA found: card must now match dirty dish + Squatch hand + visible distinct sponge, correct 3/3 clean plate until card clears in wash1/wash5/greasy pot; chef hat anchored to Mops head when cooking and not while mopping; Mops fully visible in kitchen after handoff. Also spot check all prior passes and run three suites. Use real visual screenshots on desktop/phone. Report any failure without holding back; no code changes, merge or deploy.

**QA Agent:**

The three earlier picture failures are fixed at 5f7dd8b. One new problem showed up: the 3/3 card stays on screen through the greasy-pot lines and covers them. No code was changed, and nothing was merged or deployed.

| Check | Result |
|---|---|
| Dirty dish, Squatch paw, and a separate sponge | Pass |
| Scrub 3/3 is a clean plate, then the card leaves, in wash 1 and wash 5 | Pass |
| Greasy pot also shows 3/3 clean, and the card gets out of the way | Fail |
| Chef hat sits on Mops's head while he cooks, and is off while he mops | Pass |
| Mops is fully visible in the kitchen after the handoff | Pass |
| Oven, LEAVE SOUP, rumble, jar, and wake time | Pass |

Scrub card: pass

Wash 1 and wash 5 now show the same card. Scrub 1 has a dirty plate. Scrub 2 has fewer marks. The paw has four toes and a pad. The sponge is a separate yellow rectangle with holes, held by a brown grip. The line under them is "One paw. One sponge. Zero training."

[image: Paw and a holed sponge on the dirty plate]

The third scrub stays at SCRUB 3/3 with a white plate labeled CLEAN, still showing the paw and the sponge. The jar stayed 0. About a second later the card is gone. Wash 5 matches wash 1, including the clean 3/3.

[images: Third scrub stays 3/3 and clean; Card is gone after it finishes]

The header still says DIRTY DISH on that clean card. The plate itself is clearly clean.

On a 390px-wide phone the paw, the sponge, the sentence, and SCRUB 1/3 are readable. The green SCRUB button does not cover the card. Landscape at 525px is the same picture, larger.

[image: Phone portrait scrub card]

Greasy pot card: fail

The last scrub of the greasy pot does show the clean 3/3. That part is fixed. The card then stays up, because a speech line pauses the kitchen timer, and it is drawn on top of the line.

It is still there when Mops has finished and is standing in the kitchen. Gloop's "That goat washes FAST." is cut down to ST. The same cover sits on "This pot is GLUED with grease!" at the start of the handoff. The 3/3 picture is right. It does not get out of the way.

[image: 3/3 card covering Gloop's line]

Chef hat: pass

The hat is part of Mops now. Facing right or left, the white toque and red band sit on his horns and turn with his head. It is gone while the MOP label and the mop are out, and it is gone in wash 1. He is not holding the mop while the hat is on.

There is still about a 4-pixel gap between the red band and the horn tips. It reads as his hat, not as a floating pill.

[images: Hat on his head, facing right; Hat follows him when he faces left; Hat off while mopping]

He also wears it while LEAVE SOUP is up. That moment is still the G5k scene, so the hat is not limited to the cooking action.

[image: Hat is still on while he leaves the soup]

Mops after the handoff: pass

After three mops he walks to (760, 520), faces left, and stays in the kitchen. His whole body and the mop are in the open, clear of the crate and the oven. The jar stayed 12. He was still there more than a second later, under the same Gloop line. Phone and landscape show the same standing pose.

[images: Mops fully visible with the mop; Phone: Mops standing clear on the right]

Spot checks that stayed good

The oven is still under tickets #5 and #6, with the word OVEN and a red light after a ticket is cooked. LEAVE SOUP is still the cream label on the crate, centered at x 179.5. The rumble still starts at 5.2 seconds while the cook is the green "out cold" mark. She is still down at exactly 6.0 seconds and standing by 5.96 seconds of wall time.

[images: Oven still under the tickets; Rumble while she is still down]

Suites

Progression: 9 passed. Gas stop: 16 passed. Kitchen, first run: failed once, on "Gloop at the counter startles, shoves, and calls security." Squatch had already been shoved from 373 to 303 before the test recorded the "before" position, so both readings were 303. The line, the security call, and the jar were already correct. Kitchen, second run: 39 passed, including that check. That failure is the test sampling the shove too late, not a change in the shove.

**Squatch Game:**

Final visual QA of PR #4 at 64ca82a: verify card now closes before wash-line and greasy-pot dialogue and is CLEAN DISH on 3/3, main prior failures still fixed, all six presentation asks pass. Run each suite at least once and kitchen shove probe repeated. Only report observed results; no code changes, merge or deploy.

**QA Agent:**

All six presentation checks pass at 64ca82a, and the scrub card is closed before both of those lines. The third scrub that stays on screen is titled CLEAN DISH. No code was changed, and nothing was merged or deployed.

| Ask | Observed |
|---|---|
| Dirty dish, paw, and a separate sponge in wash 1 and wash 5 | Pass |
| Third scrub is a clean plate at 3/3, then the card leaves | Pass |
| Card is gone before the wash line and the greasy-pot lines | Pass |
| Rumble while the cook is still down, wake still at 6 seconds | Pass |
| Hat on Mops's head while cooking, off while mopping | Pass |
| Oven under the ticket rail | Pass |
| LEAVE SOUP centered on the crate | Pass |
| Mops fully visible in the kitchen after the handoff | Pass |

Card

Wash 1 and wash 5 scrub 1 still show a dirty plate, a paw with toes and a pad, and a yellow sponge with holes. The line is "One paw. One sponge. Zero training." Scrub 3, in both rooms, is titled CLEAN DISH, the plate is white and says CLEAN, and the count is SCRUB 3/3. The paw and sponge stay. The jar was still 0. A second later the card was gone and the kitchen was visible again.

[image: CLEAN DISH at 3/3]

The last scrub of a wash set opens "That goat washes FAST." with the card already gone. The whole sentence is visible. The greasy pot does the same: the first frame is "This pot is GLUED with grease!" over the greasy pot, with no card. On a 390px phone, forcing the dish timer to stay positive while that line is up still draws the line and not the card.

[images: Wash line with no card; Greasy-pot line with no card; Phone: CLEAN DISH 3/3 is readable]

The other pictures

The rumble started at 5.18 seconds of the cook timer while she was still the green "out cold" mark. She was still down at 5.98 seconds and standing by 5.96 seconds of wall time.

The hat sits on Mops's horns and turns with his face. It is absent while the MOP label and the mop are out. In the LEAVE SOUP shot he is still wearing it. That label is centered on the crate; the cream box center measured x 179.5.

[images: Hat on while cooking; Hat off while mopping; LEAVE SOUP on the crate]

The oven is under tickets #5 and #6, labeled OVEN, with a red light after a ticket is cooked.

After the third mop, Mops walks to (760, 520), faces left, and stays in the kitchen with the mop in the open. The jar was still 12. "That goat washes FAST." is fully visible above him, and the card is not there. The same standing pose is clear on the phone and in landscape.

[image: Mops visible, line fully readable]

Suites

Progression: 9 passed. Gas stop: 16 passed. Kitchen, run 1: 40 passed. Kitchen, run 2: 40 passed. No failed checks.

The shove checks, both kitchen runs:

Gloop at the counter: planted at 373, then at 303. The line and SECURITY! fired, and the jar stayed 30.
Blorp: planted at 319, then at 389. The line and SECURITY! fired, and the jar stayed 30.

**Squatch Game:**

New follow-up independent review: branch cursor/wash-presentation-f809 now redesigned kitchen layout at df55e0c plus docs at d4e3714. Independently verify key layout SS40-44: window oversized & believable gloop reach/hand tickets pass-through, right-to-left ticket clipping not odd oversized rail, oven logical cook, shelf positioned coherent and soup on crate clearly. No dialogue obstructed/hand-off/clean scrub regressions, desktop phone both. User asked visual options for outstanding story conflicts. Capture all playable STORY-DECISION choices TV, stars, later gas/chili etc vs documents with clear CURRENT footer labels. Give plain text original/cypress geometries or images so I can create an options storyboard. Prioritize kitchen visual QA with screenshots then initial story evidence. No code modifications or merges.

**QA Agent:**

The kitchen at d4e3714 (galley rebuild 55a8259) is one counter with a large orders window. Three tickets shift left and the next number fills the right slot. With one ticket left, the rail stays full width and looks empty. The scrub card, wash line, greasy line, and mop handoff still behave as they did at 64ca82a. No code was changed.

df55e0c is not a commit on this branch. The shots below are from d4e3714.

Layout

| Check | What was on screen |
|---|---|
| Window | Pass on desktop. A 320×260 opening, Gloop inside it. On a 390px phone the ticket numbers are too small to read. |
| Gloop's hand | Partial. A green line leaves her head and ends in a white circle on the rightmost ticket. It does not touch NEXT. Standing at the oven offers GRAB, and that word is not visible. |
| Ticket shift | Pass while three tickets show. #1 #2 #3 becomes #2 #3 #4, NEXT on the left. |
| Rail with one ticket | Fails the "not oversized" check. #6 sits on the left. The rail and her arm still cross the whole window. |
| Oven | Pass for place. It is built into the right of the counter, under the pass. The hat is on Mops. COOK is the live action, and the word is hidden behind him. |
| Spice shelf | Pass. The cabinet sits on a shelf that meets the window's lower right. SPICES is readable on desktop. |
| Soup on the crate | Partial. A small yellow bowl sits on the crate. LEAVE SOUP is readable and covers Mops and most of that bowl. |

[images: CURRENT three tickets; CURRENT after one cook; CURRENT one ticket, full rail; ORIGINAL three tickets; ORIGINAL six tickets past the rail; CURRENT soup label; CURRENT phone]

On the phone page the canvas is 374×249. ORDERS, the green figure, the oven, and Reset section are recognizable. #1 #2 #3 and NEXT are not. At landscape, canvas 525×350, those numbers are readable.

Gloop's peek line, "What is that by the sink?!", sits on top of tickets #2 and #3 and cuts off the GLOOP and SPICES labels.

Geometries, canvas 960×640

ORIGINAL is 64ca82a. CURRENT is d4e3714.

```
ORIGINAL
  ticket anchor Hn            (250, 430)
  rail                        (170, 80) to (330, 80), 6px, #59657d
  tickets                     every remaining ticket, no cap of 3
                              slot d: (180+d*50, 84, 40×56)
                              six tickets run x 180–470, past the rail
  oven                        (204, 430, 92×96), under that rail
  orders window               (630, 130, 120×90), no body, no arm
  sink                        (480, 430)
  spices cabinet              (784, 140, 92×110), no sill shelf
  crate                       (170, 540)
  DONE peg                    (600, 266)

CURRENT
  ticket anchor Hn            (660, 430)
  window frame                (468, 16, 320×260)
  window interior             (486, 34, 284×200)
  red pass                    (504, 150, 250×22)
  Gloop origin                (730, 214), scale 1.28, clipped to the interior
  rail                        (490, 76) to (650, 76), 7px, #3d4c63
                              length stays 160px however many tickets remain
  tickets                     at most 3
                              slot d: (500+d*50, 82, 40×56)
                              hook (520+d*50, 76), number y 104
                              NEXT under slot 0 at (520, 152)
  arm                         (690, 150) to the rightmost hook, 14px, #7ad35a
                              hand circle radius 12 on that hook
  oven                        (608, 324, 104×140), label (660, 452)
  COOK                        within 110 of (660, 500), prompt (660, 360)
  GRAB                        within 80 of (660, 430), prompt (660, 120)
  counter                     (96, 300, 830×80)
  sink                        (480, 430)
  spices cabinet              (784, 140, 92×110)
  sill shelf                  (768, 246, 124×16)
  lower box                   (790, 258, 80×50)
  crate                       (170, 540)
  crate bowl                  (180, 448) when the bowl is on the crate
  LEAVE SOUP                  within 100 of the crate
                              box (92, 408, 176×34), text (180, 425)
  DONE peg                    (250, 242)
  window cone                 (690, 220), unchanged
```

Lines that had to stay whole

These still do.

Third scrub: CLEAN DISH, white plate, paw, yellow sponge, SCRUB 3/3. Jar still 0.
Wash set: "That goat washes FAST." The card is already gone. The bubble covers Gloop.
Greasy pot: "This pot is GLUED with grease!" The card is gone. On the phone the pot's own label is cut to GREAS because the bubble sits on it.
After the mop, Mops is at (760, 520), facing left, mop in hand, fully on screen. The same wash line is complete. Jar 12.

[images: CURRENT clean dish; CURRENT wash line; CURRENT greasy line; CURRENT Mops stays]

Suites on this commit: progression 9 passed, gas stop 16 passed, kitchen 43 passed.

Story choices, current pictures

docs/STORY-DECISIONS.md leaves all eight pending. These are the pictures that actually came up. Footer bars say CURRENT.

1. TV hide. On screen, in the kitchen, right after a wash set can start this scene: "Ooh, my show!" Then the station PA: "WOOKIE SPOTTED IN SPACE! Last seen near Stormtop." Then "That broadcast. Pump bots! Check the back!" Then a HIDE! banner. The timer read 5.33 seconds while the banner said HIDE! 6. The crate was highlighted. The "You watch the crate" exchange did not appear in the seconds I watched.

[images: CURRENT TV; CURRENT hide]

2. Stars. The hint on screen is "★ = points for finds." A secret find showed +50 SECRET! and the pill went to 150. A funny find showed +25 FUNNY FIND! and the pill went to 175. The dock line also showed +100 SNEAKY! The Chapter 1 "−100 CAUGHT" spark was not on screen.

[image: CURRENT stars]

3. After soup and gas. The kitchen path still fills the jar with 30 at the end of a wash set. The chapter-select Chapter 2 is a different game: a top-down map titled "CHAPTER 2 · ASTEROID BELT GAS STOP," with "CH2 COINS 0" and the objective "Talk to Grandma Gloop at the diner counter." Blorp is on that map. The later "wash dishes for Space Chili" objective was not the line on screen.

[image: CURRENT chapter 2 map]

4. Blorp. At the diner counter the line on screen is "EEK! A Squatch near my soup!" and Squatch says "SECURITY!" He moved from 319 to 389. The jar stayed 30. No pea line appeared. The third-ear chili joke was not this scene.

[image: CURRENT Blorp]

5. Guardians. The note that opened from the soup is "You're not alone out here." signed "— The Guardians," with a paw print. The pillow note and "MY GARDIAN BOX" were not opened.

[image: CURRENT Guardians note]

6 and 7. Zip and Harry. Jumping to those scenes from a fresh boot left a waiting card up, "Stormtop Cloud Resort, floating above Jupiter." The riddle and the dance prompt did not reach the screen.

8. Chapter 1 capture. Chapter 1 opens on "WOOKIE ALERT! PROTECT THE AIR SCRUBBERS!" The objective is "Grab the snack under your pillow." That is a different picture from the Chapter 2 holding pen.

[image: CURRENT Chapter 1 alarm]

The dock line that plays after the soup note is "Bots! Go watch the dock." Two pump bots are in the kitchen for it.

[image: CURRENT dock line]

**Squatch Game:**

Independent focused visual retest of latest branch cursor/wash-presentation-f809 @ db3a82c. This addresses your exact cases: phone~8 phys px digits, 1ticket rail scales, gloop properly arm/hand, actions unhidden, gloop&GREASY&leave soup no occlusion. Must review actual screenshots not just DOM traces. Check full galley without prompts and interact states, all tickets including new sequence shifting (important next at left always correct ordering?), full ordering sequence cook 1, all 6 eventually served cleaner. Check full portrait&landscape physical and desktop expected 960x640. Still test original six art items all keep pass + Reset section if present. Scope don't chase story further, ready means all selected kitchen evidence holds. Explicit PASS/FAIL with exact observed and important unintended regressions. No code changes/merge/deploy. Return only current after images composite recommended wide + phone if clean. No falsely complete based test suite. Longevity/runs not require awaiting user. If ready say ready independent QA at commit sha; else fail and early compact report.

Brian wants fresh eyes clean composition/layout not more local fixes. Don't run previous plan testing db3a82c. Instead take the current whole kitchen screenshot at db3a82c. Think as game art director/scenic designer not tester. Provide rigorous visual critique wrong sizes/geometry/tool positions stove/shelf/spice cabinet door and adjacent pass; identify that oven box floating perpendicular pane may not compare human height door. Include layered room composition not just labeling. Recommend 2-3 radically cleaner room compositions with all essential zones: diner entrance size reference vs characters, service window/gloop, pass/ticket, prep/cook station, sink/wash, crate/soup, grounded spices. Need user choose before code revisions. No merge deploy or code changes.

Reset: Brian wants fresh eyes on whole composition & clean sketch options, not minor iteration/full test. Current db3a82c door to DINER is way small than oven (oven replacement tick line has red next left but door real), spice area still strange. Write concise art direction with 2-3 whole-room composition options rather than testing again. No code changes while comparing. What would practical camera angle/good silhouette hierarchy solve with characters? essential function zones: side or rear diner entrance height character; large service window@gloop; order pass/tickets; real cooking line off window or pass beside physically legitimate oven and prep; sink dish station; crate foreground; spice storage near prep coherent mounts. Offer obvious spatial arrangement using primitive rectangles not exact game coordinates. May screenshot test overall no modifications. Do not write docs masterlist, only password return reference.

**QA Agent (art-direction critique; shown to Brian as options A/B/C):**

The room has two floors, so the door cannot set the scale. At db3a82c the red DINER door is a short plaque on the back wall. The oven is a darker, closer slab standing in the walkway, taller in the picture than that door. Squatch stands on a lower empty floor the door never reaches. Spices are a cabinet glued to the window corner, with a shelf and a hanging box that touch neither the counter nor the floor.

[image: Kitchen as it plays now]

A side camera with one ground line fixes the lie. Standing characters and the door share that line, so the door is the tallest vertical and a person reads as able to walk through it. The oven stays a low heavy box, shorter than the door, against the counter. The service window is the one large bright rectangle. Tickets live inside that opening. The crate is the near object, in front of the door. Spices are a cabinet in the same family as the door, shorter, feet on the floor or on the prep, beside the oven.

Silhouette order, front to back: crate and characters on the open floor, then the counter run (sink, oven, spices), then the window with Gloop. Nothing in the walkway competes with the door's height.

Three whole-room options. Rectangles only. Reply with one word.

SIDE. One back wall, one floor. Door at the left, full height. Crate in front of it. Along the wall: sink, then the pass under a large window, then a low oven, then a floor spice cabinet. Tickets hang in the window. Gloop is inside the glass. The cook stands at the oven. The washer stands at the sink.

```
[ DOOR ] [ crate ]     (window: Gloop + tickets)
[ DOOR ] [ crate ]  [sink][ pass ][oven][spices]
[ DOOR ] [ crate ]  [        one floor        ]
```

RANGE. The door is on the side wall, so its height is checked against a person in the doorway. The back wall is only the window and the pass. Under that pass is one low cooking run: prep, oven built into the run, sink at the near end. Spices sit on that run, next to the prep, not on the window frame. Crate is foreground, clear of the run.

```
side wall: [ DOOR = character height ]
back wall: [ large window + Gloop ]
           [ tickets on the pass ]
run:       [sink][ prep + spices ][ oven ]
front:     [ crate ]
```

BAY. A slight high angle. The floor is the stage. The side wall holds the door. The rear wall holds only the window. Across the middle, three boxes share one bottom edge: sink, oven, spice cabinet. The oven is wider than it is tall. The spice cabinet is taller than the oven and shorter than the door. Crate is closest to the camera, left. Characters read as dark shapes on the open floor, smaller than the door, larger than a ticket.

```
rear:  [ service window ]
side:  [ DOOR ]
mid:   [sink] [oven, low] [spices, grounded]
front: [ crate ]   characters
```

Reply SIDE, RANGE, or BAY. No revision until one of those is chosen.

_(The page shows this critique twice; it is the same text.)_

**Squatch Game:**

Fresh composition C implementation @ 6853902 on cursor/wash-presentation-f809 user picked C for separate stations/humor. Room was rebuilt with full-height diner door, sink left, smaller center 300 pass, 4burner range integrated counter right, jars grounded on counter. Independent visual+brief functional spotcheck not just code assertions. Check whole-room proportionate geometry floorlines/counter integration supports props not random free floating clutter, spice coherence jartray no high floating cabinet shaped, gloop reach has correct small compact window, actor door player. Physical coherence especially deliver cook clear mixing space window. Desktop default and p396/landscape. call feedback no need infinite polish but blocker catch paths original tests; new cooking hotspot x800 caps etc checks. All prior washes/greasy handoff labels and serving left-to-right rundown verify. Report concise with screenshot reference; no code changes or merge. If clean say PASS scoped composition C at commit. If not prioritize blocker list compact no unrelated TV ideas.

**QA Agent:**

PASS scoped composition C at 6853902.

The door is the tall piece. The counter is one bar on the floor line. The sink, the board, and the four-burner range sit in that bar. The jars stand on a low tray at the right end of the counter. The pass is the smaller window in the center, and Gloop's arm reaches the right-hand ticket from inside it.

[images: Desktop room; Phone 396]

| Check | Seen |
|---|---|
| Door vs player | Door runs the wall height. Squatch and Mops are the small actors on the floor in front of it. The range is shorter than the door and built into the counter. |
| Stations | Sink and plates on the left of the run, board in the middle, range on the right. COOK is the green pill at the range when Mops stands at x 800. |
| Window | About 300 wide. Tickets hang inside it. Face and arm read on desktop, on the 396 phone, and in landscape. |
| Spices | Three jars on a tray at counter height. No wall cabinet. |
| Serving order | #1 #2 #3, then #2 #3 #4, then #5 #6, then #6, then an empty pass. NEXT stays on the left ticket. The rail shortens with the row. |
| Wash and handoff | DIRTY DISH 1/3 and CLEAN DISH 3/3, paw and sponge. "That goat washes FAST." is whole, card closed. "This pot is GLUED with grease!" is whole, GREASY readable, Mops has the mop and no hat. LEAVE SOUP sits beside the door and does not cover DINER. |

Kitchen, gas-stop, and progression suites passed, including the cook hotspot at (800, 500). No code was changed.

The blank grey backsplash left of the pass is empty, and on the last ticket her hand sits on #6. Neither blocks the room or the labels.

**Squatch Game:**

Independent QA next PR #5 branch cursor/reliability-recovery-f809 head17a03c2 no code. Implement review verifies all high impact catch reset using original physical mouse/keyboard/touch possible. Critical caller blocked phone mode UI overlap test screenshot: reset button whether finger pressing? Front p text commands actual keyboard R hold .75 letgo vs third repeat. Captures Rusty catch current landing immediately no cue? Is user strictly security alerted first before capture; probe currently blocked vs earlier index catch. no mechanic dilution so no chosen new waypoint impossible safety. Common unified recoverForSection should compare exact full jar/reg/hand/star inventory resets checkpoint saved start BUT protocol after earned jar reset transiently? Brian wants no reward loop, not cookie snapshot before monetary buy? test bought soup then reset kitchen should durable buy/coin preserved correctly; no double reward earned wash set especially new help debts. checkpoint and unknown phase mapping list check. Read actual codefiles diff rather than run only test assertions; changed walkinpen fix possible 'Don't ignite pen trapped'. Do not call auto tests sufficient; test real manual keys mouse including pausecard touch tap. Capture phone and desktop reset visually no overlay at canonical twoactions. Whole main progression smoke, pumps sight correct intended unfair found? security no unapproved tiny nerfs, collisions push free edge rather than invisible? Sectionbefore g5 unknown should not lose durable progress. Pump blocking through pump ray fair key. fallback not unapproved resetting entire chapter unless ground support. Use independent evidence matrix difference implemented vs expected dims, fail any real bug with repro. No price/TV/Star or new chapter changes, no kitchen retweaks. Return scoped PASS or concise issues needed and screenshots of phone reset pen and state transitions. Post #5 stack #4 not merged; no merge/deploy.

**QA Agent:**

PASS scoped recovery at 17a03c2. PR #5 is already based on PR #4 and was not merged. No code was changed.

Reset keeps the jar, the register, what you are holding, and the stars, and it does not pay the wash a second time. A bought soup (jar 0, reg 30, has soup, 55 stars) survived a kitchen reset. Finishing a wash set set the jar to 30; the reset left it at 30.

| Check | Expected | Observed |
|---|---|---|
| Mouse tap on Reset | No restart | Stayed at x 700 with the soup |
| Mouse hold about 0.9s, then a second and a third | One restart each, soup kept | Each returned to the wash checkpoint x 230, y 520. Soup, register, and stars stayed |
| R for 0.4s, then let go | No restart | Still at x 640 |
| R for 0.5s on the lot, then let go | No restart | Still at x 400 |
| R held past 0.75s, then a later hold | One restart each | Both returned to x 230. The bar did not cover the stick or ACTION |
| Unknown phase g5 | Last real section, progress kept | Back to wash 5 at x 230 with the soup. Not the gas entrance |
| Rusty | The warning line before the pen | "SECURITY!" at 0.3s while control was still on. LOCKUP at 2.5s. Space then released to x 760, y 540, jar still 12, security gone |
| Pump rays | Unchanged | Open sight true. Under, far side, and through the body false |
| Crate | Push to a free edge | Walk right stopped on the crate's left edge at x 130 |

On a 396px phone with touch on, Reset section sits under the stick. It does not cover the canvas or ACTION. A finger hold restarted the section and kept the soup. The pen is a LOCKUP card; NEXT and Reset are separate.

[images: Phone reset clear of the two controls; Phone pen; Desktop R hold; Rusty lockup]

**Squatch Game:**

Small final documentation task only after recovery QA PASS. Update master backlog docs SSOT in PR5 to actual tested facts: current stacked PR5 based PR4 register branch and heads 17a03c2 and 6853902 appropriate; SS40-44 main pending vs PASS kitchen C including ground /pastdraw statuses; DE1 2 3 5 8 recovered verified only implemented/tested row evidence not old 321 current false; Reset section now shipped-pr5 rather than approved design goal not implemented notes. Recovery if rough mark exact recovery independent QA current evidence; no blanket all feedback full completion. Broader issues like boarding caption, unknown others remain backlog; don't mark DE6 or 7 unless QA confirmed (g3 board exception maybe image not explicit). Queue any updated qa status screenshot no code behavior changes, docs ONLY targeted status/evidence and SSOT. No TV/story decision code changes. Changelog straightforward. Return commit and PR. No merged deploy.

**QA Agent:**

Commit 0ab2781 on PR #5. https://github.com/catolandingham/space-snack-quest/pull/5 — still stacked on PR #4, not merged.

Docs only. docs/MASTER-BACKLOG.md is the status page.

PR #4 cursor/wash-presentation-f809 at 6853902. PR #5 cursor/p0-reliability-f809 at 17a03c2 (this note is 0ab2781). main stays 32156c7.
SS40–SS44 pass on kitchen C. Pastdraw through db3a82c keeps the earlier results, including the LEAVE SOUP door cover.
DE1, DE2, DE3, DE5, and DE8 use the shots and the recovery pass. The old 32156c7 / current-false mark for those rows is retired. DE4, DE6, and DE7 stay pending.
Reset section is shipped in PR #5. The independent pass drove wash 5, wash 1, g1, and unknown g5. The boarding caption and the other checkpoint rows stay open.

**Squatch Game:**

Prepare to independently verify live Space Snack Quest at https://space-snack-quest.onrender.com/ after PR #5 merges and Render finishes new deploy. Wait for my release SHA before starting; no changes to files/game. Required actual deployed browser passes (desktop and phone) for kitchen composition C and both touch + R hold reset; soup retention (jar0/register30), nonduplicate wash; Rusty capture lockup recovery; reachable normal progression; verify no errors. Return exact SHA evidence/screenshots and any failures; don't use test suite as sole live proof. Be ready soon.

RELEASE LIVE NOW: Render dep-dbn0dh7f3r2c73avsod0 status live for main 15051ec5ed7493e3dfca7571fdfb5ff25245d613. Independently fetched live HTML exactly byte matches that GitHub commit. Start browser actual deployed tests now. Don't change game or use a branch. Report honest detailed pass/fails with screenshots for kitchen phone & reset/livecapture. Failed browser environment or inability must be named, not completion.

**QA Agent:**

PASS on the live deploy 15051ec5ed7493e3dfca7571fdfb5ff25245d613. Render deploy dep-dbn0dh7f3r2c73avsod0 was the page under test. No game files were changed.

The browser loaded https://space-snack-quest.onrender.com/ (HTTP 200, last-modified Fri, 06 Nov 2026 16:56:47 UTC). That HTML is 587,516 bytes and SHA-256 5d25303aa9fd7656fe0bb12fd40580b07570763e4451bacccf7b4dd9c46c44c4, the same bytes as index.html at that GitHub commit. Chrome headless ran the desktop page and a 396×852 touch page. The only console error was 404 https://space-snack-quest.onrender.com/favicon.ico. No page exception.

| Check | Result |
|---|---|
| Kitchen C, desktop | Tall DINER door, sink left, three tickets with NEXT on the left, Gloop's hand on the right ticket, range in the counter, jars on the counter rack. Reset sits under the canvas. |
| Kitchen C, phone | Same room. Joystick, ROLL/ACTION, and Reset section do not cover the canvas. Reset is at (14, 605), 148×44, overlap area 0. Ticket 3's number sits under Gloop's hand. |
| Touch hold | Finger hold moved x 700 to 230 and kept jar 0, register 30, soup, 55 stars. |
| Mouse hold | A short press left x at 700. A hold moved x to 230 with the same soup, register, stars, and find. |
| R | 0.4s left x at 640. A hold past 0.75s returned to the sink at x 480. The bar sits on the floor. |
| Wash | E finished the set. The jar became 30 on "She thinks the goat did it." Reset left the jar at 30, register 4. |
| Rusty | "SECURITY! A Squatch on the lot!" while control was still on, then LOCKUP. Space landed at (760, 540) with control, jar 12, coins, security off. |

Key 1 on the title entered Chapter 1. The card read "Stormtop Cloud Resort, floating above Jupiter." Space advanced to "This is Squatch. He's a Sasquatch." Chapters 2–4 were locked, and the intro had not given movement yet. This was not a walk of a whole chapter. The soup check kept a placed jar 0 / register 30 / soup state. The BUY click itself was not replayed.

[images: Desktop kitchen; Phone kitchen and reset; Phone finger hold; Rusty lockup; After the pen]

_(end of project thread as scraped 2026-11-06)_
