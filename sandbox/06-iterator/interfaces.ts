/**
 * interfaces.ts — The two pattern contracts
 *
 *   Iterator<T>  → the ITERATOR interface (hasNext / next)
 *   Menu         → the AGGREGATE interface (createIterator)
 *
 * The client depends ONLY on these two interfaces — never on the concrete
 * menus or concrete iterators. That's the loose coupling of the pattern.
 */
import type { MenuItem } from "./menu-item.js";

/**
 * ITERATOR — the iteration contract.
 * hasNext() asks "is there another item?"; next() returns it and advances.
 * This is deliberately simple (not JS's built-in `Iterator` protocol, which
 * returns { value, done }). It mirrors the course's Java `Iterator`.
 */
export interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
}

/**
 * AGGREGATE — the collection contract.
 * Any menu can hand back an Iterator over its own elements.
 * (This is the pattern's "createIterator()" — Java calls it `Iterable`'s
 * `iterator()`, TypeScript calls it `[Symbol.iterator]()`.)
 */
export interface Menu {
  createIterator(): Iterator<MenuItem>;
}
