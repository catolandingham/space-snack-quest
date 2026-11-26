// Chapter 1 beats 22-61. Day 1 calls ch1Day2Begin. This file owns the lunch, the night order, the escape, and pickup day.
    // The office code, written on the pink sheet (Brian, chat, 2026-11-26: 169556; the keypad is src/modules/escape.js).
    const CH1_OFFICE_CODE = "169556";
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
    function ch1ShipCall() {
      ((n.ctrl = !1),
        J([
          v("pa", "Universal Postal Service ship arriving!", "pa"),
          v("mops", "I better go see what that is."),
          v("sq", "Please let me follow you, I'll be really sneaky."),
          v("mops", "Okay, just this time, but hide carefully."),
          N(() =>
            ch1GoDay("passage", { who: "both", scene: "QB" }, () => {
              ch1GoDay("delivery", { who: "both", scene: "QB", ship: !0, crew: "day", stand: [240, 520] }, () =>
                ch1Ready("hide", "Squatch: hide in the plant", "QB"),
              );
            }),
          ),
        ]));
    }
    function ch1HideBay() {
      if (n.ch1Hid) return;
      ((n.ch1Hid = !0), (n.ctrl = !1));
      J([
        ch1Step("sq", CH1_PLANT.x, CH1_PLANT.y, 160),
        N(() => {
          ((n.sqPose = "hidden"), D.hide(), (n.ch1Chip = "Squatch: hide and watch"), chipNow(), ch1BayLines());
        }),
      ]);
    }
    function ch1BayLines() {
      ((n.ch1Ramp = 0), (n.ch1ShowBots = !0), ch1SetPaper("set"), (n.ctrl = !1));
      J([
        cV((dt) => ((n.ch1Ramp = Math.min(1, (n.ch1Ramp || 0) + dt / 1.3)), n.ch1Ramp >= 1)),
        v("official", "Mops, don't worry, you know how much we love you here. Even our visitors always love you."),
        v("ups", "Isfred! A crate is damaged in the mail room."),
        cV((dt) => {
          ((n.ch1BossX = (n.ch1BossX == null ? 560 : n.ch1BossX) - 300 * dt), (n.ch1Crew = "leave"), (n.ch1Leave = Math.min(1, (n.ch1Leave || 0) + dt / 1.1)), n.ch1Paper !== "file" && ch1SetPaper("file"));
          return n.ch1BossX < -30;
        }),
        N(() => {
          ((n.ch1BossX = -1), (n.ch1Crew = ""), (n.ch1Filed = !0));
        }),
        v("ups", "Left one of the copies in the office. What do I do with the other two?"),
        v("mops", "I'll take care of it."),
        v("mops", "So futuristic and we still order on paper."),
        N(() => ch1SetPaper("bite")),
        v("mops", "Delicious."),
        N(() => ch1SetPaper("mouth")),
        v("mops", "Mmf mrrf!"),
        v("sq", "You're gumbling! (goat mumbling)"),
        N(() => ch1SetPaper("bin")),
        v("mops", "Ptoo!"),
        N(() => (n.sqPose = "stand")),
        ch1Step("sq", 430, 520, 140),
        v("mops", "We got to watch out for these robots."),
        v("sq", "What's the difference between fur and hair?"),
        v("mops", "Paperwork."),
        N(() => {
          n.ch1ShowBots = !1;
          ch1GoDay("passage", { who: "both", scene: "QB", stand: [420, 510] }, () => ch1Ready("photos", "Squatch: go on", "QB"));
        }),
      ]);
    }
    function ch1LookPhotos() {
      if (n.ch1Gallery) return;
      ((n.ch1Gallery = !0), (n.ctrl = !1));
      J([
        { k: "card", id: "gag1", text: "Mops, with a cone on his head." },
        { k: "card", id: "gag2", text: "Mops, with a banana for a horn." },
        { k: "card", id: "gag3", text: "Mops, with a roll in his mouth." },
        { k: "card", id: "gag4", text: "TIED TOGETHER FOREVER" },
        N(() => (n.ch1Crayon = !0)),
        { k: "card", id: "gag5", text: "Mops, and a ball of fur in the back." },
        N(() => (n.ch1Beep = !0)),
        v("ups", "BEEP BEEP"),
        N(() => (n.ch1Beep = !1)),
        ch1Step("sq", 480, 540, 220),
        N(() => ch1Ready("photos", "Squatch: go on", "QB")),
      ]);
    }
    function ch1LeavePhotos() {
      ch1GoDay("hall", { who: "both", scene: "Q3", stand: [640, 520] }, ch1SnackLine);
    }
    function ch1SnackLine() {
      ((n.ctrl = !1),
        J([
          v("tourist", "I swear we had more Moon Pies... is that what they stole at lunch?", "say", !0),
          v("mops", "Quick, hide."),
          N(() => ch1Ready("family", "Squatch: hide", "Q3")),
        ]));
    }
    function ch1HideFamily() {
      ((n.ctrl = !1), (n.sqPose = "hidden"), (n.sq.x = 430), (n.sq.y = 530), D.hide());
      J([
        uV(0.35),
        v("tourist", "We ate at a pancake place on Mars."),
        v("tourist", "Here, a brochure."),
        N(() => {
          ((n.ch1Brochure = !0), (n.ch1BrochureBig = 3.2), (n.ch1Heart = !0), (n.sqPose = "stand"));
        }),
        v("sq", "Are those other Sasquatches?", "whisper"),
        v("mops", "I need to get back to work, we'll talk about it tonight."),
        ch1Step("mo", 1120, 520, 180),
        N(() => {
          ((n.moPose = "hidden"), (n.mo.x = 1200), (n.ch1Heart = !1), ch1Ready("gohome", "Squatch: go home", "Q3"));
        }),
      ]);
    }
    function ch1GoHome() {
      ch1GoDay("closet", { who: "sq", scene: "QB" }, ch1MarsTalk);
    }
    function ch1MarsTalk() {
      ((n.moPose = "stand"), (n.mo.x = 1100), (n.mo.y = 510), (n.ctrl = !1));
      J([
        cV((dt) => (ch1Trail(), mV(n.mo, 520, 510, 180, dt))),
        v("mops", "Didn't you hear what the manager said? They need me here, they're not going to replace me. Plus the Guardians are here."),
        N(() => (n.ch1Heart = !0)),
        cV((dt) => (ch1Trail(), mV(n.sq, 205, 470, 180, dt) && mV(n.mo, 380, 460, 180, dt))),
        N(() => {
          ((n.sqPose = "sleep"), (n.sq.x = 205), (n.sq.y = 470), (n.mo.x = 380), (n.mo.y = 460), (n.ch1Lights = 1), D.snore());
        }),
        uV(1.1),
        N(() => {
          ((n.ch1Heart = !1), (n.sqPose = "stand"), ch1NightOut());
        }),
      ]);
    }
    function ch1NightOut() {
      ((n.ch1Night = !0), (n.ch1Sneak = !0), (n.moPose = "stand"), (n.mo.x = 380), (n.mo.y = 460));
      ch1GoDay("hall", { who: "sq", scene: "Q4", night: !0 }, () => {
        ch1GoDay("passage", { who: "sq", scene: "Q4", night: !0 }, () => {
          ch1GoDay("delivery", { who: "sq", scene: "Q4", night: !0, ship: !1, stand: [140, 540] }, () => {
            (ch1SetPaper("bin"), (n.ch1LookT = 0), ch1Ready("grab", "Squatch: get the copies from the bin", "Q4"));
          });
        });
      });
    }
    function ch1NightReset() {
      ((n.ch1Step = "grab"),
        ch1SetPaper("bin"),
        (n.ch1Paw = 0),
        (n.ch1PinkSucked = 0),
        (n.ch1Zoom = null),
        (n.ch1ZoomClosing = !1),
        (n.ch1Sneak = !0),
        (n.ch1Chip = "Squatch: get the copies from the bin"),
        chipNow());
    }
    function ch1GrabCopies() {
      ((n.ch1Got = 1), ch1SetPaper("paws"), (n.ctrl = !1), (n.ch1Zoom = { id: "paw", zoom: 0, paw: { x: 360, y: 580 } }), (n.ch1Step = "mark"), (n.ch1Chip = "Squatch: check the order"), chipNow());
    }
    function ch1Mark() {
      if (n.ch1Paw) return;
      ((n.ch1Paw = 1), (n.ch1Signed = 1), D.grab(), ch1CloseZoom(ch1AfterPaw));
    }
    function ch1AfterPaw() {
      (ch1SetPaper("paws"), ch1Ready("post", "Squatch: post the yellow copy", "Q4"));
    }
    function ch1PostYellow() {
      ((n.ctrl = !1), (n.ch1Mailed = 1), ch1SetPaper("pink"), (n.act = null));
      J([
        v("ups", "Mail scanned. Pawature accepted."),
        N(() => {
          ((n.ch1Roll = 0), (n.ch1ShowBots = !0));
        }),
        cV((dt) => ((n.ch1Roll = Math.min(1, (n.ch1Roll || 0) + dt / 1.2)), n.ch1Roll >= 1)),
        ch1Step("sq", CH1_VENT.x, CH1_VENT.y, 220),
        N(() => {
          ((n.sqPose = "stand"), (n.ch1Crouch = !0), (n.ch1Wide = !0));
        }),
        N(() => {
          ((n.ch1SuckT = n.T), D.slurp());
        }),
        uV(1.25),
        N(() => {
          ((n.ch1PinkSucked = 1),
            ch1SetPaper("vent"),
            (n.ch1SuckT = 0),
            (n.ch1Crouch = !1),
            (n.ch1Wide = !1),
            (n.ch1ShowBots = !1),
            (n.sqPose = "stand"),
            (n.ch1Step = "out"),
            (n.ch1Chip = "Squatch: sneak home"),
            (n.ctrl = !0),
            chipNow());
        }),
      ]);
    }
    function ch1OutHome() {
      ((n.ch1Sneak = !1), (n.ctrl = !1));
      ch1GoDay("passage", { who: "sq", night: !0, scene: "Q4" }, () => {
        ch1GoDay("hall", { who: "sq", night: !0, scene: "Q4" }, () => {
          ch1GoDay("closet", { who: "sq", night: !1, scene: "QB", mo: [380, 460] }, ch1SixDays);
        });
      });
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
      s === "mark" ? ch1Mark() : s === "pack1" ? ch1PackBox() : s === "pack2" && ch1PackBucket();
    }
    function ch1OkHit(x, y) {
      return x > 760 && x < 940 && y > 500 && y < 600;
    }
    function ch1HallDoorHit(x, y) {
      return x > 400 && x < 640 && y > 450;
    }
    function ch1CalHit(x, y) {
      return Math.hypot(x - 179, y - 214) < 80;
    }
    function ch1WorldTap(x, y) {
      if (!n.ch1Day2 || !n.ctrl || n.ch1Zoom) return !1;
      for (let b of [hmBeat(), luBeat(), esBeat()]) if (b && b.active() && b.tap && b.tap(x, y)) return !0; // a tap on the glowing thing (or the lunch's close-up)
      if (n.ch1Step === "photos" && ch1HallDoorHit(x, y)) return (ch1LeavePhotos(), !0);
      if (n.ch1Step === "family" && Math.hypot(x - 430, y - 530) < 80) return (ch1HideFamily(), !0);
      return !1;
    }
    function ch1ZoomHit(x, y) {
      let s = n.ch1Step;
      if (ch1OkHit(x, y)) return !0;
      if (Math.hypot(x - 880, y - 540) < 42) return !0;
      if (s === "mark") return Math.hypot(x - 470, y - 310) < 80;
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
      (n.ch1BrochureBig || 0) > 0 && (n.ch1BrochureBig -= dt || 0);
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
        z && z.zoom >= 1 && !n.cur && n.q.length === 0 && (n.ctrl = !0),
        n.ch1Step === "hide" &&
          n.ctrl &&
          n.sqPose === "stand" &&
          Math.hypot(n.sq.x - CH1_PLANT.x, n.sq.y - CH1_PLANT.y) < 78 &&
          ch1HideBay(),
        n.ch1Step === "family" &&
          n.ctrl &&
          n.sqPose === "stand" &&
          Math.hypot(n.sq.x - 430, n.sq.y - 530) < 78 &&
          ch1HideFamily());
    }
    function ch1Day2Spots() {
      if (hmBeat() && hmBeat().active()) return hmBeat().spots();
      if (luBeat() && luBeat().active()) return luBeat().spots();
      if (esBeat() && esBeat().active()) return esBeat().spots();
      if (!n.ch1Day2 || !n.ctrl) return [];
      let s = n.ch1Step;
      if (n.sqPose === "hidden" || n.sqPose === "ball" || n.sqPose === "sleep") return [];
      if (s === "hide") return [ch1At("HIDE", "plant", CH1_PLANT.x, CH1_PLANT.y, 130, ch1HideBay)];
      if (s === "photos")
        return [ch1At("GO", "hall", 480, 560, 130, ch1LeavePhotos), ch1At("LOOK", "photos", 480, 320, 110, ch1LookPhotos)];
      if (s === "family") return [ch1At("HIDE", "plant", 430, 530, 120, ch1HideFamily)];
      if (s === "gohome") return [ch1At("GO", "home", 480, 590, 120, ch1GoHome)];
      if (s === "grab") return [ch1At("GRAB", "copies", CH1_BIN.x, CH1_BIN.y, 110, ch1GrabCopies)];
      if (s === "mark") return [ch1At("MARK", "order", CH1_BIN.x, CH1_BIN.y, 170, ch1Mark)];
      if (s === "post") return [ch1At("POST", "mailbox", CH1_MAIL.x, CH1_MAIL.y, 110, ch1PostYellow)];
      if (s === "out") return [ch1At("GO", "door", 90, 540, 120, ch1OutHome)];
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
    function drawCouple(x, y, s) {
      (e.save(), e.translate(x, y), e.scale(s || 1, s || 1));
      [-34, 34].forEach((ox, i) => {
        (F(ox - 16, -18, 6, "#6b4428"),
          F(ox + 16, -18, 6, "#6b4428"),
          e.beginPath(),
          e.ellipse(ox, -4, 18, 16, 0, 0, 7),
          r(i ? "#7a5233" : "#6b4428", 2),
          F(ox - 6, -6, 2.2, "#1e2430"),
          F(ox + 6, -6, 2.2, "#1e2430"),
          e.beginPath(),
          e.arc(ox, 4, 3, 0.2, Math.PI - 0.2),
          (e.strokeStyle = "#1e2430"),
          (e.lineWidth = 1.4),
          e.stroke());
      });
      (m(-46, 16, 92, 18, 4), r("#fffdf8", 2), e.restore());
    }
    function drawCh1Passage() {
      drawLockedRoom(n.ch1Office ? "office" : "hallway");
      n.ch1Crayon &&
        !n.ch1Keepsake &&
        !n.ch1Office &&
        // Squatch's crayon card: "ME" and "MOPS THE GANITOR" (Brian 2026-11-26; src/modules/ganitor.js)
        (window.SSQ && window.SSQ.drawHallwayCrayon ? window.SSQ.drawHallwayCrayon(e) : (m(592, 118, 96, 68, 6), r("#fffdf8", 3), g("ME", 640, 142, 17, "#1e2430", "center", 800), g("MOPS", 640, 170, 17, "#1e2430", "center", 800)));
      n.ch1Beep && !n.ch1Office && drawMailRobot(860, 520);
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
      if (id === "paw") {
        (drawSlip(280, 170, "#ffe08a", 90, 120), drawSlip(330, 130, "#ff8fb8", 280, 340), g("ORDER MORE ROBOTS", 470, 190, 22, "#1e2430", "center", 900));
        (m(390, 230, 150, 150, 10), r("#ffffff", 5));
        if (n.ch1Paw) {
          (e.save(), (e.strokeStyle = "#1e2430"), (e.lineWidth = 12), (e.lineCap = "round"), e.beginPath(), e.moveTo(420, 310), e.lineTo(455, 350), e.lineTo(510, 260), e.stroke(), e.restore());
          (e.save(), e.translate(325, 230), e.rotate(-0.2), (e.strokeStyle = "#6b4428"), (e.lineWidth = 6), (e.lineCap = "round"), e.beginPath(), e.moveTo(-16, 4), e.lineTo(0, 18), e.lineTo(22, -16), e.stroke(), e.restore());
        }
        g(CH1_OFFICE_CODE, 470, 420, 28, "#1e2430", "center", 900);
      } else if (id === "pack") {
        (m(360, 240, 240, 160, 8), r("#d7c4a3", 4), g("MOON PIES", 480, 280, 18, "#1e2430", "center", 900));
        n.ch1Packed && (m(430, 300, 80, 50, 4), r("#3478f6", 3), g("MY GARDIANS", 470, 326, 10, "#fff", "center", 800), drawSlip(448, 312, "#ff8fb8", 22, 18));
        n.ch1Packed === 2 && (L(560, 250, 22), r("#8a93a3", 3));
      }
      (drawPawArm(z.paw), drawZoomX(), (e.globalAlpha = 1));
    }
    function drawCh1Day2() {
      if (n.ch1Paper === "bite" || n.ch1Paper === "mouth") (drawSlip(n.mo.x - 8, n.mo.y - 86, "#ff8fb8", 22, 28), drawSlip(n.mo.x + 8, n.mo.y - 80, "#ffe08a", 14, 18));
      n.ch1Paper === "bin" && (drawSlip(236, 470, "#ff8fb8", 20, 26), drawSlip(252, 476, "#ffe08a", 12, 16));
      n.ch1Paper === "paws" && n.sqPose === "stand" && (drawSlip(n.sq.x + 12, n.sq.y - 70, "#ff8fb8", 18, 24), !n.ch1Mailed && drawSlip(n.sq.x + 24, n.sq.y - 64, "#ffe08a", 12, 16));
      n.ch1Paper === "pink" && n.sqPose === "stand" && drawSlip(n.sq.x + 14, n.sq.y - 72, "#ff8fb8", 18, 24);
      if (n.ch1SuckT) {
        let t = Math.min(1, (n.T - n.ch1SuckT) / 1.15),
          x0 = n.sq.x + 18,
          y0 = n.sq.y - 62,
          x = x0 + (851 - x0) * t,
          y = y0 + (220 - y0) * t + Math.sin(t * 20) * 8 * (1 - t);
        for (let i = 1; i <= 5; i++) {
          let u = Math.max(0, t - i * 0.07),
            lx = x0 + (851 - x0) * u,
            ly = y0 + (220 - y0) * u;
          C([lx - 18, ly + 8, lx + 6, ly - 10], "rgba(255,143,184," + (0.85 - i * 0.12) + ")", 3);
        }
        (e.save(), e.translate(x, y), e.rotate(Math.sin(t * 16) * 0.5), drawSlip(-24, -30, "#ff8fb8", 48, 60), e.restore());
      }
      n.ch1ShowBots &&
        n.room === "hangar" &&
        [0, 1, 2].forEach((i) => {
          let t = n.ch1Roll || n.ch1Ramp || 1,
            x = 760 + (360 + i * 70 - 760) * t,
            y = 300 + (500 - 300) * t;
          dq(x, y, !1);
        });
      (n.ch1BrochureBig || 0) > 0 && (m(250, 150, 460, 280, 8), r("#fffdf8", 4), g("PANCAKES", 480, 190, 22, "#b45309", "center", 900), drawCouple(480, 300, 2.2));
      n.ch1Brochure && (n.ch1BrochureBig || 0) <= 0 && n.sqPose === "stand" && (m(n.sq.x + 8, n.sq.y - 64, 16, 20, 2), r("#fffdf8", 1), drawCouple(n.sq.x + 16, n.sq.y - 54, 0.35));
      (n.ch1Step === "family" || n.ch1Step === "gohome") && n.room === "hall" && (drawCh1Alien(360, 560, "hat", ALIEN_ADULT, 1), drawCh1Alien(520, 470, "hair", ALIEN_ADULT, -1));
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
        (n.ch1SuckT = 0),
        (n.ch1ShowBots = !1),
        (n.ch1Prop = ""),
        (n.ch1Paper = ""),
        (n.ch1Hold = ""),
        (n.ch1Heart = !1),
        (n.ch1Brochure = !1),
        (n.ch1BrochureBig = 0),
        (n.ch1Paw = 0),
        (n.ch1Tape = !1),
        (n.ch1Crayon = !1),
        (n.ch1InCrate = !1),
        (n.ch1Crouch = !1),
        (n.ch1Wide = !1),
        (n.ch1Morning = null),
        (n.ch1HomeMorning = null),
        (n.ch1Lunch = null),
        (n.ch1Escape = null),
        (n.ch1Chip = ""));
      if (b === 22 || b === 23) {
        // the home morning (home-morning.js), awake beside the rocket; 23: the lunch goal by the wardrobe (LOOK · calendar)
        ((n.room = "closet"), (n.scene = "QB"), ch1Day2Begin(!0));
        b === 23 && hmBeat() && hmBeat().jump("cal");
      } else if (b >= 25 && b <= 27) {
        // the lunch sneak (lunch-sneak.js): 25 at its start in the hall, 26 in the hallway, 27 behind the counter
        ((n.scene = "QB"), luBeat() && luBeat().jump(["plant", "give", "snack"][b - 25]));
      } else if (b === 33) {
        ((n.room = "hangar"), (n.ch1D = !0), (n.ch1Ship = !0), (n.scene = "QB"), (n.sqPose = "hidden"), (n.sq.x = CH1_PLANT.x), (n.sq.y = CH1_PLANT.y), (n.mo.x = 640), (n.mo.y = 500), (n.ch1ShowBots = !0), (n.ch1Ramp = 1), ch1SetPaper("mouth"));
      } else if (b === 37) {
        ((n.room = "passage"), (n.scene = "QB"), (n.ch1Step = "photos"), (n.ch1Crayon = !0), (n.sq.x = 420), (n.sq.y = 420), (n.mo.x = 520), (n.mo.y = 420));
      } else if (b === 38) {
        ((n.room = "hall"), (n.scene = "Q3"), (n.ch1Brochure = !0), (n.ch1BrochureBig = 8), (n.ch1Heart = !0), (n.ch1Step = "gohome"), (n.sq.x = 400), (n.sq.y = 520), (n.mo.x = 560), (n.mo.y = 510));
      } else if (b === 42) {
        ((n.room = "hangar"), (n.ch1D = !0), (n.ch1Night = !0), (n.scene = "Q4"), (n.ch1LookT = 0.4), (n.sq.x = CH1_BIN.x), (n.sq.y = CH1_BIN.y + 12), // just in front of the bin, not inside its solid
           (n.moPose = "hidden"), ch1SetPaper("paws"));
        n.ch1Zoom = { id: "paw", zoom: 1, paw: { x: 470, y: 320 } };
        n.ch1Step = "mark";
        n.ch1Paw = 1;
        n.ch1Chip = "Squatch: check the order";
      } else if (b === 142) {
        ((n.room = "hangar"),
          (n.ch1D = !0),
          (n.ch1Night = !0),
          (n.scene = "Q4"),
          (n.sqPose = "stand"),
          (n.sq.f = 1),
          (n.sq.x = CH1_VENT.x),
          (n.sq.y = CH1_VENT.y),
          (n.ch1Crouch = !0),
          (n.ch1Wide = !0),
          (n.moPose = "hidden"),
          (n.ch1SuckT = n.T - 0.4),
          (n.ch1Chip = "Squatch: hide by the vent"),
          ch1SetPaper(""));
      } else if (b === 29) {
        ((n.room = "hangar"), (n.ch1D = !0), (n.ch1Ship = !0), (n.scene = "QB"), (n.sq.x = 420), (n.sq.y = 520), (n.mo.x = 520), (n.mo.y = 510), (n.ch1ShowBots = !0), (n.ch1Ramp = 1));
      } else if (b === 43) {
        ((n.room = "hangar"), (n.ch1D = !0), (n.ch1Night = !0), (n.scene = "Q4"), (n.sq.x = 780), (n.sq.y = 520), (n.moPose = "hidden"), (n.ch1Step = "post"), ch1SetPaper("paws"), (n.ch1Paw = 1));
      } else if (b >= 44 && b <= 52) {
        // the escape (escape.js): 44 to 46 from its card, 47 the ball, 48 and 49 the slip, 50 the keypad, 51 the computer, 52 the snacks
        ((n.scene = "QB"), esBeat() && esBeat().jump(b <= 46 ? "start" : ["ball", "grab", "grab", "pad", "computer", "snacks"][b - 47]));
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
