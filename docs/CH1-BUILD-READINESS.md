# Chapter 1 build readiness: beats 1–21 (through the first bedtime)
For Brian · Tuesday, November 10, 2026, about 6:30 AM ET · read-only check, nothing in the game repo changed

**Question (t307u):** can we build the game through going to bed on the first night (walkthrough beats 1–21), and is anything later in the story going to force us to redo it? And what small first piece can you play on the iPad and react to before the big build?

**Short answer:** yes. Nothing later in the story breaks beats 1–21, as long as we plant about 20 things the right way now. There are **three real risks**:
1. The bedtime story's pictures of the parents (beat 21) have to fit Chapter 4's "we didn't know where you were."
2. The party moves to the start of the game, so the code that runs the chapter in order has to be rewired.
3. The bar cut-in has to be built once, as a reusable piece, because beats 26, 27 and 52 use it again.

The first slice below is small, ends cleanly, and tests the two brand-new touch mechanics (dress-up and the bar cut-in).

**What I read:** `docs/CH1-STORY-WALKTHROUGH.md` beats 22–61 and its open questions; `docs/DECISIONS.md`; `docs/LATER-CHAPTERS-IMPROVEMENTS.md`; `replot/DOWNSTREAM-DECISIONS-2026-11-08.md`; `docs/CUT-IN-SPEC.md` (new, R80); and the repo's `main` at `439d443`, read only (README, `docs/MASTER-BACKLOG.md`, `src/game/12-ch1-redesign.js`, and the old `10-ch1.js` / `11-ch1-hall.js` scenes; `20-ch2.js`, `30-ch3.js` and `40-ch4.js` for callbacks). PR status: **#19 and #20 are merged**. **#17** (later-chapter walk-ins and the soup-note spoiler cut) and **#18** (docs: one decision log) are open.

---

## 1. What beats 1–21 must set up for later

Risk: **high** = getting it wrong means redoing a beat. **med** = a small rework or a wording change. **low** = just keep it consistent.

| # | Setup planted in 1–21 | Where it pays off later | What the build must do now | Risk |
| --- | --- | --- | --- | --- |
| 1 | **Parents' pictures in the bedtime story** (21) | Ch4: Mom says "Sweetie, we didn't know where you were." Downstream Q13 and W21: never explain why they didn't come back | Draw the crate being moved **out of their sight** before it's unloaded, so the parents never knowingly leave a baby on Stormtop (Downstream 13A). Needs your yes before beat 21 is drawn | **high** |
| 2 | **"You came to me in a Moon Pie crate"** (21) | Ch4: "...Lost in a Moon Pie shipment. Your crib was a Moon Pie crate." / "That's ME?" (X13); the escape crate (45, 51, 53) | Keep the shipment detail in the bedtime story (you approved it, R75(6)). That means Ch4 becomes a callback ("Like in your story...") instead of a surprise. That's a Ch4 word change for later, not a change to 21 | med |
| 3 | **Squatch's bed is a Moon Pie crate** (21) | Calendar (23), escape crate (53), Ch4 crib line | Check that the locked home picture actually shows the bed as a Moon Pie crate. If it doesn't, that's an art change and needs your yes (fidelity rule) | med |
| 4 | **Their song** (2) | Ch2 "sing from the crate", Ch3 "Will you still sing our song there?" / "It's still our song. For now.", the Ch2–4 SING lure | Use the same tune and SING control as Ch2–4. The old opening already has it ("♪ I'm floating in space! ♪" in `10-ch1.js`), so reuse it | med |
| 5 | **What Isfred says about robots** (5) | 31: "you know how much we love you here", 40: "they're not going to replace me", 42: Squatch knowingly signs the replacement order, 44: "replaced this week anyway" | Isfred must call them **helpers for the heavy work**, never janitor replacements. Don't reuse the old "They take every janitor's job." notice | med |
| 6 | **Isfred is one person** with an "Isfred" badge (5) | TV story (20), loading bay (30–32), office (59, 60) | Use the same drawing everywhere. Main's bubbles say "Isfred Bar Neshuman", which is fine. The desk nameplate is only needed in the office (not in 1–21) | low |
| 7 | **The robots poster: COMING SOON** (5) | 30: three robots roll off the ship | Draw the robots on the poster the same as the game's delivery robots | med |
| 8 | **The robot flyer** (8) | 19: Mops finds "a flyer and fur" | Picking it up stays required before party play starts, as on main (Downstream 2A), so Mops can always find it | low |
| 9 | **The FUR alarm pull station** (17) | 25 (lunch sneak: "they run to the wall alarm"), 42 (night), the chapter-wide security rule | Build it as one object that gets reused: someone sees fur, walks to the red pull station, pulls it, and security comes. Place it on the locked party-hall wall | med |
| 10 | **Security chase and room search** (18) | 25, 42, 47, 55; the one capture rule (`25-capture.js`) | Use the one capture rule. You can only get caught if the guard actually reaches him | low |
| 11 | **Balloon state** (15) | 25 ("balloon still there"), every later hall visit, 57 POP | Main already saves where it ended up (tied or ceiling) and whether it popped, all the way into Ch2. The pop must still happen only on the last walk (57), even though there are now more hall visits | med |
| 12 | **The same kid and the same guests** (8–17) | 25 (guests with sight cones), 38 (people in line, the brochure family) | Keep one fixed guest list. Day 2 crowds reuse those guests, never new random ones | low |
| 13 | **The snack bar, the bartender and the pyramid** (14) | 27 (one snack, behind the counter), 38 (line about missing Moon Pies), 52 (take all the snacks) | Same stand (R9), same bartender. Restock the pyramid by Day 2. **Build the cut-in once (R80)** so 27 and 52 reuse it | **high** (rework if it's built just for the bar) |
| 14 | **The Moon Pies he took at the party** | 38: "I swear we had more Moon Pies... is that what they stole at lunch?" | Small word fix later: he takes lots at the party but only one at lunch, so "at the party?" fits better. That's a change to 38, not to 1–21 | low |
| 15 | **The dress-up wardrobe** (7) | 56: spare blue jacket, beard and horns from the same wardrobe; the empty hook after he takes the jacket | Leave the spare blue jacket and the horns out of the dress-up set, or the goat costume loses its pieces. The calendar shows only while the door is shut (main already does this) | med |
| 16 | **Does the outfit carry over?** (7 → 8–16) | Nothing after the party uses it. The next disguise is the goat costume (56) | Keep it inside the party: the outfit stays on all party long and is gone after the FUR alarm. It doesn't come back in Day 2 | low |
| 17 | **Wookiees and the no-fur rule** (TV, 20) | 58 scanner "FUR DETECTED. NO WOOKIES!", Ch2 TV "WOOKIE SPOTTED IN SPACE!", Ch2–4 "WOOKIE?!" | Reuse the old flashback (`10-ch1.js`: tour group, shedding, clog). Isfred walks them out and types the rule. Cut "Nobody can live outside". Note: the kid's "Scary Wookiee!" (15) comes before the TV story explains the word | med |
| 18 | **"Everyone out there has someone." / "You have me."** (19) | Ch3 "It's still our song" heart beats | Words only, as approved. Main's old "A notice can't mop a floor." becomes "A flyer can't..." (needs your yes) | low |
| 19 | **The Guardian Box at home** | 22 (gift goes in), 48, 53, the Ch4 paw-copy payoff | The box is visible at home all through 1–21. Nothing goes in it yet | low |
| 20 | **The party-hall exit and floor vent** | 25 and 29 use the hallway exit; the vent can tug the disguise (16) | Follow the locked hall: the exit is at the north end of the right wall, and the floor vent stays away from the photo corner | low |
| 21 | **Score** (dance about 300, karaoke up to 50, photo 25) | Ch1 tally card, "Never caught! +250" | The party's FUR alarm is story, not a catch. Only a real catch during the search (18) costs "Never caught!" | med |

### Later beats that could force a change to 1–21
| Later item | What it could change in 1–21 | Risk | How to stay safe |
| --- | --- | --- | --- |
| Why the parents didn't come back (Downstream Q13, Ch4 reunion) | The pictures in beat 21 | **high** | Get your yes on 13A before drawing 21. That's in PR 3 at the end, so it doesn't hold up the first slice |
| Ch4 "That's ME?" (X13) | The bedtime story's words, if you picked B (drop the shipment detail) | med | You already kept the shipment detail (R75). Ch4 changes instead |
| Guardians gift timing (Open Q8: Day 2 morning or bedtime) | If it's bedtime, it joins beat 21 | med | Build 21 without it. Adding it later is a small change |
| Beat 31/40: Isfred's promise, and Mops believing him | The announcement wording in 5 | med | "Helpers" wording, as above |
| Cut-in reuse at 26, 27 and 52 | How beat 14 is coded | med | One shared cut-in from the start (R80) |
| Hallway build (R51/53/55, next on main) | None. Beats 1–21 never enter the hallway | low | Keep party guests out of the hallway exit |
| Calendar vs PA announcement (Open Q6) | None in 1–21 | low | n/a |
| Pink copy to Mars (O9, O10, X8), 4B (a week or the next visit), Ch2 ride (C2-1) | None in 1–21 | low | n/a |
| Ch2–4 `WOOKIE` lines | Need the TV story to explain the word | low | Keep the TV story |

---

## 2. Beats 1–21 compared with `main` (439d443)

**The big structural difference:** on main, the order is lunch → delivery → snack line and brochure → Mars talk → bedtime → **party** → home → night mailbox → six days later... In the walkthrough, the party is **Day 1**, before lunch, followed by the chase home, the TV story and the bedtime story. So the build has to move the party block to the front, then go from beat 21 into main's existing lunch (Day 2). After the Mars talk, bedtime goes straight to the night mailbox. `tests/ch1-playthrough.mjs` and `tests/routes/ch1.json` both need the new order.

| Beat | On main already | New | Conflicts with main |
| --- | --- | --- | --- |
| 1 Meet Squatch | Two opening cards and the walk around the locked home room (STAY IN HERE poster) | none | none |
| 2 Mops, their song | No song in the redesign; it jumps straight to lunch lines. The old opening's SING ("I'm floating in space!") can be reused | Song beat; Mops leaves for work | Main's start plays the Day 2 lunch lines right after the walk |
| 3 Peek | Party "peek" (QA) starts with Squatch already in the plant | Tap the doorway to peek | Main has the "Everybody has somebody." card here. It moves to 19 |
| 4 Sneak and hide | Plant hide spot (220, 530) | Sneaking past the guests' sight, eyes-only in the plant | none |
| 5 Announcement | "Welcome, Bleep-Bloop Robotics delegation!" + "Robots?" | Three new Isfred lines, Isfred badge, robots poster | The line is replaced |
| 6 Croc Boys | none | Band, dim lights (looks only), robot dance | none |
| 7 Dress-up | Wardrobe open/closed art; walking between rooms | The whole dress-up game | Main's "PUT ON · tourist disguise" spot in the party hall is removed |
| 8 Into the party | Required "TAKE · robot flyer" starts the party clock; TALK "Love the shirt." | Guest chatter (lines not written) | Main's LISTEN "...is that what they stole at lunch?" belongs to beat 38 and comes out of the party |
| 9 Wedding party | none | Conga, chicken dance, cake, dance circle, bouquet | none |
| 10 Dance game | none | Arrow game | none |
| 11 Karaoke | none | Moon Pie song at the mic | none |
| 12 Octopus | HUG spot, 1st hug = hat askew, 2nd = off, "*hic* Fellow tourist!" | Slow chase and juke, give-up time | Main's octopus stands right by the bar (820, 540), the "octopus on the bar" you flagged |
| 13 Photo corner | SNAP, Polaroid panel, `PHOTO_BONUS = 25` (**already approved 11-09**) | Countdown light, "Say cheese!", tripod and backdrop | Main's camera is top-right (790, 230). The walkthrough puts it on the left under the big window. The walkthrough's "points pending" is out of date: 25 is approved |
| 14 Bar snacks | GRAB snack; the 3rd grab spills; `SNACK_LOOK_SECONDS = 4` (**already approved 11-09**) | The cut-in (R80), the pyramid, the bartender turning, two catches, the chain | Main says "One snack. That's the rule." at the party and spills on the 3rd snack. Both are replaced |
| 15 Balloon | All of R58/R59/R61: 6 s, give or keep, the kid's faces, "Scary Wookiee!", saved into Ch2 | The close-up framing | none (the release is tied to picking up the flyer, which is fine) |
| 16 Disguise off | Plant, vent, guard, hug, balloon, and "Cool hat!" at 120 s | Bartender as a cause; 3 minutes; the new fallback | `COOL_HAT_SECONDS = 120` says "Do not change this" (S15). R73 changed it to 3 minutes, so the comment goes |
| 17 FUR alarm | PA "FUR! Security!" and a FUR panel | A guest (or the bartender) runs to the red pull station | Main uses the PA voice. The walkthrough has a guest shout it and pull the alarm |
| 18 Run home, search | Capture rule, hiding | Chase into home, guard search | Main jumps straight home |
| 19 Homecoming | "A flyer. And fur on the floor." | "Everyone out there has someone." / "You have me." | Main goes straight to the night mailbox after this |
| 20 TV story | Old flashback in `10-ch1.js` (debug only) | Hooked into the new order as a full-screen cutaway | none |
| 21 Bedtime story | `ch1Bedtime` (sleep walk) exists, but it's the Day 2 night | Story pictures, parents | That bedtime stays for Day 2. This is a second one |

**Open PRs:** #17 changes `50-story-frame.js` and `60-frame-draw.js`, which the party build also touches, so expect a small merge conflict. Merge #17 first or rebase after it. #18 is docs only, but it adds `docs/DECISIONS.md` and `docs/STATE.md` to the repo. Merge it first so the build PR's doc updates land in one place.

---

## 3. Build slices

**Your default (beats 3–14) is a good size of story, but it puts three brand-new games (dress-up, dance, karaoke) plus the cut-in into one PR, and it stops in the middle of the party with no ending.** I recommend a slightly different first slice. It tests the two new touch mechanics that share code, and it ends in a full loop:

### PR A (first slice): "Dress up, sneak in, raid the bar"
Beats **1 → 3 → 4 → 5 → 6 → 7 → 8 → 14 → 16 → 17**, then a simple run home that joins main's existing homecoming and Day 2. That way a new game still plays to the tally card.
- 1 as on main. 2 is a stand-in for now: Mops waves and walks out the door (the song comes in PR C).
- Peek by tapping the doorway, sneak to the middle plant, Isfred's three lines and the COMING SOON poster, Croc Boys with lights dimmed and a simple robot-dance loop (no mini-game yet).
- **Dress-up game** (R74) at the home wardrobe.
- Into the party: required flyer, guest TALK.
- **The bar cut-in** (R80, `docs/CUT-IN-SPEC.md`): paw icon, 0.5 s zoom, blurred party with the bartender visible and turning, paw follows your finger, bottom-left bag drop zone, white X bottom-right, two catches = FUR alarm, a bottom grab = Rube Goldberg chain and a 4 s look-away to hide. Built as the shared cut-in piece, with its own test.
- Main's balloon, octopus, photo, plant, vent and guard snags stay as they are (moved off the bar), so the party still feels full. Main's "Cool hat!" clock goes to 3 minutes as a placeholder.
- FUR alarm at a red pull station, then run home.
- Main's "One snack. That's the rule." at the party, the LISTEN line and the third-snack spill come out. The party block moves out of the slot after the Mars talk.
- Playable on iPad from a new game, plus a debug link `?scene=QA` straight to the party.

**What you'd be judging:** does the dress-up feel right, does the cut-in feel like the original, can a kid read when the bartender is about to turn, and does the party read as busy.

### PR B: "The party, all of it" (beats 9–13, 15, 16)
Wedding-party moments, **dance game** (10), **karaoke** (11), octopus slow chase and juke (12), photo corner with the countdown, moved to the left window (13), balloon close-ups (15), the 3-minute fallback (Open Q4), all party clocks paused during mini-games and cut-ins.

### PR C: "Home and bedtime" (beats 2, 18–21)
Their song (2, reusing the existing SING), guard chase and room search (18), homecoming words (19), the TV cutaway rebuilt from the old flashback (20), the bedtime story with the parents' pictures (21, needs the 13A yes), then on into Day 2 lunch. Also the Ch1 play-through route in the new order.

Each PR follows the usual rules: every new line goes in `docs/CH1-LINES-FOR-BRIAN.md`, tests pass, and nothing merges without your written yes in the PR.

---

## 4. Decisions that block building (with the stand-in the build will use)

Every one of these can be built with the default below as a stand-in, clearly marked. None of them merges without your yes.

| # | Decision | Default for the build | Needed for |
| --- | --- | --- | --- |
| 1 | All "pending" lines in beats 1–21 (Isfred ×4, Croc Boys, dress-up labels, "Sing?", song lyrics, "Say cheese!", both bartender catches, "FUR! Security!", "FUR / PULL DOWN", "Everyone out there has someone.", bedtime line) | Use them exactly as written in `CH1-CARTOON-LINES.md`, listed in the lines file | A, B, C |
| 2 | Guest chatter at the party (not written yet) | Main's "Love the shirt." for now, plus 3 short new lines for your review | A |
| 3 | Snack spill chain (proposed) | Build it: only a bottom-row grab topples the pyramid, once per party | A |
| 4 | Spill hide time | **4 seconds**, which you already approved (`SNACK_LOOK_SECONDS`) | A |
| 5 | The "pouch" | Replaced by the cut-in's bottom-left bag (R80) | A |
| 6 | Bartender turn rhythm | Back turned 4–7 s (random), a 1 s over-the-shoulder glance as the warning, then facing him for 2 s. It only counts as a catch if a snack is in his paw while she faces him. Catches reset each party | A |
| 7 | Does taking snacks give points? | No points, just a count on the bag (adding points needs your yes) | A |
| 8 | Do threats wait during a cut-in? | Yes, everything except the bartender. The party clock also pauses | A |
| 9 | Cut-in numbers | Zoom in 0.5 s, out 0.4 s, blur about 6 px, 35% darker, 64 px buttons (spec) | A |
| 10 | Hunger meter | None (new rule) | A |
| 11 | Outfit carry-over (Q20) | **A: he wears the outfit he built.** If there's no hat, the plant or vent snags the head piece. The spare blue jacket and horns are left out of the dress-up set | A |
| 12 | Dim lights (Q19) | Looks only | A |
| 13 | Party length and the "Cool hat!" fallback (Q4) | 3 minutes. In A: main's "Cool hat!" as a stand-in. In B: option B, the octopus comes for a hug you can't dodge | A, B |
| 14 | Dance points | 10 per hit, about 30 arrows | B |
| 15 | Karaoke points | Up to 50, scaled by the cheer | B |
| 16 | Photo points | **25, already approved** (`PHOTO_BONUS`); the walkthrough's "pending" is out of date | B |
| 17 | Octopus speed and give-up | 70% of Squatch's speed, gives up after 10 s, back after 30 s | B |
| 18 | Squatch on the stage for karaoke (Q21) | Yes, in disguise | B |
| 19 | Many snacks at the party vs the one-snack rule (Q22) | No change | A |
| 20 | **New:** where he hides at home during the search (18) | Inside the wardrobe (it's already drawn and opens and closes). The guard looks for 4 s, then leaves | C |
| 21 | **New:** does the party's FUR alarm cost "Never caught!"? | No. Only a real catch during the search does | C |
| 22 | **New:** the kid says "Wookiee" before the TV story explains it | Keep it. The TV story pays it off the same night | A |
| 23 | Parents' pictures in the bedtime story (Downstream 13A) | The crate is moved out of their sight before unloading | C (blocks drawing 21 only) |
| 24 | Bed is a Moon Pie crate (check the locked home art) | If it isn't drawn that way, ask for your yes on a small art change | C |
| 25 | Mops's "A notice can't mop a floor." | "A flyer can't mop a floor." (pending) | C |

**Not blocking 1–21:** Isfred's desk nameplate (office), Guardians gift timing (beat 22), calendar vs PA (Open Q6), and all the Day 2 and later questions.
