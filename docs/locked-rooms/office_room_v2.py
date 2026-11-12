"""Manager's office v2 (Space Snack Quest sketches).

Brian locked this picture (R84) as office-room-empty-v2.png.
Do not change it without his yes and a new locked version.

The hallway office door sits on the hallway's FRONT wall
(LOCKED/hallway-room-empty-v6). From inside the office, that same
gray sliding double door + keypad is on the BACK wall (Brian t326 / t327).

Contents (empty room, no characters):
  - Back-wall sliding double door + keypad (same language as hallway_room)
  - Desk with "Isfred Bar Neshuman" nameplate, computer (blank screen;
    the Moon Pie site is a later panel), in/out tray, giant lint roller
  - Desk chair
  - Filing cabinet
  - Wall of 4 security monitors (for the tape review)
  - "NO FUR" sign (a crossed-out tuft of fur)
  - "HANG IN THERE" poster, a cat floating in space

Style: same frame, colors, line weights and flat cartoon language as
hall_room / hallway_room / delivery_room / home_room (R4). Cream wall,
warm floor — not the old lavender office floor.

    im = draw_office()
    ... panel: characters / props ...
    im = finish_office(im)
"""
import math
import os
import random

from PIL import Image, ImageDraw, ImageFont

MOCKUPS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1280, 830
OUT = (226, 229, 237)
WALL = (244, 241, 234)
FLOOR = (234, 229, 218)
LINE = (200, 197, 190)
DARK = (34, 36, 44)
# Desk / door / keypad — same palette as office_room.py and hallway_room.py
DESK = (138, 147, 163)          # #8a93a3
DESK_TOP = (181, 188, 200)      # #b5bcc8
PLATE = (43, 58, 103)           # #2b3a67
BEZEL = (89, 101, 125)          # #59657d
SCREEN_FILL = (232, 244, 255)   # #e8f4ff
DOOR_CLOSED = (138, 147, 163)   # #8a93a3
DOOR_SEAM = (43, 58, 103)       # #2b3a67
KEYPAD = (89, 101, 125)         # #59657d
KEYPAD_DOT = (143, 220, 255)    # #8fdcff
NAVY = (50, 56, 96)
RED = (229, 83, 61)
GOLD = (201, 162, 39)
FUR = (110, 72, 44)
FURD = (86, 54, 32)
PAPER = (250, 250, 252)
CREAM = (255, 253, 243)
YEL = (244, 196, 48)
ORANGE = (232, 150, 74)
ORANGED = (196, 112, 48)
CAT_CREAM = (245, 228, 196)
STAR = (235, 235, 245)
PINK_EAR = (236, 186, 170)
GREEN = (43, 196, 138)

L, T, R, B = 40, 60, 1240, 800
BW = 7
FLOOR_Y = 330

# Same door as hallway_room.py (LOCKED/hallway-room-empty-v6).
# Sits on the back-wall floor line, looking into the office from the other side.
OFF_DOOR_W, OFF_DOOR_H = 130, 160
OFF_DOOR_CX = 640
KEY_W, KEY_H = 36, 46
KEY_GAP = 18

G = '/usr/share/fonts/truetype/sand-box/google/'


def NB(s):
    f = ImageFont.truetype(G + 'Nunito/Nunito-VariableFont_wght.ttf', s)
    try:
        f.set_variation_by_name('ExtraBold')
    except Exception:
        pass
    return f


def _rr(d, box, radius, fill=None, outline=None, width=3):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def _walls(d):
    d.rounded_rectangle([L, T, R, B], radius=24, fill=FLOOR)
    d.rectangle([L + 4, T + 4, R - 4, FLOOR_Y], fill=WALL)
    d.rounded_rectangle([L + 2, T + 2, R - 2, FLOOR_Y + 10], radius=22, fill=WALL)
    d.rectangle([L + 2, FLOOR_Y - 20, R - 2, FLOOR_Y], fill=WALL)
    d.line([(L + 4, FLOOR_Y), (R - 4, FLOOR_Y)], fill=LINE, width=4)


def _office_door(d):
    """Same closed sliding double door + keypad as hallway_room._office_door_closed,
    planted on the back-wall floor line (the hallway door seen from inside)."""
    x0 = OFF_DOOR_CX - OFF_DOOR_W // 2
    x1 = x0 + OFF_DOOR_W
    y1 = FLOOR_Y
    y0 = y1 - OFF_DOOR_H
    _rr(d, [x0, y0, x1, y1], radius=6, fill=DOOR_CLOSED, outline=DARK, width=4)
    mid = OFF_DOOR_CX
    d.line([(mid, y0 + 6), (mid, y1 - 6)], fill=DOOR_SEAM, width=3)
    hx, hy = mid + 18, (y0 + y1) // 2
    d.ellipse([hx - 4, hy - 4, hx + 4, hy + 4], fill=DARK)
    kx0 = x1 + KEY_GAP
    ky1 = y1 - 10
    ky0 = ky1 - KEY_H
    kx1 = kx0 + KEY_W
    _rr(d, [kx0, ky0, kx1, ky1], radius=4, fill=KEYPAD, outline=DARK, width=3)
    pads = [
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.32),
        (kx0 + KEY_W * 0.30, ky0 + KEY_H * 0.68),
        (kx0 + KEY_W * 0.70, ky0 + KEY_H * 0.68),
    ]
    for px, py in pads:
        d.ellipse([px - 3, py - 3, px + 3, py + 3], fill=KEYPAD_DOT)


def _security_monitors(d):
    """2×2 wall of small security screens, left side of the back wall."""
    px0, py0, px1, py1 = 78, 108, 338, 300
    _rr(d, [px0, py0, px1, py1], radius=8, fill=DESK, outline=DARK, width=4)
    gap_x, gap_y = 12, 12
    pad = 14
    inner_w = px1 - px0 - 2 * pad
    inner_h = py1 - py0 - 2 * pad
    sw = (inner_w - gap_x) // 2
    sh = (inner_h - gap_y) // 2

    def rec_dot(sx1, sy0):
        # red rec LED on the bezel, top-right, not on the picture
        d.ellipse([sx1 - 13, sy0 + 5, sx1 - 5, sy0 + 13], fill=RED)

    def screen_bezel(sx0, sy0, sx1, sy1):
        _rr(d, [sx0, sy0, sx1, sy1], radius=4, fill=BEZEL, outline=DARK, width=3)
        ix0, iy0, ix1, iy1 = sx0 + 7, sy0 + 7, sx1 - 7, sy1 - 7
        _rr(d, [ix0, iy0, ix1, iy1], radius=3, fill=(36, 42, 62), outline=DARK, width=2)
        return ix0, iy0, ix1, iy1

    def feed_hall(box):
        ix0, iy0, ix1, iy1 = box
        midy = iy0 + int((iy1 - iy0) * 0.58)
        d.rectangle([ix0 + 1, iy0 + 1, ix1 - 1, midy], fill=(220, 216, 208))
        d.rectangle([ix0 + 1, midy, ix1 - 1, iy1 - 1], fill=(206, 200, 188))
        d.line([(ix0 + 1, midy), (ix1 - 1, midy)], fill=(170, 166, 158), width=1)
        # simple door slab, centered on the floor line
        dx = (ix0 + ix1) // 2
        _rr(d, [dx - 10, midy - 30, dx + 10, midy], radius=1,
            fill=DESK, outline=(80, 86, 100), width=1)
        d.line([(dx, midy - 28), (dx, midy - 2)], fill=DOOR_SEAM, width=1)

    def feed_hallway(box):
        ix0, iy0, ix1, iy1 = box
        midy = iy0 + int((iy1 - iy0) * 0.50)
        d.rectangle([ix0 + 1, iy0 + 1, ix1 - 1, midy], fill=(220, 216, 208))
        d.rectangle([ix0 + 1, midy, ix1 - 1, iy1 - 1], fill=(206, 200, 188))
        d.line([(ix0 + 1, midy), (ix1 - 1, midy)], fill=(170, 166, 158), width=1)
        # a few photo frames
        for c, r in ((0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (2, 1)):
            cx = ix0 + 16 + c * 16
            cy = iy0 + 12 + r * 12
            _rr(d, [cx - 6, cy - 5, cx + 6, cy + 5], radius=1,
                fill=(200, 220, 236), outline=(80, 86, 100), width=1)
        # tiny office door on the floor
        dx = (ix0 + ix1) // 2
        _rr(d, [dx - 8, iy1 - 20, dx + 8, iy1 - 4], radius=1,
            fill=DESK, outline=(80, 86, 100), width=1)
        d.line([(dx, iy1 - 18), (dx, iy1 - 6)], fill=DOOR_SEAM, width=1)

    def feed_bay(box):
        ix0, iy0, ix1, iy1 = box
        d.rectangle([ix0 + 1, iy0 + 1, ix1 - 1, iy0 + 30], fill=NAVY)
        random.seed(4)
        for _ in range(12):
            x = random.randint(ix0 + 5, ix1 - 5)
            y = random.randint(iy0 + 4, iy0 + 26)
            d.ellipse([x - 1, y - 1, x + 1, y + 1], fill=STAR)
        d.rectangle([ix0 + 1, iy0 + 30, ix1 - 1, iy1 - 1], fill=(206, 200, 188))

    def feed_static(box):
        ix0, iy0, ix1, iy1 = box
        for y in range(iy0 + 3, iy1 - 2, 4):
            d.line([(ix0 + 2, y), (ix1 - 2, y)], fill=(50, 62, 90), width=1)

    origins = [
        (px0 + pad, py0 + pad),
        (px0 + pad + sw + gap_x, py0 + pad),
        (px0 + pad, py0 + pad + sh + gap_y),
        (px0 + pad + sw + gap_x, py0 + pad + sh + gap_y),
    ]
    drawers = (feed_hall, feed_hallway, feed_bay, feed_static)
    for i, (sx0, sy0) in enumerate(origins):
        sx1, sy1 = sx0 + sw, sy0 + sh
        box = screen_bezel(sx0, sy0, sx1, sy1)
        drawers[i](box)
        rec_dot(sx1, sy0)


def _fur_tuft(d, cx, cy, s=1.0):
    """A tuft of fur: one shaggy silhouette (single outline, no internal lobes)."""
    # Bottom is a rounded clump; the top is a row of hair peaks.
    # Built in local units, then scaled. Clockwise from the lower left.
    local = [
        (-10,  6), (-8,  8), (-3,  9), ( 3,  9), ( 8,  8), (10,  6),
        (11,  2),  (12, -2), (9, -6),
        (10, -12), (6, -8),      # right hair peak
        (5, -16), (2, -9),       # tall mid-right peak
        (0, -18), (-2, -9),      # tallest center peak
        (-5, -15), (-6, -8),     # mid-left peak
        (-10, -12), (-9, -6),    # left hair peak
        (-12, -2), (-11,  2),
    ]
    pts = [(cx + x * s, cy + y * s) for x, y in local]
    d.polygon(pts, fill=FUR)
    d.line(pts + [pts[0]], fill=DARK, width=max(2, int(2 * s)))
    # soft highlight, no outline
    d.ellipse([cx - int(4 * s), cy, cx + int(3 * s), cy + int(5 * s)],
              fill=(138, 92, 58))
    # two short stray hairs off the tallest peaks (up only)
    d.line([(cx - 1 * s, cy - 18 * s), (cx - 2 * s, cy - 23 * s)],
           fill=DARK, width=max(2, int(2 * s)))
    d.line([(cx + 5 * s, cy - 16 * s), (cx + 7 * s, cy - 21 * s)],
           fill=DARK, width=max(2, int(2 * s)))


def _no_fur_sign(d):
    """Rounded sign on the back wall: NO FUR + a crossed-out tuft of fur."""
    cx, cy = 870, 198
    w, h = 128, 148
    x0, y0 = cx - w // 2, cy - h // 2
    _rr(d, [x0, y0, x0 + w, y0 + h], radius=4, fill=CREAM, outline=DARK, width=3)
    d.text((cx, y0 + 22), "NO FUR", font=NB(20), fill=RED, anchor='mm')
    tcx, tcy = cx, y0 + 90
    _fur_tuft(d, tcx, tcy, s=1.2)
    cr = 40
    d.ellipse([tcx - cr, tcy - cr + 2, tcx + cr, tcy + cr + 2], outline=RED, width=5)
    d.line([(tcx - 28, tcy - 24), (tcx + 28, tcy + 28)], fill=RED, width=5)


def _hang_in_there_poster(im):
    """HANG IN THERE poster: a cat floating in space, a paw on a little moon."""
    d = ImageDraw.Draw(im)
    cx, cy = 1100, 198
    w, h = 176, 210
    x0, y0 = cx - w // 2, cy - h // 2
    _rr(d, [x0, y0, x0 + w, y0 + h], radius=4, fill=CREAM, outline=DARK, width=3)
    ix0, iy0 = x0 + 10, y0 + 10
    ix1, iy1 = x0 + w - 10, y0 + h - 52
    star = Image.new('RGB', (ix1 - ix0, iy1 - iy0), NAVY)
    sd = ImageDraw.Draw(star)
    random.seed(7)
    ww, wh = star.size
    for _ in range(28):
        x, y = random.randint(3, ww - 4), random.randint(3, wh - 4)
        r = random.choice((1, 1, 2))
        sd.ellipse([x - r, y - r, x + r, y + r], fill=STAR)
    for x, y in ((16, 18), (ww - 20, 30), (ww // 2 + 20, 14), (22, wh - 18)):
        sd.ellipse([x - 2, y - 2, x + 2, y + 2], fill=STAR)
    mask = Image.new('L', star.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, ww - 1, wh - 1], radius=4, fill=255)
    im.paste(star, (ix0, iy0), mask)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([ix0, iy0, ix1, iy1], radius=4, outline=DARK, width=2)

    cat = Image.new('RGBA', (ix1 - ix0, iy1 - iy0), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cat)
    lcx, lcy = 66, 82  # cat body center
    # full moon, upper right, close enough for a paw to touch
    mx, my, mr = 108, 38, 20
    cd.ellipse([mx - mr, my - mr, mx + mr, my + mr], fill=(*YEL, 255), outline=(*DARK, 255), width=3)
    # two simple craters
    cd.ellipse([mx - 8, my - 4, mx - 1, my + 3], outline=(*ORANGED, 255), width=2)
    cd.ellipse([mx + 2, my + 2, mx + 10, my + 9], outline=(*ORANGED, 255), width=2)

    # tail
    tail = [
        (lcx - 20, lcy + 10),
        (lcx - 42, lcy + 0),
        (lcx - 46, lcy - 22),
        (lcx - 32, lcy - 12),
        (lcx - 24, lcy + 2),
    ]
    cd.polygon(tail, fill=(*ORANGE, 255))
    cd.line(tail + [tail[0]], fill=DARK, width=2)
    # body
    cd.ellipse([lcx - 20, lcy - 14, lcx + 20, lcy + 34],
               fill=(*ORANGE, 255), outline=(*DARK, 255), width=3)
    cd.ellipse([lcx - 10, lcy + 2, lcx + 10, lcy + 28], fill=(*CAT_CREAM, 255))
    # hind paws (floating)
    cd.ellipse([lcx - 20, lcy + 24, lcx - 4, lcy + 40],
               fill=(*ORANGE, 255), outline=(*DARK, 255), width=2)
    cd.ellipse([lcx + 2, lcy + 26, lcx + 18, lcy + 42],
               fill=(*ORANGE, 255), outline=(*DARK, 255), width=2)
    # front paw tucked on the belly
    cd.ellipse([lcx + 4, lcy + 6, lcx + 16, lcy + 18],
               fill=(*ORANGE, 255), outline=(*DARK, 255), width=2)
    # arm reaching up to the moon (polygon so it has an outline)
    arm = [
        (lcx + 10, lcy - 6),
        (lcx + 18, lcy + 2),
        (lcx + 34, lcy - 22),
        (lcx + 24, lcy - 28),
    ]
    cd.polygon(arm, fill=(*ORANGE, 255))
    cd.line(arm + [arm[0]], fill=DARK, width=2)
    # paw touching the moon
    cd.ellipse([lcx + 26, lcy - 36, lcx + 40, lcy - 22],
               fill=(*ORANGE, 255), outline=(*DARK, 255), width=2)
    # head
    hx, hy, hr = lcx - 2, lcy - 16, 16
    cd.ellipse([hx - hr, hy - hr, hx + hr, hy + hr],
               fill=(*ORANGE, 255), outline=(*DARK, 255), width=3)
    ear_l = [(hx - 14, hy - 6), (hx - 18, hy - 24), (hx - 2, hy - 14)]
    ear_r = [(hx + 4, hy - 14), (hx + 16, hy - 24), (hx + 14, hy - 6)]
    cd.polygon(ear_l, fill=(*ORANGE, 255))
    cd.line(ear_l + [ear_l[0]], fill=DARK, width=2)
    cd.polygon(ear_r, fill=(*ORANGE, 255))
    cd.line(ear_r + [ear_r[0]], fill=DARK, width=2)
    cd.polygon([(hx - 12, hy - 10), (hx - 14, hy - 18), (hx - 6, hy - 13)],
               fill=(*PINK_EAR, 255))
    cd.polygon([(hx + 6, hy - 13), (hx + 13, hy - 18), (hx + 11, hy - 10)],
               fill=(*PINK_EAR, 255))
    # face
    cd.ellipse([hx - 8, hy - 3, hx - 4, hy + 1], fill=(*DARK, 255))
    cd.ellipse([hx + 4, hy - 3, hx + 8, hy + 1], fill=(*DARK, 255))
    cd.ellipse([hx - 2, hy + 1, hx + 2, hy + 5], fill=(220, 110, 100, 255))
    cd.arc([hx - 5, hy + 2, hx + 5, hy + 10], 20, 160, fill=DARK, width=2)
    # body stripe
    cd.arc([lcx - 10, lcy + 2, lcx + 10, lcy + 16], 200, 340, fill=ORANGED, width=2)
    im.paste(cat, (ix0, iy0), cat)
    d = ImageDraw.Draw(im)
    d.text((cx, y0 + h - 28), "HANG IN", font=NB(16), fill=DARK, anchor='mm')
    d.text((cx, y0 + h - 12), "THERE", font=NB(16), fill=DARK, anchor='mm')
    return im


def _filing_cabinet(d):
    """Three-drawer cabinet on the left, in the floor band, against the side wall."""
    x0, y0, x1, y1 = 80, 430, 220, 660
    _rr(d, [x0, y0, x1, y1], radius=6, fill=DESK, outline=DARK, width=4)
    _rr(d, [x0 - 4, y0, x1 + 4, y0 + 16], radius=4, fill=DESK_TOP, outline=DARK, width=3)
    inner_top = y0 + 22
    inner_bot = y1 - 10
    dh = (inner_bot - inner_top) // 3
    for i in range(3):
        dy0 = inner_top + i * dh + 4
        dy1 = inner_top + (i + 1) * dh - 4
        _rr(d, [x0 + 10, dy0, x1 - 10, dy1], radius=4, fill=DESK_TOP, outline=DARK, width=3)
        hx = (x0 + x1) // 2
        hy = (dy0 + dy1) // 2
        _rr(d, [hx - 16, hy - 5, hx + 16, hy + 5], radius=3, fill=BEZEL, outline=DARK, width=2)


def _chair(d):
    """Office chair pulled out to the left of the desk, clearly visible."""
    cx, cy = 700, 600  # cy is the seat
    base_y = cy + 58
    for a in range(5):
        ang = math.radians(-90 + a * 72)
        x2 = cx + int(32 * math.cos(ang))
        y2 = base_y + int(11 * math.sin(ang))
        d.line([(cx, base_y), (x2, y2)], fill=DARK, width=4)
        d.ellipse([x2 - 6, y2 - 4, x2 + 6, y2 + 4], fill=BEZEL, outline=DARK, width=2)
    d.rectangle([cx - 5, cy + 16, cx + 5, base_y], fill=BEZEL, outline=DARK, width=2)
    # backrest first (behind the seat)
    _rr(d, [cx - 32, cy - 72, cx + 32, cy + 4], radius=10, fill=DESK, outline=DARK, width=3)
    # lumbar opening so it reads as a chair back, not a slab
    _rr(d, [cx - 15, cy - 50, cx + 15, cy - 18], radius=6, fill=FLOOR, outline=DARK, width=2)
    # seat
    _rr(d, [cx - 36, cy, cx + 36, cy + 20], radius=6, fill=DESK_TOP, outline=DARK, width=3)
    # armrests
    d.rectangle([cx - 42, cy - 8, cx - 32, cy + 8], fill=BEZEL, outline=DARK, width=2)
    d.rectangle([cx + 32, cy - 8, cx + 42, cy + 8], fill=BEZEL, outline=DARK, width=2)
    _rr(d, [cx - 46, cy - 14, cx - 28, cy - 4], radius=3, fill=DESK_TOP, outline=DARK, width=2)
    _rr(d, [cx + 28, cy - 14, cx + 46, cy - 4], radius=3, fill=DESK_TOP, outline=DARK, width=2)


def _lint_roller(d, x1, y_desk):
    """Giant lint roller lying on the desk: handle on the left, sticky roll on the right.

    x1 is the right end of the roll; the roller sits on y_desk.
    """
    # roll size is comically big for a desk lint roller
    roll_w, roll_h = 108, 36
    rx1 = x1
    rx0 = rx1 - roll_w
    cy = y_desk - roll_h // 2
    y0, y1 = cy - roll_h // 2, cy + roll_h // 2
    # handle to the left of the roll (razor / lint-roller grip)
    hx1 = rx0 + 6
    hx0 = hx1 - 52
    # grip
    _rr(d, [hx0, cy - 9, hx0 + 36, cy + 9], radius=5, fill=DESK, outline=DARK, width=3)
    # neck
    d.rectangle([hx0 + 32, cy - 5, hx1, cy + 5], fill=BEZEL, outline=DARK, width=3)
    # roll body (capsule)
    _rr(d, [rx0, y0, rx1, y1], radius=roll_h // 2, fill=(242, 242, 246), outline=DARK, width=3)
    # cardboard tube visible on the right end
    d.ellipse([rx1 - roll_h, y0, rx1, y1], fill=(230, 230, 236), outline=DARK, width=3)
    d.ellipse([rx1 - roll_h + 10, y0 + 10, rx1 - 10, y1 - 10],
              fill=(210, 198, 180), outline=DARK, width=2)
    # a few wrap lines on the roll
    for dx in (18, 36, 54):
        d.arc([rx0 + dx, y0 + 3, rx0 + dx + 16, y1 - 3], 250, 110,
              fill=(200, 200, 208), width=2)
    # peel corner of sticky paper, folded back
    peel = [(rx0 + 22, y0 + 1), (rx0 + 38, y0 + 1), (rx0 + 30, y0 - 9)]
    d.polygon(peel, fill=PAPER)
    d.line(peel + [peel[0]], fill=DARK, width=2)
    d.line([(rx0 + 20, y0 + 1), (rx0 + 42, y0 + 1)], fill=DARK, width=2)
    # fur wisps stuck to the OUTSIDE of the roll (the joke)
    # simple soft clumps — the fan tuft is too busy at this size
    d.ellipse([rx0 + 52, y0 - 2, rx0 + 68, y0 + 12], fill=FUR, outline=DARK, width=2)
    d.ellipse([rx0 + 56, y0, rx0 + 66, y0 + 10], fill=(138, 92, 58))
    d.ellipse([rx0 + 80, y1 - 8, rx0 + 94, y1 + 4], fill=FUR, outline=DARK, width=2)


def _in_out_tray(d, x0, y_desk):
    """Two trays side by side on the desk: IN (with papers) and OUT."""
    tw, th = 70, 18
    gap = 8
    # IN, left
    papers_bottom = y_desk - th
    # papers peeking out of IN
    d.rectangle([x0 + 8, papers_bottom - 14, x0 + tw - 8, papers_bottom + 2],
                fill=PAPER, outline=DARK, width=2)
    d.rectangle([x0 + 12, papers_bottom - 18, x0 + tw - 4, papers_bottom],
                fill=PAPER, outline=DARK, width=2)
    _rr(d, [x0, y_desk - th, x0 + tw, y_desk], radius=3,
        fill=DESK_TOP, outline=DARK, width=2)
    d.text((x0 + tw // 2, y_desk - th // 2), "IN", font=NB(12), fill=DARK, anchor='mm')
    # OUT, right
    ox0 = x0 + tw + gap
    _rr(d, [ox0, y_desk - th, ox0 + tw, y_desk], radius=3,
        fill=(196, 200, 210), outline=DARK, width=2)
    d.text((ox0 + tw // 2, y_desk - th // 2), "OUT", font=NB(12), fill=DARK, anchor='mm')


def _computer(d, desk_cx, top_y):
    """Same monitor language as office_room.py, blank screen (Moon Pie site later)."""
    wedge = [(desk_cx - 40, top_y), (desk_cx + 40, top_y),
             (desk_cx + 32, top_y - 12), (desk_cx - 32, top_y - 12)]
    d.polygon(wedge, fill=BEZEL, outline=DARK)
    d.line(wedge + [wedge[0]], fill=DARK, width=2)
    _rr(d, [desk_cx - 8, top_y - 40, desk_cx + 8, top_y - 10],
        radius=2, fill=BEZEL, outline=DARK, width=3)
    bw, bh = 190, 142
    bx0 = desk_cx - bw // 2
    by0 = top_y - 40 - bh
    _rr(d, [bx0, by0, bx0 + bw, by0 + bh], radius=8, fill=BEZEL, outline=DARK, width=4)
    _rr(d, [bx0 + 12, by0 + 12, bx0 + bw - 12, by0 + bh - 12],
        radius=5, fill=SCREEN_FILL, outline=DARK, width=2)
    d.ellipse([bx0 + bw - 22, by0 + bh - 18, bx0 + bw - 14, by0 + bh - 10], fill=GREEN)


def _desk(d):
    """Manager desk in the right-hand floor band, facing us (screen readable later)."""
    cx = 980
    top_y = 575
    top_w, top_h = 400, 20
    body_w, body_h = 368, 132
    x0 = cx - top_w // 2
    bx0 = cx - body_w // 2
    _rr(d, [bx0, top_y + 8, bx0 + body_w, top_y + 8 + body_h],
        radius=8, fill=DESK, outline=DARK, width=4)
    _rr(d, [x0, top_y, x0 + top_w, top_y + top_h],
        radius=5, fill=DESK_TOP, outline=DARK, width=3)
    plate_w, plate_h = 230, 32
    px0 = cx - plate_w // 2
    py0 = top_y + 8 + 48
    _rr(d, [px0, py0, px0 + plate_w, py0 + plate_h],
        radius=4, fill=PLATE, outline=DARK, width=2)
    d.text((cx, py0 + plate_h // 2), "Isfred Bar Neshuman",
           font=NB(16), fill='white', anchor='mm')
    # computer centered
    _computer(d, cx, top_y)
    # in/out trays on the left of the desktop (in front of the monitor's left edge)
    _in_out_tray(d, x0 + 10, top_y)
    # giant lint roller on the right of the desktop
    _lint_roller(d, x0 + top_w - 10, top_y)


def draw_office(im=None):
    """Room only (no characters)."""
    if im is None:
        im = Image.new('RGB', (W, H), OUT)
    d = ImageDraw.Draw(im)
    _walls(d)
    _security_monitors(d)
    _office_door(d)
    _no_fur_sign(d)
    im = _hang_in_there_poster(im)
    d = ImageDraw.Draw(im)
    _filing_cabinet(d)
    _chair(d)
    _desk(d)
    return finish_office(im)


def finish_office(im):
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([L, T, R, B], radius=24, outline=DARK, width=BW)
    return im


def draw_comparison():
    """LOCKED office-room-empty-v1 on the left, this proposal on the right."""
    left = Image.open(os.path.join(os.path.dirname(MOCKUPS), 'LOCKED',
                                   'office-room-empty-v1.png')).convert('RGB')
    right = draw_office()
    gap = 40
    cap = 50
    out = Image.new('RGB', (left.width + right.width + gap + 80, H + cap + 40), OUT)
    od = ImageDraw.Draw(out)
    out.paste(left, (40, 20))
    out.paste(right, (40 + left.width + gap, 20))
    od.text((40 + left.width // 2, H + 28), "LOCKED  office-room-empty-v1",
            font=NB(18), fill=DARK, anchor='mm')
    od.text((40 + left.width + gap + right.width // 2, H + 28), "proposal  office-room-v2",
            font=NB(18), fill=DARK, anchor='mm')
    return out


if __name__ == '__main__':
    os.chdir(MOCKUPS)
    im = draw_office()
    path = os.path.join(MOCKUPS, 'office-room-v2.png')
    im.save(path)
    cmp_path = os.path.join(MOCKUPS, 'office-v1-vs-v2.png')
    draw_comparison().save(cmp_path)
    print('wrote', path, im.size, im.mode)
    print('wrote', cmp_path)
