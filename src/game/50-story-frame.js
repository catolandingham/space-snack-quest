// The story update every chapter shares (who moves, which scene runs), the picture button, and drawing for the hall, the closet and story panels.
    function j6(l) {
      if ((X6(l), K6(l), x.mops && n.ctrl)) {
        let o = oh(),
          i = sn();
        if (Math.hypot(o.x, o.y) > 0.1) {
          let s = n.mo;
          ((s.x = w(s.x + o.x * 170 * l, i.x0, i.x1)),
            (s.y = w(s.y + o.y * 170 * l * 0.8, n.room === "duct" ? 400 : i.y0, n.room === "duct" ? 470 : i.y1)),
            n.room !== "duct" && R0(s),
            (s.walk += l * 11),
            (s.moving = !0),
            Math.abs(o.x) > 0.1 && (s.f = o.x > 0 ? 1 : -1), window.SSQ && window.SSQ.afterMove && window.SSQ.afterMove("mops")); // (after his step and turn: room-model.js)
        } else n.mo.moving = !1;
      }
      if (
        (n.room === "hall" &&
          (["S9", "S10", "S11"].includes(n.scene) || (n.ctrl && ["S6", "S7", "S7b", "S8"].includes(n.scene))) &&
          (B.camX = w(Ks().x - 480, 0, xa - c)),
        n.scene === "S6" && qA(l),
        n.scene === "S9" && mA(l),
        n.scene === "S11" && gA(l),
        n.scene.startsWith("G"))
      ) {
        NA(l);
        return;
      }
      if (n.scene.startsWith("P")) {
        o6(l);
        return;
      }
      if (n.scene.startsWith("M")) {
        T6(l);
        return;
      }
      n.ctrl &&
        (n.scene === "S6" && (n.act = sA()),
        n.scene === "S7" && (n.act = rA()),
        n.scene === "S7b" && (n.act = cA()),
        n.scene === "S9" && (n.act = hA()),
        n.scene === "S10" && (n.act = bA()),
        n.scene === "S10d" && (n.act = pA()),
        n.scene === "S11" && (n.act = AA()),
        n.scene === "S12" && (n.act = xA()));
    }
    function O2() {
      return n.scene === "G6"
        ? !1
        : n.room === "kitchen" && n.ctrl && !ch2.sec && (ch2.cook === "down" || ch2.cook === "gone" || ch2.phase === "wash5")
          ? !0
          : n.scene === "P3"
            ? n.ctrl && Q.phase === "p3"
            : n.ctrl && ["S9", "S10", "S10d", "S11"].includes(n.scene) && !(n.scene === "S11" && x.doorOpen) && n.scene !== "S10d";
    }
    function picSwap() {
      if (n.scene.startsWith("G") && n.room === "kitchen" && ch2.phase === "g3hide" && !x.mops) {
        (dn(xe.x, xe.y, 63), n.pulse.delete("kcrate"), HA());
        return;
      }
      if (n.scene.startsWith("G") && n.room === "kitchen")
        if (!x.mops)
          ((ch2.sqStash = { x: n.sq.x, y: n.sq.y, f: n.sq.f, pose: n.sqPose, spot: x.spot }),
            (n.sqPose = "hidden"),
            (x.spot = 63),
            (n.sq.x = xe.x),
            (n.sq.y = xe.y));
        else if (ch2.sqStash) {
          let st = ch2.sqStash;
          ((n.sq.x = st.x), (n.sq.y = st.y), (n.sq.f = st.f), (n.sqPose = st.pose), (x.spot = st.spot), (ch2.sqStash = null));
        }
      yf(!x.mops, (n.scene || "")[0] === "S" ? ch1FaceWhy(!x.mops) : "");
    }
    function F6() {
      let l = cn;
      (e.save(),
        e.translate(0, -60),
        m(l.x - 66, l.y - 136, 132, 100, 6),
        r("#cdbb98", 4),
        F(l.x - 58, l.y - 128, 3, y),
        F(l.x + 58, l.y - 128, 3, y),
        g("NOTICES", l.x, l.y - 30, 8, "#8a93a3", "center", 900));
      let o = l.x - 26,
        i = l.y - 88;
      (m(o - 26, i - 30, 52, 60, 4),
        r("#c9a227", 3),
        n.found.has("plaque")
          ? (m(o - 20, i - 24, 40, 36, 2),
            r("#fffaf0", 2),
            XV(o, i - 6, 13, 11, 12, 3, 0),
            wV("#8b4a1c", 2),
            g("NEVER FORGET", o, i + 20, 6, y, "center", 900))
          : (e.beginPath(),
            e.moveTo(o - 30, i - 34),
            e.lineTo(o + 30, i - 34),
            e.lineTo(o + 26, i + 34),
            e.quadraticCurveTo(o, i + 26, o - 26, i + 34),
            e.closePath(),
            r("#a98bff", 3)));
      let s = l.x + 30,
        q = l.y - 86;
      (n.found.has("wanted")
        ? (m(s - 24, q - 34, 48, 66, 2),
          r("#fff3d6", 2.5),
          g("WANTED", s, q - 24, 10, "#b91c1c", "center", 900),
          XV(s, q, 11, 12, 9, 3, 1),
          wV("#8b4a1c", 2),
          g("?", s, q, 14, "#ffffff", "center", 900),
          g("REWARD: 1 FREE", s, q + 18, 5.5, y, "center", 900),
          g("AIR FILTER", s, q + 25, 5.5, y, "center", 900))
        : (m(s - 24, q - 34, 48, 22, 2),
          r("#fff3d6", 2.5),
          e.beginPath(),
          e.ellipse(s, q - 10, 24, 9, 0, 0, Math.PI * 2),
          r("#f0e2c0", 2.5)),
        e.restore(),
        n.scene === "S6" && n.ctrl && n.act && (n.act.verb === "PULL" || n.act.verb === "UNROLL") && ringZone(n.act.spot));
    }
    function J6() {
      let l = B.halves[0];
      !l ||
        !l.on ||
        Math.hypot(l.x - DV.x, l.y - (DV.y - 46)) >= 4 ||
        (e.save(), e.translate(l.x, l.y - 6), e.rotate(0.3), m(-8, -10, 16, 14, 1), r("#ffffff", 2), e.restore());
    }
    function Z6() {
      let l = lt.x,
        o = lt.y;
      (X(l, o + 4, 62, 10),
        (e.fillStyle = "rgba(30,36,48,.12)"),
        e.fill(),
        m(l - 58, o - 58, 116, 60, 6),
        r("#8a93a3", 4),
        m(l - 64, o - 66, 128, 14, 4),
        r("#b5bcc8", 3.5),
        m(l - 34, o - 40, 68, 22, 3),
        r("#2b3a67", 2.5),
        g("MANAGER", l, o - 29, 11, "#ffffff", "center", 900),
        e.beginPath(),
        e.moveTo(l - 34, o - 56),
        e.lineTo(l + 34, o - 56),
        e.lineTo(l + 28, o - 64),
        e.lineTo(l - 28, o - 64),
        e.closePath(),
        r("#59657d", 2),
        m(l - 8, o - 92, 16, 28, 2),
        r("#59657d", 3),
        m(l - 56, o - 178, 112, 88, 8),
        r("#59657d", 4),
        m(l - 48, o - 170, 96, 70, 4),
        r("#e8f4ff", 2.5),
        n.scene === "Q7"
          ? (g("Order new box", l, o - 152, 8, y, "center", 800), g("Return empty crate", l, o - 136, 7, "#7a2e1d", "center", 800))
          : (oq(l, o - 156, 0.42), m(l - 30, o - 132, 60, 20, 6), r("#2bc48a", 2.5), g("ORDER", l, o - 122, 11, "#ffffff", "center", 900)),
        Math.sin(n.T * 3) > 0 && F(l + 44, o - 98, 3, "#2bc48a"),
        pointer("term", l - 66, o - 186, 132, 196, 10));
    }
    function W6(l) {
      // The office picture already has the desk and the computer. Do not draw a second MANAGER terminal on top.
      n.room !== "office" && l.push({ y: lt.y, d: Z6 });
      if (["S6", "S7", "S7b", "S8", "S9", "S10", "S11"].includes(n.scene)) {
        if (
          (l.push({ y: 0, d: F6 }),
          l.push({
            y: va[1].y,
            d: () => {
              (uf(va[1].x, va[1].y), n.sqPose === "hidden" && x.spot === 1 && ga(va[1].x, va[1].y - 52));
            },
          }),
          n.scene === "S6")
        )
          for (let o of x.tour) l.push({ y: o.y, d: () => sf(o) });
        if (
          (n.scene === "S9" &&
            l.push({
              y: gt.y,
              d: () => {
                (pointer("box9", gt.x - 50, gt.y - 52, 100, 62, 8),
                  Ys(gt.x, gt.y),
                  n.sqPose === "hidden" && ga(gt.x, gt.y - 50),
                  Pt(gt.x + 52, gt.y - 70));
              },
            }),
          n.scene === "S11" &&
            (n.pulse.has("plant11") && l.push({ y: ne.y - 1, d: () => pointer("plant11", ne.x - 46, ne.y - 110, 92, 116, 12) }),
            l.push({ y: ne.y + 1, d: () => Pt(ne.x + 46, ne.y - 100) })),
          n.scene === "S9" || (n.scene === "S11" && !x.doorOpen))
        ) {
          let o = x.lureBot;
          l.push({
            y: o.y,
            d: () => {
              (e.beginPath(),
                e.moveTo(o.x, o.y - 60),
                e.lineTo(o.x - 60, o.y + 60),
                e.lineTo(o.x + 60, o.y + 60),
                e.closePath(),
                (e.fillStyle = x.sing ? "rgba(229,83,61,.3)" : "rgba(255,234,120,.4)"),
                e.fill());
              let i = E2(o.x, o.y);
              (dq(o.x + i.x, o.y + i.y, !1), k2(o.x, o.y), o.look > 0 && !x.sing && g("?", o.x, o.y - 100, 30, "#3478f6", "center", 900));
            },
          });
        }
        n.scene === "S11" &&
          l.push({
            y: Le.y,
            d: () => {
              (pointer("ward", Le.x - 40, Le.y - 150, 80, 154, 8),
                m(Le.x - 34, Le.y - 144, 68, 144, 4),
                r("#b07a4a", 4),
                C([Le.x, Le.y - 140, Le.x, Le.y - 4], y, 3),
                F(Le.x - 6, Le.y - 70, 3, "#ffcf33"),
                F(Le.x + 6, Le.y - 70, 3, "#ffcf33"));
            },
          });
      }
    }
    function Pt(l, o) {
      (L(l, o, 16), r("#ffe3f1", 2.5), g("\u266A", l, o + 1, 20, "#ff5fa8", "center", 900));
    }
    function $6() {
      if (["S6", "S7", "S7b", "S8", "S9", "S10", "S11"].includes(n.scene)) {
        if (
          (n.scene === "S11" &&
            x.doorOpen &&
            ((e.globalAlpha = 0.35 + 0.15 * Math.sin(n.T * 6)),
            (e.fillStyle = "#3fb8f0"),
            e.fillRect(Ha.x - 30, 160, 60, 200),
            (e.globalAlpha = 1),
            C([Ha.x - 30, 160, Ha.x - 30, 360], "#3478f6", 5),
            C([Ha.x + 30, 160, Ha.x + 30, 360], "#3478f6", 5),
            pointer("gate", Ha.x - 36, 156, 72, 210, 8)),
          (n.scene === "S6" || ["S4", "S7", "S7b", "S8", "S9", "S10", "S11"].includes(n.scene)) &&
            xh(yo.x, yo.y, (FV.on && FV.pulled >= 0) || (n.scene === "S6" && x.tour.some((l) => !!l.run && l.run.pulled >= 0))),
          n.scene === "S6" &&
            n.T - (n.sirenT ?? -9) < 2.5 &&
            Math.sin(n.T * 14) > 0 &&
            ((e.fillStyle = "rgba(229,83,61,.14)"), e.fillRect(0, 0, xa, b)),
          n.scene === "S6")
        ) {
          (e.save(), e.beginPath(), e.rect(0, 160, xa, b - 160), e.clip());
          for (let l of x.tour) {
            if (l.run) continue;
            let o = l.x,
              i = l.y - 30;
            (e.beginPath(),
              e.moveTo(o, i),
              e.arc(o, i, Ls, -Math.PI / 2 - z0, -Math.PI / 2 + z0),
          conesDrawn.push({ ox: o, oy: i, a: -Math.PI / 2, half: z0, len: Ls, feet: !0, room: n.room }),
              e.closePath(),
              (e.fillStyle = l.alert > 0 ? "rgba(229,83,61,.20)" : "rgba(130,160,255,.13)"),
              e.fill(),
              e.setLineDash([3, 6]),
              (e.strokeStyle = "rgba(70,90,160,.6)"),
              (e.lineWidth = 1.5),
              e.stroke(),
              e.setLineDash([]),
              l.alert > 0 && g("!", l.x, l.y - 110, 34, "#e5533d", "center", 900));
          }
          e.restore();
        }
        (pointer("trash", DV.x - 32, DV.y - 56, 64, 62, 8),
          pointer("vent", SV.x - 36, SV.y - 18, 72, 36, 8),
          B.bots[0] && pointer("mopbot", B.bots[0].x - 40, B.bots[0].y - 90, 80, 100, 10),
          n.sqPose !== "hidden" &&
            x.costume &&
            (XV(n.sq.x, n.sq.y - 50, 28, 30, 14, 4, 0),
            wV("#ffffff", 3),
            C([n.sq.x - 14, n.sq.y - 100, n.sq.x - 24, n.sq.y - 118], y, 4),
            C([n.sq.x + 14, n.sq.y - 100, n.sq.x + 24, n.sq.y - 118], y, 4)),
          x.mops &&
            (e.beginPath(),
            e.moveTo(n.mo.x - 10, n.mo.y - 150),
            e.lineTo(n.mo.x + 10, n.mo.y - 150),
            e.lineTo(n.mo.x, n.mo.y - 136),
            e.closePath(),
            r("#2bc48a", 2)));
      }
    }
    function V5() {
      ((e.fillStyle = "#2a2f3a"), e.fillRect(0, 0, c, b), m(40, 330, 880, 160, 20), r("#8a93a3", 6));
      for (let l = 80; l < 900; l += 90) C([l, 334, l, 486], "#6b7487", 3);
      if (((e.fillStyle = "rgba(255,255,255,.6)"), e.fillRect(60, 340, 60, 30), g("CLOSET", 90, 316, 12, "#cdd3dc"), x.notesBall)) {
        for (let [l, o] of [
          [-18, 4],
          [0, -4],
          [20, 6],
        ])
          (L(zl.x + l, zl.y + o, 11), r("#fffaf0", 2.5));
        ringNear("notes");
      }
      (x.got2 ||
        (e.save(),
        e.translate(Rl.x, Rl.y),
        e.rotate(0.3),
        m(-14, -10, 28, 20, 1),
        r("#ffffff", 2),
        e.restore(),
        spotsCalled("half2").forEach(ringZone)),
        Fe(n.mo.x, n.mo.y + 30, he * 0.9, { f: n.mo.f, walk: n.mo.moving ? n.mo.walk : 0 }));
    }
    function e5() {
      ((e.fillStyle = "#1e2430"), e.fillRect(0, 0, c, b));
      for (let i = 0; i < 30; i++) F((i * 97) % c, (i * 41) % 200, 1.6, "#ffffff");
      ((e.fillStyle = "#59657d"), e.fillRect(0, 360, c, b - 360), C([0, 360, c, 360], y, 4));
      let l = hn;
      (m(l.x - 200, l.y - 110, 400, 150, 60), r("#dfe4ea", 5));
      for (let i of [-110, -50, 10, 70]) (L(l.x + i, l.y - 50, 16), r("#8fdcff", 3));
      (m(l.x - 110, l.y + 2, 220, 30, 6),
        r("#e5533d", 3),
        g("NEXT STOP: MARS", l.x, l.y + 17, 18, "#ffffff", "center", 900),
        e.beginPath(),
        e.moveTo(l.x - 40, l.y + 40),
        e.lineTo(l.x + 40, l.y + 40),
        e.lineTo(l.x + 60, l.y + 150),
        e.lineTo(l.x - 60, l.y + 150),
        e.closePath(),
        r("#b5bcc8", 3),
        ringOf("ship"));
      let o = [];
      (D0.forEach((i, s) =>
        o.push({
          y: i.y + 40,
          d: () => {
            (ringOf("c" + s),
              m(i.x - 40, i.y - 64, 80, 104, 8),
              r("#ffffff", 4),
              m(i.x - 32, i.y - 56, 64, 60, 4),
              r(x.coolers[s] ? "#cfd8e3" : "#8fdcff", 2.5),
              x.coolers[s] || (m(i.x - 12, i.y - 44, 24, 34, 4), r(i.col, 2.5)),
              g(i.name, i.x, i.y + 20, 10, y, "center", 900));
          },
        }),
      ),
        o.push({
          y: ue.y,
          d: () => {
            x.tarp
              ? (e.beginPath(),
                e.moveTo(ue.x - 56, ue.y),
                e.quadraticCurveTo(ue.x - 50, ue.y - 90, ue.x, ue.y - 92),
                e.quadraticCurveTo(ue.x + 50, ue.y - 90, ue.x + 56, ue.y),
                e.closePath(),
                r("#6b8e4e", 4))
              : (m(ue.x - 70, ue.y - 14, 60, 14, 5), r("#6b8e4e", 3), x.nachos || p5(ue.x, ue.y - 44, 0.95));
          },
        }),
        o.push({
          y: Gt.y,
          d: () => {
            !x.crates && !x.icecream && A5(Gt.x + 70, Gt.y - 46, 1.1);
            let i = x.crates ? 0 : -110;
            for (let [s, q] of [
              [0, 0],
              [60, 0],
              [30, -50],
            ])
              Xn(Gt.x + i + s - 30, Gt.y + q - 50, 60, 50, "");
          },
        }),
        n.moPose !== "hidden" &&
          o.push({ y: n.mo.y, d: () => Fe(n.mo.x, n.mo.y, he * 1.15, { f: n.mo.f, walk: n.mo.moving ? n.mo.walk : 0, mop: !0 }) }),
        n.sqPose === "ball" &&
          o.push({
            y: n.sq.y,
            d: () => {
              drawL2Ball(n.sq.x, n.sq.y - 16);
            },
          }),
        n.sqPose !== "hidden" &&
          n.sqPose !== "ball" &&
          o.push({
            y: n.sq.y,
            d: () => {
              (Re(n.sq.x, n.sq.y, he, { walk: n.sq.moving ? n.sq.walk : 0, f: n.sq.f }),
                x.costume &&
                  (XV(n.sq.x, n.sq.y - 26, 26, 18, 14, 4, 0),
                  wV("#ffffff", 3),
                  C([n.sq.x - 14, n.sq.y - 100, n.sq.x - 24, n.sq.y - 118], y, 4),
                  C([n.sq.x + 14, n.sq.y - 100, n.sq.x + 24, n.sq.y - 118], y, 4)));
            },
          }),
        o.sort((i, s) => i.y - s.y).forEach((i) => i.d()));
    }
    function t5() {
      if (n.room !== "hall" || !n.ctrl || de()) return;
      let l = { term: lt, box9: gt, plant11: ne, vent: SV, trash: DV, ward: Le, gate: Ha };
      for (let o of Object.keys(l)) {
        if (!n.pulse.has(o)) continue;
        let i = l[o].x - B.camX;
        if (i > 30 && i < c - 30) continue;
        let s = i <= 30,
          q = Math.sin(n.T * 7) * 8,
          d = s ? 34 + q : c - 34 - q,
          A = 330;
        (e.beginPath(),
          s
            ? (e.moveTo(d - 20, A), e.lineTo(d + 8, A - 22), e.lineTo(d + 8, A + 22))
            : (e.moveTo(d + 20, A), e.lineTo(d - 8, A - 22), e.lineTo(d - 8, A + 22)),
          e.closePath(),
          r("#ffcf33", 4));
        return;
      }
    }
    function n5(l) {
      if (l === "terminal") {
        if (
          (e.save(),
          e.translate(480, 320),
          m(-260, -250, 520, 500, 16),
          r("#59657d", 5),
          m(-236, -226, 472, 452, 8),
          r("#e8f4ff", 3),
          oq(0, -190, 1.3),
          g("Floors that mop THEMSELVES!", 0, -138, 22, "#3478f6", "center", 900),
          g("Replace remaining janitors:", 0, -92, 20, y, "center", 800),
          m(-150, -66, 300, 40, 6),
          r("#ffffff", 2.5),
          g("[X] GANITOR: MOPS", 0, -46, 22, "#b91c1c", "center", 900),
          m(-110, -8, 220, 56, 14),
          r("#2bc48a", 4),
          g("ORDER", 0, 20, 30, "#ffffff", "center", 900),
          g("Sign here:", -80, 96, 20, y, "center", 800),
          m(10, 70, 160, 90, 6),
          r("#ffffff", 3),
          !x.typed)
        ) {
          (e.save(),
            e.translate(90, 118),
            (e.globalAlpha = 0.35 + 0.3 * Math.sin(p.t * 5)),
            e.setLineDash([5, 4]),
            X(0, 10, 26, 20),
            r(null, 2.5));
          for (let [o, i] of [
            [-22, -18],
            [-8, -28],
            [8, -28],
            [22, -18],
          ])
            (X(o, i, 8, 9), r(null, 2));
          (e.setLineDash([]), e.restore(), (e.globalAlpha = 1), g("paw print", 90, 176, 14, "#8a93a3", "center", 800));
        }
        if (x.typed) {
          (e.save(), e.translate(90, 118), X(0, 10, 26, 20), r("#8b4a1c", 0));
          for (let [o, i] of [
            [-22, -18],
            [-8, -28],
            [8, -28],
            [22, -18],
          ])
            (X(o, i, 8, 9), r("#8b4a1c", 0));
          (e.restore(),
            Math.sin(n.T * 8) > -0.3 &&
              (m(-170, 176, 340, 40, 8), r("#e5533d", 3), g("EXPRESS DELIVERY", 0, 196, 24, "#ffffff", "center", 900)));
        }
        return (e.restore(), !0);
      }
      if (l === "half1" || l === "half2") {
        let o = l === "half1";
        (e.save(), e.translate(480, 320), e.rotate(o ? -0.04 : 0.04), e.beginPath());
        let i = o ? -220 : -40,
          s = o ? 40 : 220;
        if (o) {
          (e.moveTo(i, -150), e.lineTo(s, -150));
          for (let d = 0; d <= 10; d++) e.lineTo(s + (d % 2 ? 14 : -6), -150 + d * 30);
          e.lineTo(i, 150);
        } else {
          (e.moveTo(s, -150), e.lineTo(s, 150));
          for (let d = 10; d >= 0; d--) e.lineTo(i + (d % 2 ? 14 : -6), -150 + d * 30);
        }
        (e.closePath(), r("#ffffff", 4));
        let q = o ? -90 : 90;
        return (
          o
            ? (g("DELIVERY SLIP", q, -112, 22, y, "center", 900),
              g("3 Bleep-Bloop Bots.", q, -64, 17, y, "center", 800),
              g("DELIVERED.", q, -38, 17, y, "center", 900),
              g("Signed: Mops", q, -6, 17, "#3478f6", "center", 800),
              g("Hangar code:", q, 40, 18, y, "center", 800),
              g("4 7", q, 94, 52, "#b91c1c", "center", 900))
            : (g("...", q, -64, 22, y, "center", 900),
              g("2 3", q, 94, 52, "#b91c1c", "center", 900),
              g("(the rest of the code)", q, 140, 13, "#8a93a3", "center", 700)),
          e.restore(),
          !0
        );
      }
      if (l === "notes") {
        (e.save(), e.translate(480, 320), e.rotate(-0.03), m(-220, -170, 440, 340, 6), r("#fffaf0", 5));
        for (let o = 0; o < 6; o++) C([-180, -110 + o * 44, 180, -110 + o * 44], "#cfd8e3", 2);
        (g("Brave Sasquatches", 0, -70, 34, "#2b3a67", "center", 700),
          g("stay hid\u2014", 0, -20, 34, "#2b3a67", "center", 700),
          C([-170, -46, 160, -40], "#e5533d", 5),
          C([-90, -18, 90, -24], "#e5533d", 5));
        for (let [o, i] of [
          [-150, 110],
          [0, 120],
          [150, 106],
        ])
          (L(o, i, 26), r("#f0e8d8", 3));
        return (e.restore(), !0);
      }
      if (l === "keypad") {
        (e.save(),
          e.translate(480, 320),
          m(-150, -220, 300, 440, 20),
          r("#59657d", 5),
          m(-120, -190, 240, 70, 8),
          r("#1e2430", 3),
          g("1 6 9 5 5 6", 0, -155, 40, "#2bc48a", "center", 900));
        for (let o = 0; o < 9; o++) {
          let i = -80 + (o % 3) * 80,
            s = -70 + Math.floor(o / 3) * 70;
          (L(i, s, 28), r("#dfe4ea", 3), g(String(o + 1), i, s, 24, y, "center", 900));
        }
        return (g("OPEN", 0, 170, 30, "#2bc48a", "center", 900), e.restore(), !0);
      }
      if (l === "dash") {
        (e.save(),
          e.translate(480, 340),
          m(-300, -200, 600, 360, 30),
          r("#2a2f3a", 5),
          e.beginPath(),
          e.arc(0, 60, 180, Math.PI, 0),
          e.closePath(),
          r("#fff3d6", 4),
          g("E", -150, 40, 30, "#b91c1c", "center", 900),
          g("F", 150, 40, 30, "#2bc48a", "center", 900),
          g("FUEL", 0, 0, 22, y, "center", 900));
        let o = Math.PI + 0.32;
        return (C([0, 60, Math.cos(o) * 160, 60 + Math.sin(o) * 160], "#e5533d", 7), L(0, 60, 14), r(y, 0), e.restore(), !0);
      }
      return l === "tally"
        ? ((e.fillStyle = "#1e2430"),
          e.fillRect(0, 0, c, b),
          g("Chapter 1 \xB7 Stormtop", c / 2, 90, 40, "#ffffff", "center", 900),
          // (An eighth line, the party's Snack Bandit honor, closes the rows up so the last one stays on the card.)
          jh().forEach((o, i, all) =>
            i === all.length - 1
              ? g(o, c / 2, 180 + i * Math.min(64, 420 / (all.length - 1)), 40, "#ffcf33", "center", 900)
              : tallyLine(o, c / 2, 180 + i * Math.min(64, 420 / (all.length - 1)), 30, 820, i >= 4 ? "#8fdcff" : "#ffffff"),
          ),
          !0)
        : !1;
    }
    function Mo(l, o, i) {
      (e.save(), e.translate(l, o), e.scale(i, i));
      for (let s = 0; s < 4; s++) (X(0, -s * 7, 22, 6), r("#e8a548", 2));
      (m(-6, -32, 12, 6, 2),
        r("#fff3a0", 1.5),
        e.beginPath(),
        e.moveTo(-2, -26),
        e.quadraticCurveTo(10, -18, 14, -6),
        (e.strokeStyle = "#8b4a1c"),
        (e.lineWidth = 3),
        e.stroke(),
        e.restore());
    }
    function l5(l, o, i) {
      (e.save(),
        e.translate(l, o),
        e.scale(i, i),
        m(-170, -32, 340, 64, 32),
        r("#e5533d", 4),
        L(-136, 0, 22),
        r("#c1440e", 3),
        X(-143, -6, 6, 3),
        r("#a8380b", 0),
        X(-128, 8, 4, 2),
        r("#a8380b", 0),
        g((window.SSQ && window.SSQ.snack ? window.SSQ.snack("FAMILY") : "CAKES") + "!", 22, 2, 27, "#fff3d6", "center", 900),
        e.restore());
    }
    function w2(l, o, i, s) {
      (e.save(),
        e.translate(l, o),
        e.scale(i, i),
        e.rotate(-0.08),
        m(-14, -18, 28, 36, 2),
        r("#fff3d6", 2),
        m(-12, -16, 24, 7, 1),
        r("#e5533d", 0),
        Mo(0, 10, 0.32),
        s && (X(5, 8, 10, 8), (e.fillStyle = "rgba(122,74,34,.75)"), e.fill()),
        e.restore());
    }
    function oq(l, o, i) {
      (e.save(),
        e.translate(l, o),
        e.scale(i, i),
        m(-78, -16, 156, 32, 16),
        r("#ffffff", 2.5),
        m(-70, -10, 22, 18, 5),
        r("#3478f6", 2),
        F(-64, -1, 2.4, "#ffffff"),
        F(-54, -1, 2.4, "#ffffff"),
        C([-59, -10, -59, -16], y, 2),
        F(-59, -17, 2.4, "#e5533d"),
        g("BLEEP\xB7BLOOP", 14, 1, 16, "#3478f6", "center", 900),
        e.restore());
    }
    function o5() {
      ((e.fillStyle = "#f1f3f6"), e.fillRect(0, 0, c, b), (e.strokeStyle = "#e2e6ec"), (e.lineWidth = 1));
      for (let o = 0; o <= c; o += 60) (e.beginPath(), e.moveTo(o, 200), e.lineTo(o, b), e.stroke());
      for (let o = 200; o <= b; o += 60) (e.beginPath(), e.moveTo(0, o), e.lineTo(c, o), e.stroke());
      ((e.fillStyle = "#ffffff"),
        e.fillRect(0, 0, c, 200),
        C([0, 200, c, 200], y, 4),
        e.save(),
        m(60, 14, 840, 172, 14),
        e.clip(),
        (e.fillStyle = "#2b3a67"),
        e.fillRect(60, 14, 840, 172));
      for (let o = 0; o < 30; o++) F(70 + ((o * 97) % 820), 22 + ((o * 41) % 150), 1.6, "#fff");
      (Ut("jupiter", 480, 360, 300), e.restore(), m(60, 14, 840, 172, 14), r(null, 5));
      for (let o of [qV.gary, qV.linda])
        (e.beginPath(),
          e.moveTo(o.x, o.y - 60),
          e.lineTo(o.x - 90, 205),
          e.lineTo(o.x + 90, 205),
          e.closePath(),
          (e.fillStyle = "rgba(255,226,120,.3)"),
          e.fill());
      let l = [];
      (l.push({
        y: qV.gary.y,
        d: () => {
          let o = qV.gary;
          (Qt(o.x, o.y, "#ffb547", 1.6, 0), L(o.x, o.y - 64, 16.5), r("#8b5a3c", 2.5));
          let i = o.x + 22 + qV.wave * 10,
            s = o.y - 52 - Math.abs(qV.wave) * 26;
          if ((m(i - 7, s - 9, 14, 16, 3), r("#ffffff", 2), C([i + 7, s - 4, i + 11, s + 2], y, 2), Math.abs(qV.wave) > 0.6))
            for (let q = 0; q < 3; q++) F(i + 14 + q * 10, s - 10 + q * 4, 3, "#8b5a3c");
        },
      }),
        l.push({
          y: qV.linda.y,
          d: () => {
            let o = qV.linda;
            (Qt(o.x, o.y, "#a98bff", 1.6, 0), L(o.x, o.y - 64, 16.5), r("#e5b84a", 2.5));
          },
        }),
        l.push({
          y: me.y,
          d: () => {
            (e.beginPath(),
              e.moveTo(me.x - 18, me.y - 36),
              e.lineTo(me.x + 18, me.y - 36),
              e.lineTo(me.x + 14, me.y),
              e.lineTo(me.x - 14, me.y),
              e.closePath(),
              r("#8a93a3", 3),
              X(me.x, me.y - 36, 20, 5),
              r("#59657d", 2.5),
              qV.bro.on && qV.bro.inBin && (pointer("bro", me.x - 16, me.y - 70, 32, 40, 8), w2(me.x, me.y - 50, 1.1, !0)));
          },
        }),
        l.push({
          y: rt.y,
          d: () => {
            (pointer("plant5", rt.x - 46, rt.y - 110, 92, 116, 12), uf(rt.x, rt.y), n.sqPose === "hidden" && ga(rt.x, rt.y - 52));
          },
        }),
        n.sqPose !== "hidden" && l.push({ y: n.sq.y, d: () => Re(n.sq.x, n.sq.y, he, { walk: n.sq.moving ? n.sq.walk : 0, f: n.sq.f }) }),
        l.sort((o, i) => o.y - i.y).forEach((o) => o.d()),
        qV.bro.on && !qV.bro.inBin && w2(qV.bro.x + (qV.bro.y === 290, 0), qV.bro.y, 1.1, qV.soaked));
    }
    function i5(l) {
      (e.save(),
        e.translate(480, 320),
        e.rotate(-0.02),
        m(-250, -290, 500, 580, 10),
        r("#fff3d6", 5),
        l5(0, -238, 1.25),
        m(-220, -190, 440, 250, 12),
        r("#ffe6c2", 3));
      for (let [o, i] of [
        [-110, 1],
        [110, -1],
      ]) {
        (Re(o, 40, 2.1, { f: i }), C([o + 40 * i, -50, o + 90 * i, -70], y, 5), X(o + 98 * i, -72, 26, 7), r("#3d4454", 3));
        let s = -110 - 20 * Math.abs(Math.sin(n.T * 3 + o));
        (X(o + 98 * i, s, 20, 6), r("#e8a548", 2.5));
      }
      (Mo(0, 40, 1.5),
        g("Big. Furry. Friendly.", 0, 104, 34, "#b45309", "center", 900),
        L(-120, 218, 48),
        r("#c1440e", 4),
        X(-138, 206, 11, 5),
        r("#a8380b", 0),
        X(-102, 238, 8, 4),
        r("#a8380b", 0),
        C([-110, 172, -110, 148], y, 3),
        X(-96, 152, 16, 5),
        r("#e8a548", 2),
        X(-96, 144, 16, 5),
        r("#e8a548", 2));
      for (let o = 0; o < 3; o++) C([40, 170 + o * 18, 220, 170 + o * 18], "#cdbb98", 3);
      e.beginPath();
      for (let o = 0; o <= 16; o++) {
        let i = (o / 16) * Math.PI * 2,
          s = 70 + 14 * Math.sin(o * 2.7),
          q = 140 + Math.cos(i) * s,
          d = 200 + Math.sin(i) * s * 0.75;
        o ? e.lineTo(q, d) : e.moveTo(q, d);
      }
      (e.closePath(),
        (e.fillStyle = "rgba(122,74,34,.88)"),
        e.fill(),
        L(212, 130, 8),
        (e.fillStyle = "rgba(122,74,34,.88)"),
        e.fill(),
        L(70, 262, 6),
        e.fill(),
        e.restore(),
        l && void 0);
    }
    function f5(l) {
      (C([60, 440, 900, 440], y, 4), g("DOCK", 120, 460, 16, "#59657d", "left", 800));
      let o = (i, s, q) => {
        Re(i, s, 0.9, { f: 1, eyes: q });
      };
      if (l === "fb1crate") {
        Xn(360, 290, 240, 150, "");
        for (let i = 0; i < 3; i++) {
          let s = (n.T * 0.6 + i / 3) % 1;
          ((e.globalAlpha = Math.sin(s * Math.PI)), g("z", 600 + s * 40 + i * 6, 290 - s * 70, 16 + s * 14, "#59657d", "center", 900));
        }
        e.globalAlpha = 1;
      }
      if (l === "fb1lid") {
        (Xn(360, 330, 240, 110, ""),
          e.save(),
          e.translate(300, 300),
          e.rotate(-0.6),
          m(0, -14, 240, 20, 4),
          r("#d9a35b", 3),
          e.restore(),
          o(470, 360, "closed"));
        for (let i = 0; i < 9; i++) F(440 + ((i * 17) % 70), 316 + ((i * 11) % 40), 2.6, "#8b5a3c");
        (g("z", 520, 290, 26, "#59657d"), Fe(700, 440, 1.5, { f: -1, mouth: "o" }));
      }
      (l === "fb1beard" &&
        (Fe(560, 440, he * 1.15, { f: -1, mouth: "o" }),
        o(470, 400, ""),
        C([486, 340, 520, 330], y, 4),
        g("hee hee!", 400, 270, 26, "#b5562a")),
        l === "fb1bucket" &&
          (Fe(520, 440, he * 1.15, { f: 1 }),
          e.beginPath(),
          e.moveTo(380, 360),
          e.lineTo(460, 360),
          e.lineTo(450, 436),
          e.lineTo(390, 436),
          e.closePath(),
          r("#ffcf33", 4),
          X(420, 360, 40, 9),
          r("#8fdcff", 3),
          L(420, 346, 16),
          r("#8b5a3c", 3),
          F(414, 344, 2.5, y),
          F(426, 344, 2.5, y),
          sf({ x: 760, y: 430, x0: 760, x1: 760, sp: 0, dir: -1, pause: 0, alert: 0, col: "#7fd1ff", hair: "#8b5a3c", home: 760 }),
          sf({ x: 830, y: 436, x0: 830, x1: 830, sp: 0, dir: -1, pause: 0, alert: 0, col: "#ff8fc0", hair: "#ffcf33", home: 830 }),
          g("!", 640, 300, 40, "#e5533d", "center", 900)));
    }
    function N2(l, o, i) {
      let s = 0,
        q = { v: 0 },
        d = { v: 0 },
        A = !1;
      return cV((T) => {
        let R = B.halves[l];
        return (
          A || ((A = !0), (q.v = R.x), (d.v = R.y)),
          (s = Math.min(1, s + T / 1.8)),
          (R.x = q.v + (o - q.v) * s + Math.sin(s * 9) * 26 * (1 - s)),
          (R.y = d.v + (i - d.v) * s - Math.sin(s * Math.PI) * 60),
          (R.r = s * 9),
          (B.camX = w(R.x - 480, 0, xa - c)),
          s >= 1
        );
      });
    }
    function Tf(l, o, i) {
      (m(l - 18, o - 13, 36, 28, 2),
        r("#ffffff", 2),
        m(l - 15, o - 10, 30, 22, 1),
        r("#e8f4ff", 0),
        L(l, o, 6),
        r("#ffffff", 1.2),
        C([l - 4, o - 5, l - 8, o - 9], y, 1.6),
        C([l + 4, o - 5, l + 8, o - 9], y, 1.6),
        C([l + 10, o - 6, l + 12, o + 10], "#b8a07e", 1.4),
        F(l - 2, o - 1, 0.9, y),
        F(l + 2, o - 1, 0.9, y),
        i
          ? (e.beginPath(),
            e.arc(l, o + 1, 4.5, 0.2, Math.PI - 0.2),
            (e.strokeStyle = "#e5533d"),
            (e.lineWidth = 2.2),
            e.stroke(),
            L(l - 8, o - 6, 3),
            (e.strokeStyle = "#ffb000"),
            (e.lineWidth = 1.5),
            e.stroke())
          : C([l - 2.5, o + 3, l + 2.5, o + 3], y, 1));
    }
    function u5(l) {
      (Qt(l.x, l.y, "#8a93a3", qtScale(n.room), -0.5),
        X(l.x, l.y - 72, 6, 2),
        r("#59657d", 0),
        e.beginPath(),
        e.moveTo(l.x + 14, l.y - 26),
        e.lineTo(l.x + 30, l.y - 26),
        e.lineTo(l.x + 27, l.y - 6),
        e.lineTo(l.x + 17, l.y - 6),
        e.closePath(),
        r("#ffcf33", 2),
        m(l.x - 14, l.y - 36, 28, 12, 3),
        r("#ffffff", 1.5),
        g(l.name.toUpperCase(), l.x, l.y - 30, 9, y));
    }
    function iq(l, o, i, s) {
      if ((e.save(), e.translate(l, o), e.rotate(i), e.scale(1.8, 1.8), m(s ? -9 : -18, -12, s ? 18 : 36, 24, 1), r("#ffffff", 2), s))
        (C([-6, -4, 6, -4], "#9aa3b2", 1), C([-6, 3, 6, 3], "#9aa3b2", 1));
      else {
        (g("DELIVERY SLIP", 0, -6, 4.6, y, "center", 900), C([-13, 6, 13, 6], "#9aa3b2", 0.8), g("x", -15, 4, 4, y));
        let q = B.signed ? 6 : Math.floor((B.sign || 0) * 6);
        if (q > 0) {
          (e.beginPath(), e.moveTo(-11, 5));
          for (let d = 0; d < q; d++) e.lineTo(-9 + d * 3.4, 5 + (d % 2 ? -3 : 2));
          ((e.strokeStyle = "#3478f6"), (e.lineWidth = 1.2), e.stroke());
        }
      }
      e.restore();
    }
    function s5() {
      ((e.fillStyle = "#dfe4ea"),
        e.fillRect(0, 0, c, b),
        e.save(),
        e.translate(-B.camX, 0),
        (e.fillStyle = "#f1f3f6"),
        e.fillRect(0, 160, xa, b - 160),
        (e.strokeStyle = "#e2e6ec"),
        (e.lineWidth = 1));
      for (let o = 0; o <= xa; o += 60) (e.beginPath(), e.moveTo(o, 160), e.lineTo(o, b), e.stroke());
      for (let o = 160; o <= b; o += 60) (e.beginPath(), e.moveTo(0, o), e.lineTo(xa, o), e.stroke());
      ((e.fillStyle = "#ffffff"), e.fillRect(0, 0, xa, 160), C([0, 160, xa, 160], y, 4));
      for (let o = 0; o < 47; o++) {
        let i = rf(o);
        o !== qf && Tf(i.x, i.y, !1);
      }
      {
        let o = rf(qf);
        if (!n.found.has("photo23")) (e.save(), e.translate(o.x, o.y - 13), e.rotate(0.22), Tf(0, 13, !0), e.restore());
        else {
          let i = Math.min(1, (n.T - (B.p23T || 0)) / 0.5);
          (m(o.x - 16, o.y - 12, 32, 26, 1),
            r("#fffdf3", 1.5),
            C([o.x - 10, o.y + 8, o.x - 10, o.y - 4], "#8b5a3c", 3),
            L(o.x - 10, o.y - 6, 4),
            r("#8b5a3c", 1),
            C([o.x + 7, o.y + 8, o.x + 7, o.y - 2], "#ffffff", 3),
            L(o.x + 7, o.y - 5, 3.5),
            r("#ffffff", 1),
            C([o.x - 6, o.y + 2, o.x + 3, o.y + 2], "#e5533d", 1.5),
            e.save(),
            e.translate(o.x - 18, o.y),
            e.scale(1 - 0.8 * i, 1),
            Tf(18, 0, !0),
            e.restore());
        }
      }
      {
        if ((e.save(), e.translate(HV.x, HV.y), e.scale(0.55, 0.55), e.translate(-HV.x, -HV.y), !n.found.has("badge")))
          (m(HV.x - 40, HV.y - 48, 80, 96, 4),
            r("#a89c86", 4),
            C([HV.x - 28, HV.y - 30, HV.x, HV.y - 44, HV.x + 28, HV.y - 30], y, 1.5),
            g("?", HV.x, HV.y + 4, 22, "#ffffff", "center", 900));
        else {
          (m(HV.x - 40, HV.y - 48, 80, 96, 4), r("#c9a227", 4), m(HV.x - 32, HV.y - 40, 64, 80, 2), r("#fffaf0", 2));
          for (let o = 0; o < 3; o++) C([HV.x - 20, HV.y - 22 + o * 10, HV.x + 20, HV.y - 22 + o * 10], "#b8b0a0", 2);
          (e.save(), e.translate(HV.x, HV.y + 20), e.beginPath());
          for (let o = 0; o < 16; o++) {
            let i = (o / 16) * Math.PI * 2,
              s = o % 2 ? 11 : 14;
            e.lineTo(Math.cos(i) * s, Math.sin(i) * s);
          }
          (e.closePath(), r("#ffcf33", 2), e.restore());
        }
        e.restore();
      }
      n.scene === "S2" && (ringNear("badge"), ringNear("photo23"));
      (e.save(), m(760, 14, 640, 132, 12), e.clip(), (e.fillStyle = "#2b3a67"), e.fillRect(760, 14, 640, 132));
      for (let o = 0; o < 22; o++) F(770 + ((o * 89) % 620), 22 + ((o * 37) % 110), 1.6, "#fff");
      if (B.ship > 0) {
        let o = 1500 - B.ship * 430;
        (m(o - 160, 34, 320, 96, 40), r("#dfe4ea", 4));
        for (let i of [-90, -40, 10, 60]) (L(o + i, 70, 11), r("#8fdcff", 2.5));
        (m(o - 40, 104, 80, 26, 4),
          r("#59657d", 3),
          oq(o, 46, 0.7),
          B.mars &&
            (m(o - 70, 82, 140, 20, 4),
            r("#e5533d", 2),
            g("NEXT STOP: MARS", o, 92, 11, "#ffffff", "center", 900),
            pointer("hull", o - 76, 76, 152, 32, 6)),
          e.save(),
          e.translate(o + 120, 84),
          dq(0, 0, !1),
          e.restore());
      }
      if (
        (e.restore(),
        m(760, 14, 640, 132, 12),
        r(null, 5),
        g("HANGAR", 1080, 154, 11, "#8a93a3"),
        B.mars &&
          !n.found.has("goatspace") &&
          (m(ct.x - 30, ct.y + 10, 60, 64, 6),
          r("#ffffff", 3),
          g("AIRLOCK", ct.x, ct.y + 22, 9, y, "center", 900),
          m(ct.x - 4, ct.y + 32, 8, 26, 3),
          r("#59657d", 2),
          L(ct.x, ct.y + 32, 8),
          r("#e5533d", 2.5),
          g("DO NOT PULL", ct.x, ct.y + 66, 8, "#e5533d", "center", 900)),
        B.ramp > 0)
      ) {
        let o = te.top + (te.bot - te.top) * B.ramp;
        (e.beginPath(),
          e.moveTo(te.x - 40, te.top),
          e.lineTo(te.x + 40, te.top),
          e.lineTo(te.x + 60, o),
          e.lineTo(te.x - 60, o),
          e.closePath(),
          r("#b5bcc8", 3));
        for (let i = te.top + 14; i < o; i += 16) C([te.x - 46, i, te.x + 46, i], "#8a93a3", 1.5);
      }
      (Fp(), m(SV.x - 30, SV.y - 12, 60, 24, 3), r("#b5bcc8", 3));
      for (let o = 0; o < 5; o++) C([SV.x - 22 + o * 11, SV.y - 8, SV.x - 22 + o * 11, SV.y + 8], y, 2.5);
      for (let o of vV) (X(o.x, o.y, 16, 6), (e.fillStyle = "rgba(63,184,240," + (Math.min(1, o.t / 3) * 0.28).toFixed(3) + ")"), e.fill());
      if (
        ["S6", "S7", "S7b", "S8", "S9", "S10", "S11"].includes(n.scene) &&
        (m(1316, 40, 96, 120, 4), r(x.doorOpen ? "#2b3a67" : "#8a93a3", 4), x.doorOpen || C([1364, 44, 1364, 158], y, 3), n.scene === "S11")
      ) {
        (m(Ga.x - 14, Ga.y - 24, 28, 36, 4), r("#59657d", 3));
        for (let o = 0; o < 4; o++) F(Ga.x - 6 + (o % 2) * 12, Ga.y - 14 + Math.floor(o / 2) * 12, 3, "#8fdcff");
      }
      let l = [];
      if (
        (l.push({
          y: DV.y,
          d: () => {
            (e.beginPath(),
              e.moveTo(DV.x - 26, DV.y - 46),
              e.lineTo(DV.x + 26, DV.y - 46),
              e.lineTo(DV.x + 20, DV.y),
              e.lineTo(DV.x - 20, DV.y),
              e.closePath(),
              r("#8a93a3", 3),
              X(DV.x, DV.y - 46, 28, 6),
              r("#59657d", 3),
              J6());
          },
        }),
        l.push({
          y: ne.y,
          d: () => {
            (uf(ne.x, ne.y), n.sqPose === "hidden" && !le.inCrate && Math.abs(n.sq.x - ne.x) < 3 && ga(ne.x, ne.y - 52));
          },
        }),
        B.crate &&
          l.push({
            y: ye.y + 80,
            d: () => {
              let o = ye.x,
                i = ye.y;
              (pointer("crate", o, i, 150, 84, 8),
                Xn(o, i, 150, 84, "\xD7500"),
                m(o + 6, i - 22, 138, 20, 3),
                r("#fffdf3", 2),
                g("FOR THE MANAGER \xB7 EXTRA " + (window.SSQ && window.SSQ.snack ? window.SSQ.snack("NAME") : "SNACKS"), o + 75, i - 12, 6.5, "#7a2e1d", "center", 900),
                le.dolly &&
                  (m(o - 4, i + 82, 158, 8, 3),
                  r("#59657d", 2),
                  L(o + 14, i + 94, 6),
                  r("#2a2f3a", 2),
                  L(o + 136, i + 94, 6),
                  r("#2a2f3a", 2)),
                le.inCrate && n.sqPose === "hidden" && (m(o + 40, i - 10, 70, 14, 3), r("#2a2f3a", 2), ga(o + 75, i - 3)));
            },
          }),
        n.scene === "S4" && !le.inCrate && B.bots[0] && B.bots[0].on)
      ) {
        let o = B.bots[0],
          i = o.x + (n.sq.x - 60 - o.x) * le.light,
          s = o.y + 70 + (n.sq.y - o.y - 70) * le.light;
        (e.beginPath(),
          e.moveTo(o.x, o.y - 60),
          e.lineTo(i - 70, s),
          e.lineTo(i + 70, s + 10),
          e.closePath(),
          (e.fillStyle = "rgba(255,234,120,.45)"),
          e.fill());
      }
      for (let o of B.bots)
        o.on &&
          l.push({
            y: o.y,
            d: () => {
              S2(o) && seenCone(o.x, o.y - 50, M2(o), 0.42, 210, B.freakT > n.T - 1.5 ? "rgba(229,83,61,.3)" : "rgba(255,234,120,.4)");
              // The bot also senses Squatch's feet within 70 of its own (X6): that circle is drawn too (Phase 3 review).
              S2(o) && (conesDrawn.push({ circle: !0, ox: o.x, oy: o.y, len: 70, room: n.room }), e.beginPath(), e.ellipse(o.x, o.y, 70, 70, 0, 0, Math.PI * 2), (e.fillStyle = B.freakT > n.T - 1.5 ? "rgba(229,83,61,.18)" : "rgba(255,234,120,.28)"), e.fill());
              let i = E2(o.x, o.y);
              (dq(o.x + i.x, o.y + i.y, !1), k2(o.x, o.y));
            },
          });
      for (let o of B.jans) o.on && l.push({ y: o.y, d: () => u5(o) });
      if (
        (W6(l),
        n.scene === "Q3" &&
          l.push({
            y: 520,
            d: () => {
              Qt(640, 520, "#e8a87c", qtHere(), 1);
            },
          }),
        n.ch1Office &&
          l.push({
            y: 490,
            d: () => {
              (Qt(220, 470, "#c9b6f2", qtHere(), 0.3), dq(360, 490, !1));
            },
          }),
        !n.ch1Office &&
          n.mo.x > -50 &&
          l.push({
          y: n.mo.y,
          d: () => {
            (Fe(n.mo.x, n.mo.y, moDrawScale(), { f: n.mo.f, walk: n.mo.moving ? n.mo.walk : 0, mop: (n.scene || "")[0] !== "Q", ...(window.SSQ && window.SSQ.mopsBeardLook && window.SSQ.mopsBeardLook()) }),
              B.gave && n.scene === "S2" && (m(n.mo.x + 22 * n.mo.f - 9, n.mo.y - 50, 18, 20, 2), r("#cdbb98", 1.5)));
          },
        }),
        n.sqPose !== "hidden" &&
          l.push({
            y: n.sq.y,
            d: () =>
              Re(n.sq.x, n.sq.y, sqDrawScale(), {
                walk: n.sq.moving ? n.sq.walk : 0,
                f: n.sq.f,
                carry: n.lunch === "held",
                jacket: !!n.costumeOn,
                goatBeard: !!n.costumeOn,
                horns: !!n.costumeOn,
              }),
          }),
        l.sort((o, i) => o.y - i.y).forEach((o) => o.d()),
        B.slip.on && B.held
          ? iq(
              n.mo.x - 40,
              n.mo.y - 70 + (n.T - B.gustT < 0.6 ? Math.sin(n.T * 40) * 4 : 0),
              n.T - B.gustT < 0.6 ? Math.sin(n.T * 30) * 0.3 : -0.05,
              0,
            )
          : B.slip.on && B.bots[2] && iq(B.bots[2].x + 34, B.bots[2].y - 46, -0.1, 0),
        n.T - B.gustT < 3)
      ) {
        let o = n.T - B.gustT;
        e.globalAlpha = Math.max(0, 1 - o / 3);
        for (let i = 0; i < 12; i++) {
          let s = 180 + ((i * 47) % 380),
            q = 1200 - ((o * 700 + i * 113) % 900);
          (e.beginPath(),
            e.moveTo(q, s),
            e.quadraticCurveTo(q - 40, s - 12, q - 90, s),
            (e.strokeStyle = "#8fdcff"),
            (e.lineWidth = 4),
            (e.lineCap = "round"),
            e.stroke());
        }
        e.globalAlpha = 1;
      }
      ($6(),
        fA(),
        B.halves.forEach((o, i) => {
          if (!o.on) return;
          let s = i === 0 && Math.hypot(o.x - DV.x, o.y - (DV.y - 46)) < 4,
            q = i === 1 && Math.hypot(o.x - SV.x, o.y - SV.y) < 4;
          s || (q ? (m(o.x - 8, o.y - 3, 16, 7, 1), r("#ffffff", 1.5)) : iq(o.x, o.y, o.r, 1));
        }),
        e.restore());
    }
    function q5(l) {
      (e.save(), e.translate(480, 320), e.beginPath());
      for (let o = 0; o < 24; o++) {
        let i = (o / 24) * Math.PI * 2,
          s = o % 2 ? 236 : 250;
        e.lineTo(Math.cos(i) * s, Math.sin(i) * s * 1.12);
      }
      (e.closePath(),
        r("#ffcf33", 5),
        L(0, 0, 214),
        r("#ffe27a", 4),
        g("SIR MOPS-A-LOT", 0, -158, 24, y, "center", 900),
        g("HEAD GANITOR", 0, -126, 18, y, "center", 800),
        g("(GANITORS ON STAFF: 1)", 0, -104, 12, "#59657d", "center", 800),
        e.save(),
        e.translate(-70, -10),
        e.scale(2.2, 2.2),
        XV(0, 0, 22, 20, 12, 3, 0),
        wV("#ffffff", 2),
        C([-10, -16, -18, -30], y, 3),
        C([10, -16, 18, -30], y, 3),
        F(-7, -2, 2, y),
        F(7, -2, 2, y),
        X(0, 7, 4, 3),
        r("#f2a7b6", 1),
        e.restore(),
        e.save(),
        e.translate(90, -10),
        e.beginPath());
      for (let o = 0; o < 10; o++) {
        let i = -Math.PI / 2 + (o * Math.PI) / 5,
          s = o % 2 ? 26 : 60;
        e.lineTo(Math.cos(i) * s, Math.sin(i) * s);
      }
      (e.closePath(),
        r("#ffb000", 3),
        e.restore(),
        g("GOAT HAIR:", 0, 96, 26, "#b45309", "center", 900),
        g("certified", 0, 128, 20, "#b45309", "center", 800),
        g("Hypo-Alien-Genic\u2122", 0, 156, 20, "#b45309", "center", 800),
        e.restore(),
        l && void 0);
    }
    let R2 = -9,
      Sf = { x: 822, y: 560 },
      Ia = { x: 660, y: 584 };
    function fq(l, o) {
      for (let i = 0; i < 7; i++) n.furP.push({ x: n.sq.x + E(-20, 20), y: n.sq.y - E(20, 70), tx: l + E(-14, 14), ty: o, t: -i * 0.08 });
      D.hide();
    }
    function z2() {
      for (let l of n.furP) {
        if (l.t < 0) continue;
        let o = Math.min(1, l.t / 1),
          i = l.x + (l.tx - l.x) * o + Math.sin(l.t * 9) * 6,
          s = l.y + (l.ty - l.y) * o;
        ((e.globalAlpha = 1 - Math.max(0, o - 0.85) * 6), XV(i, s, 5, 3, 7, 1.4, l.t * 3), wV("#8b5a3c", 1.2), (e.globalAlpha = 1));
      }
    }
    let U2 = 48,
      r5 = 22;
    function c5() {
      let l = [];
      if (n.room === "hall") {
        for (let o of B.bots) o.on && o.y > te.bot - 10 && l.push({ x: o.x, y: o.y, hard: !1, o });
        for (let o of B.jans) o.on && o.y > te.bot - 10 && l.push({ x: o.x, y: o.y, hard: !1, o });
      }
      return (
        (n.room === "hall" || n.room === "deck" || n.room === "lobby") &&
          (n.moPose !== "hidden" && n.mo.x > -100 && l.push({ x: n.mo.x, y: n.mo.y, hard: !0, o: n.mo }),
          n.sqPose !== "hidden" && n.sqPose !== "under" && n.sq.x > -100 && l.push({ x: n.sq.x, y: n.sq.y, hard: !0, o: n.sq })),
        l
      );
    }
    function h5() {
      let l = c5();
      for (let o = 0; o < 3; o++)
        for (let i = 0; i < l.length; i++)
          for (let s = i + 1; s < l.length; s++) {
            let q = l[i],
              d = l[s];
            if (q.hard && d.hard) continue;
            let A = d.o.x - q.o.x,
              T = d.o.y - q.o.y;
            if (Math.abs(A) >= U2 || Math.abs(T) >= r5) continue;
            let R = (U2 - Math.abs(A)) * (A >= 0 ? 1 : -1);
            q.hard ? (d.o.x += R) : d.hard ? (q.o.x -= R) : ((q.o.x -= R / 2), (d.o.x += R / 2));
          }
    }
    let Ka = 0,
      Mf = "",
      uq = 480,
      fa = null;
    function D2() {
      return n.room === "hall" ? B.camX : 0;
    }
    let Q0 = "",
      sq = !1;
    function d5(l) {
      // A scripted door walk (beginRoomWalk) owns this room change: walk out, then fade, then walk in.
      // Chapter 1's C2/B2 path is the branch below, and it is unchanged while no door walk is playing.
      if (n.roomWalk) stepRoomWalk(l);
      else if (Mf && n.room !== Mf && p.state === "op" && ((Ka = Math.max(Ka, 1)), sq && n.sqPose === "stand")) {
        sq = !1;
        let o = D2();
        ((fa = { x: n.sq.x, y: n.sq.y, want: !0 }),
          (Q0 = n.scene),
          (n.sq.x = o + (uq > 480 ? -50 : c + 50)),
          (n.sq.f = uq > 480 ? 1 : -1),
          (n.ctrl = !1),
          Dt("transit", "", n.room + " walk-in", "transit"));
      }
      if (
        (fa && n.scene !== Q0 && (fa = null),
        (Mf = n.room),
        (Ka = Math.max(0, Ka - l / 0.45)),
        fa && !Q0 && (Q0 = n.scene),
        fa || (Q0 = ""),
        fa)
      ) {
        n.ctrl && ((fa.want = !0), (n.ctrl = !1));
        let o = mV(n.sq, fa.x, fa.y, 300, l);
        ((n.sq.moving = !o), o || (n.sq.walk += l * 11), o && ((n.ctrl = fa.want), (fa = null)));
      }
      uq = n.sq.x - D2();
    }
    function C2(l, o, i = 240) {
      return cV((s) => {
        sq = !0;
        let q = mV(n.sq, l, o, i, s);
        return ((n.sq.moving = !q), (n.sq.walk += s * 11), (n.sq.f = l > n.sq.x ? 1 : -1), q);
      });
    }
    function B2(l = 0.35) {
      return cV((o) => ((Ka = Math.min(1, Ka + o / l + o / 0.45)), Ka >= 1));
    }
    // One body, copied so a room change can put the real feet at the destination while the picture still shows the walk.
    function bodyAt(who) {
      let b = who === "mo" ? n.mo : n.sq;
      return { x: b.x, y: b.y, f: b.f, moving: !!b.moving, walk: b.walk || 0 };
    }
    // Walk out through the door, fade (the same black as B2/d5), then walk in from fromLeft.
    // arrive() runs at once and sets the new room and where they stand, so a test that reads the room
    // in the same turn sees the destination. The picture keeps the old room until the fade.
    // outWho and inWho are "sq" or "mo" (the same person, unless the cut hands off, as the van does).
    // Control stays off until the walk-in ends, then ctrlAfter is restored.
    // The step is mV, the same step C2 and He use.
    function beginRoomWalk(spec) {
      let outWho = spec.outWho,
        inWho = spec.inWho || outWho,
        fromRoom = n.room,
        stash = { sq: bodyAt("sq"), mo: bodyAt("mo"), sqPose: n.sqPose, moPose: n.moPose };
      (n.act = null), (n.walkTo = null), spec.arrive();
      let toRoom = n.room;
      if (fromRoom === toRoom) return;
      let inBody = inWho === "mo" ? n.mo : n.sq,
        entryX = spec.entryX != null ? spec.entryX : inBody.x,
        entryY = spec.entryY != null ? spec.entryY : inBody.y;
      (inBody.x = entryX), (inBody.y = entryY);
      n.roomWalk = {
        phase: "out",
        outWho,
        inWho,
        fromRoom,
        toRoom,
        scene: n.scene,
        x: stash[outWho].x,
        y: stash[outWho].y,
        f: spec.exitX >= stash[outWho].x ? 1 : -1,
        moving: !0,
        walk: stash[outWho].walk,
        exitX: spec.exitX,
        exitY: spec.exitY,
        entryX,
        entryY,
        fromLeft: !!spec.fromLeft,
        stash,
        ctrlAfter: spec.ctrlAfter != null ? spec.ctrlAfter : !!n.ctrl,
        done: spec.done || null,
        outMoved: 0,
        inMoved: 0,
      };
      n.ctrl = !1;
    }
    function stepRoomWalk(dt) {
      let w = n.roomWalk;
      if (!w) return;
      // A test or a checkpoint moved on. Drop the picture walk and give control back when this
      // walk was going to, or when nothing queued will, so the player is not stuck.
      if (n.scene !== w.scene || n.room !== w.toRoom) {
        let give = w.ctrlAfter || (!n.cur && !n.q.length);
        n.roomWalk = null;
        give && (n.ctrl = !0);
        return;
      }
      n.ctrl = !1;
      n.walkTo = null;
      let beforeX = w.x,
        beforeY = w.y;
      if (w.phase === "out") {
        let done = mV(w, w.exitX, w.exitY, 240, dt);
        w.outMoved += Math.hypot(w.x - beforeX, w.y - beforeY);
        done &&
          ((w.phase = "in"),
          (w.x = w.fromLeft ? -50 : c + 50),
          (w.y = w.entryY),
          (w.f = w.fromLeft ? 1 : -1),
          (w.moving = !0),
          (Ka = 1));
        return;
      }
      let done = mV(w, w.entryX, w.entryY, 300, dt);
      w.inMoved += Math.hypot(w.x - beforeX, w.y - beforeY);
      if (done) {
        let finish = w.done;
        (n.walkLog || (n.walkLog = [])).push({
          from: w.fromRoom,
          to: w.toRoom,
          outWho: w.outWho,
          inWho: w.inWho,
          outMoved: Math.round(w.outMoved),
          inMoved: Math.round(w.inMoved),
        });
        n.roomWalk = null;
        finish && finish();
        n.ctrl = w.ctrlAfter;
      }
    }
    // While the picture shows the walk, draw that room and those feet, then put the real state back for logic and bubbles.
    function applyWalkDraw() {
      let w = n.roomWalk;
      if (!w) return;
      let who = w.phase === "out" ? w.outWho : w.inWho,
        body = who === "mo" ? n.mo : n.sq;
      w.saved = {
        room: n.room,
        sq: bodyAt("sq"),
        mo: bodyAt("mo"),
        sqPose: n.sqPose,
        moPose: n.moPose,
      };
      if (w.phase === "out") {
        n.room = w.fromRoom;
        let other = who === "mo" ? "sq" : "mo",
          o = other === "sq" ? n.sq : n.mo,
          st = w.stash[other];
        (o.x = st.x), (o.y = st.y), (o.f = st.f), (o.moving = st.moving), (o.walk = st.walk);
        other === "sq" ? (n.sqPose = w.stash.sqPose) : (n.moPose = w.stash.moPose);
      }
      (body.x = w.x), (body.y = w.y), (body.f = w.f), (body.moving = !!w.moving), (body.walk = w.walk || 0);
      who === "sq" ? (n.sqPose = "stand") : (n.moPose = "stand");
    }
    function restoreWalkDraw() {
      let w = n.roomWalk;
      if (!w || !w.saved) return;
      let s = w.saved;
      (n.room = s.room),
        Object.assign(n.sq, s.sq),
        Object.assign(n.mo, s.mo),
        (n.sqPose = s.sqPose),
        (n.moPose = s.moPose),
        (w.saved = null);
    }
