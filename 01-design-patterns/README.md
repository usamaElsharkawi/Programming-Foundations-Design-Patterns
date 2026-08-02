# Section 1 — Design Patterns

> Course module: **What are design patterns?**
> Source: Programming Foundations: Design Patterns (Java) → applied in TypeScript.

---

## 1. What are design patterns?

A **design pattern** is a named, reusable **solution structure** for a design
problem that recurs across many different programs.

The core idea: **reusing design experience**, not reusing code.

Senior engineers have made the same design mistakes thousands of times and
slowly discovered the same good *shapes* of code that fix them. Patterns are how
that hard-won experience gets handed to you directly — so you don't have to
rediscover it through years of pain.

> **Mental test:** if you could copy-paste it, it would be a library, not a
> pattern. Patterns are never about *code reuse* — they are about *thought reuse*.

---

## 2. Patterns are NOT algorithms or code

The most misunderstood point. The line between them:

| | **Algorithm** | **Design Pattern** |
|---|---|---|
| Solves | a *computational* problem (sort this, find shortest path) | a *structural* problem (how should these objects relate?) |
| Looks like | step-by-step procedure, precise input → output | a shape / relationship between classes & objects |
| Concerned with | *correctness & performance* | *flexibility, maintainability, change* |
| Example | Quicksort | Strategy (swap an algorithm at runtime) |

An algorithm tells you **how to compute**. A pattern tells you **how to arrange
your objects** so the code stays flexible. Two different layers of the craft.

---

## 3. The two ingredients: experience + principles

A pattern is built from **two things fused together**:

1. **Collected experience** — "every time we faced *this* kind of problem, the
   code that survived best had *this* shape."
2. **Design principles** — the underlying rules of good design (e.g. "favor
   composition over inheritance," "program to an interface") that *explain why*
   that shape works.

So a pattern isn't arbitrary folklore — it is experience **backed by
principles**. The principles are the *why*; the pattern is a battle-tested *how*
for a specific recurring situation.

---

## 4. How patterns are packaged

For experience to be transferable, it has to be packaged consistently. The
"Gang of Four" (GoF) catalog standardised the format so every pattern is
described the same way:

- A **name** — the magic part: a shared word.
- The **problem** it solves — when to use it.
- The **solution** — the structure (usually a class/object diagram).
- The **consequences** — trade-offs: what you gain, what you pay.

The **class diagram** is the visual blueprint of the solution: which classes
exist, who creates whom, who points to whom.

---

## 5. General solution for common problems

A pattern describes a **structure**, not a **domain**. "Strategy" doesn't care
whether you're building a game, a payment system, or a thermostat — it only
says *"when you need to swap behavior at runtime, arrange your objects like
this."* The *same* pattern shows up in wildly different apps because the
**problem** recurs even when the **business domain** doesn't.

This is also why patterns are **language-agnostic** — that's why we can take a
Java-taught course and apply it in TypeScript. The structure is universal; only
the syntax differs.

---

## The one-line takeaway

> **Patterns = named, principled, battle-tested shapes of code that turn tacit
> senior expertise into a shared vocabulary you can use on day one.**

The biggest payoff isn't even the code — it's the **vocabulary**. In a design
meeting, *"let's use a Decorator here"* replaces a five-minute ramble and the
whole team gets it. That shared language is the real superpower.

---

## Key terms

- **Design pattern** — a named, reusable solution *structure* for a recurring
  design problem (not code, not an algorithm).
- **Design principle** — a general guideline for good OO design that explains
  *why* a pattern works.
- **Catalog** — the standardised collection of patterns (name, problem,
  solution, consequences) pioneered by the Gang of Four book.
- **Class diagram** — the visual blueprint of a pattern's solution.

---

## 6. What are design principles?

> Course module: **What are design principles?**

### Principles vs patterns — the critical distinction

- **Principles** are **general guidelines** — they apply *everywhere*, all the
  time, to every design.
- **Patterns** are **specific design solutions** aimed at solving *particular*
  recurring object-oriented problems.

| | **Design Principle** | **Design Pattern** |
|---|---|---|
| Scope | General — applies everywhere, always | Specific — targets a particular recurring problem |
| Form | A guideline / rule of thumb | A concrete structure (named, with a class diagram) |
| Answers | **What** should be true of good code & **why** | **How** to arrange objects for *this* situation |
| Count | A small handful that underlie everything | Many (GoF catalogued 23, plus more) |
| Example | "Favor composition over inheritance" | Strategy, Observer, Decorator… |

Analogy from building architecture: a **principle** is *"a building should let in
natural light and support its own weight"* (true of every building). A **pattern**
is *"an atrium"* — a specific structure that satisfies the principle for a
specific kind of space.

A principle is never wrong, but it is also **vague** — it states the goal, not
the construction. That vagueness is exactly what the next point is about.

### "Encapsulate what varies" — the principle that powers Strategy

Full wording:

> **Identify the aspects that vary and separate them from what stays the same.**

**The problem it addresses:** Change. Software *always* changes. If the parts
that change are tangled with the parts that stay stable, every change risks
breaking the stable parts — you end up touching code unrelated to your feature,
and that is how bugs and fragility breed.

**What the principle tells you to do:**

1. **Find** the aspects that vary (behavior that differs between subclasses,
   rules that change over time, algorithms that get swapped).
2. **Separate** them from everything else — pull the varying part *out* behind
   its own boundary.
3. **Encapsulate** it — hide it behind an interface so the rest of the code
   talks to the abstraction, not the concrete varying thing.

**The payoff:** when that part changes, *only* that part changes. The stable code
doesn't even know a change happened.

> **Analogy — the thermostat.** The *stable* part is the house and the wiring.
> The *varying* part is "what temperature do we want right now." We encapsulate
> the varying part in a dial — you turn the dial, the house doesn't change. If
> we'd hard-coded "always 20°C" into the wiring, every preference change would
> mean rewiring the house.

### The key insight: principles say WHAT, patterns say HOW

> **A principle tells you the *goal*. A pattern is a *proven recipe* for
> achieving that goal in a specific situation.**

"Encapsulate what varies" is the principle. But it leaves a giant open question:
**HOW do you separate and encapsulate the varying part?** There are many possible
answers:

- Subclass it (inheritance) — but this turns out brittle.
- Put it behind an interface and swap implementations (composition) → the
  **Strategy pattern**.
- Wrap objects to add behavior (composition, different shape) → the **Decorator
  pattern**.
- Pull creation logic into a separate object → the **Factory pattern**.

**Several different patterns all serve the same principle.** The principle is the
shared *why*; each pattern is a *specific how* tuned to a specific kind of
variation. That is why the instructor says "the pattern comes in" right after the
principle — the pattern is the concrete mechanism that *realises*
"encapsulate what varies" for the ducks' quacking/flying behavior.

```
Principle (the WHY):   Encapsulate what varies.
        │
        ▼
Pattern (the HOW):     Strategy — define a family of behaviors,
                       put each behind an interface, and let a
                       duck *hold* one, swapping it at runtime.
```

### The other principles we'll meet (preview only)

"Encapsulate what varies" is the headline one for now. The course will surface a
few more as we go — we'll discuss each properly when its chapter arrives:

- **Favor composition over inheritance** (Ch.2) — build behavior by *holding*
  objects, not *being* them.
- **Program to an interface, not an implementation** (Ch.2) — depend on
  abstractions.
- **Open-Closed Principle** (Ch.5) — open for extension, closed for
  modification.
- **Single Responsibility Principle** (Ch.6) — a class should have one reason
  to change.

All of these are *principles* — guidelines. The patterns are the *structures*
that honour them.

---

## Key terms

- **Design pattern** — a named, reusable solution *structure* for a recurring
  design problem (not code, not an algorithm).
- **Design principle** — a general guideline for good OO design that explains
  *why* a pattern works.
- **Encapsulate what varies** — identify the aspects that vary and separate them
  from what stays the same; the principle that powers the Strategy pattern.
- **Catalog** — the standardised collection of patterns (name, problem,
  solution, consequences) pioneered by the Gang of Four book.
- **Class diagram** — the visual blueprint of a pattern's solution.

---

_Status: documented after our discussion. Next chapter: **2 — The Strategy
Pattern** (Revisiting inheritance)._

