export interface Location {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  description: string;
  icon: string;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  timestampUTC: number;
  formattedDate: string;
  formattedSunrise: string;
  formattedSunset: string;
}

export interface Forecast {
  date: string;
  formattedDate: string;
  dayOfWeek: string;
  temperature: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  precipProbability?: number;
}

export interface WeatherResponse {
  current: CurrentWeather;
  forecast: Forecast[];
  location: Location;
}

export interface GeocodingResult {
  results: Location[];
}

export type TemperatureUnit = "metric" | "imperial";

export interface WeatherContextType {
  weatherData: WeatherResponse | null;
  isLoading: boolean;
  error: string | null;
  city: string;
  setCity: (city: string) => void;
  searchCity: (city: string) => Promise<void>;
  unit: TemperatureUnit;
  toggleUnit: () => void;
}
