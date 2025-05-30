import { GeocodingResult, TemperatureUnit, WeatherResponse } from '@/types';
// const API_URL = process.env.API_URL || 'http://localhost:5000/api';
// Only needed if this runs outside Next.js (like CLI)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

console.log("API_URL:", API_URL);


/** fetching weather data for a city
// @param city, The sity name to get weather for
// @param unit, The unit system to use for temperature
// @returns weather data including current weather and forecast
*/

export async function fetchWeatherByCity(city: string, unit: TemperatureUnit): Promise<WeatherResponse> {
    try {
        console.log("API_URL:", API_URL);
    //   const unitParam = unit.toString().toLowerCase(); // Convert unit to lowercase string
      const response = await fetch(
        `${API_URL}/weather?city=${encodeURIComponent(city)}&units=${unit}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`API error: ${errorData.error}`);
        throw new Error(
          errorData.error ||
            "Failed to fetch weather data: " + response.statusText
        );
      }

      return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

/** Geocode of a city name to get coordinates
// @param city, The city name to geocode
// @returns Array of location results with coordinates
*/

export async function geocodeCity(city: string): Promise<GeocodingResult> {
    try {
        const response = await fetch(`${API_URL}/geocode?city=${encodeURIComponent(city)}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`API error: ${errorData.error}`);
            throw new Error(errorData.error || `Failed to geocode city: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error geocoding city:`, error);
        throw error;
    }
}