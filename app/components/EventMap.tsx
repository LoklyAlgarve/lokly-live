"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Event = {
  id: number;
  title: string;
  location: string;
  category: string;
  latitude: number;
  longitude: number;
};

type Props = {
  events: Event[];
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
};

const categoryColours: Record<string, string> = {
  Music: "#ec4899",
  Festival: "#f97316",
  Market: "#ca8a04",
  "Food & Drink": "#16a34a",
  Sport: "#3b82f6",
  Family: "#8b5cf6",
  "Arts & Culture": "#d946ef",
  Nightlife: "#0ea5e9",
  Comedy: "#14b8a6",
  Theatre: "#f59e0b",
  Exhibitions: "#f43f5e",
  Workshop: "#06b6d4",
  Charity: "#ef4444",
  Community: "#65a30d",
  Retreat: "#6366f1",
};

const categorySymbols: Record<string, string> = {
  Music: "♪",
  Festival: "✦",
  Market: "◆",
  "Food & Drink": "●",
  Sport: "●",
  Family: "●",
  "Arts & Culture": "◇",
  Nightlife: "☾",
  Comedy: "●",
  Theatre: "▣",
  Exhibitions: "□",
  Workshop: "✚",
  Charity: "♡",
  Community: "●",
  Retreat: "◇",
};

function createCategoryIcon(
  category: string
) {
  const colour =
    categoryColours[category] || "#64748b";

  const symbol =
    categorySymbols[category] || "•";

  return new L.DivIcon({
    className: "",
    html: `
      <div style="
        width:32px;
        height:38px;
        position:relative;
        display:flex;
        align-items:flex-start;
        justify-content:center;
        filter:drop-shadow(0 2px 3px rgba(0,0,0,0.25));
      ">
        <div style="
          width:32px;
          height:32px;
          background:${colour};
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          display:flex;
          align-items:center;
          justify-content:center;
          box-sizing:border-box;
        ">
          <span style="
            color:white;
            font-size:15px;
            font-weight:700;
            line-height:1;
            transform:rotate(45deg);
            font-family:Arial,sans-serif;
          ">
            ${symbol}
          </span>
        </div>
      </div>
    `,
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -38],
  });
}

const userIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:18px;
      height:18px;
      background:#149EAF;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 1px 5px rgba(0,0,0,0.35);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function RecenterMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(
      [latitude, longitude],
      11
    );
  }, [latitude, longitude, map]);

  return null;
}

function distanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

export default function EventMap({
  events,
  userLocation,
}: Props) {
  const router = useRouter();

  return (
    <MapContainer
      center={
        userLocation
          ? [
              userLocation.latitude,
              userLocation.longitude,
            ]
          : [37.25, -8.25]
      }
      zoom={userLocation ? 11 : 9}
      scrollWheelZoom={true}
      className="relative z-0 h-[62vh] min-h-[460px] w-full sm:h-[65vh] sm:min-h-[500px]"
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          <Marker
            position={[
              userLocation.latitude,
              userLocation.longitude,
            ]}
            icon={userIcon}
          />

          <RecenterMap
            latitude={
              userLocation.latitude
            }
            longitude={
              userLocation.longitude
            }
          />
        </>
      )}

      {events.map((event) => {
        const distance = userLocation
          ? distanceInKm(
              userLocation.latitude,
              userLocation.longitude,
              event.latitude,
              event.longitude
            )
          : null;

        return (
          <Marker
            key={event.id}
            position={[
              event.latitude,
              event.longitude,
            ]}
            icon={createCategoryIcon(
              event.category
            )}
          >
            <Popup>

              <div className="min-w-[190px]">

                <div className="mb-2 flex items-center gap-2">

                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        categoryColours[
                          event.category
                        ] || "#64748b",
                    }}
                  />

                  <span className="text-xs font-bold text-slate-500">
                    {event.category}
                  </span>

                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {event.location}
                </p>

                {distance !== null && (
                  <p className="mt-2 text-sm font-semibold text-[#149EAF]">
                    {distance < 1
                      ? `${Math.round(
                          distance * 1000
                        )} m away`
                      : `${distance.toFixed(
                          1
                        )} km away`}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/events/${event.id}`
                    )
                  }
                  className="mt-4 w-full rounded-xl bg-[#149EAF] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#117F8E]"
                >
                  View Event
                </button>

              </div>

            </Popup>
          </Marker>
        );
      })}

    </MapContainer>
  );
}