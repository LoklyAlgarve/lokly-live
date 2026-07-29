export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

        {/* Menu */}

        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-slate-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 7h16M4 12h16M4 17h16"
            />
          </svg>

        </button>

        {/* Logo */}

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#149EAF]">
            DISCOVER
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Lokly
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Algarve • Portugal
          </p>

        </div>

        {/* Profile */}

        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#149EAF] to-cyan-500 text-white shadow-md">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="8" r="3.5" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 20c2-3 5-4.5 7-4.5s5 1.5 7 4.5"
            />
          </svg>

        </button>

      </div>

    </header>
  );
}