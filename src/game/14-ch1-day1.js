// Day 1's evening at home after the party: beat 20 (the TV story), then beat 21 (the bedtime story).
    // Beat 20, the TV story, after "You have me." (both party endings hand over here: src/modules/party-endings.js).
    // Then beat 21, the bedtime story (src/modules/bedtime-story.js), and Day 2.
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
        // the old crate story at bedtime, ending with Squatch asleep (src/modules/bedtime-story.js)
        ...((window.SSQ && window.SSQ.beat("ch1-bedtime-story") && window.SSQ.beat("ch1-bedtime-story").steps()) || []),
        N(() => {
          ((n.sqPose = "stand"), (n.moPose = "stand"), ch1Day2Begin());
        }),
      ];
    }
