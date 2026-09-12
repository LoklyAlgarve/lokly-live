"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LocationPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (latitude: number, longitude: number) => void;
};

type SearchResult = {
  lat: string;
  lon: string;
  display_name: string;
};

const ALGARVE_CENTER: [number, number] = [37.17, -8.0];

const markerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      background: #149EAF;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 9px;
        left: 9px;
      "></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapMover({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.flyTo([latitude, longitude], 16, {
        duration: 0.8,
      });
    }
  }, [latitude, longitude, map]);

  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSearch() {
    const query = searchText.trim();

    if (!query) {
      return;
    }

    setSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=pt&q=${encodeURIComponent(
          `${query}, Portugal`
        )}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const results: SearchResult[] = await response.json();

      if (results.length === 0) {
        setSearchError(
          "We couldn't find that place. Try the venue name and town."
        );
      } else {
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Location search error:", error);
      setSearchError(
        "We couldn't search for that location right now. Please try again."
      );
    } finally {
      setSearching(false);
    }
  }

  function selectSearchResult(result: SearchResult) {
    const lat = Number(result.lat);
    const lon = Number(result.lon);

    onLocationChange(lat, lon);
    setSearchResults([]);
    setSearchText(result.display_name);
  }

  if (!mounted) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">
        Loading map...
      </div>
    );
  }

  const selectedLocation =
    latitude !== null && longitude !== null
      ? ([latitude, longitude] as [number, number])
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="bg-teal-50 px-4 py-4">
        <p className="text-sm font-semibold text-slate-800">
          Find the event location
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          Search for the venue or address, then choose the correct place.
          You can also tap the map to set the exact location.
        </p>

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setSearchResults([]);
              setSearchError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search venue or address"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={searching || !searchText.trim()}
            className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {searchError && (
          <p className="mt-2 text-xs text-red-600">{searchError}</p>
        )}

        {searchResults.length > 0 && (
          <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {searchResults.map((result, index) => (
              <button
                key={`${result.lat}-${result.lon}-${index}`}
                type="button"
                onClick={() => selectSearchResult(result)}
                className="block w-full border-b border-slate-100 px-3 py-3 text-left text-sm text-slate-700 last:border-b-0 hover:bg-slate-50"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <MapContainer
        center={selectedLocation || ALGARVE_CENTER}
        zoom={selectedLocation ? 15 : 9}
        scrollWheelZoom={true}
        className="h-[320px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onLocationChange={onLocationChange} />

        <MapMover latitude={latitude} longitude={longitude} />

        {selectedLocation && (
          <Marker position={selectedLocation} icon={markerIcon} />
        )}
      </MapContainer>

      {selectedLocation ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-medium text-slate-500">
            Location selected
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {latitude!.toFixed(6)}, {longitude!.toFixed(6)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            You can tap another point on the map to adjust the pin.
          </p>
        </div>
      ) : (
        <div className="border-t border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-500">
            Search for a venue above or tap the map to select a location.
          </p>
        </div>
      )}
    </div>
  );
}