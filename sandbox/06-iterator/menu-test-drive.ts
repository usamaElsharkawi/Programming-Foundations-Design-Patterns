/**
 * menu-test-drive.ts — The test/entry point
 *
 * Builds the two menus, hands them to the Waitress, and prints.
 * The Waitress treats both menus identically (via the Iterator interface) —
 * one is array-backed, the other is list-backed, and she never notices.
 */
import { PancakeHouseMenu } from "./pancake-house-menu.js";
import { DinerMenu } from "./diner-menu.js";
import { Waitress } from "./waitress.js";

const pancakeHouseMenu = new PancakeHouseMenu();
const dinerMenu = new DinerMenu();

const waitress = new Waitress(pancakeHouseMenu, dinerMenu);

console.log("=== Full Menu ===\n");
waitress.printMenu();

console.log("\n=== Vegetarian Menu ===\n");
waitress.printVegetarianMenu();
