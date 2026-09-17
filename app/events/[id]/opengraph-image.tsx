import { ImageResponse } from "next/og";
import logo from "../../../public/images/lokly-logo.png";

export const runtime = "edge";

export const alt = "Lokly Event";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={logo.src}
            alt="Lokly"
            style={{
              width: 360,
              height: "auto",
              objectFit: "contain",
            }}
          />

          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              fontWeight: 600,
              color: "#102F56",
            }}
          >
            What's happening in the Algarve?
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}