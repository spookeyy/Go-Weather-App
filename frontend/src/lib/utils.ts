import { TemperatureUnit } from "@/types";

// format temperature with appropriate unit
//parameter temp, this is the temperature value
// parameter unit, this is the temperature unit
// return formatted temperature string

export function formatTemperature(temp: number, unit: TemperatureUnit): string {
    const rounded = Math.round(temp);
    return `${rounded}°${unit === "metric" ? "C" : "F"}`;
}

// format wind speed with the appropriate unit
// parameter speed, this is the wind speed value
// parameter unit, this is the temperature unit
// return formatted windspeed string

export function formatWindSpeed(speed: number, unit: TemperatureUnit): string {
    return unit === 'metric' ? `${speed} m/s` : `${speed} mph`;
}

/** 
* get wind direction as a compass point from degrees
* @param degrees Wind direction in degrees
* @returns Cardinal direction (N, NE, E, SE, S, SW, W, NW)
* */
export function getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'E', 'ENE', 'SE', 'ESE', 'S', 'SSE', 'SW', 'SSW', 'WSW', 'W', 'NW', 'NNW', ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

/**
 * * format humidity as a percentage
 * @param humidity - humidity value
 * @returns formatted humidity string
 */

export function formatHumidity(humidity: number): string{
    return `${humidity}%`;
}

/**
 * Get the URL for a weather icon
 * @param iconCode OpenWeatherMap icon code
 * @returns URL for the icon
 */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Capitalize the first letter of each word
 * @param text Text to capitalize
 * @returns Capitalized text
 */
export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format precipitation probability as a percentage
 * @param probability Precipitation probability (0-1)
 * @returns Formatted percentage
 */
export function formatPrecipitation(probability?: number): string {
  if (probability === undefined) return 'N/A';
  return `${Math.round(probability * 100)}%`;
}

/**
 * Format visibility in kilometers or miles
 * @param visibility Visibility in meters
 * @param unit Temperature unit (metric)
 * @returns Formatted visibility
 */
export function formatVisibility(visibility: number, unit: TemperatureUnit): string {
  if (unit === 'metric') {
    return `${(visibility / 1000).toFixed(1)} km`;
  } else {
    return `${(visibility / 1609.34).toFixed(1)} mi`;
  }
}

/**
 * Check if it's currently daytime at the location
 * @param current Current UTC timestamp
 * @param sunrise Sunrise UTC timestamp
 * @param sunset Sunset UTC timestamp
 * @returns True if it's daytime
 */
export function isDaytime(current: number, sunrise: number, sunset: number): boolean {
  return current >= sunrise && current <= sunset;
}

/**
 * Get background gradient class based on weather description
 * @param weatherDescription Weather description
 * @param isDaytime Whether it's daytime
 * @returns CSS class name for background
 */
export function getWeatherBackground(weatherDescription: string, isDaytime: boolean): string {
  const description = weatherDescription.toLowerCase();
  
  if (description.includes('clear')) {
    return isDaytime ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-blue-900 to-indigo-950';
  } else if (description.includes('cloud')) {
    return isDaytime ? 'bg-gradient-to-br from-blue-200 to-blue-400' : 'bg-gradient-to-br from-slate-700 to-slate-900';
  } else if (description.includes('rain') || description.includes('drizzle')) {
    return isDaytime ? 'bg-gradient-to-br from-slate-400 to-slate-600' : 'bg-gradient-to-br from-slate-800 to-slate-950';
  } else if (description.includes('snow')) {
    return isDaytime ? 'bg-gradient-to-br from-slate-200 to-slate-400' : 'bg-gradient-to-br from-slate-600 to-slate-800';
  } else if (description.includes('thunder')) {
    return 'bg-gradient-to-br from-slate-600 to-slate-900';
  } else if (description.includes('mist') || description.includes('fog')) {
    return isDaytime ? 'bg-gradient-to-br from-slate-300 to-slate-500' : 'bg-gradient-to-br from-slate-700 to-slate-900';
  } else {
    return isDaytime ? 'bg-gradient-to-br from-blue-300 to-blue-500' : 'bg-gradient-to-br from-slate-800 to-slate-950';
  }
}