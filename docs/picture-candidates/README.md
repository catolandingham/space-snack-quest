# Picture candidates (not locked, not in the game)

Candidates for Brian to choose from. Nothing here is a locked room and the game does not use these files.
A chosen picture becomes a new locked version only with Brian's yes (docs/locked-rooms/README.md).

## Party hall, 2026-11-22 (overnight)

`hall-options-side-by-side.png` shows the locked hall next to two options. Both remove the painted yellow
outline round the snack bar (Brian, 2026-11-22: "Good with two and three"). Both are edits of a copy of
`hall-room-empty-v1.png` (the scripts that drew the locked rooms need sprite files that are not in this repo).

- **Option A** (`hall-option-A.png`): the hallway doorway moves right up into the back corner, and the bar is
  shorter and lower, so the way in is clear. Matches "the hallway entrance needs to move closer to the wall,
  and the bar needs to move further away to the other wall" (G Bot #603) and "the bar being too long and
  blocking the other door" (Grok Bot #328).
- **Option B** (`hall-option-B.png`): the doorway stays where it is; the bar just starts below it.

Brian's requests also included "you need to be able to get behind the snack bar" (Squatchbot #451) and later
"bring the bar even closer in, though, to the wall" (Squatchbot #494). Both options keep the bar against the
wall, following the later request.

If one is chosen, the game also changes: the bar's solid boxes (`CH1_PARTY_FIXED`), the snack spot, and, for
option A, the hall's side door point used by room walks (`hallSideDoor`, 870,348) and the doorway outline
(`goal-targets.js`).

## Sight cones on everyone, 2026-11-22 (overnight)

`cones-everyone-ipad.png` and `cones-everyone-phone.png`: the party hall as the game draws it, with the cone
rule Brian picked drawn over it (not built in the game): every guest and the bartender has a faint dashed cone;
the one Squatch stands in fills yellow, with a "?" over that guest because he is in disguise. This is the
"check before building" step in DECISIONS.md (Brian's Nov 11 worry: cones on every guest "would be too much").
If it reads cleanly, build it; if not, fall back to cones only on guards and robots, "?" then "!" over guests.

## Home room speaker, 2026-11-23

`home-room-speaker-A-closed.png` and `home-room-speaker-A-open.png`: the locked home room (v5, closet closed
and open) with the bedroom speaker added at the spot Brian picked, "A, near the door" (Squatchbot #1385, Nov 17:
high on the wall, above the STAY IN HERE poster, beside the doorway out). The speaker is the one Brian picked for
every wall, "4: retro wooden speaker" (Squatchbot #448), cut from the locked hall picture so it matches exactly.
It is drawn without the sound lines the hall has painted on, because Brian's rule is that the speaker shows sound
lines (announcements) or music notes (songs) only while it is playing (G Bot #566, #575); the game draws those.
Nothing else in the picture changed. If Brian says yes, this becomes home v6 and the morning beat gets the speaker
announcement, the Dog Zylan line and the song, all already approved in the Squatchbot thread (#1386 to #1391).
