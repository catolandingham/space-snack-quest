// Chapter 1 (scenes O0 to O9 and S1 to S12): the opening on Stormtop, the hall, the deck, the delegation, and the Chapter 1 tally.
    function qh() {
      (Object.assign(n, {
          on: !0,
          scene: "",
          room: "closet",
          q: [],
          cur: null,
          t: 0,
          bt: 0,
          T: 0,
          under: "",
          sqPose: "sit",
          ctrl: !1,
          hopTo: null,
          hopOut: -1,
          moPose: "polish",
          moMop: "lean",
          botOn: !1,
          botCone: 0,
          botSkid: 0,
          door: 0,
          doorGlow: 0,
          glowT: -1,
          puffs: [],
          tvOn: !1,
          chair: !1,
          chip: "",
          act: null,
          live: [],
          idle: 0,
          moved: 0,
          whispered: !1,
          gift: !1,
          lunch: "none",
          stars: 0,
          starOn: !1,
          secrets: 0,
          funny: 0,
          sparks: [],
          notices: 0,
          scrubbed: !1,
          alarm: !1,
          lobbyT: 0,
          flash: 0,
          furP: [],
          furVent: !1,
          ventTaught: !1,
          noteNear: !1,
          famTurn: 0,
          execTurn: 0,
          nT: {},
          lg: [],
          o5T: 0,
          botJump: -9,
          lgJump: -9,
          lobbyCatches: 0,
          lightHit: 0,
          secOn: !1,
          looked: !1,
          coneIn: !1,
          rewinds: 0,
          zzz: 0,
          log: [],
          maxB: 0,
        }),
        (n.pulse = new Set()),
        (n.found = new Set()),
        (n.sq = { x: 205, y: 438, f: 1, walk: 0, moving: !1 }),
        (n.mo = { x: 730, y: 420, f: -1, walk: 0, moving: !1 }),
        (n.bot = { x: 845, y: 470, f: -1, walk: 0, moving: !1 }),
        (n.light = { x: 820, y: 420 }),
        (n.sec = { x: 480, y: 40 }),
        (vV = []),
        (ea = []),
        (p.verb = ""),
        GV("op"),
        Tp());
    }
    function Tp() {
      ((n.scene = "O0"), J([{ k: "card", id: "jupiter", text: "Stormtop Cloud Resort, floating above Jupiter." }, uV(1.2), N(Sp)]));
    }
    function Sp() {
      ((n.scene = "O1"),
        J([
          { k: "card", id: "squatch", text: "This is Squatch. He's a Sasquatch." },
          N(() => {
            ((n.chip = "Walk around"), (n.ctrl = !0), (n.moved = 0));
          }),
          cV(() => n.moved > 110),
          N(() => {
            ((n.ctrl = !1), (n.sq.moving = !1), (n.chip = ""));
          }),
          N(Mp),
        ]));
    }
    function Mp() {
      ((n.scene = "O2a"),
        J([
          N(() => {
            n.moPose = "sway";
          }),
          uV(0.8),
          v("mops", "\u266A Hmm-hmm-hmmm... \u266A"),
          N(() => {
            ((n.ctrl = !0),
              (n.act = offer({
                id: "sing",
                verb: "SING",
                at: [0, 0],
                hot: !0,
                f: () => {
                  ((n.act = null),
                    (n.ctrl = !1),
                    (n.chip = ""),
                    (n.sqPose = "sing"),
                    (n.sq.moving = !1),
                    J([
                      v("sq", "\u266A I'm floating in space! \u266A", "song"),
                      v("mops", "\u266A Baaa-aa-aaa! \u266A", "song"),
                      N(() => {
                        n.sqPose = "stand";
                      }),
                      v("mops", "That's our song."),
                      uV(2.5),
                      N(Ep),
                    ]));
                },
              })));
          }),
        ]));
    }
    function Ep() {
      ((n.scene = "O2b"),
        J([
          N(() => {
            ((n.moPose = "stand"), (n.mo.f = 1));
          }),
          He(n.mo, 752, 424, 90),
          N(() => {
            ((n.moMop = "hand"), D.grab());
          }),
          uV(0.4),
          N(() => {
            (n.pulse.add("sign"), D.key());
          }),
          uV(0.5),
          v("mops", "Big inspection tonight. Stay put, buddy."),
          N(() => {
            n.mo.f = -1;
          }),
          v("mops", "Night, Squatch."),
          N(() => {
            (n.pulse.delete("sign"), (n.mo.f = 1));
          }),
          ta(1),
          He(n.mo, 848, 412, 110),
          N(() => {
            n.moPose = "hidden";
          }),
          ta(0),
          N(() => D.hide()),
          N(kp),
        ]));
    }
    function kp() {
      ((n.scene = "O3"),
        (n.ctrl = !0),
        (n.idle = 0),
        J([
          uV(2),
          N(() => {
            ((n.glowT = 0),
              n.pulse.add("door"),
              (n.chip = "What's that noise?"),
              (n.act = offer({
                id: "door",
                verb: "PEEK",
                who: "sq",
                x: 790,
                y: 470,
                r: 95,
                f: () => {
                  ((n.act = null),
                    (n.ctrl = !1),
                    (n.chip = ""),
                    (n.sq.moving = !1),
                    n.pulse.delete("door"),
                    J([{ k: "panel", id: "crack" }]));
                },
              })));
          }),
        ]));
    }
    function rh(l) {
      (l === "crack" &&
        ((n.under = "crack"),
        J([
          v("sq", "Robots? What are they talking about?"),
          N(() => {
            ((n.under = ""), (n.scene = "O3b"), n.pulse.add("sign"), n.pulse.add("door"));
          }),
          v("sq", "Sorry, sign.", "whisper"),
          N(() => {
            ((n.ctrl = !0),
              (n.idle = 0),
              (n.act = offer({
                id: "door",
                verb: "SNEAK OUT",
                who: "sq",
                x: 790,
                y: 470,
                r: 95,
                hot: !0,
                f: () => {
                  ((n.act = null), (n.ctrl = !1), n.pulse.clear(), (n.glowT = -1), (n.doorGlow = 0), ch());
                },
              })));
          }),
        ])),
        l === "note" &&
          J([
            v("sq", "The Guardians came!"),
            N(() => {
              ((n.chip = "Put them in your Guardian Box"),
                n.pulse.add("gbox"),
                (n.ctrl = !0),
                (n.act = offer({
                  id: "gbox",
                  verb: "OPEN",
                  who: "sq",
                  x: 350,
                  y: 545,
                  r: 95,
                  f: () => {
                    ((n.act = null),
                      (n.ctrl = !1),
                      (n.chip = ""),
                      n.pulse.delete("gbox"),
                      (n.sq.moving = !1),
                      (n.scene = "O9"),
                      J([{ k: "panel", id: "gbox" }]));
                  },
                })));
            }),
          ]),
        l === "gbox" && J([v("sq", "One more for the box. Someday I'll meet them."), uV(1), N(Ah)]));
    }
    function ch() {
      ((n.scene = "O4"),
        (n.room = "lobby"),
        (n.lg = []),
        (n.nT = {}),
        (n.sq = { x: 480, y: 560, f: 1, walk: 0, moving: !1 }),
        (n.sqPose = "stand"),
        (n.ctrl = !0),
        (n.lobbyT = 0),
        (n.notices = 0),
        (n.runner = null),
        (n.sirenT = -9),
        (n.looked = !1),
        (n.alarm = !1),
        (n.secOn = !1),
        (n.chip = ""),
        (n.sec = { x: 480, y: 40 }),
        (n.door = 0),
        (n.puffs = []),
        (n.hopTo = null),
        (vV = []));
    }
    let je = { x: 318, y: 178 };
    function hh() {
      let l = n.T;
      return [
        { k: "L", ox: 250, oy: 372, a: 0.3 + 0.5 * Math.sin(l * 0.9), half: 0.42, len: 190 },
        { k: "U", ox: 480, oy: 250, a: Math.PI / 2 + 0.75 * Math.sin(l * 0.7 + 1), half: 0.34, len: 200 },
        { k: "R", ox: 848, oy: 402, a: Math.PI - 0.25 + 0.5 * Math.sin(l * 1.1 + 2), half: 0.4, len: 190 },
      ];
    }
    function Op(l) {
      if (n.runner || n.looked) return;
      (n.notices++,
        (n.ctrl = !1),
        (n.sq.moving = !1),
        (n.spotT = n.T),
        (n.nT = { L: n.T, U: n.T, R: n.T }),
        (n.famTurn = 1),
        (n.execTurn = 1),
        (n.lightHit = 0.6),
        kV(l === "L" ? "kid" : l === "U" ? "exec" : "demo", "A WOOKIE!"));
      let o = l === "R" ? { x: 860, y: 440 } : l === "L" ? { x: 210, y: 400 } : { x: 410, y: 230 };
      ((n.runner = { k: l, x: o.x, y: o.y, v: Math.hypot(o.x - je.x, o.y - je.y + 20) / 2, pulled: -1 }),
        kV("sq", "Gulp."),
        (n.hopTo = { x: w(n.sq.x + (480 - n.sq.x) * 0.3, 120, 840), y: w(n.sq.y + (560 - n.sq.y) * 0.3, 300, 560) }),
        (n.act = dh()));
    }
    function dh() {
      return offer({
        id: "hide",
        verb: "HIDE!",
        at: [480, 575],
        hot: !0,
        f: () => {
          ((n.act = null),
            (n.ctrl = !1),
            (n.sq.moving = !0),
            (n.runner = null),
            J([
              cV((l) => ((n.sq.walk += l * 16), mV(n.sq, 480, 585, 560, l))),
              N(() => {
                ((n.sq.moving = !1), D.hide(), Gs());
              }),
            ]));
        },
      });
    }
    function wp(l) {
      let o = n.runner;
      o &&
        (o.pulled < 0
          ? mV(o, je.x, je.y + 20, o.v, l) &&
            ((o.pulled = n.T),
            (n.sirenT = n.T),
            D.alarm(),
            kV("pa", "WOOO-WOOO! SECURITY!"),
            n.log.push({ who: "", text: "[alarm pulled " + (n.T - n.spotT).toFixed(2) + "s after sighting]", kind: "t" }))
          : n.T - o.pulled > 0.5 &&
            !n.looked &&
            (Np(), n.log.push({ who: "", text: "[guard chasing " + (n.T - n.spotT).toFixed(2) + "s after sighting]", kind: "t" })));
    }
    function Np() {
      n.looked ||
        ((n.looked = !0),
        kV("sq", "Everyone's looking!"),
        (n.secOn = !1),
        n.pulse.add("cdoor"),
        yh(),
        D.alarm(),
        (n.lgGrace = n.T),
        kV("sq", "Back to the closet!"),
        (n.act = dh()));
    }
    function yh() {
      n.lg = [
        { x: 1010, y: 400, tx: 760, ty: 400 },
        { x: 89, y: 446, tx: 200, ty: 480 },
      ];
    }
    function Rp() {
      ((n.ctrl = !1),
        (n.sq.moving = !1),
        (n.lgJump = n.T),
        D.bzzt(),
        (n.lobbyCatches = (n.lobbyCatches || 0) + 1),
        J([
          v("bot", "Gotcha!"),
          N(() => {
            ((n.sq.x = 480), (n.sq.y = 520), (n.sq.f = 1), yh(), (n.lg[0].x = 1e3), (n.lgGrace = n.T + 3), (n.ctrl = !0));
          }),
        ]));
    }
    function zp(l) {
      if (
        ((n.lobbyT += l), (n.flash = Math.max(0, n.flash - l)), n.lg.length && n.ctrl && n.pulse.has("cdoor") && n.T > (n.lgGrace || 0))
      ) {
        let s = n.lg[0];
        ((s.tx = n.sq.x), (s.ty = n.sq.y), Math.hypot(s.x - n.sq.x, s.y - n.sq.y) < 46 && Rp());
      }
      for (let s of n.lg) {
        let q = s.tx - s.x,
          d = s.ty - s.y,
          A = Math.hypot(q, d);
        if (A > 2) {
          let T = Math.min(A, (s === n.lg[0] && n.pulse.has("cdoor") ? 150 : 320) * l);
          ((s.x += (q / A) * T), (s.y += (d / A) * T));
        }
      }
      let o = n.T * 1.3;
      if (((n.bot.x = 830 + Math.cos(o) * 34), (n.bot.y = 430 + Math.sin(o) * 18), n.lightHit > 0))
        ((n.light.x += (n.sq.x - n.light.x) * Math.min(1, l * 8)),
          (n.light.y += (n.sq.y - n.light.y) * Math.min(1, l * 8)),
          (n.lightHit -= l * 0.4));
      else {
        let s = n.T * 0.9;
        ((n.light.x = 790 + Math.cos(s) * 70), (n.light.y = 470 + Math.sin(s * 1.3) * 60));
      }
      if ((wp(l), n.hopTo)) {
        (mV(n.sq, n.hopTo.x, n.hopTo.y, 440, l) && ((n.hopTo = null), (n.ctrl = !0)), (n.sq.f = -n.sq.f * 0 + (n.sq.x < 480 ? 1 : -1)));
        return;
      }
      if (!n.ctrl) return;
      let i = n.sq;
      if (!n.runner && !n.looked) {
        for (let s of hh())
          if (vt(i.x, i.y - 30, s.ox, s.oy, s.a, s.half, s.len)) {
            Op(s.k);
            return;
          }
      }
    }
    function Gs() {
      ((n.scene = "O5"),
        (n.room = "closet"),
        (n.sq = { x: 760, y: 480, f: -1, walk: 0, moving: !1 }),
        (n.sqPose = "stand"),
        (n.alarm = !1),
        n.pulse.clear(),
        (n.moPose = "hidden"),
        (n.moMop = "hand"),
        (n.door = 0),
        (n.live = []),
        (vV = []),
        (n.chip = ""),
        n.pulse.add("bed"),
        (n.ctrl = !0),
        kV("sq", "Hide!"),
        (n.act = offer({
          id: "bed",
          verb: "HIDE",
          who: "sq",
          x: 220,
          y: 560,
          r: 120,
          hot: !0,
          f: () => {
            ((n.act = null),
              (n.ctrl = !1),
              (n.chip = ""),
              n.pulse.delete("bed"),
              D.hide(),
              (n.sqPose = "under"),
              (n.sq.x = 205),
              (n.sq.y = 545),
              mh());
          },
        })),
        (n.o5T = 0),
        (n.botOn = !1),
        (n.coneIn = !1));
    }
    function mh() {
      ((n.bot = { x: 845, y: 470, f: -1, walk: 0, moving: !1 }),
        (n.botSkid = 0),
        (n.botCone = 0),
        J([
          uV(0.8),
          ta(1),
          N(() => {
            ((n.botOn = !0), (n.coneIn = !0), D.zap());
          }),
          He(n.bot, 560, 470, 80),
          cV((l) => ((n.botCone += l), n.botCone > 2.2)),
          v("bot", "Security. Anyone in here?"),
          N(() => {
            ((n.coneIn = !1), (n.moPose = "stand"), (n.mo = { x: 850, y: 440, f: -1, walk: 0, moving: !1 }), D.splash());
          }),
          cV((l) => {
            let o = mV(n.mo, 700, 450, 230, l);
            return (Math.random() < 0.6 && vV.push({ x: n.mo.x - 40 + E(-12, 12), y: n.mo.y + 10 + E(-6, 6), t: 6 }), o);
          }),
          N(() => {
            ((n.botSkid = 1), D.slip());
          }),
          uV(0.7),
          v("mops", "Just me, mopping!"),
          v("bot", "...Janitor. Carry on."),
          N(() => {
            ((n.coneIn = !0), (n.bot.f = 1));
          }),
          He(n.bot, 850, 470, 110),
          N(() => {
            ((n.botOn = !1), (n.coneIn = !1));
          }),
          ta(0),
          N(bh),
        ]));
    }
    function Up() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.delete("bed"),
        (n.live = []),
        (n.bot = { x: 845, y: 470, f: -1, walk: 0, moving: !1 }),
        (n.botSkid = 0),
        n.sq.x > 700 && ((n.sq.x = 700), R0(n.sq)),
        J([
          ta(1),
          N(() => {
            ((n.botOn = !0), (n.coneIn = !1));
          }),
          He(n.bot, w(n.sq.x + 135, 300, 845), n.sq.y, 300),
          N(() => {
            ((n.botJump = n.T), D.alarm(), (n.sqPose = "stand"));
          }),
          v("bot", "Gotcha!"),
          N(() => {
            ((n.botOn = !1), (n.door = 0), Gs());
          }),
        ]));
    }
    function Dp() {
      (n.rewinds++,
        (n.q = []),
        (n.cur = null),
        (n.coneIn = !1),
        (n.sqPose = "stand"),
        (n.sq.x = 300),
        (n.sq.y = 560),
        kV("bot", "Huh?"),
        (n.botJump = n.T),
        D.bzzt(),
        J([
          cV(() => n.live.length === 0),
          N(() => {
            ((n.sqPose = "under"), (n.sq.x = 205), (n.sq.y = 545), (n.moPose = "hidden"), (n.botOn = !1), (n.door = 0), (vV = []));
          }),
          N(mh),
        ]));
    }
    function bh() {
      ((n.scene = "O6"),
        J([
          N(() => {
            ((n.sqPose = "stand"), (n.sq.x = 330), (n.sq.y = 562), (n.sq.f = 1), (n.moPose = "pant"), (n.mo.f = -1), D.hide());
          }),
          uV(0.8),
          v("mops", "You went OUT? Tonight?"),
          v("sq", "I wanted to see the robots."),
          v("mops", "Curious gets you caught."),
          v("mops", "We stay hidden. That's how we stay safe."),
          v("mops", "Back to work. Stay put."),
          N(() => {
            ((n.moPose = "stand"), (n.mo.f = 1));
          }),
          ta(1),
          He(n.mo, 848, 420, 110),
          N(() => {
            n.moPose = "hidden";
          }),
          ta(0),
          N(() => {
            ((n.tvOn = !0), D.zap());
          }),
          uV(1),
          N(ph),
        ]));
    }
    function ph() {
      ((n.scene = "O7"),
        n.pulse.add("tv"),
        (n.ctrl = !0),
        (n.act = offer({
          id: "tv",
          verb: "WATCH",
          who: "sq",
          x: 615,
          y: 400,
          r: 120,
          f: () => {
            ((n.act = null),
              (n.ctrl = !1),
              (n.sq.moving = !1),
              n.pulse.delete("tv"),
              J([
                { k: "card", id: "fb", text: "Years ago, on Stormtop..." },
                { k: "fb", pic: "tour", cap: "A Wookie tour group came to visit Stormtop." },
                { k: "fb", pic: "shed", cap: "They shed. A LOT." },
                { k: "fb", pic: "clog", cap: "The fur clogged the air scrubbers. Everyone gasped for air!" },
                { k: "fb", pic: "clog", cap: "*gasp*" },
                N(() => {
                  ((n.fbPic = "banish"), (n.banT = n.T));
                }),
                v("official", "Nobody can live outside. The scrubbers keep us breathing. NO FUR.", "say"),
                { k: "card", id: "fb", text: "Now" },
                N(() => {
                  ((n.fbPic = ""), (n.tvOn = !1));
                }),
                N(Cp),
              ]));
          },
        })));
    }
    function Cp() {
      ((n.scene = "O8"),
        J([
          N(() => {
            (n.pulse.add("bed"),
              (n.ctrl = !0),
              (n.act = offer({
                id: "bed",
                verb: "SLEEP",
                who: "sq",
                x: 220,
                y: 560,
                r: 130,
                f: () => {
                  ((n.act = null),
                    (n.ctrl = !1),
                    n.pulse.delete("bed"),
                    (n.sq.moving = !1),
                    (n.sqPose = "sleep"),
                    (n.zzz = 0),
                    J([
                      cV((l) => ((n.zzz += l), n.zzz > 2)),
                      N(() => {
                        ((n.chair = !0),
                          (n.moPose = "sleep"),
                          (n.moMop = "lean"),
                          (n.mo = { x: 640, y: 470, f: -1, walk: 0, moving: !1 }),
                          (n.gift = !0),
                          (n.sqPose = "sit"),
                          D.pickup(),
                          n.pulse.add("gift"),
                          (n.ctrl = !0),
                          (n.act = offer({
                            id: "gift",
                            verb: "GRAB",
                            at: [0, 0],
                            f: () => {
                              ((n.act = null),
                                (n.ctrl = !1),
                                (n.gift = !1),
                                n.pulse.delete("gift"),
                                (n.holdToy = !0),
                                D.pickup(),
                                J([
                                  uV(0.4),
                                  v("sq", "A toy rocket! From the Guardians!"),
                                  N(() => {
                                    n.holdToy = !1;
                                  }),
                                  { k: "panel", id: "note" },
                                ]));
                            },
                          })));
                      }),
                    ]));
                },
              })));
          }),
        ]));
    }
    function Ah() {
      ((n.scene = "S1"),
        J([
          N(() => {
            ((n.moPose = "yawn"), D.snore());
          }),
          uV(0.8),
          N(() => {
            ((n.chair = !1),
              (n.moPose = "stand"),
              (n.mo.x = 680),
              (n.mo.y = 470),
              (n.mo.f = -1),
              (n.moMop = "hand"),
              (n.sqPose = "stand"),
              (n.sq.x = 300),
              (n.sq.y = 565),
              (n.sq.f = 1));
          }),
          uV(0.5),
          v("mops", "Off to work, buddy. Stay put!"),
          N(() => {
            n.mo.f = 1;
          }),
          ta(1),
          He(n.mo, 848, 420, 120),
          N(() => {
            n.moPose = "hidden";
          }),
          ta(0),
          N(() => {
            ((n.lunch = "shelf"), n.pulse.add("lunch"));
          }),
          uV(0.6),
          v("sq", "He forgot his lunch!"),
          N(() => {
            ((n.chip = "Bring Mops his lunch"), (n.ctrl = !0));
          }),
        ]));
    }
    // Chapter 1's spots, scene by scene, in the order each picker tries them (see spot in 00-core.js).
    function ch1Spots() {
      let l = n.scene;
      return l === "S1"
        ? s1Spots()
        : l === "S1L"
          ? s1lSpots()
          : l === "S2"
            ? s2Spots()
            : l === "S4"
              ? s4Spots()
              : l === "S5"
                ? s5Spots()
                : l === "S6"
                  ? s6Spots()
                  : l === "S7"
                    ? s7Spots()
                    : l === "S7b"
                      ? s7bSpots()
                      : l === "S9"
                        ? s9Spots()
                        : l === "S10"
                          ? s10Spots()
                          : l === "S10d"
                            ? s10dSpots()
                            : l === "S11"
                              ? s11Spots()
                              : l === "S12"
                                ? s12Spots()
                                : [];
    }
    function s1Spots() {
      return [
        spot({
          id: "lunch",
          verb: "GRAB",
          who: "sq",
          x: 470,
          y: 400,
          r: 80,
          at: [485, 330],
          when: n.lunch === "shelf",
          f: () => {
            ((n.lunch = "held"), n.pulse.delete("lunch"), n.pulse.add("door"), D.grab());
          },
        }),
        spot({
          id: "stash",
          verb: "OPEN",
          who: "sq",
          x: 462,
          y: 400,
          r: 80,
          at: [462, 380],
          when: !n.found.has("stash") && n.lunch === "held",
          f: () => {
            (D.pickup(), ee("secret", "stash", 462, 300), TV([v("sq", "Mops's emergency Moon Pies!")]));
          },
        }),
        spot({
          id: "crib",
          verb: "PULL",
          who: "sq",
          x: 560,
          y: 560,
          r: 80,
          at: [560, 500],
          when: !n.found.has("crib"),
          f: () => {
            (D.grab(), ee("funny", "crib", 560, 460), TV([v("sq", "My baby bed! A mop bucket. Still smells like lemons.")]));
          },
        }),
        spot({
          id: "sched",
          verb: "LOOK",
          who: "sq",
          x: 200,
          y: 400,
          r: 90,
          at: [200, 200],
          when: !n.found.has("sched"),
          f: () => {
            ((n.ctrl = !1),
              (n.act = null),
              (n.sq.moving = !1),
              n.found.add("sched"),
              J([
                { k: "panel", id: "sched" },
                v("sq", "Moon Pie day!"),
                N(() => {
                  n.ctrl = !0;
                }),
              ]));
          },
        }),
        spot({
          id: "sched",
          verb: "LOOK",
          who: "sq",
          x: 200,
          y: 400,
          r: 90,
          at: [200, 200],
          when: n.found.has("sched"),
          f: () => {
            ((n.ctrl = !1),
              (n.act = null),
              (n.sq.moving = !1),
              J([
                { k: "panel", id: "sched" },
                N(() => {
                  n.ctrl = !0;
                }),
              ]));
          },
        }),
        spot({
          id: "door",
          verb: "SNEAK OUT",
          who: "sq",
          x: 790,
          y: 470,
          r: 100,
          at: [845, 250],
          when: n.lunch === "held",
          hot: !0,
          f: () => {
            ((n.ctrl = !1), n.pulse.clear(), (n.act = null), J([ta(1), C2(845, 430, 220), B2(), N(Mh)]));
          },
        }),
      ];
    }
    function Bp() {
      return pick(s1Spots());
    }
    let qn = [
        { kind: "plant", x: 170, y: 470 },
        { kind: "box", x: 560, y: 250 },
        { kind: "plant", x: 830, y: 455 },
      ],
      Hs = { x: 790, y: 232 },
      gh = { x: 480, y: 560 },
      Aa = { x: 40, y: 340 },
      Ls = 185,
      z0 = 0.62,
      aV = {
        ventHit: !1,
        tour: [],
        spot: -1,
        seen: !1,
        alertBy: -1,
        sec: { x: Aa.x, y: Aa.y, on: !1, mode: "", t: 0, lx: 0, ly: 0 },
        caught: 0,
        sneaky: 0,
        sightings: 0,
        done: !1,
        swoop: !1,
      };
    function Ps(l, o, i) {
      let s = l.x,
        q = l.y - 30,
        d = o - s,
        A = i - q,
        T = Math.hypot(d, A);
      return T > Ls || T < 1 || A >= 0 ? !1 : Math.acos(-A / T) <= z0;
    }
    let ff = { x: 118, y: 236 },
      yo = { x: 900, y: 236 };
    function xh(l, o, i) {
      (m(l - 22, o - 30, 44, 54, 5),
        r(i && Math.sin(n.T * 18) > 0 ? "#ff9a8a" : "#e5533d", 3),
        m(l - 14, o - 22, 28, 14, 3),
        r("#ffffff", 2),
        g("ALARM", l, o - 15, 9, "#e5533d", "center", 900),
        C([l, o, l, o + (i ? 18 : 6)], y, 4),
        L(l, o + (i ? 18 : 6), 5),
        r("#ffcf33", 2));
    }
    function vh(l, o, i, s) {
      ((l.run = { ax: o, ay: i, v: Math.hypot(l.x - o, l.y - i) / s, pulled: -1, x0: l.x, y0: l.y, fired: !1 }), (n.spotT = n.T));
    }
    function Th(l, o, i) {
      let s = l.run;
      s &&
        (s.pulled < 0
          ? mV(l, s.ax, s.ay, s.v, o) &&
            ((s.pulled = n.T),
            (n.sirenT = n.T),
            D.alarm(),
            kV("pa", "WOOO-WOOO! SECURITY!"),
            n.log.push({ who: "", text: "[alarm pulled " + (n.T - n.spotT).toFixed(2) + "s after sighting]", kind: "t" }))
          : s.fired
            ? mV(l, s.x0, s.y0, 260, o) && (l.run = null)
            : n.T - s.pulled > 0.5 &&
              ((s.fired = !0),
              i(),
              n.log.push({ who: "", text: "[guard chasing " + (n.T - n.spotT).toFixed(2) + "s after sighting]", kind: "t" })));
    }
    function Sh() {
      ((aV.tour = [
        { x: 300, y: 430, x0: 300, x1: 300, sp: 0, dir: 1, pause: 0, alert: 0, col: "#7fd1ff", hair: "#8b5a3c", home: 300 },
        { x: 460, y: 420, x0: 460, x1: 800, sp: 55, dir: 1, pause: 1.2, alert: 0, col: "#ff8fc0", hair: "#ffcf33", home: 460 },
      ]),
        (aV.ventHit = !1),
        (aV.spot = -1),
        (aV.seen = !1),
        (aV.alertBy = -1),
        (aV.done = !1),
        (aV.swoop = !1),
        Object.assign(aV.sec, { x: Aa.x, y: Aa.y, on: !1, mode: "", t: 0 }),
        (n.sq = { x: gh.x, y: gh.y, f: 1, walk: 0, moving: !1 }),
        (n.sqPose = "stand"),
        (n.lunch = "held"),
        (n.live = []),
        (n.mo = { x: Hs.x, y: Hs.y, f: -1, walk: 0, moving: !1 }),
        (n.moPose = "stand"),
        (n.moMop = "hand"),
        (n.chip = "Bring Mops his lunch"),
        (n.ctrl = !0),
        (n.act = null),
        n.pulse.clear());
    }
    function Mh() {
      ((n.scene = "S1L"), (n.room = "deck"), (n.door = 0), (n.live = []), (vV = []), (aV.caught = 0), (aV.sightings = 0), Sh(), D.hide());
    }
    function Gp(l) {
      let o = qn[l];
      ((aV.spot = l), (n.sqPose = "hidden"), (n.sq.x = o.x), (n.sq.y = o.y + 6), (n.sq.moving = !1), D.hide());
    }
    function Qs() {
      n.sqPose === "hidden" && ((n.sqPose = "stand"), (n.sq.y = Math.min(590, n.sq.y + 26)), (aV.spot = -1));
    }
    function s1lSpots() {
      return [
        spot({ id: "leave", verb: "LEAVE", who: "sq", at: [n.sq.x, n.sq.y - 30], when: n.sqPose === "hidden", f: Qs }),
        ...qn.map((i, l) =>
          spot({
            id: "spot" + l,
            verb: "HIDE",
            who: "sq",
            x: i.x,
            y: i.y + 6,
            r: 78,
            at: [i.x, i.y - 30],
            when: n.sqPose !== "hidden",
            hot: aV.sec.mode === "rush" || aV.alertBy >= 0,
            f: () => Gp(l),
          }),
        ),
      ];
    }
    function Hp() {
      return pick(s1lSpots());
    }
    function Lp(l) {
      let o = aV.tour[l];
      ((o.alert = 1),
        (aV.alertBy = l),
        (aV.seen = !0),
        aV.sightings++,
        kV("tourist", "WOOKIE!"),
        n.sparks.push({ x: o.x - 58, y: o.y - 140, t: 2.2, s: "!" }));
      for (let i of aV.tour) i.alert = 1;
      for (let i = 0; i < qn.length; i++) n.pulse.add("spot" + i);
      vh(o, ff.x + 4, ff.y + 120, 1.7);
    }
    function Pp() {
      ((aV.ventHit = !0),
        fq(Ia.x, Ia.y),
        (n.furVent = !0),
        (aV.seen = !0),
        aV.sightings++,
        D.alarm(),
        kV("pa", "FUR IN THE VENT!"),
        Object.assign(aV.sec, { x: Aa.x, y: Aa.y, on: !0, mode: "rush", t: 0, lx: n.sq.x, ly: n.sq.y }));
      for (let l = 0; l < qn.length; l++) n.pulse.add("spot" + l);
    }
    let Eh = [
        ["Just a fuzzy mop! Very fuzzy.", "Shedding season."],
        ["Nothing to see! Just my rug.", "It walks. Fancy rug."],
        ["Whoa! Biggest dust bunny EVER.", "I'll mop it up!"],
        ["That's my mop's winter coat.", "Very fashionable."],
      ],
      Qp = 0;
    function kh() {
      let l = Eh[Qp++ % Eh.length];
      return [v("mops", l[0]), v("mops", l[1])];
    }
    function Yp() {
      ((aV.sec.mode = "caught"), (n.ctrl = !1), (n.act = null), (n.sq.moving = !1), (n.live = []), (aV.swoop = !0), D.bzzt());
      let l = n.sq.x + (n.sq.x > 480 ? -70 : 70),
        o = n.sq.y + 4;
      J([
        cV((i) => {
          let s = mV(n.mo, l, o, 520, i);
          return ((n.mo.f = n.sq.x > n.mo.x ? 1 : -1), Math.random() < 0.7 && vV.push({ x: n.mo.x + E(-14, 14), y: n.mo.y + 4, t: 4 }), s);
        }),
        ...kh(),
        N(() => {
          let i = n.starOn;
          ((n.stars = Math.max(0, n.stars - 100)), aV.caught++, i && n.sparks.push({ x: 300, y: 80, t: 2.4, s: "\u2212100 CAUGHT" }), Sh());
        }),
      ]);
    }
    function Ip() {
      ((aV.done = !0),
        (n.ctrl = !1),
        (n.act = null),
        (n.chip = ""),
        (n.sq.moving = !1),
        (n.mo.f = n.sq.x > n.mo.x ? 1 : -1),
        aV.seen ||
          (n.found.add("sneak-s1"),
          (n.starOn = !0),
          (n.stars += 100),
          aV.sneaky++,
          n.sparks.push({ x: 300, y: 80, t: 2.4, s: "+100 SNEAKY!" }),
          D.pickup()),
        J([uV(1.2), C2(n.room === "hall" ? B.camX + c + 60 : c + 60, n.sq.y), B2(), N(Oh)]));
    }
    function Kp(l) {
      let o = aV.sec;
      for (let i of aV.tour)
        Th(i, l, () => {
          (Object.assign(aV.sec, { x: Aa.x, y: Aa.y, on: !0, mode: "rush", t: 0, lx: n.sq.x, ly: n.sq.y }), D.alarm());
        });
      for (let i of aV.tour)
        i.alert > 0 ||
          (i.sp > 0 &&
            (i.pause > 0
              ? (i.pause -= l)
              : ((i.x += i.dir * i.sp * l),
                i.x >= i.x1
                  ? ((i.x = i.x1), (i.dir = -1), (i.pause = 2.2))
                  : i.x <= i.x0 && ((i.x = i.x0), (i.dir = 1), (i.pause = 2.2)))));
      if (!aV.swoop && !aV.done) {
        let i = Hs.x + Math.sin(n.T * 1.4) * 26;
        ((n.mo.f = i > n.mo.x ? 1 : -1),
          (n.mo.x = i),
          (n.mo.walk += l * 8),
          (n.mo.moving = !0),
          Math.random() < l * 6 && vV.push({ x: n.mo.x - 30 * n.mo.f, y: n.mo.y + 6, t: 5 }));
      } else n.mo.moving = !1;
      for (let i of vV) i.t -= l * 0.2;
      if (o.on) {
        let i = n.sqPose === "hidden";
        if (o.mode === "rush") {
          i || ((o.lx = n.sq.x), (o.ly = n.sq.y));
          let s = mV(o, o.lx, o.ly, 125, l);
          if (!i && Math.hypot(o.x - n.sq.x, o.y - n.sq.y) < 60) {
            Yp();
            return;
          }
          s && i && ((o.mode = "look"), (o.t = 1.8));
        } else if (o.mode === "look") {
          if (((o.t -= l), !i && Math.hypot(o.x - n.sq.x, o.y - n.sq.y) < 130)) {
            o.mode = "rush";
            return;
          }
          o.t <= 0 && (o.mode = "leave");
        } else if (o.mode === "leave") {
          if (!i && Math.hypot(o.x - n.sq.x, o.y - n.sq.y) < 130) {
            o.mode = "rush";
            return;
          }
          if (mV(o, Aa.x, Aa.y, 130, l)) {
            ((o.on = !1), (o.mode = ""));
            for (let s of aV.tour) s.alert = 0;
            aV.alertBy = -1;
            for (let s = 0; s < qn.length; s++) n.pulse.delete("spot" + s);
          }
        }
        return;
      }
      if (!(!n.ctrl || aV.done) && n.sqPose !== "hidden") {
        if (aV.alertBy < 0) {
          for (let i = 0; i < aV.tour.length; i++)
            if (!aV.tour[i].run && Ps(aV.tour[i], n.sq.x, n.sq.y)) {
              Lp(i);
              return;
            }
        }
        if (!aV.ventHit && aV.sec.mode !== "rush" && Math.hypot(n.sq.x - Ia.x, n.sq.y - Ia.y) < 60) {
          Pp();
          return;
        }
        Math.hypot(n.sq.x - n.mo.x, n.sq.y - n.mo.y) < 110 && Ip();
      }
    }
    function uf(l, o) {
      (n.on && n.sqPose !== "hidden" && Math.abs(n.sq.x - l) < 56 && n.sq.y < o && n.sq.y > o - 120 && (e.globalAlpha = 0.45),
        Xp(l, o),
        (e.globalAlpha = 1));
    }
    function Xp(l, o) {
      (m(l - 22, o - 30, 44, 34, 6), r("#e98a4a", 3));
      for (let [i, s, q] of [
        [-22, -62, 22],
        [22, -62, 22],
        [0, -84, 26],
        [-12, -46, 20],
        [12, -46, 20],
      ])
        (XV(l + i, o + s, q, q * 0.9, 9, 3, 0), wV("#2bc48a", 2.5));
    }
    function Ys(l, o) {
      (m(l - 44, o - 46, 88, 50, 4),
        r("#cdbb98", 3),
        m(l - 30, o - 88, 60, 44, 4),
        r("#d9c7a3", 3),
        C([l - 44, o - 30, l + 44, o - 30], "#a8916b", 2),
        C([l - 30, o - 72, l + 30, o - 72], "#a8916b", 2));
    }
    function ga(l, o) {
      let i = Math.sin(n.T * 2.3) > 0.94 ? 0.25 : 1;
      for (let s of [-9, 9]) (X(l + s, o, 6, 6 * i), r("#ffffff", 2), F(l + s + 1, o + 1, 2.4, y));
    }
    function sf(l) {
      let o = l.sp > 0 && l.pause <= 0 && l.alert === 0 ? Math.abs(Math.sin(n.T * 8)) * 3 : 0;
      (l.alert > 0
        ? (Qt(l.x, l.y - o, l.col, 1.6, n.sq.x > l.x ? 1 : -1), X(l.x, l.y - 58, 4, 5), r(y, 0))
        : (Qt(l.x, l.y - o, l.col, 1.6, 0), L(l.x, l.y - 64 - o, 16.5), r(l.hair, 2.5)),
        Of(l.x, l.y - 112, l.alert > 0));
    }
    function jp() {
      ((e.fillStyle = "#f1f3f6"), e.fillRect(0, 0, c, b), (e.strokeStyle = "#e2e6ec"), (e.lineWidth = 1));
      for (let o = 0; o <= c; o += 60) (e.beginPath(), e.moveTo(o, 160), e.lineTo(o, b), e.stroke());
      for (let o = 160; o <= b; o += 60) (e.beginPath(), e.moveTo(0, o), e.lineTo(c, o), e.stroke());
      ((e.fillStyle = "#ffffff"), e.fillRect(0, 0, c, 160), C([0, 160, c, 160], y, 4), m(Ia.x - 34, Ia.y - 10, 68, 22, 3), r("#dfe4ea", 3));
      for (let o = 0; o < 6; o++) C([Ia.x - 26 + o * 10, Ia.y - 6, Ia.x - 26 + o * 10, Ia.y + 8], y, 2);
      (e.save(), m(40, 14, 880, 132, 12), e.clip(), (e.fillStyle = "#2b3a67"), e.fillRect(40, 14, 880, 132));
      for (let o = 0; o < 30; o++) F(50 + ((o * 97) % 860), 22 + ((o * 41) % 110), 1.6, "#fff");
      (Ut("jupiter", 420, 300, 250), e.restore(), m(40, 14, 880, 132, 12), r(null, 5));
      for (let o of [260, 480, 700]) C([o, 14, o, 146], y, 4);
      (m(0, Aa.y - 70, 34, 120, 4), r("#59657d", 4), m(326, 590, 68, 40, 4), r("#dfe4ea", 3.5));
      for (let o = 0; o < 6; o++) C([336 + o * 10, 596, 336 + o * 10, 624], y, 2);
      (m(432, 596, 96, 44, 6), r("#ffffff", 4), g("CLOSET", 480, 616, 12, "#8a93a3"));
      for (let o of vV) (X(o.x, o.y, 16, 6), (e.fillStyle = "rgba(63,184,240," + (Math.min(1, o.t / 3) * 0.28).toFixed(3) + ")"), e.fill());
      (e.save(), e.beginPath(), e.rect(0, 160, c, b - 160), e.clip());
      for (let o of aV.tour) {
        if (o.run) continue;
        let i = o.x,
          s = o.y - 30;
        (e.beginPath(),
          e.moveTo(i, s),
          e.arc(i, s, Ls, -Math.PI / 2 - z0, -Math.PI / 2 + z0),
          e.closePath(),
          (e.fillStyle = o.alert > 0 ? "rgba(229,83,61,.20)" : "rgba(130,160,255,.13)"),
          e.fill(),
          e.setLineDash([3, 6]),
          (e.strokeStyle = "rgba(70,90,160,.6)"),
          (e.lineWidth = 1.5),
          e.stroke(),
          e.setLineDash([]));
      }
      (e.restore(), xh(ff.x, ff.y, aV.tour.some((o) => !!o.run && o.run.pulled >= 0) || aV.sec.on));
      let l = [];
      qn.forEach((o, i) =>
        l.push({
          y: o.y,
          d: () => {
            (n.pulse.has("spot" + i) ? ringOf("spot" + i) : ringNear("spot" + i),
              o.kind === "plant" ? uf(o.x, o.y) : Ys(o.x, o.y),
              n.sqPose === "hidden" && aV.spot === i && ga(o.x, o.kind === "plant" ? o.y - 52 : o.y - 50));
          },
        }),
      );
      for (let o of aV.tour) l.push({ y: o.y, d: () => sf(o) });
      (l.push({ y: n.mo.y, d: () => Fe(n.mo.x, n.mo.y, he * 1.15, { f: n.mo.f, walk: n.mo.moving ? n.mo.walk : 0, mop: !0 }) }),
        aV.sec.on &&
          l.push({
            y: aV.sec.y,
            d: () => {
              let o = aV.sec;
              (X(o.x + 40, o.y + 6, 46, 18),
                (e.fillStyle = "rgba(255,234,120,.5)"),
                e.fill(),
                hq(o.x, o.y, o.lx < o.x ? -1 : 1),
                o.mode === "look" && g("?", o.x + 30, o.y - 90, 30, "#3478f6", "center", 900));
            },
          }),
        n.sqPose !== "hidden" &&
          l.push({
            y: n.sq.y,
            d: () => Re(n.sq.x, n.sq.y, he, { walk: n.sq.moving ? n.sq.walk : 0, f: n.sq.f, carry: n.lunch === "held" }),
          }),
        l.sort((o, i) => o.y - i.y).forEach((o) => o.d()),
        n.T - (n.sirenT ?? -9) < 2.5 && Math.sin(n.T * 14) > 0 && ((e.fillStyle = "rgba(229,83,61,.16)"), e.fillRect(0, 0, c, b)),
        aV.sec.mode === "rush" &&
          ((e.strokeStyle = Math.sin(n.T * 12) > 0 ? "#e5533d" : "#ffcf33"), (e.lineWidth = 8), e.strokeRect(4, 4, c - 8, b - 8)));
    }
    let aa = { x1: 260, y1: 400, door0: 280, door1: 390 },
      na = { x0: 1180, y0: 400, door0: 430, door1: 590 },
      _p = [
        { x0: 254, x1: 266, y0: 160, y1: 280 },
        { x0: 254, x1: 266, y0: 390, y1: 406 },
        { x0: 0, x1: 266, y0: 394, y1: 406 },
        { x0: 1174, x1: 1440, y0: 394, y1: 406 },
        { x0: 1174, x1: 1186, y0: 394, y1: 430 },
        { x0: 1174, x1: 1186, y0: 590, y1: 640 },
      ];
    function Fp() {
      ((e.fillStyle = "#ece6f5"),
        e.fillRect(0, 160, aa.x1, aa.y1 - 160),
        g("MANAGER'S OFFICE", 130, 384, 11, "#8a93a3", "center", 900),
        (e.fillStyle = "#e8e2d4"),
        e.fillRect(na.x0, na.y0, 260, 240),
        g("STORAGE", 1325, 420, 12, "#8a93a3", "center", 900));
      let l = (o, i, s, q) => {
        (m(Math.min(o, s) - 5, Math.min(i, q) - 5, Math.abs(s - o) + 10, Math.abs(q - i) + 10, 3), r("#b5bcc8", 3));
      };
      (l(aa.x1, 160, aa.x1, aa.door0),
        l(aa.x1, aa.door1, aa.x1, aa.y1),
        l(0, aa.y1, aa.x1, aa.y1),
        l(na.x0, na.y0, 1440, na.y0),
        l(na.x0, na.y0, na.x0, na.door0),
        l(na.x0, na.door1, na.x0, 640));
    }
    let HV = { x: 680, y: 84 },
      xa = 1440,
      qf = 22,
      DV = { x: 1300, y: 505 },
      SV = { x: 1110, y: 572 },
      ne = { x: 900, y: 340 },
      te = { x: 1070, top: 146, bot: 300 },
      B = {
        camX: 0,
        ship: 0,
        ramp: 0,
        bots: [],
        jans: [],
        slip: { x: 0, y: 0, r: 0, on: !1 },
        halves: [],
        crate: !1,
        signed: !1,
        gave: !1,
        photoNear: !1,
        certNear: !1,
        p23T: 0,
        held: !1,
        sign: 0,
        gustT: -9,
        mars: !1,
        point: !1,
        nextBeat: "S2",
        log: [],
        freakT: -9,
        freak: { x: 0, y: 0 },
      };
    function rf(l) {
      return { x: 72 + (l % 12) * 44, y: 24 + Math.floor(l / 12) * 32 };
    }
    function mo(l, o = 520) {
      return cV((i) => {
        let s = l - B.camX;
        return Math.abs(s) <= o * i ? ((B.camX = l), !0) : ((B.camX += Math.sign(s) * o * i), !1);
      });
    }
    function rn(l, o) {
      let i = 0;
      return cV((s) => ((i = Math.min(o, i + s)), l(i / o), i >= o));
    }
    function Oh() {
      ((n.scene = "S2"),
        (n.room = "hall"),
        (n.live = []),
        (vV = []),
        n.pulse.clear(),
        (n.act = null),
        Object.assign(B, {
          camX: 0,
          ship: 0,
          ramp: 0,
          bots: [],
          jans: [],
          halves: [],
          crate: !1,
          signed: !1,
          gave: !1,
          photoNear: !1,
          certNear: !1,
          p23T: 0,
          held: !1,
          sign: 0,
          gustT: -9,
        }),
        (B.slip = { x: 0, y: 0, r: 0, on: !1 }),
        (B.held = !1),
        (B.sign = 0),
        (B.gustT = -9),
        (n.mo = { x: 330, y: 250, f: 1, walk: 0, moving: !1 }),
        (n.moPose = "stand"),
        (n.moMop = "hand"),
        (n.sq = { x: 560, y: 380, f: -1, walk: 0, moving: !1 }),
        (n.sqPose = "stand"),
        (n.lunch = "held"),
        (n.ctrl = !0),
        (n.chip = ""));
    }
    let cf = 6,
      U0 = 0;
    function hf(l) {
      if (!(!n.cur || n.cur.k !== "panel" || n.cur.id !== "gallery")) {
        if (l === "close" || (l === "next" && U0 >= cf - 1)) {
          ((n.cur = null), D.key());
          return;
        }
        ((U0 = w(U0 + (l === "next" ? 1 : -1), 0, cf - 1)), D.key(), (n.panelT = 0));
      }
    }
    function Nh() {
      return !!n.cur && n.cur.k === "panel" && n.cur.id === "gallery";
    }
    window.addEventListener("keydown", (l) => {
      Nh() && (l.key === "ArrowRight" ? hf("next") : l.key === "ArrowLeft" ? hf("prev") : l.key === "Escape" && hf("close"));
    });
    function Jp() {
      let l = [
        "MARCH: sneezed mid-flash",
        "APRIL: mop in his beard",
        'MAY: "is it on?"',
        "JUNE: bee on his nose",
        "JULY: both eyes shut",
        "AUGUST: tiny Squatch photobomb",
      ];
      (e.save(),
        e.translate(480, 320),
        m(-300, -230, 600, 460, 16),
        r("#59657d", 5),
        m(-280, -210, 560, 420, 10),
        r("#fffdf3", 3),
        g("EMPLOYEE OF THE MONTH", 0, -178, 20, "#c9a227", "center", 900),
        e.save(),
        e.translate(0, -10),
        e.scale(7, 7),
        Tf(0, 0, !1),
        e.restore());
      let o = U0;
      if (o === 0) {
        for (let i = 0; i < 6; i++) F(-30 + i * 12, 40 + (i % 2) * 6, 4, "#8fdcff");
        g("ACHOO!", 120, -60, 22, "#e5533d", "center", 900);
      }
      if (o === 1) {
        C([-60, 50, 60, 30], "#8b5a3c", 8);
        for (let i = 0; i < 7; i++) C([60 + i * 4, 30, 70 + i * 6, 60], "#cdbb98", 4);
      }
      (o === 2 && (L(0, 30, 14), r("#2a2f3a", 2), g("?", 110, -70, 40, y, "center", 900)),
        o === 3 && (X(0, -6, 10, 7), r("#ffcf3a", 2), C([-4, -6, -4, -12], y, 2), C([4, -6, 4, -12], y, 2)),
        o === 4 &&
          (m(-40, -20, 30, 10, 2),
          r("#e8f4ff", 0),
          m(10, -20, 30, 10, 2),
          r("#e8f4ff", 0),
          C([-38, -14, -14, -14], y, 3),
          C([14, -14, 38, -14], y, 3)),
        o === 5 && (e.save(), e.translate(150, 60), e.scale(0.6, 0.6), Re(0, 0, he, { walk: 0, f: -1 }), e.restore()),
        g(l[o], 0, 150, 16, y, "center", 800),
        g(o + 1 + " / " + cf, 0, 182, 13, "#8a93a3", "center", 800),
        o > 0 && g("\u2039", -255, 0, 54, "#59657d", "center", 900),
        o < cf - 1 && g("\u203A", 255, 0, 54, "#59657d", "center", 900),
        L(262, -192, 20),
        r("#e5533d", 3),
        g("\u2715", 262, -186, 18, "#ffffff", "center", 900),
        e.restore());
    }
    // Hall spots that sit on the gallery wall: a strip of floor under the picture. The strip's top is
    // the hall floor's top edge, so it covers every place the old test (x near, y above a line) did.
    function wallBox(l, o, i) {
      return { x0: l - o, x1: l + o, y0: 190, y1: i };
    }
    // The gallery wall: LOOK anywhere along it. In S6 the strip has a hole near the terminal, as before.
    function gallerySpot(l) {
      return spot({
        id: "gallery",
        verb: "LOOK",
        who: "sq",
        box: { x0: 50, x1: 620, y0: 190, y1: 250 },
        not: l,
        at: [n.sq.x, 230],
        f: () => {
            ((U0 = 0),
              (n.ctrl = !1),
              (n.act = null),
              (n.sq.moving = !1),
              J([
                { k: "panel", id: "gallery" },
                N(() => {
                  n.ctrl = !0;
                }),
              ]));
          },
      });
    }
    function s2Spots() {
      let o = rf(qf);
      return [
        spot({
          id: "photo23",
          verb: "FIX",
          who: "sq",
          box: wallBox(o.x, 90, 300),
          at: [o.x, 230],
          when: !n.found.has("photo23"),
          f: () => {
            (D.key(), (B.p23T = n.T), ee("secret", "photo23", o.x, 200), TV([uV(0.6), v("sq", "Photo 23. I hid this here when I was 5.")]));
          },
        }),
        spot({
          id: "badge",
          verb: "FLIP",
          who: "sq",
          box: wallBox(HV.x, 70, 300),
          at: [HV.x, 230],
          when: !n.found.has("badge"),
          f: () => {
            (D.key(),
              (n.ctrl = !1),
              (n.act = null),
              (n.sq.moving = !1),
              ee("secret", "badge", HV.x, 160),
              J([
                { k: "panel", id: "badge" },
                v("sq", "On TV, the Wookiees got kicked out for fur. You're furry too!"),
                v("sq", "Why can YOUR hair be here?"),
                v("mops", "Goat hair. Hypo-Alien-Genic."),
                v("sq", "What's the difference between fur and hair?"),
                v("mops", "Paperwork."),
                v("sq", "What's a GANITOR?"),
                v("mops", "Goat janitor. First and only. They had to invent a word."),
                N(() => {
                  n.ctrl = !0;
                }),
              ]));
          },
        }),
        spot({ id: "mops", verb: "GIVE", who: "sq", x: n.mo.x, y: n.mo.y, r: 120, at: [n.mo.x, n.mo.y - 40], hot: !0, f: Wp }),
        gallerySpot(),
      ];
    }
    function Zp() {
      return pick(s2Spots());
    }
    function Wp() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        (n.lunch = "none"),
        (B.gave = !0),
        D.grab(),
        (n.mo.f = n.sq.x > n.mo.x ? 1 : -1),
        (n.sq.f = -n.mo.f));
      let l = [v("mops", "My lunch! You're the best."), uV(1.5)];
      (n.found.has("photo23") && l.push(v("mops", "Goats peak early.")), l.push(N(Rh)), J(l));
    }
    function Rh() {
      ((n.scene = "S3"), (n.ctrl = !1), (n.act = null), (n.chip = ""));
      let l = [0, 1, 2].map((s) => ({ x: te.x, y: te.top + 10, light: !1, on: !1 })),
        o = ["Dot", "Bob", "Lou"].map((s, q) => ({ name: s, x: 1110 + q * 50, y: 470 + (q % 2) * 20, on: !0 }));
      ((B.bots = l), (B.jans = o));
      let i = (s) =>
        cV((q) => {
          let d = !0;
          return (
            B.jans.forEach((A, T) => {
              if (!A.on) return;
              let R = te.x,
                P = s ? te.top + 4 : te.bot - 40 + T * 26;
              if (s && T > 0 && B.jans[T - 1].on && B.jans[T - 1].y > A.y - 26) {
                d = !1;
                return;
              }
              let _ = R - A.x,
                $ = P - A.y,
                gV = Math.hypot(_, $);
              if (gV > 2) {
                d = !1;
                let oe = Math.min(gV, 60 * q);
                ((A.x += (_ / gV) * oe), (A.y += ($ / gV) * oe));
              } else s && (A.on = !1);
            }),
            d
          );
        });
      J([
        N(() => {
          ((n.sqPose = "hidden"), (n.sq.x = ne.x), (n.sq.y = ne.y + 6), (n.mo.x = 1190), (n.mo.y = 300), (n.mo.f = -1), D.hide());
        }),
        mo(480, 380),
        rn((s) => {
          B.ship = s;
        }, 1.6),
        N(() => D.zap()),
        rn((s) => {
          B.ramp = s;
        }, 0.8),
        v("pa", n.furVent ? "Delegation report: FUR in the air scrubbers." : "Delegation report: FUR spotted in the lobby.", "pa"),
        v("pa", "Janitorial issue! First robot order: APPROVED.", "pa"),
        v("sq", "...That was MY fur.", "whisper"),
        v("pa", "DING DONG! Delivery for Stormtop!", "pa"),
        N(() => {
          B.bots.forEach((s) => {
            s.on = !0;
          });
        }),
        cV((s) => {
          let q = !0;
          return (
            B.bots.forEach((d, A) => {
              let T = te.x - 250 + A * 80,
                R = te.bot + 70,
                P = d;
              if (A > 0 && (B.bots[A - 1].st ?? 0) < 1) {
                ((d.on = !1), (q = !1));
                return;
              }
              if (((d.on = !0), (P.st ?? 0) === 0)) {
                ((q = !1), mV(P, te.x, te.bot + 60, 90, s) && (P.st = 1));
                return;
              }
              mV(P, T, R, 90 + A * 5, s) || (q = !1);
            }),
            q
          );
        }),
        N(() => {
          (B.bots.forEach((s) => {
            s.light = !0;
          }),
            D.zap());
        }),
        uV(0.4),
        v("pa", "Bleep-Bloop Bots! Floors that mop THEMSELVES!", "pa"),
        i(!1),
        v("pa", "Janitors Dot, Bob and Lou... REPLACED.", "pa"),
        i(!0),
        v("mops", "Pfft. They'd never replace me."),
        v("mops", "47 Employee of the Month photos."),
        N(() => {
          B.slip = { x: 0, y: 0, r: 0, on: !0 };
        }),
        cV(
          (() => {
            let s = 0;
            return (q) => {
              s += q;
              let d = B.bots[2];
              return mV(d, n.mo.x - 70, n.mo.y + 10, 90, q) || s > 8;
            };
          })(),
        ),
        uV(0.5),
        N(() => {
          B.held = !0;
        }),
        uV(0.3),
        rn((s) => {
          ((B.sign = s), s > 0.98 && (B.signed = !0));
        }, 1),
        N(() => D.key()),
        v("mops", "...Paperwork."),
        N(() => {
          ((B.gustT = n.T), D.zap());
        }),
        uV(0.5),
        N(() => {
          (kV("mops", "Hey! My slip!"), (n.mo.f = 1));
        }),
        N(() => {
          ((B.slip.on = !1),
            (B.held = !1),
            D.bzzt(),
            (B.halves = [
              { x: n.mo.x - 30, y: n.mo.y - 50, r: 0, on: !0 },
              { x: n.mo.x - 30, y: n.mo.y - 50, r: 0, on: !0 },
            ]));
        }),
        uV(0.3),
        N2(0, DV.x, DV.y - 46),
        N(() => {
          D.hide();
        }),
        uV(0.5),
        N2(1, SV.x, SV.y),
        N(() => {
          D.hide();
        }),
        uV(0.5),
        mo(480, 500),
        v("pa", "Back soon with your NEXT order!", "pa"),
        rn((s) => {
          B.ramp = 1 - s;
        }, 0.6),
        N(() => {
          ((B.crate = !0), D.grab());
        }),
        rn((s) => {
          B.ship = 1 - s;
        }, 1.6),
        uV(1.2),
        N(Uh),
      ]);
    }
    let Ct = { x: 1065, y: 300 },
      ye = { x: 990, y: 250 };
    function zh() {
      ((Ct.x = ye.x + 75), (Ct.y = ye.y + 50));
    }
    let le = { inCrate: !1, light: 0, botsOut: !1, left: !1, dolly: !1 },
      Gn = 0;
    function Uh() {
      ((n.scene = "S4"),
        (n.room = "hall"),
        (n.act = null),
        (n.chip = ""),
        (n.live = []),
        Object.assign(le, { inCrate: !1, light: 0, botsOut: !1, left: !1, dolly: !0 }),
        (B.camX = 480),
        (B.crate = !0),
        (ye.x = 990),
        (ye.y = 250),
        zh(),
        B.bots.forEach((s) => {
          ((s.on = !0), (s.light = !1));
        }),
        (n.sqPose = "stand"),
        (n.sq.x = 860),
        (n.sq.y = 400),
        (n.sq.f = 1),
        (n.ctrl = !1));
      let l = B.bots[1],
        o = B.bots[0],
        i = (s, q) =>
          cV((d) => {
            let A = s - ye.x,
              T = q - ye.y,
              R = Math.hypot(A, T),
              P = 150 * d;
            return (
              R <= P ? ((ye.x = s), (ye.y = q)) : ((ye.x += (A / R) * P), (ye.y += (T / R) * P)),
              zh(),
              l && ((l.x = ye.x - 34), (l.y = ye.y + 70)),
              R <= P
            );
          });
      J([
        cV((s) => !l || mV(l, ye.x - 34, ye.y + 70, 200, s)),
        i(1e3, 470),
        i(1250, 486),
        N(() => {
          le.dolly = !1;
        }),
        cV((s) => !l || mV(l, 940, 560, 200, s)),
        cV((s) => mV(n.sq, 1e3, 510, 260, s)),
        cV((s) => mV(n.sq, 1215, 470, 260, s)),
        cV((s) => !o || mV(o, 1120, 510, 220, s)),
        N(() => {
          (o && ((o.light = !0), (o.f = 1)), n.pulse.add("crate"), (n.ctrl = !0), D.zap());
        }),
      ]);
    }
    function s4Spots() {
      return [
        spot({ id: "crate", verb: "LEAVE", who: "sq", at: [Ct.x, Ct.y - 40], when: !!le.inCrate && n.found.has("pie500"), f: Qs }),
        spot({
          id: "crate",
          verb: "GRAB",
          who: "sq",
          at: [Ct.x, Ct.y - 40],
          when: !!le.inCrate && !n.found.has("pie500"),
          f: () => {
            (ee("secret", "pie500", Ct.x - B.camX, 200), (Gn = Math.max(Gn, 1)), TV([v("sq", "Five hundred. They won't miss one.")]));
          },
        }),
        spot({ id: "crate", verb: "HIDE", who: "sq", x: Ct.x, y: Ct.y + 60, r: 200, at: [Ct.x, Ct.y - 40], when: !le.inCrate && !le.botsOut, hot: !0, f: VA }),
      ];
    }
    function $p() {
      return pick(s4Spots());
    }
    function VA() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        n.pulse.delete("crate"),
        D.hide(),
        (le.inCrate = !0),
        (n.sqPose = "hidden"),
        (n.sq.x = Ct.x),
        (n.sq.y = Ct.y + 30),
        J([
          v("sq", "I came in a crate like this.", "whisper"),
          { k: "card", id: "fb", text: "Years ago, on Stormtop..." },
          { k: "fb", pic: "fb1crate", cap: "A delivery crate of Moon Pies came to Stormtop." },
          { k: "fb", pic: "fb1lid", cap: "Mops opened it. Inside: a sleeping baby Sasquatch, covered in crumbs." },
          { k: "fb", pic: "fb1beard", cap: "The baby woke up, grabbed Mops's beard, and giggled." },
          v("mops", "...Baaa?"),
          { k: "fb", pic: "fb1bucket", cap: "Tourists coming! Mops hid him in the mop bucket." },
          v("mops", "Nothing to see here!"),
          { k: "card", id: "fb", text: "Now" },
          N(() => {
            n.fbPic = "";
          }),
          cV((l) => {
            let o = !0;
            return (
              B.bots.forEach((i, s) => {
                i.on && (mV(i, i.x > 1150 ? 1100 : -80, 470 + s * 30, 160, l) && i.x < 0 ? (i.on = !1) : (o = !1));
              }),
              o
            );
          }),
          N(() => {
            ((le.botsOut = !0), (n.ctrl = !0));
          }),
        ]));
    }
    function eA(l) {
      if (!le.inCrate) {
        (n.ctrl && (le.light = Math.min(1, le.light + l * 0.18)),
          le.light >= 1 && B.bots[0] && n.ctrl && (lq(B.bots[0].x, B.bots[0].y, B.bots[0]), (le.light = 0.2)));
        return;
      }
      le.botsOut && n.sqPose !== "hidden" && !le.left && ((le.left = !0), (le.inCrate = !1), (n.ctrl = !1), J([uV(0.6), N(Dh)]));
    }
    let rt = { x: 470, y: 470 },
      me = { x: 548, y: 488 },
      qV = {
        gary: { x: 410, y: 320 },
        linda: { x: 540, y: 320 },
        wave: 0,
        soaked: !1,
        bro: { x: 560, y: 290, on: !0, inBin: !1 },
        grabbed: !1,
      };
    function Dh() {
      ((n.scene = "S5"),
        (n.room = "window"),
        (n.act = null),
        (n.chip = ""),
        (n.live = []),
        n.pulse.clear(),
        (B.camX = 0),
        Object.assign(qV, {
          gary: { x: 410, y: 320 },
          linda: { x: 540, y: 320 },
          wave: 0,
          soaked: !1,
          bro: { x: 560, y: 290, on: !0, inBin: !1 },
          grabbed: !1,
        }),
        (n.sqPose = "stand"),
        (n.sq = { x: 140, y: 540, f: 1, walk: 0, moving: !1 }),
        n.pulse.add("plant5"),
        (n.ctrl = !0));
    }
    function s5Spots() {
      let l = qV.bro.inBin && !qV.grabbed,
        o = n.sqPose === "hidden";
      return [
        spot({ id: "bro", verb: "GRAB", who: "sq", at: [me.x, me.y - 50], when: l && o, hot: !0, f: nA }),
        spot({ id: "bro", verb: "GRAB", who: "sq", x: me.x, y: me.y, r: 120, at: [me.x, me.y - 50], when: l && !o, hot: !0, f: nA }),
        spot({ id: "plant5", verb: "HIDE", who: "sq", x: rt.x, y: rt.y + 6, r: 110, at: [rt.x, rt.y - 60], when: !o && !qV.bro.inBin, hot: !0, f: aA }),
        spot({
          id: "brochure",
          verb: "LOOK",
          who: "sq",
          x: qV.bro.x,
          y: qV.bro.y + 120,
          r: 120,
          at: [qV.bro.x, qV.bro.y - 30],
          when: !o && !qV.bro.inBin,
          f: () => {
            TV([v("sq", "A brochure! But they'd see me. Hide first.", "whisper")]);
          },
        }),
      ];
    }
    function tA() {
      return pick(s5Spots());
    }
    function aA() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        n.pulse.delete("plant5"),
        D.hide(),
        (n.sqPose = "hidden"),
        (n.sq.x = rt.x),
        (n.sq.y = rt.y + 6),
        J([
          uV(0.4),
          v("gary", "Did you hear? Big furry folks run a pancake stand on Mars!", "say", !0),
          v("linda", "Big furry folks? Like... a whole family?", "say", !0),
          v("sq", "Big. Furry. Folks. Like ME?", "whisper"),
          rn((l) => {
            ((qV.wave = Math.sin(l * Math.PI * 4)), l > 0.5 && !qV.soaked && ((qV.soaked = !0), D.splash()));
          }, 1.4),
          N(() => {
            qV.wave = 0;
          }),
          v("linda", "Gary! It's soaked!", "say", !0),
          (() => {
            let l = 0,
              o = 0,
              i = !1;
            return rn((s) => {
              (i || ((i = !0), (l = qV.bro.x), (o = qV.bro.y)),
                (qV.bro.x = l + (me.x - l) * s),
                (qV.bro.y = o + (me.y - 40 - o) * s - Math.sin(s * Math.PI) * 70),
                s >= 1 && (qV.bro.inBin = !0));
            }, 0.9);
          })(),
          N(() => D.hide()),
          rn((l) => {
            ((qV.gary.x = 410 - 170 * l), (qV.gary.y = 320 - 60 * l), (qV.linda.x = 540 + 170 * l), (qV.linda.y = 320 - 60 * l));
          }, 1.6),
          N(() => {
            (n.pulse.add("bro"), (n.ctrl = !0));
          }),
        ]));
    }
    function nA() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.delete("bro"),
        (qV.grabbed = !0),
        (qV.bro.on = !1),
        D.grab(),
        J([{ k: "panel", id: "brochure" }, v("sq", "A family like me."), v("sq", "On MARS."), N(Gh)]));
    }
    let lt = { x: 150, y: 250 },
      cn = { x: 770, y: 240 },
      gt = { x: 1050, y: 560 },
      bo = { x: 1250, y: 470 },
      Ga = { x: 1300, y: 200 },
      Ha = { x: 1360, y: 300 },
      Le = { x: 1390, y: 470 },
      Ch = { x: 1320, y: 300 },
      va = [
        { x: ne.x, y: ne.y },
        { x: 620, y: 540 },
      ],
      Is = [
        { x: 330, y: 250 },
        { x: 470, y: 250 },
        { x: 1180, y: 540 },
      ],
      x = {
        mops: !1,
        ask: 0,
        seen6: !1,
        tour: [],
        alertBy: -1,
        alertT: 0,
        spot: -1,
        sing: !1,
        lureBot: { x: 0, y: 0, home: { x: 0, y: 0 }, look: 0, asked: !1 },
        spotted: 0,
        seenPart: !1,
        got1: !1,
        got2: !1,
        ductOn: !1,
        notesBall: !0,
        doorOpen: !1,
        costume: !1,
        gateBumps: 0,
        typed: !1,
        mopsHint: !1,
        coolers: [!1, !1, !1],
        tarp: !0,
        crates: !0,
        nachos: !1,
        icecream: !1,
        ghost: !0,
        caught: 0,
        cheer: 0,
        bumped: !1,
        botBy: 0,
      };
    function Ks() {
      return x.mops ? n.mo : n.sq;
    }
    function df(l, o) {
      ((n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        (n.mo.moving = !1),
        (x.ghost = !1),
        x.caught++,
        D.bzzt(),
        J([
          ...kh(),
          N(() => {
            let i = n.starOn;
            ((n.stars = Math.max(0, n.stars - 100)),
              i && n.sparks.push({ x: 300, y: 80, t: 2.4, s: "\u2212100 CAUGHT" }),
              Dt("caught", "", o, "caught"),
              l());
          }),
        ]));
    }
    function Ta(l) {
      if (n.found.has(l)) return;
      (n.found.add(l),
        (n.starOn = !0),
        (n.stars += 100),
        aV.sneaky++,
        n.sparks.push({ x: 300, y: 80, t: 2.4, s: "+100 SNEAKY!" }),
        D.pickup());
      let o = Ks();
      of(n.room === "hall" ? o.x - B.camX : o.x, o.y - 90, "#2bc48a");
    }
    function lA(l) {
      let o = va[l];
      ((x.spot = l), (n.sqPose = "hidden"), (n.sq.x = o.x), (n.sq.y = o.y + 6), (n.sq.moving = !1), D.hide());
    }
    function Xs() {
      n.sqPose === "hidden" && ((n.sqPose = "stand"), (n.sq.y = Math.min(590, n.sq.y + 26)), (x.spot = -1), (x.sing = !1));
    }
    function Bh() {
      ((x.tour = [
        { x: 1020, y: 480, x0: 1020, x1: 1020, sp: 0, dir: 1, pause: 0, alert: 0, col: "#7fd1ff", hair: "#8b5a3c", home: 1020 },
        { x: 1130, y: 440, x0: 1130, x1: 1260, sp: 40, dir: 1, pause: 1.5, alert: 0, col: "#ff8fc0", hair: "#ffcf33", home: 1e3 },
      ]),
        (x.alertBy = -1),
        (x.spot = -1),
        (n.sqPose = "stand"),
        (n.live = []));
      let l = Is[x.ask];
      ((n.mo = { x: l.x, y: l.y, f: -1, walk: 0, moving: !1 }),
        (n.moPose = "stand"),
        (n.moMop = "hand"),
        (n.sq = {
          x: Math.max(200, l.x + (x.ask === 2 ? -260 : 200)),
          y: x.ask === 2 ? 580 : 380,
          f: x.ask === 2 ? 1 : -1,
          walk: 0,
          moving: !1,
        }),
        (n.chip = x.ask ? "Follow Mops" : ""),
        (n.ctrl = !0),
        (n.act = null));
    }
    function Gh() {
      ((n.scene = "S6"),
        (n.room = "hall"),
        (n.fbPic = ""),
        (n.live = []),
        (vV = []),
        n.pulse.clear(),
        (B.bots = []),
        (B.jans = []),
        (B.crate = !1),
        (B.ship = 0),
        (B.ramp = 0),
        (B.slip.on = !1),
        (x.ask = 0),
        (x.seen6 = !1),
        switchTo("squatch"),
        Bh(),
        D.hide());
    }
    function oA(l, o) {
      return cV((i) => {
        let s = mV(n.mo, l.x, l.y, o, i);
        return (Math.random() < i * 8 && vV.push({ x: n.mo.x - 26 * n.mo.f, y: n.mo.y + 6, t: 6 }), s);
      });
    }
    let Bt = null;
    function Hh(l, o) {
      ((x.ask = l),
        (n.chip = "Follow Mops"),
        (n.ctrl = !0),
        (n.act = null),
        (Bt = { to: Is[l], sp: o, look: 0 }),
        (n.mo.f = Is[l].x > n.mo.x ? 1 : -1));
    }
    function iA(l) {
      if (!Bt) return;
      if (n.scene !== "S6") {
        Bt = null;
        return;
      }
      if (de()) return;
      if (Math.hypot(n.sq.x - n.mo.x, n.sq.y - n.mo.y) > 380 && n.sqPose !== "hidden") {
        ((Bt.look += l), (n.mo.moving = !1), (n.mo.f = n.sq.x > n.mo.x ? 1 : -1));
        return;
      }
      Bt.look = 0;
      let i = mV(n.mo, Bt.to.x, Bt.to.y, Bt.sp, l);
      (Math.random() < l * 8 && vV.push({ x: n.mo.x - 26 * n.mo.f, y: n.mo.y + 6, t: 6 }),
        i && ((n.mo.moving = !1), (n.mo.f = n.sq.x > n.mo.x ? 1 : -1), (Bt = null)));
    }
    function fA() {
      if (!Bt || n.cur) return;
      let l = Math.abs(Math.sin(n.T * 5)) * 10,
        o = n.mo.x,
        i = n.mo.y - 170 - l;
      (e.beginPath(),
        e.moveTo(o - 14, i - 18),
        e.lineTo(o + 14, i - 18),
        e.lineTo(o, i),
        e.closePath(),
        r("#ffcf3a", 3),
        Bt.look > 0.3 && g("?", o + 30 * n.mo.f, i + 30, 22, y, "center", 900));
    }
    function uA() {
      ((n.ctrl = !1), (n.act = null), (n.sq.moving = !1), (n.sq.f = n.mo.x > n.sq.x ? 1 : -1), (n.mo.f = -n.sq.f));
      let l = x.ask;
      (l === 0 &&
        J([
          v("sq", "Mops! Big furry folks on Mars! A family like ME! Let's go!"),
          v("mops", "Floors don't mop themselves, kiddo."),
          N(() => Hh(1, 70)),
        ]),
        l === 1 &&
          J([
            v("sq", "Robots could mop! You could come!"),
            N(() => {
              ((n.mo.f = -1), (B.point = !0));
            }),
            v("mops", "This station needs me."),
            N(() => {
              B.point = !1;
            }),
            N(() => Hh(2, 80)),
          ]),
        l === 2 &&
          J([
            N(() => {
              n.chip = "";
            }),
            v("sq", "I'm tired of hiding!"),
            v("mops", "Remember last night?"),
            v("mops", "Out there, everyone sees a Wookie."),
            v("sq", "YOU don't hide. You're a GOAT. Nobody screams at you!"),
            v("mops", "..."),
            N(() => {
              n.moPose = "sad";
            }),
            oA({ x: 1460, y: 560 }, 34),
            N(() => {
              n.moPose = "stand";
            }),
            v("sq", "...I didn't mean it.", "whisper"),
            uV(2.5),
            N(() => {
              (x.seen6 || Ta("sneak-s6"), (B.bots = [{ x: 1160, y: 380, light: !0, on: !0 }]), n.pulse.add("mopbot"));
            }),
            cV((o) => {
              let i = B.bots[0],
                s = mV(i, n.sq.x + 160, n.sq.y - 20, 110, o);
              return (Math.random() < o * 8 && vV.push({ x: i.x + 26, y: i.y + 6, t: 6 }), (B.camX = w(n.sq.x - 380, 0, xa - c)), s);
            }),
            v("sq", "Floors don't mop themselves..."),
            v("sq", "...but those BOTS do!"),
            N(() => {
              (n.pulse.delete("mopbot"),
                n.pulse.add("term"),
                (n.chip = "Use the manager's terminal"),
                (n.scene = "S7"),
                (n.ctrl = !0),
                (n.seeGrace = n.T + 3));
            }),
          ]));
    }
    function s6Spots() {
      let l = n.sq;
      return [
        spot({ id: "leave", verb: "LEAVE", who: "sq", at: [l.x, l.y - 30], when: n.sqPose === "hidden", f: Xs }),
        spot({
          id: "plaque",
          verb: "PULL",
          who: "sq",
          box: wallBox(cn.x - 26, 70, 330),
          at: [cn.x - 26, 140],
          when: !n.found.has("plaque"),
          f: () => {
            (ee("funny", "plaque", 300, 80),
              D.grab(),
              TV([v("sq", '"The Great Wookie Clog. Never forget."'), v("sq", "It's a framed hairball. The size of a beanbag.")]));
          },
        }),
        spot({
          id: "wanted",
          verb: "UNROLL",
          who: "sq",
          box: wallBox(cn.x + 30, 60, 330),
          at: [cn.x + 30, 140],
          when: !n.found.has("wanted"),
          f: () => {
            (ee("funny", "wanted", 300, 80), D.grab(), TV([v("sq", "That's not even a good drawing.")]));
          },
        }),
        ...hallFinds(),
        gallerySpot({ x: lt.x, y: lt.y + 60, r: 120 }),
        ...va.map((o, i) =>
          spot({ id: "va" + i, verb: "HIDE", who: "sq", x: o.x, y: o.y + 6, r: 80, at: [o.x, o.y - 30], hot: x.alertBy >= 0, f: () => lA(i) }),
        ),
      ];
    }
    function sA() {
      return pick(s6Spots());
    }
    // Things in the hall Squatch can look at again, and the two halves of the torn slip.
    function hallFinds() {
      return [
        spot({
          id: "plaque",
          verb: "LOOK",
          who: "sq",
          box: wallBox(cn.x - 26, 50, 330),
          at: [cn.x - 26, 140],
          when: n.found.has("plaque"),
          f: () => TV([v("sq", "Still a framed hairball.")]),
        }),
        spot({
          id: "wanted",
          verb: "LOOK",
          who: "sq",
          box: wallBox(cn.x + 30, 50, 330),
          at: [cn.x + 30, 140],
          when: n.found.has("wanted"),
          f: () => TV([v("sq", "REWARD: 1 free air filter. Rude.")]),
        }),
        spot({
          id: "trash",
          verb: "PEEK",
          who: "sq",
          x: DV.x,
          y: DV.y,
          r: 100,
          at: [DV.x, DV.y - 70],
          when: !!(B.halves[0] && B.halves[0].on),
          f: () =>
          TV([
            v("sq", "Half the torn slip! The hangar code's on it...", "whisper"),
            v("sq", "Not yet. Mops needs me first.", "whisper"),
          ]),
        }),
        spot({
          id: "vent",
          verb: "PEEK",
          who: "sq",
          x: SV.x,
          y: SV.y,
          r: 90,
          at: [SV.x, SV.y - 50],
          when: !!(B.halves[1] && B.halves[1].on),
          f: () => TV([v("sq", "The other half's down the vent. Way too small for me.", "whisper")]),
        }),
      ];
    }
    function qA(l) {
      B.camX = w(n.sq.x - 480, 0, xa - c);
      for (let o of x.tour)
        o.sp &&
          !o.alert &&
          (o.pause > 0
            ? (o.pause -= l)
            : ((o.x += o.dir * o.sp * l), (o.x > o.x1 || o.x < o.x0) && ((o.x = w(o.x, o.x0, o.x1)), (o.dir *= -1), (o.pause = 1.5))));
      if (n.scene === "S6")
        for (let o of x.tour)
          Th(o, l, () => {
            n.sqPose === "hidden" || !n.ctrl
              ? (x.tour.forEach((i) => {
                  i.alert = 0;
                }),
                (x.alertBy = -1),
                kV("tourist", "...Must've been a mop."))
              : ((x.alertBy = -1),
                x.tour.forEach((i) => {
                  i.alert = 0;
                }),
                kV("pa", "SECURITY TO THE HALL!"),
                df(Bh, "S6 seen"));
          });
      if (!(!n.ctrl || n.scene !== "S6") && !(x.alertBy >= 0) && n.sqPose !== "hidden") {
        for (let o = 0; o < x.tour.length; o++)
          if (!x.tour[o].run && Ps(x.tour[o], n.sq.x, n.sq.y)) {
            let i = x.tour[o];
            (x.tour.forEach((s) => {
              s.alert = 1;
            }),
              (x.alertBy = o),
              (x.alertT = 2.6),
              (x.seen6 = !0),
              kV("tourist", "WOOKIE!"),
              n.sparks.push({ x: i.x - B.camX - 58, y: i.y - 140, t: 2.2, s: "!" }),
              vh(i, yo.x, yo.y + 120, 1.7));
            return;
          }
        !Bt && Math.hypot(n.sq.x - n.mo.x, n.sq.y - n.mo.y) < 110 && uA();
      }
    }
    function s7Spots() {
      return [
        spot({ id: "leave", verb: "LEAVE", who: "sq", at: [n.sq.x, n.sq.y - 30], when: n.sqPose === "hidden", f: Xs }),
        spot({
          id: "term",
          verb: "USE",
          who: "sq",
          x: lt.x,
          y: lt.y + 60,
          r: 120,
          at: [lt.x, lt.y - 40],
          hot: !0,
          f: () => {
            ((n.ctrl = !1),
              (n.act = null),
              (n.sq.moving = !1),
              n.pulse.delete("term"),
              (n.chip = ""),
              J([
                { k: "panel", id: "terminal" },
                N(() => {
                  ((x.typed = !0), D.grab());
                }),
                { k: "panel", id: "terminal" },
                v("sq", "...Sorry, Mops.", "whisper"),
                v("sq", "Receipt goes in my Guardian Box. Where secrets go.", "whisper"),
                uV(2.5),
                N(js),
              ]));
          },
        }),
        ...hallFinds(),
      ];
    }
    function rA() {
      return pick(s7Spots());
    }
    function s7bSpots() {
      return [
        spot({
          id: "term",
          verb: "SIGN",
          who: "sq",
          at: [lt.x, lt.y - 40],
          hot: !0,
          f: () => {
            ((n.ctrl = !1),
              (n.act = null),
              (x.typed = !0),
              D.grab(),
              J([
                { k: "panel", id: "terminal" },
                v("sq", "...Sorry, Mops.", "whisper"),
                v("sq", "Receipt goes in my Guardian Box. Where secrets go.", "whisper"),
                uV(2.5),
                N(js),
              ]));
          },
        }),
      ];
    }
    function cA() {
      return pick(s7bSpots());
    }
    function js() {
      ((n.scene = "S8"),
        (n.ctrl = !1),
        (n.act = null),
        (n.chip = ""),
        (B.bots = []),
        (B.mars = !0),
        J([
          N(() => {
            ((n.sqPose = "hidden"),
              (x.spot = 0),
              (n.sq.x = ne.x),
              (n.sq.y = ne.y + 6),
              (n.mo = { x: 1060, y: 420, f: -1, walk: 0, moving: !1 }),
              (n.moPose = "stand"),
              D.hide());
          }),
          mo(480, 400),
          rn((l) => {
            B.ship = l;
          }, 1.6),
          N(() => D.zap()),
          v("pa", "DING DONG! Express delivery!", "pa"),
          v("pa", "Remaining janitors... REPLACED.", "pa"),
          v("pa", "Including: GANITOR MOPS.", "pa"),
          v("mops", "Me? I've been... replaced?"),
          v("mops", "47 Employee of the Months..."),
          N(() => {
            ((n.sqPose = "stand"), (x.spot = -1), (n.sq.y = ne.y + 40), (n.sq.f = 1), n.pulse.add("hull"));
          }),
          v("sq", "Then come to Mars with me! Look: NEXT STOP, MARS!"),
          N(() => n.pulse.delete("hull")),
          v("mops", "...Together. Okay."),
          v("mops", "The hangar code was on that slip I ripped."),
          v("mops", "Half's in the trash. Half's in the vent."),
          N(() => n.pulse.add("trash")),
          mo(480, 700),
          uV(0.8),
          N(() => {
            (n.pulse.delete("trash"), n.pulse.add("vent"));
          }),
          mo(460, 700),
          uV(0.8),
          N(() => n.pulse.delete("vent")),
          mo(400, 700),
          N(() => {
            ((B.bots = [0, 1, 2].map((l) => ({ x: te.x - 80 + l * 80, y: te.bot + 60, light: !0, on: !0 }))), D.zap());
          }),
          v("pa", "NEW BOTS ONLINE. FORMER GANITOR: SHOO.", "pa"),
          v("mops", "Great. Now they'll shoo me too."),
          cV((l) => {
            let o = !0;
            return (
              B.bots.forEach((i, s) => {
                s === 0 ? mV(i, bo.x, bo.y, 150, l) || (o = !1) : mV(i, -80, 470 + s * 30, 170, l) ? (i.on = !1) : (o = !1);
              }),
              o
            );
          }),
          N(Ph),
        ]));
    }
    function _s(l, o) {
      ((x.lureBot = { x: l, y: o, home: { x: l, y: o }, look: 0, asked: !1 }), (x.sing = !1));
    }
    function Fs() {
      ((n.scene = "S9"),
        (n.room = "hall"),
        (n.live = []),
        switchTo("squatch"),
        (x.spot = -1),
        (n.sqPose = "stand"),
        _s(bo.x, bo.y),
        (B.bots = []),
        (n.sq = { x: 880, y: 560, f: 1, walk: 0, moving: !1 }),
        (n.mo = { x: 1390, y: 560, f: -1, walk: 0, moving: !1 }),
        (n.moPose = "stand"),
        n.pulse.clear(),
        n.pulse.add("box9"),
        (n.ctrl = !0),
        (n.chip = ""),
        (B.camX = 480));
    }
    function Ph() {
      (Fs(),
        (n.ctrl = !1),
        (x.spotted = 0),
        (x.seenPart = !1),
        J([
          v("mops", "I'll wait by the trash."),
          v("mops", "You hide in that box and SING."),
          v("mops", "When the bot comes to look, tap my face and grab the slip!"),
          N(() => {
            n.ctrl = !0;
          }),
        ]));
    }
    // A lure spot in the hall (S9 box, S11 plant): HIDE beside it, then SING or STOP from inside.
    function lureSpots(l, o, i) {
      let s = !x.mops && n.sqPose === "hidden";
      return [
        spot({
          id: "sing",
          verb: x.sing ? "STOP" : "SING",
          who: "sq",
          at: [l.x, l.y - 60],
          when: s,
          hot: !0,
          f: x.sing
            ? () => {
                ((x.sing = !1), (n.sqPose = "hidden"));
              }
            : () => {
                ((x.sing = !0), co());
              },
        }),
        spot({
          id: o,
          verb: "HIDE",
          who: "sq",
          x: l.x,
          y: l.y + 6,
          r: 90,
          at: [l.x, l.y - 60],
          when: !x.mops && n.sqPose !== "hidden",
          hot: !0,
          f: () => {
            ((x.spot = 9), (n.sqPose = "hidden"), (n.sq.x = l.x), (n.sq.y = l.y + 6), (n.sq.moving = !1), D.hide(), i());
          },
        }),
      ];
    }
    function Yh(l, o, i, s) {
      let q = x.lureBot;
      x.sing
        ? (Math.random() < l * 2.5 &&
            ea.push({
              x: o.x + E(-20, 20),
              y: o.y - 110,
              vx: E(-20, 20),
              vy: E(-40, -25),
              t: 1.6,
              c: nV(["#ff5fa8", "#3478f6", "#ffb547"]),
              s: nV(["\u266A", "\u266B"]),
            }),
          q.asked || ((q.asked = !0), kV("bot", "Who's singing?")),
          mV(q, o.x + 40, o.y, 60, l),
          (q.look = 8),
          Math.hypot(q.x - o.x, q.y - o.y) < 75 &&
            ((x.sing = !1), (x.seenPart = !0), D.alarm(), kV("bot", "SPOTTED!"), df(i, s + " spotted")))
        : q.look > 0
          ? ((q.asked = !1), (q.look -= l), q.look <= 0 && (q.look = -1))
          : q.look < 0 && mV(q, q.home.x, q.home.y, 50, l) && (q.look = 0);
    }
    // Why each announced switch happens. Wording waits for Brian's yes (docs/PHASE-1-LINES-FOR-BRIAN.md).
    // Switches with no entry here (scene set-ups, Reset section, Chapters 1, 3 and 4) are silent for now.
    const SWITCH_WHY = {
      "g1-door": "Mops goes to the diner. Squatch stays hidden by the pump.",
      "g2-back": "Mops found work. Squatch sneaks in the back.",
      "g3-front": "Squatch stays hidden in the crate. Mops goes out front.",
      "g4-wash": "Squatch washes the next dishes.",
      "g5-mop": "This pot needs a mop. Mops goes to get it.",
      "g5-jar": "The dishes are done. Mops goes out front.",
      "g6-lure": "The tank is full. Squatch has to lure the bots away.",
    };
    function switchTo(who, why) {
      let m = who === "mops";
      if (x.mops === m) return;
      let before = !!x.mops,
        line = why && SWITCH_WHY[why];
      // Test record: who the player was at the moment this switch (and its card) was queued.
      window.__ss && (window.__ss.switchLog = window.__ss.switchLog || []).push({ to: who, before, why: why || "", card: !!line });
      ((x.mops = m), (n.sq.moving = !1), (n.mo.moving = !1));
      line && J([{ k: "card", id: "switch", who: m ? "mops" : "sq", text: "You are " + (m ? "MOPS" : "SQUATCH") + " now.", by: line }]);
    }
    function yf(l) {
      x.mops !== l && (switchTo(l ? "mops" : "squatch"), D.key());
    }
    function s9Spots() {
      return [
        spot({
          id: "trash",
          verb: "GRAB",
          who: "mo",
          x: DV.x,
          y: DV.y,
          r: 90,
          at: [DV.x, DV.y - 60],
          when: x.mops && !x.got1,
          hot: !0,
          f: () => {
            ((n.ctrl = !1),
              (n.act = null),
              (n.mo.moving = !1),
              (x.got1 = !0),
              B.halves[0] && (B.halves[0].on = !1),
              D.grab(),
              (x.sing = !1),
              J([
                { k: "panel", id: "half1" },
                v("mops", "Got it! Thanks for the song, Squatch."),
                N(() => {
                  (x.seenPart || Ta("sneak-s9"), Ih());
                }),
              ]));
          },
        }),
        spot({
          id: "goatspace",
          verb: "PULL",
          who: "sq",
          box: wallBox(ct.x, 70, ct.y + 190),
          at: [ct.x, ct.y + 20],
          when: !x.mops && !n.found.has("goatspace") && !n.egg,
          f: dA,
        }),
        ...lureSpots(gt, "box9", () => n.pulse.delete("box9")),
      ];
    }
    function hA() {
      return pick(s9Spots());
    }
    let ct = { x: 800, y: 170 };
    function dA() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        (n.egg = { t: 0, sang: 0 }),
        D.zap(),
        D.splash(),
        Dt("egg", "", "goating in space", "egg"),
        J([
          cV((l) => {
            let o = n.egg;
            if (((o.t += l), o.t > 1 && o.sang === 0)) {
              o.sang = 1;
              let i = 0;
              for (let [s, q] of [
                [69, 0.3],
                [74, 0.3],
                [74, 0.3],
                [78, 0.3],
                [81, 0.6],
                [78, 0.3],
                [74, 0.9],
              ])
                (Fi(Da(s), q * 0.95, i), (i += q));
            }
            if (o.t > 4.3 && o.sang === 1) {
              o.sang = 2;
              let i = 0;
              for (let [s, q] of [
                [74, 0.3],
                [78, 0.3],
                [81, 0.3],
                [86, 0.6],
                [81, 0.3],
                [86, 1.2],
              ])
                (Fi(Da(s), q * 0.95, i), (i += q));
            }
            if (o.t > 7.4 && o.sang === 2) {
              ((o.sang = 3), D.baa());
              for (let i = 0; i < 4; i++) Fi(Da([74, 78, 81, 86][i]), 1.3, 0);
            }
            return (o.t > 9 && o.sang === 3 && ((o.sang = 4), D.grab()), o.t > 10.4);
          }),
          N(() => {
            ((n.egg = null), ee("secret", "goatspace", ct.x, 120));
          }),
          v("mops", "I'm fine! Best break EVER."),
          N(() => {
            n.ctrl = !0;
          }),
        ]));
    }
    function yA() {
      let o = n.egg.t;
      (e.save(), (e.fillStyle = "#0b1026"), e.fillRect(0, 0, c, b));
      for (let T = 0; T < 90; T++) {
        let R = (T * 137.5 + o * (8 + (T % 5) * 6)) % c,
          P = (T * 71.3) % b;
        F(c - R, P, T % 7 === 0 ? 2.4 : 1.3, T % 3 ? "#ffffff" : "#ffe27a");
      }
      (m(-40, 120, 210, 420, 30), r("#dfe4ea", 5));
      let i = Math.min(1, o / 0.4) * (o < 9.6 ? 1 : Math.max(0, 1 - (o - 9.6) / 0.5));
      (m(120, 300, 46, 120, 10),
        r("#1e2430", 3),
        m(120 + 40 * i, 300, 46, 120, 10),
        r("#ffb547", 4),
        g("AIRLOCK", 70, 280, 14, y, "center", 900),
        o < 1.2 && ((e.globalAlpha = Math.max(0, 1 - o / 1.2)), g("FWOOMP!", 300, 230, 54, "#ffffff", "center", 900), (e.globalAlpha = 1)));
      let s = o < 1 ? o : o < 9 ? 1 : Math.max(0, 1 - (o - 9) / 1.2),
        q = 150 + s * (440 + Math.sin(o * 0.7) * 40),
        d = 360 - s * (90 + Math.sin(o * 0.9) * 30);
      if (
        (e.beginPath(),
        e.moveTo(150, 360),
        e.bezierCurveTo(260, 470, q - 140, d + 160, q - 10, d + 10),
        (e.strokeStyle = "#3fb8f0"),
        (e.lineWidth = 7),
        e.stroke(),
        (e.strokeStyle = y),
        (e.lineWidth = 2),
        e.stroke(),
        o > 1 && o < 9.2)
      ) {
        let T = Math.min(1, (o - 1) / 0.6);
        ((e.globalAlpha = 0.28 * T),
          e.beginPath(),
          e.moveTo(q - 30, 0),
          e.lineTo(q + 30, 0),
          e.lineTo(q + 170, d + 120),
          e.lineTo(q - 170, d + 120),
          e.closePath(),
          (e.fillStyle = "#fff6c2"),
          e.fill(),
          (e.globalAlpha = 1));
        let R = q,
          P = 60;
        (C([R, 0, R, P - 26], "#8a93a3", 3), L(R, P, 26), r("#cfd5de", 3));
        for (let _ = 0; _ < 12; _++) {
          let $ = (_ / 12) * Math.PI * 2 + o * 2;
          F(R + Math.cos($) * 16, P + Math.sin($) * 12, 3, _ % 2 ? "#8fdcff" : "#ffffff");
        }
        for (let _ = 0; _ < 14; _++) {
          let $ = (_ / 14) * Math.PI * 2 + o * 1.3;
          ((e.globalAlpha = 0.6),
            F(
              R + Math.cos($) * (180 + _ * 14),
              P + 120 + Math.sin($) * (90 + _ * 8),
              4,
              ["#ff5fa8", "#3478f6", "#ffcf33", "#2bc48a"][_ % 4],
            ));
        }
        e.globalAlpha = 1;
      }
      (e.save(),
        e.translate(q, d),
        e.rotate(Math.sin(o * 0.8) * 0.35 + (o > 7.4 && o < 9 ? 0.2 : 0)),
        Fe(0, 60, 2.6, { f: 1, mop: !0, eyes: o > 7.4 && o < 9 ? "closed" : "", mouth: o > 1 && o < 9 ? "open" : "" }),
        e.restore());
      let A =
        o > 1 && o < 4.3
          ? "\u266A I'm GOATING in space! \u266A"
          : o > 4.3 && o < 7.4
            ? "\u266B I'm GOATING in spaaace! \u266B"
            : o > 7.4 && o < 9.2
              ? "BAAAAAAA!"
              : "";
      if (A) {
        let T = A === "BAAAAAAA!";
        (e.save(),
          e.translate(c / 2 + 80, T ? 560 : 580),
          T && e.scale(1 + 0.06 * Math.sin(o * 20), 1 + 0.06 * Math.sin(o * 20)),
          g(A, 0, 0, T ? 64 : 36, T ? "#ffcf33" : "#ffffff", "center", 900),
          e.restore());
      }
      (o > 9 && g("*reel reel reel*", 330, 470, 22, "#8fdcff", "center", 800), e.restore());
    }
    function mA(l) {
      n.ctrl &&
        (Yh(l, gt, Fs, "S9"),
        x.mops &&
          x.lureBot.look <= 0 &&
          Math.hypot(x.lureBot.x - n.mo.x, x.lureBot.y - n.mo.y) < 110 &&
          !x.sing &&
          ((x.seenPart = !0), kV("bot", "Former Ganitor! SHOO!"), df(Fs, "S9 shoo")));
    }
    function Ih() {
      ((n.scene = "S10"),
        (n.room = "hall"),
        switchTo("squatch"),
        (n.sqPose = "stand"),
        (x.spot = -1),
        (n.sq.x = 980),
        (n.sq.y = 560),
        (n.mo.x = 1200),
        (n.mo.y = 560),
        _s(bo.x, bo.y),
        n.pulse.clear(),
        n.pulse.add("vent"),
        (x.bumped = !1),
        (n.ctrl = !0),
        (n.chip = ""));
    }
    function s10Spots() {
      return [
        spot({
          id: "vent",
          verb: "SQUEEZE",
          who: "mo",
          x: SV.x,
          y: SV.y,
          r: 90,
          at: [SV.x, SV.y - 60],
          when: x.mops,
          hot: !0,
          f: () => {
            ((n.ctrl = !1),
              (n.act = null),
              D.hide(),
              n.pulse.delete("vent"),
              J([
                N(() => {
                  ((n.room = "duct"), (n.scene = "S10d"), (n.mo = { x: 140, y: 430, f: 1, walk: 0, moving: !1 }), (n.ctrl = !0));
                }),
              ]));
          },
        }),
        spot({
          id: "vent",
          verb: "SQUEEZE",
          who: "sq",
          x: SV.x,
          y: SV.y,
          r: 90,
          at: [SV.x, SV.y - 60],
          when: !x.mops,
          hot: !0,
          f: () => {
            (D.bzzt(), TV([v("sq", "Too big! Mops, you try.")]), (x.bumped = !0));
          },
        }),
      ];
    }
    function bA() {
      return pick(s10Spots());
    }
    let Rl = { x: 760, y: 430 },
      zl = { x: 470, y: 440 };
    // In the duct Mops can only move between y 400 and 470, so a strip from 390 to 480 holds every
    // place the old test (x near, any y) did.
    function s10dSpots() {
      let l = (o, i) => ({ x0: o, x1: i, y0: 390, y1: 480 });
      return [
        spot({
          id: "notes",
          verb: "UNFOLD",
          who: "mo",
          box: l(zl.x - 70, zl.x + 70),
          at: [zl.x, zl.y - 40],
          when: !!x.notesBall,
          f: () => {
            ((n.ctrl = !1),
              (n.act = null),
              (x.notesBall = !1),
              ee("secret", "notes", 300, 80),
              J([
                { k: "panel", id: "notes" },
                v("mops", "...Nothing to see here!"),
                N(() => {
                  n.ctrl = !0;
                }),
              ]));
          },
        }),
        spot({
          id: "half2",
          verb: "GRAB",
          who: "mo",
          box: l(Rl.x - 70, Rl.x + 70),
          at: [Rl.x, Rl.y - 40],
          when: !x.got2,
          hot: !0,
          f: () => {
            ((n.ctrl = !1),
              (n.act = null),
              (x.got2 = !0),
              B.halves[1] && (B.halves[1].on = !1),
              D.grab(),
              J([
                { k: "panel", id: "half2" },
                v("mops", "Got it! Squeezy squeeze."),
                N(() => {
                  n.ctrl = !0;
                }),
              ]));
          },
        }),
        spot({
          id: "out",
          verb: "OUT",
          who: "mo",
          box: l(90, 200),
          at: [120, 380],
          when: !!x.got2,
          hot: !0,
          f: () => {
            ((n.ctrl = !1), D.hide(), J([N(Kh)]));
          },
        }),
      ];
    }
    function pA() {
      return pick(s10dSpots());
    }
    function Js() {
      ((n.scene = "S11"),
        (n.room = "hall"),
        (n.live = []),
        switchTo("squatch"),
        (x.spot = -1),
        (n.sqPose = "stand"),
        _s(Ch.x, Ch.y),
        (n.sq = { x: 760, y: 420, f: 1, walk: 0, moving: !1 }),
        (n.mo = { x: 980, y: 560, f: -1, walk: 0, moving: !1 }),
        (n.moPose = "stand"),
        n.pulse.clear(),
        n.pulse.add("plant11"),
        (n.ctrl = !0),
        (n.chip = ""),
        (B.camX = 480));
    }
    function Kh() {
      (Js(),
        (n.ctrl = !1),
        (x.seenPart = !1),
        (x.doorOpen = !1),
        (x.costume = !1),
        (x.gateBumps = 0),
        (x.mopsHint = !1),
        J([
          v("mops", "That bot guards the door. I'll wait over here."),
          v("mops", "Lure it to the plant. STOP singing before it gets there!"),
          v("mops", "Then I'll type the code."),
          N(() => {
            n.ctrl = !0;
          }),
        ]));
    }
    // Walking into the scanner gate (S11, door open) is not a button; it is still a spot, so its ring
    // sits where it works. gA checks it.
    function gateSpot() {
      return spot({ id: "gate", who: "sq", x: Ha.x, y: Ha.y, r: 50, when: !!x.doorOpen });
    }
    function s11Spots() {
      return [
        spot({
          id: "ward",
          verb: "WEAR",
          who: "sq",
          x: Le.x,
          y: Le.y,
          r: 100,
          at: [Le.x, Le.y - 110],
          when: !!x.doorOpen && !x.costume && !!x.mopsHint,
          hot: !0,
          f: () => {
            ((n.ctrl = !1),
              (n.act = null),
              (x.costume = !0),
              n.pulse.delete("ward"),
              D.grab(),
              J([
                v("sq", "Baaa? BAAA!"),
                v("mops", "More bleat. Less roar."),
                N(() => {
                  (n.pulse.add("gate"), (n.ctrl = !0));
                }),
              ]));
          },
        }),
        gateSpot(),
        spot({
          id: "keypad",
          verb: "TYPE",
          who: "mo",
          x: Ga.x,
          y: Ga.y + 90,
          r: 110,
          at: [Ga.x, Ga.y - 20],
          when: !x.doorOpen && x.mops,
          hot: !0,
          f: () => {
            if (Math.hypot(x.lureBot.x - Ga.x, x.lureBot.y - Ga.y) < 150) {
              (D.bzzt(), kV("mops", "Bot's still on the door. Lure it to the plant!"));
              return;
            }
            ((n.ctrl = !1),
              (n.act = null),
              (x.sing = !1),
              D.key(),
              J([
                { k: "panel", id: "keypad" },
                N(() => {
                  ((x.doorOpen = !0), D.zap(), x.seenPart || Ta("sneak-s11"), yf(!1));
                }),
                v("sq", "Door open! Uh oh... a fur scanner."),
                N(() => {
                  n.ctrl = !0;
                }),
              ]));
          },
        }),
        ...(x.doorOpen ? [] : lureSpots(ne, "plant11", () => n.pulse.delete("plant11"))),
      ];
    }
    function AA() {
      return pick(s11Spots());
    }
    function gA(l) {
      if (n.ctrl) {
        if (!x.doorOpen) {
          (Yh(l, ne, Js, "S11"),
            x.mops &&
              !x.sing &&
              x.lureBot.look <= 0 &&
              Math.hypot(x.lureBot.x - n.mo.x, x.lureBot.y - n.mo.y) < 110 &&
              ((x.seenPart = !0), kV("bot", "Former Ganitor! SHOO!"), df(Js, "S11 shoo")));
          return;
        }
        (x.mops && yf(!1),
          inSpot(gateSpot()) &&
            (x.costume
              ? ((n.ctrl = !1), (n.act = null), n.pulse.delete("gate"), D.pickup(), J([v("scanner", "HAIR... PROBABLY. PROCEED."), N(Xh)]))
              : ((n.sq.x -= 70),
                x.gateBumps++,
                D.alarm(),
                kV("scanner", "FUR DETECTED. NO WOOKIES!"),
                x.mopsHint ||
                  ((x.mopsHint = !0), n.pulse.add("ward"), TV([uV(1.2), v("mops", "My goat costume! In the Storage wardrobe.")])))));
      }
    }
    let D0 = [
        { x: 300, y: 430, name: "SPACE JUICE", col: "#3478f6" },
        { x: 440, y: 430, name: "COMET CRISPS", col: "#ffb000" },
        { x: 580, y: 430, name: "ROCKET POPS", col: "#e5533d" },
      ],
      ue = { x: 140, y: 590 },
      Gt = { x: 520, y: 610 },
      hn = { x: 760, y: 220 };
    function Xh() {
      ((n.scene = "S12"),
        (n.room = "hangar"),
        (n.live = []),
        switchTo("squatch"),
        (n.sqPose = "stand"),
        (n.sq = { x: 120, y: 520, f: 1, walk: 0, moving: !1 }),
        (n.mo = { x: 880, y: 520, f: -1, walk: 0, moving: !1 }),
        (n.moPose = "stand"),
        n.pulse.clear(),
        ["c0", "c1", "c2"].forEach((l) => n.pulse.add(l)),
        (n.ctrl = !1),
        J([
          v("mops", "Long trip. Get your favourites."),
          N(() => {
            ((n.chip = "Grab 3 snacks"), (n.ctrl = !0));
          }),
        ]));
    }
    function Zs() {
      (Gn++, D.grab(), Gn >= 3 ? ((n.chip = ""), n.pulse.add("ship")) : (n.chip = "Grab 3 snacks"));
    }
    function s12Spots() {
      return [
        ...D0.map((l, i) =>
          spot({
            id: "c" + i,
            verb: "GRAB",
            who: "sq",
            x: l.x,
            y: l.y + 30,
            r: 80,
            at: [l.x, l.y - 90],
            when: !x.coolers[i],
            hot: !0,
            f: () => {
              ((x.coolers[i] = !0), n.pulse.delete("c" + i), Zs());
            },
          }),
        ),
        spot({ id: "tarp", verb: "PULL", who: "sq", x: ue.x, y: ue.y, r: 90, at: [ue.x, ue.y - 70], when: !!x.tarp, f: () => {
            ((x.tarp = !1), D.grab());
          } }),
        spot({
          id: "nachos",
          verb: "GRAB",
          who: "sq",
          x: ue.x,
          y: ue.y,
          r: 90,
          at: [ue.x, ue.y - 70],
          when: !x.tarp && !x.nachos,
          f: () => {
            ((x.nachos = !0), ee("secret", "nachos", 300, 80), Zs(), TV([v("sq", "Astro-Nachos! My favourite!")]));
          },
        }),
        spot({ id: "crates", verb: "PUSH", who: "sq", x: Gt.x, y: Gt.y, r: 100, at: [Gt.x, Gt.y - 90], when: !!x.crates, f: () => {
            ((x.crates = !1), D.bzzt());
          } }),
        spot({
          id: "icecream",
          verb: "GRAB",
          who: "sq",
          x: Gt.x + 60,
          y: Gt.y,
          r: 100,
          at: [Gt.x + 60, Gt.y - 70],
          when: !x.crates && !x.icecream,
          f: () => {
            ((x.icecream = !0), ee("secret", "icecream", 300, 80), Zs(), TV([v("sq", "Freeze-Dried Ice Cream! My favourite!")]));
          },
        }),
        spot({ id: "ship", verb: "BOARD", cap: "ship", who: "sq", x: hn.x, y: hn.y + 150, r: 140, at: [hn.x, hn.y + 40], when: Gn >= 3, hot: !0, f: vA }),
      ];
    }
    function xA() {
      return pick(s12Spots());
    }
    function jh() {
      let l = ["stash", "photo23", "badge", "pie500", "notes", "nachos", "icecream"],
        o = ["crib", "plaque", "wanted"],
        i = ["sneak-s1", "sneak-s6", "sneak-s9", "sneak-s11"],
        s = aV.caught + x.caught;
      return [
        "Secrets found " + l.filter((q) => n.found.has(q)).length + "/" + l.length,
        "Funny finds " + o.filter((q) => n.found.has(q)).length + "/" + o.length,
        "Sneaky! " + i.filter((q) => n.found.has(q)).length + "/" + i.length,
        "Times caught " + s + (s ? " (\u2212" + s * 100 + ")" : ""),
        s === 0 ? "GHOST BONUS +250" : "Ghost bonus: get caught 0 times",
        "Chapter score \u2605 " + n.stars,
      ];
    }
    function vA() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.clear(),
        (n.chip = ""),
        D.zap(),
        J([
          He(n.sq, hn.x - 30, hn.y + 120, 150),
          N(() => {
            n.sqPose = "hidden";
          }),
          He(n.mo, hn.x + 30, hn.y + 120, 150),
          N(() => {
            n.moPose = "hidden";
          }),
          { k: "panel", id: "dash" },
          v("mops", "Fuel gauge says... just enough to reach the gas stop."),
          v("sq", "Mars, here we come!"),
          N(() => {
            (aV.caught + x.caught === 0 && !n.found.has("ghost1") && (n.found.add("ghost1"), (n.stars += 250)), (B.nextBeat = "Ch2"));
          }),
          { k: "panel", id: "tally" },
          N(Ws),
        ]));
    }
