"use client";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useLanguage } from "../LanguageContext";

export default function CharityPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 pb-32 sm:pb-40">
      <Header />

      <section className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-8">

        {/* INTRO */}
        <div className="rounded-3xl bg-white px-5 py-6 shadow-sm sm:px-10 sm:py-10">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#149EAF] sm:text-sm">
            {t("CHARITY")}
          </p>

          <h1 className="mt-2 text-[28px] font-black leading-[1.05] tracking-tight text-slate-900 sm:mt-3 sm:text-4xl">
            {t("Supporting our community")}
          </h1>

          <div className="mt-4 h-1 w-16 rounded-full bg-[#149EAF] sm:mt-5" />

          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg">
            {t(
              "We want to help make sure people know about the charity events happening around the Algarve."
            )}
          </p>

          {/* FEATURE CARD */}
          <div className="mt-6 rounded-2xl bg-[#e5f3f5] px-4 py-5 sm:mt-7 sm:px-8 sm:py-7">
            <div className="flex items-center gap-4 sm:gap-7">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center sm:h-20 sm:w-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 sm:h-16 sm:w-16"
                  fill="none"
                  viewBox="0 0 64 64"
                  stroke="#149EAF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 52V36c0-4 3-7 7-7 2 0 4 1 5 3 1-2 3-3 5-3 4 0 7 3 7 7v16" />
                  <path d="M20 36c-3-5-8-8-11-4-2 3 0 7 4 11l8 9" />
                  <path d="M44 36c3-5 8-8 11-4 2 3 0 7-4 11l-8 9" />
                  <path d="M32 30c-7-5-13-9-13-15 0-4 3-7 7-7 3 0 5 2 6 4 1-2 3-4 6-4 4 0 7 3 7 7 0 6-6 10-13 15Z" />
                </svg>
              </div>

              <div className="border-l-2 border-[#b9e3e8] pl-4 sm:pl-7">
                <p className="text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                  {t("Make a difference locally")}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-base">
                  {t(
                    "Supporting local causes and helping people discover what is happening in their community."
                  )}
                </p>
              </div>

            </div>
          </div>

          {/* FIND CHARITY EVENTS */}
          <div className="mt-7 sm:mt-9">

            <p className="text-xl font-black leading-tight text-slate-900 sm:text-2xl">
              {t("Charity events are listed separately so they are easy to find.")}
            </p>

            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:mt-4 sm:text-lg">
              {t(
                "They won’t appear in the main event listings, but you can find them by selecting Charity from the categories on Lokly."
              )}
            </p>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
              {t(
                "It also fits with our approach to sustainability - supporting local organisations, local communities and the places we live in."
              )}
            </p>

          </div>

        </div>

        {/* FOR CHARITY ORGANISERS */}
        <div className="mt-6 rounded-3xl bg-[#fff7eb] p-5 sm:mt-8 sm:p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm sm:h-14 sm:w-14">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#f97316"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M8 3v4M16 3v4M4 9h16" />
                <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
              </svg>
            </div>

            <h2 className="text-xl font-black leading-tight text-slate-900 sm:text-3xl">
              {t("For charity organisers")}
            </h2>

          </div>

          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
            {t(
              "If you’re organising a charity event in the Algarve, we’d love to hear about it."
            )}
          </p>

          <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">

            <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                ✓
              </span>
              {t("Give your charity event more visibility")}
            </li>

            <li className="flex items-center gap-3 text-sm text-slate-700 sm:text-base">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                ✓
              </span>
              {t("Help people discover your cause")}
            </li>

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
              {t("Support the local community")}
            </li>

          </ul>

          <p className="mt-5 text-base font-semibold leading-relaxed text-slate-900 sm:mt-6 sm:text-lg">
            {t(
              "We’ll help give charity events visibility on Lokly and promote them to our local community."
            )}
          </p>

        </div>

      </section>

      <BottomNavigation />
    </main>
  );
}
