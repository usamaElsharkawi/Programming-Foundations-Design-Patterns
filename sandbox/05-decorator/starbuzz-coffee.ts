/**
 * starbuzz-coffee.ts — The Client
 *
 * This is the "main". It builds beverages by wrapping base drinks with
 * decorators at RUNTIME. Notice:
 *   - Each beverage is declared as type Beverage — the client treats a
 *     fully-decorated drink as just a Beverage (IS-A).
 *   - The wrapping (composition) happens dynamically — no subclassing needed.
 *   - Adding a new condiment to the menu would be one new decorator class;
 *     nothing here or in the beverages would change (open-closed).
 */
import type { Beverage } from "./beverage.js";
import { Espresso, DarkRoast, HouseBlend } from "./coffees.js";
import { Mocha, Whip, Soy } from "./condiments.js";

// 1. Plain Espresso — no decorators.
let beverage: Beverage = new Espresso();
console.log(`${beverage.getDescription()} $${beverage.cost()}`);

// 2. DarkRoast with DOUBLE Mocha and Whip — three decorators stacked.
//    Note: reassigning the SAME variable to wrap it again (as in Java).
let beverage2: Beverage = new DarkRoast();
beverage2 = new Mocha(beverage2);
beverage2 = new Mocha(beverage2); // double mocha = same decorator twice
beverage2 = new Whip(beverage2);
console.log(`${beverage2.getDescription()} $${beverage2.cost()}`);

// 3. HouseBlend with Soy, Mocha, and Whip.
let beverage3: Beverage = new HouseBlend();
beverage3 = new Soy(beverage3);
beverage3 = new Mocha(beverage3);
beverage3 = new Whip(beverage3);
console.log(`${beverage3.getDescription()} $${beverage3.cost()}`);
