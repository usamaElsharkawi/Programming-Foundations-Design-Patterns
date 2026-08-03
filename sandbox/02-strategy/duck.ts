import type { FlyBehavior, QuackBehavior } from "./interfaces.js";

export abstract class Duck {
  constructor(
    private flyBehavior: FlyBehavior,
    private quackBehavior: QuackBehavior,
  ) {}

  abstract display(): void;

  performFly(): void {
    this.flyBehavior.fly();
  }
  performQuack(): void {
    this.quackBehavior.quack();
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
