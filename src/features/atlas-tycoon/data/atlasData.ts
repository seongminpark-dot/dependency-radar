import type { CountryCard } from "../types";

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
  },
];

export const rarityOrder = {
  Common: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
} as const;

export const rarityLabels = {
  Common: "Common",
  Rare: "Rare",
  Epic: "Epic",
  Legendary: "Legendary",
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

export function pickCountryFromPack() {
  const roll = Math.random();

  let pool = countryCards.filter((country) => country.rarity === "Common");

  if (roll > 0.62) {
    pool = countryCards.filter((country) => country.rarity === "Rare");
  }

  if (roll > 0.86) {
    pool = countryCards.filter((country) => country.rarity === "Epic");
  }

  if (roll > 0.975) {
    pool = countryCards.filter((country) => country.rarity === "Legendary");
  }

  return pool[Math.floor(Math.random() * pool.length)] ?? countryCards[0];
}
