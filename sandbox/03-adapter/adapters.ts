/**
 * adapters.ts — The Adapter classes
 *
 * Each adapter is the ONLY object that knows about BOTH sides. It:
 *   - implements the TARGET interface (so the client accepts it)
 *   - composes (wraps) the ADAPTEE (so it can reach the real object)
 *   - translates every method call from the Target's vocabulary into the
 *     Adaptee's vocabulary, sometimes adding logic to make semantics match.
 */
import type { Duck, Turkey, Drone } from "./interfaces.js";

/**
 * ADAPTER #1 — makes a Turkey look like a Duck.
 *
 *   Target:  Duck    (quack, fly)
 *   Adaptee: Turkey  (gobble, fly)
 *
 * Translation:
 *   quack() → turkey.gobble()           (a rename)
 *   fly()   → turkey.fly() ×5           (turkeys fly short → loop 5× to
 *                                        emulate a long duck flight)
 */
export class TurkeyAdapter implements Duck {
  constructor(private turkey: Turkey) {}

  quack(): void {
    this.turkey.gobble();
  }

  fly(): void {
    for (let i = 0; i < 5; i++) {
      this.turkey.fly();
    }
  }
}

/**
 * ADAPTER #2 — the REVERSE adapter: makes a Duck look like a Turkey.
 *
 *   Target:  Turkey  (gobble, fly)
 *   Adaptee: Duck    (quack, fly)
 *
 * Translation:
 *   gobble() → duck.quack()             (a rename, opposite direction)
 *   fly()    → duck.fly() but only 1/5  (ducks fly far; a turkey only flies
 *                                        a short distance, so we randomly
 *                                        call duck.fly() ~20% of the time)
 */
export class DuckAdapter implements Turkey {
  constructor(private duck: Duck) {}

  gobble(): void {
    this.duck.quack();
  }

  fly(): void {
    if (Math.floor(Math.random() * 5) === 0) {
      this.duck.fly();
    }
  }
}

/**
 * ADAPTER #3 (challenge) — makes a Drone look like a Duck.
 *
 *   Target:  Duck   (quack, fly)
 *   Adaptee: Drone  (beep, spin_rotors, take_off)
 *
 * Translation:
 *   quack() → drone.beep()              (a rename)
 *   fly()   → drone.spin_rotors() +     (one Target method maps to TWO
 *             drone.take_off()           Adaptee methods — logic-aware
 *                                        translation)
 */
export class DroneAdapter implements Duck {
  constructor(private drone: Drone) {}

  quack(): void {
    this.drone.beep();
  }

  fly(): void {
    this.drone.spin_rotors();
    this.drone.take_off();
  }
}
