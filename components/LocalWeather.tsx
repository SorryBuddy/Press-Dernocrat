"use client";

import { useEffect, useState } from "react";

type WeatherState = {
  tempF: number;
  weatherCode: number;
  loading: boolean;
  usingFallbackLocation: boolean;
};

const SONOMA_LAT = 38.4404;
const SONOMA_LON = -122.7141;

function ordinalDay(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function formatHeaderDate(date: Date): string {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
  const year = date.getFullYear();
  return `${weekday}, ${month} ${ordinalDay(date.getDate())}, ${year}`;
}

function weatherDescription(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Weather";
}

async function fetchWeather(lat: number, lon: number): Promise<{ tempF: number; weatherCode: number }> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("temperature_unit", "fahrenheit");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Weather fetch failed");

  const data = (await res.json()) as {
    current?: { temperature_2m?: number; weather_code?: number };
  };

  const tempF = Math.round(data.current?.temperature_2m ?? 0);
  const weatherCode = data.current?.weather_code ?? 0;
  return { tempF, weatherCode };
}

function getCoords(): Promise<{ lat: number; lon: number; fallback: boolean }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: SONOMA_LAT, lon: SONOMA_LON, fallback: true });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          fallback: false,
        }),
      () => resolve({ lat: SONOMA_LAT, lon: SONOMA_LON, fallback: true }),
      { timeout: 8000, maximumAge: 600_000 },
    );
  });
}

function WeatherIcon({ code }: { code: number }) {
  const isClear = code === 0;
  const isPartlyCloudy = code >= 1 && code <= 3;
  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isStorm = code >= 95;

  if (isStorm) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden className="text-amber-500">
        <path
          fill="currentColor"
          d="M7 2v2h1l-2 4H5a3 3 0 0 0 0 6h1.5l-1 2H4a5 5 0 0 1 0-10h1l2-4H7zm10 0v2h-1l2 4h1a3 3 0 0 1 0 6h-1.5l1 2H20a5 5 0 0 0 0-10h-1l-2-4h-1zM11 13h2v5h-2v-5zm-1 7h4v2h-4v-2z"
        />
      </svg>
    );
  }

  if (isRain) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden className="text-sky-500">
        <path
          fill="currentColor"
          d="M6 14a6 6 0 0 1 11.31-2.65A4.5 4.5 0 1 1 20 18H6a4 4 0 0 1 0-8 2 2 0 0 1-2-2 2 2 0 0 1 2-2z"
        />
        <path fill="currentColor" d="M8 19l-1 3 1 1 1-3-1-1zm4 0l-1 3 1 1 1-3-1-1zm4 0l-1 3 1 1 1-3-1-1z" />
      </svg>
    );
  }

  if (isPartlyCloudy) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
        <circle cx="8" cy="9" r="4" fill="#f59e0b" />
        <path
          fill="#94a3b8"
          d="M6 14a6 6 0 0 1 11.31-2.65A4.5 4.5 0 1 1 20 18H6a4 4 0 0 1 0-8 2 2 0 0 1-2-2 2 2 0 0 1 2-2z"
        />
      </svg>
    );
  }

  if (isClear) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden className="text-amber-500">
        <circle cx="12" cy="12" r="5" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="1" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
        </g>
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden className="text-neutral-400">
      <path
        fill="currentColor"
        d="M6 14a6 6 0 0 1 11.31-2.65A4.5 4.5 0 1 1 20 18H6a4 4 0 0 1 0-8 2 2 0 0 1-2-2 2 2 0 0 1 2-2z"
      />
    </svg>
  );
}

type LocalWeatherProps = {
  /** Light text for dark casino / Risk Taking pages. */
  variant?: "default" | "dark";
};

export function LocalWeather({ variant = "default" }: LocalWeatherProps) {
  const isDark = variant === "dark";
  const [weather, setWeather] = useState<WeatherState>({
    tempF: 0,
    weatherCode: 0,
    loading: true,
    usingFallbackLocation: false,
  });
  const [dateLabel] = useState(() => formatHeaderDate(new Date()));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { lat, lon, fallback } = await getCoords();
        const { tempF, weatherCode } = await fetchWeather(lat, lon);
        if (!cancelled) {
          setWeather({ tempF, weatherCode, loading: false, usingFallbackLocation: fallback });
        }
      } catch {
        if (!cancelled) {
          setWeather((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const description = weatherDescription(weather.weatherCode);

  return (
    <div className="flex min-w-0 flex-col" aria-label="Local weather and date">
      <div className="flex items-center gap-2">
        <WeatherIcon code={weather.weatherCode} />
        <p
          className={`font-sans text-base font-semibold tabular-nums sm:text-lg ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          {weather.loading ? (
            <span className={isDark ? "text-white/50" : "text-neutral-400"}>—°F</span>
          ) : (
            <span>{weather.tempF}°F</span>
          )}
        </p>
        {!weather.loading && (
          <span
            className={`sr-only sm:not-sr-only sm:text-xs ${
              isDark ? "text-white/75" : "text-neutral-500"
            }`}
          >
            {description}
          </span>
        )}
      </div>
      <p
        className={`mt-0.5 max-w-[11rem] truncate font-sans text-[10px] leading-tight sm:max-w-none sm:text-[11px] sm:whitespace-normal ${
          isDark ? "text-white/80" : "text-neutral-600"
        }`}
      >
        {dateLabel}
      </p>
      {weather.usingFallbackLocation && !weather.loading && (
        <p className={`mt-0.5 font-sans text-[10px] ${isDark ? "text-white/60" : "text-neutral-400"}`}>
          Sonoma County (location unavailable)
        </p>
      )}
    </div>
  );
}
