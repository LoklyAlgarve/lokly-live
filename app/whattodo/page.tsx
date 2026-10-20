
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "../LanguageContext";

type WhatToDo = {
  id: number;
  title: string;
  location: string | null;
  category: string | null;
  image: string | null;
};

const categories = [
  { name: "Arts & Culture", icon: "♧", color: "#8957E5" },
  { name: "Classes & Workshops", icon: "⚒", color: "#A36A00" },
  { name: "Outdoors & Nature", icon: "♣", color: "#20A66A" },
  { name: "Sport & Adventure", icon: "♧", color: "#3980F6" },
  { name: "Music & Dance", icon: "♫", color: "#EF3838" },
  { name: "Food & Drink", icon: "♜", color: "#F5A000" },
  { name: "Family & Kids", icon: "♧", color: "#A34CE5" },
  { name: "Tours & Experiences", icon: "⌖", color: "#0CA9A9" },
];

export default function WhatToDoPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<WhatToDo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadWhatToDo() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("what_to_do")
        .select("id, title, location, category, image")
        .eq("approved", true)
        .order("id", { ascending: true });

      if (error) {
        console.error("Could not load What to do:", error);
        setLoading(false);
        return;
      }

      setItems(data || []);
      setLoading(false);
    }

    loadWhatToDo();
  }, []);

  const filteredItems = selectedCategory
    ? items.filter((item) => {
        if (!item.category) return false;

        const categoryAliases: Record<string, string[]> = {
          "Arts & Culture": ["Arts & Culture"],
          "Classes & Workshops": ["Classes & Workshops"],
          "Outdoors & Nature": ["Outdoors & Adventure", "Outdoors & Nature"],
          "Sport & Adventure": ["Sport & Adventure", "Outdoors & Adventure"],
          "Music & Dance": ["Music & Dance", "Music"],
          "Food Experiences": ["Food Experiences", "Food & Drink"],
          "Family & Kids": ["Family & Kids", "Family"],
          "Tours & Experiences": ["Tours & Experiences", "Outdoors & Adventure"],
        };

        return (categoryAliases[selectedCategory] || [selectedCategory])
          .includes(item.category);
      })
    : items;

  return (
    <main className="min-h-screen bg-white text-[#172554]">

      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

          <Link
            href="/"
            className="flex items-center"
            aria-label="Lokly"
          >
            <img
              src="/images/Lokly_yellow.png"
              alt="Lokly"
              className="h-[58px] w-[120px] object-contain sm:h-[72px] sm:w-[145px]"
            />
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-gray-500 hover:text-[#172554]"
          >
            ← {t("Back to Events")}
          </Link>

        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#172554] px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl">

          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4B942]">
            {t("Discover more")}
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            {t("What to do")}
          </h1>

          <p className="mt-2 max-w-xl text-sm text-white/75">
            {t("Discover places, experiences and local favourites around the Algarve.")}
          </p>

        </div>
      </section>

      {/* Things to Do Categories */}
      <section className="mx-auto max-w-6xl px-3 pt-6">
        <div className="grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-8">

          {categories.map((category) => {
            const isSelected = selectedCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category.name)
                }
                aria-pressed={isSelected}
                className="flex min-w-0 flex-col items-center gap-2 rounded-xl px-1 py-1 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0CA9B7]"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-2xl font-bold text-white shadow-md transition sm:h-12 sm:w-12 ${
                    isSelected ? "ring-4 ring-gray-200 scale-105" : ""
                  }`}
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </span>

                <span className="text-center text-[10px] font-semibold leading-tight text-[#172554] sm:text-xs">
                  {t(category.name)}
                </span>
              </button>
            );
          })}

        </div>

        {selectedCategory && (
          <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-sm text-[#172554]">
              {t(selectedCategory)}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-[#0CA9B7] hover:underline"
            >
              {t("Show all")}
            </button>
          </div>
        )}
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-6xl px-3 py-6">

        {loading ? (
          <p className="py-10 text-center text-sm text-gray-500">
            {t("Loading...")}
          </p>
        ) : filteredItems.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            {selectedCategory
              ? t("No activities found in this category.")
              : t("Nothing to see here… yet!")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">

            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={`/whattodo/${item.id}`}
                className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

                  {item.image ? (
                    <img
                      src={`/${item.image}`}
                      alt={item.title}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#172554]">
                      <span className="text-2xl text-[#F4B942]">
                        ★
                      </span>
                    </div>
                  )}

                </div>

                {/* Summary */}
                <div className="p-3">

                  {/* Category */}
                  {item.category && (
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#C69A22]">
                      {t(item.category)}
                    </p>
                  )}

                  {/* Title */}
                  <h2 className="line-clamp-2 text-sm font-bold leading-tight text-[#172554]">
                    {item.title}
                  </h2>

                  {/* Location */}
                  {item.location && (
                    <p className="mt-1.5 line-clamp-1 text-xs text-gray-500">
                      📍 {item.location}
                    </p>
                  )}

                  {/* Details */}
                  <div className="mt-3 text-xs font-bold text-[#C69A22]">
                    {t("View details")} →
                  </div>

                </div>

              </Link>
            ))}

          </div>
        )}

      </section>
    </main>
  );
}
