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
      QA: "",
    };
    // Rule: no yellow ring and no "VERB · thing" tag when the action happens right where Squatch stands.
    function actsWhereSquatchStands(o) {
      // A spot placed on Squatch's own feet follows him around, so a ring there would circle Squatch himself.
      return !!o && (!!o.hot || (Math.abs(o.x - n.sq.x) < 2 && Math.abs((o.y || 0) - n.sq.y) < 2));
    }
    // The goal mark is a soft yellow outline round the real thing (src/modules/goal-targets.js), never a
    // circle or an arrow (Brian, raised at least six times). Remember the last one drawn, so tests can check
    // it is never round Squatch himself; it is returned (the lunch sneak reads it).
    function drawGoalMark(spot) {
      // Never over the people standing there: the outline is left out of their boxes.
      let people = [n.sqPose !== "hidden" ? sqBox() : null, n.moPose && n.moPose !== "hidden" && n.mo.x > -100 ? moBox() : null];
      let box = window.SSQ && window.SSQ.drawGoalOutline ? window.SSQ.drawGoalOutline(e, n.room, spot.id, lockedImg[lockedNow], n.T, people) : null;
      return box && (n.lastRing = { x: (box.x0 + box.x1) / 2, y: (box.y0 + box.y1) / 2, T: n.T, box, id: spot.id, act: spot.verb + " · " + spot.cap });
    }
    function ch1MarkGoal() {
      if (!n.ctrl || n.ch1Zoom || n.sqPose === "hidden") return;
      // The party night draws its own outline (src/modules/party.js).
      if (partyBeat() && partyBeat().active()) return;
      let spots =
        n.ch1Day2 && ch1Day2Spots
          ? ch1Day2Spots()
          : ch1MorningSpots()
            ? ch1MorningSpots()
            : [];
      let s = (spots || []).find((o) => o && o.verb && o.when !== !1);
      s && drawGoalMark(s);
    }
    // The morning module's spots (SING ALONG, TALK · Mops) while its song step has control, and home alone's
    // (DO · homework first, the goal; then OPEN · closet, FLOP · bed) with the calendar after them; else null.
    function ch1MorningSpots() {
      let beat = window.SSQ && window.SSQ.beat("ch1-morning"),
        s = beat && n.room === "closet" ? beat.spots() : null;
      return s && beat.homeAlone && beat.homeAlone() ? [...s, ...ch1CalendarSpots()] : s;
    }
    // True while Mops walks out at the end of the morning (the goal chip hides).
    function ch1MorningLeaving() {
      let beat = window.SSQ && window.SSQ.beat("ch1-morning");
      return !!(beat && beat.leaving());
    }
    function ch1QChip() {
      if (ch1MorningLeaving()) return "";
      if (partyBeat() && partyBeat().active()) return n.ch1Chip || "";
      if (n.ch1Chip) return n.ch1Chip;
      return CH1Q_CHIPS[n.scene] || "";
    }
    // How tall people are drawn in each room: src/modules/room-sizes.js (85% of a room's door; the hall 40% bigger).
    function doorAdultPx(room) {
      return window.SSQ && window.SSQ.doorAdultPx ? window.SSQ.doorAdultPx(room) : 66;
    }
    function adultPxFor(room) {
      return window.SSQ && window.SSQ.adultPxFor ? window.SSQ.adultPxFor(room) : doorAdultPx(room);
    }
    const HALL_ADULT_PX = adultPxFor("hall");
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
    // The hall's sizes above are for people in the hall. The few figures drawn with them in other rooms (a tour
    // group, Chapter 1's guard, Qt in the office scene) keep the size they had: only the hall grew.
    function qtHere() {
      return n.room === "hall" ? QT_ADULT : doorAdultPx("hall") / 50;
    }
    function alienHere() {
      return n.room === "hall" ? ALIEN_ADULT : doorAdultPx("hall") / 84;
    }
    function sqDrawScale() {
      if (n.room === "closet" && (n.scene || "")[0] !== "Q") return wl;
      return (adultPxFor(n.room) * 0.8) / 45;
    }
    // The box round Squatch's drawing (ears and fur included), and round Mops's, in game positions. At home the
    // room draws Squatch at wl.
    function sqBox() {
      let q = n.room === "closet" ? wl : sqDrawScale();
      return { x0: n.sq.x - 19 * q, x1: n.sq.x + 19 * q, y0: n.sq.y - 50 * q, y1: n.sq.y + 2 };
    }
    function moBox() {
      let q = moDrawScale();
      return { x0: n.mo.x - 24 * q, x1: n.mo.x + 24 * q, y0: n.mo.y - 56 * q, y1: n.mo.y + 2 };
    }
    function moDrawScale() {
      if (n.room === "closet" && (n.scene || "")[0] !== "Q") return wl;
      return sqDrawScale() * 1.15;
    }
    // Back-wall door of office-room-empty-v2. The hallway's front door, seen from inside.
    // Feet stand just through that door, on the floor below the picture's floor line (source y 330).
    const CH1_OFFICE_DOOR = { x: 480, y: 286 };
    const LOCKED_ROOMS = {
      hall: "docs/locked-rooms/hall-room-empty-v2.png",
      hallway: "docs/locked-rooms/hallway-room-empty-v6.png",
      "delivery-day": "docs/locked-rooms/delivery-room-empty-day-v2.png",
      "delivery-night": "docs/locked-rooms/delivery-room-empty-night-v2.png",
      "delivery-noship": "docs/locked-rooms/delivery-room-empty-day-noship-v2.png",
      "delivery-pickup": "docs/locked-rooms/delivery-room-empty-pickup-v3.png",
      "home-closed": "docs/locked-rooms/home-room-empty-closed-v6.png",
      "home-open": "docs/locked-rooms/home-room-empty-open-v6.png",
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
    // The locked picture drawn last, so the goal outline can trace things in it.
    let lockedNow = "";
    function drawLockedRoom(id) {
      lockedNow = id;
      let img = lockedImg[id];
      img && img.complete && img.naturalWidth ? e.drawImage(img, 0, 0, c, b) : ((e.fillStyle = "#e2e5ed"), e.fillRect(0, 0, c, b));
    }
    // Where Squatch's eyes show when he hides in a plant (Brian, C21: "The two eyes sit LOW, in the two
    // lower-front clumps" of leaves, small). One entry per plant in the locked pictures, in game positions.
    const CH1_PLANT_EYES = {
      hangar: [[125, 308]], // loading bay plant
      hall: [
        [441, 486], // the plant in the middle of the hall
        [101, 318], // the plant by the back wall
      ],
    };
    // The eyes of the plant Squatch is hiding in (the nearest plant within reach), or over his own spot.
    function ch1HideEyes() {
      let best = null,
        d = 140;
      for (let [x, y] of CH1_PLANT_EYES[n.room] || []) {
        let k = Math.hypot(n.sq.x - x, n.sq.y - 60 - y);
        k < d && ((d = k), (best = [x, y]));
      }
      best ? ga(best[0], best[1]) : ga(n.sq.x, n.sq.y - 46);
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
        hallSideDoor = [870, 336], // just inside the right-wall doorway (v2: picture y 338 to 443, game 261 to 342)
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
      ((n.ctrl = !1), (n.act = null), pkBeat() ? pkBeat().start() : ch1ChapterEnd()); // pickup day: src/modules/pickup.js
    }
    function ch1QSpots() {
      if (partyBeat() && partyBeat().active()) return [...partyBeat().spots(), ...ch1CalendarSpots()];
      if (ch1MorningSpots()) return ch1MorningSpots();
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
    // "Outline; words if stuck" (Brian, 2026-11-22): while the goal's thing is outlined, the goal words wait
    // until the player has had control in this step for this long without moving it on.
    const CH1_WORDS_IF_STUCK = 20;
    function ch1GoalClock(dt) {
      let key = n.scene + "|" + n.room + "|" + (n.ch1Step || "");
      key !== n.ch1GoalKey && ((n.ch1GoalKey = key), (n.ch1GoalT = 0));
      n.ctrl && !n.cur && (n.ch1GoalT = (n.ch1GoalT || 0) + (dt || 0));
    }
    // True while the goal words should wait: an outline is showing and the player is not stuck yet.
    function ch1WordsWait() {
      return (n.scene || "")[0] === "Q" && !!n.lastRing && n.T - n.lastRing.T < 0.3 && (n.ch1GoalT || 0) < CH1_WORDS_IF_STUCK;
    }
    function ch1QTick(dt) {
      (n.scene || "")[0] === "Q" && ch1GoalClock(dt);
      (n.scene || "")[0] === "Q" &&
        (n.ctrl && (n.act = pick(ch1QSpots())),
        ch1Watch(dt),
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
    function drawCh1DayHall() {
      drawLockedRoom("hall");
      if (n.roomOnly) return;
      luBeat() && luBeat().drawProps(e); // the crates and the plate of Moon Pies stay after the lunch sneak
      n.scene === "Q3" && !(n.ch1Step === "family" || n.ch1Step === "gohome") && drawCh1Alien(640, 500, "hat", ALIEN_ADULT, 1);
      n.moPose !== "hidden" && n.mo.x > -50 && n.mo.x < 1100 && Fe(n.mo.x, n.mo.y, moDrawScale(), { f: n.mo.f || 1, walk: n.mo.moving ? n.mo.walk : 0, mop: !1 });
      n.sqPose === "ball" && drawL2Ball(n.sq.x, n.sq.y - 16);
      n.sqPose === "hidden" && ch1HideEyes();
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
    function drawMailRobot(px, py) {
      (dq(px, py, !0), g("UPS", px, py - 8, 10, "#ffffff", "center", 900));
    }
    function drawCh1Delivery() {
      let night = !!n.ch1Night;
      drawLockedRoom(ch1DeliveryArt());
      n.ch1Prop === "delicious" && (drawPinkSlip(760, 160), C([730, 250, 860, 170], "#9aa3b2", 2));
      n.ch1Prop === "gumble" && drawPinkSlip(n.mo.x - 8, n.mo.y - 78);
      n.ch1Prop === "bin" && drawPinkSlip(250, 470);
      n.ch1Prop === "teeth" && drawPinkSlip(n.mo.x - 6, n.mo.y - 72);
      n.ch1Prop === "paw" && drawPinkSlip(n.sq.x + 8, n.sq.y - 48);
      n.sqPose === "hidden" && !n.ch1InCrate && ch1HideEyes();
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
