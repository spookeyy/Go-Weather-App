import {
  WiDaySunny,
  WiStrongWind,
  WiHumidity,
  WiRain,
  WiCloudy,
  WiDayCloudyHigh,
  WiNightClear,
  WiDayHaze,
  WiSnow,
  WiThunderstorm,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";
import type { WeatherResponse } from "@/types";

type Props = {
  weatherData: WeatherResponse;
};

export default function WeatherDisplay({ weatherData }: Props) {
  const { current, location, forecast } = weatherData;
  console.log("current ", current)
  // Function to get weather icon based on condition
  const getWeatherIcon = (condition: string, size = 48) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("clear")) return <WiDaySunny size={size} />;
    if (conditionLower.includes("rain")) return <WiRain size={size} />;
    if (conditionLower.includes("cloud")) return <WiCloudy size={size} />;
    if (conditionLower.includes("partly cloudy"))
      return <WiDayCloudyHigh size={size} />;
    if (conditionLower.includes("haze") || conditionLower.includes("mist"))
      return <WiDayHaze size={size} />;
    if (conditionLower.includes("snow")) return <WiSnow size={size} />;
    if (conditionLower.includes("thunder"))
      return <WiThunderstorm size={size} />;
    return <WiNightClear size={size} />;
  };

  // Format date as "21st April 2024"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Add ordinal suffix to day
    const ordinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${ordinal(day)} ${month} ${year}`;
  };

  return (
    <div className="rounded-3xl p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-2xl w-full max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex flex-col items-center mb-8">
        <div className="text-5xl mb-4">
          {getWeatherIcon(current.description)}
        </div>
        <div className="text-6xl font-light mb-2">{current.temperature}°C</div>

        <div className="text-xl font-light mb-6 capitalize">
          {current.description}
        </div>

        <div className="text-lg text-center">
          <div>{formatDate(current.formattedDate)}</div>
          <div className="font-semibold">{location.city}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        {forecast.slice(0, 3).map((day, index) => (
          <div key={index} className="bg-slate-700/30 rounded-xl p-3">
            <div className="text-sm font-medium mb-1">
              {new Date(day.date).toLocaleDateString("en", {
                weekday: "short",
              })}
            </div>
            <div className="text-xs text-slate-300 mb-2">
              {new Date(day.date).toLocaleDateString("en", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="flex justify-center mb-1">
              {getWeatherIcon(day.description, 32)}
            </div>
            <div className="text-lg font-semibold">
              {day.tempMax}° / {day.tempMin}°
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <WiStrongWind size={28} />
          </div>
          <div className="text-sm text-slate-300 mb-1">Wind</div>
          <div className="text-lg font-semibold">{current.windSpeed} km/h</div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <WiHumidity size={28} />
          </div>
          <div className="text-sm text-slate-300 mb-1">Humidity</div>
          <div className="text-lg font-semibold mb-1">{current.humidity}%</div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-blue-400 h-2 rounded-full"
              style={{ width: `${current.humidity}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-slate-700/30 rounded-xl p-3 text-center">
          <div className="text-slate-300 mb-1">Feels Like</div>
          <div className="font-semibold">{current.feelsLike}°C</div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-3 text-center">
          <div className="text-slate-300 mb-1">Pressure</div>
          <div className="font-semibold">{current.pressure} hPa</div>
        </div>
        <div className="bg-slate-700/30 rounded-xl p-3 text-center">
          <div className="text-slate-300 mb-1">Visibility</div>
          <div className="font-semibold">{current.visibility / 1000} km</div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-slate-400">
        <p>Last updated: {current.formattedDate}</p>
        <p className="flex items-center justify-center gap-4 mt-2">
          <span className="flex items-center gap-1">
            <WiSunrise size={20} /> {current.formattedSunrise}
          </span>
          <span className="flex items-center gap-1">
            <WiSunset size={20} /> {current.formattedSunset}
          </span>
        </p>
      </div>
    </div>
  );
}
