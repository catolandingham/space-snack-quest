// Day 1's evening at home after the party: beat 20 (the TV story), bedtime and the Moon Pie card.
    // Beat 20, the TV story, after "You have me." (both party endings hand over here: src/modules/party-endings.js).
    // Then bedtime, the Moon Pie card, and Day 2.
    function ch1TvEvening() {
      return [
        N(() => {
          ((n.tvOn = !0), (n.ch1Couch = !0), (n.sq.x = 640), (n.sq.y = 545), (n.mo.x = 520), (n.mo.y = 545), (n.sqPose = "stand"), (n.moPose = "stand"));
        }),
        { k: "panel", id: "ch1tv1" },
        { k: "panel", id: "ch1tv2" },
        { k: "panel", id: "ch1tv3" },
        N(() => {
          n.ch1Couch = !1;
        }),
        cV((dt) => mV(n.sq, 205, 470, 160, dt) && mV(n.mo, 380, 460, 160, dt)),
        N(() => {
          ((n.sqPose = "sleep"), (n.sq.x = 205), (n.sq.y = 470), (n.mo.x = 380), (n.mo.y = 460));
        }),
        { k: "panel", id: "ch1moon" },
        N(() => {
          ((n.sqPose = "stand"), (n.moPose = "stand"), ch1Day2Begin());
        }),
      ];
    }
    function drawCh1Tv(id) {
      (m(170, 78, 620, 250, 16), r("#1e2430", 6), m(190, 96, 580, 214, 8), r("#d7ecf5", 0));
      if (id === "ch1tv1") (Re(360, 270, 1.5, { f: 1 }), Re(560, 260, 1.4, { f: -1 }), g("Fur in the scrubber.", 480, 130, 22, "#1e2430", "center", 800));
      if (id === "ch1tv2") (Qt(460, 270, "#f2c1b0", 1.6, 1), g("!", 560, 180, 48, "#e5533d", "center", 900));
      if (id === "ch1tv3") (Qt(340, 270, "#c9b6f2", 1.7, 1), Re(560, 280, 1.3, { f: -1 }), g("Onto the ship.", 480, 130, 22, "#1e2430", "center", 800));
    }
    function drawCh1Moon() {
      (m(150, 48, 660, 78, 16),
        r("#fffdf8", 4),
        g("You came to me in a Moon Pie crate.", 480, 72, 22, "#1e2430", "center", 800),
        g("You've loved Moon Pies ever since.", 480, 104, 18, "#1e2430", "center", 700));
    }
