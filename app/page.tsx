"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import EventCard from "./components/EventCard";
import BottomNavigation from "./components/BottomNavigation";
import { getEvents } from "./data/events";
import { useLanguage } from "./LanguageContext";

const T = {
  teal: "#149EAF",
  navy: "#102F56",
};

type QuickFilter =
  | ""
  | "near"
  | "today"
  | "weekend"
  | "free";

function parseEventDate(value?: string) {
  if (!value) return null;

  const trimmed = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(trimmed);

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed;
}

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isThisWeekend(date: Date) {
  const today = startOfDay(new Date());
  const day = today.getDay();

  const daysUntilSaturday =
    (6 - day + 7) % 7;

  const saturday = new Date(today);

  saturday.setDate(
    today.getDate() + daysUntilSaturday
  );

  const sunday = new Date(saturday);

  sunday.setDate(
    saturday.getDate() + 1
  );

  const eventDay = startOfDay(date);

  return (
    eventDay >= saturday &&
    eventDay <= sunday
  );
}

function getEventLocation(event: any) {
  return String(
    event.location ??
      event.town ??
      event.city ??
      event.venue ??
      ""
  ).trim();
}

function getEventCategory(event: any) {
  return String(
    event.category ?? ""
  ).trim();
}

function getEventPrice(event: any) {
  return String(
    event.price ?? ""
  ).trim();
}

function isFreeEvent(event: any) {
  const price =
    getEventPrice(event).toLowerCase();

  return (
    price === "" ||
    price === "free" ||
    price === "0" ||
    price === "€0" ||
    price === "0€"
  );
}

function getCoordinates(event: any) {
  const lat = Number(
    event.latitude ?? event.lat
  );

  const lng = Number(
    event.longitude ??
      event.lng ??
      event.lon
  );

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  return {
    lat,
    lng,
  };
}

function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadius = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

const categoryTranslations: Record<string, string> = {
  Music: "Música",
  Festival: "Festival",
  Market: "Mercado",
  "Food & Drink": "Comida e bebida",
  Sport: "Desporto",
  Family: "Família",
  "Arts & Culture": "Artes e cultura",
  Nightlife: "Vida noturna",
  Comedy: "Comédia",
  Theatre: "Teatro",
  Exhibitions: "Exposições",
  Workshop: "Workshop",
  Charity: "Caridade",
  Community: "Comunidade",
  Retreat: "Retiro",
};

export default function HomePage() {
  const { language } = useLanguage();
  const pt = language === "pt";

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

  const [quickFilter, setQuickFilter] =
    useState<QuickFilter>("");

  const [eventFilter, setEventFilter] =
    useState("");

  const [locationFilter, setLocationFilter] =
    useState("");

  const [userLocation, setUserLocation] =
    useState<{
      lat: number;
      lng: number;
    } | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();

        setEvents(data || []);
      } catch (error) {
        console.error(
          "Failed to load events:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const eventCategories = useMemo(() => {
    return Array.from(
      new Set(
        events
          .map(getEventCategory)
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [events]);

  const eventLocations = useMemo(() => {
    return Array.from(
      new Set(
        events
          .map(getEventLocation)
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [events]);

  function handleQuickFilter(
    filter: QuickFilter
  ) {
    setQuickFilter((current) =>
      current === filter ? "" : filter
    );

    if (filter === "near") {
      if (!navigator.geolocation) {
        alert(
          pt
            ? "A localização não está disponível neste dispositivo."
            : "Location is not available on this device."
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          alert(
            pt
              ? "Não foi possível aceder à sua localização. Verifique as permissões de localização."
              : "We couldn't access your location. Please check your location permissions."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  }

  const filteredEvents = useMemo(() => {
    const today = startOfDay(new Date());

    let result = [...events];

    if (eventFilter) {
      result = result.filter(
        (event) =>
          getEventCategory(event).toLowerCase() ===
          eventFilter.toLowerCase()
      );
    }

    if (locationFilter) {
      result = result.filter(
        (event) =>
          getEventLocation(event).toLowerCase() ===
          locationFilter.toLowerCase()
      );
    }

    if (quickFilter === "today") {
      result = result.filter((event) => {
        const date =
          parseEventDate(event.date);

        return date
          ? isSameDay(date, today)
          : false;
      });
    }

    if (quickFilter === "weekend") {
      result = result.filter((event) => {
        const date =
          parseEventDate(event.date);

        return date
          ? isThisWeekend(date)
          : false;
      });
    }

    if (quickFilter === "free") {
      result = result.filter(isFreeEvent);
    }

    if (
      quickFilter === "near" &&
      userLocation
    ) {
      result = result.filter((event) => {
        const coordinates =
          getCoordinates(event);

        if (!coordinates) {
          return false;
        }

        const distance = distanceKm(
          userLocation.lat,
          userLocation.lng,
          coordinates.lat,
          coordinates.lng
        );

        return distance <= 10;
      });
    }

    return result;
  }, [
    events,
    eventFilter,
    locationFilter,
    quickFilter,
    userLocation,
  ]);

  return (
    <main className="min-h-screen bg-white pb-24">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HERO */}

        <section className="mt-3 overflow-hidden rounded-2xl bg-[#149EAF] sm:mt-4 sm:rounded-3xl">

          <div className="relative min-h-[150px] overflow-hidden sm:min-h-[250px]">

            <img
              src="/hero-algarve.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#149EAF]/70" />

            <div className="relative z-10 flex min-h-[150px] items-center px-5 py-5 sm:min-h-[250px] sm:px-10 sm:py-8">

              <div className="max-w-xl text-white">

                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:mb-2 sm:text-sm">
                  {pt
                    ? "Descubra o Algarve"
                    : "Discover the Algarve"}
                </p>

                <h1 className="text-[30px] font-black leading-[1.05] tracking-tight sm:text-5xl">
                  {pt
                    ? "O que está a acontecer"
                    : "What's happening"}
                  <br />
                  {pt
                    ? "perto de si?"
                    : "near you?"}
                </h1>

                <p className="mt-2 max-w-md text-xs leading-relaxed text-white/90 sm:mt-4 sm:text-lg">
                  {pt
                    ? "Eventos, experiências e tesouros locais, tudo num só lugar."
                    : "Events, experiences and local gems all in one place."}
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* QUICK FILTERS */}

        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:mt-4 sm:gap-3">

          {[
            [
              "near",
              pt ? "Perto de mim" : "Near Me",
            ],
            [
              "today",
              pt ? "Hoje" : "Today",
            ],
            [
              "weekend",
              pt ? "Este fim de semana" : "This Weekend",
            ],
            [
              "free",
              pt ? "Grátis" : "Free",
            ],
          ].map(([value, label]) => {

            const active =
              quickFilter === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  handleQuickFilter(
                    value as QuickFilter
                  )
                }
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold shadow-sm transition sm:px-6 sm:py-3 sm:text-sm ${
                  active
                    ? "border-[#149EAF] bg-[#149EAF] text-white"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            );
          })}

        </div>

        {/* SEARCH */}

        <div className="mt-2.5 sm:mt-4">
          <SearchBar />
        </div>

        {/* FILTER PANEL */}

        <section className="mt-3 rounded-2xl bg-[#E6FAFC] p-3 sm:mt-5 sm:p-5">

          <div className="mb-2 flex items-center justify-between sm:mb-3">

            <p className="text-sm font-bold text-slate-600">
              {pt ? "Filtros" : "Filters"}
            </p>

            <button
              type="button"
              onClick={() => {
                setEventFilter("");
                setLocationFilter("");
                setQuickFilter("");
                setUserLocation(null);
              }}
              className="text-xs font-bold text-[#149EAF] hover:underline"
            >
              {pt
                ? "Limpar filtros"
                : "Clear filters"}
            </button>

          </div>

          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">

            {/* EVENT FILTER */}

            <div>

              <label
                htmlFor="event-filter"
                className="mb-1 block text-xs font-semibold text-slate-600 sm:mb-1.5 sm:text-sm"
              >
                {pt
                  ? "Filtrar por evento"
                  : "Filter by event"}
              </label>

              <div className="relative">

                <select
                  id="event-filter"
                  value={eventFilter}
                  onChange={(e) =>
                    setEventFilter(
                      e.target.value
                    )
                  }
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-xs font-semibold text-slate-800 shadow-sm outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20 sm:h-11 sm:px-4 sm:text-sm"
                >
                  <option value="">
                    {pt
                      ? "Todos os tipos de evento"
                      : "All event types"}
                  </option>

                  {eventCategories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {pt
                          ? categoryTranslations[category] || category
                          : category}
                      </option>
                    )
                  )}

                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 sm:right-4">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-500 sm:h-5 sm:w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>

                </div>

              </div>

            </div>

            {/* LOCATION FILTER */}

            <div>

              <label
                htmlFor="location-filter"
                className="mb-1 block text-xs font-semibold text-slate-600 sm:mb-1.5 sm:text-sm"
              >
                {pt
                  ? "Filtrar por localização"
                  : "Filter by location"}
              </label>

              <div className="relative">

                <select
                  id="location-filter"
                  value={locationFilter}
                  onChange={(e) =>
                    setLocationFilter(
                      e.target.value
                    )
                  }
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-xs font-semibold text-slate-800 shadow-sm outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20 sm:h-11 sm:px-4 sm:text-sm"
                >
                  <option value="">
                    {pt
                      ? "Todas as localizações"
                      : "All locations"}
                  </option>

                  {eventLocations.map(
                    (location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    )
                  )}

                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 sm:right-4">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-500 sm:h-5 sm:w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* EVENTS */}

        <section className="mt-5 sm:mt-7">

          <div className="mb-2.5 sm:mb-4">

            <h2
              className="text-xl font-black tracking-tight sm:text-2xl"
              style={{
                color: T.navy,
              }}
            >
              {pt ? "Eventos" : "Events"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
              {pt
                ? "Descubra o que está a acontecer por todo o Algarve"
                : "Discover what's happening across the Algarve"}
            </p>

          </div>

          {loading ? (

            <div className="py-10 text-center text-sm text-slate-500">
              {pt
                ? "A carregar eventos..."
                : "Loading events..."}
            </div>

          ) : filteredEvents.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">

              {/* LITTLE LOKLY EYES */}

              <div className="mb-3 flex justify-center">

                <svg
                  width="58"
                  height="34"
                  viewBox="0 0 58 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <ellipse
                    cx="18"
                    cy="18"
                    rx="12"
                    ry="14"
                    stroke="#102F56"
                    strokeWidth="3"
                  />

                  <ellipse
                    cx="40"
                    cy="18"
                    rx="12"
                    ry="14"
                    stroke="#102F56"
                    strokeWidth="3"
                  />

                  <circle
                    cx="20"
                    cy="19"
                    r="5"
                    fill="#149EAF"
                  />

                  <circle
                    cx="38"
                    cy="19"
                    r="5"
                    fill="#149EAF"
                  />

                  <circle
                    cx="21.5"
                    cy="17.5"
                    r="1.5"
                    fill="white"
                  />

                  <circle
                    cx="39.5"
                    cy="17.5"
                    r="1.5"
                    fill="white"
                  />

                </svg>

              </div>

              <p className="font-semibold text-slate-700">
                {pt
                  ? "Nada para ver aqui… ainda!"
                  : "Nothing to see here… yet!"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {pt
                  ? "Tente alterar os seus filtros."
                  : "Try changing your filters."}
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">

              {filteredEvents.map(
                (event) => (

                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    location={getEventLocation(event)}
                    date={event.date ?? ""}
                    category={getEventCategory(event)}
                    image={event.image ?? ""}
                    latitude={Number(
                      event.latitude ??
                        event.lat ??
                        0
                    )}
                    longitude={Number(
                      event.longitude ??
                        event.lng ??
                        event.lon ??
                        0
                    )}
                  />

                )
              )}

            </div>

          )}

        </section>

      </div>

      <BottomNavigation />

    </main>
  );
}