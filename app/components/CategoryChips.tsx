"use client";

import Link from "next/link";

const categories = [
  { name: "Music", icon: "music" },
  { name: "Food & Drink", icon: "food" },
  { name: "Markets", icon: "market" },
  { name: "Family", icon: "family" },
  { name: "Sport", icon: "sport" },
  { name: "Culture", icon: "culture" },
  { name: "Nightlife", icon: "nightlife" },
  { name: "Festivals", icon: "festival" },
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
        <svg viewBox="0 0 48 48" className="h-12 w-12" {...commonProps}>
          <path d="M19 34V11l19-4v23" />
          <path d="M19 18l19-4" />
          <circle cx="12" cy="35" r="7" />
          <circle cx="31" cy="31" r="7" />
        </svg>
      );

    case "food":
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12" {...commonProps}>
          <path d="M10 7v15" />
          <path d="M6 7v8a4 4 0 0 0 8 0V7" />
          <path d="M10 22v19" />
          <path d="M25 7v34" />
          <path d="M25 7c8 3 8 11 0 14" />
        </svg>
      );

    case "market":
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12" {...commonProps}>
          <path d="M8 18h32l-3-9H11l-3 9Z" />
          <path d="M10 18v22h28V18" />
          <path d="M16 18v4a5 5 0 0 0 10 0v-4" />
          <path d="M26 18v4a5 5 0 0 0 10 0v-4" />
          <path d="M18 40V29h8v11" />
        </svg>
      );

    case "family":
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12" {...commonProps}>
          <circle cx="17" cy="15" r="5" />
          <circle cx="32" cy="15" r="5" />
          <path d="M7 36v-3a8 8 0 0 1 16 0v3" />
          <path d="M25 36v-3a8 8 0 0 1 16 0v3" />
        </svg>
      );

    case "sport":
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12" {...commonProps}>
          <circle cx="24" cy="24" r="17" />
          <path d="m24 13 5 4-2 6h-6l-2-6 5-4Z" />
          <path d="m19 23-5 4 2 6" />
          <path d="m27 23 5 4-2 6" />
          <path d="m18 33 6 4 6-4" />
        </svg>
      );

    case "culture":
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12" {...commonProps}>
          <path d="M8 14c4-4 9-4 14 0v20c-5-4-10-4-14 0V14Z" />
          <path d="M40 14c-4-4 9-4-14 0v20c5-4 10-4 14 0V14Z" />
          <path d="M15 21c2 2 4 2 6 0" />
          <path d="M27 21c2 2 4 2 6 0" />
        </svg>
      );

    case "nightlife":
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12" {...commonProps}>
          <path d="M34 8a16 16 0 1 0 6 28A16 16 0 0 1 34 8Z" />
        </svg>
      );

    case "festival":
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12" {...commonProps}>
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

    default:
      return null;
  }
}

export default function CategoryChips() {
  return (
    <section className="space-y-5">
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/search?category=${encodeURIComponent(
              category.name
            )}`}
            className="group rounded-3xl bg-white p-5 text-center shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#149EAF]/10 text-[#149EAF] transition group-hover:bg-[#149EAF] group-hover:text-white">
              <CategoryIcon type={category.icon} />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}