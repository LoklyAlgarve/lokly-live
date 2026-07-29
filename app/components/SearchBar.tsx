export default function SearchBar() {
  return (
    <div className="space-y-4">

      <div className="relative">

        <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="7" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 20l-3.5-3.5"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Search events, places or artists..."
          className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-32 text-base text-slate-800 shadow-sm outline-none transition-all duration-200 focus:border-[#149EAF] focus:ring-4 focus:ring-[#149EAF]/10"
        />

        <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-[#149EAF] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#117F8E]">
          Search
        </button>

      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">

        <button className="whitespace-nowrap rounded-full bg-[#149EAF] px-4 py-2 text-sm font-semibold text-white">
          Today
        </button>

        <button className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#149EAF]">
          This Weekend
        </button>

        <button className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#149EAF]">
          Free
        </button>

        <button className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#149EAF]">
          Near Me
        </button>

      </div>

    </div>
  );
}