import { NextResponse } from "next/server";

type IMFIndicator = {
  code: string;
  label: string;
  unit: string;
};

const indicators: IMFIndicator[] = [
  {
    code: "NGDP_RPCH",
    label: "Real GDP growth",
    unit: "%",
  },
  {
    code: "PCPIPCH",
    label: "Inflation",
    unit: "%",
  },
  {
    code: "BCA_NGDPD",
    label: "Current account balance",
    unit: "% of GDP",
  },
  {
    code: "GGXWDG_NGDP",
    label: "Government debt",
    unit: "% of GDP",
  },
  {
    code: "LUR",
    label: "Unemployment rate",
    unit: "%",
  },
  {
    code: "NGDPD",
    label: "GDP, current prices",
    unit: "Billion USD",
  },
];

function normalizeIso3(value: string) {
  return value.trim().toUpperCase();
}

async function fetchIMFIndicator(iso3: string, indicator: IMFIndicator) {
  const periods = "2024,2025,2026";
  const url = `https://www.imf.org/external/datamapper/api/v1/${indicator.code}/${iso3}?periods=${periods}`;

  const response = await fetch(url, {
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    return {
      ...indicator,
      values: {},
    };
  }

  const json = await response.json();

  const values =
    json?.values?.[indicator.code]?.[iso3] ??
    json?.values?.[indicator.code]?.[iso3.toUpperCase()] ??
    {};

  return {
    ...indicator,
    values,
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const country = normalizeIso3(iso3);

  try {
    const results = await Promise.all(
      indicators.map((indicator) => fetchIMFIndicator(country, indicator))
    );

    return NextResponse.json({
      source: "IMF DataMapper / World Economic Outlook",
      note: "2025 and 2026 values may be IMF estimates or forecasts depending on the indicator and country.",
      iso3: country,
      indicators: results,
    });
  } catch {
    return NextResponse.json(
      {
        source: "IMF DataMapper / World Economic Outlook",
        note: "Unable to load IMF outlook data.",
        iso3: country,
        indicators: [],
      },
      { status: 200 }
    );
  }
}
