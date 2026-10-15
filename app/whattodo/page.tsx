
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

export default function WhatToDoPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<WhatToDo[]>([]);
  const [loading, setLoading] = useState(true);

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

      {/* Cards */}
      <section className="mx-auto max-w-6xl px-3 py-6">

        {loading ? (
          <p className="py-10 text-center text-sm text-gray-500">
            {t("Loading...")}
          </p>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            {t("Nothing to see here… yet!")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">

            {items.map((item) => (
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
