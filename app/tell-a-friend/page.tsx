"use client";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useLanguage } from "../LanguageContext";

export default function TellAFriendPage() {
  const { t } = useLanguage();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        "https://www.lokly.live"
      );

      alert(t("Lokly link copied!"));
    } catch {
      alert(
        t("Copying the link wasn't available on this device.")
      );
    }
  }

  const whatsappMessage = t(
    "Have you found Lokly yet? It's a great way to discover what's happening in the Algarve: https://www.lokly.live"
  );

  const emailSubject = t("Have you found Lokly?");

  return (
    <main className="min-h-screen bg-slate-50 pb-32 sm:pb-40">
      <Header />

      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">

        {/* INTRO */}
        <div className="text-center">

          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#149EAF] sm:text-sm">
            {t("SPREAD THE WORD")}
          </p>

          <h1 className="mt-3 text-[28px] font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {t("Tell a friend about Lokly")}
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#149EAF]" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t(
              "Know someone who'd love to know what's happening in the Algarve? Send them Lokly and help them discover what's going on."
            )}
          </p>

        </div>

        {/* SHARE */}
        <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-sm sm:mt-8 sm:rounded-3xl sm:p-10">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#149EAF]/10 text-[#149EAF] sm:h-16 sm:w-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-9 sm:w-9"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16v-7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.5 12.5 3.5-3.5 3.5 3.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5h14v14H5z"
              />
            </svg>
          </div>

          <h2 className="mt-5 text-2xl font-black text-slate-900 sm:mt-6 sm:text-3xl">
            {t("Share Lokly")}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t(
              "Markets, music, festivals, food, family events and plenty more - there might be something your friends don't know about yet."
            )}
          </p>

          <div className="mt-6 grid gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3">

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center rounded-xl bg-[#149EAF] px-4 text-sm font-bold text-white transition hover:opacity-90 active:scale-[0.98] sm:min-h-14 sm:rounded-2xl sm:px-5 sm:text-base"
            >
              {t("Share on WhatsApp")}
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent(
                emailSubject
              )}&body=${encodeURIComponent(
                whatsappMessage
              )}`}
              className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] sm:min-h-14 sm:rounded-2xl sm:px-5 sm:text-base"
            >
              {t("Share by Email")}
            </a>

            <button
              type="button"
              onClick={copyLink}
              className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] sm:min-h-14 sm:rounded-2xl sm:px-5 sm:text-base"
            >
              {t("Copy Link")}
            </button>

          </div>
        </div>

        {/* FINAL QUOTE */}
        <div className="mt-6 rounded-2xl bg-[#e5f3f5] p-6 text-center sm:mt-8 sm:rounded-3xl sm:p-9">

          <p className="text-base font-bold text-slate-900 sm:text-lg">
            {t("Because nobody wants to hear...")}
          </p>

          <p className="mt-3 text-lg font-black text-[#149EAF] sm:text-xl">
            {t(
              '"Oh, you should have gone - it was brilliant."'
            )}
          </p>

        </div>

      </section>

      <BottomNavigation />
    </main>
  );
}