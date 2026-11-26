// Day 1's evening at home after the party: beat 20 (the TV story), bedtime and the Moon Pie card.
    // Beat 20, the TV story, after "You have me." (both party endings hand over here: src/modules/party-endings.js).
    // Then bedtime, the Moon Pie card, and Day 2.
    function ch1TvEvening() {
      return [
        N(() => {
          ((n.tvOn = !0), (n.ch1Couch = !0), (n.sq.x = 640), (n.sq.y = 545), (n.mo.x = 520), (n.mo.y = 545), (n.sqPose = "stand"), (n.moPose = "stand"));
        }),
        // the old Wookiee picture story, full screen (src/modules/tv-story.js, Brian 2026-11-25)
        ...((window.SSQ && window.SSQ.beat("ch1-tv-story") && window.SSQ.beat("ch1-tv-story").steps()) || []),
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
    function drawCh1Moon() {
      (m(150, 48, 660, 78, 16),
        r("#fffdf8", 4),
        g("You came to me in a Moon Pie crate.", 480, 72, 22, "#1e2430", "center", 800),
        g("You've loved Moon Pies ever since.", 480, 104, 18, "#1e2430", "center", 700));
    }
