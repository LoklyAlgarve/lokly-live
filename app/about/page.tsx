import Image from "next/image";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-36">
      <Header />

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            About <span className="text-[#149EAF]">Lokly</span>
          </h1>

          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[#149EAF]" />
            <span className="text-2xl text-[#149EAF]">♥</span>
            <div className="h-px w-16 bg-[#149EAF]" />
          </div>
        </div>

        {/* Why Lokly exists */}
        <div className="mx-auto mt-12 max-w-4xl">

          <h2 className="text-3xl font-bold text-[#149EAF]">
            Why Lokly exists
          </h2>

          <div className="mt-5 space-y-5 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">

            <p>
              It started with a simple problem.
            </p>

            <p>
              There is always something happening in the Algarve. Finding
              out{" "}
              <strong>
                what&apos;s happening, where it is and when it&apos;s on
              </strong>{" "}
              isn&apos;t always easy.
            </p>

            <p>
              Information is scattered across Facebook, websites, posters
              and word of mouth. People miss events, while local businesses
              and organisers can struggle to get their events in front of
              the right people.
            </p>

            <p className="text-xl font-bold text-[#149EAF]">
              That&apos;s the problem Lokly is designed to solve.
            </p>

            <p>
              We bring events together in one simple place, making it
              easier for people to discover what&apos;s happening around
              them — while helping the businesses, venues and organisers
              behind those events get discovered too.
            </p>

          </div>
        </div>

        {/* Two sides of Lokly */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">

          {/* People */}
          <div className="rounded-3xl bg-[#F2F9FA] p-7 ring-1 ring-[#149EAF]/10 sm:p-8">

            <p className="text-sm font-bold tracking-[0.18em] text-[#149EAF]">
              FOR PEOPLE
            </p>

            <h3 className="mt-3 text-3xl font-bold text-slate-900">
              Discover more of the Algarve
            </h3>

            <div className="mt-3 h-px w-40 bg-[#149EAF]" />

            <p className="mt-6 leading-7 text-slate-700">
              Find events, markets, music, food, family days and things
              happening near you — all in one place.
            </p>

            <div className="mt-6 space-y-4">

              {[
                "Save your favourites",
                "Plan your visit",
                "Discover somewhere new",
                "Never miss out on what’s on",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#149EAF] text-xs font-bold text-white">
                    ✓
                  </span>

                  <span>{item}</span>
                </div>
              ))}

            </div>

            <p className="mt-8 text-center text-lg font-medium italic text-[#149EAF]">
              More to see. More to do. More local.
            </p>

            <div className="mt-3 text-center text-3xl text-[#149EAF]">
              ♡
            </div>

          </div>

          {/* Businesses */}
          <div className="rounded-3xl bg-[#FFF8ED] p-7 ring-1 ring-orange-200/60 sm:p-8">

            <p className="text-sm font-bold tracking-[0.18em] text-orange-600">
              FOR LOCAL BUSINESSES
              <br />
              &amp; ORGANISERS
            </p>

            <h3 className="mt-3 text-3xl font-bold text-slate-900">
              Get discovered
            </h3>

            <div className="mt-3 h-px w-40 bg-orange-500" />

            <p className="mt-6 leading-7 text-slate-700">
              Put your events in front of people who are looking for
              things to do in the Algarve.
            </p>

            <div className="mt-6 space-y-4">

              {[
                "Reach more people",
                "Promote your events",
                "Fill more seats",
                "Help your business get noticed",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    ✓
                  </span>

                  <span>{item}</span>
                </div>
              ))}

            </div>

            <p className="mt-8 text-center text-lg font-medium italic text-orange-600">
              More exposure. More customers.
              <br />
              More success.
            </p>

            <div className="mt-3 text-center text-3xl text-orange-500">
              ☆
            </div>

          </div>

        </div>

        {/* Founder */}
        <div className="mt-10 grid items-center gap-8 md:grid-cols-2">

          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/images/ailsa-lokly.jpg"
              alt="Ailsa, founder of Lokly"
              width={900}
              height={700}
              className="h-auto w-full object-cover"
            />
          </div>

          <div>

            <div className="h-px w-full bg-slate-200" />

            <h2 className="mt-6 text-3xl font-bold text-[#149EAF]">
              Ailsa
            </h2>

            <p className="mt-1 text-xl font-medium italic text-[#149EAF]">
              Founder of Lokly
            </p>

            <div className="mt-2 h-px w-48 bg-[#149EAF]" />

            <p className="mt-6 leading-7 text-slate-700">
              Lokly is my passion project and I&apos;m proud to build
              something that helps our community and supports the
              amazing people and businesses that make the Algarve such
              a special place.
            </p>

            <p className="mt-6 text-lg font-medium italic text-[#149EAF]">
              Thank you for being part of it.
            </p>

          </div>

        </div>

        {/* Closing */}
        <div className="mt-10 border-t border-slate-200 pt-7 text-center">

          <p className="text-2xl font-medium italic text-[#149EAF] sm:text-3xl">
            Discover. Support. Enjoy the Algarve.
            <span className="ml-2">♡</span>
          </p>

        </div>

      </section>

      <BottomNavigation />
    </main>
  );
}