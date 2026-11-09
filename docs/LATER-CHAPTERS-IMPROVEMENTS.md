# Later chapters: what Chapter 1 taught us, applied to Chapters 2 to 4
For Brian • Sunday, November 8, 2026, about 8:30 PM PST • proposals only, nothing built or approved

## How to read this
- **SAFE** means a bug fix or a consistency fix. It adds no new on-screen words, and it changes no difficulty, timer, price or detection range. It still goes through the normal rules: a reviewed PR, `npm test`, and your written yes in the PR before it merges.
- **NEEDS BRIAN'S YES** means it changes a story choice, adds or changes words, or could change how hard the game is. Each one comes with A/B/C choices, a recommendation and the reason for it.
- Some items say **"decided, words only."** You already made the choice. What's left is the exact words, which go in a lines file for you first.
- Where I checked the game, I read `origin/main` at `10030f6` (read-only). The line numbers point to `src/game/*.js` so a coder can find them. I didn't change, commit or push anything.
- Why Squatch's parents never came back is not explained anywhere in here. The game's only existing words about it are Mom's line in Chapter 4, "Sweetie, we didn't know where you were." That line stays as it is, and I add nothing to it.

## What Chapter 1 taught us (the rules we now follow)
1. **No teleports.** Every room change shows a visible walk-off and walk-in. A caption like "Mops goes out front." is not enough on its own.
2. **Adults are taller** than Squatch and Mops. Guests are a varied mix: some humanoids and a few clearly different aliens, not all blobs.
3. **Thoughts use the whisper bubble**: dashed outline, pale fill, soft gray text, no tail. Spoken lines use normal bubbles.
4. **Hiding looks like hiding.** In a bush, only Squatch's eyes peek out. When he needs to look ordinary, he rolls into a ball (the Ch2 kitchen already does this).
5. **Every new word goes through a lines file first**, and now you review it picture by picture as a cartoon, not as a script.
6. **Every paper and prop has a clear start and end.** We see where it comes from and where it goes: white copy stays, yellow copy is mailed, pink copy goes into the vent. Nothing just disappears.
7. **No story circles.** A character shouldn't learn the same thing twice, or act like they don't know something they were already told.
8. **Set up a reason before it's needed.** Squatch rolling into a ball outside the grate explains why he's there. Mops's crossed-off Mars explains why he says no.
9. **Reuse existing scenes and code**, and keep the look clean and the same everywhere (the style guide).
10. **Security behaves the same way every time**: someone sees him, help comes, and a catch only happens if security actually reaches him. In Chapter 1 that means someone runs to the wall alarm. After Chapter 1, you said a shout is fine.

---

## TOP 5 (the biggest wins, in plain words)
1. **Chapter 2 has to start where the new Chapter 1 ends.** Right now Chapter 2 opens with "Gas stop. Fuel light's blinking." and the whole goal is buying fuel for their own ship. In the new story they are passengers who get caught on camera and put off the UPS ship, so they need a new ride, not gas. (Needs your pick of the next ride. See C2-1.)
2. **Stop Chapter 2 from spoiling the Guardians secret.** After the soup note, Squatch whispers "A hoof stamp. Mops signed it." That means Squatch knows Mops wrote the notes. But in Chapter 4 he asks "...Then who were the Guardians?" and works it out. Cutting that one line fixes it. (SAFE cut. See C2-2.)
3. **No more teleports in Chapters 2 to 4.** Chapter 2 has six places where a character jumps rooms with only a caption: "Mops goes out front.", "Mops goes inside.", "Squatch sneaks into the kitchen." and others. Chapters 3 and 4 swap rooms the same way. Add the same visible walk-off and walk-in we use in Chapter 1. (SAFE. See X1.)
4. **Follow the paw copy all the way to Mars.** Chapter 4's big moment, "Something fell out... That's his paw.", only works if we've watched that pink paw copy travel: vent → Guardian Box → Moon Pie crate → Gas Stop → next ride → Zip's ship → Mars. Right now nothing shows that trip, and Chapter 4 still says "van". (Needs your yes on how it's shown. See X8.)
5. **Pay off Mops's crossed-off Mars.** Chapter 1 now shows Mops got a NO reply about Mars. In Chapter 3 Zip says "Sasquatches on Mars? Sure, they buy all my pretzels." and Mops only says "...". One whisper-bubble thought from Mops there turns a dead moment into a heart moment, and Squatch still doesn't know. (Needs your yes on the words. See X15.)

---

## Across all later chapters

### X1. Room changes are teleports. SAFE
**Problem:** Chapter 2 swaps rooms with only a caption and a position jump in six places (`20-ch2.js` lines 927, 957, 1076, 1116, 1291, 1383): "Mops goes back to the kitchen.", "Mops goes out front.", "Mops goes inside.", "Squatch sneaks into the kitchen.", "Mops brings the soup into the kitchen.", "Mops goes out to the pump." Chapter 3 (pad ↔ temple) and Chapter 4 (port → stand → van → inside → van → port) also set `n.room` directly. Some of these have a walk-off first, but none has a walk-in.
**Fix:** Use the existing walk helper so the character walks out the door they use, the next room is drawn, and they walk in from the matching side. The captions stay word for word. Control stays off during the walk, so nobody walks into a sight cone they couldn't see. Skip line 1383 (the walk out to the fuel pump) for now, because C2-1 will probably replace it.

### X2. Chapters 3 and 4 switches don't say why. NEEDS BRIAN'S YES (words)
**Problem:** Chapters 1 and 2 show a "You are MOPS now." card with a reason. Chapter 3 switches 5 times and Chapter 4 switches 6 times with no reason at all (no `SWITCH_WHY` keys).
- **A: one short why-card for every switch, like Chapters 1 and 2.**
- B: a card only for the first switch in each chapter.
- C: no cards, just the glowing face.
**Recommend A.** It matches the rule we already ship ("announce who and why") and keeps the kid from getting lost. That's 11 short lines for your cartoon review.

### X3. Rolling into a ball as a hiding move everywhere. Superseded by C20
**Superseded by C20** in `docs/DECISIONS.md` (Brian t228). The choice is no longer open. The player can press the action button to ball up (L2) whenever they want, in every chapter. It is a weaker hide than plants and boxes: a robot already looking at him, or close by, still spots him, and one passing at a distance may miss him. Escape night is a story spot where it fully works (C19: the player presses the action button and Squatch squats into the ball; it is not automatic). Exact detection numbers still need Brian's yes before any code.

The proposal below is kept so the old choices stay visible.

**Problem:** You made the ball a standard hiding move. In the game today it only works in the Chapter 2 kitchen, while Gloop's warning is up.
- **A: use the ball in story moments and cutscenes in Chapters 3 and 4 (for example, behind the crate on Mars), with no new button.**
- B: add a ROLL · into a ball action anywhere there are sight cones.
- C: leave it kitchen-only.
**Recommend A now, and maybe B after a replay.** A keeps the move feeling consistent without making any chapter easier. B is a real difficulty change, so it should wait until you and your kid have played it. That recommendation is **Superseded by C20**. Brian picked the action-button ball in every chapter, with the weaker-hide rule above.

### X4. Hiding poses match Chapter 1. SAFE (art only)
**Problem:** Chapter 1 now draws Squatch inside a bush with only his eyes showing. Later hides (the Chapter 3 barrel, the Chapter 4 crate and trash cans) use older poses.
**Fix:** Redraw only the hidden pose: eyes peeking out of the barrel, crate or bin. The hide spots, their sizes and the sight rules stay exactly the same. The PR shows before and after pictures.

### X5. Adults taller, and more varied crowds. NEEDS BRIAN'S YES (could affect difficulty)
**Problem:** Diner customers, Gloop, Rusty, the Mars locals and the troopers were drawn to the old sizes. Chapter 1's rule is that adults are clearly taller, and crowds mix humanoids with different alien types.
- **A: redraw the art taller and more varied, but keep every hit box and sight-cone starting point exactly where it is.**
- B: scale the whole character, hit box included.
- C: leave it.
**Recommend A.** You get the look you asked for with zero change to difficulty, and the existing cone-match test proves it. Sketch first, then build.

### X6. Thoughts versus speech. Mostly fine already (SAFE check)
Chapters 2 to 4 already use the whisper style for Squatch's asides ("She thinks the goat did it."). The coder just needs to check that every thought uses the whisper bubble and every line a nearby character reacts to is a normal bubble. The Chapter 3 "Did that barrel just talk?" joke works because Zip hears it, so it stays a spoken line.

### X7. Stage directions written as words. NEEDS BRIAN'S YES (words)
**Problem:** Lines like "*RUMBLE* She heard my stomach." and "I run on PANCAKES! (Back out the door!)" describe the action in text instead of showing it.
- **A: show it (a stomach-rumble sound and wobble, Rusty visibly backing out the door), and cut the bracketed part.**
- B: keep the words.
**Recommend A.** It's the Chapter 1 rule (show it, don't caption it), and it means fewer words for a young reader.

### X8. The paw copy's trip to Mars. NEEDS BRIAN'S YES (staging)
**Problem:** Chapter 1's paw proof is the pink copy in the vent. Chapter 4 has Mops find "His Guardian Box. Something fell out. ...That's his paw." Nothing in Chapters 2 or 3 shows the Guardian Box travelling. Chapter 4 also finds it in a "van".
- **A: at every departure and arrival (Ch1 crate → Gas Stop belongings → next ride → Zip's ship), a no-words shot of the little Guardian Box being carried. In Chapter 4 the pink copy, with the same color and carbon paw print as Chapter 1, slides out while Mops cleans with his beard.**
- B: show the box only in Chapter 2 and at the Chapter 4 discovery.
- C: no change.
**Recommend A.** It's the "every prop has a start and an end" rule, it needs no new words, and the Chapter 4 payoff lands harder. Still open from Chapter 1: how the pink copy gets from Mops's vent desk into the Guardian Box without Mops seeing the paw print. That has to be settled in the Chapter 1 cartoon first.

### X9. No mop prop, Mops cleans with his beard. Decided, words only (NEEDS BRIAN'S YES on the words)
**Where the mop still appears:** "Paws won't do it. Mops! Bring the mop!" · chip "Mops: mop the greasy pot at the sink" · switch reason "This pot needs a mop. Mops goes to get it." · "Employee of the Month: the mop. Every month." · Ch4 chip "Mops: mop the van floor" · ending card "Mops mops the pancake stand (badly)".
- **A: the pot handoff becomes teamwork. COOK makes the next dirty pot (your 8B) and Mops scrubs it with his beard. The new words go in the lines file.**
- B: keep the old words and only change the drawings.
**Recommend A.** You decided "beard for all cleaning"; B would leave words that don't match the picture. One question for you: is "Employee of the Month: the mop" a joke about Mops's name? If so, it can stay.

### X10. One lines review for all the later-chapter words
Many items below are already decided and only wait on words: dirty dish, COOK's pot, the Chapter 2 first-switch card, the Ch3/4 switch reasons, riddles, "van" → ship, Dad's pancake joke, travel cards. **Recommend** one picture-by-picture cartoon per chapter with every line in a bubble, the same way we're doing Chapter 1, instead of a written table.

### X11. Security works the same in every chapter. SAFE audit first, then NEEDS BRIAN'S YES for any timing change
The read-only security trace you approved for Chapter 1 should cover Chapters 2 to 4 too, so every catch shows security actually arriving before the lockup card. The trace only reports. Any change to timing or distance comes back to you as a choice.

### X12. Travel scenes between chapters (D18). Decided, words only
The new Chapter 1 ending changes the first travel card: they're on the UPS ship, then put off at the Gas Stop. The cards should name where they are, where they're going and why, and should match the new story, not the old fuel trip. The mini-game pick and length are still open (see OPEN-ASKS).

### X13. Learning the same thing twice: "That's ME?" NEEDS BRIAN'S YES
**Problem:** In the new Chapter 1, Mops's bedtime story tells Squatch he was the baby found in a shipment. Chapter 4 still treats it as news: Mops reads the poster and says "...Lost in a Moon Pie shipment. Your crib was a Moon Pie crate.", then Squatch says "...That's ME?"
- **A: in Chapter 4, Squatch recognizes it ("Like in your story...") instead of discovering it. The Moon Pie crate links back to the Ch1 escape crate.**
- B: keep Chapter 4's surprise and take the shipment detail out of the bedtime story.
- C: keep both as they are.
**Recommend A.** It removes the story circle and turns a repeat into a callback. Mops still only knows he found a baby; the parents' poster is what tells them who and where.

### X14. Mops's "Have you seen?" flyers and the parents' poster. NEEDS BRIAN'S YES (art)
Chapter 1's detective wall shows Mops searched for Squatch's family with "Have you seen?" flyers. Chapter 4's poster says "our baby HARRY / Please bring him home / every year, just in case."
- **A: draw both in the same simple poster style so a kid sees the match: both sides were looking.**
- B: leave them different.
**Recommend A.** It's art only and adds no new reason for the parents. It just shows both sides searching, using words that already exist.

### X15. Mops's crossed-off Mars pays off in Chapter 3. NEEDS BRIAN'S YES (words)
**Problem:** Chapter 1's detective wall shows Mars crossed off with a NO reply. Chapter 2 has a Mars postcard on the kitchen wall ("Greetings from MARS! Big furry pancakes! Wish you were here — B.") and Mops says "Furry pancakes... on Mars. Hm." In Chapter 3 Zip says "Sasquatches on Mars? Sure, they buy all my pretzels." and Mops just says "...".
- **A: at Zip's line, Mops gets a whisper thought bubble (draft idea: "That letter said NO..."). Squatch doesn't see it.**
- B: leave the "...".
- C: Mops says it out loud.
**Recommend A.** It's the "set it up, pay it off" lesson and uses the whisper style. C would tell Squatch Mops was searching too, which spoils Chapter 4. **Small check:** who is "B." on the Chapter 2 postcard? If it's no one in particular, I suggest cutting the signature so it doesn't look like a hint from the parents.

---

## Chapter 2 (Gas Stop and diner)

### C2-1. Chapter 2 still starts with a fuel run. NEEDS BRIAN'S YES (big; this was already a "later" question)
**Problem:** The game opens with "Gas stop. Fuel light's blinking." The goal is soup or gas ("Soup is 30. The tank is 30."), then paying Rusty and flying their own ship ("Bots on the ramp... Next stop: Phobos!"). Your 2A says they're passengers who get put off, and the wages buy soup and then another ride.
- **A: they pay another delivery driver who's heading to Phobos.**
- B: they buy seats on a passenger shuttle to Phobos.
**Recommend A** (same as before). It keeps the delivery road-trip feel and leads naturally to Zip's daily Mars route. **Important:** the 30-coin tank price does NOT turn into a fare without your yes on the amount. Soup stays 30, and the wages and the hungry-choice moment stay. A related question you haven't answered yet: if they packed lots of snacks, why buy soup? I recommend the snacks stay in the UPS cargo when they're put off.

### C2-2. Squatch is told the Guardians secret too early. SAFE (cut only)
**Problem:** After the soup note (`20-ch2.js` line 1319), Squatch whispers "A hoof stamp. Mops signed it." That contradicts Chapter 4's "...Then who were the Guardians?" and the rule you chose: the player sees Mops write the notes, Squatch doesn't know. The reconcile plan already listed this exact line as a cut.
**Fix:** Delete that one line. Keep the slow hoof-stamp close-up and "THE GUARDIANS FOUND ME IN SPACE!". Record the cut in the lines file so you see it. Add a test that no Chapter 2 line tells Squatch who the Guardians are.

### C2-3. Mops whispers through a wall. NEEDS BRIAN'S YES (staging, no new words)
**Problem:** Mops is at Gloop's counter inside the diner, and Squatch is hiding outside by the pump. Mops whispers "Squatch... the kitchen has a back door." and the scene cuts outside. Squatch couldn't hear that, and the story bible already says this exact moment was replaced.
- **A: Mops walks to the diner door, steps out, and says the same line by Squatch's crate. Then the switch card plays.**
- B: cut the line and let the switch card ("Mops found work. Squatch sneaks in the back.") carry it.
**Recommend A.** Same words, one visible walk, and it fixes the teleport.

### C2-4. The mop, and what COOK does. Decided (7 and 8B), words only
See X9. COOK visibly makes the next dirty pot, and Mops brings it over and cleans it with his beard. No extra coins and no new chore timer.

### C2-5. Putting a dish away dirty. Decided (D17), words only
Gloop gets upset and the dish comes back dirty. It's a joke, not a fail: no coins lost, no lockup. Gloop's reaction lines go in the cartoon for your yes.

### C2-6. First switch in Chapter 2. Decided ("send line"), words only
**Recommend** reusing Chapter 1's zoom-in card exactly, so there are no new words if you've approved the Chapter 1 wording. If you'd rather it be specific to Chapter 2, it gets one new line.

### C2-7. Rusty's red "R" cap looks like Mario. Decided (D13). SAFE (art only)
Grease cap and fuel-drop badge. Only the drawing changes. His cone width stays the same until your replay (E22).

### C2-8. Kitchen window and sink look wrong (D12). Waiting on you
You said to ask the player what looked wrong first. Nothing moves until then.

## Chapter 3 (Phobos)

### C3-1. Why Phobos, and how they got there. NEEDS BRIAN'S YES (follows C2-1)
Once the Chapter 2 ride is chosen, the arrival needs one travel card ("Phobos, the little moon next to Mars") and a reason for the ride stopping there. Mops's opening line "Folks here still jump at a Squatch. Searchlights and gate bots lock you up." tells the danger instead of showing it.
- **A: show the danger once, with a searchlight sweeping past and a gate bot, then cut the second sentence.**
- B: keep the line as it is.
**Recommend A.** It matches the Chapter 1 lesson that bystanders' reactions teach the danger, not a speech.

### C3-2. "Mops! Sing to the rovers. Like at the gas stop!" NEEDS BRIAN'S YES (words)
**Problem:** Squatch tells *Mops* to sing, but in Chapter 2 it was Squatch who sang from the crate, and two lines later Mops says "You sing, I turn." The line also points back to a Gas Stop scene that C2-1 may change.
- **A: "I'll sing to the rovers. Like at the gas stop!" (fix who sings; update "gas stop" if C2-1 changes that scene).**
- B: cut the line and let Mops's "You sing, I turn." set up the plan.
**Recommend A.** It's the smallest fix, and it keeps the song tying the chapters together.

### C3-3. Many riddles, one per game. Decided (D6), words only
Write lots of riddles. If the echo riddle comes up, Zip teases himself for picking such an obvious one. Still open: whether the same riddle can come up twice in a row.

### C3-4. Mops's sad walk and the low-gravity fall must be seen. SAFE (staging, existing words)
"I'll... get some air." → "Whoa. Low gravity." → "MOPS?!" Draw Mops walking off sad and floating up, so the rescue has a cause the player watched. Same words, no timing changes to gameplay.

### C3-5. Zip shouting and shoving with no security around. Waiting on you
This is an exception to the security rule. Leave it as it is until you decide.

## Chapter 4 (Mars)

### C4-1. "Van" should be a ship. Decided (VEHICLE: ship), words only
Chips and lines: "Mops: mop the van floor", "Squatch: go out to the van", "Go wait in the van, Mops." Recommend "ship" in each, with Mops cleaning with his beard. Still open: *which* ship. It should be the one they actually came on (Zip's), which follows C2-1.

### C4-2. Dad's "Health rules" line. Decided (DAD: pancake), words only
Swap it for the pancake-hair joke. The new words go in the cartoon for your yes.

### C4-3. The long "Ever since..." ending card. Decided (ENDING: image)
Replace the paragraph with one closing picture: singing out in the open, the parents, GOATS EAT FREE, a pancake on the floor, and Mops cleaning with his beard. **Recommend** a sketch first, then build. The picture's only words are already in the game.

### C4-4. Locals' fear is told, not shown (T28). NEEDS BRIAN'S YES
Same approach as C3-1. **Recommend:** a searchlight and a frightened local pointing, before Mops's line, then shorten the line.

### C4-5. "That's ME?" repeat. See X13. The poster match: see X14.

---

## Order I'd do this in
1. Now, SAFE and reviewed through the normal process: X1 (except line 1383), C2-2, X4, C2-7, C3-4. See OPEN-ASKS "Can start now".
2. Next, one cartoon per chapter for your yes on the words: X2, X7, X9, X13, X15, C2-3, C2-5, C2-6, C3-2, C4-1 to C4-3.
3. After you pick the Chapter 2 ride (C2-1): the new Chapter 2 opening, travel cards, X8 paw-copy trip, C3-1.
