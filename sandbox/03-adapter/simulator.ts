/**
 * simulator.ts — The Client
 *
 * The client only ever knows about the TARGET interface (`Duck` or `Turkey`).
 * It never imports or references any adapter's internals — it just calls
 * `quack()` / `fly()` / `gobble()` on whatever object it's handed. The
 * adapters do all the translation silently underneath.
 */
import type { Duck, Turkey } from "./interfaces.js";
import { MallardDuck, WildTurkey, SuperDrone } from "./concrete-classes.js";
import { TurkeyAdapter, DuckAdapter, DroneAdapter } from "./adapters.js";

/**
 * A helper that expects a Duck. This is the "client" code — it only knows
 * the Duck interface and never needs to change, no matter what we pass it.
 */
function testDuck(duck: Duck): void {
  duck.quack();
  duck.fly();
}

/**
 * A helper that expects a Turkey (used to demo the reverse adapter).
 */
function testTurkey(turkey: Turkey): void {
  turkey.gobble();
  turkey.fly();
}

// --- The Duck side: a real duck, a turkey-as-duck, a drone-as-duck ---

console.log("=== Duck Test Drive ===\n");

const duck = new MallardDuck();
const turkey = new WildTurkey();
const turkeyAdapter: Duck = new TurkeyAdapter(turkey);
const drone = new SuperDrone();
const droneAdapter: Duck = new DroneAdapter(drone);

console.log("The Turkey says...");
turkey.gobble();
turkey.fly();

console.log("\nThe Duck says...");
testDuck(duck);

console.log("\nThe TurkeyAdapter says...");
testDuck(turkeyAdapter);

console.log("\nThe DroneAdapter says...");
testDuck(droneAdapter);

// --- The Turkey side: a duck-as-turkey (reverse adapter) ---

console.log("\n=== Turkey Test Drive ===\n");

const duckAdapter: Turkey = new DuckAdapter(duck);

for (let i = 0; i < 10; i++) {
  console.log(`The DuckAdapter says... (attempt ${i + 1})`);
  testTurkey(duckAdapter);
}
