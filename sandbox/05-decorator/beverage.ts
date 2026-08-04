/**
 * beverage.ts — The Component and the abstract Decorator
 *
 * This mirrors the Java StarbuzzCoffee structure:
 *
 *   Beverage (abstract)         → the COMPONENT (what everything is)
 *     ├─ protected description  → each concrete beverage sets its own name
 *     ├─ getDescription()       → concrete, returns the description
 *     └─ cost()                 → abstract, each beverage/decorator provides it
 *
 *   CondimentDecorator (abstract) → the DECORATOR base
 *     ├─ extends Beverage        → IS-A Component (same type → nestable)
 *     ├─ holds a Beverage?       → no—each concrete decorator holds it (HAS-A)
 *     └─ getDescription()        → re-declared abstract (must be overridden)
 */

/**
 * COMPONENT — the base type for all beverages and decorators.
 * Because every decorator extends Beverage, a fully decorated drink can be
 * treated as just a Beverage (IS-A), and decorators can wrap each other.
 */
export abstract class Beverage {
  protected description: string = "Unknown Beverage";

  getDescription(): string {
    return this.description;
  }

  abstract cost(): number;
}

/**
 * DECORATOR BASE — the common type for all condiment wrappers.
 * It does NOT hold a beverage itself; each concrete decorator adds the
 * `private beverage` field (HAS-A). This class just pins the type so that
 * all condiments share the same interface and can nest with one another.
 *
 * `getDescription()` is re-declared abstract so every concrete decorator is
 * forced to implement it (it must prepend its own name to the wrapped drink).
 */
export abstract class CondimentDecorator extends Beverage {
  abstract override getDescription(): string;
}
