import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-40">
      <Header />

      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#149EAF]">
            GET IN TOUCH
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            Contact Lokly
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Got a question, spotted something that needs changing, or just want
            to say hello?
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
            We'd love to hear from you.
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-7 shadow-sm sm:p-10">
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
                d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-4.8-1.5L3 20l1.5-4.2A8.4 8.4 0 0 1 3 11.5a8.5 8.5 0 1 1 18 0Z"
              />
            </svg>
          </div>

          <p className="mt-7 text-base leading-relaxed text-slate-600">
            Whether you've found an event that's missing, noticed some
            information that's not quite right, or have an idea that could
            make Lokly better, get in touch.
          </p>

          <div className="mt-8 rounded-2xl bg-[#e5f3f5] p-6">
            <h2 className="text-xl font-black text-slate-900">
              For event organisers and local businesses
            </h2>

            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Want to tell more people about your event or have your business
              featured on Lokly? We'd be happy to hear from you too.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
              Email us
            </p>

            <a
              href="mailto:hello@lokly.live"
              className="mt-3 inline-block text-xl font-black text-[#149EAF] transition hover:opacity-80"
            >
              hello@lokly.live
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Lokly - Discover what's happening in the Algarve.
          </p>
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}