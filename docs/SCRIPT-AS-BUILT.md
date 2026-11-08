# The script as it is built

Every line the game can show, pulled from `src/game/*.js`. This file is not a new script. Nothing here changes the game.

A row is who says it (or Card, Goal, Button's owner, Sign, Banner, Lockup, Help), the words, and the kind: bubble, card, chip, prompt, PA, caption, banner, or lockup. Chapter 1 and Chapter 2 follow the play-through tests, with any scene the code steps through in between. Chapters 3 and 4 follow the order the scenes hand off. The same words are listed once per scene. Buttons list each label they can show, including STOP after SING.

Rebuild with `npm run export-script`.

| Chapter | Lines |
| --- | --- |
| Chapter 1 | 372 |
| Chapter 2 | 222 |
| Chapter 3 | 119 |
| Chapter 4 | 147 |
| Title, help, score, and shared | 74 |

## Before the chapters

### Title screen

| Who | Line | Kind |
| --- | --- | --- |
| Banner | SNEAKY SASQUATCH | banner |
| Banner | SPACE SNACK QUEST | banner |
| Sign | ♪ I'm floating in space! ♪ | caption |
| Sign | Tap a chapter to play | caption |
| Sign | Click a chapter or press 1-4 (ENTER = continue) | caption |
| Sign | CHAPTER 1 | caption |
| Sign | CHAPTER 2 | caption |
| Sign | CHAPTER 3 | caption |
| Sign | CHAPTER 4 | caption |
| Sign | LOCKED | caption |
| Sign | PLAY | caption |
| Title | Stormtop Station | caption |
| Title | Asteroid Belt Gas Stop | caption |
| Title | Phobos, the Tiny Moon | caption |
| Title | Mars! | caption |

### Controls

| Who | Line | Kind |
| --- | --- | --- |
| Help | Arrows or WASD: walk. E: do the action in the white label. Space or Enter: next line. Hold R: restart this section. Esc: skip a flashback. M: sound. | caption |
| Help | Stick: walk. Big button: do it. Tap the picture: next line. Hold ↺ to restart. | caption |

### Score, in every chapter

| Who | Line | Kind |
| --- | --- | --- |
| Banner | Never caught! +250 | banner |
| Banner | Squatch got through this whole chapter without being caught. | caption |
| Goal | Get through without a catch for +250 | chip |
| Banner | +50 SECRET! | banner |
| Banner | +25 FUNNY FIND! | banner |
| Banner | ★ = points for finds | caption |

## Chapter 1 · Stormtop

### O0

| Who | Line | Kind |
| --- | --- | --- |
| Card | Stormtop Cloud Resort, floating above Jupiter. | card |

### O1

| Who | Line | Kind |
| --- | --- | --- |
| Card | This is Squatch. He's a Sasquatch. | card |
| Goal | Squatch: walk around the room | chip |

### O2a

| Who | Line | Kind |
| --- | --- | --- |
| Mops | ♪ Hmm-hmm-hmmm... ♪ | bubble |
| You | SING · song | prompt |
| Squatch | ♪ I'm floating in space! ♪ | bubble |
| Mops | ♪ Baaa-aa-aaa! ♪ | bubble |
| Mops | That's our song. | bubble |
| Goal | Squatch: sing along with Mops | chip |

### O2b

| Who | Line | Kind |
| --- | --- | --- |
| Mops | Big inspection tonight. Stay put, buddy. | bubble |
| Mops | Night, Squatch. | bubble |

### O3

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | PEEK · door | prompt |
| Squatch | ...Everybody has somebody. | bubble |
| Sign | WELCOME, BLEEP-BLOOP | caption |
| Sign | ROBOTICS DELEGATION! | caption |
| Goal | Squatch: peek out the door | chip |

### O3b

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | Sorry, sign. | bubble |
| Squatch | SNEAK OUT · door | prompt |
| Goal | Squatch: sneak out the door | chip |

### O4

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | HIDE! · closet | prompt |
| Squatch | READ · notice | prompt |
| Squatch | ENTER · closet | prompt |
| Squatch | Robot janitors? Mops is a janitor. | bubble |
| Sign | NOTICE | caption |
| Banner | ROBOT JANITORS | banner |
| Banner | COMING. | banner |
| Banner | They take every janitor's job. | banner |
| Goal | Squatch: run back to the closet! | chip |
| Goal | Squatch: find out what's going on out there | chip |
| Goal | Squatch: read the notice | chip |
| Goal | Squatch: sneak back to the closet | chip |

### O5

| Who | Line | Kind |
| --- | --- | --- |
| Security | Inspection! Closet next. | bubble |
| Squatch | Hide! | bubble |
| Squatch | HIDE · under the bed | prompt |
| Security | Security. Anyone in here? | bubble |
| Mops | Just me, mopping! | bubble |
| Security | ...Janitor. Carry on. | bubble |
| Security | Gotcha! | bubble |
| Security | Huh? | bubble |
| Goal | Squatch: hide under the bed | chip |

### O6

| Who | Line | Kind |
| --- | --- | --- |
| Mops | You went OUT? Tonight? | bubble |
| Squatch | Everybody out there has somebody. | bubble |
| Mops | You have me. | bubble |
| Squatch | But look. Robot janitors are coming. | bubble |
| Mops | A notice can't mop a floor. | bubble |
| Mops | We stay hidden. That's how we stay safe. | bubble |
| Mops | Back to work. Stay put. | bubble |

### O7

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | WATCH · TV | prompt |
| Card | Years ago, on Stormtop... | card |
| Flashback | A Wookie tour group came to visit Stormtop. | caption |
| Flashback | They shed. A LOT. | caption |
| Flashback | The fur clogged the air scrubbers. Everyone gasped for air! | caption |
| Flashback | *gasp* | caption |
| Station Official | Nobody can live outside. The scrubbers keep us breathing. NO FUR. | bubble |
| Card | Now | card |
| Goal | Squatch: watch the TV | chip |

### O8

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | The Guardians came! | bubble |
| Squatch | OPEN · Guardian Box | prompt |
| Squatch | SLEEP · bed | prompt |
| You | GRAB · gift | prompt |
| Squatch | A toy rocket! From the Guardians! | bubble |
| Sign | Brave Sasquatches | banner |
| Sign | stay hidden. | banner |
| Sign | — The Guardians | banner |
| Goal | Squatch: go to sleep in your bed | chip |
| Goal | Squatch: grab the gift | chip |

### O9

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | One more for the box. Someday I'll meet them. | bubble |
| Sign | — The Guardians | caption |
| Sign | by Squatch age 6 | caption |
| Goal | Squatch: put the note and the rock in the box | chip |

### S1

| Who | Line | Kind |
| --- | --- | --- |
| Mops | Off to work, buddy. Stay put! | bubble |
| Squatch | He forgot his lunch! | bubble |
| Squatch | GRAB · lunch | prompt |
| Squatch | OPEN · tin | prompt |
| Squatch | Mops's emergency Moon Pies! | bubble |
| Squatch | PULL · bucket | prompt |
| Squatch | My baby bed! A mop bucket. Still smells like lemons. | bubble |
| Squatch | LOOK · notice | prompt |
| Squatch | Moon Pie day! | bubble |
| Squatch | SNEAK OUT · door | prompt |
| Sign | MOON PIES | caption |
| Sign | DELIVERIES | banner |
| Sign | MOON PIES ×500 | banner |
| Sign | EVERY WEEK | caption |
| Sign | TODAY | caption |
| Goal | Squatch: bring Mops his lunch | chip |
| Banner | Unseen on the deck! +100 | banner |

### S1L

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | LEAVE · hiding spot | prompt |
| Squatch | HIDE · plant | prompt |
| Squatch | HIDE · box | prompt |

### S2

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | LOOK · photos | prompt |
| Squatch | FIX · photo | prompt |
| Squatch | Photo 23. I hid this here when I was 5. | bubble |
| Squatch | FLIP · badge | prompt |
| Squatch | On TV, the Wookiees got kicked out for fur. You're furry too! | bubble |
| Squatch | Why can YOUR hair be here? | bubble |
| Mops | Goat hair. Hypo-Alien-Genic. | bubble |
| Squatch | What's the difference between fur and hair? | bubble |
| Mops | Paperwork. | bubble |
| Squatch | What's a GANITOR? | bubble |
| Mops | Goat janitor. First and only. They had to invent a word. | bubble |
| Squatch | GIVE · lunch | prompt |
| Mops | My lunch! You're the best. | bubble |
| Mops | Goats peak early. | bubble |
| Station PA | DING DONG! Delivery for Stormtop! | PA |
| Station PA | Bleep-Bloop Bots! Floors that mop THEMSELVES! | PA |
| Squatch | Robot janitors. Like the notice said. | bubble |
| Station PA | Janitors Dot, Bob and Lou... REPLACED. | PA |
| Mops | Pfft. They'd never replace me. | bubble |
| Mops | 47 Employee of the Month photos. | bubble |
| Mops | ...Paperwork. | bubble |
| Mops | Hey! My slip! | bubble |
| Station PA | Back soon with your NEXT order! | PA |
| Station PA | Janitorial issue! First robot order: APPROVED. | PA |
| Squatch | ...That was MY fur. | bubble |
| Station PA | Delegation report: FUR in the air scrubbers. | PA |
| Station PA | Delegation report: FUR spotted in the lobby. | PA |
| Station PA | Delegation report: all clear. Robots arrive at dawn. | PA |
| Banner | SIR MOPS-A-LOT | banner |
| Sign | HEAD GANITOR | caption |
| Sign | (GANITORS ON STAFF: 1) | caption |
| Banner | GOAT HAIR: | banner |
| Sign | certified | caption |
| Sign | Hypo-Alien-Genic™ | caption |
| Goal | Squatch: give Mops his lunch | chip |

### S3

_No lines landed in this scene._

### S4

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | LEAVE · crate | prompt |
| Squatch | GRAB · Moon Pie | prompt |
| Squatch | Five hundred. They won't miss one. | bubble |
| Squatch | HIDE · crate | prompt |
| Squatch | I came in a crate like this. | bubble |
| Card | Years ago, on Stormtop... | card |
| Flashback | A delivery crate of Moon Pies came to Stormtop. | caption |
| Flashback | Mops opened it. Inside: a sleeping baby Sasquatch, covered in crumbs. | caption |
| Flashback | The baby woke up, grabbed Mops's beard, and giggled. | caption |
| Mops | ...Baaa? | bubble |
| Flashback | Tourists coming! Mops hid him in the mop bucket. | caption |
| Mops | Nothing to see here! | bubble |
| Card | Now | card |
| Goal | Squatch: hide from the bot in the crate | chip |
| Goal | Squatch: stay hidden in the crate | chip |

### S5

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | GRAB · brochure | prompt |
| Squatch | HIDE · plant | prompt |
| Squatch | LOOK · brochure | prompt |
| Squatch | A brochure! But they'd see me. Hide first. | bubble |
| Gary | Did you hear? Big furry folks run a pancake stand on Mars! | bubble |
| Linda | Big furry folks? Like... a whole family? | bubble |
| Squatch | Big. Furry. Folks. Like ME? | bubble |
| Linda | Gary! It's soaked! | bubble |
| Squatch | A family like me. | bubble |
| Squatch | On MARS. | bubble |
| Banner | Big. Furry. Friendly. | banner |
| Goal | Squatch: listen to the visitors | chip |
| Goal | Squatch: grab the brochure | chip |

### S6

| Who | Line | Kind |
| --- | --- | --- |
| Station PA | WOOO-WOOO! SECURITY! | PA |
| Squatch | LEAVE · hiding spot | prompt |
| Squatch | PULL · plaque | prompt |
| Squatch | "The Great Wookie Clog. Never forget." | bubble |
| Squatch | It's a framed hairball. The size of a beanbag. | bubble |
| Squatch | UNROLL · poster | prompt |
| Squatch | That's not even a good drawing. | bubble |
| Squatch | HIDE · plant | prompt |
| Squatch | LOOK · plaque | prompt |
| Squatch | Still a framed hairball. | bubble |
| Squatch | LOOK · poster | prompt |
| Squatch | REWARD: 1 free air filter. Rude. | bubble |
| Squatch | PEEK · trash can | prompt |
| Squatch | Mops's torn slip. Just paperwork. | bubble |
| Squatch | PEEK · vent | prompt |
| Squatch | The other half's down the vent. Way too small for me. | bubble |
| Tourist | ...Must've been a mop. | bubble |
| Station PA | SECURITY TO THE HALL! | PA |
| Goal | Squatch: follow Mops | chip |
| Banner | Unseen in the hall! +100 | banner |
| Squatch | LOOK · photos | prompt |

### S7

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | Mops! Big furry folks on Mars! A family like ME! Let's go! | bubble |
| Mops | Floors don't mop themselves, kiddo. | bubble |
| Squatch | Robots could mop! You could come! | bubble |
| Mops | This station needs me. | bubble |
| Squatch | I'm tired of hiding! | bubble |
| Mops | Remember last night? | bubble |
| Mops | Out there, everyone sees a Wookie. | bubble |
| Squatch | YOU don't hide. You're a GOAT. Nobody screams at you! | bubble |
| Mops | ... | bubble |
| Squatch | ...I didn't mean it. | bubble |
| Squatch | Floors don't mop themselves... | bubble |
| Squatch | ...but those BOTS do! | bubble |
| Squatch | LEAVE · hiding spot | prompt |
| Squatch | USE · computer | prompt |
| Squatch | ...Sorry, Mops. | bubble |
| Squatch | Receipt goes in my Guardian Box. Where secrets go. | bubble |
| Sign | Floors that mop THEMSELVES! | caption |
| Sign | Replace remaining janitors: | caption |
| Sign | [X] GANITOR: MOPS | caption |
| Sign | ORDER | banner |
| Sign | Sign here: | caption |
| Sign | paw print | caption |
| Sign | EXPRESS DELIVERY | banner |
| Sign | BLEEP·BLOOP | caption |
| Goal | Squatch: use the manager's computer | chip |
| Squatch | LOOK · plaque | prompt |
| Squatch | Still a framed hairball. | bubble |
| Squatch | LOOK · poster | prompt |
| Squatch | REWARD: 1 free air filter. Rude. | bubble |
| Squatch | PEEK · trash can | prompt |
| Squatch | Mops's torn slip. Just paperwork. | bubble |
| Squatch | PEEK · vent | prompt |
| Squatch | The other half's down the vent. Way too small for me. | bubble |

### S8

| Who | Line | Kind |
| --- | --- | --- |
| Station PA | DING DONG! Express delivery! | PA |
| Station PA | Remaining janitors... REPLACED. | PA |
| Station PA | Including: GANITOR MOPS. | PA |
| Mops | Me? I've been... replaced? | bubble |
| Mops | 47 Employee of the Months... | bubble |
| Squatch | Then come to Mars with me! Look: NEXT STOP, MARS! | bubble |
| Mops | ...Together. Okay. | bubble |
| Mops | The hangar code was on that slip I ripped. | bubble |
| Mops | Half's in the trash. Half's in the vent. | bubble |
| Station PA | NEW BOTS ONLINE. FORMER GANITOR: SHOO. | PA |
| Mops | Great. Now they'll shoo me too. | bubble |
| Mops | I'll wait by the trash. | bubble |
| Mops | You hide in that box and SING. | bubble |
| Mops | When the bot comes to look, tap my face and grab the slip! | bubble |

### S9

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | STOP · singing | prompt |
| Squatch | SING · song | prompt |
| Squatch | HIDE · box | prompt |
| Squatch | HIDE · plant | prompt |
| Mops | GRAB · slip | prompt |
| Mops | Got it! Thanks for the song, Squatch. | bubble |
| Squatch | PULL · airlock | prompt |
| Mops | I'm fine! Best break EVER. | bubble |
| Sign | DELIVERY SLIP | caption |
| Sign | 3 Bleep-Bloop Bots. | caption |
| Sign | DELIVERED. | caption |
| Sign | Signed: Mops | caption |
| Sign | Hangar code: | caption |
| Sign | 4 7 | banner |
| Sign | 2 3 | banner |
| Sign | (the rest of the code) | caption |
| Goal | Squatch: get ready to sing to the bot | chip |
| Goal | Squatch: sing to bring the bot over | chip |
| Goal | Squatch: tap Mops' picture | chip |
| Goal | Mops: grab the slip from the trash | chip |
| Banner | Unseen by the bot! +100 | banner |

### S10

| Who | Line | Kind |
| --- | --- | --- |
| Card | You are SQUATCH now. | card |
| Card | Mops has one half. Squatch goes for the other half. | card |
| Mops | SQUEEZE · vent | prompt |
| Goal | Squatch: squeeze into the vent | chip |
| Goal | Squatch: let Mops try the vent | chip |
| Goal | Mops: squeeze into the vent | chip |

### S10d

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | SQUEEZE · vent | prompt |
| Squatch | Too big! Mops, you try. | bubble |
| Mops | UNFOLD · note | prompt |
| Mops | ...Nothing to see here! | bubble |
| Mops | GRAB · slip | prompt |
| Mops | Got it! Squeezy squeeze. | bubble |
| Mops | EXIT · duct | prompt |
| Mops | That bot guards the door. I'll wait over here. | bubble |
| Mops | Lure it to the plant. STOP singing before it gets there! | bubble |
| Mops | Then I'll type the code. | bubble |
| Sign | DELIVERY SLIP | caption |
| Sign | 3 Bleep-Bloop Bots. | caption |
| Sign | DELIVERED. | caption |
| Sign | Signed: Mops | caption |
| Sign | Hangar code: | caption |
| Sign | 4 7 | banner |
| Sign | 2 3 | banner |
| Sign | (the rest of the code) | caption |
| Sign | Brave Sasquatches | banner |
| Sign | stay hid— | banner |
| Goal | Mops: grab the other half of the slip | chip |
| Goal | Mops: crawl back out | chip |

### S11

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | WEAR · goat costume | prompt |
| Squatch | Baaa? BAAA! | bubble |
| Mops | More bleat. Less roar. | bubble |
| Mops | TYPE · code | prompt |
| Mops | Bot's still on the door. Lure it to the plant! | bubble |
| Squatch | Door open! Uh oh... a fur scanner. | bubble |
| Sign | 4 7 2 3 | banner |
| Sign | OPEN | banner |
| Goal | Squatch: get the bot away from the door | chip |
| Goal | Mops: type the code at the door | chip |
| Goal | Squatch: put on the goat costume | chip |
| Goal | Squatch: walk through the gate | chip |
| Goal | Squatch: hide behind the plant | chip |
| Goal | Squatch: sing to call the bot over | chip |
| Banner | Unseen by the bot! +100 | banner |
| Squatch | STOP · singing | prompt |
| Squatch | SING · song | prompt |
| Squatch | HIDE · box | prompt |
| Squatch | HIDE · plant | prompt |

### S12

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | GRAB · space juice | prompt |
| Squatch | GRAB · comet crisps | prompt |
| Squatch | GRAB · rocket pops | prompt |
| Mops | Long trip. Get your favourites. | bubble |
| Squatch | PULL · tarp | prompt |
| Squatch | GRAB · nachos | prompt |
| Squatch | Astro-Nachos! My favourite! | bubble |
| Squatch | PUSH · crates | prompt |
| Squatch | GRAB · ice cream | prompt |
| Squatch | Freeze-Dried Ice Cream! My favourite! | bubble |
| Squatch | BOARD · ship | prompt |
| Mops | Fuel gauge says... just enough to reach the gas stop. | bubble |
| Squatch | Mars, here we come! | bubble |
| Sign | FUEL | caption |
| Goal | Squatch: grab 3 snacks | chip |
| Goal | Squatch: get on the ship | chip |

### If he is caught

**lobbyvent**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | LOCKUP | lockup |
| Lockup | Fur went into the vent. Alarm. | lockup |
| Lockup | Holding pen. This part starts over. | lockup |

**lobbykid**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | A kid saw Squatch in the lobby. Security caught him. | lockup |

**lobbyexec**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | A man in a suit saw Squatch in the lobby. Security caught him. | lockup |

**lobbyclerk**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | The snack clerk saw Squatch in the lobby. Security caught him. | lockup |

**deck**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | A tourist saw Squatch on the deck. Security caught him. | lockup |

**vent**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | The vent alarm saw Squatch on the deck. Security caught him. | lockup |

**s6**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | A tourist saw Squatch in the hall. Security caught him. | lockup |

**hallbot**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | A bot saw Squatch in the hall. Security caught him. | lockup |

**hallvent**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | The vent alarm saw Squatch in the hall. Security caught him. | lockup |

**lure9**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | The bot saw Squatch in the box. Security caught him. | lockup |

**lure11**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | The bot saw Squatch behind the plant. Security caught him. | lockup |

### Signs and other lines

| Who | Line | Kind |
| --- | --- | --- |
| Kid | DADDY! A BIG DOG! | bubble |
| Exec | Was that... FUR? | bubble |
| Snack Clerk | Fur! Near my snacks! | bubble |
| Squatch | Gulp. | bubble |
| Station PA | FUR IN THE VENT! | PA |
| Sign | SNACKS | caption |
| Sign | NOTICE | caption |
| Station PA | WOOO-WOOO! SECURITY! | PA |
| Squatch | Everyone's looking! | bubble |
| Squatch | Back to the closet! | bubble |
| Sign | ALARM | caption |
| Tourist | WOOKIE! | bubble |
| Sign | CLOSET | caption |
| Sign | MANAGER'S OFFICE | caption |
| Sign | STORAGE | caption |
| Sign | EMPLOYEE OF THE MONTH | caption |
| Sign | ACHOO! | caption |
| Squatch | SIGN · order | prompt |
| Squatch | ...Sorry, Mops. | bubble |
| Squatch | Receipt goes in my Guardian Box. Where secrets go. | bubble |
| Security | Who's singing? | bubble |
| Security | SPOTTED! | bubble |
| Sign | AIRLOCK | caption |
| Banner | FWOOMP! | banner |
| Sign | *reel reel reel* | caption |
| Security | Former Ganitor! SHOO! | bubble |
| Fur Scanner | HAIR... PROBABLY. PROCEED. | bubble |
| Fur Scanner | FUR DETECTED. NO WOOKIES! | bubble |
| Mops | My goat costume! In the Storage wardrobe. | bubble |
| Sign | NOTICES | caption |
| Sign | NEVER FORGET | caption |
| Sign | WANTED | caption |
| Sign | REWARD: 1 FREE | caption |
| Sign | AIR FILTER | caption |
| Sign | MANAGER | caption |
| Sign | ORDER | caption |
| Sign | NEXT STOP: MARS | caption |
| Sign | Floors that mop THEMSELVES! | caption |
| Sign | Replace remaining janitors: | caption |
| Sign | [X] GANITOR: MOPS | caption |
| Sign | ORDER | banner |
| Sign | Sign here: | caption |
| Sign | paw print | caption |
| Sign | EXPRESS DELIVERY | banner |
| Banner | Chapter 1 · Stormtop | banner |
| Banner | MARS PANCAKES! | banner |
| Sign | BLEEP·BLOOP | caption |
| Sign | DOCK | caption |
| Banner | hee hee! | banner |
| Sign | DELIVERY SLIP | caption |
| Sign | HANGAR | caption |
| Sign | DO NOT PULL | caption |
| Sign | FOR THE MANAGER · EXTRA MOON PIES | caption |
| Goal | Squatch: sign the order | chip |

## Chapter 2 · Gas stop

### G0

| Who | Line | Kind |
| --- | --- | --- |
| Card | Chapter 2 · Gas Stop | card |
| Mops | Gas stop. Fuel light's blinking. | bubble |
| Mops | Locals still fear Sasquatches. Troopers are the greater danger. Neither is safe. | bubble |
| Squatch | Not the scrubbers? ...Ooh, chili. | bubble |
| Mops | Hide by the pump first. Stay out of sight. | bubble |

### G1

| Who | Line | Kind |
| --- | --- | --- |
| Mops | ENTER · diner door | prompt |
| Squatch | HIDE · crate | prompt |
| Gloop | Rusty! Customers want gas! | bubble |
| Rusty | Nobody touches my pump! Not without coins. | bubble |
| Squatch | We don't have coins... | bubble |
| Mops | Then we earn some. Leave it to me. | bubble |
| Card | You are MOPS now. | card |
| Card | Mops goes to the diner. Squatch stays hidden by the pump. | card |
| Room | Mops goes inside. | caption |
| Goal | Squatch: hide behind the crate by the pump | chip |
| Goal | Mops: walk to the diner door and go in | chip |
| Banner | Hidden by the pump! +100 | banner |
| Banner | TANK EMPTY | banner |

### G2

| Who | Line | Kind |
| --- | --- | --- |
| Mops | ASK · for work | prompt |
| Mops | Got any work? We need gas money. | bubble |
| Gloop | Dishwasher quit. Sink's in the back. Tips go in the jar. | bubble |
| Mops | Squatch... the kitchen has a back door. | bubble |
| Goal | Mops: ask Gloop for work at the counter | chip |
| Goal | Mops: walk up to Gloop at the counter | chip |

### G2b

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | ENTER · kitchen door | prompt |
| Card | You are SQUATCH now. | card |
| Card | Mops found work. Squatch sneaks in the back. | card |
| Room | Squatch sneaks into the kitchen. | caption |
| Goal | Squatch: sneak in the KITCHEN door | chip |

### G2k

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | ROLL · into a ball | prompt |
| Squatch | OPEN · recipe | prompt |
| Squatch | Secret ingredient: sasquatch hair?! ...Gross. But I'll keep it secret. | bubble |
| Squatch | GRAB · dish | prompt |
| Squatch | SCRUB · dish | prompt |
| Squatch | Dishes! I'm GREAT at dishes. | bubble |
| Blorp | *sniff* ...It's SPOTLESS! | bubble |
| Gloop | That goat washes FAST. | bubble |
| Squatch | She thinks the goat did it. | bubble |
| Squatch | This pot is GLUED with grease! | bubble |
| Squatch | Paws won't do it. Mops! Bring the mop! | bubble |
| Mops | Stand back, kiddo. | bubble |
| Card | You are MOPS now. | card |
| Card | This pot needs a mop. Mops goes to get it. | card |
| Sign | GLOOP'S CHILI | banner |
| Goal | Squatch: wash the dishes at the sink | chip |
| Goal | Mops: tap Squatch's picture (top right) to switch back | chip |
| Goal | Squatch: grab a dish from the rack by the window | chip |
| Goal | Squatch: scrub the dish at the sink | chip |

### G3

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | HIDE · crate | prompt |
| Gloop | Ooh, my show! | bubble |
| Diner TV | WOOKIE SPOTTED IN SPACE! Last seen near Stormtop. | PA |
| Gloop | That broadcast. Pump bots! Check the back! | bubble |
| Security | You watch the crate. | bubble |
| Pump Bot | No, YOU watch the crate. | bubble |
| Squatch | They're looking for ME. | bubble |
| Goal | Squatch: hide in the crate before the bots look! | chip |
| Goal | Squatch: stay out of sight | chip |
| Goal | Squatch: stay in the crate until the bots leave | chip |
| Banner | Hidden in time! +100 | banner |

### G4

| Who | Line | Kind |
| --- | --- | --- |
| Pump Bot | Hmph! | bubble |
| Security | Hmph! | bubble |
| Security | You watch the crate. | bubble |
| Pump Bot | No, YOU watch the crate. | bubble |
| Mops | GRAB · tip jar | prompt |
| Mops | ASK · Gloop | prompt |
| Gloop | The jar has… coins. Soup is 30. The tank is 30. | bubble |
| Mops | Soup instead of gas. Squatch is hungry. | bubble |
| Mops | BUY · soup 30 | prompt |
| Mops | One soup, to go. | bubble |
| Gloop | 30 coins. Soup's on, sweetie. | bubble |
| Mops | Soup instead of gas. He's hungry. | bubble |
| Mops | Balanced on my head. Don't bump me. | bubble |
| Mops | ENTER · kitchen | prompt |
| Mops | LEAVE SOUP · crate | prompt |
| Card | You are MOPS now. | card |
| Card | Squatch stays hidden in the crate. Mops goes out front. | card |
| Mops | I'm hungry. Let's ask Gloop what the jar covers. | bubble |
| Room | Mops brings the soup into the kitchen. | caption |
| Squatch | Soup! And a note... | bubble |
| Squatch | THE GUARDIANS FOUND ME IN SPACE! | bubble |
| Squatch | A hoof stamp. Mops signed it. | bubble |
| Mops | ...Eat up, kiddo. | bubble |
| Gloop | Bots! Go watch the dock. | bubble |
| Sign | the note | caption |
| Sign | You're not alone | banner |
| Sign | out here. | banner |
| Sign | — The Guardians | banner |
| Goal | Mops: take the tip jar | chip |
| Goal | Mops: buy soup at the counter | chip |
| Goal | Mops: take the soup through the kitchen door | chip |
| Goal | Mops: carry the soup to Squatch's crate | chip |
| Goal | Mops: go back through the kitchen door | chip |
| Goal | Mops: walk to the tip jar on the counter | chip |
| Goal | Mops: walk to the crate while the bots look away | chip |
| Banner | Soup delivered unseen! +100 | banner |

### G5k

| Who | Line | Kind |
| --- | --- | --- |
| Card | You are SQUATCH now. | card |
| Card | Squatch washes the next dishes. | card |
| Mops | Hungry. I'll cook the tickets, then ask Gloop what the jar covers. | bubble |
| Gloop | The janitor is on those tickets. | bubble |
| Goal | Squatch: wash the next dishes | chip |
| Goal | Mops: mop the greasy pot at the sink | chip |

### G6

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | HIDE · crate | prompt |
| Squatch | BOARD · ship | prompt |
| Squatch | STOP · singing | prompt |
| Squatch | SING · lure song | prompt |
| Mops | GIVE · coins | prompt |
| Mops | EXIT · the lot | prompt |
| Card | You are MOPS now. | card |
| Card | The dishes are done. Mops goes out front. | card |
| Mops | New jar. Thirty coins. Tank time. | bubble |
| Room | Mops goes out to the pump. | caption |
| Rusty | Coins? Pump's yours. | bubble |
| Mops | Full tank. | bubble |
| Mops | Bots on the ramp. Squatch, sing from the crate! | bubble |
| Card | You are SQUATCH now. | card |
| Card | The tank is full. Squatch has to lure the bots away. | card |
| Squatch | Next stop: Phobos! | bubble |
| Mops | The board says Phobos. Then Mars. | bubble |
| Goal | Mops: grab the new tip jar | chip |
| Goal | Mops: take the coins out the EXIT door | chip |
| Goal | Mops: give the coins to Rusty at the pump | chip |
| Goal | Squatch: lure the bots away from the ship | chip |
| Goal | Squatch: stop singing before they reach you | chip |
| Goal | Squatch: run to the ship and get on board | chip |
| Goal | Squatch: hide in the crate by the ship | chip |
| Goal | Squatch: sing to call the bots over | chip |
| Banner | Lured the bots away! +100 | banner |
| Banner | TANK FULL | banner |

### If someone sees him

These lines play only when that person sees Squatch. They are not part of the ordinary walk through the chapter.

| Who | Line | Kind |
| --- | --- | --- |
| Blorp | EEK! A Squatch near my soup! | bubble |
| Gloop | A Squatch?! Back from the counter! | bubble |

### If he is caught

**pump**

| Who | Line | Kind |
| --- | --- | --- |
| Security | Report him or fuel him? | bubble |
| Squatch | Pancakes. Park the nozzle. | bubble |

**diner**

| Who | Line | Kind |
| --- | --- | --- |
| Gloop | Counter's closed. Lockup's open. | bubble |
| Squatch | I'll take it to go. | bubble |

**sink**

| Who | Line | Kind |
| --- | --- | --- |
| Gloop | The window caught the sink. | bubble |
| Squatch | Next time I roll. | bubble |

**rust**

| Who | Line | Kind |
| --- | --- | --- |
| Rusty | Parked you. Still no coins. | bubble |
| Squatch | I'll take the pen over the pump. | bubble |

**lure**

| Who | Line | Kind |
| --- | --- | --- |
| Pump Bot | WOOKIE?! | bubble |
| Mops | Just a fuzzy mop! Over here! Very fuzzy. | bubble |
| Security | ...Back to the pump. | bubble |

**bots3**

| Who | Line | Kind |
| --- | --- | --- |
| Security | WOOKIE?! | bubble |
| Gloop | That's the dish goat, you rust buckets! | bubble |
| Pump Bot | ...Re-scanning. | bubble |

**pump**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | LOCKUP | lockup |
| Lockup | A pump bot saw Squatch on the lot. Security caught him. | lockup |
| Lockup | Holding pen. This part starts over. | lockup |

**diner**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | Gloop saw Squatch at the counter. Security caught him. | lockup |

**blorp**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | Blorp saw Squatch in the diner. Security caught him. | lockup |

**sink**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | Gloop saw Squatch at the sink. Security caught him. | lockup |

**rust**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | Rusty saw Squatch by the pump. Security caught him. | lockup |

**lure**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | A pump bot saw Squatch in the crate. Security caught him. | lockup |

**bots3**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | A pump bot saw Squatch in the kitchen. Security caught him. | lockup |

### Signs and other lines

| Who | Line | Kind |
| --- | --- | --- |
| Rusty | SECURITY! A Squatch on the lot! | bubble |
| Squatch | Troopers. I can hide. | bubble |
| Pump Bot | No goats with food past here! Shoo! | bubble |
| Security | No goats with food past here! Shoo! | bubble |
| Mops | Just passing through. | bubble |
| Security | SQUATCH ON THE LOT! Report him or fuel him! | bubble |
| Pump Bot | Fill 'er up! HOLD STILL! | bubble |
| Squatch | I run on PANCAKES! (Back out the door!) | bubble |
| Squatch | *RUMBLE* She heard my stomach. | bubble |
| Cook | AAAAH! | bubble |
| Cook | Out the door! | bubble |
| Gloop | The janitor is cooking and washing? | bubble |
| Gloop | What is that by the sink?! | bubble |
| Cook | A WOOKIE! | bubble |
| Cook | *faints* | bubble |
| Mops | I'll cook. You keep washing. | bubble |
| Gloop | Order up? | bubble |
| Mops | LIFT · lid | prompt |
| Blorp | Don't rush me. | bubble |
| Mops | FLIP · picture | prompt |
| Mops | Employee of the Month: the mop. Every month. | bubble |
| Mops | FLIP · postcard | prompt |
| Mops | Furry pancakes... on Mars. Hm. | bubble |
| Mops | BACK · kitchen | prompt |
| Room | Mops goes back to the kitchen. | caption |
| Mops | COOK · ticket | prompt |
| Mops | Cooking ticket…. | bubble |
| Mops | FRONT · diner | prompt |
| Room | Mops goes out front. | caption |
| Mops | MOP · pot | prompt |
| Mops | Twenty years of floors. Pots are easy. | bubble |
| Squatch | Shiny! | bubble |
| Sign | PUMP | caption |
| Sign | GLOOP'S GAS & GRUB | caption |
| Sign | OPEN | caption |
| Sign | KITCHEN | caption |
| Sign | FUEL | caption |
| Sign | GAS | caption |
| Sign | COINS ONLY | caption |
| Sign | SEC | caption |
| Banner | GLOOP'S | banner |
| Sign | EMPLOYEE | caption |
| Sign | OF THE MONTH | caption |
| Sign | NEWS | caption |
| Sign | EXIT | caption |
| Sign | Greetings | caption |
| Sign | from MARS! | caption |
| Sign | MARS | caption |
| Sign | TIPS | caption |
| Sign | MOP | caption |
| Sign | DINER | caption |
| Sign | ORDERS | caption |
| Sign | NEXT | caption |
| Sign | GRAB | caption |
| Sign | COOK | caption |
| Sign | RUMBLE | caption |
| Sign | GREASY | caption |
| Sign | GLOOP | caption |
| Sign | LEAVE SOUP | caption |
| Sign | out cold | caption |
| Sign | AAAAH! | caption |
| Banner | ORDER #… | banner |
| Banner | WASH IT! | banner |
| Sign | Greetings from MARS! | banner |
| Sign | Big furry pancakes! | banner |
| Sign | Wish you were here — B. | caption |
| Banner | FUEL | banner |
| Banner | FULL | banner |
| Banner | CHAPTER 2 · GAS STOP | banner |

## Chapter 3 · Phobos

### P0

| Who | Line | Kind |
| --- | --- | --- |
| Card | Chapter 3 · Phobos | card |
| Squatch | Phobos! Mars is RIGHT next door! | bubble |
| Mops | Folks here still jump at a Squatch. Searchlights and gate bots lock you up. Keep your head down. | bubble |
| Squatch | Which way to the pancake stand? | bubble |
| Mops | The address is under the coffee. | bubble |
| Mops | We need someone who knows the way. | bubble |
| Mops | Pretzels to Mars every day. That raccoon knows the way. | bubble |
| Mops | Hide in a barrel. I'll do the talking. | bubble |
| Sign | ROUTE BOARD | caption |
| Sign | NEXT STOP: | banner |
| Sign | PHOBOS | banner |
| Sign | (moon of Mars) | banner |
| Banner | Big. Furry. Friendly. | banner |

### P1

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | HIDE · barrel | prompt |
| Zip | Hot pretzels! Mars deliveries daily! | bubble |
| Goal | Squatch: hide in a barrel | chip |
| Banner | Hidden in the barrel! +100 | banner |

### P2

| Who | Line | Kind |
| --- | --- | --- |
| Mops | LIFT · mug | prompt |
| Mops | "World's Okayest Raccoon." Honest. | bubble |
| Mops | FLIP · delivery log | prompt |
| Mops | ...Pancake stand. Every Tuesday. | bubble |
| Mops | ASK · Zip | prompt |
| Mops | Could you take us to the pancake stand on Mars? | bubble |
| Zip | Sure, if you help me first. My star map's locked in the old temple. | bubble |
| Zip | Door only opens for sunlight. Rovers guard the mirrors. | bubble |
| Squatch | Mops! Sing to the rovers. Like at the gas stop! | bubble |
| Zip | ...Did that barrel just talk? | bubble |
| Mops | ...Baaa. | bubble |
| Zip | Huh. Talking barrels. Phobos, man. | bubble |
| Sign | ZIP'S DELIVERIES | banner |
| Goal | Mops: ask Zip for a ride to Mars | chip |

### P3

| Who | Line | Kind |
| --- | --- | --- |
| You | WIPE · sign | prompt |
| Mops | "Singing welcome." Huh. | bubble |
| Squatch | SINGING WELCOME?! | bubble |
| Squatch | HIDE · echo spot | prompt |
| Mops | TURN · mirror | prompt |
| Mops | LOOK · mural | prompt |
| Mops | ...Huh. Look at that. | bubble |
| Mops | EXIT · temple | prompt |
| Mops | You sing, I turn. Echo spot's over there. | bubble |
| Mops | Squatch, stay hid. Someone's coming. | bubble |
| Zip | My map! You two are something. | bubble |
| Zip | Sasquatches on Mars? Sure, they buy all my pretzels. | bubble |
| Squatch | A whole family. Like ME. Singing out loud! | bubble |
| Mops | Will you still sing our song there? | bubble |
| Squatch | Maybe. They'll have their own songs. | bubble |
| Mops | ... | bubble |
| Zip | Ship leaves at sunset. Rovers, load up! | bubble |
| Sign | PHOBOS | caption |
| Sign | MARS | caption |
| Goal | Squatch: hide in the echo spot | chip |
| Goal | Squatch: sing the rovers away from the mirrors | chip |
| Goal | Squatch: let Mops turn the mirrors | chip |
| Goal | Mops: turn the first mirror | chip |
| Goal | Mops: turn the second mirror | chip |
| Goal | Mops: go out the temple door | chip |
| Banner | Safe through the temple! +100 | banner |

### P4

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | HIDE · barrel | prompt |
| Squatch | BOARD · ship | prompt |
| Squatch | GRAB · rope | prompt |
| Squatch | THROW · rope | prompt |
| Mops | Rover's on the ramp. Go on. Sing it. | bubble |
| Mops | ...It's still our song. For now. | bubble |
| Mops | I'll... get some air. | bubble |
| Mops | Whoa. Low gravity. | bubble |
| Squatch | MOPS?! | bubble |
| Zip | Rovers, cargo hold! | bubble |
| Squatch | I'll always come get you. | bubble |
| Mops | ...I know, kiddo. | bubble |
| Goal | Squatch: get the rover off the ramp | chip |
| Goal | Squatch: run to the ship | chip |
| Goal | Squatch: get on board | chip |
| Goal | Squatch: grab the rope from the cart | chip |
| Goal | Squatch: throw the rope to Mops | chip |
| Goal | Squatch: hide in the barrel | chip |
| Goal | Squatch: sing to call the rover over | chip |
| Banner | Got past the rover! +100 | banner |

### If someone sees him

These lines play only when that person sees Squatch. They are not part of the ordinary walk through the chapter.

| Who | Line | Kind |
| --- | --- | --- |
| Zip | Whoa! A Squatch! ...Pretzel? | bubble |

### If he is caught

**rover1**

| Who | Line | Kind |
| --- | --- | --- |
| Rover | A rug with legs? Rugs get ROLLED UP! | bubble |
| Squatch | Mmmf! (Rolled all the way back!) | bubble |
| Rover | ...Resuming patrol. | bubble |

**rover-s**

| Who | Line | Kind |
| --- | --- | --- |
| Rover | WOOKIE?! | bubble |
| Mops | Just a fuzzy mop! Very fuzzy. | bubble |
| Rover | ...Back to the mirrors. | bubble |

**lure3**

| Who | Line | Kind |
| --- | --- | --- |
| Mops | Just a fuzzy mop! In a barrel. Very fuzzy. | bubble |
| Rover | ...Back to the ramp. | bubble |

**rover4**

| Who | Line | Kind |
| --- | --- | --- |
| Rover | Loose rug! ROLL IT UP! | bubble |
| Mops | That's pretzel packing! Back in the barrel, uh, pretzels. | bubble |

**rover1**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | LOCKUP | lockup |
| Lockup | A rover saw Squatch on the pad. Security caught him. | lockup |
| Lockup | Holding pen. This part starts over. | lockup |

**rover-s**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | A rover saw Squatch in the temple. Security caught him. | lockup |

**lure3**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | The rover saw Squatch in the barrel. Security caught him. | lockup |

**rover4**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | The rover saw Squatch by the ramp. Security caught him. | lockup |

### Signs and other lines

| Who | Line | Kind |
| --- | --- | --- |
| Sign | STORMTOP · NIGHT | caption |
| Sign | MOP | caption |
| Banner | WAAAH! | banner |
| Sign | Brave Sasquatches | caption |
| Sign | stay hidden. | caption |
| Sign | — The Guardians | caption |
| Squatch | They're... WALTZING?! | bubble |
| Mops | One-two-three, one-two-three. | bubble |
| Rover | HANDS OFF THE MIRRORS, GOAT. | bubble |
| Mops | Just... dusting. | bubble |
| Rover | Back. Out. | bubble |
| Squatch | STOP · singing | prompt |
| Squatch | SING · song | prompt |
| Sign | ROVER | caption |
| Sign | PRETZELS | caption |
| Sign | EDGE | caption |
| Banner | ZIP'S PRETZELS | banner |
| Sign | Mars deliveries daily! | caption |
| Sign | OK | caption |
| Sign | ZIP | caption |
| Sign | SINGING | caption |
| Sign | NO SINGING | caption |
| Sign | WELCOME | caption |
| Sign | (dusty) | caption |
| Banner | CHAPTER 3 · PHOBOS | banner |

## Chapter 4 · Mars

### M0

| Who | Line | Kind |
| --- | --- | --- |
| Card | Chapter 4 · Mars | card |
| Zip | Mars dock! Pancake stand's past the gate. Tuesdays. Three dozen. | bubble |
| Mops | Home doesn't mean safe. Locals are scared of a Squatch. Troopers and searchlights lock you up. | bubble |
| Mops | I'll walk on ahead. Nobody looks twice at a goat. | bubble |
| Squatch | Trash cans. I'll use them on purpose. | bubble |

### M1

| Who | Line | Kind |
| --- | --- | --- |
| Someone | FUR DETECTED! | bubble |
| Security | SECURITY! | bubble |
| Squatch | HIDE · trash can | prompt |
| Squatch | LIFT · sock | prompt |
| Squatch | One sock. Size... ENORMOUS. Not mine. Probably. | bubble |
| Goal | Squatch: sneak to the gate | chip |
| Goal | Squatch: run to the gate | chip |
| Goal | Squatch: hide in the middle trash can | chip |
| Goal | Squatch: sing to call the bot over | chip |
| Banner | Safe to the gate! +100 | banner |

### M2

| Who | Line | Kind |
| --- | --- | --- |
| Mops | READ · poster | prompt |
| Mops | ...Lost in a Moon Pie shipment. | bubble |
| Mops | Your crib was a Moon Pie crate. | bubble |
| Squatch | ...That's ME? | bubble |
| Mops | FLIP · menu | prompt |
| Mops | Every year. Just in case. | bubble |
| Mops | KNOCK · door | prompt |
| Squatch | HUG! · Mom and Dad | prompt |
| Mops | Stay behind the crate, kiddo. Let me look first. | bubble |
| Mom | Can I help you, goat? | bubble |
| Mops | I think I found something of yours. | bubble |
| Mops | Come on out, kiddo. | bubble |
| Mom | Harry? ...HARRY! It's you! | bubble |
| Dad | Come in, come in! Pancakes! | bubble |
| Dad | Oh, um... goats wait outside, I think? Health rules. Sorry, fella! | bubble |
| Squatch | Go wait in the van, Mops. Just for a bit. | bubble |
| Mops | ...Sure, kiddo. | bubble |
| Sign | MISSING | banner |
| Sign | our baby HARRY | banner |
| Sign | Lost in a | banner |
| Sign | MOON PIE shipment | banner |
| Sign | Please bring him home. | caption |
| Sign | — Big Furry Pancakes, Crater Row | caption |
| Sign | HARRY'S BIRTHDAY STACK | banner |
| Sign | every year, just in case | banner |
| Goal | Mops: read the poster on the stand | chip |
| Goal | Mops: knock on the door | chip |
| Goal | Squatch: hug Mom and Dad | chip |

### M3

| Who | Line | Kind |
| --- | --- | --- |
| Mops | MOP · floor | prompt |
| Mops | Old habits. | bubble |
| Mops | FLIP · air freshener | prompt |
| Mops | "Pine-ish." Smells like raccoon. | bubble |
| Mops | LOOK · under the seat | prompt |
| Mops | His Guardian Box. Something fell out. | bubble |
| Mops | ...That's his paw. | bubble |
| Mops | He ordered them. To replace me. | bubble |
| Sign | BLEEP-BLOOP BOTS | banner |
| Sign | ORDER RECEIPT | caption |
| Sign | Replace remaining janitors: | banner |
| Sign | [X] GANITOR: MOPS | banner |
| Sign | (all 1 of them) | caption |
| Sign | EXPRESS DELIVERY | caption |
| Sign | Ordered by: | caption |
| Goal | Mops: mop the van floor | chip |
| Goal | Mops: look under the seat | chip |

### M4

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | ROLL · ball | prompt |
| Squatch | LOOK · photo | prompt |
| Squatch | They saved me a spot. | bubble |
| Squatch | EXIT · door | prompt |
| Mom | Eat up, Harry! Three dozen pretzels, and pancakes forever. | bubble |
| Dad | Sweetie? Sasquatches never hide! | bubble |
| Squatch | But Rule #1... The Guardians said stay hidden. | bubble |
| Squatch | You sent them, right? | bubble |
| Mom | Sweetie, we didn't know where you were. | bubble |
| Squatch | ...Then who were the Guardians? | bubble |
| Sign | (saved for) | caption |
| Sign | HARRY | banner |
| Goal | Squatch: hide from the searchlight | chip |
| Goal | Squatch: go out to the van | chip |

### M4v

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | GRAB · Guardian Box | prompt |
| Squatch | Mops? ...Mops? | bubble |
| Squatch | He found it. | bubble |
| Squatch | Big, furry... and a goat. | bubble |
| Squatch | Mops. | bubble |
| Sign | BLEEP-BLOOP BOTS | banner |
| Sign | ORDER RECEIPT | caption |
| Sign | Replace remaining janitors: | banner |
| Sign | [X] GANITOR: MOPS | banner |
| Sign | (all 1 of them) | caption |
| Sign | EXPRESS DELIVERY | caption |
| Sign | Ordered by: | caption |
| Goal | Squatch: look under the seat | chip |

### M5

| Who | Line | Kind |
| --- | --- | --- |
| Port Bot | WOOKIE?! | bubble |
| Squatch | Sasquatch. Big and furry. | bubble |
| Port Bot | ...Do you need help? | bubble |
| Squatch | Nope. Just getting my goat. | bubble |
| Squatch | DANCE · with Mops | prompt |
| Squatch | No more hiding. | bubble |
| Squatch | MOPS! I'll always come get you. | bubble |
| Mops | You ordered robots, kiddo. | bubble |
| Squatch | I'm sorry. I was scared to go without you. | bubble |
| Squatch | So I made you stay behind. | bubble |
| Squatch | You were my Guardian the whole time. | bubble |
| Mops | ...Brave Sasquatches don't hide. I was wrong about that. | bubble |
| Dad | Forget the rules. Any goat who raised our son eats pancakes with us. | bubble |
| Squatch | Harry to my family. Squatch to my goat. | bubble |
| Squatch | ♪ I'm floating in space... ♪ | bubble |
| Mops | ♪ Baaa! ♪ | bubble |
| Squatch | ♪ ...but I'm not alone. ♪ | bubble |
| Mops | ♪ Baaa-aa! ♪ | bubble |
| Squatch | ♪ Wherever you mop... ♪ | bubble |
| Squatch | ♪ ...is my home. ♪ | bubble |
| Card | Ever since: no more hiding. Squatch sings out loud, Mops mops the pancake stand (badly), and the menu says, in crayon: GOATS EAT FREE. | card |
| Card | THE END | card |
| Sign | CHAPTER 4 · MARS | banner |
| Sign | FINAL SCORE | banner |
| Sign | Ghost-level sneaky! | banner |
| Sign | Very sneaky! | banner |
| Sign | Sneaky enough! | banner |
| Sign | Best on this device: ★… | caption |
| Goal | Squatch: go get Mops | chip |
| Goal | Squatch: dance with Mops | chip |

### If someone sees him

These lines play only when that person sees Squatch. They are not part of the ordinary walk through the chapter.

| Who | Line | Kind |
| --- | --- | --- |
| Mom | Is that... a very hairy goat? | bubble |
| Dad | Shoo, shaggy! Health rules! | bubble |

### If he is caught

**light4**

| Who | Line | Kind |
| --- | --- | --- |
| Port Bot | WOOKIE?! IN THE LIGHT! | bubble |
| Squatch | (Searchlight. Back to the van.) | bubble |
| Port Bot | ...Must be a big dog. Resuming sweep. | bubble |

**gate4**

| Who | Line | Kind |
| --- | --- | --- |
| Port Bot | Say CHEESE! *FLASH* Proof of a Wookiee! | bubble |
| Squatch | (They saw me. Van, then the barrels.) | bubble |
| Port Bot | ...Photo is blurry. Back to my gate. | bubble |

**light4**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | LOCKUP | lockup |
| Lockup | The searchlight found Squatch on the dock. Security caught him. | lockup |
| Lockup | Holding pen. This part starts over. | lockup |

**gate4**

| Who | Line | Kind |
| --- | --- | --- |
| Lockup | The gate bot saw Squatch on the dock. Security caught him. | lockup |

### Signs and other lines

| Who | Line | Kind |
| --- | --- | --- |
| Squatch | STOP · singing | prompt |
| Squatch | SING · song | prompt |
| Sign | PORT | caption |
| Banner | ZIP | banner |
| Sign | GATE | caption |
| Sign | → CRATER ROW | caption |
| Sign | LOST+FOUND | caption |
| Sign | BIG FURRY PANCAKES | caption |
| Sign | MISSING | caption |
| Sign | HARRY | caption |
| Sign | HARRY'S | caption |
| Sign | MENU | caption |
| Sign | BDAY STACK | caption |
| Sign | Stack · 3 | caption |
| Sign | PINE-ISH | caption |
| Station PA | WOOO-WOOO! SECURITY! | PA |
| Security | FUR DETECTED! VACUUM MODE! *SHHLURP* | bubble |
| Squatch | Hey! That's MY fur! | bubble |

## Lines not tied to one scene

| Who | Line | Kind |
| --- | --- | --- |
| Banner | Tap the floor to walk there. | banner |
| Banner | They lost you. | banner |
| Sign | SEC | caption |
| Station PA | FUR IN THE VENT! | PA |
| Squatch | Oops. Fur in the vent. | bubble |
| Squatch | Just one peek. Mops won't know. | bubble |
| Sign | ASTRO | caption |
| Sign | NACHOS | caption |
| Sign | FREEZE-DRIED | caption |
| Sign | ICE CREAM | caption |
| Sign | FRAGILE · THIS SIDE UP ↑ | caption |
| Sign | STAY IN | caption |
| Sign | HERE! | caption |
| Sign | — Mops | caption |
| Sign | DELIVERY | caption |
| Sign | MOPS | caption |
| Sign | INSPECTION NIGHT | caption |
| Sign | CLOSET | caption |
| Sign | ALARM | caption |
| Sign | Next stop: Mars! Chapter 4 is coming soon. | caption |
| Sign | Next stop: Phobos! Chapter 3 is coming soon. | caption |
| Sign | Next stop: the gas stop. Chapter 2 is coming soon. | caption |
| Sign | Ch1 continues from… in the next build. | caption |
| Sign | ORDERS | caption |
| Sign | out cold | caption |
| Sign | TOURS | caption |
| Sign | AIR SCRUBBER | caption |
| Sign | YEARS AGO | caption |
| Sign | z z z | caption |
| Banner | z z z | banner |
| Banner | CLEAN DISH | banner |
| Banner | DIRTY DISH | banner |
| Sign | CLEAN | caption |
| Sign | One paw. One sponge. Zero training. | caption |
| Banner | SCRUB…/3 | banner |
| Sign | SKIP ▸▸ | caption |

## What looks odd

Repeated means the same words are in the source more than once for that scene. The table above shows them once. Unread means the words are chosen from a list when they play.

### Repeated in the same scene

- 1:: Station PA: FUR IN THE VENT!
- 1:: Tourist: WOOKIE!
- 1:: Security: Former Ganitor! SHOO!
- 1:: Sign: CLOSET
- 1:: Sign: NEXT STOP: MARS
- 1:: Sign: AIRLOCK
- 1:S1: Squatch: LOOK · notice
- 1:S1: Sign: MOON PIES
- 1:S1: Sign: DELIVERIES
- 1:S1: Sign: MOON PIES ×500
- 1:S1: Sign: EVERY WEEK
- 1:S1: Sign: TODAY
- 1:S5: Squatch: GRAB · brochure
- 1:S7: Sign: Floors that mop THEMSELVES!
- 1:S7: Sign: Replace remaining janitors:
- 1:S7: Sign: [X] GANITOR: MOPS
- 1:S7: Sign: ORDER
- 1:S7: Sign: Sign here:
- 1:S7: Sign: paw print
- 1:S7: Sign: EXPRESS DELIVERY
- 1:S7: Sign: BLEEP·BLOOP
- 1:S11: Goal: Squatch: get the bot away from the door
- 4:M1: Goal: Squatch: sneak to the gate
- 2:: Sign: KITCHEN
- 2:: Sign: LEAVE SOUP
- 2:G4: Goal: Mops: carry the soup to Squatch's crate
- 2:G2k: Gloop: That goat washes FAST.
- 2:G3: Goal: Squatch: hide in the crate before the bots look!
- 2:lockup: Gloop: Counter's closed. Lockup's open.
- 2:lockup: Squatch: I'll take it to go.
- 2:lockup: Lockup: LOCKUP
- 2:lockup: Lockup: Holding pen. This part starts over.
- 3:lockup: Rover: WOOKIE?!
- 3:lockup: Lockup: LOCKUP
- 3:lockup: Lockup: Holding pen. This part starts over.
- 4:lockup: Lockup: LOCKUP
- 4:lockup: Lockup: Holding pen. This part starts over.
- 3:: Sign: Brave Sasquatches
- 3:: Sign: stay hidden.
- 3:: Sign: — The Guardians

### Lines the exporter could not read as fixed words

- 10-ch1.js:1313 v() line is built in code
- 11-ch1-hall.js:1724 a button label was not a fixed line
- 20-ch2.js:1560 kV() line is built in code
- 40-ch4.js:623 v() line is built in code
