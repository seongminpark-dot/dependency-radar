export type StatValue = {
  value: number | null;
  year: string | null;
};

export type CountryRow = {
  iso3: string;
  iso2: string;
  name: string;
  region: string;
  incomeLevel: string;
  energyImportPercent: StatValue;
  fuelImportShare: StatValue;
  foodImportShare: StatValue;
  importsGdp: StatValue;
  importUsd: StatValue;
  tariffRate: StatValue;
  logisticsIndex: StatValue;
  dataCompleteness: number;
};

type WorldBankCountry = {
  id: string;
  iso2Code: string;
  name: string;
  region: {
    id: string;
    value: string;
  };
  incomeLevel: {
    id: string;
    value: string;
  };
};

type WorldBankDataPoint = {
  countryiso3code: string;
  date: string;
  value: number | null;
};

const API_BASE = "https://api.worldbank.org/v2";

const INDICATORS = {
  energyImportPercent: "EG.IMP.CONS.ZS",
  fuelImportShare: "TM.VAL.FUEL.ZS.UN",
  foodImportShare: "TM.VAL.FOOD.ZS.UN",
  importsGdp: "NE.IMP.GNFS.ZS",
  importUsd: "NE.IMP.GNFS.CD",
  tariffRate: "TM.TAX.MRCH.WM.AR.ZS",
  logisticsIndex: "LP.LPI.OVRL.XQ",
};

async function fetchWorldBankJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    next: {
      revalidate: 60 * 60 * 24,
    },
  });

  if (!response.ok) {
    throw new Error(`World Bank API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchCountries() {
  const json = await fetchWorldBankJson<[unknown, WorldBankCountry[]]>(
    "/country?format=json&per_page=400"
  );

  const countries = json[1] ?? [];

  return countries.filter((country) => {
    return (
      country.region?.value &&
      country.region.value !== "Aggregates" &&
      country.iso2Code &&
      country.iso2Code !== "XK"
    );
  });
}

async function fetchLatestIndicator(indicatorCode: string) {
  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 12;

  const json = await fetchWorldBankJson<[unknown, WorldBankDataPoint[]]>(
    `/country/all/indicator/${indicatorCode}?format=json&per_page=20000&date=${fromYear}:${currentYear}`
  );

  const points = json[1] ?? [];
  const latestByCountry = new Map<string, StatValue>();

  for (const point of points) {
    if (!point.countryiso3code || point.value === null) continue;

    const current = latestByCountry.get(point.countryiso3code);

    if (!current || Number(point.date) > Number(current.year)) {
      latestByCountry.set(point.countryiso3code, {
        value: Number(point.value),
        year: point.date,
      });
    }
  }

  return latestByCountry;
}

function emptyStat(): StatValue {
  return {
    value: null,
    year: null,
  };
}

function countAvailableStats(stats: StatValue[]) {
  return stats.filter((stat) => stat.value !== null).length;
}

export async function getCountryStats(): Promise<CountryRow[]> {
  const [
    countries,
    energyImportPercent,
    fuelImportShare,
    foodImportShare,
    importsGdp,
    importUsd,
    tariffRate,
    logisticsIndex,
  ] = await Promise.all([
    fetchCountries(),
    fetchLatestIndicator(INDICATORS.energyImportPercent),
    fetchLatestIndicator(INDICATORS.fuelImportShare),
    fetchLatestIndicator(INDICATORS.foodImportShare),
    fetchLatestIndicator(INDICATORS.importsGdp),
    fetchLatestIndicator(INDICATORS.importUsd),
    fetchLatestIndicator(INDICATORS.tariffRate),
    fetchLatestIndicator(INDICATORS.logisticsIndex),
  ]);

  return countries
    .map((country) => {
      const stats = {
        energyImportPercent:
          energyImportPercent.get(country.id) ?? emptyStat(),
        fuelImportShare: fuelImportShare.get(country.id) ?? emptyStat(),
        foodImportShare: foodImportShare.get(country.id) ?? emptyStat(),
        importsGdp: importsGdp.get(country.id) ?? emptyStat(),
        importUsd: importUsd.get(country.id) ?? emptyStat(),
        tariffRate: tariffRate.get(country.id) ?? emptyStat(),
        logisticsIndex: logisticsIndex.get(country.id) ?? emptyStat(),
      };

      return {
        iso3: country.id,
        iso2: country.iso2Code,
        name: country.name,
        region: country.region.value,
        incomeLevel: country.incomeLevel.value,
        ...stats,
        dataCompleteness: countAvailableStats(Object.values(stats)),
      };
    })
    .sort((a, b) => {
      const aValue = a.importsGdp.value ?? -999999;
      const bValue = b.importsGdp.value ?? -999999;
      return bValue - aValue;
    });
}