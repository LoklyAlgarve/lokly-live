"use client";

import dynamic from "next/dynamic";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { getEvents } from "../data/events";
import { useEffect, useState } from "react";

type Event = {
  id: number;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
};

const EventMap = dynamic(
  () => import("../components/EventMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[65vh] min-h-[500px] items-center justify-center bg-slate-100">
        <p className="font-semibold text-slate-500">
          Loading map...
        </p>
      </div>
    ),
  }
);

function distanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function MapPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [radius, setRadius] = useState(10);

  const [locationMessage, setLocationMessage] = useState("");

  const [locating, setLocating] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents();
      setEvents(data);
    }

    loadEvents();
  }, []);

  function findNearMe() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location services are not available in this browser."
      );
      return;
    }

    setLocating(true);
    setLocationMessage("Finding your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setUserLocation({
          latitude,
          longitude,
        });

        setRadius(10);

        setLocationMessage(
          `Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        );

        setLocating(false);
      },
      (error) => {
        if (error.code === 1) {
          setLocating(false);

          setLocationMessage(
            "Location permission was denied. Please allow location access for Lokly in your browser settings."
          );

          return;
        }

        if (error.code === 2) {
          setLocationMessage(
            "Trying another way to find your location..."
          );

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

              setUserLocation({
                latitude,
                longitude,
              });

              setRadius(10);

              setLocationMessage(
                `Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              );

              setLocating(false);
            },
            (fallbackError) => {
              setLocating(false);

              if (fallbackError.code === 1) {
                setLocationMessage(
                  "Location permission was denied. Please allow location access for Lokly in your browser settings."
                );
              } else if (fallbackError.code === 3) {
                setLocationMessage(
                  "The location request took too long. Please try again."
                );
              } else {
                setLocationMessage(
                  "We couldn't determine your location. Please check that location services are enabled on your computer and try again."
                );
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 30000,
              maximumAge: 300000,
            }
          );

          return;
        }

        if (error.code === 3) {
          setLocating(false);

          setLocationMessage(
            "The location request took too long. Please try again."
          );

          return;
        }

        setLocating(false);

        setLocationMessage(
          "We couldn't find your location. Please try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  const visibleEvents = userLocation
    ? events.filter((event) => {
        const distance = distanceInKm(
          userLocation.latitude,
          userLocation.longitude,
          event.latitude,
          event.longitude
        );

        return distance <= radius;
      })
    : events;

  return (
    <main className="min-h-screen bg-slate-50 pb-36">

      <Header />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Event Map
            </h1>

            <p className="mt-2 text-slate-500">
              Discover events happening across the Algarve.
            </p>
          </div>

          <button
            type="button"
            onClick={findNearMe}
            disabled={locating}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#149EAF] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#117F8E] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
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
                d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z"
              />

              <circle
                cx="12"
                cy="10"
                r="2.5"
              />
            </svg>

            <span>
              {locating ? "Finding you..." : "Near Me"}
            </span>
          </button>

        </div>

        {locationMessage &&
          !locationMessage.startsWith("Location found:") && (
            <div className="mt-5 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100">
              {locationMessage}
            </div>
          )}

        {userLocation && (
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-bold text-slate-900">
                  Events near you
                </p>

                <p className="text-sm text-slate-500">
                  {visibleEvents.length} event
                  {visibleEvents.length === 1 ? "" : "s"} within{" "}
                  {radius} km
                </p>
              </div>

              <div className="flex flex-wrap gap-2">

                {[5, 10, 25, 50].map((distance) => (
                  <button
                    key={distance}
                    type="button"
                    onClick={() => setRadius(distance)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      radius === distance
                        ? "bg-[#149EAF] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {distance} km
                  </button>
                ))}

              </div>

            </div>

          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow sm:mt-8">

          <EventMap
            events={visibleEvents}
            userLocation={userLocation}
          />

        </div>

      </section>

      <BottomNavigation />

    </main>
  );
}