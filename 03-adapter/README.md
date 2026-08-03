# Section 3 — The Adapter Pattern

> _Documented after our discussion of lectures 3.1 (Understanding the Adapter
> pattern) and 3.2 (The Adapter pattern defined)._

---

## 1. Lecture 3.1 — Understanding the Adapter pattern

### Takeaways (from the video)

- The Adapter pattern helps make two incompatible interfaces work together by
  creating an adapter class that translates between them.
- It allows you to swap out components (like vendor classes) with different
  interfaces without changing the existing system code.
- This pattern keeps the system flexible and resilient to change by isolating
  the interface differences within the adapter.

### Why it matters (our discussion)

All three takeaways orbit one central problem: **two interfaces that don't
match, and client code that's already written to one of them.**

**The two bad choices vs. the Adapter:**

| Approach | What changes | Risk |
|---|---|---|
| Change the client to understand Turkeys | Many files, `if (is a turkey)` branches everywhere | Fragile, hard to maintain |
| **Adapter (the chosen one)** | **One** small translator class | Confined, safe |

**Why the Adapter is the "safe" choice:** it keeps the change in ONE small
place.

- The client (`testDuck`) — **zero changes.** It keeps calling `quack()`/`fly()`.
- The concrete classes (`MallardDuck`, `WildTurkey`) — **zero changes.** Neither
  knows about the other.
- The adapter (`TurkeyAdapter`) — the **only** new thing. It holds **all** of
  the translation logic.

So when a third-party vendor ships a new class with a weird interface, you
don't touch your system. You write **one** adapter. If they change their
interface later, only the adapter changes.

**The structural reason it works (no magic):**

- The adapter **implements the target interface** (`TurkeyAdapter implements
  Duck`) — so the client sees a valid `Duck`.
- The adapter **composes the adaptee** (it holds a `Turkey turkey` field) — so
  the real work is done by the original object.
- The adapter **translates every method call** (`quack()` → `turkey.gobble()`).

> **One sentence:** "implements the target, wraps the adaptee, translates the
> calls." That is the whole pattern.

---

## 2. Lecture 3.2 — The Adapter pattern defined

### Takeaways (from the video)

- The Adapter pattern enables two classes with incompatible interfaces to work
  together by introducing an Adapter class that translates calls from the
  client to the adapted class.
- It allows you to use a new or different class (**Adaptee**) without changing
  the existing system's expected interface (**Target**).
- This pattern helps keep software flexible and resilient to change by
  isolating interface differences within the Adapter, making integration
  smoother.

### The formal vocabulary

The second lecture gives the pattern its **official terms**:

| Term | What it is | In the duck/turkey example |
|---|---|---|
| **Target** | The interface the client expects | `Duck` |
| **Adaptee** | The new/different class you want to use | `Turkey` |
| **Adapter** | Translates client → adaptee | `TurkeyAdapter` |
| **Client** | Code that uses the Target; unaware of the Adaptee | `testDuck` |

### Connecting the two lectures

Lecture 3.1 showed *why* (flexibility, isolation of change). Lecture 3.2 gives
it *a name and structure* (Target, Adaptee, Adapter). Together:

> **The Adapter lets a client use an Adaptee through the Target's interface,
> by wrapping the Adaptee and translating every call — so neither the client
> nor the existing system code ever has to change.**

This is especially useful when integrating third-party libraries or evolving a
codebase without breaking existing functionality.

---

_Status: Lectures 3.1 & 3.2 discussion documented. Next: lecture 3.3 (Using
the Adapter pattern — the Java code), then the TypeScript translation._
