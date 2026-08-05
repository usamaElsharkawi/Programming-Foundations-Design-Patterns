/**
 * pancake-house-menu.ts — The PancakeHouseMenu (ArrayList-backed) + its iterator
 *
 * PancakeHouseMenu stores items in a GROWABLE array via push(). This mirrors
 * the Java menu that uses an ArrayList. It is the second, different structure.
 *
 * PancakeHouseMenuIterator KNOWS it's iterating a growable list: hasNext()
 * checks the position against the length, next() reads via index and advances.
 * The iteration logic differs from DinerMenuIterator — which is exactly why
 * it's encapsulated in each iterator rather than in the client.
 */
import { MenuItem } from "./menu-item.js";
import type { Iterator, Menu } from "./interfaces.js";

/**
 * ConcreteIterator over a growable list. Positions via `.length` + index.
 */
export class PancakeHouseMenuIterator implements Iterator<MenuItem> {
  private position = 0;

  constructor(private items: MenuItem[]) {}

  hasNext(): boolean {
    return this.position < this.items.length;
  }

  next(): MenuItem {
    // In range because hasNext() was true.
    return this.items[this.position++]!;
  }
}

/**
 * ConcreteAggregate: the Pancake House menu, growable-list-backed.
 */
export class PancakeHouseMenu implements Menu {
  private menuItems: MenuItem[] = [];

  constructor() {
    this.addItem(
      "K&B's Pancake Breakfast",
      "Pancakes with scrambled eggs, and toast",
      true,
      2.99,
    );
    this.addItem(
      "Regular Pancake Breakfast",
      "Pancakes with fried eggs, sausage",
      false,
      2.99,
    );
    this.addItem(
      "Blueberry Pancakes",
      "Pancakes made with fresh blueberries",
      true,
      3.49,
    );
    this.addItem(
      "Waffles",
      "Waffles, with your choice of blueberries or strawberries",
      true,
      3.59,
    );
  }

  addItem(
    name: string,
    description: string,
    vegetarian: boolean,
    price: number,
  ): void {
    this.menuItems.push(new MenuItem(name, description, vegetarian, price));
  }

  /** The aggregate provides an iterator over itself. */
  createIterator(): Iterator<MenuItem> {
    return new PancakeHouseMenuIterator(this.menuItems);
  }
}
