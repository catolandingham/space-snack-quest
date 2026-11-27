// Entry point for new code written as real modules. tools/build.mjs bundles this file with esbuild
// (strict mode) and runs it before the older program in src/game/, so window.SSQ exists when that
// program starts. Rebuilt Chapter 1 beats are imported here and registered on the bridge.
import { createBridge } from "./bridge.js";
import { createMorning } from "./morning.js";
import { createParty } from "./party.js";
import { createTvStory } from "./tv-story.js";
import { createBedtimeStory } from "./bedtime-story.js";
import { createHomeMorning } from "./home-morning.js";
import { createLunchSneak } from "./lunch-sneak.js";
import { createEvening } from "./evening.js";

const bridge = createBridge();
// The rebuilt beats. The older program asks for each by id where it used to run its own code.
bridge.registerBeat("ch1-morning", createMorning(bridge));
bridge.registerBeat("ch1-party", createParty(bridge));
bridge.registerBeat("ch1-tv-story", createTvStory(bridge));
bridge.registerBeat("ch1-bedtime-story", createBedtimeStory(bridge));
bridge.registerBeat("ch1-home-morning", createHomeMorning(bridge));
bridge.registerBeat("ch1-lunch", createLunchSneak(bridge));
bridge.registerBeat("ch1-evening", createEvening(bridge));
// Not writable or replaceable: the older program and every module see the same bridge.
Object.defineProperty(window, "SSQ", { value: bridge, writable: false, configurable: false, enumerable: true });
