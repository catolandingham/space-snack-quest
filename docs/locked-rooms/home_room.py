"""Shared HOME ROOM drawing (Squatch & Mops's room below the hall).

ONE source for the home room. Every home panel imports from here; panels add
only characters and props. Do not redraw the room in a panel.
Locked reference: /workspace/ssq/LOCKED/home-room-empty-*-v*.png
Layout = the game's own home, src/game/60-frame-draw.js P2() (lines 532-645),
helpers H2/L2/cq/Xn/Ef/rq, one uniform scale (R29, R30). Only addition: the
wardrobe at the FAR LEFT against the back wall (R30), DELIVERY / Moon Pie
calendar on its door only when it's closed (R31, R34), closed early and open
from the disguise on (R32). No mop (R33, C2). STAY IN HERE poster on the wall
beside the door out (R35). The door out is a cut in the RIGHT wall, no door
slab (R36). No vent in the home (R37, supersedes S60).
Changing anything here changes every home panel: only on Brian's explicit
request, then re-lock with a new version (docs/FIDELITY.md).
R45 (11-09): the open-wardrobe spare is a plain blue jacket (no JANITOR label).
Default spare style is 'plain_jacket'. Pass spare='janitor_v3' to reproduce the
APPROVED v3 wardrobe pixel-for-pixel (JANITOR patch still drawn).

Use:
    im = draw_home(im=None, wardrobe='closed'|'open'|'open_empty')
    ... panel: characters / props ...
    im = finish_home(im)      # frame + right-wall doorway on top
"""
from PIL import Image, ImageDraw, ImageFont
import os

MOCKUPS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1280, 830
OUT = (226, 229, 237)
WALL = (244, 241, 234)
FLOOR = (234, 229, 218)
LINE = (200, 197, 190)
DARK = (34, 36, 44)
BLUE = (77, 141, 228)
BLUED = (55, 110, 190)
WOOD = (196, 166, 126)
WOODD = (170, 140, 100)
FUR = (110, 72, 44)
WHITE = (250, 250, 252)
HORN = (210, 170, 110)
GRAY = (150, 156, 170)
PURPLE = (123, 63, 228)
YEL = (244, 196, 48)
BUCKET = (255, 207, 51)
CRATE = (217, 163, 91)
CRATED = (169, 116, 58)
PILLOW = (169, 139, 255)

G = '/usr/share/fonts/truetype/sand-box/google/'

def NB(s):
    f = ImageFont.truetype(G + 'Nunito/Nunito-VariableFont_wght.ttf', s)
    try:
        f.set_variation_by_name('ExtraBold')
    except Exception:
        pass
    return f

def KL(s):
    return ImageFont.truetype(G + 'Kalam/Kalam-Bold.ttf', s)


def janitor_patch(draw, cx, cy, max_w=None, prefer=12, pad_x=6, pad_y=3):
    label = 'JANITOR'
    size = prefer
    while size >= 7:
        f = NB(size)
        bb = f.getbbox(label)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
        need = tw + pad_x * 2
        if max_w is None or need <= max_w:
            break
        size -= 1
    else:
        f = NB(7)
        bb = f.getbbox(label)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
        need = tw + pad_x * 2
    pw = need if max_w is None else min(max(need, tw + pad_x * 2), max_w)
    if pw < tw + pad_x * 2:
        pw = tw + pad_x * 2
    ph = th + pad_y * 2 + 2
    x0 = int(cx - pw / 2)
    y0 = int(cy - ph / 2)
    draw.rounded_rectangle([x0, y0, x0 + pw, y0 + ph], radius=3, fill='white', outline=DARK, width=2)
    draw.text((cx, cy), label, font=f, fill=DARK, anchor='mm')
    return pw, ph


# ---------- coordinate map from game P2() — UNIFORM scale ----------
# Game room: m(60, 90, 840, 500), floor at y=360. Sketch frame L,T,R,B = 40,60,1240,800.
# One scale for X and Y so object sizes match the game screenshot.

S = 1200 / 840.0  # ≈ 1.4286; room height maps to 714 → bottom at 774

def mx(gx):
    return int(round(40 + (gx - 60) * S))

def my(gy):
    return int(round(60 + (gy - 90) * S))

def ms(v):
    return max(1, int(round(v * S)))

FLOOR_Y = my(360)  # ≈ 446 — back-wall / floor line


# ---------- Moon Pie badge (rq) + calendar + stay sign ----------

def draw_moon_pies_badge(d, cx, cy, scale=1.0):
    w = int(124 * scale); h = int(30 * scale)
    d.rounded_rectangle([cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2],
                        radius=max(4, int(15 * scale)), fill=(43, 58, 103), outline=DARK, width=max(2, int(3 * scale)))
    pie_r = max(3, int(10 * scale))
    d.ellipse([cx - int(47 * scale) - pie_r, cy - pie_r,
               cx - int(47 * scale) + pie_r, cy + pie_r],
              fill=(139, 90, 60), outline=DARK, width=2)
    d.arc([cx - int(56 * scale), cy - int(8 * scale),
           cx - int(38 * scale), cy + int(8 * scale)],
          -40, 140, fill=(255, 243, 214), width=max(2, int(2.5 * scale)))
    mr = max(3, int(6 * scale))
    d.ellipse([cx + int(50 * scale) - mr, cy - int(3 * scale) - mr,
               cx + int(50 * scale) + mr, cy - int(3 * scale) + mr],
              fill=YEL, outline=DARK, width=2)
    d.ellipse([cx + int(53 * scale) - int(5 * scale), cy - int(5 * scale) - int(5 * scale),
               cx + int(53 * scale) + int(5 * scale), cy - int(5 * scale) + int(5 * scale)],
              fill=(43, 58, 103))
    f = NB(max(7, int(14 * scale)))
    d.text((cx + int(1 * scale), cy + int(1 * scale)), 'MOON PIES', font=f, fill=YEL, anchor='mm')


def draw_calendar(d, cx, cy, scale=1.0):
    """v4 calendar (game size m(170,168,60,70)): red pin, red top strip, a 5 x 4 grid of days,
    and one day circled in red with a tiny Moon Pie: the delivery day. No words.
    The v4 PNG was made by painting this design over the v3 calendar (same spot, same size)."""
    pw = int(60 * scale); ph = int(70 * scale)
    x0, y0 = cx - pw // 2, cy - ph // 2
    d.rounded_rectangle([x0, y0, x0 + pw, y0 + ph], radius=max(2, int(3 * scale)),
                        fill=(255, 250, 240), outline=DARK, width=max(2, int(2.5 * scale)))
    pr = max(2, int(4 * scale))
    d.ellipse([cx - pr, y0 + int(6 * scale) - pr, cx + pr, y0 + int(6 * scale) + pr],
              fill=(229, 83, 61))
    top = y0 + int(13 * scale)
    d.rectangle([x0 + int(4 * scale), top, x0 + pw - int(4 * scale), top + int(8 * scale)], fill=(229, 83, 61))
    gx0, gy0 = x0 + int(5 * scale), top + int(12 * scale)
    gx1, gy1 = x0 + pw - int(5 * scale), y0 + ph - int(5 * scale)
    for i in range(6):
        x = gx0 + (gx1 - gx0) * i // 5
        d.line([(x, gy0), (x, gy1)], fill=GRAY, width=1)
    for j in range(5):
        y = gy0 + (gy1 - gy0) * j // 4
        d.line([(gx0, y), (gx1, y)], fill=GRAY, width=1)
    dx = gx0 + (gx1 - gx0) * 7 // 10; dy = gy0 + (gy1 - gy0) * 5 // 8
    r = max(2, int(4 * scale))
    d.ellipse([dx - r, dy - r, dx + r, dy + r], fill=(139, 90, 60), outline=DARK, width=1)
    R = max(4, int(7 * scale))
    d.ellipse([dx - R, dy - R, dx + R, dy + R], outline=(229, 83, 61), width=2)


def draw_stay_sign(d, cx, cy, scale=1.0):
    w = int(76 * scale); h = int(74 * scale)
    x0, y0 = cx - w // 2, cy - h // 2
    d.rounded_rectangle([x0, y0, x0 + w, y0 + h], radius=3,
                        fill=(255, 253, 243), outline=DARK, width=max(2, int(2.5 * scale)))
    f1 = NB(max(8, int(13 * scale)))
    f2 = NB(max(9, int(15 * scale)))
    f3 = NB(max(7, int(10 * scale)))
    d.text((cx, y0 + int(16 * scale)), 'STAY IN', font=f1, fill=(229, 83, 61), anchor='mm')
    d.text((cx, y0 + int(32 * scale)), 'HERE!', font=f2, fill=(229, 83, 61), anchor='mm')
    d.text((cx, y0 + int(48 * scale)), '— Mops', font=f3, fill=(52, 120, 246), anchor='mm')
    d.ellipse([cx - int(10 * scale), y0 + h - int(18 * scale),
               cx + int(4 * scale), y0 + h - int(8 * scale)], outline=(43, 138, 94), width=2)
    d.ellipse([cx + int(2 * scale), y0 + h - int(22 * scale),
               cx + int(12 * scale), y0 + h - int(12 * scale)], outline=(43, 138, 94), width=2)


# ---------- wardrobe (back wall, far left, furniture-sized) ----------

def hang_item(d, cx, top, kind, sc=1.0, spare_style='plain_jacket'):
    """Small hangers + kits scaled to furniture wardrobe.
    spare_style: 'plain_jacket' (R45) or 'janitor_v3' (APPROVED v3 repro)."""
    hx = int(10 * sc); hy = int(16 * sc)
    d.arc([cx - hx, top - hy, cx + hx, top + int(4 * sc)], 200, 340, fill=DARK, width=max(2, int(3 * sc)))
    arm = int(22 * sc)
    d.line([(cx - arm, top + int(5 * sc)), (cx + arm, top + int(5 * sc))], fill=DARK, width=max(2, int(3 * sc)))
    d.line([(cx - arm, top + int(5 * sc)), (cx - int(5 * sc), top + int(16 * sc))], fill=DARK, width=max(2, int(2 * sc)))
    d.line([(cx + arm, top + int(5 * sc)), (cx + int(5 * sc), top + int(16 * sc))], fill=DARK, width=max(2, int(2 * sc)))
    if kind == 'tourist':
        d.rounded_rectangle([cx - int(28 * sc), top + int(16 * sc), cx + int(28 * sc), top + int(90 * sc)],
                            radius=max(4, int(8 * sc)), fill=(80, 180, 150), outline=DARK, width=max(2, int(3 * sc)))
        for (ox, oy) in [(-12, 30), (8, 42), (-6, 58), (12, 70)]:
            r = max(3, int(5 * sc))
            d.ellipse([cx + int(ox * sc) - r, top + int(oy * sc) - r,
                       cx + int(ox * sc) + r, top + int(oy * sc) + r], fill=(240, 200, 80))
        d.rounded_rectangle([cx - int(22 * sc), top + int(82 * sc), cx + int(22 * sc), top + int(112 * sc)],
                            radius=4, fill=(60, 90, 160), outline=DARK, width=max(2, int(3 * sc)))
    elif kind == 'goat':
        TAPE = (255, 230, 90)
        d.rounded_rectangle([cx - int(26 * sc), top + int(18 * sc), cx + int(26 * sc), top + int(32 * sc)],
                            radius=4, fill=(230, 210, 170), outline=DARK, width=max(2, int(3 * sc)))
        lh = [(cx - int(4 * sc), top + int(24 * sc)), (cx - int(18 * sc), top + int(14 * sc)),
              (cx - int(32 * sc), top + int(6 * sc)), (cx - int(38 * sc), top + int(0 * sc)),
              (cx - int(28 * sc), top - int(2 * sc)), (cx - int(18 * sc), top + int(8 * sc)),
              (cx - int(8 * sc), top + int(18 * sc))]
        d.polygon(lh, fill=HORN); d.line(lh + [lh[0]], fill=DARK, width=max(2, int(3 * sc)))
        rh = [(cx + int(4 * sc), top + int(24 * sc)), (cx + int(18 * sc), top + int(14 * sc)),
              (cx + int(32 * sc), top + int(6 * sc)), (cx + int(38 * sc), top + int(0 * sc)),
              (cx + int(28 * sc), top - int(2 * sc)), (cx + int(18 * sc), top + int(8 * sc)),
              (cx + int(8 * sc), top + int(18 * sc))]
        d.polygon(rh, fill=HORN); d.line(rh + [rh[0]], fill=DARK, width=max(2, int(3 * sc)))
        d.rounded_rectangle([cx - int(24 * sc), top + int(20 * sc), cx - int(4 * sc), top + int(30 * sc)],
                            radius=2, fill=TAPE, outline=DARK, width=2)
        d.rounded_rectangle([cx + int(4 * sc), top + int(20 * sc), cx + int(24 * sc), top + int(30 * sc)],
                            radius=2, fill=TAPE, outline=DARK, width=2)
        d.rounded_rectangle([cx - int(18 * sc), top + int(40 * sc), cx + int(18 * sc), top + int(82 * sc)],
                            radius=5, fill=(236, 230, 218), outline=DARK, width=max(2, int(3 * sc)))
        tuft = [(cx, top + int(46 * sc)), (cx + int(8 * sc), top + int(52 * sc)),
                (cx + int(6 * sc), top + int(70 * sc)), (cx, top + int(76 * sc)),
                (cx - int(6 * sc), top + int(70 * sc)), (cx - int(8 * sc), top + int(52 * sc))]
        d.polygon(tuft, fill=WHITE); d.line(tuft + [tuft[0]], fill=DARK, width=2)
    elif kind == 'spare_shirt':
        # Same blue jacket silhouette either style; only the chest label differs.
        # spare_style 'plain_jacket' (R45 default) = no JANITOR text.
        # spare_style 'janitor_v3' = APPROVED v3 look (JANITOR patch).
        d.rounded_rectangle([cx - int(28 * sc), top + int(16 * sc), cx + int(28 * sc), top + int(95 * sc)],
                            radius=6, fill=BLUE, outline=DARK, width=max(2, int(3 * sc)))
        d.polygon([(cx - int(14 * sc), top + int(18 * sc)), (cx, top + int(32 * sc)),
                   (cx + int(14 * sc), top + int(18 * sc))], outline=DARK, fill=BLUED)
        d.rounded_rectangle([cx + int(6 * sc), top + int(48 * sc), cx + int(20 * sc), top + int(62 * sc)],
                            radius=2, fill=BLUED, outline=DARK, width=2)
        if spare_style == 'janitor_v3':
            janitor_patch(d, cx - int(6 * sc), top + int(48 * sc), max_w=None,
                          prefer=max(7, int(9 * sc)), pad_x=4, pad_y=1)
        else:
            # plain jacket: small blank name-patch shape, no letters (R45)
            npw = max(14, int(18 * sc)); nph = max(8, int(10 * sc))
            d.rounded_rectangle([cx - int(6 * sc) - npw // 2, top + int(48 * sc) - nph // 2,
                                 cx - int(6 * sc) + npw // 2, top + int(48 * sc) + nph // 2],
                                radius=2, fill='white', outline=DARK, width=2)
        d.rounded_rectangle([cx - int(40 * sc), top + int(26 * sc), cx - int(28 * sc), top + int(58 * sc)],
                            radius=4, fill=BLUE, outline=DARK, width=2)
        d.rounded_rectangle([cx + int(28 * sc), top + int(26 * sc), cx + int(40 * sc), top + int(58 * sc)],
                            radius=4, fill=BLUE, outline=DARK, width=2)
    elif kind == 'empty':
        # obvious bare slot: ghost shirt outline under the hanger
        d.rounded_rectangle([cx - int(24 * sc), top + int(18 * sc), cx + int(24 * sc), top + int(88 * sc)],
                            radius=5, outline=(150, 156, 170), width=max(2, int(3 * sc)))
        d.line([(cx - int(14 * sc), top + int(40 * sc)), (cx + int(14 * sc), top + int(40 * sc))],
               fill=(150, 156, 170), width=2)
        d.line([(cx - int(14 * sc), top + int(58 * sc)), (cx + int(14 * sc), top + int(58 * sc))],
               fill=(150, 156, 170), width=2)


def draw_wardrobe(d, open_=True, shirt_in=True, spare_style='plain_jacket'):
    """Furniture-sized wardrobe against the BACK WALL at the far left.
    Base sits on the floor line (like the desk). A bit taller than Mops.
    Calendar hangs on the door at game calendar size (scale S).
    When open, the door swings RIGHT into the room (never past the left wall).
    spare_style: 'plain_jacket' (R45 default) or 'janitor_v3' (APPROVED v3)."""
    wx0 = mx(65)
    wx1 = mx(185)          # ~120 game units wide
    wh = ms(135)
    wy1 = FLOOR_Y
    wy0 = wy1 - wh
    WOOD_FACE = (210, 190, 155)
    WOOD_IN = (232, 226, 214)
    WOOD_IN_DK = (220, 214, 200)
    kit_sc = 0.92

    d.rounded_rectangle([wx0, wy0, wx1, wy1], radius=6, fill=WOOD_IN, outline=DARK, width=4)

    if open_:
        d.rectangle([wx0 + 4, wy0 + 4, wx1 - 4, wy1 - 4], fill=WOOD_IN_DK)
        # rail + three hangers fully visible inside the cabinet
        d.line([(wx0 + 14, wy0 + 18), (wx1 - 14, wy0 + 18)], fill=DARK, width=4)
        hang_item(d, wx0 + (wx1 - wx0) // 4, wy0 + 22, 'tourist', sc=kit_sc)
        hang_item(d, (wx0 + wx1) // 2, wy0 + 22, 'goat', sc=kit_sc)
        hang_item(d, wx0 + 3 * (wx1 - wx0) // 4, wy0 + 22,
                  'spare_shirt' if shirt_in else 'empty', sc=kit_sc,
                  spare_style=spare_style)
        # left door folded back as a thin strip INSIDE the left edge
        d.rounded_rectangle([wx0 + 3, wy0 + 5, wx0 + ms(12), wy1 - 5], radius=2,
                            fill=WOOD_FACE, outline=DARK, width=2)
        # right door swung OPEN into the room — edge-on / from the BACK
        # (calendar face is away from us; only a plain door back + maybe a sliver of the edge)
        od0 = wx1 - 2
        od1 = od0 + ms(16)   # narrow: door seen nearly edge-on
        DOOR_BACK = (198, 180, 148)
        d.rounded_rectangle([od0, wy0 + 4, od1, wy1 - 4], radius=3,
                            fill=DOOR_BACK, outline=DARK, width=3)
        # thickness / leading edge of the door
        d.rectangle([od0, wy0 + 4, od0 + 4, wy1 - 4], fill=WOOD_FACE, outline=DARK, width=2)
        # tiny yellow handle nub on the edge
        d.ellipse([od0 + 1, (wy0 + wy1) // 2 - 4, od0 + 9, (wy0 + wy1) // 2 + 4],
                  fill=YEL, outline=DARK, width=2)
        # sliver of the calendar paper peeking at the far edge (not face-on)
        d.rectangle([od1 - 3, wy0 + ms(28), od1 - 1, wy0 + ms(28) + ms(50)],
                    fill=(255, 250, 240), outline=DARK, width=1)
    else:
        mid = (wx0 + wx1) // 2
        d.rounded_rectangle([wx0 + 3, wy0 + 4, mid - 1, wy1 - 4], radius=4,
                            fill=WOOD_FACE, outline=DARK, width=3)
        d.rounded_rectangle([mid + 1, wy0 + 4, wx1 - 3, wy1 - 4], radius=4,
                            fill=WOOD_FACE, outline=DARK, width=3)
        cy = (wy0 + wy1) // 2
        d.ellipse([mid - 12, cy - 5, mid - 4, cy + 5], fill=YEL, outline=DARK, width=2)
        d.ellipse([mid + 4, cy - 5, mid + 12, cy + 5], fill=YEL, outline=DARK, width=2)
        draw_calendar(d, (mid + wx1) // 2, wy0 + ms(40), scale=S)

    return wx0, wy0, wx1, wy1


# ---------- room objects from P2(), uniform scale ----------

def draw_desk(d):
    sx0, sy0 = mx(408), my(300)
    sw_, sh_ = ms(104), max(8, ms(12))
    d.rounded_rectangle([sx0, sy0, sx0 + sw_, sy0 + sh_], radius=3,
                        fill=(205, 187, 152), outline=DARK, width=3)
    # blue tin
    tx0, ty0 = mx(448), my(276)
    tw_, th_ = ms(30), max(10, ms(22))
    d.rounded_rectangle([tx0, ty0, tx0 + tw_, ty0 + th_], radius=3,
                        fill=(52, 120, 246), outline=DARK, width=2)
    d.rounded_rectangle([tx0 - 3, ty0 - 5, tx0 + tw_ + 3, ty0 + 3], radius=2,
                        fill=(43, 95, 196), outline=DARK, width=2)
    # papers
    for i in range(5):
        px, py = mx(416 + i), my(290 - i * 3.2)
        d.rounded_rectangle([px, py, px + ms(40), py + max(6, ms(10))],
                            radius=2, fill='white', outline=DARK, width=1)
    # legs to floor line
    d.line([(mx(418), sy0 + sh_), (mx(418), FLOOR_Y)], fill=DARK, width=3)
    d.line([(mx(502), sy0 + sh_), (mx(502), FLOOR_Y)], fill=DARK, width=3)
    # stool
    st_cx, st_cy = mx(462), my(350)
    d.ellipse([st_cx - ms(16), st_cy - ms(7), st_cx + ms(16), st_cy + ms(7)],
              fill=(201, 206, 216), outline=DARK, width=2)
    d.rounded_rectangle([mx(446), my(338), mx(446) + ms(32), my(338) + max(6, ms(12))],
                        radius=2, fill=(223, 228, 234), outline=DARK, width=2)


def draw_tv(d):
    sx0, sy0 = mx(540), my(250)
    d.rounded_rectangle([sx0, sy0, sx0 + ms(150), sy0 + max(8, ms(14))], radius=3,
                        fill=(205, 187, 152), outline=DARK, width=3)
    tvx0, tvy0 = mx(560), my(170)
    tvw, tvh = ms(110), ms(80)
    d.rounded_rectangle([tvx0, tvy0, tvx0 + tvw, tvy0 + tvh], radius=6, fill=DARK, outline=DARK, width=2)
    d.rounded_rectangle([tvx0 + 8, tvy0 + 8, tvx0 + tvw - 8, tvy0 + tvh - 12],
                        radius=3, fill=(89, 101, 125))


# Door out = an OPENING CUT INTO THE RIGHT WALL (R36), like every doorway in
# the newer room style (same technique as the delivery room's left-wall cut).
# No door slab, no knob. Opening sits on the floor band just below the
# back-wall line, about the game door's width (ms(90)).
DOOR_Y0 = FLOOR_Y + 24
DOOR_Y1 = DOOR_Y0 + ms(90)


def draw_stay_poster(d):
    """STAY IN HERE poster on the back wall right beside the door opening (R35, R36)."""
    sign_w = ms(76)
    draw_stay_sign(d, R - BW - ms(10) - sign_w // 2, my(305), scale=S)


def cut_right_doorway(d):
    d.rectangle([R - BW - 1, DOOR_Y0, R + 2, DOOR_Y1], fill=FLOOR)
    d.rectangle([R + 1, DOOR_Y0, R + 12, DOOR_Y1], fill=OUT)
    for y in (DOOR_Y0, DOOR_Y1):
        d.line([(R - BW, y), (R + 1, y)], fill=DARK, width=4)


def draw_bed_crate(d):
    """Moon Pies crate bed against LEFT wall at floor level. Game Xn(110,420,190,106)."""
    bx0, by0 = mx(110), my(420)
    bw, bh = ms(190), ms(106)
    d.rounded_rectangle([bx0, by0, bx0 + bw, by0 + bh], radius=4, fill=CRATE, outline=DARK, width=4)
    for a in (1, 2, 3):
        yy = by0 + a * bh // 4
        d.line([(bx0 + 6, yy), (bx0 + bw - 6, yy)], fill=CRATED, width=2)
    d.line([(bx0 + 10, by0 + 10), (bx0 + bw - 10, by0 + bh - 10)], fill=(120, 80, 40), width=3)
    d.line([(bx0 + 10, by0 + bh - 10), (bx0 + bw - 10, by0 + 10)], fill=(120, 80, 40), width=3)
    d.rectangle([bx0, by0, bx0 + ms(12), by0 + bh], fill=(185, 185, 185), outline=DARK, width=2)
    d.rectangle([bx0 + bw - ms(12), by0, bx0 + bw, by0 + bh], fill=(185, 185, 185), outline=DARK, width=2)
    draw_moon_pies_badge(d, bx0 + bw // 2, by0 + int(bh * 0.42), scale=0.55 * S)
    # Label text in Nunito (which has no ↑ glyph): draw the up-arrow as a shape
    # instead of a missing-glyph box (v2 fix, Nov 8 ~10:15 PM PT; layout unchanged).
    f_frag = NB(max(7, ms(8)))
    lab, red = 'FRAGILE · THIS SIDE UP', (122, 46, 29)
    ty = by0 + bh - ms(12)
    tw = int(d.textlength(lab, font=f_frag))
    aw, gap = ms(7), ms(3)
    tx0 = bx0 + bw // 2 - (tw + gap + aw) // 2
    d.text((tx0, ty), lab, font=f_frag, fill=red, anchor='lm')
    ax = tx0 + tw + gap + aw // 2
    ah = ms(9)
    d.polygon([(ax, ty - ah // 2), (ax - aw // 2, ty - ah // 2 + aw // 2 + 1), (ax + aw // 2, ty - ah // 2 + aw // 2 + 1)], fill=red)
    d.line([(ax, ty - ah // 2 + 2), (ax, ty + ah // 2)], fill=red, width=max(2, ms(2)))
    # purple pillow (H2)
    d.rounded_rectangle([mx(120), my(410), mx(120) + ms(170), my(410) + ms(34)],
                        radius=10, fill=PILLOW, outline=DARK, width=3)
    # legs
    d.rounded_rectangle([mx(112), my(524), mx(112) + ms(16), my(524) + ms(18)],
                        radius=2, fill=(201, 138, 58), outline=DARK, width=2)
    d.rounded_rectangle([mx(282), my(524), mx(282) + ms(16), my(524) + ms(18)],
                        radius=2, fill=(201, 138, 58), outline=DARK, width=2)
    d.rectangle([mx(128), my(524), mx(128) + ms(154), my(524) + ms(18)], fill=(45, 50, 62))


def draw_gbox(d):
    gx0, gy0 = mx(318), my(478)
    gw, gh = ms(64), ms(44)
    d.rounded_rectangle([gx0, gy0, gx0 + gw, gy0 + gh], radius=4,
                        fill=(52, 120, 246), outline=DARK, width=3)
    d.text((gx0 + gw // 2, gy0 + gh // 2 + 1), 'G', font=NB(max(12, ms(18))), fill='white', anchor='mm')


def draw_bucket(d):
    """cq() yellow mop bucket — small, middle of floor."""
    # Game trapezoid ~522–598 x 512–566
    x0, y0 = mx(532), my(512)
    x1, y1 = mx(588), my(566)
    d.polygon([(x0 + 6, y0), (x1 - 6, y0), (x1, y1), (x0, y1)], fill=BUCKET)
    d.line([(x0 + 6, y0), (x1 - 6, y0), (x1, y1), (x0, y1), (x0 + 6, y0)], fill=DARK, width=3)
    d.rounded_rectangle([x0 + 10, y0 - ms(10), x1 - 10, y0 + ms(6)], radius=3,
                        fill=(143, 220, 255), outline=DARK, width=2)
    d.ellipse([x0 + ms(14), y0 + 2, x0 + ms(28), y0 + ms(12)], fill='white', outline=DARK, width=2)


# ---------- the room ----------

L, T, R, B = 40, 60, 1240, 800
BW = 7
WARDROBE_STATES = ('closed', 'open', 'open_empty')


SPARE_STYLES = ('plain_jacket', 'janitor_v3')  # R45 default; janitor_v3 = APPROVED v3 repro


def draw_home(im=None, wardrobe='closed', spare='plain_jacket'):
    """Room only. wardrobe: 'closed' (default, early scenes), 'open' (kits + spare
    blue jacket per R45), 'open_empty' (hanger empty: Squatch is wearing it).
    spare: 'plain_jacket' (R45, default) or 'janitor_v3' (pixel-match APPROVED v3)."""
    assert wardrobe in WARDROBE_STATES
    assert spare in SPARE_STYLES, spare
    if im is None:
        im = Image.new('RGB', (W, H), OUT)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([L, T, R, B], radius=24, fill=FLOOR)
    d.rectangle([L + 4, T + 4, R - 4, FLOOR_Y], fill=WALL)
    d.rounded_rectangle([L + 2, T + 2, R - 2, FLOOR_Y + 8], radius=22, fill=WALL)
    d.rectangle([L + 2, FLOOR_Y - 20, R - 2, FLOOR_Y], fill=WALL)
    d.line([(L + 4, FLOOR_Y), (R - 4, FLOOR_Y)], fill=LINE, width=3)
    draw_wardrobe(d, open_=(wardrobe != 'closed'), shirt_in=(wardrobe != 'open_empty'),
                  spare_style=spare)
    draw_desk(d)
    draw_tv(d)
    draw_stay_poster(d)
    draw_bed_crate(d)
    draw_gbox(d)
    draw_bucket(d)
    # no floor vent and no red line in the home (R37); no mop (R33)
    return finish_home(im)


def finish_home(im):
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([L, T, R, B], radius=24, outline=DARK, width=BW)
    cut_right_doorway(d)
    return im


if __name__ == '__main__':
    os.chdir(MOCKUPS)
    for w in WARDROBE_STATES:
        draw_home(wardrobe=w).save(f'/tmp/home-room-empty-{w}.png')
