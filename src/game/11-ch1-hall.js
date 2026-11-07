// Chapter 1, part 2 (scenes S2 to S12): the hall, the window, the terminal, the torn slip, the duct, the hangar, and the Chapter 1 tally.
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
        cap: "photos",
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
          cap: "photo",
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
          cap: "badge",
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
        spot({ id: "mops", verb: "GIVE", cap: "lunch", who: "sq", x: n.mo.x, y: n.mo.y, r: 120, at: [n.mo.x, n.mo.y - 40], hot: !0, f: Wp }),
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
        spot({ id: "crate", verb: "LEAVE", cap: "crate", who: "sq", at: [Ct.x, Ct.y - 40], when: !!le.inCrate && n.found.has("pie500"), f: Qs }),
        spot({
          id: "crate",
          verb: "GRAB",
          cap: "Moon Pie",
          who: "sq",
          at: [Ct.x, Ct.y - 40],
          when: !!le.inCrate && !n.found.has("pie500"),
          f: () => {
            (ee("secret", "pie500", Ct.x - B.camX, 200), (Gn = Math.max(Gn, 1)), TV([v("sq", "Five hundred. They won't miss one.")]));
          },
        }),
        spot({ id: "crate", verb: "HIDE", cap: "crate", who: "sq", x: Ct.x, y: Ct.y + 60, r: 200, at: [Ct.x, Ct.y - 40], when: !le.inCrate && !le.botsOut, hot: !0, f: VA }),
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
        spot({ id: "bro", verb: "GRAB", cap: "brochure", who: "sq", at: [me.x, me.y - 50], when: l && o, hot: !0, f: nA }),
        spot({ id: "bro", verb: "GRAB", cap: "brochure", who: "sq", x: me.x, y: me.y, r: 120, at: [me.x, me.y - 50], when: l && !o, hot: !0, f: nA }),
        spot({ id: "plant5", verb: "HIDE", cap: "plant", who: "sq", x: rt.x, y: rt.y + 6, r: 110, at: [rt.x, rt.y - 60], when: !o && !qV.bro.inBin, hot: !0, f: aA }),
        spot({
          id: "brochure",
          verb: "LOOK",
          cap: "brochure",
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
        chipNow(),
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
        chipNow(),
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
                chipNow(),
                (n.scene = "S7"),
                (n.ctrl = !0),
                (n.seeGrace = n.T + 3));
            }),
          ]));
    }
    function s6Spots() {
      let l = n.sq;
      return [
        spot({ id: "leave", verb: "LEAVE", cap: "hiding spot", who: "sq", at: [l.x, l.y - 30], when: n.sqPose === "hidden", f: Xs }),
        spot({
          id: "plaque",
          verb: "PULL",
          cap: "plaque",
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
          cap: "poster",
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
          spot({ id: "va" + i, verb: "HIDE", cap: "plant", who: "sq", x: o.x, y: o.y + 6, r: 80, at: [o.x, o.y - 30], hot: x.alertBy >= 0, f: () => lA(i) }),
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
          cap: "plaque",
          who: "sq",
          box: wallBox(cn.x - 26, 50, 330),
          at: [cn.x - 26, 140],
          when: n.found.has("plaque"),
          f: () => TV([v("sq", "Still a framed hairball.")]),
        }),
        spot({
          id: "wanted",
          verb: "LOOK",
          cap: "poster",
          who: "sq",
          box: wallBox(cn.x + 30, 50, 330),
          at: [cn.x + 30, 140],
          when: n.found.has("wanted"),
          f: () => TV([v("sq", "REWARD: 1 free air filter. Rude.")]),
        }),
        spot({
          id: "trash",
          verb: "PEEK",
          cap: "trash can",
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
          cap: "vent",
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
        spot({ id: "leave", verb: "LEAVE", cap: "hiding spot", who: "sq", at: [n.sq.x, n.sq.y - 30], when: n.sqPose === "hidden", f: Xs }),
        spot({
          id: "term",
          verb: "USE",
          cap: "computer",
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
          cap: "order",
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
          cap: x.sing ? "singing" : "song",
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
          cap: o === "box9" ? "box" : "plant",
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
          cap: "slip",
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
          cap: "airlock",
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
          cap: "vent",
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
          cap: "vent",
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
          cap: "note",
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
          cap: "slip",
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
          verb: "EXIT",
          cap: "duct",
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
          cap: "goat costume",
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
          cap: "code",
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
            (chipNow(), (n.ctrl = !0));
          }),
        ]));
    }
    function Zs() {
      (Gn++, D.grab(), Gn >= 3 ? ((n.chip = ""), n.pulse.add("ship")) : chipNow());
    }
    function s12Spots() {
      return [
        ...D0.map((l, i) =>
          spot({
            id: "c" + i,
            verb: "GRAB",
            cap: l.name.toLowerCase(),
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
        spot({ id: "tarp", verb: "PULL", cap: "tarp", who: "sq", x: ue.x, y: ue.y, r: 90, at: [ue.x, ue.y - 70], when: !!x.tarp, f: () => {
            ((x.tarp = !1), D.grab());
          } }),
        spot({
          id: "nachos",
          verb: "GRAB",
          cap: "nachos",
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
        spot({ id: "crates", verb: "PUSH", cap: "crates", who: "sq", x: Gt.x, y: Gt.y, r: 100, at: [Gt.x, Gt.y - 90], when: !!x.crates, f: () => {
            ((x.crates = !1), D.bzzt());
          } }),
        spot({
          id: "icecream",
          verb: "GRAB",
          cap: "ice cream",
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
