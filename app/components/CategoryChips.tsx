"use client";

import Link from "next/link";

const categories = [
  { name: "Music", icon: "music" },
  { name: "Festival", icon: "festival" },
  { name: "Market", icon: "market" },
  { name: "Food & Drink", icon: "food" },
  { name: "Sport", icon: "sport" },
  { name: "Family", icon: "family" },
  { name: "Arts & Culture", icon: "culture" },
  { name: "Nightlife", icon: "nightlife" },
  { name: "Comedy", icon: "comedy" },
  { name: "Theatre", icon: "theatre" },
  { name: "Exhibitions", icon: "exhibition" },
  { name: "Workshop", icon: "workshop" },
  { name: "Charity", icon: "charity" },
  { name: "Community", icon: "community" },
  { name: "Retreat", icon: "retreat" },
];

function CategoryIcon({ type }: { type: string }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "music":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="M19 34V11l19-4v23" />
          <path d="M19 18l19-4" />
          <circle cx="12" cy="35" r="7" />
          <circle cx="31" cy="31" r="7" />
        </svg>
      );

    case "festival":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="M12 39 25 9" />
          <path d="M25 9c5 1 9 4 12 8-6 2-11 1-15-2" />
          <path d="M13 17H8" />
          <path d="M10 11V7" />
          <path d="m7 8-3-3" />
          <path d="m14 8 3-3" />
          <path d="M34 30v-5" />
          <path d="M30 27h-5" />
          <path d="M38 27h5" />
          <path d="m34 34-3 3" />
          <path d="m38 34 3 3" />
        </svg>
      );

    case "market":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="M8 18h32l-3-9H11l-3 9Z" />
          <path d="M10 18v22h28V18" />
          <path d="M16 18v4a5 5 0 0 0 10 0v-4" />
          <path d="M26 18v4a5 5 0 0 0 10 0v-4" />
          <path d="M18 40V29h8v11" />
        </svg>
      );

    case "food":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="M10 7v15" />
          <path d="M6 7v8a4 4 0 0 0 8 0V7" />
          <path d="M10 22v19" />
          <path d="M25 7v34" />
          <path d="M25 7c8 3 8 11 0 14" />
        </svg>
      );

    case "sport":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <circle cx="24" cy="24" r="17" />
          <path d="m24 13 5 4-2 6h-6l-2-6 5-4Z" />
          <path d="m19 23-5 4 2 6" />
          <path d="m27 23 5 4-2 6" />
          <path d="m18 33 6 4 6-4" />
        </svg>
      );

    case "family":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <circle cx="17" cy="15" r="5" />
          <circle cx="32" cy="15" r="5" />
          <path d="M7 36v-3a8 8 0 0 1 16 0v3" />
          <path d="M25 36v-3a8 8 0 0 1 16 0v3" />
        </svg>
      );

    case "culture":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="M8 14c4-4 9-4 14 0v20c-5-4-10-4-14 0V14Z" />
          <path d="M40 14c-4-4-9-4-14 0v20c5-4 10-4 14 0V14Z" />
          <path d="M15 21c2 2 4 2 6 0" />
          <path d="M27 21c2 2 4 2 6 0" />
        </svg>
      );

    case "nightlife":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="M34 8a16 16 0 1 0 6 28A16 16 0 0 1 34 8Z" />
        </svg>
      );

    case "comedy":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <circle cx="24" cy="24" r="17" />
          <circle cx="18" cy="20" r="1.5" fill="currentColor" />
          <circle cx="30" cy="20" r="1.5" fill="currentColor" />
          <path d="M16 28c3 5 13 5 16 0" />
        </svg>
      );

    case "theatre":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="M10 10h28v28H10z" />
          <path d="M16 19c2-3 5-3 7 0" />
          <path d="M25 19c2-3 5-3 7 0" />
          <path d="M16 28c2 3 5 3 7 0" />
          <path d="M25 28c2 3 5 3 7 0" />
        </svg>
      );

    case "exhibition":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <rect x="8" y="10" width="32" height="28" rx="2" />
          <path d="M14 32l7-8 5 5 4-5 4 8" />
          <circle cx="29" cy="18" r="3" />
        </svg>
      );

    case "workshop":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="m29 8 11 11-20 20H9V28L29 8Z" />
          <path d="m25 12 11 11" />
          <path d="M14 34h8" />
        </svg>
      );

    case "charity":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="M24 39S9 30 9 18a8 8 0 0 1 15-4 8 8 0 0 1 15 4c0 12-15 21-15 21Z" />
        </svg>
      );

    case "community":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <circle cx="24" cy="15" r="5" />
          <circle cx="12" cy="21" r="4" />
          <circle cx="36" cy="21" r="4" />
          <path d="M15 37v-4a9 9 0 0 1 18 0v4" />
          <path d="M5 37v-3a7 7 0 0 1 7-7" />
          <path d="M43 37v-3a7 7 0 0 0-7-7" />
        </svg>
      );

    case "retreat":
      return (
        <svg viewBox="0 0 48 48" className="h-7 w-7" {...commonProps}>
          <path d="M8 36 24 10l16 26H8Z" />
          <path d="M17 36v-9h14v9" />
          <path d="M20 22h8" />
        </svg>
      );

    default:
      return null;
  }
}

export default function CategoryChips() {
  return (
    <section className="min-w-0 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-slate-900">
          Browse Categories
        </h3>

        <Link
          href="/search"
          className="text-sm font-semibold text-[#149EAF] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="min-w-0 overflow-x-auto pb-2 sm:overflow-visible">
        <div className="flex w-max gap-2.5 sm:grid sm:w-full sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/search?category=${encodeURIComponent(
                category.name
              )}`}
              className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-14 sm:px-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#149EAF]/10 text-[#149EAF]">
                <CategoryIcon type={category.icon} />
              </span>

              <span className="whitespace-nowrap">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}