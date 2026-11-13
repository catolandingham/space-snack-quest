// Original beds. Snack Quest Drift, Stormtop Lobby Glow, and Station Call. No vocals, no borrowed tunes.
    let bedBus = null,
      bedName = "",
      bedOrigin = 0,
      bedUntil = 0,
      musicLevel = 0,
      musicTalking = false,
      driftCache = null,
      glowCache = null,
      stationCache = null;
    let DRIFT_BEAT = 60 / 92,
      DRIFT_LEN = 98 * DRIFT_BEAT,
      GLOW_BEAT = 60 / 110,
      GLOW_LEN = 132 * GLOW_BEAT;
    function penta(root, deg) {
      let scale = [0, 2, 4, 7, 9],
        o = Math.floor(deg / 5),
        d = deg % 5;
      d < 0 && ((d += 5), (o -= 1));
      return root + o * 12 + scale[d];
    }
    function bedOut() {
      if (!bedBus && S && M) ((bedBus = S.createGain()), (bedBus.gain.value = 0), bedBus.connect(M));
      return bedBus;
    }
    function partyBusy() {
      return !!(n.ch1Dim || n.ch1Dance);
    }
    function noiseBuf(ctx) {
      if (ctx.__ssNoise) return ctx.__ssNoise;
      let n = ctx.sampleRate,
        b = ctx.createBuffer(1, n, n),
        d = b.getChannelData(0),
        s = 1;
      for (let i = 0; i < n; i++) ((s = (s * 16807) % 2147483647), (d[i] = (s / 2147483647) * 2 - 1));
      return (ctx.__ssNoise = b);
    }
    function tone(ctx, dest, when, freq, dur, type, peak, attack, endFreq, hold) {
      if (!(ctx && dest) || freq < 30 || dur <= 0 || peak <= 0) return;
      try {
        let o = ctx.createOscillator(),
          g = ctx.createGain(),
          a = Math.max(0.004, Math.min(attack || 0.02, dur * 0.45));
        ((o.type = type),
          o.frequency.setValueAtTime(freq, when),
          endFreq && o.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), when + dur),
          g.gain.setValueAtTime(1e-4, when),
          g.gain.exponentialRampToValueAtTime(peak, when + a));
        hold
          ? (g.gain.exponentialRampToValueAtTime(peak * 0.92, when + Math.max(a + 0.05, dur * 0.9)),
            g.gain.exponentialRampToValueAtTime(1e-4, when + dur))
          : g.gain.exponentialRampToValueAtTime(1e-4, when + Math.max(dur, a + 0.03));
        (o.connect(g), g.connect(dest), o.start(when), o.stop(when + dur + 0.04));
      } catch {}
    }
    function noiseHit(ctx, dest, when, dur, peak, freq) {
      if (!(ctx && dest) || peak <= 0) return;
      try {
        let src = ctx.createBufferSource(),
          f = ctx.createBiquadFilter(),
          g = ctx.createGain();
        ((src.buffer = noiseBuf(ctx)),
          (src.loop = !0),
          (f.type = "bandpass"),
          (f.frequency.value = freq),
          (f.Q.value = 0.7),
          g.gain.setValueAtTime(1e-4, when),
          g.gain.exponentialRampToValueAtTime(peak, when + 0.008),
          g.gain.exponentialRampToValueAtTime(1e-4, when + dur),
          src.connect(f),
          f.connect(g),
          g.connect(dest),
          src.start(when),
          src.stop(when + dur + 0.02));
      } catch {}
    }
    function playEv(ctx, dest, when, ev) {
      let f = ev.midi ? Da(ev.midi) : 80;
      ev.kind === "bass" && tone(ctx, dest, when, f, ev.dur, "sine", ev.gain, 0.09, 0, !0);
      ev.kind === "pluck" &&
        (tone(ctx, dest, when, f, ev.dur, "triangle", ev.gain, 0.01), tone(ctx, dest, when, f / 2, ev.dur * 0.7, "sine", ev.gain * 0.22, 0.015));
      ev.kind === "bell" &&
        (tone(ctx, dest, when, f, ev.dur, "sine", ev.gain, 0.005), tone(ctx, dest, when, f * 2.01, ev.dur * 0.45, "sine", ev.gain * 0.12, 0.004));
      ev.kind === "ep" &&
        (tone(ctx, dest, when, f, ev.dur, "sine", ev.gain, 0.04),
        tone(ctx, dest, when, f * 1.004, ev.dur, "sine", ev.gain * 0.55, 0.05),
        tone(ctx, dest, when, f * 2, ev.dur * 0.35, "triangle", ev.gain * 0.12, 0.01));
      ev.kind === "pad" && tone(ctx, dest, when, f, ev.dur, "sine", ev.gain, 0.22, 0, !0);
      ev.kind === "horn" && tone(ctx, dest, when, f, ev.dur, "triangle", ev.gain, 0.015, f / 1.06);
      ev.kind === "xylo" &&
        (tone(ctx, dest, when, f, ev.dur, "sine", ev.gain, 0.004), tone(ctx, dest, when, f * 2, ev.dur * 0.4, "sine", ev.gain * 0.12, 0.004));
      ev.kind === "shake" && noiseHit(ctx, dest, when, ev.dur, ev.gain, 6200);
      ev.kind === "brush" && noiseHit(ctx, dest, when, ev.dur, ev.gain, 1800);
      ev.kind === "thump" && tone(ctx, dest, when, 96, ev.dur, "sine", ev.gain, 0.005, 48);
    }
    function buildDrift() {
      let ev = [],
        hook = [
          [0, 1, 0.7],
          [2, 3, 0.55],
          [4.5, 2, 0.45],
          [6, 0, 0.8],
          [8, 4, 0.4],
          [9, 3, 0.35],
          [10.5, 2, 0.7],
          [13, 1, 1.1],
          [16, 3, 0.45],
          [17.5, 4, 0.4],
          [20, 2, 0.4],
          [21.5, 1, 0.35],
          [22.5, 0, 0.85],
          [26, 4, 0.4],
          [28, 2, 0.5],
          [30, 0, 1.5],
        ],
        roots = [38, 45, 43, 45];
      for (let i = 0; i < 12; i++) ev.push({ t: i * 8 * DRIFT_BEAT, kind: "bass", midi: roots[i % 4], dur: 8.15 * DRIFT_BEAT, gain: 0.034 });
      for (let pass = 0; pass < 3; pass++)
        for (let i = 0; i < hook.length; i++) {
          if (pass === 2 && i % 2) continue;
          let [beat, deg, dur] = hook[i];
          ev.push({
            t: (pass * 32 + beat) * DRIFT_BEAT,
            kind: "pluck",
            midi: penta(62, deg + (pass === 1 ? 1 : pass === 2 ? -1 : 0)),
            dur: dur * DRIFT_BEAT,
            gain: pass === 2 ? 0.034 : 0.048,
          });
        }
      for (let i = 0; i < 98; i += 0.5) {
        let back = Math.abs((i % 4) - 1) < 0.01 || Math.abs((i % 4) - 3) < 0.01;
        ev.push({ t: i * DRIFT_BEAT, kind: "shake", dur: 0.05, gain: back ? 0.32 : 0.18 });
      }
      for (let bar = 1; bar < 24; bar += 2) {
        let t = (bar * 4 - 0.5) * DRIFT_BEAT;
        ev.push({ t, kind: "bell", midi: 86, dur: 0.18, gain: 0.028 });
        ev.push({ t: t + 0.11, kind: "bell", midi: 93, dur: 0.16, gain: 0.02 });
      }
      return ev;
    }
    function buildGlow() {
      let ev = [],
        chords = [
          [53, 57, 60, 64],
          [50, 53, 57, 60],
          [46, 50, 53, 57],
          [48, 53, 55, 60],
          [45, 52, 57, 60],
          [50, 53, 57, 60],
          [43, 50, 53, 58],
          [48, 52, 55, 58],
        ];
      for (let bar = 0; bar < 33; bar++) {
        let chord = bar === 32 ? chords[0] : chords[bar % 8],
          t0 = bar * 4 * GLOW_BEAT;
        for (let m of chord) ev.push({ t: t0, kind: "ep", midi: m, dur: 1.5 * GLOW_BEAT, gain: 0.03 });
        ev.push({ t: t0 + 2.5 * GLOW_BEAT, kind: "ep", midi: chord[chord.length - 1], dur: 0.6 * GLOW_BEAT, gain: 0.018 });
        ev.push({ t: t0, kind: "pad", midi: chord[0], dur: 3.95 * GLOW_BEAT, gain: 0.015 });
        if (bar < 32)
          for (let b = 0; b < 4; b++) {
            let accent = b === 1 || b === 3;
            ev.push({ t: t0 + b * GLOW_BEAT, kind: "brush", dur: 0.07, gain: accent ? 0.16 : 0.09 });
            ev.push({ t: t0 + (b + 0.62) * GLOW_BEAT, kind: "brush", dur: 0.05, gain: 0.07 });
          }
        bar < 32 && ev.push({ t: t0, kind: "thump", dur: 0.09, gain: 0.024 });
        bar < 32 &&
          bar % 4 === 3 &&
          (ev.push({ t: t0 + 3 * GLOW_BEAT, kind: "horn", midi: 70, dur: 0.14, gain: 0.03 }),
          ev.push({ t: t0 + 3.28 * GLOW_BEAT, kind: "horn", midi: 65, dur: 0.12, gain: 0.026 }));
        bar > 0 &&
          bar < 32 &&
          bar % 4 === 0 &&
          (ev.push({ t: t0 + 0.7 * GLOW_BEAT, kind: "horn", midi: 72, dur: 0.13, gain: 0.028, busy: !0 }),
          ev.push({ t: t0 + 1.05 * GLOW_BEAT, kind: "horn", midi: 67, dur: 0.16, gain: 0.024, busy: !0 }));
      }
      return ev;
    }
    function buildStation() {
      return [
        { t: 0, kind: "horn", midi: 58, dur: 0.36, gain: 0.046 },
        { t: 0.4, kind: "horn", midi: 62, dur: 0.16, gain: 0.04 },
        { t: 0.62, kind: "horn", midi: 65, dur: 0.34, gain: 0.046 },
        { t: 1.02, kind: "horn", midi: 62, dur: 0.2, gain: 0.038 },
        { t: 1.85, kind: "xylo", midi: 79, dur: 0.14, gain: 0.055 },
        { t: 2.16, kind: "xylo", midi: 82, dur: 0.13, gain: 0.052 },
        { t: 2.46, kind: "xylo", midi: 81, dur: 0.13, gain: 0.05 },
        { t: 2.8, kind: "xylo", midi: 86, dur: 0.14, gain: 0.052 },
        { t: 3.12, kind: "xylo", midi: 84, dur: 0.18, gain: 0.048 },
        { t: 3.9, kind: "horn", midi: 65, dur: 0.16, gain: 0.036 },
        { t: 4.18, kind: "horn", midi: 58, dur: 0.32, gain: 0.042 },
        { t: 4.18, kind: "bass", midi: 46, dur: 0.18, gain: 0.036 },
        { t: 4.42, kind: "bass", midi: 48, dur: 0.14, gain: 0.03 },
        { t: 4.64, kind: "bass", midi: 50, dur: 0.14, gain: 0.03 },
        { t: 4.86, kind: "bass", midi: 53, dur: 0.2, gain: 0.028 },
        { t: 5.2, kind: "thump", dur: 0.18, gain: 0.03 },
        { t: 5.4, kind: "bell", midi: 82, dur: 0.18, gain: 0.016 },
      ];
    }
    function driftEvents() {
      return driftCache || (driftCache = buildDrift());
    }
    function glowEvents() {
      return glowCache || (glowCache = buildGlow());
    }
    function stationEvents() {
      return stationCache || (stationCache = buildStation());
    }
    function cueInfo() {
      let st = stationEvents(),
        end = 0;
      for (let e of st) end = Math.max(end, e.t + e.dur);
      return {
        drift: DRIFT_LEN,
        glow: GLOW_LEN,
        station: end,
        busyN: glowEvents().filter((e) => e.busy).length,
        stationKinds: st.map((e) => e.kind).join(" "),
      };
    }
    function scheduleWindow(ctx, dest, events, len, origin, from, to, busy) {
      let step = 0.1;
      while (from < to) {
        let pos = (from - origin) % len;
        pos < 0 && (pos += len);
        for (let ev of events) {
          if (ev.busy && !busy) continue;
          let dt = ev.t - pos;
          dt < 0 && (dt += len);
          dt < step && playEv(ctx, dest, from + dt, ev);
        }
        from += step;
      }
      return from;
    }
    function bedTick(want) {
      let name = want === "warm" ? "drift" : want === "party" ? "glow" : "";
      musicTalking = !!(n.cur && n.cur.k === "bub");
      if (!S) {
        name && (warmPlayState = "pending");
        musicPublish(name !== "drift");
        return;
      }
      S.state !== "running" && S.resume && S.resume().catch(() => {});
      let bus = bedOut();
      if (!bus) return;
      let goal = name && !G && z > 0 ? (musicTalking ? 0.22 : 0.72) : 0;
      musicLevel = goal;
      try {
        bus.gain.setTargetAtTime(goal, S.currentTime, 0.08);
      } catch {}
      if (name && !G && z > 0) {
        if (bedName !== name) ((bedName = name), (bedOrigin = S.currentTime + 0.06), (bedUntil = bedOrigin));
        let events = name === "glow" ? glowEvents() : driftEvents(),
          len = name === "glow" ? GLOW_LEN : DRIFT_LEN,
          horizon = S.currentTime + 1.15;
        bedUntil = scheduleWindow(S, bus, events, len, bedOrigin, bedUntil, horizon, partyBusy());
        name === "drift" && (warmPlayState = S.state === "running" ? "ok" : "pending");
      } else bedName = "";
      musicPublish(bedName !== "drift");
    }
    function stationCall() {
      if (!S || !M || G) return;
      for (let ev of stationEvents()) playEv(S, M, S.currentTime + 0.04 + ev.t, ev);
    }
    function musicPublish(paused) {
      window.__ss &&
        ((window.__ss.warmPlay = warmPlayState),
        (window.__ss.warmCue = warmWhy()),
        (window.__ss.warmPaused = !!paused),
        (window.__ss.musicBed = bedName),
        (window.__ss.musicDuck = musicTalking),
        (window.__ss.musicLevel = musicLevel),
        (window.__ss.musicBusy = partyBusy()));
    }
    function wavBase64(buffer) {
      let ch = buffer.getChannelData(0),
        n = ch.length,
        out = new ArrayBuffer(44 + n * 2),
        v = new DataView(out),
        put = (o, s) => {
          for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
        };
      (put(0, "RIFF"),
        v.setUint32(4, 36 + n * 2, !0),
        put(8, "WAVE"),
        put(12, "fmt "),
        v.setUint32(16, 16, !0),
        v.setUint16(20, 1, !0),
        v.setUint16(22, 1, !0),
        v.setUint32(24, buffer.sampleRate, !0),
        v.setUint32(28, buffer.sampleRate * 2, !0),
        v.setUint16(32, 2, !0),
        v.setUint16(34, 16, !0),
        put(36, "data"),
        v.setUint32(40, n * 2, !0));
      for (let i = 0; i < n; i++) {
        let s = Math.max(-1, Math.min(1, ch[i]));
        v.setInt16(44 + i * 2, s < 0 ? s * 32768 : s * 32767, !0);
      }
      let bytes = new Uint8Array(out),
        bin = "";
      for (let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
      return btoa(bin);
    }
    async function renderCueWav(name, seconds, busy) {
      let rate = 44100,
        ctx = new OfflineAudioContext(1, Math.ceil(rate * seconds), rate),
        dest = ctx.createGain(),
        events = name === "glow" ? glowEvents() : name === "station" ? stationEvents() : driftEvents(),
        len = name === "glow" ? GLOW_LEN : name === "station" ? 6 : DRIFT_LEN;
      ((dest.gain.value = 0.9), dest.connect(ctx.destination));
      for (let base = 0; base + 0.01 < seconds; base += len) {
        for (let ev of events) {
          if (ev.busy && !busy) continue;
          let when = 0.05 + base + ev.t;
          when < seconds && playEv(ctx, dest, when, ev);
        }
        if (name === "station") break;
      }
      return wavBase64(await ctx.startRendering());
    }
