import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryChips from "./components/CategoryChips";
import EventCard from "./components/EventCard";
import BottomNavigation from "./components/BottomNavigation";

import { getEvents } from "./data/events";

export default async function Home() {
  const events = await getEvents();

  const featured = events.filter(
    (event) => event.featured
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-48 sm:pb-40">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8">

        {/* HERO */}
        <div className="rounded-[26px] bg-gradient-to-r from-[#149EAF] to-cyan-500 px-5 py-5 text-white shadow-xl sm:rounded-[32px] sm:p-8">

          <p className="text-[13px] font-bold uppercase tracking-[0.2em] opacity-95 sm:text-sm sm:tracking-[0.3em]">
            DISCOVER THE ALGARVE
          </p>

          <h1 className="mt-2 max-w-3xl text-[30px] font-black leading-[1.08] sm:mt-3 sm:text-5xl sm:leading-tight">
            Find amazing events near you
          </h1>

          <p className="mt-3 max-w-2xl text-[14px] leading-snug text-white/90 sm:mt-4 sm:text-lg sm:leading-relaxed">
            Markets, music, food festivals, family days, sporting events and much more.
          </p>

          <div className="mt-4 sm:mt-8">
            <SearchBar />
          </div>

          <div className="mt-2 sm:hidden">
            <button
              type="button"
              className="flex h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-[14px] font-bold text-[#149EAF] shadow-md transition active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z"
                />
                <circle cx="12" cy="10" r="2.5" />
              </svg>

              <span>Find events near me</span>
            </button>
          </div>

        </div>

        {/* CATEGORIES */}
        <div className="mt-6 sm:mt-10">
          <CategoryChips />
        </div>

        {/* FEATURED EVENTS */}
        {featured.length > 0 && (
          <>
            <div className="mt-9 sm:mt-12">
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                Featured Events
              </h2>

              <p className="mt-1 text-sm text-slate-500 sm:mt-2 sm:text-base">
                Hand-picked events happening across the Algarve.
              </p>
            </div>

            <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3 sm:mt-8 sm:gap-7">
              {featured.map((event) => (
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

        {/* ALL EVENTS */}
        <div className="mt-10 sm:mt-16">
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            All Events
          </h2>

          <p className="mt-1 text-sm text-slate-500 sm:mt-2 sm:text-base">
            Browse everything happening in the Algarve.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow sm:mt-8 sm:p-10">
            <h2 className="text-xl font-bold text-slate-900">
              No events found
            </h2>

            <p className="mt-2 text-slate-500">
              We couldn't load the events from Lokly yet.
            </p>
          </div>
        ) : (
          <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3 sm:mt-8 sm:gap-7">
            {events.map((event) => (
              <EventCard
                key={`all-${event.id}`}
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

      </section>

      <BottomNavigation />
    </main>
  );
}