/**
 * condiments.ts — The ConcreteDecorators
 *
 * Each condiment:
 *   - extends CondimentDecorator (so it IS-A Beverage → nestable/interchangeable)
 *   - wraps a Beverage via a private constructor parameter property (HAS-A)
 *   - overrides getDescription() to prepend its own name, then delegates
 *   - overrides cost() to add its own price, then delegates
 *
 * This is the delegation + augmentation mechanism: each decorator adds its
 * piece and passes the rest down the chain.
 */
import { CondimentDecorator, Beverage } from "./beverage.js";

export class Mocha extends CondimentDecorator {
  constructor(private beverage: Beverage) {
    super();
  }

  override getDescription(): string {
    return this.beverage.getDescription() + ", Mocha";
  }

  override cost(): number {
    return 0.2 + this.beverage.cost();
  }
}

export class Milk extends CondimentDecorator {
  constructor(private beverage: Beverage) {
    super();
  }

  override getDescription(): string {
    return this.beverage.getDescription() + ", Milk";
  }

  override cost(): number {
    return 0.1 + this.beverage.cost();
  }
}

export class Soy extends CondimentDecorator {
  constructor(private beverage: Beverage) {
    super();
  }

  override getDescription(): string {
    return this.beverage.getDescription() + ", Soy";
  }

  override cost(): number {
    return 0.15 + this.beverage.cost();
  }
}

export class Whip extends CondimentDecorator {
  constructor(private beverage: Beverage) {
    super();
  }

  override getDescription(): string {
    return this.beverage.getDescription() + ", Whip";
  }

  override cost(): number {
    return 0.1 + this.beverage.cost();
  }
}
