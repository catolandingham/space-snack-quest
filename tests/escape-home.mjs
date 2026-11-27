/**
 * Beats 45 and 46 of the escape, rebuilt from the story pass of 2026-11-26 (src/modules/escape.js, escape-home-art.js),
 * at phone size, from Mops reaching home:
 *   45a  the switch back to Squatch is announced; Mops's lines, word for word, in short bubbles; Squatch's gulp and
 *        sweat drop (no words); the brochure in his paw is outlined; SHOW · brochure: it is held up big, hearts over
 *        Mops, "Let's go find that pancake place."; Mops touches the crate's worn letter ("_ARS CAKES"): "...Mars."
 *   45b  "How? The scanner stops fur." / "You came here in a crate."; LOOK · crate (the crate outlined): the crayon plan
 *        gets its crate picture; "...I can LEAVE in a crate!" / "Empty crates ride back on the ship."; LOOK · calendar
 *        (outlined): the ship; the talk adds the computer and the door; every line word for word, in order.
 *   46   the almost-slip, word for word, in order, with his thought picture of the sheet going into the vent before he
 *        says it; then on to the vent.
 * Also ↺ in each step he controls, and the words drawn (the stamp, the plan has no words).
 *   node tests/escape-home.mjs
 */
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const { ESCAPE_LINES } = await import(M("escape-lines.js"));
const { STARS_CAKES } = await import(M("stars-cakes.js"));
const W = Object.fromEntries(ESCAPE_LINES.map((l) => [l.id, l.text]));
const g = await startGame({ port: 9785, name: "escape-home" });
const { ctx, page, errors } = await g.open("?beat=escape:walkhome", { width: 375, height: 812, isMobile: true, hasTouch: true });
await page.evaluate(() => window.__ss.lockedReady);

const run = await page.evaluate(
  async ({ W }) => {
    const ss = window.__ss,
      n = ss.op,
      E = window.SSQ.engine(),
      B = window.SSQ.beat("ch1-escape"),
      d = () => B.debug(),
      S = () => n.ch1Escape;
    const out = {};
    let watch = null,
      ticks = 0;
    const tick = (s = 0.05) => (ss.tick(s), watch && ++ticks % 3 === 0 && (ss.drawFrame(), watch()));
    const until = (f, s = 30) => {
      for (let i = 0; i < s / 0.05 && !f(); i++) tick();
      return f();
    };
    const say = () => (n.cur && n.cur.k === "bub" ? n.cur.b.text : n.cur && n.cur.k === "card" ? n.cur.text : "");
    const next = () => {
      const was = n.cur;
      for (let i = 0; i < 20 && n.cur === was; i++) (tick(0.1), (n.bt = 1), ss.opTap());
      tick();
    };
    // the lines until the player has control again; `see` runs on each before NEXT
    const lines = (see) => {
      const got = [];
      for (let i = 0; i < 40; i++) {
        until(() => (n.cur && (n.cur.k === "bub" || n.cur.k === "card")) || (n.ctrl && !n.cur && !n.q.length), 20);
        if (!n.cur) break;
        got.push(say());
        see && (ss.drawFrame(), see(got.length - 1));
        next();
      }
      return got;
    };
    const press = () => {
      tick();
      const a = ss.offerNow();
      a && a.f && a.f();
      tick();
      return a ? a.verb + " · " + a.cap : "";
    };
    // Mops home: into each doorway on the way (the walk is checked in tests/escape-mops.mjs)
    for (let k = 0; k < 4 && n.room !== "closet"; k++) {
      const door = ss.spotsNow().find((q) => q.id === "es-door");
      door && ((n.mo.x = door.x), (n.mo.y = door.y));
      tick();
      tick();
    }
    out.room = n.room;
    // 45a
    const seen45 = { sweat: false, stamp: "" };
    watch = () => d().drew && d().drew.sweat && (seen45.sweat = true);
    out.a = lines(() => {
      d().drew.sweat && (seen45.sweat = true);
      seen45.stamp = d().drew.stamp || seen45.stamp;
    });
    watch = null;
    out.a45 = { ...seen45, step: S().step, chip: n.ch1Chip, playing: E.playing() };
    ss.drawFrame();
    out.a45.mark = !!d().drew.mark;
    out.a45.press = press();
    tick(0.2);
    ss.drawFrame();
    out.a45.up = d().drew.brochureUp;
    // the rest of 45a and the start of 45b
    let touched = false;
    out.b1 = lines(() => (touched = touched || S().touchAt >= 0));
    out.a45.touched = touched;
    out.crate = { step: S().step, chip: n.ch1Chip };
    ss.drawFrame();
    out.crate.mark = !!d().drew.mark;
    // ↺ in the crate step: back where it began
    for (let i = 0; i < 4; i++) tick();
    const at0 = { x: Math.round(n.sq.x), y: Math.round(n.sq.y) };
    n.sq.x += 60;
    ss.sectionReset();
    for (let i = 0; i < 4; i++) tick();
    out.crate.restart = { step: S().step, back: Math.round(n.sq.x) === at0.x && Math.round(n.sq.y) === at0.y };
    n.sq.x = B.place.HOME.crateAt.x;
    n.sq.y = B.place.HOME.crateAt.y;
    out.crate.press = press();
    const plans = [];
    out.b2 = lines(() => d().drew.plan && plans.push(Object.keys(d().drew.plan.has).sort().join("+")));
    out.cal = { step: S().step, chip: n.ch1Chip };
    ss.drawFrame();
    out.cal.mark = !!d().drew.mark;
    n.sq.x = B.place.HOME.calAt.x;
    n.sq.y = B.place.HOME.calAt.y;
    out.cal.press = press();
    // 45b's talk, then 46, each line with what is drawn
    const thinks = [];
    out.b3 = lines((i) => (d().drew.plan && plans.push(Object.keys(d().drew.plan.has).sort().join("+")), S().think && thinks.push(i)));
    out.b3 = out.b3.filter(Boolean); // (the walk out starts after the last line)
    out.plans = [...new Set(plans)];
    // his thought of the vent comes before the line that names it
    out.thinkBefore = thinks;
    until(() => S().step === "ball" || S().step === "tobay" || S().step === "sneak", 20);
    out.after = S().step;
    return out;
  },
  { W },
);
const o = run;
const w = (...ids) => ids.map((k) => W[k]);
g.check("45a: Mops comes home; the switch back to Squatch is announced; his lines, word for word, in order", o.room === "closet" && JSON.stringify(o.a) === JSON.stringify(["You are SQUATCH now.", ...w("mops-you-right", "mops-replacing", "mops-ship", "mops-brochure")]), o.a);
g.check("45a: Squatch's gulp and sweat drop (no words); his crate's stamp reads _ARS CAKES", o.a45.sweat && o.a45.stamp === STARS_CAKES.faded, o.a45);
g.check("45a: SHOW · brochure, the brochure in his paw outlined; it is held up big", o.a45.step === "show" && o.a45.chip === W["chip-show"] && o.a45.mark && o.a45.press === W["button-show"] && o.a45.up && o.a45.up.big, o.a45);
g.check("45a, 45b: \"Let's go find that pancake place.\", Mops touches the worn letter, \"...Mars.\"; then the plan's first lines", JSON.stringify(o.b1) === JSON.stringify(w("mops-pancake-go", "mops-mars", "sq-how", "mops-crate")) && o.a45.touched, o.b1);
g.check("45b: LOOK · crate, the crate outlined; ↺ there puts him back", o.crate.step === "crate" && o.crate.chip === W["chip-crate-look"] && o.crate.mark && o.crate.press === W["button-crate"] && o.crate.restart.step === "crate" && o.crate.restart.back, o.crate);
g.check("45b: the crate picture on the crayon plan, then \"...I can LEAVE in a crate!\" and \"Empty crates ride back on the ship.\"", JSON.stringify(o.b2) === JSON.stringify(w("sq-leave", "mops-empties")), o.b2);
g.check("45b: LOOK · calendar, the calendar outlined", o.cal.step === "cal" && o.cal.chip === W["chip-cal-look"] && o.cal.mark && o.cal.press === W["button-calendar"], o.cal);
const talk = w("mops-book", "mops-computer", "sq-office", "sq-locked", "mops-code", "mops-pen", "mops-ate", "mops-bin", "sq-slip", "mops-hm", "sq-vent", "mops-big-vent", "mops-lost", "mops-know");
g.check("45b, 46: the plan's talk and the almost-slip, word for word, in order", JSON.stringify(o.b3) === JSON.stringify(talk), o.b3);
g.check("45b: the plan's pictures come one at a time: the crate, the ship over it, the computer, the door", JSON.stringify(o.plans) === JSON.stringify(["crate", "crate+ship", "computer+crate+ship", "computer+crate+door+ship"]), o.plans);
g.check("46: his thought picture of the vent is up before he says \"Didn't a copy get sucked into the vent?\"", o.b3.indexOf(W["sq-vent"]) > 0, o);
g.check("46: then on to the vent", ["tobay", "ball", "sneak"].includes(o.after), o.after);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("escape-home");
