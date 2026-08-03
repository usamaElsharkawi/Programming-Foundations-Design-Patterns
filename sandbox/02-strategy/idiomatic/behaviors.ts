/**
 * behaviors.ts — The Strategy contracts (idiomatic TypeScript refactor)
 *
 * Instead of using `interface`, we use `type` aliases for the behavior
 * contracts. Since each behavior is a single-method strategy, we define them
 * as function types — a more natural fit in TypeScript.
 *
 * This is the KEY difference from the faithful translation:
 *   interface FlyBehavior { fly(): void; }   ← Java OOP style
 *   type FlyBehavior = () => void;            ← TS functional style
 */

/**
 * A flying behavior — a function you call with no args.
 */
export type FlyBehavior = () => void;

/**
 * A quacking behavior — a function you call with no args.
 */
export type QuackBehavior = () => void;