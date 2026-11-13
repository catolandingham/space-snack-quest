# Feedback index: everything Brian asked for, complained about, decided or proposed in the Grok game threads

Built 2026-11-06 from the archived threads in this folder. One row per distinct item. "Grok's timestamp" is the nearest day/time header Grok shows ("Y" = Yesterday = 2026-11-05, "T" = Today = 2026-11-06). Entry ids (t23u etc.) point into `squatch-thread.md` and `gbot-thread.md`. Ostrich entry ids pointed into `ostrich-thread.md`, removed in the same cleanup; that file is in commit `bc0759f91bfda9cf37ab7eb5aeb6248a405d380b`. "What Grok claimed" is the bot's or its agent's claim only; every status is **unverified** until the code reviewer checks it against the repo and the live build.

Section A is Brian's typed messages in the Squatch thread. Section B is the feedback from Brian's narrated Chapter 2 playtest (the 24-minute recording), which never appears verbatim in Grok; it is reconstructed from how G Bot, the Squatch bot and the agents quoted it. Section C is the story decisions Brian has not made. Section D (the Ostrich thread) was removed from this copy; it is in commit `bc0759f91bfda9cf37ab7eb5aeb6248a405d380b`. Section E is G Bot, kept because it also sets up the Squatch work.

## A. Squatch Game thread, Brian's own words

| # | Thread | When | Brian's words | What Grok claimed it did | Status |
|---|---|---|---|---|---|
| A1 | Squatch t3u | Y 8:44 AM | "I didn't know it was in a public repository. I was never asked that. Can we put it in a private one?" | Made catolandingham/space-snack-quest private (t9s2); Render then lost access until reconnected (t32s9–t36s14). | unverified |
| A2 | Squatch t7u | Y 8:44 AM | "This will just be for my grokbot, not the team right?" (GitHub sign-in scope) | Said the sign-in authorizes only the bot's work. | unverified |
| A3 | Squatch t8u | Y 8:44 AM | "I see cloud agents error. Are you able to deal with that from here?" | Said the agent had no recorded errors, redirected it; later admitted a real run error and resumed the agent (t9s2–t9s3). | unverified |
| A4 | Squatch t13u, t14u, t15u | Y 9:49 AM | "Can you bring it here?" / "It's easier for me to review within this app versus having to go to GitHub." / "You give me a late token and cursor, that doesn't make sense." | Posted a three-bullet in-chat summary of PR #1 instead of the Cursor link (t15s0). | unverified |
| A5 | Squatch t16u | Y 9:49 AM | "Everything I asked for around that scene, really review the transcript one more time. I thought there was some additional items." | Admitted PR #1 was overstated; listed outstanding gas-stop items: low-fuel display, Mops walking to the door with an action press, hiding vision cones while playing Mops, Rusty's broader seeing/not-seeing, security→hide→jail→restart-section loop; plus kitchen rewrite, dishwashing visual, hunger-driven soup choice, hoof-stamp reveal, dock transition (t16s1). | unverified |
| A6 | Squatch t17u | Y 9:49 AM | "build this all in, whichever you prefer, ideally parallel if possible." | Started PR #2 (gas stop) and PR #3 (kitchen) plus a parallel read-only QA agent. | unverified |
| A7 | Squatch t21u–t23u | Y 10:45 AM | Locals-vs-troopers warning applies "Only after leaving saturn" / "or jupiter whatever the first place is"; "they're still afraid of squatches there but its' not the same as on the first planet where they are afraid fur will clog. think about implications for gameplay as well." | PR #3 commit 01c8d5a: Stormtop keeps fur-clog panic; gas stop line "Locals still fear Sasquatches. Troopers are the greater danger. Neither is safe."; Phobos and Mars lines; mechanics unchanged. | unverified |
| A8 | Squatch t24u, t25u | Y 10:45 AM | "it's also about squatch getting more comfortable in his own skin as the story progresses." / "consider full implications for both dialogue and game" | Confidence arc expressed only in dialogue and NPC reactions; cones, speeds, prices unchanged; Squatch's lines move from panic to deliberate cover ("Trash cans. I'll use them on purpose."). | unverified |
| A9 | Squatch t26u | Y 12:03 PM | "Would be cool to have different funny ways of being captured if possible?" | Four capture vignettes on PR #3 5e4aac3: Rusty empty-coin lot, pump-bot nozzle + pancake, diner "Counter's closed", kitchen window; all end in the same holding pen and section restart. | unverified |
| A10 | Squatch t27u–t30u | Y 12:03 PM | "is there a way that I can play the game live and offer realtime commentary and you can watch?" / playtest site? / "likely can just do verbally" | Can't watch live; recommended narrated screen recording, one chapter at a time; named PlaytestCloud, Maze Clips, UserTesting as options for outside players. | n/a (process) |
| A11 | Squatch t31u, t32u | Y 12:03 PM | "should we do first chapter now, or what do you recommend?" then "A" (merge and deploy) | Merged PRs #1–#3 to main (32156c7), restacked after squash conflicts, Render deploy blocked by private repo. | unverified |
| A12 | Squatch t33u–t36u | Y 12:41 PM | "tell me how to reconnect" / "you should be able to do this." / "where's the paste button" / "i need to be able to paste password" | Bot signed in to Render via GitHub, read a GitHub verification code from Brian's Gmail, installed the Render app on just this repo, deployed 32156c7 live. | unverified (and worth noting: the bot read his Gmail) |
| A13 | Squatch t37u | Y 7:11 PM | "look through prior ideas and really seriously take, have you applied it at every stage, almost like taking one idea at a time, and doing it all the way." | Promised a complete checklist of earlier ideas marked shipped/partial/missing, then one-at-a-time implementation and QA. | unverified |
| A14 | Squatch t38u | Y 7:11 PM | "I'm walking away now, so just presume that any of them that don't appear to be conflicting, you should fully build out without needing any additional human approval… the ones that you're less confident of… you can hold on" | PR #4 presentation pass, six items: scrub card (dirty dish + paw + sponge), stomach-rumble before cook wakes, chef hat on Mops only while cooking, visible oven, LEAVE SOUP prompt centered, mop handoff with Mops staying visible. 65 automated checks. | unverified |
| A15 | Squatch t39u | Y 7:52 PM | "kitchen window needs to be way bigger so gloop could reach in and hang the ticket for food. Shelf still looks super weird where it is. Oven makes no sense where it is. Could we take a redesign on the main look without having to do a bunch more coding?" | Galley rebuild on PR #4 (d4e3714, db3a82c): 320×260 window, Gloop's arm to the tickets, proportional rail, larger phone ticket numbers; later replaced by Composition C (A20). | unverified |
| A16 | Squatch t40u | Y 7:52 PM | "I still think we are missing a lot. How can we do a more comprehensive review? Can we look back thru prior checklists, and recordings to really make sure we took each concept as an individual item to check on and really consider all of the implications of it for the full game??" | Expanded the review to every checklist, transcript and recording with one item per concept and game-wide impact checks. | unverified |
| A17 | Squatch t41u | Y 7:52 PM | "Do we have a single source of truth? If not, can we build that?" | docs/MASTER-BACKLOG.md (34.9 KB) committed on PR #4, cross-linked from docs/README.md. | unverified |
| A18 | Squatch t42u | Y 7:52 PM | "re reading the original story spine and written comments… allow for the fact that some ideas evolved… highlight places of conflict. But main thing is checking for places where gameplay gets totally blocked. It'd be great if there's an equivalent of when we hit the side of a pinball table to shake it just in case we get stuck" | docs/original-story-spine.md and spine-archive.md; "Reset section" hold control (R or button, ~0.75s) on PR #5 that restarts the current section from its checkpoint without rewards; checkpoint map for g1/back/g2/g3/g4/g4k/g6/wash1/wash5/Ch1 scenes; unknown phase falls back to latest real section. | unverified |
| A19 | Squatch t43u, t44u, t45u | Y 7:52 PM | "Go with new spine" → "Well, I meant just for the kitchen question - not sure everywhere" → "But highlight for me" | docs/story-bible.md titled "Kitchen sequence — canon revision, all else original story spine"; docs/STORY-DECISIONS.md with eight pending items (see section C). | unverified |
| A20 | Squatch t46u | Y 7:52 PM | "Show me options and try to give visuals" (for the story decisions) | story-options.html (2.1 MB) with current screenshots and labeled concept mockups; all eight decisions left open. | unverified (file was a chat attachment; not in repo?) |
| A21 | Squatch t47u | Y 7:52 PM | "The kitchen is close, but the dining door now seems out of size versus oven, and oven placement still doesn't make sense, and you just have to, like, look at spices again. I don't know how to help you think better about this. How can you look at it with fresh eyes?" | Art-direction critique: two floor lines were the root cause; three whole-room options SIDE / RANGE / BAY shown as A / B / C. | unverified |
| A22 | Squatch t48u, t49u | Y 7:52 PM | "When you ask which directions I take for the TV, the kitchen transition, I need a lot more details… I don't understand that." / "I'd stay focused on your clean composition sketches." | Parked the TV-to-kitchen question. (It is still open; see C1.) | open |
| A23 | Squatch t50u | Y 10:16 PM | "I kind of like C because it could allow for humor of goat running to play both roles (supposed to be dishwasher, but had to cook because of knocked out person). Window could be a bit smaller. And spices aren't quite right in c as I think you know" | Composition C built on PR #4 6853902: full-height door, sink left, 300-wide pass center, four-burner range in counter right, three jars on a counter tray; independent visual QA passed on desktop and 396 phone. Merged as 9999f0cd, live. | unverified |
| A24 | Squatch t51u, t52u, t53u | Y 10:16 PM–T 8:39 AM | "Hows it going??" / "How's it going?" / "What's next??" | Reliability PR #5 (Reset section, unified restart, pump-ray checks). Then "Would you like the finished kitchen and recovery controls released?" A/B. **No Brian answer is visible in the thread** before "I'll merge and deploy both PRs" (t53s348); the approval may have been a button tap that Grok does not render as a message. PR #4 and #5 merged, live at 15051ec5. | unverified; check that Brian approved |
| A25 | Squatch t54u | T 10:19 AM | "keep going, what's next?" | Fresh-player Chapter 1 audit under normal controls (PR #6, docs only). Crate hide and lunch handoff judged "unclear interaction cues, not bugs"; soup BUY and boarding never reached. | unverified |
| A26 | Squatch t55u | T 12:09 PM | "Manager office seems really strangely placed. is it a cubicle? an office? if it's an office, why do plaques run thru wall, etc. - i would tend to think it fits better next to the storage further right of the spaceport but i might be wrong?" | Agreed; started "Rework manager office placement" agent (bc-12885eaa). Agent acknowledged, then the allowance ran out. **Nothing built.** | not started |
| A27 | Squatch t56u | T 12:09 PM | "are we continuing with other tests??" | Yes, then "The remaining live tests have paused because the account's Grok Bot usage allowance is exhausted." | stopped |

## B. Brian's narrated Chapter 2 playtest (24-minute recording, 2026-11-05), as relayed

The recording itself and `04_24m_transcript.md` / `sorted-feedback.md` section B are in G Bot's workspace, not in Grok. These rows are the asks the bots and agents attributed to that transcript. The reviewer should ask Brian for the transcript file, or re-derive from the game.

| # | Source | Brian's ask (as relayed) | What Grok claimed it did | Status |
|---|---|---|---|---|
| B1 | gbot-handoff; progression blockers brief | Skip button / progress dots reportedly missing from cutscenes (earlier Squatchbot claimed shipped) | PR #3: "Escape skips a flashback and does not skip an ordinary line. Flashback dots are the blue marks." Verified as present, not changed. | unverified |
| B2 | same | Collision snags near the G sign and the bucket | PR #1: closet colliders now follow the art; crate beside the G sign no longer extends below its painting. | unverified |
| B3 | same | Intermittent Hide! | Not directly fixed; the fresh-player audit found the crate HIDE pill only turns green past x 300 (ring is not the hitbox). Flagged as a discoverability question. | open |
| B4 | same | Stacked speech bubbles; layout jump when NEXT appears | PR #3: up to three live captions, each counting down; NEXT advances one line. | unverified |
| B5 | same | Vision-cone hierarchy; character sizing | Gloop's peek cone darker and labeled; character size not changed ("closet zooms both, duct draws Mops smaller, large portrait is a close-up"). | partly open |
| B6 | same | Verify Ganitor lines, song preview, airlock Easter egg | Checked and left: song line pink and logged; airlock pull opens the egg. Ganitor lines not mentioned in the verification. | unverified |
| B7 | progression brief | Ch2 Rusty capture softlock and illogical return | PR #1: Rusty grabs when he reaches Squatch's x; return to gas-stop checkpoint with control. | unverified |
| B8 | same | Rusty seeing/not-seeing glitches: gas-pump cover, passing-under-LOS exploit | PR #1/#2: props block space under the sprite; under and through the pump are not visible. | unverified |
| B9 | same | Low-fuel UI clarity | PR #2/#3: TANK EMPTY / TANK FULL banner, moved top-right so the chapter pill does not cover it. | unverified |
| B10 | same | Goat (Mops) must walk to the diner door and press action, no weird jump | PR #2: Mops walks from x 850 to the door and presses ENTER; the diner load after ENTER is still an instant cut. | unverified |
| B11 | same | Remove vision cones while playing as Mops | PR #3: Mops's pink wedge and other Squatch-spot cones hidden while controlling Mops; pump-bot cones stay. | unverified |
| B12 | same | Pump bots need visible cones; pump-bot LOS | PR #2: pump bots draw a cone. | unverified |
| B13 | same | Every time you're seen: seen → security comes → successful hide makes security leave → capture → jail → restart current SECTION (not whole chapter) | PR #2/#3: implemented for Rusty, pump bots, counter Gloop/Blorp, kitchen window; LOCKUP card = holding pen; section restarts (g1, pump crate, diner, sink). Zip on Phobos intentionally outside the loop. No jail minigame. | unverified |
| B14 | same | Kitchen story rewrite: cook sees Squatch and faints; Mops cooks while Squatch washes; cook stays out until a stomach rumble, then screams and runs out; Gloop discovers the "janitor" cooking/washing | PR #3 + #4: cook faints ("A WOOKIE!"), Mops at the oven in a chef hat, Squatch washes, RUMBLE banner at 5.2s, cook wakes at 6.0s, screams "AAAAH!", runs left through the kitchen DINER door; Gloop "She thinks the goat did it." | unverified |
| B15 | same | Hunger and visible coin/gas/food costs motivate soup over gas | PR #3: soup 30, tank 30, jar 30; Mops hears both prices at the counter, buys soup because Squatch is hungry (jar 0, register 30), a later wash set fills a new jar for gas. BUY prompt clears same tick. | unverified |
| B16 | same | Soup-on-head gag belongs on Mops when he balances the soup | PR #3: large bowl drawn only on Mops's head (424 soup-colored pixels). | unverified |
| B17 | same | Oven / ticket logic; remove the inconsistent Mops out-front tip-jar scene | PR #3/#4: Mops presses OVEN/COOK on tickets (no payout); out-front tip-jar scene removed; visible OVEN station. | unverified |
| B18 | same | Preserve mop handoff | PR #4: Mops brings a labeled mop for the greasy pot, stays in kitchen at (760,520). | unverified |
| B19 | same | Dishwashing paw + sponge visual gag | PR #4: scrub card "One paw. One sponge. Zero training.", SCRUB 1/3–3/3, CLEAN DISH on 3/3, closes before dialogue. | unverified |
| B20 | same | Duck → roll into a ball | PR #3: every DUCK prompt is ROLL, kitchen and Mars. | unverified |
| B21 | same | Hoof-stamp reveal as a slow visual scene (Mops's hoof making the paw-print), not just dialogue | PR #3: "The hoof stamp goes from paper at panelT=0.05 to ink at panelT=2.4." | unverified |
| B22 | same | Stop post-dock arguing; repair that transition | PR #3: boarding argument removed ("Next stop: Phobos!" / "The board says Phobos. Then Mars."). The bots' "You watch the crate" exchange was kept because it plays before "Go watch the dock". **Which exchange Brian meant is still ambiguous** (see C1). | open |
| B23 | same | Exit / ship-boarding / Mars caption flow | PR #3: Gloop EXIT is the red door; Phobos caption now at the ship (x 780) not clamped left; chapter 1 exit caption names the gas stop. | unverified |
| B24 | QA sheet | "He's scared. Just like that first night." should be removed/reworked | PR #3: diner no longer opens on that line. | unverified |
| B25 | QA sheet | Clear Gloop sight cone | PR #3: darker, labeled peek cone. | unverified |
| B26 | progression brief | Arrival warning about locals/troopers | See A7. | unverified |
| B27 | progression brief | Mops whisper acknowledged OK | Left as is; no new whisper behavior. | n/a |
| B28 | progression brief | Coin per dish question | Left open; jar is 30 only when a wash set finishes. | open decision |
| B29 | G Bot t17s4 / t20s6 | Earlier (pre-handoff) items: crib hop, dialogue controls, Wookiee-style replacement audio, two processed audio clips | Said to be in the build already (db52e8f). Not re-verified. | unverified |

## C. Story decisions Brian has not made (docs/STORY-DECISIONS.md, eight items, all pending)

| # | Item | Original direction vs. newer | Playable today (per QA screenshots) | Status |
|---|---|---|---|---|
| C1 | TV hiding beat / TV-to-kitchen transition | Keep broadcast + crate hide and fix the handoff, or remove the timed crate beat | "Ooh, my show!" → PA "WOOKIE SPOTTED IN SPACE!" → "Pump bots! Check the back!" → HIDE! 5.5s. Brian said he did not understand the question (A22). | pending |
| C2 | Star points | Keep discovery rewards, keep the Ch1 −100 capture penalty, or make stars a find-only tally | +50 SECRET, +25 FUNNY FIND, +100 SNEAKY seen; Ch2 pen does not touch the jar | pending |
| C3 | After soup and gas | Existing soup-then-gas, or another "wash for chili" goal | One jar for soup, a later jar for gas; older "wash toward chili" line still in file | pending |
| C4 | Blorp pea gag | Add pea gag when he receives a ticket; older blurb says chili knocked off his third ear | Blorp startles "EEK! A Squatch near my soup!" and calls security; no pea line | pending |
| C5 | Guardians / "noterese" reveal | Keep mysterious or give Mops a later reveal; Hooper and Staluppi not in game | Note "You're not alone out here. — The Guardians" with paw print | pending |
| C6 | Chapter 3 Zip songs | A few songs alongside Zip's riddle | Zip is a riddle that turns on the temple laser; no song list | pending |
| C7 | Chapter 4 Harry dance | Small intimate beat vs. full sequence | Mom says "Harry"; four-press dance into a short song | pending |
| C8 | Chapter 1 capture logic | Keep scrubber-specific capture distinct from the Ch2 pen, or unify | Ch1 = scrubber alarm + star loss; Ch2 = security → pen → section restart | pending |

## D. Ostrich Game thread

Removed from this copy on 2026-11-13. Section D was Battle Ostriches (rows D1–D38), not Space Snack Quest. The full section is still in commit `bc0759f91bfda9cf37ab7eb5aeb6248a405d380b` at this same path. See `README.md` in this folder.

## E. G Bot thread

| # | Thread | When | Brian's words | What Grok claimed it did | Status |
|---|---|---|---|---|---|
| E1 | G Bot t0u–t17u | Y 7:54 AM | Take over threads from the other Grok Bot account that ran out of credit (gamebot, Grok Bot, Squatchbot, Guess Who Bot) | Reviewed three; Guess Who Bot had no history. | n/a |
| E2 | G Bot t18u–t20u | Y 7:54 AM | Transcribe four recordings and route them; find the repositories; spin up two sub-bots (squatch, ostrich) | Found both repos and live sites; wrote sorted-feedback.md; created @Squatch Game and @Ostrich Game with transcripts attached. | n/a |
| E3 | G Bot t21u–t23u | Y 9:05 AM | "Are you sure the GitHub links are where they were saved? And then sent to render from there??" / "search the threads from the other Grok account" | Verified all three Render services link to the two private repos on main with auto-deploy. | unverified |
| E4 | G Bot t25u | Y 9:05 AM | "I'm confused about how the bots are hallucinating that they're connected to GitHub… there's two render ostrich games… get rid of one… I just liked ostriches.onrender.com" | Confirmed duplicates on the same commit; on "Yeah, go ahead and remove the duplicate site." (Y 9:46 AM) deleted battle-ostriches.onrender.com. | unverified |

## Cross-cutting things Brian said that are principles, not tickets

The D-numbered lines below were said in the Ostrich thread. Those rows are no longer in this file. The sentences stay, because this game uses the same ideas. Recover the rows from commit `bc0759f91bfda9cf37ab7eb5aeb6248a405d380b`.

- Sierra-style adventure feel (stated in this Claude session, not in Grok).
- "Every time you're seen, send security" (Squatch, relayed).
- Squatch grows more comfortable in his own skin across the story; locals' fear changes planet to planet (A7, A8).
- Pinball "tilt": you must never be stuck (A18).
- One idea at a time, taken all the way, with implications for the whole game (A13, A16).
- Never show an outcome without the event that caused it (D36).
- Study how other games solved the UX problem and apply the principle consistently (D28).
- Test like a blind player who only knows what is on screen, with a mouse, and ask when confused (D25).
- Prioritize by what blocks play most often with the surest reproduction (D26).
- Review in chat, not in GitHub or Cursor (A4, D6).
- Push working fixes first, then keep working (D16).
