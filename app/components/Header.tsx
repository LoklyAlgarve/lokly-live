"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition hover:bg-slate-200 active:scale-95"
          >
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
          <div className="flex flex-col items-center text-center">
            <img
              src="/images/lokly-logo.png"
              alt="Lokly"
              style={{ width: "150px", height: "auto" }}
            />

            <p className="text-sm font-medium text-[#149EAF]">
              Discover • Explore • Enjoy
            </p>
          </div>

          {/* Profile */}
          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#149EAF] to-cyan-500 text-white shadow-lg transition hover:scale-105"
          >
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
          </Link>
        </div>
      </header>

      {/* MENU OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]">

          {/* Dark background */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-slate-900/30 backdrop-blur-[2px]"
          />

          {/* SIDE MENU */}
          <aside className="relative flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">

            {/* Menu Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <img
                  src="/images/lokly-logo.png"
                  alt="Lokly"
                  style={{ width: "125px", height: "auto" }}
                />

                <p className="mt-0.5 text-sm font-medium text-[#149EAF]">
                  Discover • Explore • Enjoy
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:scale-95"
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
            </div>

            {/* MENU CONTENT */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">

              {/* DISCOVER */}
              <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Discover
              </p>

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
              >
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
                    d="M3 10.5L12 3l9 7.5M5 9v11h14V9M9 20v-6h6v6"
                  />
                </svg>

                <span className="font-semibold">Home</span>
              </Link>

              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#149EAF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="6.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 16l5 5"
                  />
                </svg>

                <span className="font-semibold">Search</span>
              </Link>

              <Link
                href="/map"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
              >
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
                    d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 3v15M15 6v15"
                  />
                </svg>

                <span className="font-semibold">Map</span>
              </Link>

              {/* YOUR LOKLY */}
              <div className="mt-8">
                <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Your Lokly
                </p>

                <Link
                  href="/saved"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#149EAF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.7 4.7 0 017.9 4c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2a4.7 4.7 0 014.7 4.8z"
                    />
                  </svg>

                  <span className="font-semibold">Saved Events</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#149EAF]"
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

                  <span className="font-semibold">My Profile</span>
                </Link>

                <Link
                  href="/profile/location"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
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
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"
                    />

                    <circle cx="12" cy="10" r="2.5" />
                  </svg>

                  <span className="font-semibold">My Location</span>
                </Link>
              </div>

              {/* MORE */}
              <div className="mt-8">
                <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  More
                </p>

                <Link
                  href="/profile/notifications"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
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
                      d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
                    />
                  </svg>

                  <span className="font-semibold">Notifications</span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#149EAF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="9" />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11v5M12 8h.01"
                    />
                  </svg>

                  <span className="font-semibold">About Lokly</span>
                </Link>

                <Link
                  href="/tell-a-friend"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#149EAF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="8" cy="9" r="3" />
                    <circle cx="16" cy="9" r="3" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 20c0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5"
                    />
                  </svg>

                  <span className="font-semibold">Tell a Friend</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "/contact";
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl px-3 py-3.5 text-left text-slate-700 transition hover:bg-slate-50"
                >
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
                      d="M4 5h16v11H8l-4 4V5z"
                    />
                  </svg>

                  <span className="font-semibold">Contact Us</span>
                </button>
              </div>
            </nav>

            {/* FOOTER */}
            <div className="border-t border-slate-100 px-6 py-5">
              <p className="text-xs text-slate-400">
                Lokly
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Discover • Explore • Enjoy
              </p>
            </div>

          </aside>
        </div>
      )}
    </>
  );
}