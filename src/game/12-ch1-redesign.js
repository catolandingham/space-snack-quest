// Redesigned Chapter 1 (the Nov 8 cartoon): lunch, the delivery room, the night mailbox, the vent, the costume, and boarding.
    // Ball-hide distances (C20). A ball hides worse than a plant or a box. These defaults are the least
    // intrusive set: only a looker who is very close, or looking and still nearby, spots him. Brian picks
    // the real numbers; the choices are in docs/CH1-LINES-FOR-BRIAN.md.
    const BALL_SPOT_NEAR = 36,
      BALL_LOOK_RANGE = 90,
      BALL_MISS_FAR = 640,
      CH1_BIN = { x: 210, y: 540 },
      CH1_MAIL = { x: 800, y: 540 },
      CH1_VENT = { x: 860, y: 480 },
      CH1_ROBOT = { x: 480, y: 400 },
      CH1_PLANT = { x: 170, y: 500 };
    const CH1Q_CHIPS = {
      Q1: "Squatch: go with Mops to the ship",
      Q2: "Squatch: hide and watch",
      Q3: "Squatch: talk with Mops at home",
      Q4: "Squatch: get the yellow copy to the mailbox",
      Q5: "Squatch: roll into a ball by the vent",
      Q6: "Squatch: grab the pink slip",
      Q7: "Squatch: return the empty crate",
      Q8: "Squatch: put on the costume",
      Q9: "Squatch: walk through the scanner",
    };
    function ch1QChip() {
      return CH1Q_CHIPS[n.scene] || "";
    }
    function ballHides(dist, looking) {
      if (dist < BALL_SPOT_NEAR) return !1;
      if (looking && dist < BALL_LOOK_RANGE) return !1;
      return !0;
    }
    function ch1Trail() {
      let t = n.ch1Trail;
      if (!t || t.length > 5000) return;
      let last = t[t.length - 1],
        x0 = Math.round(n.sq.x),
        y0 = Math.round(n.sq.y);
      (!last || last.room !== n.room || Math.abs(last.x - x0) > 8 || Math.abs(last.y - y0) > 8) && t.push({ room: n.room, x: x0, y: y0 });
    }
    function ch1Move(dt, x, y, speed, who) {
      let sqOk = who === "mo" ? !0 : mV(n.sq, x, y, speed, dt),
        moOk = who === "sq" ? !0 : mV(n.mo, x + (who === "mo" ? 0 : 48), y, speed, dt);
      return (ch1Trail(), sqOk && moOk);
    }
    function ch1Walk(spec, next) {
      J([
        N(() => {
          ((n.ctrl = !1), n.ch1Walks.push({ phase: "off", room: n.room, x: Math.round(n.sq.x), y: Math.round(n.sq.y) }));
        }),
        cV((dt) => ch1Move(dt, spec.exit[0], spec.exit[1], 260, spec.who)),
        cV((dt) => ch1Move(dt, spec.off[0], spec.off[1], 280, spec.who)),
        N(() => {
          (n.ch1Walks.push({ phase: "edge", room: n.room, x: Math.round(n.sq.x), y: Math.round(n.sq.y) }),
            (n.room = spec.to),
            (n.ch1D = !!spec.delivery),
            (n.ch1Duct = !!spec.duct),
            spec.scene && (n.scene = spec.scene),
            spec.night != null && (n.ch1Night = spec.night),
            spec.ship != null && (n.ch1Ship = spec.ship),
            spec.crew != null && (n.ch1Crew = spec.crew),
            spec.mail != null && (n.ch1Mail = spec.mail),
            spec.who !== "mo" && ((n.sq.x = spec.entry[0]), (n.sq.y = spec.entry[1]), (n.sq.moving = !1)),
            spec.who !== "sq" && ((n.mo.x = spec.entry[0] + 56), (n.mo.y = spec.entry[1]), (n.mo.moving = !1), (n.moPose = "stand")),
            n.room === "hall" && (B.camX = 0),
            n.ch1Walks.push({ phase: "in", room: n.room, x: Math.round(n.sq.x), y: Math.round(n.sq.y) }));
        }),
        cV((dt) => ch1Move(dt, spec.stand[0], spec.stand[1], 260, spec.who)),
        N(next),
      ]);
    }
    function ch1RedesignStart() {
      ((n.scene = "O1"),
        (n.room = "closet"),
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
        (n.sqPose = "sit"),
        J([
          { k: "card", id: "jupiter", text: "Stormtop Cloud Resort, floating above Jupiter." },
          { k: "card", id: "squatch", text: "This is Squatch. He's a Sasquatch." },
          N(() => {
            ((n.ctrl = !0), (n.scene = "O1"), chipNow());
          }),
          cV(() => n.scene === "O1" && n.moved > 110),
          N(() => {
            ((n.ctrl = !1),
              (n.sqPose = "stand"),
              (n.sq.x = 400),
              (n.sq.y = 520),
              (n.mo.x = 520),
              (n.mo.y = 500),
              (n.moPose = "stand"),
              (n.scene = "Q1"));
          }),
          v("mops", "I know you, Squatch, you're probably hungry... you know the rule, grab one snack."),
          v("mops", "My lunch! You're the best."),
          v("pa", "Universal Postal Service ship arriving!", "pa"),
          v("sq", "Please let me follow you, I'll be really sneaky."),
          v("mops", "Okay, just this time, but hide carefully."),
          N(() =>
            ch1Walk(
              {
                who: "both",
                exit: [840, 520],
                off: [1040, 520],
                to: "hangar",
                entry: [70, 530],
                stand: [260, 530],
                scene: "Q2",
                delivery: !0,
                night: !1,
                ship: !0,
                crew: "day",
                mail: "empty",
              },
              ch1AtDelivery,
            ),
          ),
        ]));
    }
    function ch1AtDelivery() {
      ((n.sqPose = "hidden"),
        (n.sq.x = CH1_PLANT.x),
        (n.sq.y = CH1_PLANT.y),
        (n.mo.x = 640),
        (n.mo.y = 500),
        (n.scene = "Q2"),
        J([
          v("official", "Mops, don't worry, you know how much we love you here. Even our visitors always love you."),
          v("tourist", "Manager! The dock needs you."),
          v("ups", "Left one of the copies in the office. What do I do with the other two?"),
          v("mops", "I'll take care of it."),
          v("mops", "So futuristic and we still order on paper."),
          N(() => {
            n.ch1Prop = "delicious";
          }),
          v("mops", "Delicious."),
          N(() => {
            n.ch1Prop = "gumble";
          }),
          v("mops", "Mmf mrrf!"),
          v("sq", "You're gumbling! (goat mumbling)"),
          N(() => {
            n.ch1Prop = "bin";
          }),
          v("mops", "Ptoo!"),
          v("mops", "We got to watch out for these robots."),
          N(() => {
            ((n.sqPose = "stand"),
              (n.ch1Prop = ""),
              ch1Walk(
                {
                  who: "both",
                  exit: [860, 520],
                  off: [1040, 520],
                  to: "hall",
                  entry: [120, 560],
                  stand: [420, 520],
                  scene: "Q3",
                  delivery: !1,
                  duct: !1,
                  night: !1,
                  ship: !1,
                  crew: "",
                  mail: "",
                },
                ch1Snack,
              ));
          }),
        ]));
    }
    function ch1Snack() {
      ((n.scene = "Q3"),
        J([
          v("tourist", "I swear we had more Moon Pies... is that what they stole at lunch?", "say", !0),
          v("mops", "Quick, hide."),
          N(() => {
            ((n.sqPose = "hidden"), (n.sq.x = ne.x), (n.sq.y = ne.y));
          }),
          uV(0.8),
          N(() => {
            ((n.sqPose = "stand"), (n.sq.x = 460), (n.sq.y = 530));
          }),
          v("mops", "Didn't you hear what the manager said? They need me here, they're not going to replace me. Plus the Guardians are here."),
          v("mops", "I need to get back to work, we'll talk about it tonight."),
          N(() =>
            ch1Walk(
              {
                who: "both",
                exit: [480, 590],
                off: [480, 700],
                to: "closet",
                entry: [820, 500],
                stand: [420, 520],
                scene: "Q3",
                delivery: !1,
                night: !1,
                ship: !1,
                crew: "",
                mail: "",
              },
              ch1Bedtime,
            ),
          ),
        ]));
    }
    function ch1Bedtime() {
      ((n.scene = "Q3"),
        (n.sqPose = "sleep"),
        (n.sq.x = 205),
        (n.sq.y = 470),
        (n.moPose = "stand"),
        (n.mo.x = 470),
        (n.mo.y = 460),
        J([
          { k: "panel", id: "ch1guard" },
          N(() => {
            ((n.sqPose = "stand"),
              (n.wardrobe = "closed"),
              ch1Walk(
                {
                  who: "sq",
                  exit: [840, 520],
                  off: [1040, 520],
                  to: "hangar",
                  entry: [80, 540],
                  stand: [140, 540],
                  scene: "Q4",
                  delivery: !0,
                  night: !0,
                  ship: !1,
                  crew: "",
                  mail: "empty",
                },
                ch1NightPlay,
              ));
          }),
        ]));
    }
    function ch1NightPlay() {
      ((n.scene = "Q4"), (n.ctrl = !0), (n.sqPose = "stand"), (n.sq.x = 140), (n.sq.y = 540), chipNow());
    }
    function ch1GrabYellow() {
      ((n.ch1Got = 1), (n.act = null));
    }
    function ch1SignPaw() {
      ((n.ch1Signed = 1),
        (n.ctrl = !1),
        (n.act = null),
        J([
          v("sq", "Signed. With my paw.", "whisper"),
          N(() => {
            ((n.ctrl = !0), (n.scene = "Q4"));
          }),
        ]));
    }
    function ch1PostMail() {
      ((n.ch1Mailed = 1),
        (n.ctrl = !1),
        (n.act = null),
        J([
          v("ups", "Mail scanned. Signature pawature accepted."),
          { k: "card", id: "time", text: "Six days later" },
          v("ups", "We could wipe the floor with that beard."),
          v("ups", "HQ sent us a message. You're going to be replaced this week anyway."),
          v("mops", "The new robots come on the ship tomorrow. Let's go find the pancake stand."),
          v("sq", "Oh, it was on the form I sent, I mean, never mind."),
          v("sq", "A copy got sucked into the vent.", "whisper"),
          N(() => {
            ((n.scene = "Q5"),
              (n.ctrl = !0),
              (n.room = "hangar"),
              (n.ch1D = !0),
              (n.ch1Night = !0),
              (n.ch1Ship = !1),
              (n.sqPose = "stand"),
              (n.sq.x = CH1_VENT.x - 40),
              (n.sq.y = CH1_VENT.y),
              (n.mo.x = 700),
              (n.mo.y = 500));
          }),
        ]));
    }
    function ch1BallThere() {
      ((n.sqPose = "ball"),
        (n.ch1DidBall = !0),
        (n.ctrl = !1),
        (n.act = null),
        J([
          uV(0.4),
          N(() => {
            ((n.sqPose = "hidden"),
              ch1Walk(
                {
                  who: "both",
                  exit: [860, 460],
                  off: [1040, 460],
                  to: "duct",
                  entry: [140, 440],
                  stand: [220, 440],
                  scene: "Q6",
                  delivery: !1,
                  duct: !0,
                  night: !0,
                  ship: !1,
                  crew: "",
                  mail: "",
                },
                ch1Workstation,
              ));
          }),
        ]));
    }
    function ch1Workstation() {
      ((n.scene = "Q6"),
        (n.sqPose = "hidden"),
        (n.sq.x = 180),
        (n.sq.y = 440),
        (n.mo.x = 520),
        (n.mo.y = 440),
        J([
          v("sq", "I hope Mops doesn't notice...", "whisper"),
          { k: "panel", id: "ch1slip" },
          v("mops", "Hurry, hurry, pink slip, got it!"),
          v("sq", "Get it before he sees it.", "whisper"),
          N(() => {
            ((n.sqPose = "stand"), (n.ctrl = !0), (n.scene = "Q6"), (n.sq.x = 260), (n.sq.y = 440));
          }),
        ]));
    }
    function ch1GrabPink() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.ch1Prop = "pink"),
        J([
          N(() =>
            ch1Walk(
              {
                who: "both",
                exit: [160, 440],
                off: [40, 440],
                to: "closet",
                entry: [800, 500],
                stand: [460, 520],
                scene: "Q7",
                delivery: !1,
                duct: !1,
                night: !1,
                ship: !1,
                crew: "",
                mail: "",
              },
              ch1Site,
            ),
          ),
        ]));
    }
    function ch1Site() {
      ((n.scene = "Q7"),
        (n.room = "closet"),
        J([
          { k: "panel", id: "ch1site" },
          N(() => {
            ((n.ctrl = !0), (n.scene = "Q7"), (n.sq.x = 460), (n.sq.y = 520));
          }),
        ]));
    }
    function ch1ReturnCrate() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.ch1Mail = "full"),
        J([
          N(() =>
            ch1Walk(
              {
                who: "both",
                exit: [840, 520],
                off: [1040, 520],
                to: "hangar",
                entry: [80, 530],
                stand: [300, 530],
                scene: "Q2",
                delivery: !0,
                night: !1,
                ship: !0,
                crew: "pickup",
                mail: "full",
              },
              ch1Pickup,
            ),
          ),
        ]));
    }
    function ch1Pickup() {
      ((n.ch1Prop = "open"),
        J([
          uV(0.8),
          N(() => {
            ((n.ch1Prop = ""),
              ch1Walk(
                {
                  who: "both",
                  exit: [80, 530],
                  off: [-40, 530],
                  to: "closet",
                  entry: [820, 500],
                  stand: [430, 510],
                  scene: "Q8",
                  delivery: !1,
                  night: !1,
                  ship: !1,
                  crew: "",
                  mail: "",
                },
                ch1Costume,
              ));
          }),
        ]));
    }
    function ch1Costume() {
      ((n.scene = "Q8"),
        (n.wardrobe = "open"),
        (n.room = "closet"),
        J([
          v("mops", "Hold still."),
          N(() => {
            ((n.ctrl = !0), (n.sq.x = 460), (n.sq.y = 510));
          }),
        ]));
    }
    function ch1Trim() {
      ((n.costumeOn = !0),
        (n.ctrl = !1),
        (n.act = null),
        J([
          v("mops", "More bleat. Less roar."),
          N(() =>
            ch1Walk(
              {
                who: "both",
                exit: [840, 510],
                off: [1040, 510],
                to: "hangar",
                entry: [80, 500],
                stand: [420, 500],
                scene: "Q9",
                delivery: !0,
                night: !1,
                ship: !0,
                crew: "day",
                mail: "full",
              },
              ch1AtScanner,
            ),
          ),
        ]));
    }
    function ch1AtScanner() {
      ((n.scene = "Q9"),
        (n.ctrl = !0),
        (n.sq.x = 400),
        (n.sq.y = 500),
        (n.costumeOn = !0));
    }
    function ch1Board() {
      ((n.ctrl = !1),
        (n.act = null),
        J([
          v("scanner", "HAIR... PROBABLY. PROCEED."),
          v("official", "Mops, it's a mistake!"),
          { k: "card", id: "later", text: "Later that evening..." },
          v("official", "What happened? We need to review the security tapes."),
          v("pa", "The base called the ship. It has to stop.", "pa"),
          N(() => {
            (aV.caught + x.caught === 0 && !n.found.has("ghost1") && (n.found.add("ghost1"), (n.stars += 250)), (B.nextBeat = "Ch2"));
          }),
          { k: "panel", id: "tally" },
          N(Ws),
        ]));
    }
    function ch1QSpots() {
      if (!n.ctrl || n.sqPose === "ball" || n.sqPose === "hidden") return [];
      let s = n.scene,
        out = [];
      (s === "Q4" &&
        !n.ch1Got &&
        out.push(spot({ id: "yellow", verb: "GRAB", cap: "yellow copy", who: "sq", x: CH1_BIN.x, y: CH1_BIN.y, r: 90, hot: !0, f: ch1GrabYellow })),
        s === "Q4" &&
          n.ch1Got &&
          !n.ch1Signed &&
          out.push(spot({ id: "paw", verb: "SIGN", cap: "paw", who: "sq", x: CH1_BIN.x, y: CH1_BIN.y, r: 120, hot: !0, f: ch1SignPaw })),
        s === "Q4" &&
          n.ch1Signed &&
          !n.ch1Mailed &&
          out.push(spot({ id: "mail", verb: "POST", cap: "mailbox", who: "sq", x: CH1_MAIL.x, y: CH1_MAIL.y, r: 90, hot: !0, f: ch1PostMail })),
        s === "Q5" &&
          out.push(spot({ id: "ventball", verb: "ROLL", cap: "ball", who: "sq", x: CH1_VENT.x, y: CH1_VENT.y, r: 120, hot: !0, f: ch1BallThere })),
        s === "Q6" &&
          out.push(spot({ id: "pink", verb: "GRAB", cap: "pink slip", who: "sq", x: n.sq.x, y: n.sq.y, r: 220, hot: !0, f: ch1GrabPink })),
        s === "Q7" &&
          out.push(spot({ id: "crate", verb: "RETURN", cap: "empty crate", who: "sq", x: 460, y: 520, r: 180, hot: !0, f: ch1ReturnCrate })),
        s === "Q8" && out.push(spot({ id: "beard", verb: "TRIM", cap: "beard", who: "sq", x: 460, y: 510, r: 200, hot: !0, f: ch1Trim })),
        s === "Q9" && out.push(spot({ id: "scan", verb: "BOARD", cap: "scanner", who: "sq", x: 480, y: 500, r: 160, hot: !0, f: ch1Board })),
        (s === "Q4" || s === "Q5") &&
          out.push(
            spot({
              id: "ball",
              verb: "ROLL",
              cap: "ball",
              who: "sq",
              hot: !0,
              f: () => {
                n.sqPose = "ball";
              },
            }),
          ));
      return out;
    }
    function ch1Watch() {
      if (!n.ctrl || n.scene !== "Q4" || n.sqPose === "hidden" || x.mops) return;
      let d = Math.hypot(n.sq.x - CH1_ROBOT.x, n.sq.y - CH1_ROBOT.y),
        looking = Math.abs(n.sq.x - CH1_ROBOT.x) < 36;
      if (n.sqPose === "ball") {
        ballHides(d, looking) || capture("hallbot");
        return;
      }
      d < BALL_LOOK_RANGE && looking && capture("hallbot");
    }
    function ch1QTick() {
      (n.scene || "")[0] === "Q" && (n.ctrl && (n.act = pick(ch1QSpots())), ch1Watch());
    }
    function ch1RestartNight() {
      ((n.scene = "Q4"),
        (n.room = "hangar"),
        (n.ch1D = !0),
        (n.ch1Duct = !1),
        (n.ch1Night = !0),
        (n.ch1Ship = !1),
        (n.ch1Crew = ""),
        (n.ch1Mail = "empty"),
        (n.ch1Got = 0),
        (n.ch1Signed = 0),
        (n.ch1Mailed = 0),
        (n.sqPose = "stand"),
        (n.sq.x = 140),
        (n.sq.y = 540),
        (n.ctrl = !0));
    }
    function drawCh1Delivery() {
      let night = !!n.ch1Night;
      ((e.fillStyle = night ? "#8d909c" : "#f3efe6"),
        e.fillRect(0, 0, c, b),
        m(28, 18, 904, 604, 18),
        r(night ? "#d5d3cc" : "#f7f4ee", 7));
      let wall = night ? "#c8c6be" : "#f4f1ea",
        floor = night ? "#b7b3a8" : "#ebe4d6";
      ((e.fillStyle = wall), e.fillRect(36, 26, 888, 250), (e.fillStyle = floor), e.fillRect(36, 276, 888, 338), C([36, 276, 924, 276], "#c8c2b6", 4));
      (m(70, 36, 620, 150, 16), r("#1b2450", 5));
      for (let i = 0; i < 28; i++) F(90 + ((i * 97) % 580), 52 + ((i * 53) % 120), 1.4, "#ffffff");
      n.ch1Ship &&
        (m(150, 58, 460, 100, 40),
        r("#d5dbe6", 4),
        g("UPS", 380, 78, 16, y, "center", 900),
        [220, 310, 400, 490].forEach((px) => (L(px, 118, 16), r("#8fd0f2", 3))));
      (m(48, 70, 36, 48, 4),
        r("#e5533d", 3),
        g("FUR", 66, 84, 9, "#ffffff", "center", 900),
        g("PULL DOWN", 66, 100, 6, "#ffffff", "center", 900),
        m(860, 48, 52, 36, 6),
        r("#c4b49a", 3),
        L(886, 66, 10),
        r("#6b6256", 2));
      for (let i = 0; i < 5; i++) C([900, 150 + i * 14, 948, 150 + i * 14], "#8a93a3", 4);
      n.ch1Prop === "delicious" &&
        (m(700, 250, 28, 18, 2), r("#ffcf33", 2), m(760, 180, 22, 16, 2), r("#ff8fb8", 2), C([730, 250, 860, 170], "#9aa3b2", 2));
      n.ch1Prop === "gumble" && (m(668, 430, 22, 16, 2), r("#ffcf33", 2));
      n.ch1Prop === "bin" && (m(230, 470, 18, 14, 2), r("#ffcf33", 2));
      Xp(CH1_PLANT.x, CH1_PLANT.y);
      n.sqPose === "hidden" && ga(CH1_PLANT.x, CH1_PLANT.y - 46);
      (m(248, 500, 36, 44, 4), r("#8a93a3", 3));
      for (let i = 0; i < 3; i++) {
        let ang = n.T * 2 + i;
        C([120 + Math.cos(ang) * 10, 560 + Math.sin(ang) * 6, 120, 560], "rgba(120,170,220,.7)", 2);
      }
      n.ch1Ship && (m(400, 300, 200, 36, 8), r("#9aa7b8", 4), C([420, 318, 580, 318], "#8fd0f2", 3));
      (m(700, 360, 220, 200, 4),
        r(null, 5),
        C([700, 360, 700, 470], y, 5),
        C([700, 470, 760, 470], y, 5),
        m(790, 500, 70, 48, 6),
        r("#2b3a67", 3),
        g("UPS", 825, 524, 12, "#ffffff", "center", 900));
      n.ch1Mail === "full" &&
        (Xn(730, 400, 70, 48, ""),
        Xn(820, 390, 60, 42, ""),
        m(760, 470, 50, 36, 4),
        r("#c4b49a", 3),
        n.ch1Prop === "open" && (m(730, 360, 70, 16, 3), r("#d9a35b", 3), Qt(760, 430, "#3478f6", 1.6, -1)));
      (n.ch1Crew === "day" || n.ch1Crew === "pickup") &&
        [
          ["DOT", 250, 560],
          ["BOB", 330, 545],
          ["LOU", 410, 560],
        ].forEach(([name, px, py]) => {
          (Qt(px, py, "#8a93a3", 2.35, -0.4), m(px - 28, py - 78, 56, 16, 3), r("#ffffff", 2), g(name, px, py - 70, 11, y));
        });
      (!night && Qt(560, 430, "#c9b6f2", 2.9, 0.2),
        n.moPose !== "hidden" && Fe(n.mo.x, n.mo.y, he * 1.15, { f: n.mo.f || 1, walk: n.mo.moving ? n.mo.walk : 0, mop: !1 }),
        n.sqPose === "ball" && drawL2Ball(n.sq.x, n.sq.y - 16),
        n.sqPose !== "hidden" &&
          n.sqPose !== "ball" &&
          Re(n.sq.x, n.sq.y, he, { f: n.sq.f || 1, walk: n.sq.moving ? n.sq.walk : 0, janitor: !!n.costumeOn, goatBeard: !!n.costumeOn }),
        night && Qt(CH1_ROBOT.x, CH1_ROBOT.y, "#e8eef8", 1.8, 0));
    }
    function drawCh1Duct() {
      ((e.fillStyle = "#2a3142"),
        e.fillRect(0, 0, c, b),
        m(40, 80, 880, 480, 18),
        r("#3d4658", 6),
        g("IDEAS FOR GUARDIANS", 250, 130, 16, "#d5dbe6", "center", 900),
        g("HAVE YOU SEEN?", 620, 120, 14, "#ffffff", "center", 900),
        g("MARS", 620, 150, 16, "#ffb4b4", "center", 900),
        g("NO", 680, 150, 16, "#e5533d", "center", 900),
        m(700, 300, 80, 50, 4),
        r("#c4b49a", 3),
        g("TOYS", 740, 326, 14, y, "center", 900),
        m(80, 240, 120, 160, 4),
        r("#1e2430", 4));
      for (let i = 0; i < 6; i++) C([90, 260 + i * 22, 190, 260 + i * 22], "#9aa3b2", 3);
      (n.sqPose === "hidden" && ga(140, 300),
        m(400, 340, 160, 18, 3),
        r("#8a7560", 3),
        m(430, 300, 28, 36, 2),
        r("#ff8fb8", 2),
        n.moPose !== "hidden" && Fe(n.mo.x, n.mo.y, he, { f: n.mo.f || -1, walk: 0, mop: !1 }));
    }
