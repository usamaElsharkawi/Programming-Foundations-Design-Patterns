# Section 5 — The Decorator Pattern

> _Documented after our discussion of lecture 5.1 (Creating chaos with
> inheritance)._

---

## 1. Lecture 5.1 — Creating chaos with inheritance

### Takeaways (from the video)

- Using inheritance to handle many beverage and condiment combinations leads to
  complex, hard-to-maintain code with many subclasses.
- The decorator pattern offers a flexible alternative by using composition to
  add condiments dynamically, avoiding the explosion of subclasses.
- This pattern supports easier extension and maintenance, allowing new drinks
  or condiments to be added without changing existing code.
- This approach aligns with the design principle of favoring composition over
  inheritance, helping create more adaptable and resilient software.

### The problem — "class explosion" via inheritance

The course uses the **Starbuzz Coffee** example. You sell beverages
(HouseBlend, DarkRoast, Decaf, Espresso) and customers can add condiments
(Milk, Mocha, Soy, Whip).

**The inheritance approach** — make a subclass for every combination:

```
Beverage
├── HouseBlend
├── HouseBlendWithMilk
├── HouseBlendWithMocha
├── HouseBlendWithMilkAndMocha
├── HouseBlendWithMilkAndWhip
├── HouseBlendWithMochaAndWhip
├── HouseBlendWithMilkAndMochaAndWhip
├── DarkRoast
├── DarkRoastWithMilk
├── ... (and so on for Decaf, Espresso)
```

**Count the explosion:**
- 4 beverages × combinations of 4 condiments = up to 4 × 2⁴ = **64 classes**
- Add a 5th condiment → 4 × 2⁵ = **128 classes**
- Add a 6th condiment → **256 classes**

This is **exponential growth** — the classic "class explosion." Every new
condiment doubles the number of classes.

**Why this is unmaintainable:**
- Adding a new condiment means creating dozens of new subclasses.
- If the price of milk changes, you must find and update every class that
  mentions milk.
- You can't handle "double mocha" without yet another class.
- Class names become absurd: `HouseBlendWithMilkAndMochaAndWhipAndSoy`.

### Why inheritance is the wrong tool here

Inheritance is for **IS-A** relationships ("a MallardDuck IS-A Duck"). But
"HouseBlend with milk" is **not a new kind of beverage** — it's a HouseBlend
**plus** a condiment. The condiments are **additions**, not specializations.

**The deeper insight:** inheritance is the right tool when the relationship is
*"X is a type of Y."* It's the wrong tool when the relationship is *"X is Y
with some stuff added to it."* The first is a taxonomy; the second is a
configuration. The Decorator pattern exists precisely to handle the
configuration case with composition.

| | Duck hierarchy (IS-A works) | Beverage + condiments (IS-A fails) |
|---|---|---|
| Relationship | "MallardDuck IS-A Duck" | "HouseBlend+Milk is NOT a new kind of beverage" |
| What subclasses represent | Real, distinct kinds of things | Combinations, not types |
| Adding a variant | One new class | Dozens of new classes (exponential) |

### The solution — composition (the Decorator idea)

Instead of inheriting to add condiments, you **wrap** a beverage with condiment
objects (decorators):

| | Inheritance (chaos) | Composition (Decorator) |
|---|---|---|
| Add milk | Create `HouseBlendWithMilk` subclass | Wrap: `new Milk(new HouseBlend())` |
| Add mocha too | Create `HouseBlendWithMilkAndMocha` | Wrap again: `new Mocha(new Milk(new HouseBlend()))` |
| New condiment | N new subclasses | One new decorator class |
| "Double mocha" | Need a special class | `new Mocha(new Mocha(...))` — just wrap twice |

The number of classes is now **linear, not exponential**:
- 4 beverage classes + 4 condiment classes = **8 classes total**
- Add a 5th condiment → **9 classes** (one new decorator), not 128.

### "Dynamic" composition

The wrapping happens **at runtime** — you build the exact drink the customer
orders by nesting decorators around the base beverage:

```ts
// "DarkRoast with double mocha and whip":
new Whip(new Mocha(new Mocha(new DarkRoast())))
```

The nesting reads **inside-out**: start with `DarkRoast` (the base), wrap in
`Mocha` (shot 1), wrap in another `Mocha` (shot 2), wrap in `Whip`. Each
decorator is the **same type** as what it wraps (so they can nest), and each
**adds** one ingredient's cost + description. No subclassing, no recompiling.

### The open-closed principle (preview)

> *Classes should be **open for extension** (you can add new behavior) but
> **closed for modification** (you don't touch existing source code).*

With the Decorator:
- Add a new beverage (e.g. `Decaf`) → one new class. Existing classes untouched.
- Add a new condiment (e.g. `Caramel`) → one new decorator. Existing classes
  untouched.
- Change milk's price → edit one file (`Milk`). No hunting through 64 classes.

### Design principle #3 — favor composition over inheritance

> **Favor composition (HAS-A) over inheritance (IS-A).**

- **Inheritance** is static (compile time), rigid (a subclass is forever that
  subclass), and forces deep hierarchies.
- **Composition** is dynamic (runtime), flexible (mix and match), and flat
  (no hierarchy explosion).

The Decorator embodies this: a decorated beverage **HAS-A** beverage inside
it (it wraps one), rather than **IS-A** specific subclass. That HAS-A
relationship is what lets you stack condiments freely.

**Connection to Strategy:** the `Duck` class already used this principle — it
**HAS-A** `FlyBehavior` (composition) instead of inheriting flying behavior. The
Decorator takes the same idea further: it wraps an object with **another object
of the same type**, layering behavior.

### The mental model so far

> **Instead of subclassing for every combination (which explodes
> exponentially), wrap a base object with decorator objects that each add one
> ingredient. Decorators have the same type as the thing they wrap, so they
> can nest. Adding a new condiment = one new class, not dozens. This is
> "favor composition over inheritance" made structural.**

---

_Status: Lecture 5.1 documented. Next: **lecture 5.2 (Understanding the
open-closed principle)**._
