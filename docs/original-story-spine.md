> This file is Brian's Nov 2 story spine, replacing the earlier stub. Only the Chapter 2 kitchen was revised since, in `docs/story-bible.md`.
> Where the game departs from this spine, the departure is judged in `docs/CHIP-ARMATURE-AUDIT.md`.

# Sneaky Sasquatch: Space Snack Quest — THE STORY SPINE
*Home is where love doesn't have to hide.*

This is the single source of truth: scene by scene, in play order. If a detail isn't in a scene, it doesn't exist. Code is built from this word for word.

**How to read it:**
- `SPEAKER: "text"` is a speech bubble over that speaker's head. Each bubble waits for a tap.
- `[CARD]` is a full-screen plain card that waits for a tap.
- `[PANEL]` is a pop-up drawn picture that waits for a tap.
- `(whisper bubble)` means a dotted, smaller bubble style, not printed words.
- `[chip]` is the objective chip at the top. It's hidden while a bubble is up.
- `(ear)` means an overheard line: the bubble gets a small ear icon.
- Nothing ever auto-advances.
- **Singing exists only in two places:**
  - LURE SPOTS: a hiding spot with a music-note marker and the SING prompt, placed where a guard can be drawn away so Mops can sneak.
  - Scripted bond moments: O2a, the Ch3 sting, the Ch4 climax.
  - Everywhere else, Action does its normal context action. There's no random or ambient singing, no opera and no goat gags, unless a scene below gives them a purpose.
- **Sightings have consequences:**
  - Security rushes over, and you get a few seconds to hide.
  - If you're caught, Mops swoops in:
    - MOPS: "Just a fuzzy mop! Very fuzzy." (tap)
    - MOPS: "Shedding season." (tap)
  - Then you're back at the last checkpoint.
  - O4 is the one scripted exception: it chases you home with no catch.
- **People and bots who can see:** each shows a cone or an eye icon. If Squatch is unhidden inside it, they ALWAYS react (scream or alert, then security comes).
- **Look:** Squatch is variant C, "Outlined Buddy" (chunky, wavy brown fur, peach heart-shaped face, bold dark outline; see art/squatch-variants.html). Mops matches: outlined white wavy fleece, curved horns, a VERY long beard to the floor, gold badge, mop.
- **One bubble at a time,** ever.
- **Points:**
  - A star counter "★ 0" sits beside the chapter chip.
  - It first appears in S1, with the first secret. There's no score during the opening O0–O9: one idea at a time.
  - **SECRET +50:** a hidden thing with an in-world reason. A sparkle and "+50 SECRET!" float up. Counted as "Secrets x/10".
  - **FUNNY FIND +25:** a look-at gag that tells you something about the story.
  - **SNEAKY! +100:** finishing a marked sneak or lure section without being caught.
  - **GHOST BONUS +250:** a whole chapter without being caught.
  - **CAUGHT −100:** the score never drops below 0. Mops's two catch lines play, then you're back at the checkpoint.
  - O4 (the scripted chase home) never costs points.
  - **End-of-chapter tally card** (waits for a tap):
    - "Secrets found 5/6"
    - "Funny finds 3/4"
    - "Sneaky! 3/4"
    - "Times caught 2 (−200)"
    - "Chapter score ★ 650"
  - **Final score screen** after Ch4: the total, 1–3 stars, and "Best ★" saved on this device.
- Art style everywhere: the cutscene look. Flat shapes, bold outlines, a limited palette, only what matters on screen, and the interactive thing pulsing. Drawn, never described.

**Status:**
- Ch1 is fully scripted and awaiting Brian's approval.
- Ch2–Ch4 are carried over as outlines. Their lines are from earlier approved plans; they get scripted to this level after Ch1 is approved.

---
## CHAPTER 1 · STORMTOP

### O0 · Where we are
- **Spine:** Once upon a time.
- **Where / visible:** black, then the card.
- **Script:**
  - [CARD] "Stormtop Cloud Resort, floating above Jupiter."
    - Art on the card: big striped Jupiter with the Great Red Spot. Above it, a small white domed station sits on a puffy cloud, with tiny yellow windows and a tiny banner.
  - [CARD] tap → the camera cuts to the closet, which fills the screen. A label at the top reads "MOPS'S JANITOR CLOSET".
- **Player:** tap.
- **Causes:** we know the place and that home is a closet.
- **Art:** the closet is drawn as in the mockup (v3-mock-closet-simple.png).
  - Visible from now on:
    - Squatch's bed: an old crate stamped MOON PIES, with a purple blanket.
    - The Guardian Box: a small blue box with a "G".
    - A small TV on a shelf.
    - Mops's notepaper shelf: a stack of white paper squares.
    - The mop-bucket crib.
    - Height marks on the wall.
    - The door, with a crayon sign: "STAY IN HERE! — Mops", and a goat doodle.
    - A small floor vent grille in the corner. It's the same duct the slip half blows into in S3; Mops fits, Squatch doesn't.
    - Mops himself, by the door.
  - Nothing else.

### O1 · This is Squatch
- **Spine:** Once upon a time.
- **Visible:** Squatch sitting on his crate bed. Mops by the door, polishing his badge.
- **Script:**
  - [CARD] "This is Squatch. He's a Sasquatch." (tap)
    - A plain card over the dimmed closet, with Squatch left visible and lit in the middle.
  - [chip] "Walk around"
- **Player:** joystick (or arrow keys). After about 3 steps of movement, the beat ends.
- **Causes:** the joystick is learned. The breather is the walking itself.
- **First required input:** about 5s from start.

### O2a · Our song
- **Spine:** Once upon a time (the bond).
- **Visible:** Mops sways. Music notes float from him.
- **Script:**
  - MOPS: "♪ Hmm-hmm-hmmm... ♪" (tap)
  - [chip] "Tap ACTION to sing along". The ACTION button pulses and reads SING.
- **Player:** Action.
- **Squatch's song:**
  - SQUATCH (song bubble): "♪ I'm floating in space! ♪"
  - MOPS (song bubble): "♪ Baaa-aa-aaa! ♪"
  - These are song bubbles that tap away.
- **Script (after the song):**
  - MOPS: "That's our song." (tap)
- **Causes:** the bond, and the Action button. Breather: 2.5s of quiet humming.

### O2b · The rule, tonight
- **Spine:** Every day (the rule).
- **Visible:** Mops picks up his mop and taps the door sign. The sign pulses and zooms slightly so it can be read.
- **Script:**
  - MOPS: "Big inspection tonight." (tap)
  - MOPS: "Stay put, buddy. Extra put." (tap)
  - MOPS: "Night, Squatch." (tap)
  - SQUATCH: "Night, Mops." (tap)
- **Then:** Mops walks out and the door shuts.
- **Player:** taps.
- **Causes:** the player SAW the rule (the sign) and heard why tonight is special.

### O3 · Everybody has somebody
- **Spine:** Every day (lonely).
- **Visible:**
  - The closet is quiet, with Squatch alone.
  - After 2s, a warm glow shows under the door, and music notes and little "ha ha!" puffs drift in through the crack.
  - The door pulses, and ACTION reads PEEK.
- **Script:** [chip] "What's that noise?"
- **Player:** walk to the door, press Action (PEEK).
- **[PANEL] Through the door crack** (drawn, no captions):
  - A wide lobby.
  - A big banner: "WELCOME, BLEEP-BLOOP ROBOTICS DELEGATION!"
  - Execs in grey suits with name badges.
  - A woman with a clipboard, badge "MANAGER".
  - A family taking a photo, a kid on his dad's shoulders, a camera flash star.
- **Script:**
  - SQUATCH: "...Everybody has somebody." (tap)
- **Then:** the panel closes. ACTION now reads SNEAK OUT, and the sign beside the door pulses.
  - SQUATCH (whisper bubble): "Sorry, sign." (tap)
- **If no input for 10s:**
  - SQUATCH (whisper bubble): "Just one peek. Mops won't know." (tap)
- **Player:** chooses SNEAK OUT.
- **Causes:** he breaks a rule we watched being set, on the same door, with the sign in view, and says sorry to it. That is how the player knows he's sneaking.

### O4 · No way out
- **Spine:** Every day (he is always seen). Tonight is worse because of the delegation.
- **Visible:**
  - A small lobby: the closet door in the middle and three exits, each with something that SEES.
  - There are no hiding spots in the lobby.
- **The three exits:**
  - **Left, the Great Red Spot window:** a family photo, with the kid on the dad's shoulders.
  - **Up, the main hall:** the delegation execs, the MANAGER with her clipboard, and a camera person.
  - **Right, the snack counter:** a DEMO BOT mopping in circles under a sign "FLOORS THAT MOP THEMSELVES!", with its round light sweeping.
- **Just outside the closet door:** an air-scrubber grille, a grey box with slats.
- **Script (all live: small bubbles that pop and fade by themselves; the game does not pause, because it's a chase):**
  - Passing the grille: AIR SCRUBBER: "*KOFF* FUR IN FILTER!"
  - Left: KID: "DADDY! A BIG DOG!" Heads turn and "!" pops over them.
  - Up: a camera FLASH (one white blink), then EXEC: "Was that... FUR?"
  - Right: the light finds him. DEMO BOT: "FUR DETECTED?"
  - Each time: SQUATCH: "EEP!" He hops back toward the closet and control returns.
  - After the 2nd notice (or 20s): SQUATCH: "Everyone's looking!"
  - Then: STATION PA: "FUR DETECTED! FUR ALERT!"
    - Not "Wookie": that word isn't introduced until O7.
    - This is the one paused bubble in the beat. It shows top-center with a speaker icon. (tap)
  - Then the alarm border flashes, a SECURITY BOT's flashlight starts down the hall, and the closet door glows green: the only highlighted thing.
  - [chip] "Back to the closet!"
- **Player:** joystick. They try 2–3 directions. Each one gets him seen a different way, and each push-back points home. No fail screen: it should feel like being chased home.
- **Causes:**
  - FUR in the scrubbers on inspection night. This becomes the cause of Delivery 1, in scene S3.
  - The slogan "FLOORS THAT MOP THEMSELVES!" is now seen.

### O5 · Hide
- **Spine:** Every day (hiding).
- **Visible:** the closet. The crate bed pulses and ACTION reads HIDE.
- **Script:** [chip] "HIDE under your bed!"
- **Player:** Action at the bed. Squatch slides under it, and only two eyes show.
- **Then:**
  - The door slides open. The SECURITY BOT rolls in, and its flashlight cone sweeps across the floor and over the bed.
    - SECURITY BOT: "BEEP. SEARCHING." (tap)
  - Mops bursts in behind it, swinging his mop. The floor shines wet and the bot skids a little.
    - MOPS: "Just me, mopping!" (tap)
    - SECURITY BOT: "...JANITOR. CARRY ON." (tap)
  - The bot rolls out.
- **If the player leaves the bed while the cone is inside:**
  - SECURITY BOT: "Beep?" The beat rewinds 3s.
- **Causes:** hiding is learned, and Mops covers for him.

### O6 · You went OUT?
- **Spine:** Every day (the rule's cost).
- **Visible:** Squatch crawls out. Mops is panting and leaning on the mop.
- **Script:**
  - MOPS: "You went OUT? Tonight?" (tap)
  - SQUATCH: "Everybody out there has somebody." (tap)
  - MOPS: "You have me." (tap)
  - MOPS: "We stay hidden. That's how we stay safe." (tap)
  - MOPS: "Back to work. Stay put." (tap)
- **Then:** Mops leaves. The TV on the shelf is left on and flickers.
- **Causes:** this line is the one ask 3 calls back to in S6.

### O7 · Why everyone screams
- **Spine:** Every day (why fur is feared).
- **Visible:** the TV screen shows "SAFETY VIDEO" and pulses. ACTION reads WATCH.
- **Player:** Action at the TV.
- **Script (FB2):**
  - [CARD] "Years ago, on Stormtop..." (tap)
  - Frame: a tour flag and three tall, shaggy, light-brown Wookies smiling. "A Wookie tour group came to visit Stormtop." (tap)
  - Frame: fur puffs flying everywhere. "They shed. A LOT." (tap)
  - Frame: a scrubber grille stuffed with a big hairball, and tourists clutching their throats.
    - Caption: "The fur clogged the air scrubbers. Everyone gasped for air!" (tap)
    - TOURIST: "*gasp*" (tap)
  - Frame: a big brown fur circle with a red "no" slash. "Nobody can live outside. The scrubbers keep us breathing. NO FUR." (tap)
  - [CARD] "Now" (tap)
- **Causes:** the O4 scrubber cough now makes sense. So will the delegation's worry, and later the bots and the scanner.

### O8 · The Guardians came
- **Spine:** Every day (the guardians).
- **Visible:** Squatch alone. The crate bed pulses and ACTION reads SLEEP.
- **Script:**
  - SQUATCH: "...Sorry, Mops." (tap)
- **Player:** Action at the bed. "z z z" floats up for 2s. Flat lighting, no night system.
- **Then:**
  - Squatch sits up.
  - On the blanket, where there was nothing before: a Moon Pie and a folded note, pulsing. ACTION reads GRAB.
  - Mops is asleep in the corner chair, snoring "zzz", visible but not pointed at.
- **Player:** Action.
- **[PANEL] The note** (drawn on the same white paper squares as Mops's shelf):
  - Line: "Rule #1: Brave Sasquatches stay hidden."
  - Line: "— The Guardians"
  - A drawn big-foot doodle as the signature.
  - A long, wiggly white hair stuck across the corner, drawn and not labelled. (tap)
- **Script:**
  - SQUATCH: "The Guardians came!" (tap)
  - SQUATCH: "They always come when I'm scared." (tap)
- **Then:** [chip] "Put the note in your Guardian Box". The box pulses.
- **Causes:** the player has met the Guardians through play (a gift that wasn't there before, right after the scare) before seeing the box.

### O9 · My Guardian Box
- **Spine:** Every day (his belief).
- **Player:** Action at the box.
- **[PANEL] The open Guardian Box** (drawn, no captions):
  - A thick stack of the same white notes, each with "— The Guardians" and a big-foot doodle. The top three are readable:
    - "Happy birthday, Squatch! — The Guardians"
    - "Eat your veggies. — The Guardians"
    - "Rule #1: Brave Sasquatches stay hidden. — The Guardians" (the new one slides onto the top)
  - Beside the notes, a crayon drawing in wobbly kid lines:
    - the heading "MY GARDIANS", with a backwards S;
    - two huge brown furry Sasquatches holding hands with a tiny Squatch in the middle, all smiling;
    - "by Squatch age 6" in the corner.
- **Script:**
  - SQUATCH: "One more for the box." (tap)
  - SQUATCH: "Big, furry, and secret. Like me." (tap)
  - SQUATCH: "Someday I'll meet them." (tap)
- **Causes:** we know his belief: secret Sasquatches look after him. Mops is not revealed. The player has two quiet clues: the white hair, and Mops's paper.

### S1 · Morning: the lunch
- **Spine:** Every day (normal days are quiet).
- **Visible:**
  - Mops yawns and stretches.
  - On the shelf, a brown lunch bag with "MOPS" on it.
- **Script:**
  - MOPS: "Morning, buddy. Off to work!" (tap)
  - MOPS: "Stay put." (tap)
- **Then:** Mops leaves, and the lunch bag pulses.
  - SQUATCH: "He forgot his lunch!" (tap)
  - [chip] "Bring Mops his lunch"
- **Player:** grab the bag (Action). Sneak out: it's a NORMAL morning with just two tourists, both looking out the window. Plants and boxes are the hiding spots (ACTION reads HIDE). Each tourist shows an eye icon and a soft cone facing the window. If Squatch steps into a cone unhidden, that tourist screams "WOOKIE!" and a security bot comes, the same rule as everywhere. Behind them, he's safe.
- **Causes:** we feel the contrast: normally he can slip around unseen. The new mechanic is hiding from a tourist who walks by.
- **Points (introduced here):**
  - **SECRET, Mops's emergency Moon Pie stash:** a tin tucked under the notepaper shelf in the closet. It's the same Moon Pies as the Guardians' gift: a quiet clue that pays off in Ch2 FB3.
    - SQUATCH: "Mops's emergency Moon Pies!" (tap)
  - **FUNNY FIND, the height marks:**
    - SQUATCH: "Height marks! SQUATCH age 1, 2, 3... 9. And MOPS: always the same."
    - MOPS: "Goats peak early." (said in S2 if found)
  - **FUNNY FIND, the mop-bucket crib:**
    - SQUATCH: "My baby bed! A mop bucket. Still smells like lemons."
  - **SNEAKY!** for reaching Mops without a tourist seeing you. The star counter appears with this first point.

### S2 · Hair vs fur
- **Spine:** Every day.
- **Visible:**
  - Mops mopping proudly by a wall of 47 photos of himself in the same pose with the same mop.
  - His badge shows GOAT HAIR: certified Hypo-Alien-Genic™, with a tiny goat.
- **Player:** Action at Mops (GIVE).
- **Script:**
  - MOPS: "My lunch! You're the best." (tap)
  - [PANEL] the badge, close up and drawn: "SIR MOPS-A-LOT · HEAD GANITOR" on top, then "GOAT HAIR: certified Hypo-Alien-Genic™", a goat face and a gold star. (tap)
    - This is the first time the word "GANITOR" appears, before the terminal in S7.
  - SQUATCH: "Why can YOUR hair be here?" (tap)
  - MOPS: "Goat hair. Hypo-Alien-Genic." (tap)
  - SQUATCH: "What's the difference between fur and hair?" (tap)
  - MOPS: "Paperwork." (tap)
- **Causes:** "Paperwork." makes sense of Mops signing things, which comes next. Breather: 2.5s.
- **SECRET, the smiling photo:** 46 photos show the same serious Mops. One has a crayon smiley added by little Squatch. It pulses only when you're close.
  - SQUATCH: "Photo 23. I fixed it when I was 5." (tap)

### S3 · The delegation's report, and Delivery 1 (live cutscene, no card)
- **Spine:** Until one day.
- **Visible:**
  - The camera pans to the hangar window, and the robot delivery ship docks.
  - Everyone who speaks is on screen: the PA is top-center, Mops is beside the hangar, Squatch hides behind a plant nearby.
- **Script:**
  - STATION PA: "Delegation report: FUR in the air scrubbers." (tap)
  - STATION PA: "Janitorial issue! First robot order: APPROVED." (tap)
  - SQUATCH (whisper bubble): "...That was MY fur." (tap)
  - STATION PA: "DING DONG! Delivery for Stormtop!" (tap)
  - Three Bleep-Bloop Bots roll down the ramp and their searchlights switch on.
    - STATION PA: "Bleep-Bloop Bots! Floors that mop THEMSELVES!" (tap)
  - Three janitors with buckets (Dot, Bob, Lou, with name tags) walk sadly up the ramp.
    - STATION PA: "Janitors Dot, Bob and Lou... REPLACED." (tap)
  - MOPS: "Pfft. They'd never replace me." (tap)
  - MOPS: "47 Employee of the Month photos." (tap)
  - A delivery bot holds out a slip and Mops signs it with a scribble.
    - MOPS: "...Paperwork." (tap)
  - He crumples it and it RIPS. One half drops into the Storage trash can and the other half flutters into a floor vent. Both are drawn, with the camera following each half.
  - STATION PA: "Back soon with your NEXT order!" (tap)
  - The ship leaves, and one big crate stamped MOON PIES ×500 is left on the deck.
- **Causes:**
  - Bots now patrol.
  - The slip halves are where the player saw them land.
  - Mops's "never replace me" is set up.
  - The guilt: his fur cost three janitors their jobs.

### S4 · I came in a crate like this
- **Spine:** Until one day.
- **Visible:** a bot's searchlight swings toward Squatch. The MOON PIES ×500 crate pulses and ACTION reads HIDE.
- **Script:** [chip] "Bots! Hide in the crate!"
- **Player:** Action. Squatch climbs into the crate, and his eyes peek out.
- **Script:**
  - SQUATCH (whisper bubble): "I came in a crate like this." (tap)
- **FB1:**
  - [CARD] "Years ago, on Stormtop..." (tap)
  - Frame: a delivery crate stamped MOON PIES on the dock. "A delivery crate of Moon Pies came to Stormtop." (tap)
  - Frame: Mops lifts the lid. Inside, a sleeping baby Sasquatch covered in crumbs.
    - Caption: "Mops opened it. Inside: a sleeping baby Sasquatch, covered in crumbs." (tap)
  - Frame: the baby grabs Mops's beard and giggles.
    - Caption: "The baby woke up, grabbed Mops's beard, and giggled." (tap)
    - MOPS: "...Baaa?" (tap)
  - Frame: two tourists come around the corner, and Mops pops the baby into his mop bucket.
    - Caption: "Tourists coming! Mops hid him in the mop bucket." (tap)
    - MOPS: "Nothing to see here!" (tap)
  - [CARD] "Now" (tap)
- **SECRET, a Moon Pie from the ×500 crate** (Action while inside, after FB1):
  - SQUATCH: "Five hundred. They won't miss one." (tap)
  - It counts as one of the 3 trip snacks in S12.
- **Causes:** the crate origin (his bed is a MOON PIES crate, from O0). This pays off in Ch4's MISSING poster and in the delivery ship being their way out.

### S5 · Big furry folks
- **Spine:** Until one day.
- **Visible:** by the Great Red Spot window, two tourists, GARY and LINDA.
  - Gary holds a coffee mug. Linda holds a colourful brochure with a drawn pancake stack on the front.
  - Their cones face the window. A plant behind them, outside the cones, pulses (HIDE).
  - A small trash bin sits beside the plant.
- **Script:** [chip] "Tourists are talking. Hide in the plant and listen"
- **Player:** Action at the plant.
- **Script:**
  - GARY (ear): "Did you hear? Big furry folks run a pancake stand on Mars!" (tap)
  - LINDA (ear): "Big furry folks? Like... a whole family?" (tap)
  - SQUATCH (whisper bubble): "Big. Furry. Folks. Like ME?" (tap)
  - Gary waves his arms to show "BIG". His coffee sloshes onto Linda's brochure, which is drawn with a brown splash.
    - LINDA (ear): "Gary! It's soaked!" (tap)
  - Linda tosses the brochure into the trash bin by the plant. They walk off to the window.
- **Then:** the brochure sticks out of the bin, pulsing. ACTION reads GRAB.
- **[PANEL] The brochure** (drawn, no captions):
  - The heading "MARS PANCAKES!";
  - big furry Sasquatches flipping pancakes and smiling;
  - "Big. Furry. Friendly.";
  - a red planet with a little pancake flag on it;
  - the bottom corner, where an address would be, covered by a brown coffee blot (drawn). (tap)
- **Script:**
  - SQUATCH: "A family like me." (tap)
  - SQUATCH: "On MARS." (tap)
- **Causes:** the asks. The blot hides the address, which is why they'll need help finding the stand later (Ch3). No Zip or Phobos here.

### S6 · Three asks
- **Spine:** Because of that.
- **Visible:** Mops mopping. After each "no", he mops away to a new spot, leaving a wet trail; the player follows past tourists, hiding.
- **Ask 1** (Mops near the 47 photos):
  - SQUATCH: "Mops! Big furry folks on Mars! A family like ME! Let's go!" (tap)
  - MOPS: "Floors don't mop themselves, kiddo." (tap)
  - Mops mops away. [chip] "Follow Mops"
- **Ask 2:**
  - SQUATCH: "Robots could mop! You could come!" (tap)
  - Mops points his mop at the wall of 47 photos.
    - MOPS: "This station needs me." (tap)
  - Mops mops away. [chip] "Follow Mops"
- **Ask 3:**
  - SQUATCH: "I'm tired of hiding!" (tap)
  - MOPS: "Remember last night?" (tap)
  - MOPS: "Out there, everyone sees a Wookie." (tap)
  - SQUATCH: "YOU don't hide. You're a GOAT. Nobody screams at you!" (tap)
  - MOPS: "..." (tap)
  - Mops lowers his head and mops away slowly. This is animated, not written.
  - SQUATCH (whisper bubble): "...I didn't mean it." (tap)
  - Breather: 2.5s.
  - Squatch looks at a searchlight bot mopping by. The bot pulses.
    - SQUATCH: "Floors don't mop themselves..." (tap)
    - SQUATCH: "...but those BOTS do!" (tap)
  - [chip] "Use the manager's terminal". The terminal by the snack counter pulses.
- **SNEAKY!** for following Mops through all three asks without being seen.
- **FUNNY FIND, the Great Wookie Clog plaque** (on the route; Wookies are known since O7):
  - PLAQUE: "THE GREAT WOOKIE CLOG. NEVER FORGET."
  - SQUATCH: "It's a framed hairball. The size of a beanbag."
- **FUNNY FIND, a WANTED poster:** a drawn Wookie with a big "?" and "REWARD: 1 FREE AIR FILTER".
  - SQUATCH: "That's not even a good drawing." (tap)
- **Causes:** the order.

### S7 · The order
- **Spine:** Because of that.
- **Player:** Action at the terminal.
- **[PANEL] The terminal screen** (drawn):
  - "BLEEP-BLOOP BOTS"
  - "Floors that mop THEMSELVES!"
  - "Replace remaining janitors:"
  - "[X] GANITOR: MOPS"
  - A big ORDER button.
  - "Sign here:" with an empty box.
- **Player:** Action again. A big brown paw print stamps into the box. "EXPRESS DELIVERY" flashes. (tap)
- **Script:**
  - SQUATCH (whisper bubble): "...Sorry, Mops." (tap)
- **Breather:** 2.5s.

### S8 · Delivery 2 (live cutscene)
- **Spine:** Because of that.
- **Visible:** the same ship docks. Mops, Squatch (behind a plant) and the ship's hull sign "NEXT STOP: MARS" are all on screen.
- **Script:**
  - STATION PA: "DING DONG! Express delivery!" (tap)
  - STATION PA: "Remaining janitors... REPLACED." (tap)
  - STATION PA: "Including: GANITOR MOPS." (tap)
  - MOPS: "Me? I've been... replaced?" (tap)
  - MOPS: "47 Employee of the Months..." (tap)
  - Squatch steps out and points at the hull sign, which pulses.
    - SQUATCH: "Then come to Mars with me! Look: NEXT STOP, MARS!" (tap)
  - MOPS: "...Together. Okay." (tap)
  - MOPS: "The hangar code was on that slip I ripped." (tap)
  - MOPS: "Half's in the trash. Half's in the vent." (tap)
  - The camera flicks to the trash can, then the vent, each pulsing.
  - STATION PA: "NEW BOTS ONLINE. FORMER GANITOR: SHOO." (tap)
  - MOPS: "Great. Now they'll shoo me too." (tap)
- **Causes:** all bots on (they hunt Mops too); the escape plan.

### S9 · The trash half (first singing puzzle)
- **Visible:** in Storage, a bot parked next to the trash can, its light on it. A box nearby pulses (HIDE).
- **Script:**
  - MOPS: "I'll wait by the trash." (tap)
  - MOPS: "You hide in that box and SING." (tap)
  - MOPS: "When the bot comes to look, tap my face and grab the slip!" (tap)
- **Player:**
  - Hide (Action at the box). This box is a LURE SPOT: it shows a music-note marker, and while you're hidden inside it, ACTION reads SING. Tap to start, tap again to stop. No opera.
  - The bot turns and rolls toward the song: "Who's singing?"
  - Stop before it arrives, or SPOTTED! sends you back.
  - Tap Mops's face (top right) to switch, walk Mops to the trash, Action (GRAB).
  - [PANEL] the torn half: "3 Bleep-Bloop Bots. DELIVERED. Signed: Mops. Hangar code:" with 2 digits and a ragged edge. (tap)
  - MOPS: "Got it! Thanks for the song, Squatch." (tap)
- **SNEAKY!** for getting the trash half without being SPOTTED or caught.

### S10 · The vent half
- **Visible:** the vent grille pulses. Squatch is too big (he bumps it).
- **Player:** as Mops, squeeze through and grab the other half.
  - [PANEL] the other half, with the last 2 digits. (tap)
  - MOPS: "Got it! Squeezy squeeze." (tap)
- **SECRET, Mops's crumpled practice notes:** in the duct, which runs behind the closet vent (O0). Only Mops can find them.
  - Drawn: three balled-up notes. One is unfolded: "Brave Sasquatches stay hid—", crossed out, in the same handwriting as the Guardians' note.
  - MOPS: "...Nothing to see here!" (tap)
  - The player gets a clue Squatch doesn't. This sets up Ch2 FB3.

### S11 · The hangar door (singing twist: stop in time)
- **Visible:** a bot guards the keypad. A plant nearby pulses (HIDE).
- **Script:**
  - MOPS: "That bot guards the door. I'll wait over here." (tap)
  - MOPS: "Lure it to the plant. STOP singing before it gets there!" (tap)
  - MOPS: "Then I'll type the code." (tap)
- **Player:** hide in the LURE SPOT plant (music-note marker; ACTION reads SING), lure, stop in time, switch, type the code at the keypad.
- **Script:**
  - SQUATCH: "Door open! Uh oh... a fur scanner." (tap)
  - FUR SCANNER, a blue light gate (if Squatch tries it): "FUR DETECTED. NO WOOKIES!"
  - MOPS: "My goat costume! In the closet wardrobe." (tap)
  - The wardrobe pulses (WEAR).
    - SQUATCH: "Baaa? BAAA!" (tap)
    - MOPS: "More bleat. Less roar." (tap)
  - FUR SCANNER: "HAIR... PROBABLY. PROCEED."
- **SNEAKY!** for opening the door without being SPOTTED or caught.

### S12 · Snacks and go
- **Visible:** three snack coolers pulse.
- **Script:**
  - MOPS: "Long trip. Get your favourites." (tap)
  - [chip] "Grab 3 snacks"
- **Player:** grab 3 and board the ship (Action at the ship).
- **SECRET, the extra coolers:** Astro-Nachos and Freeze-Dried Ice Cream, the latter hidden behind the Storage crates.
  - SQUATCH: "My favourite!" (tap)
  - "Get your favourites" gives the reason.
- **Ch1 totals:**
  - 6 secrets (+300): stash, smiling photo, crate Moon Pie, practice notes, nachos, ice cream.
  - 4 funny finds (+100): height marks, crib, plaque, WANTED poster.
  - 4 SNEAKY! sections (+400): lunch, follow Mops, trash, door.
  - Ghost bonus +250.
  - Max ★ 1050.
- **End of Ch1:** the tally card.
- **Script:**
  - Shown first: the ship's dashboard, with a drawn fuel gauge needle just above E.
  - MOPS: "Fuel gauge says... just enough to reach the gas stop." (tap)
  - SQUATCH: "Mars, here we come!" (tap)
- **Causes:** Ch2's gas stop.

**Optional funny (only if it survives the checks):**
- The Great Wookie Clog plaque, a framed hairball:
  - PLAQUE: "THE GREAT WOOKIE CLOG. NEVER FORGET."
  - SQUATCH: "It's a framed hairball. The size of a beanbag."
- Height marks:
  - SQUATCH: "Height marks! SQUATCH age 1, 2, 3... 9. And MOPS: always the same."
  - MOPS: "Goats peak early."
- The mop-bucket crib:
  - SQUATCH: "My baby bed! A mop bucket. Still smells like lemons."

---
## CHAPTER 2 · GAS STOP (outline; to be scripted next)
- **G1** (Because of that): Gloop's Gas & Grub. They have no coins.
  - Rustbucket guards the pump. Overheard while hidden:
    - RUSTBUCKET: "Nobody touches my pump!"
    - and "I'd do anything for Gloop's chili."
- **G2:** as Mops, order the chili.
  - MOPS: "One chili, please."
  - GLOOP: "30 coins, sweetie."
  - Mops takes the dish job, and Squatch washes in the back, unseen.
  - Tickets include Blorp's "1 pea, since 1997". Blorp weeps with joy.
  - GLOOP: "That goat washes FAST."
- **G3:** the diner TV shows "WOOKIE SPOTTED IN SPACE!" Squatch hides in a crate.
- **G4** (FB3), as Mops:
  - [CARD] "Years ago, on Stormtop..."
  - Baby Squatch crying in the mop bucket. Mops writes on his notepaper: "Brave Sasquatches stay hidden. — The Guardians".
  - [CARD] "Now".
  - Mops spends the tip-jar coins on soup and sneaks it ALONE past the arguing bots to the crate.
  - SQUATCH: "THE GUARDIANS FOUND ME IN SPACE!" The player knows; Squatch doesn't.
- **G5:** the tip jar is now short of the chili price, so more dishes.
- **G6:** Mops serves the chili and Rustbucket naps.
  - Two arguing pump bots still guard the pump. One song lures both.
  - Mops drags the hose to the ship and siphons the gas.
  - No crystal.

## CHAPTER 3 · PHOBOS (outline)
- **P1:** the ship's route board shows NEXT STOP: PHOBOS (moon of Mars). There, a stand sign reads "ZIP'S PRETZELS — Mars deliveries daily!" (drawn).
  - MOPS: "Pretzels to Mars every day. That raccoon knows the way."
  - The blotted brochure address (Ch1 S5) is why they need him.
- **P2:** Mops talks to Zip while Squatch hides in a pretzel barrel.
  - Squatch whispers the riddle answer ("the old temple").
  - ZIP: "Did that barrel just talk?"
  - MOPS: "...Baaa."
  - The star map in the temple marks the stand. The door opens only to sunlight: mirrors plus rovers on guard. That's the echo singing puzzle.
- **P3:**
  - ZIP (to Mops): "Sasquatches on Mars? Sure, they buy all my pretzels."
  - Squatch pops up, lit up.
  - MOPS: "Will you still sing our song there?"
  - SQUATCH: "Maybe. They'll have their own songs."
  - Next lure prompt, MOPS: "Go on. Sing it. ...It's still our song. For now."
- **P4:** hurt, Mops wanders off and floats away in low gravity. Squatch rescues him.
  - SQUATCH: "I'll always come get you."

## CHAPTER 4 · MARS (outline)
- **M1:** bots sweep searchlights at the spaceport.
  - Out of habit, Squatch builds the trash-can disguise.
  - The searchlight singing puzzle gets them through the gate.
- **M2:** the pancake stand.
  - Mops reads the faded poster: "MISSING: baby HARRY, lost in a Moon Pie shipment."
  - MOM: "Harry? ...Harry! It's you!" Welcome Hug (mash Action).
  - MOPS tries to come in. Someone: "You'll get hair in the pancakes."
  - SQUATCH, laughing with them: "Go wait in the ship, Mops. Just for a bit."
- **M3:** as Mops, alone in the delivery ship.
  - He cleans out of habit (mop, empty the bin).
  - Under the seat: the ORIGINAL ROBOT ORDER: "Replace remaining janitors: [X] GANITOR: MOPS. Ordered by: [paw print]".
  - Paw close-up. MOPS: "...That's his paw."
  - He walks off. The switch greys out: "Mops is gone."
- **M4:** inside, a searchlight sweeps and Squatch ducks.
  - FAMILY: "Sasquatches never hide!"
  - SQUATCH: "But Rule #1... you sent the guardians, right?"
  - MOM: "Sweetie, we didn't know where you were."
  - SQUATCH: "...Then who were the guardians?"
  - He grabs the Guardian Box and draws a bearded goat into MY GARDIANS.
- **M5:** he runs after Mops ("I'll always come get you") and steps into the open. Every searchlight lands on him, and Action sings.
  - MOPS: "You replaced me, Squatch."
  - SQUATCH: "I ordered the robots. I'm sorry. I just couldn't go without you."
  - He hands over the box. SQUATCH: "You were my family the whole time."
  - MOM: "Any goat who raised our son is family."
  - SQUATCH: "Harry to my family. Squatch to my goat."
  - Dance party, with Mops going "Baaa!" on the beat.
- **Ever since:** no more secrets. He sings in the open.
- **Final score screen** (waits for a tap):
  - [CARD] "THE END"
  - The total ★, 1–3 stars, and "Best ★" for this device.
  - Then the chapter select.
