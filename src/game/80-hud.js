// The HUD over the picture (Phase 3): page text laid over the canvas, so it reads at 14 CSS px or more on a phone. Zones, the faces, the ↺ hold, the stall hint, and the method lines.
    // Zones (Brian, 2026-11-07): top-left is where (chapter tag, stars, the ↺ hold-to-restart), top-center is
    // the goal (the chip, with the countdown and the tank under it), top-right is who (the faces). Prompts sit
    // by the thing, cards fill the picture, and bubbles sit over the speaker; those stay in the canvas.
    // tests/hud-layout.mjs fails if two HUD boxes overlap at 375 by 812 or at desktop width.
    //
    // The stall hint: after 60 seconds of play with no progress (no new beat, room, item or catch; time under a
    // card or a bubble does not count) the chip shows the method line for the moment, from methodLine below.
    // The goal line comes back on the next progress. Wording waits for Brian's yes (docs/PHASE-3-LINES-FOR-BRIAN.md).
    const STALL_SECONDS = 60;
    const METHOD_LINES = {
      back: "Squatch: walk to the KITCHEN door",
      g2: "Mops: walk up to Gloop at the counter",
      "wash:grab": "Squatch: grab a dish from the rack by the window",
      "wash:scrub": "Squatch: scrub the dish at the sink",
      g3h: "Squatch: stay in the crate until the bots leave",
      g4: "Mops: walk to the tip jar on the counter",
      g4k: "Mops: walk to the crate while the bots look away",
      "g6:hide": "Squatch: hide in the crate by the ship",
      "g6:sing": "Squatch: sing to call the bots over",
      "S11:hide": "Squatch: hide behind the plant",
      "S11:sing": "Squatch: sing to call the bot over",
      "p3:hid": "Squatch: sing to call the rovers over",
      "p4a:hide": "Squatch: hide in the barrel",
      "p4a:sing": "Squatch: sing to call the rover over",
      "m1:hide": "Squatch: hide in the middle trash can",
      "m1:sing": "Squatch: sing to call the bot over",
    };
    // Which method line fits the moment: the chip key, and whether Squatch is hidden yet.
    function methodKey() {
      let s = n.scene || "",
        hid = n.sqPose === "hidden" ? "sing" : "hide",
        k = s[0] === "G" ? ch2ChipKey() : s[0] === "P" ? ch3ChipKey() : s[0] === "M" ? ch4ChipKey() : ch1ChipKey();
      if (s[0] === "G") {
        if (k === "wash1" || k === "wash5") return ch2.held >= 0 ? "wash:scrub" : "wash:grab";
        if (k === "g4l") return "g4k";
        return k === "g6" ? "g6:" + hid : k;
      }
      if (k === "S11" || k === "S11:hid") return "S11:" + hid;
      if (k === "p4a" || k === "m1") return k + ":" + hid;
      return k;
    }
    function methodLine() {
      return METHOD_LINES[methodKey()] || "";
    }
    // A short note in the goal spot (page text, so it reads on a phone): "They lost you.", the walk-tap hint.
    let note = { text: "", until: 0 };
    function hudNote(text, secs) {
      note = { text, until: performance.now() + secs * 1e3 };
    }
    let hud = null,
      stall = { sig: "", t: 0 },
      starPop = { last: 0, at: -9, hintAt: -1 };
    function progressSig() {
      let s = n.scene || "";
      return [s, ch2.phase, Q.phase, H.phase, n.room, n.found.size, ch2.has, ch2.done, ch2.held, ch2.caught, Q.caught, H.caught, x.caught, aV.caught, x.mops, n.sqPose === "hidden"].join("|");
    }
    function stallTick(l) {
      let sig = progressSig();
      sig !== stall.sig ? ((stall.sig = sig), (stall.t = 0)) : p.state === "op" && n.ctrl && !de() && !n.cur && (stall.t += l);
    }
    function stalled() {
      return stall.t >= STALL_SECONDS;
    }
    // A face picture for a button, drawn once with the game's own drawing (Fe is Squatch, Re is Mops).
    function faceUrl(who) {
      let cv = document.createElement("canvas");
      ((cv.width = 58), (cv.height = 58));
      let keep = e;
      try {
        ((e = cv.getContext("2d")), e.beginPath(), e.arc(29, 29, 29, 0, Math.PI * 2), e.clip());
        who === "mops" ? ((e.fillStyle = "#ffe3c4"), e.fillRect(0, 0, 58, 58), Re(29, 48, 0.42, { f: -1 })) : ((e.fillStyle = "#ffffff"), e.fillRect(0, 0, 58, 58), Fe(29, 52, 0.36, { f: -1 }));
      } finally {
        e = keep;
      }
      return cv.toDataURL();
    }
    function hudEl(tag, id, css, parent) {
      let d = document.createElement(tag);
      return (id && (d.id = id), d.setAttribute("style", css), parent && parent.appendChild(d), d);
    }
    function hudInit() {
      let host = e.canvas.parentElement;
      if (!host) return null;
      host.style.position = "relative";
      let root = hudEl(
          "div",
          "ss-hud",
          "position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;font-family:" + f + ";color:#1e2430;line-height:1.2;overflow:hidden",
          host,
        ),
        style = hudEl("style", "", "", root);
      style.textContent =
        "@keyframes ssGlow{0%,100%{box-shadow:0 0 0 0 rgba(255,207,51,.95)}50%{box-shadow:0 0 0 10px rgba(255,207,51,0)}}" +
        "#ss-hud button{font-family:inherit;pointer-events:auto;touch-action:none;-webkit-user-select:none;user-select:none;cursor:pointer;padding:0;margin:0}" +
        "#ss-hud .ss-pill{background:#fff;border:2px solid #1e2430;border-radius:14px;padding:3px 10px;font-weight:800;white-space:nowrap}";
      let where = hudEl("div", "ss-where", "position:absolute;left:6px;top:6px;display:flex;gap:6px;align-items:center", root),
        chapter = hudEl("span", "ss-chapter", "font-size:14px", where),
        reset = hudEl(
          "button",
          "ss-reset",
          "width:30px;height:30px;border-radius:15px;border:2px solid #1e2430;background:#fffaf0;font-size:18px;font-weight:900;line-height:26px;text-align:center;color:#1e2430",
          where,
        ),
        stars = hudEl("span", "ss-stars", "font-size:14px;color:#b45309;background:#fff6dc", where),
        goal = hudEl("div", "ss-goal", "position:absolute;top:6px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center", root),
        chip = hudEl("div", "ss-chip", "background:#ffcf33;border:2px solid #1e2430;border-radius:16px;padding:4px 14px;font-weight:800", goal),
        count = hudEl("div", "ss-count", "background:#e5533d;color:#fff;border:2px solid #1e2430;border-radius:14px;padding:2px 14px;font-size:16px;font-weight:900", goal),
        tank = hudEl("div", "ss-tank", "font-size:14px;font-weight:900;border:2px solid #1e2430;border-radius:10px;padding:2px 10px", goal),
        pop = hudEl("div", "ss-pop", "font-size:15px;font-weight:900;color:#b45309;background:#fff6dc", goal),
        faces = hudEl("div", "ss-faces", "position:absolute;right:6px;top:6px;display:flex;gap:6px;align-items:center", root),
        sq = hudEl("button", "ss-face-squatch", "border-radius:50%;border:2px solid #1e2430;background:#fff;overflow:hidden", faces),
        mo = hudEl("button", "ss-face-mops", "border-radius:50%;border:2px solid #1e2430;background:#ffe3c4;overflow:hidden", faces);
      ((chapter.className = "ss-pill"), (stars.className = "ss-pill"), (tank.className = "ss-pill"), (pop.className = "ss-pill"));
      ((reset.type = sq.type = mo.type = "button"),
        (reset.textContent = "↺"),
        reset.setAttribute("aria-label", "Hold to restart this section"),
        sq.setAttribute("aria-label", "Squatch"),
        mo.setAttribute("aria-label", "Mops"));
      for (let [b, who] of [
        [sq, "squatch"],
        [mo, "mops"],
      ]) {
        let img = hudEl("img", "", "width:100%;height:100%;display:block;pointer-events:none", b);
        ((img.alt = ""), (img.src = faceUrl(who)));
        b.addEventListener("pointerdown", (ev) => {
          (ev.preventDefault(), ev.stopPropagation(), VV(), hudFaceTap(who));
        });
      }
      let hold = (on) => (ev) => {
        (ev.preventDefault(), ev.stopPropagation(), on && VV(), armReset(on));
      };
      (reset.addEventListener("pointerdown", hold(!0)),
        reset.addEventListener("pointerup", hold(!1)),
        reset.addEventListener("pointercancel", hold(!1)),
        reset.addEventListener("pointerleave", hold(!1)));
      return { root, where, chapter, reset, stars, goal, chip, count, tank, pop, faces, sq, mo, key: "" };
    }
    // Tapping a face switches to that character when switching is allowed.
    function hudFaceTap(who) {
      p.state === "op" && O2() && !de() && (who === "mops") !== !!x.mops && picSwap();
    }
    function hudShow(el, on) {
      let d = on ? "" : "none";
      el.style.display !== d && (el.style.display = d);
    }
    function hudText(el, t) {
      el.textContent !== t && (el.textContent = t);
    }
    // What the chip shows now: the star hint for its first 3.5 seconds, the method line after a stall, or the goal.
    function chipText() {
      if (note.text && performance.now() < note.until) return note.text;
      // The hint runs on the wall clock: the game clock starts over with each scene.
      let since = performance.now() - starPop.hintAt;
      if (n.starOn && starPop.hintAt >= 0 && since < 3500) return "\u2605 = points for finds";
      let s = n.chip || "";
      if (!s || (n.cur && n.cur.k === "bub")) return "";
      let m = stalled() ? methodLine() : "";
      return m || s;
    }
    function hudUpdate() {
      if (!hud || !hud.root.isConnected) {
        hud = hudInit();
        if (!hud) return;
      }
      let card = n.cur && (n.cur.k === "card" || n.cur.k === "fb" || n.cur.k === "panel"),
        facesOnly = !!(card && n.cur.id === "focus" && n.cur.faces),
        on = p.state === "op" && !!n.scene && (!card || facesOnly) && !n.egg;
      for (let z of [hud.where, hud.goal]) hudShow(z, !facesOnly);
      if ((hudShow(hud.root, on), (chipDrawn = ""), !on)) return;
      let s = n.scene;
      hudText(hud.chapter, s.startsWith("M") ? "CH4 \xB7 MARS" : s.startsWith("P") ? "CH3 \xB7 PHOBOS" : s.startsWith("G") ? "CH2 \xB7 GAS STOP" : "CH1 \xB7 STORMTOP");
      hudShow(hud.chapter, n.room !== "lobby");
      // Stars: the pill pops when the total goes up; the first time it shows, the chip spot explains it.
      (n.stars > starPop.last && (starPop.at = n.T), (starPop.last = n.stars), n.starOn && starPop.hintAt < 0 && (starPop.hintAt = performance.now()));
      (hudShow(hud.stars, n.starOn), hudText(hud.stars, "★ " + n.stars));
      let pop = Math.max(0, 1 - (n.T - starPop.at) / 0.35);
      hud.stars.style.transform = pop > 0 ? "scale(" + (1 + 0.28 * Math.sin(pop * Math.PI)).toFixed(3) + ")" : "";
      // The ↺ hold shows its progress as a ring filling inside the button.
      let h = ch2.resetHold,
        fill = h && h.on ? Math.min(1, h.t / 0.75) : 0;
      hud.reset.style.background = fill > 0 ? "conic-gradient(#8fdcff " + Math.round(fill * 360) + "deg, #fffaf0 0deg)" : "#fffaf0";
      // Who: two faces where both characters are playable now, else only the active face, smaller.
      let both = O2(),
        mops = !!x.mops && !(s.startsWith("M") && H.gone),
        glow =
          both &&
          (x.sing || (s === "S9" && x.lureBot.look > 0) || (s === "S11" && x.lureBot.look > 0) || (s.startsWith("G") && ch2ChipKey() === "kitchen:mops")),
        big = both ? 40 : 30;
      for (let [b, me] of [
        [hud.sq, !mops],
        [hud.mo, mops],
      ]) {
        hudShow(b, both || me);
        let css = big + "px";
        (b.style.width !== css && ((b.style.width = css), (b.style.height = css)),
          (b.style.opacity = me ? "1" : "0.45"),
          // The one you are always sits in the corner; the other face sits to its left.
          (b.style.order = me ? "2" : "1"),
          (b.style.animation = glow && !me ? "ssGlow 0.9s ease-in-out infinite" : "none"),
          b.setAttribute("aria-pressed", me ? "true" : "false"),
          (b.disabled = !both));
      }
      // Goal: the chip, with the countdown and the tank under it.
      let t = chipText(),
        cnt = s.startsWith("G") && ch2.phase === "g3hide" && !de() ? "HIDE! " + Math.max(0, Math.ceil(ch2.timer)) : "",
        tank = n.room === "gas" ? (ch2.fuel ? "TANK FULL" : "TANK EMPTY") : "";
      (hudShow(hud.chip, !!t), hudText(hud.chip, t), (chipDrawn = t === n.chip ? t : ""));
      (hudShow(hud.count, !!cnt), hudText(hud.count, cnt));
      (hudShow(hud.tank, !!tank), hudText(hud.tank, tank));
      // Points just won or lost ("Hidden in time! +100"), under the goal for as long as the spark lasts.
      let sp = n.sparks.filter((q) => q.x === 300),
        pt = sp.length ? sp[sp.length - 1].s : "";
      (hudShow(hud.pop, !!pt), hudText(hud.pop, pt), sp.length && (hud.pop.style.opacity = Math.min(1, sp[sp.length - 1].t).toFixed(2)));
      tank && ((hud.tank.style.background = ch2.fuel ? "#e7fff3" : "#fff1f0"), (hud.tank.style.color = ch2.fuel ? "#157a45" : "#b91c1c"));
      (hudLayout(t + "|" + cnt + "|" + tank + "|" + pt + "|" + both + "|" + n.starOn + "|" + n.stars + "|" + mops), hudSound());
    }
    // The sound button sits in the controls row under the picture (page text, made by the page shell).
    function hudSound() {
      let b = document.getElementById("ss-sound"),
        line = document.getElementById("ss-sound-line");
      if (!b) return;
      let st = soundState(),
        key = st + (st === "on" ? z : "");
      if (b.dataset.state !== key) {
        b.dataset.state = key;
        let waves = st === "on" ? '<path d="M17 9a4 4 0 0 1 0 6" fill="none" stroke="#1e2430" stroke-width="2.4" stroke-linecap="round"/>' + (z >= 1 ? '<path d="M20 6a8 8 0 0 1 0 12" fill="none" stroke="#1e2430" stroke-width="2.4" stroke-linecap="round"/>' : "") : "",
          mark = st === "muted" ? '<line x1="15" y1="6" x2="22" y2="18" stroke="#e5533d" stroke-width="3" stroke-linecap="round"/>' : st === "blocked" ? '<text x="19" y="17" font-size="12" font-weight="900" fill="#e8590c" text-anchor="middle">?</text>' : "";
        ((b.innerHTML = '<svg width="26" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z" fill="#1e2430"/>' + waves + mark + "</svg>"),
          b.setAttribute("aria-label", st === "on" ? "Sound on" : st === "muted" ? "Sound off" : "Sound blocked"));
      }
      line && (line.style.display = soundLineShown() ? "" : "none");
    }
    // Puts the goal in the top row when it fits between the where and who zones, else in a row of its own under them.
    function hudLayout(key) {
      let W = hud.root.clientWidth;
      if (hud.key === key + "|" + W) return;
      hud.key = key + "|" + W;
      let wr = hud.where.offsetLeft + hud.where.offsetWidth,
        fl = hud.faces.offsetWidth ? hud.faces.offsetLeft : W - 6,
        gap = 10,
        room = 2 * Math.min(W / 2 - wr, fl - W / 2) - 2 * gap,
        fs = W < 600 ? 15 : 20,
        g = hud.goal;
      ((hud.chip.style.fontSize = fs + "px"), (g.style.maxWidth = Math.max(0, room) + "px"), (g.style.top = "6px"));
      // Too narrow for the chip in the top row (a phone): its own row under the zones, the full width.
      if (room < 220 || hud.chip.offsetWidth > room) {
        let below = Math.max(hud.where.offsetTop + hud.where.offsetHeight, hud.faces.offsetTop + hud.faces.offsetHeight) + 6;
        ((g.style.maxWidth = W - 12 + "px"), (g.style.top = below + "px"));
      }
    }
