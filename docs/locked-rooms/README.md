# Locked rooms

These pictures and the scripts that draw them are Brian-approved. They are the source of truth for the room layouts.

The game paints each one, scaled to the 960×640 picture, as the room background. Characters and things that move are drawn on top. An adult's head in that room is 85% of that room's main door on the canvas. The party hall is the one exception: there everyone is 40% bigger, so an adult is 119% of the hall's doorway (Brian 2026-11-24: "40% is what I meant!!"). Squatch is 80% of that adult. Do not redraw a room freehand, and do not change these files, without Brian's yes and a new locked version.

| File | Room |
| --- | --- |
| `hall-room-empty-v2.png` | Party hall. Window, stage, snack bar, FUR alarm, plants, floor vent. No Employee of the Month wall and no manager's office. v2 (Brian, 2026-11-23, picked "C" from `docs/picture-candidates/`, after "A is more correct but you can keep the bar long and just move it south on the screen"): the hallway doorway sits in the back corner of the right wall, the snack bar keeps its full length and starts just below that doorway, and the painted yellow outline round the bar is gone. Made by editing a copy of v1 (the script needs sprite files not in this repo); v1 stays in this folder as history. |
| `hallway-room-empty-v6.png` | Hallway between the party hall and the loading bay. Photo wall on the back, locked office door on the front. |
| `office-room-empty-v2.png` | Manager's office interior (R84). The hallway door is on this room's back wall. Squatch enters through that door. The desk and the signs are part of the picture. |
| `home-room-empty-closed-v6.png` | Home, wardrobe closed. v4: the calendar is a real calendar with the Moon Pie delivery day circled (Brian, Nov 2026). v5: no Guardian Box on the floor; it is kept in the closet until Day 2 (Brian, 2026-11-16: "put the guardian crate in the closet and they can get it out later"). v6 (Brian, 2026-11-23, "Yes, lock it"): the wall speaker, the retro wooden one he picked ("4: retro wooden speaker", Squatchbot #448), at his spot "A, near the door" (Squatchbot #1385), high on the wall above the STAY IN HERE poster. Cut from the hall picture, without the hall's painted sound lines: the game draws sound lines and music notes only while it plays. v5 stays in this folder as history. |
| `home-room-empty-open-v6.png` | Home, wardrobe open. v5: no Guardian Box on the floor. v6: the wall speaker (same change as closed v6). |
| `delivery-room-empty-day-v2.png` | Loading bay, day, ship docked. Ramp and fur-scanner are in this picture. |
| `delivery-room-empty-day-noship-v2.png` | Loading bay, day, no ship, so no scanner arch. |
| `delivery-room-empty-night-v2.png` | Loading bay at night. |
| `delivery-room-empty-pickup-v3.png` | Loading bay on pickup day. |

Layers the game draws over these pictures (the files themselves unchanged), each with Brian's yes:
- Mops's mop bucket over the home room's painted bucket (`src/modules/mop-bucket.js`; Brian 2026-11-26, "Let's go with it moving forward").
- On Day 2 the home wardrobe drawn about 85 game pixels taller, open and shut, from pieces of these two home pictures (`src/modules/tall-closet.js`; Brian 2026-11-26, video note 0:20: "We should make the closet taller... the clothes should be over the box").

The crate bed in both home pictures still has its old MOON PIES badge. Since 2026-11-26 (Brian, question 86: the snack is Stars Cakes) the game draws a layer over it, never editing the file: the badge painted out in the crate's own wood and the family crate's worn stamp ("_ARS CAKES", his crayon "ST") on top (`src/modules/crate-stamp.js`). The layer needs Brian's yes; until then it is a proposal, listed in `docs/DECISIONS.md`.

The party hall picture `hall-room-empty-v2.png` has a snack tin on the bar with the old name on its lid. Since 2026-11-26 the game draws a new lid over it (blue, a little yellow star, "Stars Cakes"; `crate-stamp.js` drawTinLid), never editing the file. It needs Brian's yes too.

The `.py` files are the scripts that drew the pictures (`mockups/rooms/`).
