# Design Checklists: Stealth Adventure Game

Use: review one scene at a time. Answer each question yes or no. Any "no" is a fix to make before calling the scene done.

Source tags:
- [G] Ron Gilbert, "Why Adventure Games Suck" (read in full).
- [H] Celia Hodent, GDC 2015 and GDC 2016 talk pages (text read; slide images not readable).
- [W] Wayline "Top 3 Habits" post (read in full; not the Steamhounds post).
- [A] Added by the reviewer or author. Not from any source.
- Korhonen & Koivisto and gamedev.net were not reached. Nothing here is tagged with them. See section E.

Terms:
- Affordance: a visual clue that shows what a thing does.
- Signifier: the visible part of an affordance, such as an icon, outline, or label.
- False affordance: a clue that suggests a use the game does not support.
- Vision cone: the shaded area a guard can see.
- Hide prompt: the on-screen button or hint that lets the player take cover.
- Capture: a guard catches the player, and the scene resets.
- Checkpoint: a saved restart point.
- Soft lock: the player is stuck with no clear way forward.
- Onboarding: the first minutes of play, when the player learns the rules.
- Cognitive load: how much thinking a task takes.
- HUD: heads-up display, the on-screen info layer.
- Tap target: the screen area that responds to a tap.
- Frame rate: how many pictures the game shows each second.
- Portrait / landscape: phone held upright / phone turned on its side.
- Hollywood time: pacing that favors the player over the clock.

## A. Ron Gilbert's rules (1989)

Each rule is restated in plain words. Source: [G].

A1. The player always knows the main goal.
    Stealth note: each hide section opens with one line of goal, such as "Reach the gate before the guard turns."
A2. Show the next small step.
    Stealth note: the first hide prompt names the cover and the action, such as "Hide behind the crate."
A3. The player should not need to die to learn a rule. Danger is fine if a clever player can survive it.
    Stealth note: the first time a guard can see the player, show a warning and a safe way out. The first capture is never a surprise.
A4. Show the problem before the solution.
    Stealth note: show the locked gate or the patrol gap first. Give the cutter or distraction item later.
A5. Never make the player pick up an item they cannot get back later. Hint at items they will need.
    Stealth note: keys, disguises, and distraction items stay available after a restart.
A6. Each puzzle moves the story forward.
    Stealth note: each hide section reveals a clue, a place, or a character.
A7. Use story time, not real time, for timed moments. Give the player slack.
    Stealth note: when the player is almost through a gap, the guard's turn waits. No capture by a few frames.
A8. The player must feel progress often.
    Stealth note: show a visible change after each guard passes, such as a new area or a checkpoint.
A9. Puzzles must make sense. Trial and error is a sign of a bad puzzle.
    Stealth note: the cone shape and the hide spot must match. The player should guess the rule from what they see.
A10. Give the player the benefit of the doubt. If they stand next to an object, assume they mean to use it.
    Stealth note: if the player is beside a crate and presses the action, they hide in the crate. Do not require a special button.
A11. Tie an unlock to the thing it unlocks.
    Stealth note: a gate opens because the player cut a wire or made noise, not because of an unrelated count.
A12. Do not cage the player. Give more than one way through.
    Stealth note: each guard group has at least two ways past, such as hide, distract, or go around.

Gilbert also argues against save games and padding with filler puzzles. These are his opinions, not checklist items.

## B. Usability: can the player use it?

Source note: groups follow the question set asked for. Hodent's pillar names are not used because they were not found.

### B1. Can I tell what to do?
- [ ] Does the scene state its goal in one short line when it starts? [G]
- [ ] Does the first hide prompt name the cover and the action? [G] [H]
- [ ] Can a fresh tester name the goal after two minutes, without help? Ask what the goal is, not whether it is clear. [H] [W]
- [ ] Are there three or fewer things to watch at once during first play? [H]
- [ ] Do tutorial tips appear when the player can act on them, not during a fight? [H]
- [ ] Are loading-screen tips limited to three points, with the "why" first? [H]

### B2. Can I tell what just happened?
- [ ] Does "hidden" show a clear change on the character or the cover? [H]
- [ ] Does "spotted" show both a visual cue and a sound cue? [H]
- [ ] Is the warning color kept for critical events, not used for everything? [H]
- [ ] Is feedback placed close to where the player is looking? [H]
- [ ] Does a capture say which guard and which vision cone caused it? [A]
- [ ] Do dialogue bubbles say what the picture shows? [A]
- [ ] Does a buy or collect show a clear change, such as a new count or a tick? [A]

### B3. Can I tell what is interactive?
- [ ] Does every usable object look different from scenery? [H]
- [ ] Does a usable hide spot look like a hide spot, by shape, outline, or icon? [H]
- [ ] Is every object that looks usable actually usable (no false affordances)? [H]
- [ ] Do icons make sense to a fresh tester without a label? [H]
- [ ] Do buy items show the price and whether the player can afford them? [A]
- [ ] Do dialogue bubbles show who is speaking? [A]
- [ ] Does an interact prompt appear only when the action works? [H]

### B4. Do controls behave the same everywhere?
- [ ] Does the same action use the same idea on keyboard, mouse, and touch? [A]
- [ ] Do on-screen labels match the key names in the help? [A]
- [ ] Are control hints shown on screen, so the player does not have to remember them? [H]
- [ ] Does each button do the same job on every screen? [A]
- [ ] Does pausing freeze vision cones and timers? [A]
- [ ] Do stealth timings stay the same at different frame rates? [A]

### B5. Can I recover from a mistake?
- [ ] Can the player leave a hide spot without a restart? [A]
- [ ] After a capture, does the restart put the player at a checkpoint near the same guard? [G] [A]
- [ ] Are items the player still needs safe after a restart? [G]
- [ ] Can the player close a dialogue bubble they did not mean to open? [A]
- [ ] Does a buy need a confirm step? [A]
- [ ] Is there a way out of every state, so there is no soft lock? [A]
- [ ] Is a punishment kept out of the first time a new mechanic is learned? [H]

### B6. Touch and phone checks
- [ ] Can the player reach the hide and action buttons with a thumb in a normal grip? [H]
- [ ] Are buttons far enough apart that a tap does not hit the wrong one? [H]
- [ ] Are tap targets large enough, tested on a real phone? [H]
- [ ] Does the screen show when a touch control is ready? [A]
- [ ] Does every core action work with one finger? [A]
- [ ] Does the game pause when a call, screen lock, or app switch happens? [A]
- [ ] Do pop-ups stay away from the guard and the cover? [A]
- [ ] Can the player move or resize on-screen buttons? [A]
- [ ] Does the scene work in portrait and landscape, or does portrait show a clear message? [A]

## C. Engagement and feel

### C1. Pacing
- [ ] Is there something new to see or do every few minutes? [G]
- [ ] Does each chapter end with a clear win and a new question? [G] [A]
- [ ] Is the game never too easy and never too hard for this stage? [H]
- [ ] Are long dialogue runs broken up, so the player can act in between? [H]

### C2. Humor timing
- [ ] Is a joke placed after a tense moment ends, not during one? [A]
- [ ] Does each joke show character or move the story? [A]
- [ ] Are warning texts kept free of jokes? [A]

### C3. Reward for curiosity
- [ ] Is there something useful or funny in each hidden corner? [A]
- [ ] Does an optional item give a story clue or a shortcut, not only a coin? [G]
- [ ] Can the player see what an item is worth before going to get it? [A]
- [ ] Do rewards meet a need: skill, choice, or connection? [H]

### C4. Difficulty fairness
- [ ] Does each stealth room have two or more ways past? [G]
- [ ] Is the first meeting with each guard type free of penalty? [H]
- [ ] Can the player see the rule behind every capture? [G]
- [ ] Does a near miss feel like a near win? [G]
- [ ] Is the capture-and-restart loop short, under about one minute? [A]

### C5. Show, don't tell
- [ ] Can the player learn a rule by trying it, such as a hide, instead of reading a box? [H]
- [ ] Does the story come through what the player sees, not only narration? [A]
- [ ] Does each dialogue bubble add something the scene does not show? If not, cut it. [A]

## D. Scene review card (ten questions)

1. Can a fresh tester say the goal in one sentence after two minutes?
2. Can they name the next small step?
3. Does every hide, buy, and dialogue prompt appear only when it works?
4. Does every change (hidden, spotted, bought, collected) have a clear sign?
5. Do keyboard, mouse, and touch do the same action?
6. Can the player leave any state (hide, bubble, shop) with one obvious control?
7. After a capture or mistake, does the restart put them near the problem with what they need?
8. Are there three or fewer things to watch during the first play of a new mechanic?
9. Is there an optional reward, and more than one way past each guard?
10. Can a tester finish the scene without a hint, and without dying to learn a rule?

## E. Sources

1. Ron Gilbert, "Why Adventure Games Suck And What We Can Do About It." Text copyright 1989; posted May 12, 2004. https://grumpygamer.com/why_adventure_games_suck (read; HTTP 200). Source for section A and parts of B and C. Gilbert notes in the post that he no longer agrees with everything in it.

2. Celia Hodent, usability and engage-ability pillars. NOT VERIFIED. The named pillars (signs & feedback, clarity, form follows function, consistency, minimum workload, error prevention/recovery, flexibility; motivation, emotion, game flow) were not found in any text read.
   - https://celiahodent.com/video-game-ux/ (HTTP 200). Returned the GDC 2015 talk page (dated March 31, 2015; updated June 1, 2020). Slides are images and were not readable. Used for perception, form follows function, memory, attention, workload, controls shown on screen, red overuse, and feedback near the aim point.
   - https://celiahodent.com/the-gamers-brain-part-2-gdc16/ (GDC 2016, dated March 22, 2016). Used for affordances (physical, cognitive, sensory, functional, false), the three-item limit during learning, no punishment while learning, loading-screen limits, and motivation (competence, autonomy, relatedness).
   - https://celiahodent.com/resources/ (read). No pillar list. Not used.

3. Korhonen & Koivisto playability heuristics. NOT VERIFIED. The Medium page returned HTTP 403. No fallback was found. Nothing from this source is in the file.

4. gamedev.net, "7 UX Lessons From The Trenches." NOT VERIFIED. HTTP 403. Nothing from this article is in the file.

5. Steamhounds / clarity post. The URL https://www.wayline.io/blog/ux-clarity-habits-from-day-one was read (HTTP 200). It is "Top 3 Habits: UX Clarity From Day One, Not 'Polish'" by Gemma Ellison, July 28, 2025. It does not mention Steamhounds. Its three habits are early prototyping with user feedback, consistent UI/UX documentation, and iterative playtesting focused on clarity. Used for the [W] item in B1.
