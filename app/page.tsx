"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import EventCard from "./components/EventCard";
import BottomNavigation from "./components/BottomNavigation";
import { getEvents } from "./data/events";

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
    const [year, month, day] = trimmed
      .split("-")
      .map(Number);

    return new Date(year, month - 1, day);
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed
      .split("/")
      .map(Number);

    return new Date(year, month - 1, day);
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed
      .split("-")
      .map(Number);

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

export default function HomePage() {
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
          "Location is not available on this device."
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
            "We couldn't access your location. Please check your location permissions."
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
    <main className="min-h-screen bg-white pb-28">

      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HERO */}
        <section className="mt-4 overflow-hidden rounded-3xl bg-[#149EAF]">

          <div className="relative min-h-[250px] overflow-hidden">

            <img
              src="/hero-algarve.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#149EAF]/70" />

            <div className="relative z-10 flex min-h-[250px] items-center px-6 py-8 sm:px-10">

              <div className="max-w-xl text-white">

                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                  Discover the Algarve
                </p>

                <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
                  What's happening
                  <br />
                  near you?
                </h1>

                <p className="mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
                  Events, experiences and local gems
                  all in one place.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* QUICK FILTERS */}
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">

          {[
            ["near", "Near Me"],
            ["today", "Today"],
            ["weekend", "This Weekend"],
            ["free", "Free"],
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
                className={`shrink-0 rounded-full border px-6 py-3 text-sm font-bold shadow-sm transition ${
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
        <div className="mt-4">
          <SearchBar />
        </div>

        {/* FILTER PANEL */}
        <section className="mt-5 rounded-2xl bg-[#E6FAFC] p-4 sm:p-5">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* EVENT FILTER */}
            <div>

              <label
                htmlFor="event-filter"
                className="mb-1.5 block text-sm font-semibold text-slate-600"
              >
                Filter by event
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
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                >

                  <option value="">
                    All event types
                  </option>

                  {eventCategories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}

                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-slate-500"
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
                className="mb-1.5 block text-sm font-semibold text-slate-600"
              >
                Filter by location
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
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
                >

                  <option value="">
                    All locations
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

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-slate-500"
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
        <section className="mt-7">

          <div className="mb-4">

            <h2
              className="text-2xl font-black tracking-tight"
              style={{
                color: T.navy,
              }}
            >
              Events
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Discover what's happening across the Algarve
            </p>

          </div>

          {loading ? (

            <div className="py-12 text-center text-sm text-slate-500">
              Loading events...
            </div>

          ) : filteredEvents.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">

              <p className="font-semibold text-slate-700">
                No events found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your filters.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

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