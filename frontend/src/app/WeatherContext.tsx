"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { TemperatureUnit, WeatherContextType, WeatherResponse } from "@/types";
import { fetchWeatherByCity } from "@/services/api";


const WeatherContext = createContext<WeatherContextType>({
  weatherData: null,
  isLoading: false,
  error: null,
  city: "",
  setCity: () => {},
  searchCity: async () => {},
  unit: "metric",
  toggleUnit: () => {},
});

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const [unit, setUnit] = useState<TemperatureUnit>("metric");

  // search for weather data by city
  const searchCity = useCallback(
    async (cityName: string) => {
      if (!cityName.trim()) {
        setError("Please enter a city name");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherByCity(cityName, unit);
        setWeatherData(data);
        setCity(data.location.city);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data"
        );
        console.error("Error fetching weather data:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [unit]
  );

  // Toggle between metric and imperial units
  const toggleUnit = useCallback(() => {
    const newUnit: TemperatureUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);

    // Refresh weather data with new unit if we have a city
    if (city) {
      searchCity(city);
    }
  }, [unit, city, searchCity]);

  const value = {
    weatherData,
    isLoading,
    error,
    city,
    setCity,
    searchCity,
    unit,
    toggleUnit,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
