/**
 * coffees.ts — The ConcreteComponents (base beverages)
 *
 * Each is a plain Beverage that fixes its own description and cost.
 * None of these know anything about the condiment decorators — that's
 * open-closed: the base drinks never change when new condiments are added.
 */
import { Beverage } from "./beverage.js";

export class HouseBlend extends Beverage {
  constructor() {
    super();
    this.description = "House Blend Coffee";
  }

  cost(): number {
    return 0.89;
  }
}

export class DarkRoast extends Beverage {
  constructor() {
    super();
    this.description = "Dark Roast Coffee";
  }

  cost(): number {
    return 0.99;
  }
}

export class Decaf extends Beverage {
  constructor() {
    super();
    this.description = "Decaf Coffee";
  }

  cost(): number {
    return 1.05;
  }
}

export class Espresso extends Beverage {
  constructor() {
    super();
    this.description = "Espresso";
  }

  cost(): number {
    return 1.99;
  }
}
