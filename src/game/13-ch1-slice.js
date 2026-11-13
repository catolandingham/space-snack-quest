// Chapter 1 slice A: party first, dress-up, and the reusable bar cut-in.
    const CH1_DRESS_ZONES = ["head", "face", "body", "legs"];
    const CH1_DRESS_ITEMS = [
      { id: "tophat", zone: "head", label: "top hat" },
      { id: "shades", zone: "face", label: "sunglasses" },
      { id: "shirt", zone: "body", label: "shirt" },
      { id: "boots", zone: "legs", label: "boots" },
      { id: "scarf", zone: "extra", label: "scarf" },
      { id: "bow", zone: "extra", label: "bow tie" },
      { id: "nose", zone: "extra", label: "button nose" },
      { id: "pipe", zone: "extra", label: "pipe" },
    ];
    function ch1Day1() {
      J([
        N(() => {
          ((n.ch1Song = !0), (n.ctrl = !0), (n.moPose = "polish"), (n.scene = "Q1"), (n.ch1Chip = "Squatch: sing along with Mops"), chipNow());
        }),
      ]);
    }
    function ch1SingAlong() {
      ((n.ch1Song = !1), (n.ctrl = !1), (n.moPose = "stand"), (n.act = null), co());
      J([
        v("mops", "See you after work."),
        ch1Step("sq", 760, 500, 150),
        N(() => {
          ((n.moPose = "stand"),
            (n.mo.x = 620),
            (n.mo.y = 470),
            (n.ch1MopsLeave = 1),
            (n.ch1PeekReady = !0),
            (n.ctrl = !0),
            (n.scene = "Q1"),
            (n.ch1Chip = "Squatch: peek out the door"),
            chipNow());
        }),
      ]);
    }
    function ch1PeekSpots() {
      return [
        spot({
          id: "peek",
          verb: "PEEK",
          cap: "doorway",
          who: "sq",
          x: 890,
          y: 480,
          r: 160,
          f: ch1PeekGo,
        }),
      ];
    }
    function ch1PeekGo() {
      ((n.ch1PeekReady = !1), (n.ch1Chip = ""), (n.ctrl = !1), (n.act = null));
      ch1Go("hall", { who: "sq", scene: "QA" }, ch1SneakHide);
    }
    function ch1SneakHide() {
      ((n.ch1Party = !0), (n.scene = "QA"), (n.sparks = (n.sparks || []).filter((d) => d.s !== "\u2665")));
      J([
        ch1Step("sq", 480, 500, 160),
        ch1Step("sq", 220, 530, 160),
        N(() => {
          ((n.sqPose = "hidden"), (n.sq.x = 220), (n.sq.y = 530));
        }),
        v("official", "Welcome, everybody, to the Stormtop Space Party!"),
        v("official", "Let's give a big hello to our friends from Bleep-Bloop Robotics!"),
        v("official", "Soon their helper robots will be here, to help with the heavy work."),
        v("sq", "Robots?", "whisper"),
        v("official", "And now... put your hands together for the Croc Boys!"),
        N(() => {
          ((n.ch1Dim = !0), (n.ch1Dance = 2));
        }),
        uV(2),
        N(() => {
          n.ch1Dim = !1;
        }),
        v("sq", "I've never gotten to dance at a party.", "whisper"),
        N(() => ch1Go("closet", { who: "sq", scene: "Q1" }, ch1DressOpen)),
      ]);
    }
    function ch1DressOpen() {
      ((n.scene = "Q1"),
        (n.room = "closet"),
        (n.wardrobe = "open"),
        (n.ch1Party = !1),
        (n.ch1Dress = { on: !0, head: "", face: "", body: "", legs: "", extra: [] }),
        (n.ch1Veil = 1),
        (n.ch1VeilTo = 0),
        (n.ch1DressPop = 0),
        (n.sparks = (n.sparks || []).filter((d) => d.s !== "\u2665")),
        (n.ctrl = !0));
    }
    function ch1DressMeter() {
      let d = n.ch1Dress || {},
        zones = CH1_DRESS_ZONES.filter((z) => d[z]).length * 20,
        extra = Math.min(4, (d.extra || []).length) * 5;
      return Math.min(100, zones + extra);
    }
    function ch1DressSlot(i) {
      return { x: i < 4 ? 108 : 852, y: 150 + (i % 4) * 118 };
    }
    function ch1DressPut(id, quiet) {
      let item = CH1_DRESS_ITEMS.find((m) => m.id === id),
        d = n.ch1Dress;
      if (!item || !d) return;
      item.zone === "extra"
        ? d.extra.includes(id) || d.extra.push(id)
        : (d[item.zone] = id);
      quiet || ((n.ch1DressPop = 0.32), (n.ch1DressPopId = id), D.pickup());
    }
    function ch1DressShuffle() {
      (CH1_DRESS_ITEMS.forEach((m) => ch1DressPut(m.id, !0)), (n.ch1DressPop = 0.32), D.pickup());
    }
    function ch1DressSpots() {
      if (ch1DressMeter() < 100)
        return [
          spot({
            id: "shuffle",
            verb: "SHUFFLE",
            cap: "outfit",
            who: "sq",
            x: 460,
            y: 640,
            r: 400,
            f: () => {
              (ch1DressShuffle(), (n.act = null));
            },
          }),
        ];
      return [
        spot({
          id: "dressgo",
          verb: "GO",
          cap: "party",
          who: "sq",
          x: 480,
          y: 500,
          r: 520,
          f: ch1DressGo,
        }),
      ];
    }
    function ch1DressGo() {
      ((n.ctrl = !1), (n.act = null), (n.ch1Veil = n.ch1Veil || 0), (n.ch1VeilTo = 1));
      J([
        cV(() => (n.ch1Veil || 0) >= 1),
        N(() => {
          ((n.ch1Dress.on = !1),
            (n.ch1Disguise = !0),
            (n.ch1Outfit = { ...(n.ch1Dress) }),
            (n.wardrobe = "closed"),
            (n.ch1VeilTo = 0));
          ch1Go("hall", { who: "sq", scene: "QA" }, () => {
            ((n.ch1Party = !0),
              (n.ch1Disguise = !0),
              (n.ch1Flyer = !1),
              (n.ch1PartyOver = !1),
              (n.ch1PartyT = 0),
              (n.sqPose = "stand"),
              (n.ctrl = !0),
              (n.scene = "QA"));
          });
        }),
      ]);
    }
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
      if (n.ch1Dress && n.ch1Dress.on) return ch1DressPointer(kind, x, y);
      if (n.ch1Cut) return ch1BarPointer(kind, x, y);
    }
    function ch1GoBox(x, y) {
      return ch1DressMeter() >= 100 && x > 340 && x < 620 && y > 545 && y < 640;
    }
    function ch1DressPointer(kind, x, y) {
      if (kind === "down" && ch1GoBox(x, y)) return ch1DressGo();
      n.ch1DragX = x;
      n.ch1DragY = y;
      if (kind === "down") {
        let item = CH1_DRESS_ITEMS.find((m, i) => {
          let s = ch1DressSlot(i);
          return Math.hypot(x - s.x, y - s.y) < 46;
        });
        item && (n.ch1Drag = item.id);
      }
      if (kind === "up" && n.ch1Drag) {
        let onHim = Math.hypot(x - 480, y - 500) < 180,
          onSlot = CH1_DRESS_ITEMS.some((m, i) => {
            let s = ch1DressSlot(i);
            return m.id === n.ch1Drag && Math.hypot(x - s.x, y - s.y) < 46;
          });
        (onHim || onSlot) && ch1DressPut(n.ch1Drag);
        n.ch1Drag = "";
      }
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
        ? J([v("tourist", "...Nice gloves."), N(() => (n.ctrl = !1))])
        : ch1HatOff("bar");
    }
    function ch1SliceTick(dt) {
      if (n.ch1VeilTo != null && n.ch1Veil != null) {
        let step = (dt || 0) / 0.4;
        n.ch1Veil =
          n.ch1Veil < n.ch1VeilTo ? Math.min(n.ch1VeilTo, n.ch1Veil + step) : Math.max(n.ch1VeilTo, n.ch1Veil - step);
      }
      n.ch1DressPop > 0 && (n.ch1DressPop = Math.max(0, n.ch1DressPop - (dt || 0)));
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
    function drawCh1SliceParty() {
      (m(40, 80, 90, 70, 4),
        r("#fffaf0", 2),
        dq(70, 120, !1),
        g("COMING SOON!", 85, 145, 10, "#e5533d", "center", 900),
        m(200, 250, 70, 18, 4),
        r("#fffdf8", 2),
        g("Isfred", 235, 260, 11, "#1e2430", "center", 900),
        m(40, 300, 36, 28, 3),
        r("#e5533d", 2),
        g("FUR", 58, 312, 8, "#ffffff", "center", 900));
      n.ch1Dim &&
        ((e.fillStyle = "rgba(12,16,32,.45)"),
        e.fillRect(0, 0, c, b),
        [360, 460, 560].forEach((x, i) => {
          (Qt(x, 430 + Math.sin(n.T * 6 + i) * 6, "#7ad0c8", 1.4, i % 2 ? 1 : -1), m(x - 8, 470, 16, 6, 2), r("#e8a87c", 1));
        }));
    }
    function ch1DressIcon(id, x, y) {
      if (id === "tophat") (m(x - 16, y - 4, 32, 6, 2), r("#1e2430", 2), m(x - 8, y - 22, 16, 18, 2), r("#1e2430", 2));
      else if (id === "shades") (m(x - 16, y - 6, 32, 12, 3), r("#1e2430", 2), C([x - 2, y, x + 2, y], "#fffdf8", 2));
      else if (id === "shirt") (m(x - 14, y - 12, 28, 24, 4), r("#ff8a3d", 2), F(x - 6, y - 2, 3, "#2bc48a"), F(x + 6, y + 4, 3, "#3478f6"));
      else if (id === "boots") (m(x - 14, y - 8, 10, 16, 2), r("#3d4454", 2), m(x + 4, y - 8, 10, 16, 2), r("#3d4454", 2));
      else if (id === "scarf") (m(x - 16, y - 4, 32, 8, 3), r("#e5533d", 2), m(x + 6, y, 8, 16, 2), r("#e5533d", 2));
      else if (id === "bow") (m(x - 14, y - 6, 10, 12, 2), r("#3478f6", 2), m(x + 4, y - 6, 10, 12, 2), r("#3478f6", 2), F(x, y, 4, "#ffcf33"));
      else if (id === "nose") F(x, y, 8, "#e5533d");
      else (C([x - 10, y + 4, x + 8, y - 8], "#8b5a3c", 3), F(x + 10, y - 10, 5, "#6b6256"));
    }
    function drawCh1DressWorn(d) {
      let sc = 4.2;
      (e.save(), e.translate(480, 500), e.scale(sc, sc));
      d.legs === "boots" && (m(-7, -5, 5, 7, 1), r("#3d4454", 1.4), m(2, -5, 5, 7, 1), r("#3d4454", 1.4));
      (d.extra || []).includes("scarf") && (m(-10, -20, 20, 5, 2), r("#e5533d", 1.4), m(6, -18, 4, 12, 2), r("#e5533d", 1.4));
      (d.extra || []).includes("nose") && F(0, -28, 3.1, "#e5533d");
      (d.extra || []).includes("pipe") && (C([7, -25, 16, -30], "#8b5a3c", 1.6), F(17, -31, 2.2, "#6b6256"));
      d.head === "tophat" && (m(-10, -54, 20, 4, 1), r("#1e2430", 1.4), m(-5, -70, 10, 16, 1), r("#1e2430", 1.4));
      (d.extra || []).includes("bow") && (m(-8, -60, 7, 8, 1), r("#3478f6", 1.6), m(1, -60, 7, 8, 1), r("#3478f6", 1.6), F(0, -56, 2.6, "#ffcf33"));
      e.restore();
    }
    function drawCh1Dress() {
      let d = n.ch1Dress,
        pop = n.ch1DressPop || 0;
      ((e.fillStyle = "#fffdf8"),
        e.fillRect(0, 0, c, b),
        Re(480, 500, 4.2, { f: 1, shades: d.face === "shades", hawaiian: d.body === "shirt" }),
        drawCh1DressWorn(d),
        g("Disguised enough", 480, 52, 22, "#1e2430", "center", 900),
        m(300, 70, 360, 16, 6),
        r("#e6e0d4", 2),
        m(302, 72, 356 * (ch1DressMeter() / 100), 12, 5),
        r("#3478f6", 0));
      CH1_DRESS_ITEMS.forEach((mItem, i) => {
        let s = ch1DressSlot(i),
          worn = mItem.zone === "extra" ? (d.extra || []).includes(mItem.id) : d[mItem.zone] === mItem.id,
          hot = n.ch1DressPopId === mItem.id ? 1 + pop * 1.4 : 1;
        (e.save(),
          e.translate(s.x, s.y),
          e.scale(hot, hot),
          e.translate(-s.x, -s.y),
          F(s.x, s.y, 36, worn ? "#3478f6" : "#fffaf0"),
          e.beginPath(),
          e.arc(s.x, s.y, 36, 0, 7),
          (e.strokeStyle = worn ? "#1e2430" : "#8a93a3"),
          (e.lineWidth = worn ? 4 : 3),
          e.stroke(),
          ch1DressIcon(mItem.id, s.x, s.y),
          e.restore(),
          g(mItem.label, s.x, s.y + 52, 14, "#1e2430", "center", 800));
      });
      n.ch1Drag && ch1DressIcon(n.ch1Drag, n.ch1DragX || 480, n.ch1DragY || 360);
      ch1DressMeter() >= 100 && g("Go!", 480, 600, 28, "#3478f6", "center", 900);
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
