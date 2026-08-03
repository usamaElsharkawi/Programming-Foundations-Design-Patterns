import type { FlyBehavior } from "./interfaces.js";

export class FlyWithWings implements FlyBehavior {
  fly(): void {
    console.log("I am flying with wings");
  }
}

export class FlyNoWay implements FlyBehavior {
  fly(): void {
    console.log("I can't fly");
  }
}

export class FlyRocketPowered implements FlyBehavior {
  fly(): void {
    console.log("I am flying with a rocket");
  }
}
