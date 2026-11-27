// Chapter 1 beats 22-61. Day 1 calls ch1Day2Begin. This file owns the lunch, the night order, the escape, and pickup day.
    function ch1Ready(step, chip, scene) {
      ((n.ch1Step = step), (n.ch1Chip = chip), scene && (n.scene = scene), (n.ctrl = !0), (n.act = null), chipNow());
    }
    function ch1SetPaper(p) {
      ((n.ch1Paper = p), (n.ch1PaperLog = n.ch1PaperLog || []).push(p), p === "vent" && !n.ch1Paw && (n.ch1VentLunch = 1));
    }
    function ch1GoDay(dest, flags, next) {
      let f = flags || {};
      ((n.ctrl = !1), (n.ch1Journey = !0), (n.act = null));
      ch1Go(dest, f, () => {
        ((n.ch1Journey = !1), next && next());
      });
    }
    function ch1At(verb, cap, x, y, r, fn) {
      return spot({ id: "d2-" + verb + "-" + cap, verb, cap, who: "sq", x, y, r, hot: !0, f: fn });
    }
    // Beats 22 to 24, the home morning: src/modules/home-morning.js. Without it, Day 2 goes straight to the lunch sneak.
    function hmBeat() {
      return (window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-home-morning")) || null;
    }
    // Beats 37 to 42, the evening and night one: src/modules/evening.js. Without it, Day 2 goes on to beat 43.
    function evBeat() {
      return (window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-evening")) || null;
    }
    // Beats 25 to 27, the lunch sneak: src/modules/lunch-sneak.js. Without it, TAKE · lunch goes straight to beat 28.
    function luBeat() {
      return (window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-lunch")) || null;
    }
    // Beats 43 to 52, the escape: src/modules/escape.js. Without it, night one goes straight to pickup day (beat 53).
    function esBeat() {
      return (window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-escape")) || null;
    }
    function ch1Day2Begin(awake) {
      ((n.ch1Day2 = !0),
        (n.ch1VentLunch = 0),
        (n.wardrobe = "closed"),
        (n.room = "closet"),
        (n.scene = "QB"),
        (n.ch1D = !1),
        (n.ch1Duct = !1),
        (n.ch1Night = !1),
        (n.ch1Office = !1),
        (n.ch1Sneak = !1),
        (n.moPose = "hidden"),
        (n.mo.x = -400),
        (n.sqPose = "stand"),
        (n.sq.x = 400),
        (n.sq.y = 520),
        (n.ch1Hold = ""),
        (n.ch1Paper = ""),
        (n.ch1PaperLog = []),
        (n.ch1Zoom = null),
        (n.ctrl = !1));
      hmBeat() ? hmBeat().start({ awake: !!awake }) : ch1TakeLunch();
    }
    // The hand-over from the home morning to the lunch sneak (TAKE · lunch, home-morning.js).
    function ch1TakeLunch() {
      luBeat() ? luBeat().start() : ch1ShipCall();
    }
    // Beats 28 to 36, the loading bay: src/modules/loading-bay.js. Without it, Day 2 goes on to beat 37 in the hallway.
    function bayBeat() {
      return (window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-bay")) || null;
    }
    function ch1ShipCall() {
      bayBeat() ? bayBeat().start() : evBeat() ? evBeat().start() : ch1SixDays();
    }
    function ch1SixDays() {
      esBeat() ? esBeat().start() : ch1PackStart();
    }
    function ch1PackStart() {
      ((n.ctrl = !1), (n.ch1Zoom = { id: "pack", zoom: 0, paw: { x: 300, y: 580 } }), (n.ch1Step = "pack1"), (n.ch1Chip = "Squatch: pack the crate"), chipNow());
    }
    function ch1PackBox() {
      if (n.ch1Packed) return;
      ((n.ch1Packed = 1), (n.ch1Step = "pack2"), D.hide());
    }
    function ch1PackBucket() {
      if (n.ch1Packed !== 1) return;
      ((n.ch1Packed = 2), ch1CloseZoom(ch1ToPickup));
    }
    function ch1ToPickup() {
      ch1GoDay("hall", { who: "both", scene: "QB" }, () => {
        ch1GoDay("passage", { who: "both", scene: "QB" }, () => {
          ch1GoDay("delivery", { who: "sq", scene: "QB", ship: !0, crew: "pickup", mail: "full", night: !1, stand: [760, 520] }, ch1PickupWatch);
        });
      });
    }
    function ch1PickupWatch() {
      ((n.ch1InCrate = !0),
        (n.ch1Peeked = !0),
        (n.ch1Load = 0),
        (n.ch1Crew = "pickup"),
        (n.ch1Ship = !0),
        (n.sqPose = "hidden"),
        (n.sq.x = 780),
        (n.sq.y = 520),
        (n.moPose = "stand"),
        (n.mo.x = -40),
        (n.mo.y = 520),
        (n.ctrl = !1),
        (n.scene = "QB"));
      J([
        cV((dt) => {
          n.ch1Load = Math.min(1, (n.ch1Load || 0) + dt * 0.55);
          return (ch1Trail(), n.ch1Load >= 1 && mV(n.mo, 690, 520, 160, dt));
        }),
        v("mops", "Get out. They're checking a crate."),
        N(() => {
          ((n.ch1InCrate = !1), (n.sqPose = "stand"), (n.ch1Climbed = !0));
        }),
        ch1Step("sq", 700, 520, 140),
        N(() =>
          ch1GoDay("passage", { who: "both", scene: "Q8", night: !1 }, () => {
            ch1GoDay("hall", { who: "both", scene: "Q8" }, () => {
              ch1GoDay("closet", { who: "both", scene: "Q8" }, ch1CostumeReady);
            });
          }),
        ),
      ]);
    }
    function ch1CostumeReady() {
      ((n.wardrobe = "open"), (n.room = "closet"), (n.ctrl = !1));
      J([
        v("mops", "The spare jacket. The beard. And the horns."),
        N(() => ch1Ready("jacket", "Squatch: put on the spare jacket", "Q8")),
      ]);
    }
    function ch1Jacket() {
      ((n.ctrl = !1),
        J([
          ch1Step("sq", 200, 500, 150),
          N(() => (n.costumeOn = !0)),
          v("mops", "More bleat. Less roar."),
          N(ch1LastWalk),
        ]));
    }
    function ch1LastWalk() {
      ((n.ch1Last = !0), (n.ctrl = !1));
      ch1GoDay("hall", { who: "both", scene: "Q9" }, () => {
        ch1GoDay("passage", { who: "both", scene: "Q9" }, () => ch1Ready("keepsake", "Squatch: go to the ship", "Q9"));
      });
    }
    function ch1TakeDrawing() {
      if (n.ch1Keepsake) return;
      ((n.ch1Keepsake = !0), (n.ch1Crayon = !0), D.pickup());
    }
    function ch1ToScanner() {
      ch1GoDay("delivery", { who: "both", scene: "Q9", ship: !0, crew: "", mail: "full", night: !1, stand: [420, 500] }, () => {
        ((n.costumeOn = !0), (n.ch1Crew = ""), ch1Ready("board", "Squatch: walk through the scanner", "Q9"));
      });
    }
    function ch1Leave() {
      ((n.ctrl = !1), (n.act = null), (n.costumeOn = !0));
      J([
        v("scanner", "HAIR... PROBABLY. PROCEED."),
        cV((dt) => (ch1Trail(), (n.costumeOn = !0), mV(n.sq, 480, 240, 160, dt) && mV(n.mo, 540, 250, 160, dt))),
        N(() => {
          ((Ka = 1),
            (n.room = "office"),
            (n.ch1D = !1),
            (n.ch1Office = !0),
            (n.scene = "Q9"),
            (n.ch1Chip = ""),
            (n.sqPose = "hidden"),
            (n.moPose = "hidden"),
            (n.sq.x = -400),
            (n.sq.y = -400),
            (n.mo.x = -400),
            chipNow());
        }),
        v("official", "Send in Mops for his Employee of the Month photo."),
        v("robot", "Mops isn't here."),
        v("official", "Not here? He can't live off the station!"),
        v("robot", "He was replaced by the new robot shipment."),
        v("official", "I never ordered a replacement! Get me the security tapes."),
        { k: "card", id: "later", text: "Later that evening..." },
        N(() => (n.ch1Tape = !0)),
        uV(1.1),
        N(() => (n.ch1Heart = !0)),
        v("pa", "The base called the ship. It has to stop.", "pa"),
        N(() => {
          (aV.caught + x.caught === 0 && !n.found.has("ghost1") && (n.found.add("ghost1"), (n.stars += 250)), (B.nextBeat = "Ch2"));
        }),
        { k: "panel", id: "tally" },
        N(Ws),
      ]);
    }
    function ch1CloseZoom(next) {
      ((n.ctrl = !1), (n.act = null), (n.ch1ZoomClosing = !0), (n.ch1ZoomNext = next));
      n.ch1Zoom || ((n.ch1ZoomClosing = !1), next && next());
    }
    function ch1ZoomAct() {
      let s = n.ch1Step;
      s === "pack1" ? ch1PackBox() : s === "pack2" && ch1PackBucket();
    }
    function ch1OkHit(x, y) {
      return x > 760 && x < 940 && y > 500 && y < 600;
    }
    function ch1CalHit(x, y) {
      return Math.hypot(x - 179, y - 214) < 80;
    }
    function ch1WorldTap(x, y) {
      if (!n.ch1Day2 || !n.ctrl || n.ch1Zoom) return !1;
      for (let b of [hmBeat(), luBeat(), evBeat(), esBeat()]) if (b && b.active() && b.tap && b.tap(x, y)) return !0; // a tap on the glowing thing (or the lunch's close-up)
      return !1;
    }
    function ch1ZoomHit(x, y) {
      let s = n.ch1Step;
      if (ch1OkHit(x, y)) return !0;
      if (Math.hypot(x - 880, y - 540) < 42) return !0;
      if (s === "pack1" || s === "pack2") return Math.hypot(x - 480, y - 330) < 110;
      return !1;
    }
    function ch1Day2Pointer(kind, x, y) {
      let z = n.ch1Zoom;
      if (z && z.zoom >= 1) z.paw = { x, y };
      if (!z || z.zoom < 1 || n.ch1ZoomClosing) return;
      let onX = Math.hypot(x - 880, y - 540) < 42;
      kind === "up" && ch1ZoomHit(x, y) && !onX && ch1ZoomAct();
    }
    function ch1Day2Tick(dt) {
      if (!n.ch1Day2) return;
      let z = n.ch1Zoom;
      if (z && n.ch1ZoomClosing) {
        z.zoom = Math.max(0, z.zoom - (dt || 0) / 0.4);
        if (z.zoom <= 0) {
          let next = n.ch1ZoomNext;
          ((n.ch1Zoom = null), (n.ch1ZoomClosing = !1), (n.ch1ZoomNext = null), next && next());
        }
        return;
      }
      (z && z.zoom < 1 && (z.zoom = Math.min(1, z.zoom + (dt || 0) / 0.5)),
        z && z.zoom >= 1 && !n.cur && n.q.length === 0 && (n.ctrl = !0));
    }
    function ch1Day2Spots() {
      if (hmBeat() && hmBeat().active()) return hmBeat().spots();
      for (let b of [bayBeat(), luBeat(), evBeat(), esBeat()]) if (b && b.active()) return b.spots();
      if (!n.ch1Day2 || !n.ctrl) return [];
      let s = n.ch1Step;
      if (n.sqPose === "hidden" || n.sqPose === "ball" || n.sqPose === "sleep") return [];
      if (s === "pack1") return [ch1At("PACK", "box", n.sq.x || 420, n.sq.y || 520, 280, ch1PackBox)];
      if (s === "pack2") return [ch1At("PACK", "bucket", n.sq.x || 420, n.sq.y || 520, 280, ch1PackBucket)];
      if (s === "jacket") return [ch1At("PUT ON", "jacket", 160, 510, 170, ch1Jacket)];
      if (s === "keepsake") {
        let out = [ch1At("GO", "ship", 820, 510, 220, ch1ToScanner)];
        n.ch1Keepsake || out.push(ch1At("TAKE", "drawing", 480, 450, 80, ch1TakeDrawing));
        return out;
      }
      if (s === "board") return [ch1At("BOARD", "scanner", 480, 500, 170, ch1Leave)];
      return [];
    }
    function drawSlip(x, y, color, w, h) {
      (m(x, y, w || 28, h || 36, 3), r(color, 2));
    }
    function drawZoomX() {
      (L(880, 540, 32), r("#ffffff", 4), g("X", 880, 540, 28, "#1e2430", "center", 900));
    }
    function drawCh1Passage() {
      drawLockedRoom(n.ch1Office ? "office" : "hallway");
      luBeat() && luBeat().drawWall && luBeat().drawWall(e); // the Employee of the Month photo of Mops, under the people
      n.ch1Crayon &&
        !n.ch1Keepsake &&
        !n.ch1Office &&
        // Squatch's crayon card: "ME" and "MOPS THE GANITOR" (Brian 2026-11-26; src/modules/ganitor.js)
        (window.SSQ && window.SSQ.drawHallwayCrayon ? window.SSQ.drawHallwayCrayon(e) : (m(592, 118, 96, 68, 6), r("#fffdf8", 3), g("ME", 640, 142, 17, "#1e2430", "center", 800), g("MOPS", 640, 170, 17, "#1e2430", "center", 800)));
      (n.moPose !== "hidden" && Fe(n.mo.x, n.mo.y, moDrawScale(), { f: n.mo.f || 1, walk: n.mo.moving ? n.mo.walk : 0, mop: !1 }),
        n.sqPose === "ball" && drawL2Ball(n.sq.x, n.sq.y - 16),
        n.sqPose === "hidden" && ga(n.sq.x, n.sq.y - 40),
        n.sqPose !== "hidden" &&
          n.sqPose !== "ball" &&
          Re(n.sq.x, n.sq.y, sqDrawScale(), { f: n.sq.f || 1, walk: n.sq.moving ? n.sq.walk : 0, jacket: !!n.costumeOn, goatBeard: !!n.costumeOn, horns: !!n.costumeOn }));
    }
    function drawCh1Zoom() {
      let z = n.ch1Zoom;
      if (!z) return;
      (e.save(), (e.filter = "blur(6px)"), e.drawImage(e.canvas, 0, 0), e.restore(), (e.fillStyle = "rgba(12,16,28,.35)"), e.fillRect(0, 0, c, b));
      let shade = e.createRadialGradient(480, 300, 160, 480, 320, 560);
      (shade.addColorStop(0, "rgba(0,0,0,0)"), shade.addColorStop(1, "rgba(0,0,0,.5)"), (e.fillStyle = shade), e.fillRect(0, 0, c, b));
      let id = z.id;
      if (id === "pack") {
        (m(360, 240, 240, 160, 8), r("#d7c4a3", 4), g((window.SSQ && window.SSQ.snack ? window.SSQ.snack("NAME") : "SNACKS"), 480, 280, 18, "#1e2430", "center", 900));
        n.ch1Packed && (m(430, 300, 80, 50, 4), r("#3478f6", 3), g("MY GARDIANS", 470, 326, 10, "#fff", "center", 800), drawSlip(448, 312, "#ff8fb8", 22, 18));
        n.ch1Packed === 2 && (L(560, 250, 22), r("#8a93a3", 3));
      }
      (drawPawArm(z.paw), drawZoomX(), (e.globalAlpha = 1));
    }
    function drawCh1Day2() {
      n.ch1ShowBots &&
        n.room === "hangar" &&
        [0, 1, 2].forEach((i) => {
          let t = n.ch1Roll || n.ch1Ramp || 1,
            x = 760 + (360 + i * 70 - 760) * t,
            y = 300 + (500 - 300) * t;
          dq(x, y, !1);
        });
    }
    function ch1JumpBeat(beat) {
      let b = beat | 0;
      ((ch2.qCheck = null),
        (ch2.sec = null),
        (n.q = []),
        (n.cur = null),
        (n.ctrl = !0),
        (n.ch1Day2 = !0),
        (n.ch1Zoom = null),
        (n.ch1Office = !1),
        (n.ch1Night = !1),
        (n.ch1Duct = !1),
        (n.ch1D = !1),
        (n.ch1Ship = !1),
        (n.wardrobe = "closed"),
        (n.sqPose = "stand"),
        (n.moPose = "stand"),
        (n.costumeOn = !1),
        (n.ch1ShowBots = !1),
        (n.ch1Prop = ""),
        (n.ch1Paper = ""),
        (n.ch1Hold = ""),
        (n.ch1Heart = !1),
        (n.ch1Brochure = !1),
        (n.ch1Evening = null),
        (n.ch1Paw = 0),
        (n.ch1Tape = !1),
        (n.ch1Crayon = !1),
        (n.ch1InCrate = !1),
        (n.ch1Crouch = !1),
        (n.ch1Wide = !1),
        (n.ch1Morning = null),
        (n.ch1HomeMorning = null),
        (n.ch1Lunch = null), (n.ch1Bay = null),
        (n.ch1Evening = null),
        (n.ch1Escape = null),
        (n.ch1Chip = ""));
      if (b === 22 || b === 23) {
        // the home morning (home-morning.js), awake beside the rocket; 23: the lunch goal by the wardrobe (LOOK · calendar)
        ((n.room = "closet"), (n.scene = "QB"), ch1Day2Begin(!0));
        b === 23 && hmBeat() && hmBeat().jump("cal");
      } else if (b >= 25 && b <= 27) {
        // the lunch sneak (lunch-sneak.js): 25 at its start in the hall, 26 in the hallway, 27 behind the counter
        ((n.scene = "QB"), luBeat() && luBeat().jump(["plant", "give", "snack"][b - 25]));
      } else if (b >= 28 && b <= 36) {
        // the loading bay (loading-bay.js): 28 behind the counter, 29 hiding, then each beat's first part
        ((n.scene = "QB"), bayBeat() && bayBeat().jump(["pa", "hallway", "robots", "promise", "peek", "take", "talkto", "spit", "walkby"][b - 28]));
      } else if ((b >= 37 && b <= 42) || (b >= 138 && b <= 145)) {
        // the evening and night one (evening.js BEAT_STEP): 37 the hallway wall ... 42 out of bed at night; 138 to 145 the steps between
        ((n.scene = "QB"), evBeat() && evBeat().jumpBeat(b));
      } else if (b >= 43 && b <= 52) {
        // the escape (escape.js): 43 to 46 from its card ("Six days later"), 47 the ball, 48 and 49 the slip, 50 the keypad, 51 the computer, 52 the snacks
        ((n.scene = "QB"), esBeat() && esBeat().jump(b <= 46 ? "start" : ["sneak", "tunnel", "grab", "tohall", "computer", "tobar"][b - 47]));
      } else if (b === 53) {
        ((n.room = "closet"), (n.scene = "QB"), (n.sq.x = 420), (n.sq.y = 520), (n.mo.x = 560), (n.mo.y = 500));
        n.ch1Zoom = { id: "pack", zoom: 1, paw: { x: 400, y: 400 } };
        n.ch1Step = "pack1";
        n.ch1Packed = 1;
      } else if (b === 54) {
        ((n.room = "hangar"), (n.ch1D = !0), (n.ch1Ship = !0), (n.scene = "QB"), (n.ch1InCrate = !0), (n.ch1Crew = "pickup"), (n.sqPose = "hidden"), (n.sq.x = 780), (n.sq.y = 520), (n.mo.x = 200), (n.mo.y = 520));
      } else if (b === 57) {
        ((n.room = "hall"), (n.scene = "Q3"), (n.costumeOn = !0), (n.sq.x = 400), (n.sq.y = 520), (n.mo.x = 520), (n.mo.y = 510), (n.ch1Pop = 1), (n.ch1Step = "keepsake"));
      } else if (b === 61) {
        ((n.room = "hangar"),
          (n.ch1D = !0),
          (n.ch1Ship = !0),
          (n.scene = "Q9"),
          (n.sqPose = "hidden"),
          (n.moPose = "hidden"),
          (n.ctrl = !1),
          (n.bt = 1),
          (n.ch1Heart = !0),
          (n.cur = { k: "bub", b: { who: "pa", text: "The base called the ship. It has to stop.", style: "pa", ear: !1 } }));
      } else if (b === 56) {
        ((n.room = "closet"), (n.scene = "Q8"), (n.wardrobe = "open"), (n.costumeOn = !0), (n.sq.x = 460), (n.sq.y = 510), (n.mo.x = 620), (n.mo.y = 500), (n.ch1Step = "jacket"));
      } else if (b === 58) {
        ((n.room = "hangar"), (n.ch1D = !0), (n.ch1Ship = !0), (n.scene = "Q9"), (n.costumeOn = !0), (n.sq.x = 420), (n.sq.y = 500), (n.mo.x = 520), (n.mo.y = 500), (n.ch1Step = "board"));
      } else if (b === 59 || b === 60) {
        ((n.room = "office"),
          (n.ch1Office = !0),
          (n.ch1Step = ""),
          (n.scene = "Q9"),
          (n.sqPose = "hidden"),
          (n.sq.x = -400),
          (n.sq.y = -400),
          (n.moPose = "hidden"),
          (n.ch1Tape = b === 60),
          (n.scene = b === 60 ? "Q0" : "Q9"),
          (n.ctrl = b === 60),
          (n.bt = b === 59 ? 1 : 0),
          b === 59 &&
            (n.cur = {
              k: "bub",
              b: { who: "official", text: "Send in Mops for his Employee of the Month photo.", style: "say", ear: !1 },
            }));
      }
      b === 60 && ((n.scene = "Q0"), (n.ch1Chip = ""), (n.ctrl = !0), (n.cur = null));
      chipNow();
    }
