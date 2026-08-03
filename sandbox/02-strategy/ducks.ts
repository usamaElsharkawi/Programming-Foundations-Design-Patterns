import { Duck } from "./duck.js";
import { FlyWithWings, FlyNoWay } from "./fly-behaviors.js";
import { Quack, Squeak, MuteQuack } from "./quack-behaviors.js";
import type { FlyBehavior, QuackBehavior } from "./interfaces.js";

export class MallardDuck extends Duck {
  constructor() {
    super(new FlyWithWings(), new Quack());
  }

  override display(): void {
    console.log("I'm a Mallard Duck");
  }
}

export class RedheadDuck extends Duck {
  constructor() {
    super(new FlyWithWings(), new Quack());
  }

  override display(): void {
    console.log("I'm a Redhead Duck");
  }
}


// RubberDuck has two Java constructors:
//   1. RubberDuck() → defaults (FlyNoWay, Squeak)
//   2. RubberDuck(fb, qb) → injected
// In TypeScript we collapse them into one with optional params + ?:
export class RubberDuck extends Duck {
  constructor(
    flyBehavior?: FlyBehavior,
    quackBehavior?: QuackBehavior,
  ) {
    super(flyBehavior ?? new FlyNoWay(), quackBehavior ?? new Squeak());
  }

  override display(): void {
    console.log("I'm a Rubber Duck");
  }
}

export class DecoyDuck extends Duck {
  constructor() {
    super(new FlyNoWay(), new MuteQuack());
  }

  override display(): void {
    console.log("I'm a Decoy Duck");
  }
}
