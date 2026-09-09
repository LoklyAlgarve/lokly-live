"use client";

import dynamic from "next/dynamic";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { getEvents } from "../data/events";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

type Event = {
  id: number;
  title: string;
  location: string;
  category: string;
  latitude: number;
  longitude: number;
};

const EventMap = dynamic(
  () => import("../components/EventMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[62vh] min-h-[460px] items-center justify-center bg-slate-100">
        <p className="font-semibold text-slate-500">
          Loading map...
        </p>
      </div>
    ),
  }
);

const categories = [
  "All Categories",
  "Music",
  "Festival",
  "Market",
  "Food & Drink",
  "Sport",
  "Family",
  "Arts & Culture",
  "Nightlife",
  "Comedy",
  "Theatre",
  "Exhibitions",
  "Workshop",
  "Charity",
  "Community",
  "Retreat",
];

const categoryTranslations: Record<string, string> = {
  "All Categories": "Todas as categorias",
  Music: "Música",
  Festival: "Festival",
  Market: "Mercado",
  "Food & Drink": "Comida e bebida",
  Sport: "Desporto",
  Family: "Família",
  "Arts & Culture": "Artes e cultura",
  Nightlife: "Vida noturna",
  Comedy: "Comédia",
  Theatre: "Teatro",
  Exhibitions: "Exposições",
  Workshop: "Workshop",
  Charity: "Caridade",
  Community: "Comunidade",
  Retreat: "Retiro",
};

const areas = [
  "All Areas",
  "Albufeira",
  "Aljezur",
  "Carvoeiro",
  "Faro",
  "Lagos",
  "Lagoa",
  "Loulé",
  "Olhão",
  "Portimão",
  "Silves",
  "Tavira",
  "Vila Real de Santo António",
];

const areaTranslations: Record<string, string> = {
  "All Areas": "Todas as áreas",
  Albufeira: "Albufeira",
  Aljezur: "Aljezur",
  Carvoeiro: "Carvoeiro",
  Faro: "Faro",
  Lagos: "Lagos",
  Lagoa: "Lagoa",
  Loulé: "Loulé",
  Olhão: "Olhão",
  Portimão: "Portimão",
  Silves: "Silves",
  Tavira: "Tavira",
  "Vila Real de Santo António":
    "Vila Real de Santo António",
};

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
  const { language } = useLanguage();
  const pt = language === "pt";

  const [events, setEvents] = useState<Event[]>([]);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [radius, setRadius] = useState(10);

  const [locationMessage, setLocationMessage] =
    useState("");

  const [locating, setLocating] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [selectedArea, setSelectedArea] =
    useState("All Areas");

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
        pt
          ? "Os serviços de localização não estão disponíveis neste navegador."
          : "Location services are not available in this browser."
      );
      return;
    }

    setLocating(true);

    setLocationMessage(
      pt
        ? "A encontrar a sua localização..."
        : "Finding your location..."
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
          `Location found: ${latitude.toFixed(
            4
          )}, ${longitude.toFixed(4)}`
        );

        setLocating(false);
      },
      (error) => {
        if (error.code === 1) {
          setLocating(false);

          setLocationMessage(
            pt
              ? "A permissão de localização foi recusada. Permita o acesso à localização do Lokly nas definições do seu navegador."
              : "Location permission was denied. Please allow location access for Lokly in your browser settings."
          );

          return;
        }

        if (error.code === 2) {
          setLocationMessage(
            pt
              ? "A tentar outra forma de encontrar a sua localização..."
              : "Trying another way to find your location..."
          );

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude =
                position.coords.latitude;
              const longitude =
                position.coords.longitude;

              setUserLocation({
                latitude,
                longitude,
              });

              setRadius(10);

              setLocationMessage(
                `Location found: ${latitude.toFixed(
                  4
                )}, ${longitude.toFixed(4)}`
              );

              setLocating(false);
            },
            (fallbackError) => {
              setLocating(false);

              if (fallbackError.code === 1) {
                setLocationMessage(
                  pt
                    ? "A permissão de localização foi recusada. Permita o acesso à localização do Lokly nas definições do seu navegador."
                    : "Location permission was denied. Please allow location access for Lokly in your browser settings."
                );
              } else if (
                fallbackError.code === 3
              ) {
                setLocationMessage(
                  pt
                    ? "O pedido de localização demorou demasiado tempo. Tente novamente."
                    : "The location request took too long. Please try again."
                );
              } else {
                setLocationMessage(
                  pt
                    ? "Não foi possível determinar a sua localização. Verifique se os serviços de localização estão ativados no seu computador e tente novamente."
                    : "We couldn't determine your location. Please check that location services are enabled on your computer and try again."
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
            pt
              ? "O pedido de localização demorou demasiado tempo. Tente novamente."
              : "The location request took too long. Please try again."
          );

          return;
        }

        setLocating(false);

        setLocationMessage(
          pt
            ? "Não foi possível encontrar a sua localização. Tente novamente."
            : "We couldn't find your location. Please try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  const nearEvents = userLocation
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

  const categoryFilteredEvents =
    selectedCategory === "All Categories"
      ? nearEvents
      : nearEvents.filter(
          (event) =>
            event.category === selectedCategory
        );

  const visibleEvents =
    selectedArea === "All Areas"
      ? categoryFilteredEvents
      : categoryFilteredEvents.filter((event) =>
          event.location
            .toLowerCase()
            .includes(selectedArea.toLowerCase())
        );

  return (
    <main className="relative min-h-screen bg-white pb-32 sm:pb-40">

      <Header />

      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-8">

        {/* HEADER */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h1 className="text-[24px] font-black text-[#102b52] sm:text-4xl">
              {pt ? "Mapa de eventos" : "Event Map"}
            </h1>

            <p className="mt-1 text-[12px] text-slate-500 sm:mt-2 sm:text-base">
              {pt
                ? "Descubra os eventos que acontecem por todo o Algarve."
                : "Discover events happening across the Algarve."}
            </p>

          </div>

          <button
            type="button"
            onClick={findNearMe}
            disabled={locating}
            className="flex h-10 w-fit items-center justify-center gap-2 rounded-full bg-[#149EAF] px-5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#117F8E] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:h-12 sm:rounded-2xl sm:px-6 sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
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
              {locating
                ? pt
                  ? "A encontrar..."
                  : "Finding you..."
                : pt
                ? "Perto de mim"
                : "Near Me"}
            </span>

          </button>

        </div>

        {/* FILTERS */}

        <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2">

          {/* CATEGORY */}

          <div className="relative">

            <label
              htmlFor="category-filter"
              className="sr-only"
            >
              {pt
                ? "Filtrar por categoria"
                : "Filter by category"}
            </label>

            <div className="relative">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#149EAF]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M7 12h10M10 18h4"
                />
              </svg>

              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value
                  )
                }
                className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-12 pr-10 text-sm font-bold text-[#102b52] shadow-sm outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {pt
                      ? categoryTranslations[category]
                      : category}
                  </option>
                ))}
              </select>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>

            </div>

          </div>

          {/* AREA */}

          <div className="relative">

            <label
              htmlFor="area-filter"
              className="sr-only"
            >
              {pt
                ? "Filtrar por área"
                : "Filter by area"}
            </label>

            <div className="relative">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#149EAF]"
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

              <select
                id="area-filter"
                value={selectedArea}
                onChange={(event) =>
                  setSelectedArea(
                    event.target.value
                  )
                }
                className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-12 pr-10 text-sm font-bold text-[#102b52] shadow-sm outline-none transition focus:border-[#149EAF] focus:ring-2 focus:ring-[#149EAF]/20"
              >
                {areas.map((area) => (
                  <option
                    key={area}
                    value={area}
                  >
                    {pt
                      ? areaTranslations[area]
                      : area}
                  </option>
                ))}
              </select>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>

            </div>

          </div>

        </div>

        {/* RESULT SUMMARY */}

        <div className="mt-3 flex items-center justify-between">

          <p className="text-[12px] font-semibold text-slate-500 sm:text-sm">

            {visibleEvents.length}{" "}

            {pt
              ? visibleEvents.length === 1
                ? "evento"
                : "eventos"
              : `event${
                  visibleEvents.length === 1
                    ? ""
                    : "s"
                }`}

            {pt
              ? " a mostrar"
              : " showing"}

          </p>

          {(selectedCategory !==
            "All Categories" ||
            selectedArea !== "All Areas") && (

            <button
              type="button"
              onClick={() => {
                setSelectedCategory(
                  "All Categories"
                );

                setSelectedArea("All Areas");
              }}
              className="text-[12px] font-bold text-[#149EAF] sm:text-sm"
            >
              {pt
                ? "Limpar filtros"
                : "Clear filters"}
            </button>

          )}

        </div>

        {/* LOCATION MESSAGE */}

        {locationMessage &&
          !locationMessage.startsWith(
            "Location found:"
          ) && (

            <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-[12px] font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100 sm:mt-5 sm:px-5 sm:py-4 sm:text-sm">
              {locationMessage}
            </div>

          )}

        {/* NEAR ME */}

        {userLocation && (

          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:mt-4">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-bold text-slate-900">
                  {pt
                    ? "Eventos perto de si"
                    : "Events near you"}
                </p>

                <p className="text-[12px] text-slate-500 sm:text-sm">
                  {pt
                    ? `A mostrar eventos num raio de ${radius} km`
                    : `Showing events within ${radius} km`}
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                {[5, 10, 25, 50].map(
                  (distance) => (

                    <button
                      key={distance}
                      type="button"
                      onClick={() =>
                        setRadius(distance)
                      }
                      className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition sm:px-4 sm:py-2 sm:text-sm ${
                        radius === distance
                          ? "bg-[#149EAF] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {distance} km
                    </button>

                  )
                )}

              </div>

            </div>

          </div>

        )}

        {/* MAP */}

        <div className="relative z-0 isolate mt-4 overflow-hidden rounded-2xl bg-white shadow sm:mt-6 sm:rounded-3xl">

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