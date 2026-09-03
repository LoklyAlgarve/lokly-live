import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import BottomNavigation from "../components/BottomNavigation";
import { getEvents } from "../data/events";

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

  // Handles YYYY-MM-DD
  const isoMatch = trimmed.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/
  );

  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]) - 1;
    const day = Number(isoMatch[3]);

    return new Date(year, month, day);
  }

  // Handles DD/MM/YYYY
  const ukMatch = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
  );

  if (ukMatch) {
    const day = Number(ukMatch[1]);
    const month = Number(ukMatch[2]) - 1;
    const year = Number(ukMatch[3]);

    return new Date(year, month, day);
  }

  // Fallback for other date formats
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
  saturday.setDate(today.getDate() + daysUntilSaturday);

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  return (
    isSameDay(date, saturday) ||
    isSameDay(date, sunday)
  );
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = (params.query || "").trim().toLowerCase();
  const category = (params.category || "").trim().toLowerCase();
  const location = (params.location || "").trim().toLowerCase();
  const filter = (params.filter || "").trim().toLowerCase();

  const events = await getEvents();

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
      ? "Events Today"
      : filter === "weekend"
        ? "This Weekend"
        : filter === "free"
          ? "Free Events"
          : filter === "family"
            ? "Family Events"
            : filter === "music"
              ? "Music Events"
              : null;

  const heading = isLocationSearch
    ? `Events near ${params.location}`
    : filterHeading
      ? filterHeading
      : category
        ? `${params.category} Events`
        : query
          ? `Search results for "${params.query}"`
          : "All Events";

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

        {/* SEARCH */}
        <div className="mb-7 sm:mb-8">
          <SearchBar />
        </div>

        {/* RESULTS HEADER */}
        <div className="mb-7 sm:mb-8">
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
            {heading}
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {filteredEvents.length} event
            {filteredEvents.length === 1 ? "" : "s"} found
          </p>
        </div>

        {/* LOCAL RESULTS */}
        {filteredEvents.length > 0 && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                location={event.location}
                date={`${event.date} • ${event.time}`}
                image={event.image}
                latitude={event.latitude}
                longitude={event.longitude}
              />
            ))}
          </section>
        )}

        {/* NO LOCAL RESULTS */}
        {isLocationSearch && filteredEvents.length === 0 && (
          <>
            <div className="rounded-3xl bg-white p-8 text-center shadow sm:p-10">
              <h2 className="text-xl font-bold text-slate-900">
                Nothing happening in {params.location} right now
              </h2>

              <p className="mt-2 text-slate-500">
                We couldn't find any events in {params.location}, but there
                may be something elsewhere in the Algarve.
              </p>
            </div>

            {otherAlgarveEvents.length > 0 && (
              <>
                <div className="mb-6 mt-10 sm:mt-12">
                  <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                    Other Algarve Events
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 sm:text-base">
                    More events happening across the Algarve.
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

        {/* NO RESULTS FOR NORMAL SEARCH */}
        {!isLocationSearch && filteredEvents.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow sm:p-10">
            <h2 className="text-xl font-bold text-slate-900">
              No events found
            </h2>

            <p className="mt-2 text-slate-500">
              Try another category, town or event.
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}