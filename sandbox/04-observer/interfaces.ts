/**
 * interfaces.ts — The Observer pattern contracts
 *
 * Three interfaces define the pattern:
 *   - Subject       : what any observable must do (manage + notify observers)
 *   - Observer      : what any observer must do (react to updates)
 *   - DisplayElement : a separate concern — anything that can display itself
 *
 * The course uses the PUSH model: update() receives the data directly.
 */

/**
 * SUBJECT — the "publisher" contract.
 * Any class that wants to be observed must implement this.
 */
export interface Subject {
  registerObserver(o: Observer): void;
  removeObserver(o: Observer): void;
  notifyObservers(): void;
}

/**
 * OBSERVER — the "subscriber" contract.
 * Any class that wants to react to changes must implement this.
 *
 * The course uses the PUSH model — the subject passes the new data directly
 * into update(). (Contrast with the PULL model where update() takes no args
 * and the observer calls subject.getState() to pull what it needs.)
 */
export interface Observer {
  update(temp: number, humidity: number, pressure: number): void;
}

/**
 * DISPLAY ELEMENT — a separate responsibility ("display yourself").
 * The displays implement BOTH Observer and DisplayElement — they react to
 * changes AND know how to display themselves. This keeps the display concern
 * decoupled from the observer concern.
 */
export interface DisplayElement {
  display(): void;
}
