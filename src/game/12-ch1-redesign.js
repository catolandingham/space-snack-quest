// Redesigned Chapter 1 (the Nov 8 cartoon): lunch, the delivery room, the night mailbox, the vent, the costume, and boarding.
    // Ball hiding (R43). A robot notices a balled-up Squatch only after it stays within one crate-width
    // for two seconds. These two constants are the whole rule, in every room and chapter. Standing and
    // walking still use each robot's existing sight.
    const BALL_NOTICE_RADIUS = 70,
      BALL_NOTICE_SECONDS = 2,
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
      Q8: "Squatch: put on the spare jacket",
      Q9: "Squatch: walk through the scanner",
      QA: "Squatch: look around the party",
    };
    // R73. Brian approved a 3 to 4 minute party. This slice uses 3 minutes.
    // "Cool hat!" is the stand-in for how the party ends when the time runs out.
    const COOL_HAT_SECONDS = 180;
    // R59. The balloon takes about 6 seconds to reach the ceiling. Approved.
    const BALLOON_GRAB_SECONDS = 6;
    // R60. A photo that includes Squatch. Approved by Brian 2026-11-09. Not drawn on screen.
    const PHOTO_BONUS = 25;
    // R60. How long the guests look at the spill. Approved by Brian 2026-11-09.
    const SNACK_LOOK_SECONDS = 4;
    // The corner guest aims the camera left, into the room. The shot is the floor in front of the lens.
    // The SNAP circle covers that floor, so Squatch can walk into the picture and still take it.
    const CH1_CAM = { x: 790, y: 230, r: 110 };
    const CH1_FRAME = { x0: 710, x1: 770, y0: 248, y1: 300 };
    const CH1_KID = { x: 180, y: 540 };
    // Free-play moments. Add another object here for a new party beat.
    const CH1_PARTY_FREE = [
      { id: "snack", verb: "GRAB", cap: "snack", x: 760, y: 530, who: "sq", text: "One snack. That's the rule." },
      { id: "guest", verb: "TALK", cap: "guest", x: 480, y: 540, who: "tourist", text: "Love the shirt." },
      { id: "line", verb: "LISTEN", cap: "snack line", x: 700, y: 500, who: "tourist", text: "I swear we had more Moon Pies... is that what they stole at lunch?" },
    ];
    const CH1_PARTY_SNAG = [
      { id: "plant", verb: "SNAG", cap: "plant", x: 220, y: 530, why: "plant" },
      { id: "vent", verb: "SUCK", cap: "vent", x: 150, y: 420, why: "vent" },
      { id: "guard", verb: "STAND", cap: "guard", x: 860, y: 540, why: "guard" },
    ];
    function ch1QChip() {
      return CH1Q_CHIPS[n.scene] || "";
    }
    // Standing sight is the hall robot's existing cone and feet circle. These are not the ball constants.
    const STAND_CONE_LEN = 210,
      STAND_CONE_HALF = 0.42,
      STAND_FEET = 70,
      STAND_FACE = Math.PI / 2;
    let ballNear = {};
    // Time a robot has spent inside the ball radius. Leaving the radius clears it. A ball is noticed only
    // when that time reaches BALL_NOTICE_SECONDS and the robot's normal standing sight would see him too,
    // so a ball is never caught where standing would be safe.
    function ballNotice(id, dist, dt, standingSees) {
      if (n.sqPose !== "ball" || !(dist <= BALL_NOTICE_RADIUS)) {
        ballNear[id] = 0;
        return !1;
      }
      ballNear[id] = (ballNear[id] || 0) + (dt || 0);
      return ballNear[id] >= BALL_NOTICE_SECONDS && !!standingSees;
    }
    function ballNoticeReset(prefix) {
      if (!prefix) {
        ballNear = {};
        return;
      }
      for (let k in ballNear) k.startsWith(prefix) && (ballNear[k] = 0);
    }
    // Standing and walking return the robot's existing sight. A ball uses the linger rule instead.
    function ballOrStand(id, dist, dt, standingSees) {
      if (n.sqPose !== "ball") {
        ballNotice(id, BALL_NOTICE_RADIUS + 1, 0, !1);
        return !!standingSees;
      }
      return ballNotice(id, dist, dt, standingSees);
    }
    function ch1InCone(px, py) {
      let ox = CH1_ROBOT.x,
        oy = CH1_ROBOT.y - 28;
      return Math.hypot(px - CH1_ROBOT.x, py - CH1_ROBOT.y) < STAND_FEET || vt(px, py - 20, ox, oy, STAND_FACE, STAND_CONE_HALF, STAND_CONE_LEN);
    }
    // Plant (hidden) is never seen. Standing uses the cone above. A ball is not this check: it uses ballNotice.
    function ch1CaughtAt(px, py, pose) {
      if (pose === "hidden" || pose === "ball") return !1;
      return ch1InCone(px, py);
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
            n.room === "closet" && (n.tvOn = !1),
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
    // The walk home is that same hallway backwards (R47). Each door has one off-screen point. Leaving uses
    // it, and coming back walks in from it. Nobody is placed already inside the next room.
    function ch1Go(dest, flags, next) {
      let f = flags || {},
        who = f.who || "both",
        from = n.ch1Duct ? "duct" : n.ch1D ? "delivery" : n.room === "hall" ? "hall" : "closet",
        homeOff = [1060, 510],
        hallBottomOff = [480, 740],
        hallRightOff = [1120, 500],
        delOff = [-80, 520],
        homeHall = (at) => ({
          who,
          exit: [840, 510],
          off: homeOff,
          to: "hall",
          entry: hallBottomOff,
          stand: at || [480, 470],
          scene: f.scene,
          delivery: !1,
          duct: !1,
          night: !1,
          ship: !1,
          crew: "",
          mail: "",
        }),
        hallDel = (at) => ({
          who,
          exit: [880, 500],
          off: hallRightOff,
          to: "hangar",
          entry: delOff,
          stand: at || [240, 520],
          scene: f.scene,
          delivery: !0,
          duct: !1,
          night: !!f.night,
          ship: !!f.ship,
          crew: f.crew || "",
          mail: f.mail || "",
        }),
        delHall = (at) => ({
          who,
          exit: [70, 520],
          off: delOff,
          to: "hall",
          entry: hallRightOff,
          stand: at || [520, 500],
          scene: f.scene,
          delivery: !1,
          duct: !1,
          night: !1,
          ship: !1,
          crew: "",
          mail: "",
        }),
        hallHome = (at) => ({
          who,
          exit: [480, 590],
          off: hallBottomOff,
          to: "closet",
          entry: homeOff,
          stand: at || [430, 510],
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
      if (from === "closet" && dest === "delivery") return ch1Hop(homeHall(), () => ch1Hop(hallDel(f.stand), next));
      if (from === "delivery" && dest === "closet") return ch1Hop(delHall(), () => ch1Hop(hallHome(f.stand), next));
      if (from === "delivery" && dest === "hall") return ch1Hop(delHall(f.stand), next);
      if (from === "hall" && dest === "closet") return ch1Hop(hallHome(f.stand), next);
      if (from === "hall" && dest === "delivery") return ch1Hop(hallDel(f.stand), next);
      if (from === "closet" && dest === "hall") return ch1Hop(homeHall(f.stand), next);
      if (from === "delivery" && dest === "duct") return ch1Hop(delDuct(), next);
      if (from === "duct" && dest === "delivery") return ch1Hop(ductDel(), next);
      console.warn("ch1Go: no walk from " + from + " to " + dest);
      typeof next == "function" && next();
    }
    function ch1Step(who, x, y, speed) {
      let pace = speed || 180;
      return cV((dt) => {
        let sqOk = who === "mo" || mV(n.sq, x, y, pace, dt),
          moOk = who === "sq" || mV(n.mo, who === "mo" ? x : x + 48, y, pace, dt);
        return (ch1Trail(), sqOk && moOk);
      });
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
        (n.ch1SiteRoom = ""),
        (n.ch1Office = !1),
        (n.ch1Party = !1),
        (n.ch1Disguise = !1),
        (n.ch1Photo = !1),
        (n.ch1BarDone = !1),
        (n.ch1Cut = null),
        (n.ch1Dress = null),
        (n.ch1PeekReady = !1),
        (n.ch1Chain = !1),
        (n.ch1Flyer = !1),
        (n.ch1PartyT = 0),
        (n.ch1PartyOver = !1),
        (n.ch1PartyDid = {}),
        (n.ch1Fur = !1),
        (n.tvOn = !1),
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
              (n.scene = "Q1"),
              ch1Day1());
          }),
        ]));
    }
    function ch1AtDelivery() {
      ((n.scene = "Q2"),
        (n.sqPose = "stand"),
        J([
          ch1Step("sq", CH1_PLANT.x, CH1_PLANT.y, 180),
          N(() => {
            ((n.sqPose = "hidden"), (n.sq.x = CH1_PLANT.x), (n.sq.y = CH1_PLANT.y));
          }),
          ch1Step("mo", 640, 500, 180),
          v("official", "Mops, don't worry, you know how much we love you here. Even our visitors always love you."),
          v("tourist", "Isfred Bar Neshuman! The dock needs you."),
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
          ch1Step("sq", ne.x, ne.y, 200),
          N(() => {
            ((n.sqPose = "hidden"), (n.sq.x = ne.x), (n.sq.y = ne.y));
          }),
          uV(0.8),
          N(() => {
            n.sqPose = "stand";
          }),
          ch1Step("sq", 460, 530, 200),
          v("mops", "Didn't you hear what Isfred Bar Neshuman said? They need me here, they're not going to replace me. Plus the Guardians are here."),
          v("mops", "I need to get back to work, we'll talk about it tonight."),
          N(() => ch1Go("closet", { scene: "Q3" }, ch1Bedtime)),
        ]));
    }
    function ch1Bedtime() {
      ((n.scene = "Q3"),
        (n.sqPose = "stand"),
        (n.moPose = "stand"),
        J([
          cV((dt) => (ch1Trail(), mV(n.sq, 205, 470, 180, dt) && mV(n.mo, 470, 460, 180, dt))),
          N(() => {
            ((n.sqPose = "sleep"), (n.sq.x = 205), (n.sq.y = 470), (n.mo.x = 470), (n.mo.y = 460));
          }),
          { k: "panel", id: "ch1guard" },
          N(() => {
            ((n.sqPose = "stand"), (n.wardrobe = "closed"), (n.scene = "Q4"), (n.ctrl = !0), ch1NightPlay());
          }),
        ]));
    }
    function ch1PartyPeek() {
      ((n.scene = "QA"),
        (n.ch1Party = !0),
        (n.ch1Disguise = !1),
        (n.ch1Flyer = !1),
        (n.ch1PartyT = 0),
        (n.ch1PartyOver = !1),
        (n.ch1PartyDid = {}),
        (n.ch1Snacks = 0),
        (n.ch1Hugs = 0),
        (n.ch1Look = 0),
        (n.ch1Spill = 0),
        (n.ch1HatAskew = !1),
        (n.ch1Photo = !1),
        (n.ch1InShot = !1),
        (n.ch1Balloon = ""),
        (n.ch1BalloonRest = ""),
        (n.ch1BalloonPopped = !1),
        (n.ch1BalloonPop = 0),
        (n.ch1BalloonPops = 0),
        (n.ch1Kid = ""),
        (n.sqPose = "hidden"),
        (n.sq.x = 220),
        (n.sq.y = 530),
        (n.moPose = "hidden"),
        (n.mo.x = -400),
        J([
          v("official", "Welcome, Bleep-Bloop Robotics delegation!"),
          { k: "card", id: "somebody", text: "Everybody has somebody." },
          v("sq", "Robots?", "whisper"),
          N(() => {
            ((n.sqPose = "stand"), (n.ctrl = !0));
          }),
        ]));
    }
    function ch1PartySpots() {
      if (n.ch1PartyOver) return [];
      if (!n.ch1Disguise)
        return [
          spot({
            id: "disguise",
            verb: "PUT ON",
            cap: "tourist disguise",
            who: "sq",
            x: 220,
            y: 530,
            r: 160,
            hot: !0,
            f: () => {
              ((n.ch1Disguise = !0), (n.act = null));
            },
          }),
        ];
      if (!n.ch1Flyer)
        return [
          spot({
            id: "flyer",
            verb: "TAKE",
            cap: "robot flyer",
            who: "sq",
            x: 480,
            y: 430,
            r: 140,
            hot: !0,
            f: () => {
              ((n.ch1Flyer = !0),
                (n.ch1PartyT = 0),
                (n.ch1Balloon = "up"),
                (n.ch1BalloonT = 0),
                (n.ch1BalloonY = 460),
                (n.ch1Kid = "gasp"),
                (n.act = null));
            },
          }),
        ];
      let out = [];
      n.ch1Balloon === "up" &&
        n.ch1BalloonT < BALLOON_GRAB_SECONDS &&
        out.push(
          spot({
            id: "jump",
            verb: "JUMP",
            cap: "balloon",
            who: "sq",
            x: CH1_KID.x,
            y: n.ch1BalloonY,
            r: 220,
            hot: !0,
            f: ch1JumpBalloon,
          }),
        );
      n.ch1Balloon === "held" &&
        (out.push(
          spot({
            id: "give",
            verb: "GIVE",
            cap: "balloon",
            who: "sq",
            x: CH1_KID.x,
            y: CH1_KID.y,
            r: 160,
            hot: !0,
            f: ch1GiveBalloon,
          }),
        ),
        out.push(
          spot({
            id: "keep",
            verb: "KEEP",
            cap: "balloon",
            who: "sq",
            x: 700,
            y: 540,
            r: 160,
            f: ch1KeepBalloon,
          }),
        ));
      for (let m of CH1_PARTY_FREE)
        m.id !== "snack" &&
          m.id !== "line" &&
          !n.ch1PartyDid[m.id] &&
          out.push(
            spot({
              id: m.id,
              verb: m.verb,
              cap: m.cap,
              who: "sq",
              x: m.x,
              y: m.y,
              r: 90,
              f: () => (m.id === "snack" ? ch1SnackGrab() : ((n.ch1PartyDid[m.id] = !0), (n.ctrl = !1), (n.act = null), J([v(m.who, m.text), N(() => (n.ctrl = !0))]))),
            }),
          );
      !n.ch1BarDone &&
        out.push(
          spot({
            id: "bar",
            verb: "OPEN",
            cap: "snack bar",
            who: "sq",
            x: 760,
            y: 530,
            r: 100,
            f: ch1BarOpen,
          }),
        );
      !n.ch1Photo &&
        out.push(
          spot({
            id: "photo",
            verb: "SNAP",
            cap: "photo",
            who: "sq",
            x: CH1_CAM.x,
            y: CH1_CAM.y,
            r: CH1_CAM.r,
            f: ch1Photo,
          }),
        );
      for (let m of CH1_PARTY_SNAG)
        out.push(
          spot({
            id: m.id,
            verb: m.verb,
            cap: m.cap,
            who: "sq",
            x: m.x,
            y: m.y,
            r: 80,
            f: () => ch1HatOff(m.why),
          }),
        );
      n.ch1Disguise &&
        (n.ch1Hugs || 0) < 2 &&
        out.push(
          spot({
            id: "hug",
            verb: "HUG",
            cap: "octopus",
            who: "sq",
            x: 820,
            y: 540,
            r: 80,
            f: ch1Hug,
          }),
        );
      (n.ch1Look || 0) > 0 &&
        out.push(
          spot({
            id: "hide",
            verb: "HIDE",
            cap: "plant",
            who: "sq",
            x: 220,
            y: 530,
            r: 90,
            f: () => {
              ((n.sqPose = "hidden"), (n.sq.x = 220), (n.sq.y = 530));
            },
          }),
        );
      return out;
    }
    function ch1SnackGrab() {
      ((n.ch1Snacks = (n.ch1Snacks || 0) + 1), (n.ctrl = !1), (n.act = null));
      n.ch1Snacks >= 3 && ((n.ch1PartyDid.snack = !0), (n.ch1Look = SNACK_LOOK_SECONDS), (n.ch1Spill = 1), D.splash());
      J([v("sq", "One snack. That's the rule."), N(() => (n.ctrl = !0))]);
    }
    function ch1Hug() {
      ((n.ch1Hugs = (n.ch1Hugs || 0) + 1), (n.ctrl = !1), (n.act = null));
      n.ch1Hugs === 1
        ? ((n.ch1HatAskew = !0), J([v("tourist", "*hic* Fellow tourist!"), N(() => (n.ctrl = !0))]))
        : J([N(() => ch1HatOff("hug"))]);
    }
    function ch1InFrame(x, y) {
      return x > CH1_FRAME.x0 && x < CH1_FRAME.x1 && y > CH1_FRAME.y0 && y < CH1_FRAME.y1;
    }
    function ch1Photo() {
      let inFrame = ch1InFrame(n.sq.x, n.sq.y);
      ((n.ch1Photo = !0), (n.ch1InShot = inFrame), inFrame && (n.stars = (n.stars || 0) + PHOTO_BONUS), (n.ctrl = !1), (n.act = null));
      J([{ k: "panel", id: "ch1photo" }, N(() => (n.ctrl = !0))]);
    }
    function ch1JumpBalloon() {
      n.ch1Balloon === "up" &&
        ((n.ch1Balloon = "held"), (n.ch1JumpT = 0.55), (n.ch1Kid = "wide"), (n.act = null));
    }
    function ch1GiveBalloon() {
      ((n.ctrl = !1),
        (n.act = null),
        J([
          ch1Step("sq", CH1_KID.x, CH1_KID.y, 200),
          N(() => {
            ((n.ch1Balloon = "back"), (n.ch1Kid = "wide"));
          }),
          uV(0.4),
          N(() => {
            n.ch1Kid = "smile";
          }),
          uV(0.4),
          N(() => {
            n.ch1Kid = "shh";
          }),
          uV(0.4),
          N(() => {
            ((n.ch1Kid = "up"), (n.ctrl = !0));
          }),
        ]));
    }
    function ch1KeepBalloon() {
      ((n.ctrl = !1),
        (n.act = null),
        J([
          ch1Step("sq", 720, 540, 200),
          v("kid", "Scary Wookiee!"),
          N(() => ch1HatOff("scare")),
        ]));
    }
    function ch1StampBalloon() {
      ((n.ch1Save = { balloonRest: n.ch1BalloonRest || "", balloonPopped: !!n.ch1BalloonPopped }),
        ch2.check && ((ch2.check.balloonRest = n.ch1Save.balloonRest), (ch2.check.balloonPopped = n.ch1Save.balloonPopped)));
    }
    function ch1LoadBalloon() {
      let saved = ch2.check && ch2.check.balloonRest != null ? ch2.check : n.ch1Save;
      saved && saved.balloonRest != null && ((n.ch1BalloonRest = saved.balloonRest || ""), (n.ch1BalloonPopped = !!saved.balloonPopped));
    }
    // The balloon stays in the hall. Back or held means he left it behind, tied up. Anything else is a miss.
    function ch1LockBalloon() {
      n.ch1BalloonRest ||
        !n.ch1Balloon ||
        ((n.ch1BalloonRest = n.ch1Balloon === "back" || n.ch1Balloon === "held" ? "tied" : "ceiling"), ch1StampBalloon());
    }
    function ch1BalloonPopNow() {
      if (n.ch1BalloonPopped || !n.ch1BalloonRest) return;
      ((n.ch1BalloonPopped = !0), (n.ch1BalloonPops = (n.ch1BalloonPops || 0) + 1), (n.ch1BalloonPop = 0.85), D.pop(), ch1StampBalloon());
    }
    function ch1HatOff(why) {
      if (n.ch1PartyOver || !n.ch1Disguise) return;
      ch1LockBalloon();
      ((n.ch1Disguise = !1), (n.ch1PartyOver = !0), (n.ctrl = !1), (n.act = null), (n.ch1Fur = !0));
      let lines = [];
      why === "cool" && lines.push(v("tourist", "Cool hat!"));
      why === "bar" && lines.push(v("tourist", "Wait a second... fur!"));
      lines.push(
        v("tourist", "FUR! Security!"),
        v("pa", "FUR! Security!", "pa"),
        { k: "panel", id: "ch1fur" },
        N(() => {
          ((n.ch1Party = !1), (n.ch1Fur = !1), ch1Go("closet", { who: "sq", scene: "Q3" }, ch1PartyHome));
        }),
      );
      J(lines);
    }
    function ch1PartyHome() {
      ((n.moPose = "stand"),
        (n.mo.x = 520),
        (n.mo.y = 500),
        (n.ch1Party = !1),
        J([
          v("mops", "A flyer. And fur on the floor."),
          N(() => {
            ((n.tvOn = !0), (n.scene = "Q1"));
          }),
          v("mops", "I know you, Squatch, you're probably hungry... you know the rule, grab one snack."),
          v("mops", "My lunch! You're the best."),
          v("pa", "Universal Postal Service ship arriving!", "pa"),
          v("sq", "Please let me follow you, I'll be really sneaky."),
          v("mops", "Okay, just this time, but hide carefully."),
          N(() => ch1Go("delivery", { ship: !0, crew: "day", mail: "empty", scene: "Q2", night: !1 }, ch1AtDelivery)),
        ]));
    }
    function ch1PartyTick(dt) {
      if (n.scene !== "QA" || n.ch1PartyOver) return;
      n.ch1JumpT > 0 && (n.ch1JumpT -= dt || 0);
      (n.ch1Look || 0) > 0 && (n.ch1Look = Math.max(0, n.ch1Look - (dt || 0)));
      (n.ch1Spill || 0) > 0 && (n.ch1Spill = Math.max(0, n.ch1Spill - (dt || 0) / 1.8));
      n.ctrl &&
        n.ch1Disguise &&
        n.ch1Flyer &&
        n.ch1Balloon === "up" &&
        !n.ch1Cut &&
        ((n.ch1BalloonT = (n.ch1BalloonT || 0) + (dt || 0)),
        (n.ch1BalloonY = 460 - (460 - 80) * Math.min(1, n.ch1BalloonT / BALLOON_GRAB_SECONDS)),
        n.ch1BalloonT >= BALLOON_GRAB_SECONDS && ((n.ch1Balloon = "ceiling"), (n.ch1Kid = "sad")));
      n.ctrl &&
        n.ch1Disguise &&
        n.ch1Flyer &&
        !n.ch1Cut &&
        !(n.ch1Dress && n.ch1Dress.on) &&
        ((n.ch1PartyT = (n.ch1PartyT || 0) + (dt || 0)), n.ch1PartyT >= COOL_HAT_SECONDS && ch1HatOff("cool"));
    }
    function ch1BalloonTick(dt) {
      n.room === "hall" && n.ch1Office && ch1BalloonPopNow();
      n.ch1BalloonPop > 0 && (n.ch1BalloonPop = Math.max(0, n.ch1BalloonPop - (dt || 0)));
    }
    function ch1NightPlay() {
      ((n.scene = "Q4"), (n.ctrl = !0), (n.sqPose = "stand"), chipNow());
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
        (n.ch1Crew = "tease"),
        J([
          ch1Step("mo", 620, 500, 180),
          v("ups", "We could wipe the floor with that beard."),
          v("ups", "HQ sent us a message. You're going to be replaced this week anyway."),
          v("mops", "The new robots come on the ship tomorrow. Let's go find the pancake stand."),
          v("sq", "Oh, it was on the form I sent, I mean, never mind."),
          v("sq", "A copy got sucked into the vent.", "whisper"),
          N(() => {
            ((n.scene = "Q5"), (n.ch1Crew = ""), (n.sqPose = "stand"));
          }),
          ch1Step("sq", CH1_VENT.x - 30, CH1_VENT.y, 180),
          N(() => {
            ((n.ctrl = !0), (n.sq.x = CH1_VENT.x - 30), (n.sq.y = CH1_VENT.y));
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
        (n.sqPose = "stand"),
        (n.ch1Prop = "desk"),
        J([
          cV((dt) => (ch1Trail(), mV(n.sq, 180, 440, 160, dt) && mV(n.mo, 520, 440, 160, dt))),
          N(() => {
            ((n.sqPose = "hidden"), (n.sq.x = 180), (n.sq.y = 440), (n.mo.x = 520), (n.mo.y = 440));
          }),
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
        (n.scene = "Q6"),
        (n.moPose = "stand"),
        J([
          cV((dt) => (ch1Trail(), mV(n.sq, 640, 500, 160, dt) && mV(n.mo, 720, 500, 160, dt))),
          v("sq", "Get it before he sees it.", "whisper"),
          N(() => ((n.ctrl = !0), (n.scene = "Q6"))),
        ]));
    }
    function ch1GrabPink() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.ch1Prop = "paw"),
        J([
          v("sq", "The code from the slip. His computer.", "whisper"),
          N(() => ch1Go("hall", { scene: "Q7", night: !1, ship: !1, stand: [lt.x, 420] }, ch1Site)),
        ]));
    }
    function ch1Site() {
      // The Moon Pie page is on the manager's computer in the hall (R46), never on the home TV.
      ((n.scene = "Q7"),
        (n.room = "hall"),
        (n.ch1D = !1),
        (n.tvOn = !1),
        (n.ch1SiteRoom = "hall"),
        J([
          { k: "panel", id: "ch1site" },
          N(() => {
            ((n.ctrl = !0), (n.scene = "Q7"));
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
      // R38: crates leave storage for the belt. Squatch is inside one. Mops comes in, he climbs out, they walk home.
      ((n.ch1Prop = "load"),
        (n.ch1InCrate = !0),
        (n.ch1Peeked = !0),
        (n.ch1Load = 0),
        (n.sqPose = "hidden"),
        (n.sq.x = 780),
        (n.sq.y = 520),
        (n.moPose = "stand"),
        (n.mo.x = -40),
        (n.mo.y = 520),
        (n.ctrl = !1),
        J([
          cV((dt) => {
            n.ch1Load = Math.min(1, (n.ch1Load || 0) + dt * 0.55);
            let arrived = mV(n.mo, 690, 520, 160, dt);
            return (ch1Trail(), n.ch1Load >= 1 && arrived);
          }),
          v("mops", "Get out. They're checking a crate."),
          N(() => {
            ((n.ch1InCrate = !1), (n.sqPose = "stand"), (n.ch1Climbed = !0));
          }),
          ch1Step("sq", 760, 520, 120),
          cV((dt) => (ch1Trail(), mV(n.sq, 680, 530, 140, dt))),
          N(() => ch1Go("closet", { scene: "Q8", night: !1, ship: !1 }, ch1Costume)),
        ]));
    }
    function ch1Costume() {
      ((n.scene = "Q8"),
        (n.wardrobe = "open"),
        (n.room = "closet"),
        J([
          ch1Step("sq", 460, 510, 160),
          v("mops", "The spare jacket. The beard. And the horns."),
          N(() => {
            n.ctrl = !0;
          }),
        ]));
    }
    function ch1Trim() {
      ((n.costumeOn = !0),
        (n.ctrl = !1),
        (n.act = null),
        J([
          v("mops", "More bleat. Less roar."),
          N(() => ch1Go("delivery", { night: !1, ship: !0, crew: "day", mail: "full", scene: "Q9", stand: [400, 500] }, ch1AtScanner)),
        ]));
    }
    function ch1AtScanner() {
      ((n.scene = "Q9"), (n.ctrl = !0), (n.costumeOn = !0));
    }
    function ch1Board() {
      ((n.ctrl = !1),
        (n.act = null),
        (n.costumeOn = !0),
        J([
          v("scanner", "HAIR... PROBABLY. PROCEED."),
          cV((dt) => (ch1Trail(), (n.costumeOn = !0), mV(n.sq, 480, 220, 160, dt) && mV(n.mo, 540, 240, 160, dt))),
          { k: "card", id: "later", text: "Later that evening..." },
          N(() => {
            ((n.room = "hall"),
              (n.ch1D = !1),
              (n.ch1Duct = !1),
              (n.ch1Office = !0),
              (n.scene = "Q9"),
              (n.sqPose = "hidden"),
              (n.moPose = "hidden"),
              (n.sq.x = -400),
              (n.mo.x = -400),
              (B.camX = 0));
          }),
          v("official", "Send in Mops for his Employee of the Month photo."),
          v("robot", "Mops isn't here."),
          v("official", "Not here? He can't live off the station!"),
          v("robot", "He was replaced by the new robot shipment."),
          v("official", "I never ordered a replacement! Get me the security tapes."),
          v("pa", "The base called the ship. It has to stop.", "pa"),
          N(() => {
            (aV.caught + x.caught === 0 && !n.found.has("ghost1") && (n.found.add("ghost1"), (n.stars += 250)), (B.nextBeat = "Ch2"));
          }),
          { k: "panel", id: "tally" },
          N(Ws),
        ]));
    }
    function ch1QSpots() {
      if (n.ch1Cut) return ch1CutSpots();
      if (n.ch1Dress && n.ch1Dress.on) return ch1DressSpots();
      if (n.ch1PeekReady && n.ctrl) return ch1PeekSpots();
      if (n.scene === "QA") return n.ctrl && !n.ch1PartyOver ? ch1PartySpots() : [];
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
          out.push(spot({ id: "crate", verb: "RETURN", cap: "empty crate", who: "sq", x: lt.x, y: 420, r: 160, at: [lt.x, lt.y - 40], hot: !0, f: ch1ReturnCrate })),
        s === "Q8" && out.push(spot({ id: "jacket", verb: "PUT ON", cap: "jacket", who: "sq", x: 460, y: 510, r: 200, at: [460, 430], hot: !0, f: ch1Trim })),
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
    function ch1Watch(dt) {
      if (!n.ctrl || n.scene !== "Q4" || x.mops) return;
      let standing = ch1InCone(n.sq.x, n.sq.y),
        dist = Math.hypot(n.sq.x - CH1_ROBOT.x, n.sq.y - CH1_ROBOT.y),
        seen = n.sqPose === "hidden" ? !1 : n.sqPose === "ball" ? ballNotice("ch1night", dist, dt || 0, standing) : standing;
      n.sqPose !== "ball" && ballNotice("ch1night", BALL_NOTICE_RADIUS + 1, 0, !1);
      n.ch1Alert = !!seen;
      seen && capture("delivery");
    }
    function ch1QTick(dt) {
      (n.scene || "")[0] === "Q" && (n.ctrl && (n.act = pick(ch1QSpots())), ch1Watch(dt), ch1PartyTick(dt), ch1BalloonTick(dt), ch1SliceTick(dt));
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
        (n.ctrl = !0),
        ch1LoadBalloon());
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
    function drawCh1Party() {
      (m(250, 36, 460, 44, 8),
        r("#3478f6", 3),
        g("ROBOTICS DELEGATION!", 480, 64, 18, "#ffffff", "center", 900),
        Xp(220, 530),
        n.sqPose === "hidden" && ga(220, 484),
        m(130, 300, 50, 36, 3),
        r("#8a93a3", 3));
      for (let i = 0; i < 4; i++) C([138, 308 + i * 8, 172, 308 + i * 8], y, 2);
      let look = (n.ch1Look || 0) > 0,
        face = look ? 1 : 0,
        glance = (x, y) => look && C([x + 6, y - 34, x + 26, y - 46], "#f0bf93", 3.4);
      (m(700, 500, 120, 28, 4),
        r("#cdbb98", 3),
        !(n.ch1PartyDid && n.ch1PartyDid.snack) &&
          [0, 1, 2].forEach((i) => {
            (F(724 + i * 28, 486, 6, i === 2 ? "#fffdf8" : "#e5533d"), F(730 + i * 28, 498, 4, "#8fdcff"));
          }),
        Qt(340, 520, "#f2c1b0", 1.6, face || 1),
        glance(340, 520),
        Qt(390, 526, "#f2c1b0", 1.6, face || -1),
        glance(390, 526),
        Qt(560, 530, "#1f9d8a", 1.6, face || 1),
        glance(560, 530),
        Qt(620, 524, "#ff8a3d", 1.6, face || -1),
        glance(620, 524),
        Qt(470, 500, "#7ad0c8", 1.6, face || 1),
        glance(470, 500),
        Qt(300, 470, "#7a4ad0", 1.6, face || 1),
        glance(300, 470),
        drawOctopus(820, 540 - Math.abs(Math.sin(n.T * 8)) * 10, face || -1),
        glance(820, 530),
        Qt(790, 230, "#ff8a3d", 1.6, face || -1),
        glance(790, 230),
        m(768, 214, 16, 10, 1),
        r("#1e2430", 1),
        Qt(860, 540, "#59657d", 1.6, face || -1),
        glance(860, 540),
        Qt(480, 400, "#c9b6f2", 1.6, look ? 1 : 0.2),
        glance(480, 400),
        !n.ch1Flyer && (m(500, 360, 16, 12, 1), r("#fffdf8", 1)),
        (n.ch1Spill || 0) > 0 &&
          [0, 1, 2].forEach((i) => {
            let x = 710 + (1 - n.ch1Spill) * 250 + i * 18,
              drop = Math.max(0, x - 840);
            (F(x, 478 + drop, 8, i === 2 ? "#fffdf8" : "#e5533d"), m(x - 5, 494 + drop * 0.65, 10, 12, 2), r("#8fdcff", 2));
          }),
        drawCh1SliceParty(),
        drawBalloonKid());
    }
    function drawOctopus(x, y, f) {
      (e.save(),
        e.translate(x, y),
        F(0, -28, 14, "#e07b00"),
        F(-4, -32, 2, y),
        F(4, -32, 2, y),
        X(0, -24, 5, 3 + Math.abs(Math.sin(n.T * 8)) * 3),
        r("#7a3e10", 1),
        [-18, -8, 8, 18].forEach((dx, i) => C([0, -16, dx, 8 + (i % 2) * 6], "#e07b00", 3)),
        F(-10, 6, 2, "#cdbb98"),
        F(8, 10, 2, "#cdbb98"),
        F(0, 14, 2, "#cdbb98"),
        e.restore(),
        f && 0);
    }
    function drawBalloonKid() {
      let kid = CH1_KID,
        mood = n.ch1Kid || "",
        wobble = Math.sin((n.ch1BalloonT || 0) * 4) * 10,
        bx = kid.x + (n.ch1Balloon === "up" ? wobble : 0),
        by = n.ch1BalloonY || 460;
      (Qt(kid.x, kid.y, "#1f9d8a", 1.05, 1),
        mood === "gasp" && (g("!", kid.x - 34, kid.y - 96, 36, "#e5533d", "center", 900), C([kid.x - 2, kid.y - 22, kid.x - 18, kid.y - 72], "#f0bf93", 4)),
        mood === "wide" && (F(kid.x + 6, kid.y - 46, 4, "#ffffff"), F(kid.x + 6, kid.y - 46, 2, y)),
        mood === "smile" && (C([kid.x + 2, kid.y - 40, kid.x + 8, kid.y - 36, kid.x + 12, kid.y - 40], y, 1.4), F(kid.x + 6, kid.y - 46, 2.2, y)),
        mood === "shh" &&
          (C([kid.x + 2, kid.y - 40, kid.x + 8, kid.y - 36, kid.x + 12, kid.y - 40], y, 1.4),
          C([kid.x + 14, kid.y - 28, kid.x + 8, kid.y - 40], "#f0bf93", 2)),
        mood === "up" &&
          (C([kid.x + 2, kid.y - 40, kid.x + 8, kid.y - 36, kid.x + 12, kid.y - 40], y, 1.4),
          C([kid.x + 16, kid.y - 20, kid.x + 16, kid.y - 36], "#f0bf93", 2.4),
          F(kid.x + 16, kid.y - 38, 3, "#f0bf93")),
        mood === "sad" && C([kid.x + 2, kid.y - 36, kid.x + 8, kid.y - 40, kid.x + 12, kid.y - 36], y, 1.4));
      if (n.ch1Balloon === "up" || n.ch1Balloon === "ceiling") {
        n.ch1Balloon === "up" && (F(bx, by, 26, "rgba(229,83,61,.22)"), F(bx, by, 16, "rgba(255,190,180,.55)"));
        (C([kid.x, kid.y - 20, bx, by + 8], "#e5533d", 1), F(bx, by, 8, "#e5533d"));
      }
      if (n.ch1Balloon === "held") {
        (C([n.sq.x, n.sq.y - 40, n.sq.x, n.sq.y - 78], "#e5533d", 1), F(n.sq.x, n.sq.y - 86, 8, "#e5533d"));
      }
    }
    // R61. After the party the balloon stays in this hall. A miss is on the ceiling. A return or a keep is tied
    // to the plant by the kid, because Squatch does not take it home. The office visit pops it once.
    function drawCh1BalloonLeft() {
      let rest = n.ch1BalloonRest,
        pop = (n.ch1BalloonPop || 0) > 0;
      if (!rest || n.ch1Party || (n.ch1BalloonPopped && !pop)) return;
      let tied = rest === "tied",
        x = tied ? 168 : 420,
        y = tied ? 520 : 140;
      if (pop) {
        for (let i = 0; i < 8; i++) {
          let a = (i / 8) * Math.PI * 2;
          C([x + Math.cos(a) * 6, y + Math.sin(a) * 6, x + Math.cos(a) * 20, y + Math.sin(a) * 20], "#1e2430", 2);
        }
        g("POP!", x, y - 28, 22, "#e5533d", "center", 900);
        return;
      }
      tied ? (Xp(130, 580), C([148, 552, x, y + 10], "#e5533d", 1.4)) : C([x, 160, x, y + 12], "#e5533d", 1.4);
      F(x, y, 14, "#e5533d");
    }
    function drawMailRobot(px, py) {
      (dq(px, py, !0), g("UPS", px, py - 8, 10, "#ffffff", "center", 900));
    }
    function drawPickupLoad() {
      let t = n.ch1Load || 0,
        slide = (x0, y0, x1, y1) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
      // Other crates leave the mail room for the ramp. Squatch's crate stays inside the mail room.
      [
        [800, 500, 520, 330],
        [860, 460, 580, 300],
      ].forEach((s) => {
        let p = slide(s[0], s[1], s[2], s[3]);
        Xn(p[0], p[1], 58, 36, "");
      });
      (Xn(430, 250, 70, 34, ""),
        e.save(),
        e.translate(438, 242),
        e.rotate(-0.8),
        m(0, -6, 64, 12, 2),
        r("#d9a35b", 3),
        e.restore(),
        dq(500, 270, !1),
        Xn(748, 470, 78, 48, ""),
        n.ch1InCrate && ga(787, 482));
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
      (Xp(CH1_PLANT.x, CH1_PLANT.y),
        n.sqPose === "hidden" && !n.ch1InCrate && ga(CH1_PLANT.x, CH1_PLANT.y - 46),
        drawGameBin(250, 520));
      for (let i = 0; i < 3; i++) {
        let ang = n.T * 2 + i;
        C([130 + Math.cos(ang) * 16, 560, 130, 560], "rgba(120,170,220,.8)", 2);
      }
      (m(150, 548, 36, 14, 3), r("#8a93a3", 3));
      (C([700, 340, 700, 520], y, 5), C([700, 520, 760, 520], y, 5), drawMailRobot(830, 540));
      n.ch1Crew === "pickup" ? drawPickupLoad() : n.ch1Mail === "full" && (Xn(720, 400, 70, 48, ""), Xn(800, 420, 56, 40, ""));
      n.scene === "Q2" && Qt(700, 530, "#e8a87c", 1.6, -1),
      n.ch1Crew === "day" &&
        [
          ["Dot", 250, 580],
          ["Bob", 330, 565],
          ["Lou", 410, 580],
        ].forEach((w) => u5({ x: w[1], y: w[2], name: w[0] }));
      !night && n.ch1Ship && n.scene !== "Q9" && Qt(560, 500, "#c9b6f2", 2.6, 0.2);
      n.ch1Crew === "tease" && [360, 480, 600].forEach((px) => dq(px, 460, !1));
      night &&
        (seenCone(CH1_ROBOT.x, CH1_ROBOT.y - 28, STAND_FACE, STAND_CONE_HALF, STAND_CONE_LEN, "rgba(255,234,120,.38)"),
        dq(CH1_ROBOT.x, CH1_ROBOT.y, !1),
        n.ch1Alert && g("!", CH1_ROBOT.x, CH1_ROBOT.y - 78, 28, "#e5533d", "center", 900));
      (n.moPose !== "hidden" && Fe(n.mo.x, n.mo.y, he * 1.15, { f: n.mo.f || 1, walk: n.mo.moving ? n.mo.walk : 0, mop: !1 }),
        n.sqPose === "ball" && drawL2Ball(n.sq.x, n.sq.y - 16),
        n.sqPose !== "hidden" &&
          n.sqPose !== "ball" &&
          Re(n.sq.x, n.sq.y, he, {
            f: n.sq.f || 1,
            walk: n.sq.moving ? n.sq.walk : 0,
            jacket: !!n.costumeOn,
            goatBeard: !!n.costumeOn,
            horns: !!n.costumeOn,
          }));
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
