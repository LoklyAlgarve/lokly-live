export type Event = {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: string;
  image: string;
  featured: boolean;
  description: string;
  website?: string;
  latitude: number;
  longitude: number;
  wheelchairFriendly: string;
  petFriendly: string;
};

const EVENTS_URL =
  "https://script.google.com/macros/s/AKfycbwCOnagvtUqWWTKjs56w6ZlrjRkceh0bnxRPN4Bn7VTukL55iLrNzObL44ZtcbLdH2o/exec";

const CACHE_KEY = "lokly-events";
const CACHE_TIME = 5 * 60 * 1000;

type SheetEvent = {
  "Event Name"?: string;
  "Category"?: string;
  "Description"?: string;
  "Venue"?: string;
  "Town"?: string;
  "Latitude"?: string;
  "Longitude"?: string;
  "Start Date"?: string;
  "Start Time"?: string;
  "End Date"?: string;
  "End Time"?: string;
  "Image"?: string;
  "Ticket Link"?: string;
  "Website"?: string;
  "Price"?: string;
  "Featured"?: string;
  "Wheelchair Friendly"?: string;
  "Pet Friendly"?: string;
};

function convertEvents(data: SheetEvent[]): Event[] {
  return data.map((item, index) => ({
    id: index + 1,
    title: item["Event Name"] || "Untitled Event",
    location: item["Town"] || item["Venue"] || "Algarve",
    date: item["Start Date"] || "",
    time: item["Start Time"] || "",
    category: item["Category"] || "",
    price: item["Price"] || "Free",
    image:
      item["Image"] ||
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
    featured: String(item["Featured"]).toLowerCase() === "true",
    description: item["Description"] || "",
    website: item["Website"] || item["Ticket Link"] || "",
    latitude: Number(item["Latitude"]) || 0,
    longitude: Number(item["Longitude"]) || 0,
    wheelchairFriendly: item["Wheelchair Friendly"] || "Unknown",
    petFriendly: item["Pet Friendly"] || "Unknown",
  }));
}

export async function getEvents(): Promise<Event[]> {
  try {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        const parsed = JSON.parse(cached);

        if (
          parsed.timestamp &&
          Date.now() - parsed.timestamp < CACHE_TIME &&
          Array.isArray(parsed.events)
        ) {
          return parsed.events;
        }
      }
    }

    const response = await fetch(EVENTS_URL);

    if (!response.ok) {
      throw new Error(`Events request failed: ${response.status}`);
    }

    const data: SheetEvent[] = await response.json();
    const events = convertEvents(data);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          events,
        })
      );
    }

    return events;
  } catch (error) {
    console.error("Could not load Lokly events:", error);

    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          return Array.isArray(parsed.events) ? parsed.events : [];
        } catch {
          return [];
        }
      }
    }

    return [];
  }
}