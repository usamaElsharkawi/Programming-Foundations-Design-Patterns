import { MallardDuck } from "./ducks.js";
import { RedheadDuck } from "./ducks.js";
import { RubberDuck } from "./ducks.js";
import { DecoyDuck } from "./ducks.js";
import type { Duck } from "./duck.js";
import { FlyRocketPowered } from "./fly-behaviors.js";

console.log("=== Duck Simulator ===\n");

// Create ducks and call their methods
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
  console.log(""); // blank line between ducks
}

// === Demonstrate changing behavior at runtime ===
console.log("=== Runtime Behavior Change ===\n");

// RubberDuck starts with "can't fly"
console.log("RubberDuck before behavior change:");
rubber.performFly(); // → "I can't fly"

// Now change its flying behavior to rocket-powered!
rubber.setFlyBehavior(new FlyRocketPowered());
console.log("RubberDuck after setFlyBehavior(FlyRocketPowered):");
rubber.performFly(); // → "I am flying with a rocket"

// RubberDuck was created with default Squeak — let's change that too
console.log("\nRubberDuck's quack before:");
rubber.performQuack(); // → "Squeak"

// Demonstrate constructor injection with custom behaviors
const customRubber = new RubberDuck(new FlyRocketPowered(), {
  quack(): void {
    console.log("Custom quack sound!");
  },
});
console.log("\nCustom RubberDuck with injected behaviors:");
customRubber.performFly(); // → "I am flying with a rocket"
customRubber.performQuack(); // → "Custom quack sound!"
