/**
 * The "more to find" card (Brian 2026-11-24, his click "Choice card after hiding"; his words: "you don't know if you
 * discovered everything at the party or not"). It shows once Squatch is under his bed after an alarm, the whole
 * phone screen: the party's five things as pictures (the ones he found filled in, the rest as "?" shapes) and two
 * big buttons, "Back to the party" and "Keep going"; with everything found, its other line and only "Keep going".
 * The hallway doorway is not one of the things. Words come from party-lines.js. Screen pixels.
 */
import { partyLine } from "./party-lines.js";
import { rr, oval, line, words, INK, drawNote, drawTripod } from "./party-art.js";
import { heart } from "./party-free-art.js";

// The party's things, in the order shown. Each id is the name the party keeps in `p.done`.
export const CARD_THINGS = Object.freeze(["dance", "photo", "snacks", "conga", "octopus"]);

/** Which things he has found: { dance: true, ... }, and whether that is all of them. */
export function found(done) {
  const got = Object.fromEntries(CARD_THINGS.map((k) => [k, !!(done && done[k])]));
  return { got, all: CARD_THINGS.every((k) => got[k]) };
}

/** Where everything on the card sits on a screen `w` by `h`: the title, the five tiles (three, then two) and the buttons. */
export function cardLayout(w, h, all) {
  const m = Math.max(16, Math.round(w * 0.05)),
    tile = Math.min(104, Math.floor((Math.min(w, 520) - m * 2 - 24) / 3)),
    gap = 12,
    top = Math.round(h * 0.2),
    row = (n, y) => Array.from({ length: n }, (_, i) => ({ x: w / 2 - ((n - 1) * (tile + gap)) / 2 + i * (tile + gap), y })),
    spots = [...row(3, top + tile / 2), ...row(2, top + tile * 1.5 + gap)],
    bw = Math.min(w - m * 2, 340),
    bh = Math.max(64, Math.round(h * 0.085)),
    by = top + tile * 2 + gap + Math.round(h * 0.06);
  const buttons = all ? [{ id: "keep", x: w / 2 - bw / 2, y: by, w: bw, h: bh }] : [{ id: "back", x: w / 2 - bw / 2, y: by, w: bw, h: bh }, { id: "keep", x: w / 2 - bw / 2, y: by + bh + 16, w: bw, h: bh }];
  return { w, h, title: { x: w / 2, y: Math.round(h * 0.1), size: Math.max(22, Math.round(Math.min(w, 520) * 0.066)), wide: w - m * 2 }, tile, tiles: CARD_THINGS.map((id, i) => ({ id, ...spots[i] })), buttons };
}

/** The button under the finger at (x, y): "back", "keep" or "". */
export function cardButtonAt(L, x, y) {
  const b = L.buttons.find((q) => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h);
  return b ? b.id : "";
}

// ---------- the five pictures (each drawn in a box `s` across, centred on 0, 0) ----------
// `art`: { squatch (ctx, x, y, scale), guest (ctx, id, x, y, tall) } from the game.
const PICTURES = {
  // the dance: Squatch in the pink spotlight with music notes
  dance(ctx, s, art) {
    oval(ctx, 0, s * 0.3, s * 0.4, s * 0.1, "rgba(255,95,168,.45)");
    art.squatch(ctx, 0, s * 0.32, s / 86);
    drawNote(ctx, -s * 0.3, -s * 0.22, s * 0.11, "#ff5fa8");
    drawNote(ctx, s * 0.3, -s * 0.3, s * 0.11, "#3478f6");
  },
  // the photo: the camera on its tripod, its flash going off
  photo(ctx, s) {
    ctx.save();
    ctx.scale(s / 70, s / 70);
    drawTripod(ctx, -4, 26, { x: 60, y: -20 });
    ctx.restore();
    for (let i = 0; i < 6; i++) {
      const a = -0.5 + (i - 2.5) * 0.42;
      line(ctx, [s * 0.16 + Math.cos(a) * s * 0.1, -s * 0.2 + Math.sin(a) * s * 0.1, s * 0.16 + Math.cos(a) * s * 0.24, -s * 0.2 + Math.sin(a) * s * 0.24], "#ffcf33", Math.max(2, s * 0.035));
    }
  },
  // the snacks: a little pyramid of Moon Pies on the counter
  snacks(ctx, s) {
    rr(ctx, -s * 0.4, s * 0.24, s * 0.8, s * 0.1, 4, "#c9b6a0", 2);
    const r = s * 0.12;
    [[-2, 0], [0, 0], [2, 0], [-1, 1], [1, 1], [0, 2]].forEach(([i, row]) => {
      const x = i * r * 1.05,
        y = s * 0.24 - r * 0.8 - row * r * 1.5;
      oval(ctx, x, y, r, r * 0.8, "#6b4428", 2);
      oval(ctx, x, y - r * 0.22, r * 0.72, r * 0.4, "#f4e3c1");
    });
  },
  // the conga: three guests in a line, one behind another
  conga(ctx, s, art) {
    ["teal", "stilt", "backpack"].forEach((id, i) => art.guest(ctx, id, (i - 1) * s * 0.27, s * 0.36, s * 0.62));
    for (const x of [-0.42, -0.36]) line(ctx, [x * s, s * 0.1, (x - 0.05) * s, s * 0.1], INK, 2);
  },
  // the octopus: the hugging tourist, with a heart
  octopus(ctx, s, art) {
    art.guest(ctx, "octopus-guest", -s * 0.05, s * 0.38, s * 0.72);
    heart(ctx, s * 0.3, -s * 0.24, s * 0.09, "#ff5fa8");
  },
};

/**
 * Draws the card. `st`: { got, all, pressed ("back", "keep" or "") }; `art` as above.
 * A found thing is its picture on a light tile; one not found yet is a dark tile with a big "?".
 */
export function drawCard(ctx, L, st, art) {
  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, L.w, L.h);
  // the title, on two lines if the screen is narrow
  const title = partyLine(st.all ? "card-all" : "card-more");
  ctx.save();
  ctx.font = `900 ${L.title.size}px system-ui, sans-serif`;
  const fits = ctx.measureText(title).width <= L.title.wide,
    cut = title.lastIndexOf(" ", Math.ceil(title.length * 0.55)),
    rows = fits ? [title] : [title.slice(0, cut), title.slice(cut + 1)];
  ctx.restore();
  rows.forEach((r, i) => words(ctx, r, L.title.x, L.title.y + i * L.title.size * 1.15, L.title.size, "#fffdf8"));
  for (const t of L.tiles) {
    const s = L.tile,
      got = st.got[t.id];
    rr(ctx, t.x - s / 2, t.y - s / 2, s, s, 14, got ? "#fffdf8" : "#3a4458", 3);
    ctx.save();
    ctx.translate(t.x, t.y);
    if (got) {
      ctx.beginPath();
      ctx.roundRect(-s / 2 + 3, -s / 2 + 3, s - 6, s - 6, 11);
      ctx.clip();
      PICTURES[t.id](ctx, s, art);
    } else words(ctx, "?", 0, s * 0.04, Math.round(s * 0.62), "#8b97ad");
    ctx.restore();
  }
  for (const b of L.buttons) {
    const main = b.id === (st.all ? "keep" : "back"),
      down = st.pressed === b.id ? 2 : 0;
    rr(ctx, b.x, b.y + down, b.w, b.h, b.h / 2, main ? "#2bc48a" : "#fffdf8", 3);
    words(ctx, partyLine(b.id === "back" ? "button-back" : "button-keep"), b.x + b.w / 2, b.y + b.h / 2 + down + 1, Math.max(22, Math.round(b.h * 0.36)), main ? "#ffffff" : INK);
  }
}
