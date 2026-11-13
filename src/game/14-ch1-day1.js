// Day 1 beats that sit on the slice: the song, the party games, the chase, the search, the TV, bedtime.
    const CH1_DANCE_POINTS = 10,
      CH1_DANCE_SECONDS = 30,
      CH1_DANCE_NOTES = 30,
      CH1_HIT_X = 220,
      CH1_HOWLS_CAP = 50,
      CH1_HOWL_EACH = 5,
      CH1_CHASE_SECONDS = 10,
      CH1_OCT_SPEED = 90,
      CH1_GUARD_SPEED = 120,
      CH1_HOME_DOOR = { x: 480, y: 590 },
      CH1_ALARM_AT = { x: 800, y: 430 },
      CH1_GUARD_IN = { x: 948, y: 360 };
    function ch1RaidBegin() {
      let spots = CH1_GUESTS.find((g) => g[2] === "spots") || [520, 610, "spots"];
      ((n.ch1Fur = !1),
        (n.ctrl = !0),
        (n.ch1Raid = {
          phase: "witness",
          witness: { x: spots[0], y: spots[1], x0: spots[0], y0: spots[1] },
          guards: [],
          doorT: 0,
          left: !1,
        }));
    }
    function ch1GuardSees(g) {
      return (
        Math.hypot(n.sq.x - g.x, n.sq.y - g.y) < STAND_FEET ||
        vt(n.sq.x, n.sq.y - 20, g.x, g.y - 28, g.face, STAND_CONE_HALF, STAND_CONE_LEN)
      );
    }
    function ch1RaidHome() {
      let r = n.ch1Raid;
      if (!r || r.left) return;
      ((r.left = !0), (n.ch1Party = !1), (n.ch1Raid = null), (n.ctrl = !1), ch1Go("closet", { who: "sq", scene: "Q3" }, ch1SearchStart));
    }
    function ch1RaidTick(dt) {
      let r = n.ch1Raid;
      if (!r || r.left || n.room !== "hall") return;
      let step = dt || 0,
        hidden = n.sqPose === "hidden" || n.sqPose === "under",
        atDoor = Math.hypot(n.sq.x - CH1_HOME_DOOR.x, n.sq.y - CH1_HOME_DOOR.y) < 48,
        stick = oh(),
        steering = !!n.walkTo || Math.hypot(stick.x, stick.y) > 0.2;
      if (!steering && !hidden && !atDoor) (mV(n.sq, CH1_HOME_DOOR.x, CH1_HOME_DOOR.y, 260, step), ch1Trail());
      if (r.phase === "witness") {
        mV(r.witness, CH1_ALARM_AT.x, CH1_ALARM_AT.y, 420, step) &&
          ((r.phase = "search"), D.alarm(), r.guards.push({ x: CH1_GUARD_IN.x, y: CH1_GUARD_IN.y, t: 0, face: Math.PI }));
        return;
      }
      r.guards[0] && (r.guards[0].t += step);
      r.guards.length < 2 && r.guards[0] && r.guards[0].t > 0.4 && r.guards.push({ x: CH1_GUARD_IN.x, y: CH1_GUARD_IN.y, t: 0, face: Math.PI });
      let safe = hidden || atDoor;
      for (let g of r.guards) {
        let tx = safe ? CH1_HOME_DOOR.x : n.sq.x,
          ty = safe ? CH1_HOME_DOOR.y : n.sq.y;
        (mV(g, tx, ty, CH1_GUARD_SPEED, step), (g.face = Math.atan2(ty - 20 - (g.y - 28), tx - g.x)));
        if (!safe && ch1GuardSees(g)) {
          ((n.ch1Raid = null), capture("s6"));
          return;
        }
      }
      let lead = r.guards[0];
      safe && lead && Math.hypot(lead.x - CH1_HOME_DOOR.x, lead.y - CH1_HOME_DOOR.y) < 28 ? (r.doorT += step) : (r.doorT = 0);
      r.doorT >= 0.5 && ch1RaidHome();
    }
    function ch1RaidSpots() {
      return [
        spot({
          id: "raidhide",
          verb: "HIDE",
          cap: "plant",
          who: "sq",
          x: 220,
          y: 530,
          r: 80,
          f: () => {
            ((n.sqPose = "hidden"), (n.sq.x = 220), (n.sq.y = 530), (n.act = null));
          },
        }),
      ];
    }
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
          ((n.tvOn = !0), (n.ch1Couch = !0), (n.sq.x = 640), (n.sq.y = 545), (n.mo.x = 520), (n.mo.y = 545), (n.sqPose = "stand"), (n.moPose = "stand"));
        }),
        { k: "panel", id: "ch1tv1" },
        { k: "panel", id: "ch1tv2" },
        { k: "panel", id: "ch1tv3" },
        N(() => {
          n.ch1Couch = !1;
        }),
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
        spot({ id: "dance", verb: "DANCE", cap: "circle", who: "sq", x: 500, y: 530, r: 80, f: ch1DanceStart }),
        spot({ id: "singmic", verb: "SING", cap: "mic", who: "sq", x: 400, y: 320, r: 70, f: ch1KaraokeStart }),
        spot({ id: "conga", verb: "JOIN", cap: "conga", who: "sq", x: 320, y: 560, r: 70, f: ch1Conga }),
        spot({ id: "chicken", verb: "FLAP", cap: "chicken dance", who: "sq", x: 600, y: 540, r: 70, f: ch1Chicken }),
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
          Math.hypot(x - bx, y - 610) < 48 && ch1DanceHit(dir);
        });
      }
      n.ch1Mini === "karaoke" && Math.hypot(x - 760, y - 560) < 64 && ch1Howl();
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
      ch1RaidTick(step);
      if (n.ch1MopsLeave && n.ch1PeekReady && n.room === "closet" && n.moPose !== "hidden") {
        mV(n.mo, 880, 458, 160, step) && ((n.moPose = "hidden"), (n.mo.x = 880), (n.mo.y = 458), (n.ch1MopsLeave = 0));
      } else if (n.ch1MopsLeave && !n.ch1PeekReady) n.ch1MopsLeave = 0;
      if (n.ch1Search && n.guard && n.room === "closet" && (n.ctrl || n.ch1Escort)) {
        let g = n.guard;
        g.t += step;
        let hidden = n.sqPose === "under" || n.sqPose === "hidden";
        hidden ? (g.seen += step) : (g.seen = 0);
        if (n.ch1Escort) {
          let home = mV(n.sq, 760, 540, 190, step),
            back = mV(g, 900, 520, CH1_GUARD_SPEED, step);
          ((n.sqPose = "stand"), (n.ctrl = !1), home && back && ((n.ch1Escort = !1), (n.ctrl = !0)));
        } else if (n.ctrl && !hidden) {
          let dx = n.sq.x - g.x,
            dy = n.sq.y - g.y,
            dist = Math.hypot(dx, dy) || 1;
          ((g.x += (dx / dist) * CH1_GUARD_SPEED * step), (g.y += (dy / dist) * CH1_GUARD_SPEED * step));
          dist < 36 && ((n.ch1Escort = !0), (n.ctrl = !1), D.caught());
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
        !n.ch1Cut &&
          !n.ch1OctChase &&
          n.ch1Flyer &&
          Math.hypot(n.sq.x - 760, n.sq.y - 555) < 150 &&
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
      (m(500, 500, 70, 28, 6),
        r("#fffdf8", 3),
        F(535, 492, 16, "#ff8a3d"),
        F(520, 496, 8, "#e5533d"),
        F(550, 498, 7, "#3478f6"),
        L(500, 540, 40),
        r("rgba(255,207,51,.28)", 3));
      let left = 6 - (n.ch1Cheese || 0);
      left < 3 &&
        left > 0 &&
        (g(String(Math.ceil(left)), 820, 300, 28, "#e5533d", "center", 900), g("Say cheese!", 820, 332, 16, "#1e2430", "center", 800));
      n.ch1Flash > 0 && ((e.fillStyle = "rgba(255,255,255," + Math.min(0.85, n.ch1Flash * 4) + ")"), e.fillRect(0, 0, c, b));
    }
    function drawCh1Guard() {
      n.guard && drawCh1Alien(n.guard.x, n.guard.y, "hat", ALIEN_ADULT, n.sq.x < n.guard.x ? -1 : 1);
    }
    function drawCh1Mini() {
      if (n.ch1Mini === "dance") return drawCh1Dance();
      if (n.ch1Mini === "karaoke") return drawCh1Karaoke();
    }
    function drawCh1Dance() {
      let dance = n.ch1Dance;
      if (!dance) return;
      (m(40, 548, 880, 52, 14), r("#1e2430", 4));
      (L(CH1_HIT_X, 574, 22), r("rgba(255,207,51,.95)", 4));
      dance.notes.forEach((note) => {
        if (note.hit) return;
        let x = ch1NoteX(note, dance.t);
        if (x < 40 || x > 980) return;
        g(note.dir === "L" ? "\u2190" : note.dir === "R" ? "\u2192" : note.dir === "U" ? "\u2191" : "\u2193", x, 574, 32, "#ffffff", "center", 900);
      });
      [["L", "\u2190", 150], ["D", "\u2193", 310], ["U", "\u2191", 490], ["R", "\u2192", 670]].forEach((b) => {
        (L(b[2], 610, 36), r("#ffffff", 4), g(b[1], b[2], 610, 32, "#1e2430", "center", 900));
      });
      g(String(dance.score), 880, 520, 26, "#b45309", "center", 900);
    }
    function drawCh1Karaoke() {
      let kara = n.ch1Kara;
      if (!kara) return;
      let line = kara.t < 7.5 ? "Ay-ay-ay-ay, I love my Moon Pies!" : "Round and chocolate-y, sweet as the starry skies!";
      (m(70, 28, 820, 52, 14),
        r("#fffdf8", 4),
        g(line, 480, 54, 24, "#1e2430", "center", 900),
        e.save(),
        e.translate(480, 650),
        m(-78, -36, 156, 48, 18),
        r("#ff8a3d", 4),
        L(0, -78, 46),
        r("#6b4428", 5),
        F(-34, -84, 12, "#d98c62"),
        F(34, -84, 12, "#d98c62"),
        m(-36, -128, 72, 14, 4),
        r("#1e2430", 3),
        m(-18, -164, 36, 38, 4),
        r("#1e2430", 3),
        e.restore(),
        L(760, 560, 54),
        r("#ffcf33", 5),
        g("Sing", 760, 560, 24, "#1e2430", "center", 900));
    }
    function drawCh1Tv(id) {
      (m(170, 78, 620, 250, 16), r("#1e2430", 6), m(190, 96, 580, 214, 8), r("#d7ecf5", 0));
      if (id === "ch1tv1") (Re(360, 270, 1.5, { f: 1 }), Re(560, 260, 1.4, { f: -1 }), g("Fur in the scrubber.", 480, 130, 22, "#1e2430", "center", 800));
      if (id === "ch1tv2") (Qt(460, 270, "#f2c1b0", 1.6, 1), g("!", 560, 180, 48, "#e5533d", "center", 900));
      if (id === "ch1tv3") (Qt(340, 270, "#c9b6f2", 1.7, 1), Re(560, 280, 1.3, { f: -1 }), g("Onto the ship.", 480, 130, 22, "#1e2430", "center", 800));
    }
    function drawCh1Moon() {
      (m(150, 48, 660, 78, 16),
        r("#fffdf8", 4),
        g("You came to me in a Moon Pie crate.", 480, 72, 22, "#1e2430", "center", 800),
        g("You've loved Moon Pies ever since.", 480, 104, 18, "#1e2430", "center", 700));
    }
