"use client";

import Link from "next/link";

const categories = [
  { name: "Music", icon: "♪", bg: "bg-pink-50", color: "text-pink-500" },
  { name: "Festival", icon: "✦", bg: "bg-orange-50", color: "text-orange-500" },
  { name: "Market", icon: "⌂", bg: "bg-yellow-50", color: "text-yellow-600" },
  { name: "Food & Drink", icon: "♨", bg: "bg-emerald-50", color: "text-emerald-500" },
  { name: "Sport", icon: "⚽", bg: "bg-blue-50", color: "text-blue-500" },
  { name: "Family", icon: "♧", bg: "bg-violet-50", color: "text-violet-500" },
  { name: "Arts & Culture", icon: "◇", bg: "bg-fuchsia-50", color: "text-fuchsia-500" },
  { name: "Nightlife", icon: "☾", bg: "bg-sky-50", color: "text-sky-500" },
  { name: "Comedy", icon: "☺", bg: "bg-teal-50", color: "text-teal-500" },
  { name: "Theatre", icon: "▣", bg: "bg-amber-50", color: "text-amber-500" },
  { name: "Exhibitions", icon: "▤", bg: "bg-rose-50", color: "text-rose-500" },
  { name: "Workshop", icon: "⚒", bg: "bg-cyan-50", color: "text-cyan-500" },
  { name: "Charity", icon: "♡", bg: "bg-red-50", color: "text-red-500" },
  { name: "Community", icon: "♧", bg: "bg-lime-50", color: "text-lime-600" },
  { name: "Retreat", icon: "⌂", bg: "bg-indigo-50", color: "text-indigo-500" },
];

const homeCategories = categories.slice(0, 6);

export default function CategoryChips() {
  return (
    <div className="min-w-0">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible">
        {homeCategories.map((category) => (
          <Link
            key={category.name}
            href={`/search?category=${encodeURIComponent(category.name)}`}
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full ${category.bg} px-3.5 transition hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]`}
          >
            <span className={`text-base ${category.color}`}>
              {category.icon}
            </span>

            <span className="whitespace-nowrap text-[12px] font-bold text-[#102b52]">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}