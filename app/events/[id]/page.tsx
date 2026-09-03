import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvents } from "../../data/events";
import SaveButton from "../../components/SaveButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventDetails({ params }: Props) {
  const { id } = await params;

  const events = await getEvents();

  const event = events.find((e) => e.id === Number(id));

  if (!event) {
    notFound();
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;

  return (
    <main className="min-h-screen bg-slate-50 pb-10">

      {/* Hero image */}
      <div className="relative">

        <img
          src={event.image}
          alt={event.title}
          className="h-[45vh] min-h-[300px] w-full object-cover"
        />

        {/* Back button */}
        <Link
          href="/"
          className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg"
          aria-label="Back"
        >
          ←
        </Link>

        {/* Save button on image */}
        <SaveButton eventId={event.id} />

      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-5 py-7 sm:px-6">

        {/* Category + price */}
        <div className="flex items-center justify-between gap-3">

          <span className="rounded-full bg-[#149EAF]/10 px-3 py-1 text-sm font-semibold text-[#149EAF]">
            {event.category}
          </span>

          <span className="rounded-full bg-[#149EAF]/10 px-3 py-1 text-sm font-semibold text-[#149EAF]">
            {event.price || "Free"}
          </span>

        </div>

        {/* Title */}
        <h1 className="mt-5 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
          {event.title}
        </h1>

        {/* Event information */}
        <div className="mt-6 space-y-4">

          <div className="flex items-start gap-3 text-slate-700">
            <span className="text-xl">📍</span>
            <div>
              <p className="font-semibold">
                {event.location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-slate-700">
            <span className="text-xl">📅</span>
            <div>
              <p className="font-semibold">
                {event.date}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-slate-700">
            <span className="text-xl">🕒</span>
            <div>
              <p className="font-semibold">
                {event.time}
              </p>
            </div>
          </div>

        </div>

        {/* Description */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">

          <h2 className="text-xl font-bold text-slate-900">
            About this event
          </h2>

          <div className="mt-4 whitespace-pre-line leading-7 text-slate-600">
            {event.description ||
              "More information about this event will be available soon."}
          </div>

        </div>

        {/* Actions */}
        <div className="mt-7 space-y-3">

          {/* Directions */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#149EAF] px-5 text-base font-bold text-white shadow-sm transition hover:bg-[#117F8E]"
          >
            📍 Get Directions
          </a>

          {/* Website */}
          {event.website && (
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-base font-bold text-slate-700 transition hover:bg-slate-50"
            >
              🌐 Visit Website
            </a>
          )}

          {/* Save Event */}
          <SaveButton eventId={event.id} large />

        </div>

      </div>

    </main>
  );
}