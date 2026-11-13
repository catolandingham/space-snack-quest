"""Shared CONNECTING HALLWAY drawing (Space Snack Quest sketches).

Passage BETWEEN the party hall and the loading bay (delivery room) — R51
(Brian t252/t253), layout corrected by R53 (Brian t254).
Distinct from the party hall in hall_room.py.
NO door to home (home opens off the party hall, R6).

Layout (v5 / R53):
  - LEFT side wall  → party HALL exit (wall cut; same language as
    delivery_room left doorway)
  - RIGHT side wall → LOADING BAY exit (wall cut; same language as
    home_room / hall_room right doorway)
  - BACK wall       → Employee of the Month photo wall only
    (title + 47 Tf frames + tilted photo23), centered
  - FRONT (bottom) wall → manager's office door, CLOSED, with a small
    code keypad beside it (game S11 world keypad: #59657d block + 4
    cyan dots). No alcove / bump-out; no desk glimpse (door is locked).
    No new words (R17 omits area labels; desk MANAGER plate is inside).

Style: newer soft room (R4). Side exits are wall cuts, never door slabs
(R36). The office door is the exception — a closed slab because it is
locked with a code (R53 / S5).

    im = draw_hallway(im=None)
    ... panel: characters / props ...
    im = finish_hallway(im)
"""
from PIL import Image, ImageDraw, ImageFont
import os, sys

MOCKUPS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if MOCKUPS not in sys.path:
    sys.path.insert(0, MOCKUPS)

W, H = 1280, 830
OUT = (226, 229, 237)
WALL = (244, 241, 234)
FLOOR = (234, 229, 218)
LINE = (200, 197, 190)
DARK = (34, 36, 44)
GOLD = (201, 162, 39)
PHOTO_BG = (232, 244, 255)
# Game closed-door / keypad colours (50-story-frame.js S11)
DOOR_CLOSED = (138, 147, 163)       # #8a93a3
DOOR_OPEN_HINT = (43, 58, 103)      # #2b3a67 (seam)
KEYPAD = (89, 101, 125)             # #59657d
KEYPAD_DOT = (143, 220, 255)        # #8fdcff
L, T, R, B = 40, 60, 1240, 800
BW = 7
FLOOR_Y = 330

# Side-wall exits — match delivery left / home+hall right (y 350–455).
DOOR_Y0, DOOR_Y1 = 350, 455

# Photo wall centered on the back wall (no side openings competing for space).
PHOTO_COLS = 12
PHOTO_DX, PHOTO_DY = 46, 36
PHOTO_COUNT = 47
PHOTO23 = 22
PHOTO_SCALE = 1.1
TITLE_GAP = 30
TITLE_SIZE = 17
# Grid centres: mid of cols 0..11 at room centre 640.
_PHOTO_SPAN = (PHOTO_COLS - 1) * PHOTO_DX          # 506
PHOTO_ORIGIN = (640 - _PHOTO_SPAN // 2, 155)       # (387, 155)

# Closed office door on the FRONT (bottom) wall, opposite the photo wall.
# Game S11 closed door is 96×120; scale up a touch for mockup readability.
OFF_DOOR_W, OFF_DOOR_H = 130, 160
OFF_DOOR_CX = 640
OFF_DOOR_FOOT = B - BW - 2                         # sits against bottom frame
# Keypad to the RIGHT of the door (game: 28×36 block, 2×2 cyan dots).
KEY_W, KEY_H = 36, 46
KEY_GAP = 18                                       # gap from door edge to keypad

G = '/usr/share/fonts/truetype/sand-box/google/'


def NB(s):
    f = ImageFont.truetype(G + 'Nunito/Nunito-VariableFont_wght.ttf', s)
    try:
        f.set_variation_by_name('ExtraBold')
    except Exception:
        pass
    return f


def _walls(d):
    d.rounded_rectangle([L, T, R, B], radius=24, fill=FLOOR)
    d.rectangle([L + 4, T + 4, R - 4, FLOOR_Y], fill=WALL)
    d.rounded_rectangle([L + 2, T + 2, R - 2, FLOOR_Y + 10], radius=22, fill=WALL)
    d.rectangle([L + 2, FLOOR_Y - 20, R - 2, FLOOR_Y], fill=WALL)
    d.line([(L + 4, FLOOR_Y), (R - 4, FLOOR_Y)], fill=LINE, width=4)


def cut_left_doorway(d):
    """Party-hall exit: LEFT side-wall cut (delivery_room._frame language)."""
    d.rectangle([L - 2, DOOR_Y0, L + BW + 1, DOOR_Y1], fill=FLOOR)
    d.rectangle([L - 12, DOOR_Y0, L - 1, DOOR_Y1], fill=OUT)
    for y in (DOOR_Y0, DOOR_Y1):
        d.line([(L - 1, y), (L + BW, y)], fill=DARK, width=4)


def cut_right_doorway(d):
    """Loading-bay exit: RIGHT side-wall cut (home_room / hall_room language)."""
    d.rectangle([R - BW - 1, DOOR_Y0, R + 2, DOOR_Y1], fill=FLOOR)
    d.rectangle([R + 3, DOOR_Y0, R + 12, DOOR_Y1], fill=OUT)
    for y in (DOOR_Y0, DOOR_Y1):
        d.line([(R - BW, y), (R + 1, y)], fill=DARK, width=4)


def _tf_frame(d, cx, cy, secret=False, scale=1.0):
    s = scale
    fw, fh = int(36 * s), int(28 * s)
    iw, ih = int(30 * s), int(22 * s)
    x0, y0 = int(cx - fw / 2), int(cy - fh / 2)
    d.rounded_rectangle([x0, y0, x0 + fw, y0 + fh], radius=max(1, int(2 * s)),
                        fill='white', outline=DARK, width=max(2, int(2 * s)))
    d.rounded_rectangle([int(cx - iw / 2), int(cy - ih / 2),
                         int(cx + iw / 2), int(cy + ih / 2)],
                        radius=max(1, int(1 * s)), fill=PHOTO_BG)
    hr = max(3, int(6 * s))
    d.ellipse([cx - hr, cy - hr + int(1 * s), cx + hr, cy + hr + int(1 * s)],
              fill='white', outline=DARK, width=max(1, int(1.2 * s)))
    horn = (184, 160, 126)
    d.line([(cx - int(4 * s), cy - int(3 * s)), (cx - int(7 * s), cy - int(7 * s))],
           fill=DARK, width=max(1, int(1.6 * s)))
    d.line([(cx + int(4 * s), cy - int(3 * s)), (cx + int(7 * s), cy - int(7 * s))],
           fill=DARK, width=max(1, int(1.6 * s)))
    d.line([(cx + int(8 * s), cy - int(5 * s)), (cx + int(10 * s), cy + int(4 * s))],
           fill=horn, width=max(1, int(1.4 * s)))
    er = max(1, int(0.9 * s))
    d.ellipse([cx - int(2 * s) - er, cy - er, cx - int(2 * s) + er, cy + er], fill=DARK)
    d.ellipse([cx + int(2 * s) - er, cy - er, cx + int(2 * s) + er, cy + er], fill=DARK)
    if secret:
        bbox = [cx - int(4.5 * s), cy - int(1 * s), cx + int(4.5 * s), cy + int(6 * s)]
        d.arc(bbox, 20, 160, fill=(229, 83, 61), width=max(2, int(2.2 * s)))
        d.ellipse([cx - int(8 * s) - int(3 * s), cy - int(6 * s) - int(3 * s),
                   cx - int(8 * s) + int(3 * s), cy - int(6 * s) + int(3 * s)],
                  outline=(255, 176, 0), width=max(1, int(1.5 * s)))
    else:
        d.line([(cx - int(2.5 * s), cy + int(4 * s)),
                (cx + int(2.5 * s), cy + int(4 * s))], fill=DARK, width=max(1, int(1 * s)))


def _photo_wall(d):
    ox, oy = PHOTO_ORIGIN
    title_y = oy - TITLE_GAP
    assert title_y - 12 > T + BW, (title_y, T + BW)
    d.text((ox + _PHOTO_SPAN // 2, title_y),
           "EMPLOYEE OF THE MONTH", font=NB(TITLE_SIZE), fill=GOLD, anchor='mm')
    tilted = None
    for i in range(PHOTO_COUNT):
        col, row = i % PHOTO_COLS, i // PHOTO_COLS
        cx = ox + col * PHOTO_DX
        cy = oy + row * PHOTO_DY
        if i == PHOTO23:
            layer = Image.new('RGBA', (56, 48), (0, 0, 0, 0))
            ld = ImageDraw.Draw(layer)
            _tf_frame(ld, 28, 24, secret=True, scale=PHOTO_SCALE)
            rot = layer.rotate(-12, expand=True, resample=Image.BICUBIC)
            tilted = (rot, cx, cy)
        else:
            _tf_frame(d, cx, cy, secret=False, scale=PHOTO_SCALE)
    return tilted


def _office_door_closed(d):
    """Closed manager's office door on the front (bottom) wall + world keypad.

    Door face: game S11 closed slab (#8a93a3) with a vertical seam.
    Keypad: game world pad (28×36 #59657d + 4 #8fdcff dots), beside the door.
    No desk glimpse — door is locked (R53 / S5). No new words.
    """
    x0 = OFF_DOOR_CX - OFF_DOOR_W // 2
    x1 = x0 + OFF_DOOR_W
    y1 = OFF_DOOR_FOOT
    y0 = y1 - OFF_DOOR_H
    # door slab
    d.rounded_rectangle([x0, y0, x1, y1], radius=6, fill=DOOR_CLOSED, outline=DARK, width=4)
    # vertical seam (closed double-door read, matches game C([mid,...], y, 3))
    mid = OFF_DOOR_CX
    d.line([(mid, y0 + 6), (mid, y1 - 6)], fill=DOOR_OPEN_HINT, width=3)
    # small handle bump on the right leaf
    hx, hy = mid + 18, (y0 + y1) // 2
    d.ellipse([hx - 4, hy - 4, hx + 4, hy + 4], fill=DARK)

    # keypad to the right of the door, sitting on the floor just above the
    # bottom frame (readable, next to the door — game Ga pad language)
    kx0 = x1 + KEY_GAP
    ky1 = y1 - 10
    ky0 = ky1 - KEY_H
    kx1 = kx0 + KEY_W
    d.rounded_rectangle([kx0, ky0, kx1, ky1], radius=4, fill=KEYPAD, outline=DARK, width=3)
    # 2×2 cyan dots (game: F(Ga.x - 6 + (o%2)*12, Ga.y - 14 + floor(o/2)*12, 3, "#8fdcff"))
    pads = [
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.68),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.68),
    ]
    for px, py in pads:
        d.ellipse([px - 3, py - 3, px + 3, py + 3], fill=KEYPAD_DOT)



def _office_door_open(d):
    """Office door OPEN after the code puzzle (S5). Same footprint as the closed
    slab; leaves swing inward to dark office. Keypad stays (just used)."""
    x0 = OFF_DOOR_CX - OFF_DOOR_W // 2
    x1 = x0 + OFF_DOOR_W
    y1 = OFF_DOOR_FOOT
    y0 = y1 - OFF_DOOR_H
    # dark office interior through the opening
    d.rectangle([x0 + 4, y0 + 4, x1 - 4, y1 - 2], fill=(43, 58, 103))
    # left leaf swung open (edge-on strip on the left jamb)
    d.rectangle([x0, y0, x0 + 14, y1], fill=DOOR_CLOSED, outline=DARK, width=3)
    # right leaf swung open (edge-on on the right jamb)
    d.rectangle([x1 - 14, y0, x1, y1], fill=DOOR_CLOSED, outline=DARK, width=3)
    # top lintel
    d.rectangle([x0, y0, x1, y0 + 8], fill=DOOR_CLOSED, outline=DARK, width=3)
    # keypad unchanged (to the right)
    kx0 = x1 + KEY_GAP
    ky1 = y1 - 10
    ky0 = ky1 - KEY_H
    kx1 = kx0 + KEY_W
    d.rounded_rectangle([kx0, ky0, kx1, ky1], radius=4, fill=KEYPAD, outline=DARK, width=3)
    pads = [
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.68),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.68),
    ]
    for px, py in pads:
        d.ellipse([px - 3, py - 3, px + 3, py + 3], fill=KEYPAD_DOT)


def _office_door_ajar(d):
    """Door just starting to open: left ~2/3 closed, right third swings in
    (Squatch just typed the code). Keypad lit."""
    x0 = OFF_DOOR_CX - OFF_DOOR_W // 2
    x1 = x0 + OFF_DOOR_W
    y1 = OFF_DOOR_FOOT
    y0 = y1 - OFF_DOOR_H
    split = x0 + int(OFF_DOOR_W * 0.55)
    # left leaf still mostly closed
    d.rounded_rectangle([x0, y0, split + 2, y1], radius=6, fill=DOOR_CLOSED, outline=DARK, width=4)
    # right opening — clear dark interior (door starting to open)
    d.rectangle([split + 2, y0 + 3, x1 - 3, y1 - 2], fill=(43, 58, 103))
    # right leaf edge-on at the jamb
    d.rectangle([x1 - 10, y0, x1, y1], fill=DOOR_CLOSED, outline=DARK, width=3)
    # keypad
    kx0 = x1 + KEY_GAP
    ky1 = y1 - 10
    ky0 = ky1 - KEY_H
    kx1 = kx0 + KEY_W
    d.rounded_rectangle([kx0, ky0, kx1, ky1], radius=4, fill=KEYPAD, outline=DARK, width=3)
    pads = [
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.68),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.68),
    ]
    for px, py in pads:
        d.ellipse([px - 3, py - 3, px + 3, py + 3], fill=KEYPAD_DOT)
    # active glow on keypad (just pressed)
    d.ellipse([pads[0][0] - 5, pads[0][1] - 5, pads[0][0] + 5, pads[0][1] + 5],
              outline=(255, 230, 120), width=2)



def apply_hallway_night(im, pool_center=None):
    """Night overlay for hallway panels (same language as delivery apply_night).
    Dim the room, soft light pool near the office door/keypad, then re-glow
    the keypad cyan dots so they stay bright. Does NOT change draw_hallway
    (APPROVED empty room stays day-lit / unchanged).
    """
    from PIL import ImageFilter
    base = im.convert('RGBA')
    # Dim
    night = Image.new('RGBA', im.size, (18, 22, 55, 135))
    dim = Image.alpha_composite(base, night)
    # Soft light pool around door/keypad
    if pool_center is None:
        pool_center = (OFF_DOOR_CX + OFF_DOOR_W // 2 + KEY_GAP, OFF_DOOR_FOOT - OFF_DOOR_H // 3)
    cx, cy = pool_center
    pool = Image.new('RGBA', im.size, (0, 0, 0, 0))
    pd = ImageDraw.Draw(pool)
    for r, a in ((220, 55), (150, 80), (90, 110)):
        pd.ellipse([cx - r, cy - int(r * 0.7), cx + r, cy + int(r * 0.7)],
                   fill=(255, 230, 170, a))
    pool = pool.filter(ImageFilter.GaussianBlur(radius=28))
    lit = Image.alpha_composite(dim, pool)
    # Re-glow keypad dots (and a slight pad face) so they read at night
    d = ImageDraw.Draw(lit)
    x1 = OFF_DOOR_CX + OFF_DOOR_W // 2
    kx0 = x1 + KEY_GAP
    ky1 = OFF_DOOR_FOOT - 10
    ky0 = ky1 - KEY_H
    kx1 = kx0 + KEY_W
    # brighter pad face
    d.rounded_rectangle([kx0, ky0, kx1, ky1], radius=4, fill=(110, 130, 165, 255), outline=DARK, width=3)
    pads = [
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.68),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.68),
    ]
    # one "just pressed" brighter
    for i, (px, py) in enumerate(pads):
        col = (200, 245, 255, 255) if i == 0 else (*KEYPAD_DOT, 255)
        d.ellipse([px - 4, py - 4, px + 4, py + 4], fill=col)
        if i == 0:
            d.ellipse([px - 7, py - 7, px + 7, py + 7], outline=(255, 240, 160, 200), width=2)
    return lit.convert('RGB')


def draw_hallway(im=None, office_door='closed'):
    if im is None:
        im = Image.new('RGB', (W, H), OUT)
    d = ImageDraw.Draw(im)
    _walls(d)
    d.rounded_rectangle([L, T, R, B], radius=24, outline=DARK, width=BW)

    tilted = _photo_wall(d)
    if tilted is not None:
        rot, cx, cy = tilted
        im.paste(rot, (int(cx - rot.width / 2), int(cy - rot.height / 2)), rot)
        d = ImageDraw.Draw(im)

    if office_door == 'open':
        _office_door_open(d)
    elif office_door == 'ajar':
        _office_door_ajar(d)
    else:
        _office_door_closed(d)
    cut_left_doorway(d)
    cut_right_doorway(d)
    return finish_hallway(im)


def finish_hallway(im):
    """Re-seal frame + side-wall exits on top (characters must not cover them)."""
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([L, T, R, B], radius=24, outline=DARK, width=BW)
    cut_left_doorway(d)
    cut_right_doorway(d)
    return im


if __name__ == '__main__':
    os.chdir(MOCKUPS)
    draw_hallway().save('/tmp/hallway-room-empty.png')
    print('wrote /tmp/hallway-room-empty.png')
