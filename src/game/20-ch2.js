// Chapter 2, the gas stop (scenes G0 to G6): spots, state, sight cones, security and LOCKUP, Reset section, chips, scenes, and room drawing.
    let we = { x: 540, y: 420 },
      ht = { x: 690, y: 480 },
      Sa = { x: 85, y: 410 },
      po = { x: 300, y: 400 },
      C0 = { x: 820, y: 250 },
      _e = { x: 190, y: 560 },
      TA = { x: 700, y: 575 },
      KV = { x: 480, y: 430 },
      Hn = { x: 800, y: 430 },
      la = { x: 912, y: 430 },
      xe = { x: 170, y: 540 },
      Ln = { x: 880, y: 560 },
      xt = { x: 690, y: 190 },
      Ul = { x: 480, y: 430 },
      Dl = { x: 360, y: 430 },
      Ma = { x: 240, y: 430 },
      oa = { x: 130, y: 430 },
      B0 = { x: 720, y: 430 },
      Cl = { x: 880, y: 460 },
      mf = { x: 90, y: 560 },
      ch2 = {
        phase: "",
        caught: 0,
        start: 0,
        rust: { x: 450, f: -1, pause: 0, alert: 0, chase: !1, nap: !1 },
        done: 0,
        held: -1,
        scrub: 0,
        peekT: 0,
        peek: 0,
        warn: 0,
        jar: 0,
        reg: 0,
        has: "",
        bots: [],
        botsIn: !1,
        argueT: 0,
        out: -1,
        outT: 0,
        sqBowl: "",
        rustBowl: !1,
        flipFrame: !1,
        flipCard: !1,
        cloche: !1,
        hose: !1,
        fuel: !1,
        timer: 0,
        tv: !1,
        greasy: !1,
        mopN: 0,
      };
    function SA() {
      Object.assign(ch2, {
        phase: "",
        caught: 0,
        start: n.stars,
        rust: { x: 450, f: -1, pause: 0, alert: 0, chase: !1, nap: !1 },
        done: 0,
        held: -1,
        scrub: 0,
        peekT: 0,
        peek: 0,
        warn: 0,
        jar: 0,
        reg: 0,
        has: "",
        bots: [],
        botsIn: !1,
        argueT: 0,
        out: -1,
        outT: 0,
        sqBowl: "",
        rustBowl: !1,
        flipFrame: !1,
        flipCard: !1,
        cloche: !1,
        hose: !1,
        fuel: !1,
        timer: 0,
        tv: !1,
        greasy: !1,
        mopN: 0,
      });
    }
    function vt(l, o, i, s, q, d, A) {
      let T = l - i,
        R = o - s,
        P = Math.hypot(T, R);
      if (P > A || P < 1) return !1;
      let _ = Math.atan2(R, T) - q;
      for (; _ > Math.PI;) _ -= 2 * Math.PI;
      for (; _ < -Math.PI;) _ += 2 * Math.PI;
      return Math.abs(_) < d && _h(i, s, l, o);
    }
    function _h(l, o, i, s) {
      for (let q of ih()) {
        let d = q.y0 - 90,
          ub = q.y1 + (n.room === "gas" ? 72 : 0);
        if (l > q.x0 && l < q.x1 && o > q.y0 && o < q.y1) continue;
        for (let A = 1; A < 16; A++) {
          let T = A / 16,
            R = l + (i - l) * T,
            P = o + (s - o) * T;
          if (R > q.x0 && R < q.x1 && P > d && P < ub) return !1;
        }
      }
      return !0;
    }
    function bf(l, o, i = "bot") {
      (n.sparks.push({ x: (n.room === "hall" ? l - B.camX : l) - 58, y: o - 70, t: 2.2, s: "!" }), kV(i, "FUR DETECTED!"), D.alarm());
    }
    function Fh(l, o, i, s, q, d, A) {
      (e.beginPath(),
        e.moveTo(l, o),
        e.arc(l, o, q, i - s, i + s),
        e.closePath(),
        d === "sec"
          ? ((e.fillStyle = A ? "rgba(229,40,30,.40)" : "rgba(229,83,61,.32)"),
            e.fill(),
            (e.strokeStyle = "rgba(170,30,20,.85)"),
            (e.lineWidth = 2.5),
            e.stroke())
          : ((e.fillStyle = A ? "rgba(229,83,61,.20)" : "rgba(130,160,255,.13)"),
            e.fill(),
            e.setLineDash([3, 6]),
            (e.strokeStyle = "rgba(70,90,160,.6)"),
            (e.lineWidth = 1.5),
            e.stroke(),
            e.setLineDash([])));
    }
    function Bl(l, o, i, s, q, d) {
      (conesDrawn.push({ ox: l, oy: o, a: i, half: s, len: q, room: n.room, cam: n.room === "hall" ? B.camX : 0 }),
        e.beginPath(), e.moveTo(l, o), e.arc(l, o, q, i - s, i + s), e.closePath(), (e.fillStyle = d), e.fill());
    }
    // A sight cone drawn as the area that really sees (Phase 3, T19 addition): the same origin, facing,
    // width and length as before, cut short where a pump, crate or wall blocks the sight line (_h), so
    // the shaded area is exactly where a standing Squatch is seen. tests/cone-match.mjs checks it.
    function seenCone(l, o, i, s, q, d, stroke) {
      conesDrawn.push({ ox: l, oy: o, a: i, half: s, len: q, blocked: !0, room: n.room, cam: n.room === "hall" ? B.camX : 0 });
      let N = 40;
      e.beginPath();
      e.moveTo(l, o);
      for (let k = 0; k <= N; k++) {
        let t = i - s + (2 * s * k) / N,
          cx = Math.cos(t),
          cy = Math.sin(t),
          lo = 0,
          hi = q;
        if (!_h(l, o, l + cx * q, o + cy * q))
          for (let j = 0; j < 9; j++) {
            let mid = (lo + hi) / 2;
            _h(l, o, l + cx * mid, o + cy * mid) ? (lo = mid) : (hi = mid);
          }
        else lo = q;
        e.lineTo(l + cx * lo, o + cy * lo);
      }
      (e.closePath(), (e.fillStyle = d), e.fill(), stroke && ((e.lineWidth = 3), (e.strokeStyle = stroke), e.stroke()));
    }
    function Jh() {
      return { ox: ch2.rust.x, oy: 400, a: ch2.rust.f > 0 ? 0.5 : Math.PI - 0.5 };
    }
    function sSec(l, who) {
      ch2.sec ||
        ((ch2.sec = { x: 980, y: 520, hide: 0, mode: "come", by: l || "diner", who: who || "", scene: n.scene }), kV("bot", "SECURITY!"), D.alarm());
    }
    // Chapter 2's security, also used in Chapters 3 and 4: it walks to Squatch; if he is hidden it leaves
    // ("They lost you."), and if it reaches him the one capture rule runs (capture in 25-capture.js).
    function qSec(l) {
      let s = ch2.sec;
      if (s && s.scene && s.scene !== n.scene) return void (ch2.sec = null);
      if (!s || de()) return;
      if (n.sqPose === "hidden" || (n.room === "kitchen" && n.sqPose === "ball")) {
        ((s.hide += l), (s.mode = "leave"), (s.x += (s.x < 480 ? -240 : 240) * l));
        s.hide > 1.6 && (s.x < -70 || s.x > 1030) && ((ch2.sec = null), lostYou());
        return;
      }
      s.hide = 0;
      let dx = n.sq.x - s.x,
        dy = n.sq.y - s.y,
        d = Math.hypot(dx, dy) || 1;
      ((s.x += (dx / d) * 170 * l), (s.y += (dy / d) * 130 * l), d < 48 && capture(s.by === "diner" && s.who === "blorp" ? "blorp" : s.by || ""));
    }
    function sectionReset() {
      if (p.state === "title" || !n.scene) return;
      if (ch2.resetHold) ((ch2.resetHold.on = !1), (ch2.resetHold.fired = !0));
      if (p.state !== "op") return;
      restartSection();
    }
    function armReset(l) {
      l ? (ch2.resetHold && ch2.resetHold.on) || (ch2.resetHold = { on: !0, t: 0, fired: !1 }) : ch2.resetHold && (ch2.resetHold.on = !1);
    }
    function gKnown(l) {
      return (
        l === "back" ||
        l === "g1door" ||
        l === "g6" ||
        l === "g6d" ||
        l === "g3" ||
        l === "g3hide" ||
        l === "g3h" ||
        l === "wash1" ||
        l === "wash5" ||
        l === "g4" ||
        l === "g2" ||
        l === "g4k" ||
        l === "g4l" ||
        l === "g1"
      );
    }
    function noteSection() {
      ch1StampBalloon();
      if (p.state !== "op") return;
      let scene = n.scene || "",
        phase = ch2.phase || "",
        ch1 = /^(S|O)\d/.test(scene),
        chG = scene.startsWith("G"),
        chLate = /^(P|M)\d/.test(scene);
      if (ch1 && gKnown(phase)) return;
      if (!ch1 && !(chG && gKnown(phase)) && !chLate) return;
      let id = scene + "|" + phase;
      if (ch2.noted === id) return;
      ((ch2.noted = id),
        (ch2.check = {
          id,
          scene,
          room: n.room,
          phase,
          sq: { x: n.sq.x, y: n.sq.y, f: n.sq.f },
          mo: { x: n.mo.x, y: n.mo.y, f: n.mo.f },
          sqPose: n.sqPose,
          moPose: n.moPose,
          mops: !!x.mops,
          spot: x.spot,
          cam: B.camX || 0,
          peekT: ch2.peekT || 0,
          timer: ch2.timer || 0,
          cook: ch2.cook || "",
          pulse: [...n.pulse],
          bots: n.room === "hall" ? B.bots.map((b) => ({ ...b })) : null,
          balloonRest: n.ch1BalloonRest || "",
          balloonPopped: !!n.ch1BalloonPopped,
        }));
    }
    function restoreCheck(c) {
      if (!c) return !1;
      ((n.scene = c.scene),
        (n.room = c.room),
        (ch2.phase = c.phase),
        (n.sq.x = c.sq.x),
        (n.sq.y = c.sq.y),
        (n.sq.f = c.sq.f || 1),
        (n.mo.x = c.mo.x),
        (n.mo.y = c.mo.y),
        (n.mo.f = c.mo.f || -1),
        (n.sqPose = c.sqPose || "stand"),
        (n.moPose = c.moPose || "stand"),
        switchTo(c.mops ? "mops" : "squatch"),
        (x.spot = c.spot == null ? -1 : c.spot),
        n.room === "hall" && (B.camX = c.cam || 0),
        (ch2.peekT = c.peekT || 0),
        (ch2.timer = c.timer || 0),
        (ch2.cook = c.cook || ""),
        n.pulse.clear());
      for (let id of c.pulse || []) n.pulse.add(id);
      c.bots && (B.bots = c.bots.map((b) => ({ ...b })));
      c.balloonRest != null && ((n.ch1BalloonRest = c.balloonRest || ""), (n.ch1BalloonPopped = !!c.balloonPopped));
      ch2.noted = c.id;
      return !0;
    }
    function clearRun() {
      ((n.q = []),
        (n.cur = null),
        (n.live = []),
        (n.sq.moving = !1),
        (n.mo.moving = !1),
        (n.act = null),
        (n.ctrl = !0),
        (n.hopOut = -1),
        (ch2.sec = null),
        (n.walkTo = null),
        FV.on && FV.bot && ((FV.bot.x = FV.hx), (FV.bot.y = FV.hy)),
        FV.on && n.chip === "Hide!" && (n.chip = FV.chip),
        (FV.on = !1),
        (n.sirenT = -9),
        (ch2.rust.chase = !1),
        (ch2.rust.alert = 0),
        (ch2.rust.x = 450),
        (ch2.rust.f = -1),
        (ch2.rust.pause = 1.2),
        (ch2.rust.nap = !1),
        (ch2.peek = 0),
        (ch2.eye = 0),
        (ch2.warn = 0),
        (ch2.dishT = 0),
        (ch2.rumbleT = 0),
        (ch2.rumbled = 0),
        (ch2.cookT = 0),
        (ch2.cook = ""),
        (ch2.cookTold = 0),
        (ch2.argueT = 9),
        (ch2.out = -1),
        (ch2.timer = 0),
        (ch2.botsIn = !1),
        (ch2.sqStash = null),
        (x.sing = !1),
        n.pulse.clear(),
        String(n.scene || "").startsWith("G") && (n.chip = ""),
        (n.ch1Dress = null),
        (n.ch1Veil = 0),
        (n.ch1VeilTo = 0),
        (n.ch1Drag = ""));
    }
    function drawCap() {
      let a = n.act;
      // No caption over the crate's own LEAVE SOUP label, or over the dish while it is being scrubbed.
      if (!a || !a.cap || !n.ctrl || n.ch1Zoom || a.verb === "LEAVE SOUP" || (n.room === "kitchen" && ch2.dishT > 0)) {
        n.capBox = null;
        return;
      }
      // The label is at least 156 wide, wider for long words, and always fully on the picture.
      // The tap target is at least 44px tall so a finger can hit it.
      let t = a.verb + " \u00b7 " + a.cap;
      ge(14);
      let d = Math.max(156, e.measureText(t).width + 24),
        x = w(a.x, d / 2 + 4, c - d / 2 - 4),
        y = Math.max(28, a.y - 36);
      (m(x - d / 2, y - 14, d, 28, 8),
        r("#fffaf0", 3),
        g(t, x, y, 14, "#1e2430", "center", 800),
        (n.capBox = { verb: a.verb, x: x - d / 2 - 8, y: y - 30, w: d + 16, h: 44 }));
    }
    // The goal chip for Chapter 2: one table, read every frame from the phase, the room and who is in control.
    // Every line names who acts. No line names a place in another room. The first time a mechanic appears
    // the chip names the step (g1, g3hide); after that it names only the goal, so discovery stays with the player. Wording waits for Brian's yes
    // (docs/PHASE-1-LINES-FOR-BRIAN.md).
    const CH2_CHIPS = {
      g1: "Squatch: hide behind the crate by the pump",
      g1door: "Mops: walk to the diner door and go in",
      back: "Squatch: sneak in the KITCHEN door",
      g2: "Mops: ask Gloop for work at the counter",
      wash1: "Squatch: wash the dishes at the sink",
      g3: "Squatch: hide in the crate before the bots look!",
      g3hide: "Squatch: hide in the crate before the bots look!",
      g3h: "Squatch: stay out of sight",
      g4: "Mops: take the tip jar",
      "g4:coins": "Mops: buy soup at the counter",
      "g4:soup": "Mops: take the soup through the kitchen door",
      g4k: "Mops: carry the soup to Squatch's crate",
      g4l: "Mops: carry the soup to Squatch's crate",
      "diner:kitchen": "Mops: go back through the kitchen door",
      wash5: "Squatch: wash the next dishes",
      "wash5:mop": "Mops: mop the greasy pot at the sink",
      "kitchen:mops": "Mops: tap Squatch's picture (top right) to switch back",
      g6d: "Mops: grab the new tip jar",
      "g6d:coins": "Mops: take the coins out the EXIT door",
      "g6:mops": "Mops: give the coins to Rusty at the pump",
      g6: "Squatch: lure the bots away from the ship",
      "g6:sing": "Squatch: stop singing before they reach you",
      "g6:run": "Squatch: run to the ship and get on board",
    };
    function ch2ChipKey() {
      let ph = ch2.phase || "";
      if (sqAway()) return "diner:kitchen";
      if (ph === "g4") return ch2.has === "soup" ? "g4:soup" : ch2.has === "coins" ? "g4:coins" : "g4";
      if (ph === "wash5" && x.mops && ch2.greasy) return "wash5:mop";
      if (x.mops && n.room === "kitchen" && (ph === "wash1" || ph === "wash5" || ph === "g3" || ph === "g3hide")) return "kitchen:mops";
      if (ph === "g6d") return ch2.has === "coins" ? "g6d:coins" : "g6d";
      if (ph === "g6")
        return x.mops ? "g6:mops" : x.sing ? "g6:sing" : (ch2.bots || []).some((o) => o.look > 0) ? "g6:run" : "g6";
      return ph;
    }
    function ch2Chip() {
      return CH2_CHIPS[ch2ChipKey()] || "";
    }
    function applyG(l) {
      let ok = placeG(l);
      return (ok && (n.chip = ch2Chip()), ok);
    }
    function placeG(l) {
      if (l === "back" || l === "g1door") {
        ((n.scene = "G2b"),
          (n.room = "gas"),
          (ch2.phase = "back"),
          (n.sqPose = "hidden"),
          (x.spot = 60),
          switchTo("squatch"),
          (n.sq.x = ht.x),
          (n.sq.y = ht.y),
          (n.mo.x = -200),
          n.pulse.add("backd"));
        return !0;
      }
      // g6d, or g6 before the tank is filled: back to Mops with the coins at the pump, or to the diner's
      // jar if he has no coins. Only a full tank puts Squatch at the lure (review, 2026-11-07).
      if ((l === "g6" || l === "g6d") && !ch2.fuel) {
        if (l === "g6" && ch2.has === "coins") {
          ((n.scene = "G6"),
            (n.room = "gas"),
            (ch2.phase = "g6"),
            switchTo("mops"),
            (n.mo = { x: po.x, y: po.y + 70, f: 1, walk: 0, moving: !1 }),
            (n.moPose = "stand"),
            (n.sqPose = "hidden"),
            (x.spot = -1),
            (n.sq.x = -200),
            (n.sq.y = 470),
            (ch2.bots = [
              { x: 700, y: 500, hx: 700, f: -1, look: 0 },
              { x: 900, y: 520, hx: 900, f: -1, look: 0 },
            ]));
          return !0;
        }
        ((n.scene = "G6"),
          (n.room = "diner"),
          (ch2.phase = "g6d"),
          switchTo("mops"),
          (n.mo = { x: 600, y: 500, f: -1, walk: 0, moving: !1 }),
          (n.moPose = "stand"),
          (n.sqPose = "hidden"),
          (x.spot = -1),
          (n.sq.x = -200),
          ch2.has === "coins" || n.pulse.add("jar"));
        return !0;
      }
      if (l === "g6" || l === "g6d") {
        // Tank full: Rusty has been asleep since he was paid, and stays asleep (as on main); bots go home.
        ch2.rust.nap = !0;
        for (let b of ch2.bots || []) ((b.x = b.hx), (b.look = 0));
        ((n.scene = "G6"),
          (n.room = "gas"),
          (ch2.phase = "g6"),
          (n.sqPose = "stand"),
          (x.spot = -1),
          switchTo("squatch"),
          (n.sq.x = Sa.x),
          (n.sq.y = 470),
          n.pulse.add("lure"));
        return !0;
      }
      if (l === "g3" || l === "g3hide" || l === "g3h") {
        ((n.scene = "G3"), (n.room = "kitchen"), (n.sqPose = "stand"), (x.spot = -1), switchTo("squatch"), (n.sq.x = 300), (n.sq.y = 520), V2());
        return !0;
      }
      if (l === "g4l") ((l = "wash5"), (ch2.has = ""), (ch2.sqBowl = "counter"));
      if (l === "wash1" || l === "wash5") {
        ((n.scene = l === "wash1" ? "G2k" : "G5k"),
          (n.room = "kitchen"),
          (ch2.phase = l),
          (n.sqPose = "stand"),
          (x.spot = -1),
          switchTo("squatch"),
          (n.sq.x = l === "wash1" ? KV.x : xe.x + 60),
          (n.sq.y = l === "wash1" ? KV.y : 520),
          (ch2.peek = 0),
          (ch2.peekT = l === "wash1" ? 7 : 4.5),
          (ch2.warn = 0),
          (ch2.eye = 0),
          (ch2.cook = ""),
          (ch2.cookT = 0),
          (n.mo.x = 700),
          (n.mo.y = 500),
          n.pulse.add("rail"));
        return !0;
      }
      if (l === "g4") {
        ((n.scene = "G4"),
          (n.room = "diner"),
          (ch2.phase = "g4"),
          (n.sqPose = "hidden"),
          (x.spot = 63),
          (n.sq.x = xe.x),
          (n.sq.y = xe.y),
          switchTo("mops"),
          (n.mo.x = 600),
          (n.mo.y = 500),
          (n.mo.f = -1),
          (ch2.eye = 0),
          n.pulse.add("counter"));
        return !0;
      }
      if (l === "g2") {
        ((n.scene = "G2"),
          (n.room = "diner"),
          (ch2.phase = "g2"),
          switchTo("mops"),
          (n.mo = { x: mf.x + 40, y: 560, f: 1, walk: 0, moving: !1 }),
          (n.moPose = "stand"),
          (n.sqPose = "hidden"),
          (x.spot = 60),
          (n.sq.x = ht.x),
          (n.sq.y = ht.y),
          n.pulse.add("counter"));
        return !0;
      }
      if (l === "g4k" || l === "g4l") {
        ((n.scene = "G4"),
          (n.room = "kitchen"),
          (ch2.phase = l),
          switchTo("mops"),
          (n.mo = { x: 150, y: 520, f: 1, walk: 0, moving: !1 }),
          (n.moPose = "stand"),
          (n.sqPose = "hidden"),
          (x.spot = 63),
          (n.sq.x = xe.x),
          (n.sq.y = xe.y),
          (ch2.bots = [
            { x: 420, y: 520, hx: 420, f: 1, look: 0 },
            { x: 560, y: 520, hx: 560, f: -1, look: 0 },
          ]),
          (ch2.botsIn = !1),
          (ch2.argueT = 9),
          (ch2.out = -1),
          l === "g4l" && (ch2.sqBowl = "crate"),
          n.pulse.add("kcrate"));
        return !0;
      }
      if (l === "g1") {
        ((n.scene = "G1"),
          (n.room = "gas"),
          (ch2.phase = "g1"),
          (n.sqPose = "stand"),
          (x.spot = -1),
          switchTo("squatch"),
          (n.sq.x = 760),
          (n.sq.y = 540),
          (n.sq.f = -1),
          (n.mo.x = 850),
          (n.mo.y = 545),
          n.pulse.add("crateg"));
        return !0;
      }
      return !1;
    }
    function reSec() {
      let scene = n.scene || "",
        phase = ch2.phase || "";
      clearRun();
      if (scene.startsWith("S") || scene.startsWith("O") || scene.startsWith("Q")) {
        if (CH1_CHECKPOINTS[scene]) return (CH1_CHECKPOINTS[scene](), (n.ctrl = !0), void 0);
        (ch2.check && (ch2.check.scene === scene || ch2.check.scene.startsWith("S") || ch2.check.scene.startsWith("O")) && restoreCheck(ch2.check),
          (n.ctrl = !0));
        return;
      }
      if (scene.startsWith("P") || scene.startsWith("M")) {
        let table = scene[0] === "P" ? CH3_CHECKPOINTS[Q.phase] : CH4_CHECKPOINTS[H.phase];
        (ch2.check && ch2.check.scene === scene && restoreCheck(ch2.check), table && table(), (n.ctrl = !0));
        return;
      }
      if (scene.startsWith("G")) {
        if (applyG(phase)) return;
        (ch2.check && String(ch2.check.scene || "").startsWith("G") && restoreCheck(ch2.check), (n.ctrl = !0));
        return;
      }
      (ch2.check && restoreCheck(ch2.check), (n.ctrl = !0));
    }
    function MA(l) {
      let o = ch2.rust;
      if (o.nap) {
        ((o.f = 1), qSec(l));
        return;
      }
      if (o.alert > 0) {
        o.alert -= l;
        return;
      }
      o.pause > 0
        ? ((o.pause -= l), o.pause <= 0 && (o.f = -o.f))
        : ((o.x += o.f * 55 * l), (o.x > 600 || o.x < 330) && ((o.x = w(o.x, 330, 600)), (o.pause = 1.8)));
      let i = Jh(),
        s = n.sq,
        rustSees = vt(s.x, s.y - 40, i.ox, i.oy, i.a, 0.85, 280);
      (n.ctrl &&
        !x.mops &&
        n.sqPose !== "hidden" &&
        !ch2.sec &&
        ballOrStand("rust", Math.hypot(s.x - i.ox, s.y - i.oy), l, rustSees) &&
        ((ch2.sec = { x: o.f > 0 ? 980 : -40, y: 520, hide: 0, mode: "come", by: "rust" }),
        kV("rust", "SECURITY! A Squatch on the lot!"),
        kV("sq", "Troopers. I can hide.", "whisper"),
        D.alarm()),
        qSec(l));
    }
    function Zh(l) {
      return { ox: l.x, oy: l.y - 40, a: l.f > 0 ? 0 : Math.PI, len: 230 };
    }
    function EA(l) {
      if (
        ch2.phase === "g4k" &&
        ((ch2.argueT -= l),
        ch2.argueT <= 0 &&
          (ch2.out < 0
            ? ((ch2.out = ch2.outT++ % 2), (ch2.argueT = 2.6), kV(ch2.out ? "bot2" : "bot", "Hmph!"), (ch2.bots[ch2.out].f = ch2.out ? 1 : -1))
            : ((ch2.bots[0].f = 1),
              (ch2.bots[1].f = -1),
              (ch2.out = -1),
              (ch2.argueT = 2.4),
              kV(ch2.outT % 2 ? "bot" : "bot2", ch2.outT % 2 ? "You watch the crate." : "No, YOU watch the crate."))),
        n.ctrl && x.mops && n.room === "kitchen" && ch2.out >= 0)
      ) {
        let o = Zh(ch2.bots[ch2.out]);
        vt(n.mo.x, n.mo.y - 40, o.ox, o.oy, o.a, 0.6, o.len) &&
          shoo(
            () => {
              ((n.mo.x = Ln.x), (n.mo.y = Ln.y), (ch2.out = -1), (ch2.argueT = 2), (ch2.bots[0].f = 1), (ch2.bots[1].f = -1));
            },
            [v(ch2.out ? "bot2" : "bot", "No goats with food past here! Shoo!"), v("mops", "Just passing through.")],
          );
      }
      if (ch2.phase === "g6") {
        for (let o of ch2.bots)
          if (x.sing && n.sqPose === "hidden" && x.spot === 61) {
            if (((o.look = 6.5), (o.x = Math.max(_e.x + 80, o.x - 60 * l)), (o.f = -1), o.x <= _e.x + 82 && n.ctrl)) {
              OA();
              return;
            }
          } else o.look > 0 ? (o.look -= l) : ((o.x = Math.min(o.hx, o.x + 50 * l)), (o.f = o.x < o.hx ? 1 : -1));
        if (n.ctrl && !x.mops && n.sqPose !== "hidden") {
          for (let o of ch2.bots) {
            let sees = vt(n.sq.x, n.sq.y - 40, o.x, o.y - 40, o.f > 0 ? 0 : Math.PI, 0.6, 230);
            if (o.look <= 0 && ballOrStand("pump" + o.hx, Math.hypot(n.sq.x - o.x, n.sq.y - o.y), l, sees)) {
              if (!ch2.sec) {
                ((ch2.sec = { x: o.f > 0 ? 980 : -40, y: 520, hide: 0, mode: "come", by: "pump" }),
                  kV("bot", "SQUATCH ON THE LOT! Report him or fuel him!"),
                  kV("bot2", "Fill 'er up! HOLD STILL!"),
                  kV("sq", "I run on PANCAKES! (Back out the door!)", "whisper"),
                  D.alarm());
              }
              return;
            }
          }
        }
      }
    }
    // The bots reach the crate while Squatch sings: caught (the one capture rule; Reset puts the lure back).
    function OA() {
      capture("lure");
    }
    // How long Gloop's warning at the kitchen window lasts before she looks (it was 1.1 to 1.5 seconds; Phase 3, T20).
    const WINDOW_WARN = 2.5;
    // True from the warning until Gloop's look ends: she fills the window and its frame flashes.
    function windowWatch() {
      return n.room === "kitchen" && (ch2.phase === "wash1" || ch2.phase === "wash5") && (ch2.warn > 0 || ch2.peek > 0 || ch2.eye > 0);
    }
    function wA(l) {
      if (ch2.phase !== "wash1" && ch2.phase !== "wash5") return;
      (ch2.dishT > 0 && (ch2.dishT -= l), ch2.rumbleT > 0 && (ch2.rumbleT -= l));
      let o = ch2.phase === "wash5";
      if (ch2.cook === "down") {
        ch2.cookT = (ch2.cookT || 0) + l;
        ch2.cookT > 5.15 && !ch2.rumbled && ((ch2.rumbled = 1), (ch2.rumbleT = 1.7), D.splash());
        ch2.cookT > 6 && ((ch2.cook = "wake"), (ch2.cookT = 0), (ch2.cookX = ch2.cookX || 640), (ch2.cookY = 530));
      }
      if (ch2.cook === "wake") {
        ((ch2.cookT += l), (ch2.cookY = 530 - Math.min(1, ch2.cookT / 0.8) * 50));
        ch2.cookT > 0.8 && ((ch2.cook = "scream"), (ch2.cookT = 0), kV("cook", "AAAAH!"));
      }
      if (ch2.cook === "scream") {
        ch2.cookT += l;
        ch2.cookT > 0.7 && ((ch2.cook = "run"), kV("cook", "Out the door!"));
      }
      if (ch2.cook === "run") {
        ((ch2.cookX = (ch2.cookX || 640) - 240 * l), (ch2.cookY = 420));
        ch2.cookX < 80 && ((ch2.cook = "gone"), ch2.cookTold || ((ch2.cookTold = 1), kV("gloop", "The janitor is cooking and washing?")));
      }
      if (ch2.warn > 0) {
        ((ch2.warn -= l), ch2.warn <= 0 && (ch2.peek = 2.2));
        return;
      }
      if (ch2.peek > 0 || ch2.eye > 0) {
        ch2.peek > 0 && (ch2.peek -= l);
        let i = n.sq,
          seen = n.ctrl && n.sqPose !== "hidden" && n.sqPose !== "ball" && vt(i.x, i.y - 50, xt.x, xt.y + 30, 1.95, 0.75, 520);
        if (seen) {
          ch2.eye || ((ch2.eye = 0.9), kV("gloop", "What is that by the sink?!"));
          if ((ch2.eye -= l) <= 0) {
            ((ch2.eye = 0), (ch2.peek = 0), sSec("sink"));
            let down = ch2.cook === "down" || ch2.cook === "wake" || ch2.cook === "scream" || ch2.cook === "run" || ch2.cook === "gone";
            down
              ? (ch2.peekT = 6)
              : ((n.ctrl = !1),
                (n.act = null),
                J([
                  v("cook", "A WOOKIE!"),
                  N(() => {
                    ((ch2.cook = "down"), (ch2.cookT = 0), (ch2.cookX = 640), (ch2.cookY = 530));
                  }),
                  v("mops", "I'll cook. You keep washing."),
                  N(() => {
                    ((ch2.cook = "down"),
                      (ch2.cookT = 0),
                      (ch2.cookX = 640),
                      (ch2.cookY = 530),
                      (ch2.peek = 0),
                      (ch2.peekT = 6),
                      (ch2.eye = 0),
                      (n.mo.x = 700),
                      (n.mo.y = 500),
                      (n.mo.f = -1),
                      (n.moPose = "stand"),
                      switchTo("squatch"),
                      (n.ctrl = !0));
                  }),
                ]));
            return;
          }
        } else ch2.eye = 0;
        ch2.peek <= 0 &&
          !ch2.eye &&
          ((ch2.peekT = o ? 4 + Math.random() : 6 + Math.random() * 2),
          n.sqPose === "hidden" && x.spot === 62 && ((n.sqPose = "stand"), (x.spot = -1)));
        return;
      }
      // The warning (task T20): Gloop comes to the window and its frame flashes for WINDOW_WARN seconds before she looks.
      n.ctrl && ((ch2.peekT -= l), ch2.peekT <= 0 && ((ch2.warn = WINDOW_WARN), kV("gloop", "Order up?"), D.open()));
    }
    function NA(l) {
      n.scene.startsWith("G") &&
        ((n.chip = ch2Chip()),
        n.room === "gas" && !de() && MA(l),
        de() || (EA(l), wA(l), GA(l)),
        n.room !== "gas" && qSec(l),
        ch2.phase === "g3hide" &&
          n.ctrl &&
          ((ch2.timer -= l),
          ch2.timer <= 0 &&
            n.sqPose !== "hidden" &&
            capture("bots3")),
        n.ctrl && (n.act = RA()));
    }
    function dn(l, o, i) {
      ((x.spot = i), (n.sqPose = "hidden"), (n.sq.x = l), (n.sq.y = o), (n.sq.moving = !1), D.hide());
    }
    // Chapter 2's spots, in the order the picker tries them (see spot in 00-core.js).
    function ch2Spots() {
      let l = n.sq,
        o = n.mo,
        i = ch2.phase,
        gasSq = n.room === "gas" && !x.mops,
        diner = n.room === "diner" && x.mops,
        kitSq = n.room === "kitchen" && !x.mops,
        kitMo = n.room === "kitchen" && x.mops,
        wash = i === "wash1" || i === "wash5",
        q = i === "wash1" ? 0 : 3;
      return [
        spot({
          id: "ddoor",
          verb: "ENTER",
          cap: "diner door",
          who: "mo",
          x: po.x,
          y: po.y + 70,
          r: 90,
          at: [po.x, po.y - 20],
          when: n.room === "gas" && x.mops && i === "g1door",
          hot: !0,
          f: () => {
            ((n.chip = ""), Wh(!0));
          },
        }),
        spot({
          id: "crateg",
          verb: "HIDE",
          cap: "crate",
          who: "sq",
          x: ht.x,
          y: ht.y,
          r: 80,
          at: [ht.x, ht.y - 100],
          when: gasSq && i === "g1" && n.sqPose !== "hidden",
          hot: !0,
          f: () => {
            (dn(ht.x, ht.y, 60), n.pulse.delete("crateg"), zA());
          },
        }),
        spot({ id: "backd", verb: "ENTER", cap: "kitchen door", who: "sq", x: Sa.x, y: Sa.y + 40, r: 90, at: [Sa.x, Sa.y - 100], when: gasSq && i === "back", hot: !0, f: DA }),
        spot({
          id: "lure",
          verb: "HIDE",
          cap: "crate",
          who: "sq",
          x: _e.x,
          y: _e.y,
          r: 80,
          at: [_e.x, _e.y - 100],
          when: gasSq && i === "g6" && n.sqPose !== "hidden",
          hot: !0,
          f: () => {
            (dn(_e.x, _e.y, 61), n.pulse.delete("lure"));
          },
        }),
        spot({ id: "ship", verb: "BOARD", cap: "ship", who: "sq", x: C0.x - 40, y: 500, r: 90, at: [C0.x - 40, 360], when: gasSq && i === "g6" && ch2.fuel && n.sqPose !== "hidden", hot: !0, f: YA }),
        spot({
          id: "sing",
          verb: x.sing ? "STOP" : "SING",
          cap: x.sing ? "singing" : "lure song",
          who: "sq",
          at: [_e.x, _e.y - 110],
          when: gasSq && i === "g6" && n.sqPose === "hidden" && x.spot === 61,
          hot: !x.sing,
          f: x.sing
            ? () => {
                ((x.sing = !1), (n.sqPose = "hidden"));
              }
            : () => {
                ((x.sing = !0), D.snore());
              },
        }),
        spot({
          id: "rusty",
          verb: "GIVE",
          cap: "coins",
          who: "mo",
          x: ch2.rust.x,
          y: 470,
          r: 110,
          at: [ch2.rust.x, 330],
          when: n.room === "gas" && x.mops && i === "g6" && ch2.has === "coins",
          hot: !0,
          f: QA,
        }),
        spot({
          id: "cloche",
          verb: "LIFT",
          cap: "lid",
          who: "mo",
          x: Ma.x,
          y: Ma.y,
          r: 70,
          at: [Ma.x, 270],
          when: diner && !ch2.cloche,
          f: () => {
            ((ch2.cloche = !0), ee("funny", "pea", Ma.x, 260), TV([v("blorp", "Don't rush me.")]));
          },
        }),
        spot({
          id: "frame",
          verb: "FLIP",
          cap: "picture",
          who: "mo",
          x: oa.x,
          y: oa.y,
          r: 70,
          at: [oa.x, 120],
          when: diner && !ch2.flipFrame,
          f: () => {
            ((ch2.flipFrame = !0), ee("funny", "employee", oa.x, 120), TV([v("mops", "Employee of the Month: the mop. Every month.")]));
          },
        }),
        spot({
          id: "postcard",
          verb: "FLIP",
          cap: "postcard",
          who: "mo",
          x: B0.x,
          y: B0.y,
          r: 70,
          at: [B0.x, 170],
          when: diner && !ch2.flipCard,
          f: () => {
            ((ch2.flipCard = !0),
              ee("secret", "postcard", B0.x, 170),
              TV([{ k: "panel", id: "postcard" }, v("mops", "Furry pancakes... on Mars. Hm.")]));
          },
        }),
        spot({ id: "counter", verb: "ASK", cap: "for work", who: "mo", x: Ul.x, y: Ul.y, r: 80, at: [Ul.x, 210], when: diner && i === "g2", hot: !0, f: UA }),
        spot({
          id: "jar",
          verb: "GRAB",
          cap: "tip jar",
          who: "mo",
          x: Dl.x,
          y: Dl.y,
          r: 70,
          at: [Dl.x, 290],
          when: diner && (i === "g4" || i === "g6d") && ch2.jar > 0 && !ch2.has,
          hot: !0,
          f: () => {
            ((ch2.jar = 0), (ch2.has = "coins"), D.pickup(), n.pulse.delete("jar"), n.pulse.add(ch2.phase === "g6d" ? "dfront" : "counter"));
          },
        }),
        spot({
          id: "counter",
          verb: "ASK",
          cap: "Gloop",
          who: "mo",
          x: Ul.x,
          y: Ul.y,
          r: 90,
          at: [Ul.x, 210],
          when: diner && i === "g4" && !ch2.has,
          hot: !0,
          f: () => {
            ((n.ctrl = !1),
              J([
                v("gloop", "The jar has " + ch2.jar + " coins. Soup is 30. The tank is 30."),
                v("mops", "Soup instead of gas. Squatch is hungry."),
                N(() => {
                  n.ctrl = !0;
                }),
              ]));
          },
        }),
        spot({
          id: "counter",
          verb: "BUY",
          cap: "soup 30",
          who: "mo",
          x: Ul.x,
          y: Ul.y,
          r: 80,
          at: [Ul.x, 210],
          when: diner && i === "g4" && ch2.has === "coins",
          hot: !0,
          f: () => {
            ((n.ctrl = !1),
              n.pulse.delete("counter"),
              J([
                v("mops", "One soup, to go."),
                v("gloop", "30 coins. Soup's on, sweetie."),
                v("mops", "Soup instead of gas. He's hungry."),
                v("mops", "Balanced on my head. Don't bump me."),
                N(() => {
                  (ch2.has === "coins" && ((ch2.has = "soup"), (ch2.jar = 0), (ch2.reg += 30)),
                    n.act && n.act.verb === "BUY" && ((n.act = null), p.verb.endsWith("BUY") && ((p.verb = ""), t.onVerb(""))),
                    D.grab(),
                    n.pulse.add("kdoor"),
                    (n.ctrl = !0));
                }),
              ]));
          },
        }),
        spot({ id: "kdoor", verb: "ENTER", cap: "kitchen", who: "mo", x: Cl.x, y: Cl.y + 40, r: 90, at: [Cl.x - 20, 300], when: diner && i === "g4" && ch2.has === "soup", hot: !0, f: LA }),
        spot({ id: "dfront", verb: "EXIT", cap: "the lot", who: "mo", x: 48, y: 470, r: 70, at: [48, 250], when: diner && i === "g6d" && ch2.has === "coins", hot: !0, f: l2 }),
        spot({
          id: "kdoor",
          verb: "BACK",
          cap: "kitchen",
          who: "mo",
          x: Cl.x,
          y: Cl.y + 40,
          r: 90,
          at: [Cl.x - 20, 300],
          when: diner && kitchenPhase(i),
          hot: !0,
          f: () => {
            roomLine("Mops goes back to the kitchen.");
            beginRoomWalk({
              outWho: "mo",
              exitX: 1010,
              exitY: 520,
              fromLeft: !0,
              ctrlAfter: !0,
              arrive: () => {
                (n.room = "kitchen"), (n.mo.x = 110), (n.mo.y = 500), (n.mo.f = 1);
              },
            });
          },
        }),
        spot({
          id: "range",
          verb: "COOK",
          cap: "ticket",
          who: "mo",
          x: Hn.x,
          y: 500,
          r: 110,
          at: [Hn.x, 360],
          when: kitMo,
          hot: !0,
          f: () => {
            ((ch2.cooked = (ch2.cooked || 0) + 1), kV("mops", "Cooking ticket " + ch2.cooked + "."), D.grab());
          },
        }),
        spot({
          id: "kfront",
          verb: "FRONT",
          cap: "diner",
          who: "mo",
          x: 53,
          y: 500,
          r: 100,
          at: [53, 250],
          when: kitMo,
          hot: !0,
          f: () => {
            roomLine("Mops goes out front.");
            beginRoomWalk({
              outWho: "mo",
              exitX: -40,
              exitY: 500,
              fromLeft: !1,
              entryX: 760,
              entryY: 520,
              ctrlAfter: !0,
              arrive: () => {
                (n.room = "diner"), (n.mo.x = 760), (n.mo.y = 520), (n.mo.f = -1);
              },
            });
          },
        }),
        spot({
          id: "roll",
          verb: "ROLL",
          cap: "into a ball",
          who: "sq",
          at: [l.x, l.y - 150],
          when: kitSq && wash && (ch2.warn > 0 || ch2.peek > 0) && n.sqPose !== "hidden" && n.sqPose !== "ball",
          hot: !0,
          f: () => {
            ((n.sqPose = "ball"), (n.sq.moving = !1), D.hide());
          },
        }),
        spot({
          id: "recipe",
          verb: "OPEN",
          cap: "recipe",
          who: "sq",
          x: la.x,
          y: la.y,
          r: 80,
          at: [la.x, 160],
          when: kitSq && wash && !n.found.has("recipe"),
          f: () => {
            (ee("secret", "recipe", la.x, 160),
              TV([{ k: "panel", id: "recipe" }, v("sq", "Secret ingredient: sasquatch hair?! ...Gross. But I'll keep it secret.")]));
          },
        }),
        spot({
          id: "rail",
          verb: "GRAB",
          cap: "dish",
          who: "sq",
          x: 660,
          y: 430,
          r: 80,
          at: [660, 120],
          when: kitSq && wash && ch2.held < 0 && ch2.done < q + 3,
          hot: !0,
          f: () => {
            ((ch2.held = ch2.done + 1),
              (ch2.scrub = 0),
              D.grab(),
              n.pulse.delete("rail"),
              n.pulse.add("sink"),
              TV([{ k: "panel", id: "tk" + ch2.held }]));
          },
        }),
        spot({ id: "sink", verb: "SCRUB", cap: "dish", who: "sq", x: KV.x, y: KV.y, r: 80, at: [KV.x, 270], when: kitSq && wash && ch2.held > 0, hot: !0, f: $h }),
        spot({
          id: "kcrate",
          verb: "HIDE",
          cap: "crate",
          who: "sq",
          x: xe.x,
          y: xe.y,
          r: 80,
          at: [xe.x, xe.y - 110],
          when: kitSq && i === "g3hide" && n.sqPose !== "hidden",
          hot: !0,
          f: () => {
            (dn(xe.x, xe.y, 63), n.pulse.delete("kcrate"), HA());
          },
        }),
        spot({ id: "sink", verb: "MOP", cap: "pot", who: "mo", x: KV.x, y: KV.y, r: 90, at: [KV.x, 270], when: kitMo && ch2.greasy, hot: !0, f: BA }),
        spot({ id: "kcrate", verb: "LEAVE SOUP", cap: "crate", who: "mo", x: xe.x, y: xe.y, r: 100, at: [xe.x + 10, xe.y - 108], when: kitMo && i === "g4k", hot: !0, f: PA }),
      ];
    }
    function RA() {
      return pick(ch2Spots());
    }
    function Ws() {
      (Ml(2),
        SA(),
        (pa.bot = "Pump Bot"),
        (n.fbPic = ""),
        (n.scene = "G0"),
        (n.room = "gas"),
        (n.live = []),
        switchTo("squatch"),
        (x.spot = -1),
        (x.sing = !1),
        (x.costume = !1),
        n.pulse.clear(),
        (n.chip = ""),
        (n.ctrl = !1),
        (B.nextBeat = "Ch3"),
        (n.sq = { x: 760, y: 540, f: -1, walk: 0, moving: !1 }),
        (n.mo = { x: 850, y: 545, f: -1, walk: 0, moving: !1 }),
        (n.sqPose = "stand"),
        (n.moPose = "stand"),
        J([
          { k: "card", id: "ch2", text: "Chapter 2 \xB7 Gas Stop" },
          v("mops", "They put us off here. This is the gas stop."),
          v("mops", "Locals still fear Sasquatches. Troopers are the greater danger. Neither is safe."),
          v("sq", "Not the scrubbers? ...Ooh, chili."),
          v("mops", "Hide by the pump first. Stay out of sight."),
          N(() => {
            ((n.scene = "G1"), (ch2.phase = "g1"), n.pulse.add("crateg"), (n.ctrl = !0));
          }),
        ]));
    }
    function zA() {
      ((n.ctrl = !1),
        (n.act = null),
        J([
          uV(0.4),
          v("gloop", "Rusty! Customers want gas!"),
          v("rust", "Nobody touches my pump! Not without coins."),
          v("sq", "We don't have coins...", "whisper"),
          v("mops", "Then we earn some. Leave it to me."),
          N(() => {
            (Ta("sneak-g1"), switchTo("mops", "g1-door"), (ch2.phase = "g1door"), (n.chip = ch2Chip()), (n.ctrl = !0), (n.mo.moving = !1));
          }),
        ]));
    }
    function Wh(live) {
      let arrive = () => {
        (roomLine("Mops goes inside."),
          (n.scene = "G2"),
          (ch2.phase = "g2"),
          (n.room = "diner"),
          (n.live = []),
          switchTo("mops"),
          (n.mo.x = mf.x + 40),
          (n.mo.y = 560),
          (n.mo.f = 1),
          (n.mo.walk = 0),
          (n.mo.moving = !1),
          (n.moPose = "stand"),
          n.pulse.clear(),
          n.pulse.add("counter"),
          (n.ctrl = !0));
      };
      // The diner door from play walks out and in. A scene jump (sceneG2) just arrives.
      live
        ? beginRoomWalk({ outWho: "mo", exitX: po.x, exitY: po.y, fromLeft: !0, entryX: mf.x + 40, entryY: 560, ctrlAfter: !0, arrive })
        : arrive();
    }
    function UA() {
      ((n.ctrl = !1),
        n.pulse.delete("counter"),
        J([
          v("mops", "Got any work? We need gas money."),
          v("gloop", "Dishwasher quit. Sink's in the back. Tips go in the jar."),
          v("mops", "Squatch... the kitchen has a back door.", "whisper"),
          N(() => {
            ((n.scene = "G2b"),
              (ch2.phase = "back"),
              (n.room = "gas"),
              switchTo("squatch", "g2-back"),
              (n.mo.x = -200),
              (n.sqPose = "hidden"),
              (x.spot = 60),
              (n.sq.x = ht.x),
              (n.sq.y = ht.y),
              n.pulse.clear(),
              n.pulse.add("backd"),
              (n.ctrl = !0));
          }),
        ]));
    }
    function DA() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.clear(),
        D.open(),
        roomLine("Squatch sneaks into the kitchen."),
        beginRoomWalk({
          outWho: "sq",
          exitX: -40,
          exitY: 470,
          fromLeft: !0,
          entryX: 120,
          entryY: 470,
          ctrlAfter: !1,
          arrive: () => {
            (n.room = "kitchen"), (n.scene = "G2k"), (n.sq.x = 120), (n.sq.y = 470), (n.sqPose = "stand"), (x.spot = -1);
          },
        }),
        J([
          cV(() => !n.roomWalk),
          v("sq", "Dishes! I'm GREAT at dishes."),
          N(() => {
            ((ch2.phase = "wash1"), (ch2.peekT = 7), n.pulse.add("rail"), (n.ctrl = !0));
          }),
        ]));
    }
    function $h() {
      if ((ch2.scrub++, D.splash(), (ch2.dishN = Math.min(3, ch2.scrub)), (ch2.dishT = 1.05), ch2.scrub < 3)) return;
      if (ch2.phase === "wash5" && ch2.held === 6 && ch2.mopN < 3) {
        CA();
        return;
      }
      ((ch2.done = ch2.held),
        (ch2.held = -1),
        (ch2.scrub = 0),
        D.pickup(),
        n.pulse.delete("sink"),
        ch2.done === 2 && kV("blorp", "*sniff* ...It's SPOTLESS!"));
      let l = ch2.phase === "wash1" ? 3 : 6;
      if (ch2.done < l) {
        n.pulse.add("rail");
        return;
      }
      ((ch2.dishT = 0),
        (n.ctrl = !1),
        (ch2.warn = 0),
        (ch2.peek = 0),
        (n.act = null),
        J(
          l === 3
            ? [
                v("gloop", "That goat washes FAST."),
                N(() => {
                  ((ch2.jar = 30), D.pickup());
                }),
                v("sq", "She thinks the goat did it.", "whisper"),
                N(e2),
              ]
            : [
                v("gloop", "That goat washes FAST."),
                N(() => {
                  ((ch2.jar = 30), D.pickup());
                }),
                N(n2),
              ],
        ));
    }
    function CA() {
      ((ch2.dishT = 0),
        (ch2.scrub = 0),
        (ch2.greasy = !0),
        (n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        (ch2.warn = 0),
        (ch2.peek = 0),
        (ch2.peekT = 99),
        n.pulse.delete("sink"),
        J([
          v("sq", "This pot is GLUED with grease!"),
          v("sq", "Paws won't do it. Mops! Bring the mop!", "whisper"),
          N(() => {
            (D.open(),
              (n.sq.x = KV.x - 110),
              (n.sq.f = 1),
              (n.mo = { x: Ln.x + 10, y: 470, f: -1, walk: 0, moving: !1 }),
              (n.moPose = "stand"));
          }),
          v("mops", "Stand back, kiddo."),
          N(() => {
            (switchTo("mops", "g5-mop"), n.pulse.add("sink"), (n.ctrl = !0));
          }),
        ]));
    }
    function BA() {
      (ch2.mopN++,
        D.splash(),
        of(KV.x + E(-30, 30), 300, "#8fdcff"),
        !(ch2.mopN < 3) &&
          ((n.ctrl = !1),
          (n.act = null),
          (n.mo.moving = !1),
          (ch2.greasy = !1),
          n.pulse.delete("sink"),
          D.pickup(),
          J([
            v("mops", "Twenty years of floors. Pots are easy."),
            v("sq", "Shiny!"),
            cV((l) => mV(n.mo, 760, 520, 200, l)),
            N(() => {
              ((n.mo.x = 760),
                (n.mo.y = 520),
                (n.mo.f = -1),
                switchTo("squatch"),
                (ch2.peekT = 4),
                (ch2.scrub = 2),
                $h(),
                !de() && !n.q.length && (n.ctrl = !0));
            }),
          ])));
    }
    function V2() {
      ((ch2.bots = [
        { x: -40, y: 520, hx: 420, f: 1, look: 0 },
        { x: -120, y: 520, hx: 600, f: 1, look: 0 },
      ]),
        (ch2.botsIn = !0),
        (ch2.timer = 5.5),
        (ch2.phase = "g3hide"),
        n.pulse.add("kcrate"),
        (n.ctrl = !0));
    }
    function e2() {
      ((n.scene = "G3"),
        (ch2.phase = "g3"),
        J([
          v("gloop", "Ooh, my show!"),
          N(() => {
            ch2.tv = !0;
          }),
          v("tv", "WOOKIE SPOTTED IN SPACE! Last seen near Stormtop.", "pa"),
          v("gloop", "That broadcast. Pump bots! Check the back!"),
          N(V2),
        ]));
    }
    function GA(l) {
      if (ch2.botsIn) for (let o of ch2.bots) o.x = Math.min(o.hx, o.x + 150 * l);
    }
    function HA() {
      ((n.ctrl = !1),
        (n.act = null),
        (ch2.phase = "g3h"),
        J([
          cV(() => ch2.bots.every((l) => l.x >= l.hx)),
          N(() => {
            ((ch2.bots[0].f = 1), (ch2.bots[1].f = -1));
          }),
          v("bot", "You watch the crate."),
          v("bot2", "No, YOU watch the crate."),
          v("sq", "They're looking for ME.", "whisper"),
          N(() => {
            Ta("sneak-g3");
          }),
          N(t2),
        ]));
    }
    function t2() {
      ((n.scene = "G4"),
        (ch2.phase = "g4"),
        (n.room = "diner"),
        switchTo("mops", "g3-front"),
        (ch2.tv = !1),
        (n.mo = { x: 600, y: 500, f: -1, walk: 0, moving: !1 }),
        n.pulse.clear(),
        (n.ctrl = !1),
        J([
          v("mops", "I'm hungry. Let's ask Gloop what the jar covers."),
          N(() => {
            (n.pulse.add("jar"), n.pulse.add("counter"), (n.ctrl = !0));
          }),
        ]));
    }
    function LA() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.clear(),
        D.open(),
        roomLine("Mops brings the soup into the kitchen."),
        beginRoomWalk({
          outWho: "mo",
          exitX: 1010,
          exitY: 520,
          fromLeft: !0,
          entryX: 150,
          entryY: 520,
          ctrlAfter: !0,
          arrive: () => {
            (n.room = "kitchen"), (n.mo.x = 150), (n.mo.y = 520), (n.mo.f = 1), n.pulse.add("kcrate");
          },
          // EA counts argueT whenever the phase is g4k, even with control off. Arm it when the
          // walk ends, so the 2.4 s before the bots speak is the same as it was before the walk.
          done: () => {
            (ch2.phase = "g4k"), (ch2.argueT = 2.4), (ch2.out = -1);
          },
        }));
    }
    function PA() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.clear(),
        (ch2.has = ""),
        (ch2.sqBowl = "crate"),
        (ch2.phase = "g4l"),
        (ch2.botsIn = !1),
        D.grab(),
        (ch2.out = -1),
        (ch2.bots[0].f = 1),
        (ch2.bots[1].f = -1),
        J([
          uV(0.5),
          v("sq", "Soup! And a note...", "whisper"),
          { k: "panel", id: "note2" },
          v("sq", "THE GUARDIANS FOUND ME IN SPACE!", "whisper"),
          { k: "panel", id: "stamp" },
          v("mops", "...Eat up, kiddo.", "whisper"),
          N(() => {
            Ta("sneak-g4");
          }),
          v("gloop", "Bots! Go watch the dock."),
          cV((l) => {
            let o = !0;
            for (let i of ch2.bots) ((i.f = -1), (i.x -= 160 * l), i.x > -60 && (o = !1));
            return o;
          }),
          N(a2),
        ]));
    }
    function a2() {
      ((n.scene = "G5k"),
        (ch2.bots = []),
        (ch2.botsIn = !1),
        (n.room = "kitchen"),
        switchTo("squatch", "g4-wash"),
        (n.mo = { x: 700, y: 500, f: -1, walk: 0, moving: !1 }),
        (n.moPose = "stand"),
        (ch2.sqBowl = "counter"),
        (n.sqPose = "stand"),
        (x.spot = -1),
        (n.sq.x = xe.x + 60),
        (n.sq.y = 520),
        (ch2.phase = "wash5"),
        (ch2.peekT = 4.5),
        n.pulse.clear(),
        n.pulse.add("rail"),
        (n.ctrl = !1),
        J([
          v("mops", "Hungry. I'll cook the tickets, then ask Gloop what the jar covers."),
          v("gloop", "The janitor is on those tickets."),
          N(() => {
            n.ctrl = !0;
          }),
        ]));
    }
    function n2() {
      ((n.scene = "G6"),
        (ch2.phase = "g6d"),
        (n.room = "diner"),
        (n.sqPose = "hidden"),
        (x.spot = -1),
        (n.sq.x = -200),
        switchTo("mops", "g5-jar"),
        (n.mo = { x: 600, y: 500, f: -1, walk: 0, moving: !1 }),
        n.pulse.clear(),
        (n.ctrl = !1),
        J([
          v("mops", "New jar. Thirty coins. Tank time."),
          N(() => {
            (n.pulse.add("jar"), (n.ctrl = !0));
          }),
        ]));
    }
    function l2() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.clear(),
        D.open(),
        roomLine("Mops goes out to the pump."),
        (n.room = "gas"),
        (ch2.phase = "g6"),
        (n.mo.x = po.x),
        (n.mo.y = po.y + 70),
        (n.mo.f = 1),
        (ch2.bots = [
          { x: 700, y: 500, hx: 700, f: -1, look: 0 },
          { x: 900, y: 520, hx: 900, f: -1, look: 0 },
        ]),
        (ch2.rust.x = 460),
        (ch2.rust.f = -1),
        (ch2.rust.pause = 0),
        (n.sqPose = "hidden"),
        (n.sq.x = -200),
        (n.sq.y = 470),
        (n.ctrl = !0));
    }
    function QA() {
      ((n.ctrl = !1),
        (n.act = null),
        (ch2.has = ""),
        (ch2.rust.nap = !0),
        J([
          v("rust", "Coins? Pump's yours."),
          N(() => {
            ((ch2.fuel = !0), D.zap());
          }),
          { k: "panel", id: "fuel" },
          v("mops", "Full tank."),
          v("mops", "Bots on the ramp. Squatch, sing from the crate!"),
          N(() => {
            ((n.sq.x = Sa.x), (n.sq.y = 470), (n.sqPose = "stand"), switchTo("squatch", "g6-lure"), n.pulse.add("lure"), (n.ctrl = !0));
          }),
        ]));
    }
    function YA() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.clear(),
        (x.sing = !1),
        Ta("sneak-g6"),
        J([
          He(n.sq, C0.x - 40, 470, 170),
          v("sq", "Next stop: Phobos!"),
          N(() => {
            ((n.sqPose = "hidden"), (n.sq.x = C0.x - 40));
          }),
          He(n.mo, C0.x, 480, 170),
          v("mops", "The board says Phobos. Then Mars."),
          N(() => {
            n.moPose = "hidden";
          }),
          N(() => {
            (ch2.caught === 0 && !n.found.has("ghost2") && (n.found.add("ghost2"), (n.stars += 250)), (B.nextBeat = "Ch3"));
          }),
          { k: "panel", id: "tally2" },
          N(aq),
        ]));
    }
    function o2() {
      let l = ["postcard", "recipe"],
        o = ["pea", "employee"],
        i = ["sneak-g1", "sneak-g3", "sneak-g4", "sneak-g6"],
        s = ch2.caught;
      return [
        "Secrets found " + l.filter((q) => n.found.has(q)).length + "/" + l.length,
        "Funny finds " + o.filter((q) => n.found.has(q)).length + "/" + o.length,
        "Sneaky! " + i.filter((q) => n.found.has(q)).length + "/" + i.length,
        "Times caught " + s,
        ...(s === 0 ? [NEVER_CAUGHT, NEVER_CAUGHT_WHY] : [NEVER_CAUGHT_TODO]),
        "Chapter score \u2605 " + (n.stars - ch2.start),
        "Total \u2605 " + n.stars,
      ];
    }
    // Which room a Chapter 2 speaker is in. "" means the room the player sees (Gloop shows through a window in every room).
    function speakerRoom(l) {
      if (l === "rust") return "gas";
      if (l === "blorp") return "diner";
      if (l === "cook") return "kitchen";
      if (l === "bot" || l === "bot2") return ch2.bots && ch2.bots.length ? (ch2.phase === "g6" ? "gas" : "kitchen") : "";
      if (l === "sq") return sqAway() ? "kitchen" : "";
      return "";
    }
    // Where a voice from another room is heard: the door on that side.
    const EAR_DOORS = {
      kitchen: { diner: { x: 60, y: 330 }, gas: { x: 60, y: 330 } },
      diner: { kitchen: { x: 880, y: 330 }, gas: { x: 60, y: 330 } },
      gas: { diner: { x: 300, y: 300 }, kitchen: { x: 85, y: 300 } },
    };
    function earAt(l) {
      if (!n.scene.startsWith("G")) return null;
      let room = speakerRoom(l);
      if (room && room !== n.room) return (EAR_DOORS[n.room] && EAR_DOORS[n.room][room]) || { x: 60, y: 330 };
      let who = l === "sq" ? n.sq : l === "mops" ? n.mo : null;
      return who && (who.x < -100 || who.x > c + 100) ? { x: who.x < 0 ? 40 : c - 40, y: 330 } : null;
    }
    function IA(l) {
      if (!n.scene.startsWith("G")) return null;
      if (l === "cook") return { x: ch2.cookX || 640, y: (ch2.cookY || 530) - 110 };
      if (l === "gloop")
        // In the kitchen her lines sit just right of the order window, so the tickets in the pass stay readable.
        return n.room === "kitchen" ? { x: xt.x + 70, y: xt.y - 20 } : n.room === "gas" ? { x: 210, y: 180 } : { x: 480, y: 150 };
      if (l === "rust") return { x: ch2.rust.x, y: 360 };
      if (l === "blorp") return { x: Ma.x, y: 330 };
      if (l === "bot" || l === "bot2") {
        let o = ch2.bots[l === "bot" ? 0 : 1];
        return o ? { x: o.x, y: o.y - 90 } : { x: c / 2, y: 200 };
      }
      return null;
    }
    function KA(l, o, i, s, q) {
      let d = q ? -14 : 0;
      (e.save(),
        e.translate(l, o + d),
        e.scale(2.1, 2.1),
        m(-8, -6, 7, 20, 2),
        r("#2b3a67", 2),
        m(1, -6, 7, 20, 2),
        r("#2b3a67", 2),
        m(-14, -36, 28, 32, 9),
        r("#ff8a3d", 2.5),
        m(-9, -30, 18, 18, 3),
        r("#2b3a67", 2),
        F(-5, -28, 1.5, "#ffcf33"),
        F(5, -28, 1.5, "#ffcf33"),
        L(0, -48, 12),
        r("#f0bf93", 2.5),
        X(i * 3, -42, 7, 2.6),
        r("#7a4a2a", 1.2),
        F(i * 4 - 3, -51, 1.7, y),
        F(i * 4 + 4, -51, 1.7, y),
        m(-13, -64, 26, 10, 4),
        r("#e5533d", 2),
        m(i > 0 ? 6 : -20, -58, 14, 4, 2),
        r("#e5533d", 1.5),
        g("R", 0, -59, 6, "#ffffff", "center", 900),
        ch2.rustBowl && (X(0, -14, 11, 5), r("#ffffff", 2), X(0, -16, 9, 3), r("#b83a1d", 0)),
        e.restore(),
        q && g("!", l, o - 160, 40, "#e5533d", "center", 900));
    }
    let Ao = !1,
      $s = {},
      XA = {
        blorp: "EEK! A Squatch near my soup!",
        zip: "Whoa! A Squatch! ...Pretzel?",
        gloop: "A Squatch?! Back from the counter!",
        mom: "Is that... a very hairy goat?",
        dad: "Shoo, shaggy! Health rules!",
      },
      // The chip drawn on the last frame, for tests ("" when none).
      chipDrawn = "";
    function i2() {
      return n.on && p.state === "op" && !(n.cur && n.cur.k !== "bub");
    }
    function pf(l, o, i, s, q = !1) {
      if (Ao || !i2()) return;
      let d = q ? 300 : 165,
        A = (s >= 0 ? 0.3 : Math.PI - 0.3) + (q ? 0.12 : 0.28) * Math.sin(n.T * 0.9 + o * 0.013),
        T = o + s * 12,
        R = i - 60,
        P = n.T - ($s[l] ?? -9) < 1.6;
      if (
        (x.mops || Fh(T, R, A, q ? 0.3 : 0.42, d, q ? "sec" : "civ", P),
        q ||
          P ||
          !n.ctrl ||
          sqAway() ||
          n.sqPose === "hidden" ||
          n.sq.x < -100 ||
          n.T - ($s[l] ?? -9) < 3.5 ||
          !vt(n.sq.x, n.sq.y - 40, T, R, A, 0.42, d))
      )
        return;
      $s[l] = n.T;
      let _ = n.room === "hall" ? o - B.camX : o;
      (n.sparks.push({ x: _ - 58, y: i - 200, t: 2.2, s: "!" }),
        kV(l, XA[l] || "!!"),
        l === "zip" ? sSec("zip", l) : (l === "gloop" || l === "blorp") && n.scene.startsWith("G") && sSec("diner", l));
      let $ = n.sq.x - o,
        gV = n.sq.y - i,
        oe = Math.hypot($, gV) || 1,
        ve = sn();
      n.sqHop ||
        (n.sqHop = {
          x0: n.sq.x,
          y0: n.sq.y,
          x1: w(n.sq.x + ($ / oe) * 70, ve.x0, ve.x1),
          y1: w(n.sq.y + (gV / oe) * 40, ve.y0, ve.y1),
          t: 0,
          dur: 0.25,
        });
      n.log.push({ who: "", text: "[seen by " + l + "]", kind: "t" });
    }
    function _A(l, o, i) {
      if (Ao || !i2() || n.sq.x < -100) return;
      let s = i >= 0 ? 0.25 : Math.PI - 0.25,
        q = l + i * 12,
        d = o - 70,
        A = n.T - (n.heartT ?? -9) < 1.2;
      if (
        (Bl(q, d, s, 0.45, 190, A ? "rgba(255,95,168,.30)" : "rgba(255,170,200,.22)"),
        n.sqPose === "hidden" || n.T - (n.heartT ?? -9) < 2.5 || !vt(n.sq.x, n.sq.y - 40, q, d, s, 0.45, 190))
      )
        return;
      n.heartT = n.T;
      let T = n.room === "hall" ? l - B.camX : l;
      n.sparks.push({ x: T, y: o - 190, t: 1.6, s: "\u2665" });
    }
    function eq(l, o, i) {
      (i >= 1 && ch2.peek <= 0 && pf("gloop", l, o, -1),
        e.save(),
        e.translate(l, o),
        e.scale(i, i),
        XV(0, -30, 34, 34, 10, 3, n.T),
        wV("#7ad35a", 3),
        m(-18, -22, 36, 26, 6),
        r("#ffffff", 2.5));
      for (let s of [-10, 10]) (C([s, -58, s * 1.4, -78], y, 3), L(s * 1.4, -82, 8), r("#ffffff", 2.5), F(s * 1.4 + 1, -81, 3, y));
      (e.beginPath(),
        e.arc(0, -40, 10, 0.2, Math.PI - 0.2),
        (e.strokeStyle = y),
        (e.lineWidth = 2.5),
        e.stroke(),
        m(-20, -104, 40, 18, 8),
        r("#ffffff", 2.5),
        e.restore());
    }
    function FA(l, o) {
      (pf("blorp", l, o, l > 480 ? -1 : 1),
        C([l - 16, o, l - 10, o - 60], y, 4),
        C([l + 16, o, l + 10, o - 60], y, 4),
        X(l, o - 64, 28, 8),
        r("#e5533d", 3),
        X(l, o - 96, 26, 26),
        r("#a98bff", 3),
        C([l, o - 122, l + 6, o - 140], y, 3),
        F(l + 6, o - 142, 4, "#ffcf33"),
        X(l - 8, o - 100, 5, 6),
        r("#ffffff", 1.5),
        X(l + 10, o - 100, 5, 6),
        r("#ffffff", 1.5),
        F(l - 7, o - 99, 2, y),
        F(l + 11, o - 99, 2, y));
    }
    function f2(l, o, i) {
      if (o) {
        let A = Zh(l);
        seenCone(A.ox, A.oy, A.a, 0.6, A.len, i ? "rgba(229,83,61,.28)" : "rgba(255,207,51,.28)");
      }
      let { x: s, y: q, f: d } = l;
      (X(s, q, 30, 9),
        r("rgba(30,36,48,.18)", 0),
        m(s - 26, q - 70, 52, 62, 12),
        r("#e5533d", 3),
        m(s - 18, q - 60, 36, 22, 4),
        r("#8fdcff", 2.5),
        F(s + d * 8 - 4, q - 50, 3, y),
        F(s + d * 8 + 6, q - 50, 3, y),
        g("PUMP", s, q - 24, 10, "#ffffff", "center", 900),
        L(s - 14, q - 4, 7),
        r("#59657d", 2),
        L(s + 14, q - 4, 7),
        r("#59657d", 2),
        C([s, q - 70, s, q - 86], y, 3),
        F(s, q - 88, 4, l.look > 0 ? "#ffcf33" : "#2bc48a"));
    }
    function tq(l, o, i, s) {
      (ringOf(s), Ys(l, o), i && ga(l, o - 58));
    }
    function kitchenPhase(ph) {
      // Phases whose work happens in the kitchen.
      return ["wash1", "wash5", "g3", "g3hide", "g3h", "g4k", "g4l"].includes(ph);
    }
    function sqAway() {
      // True while Mops is out front and Squatch is still back in the kitchen.
      return n.room === "diner" && !!x.mops && kitchenPhase(ch2.phase);
    }
    function soupOnHead() {
      // A steaming bowl of soup with a spoon, resting on Mops' head. Mops is drawn at scale he * 1.15;
      // his head is a circle at (17, -29), radius about 8.5, so its top is 37.5 units above his feet.
      let S = he * 1.15,
        f = n.mo.f || 1,
        hx = n.mo.x + 17 * S * f,
        top = n.mo.y - 37.5 * S,
        by = top + Math.sin(n.T * 3) * 1.5,
        cy = by - 20;
      n.soupAt = { x: hx - 28, w: 56, bottom: by, headTop: top };
      for (let i of [-12, 0, 12]) {
        let pts = [];
        for (let j = 0; j <= 6; j++) pts.push(hx + i + Math.sin(n.T * 4 + j + i) * 3, cy - 12 - j * 5);
        (C(pts, y, 5), C(pts, "#ffffff", 2.5));
      }
      (C([hx + 6 * f, cy - 4, hx + 24 * f, cy - 30], y, 7),
        C([hx + 6 * f, cy - 4, hx + 24 * f, cy - 30], "#c9ced8", 4),
        e.beginPath(),
        e.ellipse(hx, cy, 28, 20, 0, 0, Math.PI),
        e.closePath(),
        r("#ffffff", 3),
        X(hx, cy, 28, 7),
        r("#f2b84b", 3),
        L(hx - 8, cy - 1, 2.5),
        r("#e07b00", 0),
        L(hx + 9, cy + 1, 2),
        r("#7ad35a", 0));
    }
    function yn(l) {
      (n.moPose !== "hidden" &&
        n.mo.x > -100 &&
        l.push({
          y: n.mo.y,
          d: () => {
            Fe(n.mo.x, n.mo.y, he * 1.15, {
              f: n.mo.f,
              walk: n.mo.moving ? n.mo.walk : 0,
              mop: !(n.room === "kitchen" && !ch2.greasy && (ch2.phase === "wash5" || n.scene === "G5k")),
            });
            let o = n.mo.x + n.mo.f * 34,
              i = n.mo.y - 60;
            if (ch2.has === "coins") for (let s = 0; s < 4; s++) (X(o, i - s * 5, 10, 4), r("#ffcf33", 2));
            (ch2.has === "chili" && (X(o, i, 16, 8), r("#ffffff", 2.5), X(o, i - 3, 13, 4), r("#b83a1d", 0)),
              ch2.has === "soup" && soupOnHead());
          },
        }),
        n.sqPose === "ball" &&
          n.sq.x > -100 &&
          !sqAway() &&
          l.push({
            y: n.sq.y,
            d: () => {
              drawL2Ball(n.sq.x, n.sq.y - 16);
            },
          }),
        n.sqPose !== "hidden" &&
          n.sqPose !== "ball" &&
          n.sq.x > -100 &&
          !sqAway() &&
          l.push({
            y: n.sq.y,
            d: () => {
              Re(n.sq.x, n.sq.y, he * 1, { walk: n.sq.moving ? n.sq.walk : 0, f: n.sq.f });
            },
          }),
        n.sqPose === "hidden" &&
          x.spot === 62 &&
          l.push({
            y: n.sq.y,
            d: () => {
              (e.save(), e.translate(n.sq.x, n.sq.y), e.scale(1, 0.62), Re(0, 0, he, { f: n.sq.f, eyes: "closed" }), e.restore());
            },
          }));
    }
    function JA() {
      ((e.fillStyle = "#1e2430"), e.fillRect(0, 0, c, b));
      for (let A = 0; A < 26; A++) F((A * 113) % c, (A * 37) % 260, 1.6, "#ffffff");
      ((e.fillStyle = "#9c8f80"), e.fillRect(0, 370, c, b - 370), C([0, 370, c, 370], y, 4));
      for (let A = 0; A < 8; A++) (X(60 + A * 120, 600 - (A % 3) * 40, 22, 6), r("#8a7f74", 0));
      (m(30, 120, 340, 260, 10), r("#ffe3c4", 5), m(46, 66, 308, 50, 10), r("#2b3a67", 4));
      let l = Math.sin(n.T * 3) > -0.6;
      (g("GLOOP'S GAS & GRUB", 200, 92, 22, l ? "#ff5fa8" : "#9c4f78", "center", 900),
        m(140, 170, 120, 80, 6),
        r("#8fdcff", 4),
        eq(200, 250, 0.7),
        m(140, 170, 120, 80, 6),
        r(null, 4),
        m(po.x - 30, 290, 60, 90, 4),
        r("#e5533d", 4),
        g("OPEN", po.x, 318, 12, "#ffffff", "center", 900),
        ringOf("backd"),
        m(Sa.x - 28, 300, 56, 80, 4),
        r("#a8743a", 4),
        g("KITCHEN", Sa.x, 290, 10, y, "center", 900));
      let o = C0;
      (m(o.x - 130, o.y - 90, 260, 120, 50), r("#dfe4ea", 5));
      for (let A of [-60, 0, 60]) (L(o.x + A, o.y - 40, 14), r("#8fdcff", 3));
      (e.beginPath(),
        e.moveTo(o.x - 34, o.y + 30),
        e.lineTo(o.x + 34, o.y + 30),
        e.lineTo(o.x + 50, o.y + 130),
        e.lineTo(o.x - 50, o.y + 130),
        e.closePath(),
        r("#b5bcc8", 3));
      let i = o.x - 120,
        s = o.y + 10;
      (m(i - 16, s - 16, 32, 32, 6),
        r("#59657d", 3),
        g("FUEL", i, s + 28, 10, "#ffffff", "center", 900),
        m(i - 10, s - 8, 20, 16, 2),
        r(ch2.fuel ? "#2bc48a" : Math.sin(n.T * 5) > 0 ? "#e5533d" : "#59657d", 2));
      let q = [];
      (q.push({
        y: we.y,
        d: () => {
          (m(we.x - 30, we.y - 120, 60, 120, 8),
            r("#e5533d", 4),
            m(we.x - 20, we.y - 106, 40, 30, 4),
            r("#fff3d6", 2.5),
            g("GAS", we.x, we.y - 91, 14, "#e5533d", "center", 900),
            g("COINS ONLY", we.x, we.y - 56, 8, "#ffffff", "center", 900));
          let A = ch2.hose ? n.mo.x + n.mo.f * 30 : ch2.fuel ? -1 : we.x + 34,
            T = ch2.hose ? n.mo.y - 60 : we.y - 50;
          A > 0 &&
            (e.beginPath(),
            e.moveTo(we.x + 30, we.y - 70),
            e.quadraticCurveTo((we.x + A) / 2, Math.max(we.y + 20, T + 60), A, T),
            (e.strokeStyle = y),
            (e.lineWidth = 6),
            e.stroke(),
            m(A - 6, T - 10, 12, 20, 3),
            r("#59657d", 2));
        },
      }),
        q.push({ y: ht.y, d: () => tq(ht.x, ht.y, n.sqPose === "hidden" && x.spot === 60, "crateg") }),
        (ch2.phase === "g6" || n.scene === "G6") &&
          q.push({
            y: _e.y,
            d: () => {
              (tq(_e.x, _e.y, n.sqPose === "hidden" && x.spot === 61, "lure"),
                x.sing && x.spot === 61 && Pt(_e.x + 30, _e.y - 110 - ((n.T * 30) % 30)));
            },
          }),
        q.push({ y: TA.y, d: () => {} }));
      let d = ch2.rust;
      q.push({
        y: 470,
        d: () => {
          if (!x.mops && !d.nap && !de()) {
            let A = Jh();
            seenCone(A.ox, A.oy, A.a, 0.85, 280, ch2.sec ? "rgba(229,83,61,.34)" : "rgba(255,207,51,.26)");
          }
          KA(d.x, 470, d.f, d.nap, !!ch2.sec);
          if (ch2.sec) {
            (m(ch2.sec.x - 16, ch2.sec.y - 70, 32, 54, 8), r("#3478f6", 3), g("SEC", ch2.sec.x, ch2.sec.y - 78, 12, "#ffffff", "center", 900));
          }
        },
      });
      for (let A of ch2.bots) q.push({ y: A.y, d: () => f2(A, A.look <= 0, A.look <= 0) });
      (yn(q), q.sort((A, T) => A.y - T.y).forEach((A) => A.d()));
    }
    function ZA() {
      ((e.fillStyle = "#ffe9d6"), e.fillRect(0, 0, c, 380));
      for (let o = 0; o < c; o += 40)
        for (let i = 380; i < b; i += 40) ((e.fillStyle = ((o + i) / 40) % 2 ? "#ffffff" : "#e8eef5"), e.fillRect(o, i, 40, 40));
      if (
        (C([0, 380, c, 380], y, 4),
        g("GLOOP'S", 620, 44, 26, "#ff5fa8", "center", 900),
        m(oa.x - 40, 90, 80, 90, 4),
        r("#c9a227", 4),
        m(oa.x - 32, 98, 64, 74, 2),
        r("#fffaf0", 2),
        ch2.flipFrame
          ? (g("EMPLOYEE", oa.x, 108, 9, y, "center", 900),
            g("OF THE MONTH", oa.x, 120, 7, y, "center", 900),
            C([oa.x, 128, oa.x, 166], "#a8743a", 4),
            XV(oa.x, 162, 14, 6, 10, 3, 0),
            wV("#dfe4ea", 2))
          : (e.save(), e.translate(oa.x, 135), e.rotate(0.3), m(-30, -36, 60, 72, 2), r("#d9c7a3", 2.5), e.restore()),
        m(800, 70, 130, 90, 8),
        r("#2b3a67", 4),
        m(810, 80, 110, 70, 4),
        r(ch2.tv ? "#8fdcff" : "#1e2430", 2),
        ch2.tv &&
          (g("NEWS", 865, 96, 12, "#e5533d", "center", 900),
          XV(865, 128, 14, 14, 9, 3, 0),
          wV("#8b4a1c", 2),
          g("?", 865, 128, 14, "#ffffff", "center", 900)),
        ringOf("kdoor"),
        m(Cl.x - 40, 240, 80, 140, 4),
        r("#cfd8e3", 4),
        L(Cl.x, 280, 16),
        r("#8fdcff", 3),
        g("KITCHEN", Cl.x, 230, 10, y, "center", 900),
        ringOf("dfront"),
        m(20, 260, 56, 120, 4),
        r("#e5533d", 4),
        g("EXIT", 48, 300, 12, "#ffffff", "center", 900),
        eq(480, 290, 1.25),
        m(640, 210, 90, 56, 6),
        r("#59657d", 3),
        g("$", 685, 238, 18, "#ffcf33", "center", 900),
        e.save(),
        e.translate(B0.x + 30, 190),
        e.rotate(-0.12),
        m(-26, -18, 52, 36, 3),
        r(ch2.flipCard ? "#fff3d6" : "#ff8a3d", 2.5),
        ch2.flipCard
          ? (g("Greetings", 0, -6, 8, y, "center", 900), g("from MARS!", 0, 6, 8, "#e5533d", "center", 900))
          : g("MARS", 0, 0, 11, "#ffffff", "center", 900),
        e.restore(),
        ch2.reg)
      )
        for (let o = 0; o < ch2.reg / 10; o++) (X(672 + o * 6, 204 - o * 3, 8, 3), r("#ffcf33", 1.5));
      (m(150, 320, 660, 60, 6),
        r("#e5533d", 4),
        m(140, 306, 680, 18, 6),
        r("#fff3d6", 3),
        ringOf("counter"),
        ringOf("jar"),
        m(Dl.x - 20, 250, 40, 56, 8),
        r("rgba(200,235,255,.7)", 3),
        g("TIPS", Dl.x, 262, 9, y, "center", 900));
      for (let o = 0; o < ch2.jar / 10; o++) (X(Dl.x, 298 - o * 6, 12, 4), r("#ffcf33", 1.5));
      (X(Ma.x, 304, 30, 7),
        r("#ffffff", 2.5),
        ch2.cloche
          ? (F(Ma.x, 299, 4, "#2bc48a"),
            e.save(),
            e.translate(Ma.x - 40, 270),
            e.rotate(-0.5),
            e.beginPath(),
            e.arc(0, 0, 22, Math.PI, 0),
            e.closePath(),
            r("#dfe4ea", 3),
            e.restore())
          : (e.beginPath(), e.arc(Ma.x, 302, 26, Math.PI, 0), e.closePath(), r("#dfe4ea", 3), F(Ma.x, 274, 4, y)));
      let l = [];
      (l.push({ y: 470, d: () => FA(Ma.x, 470) }), yn(l), l.sort((o, i) => o.y - i.y).forEach((o) => o.d()));
    }
    function WA() {
      ((e.fillStyle = "#e8f4ff"), e.fillRect(0, 0, c, 380));
      for (let d = 0; d < c; d += 48) C([d, 0, d, 380], "#d2e4f3", 2);
      ((e.fillStyle = "#cfd8e3"),
        e.fillRect(0, 380, c, b - 380),
        C([0, 380, c, 380], y, 4),
        ch2.rumbleT > 0 && (X(n.sq.x, n.sq.y - 36, 16, 9), r("#f2b84b", 2)),
        ch2.greasy &&
          x.mops &&
          (m(n.mo.x - 30, n.mo.y - 78, 60, 24, 6), r("#8fdcff", 3), g("MOP", n.mo.x, n.mo.y - 66, 14, "#1e2430", "center", 800)),
        !x.mops &&
          (ch2.phase === "wash1" || ch2.phase === "wash5") &&
          (m(n.sq.x + 16, n.sq.y - 52, 14, 9, 3), r("#f2c14e", 2), m(n.sq.x + 6, n.sq.y - 34, 12, 8, 4), r("#e7b08a", 2)),
        X(66, 404, 40, 6),
        r("rgba(30,36,48,.16)", 0),
        X(530, 408, 340, 6),
        r("rgba(30,36,48,.14)", 0),
        X(860, 406, 70, 5),
        r("rgba(30,36,48,.14)", 0),
        m(16, 100, 100, 280, 6),
        r("#e5533d", 4),
        m(30, 124, 72, 150, 4),
        r("#c94432", 2),
        g("DINER", 66, 210, 16, "#ffffff", "center", 900),
        m(128, 286, 820, 94, 4),
        r("#c5ced8", 3),
        m(128, 286, 820, 28, 3),
        r("#e7eef4", 3),
        m(128, 360, 820, 20, 2),
        r("#8b97a6", 2),
        m(360, 214, 140, 72, 4),
        r("#d5e4f0", 3));
      (m(500, 44, 300, 210, 8),
        r("#2c3544", 5),
        m(514, 58, 272, 180, 4),
        r("#ffd7a0", 3),
        g("ORDERS", 650, 72, 16, "#fffaf0", "center", 900),
        e.save(),
        e.beginPath(),
        e.rect(514, 58, 272, 180),
        e.clip(),
        windowWatch() ? (e.translate(650, 200), e.scale(1.45, 1.45)) : (e.translate(744, 176), e.scale(1, 1)),
        XV(0, -30, 34, 34, 10, 3, n.T),
        wV("#7ad35a", 3),
        m(-18, -22, 36, 26, 6),
        r("#ffffff", 2.5));
      for (let horn of [-10, 10])
        (C([horn, -58, horn * 1.4, -78], y, 3), L(horn * 1.4, -82, 8), r("#ffffff", 2.5), F(horn * 1.4 + 1, -81, 3, y));
      (e.beginPath(),
        e.arc(0, -40, 10, 0.2, Math.PI - 0.2),
        (e.strokeStyle = y),
        (e.lineWidth = 2.5),
        e.stroke(),
        m(-16, -50, 32, 12, 3),
        r("#ffffff", 2.5),
        e.restore(),
        windowWatch() &&
          (e.save(),
          (e.lineWidth = 14),
          (e.strokeStyle = Math.floor(n.T * 4) % 2 ? "#ffcf33" : "#e5533d"),
          e.strokeRect(500, 44, 300, 210),
          e.restore(),
          g("!", 822, 90, 44, "#e5533d", "center", 900)),
        m(520, 236, 260, 16, 3),
        r("#a8743a", 3),
        C([540, 252, 540, 286], "#a8743a", 4),
        C([760, 252, 760, 286], "#a8743a", 4),
        m(560, 298, 96, 18, 3),
        r("#e6c48a", 2),
        C([590, 302, 630, 312], "#8b97a6", 2));
      (m(748, 290, 112, 22, 3),
        r("#2a3344", 3),
        [
          [768, 296],
          [804, 296],
          [768, 306],
          [804, 306],
        ].forEach(([bx, by]) => {
          (L(bx, by, 6), r("#1e2430", 2), L(bx, by, 2), r("#8b97a6", 0));
        }),
        [762, 786, 810, 834].forEach((kx) => {
          (L(kx, 322, 4), r("#e7eef4", 2));
        }),
        m(756, 330, 96, 42, 4),
        r("#2a3344", 3),
        m(786, 338, 36, 20, 2),
        r("#1e2430", 2),
        m(798, 360, 14, 4, 1),
        r("#c5ced8", 1),
        (ch2.cooked || 0) > 0 && (L(786, 298, 4), r("#e5533d", 0)));
      (m(880, 286, 68, 8, 2),
        r("#a8743a", 2),
        C([890, 286, 890, 270], "#a8743a", 4),
        C([938, 286, 938, 270], "#a8743a", 4),
        m(882, 262, 64, 10, 2),
        r("#a8743a", 2),
        [-22, 0, 22].forEach((dx, i) => {
          (m(914 + dx - 7, 234, 14, 28, 3),
            r("#f4fbff", 2),
            m(914 + dx - 5, 240, 10, 16, 2),
            r(n.found.has("recipe") ? ["#e5533d", "#ffcf33", "#2bc48a"][i] : "rgba(232,244,255,.85)", 1),
            m(914 + dx - 6, 230, 12, 6, 2),
            r("#c5ced8", 1));
        }));
      let l = ch2.phase === "wash5" || n.scene === "G5k" || n.scene === "G6" ? 3 : 0,
        o = Math.max(0, l + 3 - Math.max(ch2.done, ch2.held > 0 ? ch2.held : 0) - (ch2.cooked || 0)),
        shown = Math.min(3, o),
        pitch = 72,
        cardW = 64,
        cardH = 74,
        right = 692;
      shown > 0 && C([right - (shown - 1) * pitch - cardW / 2 - 8, 96, right + cardW / 2 + 8, 96], "#3d4c63", 8);
      for (let d = 0; d < shown; d++) {
        let tx = right - (shown - 1 - d) * pitch,
          num = l + 3 - o + d + 1;
        (m(tx - cardW / 2, 104, cardW, cardH, 4),
          r("#fffaf0", 3),
          C([tx, 96, tx, 104], y, 3),
          g("#" + num, tx, 132, 30, y, "center", 900),
          d === 0 && g("NEXT", tx, 160, 16, "#b45309", "center", 900));
      }
      if (shown > 0) {
        let hx = right,
          hy = 108,
          sx = 732,
          sy = 168,
          ex = 710,
          ey = 136;
        (C([sx, sy, ex, ey], "#4e8a32", 14),
          C([sx, sy, ex, ey], "#7ad35a", 8),
          C([ex, ey, hx, hy], "#4e8a32", 12),
          C([ex, ey, hx, hy], "#7ad35a", 7),
          L(hx + 6, hy + 4, 7),
          r("#fffaf0", 2),
          L(hx, hy, 9),
          r("#e7b08a", 3));
      }
      (n.act && n.act.verb === "GRAB" && (m(400, 248, 88, 28, 10), r("#2bc48a", 3), g("GRAB", 444, 262, 16, "#ffffff", "center", 900)),
        n.act && n.act.verb === "COOK" && (m(868, 332, 70, 26, 10), r("#2bc48a", 3), g("COOK", 903, 345, 14, "#ffffff", "center", 900)),
        ch2.rumbleT > 0 && (X(n.sq.x, n.sq.y - 18, 22, 10), r("#f2b84b", 2)));
      (ringOf("sink"),
        ringOf("rail"),
        C([KV.x, 316, KV.x, 298, KV.x + 26, 298], "#8b97a6", 5),
        L(KV.x + 26, 304, 5),
        r("#8fdcff", 2),
        m(KV.x - 50, 320, 100, 22, 6),
        r("#8fdcff", 3));
      let i = Math.max(0, l + 3 - ch2.done - (ch2.held > 0 ? 1 : 0));
      for (let d = 0; d < Math.min(3, i); d++) (X(KV.x - 90, 324 - d * 8, 22, 6), r("#d9c7a3", 2), F(KV.x - 96, 322 - d * 8, 3, "#8b5a3c"));
      if (ch2.held === 6 && ch2.phase === "wash5")
        if (
          (m(KV.x - 30, 296, 60, 34, 8),
          r("#8a93a3", 3),
          C([KV.x - 30, 304, KV.x - 46, 300], y, 4),
          C([KV.x + 30, 304, KV.x + 46, 300], y, 4),
          ch2.mopN < 3)
        ) {
          for (let [d, A, T] of [
            [-14, 6, 7],
            [6, 12, 9],
            [16, 2, 5],
            [-4, -2, 5],
          ])
            (X(KV.x + d, 300 + A, T, T * 0.7), r("#6b4a1c", 0));
          g("GREASY", KV.x - 86, 262, 22, "#6b4a1c", "center", 900);
        } else for (let d = 0; d < 3; d++) g("\u2726", KV.x - 20 + d * 20, 292 - (d % 2) * 8, 14, "#3478f6", "center", 900);
      else if (ch2.held > 0) {
        (X(KV.x, 324, 22, 6), r(ch2.scrub ? "#ffffff" : "#d9c7a3", 2));
        for (let d = 0; d < 3; d++) F(KV.x - 18 + d * 14, 312 - ((n.T * 20 + d * 7) % 16), 4, "rgba(255,255,255,.9)");
      }
      for (let d = 0; d < ch2.done; d++) (m(KV.x + 70 + (d % 3) * 14, 290 - Math.floor(d / 3) * 14, 6, 30, 3), r("#ffffff", 2));
      ch2.sqBowl === "counter" && (X(KV.x + 108, 324, 14, 6), r("#ffffff", 2));
      ch2.peek > 0 &&
        !x.mops &&
        (seenCone(xt.x, xt.y + 30, 1.95, 0.75, 520, "rgba(229,83,61,.45)"), g("GLOOP", xt.x, 160, 14, "#b91c1c", "center", 800));
      let s = [];
      s.push({
        y: xe.y,
        d: () => {
          (tq(xe.x, xe.y, n.sqPose === "hidden" && x.spot === 63, "kcrate"),
            ch2.sqBowl === "crate" &&
              (X(xe.x + 10, xe.y - 92, 16, 6), r("#ffffff", 2), m(xe.x - 26, xe.y - 98, 16, 10, 2), r("#fff3d6", 1.5)),
            n.act &&
              n.act.verb === "LEAVE SOUP" &&
              (m(128, 300, 108, 32, 8),
              r("#fffaf0", 3),
              g("LEAVE SOUP", 182, 316, 16, "#1e2430", "center", 800),
              C([182, 332, 170, 360], "#1e2430", 3)));
        },
      });
      let q = ch2.phase === "g4k";
      for (let d = 0; d < ch2.bots.length; d++) {
        let A = ch2.bots[d];
        s.push({ y: A.y, d: () => f2(A, q && ch2.out === d, !0) });
      }
      (ch2.cook &&
        ch2.cook !== "gone" &&
        s.push({
          y: ch2.cookY || 530,
          d: () => {
            ((ch2.cookX = ch2.cookX || 640),
              (ch2.cookY = ch2.cookY || 530),
              ch2.cook === "down"
                ? (X(ch2.cookX, ch2.cookY, 46, 14), r("#7ad35a", 3), g("out cold", ch2.cookX, ch2.cookY - 28, 12, "#1e2430", "center", 800))
                : (m(ch2.cookX - 14, ch2.cookY - 78, 28, 52, 10),
                  r("#7ad35a", 3),
                  L(ch2.cookX, ch2.cookY - 96, 14),
                  r("#d5f0b0", 3),
                  ch2.cook === "scream" && g("AAAAH!", ch2.cookX, ch2.cookY - 120, 18, "#b91c1c", "center", 900)));
          },
        }),
        yn(s),
        s.sort((d, A) => d.y - A.y).forEach((d) => d.d()));
      n.act &&
        n.act.verb === "LEAVE SOUP" &&
        (m(128, 300, 108, 32, 8),
        r("#fffaf0", 3),
        g("LEAVE SOUP", 182, 316, 16, "#1e2430", "center", 800),
        C([182, 332, 170, 360], "#1e2430", 3));
    }
    function $A(l) {
      if (l.startsWith("tk")) {
        let o = +l.slice(2);
        (e.save(),
          e.translate(480, 320),
          e.rotate(-0.03),
          m(-150, -200, 300, 400, 6),
          r("#fffaf0", 5),
          g("ORDER #" + o, 0, -150, 30, y, "center", 900),
          C([-120, -120, 120, -120], y, 2));
        let i = ["", "Chili bowl", "Soup bowl", "Big pancake plate", "Chili bowl", "Space salad", "Pie dish"][o] || "Plate";
        return (g(i, 0, -70, 26, "#e5533d", "center", 900), g("WASH IT!", 0, 120, 30, "#3478f6", "center", 900), e.restore(), !0);
      }
      if (l === "postcard") {
        (e.save(),
          e.translate(480, 320),
          e.rotate(-0.04),
          m(-260, -170, 520, 340, 10),
          r("#fff3d6", 5),
          g("Greetings from MARS!", 0, -120, 34, "#e5533d", "center", 900),
          g("Big furry pancakes!", 0, -60, 26, y, "center", 800));
        for (let o = 0; o < 3; o++) (X(-60 + o * 4, 50 - o * 16, 70, 18), r("#e8a548", 3));
        return (
          XV(-56, 4, 30, 12, 10, 4, 0),
          wV("#8b4a1c", 2),
          g("Wish you were here \u2014 B.", 120, 130, 20, "#59657d", "center", 700),
          e.restore(),
          !0
        );
      }
      if (l === "recipe")
        return (
          e.save(),
          e.translate(480, 320),
          m(-230, -190, 460, 380, 10),
          r("#fffaf0", 5),
          g("GLOOP'S CHILI", 0, -140, 32, "#e5533d", "center", 900),
          ["2 cups moon beans", "1 comet pepper", "a pinch of sasquatch hair", "(DON'T TELL)"].forEach((o, i) =>
            g(o, 0, -70 + i * 48, i === 2 ? 26 : 22, i === 2 ? "#b91c1c" : y, "center", i === 2 ? 900 : 700),
          ),
          e.restore(),
          !0
        );
      if (l === "stamp") {
        (e.save(),
          e.translate(480, 320),
          m(-220, -160, 440, 320, 8),
          r("#fffaf0", 5),
          g("the note", 0, -110, 18, "#8a93a3", "center", 700));
        let s = Math.min(1, (n.panelT || 0) / 2.4);
        (e.save(),
          e.translate(30, -70 + 150 * s),
          m(-26, -8, 52, 34, 14),
          r("#e7d3b0", 3),
          e.restore(),
          (e.globalAlpha = s),
          L(24, 36, 18),
          r("#8b4a1c", 0),
          L(6, 14, 7),
          r("#8b4a1c", 0),
          L(42, 14, 7),
          r("#8b4a1c", 0),
          L(24, 8, 6),
          r("#8b4a1c", 0),
          e.restore());
        return !0;
      }
      if (l === "note2") {
        (e.save(),
          e.translate(480, 320),
          e.rotate(0.03),
          m(-220, -150, 440, 300, 8),
          r("#fffaf0", 5),
          g("You're not alone", 0, -70, 36, y, "center", 900),
          g("out here.", 0, -20, 36, y, "center", 900),
          g("\u2014 The Guardians", 60, 60, 26, y, "center", 800));
        for (let [o, i] of [
          [130, 100],
          [150, 90],
          [165, 100],
          [178, 112],
        ])
          (X(o, i, 5, 6), r("#8b4a1c", 0));
        return (X(150, 116, 14, 11), r("#8b4a1c", 0), e.restore(), !0);
      }
      return l === "fuel"
        ? (e.save(),
          e.translate(480, 320),
          m(-220, -160, 440, 320, 16),
          r("#59657d", 5),
          g("FUEL", 0, -110, 30, "#ffffff", "center", 900),
          e.beginPath(),
          e.arc(0, 60, 130, Math.PI, 0),
          (e.strokeStyle = "#dfe4ea"),
          (e.lineWidth = 18),
          e.stroke(),
          e.beginPath(),
          e.arc(0, 60, 130, Math.PI, Math.PI * 2),
          (e.strokeStyle = "#2bc48a"),
          (e.lineWidth = 18),
          e.stroke(),
          C([0, 60, 110, 0], "#e5533d", 6),
          g("FULL", 0, 110, 34, "#2bc48a", "center", 900),
          e.restore(),
          !0)
        : l === "tally2"
          ? (e.save(),
            e.translate(480, 320),
            m(-260, -230, 520, 460, 16),
            r("#fff3d6", 5),
            g("CHAPTER 2 \xB7 GAS STOP", 0, -190, 28, y, "center", 900),
            o2().forEach((o, i) => tallyLine(o, 0, -130 + i * 50, 24, 460, o.startsWith("Never caught!") || o === NEVER_CAUGHT_WHY ? "#2bc48a" : y)),
            e.restore(),
            !0)
          : !1;
    }
