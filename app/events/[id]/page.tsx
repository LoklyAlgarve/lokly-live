
import type { Metadata } from "next";
import { createClient } from "../../../utils/supabase/server";
import EventPageClient, { type Event } from "./EventPageClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getEvent(id: string) {
  const eventId = Number(id);

  if (!Number.isFinite(eventId)) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("approved", true)
    .maybeSingle();

  if (error) {
    console.error("Error loading event:", error);
    return null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getEvent(id);

  if (!data) {
    return {
      title: "Event not found | Lokly",
      description: "Discover local events across the Algarve with Lokly.",
    };
  }

  return {
    title: `${data.title} | Lokly`,
    description:
      data.description ||
      `Discover ${data.title} in ${data.location || "the Algarve"} on Lokly.`,
    alternates: {
      canonical: `https://www.lokly.live/events/${id}`,
    },
    openGraph: {
      title: `${data.title} | Lokly`,
      description: data.description || "",
      url: `https://www.lokly.live/events/${id}`,
      type: "website",
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getEvent(id);

  let initialEvent: Event | null = null;

  if (data) {
    initialEvent = {
      id: Number(data.id),
      title: data.title || "Untitled Event",
      location: data.location || "Algarve",
      date: data.date || "",
      time: data.time || "",
      category: data.category || "",
      secondaryCategory: data.secondary_category || undefined,
      price: data.price || "",
      image: data.image || "/images/lokly-logo.png",
      featured: Boolean(data.featured),
      description: data.description || "",
      website: data.website || undefined,
      latitude: Number(data.latitude) || 0,
      longitude: Number(data.longitude) || 0,
      wheelchairFriendly: data.wheelchair_friendly || "Unknown",
      petFriendly: data.pet_friendly || "Unknown",
      additionalImages: data.additional_images || [],
    };
  }

  const eventImage = data?.image
    ? new URL(data.image, "https://www.lokly.live").toString()
    : undefined;

  const structuredEvent = data
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: data.title,
        description: data.description,
        startDate: data.date,
        ...(data.end_date && {
          endDate: data.end_date,
        }),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode:
          "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: data.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: data.concelho || data.location,
            addressCountry: "PT",
          },
        },
        ...(eventImage && {
          image: [eventImage],
        }),
        ...(data.business_name && {
          organizer: {
            "@type": "Organization",
            name: data.business_name,
          },
        }),
      }
    : null;

  return (
    <>
      {structuredEvent && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredEvent).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <EventPageClient id={id} initialEvent={initialEvent} />
    </>
  );
}
