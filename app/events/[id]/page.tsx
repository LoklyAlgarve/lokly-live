import Link from "next/link";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import SaveButton from "../../components/SaveButton";
import { getEvents } from "../../data/events";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const events = await getEvents();

  const event = events.find(
    (item) => item.id === Number(id)
  );

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50 pb-32">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-3xl font-black text-slate-900">
            Event not found
          </h1>

          <p className="mt-3 text-slate-500">
            We couldn't find this event.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-[#149EAF] px-6 py-3 font-bold text-white transition hover:bg-[#117F8E]"
          >
            Back to Events
          </Link>
        </section>

        <BottomNavigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      <Header />

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/past"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#149EAF]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>

          Back to Past Events
        </Link>

        <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="relative aspect-[16/9] w-full bg-slate-100 sm:aspect-[2/1]">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              Past Event
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#149EAF]">
                  {event.category}
                </p>

                <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                  {event.title}
                </h1>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#149EAF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="17"
                      rx="2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 2v4M8 2v4M3 10h18"
                    />
                  </svg>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Date
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {event.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#149EAF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7v5l3 2"
                    />
                  </svg>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Time
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {event.time || "Time not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#149EAF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#149EAF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v18M17 7.5c0-1.7-2.2-3-5-3s-5 1.3-5 3 2.2 3 5 3 5 1.3 5 3-2.2 3-5 3-5 1.3-5-3"
                    />
                  </svg>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Price
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {event.price}
                    </p>
                  </div>
                </div>
              </div>

              {event.description && (
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    About this event
                  </h2>

                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                    {event.description}
                  </p>
                </div>
              )}

              <div className="border-t border-slate-100 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <SaveButton
                    eventId={event.id}
                    large
                  />

                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#149EAF] px-5 text-base font-bold text-white transition hover:bg-[#117F8E]"
                    >
                      Event Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <BottomNavigation />
    </main>
  );
}