# Cut-in spec (reusable close-up)
For Brian and the coder · Tuesday, November 10, 2026 · DECISIONS **R80** (Brian t308u)

Brian's word for the original Sneaky Sasquatch's close-ups is a **cut-in**. This page is the one recipe every Space Snack Quest cut-in uses, so they all look and feel the same. It was written from Brian's reference video `reference/original-food-closeups.mp4` (58 seconds: the stove, the cooler and eating).

## What the original game does (from the video)
1. **Hand icon when close.** Near something you can use, a hand icon shows on it. Tapping it starts the cut-in.
2. **Fast, smooth zoom in, about 0.5 s.** The camera pushes into a close-up of the object. No hard cut, no loading card.
3. **The world stays behind it.** The room is still there, blurred, with a dark vignette at the screen edges. You still feel where you are.
4. **A long furry arm reaches in from the screen edge.** Its paw follows your finger exactly, with no lag and no offset.
5. **Things snap when dropped.** Food dropped on the stove centers itself on a burner and shows steam lines. Nothing is left floating or half-placed.
6. **Bag drop zone.** In the cooler, the small backpack icon in the bottom-left grows into a big open bag while you drag. Drop the item on it and the item vanishes into the bag.
7. **Exit X.** A round white X button in the bottom-right. Tapping it zooms back out in under 0.5 s.
8. **Eating cut-in.** A front-facing close-up of Sasquatch behind a table. Drag food to his mouth and he chews, with little crumb particles. A round hunger meter (fork-and-knife icon) is top-right.

## The Space Snack Quest cut-in (the recipe)
| Part | Rule |
| --- | --- |
| Start | A paw icon (our version of the hand) shows on the object when Squatch's feet are inside its action spot. The icon uses the same spot as the ring and button (`spot` in `00-core.js`), so what you see is what triggers. Tapping the icon or the action button opens the cut-in. |
| Zoom in | 0.5 s ease-in-out push toward the object. Player control is off during the zoom. |
| Background | The live room, blurred (about 6 px), darkened about 35%, with a dark vignette at the edges. People in the room keep moving in the blur when the beat needs it (the bartender at the bar). Everything else that could catch him (octopus, balloon, guards' cones) waits while a cut-in is open, so only the threat the cut-in is about is live. |
| Arm and paw | Squatch's long furry arm comes in from the nearest screen edge (bottom by default). The paw sits exactly under the finger (or mouse). When the finger lifts, the arm eases back to rest. Pointer, mouse and touch all work. |
| Items | Each item has a pick-up box at least 64 px on iPad. Picked-up items ride in the paw. |
| Drop targets | A drop target lights up while an item is over it. Dropped on a target, the item snaps (eases into place in 0.15 s). Dropped anywhere else, it slides back to where it came from. Nothing ever floats. |
| Bag | Bottom-left: a small bag icon. While dragging, it grows into a big open bag (about 3x). Dropping in it makes the item shrink and vanish into the bag with a soft sound, and a count ticks up. The bag is Squatch's carry pouch (this replaces the "pouch" idea in beat 14). |
| Exit | Bottom-right: a round white X, at least 64 px. Zooms back out in under 0.5 s and gives control back where he stood. A cut-in can also close by itself when the story needs it (a catch, a spill). |
| Words | No words in a cut-in unless the beat lists them. Any line said in a cut-in uses the normal bubble over the speaker, even if the speaker is in the blur. |
| Sizes | Full screen on iPad landscape and portrait; the close-up object is centered and fills at least half the screen height. |
| Tests | One test opens and closes a cut-in from every place that has one, checks the zoom times, that the X is bottom-right, that a dropped item either snaps or returns, and that the room's threats wait (except the beat's own). |

### Eating cut-in (variant)
Front-facing close-up of the eater behind a table, the same blur and vignette behind. Drag food to the mouth: it snaps there, the eater chews (about 1 s) with crumb particles, then the next item can go. **No hunger meter.** The game has no hunger rule, and adding one is a new rule that needs Brian's yes. If he wants one later, it sits top-right like the original.

## Where cut-ins are used
| Beat | Cut-in | State |
| --- | --- | --- |
| 14 Party bar snacks | Snack pyramid; bag bottom-left; X bottom-right; bartender visible in the blur, glances then turns; two catches = FUR alarm; a bottom grab topples the pyramid and the cut-in closes itself to show the chain | **First build.** Beat 14 updated (`UPDATED t308u`) |
| 27 Day 2, one snack behind the counter | Same bar cut-in, with Mops beside him in the blur; the bag takes one snack, then the pyramid locks | Recommended reuse |
| 26 Mops eats lunch, then the bag | Eating cut-in with Mops as the eater (player drags lunch, then the empty bag, to his mouth) | Recommended reuse |
| 24 The forgotten lunch bag | Small cut-in: drag the lunch bag into Squatch's bag | Optional |
| 22 The Guardians gift | Drag the toy rocket and the note into the Guardian Box (the box is the drop target) | Optional |
| 42 The paw order | Drag the yellow copy out of the bin, press the paw on it, drag it into the mailbox slot | Optional |
| 52 Take all the snacks | Bar cut-in with no bartender threat; one drop target is "leave for the Guardians" | Recommended reuse |
| 53 Packing the crate | Drag the Guardian Box into the Moon Pie crate, then the bucket on top | Optional |
| 7 Dress-up | Already its own zoomed-in game on a white background. It can share the zoom, the paw-follows-finger drag, snapping and the X exit; its background stays plain white (R74) | Share the code, keep the look |
| Ch2 dish scrub | The game already shows the dish, Squatch's paw and a sponge. Can move onto the cut-in later | Later, needs Brian's yes |

## Numbers (proposed, for Brian's yes)
Zoom in 0.5 s, zoom out 0.4 s, blur about 6 px, darken about 35%, snap 0.15 s, buttons and items at least 64 px. These are look-and-feel numbers. None of them changes how hard the game is, except that threats wait while a cut-in is open.
