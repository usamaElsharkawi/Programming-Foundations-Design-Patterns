/**
 * ducks.ts — Concrete duck subclasses (idiomatic refactor)
 *
 * The duck classes look almost the same. The only difference is HOW we
 * pass behaviors to super():
 *
 *   Faithful (classes):  super(new FlyWithWings(), new Quack());
 *   Idiomatic (funcs):   super(flyWithWings, quack);
 *
 * No `new` keyword! We pass the function references directly.
 */
import { Duck } from "./duck.js";
import { flyWithWings, flyNoWay } from "./fly-behaviors.js";
import { quack, squeak, muteQuack } from "./quack-behaviors.js";
import type { FlyBehavior, QuackBehavior } from "./behaviors.js";

export class MallardDuck extends Duck {
  constructor() {
    super(flyWithWings, quack);
  }

  override display(): void {
    console.log("I'm a Mallard Duck");
  }
}

export class RedheadDuck extends Duck {
  constructor() {
    super(flyWithWings, quack);
  }

  override display(): void {
    console.log("I'm a Redhead Duck");
  }
}

export class RubberDuck extends Duck {
  constructor(
    flyBehavior?: FlyBehavior,
    quackBehavior?: QuackBehavior,
  ) {
    super(flyBehavior ?? flyNoWay, quackBehavior ?? squeak);
  }

  override display(): void {
    console.log("I'm a Rubber Duck");
  }
}

export class DecoyDuck extends Duck {
  constructor() {
    super(flyNoWay, muteQuack);
  }

  override display(): void {
    console.log("I'm a Decoy Duck");
  }
}