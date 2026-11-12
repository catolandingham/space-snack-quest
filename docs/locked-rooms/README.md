# Locked rooms

These pictures and the scripts that draw them are Brian-approved. They are the source of truth for the room layouts.

The game paints each one, scaled to the 960×640 picture, as the room background. Characters and things that move are drawn on top. Do not redraw a room freehand, and do not change these files, without Brian's yes and a new locked version.

| File | Room |
| --- | --- |
| `hall-room-empty-v1.png` | Party hall. Window, stage, snack bar, FUR alarm, plants, floor vent. No Employee of the Month wall and no manager's office. |
| `hallway-room-empty-v6.png` | Hallway between the party hall and the loading bay. Photo wall on the back, locked office door on the front. |
| `office-room-empty-v2.png` | Manager's office interior (R84). The hallway door is on this room's back wall. Squatch enters through that door. The desk and the signs are part of the picture. |
| `home-room-empty-closed-v3.png` | Home, wardrobe closed. |
| `home-room-empty-open-v4.png` | Home, wardrobe open. |
| `delivery-room-empty-day-v2.png` | Loading bay, day, ship docked. Ramp and fur-scanner are in this picture. |
| `delivery-room-empty-day-noship-v2.png` | Loading bay, day, no ship, so no scanner arch. |
| `delivery-room-empty-night-v2.png` | Loading bay at night. |
| `delivery-room-empty-pickup-v3.png` | Loading bay on pickup day. |

The `.py` files are the scripts that drew the pictures (`mockups/rooms/`).
