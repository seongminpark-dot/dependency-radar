import { ImageResponse } from "next/og";
import countries from "world-countries";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type Params =
  | {
      iso3?: string;
    }
  | Promise<{
      iso3?: string;
    }>;

type CountryRecord = {
  cca2?: string;
  cca3?: string;
  name?: {
    common?: string;
    official?: string;
  };
};

async function resolveParams(params: Params) {
  if (typeof (params as Promise<{ iso3?: string }>).then === "function") {
    return await params;
  }

  return params as { iso3?: string };
}

function normalizeIso3(value?: string) {
  return (value ?? "").trim().toUpperCase();
}

function getCountry(iso3: string) {
  const match = (countries as CountryRecord[]).find(
    (country) => country.cca3?.toUpperCase() === iso3
  );

  return {
    name: match?.name?.common ?? iso3,
    iso2: match?.cca2 ?? "",
  };
}

function getFlagEmoji(iso2: string) {
  if (!iso2 || iso2.length !== 2) return "";

  return iso2
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export default async function Image({
  params,
}: {
  params: Params;
}) {
  const resolved = await resolveParams(params);
  const iso3 = normalizeIso3(resolved.iso3);
  const country = getCountry(iso3);
  const flag = getFlagEmoji(country.iso2);

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
            "radial-gradient(circle at 18% 12%, #1d4ed8 0, transparent 34%), radial-gradient(circle at 82% 16%, #059669 0, transparent 30%), linear-gradient(135deg, #070a14 0%, #0b1020 55%, #111827 100%)",
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
              }}
            >
              ⦿
            </div>
            Dependency Radar
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
            Country Dashboard
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 30,
            }}
          >
            <div
              style={{
                width: 104,
                height: 104,
                borderRadius: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.16)",
                fontSize: 58,
              }}
            >
              {flag || "🌐"}
            </div>

            <div>
              <div
                style={{
                  fontSize: 28,
                  color: "#a5b4fc",
                  fontWeight: 700,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                {iso3}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 72,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: -3,
                }}
              >
                {country.name}
              </div>
            </div>
          </div>

          <div
            style={{
              maxWidth: 980,
              fontSize: 42,
              lineHeight: 1.18,
              fontWeight: 800,
              color: "#f8fafc",
            }}
          >
            Supply dependency, trade, tariff, logistics, and energy statistics.
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#cbd5e1",
            }}
          >
            World Bank WDI · UN Comtrade · WITS/WTO · EIA
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            fontSize: 23,
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
            Official source years
          </div>
          <div
            style={{
              padding: "14px 20px",
              borderRadius: 18,
              background: "rgba(59,130,246,0.16)",
              border: "1px solid rgba(59,130,246,0.32)",
            }}
          >
            No artificial estimates
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
