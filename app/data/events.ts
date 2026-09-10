import { createClient } from "@/utils/supabase/client";

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

const CACHE_KEY = "lokly-events";
const CACHE_TIME = 5 * 60 * 1000;

export async function getEvents(): Promise<Event[]> {
  try {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);

          if (
            parsed.timestamp &&
            Date.now() - parsed.timestamp < CACHE_TIME &&
            Array.isArray(parsed.events)
          ) {
            return parsed.events;
          }
        } catch {
          // Ignore invalid cache
        }
      }
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("approved", true)
      .order("date", { ascending: true });

    if (error) {
      throw error;
    }

    const events: Event[] = (data || []).map((item) => ({
      id: Number(item.id),
      title: item.title || "Untitled Event",
      location: item.location || "Algarve",
      date: item.date || "",
      time: item.time || "",
      category: item.category || "",
      price: item.price || "Free",
      image:
        item.image ||
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
      featured: Boolean(item.featured),
      description: item.description || "",
      website: item.website || "",
      latitude: Number(item.latitude) || 0,
      longitude: Number(item.longitude) || 0,
      wheelchairFriendly:
        item.wheelchair_friendly || "Unknown",
      petFriendly:
        item.pet_friendly || "Unknown",
    }));

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

          return Array.isArray(parsed.events)
            ? parsed.events
            : [];
        } catch {
          return [];
        }
      }
    }

    return [];
  }
}