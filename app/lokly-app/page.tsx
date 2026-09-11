"use client";

import Link from "next/link";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

export default function LoklyAppPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-6xl px-5 pb-28 pt-8 sm:px-6 sm:pt-12">

        {/* INTRO */}
        <section className="rounded-3xl bg-white px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#149EAF]/10 text-[#149EAF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <rect x="7" y="2.5" width="10" height="19" rx="2" />
              <path
                strokeLinecap="round"
                d="M10 5.5h4M11 18.5h2"
              />
            </svg>
          </div>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#149EAF] sm:text-sm">
            Lokly App
          </p>

          <h1 className="mt-3 text-[28px] font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
            We’d love to have our own app one day.
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#149EAF]" />

          <div className="mx-auto mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            <p>
              We’re a small, independent business and, for now, building a
              native app is beyond our reach.
            </p>

            <p className="font-semibold text-slate-900">
              The good news? You can make Lokly feel just like an app on your
              phone.
            </p>

            <p>
              Add Lokly to your home screen and it’ll be there whenever
              you’re wondering <strong>what’s on.</strong> It’s free, takes
              less than a minute, and there’s nothing to download.
            </p>
          </div>

        </section>

        {/* HOME SCREEN INSTRUCTIONS */}
        <section className="mt-6 rounded-3xl bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#149EAF]/10 text-[#149EAF]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0-4 4m4-4 4 4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">
              Want Lokly one tap away?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Add Lokly to your phone&apos;s home screen and it&apos;ll be
              there whenever you&apos;re wondering what&apos;s on.
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">

            {/* IPHONE & IPAD */}
            <div className="rounded-3xl bg-[#E4F5F7] px-6 py-7 sm:px-8 sm:py-8">

              <h3 className="text-2xl font-black text-slate-900">
                iPhone &amp; iPad
              </h3>

              <ol className="mt-7 space-y-5 text-base leading-relaxed text-slate-600 sm:text-lg">

                <li className="flex gap-3">
                  <span className="font-bold text-slate-900">1.</span>
                  <span>Open lokly.live in Safari.</span>
                </li>

                <li className="flex gap-3">
                  <span className="font-bold text-slate-900">2.</span>
                  <span>Tap the Share button.</span>
                </li>

                <li className="flex gap-3">
                  <span className="font-bold text-slate-900">3.</span>
                  <span>Tap Add to Home Screen.</span>
                </li>

                <li className="flex gap-3">
                  <span className="font-bold text-slate-900">4.</span>
                  <span>Tap Add.</span>
                </li>

              </ol>

            </div>

            {/* ANDROID */}
            <div className="rounded-3xl bg-slate-100 px-6 py-7 sm:px-8 sm:py-8">

              <h3 className="text-2xl font-black text-slate-900">
                Android
              </h3>

              <ol className="mt-7 space-y-5 text-base leading-relaxed text-slate-600 sm:text-lg">

                <li className="flex gap-3">
                  <span className="font-bold text-slate-900">1.</span>
                  <span>Open lokly.live in Chrome.</span>
                </li>

                <li className="flex gap-3">
                  <span className="font-bold text-slate-900">2.</span>
                  <span>Tap the ⋮ menu.</span>
                </li>

                <li className="flex gap-3">
                  <span className="font-bold text-slate-900">3.</span>
                  <span>
                    Tap Add to Home screen or Install app.
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="font-bold text-slate-900">4.</span>
                  <span>Tap Add or Install.</span>
                </li>

              </ol>

            </div>

          </div>

        </section>

        {/* HELP US MAKE IT HAPPEN */}
        <section className="mt-6 rounded-3xl bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">

          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            Help us make it happen
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Share Lokly with your friends and help us grow. The more people
            who use Lokly, the closer we get to creating the app we’d love
            to have.
          </p>

          <Link
            href="/tell-a-friend"
            className="mt-7 inline-flex items-center justify-center rounded-2xl bg-[#149EAF] px-7 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#118b9b] active:scale-[0.98]"
          >
            Tell a Friend
          </Link>

          <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
            Thanks for being part of Lokly.
          </p>

        </section>

      </main>

      <BottomNavigation />
    </div>
  );
}