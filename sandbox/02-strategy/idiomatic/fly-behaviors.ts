/**
 * fly-behaviors.ts — Concrete flying behaviors (idiomatic refactor)
 *
 * Instead of classes, each behavior is a simple function. This removes the
 * class boilerplate — no `class`, no `implements`, no `new`.
 *
 * Each function matches the FlyBehavior type: () => void
 */
import type { FlyBehavior } from "./behaviors.js";

/**
 * Flying with wings — the "normal" duck flies.
 */
export const flyWithWings: FlyBehavior = () => {
  console.log("I'm flying with wings");
};

/**
 * Can't fly — rubber ducks, decoys, etc.
 */
export const flyNoWay: FlyBehavior = () => {
  console.log("I can't fly");
};

/**
 * Rocket-powered flight — injected at runtime.
 */
export const flyRocketPowered: FlyBehavior = () => {
  console.log("I am flying with a rocket");
};