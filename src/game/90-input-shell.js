// Keyboard and taps, the debug link and state strip, the frame loop, window.__ss for tests, and the page (joystick, ACTION button, sound button, help line).
    let J2 = () => G || (VV(), warmPrime());
    // While sound is on (the player turned it on with the speaker), any touch, click or key starts it again
    // if the browser stopped it (a locked phone, a page opened again): the joystick, the ACTION button and the
    // picture all count, on touch-down and on lift (some browsers allow sound only on one of them).
    const SOUND_EVENTS = ["touchstart", "touchend", "pointerdown", "pointerup", "mousedown", "click", "keydown"];
    for (let l of SOUND_EVENTS) window.addEventListener(l, J2, { capture: !0, passive: !0 });
    document.addEventListener("visibilitychange", Ve);
    function k5() {
      if (!N0()) return;
      e.save();
      let l = Math.max(1, n.fbN || 1),
        o = Math.min(l - 1, n.fbI || 0);
      if (Nl(n.cur) && n.cur && n.cur.k === "fb")
        for (let i = 0; i < l; i++) {
          let s = c / 2 + (i - (l - 1) / 2) * 20;
          (F(s, 24, i === o ? 6 : 5, i === o ? "#3478f6" : "rgba(255,255,255,.75)"),
            (e.lineWidth = 2),
            (e.strokeStyle = y),
            e.beginPath(),
            e.arc(s, 24, i === o ? 6 : 5, 0, Math.PI * 2),
            e.stroke());
        }
      (m(c - 150, 12, 78, 30, 8), r("rgba(255,255,255,.85)", 2.5), g("SKIP \u25B8\u25B8", c - 111, 27, 13, y), e.restore());
    }
    function O5(l, o, i) {
      if (p.state === "op" && ch1CalendarTap(l, o)) return;
      // A morning close-up's own tap (Brian 31a: the beard squirts), src/modules/morning.js.
      let mb = p.state === "op" && window.SSQ && window.SSQ.beat("ch1-morning");
      if (mb && mb.pictureTap && mb.pictureTap(l, o)) return void VV();
      if ((VV(), i && !u && ((u = !0), t.onTouch()), p.state === "op" && N0() && l > c - 156 && l < c - 66 && o < 48)) {
        Cs();
        return;
      }
      if (p.state === "op" && (n.ch1PadOn || n.ch1Zoom || partyCutOpen())) {
        // A bubble or a card still goes away on a tap. The snack bar used to swallow that tap.
        if (de()) return void nf();
        ch1SlicePointer("down", l, o);
        ch1Day2Pointer("down", l, o);
        return;
      }
      {
        if (p.state === "op" && Nh()) {
          if (n.bt < 0.3) return void (n.tapT = n.T);
          hf(l > 720 && o < 160 ? "close" : l < 400 ? "prev" : "next");
          return;
        }
        if (p.state === "op" && partyCutOpen()) {
          ch1SlicePointer("down", l, o);
          return;
        }
        if (p.state === "op") {
          ch1WorldTap(l, o) || walkTap(l, o) || nf();
          return;
        }
        if (p.state === "title") {
          if (window.SSQ && window.SSQ.credits && window.SSQ.credits.tap(l, o)) return;
          for (let s = 0; s < 4; s++) {
            let q = 40 + s * 225;
            if (l >= q && l <= q + 205 && o >= 466 && o <= 616) {
              I0(s + 1);
              return;
            }
          }
          o < 430 && I0(Ca);
        }
      }
    }
    // Debug link (task T4). Does nothing unless the page address asks for it.
    //   ?ch=2               start Chapter 2 from the title, even if it is still locked
    //   ?ch=2&phase=wash1   then jump to that Chapter 2 checkpoint (the applyG table; ?phase alone means Chapter 2)
    //   ?scene=P3           start that scene's chapter, then call window.__ss.sceneP3
    //   ?beat=42            on a preview host only, open that Chapter 1 beat
    //   ?beat=day2          on localhost or a preview host, open Day 2 at the gift in the closet. The live site ignores it.
    //   ?beat=party         on localhost or a preview host, open the party night at P1 (party:P3 opens P3). Ignored live.
    //   ?beat=evening:38    on localhost or a preview host, open Day 2's evening at that beat (37 to 42; 142 the bin). Ignored live.
    //   &debug=1            show the state strip under the game; the backtick key hides and shows it
    function debugLink() {
      let q;
      try {
        q = new URLSearchParams(window.location.search);
      } catch {
        return;
      }
      let linkCh = parseInt(q.get("ch") || "", 10) || 0,
        linkPhase = q.get("phase") || "",
        linkScene = q.get("scene") || "",
        linkDebug = q.get("debug") === "1",
        linkBeatRaw = q.get("beat") || "",
        linkBeat = parseInt(linkBeatRaw, 10) || 0,
        linkDay2 = linkBeatRaw === "day2",
        linkParty = /^party(:P([1-7]|8a|8b|8c))?$/.test(linkBeatRaw) ? linkBeatRaw.slice(6) || "P1" : "",
        linkEvening = /^evening(:\d+)?$/.test(linkBeatRaw) ? +linkBeatRaw.slice(8) || 37 : 0;
      let previewBeat = !1,
        day2Jump = !1,
        partyJump = !1;
      try {
        let host = location.hostname || "",
          live = LIVE_HOSTS.includes(host),
          local = host === "localhost" || host === "127.0.0.1" || host === "";
        previewBeat = !!linkBeat && !live && !local;
        day2Jump = linkDay2 && !live;
        partyJump = (!!linkParty || !!linkEvening) && !live;
      } catch {}
      if (!linkCh && !linkPhase && !linkScene && !linkDebug && !previewBeat && !day2Jump && !partyJump) return;
      !linkCh && linkPhase && (linkCh = 2);
      !linkCh && linkScene && (linkCh = { O: 1, S: 1, Q: 1, G: 2, P: 3, M: 4 }[linkScene[0]] || 0);
      setTimeout(() => {
        if (!h) return;
        if (linkCh >= 1 && linkCh <= 4) {
          startStory(linkCh);
          linkCh === 2 && linkPhase && (clearRun(), applyG(linkPhase));
        }
        if (linkScene) {
          let f = window.__ss && window.__ss["scene" + linkScene];
          typeof f === "function" && (clearRun(), f());
        }
        linkDebug && debugStrip();
        previewBeat && (startStory(1), (n.q = []), (n.cur = null), ch1JumpBeat(linkBeat));
        day2Jump && (startStory(1), (n.q = []), (n.cur = null), ch1Day2Begin(!0));
        partyJump && linkParty && partyBeat() && (startStory(1), (n.q = []), (n.cur = null), ch1ResetState(), (n.moPose = "hidden"), partyBeat().jump(linkParty));
        partyJump && linkEvening && (startStory(1), (n.q = []), (n.cur = null), ch1ResetState(), ch1JumpBeat(linkEvening));
      }, 0);
    }
    function roomLine(text) {
      // One short line over the fade when a character changes room during play.
      n.roomLine = { text, at: n.T };
    }
    function drawRoomLine() {
      let rl = n.roomLine;
      if (!rl || n.T - rl.at > 1.8 || de()) return;
      ge(26);
      let d = e.measureText(rl.text).width + 48;
      ((e.globalAlpha = Math.min(1, (1.8 - (n.T - rl.at)) * 3)),
        m(c / 2 - d / 2, 280, d, 52, 16),
        r("#1e2430", 3),
        g(rl.text, c / 2, 306, 26, "#ffffff", "center", 800),
        (e.globalAlpha = 1));
    }
    function drainQueue() {
      // Test hook: plays the story queue to its end at once, the way skipping a cutscene does.
      for (let i = 0; i < 6e3 && (n.cur || n.q.length || n.roomWalk); i++) {
        n.roomWalk && stepRoomWalk(0.05);
        if (de()) {
          let o = n.cur;
          ((n.cur = null), o && o.k === "panel" && rh(o.id));
        }
        (lh(0.05), n.cur && n.cur.k === "until" && n.cur.f(0.05) && (n.cur = null));
      }
    }
    function debugState() {
      let s = n.scene || "",
        a = n.act,
        f = (v) => (typeof v === "number" ? v.toFixed(1) : "-");
      return [
        "ch " + ({ O: 1, S: 1, Q: 1, G: 2, P: 3, M: 4 }[s[0]] || "-"),
        "scene " + (s || "-"),
        "phase " + (ch2.phase || "-"),
        "room " + (n.room || "-"),
        "control " + (x.mops ? "Mops" : "Squatch") + (n.ctrl ? "" : " (cutscene)"),
        "pose " + (n.sqPose || "-"),
        "prompt " + (a ? a.verb + (a.cap ? " \u00b7 " + a.cap : "") : "-"),
        "button " + (p.verb || "-"),
        'chip "' + (n.chip || "") + '"',
        "security " + (ch2.sec ? ch2.sec.mode + " (" + ch2.sec.by + ")" : "none"),
        "warn " + f(ch2.warn) + " peek " + f(ch2.peek),
      ].join(" | ");
    }
    function debugStrip() {
      let box = document.createElement("div"),
        line = document.createElement("div"),
        copy = document.createElement("button");
      ((box.id = "ss-debug"),
        box.setAttribute(
          "style",
          "max-width:960px;margin:0 auto;padding:4px 8px;box-sizing:border-box;width:100%;display:flex;gap:8px;align-items:flex-start;font:13px/1.4 ui-monospace,Menlo,monospace;color:#1e2430",
        ),
        (line.id = "ss-debug-line"),
        line.setAttribute("style", "flex:1;word-break:break-word"),
        (copy.type = "button"),
        (copy.textContent = "Copy"),
        copy.addEventListener("click", () => {
          try {
            navigator.clipboard.writeText(line.textContent);
          } catch {}
          copy.blur();
        }),
        box.append(line, copy),
        document.body.appendChild(box));
      let read = () => {
        if (!h) return (clearInterval(timer), box.remove());
        line.textContent = debugState();
      };
      let timer = setInterval(read, 250);
      (read(),
        window.addEventListener("keydown", (ev) => {
          ev.code === "Backquote" && !ev.repeat && (box.style.display = box.style.display === "none" ? "flex" : "none");
        }));
    }
    let Z2 = performance.now(),
      xq = 0,
      W2 = (l) => {
        if (!h) return;
        let o = Math.min(0.25, Math.max(0, (l - Z2) / 1e3));
        Z2 = l;
        try {
          for (; o > 1e-6;) {
            let i = Math.min(0.05, o);
            (ep(i), (o -= i));
          }
          Ap();
        } catch (i) {
          console.error(i);
        }
        xq = requestAnimationFrame(W2);
      };
    return (
      (xq = requestAnimationFrame(W2)),
      (window.__ss = {
        opSkip: Cs,
        cutActive: N0,
        sceneO7: ph,
        game: p,
        SFX: D,
        playSong: co,
        babyBreath: z1,
        follow: () => Bt,
        transit: () => ({ fadeA: Ka, walkIn: fa, lastRoom: Mf }),
        voiceCount: () => [0, R1, N1],
        audio: () => ({ state: S ? S.state : "none", vol: z, muted: G, music: !!warmEl }),
        soundState: () => soundState(),
        soundRefused: () => soundRefused(),
        soundLineShown: () => soundLineShown(),
        soundToggle: eV,
        seeLine: _h,
        inWedge: vt,
        inLight4: y2,
        addPoints: ee,
        burst: of,
        ch2: ch2,
        ch3: Q,
        ch4: H,
        sceneM0: nq,
        sceneM2: b2,
        sceneM3: p2,
        sceneM4: A2,
        sceneM5: g2,
        ch4Tally: x2,
        sceneP0: aq,
        sceneP3: s2,
        sceneP4: q2,
        ch3Tally: r2,
        sectionReset,
        resetHold: armReset,
        reSec,
        sceneG0: Ws,
        sceneG2: Wh,
        sceneG3: e2,
        sceneG4: t2,
        sceneG5: a2,
        sceneG6: n2,
        g6Out: l2,
        ch2Tally: o2,
        actionDown: actionPress,
        actionUp: actionRelease,
        tapAt: O5,
        ch1Pointer: (kind, x, y) => {
          ch1SlicePointer(kind, x, y);
          ch1Day2Pointer(kind, x, y);
        },
        ch1PadPress,
        ch1JumpBeat,
        shown: () => Array.from(p.shown),
        op: n,
        startOpening: qh,
        opTap: nf,
        s1: aV,
        sceneS1: Ah,
        sceneS1L: Mh,
        inCone: Ps,
        S1_SPOTS: qn,
        hall: B,
        sceneS2: Oh,
        sceneS3: Rh,
        s4: le,
        s5: qV,
        sceneS4: Uh,
        sceneS5: Dh,
        sceneO4: ch,
        ch1State: () => ({
          scene: n.scene,
          room: n.room,
          wardrobe: n.wardrobe || "closed",
          costume: !!n.costumeOn,
          night: !!n.ch1Night,
          ship: !!n.ch1Ship,
          walks: n.ch1Walks || [],
          trail: n.ch1Trail || [],
          got: n.ch1Got || 0,
          signed: n.ch1Signed || 0,
          mailed: n.ch1Mailed || 0,
          didBall: !!n.ch1DidBall,
          peeked: !!n.ch1Peeked,
          inCrate: !!n.ch1InCrate,
          climbed: !!n.ch1Climbed,
          siteRoom: n.ch1SiteRoom || "",
        }),
        ballNotice,
        ballNoticeReset,
        ch1CaughtAt,
        ch1InCone,
        ch1NightLook,
        BALL_NOTICE_RADIUS,
        BALL_NOTICE_SECONDS,
        ADULT_PX,
        adultPxFor,
        alienScale,
        qtScale,
        ALIEN_ADULT,
        QT_ADULT,
        SQ_ADULT,
        CH1_OFFICE_DOOR,
        CH1_BIN,
        CH1_ROBOT,
        CH1_MAIL,
        CH1_VENT,
        // The night out (D15): the vent's pull, the table, the notice, and the alarm state.
        lobby: () => ({
          pull: n.pull || 0,
          tuft: n.scene === "O4" && n.room === "lobby" && (n.pull > 0 || !!n.ventNear),
          near: !!n.ventNear,
          bite: PULL_BITE,
          vent: { ...LOBBY_VENT },
          table: { ...LOBBY_TABLE },
          sawTable: !!n.sawTable,
          noticeRead: !!n.noticeRead,
          holdNotice: !!n.holdNotice,
          runner: !!n.runner,
          looked: !!n.looked,
          by: n.lobbyBy || "",
          guards: (n.lg || []).map((g) => ({ x: g.x, y: g.y })),
          cones: hh(),
        }),
        sceneO5: Gs,
        sceneS6: Gh,
        sceneS8: js,
        sceneS9: Ph,
        sceneS10: Ih,
        sceneS11: Kh,
        sceneS12: Xh,
        ch: x,
        swapTo: yf,
        chTally: jh,
        getTrip: () => Gn,
        setTrip: (l) => {
          Gn = l;
        },
        tripSnacks: () => Gn,
        debugState,
        resetTo: (ph) => {
          (clearRun(), applyG(ph));
        },
        pickAct: () => (n.scene && n.scene.startsWith("G") ? RA() : null),
        // Spots (task T17): every spot of the current scene, the action offered where the player stands,
        // one frame drawn now, and the rings that frame drew.
        // The guard walking in now (Chapters 1 to 4), or null.
        secNow: () => (ch2.sec ? { ...ch2.sec } : null),
        spotsNow: () => spotsNow(),
        placedSpots: () => placedSpots(),
        offerNow: () => pick(spotsNow()),
        drawFrame: () => Ap(),
        // Mops drawn on his own, any pose (tests/mops-look.mjs and the picture sheet).
        drawMops: (x, y, scale, opts) => Fe(x, y, scale, opts || {}),
        paintLocked: (id) => {
          e.setTransform(1, 0, 0, 1, 0, 0);
          e.clearRect(0, 0, c, b);
          drawLockedRoom(id);
        },
        settleRoom: () => {
          ((Ka = 0), (Mf = n.room), (fa = null));
        },
        lockedReady: Promise.all(lockedWait),
        lockedIds: () => Object.keys(LOCKED_ROOMS),
        bubbleAt: (who) => v5(who),
        rings: () => ringsDrawn.slice(),
        inSpot: (l) => inSpot(l),
        // Goal chips for Chapters 1, 3 and 4 (task T18), and the chip key the current state reads.
        CH1_CHIPS,
        CH3_CHIPS,
        CH4_CHIPS,
        chipNow: () => (chipNow(), n.chip),
        chipDrawn: () => chipDrawn,
        chipKeyNow: () => {
          let l = (n.scene || "")[0];
          return l === "P" ? ch3ChipKey() : l === "M" ? ch4ChipKey() : l === "G" ? ch2ChipKey() : ch1ChipKey();
        },
        walkBounds: () => sn(),
        drain: drainQueue,
        sqAway: () => sqAway(),
        picSwap,
        canSwitch: () => O2(),
        solids: () => ih(),
        CH2_CHIPS,
        ch2ChipKey: () => ch2ChipKey(),
        // The one capture rule (task T19, 25-capture.js).
        CAPTURES,
        LOCKUP_RESTART,
        capture,
        shoo,
        lostYou,
        startSec: (by) => sSec(by),
        hallAlarm: FV,
        hallAlarmStart: (bot, why) => T2(bot, why),
        CH1_CHECKPOINTS,
        CH3_CHECKPOINTS,
        CH4_CHECKPOINTS,
        // The HUD (Phase 3, 80-hud.js): the stall hint's clock and method lines.
        stallFor: (t) => {
          ((stall.sig = progressSig()), (stall.t = t));
        },
        methodLine: () => methodLine(),
        stallT: () => stall.t,
        conesDrawn: () => conesDrawn.slice(),
        // Why the warm (home) music would play now, or "" (the party night keeps it off).
        warmWhy: () => warmWhy(),
        // One game update of dt seconds, run inside the caller's own task (no frame can run in between).
        tick: (dt) => ep(dt),
        METHOD_LINES: [...new Set(Object.values(METHOD_LINES))],
        // Award labels (Phase 3, T22).
        SNEAKY_LABELS,
        NEVER_CAUGHT: [NEVER_CAUGHT, NEVER_CAUGHT_WHY, NEVER_CAUGHT_TODO],
      }),
      debugLink(),
      {
        actionE: J1,
        resetHold: armReset,
        soundTap,
        actionDown: actionPress,
        actionUp: actionRelease,
        tapAt: O5,
        ch1Pointer: (kind, x, y) => {
          // The calendar close-up has no paw (Brian 2026-11-23): a drag there moves nothing.
          if (n.ch1Calendar) return;
          ch1SlicePointer(kind, x, y);
          ch1Day2Pointer(kind, x, y);
        },
        pointer: (kind, x, y) => {
          ch1SlicePointer(kind, x, y);
          ch1Day2Pointer(kind, x, y);
        },
        setJoy: (l, o, i) => {
          ((qt.x = l), (qt.y = o), (qt.active = i));
        },
        joyStart: () => {
          (VV(), p.state === "title" && I0(Ca));
        },
        setTouch: (l) => {
          u = l;
        },
        destroy: () => {
          ((h = !1), cancelAnimationFrame(xq), document.removeEventListener("keydown", j2, !0), window.removeEventListener("keydown", j2));
          for (let l of SOUND_EVENTS) window.removeEventListener(l, J2, { capture: !0 });
          document.removeEventListener("visibilitychange", Ve);
          try {
            S?.close();
          } catch {}
          (window.removeEventListener("keyup", _2), window.removeEventListener("blur", F2), S && S.close().catch(() => {}));
        },
      }
    );
  }
  function q8(V) {
    let t = (0, YV.useRef)(null),
      a = (0, YV.useRef)(null);
    (0, YV.useEffect)(() => {
      let f = t.current;
      if (!f) return;
      let u = null,
        h = (y) => {
          let U = f.getBoundingClientRect(),
            E = (y.clientX - U.left - U.width / 2) / (U.width / 2),
            w = (y.clientY - U.top - U.height / 2) / (U.height / 2),
            I = Math.hypot(E, w);
          (I > 1 && ((E /= I), (w /= I)),
            V.eng.current?.setJoy(E, w, !0),
            a.current && (a.current.style.transform = "translate(" + E * V.size * 0.32 + "px," + w * V.size * 0.32 + "px)"));
        },
        c = (y) => {
          (y.preventDefault(), (u = y.pointerId));
          try {
            f.setPointerCapture(y.pointerId);
          } catch {}
          (V.eng.current?.joyStart(), h(y));
        },
        b = (y) => {
          y.pointerId === u && (y.preventDefault(), h(y));
        },
        O = (y) => {
          y.pointerId === u && ((u = null), V.eng.current?.setJoy(0, 0, !1), a.current && (a.current.style.transform = ""));
        };
      return (
        f.addEventListener("pointerdown", c),
        f.addEventListener("pointermove", b),
        f.addEventListener("pointerup", O),
        f.addEventListener("pointercancel", O),
        () => {
          (f.removeEventListener("pointerdown", c),
            f.removeEventListener("pointermove", b),
            f.removeEventListener("pointerup", O),
            f.removeEventListener("pointercancel", O));
        }
      );
    }, [V.size, V.eng]);
    let e = Math.round(V.size * 0.4);
    return (0, pe.jsx)("div", {
      ref: t,
      "aria-label": "Move",
      style: {
        position: "relative",
        width: V.size,
        height: V.size,
        borderRadius: "50%",
        background: "#f1f3f6",
        border: "3px solid #1e2430",
        touchAction: "none",
        flex: "0 0 auto",
        boxSizing: "border-box",
      },
      children: (0, pe.jsx)("div", {
        ref: a,
        style: {
          position: "absolute",
          left: (V.size - e) / 2 - 3,
          top: (V.size - e) / 2 - 3,
          width: e,
          height: e,
          borderRadius: "50%",
          background: "#8fdcff",
          border: "3px solid #1e2430",
          pointerEvents: "none",
          boxSizing: "border-box",
        },
      }),
    });
  }
  // Help lines: only controls that work. The keyboard line under the picture is gone (K25).
  function r8(V) {
    let t = (0, YV.useRef)(null),
      [a, e] = (0, YV.useState)(!1);
    (0, YV.useEffect)(() => {
      let b = t.current;
      if (!b) return;
      let O = (U) => {
          (U.preventDefault(), e(!0), V.eng.current?.actionDown());
        },
        y = () => {
          (e(!1), V.eng.current?.actionUp?.());
        };
      return (
        b.addEventListener("pointerdown", O),
        b.addEventListener("pointerup", y),
        b.addEventListener("pointercancel", y),
        b.addEventListener("pointerleave", y),
        () => {
          (b.removeEventListener("pointerdown", O),
            b.removeEventListener("pointerup", y),
            b.removeEventListener("pointercancel", y),
            b.removeEventListener("pointerleave", y));
        }
      );
    }, [V.eng]);
    // "~": the story is playing on its own (60-frame-draw.js), so the button is dimmed and says nothing new.
    let dim = V.label === "~",
      f = V.label.charAt(0) === "!",
      u = dim ? "" : f ? V.label.slice(1) : V.label,
      h = u !== "",
      long = (u || "ACTION").length > 7,
      // One size for every label (problem 4): a long label gets smaller letters and may wrap, the button never grows.
      c = {
        width: V.size,
        minWidth: V.size,
        maxWidth: V.size,
        padding: "0 8px",
        overflowWrap: "anywhere",
        height: V.size,
        borderRadius: V.size / 2,
        textAlign: "center",
        lineHeight: 1.1,
        whiteSpace: "normal",
        background: h ? "#2bc48a" : "#3478f6",
        color: "#ffffff",
        border: "3px solid #1e2430",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: long ? 16 : Math.round(V.size * ((u || "ACTION").length > 5 ? 0.17 : 0.22)),
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        transform: a ? "scale(0.93)" : "none",
        opacity: dim ? 0.4 : 1,
        animation: f && !a ? "ssPulse 0.9s ease-in-out infinite" : "none",
        flex: "0 0 auto",
        boxSizing: "border-box",
        cursor: "pointer",
        letterSpacing: long ? 0 : 1,
      };
    return (0, pe.jsxs)("div", {
      ref: t,
      style: c,
      role: "button",
      "aria-label": u || "Action",
      children: [
        (0, pe.jsx)("style", {
          children: "@keyframes ssPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,207,51,.9)}50%{box-shadow:0 0 0 14px rgba(255,207,51,0)}}",
        }),
        u || "ACTION",
      ],
    });
  }
  function k1() {
    let V = Eb(),
      t = (0, YV.useRef)(null),
      a = (0, YV.useRef)(null),
      e = (0, YV.useRef)(null),
      [h, c] = (0, YV.useState)(""),
      // The joystick and ACTION button are always shown (Brian, 2026-11-23: "controls (joystick, etc.) should just
      // always be shown"), on every screen, touch or not.
      [b, O] = (0, YV.useState)(!0),
      [y, U] = (0, YV.useState)(Nb()),
      [E, w] = (0, YV.useState)(Rb());
    ((0, YV.useEffect)(() => {
      let eV = t.current;
      if (!eV) return;
      let W = null;
      try {
        W = s8(eV, { onVerb: (VV) => c(VV), onTouch: () => O(!0), font: V.font.family, touch: wb() });
        eV.focus({ preventScroll: !0 });
      } catch (VV) {
        console.error(VV);
      }
      return (
        (e.current = W),
        () => {
          (W && W.destroy(), (e.current = null));
        }
      );
    }, []),
      (0, YV.useEffect)(() => {
        e.current?.setTouch(b);
      }, [b]),
      (0, YV.useEffect)(() => {
        let eV = () => {
          (U(Nb()), w(Rb()));
        };
        return (
          window.addEventListener("resize", eV),
          window.addEventListener("orientationchange", eV),
          () => {
            (window.removeEventListener("resize", eV), window.removeEventListener("orientationchange", eV));
          }
        );
      }, []),
      (0, YV.useEffect)(() => {
        let eV = a.current;
        if (!eV) return;
        let W = (VV) => VV.preventDefault();
        return (eV.addEventListener("touchmove", W, { passive: !1 }), () => eV.removeEventListener("touchmove", W));
      }, []));
    // Controls beside the picture only on a touch screen turned sideways; a computer keeps them in a row
    // under a full-size picture (they are always shown since 2026-11-23).
    let I = b && y && wb(),
      tV = (eV) => {
        eV.preventDefault();
        let W = t.current;
        if (!W) return;
        W.focus();
        let VV = W.getBoundingClientRect(),
          Ve = eV.nativeEvent;
        e.current?.tapAt(((eV.clientX - VV.left) * 960) / VV.width, ((eV.clientY - VV.top) * 640) / VV.height, Ve.pointerType === "touch");
      },
      dragAt = (kind) => (eV) => {
        let W = t.current;
        if (!W || !e.current) return;
        let VV = W.getBoundingClientRect();
        e.current.ch1Pointer(kind, ((eV.clientX - VV.left) * 960) / VV.width, ((eV.clientY - VV.top) * 640) / VV.height);
      },
      nV = (eV) => (W) => {
        (W.preventDefault(), eV(), setTimeout(() => t.current?.focus({ preventScroll: !0 }), 0));
      };
    (0, YV.useEffect)(() => {
      let eV = window.setInterval(() => {
        let W = t.current;
        W &&
          document.hasFocus() &&
          (document.activeElement === document.body || document.activeElement === null) &&
          W.focus({ preventScroll: !0 });
      }, 250);
      return () => window.clearInterval(eV);
    }, []);
    // The sound button, in the controls row under the picture (Phase 3). The engine draws its icon (hudSound).
    let SND = (0, pe.jsxs)("span", {
        style: { display: "inline-flex", alignItems: "center", gap: 8 },
        children: [
          (0, pe.jsx)("button", {
            type: "button",
            id: "ss-sound",
            "aria-label": "Sound",
            style: {
              width: 44,
              height: 44,
              borderRadius: 22,
              border: "3px solid #1e2430",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              touchAction: "none",
              cursor: "pointer",
            },
            // On lift-off: iPhones count a tap as the player's own only when the finger comes up.
            onPointerUp: nV(() => e.current?.soundTap()),
            // A keyboard press on the focused speaker (Enter or Space) arrives as a click with no pointer.
            onClick: (W) => W.detail === 0 && e.current?.soundTap(),
          }),
          (0, pe.jsx)("span", {
            id: "ss-sound-line",
            style: { display: "none", fontSize: 14, maxWidth: 240, color: "#1e2430" },
            children: "Sound is blocked by this browser. Tap to try again, or allow sound for this site.",
          }),
        ],
      }),
      M = { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 10, width: "100%" },
      z = (0, pe.jsx)(r8, { label: h, size: I ? 96 : 104, eng: e }),
      G = (0, pe.jsx)(q8, { eng: e, size: I ? 120 : 128 }),
      Z = null;
    return (
      !I && b
            ? (Z = (0, pe.jsxs)("div", {
                style: { ...M, justifyContent: "space-between", padding: "0 6px", boxSizing: "border-box" },
                children: [
                  G,
                  z,
                  SND,
                ],
              }))
            : (Z = null), // Sideways phones put the controls beside the picture.

      (0, pe.jsxs)("div", {
        ref: a,
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "100%",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          fontFamily: V.font.family,
        },
        children: [
          (0, pe.jsxs)("div", {
            style: { ...M, alignItems: I ? "flex-end" : "center", flexWrap: I ? "nowrap" : "wrap" },
            children: [
              I ? G : null,
              (0, pe.jsx)("div", {
                style: { flex: "1 1 260px", width: "100%", maxWidth: I ? Math.max(260, Math.round((E - 60) * 1.5)) : 960, minWidth: 0 },
                children: (0, pe.jsx)("canvas", {
                  ref: t,
                  width: 960,
                  height: 640,
                  tabIndex: 0,
                  autoFocus: !0,
                  "aria-label": "Sneaky Sasquatch game",
                  onPointerDown: tV,
                  onPointerMove: dragAt("move"),
                  onPointerUp: dragAt("up"),
                  onPointerCancel: dragAt("up"),
                  style: {
                    display: "block",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "3 / 2",
                    borderRadius: 12,
                    border: "3px solid #1e2430",
                    touchAction: "none",
                    background: "#f1f3f6",
                    outline: "none",
                    boxSizing: "border-box",
                  },
                }),
              }),
              I
                ? (0, pe.jsxs)("div", {
                    style: { display: "flex", flexDirection: "column", gap: 8, alignItems: "center" },
                    children: [
                      z,
                      SND,
                    ],
                  })
                : null,
            ],
          }),
          Z,
        ],
      })
    );
  }
  var pe,
    zb = ed(() => {
      "use strict";
      Ob();
      pe = _n(ro());
    });
  var c8 = ka(() => {
    var Ub = _n(xb());
    zb();
    var Db = _n(ro());
    (0, Ub.createRoot)(document.getElementById("root")).render((0, Db.jsx)(k1, {}));
  });
  c8();
})();
/*! Bundled license information:

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
