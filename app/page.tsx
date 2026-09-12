"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import EventCard from "./components/EventCard";
import BottomNavigation from "./components/BottomNavigation";
import { getEvents } from "./data/events";
import { useLanguage } from "./LanguageContext";

type CategoryIconName =
  | "music"
  | "food"
  | "arts"
  | "markets"
  | "wellbeing"
  | "family"
  | "sport"
  | "festival"
  | "exhibitions"
  | "workshop";

type Category = {
  label: string;
  icon: CategoryIconName;
  color: string;
};

const mainCategories: Category[] = [
  { label: "Music", icon: "music", color: "#E53935" },
  { label: "Food & Drink", icon: "food", color: "#F59E0B" },
  { label: "Arts & Culture", icon: "arts", color: "#8B5CF6" },
  {
    label: "Markets & Shopping",
    icon: "markets",
    color: "#F97316",
  },
  { label: "Wellbeing", icon: "wellbeing", color: "#22C55E" },
  { label: "Family", icon: "family", color: "#A855F7" },
  { label: "Sport", icon: "sport", color: "#3B82F6" },
  { label: "Festivals", icon: "festival", color: "#EC4899" },
  {
    label: "Exhibitions",
    icon: "exhibitions",
    color: "#9333EA",
  },
  { label: "Workshops", icon: "workshop", color: "#A16207" },
];

function CategoryIcon({
  name,
}: {
  name: CategoryIconName;
}) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "music":
      return (
        <svg {...common}>
          <path d="M9 18V5l10-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      );

    case "food":
      return (
        <svg {...common}>
          <path d="M7 3v7" />
          <path d="M4.5 3v7a2.5 2.5 0 0 0 5 0V3" />
          <path d="M7 10v11" />
          <path d="M17 3c-2 2-3 4.5-3 7h3v11" />
          <path d="M17 3v18" />
        </svg>
      );

    case "arts":
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12h-3Z" />
          <circle cx="7.5" cy="10" r="1" />
          <circle cx="8.5" cy="6.5" r="1" />
          <circle cx="13" cy="6" r="1" />
        </svg>
      );

    case "markets":
      return (
        <svg {...common}>
          <path d="M4 10h16" />
          <path d="M5 10v10h14V10" />
          <path d="M3 10 5 4h14l2 6" />
          <path d="M8 10v10" />
          <path d="M16 10v10" />
        </svg>
      );

    case "wellbeing":
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.4-7-10.2C5 6.8 7.1 5 9.4 5c1.4 0 2.5.7 3.1 1.8C13.1 5.7 14.2 5 15.6 5 17.9 5 20 6.8 20 9.8 20 15.6 12 20 12 20Z" />
        </svg>
      );

    case "family":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" />
          <circle cx="5.5" cy="10" r="2" />
          <circle cx="18.5" cy="10" r="2" />
          <path d="M6 21c0-4 2.5-6 6-6s6 2 6 6" />
          <path d="M2.5 20c0-2.5 1-4 3-4" />
          <path d="M21.5 20c0-2.5-1-4-3-4" />
        </svg>
      );

    case "sport":
      return (
        <svg {...common}>
          <circle cx="13" cy="4.5" r="2" />
          <path d="m11 8-2 4 3 2 2 6" />
          <path d="m10 10-4 3" />
          <path d="m12 14 5-2" />
          <path d="m14 20 4-5" />
        </svg>
      );

    case "festival":
      return (
        <svg {...common}>
          <path d="M12 2v20" />
          <path d="m2 12 20 0" />
          <path d="m4.9 4.9 14.2 14.2" />
          <path d="m19.1 4.9-14.2 14.2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );

    case "exhibitions":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8" cy="9" r="1.5" />
          <path d="m5 17 4-4 3 3 3-4 4 5" />
        </svg>
      );

    case "workshop":
      return (
        <svg {...common}>
          <path d="m14 6 4 4" />
          <path d="m16 4 4 4" />
          <path d="M13 7 5 15" />
          <path d="m3 21 4-1 10-10" />
          <path d="M4 4h6" />
          <path d="M4 7h4" />
        </svg>
      );

    default:
      return null;
  }
}

export default function HomePage() {
  const { t } = useLanguage();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data || []);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <main className="min-h-screen bg-white pb-24">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* CATEGORIES */}

        <div className="mt-3 overflow-hidden sm:mt-4">
          <div
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {mainCategories.map((category) => (
              <div
                key={category.label}
                className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 text-center"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: category.color,
                  }}
                >
                  <span className="h-6 w-6 text-white">
                    <CategoryIcon name={category.icon} />
                  </span>
                </span>

                <span className="whitespace-nowrap text-[10px] font-bold leading-tight text-[#102F56]">
                  {t(category.label)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH */}

        <div className="mt-3 sm:mt-4">
          <SearchBar />
        </div>

        {/* EVENTS */}

        <section className="mt-5 sm:mt-7">

          <div className="mb-2.5 sm:mb-4">
            <h2 className="text-xl font-black tracking-tight text-[#102F56] sm:text-2xl">
              {t("Events")}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
              {t(
                "Discover what's happening across the Algarve"
              )}
            </p>
          </div>

          {loading ? (

            <div className="py-10 text-center text-sm text-slate-500">
              {t("Loading events...")}
            </div>

          ) : events.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">

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
                {t("Nothing to see here… yet!")}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {t("There are currently no approved events.")}
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">

              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  location={event.location ?? "Algarve"}
                  date={event.date ?? ""}
                  category={event.category ?? ""}
                  image={event.image ?? ""}
                  latitude={Number(event.latitude ?? 0)}
                  longitude={Number(event.longitude ?? 0)}
                />
              ))}

            </div>

          )}

        </section>

      </div>

      <BottomNavigation />
    </main>
  );
}