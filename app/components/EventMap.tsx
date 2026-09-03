"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Event = {
  id: number;
  title: string;
  location: string;
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

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
    map.setView([latitude, longitude], 11);
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

export default function EventMap({
  events,
  userLocation,
}: Props) {
  const router = useRouter();

  /*
   * Leaflet can hold onto an old DOM element during
   * Next.js Fast Refresh. Giving the map a fresh key
   * forces Leaflet to create a clean map instance.
   */
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setMapKey((current) => current + 1);
  }, []);

  if (mapKey === 0) {
    return (
      <div className="flex h-[65vh] min-h-[500px] items-center justify-center bg-slate-100">
        <p className="font-semibold text-slate-500">
          Loading map...
        </p>
      </div>
    );
  }

  return (
    <MapContainer
      key={mapKey}
      center={
        userLocation
          ? [userLocation.latitude, userLocation.longitude]
          : [37.25, -8.25]
      }
      zoom={userLocation ? 11 : 9}
      scrollWheelZoom={true}
      className="h-[65vh] min-h-[500px] w-full"
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
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
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
            icon={markerIcon}
          >
            <Popup>
              <div className="min-w-[190px]">
                <h3 className="text-base font-bold text-slate-900">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {event.location}
                </p>

                {distance !== null && (
                  <p className="mt-2 text-sm font-semibold text-[#149EAF]">
                    {distance < 1
                      ? `${Math.round(distance * 1000)} m away`
                      : `${distance.toFixed(1)} km away`}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    router.push(`/events/${event.id}`)
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