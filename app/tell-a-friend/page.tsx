"use client";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

export default function TellAFriendPage() {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText("https://www.lokly.live");
      alert("Lokly link copied!");
    } catch {
      alert("Copying the link wasn't available on this device.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-40">
      <Header />

      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-12">

        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#149EAF]">
            SPREAD THE WORD
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            Tell a friend about Lokly
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Know someone who'd love to know what's happening in the Algarve?
            Send them Lokly and help them discover what's going on.
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#149EAF]/10 text-[#149EAF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
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

          <h2 className="mt-7 text-2xl font-black text-slate-900">
            Share Lokly
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
            Markets, music, festivals, food, family events and plenty more -
            there might be something your friends don't know about yet.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">

            <a
              href="https://wa.me/?text=Have%20you%20found%20Lokly%20yet%3F%20It%27s%20a%20great%20way%20to%20discover%20what%27s%20happening%20in%20the%20Algarve%3A%20https%3A%2F%2Fwww.lokly.live"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 items-center justify-center rounded-2xl bg-[#149EAF] px-5 text-base font-bold text-white transition hover:opacity-90 active:scale-[0.98]"
            >
              Share on WhatsApp
            </a>

            <a
              href="mailto:?subject=Have%20you%20found%20Lokly%3F&body=Have%20you%20found%20Lokly%20yet%3F%20It%27s%20a%20great%20way%20to%20discover%20what%27s%20happening%20in%20the%20Algarve%3A%20https%3A%2F%2Fwww.lokly.live"
              className="flex min-h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-base font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
            >
              Share by Email
            </a>

            <button
              type="button"
              onClick={copyLink}
              className="flex min-h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-base font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
            >
              Copy Link
            </button>

          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm sm:p-9">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#149EAF]/10 text-[#149EAF]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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

            <h2 className="mt-6 text-2xl font-black text-slate-900">
              Want Lokly one tap away?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              Add Lokly to your phone's home screen and it'll be there whenever
              you're wondering what's on.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">

            <div className="rounded-2xl bg-[#e5f3f5] p-6">
              <h3 className="text-lg font-black text-slate-900">
                iPhone & iPad
              </h3>

              <ol className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                <li><strong>1.</strong> Open lokly.live in Safari.</li>
                <li><strong>2.</strong> Tap the Share button.</li>
                <li><strong>3.</strong> Tap Add to Home Screen.</li>
                <li><strong>4.</strong> Tap Add.</li>
              </ol>
            </div>

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-lg font-black text-slate-900">
                Android
              </h3>

              <ol className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                <li><strong>1.</strong> Open lokly.live in Chrome.</li>
                <li><strong>2.</strong> Tap the ⋮ menu.</li>
                <li><strong>3.</strong> Tap Add to Home screen or Install app.</li>
                <li><strong>4.</strong> Tap Add or Install.</li>
              </ol>
            </div>

          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-[#e5f3f5] p-7 text-center sm:p-9">
          <p className="text-lg font-bold text-slate-900">
            Because nobody wants to hear...
          </p>

          <p className="mt-3 text-xl font-black text-[#149EAF]">
            "Oh, you should have gone - it was brilliant."
          </p>
        </div>

      </section>

      <BottomNavigation />
    </main>
  );
}