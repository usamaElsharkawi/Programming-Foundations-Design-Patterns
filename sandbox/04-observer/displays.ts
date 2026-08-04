/**
 * displays.ts — The ConcreteObservers
 *
 * Each display:
 *   - implements Observer (reacts to changes via update())
 *   - implements DisplayElement (knows how to display itself via display())
 *   - registers itself with the subject in its constructor
 *
 * Each display does its OWN business inside update() — the subject never
 * knows what any display does. That's loose coupling.
 */
import type { Observer, DisplayElement, Subject } from "./interfaces.js";

/**
 * Shows the current temperature and humidity.
 */
export class CurrentConditionsDisplay implements Observer, DisplayElement {
  private temperature = 0;
  private humidity = 0;

  constructor(weatherData: Subject) {
    weatherData.registerObserver(this);  // ← self-subscribes on construction
  }

  update(temp: number, humidity: number, _pressure: number): void {
    this.temperature = temp;
    this.humidity = humidity;
    this.display();
  }

  display(): void {
    console.log(
      `Current conditions: ${this.temperature}F degrees and ${this.humidity}% humidity`,
    );
  }
}

/**
 * Tracks and shows avg / max / min temperature over time.
 */
export class StatisticsDisplay implements Observer, DisplayElement {
  private maxTemp = 0.0;
  private minTemp = 200.0;
  private tempSum = 0.0;
  private numReadings = 0;

  constructor(weatherData: Subject) {
    weatherData.registerObserver(this);
  }

  update(temp: number, _humidity: number, _pressure: number): void {
    this.tempSum += temp;
    this.numReadings++;

    if (temp > this.maxTemp) this.maxTemp = temp;
    if (temp < this.minTemp) this.minTemp = temp;

    this.display();
  }

  display(): void {
    console.log(
      `Avg/Max/Min temperature = ${this.tempSum / this.numReadings}/${this.maxTemp}/${this.minTemp}`,
    );
  }
}

/**
 * Predicts the forecast based on pressure changes.
 */
export class ForecastDisplay implements Observer, DisplayElement {
  private currentPressure = 29.92;
  private lastPressure = 0;

  constructor(weatherData: Subject) {
    weatherData.registerObserver(this);
  }

  update(_temp: number, _humidity: number, pressure: number): void {
    this.lastPressure = this.currentPressure;
    this.currentPressure = pressure;
    this.display();
  }

  display(): void {
    process.stdout.write("Forecast: ");
    if (this.currentPressure > this.lastPressure) {
      console.log("Improving weather on the way!");
    } else if (this.currentPressure === this.lastPressure) {
      console.log("More of the same");
    } else if (this.currentPressure < this.lastPressure) {
      console.log("Watch out for cooler, rainy weather");
    }
  }
}

/**
 * Computes and displays the heat index (a derived value from temp + humidity).
 * This demonstrates that observers can COMPUTE their own data — the subject
 * just pushes raw values; what the observer does with them is its own business.
 */
export class HeatIndexDisplay implements Observer, DisplayElement {
  private heatIndex = 0.0;

  constructor(weatherData: Subject) {
    weatherData.registerObserver(this);
  }

  update(t: number, rh: number, _pressure: number): void {
    this.heatIndex = this.computeHeatIndex(t, rh);
    this.display();
  }

  private computeHeatIndex(t: number, rh: number): number {
    const index =
      16.923 +
      0.185212 * t +
      5.37941 * rh -
      0.100254 * t * rh +
      0.00941695 * t * t +
      0.00728898 * rh * rh +
      0.000345372 * t * t * rh -
      0.000814971 * t * rh * rh +
      0.0000102102 * t * t * rh * rh -
      0.000038646 * t * t * t +
      0.0000291583 * rh * rh * rh +
      0.00000142721 * t * t * t * rh +
      0.000000197483 * t * rh * rh * rh -
      0.0000000218429 * t * t * t * rh * rh +
      0.000000000843296 * t * t * rh * rh * rh -
      0.0000000000481975 * t * t * t * rh * rh * rh;
    return index;
  }

  display(): void {
    console.log(`Heat index is ${this.heatIndex}`);
  }
}
