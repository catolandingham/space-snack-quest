# Audit, Chapter 1 beats 9 to 21 (party through bedtime story)

Repo: /Users/brianhowe/Code/space-snack-quest (v1). Read only. I did not run the game (port 8801 was already in use, so `tests/ch1-playthrough.mjs` would not start); everything below is from reading the code and the locked hall picture. Paths are under `src/game/`.

Newer rules that apply to many beats here:
- Sight cones (DECISIONS, Nov 22): dashed cone on every watcher, yellow when Squatch is inside; guests "?" then "!" if he lingers; guards and robots "!" at once; Mops hearts.
- Optional things have no outline. Only the one required next place gets a soft outline of the real place (not a circle).
- Ch 1: whoever sees him runs to the wall alarm.
- Keypad, hangar robot, controls: not in this range.

Cones in the party hall today: the only cone drawn in the party is the yellow filled cone on the two security guards during the raid (`12-ch1-redesign.js:1305-1308`) and the plant-sneak watcher (`15-ch1-scene1.js:395-398`). No dashed cones, no "?" or "!" over guests, no hearts anywhere in the party. This applies to beats 9, 12, 13, 14, 16 and 17 below and is not repeated each time.

Goal ring today: `ch1MarkGoal` (`12-ch1-redesign.js:76-92`) draws a solid yellow circle, radius 54, round the first non-"hot" party spot (`drawGoalMark`, 12-ch1-redesign.js:60-72). That is a circle, not an outline of the real place, and once the balloon is settled the first spot in the list is an optional one (TALK guest, `:665-679`), so it rings an optional thing. Contradicts the Nov 20 and Nov 22 rules. Reachable in normal play.

### Beat 9. A real party
- Design (newest): Band already playing, wedding-party feel: conga line, chicken dance, big cake, dance circle with guests taking turns, bouquet toss; all guests break into the robot dance together (walkthrough open question 3 CLOSED). All optional, so no outline.
- v1 today: The hall is the locked empty picture (`12-ch1-redesign.js:1207-1210`, no band in it) plus `drawCh1Party` (`:1272-1330`). Guests are six static aliens (`CH1_GUESTS` `:140-147`) plus a cape guest (`:1317`); they only bob. No band on the stage; a single "croc" guest stands on the floor at (400,440) (`:142`), not on the stage. Isfred stands on the stage (`:1294`). Conga: a JOIN button spot (`14-ch1-day1.js:199`) that walks Squatch 3 steps (`:234-243`); `n.ch1Conga` is set but I found nothing that draws a conga line, so no guests join. Chicken dance: FLAP button, Squatch's feet move 2.2 s (`:245-254`), no one else. Dance circle: a DANCE spot at (500,530) that starts beat 10; no circle drawn, no guests taking turns. Cake: a small table with a few blobs (`drawCh1Fest`, `:331-343`), not a big cake. No bouquet toss. No robot dance (search for it finds nothing). Music in the hall: cannot tell from the code.
- Verdict: MISSING (band, robot dance, bouquet toss, a visible conga line and dance circle). Only three button stubs (conga, chicken, dance) exist.
- Old-design leftovers: the single "croc" guest on the floor (`12-ch1-redesign.js:142`) stands in for the band; reachable in every party. The one-person "Love the shirt." TALK guest and "LISTEN snack line" spots (`:41-45`) are not in the design; reachable.

### Beat 10. Dance mini-game
- Design (newest): Guitar Hero style: arrows slide to a fixed hit box, tap the matching big button, one song about 30 s, cannot fail, 10 points per arrow, guests cheer. Brian: keep, simplified, show him before it lands.
- v1 today: `14-ch1-day1.js:2-6,206-216,285-295,350-364`: 30 arrows, 0.9 s apart, 30 s, 10 points each, hit box at x=220, four big buttons (left, down, up, right) at the bottom, no fail, points added to stars. Cheer value is set (`g.cheer = 0.4`) and a sound plays, but `drawCh1Dance` never draws guests or a cheer, so guests do not visibly cheer. Starts from a DANCE button near (500,530), not by stepping into a circle.
- Verdict: MATCHES (minor gap: no visible cheer; whether this is the "simplest form" Brian wants to see first is his call).
- Old-design leftovers: none found.

### Beat 11. Karaoke: the Moon Pie song
- Design (newest): After the dance, optional, walk to the mic on the stage, "Sing?", 15 s, big Sing button, each tap louder and a bigger cheer, two lyric lines on screen, camera zooms behind Squatch looking at the cheering crowd. Up to 50 points.
- v1 today: SING spot at the mic (400,320) (`14-ch1-day1.js:198`, `:216-219,296-306,367-389`). 15 s, lyric line 1 for the first 7.5 s then line 2, words match the walkthrough, a Sing button at (760,560), 5 points per tap capped at 50. The drawing is a mic stand and a text box; no crowd and no view from behind. Not gated behind the dance (both appear at once). No "Sing?" prompt. The stage is a solid box to y=304 (`12-ch1-redesign.js:151`) so he sings from the floor in front, not on it (walkthrough open question 21 is still open).
- Verdict: DIFFERS (code fix): add crowd and cheer view; the gating and the on-stage question are small.
- Old-design leftovers: none.

### Beat 12. Juke the octopus
- Design (newest): Octopus comes for a hug after the flyer is taken; follows about 10 s then gives up; if he catches Squatch a quick zoom shows the hug and it tugs the disguise; two hugs knock it off. Lines "I gotta juke this fool." and "*hic* Fellow tourist!".
- v1 today: chase starts when the flyer is taken and Squatch is within 150 px of (760,555) (`14-ch1-day1.js:307-312`); both lines match (`:258-262`); octopus speed 90, gives up at 10 s (`:314-327`, constants `:4-5`); first catch tilts the hat and repeats "*hic* Fellow tourist!", second catch takes the disguise off (`12-ch1-redesign.js:757-762`). No zoom of the hug. The octopus is drawn standing at (760,555) from the start of the party and then jumps to (860,555) when the chase begins (`:313`, `drawOctopus` `:1380`); cannot tell if that is visible.
- Verdict: DIFFERS (code fix): no hug zoom; first catch repeats the octopus line.
- Old-design leftovers: a HUG button (`12-ch1-redesign.js:721-733`) lets the player walk up and press to be hugged with no chase; reachable once Squatch stands at (760,540) with the disguise on. The design has the octopus come to him.

### Beat 13. The photo corner
- Design (newest): Camera tourist with tripod and starry backdrop, left under the big window; red light counts 3-2-1, "Say cheese!", flash every few seconds; stepping into the frame on a flash cuts to a Polaroid with Squatch in it; bonus points; optional.
- v1 today: a tripod at (250,360) with no tourist drawn (`12-ch1-redesign.js:1318,1385-1393`). Two separate mechanisms: (a) a SNAP button spot (`:697-706,765-770`) that opens a Polaroid panel and gives 25 points if Squatch is in the frame box; (b) a 6 s timer that shows "2", "1", "Say cheese!" text at (180,230) and a 0.2 s white flash (`14-ch1-day1.js:305-309,331-342`). On the timed flash, being in the frame only sets `n.ch1InShot`; no Polaroid and no points. Words "Say cheese!" match. No red light, no backdrop with moon in the room (a starry backdrop is drawn only inside the Polaroid panel, `60-frame-draw.js:1699-1725`). Bonus 25 is a tuning pin (`PHOTO_BONUS`).
- Verdict: DIFFERS (code fix): the flash should cut to the Polaroid; the SNAP button plays the moment for the kid (START-HERE lesson 6).
- Old-design leftovers: the SNAP button path as the main route; reachable.

### Beat 14. Snack trips: the bar cut-in and the pyramid
- Design (newest): Paw icon near the bar; tap, zoom in about 0.5 s to a blurred-party close-up of a snack pyramid; arm follows the finger; bag icon bottom-left opens into a big bag while dragging; round white X bottom-right to leave; bartender glances when turned; first catch "...Nice gloves.", second "Wait a second... fur!" and the FUR alarm; a bottom grab topples the pyramid into a chain, the party looks, he can hide (4 s).
- v1 today: an OPEN · snack bar spot at (860,430) (`12-ch1-redesign.js:681-693`), cut-in in `13-ch1-slice.js:119-222,346-393`: 0.5 s zoom, blurred room, snack pyramid, paw arm follows the pointer, bag grows while dragging (`:373-376`), bartender back turned 5 s then glances and faces you 2 s, first catch "...Nice gloves.", second ends via `ch1HatOff("bar")` with "Wait a second... fur!" (`12-ch1-redesign.js:826-830`). A bottom grab dropped in the bag topples the pyramid, closes the cut-in, sets 4 s of look and the chain drawing (`13-ch1-slice.js:188-192`, `12-ch1-redesign.js:1332-1341`), and a HIDE · plant spot appears while the party looks (`:707-720`). Differences: the exit is a yellow rounded "OK" button (`13-ch1-slice.js:366-367`), not a round white X; the entry is a button label, not a paw icon; a catch only counts when he is dropped while the bartender faces you.
- Verdict: DIFFERS (code fix), small: exit X and paw icon.
- Old-design leftovers: the GRAB · snack spot and "One snack. That's the rule." (`12-ch1-redesign.js:42,752-756`) are never reached: the loop skips id "snack" (`:665-667`), so `ch1SnackGrab` and `n.ch1Snacks` never run (unreachable). It also makes the three small snacks drawn at the bar stay on screen (`:1296-1301`) with the old rule line still in the code.

### Beat 15. The balloon
- Design (newest): Kid lets go of a balloon, gasps and points; it rises and glows; one jump grabs it (shows legs, only the kid sees); no jump means the ceiling, a sad kid, no alarm. Give back: wide eyes, smile, finger to lips, thumbs-up, no words, close-up of the two. Keep: kid yells "Scary Wookiee!" and a guest pulls the alarm. Brian (Nov 22): keep, simplified, shown to him before it lands; if no simple version works, say so.
- v1 today: balloon starts only after Squatch takes the robot flyer (`12-ch1-redesign.js:604-621`); rises over 6 s (`BALLOON_GRAB_SECONDS`, `:29,858-862`); a JUMP · balloon button spot (hot) (`:624-638,771-774`); ceiling gives kid "sad", no alarm (`:862`). After the jump a GIVE and a KEEP button appear (`:639-662`); give runs the kid's wide, smile, shh, thumbs-up faces (`:776-796`) in the room, not a close-up; keep says "Scary Wookiee!" then `ch1HatOff("scare")` -> FUR (`:797-805`). A balloon left behind is tied or on the ceiling and popped in the office later (`:806-823,871-874`).
- Verdict: DIFFERS (design unclear): Brian wants a simplified rebuild shown first, and what "simple" means (buttons vs real jump and carry) is not decided. The existing version is the old multi-button one.
- Old-design leftovers: none contradicting; but the balloon starting only when the flyer is taken (not as a party event) is an old chain; reachable.

### Beat 16. The disguise comes off
- Design (newest): Disguise comes off for a real reason (vent tugs it, plant snags the hat, stands too close to security, two hugs, two bartender catches, keeps the balloon), else about 3 minutes of party play ("Cool hat!" stand-in, open question 4). Cones on everyone (see top).
- v1 today: 3 minute timer, only counts after the flyer is taken and while no cut-in, dress-up or mini-game is up (`12-ch1-redesign.js:27,865-869`; `ch1HatOff` `:824-838`). Line "Cool hat!" is in. The vent, plant and guard reasons are three BUTTON spots: SUCK · vent (188,500), SNAG · plant (400,540), STAND · guard (700,560) (`:46-50,707-720`); pressing one takes the disguise off. No vent pull, no plant snag from walking, no guard actually standing at that spot (drawn "hat" guest at (740,470) is the nearest figure). Hugs, bar and balloon reasons are covered in beats 12, 14, 15. Cones: see top; none on guests.
- Verdict: DIFFERS (code fix): the three snag reasons are buttons that play the moment; cones on everyone are not built in the party.
- Old-design leftovers: the three SNAG/SUCK/STAND buttons themselves; reachable.

### Beat 17. FUR! Security!
- Design (newest): Someone who sees fur runs to the red pull station on the wall and pulls it; alarm; guards run in; works every time with no long wait. Ch 1: wall alarm, later chapters may shout.
- v1 today: `ch1HatOff` queues the guest's "FUR! Security!", then the PA says "FUR! Security!" again, then a close-up panel of the pull station (FUR / PULL DOWN, hand pulls) (`12-ch1-redesign.js:831-837`, `60-frame-draw.js:1730-1741`), then `ch1RaidBegin` (`14-ch1-day1.js:14-27`): the yellow-spotted guest (`CH1_GUESTS` "spots") runs at 420 px/s to (800,430) and the alarm sounds there (`:93-98`). The pull station in the picture is high on the right wall (about x=892, y=164 on the 960x640 canvas, from the 1280x830 picture); the guest runs to a floor point in front of the bar instead. Two guards enter at (948,360).
- Verdict: DIFFERS (design unclear for the shout; code fix for the walk target). The guest and PA both shout "FUR! Security!", while the Nov 22 rule says in Ch 1 the guest runs to the wall alarm and shouting waits for later chapters; beat 17 itself says a shout "is also fine" (t111u). Decide which (see questions).
- Old-design leftovers: none found.

### Beat 18. Run home; security searches the room
- Design (newest): Squatch runs home, guard follows in half a second after reaching the door and searches; hidden means the guard gives up; reached means jail, then set back a little and play carries on (not a guard in the bedroom right away).
- v1 today: In the hall the raid auto-walks Squatch to the home door at 260 px/s if the player is not steering (`14-ch1-day1.js:84-94`); two guards chase with a cone; if a guard sees him and he is not hidden or at the door, `capture("s6")` gives the lockup card and `ch1RestartParty` puts him back a little in the party (`:35-70`, `25-capture.js:16,222`) (matches the Nov 14 note). A HIDE · plant spot at (220,530) lets him hide in the hall (`:121-135`). At the door a guard arrives, 0.5 s later the scene moves home (`:106-110`) and `ch1SearchStart` puts the guard at (900,520); he hides under the bed (HIDE · bed, `:143-155`); the guard gives up after 2 s seen-hidden or 8 s (`:266-283`). If the guard reaches him in the room there is NO jail card: `ch1Escort` just walks Squatch to (760,540) and the guard back (`:272-281`).
- Verdict: DIFFERS (code fix): a catch in the home room should be the same lockup as in the hall.
- Old-design leftovers: the `ch1Escort` path (`14-ch1-day1.js:267-282`) is an older catch behaviour; reachable (stand still at home while the guard searches).

### Beat 19. Mops comes home: "You have me"
- Design (newest): Mops comes home and finds the robot flyer and some fur; Squatch is sad. Squatch: "Everyone out there has someone." Mops: "You have me."
- v1 today: after the guard leaves, Mops walks in and the two lines play in that order (`14-ch1-day1.js:164-172`), with no finding of the flyer or fur and no sad pose. The line "A flyer. And fur on the floor." exists but plays at `ch1PartyHome` (`12-ch1-redesign.js:839-850`), after the TV and bedtime, right before Day 2 starts.
- Verdict: DIFFERS (code fix): the flyer-and-fur line is in the wrong place, and no sad Squatch.
- Old-design leftovers: `ch1PartyPeek` (`12-ch1-redesign.js:538-571`) still has the card "Everybody has somebody." and "Robots?"; the walkthrough closed question 2 moved that line to the homecoming. Nothing calls `ch1PartyPeek` (only its definition), so it is unreachable. Also `10-ch1.js:213` has `v("sq", "...Everybody has somebody.")` in the old O scenes; I did not check reachability.

### Beat 20. The TV story
- Design (newest): Mops turns on the TV; cut to full-screen story pictures (Wookiee tourists shed fur into the air scrubber, it clogs, people gasp, Isfred walks them onto the ship, the no-fur rule). No TV words decided ("Nobody can live outside" is cut). Brian: full-screen story.
- v1 today: `ch1Homecoming` sets `tvOn` and puts both on a couch (`14-ch1-day1.js:174-181`) with no line for Mops turning it on, then three panels `ch1tv1` to `ch1tv3` (`:178-180,390-395`). Each panel draws a TV frame 620x250 on top of the room, not a full-screen picture (the draw function starts with the TV frame and never fills the canvas). Words on screen: "Fur in the scrubber." and "Onto the ship." (not in the walkthrough; not approved). Panel 2 is one pink figure with a "!". No Isfred identifiable, no clogged scrubber, no "long ago".
- Verdict: DIFFERS (code fix): needs full-screen pictures and the two invented captions need his yes or removal.
- Old-design leftovers: the small-TV frame and the two captions; reachable in every Day 1 end.

### Beat 21. Bedtime story: why Moon Pies
- Design (newest): In bed, Squatch asks for the story again; Mops tells how he found a baby asleep in a Moon Pie crate on the loading bay; story pictures show only Mops and baby Squatch; no parents. Words: "You came to me in a Moon Pie crate. You've loved Moon Pies ever since."
- v1 today: Squatch and Mops go to bed (`14-ch1-day1.js:182-188`), then one panel `ch1moon` (`:188,396-403`): a white caption box at the top of the room with the two lines word for word. No request from Squatch, no story pictures of Mops and a baby, no speaker. No parents, which is right.
- Verdict: DIFFERS (code fix): words match, the story pictures and Squatch's ask are missing.
- Old-design leftovers: none found.

## Design questions only Brian can answer
1. Beat 17, the shout in Chapter 1. The guest and the PA both say "FUR! Security!" before the guest runs to the alarm; your Nov 22 rule says in Ch 1 he runs to the wall alarm and the shout waits for later chapters. Options: (a) guest runs and pulls silently, alarm sound only; (b) guest says just "FUR!" then runs and pulls; (c) keep the current "FUR! Security!" shout plus the pull (beat 17 says a shout is also fine).
2. Beat 12 and 16, how a hug or a snag "knocks off" the disguise. Is it enough that the hat tilts then drops (as today), or should the reason also show on the person (hat flies, octopus zoom)? Options: (a) keep as today; (b) add the quick hug zoom only; (c) add a tilt, then a flying hat for every reason.
3. Beat 16, the vent, plant and security reasons. Do you want them to trigger by walking into the spot (and the vent actually pulling), or are the three buttons acceptable? Options: (a) walking triggers (rebuild); (b) keep buttons; (c) cut the plant and guard reasons and keep vent, hugs, bar, balloon and the 3 minute timer.
4. Beat 18, a catch inside the home room. Do you want the jail card there too? Options: (a) same lockup card, then back where he was; (b) the escort walk as today; (c) no catch at home at all, the guard only gives up or finds him hiding.
5. Beat 19, what Mops finds and says. The walkthrough has him find the flyer and fur but no words are decided. Options: (a) he finds them in silence, then "You have me."; (b) use the existing line "A flyer. And fur on the floor." before the two decided lines; (c) show the flyer and fur with no line.
6. Beat 20, TV words. The walkthrough has none but v1 shows "Fur in the scrubber." and "Onto the ship." Options: (a) no words, pictures only; (b) keep both captions; (c) a spoken line from Mops instead.
7. Beat 9, the conga and chicken dance. Are they real group dances (guests join in) or can they be skipped for the first rebuild? Options: (a) build both with guests joining; (b) build only the robot dance and dance circle; (c) cut conga, chicken dance and bouquet toss.
