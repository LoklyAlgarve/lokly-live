const items = [
  {
    name: "Home",
    active: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.5L12 3l9 7.5V21H3z"
        />
      </svg>
    ),
  },
  {
    name: "Map",
    active: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
        />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    name: "Saved",
    active: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
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
    ),
  },
  {
    name: "Profile",
    active: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
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
    ),
  },
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-5 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2">

      <div className="flex items-center justify-around rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur">

        {items.map((item) => (
          <button
            key={item.name}
            className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-all ${
              item.active
                ? "bg-[#149EAF] text-white shadow-lg"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {item.icon}

            <span className="text-xs font-semibold">
              {item.name}
            </span>
          </button>
        ))}

      </div>

    </nav>
  );
}