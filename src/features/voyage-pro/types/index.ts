export type VoyageMode = "normal" | "storm" | "expert";

export type GamePhase = "lobby" | "voyage" | "port" | "shop" | "result";

export type UpgradeKey = "engine" | "hull" | "cargo" | "navigation";

export type Contract = {
  id: string;
  icon: string;
  title: string;
  route: string;
  rewardCoins: number;
  rewardGems: number;
  risk: number;
  description: string;
};

export type Port = {
  id: string;
  name: string;
  region: string;
  theme: string;
  distanceLabel: string;
};

export type Upgrade = {
  key: UpgradeKey;
  title: string;
  description: string;
  basePrice: number;
};
