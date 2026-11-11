"""Shared DELIVERY ROOM drawing (Space Snack Quest sketches).

ONE source for the delivery room. Every delivery-room panel imports from here;
panels add only characters and props. Do not redraw the room in a panel.
Locked reference: /workspace/ssq/LOCKED/delivery-room-empty-*-v1.png
Decisions: R14 (wall vent under speaker), R15 (scanner arch only when a ship is
docked), R17 (mail room, no label), R18 (partial wall, opening toward manager),
R19/R20 (mail room empty until pickup day), R21 (robot mailbox in every panel),
R12 (floor vent swirls curl inward), R11 (speaker / FUR alarm on walls).
Changing anything here changes every panel: only on Brian's explicit request,
then re-lock with a new version (docs/FIDELITY.md).

Draw order used by every panel (keeps output pixel-identical to the
pre-refactor scripts):
    im = draw_delivery_back(im, ship_docked=..., mail_room_contents=...)
    ... panel: things that stand BEHIND the arch (ramp robots) ...
    im = draw_delivery_front(im, ship_docked=..., squatch_in_plant=...)  # wall vent, arch, plant + bin
    ... panel: characters / props ...
    im = apply_night(im)                             # night panels only
    ... panel: lit things (flashlights, night robots, bubbles) ...
    im = finish_delivery(im, time)                   # frame + left doorway on top
Room only:  im = draw_delivery(time='day'|'night', ship_docked=..., mail_room_contents=...)
"""
import math, os, random, sys
from PIL import Image, ImageDraw, ImageFont

MOCKUPS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if MOCKUPS not in sys.path:
    sys.path.insert(0, MOCKUPS)
from peek_eyes import paste_plant_hide  # game plant Xp() (+ ga() eyes), C21

DEJAVU_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
NUNITO = '/usr/share/fonts/truetype/sand-box/google/Nunito/Nunito-VariableFont_wght.ttf'


def NB(size):
    """Nunito ExtraBold: the sketch font for bubbles and labels (R3)."""
    f = ImageFont.truetype(NUNITO, size)
    try:
        f.set_variation_by_name('ExtraBold')
    except Exception:
        pass
    return f

W, H = 1280, 830
OUT = (226, 229, 237)
WALL = (244, 241, 234)
FLOOR = (234, 229, 218)
LINE = (200, 197, 190)
DARK = (34, 36, 44)
YEL = (244, 196, 48)
AIR = (120, 170, 220)
NAVY = (50, 56, 96)
SHIP = (196, 200, 210)
SHIPD = (150, 156, 170)
PORT = (120, 170, 220)
CRATE = (206, 176, 136)
CRATED = (170, 140, 100)
BAG = (150, 130, 100)
BAGD = (120, 100, 75)
SC = (120, 170, 220)
L, T, R, B = 40, 60, 1240, 800
BW = 7

# window
wx0, wy0, wx1, wy1 = 180, 88, 1060, 298
ww, wh = wx1 - wx0, wy1 - wy0
sx0, sy0, sx1, sy1 = 210, 18, ww - 210, wh - 8
door_cx = (sx0 + sx1) // 2
dx0, dy0, dx1, dy1 = door_cx - 36, sy1 - 52, door_cx + 36, sy1 - 4
# ramp
ramp_top_y = wy0 + dy1 - 2
ramp_bot_y = 520
rt_l, rt_r = wx0 + door_cx - 40, wx0 + door_cx + 40
rb_l, rb_r = wx0 + door_cx - 130, wx0 + door_cx + 130
# scanner arch
ax0, ax1, atop, abot = rb_l - 26, rb_r + 26, ramp_bot_y - 120, ramp_bot_y + 12
# left doorway (wall cut) toward the hall
DOOR_Y0, DOOR_Y1 = 350, 455
# mail room (partial wall, opening faces the manager)
PW = 12
MX0, MY0 = 910, 465
MX1, MY1 = R - BW, B - BW
OPEN_Y0, OPEN_Y1 = 545, 655
# robot mailbox
MBX = (1130, 505, 1210, 615)
mx0, my0, mx1, my1 = MBX
# big crawl wall vent under the speaker
vx0, vy0, vx1, vy1 = 1068, 236, 1202, 334
# floor vent
FVX, FVY = 220, 700
# the ONE hide plant (game plant, C21) and the ONE bin beside it (S27: "the bin by
# the plant"). Same spot in every delivery panel (v2, Nov 8 ~10:15 PM PT; was
# drifting between x 167/270/337/351 and two bin designs).
PLANT_CX, PLANT_BOTTOM, PLANT_H = 167, 480, 150
BIN = (255, 418, 310, 482)
# pickup day (R41): robots open a crate out by the ship (ramp/loading side).
# Squatch's hide crate is a panel prop inside the mail room, not this one.
OCX, OCY, OCW, OCH = 355, 555, 105, 95


def P(n, h=None):
    i = Image.open(os.path.join(MOCKUPS, 'spr_' + n + '.png')).convert('RGBA')
    for c in [(0, 0), (i.width - 1, 0), (0, i.height - 1), (i.width - 1, i.height - 1)]:
        ImageDraw.floodfill(i, c, (0, 0, 0, 0), thresh=40)
    if h:
        i = i.resize((max(1, i.width * h // i.height), h))
    return i


def new_canvas():
    return Image.new('RGB', (W, H), OUT)


def _walls(d):
    d.rounded_rectangle([L, T, R, B], radius=24, fill=FLOOR)
    d.rectangle([L + 4, T + 4, R - 4, 330], fill=WALL)
    d.rounded_rectangle([L + 2, T + 2, R - 2, 340], radius=22, fill=WALL)
    d.rectangle([L + 2, 300, R - 2, 330], fill=WALL)
    d.line([(L + 4, 330), (R - 4, 330)], fill=LINE, width=4)


def _window(im, d, ship_docked):
    win = Image.new('RGB', (ww, wh), NAVY)
    wd = ImageDraw.Draw(win)
    random.seed(11)
    for _ in range(55):
        x, y = random.randint(5, ww - 5), random.randint(5, int(wh * 0.85))
        r = random.choice((1, 2, 2, 3))
        wd.ellipse([x - r, y - r, x + r, y + r], fill=(235, 235, 245))
    if ship_docked:
        wd.rounded_rectangle([sx0, sy0, sx1, sy1], radius=70, fill=SHIP, outline=DARK, width=5)
        wd.rounded_rectangle([sx0 + 8, sy1 - 40, sx1 - 8, sy1 - 6], radius=20, fill=SHIPD)
        for px in [sx0 + 70, sx0 + 150, sx1 - 150, sx1 - 70]:
            cy = sy0 + (sy1 - sy0) // 2 - 6
            wd.ellipse([px - 22, cy - 22, px + 22, cy + 22], fill=PORT, outline=DARK, width=4)
            wd.ellipse([px - 10, cy - 14, px - 2, cy - 6], fill=(200, 220, 240))
        wd.rounded_rectangle([dx0, dy0, dx1, dy1], radius=8, fill=(40, 44, 58), outline=DARK, width=4)
        f_sm = NB(18)
        sgx, sgy = door_cx - 35, sy0 + 18
        wd.rounded_rectangle([sgx, sgy, sgx + 70, sgy + 28], radius=6, fill='white', outline=DARK, width=3)
        wd.text((sgx + 35, sgy + 14), "UPS", font=f_sm, fill=DARK, anchor='mm')
    m = Image.new('L', win.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, ww - 1, wh - 1], radius=22, fill=255)
    im.paste(win, (wx0, wy0), m)
    d.rounded_rectangle([wx0, wy0, wx1, wy1], radius=22, outline=DARK, width=6)
    d.rounded_rectangle([wx0 - 4, wy1 - 2, wx1 + 4, wy1 + 14], radius=5, fill=(214, 206, 192), outline=DARK, width=3)


def _ramp(d):
    ramp_pts = [(rt_l, ramp_top_y), (rt_r, ramp_top_y), (rb_r, ramp_bot_y), (rb_l, ramp_bot_y)]
    d.polygon(ramp_pts, fill=(168, 172, 182), outline=DARK)
    d.line(ramp_pts + [ramp_pts[0]], fill=DARK, width=4)
    for t in (0.22, 0.42, 0.62, 0.80):
        y = ramp_top_y + (ramp_bot_y - ramp_top_y) * t
        xl = rt_l + (rb_l - rt_l) * t
        xr = rt_r + (rb_r - rt_r) * t
        d.line([(xl + 4, y), (xr - 4, y)], fill=(120, 124, 136), width=3)


def _frame(d, floor=FLOOR, out=OUT):
    """Room frame + the left-wall doorway (a cut in the wall, never a door slab)."""
    d.rounded_rectangle([L, T, R, B], radius=24, outline=DARK, width=BW)
    d.rectangle([L - 2, DOOR_Y0, L + BW + 1, DOOR_Y1], fill=floor)
    d.rectangle([L - 12, DOOR_Y0, L - 1, DOOR_Y1], fill=out)
    for y in (DOOR_Y0, DOOR_Y1):
        d.line([(L - 1, y), (L + BW, y)], fill=DARK, width=4)


def _mail_room(d):
    d.rectangle([MX0 + PW // 2, MY0 + PW // 2, MX1 - 2, MY1 - 2], fill=(228, 224, 214))
    d.rounded_rectangle([MX0, MY0, MX1 - 2, MY0 + PW], radius=5, fill=WALL, outline=DARK, width=4)
    d.rounded_rectangle([MX0, MY0, MX0 + PW, OPEN_Y0], radius=5, fill=WALL, outline=DARK, width=4)
    d.rounded_rectangle([MX0, OPEN_Y1, MX0 + PW, MY1 - 2], radius=5, fill=WALL, outline=DARK, width=4)
    d.rectangle([MX0 + 3, MY0 + 3, MX0 + PW - 2, MY0 + PW - 2], fill=WALL)


def _robot_mailbox(d):
    f_tiny = NB(14)
    d.rounded_rectangle([mx0, my0 + 26, mx1, my1 - 10], radius=10, fill=(70, 110, 180), outline=DARK, width=5)
    d.pieslice([mx0, my0, mx1, my0 + 52], 180, 360, fill=(70, 110, 180), outline=DARK, width=5)
    d.rectangle([mx0 + 3, my0 + 24, mx1 - 3, my0 + 30], fill=(70, 110, 180))
    d.rounded_rectangle([mx0 + 14, my0 + 36, mx1 - 14, my0 + 46], radius=4, fill=(30, 40, 60), outline=DARK, width=3)
    d.rounded_rectangle([mx0 + 16, my0 + 56, mx1 - 16, my0 + 78], radius=5, fill='white', outline=DARK, width=3)
    d.text(((mx0 + mx1) // 2, my0 + 67), "UPS", font=f_tiny, fill=DARK, anchor='mm')
    d.rounded_rectangle([mx0 + 14, my0 + 82, mx1 - 14, my0 + 104], radius=6, fill=(30, 40, 60), outline=DARK, width=3)
    cxm = (mx0 + mx1) // 2
    d.line([(cxm, my0 + 2), (cxm, my0 - 14)], fill=DARK, width=4)
    d.ellipse([cxm - 7, my0 - 24, cxm + 7, my0 - 10], fill=(120, 200, 240), outline=DARK, width=3)
    d.rounded_rectangle([mx0 + 14, my0 + 50, mx1 - 14, my0 + 58], radius=3, fill=(70, 110, 180))
    d.ellipse([mx0 + 8, my1 - 16, mx0 + 26, my1 + 2], fill=(80, 84, 96), outline=DARK, width=3)
    d.ellipse([mx1 - 26, my1 - 16, mx1 - 8, my1 + 2], fill=(80, 84, 96), outline=DARK, width=3)
    for ex in (cxm - 12, cxm + 12):
        d.ellipse([ex - 5, my0 + 88, ex + 5, my0 + 98], fill=(120, 200, 240), outline=DARK, width=2)


def _crate(d, x0, y0, w, h):
    d.rounded_rectangle([x0, y0, x0 + w, y0 + h], radius=6, fill=CRATE, outline=DARK, width=4)
    for yy in (y0 + h // 3, y0 + 2 * h // 3):
        d.line([(x0 + 4, yy), (x0 + w - 4, yy)], fill=CRATED, width=3)
    d.line([(x0 + w // 2, y0 + 4), (x0 + w // 2, y0 + h - 4)], fill=CRATED, width=2)
    for (cx, cy) in [(x0 + 8, y0 + 8), (x0 + w - 8, y0 + 8), (x0 + 8, y0 + h - 8), (x0 + w - 8, y0 + h - 8)]:
        d.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=(120, 100, 70), outline=DARK, width=2)


def _bag(d, x0, y0, w, h):
    d.ellipse([x0, y0 + h // 4, x0 + w, y0 + h], fill=BAG, outline=DARK, width=4)
    top_y = y0 + h // 5
    d.polygon([(x0 + w // 2 - 10, y0 + 4), (x0 + w // 2 + 10, y0 + 4),
               (x0 + w - 8, top_y + 10), (x0 + 8, top_y + 10)], fill=BAGD, outline=DARK)
    d.line([(x0 + 10, top_y + 8), (x0 + w - 10, top_y + 8)], fill=DARK, width=3)
    d.arc([x0 + 6, y0 + h // 3, x0 + w - 6, y0 + h - 4], 200, 340, fill=CRATED, width=2)


def _pickup_load(d):
    """Pickup day only (R20/R41): crates + big bags in the mail room;
    the opened/inspected crate sits out by the ship (ramp foot), not at the doorway."""
    _crate(d, 1148, 655, 72, 65)
    _crate(d, 1065, 505, 58, 50)
    _crate(d, 1040, 610, 80, 70)
    _bag(d, 1165, 715, 55, 62)
    _bag(d, 1055, 700, 68, 72)
    d.rounded_rectangle([OCX, OCY, OCX + OCW, OCY + OCH], radius=6, fill=CRATE, outline=DARK, width=5)
    for yy in (OCY + OCH // 3, OCY + 2 * OCH // 3):
        d.line([(OCX + 5, yy), (OCX + OCW - 5, yy)], fill=CRATED, width=3)
    d.rounded_rectangle([OCX + 12, OCY + 10, OCX + OCW - 12, OCY + 48], radius=5, fill=(55, 45, 35), outline=DARK, width=4)
    LID = [(OCX - 14, OCY + 8), (OCX + 55, OCY - 70), (OCX + 72, OCY - 55), (OCX + 8, OCY + 22)]
    d.polygon(LID, fill=CRATE, outline=DARK)
    d.line(LID + [LID[0]], fill=DARK, width=4)
    d.line([(OCX - 4, OCY + 12), (OCX + 60, OCY - 60)], fill=CRATED, width=3)
    d.line([(OCX + 2, OCY + 18), (OCX + 64, OCY - 48)], fill=CRATED, width=2)
    d.ellipse([OCX + 2, OCY + 4, OCX + 10, OCY + 12], fill=(120, 100, 70), outline=DARK, width=2)


def _floor_vent(d):
    cx, cy = FVX, FVY

    def arc_pts(a0, r0, r1, tw, n=30):
        return [(cx + (r0 + (r1 - r0) * t / n) * math.cos(a0 + tw * t / n),
                 cy + (r0 + (r1 - r0) * t / n) * math.sin(a0 + tw * t / n) * 0.55) for t in range(n + 1)]
    for k in range(5):
        d.line(arc_pts(k * 2 * math.pi / 5, 110, 48, 1.2), fill=AIR, width=5, joint='curve')
    d.rounded_rectangle([cx - 42, cy - 18, cx + 42, cy + 18], radius=7, fill=(150, 150, 160), outline=DARK, width=4)
    for x in range(cx - 30, cx + 34, 10):
        d.line([(x, cy - 10), (x, cy + 10)], fill=(70, 70, 80), width=4)


def _wall_vent(d):
    d.rounded_rectangle([vx0, vy0, vx1, vy1], radius=12, fill=(200, 204, 212), outline=DARK, width=5)
    d.rounded_rectangle([vx0 + 12, vy0 + 12, vx1 - 12, vy1 - 12], radius=6, fill=(60, 64, 78), outline=DARK, width=3)
    for k in range(5):
        y = vy0 + 22 + k * 14
        d.rounded_rectangle([vx0 + 16, y, vx1 - 16, y + 6], radius=3, fill=(170, 175, 186))
    for sx, sy in [(vx0 + 6, vy0 + 6), (vx1 - 6, vy0 + 6), (vx0 + 6, vy1 - 6), (vx1 - 6, vy1 - 6)]:
        d.ellipse([sx - 3, sy - 3, sx + 3, sy + 3], fill=DARK)


def _scanner_arch(im):
    glow = Image.new('RGBA', im.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rectangle([ax0 + 18, atop + 18, ax1 - 18, abot], fill=(150, 200, 240, 60))
    im = Image.alpha_composite(im.convert('RGBA'), glow).convert('RGB')
    d = ImageDraw.Draw(im)
    d.line([(ax0 + 18, abot - 4), (ax1 - 18, abot - 4)], fill=SC, width=7)
    for k in range(2):
        y = atop + 40 + k * 38
        d.line([(ax0 + 22, y), (ax1 - 22, y)], fill=(170, 210, 240), width=3)
    d.rounded_rectangle([ax0, atop, ax0 + 20, abot + 6], radius=8, fill=(200, 204, 212), outline=DARK, width=4)
    d.rounded_rectangle([ax1 - 20, atop, ax1, abot + 6], radius=8, fill=(200, 204, 212), outline=DARK, width=4)
    d.rounded_rectangle([ax0 - 6, atop - 8, ax1 + 6, atop + 22], radius=10, fill=(200, 204, 212), outline=DARK, width=4)
    d.ellipse([(ax0 + ax1) // 2 - 9, atop - 2, (ax0 + ax1) // 2 + 9, atop + 16], fill=SC, outline=DARK, width=3)
    return im


def _bin(d):
    bx0, by0, bx1, by1 = BIN
    d.polygon([(bx0, by0), (bx1, by0), (bx1 - 6, by1), (bx0 + 6, by1)], fill=(150, 165, 185), outline=DARK)
    d.line([(bx0, by0), (bx1, by0), (bx1 - 6, by1), (bx0 + 6, by1), (bx0, by0)], fill=DARK, width=4)
    d.rounded_rectangle([bx0 - 5, by0 - 8, bx1 + 5, by0 + 2], radius=4, fill=(170, 182, 200), outline=DARK, width=3)
    for xx in (bx0 + 16, bx0 + 28, bx0 + 40):
        d.line([(xx, by0 + 12), (xx, by1 - 10)], fill=(120, 132, 152), width=3)


def plant_eyes_xy():
    """Eye-pair centre of the hide plant (for sweat drops etc.)."""
    return paste_plant_hide(Image.new('RGBA', (W, H)), PLANT_CX, PLANT_BOTTOM, h=PLANT_H)


MAIL_ROOM_CONTENTS = ('mailbox', 'pickup')


def draw_delivery_back(im, ship_docked=False, mail_room_contents='mailbox'):
    """Walls, window (+ UPS ship and ramp if docked), frame, mail room with the
    robot mailbox (+ pickup-day load), floor vent, speaker, FUR alarm."""
    assert mail_room_contents in MAIL_ROOM_CONTENTS
    d = ImageDraw.Draw(im)
    _walls(d)
    _window(im, d, ship_docked)
    if ship_docked:
        _ramp(d)
    _frame(d)
    _mail_room(d)
    _robot_mailbox(d)            # R21: always there, day and night
    if mail_room_contents == 'pickup':
        _pickup_load(d)          # R20: only on pickup day
    _floor_vent(d)
    sp = P('speaker', 56); im.paste(sp, (1085, 120), sp)
    al = P('alarm', 46); im.paste(al, (88, 175), al)
    return im


def draw_delivery_front(im, ship_docked=False, squatch_in_plant=False):
    """Big crawl wall vent; fur scanner arch only when a ship is docked (R15);
    the hide plant (with Squatch's eyes only if he is hiding in it, C8/C21)
    and the bin beside it."""
    _wall_vent(ImageDraw.Draw(im))
    if ship_docked:
        im = _scanner_arch(im)
    paste_plant_hide(im, PLANT_CX, PLANT_BOTTOM, h=PLANT_H, hidden=squatch_in_plant)
    _bin(ImageDraw.Draw(im))
    return im


def apply_night(im):
    """Night: dim the whole room, keep the window bright."""
    night = Image.new('RGBA', im.size, (20, 24, 60, 120))
    mask = Image.new('L', im.size, 255)
    ImageDraw.Draw(mask).rounded_rectangle([wx0, wy0, wx1, wy1], radius=22, fill=0)
    return Image.composite(Image.alpha_composite(im.convert('RGBA'), night), im.convert('RGBA'), mask).convert('RGB')


def _night_rgb(rgb):
    return apply_night(Image.new('RGB', (W, H), rgb)).getpixel((5, 5))


def finish_delivery(im, time='day'):
    """Re-stroke the frame and the left doorway on top of everything.
    At night the doorway uses the dimmed floor / mat colours (no bright slab)."""
    _frame(ImageDraw.Draw(im), *(_night_rgb(FLOOR), _night_rgb(OUT)) if time == 'night' else (FLOOR, OUT))
    return im


def draw_delivery(im=None, time='day', ship_docked=False, mail_room_contents='mailbox', behind_arch=None,
                  squatch_in_plant=False):
    """Room only (no characters). Used for LOCKED room references and check_all."""
    assert time in ('day', 'night')
    if im is None:
        im = new_canvas()
    im = draw_delivery_back(im, ship_docked=ship_docked, mail_room_contents=mail_room_contents)
    if behind_arch:
        im = behind_arch(im) or im
    im = draw_delivery_front(im, ship_docked=ship_docked, squatch_in_plant=squatch_in_plant)
    if time == 'night':
        im = apply_night(im)
    return finish_delivery(im, time)


if __name__ == '__main__':
    os.chdir(MOCKUPS)
    for t, sd, mc in [('day', True, 'mailbox'), ('day', False, 'mailbox'), ('night', False, 'mailbox'),
                      ('night', True, 'mailbox'), ('day', True, 'pickup')]:
        draw_delivery(time=t, ship_docked=sd, mail_room_contents=mc).save(
            f'/tmp/delivery-room-empty-{t}-{"ship" if sd else "noship"}-{mc}.png')
