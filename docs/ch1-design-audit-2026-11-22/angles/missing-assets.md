# What the Chapter 1 design needs that does not exist yet

Method: read walkthrough beats 1 to 61, DECISIONS 2026-11-22 sections, locked-rooms README, v1 music folder, v2 approved assets, G Bot / Squatchbot threads. Counts are mine (grep of the walkthrough). Where I paraphrase Brian I say so.

## What already exists (copy, do not remake)
- Nine locked room pictures (v1 `docs/locked-rooms/`, also in v2): party hall v1, hallway v6, manager's office v2, home closed/open v5, loading bay day / no-ship / night / pickup.
- v2 `assets/approved/`: `floating-in-space.mp3` (32.6 s), `wookiee-growl-1.mp3 (file name changed here)` (5.6 s growl), `mops-approved-nov8.png`, `speaker-option-4.png` (Brian's pick), six guest sprites (teal woman, camera tourist, backpacker, stilt, octopus, robot tourist).
- v1 `music/main-theme-from-brian.mp3` (3 min 55 s, "Joe's theme"). v1 has no copy of Floating in Space or the growl; they must be copied over (each with Brian's yes per DECISIONS "Which repo is the base").
- v1 draws everything else in code (Squatch, Isfred, Croc Boys, bartender, guards, robots, plant, sound effects as Web Audio oscillators). I found no approved still of Isfred, the Croc Boys, the bartender, guards, the three delivery robots, Dot/Bob/Lou, or the kid. STYLE-GUIDE only says workers and manager "keep the current sprites".

## Count of words still pending
- Walkthrough beats 1 to 61: **83 lines marked pending**, 17 decided, 3 "Brian yes". They sit in 41 of 61 beats.
- Biggest clusters: beat 48 vent workstation (6), beat 7 dress-up (5), beat 59 "Where's Mops?" (5), beat 28 ship announcement (4), beat 5 Isfred (4), beat 11 karaoke (4, optional), beat 37 hallway wall (4).
- Not in that 83, also unwritten: the new morning (speaker announcement, "Floating in space, it's our favorite song", Mops mentioning the party, Dog Zylan line), the closing-time announcement, the "if stuck" goal lines, the second suspicion line, the clean-check end card ("7 of 9", "???", "PERFECT CHAPTER!"), the lockup card, the Croc Boys sung line, Open question 18 (nameplate), the balloon "Scary Wookiee!" (out for now).

## Findings (15 max, most important first)

1. **The Croc Boys' sung line is decided but is in no doc and no code.**
   - Assume: the band is a dim-the-lights moment, only "put your hands together" is written (beat 6).
   - Evidence: Brian [G#318]: "Lets have it be the name of the planet or station- vania 12345". Bot repeated "Stormtop-vania 1-2-3-4-5!" [G#319]. Grep of docs and src finds no "Stormtop-vania". Bot said a horn-and-xylophone jingle was "already being made" [G#326]; no file exists on disk.
   - Effect if wrong: the band is silent; the one joke Brian asked for at the party is missing.
   - Question: Bring back "Stormtop-vania 1-2-3-4-5!" shouted by the band with a short instrumental jingle (recommended), a jingle with no words, or drop it?

2. **No party music exists at all, and the bot's picks were never approved.**
   - Assume: "Joe's theme" plus Floating in Space cover the chapter.
   - Evidence: Brian [G#321] "You pick and surprise"; bot listed a lounge groove for the party, a Croc Boys bit, and offered two more [G#326]. Brian only said [G#325] "Probably need a few songs yeah?". v1 music folder holds one file. Brian also [G#318]: "don't like the theme song :/ definitely not the singing part", and the bot said the theme "stays as it is for now" [G#322] but then said the theme gets "a new tune" [G#323] (bot contradicts itself).
   - Effect if wrong: the hall, the dress-up screen and the night walks are silent; or the "wrong" main theme is kept or replaced without his say.
   - Question: Keep Joe's theme as is and make one quiet party loop plus the band bit, for him to hear before it lands (recommended), or leave the party silent for now?
   - Needs Brian: a listen and a yes. Claude can generate nothing real without him approving the sound.

3. **The vent workstation (beat 48) has no locked picture and carries the most pending words.**
   - Assume: it is a room like the others.
   - Evidence: STATE says "no rooms module for the workstation", sketch-06 only. Six pending lines (board, flyers, labels, Mars reply letter, whisper, new Guardian note). The Mars letter says "There are NO Sasquatches on Mars" in a kids' game.
   - Effect if wrong: the chapter's emotional reveal (Mops writes the notes) is the least ready picture.
   - Question: Show Brian one still of the workstation plus the six lines as one card (recommended), or approve lines first and draw after?
   - Needs Brian: a look and word-for-word yes.

4. **Story pictures for the TV show and the bedtime story do not exist as approved art.**
   - Assume: "the one we built before" [G#603] is findable and usable.
   - Evidence: Brian [G#603]: "Wookiee TV panel. Just go with the one we built before. I don't remember the scene from that." Only three small TV pictures with two unapproved captions exist in v1 code (`docs/old/audit-shots/day1/tv-1.png`, `tv-2.png`; PROBLEMS item 16). Brian decided "Full-screen story" and "TV story is pictures only until Brian approves words". Bedtime: Mops and baby only, no parents (beat 21); the bedtime flashback was dropped from Ch1 in GUARDIANS-STORY-BRIEF yet beat 21 is a live story. Open ask A34 lists the bedtime picture as not drawn.
   - Effect if wrong: a kid taps through three tiny TV pictures where Brian expects full-screen story art, or a stale caption ships.
   - Question: Draw 3 full-screen TV pictures (fur in the scrubber, alarm, Isfred walks them out) and 3 bedtime pictures (crate, baby, Mops), shown as one sheet first (recommended), or reuse the small TV pictures?
   - Needs Brian: a look. Words wait for his yes either way. The growl exists (`wookiee-growl-1.mp3 (file name changed here)`, 5.6 s) but nothing says it plays on the TV; the bot said "TV is silent" [G thread, 11-22].

5. **Two new locked rooms are promised but not made.**
   - Evidence: DECISIONS: Brian "Good with two and three": new home room with the approved speaker (option 4) and party hall without the painted yellow outline, each shown as a picture before locked. `home-room-empty-*-v5` has no speaker; the hall v1 still has the outline.
   - Effect if wrong: morning scene has no speaker to point at (beat 1 and the whole new morning order); hall outline contradicts "optional things have none".
   - Question: Make home v6 and hall v2 now, show both, then lock (recommended)?
   - Needs Brian: a look and a yes. Claude can draw.

6. **Morning scene (beats 1 and 2) words in the walkthrough are stale and the new ones are unwritten.**
   - Evidence: Walkthrough beat 1 still lists "Morning, Squatch." / "Big party in the hall tonight." etc. as Brian yes Nov 14. The 2026-11-22 morning order replaces v1 opening lines and says new lines "still need his yes word for word." Needed: speaker announcement, Dog Zylan line (bot-chosen, Brian agreed to "go with the bot's picks on all six questions" [S#1391]), "Floating in space, it's our favorite song", party mention. Also a beard-wringing cutaway picture.
   - Effect if wrong: old lines survive, or Claude writes lines Brian has not seen.
   - Question: Show the 6 morning lines as one card for a word-for-word yes (recommended), or approve the Nov 14 lines as they are?
   - Needs Brian: a yes. Cutaway picture can be made without him, then shown.

7. **Closing time (the never-caught ending) has no words, no sound, no picture.**
   - Evidence: DECISIONS party ending: "closing time: the speaker announces it, guests leave, Mops finds him while cleaning". Walkthrough has no beat for it. Nothing exists: announcement line, guests-leaving picture, Mops-finds-him moment (Mops's hearts cone), and the "Everyone out there has someone" line for the never-caught path (Guardian note line in beat 22 "may need a wording change").
   - Effect if wrong: the perfect-run kid, whom Brian cares about, reaches an ending that is a gap.
   - Question: Claude drafts the announcement and Mops line for one yes (recommended), or Brian writes them?
   - Needs Brian: words. The picture is the existing hall with guests walking out; Claude can make it.

8. **Dress-up needs about 12 clothing pieces drawn, plus a white-background Squatch, none approved.**
   - Evidence: beat 7 lists top hat, scarf, button nose, corn cob pipe, bow tie, sunglasses, fake mustache, Hawaiian shirt, tutu, rain boots "and more", plus goat-suit pieces (beard, horns, spare jacket). Brian: "Drag-on close-up". Five pending words: "I've never gotten to dance at a party.", "Disguised enough", "Go!", "Shuffle", "ta-da". Brian also said [G#603] pieces "more or less wherever".
   - Effect if wrong: the first thing a kid plays after the peek is unfinished.
   - Question: Draw pieces in the game's own style and show one sheet (recommended), or let Brian pick which 8?
   - Needs Brian: a look. Claude can draw. Words need a yes.

9. **The snack-bar paw close-up needs a picture set and the two bartender lines.**
   - Needs: close-up background (pyramid of snacks, bag icon, X button, furry arm), bartender glance frames, topple chain (cups, tray, cake) per CUT-IN-SPEC, crowd-turns. Lines: "...Nice gloves." and "Wait a second... fur!" are Brian's idea (S#1025) but the walkthrough keeps them pending; his 11-22 line ("Yellow, then suspicion") also calls for "?" or "Nice gloves" from any watcher with disguise.
   - Question: Approve the two bartender lines exactly as Brian wrote them [S#1025] (recommended), or reword?
   - Needs Brian: a yes. Pictures can be made without him.

10. **Cutaway and close-up pictures that no doc says exist as art.** (List; Claude can make, Brian looks.)
    - Calendar close-up with today circled and nibble (beats 1, 23); Moon Pie website screen "MOON PIES / Order new box / Return empty crate" (51); pink order sheet with checkbox and paw print, yellow copy, white copy (32, 42); Mars brochure front with the Sasquatch couple and pancake counter (38); FUR pull-station zoom (17); Polaroid (13); octopus squash hug (12); goat-suit beard trimming (56); crayon drawing "TIED TOGETHER FOREVER" (37); Guardian Box, toy rocket, note (22); lockup card; security-tape screen with "REC" (60); six hallway photo gags (37, captions NEEDS BRIAN); time cards ("That evening...", "Six days later", "Later that evening...").
    - Evidence: STATE and OPEN-ASKS list several as "sketch drawn" but I could not find sketch-*.png on disk (only v2 evidence pictures and `docs/old/audit-shots`). Treat them as not available.
    - Question: One contact sheet of all cutaways for a single look (recommended), or one at a time per beat?

11. **Characters with no approved look: Isfred, Croc Boys, bartender, guards, delivery robots, Dot/Bob/Lou, tourist family, baby Squatch, Wookiee tourists, ship crew.**
    - Evidence: approved art exists for Mops and six guests only. DECISIONS says "Characters sized to each other" [K#138]; STYLE-GUIDE: adults clearly taller than Squatch and Mops. Isfred's nameplate (Open Q 18, "ISFRED BAR NESHUMAN above MANAGER") is pending.
    - Effect if wrong: new characters drawn in code never seen by Brian look off next to approved guests.
    - Question: Draw the unapproved characters as one lineup beside Mops and a guest for a single yes (recommended), or approve each when it first appears in a build?
    - Needs Brian: a look.

12. **Sounds that exist only as generated beeps, or not at all.**
    - Exist: Floating in Space (copy from v2), growl, Joe's theme. v1 sound effects are oscillator tones.
    - Missing: FUR alarm tone, closing-time chime, camera flash / shutter, "ta-da", vent suck, robot "BEEP BEEP", mailbox ding, Mops's "Weeee-eenn-nnttt!" bleat (beat 2), crowd cheer, snoring (bot promised soft snoring), speaker crackle ("obvious the song's coming out of the speaker" [G#556]).
    - Question: Use plain made-up tones for all but Floating in Space and the growl (recommended), or record Brian's own for any?
    - Needs Brian: only a yes; Brian recording is optional. The Mops bleat is the one where a real voice (Brian's) would be best.

13. **Floating in Space: is the file the whole song or a clip, and does it have voices?**
    - Evidence: Brian [S#218]: "I don't think we want real voices but would be great to make it match the sound of the song more." Later [G#556]: "There was the full audio file for floating". The v2 file is 32.6 s. Beat 2 and the 11-22 morning order have Mops and Squatch sing along over it.
    - Effect if wrong: song loops after 32 s, or the on-screen singing clashes with a recording that already has voices.
    - Question: Is the 32 s file the song, with Squatch and Mops singing over it (recommended to check by listening), or should the synth version replace it?

14. **Where the guests' lines and party chatter come from.**
    - Evidence: beat 8 says chatter "(lines not written yet)"; "Cool hat!" is on Brian's questioned list; guest "?" / "!" labels and "Nice gloves" are the only party words decided by cone rules.
    - Effect if wrong: a crowded hall with no talk, which feels empty, or invented chatter Brian dislikes. Brian's own rule: "less words and clutter" [S#26].
    - Question: Leave guests silent except cones (recommended), or write 6 to 8 one-line overheard bits for a yes?

15. **End-of-chapter and per-part check pictures.**
    - Evidence: Brian picked B (clean check per part, replay from chapter screen); recommended end card "7 of 9" with "???", "PERFECT CHAPTER!", a badge. No picture or words exist; star icons and the chapter screen need design. Brian [wording]: "think about points because [his kid] loves to play the chapter perfectly".
    - Question: Show one mock of the chapter screen and end card for a look (recommended)?

## Grouped by who must act

**Brian must provide or approve a look (pictures):** home v6 with speaker; hall v2 without outline; vent workstation; TV story and bedtime story sheets; dress-up piece sheet and white-background Squatch; new-character lineup (Isfred, Croc Boys, bartender, guards, robots, family, baby, Wookiee tourists); cutaway contact sheet; chapter end card.

**Brian must say yes to words (word for word):** the 83 pending lines (clusters above), the new morning lines, closing time announcement, Croc Boys line, goal lines, lockup card, end card words, Isfred nameplate, hallway gag captions.

**Brian must provide or approve a recording or listen:** Floating in Space check (is it the full song), the party loop and Croc Boys jingle the bot picked, optional his own Mops bleat. Growl already recorded.

**Claude can make without him (then show):** copy approved v2 assets over (Mops, six guests, speaker, two audio files; each needs his yes per the base-repo decision); all cutaways and close-ups; clothing pieces; time cards; sound effects as simple tones; plant eyes from original; closing-time hall picture.

**Out for now (no assets to make):** dance game, balloon (beats 10, 15, 57 POP), unless Brian reverses.

## Summary line
15 findings, all 15 carry a question (none settled by his words alone); most are "show one sheet, then yes".
