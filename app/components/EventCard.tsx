type EventCardProps = {
  title: string;
  location: string;
  date: string;
  image: string;
};

export default function EventCard({
  title,
  location,
  date,
  image,
}: EventCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="relative">

        <img
          src={image}
          alt={title}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#149EAF] shadow">
          TODAY
        </div>

        <button className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow transition hover:scale-110">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12.1 21.35l-1.1-1C5.14 15.24 2 12.39 2 8.99A4.99 4.99 0 017 4a5.42 5.42 0 015 2.09A5.42 5.42 0 0117 4a4.99 4.99 0 015 4.99c0 3.4-3.14 6.25-8.99 11.36l-.91 1z"
            />
          </svg>

        </button>

      </div>

      <div className="space-y-4 p-6">

        <div className="flex items-center justify-between">

          <span className="rounded-full bg-[#149EAF]/10 px-3 py-1 text-xs font-semibold text-[#149EAF]">
            Free
          </span>

          <span className="text-sm font-medium text-slate-500">
            ⭐ 4.8
          </span>

        </div>

        <h3 className="text-2xl font-bold leading-tight text-slate-900">
          {title}
        </h3>

        <div className="space-y-2">

          <div className="flex items-center gap-2 text-slate-600">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#149EAF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.243-4.243a8 8 0 1111.313 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            {location}

          </div>

          <div className="flex items-center gap-2 text-slate-600">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#149EAF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            {date}

          </div>

        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">

          <button className="rounded-xl border border-[#149EAF] py-3 font-semibold text-[#149EAF] transition hover:bg-[#149EAF]/10">
            Directions
          </button>

          <button className="rounded-xl bg-[#149EAF] py-3 font-semibold text-white transition hover:bg-[#117F8E]">
            Details
          </button>

        </div>

      </div>

    </article>
  );
}