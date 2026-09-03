"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    name: "Home",
    href: "/",
    icon: "home",
  },
  {
    name: "Search",
    href: "/search",
    icon: "search",
  },
  {
    name: "Map",
    href: "/map",
    icon: "map",
  },
  {
    name: "Saved",
    href: "/saved",
    icon: "heart",
  },
];

function Icon({ type }: { type: string }) {
  if (type === "home") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    );
  }

  if (type === "search") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 5 5" />
      </svg>
    );
  }

  if (type === "map") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15" />
        <path d="M15 6v15" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A5.2 5.2 0 0 1 12 5.5a5.2 5.2 0 0 1 8.8 3.3Z" />
    </svg>
  );
}

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-lg -translate-x-1/2">
      <div className="flex items-center justify-around rounded-3xl bg-white/95 p-3 shadow-2xl backdrop-blur-xl">

        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex min-w-[72px] flex-col items-center rounded-2xl px-4 py-3 transition ${
                active
                  ? "bg-[#149EAF] text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Icon type={item.icon} />

              <span className="mt-1.5 text-xs font-semibold">
                {item.name}
              </span>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}