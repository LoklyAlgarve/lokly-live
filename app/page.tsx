"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const ALGARVE_CONCELHOS = [
  "Albufeira",
  "Alcoutim",
  "Aljezur",
  "Castro Marim",
  "Faro",
  "Lagoa",
  "Lagos",
  "Loulé",
  "Monchique",
  "Olhão",
  "Portimão",
  "São Brás de Alportel",
  "Silves",
  "Tavira",
  "Vila do Bispo",
  "Vila Real de Santo António",
];

type QuickFilter =
  | ""
  | "near"
  | "today"
  | "weekend"
  | "free";

type CategoryIconName =
  | "music"
  | "food"
  | "theatre"
  | "arts"
  | "wellbeing"
  | "outdoor"
  | "family"
  | "sport"
  | "festival"
  | "retreat"
  | "nightlife"
  | "community"
  | "comedy"
  | "exhibitions"
  | "workshop";

type Category = {
  label: string;
  filter: string;
  icon: CategoryIconName;
  color: string;
};

const mainCategories: Category[] = [
  {
    label: "Music",
    filter: "Music",
    icon: "music",
    color: "#E53935",
  },
  {
    label: "Food & Drink",
    filter: "Food & Drink",
    icon: "food",
    color: "#F59E0B",
  },
  {
    label: "Theatre",
    filter: "Theatre",
    icon: "theatre",
    color: "#7C3AED",
  },
  {
    label: "Arts & Culture",
    filter: "Arts & Culture",
    icon: "arts",
    color: "#8B5CF6",
  },
  {
    label: "Wellbeing",
    filter: "Wellbeing",
    icon: "wellbeing",
    color: "#22C55E",
  },
  {
    label: "Outdoor",
    filter: "Outdoor",
    icon: "outdoor",
    color: "#EAB308",
  },
  {
    label: "Family",
    filter: "Family",
    icon: "family",
    color: "#A855F7",
  },
  {
    label: "Sport",
    filter: "Sport",
    icon: "sport",
    color: "#3B82F6",
  },
  {
    label: "Festivals",
    filter: "Festival",
    icon: "festival",
    color: "#EC4899",
  },
  {
    label: "Retreats",
    filter: "Retreat",
    icon: "retreat",
    color: "#14B8A6",
  },
  {
    label: "Nightlife",
    filter: "Nightlife",
    icon: "nightlife",
    color: "#4F46E5",
  },
  {
    label: "Community",
    filter: "Community",
    icon: "community",
    color: "#10B981",
  },
  {
    label: "Comedy",
    filter: "Comedy",
    icon: "comedy",
    color: "#F97316",
  },
  {
    label: "Exhibitions",
    filter: "Exhibitions",
    icon: "exhibitions",
    color: "#9333EA",
  },
  {
    label: "Workshops",
    filter: "Workshop",
    icon: "workshop",
    color: "#A16207",
  },
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

    case "theatre":
      return (
        <svg {...common}>
          <path d="M3 6h18v12H3z" />
          <path d="M7 10c.8-1 2.2-1 3 0" />
          <path d="M14 10c.8-1 2.2-1 3 0" />
          <path d="M7 14c1.2 1 2.8 1 4 0" />
          <path d="M13 14c1.2 1 2.8 1 4 0" />
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

    case "wellbeing":
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.4-7-10.2C5 6.8 7.1 5 9.4 5c1.4 0 2.5.7 3.1 1.8C13.1 5.7 14.2 5 15.6 5 17.9 5 20 6.8 20 9.8 20 15.6 12 20 12 20Z" />
        </svg>
      );

    case "outdoor":
      return (
        <svg {...common}>
          <circle cx="17" cy="6" r="2.5" />
          <path d="m3 19 6-8 4 5 2-3 6 6" />
          <path d="M3 19h18" />
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

    case "retreat":
      return (
        <svg {...common}>
          <path d="M12 21c4-2 6-5.2 6-9.2C18 7.5 15.5 4 12 3 8.5 4 6 7.5 6 11.8 6 15.8 8 19 12 21Z" />
          <path d="M12 3v15" />
          <path d="M8 10c2 .5 3.3 1.5 4 3" />
          <path d="M16 10c-2 .5-3.3 1.5-4 3" />
        </svg>
      );

    case "nightlife":
      return (
        <svg {...common}>
          <path d="M8 3h8" />
          <path d="m10 3 1 7.5L7 19a1 1 0 0 0 .8 1.6h8.4A1 1 0 0 0 17 19l-4-8.5L14 3" />
          <path d="M9 16h6" />
          <path d="M18 5v3" />
          <path d="M16.5 6.5h3" />
        </svg>
      );

    case "community":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="2.5" />
          <circle cx="16" cy="8" r="2.5" />
          <circle cx="12" cy="6" r="2.5" />
          <path d="M3.5 19c.5-3 2.2-4.5 4.5-4.5s4 1.5 4.5 4.5" />
          <path d="M11.5 19c.5-3 2.2-4.5 4.5-4.5s4 1.5 4.5 4.5" />
        </svg>
      );

    case "comedy":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M8 14c1.2 2 2.5 3 4 3s2.8-1 4-3" />
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

function parseEventDate(value?: string) {
  if (!value) return null;

  const trimmed = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] =
      trimmed.split("-").map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] =
      trimmed.split("/").map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const [day, month, year] =
      trimmed.split("-").map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  const parsed = new Date(trimmed);

  return Number.isNaN(
    parsed.getTime()
  )
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

function isSameDay(
  a: Date,
  b: Date
) {
  return (
    a.getFullYear() ===
      b.getFullYear() &&
    a.getMonth() ===
      b.getMonth() &&
    a.getDate() ===
      b.getDate()
  );
}

function isThisWeekend(
  date: Date
) {
  const today =
    startOfDay(new Date());

  const day =
    today.getDay();

  const daysUntilSaturday =
    (6 - day + 7) % 7;

  const saturday =
    new Date(today);

  saturday.setDate(
    today.getDate() +
      daysUntilSaturday
  );

  const sunday =
    new Date(saturday);

  sunday.setDate(
    saturday.getDate() + 1
  );

  const eventDay =
    startOfDay(date);

  return (
    eventDay >= saturday &&
    eventDay <= sunday
  );
}

function getEventLocation(
  event: any
) {
  return String(
    event.location ??
      event.town ??
      event.city ??
      event.venue ??
      ""
  ).trim();
}

function getEventCategory(
  event: any
) {
  return String(
    event.category ?? ""
  ).trim();
}

function normalizeConcelho(
  value: any
) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim()
    .toLowerCase();
}

function getEventConcelho(
  event: any
) {
  return normalizeConcelho(
    event.concelho ??
      event.algarve_concelho ??
      ""
  );
}

function getEventPrice(
  event: any
) {
  return String(
    event.price ?? ""
  ).trim();
}

function isFreeEvent(
  event: any
) {
  const price =
    getEventPrice(event)
      .toLowerCase();

  return (
    price === "" ||
    price === "free" ||
    price === "0" ||
    price === "€0" ||
    price === "0€"
  );
}

function getCoordinates(
  event: any
) {
  const lat = Number(
    event.latitude ??
      event.lat
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
  const earthRadius =
    6371;

  const dLat =
    ((lat2 - lat1) *
      Math.PI) /
    180;

  const dLon =
    ((lon2 - lon1) *
      Math.PI) /
    180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return (
    earthRadius * c
  );
}

export default function HomePage() {
  const { t } =
    useLanguage();

  const [events, setEvents] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const touchStartY =
    useRef(0);

  const pulling =
    useRef(false);

  const [quickFilter, setQuickFilter] =
    useState<QuickFilter>("");

  const [eventFilter, setEventFilter] =
    useState("");

  const [locationFilter, setLocationFilter] =
    useState("");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [userLocation, setUserLocation] =
    useState<{
      lat: number;
      lng: number;
    } | null>(null);

  async function refreshEvents() {
    if (refreshing) return;

    setRefreshing(true);

    try {
      const data =
        await getEvents();

      setEvents(
        data || []
      );
    } catch (error) {
      console.error(
        "Failed to refresh events:",
        error
      );
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    async function loadEvents() {
      try {
        const data =
          await getEvents();

        setEvents(
          data || []
        );
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

  useEffect(() => {
    function handleTouchStart(
      e: TouchEvent
    ) {
      if (
        window.scrollY === 0
      ) {
        touchStartY.current =
          e.touches[0].clientY;

        pulling.current =
          true;
      }
    }

    function handleTouchEnd(
      e: TouchEvent
    ) {
      if (
        !pulling.current
      ) {
        return;
      }

      const distance =
        e.changedTouches[0]
          .clientY -
        touchStartY.current;

      pulling.current =
        false;

      if (
        distance > 80 &&
        window.scrollY === 0
      ) {
        refreshEvents();
      }
    }

    window.addEventListener(
      "touchstart",
      handleTouchStart
    );

    window.addEventListener(
      "touchend",
      handleTouchEnd
    );

    return () => {
      window.removeEventListener(
        "touchstart",
        handleTouchStart
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd
      );
    };
  }, [refreshing]);

  const eventCategories =
    useMemo(() => {
      return Array.from(
        new Set(
          events
            .map(
              getEventCategory
            )
            .filter(Boolean)
        )
      ).sort((a, b) =>
        a.localeCompare(b)
      );
    }, [events]);

  function handleQuickFilter(
    filter: QuickFilter
  ) {
    setQuickFilter(
      (current) =>
        current === filter
          ? ""
          : filter
    );

    if (
      filter === "near"
    ) {
      if (
        !navigator.geolocation
      ) {
        alert(
          t(
            "Location is not available on this device."
          )
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat:
              position.coords
                .latitude,
            lng:
              position.coords
                .longitude,
          });
        },
        () => {
          alert(
            t(
              "We couldn't access your location. Please check your location permissions."
            )
          );
        },
        {
          enableHighAccuracy:
            true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  }

  function handleCategoryClick(
    filter: string
  ) {
    setEventFilter(
      (current) =>
        current === filter
          ? ""
          : filter
    );

    setQuickFilter("");

    setUserLocation(null);
  }

  function clearFilters() {
    setEventFilter("");
    setLocationFilter("");
    setQuickFilter("");
    setUserLocation(null);
  }

  const filteredEvents =
    useMemo(() => {
      const today =
        startOfDay(
          new Date()
        );

      let result = [
        ...events,
      ];

      if (eventFilter) {
        result =
          result.filter(
            (event) =>
              getEventCategory(
                event
              ).toLowerCase() ===
              eventFilter.toLowerCase()
          );
      }

      if (locationFilter) {
        const selectedConcelho =
          normalizeConcelho(
            locationFilter
          );

        result =
          result.filter(
            (event) =>
              getEventConcelho(
                event
              ) ===
              selectedConcelho
          );
      }

      if (
        quickFilter ===
        "today"
      ) {
        result =
          result.filter(
            (event) => {
              const date =
                parseEventDate(
                  event.date
                );

              return date
                ? isSameDay(
                    date,
                    today
                  )
                : false;
            }
          );
      }

      if (
        quickFilter ===
        "weekend"
      ) {
        result =
          result.filter(
            (event) => {
              const date =
                parseEventDate(
                  event.date
                );

              return date
                ? isThisWeekend(
                    date
                  )
                : false;
            }
          );
      }

      if (
        quickFilter ===
        "free"
      ) {
        result =
          result.filter(
            isFreeEvent
          );
      }

      if (
        quickFilter ===
          "near" &&
        userLocation
      ) {
        result =
          result.filter(
            (event) => {
              const coordinates =
                getCoordinates(
                  event
                );

              if (
                !coordinates
              ) {
                return false;
              }

              const distance =
                distanceKm(
                  userLocation.lat,
                  userLocation.lng,
                  coordinates.lat,
                  coordinates.lng
                );

              return (
                distance <= 10
              );
            }
          );
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

      {refreshing && (
        <div className="py-2 text-center text-xs font-semibold text-[#149EAF]">
          {t(
            "Refreshing events..."
          )}
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* CATEGORIES */}

        <div className="mt-3 overflow-hidden sm:mt-4">
          <div
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            style={{
              WebkitOverflowScrolling:
                "touch",
            }}
          >
            {mainCategories.map(
              (category) => {
                const active =
                  eventFilter.toLowerCase() ===
                  category.filter.toLowerCase();

                return (
                  <button
                    key={
                      category.label
                    }
                    type="button"
                    onClick={() =>
                      handleCategoryClick(
                        category.filter
                      )
                    }
                    className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 text-center"
                    aria-label={t(
                      category.label
                    )}
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                        active
                          ? "ring-4 ring-[#149EAF]/20"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          category.color,
                      }}
                    >
                      <span className="h-6 w-6 text-white">
                        <CategoryIcon
                          name={
                            category.icon
                          }
                        />
                      </span>
                    </span>

                    <span
                      className={`whitespace-nowrap text-[10px] font-bold leading-tight ${
                        active
                          ? "text-[#149EAF]"
                          : "text-[#102F56]"
                      }`}
                    >
                      {t(
                        category.label
                      )}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* SEARCH */}

        <div className="mt-3 sm:mt-4">
          <SearchBar />
        </div>

        {/* QUICK FILTERS */}

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:mt-4 sm:gap-3">

          {[
            [
              "near",
              t("Near Me"),
            ],
            [
              "today",
              t("Today"),
            ],
            [
              "weekend",
              t("This Weekend"),
            ],
            [
              "free",
              t("Free"),
            ],
          ].map(
            ([value, label]) => {
              const active =
                quickFilter ===
                value;

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
            }
          )}

        </div>

        {/* FILTER TOGGLE */}

        <button
          type="button"
          onClick={() =>
            setFiltersOpen(
              (open) => !open
            )
          }
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#E6FAFC] px-4 py-3.5 text-sm font-bold text-[#102F56] transition hover:bg-[#DDF7FA] sm:mt-4 sm:py-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 5h16M7 12h10M10 19h4"
            />
          </svg>

          <span>
            {t("Filters")}
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${
              filtersOpen
                ? "rotate-180"
                : ""
            }`}
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
        </button>

        {/* FILTER PANEL */}

        {filtersOpen && (
          <section className="mt-2 rounded-2xl bg-[#E6FAFC] p-3 sm:mt-3 sm:p-5">

            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-600">
                {t(
                  "Filter events"
                )}
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-xs font-bold text-[#149EAF] hover:underline"
              >
                {t(
                  "Clear filters"
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">

              {/* EVENT TYPE */}

              <div>
                <label
                  htmlFor="event-filter"
                  className="mb-1 block text-xs font-semibold text-slate-600 sm:text-sm"
                >
                  {t(
                    "Event type"
                  )}
                </label>

                <div className="relative">

                  <select
                    id="event-filter"
                    value={
                      eventFilter
                    }
                    onChange={(e) =>
                      setEventFilter(
                        e.target.value
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20 sm:px-4"
                  >
                    <option value="">
                      {t(
                        "All event types"
                      )}
                    </option>

                    {eventCategories.map(
                      (category) => (
                        <option
                          key={
                            category
                          }
                          value={
                            category
                          }
                        >
                          {t(
                            category
                          )}
                        </option>
                      )
                    )}
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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

              {/* LOCATION */}

              <div>
                <label
                  htmlFor="location-filter"
                  className="mb-1 block text-xs font-semibold text-slate-600 sm:text-sm"
                >
                  {t(
                    "Location"
                  )}
                </label>

                <div className="relative">

                  <select
                    id="location-filter"
                    value={
                      locationFilter
                    }
                    onChange={(e) =>
                      setLocationFilter(
                        e.target.value
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20 sm:px-4"
                  >
                    <option value="">
                      {t(
                        "All concelhos"
                      )}
                    </option>

                    {ALGARVE_CONCELHOS.map(
                      (concelho) => (
                        <option
                          key={
                            concelho
                          }
                          value={
                            concelho
                          }
                        >
                          {concelho}
                        </option>
                      )
                    )}
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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
        )}

        {/* EVENTS */}

        <section className="mt-5 sm:mt-7">

          <div className="mb-2.5 sm:mb-4">

            <h2
              className="text-xl font-black tracking-tight sm:text-2xl"
              style={{
                color: T.navy,
              }}
            >
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
              {t(
                "Loading events..."
              )}
            </div>

          ) : filteredEvents.length ===
            0 ? (

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
                {t(
                  "Nothing to see here… yet!"
                )}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {t(
                  "Try changing your filters."
                )}
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
                    location={getEventLocation(
                      event
                    )}
                    date={
                      event.date ??
                      ""
                    }
                    category={getEventCategory(
                      event
                    )}
                    image={
                      event.image ??
                      ""
                    }
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