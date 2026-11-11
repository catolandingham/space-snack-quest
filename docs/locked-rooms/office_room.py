"""Shared MANAGER'S OFFICE room drawing.

ONE source for the office. Panels import from here; panels add only characters
and on-screen UI that replaces the default ORDER page.

Game source (not invented) — middle-main-read copies of main:
  - Fp() in 10-ch1.js (~1516): office floor corner #ece6f5, thin #b5bcc8 walls,
    doorway on the right wall (door0=280..door1=390). Game also draws the
    "MANAGER'S OFFICE" floor label; sketches omit area labels [R17].
  - Z6() in 50-story-frame.js (~125): manager computer desk at lt={x:150,y:250}
    (desk body #8a93a3, top #b5bcc8, MANAGER nameplate, monitor bezel/screen,
    default Bleep·Bloop face + green ORDER button via oq()).
  - R23: office sits beside the mail room. Live hall still has the office on the
    left (A26/T27 move not built); this module keeps Z6 furniture proportions
    and puts the doorway on the RIGHT so the office reads beside the mail room.

The hall is top-down; sketches use a back-wall floor line. We keep Z6's relative
geometry (sizes & stack from the foot) and plant the foot on the sketch floor.
"""
from PIL import Image, ImageDraw, ImageFont
import os

MOCKUPS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1280, 830
OUT = (226, 229, 237)
WALL = (244, 241, 234)
FLOOR_HALL = (241, 243, 246)    # s5 #f1f3f6
FLOOR_OFF = (236, 230, 245)     # Fp #ece6f5
LINE = (200, 197, 190)
DARK = (34, 36, 44)
DESK = (138, 147, 163)          # #8a93a3
DESK_TOP = (181, 188, 200)      # #b5bcc8
PLATE = (43, 58, 103)           # #2b3a67
BEZEL = (89, 101, 125)          # #59657d
SCREEN_FILL = (232, 244, 255)   # #e8f4ff
GREEN = (43, 196, 138)          # #2bc48a
BLUE = (52, 120, 246)           # #3478f6

G = '/usr/share/fonts/truetype/sand-box/google/'

def NB(s):
    f = ImageFont.truetype(G + 'Nunito/Nunito-VariableFont_wght.ttf', s)
    try:
        f.set_variation_by_name('ExtraBold')
    except Exception:
        pass
    return f

# Z6 geometry at uniform scale. Desk width 116 game → ~280 sketch.
S = 2.4
LT_X, LT_Y = 150, 250

def gs(v):
    return max(1, int(round(v * S)))

FLOOR_Y = 420
COMP_FOOT = 700
COMP_CX = 520

def _sy(game_y):
    return int(round(COMP_FOOT + (game_y - LT_Y) * S))

def _sx(game_x):
    return int(round(COMP_CX + (game_x - LT_X) * S))

SCREEN_BOX = (
    _sx(LT_X - 48), _sy(LT_Y - 170),
    _sx(LT_X - 48 + 96), _sy(LT_Y - 170 + 70),
)
# Fp office width 260; lt at x=150 → left 150, right 110 game px from centre
OFFICE_X0 = COMP_CX - gs(150)
OFFICE_X1 = COMP_CX + gs(110)
DOOR_X = OFFICE_X1

L, T, R, B = 40, 60, 1240, 800
BW = 7


def _rr(d, box, radius, fill=None, outline=None, width=3):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def _bleep_face(d, cx, cy, sc):
    """oq() white capsule + BLEEP·BLOOP (50-story-frame.js)."""
    w, h = int(156 * sc), int(32 * sc)
    _rr(d, [cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2],
        radius=max(4, h // 2), fill='white', outline=DARK, width=max(2, int(3 * sc)))
    ew, eh = int(22 * sc), int(18 * sc)
    ex0 = cx - w // 2 + int(8 * sc)
    _rr(d, [ex0, cy - eh // 2, ex0 + ew, cy + eh // 2],
        radius=max(3, int(5 * sc)), fill=BLUE, outline=DARK, width=max(2, int(2 * sc)))
    for dx in (-int(6 * sc), int(4 * sc)):
        r = max(2, int(2.4 * sc))
        d.ellipse([ex0 + ew // 2 + dx - r, cy - r, ex0 + ew // 2 + dx + r, cy + r], fill='white')
    d.line([(ex0 + ew // 2, cy - eh // 2), (ex0 + ew // 2, cy - eh // 2 - int(6 * sc))],
           fill=DARK, width=max(2, int(2 * sc)))
    d.ellipse([ex0 + ew // 2 - 3, cy - eh // 2 - int(6 * sc) - 3,
               ex0 + ew // 2 + 3, cy - eh // 2 - int(6 * sc) + 3], fill=(229, 83, 61))
    d.text((cx + int(18 * sc), cy), "BLEEP·BLOOP", font=NB(max(9, int(14 * sc))), fill=BLUE, anchor='mm')


def draw_computer(d, screen='default'):
    """Z6 desk + monitor. screen: 'default' | 'blank'."""
    l, o = LT_X, LT_Y
    d.ellipse([_sx(l) - gs(62), _sy(o + 4) - gs(5), _sx(l) + gs(62), _sy(o + 4) + gs(5)],
              fill=(210, 205, 215))
    _rr(d, [_sx(l - 58), _sy(o - 58), _sx(l - 58 + 116), _sy(o - 58 + 60)],
        radius=gs(6), fill=DESK, outline=DARK, width=4)
    _rr(d, [_sx(l - 64), _sy(o - 66), _sx(l - 64 + 128), _sy(o - 66 + 14)],
        radius=gs(4), fill=DESK_TOP, outline=DARK, width=3)
    _rr(d, [_sx(l - 34), _sy(o - 40), _sx(l - 34 + 68), _sy(o - 40 + 22)],
        radius=gs(3), fill=PLATE, outline=DARK, width=2)
    d.text((_sx(l), _sy(o - 29)), "MANAGER", font=NB(max(12, gs(11))), fill='white', anchor='mm')
    wedge = [(_sx(l - 34), _sy(o - 56)), (_sx(l + 34), _sy(o - 56)),
             (_sx(l + 28), _sy(o - 64)), (_sx(l - 28), _sy(o - 64))]
    d.polygon(wedge, fill=BEZEL, outline=DARK)
    d.line(wedge + [wedge[0]], fill=DARK, width=2)
    _rr(d, [_sx(l - 8), _sy(o - 92), _sx(l - 8 + 16), _sy(o - 92 + 28)],
        radius=gs(2), fill=BEZEL, outline=DARK, width=3)
    _rr(d, [_sx(l - 56), _sy(o - 178), _sx(l - 56 + 112), _sy(o - 178 + 88)],
        radius=gs(8), fill=BEZEL, outline=DARK, width=4)
    sx0, sy0, sx1, sy1 = SCREEN_BOX
    _rr(d, [sx0, sy0, sx1, sy1], radius=gs(4), fill=SCREEN_FILL, outline=DARK, width=2)
    if screen == 'default':
        _bleep_face(d, _sx(l), _sy(o - 156), 0.42)
        _rr(d, [_sx(l - 30), _sy(o - 132), _sx(l - 30 + 60), _sy(o - 132 + 20)],
            radius=gs(6), fill=GREEN, outline=DARK, width=2)
        d.text((_sx(l), _sy(o - 122)), "ORDER", font=NB(max(12, gs(11))), fill='white', anchor='mm')
        d.ellipse([_sx(l + 44) - 4, _sy(o - 98) - 4, _sx(l + 44) + 4, _sy(o - 98) + 4], fill=GREEN)


def draw_office(im=None, screen='default'):
    """Room only (no characters)."""
    if im is None:
        im = Image.new('RGB', (W, H), OUT)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([L, T, R, B], radius=24, fill=FLOOR_HALL)
    d.rectangle([L + 4, T + 4, R - 4, FLOOR_Y], fill=WALL)
    d.rounded_rectangle([L + 2, T + 2, R - 2, FLOOR_Y + 8], radius=22, fill=WALL)
    d.rectangle([L + 2, FLOOR_Y - 20, R - 2, FLOOR_Y], fill=WALL)
    d.line([(L + 4, FLOOR_Y), (R - 4, FLOOR_Y)], fill=LINE, width=3)

    # Fp lavender office floor
    d.rectangle([max(L + BW, OFFICE_X0), FLOOR_Y, min(R - BW, OFFICE_X1), B - BW], fill=FLOOR_OFF)

    # thin right wall + doorway cut (R36); opening toward mail room (R23)
    tw = gs(12)
    wall_x = DOOR_X
    door0 = FLOOR_Y + int((B - BW - FLOOR_Y) * 0.15)
    door1 = FLOOR_Y + int((B - BW - FLOOR_Y) * 0.78)
    d.rounded_rectangle([wall_x - tw // 2, FLOOR_Y - 4, wall_x + tw // 2, door0],
                        radius=3, fill=DESK_TOP, outline=DARK, width=3)
    d.rounded_rectangle([wall_x - tw // 2, door1, wall_x + tw // 2, B - BW - 2],
                        radius=3, fill=DESK_TOP, outline=DARK, width=3)
    d.line([(wall_x - tw // 2, door0), (wall_x + tw // 2, door0)], fill=DARK, width=4)
    d.line([(wall_x - tw // 2, door1), (wall_x + tw // 2, door1)], fill=DARK, width=4)

    draw_computer(d, screen=screen)
    return finish_office(im)


def finish_office(im):
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([L, T, R, B], radius=24, outline=DARK, width=BW)
    return im


if __name__ == '__main__':
    os.chdir(MOCKUPS)
    draw_office(screen='default').save('/tmp/office-room-empty-default.png')
    draw_office(screen='blank').save('/tmp/office-room-empty-blank.png')
    print('SCREEN', SCREEN_BOX, 'FLOOR_Y', FLOOR_Y, 'COMP', COMP_CX, COMP_FOOT,
          'office', OFFICE_X0, OFFICE_X1)
