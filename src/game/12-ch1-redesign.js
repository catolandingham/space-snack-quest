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
    // Standing sight is the hall robot's existing cone and feet circle. These are not the ball distances.
    const STAND_CONE_LEN = 210,
      STAND_CONE_HALF = 0.42,
      STAND_FEET = 70,
      STAND_FACE = Math.PI / 2;
    function ballHides(dist, looking) {
      // Farther than BALL_MISS_FAR he is missed even if the robot is looking. That is what makes option C
      // (miss 220) different from a look range of 220, and what makes A and B's miss distances real.
      if (dist > BALL_MISS_FAR) return !0;
      if (dist < BALL_SPOT_NEAR) return !1;
      if (looking && dist < Math.min(BALL_LOOK_RANGE, BALL_MISS_FAR)) return !1;
      return !0;
    }
    function ch1InCone(px, py) {
      let ox = CH1_ROBOT.x,
        oy = CH1_ROBOT.y - 28;
      return Math.hypot(px - CH1_ROBOT.x, py - CH1_ROBOT.y) < STAND_FEET || vt(px, py - 20, ox, oy, STAND_FACE, STAND_CONE_HALF, STAND_CONE_LEN);
    }
    // Plant (hidden) is never seen. A ball is seen less often than standing in the same spot, and more often than a plant.
    function ch1CaughtAt(px, py, pose) {
      if (pose === "hidden") return !1;
      let looking = ch1InCone(px, py);
      if (pose === "ball") return !ballHides(Math.hypot(px - CH1_ROBOT.x, py - CH1_ROBOT.y), looking);
      return looking;
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
            spec.who === "sq" ? (n.moPose = "hidden") : (n.moPose = "stand"),
            n.ch1Walks.push({ phase: "in", room: n.room, x: Math.round(n.sq.x), y: Math.round(n.sq.y) }));
        }),
        cV((dt) => ch1Move(dt, spec.stand[0], spec.stand[1], 260, spec.who)),
        N(next),
      ]);
    }
    function ch1Hop(spec, next) {
      ch1Walk(spec, next);
    }
    // Home is below the hall. The delivery room is to the right of the hall, so you leave it to the left.
    function ch1Go(dest, flags, next) {
      let f = flags || {},
        who = f.who || "both",
        from = n.ch1Duct ? "duct" : n.ch1D ? "delivery" : n.room === "hall" ? "hall" : "closet",
        homeHall = () => ({
          who,
          exit: [840, 510],
          off: [1060, 510],
          to: "hall",
          entry: [480, 590],
          stand: [480, 470],
          scene: f.scene,
          delivery: !1,
          duct: !1,
          night: !1,
          ship: !1,
          crew: "",
          mail: "",
        }),
        hallDel = () => ({
          who,
          exit: [880, 500],
          off: [1120, 500],
          to: "hangar",
          entry: [70, 520],
          stand: [240, 520],
          scene: f.scene,
          delivery: !0,
          duct: !1,
          night: !!f.night,
          ship: !!f.ship,
          crew: f.crew || "",
          mail: f.mail || "",
        }),
        delHall = () => ({
          who,
          exit: [70, 520],
          off: [-80, 520],
          to: "hall",
          entry: [900, 500],
          stand: [520, 500],
          scene: f.scene,
          delivery: !1,
          duct: !1,
          night: !1,
          ship: !1,
          crew: "",
          mail: "",
        }),
        hallHome = () => ({
          who,
          exit: [480, 590],
          off: [480, 740],
          to: "closet",
          entry: [820, 500],
          stand: [430, 510],
          scene: f.scene,
          delivery: !1,
          duct: !1,
          night: !1,
          ship: !1,
          crew: "",
          mail: "",
        }),
        delDuct = () => ({
          who,
          exit: [860, 470],
          off: [1060, 470],
          to: "duct",
          entry: [130, 440],
          stand: [240, 440],
          scene: f.scene,
          delivery: !1,
          duct: !0,
          night: !0,
          ship: !1,
          crew: "",
          mail: "",
        }),
        ductDel = () => ({
          who,
          exit: [150, 440],
          off: [20, 440],
          to: "hangar",
          entry: [840, 490],
          stand: [700, 500],
          scene: f.scene,
          delivery: !0,
          duct: !1,
          night: f.night !== !1,
          ship: !!f.ship,
          crew: f.crew || "",
          mail: f.mail || "",
        });
      if (from === "closet" && dest === "delivery") return ch1Hop(homeHall(), () => ch1Hop(hallDel(), next));
      if (from === "delivery" && dest === "closet") return ch1Hop(delHall(), () => ch1Hop(hallHome(), next));
      if (from === "delivery" && dest === "hall") return ch1Hop(delHall(), next);
      if (from === "hall" && dest === "closet") return ch1Hop(hallHome(), next);
      if (from === "hall" && dest === "delivery") return ch1Hop(hallDel(), next);
      if (from === "closet" && dest === "hall") return ch1Hop(homeHall(), next);
      if (from === "delivery" && dest === "duct") return ch1Hop(delDuct(), next);
      if (from === "duct" && dest === "delivery") return ch1Hop(ductDel(), next);
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
          N(() => ch1Go("delivery", { ship: !0, crew: "day", mail: "empty", scene: "Q2", night: !1 }, ch1AtDelivery)),
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
            ((n.sqPose = "stand"), (n.ch1Prop = ""), ch1Go("hall", { scene: "Q3" }, ch1Snack));
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
          N(() => ch1Go("closet", { scene: "Q3" }, ch1Bedtime)),
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
              ch1Go("delivery", { who: "sq", night: !0, ship: !1, crew: "", mail: "empty", scene: "Q4" }, ch1NightPlay));
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
          N(() => ch1Go("closet", { who: "sq", scene: "Q3" }, ch1Week)),
        ]));
    }
    function ch1Week() {
      J([
        { k: "card", id: "time", text: "Six days later" },
        N(() => ch1Go("delivery", { night: !0, ship: !1, crew: "tease", mail: "empty", scene: "Q5" }, ch1Tease)),
      ]);
    }
    function ch1Tease() {
      ((n.moPose = "stand"),
        (n.mo.x = 620),
        (n.mo.y = 500),
        (n.ch1Crew = "tease"),
        J([
          v("ups", "We could wipe the floor with that beard."),
          v("ups", "HQ sent us a message. You're going to be replaced this week anyway."),
          v("mops", "The new robots come on the ship tomorrow. Let's go find the pancake stand."),
          v("sq", "Oh, it was on the form I sent, I mean, never mind."),
          v("sq", "A copy got sucked into the vent.", "whisper"),
          N(() => {
            ((n.scene = "Q5"),
              (n.ctrl = !0),
              (n.ch1Crew = ""),
              (n.sqPose = "stand"),
              (n.sq.x = CH1_VENT.x - 30),
              (n.sq.y = CH1_VENT.y));
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
            ((n.sqPose = "hidden"), ch1Go("duct", { scene: "Q6", night: !0 }, ch1Workstation));
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
        (n.ch1Prop = "desk"),
        J([
          v("sq", "I hope Mops doesn't notice...", "whisper"),
          { k: "panel", id: "ch1slip" },
          N(() => {
            n.ch1Prop = "teeth";
          }),
          v("mops", "Hurry, hurry, pink slip, got it!"),
          N(() => ch1Go("delivery", { night: !0, ship: !1, crew: "", mail: "empty", scene: "Q6" }, ch1PinkReady)),
        ]));
    }
    function ch1PinkReady() {
      ((n.ch1Prop = "teeth"),
        (n.sqPose = "stand"),
        (n.ctrl = !0),
        (n.scene = "Q6"),
        (n.sq.x = 640),
        (n.sq.y = 500),
        (n.mo.x = 720),
        (n.mo.y = 500),
        (n.moPose = "stand"),
        J([v("sq", "Get it before he sees it.", "whisper"), N(() => ((n.ctrl = !0), (n.scene = "Q6")))]));
    }
    function ch1GrabPink() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.ch1Prop = "paw"),
        J([N(() => ch1Go("closet", { scene: "Q7", night: !1, ship: !1 }, ch1Site))]));
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
        J([N(() => ch1Go("delivery", { night: !1, ship: !0, crew: "pickup", mail: "full", scene: "Q2" }, ch1Pickup))]));
    }
    function ch1Pickup() {
      ((n.ch1Prop = "open"),
        (n.ch1Peeked = !0),
        (n.sqPose = "hidden"),
        (n.sq.x = CH1_PLANT.x),
        (n.sq.y = CH1_PLANT.y),
        J([
          uV(0.8),
          N(() => {
            ((n.ch1Prop = ""), (n.sqPose = "stand"), ch1Go("closet", { scene: "Q8", night: !1, ship: !1 }, ch1Costume));
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
          N(() => ch1Go("delivery", { night: !1, ship: !0, crew: "day", mail: "full", scene: "Q9" }, ch1AtScanner)),
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
          out.push(
            spot({
              id: "ventball",
              verb: "ROLL",
              cap: "ball",
              who: "sq",
              x: CH1_VENT.x,
              y: CH1_VENT.y,
              r: 120,
              at: [CH1_VENT.x, CH1_VENT.y - 70],
              hot: !0,
              f: ch1BallThere,
            }),
          ),
        s === "Q6" &&
          out.push(
            spot({
              id: "pink",
              verb: "GRAB",
              cap: "pink slip",
              who: "sq",
              x: 680,
              y: 500,
              r: 150,
              at: [700, 430],
              hot: !0,
              f: ch1GrabPink,
            }),
          ),
        s === "Q7" &&
          out.push(spot({ id: "crate", verb: "RETURN", cap: "empty crate", who: "sq", x: 460, y: 520, r: 180, hot: !0, f: ch1ReturnCrate })),
        s === "Q8" && out.push(spot({ id: "beard", verb: "TRIM", cap: "beard", who: "sq", x: 460, y: 510, r: 200, hot: !0, f: ch1Trim })),
        s === "Q9" && out.push(spot({ id: "scan", verb: "BOARD", cap: "scanner", who: "sq", x: 480, y: 500, r: 160, hot: !0, f: ch1Board })),
        s === "Q4" &&
          out.push(
            spot({
              id: "ball",
              verb: "ROLL",
              cap: "ball",
              who: "sq",
              at: [n.sq.x, n.sq.y - 70],
              hot: !0,
              f: () => {
                n.sqPose = "ball";
              },
            }),
          ));
      return out;
    }
    function ch1Watch() {
      if (!n.ctrl || n.scene !== "Q4" || x.mops) return;
      let seen = ch1CaughtAt(n.sq.x, n.sq.y, n.sqPose);
      n.ch1Alert = !!seen;
      seen && capture("delivery");
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
    function drawGameBin(px, py) {
      (e.beginPath(),
        e.moveTo(px - 16, py - 36),
        e.lineTo(px + 16, py - 36),
        e.lineTo(px + 12, py),
        e.lineTo(px - 12, py),
        e.closePath(),
        r("#8a93a3", 3),
        X(px, py - 36, 20, 5),
        r("#6b7280", 2));
    }
    function drawPinkSlip(px, py) {
      (m(px, py, 18, 14, 2), r("#ff8fb8", 2), C([px + 3, py + 4, px + 15, py + 4], "#9aa3b2", 1));
    }
    function drawMailRobot(px, py) {
      (dq(px, py, !0), g("UPS", px, py - 8, 10, "#ffffff", "center", 900));
    }
    function drawCh1Delivery() {
      let night = !!n.ch1Night;
      ((e.fillStyle = night ? "#8d909c" : "#f3efe6"),
        e.fillRect(0, 0, c, b),
        m(28, 18, 904, 604, 18),
        r(night ? "#d5d3cc" : "#f7f4ee", 7));
      let wall = night ? "#c8c6be" : "#f4f1ea",
        floor = night ? "#b7b3a8" : "#ebe4d6";
      ((e.fillStyle = wall),
        e.fillRect(40, 28, 880, 248),
        (e.fillStyle = floor),
        e.fillRect(40, 276, 880, 330),
        C([40, 276, 900, 276], "#c8c2b6", 4));
      (m(80, 40, 620, 150, 16), r("#1b2450", 5));
      for (let i = 0; i < 28; i++) F(100 + ((i * 97) % 580), 56 + ((i * 53) % 120), 1.4, "#ffffff");
      n.ch1Ship &&
        (m(160, 62, 460, 100, 40),
        r("#d5dbe6", 4),
        g("UPS", 390, 82, 16, y, "center", 900),
        [230, 320, 410, 500].forEach((px) => (L(px, 122, 16), r("#8fd0f2", 3))),
        e.beginPath(),
        e.moveTo(400, 168),
        e.lineTo(560, 168),
        e.lineTo(620, 300),
        e.lineTo(340, 300),
        e.closePath(),
        r("#b7c0cc", 4),
        dq(480, 250, !1),
        C([400, 250, 400, 340], "#9aa7b8", 6),
        C([560, 250, 560, 340], "#9aa7b8", 6),
        m(370, 236, 220, 24, 6),
        r("#c5ced8", 4),
        C([400, 258, 560, 258], "#8fd0f2", 3),
        C([400, 272, 560, 272], "#8fd0f2", 2),
        dq(480, 330, !1));
      (m(52, 78, 36, 48, 4),
        r("#e5533d", 3),
        g("FUR", 70, 92, 9, "#ffffff", "center", 900),
        g("PULL DOWN", 70, 108, 6, "#ffffff", "center", 900),
        m(820, 70, 52, 36, 6),
        r("#c4b49a", 3),
        L(846, 88, 10),
        r("#6b6256", 2));
      for (let i = 0; i < 5; i++) C([848, 130 + i * 12, 888, 130 + i * 12], "#8a93a3", 4);
      n.ch1Prop === "delicious" && (drawPinkSlip(760, 160), C([730, 250, 860, 170], "#9aa3b2", 2));
      n.ch1Prop === "gumble" && drawPinkSlip(n.mo.x - 8, n.mo.y - 78);
      n.ch1Prop === "bin" && drawPinkSlip(250, 470);
      n.ch1Prop === "teeth" && drawPinkSlip(n.mo.x - 6, n.mo.y - 72);
      n.ch1Prop === "paw" && drawPinkSlip(n.sq.x + 8, n.sq.y - 48);
      (Xp(CH1_PLANT.x, CH1_PLANT.y), n.sqPose === "hidden" && ga(CH1_PLANT.x, CH1_PLANT.y - 46), drawGameBin(250, 520));
      for (let i = 0; i < 3; i++) {
        let ang = n.T * 2 + i;
        C([130 + Math.cos(ang) * 16, 560, 130, 560], "rgba(120,170,220,.8)", 2);
      }
      (m(150, 548, 36, 14, 3), r("#8a93a3", 3));
      (C([700, 340, 700, 520], y, 5), C([700, 520, 760, 520], y, 5), drawMailRobot(830, 540));
      n.ch1Mail === "full" &&
        (Xn(720, 400, 70, 48, ""),
        Xn(800, 420, 56, 40, ""),
        n.ch1Prop === "open" && (m(720, 372, 70, 14, 3), r("#d9a35b", 3), dq(755, 430, !1)));
      (n.ch1Crew === "day" || n.ch1Crew === "pickup") &&
        [
          ["Dot", 250, 580],
          ["Bob", 330, 565],
          ["Lou", 410, 580],
        ].forEach((w) => u5({ x: w[1], y: w[2], name: w[0] }));
      !night && n.ch1Ship && Qt(560, 500, "#c9b6f2", 2.6, 0.2);
      n.ch1Crew === "tease" && [360, 480, 600].forEach((px) => dq(px, 460, !1));
      night &&
        (seenCone(CH1_ROBOT.x, CH1_ROBOT.y - 28, STAND_FACE, STAND_CONE_HALF, STAND_CONE_LEN, "rgba(255,234,120,.38)"),
        dq(CH1_ROBOT.x, CH1_ROBOT.y, !1),
        n.ch1Alert && g("!", CH1_ROBOT.x, CH1_ROBOT.y - 78, 28, "#e5533d", "center", 900));
      (n.moPose !== "hidden" && Fe(n.mo.x, n.mo.y, he * 1.15, { f: n.mo.f || 1, walk: n.mo.moving ? n.mo.walk : 0, mop: !1 }),
        n.sqPose === "ball" && drawL2Ball(n.sq.x, n.sq.y - 16),
        n.sqPose !== "hidden" &&
          n.sqPose !== "ball" &&
          Re(n.sq.x, n.sq.y, he, { f: n.sq.f || 1, walk: n.sq.moving ? n.sq.walk : 0, janitor: !!n.costumeOn, goatBeard: !!n.costumeOn }));
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
        (n.ch1Prop === "desk" || n.ch1Prop === "teeth") && drawPinkSlip(430, 300),
        n.ch1Prop === "teeth" && drawPinkSlip(n.mo.x - 6, n.mo.y - 70),
        n.moPose !== "hidden" && Fe(n.mo.x, n.mo.y, he, { f: n.mo.f || -1, walk: 0, mop: !1 }));
    }
