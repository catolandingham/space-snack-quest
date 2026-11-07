// One capture rule for every chapter (Brian's D1, 2026-11-07): the capture table, capture(), shoo(), "They lost you.", and the checkpoint tables for Chapters 1, 3 and 4.
    // The rule: someone sees Squatch, security comes, and he has time to hide. If he hides, security leaves and
    // "They lost you." shows. If security reaches him, capture() shows the LOCKUP card (who saw him and where),
    // the captor's joke, and the section restarts from its checkpoint with coins and stars kept.
    // A bot that sees Mops shoos him (Brian's D9): his plain lines, then back to his place. No LOCKUP, no stars.
    // Every catch in every chapter goes through capture() or shoo(). tests/capture-rule.mjs checks that.
    // Wording waits for Brian's yes (docs/PHASE-1-LINES-FOR-BRIAN.md rows 8.x, docs/PHASE-3-LINES-FOR-BRIAN.md rows 19.x).
    const CAPTURES = {
      // Chapter 1
      deck: { cause: "A tourist saw Squatch on the deck. Security caught him.", joke: () => kh() },
      vent: { cause: "The vent alarm found Squatch's fur. Security caught him.", joke: () => kh() },
      s6: { cause: "A tourist saw Squatch in the hall. Security caught him.", joke: () => kh() },
      hallbot: { cause: "A bot saw Squatch in the hall. Security caught him.", joke: () => kh() },
      hallvent: { cause: "The vent alarm found Squatch's fur. Security caught him.", joke: () => kh() },
      lure9: { cause: "The bot saw Squatch in the box. Security caught him.", joke: () => kh() },
      lure11: { cause: "The bot saw Squatch behind the plant. Security caught him.", joke: () => kh() },
      // Chapter 2
      pump: { cause: "A pump bot saw Squatch on the lot. Security caught him.", joke: () => [v("bot", "Report him or fuel him?"), v("sq", "Pancakes. Park the nozzle.")] },
      diner: { cause: "Gloop saw Squatch at the counter. Security caught him.", joke: () => [v("gloop", "Counter's closed. Lockup's open."), v("sq", "I'll take it to go.")] },
      blorp: { cause: "Blorp saw Squatch in the diner. Security caught him.", joke: () => [v("gloop", "Counter's closed. Lockup's open."), v("sq", "I'll take it to go.")] },
      sink: { cause: "Gloop saw Squatch at the sink. Security caught him.", joke: () => [v("gloop", "The window caught the sink."), v("sq", "Next time I roll.")] },
      rust: { cause: "Rusty saw Squatch by the pump. Security caught him.", joke: () => [v("rust", "Parked you. Still no coins."), v("sq", "I'll take the pen over the pump.")] },
      lure: {
        cause: "A pump bot saw Squatch in the crate. Security caught him.",
        joke: () => [v("bot2", "WOOKIE?!"), v("mops", "Just a fuzzy mop! Over here! Very fuzzy."), v("bot", "...Back to the pump.")],
      },
      bots3: {
        cause: "A pump bot saw Squatch in the kitchen. Security caught him.",
        joke: () => [v("bot", "WOOKIE?!"), v("gloop", "That's the dish goat, you rust buckets!"), v("bot2", "...Re-scanning.")],
      },
      // Chapter 3
      rover1: {
        cause: "A rover saw Squatch on the pad. Security caught him.",
        joke: () => [v("rover", "A rug with legs? Rugs get ROLLED UP!"), v("sq", "Mmmf! (Rolled all the way back!)", "whisper"), v("rover", "...Resuming patrol.")],
      },
      "rover-s": {
        cause: "A rover saw Squatch in the temple. Security caught him.",
        joke: () => [v("rover", "WOOKIE?!"), v("mops", "Just a fuzzy mop! Very fuzzy."), v("rover2", "...Back to the mirrors.")],
      },
      lure3: {
        cause: "The rover saw Squatch in the barrel. Security caught him.",
        joke: () => [v("rover", "WOOKIE?!"), v("mops", "Just a fuzzy mop! In a barrel. Very fuzzy."), v("rover", "...Back to the ramp.")],
      },
      rover4: {
        cause: "The rover saw Squatch by the ramp. Security caught him.",
        joke: () => [v("rover", "Loose rug! ROLL IT UP!"), v("mops", "That's pretzel packing! Back in the barrel, uh, pretzels.")],
      },
      // Chapter 4
      light4: {
        cause: "The searchlight found Squatch at the dock. Security caught him.",
        joke: () => [
          v("pbot", "WOOKIE?! IN THE LIGHT!"),
          v("sq", "(Searchlight. Back to the van.)", "whisper"),
          v("pbot", "...Must be a big dog. Resuming sweep."),
        ],
      },
      gate4: {
        cause: "The port bot saw Squatch at the dock. Security caught him.",
        joke: () => [
          v("pbot", "Say CHEESE! *FLASH* Proof of a Wookiee!"),
          v("sq", "(They saw me. Van, then the barrels.)", "whisper"),
          v("pbot", "...Photo is blurry. Back to my gate."),
        ],
      },
    };
    // The LOCKUP card's last line, on the card in every chapter.
    const LOCKUP_RESTART = "Holding pen. This section starts over.";
    function lockupCause(by) {
      return (CAPTURES[by] && CAPTURES[by].cause) || "Security caught Squatch.";
    }
    // Counts a catch for the chapter's ghost bonus (no catches = +250). Stars are never taken away.
    function countCatch() {
      let s = n.scene || "";
      s[0] === "G"
        ? ch2.caught++
        : s[0] === "P"
          ? (Q.caught++, Q.miss++)
          : s[0] === "M"
            ? (H.caught++, H.miss++)
            : s === "S1L"
              ? aV.caught++
              : x.caught++;
      x.ghost = !1;
    }
    function stopChases() {
      ((ch2.sec = null), aV.sec && (aV.sec.mode = "caught"));
      FV.on && FV.bot && ((FV.bot.x = FV.hx), (FV.bot.y = FV.hy));
      ((FV.on = !1), (n.sirenT = -9), n.chip === "Hide!" && (n.chip = FV.chip));
    }
    // The one capture: LOCKUP card with the cause, the captor's joke, then the section restarts.
    function capture(by) {
      // Once per catch: nothing new while its card is up or waiting.
      if ((n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail")) return;
      let c = CAPTURES[by];
      ((n.jailBy = by),
        (n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        (n.mo.moving = !1),
        (x.sing = !1),
        stopChases(),
        countCatch(),
        D.caught(),
        Dt("caught", "", by, "caught"),
        J([
          { k: "card", id: "jail", text: "LOCKUP", by, cause: lockupCause(by), restart: LOCKUP_RESTART },
          ...(c ? c.joke() : []),
          N(restartSection),
        ]));
    }
    // A bot sees Mops (Brian's D9): his lines, then back to his place. It counts for the ghost bonus as before.
    function shoo(place, lines) {
      ((n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        (n.mo.moving = !1),
        (x.sing = !1),
        countCatch(),
        D.caught(),
        Dt("shoo", "", "shoo", "shoo"),
        J([
          ...lines,
          N(() => {
            (place(), (n.ctrl = !0));
          }),
        ]));
    }
    // Security left without finding him.
    function lostYou() {
      (roomLine("They lost you."), Dt("safe", "", "They lost you.", "safe"));
    }
    // Restart the current section from its checkpoint; coins, the register, stars and finds are kept.
    function restartSection() {
      let jar = ch2.jar,
        reg = ch2.reg,
        has = ch2.has,
        stars = n.stars,
        found = new Set(n.found);
      (reSec(), (ch2.jar = jar), (ch2.reg = reg), (ch2.has = has), (n.stars = stars), (n.found = found));
    }
    // Security for Chapters 3 and 4 is the same figure as Chapter 2's (see qSec): it walks in from the side.
    function drawSec() {
      let s = ch2.sec;
      if (!s || s.scene !== n.scene || n.room === "gas" || n.room === "hall") return;
      (m(s.x - 16, s.y - 70, 32, 54, 8), r("#3478f6", 3), g("SEC", s.x, s.y - 78, 12, "#ffffff", "center", 900));
    }
    // Checkpoint tables. Chapter 2's is applyG (20-ch2.js). A scene or phase with no entry restarts from the
    // state saved when that scene began (noteSection). Each entry puts the section back the way it starts.
    const CH1_CHECKPOINTS = { S1L: () => Sh(), S6: () => Bh(), S9: () => Fs(), S11: () => Js() };
    const CH3_CHECKPOINTS = {
      p1: () => {
        let o = Q.rov[0];
        ((n.sq.x = 880), (n.sq.y = 560), (n.sqPose = "stand"), (x.spot = -1), o && ((o.x = 600), (o.f = -1), (o.pause = 0), (o.alert = 0)));
      },
      p3: () => {
        x.sing = !1;
        for (let i of Q.rov) ((i.x = i.hx), (i.f = i.hf), (i.look = 0));
        ((n.mo.x = 70), (n.mo.y = 600), (n.sq.x = 60), (n.sq.y = 480), (n.sqPose = "stand"), (x.spot = -1), switchTo("squatch"), n.pulse.add("alcove"));
      },
      p4a: () => {
        let o = Q.rov[0];
        ((x.sing = !1), (n.sqPose = "hidden"), (x.spot = 70), (n.sq.x = OV.x), (n.sq.y = OV.y), o && ((o.x = o.hx), (o.look = 0), (o.f = -1)));
      },
    };
    const CH4_CHECKPOINTS = {
      m1: () => {
        let o = H.bot;
        ((x.sing = !1), (n.sq.x = vo.x), (n.sq.y = vo.y), (n.sqPose = "stand"), (x.spot = -1), o && ((o.x = o.hx), (o.look = 0), (o.f = o.hf)));
      },
    };
