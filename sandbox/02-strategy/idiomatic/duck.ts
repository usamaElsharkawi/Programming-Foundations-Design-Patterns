/**
 * duck.ts — The abstract Duck class (abstract class with behavior fields)
 *
 * This is nearly identical to the faithful translation. The only change is
 * in performFly(): instead of calling this.flyBehavior.fly(), we now call
 * this.flyBehavior() directly — because FlyBehavior is a function, not an
 * object with a fly() method.
 */
import type { FlyBehavior, QuackBehavior } from "./behaviors.js";

export abstract class Duck {
  constructor(
    private flyBehavior: FlyBehavior,
    private quackBehavior: QuackBehavior,
  ) {}

  abstract display(): void;

  performFly(): void {
    this.flyBehavior();
  }

  performQuack(): void {
    this.quackBehavior();
  }

  swim(): void {
    console.log("All ducks float, even decoys!");
  }

  setFlyBehavior(fb: FlyBehavior): void {
    this.flyBehavior = fb;
  }

  setQuackBehavior(qb: QuackBehavior): void {
    this.quackBehavior = qb;
  }
}