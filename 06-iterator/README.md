# Section 6 — The Iterator Pattern

> _Documented after our discussion of lectures 6.1 (Encapsulating iteration)
> and 6.2 (Understanding the Iterator pattern)._

---

## 1. Lecture 6.1 — Encapsulating iteration

### Takeaways (from the video)

- Different data structures like arrays and ArrayLists store collections of
  objects, but each requires different iteration code.
- Rewriting iteration code for each collection type is inefficient and
  error-prone.
- The key idea is to **encapsulate the varying part** — in this case,
  iteration — so you can write flexible code that works across different
  collection types.
- This leads to the Iterator pattern, which encapsulates iteration and makes
  your code more adaptable and easier to maintain.

### The root problem — different structures, different iteration code

Two ways to store the same collection:

**An array:**
```java
MenuItem[] menuItems = new MenuItem[10];
for (int i = 0; i < array.length; i++) {   // .length property + [i] indexing
    MenuItem item = menuItems[i];
}
```

**An ArrayList:**
```java
ArrayList<MenuItem> menuItems = new ArrayList<>();
for (int i = 0; i < menuItems.size(); i++) {  // .size() method + .get(i)
    MenuItem item = menuItems.get(i);
}
```

| | Array | ArrayList |
|---|---|---|
| Get the length | `.length` (property) | `.size()` (method) |
| Get an item | `[i]` (bracket indexing) | `.get(i)` (method call) |
| Add an item | fixed size, `= x` | `.add(x)` |

Same *concept* (loop over a collection), but the **code differs** because the
**iteration mechanics differ**.

### The cost — duplication is inefficient and error-prone

If a client wants to display all menus, it must write **two separate loops**:
```java
// Pancake house menu (ArrayList):
for (int i = 0; i < pancakeMenu.size(); i++) {
    MenuItem item = pancakeMenu.get(i); print(item);
}
// Diner menu (array) — DIFFERENT code:
for (int i = 0; i < dinerMenu.length; i++) {
    MenuItem item = dinerMenu[i]; print(item);
}
```

**Why this is bad:**
1. **Duplicated logic** — the "loop and print" idea exists twice.
2. **Error-prone** — `get(i)` vs `[i]`, `size()` vs `length` are easy to mix up
   (off-by-one, wrong index, wrong length).
3. **Hard to maintain** — a format change means editing every loop; a new
   collection type means writing another loop.
4. **Tightly coupled** — the client depends on HOW each collection is stored.

### The solution — encapsulate the varying part

**"Encapsulate what varies"** (design principle #1, first seen in the Strategy
chapter) applied to iteration: the way you walk through a collection is what
varies, so **wrap it in an object**.

Give every collection a standard iteration interface:

```
hasNext()  → is there another item?
next()     → give me the next item
```

Now the client writes **ONE** loop that works for every collection type:
```java
while (iterator.hasNext()) {
    MenuItem item = iterator.next();   // works for array OR ArrayList!
    print(item);
}
```

### Why this is loose coupling (same idea as Observer)

Without Iterator, the client knows every collection's structure; with Iterator,
the client depends only on the `Iterator` interface.

```
  Client / Printer ──depends on──▶  Iterator (interface: hasNext, next)
                                        ▲        ▲        ▲
                              ArrayListIterator  ArrayIterator  HashIterator
                              (each knows its own collection's guts)
  (add a new collection type → write one new iterator; client never changes)
```

### Where you've already seen it

TypeScript/JavaScript developers use the Iterator concept constantly without
naming the pattern:
- `for (const item of menuItems)` — the `for...of` loop
- `.forEach()`, `.map()`, `.filter()`
- The JS `[Symbol.iterator]` protocol
- Java's `for (Type x : collection)` enhanced for-loop

These are all **built-in Iterator pattern implementations** — the pattern baked
into the language.

### The mental model so far

> **Different collections iterate differently (array vs ArrayList). Rewriting
> iteration per collection is duplicated and error-prone. The Iterator pattern
> encapsulates iteration behind a standard interface (`hasNext()` / `next()`),
> so the client depends on one abstraction instead of each collection's
> structure — loose coupling and easy maintenance.**

---

## 2. Lecture 6.2 — Understanding the Iterator pattern

### Takeaways (from the video)

- Different collections like arrays and ArrayLists store items differently,
  requiring different iteration code.
- Rewriting iteration code for each collection type is inefficient and can
  lead to errors.
- The iterator pattern solves this by **encapsulating the iteration process**,
  allowing you to access elements sequentially **without exposing the
  underlying data structure**.
- This makes your code more flexible, reusable, and easier to maintain.

### The GoF definition

> *"The Iterator pattern provides a way to **access the elements of an
> aggregate object** (a collection) **sequentially**, **without exposing its
> underlying representation**."*

**Three big phrases unpacked:**
1. **"Access the elements of an aggregate object"** — an *aggregate* is a
   collection (the technical word for "holds many items"). The Iterator gets
   you to those elements one at a time.
2. **"Sequentially"** — one element after another, in order; the Iterator
   tracks where you are.
3. **"Without exposing its underlying representation"** — the caller never
   knows if it's an array, ArrayList, HashMap, etc. It only sees `hasNext()` /
   `next()`. This is the loose-coupling payoff.

### The "players"

| Player | Role | In the menu example |
|---|---|---|
| **Iterator** (interface) | `hasNext()` + `next()` — the iteration contract | `Iterator<MenuItem>` |
| **ConcreteIterator** | Knows the collection's guts; implements `hasNext()`/`next()`; tracks the position | `DinerMenuIterator`, `PancakeHouseIterator` |
| **Aggregate** (interface) | Provides a way to get an Iterator: `createIterator()` | `Menu` |
| **ConcreteAggregate** | The actual collection; returns a `ConcreteIterator` over itself | `DinerMenu`, `PancakeHouseMenu` |

**The two key relationships:**
1. `ConcreteAggregate implements Aggregate` — each menu provides
   `createIterator()`.
2. `ConcreteIterator implements Iterator` AND knows its own collection — each
   iterator holds a ref to the specific collection whose structure its
   iteration logic depends on.

### What is an "aggregate object"?

**Aggregate** = *a whole formed by combining many parts* — in programming, an
object whose job is to **hold a group of other objects** (the container).

| Aggregate object | What it holds |
|---|---|
| An array `MenuItem[]` | many MenuItems |
| An ArrayList `ArrayList<MenuItem>` | many MenuItems |
| A `DinerMenu` | an array of MenuItems inside it |
| A `PancakeHouseMenu` | an ArrayList of MenuItems inside it |
| A HashMap | many key-value pairs |

**Aggregate vs Iterator:**
> **Aggregate = the WHO (the container that HAS the items).**
> **Iterator = the HOW (the mechanism that LETS YOU ACCESS the items).**

Analogy: the **library** (aggregate) stores the books; the **librarian**
(iterator) walks you through them one at a time — you (the client) never need
to know how the shelves (underlying structure) are organized.

### Yes — we can call the aggregate an "Iterable"

The generic pattern term "aggregate" is exactly what languages call **`Iterable`**:

| Pattern jargon | Real code (Java) |
|---|---|
| Aggregate / ConcreteAggregate | the `Iterable<T>` interface |
| createIterator() | the `iterator()` method |
| Iterator | the `Iterator<T>` interface |
| hasNext() / next() | `hasNext()` / `next()` |

Java:
```java
public interface Iterable<T> {
    Iterator<T> iterator();   // = createIterator()
}
// Any class implementing Iterable works in the enhanced for-loop:
for (MenuItem item : dinerMenu) { ... }   // uses iterator() under the hood
```

TypeScript/JavaScript has the same protocol:
```ts
interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;   // the "createIterator()" equivalent
}
interface Iterator<T> {
  next(): IteratorResult<T>;          // { value, done } — combines hasNext+next
}
// Used by for...of:
for (const item of menuItems) { ... }
```

**"Aggregate" is the language-neutral pattern term; `Iterable` is the concrete
interface name.** Because a thing that "holds a collection" and a thing that
"offers an iterator" are essentially the same, calling the aggregate an
`Iterable` is exactly right.

### The client — one method, any collection

```java
void printMenu(Iterator<MenuItem> iterator) {   // works for ANY menu
    while (iterator.hasNext()) {
        MenuItem item = iterator.next();
        System.out.println(item);
    }
}
// Only the createIterator() call touches the concrete menu:
printMenu(pancakeHouseMenu.createIterator());   // ArrayList-backed
printMenu(dinerMenu.createIterator());          // array-backed
```

### Why each ConcreteIterator "knows its collection's guts"

The iteration mechanics move into the iterator (which is exactly where the
collection-specific code belongs):

```java
class DinerMenuIterator implements Iterator<MenuItem> {
    MenuItem[] items;   // ← knows it's an ARRAY
    int position = 0;   // ← tracks where we are
    hasNext() { return position < items.length; }   // .length
    next()    { return items[position++]; }         // [i]
}
class PancakeHouseIterator implements Iterator<MenuItem> {
    ArrayList<MenuItem> items;   // ← knows it's an ARRAYLIST
    int position = 0;
    hasNext() { return position < items.size(); }   // .size()
    next()    { return items.get(position++); }     // .get(i)
}
```

Each concrete iterator holds a private `position` field — the "current place in
the sequence." The `hasNext()`/`next()` differ per collection, but that's all
hidden behind the interface.

### The simple-language understanding (our key takeaway)

> **The Iterator pattern lets a client walk through any collection it's handed
> — array, ArrayList, Set, Map — by talking only to a standard `Iterator`
> (`hasNext()`/`next()`), never to the collection's specific structure. So the
> client stays agnostic (doesn't depend on a specific iterable type) and is
> NOT changed, even as new collection types appear.**

### Reusing the design principles

| Principle | Where we saw it | In Iterator |
|---|---|---|
| Encapsulate what varies | Strategy (fly/quack) | The *iteration mechanics* vary → encapsulate them |
| Program to an interface | Strategy, Adapter, Decorator, Observer | Client talks to `Iterator`, not concrete collections |
| Loose coupling | Observer | Client depends on one abstraction, not N structures |
| Single responsibility | (next: lecture 6.5) | Collection holds data; iterator holds traversal |

---

_Status: Lectures 6.1 & 6.2 documented. Next: **lecture 6.3 (Using the Iterator
pattern — the Java DinerMenu/PancakeHouseMenu code)**._
