/**
 * diner-menu.ts — The DinerMenu (array-backed) + its iterator
 *
 * DinerMenu stores its items in a FIXED-SIZE array (MAX_ITEMS = 6), guarded by
 * a separate count. This mirrors the Java menu that uses a raw array.
 *
 * DinerMenuIterator KNOWS it's iterating an array: hasNext() checks the
 * current slot isn't empty, next() indexes with brackets. This is the
 * collection-specific logic that lives in the iterator (not the client).
 */
import { MenuItem } from "./menu-item.js";
import type { Iterator, Menu } from "./interfaces.js";

/**
 * ConcreteIterator over an ARRAY. Positions via bracket indexing.
 */
export class DinerMenuIterator implements Iterator<MenuItem> {
  private position = 0;

  constructor(private items: MenuItem[]) {}

  hasNext(): boolean {
    // hasNext() for an array: in range AND the slot is filled.
    // (`!` not needed here — comparing with != null is fine.)
    return (
      this.position < this.items.length &&
      this.items[this.position] != null
    );
  }

  next(): MenuItem {
    // Non-null assertion: hasNext() guaranteed the slot is filled.
    const item = this.items[this.position]!;
    this.position += 1;
    return item;
  }
}

/**
 * ConcreteAggregate: the Diner's menu, array-backed.
 */
export class DinerMenu implements Menu {
  private static readonly MAX_ITEMS = 6;
  private menuItems: MenuItem[] = [];
  private numberOfItems = 0;

  constructor() {
    this.addItem(
      "Vegetarian BLT",
      "(Fakin') Bacon with lettuce & tomato on whole wheat",
      true,
      2.99,
    );
    this.addItem(
      "BLT",
      "Bacon with lettuce & tomato on whole wheat",
      false,
      2.99,
    );
    this.addItem(
      "Soup of the day",
      "Soup of the day, with a side of potato salad",
      false,
      3.29,
    );
    this.addItem(
      "Hotdog",
      "A hot dog, with saurkraut, relish, onions, topped with cheese",
      false,
      3.05,
    );
    this.addItem(
      "Steamed Veggies and Brown Rice",
      "Steamed vegetables over brown rice",
      true,
      3.99,
    );
    this.addItem(
      "Pasta",
      "Spaghetti with Marinara Sauce, and a slice of sourdough bread",
      true,
      3.89,
    );
  }

  addItem(
    name: string,
    description: string,
    vegetarian: boolean,
    price: number,
  ): void {
    if (this.numberOfItems >= DinerMenu.MAX_ITEMS) {
      console.error("Sorry, menu is full!  Can't add item to menu");
    } else {
      this.menuItems[this.numberOfItems] = new MenuItem(
        name,
        description,
        vegetarian,
        price,
      );
      this.numberOfItems += 1;
    }
  }

  /** The aggregate provides an iterator over itself. */
  createIterator(): Iterator<MenuItem> {
    return new DinerMenuIterator(this.menuItems);
  }
}
