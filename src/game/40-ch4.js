// Chapter 4, Mars (scenes M0 to M5): spots, state, hotspots, scenes, the final score, and shared helpers for the people on screen.
    let xf = [
        { x: 200, y: 520 },
        { x: 470, y: 545 },
        { x: 740, y: 520 },
      ],
      vo = { x: 80, y: 520 },
      P0 = { x: 900, y: 500 },
      ia = { x: 330, y: 440 },
      Ea = { x: 250, y: 540 },
      In = { x: 430, y: 440 },
      Hl = { x: 800, y: 440 },
      Qa = { x: 610, y: 440 },
      Tt = { x: 640, y: 470 },
      Kn = { x: 380, y: 540 },
      Ya = { x: 220, y: 450 },
      A6 = { x: 900, y: 560 },
      vf = { x: 260, y: 440 },
      To = { x: 70, y: 560 },
      H = {
        flash: 0,
        phase: "",
        caught: 0,
        start: 0,
        miss: 0,
        lt: 0,
        bot: null,
        sock: !1,
        pine: !1,
        scrub: 0,
        gone: !1,
        beam: -1,
        hug: 0,
        dance: 0,
        mom: !1,
        dad: !1,
        momX: 610,
        dadX: 700,
        slip: !1,
        box: !1,
        follow: !1,
        met: !1,
        wook: !1,
        best: 0,
      };
    function g6() {
      Object.assign(H, {
        phase: "",
        caught: 0,
        start: n.stars,
        miss: 0,
        lt: 0,
        bot: null,
        sock: !1,
        pine: !1,
        scrub: 0,
        gone: !1,
        beam: -1,
        hug: 0,
        dance: 0,
        mom: !1,
        dad: !1,
        momX: 610,
        dadX: 700,
        slip: !1,
        box: !1,
        follow: !1,
        met: !1,
        wook: !1,
      });
    }
    function d2() {
      if (H.follow)
        return [
          { x: n.sq.x - 8, y: n.sq.y - 4 },
          { x: n.sq.x + 8, y: n.sq.y + 4 },
        ];
      let l = H.lt;
      return [
        { x: 330 + 100 * Math.sin(l * 0.8), y: 530 + 40 * Math.sin(l * 0.7) },
        { x: 640 + 140 * Math.sin(l * 1.3 + 1), y: 530 + 40 * Math.sin(l * 0.9 + 1) },
      ];
    }
    function y2(l, o) {
      for (let i of d2()) if (((l - i.x) / 62) ** 2 + ((o - i.y) / 34) ** 2 < 1) return !0;
      return !1;
    }
    function x6(l) {
      n.holdLights || (H.lt += l);
      let o = H.bot;
      if (
        !o ||
        (x.sing && n.sqPose === "hidden" && x.spot === 91
          ? ((o.look = 4), (o.f = -1), (o.x = Math.max(xf[1].x + 90, o.x - 70 * l)))
          : o.look > 0
            ? (o.look -= l)
            : Math.abs(o.x - o.hx) > 1
              ? ((o.f = 1), (o.x = Math.min(o.hx, o.x + 50 * l)))
              : (o.f = o.hf),
        !n.ctrl || x.mops)
      )
        return;
      let s = n.sq;
      if (n.sqPose !== "hidden") {
        if (s.x > P0.x - 40) {
          M6();
          return;
        }
        // Seen: security comes (the one capture rule, 25-capture.js).
        if (ch2.sec) return;
        if (y2(s.x, s.y)) {
          sSec("light4");
          return;
        }
        if (o.look <= 0) {
          let d = go(o);
          ballOrStand("gate", Math.hypot(s.x - d.ox, s.y - d.oy), l, vt(s.x, s.y - 40, d.ox, d.oy, d.a, 0.55, 220)) &&
            (bf(o.x, o.y, "pbot"), (H.flash = 1), sSec("gate4"));
        }
      }
    }
    function v6(l) {
      if (((H.lt += l), !n.ctrl)) return;
      let o = n.sq;
      if (!H.wook && o.x > 200) {
        ((H.wook = !0),
          (H.follow = !0),
          D.alarm(),
          TV([
            v("pbot", "WOOKIE?!"),
            v("mops", "He's with me."),
            v("pbot", "...Do you need help?"),
            v("mops", "No thanks. We're getting my goat."),
          ]));
        return;
      }
      !H.met && o.x > n.mo.x - 120 && z6();
    }
    function T6(l) {
      (de() ||
        (H.phase === "m1" && (x6(l), qSec(l)),
        H.phase === "m5" && v6(l),
        (H.phase === "m4a" || H.phase === "m4") && H.beam >= 0 && ((H.beam += l), H.beam > 3.2 && (H.beam = H.phase === "m4a" ? 0 : -1))),
        H.phase === "m5" && n.ctrl && !H.met && (n.mo.f = 1),
        n.ctrl && (n.act = S6()));
    }
    // The goal chip for Chapter 4: one table, read every frame from the phase and who is in control.
    // Every line names who acts. The first time a mechanic appears the chip names the step; after that it
    // names only the goal (the chip rule, docs/PHASE-1-LINES-FOR-BRIAN.md). Wording waits for Brian's yes
    // (docs/PHASE-2-LINES-FOR-BRIAN.md). A key with no line shows no new chip.
    const CH4_CHIPS = {
      m1: "Squatch: sneak to the gate",
      "m1:sing": "Squatch: sneak to the gate",
      "m1:run": "Squatch: run to the gate",
      m2: "Mops: read the poster on the stand",
      "m2:knock": "Mops: knock on the door",
      m2h: "Squatch: hug Mom and Dad",
      m3: "Mops: mop the van floor",
      "m3:seat": "Mops: look under the seat",
      m4a: "Squatch: hide from the searchlight",
      m4b: "Squatch: go out to the van",
      m4v: "Squatch: look under the seat",
      m5: "Squatch: go get Mops",
      m5d: "Squatch: dance with Mops",
    };
    function ch4ChipKey() {
      let l = H.phase || "",
        o = H.bot;
      return l === "m1"
        ? x.sing
          ? "m1:sing"
          : o && o.look > 0
            ? "m1:run"
            : "m1"
        : l === "m2"
          ? n.found.has("poster4")
            ? "m2:knock"
            : "m2"
          : l === "m3"
            ? H.gone
              ? ""
              : H.scrub >= 3
                ? "m3:seat"
                : "m3"
            : l;
    }
    // Chapter 4's spots, in the order the picker tries them (see spot in 00-core.js).
    function ch4Spots() {
      let l = n.sq,
        i = H.phase,
        port1 = n.room === "port" && i === "m1" && !x.mops,
        stand = n.room === "stand" && i === "m2" && x.mops,
        van = n.room === "van" && i === "m3" && x.mops,
        inside = n.room === "inside" && (i === "m4a" || i === "m4b") && !x.mops,
        sing = (l, o, i) =>
          spot({
            id: "sing",
            verb: x.sing ? "STOP" : "SING",
            cap: x.sing ? "singing" : "song",
            who: "sq",
            at: [l.x, l.y - o],
            when: i,
            hot: !x.sing,
            f: x.sing
              ? () => {
                  x.sing = !1;
                }
              : () => {
                  ((x.sing = !0), D.snore());
                },
          });
      return [
        ...xf.map((q, s) =>
          spot({
            id: s === 0 ? "can" : "can" + s,
            verb: "HIDE",
            cap: "trash can",
            who: "sq",
            x: q.x,
            y: q.y,
            r: 70,
            at: [q.x, q.y - 100],
            when: port1 && n.sqPose !== "hidden",
            hot: s === 0 && n.pulse.has("can"),
            f: () => {
              (dn(q.x, q.y, 90 + s), n.pulse.delete("can"));
            },
          }),
        ),
        sing(xf[1], 110, port1 && n.sqPose === "hidden" && x.spot === 91),
        spot({
          id: "sock",
          verb: "LIFT",
          cap: "sock",
          who: "sq",
          x: ia.x,
          y: ia.y,
          r: 70,
          at: [ia.x, 320],
          when: port1 && !H.sock && n.sqPose !== "hidden",
          f: () => {
            ((H.sock = !0), ee("funny", "sock", ia.x, 320), TV([v("sq", "One sock. Size... ENORMOUS. Not mine. Probably.", "whisper")]));
          },
        }),
        sing(l, 150, n.room === "port" && i === "m5"),
        spot({ id: "dance", verb: "DANCE", cap: "with Mops", who: "sq", at: [l.x, l.y - 150], when: n.room === "port" && i === "m5d", hot: !0, f: D6 }),
        spot({
          id: "poster",
          verb: "READ",
          cap: "poster",
          who: "mo",
          x: In.x,
          y: In.y + 60,
          r: 90,
          at: [In.x, 300],
          when: stand && !n.found.has("poster4"),
          hot: !0,
          f: () => {
            (n.found.add("poster4"),
              n.pulse.delete("poster"),
              n.pulse.add("sdoor"),
              TV([
                { k: "panel", id: "poster4" },
                v("mops", "...Lost in a " + (window.SSQ && window.SSQ.snack ? window.SSQ.snack("name") : "snack") + " shipment."),
                v("mops", "Your crib was a " + (window.SSQ && window.SSQ.snack ? window.SSQ.snack("name") : "snack") + " crate.", "whisper"),
                v("sq", "...That's ME?", "whisper"),
              ]));
          },
        }),
        spot({
          id: "menu",
          verb: "FLIP",
          cap: "menu",
          who: "mo",
          x: Hl.x,
          y: Hl.y + 60,
          r: 90,
          at: [Hl.x, 300],
          when: stand && !n.found.has("menu"),
          f: () => {
            (ee("secret", "menu", Hl.x, 300), TV([{ k: "panel", id: "menu4" }, v("mops", "Every year. Just in case.")]));
          },
        }),
        spot({ id: "sdoor", verb: "KNOCK", cap: "door", who: "mo", x: Qa.x, y: Qa.y + 60, r: 90, at: [Qa.x, 280], when: stand && n.found.has("poster4"), hot: !0, f: E6 }),
        spot({ id: "hug", verb: "HUG!", cap: "Mom and Dad", who: "sq", at: [l.x, l.y - 160], when: n.room === "stand" && i === "m2h", hot: !0, f: k6 }),
        spot({
          id: "vmop",
          verb: "MOP",
          cap: "floor",
          who: "mo",
          x: Kn.x,
          y: Kn.y,
          r: 90,
          at: [Kn.x, Kn.y - 120],
          when: van && H.scrub < 3,
          hot: !0,
          f: () => {
            (H.scrub++, D.splash(), H.scrub >= 3 && (n.pulse.delete("vmop"), n.pulse.add("seat"), TV([v("mops", "Old habits.")])));
          },
        }),
        spot({
          id: "pine",
          verb: "FLIP",
          cap: "air freshener",
          who: "mo",
          x: Ya.x,
          y: Ya.y,
          r: 80,
          at: [Ya.x, 280],
          when: van && !H.pine,
          f: () => {
            ((H.pine = !0), ee("funny", "pine", Ya.x, 280), TV([v("mops", '"Pine-ish." Smells like raccoon.')]));
          },
        }),
        spot({ id: "seat", verb: "LOOK", cap: "under the seat", who: "mo", x: Tt.x, y: Tt.y + 60, r: 100, at: [Tt.x, 330], when: van && H.scrub >= 3 && !H.slip, hot: !0, f: O6 }),
        spot({ id: "roll", verb: "ROLL", cap: "ball", who: "sq", at: [l.x, l.y - 150], when: inside && i === "m4a" && H.beam >= 0 && H.beam < 2.4, hot: !0, f: w6 }),
        spot({
          id: "photo",
          verb: "LOOK",
          cap: "photo",
          who: "sq",
          x: vf.x,
          y: vf.y + 60,
          r: 90,
          at: [vf.x, 300],
          when: inside && !n.found.has("photo"),
          f: () => {
            (ee("secret", "photo", vf.x, 300), TV([{ k: "panel", id: "photo4" }, v("sq", "They saved me a spot.", "whisper")]));
          },
        }),
        spot({ id: "iexit", verb: "EXIT", cap: "door", who: "sq", x: To.x, y: To.y, r: 90, at: [To.x + 20, 420], when: inside && i === "m4b", hot: !0, f: N6 }),
        spot({ id: "seat", verb: "GRAB", cap: "Guardian Box", who: "sq", x: Tt.x, y: Tt.y + 60, r: 100, at: [Tt.x, 330], when: n.room === "van" && i === "m4v" && !x.mops && !H.box, hot: !0, f: R6 }),
      ];
    }
    function S6() {
      return pick(ch4Spots());
    }
    function nq() {
      ((Ao = !1),
        Ml(4),
        g6(),
        (Q.zip = !1),
        (Q.rov = []),
        (pa.bot = "Security"),
        (n.fbPic = ""),
        (n.scene = "M0"),
        (n.room = "port"),
        (n.live = []),
        switchTo("squatch"),
        (x.spot = -1),
        (x.sing = !1),
        (x.costume = !1),
        n.pulse.clear(),
        (n.ctrl = !1),
        (B.nextBeat = "End"),
        (n.sq = { x: vo.x, y: vo.y, f: 1, walk: 0, moving: !1 }),
        (n.mo = { x: 140, y: 590, f: 1, walk: 0, moving: !1 }),
        (n.sqPose = "stand"),
        (n.moPose = "stand"),
        (H.bot = { x: 860, y: 500, hx: 860, hf: -1, f: -1, look: 0, pause: 0, alert: 0 }),
        J([
          { k: "card", id: "ch4", text: "Chapter 4 \xB7 Mars" },
          v("zip", "Mars dock! Pancake stand's past the gate. Tuesdays. Three dozen."),
          v("mops", "Home doesn't mean safe. Locals are scared of a Squatch. Troopers and searchlights lock you up."),
          v("mops", "I'll walk on ahead. Nobody looks twice at a goat."),
          v("sq", "Trash cans. I'll use them on purpose."),
          cV((l) => mV(n.mo, 1010, 590, 200, l)),
          N(() => {
            ((n.moPose = "hidden"), (n.scene = "M1"), (H.phase = "m1"), n.pulse.add("can"), chipNow(), (n.ctrl = !0));
          }),
        ]));
    }
    function M6() {
      ((n.ctrl = !1), (n.act = null), (x.sing = !1), H.miss === 0 && Ta("sneak-m1"), J([He(n.sq, 1e3, P0.y, 170), B2(), N(b2)]));
    }
    function b2() {
      ((n.scene = "M2"),
        (n.room = "stand"),
        (H.phase = "m2i"),
        (H.miss = 0),
        (x.sing = !1),
        n.pulse.clear(),
        (n.live = []),
        (n.sq = { x: -40, y: 540, f: 1, walk: 0, moving: !1 }),
        (n.sqPose = "stand"),
        (n.mo = { x: 360, y: 560, f: -1, walk: 0, moving: !1 }),
        (n.moPose = "stand"),
        J([
          He(n.sq, Ea.x, Ea.y, 170),
          N(() => {
            dn(Ea.x, Ea.y, 95);
          }),
          v("mops", "Stay behind the crate, kiddo. Let me look first.", "whisper"),
          N(() => {
            ((H.phase = "m2"), switchTo("mops"), n.pulse.add("poster"), (n.ctrl = !0));
          }),
        ]));
    }
    function E6() {
      ((n.ctrl = !1),
        (n.act = null),
        n.pulse.clear(),
        D.key(),
        J([
          uV(0.4),
          N(() => {
            ((H.mom = !0), (H.momX = Qa.x));
          }),
          v("mom", "Can I help you, goat?"),
          v("mops", "I think I found something of yours."),
          v("mops", "Come on out, kiddo.", "whisper"),
          N(() => {
            ((n.sqPose = "stand"), (x.spot = -1), (n.sq.y = 540), switchTo("squatch"));
          }),
          He(n.sq, Qa.x - 90, 540, 150),
          N(() => {
            n.sq.f = 1;
          }),
          v("mom", "Harry? ...HARRY! It's you!"),
          N(() => {
            ((H.phase = "m2h"), chipNow(), (n.ctrl = !0));
          }),
        ]));
    }
    function k6() {
      (H.hug++,
        D.pickup(),
        n.sparks.push({ x: n.sq.x + 40, y: n.sq.y - 170, t: 1, s: "\u2665" }),
        !(H.hug < 5) &&
          ((n.ctrl = !1),
          (n.act = null),
          (Ao = !0),
          n.log.push({ who: "", text: "[cones off for good: hugged on Mars]", kind: "t" }),
          J([
            N(() => {
              ((H.dad = !0), (H.dadX = Qa.x + 110));
            }),
            v("dad", "Come in, come in! Pancakes!"),
            cV((l) => mV(n.mo, Qa.x - 20, 560, 140, l)),
            v("dad", "Oh, um... goats wait outside, I think? Health rules. Sorry, fella!"),
            v("sq", "Go wait in the van, Mops. Just for a bit."),
            v("mops", "...Sure, kiddo."),
            N(p2),
          ])));
    }
    function p2() {
      // Off the right of the stand, in through the van's right door. A scene jump from anywhere else just arrives.
      let live = n.room === "stand",
        arrive = () => {
        ((n.scene = "M3"),
          (n.room = "van"),
          (H.phase = "m3"),
          (H.mom = !1),
          (H.dad = !1),
          switchTo("mops"),
          n.pulse.clear(),
          n.pulse.add("vmop"),
          chipNow(),
          (n.sqPose = "hidden"),
          (n.sq.x = -300),
          (n.mo.x = 860),
          (n.mo.y = 560),
          (n.mo.f = -1),
          (n.mo.walk = 0),
          (n.mo.moving = !1),
          (n.moPose = "stand"),
          (n.ctrl = !0));
      };
      live
        ? beginRoomWalk({ outWho: "mo", exitX: 1010, exitY: 560, fromLeft: !1, entryX: 860, entryY: 560, ctrlAfter: !0, arrive })
        : arrive();
    }
    function O6() {
      ((n.ctrl = !1),
        (n.act = null),
        (H.slip = !0),
        n.pulse.clear(),
        J([
          v("mops", "His Guardian Box. Something fell out."),
          { k: "panel", id: "slip4" },
          v("mops", "...That's his paw."),
          v("mops", "He ordered them. To replace me."),
          N(A2),
        ]));
    }
    function A2() {
      // Mops walks off the right of the van. Squatch walks in from the stand's left door.
      // A scene jump from anywhere else just arrives.
      let live = n.room === "van",
        arrive = () => {
        ((n.scene = "M4"),
          (n.room = "inside"),
          (H.phase = "m4a"),
          (H.beam = -1),
          (H.mom = !0),
          (H.dad = !0),
          (H.momX = 640),
          (H.dadX = 780),
          live && ((n.moPose = "hidden"), (H.gone = !0)),
          n.pulse.clear(),
          (n.sq.x = 420),
          (n.sq.y = 540),
          (n.sq.f = 1),
          (n.sq.walk = 0),
          (n.sq.moving = !1),
          (n.sqPose = "stand"),
          switchTo("squatch"),
          chipNow());
      };
      live
        ? beginRoomWalk({
            outWho: "mo",
            inWho: "sq",
            exitX: 1010,
            exitY: 560,
            fromLeft: !0,
            entryX: 420,
            entryY: 540,
            ctrlAfter: !1,
            arrive,
          })
        : arrive();
      J([
        cV(() => !n.roomWalk),
        v("mom", "Eat up, Harry! Three dozen pretzels, and pancakes forever."),
        uV(1.2),
        N(() => {
          ((H.beam = 0), D.alarm(), (n.ctrl = !0));
        }),
      ]);
    }
    function w6() {
      ((n.ctrl = !1),
        (n.act = null),
        (H.beam = -1),
        (H.phase = "m4"),
        D.hide(),
        J([
          N(() => {
            ((n.sqPose = "ball"), (x.spot = -1));
          }),
          v("dad", "Sweetie? Sasquatches never hide!"),
          N(() => {
            ((n.sqPose = "stand"), (x.spot = -1));
          }),
          v("sq", "But Rule #1... The Guardians said stay hidden."),
          v("sq", "You sent them, right?"),
          v("mom", "Sweetie, we didn't know where you were."),
          v("sq", "...Then who were the Guardians?"),
          N(() => {
            ((H.phase = "m4b"), n.pulse.add("iexit"), (n.ctrl = !0));
          }),
        ]));
    }
    function N6() {
      // Out the inside room's left door and in through the van's right door. A jump from any other room just arrives.
      let live = n.room === "inside",
        arrive = () => {
          ((n.scene = "M4v"),
            (n.room = "van"),
            (H.phase = "m4v"),
            (H.mom = !1),
            (H.dad = !1),
            n.pulse.clear(),
            n.pulse.add("seat"),
            (n.sq.x = 860),
            (n.sq.y = 560),
            (n.sq.f = -1),
            (n.sq.walk = 0),
            (n.sq.moving = !1),
            (n.sqPose = "stand"));
        };
      (n.ctrl = !1), (n.act = null);
      live
        ? beginRoomWalk({
            outWho: "sq",
            exitX: -40,
            exitY: 560,
            fromLeft: !1,
            entryX: 860,
            entryY: 560,
            ctrlAfter: !1,
            arrive,
          })
        : arrive();
      J([
          cV(() => !n.roomWalk),
          v("sq", "Mops? ...Mops?"),
          N(() => {
            n.ctrl = !0;
          }),
        ]);
    }
    function R6() {
      ((n.ctrl = !1),
        (n.act = null),
        (H.box = !0),
        n.pulse.clear(),
        D.grab(),
        J([
          { k: "panel", id: "slip4" },
          v("sq", "He found it."),
          { k: "panel", id: "gbox4" },
          v("sq", "Big, furry... and a goat."),
          v("sq", "Mops."),
          N(g2),
        ]));
    }
    function g2() {
      let live = n.room === "van",
        arrive = () => {
          ((n.scene = "M5"),
            (n.room = "port"),
            (H.phase = "m5i"),
            (H.follow = !1),
            (H.met = !1),
            (H.wook = !1),
            (x.sing = !1),
            n.pulse.clear(),
            (n.sq.x = vo.x),
            (n.sq.y = 575),
            (n.sq.f = 1),
            (n.sq.walk = 0),
            (n.sq.moving = !1),
            (n.sqPose = "stand"),
            (n.mo.x = 620),
            (n.mo.y = 540),
            (n.mo.f = 1),
            (n.mo.walk = 0),
            (n.mo.moving = !1),
            (n.moPose = "stand"),
            (H.bot = { x: 860, y: 450, hx: 860, hf: -1, f: -1, look: 0, pause: 0, alert: 0 }));
        };
      // Out the van's right door, in from the left of the port. A scene jump just arrives.
      live
        ? beginRoomWalk({ outWho: "sq", exitX: 1010, exitY: 560, fromLeft: !0, entryX: vo.x, entryY: 575, ctrlAfter: !1, arrive })
        : arrive();
      J([
        cV(() => !n.roomWalk),
        v("sq", "No more hiding."),
        N(() => {
          ((H.phase = "m5"), chipNow(), (n.ctrl = !0));
        }),
      ]);
    }
    function z6() {
      ((H.met = !0),
        (n.ctrl = !1),
        (n.act = null),
        (n.sq.moving = !1),
        J([
          v("sq", "MOPS! I'll always come get you."),
          N(() => {
            n.mo.f = -1;
          }),
          v("mops", "You ordered robots, kiddo."),
          v("sq", "I'm sorry. I was scared to go without you."),
          v("sq", "So I made you stay behind."),
          v("sq", "You were my Guardian the whole time."),
          v("mops", "...Brave Sasquatches don't hide. I was wrong about that."),
          N(() => {
            ((H.gone = !1), (H.mom = !0), (H.dad = !0), (H.momX = 1e3), (H.dadX = 1060));
          }),
          cV((l) => ((H.momX = Math.max(900, H.momX - 160 * l)), (H.dadX = Math.max(960, H.dadX - 160 * l)), H.momX <= 900)),
          v("dad", "Forget the rules. Any goat who raised our son eats pancakes with us."),
          v("sq", "Harry to my family. Squatch to my goat."),
          N(() => {
            ((H.phase = "m5d"), chipNow(), (n.ctrl = !0));
          }),
        ]));
    }
    let U6 = [
      ["sq", "\u266A I'm floating in space... \u266A"],
      ["mops", "\u266A Baaa! \u266A"],
      ["sq", "\u266A ...but I'm not alone. \u266A"],
      ["mops", "\u266A Baaa-aa! \u266A"],
      ["sq", "\u266A Wherever you mop... \u266A"],
      ["mops", "\u266A Baaa! \u266A"],
      ["sq", "\u266A ...is my home. \u266A"],
    ];
    function D6() {
      (H.dance++,
        D.baa(),
        n.sparks.push({ x: n.mo.x, y: n.mo.y - 150, t: 1, s: "Baaa!" }),
        !(H.dance < 4) &&
          ((n.ctrl = !1),
          (n.act = null),
          (x.sing = !0),
          J([
            uV(1.2),
            ...U6.map(([l, o]) => v(l, o, "song")),
            N(() => {
              ((x.sing = !1), H.caught === 0 && !n.found.has("ghost4") && (n.found.add("ghost4"), (n.stars += 250)), B6());
            }),
            {
              k: "card",
              id: "ever",
              text: "Ever since: no more hiding. Squatch sings out loud, Mops mops the pancake stand (badly), and the menu says, in crayon: GOATS EAT FREE.",
            },
            { k: "panel", id: "tally4" },
            { k: "card", id: "end", text: "THE END" },
            { k: "panel", id: "final" },
            N(() => {
              ((pa.bot = "Security"), Ml(4), (n.on = !1), GV("title"));
            }),
          ])));
    }
    function C6() {
      return n.stars >= 2e3 ? 3 : n.stars >= 1200 ? 2 : 1;
    }
    function B6() {
      Ml(4);
      let l = 0;
      try {
        l = parseInt(window.localStorage.getItem(ssqKey("best")) || "0", 10) || 0;
      } catch {}
      H.best = Math.max(l, n.stars);
      try {
        window.localStorage.setItem(ssqKey("best"), String(H.best));
      } catch {}
    }
    function x2() {
      let l = ["menu", "photo"],
        o = ["sock", "pine"],
        i = ["sneak-m1"],
        s = H.caught;
      return [
        "Secrets found " + l.filter((q) => n.found.has(q)).length + "/" + l.length,
        "Funny finds " + o.filter((q) => n.found.has(q)).length + "/" + o.length,
        "Sneaky! " + i.filter((q) => n.found.has(q)).length + "/" + i.length,
        "Times caught " + s,
        ...(s === 0 ? [NEVER_CAUGHT, NEVER_CAUGHT_WHY] : [NEVER_CAUGHT_TODO]),
        "Chapter score \u2605 " + (n.stars - H.start),
        "Total \u2605 " + n.stars,
      ];
    }
    function G6(l) {
      if (!n.scene.startsWith("M")) return null;
      if (l === "pbot") {
        let o = H.bot;
        return o ? { x: o.x, y: o.y - 90 } : { x: c / 2, y: 200 };
      }
      return l === "zip" ? { x: vo.x + 60, y: 300 } : l === "mom" ? { x: H.momX, y: 330 } : l === "dad" ? { x: H.dadX, y: 320 } : null;
    }
    function So(l, o, i, s, q) {
      (Re(l, o, he * i, { f: s }), q && (X(l - 14, o - 150 * i, 12, 7), r("#ff5fa8", 2), X(l + 6, o - 150 * i, 12, 7), r("#ff5fa8", 2)));
    }
    function H6(l, o) {
      if (o && !Ao) {
        let d = go(l);
        seenCone(d.ox, d.oy, d.a, 0.55, 220, "rgba(255,207,51,.26)");
      }
      let { x: i, y: s, f: q } = l;
      (X(i, s, 30, 8),
        r("rgba(30,36,48,.18)", 0),
        m(i - 26, s - 70, 52, 62, 10),
        r("#dfe4ea", 3),
        m(i - 18, s - 60, 36, 18, 6),
        r("#1e2430", 2),
        F(i + q * 6, s - 51, 4, l.look > 0 ? "#ffcf33" : "#e5533d"),
        g("PORT", i, s - 26, 10, y, "center", 900),
        L(i - 14, s - 4, 7),
        r("#59657d", 2),
        L(i + 14, s - 4, 7),
        r("#59657d", 2));
    }
    function L6(l, o, i) {
      (i === 0 && ringOf("can"),
        m(l - 36, o - 84, 72, 84, 8),
        r("#7d8a99", 3.5),
        C([l - 36, o - 56, l + 36, o - 56], "#59657d", 3),
        C([l - 36, o - 28, l + 36, o - 28], "#59657d", 3),
        m(l - 42, o - 96, 84, 14, 6),
        r("#9aa6b4", 3),
        n.sqPose === "hidden" && x.spot === 90 + i && ga(l, o - 70),
        x.sing && x.spot === 90 + i && Pt(l + 34, o - 120 - ((n.T * 30) % 30)));
    }
    function P6() {
      let l = H.phase.startsWith("m5");
      if (((e.fillStyle = l ? "#0d1020" : "#c96a43"), e.fillRect(0, 0, c, b), l))
        for (let s = 0; s < 40; s++) F((s * 131) % c, (s * 41) % 300, 1.6, "#ffffff");
      ((e.fillStyle = l ? "#4a3a3a" : "#a8553a"),
        e.fillRect(0, 380, c, b - 380),
        C([0, 380, c, 380], y, 4),
        m(20, 300, 140, 110, 20),
        r("#ffcf33", 4),
        g("ZIP", 90, 350, 24, "#7a4a2a", "center", 900),
        xo(130, 352, 0.6));
      for (let s of [200, 760]) (m(s - 10, 120, 20, 260, 3), r("#59657d", 3), m(s - 26, 100, 52, 30, 6), r("#dfe4ea", 3));
      (m(P0.x - 40, 260, 80, 140, 6),
        r("#59657d", 4),
        g("GATE", P0.x, 280, 14, "#ffffff", "center", 900),
        g("\u2192 CRATER ROW", P0.x, 300, 10, "#ffcf33", "center", 900),
        m(ia.x - 40, 380, 80, 60, 6),
        r(H.sock ? "#fff3d6" : "#3478f6", 3),
        g("LOST+FOUND", ia.x, 400, 10, H.sock ? y : "#ffffff", "center", 900),
        H.sock &&
          (e.beginPath(),
          e.moveTo(ia.x - 10, 384),
          e.lineTo(ia.x - 10, 330),
          e.lineTo(ia.x + 30, 330),
          e.lineTo(ia.x + 30, 350),
          e.lineTo(ia.x + 10, 350),
          e.lineTo(ia.x + 10, 384),
          e.closePath(),
          r("#ff5fa8", 3)));
      for (let s of d2()) (X(s.x, s.y, 62, 34), (e.fillStyle = "rgba(255,240,150,.45)"), e.fill());
      let o = [];
      xf.forEach((s, q) => o.push({ y: s.y, d: () => L6(s.x, s.y, q) }));
      let i = H.bot;
      (i && o.push({ y: i.y, d: () => H6(i, !de() && i.look <= 0 && H.phase === "m1") }),
        H.mom && o.push({ y: 540, d: () => So(H.momX, 540, 1.15, -1, !0) }),
        H.dad && o.push({ y: 541, d: () => So(H.dadX, 541, 1.25, -1, !1) }),
        yn(o),
        x.sing &&
          n.sqPose !== "hidden" &&
          o.push({
            y: 999,
            d: () => {
              (Pt(n.sq.x + 30, n.sq.y - 170 - ((n.T * 30) % 30)), H.phase === "m5d" && Pt(n.mo.x, n.mo.y - 140));
            },
          }),
        o.sort((s, q) => s.y - q.y).forEach((s) => s.d()));
    }
    function Q6() {
      ((e.fillStyle = "#e0875a"),
        e.fillRect(0, 0, c, b),
        Ut("mars", 120, 90, 40),
        (e.fillStyle = "#b5623e"),
        e.fillRect(0, 380, c, b - 380),
        C([0, 380, c, 380], y, 4),
        m(340, 120, 560, 270, 8),
        r("#fff3d6", 5),
        e.beginPath(),
        e.moveTo(320, 130),
        e.lineTo(920, 130),
        e.lineTo(890, 90),
        e.lineTo(350, 90),
        e.closePath(),
        r("#e5533d", 4),
        g("BIG FURRY PANCAKES", 620, 112, 22, "#ffffff", "center", 900),
        Mo(380, 112, 0.6),
        ringOf("sdoor"),
        m(Qa.x - 44, 240, 88, 150, 6),
        r("#8b4a1c", 4),
        F(Qa.x + 28, 320, 5, "#ffcf33"),
        ringOf("poster"),
        m(In.x - 46, 190, 92, 112, 4),
        r("#ffffff", 3),
        g("MISSING", In.x, 206, 14, "#e5533d", "center", 900),
        XV(In.x, 252, 18, 14, 10, 3, 0),
        wV("#8b4a1c", 2),
        g("HARRY", In.x, 290, 12, y, "center", 900),
        m(Hl.x - 50, 180, 100, 120, 6),
        r(n.found.has("menu") ? "#2a2030" : "#3b414a", 3),
        g(n.found.has("menu") ? "HARRY'S" : "MENU", Hl.x, 210, 14, "#ffffff", "center", 900),
        g(n.found.has("menu") ? "BDAY STACK" : "Stack \xB7 3", Hl.x, 236, 12, "#ffcf33", "center", 800));
      let l = [];
      (l.push({
        y: Ea.y,
        d: () => {
          (Xn(Ea.x - 60, Ea.y - 90, 120, 90, "PRETZELS"), n.sqPose === "hidden" && x.spot === 95 && ga(Ea.x, Ea.y - 100));
        },
      }),
        H.mom && l.push({ y: 520, d: () => So(H.momX, 520, 1.15, -1, !0) }),
        H.dad && l.push({ y: 521, d: () => So(H.dadX, 521, 1.25, -1, !1) }),
        yn(l),
        l.sort((o, i) => o.y - i.y).forEach((o) => o.d()));
    }
    function Y6() {
      ((e.fillStyle = "#f2d27a"),
        e.fillRect(0, 0, c, b),
        (e.fillStyle = "#c98a4b"),
        e.fillRect(0, 380, c, b - 380),
        C([0, 380, c, 380], y, 4));
      for (let o of [160, 480, 800]) (m(o - 60, 80, 120, 80, 30), r("#151a2c", 4), F(o - 20, 110, 2, "#ffffff"));
      for (let o = 0; o < 4; o++) Xn(40 + o * 70, 300 - (o % 2) * 40, 64, 80, "");
      (C([Ya.x, 200, Ya.x, 260], y, 2),
        e.beginPath(),
        e.moveTo(Ya.x, 260),
        e.lineTo(Ya.x - 22, 320),
        e.lineTo(Ya.x + 22, 320),
        e.closePath(),
        r("#2bc48a", 3),
        H.pine && g("PINE-ISH", Ya.x, 340, 12, "#2b8a5e", "center", 900),
        ringOf("seat"),
        m(Tt.x - 100, 330, 200, 60, 12),
        r("#e5533d", 4),
        m(Tt.x - 100, 390, 200, 70, 8),
        r("#b83a1d", 4),
        H.slip
          ? (m(Tt.x - 40, 300, 80, 34, 4), r("#3478f6", 3), m(Tt.x - 20, 290, 40, 14, 2), r("#fffaf0", 2))
          : H.scrub >= 3 && (m(Tt.x - 40, 446, 80, 20, 3), r("#3478f6", 2)),
        ringOf("vmop"));
      for (let o = 0; o < 3 - H.scrub; o++) (X(Kn.x - 40 + o * 40, Kn.y + (o % 2) * 10, 26, 9), r("#7a4a2a", 0));
      (m(A6.x - 30, 400, 60, 180, 6), r("#59657d", 3));
      let l = [];
      (yn(l), l.sort((o, i) => o.y - i.y).forEach((o) => o.d()));
    }
    function I6() {
      if (
        ((e.fillStyle = "#fff0dc"),
        e.fillRect(0, 0, c, b),
        (e.fillStyle = "#d9a874"),
        e.fillRect(0, 380, c, b - 380),
        C([0, 380, c, 380], y, 4),
        m(420, 90, 200, 130, 8),
        r(H.beam >= 0 ? "#fff6a8" : "#151a2c", 4),
        H.beam >= 0)
      ) {
        let o = 420 + (H.beam / 3.2) * 200;
        (e.beginPath(),
          e.moveTo(o - 20, 220),
          e.lineTo(o + 20, 220),
          e.lineTo(o + 160, 620),
          e.lineTo(o - 60, 620),
          e.closePath(),
          (e.fillStyle = "rgba(255,240,150,.5)"),
          e.fill());
      }
      for (let o = 0; o < 4; o++) {
        let i = 160 + o * 64;
        (m(i, 170, 50, 60, 3),
          r(o === 2 ? "#ffffff" : "#e8c38f", 3),
          o === 2
            ? g(n.found.has("photo") ? "HARRY" : "", i + 25, 200, 10, "#e5533d", "center", 900)
            : (XV(i + 25, 206, 10, 8, 8, 2, 0), wV("#8b4a1c", 1.5)));
      }
      (m(560, 430, 300, 30, 6),
        r("#a8743a", 3),
        Mo(640, 430, 1),
        Mo(760, 430, 1),
        ringOf("iexit"),
        m(To.x - 30, 400, 60, 170, 6),
        r("#8b4a1c", 3));
      let l = [];
      (H.mom && l.push({ y: 520, d: () => So(H.momX, 520, 1.15, -1, !0) }),
        H.dad && l.push({ y: 521, d: () => So(H.dadX, 521, 1.25, -1, !1) }),
        n.sqPose === "hidden" &&
          x.spot === 96 &&
          l.push({
            y: n.sq.y,
            d: () => {
              (e.save(), e.translate(n.sq.x, n.sq.y), e.scale(1, 0.6), Re(0, 0, he, { f: n.sq.f, eyes: "closed" }), e.restore());
            },
          }),
        yn(l),
        l.sort((o, i) => o.y - i.y).forEach((o) => o.d()));
    }
    function v2(l) {
      if (l === "poster4")
        return (
          e.save(),
          e.translate(480, 320),
          e.rotate(-0.02),
          m(-220, -250, 440, 500, 6),
          r("#ffffff", 5),
          g("MISSING", 0, -200, 52, "#e5533d", "center", 900),
          g("our baby HARRY", 0, -146, 28, y, "center", 900),
          m(-90, -120, 180, 150, 8),
          r("#fff3d6", 3),
          XV(0, -40, 40, 34, 12, 4, 0),
          wV("#8b4a1c", 3),
          X(0, -44, 20, 16),
          r("#f4c39a", 2),
          F(-7, -48, 3, y),
          F(7, -48, 3, y),
          g("Lost in a", 0, 70, 26, y, "center", 800),
          g((window.SSQ && window.SSQ.snack ? window.SSQ.snack("NAME") : "SNACK") + " shipment", 0, 108, 30, "#3478f6", "center", 900),
          g("Please bring him home.", 0, 160, 22, "#59657d", "center", 700),
          g("\u2014 Big Furry Pancakes, Crater Row", 0, 200, 16, "#59657d", "center", 700),
          e.restore(),
          !0
        );
      if (l === "menu4")
        return (
          e.save(),
          e.translate(480, 320),
          m(-230, -170, 460, 340, 10),
          r("#2a2030", 5),
          g("HARRY'S BIRTHDAY STACK", 0, -110, 28, "#ffcf33", "center", 900),
          Mo(0, 40, 2.4),
          g("every year, just in case", 0, 120, 24, "#ffffff", "center", 700),
          e.restore(),
          !0
        );
      if (l === "photo4")
        return (
          e.save(),
          e.translate(480, 320),
          m(-170, -200, 340, 400, 8),
          r("#e8c38f", 5),
          m(-130, -160, 260, 280, 4),
          r("#ffffff", 3),
          g("(saved for)", 0, -10, 22, "#8a93a3", "center", 700),
          g("HARRY", 0, 160, 34, "#e5533d", "center", 900),
          e.restore(),
          !0
        );
      if (l === "slip4")
        return (
          e.save(),
          e.translate(480, 320),
          e.rotate(0.03),
          m(-220, -230, 440, 460, 4),
          r("#fffaf0", 5),
          g("BLEEP-BLOOP BOTS", 0, -180, 28, "#3478f6", "center", 900),
          g("ORDER RECEIPT", 0, -140, 20, "#59657d", "center", 800),
          g("Replace remaining janitors:", 0, -70, 24, y, "center", 700),
          g("[X] GANITOR: MOPS", 0, -20, 32, "#e5533d", "center", 900),
          g("(all 1 of them)", 150, 4, 14, "#59657d", "center", 700),
          g("EXPRESS DELIVERY", 0, 30, 22, y, "center", 800),
          g("Ordered by:", -60, 110, 20, "#59657d", "center", 700),
          ah(70, 100, 1.2),
          e.restore(),
          !0
        );
      if (l === "gbox4x")
        return (
          e.save(),
          e.translate(530, 120),
          e.rotate(0.03),
          Fe(320, 196, 0.95, { f: -1 }),
          e.save(),
          e.translate(200, 112),
          e.rotate(-0.08),
          g("+ MOPS!", 0, 0, 26, "#2bc48a", "center", 900),
          e.restore(),
          e.restore(),
          !0
        );
      if (l === "tally4")
        return (
          e.save(),
          e.translate(480, 320),
          m(-260, -230, 520, 460, 16),
          r("#fff3d6", 5),
          g("CHAPTER 4 \xB7 MARS", 0, -190, 28, y, "center", 900),
          x2().forEach((o, i) => tallyLine(o, 0, -130 + i * 50, 24, 460, o.startsWith("Never caught!") || o === NEVER_CAUGHT_WHY ? "#2bc48a" : y)),
          e.restore(),
          !0
        );
      if (l === "final") {
        let o = C6();
        (e.save(),
          e.translate(480, 320),
          m(-280, -240, 560, 480, 18),
          r("#1e2430", 5),
          g("FINAL SCORE", 0, -190, 30, "#8fdcff", "center", 900),
          g("\u2605 " + n.stars, 0, -110, 64, "#ffcf33", "center", 900));
        for (let i = 0; i < 3; i++) g("\u2605", -110 + i * 110, 10, 90, i < o ? "#ffcf33" : "#3b414a", "center", 900);
        return (
          g(o === 3 ? "Ghost-level sneaky!" : o === 2 ? "Very sneaky!" : "Sneaky enough!", 0, 100, 26, "#ffffff", "center", 800),
          g("Best on this device: \u2605 " + H.best, 0, 160, 22, "#8fdcff", "center", 700),
          e.restore(),
          !0
        );
      }
      return !1;
    }
    let FV = { on: !1, bot: null, hx: 0, hy: 0, pulled: -1, hideT: 0, chip: "", scene: "" };
    // The hall alarm (Chapter 1): a bot runs to the alarm, then Squatch has until the end of the run to hide.
    // Hidden for 2 seconds: "They lost you." Not hidden when time runs out: the one capture rule (25-capture.js).
    function T2(l, why) {
      FV.on ||
        !n.ctrl ||
        n.T < (n.seeGrace || 0) ||
        (Object.assign(FV, { on: !0, bot: l, hx: l.x, hy: l.y, pulled: -1, hideT: 0, chip: n.chip, scene: n.scene, why: why || "hallbot" }),
        (n.chip = "Hide!"),
        (n.spotT = n.T),
        Dt("alarm", "", "robot sighting -> alarm run", "alarm"));
    }
    function K6(l) {
      if (!FV.on || !FV.bot) return;
      let o = FV.bot;
      if (n.scene !== FV.scene || n.room !== "hall" || (n.scene === "S4" && le.inCrate) || (!n.ctrl && p.state === "op" && n.cur)) {
        (n.chip === "Hide!" && (n.chip = FV.chip), (n.sirenT = -9), (o.x = FV.hx), (o.y = FV.hy), (FV.on = !1));
        return;
      }
      if (FV.pulled < 0) {
        mV(o, yo.x, yo.y + 40, 340, l) &&
          ((FV.pulled = n.T),
          (n.sirenT = n.T),
          D.alarm(),
          kV("pa", "WOOO-WOOO! SECURITY!"),
          Dt("alarm", "", "[alarm pulled " + (n.T - n.spotT).toFixed(2) + "s after sighting]", "alarm"));
        return;
      }
      (mV(o, FV.hx, FV.hy, 220, l),
        n.T - n.sirenT > 2.4 && (n.sirenT = n.T),
        n.sqPose === "hidden" ? (FV.hideT += l) : (FV.hideT = 0),
        (FV.hideT >= 2 || n.T - FV.pulled > 10) &&
          (Dt("alarm", "", FV.hideT >= 2 ? "alarm cooled (hid)" : "alarm caught", "alarm"),
          FV.hideT >= 2
            ? ((FV.on = !1), (n.sirenT = -9), n.chip === "Hide!" && (n.chip = FV.chip), lostYou())
            : capture(FV.why === "vent" ? "hallvent" : "hallbot")));
    }
    function lq(l, o, i) {
      if ((B.freakT > n.T && (B.freakT = -9), n.T < B.freakT + 3)) return;
      ((B.freakT = n.T),
        (B.freak = { x: l, y: o }),
        D.alarm(),
        kV("bot", "FUR DETECTED! VACUUM MODE! *SHHLURP*"),
        kV("sq", "Hey! That's MY fur!"),
        n.sparks.push({ x: l - B.camX - 58, y: o - 70, t: 2.2, s: "!" }));
      let s = n.sq.x - l,
        q = n.sq.y - o,
        d = Math.hypot(s, q) || 1;
      ((n.sq.x = w(n.sq.x + (s / d) * 150, sn().x0, sn().x1)), (n.sq.y = w(n.sq.y + (q / d) * 70, sn().y0, sn().y1)), R0(n.sq), i && T2(i));
    }
    function S2(l) {
      return l.light && !(n.scene === "S4" && l === B.bots[0] && !le.inCrate);
    }
    function M2(l) {
      return Math.PI / 2 + 0.85 * Math.sin(n.T * 0.8 + l.x * 0.013);
    }
    function X6(dt) {
      if (!(n.room !== "hall" || !n.ctrl || n.sqPose === "hidden" || x.mops || FV.on)) {
        if (["S6", "S7", "S7b"].includes(n.scene) && n.T > (n.seeGrace || 0)) {
          for (let l of B.bots)
            if (l.on && S2(l)) {
              let o = M2(l),
                dist = Math.hypot(n.sq.x - l.x, n.sq.y - l.y),
                standing = dist < 70 || vt(n.sq.x, n.sq.y - 30, l.x, l.y - 50, o, 0.42, 210);
              if (ballOrStand("hall" + Math.round(l.x), dist, dt || 0, standing)) {
                lq(l.x, l.y, l);
                return;
              }
            }
        } else ballNoticeReset("hall");
        if (n.scene === "S9" || (n.scene === "S11" && !x.doorOpen)) {
          let dist = Math.hypot(n.sq.x - x.lureBot.x, n.sq.y - x.lureBot.y);
          ballOrStand("lure", dist, dt || 0, dist < 100) && lq(x.lureBot.x, x.lureBot.y, x.lureBot);
        } else ballNoticeReset("lure");
      }
    }
    function E2(l, o) {
      let i = n.T - B.freakT;
      return i > 1.2 || Math.hypot(l - B.freak.x, o - B.freak.y) > 2
        ? { x: 0, y: 0 }
        : { x: Math.sin(n.T * 60) * 4, y: -Math.abs(Math.sin(i * 9)) * 14 };
    }
    function k2(l, o) {
      n.T - B.freakT <= 1.6 && Math.hypot(l - B.freak.x, o - B.freak.y) <= 2 && g("!", l, o - 112, 36, "#e5533d", "center", 900);
    }
