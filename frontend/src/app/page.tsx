"use client";

import { useEffect } from "react";
import { useWeather } from "./WeatherContext";
import SearchBar from "../components/ui/SearchBar";
import WeatherDisplay from "../components/ui/WeatherDisplay";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function Home() {
  const { weatherData, isLoading, error, city, setCity, searchCity } =
    useWeather();

  useEffect(() => {
    if (!weatherData && !isLoading && !error) {
      const defaultCity = "London";
      setCity(defaultCity);
      searchCity(defaultCity);
    }
  }, [weatherData, isLoading, error, searchCity, setCity]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8 lg:p-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">
        Weather Forecast App
      </h1>

      <div className="w-full max-w-5xl mx-auto">
        <SearchBar city={city} setCity={setCity} onSearch={searchCity} />

        {isLoading && <Loader />}

        {error && <ErrorMessage message={error} />}

        {weatherData && !isLoading && !error && (
          <WeatherDisplay weatherData={weatherData} />
        )}
      </div>

      <footer className="mt-auto pt-8 pb-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>Weather data provided by OpenWeatherMap API</p>
      </footer>
    </main>
  );
}
