"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../LanguageContext";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    {
      href: "/",
      label: t("Home"),
      icon: "home",
    },
    {
      href: "/map",
      label: t("Map"),
      icon: "map",
    },
    {
      href: "/saved",
      label: t("Saved"),
      icon: "heart",
    },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 rounded-3xl bg-white px-3 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.14)] ring-1 ring-slate-100">
      <div className="grid grid-cols-3 items-center">

        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[58px] flex-col items-center justify-center rounded-2xl transition ${
                active
                  ? "bg-[#149EAF] text-white"
                  : "text-slate-500 hover:text-[#102F56]"
              }`}
            >
              {item.icon === "home" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10.5 12 3l9 7.5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.5 9.5V21h13V9.5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.5 21v-6h5v6"
                  />
                </svg>
              )}

              {item.icon === "map" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 3v15M15 6v15"
                  />
                </svg>
              )}

              {item.icon === "heart" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                  />
                </svg>
              )}

              <span className="mt-1 text-[11px] font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}