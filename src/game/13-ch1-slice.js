// Chapter 1 slice A: the older free play's snack bar cut-in, and the close-up arm Day 2 reuses.
    function ch1BarOpen() {
      ((n.ch1Cut = {
        id: "bar",
        zoom: 0,
        paw: { x: 480, y: 520 },
        held: "",
        bag: n.ch1Bag || 0,
        back: 5,
        glance: 0,
        face: 0,
        catches: 0,
        drag: !1,
      }),
        (n.ctrl = !1),
        (n.act = null));
    }
    function ch1CutSpots() {
      return [
        spot({
          id: "cutx",
          verb: "CLOSE",
          cap: "cut-in",
          who: "sq",
          x: n.sq.x,
          y: n.sq.y,
          r: 800,
          f: ch1CutClose,
        }),
      ];
    }
    function ch1CutClose() {
      ((n.ch1Bag = (n.ch1Cut && n.ch1Cut.bag) || 0), (n.ch1Cut = null), (n.ch1BarDone = !0), (n.ctrl = !0), (n.act = null));
    }
    function ch1SlicePointer(kind, x, y) {
      if (n.ch1Mini && kind === "down") return ch1MiniPointer(x, y);
      if (n.ch1Cut) return ch1BarPointer(kind, x, y);
    }
    function ch1BarPointer(kind, x, y) {
      let cut = n.ch1Cut;
      if (!cut || cut.zoom < 1) return;
      cut.paw = { x, y };
      if (kind === "down" && x > 760 && y > 490) return ch1CutClose();
      if (kind === "down") {
        let row = y < 250 ? "top" : y < 360 ? "mid" : "bottom";
        cut.held = row;
        cut.drag = !0;
      }
      if (kind === "up" && cut.held) {
        if (x < 180 && y > 460) {
          ((cut.bag += 1), (n.ch1Bag = cut.bag), D.hide());
          cut.held === "bottom" && !n.ch1Chain && ((n.ch1Chain = !0), (n.ch1Look = SNACK_LOOK_SECONDS), (n.ch1Spill = 1), D.splash(), ch1CutClose());
        } else cut.face > 0 && ch1BarCatch();
        cut.held = "";
        cut.drag = !1;
      }
    }
    function ch1BarCatch() {
      let cut = n.ch1Cut;
      if (!cut || !cut.held) return;
      cut.catches += 1;
      cut.held = "";
      cut.catches === 1
        ? J([v("tourist", "...Nice gloves."), N(() => (n.ctrl = !0))])
        : ch1HatOff("bar");
    }
    function ch1SliceTick(dt) {
      let cut = n.ch1Cut;
      if (!cut) return;
      cut.zoom < 1 && (cut.zoom = Math.min(1, cut.zoom + (dt || 0) / 0.5));
      cut.zoom >= 1 && !n.cur && (n.ctrl = !0);
      if (cut.zoom < 1 || cut.catches >= 2) return;
      cut.back > 0
        ? (cut.back -= dt || 0)
        : cut.glance > 0
          ? ((cut.glance -= dt || 0), cut.glance <= 0 && (cut.face = 2))
          : cut.face > 0
            ? ((cut.face -= dt || 0), cut.face <= 0 && (cut.back = 4 + Math.random() * 3))
            : (cut.glance = 1);
    }
    // The one close-up arm. Day 2's cut-ins call this same function. Do not draw a second copy.
    function drawPawArm(paw) {
      let p = paw || { x: 480, y: 580 },
        x = p.x,
        y = p.y,
        top = y + 20;
      e.save();
      e.beginPath();
      e.moveTo(x - 22, 662);
      for (let i = 1; i <= 8; i++) {
        let t = i / 8;
        e.lineTo(x + (i % 2 ? -48 : -28), 662 - (662 - top) * t);
      }
      e.lineTo(x + 26, top);
      for (let i = 8; i >= 1; i--) {
        let t = i / 8;
        e.lineTo(x + (i % 2 ? 50 : 30), 662 - (662 - top) * t);
      }
      (e.closePath(), (e.fillStyle = "#6b4428"), e.fill(), (e.lineWidth = 6), (e.strokeStyle = "#3a2416"), (e.lineJoin = "round"), e.stroke());
      [
        [0.08, -44, 6, "#e8c09a"],
        [0.17, -30, 13, "#c4895a"],
        [0.22, -50, 5, "#f4c39a"],
        [0.36, -26, 9, "#d9a06a"],
        [0.48, -46, 15, "#f0c49a"],
        [0.55, -32, 6, "#c4895a"],
        [0.69, -50, 10, "#e0b080"],
        [0.78, -24, 7, "#f4c39a"],
        [0.91, -40, 12, "#d7a070"],
        [0.11, 46, 11, "#f0c49a"],
        [0.24, 28, 6, "#e0b080"],
        [0.31, 52, 14, "#c4895a"],
        [0.46, 34, 8, "#f4c39a"],
        [0.6, 48, 5, "#d9a06a"],
        [0.73, 30, 12, "#e8c09a"],
        [0.86, 50, 7, "#c4895a"],
      ].forEach((tuft) => F(x + tuft[1], 652 - (652 - top) * tuft[0], tuft[2], tuft[3]));
      [[-26, -12], [-8, -22], [12, -22], [28, -10]].forEach(([dx, dy]) => {
        (e.beginPath(), e.ellipse(x + dx, y + dy, 13, 16, dx < 0 ? -0.35 : 0.35, 0, 7), (e.fillStyle = "#6b4428"), e.fill(), (e.strokeStyle = "#3a2416"), (e.lineWidth = 3), e.stroke(), F(x + dx, y + dy + 4, 5, "#f4c39a"));
      });
      (e.beginPath(), e.ellipse(x, y + 12, 24, 17, 0, 0, 7), (e.fillStyle = "#6b4428"), e.fill(), (e.strokeStyle = "#3a2416"), (e.lineWidth = 4), e.stroke(), e.beginPath(), e.ellipse(x, y + 16, 14, 9, 0, 0, 7), (e.fillStyle = "#f4c39a"), e.fill(), e.restore());
    }
    function drawBarSnack(kind, x, y, sc) {
      (e.save(), e.translate(x, y), e.scale(sc || 1, sc || 1));
      if (kind === "pie") (L(0, 0, 18), r("#e7c08a", 3), L(0, 0, 8), r("#6b3a1c", 0), C([-6, -2, 6, 2], "#fff3d6", 2));
      else if (kind === "cup") (m(-12, -16, 24, 28, 4), r("#8fdcff", 3), m(-14, -22, 28, 8, 3), r("#ffffff", 2));
      else if (kind === "cake") (m(-20, -12, 40, 24, 4), r("#fffdf8", 3), F(0, -18, 5, "#e5533d"), F(-8, -4, 3, "#3478f6"));
      else (L(0, 0, 16), r("#e5533d", 3), C([0, -14, 6, -24], "#3f8f4a", 3), F(-4, -2, 3, "#fff3d6"));
      e.restore();
    }
    function drawCh1Cut() {
      let cut = n.ch1Cut;
      if (!cut) return;
      let z = Math.min(1, cut.zoom || 0);
      (e.save(), (e.filter = "blur(6px)"), (e.globalAlpha = 0.92), e.drawImage(e.canvas, 0, 0), e.restore());
      (e.fillStyle = "rgba(12,16,28,.28)"), e.fillRect(0, 0, c, b);
      let shade = e.createRadialGradient(480, 300, 180, 480, 320, 620);
      (shade.addColorStop(0, "rgba(0,0,0,0)"), shade.addColorStop(1, "rgba(0,0,0,.45)"), (e.fillStyle = shade), e.fillRect(0, 0, c, b));
      e.save();
      e.globalAlpha = 0.35 + 0.65 * z;
      (m(120, 430, 720, 48, 10),
        r("#d7c4a3", 5),
        m(150, 478, 660, 22, 6),
        r("#b08968", 3),
        m(80, 80, 800, 360, 18),
        r("rgba(255,253,248,.18)", 0));
      let look = cut.face > 0;
      look
        ? Qt(760, 400, "#c9842a", 2.3, -1)
        : (m(724, 300, 72, 110, 16), r("#8a5a32", 4), L(760, 278, 28), r("#a56b3c", 4));
      [
        ["cake", 480, 250],
        ["cup", 456, 292],
        ["pie", 504, 292],
        ["apple", 432, 334],
        ["pie", 480, 334],
        ["cup", 528, 334],
        ["pie", 408, 382],
        ["apple", 456, 382],
        ["cake", 504, 382],
        ["cup", 552, 382],
      ].forEach((bit) => drawBarSnack(bit[0], bit[1], bit[2], 1));
      e.restore();
      let open = !!cut.drag;
      (m(24, 500, open ? 160 : 64, open ? 120 : 48, 10),
        r("#fffdf8", 4),
        g(String(cut.bag || 0), open ? 104 : 56, open ? 560 : 524, 22, "#1e2430", "center", 900),
        m(790, 510, 130, 56, 12),
        r("#ffcf33", 4),
        g("OK", 855, 538, 28, "#1e2430", "center", 900));
      let paw = cut.paw || { x: 200, y: 560 };
      (drawPawArm(paw), cut.held && drawBarSnack(cut.held === "bottom" ? "pie" : cut.held === "mid" ? "cup" : "cake", paw.x, paw.y - 8));
    }
