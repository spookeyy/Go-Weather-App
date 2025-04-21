"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { useWeather } from "@/app/WeatherContext";
import { motion } from "framer-motion";

interface SearchBarProps {
  city: string;
  setCity: (city: string) => void;
  onSearch: (city: string) => Promise<void>;
}

export default function SearchBar({ city, setCity, onSearch }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState(city);
  const { unit, toggleUnit } = useWeather();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch gap-4"
      >
        <div className="relative flex-grow">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-700" />
          <input
            type="text"
            value={searchInput}
            onChange={handleChange}
            placeholder="Search for a city..."
            aria-label="City name"
            className="w-full py-3 pl-12 pr-4 rounded-2xl bg-white/10 text-white backdrop-blur-md shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-200 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!searchInput.trim()}
            className="bg-primary-500 dark:bg-primary-600 text-gray-800 dark:text-white font-semibold px-5 py-3 rounded-2xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Search
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={toggleUnit}
            aria-label="Toggle temperature unit"
            className="bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all shadow-md"
          >
            {unit === "metric" ? "°C" : "°F"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
