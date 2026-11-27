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
| `delivery-room-empty-day-v3.png` | Loading bay, day, ship docked. Ramp and fur-scanner are in this picture. v3 (pickup v4), Brian 2026-11-26 (story pass, "The bay plant moves a few steps along the wall, in a new locked version of the bay picture", his yes to question 75): the plant by the doorway is moved a few steps along the back wall, to the right of the bin, so nobody walks into it coming in. Made by editing a copy of the previous version (the plant cut out and set down 226 picture pixels to the right, the wall and floor behind it filled from the same rows); nothing else changed. The previous versions stay in this folder as history. |
| `delivery-room-empty-day-noship-v3.png` | Loading bay, day, no ship, so no scanner arch. v3: the plant moved, as the day picture. |
| `delivery-room-empty-night-v3.png` | Loading bay at night. v3: the plant moved, as the day picture. |
| `delivery-room-empty-pickup-v4.png` | Loading bay on pickup day. v4: the plant moved, as the day picture. |

Layers the game draws over these pictures (the files themselves unchanged), each with Brian's yes:
- Mops's mop bucket over the home room's painted bucket (`src/modules/mop-bucket.js`; Brian 2026-11-26, "Let's go with it moving forward").
- On Day 2 the home wardrobe drawn about 85 game pixels taller, open and shut, from pieces of these two home pictures (`src/modules/tall-closet.js`; Brian 2026-11-26, video note 0:20: "We should make the closet taller... the clothes should be over the box").

The `.py` files are the scripts that drew the pictures (`mockups/rooms/`).
