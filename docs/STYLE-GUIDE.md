# Space Snack Quest — Style Guide (sketches + Ch1 build)

For Brian. Keep every new sketch and build panel matching this. Template room: `hall_soft3.py` → `sketch-01m-hall-soft.png`.
Updated Nov 9, 2026, synced through R57. The decisions behind each rule are in `docs/DECISIONS.md` (codes in brackets). This page does not change the game.

## Canvas and room frame
- Canvas: **1280 × 830**
- Room frame: **L,T,R,B = 40, 60, 1240, 800**, radius 24, outline width **BW = 7**
- Outline / dark color: **DARK = (34, 36, 44)**
- Outside mat: **OUT = (226, 229, 237)**
- Wall: **WALL = (244, 241, 234)** · Floor: **FLOOR = (234, 229, 218)** · Floor line: **LINE = (200, 197, 190)** width 4
- Door gaps cut through the frame so a walk-off / walk-in is visible

## Newer room style (use this for every room) [R4]
- Draw rooms like `sketch-01k` / `sketch-01m-hall-soft` (`hall_soft3.py`), **not** the older block style (solid labeled blocks for areas).
- Inner areas are made with **thin partial walls** in the same DARK outline, not filled blocks. Example: the mail room is a partial wall in the corner of the delivery room with its opening toward where the manager stands, so robots inside can't see the wall vent [R18].
- **No area labels** on the floor or walls (e.g. no "MAIL ROOM", no "STORAGE") unless Brian asks for one [R17].
- **Don't invent new rooms** unless Brian asks for one. Reuse rooms that already exist (hall, delivery room with the mail room, home, office, vent workstation). The connecting hallway is the one he asked for [R48, R51, R55]. It runs between the party hall and the loading bay, with the Employee of the Month wall and a locked office door [R53].
- **Home** is the game's home, plus a wardrobe on the back wall at the far left [R29, R30]. The calendar hangs on the wardrobe door and swings away when the door is open [R31, R34]. The door out is a cut in the right wall, and the STAY IN HERE poster is on the wall beside it [R35, R36]. No mop in the home [R33]. No vent in the home [R37]. The spare on the hook is a plain blue jacket, not a JANITOR shirt [R45]. The closet-and-shirt note [R24] is Superseded by those rows. Home v4 stays CURRENT until Brian says APPROVED [W34, R45].
- Things that appear only at certain times: the **fur scanner arch** (blue scan line, foot of the ramp) is drawn **only when a ship is docked** [R15]. The mail room is **empty except for the robot mailbox** until pickup day, then holds crates and big bags [R20].
- The **robot mailbox** (an old-school mailbox that's secretly a robot) is in the mail room in **every** delivery-room panel, day and night [R21].
- One snack stand in the hall, on the far right, turned against the wall. The big viewing window stays flush in the top-right corner. Speaker, FUR pull alarm and vent are spread out on the walls [R7, R9, R11].

## Look
- Simple rounded shapes, flat fills, **no texture**
- One thick dark outline on everything
- Soft muted colors (cream, warm gray, pale blue)
- **Yellow `(244, 196, 48)` is the only accent** — usable / interactive things
- Objects mostly face-on; back wall + one floor line
- Windows / screens: dark navy with simple shapes only
  - Stormtop view: 2–3 flat cloud bands, one plain ring arc, dot stars — never busy cartoony art
- Sprite corners: flood-fill transparent with thresh **40** (`P(name, h)`)

## Fonts [R3]
- **Sketches — speech / labels:** Nunito ExtraBold  
  `/usr/share/fonts/truetype/sand-box/google/Nunito/Nunito-VariableFont_wght.ttf` + `set_variation_by_name('ExtraBold')`
- **Sketches — handwriting / notes:** Kalam Bold  
  `.../Kalam/Kalam-Bold.ttf`
- **Game text:** `system-ui` at weight **800** (whisper weight **600**)

## Bubbles
**Speech (talking)**  
- White fill, solid DARK outline, pointed tail toward the speaker  
- Text: dark, Nunito ExtraBold (sketches) / system-ui 800 (game)

**Whisper / thinking** (game style — use this whenever someone is thinking) [R2]  
- Dashed outline `setLineDash([4, 6])`  
- Fill **`#f6f7fb`**  
- Text **`#4b5563`**, weight 600, smaller  
- **No tail**  
- Song bubbles stay the separate pink song style; do not mix them up

## Characters
- **Adults** (manager, workers, guests) must be clearly **taller than Squatch and Mops**
- Guests / workers: varied alien types, same simple rounded thick-outline style
- **Mops:** a goat, not sheep-like: lean body, short upturned tail, scraggly white beard to the floor, rounded pink-inside ears, curled tan horns, gray legs, closed-eye dash, pink nose. Blue work shirt (option 2) with a chest pocket and name patch. **No badge.** Match `spr_mops_new.png` / `mops-approved.jpg` [C1].
- **No mop prop, ever.** Mops cleans with his **beard**, everywhere, the kitchen included [C2].
- **Guests:** use approved `spr_guest_01`–`06` (teal-jacket woman, camera tourist, three-eyed backpacker, stilt-legs, octopus, robot tourist) plus the existing guests. Not 07 (jelly) or 08 (furry) [C12]. Workers and manager keep the current `spr_a_*.png` sprites [C11].

## Squatch hiding [C3, C8, C21]
- **In a plant, bush or box: show ONLY the plant (or box) and his eyes.** Never his body or a fur patch beside or behind it. This applies to every panel, always.
- **Peek-eyes = exactly the game [C21].** *Plant:* the game plant (`Xp()`): orange pot, five fuzzy leaf clumps. The two eyes sit low, in the two lower-front clumps (eye centre about halfway down the leaves). Each eye is about 12% of the plant's height, and the centres are about 19% of the plant's width apart. *Box:* the game two-box stack (`Ys()`). The eyes peek at the seam, just under the small box. *Eyes* (`ga()`): two round white eyes, 2 px dark outline `#1e2430`, dark pupil nudged down-right. Sketches use `peek_eyes.py` → `paste_plant_hide()` / `paste_box_hide()`. **Superseded:** the v1 helper at 2.5× scale, placed high, on the old smooth plant [C9].
- **The ball pose = L2**, everywhere: `_ball_head_L2.png` (from `sketch-ball-options-4.png`). It's a solid brown ball with Squatch's frizzy, scalloped head outline and ears, and two slightly bigger dark eyes with tiny white highlights. No face, no arms or legs. Older options (A–E, the 62% kitchen-duck squash, F–J, K, L) are not used. Ball-hide detection, when it is built, is R43 (about 70px for 2 seconds). That is not in the game.
- **Party pictures:** no Mops and no robots [R49]. Guests 01–05 only in those panels. Guest 06 stays an approved sprite for other crowds [C12]. The manager's label, when a picture uses one, is Isfred Bar Neshuman [R42], and that label is NEEDS BRIAN in the lines file.

## Story / panel rules
- **One picture per moment** — no arrows, no multi-step diagrams
- Every room change needs a **visible walk-off and walk-in**
- Reuse existing scenes, props, and code; keep the look clean and consistent
- Never invent why Squatch's parents never returned
- New on-screen words go in a lines file for Brian's yes first
- No difficulty, timer, price, or range changes without Brian's yes

## Props that keep coming up
- Papers, one copy each: **white** stays in the office. **Yellow** gets bitten by Mops and spat into the bin by the plant, then Squatch takes it out at night, paw-signs it and posts it in the robot mailbox. **Pink** (handwritten code + carbon paw print) gets sucked into the big wall vent and sits on the left of Mops's workstation desk [S27, S45]
- Guardian notes in the game: white notes signed **— The Guardians** with a big-foot doodle; the workstation wall itself is just **"IDEAS FOR GUARDIANS"** over small unreadable scribbles (Squatch already has the real notes)
- Floor vents: soft continuous inward swirl streaks, not rings. Vents only pull in; clean air comes out of wall grilles as a gentle puff [R12]
- The big crawl vent is a goat-sized **wall** vent under the speaker on the right of the delivery room [R14, S43]
