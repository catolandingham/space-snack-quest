// Core: the page wrapper, sound and songs, the title screen, drawing helpers, the speaker names, the story queue and bubbles, walk bounds and solids.
  function Eb() {
    return {
      kind: "light",
      bg: { base: "#ffffff", subtle: "#f6f7f9", elevated: "#ffffff" },
      text: {
        primary: "#111827",
        secondary: "#4b5563",
        tertiary: "#6b7280",
        onColor: "#ffffff",
        onPrimary: "#ffffff",
        accent: "#2563eb",
        success: "#15803d",
        warning: "#b45309",
        danger: "#b91c1c",
        accentDeep: "#1d4ed8",
        successDeep: "#166534",
        warningDeep: "#92400e",
        dangerDeep: "#991b1b",
      },
      fill: {
        primary: "#111827",
        primaryHover: "#000",
        secondary: "#eef0f3",
        secondaryHover: "#e5e7eb",
        hover: "#f3f4f6",
        pressed: "#e5e7eb",
        accent: "#2563eb",
        controlChecked: "#2563eb",
        accentSubtle: "#dbeafe",
        successSubtle: "#dcfce7",
        warningSubtle: "#fef3c7",
        dangerSubtle: "#fee2e2",
      },
      border: { subtle: "#eef0f3", weak: "#e5e7eb", default: "#d1d5db", strong: "#9ca3af", focus: "#2563eb" },
      font: {
        family: "Helvetica, Arial, sans-serif",
        mono: "monospace",
        label: { fontSize: "14px", lineHeight: "19px", letterSpacing: "0" },
      },
      radius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
      dataviz: { categorical: ["#2563eb", "#eab308", "#06b6d4"], other: "#9ca3af" },
    };
  }
  var YV,
    kb,
    Ob = ed(() => {
      "use strict";
      ((YV = _n(Cf())), (kb = _n(ro())));
    });
  function wb() {
    return typeof window > "u"
      ? !1
      : (typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches) ||
          (typeof navigator < "u" && navigator.maxTouchPoints > 0);
  }
  function Nb() {
    if (typeof window > "u") return !1;
    let V = typeof screen < "u" ? screen.orientation : void 0;
    return (V && typeof V.type == "string" && V.type.indexOf("landscape") === 0) || (typeof screen < "u" && screen.width > screen.height)
      ? !0
      : window.innerWidth > window.innerHeight;
  }
  // The short side of the window (not the screen), so the picture fits what the player can see.
  function Rb() {
    return typeof window > "u" ? 640 : Math.min(window.innerWidth, window.innerHeight);
  }
  function s8(V, t) {
    let a = V.getContext("2d");
    if (!a) throw new Error("no 2d context");
    let e = a,
      f = t.font && t.font.indexOf("var(") < 0 ? t.font : "system-ui, -apple-system, sans-serif",
      u = t.touch,
      h = !0,
      c = 960,
      b = 640,
      y = "#1e2430",
      U = "Sir Mops-a-Lot",
      E = (l, o) => l + Math.random() * (o - l),
      w = (l, o, i) => Math.max(o, Math.min(i, l)),
      nV = (l) => l[Math.floor(Math.random() * l.length)],
      S = null,
      M = null,
      // Under the master volume M: the music level (MU) and the sound-effects level (FX), at the levels the
      // modules set (src/modules/sound-mix.js, Brian 2026-11-24 sound plan section 8).
      MU = null,
      FX = null,
      z = 1;
    // The address the real game is played at (Brian, 2026-11-23: "We can drop first website and just go with
    // Squatch"; the old site is deleted). Anywhere else is a preview: test links work there and saves use other keys.
    const LIVE_HOSTS = ["squatch.onrender.com"];
    // The live site and local tests keep ssq-*. This branch's preview uses ssq-day2- so it does not mix with the live game or the slice preview.
    function ssqKey(name) {
      let host = "";
      try {
        host = location.hostname || "";
      } catch {}
      return (LIVE_HOSTS.includes(host) || host === "localhost" || host === "127.0.0.1" || host === "" ? "ssq-" : "ssq-day2-") + name;
    }
    // Sound: one button for music and sound effects, off until the player taps it (Brian, 2026-11-23, the
    // Battle Ostriches plan). The choice is saved on this device ("on" or "off"). A player from before this
    // change keeps sound on if a volume above zero was saved. Nothing saved: off.
    try {
      let on = window.localStorage.getItem(ssqKey("sound")),
        l = window.localStorage.getItem(ssqKey("vol"));
      z = on === "on" ? 1 : on === "off" ? 0 : l !== null && parseFloat(l) > 0 ? 1 : 0;
    } catch {
      z = 0;
    }
    let G = z === 0;
    function Z(l) {
      ((z = l), (G = l === 0));
      try {
        M && S && M.gain.setValueAtTime(0.5 * l, S.currentTime);
      } catch {}
      try {
        window.localStorage.setItem(ssqKey("sound"), l > 0 ? "on" : "off");
      } catch {}
    }
    // The speaker was tapped: sound on (started inside this tap, as iPhones require) or off.
    function eV() {
      G ? (Z(1), VV(), warmPrime(), lV(660, 0.08, "square", 0.12)) : (Z(0), warmEl && !warmEl.paused && warmEl.pause());
    }
    // The M key does what the speaker does (one switch for music and sound effects).
    function W() {
      eV();
    }
    // Effects are Web Audio oscillators. Joe's warm theme is one file, music/main-theme-from-brian.mp3. One
    // AudioContext, made and resumed only while sound is on: by the tap on the speaker that turns it on, and
    // then by any touch, click or key while it is not running (J2 in 90-input-shell.js), for example after the
    // phone was locked or the page opened again with sound left on. A browser can keep it suspended after a
    // touch (Brave Shields on an iPhone does); then the sound icon shows "blocked" and a tap on it says so and
    // tries again.
    let soundTry = -1,
      soundAsk = -1;
    function VV() {
      // Sound off: never start the sound engine (taps on the game do not turn sound on).
      if (G) return;
      try {
        if (!S) {
          let i = window,
            s = i.AudioContext || i.webkitAudioContext;
          if (!s) return;
          ((S = new s()), (M = S.createGain()), (M.gain.value = 0.5 * z), M.connect(S.destination));
          let mix = (window.SSQ && window.SSQ.mix) || {};
          ((MU = S.createGain()), (MU.gain.value = mix.music || 1), MU.connect(M), (FX = S.createGain()), (FX.gain.value = mix.effects || 1), FX.connect(M));
          // On an iPhone, play through the ring/silent switch like a video does.
          try {
            navigator.audioSession && (navigator.audioSession.type = "playback");
          } catch {}
        }
        if (S.state !== "running" && S.state !== "closed") {
          soundTry < 0 && (soundTry = performance.now());
          let r = S.resume();
          r && r.catch && r.catch(() => {});
        }
        let l = S.createBuffer(1, 1, 22050),
          o = S.createBufferSource();
        ((o.buffer = l), o.connect(S.destination), o.start(0));
      } catch {}
    }
    // What the sound icon shows: "muted" (the player turned it off), "on" (playing), or "blocked" (no
    // touch yet, or the browser keeps sound off after one).
    function soundState() {
      return G ? "muted" : S && S.state === "running" ? "on" : "blocked";
    }
    // True when a touch tried to start sound, and the browser still has it off a moment later.
    function soundRefused() {
      return soundState() === "blocked" && soundTry >= 0 && performance.now() - soundTry > 600;
    }
    // The sound icon was tapped: if sound is on but the browser has not started it yet, start it; else switch
    // sound on or off.
    function soundTap() {
      soundState() === "blocked" ? (VV(), warmPrime(), (soundAsk = performance.now())) : eV();
    }
    function soundLineShown() {
      let l = performance.now() - soundAsk;
      return soundAsk >= 0 && l > 600 && l < 5e3 && soundState() === "blocked";
    }
    function Ve() {
      try {
        document.hidden && warmEl && !warmEl.paused && warmEl.pause();
        if (!S) return;
        document.hidden ? S.suspend().catch(() => {}) : S.state !== "running" && S.resume().catch(() => {});
      } catch {}
    }
    function lV(l, o, i = "square", s = 0.14, q = 0, d = null) {
      if (!(!S || !M || G))
        try {
          if (S.state === "closed") return;
          let A = S.currentTime + q,
            T = S.createOscillator(),
            R = S.createGain();
          ((T.type = i),
            T.frequency.setValueAtTime(l, A),
            d && T.frequency.exponentialRampToValueAtTime(d, A + o),
            R.gain.setValueAtTime(1e-4, A),
            R.gain.exponentialRampToValueAtTime(s, A + 0.01),
            R.gain.exponentialRampToValueAtTime(1e-4, A + o),
            T.connect(R),
            R.connect(FX || M),
            T.start(A),
            T.stop(A + o + 0.05));
        } catch {}
    }
    let Da = (l) => 440 * Math.pow(2, (l - 69) / 12),
      ji = (l, o, i = "triangle") => l.forEach((s, q) => lV(Da(s), o, i, 0.15, q * o * 0.7)),
      D = {
        grab: () => {
          (lV(660, 0.08), lV(990, 0.14, "square", 0.12, 0.08));
        },
        pickup: () => ji([72, 76, 79, 84], 0.1),
        alarm: () => {
          (window.SSQ && window.SSQ.alarmSound && window.SSQ.alarmSound()) || (lV(700, 0.18, "sawtooth", 0.06), lV(1e3, 0.18, "sawtooth", 0.06, 0.2));
        },
        slip: () => {
          (lV(700, 0.6, "sine", 0.18, 0, 140), lV(300, 0.3, "triangle", 0.1, 0.25, 900));
        },
        caught: () => ji([67, 63, 60, 55], 0.2, "square"),
        bzzt: () => lV(120, 0.35, "sawtooth", 0.14),
        key: () => lV(1200, 0.05, "square", 0.08),
        open: () => ji([60, 64, 67, 72, 76, 79, 84], 0.12),
        baa: () => {
          for (let l = 0; l < 7; l++) lV(l % 2 ? 440 : 400, 0.07, "sawtooth", 0.06, l * 0.05);
        },
        bleep: () => {
          (lV(880, 0.06, "square", 0.07), lV(660, 0.08, "square", 0.06, 0.09));
        },
        slurp: () => lV(520, 0.45, "sine", 0.16, 0, 90),
        hide: () => lV(320, 0.09, "sine", 0.12, 0, 180),
        snore: () => {
          (lV(220, 0.6, "sine", 0.12, 0, 110), lV(200, 0.6, "sine", 0.1, 0.7, 100));
        },
        splash: () => lV(500, 0.25, "sine", 0.12, 0, 120),
        pop: () => lV(220, 0.1, "sine", 0.07, 0, 70),
        zap: () => lV(1400, 0.3, "sawtooth", 0.05, 0, 300),
      };
    let N1 = 0;
    function Bb(l, o) {
      if (!S || !M || G || l < 0.01) return;
      N1++;
      let i = S.currentTime,
        s = S.createGain(),
        q = S.createStereoPanner
          ? (() => {
              let R = S.createStereoPanner();
              return ((R.pan.value = w(o, -1, 1)), R.connect(FX || M), R);
            })()
          : FX || M;
      s.connect(q);
      let d = Math.floor(Math.random() * 4),
        A = 0.05 * l,
        T = (R) => {
          (s.gain.setValueAtTime(1e-4, i),
            s.gain.exponentialRampToValueAtTime(A, i + 0.015),
            s.gain.exponentialRampToValueAtTime(1e-4, i + R));
        };
      if (d === 0) {
        let R = S.createOscillator();
        ((R.type = "sine"),
          R.frequency.setValueAtTime(900 + Math.random() * 700, i),
          R.frequency.setValueAtTime(1300 + Math.random() * 900, i + 0.07),
          R.connect(s),
          T(0.16),
          R.start(i),
          R.stop(i + 0.18));
      } else if (d === 1) {
        let R = S.createOscillator();
        ((R.type = "triangle"),
          R.frequency.setValueAtTime(500 + Math.random() * 300, i),
          R.frequency.exponentialRampToValueAtTime(260, i + 0.14),
          R.connect(s),
          T(0.16),
          R.start(i),
          R.stop(i + 0.18));
      } else if (d === 2) {
        let R = S.createOscillator(),
          P = S.createBiquadFilter();
        ((R.type = "sawtooth"),
          (R.frequency.value = 180 + Math.random() * 60),
          (P.type = "bandpass"),
          (P.Q.value = 6),
          P.frequency.setValueAtTime(700, i),
          P.frequency.linearRampToValueAtTime(1800, i + 0.3),
          R.connect(P),
          P.connect(s),
          s.gain.setValueAtTime(1e-4, i),
          s.gain.linearRampToValueAtTime(A * 0.6, i + 0.08),
          s.gain.linearRampToValueAtTime(1e-4, i + 0.34),
          R.start(i),
          R.stop(i + 0.36));
      } else
        for (let R = 0; R < 3; R++) {
          let P = S.createOscillator(),
            _ = S.createGain();
          ((P.type = "square"),
            (P.frequency.value = 1600 + R * 240 + Math.random() * 200),
            _.gain.setValueAtTime(1e-4, i + R * 0.05),
            _.gain.exponentialRampToValueAtTime(A * 0.35, i + R * 0.05 + 0.008),
            _.gain.exponentialRampToValueAtTime(1e-4, i + R * 0.05 + 0.04),
            P.connect(_),
            _.connect(q),
            P.start(i + R * 0.05),
            P.stop(i + R * 0.05 + 0.05));
        }
    }
    let gs = 1;
    function Gb(l, o, i, s, q) {
      if (!o.length || ((gs -= l), gs > 0)) return;
      gs = 0.5 + Math.random() * 1.3;
      let d = o[Math.floor(Math.random() * o.length)],
        A = d.x - i;
      if (A < -40 || A > 1e3) return;
      let T = Math.hypot(d.x - s, d.y - q);
      Bb(w(1.1 - T / 700, 0.15, 1), (A - 480) / 480);
    }
    let R1 = 0;
    function z1() {
      !S ||
        !M ||
        G ||
        (R1++,
        lV(70, 0.8, "sawtooth", 0.022, 0, 105),
        lV(140, 0.8, "triangle", 0.018, 0, 190),
        lV(620, 0.9, "sine", 0.012, 1.05, 380),
        lV(95, 1, "sine", 0.02, 1, 75));
    }
    let U1 = [
        [
          [74, 0.42],
          [74, 0.45],
          [78, 0.28],
          [69, 0.4],
          [69, 0.9],
        ],
        [
          [74, 0.26],
          [74, 0.68],
          [69, 0.36],
          [69, 0.29],
          [69, 0.42],
          [69, 0.43],
          [69, 0.5],
        ],
        [
          [74, 0.95],
          [78, 0.78],
          [86, 1.29],
          [86, 0.7],
        ],
        [
          [74, 0.54],
          [74, 1.18],
          [86, 0.6],
          [86, 0.2],
          [86, 0.3],
          [86, 1.1],
        ],
        [
          [75, 0.3],
          [74, 0.4],
          [78, 0.32],
          [82, 0.15],
          [71, 1.2],
          [67, 0.21],
          [68, 0.18],
          [69, 0.32],
          [77, 0.21],
          [78, 0.35],
          [78, 0.3],
          [78, 0.6],
        ],
        [
          [76, 0.43],
          [83, 0.38],
          [84, 0.29],
          [81, 0.3],
          [74, 0.6],
        ],
      ],
      Hb = 0;
    function Fi(l, o, i) {
      if (!(!S || !M || G))
        try {
          let s = S.currentTime + i,
            q = S.createOscillator(),
            d = S.createOscillator(),
            A = S.createGain(),
            T = S.createOscillator(),
            R = S.createGain();
          ((q.type = "triangle"),
            (q.frequency.value = l),
            (d.type = "sine"),
            (d.frequency.value = l / 2),
            (T.frequency.value = 5.5),
            R.gain.setValueAtTime(0, s),
            R.gain.linearRampToValueAtTime(l * 0.012, s + Math.min(0.35, o)),
            T.connect(R),
            R.connect(q.frequency),
            R.connect(d.frequency),
            A.gain.setValueAtTime(1e-4, s),
            A.gain.exponentialRampToValueAtTime(0.14, s + 0.04),
            A.gain.setValueAtTime(0.12, s + Math.max(0.05, o - 0.08)),
            A.gain.exponentialRampToValueAtTime(1e-4, s + o + 0.06));
          let P = S.createGain();
          ((P.gain.value = 0.35), q.connect(A), d.connect(P), P.connect(A), A.connect(MU || M));
          for (let _ of [q, d, T]) (_.start(s), _.stop(s + o + 0.1));
        } catch {}
    }
    function co() {
      if (!S) return;
      let l = U1[Hb++ % U1.length],
        o = 0;
      for (let [i, s] of l) (Fi(Da(i), s * 0.95, o), (o += s));
      for (let i = 0; i < o; i += 0.395) lV(Da(i % 0.79 < 0.395 ? 50 : 57), 0.3, "sine", 0.06, i);
      songUntil = p.t + o;
    }
    // Singing or music, never both (src/modules/music-rules.js).
    let songUntil = 0;
    function singNow() {
      return !!(window.SSQ && window.SSQ.singingNow && window.SSQ.singingNow(p.t, songUntil, n.cur));
    }
    let vV = [],
      ea = [],
      Ca = 1;
    try {
      let l = window.localStorage.getItem(ssqKey("unlocked"));
      l && (Ca = w(parseInt(l, 10) || 1, 1, 4));
    } catch {}
    function Ml(l) {
      Ca = Math.max(Ca, l);
      try {
        window.localStorage.setItem(ssqKey("unlocked"), String(Ca));
      } catch {}
    }
    let p = {
        state: "title",
        t: 0,
        verb: "",
        shown: new Set(),
      };
    function GV(l) {
      p.state = l;
    }
    let K1 = ["Stormtop Station", "Asteroid Belt Gas Stop", "Phobos, the Tiny Moon", "Mars!"];
    function J1() {
      Vf();
    }
    function Vf() {
      if ((VV(), p.state === "op")) {
        nf();
        return;
      }
      af();
    }
    function af() {
      if ((VV(), p.state === "title")) {
        I0(Ca);
        return;
      }
      p.state === "op" && nf();
    }
    let qe = {},
      qt = { x: 0, y: 0, active: !1 },
      // The big action button is down (pointer). Keys are in qe. Used by the kitchen duck: hold to stay down (R99).
      actHeld = !1;
    function actionHeld() {
      return actHeld || !!(qe.KeyE || qe.Enter || qe.Space);
    }
    function actionPress() {
      ((actHeld = !0), Vf());
    }
    function actionRelease() {
      actHeld = !1;
    }
    let musicKind = "",
      musicWait = 0,
      warmEl = null,
      warmFade = 0,
      warmPlayState = "",
      warmStarting = false,
      warmGain = null,
      warmVia = "";
    // The theme file goes through the game's master volume (a gain node), so it fades out on an iPhone too:
    // iPhones ignore an <audio> element's volume (Brian 20a: the theme fades as the morning begins). A page
    // opened straight from disk keeps the element's own volume (the browser would make the routed sound silent).
    function warmMake() {
      if (warmEl) return warmEl;
      ((warmEl = new Audio("music/main-theme-from-brian.mp3")), (warmEl.loop = !0), (warmEl.preload = "auto"));
      try {
        /^https?:$/.test(location.protocol) &&
          S &&
          M &&
          S.createMediaElementSource &&
          ((warmGain = S.createGain()), (warmGain.gain.value = 0), S.createMediaElementSource(warmEl).connect(warmGain), warmGain.connect(MU || M), (warmVia = "gain"));
      } catch {
        warmGain = null;
      }
      warmVia || (warmVia = "element");
      return warmEl;
    }
    let warmSet = -1;
    function warmLevel(v) {
      if (warmGain) {
        warmEl.volume = 1;
        // A new ramp only when the level really changes (not one per frame).
        if (Math.abs(v - warmSet) < 0.002) return;
        warmSet = v;
        try {
          warmGain.gain.setTargetAtTime(v, S.currentTime, 0.04);
        } catch {
          warmGain.gain.value = v;
        }
      } else warmEl.volume = Math.max(0, Math.min(1, 0.5 * z * v));
    }
    // The music element: which file plays for each cue (title, home, gift, heart, hall, sneak, and the party's
    // musicCue) is src/modules/music-picks.js (Brian 2026-11-26); the journey stays generated. The file is made and first started inside a tap (warmPrime), since iPhones refuse to
    // start it otherwise; after that warmTick plays and pauses it.
    function warmWhy() {
      if (G) return "";
      if (p.state === "title") return "title";
      if (p.state !== "op") return "";
      // The morning has the room's music (its pick in src/modules/music-picks.js) until "That evening…".
      if (window.SSQ && window.SSQ.homeMusic && window.SSQ.homeMusic.owns()) return "";
      // The party night has its own music (the band; src/modules/party-sound.js), except the moments it names (musicCue).
      if (window.SSQ && window.SSQ.beat("ch1-party") && window.SSQ.beat("ch1-party").active()) return (window.SSQ.beat("ch1-party").musicCue && window.SSQ.beat("ch1-party").musicCue()) || "";
      if (n.roomWalk) return "";
      if ((n.ch1Night && n.scene === "Q4" && n.ctrl) || (n.ch1Sneak && n.ctrl)) return "sneak";
      if (n.ch1Heart) return "heart";
      if (n.gift || n.holdToy) return "gift";
      return n.room === "closet" ? "home" : n.room === "hall" && !n.ch1Night ? "hall" : "";
    }
    function musicWant() {
      if (singNow()) return "";
      if (warmWhy()) return "warm";
      if (p.state !== "op") return "";
      if (n.ch1Heart) return "warm";
      if (n.roomWalk || n.ch1Journey) return "journey";
      if ((n.ch1Night && n.scene === "Q4" && n.ctrl) || (n.ch1Sneak && n.ctrl)) return "sneak";
      return "";
    }
    // Make the music file and start it inside the player's tap: iPhones start an audio file only from a tap,
    // and only some parts of a tap count (finger down is refused, finger up is allowed), so every tap tries
    // again while the file is paused. If no warm cue is on once it starts, it is paused at once; warmTick plays
    // it when a cue comes on. A file started this way may play from then on without a tap.
    function warmPrime() {
      if (G || !S) return;
      try {
        warmMake();
        if (warmEl.paused && !warmStarting) {
          ((warmStarting = !0), warmFade < 0.02 && (warmGain ? (warmGain.gain.cancelScheduledValues(S.currentTime), (warmGain.gain.value = 0), (warmSet = 0)) : (warmEl.volume = 0)));
          let pr = warmEl.play();
          pr &&
            pr.then(
              () => ((warmStarting = !1), (warmPlayState = "ok"), warmWhy() || warmEl.pause()),
              (err) => ((warmStarting = !1), (warmPlayState = "err:" + (err && err.name))),
            );
        }
      } catch {}
    }
    function warmTick(dt, on) {
      let goal = on && !G && z > 0 ? 1 : 0;
      if (!warmEl && !goal) return;
      if (!S) return;
      if (!warmEl)
        try {
          warmMake();
        } catch (err) {
          warmPlayState = "err:" + (err && err.name);
          return;
        }
      let step = Math.min(1, (dt || 0) / 0.45);
      warmFade += (goal - warmFade) * step;
      if (warmFade < 0.02 && !goal) ((warmFade = 0), (warmStarting = !1), warmEl.paused || warmEl.pause());
      else {
        warmLevel(warmFade * (window.SSQ && window.SSQ.musicSpan ? window.SSQ.musicSpan(warmEl, warmWhy()) : 1));
        if (warmEl.paused && goal > 0 && !warmStarting) {
          warmStarting = !0;
          warmPlayState = "pending";
          let pending = warmEl.play();
          pending &&
            pending.then(
              () => ((warmStarting = !1), (warmPlayState = "ok")),
              (err) => ((warmStarting = !1), (warmPlayState = "err:" + (err && err.name))),
            );
        }
      }
      window.__ss && ((window.__ss.warmPlay = warmPlayState), (window.__ss.warmCue = window.SSQ && window.SSQ.musicCue ? window.SSQ.musicCue(warmWhy()) : warmWhy()), (window.__ss.warmPaused = !!warmEl.paused), (window.__ss.warmVia = warmVia));
    }
    function musicTick(l) {
      // Brian's Floating in Space (the morning, src/modules/home-music.js): it fades out off the game screen.
      window.SSQ && window.SSQ.homeMusic && (p.state === "op" || window.SSQ.homeMusic.stop(), window.SSQ.homeMusic.tick(l));
      // The morning's snoring (src/modules/morning-sound.js) stops off the game screen too (the beat ticks only there).
      window.SSQ && window.SSQ.morningSound && p.state !== "op" && window.SSQ.morningSound.snore(!1);
      let want = musicWant();
      want !== musicKind && ((musicKind = want), (musicWait = 0));
      window.__ss && (window.__ss.music = want);
      warmTick(l, want === "warm");
      if (!want || want === "warm") return;
      if (((musicWait -= l), musicWait > 0)) return;
      musicWait = want === "sneak" ? 2.8 : want === "journey" ? 3.4 : 4.6;
      want === "sneak" ? ji([48, 51, 55, 51], 0.2, "triangle") : ji([55, 59, 62, 67, 71], 0.18, "triangle");
    }
    function ep(l) {
      p.t += l;
      for (let q of ea) ((q.x += q.vx * l), (q.y += q.vy * l), (q.t -= l));
      ea = ea.filter((q) => q.t > 0);
      p.state === "op" && y5(l),
        musicTick(l);
    }
    function m(l, o, i, s, q) {
      let d = Math.max(0, Math.min(q, i / 2, s / 2));
      (e.beginPath(),
        e.moveTo(l + d, o),
        e.arcTo(l + i, o, l + i, o + s, d),
        e.arcTo(l + i, o + s, l, o + s, d),
        e.arcTo(l, o + s, l, o, d),
        e.arcTo(l, o, l + i, o, d),
        e.closePath());
    }
    function L(l, o, i) {
      (e.beginPath(), e.arc(l, o, Math.abs(i), 0, Math.PI * 2));
    }
    function X(l, o, i, s) {
      (e.beginPath(), e.ellipse(l, o, Math.abs(i), Math.abs(s), 0, 0, Math.PI * 2));
    }
    function r(l, o = 2) {
      (l && ((e.fillStyle = l), e.fill()),
        o && ((e.strokeStyle = y), (e.lineWidth = o), (e.lineJoin = "round"), (e.lineCap = "round"), e.stroke()));
    }
    function C(l, o, i) {
      (e.beginPath(), e.moveTo(l[0], l[1]));
      for (let s = 2; s < l.length; s += 2) e.lineTo(l[s], l[s + 1]);
      ((e.strokeStyle = o), (e.lineWidth = i), (e.lineCap = "round"), (e.lineJoin = "round"), e.stroke());
    }
    function textFloor(l) {
      // 14 CSS px on the real iPad (1024x768 and 768x1024). The canvas is 960 wide.
      let w = e.canvas && e.canvas.clientWidth,
        scale = w ? w / c : 1;
      return Math.max(l || 0, Math.ceil(14 / Math.min(1, Math.max(scale, 0.5))));
    }
    function ge(l, o = 800) {
      e.font = o + " " + textFloor(l) + "px " + f;
    }
    function Us(l) {
      (p.shown.size > 3e4 && p.shown.clear(), p.shown.add(l));
    }
    function g(l, o, i, s, q = y, d = "center", A = 800) {
      (l && Us(l), ge(s, A), (e.textAlign = d), (e.textBaseline = "middle"), (e.fillStyle = q), e.fillText(l, o, i));
    }
    function zt(l, o, i) {
      (Us(l), ge(i));
      let s = [],
        q = "";
      for (let d of l.split(" ")) {
        let A = q ? q + " " + d : d;
        e.measureText(A).width > o && q ? (s.push(q), (q = d)) : (q = A);
      }
      return (q && s.push(q), s);
    }
    function At(l, o, i, s, q = "#ffffff", d = 14) {
      (m(l, o, i, s, d), r(q, 3));
    }
    function Cn(l, o, i, s = "#ffffff", q = 20, d = 300) {
      let A = zt(i, d, q);
      ge(q);
      let T = Math.max(...A.map((gV) => e.measureText(gV).width)) + 24,
        R = A.length * (q + 4) + 16,
        P = w(l - T / 2, 6, c - T - 6),
        _ = w(o - R - 12, 56, b - R - 6),
        $ = w(l, P + 16, P + T - 16);
      (e.beginPath(),
        e.moveTo($ - 8, _ + R - 1),
        e.lineTo($, _ + R + 11),
        e.lineTo($ + 8, _ + R - 1),
        e.closePath(),
        r(s, 3),
        m(P, _, T, R, 12),
        r(s, 3),
        (e.fillStyle = s),
        e.fillRect($ - 6, _ + R - 3, 12, 5),
        A.forEach((gV, oe) => g(gV, P + T / 2, _ + 8 + q / 2 + oe * (q + 4), q)));
    }
    function Ut(l, o, i, s) {
      (e.save(), L(o, i, s), e.clip());
      let q =
          l === "jupiter"
            ? ["#ffe9c9", "#f2a65a", "#ffd9a8", "#e98a4a", "#ffe9c9", "#f2a65a"]
            : l === "mars"
              ? ["#e56b3d", "#d85a2f", "#ee7f52"]
              : ["#c9ced8", "#b5bcc8"],
        d = (2 * s) / q.length;
      (q.forEach((A, T) => {
        ((e.fillStyle = A), e.fillRect(o - s, i - s + T * d, 2 * s, d + 1));
      }),
        l === "jupiter" && (X(o + s * 0.35, i + s * 0.25, s * 0.2, s * 0.1), r("#e5533d", 0)),
        e.restore(),
        L(o, i, s),
        r(null, 2.5));
    }
    function O0(l, o, i, s) {
      (e.save(), e.translate(l, o - s.hop), e.scale(i, 1));
      let q = s.moving ? Math.sin(s.walk) * 2.5 : 0;
      if ((m(-8, 10 + q, 7, 10, 2), r("#8b5a3c", 2), m(1, 10 - q, 7, 10, 2), r("#8b5a3c", 2), s.dis === "trash")) {
        (m(-23, -8, 6, 14, 3),
          r("#8b5a3c", 2),
          m(17, -8, 6, 14, 3),
          r("#8b5a3c", 2),
          m(-17, -26, 34, 40, 5),
          r("#b5bcc8", 2.5),
          m(-19, -31, 38, 7, 2),
          r("#dfe4ea", 2.5),
          L(-7, -14, 5),
          r("#ffcf33", 2),
          L(7, -14, 5),
          r("#ffcf33", 2),
          C([-8, 2, 8, 2], y, 2),
          e.restore());
        return;
      }
      (m(-21, -10, 8, 18, 2),
        r("#ffffff", 2),
        m(-14, -10, 28, 24, 10),
        r("#8b5a3c", 2.5),
        s.singing
          ? (e.save(), e.translate(14, -6), e.rotate(-2.3 + Math.sin(p.t * 10) * 0.3), m(-3, 0, 6, 15, 3), r("#8b5a3c", 2), e.restore())
          : (m(12, -6, 6, 15, 3), r("#8b5a3c", 2)),
        m(-18, -6, 6, 15, 3),
        r("#8b5a3c", 2),
        L(0, -20, 12),
        r("#8b5a3c", 2.5),
        X(2, -18, 7.5, 6.5),
        r("#f0bf93", 2),
        (e.fillStyle = y),
        e.fillRect(-1.5, -21, 2.2, 2.6),
        e.fillRect(4, -21, 2.2, 2.6),
        s.singing ? (X(2.5, -14.5, 2, 2.2 + Math.sin(p.t * 14) * 0.6), r(y, 0)) : ((e.fillStyle = y), e.fillRect(0.5, -15.5, 4, 1.4)),
        s.dis === "goat" &&
          (e.beginPath(),
          e.moveTo(-4, -13),
          e.lineTo(9, -13),
          e.lineTo(3, 6),
          e.closePath(),
          r("#ffffff", 2),
          C([-7, -29, -13, -39], y, 3),
          C([7, -29, 13, -39], y, 3)),
        e.beginPath(),
        e.arc(0, -31, 7, Math.PI, 0),
        e.closePath(),
        r("#8fdcff", 2),
        m(-9, -32, 18, 3, 1.5),
        r("#ffffff", 2),
        C([0, -38, 0, -44], y, 1.5),
        L(0, -45, 2),
        r("#e5533d", 1),
        e.restore());
    }
    function up() {
      ((e.fillStyle = "#eef3fb"),
        e.fillRect(0, 0, c, b),
        Ut("jupiter", 830, 130, 140),
        Ut("mars", 110, 330, 54),
        g("SNEAKY SASQUATCH", c / 2, 66, 56),
        g("SPACE SNACK QUEST", c / 2, 116, 32, "#3478f6"));
      let l = Math.sin(p.t * 0.8) > 0.3;
      (e.save(),
        e.translate(380, 300),
        e.scale(3, 3),
        O0(0, 0, 1, { walk: p.t * 8, moving: !0, dis: "", singing: l, hop: Math.abs(Math.sin(p.t * 3)) * 3 }),
        e.restore(),
        // Sir Mops-a-Lot mops with his beard, drawn like Mops everywhere else (Brian's approved Nov 8 look: the
        // beard is his mop, no mop stick, his blue work shirt). tests/mops-look.mjs checks the title too.
        Fe(600, 386, 3.2, { f: -1, walk: p.t * 6, headDown: !0, sweep: Math.sin(p.t * 3.4) * 1.6 }),
        g(U, 600, 408, 18, "#2b8a5e"),
        l && Cn(180, 222, "\u266A I'm floating in space! \u266A", "#ffe3f1", 20),
        g(u ? "Tap a chapter to play" : "Click a chapter or press 1-4 (ENTER = continue)", c / 2, 440, 20, y, "center", 700));
      for (let o = 0; o < 4; o++) {
        let i = 40 + o * 225,
          s = 466,
          q = o + 1 > Ca;
        (At(i, s, 205, 150, q ? "#e2e6ec" : o + 1 === Ca ? "#fff6dc" : "#ffffff", 16),
          g("CHAPTER " + (o + 1), i + 102, s + 26, 18, q ? "#8a93a3" : "#3478f6"),
          zt(K1[o], 180, 21).forEach((d, A) => g(d, i + 102, s + 62 + A * 26, 21, q ? "#8a93a3" : y)),
          g(q ? "LOCKED" : "PLAY", i + 102, s + 126, 20, q ? "#8a93a3" : "#2bc48a"));
      }
      (At(c - 58, 10, 46, 40, "#ffffff", 20),
        m(c - 47, 24, 7, 12, 2),
        r(y, 0),
        e.beginPath(),
        e.moveTo(c - 41, 24),
        e.lineTo(c - 33, 18),
        e.lineTo(c - 33, 42),
        e.lineTo(c - 41, 36),
        e.closePath(),
        r(y, 0));
    }
    function ah(l, o, i) {
      (X(l, o + 8 * i, 20 * i, 16 * i), r("#8b5a3c", 2.5));
      for (let [s, q] of [
        [-20, -12],
        [-7, -22],
        [7, -22],
        [20, -12],
      ])
        (X(l + s * i, o + q * i, 7 * i, 9 * i), r("#8b5a3c", 2.5));
    }
    function Ap() {
      switch ((e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, c, b), p.state)) {
        case "title":
          up();
          break;
        case "op":
          (E5(), drawCap());
          break;
      }
      hudUpdate();
    }
    let pa = {
        sq: "Squatch",
        mops: "Mops",
        bot: "Security",
        robot: "Robot",
        pa: "Station PA",
        speaker: "Speaker", // the wall speaker in the home room (morning); the morning reads its tag from the morning's lines file (Brian 2026-11-23: "Speaker")
        kid: "Kid",
        exec: "Exec",
        demo: "Snack Clerk",
        scrub: "Air Scrubber",
        tourist: "Tourist",
        gary: "Gary",
        linda: "Linda",
        official: "Isfred Bar Neshuman",
        scanner: "Fur Scanner",
        ups: "UPS",
        gloop: "Gloop",
        cook: "Cook",
        rust: "Rusty",
        blorp: "Blorp",
        tv: "Diner TV",
        bot2: "Pump Bot",
        zip: "Zip",
        rover: "Rover",
        rover2: "Rover",
        pbot: "Port Bot",
        mom: "Mom",
        dad: "Dad",
      },
      Ds = {
        sq: "#b5562a",
        mops: "#2bc48a",
        bot: "#3478f6",
        robot: "#5b6b86",
        pa: "#e5533d",
        speaker: "#e5533d",
        kid: "#ff5fa8",
        exec: "#59657d",
        demo: "#3478f6",
        scrub: "#59657d",
        tourist: "#a98bff",
        gary: "#e07b00",
        linda: "#a98bff",
        official: "#e5533d",
        scanner: "#3478f6",
        ups: "#2b3a67",
        gloop: "#2bc48a",
        cook: "#e07b00",
        rust: "#e07b00",
        blorp: "#a98bff",
        tv: "#e5533d",
        bot2: "#e5533d",
        zip: "#7a4a2a",
        rover: "#59657d",
        rover2: "#59657d",
        pbot: "#e5533d",
        mom: "#ff5fa8",
        dad: "#8b4a1c",
      },
      n = {
        on: !1,
        scene: "",
        room: "closet",
        fbPic: "",
        banT: 0,
        holdToy: !1,
        lgGrace: 0,
        q: [],
        cur: null,
        t: 0,
        bt: 0,
        T: 0,
        under: "",
        sq: { x: 205, y: 438, f: 1, walk: 0, moving: !1 },
        sqPose: "sit",
        ctrl: !1,
        hopTo: null,
        mo: { x: 730, y: 420, f: -1, walk: 0, moving: !1 },
        moPose: "polish",
        moMop: "lean",
        bot: { x: 845, y: 470, f: -1, walk: 0, moving: !1 },
        botOn: !1,
        botCone: 0,
        botSkid: 0,
        door: 0,
        doorGlow: 0,
        glowT: -1,
        puffs: [],
        tvOn: !1,
        chair: !1,
        pulse: new Set(),
        chip: "",
        act: null,
        live: [],
        idle: 0,
        moved: 0,
        whispered: !1,
        gift: !1,
        lunch: "none",
        stars: 0,
        starOn: !1,
        secrets: 0,
        funny: 0,
        found: new Set(),
        sparks: [],
        breathT: 0,
        egg: null,
        seeGrace: 0,
        hopOut: -1,
        cutOn: !1,
        skipping: !1,
        fbI: 0,
        fbN: 0,
        runner: null,
        sirenT: -9,
        spotT: 0,
        heartT: -9,
        notices: 0,
        scrubbed: !1,
        alarm: !1,
        lobbyT: 0,
        flash: 0,
        furP: [],
        furVent: !1,
        ventTaught: !1,
        noteNear: !1,
        famTurn: 0,
        execTurn: 0,
        nT: {},
        lg: [],
        o5T: 0,
        botJump: -9,
        lgJump: -9,
        lobbyCatches: 0,
        light: { x: 820, y: 420 },
        lightHit: 0,
        sec: { x: 480, y: 40 },
        secOn: !1,
        looked: !1,
        coneIn: !1,
        rewinds: 0,
        zzz: 0,
        panelT: 0,
        log: [],
        maxB: 0,
      },
      wl = 3,
      he = 1.6,
      v = (l, o, i = "say", s = !1) => ({ k: "bub", b: { who: l, text: o, style: i, ear: s } }),
      uV = (l) => ({ k: "wait", t: l }),
      N = (l) => ({ k: "do", f: l }),
      cV = (l) => ({ k: "until", f: l }),
      He = (l, o, i, s) => cV((q) => mV(l, o, i, s, q)),
      ta = (l) => cV((o) => ((n.door = l > n.door ? Math.min(l, n.door + o * 2.5) : Math.max(l, n.door - o * 3)), n.door === l));
    function mV(l, o, i, s, q) {
      let d = o - l.x,
        A = i - l.y,
        T = Math.hypot(d, A);
      return T < s * q + 0.5
        ? ((l.x = o), (l.y = i), (l.moving = !1), !0)
        : ((l.x += (d / T) * s * q),
          (l.y += (A / T) * s * q),
          (l.walk += q * 10),
          (l.moving = !0),
          Math.abs(d) > 2 && (l.f = d > 0 ? 1 : -1),
          !1);
    }
    function J(l) {
      n.q.push(...l);
    }
    function TV(l) {
      let o = n.cur;
      o && !de() ? (n.q.unshift(...l, o), (n.cur = null)) : n.q.unshift(...l);
    }
    function kV(l, o, i) {
      // Ambient lines wait their turn (one bubble at a time). A long queue drops its oldest waiting line.
      (n.live.push({ who: l, text: o, style: i || "say", live: 1.4 + o.length * 0.035 }),
        n.live.length > 4 && n.live.splice(1, 1),
        Dt("live", pa[l], o, i || "live"));
    }
    function Dt(l, o, i, s) {
      n.log.push({ k: l, who: o, text: i, style: s, t: Math.round(n.T * 100) / 100 });
    }
    function de() {
      let l = n.cur;
      // A story wait (uV) is a tap, like a card. Wordless walks still use "until" and play on their own.
      // A full-screen cutaway picture (src/modules/cutaway.js) waits for a tap like a card.
      return !!l && (l.k === "bub" || l.k === "card" || l.k === "panel" || l.k === "fb" || l.k === "wait" || l.k === "cutaway");
    }
    function speakerDrawn(who) {
      // A bubble needs the speaker in the picture. Hiding Squatch is still in the picture (the bubble sits on his spot).
      // Mops who is hidden or off the picture is not. The UPS robot counts when the hangar crew is out, or when the photo-wall beep draws him.
      if (who === "pa") return !0;
      if (who === "mops") return n.moPose !== "hidden" && n.mo.x > 20 && n.mo.x < 940 && n.mo.y > 40 && n.mo.y < 620;
      // A rebuilt beat that places this speaker draws it (the party's peek round his door, the escape's vent).
      if (window.SSQ && window.SSQ.speakerAt && window.SSQ.speakerAt(who)) return !0;
      if (who === "sq") return n.sq.x > -20 && n.sq.x < 980 && n.sq.y > 0 && n.sq.y < 640;
      if (who === "ups") return !!(n.room === "hangar" && n.ch1D) || !!n.ch1Beep;
      return !0;
    }
    function gp(l) {
      if (l && l.k === "bub" && l.b && !l.b.ear && !speakerDrawn(l.b.who)) {
        ((n.cur = null), Dt("offscreen", l.b.who, l.b.text, "skip"));
        return;
      }
      ((n.cur = l),
        (n.bt = 0),
        l.k === "bub"
          ? // A soft tick, and Mops's meh on his first line in a scene (src/modules/morning-sound.js, Brian 34A).
            (window.SSQ && window.SSQ.bubbleSound && window.SSQ.bubbleSound(l.b, n.scene),
            (l.b.who === "ups" || l.b.who === "robot" || l.b.who === "scanner" || l.b.who === "bot") && D.bleep(),
            Dt("bub", pa[l.b.who], l.b.text, l.b.style + (l.b.ear ? "+ear" : "")),
            // The morning plays Brian's recording instead of the made-up tune (src/modules/home-music.js).
            l.b.style === "song" && !(window.SSQ && window.SSQ.homeMusic && window.SSQ.homeMusic.owns()) && co())
          : l.k === "card"
            ? (l.id === "fb" && (n.cutOn = !1), Dt("card", "", l.text, "card"))
            : l.k === "panel"
              ? ((n.panelT = 0), D.pickup(), Dt("panel", "", l.id, "panel"))
              : l.k === "fb"
                ? (n.cutOn ? (n.fbI = (n.fbI || 0) + 1) : ((n.cutOn = !0), (n.fbI = 0)),
                  (n.fbN = n.fbI + 1 + n.q.filter((o) => o.k === "fb").length),
                  Dt("fb", "", l.cap, "fb"),
                  l.pic === "fb1beard" && D.pickup(),
                  (n.breathT = 0))
                : l.k === "cutaway"
                  ? Dt("cutaway", "", l.id + ":" + l.panel, "cutaway")
                  : l.k === "wait" && (n.t = l.t));
    }
    function lh(l) {
      for (let o = 0; o < 60; o++) {
        if (!n.cur) {
          let s = n.q.shift();
          if (!s) return;
          (gp(s), n.cutOn && !Nl(s) && s.k !== "bub" && !n.q.some((q) => Nl(q)) && (n.cutOn = !1));
        }
        let i = n.cur;
        if (!i || de()) return;
        if (i.k === "do") {
          ((n.cur = null), i.f());
          continue;
        }
        if (i.k === "wait") {
          if (((n.t -= l), (l = 0), n.t > 0)) return;
          n.cur = null;
          continue;
        }
        if (i.k === "until") {
          let s = i.f(l);
          if (((l = 0), !s)) return;
          n.cur = null;
          continue;
        }
      }
    }
    function Nl(l) {
      return !!l && (l.k === "fb" || (l.k === "card" && l.id === "fb"));
    }
    function storyCard(l) {
      return !!l && l.k === "card" && l.id !== "fb";
    }
    function N0() {
      let l = n.cur;
      return !l || p.state !== "op" ? !1 : Nl(l) ? !0 : l.k === "bub" && n.q.some((o) => Nl(o)) && n.cutOn === !0;
    }
    function skipStoryCards() {
      if (!storyCard(n.cur) || p.state !== "op") return !1;
      let l = 0;
      for (n.skipping = !0; l++ < 600 && storyCard(n.cur); ) {
        ((n.cur = null), lh(0.05));
      }
      return ((n.skipping = !1), (n.bt = 0), Dt("skip", "", "cards skipped", "skip"), !0);
    }
    function Cs() {
      if (!N0()) return;
      let l = 0;
      for (n.skipping = !0; l++ < 6e3 && !((!n.cur && !n.q.length) || (!n.q.some((o) => Nl(o)) && !Nl(n.cur)));) {
        if (de()) {
          let o = n.cur;
          ((n.cur = null), o && o.k === "panel" && rh(o.id));
        }
        (lh(0.05), n.cur && n.cur.k === "until" && n.cur.f(0.05) && (n.cur = null));
      }
      ((n.skipping = !1), (n.cutOn = !1), (n.bt = 0), Dt("skip", "", "cutscene skipped", "skip"));
    }
    // A tap on the picture with no bubble or card up walks the player there (Sierra style).
    function walkTap(l, o) {
      if (!n.ctrl || de() || !n.scene) return !1;
      let b = sn(),
        hall = n.room === "hall" ? B.camX : 0,
        who = x.mops ? n.mo : n.sq;
      n.walkTo = { x: w(l + hall, b.x0, b.x1), y: w(o, b.y0, b.y1), room: n.room, lx: who.x, ly: who.y, lt: n.T, at: n.T };
      // Around furniture, not into it (problem 2): the corners to walk through, ending at the tap or at the
      // free floor nearest it. Without the module, straight there as before.
      let path = window.SSQ && window.SSQ.findPath ? window.SSQ.findPath(who, n.walkTo, b, walkSolids(who)) : null;
      path && path.length && ((n.walkTo.path = path), (n.walkTo.x = path[path.length - 1].x), (n.walkTo.y = path[path.length - 1].y));
      // No "Tap the floor" note in Chapter 1 (scene 1 review, Brian 2026-11-14); other chapters keep it.
      let seen = n.walkHinted || /^(Q|O1$)/.test(n.scene || "");
      try {
        seen = seen || window.localStorage.getItem(ssqKey("walk-hint")) === "1";
      } catch {}
      seen ||
        ((n.walkHinted = !0),
        hudNote("Tap the floor to walk there.", 4),
        Dt("hint", "", "walk-tap", "hint"));
      /^(Q|O1$)/.test(n.scene || "") ||
        (() => {
          try {
            window.localStorage.setItem(ssqKey("walk-hint"), "1");
          } catch {}
        })();
      return !0;
    }
    function nf() {
      if (n.ch1Calendar) return ch1CloseCalendar();
      // Brian 30a: a cutaway picture with no words and nothing to tap plays by itself; a tap does not skip it.
      if (n.cur && n.cur.k === "cutaway" && n.cur.auto) return void VV();
      if ((VV(), de())) {
        // Too soon after the bubble opened (task T22): keep the tap, show it was heard, apply it at 0.3 s.
        if (n.bt < 0.3) return void ((n.tapLate = n.cur), (n.tapT = n.T));
        let o = n.cur;
        ((n.cur = null), (n.idle = 0), o && o.k === "panel" && rh(o.id));
        return;
      }
      let l = Bs();
      l && ((n.idle = 0), l.f());
    }
    function Bs() {
      let l = n.act;
      return !l || !n.ctrl || (l.spot && !inSpot(l.spot)) ? null : l;
    }
    // Spots (task T17). One spot is one action, and the numbers that say where it works are the same
    // numbers the ring is drawn from, so the ring always sits exactly where the button lights up.
    //   id         the ring's name; the ring glows while n.pulse holds it and the spot can be used now
    //   verb, cap  what the button says: "VERB · cap"
    //   x, y, r    a circle on the floor: the action works while the player's feet are inside it
    //   box        instead of a circle, { x0, x1, y0, y1 } on the floor
    //   not        a circle { x, y, r } cut out of the place (the S6 gallery wall near the terminal)
    //   who        whose feet count: "sq" (Squatch), "mo" (Mops), or "ctl" (whoever the player moves)
    //   at         [x, y] where the caption sits, over the thing (in the hall, in hall coordinates)
    //   when       false while the spot cannot be used (story step, what is held, pose)
    //   f          what happens; hot makes the button pulse
    // A spot with no circle and no box works anywhere (SING while hidden, ROLL while Gloop looks) and has
    // no ring. A spot with no verb is a place to walk into (the S11 scanner gate), never a button.
    // Positions are world positions: in the hall, before the camera moves the picture.
    function spot(l) {
      return l;
    }
    function spotFeet(l) {
      return l.who === "sq" ? n.sq : l.who === "mo" ? n.mo : Ks();
    }
    function inSpot(l, o = spotFeet(l)) {
      let i = l.box,
        s = l.not;
      return s && Math.hypot(o.x - s.x, o.y - s.y) < s.r
        ? !1
        : i
          ? o.x > i.x0 && o.x < i.x1 && o.y > i.y0 && o.y < i.y1
          : l.r > 0
            ? Math.hypot(o.x - l.x, o.y - l.y) < l.r
            : !0;
    }
    // The action a spot offers: the shape every picker returns and n.act holds.
    function offer(l) {
      let o = n.room === "hall" ? B.camX : 0,
        i = l.at || [l.x || 0, l.y || 0];
      return { verb: l.verb, cap: l.cap, x: i[0] - o, y: i[1], r: 0, hot: !!l.hot, f: l.f, spot: l };
    }
    // The first spot in the list that can be used now and has the player's feet inside it.
    function pick(l) {
      for (let o of l) if (o && o.verb && o.when !== !1 && inSpot(o)) return offer(o);
      return null;
    }
    // The goal chip for Chapters 1, 3 and 4, from their tables (Chapter 2 sets its own in NA). While the
    // hall alarm shows its "Hide!" chip, that chip stays.
    function chipNow() {
      let l = (n.scene || "")[0],
        o =
          l === "Q"
            ? ch1QChip()
            : l === "P"
              ? CH3_CHIPS[ch3ChipKey()]
              : l === "M"
                ? CH4_CHIPS[ch4ChipKey()]
                : l === "O" || l === "S"
                  ? CH1_CHIPS[ch1ChipKey()]
                  : null;
      o === null || (FV.on && n.chip === "Hide!") || (n.chip = o || "");
    }
    // Every spot the current scene has, in the order its picker tries them. A scene without a picker
    // (the opening) has the one action its story step set, if any.
    function spotsNow() {
      let l = n.scene || "",
        o = l[0] === "G" ? ch2Spots() : l[0] === "P" ? ch3Spots() : l[0] === "M" ? ch4Spots() : ch1Spots();
      return o.length || !(n.act && n.act.spot) ? o : [n.act.spot];
    }
    // Rings drawn this frame, for tests: { id, x, y, r } or { id, box }, in world positions.
    let ringsDrawn = [],
      // Every sight cone drawn this frame, from the numbers the drawing used (for tests/cone-match.mjs).
      conesDrawn = [];
    // The spots that can be used now and have a place (a circle or a box). A spot that works anywhere
    // (LEAVE while hidden, ROLL while the light sweeps) wins over every spot after it, so those have no ring.
    function placedSpots() {
      let l = [];
      for (let o of spotsNow())
        if (o && o.when !== !1) {
          if (o.r > 0 || o.box) l.push(o);
          else if (o.verb) break;
        }
      return l;
    }
    // The spots called id that can be used now and have a place.
    function spotsCalled(l) {
      return placedSpots().filter((o) => o.id === l);
    }
    // Draws the ring of every spot called id that can be used now, while id glows. Rings are drawn in
    // world positions: in the hall, call this where the drawing is already moved by the camera.
    function ringOf(l) {
      if (n.pulse.has(l)) for (let o of spotsCalled(l)) ringZone(o);
    }
    // The same ring while the player stands inside it, whether or not it glows (a "you can do this here" hint).
    function ringNear(l) {
      if (n.ctrl) for (let o of spotsCalled(l)) inSpot(o) && ringZone(o);
    }
    // A story pointer (rule 4: what a line mentions glows when it matters). It glows around a thing a line
    // talks about while no action there is possible, such as during a cutscene. It never marks where an
    // action works: while a spot called id can be used, that spot's ring is drawn instead.
    function pointer(l, o, i, s, q, d) {
      if (!n.pulse.has(l)) return;
      spotsCalled(l).length ? ringOf(l) : oV(o, i, s, q, d);
    }
    // After the room is drawn: the ring of any glowing spot the room's own drawing did not place.
    function ringsLeft() {
      (e.save(), n.room === "hall" && e.translate(-B.camX, 0));
      for (let l of placedSpots()) n.pulse.has(l.id) && !ringsDrawn.some((o) => o.id === l.id) && ringZone(l);
      e.restore();
    }
    function oh() {
      let l = (qe.ArrowRight || qe.KeyD ? 1 : 0) - (qe.ArrowLeft || qe.KeyA ? 1 : 0),
        o = (qe.ArrowDown || qe.KeyS ? 1 : 0) - (qe.ArrowUp || qe.KeyW ? 1 : 0);
      qt.active && Math.hypot(qt.x, qt.y) > 0.15 && ((l = qt.x), (o = qt.y));
      // Tap to walk (task T23): with no key or stick, head for the tapped point. Keys and the stick cancel it.
      if (l || o) n.walkTo = null;
      else if (n.walkTo) {
        let t = n.walkTo,
          who = x.mops ? n.mo : n.sq;
        // Walking around furniture: head for the next corner, then the one after.
        t.path && t.path.length > 1 && Math.hypot(t.path[0].x - who.x, t.path[0].y - who.y) < 8 && t.path.shift();
        let to = t.path && t.path.length ? t.path[0] : t,
          dx = to.x - who.x,
          dy = to.y - who.y,
          d = t.path && t.path.length > 1 ? Math.max(8, Math.hypot(t.x - who.x, t.y - who.y)) : Math.hypot(dx, dy),
          step = Math.hypot(dx, dy) || 1;
        // Arrived, control taken away, a new room, or stuck against something for half a second: stop.
        Math.hypot(who.x - t.lx, who.y - t.ly) > 2 && ((t.lx = who.x), (t.ly = who.y), (t.lt = n.T));
        d < 8 || !n.ctrl || n.room !== t.room || n.T - t.lt > 0.5 ? (n.walkTo = null) : ((l = dx / step), (o = dy / step));
      }
      let i = Math.hypot(l, o);
      return (i > 1 && ((l /= i), (o /= i)), { x: l, y: o });
    }
    function sn() {
      return n.room === "pad" || n.room === "temple" || n.room === "port" || n.room === "stand" || n.room === "van" || n.room === "inside"
        ? { x0: 50, x1: 910, y0: 420, y1: 600 }
        : n.room === "gas" || n.room === "diner" || n.room === "kitchen"
          ? { x0: 60, x1: 900, y0: n.room === "gas" ? 400 : 420, y1: 590 }
          : n.room === "duct"
            ? { x0: 100, x1: 880, y0: 400, y1: 470 }
              : n.room === "hangar"
              ? { x0: 60, x1: 900, y0: n.ch1D ? 320 : 400, y1: 590 }
              : n.room === "closet"
                ? { x0: 100, x1: 860, y0: 372, y1: 578 }
                : n.room === "deck"
                  ? { x0: 60, x1: 900, y0: 196, y1: 590 }
                  : n.room === "hall" && hallBeat()
                    ? hallBeat().bounds()
                  : n.room === "hall"
                    ? { x0: 60 + B.camX, x1: 900 + B.camX, y0: (n.scene || "")[0] === "Q" ? CH1_WALL_FOOT : 200, y1: 590 }
                    : n.room === "window"
                      ? { x0: 60, x1: 900, y0: 380, y1: 590 }
                      : n.room === "passage" || n.room === "office"
                        ? { x0: 60, x1: 900, y0: CH1_WALL_FOOT, y1: 590 }
                        : { x0: 60, x1: 900, y0: 236, y1: 590 };
    }
    // Where the wall meets the floor in the locked hall, hallway and office pictures (picture row 332
    // of 830, drawn at 640 high). Feet above this line would be standing on the wall.
    const CH1_WALL_FOOT = 256,
      // Furniture in the locked loading bay and office pictures, as the strip where each one stands on
      // the floor, in game positions (picture x * 0.75, picture y * 640 / 830). tests/ch1-rooms-solid.mjs
      // walks into each one from four sides. Every solid is at least 24 across both ways: R0 pushes
      // Squatch out to the nearest side, so anything thinner than two of his longest steps (about 8 px at
      // the slowest frame) lets him pop out the far side. Thin things grow back toward the wall, so the
      // side where they stand on the floor stays where the picture draws it.
      CH1_FURNITURE = {
        office: [
          { x0: 59, x1: 167, y0: 485, y1: 509 }, // filing cabinet
          { x0: 587, x1: 885, y0: 524, y1: 551 }, // desk
        ],
        hangar: [
          { x0: 103, x1: 148, y0: 346, y1: 370 }, // plant
          { x0: 189, x1: 237, y0: 350, y1: 374 }, // bin
          { x0: 344, x1: 369, y0: 392, y1: 416 }, // scanner arch, left post
          { x0: 563, x1: 588, y0: 392, y1: 416 }, // scanner arch, right post
          { x0: 675, x1: 699, y0: 360, y1: 420 }, // mail room wall, above its door
          { x0: 675, x1: 699, y0: 507, y1: 609 }, // mail room wall, below its door
          { x0: 848, x1: 908, y0: 452, y1: 476 }, // robot mailbox
        ],
      };
    let nt = (l, o, i, s, q) => ({ x0: l - i, x1: l + i, y0: o - s, y1: o + q });
    function ih() {
      let l = [],
        o = n.scene;
      if (
        (n.room === "lobby" &&
          (l.push({ x0: 352, x1: 608, y0: 150, y1: 286 }),
          l.push({ x0: 180, x1: 324, y0: 384, y1: 412 }),
          l.push({ x0: 832, x1: 888, y0: 424, y1: 450 }),
          // D15: the brochure table and the snack counter (drawn in 10-ch1.js)
          l.push({ x0: 712, x1: 828, y0: 200, y1: 262 }),
          l.push({ x0: 860, x1: 960, y0: 330, y1: 480 })),
        n.room === "closet" &&
          ((n.scene || "")[0] === "Q" || n.scene === "O1" // the locked picture: these boxes match the bucket, Guardian Box and bed drawn in it
            ? (l.push({ x0: 536, x1: 596, y0: 500, y1: 571 }),
              gboxOut() && l.push({ x0: 188, x1: 236, y0: 366, y1: 394 }), // the Guardian Box, out by the closet while the gift goes in (home-morning.js)
              l.push({ x0: 83, x1: 286, y0: 409, y1: 526 }))
            : (l.push(nt(610, 546, 26, 16, 10)),
              l.push({ x0: 326, x1: 374, y0: 484, y1: 516 }),
              l.push({ x0: 110, x1: 300, y0: 420, y1: 526 }))),
        n.room === "deck")
      )
        for (let i of qn) l.push(i.kind === "plant" ? nt(i.x, i.y, 26, 14, 10) : nt(i.x, i.y, 40, 14, 10));
      if (n.room === "window" && l.push(nt(rt.x, rt.y, 26, 14, 10)), hallBeat()) for (let i of hallBeat().solids()) l.push(i); // (and the escape's bay and office)
      else if (n.room === "hall") {
        (l.push(nt(ne.x, ne.y, 26, 14, 10)),
          l.push(nt(DV.x, DV.y, 26, 16, 8)),
          B.crate && l.push({ x0: ye.x, x1: ye.x + 150, y0: ye.y, y1: ye.y + 82 }));
        for (let i of _p) l.push(i);
        (["S6", "S7", "S7b", "S8", "S9", "S10", "S11"].includes(o) && l.push(nt(va[1].x, va[1].y, 26, 14, 10)),
          l.push(nt(lt.x, lt.y, 52, 60, 12)),
          o === "S9" && l.push(nt(gt.x, gt.y, 40, 14, 10)));
      }
      if (
        (n.room === "gas" && (l.push(nt(we.x, we.y, 30, 14, 10)), l.push(nt(ht.x, ht.y, 40, 14, 10))),
        n.room === "kitchen" && l.push(nt(xe.x, xe.y, 40, 14, 10)),
        n.room === "pad" && (l.push(nt(OV.x, OV.y, 30, 14, 10)), l.push(nt(Ne.x, Ne.y, 50, 14, 10))),
        n.room === "stand" && l.push(nt(Ea.x, Ea.y, 40, 14, 10)),
        n.room === "port")
      )
        for (let i of xf) l.push(nt(i.x, i.y, 26, 14, 10));
      if ((n.scene || "")[0] === "Q" && CH1_FURNITURE[n.room] && (n.room !== "office" || n.ch1Office)) for (let i of CH1_FURNITURE[n.room]) l.push(i);
      return (n.room === "van" && l.push({ x0: Tt.x - 100, x1: Tt.x + 100, y0: 380, y1: 470 }), l);
    }
    // What blocks a walker's feet: the room's solids, plus a standing Mops when the walker is Squatch.
    // R0 pushes feet out of these, and a tap walk goes around them (src/modules/tap-path.js).
    function walkSolids(l) {
      let solids = ih();
      (n.room === "closet" || n.room === "hall" || n.room === "passage" || n.room === "hangar" || n.room === "duct") &&
        n.moPose !== "hidden" &&
        n.moPose !== "sleep" &&
        l === n.sq &&
        !n.mo.walking && // Mops walking past would shove Squatch in a jump; only a standing Mops is solid
        n.mo.x > 20 &&
        n.mo.x < 1000 &&
        solids.push(nt(n.mo.x, n.mo.y, 46, 46, 46));
      return solids;
    }
    function R0(l) {
      let solids = walkSolids(l);
      let inside = (x, y) => solids.some((o) => x > o.x0 && x < o.x1 && y > o.y0 && y < o.y1);
      if (!inside(l.x, l.y)) return;
      let best = null;
      for (let o of solids) {
        if (!(l.x > o.x0 && l.x < o.x1 && l.y > o.y0 && l.y < o.y1)) continue;
        for (let opt of [
          [o.x0, l.y, l.x - o.x0],
          [o.x1, l.y, o.x1 - l.x],
          [l.x, o.y0, l.y - o.y0],
          [l.x, o.y1, o.y1 - l.y],
        ]) {
          let px = l.x,
            py = l.y;
          ((l.x = opt[0]), (l.y = opt[1]));
          let free = !inside(l.x, l.y);
          ((l.x = px), (l.y = py));
          if (free && (best == null || opt[2] < best[2])) best = opt;
        }
      }
      if (best) {
        ((l.x = best[0]), (l.y = best[1]));
        return;
      }
      let o = solids.find((q) => l.x > q.x0 && l.x < q.x1 && l.y > q.y0 && l.y < q.y1);
      if (!o) return;
      let i = l.x - o.x0,
        sv = o.x1 - l.x,
        q = l.y - o.y0,
        d = o.y1 - l.y,
        A = Math.min(i, sv, q, d);
      A === i ? (l.x = o.x0) : A === sv ? (l.x = o.x1) : A === q ? (l.y = o.y0) : (l.y = o.y1);
      if (
        l === n.sq &&
        (n.room === "closet" || n.room === "hall" || n.room === "passage" || n.room === "hangar" || n.room === "duct") &&
        n.moPose !== "hidden" &&
        n.moPose !== "sleep" &&
        n.mo.x > 20 &&
        n.mo.x < 1000
      ) {
        let dx = l.x - n.mo.x,
          dy = l.y - n.mo.y,
          dist = Math.hypot(dx, dy) || 0.01;
        dist < 46 && ((l.x = n.mo.x + (dx / dist) * 46), (l.y = n.mo.y + (dy / dist) * 46));
      }
    }
    function ee(l, o, i, s) {
      n.found.has(o) ||
        (n.found.add(o),
        (n.starOn = !0),
        of(n.room === "hall" ? i - B.camX : i, s, l === "secret" ? "#ffcf33" : "#7fd1ff"),
        l === "secret"
          ? ((n.stars += 50), n.secrets++, n.sparks.push({ x: 300, y: 80, t: 2.4, s: "+50 SECRET!" }))
          : ((n.stars += 25), n.funny++, n.sparks.push({ x: 300, y: 80, t: 2.4, s: "+25 FUNNY FIND!" })),
        D.pickup());
    }
    let lf = [];
    function of(l, o, i = "#ffcf33") {
      lf.push({ x: l, y: o, t: 0.8, c: i });
    }
    let sh = 0;
    function xp() {
      let l = Math.min(0.1, Math.max(0, n.T - sh));
      ((sh = n.T),
        H.flash > 0 && ((e.fillStyle = "rgba(255,255,255," + Math.min(0.9, H.flash) + ")"), e.fillRect(0, 0, c, b), (H.flash -= l * 1.4)));
      for (let o of lf) {
        let i = 1 - o.t / 0.8,
          s = 14 + i * 46;
        e.globalAlpha = Math.max(0, o.t / 0.8);
        for (let q = 0; q < 8; q++) {
          let d = (q * Math.PI) / 4 + i;
          vp(o.x + Math.cos(d) * s, o.y + Math.sin(d) * s, 11 - i * 4, o.c);
        }
        (e.beginPath(),
          e.arc(o.x, o.y, s * 0.6, 0, Math.PI * 2),
          (e.strokeStyle = o.c),
          (e.lineWidth = 3 * (1 - i)),
          e.stroke(),
          (o.t -= l));
      }
      ((e.globalAlpha = 1), (lf = lf.filter((o) => o.t > 0)));
    }
    function vp(l, o, i, s) {
      e.beginPath();
      for (let q = 0; q < 10; q++) {
        let d = -Math.PI / 2 + (q * Math.PI) / 5,
          A = q % 2 ? i * 0.45 : i;
        e.lineTo(l + Math.cos(d) * A, o + Math.sin(d) * A);
      }
      (e.closePath(), (e.fillStyle = s), e.fill(), (e.strokeStyle = y), (e.lineWidth = 1.5), e.stroke());
    }
