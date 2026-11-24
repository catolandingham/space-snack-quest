# The Guardian Box in the open closet, as Brian approved it (2026-11-23)

`closet-gbox-approved-2026-11-23.png` is the picture Brian approved in the Snack Quest Chat on 2026-11-23 ("11a"), after choosing "9a" (the closet keeps the locked `docs/locked-rooms/home-room-empty-open-v6.png` unchanged, and the game draws the small blue G box on the closet floor on top of it). Copied from the private asks folder (`space-snack-quest-private/asks/closet-gbox-approved-2026-11-23.png`).

The picture is the locked open-closet room v6 with the box added. The box: blue rgb(52,120,246), a 3 px dark outline rgb(34,36,44), corner radius 4, a white bold "G"; outline included it spans x 153 to 205 and y 402 to 438 of the 1280 x 830 picture, under the spare shirt.

The game draws the box itself (src/modules/home-alone.js, `GUARDIAN_BOX`) only while Squatch has the closet open on the home-alone morning. `tests/home-alone.mjs` compares what the game draws there with this picture. Do not redraw or restyle it without Brian's yes.
