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

      <section className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-8">

        {/* INTRO */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#149EAF] sm:text-sm">
            {t("SPREAD THE WORD")}
          </p>

          <h1 className="mt-2 text-[28px] font-black leading-tight text-slate-900 sm:text-5xl">
            {t("Tell a friend about Lokly")}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-lg">
            {t(
              "Know someone who'd love to know what's happening in the Algarve? Send them Lokly and help them discover what's going on."
            )}
          </p>
        </div>

        {/* SHARE */}
        <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-sm sm:mt-8 sm:rounded-3xl sm:p-10">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#149EAF]/10 text-[#149EAF] sm:h-20 sm:w-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 sm:h-10 sm:w-10"
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

          <h2 className="mt-4 text-xl font-black text-slate-900 sm:mt-7 sm:text-2xl">
            {t("Share Lokly")}
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-base">
            {t(
              "Markets, music, festivals, food, family events and plenty more - there might be something your friends don't know about yet."
            )}
          </p>

          <div className="mt-5 grid gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3">

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

        {/* ADD TO HOME SCREEN */}
        <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm sm:mt-8 sm:rounded-3xl sm:p-9">

          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#149EAF]/10 text-[#149EAF] sm:h-16 sm:w-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v12"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m7 8 5-5 5 5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 14v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-900 sm:mt-6 sm:text-2xl">
              {t("Want Lokly one tap away?")}
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-base">
              {t(
                "Add Lokly to your phone's home screen and it'll be there whenever you're wondering what's on."
              )}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5">

            <div className="rounded-xl bg-[#e5f3f5] p-4 sm:rounded-2xl sm:p-6">
              <h3 className="text-base font-black text-slate-900 sm:text-lg">
                {t("iPhone & iPad")}
              </h3>

              <ol className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-600 sm:mt-4 sm:space-y-2 sm:text-sm">
                <li>
                  <strong>1.</strong>{" "}
                  {t("Open lokly.live in Safari.")}
                </li>

                <li>
                  <strong>2.</strong>{" "}
                  {t("Tap the Share button.")}
                </li>

                <li>
                  <strong>3.</strong>{" "}
                  {t("Tap Add to Home Screen.")}
                </li>

                <li>
                  <strong>4.</strong>{" "}
                  {t("Tap Add.")}
                </li>
              </ol>
            </div>

            <div className="rounded-xl bg-slate-100 p-4 sm:rounded-2xl sm:p-6">
              <h3 className="text-base font-black text-slate-900 sm:text-lg">
                Android
              </h3>

              <ol className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-600 sm:mt-4 sm:space-y-2 sm:text-sm">
                <li>
                  <strong>1.</strong>{" "}
                  {t("Open lokly.live in Chrome.")}
                </li>

                <li>
                  <strong>2.</strong>{" "}
                  {t("Tap the ⋮ menu.")}
                </li>

                <li>
                  <strong>3.</strong>{" "}
                  {t(
                    "Tap Add to Home screen or Install app."
                  )}
                </li>

                <li>
                  <strong>4.</strong>{" "}
                  {t("Tap Add or Install.")}
                </li>
              </ol>
            </div>

          </div>
        </div>

        {/* FINAL QUOTE */}
        <div className="mt-5 rounded-2xl bg-[#e5f3f5] p-5 text-center sm:mt-8 sm:rounded-3xl sm:p-9">
          <p className="text-sm font-bold text-slate-900 sm:text-lg">
            {t("Because nobody wants to hear...")}
          </p>

          <p className="mt-2 text-base font-black text-[#149EAF] sm:mt-3 sm:text-xl">
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