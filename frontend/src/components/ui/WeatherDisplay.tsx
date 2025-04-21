import {
  WiThermometer,
  WiStrongWind,
  WiHumidity,
  WiBarometer,
  WiDaySunny,
  WiSunrise,
  WiSunset,
  WiFog,
} from "react-icons/wi";
import type { WeatherResponse } from "@/types";

type Props = {
  weatherData: WeatherResponse;
};

export default function WeatherDisplay({ weatherData }: Props) {
  const { current, location } = weatherData;

  return (
    <div className="mt-8 rounded-3xl p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-2xl max-w-4xl mx-auto animate-fade-in-up">
      <h2 className="text-4xl font-bold text-center mb-2">
        {location.city}, {location.country}
      </h2>
      <p className="text-center text-xl font-light text-slate-300 mb-6 capitalize">
        {current.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-base">
        <WeatherCard
          icon={<WiThermometer size={32} />}
          label="Temperature"
          value={`${current.temperature}°C`}
        />
        <WeatherCard
          icon={<WiDaySunny size={32} />}
          label="Feels Like"
          value={`${current.feelsLike}°C`}
        />
        <WeatherCard
          icon={<WiHumidity size={32} />}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <WeatherCard
          icon={<WiStrongWind size={32} />}
          label="Wind"
          value={`${current.windSpeed} m/s`}
        />
        <WeatherCard
          icon={<WiBarometer size={32} />}
          label="Pressure"
          value={`${current.pressure} hPa`}
        />
        <WeatherCard
          icon={<WiFog size={32} />}
          label="Visibility"
          value={`${current.visibility / 1000} km`}
        />
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

function WeatherCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/60 backdrop-blur-md shadow-md">
      <div className="text-primary-300">{icon}</div>
      <div>
        <div className="text-sm text-slate-400">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}
