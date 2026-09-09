"use client";

import Link from "next/link";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import SaveButton from "../../components/SaveButton";
import { getEvents } from "../../data/events";
import { useLanguage } from "../../LanguageContext";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getFriendlyValue(value: string, pt: boolean) {
  const normalised = value?.trim().toLowerCase();

  if (normalised === "yes") {
    return pt ? "Sim" : "Yes";
  }

  if (normalised === "no") {
    return pt ? "Não" : "No";
  }

  return pt ? "Desconhecido" : "Unknown";
}

function getFriendlyBadgeClass(value: string) {
  return value === "Yes" || value === "Sim"
    ? "bg-emerald-100 text-emerald-700"
    : value === "No" || value === "Não"
      ? "bg-slate-200 text-slate-600"
      : "bg-slate-100 text-slate-500";
}

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

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    event.location
  )}`;

  return (
    <EventPageContent
      event={event}
      directionsUrl={directionsUrl}
    />
  );
}

function EventPageContent({
  event,
  directionsUrl,
}: {
  event: any;
  directionsUrl: string;
}) {
  const { language } = useLanguage();
  const pt = language === "pt";

  const wheelchairFriendly = getFriendlyValue(
    event.wheelchairFriendly,
    pt
  );

  const petFriendly = getFriendlyValue(
    event.petFriendly,
    pt
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      <Header />

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Back to all events */}
        <Link
          href="/"
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

          {pt ? "Todos os eventos" : "All Events"}
        </Link>

        <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">

          <div className="relative aspect-[16/9] w-full bg-slate-100 sm:aspect-[2/1]">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
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

              {/* Event information */}
              <div className="grid grid-cols-2 gap-3">

                {/* Date */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
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

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {pt ? "Data" : "Date"}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                      {event.date}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
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

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {pt ? "Hora" : "Time"}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                      {event.time || (pt ? "Não especificado" : "Not specified")}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
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

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {pt ? "Localização" : "Location"}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-lg font-medium leading-none text-[#149EAF] sm:h-5 sm:w-5 sm:text-[22px]">
                    €
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {pt ? "Preço" : "Price"}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                      {event.price}
                    </p>
                  </div>
                </div>

                {/* Wheelchair Friendly */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="9" cy="5" r="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 8v5l4 2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 10h6l2 4"
                    />
                    <circle cx="10" cy="17" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 17h4"
                    />
                  </svg>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {pt
                        ? "Acessível a cadeiras de rodas"
                        : "Wheelchair Friendly"}
                    </p>

                    <span
                      className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getFriendlyBadgeClass(
                        wheelchairFriendly
                      )}`}
                    >
                      {wheelchairFriendly}
                    </span>
                  </div>
                </div>

                {/* Pet Friendly */}
                <div className="flex min-w-0 items-start gap-2.5 rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#149EAF] sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20c-3.5 0-6-2.5-6-5.5 0-2.2 1.4-3.5 3-4.2C9.7 9.7 10.5 8 12 8s2.3 1.7 3 2.3c1.6.7 3 2 3 4.2C18 17.5 15.5 20 12 20z"
                    />
                    <circle cx="7" cy="8" r="1.5" />
                    <circle cx="10" cy="5.5" r="1.5" />
                    <circle cx="14" cy="5.5" r="1.5" />
                    <circle cx="17" cy="8" r="1.5" />
                  </svg>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {pt ? "Aceita animais" : "Pet Friendly"}
                    </p>

                    <span
                      className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getFriendlyBadgeClass(
                        petFriendly
                      )}`}
                    >
                      {petFriendly}
                    </span>
                  </div>
                </div>

              </div>

              {event.description && (
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {pt ? "Sobre este evento" : "About this event"}
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

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#149EAF] px-5 text-base font-bold text-white transition hover:bg-[#117F8E]"
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
                        d="M12 3v12"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 10l5 5 5-5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 21h14"
                      />
                    </svg>

                    {pt ? "Como chegar" : "Directions"}
                  </a>

                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-14 w-full items-center justify-center rounded-2xl border-2 border-[#149EAF] px-5 text-base font-bold text-[#149EAF] transition hover:bg-[#149EAF] hover:text-white"
                    >
                      {pt
                        ? "Website do evento"
                        : "Event Website"}
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