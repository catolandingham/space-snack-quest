/**
 * The "?" over someone who has noticed Squatch (Brian 2026-11-25, showing-5 note 6, and note 3's smaller "?"): it
 * appears small and pale, about half size, with no white bubble (like Mops's hearts), then fills in, darkens and
 * grows while Squatch stays in sight, and pops into the red "!" (the alarm) or, for the octopus, into the grab. If
 * Squatch gets out of sight first, it fades away. The fill takes the same time the look always took (the "?" to
 * "!" delay, party-watch.js SEEN_TOO_LONG_SECONDS; for the octopus OCT.notice).
 * The state is `p.qs` on the party's game-state object: { [personId]: { k (0 small and pale, 1 full), a (how
 * visible, 1 while he is in sight, fading to 0 after) } }.
 */
// PLACEHOLDERS for Brian: how long a "?" takes to fade once he is out of sight, its smallest size (a share of its
// full size), and its colours from pale to full.
export const QUESTION_LOOK = Object.freeze({ fade: 0.45, smallest: 0.5, pale: [242, 214, 140], full: [196, 120, 0] });

/**
 * One frame: `showing` is { [personId]: k } for everyone whose "?" is up now (k 0 to 1, how far it has filled).
 * Anyone no longer in it fades out.
 */
export function tickQuestions(p, dt, showing) {
  const qs = p.qs || (p.qs = {});
  for (const [id, k] of Object.entries(showing)) qs[id] = { k: Math.max(0, Math.min(1, k)), a: 1 };
  for (const id of Object.keys(qs)) {
    if (id in showing) continue;
    qs[id].a -= dt / QUESTION_LOOK.fade;
    qs[id].a <= 0 && delete qs[id];
  }
}

/** The "?" marks to draw: [{ id, k, a }]. */
export function questions(p) {
  return Object.entries(p.qs || {}).map(([id, q]) => ({ id, k: q.k, a: q.a }));
}

/** The size (a share of its full size) and colour of a "?" filled `k`. */
export function questionLook(k) {
  const L = QUESTION_LOOK,
    c = L.pale.map((v, i) => Math.round(v + (L.full[i] - v) * k));
  return { scale: L.smallest + (1 - L.smallest) * k, color: `rgb(${c.join(",")})` };
}
