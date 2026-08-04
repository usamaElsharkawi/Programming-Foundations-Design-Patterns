/**
 * concrete-classes.ts — The concrete Target and Adaptees
 *
 * These are the "real" objects. None of them know about each other and none
 * of them know about any adapter. Each just implements its own interface.
 */
import type { Duck, Turkey, Drone } from "./interfaces.js";

/**
 * A concrete Target — a normal duck.
 */
export class MallardDuck implements Duck {
  quack(): void {
    console.log("Quack");
  }

  fly(): void {
    console.log("I'm flying");
  }
}

/**
 * A concrete Adaptee — a wild turkey. Note it `gobble()`s, not `quack()`s,
 * and its `fly()` only covers a short distance.
 */
export class WildTurkey implements Turkey {
  gobble(): void {
    console.log("Gobble gobble");
  }

  fly(): void {
    console.log("I'm flying a short distance");
  }
}

/**
 * A concrete Adaptee (challenge) — a drone with a totally different
 * interface: beep, spin_rotors, take_off.
 */
export class SuperDrone implements Drone {
  beep(): void {
    console.log("Beep beep beep");
  }

  spin_rotors(): void {
    console.log("Rotors are spinning");
  }

  take_off(): void {
    console.log("Taking off");
  }
}
