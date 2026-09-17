"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import BottomNavigation from "../components/BottomNavigation";
import { getEvents } from "../data/events";
import { useLanguage } from "../LanguageContext";

function parseEventDate(dateString: string) {
  if (!dateString) return null;

  const trimmed = dateString.trim();

  const isoMatch = trimmed.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/
  );

  if (isoMatch) {
    return new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3])
    );
  }

  const ukMatch = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
  );

  if (ukMatch) {
    return new Date(
      Number(ukMatch[3]),
      Number(ukMatch[2]) - 1,
      Number(ukMatch[1])
    );
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

function normalise(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
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

  const [showRefine, setShowRefine] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [wheelchairFilter, setWheelchairFilter] = useState("");
  const [petFilter, setPetFilter] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(
      window.location.search
    );

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

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        events
          .map((event) =>
            String(event.category ?? "").trim()
          )
          .filter(Boolean)
      )
    ).sort();
  }, [events]);

  const locations = useMemo(() => {
    return Array.from(
      new Set(
        events
          .map((event) =>
            String(event.concelho ?? "").trim()
          )
          .filter(Boolean)
      )
    ).sort();
  }, [events]);

  const query = params.query.trim().toLowerCase();
  const category = params.category.trim().toLowerCase();
  const location = params.location.trim().toLowerCase();
  const filter = params.filter.trim().toLowerCase();

  const today = new Date();

  const filteredEvents = events.filter((event) => {
    const eventDate = parseEventDate(
      event.startDate || event.date
    );

    const eventEndDate = parseEventDate(
      event.endDate ||
        event.end_date ||
        event.date
    );

    const matchesQuery =
      !query ||
      normalise(event.title).includes(query) ||
      normalise(event.location).includes(query) ||
      normalise(event.category).includes(query) ||
      normalise(event.description).includes(query) ||
      normalise(event.concelho).includes(query);

    const matchesCategory =
      !category ||
      normalise(event.category) === category;

    const matchesLocation =
      !location ||
      location === "algarve" ||
      normalise(event.location) === location;

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
        normalise(event.price) === "free";
    }

    if (filter === "family") {
      matchesFilter =
        normalise(event.category) === "family";
    }

    if (filter === "music") {
      matchesFilter =
        normalise(event.category) === "music";
    }

    let matchesFromDate = true;

    if (fromDate) {
      const selectedFromDate =
        parseEventDate(fromDate);

      if (selectedFromDate && eventEndDate) {
        matchesFromDate =
          eventEndDate >= selectedFromDate;
      }
    }

    let matchesToDate = true;

    if (toDate) {
      const selectedToDate =
        parseEventDate(toDate);

      if (selectedToDate && eventDate) {
        matchesToDate =
          eventDate <= selectedToDate;
      }
    }

    const matchesPrice =
      !priceFilter ||
      (priceFilter === "free" &&
        normalise(event.price) === "free");

    const matchesRefineCategory =
      !categoryFilter ||
      normalise(event.category) ===
        normalise(categoryFilter);

    const matchesRefineLocation =
      !locationFilter ||
      normalise(event.concelho) ===
        normalise(locationFilter);

    /*
     * IMPORTANT:
     * The event data uses camelCase:
     * wheelchairFriendly
     * petFriendly
     */

    const wheelchairValue = normalise(
      event.wheelchairFriendly
    );

    const matchesWheelchair =
      !wheelchairFilter ||
      (wheelchairFilter === "yes" &&
        wheelchairValue === "yes") ||
      (wheelchairFilter === "no" &&
        wheelchairValue === "no");

    const petValue = normalise(
      event.petFriendly
    );

    const matchesPet =
      !petFilter ||
      (petFilter === "yes" &&
        petValue === "yes") ||
      (petFilter === "no" &&
        petValue === "no");

    return (
      matchesQuery &&
      matchesCategory &&
      matchesLocation &&
      matchesFilter &&
      matchesFromDate &&
      matchesToDate &&
      matchesPrice &&
      matchesRefineCategory &&
      matchesRefineLocation &&
      matchesWheelchair &&
      matchesPet
    );
  });

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setPriceFilter("");
    setCategoryFilter("");
    setLocationFilter("");
    setWheelchairFilter("");
    setPetFilter("");
  };

  const hasRefineFilters =
    fromDate ||
    toDate ||
    priceFilter ||
    categoryFilter ||
    locationFilter ||
    wheelchairFilter ||
    petFilter;

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
          normalise(event.title).includes(query) ||
          normalise(event.location).includes(query) ||
          normalise(event.category).includes(query) ||
          normalise(event.description).includes(query) ||
          normalise(event.concelho).includes(query);

        const matchesCategory =
          !category ||
          normalise(event.category) === category;

        return (
          matchesQuery &&
          matchesCategory &&
          normalise(event.location) !== location
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

        {/* SEARCH FILTERS */}

        <div className="mb-7 overflow-hidden rounded-3xl bg-white shadow-sm">

          <button
            type="button"
            onClick={() =>
              setShowRefine(!showRefine)
            }
            className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-6"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Search Filters
              </h2>

              {hasRefineFilters && (
                <p className="mt-1 text-xs text-slate-500">
                  Filters applied
                </p>
              )}
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-slate-500 transition-transform ${
                showRefine
                  ? "rotate-180"
                  : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19 9-7 7-7-7"
              />
            </svg>
          </button>

          {showRefine && (
            <div className="border-t border-slate-100 px-5 pb-6 pt-5 sm:px-6">

              <div className="space-y-4">

                {/* ROW 1 - CATEGORY / LOCATION */}

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Category
                    </label>

                    <select
                      value={categoryFilter}
                      onChange={(e) =>
                        setCategoryFilter(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#149EAF]"
                    >
                      <option value="">
                        All categories
                      </option>

                      {categories.map(
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Location
                    </label>

                    <select
                      value={locationFilter}
                      onChange={(e) =>
                        setLocationFilter(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#149EAF]"
                    >
                      <option value="">
                        All locations
                      </option>

                      {locations.map(
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
                  </div>

                </div>

                {/* ROW 2 - WHEELCHAIR / PET */}

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Wheelchair accessible
                    </label>

                    <select
                      value={wheelchairFilter}
                      onChange={(e) =>
                        setWheelchairFilter(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#149EAF]"
                    >
                      <option value="">
                        Any
                      </option>

                      <option value="yes">
                        Yes
                      </option>

                      <option value="no">
                        No
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Pet friendly
                    </label>

                    <select
                      value={petFilter}
                      onChange={(e) =>
                        setPetFilter(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#149EAF]"
                    >
                      <option value="">
                        Any
                      </option>

                      <option value="yes">
                        Yes
                      </option>

                      <option value="no">
                        No
                      </option>
                    </select>
                  </div>

                </div>

                {/* ROW 3 - FROM / TO / PRICE */}

                <div className="grid gap-4 md:grid-cols-3">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      From
                    </label>

                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) =>
                        setFromDate(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#149EAF]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      To
                    </label>

                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) =>
                        setToDate(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#149EAF]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Price
                    </label>

                    <select
                      value={priceFilter}
                      onChange={(e) =>
                        setPriceFilter(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#149EAF]"
                    >
                      <option value="">
                        Any price
                      </option>

                      <option value="free">
                        Free
                      </option>
                    </select>
                  </div>

                </div>

                {/* CLEAR FILTERS */}

                {hasRefineFilters && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm font-semibold text-[#149EAF] hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

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
                {filteredEvents.map(
                  (event) => (
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
                  )
                )}
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
                      {t(
                        "We couldn't find any events in"
                      )}{" "}
                      {params.location},{" "}
                      {t(
                        "but there may be something elsewhere in the Algarve."
                      )}
                    </p>
                  </div>

                  {otherAlgarveEvents.length >
                    0 && (
                    <>
                      <div className="mb-6 mt-10 sm:mt-12">
                        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                          {t(
                            "Other Algarve Events"
                          )}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                          {t(
                            "More events happening across the Algarve."
                          )}
                        </p>
                      </div>

                      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {otherAlgarveEvents.map(
                          (event) => (
                            <EventCard
                              key={event.id}
                              id={event.id}
                              title={event.title}
                              location={event.location}
                              date={`${event.date} • ${event.time}`}
                              category={
                                event.category
                              }
                              image={event.image}
                              latitude={
                                event.latitude
                              }
                              longitude={
                                event.longitude
                              }
                            />
                          )
                        )}
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
                    {t(
                      "Try another category, town or event."
                    )}
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