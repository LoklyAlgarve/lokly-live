
import type { MetadataRoute } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lokly.live";
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/whattodo`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return pages;
  }

  const supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const [eventsResult, activitiesResult] = await Promise.all([
    supabase.from("events").select("id").eq("approved", true),
    supabase.from("what_to_do").select("id").eq("approved", true),
  ]);

  if (eventsResult.error) {
    console.error("Sitemap: could not load events", eventsResult.error);
  }

  if (activitiesResult.error) {
    console.error("Sitemap: could not load activities", activitiesResult.error);
  }

  const eventPages: MetadataRoute.Sitemap = (eventsResult.data ?? []).map(
    (event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const activityPages: MetadataRoute.Sitemap = (
    activitiesResult.data ?? []
  ).map((activity) => ({
    url: `${baseUrl}/whattodo/${activity.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...eventPages, ...activityPages];
}
