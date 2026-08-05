# Section 6 — The Iterator Pattern

> _Documented after our discussion of lectures 6.1 (Encapsulating iteration)
> and 6.2 (Understanding the Iterator pattern), plus the TypeScript
> implementation and the built-in `Iterable` language feature._

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

## 3. The TypeScript implementation

The pattern is implemented in `sandbox/06-iterator/`. All files compile
cleanly and the MenuTestDrive runs end-to-end, matching the Java output. This
is a **faithful translation** using custom `Iterator`/`Menu` interfaces (the
native TS `Iterable`/`Iterator` protocol is discussed below).

### File structure

```
sandbox/06-iterator/
├── menu-item.ts            ← MenuItem (the element)
├── interfaces.ts           ← Iterator<T> (hasNext/next) + Menu (createIterator)
├── diner-menu.ts           ← DinerMenu (array-backed) + DinerMenuIterator
├── pancake-house-menu.ts   ← PancakeHouseMenu (growable-list-backed) + iterator
├── waitress.ts             ← the client (prints ANY menu via the Iterator)
└── menu-test-drive.ts      ← the entry point
```

Run it:
```bash
npm run start -- 06-iterator/menu-test-drive.ts
```

### `interfaces.ts` — the two contracts

```ts
/** ITERATOR — the iteration contract. */
export interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
}

/** AGGREGATE — the collection contract. */
export interface Menu {
  createIterator(): Iterator<MenuItem>;
}
```

The client depends ONLY on these two interfaces — never on a concrete menu or
iterator. That's the loose coupling.

### `diner-menu.ts` — array-backed

DinerMenu stores items in a **fixed-size array** (MAX_ITEMS = 6) with a
separate count, mirroring the Java menu that uses a raw array:

```ts
export class DinerMenuIterator implements Iterator<MenuItem> {
  private position = 0;
  constructor(private items: MenuItem[]) {}

  hasNext(): boolean {
    return this.position < this.items.length && this.items[this.position] != null;
  }
  next(): MenuItem {
    const item = this.items[this.position]!;  // non-null: hasNext() was true
    this.position += 1;
    return item;
  }
}

export class DinerMenu implements Menu {
  private static readonly MAX_ITEMS = 6;
  private menuItems: MenuItem[] = [];
  private numberOfItems = 0;
  // constructor + addItem() guard the array against overflow ...
  createIterator(): Iterator<MenuItem> {
    return new DinerMenuIterator(this.menuItems);
  }
}
```

### `pancake-house-menu.ts` — growable-list-backed

PancakeHouseMenu stores items in a **growable array** via `push()`, mirroring
the Java menu that uses an ArrayList:

```ts
export class PancakeHouseMenuIterator implements Iterator<MenuItem> {
  private position = 0;
  constructor(private items: MenuItem[]) {}

  hasNext(): boolean {
    return this.position < this.items.length;          // no null-slot check
  }
  next(): MenuItem {
    return this.items[this.position++]!;
  }
}

export class PancakeHouseMenu implements Menu {
  private menuItems: MenuItem[] = [];
  addItem(n, d, v, p): void { this.menuItems.push(new MenuItem(n, d, v, p)); }
  createIterator(): Iterator<MenuItem> {
    return new PancakeHouseMenuIterator(this.menuItems);
  }
}
```

**Notice the two iterators genuinely differ** (DinerMenu checks for null slots,
PancakeHouseMenu doesn't; different `hasNext()` logic). That collection-specific
logic lives in each iterator — not in the client. This is "encapsulate what
varies."

### `waitress.ts` — the client (the payoff)

```ts
export class Waitress {
  constructor(
    private pancakeHouseMenu: Menu,
    private dinerMenu: Menu,
  ) {}

  printMenu(): void {
    const pancakeIterator = this.pancakeHouseMenu.createIterator();
    const dinerIterator = this.dinerMenu.createIterator();
    console.log("MENU\n----\nBREAKFAST");
    this.printMenuItems(pancakeIterator);
    console.log("\nLUNCH");
    this.printMenuItems(dinerIterator);
  }

  // ONE method that prints ANY menu — the core benefit:
  private printMenuItems(iterator: Iterator<MenuItem>): void {
    while (iterator.hasNext()) {
      const menuItem = iterator.next();
      console.log(`${menuItem.getName()}, ${menuItem.getPrice()} -- ${menuItem.getDescription()}`);
    }
  }
}
```

**Key observation:** `printMenuItems` works for **both** the array-backed
DinerMenu and the list-backed PancakeHouseMenu, because it only uses
`hasNext()`/`next()`. The Waitress never knows (or cares) how a menu is stored.

### Sample output

```
=== Full Menu ===

MENU
----
BREAKFAST
K&B's Pancake Breakfast, 2.99 -- Pancakes with scrambled eggs, and toast
Regular Pancake Breakfast, 2.99 -- Pancakes with fried eggs, sausage
...
LUNCH
Vegetarian BLT, 2.99 -- (Fakin') Bacon with lettuce & tomato on whole wheat
...

=== Vegetarian Menu ===
... (only vegetarian items, filtered inside the client)
```

### Bonus — the native TS `Iterable` protocol

As discussed, the pattern's "aggregate" is what TypeScript/JavaScript call
`Iterable`, and `createIterator()` is `[Symbol.iterator]()`. A more idiomatic
version would implement the native protocol so `for...of` works directly:

```ts
class DinerMenu implements Iterable<MenuItem> {
  [Symbol.iterator](): Iterator<MenuItem> {
    // native protocol returns { value, done } from a single next()
    ...
  }
}
// Client can then write:
for (const item of dinerMenu) { ... }
```

We kept a **custom `Iterator` interface here** for a direct, readable mapping
to the Java code and the pattern's `hasNext()`/`next()` vocabulary. The native
protocol is covered by the course's "iterator as language feature" topic
(lecture 6.7).

### TypeScript practices used

| Practice | Where | Why |
|---|---|---|
| Custom `interface Iterator<T>` + `interface Menu` | `interfaces.ts` | Faithful to Java's `Iterator`/`Menu`; avoids clashing with TS's built-in `Iterator` |
| `createIterator()` returns `Iterator<MenuItem>` | menus | The aggregate contract; client depends only on it |
| Collection-specific `hasNext()`/`next()` | iterators | Encapsulate the varying iteration logic per structure |
| `private position` field | iterators | Tracks the "current place in the sequence" |
| Non-null assertion `!` | iterators | `noUncheckedIndexedAccess` — safe because `hasNext()` guarantees validity |
| `import type` for interfaces | all files | `verbatimModuleSyntax` |
| Client types only to `Menu` / `Iterator` | `waitress.ts` | Loose coupling — never to concrete menus |

---

## 4. The Iterator pattern as a TypeScript language feature

The core insight: **you've been using the Iterator pattern all along.** TS/JS
baked it into the language — you don't write `hasNext()`/`next()` yourself. The
built-in version maps exactly onto the pattern we implemented by hand.

### The built-in `Iterable` and `Iterator` protocol

**`Iterable`** — the AGGREGATE (the thing you can iterate). It requires a
`[Symbol.iterator]()` method (= `createIterator()`):

```ts
interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;   // ← this is createIterator()
}
```

**`Iterator`** — the traverse. A single `next()` returns an `IteratorResult`
combining "hasNext" AND "next" into one call:

```ts
interface Iterator<T> {
  next(): IteratorResult<T>;
}
interface IteratorResult<T> {
  value: T;        // the current element
  done: boolean;   // = !hasNext()
}
```

**Key difference from our custom version:**
- Custom `Iterator`: **two** calls — `hasNext()` (ask) then `next()` (get).
- Built-in: **one** call — `next()` returns `{ value, done }`. The `done` flag
  *is* the hasNext answer, delivered with the value.

```ts
const result = iterator.next();      // { value: ..., done: false }
while (!result.done) {
  console.log(result.value);
  // next iteration calls iterator.next() again
}
```

### `for...of` — the language's built-in client loop

Instead of a manual `while (hasNext()) { next() }`, `for...of` does the whole
iteration for you:

```ts
for (const item of menu) {          // menu implements Iterable<MenuItem>
  console.log(item.getName());
}
```

**What `for...of` secretly does** (the pattern under the hood):
```ts
const iterator = menu[Symbol.iterator]();   // createIterator()
let result = iterator.next();
while (!result.done) {
  const item = result.value;
  console.log(item.getName());
  result = iterator.next();                 // advance + check done
}
```

So `for...of` is sugar for the exact `createIterator()` + `next()` pattern we
implemented, automated by the language.

### Which types are already `Iterable`?

| Type | Iterable? |
|---|---|
| `Array` | ✅ |
| `string` | ✅ |
| `Map` | ✅ |
| `Set` | ✅ |
| `arguments` / `NodeList` | ✅ |
| generator objects | ✅ |

```ts
for (const ch of "hello") { ... }        // 'h','e','l','l','o'
for (const [k, v] of map) { ... }        // Map → key/value pairs
```

### Higher-order methods (filter/map/forEach)

Built on iteration, arrays give declarative methods that encapsulate traversal
even further:
```ts
menuItems
  .filter(item => item.isVegetarian())
  .map(item => item.getName())
  .forEach(name => console.log(name));
```

### Making your OWN class iterable

If your class implements `Iterable`, then `for...of`, spread, and destructuring
all just work on it:

```ts
class DinerMenu implements Iterable<MenuItem> {
  private items: MenuItem[] = [];
  // ... addItem etc.

  [Symbol.iterator](): Iterator<MenuItem> {
    let index = 0;
    const items = this.items;
    return {
      next(): IteratorResult<MenuItem> {
        if (index < items.length) {
          return { value: items[index++], done: false };
        }
        return { value: undefined as unknown as MenuItem, done: true };
      },
    };
  }
}
```

Client:
```ts
for (const item of dinerMenu) { ... }   // for...of
const all = [...dinerMenu];             // spread
const [first, ...rest] = dinerMenu;     // destructuring
```

### Mapping: our custom version ↔ the built-in

| Learning version (Java-style) | Built-in TypeScript |
|---|---|
| `interface Iterator<T> { hasNext; next }` | `Iterator<T>` with `next(): { value, done }` |
| `hasNext()` | the `done` flag from `next()` |
| `createIterator()` (aggregate) | `[Symbol.iterator]()` (Iterable) |
| Client: `while (it.hasNext()) { it.next() }` | `for...of` loop |
| `Menu` interface | `Iterable<T>` interface |

### The takeaway

> **The Iterator pattern is a language convention in TypeScript/JavaScript. If
> you implement `[Symbol.iterator]()` (the "createIterator"), your object becomes
> `Iterable`, and the built-in `for...of`, spread (`...`), and destructuring all
> work with it. The pattern is so fundamental it's baked into the syntax — you
> use it every time you write `for (const x of list)`.**

---

_Status: Lectures 6.1 & 6.2 documented + TS implementation (custom Iterator)
and the built-in Iterable protocol documented. Next: the challenge and
solution videos, then optionally a native `Iterable` demo file._
