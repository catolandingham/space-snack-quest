// Entry point for new code written as real modules. tools/build.mjs bundles this file with esbuild
// (strict mode) and runs it before the older program in src/game/, so window.SSQ exists when that
// program starts. Rebuilt Chapter 1 beats will be imported here and registered on the bridge.
import { createBridge } from "./bridge.js";

// Not writable or replaceable: the older program and every module see the same bridge.
Object.defineProperty(window, "SSQ", { value: createBridge(), writable: false, configurable: false, enumerable: true });
