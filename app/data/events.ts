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
};

const EVENTS_URL =
  "https://script.google.com/macros/s/AKfycbwCOnagvtUqWWTKjs56w6ZlrjRkceh0bnxRPN4Bn7VTukL55iLrNzObL44ZtcbLdH2o/exec";

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
};

export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(EVENTS_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load events");
    }

    const data: SheetEvent[] = await response.json();

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
      featured:
        String(item["Featured"]).toLowerCase() === "true",
      description: item["Description"] || "",
      website: item["Website"] || item["Ticket Link"] || "",
      latitude: Number(item["Latitude"]) || 0,
      longitude: Number(item["Longitude"]) || 0,
    }));
  } catch (error) {
    console.error("Could not load Lokly events:", error);
    return [];
  }
}