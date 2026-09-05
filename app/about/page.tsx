import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-40">
      <Header />

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12">

        {/* INTRO */}
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#149EAF]">
            ABOUT LOKLY
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            Discover more of the Algarve
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Lokly makes it easier to discover what's happening around the
            Algarve - from local markets and live music to festivals, family
            days, exhibitions and sporting events.
          </p>
        </div>

        {/* WHY LOKLY */}
        <div className="mt-12 rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-2xl font-black text-slate-900">
            Why Lokly exists
          </h2>

          <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-800">
              It started with a simple problem.
            </p>

            <p>
              There is always something happening in the Algarve. Finding out
              what's happening, where it is and when it's on isn't always easy.
            </p>

            <p>
              Information is scattered across Facebook, websites, posters and
              word of mouth. People miss events - and local businesses and
              organisers can struggle to get their events in front of the
              right people.
            </p>

            <p className="font-semibold text-slate-800">
              That's the problem Lokly is designed to solve.
            </p>

            <p>
              Lokly brings events together in one simple place, making it
              easier for people to discover what's going on around them and
              easier for local businesses and organisers to be discovered.
            </p>
          </div>
        </div>

        {/* TWO SIDES */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* FOR PEOPLE */}
          <div className="rounded-3xl bg-[#e5f3f5] p-7 sm:p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
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

            <h2 className="mt-8 text-3xl font-black text-slate-900">
              For people
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Discover more of the Algarve and find things to do without having
              to search in lots of different places.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>
                Find events near you
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>
                Explore different categories
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>
                Save events you don't want to miss
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>
                Discover new places and experiences
              </li>
            </ul>
          </div>

          {/* FOR BUSINESSES */}
          <div className="rounded-3xl bg-[#fff7eb] p-7 sm:p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
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

            <h2 className="mt-8 text-3xl font-black text-slate-900">
              For local businesses & organisers
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Get your events in front of people who are looking for things to
              do in the Algarve.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>
                Reach people looking for local events
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>
                Give your events more visibility
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>
                Help people discover your business
              </li>

              <li className="flex items-center gap-4 text-base text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>
                </span>
                Support the local community
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
                alt="Ailsa, founder of Lokly"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-7 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#149EAF]">
                THE IDEA BEHIND LOKLY
              </p>

              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                Built for the Algarve
              </h2>

              <p className="mt-5 text-base leading-relaxed text-slate-600">
                Lokly was created with a simple aim - to make it easier for
                people to discover the events, activities and experiences that
                make the Algarve such a great place to live, visit and enjoy.
              </p>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                At the same time, Lokly aims to give local businesses and
                organisers another way to get their events noticed.
              </p>

              <p className="mt-6 text-lg font-bold text-slate-900">
                Discover. Support. Enjoy the Algarve.
              </p>
            </div>

          </div>
        </div>

      </section>

      <BottomNavigation />
    </main>
  );
}