import { Suspense } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryChips from "./components/CategoryChips";
import EventCard from "./components/EventCard";
import BottomNavigation from "./components/BottomNavigation";
import T from "./components/T";

import { getEvents } from "./data/events";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await getEvents();

  const featured = events.filter((event) => event.featured);

  return (
    <main className="min-h-screen bg-white pb-32 sm:pb-40">

      <Header />

      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-8">

        {/* HERO */}

        <section className="relative overflow-hidden rounded-[24px] shadow-lg sm:rounded-[30px]">

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(15,126,157,0.94) 0%, rgba(20,158,175,0.78) 48%, rgba(20,158,175,0.25) 100%), url('/images/algarve-hero.jpg')",
            }}
          />

          <div className="relative min-h-[240px] px-6 py-7 sm:min-h-[340px] sm:px-10 sm:py-10">

            <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-white sm:text-sm">
              DISCOVER THE ALGARVE
            </p>

            <h1 className="mt-3 max-w-[520px] text-[34px] font-black leading-[1.02] text-white sm:text-5xl md:text-6xl">
              What’s happening
              <br />
              near you?
            </h1>

            <p className="mt-4 max-w-[470px] text-[17px] font-medium leading-snug text-white/95 sm:text-xl">
              Events, experiences and local gems
              <br className="hidden sm:block" />
              all in one place.
            </p>

          </div>

        </section>

        {/* QUICK FILTERS */}

        <div className="-mt-1 flex gap-2 overflow-x-auto py-4 sm:mt-3 sm:gap-3 sm:py-5">

          <button
            type="button"
            className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-[#12aebb] px-5 text-sm font-bold text-white shadow-md"
          >
            <span className="text-lg">⌖</span>
            Near Me
          </button>

          <button
            type="button"
            className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-slate-800 shadow-md ring-1 ring-slate-100"
          >
            <span className="text-lg">▣</span>
            Today
          </button>

          <button
            type="button"
            className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-slate-800 shadow-md ring-1 ring-slate-100"
          >
            <span className="text-lg">▣</span>
            This Weekend
          </button>

          <button
            type="button"
            className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-slate-800 shadow-md ring-1 ring-slate-100"
          >
            <span className="text-lg">◇</span>
            Free
          </button>

        </div>

        {/* SEARCH */}

        <div className="mt-1 sm:mt-2">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        {/* CATEGORIES */}

        <section className="mt-8 sm:mt-12">

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[22px] font-black text-[#102b52] sm:text-3xl">
              Browse by Category
            </h2>

            <span className="text-sm font-bold text-[#10aeba] sm:text-base">
              See all →
            </span>
          </div>

          <CategoryChips />

        </section>

        {/* EVENTS NEAR YOU */}

        <section className="mt-9 sm:mt-14">

          <div className="flex items-end justify-between">

            <div>
              <h2 className="flex items-center gap-2 text-[23px] font-black text-[#102b52] sm:text-3xl">
                <span className="text-[#10aeba]">●</span>
                Events Near You
              </h2>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Showing events close to your location
              </p>
            </div>

            <span className="mb-1 hidden text-sm font-bold text-[#10aeba] sm:block sm:text-base">
              See all →
            </span>

          </div>

          {events.length === 0 ? (

            <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                <T k="noEvents" />
              </h2>

              <p className="mt-2 text-slate-500">
                <T k="noEventsSub" />
              </p>
            </div>

          ) : (

            <section className="mt-5 flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-3">

              {events.map((event) => (

                <div
                  key={`near-${event.id}`}
                  className="min-w-[285px] sm:min-w-0"
                >
                  <EventCard
                    id={event.id}
                    title={event.title}
                    location={event.location}
                    date={`${event.date} • ${event.time}`}
                    category={event.category}
                    image={event.image}
                    latitude={event.latitude}
                    longitude={event.longitude}
                  />
                </div>

              ))}

            </section>

          )}

        </section>

        {/* FEATURED */}

        {featured.length > 0 && (

          <section className="mt-10 sm:mt-16">

            <div className="flex items-end justify-between">

              <div>
                <h2 className="text-[23px] font-black text-[#102b52] sm:text-3xl">
                  <T k="featured" />
                </h2>

                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  <T k="featuredSub" />
                </p>
              </div>

            </div>

            <section className="mt-5 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">

              {featured.map((event) => (

                <EventCard
                  key={`featured-${event.id}`}
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

          </section>

        )}

      </section>

      <BottomNavigation />

    </main>
  );
}