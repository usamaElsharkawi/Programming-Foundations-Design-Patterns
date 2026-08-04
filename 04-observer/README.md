# Section 4 — The Observer Pattern

> _Documented after our discussion of lecture 4.1 (Understanding the Observer
> pattern)._

---

## 1. Lecture 4.1 — Understanding the Observer pattern

### Takeaways (from the video)

- The Observer pattern embodies the design principle of **loose coupling** —
  objects interact without being overly dependent on each other, which keeps
  designs flexible.
- It works like a **subscription system** where a publisher notifies all
  subscribed objects (observers) about changes in data or events.
- It is widely used in software to manage complex scenarios with many objects
  needing updates, helping maintain clean and adaptable code.

### The core idea — a one-to-many relationship

The pattern is a **one-to-many** relationship where the "one" automatically
tells the "many" when something changes:

| Magazine world | Pattern term |
|---|---|
| The publisher / magazine office | **Subject** (a.k.a. Observable / Publisher) |
| A reader | **Observer** (a.k.a. Subscriber / Listener) |
| Subscribing | `registerObserver()` / `subscribe()` |
| Unsubscribing | `removeObserver()` / `unsubscribe()` |
| A new issue is published | `notifyObservers()` |
| Receiving the issue | `update()` on each observer |

### What the observable holds

The observable holds a **list of observers**, and that list is typed as the
**Observer interface** — not as any specific concrete class:

```ts
// inside the Subject:
private observers: Observer[] = [];   // ← a LIST, typed by the INTERFACE
```

### What each side does

**The observable (the "one"):**
- holds a list of `Observer`s
- `registerObserver()` — adds an observer to the list
- `removeObserver()` — removes an observer from the list
- `notifyObservers()` — loops over the list and calls `update()` on each

**The observer (one of the "many"):**
- implements the `Observer` interface
- has an `update()` method
- does its **own business** inside `update()` — the observable never knows or
  cares what that business is

### Why this is loose coupling (the payoff)

The observable depends on **one** thing — the `Observer` interface. It does
**not** depend on `Display`, `Logger`, `PhoneApp`, or any concrete class.

- Add a new observer type → just implement `Observer` and call
  `registerObserver()`. The observable never changes.
- Remove an observer → just call `removeObserver()`. The observable never
  changes.
- The arrows of knowledge collapse from **N** (one per dependent) to **1**
  (one to the Observer interface).

```
Without Observer:                  With Observer:

  Subject ──knows──▶ Display1       Subject ──holds a list──▶ [ Observer (interface) ]
          ──knows──▶ Display2                                     ▲ ▲ ▲ ▲ ▲
          ──knows──▶ Alarm                              Display1, Display2, Alarm, Logger, App
          ──knows──▶ Logger         (add a 6th → just subscribe it;
          ──knows──▶ PhoneApp        Subject never changes)
  (add a 6th → modify Subject's code)
```

### Why the pattern is everywhere

A huge number of real systems are fundamentally "one thing changed → many
things need to react":

- GUI button click → multiple handlers react (`addEventListener`)
- A stock price changes → charts, alerts, portfolios all update
- A sensor reading changes → dashboard, logger, alarm all fire
- A chat message arrives → every participant's screen updates
- Browser events: `addEventListener('click', ...)` is literally subscribing an
  observer to a click "subject"
- React state → re-render is conceptually the same idea
- MQTT / Pub-Sub / message queues in distributed systems are the Observer
  pattern scaled up to networks

### The mental model in one sentence

> **The observable holds a list of `Observer`s (typed by the interface, not by
> concrete class). It exposes `registerObserver()` / `removeObserver()` to
> manage the list and `notifyObservers()` to call `update()` on every entry.
> Each observer implements the `Observer` interface and does its own business
> inside `update()` — the observable never knows or cares what that business
> is.**

---

_Status: Lecture 4.1 documented. Next: **discuss lecture 4.2 (The Observer
pattern defined)** together._
