// Redesigned Chapter 1 (the Nov 8 cartoon): lunch, the delivery room, the night mailbox, the vent, the costume, and boarding.
    // Ball hiding (R43). A robot notices a balled-up Squatch only after it stays within one crate-width
    // for two seconds. These two constants are the whole rule, in every room and chapter. Standing and
    // walking still use each robot's existing sight.
    const BALL_NOTICE_RADIUS = 70,
      BALL_NOTICE_SECONDS = 2,
      CH1_BIN = { x: 212, y: 370 },
      CH1_MAIL = { x: 878, y: 450 },
      // The crawl vent is the grille under the speaker, on the right wall. The floor vent stays in the picture.
      CH1_VENT = { x: 820, y: 470 },
      CH1_ROBOT = { x: 480, y: 400 },
      CH1_PLANT = { x: 125, y: 400 };
    const CH1Q_CHIPS = {
      Q1: "",
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
    // The camera stands in the back-right corner, clear of the snack table. The shot is the floor in front of the lens.
    const CH1_CAM = { x: 260, y: 400, r: 110 };
    const CH1_FRAME = { x0: 210, x1: 290, y0: 420, y1: 470 };
    const CH1_KID = { x: 150, y: 520 };
    // Free-play moments. Add another object here for a new party beat.
    const CH1_PARTY_FREE = [
      { id: "snack", verb: "GRAB", cap: "snack", x: 860, y: 430, who: "sq", text: "One snack. That's the rule." },
      { id: "guest", verb: "TALK", cap: "guest", x: 480, y: 540, who: "tourist", text: "Love the shirt." },
      { id: "line", verb: "LISTEN", cap: "snack line", x: 800, y: 500, who: "tourist", text: "I swear we had more Moon Pies... is that what they stole at lunch?" },
    ];
    const CH1_PARTY_SNAG = [
      { id: "plant", verb: "SNAG", cap: "plant", x: 400, y: 540, why: "plant" },
      { id: "vent", verb: "SUCK", cap: "vent", x: 188, y: 500, why: "vent" },
      { id: "guard", verb: "STAND", cap: "guard", x: 700, y: 560, why: "guard" },
    ];
    // Rule: no yellow ring and no "VERB · thing" tag when the action happens right where Squatch stands.
    function actsWhereSquatchStands(o) {
      // A spot placed on Squatch's own feet follows him around, so a ring there would circle Squatch himself.
      return !!o && (!!o.hot || (Math.abs(o.x - n.sq.x) < 2 && Math.abs((o.y || 0) - n.sq.y) < 2));
    }
    function drawGoalMark(x, y) {
      // Remember the last ring drawn, so tests can check it is never around Squatch himself.
      n.lastRing = { x, y, T: n.T };
      let p = 0.75;
      (e.save(),
        (e.globalAlpha = p),
        (e.strokeStyle = "#ffcf33"),
        (e.lineWidth = 6),
        e.beginPath(),
        e.arc(x, y, 54, 0, 7),
        e.stroke(),
        e.restore());
    }
    function ch1MarkGoal() {
      if (n.ch1PadOn) return drawGoalMark(480, 250);
      if (!n.ctrl || (n.ch1Zoom && n.ch1Zoom.zoom < 1)) return;
      let spots =
        n.ch1Day2 && ch1Day2Spots
          ? ch1Day2Spots()
          : n.ch1Song
            ? ch1SongSpots()
            : n.ch1PeekReady
              ? ch1PeekSpots()
              : n.ch1PlantSneak
                ? ch1SneakSpots()
              : n.ch1Search
                ? ch1SearchSpots()
                : n.scene === "QA" && n.ch1Party && !n.ch1PartyOver
                  ? ch1PartySpots()
                  : [];
      let s = (spots || []).find((o) => o && o.verb && o.x);
      s && !actsWhereSquatchStands(s) && drawGoalMark(s.x, s.y);
    }
    function drawDoorNudge() {
      let p = 0.5 + 0.5 * Math.sin(n.T * 5);
      (e.save(), (e.globalAlpha = 0.35 + 0.5 * p), (e.fillStyle = "#ffcf33"), e.beginPath(), e.moveTo(860, 430), e.lineTo(900, 470), e.lineTo(860, 510), e.closePath(), e.fill(), e.restore());
    }
    function ch1QChip() {
      if (n.ch1MopsLeave || n.ch1Peeking) return "";
      if (n.ch1Dress && n.ch1Dress.on) return "";
      if (n.ch1Chip) return n.ch1Chip;
      return CH1Q_CHIPS[n.scene] || "";
    }
    // Adult head height is 85% of the door in the room he is standing in.
    // Hall and loading-bay openings measure 101px on the 830-tall picture (77.9px on the canvas).
    // The office door and the same door in the hallway are a 160px slab (123.4px on the canvas).
    // Home's right-wall opening is the 129px cut. A room with no door uses the hall.
    // Alien heads are that height / 84. Qt heads are that height / 50. Squatch is 80% of the adult, / 45.
    const CANVAS_DOOR_PX = {
        hall: 101 * (640 / 830),
        hallway: 160 * (640 / 830),
        office: 160 * (640 / 830),
        delivery: 101 * (640 / 830),
        home: 129 * (640 / 830),
      },
      HALL_ADULT_PX = CANVAS_DOOR_PX.hall * 0.85;
    function roomDoorId(room) {
      return room === "passage" ? "hallway" : room === "hangar" ? "delivery" : room === "closet" ? "home" : room === "office" ? "office" : room === "hall" ? "hall" : "hall";
    }
    function adultPxFor(room) {
      let id = CANVAS_DOOR_PX[room] ? room : roomDoorId(room);
      return (CANVAS_DOOR_PX[id] || CANVAS_DOOR_PX.hall) * 0.85;
    }
    function alienScale(room) {
      return adultPxFor(room) / 84;
    }
    function qtScale(room) {
      return adultPxFor(room) / 50;
    }
    const ADULT_PX = HALL_ADULT_PX,
      ALIEN_ADULT = ADULT_PX / 84,
      QT_ADULT = ADULT_PX / 50,
      SQ_ADULT = (ADULT_PX * 0.8) / 45;
    function sqDrawScale() {
      if (n.room === "closet" && (n.scene || "")[0] !== "Q") return wl;
      return (adultPxFor(n.room) * 0.8) / 45;
    }
    function moDrawScale() {
      if (n.room === "closet" && (n.scene || "")[0] !== "Q") return wl;
      return sqDrawScale() * 1.15;
    }
    // Back-wall door of office-room-empty-v2. The hallway's front door, seen from inside.
    // Feet stand just through that door, on the floor below the picture's floor line (source y 330).
    const CH1_OFFICE_DOOR = { x: 480, y: 286 };
    const CH1_GUESTS = [
      [250, 460, "antenna"],
      [400, 440, "croc"],
      [740, 470, "hat"],
      [200, 610, "hair"],
      [520, 610, "spots"],
      [660, 600, "blob"],
    ];
    // Party hall solids (Brian, 2026-11-15: "Make the party hall solid so Squatch can't walk through walls, the stage, or guests").
    // Boxes are where feet cannot go, in picture units, measured on hall-room-empty-v1.png and the party drawing.
    // The floor starts in front of the stage (CH1_PARTY_FLOOR_Y), so nobody walks on the window or up the back wall.
    const CH1_PARTY_FLOOR_Y = 300;
    const CH1_PARTY_FIXED = [
      { x0: 240, x1: 490, y0: 0, y1: 304 }, // stage
      { x0: 490, x1: 582, y0: 0, y1: 300 }, // COMING SOON! poster and its legs
      { x0: 798, x1: 960, y0: 0, y1: 528 }, // snack bar, the bartender behind it, and the wall past it
      { x0: 772, x1: 800, y0: 316, y1: 336 }, // stool
      { x0: 772, x1: 800, y0: 398, y1: 418 }, // stool
      { x0: 72, x1: 136, y0: 330, y1: 372 }, // plant by the back wall
      { x0: 412, x1: 476, y0: 520, y1: 552 }, // the hiding plant's pot
      { x0: 496, x1: 574, y0: 494, y1: 530 }, // snack table
      { x0: 228, x1: 274, y0: 340, y1: 368 }, // camera tripod
    ];
    function ch1PartySolids() {
      let feet = (x, y) => ({ x0: x - 18, x1: x + 18, y0: y - 10, y1: y + 6, person: 1 }), // people block walking, not sight
        out = CH1_PARTY_FIXED.slice(),
        raid = n.ch1Raid;
      CH1_GUESTS.forEach((guest) => (raid && raid.witness && guest[2] === "spots") || out.push(feet(guest[0], guest[1])));
      raid && raid.witness && out.push(feet(raid.witness.x, raid.witness.y));
      out.push(feet(340, 400)); // the guest in the cape
      out.push(feet(CH1_KID.x, CH1_KID.y)); // the balloon kid
      out.push(feet((n.ch1Oct && n.ch1Oct.x) || 760, (n.ch1Oct && n.ch1Oct.y) || 555)); // the octopus
      return out;
    }
    const LOCKED_ROOMS = {
      hall: "docs/locked-rooms/hall-room-empty-v1.png",
      hallway: "docs/locked-rooms/hallway-room-empty-v6.png",
      "delivery-day": "docs/locked-rooms/delivery-room-empty-day-v2.png",
      "delivery-night": "docs/locked-rooms/delivery-room-empty-night-v2.png",
      "delivery-noship": "docs/locked-rooms/delivery-room-empty-day-noship-v2.png",
      "delivery-pickup": "docs/locked-rooms/delivery-room-empty-pickup-v3.png",
      "home-closed": "docs/locked-rooms/home-room-empty-closed-v5.png",
      "home-open": "docs/locked-rooms/home-room-empty-open-v5.png",
      office: "docs/locked-rooms/office-room-empty-v2.png",
    };
    let lockedImg = {},
      lockedWait = [];
    function loadLockedRooms() {
      for (let id in LOCKED_ROOMS) {
        let img = new Image();
        lockedWait.push(new Promise((res) => ((img.onload = () => res()), (img.onerror = () => res()))));
        img.src = LOCKED_ROOMS[id];
        lockedImg[id] = img;
      }
    }
    loadLockedRooms();
    function drawLockedRoom(id) {
      let img = lockedImg[id];
      img && img.complete && img.naturalWidth ? e.drawImage(img, 0, 0, c, b) : ((e.fillStyle = "#e2e5ed"), e.fillRect(0, 0, c, b));
    }
    function ch1DeliveryArt() {
      return n.ch1Night ? "delivery-night" : n.ch1Crew === "pickup" ? "delivery-pickup" : n.ch1Ship ? "delivery-day" : "delivery-noship";
    }
    // Standing sight is the hall robot's existing cone and feet circle. These are not the ball constants.
    const STAND_CONE_LEN = 210,
      STAND_CONE_HALF = 0.42,
      STAND_FEET = 70,
      STAND_FACE = Math.PI / 2;
    // R64. Same night robot as the bug-fix branch: down 2s, turn 0.3s with no catch, back wall 4s, turn back.
    const CH1_LOOK_DOWN_SECONDS = 2,
      CH1_TURN_SECONDS = 0.3,
      CH1_LOOK_AWAY_SECONDS = 4,
      CH1_LOOK_AWAY = -Math.PI / 2;
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
    function ch1NightLook(t) {
      let down = CH1_LOOK_DOWN_SECONDS,
        turn = CH1_TURN_SECONDS,
        away = CH1_LOOK_AWAY_SECONDS,
        cycle = down + turn + away + turn,
        u = ((t || 0) % cycle + cycle) % cycle,
        swing = (a, b, k) => a + (b - a) * k;
      if (u < down) return { face: STAND_FACE, catch: !0 };
      u -= down;
      if (u < turn) return { face: swing(STAND_FACE, CH1_LOOK_AWAY, u / turn), catch: !1 };
      u -= turn;
      if (u < away) return { face: CH1_LOOK_AWAY, catch: !0 };
      u -= away;
      return { face: swing(CH1_LOOK_AWAY, STAND_FACE, u / turn), catch: !1 };
    }
    function ch1NightNow() {
      return n.scene === "Q4" ? ch1NightLook(n.ch1LookT || 0) : { face: STAND_FACE, catch: !0 };
    }
    function ch1InCone(px, py) {
      let look = ch1NightNow();
      if (!look.catch) return !1;
      let ox = CH1_ROBOT.x,
        oy = CH1_ROBOT.y - 28;
      return Math.hypot(px - CH1_ROBOT.x, py - CH1_ROBOT.y) < STAND_FEET || vt(px, py - 20, ox, oy, look.face, STAND_CONE_HALF, STAND_CONE_LEN);
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
    function ch1Move(dt, x, y, speed, who, moAt) {
      let sqOk = who === "mo" ? !0 : mV(n.sq, x, y, speed, dt),
        moX = moAt ? moAt[0] : x + (who === "mo" ? 0 : 48),
        moY = moAt ? moAt[1] : y,
        moOk = who === "sq" ? !0 : mV(n.mo, moX, moY, speed, dt);
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
            spec.mo && spec.who === "sq" && ((n.mo.x = spec.mo[0]), (n.mo.y = spec.mo[1]), (n.moPose = "stand")),
            n.ch1Walks.push({ phase: "in", room: n.room, x: Math.round(n.sq.x), y: Math.round(n.sq.y) }));
        }),
        cV((dt) => ch1Move(dt, spec.stand[0], spec.stand[1], 260, spec.who, spec.who !== "sq" && spec.mo ? spec.mo : null)),
        N(next),
      ]);
    }
    function ch1Hop(spec, next) {
      ch1Walk(spec, next);
    }
    // Home is below the hall. The delivery room is to the right of the hallway (R51).
    // Each door is a point on the 960×640 picture, measured from the locked rooms.
    // Home's right-wall cut, the hall's bottom cut, and the side cuts shared by the
    // hall, the hallway, and the loading bay. Nobody is placed already inside the next room.
    function ch1Go(dest, flags, next) {
      let f = flags || {},
        who = f.who || "both",
        from = n.ch1Duct ? "duct" : n.ch1D ? "delivery" : n.room === "passage" ? "passage" : n.room === "hall" ? "hall" : "closet",
        homeDoor = [880, 458],
        hallHomeDoor = [476, 610],
        hallSideDoor = [870, 348],
        sideDoor = [90, 348],
        homeHall = (at) => ({
          who,
          exit: [820, 470],
          off: homeDoor,
          to: "hall",
          entry: hallHomeDoor,
          stand: at || [480, 500],
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
          exit: [800, 400],
          off: hallSideDoor,
          to: "hangar",
          entry: sideDoor,
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
          exit: [160, 400],
          off: sideDoor,
          to: "hall",
          entry: hallSideDoor,
          stand: at || [700, 500],
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
          exit: [476, 560],
          off: hallHomeDoor,
          to: "closet",
          entry: homeDoor,
          stand: at || [760, 520],
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
          exit: [820, 470],
          off: [920, 470],
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
      // The hallway (R51) sits between the party hall and the loading bay. Day 2 walks use it.
      let pass = {
          who,
          scene: f.scene,
          delivery: !1,
          duct: !1,
          night: !!f.night,
          ship: !!f.ship,
          crew: f.crew || "",
          mail: f.mail || "",
          mo: f.mo,
        },
        hallPass = () =>
          Object.assign({}, pass, { exit: [800, 400], off: hallSideDoor, to: "passage", entry: sideDoor, stand: f.stand || [180, 420], ship: !1, crew: "", mail: "" }),
        passHall = () =>
          Object.assign({}, pass, { exit: [160, 400], off: sideDoor, to: "hall", entry: hallSideDoor, stand: f.stand || [700, 520], ship: !1, crew: "", mail: "" }),
        passDel = () => Object.assign({}, pass, { exit: [800, 400], off: hallSideDoor, to: "hangar", entry: sideDoor, stand: f.stand || [200, 520], delivery: !0 }),
        delPass = () =>
          Object.assign({}, pass, {
            exit: [160, 400],
            off: sideDoor,
            to: "passage",
            entry: hallSideDoor,
            stand: f.stand || [720, 420],
            delivery: !1,
            ship: !1,
            crew: "",
            mail: "",
          });
      if (from === "hall" && dest === "passage") return ch1Hop(hallPass(), next);
      if (from === "passage" && dest === "hall") return ch1Hop(passHall(), next);
      if (from === "passage" && dest === "delivery") return ch1Hop(passDel(), next);
      if (from === "delivery" && dest === "passage") return ch1Hop(delPass(), next);
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
            ((n.ch1Prop = "delicious"), D.slurp());
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
          cV((dt) => (ch1Trail(), mV(n.sq, 205, 470, 180, dt) && mV(n.mo, 380, 460, 180, dt))),
          N(() => {
            ((n.sqPose = "sleep"), (n.sq.x = 205), (n.sq.y = 470), (n.mo.x = 380), (n.mo.y = 460));
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
        (n.sq.x = 400),
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
              ((n.ctrl = !1), (n.act = null), (n.ch1Veil = 0), (n.ch1VeilTo = 1));
              J([
                cV(() => (n.ch1Veil || 0) >= 1),
                N(() => {
                  ((n.ch1Disguise = !0), (n.ch1VeilTo = 0));
                }),
                cV(() => (n.ch1Veil || 0) <= 0),
                N(() => {
                  n.ctrl = !0;
                }),
              ]);
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
            x: 860,
            y: 430,
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
            x: 760,
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
              ((n.sqPose = "hidden"), (n.sq.x = 400), (n.sq.y = 530));
            },
          }),
        );
      ch1ExtraPartySpots().forEach((s) => out.push(s));
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
        N(() => ch1RaidBegin()),
      );
      J(lines);
    }
    function ch1PartyHome() {
      // Day 1 ends here for now. Beats 19-21 can take over this function and call ch1Day2Begin after bedtime.
      ((n.moPose = "stand"),
        (n.mo.x = 455),
        (n.mo.y = 560),
        (n.ch1Party = !1),
        J([
          v("mops", "A flyer. And fur on the floor."),
          N(() => ch1Day2Begin()),
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
        !n.ch1Mini &&
        ((n.ch1PartyT = (n.ch1PartyT || 0) + (dt || 0)), n.ch1PartyT >= COOL_HAT_SECONDS && ch1HatOff("cool"));
    }
    function ch1BalloonTick(dt) {
      n.room === "hall" && n.ch1Office && ch1BalloonPopNow();
      n.ch1BalloonPop > 0 && (n.ch1BalloonPop = Math.max(0, n.ch1BalloonPop - (dt || 0)));
    }
    function ch1NightPlay() {
      ((n.scene = "Q4"), (n.ctrl = !0), (n.sqPose = "stand"), (n.ch1LookT = 0), chipNow());
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
      if (n.ch1Song && n.ctrl && !n.ch1Party) return [...ch1CalendarSpots(), ...ch1SongSpots()];
      if (n.ch1Search && n.ctrl && n.room === "closet") return ch1SearchSpots();
      if (n.ch1Cut) return ch1CutSpots();
      if (n.ch1Dress && n.ch1Dress.on) return ch1DressSpots();
      if (n.ch1PeekReady && n.ctrl) return [...ch1CalendarSpots(), ...ch1PeekSpots()];
      if (n.ch1PlantSneak) return n.ctrl ? ch1SneakSpots() : [];
      if (n.scene === "QA") return n.ch1Raid && n.room === "hall" ? ch1RaidSpots() : n.ctrl && !n.ch1PartyOver ? ch1PartySpots() : [];
      if (n.ch1Day2) return ch1Day2Spots();
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
      if (!n.ctrl || n.scene !== "Q4" || x.mops || n.ch1Zoom) return;
      n.ch1LookT = (n.ch1LookT || 0) + (dt || 0);
      if (!ch1NightNow().catch) {
        ballNotice("ch1night", BALL_NOTICE_RADIUS + 1, 0, !1);
        n.ch1Alert = !1;
        return;
      }
      let standing = ch1InCone(n.sq.x, n.sq.y),
        dist = Math.hypot(n.sq.x - CH1_ROBOT.x, n.sq.y - CH1_ROBOT.y),
        seen = n.sqPose === "hidden" ? !1 : n.sqPose === "ball" ? ballNotice("ch1night", dist, dt || 0, standing) : standing;
      n.sqPose !== "ball" && ballNotice("ch1night", BALL_NOTICE_RADIUS + 1, 0, !1);
      n.ch1Alert = !!seen;
      seen && ch1CallSecurity("delivery");
    }
    function ch1QTick(dt) {
      (n.scene || "")[0] === "Q" &&
        (n.ctrl && !n.ch1Mini && (n.act = pick(ch1QSpots())),
        ch1Watch(dt),
        ch1PartyTick(dt),
        ch1BalloonTick(dt),
        ch1SliceTick(dt),
        ch1Day1Tick(dt),
        ch1Day2Tick(dt),
        n.scene !== "QA" && qSec(dt || 0));
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
        (n.ch1LookT = 0),
        ch1LoadBalloon(),
        n.ch1Day2 && ch1NightReset());
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
    function drawCh1PartyRoom() {
      drawLockedRoom("hall");
      if (n.roomOnly) return;
      drawCh1Party();
      n.sqPose !== "hidden" &&
        n.sqPose !== "ball" &&
        Re(n.sq.x, n.sq.y, sqDrawScale(), {
          f: n.sq.f || 1,
          walk: n.sq.moving ? n.sq.walk : 0,
          leap: (n.ch1JumpT || 0) > 0,
          hat: !!n.ch1Disguise,
          hatAskew: !!n.ch1HatAskew,
          shades: !!n.ch1Disguise,
          hawaiian: !!n.ch1Disguise,
          paper: !!n.ch1Flyer,
        });
      n.moPose !== "hidden" && n.mo.x > -50 && n.mo.x < 1100 && Fe(n.mo.x, n.mo.y, moDrawScale(), { f: n.mo.f || 1, walk: n.mo.moving ? n.mo.walk : 0, mop: !1 });
    }
    function drawCh1DayHall() {
      drawLockedRoom("hall");
      if (n.roomOnly) return;
      drawCh1BalloonLeft();
      n.scene === "Q3" && !(n.ch1Step === "family" || n.ch1Step === "gohome") && drawCh1Alien(640, 500, "hat", ALIEN_ADULT, 1);
      n.moPose !== "hidden" && n.mo.x > -50 && n.mo.x < 1100 && Fe(n.mo.x, n.mo.y, moDrawScale(), { f: n.mo.f || 1, walk: n.mo.moving ? n.mo.walk : 0, mop: !1 });
      n.sqPose === "ball" && drawL2Ball(n.sq.x, n.sq.y - 16);
      n.sqPose !== "hidden" &&
        n.sqPose !== "ball" &&
        Re(n.sq.x, n.sq.y, sqDrawScale(), {
          f: n.sq.f || 1,
          walk: n.sq.moving ? n.sq.walk : 0,
          jacket: !!n.costumeOn,
          goatBeard: !!n.costumeOn,
          horns: !!n.costumeOn,
        });
    }
    function drawCh1HallwayRoom() {
      drawLockedRoom("hallway");
      if (n.roomOnly) return;
      (Qt(480, 530, "#c9b6f2", qtScale("hallway"), 0.3),
        dq(640, 530, !1),
        drawCh1BalloonLeft(),
        n.sqPose !== "hidden" &&
          n.sqPose !== "ball" &&
          n.sq.x > -40 &&
          n.sq.x < 1000 &&
          Re(n.sq.x, n.sq.y, sqDrawScale(), { f: n.sq.f || 1, walk: n.sq.moving ? n.sq.walk : 0 }));
    }
    // The desk, monitors, signs and door are the locked picture. Nothing here redraws them.
    function drawCh1OfficeRoom() {
      drawLockedRoom("office");
      if (n.roomOnly) return;
      n.sqPose !== "hidden" &&
        n.sqPose !== "ball" &&
        n.sq.x > -40 &&
        Re(n.sq.x, n.sq.y, sqDrawScale(), { f: n.sq.f || 1, walk: n.sq.moving ? n.sq.walk : 0, jacket: !!n.costumeOn });
      n.ch1Office &&
        (drawCh1Alien(430, 500, "horns", alienScale("office"), -1),
        // 47 is this robot picture's head top, in its own units, so the head matches the office adult.
        dq(280, 500, !1, adultPxFor("office") / 47),
        n.ch1Tape &&
          (m(154, 122, 72, 36, 6),
          r("#7a1210", 3),
          g("REC", 190, 140, 17, "#ffffff", "center", 900),
          Re(190, 210, ((adultPxFor("office") * 0.8) / 45) * 0.35, { f: 1, jacket: !0, goatBeard: !0, horns: !0 })));
    }
    function drawCh1Party() {
      let look = (n.ch1Look || 0) > 0,
        face = look ? 1 : 0,
        eye = 72 * ALIEN_ADULT,
        glance = (x, y) => look && (F(x + 8, y - eye, 2.2, "#fffdf8"), F(x - 5, y - eye, 2.2, "#fffdf8"));
      // Stage (walkthrough beats 3 and 5, CHAPTER-1-PROBLEMS stage item): the banner hangs above the stage, Isfred stands on it,
      // and the approved "COMING SOON!" robot poster (Brian yes, 2026-11-15) stands beside it.
      (m(248, 116, 400, 36, 8),
        r("#3478f6", 3),
        g("ROBOTICS DELEGATION!", 448, 134, 17, "#ffffff", "center", 900),
        C([258, 116, 258, 96], "#1e2430", 2),
        C([638, 116, 638, 96], "#1e2430", 2),
        C([500, 266, 500, 290], "#1e2430", 3),
        C([570, 266, 570, 290], "#1e2430", 3),
        m(455, 186, 160, 80, 4),
        r("#fffaf0", 2),
        dq(535, 222, !1, 0.55),
        g("COMING SOON!", 535, 250, 17, "#e5533d", "center", 900),
        drawCh1Alien(360, 256, "horns", ALIEN_ADULT, face || 1),
        glance(360, 256),
        n.sqPose === "hidden" && ga(400, 500),
        !(n.ch1PartyDid && n.ch1PartyDid.snack) &&
          [
            [848, 340, "pie"],
            [848, 390, "cup"],
            [848, 440, "cake"],
          ].forEach((bit) => drawBarSnack(bit[2], bit[0], bit[1], 0.45)),
        drawCh1SneakCone(),
        CH1_GUESTS.forEach((guest) => {
          if (n.ch1Raid && n.ch1Raid.witness && guest[2] === "spots") return;
          (drawCh1Alien(guest[0], guest[1], guest[2], ALIEN_ADULT, n.ch1PlantSneak && guest[2] === "spots" ? ch1SneakFace() : face || 1), glance(guest[0], guest[1]));
        }),
        n.ch1Raid && n.ch1Raid.witness && drawCh1Alien(n.ch1Raid.witness.x, n.ch1Raid.witness.y, "spots", ALIEN_ADULT, 1),
        ((n.ch1Raid && n.ch1Raid.guards) || []).forEach((g) => {
          g.face != null &&
            seenCone(g.x, g.y - 28, g.face, STAND_CONE_HALF, STAND_CONE_LEN, "rgba(255,234,120,.62)", "rgba(160,100,10,.95)");
          drawCh1Alien(g.x, g.y, "hat", ALIEN_ADULT, Math.cos(g.face || 0) < 0 ? -1 : 1);
        }),
        Qt(880, 500, "#c9842a", QT_ADULT, -1),
        drawOctopus((n.ch1Oct && n.ch1Oct.x) || 760, (n.ch1Oct && n.ch1Oct.y) || 555, face || -1),
        drawCh1Fest(),
        drawCh1Alien(340, 400, "cape", ALIEN_ADULT, face || -1),
        drawCh1Tripod(250, 360),
        !n.ch1Flyer && (m(500, 500, 16, 12, 1), r("#fffdf8", 1)),
        (n.ch1Spill || 0) > 0 && drawCh1Chain(1 - n.ch1Spill),
        drawBalloonKid(),
        drawCh1SneakMark());
    }
    function drawCh1Chain(p) {
      let tip = Math.min(1, p / 0.25),
        roll = p < 0.25 ? 0 : Math.min(1, (p - 0.25) / 0.25),
        tray = p < 0.5 ? 0 : Math.min(1, (p - 0.5) / 0.25),
        cake = p < 0.75 ? 0 : Math.min(1, (p - 0.75) / 0.25);
      (e.save(), e.translate(760, 470), e.rotate(tip * 0.7));
      ["pie", "cup", "cake"].forEach((k, i) => drawBarSnack(k, (i - 1) * 36, -28 - (1 - tip) * 16, 1));
      e.restore();
      roll > 0 && (e.save(), e.translate(800 + roll * 120, 520), e.rotate(roll * 6), drawBarSnack("cup", 0, 0, 1.15), e.restore());
      tray > 0 && (e.save(), e.translate(900, 500), e.rotate(-tray * 0.9), m(-46, -8, 92, 16, 3), r("#cdbb98", 3), drawBarSnack("pie", 0, -22, 0.7), e.restore());
      cake > 0 && (e.save(), e.translate(860 + cake * 30, 480 + cake * 50), drawBarSnack("cake", 0, 0, 1.2), e.restore());
    }
    function drawCh1Alien(ax, ay, kind, sc, face) {
      let f = face < 0 ? -1 : 1,
        bob = Math.sin(n.T * 2 + ax * 0.01) * 1.5;
      (e.save(), e.translate(ax, ay + bob), e.scale(sc * f, sc));
      (e.beginPath(), e.ellipse(0, 2, 16, 4, 0, 0, 7), (e.fillStyle = "rgba(30,36,48,.16)"), e.fill());
      let body = "#7ad0c8",
        skin = "#d8fff6";
      kind === "croc" && ((body = "#3f8f4a"), (skin = "#b6e7a8"));
      kind === "hat" && ((body = "#ff8a3d"), (skin = "#f0bf93"));
      kind === "hair" && ((body = "#3478f6"), (skin = "#f2c1b0"));
      kind === "spots" && ((body = "#ffcf33"), (skin = "#fff3c4"));
      kind === "horns" && ((body = "#c9b6f2"), (skin = "#efe8ff"));
      kind === "blob" && ((body = "#59657d"), (skin = "#d5dbe6"));
      kind === "cape" && ((body = "#1f9d8a"), (skin = "#d8fff6"));
      (m(-6, -20, 7, 20, 2),
        r("#3d4454", 2),
        m(2, -20, 7, 20, 2),
        r("#3d4454", 2),
        m(-16, -54, 32, 36, 10),
        r(body, 3),
        m(-22, -48, 8, 22, 3),
        r(body, 2),
        m(14, -48, 8, 22, 2),
        r(body, 2),
        L(0, -70, 14),
        r(skin, 3),
        F(-5, -72, 1.8, y),
        F(5, -72, 1.8, y),
        C([-3, -64, 0, -62, 3, -64], y, 1.2));
      if (kind === "antenna") (C([-5, -82, -10, -98], y, 2.2), C([5, -82, 10, -98], y, 2.2), F(-10, -100, 3.2, "#ffcf33"), F(10, -100, 3.2, "#ffcf33"));
      else if (kind === "croc")
        (e.beginPath(),
          e.moveTo(8, -76),
          e.lineTo(30, -72),
          e.lineTo(30, -62),
          e.lineTo(8, -66),
          e.closePath(),
          r("#2f7a3a", 2),
          F(24, -70, 1.3, y),
          F(24, -65, 1.3, y),
          C([14, -66, 20, -64, 26, -67], "#1e2430", 1.2));
      else if (kind === "hat") (m(-14, -78, 28, 6, 2), r("#2b3a67", 2), m(-7, -92, 14, 16, 2), r("#2b3a67", 2));
      else if (kind === "hair") (e.beginPath(), e.arc(0, -70, 14, Math.PI, 0), r("#7a4ad0", 3));
      else if (kind === "spots") (F(-6, -48, 3, "#e5533d"), F(6, -40, 2.4, "#e5533d"), F(0, -56, 2, "#e5533d"));
      else if (kind === "horns") (C([-4, -78, -12, -94], y, 3), C([4, -78, 12, -94], y, 3));
      else if (kind === "blob") (F(-6, -70, 2, y), F(0, -70, 2, y), F(6, -70, 2, y), L(0, -40, 8), r("#8a93a3", 2));
      else (m(-18, -46, 8, 18, 3), r("#e5533d", 2));
      e.restore();
    }
    function drawCh1Tripod(x, y) {
      (C([x, y - 46, x - 26, y], "#6b6256", 4),
        C([x, y - 46, x + 24, y], "#6b6256", 4),
        C([x, y - 46, x + 2, y + 10], "#6b6256", 4),
        m(x - 18, y - 64, 36, 18, 4),
        r("#1e2430", 3),
        L(x - 20, y - 55, 7),
        r("#8fdcff", 2));
    }
    function drawOctopus(x, oy, f) {
      (e.save(),
        e.translate(x, oy),
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
        by = n.ch1BalloonY || 460,
        hallX = 360;
      if ((n.ch1Balloon === "up" || n.ch1Balloon === "ceiling") && by < 430) bx = Math.max(bx, hallX);
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
        let handX = kid.x + 16,
          handY = kid.y - 78;
        by < 430
          ? (C([handX, handY, handX, 188], "#e5533d", 2), C([handX, 188, bx, 188], "#e5533d", 2), C([bx, 188, bx, by + 18], "#e5533d", 2))
          : C([handX, handY, bx, by + 18], "#e5533d", 2);
        drawPartyBalloon(bx, by, n.ch1Balloon === "up" ? 22 : 16);
      }
      if (n.ch1Balloon === "held") (C([n.sq.x, n.sq.y - 36, n.sq.x + 8, n.sq.y - 78], "#e5533d", 2), drawPartyBalloon(n.sq.x + 8, n.sq.y - 96, 16));
      if (n.ch1Balloon === "back") (C([kid.x + 10, kid.y - 70, kid.x + 18, kid.y - 108], "#e5533d", 2), drawPartyBalloon(kid.x + 18, kid.y - 124, 16));
    }
    function drawPartyBalloon(x, y, rad) {
      (e.save(),
        e.translate(x, y),
        L(0, 0, rad),
        r("#e5533d", 3),
        e.beginPath(),
        e.ellipse(-rad * 0.28, -rad * 0.32, rad * 0.28, rad * 0.18, -0.6, 0, 7),
        (e.fillStyle = "rgba(255,255,255,.75)"),
        e.fill(),
        e.beginPath(),
        e.moveTo(-4, rad - 1),
        e.lineTo(0, rad + 8),
        e.lineTo(4, rad - 1),
        e.closePath(),
        r("#b91c1c", 2),
        e.restore());
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
      tied ? (Xp(130, 580), C([148, 552, x, y + 18], "#e5533d", 1.4)) : C([x, 160, x, y + 18], "#e5533d", 1.4);
      drawPartyBalloon(x, y, 14);
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
      drawLockedRoom(ch1DeliveryArt());
      n.ch1Prop === "delicious" && (drawPinkSlip(760, 160), C([730, 250, 860, 170], "#9aa3b2", 2));
      n.ch1Prop === "gumble" && drawPinkSlip(n.mo.x - 8, n.mo.y - 78);
      n.ch1Prop === "bin" && drawPinkSlip(250, 470);
      n.ch1Prop === "teeth" && drawPinkSlip(n.mo.x - 6, n.mo.y - 72);
      n.ch1Prop === "paw" && drawPinkSlip(n.sq.x + 8, n.sq.y - 48);
      n.ch1Step === "hide" &&
        n.sqPose !== "hidden" &&
        (e.save(),
        (e.globalAlpha = 0.35 + 0.4 * Math.sin(n.T * 5)),
        e.beginPath(),
        e.arc(CH1_PLANT.x, CH1_PLANT.y, 54, 0, 7),
        (e.strokeStyle = "#ffcf33"),
        (e.lineWidth = 6),
        e.stroke(),
        e.restore());
      n.sqPose === "hidden" && !n.ch1InCrate && ga(n.ch1Step === "hide" || Math.hypot(n.sq.x - CH1_PLANT.x, n.sq.y - CH1_PLANT.y) < 90 ? CH1_PLANT.x : n.sq.x, (n.ch1Step === "hide" || Math.hypot(n.sq.x - CH1_PLANT.x, n.sq.y - CH1_PLANT.y) < 90 ? CH1_PLANT.y : n.sq.y) - 46);
      n.ch1InCrate && ga(830, 510);
      n.scene === "Q2" && Qt(700, 530, "#e8a87c", qtScale("hangar"), -1),
      (n.ch1Crew === "day" || n.ch1Crew === "leave") &&
        [
          ["Dot", 250, 580],
          ["Bob", 330, 565],
          ["Lou", 410, 580],
        ].forEach((w) => u5({ x: w[1] - (n.ch1Crew === "leave" ? (n.ch1Leave || 0) * 520 : 0), y: w[2], name: w[0] }));
      !night && n.ch1Ship && n.scene !== "Q9" && n.ch1BossX !== -1 && Qt(n.ch1BossX == null ? 560 : n.ch1BossX, 500, "#c9b6f2", qtScale("hangar"), 0.2);
      n.ch1Crew === "tease" && [360, 480, 600].forEach((px) => dq(px, 460, !1));
      night &&
        (seenCone(CH1_ROBOT.x, CH1_ROBOT.y - 28, ch1NightNow().face, STAND_CONE_HALF, STAND_CONE_LEN, "rgba(255,234,120,.62)", "rgba(160,100,10,.95)"),
        ch1NightNow().catch &&
          (e.beginPath(),
          e.arc(CH1_ROBOT.x, CH1_ROBOT.y, STAND_FEET, 0, Math.PI * 2),
          (e.lineWidth = 3),
          (e.strokeStyle = "rgba(160,100,10,.95)"),
          e.stroke()),
        dq(CH1_ROBOT.x, CH1_ROBOT.y, !1),
        n.ch1Alert && g("!", CH1_ROBOT.x, CH1_ROBOT.y - 78, 28, "#e5533d", "center", 900));
      (n.moPose !== "hidden" && Fe(n.mo.x, n.mo.y, moDrawScale(), { f: n.mo.f || 1, walk: n.mo.moving ? n.mo.walk : 0, mop: !1 }),
        n.sqPose === "ball" && drawL2Ball(n.sq.x, n.sq.y - 16),
        n.sqPose !== "hidden" &&
          n.sqPose !== "ball" &&
          (e.save(),
          n.ch1Crouch && (e.translate(n.sq.x, n.sq.y), e.scale(1, 0.72), e.translate(-n.sq.x, -n.sq.y)),
          Re(n.sq.x, n.sq.y, sqDrawScale(), {
            f: n.sq.f || 1,
            walk: n.sq.moving ? n.sq.walk : 0,
            jacket: !!n.costumeOn,
            goatBeard: !!n.costumeOn,
            horns: !!n.costumeOn,
            eyes: n.ch1Wide ? "wide" : void 0,
          }),
          e.restore()));
    }
    function drawCh1Duct() {
      ((e.fillStyle = "#f3efe6"), e.fillRect(0, 0, c, b), m(28, 18, 904, 604, 18), r("#f7f4ee", 7));
      ((e.fillStyle = "#f4f1ea"), e.fillRect(40, 28, 880, 250), (e.fillStyle = "#ebe4d6"), e.fillRect(40, 278, 880, 328), C([40, 278, 900, 278], "#c8c2b6", 4));
      (m(70, 160, 130, 200, 8), r("#1e2430", 4));
      for (let i = 0; i < 7; i++) C([84, 178 + i * 24, 186, 178 + i * 24], "#9aa3b2", 3);
      n.sqPose === "hidden" && ga(135, 250);
      (g("IDEAS FOR GUARDIANS", 360, 150, 16, "#1e2430", "center", 900), m(250, 175, 230, 90, 6), r("#fffdf8", 3));
      (g("We know you're thinking about going to Mars.", 365, 205, 11, "#1e2430", "center", 700), g("Don't worry, we'll always be with you.", 365, 230, 11, "#1e2430", "center", 700));
      (m(560, 120, 340, 200, 8), r("#fffdf8", 4), g("MARS LOST & FOUND", 680, 155, 16, "#1e2430", "center", 900));
      (g("Re: a lost baby Sasquatch.", 680, 185, 12, "#1e2430", "center", 700),
        g("We have NO record of any lost baby.", 680, 210, 12, "#1e2430", "center", 700),
        g("There are NO Sasquatches on Mars.", 680, 235, 12, "#1e2430", "center", 700));
      (e.save(), e.translate(820, 275), e.rotate(-0.4), g("NO", 0, 0, 36, "#e5533d", "center", 900), e.restore());
      (m(620, 400, 200, 16, 3), r("#c4a574", 3), m(632, 416, 14, 48, 2), r("#8a7560", 2), m(794, 416, 14, 48, 2), r("#8a7560", 2), m(650, 422, 60, 22, 2), r("#a08050", 2));
      (n.ch1Prop === "desk" || n.ch1Prop === "teeth") && drawPinkSlip(660, 372);
      n.ch1Prop === "teeth" && n.moPose !== "hidden" && drawPinkSlip(n.mo.x - 6, n.mo.y - 70);
      n.moPose !== "hidden" && Fe(420, 520, moDrawScale(), { f: 1, walk: 0, mop: !1 });
    }
