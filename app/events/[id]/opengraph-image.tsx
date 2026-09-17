import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import { getEvents } from "../../data/events";

export const runtime = "edge";

export const alt = "Lokly Event";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const events = await getEvents();

  const event = events.find(
    (item) => String(item.id) === String(id)
  );

  const title =
    event?.title || "What's happening in the Algarve?";

  const location = event?.location || "Algarve";

  const date = event?.date || "";

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
          background: "#ffffff",
          color: "#102F56",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#149EAF",
            marginBottom: 30,
          }}
        >
          LOKLY
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: 35,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 30,
            marginBottom: 15,
          }}
        >
          {date}
        </div>

        <div
          style={{
            fontSize: 30,
          }}
        >
          {location}
        </div>

        <div
          style={{
            marginTop: 45,
            fontSize: 24,
            color: "#64748b",
          }}
        >
          Discover what's happening near you
        </div>
      </div>
    ),
    {
      ...size,
    }
  );

  return image as unknown as ReactNode;
}