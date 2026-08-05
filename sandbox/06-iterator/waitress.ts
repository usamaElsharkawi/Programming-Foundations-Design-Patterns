/**
 * waitress.ts — The CLIENT
 *
 * The Waitress is the "cafe" that prints menus. She depends ONLY on the two
 * interfaces — `Menu` and `Iterator<MenuItem>` — never on a concrete menu.
 *
 * Notice the payoff of the Iterator pattern: `printMenuItems(iterator)` works
 * for BOTH the array-backed DinerMenu and the list-backed PancakeHouseMenu,
 * because it only uses hasNext()/next(). She never knows (or cares) how a menu
 * is stored internally.
 */
import type { Menu, Iterator } from "./interfaces.js";
import type { MenuItem } from "./menu-item.js";

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

  // ONE method that prints ANY menu — the core Iterator benefit.
  // It uses only the Iterator interface (hasNext/next), so it's collection-agnostic.
  private printMenuItems(iterator: Iterator<MenuItem>): void {
    while (iterator.hasNext()) {
      const menuItem = iterator.next();
      console.log(
        `${menuItem.getName()}, ${menuItem.getPrice()} -- ${menuItem.getDescription()}`,
      );
    }
  }

  printVegetarianMenu(): void {
    console.log("\nVEGETARIAN MENU\n----");
    this.printVegetarianMenuItems(this.pancakeHouseMenu.createIterator());
    this.printVegetarianMenuItems(this.dinerMenu.createIterator());
  }

  private printVegetarianMenuItems(iterator: Iterator<MenuItem>): void {
    while (iterator.hasNext()) {
      const menuItem = iterator.next();
      if (menuItem.isVegetarian()) {
        console.log(
          `${menuItem.getName()}\t\t${menuItem.getPrice()}\n\t${menuItem.getDescription()}`,
        );
      }
    }
  }
}
