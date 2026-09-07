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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={pt ? "Abrir menu" : "Open menu"}
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
              Descobrir • Explorar • Desfrutar
            </p>
          </div>

          {/* Profile */}
          <Link
            href="/profile"
            aria-label={pt ? "Perfil" : "Profile"}
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
            aria-label={pt ? "Fechar menu" : "Close menu"}
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

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
              >
                <span className="text-[#149EAF]">⌂</span>
                <span className="font-semibold">
                  {pt ? "Início" : "Home"}
                </span>
              </Link>

              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
              >
                <span className="text-[#149EAF]">⌕</span>
                <span className="font-semibold">
                  {pt ? "Pesquisar" : "Search"}
                </span>
              </Link>

              <Link
                href="/map"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
              >
                <span className="text-[#149EAF]">▱</span>
                <span className="font-semibold">
                  {pt ? "Mapa" : "Map"}
                </span>
              </Link>

              {/* YOUR LOKLY */}
              <div className="mt-8">
                <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  {pt ? "O seu Lokly" : "Your Lokly"}
                </p>

                <Link
                  href="/saved"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-[#149EAF]">♡</span>
                  <span className="font-semibold">
                    {pt ? "Eventos guardados" : "Saved Events"}
                  </span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-[#149EAF]">♙</span>
                  <span className="font-semibold">
                    {pt ? "O meu perfil" : "My Profile"}
                  </span>
                </Link>

                <Link
                  href="/profile/location"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-[#149EAF]">⌖</span>
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

                <Link
                  href="/profile/notifications"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-[#149EAF]">♧</span>
                  <span className="font-semibold">
                    {pt ? "Notificações" : "Notifications"}
                  </span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-[#149EAF]">ⓘ</span>
                  <span className="font-semibold">
                    {pt ? "Sobre o Lokly" : "About Lokly"}
                  </span>
                </Link>

                <Link
                  href="/tell-a-friend"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-[#149EAF]">♧</span>
                  <span className="font-semibold">
                    {pt ? "Diga a um amigo" : "Tell a Friend"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "/contact";
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl px-3 py-3.5 text-left text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="text-[#149EAF]">□</span>
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