// Chapter 1 scene 1 (walkthrough beats 1-3): the start, the song, Mops walking out, the peek. Everything scene 1 runs is here.
    // Where Mops stands in the morning (right of the bucket in the room picture).
    const CH1_MOPS_MORNING = { x: 690, y: 560 };
    // The song is Mops's goodbye: he hums on his way to the door and they sing there.
    // Mops is about 160px wide and Squatch about 124px, so their feet are 200px apart for a 45px gap.
    const CH1_SONG_MOPS = { x: 800, y: 470 },
      CH1_SONG_SQ = { x: 600, y: 470 };
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
        // Morning: Mops has finished cleaning and stands by the bucket. No beard cleaning in scene 1.
        (n.mo.x = CH1_MOPS_MORNING.x),
        (n.mo.y = CH1_MOPS_MORNING.y),
        (n.mo.f = -1),
        (n.mo.moving = !1),
        (n.moPose = "stand"),
        J([
          { k: "card", id: "jupiter", text: "Stormtop Cloud Resort, floating above Jupiter." },
          { k: "card", id: "squatch", text: "This is Squatch. He's a Sasquatch." },
          // Short lines that drive the plot: the party (what he will peek at), that he wants to go, the rule.
          v("mops", "Morning, Squatch."),
          v("mops", "Big party in the hall tonight."),
          v("sq", "Party?"),
          // Mops keeps facing Squatch, so his bubble stays clear of the STAY IN HERE poster.
          v("mops", "Stay in here."),
          N(() => {
            ((n.ctrl = !0), (n.scene = "O1"), chipNow());
          }),
          cV(() => n.scene === "O1" && n.moved > 110 && n.hopOut < 0),
          N(() => {
            ((n.ctrl = !0), (n.scene = "Q1"), ch1Day1());
          }),
        ]));
    }
    function ch1Day1() {
      J([
        N(() => {
          ((n.ch1Song = !0), (n.ctrl = !0), (n.moPose = "stand"), (n.scene = "Q1"), (n.ch1Chip = "Squatch: sing along with Mops"), chipNow());
        }),
      ]);
    }
    // While the sing goal is up, Mops walks to the door and hums there.
    function ch1MopsHumTick(step) {
      if (!n.ch1Song || n.room !== "closet" || n.moPose === "hidden") return;
      n.mo.f = 1;
      if (mV(n.mo, CH1_SONG_MOPS.x, CH1_SONG_MOPS.y, 120, step)) ((n.mo.f = -1), (n.moPose = "sway"));
    }
    function ch1SingAlong() {
      // Squatch goes to Mops at the door. The back lane (y 390) is above the crate, the G box, and the bucket.
      let lane = 390;
      ((n.ch1Song = !1), (n.ctrl = !1), (n.act = null), (n.sqPose = "stand"), (n.moPose = "stand"));
      J([
        cV((dt) => mV(n.mo, CH1_SONG_MOPS.x, CH1_SONG_MOPS.y, 160, dt)),
        cV((dt) => mV(n.sq, n.sq.x, Math.min(n.sq.y, lane), 190, dt)),
        cV((dt) => mV(n.sq, CH1_SONG_SQ.x, lane, 190, dt)),
        cV((dt) => mV(n.sq, CH1_SONG_SQ.x, CH1_SONG_SQ.y, 190, dt)),
        N(() => {
          ((n.sq.f = 1), (n.mo.f = -1), (n.sq.moving = !1), (n.mo.moving = !1), (n.sqPose = "sing"));
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
    // The peek (beat 3): Squatch leans out of his doorway. The hall is already full (nobody pops in),
    // he hears talk from the stage he can't make out, reads the banner, and thinks "Robots?".
    // Then he sneaks to the plant (ch1SneakHide), where Isfred's announcement plays once.
    // He stops in his doorway at the bottom wall, so he is only leaning in, not in the room yet.
    const CH1_PEEK_AT = [470, 628];
    function ch1PeekGo() {
      ((n.ch1PeekReady = !1), (n.ch1Chip = ""), (n.ctrl = !1), (n.act = null), (n.ch1Party = !0), (n.ch1Peeking = !0));
      ch1Go("hall", { who: "sq", scene: "QA", stand: CH1_PEEK_AT }, ch1PeekLook);
    }
    function ch1PeekLook() {
      ((n.ch1Party = !0), (n.scene = "QA"), (n.ctrl = !1), (n.sq.moving = !1));
      J([
        uV(0.6),
        v("official", "Mmf mmf... mm-mmf... mmf!", "whisper"),
        v("sq", "Robots?", "whisper"),
        N(ch1SneakHide),
      ]);
    }
    function ch1MopsLeaveTick(step) {
      if (n.ch1MopsLeave && n.room === "closet" && n.moPose !== "hidden") {
        n.mo.f = 1;
        mV(n.mo, 880, 458, 160, step) &&
          ((n.moPose = "hidden"),
          (n.mo.x = 880),
          (n.mo.y = 458),
          (n.ch1MopsLeave = 0),
          (n.ctrl = !1),
          J([
            { k: "card", id: "later", text: "That evening\u2026" },
            N(() => {
              ((n.ch1PeekReady = !0), (n.ctrl = !0), (n.scene = "Q1"), (n.ch1Chip = "Squatch: peek out the door"), chipNow());
            }),
          ]));
      }
    }
