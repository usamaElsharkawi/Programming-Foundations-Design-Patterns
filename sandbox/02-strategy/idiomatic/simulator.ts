/**
 * simulator.ts — Demonstrates the Strategy pattern (idiomatic refactor)
 *
 * The simulation logic is IDENTICAL to the faithful translation.
 * Only the imports changed (function names instead of class names,
 * no `new` keyword).
 */
import { MallardDuck, RedheadDuck, RubberDuck, DecoyDuck } from "./ducks.js";
import { flyRocketPowered } from "./fly-behaviors.js";
import type { Duck } from "./duck.js";

console.log("=== Duck Simulator (Idiomatic TS) ===\n");

const mallard: Duck = new MallardDuck();
const redhead: Duck = new RedheadDuck();
const rubber: Duck = new RubberDuck();
const decoy: Duck = new DecoyDuck();

const ducks: Duck[] = [mallard, redhead, rubber, decoy];

for (const duck of ducks) {
  duck.display();
  duck.performQuack();
  duck.performFly();
  duck.swim();
  console.log("");
}

// === Demonstrate runtime behavior change ===
console.log("=== Runtime Behavior Change ===\n");

console.log("RubberDuck before behavior change:");
rubber.performFly();

// Change flying behavior to rocket-powered
rubber.setFlyBehavior(flyRocketPowered);
console.log("RubberDuck after setFlyBehavior(flyRocketPowered):");
rubber.performFly();

// Demonstrate constructor injection with an inline function
const customRubber = new RubberDuck(flyRocketPowered, () => {
  console.log("Custom quack sound!");
});
console.log("\nCustom RubberDuck with injected behaviors:");
customRubber.performFly();
customRubber.performQuack();