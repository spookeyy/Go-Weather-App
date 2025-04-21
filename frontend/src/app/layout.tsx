import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { WeatherProvider } from "./WeatherContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather App",
  description:
    "Modern weather application with current conditions and forecasts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WeatherProvider>{children}</WeatherProvider>
      </body>
    </html>
  );
}
