# Section 2 — The Strategy Pattern

> Course chapter: **The Strategy Pattern** (lectures 2.1 → 2.11)
> Source: Programming Foundations: Design Patterns (Java) → applied in TypeScript.

This chapter builds the Strategy pattern step by step — starting from a naive
inheritance design, exposing its cracks, and arriving at a flexible
composition-based solution. We document each lecture as we discuss it.

---

## 1. Revisiting inheritance

> Course module: **Revisiting inheritance** (2.1)

### Inheritance: the appealing shortcut

Inheritance is the first OOP tool most of us reach for, and it *feels* powerful.
You define a base class with shared behavior, then subclasses automatically get
all of it for free and override just the bits that differ. It promises **reuse
without duplication**.

In the course's Duck example (Java), it looks like this:

```
        Duck                    ← base class: swim(), display(), quack(), fly()
       /   |   \    \
Mallard Redhead Rubber Decoy    ← subclasses override display(), maybe quack()/fly()
```

At first glance this is elegant: `MallardDuck` and `RedheadDuck` get `swim()`
for free and only override `display()`. Job done, right?

This is why inheritance is seductive: it works *beautifully* for the first few
cases. The trouble only appears later, when requirements change.

### The "all IS-A" warning sign

The instructor's key warning: **when all your class relationships are IS-A,
take a closer look — overusing inheritance produces inflexible designs.**

Why? Because IS-A (inheritance) is a **very strong, very rigid** relationship.
When subclass B `extends` class A:

- B is **permanently bound** to A — you can't change that at runtime.
- B inherits **everything** A has — public methods, protected fields, the lot —
  whether B wants it or not.
- B is **defined by what A is**, not by what B *does*.

IS-A says *"B is a kind of A, forever, in every respect."* That's a huge claim.
And when *every* relationship in your design is IS-A, you've built a rigid tree
where each leaf is locked into the behavior of its ancestors.

Contrast with HAS-A (composition): *"B *holds* an A, and can swap it, replace
it, or drop it at any time."* Far more flexible. (Covered later in this chapter:
"Why HAS-A is better than IS-A".)

### Why overuse makes designs inflexible — the Duck cracks

The base `Duck` gives every subclass `quack()` and `fly()`. As duck types
diversify:

- **RubberDuck** — shouldn't fly, squeaks instead of quacks → override `fly()`
  to a no-op, `quack()` to squeak.
- **DecoyDuck** — shouldn't fly *or* quack → override both to no-ops.
- **WoodenDecoyDuck** — same, override both again.

See the rot: every new "weird" duck forces you to **override behavior just to
disable it**. You're not *adding* behavior — you're *fighting* the base class to
take behavior away. That's the smell:

> **When you spend more time disabling inherited behavior than using it,
> inheritance is the wrong tool.**

And it gets worse across two axes:

**a) Code duplication.** Suppose 6 duck species share a "can't fly" need. With
inheritance, you override `fly()` to a no-op *six times*. Want to change what
"can't fly" means (say, log "I can't fly")? You edit six classes. There's no
single place where "flightless" lives.

**b) Accidental behavior.** A new duck subclass that *forgets* to override
`fly()` suddenly gains flight. The bug is silent — the compiler is happy, the
duck just wrongly flies. Inheritance makes wrong behavior the *default* you must
remember to turn off, rather than behavior you opt into.

### The deeper issue: inheritance entangles *what varies* with *what stays the same*

Connection back to Chapter 1's **"Encapsulate what varies."** Inheritance
*violates* it.

In the Duck tree:
- **Stays the same:** `swim()`, `display()` structure.
- **Varies:** quacking behavior, flying behavior.

But inheritance **bundles both into one class**. The varying quack/fly lives
*inside* the same class as the stable swim. So every time the *varying* part
changes, you touch the class that also owns the *stable* part. There's no
boundary between them — exactly what "encapsulate what varies" told us to avoid,
and inheritance, by its nature, refuses to draw that boundary.

> **Takeaway:** Inheritance is great for sharing *truly stable, universal*
> behavior, but the moment behavior *varies* across subclasses, IS-A ties that
> variation to the stable parts and makes the whole design rigid.

### Java → TypeScript bridge

The course's Java `Duck extends` hierarchy maps directly to TypeScript's
`class Duck { ... }` / `class MallardDuck extends Duck { override ... }` — same
syntax family, same rigidity. The IS-A warning applies identically. We'll see
the TS code once we reach the *solution* (Strategy); here we are still
diagnosing the *problem*, which is language-neutral.

---

## 2. Limitations of inheritance

> Course module: **Limitations of inheritance** (2.2)

### Limitation 1 — The ripple effect (headline limitation)

Add `fly()` to the base `Duck` class → **every** duck suddenly flies, including
the rubber duck and decoy that shouldn't. So you have to hunt down every wrong
duck and override `fly()` to a no-op. One change in one place breaks many places.

> **This is backwards.** Good design wants changes to stay local. Inheritance
> makes a base-class change *ripple outward* to every descendant — including
> leaves that have nothing to do with the new feature. The compiler won't warn
> you; the rubber duck will just quietly start flying.

### Limitation 2 — Behavior is locked in at class-identity time (runtime inflexibility)

A `MallardDuck` quacks because *it's a MallardDuck*. You can't make it stop
quacking, or give a decoy a temporary quack, without creating a whole new class.
Behavior is glued to the class forever. To change behavior, you have to change
*which object you are* — far too coarse.

### Limitation 3 — No selective reuse of a single behavior

Want "flightless" for 6 ducks? You write the no-fly override 6 times. Want to
change what "can't fly" means later? Edit 6 classes. There's no single place
where "flightless" lives — because the behavior is glued inside the class.

### Limitation 4 — The base class becomes a junk drawer

`Duck` owns `swim`, `quack`, `fly`, and more. Every subclass inherits all of
it, wanted or not. Most subclasses spend their time *turning off* behavior they
never asked for. The base class knows too much and changes too riskily.

### The root cause in one line

> **Inheritance fuses behavior to class identity — so behavior can only change
> by picking a different class, and every base-class change automatically hits
> every descendant.**

### Java → TypeScript bridge

Same rigidity in TS: `class MallardDuck extends Duck` has identical behavior
(and identical limitations). The IS-A warning applies identically. We're still
diagnosing the *problem* here; we'll write the TS code once we reach the
*solution* (Strategy).

---

## 3. Trying interfaces

> Course module: **Trying interfaces** (2.3)

### What is an interface?

Conceptually (language-agnostic), an **interface is a contract**. It says:

> "To be considered an X, you must provide these methods."

It specifies **what** a type can do, not **how** it does it. It lists the
*capability* without the *implementation*. Key properties:

- **No implementation** — an interface has method *signatures* but no method
  *bodies*. It can't hold code or state.
- **A type, not a class** — any object whose shape matches the interface is
  considered that type.
- **Substitutability** — if a function expects an interface type, any object
  that implements it can be passed in. The caller never knows the concrete class.

Analogy: a **job description**. "A Driver must be able to `drive()`." It
doesn't care *how* you drive (stick, automatic, truck) or *who* you are (taxi,
bus, courier). Anyone who fulfills the contract can be hired as a Driver.

### Interfaces in TypeScript (Java → TS bridge)

TypeScript interfaces are **structural** (shape-based), not **nominal**
(name-based) like Java. Any object whose *shape* matches an interface is
automatically that type — even if it never explicitly declares `implements`.

```ts
// The contract (a shape)
interface Flyable {
  fly(): void;
}

// A class explicitly implementing it
class MallardDuck implements Flyable {
  fly(): void {
    // implementation
  }
}

// An object that just HAPPENS to fit — no "implements" needed
const thing: Flyable = {
  fly() {
    // works! it has the right shape
  },
};
```

TypeScript specifics worth knowing now:

- **`interface` vs `type`** — both describe object shapes. `interface` is the
  classic OOP contract and is extendable; `type` is more flexible (unions,
  primitives) but for plain object contracts they're interchangeable. We'll
  mostly use `interface` to mirror the course's Java intent.
- **No runtime existence** — TS interfaces are **erased** at compile time. They
  exist only for type-checking, never at runtime.
- **First-class functions** — a single-method interface is often better
  expressed as a **function type** (`type QuackBehavior = () => void`). We'll
  compare both when we build the solution.
- **`implements` is optional but useful** — declaring `class X implements Y`
  makes the compiler *check* that X satisfies Y. Without it, X is still
  assignable to Y if its shape fits, but you lose explicit verification.

The core idea — *a contract for capability, separate from implementation* — is
identical to Java. TS just makes it lighter and structural.

### The "let's use interfaces" design — and why it also fails

Pull `fly()` and `quack()` into interfaces, so only ducks that actually can
fly/quack implement them:

```
Duck (base: swim(), display())
   │
   ├─ MallardDuck   implements Flyable, Quackable
   ├─ RedheadDuck   implements Flyable, Quackable
   ├─ RubberDuck                    implements Quackable
   └─ DecoyDuck                     (neither)
```

**On paper this looks like progress:** the rubber duck no longer inherits
`fly()` — only implementers get the obligation. The "accidental flying" bug
seems solved.

### Three fatal problems

**1. It destroys code reuse.** An interface has **no implementation** — only
the signature. So when `MallardDuck implements Flyable`, it must write its own
`fly()` body. When `RedheadDuck implements Flyable`, it must also write its own
`fly()` body. Same for every flying duck.

> As the instructor says: *"Imagine 20, 30, or 40 ducks; every single duck will
> have to implement its own fly and quack methods."*

You've traded one evil for another. Inheritance gave you reuse but forced
behavior on everyone; interfaces give you control but **remove all reuse**. 20
copies of the same logic will drift apart over time.

**2. Maintenance nightmare.** Change the flying behavior (add a sound effect on
takeoff, log something)? Because the `fly()` implementation is duplicated in
*every* flying duck, you must **edit every single class**. One behavior change
→ 20 edits, and you'd better not miss one.

**3. Still no runtime changes.** A duck's flying/quacking is decided by which
interfaces its class declares — i.e., by its *type at class-definition time*. A
`MallardDuck` is `Flyable` forever; you can't make it stop flying at runtime,
or give a `DecoyDuck` a temporary quack. The behavior is still fused to the
class's declared type. We've moved the *rigidity*, not removed it.

### Two dead ends — one diagnosis

| Approach | Reuse? | Right behavior per duck? | Runtime change? |
|---|---|---|---|
| Inheritance (2.1–2.2) | ✅ yes (too much — forced) | ❌ no (rubber flies) | ❌ no |
| Interfaces (2.3) | ❌ no (each duck rewrites it) | ✅ yes (only implementers get it) | ❌ no |

The common failure: **both keep behavior tied to the class/type itself.** The
solution (coming in the next lectures) will let behavior live in **its own
objects**, which a duck *holds* (HAS-A) rather than *is* (IS-A) or *declares*
(implements).

---

_Status: documented after our discussion of lectures 2.1–2.3. Next lecture:
**2.4 — Get inspiration from design principles**._

---

## 4. Get inspiration from design principles

> Course module: **Get inspiration from design principles** (2.4)

### Back to "Encapsulate what varies"

The principle says: *identify the aspects that vary and separate them from what
stays the same.* The instructor's framing: *"if you find yourself altering the
flying and quacking code every time you add a new kind of duck, those are the
parts that are changing — and they need to be pulled OUT."*

**The payoff:** once you separate out the parts that are frequently changing,
you can modify those parts **without affecting the rest of your code**. The
behavior now lives *somewhere else*, so changing it touches only that place,
never the ducks.

So principle #1 answers **where** the behavior should live (outside the duck).
It leaves a second question unanswered: **how does the duck *talk to* that
separated behavior?** That's what principle #2 answers.

### "Supertype" — what does it mean?

A **supertype** is a type that sits **above** another type in the type
hierarchy — the more general, more abstract type that a concrete type *derives
from* (via inheritance) or *conforms to* (via an interface).

In Java/OOP there are two flavors of supertype:

- A **superclass** — a class you `extend`. (`Duck` is the supertype of `MallardDuck`)
- An **interface** — a contract you `implements`. (`Flyable` is the supertype of anything that implements it)

The instructor says *"the interface is supertype"* because in this design the
interface plays the supertype role:

```
        Flyable  (interface — the SUPERTYPE)
       /    |    \\
  FlyWith  FlyNo  FlyRocket   (concrete classes — the IMPLEMENTATIONS)
  Wings    Way    Powered
```

`Flyable` is the supertype; `FlyWithWings`, `FlyNoWay`, `FlyRocketPowered` are
its subtypes (concrete implementations). The supertype is the **abstraction**;
the subtypes are the **concrete choices**.

> **Supertype** = the general, abstract type you can refer to.
> **Implementation** = a specific, concrete class that fulfills that contract.

---

## 5. "Program to an interface, not an implementation"

> Course module: **Program to an interface** (2.5)

### The one-line meaning

> **Always refer to objects by their *interface* type (the abstraction), never
> by their concrete class* type (the implementation).**

### What is "an implementation"?

An **implementation** is a *specific, concrete class* — the actual code that
does the work, instantiated with `new`.

Examples: `FlyWithWings`, `FlyNoWay`, `FlyRocketPowered`.

### What is "an interface"?

An **interface** is the *abstraction above* those implementations — the contract
they all share. It says *"anything that can fly has a `fly()` method"* without
saying *how*.

### "Programming to an implementation" — the BAD way

Your code holds a variable typed as the **concrete class**:

```ts
// ❌ BAD — locked to FlyWithWings forever
const flyer: FlyWithWings = new FlyWithWings();
flyer.fly();
```

What's wrong? `flyer` is declared as `FlyWithWings`. It can **only ever** hold
a `FlyWithWings` object. If you later want rockets instead, you can't — the
type is locked. You'd have to change the variable's type and edit **every line**
that depends on `flyer` being a `FlyWithWings`. You've tied yourself to one
specific implementation.

### "Programming to an interface" — the GOOD way

Your code holds a variable typed as the **interface**:

```ts
// ✅ GOOD — typed as the abstraction
let flyer: Flyable = new FlyWithWings();
flyer.fly();

// Later — swap to any implementation, NO other code changes:
flyer = new FlyRocketPowered();
flyer.fly();
```

Now `flyer` is declared as `Flyable`. It can hold **any** object that
implements `Flyable`. To change the behavior, you just assign a different
object. The rest of your code only ever calls `flyer.fly()` — it never cares
*which* implementation is inside. **You've decoupled the code from the specific
behavior.**

> Important: in the standalone example above, use `let` (not `const`) so the
> variable can be reassigned. `const` locks the *binding* — you cannot point it
> to a different object later.

In OOP (the Strategy pattern), the typical form is **mutating a property** on
an object:

```ts
class Duck {
  flyBehavior: Flyable;  // ← property typed as the interface

  constructor() {
    this.flyBehavior = new FlyWithWings();
  }

  performFly(): void {
    this.flyBehavior.fly();   // delegates — doesn't care which impl
  }

  setFlyBehavior(fb: Flyable): void {
    this.flyBehavior = fb;    // ✅ swap at runtime — the duck stays the same
  }
}

const duck = new Duck();           // const is fine — we're mutating a property
duck.performFly();                 // "I'm flying with wings!"

duck.setFlyBehavior(new FlyRocketPowered());
duck.performFly();                 // "I'm flying with rockets!"
```

Here `const duck` is fine because we're **mutating a property** on the object,
not reassigning the variable. The object identity never changes; only its
internal `flyBehavior` pointer does.

### The intuition: the power outlet analogy

Think of a **wall power outlet**:

- The **outlet shape** is the *interface*. It defines a contract: "anything
  that plugs in here must have these two prongs."
- The **appliance** is the *implementation*. A toaster, a phone charger, a lamp
  — each is a concrete device.

When you "program to an interface," you treat the outlet as *"something I can
plug into."* You don't care whether a toaster or a lamp is plugged in — you
just know *it can draw power*. You can **swap** the appliance freely because
your expectations are about the *outlet's contract*, not the *specific device*.

When you "program to an implementation," it's as if the wall were **hard-wired
to a toaster** — you could never swap it for a lamp without rewiring the wall.
That's how rigid concrete-type references are.

### How both principles together answer our duck problem

| Principle | Tells us… | Applied to ducks |
|---|---|---|
| **Encapsulate what varies** | Pull changing parts *out* into their own things | Flying & quacking become **separate classes** |
| **Program to an interface** | Refer to those parts by their *interface* (supertype) | `Duck` holds `Flyable` and `Quackable`, not `FlyWithWings` |

Combine them and the design forces itself into the right shape:

```
      Duck (base — holds behaviors, doesn't own them)
         │
         ├── flyBehavior   : Flyable    ← interface (supertype)
         └── quackBehavior : Quackable  ← interface (supertype)
                    ▲
                    │ implements
        ┌───────────┼────────────┐
   FlyWithWings  FlyNoWay  FlyRocketPowered   ← concrete behavior classes
```

- The duck **HAS-A** flying behavior (holds it as a property) — not **IS-A** flyer.
- The duck talks to the behavior through the **interface** — it never knows *how* it flies.
- You can **swap behaviors at runtime** — `duck.setFlyBehavior(new FlyRocketPowered())`.
- Each behavior lives in **one place** — change flying once, all ducks pick it up.

### Summary table

| | Programming to an **implementation** ❌ | Programming to an **interface** ✅ |
|---|---|---|
| Variable type | Concrete class (`FlyWithWings`) | Interface (`Flyable`) |
| Can hold different behaviors? | No — locked to one class | Yes — any implementation of `Flyable` |
| Swapping behavior | Requires editing code everywhere | Just assign a new object |
| Coupling | Tight — tied to a specific class | Loose — tied only to a contract |
| Runtime change | Impossible | Easy |

---

## Key terms

- **Design principle** — a general guideline for good OO design (e.g.,
  "encapsulate what varies," "program to an interface").
- **Encapsulate what varies** — identify aspects that change and separate them
  from what stays the same; the first principle that motivates Strategy.
- **Program to an interface, not an implementation** — refer to objects by their
  abstraction (interface) so you can swap concrete behavior underneath without
  touching the code that uses it; the second principle that motivates Strategy.
- **Supertype** — a general/abstract type (interface or superclass) that
  concrete classes conform to or derive from; used as the reference type.
- **Implementation** — a specific, concrete class that provides the actual
  behavior; the thing you *don't* want your code tied to.
- **Structural typing** — TypeScript's system where types are compatible if
  their shapes match, regardless of explicit interface declarations.

---

## 6. Exploring the Strategy pattern

> Course module: **Exploring the strategy pattern** (2.7)

### The official definition (GoF)

> **The Strategy Pattern defines a family of algorithms, encapsulates each
> one, and makes them interchangeable. The algorithm can vary independently
> from the clients that use it.**

This is the Gang of Four definition — the shared vocabulary. Let's break it
apart phrase by phrase.

### Phrase 1 — "a family of algorithms"

"Algorithm" here doesn't mean a sorting algorithm. It means *a way of doing
something* — a behavior, a strategy, an approach. In the duck world:

- "fly with wings" is an algorithm
- "fly with a rocket" is an algorithm
- "can't fly" is an algorithm
- "quack loudly" is an algorithm
- "squeak" is an algorithm

"Family" means these are all variations of the *same* capability. They're
siblings — they all answer the same question ("how do you fly?") with different
answers. They share a contract (the interface), but each implements it
differently.

So **"a family of algorithms"** = a set of interchangeable ways to do one
specific thing.

```
Family of "fly" algorithms:    Family of "quack" algorithms:
  FlyWithWings                   Quack
  FlyNoWay                       Squeak
  FlyRocketPowered               MuteQuack
  (all implement FlyBehavior)    (all implement QuackBehavior)
```

### Phrase 2 — "encapsulates each one"

"Encapsulates" has two meanings here, and both matter:

1. **Wrapped in its own class** — each algorithm lives inside its own concrete
class (`FlyWithWings`, `FlyNoWay`, etc.). It's not scattered across the duck
hierarchy. It's not duplicated. It has **one home**.

2. **Hidden behind an interface** — the outside world doesn't see the concrete
class. It only sees the interface (`FlyBehavior`). The *how* is hidden; only
the *what* is exposed.

This is exactly the "encapsulate what varies" principle — **each varying
behavior gets pulled out and sealed inside its own capsule.**

The payoff: **each algorithm can change without affecting anything else.** Want
to change what "fly with wings" prints? Edit `FlyWithWings` only. No duck is
touched. No other behavior is touched.

### Phrase 3 — "makes them interchangeable"

Because all algorithms in a family share the same interface, they're
**plug-compatible**. You can swap one for another at any time, and the code
using them doesn't notice.

This is where "program to an interface" pays off. The duck holds a
`FlyBehavior` (the interface), so it can hold **any** concrete implementation.
Swapping is just:

```
flyBehavior = new FlyRocketPowered();   // swap — one line
```

No `if` statements. No `switch`. No editing the duck. Just **replace the
object**.

This interchangeability is what enables **runtime changes** — the thing
inheritance and interfaces-alone couldn't do.

### Phrase 4 — "the algorithm can vary independently from the clients that use it"

"Client" = the code that *uses* the algorithm. In our case, the `Duck` class
is the client of `FlyBehavior`. The duck *calls* `flyBehavior.fly()` but
doesn't *know* how flying works.

"Vary independently" means:

- You can add a new flying algorithm (`FlyWithJetPack`) **without touching
  `Duck`**.
- You can change an existing algorithm (`FlyWithWings` now logs a message)
  **without touching `Duck`**.
- You can change `Duck` (add a new method, a new subclass) **without touching
  any flying algorithm**.

**The two sides evolve separately.** That's *independence*. The algorithms and
their clients are **decoupled** — connected only by the thin contract of the
interface.

This is the opposite of inheritance, where changing the base class ripples to
every descendant. Here, the behavior and the client are on **opposite sides of
an interface**, and the interface is the only bridge.

### How the definition maps to our duck design

| Definition phrase | In the duck design |
|---|---|
| "a family of algorithms" | `FlyWithWings`, `FlyNoWay`, `FlyRocketPowered` — all the fly behaviors |
| "encapsulates each one" | each in its own class, behind the `FlyBehavior` interface |
| "makes them interchangeable" | duck holds a `FlyBehavior`, can swap any for any other |
| "algorithm varies independently from clients" | add/change a fly behavior without touching `Duck`; change `Duck` without touching fly behaviors |

### The two superpowers

1. **Adaptability (flexibility)** — behaviors can be swapped at runtime. The
model duck starts flightless and gets a rocket mid-program. No recompilation,
no new class.

2. **Reusability + independence** — a behavior is a self-contained unit.
`FlyWithWings` can be reused by *any* duck, *and* can be changed without
breaking any duck. The behavior and the duck don't know about each other's
internals.

### The one-line mental model

> **Strategy = pull the varying behavior out into its own swappable objects,
> talk to them through an interface, so behavior and client can change without
> breaking each other.**

---

## 7. The generic Strategy class diagram

> Course module: **Exploring the strategy pattern** (continued)

The Strategy pattern has **three players** and **two relationships** between
them. Understanding this skeleton means you understand *every* Strategy
implementation, not just ducks.

### The three players

**Player 1 — The Strategy Interface (the contract).**

This is the **abstraction**. It defines a single method — `doAlgorithm()` —
that says *"any strategy must be able to do this,"* but says nothing about
*how*.

Think of it as a **job description**: "we need someone who can
`doAlgorithm()`." It doesn't care who fills the role or how they do it.

**Player 2 — The Concrete Strategies (the implementations).**

These are the **actual behaviors** — the real, instantiated code. Each one
implements the interface and provides its own version of `doAlgorithm()`.

- `AlgorithmImpl_1` does the algorithm one way.
- `AlgorithmImpl_2` does it another way.

They're **siblings**, not parent/child. They don't know about each other.
They only share the contract. You can add a third, a fourth, a fifth — none
of the others change.

**Player 3 — The Context (the superclass).**

This is the **object that needs the behavior**. It has two things:

1. **A field** typed as the interface — it *holds* a strategy (composition).
2. **A method** that delegates to the strategy — it *uses* the behavior
   without knowing how it works.

The context also exposes a **setter** so the strategy can be swapped at
runtime.

In the duck world: `Duck` is the context, `flyBehavior` is the field,
`performFly()` is the delegating method, and `setFlyBehavior()` is the setter.

### The two relationships

**Relationship 1 — Realization (interface → concrete strategies).**

The concrete strategies **implement** the interface.

**Meaning:** each concrete class *promises* to fulfill the contract. The
interface is their **supertype**. Code that depends on the interface can use
*any* of them interchangeably.

This is **"program to an interface"** in action — the interface is the only
thing anyone references.

**Relationship 2 — Composition (context → interface).**

The context **holds** a reference to the interface.

**Meaning:** the context *has-a* strategy. It doesn't *inherit* the strategy
(that would be IS-A). It **contains** it (HAS-A). The strategy is a
**separate object living inside** the context.

This is **"favor composition over inheritance"** in action.

**Relationship 3 — Inheritance (superclass → subclasses).**

The subclasses **extend** the superclass.

**Meaning:** inheritance is *still used*, but **only for the parts that
genuinely belong to the type hierarchy** (like `display()`). The varying
behavior is NOT inherited — it's composed.

This is the hybrid: **inheritance for stable structure, composition for
varying behavior.**

### The delegation flow

1. Someone calls `subclass.performBehavior()`
2. `performBehavior()` (inherited from the superclass) runs
3. It delegates: `behavior.doAlgorithm()`
4. The concrete strategy object runs its own `doAlgorithm()`
5. The result comes back — the subclass never knew *which* algorithm ran

### Generic class diagram

```mermaid
classDiagram
    %% =========================
    %% Strategy Interface
    %% =========================
    class AlgorithmInterface {
        <<interface>>
        +doAlgorithm()
    }

    %% =========================
    %% Concrete Strategies
    %% =========================
    class AlgorithmImpl_1 {
        +doAlgorithm()
    }

    class AlgorithmImpl_2 {
        +doAlgorithm()
    }

    AlgorithmInterface <|.. AlgorithmImpl_1
    AlgorithmInterface <|.. AlgorithmImpl_2

    %% =========================
    %% Context (Superclass)
    %% =========================
    class Superclass {
        -AlgorithmInterface behavior
        +setBehavior()
        +performBehavior()
    }

    Superclass o-- AlgorithmInterface : behavior

    %% =========================
    %% Subclasses
    %% =========================
    class Subclass1

    class Subclass2

    Superclass <|-- Subclass1
    Superclass <|-- Subclass2
```

### Duck-specific class diagram

```mermaid
classDiagram
    %% =========================
    %% Interfaces
    %% =========================
    class FlyBehavior {
        <<interface>>
        +fly()
    }

    class QuackBehavior {
        <<interface>>
        +quack()
    }

    %% =========================
    %% Fly behaviors
    %% =========================
    class FlyWithWings {
        +fly()
    }

    class FlyNoWay {
        +fly()
    }

    class FlyRocketPowered {
        +fly()
    }

    %% =========================
    %% Quack behaviors
    %% =========================
    class Quack {
        +quack()
    }

    class Squeak {
        +quack()
    }

    class MuteQuack {
        +quack()
    }

    %% =========================
    %% Duck
    %% =========================
    class Duck {
        -flyBehavior : FlyBehavior
        -quackBehavior : QuackBehavior
        +setFlyBehavior(fb : FlyBehavior)
        +setQuackBehavior(qb : QuackBehavior)
        +performFly()
        +performQuack()
        +swim()
        +display()
    }

    %% =========================
    %% Duck subclasses
    %% =========================
    class MallardDuck {
        +display()
    }

    class RedheadDuck {
        +display()
    }

    class RubberDuck {
        +display()
    }

    class DecoyDuck {
        +display()
    }

    %% =========================
    %% Relationships
    %% =========================
    FlyBehavior <|.. FlyWithWings
    FlyBehavior <|.. FlyNoWay
    FlyBehavior <|.. FlyRocketPowered

    QuackBehavior <|.. Quack
    QuackBehavior <|.. Squeak
    QuackBehavior <|.. MuteQuack

    Duck o-- FlyBehavior
    Duck o-- QuackBehavior

    Duck <|-- MallardDuck
    Duck <|-- RedheadDuck
    Duck <|-- RubberDuck
    Duck <|-- DecoyDuck
```

### The pattern is a reusable shape

The **names change, the structure never does.** That's the power of a pattern
— it's a reusable *shape*.

| Generic skeleton | Duck version | Payment version | Navigation version |
|---|---|---|---|
| AlgorithmInterface | FlyBehavior | PaymentStrategy | RouteStrategy |
| AlgorithmImpl_1 | FlyWithWings | CreditCardPayment | DrivingRoute |
| AlgorithmImpl_2 | FlyNoWay | PayPalPayment | WalkingRoute |
| Superclass | Duck | Checkout | Navigator |
| setBehavior() | setFlyBehavior() | setPaymentMethod() | setRouteStrategy() |
| performBehavior() | performFly() | processPayment() | buildRoute() |

### The one-sentence summary of the structure

> **A context holds a strategy through an interface (composition), delegates to
> it, and can swap it at runtime — while concrete strategies implement that
> interface independently, and the context's subclasses inherit only the stable
> structure.**

---

## 8. Why HAS-A is better than IS-A

> Course module: **Why HAS-A is better than IS-A** (2.8)

### The core claim

> **Favor composition (HAS-A) over inheritance (IS-A).**

This is the **third design principle** (alongside "encapsulate what varies" and
"program to an interface"). It's the principle that the entire Strategy pattern
is built on.

### What IS-A and HAS-A actually mean

**IS-A (inheritance):**

```
MallardDuck IS-A Duck
```

The subclass **is** the superclass. It inherits everything — methods, fields,
the whole identity. The relationship is permanent and total. `MallardDuck` can
never stop being a `Duck`.

**HAS-A (composition):**

```
Duck HAS-A FlyBehavior
```

The object **holds** another object. It contains it as a field. The relationship
is flexible and partial. `Duck` can swap its `FlyBehavior` for a different one
at any time — it can even have *no* fly behavior.

### Why composition wins — five reasons

**Reason 1 — Behaviors can be reused across unrelated classes.**

With inheritance, a behavior is **trapped inside a class hierarchy**. `fly()`
lives in `Duck`, so only ducks can use it. If you later build a `Bird` class,
an `Airplane` class, or a `Superhero` class, they **can't share** the flying
logic without duplicating code or creating a weird common ancestor.

With composition, a behavior is a **free-standing object**. `FlyWithWings` is
just a class. *Any* object can hold it — a duck, a bird, a superhero, a drone.
The behavior doesn't know or care who's using it.

```
Duck       ──holds──►  FlyWithWings  ◄──holds──  Superhero
Bird       ──holds──┘                    └──holds──  Drone
```

> **Composition makes behaviors reusable across the entire codebase, not just
> within one inheritance tree.**

**Reason 2 — You can change behavior at runtime.**

With inheritance, behavior is decided at **class-definition time** (compile
time). A `MallardDuck` flies because it *is* a `MallardDuck` — baked into its
type forever. To change behavior, you'd have to instantiate a *different class*.

With composition, behavior is decided at **object-run time** (runtime). The duck
holds a `FlyBehavior` field, and you can swap what's in that field whenever you
want:

```
duck.setFlyBehavior(new FlyWithWings());      // fly with wings
// ... later in the program ...
duck.setFlyBehavior(new FlyRocketPowered());   // now fly with rockets
```

The duck object **stays the same object** — only its behavior changes. This is
the model duck getting a rocket moment from the simulator.

> **Composition enables runtime flexibility — inheritance is locked at compile
> time.**

**Reason 3 — Delegation instead of duplication.**

With inheritance, if 6 subclasses need the same behavior, they **all inherit
it** — wanted or not. To *not* have the behavior, they override to no-op (the
"disabling" smell we saw in 2.1).

With composition, the behavior is **delegated**. The context says *"I don't know
how to fly, but I know someone who does"* and hands the call to its
`FlyBehavior` object:

```
performFly() → flyBehavior.fly()   // delegation, not inheritance
```

- The context doesn't duplicate the behavior.
- The context doesn't fight to disable unwanted behavior.
- Each behavior exists in **exactly one place**.

> **Composition uses delegation — one behavior, one home, reused by anyone who
> holds it.**

**Reason 4 — You're not forced to take everything.**

Inheritance is **all-or-nothing**. When `MallardDuck extends Duck`, it
inherits `swim()`, `quack()`, `fly()`, and *every* future method added to
`Duck` — whether it wants them or not.

Composition is **à la carte**. The duck holds exactly the behaviors it needs:

```
duck has:  FlyBehavior  +  QuackBehavior   (exactly these two)
```

If you build a duck that doesn't need quacking, it simply doesn't hold a
`QuackBehavior`. No override-to-disable, no fighting the base class.

> **Composition lets you take only what you need — inheritance forces the whole
> package.**

**Reason 5 — Changes stay local.**

When you change a composed behavior (e.g., `FlyWithWings` now logs a message),
only `FlyWithWings` changes. Every object that holds it gets the update
**automatically** — but nothing else is touched.

When you change an inherited behavior (e.g., `Duck.fly()`), it **ripples to
every descendant** — the mallard, the redhead, the rubber duck, the decoy. You
have to audit them all.

> **Composition localizes changes — inheritance spreads them.**

### The full comparison

| | IS-A (Inheritance) | HAS-A (Composition) |
|---|---|---|
| Behavior reuse | only within the same hierarchy | across the entire codebase |
| When behavior is decided | compile time (class definition) | runtime (swap the field) |
| Mechanism | inherit + override | delegate to a held object |
| Flexibility | all-or-nothing (inherit everything) | à la carte (hold only what you need) |
| Change impact | ripples to all descendants | stays local to the one behavior |
| Coupling | tight (permanently bound) | loose (swap freely) |

### How this maps to our duck design

**Before (IS-A):**

```
Duck
  ├── fly()        ← inherited by ALL ducks (rubber duck gets it too!)
  ├── quack()      ← inherited by ALL ducks
  └── swim()
```

**After (HAS-A):**

```
Duck
  ├── flyBehavior : FlyBehavior     ← holds a flying object (swappable)
  ├── quackBehavior : QuackBehavior ← holds a quacking object (swappable)
  └── swim()                         ← only the truly stable stuff is inherited
```

The **only** thing still inherited is `swim()` (universal, never varies) and the
behavior *fields* (which are empty slots to be filled). The *varying* behaviors
are now **composed**, not inherited.

### The principle in one line

> **HAS-A is better than IS-A because composing behaviors as swappable objects
> gives you reuse across the codebase, runtime flexibility, and localized
> changes — while inheritance locks you into a rigid, compile-time,
> all-or-nothing hierarchy.**

This is the design principle that *powers* Strategy. Every pattern we'll learn
in this course uses some form of "favor composition over inheritance" —
Strategy just makes it the most visible.

<!-- ================================================================ -->
<!-- ============ CONCEPTUAL PART ENDS / CODE PART BEGINS ============ -->
<!-- ================================================================ -->

---

# ════════════════════════════════════════════════════════════════
# ███  PART 2 — CODE: UNDERSTANDING & IMPLEMENTATION  ███
# ════════════════════════════════════════════════════════════════

> **What's above this line:** the *concepts* (what the pattern is, why it
> exists, the principles behind it, the class diagrams).
>
> **What's below this line:** the *code* (reading the Java exercise, the
> TypeScript translation decisions, and the TypeScript implementation in the
> sandbox).

---

## 9. Phase 1 — Understanding the Java exercise code

> Source: `Ex_Files_.../02_StrategyPattern/ducks/`

We read every Java file in the Strategy exercise folder and analyzed them
step by step. Here's the complete breakdown.

### Step 1 — The interfaces (the contracts)

**FlyBehavior.java**
```java
public interface FlyBehavior {
    public void fly();
}
```

**QuackBehavior.java**
```java
public interface QuackBehavior {
    public void quack();
}
```

Each interface defines a single method with no body. Key points:

- **One method each** — each interface represents one capability (Single
  Responsibility applied to interfaces).
- **No implementation** — the interface doesn't know *how* to fly; it only knows
  that flying is *possible*.
- **The `public` keyword is redundant** in Java — interface methods are public by
  default.
- **These are the supertypes** — the concrete classes will be the subtypes. The
  Duck holds references to these *interfaces*, not to concrete classes.

**Why two separate interfaces?** Because flying and quacking are independent
capabilities. A duck might fly but not quack (decoy), or quack but not fly
(rubber duck). Keeping them separate means a class can implement one without
the other — the **à la carte** flexibility from the HAS-A principle.

### Step 2 — The concrete behaviors (fly)

**FlyWithWings.java**
```java
public class FlyWithWings implements FlyBehavior {
    public void fly() {
        System.out.println("I'm flying!!");
    }
}
```

**FlyNoWay.java**
```java
public class FlyNoWay implements FlyBehavior {
    public void fly() {
        System.out.println("I can't fly");
    }
}
```

**FlyRocketPowered.java**
```java
public class FlyRocketPowered implements FlyBehavior {
    public void fly() {
        System.out.println("I'm flying with a rocket");
    }
}
```

Each class implements `FlyBehavior` and provides its own version of `fly()`.
Key points:

- **They're siblings, not a hierarchy** — none inherits from the others. All at
  the same level, each independently implementing the interface.
- **Each has ONE job** — knows how to do one thing (Single Responsibility).
- **They're reusable anywhere** — free-standing, not trapped in the Duck
  hierarchy. Any class can hold a `FlyBehavior`.
- **Adding a new behavior = one new class** — create `FlyWithJetPack implements
  FlyBehavior`. Zero existing files change. This is **Open-Closed** in action.

### Step 3 — The concrete behaviors (quack)

**Quack.java** → prints "Quack"

**Squeak.java** → prints "Squeak"

**MuteQuack.java** → prints "<< Silence >>"

**FakeQuack.java** → prints "Qwak"

Same pattern as fly behaviors, just for quacking. Key points:

- **Four variations of the same capability** — the "family of algorithms" from
  the GoF definition. All interchangeable because they share the same interface.
- **`MuteQuack` is the "do nothing" behavior done right** — it's a first-class
  behavior object, not a hacky override. This is how composition handles "no
  behavior" gracefully.
- **They're independent of the fly behaviors** — a duck can mix ANY fly behavior
  with ANY quack behavior.

**The multiplicative flexibility:** 3 fly × 4 quack = **12 possible duck
configurations** from just 7 small classes. With inheritance, you'd need 12
separate subclasses. Composition gives you (m × n) combinations from just
(m + n) classes.

### Step 4 — The Duck base class (the context / the heart)

**Duck.java**
```java
public abstract class Duck {
    FlyBehavior flyBehavior;
    QuackBehavior quackBehavior;

    public Duck() {
    }

    public void setFlyBehavior(FlyBehavior fb) {
        flyBehavior = fb;
    }

    public void setQuackBehavior(QuackBehavior qb) {
        quackBehavior = qb;
    }

    abstract void display();

    public void performFly() {
        flyBehavior.fly();
    }

    public void performQuack() {
        quackBehavior.quack();
    }

    public void swim() {
        System.out.println("All ducks float, even decoys!");
    }
}
```

This is the **context** — the class that HOLDS the strategies and DELEGATES to
them. Line-by-line:

- **The fields (composition):** `FlyBehavior flyBehavior` and `QuackBehavior
  quackBehavior` — the duck holds two behavior objects, typed as the
  **interfaces** (program to an interface). No access modifier = **package-private**
  (subclasses in the same package can set them directly).

- **The setters (runtime swapping):** `setFlyBehavior()` and
  `setQuackBehavior()` allow changing behavior at runtime.

- **The abstract method:** `abstract void display()` — each concrete duck looks
  different, so subclasses must implement it. This is the only thing that truly
  varies by duck type.

- **The delegation methods (the core of the pattern):** `performFly()` calls
  `flyBehavior.fly()` and `performQuack()` calls `quackBehavior.quack()`. The
  duck doesn't know how to fly — it **delegates** to its behavior object. This
  is the mechanism that makes HAS-A work.

- **The stable behavior:** `swim()` is truly universal (every duck floats,
  always) — so it stays as an inherited method. Everything that *varies* was
  pulled out. This is the hybrid: **inheritance for what's stable, composition
  for what varies.**

Key points:

- `Duck` is abstract — can't be instantiated (a generic duck has no appearance).
- The fields are package-private — a design smell. In a stricter design, they'd
  be `private` and only setters would be used.
- `performFly()` and `performQuack()` are NOT the behavior — they're
  **delegators**. The actual flying logic lives in `FlyWithWings.fly()`.
- The duck has **zero flying or quacking logic** — it only knows it *has*
  something that can fly and something that can quack.

### Step 5 — The concrete ducks (thin subclasses)

**MallardDuck.java**
```java
public class MallardDuck extends Duck {
    public MallardDuck() {
        quackBehavior = new Quack();
        flyBehavior = new FlyWithWings();
    }
    public void display() {
        System.out.println("I'm a real Mallard duck");
    }
}
```

**ModelDuck.java**
```java
public class ModelDuck extends Duck {
    public ModelDuck() {
        flyBehavior = new FlyNoWay();
        quackBehavior = new Quack();
    }
    public void display() {
        System.out.println("I'm a model duck");
    }
}
```

**DecoyDuck.java**
```java
public class DecoyDuck extends Duck {
    public DecoyDuck() {
        setFlyBehavior(new FlyNoWay());
        setQuackBehavior(new MuteQuack());
    }
    public void display() {
        System.out.println("I'm a duck Decoy");
    }
}
```

**RubberDuck.java** (two constructors — the interesting one)
```java
public class RubberDuck extends Duck {
    public RubberDuck() {
        flyBehavior = new FlyNoWay();
        quackBehavior = () -> System.out.println("Squeak");  // lambda!
    }
    public RubberDuck(FlyBehavior flyBehavior, QuackBehavior quackBehavior) {
        this.flyBehavior = flyBehavior;
        this.quackBehavior = quackBehavior;
    }
    public void display() {
        System.out.println("I'm a rubber duckie");
    }
}
```

Each subclass does two things:
1. **Configures its default behaviors** in the constructor
2. **Implements `display()`** (the abstract method)

The subclasses are now **very thin** — they don't implement `fly()` or
`quack()`; those are delegated. Everything else is inherited from `Duck`.

Key points:

- **Two ways to set behaviors** — `MallardDuck`/`ModelDuck` set fields directly
  (`flyBehavior = new FlyWithWings()`); `DecoyDuck` uses setters
  (`setFlyBehavior(new FlyNoWay())`). Both work because fields are
  package-private. The setter approach is cleaner (respects encapsulation).

- **RubberDuck's lambda** — `quackBehavior = () -> System.out.println("Squeak")`
  is Java 8+ shorthand. `QuackBehavior` is a functional interface (single
  method), so Java lets you create an implementation inline with a lambda
  instead of writing a whole `Squeak` class.

- **RubberDuck's second constructor (dependency injection)** — lets the caller
  inject behaviors from outside instead of hardcoding them. Maximum flexibility.

- **Subclasses went from fat to thin** — before Strategy, each subclass had to
  implement `fly()`, `quack()`, `display()`, and override unwanted behaviors.
  Now each has just a constructor (1–3 lines) + `display()` (1 line).

### Step 6 — The simulators (the story)

**MiniDuckSimulator1.java** (simple)
```java
public class MiniDuckSimulator1 {
    public static void main(String[] args) {
        Duck mallard = new MallardDuck();
        mallard.performQuack();
        mallard.performFly();

        Duck model = new ModelDuck();
        model.performFly();
        model.setFlyBehavior(new FlyRocketPowered());
        model.performFly();
    }
}
```

**Output:**
```
Quack
I'm flying!!
I can't fly
I'm flying with a rocket
```

**MiniDuckSimulator.java** (full)
```java
public class MiniDuckSimulator {
    public static void main(String[] args) {
        MallardDuck mallard = new MallardDuck();
        FlyBehavior cantFly = () -> System.out.println("I can't fly");
        QuackBehavior squeak = () -> System.out.println("Squeak");
        RubberDuck rubberDuckie = new RubberDuck(cantFly, squeak);
        DecoyDuck decoy = new DecoyDuck();
        Duck model = new ModelDuck();

        mallard.performQuack();
        rubberDuckie.performQuack();
        decoy.performQuack();

        model.performFly();
        model.setFlyBehavior(new FlyRocketPowered());
        model.performFly();
    }
}
```

The story has four acts:

- **Act 1 — The mallard (default behaviors):** uses its hardcoded defaults
  (`Quack` + `FlyWithWings`).

- **Act 2 — The model duck (the payoff moment):** starts flightless
  (`FlyNoWay`), then `setFlyBehavior(new FlyRocketPowered())` swaps it to a
  rocket at runtime. Same method, same object, different result. **This is the
  entire point of the pattern.**

- **Act 3 — The rubber duck (dependency injection):** behaviors created as
  lambdas and injected through the constructor. The caller decides the behavior.

- **Act 4 — The decoy (the silent duck):** uses `MuteQuack` — the first-class
  "silent" behavior. No hacks, no empty overrides.

Key points:

- **Everything is typed as `Duck` (the supertype)** — `Duck mallard = new
  MallardDuck()`. The variable type is the abstraction; the actual object is the
  concrete subtype. Program to an interface.

- **The runtime swap is invisible to the caller** — `model.performFly()` is
  called twice with the same method on the same object, but the result differs
  because the internal behavior was swapped. This is what composition enables
  that inheritance can't.

- **Lambdas make behaviors disposable** — no need to write a whole class for a
  one-off behavior. This hints at what TypeScript will make even cleaner with
  function types.

### Phase 1 summary

We now understand the complete Java Strategy implementation:

- ✅ The interfaces (contracts) — `FlyBehavior`, `QuackBehavior`
- ✅ The concrete behaviors (implementations) — 3 fly + 4 quack behaviors
- ✅ The Duck base class (context + delegation) — holds behaviors, delegates,
  allows runtime swaps
- ✅ The concrete ducks (thin subclasses) — configure defaults + implement
  `display()`
- ✅ The simulators (the story) — proves runtime swapping works

---

## 10. Phase 2 — Java → TypeScript translation decisions

Before writing any TypeScript code, we made **5 key decisions** about how to
translate the Java Strategy implementation. Each decision is documented below
with the reasoning and the TypeScript-specific capabilities involved.

### Summary of all 5 decisions

| # | Decision | Faithful translation | Idiomatic refactor |
|---|---|---|---|
| 1 | Contracts | `interface FlyBehavior` | `type FlyBehavior = () => void` |
| 2 | Behaviors | Classes with `implements` | Function constants |
| 3 | Fields | `private` + setters | `private` + constructor injection |
| 4 | Duck | `abstract class Duck` | Same |
| 5 | Constructors | Optional params + `??` | Always inject |

---

### Decision 1 — `interface` vs `type` for strategy contracts

In Java, we wrote:
```java
public interface FlyBehavior {
    public void fly();
}
```

In TypeScript, we have two ways to express this same contract.

**`interface` (OOP-native):**
```ts
interface FlyBehavior {
  fly(): void;
}
```

**`type` (general):**
```ts
type FlyBehavior = {
  fly(): void;
};
```

#### What is a TypeScript `interface`?

A `interface` is a **named contract for object shapes**. Key characteristics:

1. **Structural (not nominal).** Unlike Java, TypeScript doesn't care whether a
class declares `implements FlyBehavior`. If the class has a `fly(): void`
method, it's automatically compatible. The **shape** matters, not the name.

```ts
interface FlyBehavior {
  fly(): void;
}

class FlyWithWings {            // ← no "implements FlyBehavior"!
  fly(): void {
    console.log("I'm flying!!");
  }
}

const flyer: FlyBehavior = new FlyWithWings();  // ✅ works anyway
```

2. **Erased at runtime.** After compilation, `interface FlyBehavior` produces
**zero output** — purely for type-checking. This is why structural typing works:
there's no object to look up at runtime.

3. **Open for declaration merging.** Two `interface` declarations with the same
name get **merged**:
```ts
interface Duck { swim(): void; }
interface Duck { display(): void; }
// Duck now has both swim() and display()
```

4. **`implements` is optional but useful.** Declaring `class X implements Y`
makes the compiler *check* that X satisfies Y. Without it, X is still
assignable to Y if its shape fits.

#### What is a TypeScript `type`?

A `type` (type alias) is a **name for any type** — not just object shapes.
Key characteristics:

1. **More general.** Can describe things an `interface` can't:
```ts
type ID = string | number;              // union
type Callback<T> = (data: T) => void;   // function type
type Pair = [string, number];           // tuple
```

2. **Also erased at runtime.**

3. **Cannot be merged.** Two `type` declarations with the same name = error.

4. **`implements` works but is unusual.**

#### Side-by-side comparison

| Feature | `interface` | `type` |
|---|---|---|
| Describes object shapes | ✅ | ✅ |
| Erased at runtime | ✅ | ✅ |
| Can use `implements` | ✅ (natural) | ⚠️ (unusual) |
| Declaration merging | ✅ | ❌ |
| Unions, tuples, function types | ❌ | ✅ |
| Extending other types | `extends` | `&` intersection |
| Best for OOP contracts | ✅ | ⚠️ OK |
| Best for function types | ❌ | ✅ |

#### Decision

> **Use `interface` for the faithful translation** — it's the natural OOP
> construct for a contract between classes, reads naturally with `implements`,
> and is exactly what `interface` is designed for.
>
> For the idiomatic refactor, a single-method strategy becomes a **function
type** using `type` (`type FlyBehavior = () => void`). Covered in Decision 2.

---

### Decision 2 — Classes vs. function types for concrete behaviors

This is the **biggest decision** — where TypeScript differs most from Java.

#### The Java way (classes for everything)

```java
public class FlyWithWings implements FlyBehavior {
    public void fly() {
        System.out.println("I'm flying!!");
    }
}
```

Even for a one-liner, Java forces you to write a whole class. The only
shortcut is a **lambda** for functional interfaces:
```java
quackBehavior = () -> System.out.println("Squeak");
```

#### Approach A — Classes (faithful translation)

```ts
class FlyWithWings implements FlyBehavior {
  fly(): void {
    console.log("I'm flying!!");
  }
}
```

Same structure as Java. When assigning: `this.setFlyBehavior(new FlyWithWings())`.

#### Approach B — Function types (idiomatic TypeScript)

Since each strategy has **one method**, we can replace the interface with a
**function type**:
```ts
type FlyBehavior = () => void;
```

Then each behavior becomes a **simple function** — no class:
```ts
const flyWithWings: FlyBehavior = () => {
  console.log("I'm flying!!");
};
```

When assigning: `this.setFlyBehavior(flyWithWings)` — no `new`.

#### What changed?

| | Class (faithful) | Function type (idiomatic) |
|---|---|---|
| Contract | `interface FlyBehavior { fly(): void }` | `type FlyBehavior = () => void` |
| Behavior | `class FlyWithWings implements FlyBehavior` | `const flyWithWings: FlyBehavior` |
| Assigning | `new FlyWithWings()` | `flyWithWings` (no `new`) |
| Lines per behavior | ~5 | ~3 |
| `implements` keyword | ✅ | ❌ |
| Supports state | ✅ | ❌ |
| Supports multiple methods | ✅ | ❌ |

#### When does Approach B work?

It works when the strategy has:
- ✅ **One method only** (like `fly()` or `quack()`)
- ✅ **No state** (no fields, just behavior)

It does NOT work when the strategy needs:
- ❌ **Multiple methods** (you need an interface)
- ❌ **State** (you need a class to hold fields)

For our ducks, `fly()` and `quack()` are both single-method, stateless
strategies — so the function-type approach is **perfect**.

#### Decision

> **Faithful translation:** use **classes** (Approach A).
> **Idiomatic refactor:** use **function types** (Approach B).
> We'll build both in Phase 3.

---

### Decision 3 — Private fields and encapsulation

#### The Java way (package-private)

```java
public abstract class Duck {
    FlyBehavior flyBehavior;       // ← no modifier = package-private
    QuackBehavior quackBehavior;   // ← no modifier = package-private
```

In Java, no access modifier means **package-private** — any class in the same
package can access these fields directly. This lets subclasses do:
```java
flyBehavior = new FlyWithWings();   // direct field access
```

**This is a design smell.** Two inconsistencies:

1. Some ducks use direct access (`flyBehavior = new FlyWithWings()`), some use
   setters (`setFlyBehavior(new FlyNoWay())`).
2. External code could bypass setters: `duck.flyBehavior = new FlyNoWay()`.

#### The TypeScript way — three options

**Option A — `private` keyword (compile-time privacy):**
```ts
abstract class Duck {
  private flyBehavior: FlyBehavior;
  private quackBehavior: QuackBehavior;
}
```
- TypeScript compiler **errors** if you access the field from outside the class
  — including from subclasses.
- Forces subclasses to use the setters.

**Option B — `#` private fields (runtime privacy, ES2022+):**
```ts
abstract class Duck {
  #flyBehavior: FlyBehavior;
  #quackBehavior: QuackBehavior;
}
```
- Truly inaccessible — even at runtime in JavaScript.
- Strongest encapsulation. Different syntax (`this.#flyBehavior`).

**Option C — `protected` (accessible to subclasses):**
```ts
abstract class Duck {
  protected flyBehavior: FlyBehavior;
  protected quackBehavior: QuackBehavior;
}
```
- Subclasses CAN access directly (like Java's package-private).
- External code CANNOT access.
- Closest to the Java behavior.

#### Comparison

| Option | Subclass access? | External access? | Encapsulation | Matches Java? |
|---|---|---|---|---|
| `private` | ❌ must use setters | ❌ no | Strongest | No (better) |
| `#` private | ❌ must use setters | ❌ no | Strongest (runtime) | No (better) |
| `protected` | ✅ direct field access | ❌ no | Medium | Closest |

#### Decision

> **Use `private` for the faithful translation.**

Why? Because it **forces consistency** — every subclass must use the setters.
No more "some use direct access, some use setters." This is actually **better
design** than the Java code, which was inconsistent.

---

### Decision 4 — Abstract class for Duck

#### The Java way

```java
public abstract class Duck {
    abstract void display();
}
```

`Duck` is abstract — can't instantiate it. `display()` is abstract — subclasses
must implement it.

#### The TypeScript way (identical)

```ts
abstract class Duck {
  abstract display(): void;
}
```

Works identically to Java:
- ❌ `new Duck()` → compiler error
- ✅ Subclasses must implement `display()` or be abstract too
- ✅ Abstract classes CAN have concrete methods (`performFly`, `swim`)

#### Alternative (worse) — regular class + throw

```ts
class Duck {
  display(): void {
    throw new Error("display() must be implemented by subclass");
  }
}
```

| | `abstract class` | Regular class + throw |
|---|---|---|
| `new Duck()` blocked at | compile time ✅ | runtime ❌ |
| Forgets to implement `display()` | compile error ✅ | runtime error ❌ |

With `abstract`, the compiler catches missing implementations **before the
program runs**. With the throw approach, it's a **silent bug**.

#### Decision

> **Use `abstract class Duck` with `abstract display(): void`.** Direct 1:1
> translation — TypeScript's abstract classes work exactly like Java's.

---

### Decision 5 — Constructors and dependency injection

#### The Java way (constructor overloading)

`RubberDuck` has **two constructors**:
```java
public RubberDuck() {                          // default — hardcodes behaviors
    flyBehavior = new FlyNoWay();
    quackBehavior = () -> System.out.println("Squeak");
}
public RubberDuck(FlyBehavior flyBehavior, QuackBehavior quackBehavior) {
    this.flyBehavior = flyBehavior;             // injected
    this.quackBehavior = quackBehavior;
}
```

Java supports constructor overloading — multiple constructors with different
parameter lists.

#### The TypeScript way (optional parameters + `??`)

TypeScript constructor overloading is clunky. Instead, use **optional
parameters with defaults**:

```ts
class RubberDuck extends Duck {
  constructor(
    flyBehavior?: FlyBehavior,
    quackBehavior?: QuackBehavior,
  ) {
    super();
    this.setFlyBehavior(flyBehavior ?? new FlyNoWay());
    this.setQuackBehavior(quackBehavior ?? new Squeak());
  }
}
```

**What's happening:**
- Both parameters have `?` — they're **optional**.
- `??` (nullish coalescing) means: use the provided value if it exists,
  otherwise use the default.

**Usage:**
```ts
// No args → uses defaults:
const rubber1 = new RubberDuck();

// With args → uses injected behaviors:
const rubber2 = new RubberDuck(new FlyNoWay(), new MuteQuack());
```

**One constructor replaces Java's two.**

#### What is `??` (nullish coalescing)?

```ts
this.setFlyBehavior(flyBehavior ?? new FlyNoWay());
```

Reads as: *"use `flyBehavior` if it has a value, otherwise use `new FlyNoWay()`"*.

Only checks for `null` and `undefined`:
```ts
const value = providedValue ?? defaultValue;
// If providedValue is "something" → uses "something"
// If providedValue is null        → uses defaultValue
// If providedValue is undefined   → uses defaultValue
```

**Important:** `??` is different from `||` (logical OR):
```ts
// ?? only checks for null/undefined:
0 ?? "default"   // → 0
"" ?? "default"   // → ""

// || checks for any falsy value:
0 || "default"    // → "default"
"" || "default"   // → "default"
```

For our ducks, `??` is the right choice — we only want to use the default when
the parameter is truly absent (`undefined`), not when it's some falsy value.

#### Alternative — always inject (no defaults)

```ts
class Duck {
  constructor(
    private flyBehavior: FlyBehavior,
    private quackBehavior: QuackBehavior,
  ) {}
}
```

Every duck is created with explicit behaviors:
```ts
const mallard = new MallardDuck(new FlyWithWings(), new Quack());
```

**Pros:** maximum flexibility, easier to test (mock behaviors), no hidden
defaults.
**Cons:** more verbose at the call site, every `new` requires arguments.

#### Comparison

| | Java (2 constructors) | TS optional + `??` | TS always inject |
|---|---|---|---|
| Constructors needed | 2 | 1 | 1 |
| Defaults supported | ✅ | ✅ (via `??`) | ❌ |
| Flexibility | medium | high | highest |
| Convenience | ✅ | ✅ | ❌ |
| Testability | medium | medium | ✅ best |

#### Decision

> **Faithful translation:** use **optional parameters + `??` defaults** — one
> constructor that replaces Java's two.
>
> **Idiomatic refactor:** consider **always inject** (no defaults) for maximum
> testability.

---

## 11. Phase 3 — Writing the TypeScript code in the sandbox

We implemented the Strategy pattern twice in the sandbox:
- **faithful/** (`sandbox/02-strategy/`) — a direct, line-by-line Java
  translation (classes for everything, `interface` contracts).
- **idiomatic/** (`sandbox/02-strategy/idiomatic/`) — a TypeScript-native
  refactor (single-method strategies become function types).

Both compile cleanly and produce identical output.

### File structure

```
faithful/ (02-strategy/)
├── interfaces.ts      ← FlyBehavior, QuackBehavior (interfaces)
├── fly-behaviors.ts   ← FlyWithWings, FlyNoWay, FlyRocketPowered (classes)
├── quack-behaviors.ts ← Quack, Squeak, MuteQuack (classes)
├── duck.ts            ← abstract Duck (constructor param properties)
├── ducks.ts           ← MallardDuck, RedheadDuck, RubberDuck, DecoyDuck
└── simulator.ts       ← runs all ducks + runtime behavior change

idiomatic/
├── behaviors.ts       ← FlyBehavior, QuackBehavior (function types)
├── fly-behaviors.ts   ← flyWithWings, flyNoWay, flyRocketPowered (const fns)
├── quack-behaviors.ts ← quack, squeak, muteQuack (const fns)
├── duck.ts            ← abstract Duck (calls field() directly)
├── ducks.ts           ← 4 subclasses (pass fn refs, no new)
└── simulator.ts
```

Run either simulator:
```bash
npm run start -- 02-strategy/simulator.ts           # faithful
npm run start -- 02-strategy/idiomatic/simulator.ts # idiomatic
```

### What the faithful translation looks like

```ts
// interfaces.ts — the contracts
export interface FlyBehavior  { fly(): void; }
export interface QuackBehavior { quack(): void; }

// fly-behaviors.ts — concrete behaviors as classes
export class FlyWithWings implements FlyBehavior {
  fly(): void { console.log("I am flying with wings"); }
}
export class FlyNoWay implements FlyBehavior {
  fly(): void { console.log("I can't fly"); }
}
export class FlyRocketPowered implements FlyBehavior {
  fly(): void { console.log("I am flying with a rocket"); }
}

// duck.ts — the abstract context
export abstract class Duck {
  constructor(
    private flyBehavior: FlyBehavior,
    private quackBehavior: QuackBehavior,
  ) {}
  abstract display(): void;
  performFly(): void { this.flyBehavior.fly(); }
  performQuack(): void { this.quackBehavior.quack(); }
  swim(): void { console.log("All ducks float, even decoys!"); }
  setFlyBehavior(fb: FlyBehavior): void { this.flyBehavior = fb; }
  setQuackBehavior(qb: QuackBehavior): void { this.quackBehavior = qb; }
}

// ducks.ts — concrete ducks (constructor injection)
export class MallardDuck extends Duck {
  constructor() { super(new FlyWithWings(), new Quack()); }
  override display(): void { console.log("I'm a Mallard Duck"); }
}
export class RubberDuck extends Duck {
  constructor(
    flyBehavior?: FlyBehavior,
    quackBehavior?: QuackBehavior,
  ) {
    super(flyBehavior ?? new FlyNoWay(), quackBehavior ?? new Squeak());
  }
  override display(): void { console.log("I'm a Rubber Duck"); }
}
```

### What the idiomatic refactor looks like

```ts
// behaviors.ts — the contracts as function types
export type FlyBehavior  = () => void;
export type QuackBehavior = () => void;

// fly-behaviors.ts — concrete behaviors as functions
export const flyWithWings: FlyBehavior = () => {
  console.log("I'm flying with wings");
};
export const flyNoWay: FlyBehavior = () => {
  console.log("I can't fly");
};
export const flyRocketPowered: FlyBehavior = () => {
  console.log("I am flying with a rocket");
};

// duck.ts — the abstract context (calls the function directly)
export abstract class Duck {
  constructor(
    private flyBehavior: FlyBehavior,
    private quackBehavior: QuackBehavior,
  ) {}
  abstract display(): void;
  performFly(): void { this.flyBehavior(); }     // field() not field.fly()
  performQuack(): void { this.quackBehavior(); }
  swim(): void { console.log("All ducks float, even decoys!"); }
  setFlyBehavior(fb: FlyBehavior): void { this.flyBehavior = fb; }
  setQuackBehavior(qb: QuackBehavior): void { this.quackBehavior = qb; }
}

// ducks.ts — pass function references, no `new`
export class MallardDuck extends Duck {
  constructor() { super(flyWithWings, quack); }
  override display(): void { console.log("I'm a Mallard Duck"); }
}
export class RubberDuck extends Duck {
  constructor(
    flyBehavior?: FlyBehavior,
    quackBehavior?: QuackBehavior,
  ) {
    super(flyBehavior ?? flyNoWay, quackBehavior ?? squeak);
  }
  override display(): void { console.log("I'm a Rubber Duck"); }
}
```

### Side-by-side: what changed, what stayed the same

| Concern | Faithful | Idiomatic |
|---|---|---|
| Contract | `interface FlyBehavior { fly(): void }` | `type FlyBehavior = () => void` |
| Behavior | `class FlyWithWings implements ...` | `const flyWithWings: FlyBehavior = ...` |
| Call in Duck | `this.flyBehavior.fly()` | `this.flyBehavior()` |
| Pass to duck | `super(new FlyWithWings(), new Quack())` | `super(flyWithWings, quack)` |
| Lines per behavior | ~5 | ~3 |
| `new` keyword | needed | not needed |
| `implements` | ✅ | ❌ |
| Inline injection | object literal w/ method | arrow function |
| Holds state | ✅ class fields | ❌ (closure workaround) |
| `typecheck` + runtime output | ✅ identical | ✅ identical |

### Key learnings

1. **`import type` vs `import`.** With `verbatimModuleSyntax: true`, interfaces
   and type aliases must be imported with `import type { FlyBehavior }`.
   Classes are imported with a plain `import { FlyWithWings }` because they are
   runtime values (we `new` them).

2. **Import paths end in `.js`.** Even though source files are `.ts`, the import
   path is `./interfaces.js` (not `.ts`). TypeScript maps `.js` → `.ts` during
   compilation, so the path is correct for both the compiler and runtime.

3. **`override` on `display()`.** With `noImplicitOverride: true`, overriding an
   abstract method in a subclass requires the `override` keyword. It's *not*
   needed on behavior classes (they only `implements` an interface, they don't
   extend a class).

4. **Constructor parameter properties.** `constructor(private flyBehavior:
   FlyBehavior)` both declares the field and assigns it in one step — no
   separate field declaration needed.

5. **`??` (nullish coalescing).** Collapses Java's two RubberDuck constructors
   into one. `flyBehavior ?? new FlyNoWay()` uses the default only when the
   argument is `null`/`undefined` (unlike `||`, which also replaces falsy
   values like `0` and `""`).

6. **Structural typing in action.** The idiomatic simulator passes inline
   callback functions and object literals as behaviors — no class, no
   `implements`, no `new`. TypeScript accepts anything with the right shape.

### The core Strategy payoff demonstrated

```ts
// A RubberDuck starts off unable to fly:
rubber.performFly();                        // → "I can't fly"

// Swap its strategy at runtime with the setter:
rubber.setFlyBehavior(flyRocketPowered);
rubber.performFly();                        // → "I am flying with a rocket"
```

The duck object never changes class — only its behavior strategy. This is
**encapsulate what varies** plus **program to an interface**: the context
(`Duck`) is decoupled from the concrete strategies, so behaviors are
interchangeable at runtime without subclassing.

---

_Status: The Strategy pattern is complete (Java understanding + TS translation
decisions + faithful & idiomatic implementations, all documented).
Next: **Chapter 3 — The Adapter Pattern**._
