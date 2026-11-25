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
    // The TV story fills the whole picture, as it did before 2026-11-11 (ba9102d drew it as a small TV over the room).
    // Brian 2026-11-25, on the showing-4 video: "We had the previous design the more fullscreen TV ... we just need
    // to stay with what we had before." Restored word for word from ba9102d^.
    function drawCh1Tv(id) {
      ((e.fillStyle = "#1b2140"), e.fillRect(0, 0, c, b));
      if (id === "ch1tv1") (Re(300, 460, 2.2, { f: 1 }), Re(520, 440, 2, { f: -1 }), g("Fur in the scrubber.", 480, 120, 28, "#ffffff", "center", 800));
      if (id === "ch1tv2") (Qt(420, 460, "#f2c1b0", 2, 1), g("!", 480, 200, 64, "#e5533d", "center", 900));
      if (id === "ch1tv3") (Qt(260, 460, "#c9b6f2", 2.4, 1), Re(560, 480, 1.8, { f: -1 }), g("Onto the ship.", 480, 120, 28, "#ffffff", "center", 800));
    }
    function drawCh1Moon() {
      (m(150, 48, 660, 78, 16),
        r("#fffdf8", 4),
        g("You came to me in a Moon Pie crate.", 480, 72, 22, "#1e2430", "center", 800),
        g("You've loved Moon Pies ever since.", 480, 104, 18, "#1e2430", "center", 700));
    }
