"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

const locations = [
  "Albufeira",
  "Alcoutim",
  "Aljezur",
  "Castro Marim",
  "Faro",
  "Lagoa",
  "Lagos",
  "Loulé",
  "Monchique",
  "Olhão",
  "Portimão",
  "Silves",
  "São Brás de Alportel",
  "Tavira",
  "Vila do Bispo",
  "Vila Real de Santo António",
];

export default function LocationPage() {
  const [location, setLocation] = useState("Algarve");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem("lokly_location");

    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  function handleSave() {
    localStorage.setItem("lokly_location", location);

    document.cookie = `lokly_location=${encodeURIComponent(location)}; path=/; max-age=31536000; samesite=lax`;

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-48">
      <Header />

      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-6">
        <a
          href="/profile"
          className="inline-flex items-center text-sm font-semibold text-[#149EAF] hover:text-[#117F8E]"
        >
          ← Back to Profile
        </a>

        <h1 className="mt-6 text-3xl font-black text-slate-900 sm:text-4xl">
          Your Location
        </h1>

        <p className="mt-2 text-slate-500">
          Choose the Algarve town you would like Lokly to use for nearby
          events.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="p-6 sm:p-8">
            <label
              htmlFor="location"
              className="block text-sm font-bold text-slate-700"
            >
              Where are you based?
            </label>

            <select
              id="location"
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setSaved(false);
              }}
              className="mt-3 min-h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
            >
              <option value="Algarve">Algarve</option>

              {locations.map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSave}
              className="mt-5 min-h-14 w-full rounded-2xl bg-[#149EAF] px-5 font-bold text-white shadow-sm transition hover:bg-[#117F8E] active:scale-[0.99]"
            >
              Save Location
            </button>

            {saved && (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-center">
                <p className="text-sm font-bold text-emerald-700">
                  Location saved
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}