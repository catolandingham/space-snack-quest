// The frame update (y5), rings, characters, bubbles, cards, room fades, and the main story draw (E5).
    function y5(l) {
      (ch2.resetHold &&
        ch2.resetHold.on &&
        !ch2.resetHold.fired &&
        ((ch2.resetHold.t += l), ch2.resetHold.t >= 0.75 && ((ch2.resetHold.fired = !0), (ch2.resetHold.on = !1), sectionReset())),
        noteSection(),
        stallTick(l),
        n.ctrl || (n.act = null),
        d5(l),
        h5(),
        iA(l),
        n.room === "hall" &&
          Gb(
            l,
            B.bots.filter((d) => d.on),
            B.camX,
            n.sq.x,
            n.sq.y,
          ));
      {
        let d = n.cur;
        d &&
          d.k === "fb" &&
          (d.pic === "fb1crate" || d.pic === "fb1lid") &&
          ((n.breathT = (n.breathT || 0) - l), n.breathT <= 0 && (z1(), (n.breathT = 2.6)));
      }
      n.T += l;
      for (let d of n.furP) d.t += l;
      if (
        ((n.furP = n.furP.filter((d) => d.t < 1.2)),
        n.room === "hall" &&
          n.ctrl &&
          n.sq.moving &&
          n.T > (n.seeGrace || 0) &&
          !x.mops &&
          !FV.on &&
          n.sqPose === "stand" &&
          ["S6", "S7", "S7b", "S8", "S9", "S11"].includes(n.scene) &&
          n.T - R2 > 6 &&
          Math.hypot(n.sq.x - SV.x, n.sq.y - SV.y) < 55)
      ) {
        ((R2 = n.T), fq(SV.x, SV.y), (n.furVent = !0), kV("pa", "FUR IN THE VENT!"), D.alarm());
        let d = [...B.bots.filter((A) => A.on), ...(n.scene === "S9" || n.scene === "S11" ? [x.lureBot] : [])];
        (d.sort((A, T) => Math.hypot(A.x - SV.x, A.y - SV.y) - Math.hypot(T.x - SV.x, T.y - SV.y)),
          !d[0] && x.tour[0] && d.push(x.tour[0]),
          d[0] && T2(d[0], "vent"));
      }
      n.room === "closet" &&
        n.ctrl &&
        !n.ventTaught &&
        n.sqPose === "stand" &&
        Math.hypot(n.sq.x - Sf.x, n.sq.y - Sf.y) < 70 &&
        ((n.ventTaught = !0), (n.furVent = !0), fq(Sf.x, Sf.y), kV("sq", "Oops. Fur in the vent."));
      for (let d of n.sparks) ((d.y -= (d.s === "!" ? 0 : 26) * l), (d.t -= l));
      if (((n.sparks = n.sparks.filter((d) => d.t > 0)), de())) {
        ((n.bt += l), n.cur && n.cur.k === "panel" && (n.panelT += l));
        // A tap kept from the first 0.3 s of this bubble is applied now (task T22).
        n.tapLate && (n.tapLate !== n.cur ? (n.tapLate = null) : n.bt >= 0.3 && ((n.tapLate = null), nf()));
        {
          let A = n.cur && n.cur.k === "panel" && n.cur.id === "terminal" && !x.typed ? "!SIGN" : n.bt > 3 ? "!NEXT" : "NEXT";
          p.verb !== A && ((p.verb = A), t.onVerb(A));
        }
        return;
      }
      for (let d of vV) d.t -= l;
      ((vV = vV.filter((d) => d.t > 0)), n.live.length && (n.live[0].live = (n.live[0].live || 0) - l) <= 0 && n.live.shift());
      (n.botSkid > 0 && (n.botSkid = Math.max(0, n.botSkid - l * 0.8)),
        n.glowT >= 0 &&
          ((n.glowT += l),
          (n.doorGlow = Math.min(1, n.glowT)),
          Math.random() < l * 2.2 &&
            n.puffs.push({ x: 845 + E(-30, 30), y: 425, t: 2.2, s: Math.random() < 0.45 ? "ha ha!" : nV(["\u266A", "\u266B"]) })));
      for (let d of n.puffs) ((d.x -= 10 * l), (d.y -= 30 * l), (d.t -= l));
      ((n.puffs = n.puffs.filter((d) => d.t > 0)),
        n.moPose === "sway" &&
          Math.random() < l * 2 &&
          ea.push({
            x: n.mo.x + 40 * n.mo.f,
            y: n.mo.y - 150,
            vx: E(-20, 20),
            vy: E(-40, -25),
            t: 1.6,
            c: nV(["#ff5fa8", "#3478f6", "#ffb547", "#2bc48a"]),
            s: nV(["\u266A", "\u266B"]),
          }));
      let o = oh(),
        i = Math.hypot(o.x, o.y);
      if (n.scene === "O5" && n.coneIn && n.sqPose === "under" && i > 0.3) {
        Dp();
        return;
      }
      if (n.scene === "O5" && n.ctrl && n.sqPose !== "under" && ((n.o5T = (n.o5T || 0) + l), n.o5T > 9)) {
        Up();
        return;
      }
      if (
        ((n.sqPose === "ball" && n.ctrl && i > 0.3 && !x.mops && (n.sqPose = "stand"),
        n.sqPose === "hidden" && n.ctrl && i > 0.3 && !x.mops && (x.spot >= 0 ? Xs() : Qs())),
        n.hopOut >= 0)
      ) {
        n.hopOut += l;
        let d = Math.min(1, n.hopOut / 0.38);
        ((n.sq.x = 205 + 45 * d),
          (n.sq.y = 470 + 104 * d - Math.sin(Math.PI * d) * 46),
          (n.sq.moving = !0),
          (n.sq.walk += l * 6),
          d >= 1 && ((n.hopOut = -1), (n.sq.moving = !1), R0(n.sq)));
        return;
      }
      if (n.ctrl && i > 0.1 && n.sqPose !== "sing" && n.sqPose !== "hidden" && !x.mops && n.room !== "duct") {
        let d = n.sq,
          A = n.room === "closet" ? 230 : 190,
          T = sn(),
          R = d.x,
          P = d.y;
        (n.sqPose === "sit" && ((n.sqPose = "stand"), (d.x = 205), (d.y = 470), (d.f = 1), (n.hopOut = 0), D.key()),
          (d.x = w(d.x + o.x * A * l, T.x0, T.x1)),
          (d.y = w(d.y + o.y * A * l * 0.8, T.y0, T.y1)),
          R0(d));
        let _ = Math.hypot(d.x - R, d.y - P);
        ((n.moved += _), (d.walk += l * 11), (d.moving = _ > 0.2), Math.abs(o.x) > 0.1 && (d.f = o.x > 0 ? 1 : -1), (n.idle = 0));
      } else ((n.sq.moving = !1), n.ctrl && (n.idle += l));
      if (
        (n.room === "lobby" && zp(l),
        n.room === "deck" && Kp(l),
        n.scene === "O3b" &&
          n.ctrl &&
          n.idle > 10 &&
          !n.whispered &&
          ((n.whispered = !0), TV([v("sq", "Just one peek. Mops won't know.", "whisper")])),
        chipNow(),
        n.scene === "S1" && n.ctrl && (n.act = Bp()),
        n.scene === "S1L" && n.ctrl && (n.act = Hp()),
        n.scene === "S2" && n.ctrl && (n.act = Zp()),
        n.scene === "S4" && (eA(l), n.ctrl && (n.act = $p())),
        n.scene === "S5" && n.ctrl && (n.act = tA()),
        (n.scene || "")[0] === "Q" && ch1QTick(l),
        j6(l),
        n.room === "hall")
      ) {
        for (let d of vV) d.t -= l * 0.2;
        if (n.scene === "S2" && n.ctrl && !B.gave) {
          let d = 330 + Math.sin(n.T * 1.2) * 30;
          ((n.mo.f = d > n.mo.x ? 1 : -1),
            (n.mo.x = d),
            (n.mo.walk += l * 8),
            (n.mo.moving = !0),
            Math.random() < l * 6 && vV.push({ x: n.mo.x - 30 * n.mo.f, y: n.mo.y + 6, t: 5 }));
        } else n.mo.moving = !1;
      }
      let s = Bs(),
        q = s ? (s.hot ? "!" : "") + s.verb + (s.cap ? " \u00b7 " + s.cap : "") : "";
      (q !== p.verb && ((p.verb = q), t.onVerb(q)), lh(l));
    }
    let qq = 0,
      m5 = {
        fur: "#6b4428",
        dark: "#55351f",
        mask: "#f4c39a",
        ear: "#d98c62",
        head: 15,
        bodyW: 11.5,
        bodyH: 14,
        arm: 12,
        leg: 7,
        out: 2,
        amp: 2.2,
      };
    function XV(l, o, i, s, q, d, A = 0) {
      e.beginPath();
      for (let T = 0; T <= q; T++) {
        let R = A + (T / q) * Math.PI * 2,
          P = l + Math.cos(R) * i,
          _ = o + Math.sin(R) * s;
        if (T === 0) {
          e.moveTo(P, _);
          continue;
        }
        let $ = A + ((T - 0.5) / q) * Math.PI * 2;
        e.quadraticCurveTo(l + Math.cos($) * (i + d * 1.6), o + Math.sin($) * (s + d * 1.6), P, _);
      }
      e.closePath();
    }
    function wV(l, o) {
      ((e.fillStyle = l), e.fill(), o && ((e.lineWidth = o), (e.strokeStyle = y), (e.lineJoin = "round"), e.stroke()));
    }
    function G2(l, o, i, s) {
      (e.beginPath(),
        e.moveTo(l, o - s * 0.28),
        e.bezierCurveTo(l - i * 0.15, o - s * 0.62, l - i * 0.62, o - s * 0.55, l - i * 0.5, o - s * 0.05),
        e.bezierCurveTo(l - i * 0.45, o + s * 0.4, l - i * 0.2, o + s * 0.52, l, o + s * 0.52),
        e.bezierCurveTo(l + i * 0.2, o + s * 0.52, l + i * 0.45, o + s * 0.4, l + i * 0.5, o - s * 0.05),
        e.bezierCurveTo(l + i * 0.62, o - s * 0.55, l + i * 0.15, o - s * 0.62, l, o - s * 0.28),
        e.closePath());
    }
    function St(l, o, i, s, q, d, A) {
      ((e.lineCap = "round"),
        A && ((e.strokeStyle = y), (e.lineWidth = q + A * 2), e.beginPath(), e.moveTo(l, o), e.lineTo(i, s), e.stroke()),
        (e.strokeStyle = d),
        (e.lineWidth = q),
        e.beginPath(),
        e.moveTo(l, o),
        e.lineTo(i, s),
        e.stroke());
    }
    function F(l, o, i, s) {
      (e.beginPath(), e.arc(l, o, i, 0, 7), (e.fillStyle = s), e.fill());
    }
    function Re(l, o, i, s) {
      let q = m5;
      (e.save(), e.translate(l, o), e.scale(i * (s.f || 1), i));
      let d = s.walk || 0,
        A = Math.sin(d) * 0.5,
        T = q.leg,
        R = q.bodyH,
        P = -T - R - q.head * 0.75;
      s.legs !== !1 &&
        (e.beginPath(),
        e.ellipse(0, 1, q.bodyW + 5, 3, 0, 0, 7),
        (e.fillStyle = "rgba(30,36,48,.15)"),
        e.fill(),
        St(-3, -T, -3 + A * 6, 0, 4.2, q.dark, q.out),
        St(3, -T, 3 - A * 6, 0, 4.2, q.dark, q.out),
        F(-3 + A * 6 + 0.5, 0, 2.4, q.mask),
        F(3 - A * 6 + 0.5, 0, 2.4, q.mask));
      let _ = -T - R + 3,
        $ = s.singing ? Math.PI - 0.5 : s.carry ? 1.2 : 0.35 + A * 0.4,
        gV = s.singing ? -(Math.PI - 0.6) : -0.35 - A * 0.4;
      (St(-q.bodyW + 1, _, -q.bodyW + 1 + Math.sin(gV) * q.arm, _ + Math.cos(gV) * q.arm, 3.6, q.dark, q.out),
        F(-q.bodyW + 1 + Math.sin(gV) * q.arm, _ + Math.cos(gV) * q.arm, 2.2, q.mask),
        XV(0, -T - R / 2, q.bodyW, R / 2 + 1, 11, q.amp * 0.8, 0.3),
        wV(q.fur, q.out));
      let oe = q.bodyW - 1 + Math.sin($) * q.arm,
        ve = _ + Math.cos($) * q.arm;
      (St(q.bodyW - 1, _, oe, ve, 3.6, q.fur, q.out),
        F(oe, ve, 2.2, q.mask),
        s.carry && (m(oe - 4, ve - 2, 10, 11, 1.5), r("#cdbb98", 1.2)),
        // The robot janitors notice from the lobby (D15): a white sheet in his hand.
        s.paper && (m(oe - 3, ve - 12, 11, 14, 1), r("#ffffff", 1), C([oe - 1, ve - 8, oe + 6, ve - 8], "#e5533d", 1.4), C([oe - 1, ve - 4, oe + 6, ve - 4], y, 0.8)));
      for (let Qe of [-q.head * 0.95, q.head * 0.95]) (e.beginPath(), e.arc(Qe, P + 1, 3.4, 0, 7), wV(q.ear, q.out));
      if (
        (XV(0, P, q.head * 0.92, q.head * 0.85, 14, q.amp, -Math.PI / 2),
        wV(q.fur, q.out),
        G2(0, P + q.head * 0.18, q.head * 1.25, q.head * 1.05),
        wV(q.mask, 1.5),
        s.eyes === "closed")
      ) {
        ((e.strokeStyle = y), (e.lineWidth = 1.1));
        for (let Qe of [-1, 1]) (e.beginPath(), e.arc(Qe * q.head * 0.27, P + q.head * 0.1, 1.6, 0.1, Math.PI - 0.1), e.stroke());
      } else (F(-q.head * 0.27, P + q.head * 0.12, 1.5, y), F(q.head * 0.27, P + q.head * 0.12, 1.5, y));
      (s.singing
        ? (e.beginPath(), e.ellipse(0, P + q.head * 0.45, 1.8, 2.2 + Math.sin(n.T * 12) * 0.5, 0, 0, 7), (e.fillStyle = y), e.fill())
        : (e.beginPath(), e.arc(0, P + q.head * 0.38, 2.2, 0.2, Math.PI - 0.2), (e.strokeStyle = y), (e.lineWidth = 1.1), e.stroke()),
        s.jacket &&
          (m(-q.bodyW * 0.95, -T - R * 0.35, q.bodyW * 1.9, R * 0.85, 5),
          r("#3478f6", 1.4),
          m(-3, -T - R * 0.05, 8, 6, 1),
          r("#2456b0", 1)),
        s.horns &&
          ((e.strokeStyle = "#c9ad84"),
          (e.lineWidth = 2.8),
          (e.lineCap = "round"),
          e.beginPath(),
          e.moveTo(-q.head * 0.28, P - q.head * 0.55),
          e.quadraticCurveTo(-q.head * 0.95, P - q.head * 1.35, -q.head * 0.15, P - q.head * 1.05),
          e.moveTo(q.head * 0.28, P - q.head * 0.55),
          e.quadraticCurveTo(q.head * 0.95, P - q.head * 1.35, q.head * 0.15, P - q.head * 1.05),
          e.stroke()),
        s.goatBeard &&
          (e.beginPath(),
          e.moveTo(-2, P + q.head * 0.55),
          e.quadraticCurveTo(-7, P + q.head * 1.15, 0, P + q.head * 1.35),
          e.quadraticCurveTo(7, P + q.head * 1.15, 2, P + q.head * 0.55),
          r("#f7f4ee", 1.2)),
        e.restore());
    }
    // L2 ball (C3): a brown ball, scalloped head, ears, two dark eyes with white highlights. No face, arms, or legs.
    function drawL2Ball(x, y) {
      (e.save(),
        e.translate(x, y),
        F(-16, -10, 7, "#6b3a1c"),
        F(16, -10, 7, "#6b3a1c"),
        e.beginPath(),
        e.arc(0, 2, 20, 0, Math.PI * 2),
        e.moveTo(-18, -2),
        e.arc(-14, -6, 8, 0, Math.PI * 2),
        e.arc(0, -12, 9, 0, Math.PI * 2),
        e.arc(14, -6, 8, 0, Math.PI * 2),
        r("#6b3a1c", 3),
        F(-7, -2, 4.2, "#1e2430"),
        F(7, -2, 4.2, "#1e2430"),
        F(-5.5, -3.4, 1.4, "#ffffff"),
        F(8.4, -3.4, 1.4, "#ffffff"),
        e.restore());
    }
    function Fe(l, o, i, s) {
      i >= he * 0.9 && s.eyes !== "closed" && n.moPose !== "sleep" && !x.mops && _A(l, o, s.f ?? 1);
      let q = 2;
      (e.save(), e.translate(l, o), e.scale(i * (s.f || 1), i), s.sway && e.rotate(s.sway));
      let d = Math.sin(s.walk || 0) * 2;
      (e.beginPath(),
        e.ellipse(0, 1, 22, 3.5, 0, 0, 7),
        (e.fillStyle = "rgba(30,36,48,.15)"),
        e.fill(),
        [
          [-12, d],
          [-6, -d],
          [6, d],
          [12, -d],
        ].forEach(([T, R]) => St(T, -10, T + R, 0, 3.4, "#cfd5dd", q)),
        XV(0, -17, 17, 9, 14, 2, 0),
        wV("#ffffff", q),
        // His own jacket. Squatch wears the spare from the wardrobe, so this one stays on.
        m(-14, -24, 28, 14, 4),
        r("#3478f6", 1.2),
        m(-3, -16, 6, 4, 1),
        r("#2456b0", 1));
      let A = s.headDown ? 6 : 0;
      (e.beginPath(),
        e.moveTo(14, -24 + A),
        e.quadraticCurveTo(27, -16, 22, -8),
        e.quadraticCurveTo(29, -4, 25, 0),
        e.quadraticCurveTo(20, 2.5, 17, -1),
        e.quadraticCurveTo(12, -10, 14, -24 + A),
        wV("#f1f3f6", q),
        C([19, -16, 21, -6], "#c9ced8", 0.8),
        XV(17, -29 + A, 7, 7, 10, 1.6, 0),
        wV("#ffffff", q),
        e.beginPath(),
        e.moveTo(13, -34 + A),
        e.quadraticCurveTo(10, -44 + A, 5, -44 + A),
        e.quadraticCurveTo(2, -43 + A, 3, -40 + A),
        e.moveTo(20, -35 + A),
        e.quadraticCurveTo(22, -45 + A, 27, -45 + A),
        e.quadraticCurveTo(30, -44 + A, 29, -41 + A),
        (e.strokeStyle = y),
        (e.lineWidth = 4.6),
        (e.lineCap = "round"),
        e.stroke(),
        (e.strokeStyle = "#c9ad84"),
        (e.lineWidth = 2.6),
        e.stroke(),
        s.eyes === "closed" ? C([17.5, -29 + A, 21, -29 + A], y, 1.2) : F(19.5, -29 + A, 1.4, y),
        F(23.5, -26.5 + A, 1.1, "#f2a7b6"),
        s.mouth === "o" && (e.beginPath(), e.ellipse(22, -24 + A, 1.4, 1.9, 0, 0, 7), (e.fillStyle = y), e.fill()),
        e.beginPath(),
        e.arc(-2, -18, 3.2, 0, 7),
        wV("#ffcf33", 1.2),
        F(-2, -18, 1.2, "#e8a400"),
        s.mop && (St(-26, -40, -15, 0, 2.2, "#b8a07e", 1), XV(-14, 1, 6, 2.6, 8, 1.5, 0), wV("#8fdcff", 1)),
        n.room === "kitchen" &&
          !ch2.greasy &&
          (ch2.phase === "wash5" || n.scene === "G5k") &&
          (e.beginPath(),
          e.ellipse(16, -70, 9, 16, 0, 0, 7),
          (e.fillStyle = "#fffaf0"),
          e.fill(),
          e.beginPath(),
          e.moveTo(16, -84),
          e.lineTo(16, -56),
          (e.strokeStyle = "#d5d0c6"),
          (e.lineWidth = 1.4),
          e.stroke(),
          m(6, -54, 20, 7, 2),
          r("#e5533d", 1)),
        e.restore());
    }
    function b5(l, o) {
      (St(l, o - 120, l + 14, o, 6, "#b8a07e", 2.5), XV(l + 16, o + 2, 16, 8, 9, 4, 0), wV("#8fdcff", 2.5));
    }
    function rq(l, o, i) {
      (e.save(),
        e.translate(l, o),
        e.scale(i, i),
        m(-62, -15, 124, 30, 15),
        r("#2b3a67", 2.5),
        L(-47, 0, 10),
        r("#8b5a3c", 2),
        C([-56, 0, -38, 0], "#fff3d6", 2.5),
        e.beginPath(),
        e.arc(-32, 0, 7, -1.2, 1.2, !0),
        (e.strokeStyle = "#ffcf33"),
        (e.lineWidth = 0),
        e.beginPath(),
        e.arc(50, -3, 6, 0, 7),
        (e.fillStyle = "#ffcf33"),
        e.fill(),
        e.beginPath(),
        e.arc(53, -5, 5, 0, 7),
        (e.fillStyle = "#2b3a67"),
        e.fill(),
        g("MOON PIES", 1, 1, 14, "#ffcf33", "center", 900),
        e.restore());
    }
    function p5(l, o, i) {
      (e.save(), e.translate(l, o), e.scale(i, i), m(-46, -40, 92, 80, 10), r("#7b3fe4", 3));
      for (let [s, q] of [
        [-34, -30],
        [30, -28],
        [36, 20],
        [-38, 24],
      ])
        F(s, q, 1.8, "#ffffff");
      (e.beginPath(),
        e.moveTo(-18, 10),
        e.lineTo(0, -26),
        e.lineTo(18, 10),
        e.closePath(),
        r("#ffcf33", 2.5),
        F(-4, -4, 2.4, "#e5533d"),
        F(6, 2, 2, "#e5533d"),
        X(0, -24, 22, 6),
        (e.strokeStyle = "#8fdcff"),
        (e.lineWidth = 2.5),
        e.stroke(),
        m(-42, 14, 84, 22, 8),
        r("#ff8a3d", 2),
        g("ASTRO", 0, 20, 10, "#ffffff", "center", 900),
        g("NACHOS", 0, 31, 10, "#ffffff", "center", 900),
        e.restore());
    }
    function A5(l, o, i) {
      (e.save(),
        e.translate(l, o),
        e.scale(i, i),
        m(-30, -42, 60, 84, 8),
        r("#dff3ff", 3),
        e.beginPath(),
        e.moveTo(-10, 0),
        e.lineTo(0, 24),
        e.lineTo(10, 0),
        e.closePath(),
        r("#e8a548", 2),
        L(0, -6, 10),
        r("#ffb6d9", 2),
        L(-6, -14, 7),
        r("#fff3d6", 2),
        L(6, -14, 7),
        r("#8b5a3c", 2),
        g("\u2744", 18, -30, 12, "#3478f6", "center", 900),
        m(-28, 26, 56, 14, 5),
        r("#3478f6", 1.5),
        g("FREEZE-DRIED", 0, 33, 7, "#ffffff", "center", 900),
        g("ICE CREAM", 0, -34, 8, "#3478f6", "center", 900),
        e.restore());
    }
    function Xn(l, o, i, s, q) {
      (m(l, o, i, s, 4), r("#d9a35b", 4));
      let d = 4;
      for (let A = 1; A < d; A++) C([l + 3, o + (A * s) / d, l + i - 3, o + (A * s) / d], "#a8743a", 2);
      (C([l + 6, o + 6, l + i - 6, o + s - 6], "rgba(120,80,40,.35)", 6),
        C([l + 6, o + s - 6, l + i - 6, o + 6], "rgba(120,80,40,.35)", 6),
        m(l, o, 12, s, 2),
        r("#b9b9b9", 2),
        m(l + i - 12, o, 12, s, 2),
        r("#b9b9b9", 2));
      for (let A of [o + 8, o + s - 8]) (F(l + 6, A, 2, y), F(l + i - 6, A, 2, y));
      (rq(l + i / 2, o + s * 0.42, Math.min(1.1, i / 120)),
        e.save(),
        (e.globalAlpha = 0.75),
        g("FRAGILE \xB7 THIS SIDE UP \u2191", l + i / 2, o + s - 14, Math.max(8, i / 22), "#7a2e1d", "center", 900),
        q && g(q, l + i - 30, o + 14, 13, "#7a2e1d", "center", 900),
        e.restore());
    }
    // A spot's ring: its circle or box on the floor, glowing, with a bouncing arrow over it. It is drawn
    // from the spot's own numbers (see spot in 00-core.js), never from a box typed in here.
    function ringZone(l) {
      let o = 0,
        d = 0.5 + 0.5 * Math.sin(n.T * 5);
      (ringsDrawn.push(l.box ? { id: l.id, who: l.who, box: { ...l.box } } : { id: l.id, who: l.who, x: l.x, y: l.y, r: l.r }),
        e.save(),
        (e.shadowColor = "#ffcf33"),
        (e.shadowBlur = 18 + 16 * d),
        e.beginPath(),
        l.box ? e.rect(l.box.x0 - o, l.box.y0, l.box.x1 - l.box.x0, l.box.y1 - l.box.y0) : e.arc(l.x - o, l.y, l.r, 0, Math.PI * 2),
        (e.fillStyle = "rgba(255,207,51," + (0.1 + 0.12 * d).toFixed(3) + ")"),
        e.fill(),
        (e.lineWidth = 6),
        (e.strokeStyle = "#ffcf33"),
        e.stroke(),
        e.setLineDash([12, 8]),
        (e.lineDashOffset = -n.T * 24),
        (e.lineWidth = 3),
        (e.strokeStyle = "#ff8a00"),
        e.stroke(),
        e.restore(),
        e.setLineDash([]));
      let i = (l.box ? (l.box.x0 + l.box.x1) / 2 : l.x) - o,
        s = (l.box ? l.box.y0 : l.y - l.r) - 10 - 8 * Math.abs(Math.sin(n.T * 4));
      s > 40 && (e.beginPath(), e.moveTo(i - 14, s - 18), e.lineTo(i + 14, s - 18), e.lineTo(i, s), e.closePath(), r("#ffcf33", 3));
    }
    function oV(l, o, i, s, q = 14) {
      let d = 0.5 + 0.5 * Math.sin(n.T * 5);
      (e.save(),
        (e.shadowColor = "#ffcf33"),
        (e.shadowBlur = 26 + 22 * d),
        (e.fillStyle = "rgba(255,207,51," + (0.12 + 0.14 * d).toFixed(3) + ")"),
        m(l - 10 - 5 * d, o - 10 - 5 * d, i + 20 + 10 * d, s + 20 + 10 * d, q),
        e.fill(),
        (e.lineWidth = 7),
        (e.strokeStyle = "#ffcf33"),
        e.stroke(),
        e.setLineDash([12, 8]),
        (e.lineDashOffset = -n.T * 24),
        (e.lineWidth = 3.5),
        (e.strokeStyle = "#ff8a00"),
        e.stroke(),
        e.restore(),
        e.setLineDash([]));
      let A = o - 22 - 8 * Math.abs(Math.sin(n.T * 4)),
        T = l + i / 2;
      A > 40 && (e.beginPath(), e.moveTo(T - 14, A - 18), e.lineTo(T + 14, A - 18), e.lineTo(T, A), e.closePath(), r("#ffcf33", 3));
    }
    function Ef(l, o, i) {
      (e.save(),
        e.translate(l, o),
        e.scale(i, i),
        e.rotate(-0.04),
        m(-38, -36, 76, 74, 3),
        r("#fffdf3", 2.5),
        g("STAY IN", 0, -22, 13, "#e5533d", "center", 900),
        g("HERE!", 0, -7, 15, "#e5533d", "center", 900),
        g("\u2014 Mops", 0, 9, 10, "#3478f6", "center", 700),
        (e.strokeStyle = "#2b8a5e"),
        (e.lineWidth = 1.6),
        (e.lineCap = "round"),
        e.beginPath(),
        e.ellipse(-6, 25, 9, 5, 0, 0, 7),
        e.stroke(),
        e.beginPath(),
        e.arc(6, 19, 4, 0, 7),
        e.stroke(),
        e.beginPath(),
        e.moveTo(4, 15),
        e.quadraticCurveTo(1, 11, -1, 13),
        e.moveTo(8, 15),
        e.quadraticCurveTo(11, 11, 13, 13),
        e.moveTo(-11, 29),
        e.lineTo(-11, 33),
        e.moveTo(-2, 29),
        e.lineTo(-2, 33),
        e.moveTo(7, 22),
        e.lineTo(8, 29),
        e.stroke(),
        e.restore());
    }
    function cq() {
      (e.beginPath(),
        e.moveTo(522, 512),
        e.lineTo(598, 512),
        e.lineTo(588, 566),
        e.lineTo(532, 566),
        e.closePath(),
        r("#ffcf33", 4),
        X(560, 512, 38, 9),
        r("#8fdcff", 3),
        X(552, 510, 14, 5),
        r("#ffffff", 2));
    }
    function H2() {
      (Xn(110, 420, 190, 106, ""), m(120, 410, 170, 34, 14), r("#a98bff", 4));
    }
    function L2() {
      (m(318, 478, 64, 44, 6), r("#3478f6", 4), g("G", 350, 501, 22, "#ffffff"));
    }
    function g5() {
      let l = n.sq;
      (!(n.sqPose === "stand" && l.y < 566 && Math.abs(l.x - 560) < 80) &&
        !(n.botOn && n.bot.y >= 566 && Math.abs(n.bot.x - 560) < 90) &&
        !(n.sqPose === "stand" && l.y >= 566 && Math.abs(l.x - 560) < 80) &&
        cq(),
        n.sqPose === "stand" &&
          (l.y < 566 && Math.abs(l.x - 560) < 80 && cq(),
          l.y < 512 && Math.abs(l.x - 350) < 70 && L2(),
          l.y < 526 && l.x > 70 && l.x < 340 && H2()));
    }
    function P2() {
      if (
        ((e.fillStyle = "#dfe4ea"),
        e.fillRect(0, 0, c, b),
        m(60, 90, 840, 500, 18),
        r("#f4f1ea", 6),
        e.save(),
        m(63, 93, 834, 494, 16),
        e.clip(),
        (e.fillStyle = "#ebe6da"),
        e.fillRect(60, 360, 840, 240),
        C([60, 360, 900, 360], "rgba(30,36,48,.18)", 3),
        e.restore(),
        drawWardrobe(),
        n.scene === "S1" && ringNear("sched"),
        m(408, 300, 104, 12, 3),
        r("#cdbb98", 3),
        !0)
      )
        if (!n.found.has("stash")) (m(448, 276, 30, 22, 4), r("#3478f6", 2.5), m(445, 271, 36, 8, 3), r("#2b5fc4", 2));
        else {
          (m(448, 276, 30, 22, 4), r("#3478f6", 2.5));
          for (let o = 0; o < 3; o++) (L(455 + o * 8, 274, 5), r("#8b5a3c", 1.5));
          (e.save(), e.translate(484, 268), e.rotate(0.9), m(-18, -4, 36, 8, 3), r("#2b5fc4", 2), e.restore());
        }
      (C([418, 312, 418, 360], y, 4), C([502, 312, 502, 360], y, 4));
      for (let o = 0; o < 5; o++) (m(416 + o, 290 - o * 3.2, 40, 10, 1), r("#ffffff", 1.5));
      if (
        (X(462, 350, 16, 7),
        r("#c9ced8", 2),
        m(446, 338, 32, 12, 3),
        r("#dfe4ea", 2),
        n.lunch === "shelf" &&
          (pointer("lunch", 468, 258, 34, 42, 8),
          m(468, 258, 34, 42, 3),
          r("#cdbb98", 2.5),
          C([468, 270, 502, 270], y, 1.5),
          g("MOPS", 485, 286, 9, y)),
        m(540, 250, 150, 14, 4),
        r("#cdbb98", 4),
        pointer("tv", 560, 170, 110, 80, 10),
        m(560, 170, 110, 80, 8),
        r(y, 0),
        m(570, 180, 90, 58, 4),
        n.tvOn)
      ) {
        r(Math.sin(n.T * 23) > 0.2 ? "#bfe9ff" : "#8fdcff", 0);
        for (let o = 0; o < 4; o++)
          C([574, 186 + o * 14 + ((n.T * 40) % 14), 656, 186 + o * 14 + ((n.T * 40) % 14)], "rgba(255,255,255,.6)", 2);
      } else r("#59657d", 0);
      (pointer("door", 860, 300, 40, 160, 8),
        homeDoorCut(),
        Ef(808, 268, 1),
        n.pulse.has("sign") &&
          (e.save(), (e.shadowColor = "#ffcf33"), (e.shadowBlur = 30), Ef(748, 210, 1.08), e.restore()));
      if (
        (pointer("bed", 110, 410, 190, 130, 12),
        m(112, 524, 16, 18, 3),
        r("#c98a3a", 3),
        m(282, 524, 16, 18, 3),
        r("#c98a3a", 3),
        (e.fillStyle = n.sqPose === "under" ? "#2a2f3a" : "rgba(30,36,48,.3)"),
        e.fillRect(128, 524, 154, 18),
        n.sqPose === "under")
      ) {
        let o = Math.sin(n.T * 2.3) > 0.94 ? 0.25 : 1;
        (X(196, 533, 5, 5 * o), r("#ffffff", 0), X(214, 533, 5, 5 * o), r("#ffffff", 0), F(197, 534, 2, y), F(215, 534, 2, y));
      }
      (H2(),
        pointer("gbox", 318, 478, 64, 44, 8),
        L2(),
        cq(),
        n.chair && (m(588, 396, 110, 74, 14), r("#e5533d", 4), m(580, 448, 126, 32, 10), r("#ff6a3d", 4)));
    }
    // Home wardrobe (R29–R34). Far left, back wall, base on the floor line. Calendar faces us only while the door is shut.
    function drawWardrobe() {
      let open = n.wardrobe === "open",
        x = 66,
        y0 = 156,
        w = 150,
        h = 204;
      (m(x, y0, w, h, 6), r("#d7c4a3", 4), C([x + 8, y0 + 22, x + w - 8, y0 + 22], "#a89070", 3));
      if (!open) {
        (C([x + w / 2, y0 + 8, x + w / 2, y0 + h - 8], y, 3),
          F(x + w / 2 - 10, y0 + h * 0.55, 3.5, "#c9a24a"),
          F(x + w / 2 + 10, y0 + h * 0.55, 3.5, "#c9a24a"),
          m(x + w / 2 + 8, y0 + 18, 60, 108, 3),
          r("#fffaf0", 2),
          F(x + w / 2 + 38, y0 + 30, 4, "#e5533d"),
          g("DELIVERY", x + w / 2 + 38, y0 + 48, 11, y, "center", 900),
          e.save(),
          e.translate(x + w / 2 + 38, y0 + 78),
          rq(0, 0, 0.52),
          e.restore());
        return;
      }
      (m(x - 8, y0 + 10, 14, h - 20, 2),
        r("#c4b08a", 3),
        m(x + w - 6, y0 + 10, 14, h - 20, 2),
        r("#c4b08a", 3),
        C([x + 28, y0 + 36, x + w - 28, y0 + 36], "#8a93a3", 2));
      // The spare is a plain blue jacket. No words on it. Once Squatch takes it, the hook is bare.
      if (!n.costumeOn) {
        let hx = x + w / 2;
        (C([hx, y0 + 36, hx, y0 + 46], "#6b7280", 2),
          m(hx - 18, y0 + 46, 36, 48, 5),
          r("#3478f6", 2),
          m(hx - 5, y0 + 62, 10, 8, 1),
          r("#2456b0", 1));
      }
    }
    // The way out is a cut in the right wall (R36). The poster hangs on the wall beside it (R35). No floor vent (R37).
    function homeDoorCut() {
      // A floor-level opening in the right wall: the gap starts on the back wall and the floor runs through it.
      ((e.fillStyle = "#dfe4ea"),
        e.fillRect(892, 250, 24, 110),
        (e.fillStyle = "#ebe6da"),
        e.fillRect(886, 360, 42, 130),
        C([892, 250, 916, 250], y, 7),
        C([892, 488, 916, 488], y, 7));
    }
    function Qt(l, o, i, s, q) {
      (e.save(),
        e.translate(l, o),
        e.scale(s, s),
        m(-7, -2, 6, 16, 2),
        r("#59657d", 2),
        m(1, -2, 6, 16, 2),
        r("#59657d", 2),
        m(-12, -30, 24, 30, 8),
        r(i, 2.5),
        L(0, -40, 10),
        r("#f0bf93", 2.5),
        F(q * 4, -41, 1.6, y),
        e.restore());
    }
    function kf(l, o, i) {
      (e.save(),
        e.translate(l, o),
        e.scale(1.5, 1.5),
        m(-7, -2, 6, 16, 2),
        r("#3d4454", 2),
        m(1, -2, 6, 16, 2),
        r("#3d4454", 2),
        m(-13, -32, 26, 32, 6),
        r("#8a93a3", 2.5),
        e.beginPath(),
        e.moveTo(-3, -32),
        e.lineTo(0, -18),
        e.lineTo(3, -32),
        r("#e5533d", 1.5),
        L(0, -42, 10),
        r("#f0bf93", 2.5));
      let s = i ? 0 : -3;
      (F(s - 3, -43, 1.5, y), F(s + 3, -43, 1.5, y), i && (X(0, -37, 2, 2.6), r(y, 0)), m(-9, -53, 18, 5, 2), r("#3d4454", 0), e.restore());
    }
    function Q2(l, o) {
      (e.save(),
        e.translate(l, o),
        e.scale(1.5, 1.5),
        m(-6, -2, 5, 16, 2),
        r("#3d4454", 2),
        m(1, -2, 5, 16, 2),
        r("#3d4454", 2),
        m(-12, -32, 24, 32, 7),
        r("#a98bff", 2.5),
        m(-24, -28, 13, 17, 2),
        r("#cdbb98", 2),
        C([-21, -23, -14, -23], y, 1),
        C([-21, -19, -14, -19], y, 1),
        L(0, -42, 10),
        r("#f0bf93", 2.5),
        e.beginPath(),
        e.arc(0, -45, 11, Math.PI, 0),
        r("#8b5a3c", 2),
        F(-3, -42, 1.5, y),
        F(3, -42, 1.5, y),
        e.restore());
    }
    function Y2() {
      return n.room === "closet" ? 2.9 : 1.75;
    }
    function hq(l, o, i) {
      pf("guard", l, o, i, !0);
      let s = Y2();
      (e.save(),
        e.translate(l, o),
        e.scale(s, s),
        X(0, 2, 16, 5),
        r("rgba(30,36,48,.15)", 0),
        m(-7, -2, 6, 16, 2),
        r("#1e2a4a", 2),
        m(1, -2, 6, 16, 2),
        r("#1e2a4a", 2),
        m(-12, -32, 24, 32, 7),
        r("#2f5fb3", 2.5),
        m(-5, -27, 10, 7, 1.5),
        r("#ffcf33", 1.2),
        L(0, -42, 10),
        r("#f0bf93", 2.5),
        F(i * 4, -43, 1.6, y),
        m(-11, -56, 22, 9, 3),
        r("#1e2a4a", 2),
        m(i > 0 ? 0 : -14, -50, 14, 4, 2),
        r("#1e2a4a", 0),
        m(i > 0 ? 10 : -22, -20, 12, 6, 2),
        r("#59657d", 1.5),
        L(i > 0 ? 23 : -23, -17, 3),
        r("#ffe27a", 1.2),
        C([-6, -33, 0, -24, 6, -33], "#e5533d", 1.4),
        m(-3, -25, 6, 4, 1.5),
        r("#c0c6d0", 1),
        e.beginPath());
      for (let q = 0; q < 10; q++) {
        let d = -Math.PI / 2 + (q * Math.PI) / 5,
          A = q % 2 ? 1.6 : 3.6;
        e.lineTo(Math.cos(d) * A, -52 + Math.sin(d) * A);
      }
      (e.closePath(), r("#ffcf33", 0.8), X(i * 2, -37.5, 5, 1.6), r("#6b4429", 0), e.restore());
    }
    function dq(l, o, i = !1) {
      (e.save(),
        e.translate(l, o),
        e.scale(1.6, 1.6),
        X(0, 0, 18, 6),
        r("rgba(30,36,48,.15)", 0),
        m(-15, -30, 30, 28, 9),
        r(i ? "#3478f6" : "#ffffff", 2.5),
        L(0, -38, 9),
        r("#dfe4ea", 2.5),
        F(0, -38, 4, i ? "#ffcf33" : "#e5533d"),
        i ? (m(-26, -22, 12, 6, 2), r("#ffcf33", 1.5)) : (St(12, -14, 22, 4, 2.5, "#b8a07e", 1), X(24, 4, 7, 3), r("#8fdcff", 1.5)),
        e.restore());
    }
    function yq(l) {
      let o = n.T - (n.nT[l] ?? -9);
      return o < 0.35 ? Math.sin((o / 0.35) * Math.PI) * 14 : 0;
    }
    function Of(l, o, i) {
      i && g("!", l, o, 34, "#e5533d", "center", 900);
    }
    function x5() {
      ((e.fillStyle = "#f1f3f6"), e.fillRect(0, 0, c, b), (e.strokeStyle = "#e2e6ec"), (e.lineWidth = 1));
      for (let i = 0; i <= c; i += 60) (e.beginPath(), e.moveTo(i, 120), e.lineTo(i, b), e.stroke());
      for (let i = 120; i <= b; i += 60) (e.beginPath(), e.moveTo(0, i), e.lineTo(c, i), e.stroke());
      ((e.fillStyle = "#ffffff"),
        e.fillRect(0, 0, c, 120),
        (e.fillStyle = "#e8ecf3"),
        e.fillRect(330, 60, 300, 62),
        C([0, 120, 330, 120], y, 4),
        C([630, 120, c, 120], y, 4),
        C([330, 60, 330, 120], y, 4),
        C([630, 60, 630, 120], y, 4),
        e.save(),
        m(14, 140, 150, 300, 10),
        e.clip(),
        (e.fillStyle = "#2b3a67"),
        e.fillRect(14, 140, 150, 300));
      for (let i = 0; i < 14; i++) F(20 + ((i * 37) % 140), 150 + ((i * 53) % 280), 1.5, "#fff");
      (Ut("jupiter", 120, 370, 120),
        (e.globalAlpha = 0.35),
        (e.fillStyle = "#ffffff"),
        e.beginPath(),
        e.moveTo(30, 150),
        e.lineTo(70, 150),
        e.lineTo(24, 260),
        e.lineTo(24, 200),
        e.closePath(),
        e.fill(),
        (e.globalAlpha = 1),
        e.restore(),
        m(8, 134, 162, 312, 12),
        r(null, 0),
        (e.strokeStyle = "#8a93a3"),
        (e.lineWidth = 8),
        e.strokeRect(14, 140, 150, 300),
        C([89, 140, 89, 440], "#8a93a3", 6),
        C([14, 290, 164, 290], "#8a93a3", 6),
        m(14, 140, 150, 300, 10),
        r(null, 4),
        m(4, 440, 170, 16, 4),
        r("#cfd5de", 3),
        m(360, 236, 240, 26, 6),
        r("#c9b28a", 3),
        m(360, 262, 240, 10, 3),
        r("#9c8460", 2.5),
        m(390, 74, 180, 30, 6),
        r("#3478f6", 3),
        g("INSPECTION NIGHT", 488, 89, 15, "#ffffff"),
        e.save(),
        e.translate(404, 89),
        e.scale(0.45, 0.45),
        m(-14, -12, 28, 24, 6),
        r("#ffffff", 2.5),
        F(-6, 0, 3, "#3478f6"),
        F(6, 0, 3, "#3478f6"),
        e.restore());
      // D15: the snack counter, the brochure table with its notice, and the vent with its pull (10-ch1.js).
      (lobbyCounter(), lobbyTable(), lobbyVent());
      let l = n.pulse.has("cdoor");
      (l &&
        (e.save(),
        (e.shadowColor = "#2bc48a"),
        (e.shadowBlur = 30 + 10 * Math.sin(n.T * 6)),
        m(432, 596, 96, 44, 6),
        r("#2bc48a", 4),
        e.restore()),
        m(432, 596, 96, 44, 6),
        r(l ? "#bff0d8" : "#ffffff", 4),
        g("CLOSET", 480, 616, 12, "#8a93a3"));
      for (let i of vV) (X(i.x, i.y, 14, 6), (e.fillStyle = "rgba(63,184,240,.25)"), e.fill());
      {
        let i = (n.runner && n.runner.pulled >= 0) || n.looked;
        (m(je.x - 22, je.y - 30, 44, 54, 5),
          r(i && Math.sin(n.T * 18) > 0 ? "#ff9a8a" : "#e5533d", 3),
          m(je.x - 14, je.y - 22, 28, 14, 3),
          r("#ffffff", 2),
          g("ALARM", je.x, je.y - 15, 9, "#e5533d", "center", 900),
          C([je.x, je.y, je.x, je.y + (i ? 18 : 6)], y, 4),
          L(je.x, je.y + (i ? 18 : 6), 5),
          r("#ffcf33", 2));
      }
      if (!n.looked && n.scene === "O4")
        for (let i of hh()) (Fh(i.ox, i.oy, i.a, i.half, i.len, "civ", !!n.runner), conesDrawn.push({ ox: i.ox, oy: i.oy, a: i.a, half: i.half, len: i.len, room: "lobby", cam: 0 }));
      let o = [];
      if (n.runner && !n.looked) {
        let i = n.runner;
        o.push({
          y: i.y,
          d: () => {
            let s = i.y - (i.pulled < 0 ? Math.abs(Math.sin(n.T * 16)) * 6 : 0),
              q = je.x > i.x ? 1 : -1;
            i.k === "U" ? kf(i.x, s, q > 0 ? 1 : 0) : Qt(i.x, s, i.k === "R" ? "#ffffff" : "#ffb547", 1.6, q);
          },
        });
      }
      (o.push({
        y: 400,
        d: () => {
          let i = n.famTurn > 0 ? 1 : -1,
            s = yq("L");
          ((n.runner && n.runner.k === "L" && !n.looked) || Qt(210, 400 - s, "#ffb547", 1.6, i),
            Qt(300, 405 - s, "#ff8fc0", 0.9, i),
            C([276, 372 - s, 290, 378 - s], "#f0bf93", 4),
            Qt(262, 405 - s, "#7fd1ff", 1.4, i),
            Of(210, 248 - s, n.famTurn > 0 && n.T - (n.nT.L ?? -9) < 1.6));
        },
      }),
        o.push({
          y: 230,
          d: () => {
            let i = n.execTurn > 0 ? 1 : 0,
              s = yq("U");
            ((n.runner && n.runner.k === "U" && !n.looked) || kf(410, 230 - s, i),
              kf(550, 226 - s, i),
              Q2(480, 236),
              m(462, 222, 36, 34, 4),
              r("#8b5a3c", 3),
              m(456, 216, 48, 8, 3),
              r("#6b4429", 2.5),
              Of(480, 140, n.execTurn > 0 && n.T - (n.nT.U ?? -9) < 1.6));
          },
        }),
        o.push({
          y: n.bot.y,
          d: () => {
            let i = yq("R");
            (n.runner && n.runner.k === "R" && !n.looked) ||
              (Qt(860, 440 - i, "#ffffff", 1.6, n.lightHit > 0 ? -1 : 1),
              m(850, 398 - i, 20, 22, 3),
              r("#e5533d", 2),
              Of(860, 350 - i, n.lightHit > 0 && n.T - (n.nT.R ?? -9) < 1.6));
          },
        }));
      for (let i of n.lg)
        o.push({
          y: i.y,
          d: () => {
            let s = Math.hypot(i.tx - i.x, i.ty - i.y) > 2;
            (hq(i.x, i.y - (s ? Math.abs(Math.sin(n.T * 14)) * 6 : 0), i.tx > i.x || (!s && i.x < 480) ? 1 : -1),
              i === n.lg[0] && n.T - n.lgJump < 0.9 && g("!", i.x, i.y - 120, 34, "#e5533d", "center", 900));
          },
        });
      if (
        (o.push({ y: n.sq.y, d: () => Re(n.sq.x, n.sq.y, he, { walk: n.sq.moving ? n.sq.walk : 0, f: n.sq.f, paper: !!n.holdNotice }) }),
        o.sort((i, s) => i.y - s.y).forEach((i) => i.d()),
        lobbyTuft(),
        n.pulse.has("cdoor") && n.ctrl)
      ) {
        let i = 584 + Math.sin(n.T * 7) * 6;
        (e.beginPath(), e.moveTo(462, i - 22), e.lineTo(498, i - 22), e.lineTo(480, i), e.closePath(), r("#2bc48a", 3.5));
      }
      ((e.globalAlpha = 1),
        n.flash > 0 && ((e.fillStyle = "rgba(255,255,255," + Math.min(1, n.flash * 5) + ")"), e.fillRect(0, 0, c, b)),
        n.scene === "O4" &&
          n.T - (n.sirenT ?? -9) < 2.5 &&
          Math.sin(n.T * 14) > 0 &&
          ((e.fillStyle = "rgba(229,83,61,.18)"), e.fillRect(0, 0, c, b)));
    }
    function v5(l) {
      if (l === "bot" && n.room === "lobby" && n.lg && n.lg.length) {
        let i = n.lg[0];
        return { x: i.x, y: i.y - 100 };
      }
      let o = T5(l);
      return n.room === "hall" && l !== "pa" && !n.fbPic ? { x: o.x - B.camX, y: o.y } : o;
    }
    function T5(l) {
      let o = IA(l);
      if (o) return o;
      let i = h6(l);
      if (i) return i;
      let s = G6(l);
      if (s) return s;
      if (l === "official") return { x: 210, y: 215 };
      if (l === "scanner") return { x: Ha.x, y: 170 };
      if (l === "tourist" && n.room === "hall") {
        let q = x.tour[Math.max(0, x.alertBy)];
        return q ? { x: q.x, y: q.y - 84 } : { x: c / 2, y: 40 };
      }
      if (l === "bot" && n.room === "hall" && n.T - B.freakT < 4) return { x: B.freak.x, y: B.freak.y - 80 };
      if (l === "bot" && (n.scene === "S9" || n.scene === "S11")) return { x: x.lureBot.x, y: x.lureBot.y - 80 };
      if (l === "mops" && n.fbPic) return n.fbPic === "fb1beard" ? { x: 600, y: 250 } : { x: 560, y: 270 };
      if (l === "gary") return { x: qV.gary.x, y: qV.gary.y - 84 };
      if (l === "linda") return { x: qV.linda.x, y: qV.linda.y - 84 };
      if (l === "sq" && n.room === "window" && n.sqPose === "hidden") return { x: n.sq.x, y: n.sq.y - 110 };
      if (l === "sq" && n.room === "hall" && n.sqPose === "hidden") return { x: n.sq.x, y: n.sq.y - 100 };
      if (l === "sq") {
        if (n.under === "crack") return { x: 210, y: 470 };
        if (n.sqPose === "under") return { x: 205, y: 520 };
        if (n.sqPose === "sit" || n.sqPose === "sleep") return { x: 205, y: 300 };
        let q = n.room === "closet" ? wl : he;
        return { x: n.sq.x, y: n.sq.y - 46 * q };
      }
      if (l === "mops") {
        let q = n.room === "closet" ? wl : he * 1.15;
        return { x: n.mo.x + 18 * q * n.mo.f, y: n.mo.y - 46 * q };
      }
      if (l === "tourist" && n.room === "deck") {
        let q = aV.tour[Math.max(0, aV.alertBy)];
        return q ? { x: q.x, y: q.y - 84 } : { x: c / 2, y: 40 };
      }
      return l === "bot"
        ? { x: n.bot.x, y: n.bot.y - 80 }
        : l === "kid"
          ? { x: 210, y: 262 }
          : l === "exec"
            ? { x: 410, y: 160 }
            : l === "demo"
              ? { x: 860, y: 370 }
              : l === "scrub"
                ? { x: 360, y: 588 }
                : { x: c / 2, y: 40 };
    }
    let mq = [];
    function bq(l, o) {
      if (((n.maxB = Math.max(n.maxB, ++qq)), l.style === "pa")) {
        let CV = zt(l.text, 640, 30);
        ge(30);
        let NV = Math.max(...CV.map((Ll) => e.measureText(Ll).width)) + 120,
          ze = CV.length * 36 + 34,
          Ue = c / 2 - NV / 2,
          mn = 70;
        (m(Ue, mn, NV, ze, 16), r("#fff3d6", 4));
        let jn = mn + ze / 2;
        (m(Ue + 18, jn - 9, 12, 18, 2),
          r(y, 0),
          e.beginPath(),
          e.moveTo(Ue + 28, jn - 9),
          e.lineTo(Ue + 46, jn - 20),
          e.lineTo(Ue + 46, jn + 20),
          e.lineTo(Ue + 28, jn + 9),
          e.closePath(),
          r(y, 0));
        for (let Ll of [10, 18]) (e.beginPath(), e.arc(Ue + 48, jn, Ll, -0.8, 0.8), (e.strokeStyle = y), (e.lineWidth = 3), e.stroke());
        ge(16);
        let Nf = e.measureText(pa.pa).width + 22;
        (m(Ue + 16, mn - 15, Nf, 28, 12),
          r(Ds.pa, 3),
          g(pa.pa, Ue + 16 + Nf / 2, mn - 1, 16, "#ffffff"),
          CV.forEach((Ll, vq) => g(Ll, Ue + 70 + (NV - 70) / 2, mn + 17 + 18 + vq * 36, 30, "#b91c1c", "center", 900)),
          Ue + NV - 14,
          mn + ze - 10);
        return;
      }
      let i = l.style === "whisper" || o,
        s = i ? 21 : 27,
        q = i ? 340 : 470,
        d = zt(l.text, q, s);
      ge(s);
      let away = earAt(l.who),
        ear = !!(l.ear || away),
        A = ear ? 30 : 0,
        T = Math.max(110, Math.max(...d.map((CV) => e.measureText(CV).width)) + 44) + A,
        R = d.length * (s + 6) + (o ? 18 : 32),
        P = away || v5(l.who),
        _ = w(P.x - T / 2, 10, c - T - 10),
        $ = P.y - R - 24;
      $ < 24 && ($ = 24);
      for (let CV = 0; CV < 8; CV++) {
        let NV = mq.find((ze) => _ < ze[0] + ze[2] + 6 && _ + T + 6 > ze[0] && $ < ze[1] + ze[3] + 6 && $ + R + 6 > ze[1]);
        if (!NV) break;
        NV[1] - R - 8 >= 24 ? ($ = NV[1] - R - 8) : (_ = NV[0] + NV[2] + 8 + T <= c - 10 ? NV[0] + NV[2] + 8 : Math.max(10, NV[0] - T - 8));
      }
      (mq.push([_, $, T, R]),
        window.__ss && (window.__ss.lastBubble = { who: l.who, text: l.text, x: _, y: $, w: T, h: R, ear, at: performance.now() }));
      let gV = w(P.x, _ + 24, _ + T - 24),
        oe = l.style === "song" ? "#ffe3f1" : l.style === "whisper" ? "#f6f7fb" : "#ffffff";
      l.style === "whisper" && e.setLineDash([4, 6]);
      let ve = Math.min(P.y - 6, $ + R + 22);
      if (
        (l.style !== "whisper" &&
          (e.beginPath(),
          e.moveTo(gV - 11, $ + R - 2),
          e.lineTo(gV + (P.x > gV ? 8 : P.x < gV ? -8 : 0), ve),
          e.lineTo(gV + 11, $ + R - 2),
          e.closePath(),
          r(oe, i ? 3 : 4)),
        m(_, $, T, R, l.style === "song" ? 26 : 18),
        r(oe, i ? 3 : 4),
        e.setLineDash([]),
        l.style !== "whisper")
      )
        ((e.fillStyle = oe), e.fillRect(gV - 9, $ + R - 5, 18, 7));
      else
        for (let [CV, NV] of [
          [10, 5],
          [22, 3],
        ])
          (L(gV + ((P.x - gV) * CV) / 30, $ + R + CV, NV), e.setLineDash([3, 3]), r(oe, 2), e.setLineDash([]));
      if ((l.style === "song" && (g("\u266A", _ + 4, $ + 4, 22, "#ff5fa8"), g("\u266B", _ + T - 4, $ + R - 2, 22, "#ff5fa8")), !o)) {
        let CV = pa[l.who];
        ge(16);
        let NV = e.measureText(CV).width + 22;
        (m(_ + 16, $ - 15, NV, 28, 12), r(Ds[l.who], 3), g(CV, _ + 16 + NV / 2, $ - 1, 16, "#ffffff"));
      }
      if (ear) {
        let CV = _ + 22,
          NV = $ + R / 2;
        (e.beginPath(), e.arc(CV, NV - 2, 9, Math.PI * 0.9, Math.PI * 2.3), (e.strokeStyle = y), (e.lineWidth = 3), e.stroke());
      }
      let Qe = _ + A + (T - A) / 2;
      (d.forEach((CV, NV) =>
        g(
          CV,
          Qe,
          $ + (o ? 9 : 16) + s / 2 + NV * (s + 6),
          s,
          l.style === "whisper" ? "#4b5563" : y,
          "center",
          l.style === "whisper" ? 600 : 800,
        ),
      ),
        o || (_ + T - 14, $ + R - 10, void 0));
    }
    function M5(l, o, s, cd) {
      if (l === "switch") {
        // Switch card: who you are now, their picture, and why. Waits for a tap like every card.
        let mo = cd && cd.who === "mops";
        ((e.fillStyle = "#1e2430"), e.fillRect(0, 0, c, b), L(c / 2, 400, 150), r(mo ? "#2bc48a" : "#b5562a", 6));
        mo ? Fe(c / 2 - 20, 500, he * 2.6, { f: 1 }) : Re(c / 2, 520, he * 1.7, { f: 1 });
        g(o, c / 2, 110, 48, "#ffffff", "center", 800);
        zt(s || "", 820, 26).forEach((t, i) => g(t, c / 2, 170 + i * 34, 26, "#8fdcff", "center", 700));
        return;
      }
      if (l === "jupiter") {
        ((e.fillStyle = "#1b2140"), e.fillRect(0, 0, c, b));
        for (let s = 0; s < 46; s++) F((s * 97) % c, (s * 61) % 420, 1.6, "#ffffff");
        Ut("jupiter", 480, 1e3, 560);
        for (let [s, q, d] of [
          [370, 440, 50],
          [440, 420, 62],
          [530, 422, 58],
          [600, 446, 44],
          [480, 456, 70],
        ])
          (L(s, q, d), r("#ffffff", 0));
        (e.beginPath(), e.arc(480, 384, 66, Math.PI, 0), e.closePath(), r("#eaf2ff", 3.5), m(404, 380, 152, 20, 6), r("#ffffff", 3));
        for (let s of [438, 466, 494, 522]) (m(s - 6, 352, 12, 14, 3), r("#ffcf33", 2));
        (C([480, 318, 480, 288], y, 2.5),
          e.beginPath(),
          e.moveTo(480, 288),
          e.lineTo(514, 295),
          e.lineTo(480, 302),
          e.closePath(),
          r("#e5533d", 2),
          zt(o, 820, 40).forEach((s, q) => g(s, c / 2, 120 + q * 50, 40, "#ffffff")));
        return;
      }
      if (l === "squatch") {
        (P2(),
          X2(),
          e.save(),
          e.beginPath(),
          e.rect(0, 0, c, b),
          e.arc(205, 380, 125, 0, Math.PI * 2, !0),
          (e.fillStyle = "rgba(20,24,32,.8)"),
          e.fill("evenodd"),
          e.restore(),
          ge(34));
        let i = e.measureText(o).width + 60;
        (m(c / 2 - i / 2 + 120, 120, i, 78, 18), r("#ffffff", 4), g(o, c / 2 + 120, 159, 34), c / 2 + 120 + i / 2 - 14);
        return;
      }
      if (l === "focus" && cd) {
        drawRoom();
        let fx = cd.x,
          fy = cd.y,
          fr = cd.r;
        // Pointing at the faces (page text over the picture): find where they are on the picture now.
        if (cd.faces) {
          let el = document.getElementById("ss-faces"),
            cv = e.canvas.getBoundingClientRect();
          if (el && cv.width) {
            let q = el.getBoundingClientRect(),
              k = c / cv.width;
            ((fx = (q.left + q.width / 2 - cv.left) * k), (fy = (q.top + q.height / 2 - cv.top) * k), (fr = Math.max(q.width, q.height) * k * 0.75 + 12));
            // On a phone the faces sit in the bar above the picture: the spotlight opens at the top edge under them.
            fy < 0 && ((fy = 0), (fr = Math.max(fr, 90)));
          }
        }
        (e.save(),
          e.beginPath(),
          e.rect(0, 0, c, b),
          e.arc(fx, fy, fr, 0, Math.PI * 2, !0),
          (e.fillStyle = "rgba(20,24,32,.8)"),
          e.fill("evenodd"),
          e.beginPath(),
          e.arc(fx, fy, fr, 0, Math.PI * 2),
          (e.lineWidth = 6),
          (e.strokeStyle = "#ffcf33"),
          e.stroke(),
          e.restore(),
          ge(40));
        let ls = zt(o, 420, 40),
          bw = Math.max(...ls.map((t) => e.measureText(t).width)) + 60,
          h = ls.length * 50 + 30,
          tx = fx < c / 2 ? Math.min(c - bw / 2 - 20, fx + fr + 40 + bw / 2) : Math.max(bw / 2 + 20, fx - fr - 40 - bw / 2),
          ty = w(fy - h / 2, 20, b - h - 20);
        (m(tx - bw / 2, ty, bw, h, 18), r("#ffffff", 4), ls.forEach((t, i) => g(t, tx, ty + 40 + i * 50, 40, "#1e2430", "center", 800)));
        return;
      }
      if (((e.fillStyle = "#1e2430"), e.fillRect(0, 0, c, b), l === "ever")) {
        zt(o, 760, 34).forEach((i, s) => g(i, c / 2, b / 2 - 50 + s * 46, 34, "#ffffff", "center", 800));
        return;
      }
      if (l === "end" && B.nextBeat === "End") {
        (g(o, c / 2, b / 2 - 30, 64, "#ffcf33"),
          g("Thanks for playing, Nick!".replace(", Nick", ""), c / 2, b / 2 + 40, 24, "#8fdcff", "center", 700));
        return;
      }
      if (l === "end") {
        (g(o, c / 2, b / 2 - 30, 40, "#ffffff"),
          g(
            B.nextBeat === "Ch4"
              ? "Next stop: Mars! Chapter 4 is coming soon."
              : B.nextBeat === "Ch3"
                ? "Next stop: Phobos! Chapter 3 is coming soon."
                : B.nextBeat === "Ch2"
                  ? "Next stop: the gas stop. Chapter 2 is coming soon."
                  : "Ch1 continues from " + B.nextBeat + " in the next build.",
            c / 2,
            b / 2 + 30,
            22,
            "#8fdcff",
            "center",
            700,
          ));
        return;
      }
      if (l === "jail") {
        ((e.fillStyle = "#1e2430"), e.fillRect(0, 0, c, b), (e.fillStyle = "#2a3348"), e.fillRect(200, 180, 560, 340));
        for (let i = 0; i < 7; i++) (m(230 + i * 72, 190, 16, 310, 4), r("#d5dbe6", 3));
        let who = s === "blorp" ? "diner" : s || n.jailBy || "",
          cap =
            who === "pump"
              ? "Nozzle's ready."
              : who === "diner"
                ? "Counter's closed."
                : who === "sink"
                  ? "Seen from the window."
                  : who === "rust"
                    ? "No coins, no lot."
                    : "Holding pen";
        if (who === "rust")
          (KA(330, 500, 1, 0, 0),
            Re(600, 490, he * 0.85, { f: -1 }),
            m(500, 430, 28, 36, 4),
            r("#ffcf33", 2),
            g("0", 514, 448, 14, "#1e2430", "center", 800));
        else if (who === "pump")
          (f2({ x: 340, y: 530, f: 1, look: 0 }, !1, !1),
            C([400, 470, 560, 470], "#ffcf33", 8),
            Re(640, 490, he * 0.85, { f: -1 }),
            X(640, 318, 22, 8),
            r("#f2b84b", 2));
        else if (who === "diner")
          (eq(280, 460, 0.8),
            X(420, 400, 26, 26),
            r("#a98bff", 3),
            m(500, 390, 44, 28, 10),
            r("#ffffff", 3),
            m(508, 396, 28, 14, 6),
            r("#f2b84b", 0),
            Re(680, 490, he * 0.85, { f: -1 }));
        else if (who === "sink")
          (m(520, 210, 150, 80, 6),
            r("#8fdcff", 3),
            g("ORDERS", 640, 248, 12, "#1e2430", "center", 800),
            eq(640, 230, 0.5),
            X(360, 500, 46, 14),
            r("#7ad35a", 3),
            g("out cold", 360, 470, 12, "#1e2430", "center", 700),
            Re(470, 490, he * 0.85, { f: 1 }));
        else Re(480, 470, he * 0.85, { f: 1, eyes: "closed" });
        (g(o, c / 2, 110, 44, "#ffffff", "center", 800),
          zt(cd && cd.cause ? cd.cause : cap, 820, 22).forEach((t, i) => g(t, c / 2, 156 + i * 28, 22, "#8fdcff", "center", 700)),
          cd && cd.restart && g(cd.restart, c / 2, 560, 22, "#ffffff", "center", 800));
        return;
      }
      g(o, c / 2, b / 2, 50, "#ffffff", "center", 800);
    }
    function pq(l, o, i, s = 0) {
      (e.save(),
        e.translate(l, o),
        e.rotate(s),
        e.scale(i, i),
        e.beginPath(),
        e.moveTo(0, -26),
        e.quadraticCurveTo(12, -12, 10, 14),
        e.lineTo(-10, 14),
        e.quadraticCurveTo(-12, -12, 0, -26),
        e.closePath(),
        r("#e5533d", 2.5),
        L(0, -4, 5),
        r("#8fdcff", 2),
        e.beginPath(),
        e.moveTo(-10, 6),
        e.lineTo(-18, 18),
        e.lineTo(-10, 14),
        e.closePath(),
        r("#ffcf33", 2),
        e.beginPath(),
        e.moveTo(10, 6),
        e.lineTo(18, 18),
        e.lineTo(10, 14),
        e.closePath(),
        r("#ffcf33", 2),
        e.restore());
    }
    function wf(l, o, i, s = 0) {
      let q = "#9a4a1c",
        d = "#5e2a0c",
        A = Math.sin(i) * 1.5;
      (m(l - 12, o - 6, 10, 16, 4), r(q, 2), m(l + 2, o - 6, 10, 16, 4), r(q, 2), XV(l, o - 20, 17, 22, 18, 3, 0), wV(q, 2.5));
      for (let R = 0; R < 6; R++) C([l - 12 + R * 5, o - 30 + (R % 2) * 4, l - 13 + R * 5 + A, o - 6 + (R % 3) * 3], d, 1.1);
      let T = s === 1;
      (St(l - 15, o - 30, l - 20, o - 8 + Math.sin(i) * 2, 5, q, 2),
        T ? St(l + 15, o - 30, l + 22, o - 60, 5, q, 2) : St(l + 15, o - 30, l + 20, o - 8 - Math.sin(i) * 2, 5, q, 2),
        e.save(),
        e.translate(l, o - 22),
        e.rotate(-0.75),
        m(-20, -3, 40, 6, 1.5),
        r("#6b4429", 1.5));
      for (let R = -16; R <= 14; R += 6) (m(R, -2.2, 3.5, 4.4, 0.5), r("#d8d8d8", 0.8));
      (e.restore(), XV(l, o - 50, 17, 15, 16, 2.6, 0), wV(q, 2.5), XV(l, o - 40, 15, 7, 12, 2.2, 0), wV(q, 1.5));
      for (let R = 0; R < 5; R++) C([l - 10 + R * 5, o - 62, l - 11 + R * 5, o - 55], d, 1);
      (s === 2
        ? (m(l - 11, o - 53, 9, 5, 2), r(y, 0), m(l + 2, o - 53, 9, 5, 2), r(y, 0), C([l - 2, o - 51, l + 2, o - 51], y, 1.5))
        : (L(l - 5, o - 51, 2.4),
          r("#ffffff", 1.2),
          F(l - 5, o - 51, 1.3, y),
          L(l + 5, o - 51, 2.4),
          r("#ffffff", 1.2),
          F(l + 5, o - 51, 1.3, y)),
        X(l, o - 46, 2.5, 1.5),
        r(y, 0),
        X(l, o - 41, 5, 3.2),
        r("#3a1405", 1.5),
        C([l - 3, o - 43, l + 3, o - 43], "#ffffff", 1),
        s === 0 &&
          (C([l - 10, o - 38, l, o - 22, l + 10, o - 38], y, 1.2),
          m(l - 7, o - 26, 14, 10, 2),
          r("#b8bcc4", 1.5),
          L(l, o - 21, 3),
          r("#3a3f4b", 1)),
        s === 1 &&
          (C([l + 22, o - 58, l + 22, o - 88], y, 1.8),
          e.beginPath(),
          e.moveTo(l + 22, o - 88),
          e.lineTo(l + 44, o - 81),
          e.lineTo(l + 22, o - 74),
          e.closePath(),
          r("#ff6a3d", 1.5),
          C([l + 24, o - 84, l + 32, o - 80, l + 25, o - 77], "#3478f6", 1.5)));
    }
    function I2(l, o) {
      let i = n.T;
      if (
        ((e.fillStyle = "#f1f3f6"),
        e.fillRect(0, 0, c, b),
        e.save(),
        e.translate(480, 300),
        e.scale(3, 3),
        l.startsWith("fb2") && (e.save(), e.scale(1 / 3, 1 / 3), e.translate(-480, -300), V6(l), e.restore()),
        l.startsWith("fb1") && (e.save(), e.scale(1 / 3, 1 / 3), e.translate(-480, -300), f5(l), e.restore()),
        l === "banish")
      ) {
        let A = Math.min(1, (i - n.banT) / 4);
        (m(70, -30, 70, 50, 10),
          r("#dfe4ea", 2.5),
          e.beginPath(),
          e.moveTo(140, -30),
          e.lineTo(160, -5),
          e.lineTo(140, 20),
          e.closePath(),
          r("#dfe4ea", 2.5),
          m(78, -12, 18, 32, 2),
          r("#2b3a67", 2),
          g("TOURS", 108, -20, 6, y, "center", 900),
          [-10, 25, 55].forEach((T, R) => {
            let P = T + A * 60;
            P < 85 && (e.save(), e.translate(P, 22), e.scale(0.7, 0.7), wf(0, 0, i * 4, R), e.restore());
          }),
          e.save(),
          e.translate(-90, 22),
          m(-6, -2, 5, 14, 2),
          r("#1e2a4a", 1.5),
          m(1, -2, 5, 14, 2),
          r("#1e2a4a", 1.5),
          m(-11, -30, 22, 30, 6),
          r("#ffffff", 2),
          C([-10, -28, 10, -4], "#e5533d", 4),
          St(9, -26, 34, -34, 3.5, "#ffffff", 1.5),
          L(0, -40, 9),
          r("#f0bf93", 2),
          m(-9, -52, 18, 6, 2),
          r("#1e2a4a", 1.5),
          F(3, -41, 1.3, y),
          C([-1, -36, 5, -36], y, 1.3),
          e.restore());
      }
      if ((l === "tour" && [-50, 0, 50].forEach((A, T) => wf(A, 22, i * 3, T)), l === "shed")) {
        [-50, 0, 50].forEach((A, T) => wf(A, 22, i * 3, T));
        for (let A = 0; A < 30; A++) {
          let T = ((A * 37 + i * 30) % 220) - 110,
            R = ((A * 23 + i * 18) % 120) - 80;
          (e.beginPath(), e.arc(T, R, 4, 0, 2.2), (e.strokeStyle = "#8b5a3c"), (e.lineWidth = 1.5), e.stroke());
        }
      }
      if (l === "clog") {
        (m(-44, -64, 88, 56, 4), r("#dfe4ea", 2.5));
        for (let A = -36; A <= 36; A += 9) C([A, -58, A, -14], y, 1.5);
        (XV(0, -36, 22, 20, 14, 3, 0), wV("#a0703f", 2.5), g("AIR SCRUBBER", 0, -70, 6, y));
        for (let [A, T] of [
          [-72, "#7fd1ff"],
          [72, "#a98bff"],
        ])
          (e.save(),
            e.translate(A, 26),
            m(-7, -2, 6, 14, 2),
            r("#59657d", 2),
            m(1, -2, 6, 14, 2),
            r("#59657d", 2),
            m(-11, -28, 22, 28, 7),
            r(T, 2.5),
            St(-8, -24, -3, -33, 3.5, T, 1.5),
            St(8, -24, 3, -33, 3.5, T, 1.5),
            L(0, -37, 9),
            r("#f0bf93", 2.5),
            X(0, -33, 2.2, 3),
            r(y, 0),
            F(-3, -39, 1.2, y),
            F(3, -39, 1.2, y),
            e.restore());
      }
      if (
        (l === "nofur" &&
          (XV(0, -12, 20, 20, 14, 3, 0),
          wV("#8b5a3c", 2.5),
          L(0, -12, 36),
          (e.strokeStyle = "#e5533d"),
          (e.lineWidth = 6),
          e.stroke(),
          C([-25, -37, 25, 13], "#e5533d", 6)),
        e.restore(),
        e.save(),
        (e.globalCompositeOperation = "saturation"),
        (e.globalAlpha = 0.6),
        (e.fillStyle = "#808080"),
        e.fillRect(0, 0, c, b),
        e.restore(),
        (e.fillStyle = "rgba(240,226,200,.2)"),
        e.fillRect(0, 0, c, b),
        (e.strokeStyle = "#59657d"),
        (e.lineWidth = 6),
        e.strokeRect(9, 9, c - 18, b - 18),
        g("YEARS AGO", 40, 36, 16, "#59657d", "left", 800),
        o === "*gasp*")
      ) {
        n.maxB = Math.max(n.maxB, ++qq);
        let A = 264,
          T = 224,
          R = 160,
          P = 62,
          _ = A - R / 2,
          $ = T - P - 26;
        (e.beginPath(),
          e.moveTo(A - 10, $ + P - 2),
          e.lineTo(A, T - 4),
          e.lineTo(A + 10, $ + P - 2),
          e.closePath(),
          r("#ffffff", 4),
          m(_, $, R, P, 18),
          r("#ffffff", 4),
          (e.fillStyle = "#fff"),
          e.fillRect(A - 8, $ + P - 5, 16, 7),
          ge(15));
        let gV = e.measureText(pa.tourist).width + 22;
        (m(_ + 14, $ - 14, gV, 26, 12),
          r(Ds.tourist, 3),
          g(pa.tourist, _ + 14 + gV / 2, $ - 1, 15, "#ffffff"),
          g(o, _ + R / 2, $ + 32, 26),
          _ + R - 12,
          $ + P - 9);
        return;
      }
      if (!o) return;
      let s = zt(o, 820, 28),
        q = 36 + s.length * 34,
        d = b - q - 28;
      (At(40, d, c - 80, q, "#ffffff", 16), s.forEach((A, T) => g(A, c / 2, d + 30 + T * 34, 28, y, "center", 700)), c - 56, d + q - 10);
    }
    function Aq(l, o, i) {
      (e.save(),
        e.scale(i, i),
        m(-170, -62, 340, 124, 4),
        r("#ffffff", 2.5),
        g(l, 0, o ? -34 : -24, 19, "#2b3a67", "center", 700),
        o && g(o, 0, -10, 19, "#2b3a67", "center", 700),
        g("\u2014 The Guardians", 40, 20, 17, "#2b3a67", "center", 700),
        e.save(),
        e.translate(-115, 32),
        e.scale(0.4, 0.4),
        K2(),
        e.restore(),
        e.restore());
    }
    function K2() {
      ((e.strokeStyle = "#2b3a67"), (e.lineWidth = 5), X(0, 10, 40, 26), e.stroke());
      for (let [l, o, i] of [
        [-36, -28, 8],
        [-18, -40, 9],
        [2, -44, 10],
        [22, -40, 9],
        [38, -28, 8],
      ])
        (X(l, o, i * 0.8, i), e.stroke());
    }
    function gq(l, o) {
      if (l === "ch1site") {
        ((e.fillStyle = "rgba(20,24,32,.62)"),
          e.fillRect(0, 0, c, b),
          m(230, 180, 500, 280, 16),
          r("#fffdf8", 4),
          g("MOON PIES", 480, 230, 28, "#b45309", "center", 900),
          m(280, 280, 180, 70, 10),
          r("#ffffff", 3),
          g("Order new box", 370, 315, 18, y, "center", 800),
          m(500, 280, 200, 70, 10),
          r("#ffcf33", 3),
          g("Return empty crate", 600, 315, 16, y, "center", 800));
        return;
      }
      if (l === "ch1guard" || l === "ch1slip") {
        (e.fillStyle = "rgba(20,24,32,.62)"), e.fillRect(0, 0, c, b);
        let title = l === "ch1guard" ? "Brave Sasquatches" : "We know you're thinking",
          line2 = l === "ch1guard" ? "stay hidden." : "about going to Mars.",
          line3 = l === "ch1guard" ? "" : "Don't worry, we'll always be with you.";
        (e.save(),
          e.translate(480, 320),
          e.rotate(-0.02),
          m(-220, -180, 440, 360, 6),
          r("#fffdf8", 4),
          g(title, 0, line3 ? -70 : -40, 26, "#2b3a67", "center", 700),
          g(line2, 0, line3 ? -32 : 0, 26, "#2b3a67", "center", 700),
          line3 && g(line3, 0, 16, 20, "#2b3a67", "center", 700),
          g("\u2014 The Guardians", 40, line3 ? 70 : 50, 22, "#2b3a67", "center", 700),
          e.restore());
        return;
      }
      if (((e.fillStyle = "rgba(20,24,32,.62)"), e.fillRect(0, 0, c, b), l === "gbox4")) {
        (gq("gbox", !1), v2("gbox4x"), o && void 0);
        return;
      }
      if (l === "badge") {
        q5(o);
        return;
      }
      if (l === "gallery") {
        Jp();
        return;
      }
      if (l === "brochure") {
        i5(o);
        return;
      }
      if (l === "notice") {
        noticePanel();
        return;
      }
      if (!n5(l) && !$A(l) && !p6(l) && !v2(l)) {
        if (l === "sched") {
          (e.save(),
            e.translate(480, 320),
            e.rotate(-0.02),
            m(-200, -230, 400, 460, 8),
            r("#fffaf0", 5),
            F(0, -214, 9, "#e5533d"),
            g("DELIVERIES", 0, -170, 34, y, "center", 900),
            e.save(),
            e.translate(0, -70),
            rq(0, 0, 1.6),
            e.restore(),
            g("MOON PIES \xD7500", 0, 20, 28, "#b45309", "center", 900),
            g("EVERY WEEK", 0, 62, 22, y, "center", 800));
          for (let i = 0; i < 7; i++) (m(-168 + i * 48, 110, 40, 40, 4), r(i === 4 ? "#ffe27a" : "#ffffff", 2.5));
          (L(44, 130, 26),
            (e.strokeStyle = "#e5533d"),
            (e.lineWidth = 4),
            e.stroke(),
            g("TODAY", 44, 182, 18, "#e5533d", "center", 900),
            e.restore());
          return;
        }
        if (l === "crack") {
          (m(150, 40, 660, 540, 14),
            r("#1e2430", 0),
            e.save(),
            e.beginPath(),
            e.moveTo(300, 52),
            e.lineTo(680, 52),
            e.lineTo(730, 568),
            e.lineTo(250, 568),
            e.closePath(),
            e.clip(),
            (e.fillStyle = "#fff3d6"),
            e.fillRect(150, 40, 660, 540),
            (e.fillStyle = "#f6e3b8"),
            e.fillRect(150, 400, 660, 180),
            m(254, 70, 452, 60, 8),
            r("#3478f6", 3),
            g("WELCOME, BLEEP-BLOOP", 480, 88, 20, "#ffffff"),
            g("ROBOTICS DELEGATION!", 480, 112, 20, "#ffffff"));
          for (let i = 0; i < 6; i++)
            (e.save(),
              e.translate(320 + i * 70, 170 + (i % 2) * 20),
              e.rotate(n.T * (i % 2 ? 1 : -1)),
              m(-5, -3, 10, 6, 1),
              r(nV(["#ff5fa8", "#ffcf33", "#3478f6"]), 0),
              e.restore());
          (kf(330, 430, 0),
            Q2(410, 440),
            Qt(520, 450, "#ffb547", 2.1, -1),
            Qt(700, 470, "#ff8fc0", 1.5, -1),
            Qt(620, 456, "#7fd1ff", 1.9, -1),
            e.restore(),
            (e.fillStyle = "#4a3828"),
            e.beginPath(),
            e.moveTo(150, 40),
            e.lineTo(300, 52),
            e.lineTo(250, 568),
            e.lineTo(150, 580),
            e.closePath(),
            e.fill(),
            e.beginPath(),
            e.moveTo(810, 40),
            e.lineTo(680, 52),
            e.lineTo(730, 568),
            e.lineTo(810, 580),
            e.closePath(),
            e.fill(),
            m(150, 40, 660, 540, 14),
            r(null, 5),
            e.save(),
            m(150, 40, 660, 540, 14),
            e.clip(),
            Re(220, 680, 4.4, { f: 1 }),
            e.restore(),
            o && void 0);
          return;
        }
        if (l === "note") {
          (e.save(),
            e.translate(480, 320),
            e.rotate(-0.02),
            m(-210, -200, 420, 400, 6),
            r("#ffffff", 4),
            g("Brave Sasquatches", 0, -110, 28, "#2b3a67", "center", 700),
            g("stay hidden.", 0, -72, 28, "#2b3a67", "center", 700),
            g("\u2014 The Guardians", 50, 0, 26, "#2b3a67", "center", 700),
            e.save(),
            e.translate(-40, 110),
            K2(),
            e.restore(),
            e.beginPath(),
            e.moveTo(120, -205));
          for (let i = 1; i <= 16; i++) e.quadraticCurveTo(120 + i * 9 - 4, -205 + i * 10 + (i % 2 ? 7 : -7), 120 + i * 9, -205 + i * 10);
          ((e.lineCap = "round"),
            (e.strokeStyle = "#9aa3b2"),
            (e.lineWidth = 6),
            e.stroke(),
            (e.strokeStyle = "#ffffff"),
            (e.lineWidth = 3.4),
            e.stroke(),
            e.restore(),
            o && void 0);
          return;
        }
        if (l === "gbox") {
          (m(60, 110, 440, 460, 12), r("#3478f6", 5), m(80, 130, 400, 420, 8), r("#2b5fc4", 3));
          for (let A = 0; A < 10; A++) (m(108 + (A % 3) * 4, 420 - A * 5, 344, 124, 4), r("#ffffff", 2));
          (e.save(),
            e.translate(280, 450),
            e.rotate(0.03),
            Aq("Happy birthday, Squatch!", "", 1),
            e.restore(),
            e.save(),
            e.translate(280, 350),
            e.rotate(-0.04),
            Aq("Eat your veggies.", "", 1),
            e.restore());
          let i = Math.min(1, n.panelT / 0.7),
            s = 1 - (1 - i) * (1 - i);
          (e.save(),
            e.translate(280, 245 - (1 - s) * 260),
            e.rotate(0.01),
            Aq("Brave Sasquatches", "stay hidden.", 1),
            e.restore(),
            pq(420, 470 - (1 - s) * 300, 1.8, 0.5),
            e.save(),
            e.translate(530, 120),
            e.rotate(0.03),
            m(0, 0, 380, 430, 4),
            r("#fffdf3", 4),
            ge(40, 900),
            (e.fillStyle = "#e5533d"),
            (e.textAlign = "left"),
            (e.textBaseline = "middle"),
            Us("MY GARDIANS"),
            e.save(),
            e.translate(34, 54),
            e.rotate(-0.04),
            e.fillText("MY GARDIAN", 0, 0));
          let q = e.measureText("MY GARDIAN").width;
          (e.translate(q + 14, 2), e.scale(-1, 1), (e.textAlign = "center"), e.fillText("S", 0, 0), e.restore());
          let d = (A, T, R) => {
            (e.save(), e.translate(A, T), e.scale(R, R), (e.strokeStyle = y), (e.lineWidth = 3), (e.fillStyle = "#8b5a3c"), e.beginPath());
            for (let P = 0; P <= 16; P++) {
              let _ = (P / 16) * Math.PI * 2,
                $ = 30 + (P % 2 ? 5 : 0);
              e.lineTo(Math.cos(_) * $ * 0.8, -40 + Math.sin(_) * $ * 1.1);
            }
            (e.closePath(), e.fill(), e.stroke(), e.beginPath());
            for (let P = 0; P <= 14; P++) {
              let _ = (P / 14) * Math.PI * 2,
                $ = 18 + (P % 2 ? 4 : 0);
              e.lineTo(Math.cos(_) * $, -92 + Math.sin(_) * $);
            }
            (e.closePath(),
              e.fill(),
              e.stroke(),
              (e.fillStyle = "#f4c39a"),
              e.beginPath(),
              e.ellipse(0, -90, 11, 10, 0, 0, 7),
              e.fill(),
              F(-4, -92, 2.2, y),
              F(4, -92, 2.2, y),
              e.beginPath(),
              e.arc(0, -88, 5, 0.2, Math.PI - 0.2),
              e.stroke(),
              e.beginPath(),
              e.moveTo(-12, 0),
              e.lineTo(-14, 16),
              e.moveTo(12, 0),
              e.lineTo(14, 16),
              e.stroke(),
              e.restore());
          };
          (d(95, 340, 1.3),
            d(285, 340, 1.3),
            d(190, 360, 0.55),
            C([128, 290, 180, 318], "#8b5a3c", 6),
            C([200, 318, 252, 290], "#8b5a3c", 6),
            (e.strokeStyle = "#ff5fa8"),
            (e.lineWidth = 3),
            G2(190, 230, 30, 26),
            e.stroke(),
            g("by Squatch age 6", 270, 404, 18, "#3478f6", "center", 700),
            e.restore(),
            o && void 0);
          return;
        }
      }
    }
    function X2() {
      let l = [];
      (n.moPose !== "hidden" &&
        l.push({
          y: n.mo.y,
          d: () => {
            let s = n.moPose,
              q = s === "sway" ? Math.sin(n.T * 2.4) * 0.07 : 0,
              d = s === "pant" ? Math.abs(Math.sin(n.T * 9)) * 4 : 0;
            if (
              (Fe(n.mo.x, n.mo.y - d, wl, {
                f: n.mo.f,
                walk: n.mo.moving ? n.mo.walk : 0,
                mop: !1,
                eyes: s === "sleep" || s === "sway" ? "closed" : "",
                mouth: s === "yawn" || s === "pant" ? "o" : "",
                sway: q,
                headDown: s === "pant",
              }),
              s === "polish")
            ) {
              let A = Math.sin(n.T * 7);
              (e.save(),
                e.translate(n.mo.x - 6 * wl * n.mo.f, n.mo.y - 18 * wl),
                e.rotate(n.T * 3),
                C([-8 - 2 * A, 0, 8 + 2 * A, 0], "#ffcf33", 3),
                C([0, -8 - 2 * A, 0, 8 + 2 * A], "#ffcf33", 3),
                e.restore());
            }
            if (
              (n.chair && (m(580, 448, 126, 32, 10), r("#ff6a3d", 4)),
              s === "sleep" && g("z z z", n.mo.x + 40, n.mo.y - 160 + Math.sin(n.T * 2) * 4, 22, "#3478f6"),
              s === "pant")
            )
              for (let A of [-14, 14]) (X(n.mo.x + (60 + A) * n.mo.f, n.mo.y - 150 + ((n.T * 30 + A) % 20), 4, 6), r("#8fdcff", 1.5));
          },
        }),
        n.botOn &&
          l.push({
            y: n.bot.y,
            d: () => {
              (e.save(),
                n.botSkid > 0 &&
                  (e.translate(n.bot.x, n.bot.y), e.rotate(Math.sin(n.T * 30) * 0.25 * n.botSkid), e.translate(-n.bot.x, -n.bot.y)),
                hq(n.bot.x, n.bot.y, n.bot.f),
                e.restore());
              {
                let s = n.T - (n.botJump ?? -9);
                s < 0.9 &&
                  g("!", n.bot.x, n.bot.y - 75 * Y2() - (s < 0.35 ? Math.sin((s / 0.35) * Math.PI) * 14 : 0), 34, "#e5533d", "center", 900);
              }
              n.botSkid > 0.3 && g("!!", n.bot.x + 34, n.bot.y - 90, 24, "#e5533d", "center", 900);
            },
          }));
      let o = n.sq,
        i = n.sqPose;
      if (
        (i !== "under" &&
          l.push({
            y: i === "sit" || i === "sleep" ? 420 : o.y,
            d: () => {
              if (i === "sit" || i === "sleep") {
                let s = i === "sit" && n.ctrl && n.idle > 2.5,
                  q = (n.idle * 1.1) % 2.4;
                if (s && q < 0.5) {
                  let d = Math.sin((q / 0.5) * Math.PI);
                  (e.save(), (e.globalAlpha = d));
                  for (let A = 0; A < 4; A++) {
                    let T = (A * Math.PI) / 2 + n.T;
                    C(
                      [300 + Math.cos(T) * 4, 592 + Math.sin(T) * 4, 300 + Math.cos(T) * (10 + 6 * d), 592 + Math.sin(T) * (10 + 6 * d)],
                      "#ffcf33",
                      3,
                    );
                  }
                  (X(300, 594, 7, 4), r("#c98a4a", 2), e.restore());
                }
                (Re(205, 444 - (s ? Math.max(0, Math.sin(n.T * 5)) * 7 : 0), wl, { f: 1, eyes: i === "sleep" ? "closed" : "", legs: !1 }),
                  m(120, 422, 170, 28, 12),
                  r("#a98bff", 4),
                  i === "sleep" && g("z z z", 280, 290 - ((n.zzz * 16) % 30), 26, "#3478f6"));
              } else if (i === "ball") drawL2Ball(o.x, o.y - 16);
              else
                Re(o.x, o.y, wl, {
                  walk: o.moving ? o.walk : 0,
                  f: o.f,
                  singing: i === "sing",
                  carry: n.lunch === "held",
                  paper: !!n.holdNotice,
                  jacket: !!n.costumeOn,
                  goatBeard: !!n.costumeOn,
                  horns: !!n.costumeOn,
                });
            },
          }),
        l.sort((s, q) => s.y - q.y).forEach((s) => s.d()),
        n.pulse.has("sign") &&
          n.door < 0.3 &&
          (e.save(),
          (e.shadowColor = "#ffcf33"),
          (e.shadowBlur = 30),
          Ef(808, 268, 1.08),
          e.restore(),
          Ef(808, 268, 1)),
        n.botOn && n.coneIn)
      ) {
        let s = Math.sin(n.T * 1.6) * 60,
          q = n.bot.x - 30,
          d = n.bot.y - 60;
        (e.beginPath(),
          e.moveTo(q, d),
          e.lineTo(150 + s, 470),
          e.lineTo(260 + s, 590),
          e.closePath(),
          (e.fillStyle = "rgba(229,83,61,.32)"),
          e.fill(),
          (e.strokeStyle = "rgba(170,30,20,.85)"),
          (e.lineWidth = 2.5),
          e.stroke());
      }
      if (n.holdToy) {
        pq(n.sq.x, n.sq.y - 175 + Math.sin(n.T * 6) * 3, 1.6, 0.2);
        for (let s = 0; s < 3; s++) {
          let q = n.T * 2 + s * 2.1;
          g("\u2726", n.sq.x + Math.cos(q) * 46, n.sq.y - 180 + Math.sin(q) * 30, 16, "#ffcf33");
        }
      }
      if (n.found.has("crib") && n.scene === "S1") {
        (e.beginPath(),
          e.moveTo(536, 528),
          e.quadraticCurveTo(560, 518, 590, 526),
          e.lineTo(596, 560),
          e.quadraticCurveTo(588, 566, 580, 556),
          e.lineTo(574, 540),
          e.quadraticCurveTo(556, 536, 540, 546),
          e.closePath(),
          r("#ff9fc8", 2.5));
        for (let s = 0; s < 3; s++) F(552 + s * 12, 532, 2, "#ffffff");
      }
      n.gift &&
        (pointer("gift", 168, 362, 96, 52, 10),
        pq(190, 388, 0.8, -0.3),
        e.save(),
        e.translate(236, 392),
        e.rotate(0.15),
        m(-16, -11, 32, 22, 2),
        r("#ffffff", 3),
        C([-16, -11, 0, 2, 16, -11], y, 1.5),
        e.restore());
      for (let s of ea) ((e.globalAlpha = Math.min(1, s.t)), g(s.s, s.x, s.y, 30, s.c));
      e.globalAlpha = 1;
      for (let s of n.puffs)
        ((e.globalAlpha = Math.min(1, s.t)),
          s.s === "ha ha!" ? (X(s.x, s.y, 34, 16), r("#fff6dc", 2), g(s.s, s.x, s.y, 16, "#b45309")) : g(s.s, s.x, s.y, 28, "#ff5fa8"));
      e.globalAlpha = 1;
    }
    // Where a walk-tap is heading: a small ring on the floor while the player walks there.
    function drawWalkTo() {
      let t = n.walkTo;
      if (!t || de()) return;
      let k = 0.5 + 0.5 * Math.sin(n.T * 8),
        sx = t.x - (n.room === "hall" ? B.camX : 0);
      (e.save(), (e.globalAlpha = 0.7), X(sx, t.y, 16 + 4 * k, 7 + 2 * k), (e.lineWidth = 3), (e.strokeStyle = "#ffffff"), e.stroke(), e.restore());
    }
    // A tap was heard while the game could not take it yet: a ring spreads in the bottom right corner.
    function drawTapHeard() {
      let k = n.T - (n.tapT == null ? -9 : n.tapT);
      if (k < 0 || k > 0.45) return;
      (e.save(),
        (e.globalAlpha = 1 - k / 0.45),
        e.beginPath(),
        e.arc(c - 60, b - 60, 18 + 60 * k, 0, Math.PI * 2),
        (e.lineWidth = 6),
        (e.strokeStyle = "#ffcf33"),
        e.stroke(),
        e.restore());
    }
    // The room the player is in, drawn with nothing over it (E5 adds rings, people, bubbles and the rest).
    function drawRoom() {
      (n.room === "closet"
        ? (P2(), X2(), g5(), z2())
        : n.room === "deck"
          ? (jp(), z2())
          : n.room === "hall"
            ? s5()
            : n.room === "window"
              ? o5()
              : n.room === "duct"
                ? n.ch1Duct
                  ? drawCh1Duct()
                  : V5()
                : n.room === "gas"
                  ? JA()
                  : n.room === "diner"
                    ? ZA()
                    : n.room === "kitchen"
                      ? WA()
                      : n.room === "pad"
                        ? m6()
                        : n.room === "temple"
                          ? b6()
                          : n.room === "port"
                            ? P6()
                            : n.room === "stand"
                              ? Q6()
                              : n.room === "van"
                                ? Y6()
                                : n.room === "inside"
                                  ? I6()
                                  : n.room === "hangar"
                                    ? n.ch1D
                                      ? drawCh1Delivery()
                                      : e5()
                                    : x5());
    }
    function E5() {
      ((qq = 0), (mq = []), (ringsDrawn = []), (conesDrawn = []));
      let l = n.cur;
      if (l && l.k === "card") {
        M5(l.id, l.text, l.by, l);
        return;
      }
      if (n.egg) {
        yA();
        return;
      }
      if (l && l.k === "fb") {
        ((n.fbPic = l.pic), I2(l.pic, l.cap), k5());
        return;
      }
      if (l && l.k === "bub" && n.fbPic) {
        (I2(n.fbPic, ""), bq(l.b, !1));
        return;
      }
      (drawRoom(),
        ringsLeft(),
        xp(),
        drawSec(),
        drawWalkTo());
      for (let i of n.sparks)
        if (i.x !== 300 && i.s === "!") {
          let s = Math.sin(i.t * 14) * 4,
            q = Math.min(1, i.t * 2);
          ((e.globalAlpha = q),
            X(i.x, i.y + s, 26, 26),
            r("#ffcf33", 4),
            g("!", i.x, i.y + s, 40, "#e5533d", "center", 900),
            (e.globalAlpha = 1));
        } else
          i.x !== 300 &&
            ((e.globalAlpha = Math.min(1, i.t * 2)),
            g(i.s, i.x, i.y, 26, i.s === "\u2665" ? "#e5533d" : "#b45309", "center", 900),
            (e.globalAlpha = 1));
      (Ka > 0 && ((e.fillStyle = "rgba(20,24,32," + Math.min(1, Ka).toFixed(3) + ")"), e.fillRect(0, 0, c, b)), drawRoomLine(), t5());
      let o = Bs();
      // The green VERB pill for actions with no caption. An action with a caption gets drawCap's "VERB · thing" label instead.
      if (o && !o.cap && (o.x || o.r > 0 || n.room === "deck" || n.room === "hall") && !de() && n.live.length === 0) {
        let i = o.x === 790 || o.x === 845,
          s = i ? 845 : o.r > 0 || o.x ? o.x : n.sq.x,
          q = i ? 250 : o.r > 0 || o.x ? o.y - 60 : 330;
        ge(20);
        let d = e.measureText(o.verb).width + 28,
          A = w(q - 40, 96, b - 60),
          T = w(s - d / 2, 10, c - d - 10);
        ((n.room === "closet" && n.sqPose !== "under") || n.room === "deck" || n.room === "hall" || n.room === "window") &&
          (m(T, A, d, 34, 17), r("#2bc48a", 3), g(o.verb, T + d / 2, A + 17, 20, "#ffffff"));
      }
      (n.under === "crack" && gq("crack", !1),
        l && l.k === "panel" && gq(l.id, n.bt > 0.3),
        l && l.k === "bub" ? bq(l.b, !1) : !de() && n.live.length && bq(n.live[0], !0),
        window.__ss && (window.__ss.bubbleFrame = qq));
      ((e.globalAlpha = 1), zG(), drawTapHeard());
    }
    function zG() {
      if (!(ch2.dishT > 0) || n.room !== "kitchen" || de()) return;
      let A = ch2.dishN || 1;
      (m(150, 88, 660, 310, 18),
        r("#fffaf0", 4),
        g(A >= 3 ? "CLEAN DISH" : "DIRTY DISH", 480, 124, 26, "#1e2430", "center", 900),
        X(300, 220, 96, 36),
        r(A >= 3 ? "#ffffff" : "#f3ecdf", 3),
        A < 3 &&
          [0, 1, 2, 3, 4].slice(0, A === 1 ? 5 : 2).forEach((i) => {
            (X(268 + i * 16, 214 + (i % 2) * 10, 12, 7), r("#6b4a1c", 0));
          }),
        A >= 3 && g("CLEAN", 300, 218, 16, "#2bc48a", "center", 800),
        [
          [404, 196],
          [418, 188],
          [434, 188],
          [448, 198],
        ].forEach(([T, R]) => {
          (X(T, R, 9, 14), r("#8b5a3c", 2));
        }),
        L(424, 236, 32),
        r("#8b5a3c", 3),
        L(424, 240, 13),
        r("#e7b08a", 2),
        m(452, 198, 64, 50, 14),
        r("#c4922a", 3),
        m(458, 206, 52, 34, 10),
        r("#f2c14e", 2),
        [
          [470, 216],
          [486, 214],
          [478, 226],
          [494, 224],
        ].forEach(([T, R]) => {
          (L(T, R, 3.5), r("#8a5a1c", 0));
        }),
        C([448, 220, 468, 214], "#8b5a3c", 5),
        g("One paw. One sponge. Zero training.", 480, 300, 20, "#1e2430", "center", 800),
        g("SCRUB " + A + "/3", 480, 336, 26, "#b45309", "center", 900));
    }
    function I0(l) {
      l < 1 || l > Ca || startStory(l);
    }
    function startStory(l) {
      (qh(), l !== 1 && ((n.q = []), (n.cur = null), (n.stars = 0), (n.starOn = !0), l === 2 ? Ws() : l === 3 ? aq() : nq()));
    }
    let j2 = (l) => {
        if (
          (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "Backspace", "Tab"].indexOf(l.code) >= 0 && l.preventDefault(),
          VV(),
          l.code === "Escape" && p.state === "op" && N0())
        ) {
          Cs();
          return;
        }
        if (l.code === "KeyM") {
          W();
          return;
        }
        if (l.code === "Minus") {
          Z(z === 1 ? 0.5 : 0);
          return;
        }
        if (l.code === "Equal") {
          Z(z === 0 ? 0.5 : 1);
          return;
        }
        if (p.state === "title" && /^Digit[1-4]$/.test(l.code)) {
          I0(parseInt(l.code.slice(-1), 10));
          return;
        }
        (l.code === "KeyR" && !l.repeat && armReset(!0),
          (qe[l.code] = !0),
          !l.repeat && (l.code === "KeyE" ? Vf() : (l.code === "Enter" || l.code === "Space") && af()));
      },
      _2 = (l) => {
        ((qe[l.code] = !1), l.code === "KeyR" && armReset(!1));
      },
      F2 = () => {
        for (let l of Object.keys(qe)) qe[l] = !1;
        ((qt.active = !1), armReset(!1));
      };
    (window.addEventListener("keydown", j2), window.addEventListener("keyup", _2), window.addEventListener("blur", F2));
