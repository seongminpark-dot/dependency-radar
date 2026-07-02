export type CountryRarity = "Common" | "Rare" | "Epic" | "Legendary";

export type RegionSlot =
  | "east-asia"
  | "north-america"
  | "southeast-asia"
  | "europe"
  | "middle-east"
  | "south-america";

export type CountryCard = {
  id: string;
  flag: string;
  name: string;
  region: string;
  rarity: CountryRarity;
  baseIncome: number;
  landmark: string;
  bonus: string;
  color: string;
  wikiTitle: string;
  mapSlot: RegionSlot;
};

export type OwnedCountry = {
  id: string;
  level: number;
  cards: number;
};
