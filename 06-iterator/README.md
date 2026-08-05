# Section 6 — The Iterator Pattern

> _Documented after our discussion of lecture 6.1 (Encapsulating iteration)._

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

_Status: Lecture 6.1 documented. Next: **lecture 6.2 (Understanding the
Iterator pattern — formal definition + class diagram)**._
