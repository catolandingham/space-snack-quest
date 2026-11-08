# Feedback code check (made by Hermes from a script; not reviewed yet)

Source: `docs/grok-archive/FEEDBACK-INDEX.md` sections A, B and C (64 rows), checked against the pretty-printed bundle of commit 15051ec (26,918 lines). LIVE means the text is in code the game can reach. DEAD means it is only in the old engine nothing can reach. A row marked MATCHES CLAIM shows the searched text is (or, for a should-be-absent search, is not) in live code; it does not prove the game behaves as claimed.

Rows: 64. DEAD CODE ONLY 3, FILE MISSING 1, FILE PRESENT 2, IN GIT 2, MANUAL 7, MATCHES CLAIM 33, PARTLY 2, SKIP 14

| Row | What was searched | Hits | Live lines | Dead lines | Row status |
| --- | --- | --- | --- | --- | --- |
| A1 | Account matter (repo privacy), not game code. | | | | SKIP |
| A2 | Account matter (sign-in scope), not game code. | | | | SKIP |
| A3 | Agent errors, process only. | | | | SKIP |
| A4 | Review in chat, process only. | | | | SKIP |
| A5 | A list of items; each one is checked in the B rows. | | | | SKIP |
| A6 | Build in parallel, process only. | | | | SKIP |
| A7 | `Locals still fear Sasquatches` | 1 | L19800 |  | PARTLY |
| A7 | `PROTECT THE AIR SCRUBBERS` | 1 |  | L12577 | PARTLY |
| A8 | `on purpose` | 1 | L22246 |  | MATCHES CLAIM |
| A9 | `Counter's closed. Pen's open.` | 1 | L19052 |  | MATCHES CLAIM |
| A9 | `Report him or fuel him?` | 1 | L19050 |  | MATCHES CLAIM |
| A9 | `The window caught the sink.` | 1 | L19054 |  | MATCHES CLAIM |
| A9 | `Parked you. Still no coins.` | 1 | L19056 |  | MATCHES CLAIM |
| A10 | Live playtest question, process only. | | | | SKIP |
| A11 | commit `32156c7` | | yes | | IN GIT |
| A12 | Render account matter, not game code. | | | | SKIP |
| A13 | Way of working, process only. | | | | SKIP |
| A14 | `DIRTY DISH` | 1 | L26114 |  | MATCHES CLAIM |
| A14 | `RUMBLE` | 7 | L19183 L19184 L19445 L19449 L20590 | L13614 | MATCHES CLAIM |
| A14 | `LEAVE SOUP` | 5 | L19774 L20760 L20763 L20796 L20799 |  | MATCHES CLAIM |
| A14 | `verb: "MOP"` | 2 | L19772 L22178 |  | MATCHES CLAIM |
| A15 | `ORDERS` | 2 | L20620 L25410 |  | MATCHES CLAIM |
| A16 | Way of working, process only. | | | | SKIP |
| A17 | file `docs/MASTER-BACKLOG.md` | | yes | | FILE PRESENT |
| A18 | `function sectionReset` | 1 | L19062 |  | MATCHES CLAIM |
| A18 | `Reset section` | 8 | L19089 L26717 L26734 L26745 L26749 |  | MATCHES CLAIM |
| A19 | file `docs/story-bible.md` | | yes | | FILE PRESENT |
| A19 | file `docs/STORY-DECISIONS.md` | | yes | | FILE PRESENT |
| A20 | file `story-options.html` | | no | | FILE MISSING |
| A21 | Art critique; the result is row A23. | | | | SKIP |
| A22 | Open question, see C1. | | | | SKIP |
| A23 | `verb: "COOK"` | 1 | L19696 |  | MATCHES CLAIM |
| A23 | `verb: "OPEN"` | 4 | L16283 L16759 L19732 | L12861 | MATCHES CLAIM |
| A24 | commit `15051ec` | | yes | | IN GIT |
| A24 | commit `9999f0c` | | yes | | IN GIT |
| A25 | Docs-only audit on a branch; a person checks the PR list. | | | | MANUAL |
| A26 | `MANAGER` | 7 | L17192 L18032 L23091 L23958 | L12473 L13000 L13122 | MATCHES CLAIM |
| A27 | Tests paused for allowance, process only. | | | | SKIP |
| B1 | `SKIP` | 9 | L15738 L15871 L15878 L26231 L26315 |  | MATCHES CLAIM |
| B1 | `Escape` | 6 | L17325 L26159 L26183 |  | MATCHES CLAIM |
| B2 | Collision against art needs a person or a test. | | | | MANUAL |
| B3 | `verb: "HIDE"` | 12 | L16471 L16939 L17654 L17737 L19554 | L13905 | MATCHES CLAIM |
| B4 | Bubble stacking needs a person or a test. | | | | MANUAL |
| B5 | Cone look and character size need a person. | | | | MANUAL |
| B6 | `GANITOR` | 13 | L17408 L18207 L18231 L18515 L18721 | L12808 L12814 L13123 | MATCHES CLAIM |
| B6 | `airlock` | 2 | L18438 L23897 |  | MATCHES CLAIM |
| B7 | `by: "rust"` | 1 | L19360 |  | MATCHES CLAIM |
| B8 | Line of sight is covered by tests/gas-stop.mjs, not by a string. | | | | MANUAL |
| B9 | `TANK EMPTY` | 1 | L25244 |  | MATCHES CLAIM |
| B9 | `TANK FULL` | 1 | L25244 |  | MATCHES CLAIM |
| B10 | `cap: "diner door"` | 1 | L19542 |  | MATCHES CLAIM |
| B11 | Cone hiding while Mops needs a person or a test. | | | | MANUAL |
| B12 | `by: "pump"` | 1 | L19405 |  | MATCHES CLAIM |
| B13 | `Holding pen. This section starts over.` | 1 | L19058 |  | MATCHES CLAIM |
| B14 | `A WOOKIE!` | 2 | L16342 L19482 |  | MATCHES CLAIM |
| B14 | `AAAAH` | 4 | L11838 L11839 L19454 L20785 |  | MATCHES CLAIM |
| B14 | `She thinks the goat did it.` | 1 | L19904 |  | MATCHES CLAIM |
| B15 | `Soup instead of gas.` | 2 | L19657 L19677 |  | MATCHES CLAIM |
| B16 | `k.has === "soup"` | 2 | L19689 L20376 |  | MATCHES CLAIM |
| B17 | `verb: "COOK"` | 1 | L19696 |  | MATCHES CLAIM |
| B18 | `verb: "MOP"` | 2 | L19772 L22178 |  | MATCHES CLAIM |
| B19 | `One paw. One sponge. Zero training.` | 1 | L26147 |  | MATCHES CLAIM |
| B20 | `verb: "ROLL"` | 2 | L19721 L22200 |  | MATCHES CLAIM |
| B20 | should be absent: `verb: "DUCK"` | 0 |  |  | MATCHES CLAIM |
| B21 | `stamp` | 5 | L20063 L20064 L20845 |  | MATCHES CLAIM |
| B22 | `Next stop: Phobos!` | 2 | L20167 L25359 |  | MATCHES CLAIM |
| B22 | `You watch the crate.` | 3 | L19380 L20006 L20007 |  | MATCHES CLAIM |
| B23 | `verb: "EXIT"` | 3 | L19692 L21301 L22211 |  | MATCHES CLAIM |
| B23 | `cap: "ship"` | 2 | L18822 L19576 |  | MATCHES CLAIM |
| B24 | should be absent: `Just like that first night` | 0 |  |  | MATCHES CLAIM |
| B25 | Cone look needs a person. | | | | MANUAL |
| B26 | `Locals still fear Sasquatches` | 1 | L19800 |  | MATCHES CLAIM |
| B27 | `whisper` | 55 | L15724 L16086 L16259 L17477 L17668 | L12670 L12673 L12705 | MATCHES CLAIM |
| B28 | Open decision, see C2 and C3. | | | | SKIP |
| B29 | `crib` | 10 | L11838 L14752 L16767 L16774 L18827 | L12562 L12790 L13037 | MATCHES CLAIM |
| B29 | `wook` | 44 | L12080 L14487 L14489 L16342 L16628 | L12422 L12440 L12448 L12449 L12536 | MATCHES CLAIM |
| C1 | `Ooh, my show!` | 1 | L19985 |  | MATCHES CLAIM |
| C1 | `Go watch the dock` | 1 | L20069 |  | MATCHES CLAIM |
| C2 | `SECRET!` | 1 | L15995 |  | MATCHES CLAIM |
| C2 | `CAUGHT` | 57 | L11818 L12086 L16593 L16846 L16917 | L12630 L13952 L14014 L14024 L14033 | MATCHES CLAIM |
| C3 | `Space Chili` | 6 |  | L13231 L13339 L13393 L13410 L13414 | DEAD CODE ONLY |
| C4 | `third ear` | 1 |  | L13324 | DEAD CODE ONLY |
| C4 | `1997` | 1 |  | L13325 | DEAD CODE ONLY |
| C5 | `The Guardians` | 13 | L16277 L16689 L20062 L20877 L20940 | L12839 L12847 L12867 | MATCHES CLAIM |
| C5 | `GARDIAN` | 5 | L25814 L25818 L25819 | L12868 L13028 | MATCHES CLAIM |
| C6 | `I have rings` | 1 |  | L13652 | DEAD CODE ONLY |
| C6 | `riddle` | 2 |  | L13577 L13652 | DEAD CODE ONLY |
| C7 | `Eat up, Harry` | 1 | L22377 |  | MATCHES CLAIM |
| C7 | `DANCE` | 6 | L21940 L21966 L22141 L22486 L22500 |  | MATCHES CLAIM |
| C8 | `PROTECT THE AIR SCRUBBERS` | 1 |  | L12577 | PARTLY |
| C8 | `Holding pen` | 2 | L19058 L25385 |  | PARTLY |

## Claims to check by a person

Rows whose status is not a clean match, with what the bot claimed (sections A and B) or what QA saw (section C), copied from FEEDBACK-INDEX.md.

- A7 (PARTLY): PR #3 commit 01c8d5a: Stormtop keeps fur-clog panic; gas stop line "Locals still fear Sasquatches. Troopers are the greater danger. Neither is safe."; Phobos and Mars lines; mechanics unchanged.
- A20 (FILE MISSING): story-options.html (2.1 MB) with current screenshots and labeled concept mockups; all eight decisions left open.
- A25 (MANUAL): Fresh-player Chapter 1 audit under normal controls (PR #6, docs only). Crate hide and lunch handoff judged "unclear interaction cues, not bugs"; soup BUY and boarding never reached.
- B2 (MANUAL): PR #1: closet colliders now follow the art; crate beside the G sign no longer extends below its painting.
- B4 (MANUAL): PR #3: up to three live captions, each counting down; NEXT advances one line.
- B5 (MANUAL): Gloop's peek cone darker and labeled; character size not changed ("closet zooms both, duct draws Mops smaller, large portrait is a close-up").
- B8 (MANUAL): PR #1/#2: props block space under the sprite; under and through the pump are not visible.
- B11 (MANUAL): PR #3: Mops's pink wedge and other Squatch-spot cones hidden while controlling Mops; pump-bot cones stay.
- B25 (MANUAL): PR #3: darker, labeled peek cone.
- C3 (DEAD CODE ONLY): One jar for soup, a later jar for gas; older "wash toward chili" line still in file
- C4 (DEAD CODE ONLY): Blorp startles "EEK! A Squatch near my soup!" and calls security; no pea line
- C6 (DEAD CODE ONLY): Zip is a riddle that turns on the temple laser; no song list
- C8 (PARTLY): Ch1 = scrubber alarm + star loss; Ch2 = security → pen → section restart

## Evidence (first live line for each search)

- A7 `Locals still fear Sasquatches` at L19800: `v("mops", "Locals still fear Sasquatches. Troopers are the greater danger. Neither is safe."),`
- A8 `on purpose` at L22246: `v("sq", "Trash cans. I'll use them on purpose."),`
- A9 `Counter's closed. Pen's open.` at L19052: `? [v("gloop", "Counter's closed. Pen's open."), v("sq", "I'll take it to go.")]`
- A9 `Report him or fuel him?` at L19050: `? [v("bot", "Report him or fuel him?"), v("sq", "Pancakes. Park the nozzle.")]`
- A9 `The window caught the sink.` at L19054: `? [v("gloop", "The window caught the sink."), v("sq", "Next time I roll.")]`
- A9 `Parked you. Still no coins.` at L19056: `? [v("rust", "Parked you. Still no coins."), v("sq", "I'll take the pen over the pump.")]`
- A14 `DIRTY DISH` at L26114: `g(A >= 3 ? "CLEAN DISH" : "DIRTY DISH", 480, 124, 26, "#1e2430", "center", 900),`
- A14 `RUMBLE` at L19183: `(k.rumbleT = 0),`
- A14 `LEAVE SOUP` at L19774: `? { verb: "LEAVE SOUP", x: xe.x + 10, y: xe.y - 108, r: 0, hot: !0, f: PA }`
- A14 `verb: "MOP"` at L19772: `? { verb: "MOP", x: KV.x, y: 270, r: 0, hot: !0, f: BA }`
- A15 `ORDERS` at L20620: `g("ORDERS", 650, 72, 16, "#fffaf0", "center", 900),`
- A18 `function sectionReset` at L19062: `function sectionReset() {`
- A18 `Reset section` at L19089: `g("Reset section", 810, 613, 14, "#1e2430", "center", 800));`
- A23 `verb: "COOK"` at L19696: `verb: "COOK",`
- A23 `verb: "OPEN"` at L16283: `verb: "OPEN",`
- A26 `MANAGER` at L17192: `g("MANAGER'S OFFICE", 130, 384, 11, "#8a93a3", "center", 900),`
- B1 `SKIP` at L15738: `skipping: !1,`
- B1 `Escape` at L17325: `Nh() && (l.key === "ArrowRight" ? hf("next") : l.key === "ArrowLeft" ? hf("prev") : l.key === "Escape" && hf("close"));`
- B3 `verb: "HIDE"` at L16471: `verb: "HIDE",`
- B6 `GANITOR` at L17408: `v("sq", "What's a GANITOR?"),`
- B6 `airlock` at L18438: `g("AIRLOCK", 70, 280, 14, y, "center", 900),`
- B7 `by: "rust"` at L19360: `((k.sec = { x: o.f > 0 ? 980 : -40, y: 520, hide: 0, mode: "come", by: "rust" }),`
- B9 `TANK EMPTY` at L25244: `g(k.fuel ? "TANK FULL" : "TANK EMPTY", c - 168, 74, 15, k.fuel ? "#157a45" : "#b91c1c", "center", 900));`
- B9 `TANK FULL` at L25244: `g(k.fuel ? "TANK FULL" : "TANK EMPTY", c - 168, 74, 15, k.fuel ? "#157a45" : "#b91c1c", "center", 900));`
- B10 `cap: "diner door"` at L19542: `cap: "diner door",`
- B12 `by: "pump"` at L19405: `((k.sec = { x: o.f > 0 ? 980 : -40, y: 520, hide: 0, mode: "come", by: "pump" }),`
- B13 `Holding pen. This section starts over.` at L19058: `v("bot", "Holding pen. This section starts over."),`
- B14 `A WOOKIE!` at L16342: `kV(l === "L" ? "kid" : l === "U" ? "exec" : "demo", "A WOOKIE!"));`
- B14 `AAAAH` at L11838: `"SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYxLjcuMTAzAAAAAAAAAAAAAAD/83DAAAAAAAAAAAAASW5mbwAAAA8AAAA6AAAeTQAKDg4SEhcbGx8fJCQoLCwxMTU5OT4+QkJGSkpPT1NTV1xcYGBkaWltbXFxdnp`
- B14 `She thinks the goat did it.` at L19904: `v("sq", "She thinks the goat did it.", "whisper"),`
- B15 `Soup instead of gas.` at L19657: `v("mops", "Soup instead of gas. Squatch is hungry."),`
- B16 `k.has === "soup"` at L19689: `if (i === "g4" && k.has === "soup" && hV(o, Cl.x, Cl.y + 40, 90))`
- B17 `verb: "COOK"` at L19696: `verb: "COOK",`
- B18 `verb: "MOP"` at L19772: `? { verb: "MOP", x: KV.x, y: 270, r: 0, hot: !0, f: BA }`
- B19 `One paw. One sponge. Zero training.` at L26147: `g("One paw. One sponge. Zero training.", 480, 300, 20, "#1e2430", "center", 800),`
- B20 `verb: "ROLL"` at L19721: `verb: "ROLL",`
- B21 `stamp` at L20063: `v("sq", "A hoof stamp. Mops signed it.", "whisper"),`
- B22 `Next stop: Phobos!` at L20167: `v("sq", "Next stop: Phobos!"),`
- B22 `You watch the crate.` at L19380: `kV(k.outT % 2 ? "bot" : "bot2", k.outT % 2 ? "You watch the crate." : "No, YOU watch the crate."))),`
- B23 `verb: "EXIT"` at L19692: `return { verb: "EXIT", cap: "the lot", x: 48, y: 250, r: 0, hot: !0, f: l2 };`
- B23 `cap: "ship"` at L18822: `? { verb: "BOARD", cap: "ship", x: hn.x, y: hn.y + 40, r: 0, hot: !0, f: vA }`
- B26 `Locals still fear Sasquatches` at L19800: `v("mops", "Locals still fear Sasquatches. Troopers are the greater danger. Neither is safe."),`
- B27 `whisper` at L15724: `whispered: !1,`
- B29 `crib` at L11838: `"SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYxLjcuMTAzAAAAAAAAAAAAAAD/83DAAAAAAAAAAAAASW5mbwAAAA8AAAA6AAAeTQAKDg4SEhcbGx8fJCQoLCwxMTU5OT4+QkJGSkpPT1NTV1xcYGBkaWltbXFxdnp`
- B29 `wook` at L12080: `wookie: 0,`
- C1 `Ooh, my show!` at L19985: `v("gloop", "Ooh, my show!"),`
- C1 `Go watch the dock` at L20069: `v("gloop", "Bots! Go watch the dock."),`
- C2 `SECRET!` at L15995: `? ((n.stars += 50), n.secrets++, n.sparks.push({ x: 300, y: 80, t: 2.4, s: "+50 SECRET!" }))`
- C2 `CAUGHT` at L11818: `caught: () => ji([67, 63, 60, 55], 0.2, "square"),`
- C5 `The Guardians` at L16277: `v("sq", "The Guardians came!"),`
- C5 `GARDIAN` at L25814: `Us("MY GARDIANS"),`
- C7 `Eat up, Harry` at L22377: `v("mom", "Eat up, Harry! Three dozen pretzels, and pancakes forever."),`
- C7 `DANCE` at L21940: `dance: 0,`
- C8 `Holding pen` at L19058: `v("bot", "Holding pen. This section starts over."),`
