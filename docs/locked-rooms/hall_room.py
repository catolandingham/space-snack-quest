"""Shared HALL drawing (Space Snack Quest sketches).

ONE source for the hall (lobby). Extracted pixel-for-pixel from hall_soft3.py
(sketch-01m-hall-soft.png, locked hall-01m-v1) on Nov 8, ~11:20 PM PT.
Panels add only characters, props and bubbles. Do not redraw the hall in a panel.
Decisions: R4 (newer room style, 01k template), R5 (Stormtop view), R6 (stage top,
home entrance bottom, opening at the north end of the right wall), R7 (window
flush top corner), R9 (one snack stand far right, turned against the wall,
second plant mid-room), R11 (speaker, FUR pull alarm "FUR / PULL DOWN", vent
spread out on the walls), R12 (floor-vent swirls curl inward).
Changing anything here changes every hall panel: only on Brian's explicit
request, then re-lock a new version (docs/FIDELITY.md).

    im = draw_hall()            # room only (incl. its two plants)
    ... panel: characters / props / bubbles ...
Zoom shots: hall_zoom(im, box) crops + scales the finished hall (camera zoom, C13).
"""
import math, os, random
from PIL import Image, ImageDraw, ImageFont

MOCKUPS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1280, 830
OUT = (226, 229, 237); WALL = (244, 241, 234); FLOOR = (234, 229, 218); LINE = (200, 197, 190); DARK = (34, 36, 44)
YEL = (244, 196, 48); AIR = (120, 170, 220)
L, T, R, B = 40, 60, 1240, 800
BW = 7
# fixtures (positions as in hall_soft3.py)
SPEAKER_XY, SPEAKER_H = (880, 130), 56
ALARM_XY, ALARM_H = (1170, 190), 46
VENT_C = (250, 640)
PLANT1_XY, PLANT1_H = (80, 360), 120
PLANT2_XY, PLANT2_H = (520, 560), 150
RIGHT_DOOR_Y0, RIGHT_DOOR_Y1 = 350, 455
BOTTOM_DOOR_X0, BOTTOM_DOOR_X1 = 570, 700


def P(n, h=None):
    i = Image.open(os.path.join(MOCKUPS, 'spr_' + n + '.png')).convert('RGBA')
    for c in [(0, 0), (i.width - 1, 0), (0, i.height - 1), (i.width - 1, i.height - 1)]:
        ImageDraw.floodfill(i, c, (0, 0, 0, 0), thresh=40)
    if h:
        i = i.resize((i.width * h // i.height, h))
    return i


def draw_hall(im=None):
    if im is None:
        im = Image.new('RGB', (W, H), OUT)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([L, T, R, B], radius=24, fill=FLOOR)
    d.rectangle([L + 4, T + 4, R - 4, 330], fill=WALL)
    d.rounded_rectangle([L + 2, T + 2, R - 2, 340], radius=22, fill=WALL); d.rectangle([L + 2, 300, R - 2, 330], fill=WALL)
    d.line([(L + 4, 330), (R - 4, 330)], fill=LINE, width=4)
    # window (flat Stormtop view), flush to left wall
    wx0, wy0, wx1, wy1 = L + BW, 92, 830, 300
    win = Image.new('RGB', (wx1 - wx0, wy1 - wy0), (50, 56, 96)); wd = ImageDraw.Draw(win); ww, wh = win.size
    random.seed(3)
    for _ in range(40):
        x, y = random.randint(5, ww - 5), random.randint(5, int(wh * 0.55)); r = random.choice((1, 2, 2, 3))
        wd.ellipse([x - r, y - r, x + r, y + r], fill=(235, 235, 245))
    wd.arc([-200, 40, ww + 300, wh * 2.4], 185, 355, fill=(196, 190, 214), width=14)
    wd.arc([-200, 40, ww + 300, wh * 2.4], 185, 355, fill=(160, 154, 186), width=3)

    def band(y0, amp, col, ph):
        pts = [(x, y0 + amp * math.sin(x / 70 + ph)) for x in range(0, ww + 10, 10)] + [(ww, wh), (0, wh)]
        wd.polygon(pts, fill=col)
    band(wh * 0.62, 6, (222, 190, 160), 0); band(wh * 0.74, 7, (205, 160, 128), 1.5); band(wh * 0.87, 6, (186, 134, 108), 3)
    m = Image.new('L', win.size, 0); ImageDraw.Draw(m).rounded_rectangle([-30, 0, ww - 1, wh - 1], radius=26, fill=255)
    im.paste(win, (wx0, wy0), m)
    d.rounded_rectangle([wx0 - 30, wy0, wx1, wy1], radius=26, outline=DARK, width=6)
    d.rectangle([wx0 - BW, wy0 - 6, wx0 - 1, wy1 + 6], fill=DARK)
    d.rounded_rectangle([wx0, wy1 - 2, wx1 + 10, wy1 + 12], radius=5, fill=(214, 206, 192), outline=DARK, width=3)  # sill
    # stage
    d.rounded_rectangle([330, 318, 640, 342], radius=6, fill=(222, 178, 128), outline=DARK, width=4)
    d.rounded_rectangle([330, 338, 640, 380], radius=6, fill=(176, 126, 86), outline=DARK, width=4)
    # outline frame
    d.rectangle([0, wy0 - 10, L - 1, wy1 + 20], fill=OUT)
    d.rounded_rectangle([L, T, R, B], radius=24, outline=DARK, width=BW)
    # openings (wall cuts): right wall north end, bottom middle (home entrance)
    d.rectangle([R - BW - 1, RIGHT_DOOR_Y0, R + 2, RIGHT_DOOR_Y1], fill=FLOOR); d.rectangle([R + 3, RIGHT_DOOR_Y0, R + 12, RIGHT_DOOR_Y1], fill=OUT)
    for y in (RIGHT_DOOR_Y0, RIGHT_DOOR_Y1): d.line([(R - BW, y), (R + 1, y)], fill=DARK, width=4)
    d.rectangle([BOTTOM_DOOR_X0, B - BW - 1, BOTTOM_DOOR_X1, B + 2], fill=FLOOR)
    for x in (BOTTOM_DOOR_X0, BOTTOM_DOOR_X1): d.line([(x, B - BW), (x, B + 1)], fill=DARK, width=4)
    # snack bar
    d.rounded_rectangle([1085, 360, 1145, 640], radius=8, fill=(150, 150, 160), outline=DARK, width=4)
    d.rounded_rectangle([1085, 360, 1135, 630], radius=8, fill=(236, 236, 240), outline=DARK, width=4)
    d.rounded_rectangle([1085, 600, R - BW, 668], radius=8, fill=(150, 150, 160), outline=DARK, width=4)
    d.rounded_rectangle([1085, 600, R - BW, 640], radius=8, fill=(236, 236, 240), outline=DARK, width=4)
    d.line([(1078, 353), (1152, 353), (1152, 593), (R - BW, 593)], fill=YEL, width=4)
    d.line([(1078, 353), (1078, 675), (R - BW, 675)], fill=YEL, width=4)
    st = Image.open(os.path.join(MOCKUPS, 'spr_stand.png')).convert('RGBA')
    snacks = [st.crop((10, 25, 80, 95)), st.crop((10, 100, 80, 170)), st.crop((10, 180, 80, 240))]
    for k, s in enumerate(snacks):
        s = s.convert('RGBA')
        for c in [(0, 0), (s.width - 1, 0), (0, s.height - 1), (s.width - 1, s.height - 1)]: ImageDraw.floodfill(s, c, (0, 0, 0, 0), thresh=60)
        s = s.resize((44, 44)); im.paste(s, (1088, 380 + k * 70), s)
    for k, y in enumerate((395, 500)):
        s = P('stools', None).crop((0, 0, 57, 58)); s = s.resize((48, 50)); im.paste(s, (1025, y), s)
    # fixtures on the back wall
    sp = P('speaker', SPEAKER_H); im.paste(sp, SPEAKER_XY, sp)
    al = P('alarm', ALARM_H); im.paste(al, ALARM_XY, al)
    # floor vent with inward swirl streaks
    cx, cy = VENT_C

    def arc_pts(a0, r0, r1, tw, n=30):
        return [(cx + (r0 + (r1 - r0) * t / n) * math.cos(a0 + tw * t / n), cy + (r0 + (r1 - r0) * t / n) * math.sin(a0 + tw * t / n) * 0.55) for t in range(n + 1)]
    for k in range(5): d.line(arc_pts(k * 2 * math.pi / 5, 120, 52, 1.2), fill=AIR, width=5, joint='curve')
    d.rounded_rectangle([cx - 42, cy - 18, cx + 42, cy + 18], radius=7, fill=(150, 150, 160), outline=DARK, width=4)
    for x in range(cx - 30, cx + 34, 10): d.line([(x, cy - 10), (x, cy + 10)], fill=(70, 70, 80), width=4)
    # the two hall plants (room fixtures, R9)
    pl = P('plant', PLANT1_H); im.paste(pl, PLANT1_XY, pl)
    pl2 = P('plant', PLANT2_H); im.paste(pl2, PLANT2_XY, pl2)
    return im


def finish_hall(im):
    return im


# ---- camera zoom on the FUR pull alarm (P16) -------------------------------
# Crop box in hall coordinates (aspect of the panel frame 1200 x 740) and the
# frame it is shown in. Everything inside scales together (C13: same drawings,
# the camera zooms).
ZOOM_FRAME = (L, T, R, B)
ZOOM_BOX = (846, 128, 1233, 128 + 740 * 387 / 1200)   # x3.1: speaker, FUR alarm, top of the snack stand; inside the window edge and the right wall


def zoom_xy(x, y, box=ZOOM_BOX, frame=ZOOM_FRAME):
    k = (frame[2] - frame[0]) / (box[2] - box[0])
    return frame[0] + (x - box[0]) * k, frame[1] + (y - box[1]) * k


def hall_zoom(src, box=ZOOM_BOX, frame=ZOOM_FRAME):
    """Camera zoom: crop `box` of a finished hall picture and fill the panel frame
    with it (flat shapes scale cleanly). The FUR alarm is re-pasted from its full-
    resolution sprite at the same spot so its words stay sharp."""
    fw, fh = frame[2] - frame[0], frame[3] - frame[1]
    crop = src.crop(tuple(round(v) for v in box)).resize((fw, fh), Image.LANCZOS)
    im = Image.new('RGB', (W, H), OUT)
    m = Image.new('L', (fw, fh), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, fw - 1, fh - 1], radius=24, fill=255)
    im.paste(crop, (frame[0], frame[1]), m)
    k = fw / (box[2] - box[0])
    al = P('alarm', round(ALARM_H * k))
    ax, ay = zoom_xy(*ALARM_XY, box, frame)
    im.paste(al, (round(ax), round(ay)), al)
    return im


def finish_zoom(im, frame=ZOOM_FRAME):
    ImageDraw.Draw(im).rounded_rectangle(list(frame), radius=24, outline=DARK, width=BW)
    return im


def draw_hall_zoom(im=None):
    """Room only, zoomed on the FUR alarm (for the LOCKED room-only reference)."""
    return finish_zoom(hall_zoom(draw_hall()))


if __name__ == '__main__':
    os.chdir(MOCKUPS)
    draw_hall().save('/tmp/hall-room-empty.png')
    draw_hall_zoom().save('/tmp/hall-room-zoom-alarm.png')
