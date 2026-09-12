"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query") ?? "";

    setSearch(query);
  }, []);

  function handleSearch() {
    const query = search.trim();

    if (query === "") return;

    router.push(
      "/search?query=" + encodeURIComponent(query)
    );
  }

  function handleClear() {
    setSearch("");
    router.push("/");
  }

  return (
    <div className="space-y-3 sm:space-y-5">
      <div className="relative">

        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 sm:left-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }

            if (e.key === "Escape") {
              handleClear();
            }
          }}
          spellCheck={false}
          autoComplete="off"
          placeholder="Search events, places or venues..."
          className="h-[52px] w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-24 text-[15px] font-medium text-slate-900 shadow-md outline-none placeholder:text-slate-400 focus:border-[#149EAF] focus:ring-4 focus:ring-[#149EAF]/10 sm:h-16 sm:rounded-3xl sm:pl-14 sm:pr-28 sm:text-base"
        />

        {search.trim() !== "" && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-[56px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:right-[60px]"
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
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search"
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-[#149EAF] text-white sm:right-3 sm:h-10 sm:w-10 sm:rounded-2xl"
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
              d="M21 21l-5-5"
            />
            <circle cx="10" cy="10" r="6" />
          </svg>
        </button>

      </div>
    </div>
  );
}