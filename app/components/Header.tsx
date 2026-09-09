"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../LanguageContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const pt = language === "pt";

  return (
    <>
      {/* MAIN HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[125px] max-w-7xl items-center justify-between px-5 sm:h-[145px] sm:px-6">

          {/* Menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={pt ? "Abrir menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 transition hover:bg-slate-200 active:scale-95 sm:h-12 sm:w-12"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-slate-700 sm:h-6 sm:w-6"
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
          <div className="flex flex-col items-center justify-center">
            <img
              src="/images/lokly-logo.png"
              alt="Lokly"
              className="h-[58px] w-[120px] object-contain sm:h-[72px] sm:w-[145px]"
            />

            <p className="-mt-1 text-[11px] font-medium leading-none text-[#149EAF] sm:text-sm">
              {pt
                ? "Descobrir • Explorar • Desfrutar"
                : "Discover • Explore • Enjoy"}
            </p>
          </div>

          {/* Profile */}
          <Link
            href="/profile"
            aria-label={pt ? "Perfil" : "Profile"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#149EAF] to-cyan-500 text-white shadow-md transition hover:scale-105 sm:h-12 sm:w-12"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
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

          <button
            type="button"
            aria-label={pt ? "Fechar menu" : "Close menu"}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-slate-900/30 backdrop-blur-[2px]"
          />

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
                  {pt
                    ? "Descobrir • Explorar • Desfrutar"
                    : "Discover • Explore • Enjoy"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={pt ? "Fechar menu" : "Close menu"}
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
                {pt ? "Descobrir" : "Discover"}
              </p>

              {/* HOME */}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
              >
                <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.5 10.5 12 3l8.5 7.5M5.5 9.5V21h13V9.5"
                    />
                  </svg>
                </span>

                <span className="font-semibold">
                  {pt ? "Início" : "Home"}
                </span>
              </Link>

              {/* SEARCH */}
              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="flex items-center rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
              >
                <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <circle cx="10.8" cy="10.8" r="6.2" />
                    <path
                      strokeLinecap="round"
                      d="m16 16 5 5"
                    />
                  </svg>
                </span>

                <span className="font-semibold">
                  {pt ? "Pesquisar" : "Search"}
                </span>
              </Link>

              {/* MAP */}
              <Link
                href="/map"
                onClick={() => setMenuOpen(false)}
                className="flex items-center rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
              >
                <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3.5 6 5-2 7 2 5-2v14l-5 2-7-2-5 2V6Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.5 4v14M15.5 6v14"
                    />
                  </svg>
                </span>

                <span className="font-semibold">
                  {pt ? "Mapa" : "Map"}
                </span>
              </Link>

              {/* YOUR LOKLY */}
              <div className="mt-8">
                <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  {pt ? "O seu Lokly" : "Your Lokly"}
                </p>

                {/* SAVED EVENTS */}
                <Link
                  href="/saved"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                    ♡
                  </span>

                  <span className="font-semibold">
                    {pt ? "Eventos guardados" : "Saved Events"}
                  </span>
                </Link>

                {/* MY PROFILE */}
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                    ◯
                  </span>

                  <span className="font-semibold">
                    {pt ? "O meu perfil" : "My Profile"}
                  </span>
                </Link>

                {/* MY LOCATION */}
                <Link
                  href="/profile/location"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                    ◎
                  </span>

                  <span className="font-semibold">
                    {pt ? "A minha localização" : "My Location"}
                  </span>
                </Link>
              </div>

              {/* MORE */}
              <div className="mt-8">
                <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  {pt ? "Mais" : "More"}
                </p>

                {/* NOTIFICATIONS */}
                <Link
                  href="/profile/notifications"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                    ♢
                  </span>

                  <span className="font-semibold">
                    {pt ? "Notificações" : "Notifications"}
                  </span>
                </Link>

                {/* ABOUT LOKLY */}
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                    ⓘ
                  </span>

                  <span className="font-semibold">
                    {pt ? "Sobre o Lokly" : "About Lokly"}
                  </span>
                </Link>

                {/* TELL A FRIEND */}
                <Link
                  href="/tell-a-friend"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                    ♧
                  </span>

                  <span className="font-semibold">
                    {pt ? "Diga a um amigo" : "Tell a Friend"}
                  </span>
                </Link>

                {/* CONTACT */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "/contact";
                  }}
                  className="flex w-full items-center rounded-2xl px-3 py-3.5 text-left text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex w-8 shrink-0 items-center justify-start text-[#149EAF]">
                    ▤
                  </span>

                  <span className="font-semibold">
                    {pt ? "Contacte-nos" : "Contact Us"}
                  </span>
                </button>
              </div>

              {/* LANGUAGE */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  {pt ? "Idioma" : "Language"}
                </p>

                <div className="grid grid-cols-2 gap-2 px-3">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                      language === "en"
                        ? "bg-[#149EAF] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🇬🇧 English
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage("pt")}
                    className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                      language === "pt"
                        ? "bg-[#149EAF] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🇵🇹 Português
                  </button>
                </div>
              </div>

            </nav>

            {/* FOOTER */}
            <div className="border-t border-slate-100 px-6 py-5">
              <p className="text-xs text-slate-400">
                Lokly
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {pt
                  ? "Descobrir • Explorar • Desfrutar"
                  : "Discover • Explore • Enjoy"}
              </p>
            </div>

          </aside>
        </div>
      )}
    </>
  );
}