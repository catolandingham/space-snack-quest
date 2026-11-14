// Chapter 1 scene 1 (walkthrough beats 1-3): the start, the song, Mops walking out, the peek. Everything scene 1 runs is here.
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
        (n.ch1Song = !1),
        (n.ch1Search = !1),
        (n.ch1Mini = ""),
        (n.ch1OctChase = !1),
        (n.ch1SureEnd = !1),
        (n.guard = null),
        (n.ch1Raid = null),
        (n.ch1Day2 = !1),
        (n.ch1Zoom = null),
        (n.ch1PadOn = !1),
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
            (n.sqPose === "sit" || n.sqPose === "sleep") && ((n.sqPose = "stand"), (n.sq.y = 540));
            ((n.ctrl = !0), (n.scene = "Q1"), ch1Day1());
          }),
        ]));
    }
    function ch1Day1() {
      J([
        N(() => {
          ((n.ch1Song = !0), (n.ctrl = !0), (n.moPose = "polish"), (n.scene = "Q1"), (n.ch1Chip = "Squatch: sing along with Mops"), chipNow());
        }),
      ]);
    }
    function ch1SingAlong() {
      // In front of the desk, above the bucket. Mops is about 160px wide and Squatch
      // about 124px, so their feet need ~195px between them for a 45px gap.
      // The back lane (y 390) is above the crate, the G box, and the bucket.
      let sqX = 660,
        sqY = 498,
        moX = 460,
        moY = 498,
        lane = 390;
      ((n.ch1Song = !1), (n.ctrl = !1), (n.act = null), (n.sqPose = "stand"), (n.moPose = "stand"));
      J([
        cV((dt) => mV(n.sq, n.sq.x, lane, 190, dt)),
        cV((dt) => mV(n.sq, sqX, lane, 190, dt)),
        cV((dt) => mV(n.sq, sqX, sqY, 190, dt)),
        cV((dt) => mV(n.mo, n.mo.x, lane, 160, dt)),
        cV((dt) => mV(n.mo, moX, lane, 160, dt)),
        cV((dt) => mV(n.mo, moX, moY, 160, dt)),
        N(() => {
          ((n.sq.f = -1), (n.mo.f = 1), (n.sq.moving = !1), (n.mo.moving = !1), (n.sqPose = "sing"));
        }),
        v("sq", "\u266A I'm floating in space! \u266A", "song"),
        N(() => {
          ((n.sqPose = "stand"), (n.moPose = "sway"));
        }),
        v("mops", "\u266A Baaa-aa-aaa! \u266A", "song"),
        N(() => {
          ((n.moPose = "stand"), (n.mo.f = 1), (n.ch1MopsLeave = 1));
        }),
      ]);
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
    function ch1PeekGo() {
      ((n.ch1PeekReady = !1), (n.ch1Chip = ""), (n.ctrl = !1), (n.act = null));
      ch1Go("hall", { who: "sq", scene: "QA" }, ch1SneakHide);
    }
    function ch1MopsLeaveTick(step) {
      if (n.ch1MopsLeave && n.room === "closet" && n.moPose !== "hidden") {
        n.mo.f = 1;
        mV(n.mo, 880, 458, 160, step) &&
          ((n.moPose = "hidden"),
          (n.mo.x = 880),
          (n.mo.y = 458),
          (n.ch1MopsLeave = 0),
          (n.ch1PeekReady = !0),
          (n.ctrl = !0),
          (n.scene = "Q1"),
          (n.ch1Chip = "Squatch: peek out the door"),
          chipNow());
      }
    }
