// Chapter 1 scene 1 (walkthrough beats 1-3): the chapter reset, the hand-over to the morning module (src/modules/morning.js), the calendar close-up, the peek and the sneak.
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
        (n.ch1Dress = null),
        (n.ch1PeekReady = !1),
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
        (n.ch1PartyDid = {}),
        (n.ch1Fur = !1),
        (n.ch1Morning = null),
        (n.sqLift = 0),
        (n.sqBedX = 0),
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
    // The evening starts (beat 3): Squatch alone at home, the goal is to peek out the door.
    function ch1EveningStart() {
      // The evening is a new step: forget the morning's saved song step, so ↺ here never brings Mops back.
      ch2.qCheck = null;
      ((n.ch1PeekReady = !0), (n.ctrl = !0), (n.scene = "Q1"), (n.ch1Chip = "Squatch: peek out the door"), chipNow());
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
        // A tap wait with no words and no arrow (the beat draws its own "tap" cue).
        tapWait: () => ({ k: "wait", t: 0, quiet: !0 }),
        current: () => (n.cur ? { k: n.cur.k, who: n.cur.b ? n.cur.b.who : "", style: n.cur.b ? n.cur.b.style : "", id: n.cur.id || "" } : null),
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
        chime: () => D.chime(),
        drawMops: (x, y, scale, opts) => Fe(x, y, scale, opts || {}),
        drawSquatch: (x, y, scale, opts) => Re(x, y, scale, opts || {}),
        text: (t, x, y, size, color, align, weight) => g(t, x, y, size, color, align, weight),
      });
    // Optional inspection, not a new story beat. Keep the current queue intact while it is open.
    // Brian, Nov 16: tappable calendar; subtle bite, fake months, sponsor and family reminders.
    // Offered home alone after Mops leaves (src/modules/home-alone.js) and in the evening.
    function ch1CalendarAvailable() {
      let beat = window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-morning"),
        alone = !!(beat && beat.homeAlone && beat.homeAlone());
      return n.ctrl && n.hopOut < 0 && !de() && n.room === "closet" && n.wardrobe !== "open" &&
        !n.ch1Day2 && !n.ch1Party && !n.ch1Dress && !n.ch1Zoom && !n.ch1Calendar &&
        (n.scene === "O1" || (n.scene === "Q1" && (n.ch1PeekReady || alone)));
    }
    function ch1CalendarSpots() {
      return ch1CalendarAvailable() && n.sqPose === "stand"
        ? [spot({ id: "home-calendar", verb: "LOOK", cap: "calendar", who: "sq",
            x: 230, y: 392, r: 45, at: [179, 214], f: () => ch1OpenCalendar() })]
        : [];
    }
    function ch1OpenCalendar(next) {
      n.ch1Calendar = { ctrl: n.ctrl, next, age: 0, paw: { x: 780, y: 590 } };
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
      z.paw = { x, y };
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
      drawPawArm(z.paw);
      // At 375px wide this remains a roughly 44px target, unlike the older cut-in X.
      L(880, 540, 58); r("#ffffff", 4); g("X", 880, 540, 40, "#1e2430", "center", 900);
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
    // The peek (beat 3): Squatch leans out of his doorway. The hall is already full (nobody pops in),
    // he hears talk from the stage he can't make out, reads the banner, and thinks "Robots?".
    // Then he sneaks to the plant (ch1SneakHide), where Isfred's announcement plays once.
    // He stops in his doorway at the bottom wall, so he is only leaning in, not in the room yet.
    const CH1_PEEK_AT = [470, 628];
    function ch1PeekGo() {
      ((n.ch1PeekReady = !1), (n.ch1Chip = ""), (n.ctrl = !1), (n.act = null), (n.ch1Party = !0), (n.ch1Peeking = !0));
      ch1Go("hall", { who: "sq", scene: "QA", stand: CH1_PEEK_AT }, ch1PeekLook);
    }
    function ch1PeekLook() {
      ((n.ch1Party = !0), (n.scene = "QA"), (n.ctrl = !1), (n.sq.moving = !1));
      J([
        uV(0.6),
        v("official", "Mmf mmf... mm-mmf... mmf!", "whisper"),
        v("sq", "Robots?", "whisper"),
        N(ch1SneakStart),
      ]);
    }
    // Beat 4 (problem 13): the player sneaks Squatch from his doorway to the middle plant.
    // The yellow guest by the door ("spots") faces the stage, then turns and looks toward the plant.
    // If he sees Squatch out in the open, Squatch hurries back to his doorway and tries again.
    // Hiding is the HIDE button at the plant, like every other hiding place in the game.
    const CH1_SNEAK_PLANT = [400, 520],
      CH1_SNEAK_EYES = [520, 582],
      CH1_SNEAK_FACE = Math.PI, // straight left: covers the floor between the door and the plant, not the plant itself
      CH1_SNEAK_STAGE_SECONDS = 3.5,
      CH1_SNEAK_TURN_SECONDS = 0.4,
      CH1_SNEAK_LOOK_SECONDS = 2,
      CH1_SNEAK_START_T = 3;
    function ch1SneakLook() {
      let s = n.ch1PlantSneak;
      if (!s) return "";
      if (s.caught) return s.by && s.by !== "door" ? "stage" : "look"; // the door guest turns only if he is the one who saw
      let cyc = CH1_SNEAK_STAGE_SECONDS + CH1_SNEAK_LOOK_SECONDS + 2 * CH1_SNEAK_TURN_SECONDS,
        t = s.t % cyc;
      if (t < CH1_SNEAK_STAGE_SECONDS) return "stage";
      if (t < CH1_SNEAK_STAGE_SECONDS + CH1_SNEAK_TURN_SECONDS) return "turn";
      if (t < CH1_SNEAK_STAGE_SECONDS + CH1_SNEAK_TURN_SECONDS + CH1_SNEAK_LOOK_SECONDS) return "look";
      return "turn";
    }
    function ch1SneakSees() {
      return ch1SneakLook() === "look" && n.sqPose !== "hidden" && vt(n.sq.x, n.sq.y - 20, CH1_SNEAK_EYES[0], CH1_SNEAK_EYES[1], CH1_SNEAK_FACE, STAND_CONE_HALF, STAND_CONE_LEN);
    }
    function ch1SneakStart() {
      ((n.ch1Peeking = !1), (n.ch1PlantSneak = { t: CH1_SNEAK_START_T, caught: 0, tries: 0 }), (n.ch1Chip = "Squatch: sneak to the plant"), (n.sqPose = "stand"), (n.ctrl = !0), chipNow());
    }
    function ch1SneakSpots() {
      return [
        spot({
          id: "hide",
          verb: "HIDE",
          cap: "plant",
          who: "sq",
          x: CH1_SNEAK_PLANT[0],
          y: CH1_SNEAK_PLANT[1],
          r: 55,
          f: ch1SneakIn,
        }),
      ];
    }
    function ch1SneakIn() {
      if (!n.ch1PlantSneak) return;
      ((n.ch1PlantSneak = null), (n.ch1Chip = ""), (n.ctrl = !1), (n.act = null), (n.sq.moving = !1), (n.ch1Peeking = !0), chipNow());
      ch1SneakHide();
    }
    function ch1SneakCaught(by) {
      let s = n.ch1PlantSneak;
      ((s.caught = 1), (s.by = by), (s.tries += 1), (n.ctrl = !1), (n.act = null), (n.sq.moving = !1));
      let hold = 0.7; // a short beat to see the "!" (plays on its own; uV would wait for a tap)
      J([
        cV((dt) => (hold -= dt || 0) <= 0),
        ch1Step("sq", CH1_PEEK_AT[0], CH1_PEEK_AT[1], 260),
        N(() => {
          n.ch1PlantSneak &&
            ((n.ch1PlantSneak.caught = 0), (n.ch1PlantSneak.by = ""), (n.ch1PlantSneak.seenBy = ""), (n.ch1PlantSneak.seenT = 0), (n.ch1PlantSneak.t = CH1_SNEAK_START_T), (n.ctrl = !0));
        }),
      ]);
    }
    function ch1SneakTick(dt) {
      let s = n.ch1PlantSneak;
      if (!s || s.caught) return;
      // No control (a cutscene) or another room: nobody is watching him, so no "?" carries over.
      if (!n.ctrl || n.room !== "hall") return ((s.seenT = 0), (s.seenBy = ""));
      s.t += dt || 0;
      // Whoever sees him shows "?" first and "!" only if he stays in sight too long (Brian, 2026-11-22).
      let by = ch1SneakSees() ? "door" : (ch1PartyCones().find((c) => c.inside) || {}).id;
      if (!by) return ((s.seenT = 0), (s.seenBy = ""));
      ((s.seenT = s.seenBy === by ? (s.seenT || 0) + (dt || 0) : 0), (s.seenBy = by));
      s.seenT >= ((window.SSQ && window.SSQ.seenTooLong) || 0) && ch1SneakCaught(by);
    }
    // Sight cones on everyone at the party (Brian, 2026-11-23: "let's try all of them and then we can adjust").
    // Who stands where; which way they look comes from src/modules/party-watch.js. The guest by the door keeps
    // his own turning cone during the sneak (above).
    function ch1PartyPeople() {
      let out = [];
      CH1_GUESTS.forEach((g) => {
        if (g[2] === "spots" && n.ch1PlantSneak) return;
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
      if (!(n.ch1PlantSneak || (n.ch1Disguise && !n.ch1PartyOver))) return [];
      let hidden = n.sqPose === "hidden";
      return window.SSQ.partyCones(ch1PartyPeople(), n.sq, (n.ch1Look || 0) > 0, { half: STAND_CONE_HALF, len: STAND_CONE_LEN }).map((c) => ({
        ...c,
        inside: !hidden && vt(n.sq.x, n.sq.y - 20, c.ox, c.oy, c.a, STAND_CONE_HALF, STAND_CONE_LEN),
      }));
    }
    // Drawn under the people in drawCh1Party. A faint dashed cone each, shown only when Squatch is near the
    // cone itself (c.show, the distance fade); the one Squatch is in fills yellow. In disguise a "?" shows over
    // whoever sees him; in the sneak "?" first, then "!" over the one who caught him.
    function drawCh1PartyCones() {
      let s = n.ch1PlantSneak,
        cones = ch1PartyCones();
      cones.forEach((c) => {
        c.mark = s ? (s.caught ? (s.by === c.id ? "!" : "") : s.seenBy === c.id ? "?" : "") : c.inside ? "?" : "";
        if (!(c.show > 0) && !c.mark) return;
        (e.save(), (e.globalAlpha = c.mark ? 1 : c.show));
        if (c.inside || c.mark) seenCone(c.ox, c.oy, c.a, STAND_CONE_HALF, STAND_CONE_LEN, "rgba(255,234,120,.55)", "rgba(160,100,10,.95)");
        else (e.setLineDash([8, 7]), seenCone(c.ox, c.oy, c.a, STAND_CONE_HALF, STAND_CONE_LEN, "rgba(0,0,0,0)", "rgba(90,96,110,.5)"));
        e.restore();
        // In disguise this cone only brings a "?", never a catch (read by tests/ch1-kid-play.mjs).
        !s && (conesDrawn[conesDrawn.length - 1].askOnly = !0);
      });
      n.ch1Cones = cones;
    }
    // Drawn inside drawCh1Party: the watcher's cone while he looks, and a "!" when he sees Squatch.
    function drawCh1SneakCone() {
      let k = ch1SneakLook();
      if (!k) return;
      k === "look" && seenCone(CH1_SNEAK_EYES[0], CH1_SNEAK_EYES[1], CH1_SNEAK_FACE, STAND_CONE_HALF, STAND_CONE_LEN, "rgba(255,234,120,.62)", "rgba(160,100,10,.95)");
    }
    // Drawn last in drawCh1Party, so the photo table does not cover it.
    function drawCh1SneakMark() {
      let s = n.ch1PlantSneak;
      s && s.caught && (!s.by || s.by === "door") && g("!", CH1_SNEAK_EYES[0] + 30, CH1_SNEAK_EYES[1] - 20, 40, "#e5533d", "center", 900);
      s && !s.caught && s.seenBy === "door" && g("?", CH1_SNEAK_EYES[0] + 30, CH1_SNEAK_EYES[1] - 20, 40, "#ffcf33", "center", 900);
      // Over everyone else whose cone has him: "!" (caught in the sneak) or "?" (in disguise).
      (n.ch1Cones || []).forEach((c) => c.mark && g(c.mark, c.x, c.y - ADULT_PX * 1.25 - 8, 36, c.mark === "!" ? "#e5533d" : "#ffcf33", "center", 900));
    }
    function ch1SneakFace() {
      let k = ch1SneakLook();
      return k === "look" || k === "turn" ? -1 : 1;
    }
