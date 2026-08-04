/**
 * weather-data.ts — The ConcreteSubject
 *
 * WeatherData is the "single source of truth" — it OWNS the weather data
 * (temperature, humidity, pressure) and maintains a list of observers.
 *
 * When setMeasurements() is called:
 *   1. the new data is stored
 *   2. measurementsChanged() is called
 *   3. which calls notifyObservers()
 *   4. which loops over the observer list and calls update() on each
 *
 * WeatherData never knows what the observers DO with the data — it just
 * pushes it to them. That's loose coupling.
 */
import type { Subject, Observer } from "./interfaces.js";

export class WeatherData implements Subject {
  private observers: Observer[] = [];
  private temperature = 0;
  private humidity = 0;
  private pressure = 0;

  // --- Subject interface ---

  registerObserver(o: Observer): void {
    this.observers.push(o);
  }

  removeObserver(o: Observer): void {
    const i = this.observers.indexOf(o);
    if (i >= 0) {
      this.observers.splice(i, 1);
    }
  }

  notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.temperature, this.humidity, this.pressure);
    }
  }

  // --- The trigger ---

  measurementsChanged(): void {
    this.notifyObservers();
  }

  // --- State management (the "single source of truth") ---

  setMeasurements(temperature: number, humidity: number, pressure: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.measurementsChanged();
  }

  // --- Getters (for the PULL model, if needed) ---

  getTemperature(): number {
    return this.temperature;
  }

  getHumidity(): number {
    return this.humidity;
  }

  getPressure(): number {
    return this.pressure;
  }
}
