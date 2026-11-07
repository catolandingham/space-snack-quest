// Chapter 3, Phobos (scenes P0 to P4): state, hotspots, scenes, room drawing, and the Chapter 3 tally.
    function V6(l) {
      if ((C([60, 440, 900, 440], y, 4), g("STORMTOP \xB7 NIGHT", 120, 460, 16, "#59657d", "left", 800), l === "fb2cry")) {
        (m(410, 360, 140, 80, 10),
          r("#8a93a3", 4),
          C([420, 360, 480, 300, 540, 360], y, 3),
          Re(480, 380, 0.9, { f: 1, eyes: "closed" }),
          m(410, 380, 140, 60, 10),
          r("#8a93a3", 4),
          g("MOP", 480, 412, 18, "#ffffff", "center", 900));
        for (let [o, i] of [
          [-30, -50],
          [30, -56],
        ])
          (X(480 + o, 380 + i, 5, 8), r("#8fdcff", 2));
        (g("WAAAH!", 480, 250, 34, "#e5533d", "center", 900), Fe(740, 440, 1.5, { f: -1, mouth: "o" }));
      }
      (l === "fb2write" &&
        (Fe(520, 440, 1.7, { f: -1 }),
        m(330, 360, 120, 80, 4),
        r("#fffaf0", 3),
        g("Brave Sasquatches", 390, 384, 11, y, "center", 800),
        g("stay hidden.", 390, 400, 11, y, "center", 800),
        g("\u2014 The Guardians", 395, 424, 10, y, "center", 800),
        C([440, 330, 470, 380], "#3478f6", 4)),
        l === "fb2note" &&
          (Xn(360, 330, 240, 110, ""),
          Re(480, 380, 0.9, { f: 1 }),
          m(410, 250, 140, 70, 4),
          r("#fffaf0", 3),
          g("Brave Sasquatches", 480, 272, 14, y, "center", 900),
          g("stay hidden.", 480, 290, 14, y, "center", 900),
          g("\u2014 The Guardians", 490, 310, 11, y, "center", 800)));
    }
    let OV = { x: 400, y: 500 },
      Af = { x: 230, y: 440 },
      Ne = { x: 600, y: 585 },
      Qn = { x: 80, y: 470 },
      e6 = { x: 830, y: 250 },
      gf = { x: 600, y: 250 },
      Pe = { x: 620, y: 470 },
      La = { x: 150, y: 450 },
      G0 = { x: 310, y: 450 },
      ae = { x: 110, y: 545 },
      Yn = { x: 900, y: 440 },
      Ht = { x: 260, y: 480 },
      Pa = { x: 700, y: 480 },
      Lt = { x: 480, y: 420 },
      Gl = { x: 95, y: 440 },
      H0 = { x: 40, y: 560 },
      Q = {
        phase: "",
        caught: 0,
        start: 0,
        rov: [],
        m1: !1,
        m2: !1,
        open: !1,
        mug: !1,
        log: !1,
        sign: !1,
        zip: !1,
        zipX: 230,
        rope: "",
        floatT: 0,
        miss: 0,
        sings: 0,
        waltz: !1,
      };
    function t6() {
      Object.assign(Q, {
        phase: "",
        caught: 0,
        start: n.stars,
        rov: [],
        m1: !1,
        m2: !1,
        open: !1,
        mug: !1,
        log: !1,
        sign: !1,
        zip: !0,
        zipX: 230,
        rope: "",
        floatT: 0,
        miss: 0,
      });
    }
    function go(l) {
      return { ox: l.x, oy: l.y - 40, a: l.f > 0 ? 0.15 : Math.PI - 0.15 };
    }
    function a6(l) {
      let o = Q.rov[0];
      if (!o) return;
      if (o.alert > 0) {
        o.alert -= l;
        return;
      }
      o.pause > 0
        ? ((o.pause -= l), o.pause <= 0 && (o.f = -o.f))
        : ((o.x += o.f * 55 * l), (o.x > 640 || o.x < 480) && ((o.x = w(o.x, 480, 640)), (o.pause = 1.8)));
      let i = go(o),
        s = n.sq;
      // Seen: the rover stops for a moment and security comes (the one capture rule, 25-capture.js).
      n.ctrl &&
        !x.mops &&
        !ch2.sec &&
        n.sqPose !== "hidden" &&
        vt(s.x, s.y - 40, i.ox, i.oy, i.a, 0.55, 200) &&
        (bf(o.x, o.y, "rover"), (o.alert = 0.5), sSec("rover1"));
    }
    function n6(l) {
      if (Q.phase !== "p3") return;
      let o = x.sing && n.sqPose === "hidden" && x.spot === 71;
      if (
        (o &&
          Q.rov.length === 2 &&
          Q.rov.every((s) => s.x >= Yn.x - 60 - (s.hx > 500 ? 0 : 60) - 2) &&
          Q.sings >= 2 &&
          !Q.waltz &&
          ((Q.waltz = !0),
          ee("funny", "waltz", Yn.x - 150, 400),
          TV([v("sq", "They're... WALTZING?!", "whisper"), v("mops", "One-two-three, one-two-three.")])),
        !o && Q.waltz)
      )
        for (let s of Q.rov) s.y += (500 - s.y) * Math.min(1, l * 6);
      if (
        (Q.rov.forEach((s, q) => {
          if (o && Q.waltz) {
            s.look = 4;
            let d = n.T * 2.4 + q * Math.PI;
            ((s.x = Yn.x - 150 + Math.cos(d) * 55), (s.y = 500 + Math.sin(d) * 18), (s.f = Math.sin(d) > 0 ? -1 : 1));
            return;
          }
          o
            ? ((s.look = 4), (s.f = 1), (s.x = Math.min(Yn.x - 60 - (s.hx > 500 ? 0 : 60), s.x + 70 * l)))
            : s.look > 0
              ? (s.look -= l)
              : Math.abs(s.x - s.hx) > 1
                ? ((s.f = s.x < s.hx ? 1 : -1), (s.x += s.f * Math.min(Math.abs(s.x - s.hx), 50 * l)))
                : (s.f = s.hf);
        }),
        !!n.ctrl)
      )
        for (let s of Q.rov) {
          if (s.look > 0) continue;
          let q = go(s);
          if (n.sqPose !== "hidden" && !ch2.sec && vt(n.sq.x, n.sq.y - 40, q.ox, q.oy, q.a, 0.55, 240)) {
            (bf(s.x, s.y, "rover"), sSec("rover-s"));
            return;
          }
          if (n.moPose !== "hidden" && n.mo.x > -100 && vt(n.mo.x, n.mo.y - 40, q.ox, q.oy, q.a, 0.55, 240)) {
            shoo(CH3_CHECKPOINTS.p3, [v("rover", "HANDS OFF THE MIRRORS, GOAT."), v("mops", "Just... dusting."), v("rover", "Back. Out.")]);
            return;
          }
        }
    }
    function l6(l) {
      if (Q.phase !== "p4a") return;
      let o = Q.rov[0];
      if (o) {
        if (x.sing && n.sqPose === "hidden" && x.spot === 70) {
          if (((o.look = 4), (o.f = -1), (o.x = Math.max(OV.x + 80, o.x - 60 * l)), o.x <= OV.x + 82 && n.ctrl)) {
            capture("lure3");
            return;
          }
        } else o.look > 0 ? (o.look -= l) : ((o.x = Math.min(o.hx, o.x + 50 * l)), (o.f = -1));
        if (n.ctrl && !x.mops && !ch2.sec && n.sqPose !== "hidden" && o.look <= 0) {
          let i = go(o);
          vt(n.sq.x, n.sq.y - 40, i.ox, i.oy, i.a, 0.6, 230) && (bf(o.x, o.y, "rover"), sSec("rover4"));
        }
      }
    }
    function o6(l) {
      (de() || (n.room === "pad" && Q.phase === "p1" && a6(l), n6(l), l6(l), qSec(l)),
        Q.phase === "p4b" &&
          Q.floatT >= 0 &&
          ((Q.floatT += l), (n.mo.y = Math.max(170, n.mo.y - 22 * l)), (n.mo.x = Math.max(70, n.mo.x - 4 * l))),
        n.ctrl && (n.act = i6()));
    }
    // The goal chip for Chapter 3: one table, read every frame from the phase and who is in control.
    // Every line names who acts. The first time a mechanic appears the chip names the step; after that it
    // names only the goal (the chip rule, docs/PHASE-1-LINES-FOR-BRIAN.md). Wording waits for Brian's yes
    // (docs/PHASE-2-LINES-FOR-BRIAN.md). A key with no line shows no new chip.
    const CH3_CHIPS = {
      p1: "Squatch: hide in a barrel",
      p2: "Mops: ask Zip for a ride to Mars",
      p3: "Squatch: hide in the echo spot",
      "p3:hid": "Squatch: sing the rovers away from the mirrors",
      "p3:sing": "Squatch: let Mops turn the mirrors",
      "p3:m1": "Mops: turn the first mirror",
      "p3:m2": "Mops: turn the second mirror",
      p3x: "Mops: go out the temple door",
      p4a: "Squatch: get the rover off the ramp",
      "p4a:sing": "Squatch: get the rover off the ramp",
      "p4a:run": "Squatch: run to the ship",
      "p4a:board": "Squatch: get on board",
      p4b: "Squatch: grab the rope from the cart",
      "p4b:rope": "Squatch: throw the rope to Mops",
    };
    function ch3ChipKey() {
      let l = Q.phase || "",
        o = Q.rov && Q.rov[0];
      return l === "p3"
        ? x.mops
          ? Q.m1
            ? "p3:m2"
            : "p3:m1"
          : n.sqPose !== "hidden"
            ? "p3"
            : x.sing
              ? "p3:sing"
              : "p3:hid"
        : l === "p4a"
          ? x.sing
            ? "p4a:sing"
            : n.act && n.act.verb === "BOARD"
              ? "p4a:board"
              : o && o.look > 0
              ? "p4a:run"
              : "p4a"
          : l === "p4b"
            ? Q.rope === "held"
              ? "p4b:rope"
              : "p4b"
            : l;
    }
    // Chapter 3's spots, in the order the picker tries them (see spot in 00-core.js).
    function ch3Spots() {
      let i = Q.phase,
        padSq = n.room === "pad" && !x.mops,
        padMo = n.room === "pad" && x.mops && i === "p2",
        temple = n.room === "temple" && i === "p3",
        sing = (l, o, i) =>
          spot({
            id: "sing",
            verb: x.sing ? "STOP" : "SING",
            cap: x.sing ? "singing" : "song",
            who: "sq",
            at: [l.x, l.y - o],
            when: i,
            hot: !x.sing,
            f: x.sing
              ? () => {
                  x.sing = !1;
                }
              : () => {
                  ((x.sing = !0), l === ae && Q.sings++, D.snore());
                },
          });
      return [
        spot({
          id: "barrel",
          verb: "HIDE",
          cap: "barrel",
          who: "sq",
          x: OV.x,
          y: OV.y,
          r: 80,
          at: [OV.x, OV.y - 100],
          when: padSq && i === "p1" && n.sqPose !== "hidden",
          hot: !0,
          f: () => {
            (dn(OV.x, OV.y, 70), n.pulse.delete("barrel"), f6());
          },
        }),
        spot({
          id: "barrel",
          verb: "HIDE",
          cap: "barrel",
          who: "sq",
          x: OV.x,
          y: OV.y,
          r: 80,
          at: [OV.x, OV.y - 100],
          when: padSq && i === "p4a" && n.sqPose !== "hidden",
          hot: !0,
          f: () => {
            dn(OV.x, OV.y, 70);
          },
        }),
        sing(OV, 110, padSq && i === "p4a" && n.sqPose === "hidden" && x.spot === 70),
        spot({ id: "ramp", verb: "BOARD", cap: "ship", who: "sq", x: Pe.x, y: Pe.y, r: 80, at: [Pe.x, 360], when: padSq && i === "p4a" && n.sqPose !== "hidden", hot: !0, f: r6 }),
        spot({
          id: "cart",
          verb: "GRAB",
          cap: "rope",
          who: "sq",
          x: Ne.x,
          y: Ne.y,
          r: 80,
          at: [Ne.x, Ne.y - 90],
          when: padSq && i === "p4b" && !Q.rope,
          hot: !0,
          f: () => {
            ((Q.rope = "held"), D.grab(), n.pulse.delete("cart"), n.pulse.add("edge"));
          },
        }),
        spot({ id: "edge", verb: "THROW", cap: "rope", who: "sq", x: Qn.x + 40, y: Qn.y, r: 100, at: [Qn.x + 40, 340], when: padSq && i === "p4b" && Q.rope === "held", hot: !0, f: c6 }),
        spot({
          id: "mug",
          verb: "LIFT",
          cap: "mug",
          who: "mo",
          x: La.x,
          y: La.y,
          r: 70,
          at: [La.x, 330],
          when: padMo && !Q.mug,
          f: () => {
            ((Q.mug = !0), ee("funny", "mug", La.x, 320), TV([v("mops", `"World's Okayest Raccoon." Honest.`)]));
          },
        }),
        spot({
          id: "dlog",
          verb: "FLIP",
          cap: "delivery log",
          who: "mo",
          x: G0.x,
          y: G0.y,
          r: 70,
          at: [G0.x, 330],
          when: padMo && !Q.log,
          f: () => {
            ((Q.log = !0), ee("secret", "deliverylog", G0.x, 320), TV([{ k: "panel", id: "dlog" }, v("mops", "...Pancake stand. Every Tuesday.")]));
          },
        }),
        spot({ id: "zip", verb: "ASK", cap: "Zip", who: "mo", x: Af.x, y: Af.y + 40, r: 120, at: [Af.x, 280], when: padMo, hot: !0, f: s6 }),
        spot({
          id: "sign",
          verb: "WIPE",
          cap: "sign",
          who: "ctl",
          x: Gl.x,
          y: Gl.y,
          r: 70,
          at: [Gl.x, 300],
          when: temple && !Q.sign,
          f: () => {
            ((Q.sign = !0),
              D.splash(),
              ee("funny", "sign", Gl.x, 290),
              TV([v(x.mops ? "mops" : "sq", x.mops ? '"Singing welcome." Huh.' : "SINGING WELCOME?!", x.mops ? "say" : "whisper")]));
          },
        }),
        spot({
          id: "alcove",
          verb: "HIDE",
          cap: "echo spot",
          who: "sq",
          x: ae.x,
          y: ae.y,
          r: 80,
          at: [ae.x, ae.y - 110],
          when: temple && !x.mops && n.sqPose !== "hidden",
          hot: !0,
          f: () => {
            (dn(ae.x, ae.y, 71), n.pulse.delete("alcove"));
          },
        }),
        sing(ae, 120, temple && !x.mops && n.sqPose === "hidden" && x.spot === 71),
        spot({
          id: "m1",
          verb: "TURN",
          cap: "mirror",
          who: "mo",
          x: Ht.x,
          y: Ht.y,
          r: 70,
          at: [Ht.x, Ht.y - 120],
          when: temple && x.mops && !Q.m1,
          hot: !0,
          f: () => {
            ((Q.m1 = !0), D.key(), n.pulse.delete("m1"), n.pulse.add("m2"));
          },
        }),
        spot({ id: "m2", verb: "TURN", cap: "mirror", who: "mo", x: Pa.x, y: Pa.y, r: 70, at: [Pa.x, Pa.y - 120], when: temple && x.mops && Q.m1 && !Q.m2, hot: !0, f: q6 }),
        spot({
          id: "mural",
          verb: "LOOK",
          cap: "mural",
          who: "mo",
          x: Lt.x,
          y: Lt.y + 40,
          r: 110,
          at: [Lt.x, 200],
          when: n.room === "temple" && i === "p3x" && x.mops && !n.found.has("mural"),
          f: () => {
            (ee("secret", "mural", Lt.x, 200), TV([{ k: "panel", id: "mural" }, v("mops", "...Huh. Look at that.")]));
          },
        }),
        spot({ id: "texit", verb: "EXIT", cap: "temple", who: "mo", x: H0.x, y: H0.y, r: 90, at: [H0.x + 20, 420], when: n.room === "temple" && i === "p3x" && x.mops, hot: !0, f: q2 }),
      ];
    }
    function i6() {
      return pick(ch3Spots());
    }
    function aq() {
      (Ml(3),
        t6(),
        (Q.zip = !1),
        (ch2.bots = []),
        (pa.bot = "Security"),
        (n.fbPic = ""),
        (n.scene = "P0"),
        (n.room = "pad"),
        (n.live = []),
        switchTo("squatch"),
        (x.spot = -1),
        (x.sing = !1),
        (x.costume = !1),
        n.pulse.clear(),
        (n.ctrl = !1),
        (B.nextBeat = "Ch4"),
        (n.sq = { x: 880, y: 560, f: -1, walk: 0, moving: !1 }),
        (n.mo = { x: 900, y: 500, f: -1, walk: 0, moving: !1 }),
        (n.sqPose = "stand"),
        (n.moPose = "stand"),
        (Q.rov = [{ x: 600, y: 500, hx: 640, hf: -1, f: -1, look: 0, pause: 0, alert: 0 }]),
        J([
          { k: "card", id: "ch3", text: "Chapter 3 \xB7 Phobos" },
          { k: "panel", id: "route" },
          v("sq", "Phobos! Mars is RIGHT next door!"),
          v("mops", "Folks here still jump at a Squatch. Searchlights and gate bots lock you up. Keep your head down."),
          v("sq", "Which way to the pancake stand?"),
          { k: "panel", id: "brochure" },
          v("mops", "The address is under the coffee."),
          v("mops", "We need someone who knows the way."),
          v("mops", "Pretzels to Mars every day. That raccoon knows the way."),
          v("mops", "Hide in a barrel. I'll do the talking."),
          N(() => {
            ((n.scene = "P1"), (Q.phase = "p1"), n.pulse.add("barrel"), (n.ctrl = !0));
          }),
        ]));
    }
    function f6() {
      ((n.ctrl = !1),
        (n.act = null),
        J([
          uV(0.3),
          N(() => {
            (Ta("sneak-p1"), (Q.zip = !0), (Q.zipX = gf.x));
          }),
          cV((l) => ((Q.zipX = Math.max(230, Q.zipX - 150 * l)), Q.zipX <= 230)),
          v("zip", "Hot pretzels! Mars deliveries daily!"),
          cV((l) => mV(n.mo, Af.x + 140, 520, 180, l)),
          N(u6),
        ]));
    }
    function u6() {
      ((n.scene = "P2"), (Q.phase = "p2"), switchTo("mops"), (n.mo.f = -1), n.pulse.clear(), n.pulse.add("zip"), (n.ctrl = !0));
    }
    function s6() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.clear(),
        J([
          v("mops", "Could you take us to the pancake stand on Mars?"),
          v("zip", "Sure, if you help me first. My star map's locked in the old temple."),
          v("zip", "Door only opens for sunlight. Rovers guard the mirrors."),
          v("sq", "Mops! Sing to the rovers. Like at the gas stop!", "whisper"),
          v("zip", "...Did that barrel just talk?"),
          v("mops", "...Baaa."),
          v("zip", "Huh. Talking barrels. Phobos, man."),
          N(s2),
        ]));
    }
    function s2() {
      ((n.scene = "P3"),
        (n.room = "temple"),
        (Q.phase = "p3"),
        (Q.zip = !1),
        (Q.miss = 0),
        (Q.sings = 0),
        (Q.waltz = !1),
        switchTo("squatch"),
        (x.spot = -1),
        (x.sing = !1),
        (n.sqPose = "stand"),
        (n.moPose = "stand"),
        (n.sq = { x: 60, y: 480, f: 1, walk: 0, moving: !1 }),
        (n.mo = { x: 70, y: 600, f: 1, walk: 0, moving: !1 }),
        (Q.rov = [
          { x: 380, y: 500, hx: 380, hf: -1, f: -1, look: 0, pause: 0, alert: 0 },
          { x: 590, y: 500, hx: 590, hf: 1, f: 1, look: 0, pause: 0, alert: 0 },
        ]),
        J([
          v("mops", "You sing, I turn. Echo spot's over there."),
          N(() => {
            (n.pulse.add("alcove"), n.pulse.add("m1"), (n.ctrl = !0));
          }),
        ]));
    }
    function q6() {
      ((n.ctrl = !1),
        (n.act = null),
        (Q.m2 = !0),
        n.pulse.clear(),
        D.zap(),
        (x.sing = !1),
        Q.miss === 0 && Ta("sneak-p3"),
        J([
          uV(0.4),
          N(() => {
            ((Q.open = !0), D.open());
          }),
          uV(0.8),
          v("mops", "Squatch, stay hid. Someone's coming.", "whisper"),
          cV((l) => mV(n.mo, 200, 580, 200, l)),
          N(() => {
            ((n.sqPose = "hidden"), (x.spot = 71), (n.sq.x = ae.x), (n.sq.y = ae.y), (Q.zip = !0), (Q.zipX = -40));
          }),
          cV((l) => ((Q.zipX = Math.min(420, Q.zipX + 160 * l)), Q.zipX >= 420)),
          v("zip", "My map! You two are something."),
          { k: "panel", id: "starmap" },
          v("zip", "Sasquatches on Mars? Sure, they buy all my pretzels."),
          N(() => {
            Q.phase = "p3b";
          }),
          v("sq", "A whole family. Like ME. Singing out loud!", "whisper"),
          v("mops", "Will you still sing our song there?", "whisper"),
          v("sq", "Maybe. They'll have their own songs.", "whisper"),
          v("mops", "..."),
          v("zip", "Ship leaves at sunset. Rovers, load up!"),
          cV((l) => {
            let o = !0;
            ((Q.zipX -= 160 * l), Q.zipX > -60 && (o = !1));
            for (let i of Q.rov) ((i.f = -1), (i.x -= 160 * l), i.x > -60 && (o = !1));
            return o;
          }),
          N(() => {
            ((Q.zip = !1), (Q.rov = []), (Q.phase = "p3x"), switchTo("mops"), n.pulse.add("texit"), (n.ctrl = !0));
          }),
        ]));
    }
    function q2() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.clear(),
        (n.scene = "P4"),
        (n.room = "pad"),
        (Q.phase = "p4i"),
        (Q.zip = !1),
        (Q.zipX = gf.x),
        switchTo("squatch"),
        (x.sing = !1),
        (n.mo = { x: 300, y: 540, f: 1, walk: 0, moving: !1 }),
        (n.moPose = "stand"),
        (n.sqPose = "hidden"),
        (x.spot = 70),
        (n.sq.x = OV.x),
        (n.sq.y = OV.y),
        (Q.rov = [{ x: 640, y: 500, hx: 640, hf: -1, f: -1, look: 0, pause: 0, alert: 0 }]),
        J([
          v("mops", "Rover's on the ramp. Go on. Sing it."),
          v("mops", "...It's still our song. For now."),
          N(() => {
            ((Q.phase = "p4a"), (n.ctrl = !0));
          }),
        ]));
    }
    function r6() {
      ((n.ctrl = !1),
        (n.act = null),
        (x.sing = !1),
        Ta("sneak-p4"),
        J([
          He(n.sq, Pe.x, Pe.y, 170),
          N(() => {
            ((n.sqPose = "hidden"), (x.spot = 72));
          }),
          uV(0.5),
          v("mops", "I'll... get some air."),
          cV((l) => mV(n.mo, Qn.x, Qn.y, 120, l)),
          N(() => {
            ((Q.phase = "p4b"), (Q.floatT = 0), D.zap());
          }),
          uV(1.6),
          v("mops", "Whoa. Low gravity."),
          v("sq", "MOPS?!"),
          v("zip", "Rovers, cargo hold!"),
          cV((l) => {
            let o = Q.rov[0];
            return o ? ((o.f = 1), (o.x += 160 * l), o.x > 1010) : !0;
          }),
          N(() => {
            ((Q.rov = []),
              (n.sqPose = "stand"),
              (x.spot = -1),
              (n.sq.x = Pe.x - 30),
              (n.sq.y = 520),
              (n.sq.f = -1),
              n.pulse.add("cart"),
              (n.ctrl = !0));
          }),
        ]));
    }
    function c6() {
      ((n.ctrl = !1),
        (n.act = null),
        (Q.rope = "thrown"),
        n.pulse.clear(),
        D.grab(),
        J([
          uV(0.6),
          N(() => {
            Q.floatT = -1;
          }),
          cV((l) => mV(n.mo, n.sq.x - 60, n.sq.y, 140, l)),
          N(() => {
            ((Q.rope = ""), (n.mo.f = 1), (n.sq.f = -1));
          }),
          v("sq", "I'll always come get you."),
          v("mops", "...I know, kiddo."),
          He(n.sq, Pe.x, Pe.y, 170),
          N(() => {
            ((n.sqPose = "hidden"), (n.sq.x = -300));
          }),
          He(n.mo, Pe.x, Pe.y + 10, 170),
          N(() => {
            n.moPose = "hidden";
          }),
          N(() => {
            (Q.caught === 0 && !n.found.has("ghost3") && (n.found.add("ghost3"), (n.stars += 250)), (B.nextBeat = "Ch4"));
          }),
          { k: "panel", id: "tally3" },
          N(nq),
        ]));
    }
    function r2() {
      let l = ["deliverylog", "mural"],
        o = ["mug", "sign"],
        i = ["sneak-p1", "sneak-p3", "sneak-p4"],
        s = Q.caught;
      return [
        "Secrets found " + l.filter((q) => n.found.has(q)).length + "/" + l.length,
        "Funny finds " + o.filter((q) => n.found.has(q)).length + "/" + o.length,
        "Sneaky! " + i.filter((q) => n.found.has(q)).length + "/" + i.length,
        "Times caught " + s,
        ...(s === 0 ? [NEVER_CAUGHT, NEVER_CAUGHT_WHY] : [NEVER_CAUGHT_TODO]),
        "Chapter score \u2605 " + (n.stars - Q.start),
        "Total \u2605 " + n.stars,
      ];
    }
    function h6(l) {
      if (!n.scene.startsWith("P")) return null;
      if (l === "zip" && n.room === "pad" && !Q.zip) return { x: gf.x, y: 220 };
      if (l === "zip") return n.room === "temple" ? { x: Q.zipX, y: 380 } : { x: Q.zipX, y: 300 };
      if (l === "rover" || l === "rover2") {
        let o = Q.rov[l === "rover" ? 0 : 1];
        return o ? { x: o.x, y: o.y - 90 } : { x: c / 2, y: 200 };
      }
      return null;
    }
    function c2(l, o, i) {
      (pf("zip", l, o, i),
        e.save(),
        e.translate(l, o),
        e.scale(1.6, 1.6),
        e.beginPath(),
        e.moveTo(-i * 10, -14),
        e.quadraticCurveTo(-i * 40, -20, -i * 36, -46),
        (e.lineWidth = 12),
        (e.strokeStyle = y),
        e.stroke(),
        (e.lineWidth = 8),
        (e.strokeStyle = "#9aa3ad"),
        e.stroke());
      for (let s of [0.4, 0.7]) F(-i * (10 + 26 * s), -14 - 26 * s, 4, "#3b414a");
      (m(-14, -40, 28, 36, 10), r("#9aa3ad", 2.5), m(-10, -30, 20, 16, 4), r("#e5533d", 2), g("Z", 0, -22, 9, "#ffffff", "center", 900));
      for (let s of [-12, 12])
        (e.beginPath(), e.moveTo(s - 6, -60), e.lineTo(s, -74), e.lineTo(s + 6, -60), e.closePath(), r("#9aa3ad", 2));
      (L(0, -54, 15),
        r("#c3c9d1", 2.5),
        X(i * 2, -56, 13, 5),
        r("#3b414a", 0),
        F(i * 2 - 5, -56, 2.2, "#ffffff"),
        F(i * 2 + 6, -56, 2.2, "#ffffff"),
        F(i * 6, -48, 2.5, y),
        e.restore());
    }
    function h2(l, o) {
      if (o) {
        let d = go(l);
        Bl(d.ox, d.oy, d.a, 0.55, Q.phase === "p1" ? 200 : 240, l.alert > 0 ? "rgba(229,83,61,.3)" : "rgba(255,207,51,.26)");
      }
      let { x: i, y: s, f: q } = l;
      (X(i, s, 34, 9),
        r("rgba(30,36,48,.18)", 0),
        m(i - 32, s - 40, 64, 32, 8),
        r("#b5bcc8", 3),
        e.beginPath(),
        e.arc(i, s - 40, 24, Math.PI, 0),
        e.closePath(),
        r("#8fdcff", 3),
        L(i + q * 12, s - 50, 6),
        r("#ffcf33", 2),
        g("ROVER", i, s - 22, 9, y, "center", 900));
      for (let d of [-20, 0, 20]) (L(i + d, s - 4, 7), r("#59657d", 2));
      (C([i - q * 18, s - 60, i - q * 22, s - 80], y, 2.5),
        F(i - q * 22, s - 82, 4, l.look > 0 ? "#ffcf33" : "#2bc48a"),
        l.alert > 0 && g("!", i, s - 110, 40, "#e5533d", "center", 900));
    }
    function d6(l, o, i, s) {
      (ringOf(s),
        X(l, o - 2, 40, 10),
        r("#7a4a2a", 3),
        m(l - 40, o - 92, 80, 90, 14),
        r("#c98a4b", 3.5),
        C([l - 40, o - 70, l + 40, o - 70], "#7a4a2a", 4),
        C([l - 40, o - 26, l + 40, o - 26], "#7a4a2a", 4),
        X(l, o - 92, 40, 10),
        r("#e8b06a", 3),
        g("PRETZELS", l, o - 48, 11, "#7a4a2a", "center", 900),
        i && ga(l, o - 92));
    }
    function xo(l, o, i) {
      (e.save(),
        e.translate(l, o),
        e.scale(i, i),
        (e.strokeStyle = "#a8743a"),
        (e.lineWidth = 6),
        e.beginPath(),
        e.arc(-8, 0, 10, 0, Math.PI * 2),
        e.stroke(),
        e.beginPath(),
        e.arc(8, 0, 10, 0, Math.PI * 2),
        e.stroke(),
        e.beginPath(),
        e.moveTo(-14, 12),
        e.lineTo(0, -6),
        e.lineTo(14, 12),
        e.stroke(),
        e.restore());
    }
    function y6(l) {
      if (Q.phase === "p4b" && n.moPose !== "hidden" && n.mo.y < Qn.y - 2) {
        l.push({
          y: 999,
          d: () => {
            (e.save(),
              e.translate(n.mo.x, n.mo.y),
              e.rotate(Math.sin(n.T * 1.3) * 0.5),
              Fe(0, 0, he * 1.15, { f: 1, mop: !0, eyes: "closed" }),
              e.restore(),
              Q.rope === "thrown" && C([n.sq.x - 20, n.sq.y - 80, n.mo.x, n.mo.y - 60], "#a8743a", 4));
          },
        });
        return;
      }
      yn(l);
    }
    function m6() {
      ((e.fillStyle = "#151a2c"), e.fillRect(0, 0, c, b));
      for (let s = 0; s < 34; s++) F((s * 131) % c, (s * 41) % 300, 1.6, "#ffffff");
      (Ut("mars", 560, 120, 70), (e.fillStyle = "#8a8378"), e.fillRect(0, 380, c, b - 380), C([0, 380, c, 380], y, 4));
      for (let s = 0; s < 9; s++) (X(80 + s * 110, 610 - (s % 3) * 50, 24, 7), r("#766f65", 0));
      (ringOf("edge"),
        C([20, 380, 20, b], "#59657d", 5),
        g("EDGE", 46, 400, 12, "#ffffff", "center", 900),
        m(80, 170, 300, 60, 10),
        r("#ffcf33", 4),
        g("ZIP'S PRETZELS", 230, 192, 24, "#7a4a2a", "center", 900),
        g("Mars deliveries daily!", 230, 216, 14, "#e5533d", "center", 800),
        xo(110, 200, 0.8),
        xo(350, 200, 0.8),
        C([100, 230, 100, 380], y, 4),
        C([360, 230, 360, 380], y, 4),
        e.beginPath(),
        e.moveTo(84, 230),
        e.lineTo(376, 230),
        e.lineTo(360, 262),
        e.lineTo(100, 262),
        e.closePath(),
        r("#e5533d", 3),
        Q.zip && n.room === "pad" && Q.phase !== "p4b" && (ringOf("zip"), c2(Q.zipX, 380, 1)),
        m(90, 360, 280, 60, 6),
        r("#fff3d6", 4));
      for (let s = 0; s < 5; s++) xo(200 + s * 30, 352, 0.7);
      (Q.mug
        ? (m(La.x - 14, 330, 28, 30, 5),
          r("#ffffff", 2.5),
          g("OK", La.x, 345, 10, "#e5533d", "center", 900),
          e.save(),
          e.translate(La.x - 30, 356),
          e.rotate(-0.4),
          m(-14, -4, 28, 8, 2),
          r("#ffffff", 1.5),
          e.restore())
        : (e.beginPath(), e.moveTo(La.x - 20, 360), e.lineTo(La.x, 324), e.lineTo(La.x + 20, 360), e.closePath(), r("#ffffff", 2.5)),
        e.save(),
        e.translate(G0.x, 342),
        e.rotate(Q.log ? 0 : 0.12),
        m(-16, -22, 32, 40, 3),
        r("#a8743a", 2.5),
        m(-12, -16, 24, 30, 1),
        r("#fffaf0", 1.5));
      for (let s = 0; s < 3; s++) C([-8, -8 + s * 8, 8, -8 + s * 8], "#59657d", 1.5);
      e.restore();
      let l = e6;
      (m(l.x - 110, l.y - 80, 220, 110, 46), r("#dfe4ea", 5));
      for (let s of [-50, 0, 50]) (L(l.x + s, l.y - 34, 12), r("#8fdcff", 3));
      (e.beginPath(),
        e.moveTo(l.x - 30, l.y + 30),
        e.lineTo(l.x + 30, l.y + 30),
        e.lineTo(l.x + 44, l.y + 130),
        e.lineTo(l.x - 44, l.y + 130),
        e.closePath(),
        r("#b5bcc8", 3));
      let o = gf;
      (m(o.x - 90, o.y - 40, 150, 100, 20),
        r("#ffcf33", 4),
        g("ZIP", o.x - 15, o.y + 10, 22, "#7a4a2a", "center", 900),
        xo(o.x + 34, o.y + 10, 0.6),
        ringOf("ramp"),
        e.beginPath(),
        e.moveTo(Pe.x - 30, o.y + 60),
        e.lineTo(Pe.x + 30, o.y + 60),
        e.lineTo(Pe.x + 44, Pe.y),
        e.lineTo(Pe.x - 44, Pe.y),
        e.closePath(),
        r("#c98a4b", 3));
      let i = [];
      (i.push({
        y: OV.y,
        d: () => {
          (d6(OV.x, OV.y, n.sqPose === "hidden" && x.spot === 70, "barrel"),
            x.sing && x.spot === 70 && Pt(OV.x + 30, OV.y - 120 - ((n.T * 30) % 30)));
        },
      }),
        i.push({
          y: Ne.y,
          d: () => {
            (ringOf("cart"),
              m(Ne.x - 50, Ne.y - 50, 100, 40, 6),
              r("#e5533d", 3),
              L(Ne.x - 30, Ne.y - 6, 10),
              r("#59657d", 2),
              L(Ne.x + 30, Ne.y - 6, 10),
              r("#59657d", 2),
              Q.rope || (X(Ne.x, Ne.y - 60, 26, 12), r("#e8b06a", 3), X(Ne.x, Ne.y - 60, 14, 6), r("#c98a4b", 2)));
          },
        }));
      for (let s of Q.rov) i.push({ y: s.y, d: () => h2(s, !de() && (s.look <= 0 || Q.phase === "p1") && Q.phase !== "p4b") });
      (y6(i),
        Q.rope === "held" &&
          n.sqPose !== "hidden" &&
          i.push({
            y: n.sq.y + 1,
            d: () => {
              (X(n.sq.x + n.sq.f * 36, n.sq.y - 70, 18, 9), r("#e8b06a", 3));
            },
          }),
        i.sort((s, q) => s.y - q.y).forEach((s) => s.d()));
    }
    function b6() {
      ((e.fillStyle = "#4a3d52"), e.fillRect(0, 0, c, 380));
      for (let s = 0; s < c; s += 60) for (let q = 0; q < 380; q += 40) (m(s + ((q / 40) % 2) * 30, q, 58, 38, 2), r(null, 1.5));
      ((e.fillStyle = "#6b5a62"), e.fillRect(0, 380, c, b - 380), C([0, 380, c, 380], y, 4), m(80, 30, 80, 60, 6), r("#ffe9a8", 4));
      let l = (s, q) => {
        (e.beginPath(),
          e.moveTo(s[0] - 10, s[1]),
          e.lineTo(s[0] + 10, s[1]),
          e.lineTo(q[0] + 10, q[1]),
          e.lineTo(q[0] - 10, q[1]),
          e.closePath(),
          (e.fillStyle = "rgba(255,233,140,.55)"),
          e.fill());
      };
      if (
        (l([120, 90], [Ht.x, Ht.y - 70]),
        Q.m1 ? l([Ht.x, Ht.y - 70], [Pa.x, Pa.y - 70]) : l([Ht.x, Ht.y - 70], [Ht.x - 80, 600]),
        Q.m2 && l([Pa.x, Pa.y - 70], [Lt.x, 260]),
        Q.open)
      ) {
        (m(Lt.x - 90, 160, 180, 220, 8), r("#2a2030", 4));
        for (let s = 0; s < 8; s++) F(Lt.x - 70 + s * 20, 180 + ((s * 37) % 60), 2, "#ffe9a8");
        (XV(Lt.x - 30, 330, 22, 30, 10, 3, 0), wV("#8b4a1c", 2), L(Lt.x + 30, 330, 16), r("#dfe4ea", 2), Pt(Lt.x, 240));
      } else
        (m(Lt.x - 90, 160, 180, 220, 8),
          r("#8a7a6a", 4),
          L(Lt.x, 260, 30),
          r(Q.m2 ? "#ffe9a8" : "#5e5248", 3),
          g("\u263C", Lt.x, 262, 30, y, "center", 900));
      if (
        (m(Gl.x - 60, 280, 120, 50, 4),
        r(Q.sign ? "#fff3d6" : "#9c8f80", 3),
        g(Q.sign ? "SINGING" : "NO SINGING", Gl.x, 298, 13, Q.sign ? "#2bc48a" : "#59657d", "center", 900),
        g(Q.sign ? "WELCOME" : "(dusty)", Gl.x, 316, 11, Q.sign ? "#2bc48a" : "#59657d", "center", 800),
        e.beginPath(),
        e.moveTo(Yn.x + 50, 320),
        e.lineTo(Yn.x - 20, 290),
        e.lineTo(Yn.x - 20, 360),
        e.closePath(),
        r("#c9a227", 3),
        x.sing && x.spot === 71)
      )
        for (let s = 0; s < 2; s++) Pt(Yn.x - 40 - ((n.T * 40 + s * 40) % 80), 320 - s * 20);
      let o = [],
        i = (s, q, d) => {
          (ringOf(d),
            C([s.x, s.y, s.x, s.y - 50], y, 4),
            e.save(),
            e.translate(s.x, s.y - 70),
            e.rotate(q ? 0.7 : -0.5),
            m(-26, -8, 52, 16, 4),
            r("#dff6ff", 3),
            e.restore());
        };
      (o.push({ y: Ht.y, d: () => i(Ht, Q.m1, "m1") }),
        o.push({ y: Pa.y, d: () => i(Pa, Q.m2, "m2") }),
        o.push({
          y: ae.y,
          d: () => {
            (ringOf("alcove"),
              m(ae.x - 50, ae.y - 130, 100, 130, 30),
              r("#3a2f40", 4),
              n.sqPose === "hidden" &&
                x.spot === 71 &&
                (ga(ae.x, ae.y - 70), Q.phase === "p3b" && (F(ae.x - 20, ae.y - 92, 3, "#ffcf33"), F(ae.x + 22, ae.y - 88, 3, "#ffcf33"))),
              x.sing && x.spot === 71 && Pt(ae.x + 40, ae.y - 140));
          },
        }),
        ringOf("texit"));
      for (let s of Q.rov) o.push({ y: s.y, d: () => h2(s, !de() && s.look <= 0) });
      (Q.zip && o.push({ y: 470, d: () => c2(Q.zipX, 470, 1) }), yn(o), o.sort((s, q) => s.y - q.y).forEach((s) => s.d()));
    }
    function p6(l) {
      if (l === "route")
        return (
          e.save(),
          e.translate(480, 320),
          m(-280, -170, 560, 340, 16),
          r("#1e2430", 5),
          g("ROUTE BOARD", 0, -120, 22, "#8fdcff", "center", 900),
          g("NEXT STOP:", 0, -50, 30, "#ffffff", "center", 900),
          g("PHOBOS", 0, 10, 56, "#ffcf33", "center", 900),
          g("(moon of Mars)", 0, 70, 24, "#8fdcff", "center", 700),
          e.restore(),
          !0
        );
      if (l === "dlog")
        return (
          e.save(),
          e.translate(480, 320),
          m(-230, -220, 460, 440, 10),
          r("#a8743a", 5),
          m(-200, -190, 400, 390, 4),
          r("#fffaf0", 3),
          g("ZIP'S DELIVERIES", 0, -150, 26, y, "center", 900),
          [
            ["PHOBOS \xB7 Rover garage", "2 dozen"],
            ["MARS \xB7 Crater Caf\xE9", "1 dozen"],
            ["MARS \xB7 Pancake stand", "3 dozen, every Tuesday"],
          ].forEach((o, i) => {
            (g(o[0], -170, -80 + i * 80, 20, i === 2 ? "#e5533d" : y, "left", 900),
              g(o[1], -170, -52 + i * 80, 16, "#59657d", "left", 700));
          }),
          e.restore(),
          !0
        );
      if (l === "starmap") {
        (e.save(), e.translate(480, 320), m(-300, -200, 600, 400, 16), r("#1b2140", 5));
        for (let o = 0; o < 30; o++) F(-280 + ((o * 97) % 560), -180 + ((o * 53) % 360), 1.6, "#ffffff");
        (L(-180, 40, 30),
          r("#9c8f80", 3),
          g("PHOBOS", -180, 96, 18, "#ffffff", "center", 900),
          e.setLineDash([10, 10]),
          C([-150, 30, 110, -10], "#ffcf33", 4),
          e.setLineDash([]),
          Ut("mars", 170, -20, 80),
          g("MARS", 170, 90, 22, "#ffffff", "center", 900),
          xo(-40, -10, 1));
        for (let o = 0; o < 3; o++) (X(170, 10 - o * 10, 26, 7), r("#e8a548", 2));
        return (XV(170, -14, 10, 5, 8, 3, 0), wV("#8b4a1c", 1.5), e.restore(), !0);
      }
      return l === "mural"
        ? (e.save(),
          e.translate(480, 320),
          m(-280, -190, 560, 380, 12),
          r("#c9a98a", 5),
          Re(-60, 120, 1.2, { f: 1, singing: !0 }),
          Fe(80, 120, 1.4, { f: -1, mouth: "o" }),
          Pt(-10, -120),
          Pt(40, -150),
          Pt(100, -110),
          e.restore(),
          !0)
        : l === "tally3"
          ? (e.save(),
            e.translate(480, 320),
            m(-260, -230, 520, 460, 16),
            r("#fff3d6", 5),
            g("CHAPTER 3 \xB7 PHOBOS", 0, -190, 28, y, "center", 900),
            r2().forEach((o, i) => tallyLine(o, 0, -130 + i * 50, 24, 460, o.startsWith("Never caught!") || o === NEVER_CAUGHT_WHY ? "#2bc48a" : y)),
            e.restore(),
            !0)
          : !1;
    }
