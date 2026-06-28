import { NextResponse } from "next/server";

const allowedIndicators = new Set([
  "EG.IMP.CONS.ZS",
  "TM.VAL.FUEL.ZS.UN",
  "TM.VAL.FOOD.ZS.UN",
  "NE.IMP.GNFS.ZS",
  "NE.IMP.GNFS.CD",
  "TM.TAX.MRCH.WM.AR.ZS",
  "LP.LPI.OVRL.XQ",
]);

type WorldBankPoint = {
  date: string;
  value: number | null;
};

export async function GET(
  request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const { searchParams } = new URL(request.url);

  const indicator = searchParams.get("indicator");

  if (!indicator || !allowedIndicators.has(indicator)) {
    return NextResponse.json(
      { error: "Invalid indicator" },
      { status: 400 }
    );
  }

  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 15;

  const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicator}?format=json&per_page=100&date=${fromYear}:${currentYear}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 60 * 60 * 24,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "World Bank API request failed" },
        { status: 502 }
      );
    }

    const json = (await response.json()) as [unknown, WorldBankPoint[] | null];

    const points = (json[1] ?? [])
      .filter((point) => point.value !== null)
      .map((point) => ({
        year: point.date,
        value: Number(point.value),
      }))
      .sort((a, b) => Number(a.year) - Number(b.year));

    return NextResponse.json({
      iso3: iso3.toUpperCase(),
      indicator,
      points,
      source: "World Bank API",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load time series data" },
      { status: 500 }
    );
  }
}
