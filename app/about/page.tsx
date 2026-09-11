"use client";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useLanguage } from "../LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 pb-40">
      <Header />

      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">

        {/* INTRO */}
        <div className="rounded-3xl bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">

          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#149EAF] sm:text-sm">
            {t("ABOUT LOKLY")}
          </p>

          <h1 className="mt-3 text-[28px] font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {t("So, what’s on?")}
          </h1>

          <div className="mt-5 h-1 w-16 rounded-full bg-[#149EAF]" />

          <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t(
              "There’s always something happening across the Algarve, the tricky part is finding out about it."
            )}
          </p>

          {/* QUOTE */}
          <div className="mt-6 rounded-2xl bg-[#e5f3f5] px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex items-center gap-5 sm:gap-7">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-11 w-11 sm:h-12 sm:w-12"
                  fill="none"
                  viewBox="0 0 64 64"
                  stroke="#149EAF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 43c-7-3-11-9-11-17 0-11 9-19 20-19s20 8 20 19c0 8-4 14-11 17" />
                  <path d="M25 47h14" />
                  <path d="M27 52h10" />
                  <path d="M16 10l-4-4" />
                  <path d="M48 10l4-4" />
                  <path d="M9 24H3" />
                  <path d="M61 24h-6" />
                </svg>
              </div>

              <div className="border-l-2 border-[#b9e3e8] pl-5 sm:pl-7">
                <p className="text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                  {t("“If only I’d known about that, I would have gone.”")}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {t(
                    "A moment many of us have had - and exactly the problem Lokly is here to solve."
                  )}
                </p>
              </div>

            </div>
          </div>

          <p className="mt-7 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
            {t("That’s exactly the problem Lokly is here to solve.")}
          </p>

          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t(
              "There are markets, live music, festivals, family days, exhibitions, sports and all sorts of local events happening across the Algarve, but finding out about them isn’t always easy."
            )}
          </p>

          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t(
              "Lokly brings them together in one simple place, so you can discover what’s happening, where and when - and stop missing out on things you would have loved to go to."
            )}
          </p>

          {/* BUSINESSES & ORGANISERS */}
          <div className="mt-5 border-t border-slate-100 pt-5 sm:mt-6 sm:pt-6">

            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              {t(
                "Local businesses and organisers face the same challenge - getting the right information to the people who want to be there."
              )}
            </p>

            <p className="mt-4 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
              {t("Lokly brings the two together.")}
            </p>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {t(
                "A simple place for people to discover more of the Algarve - and for the people creating those experiences to be discovered."
              )}
            </p>

          </div>

        </div>

        {/* TWO SIDES */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">

          {/* FOR PEOPLE */}
          <div className="rounded-3xl bg-[#e5f3f5] p-6 sm:p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 64 64"
                  stroke="#149EAF"
                  strokeWidth="2.5"
                >
                  <circle cx="20" cy="23" r="7" />
                  <circle cx="32" cy="20" r="8" />
                  <circle cx="44" cy="23" r="7" />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 48c0-7 5-12 12-12 5 0 9 3 11 7"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 48c0-8 5-14 11-14s11 6 11 14"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M33 43c2-4 6-7 11-7 7 0 12 5 12 12"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                {t("For people")}
              </h2>

            </div>

            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              {t(
                "Discover more of the Algarve and find things to do without having to search in lots of different places."
              )}
            </p>

            <ul className="mt-6 space-y-3">

              <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  ✓
                </span>
                {t("Find events near you")}
              </li>

              <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  ✓
                </span>
                {t("Explore different categories")}
              </li>

              <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  ✓
                </span>
                {t("Save events you don't want to miss")}
              </li>

              <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  ✓
                </span>
                {t("Discover new places and experiences")}
              </li>

            </ul>
          </div>

          {/* FOR BUSINESSES */}
          <div className="rounded-3xl bg-[#fff7eb] p-6 sm:p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 64 64"
                  stroke="#f97316"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 27h44" />
                  <path d="M13 27l3-13h32l3 13" />
                  <path d="M13 27v25h38V27" />
                  <path d="M13 27c0 5 4 8 8 8s8-3 8-8" />
                  <path d="M29 27c0 5 4 8 8 8s8-3 8-8" />
                  <path d="M45 27c0 5 3 8 6 8 1 0 2-.2 3-.7" />
                  <path d="M25 52V39h14v13" />
                  <path d="M18 20h28" />
                </svg>
              </div>

              <h2 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                {t("For local businesses & organisers")}
              </h2>

            </div>

            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              {t(
                "Get your events in front of people who are looking for things to do in the Algarve."
              )}
            </p>

            <ul className="mt-6 space-y-3">

              <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  ✓
                </span>
                {t("Reach people looking for local events")}
              </li>

              <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  ✓
                </span>
                {t("Give your events more visibility")}
              </li>

              <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  ✓
                </span>
                {t("Help people discover your business")}
              </li>

              <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  ✓
                </span>
                {t("Support the local community")}
              </li>

            </ul>
          </div>

        </div>

        {/* FOUNDER */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="grid items-center md:grid-cols-[280px_1fr]">

            <div className="h-72 md:h-full">
              <img
                src="/images/ailsa-lokly.jpg"
                alt={t("Ailsa, founder of Lokly")}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-7 sm:p-10">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#149EAF]">
                {t("THE IDEA BEHIND LOKLY")}
              </p>

              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                {t("Built for the Algarve")}
              </h2>

              <p className="mt-5 text-base leading-relaxed text-slate-600">
                {t(
                  "Lokly was created with a simple aim - to make it easier for people to discover the events, activities and experiences that make the Algarve such a great place to live, visit and enjoy."
                )}
              </p>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {t(
                  "At the same time, Lokly aims to give local businesses and organisers another way to get their events noticed."
                )}
              </p>

              <p className="mt-6 text-lg font-bold text-slate-900">
                {t("Discover. Support. Enjoy the Algarve.")}
              </p>

            </div>
          </div>
        </div>

      </section>

      <BottomNavigation />
    </main>
  );
}