# Angle: docs that contradict each other (Chapter 1)

Rule used: newest wins. All of today's (2026-11-22) DECISIONS sections beat older docs. Quotes are copied from the docs. Doc paths are under ~/Code/space-snack-quest/. I did not search the raw Grok threads for new quotes beyond one check on the catch rule; where I say "Brian's words" they are quoted inside a repo doc.

## 1. The party never ends by itself, but today's decision says a never-caught party ends at closing time
- **Assume:** walkthrough beat 16 says "If none of that happens, after about 3 minutes of party play the disguise comes off anyway." DECISIONS R68 (Nov 11) says "Q4 stays the approved 3-minute 'Cool hat!'", and the clock pauses "during the dance and the karaoke" (Q17).
- **Conflict:** today's "Party ending, Brian 2026-11-22: '(A)'": "never caught (closing time: the speaker announces it, guests leave, Mops finds him while cleaning and walks him home)", and "Brian added: 'think about points because [his kid] loves to play the chapter perfectly'." A perfect run cannot exist if the disguise always falls off at 3 minutes. Walkthrough Open question 4 still offers A/B/C for the same timer and recommends B (balloon or octopus as the sure ending), but the balloon is now out. OPEN-ASKS B2 says "Cool hat!" is superseded; R68 says it stays. The docs disagree with each other, and today's decision disagrees with both.
- **Effect if wrong:** a kid who plays carefully is still caught at minute 3, so "never caught" and "PERFECT CHAPTER!" never happen. Or the timer is built and the closing-time ending is never reachable. The pause-during-dance/karaoke clock (Q17) also has nothing to pause on, since those are out.
- **Winner:** today's closing-time ending. Loser needs updating: beat 16 (delete the 3-minute fallback), Open question 4 (close it), R68's Q4/Q17 lines (mark superseded).
- **Question for Brian:** how does a never-caught party end, and how long is it? (A) No disguise timer; the party runs a set length (about 3 minutes) then the closing-time announcement, recommended. (B) Keep the 3-minute timer and make the closing time come before it. (C) Something else.

## 2. A catch at home: "sets him back a little" (today) versus "restart the current scene" (Nov 16)
- **Assume:** today's "Claude's design calls" item 7: "A catch at home shows the lockup card, then sets him back a little (Brian, Nov 14)." Walkthrough beat 18 says the same.
- **Conflict:** DECISIONS K29 (Nov 16, 12:50 PM PT), Brian: "Every catch: jail card, then restart the current scene; split long scenes like the party into shorter ones." K29 says it "supersedes ... the 'set back a little where he was caught' rule (Sat Nov 14...)". OPEN-ASKS R8 and R23 (five party scenes) say the same. Item 7 cites an older Brian message over a newer one. CLAUDE.md "Conventions" says "the section restarts", a third wording. Today's perfect-play pick says "any single part can be replayed", which assumes restart points exist.
- **Effect if wrong:** a caught kid is dropped mid-room instead of at the start of the scene. Caught-at-home leaves different state than the rest of the party (flyer, fur) and may break beat 19.
- **Winner:** K29 (Nov 16) beats item 7 (cites Nov 14). Loser: today's item 7, walkthrough beat 18, CLAUDE.md wording ("section" to "current scene").
- **Question for Brian:** when the guard catches him at home, what happens after the lockup card? (A) Restart that scene, as you said Nov 16, recommended. (B) Set him back a little, as on Nov 14.

## 3. "Goal chip at the top" (CLAUDE.md) versus today's outline with words only if stuck
- **Assume:** CLAUDE.md rule 11 "The player always knows the goal"; HUD zones "top center: goal chip"; `tests/hud-layout.mjs` checks it. DECISIONS K2 (chip names the step), K7 (after 60 seconds stuck, the chip shows the method line), K27, OPEN-ASKS B21 (chip stays until the song lines play), walkthrough beat 4 goal bar "Squatch: sneak to the plant", beat 39 "a goal keeps saying 'go home'". K8 (Nov 8, Brian): "No idle auto-hints."
- **Conflict:** today's "Goal words: 'Outline; words if stuck'": "No goal line at first; if the kid does nothing useful for about 20 seconds, a short goal line fades in. This replaces v1's always-on goal bar." So: 20 seconds today versus 60 in K7; auto hint versus K8's "No idle auto-hints"; always-on chip versus nothing at first.
- **Winner:** today. Loser needs updating: CLAUDE.md rule 11 and the HUD line, K2/K7/K8/B21, beat 4 and 39 goal-bar text, the hud-layout test.
- **Open part:** the CLAUDE.md Conventions also say "The chip names who acts: 'Mops: walk to the diner door.'" Nothing says whether that who-acts chip survives (it matters when the player switches between Squatch and Mops, later chapters).
- **Question for Brian:** when the goal line does fade in after 20 seconds, where does it show and does it go away? (A) In the existing top-center chip zone, names who acts, fades out when the step is done, recommended. (B) As a bubble over the character.

## 4. Disguise: one "on/off" outfit (today) versus three levels and partial loss (R4, R6)
- **Assume:** OPEN-ASKS R3 "Security sees through any disguise", R4 "Three disguise levels", R5 alarm ladder "'!' then '?' then the alarm", R6 "Losing one piece of the disguise drops him to partial" (all Approved, not built). Walkthrough beat 7: "Any outfit works" with a slot-based meter.
- **Conflict:** today's outfit decision: "What the kid drags on in dress-up is what Squatch wears all party; snags and tugs pull off whatever is on him." The sight-cone decision: "The disguise slows guests down further ('Nice gloves', then 'fur!')". Nothing says whether a half-dressed Squatch is slower to be spotted than a full one. R5's order "'!' then '?'" is the reverse of today's guests "'?' first and '!' only if he stays too long".
- **Effect if wrong:** the kid sees a full meter and a bare hat both treated the same, or the kid tries to play the meter and nothing changes.
- **Winner:** today for the R5 order (R5 is superseded). R3 is consistent with today (security "!" right away). R4 and R6 are real open questions.
- **Question for Brian:** does a better disguise change how long a guest takes to get suspicious? (A) No, any filled meter is the same "disguised" state; a snag removes one piece but guests act the same, recommended. (B) Yes, three levels as R4 says.

## 5. Points: "Never caught! +250" once per chapter, or per part?
- **Assume:** STORY-DECISIONS D1 and OPEN-ASKS E6: "Never caught! +250". Today's kept rules: "+50 a secret, +25 a funny find, 'Never caught! +250', ... photo corner 25". Walkthrough beat 10: dance "10 points per hit ... close to the 'Never caught!' +250"; karaoke up to 50 (both now cut). OPEN-ASKS E7: "Hidden +100 awards vs the 'points for finds' wording", still waiting.
- **Conflict:** today's pick "B": a "clean" check for each of four parts, with perfect meaning every part clean. Nothing says what the +250 attaches to. The "7 of 9" secrets count needs a defined 9 (the walkthrough does not list nine secrets). Beat 13 says the photo corner gives "Bonus points" (pending) while today's rules fix it at 25.
- **Question for Brian:** what does "Never caught! +250" go with now? (A) Once, for a perfect chapter (all four parts clean), recommended. (B) 250 for each clean part. (C) A smaller number per clean part plus 250 for perfect.

## 6. Dress-up: "snap on, sized to fit" (walkthrough) versus "put it more or less wherever" (today)
- **Assume:** walkthrough beat 7: "Pieces snap on, sized to fit, never floating"; "Head, face, body and legs/feet are 20% each, and each accessory adds 5% (up to 20%)".
- **Conflict:** today's design call 1: "Dress-up pieces stay where the kid drops them on Squatch (G Bot #603: 'you should be able to put it more or less wherever')". A meter that counts head/face/body/legs slots cannot work if the pieces go anywhere. Today's meter line only says it "fills as pieces go on".
- **Winner:** today for placement. Loser: beat 7's meter math.
- **Question for Brian:** what fills the "Disguised enough" meter? (A) Each piece dropped on Squatch adds a fixed amount, so any placement fills it, recommended. (B) Areas covered, so where it goes matters.

## 7. Snack bar: yellow outline in the "locked" picture versus no outline
- **Conflict:** the party hall room sheet in CHAPTER-1-PROBLEMS: "The yellow outline around the snack bar is part of that picture." The locked-rooms README lists `hall-room-empty-v1.png` as the locked hall. Today: "Locked pictures: Brian 'Good with two and three'": a new locked hall "without the painted yellow outline around the snack bar", and "Optional things: 'They discover them'". BRIAN-LENS and the room sheet "Marks on screen" say "The thing to use glows or is outlined", with no "only if required" limit.
- **Winner:** today. Loser: room sheet line, README table (until a v2 is locked, v1 stays the only locked hall; nobody may paint over it), BRIAN-LENS wording.
- **No question: the evidence settles it as removing the outline, in a new locked version shown to Brian first.** Note the same applies to the home room (new speaker picture); the README lists only v5 and has no v6.

## 8. Squatch's public voice: karaoke, conversations, and CLAUDE.md rule 7
- **Assume:** walkthrough beat 11: Squatch sings at the stage mic ("howls"), beat 8: "He can join guests' conversations."
- **Conflict:** CLAUDE.md rule 7: "Squatch talks to no stranger until Chapter 4.4. Singing only at lure spots and scripted bond moments." DECISIONS S10: "The song button is always visible, which doesn't mean he can sing anywhere." Today keeps karaoke as "last, only if those play well", so it is still in. Nothing reconciles it with rule 7.
- **Effect if wrong:** the kid finds Squatch singing at a public mic in a room where he is hiding, which is the opposite of the story's tension. Guest chatter lines are "not written yet", so "join conversations" has no design.
- **Question for Brian:** is karaoke an exception to the singing rule? (A) Cut karaoke and "join conversations" so rule 7 stays whole, recommended. (B) Keep karaoke as a named exception, in grunts only, no words.

## 9. Snack pyramid: three different triggers
- **Conflict:** walkthrough beat 14: "Grab from the bottom and the pyramid topples"; and "he can take as many as he wants". OPEN-ASKS F9 (R60): "The third snack-table grab starts a chain reaction". Today: "the pyramid topples only after too many snacks (a tuning pin, start near five)", and the bartender separately catches ("...Nice gloves", then fur and the alarm). Beat 14 also still has Squatch able to take unlimited snacks, which fights the new one-snack lesson only if today's version is read as "limit".
- **Winner:** today. Loser: beat 14 and F9.
- **Question for Brian:** can the kid hit five snacks without the bartender catching him twice first? (A) Yes: the bartender only catches when she glances while the paw is in; the count is separate, recommended. (B) The bartender's second catch always comes before five.

## 10. Dance, balloon and bouquet still live in beats the decision removed
- **Conflict:** walkthrough beats 9 (conga, chicken dance, bouquet toss), 10 (full dance game), 15 (balloon), 16 (balloon as a catch cause), 25 ("balloon still there"), 57 ("the old balloon pops"). OPEN-ASKS R24 already said "Robot dance only. There is no bouquet toss", F8 (balloon). Today: dance and balloon "Out for now", conga, chicken dance and bouquet toss "background only". The DECISIONS section also keeps the earlier "Keep, simplified" line first, with "This replaces" only later in a different bullet. Easy to read the wrong one.
- **Winner:** today. Loser: those beats need an "OUT FOR NOW" tag; the Day 2 balloon continuity (beats 25, 57) and "keeps it" as a catch cause disappear.
- **No question: the evidence settles it as out for now.** Brian's own words: "I don't think the dance game ever worked. I'm okay skipping photo corner and simplified baloon unless you are confident of making it work."

## 11. Cone rule history is wrong in three places
- **Conflict:** walkthrough beat 16 says "The Nov 14 dashed-cone line below is not the rule" and that guards and robots only is the rule. DECISIONS line 610 says "Nov 11 (t332): only guards and robots ... supersedes the Nov 14 dashed cone on everyone". But OPEN-ASKS R1 (Nov 16 4:02 PM PT, Brian) already restored "Everyone who can see him gets a faint dashed cone". Today's Sight cones section says it supersedes "the Nov 16 rule ... (cones only on guards and robots)", which is not what R1 says.
- **Winner:** today's cone decision (everyone, dashed then yellow; guests "?" then "!"; guards and robots "!"; Mops hearts). Loser: beat 16 text, line 610, R5, and the description of the "Nov 16 rule" in today's section (it was Nov 11 + a Nov 16 restore).
- **No question: the evidence settles it.** Only stale text to fix.

## 12. Morning: "no beard cleaning" and song at the door versus today's order
- **Conflict:** walkthrough beat 2: "Mops hums it at the door ... No beard cleaning in this scene (Brian: Mops is not cleaning all the time)"; beat 1 bubbles "Morning, Squatch." and "Stay in here."; R96 (the song lines and "Mops walks over and stands next to Squatch before they sing"). Today's "Morning order: 'Your latest order'": speaker wakes Squatch "while Mops keeps mopping, then a beard-wringing cutaway", song announced, "Mops says something like 'Floating in space, it's our favorite song'", then "v1's current opening lines get replaced."
- **Winner:** today. Loser: beats 1 and 2, R96, R13 and the mop-bucket row (a wringing cutaway needs a bucket; R13 says "Awaiting yes"). The "no beard cleaning" note is directly reversed by the cutaway.
- **No question:** the order is settled; the lines still need Brian's yes word for word.

## 13. Raising the alarm: "FUR! Security!" shout (beat 17) versus wall alarm only (today)
- **Conflict:** beat 17: "A guest shouting for security instead of pulling the alarm is also fine (t111u)", with the pending line "FUR! Security!". Today: "In Chapter 1 whoever sees Squatch runs to the FUR ALARM on the wall and pulls it ...; shouting for security is allowed in later chapters", and design call 4 gives the guest "FUR!" only.
- **Winner:** today. Loser: beat 17's "also fine" sentence and its line.
- **No question.** New words wait for Brian's yes anyway.

## 14. Walkthrough "Open questions" and some "(pending)" lines are stale
- Open question 4 (the "Cool hat!" timer): see finding 1.
- Open question 5 (where is Mops at lunch): R84 (Nov 11) says "Mops is in the hallway at lunch", and beat 25 already shows the hallway. It is no longer open.
- Beat 32 says "Something calls him away (what is still open)"; R84 and today's call 15 settle it: a damaged crate in the mail room.
- Beat 38 still lists two lines ("I swear we had more Moon Pies..." and Mops "Quick, hide."); today's call 16 says "the two unapproved lines are cut".
- Problem 3 in CHAPTER-1-PROBLEMS still says "Needs Brian: one pick" under a header that says he picked.
- **No question: update the text.**

---
Summary of who needs what: findings 7, 10, 11, 12, 13, 14 are pure stale text (no question). Findings 1, 2, 3, 4, 5, 6, 8, 9 each need one multiple-choice question.
