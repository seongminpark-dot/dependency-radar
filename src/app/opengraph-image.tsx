import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Trade Dependency Atlas official country statistics dashboard";
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
            "radial-gradient(circle at 20% 10%, #1e40af 0, transparent 32%), radial-gradient(circle at 85% 20%, #065f46 0, transparent 30%), linear-gradient(135deg, #070a14 0%, #0b1020 55%, #111827 100%)",
          color: "white",
          padding: 64,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #4f46e5, #10b981)",
                boxShadow: "0 20px 70px rgba(79, 70, 229, 0.35)",
              }}
            >
              ⦿
            </div>
            Trade Dependency Atlas
          </div>

          <div
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              fontSize: 22,
              color: "#c7d2fe",
            }}
          >
            Official Statistics Dashboard
          </div>
        </div>

        <div style={{ maxWidth: 880 }}>
          <div
            style={{
              display: "flex",
              marginBottom: 28,
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(129,140,248,0.35)",
              background: "rgba(79,70,229,0.18)",
              color: "#c7d2fe",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              width: "fit-content",
            }}
          >
            Global Trade & Dependency Data
          </div>

          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: -3,
            }}
          >
            Compare country supply dependency with official data.
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.45,
              color: "#cbd5e1",
              maxWidth: 920,
            }}
          >
            World Bank WDI · UN Comtrade · WITS/WTO · EIA
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            fontSize: 24,
            color: "#dbeafe",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderRadius: 18,
              background: "rgba(16,185,129,0.16)",
              border: "1px solid rgba(16,185,129,0.32)",
            }}
          >
            No artificial estimates
          </div>
          <div
            style={{
              padding: "14px 20px",
              borderRadius: 18,
              background: "rgba(59,130,246,0.16)",
              border: "1px solid rgba(59,130,246,0.32)",
            }}
          >
            Latest official source years
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
