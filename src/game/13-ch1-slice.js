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
        v("mops", "See you after work."),
        ch1Step("mo", 900, 510, 180),
        N(() => {
          ((n.mo.x = 1200), (n.moPose = "hidden"), (n.ch1PeekReady = !0), (n.ctrl = !0), (n.scene = "Q1"));
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
          y: 500,
          r: 90,
          f: ch1PeekGo,
        }),
      ];
    }
    function ch1PeekGo() {
      ((n.ch1PeekReady = !1), (n.ctrl = !1), (n.act = null));
      ch1Go("hall", { who: "sq", scene: "QA" }, ch1SneakHide);
    }
    function ch1SneakHide() {
      ((n.ch1Party = !0), (n.scene = "QA"));
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
        (n.ctrl = !0));
    }
    function ch1DressMeter() {
      let d = n.ch1Dress || {},
        zones = CH1_DRESS_ZONES.filter((z) => d[z]).length * 20,
        extra = Math.min(4, (d.extra || []).length) * 5;
      return Math.min(100, zones + extra);
    }
    function ch1DressPut(id) {
      let item = CH1_DRESS_ITEMS.find((m) => m.id === id),
        d = n.ch1Dress;
      if (!item || !d) return;
      item.zone === "extra"
        ? d.extra.includes(id) || d.extra.push(id)
        : (d[item.zone] = id);
    }
    function ch1DressShuffle() {
      CH1_DRESS_ITEMS.forEach((m) => ch1DressPut(m.id));
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
            y: 510,
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
          x: 460,
          y: 510,
          r: 400,
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
      if (n.ch1Dress && n.ch1Dress.on) return ch1DressPointer(kind, x, y);
      if (n.ch1Cut) return ch1BarPointer(kind, x, y);
    }
    function ch1DressPointer(kind, x, y) {
      if (kind === "down") {
        let item = CH1_DRESS_ITEMS.find((m, i) => Math.hypot(x - (80 + (i % 4) * 70), y - (80 + Math.floor(i / 4) * 70)) < 28);
        item && (n.ch1Drag = item.id);
      }
      if (kind === "up" && n.ch1Drag) {
        Math.hypot(x - 480, y - 340) < 120 && ch1DressPut(n.ch1Drag);
        n.ch1Drag = "";
      }
    }
    function ch1BarPointer(kind, x, y) {
      let cut = n.ch1Cut;
      if (!cut || cut.zoom < 1) return;
      cut.paw = { x, y };
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
        Qt(860, 500, "#c9842a", 1.6, -1),
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
    function drawCh1Dress() {
      let d = n.ch1Dress;
      ((e.fillStyle = "#fffdf8"),
        e.fillRect(0, 0, c, b),
        Re(480, 400, 1.8, { f: 1, hat: d.head === "tophat", shades: d.face === "shades", hawaiian: d.body === "shirt" }),
        g("Disguised enough", 480, 40, 22, "#1e2430", "center", 900),
        m(280, 58, 400, 16, 6),
        r("#e6e0d4", 2),
        m(282, 60, 396 * (ch1DressMeter() / 100), 12, 5),
        r("#3478f6", 0));
      CH1_DRESS_ITEMS.forEach((mItem, i) => {
        let x = 80 + (i % 4) * 70,
          y = 80 + Math.floor(i / 4) * 70;
        (F(x, y, 18, "#cdbb98"), g(mItem.label, x, y + 28, 10, "#1e2430", "center", 800));
      });
      ch1DressMeter() >= 100 && g("Go!", 820, 520, 28, "#3478f6", "center", 900);
    }
    function drawCh1Cut() {
      let cut = n.ch1Cut;
      if (!cut) return;
      let z = cut.zoom || 0;
      ((e.save(),
        (e.filter = "blur(6px)"),
        (e.globalAlpha = 0.65),
        e.fillRect(0, 0, c, b),
        e.restore()),
        (e.fillStyle = "rgba(12,16,28,.35)"),
        e.fillRect(0, 0, c, b),
        Qt(760, 180, "#c9842a", 1.2, cut.face > 0 ? -1 : 1));
      for (let row = 0; row < 4; row++)
        for (let i = 0; i < 4 - row; i++) F(420 + i * 28 - row * 8, 160 + row * 46, 12, row === 3 ? "#e5533d" : "#ffcf33");
      (m(24, 500, cut.drag ? 150 : 50, cut.drag ? 110 : 40, 8),
        r("#fffdf8", 3),
        g(String(cut.bag || 0), 48, 520, 16, "#1e2430", "center", 900),
        L(880, 540, 32),
        r("#ffffff", 4),
        g("X", 880, 540, 28, "#1e2430", "center", 900));
      let paw = cut.paw || { x: 200, y: 560 };
      (C([40, 620, paw.x, paw.y], "#6b3a1c", 16), F(paw.x, paw.y, 18, "#6b3a1c"), z < 1 && (e.globalAlpha = z));
    }
