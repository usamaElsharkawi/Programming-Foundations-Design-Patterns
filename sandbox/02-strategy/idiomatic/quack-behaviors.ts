/**
 * quack-behaviors.ts — Concrete quacking behaviors (idiomatic refactor)
 *
 * Same pattern as fly-behaviors: functions instead of classes.
 * Each function matches the QuackBehavior type: () => void
 */
import type { QuackBehavior } from "./behaviors.js";

/**
 * A normal duck's quack.
 */
export const quack: QuackBehavior = () => {
  console.log("Quack");
};

/**
 * A squeaky quack — rubber ducks, etc.
 */
export const squeak: QuackBehavior = () => {
  console.log("Squeak");
};

/**
 * A muted quack — decoys can't quack.
 */
export const muteQuack: QuackBehavior = () => {
  console.log("<silence> Mute");
};