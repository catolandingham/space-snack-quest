/**
 * What the tests read about the party in disguise and its endings (P6 to P8), beside the scene and its phase
 * (party.js now()). Read-only: a plain picture of the party's game-state object `p`, with what is drawn from it
 * (the bump mark at the hallway doorway, the guard in the home room and the mark over him).
 * Split out of party.js (CLAUDE.md: small files).
 */
import { furShows, wornNow } from "./party-outfit.js";
import { bumpMark } from "./party-hallway.js";
import { guardLook, guardMark } from "./party-guard-look.js";

/** `sizes`: { scale (Squatch's scale in the hall), guardTall (how tall the guard is drawn in the home room) }. */
export function lateState(p, sizes) {
  const g = p.alarm && p.alarm.homeGuard,
    f = g && Math.cos(g.a) < 0 ? -1 : 1;
  return {
    worn: wornNow(p),
    gone: (p.lostPieces || []).slice(),
    flying: (p.flying || []).length,
    fur: furShows(p),
    song: p.song,
    songT: p.songT,
    ft: p.ft,
    done: { ...(p.done || {}) },
    early: !!p.early,
    dance: p.dance ? { moves: p.dance.moves, cheer: p.dance.cheer } : null,
    snack: p.snack ? { phase: p.snack.phase, held: p.snack.held, catches: p.snack.catches } : null,
    snacks: p.snacks ? { bag: p.snacks.bag, toppled: p.snacks.toppled, chain: p.snacks.chain } : null,
    stare: p.stare ? p.stare.t : 0,
    conga: p.conga ? { on: p.conga.on, formed: p.conga.formed, joined: p.conga.joined } : null,
    photo: p.photo ? { phase: p.photo.phase, taken: p.photo.taken, pol: p.photo.pol } : null,
    oct: p.oct ? { mode: p.oct.mode, hugs: p.oct.hugs, t: p.oct.t, arms: p.oct.arms || 0 } : null,
    bounced: p.bounced || 0,
    bounce: p.bounce ? { t: p.bounce.t, mark: bumpMark(p, sizes.scale) } : null,
    homeGuard: g ? { x: g.x, y: g.y, a: g.a, f, tall: sizes.guardTall, sees: !!g.sees, leaving: !!g.leaving, turn: g.turn == null ? null : g.turn, lean: guardLook(g).lean || 0, mark: guardMark(g, sizes.guardTall, f) } : null,
    paw: !!p.pawIcon,
    close: p.close ? { phase: p.close.phase, gone: Object.keys(p.close.gone) } : null,
    mops: p.mops ? { x: p.mops.x, y: p.mops.y, heart: p.mops.heart } : null,
    people: Object.fromEntries(Object.entries(p.people).map(([id, q]) => [id, { x: Math.round(q.x), y: Math.round(q.y), task: q.task || "" }])),
    isfred: { x: Math.round(p.isfred.x), y: Math.round(p.isfred.y) },
  };
}
