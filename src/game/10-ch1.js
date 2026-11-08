// Chapter 1, part 1 (scenes O0 to O9, S1, S1L): the opening in the closet and lobby, the lunch, the deck, and the Chapter 1 goal chips.
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
            (chipNow(), (n.ctrl = !0), (n.moved = 0));
          }),
          cV(() => n.moved > 110),
          N(() => {
            ((n.ctrl = !1), (n.sq.moving = !1));
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
                cap: "song",
                at: [n.sq.x, n.sq.y - 150],
                hot: !0,
                f: () => {
                  ((n.act = null),
                    (n.ctrl = !1),
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
              chipNow(),
              (n.act = offer({
                id: "door",
                verb: "PEEK",
                cap: "door",
                who: "sq",
                x: 790,
                y: 470,
                r: 95,
                f: () => {
                  ((n.act = null),
                    (n.ctrl = !1),
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
          v("sq", "...Everybody has somebody."),
          N(() => {
            ((n.under = ""), (n.scene = "O3b"), n.pulse.add("sign"), n.pulse.add("door"));
          }),
          v("sq", "Sorry, sign.", "whisper"),
          N(() => {
            ((n.ctrl = !0), (n.idle = 0), (n.act = sneakOut()));
          }),
        ])),
        l === "note" &&
          J([
            v("sq", "The Guardians came!"),
            N(() => {
              (chipNow(),
                n.pulse.add("gbox"),
                (n.ctrl = !0),
                (n.act = offer({
                  id: "gbox",
                  verb: "OPEN",
                  cap: "Guardian Box",
                  who: "sq",
                  x: 350,
                  y: 545,
                  r: 95,
                  f: () => {
                    ((n.act = null),
                      (n.ctrl = !1),
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
    // O3b: the closet door, SNEAK OUT. Offered after the peek, and again after "They lost you." (D15).
    function sneakOut() {
      return offer({
        id: "door",
        verb: "SNEAK OUT",
        cap: "door",
        who: "sq",
        x: 790,
        y: 470,
        r: 95,
        hot: !0,
        f: () => {
          ((n.act = null), (n.ctrl = !1), n.pulse.clear(), (n.glowT = -1), (n.doorGlow = 0), ch());
        },
      });
    }
    // O4, the night out (D15, Brian 2026-11-07). Squatch sneaks into the lobby to find out what is going on.
    // A brochure table holds a notice: robot janitors are coming. The vent's pull and three sightlines stand
    // between the closet and the table. Near the vent a tuft of his fur drifts toward it (the warning); if he
    // stays in the pull for PULL_BITE seconds the fur goes in and the alarm sounds. A sighting or the vent alarm
    // brings security under the one capture rule: HIDE! runs him into the closet ("They lost you."), and if a
    // guard reaches him first the LOCKUP card shows and the night starts over (CH1_CHECKPOINTS.O4).
    const LOBBY_VENT = { x: 650, y: 450, r: 80 },
      LOBBY_TABLE = { x: 770, y: 250 },
      PULL_BITE = 1.5,
      TABLE_SEEN = 260;
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
        (n.sec = { x: 480, y: 40 }),
        (n.door = 0),
        (n.puffs = []),
        (n.hopTo = null),
        (n.pull = 0),
        (n.sawTable = !1),
        (n.noticeRead = !1),
        (n.holdNotice = !1),
        (n.lobbyBy = ""),
        (n.act = null),
        n.pulse.clear(),
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
    // Who shouts what when a lobby watcher sees Squatch, and the captor for the LOCKUP card (25-capture.js).
    const LOBBY_SEEN = {
      L: { who: "kid", shout: "DADDY! A BIG DOG!", by: "lobbykid" },
      U: { who: "exec", shout: "Was that... FUR?", by: "lobbyexec" },
      R: { who: "demo", shout: "Fur! Near my snacks!", by: "lobbyclerk" },
    };
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
        (n.lobbyBy = LOBBY_SEEN[l].by),
        kV(LOBBY_SEEN[l].who, LOBBY_SEEN[l].shout));
      let o = l === "R" ? { x: 860, y: 440 } : l === "L" ? { x: 210, y: 400 } : { x: 410, y: 230 };
      ((n.runner = { k: l, x: o.x, y: o.y, v: Math.hypot(o.x - je.x, o.y - je.y + 20) / 2, pulled: -1 }),
        kV("sq", "Gulp."),
        (n.hopTo = { x: w(n.sq.x + (480 - n.sq.x) * 0.3, 120, 840), y: w(n.sq.y + (560 - n.sq.y) * 0.3, 300, 560) }),
        (n.act = dh()));
    }
    // HIDE! works anywhere while security is coming: Squatch runs into the closet. With the notice read, the
    // night out is over (O5); without it, security loses him and he can try again.
    function hideHome() {
      return spot({
        id: "cdoor",
        verb: "HIDE!",
        cap: "closet",
        who: "sq",
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
                ((n.sq.moving = !1), D.hide(), n.noticeRead ? Gs(!0) : lobbyLost());
              }),
            ]));
        },
      });
    }
    function dh() {
      return offer(hideHome());
    }
    // Hidden in the closet before security reached him: they lose him, and the door is there to try again.
    function lobbyLost() {
      ((n.scene = "O3b"),
        (n.room = "closet"),
        (n.lg = []),
        (n.runner = null),
        (n.looked = !1),
        (n.secOn = !1),
        (n.pull = 0),
        (n.sirenT = -9),
        (n.live = []),
        (vV = []),
        (n.sq = { x: 660, y: 520, f: 1, walk: 0, moving: !1 }),
        (n.sqPose = "stand"),
        n.pulse.clear(),
        n.pulse.add("door"),
        lostYou(),
        (n.idle = 0),
        (n.ctrl = !0),
        (n.act = sneakOut()));
    }
    // The lobby's spots: READ the notice at the table, then ENTER the closet. While security is coming, HIDE!.
    function o4Spots() {
      return n.runner || n.looked
        ? [hideHome()]
        : [
            spot({
              id: "notice",
              verb: "READ",
              cap: "notice",
              who: "sq",
              x: LOBBY_TABLE.x,
              y: LOBBY_TABLE.y + 50,
              r: 80,
              at: [LOBBY_TABLE.x, LOBBY_TABLE.y - 90],
              when: !n.noticeRead,
              hot: !0,
              f: readNotice,
            }),
            spot({ id: "home", verb: "ENTER", cap: "closet", who: "sq", x: 480, y: 575, r: 90, at: [480, 570], when: !!n.noticeRead, hot: !0, f: goHome }),
          ];
    }
    function readNotice() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        n.pulse.delete("notice"),
        J([
          { k: "panel", id: "notice" },
          N(() => {
            ((n.noticeRead = !0), (n.holdNotice = !0), D.grab());
          }),
          v("sq", "Robot janitors? Mops is a janitor.", "whisper"),
          N(() => {
            (n.pulse.add("home"), (n.ctrl = !0), chipNow());
          }),
        ]));
    }
    function goHome() {
      ((n.act = null),
        (n.ctrl = !1),
        n.pulse.delete("home"),
        J([
          cV((l) => mV(n.sq, 480, 585, 190, l)),
          N(() => {
            ((n.sq.moving = !1), D.hide(), Gs(!0));
          }),
        ]));
    }
    // The vent's pull: inside the circle the tuft drifts toward the grille; out of it the tuft drifts back.
    function inPull(o = n.sq) {
      return Math.hypot(o.x - LOBBY_VENT.x, o.y - LOBBY_VENT.y) < LOBBY_VENT.r;
    }
    // The fur went in: the alarm sounds and security comes, as for a sighting.
    function ventAlarm() {
      ((n.pull = 0), (n.furVent = !0), (n.lobbyBy = "lobbyvent"), (n.sirenT = n.T), fq(LOBBY_VENT.x, LOBBY_VENT.y), kV("pa", "FUR IN THE VENT!"), Np(!1));
    }
    // A lobby watcher sees what its drawn cone covers: the wedge itself. (The old check let the kid's and the
    // clerk's own bodies block their whole cone, so only the man in the suit ever saw anything.)
    function lobbySees(px, py, c) {
      let dx = px - c.ox,
        dy = py - c.oy,
        d = Math.hypot(dx, dy);
      if (d > c.len || d < 1) return !1;
      let a = Math.atan2(dy, dx) - c.a;
      for (; a > Math.PI;) a -= 2 * Math.PI;
      for (; a < -Math.PI;) a += 2 * Math.PI;
      return Math.abs(a) < c.half;
    }
    // Lobby drawing for the night out (called from x5 in 60-frame-draw.js).
    // The snack counter on the right wall: the clerk works in front of it, and nobody walks behind it.
    function lobbyCounter() {
      (m(868, 330, 100, 150, 6), r("#ffb547", 3), m(862, 320, 110, 16, 4), r("#ffffff", 3), g("SNACKS", 914, 356, 14, y, "center", 900));
      for (let k = 0; k < 3; k++) (m(878 + k * 24, 296, 18, 24, 3), r(["#e5533d", "#3478f6", "#2bc48a"][k], 2));
    }
    // The brochure table, with the notice standing on it. Labelled NOTICE so the chip's word is on screen.
    function lobbyTable() {
      let t = LOBBY_TABLE;
      (C([t.x - 48, t.y - 14, t.x - 48, t.y + 12], y, 4), C([t.x + 48, t.y - 14, t.x + 48, t.y + 12], y, 4), m(t.x - 58, t.y - 30, 116, 16, 4), r("#c9b28a", 3));
      for (let k = 0; k < 3; k++) (m(t.x - 52 + k * 17, t.y - 42 + (k % 2) * 3, 14, 13, 2), r(["#ff8fc0", "#7fd1ff", "#2bc48a"][k], 1.5));
      (C([t.x + 24, t.y - 30, t.x + 24, t.y - 58], y, 3),
        m(t.x - 14, t.y - 132, 76, 76, 4),
        r(n.noticeRead ? "#f1f3f6" : "#ffffff", 3),
        g("NOTICE", t.x + 24, t.y - 118, 15, "#e5533d", "center", 900),
        m(t.x + 12, t.y - 102, 24, 20, 4),
        r("#8a93a3", 2),
        F(t.x + 19, t.y - 93, 2, y),
        F(t.x + 29, t.y - 93, 2, y),
        m(t.x + 14, t.y - 80, 20, 16, 3),
        r("#c5ccd6", 2),
        C([t.x + 40, t.y - 96, t.x + 48, t.y - 66], "#8b5a3c", 3),
        X(t.x + 49, t.y - 64, 8, 4),
        r("#cdbb98", 1.5));
    }
    // The vent: a grille on the floor, with the pull drawn round it at all times (a pale circle, the exact
    // place the pull works, and ripples running in toward the grille).
    function lobbyVent() {
      let o = LOBBY_VENT;
      (e.save(),
        L(o.x, o.y, o.r),
        (e.fillStyle = "rgba(127,209,255,.16)"),
        e.fill(),
        e.setLineDash([6, 6]),
        (e.strokeStyle = "rgba(52,120,246,.6)"),
        (e.lineWidth = 2),
        e.stroke(),
        e.setLineDash([]));
      for (let k = 0; k < 3; k++) {
        let f = 1 - ((n.T * 0.7 + k / 3) % 1);
        (L(o.x, o.y, 16 + (o.r - 18) * f), (e.strokeStyle = "rgba(52,120,246," + (0.15 + 0.5 * (1 - f)).toFixed(3) + ")"), (e.lineWidth = 2.5), e.stroke());
      }
      (e.restore(), m(o.x - 34, o.y - 12, 68, 24, 4), r("#dfe4ea", 3));
      for (let k = 0; k < 6; k++) C([o.x - 25 + k * 10, o.y - 8, o.x - 25 + k * 10, o.y + 8], y, 2);
    }
    // The warning: while Squatch stands in the pull, a tuft of his fur drifts from him toward the grille. It
    // reaches the grille only if he stays (PULL_BITE seconds); out of the pull it drifts back to him.
    function lobbyTuft() {
      if (n.scene !== "O4" || !(n.pull > 0) || n.room !== "lobby") return;
      let k = Math.min(1, n.pull / PULL_BITE),
        sx = n.sq.x + 14 * n.sq.f,
        sy = n.sq.y - 52,
        tx = sx + (LOBBY_VENT.x - sx) * k + Math.sin(n.T * 7) * 5 * (1 - k),
        ty = sy + (LOBBY_VENT.y - sy) * k;
      (XV(tx, ty, 9, 6, 8, 2, n.T * 4), wV("#8b5a3c", 1.5));
    }
    // The notice, close up, when Squatch reads it: one short line and a drawn robot janitor.
    function noticePanel() {
      (e.save(),
        e.translate(480, 320),
        e.rotate(0.015),
        m(-230, -236, 460, 472, 8),
        r("#ffffff", 5),
        g("NOTICE", 0, -206, 20, "#8a93a3", "center", 900),
        g("ROBOT JANITORS", 0, -160, 40, "#e5533d", "center", 900),
        g("COMING.", 0, -116, 40, "#e5533d", "center", 900),
        e.save(),
        e.translate(-20, 0),
        C([0, -62, 0, -82], y, 3),
        F(0, -86, 7, "#e5533d"),
        m(-38, -62, 76, 58, 12),
        r("#8a93a3", 4),
        F(-15, -36, 7, y),
        F(15, -36, 7, y),
        C([-14, -16, 14, -16], y, 3),
        m(-32, 0, 64, 52, 10),
        r("#c5ccd6", 4),
        m(-28, 52, 56, 12, 6),
        r(y, 0),
        C([34, 14, 80, 92], "#8b5a3c", 6),
        X(84, 96, 24, 9),
        r("#cdbb98", 3),
        e.restore(),
        g("No more fur. No more people.", 0, 136, 28, y, "center", 800));
      for (let [px, fur] of [
        [-70, !0],
        [70, !1],
      ]) {
        (fur ? (XV(px, 190, 16, 12, 9, 3, 0.5), wV("#8b5a3c", 2)) : (L(px, 176, 9), r("#f0bf93", 2), m(px - 11, 186, 22, 20, 6), r("#7fd1ff", 2)),
          C([px - 26, 214, px + 26, 162], "#e5533d", 5));
      }
      e.restore();
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
            (Np(!0), n.log.push({ who: "", text: "[guard chasing " + (n.T - n.spotT).toFixed(2) + "s after sighting]", kind: "t" })));
    }
    function Np(said) {
      n.looked ||
        ((n.looked = !0),
        said && kV("sq", "Everyone's looking!"),
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
        { x: 1010, y: 530, tx: 760, ty: 520 },
        { x: 89, y: 446, tx: 200, ty: 480 },
      ];
    }
    // A guard reached Squatch in the lobby: the one capture rule (25-capture.js). The night starts over.
    function Rp() {
      ((n.lgJump = n.T), (n.lobbyCatches = (n.lobbyCatches || 0) + 1), capture(n.lobbyBy || "lobbykid"));
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
        // The vent's pull (D15): time in the circle adds up, time out of it drains twice as fast.
        if (((n.pull = inPull(i) ? n.pull + l : Math.max(0, n.pull - l * 2)), n.pull >= PULL_BITE)) {
          ventAlarm();
          return;
        }
        for (let s of hh())
          if (lobbySees(i.x, i.y - 30, s)) {
            Op(s.k);
            return;
          }
        // The table comes into view once he is close enough to make it out; then its notice is the goal.
        !n.sawTable && Math.hypot(i.x - LOBBY_TABLE.x, i.y - LOBBY_TABLE.y) < TABLE_SEEN && ((n.sawTable = !0), n.pulse.add("notice"), D.key());
      }
      n.act = pick(o4Spots());
    }
    function Gs(home) {
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
        n.pulse.add("bed"),
        (n.ctrl = !0),
        // Back from the lobby with the notice: the inspection Mops talked about is at the door (D15).
        home && TV([v("bot", "Inspection! Closet next.", "say", !0)]),
        kV("sq", "Hide!"),
        (n.act = offer({
          id: "bed",
          verb: "HIDE",
          cap: "under the bed",
          who: "sq",
          x: 220,
          y: 560,
          r: 120,
          hot: !0,
          f: () => {
            ((n.act = null),
              (n.ctrl = !1),
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
        (n.coneIn = !1),
        teach("hide1", { x: 220, y: 500, r: 130 }));
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
          v("sq", "Everybody out there has somebody."),
          v("mops", "You have me."),
          v("sq", "But look. Robot janitors are coming."),
          v("mops", "A notice can't mop a floor."),
          N(() => {
            ((n.holdNotice = !1), D.grab());
          }),
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
          cap: "TV",
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
                cap: "bed",
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
                            cap: "gift",
                            at: [190, 340],
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
            (chipNow(), (n.ctrl = !0));
          }),
        ]));
    }
    // The goal chip for Chapter 1: one table, read every frame from the scene and who is in control.
    // Every line names who acts. The first time a mechanic appears the chip names the step; after that it
    // names only the goal (the chip rule, docs/PHASE-1-LINES-FOR-BRIAN.md). Wording waits for Brian's yes
    // (docs/PHASE-2-LINES-FOR-BRIAN.md). A key with no line shows no new chip.
    const CH1_CHIPS = {
      O1: "Squatch: walk around the room",
      O2a: "Squatch: sing along with Mops",
      O3: "Squatch: peek out the door",
      O3b: "Squatch: sneak out the door",
      O4: "Squatch: run back to the closet!",
      "O4:out": "Squatch: find out what's going on out there",
      "O4:table": "Squatch: read the notice",
      "O4:home": "Squatch: sneak back to the closet",
      O5: "Squatch: hide under the bed",
      O7: "Squatch: watch the TV",
      O8: "Squatch: go to sleep in your bed",
      "O8:gift": "Squatch: grab the gift",
      O9: "Squatch: put the note and the rock in the box",
      S1: "Squatch: bring Mops his lunch",
      S2: "Squatch: give Mops his lunch",
      S4: "Squatch: hide from the bot in the crate",
      "S4:in": "Squatch: stay hidden in the crate",
      S5: "Squatch: listen to the visitors",
      "S5:bro": "Squatch: grab the brochure",
      S6: "Squatch: follow Mops",
      S7: "Squatch: use the manager's computer",
      S7b: "Squatch: sign the order",
      S9: "Squatch: get ready to sing to the bot",
      "S9:hid": "Squatch: sing to bring the bot over",
      "S9:sing": "Squatch: tap Mops' picture",
      "S9:mops": "Mops: grab the slip from the trash",
      S10: "Squatch: squeeze into the vent",
      "S10:bumped": "Squatch: let Mops try the vent",
      "S10:mops": "Mops: squeeze into the vent",
      S10d: "Mops: grab the other half of the slip",
      "S10d:out": "Mops: crawl back out",
      S11: "Squatch: get the bot away from the door",
      "S11:hid": "Squatch: get the bot away from the door",
      "S11:sing": "Squatch: get the bot away from the door",
      "S11:mops": "Mops: type the code at the door",
      "S11:costume": "Squatch: put on the goat costume",
      "S11:gate": "Squatch: walk through the gate",
      S12: "Squatch: grab 3 snacks",
      "S12:ship": "Squatch: get on the ship",
    };
    function ch1ChipKey() {
      let l = n.scene || "";
      return l === "O4"
        ? n.runner || n.looked
          ? "O4"
          : n.noticeRead
            ? "O4:home"
            : n.sawTable
              ? "O4:table"
              : "O4:out"
        : l === "O8"
        ? n.gift
          ? "O8:gift"
          : "O8"
        : l === "S1" || l === "S1L"
          ? "S1"
          : l === "S4"
            ? le.inCrate
              ? "S4:in"
              : "S4"
            : l === "S5"
              ? qV.bro.inBin && !qV.grabbed
                ? "S5:bro"
                : "S5"
              : l === "S6"
                ? x.ask
                  ? "S6"
                  : ""
                : l === "S9"
                  ? x.mops
                    ? "S9:mops"
                    : n.sqPose !== "hidden"
                      ? "S9"
                      : x.sing
                        ? "S9:sing"
                        : "S9:hid"
                  : l === "S10"
                    ? x.mops
                      ? "S10:mops"
                      : x.bumped
                        ? "S10:bumped"
                        : "S10"
                    : l === "S10d"
                      ? x.got2
                        ? "S10d:out"
                        : "S10d"
                      : l === "S11"
                        ? x.doorOpen
                          ? !x.costume && x.mopsHint
                            ? "S11:costume"
                            : "S11:gate"
                          : x.mops
                            ? "S11:mops"
                            : n.sqPose !== "hidden"
                              ? "S11"
                              : x.sing
                                ? "S11:sing"
                                : "S11:hid"
                        : l === "S12"
                          ? Gn >= 3
                            ? "S12:ship"
                            : "S12"
                          : l;
    }
    // Chapter 1's spots, scene by scene, in the order each picker tries them (see spot in 00-core.js).
    function ch1Spots() {
      let l = n.scene;
      return l === "O4"
        ? o4Spots()
        : l === "S1"
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
          cap: "lunch",
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
          cap: "tin",
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
          cap: "bucket",
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
          cap: "notice",
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
          cap: "notice",
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
          cap: "door",
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
        chipNow(),
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
        spot({ id: "leave", verb: "LEAVE", cap: "hiding spot", who: "sq", at: [n.sq.x, n.sq.y - 30], when: n.sqPose === "hidden", f: Qs }),
        ...qn.map((i, l) =>
          spot({
            id: "spot" + l,
            verb: "HIDE",
            cap: i.kind === "plant" ? "plant" : "box",
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
        (aV.secBy = "vent"),
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
    // The deck guard reached Squatch: the one capture rule (25-capture.js). The section restarts with Sh.
    function Yp() {
      capture(aV.secBy === "vent" ? "vent" : "deck");
    }
    function Ip() {
      ((aV.done = !0),
        (n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        (n.mo.f = n.sq.x > n.mo.x ? 1 : -1),
        aV.seen ||
          (n.found.add("sneak-s1"),
          (n.starOn = !0),
          (n.stars += 100),
          aV.sneaky++,
          n.sparks.push({ x: 300, y: 80, t: 2.4, s: SNEAKY_LABELS["sneak-s1"] }),
          D.pickup()),
        J([uV(1.2), C2(n.room === "hall" ? B.camX + c + 60 : c + 60, n.sq.y), B2(), N(Oh)]));
    }
    function Kp(l) {
      let o = aV.sec;
      for (let i of aV.tour)
        Th(i, l, () => {
          (Object.assign(aV.sec, { x: Aa.x, y: Aa.y, on: !0, mode: "rush", t: 0, lx: n.sq.x, ly: n.sq.y }), (aV.secBy = "deck"), D.alarm());
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
            ((o.on = !1), (o.mode = ""), lostYou());
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
          conesDrawn.push({ ox: i, oy: s, a: -Math.PI / 2, half: z0, len: Ls, feet: !0, room: n.room }),
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
