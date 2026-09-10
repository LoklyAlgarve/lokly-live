"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import BottomNavigation from "../components/BottomNavigation";
import { getEvents } from "../data/events";
import { useLanguage } from "../LanguageContext";

type SearchPageProps = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    location?: string;
    filter?: string;
  }>;
};

function parseEventDate(dateString: string) {
  if (!dateString) {
    return null;
  }

  const trimmed = dateString.trim();

  const isoMatch = trimmed.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/
  );

  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]) - 1;
    const day = Number(isoMatch[3]);

    return new Date(year, month, day);
  }

  const ukMatch = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
  );

  if (ukMatch) {
    const day = Number(ukMatch[1]);
    const month = Number(ukMatch[2]) - 1;
    const year = Number(ukMatch[3]);

    return new Date(year, month, day);
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  );
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isThisWeekend(date: Date, today: Date) {
  const dayOfWeek = today.getDay();

  const daysUntilSaturday =
    dayOfWeek === 0 ? 6 : 6 - dayOfWeek;

  const saturday = new Date(today);

  saturday.setDate(
    today.getDate() + daysUntilSaturday
  );

  const sunday = new Date(saturday);

  sunday.setDate(saturday.getDate() + 1);

  return (
    isSameDay(date, saturday) ||
    isSameDay(date, sunday)
  );
}

export default function SearchPage() {
  const { t } = useLanguage();

  const [params, setParams] = useState({
    query: "",
    category: "",
    location: "",
    filter: "",
  });

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    setParams({
      query: searchParams.get("query") || "",
      category: searchParams.get("category") || "",
      location: searchParams.get("location") || "",
      filter: searchParams.get("filter") || "",
    });
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
        const allEvents = await getEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error("Could not load Lokly events:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const query = params.query.trim().toLowerCase();
  const category = params.category.trim().toLowerCase();
  const location = params.location.trim().toLowerCase();
  const filter = params.filter.trim().toLowerCase();

  const today = new Date();

  const filteredEvents = events.filter((event) => {
    const eventDate = parseEventDate(event.date);

    const matchesQuery =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query);

    const matchesCategory =
      !category ||
      event.category.toLowerCase() === category;

    const matchesLocation =
      !location ||
      location === "algarve" ||
      event.location.toLowerCase() === location;

    let matchesFilter = true;

    if (filter === "today") {
      matchesFilter =
        eventDate !== null &&
        isSameDay(eventDate, today);
    }

    if (filter === "weekend") {
      matchesFilter =
        eventDate !== null &&
        isThisWeekend(eventDate, today);
    }

    if (filter === "free") {
      matchesFilter =
        event.price.trim().toLowerCase() === "free";
    }

    if (filter === "family") {
      matchesFilter =
        event.category.trim().toLowerCase() === "family";
    }

    if (filter === "music") {
      matchesFilter =
        event.category.trim().toLowerCase() === "music";
    }

    return (
      matchesQuery &&
      matchesCategory &&
      matchesLocation &&
      matchesFilter
    );
  });

  const isLocationSearch =
    !!location && location !== "algarve";

  const filterHeading =
    filter === "today"
      ? t("Events Today")
      : filter === "weekend"
        ? t("This Weekend")
        : filter === "free"
          ? t("Free Events")
          : filter === "family"
            ? t("Family Events")
            : filter === "music"
              ? t("Music Events")
              : null;

  const heading = isLocationSearch
    ? `${t("Events near")} ${params.location}`
    : filterHeading
      ? filterHeading
      : category
        ? `${params.category} ${t("Events")}`
        : query
          ? `${t("Search results for")} "${params.query}"`
          : t("All Events");

  const otherAlgarveEvents = isLocationSearch
    ? events.filter((event) => {
        const matchesQuery =
          !query ||
          event.title.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query);

        const matchesCategory =
          !category ||
          event.category.toLowerCase() === category;

        return (
          matchesQuery &&
          matchesCategory &&
          event.location.toLowerCase() !== location
        );
      })
    : [];

  return (
    <main className="min-h-screen bg-slate-50 pb-36">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-7 sm:mb-8">
          <SearchBar />
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              {t("Loading events...")}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-7 sm:mb-8">
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                {heading}
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1
                  ? t("event")
                  : t("events")}{" "}
                {t("found")}
              </p>
            </div>

            {filteredEvents.length > 0 && (
              <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    location={event.location}
                    date={`${event.date} • ${event.time}`}
                    category={event.category}
                    image={event.image}
                    latitude={event.latitude}
                    longitude={event.longitude}
                  />
                ))}
              </section>
            )}

            {isLocationSearch &&
              filteredEvents.length === 0 && (
                <>
                  <div className="rounded-3xl bg-white p-8 text-center shadow sm:p-10">
                    <h2 className="text-xl font-bold text-slate-900">
                      {t("Nothing happening in")}{" "}
                      {params.location}{" "}
                      {t("right now")}
                    </h2>

                    <p className="mt-2 text-slate-500">
                      {t("We couldn't find any events in")}{" "}
                      {params.location},{" "}
                      {t(
                        "but there may be something elsewhere in the Algarve."
                      )}
                    </p>
                  </div>

                  {otherAlgarveEvents.length > 0 && (
                    <>
                      <div className="mb-6 mt-10 sm:mt-12">
                        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                          {t("Other Algarve Events")}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                          {t(
                            "More events happening across the Algarve."
                          )}
                        </p>
                      </div>

                      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {otherAlgarveEvents.map((event) => (
                          <EventCard
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            location={event.location}
                            date={`${event.date} • ${event.time}`}
                            category={event.category}
                            image={event.image}
                            latitude={event.latitude}
                            longitude={event.longitude}
                          />
                        ))}
                      </section>
                    </>
                  )}
                </>
              )}

            {!isLocationSearch &&
              filteredEvents.length === 0 && (
                <div className="rounded-3xl bg-white p-8 text-center shadow sm:p-10">
                  <h2 className="text-xl font-bold text-slate-900">
                    {t("No events found")}
                  </h2>

                  <p className="mt-2 text-slate-500">
                    {t("Try another category, town or event.")}
                  </p>
                </div>
              )}
          </>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}