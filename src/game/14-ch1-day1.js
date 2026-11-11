// Day 1 beats that sit on the slice: the song, the party games, the chase, the search, the TV, bedtime.
    const CH1_DANCE_POINTS = 10,
      CH1_DANCE_SECONDS = 30,
      CH1_DANCE_NOTES = 30,
      CH1_HIT_X = 220,
      CH1_HOWLS_CAP = 50,
      CH1_HOWL_EACH = 5,
      CH1_CHASE_SECONDS = 10,
      CH1_OCT_SPEED = 90,
      CH1_GUARD_SPEED = 120;
    function ch1SongSpots() {
      return [
        spot({
          id: "song",
          verb: "SING",
          cap: "song",
          who: "sq",
          x: n.sq.x,
          y: n.sq.y,
          r: 800,
          hot: !0,
          f: ch1SingAlong,
        }),
      ];
    }
    function ch1SearchSpots() {
      return [
        spot({
          id: "hidebed",
          verb: "HIDE",
          cap: "bed",
          who: "sq",
          x: 205,
          y: 500,
          r: 700,
          hot: !0,
          f: ch1HideFromGuard,
        }),
      ];
    }
    function ch1SearchStart() {
      ((n.scene = "Q3"),
        (n.room = "closet"),
        (n.ch1Search = !0),
        (n.ctrl = !0),
        (n.sqPose = "stand"),
        (n.guard = { x: 900, y: 520, t: 0, seen: 0 }));
    }
    function ch1HideFromGuard() {
      ((n.sqPose = "under"), (n.sq.x = 205), (n.sq.y = 500), (n.ctrl = !1), (n.act = null), (n.ch1Search = !1));
      J([uV(1.2), N(() => ((n.guard = null), (n.sqPose = "stand"))), ...ch1Homecoming()]);
    }
    function ch1Homecoming() {
      return [
        N(() => {
          ((n.moPose = "stand"), (n.mo.x = 980), (n.mo.y = 520), (n.ctrl = !1));
        }),
        cV((dt) => mV(n.mo, 455, 560, 160, dt)),
        v("sq", "Everyone out there has someone."),
        v("mops", "You have me."),
        N(() => {
          n.tvOn = !0;
        }),
        { k: "panel", id: "ch1tv1" },
        { k: "panel", id: "ch1tv2" },
        { k: "panel", id: "ch1tv3" },
        cV((dt) => mV(n.sq, 205, 470, 160, dt) && mV(n.mo, 380, 460, 160, dt)),
        N(() => {
          ((n.sqPose = "sleep"), (n.sq.x = 205), (n.sq.y = 470), (n.mo.x = 380), (n.mo.y = 460));
        }),
        { k: "panel", id: "ch1moon" },
        N(() => {
          ((n.sqPose = "stand"), (n.moPose = "stand"), ch1PartyHome());
        }),
      ];
    }
    function ch1ExtraPartySpots() {
      if (!n.ch1Disguise || n.ch1PartyOver || n.ch1Mini) return [];
      return [
        spot({ id: "dance", verb: "DANCE", cap: "circle", who: "sq", x: 560, y: 470, r: 80, f: ch1DanceStart }),
        spot({ id: "singmic", verb: "SING", cap: "mic", who: "sq", x: 480, y: 280, r: 70, f: ch1KaraokeStart }),
        spot({ id: "conga", verb: "JOIN", cap: "conga", who: "sq", x: 360, y: 560, r: 70, f: ch1Conga }),
        spot({ id: "chicken", verb: "FLAP", cap: "chicken dance", who: "sq", x: 700, y: 430, r: 70, f: ch1Chicken }),
      ];
    }
    function ch1DanceStart() {
      let notes = [];
      for (let i = 0; i < CH1_DANCE_NOTES; i++) notes.push({ dir: "LDUR"[i % 4], at: 1.2 + i * 0.9, hit: !1 });
      ((n.ch1Mini = "dance"),
        (n.ctrl = !1),
        (n.act = null),
        (n.ch1Dance = { t: 0, notes, score: 0, cheer: 0 }));
    }
    function ch1DanceHit(dir) {
      let g = n.ch1Dance;
      if (!g) return;
      let note = g.notes.find((q) => !q.hit && q.dir === dir && Math.abs(ch1NoteX(q, g.t) - CH1_HIT_X) < 42);
      note && ((note.hit = !0), (g.score += CH1_DANCE_POINTS), (g.cheer = 0.4), D.pickup());
    }
    function ch1NoteX(note, t) {
      return 920 - (t - (note.at - 1.5)) * 460;
    }
    function ch1KaraokeStart() {
      ((n.ch1Mini = "karaoke"), (n.ctrl = !1), (n.act = null), (n.ch1Kara = { t: 0, howls: 0 }));
    }
    function ch1Howl() {
      n.ch1Kara && ((n.ch1Kara.howls += 1), lV(180 + (n.ch1Kara.howls % 5) * 40, 0.18, "sawtooth", 0.08, 0, 80));
    }
    function ch1MiniPointer(x, y) {
      if (n.ch1Mini === "dance") {
        [["L", 150], ["D", 310], ["U", 490], ["R", 670]].forEach(([dir, bx]) => {
          Math.hypot(x - bx, y - 560) < 48 && ch1DanceHit(dir);
        });
      }
      n.ch1Mini === "karaoke" && Math.hypot(x - 480, y - 540) < 80 && ch1Howl();
    }
    function ch1Conga() {
      ((n.ctrl = !1), (n.act = null), (n.ch1Conga = 4));
      J([
        ch1Step("sq", 360, 560, 160),
        ch1Step("sq", 520, 560, 160),
        ch1Step("sq", 680, 540, 160),
        N(() => {
          ((n.ch1Conga = 0), (n.ctrl = !0));
        }),
      ]);
    }
    function ch1Chicken() {
      ((n.ctrl = !1), (n.act = null), (n.ch1Chicken = 2.2));
      J([
        uV(2.2),
        N(() => {
          ((n.ch1Chicken = 0), (n.ctrl = !0));
        }),
      ]);
    }
    function ch1StartChase() {
      n.ch1OctChase ||
        ((n.ch1OctChase = !0),
        (n.ch1Oct = { x: (n.ch1Oct && n.ch1Oct.x) || 860, y: (n.ch1Oct && n.ch1Oct.y) || 555, t: 0 }),
        J([v("tourist", "*hic* Fellow tourist!"), v("sq", "I gotta juke this fool.", "whisper"), N(() => (n.ctrl = !0))]));
    }
    function ch1Day1Tick(dt) {
      let step = dt || 0;
      if (n.ch1Search && n.guard && n.ctrl && n.room === "closet") {
        let g = n.guard;
        g.t += step;
        let hidden = n.sqPose === "under" || n.sqPose === "hidden";
        hidden ? (g.seen += step) : (g.seen = 0);
        if (!hidden) {
          let dx = n.sq.x - g.x,
            dy = n.sq.y - g.y,
            dist = Math.hypot(dx, dy) || 1;
          ((g.x += (dx / dist) * CH1_GUARD_SPEED * step), (g.y += (dy / dist) * CH1_GUARD_SPEED * step));
          dist < 36 && ((n.sq.x = 760), (n.sq.y = 540), (g.x = 900), (g.y = 520), D.caught());
        }
        (g.seen > 2 || (hidden && g.t > 8)) && ch1HideFromGuard();
      }
      if (n.ch1Mini === "dance" && n.ch1Dance) {
        let g = n.ch1Dance;
        ((g.t += step), (g.cheer = Math.max(0, g.cheer - step)));
        g.t >= CH1_DANCE_SECONDS &&
          ((n.stars = (n.stars || 0) + g.score),
          (n.ch1Mini = ""),
          (n.ch1Dance = null),
          (n.ctrl = !0),
          D.open());
      }
      if (n.ch1Mini === "karaoke" && n.ch1Kara) {
        let g = n.ch1Kara;
        g.t += step;
        g.t >= 15 &&
          ((n.stars = (n.stars || 0) + Math.min(CH1_HOWLS_CAP, g.howls * CH1_HOWL_EACH)),
          (n.ch1Mini = ""),
          (n.ch1Kara = null),
          (n.ctrl = !0),
          D.open());
      }
      if (n.scene === "QA" && n.ch1Disguise && !n.ch1PartyOver && !n.ch1Mini && n.ctrl) {
        n.ch1Cheese = (n.ch1Cheese || 0) + step;
        n.ch1Flash > 0 && (n.ch1Flash -= step);
        if (n.ch1Cheese >= 6) ((n.ch1Cheese = 0), (n.ch1Flash = 0.2), !n.ch1Photo && ch1InFrame(n.sq.x, n.sq.y) && (n.ch1InShot = !0));
        !n.ch1OctChase &&
          n.ch1Flyer &&
          Math.hypot(n.sq.x - 860, n.sq.y - 555) < 150 &&
          ch1StartChase();
        if (n.ch1OctChase && n.ch1Oct && !n.ch1PartyOver) {
          let o = n.ch1Oct;
          o.t += step;
          let dx = n.sq.x - o.x,
            dy = n.sq.y - o.y,
            dist = Math.hypot(dx, dy) || 1;
          if (o.t < CH1_CHASE_SECONDS) {
            ((o.x += (dx / dist) * CH1_OCT_SPEED * step), (o.y += (dy / dist) * CH1_OCT_SPEED * step));
            dist < 48 && ((n.ch1OctChase = !1), ch1Hug());
          } else n.ch1OctChase = !1;
        }
        n.ch1Robot = (n.ch1Robot || 0) + step;
        n.ch1Robot > 20 && (n.ch1Robot = 0);
      }
    }
    function drawCh1Fest() {
      (m(390, 500, 70, 28, 6),
        r("#fffdf8", 3),
        F(425, 492, 16, "#ff8a3d"),
        F(410, 496, 8, "#e5533d"),
        F(440, 498, 7, "#3478f6"),
        L(560, 500, 54),
        r("rgba(255,207,51,.35)", 3));
      let left = 6 - (n.ch1Cheese || 0);
      left < 3 &&
        left > 0 &&
        (g(String(Math.ceil(left)), 820, 300, 28, "#e5533d", "center", 900), g("Say cheese!", 820, 332, 16, "#1e2430", "center", 800));
      n.ch1Flash > 0 && ((e.fillStyle = "rgba(255,255,255," + Math.min(0.85, n.ch1Flash * 4) + ")"), e.fillRect(0, 0, c, b));
    }
    function drawCh1Guard() {
      n.guard && drawCh1Alien(n.guard.x, n.guard.y, "hat", 2.1, n.sq.x < n.guard.x ? -1 : 1);
    }
    function drawCh1Mini() {
      if (n.ch1Mini === "dance") return drawCh1Dance();
      if (n.ch1Mini === "karaoke") return drawCh1Karaoke();
    }
    function drawCh1Dance() {
      let dance = n.ch1Dance;
      if (!dance) return;
      ((e.fillStyle = "rgba(12,16,32,.35)"), e.fillRect(0, 0, c, b), m(80, 250, 800, 80, 16), r("#1e2430", 4));
      (L(CH1_HIT_X, 290, 28), r("rgba(255,207,51,.9)", 4));
      dance.notes.forEach((note) => {
        if (note.hit) return;
        let x = ch1NoteX(note, dance.t);
        if (x < 40 || x > 980) return;
        g(note.dir === "L" ? "\u2190" : note.dir === "R" ? "\u2192" : note.dir === "U" ? "\u2191" : "\u2193", x, 290, 36, "#ffffff", "center", 900);
      });
      [["L", "\u2190", 150], ["D", "\u2193", 310], ["U", "\u2191", 490], ["R", "\u2192", 670]].forEach((b) => {
        (L(b[2], 560, 44), r("#ffffff", 4), g(b[1], b[2], 560, 40, "#1e2430", "center", 900));
      });
      g(String(dance.score), 860, 80, 28, "#ffcf33", "center", 900);
    }
    function drawCh1Karaoke() {
      let kara = n.ch1Kara;
      if (!kara) return;
      ((e.fillStyle = "#1b2140"),
        e.fillRect(0, 0, c, b),
        [300, 420, 540, 660].forEach((x, i) => drawCh1Alien(x, 470, ["hair", "hat", "spots", "croc"][i], 1.5, 1)),
        Re(480, 620, 3.2, { f: 1, hat: !0, shades: !0, hawaiian: !0 }));
      let line = kara.t < 7.5 ? "Ay-ay-ay-ay, I love my Moon Pies!" : "Round and chocolate-y, sweet as the starry skies!";
      (g(line, 480, 120, 28, "#ffffff", "center", 900),
        L(480, 540, 70),
        r("#ffcf33", 5),
        g("Sing", 480, 540, 28, "#1e2430", "center", 900));
    }
    function drawCh1Tv(id) {
      ((e.fillStyle = "#1b2140"), e.fillRect(0, 0, c, b));
      if (id === "ch1tv1") (Re(300, 460, 2.2, { f: 1 }), Re(520, 440, 2, { f: -1 }), g("Fur in the scrubber.", 480, 120, 28, "#ffffff", "center", 800));
      if (id === "ch1tv2") (Qt(420, 460, "#f2c1b0", 2, 1), g("!", 480, 200, 64, "#e5533d", "center", 900));
      if (id === "ch1tv3") (Qt(260, 460, "#c9b6f2", 2.4, 1), Re(560, 480, 1.8, { f: -1 }), g("Onto the ship.", 480, 120, 28, "#ffffff", "center", 800));
    }
    function drawCh1Moon() {
      ((e.fillStyle = "#2a241c"),
        e.fillRect(0, 0, c, b),
        Xn(360, 420, 200, 120, ""),
        Re(520, 400, 1.2, { f: 1, eyes: "closed" }),
        Fe(250, 480, 2, { f: 1 }),
        g("You came to me in a Moon Pie crate.", 480, 120, 26, "#fffdf8", "center", 800),
        g("You've loved Moon Pies ever since.", 480, 160, 22, "#fffdf8", "center", 700));
    }
