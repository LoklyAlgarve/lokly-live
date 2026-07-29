import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryChips from "./components/CategoryChips";
import EventCard from "./components/EventCard";
import BottomNavigation from "./components/BottomNavigation";

import { events } from "./data/events";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 pb-36">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-6">
        <SearchBar />

        <div className="mt-8">
          <CategoryChips />
        </div>

        <section className="mt-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#149EAF]">
              DISCOVER
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
              What's on today
            </h2>

            <p className="mt-3 max-w-xl text-slate-500">
              Carefully selected events happening across the Algarve.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              location={event.location}
              date={`${event.date} • ${event.time}`}
              image={event.image}
            />
          ))}
        </section>
      </section>

      <BottomNavigation />
    </main>
  );
}