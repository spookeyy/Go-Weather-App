import { GeocodingResult, TemperatureUnit, WeatherResponse } from '@/types';

// const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const API_URL = process.env.API_URL || "https://go-weather-app-51r0.onrender.com/api";

// fetching weather data for a city
// parameter city, The sity name to get weather for
// parameter unit, The unit system to use for temperature
// return weather data including current weather and forecast

export async function fetchWeatherByCity(city: string, unit: TemperatureUnit): Promise<WeatherResponse> {
    try {
        const response = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}&units=${unit}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch weather data: ' + response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Geocode of a city name to get coordinates
// parameter city, The city name to geocode
// return Array of location results with coordinates

export async function geocodeCity(city: string): Promise<GeocodingResult> {
    try {
        const response = await fetch(`${API_URL}/geocode?city=${encodeURIComponent(city)}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to geocode city: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error geocoding city:`, error);
        throw error;
    }
}