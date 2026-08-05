/**
 * menu-item.ts — The element we iterate over.
 *
 * A simple data class: a menu item with a name, description, whether it's
 * vegetarian, and a price. Getters expose the data; toString() formats it.
 */
export class MenuItem {
  constructor(
    private name: string,
    private description: string,
    private vegetarian: boolean,
    private price: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  isVegetarian(): boolean {
    return this.vegetarian;
  }

  toString(): string {
    return `${this.name}, $${this.price}\n   ${this.description}`;
  }
}
