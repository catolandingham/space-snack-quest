// Chapter 1 scene 1 (walkthrough beats 1-3): the chapter reset, the hand-overs to the morning and party modules (src/modules/morning.js, party.js), the calendar close-up, and the party cones of the older free play.
    // The chapter's state, reset at the start of Chapter 1 (the morning beat and its fallback both start here).
    function ch1ResetState() {
      ch2.qCheck = null;
      ((n.room = "closet"),
        (n.wardrobe = "closed"),
        (n.ch1D = !1),
        (n.ch1Duct = !1),
        (n.ch1Night = !1),
        (n.ch1Ship = !1),
        (n.ch1Crew = ""),
        (n.ch1Mail = ""),
        (n.ch1Prop = ""),
        (n.costumeOn = !1),
        (n.ch1Got = 0),
        (n.ch1Signed = 0),
        (n.ch1Mailed = 0),
        (n.ch1DidBall = !1),
        (n.ch1Walks = []),
        (n.ch1Trail = []),
        (n.ch1SiteRoom = ""),
        (n.ch1Office = !1),
        (n.ch1Party = !1),
        (n.ch1Disguise = !1),
        (n.ch1Photo = !1),
        (n.ch1BarDone = !1),
        (n.ch1Cut = null),
        (n.ch1PartyNow = null),
        (n.ch1Search = !1),
        (n.ch1Mini = ""),
        (n.ch1OctChase = !1),
        (n.ch1SureEnd = !1),
        (n.guard = null),
        (n.ch1Raid = null),
        (n.ch1Day2 = !1),
        (n.ch1Zoom = null),
        (n.ch1Calendar = null),
        (n.ch1PadOn = !1),
        (n.ch1Chain = !1),
        (n.ch1Flyer = !1),
        (n.ch1PartyT = 0),
        (n.ch1PartyOver = !1),
        (n.ch1Fur = !1),
        (n.ch1Morning = null),
        (n.sqLift = 0),
        (n.mo.walking = !1),
        (n.tvOn = !1));
    }
    // The morning (walkthrough beats 1 and 2) is a module now: src/modules/morning.js. If the module script
    // failed to load, Chapter 1 still plays: the opening cards, then straight to the evening.
    function ch1RedesignStart() {
      ch1ResetState();
      let beat = window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-morning");
      if (beat) return beat.start();
      ((n.scene = "Q1"), (n.sqPose = "stand"), (n.sq.x = 250), (n.sq.y = 574), (n.moPose = "hidden"), (n.ctrl = !1));
      J([
        { k: "card", id: "jupiter", text: "Stormtop Cloud Resort, floating above Jupiter." },
        { k: "card", id: "squatch", text: "This is Squatch. He's a Sasquatch." },
        { k: "card", id: "later", text: "That evening\u2026" },
        N(ch1EveningStart),
      ]);
    }
    // The party night's module (src/modules/party.js), or null if the module script did not load.
    function partyBeat() {
      return (window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-party")) || null;
    }
    // True at home that evening before the peek (party P1): the calendar is still there to look at.
    function ch1PartyAtHome() {
      let now = partyBeat() && partyBeat().now();
      return !!now && now.scene === "P1" && now.phase === "home";
    }
    // The evening starts (beat 3): the party night module takes over (P1, the peek). Without it, Day 2 starts.
    function ch1EveningStart() {
      // The evening is a new step: forget the morning's saved song step, so ↺ here never brings Mops back.
      ch2.qCheck = null;
      let party = partyBeat();
      if (party) return party.start();
      ch1Day2Begin();
    }
    // Runs `f` drawing on `ctx` instead of the game's canvas (the party's hand-overs below).
    function onCtx(ctx, f) {
      if (!ctx || ctx === e) return f();
      let keep = e;
      try {
        e = ctx;
        return f();
      } finally {
        e = keep;
      }
    }
    // The engine functions the morning module uses, handed over once (src/modules/bridge.js, handOver).
    window.SSQ &&
      window.SSQ.handOver &&
      window.SSQ.handOver({
        queue: (items) => J(items),
        say: (who, text, style) => v(who, text, style || "say"),
        card: (id, text) => ({ k: "card", id, text }),
        run: (f) => N(f),
        until: (f) => cV(f),
        // A tap wait with no words (NEXT is the only cue, Brian 18a).
        tapWait: () => ({ k: "wait", t: 0 }),
        current: () =>
          n.cur
            ? { k: n.cur.k, who: n.cur.b ? n.cur.b.who : "", style: n.cur.b ? n.cur.b.style : "", id: n.cur.id || "", panel: n.cur.panel, el: n.cur.el || 0, over: !!n.cur.over }
            : null,
        // Steps that come in front of the one up now, which comes back after them (Brian 31a: Mops's line over
        // the close-up). An item with over: true is drawn over the picture up now.
        cutIn: (items) => {
          let c = n.cur;
          for (let it of items) it.over === !0 && (it.over = c);
          (c && n.q.unshift(c), n.q.unshift(...items), (n.cur = null));
        },
        get: (k) => n[k],
        set: (k, val) => {
          n[k] = val;
        },
        pos: (who) => {
          let o = who === "mops" ? n.mo : n.sq;
          return { x: o.x, y: o.y, f: o.f };
        },
        place: (who, x, y) => {
          let o = who === "mops" ? n.mo : n.sq;
          ((o.x = x), (o.y = y));
        },
        face: (who, f) => {
          (who === "mops" ? n.mo : n.sq).f = f;
        },
        step: (who, x, y, speed, dt) => mV(who === "mops" ? n.mo : n.sq, x, y, speed, dt),
        still: (who) => {
          (who === "mops" ? n.mo : n.sq).moving = !1;
        },
        // While Mops walks, he is not solid (he would shove Squatch in a jump; see R0).
        moWalking: (on) => {
          n.mo.walking = !!on;
        },
        room: () => n.room,
        time: () => n.T,
        chipNow: () => chipNow(),
        resetChapter: () => ch1ResetState(),
        eveningStarts: () => ch1EveningStart(),
        // Forget the step restart's saved start (Mops is leaving: ↺ must not bring back the song step).
        forgetSaved: () => {
          ch2.qCheck = null;
        },
        soundState: () => soundState(),
        audioCtx: () => S,
        masterGain: () => M,
        musicGain: () => MU,
        fxGain: () => FX,
        drawMops: (x, y, scale, opts) => Fe(x, y, scale, opts || {}),
        // The party night (src/modules/party.js): Squatch and Isfred as the room draws them, the eyes in a plant,
        // and the hall's sizes (a grown-up's height, Squatch's scale).
        // Each draws on `ctx` (the game's canvas, or a picture of the sheet tool's), as the face buttons do.
        drawSquatch: (ctx, x, y, scale, opts) => onCtx(ctx, () => Re(x, y, scale, opts || {})),
        drawIsfred: (ctx, x, y, f) => onCtx(ctx, () => drawCh1Alien(x, y, "horns", ALIEN_ADULT, f || 1)),
        drawEyes: (ctx, x, y) => onCtx(ctx, () => ga(x, y)),
        hallSizes: () => ({ adult: ADULT_PX, squatch: SQ_ADULT }),
        // Sight cones: the standing cone's size, and telling the tests (conesDrawn) about a cone drawn this frame.
        coneSize: () => ({ half: STAND_CONE_HALF, len: STAND_CONE_LEN }),
        noteCone: (c) => conesDrawn.push({ ...c, room: n.room, cam: 0 }),
        // Walking through a door into the next room (the walk log is the one the room changes keep: ch1Walks, ch1Trail).
        enterRoom: (room, scene) => {
          n.ch1Walks.push({ phase: "edge", room: n.room, x: Math.round(n.sq.x), y: Math.round(n.sq.y) });
          ((n.room = room), (n.scene = scene), (n.ch1D = !1), (n.ch1Duct = !1), (n.ch1Night = !1), (n.ch1Ship = !1), (B.camX = 0));
          room === "closet" && (n.tvOn = !1);
          n.ch1Walks.push({ phase: "in", room: n.room, x: Math.round(n.sq.x), y: Math.round(n.sq.y) });
        },
        walkOff: () => n.ch1Walks.push({ phase: "off", room: n.room, x: Math.round(n.sq.x), y: Math.round(n.sq.y) }),
        trail: () => ch1Trail(),
        walkPhase: () => (n.sq.moving ? n.sq.walk : 0),
        // True while the kid steers Squatch (the stick, the keys, or a tap on the floor).
        steering: () => {
          let k = oh();
          return !!n.walkTo || Math.hypot(k.x, k.y) > 0.2;
        },
        // The one capture rule's end (25-capture.js): the LOCKUP card with `cause`, then the part restarts.
        catchSquatch: (cause) => ((CAPTURES.party = { cause, joke: () => kh() }), capture("party")),
        lostYou: (text) => (hudNote(text, 2.5), Dt("safe", "", text, "safe")),
        sfx: (name) => D[name] && D[name](),
        // The goal's yellow outline round a party spot's real thing (drawGoalMark keeps n.lastRing for the chip).
        markGoal: (spot) => drawGoalMark(spot),
        // Half one ends: Squatch walks into the older free play in his outfit (src/game/12-ch1-redesign.js).
        startFreePlay: () => ch1FreePlayStart(),
        // Holding ↺ inside a full-screen view: the same restart as the page's ↺.
        restartPart: () => sectionReset(),
        squatchScale: () => wl,
        text: (t, x, y, size, color, align, weight) => g(t, x, y, size, color, align, weight),
      });
    // Optional inspection, not a new story beat. Keep the current queue intact while it is open.
    // Brian, Nov 16: tappable calendar; subtle bite, fake months, sponsor and family reminders.
    // Offered home alone after Mops leaves (src/modules/home-alone.js) and in the evening.
    function ch1CalendarAvailable() {
      let beat = window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-morning"),
        alone = !!(beat && beat.homeAlone && beat.homeAlone());
      return n.ctrl && n.hopOut < 0 && !de() && n.room === "closet" && n.wardrobe !== "open" &&
        !n.ch1Day2 && !n.ch1Party && !n.ch1Zoom && !n.ch1Calendar &&
        (n.scene === "O1" || (n.scene === "Q1" && (alone || ch1PartyAtHome())));
    }
    function ch1CalendarSpots() {
      return ch1CalendarAvailable() && n.sqPose === "stand"
        ? [spot({ id: "home-calendar", verb: "LOOK", cap: "calendar", who: "sq",
            x: 230, y: 392, r: 45, at: [179, 214], thing: { x0: 99, x1: 167, y0: 196, y1: 279 }, f: () => ch1OpenCalendar() })]
        : [];
    }
    function ch1OpenCalendar(next) {
      n.ch1Calendar = { ctrl: n.ctrl, next, age: 0 };
      // A paper rustle as the calendar comes up close (Brian 34A, the sound board).
      window.SSQ && window.SSQ.morningSound && window.SSQ.morningSound.play("rustle");
      n.ctrl = !1;
      n.act = null;
      n.walkTo = null;
      n.sq.moving = !1;
      n.mo.moving = !1;
    }
    function ch1CloseCalendar() {
      let z = n.ch1Calendar;
      if (!z || z.age < 0.25) return;
      n.ch1Calendar = null;
      n.ctrl = z.ctrl;
      n.act = null;
      n.walkTo = null;
      z.next && z.next();
      chipNow();
    }
    function ch1CalendarTap(x, y) {
      let z = n.ch1Calendar;
      if (!z) {
        if (ch1CalendarAvailable() && ch1CalHit(x, y)) {
          ch1OpenCalendar();
          return !0;
        }
        return !1;
      }
      if (z.age < 0.25) return !0;
      // The snack is only a picture: touching it does nothing (the paper is already nibbled, Brian G 556).
      if (Math.hypot(x - 880, y - 540) < 64) ch1CloseCalendar();
      return !0; // Never let a tap through to the room behind the close-up.
    }
    let ch1CalendarPaper = null;
    function drawCh1Calendar() {
      let z = n.ch1Calendar;
      if (!z) return;
      e.save();
      e.filter = "blur(6px)";
      e.drawImage(e.canvas, 0, 0);
      e.restore();
      e.fillStyle = "rgba(12,16,28,.35)";
      e.fillRect(0, 0, c, b);
      // Preserve the locked calendar's red pin/strip, 5-by-4 grid and circled pie position.
      // Brian requested invented months, a sponsor and scattered story-fitting reminders.
      // Use a separate transparent sheet so the bite really reveals the blurred room.
      ch1CalendarPaper || (ch1CalendarPaper = document.createElement("canvas"));
      let paper = ch1CalendarPaper;
      paper.width = 720;
      paper.height = 530;
      let ctx = paper.getContext("2d");
      ctx.fillStyle = "#fffaf0";
      ctx.strokeStyle = "#242834";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(3, 3, 714, 524, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#e5533d";
      ctx.beginPath();
      ctx.arc(360, 23, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(22, 45, 676, 45);
      const calendarText = (text, x, y, size, color = "#384754", align = "center", weight = 600) => {
        ctx.font = `${weight} ${size}px sans-serif`;
        ctx.textAlign = align;
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
      };
      calendarText("MOONMUNCH", 360, 68, 32, "#fffaf0", "center", 800);
      calendarText("FUZZUARY", 360, 111, 23);
      ctx.strokeStyle = "#a8a9aa";
      ctx.lineWidth = 2;
      for (let i = 0; i <= 5; i++) {
        ctx.beginPath(); ctx.moveTo(30 + i * 132, 130); ctx.lineTo(30 + i * 132, 450); ctx.stroke();
      }
      for (let i = 0; i <= 4; i++) {
        ctx.beginPath(); ctx.moveTo(30, 130 + i * 80); ctx.lineTo(690, 130 + i * 80); ctx.stroke();
      }
      // Fixed scattered dates: decorative family plans, not new quests or randomized clues.
      for (let day = 1; day <= 20; day++)
        calendarText(String(day), 38 + ((day - 1) % 5) * 132, 141 + Math.floor((day - 1) / 5) * 80, 16, "#727777", "left", 400);
      const reminders = [
        { day: 2, lines: ["Sock hunt"] },
        { day: 9, lines: ["family", "Olympics", "night"] },
        { day: 12, span: 2, lines: ["Wash outside windows", "(remember space suit!)"] },
        { day: 18, lines: ["Blanket", "fort night"] },
      ];
      for (const item of reminders) {
        const x = 96 + ((item.day - 1) % 5) * 132 + ((item.span || 1) - 1) * 66;
        const y = 130 + Math.floor((item.day - 1) / 5) * 80;
        // A longer pencilled reminder runs into the next blank day, clear of both date numbers.
        if (item.span) {
          ctx.fillStyle = "#fffaf0";
          ctx.fillRect(x - 125, y + 24, 250, 51);
        }
        item.lines.forEach((line, i) => calendarText(line, x, y + 49 + (i - (item.lines.length - 1) / 2) * 22, 22));
      }
      calendarText("Sponsored by MOON PIES", 360, 492, 25, "#8b5a3c", "center", 700);
      // A very enthusiastic red crayon circle, not an extra clue or a new delivery date.
      ctx.strokeStyle = "#e5533d";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(492, 330, 35, 33, -0.15, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(492, 330, 37, 34, 0.2, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#8b5a3c"; ctx.strokeStyle = "#242834"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(492, 330, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#f4d7a8"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(472, 335); ctx.quadraticCurveTo(492, 345, 512, 335); ctx.stroke();
      {
        // The nibble at the page edge is there from the start, as if Mops had a little taste (Brian G 556: "It
        // should just have a bite out already, kind of like implying maybe the gander ate a little bit."). It
        // leaves the pie, dates and reminders untouched.
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.moveTo(720, 314);
        ctx.quadraticCurveTo(695, 314, 704, 326);
        ctx.quadraticCurveTo(680, 336, 704, 347);
        ctx.quadraticCurveTo(695, 358, 720, 358);
        // Fill closes the cutout automatically. Keep the stroked path OPEN at the page edge:
        // a vertical closing stroke would frame the missing paper like a pasted-on gray shape.
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        // An outlined paper edge makes this read as a hole, not a gray shape laid on the page.
        ctx.strokeStyle = "#b8a68a"; ctx.lineWidth = 1.5; ctx.stroke();
      }
      e.save();
      let zoom = Math.min(1, z.age / 0.25);
      e.translate(460, 320); e.scale(0.92 + 0.08 * zoom, 0.92 + 0.08 * zoom);
      e.drawImage(paper, -360, -265);
      e.restore();
      // No paw on the close-up (Brian 2026-11-23: "It's the calendar paw that doesn't make sense").
      // At 375px wide this remains a roughly 44px target, unlike the older cut-in X.
      L(880, 540, 58); r("#ffffff", 4); g("X", 880, 540, 40, "#1e2430", "center", 900);
    }
    // Sight cones on everyone at the party (Brian, 2026-11-23: "let's try all of them and then we can adjust").
    // Who stands where; which way they look comes from src/modules/party-watch.js. The guest by the door keeps
    // his own turning cone during the sneak (above).
    function ch1PartyPeople() {
      let out = [];
      CH1_GUESTS.forEach((g) => {
        out.push({ id: (window.SSQ && window.SSQ.guestId(g[2])) || g[2], x: g[0], y: g[1] });
      });
      for (let id in CH1_PARTY_CAST) {
        let at = id === "octopus" && n.ch1Oct ? [n.ch1Oct.x, n.ch1Oct.y] : CH1_PARTY_CAST[id];
        out.push({ id, x: at[0], y: at[1] });
      }
      return out;
    }
    // The cones, while the player sneaks to the plant or walks the party in disguise; each knows whether
    // Squatch is inside it (the game's own sight check, so the shaded area is exactly where he is seen).
    function ch1PartyCones() {
      if (!(window.SSQ && window.SSQ.partyCones) || n.room !== "hall" || !n.ch1Party) return [];
      if (!(n.ch1Disguise && !n.ch1PartyOver)) return [];
      return window.SSQ.partyCones(ch1PartyPeople(), n.sq, (n.ch1Look || 0) > 0, { half: STAND_CONE_HALF, len: STAND_CONE_LEN }).map((c) => ({ ...c, half: STAND_CONE_HALF, len: STAND_CONE_LEN, askOnly: !0 }));
    }
    // Drawn under the people in drawCh1Party: whole cones (the party module's drawCones: furniture never cuts a
    // cone short), each shown only when Squatch is near it (the distance fade); the one he is in fills yellow.
    // In disguise a cone only brings a "?" over whoever sees him, never a catch (askOnly, read by
    // tests/ch1-kid-play.mjs).
    function drawCh1PartyCones() {
      let pb = partyBeat(),
        cones = pb ? pb.drawConesOn(e, ch1PartyCones(), n.sq, n.sqPose === "hidden") : [];
      cones.forEach((c) => (c.mark = c.inside ? "?" : ""));
      n.ch1Cones = cones;
    }
    // Drawn last in drawCh1Party: "?" over everyone whose cone has Squatch in it (in disguise).
    function drawCh1PartyMarks() {
      (n.ch1Cones || []).forEach((c) => c.mark && g(c.mark, c.x, c.y - ADULT_PX * 1.25 - 8, 36, "#ffcf33", "center", 900));
    }
