import { notFound } from "next/navigation";
import { events } from "../../data/events";

type Props = {
  params: {
    id: string;
  };
};

export default function EventDetails({ params }: Props) {
  const event = events.find(
    (e) => e.id === Number(params.id)
  );

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">

      <img
        src={event.image}
        alt={event.title}
        className="h-80 w-full object-cover"
      />

      <div className="mx-auto max-w-3xl p-6">

        <span className="rounded-full bg-[#149EAF]/10 px-3 py-1 text-sm font-semibold text-[#149EAF]">
          {event.category}
        </span>

        <h1 className="mt-5 text-4xl font-black text-slate-900">
          {event.title}
        </h1>

        <div className="mt-6 space-y-3 text-slate-600">

          <p>📍 {event.location}</p>

          <p>📅 {event.date}</p>

          <p>🕒 {event.time}</p>

          <p>💰 {event.price}</p>

        </div>

        <div className="mt-10 space-y-4">

          <button className="w-full rounded-2xl bg-[#149EAF] py-4 font-semibold text-white hover:bg-[#117F8E]">
            Get Directions
          </button>

          <button className="w-full rounded-2xl border border-slate-300 py-4 font-semibold">
            Save Event
          </button>

        </div>

      </div>

    </main>
  );
}