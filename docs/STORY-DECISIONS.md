# Story decisions

For Brian. [`DECISIONS.md`](DECISIONS.md) is the single source of truth. This page is the older list of eight story questions. Each one now says whether you have answered it. An answer here records your pick. It does not change the game, and it does not change any on-screen words.

The kitchen sequence is already the canon revision in `docs/story-bible.md`.

The sentence "nothing else in the original story was replaced" is **Superseded**. The Nov 2 spine is not binding (W27 in `docs/DECISIONS.md`), and the Chapter 1 replot starts at S2. This page does not retell that replot.

Sources for the original questions: playtest t04 (`04_24m`, audio times from that recording) and the current game. The full original spine attachment was not in the workspace when this list was written, so "original direction" below means the older beat still visible in the build or named in that playtest.

## 1. TV hiding beat

**Answered.** 2026-11-08. Your pick (D2-TV, L7 and L8 in `docs/DECISIONS.md`): keep the TV warning and the crate hide. Cut the arguing after "Bots! Go watch the dock." Keep "Bots! Go watch the dock."

The build still plays this. Gloop says "Ooh, my show!" The TV says "WOOKIE SPOTTED IN SPACE! Last seen near Stormtop." The pump bots trade "You watch the crate." Squatch: "They're looking for ME." Then Gloop says "Bots! Go watch the dock." A hide timer starts (5.5 seconds).

Playtest t04, audio 18:39–18:59: after she sends them to the dock, there is no reason to keep arguing, and the cut back to the janitor in the diner is confusing. The crate lines in the build happen before that dock line, which is why they were left in.

Your answers to the old questions:

- The TV broadcast stays the reason the bots search.
- The crate lines stay, and they stay before "Go watch the dock."
- The timed hide stays with that beat.

## 2. Star points

**Answered in part.** 2026-11-08. Your pick (D2-STARS, K17): keep the stars and "Never caught! +250". A catch does not take stars (K9, the one capture rule). Stars stay, and the tip jar stays. They are different things.

Finds add stars: +50 for a secret, +25 for a funny find. The hint on screen is "★ = points for finds." One Chapter 1 caught path used to subtract 100 stars. The Chapter 2 holding pen does not touch the jar, the register, or those stars.

Playtest t04, audio 16:05–16:34, asked whether dishwashing pays a coin per dish. The build does not. The jar becomes 30 at the end of a wash set. Soup is 30. The tank is 30. That coin rule is playable.

Answered:

- Stars stay. They are a find tally plus the "Never caught! +250" bonus. They are not the tip jar.
- A caught Squatch does not lose stars.

Still open (O25 in `docs/DECISIONS.md`): the hidden +100 awards versus the on-screen words "★ = points for finds."

## 3. More dishes after soup and gas

**Answered in part.** 2026-11-08. The chili-and-siphon path is retired (L4). Soup stays. "Pay Rusty for gas" is **Superseded** in part by S3 (2A): they are passengers, they are put off, and their wages buy soup, then another ride. No fuel-light reason.

Playable Chapter 2 path on `main`: one wash set fills the jar with 30, Mops buys soup because Squatch is hungry, and a later jar buys the gas. Cooking a ticket does not pay coins. No later menu is written.

An older objective string still in the file says wash dishes for coins toward Space Chili, then sneak a crystal. That string is not the Chapter 2 scene that plays now. It is retired (L4).

Playtest t04, audio 16:18–16:35, stops at the hungry choice: soup instead of gas. It does not say whether more orders come after both are paid.

Answered:

- The old "wash until 30, then buy chili" line is retired.
- Soup stays.

Still open (O17, L24, L25): what the next ride is, and its fare, and why buy soup if they packed snacks. The recommendation on the table is that the snacks stay in the UPS cargo. That recommendation is not a decision.

## 4. Blorp pea gag

**Answered.** 2026-11-08. Your pick (D4, L9): the pea gag stays parked.

No pea line is in the current game, and playtest t04 does not mention one. Playable Blorp, at the diner counter, startles at his soup, shoves Squatch, and calls security: "EEK! A Squatch near my soup!"

An older chili-stand blurb still in the file has Blorp say the chili was so spicy his third ear fell off, and that he has been waiting since 1997. That blurb is not the counter scene above. It stays unused while the pea gag is parked.

## 5. Guardians / noterese reveal

**Answered.** The player learns that Mops writes the notes. Squatch does not (S59, 2026-11-07, confirmed in the answered set). Chapter 4's "...Then who were the Guardians?" depends on that. "MY GARDIANS" is an intentional kid spelling. Keep it (S58).

Playable Chapter 1 beat: a note, "Brave Sasquatches stay hidden," signed "— The Guardians," with a long white hair stuck to it. Squatch: "The Guardians came! They always come when I'm scared." The note goes in the Guardian Box, which holds "every note the Guardians ever left me" and an old crayon drawing. The box label is spelled "MY GARDIAN BOX" on the lid and "MY GUARDIANS" in the title.

Your answers to the old questions:

- The note and the box are not the whole reveal.
- A later "who they are" scene is wanted, and Squatch still does not know during it.
- The lid spelling stays on purpose.
- 2026-11-26 (Brian, chat 18b A): at bedtime, after the crate story, Mops says "And you've always had your Guardians, watching over you." over a picture of Squatch's crayon drawing of the Guardians, with no hint that he writes the notes. The player still learns that only at the vent (beat 48). Details: `docs/DECISIONS.md`, "Bedtime story, 2026-11-26".

Still open (O18): whether Chapter 2's "Years ago, on Stormtop..." flashback still happens, now that the Guardians flashback is at Chapter 1 bedtime (S37). The hoof-stamp line "A hoof stamp. Mops signed it." is a cut (L2). That cut is in [PR #17](https://github.com/catolandingham/space-snack-quest/pull/17), and it waits on your written yes there.

## 6. Chapter 3 Zip songs

**Answered.** 2026-11-08. Your pick (D6, L17): Zip's beat is a riddle, not songs. Write many riddles, a different one each game. If the echo riddle comes up, Zip mocks himself for picking such an obvious one.

Chapter 3 is not a finished chapter in this story pass. What is playable: Zip the space raccoon, a riddle ("I have rings, but no fingers…"), and the right answer turning on the temple laser so Squatch can aim mirrors. After the right answer the code starts the sing action. There is no separate list of Zip songs.

Playtest t04 does not discuss Zip. It ends as they board for Mars.

A song lure does exist earlier: hide, sing, bots come look, stop before they arrive. That lure is not Zip's songs.

Still open (O21): whether the same riddle can come up twice in a row. The new riddle words are not written yet.

## 7. Chapter 4 Harry dance

**Answered.** 2026-11-08. Your pick (D7, L18): the dance stays small. Four presses, and Mops's "Baaa".

Chapter 4 is not written out as a full chapter here. What is playable: Mom says "Harry? ...HARRY! It's you!" and later "Eat up, Harry!" Squatch: "Harry to my family. Squatch to my goat." A DANCE prompt counts four presses, Mops baas, then a short shared song: "I'm floating in space…" and "Baaa-aa-aaa."

Playtest t04 does not reach a dance. It only gets as far as the confusing "next stop, Mars" line on the wrong side of the screen (audio 24:15–24:22).

That four-press dance is the Harry dance. It is not a stub waiting on a bigger dance.

## 8. Later Mops, and Chapter 1 capture

**Answered.** 2026-11-07 and 2026-11-08. One capture rule everywhere (K9): sighting, then security, then a lockup card that names the cause, then the section restarts and the coins are kept. When a kitchen bot sees Mops, he gets shooed back, not locked up (D9, L3). Chapter 1 does not keep a separate star-loss capture.

Two capture shapes used to be playable, and they were not the same.

Chapter 1: "WOOKIE ALERT! PROTECT THE AIR SCRUBBERS!" The fur-in-the-scrubbers fear is that chapter's. One caught path used to take 100 stars. That star loss is gone under the one capture rule.

Chapter 2: a sighting calls security. Hiding or rolling sends them away. Getting caught shows the holding pen and restarts that section. The jar is not touched. Playtest t04, audio 10:07–11:13: not every sighting is instant jail, and the restart is the section, not the whole chapter. Audio 02:58–03:34: while you are the goat, the sight cones matter less, because nobody is hunting the goat.

Mops is the one who walks the gas door, buys the soup, and cooks. He is not the one the pen is for.

Your answers to the old questions:

- Chapter 1 does not keep its own capture, separate from the Chapter 2 pen. One rule everywhere.
- A bot that sees Mops shoos him. He is not put in the pen.
- The full security trace across every chapter is not started (K21, O31). The rule is decided. The trace that checks every path is not.

## Also answered (they were not rows on this page)

These three were not in the eight questions above. They are listed so this page does not read as if they are still pending. The full decisions are in `docs/DECISIONS.md`. None of them is built. The words go through a lines file first.

- **Ship (VEHICLE, L19).** 2026-11-08. The Mars vehicle is a ship, not the van. Which ship is still open (O22).
- **Dad's line (DAD, L20).** 2026-11-08. The pancake-hair joke ("You'll get hair in the pancakes.") replaces "Health rules."
- **Mops is a "Ganitor" (2026-11-26).** Brian, in chat: "Ganitor is what mops is - goat janitor - that should be an ongoing reference in the game." Decided as a fact about Mops (goat + janitor, his job title). Where it shows, his pick the same day ("I like all of them a b c d e"): five places, listed in `docs/BRIAN-ASKS-OPEN.md` item 14 and `docs/DECISIONS.md` ("Bedtime story, 2026-11-26"), to be built in a later round. Not on screen anywhere yet.
- **Ending (ENDING, L21).** 2026-11-08. One closing picture instead of the long "Ever since..." card. A sketch comes first. Mops cleans with his beard.
