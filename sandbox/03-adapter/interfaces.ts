/**
 * interfaces.ts — The Adapter pattern contracts
 *
 * Three interfaces live here. Two are "targets" (what a client expects) and
 * one is an "adaptee" (what we have). The Drone is a second adaptee used in
 * the challenge exercise.
 *
 * All three have MORE THAN ONE method, so we use `interface` (not a function
 * type). A function type can only describe one signature; an interface can
 * describe a multi-method object shape.
 */

/**
 * TARGET #1 — the interface the duck-client expects.
 * A Duck can quack and fly.
 */
export interface Duck {
  quack(): void;
  fly(): void;
}

/**
 * ADAPTEE #1 — the interface a Turkey has. Note the mismatch: Turkeys
 * `gobble()` instead of `quack()`. This incompatibility is exactly what the
 * Adapter pattern exists to bridge.
 */
export interface Turkey {
  gobble(): void;
  fly(): void;
}

/**
 * ADAPTEE #2 (challenge) — a completely different kind of flying thing.
 * A Drone beeps, spins its rotors, and takes off. Nothing in common with a
 * Duck by name, so an adapter is required to make a Drone behave like a Duck.
 */
export interface Drone {
  beep(): void;
  spin_rotors(): void;
  take_off(): void;
}
