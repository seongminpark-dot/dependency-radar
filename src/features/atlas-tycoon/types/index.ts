export type CountryRarity = "Common" | "Rare" | "Epic" | "Legendary";

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
};

export type OwnedCountry = {
  id: string;
  level: number;
  cards: number;
};
