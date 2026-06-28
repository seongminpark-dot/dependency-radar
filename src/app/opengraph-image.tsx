import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #070914 0%, #111827 45%, #312e81 100%)",
          color: "white",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "28px",
            color: "#c7d2fe",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "9999px",
              background: "#818cf8",
            }}
          />
          Global Country Dependency Statistics
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "82px",
              fontWeight: 800,
              letterSpacing: "-4px",
              lineHeight: 1,
            }}
          >
            Dependency Radar
          </div>

          <div
            style={{
              marginTop: "28px",
              maxWidth: "900px",
              fontSize: "34px",
              lineHeight: 1.35,
              color: "#cbd5e1",
            }}
          >
            Compare country dependency, imports, tariffs, logistics, and supply
            exposure with public World Bank data.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "24px",
            color: "#e0e7ff",
          }}
        >
          <span>Energy</span>
          <span>·</span>
          <span>Food</span>
          <span>·</span>
          <span>Imports</span>
          <span>·</span>
          <span>Tariffs</span>
          <span>·</span>
          <span>Logistics</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
