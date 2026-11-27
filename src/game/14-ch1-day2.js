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
    // Beats 53 to 61, pickup day: src/modules/pickup.js (the escape hands over to it; it ends with ch1ChapterEnd).
    function pkBeat() {
      return (window.SSQ && window.SSQ.beat && window.SSQ.beat("ch1-pickup")) || null;
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
      esBeat() ? esBeat().start() : pkBeat() ? pkBeat().start() : ch1ChapterEnd();
    }
    // The end of Chapter 1 (pickup.js hands over here after beat 61): the never-caught bonus, the tally card, Chapter 2.
    function ch1ChapterEnd() {
      ((n.ctrl = !1), (n.act = null));
      J([
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
    }
    function ch1OkHit(x, y) {
      return x > 760 && x < 940 && y > 500 && y < 600;
    }
    function ch1CalHit(x, y) {
      return Math.hypot(x - 179, y - 214) < 80;
    }
    function ch1WorldTap(x, y) {
      if (!n.ch1Day2 || !n.ctrl || n.ch1Zoom) return !1;
      for (let b of [hmBeat(), luBeat(), evBeat(), esBeat(), pkBeat()]) if (b && b.active() && b.tap && b.tap(x, y)) return !0; // a tap on the glowing thing (or the lunch's close-up)
      return !1;
    }
    function ch1ZoomHit(x, y) {
      let s = n.ch1Step;
      if (ch1OkHit(x, y)) return !0;
      if (Math.hypot(x - 880, y - 540) < 42) return !0;
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
      for (let b of [bayBeat(), luBeat(), evBeat(), esBeat(), pkBeat()]) if (b && b.active()) return b.spots();
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
        (n.ch1Lunch = null),
        (n.ch1Bay = null),
        (n.ch1Escape = null),
        (n.ch1Pickup = null),
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
      } else if (b >= 53 && b <= 58) {
        // pickup day (pickup.js): 53 the note, 54 the push, 55 Mops at the bay door, 56 the snip, 57 the last walk, 58 the box
        ((n.scene = "QB"), pkBeat() && pkBeat().jump(["start", "push", "warn", "snip", "lastwalk", "pickbox"][b - 53]));
      } else if (b >= 59 && b <= 61) {
        // pickup day (pickup.js): 59 Isfred's lines, 60 the tapes (from the frame), 61 the cargo hold
        ((n.scene = "QB"), pkBeat() && pkBeat().jump(["isfred", "tape", "cake"][b - 59]));
      }
      chipNow();
    }
