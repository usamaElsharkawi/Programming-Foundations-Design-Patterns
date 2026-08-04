/**
 * weather-station.ts — The Client
 *
 * This is the "main" of the Java code. It:
 *   1. Creates the subject (WeatherData)
 *   2. Creates the observers (displays), passing the subject so they
 *      self-register in their constructors
 *   3. Calls setMeasurements() to simulate new data arriving — each call
 *      triggers notifyObservers(), which pushes to all displays
 *
 * Notice: the station code never calls display() directly. The displays
 * display themselves when update() is called. The station just feeds data
 * to the subject.
 */
import { WeatherData } from "./weather-data.js";
import {
  CurrentConditionsDisplay,
  StatisticsDisplay,
  ForecastDisplay,
  HeatIndexDisplay,
} from "./displays.js";

console.log("=== Weather Station (with Heat Index) ===\n");

const weatherData = new WeatherData();

// Each display self-registers in its constructor:
const currentDisplay = new CurrentConditionsDisplay(weatherData);
const statisticsDisplay = new StatisticsDisplay(weatherData);
const forecastDisplay = new ForecastDisplay(weatherData);
const heatIndexDisplay = new HeatIndexDisplay(weatherData);

// Each setMeasurements() call → notifyObservers() → all 4 displays update:
console.log("--- Measurement 1: 80°F, 65%, 30.4 ---");
weatherData.setMeasurements(80, 65, 30.4);

console.log("\n--- Measurement 2: 82°F, 70%, 29.2 ---");
weatherData.setMeasurements(82, 70, 29.2);

console.log("\n--- Measurement 3: 78°F, 90%, 29.2 ---");
weatherData.setMeasurements(78, 90, 29.2);

// Demonstrate dynamic unsubscribe at runtime:
console.log("\n--- Removing ForecastDisplay, then new measurement ---");
weatherData.removeObserver(forecastDisplay);
weatherData.setMeasurements(75, 80, 29.5);

// Demonstrate dynamic subscribe at runtime:
console.log("\n--- Re-adding ForecastDisplay, then new measurement ---");
weatherData.registerObserver(forecastDisplay);
weatherData.setMeasurements(70, 75, 30.1);

// Suppress unused-variable warnings (the displays auto-register in their
// constructors; we keep references only to be able to remove/re-add later):
void currentDisplay;
void statisticsDisplay;
void heatIndexDisplay;
