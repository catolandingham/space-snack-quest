// Chapter 1 beats 22-61. Day 1 calls ch1Day2Begin. This file owns the lunch, the night order, the escape, and pickup day.
    // The office code is the one already drawn on the old keypad (4 7 2 3). It is not a new number.
    const CH1_OFFICE_CODE = "4723";
    const CH1_LUNCH_WATCH = [
      { x: 500, y: 420, face: Math.PI / 2 },
      { x: 300, y: 450, face: Math.PI },
    ];
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
    function ch1Day2Begin() {
      ((n.ch1Day2 = !0),
        (n.ch1VentLunch = 0),
        (n.ch1Disguise = !1),
        (n.ch1Party = !1),
        (n.ch1PartyOver = !0),
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
        (n.ch1PadOn = !1),
        (n.ctrl = !1));
      J([N(() => ch1Ready("gift", "Squatch: pick up the gift", "QB"))]);
    }
    function ch1TakeGift() {
      ((n.ctrl = !1), (n.ch1Hold = "gift"), (n.ch1Heart = !0), D.grab());
      J([
        v("sq", "The Guardians came! They always come when I'm scared."),
        N(() => {
          ((n.ch1Heart = !1), ch1Ready("box", "Squatch: put the gift in the box", "QB"));
        }),
      ]);
    }
    function ch1PutBox() {
      ((n.ctrl = !1), (n.ch1Zoom = { id: "box", zoom: 0, paw: { x: 220, y: 560 } }), (n.ch1Step = "dropbox"), (n.ch1Chip = "Squatch: put the gift in the box"), chipNow());
    }
    function ch1DropBox() {
      if (n.ch1Boxed) return;
      ((n.ch1Boxed = !0), (n.ch1Hold = ""), D.hide(), ch1CloseZoom(() => ch1Ready("cal", "Squatch: look at the calendar", "QB")));
    }
    function ch1LookCal() {
      ((n.ctrl = !1), (n.ch1Cal = 1.6));
      J([
        uV(0.7),
        v("sq", "He forgot his lunch!"),
        N(() => ch1Ready("lunch", "Squatch: take the lunch", "QB")),
      ]);
    }
    function ch1TakeLunch() {
      ((n.ch1Hold = "lunch"), (n.ctrl = !1), D.grab());
      ch1GoDay("hall", { who: "sq", scene: "QB", stand: [220, 580] }, () => {
        ((n.ch1Sneak = !0), ch1Ready("sneak", "Squatch: take Mops his lunch", "QB"));
      });
    }
    function ch1ToMops() {
      ((n.ch1Sneak = !1), (n.sqPose = "stand"), (n.ctrl = !1));
      ch1GoDay("passage", { who: "sq", scene: "QB", stand: [240, 510], mo: [500, 510] }, () => ch1Ready("give", "Squatch: give Mops his lunch", "QB"));
    }
    function ch1GiveLunch() {
      ((n.ctrl = !1), (n.ch1Heart = !1));
      J([
        v("mops", "Squatch! You should be hiding."),
        N(() => (n.ch1Heart = !0)),
        v("mops", "My lunch! You're the best."),
        N(() => {
          ((n.ch1Heart = !1),
            (n.ch1Zoom = { id: "eat", zoom: 0, paw: { x: 300, y: 580 } }),
            (n.ch1Step = "feed1"),
            (n.ch1Chip = "Squatch: feed Mops"),
            chipNow());
        }),
      ]);
    }
    function ch1Feed1() {
      if (n.ch1Fed) return;
      ((n.ch1Fed = 1), (n.ch1Step = "feed2"), D.grab());
    }
    function ch1Feed2() {
      if (n.ch1Fed !== 1) return;
      ((n.ch1Fed = 2), (n.ch1Hold = ""), ch1CloseZoom(ch1AfterLunch));
    }
    function ch1AfterLunch() {
      ch1GoDay("hall", { who: "both", scene: "Q3", stand: [720, 520], mo: [780, 510] }, () => {
        ((n.ctrl = !1),
          J([
            v("mops", "I know you, Squatch, you're probably hungry... you know the rule, grab one snack."),
            N(() => ch1Ready("snack", "Squatch: grab one snack", "Q3")),
          ]));
      });
    }
    function ch1TakeOne() {
      ((n.ctrl = !1), (n.ch1Zoom = { id: "one", zoom: 0, paw: { x: 400, y: 580 }, bag: 0 }), (n.ch1Step = "onesnack"));
    }
    function ch1OneDrop() {
      if (n.ch1One) return;
      ((n.ch1One = 1), n.ch1Zoom && (n.ch1Zoom.bag = 1), D.hide(), ch1CloseZoom(ch1ShipCall));
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
      ((n.ctrl = !1), (n.sqPose = "hidden"), (n.sq.x = CH1_PLANT.x), (n.sq.y = CH1_PLANT.y), D.hide(), ch1BayLines());
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
        v("ups", "BEEP BEEP"),
        ch1Step("sq", 180, 510, 220),
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
      ((n.ctrl = !1), (n.sqPose = "hidden"), (n.sq.x = 220), (n.sq.y = 530), D.hide());
      J([
        uV(0.35),
        v("tourist", "We ate at a pancake place on Mars."),
        v("tourist", "Here, a brochure."),
        N(() => {
          ((n.ch1Brochure = !0), (n.ch1BrochureBig = 3.2), (n.sqPose = "stand"));
        }),
        v("sq", "Are those other Sasquatches?", "whisper"),
        v("mops", "I need to get back to work, we'll talk about it tonight."),
        ch1Step("mo", 1120, 520, 180),
        N(() => {
          ((n.moPose = "hidden"), (n.mo.x = 1200), ch1Ready("gohome", "Squatch: go home", "Q3"));
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
    function ch1RestartLunch() {
      ((n.ch1Day2 = !0),
        (n.scene = "QB"),
        (n.room = "hall"),
        (n.ch1D = !1),
        (n.ch1Duct = !1),
        (n.ch1Night = !1),
        (n.ch1Sneak = !0),
        (n.ch1Hold = "lunch"),
        (n.ch1Zoom = null),
        (n.sqPose = "stand"),
        (n.sq.x = 220),
        (n.sq.y = 580),
        (n.moPose = "hidden"),
        (n.q = []),
        (n.cur = null),
        (n.ctrl = !0),
        (n.ch1Step = "sneak"),
        (n.ch1Chip = "Squatch: take Mops his lunch"),
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
        ch1Step("sq", CH1_VENT.x - 36, CH1_VENT.y, 220),
        N(() => {
          ((n.sqPose = "hidden"), (n.sq.x = CH1_VENT.x - 30), (n.sq.y = CH1_VENT.y));
        }),
        N(() => {
          ((n.ch1SuckT = n.T), D.slurp());
        }),
        uV(0.85),
        N(() => {
          ((n.ch1PinkSucked = 1),
            ch1SetPaper("vent"),
            (n.ch1SuckT = 0),
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
      ((n.ch1Night = !1), (n.sqPose = "stand"), (n.ctrl = !1));
      J([{ k: "card", id: "time", text: "Six days later" }, N(ch1ToTease)]);
    }
    function ch1ToTease() {
      ch1GoDay("hall", { who: "both", scene: "QB" }, () => {
        ch1GoDay("passage", { who: "both", scene: "QB" }, () => {
          ch1GoDay("delivery", { who: "both", scene: "QB", night: !1, ship: !1, crew: "tease" }, ch1TeaseLines);
        });
      });
    }
    function ch1TeaseLines() {
      ((n.ctrl = !1), (n.ch1Crew = "tease"));
      J([
        v("ups", "We could wipe the floor with that beard."),
        v("ups", "HQ sent us a message. You're going to be replaced this week anyway."),
        v("mops", "Replaced? The manager was lying to me."),
        N(() =>
          ch1GoDay("passage", { who: "both", scene: "QB" }, () => {
            ch1GoDay("hall", { who: "both", scene: "QB" }, () => {
              ch1GoDay("closet", { who: "both", scene: "QB" }, ch1EscapeHome);
            });
          }),
        ),
      ]);
    }
    function ch1EscapeHome() {
      ((n.ctrl = !1),
        J([
          v("mops", "I'm going to be replaced. The new robots are coming on the ship tomorrow. Remember that pancake place? Let's go find out about it."),
          v("sq", "Oh, it was on the form I sent, I mean, never mind."),
          v("sq", "Didn't a copy get sucked into the vent?", "whisper"),
          N(ch1ToVent),
        ]));
    }
    function ch1ToVent() {
      ((n.ch1Night = !0),
        ch1GoDay("hall", { who: "both", night: !0, scene: "QB" }, () => {
          ch1GoDay("passage", { who: "both", night: !0, scene: "QB" }, () => {
            ch1GoDay("delivery", { who: "both", night: !0, scene: "Q5", stand: [CH1_VENT.x - 30, CH1_VENT.y] }, () =>
              ch1Ready("roll", "Squatch: roll into a ball by the vent", "Q5"),
            );
          });
        }));
    }
    function ch1RollVent() {
      ((n.sqPose = "ball"), (n.ch1DidBall = !0), (n.ctrl = !1), D.hide());
      J([
        uV(0.35),
        N(() => {
          ((n.sqPose = "hidden"), ch1Go("duct", { scene: "Q6", night: !0 }, ch1VentLines));
        }),
      ]);
    }
    function ch1VentLines() {
      ((n.ch1Prop = "desk"), (n.sqPose = "hidden"), (n.scene = "Q6"), (n.ctrl = !1));
      J([
        ch1Step("mo", 520, 440, 140),
        v("sq", "I hope Mops doesn't notice...", "whisper"),
        N(() => (n.ch1Prop = "teeth")),
        N(() => ch1SetPaper("slip")),
        v("mops", "Hurry, hurry, pink slip, got it!"),
        N(() =>
          ch1GoDay("delivery", { who: "both", night: !0, scene: "Q6", stand: [640, 500] }, () => {
            ((n.sqPose = "stand"), ch1SetPaper("slip"), ch1Ready("pink", "Squatch: grab the pink slip", "Q6"));
          }),
        ),
      ]);
    }
    function ch1GrabPinkNow() {
      if (n.ch1GotPink) return;
      ((n.ch1GotPink = !0), (n.ctrl = !1), ch1SetPaper("paw"), (n.ch1Hold = "slip"), D.grab());
      J([v("sq", "Get it before he sees it.", "whisper"), N(ch1ToPad)]);
    }
    function ch1ToPad() {
      ch1GoDay("passage", { who: "both", night: !0, scene: "QP", stand: [480, 520] }, () => {
        ((n.ch1Pad = ""), (n.ch1PadOn = !0), (n.ch1Door = !1), (n.ch1Hold = "slip"), ch1Ready("pad", "Squatch: type the code from the pink slip", "QP"));
      });
    }
    function ch1PadKey(d) {
      if (d === "0") return { x: 480, y: 514 };
      let i = parseInt(d, 10) - 1;
      return { x: 480 + ((i % 3) - 1) * 88, y: 250 + Math.floor(i / 3) * 88 };
    }
    function ch1PadPress(d) {
      if (!n.ch1PadOn) return;
      let have = n.ch1Pad || "";
      if (CH1_OFFICE_CODE[have.length] !== String(d)) {
        ((n.ch1Pad = ""), D.bzzt());
        return;
      }
      ((n.ch1Pad = have + d), D.key());
      if (n.ch1Pad === CH1_OFFICE_CODE) {
        ((n.ch1PadOn = !1), (n.ch1Code = CH1_OFFICE_CODE), (n.ch1Door = !0), D.open(), n.ch1Step === "pad" && ch1OfficeIn());
      }
    }
    function ch1OfficeIn() {
      ((n.ctrl = !1), (n.ch1Door = !0), (n.ch1SiteRoom = "passage"));
      J([
        { k: "panel", id: "ch1site" },
        N(() => ch1Ready("crate", "Squatch: return the empty crate", "Q7")),
      ]);
    }
    function ch1Booked() {
      if (n.ch1Booked) return;
      ((n.ch1Booked = !0), (n.ctrl = !1), (n.ch1Mail = "full"));
      ch1GoDay("hall", { who: "both", night: !0, scene: "Q3", stand: [700, 520] }, ch1AllStart);
    }
    function ch1AllStart() {
      ((n.ctrl = !1),
        J([
          v("mops", "This time, take all the snacks you want."),
          N(() => {
            ((n.ch1Zoom = { id: "all", zoom: 0, paw: { x: 400, y: 580 }, bag: 0 }), (n.ch1Step = "all1"), (n.ch1Chip = "Squatch: take the snacks"), chipNow());
          }),
        ]));
    }
    function ch1AllDrop() {
      if (n.ch1Step !== "all1") return;
      ((n.ch1Step = "all2"), (n.ch1All = 4), n.ch1Zoom && (n.ch1Zoom.bag = 4), D.hide(), (n.ch1Chip = "Squatch: leave food for the Guardians"), chipNow());
    }
    function ch1LeaveFood() {
      if (n.ch1Left) return;
      ((n.ch1Left = !0),
        ch1CloseZoom(() => {
          ((n.ctrl = !1),
            J([
              v("sq", "I'm worried about the Guardians. I'll leave them some food."),
              N(() => ch1GoDay("closet", { who: "both", night: !1, scene: "QB" }, () => ch1Ready("slip", "Squatch: hide the pink slip", "QB"))),
            ]));
        }));
    }
    function ch1HideSlip() {
      if (n.ch1Slipped) return;
      ((n.ch1Slipped = !0), (n.ctrl = !1), (n.ch1Hold = ""), ch1SetPaper("box"), D.hide());
      J([
        cV((dt) => (ch1Trail(), mV(n.sq, 205, 470, 160, dt) && mV(n.mo, 380, 460, 160, dt))),
        N(() => {
          ((n.sqPose = "sleep"), (n.sq.x = 205), (n.sq.y = 470), D.snore());
        }),
        uV(0.7),
        N(() => {
          ((n.sqPose = "stand"), ch1PackStart());
        }),
      ]);
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
      ((n.costumeOn = !0), (n.ctrl = !1));
      J([v("mops", "More bleat. Less roar."), N(ch1LastWalk)]);
    }
    function ch1LastWalk() {
      ((n.ch1Last = !0), (n.ctrl = !1));
      ch1GoDay("hall", { who: "both", scene: "Q9" }, () => {
        (ch1BalloonPopNow(),
          ch1GoDay("passage", { who: "both", scene: "Q9" }, () => ch1Ready("keepsake", "Squatch: go to the ship", "Q9")));
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
          ((n.room = "passage"),
            (n.ch1D = !1),
            (n.ch1Office = !0),
            (n.scene = "Q9"),
            (n.sqPose = "hidden"),
            (n.moPose = "hidden"),
            (n.sq.x = -400),
            (n.mo.x = -400));
        }),
        v("official", "Send in Mops for his Employee of the Month photo."),
        v("robot", "Mops isn't here."),
        v("official", "Not here? He can't live off the station!"),
        v("robot", "He was replaced by the new robot shipment."),
        v("official", "I never ordered a replacement! Get me the security tapes."),
        { k: "card", id: "later", text: "Later that evening..." },
        N(() => (n.ch1Tape = !0)),
        uV(1.1),
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
      s === "dropbox"
        ? ch1DropBox()
        : s === "feed1"
          ? ch1Feed1()
          : s === "feed2"
            ? ch1Feed2()
            : s === "onesnack"
              ? ch1OneDrop()
              : s === "mark"
                ? ch1Mark()
                : s === "all1"
                  ? ch1AllDrop()
                  : s === "all2"
                    ? ch1LeaveFood()
                    : s === "pack1"
                      ? ch1PackBox()
                      : s === "pack2" && ch1PackBucket();
    }
    function ch1ZoomHit(x, y) {
      let s = n.ch1Step;
      if (Math.hypot(x - 880, y - 540) < 42) return !0;
      if (s === "mark") return Math.hypot(x - 470, y - 310) < 80;
      if (s === "feed1" || s === "feed2") return Math.hypot(x - 480, y - 250) < 90;
      if (s === "onesnack" || s === "all1") return x < 210 && y > 450;
      if (s === "all2") return Math.hypot(x - 700, y - 430) < 80;
      if (s === "dropbox" || s === "pack1" || s === "pack2") return Math.hypot(x - 480, y - 330) < 110;
      return !1;
    }
    function ch1Day2Pointer(kind, x, y) {
      if (n.ch1PadOn && (kind === "down" || kind === "up")) {
        for (let d of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
          let k = ch1PadKey(d);
          if (Math.hypot(x - k.x, y - k.y) < 40) {
            kind === "up" && ch1PadPress(d);
            return;
          }
        }
        return;
      }
      let z = n.ch1Zoom;
      if (!z || z.zoom < 1 || n.ch1ZoomClosing) return;
      (kind === "move" || kind === "down") && (z.paw = { x, y });
      kind === "up" && ((z.paw = { x, y }), ch1ZoomHit(x, y) && ch1ZoomAct());
    }
    function ch1ConeHit(px, py, ox, oy, face) {
      let T = px - ox,
        R = py - oy,
        P = Math.hypot(T, R);
      if (P < STAND_FEET) return !0;
      if (P > STAND_CONE_LEN || P < 1) return !1;
      let a = Math.atan2(R, T) - face;
      for (; a > Math.PI; ) a -= 2 * Math.PI;
      for (; a < -Math.PI; ) a += 2 * Math.PI;
      return Math.abs(a) < STAND_CONE_HALF;
    }
    function ch1LunchSee(dt) {
      if (n.sqPose === "hidden") return;
      for (let i = 0; i < CH1_LUNCH_WATCH.length; i++) {
        let gue = CH1_LUNCH_WATCH[i],
          dist = Math.hypot(n.sq.x - gue.x, n.sq.y - gue.y),
          standing = ch1ConeHit(n.sq.x, n.sq.y - 20, gue.x, gue.y - 28, gue.face),
          seen = n.sqPose === "ball" ? ballNotice("lunch" + i, dist, dt || 0, standing) : standing;
        (n.sqPose !== "ball" && ballNotice("lunch" + i, STAND_FEET + 99, 0, !1), seen && capture("s6"));
      }
    }
    function ch1Day2Tick(dt) {
      if (!n.ch1Day2) return;
      (n.ch1Cal || 0) > 0 && (n.ch1Cal -= dt || 0);
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
        n.ch1Step === "sneak" && n.room === "hall" && n.ctrl && !z && ch1LunchSee(dt));
    }
    function ch1Day2Spots() {
      if (!n.ch1Day2 || !n.ctrl || n.ch1PadOn) return [];
      let s = n.ch1Step;
      if (s === "sneak" && n.sqPose === "ball") return [ch1At("SNEAK", "hallway", 860, 560, 110, ch1ToMops)];
      if (n.sqPose === "hidden" || n.sqPose === "ball" || n.sqPose === "sleep") return [];
      if (s === "gift") return [ch1At("TAKE", "gift", 340, 520, 100, ch1TakeGift)];
      if (s === "box") return [ch1At("PUT", "box", 350, 520, 110, ch1PutBox)];
      if (s === "dropbox") return [ch1At("DROP", "box", n.sq.x || 350, n.sq.y || 520, 240, ch1DropBox)];
      if (s === "cal") return [ch1At("LOOK", "calendar", 140, 510, 110, ch1LookCal)];
      if (s === "lunch") return [ch1At("TAKE", "lunch", 500, 520, 100, ch1TakeLunch)];
      if (s === "sneak") return [ch1At("SNEAK", "hallway", 860, 560, 110, ch1ToMops), ch1At("ROLL", "ball", 220, 580, 70, () => (n.sqPose = "ball"))];
      if (s === "give") return [ch1At("GIVE", "lunch", 500, 510, 130, ch1GiveLunch)];
      if (s === "feed1") return [ch1At("FEED", "lunch", n.sq.x || 240, n.sq.y || 510, 280, ch1Feed1)];
      if (s === "feed2") return [ch1At("FEED", "bag", n.sq.x || 240, n.sq.y || 510, 280, ch1Feed2)];
      if (s === "snack") return [ch1At("TAKE", "snack", 760, 530, 120, ch1TakeOne)];
      if (s === "onesnack") return [ch1At("DROP", "snack", n.sq.x || 740, n.sq.y || 520, 280, ch1OneDrop)];
      if (s === "hide") return [ch1At("HIDE", "plant", CH1_PLANT.x, CH1_PLANT.y, 130, ch1HideBay)];
      if (s === "photos") return [ch1At("GO", "hall", 140, 510, 110, ch1LeavePhotos), ch1At("LOOK", "photos", 480, 430, 90, ch1LookPhotos)];
      if (s === "family") return [ch1At("HIDE", "plant", 220, 530, 120, ch1HideFamily)];
      if (s === "gohome") return [ch1At("GO", "home", 480, 590, 120, ch1GoHome)];
      if (s === "grab") return [ch1At("GRAB", "copies", CH1_BIN.x, CH1_BIN.y, 110, ch1GrabCopies)];
      if (s === "mark") return [ch1At("MARK", "order", CH1_BIN.x, CH1_BIN.y, 170, ch1Mark)];
      if (s === "post") return [ch1At("POST", "mailbox", CH1_MAIL.x, CH1_MAIL.y, 110, ch1PostYellow)];
      if (s === "out") return [ch1At("GO", "door", 90, 540, 120, ch1OutHome)];
      if (s === "roll") return [ch1At("ROLL", "ball", CH1_VENT.x, CH1_VENT.y, 140, ch1RollVent)];
      if (s === "pink") return [ch1At("GRAB", "pink slip", 640, 500, 150, ch1GrabPinkNow)];
      if (s === "crate") return [ch1At("RETURN", "empty crate", 480, 500, 170, ch1Booked)];
      if (s === "all1") return [ch1At("DROP", "snacks", n.sq.x || 700, n.sq.y || 520, 280, ch1AllDrop)];
      if (s === "all2") return [ch1At("LEAVE", "food", n.sq.x || 700, n.sq.y || 520, 280, ch1LeaveFood)];
      if (s === "slip") return [ch1At("PUT", "slip", 350, 520, 130, ch1HideSlip)];
      if (s === "pack1") return [ch1At("PACK", "box", n.sq.x || 420, n.sq.y || 520, 280, ch1PackBox)];
      if (s === "pack2") return [ch1At("PACK", "bucket", n.sq.x || 420, n.sq.y || 520, 280, ch1PackBucket)];
      if (s === "jacket") return [ch1At("PUT ON", "jacket", 160, 510, 170, ch1Jacket)];
      if (s === "keepsake") {
        let out = [ch1At("GO", "ship", 860, 510, 110, ch1ToScanner)];
        n.ch1Keepsake || out.push(ch1At("TAKE", "drawing", 480, 450, 80, ch1TakeDrawing));
        return out;
      }
      if (s === "board") return [ch1At("BOARD", "scanner", 480, 500, 170, ch1Leave)];
      return [];
    }
    function drawSlip(x, y, color, w, h) {
      (m(x, y, w || 28, h || 36, 3), r(color, 2));
    }
    function drawPawArm(paw) {
      let p = paw || { x: 480, y: 580 };
      (C([p.x, 660, p.x, p.y], "#6b3a1c", 18), F(p.x, p.y, 22, "#6b3a1c"), F(p.x - 10, p.y - 8, 7, "#c4a484"), F(p.x + 8, p.y - 6, 6, "#c4a484"));
    }
    function drawZoomX() {
      (L(880, 540, 32), r("#ffffff", 4), g("X", 880, 540, 28, "#1e2430", "center", 900));
    }
    function drawCouple(x, y, s) {
      (e.save(), e.translate(x, y), e.scale(s || 1, s || 1));
      (F(-28, -10, 26, "#8b5a3c"), F(28, -6, 24, "#a56b45"), F(-28, -28, 8, "#6b3a1c"), F(28, -24, 7, "#6b3a1c"));
      (F(-34, -16, 3, "#fff"), F(-22, -16, 3, "#fff"), F(22, -12, 3, "#fff"), F(34, -12, 3, "#fff"));
      (m(-18, 8, 70, 16, 3), r("#fffdf8", 2), e.restore());
    }
    function drawCh1Passage() {
      ((e.fillStyle = "#f3efe6"), e.fillRect(0, 0, c, b), m(28, 18, 904, 604, 18), r("#f7f4ee", 7));
      ((e.fillStyle = "#f4f1ea"), e.fillRect(40, 28, 880, 250), (e.fillStyle = "#ebe4d6"), e.fillRect(40, 278, 880, 328), C([40, 278, 900, 278], "#c8c2b6", 4));
      ((e.fillStyle = "#d5e4ea"), e.fillRect(0, 300, 36, 180), (e.fillStyle = "#d5e4ea"), e.fillRect(924, 300, 36, 180));
      g("EMPLOYEE OF THE MONTH", 480, 70, 16, "#1e2430", "center", 900);
      for (let i = 0; i < 5; i++) {
        let x = 250 + i * 78,
          tilt = i === 3 ? -0.18 : 0;
        (e.save(), e.translate(x, 150), e.rotate(tilt), m(-28, -36, 56, 70, 3), r(i === 3 && n.ch1Crayon ? "#fff4c2" : "#1e2430", 3));
        i === 3 && n.ch1Crayon && !n.ch1Keepsake && (g("ME", 0, -8, 10, "#1e2430", "center", 800), g("MOPS", 0, 10, 10, "#1e2430", "center", 800));
        e.restore();
      }
      n.ch1Crayon && !n.ch1Keepsake && g("TIED TOGETHER FOREVER", 480, 210, 14, "#1e2430", "center", 900);
      (m(430, 500, 100, 70, 6), r(n.ch1Door ? "#c4b49a" : "#8a7560", 4), g(n.ch1Door ? "" : "", 480, 530, 12, "#fff", "center", 800));
      n.ch1Door && (m(455, 470, 50, 36, 3), r("#9fd4c8", 2), g("MOON PIES", 480, 488, 8, "#1e2430", "center", 800));
      n.ch1Office
        ? (Qt(220, 470, "#c9b6f2", 2.6, 0.3), dq(380, 490, !1), n.ch1Tape && (m(520, 360, 200, 120, 6), r("#1e2430", 4), g("REC", 560, 390, 16, "#e5533d", "center", 900), Re(640, 450, 0.7, { f: 1, jacket: !0, goatBeard: !0, horns: !0 })))
        : (n.moPose !== "hidden" && Fe(n.mo.x, n.mo.y, he * 1.15, { f: n.mo.f || 1, walk: n.mo.moving ? n.mo.walk : 0, mop: !1 }),
          n.sqPose === "ball" && drawL2Ball(n.sq.x, n.sq.y - 16),
          n.sqPose === "hidden" && ga(n.sq.x, n.sq.y - 40),
          n.sqPose !== "hidden" &&
            n.sqPose !== "ball" &&
            Re(n.sq.x, n.sq.y, he, { f: n.sq.f || 1, walk: n.sq.moving ? n.sq.walk : 0, jacket: !!n.costumeOn, goatBeard: !!n.costumeOn, horns: !!n.costumeOn }));
    }
    function drawCh1Zoom() {
      let z = n.ch1Zoom;
      if (!z) return;
      ((e.fillStyle = "rgba(12,16,28,.42)"), e.fillRect(0, 0, c, b));
      let id = z.id;
      if (id === "paw") {
        (drawSlip(300, 180, "#ffe08a", 70, 90), drawSlip(340, 150, "#ff8fb8", 220, 280), g("ORDER MORE ROBOTS", 450, 230, 18, "#1e2430", "center", 900));
        (m(430, 270, 80, 80, 6), r("#ffffff", 3), n.ch1Paw && (F(470, 310, 18, "#6b3a1c"), F(300 + 40, 180 + 50, 10, "#6b3a1c")));
        g(CH1_OFFICE_CODE, 450, 390, 22, "#1e2430", "center", 900);
      } else if (id === "eat") {
        (Fe(480, 360, 2.4, { f: 1, walk: 0, mop: !1 }), m(300, 400, 360, 24, 6), r("#d7c4a3", 3));
        n.ch1Fed < 1 && (m(560, 300, 40, 50, 4), r("#cdbb98", 2));
        n.ch1Fed === 1 && (m(560, 320, 36, 28, 3), r("#fffdf8", 2));
        n.ch1Fed && F(500, 300, 3, "#c4a484");
      } else if (id === "one" || id === "all") {
        for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - row; i++) F(430 + i * 26 - row * 6, 180 + row * 40, 12, "#ffcf33");
        (m(36, 470, z.bag ? 150 : 54, z.bag ? 110 : 44, 8), r("#fffdf8", 3), g(String(z.bag || 0), 70, 520, 20, "#1e2430", "center", 900));
        id === "all" && (L(700, 430, 36), r("#fffdf8", 3), F(700, 420, 8, "#e5533d"));
        Fe(180, 220, 1.4, { f: 1, walk: 0, mop: !1 });
      } else if (id === "box") {
        (m(360, 220, 240, 180, 10), r("#3478f6", 5), g("MY GARDIANS", 480, 300, 26, "#ffffff", "center", 900));
        n.ch1Hold === "gift" && (m(180, 200, 70, 90, 4), r("#fff4c2", 2), g("Rule #1", 215, 230, 14, "#1e2430", "center", 800), g("Brave Sasquatches stay hidden.", 215, 260, 9, "#1e2430", "center", 700));
      } else if (id === "pack") {
        (m(360, 240, 240, 160, 8), r("#d7c4a3", 4), g("MOON PIES", 480, 280, 18, "#1e2430", "center", 900));
        n.ch1Packed && (m(430, 300, 80, 50, 4), r("#3478f6", 3), g("MY GARDIANS", 470, 326, 10, "#fff", "center", 800), drawSlip(448, 312, "#ff8fb8", 22, 18));
        n.ch1Packed === 2 && (L(560, 250, 22), r("#8a93a3", 3));
      }
      (drawPawArm(z.paw), drawZoomX(), z.zoom < 1 && (e.globalAlpha = Math.max(0.35, z.zoom)));
    }
    function drawCh1Day2() {
      if (n.ch1Step === "sneak" && n.room === "hall")
        for (let gue of CH1_LUNCH_WATCH) {
          (seenCone(gue.x, gue.y - 28, gue.face, STAND_CONE_HALF, STAND_CONE_LEN, "rgba(255,234,120,.55)", "rgba(160,100,10,.95)"),
            e.beginPath(),
            e.arc(gue.x, gue.y, STAND_FEET, 0, 7),
            (e.strokeStyle = "rgba(160,100,10,.9)"),
            (e.lineWidth = 2),
            e.stroke(),
            Qt(gue.x, gue.y, "#7ad0c8", 2.2, gue.face > 2 ? -1 : 1));
        }
      n.room === "closet" && (n.ch1Cal || 0) > 0 && (e.beginPath(), e.arc(179, 214, 28 + Math.sin(n.T * 8) * 2, 0, 7), (e.strokeStyle = "#e5533d"), (e.lineWidth = 4), e.stroke());
      n.ch1Hold === "gift" && n.sqPose === "stand" && (m(n.sq.x + 16, n.sq.y - 78, 36, 28, 3), r("#e5533d", 2), m(n.sq.x + 18, n.sq.y - 110, 44, 30, 2), r("#fff4c2", 2), g("Rule #1", n.sq.x + 40, n.sq.y - 96, 8, "#1e2430", "center", 700));
      n.ch1Hold === "lunch" && n.sqPose === "stand" && (m(n.sq.x + 10, n.sq.y - 70, 22, 28, 3), r("#cdbb98", 2));
      if (n.ch1Paper === "bite" || n.ch1Paper === "mouth") (drawSlip(n.mo.x - 8, n.mo.y - 86, "#ff8fb8", 22, 28), drawSlip(n.mo.x + 8, n.mo.y - 80, "#ffe08a", 14, 18));
      n.ch1Paper === "slip" && drawSlip(n.mo.x - 6, n.mo.y - 84, "#ff8fb8", 18, 24);
      n.ch1Paper === "bin" && (drawSlip(236, 470, "#ff8fb8", 20, 26), drawSlip(252, 476, "#ffe08a", 12, 16));
      n.ch1Paper === "paws" && n.sqPose === "stand" && (drawSlip(n.sq.x + 12, n.sq.y - 70, "#ff8fb8", 18, 24), !n.ch1Mailed && drawSlip(n.sq.x + 24, n.sq.y - 64, "#ffe08a", 12, 16));
      (n.ch1Paper === "pink" || n.ch1Paper === "paw" || n.ch1Hold === "slip") && n.sqPose === "stand" && drawSlip(n.sq.x + 14, n.sq.y - 72, "#ff8fb8", 18, 24);
      n.ch1Paper === "box" && n.room === "closet" && drawSlip(332, 470, "#ff8fb8", 16, 20);
      if (n.ch1SuckT) {
        let t = Math.min(1, (n.T - n.ch1SuckT) / 0.7);
        drawSlip(n.sq.x + (CH1_VENT.x - n.sq.x) * t, n.sq.y - 60 + (CH1_VENT.y - 40 - (n.sq.y - 60)) * t, "#ff8fb8", 26, 34);
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
      (n.ch1Step === "family" || n.ch1Step === "gohome") && n.room === "hall" && (Qt(560, 500, "#e8a87c", 2.3, 1), Qt(680, 510, "#ff8a3d", 2.2, -1));
      n.room === "duct" &&
        (m(560, 180, 280, 150, 6),
        r("#fffdf8", 3),
        g("MARS LOST & FOUND", 700, 210, 16, "#1e2430", "center", 900),
        g("Re: a lost baby Sasquatch.", 700, 238, 12, "#1e2430", "center", 800),
        g("We have NO record of any lost baby.", 700, 262, 12, "#1e2430", "center", 800),
        g("There are NO Sasquatches on Mars.", 700, 286, 12, "#1e2430", "center", 800),
        g("NO", 760, 250, 42, "#e5533d", "center", 900),
        g("We know you're thinking about going to Mars.", 430, 360, 11, "#1e2430", "center", 800),
        g("Don't worry, we'll always be with you.", 430, 378, 11, "#1e2430", "center", 800));
      n.ch1PadOn &&
        ((e.fillStyle = "rgba(12,16,28,.45)"),
        e.fillRect(0, 0, c, b),
        m(250, 150, 460, 420, 16),
        r("#59657d", 5),
        m(300, 170, 360, 54, 6),
        r("#1e2430", 3),
        g(n.ch1Pad || "—", 480, 198, 28, "#2bc48a", "center", 900),
        drawSlip(80, 200, "#ff8fb8", 120, 150),
        g(CH1_OFFICE_CODE, 140, 270, 28, "#1e2430", "center", 900),
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].forEach((d) => {
          let k = ch1PadKey(d);
          (L(k.x, k.y, 32), r("#fffdf8", 3), g(d, k.x, k.y, 24, "#1e2430", "center", 900));
        }));
      n.room === "hangar" &&
        n.ch1Ship &&
        n.scene === "Q9" &&
        (C([400, 180, 400, 430], "#3478f6", 8), C([560, 180, 560, 430], "#3478f6", 8), C([400, 180, 560, 180], "#3478f6", 8));
      n.ch1Left && n.room === "hall" && (F(790, 500, 8, "#ffcf33"), F(806, 506, 6, "#e5533d"));
    }
