"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NearMeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function findMe() {
    if (!navigator.geolocation) {
      setMessage("Location isn't available on this device.");
      return;
    }

    setLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        localStorage.setItem(
          "lokly-user-location",
          JSON.stringify({
            latitude,
            longitude,
          })
        );

        setLoading(false);

        router.push("/map");
      },
      () => {
        setLoading(false);

        setMessage(
          "Please allow location access to find events near you."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  return (
    <div className="mt-4">

      <button
        type="button"
        onClick={findMe}
        disabled={loading}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 font-bold text-[#149EAF] shadow-lg transition hover:bg-slate-50 active:scale-[0.99] disabled:opacity-60 sm:w-auto"
      >
        <span className="text-xl">📍</span>

        {loading
          ? "Finding your location..."
          : "Find events near me"}
      </button>

      {message && (
        <p className="mt-3 rounded-xl bg-white/90 px-4 py-3 text-sm font-medium text-slate-700">
          {message}
        </p>
      )}

    </div>
  );
}