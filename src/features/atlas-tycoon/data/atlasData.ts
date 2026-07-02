import type { CountryCard, PackTier, RegionSlot, ResearchKey } from "../types";

export const countryCards: CountryCard[] = [
  {
    id: "kor",
    flag: "🇰🇷",
    name: "Korea",
    region: "East Asia",
    rarity: "Common",
    baseIncome: 12,
    landmark: "Smart Port",
    bonus: "Tech Output",
    color: "#38bdf8",
    wikiTitle: "Lotte World Tower",
    mapSlot: "east-asia",
  },
  {
    id: "usa",
    flag: "🇺🇸",
    name: "United States",
    region: "North America",
    rarity: "Rare",
    baseIncome: 22,
    landmark: "Mega Market",
    bonus: "Coin Flow",
    color: "#60a5fa",
    wikiTitle: "Statue of Liberty",
    mapSlot: "north-america",
  },
  {
    id: "jpn",
    flag: "🇯🇵",
    name: "Japan",
    region: "East Asia",
    rarity: "Common",
    baseIncome: 14,
    landmark: "Precision Factory",
    bonus: "Upgrade Speed",
    color: "#f8fafc",
    wikiTitle: "Tokyo Tower",
    mapSlot: "east-asia",
  },
  {
    id: "sgp",
    flag: "🇸🇬",
    name: "Singapore",
    region: "Southeast Asia",
    rarity: "Rare",
    baseIncome: 24,
    landmark: "Trade Gateway",
    bonus: "Port Revenue",
    color: "#34d399",
    wikiTitle: "Marina Bay Sands",
    mapSlot: "southeast-asia",
  },
  {
    id: "deu",
    flag: "🇩🇪",
    name: "Germany",
    region: "Europe",
    rarity: "Epic",
    baseIncome: 34,
    landmark: "Industrial Core",
    bonus: "Factory Income",
    color: "#facc15",
    wikiTitle: "Brandenburg Gate",
    mapSlot: "europe",
  },
  {
    id: "are",
    flag: "🇦🇪",
    name: "UAE",
    region: "Middle East",
    rarity: "Epic",
    baseIncome: 38,
    landmark: "Energy Hub",
    bonus: "Energy Bonus",
    color: "#fb923c",
    wikiTitle: "Burj Khalifa",
    mapSlot: "middle-east",
  },
  {
    id: "bra",
    flag: "🇧🇷",
    name: "Brazil",
    region: "South America",
    rarity: "Rare",
    baseIncome: 25,
    landmark: "Resource Valley",
    bonus: "Raw Materials",
    color: "#4ade80",
    wikiTitle: "Christ the Redeemer (statue)",
    mapSlot: "south-america",
  },
  {
    id: "che",
    flag: "🇨🇭",
    name: "Switzerland",
    region: "Europe",
    rarity: "Legendary",
    baseIncome: 58,
    landmark: "Finance Citadel",
    bonus: "Premium Yield",
    color: "#fb7185",
    wikiTitle: "Matterhorn",
    mapSlot: "europe",
  },
];

export const regions: {
  id: RegionSlot;
  name: string;
  description: string;
  unlockCost: number;
  unlockGems: number;
  requiredLevel: number;
}[] = [
  {
    id: "east-asia",
    name: "East Asia",
    description: "Starter region",
    unlockCost: 0,
    unlockGems: 0,
    requiredLevel: 1,
  },
  {
    id: "southeast-asia",
    name: "Southeast Asia",
    description: "Trade gateway countries enter the card pool.",
    unlockCost: 2500,
    unlockGems: 6,
    requiredLevel: 2,
  },
  {
    id: "north-america",
    name: "North America",
    description: "High coin-flow countries enter the card pool.",
    unlockCost: 5200,
    unlockGems: 12,
    requiredLevel: 3,
  },
  {
    id: "europe",
    name: "Europe",
    description: "Epic and legendary finance/industry cards enter the pool.",
    unlockCost: 9000,
    unlockGems: 20,
    requiredLevel: 4,
  },
  {
    id: "middle-east",
    name: "Middle East",
    description: "Energy hub cards enter the card pool.",
    unlockCost: 12500,
    unlockGems: 26,
    requiredLevel: 5,
  },
  {
    id: "south-america",
    name: "South America",
    description: "Resource region cards enter the card pool.",
    unlockCost: 15000,
    unlockGems: 32,
    requiredLevel: 6,
  },
];

export const researchUpgrades: {
  key: ResearchKey;
  title: string;
  description: string;
  baseCost: number;
  gemCost: number;
}[] = [
  {
    key: "logistics",
    title: "Global Logistics",
    description: "전체 국가 생산량이 증가합니다.",
    baseCost: 1800,
    gemCost: 0,
  },
  {
    key: "banking",
    title: "Atlas Banking",
    description: "수익 수령 시 추가 코인을 얻습니다.",
    baseCost: 2600,
    gemCost: 4,
  },
  {
    key: "market",
    title: "Market Engine",
    description: "카드팩 중복 보상과 생산 효율이 증가합니다.",
    baseCost: 4200,
    gemCost: 8,
  },
  {
    key: "automation",
    title: "Auto Systems",
    description: "장기 진행을 위한 자동화 효율을 높입니다.",
    baseCost: 6200,
    gemCost: 12,
  },
];

export const packTiers: Record<
  PackTier,
  {
    label: string;
    description: string;
    baseCost: number;
    costGrowth: number;
    gemCost: number;
    rarityBoost: number;
  }
> = {
  standard: {
    label: "Standard Pack",
    description: "기본 국가 카드팩입니다.",
    baseCost: 500,
    costGrowth: 80,
    gemCost: 0,
    rarityBoost: 0,
  },
  premium: {
    label: "Premium Pack",
    description: "Rare 이상 확률이 높은 카드팩입니다.",
    baseCost: 2600,
    costGrowth: 260,
    gemCost: 5,
    rarityBoost: 0.16,
  },
  elite: {
    label: "Elite Pack",
    description: "Epic / Legendary 목표용 고가 카드팩입니다.",
    baseCost: 9200,
    costGrowth: 920,
    gemCost: 18,
    rarityBoost: 0.34,
  },
};

export const rarityOrder = {
  Common: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
} as const;

export function getCountryById(id: string) {
  return countryCards.find((country) => country.id === id) ?? countryCards[0];
}

export function getUpgradeCost(level: number, rarity: CountryCard["rarity"]) {
  const rarityMultiplier = {
    Common: 1,
    Rare: 1.45,
    Epic: 2.1,
    Legendary: 3.2,
  }[rarity];

  return Math.round((240 + level * 180) * rarityMultiplier);
}

export function getPackCost(tier: PackTier, openedCount: number) {
  const pack = packTiers[tier];
  return pack.baseCost + openedCount * pack.costGrowth;
}

export function getResearchCost(key: ResearchKey, level: number) {
  const found = researchUpgrades.find((upgrade) => upgrade.key === key);
  const base = found?.baseCost ?? 2000;
  return Math.round(base * Math.pow(1.72, level));
}

export function pickCountryFromPack(tier: PackTier, unlockedRegions: RegionSlot[]) {
  const pack = packTiers[tier];
  const availableCountries = countryCards.filter((country) =>
    unlockedRegions.includes(country.mapSlot)
  );

  const poolBase = availableCountries.length > 0
    ? availableCountries
    : countryCards.filter((country) => country.mapSlot === "east-asia");

  const roll = Math.random();
  const boost = pack.rarityBoost;

  let rarity: CountryCard["rarity"] = "Common";

  if (roll > 0.62 - boost) {
    rarity = "Rare";
  }

  if (roll > 0.86 - boost * 0.75) {
    rarity = "Epic";
  }

  if (roll > 0.975 - boost * 0.34) {
    rarity = "Legendary";
  }

  let pool = poolBase.filter((country) => country.rarity === rarity);

  if (pool.length === 0) {
    pool = poolBase;
  }

  return pool[Math.floor(Math.random() * pool.length)] ?? poolBase[0];
}
