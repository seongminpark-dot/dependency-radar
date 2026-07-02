import type { Contract, Port, Upgrade, UpgradeKey, VoyageMode } from "../types";

export const modeProfiles: Record<
  VoyageMode,
  {
    label: string;
    description: string;
    rewardMultiplier: number;
    riskMultiplier: number;
    startingFuel: number;
  }
> = {
  normal: {
    label: "일반 항해",
    description: "처음 플레이하기 좋은 균형형 모드입니다.",
    rewardMultiplier: 1,
    riskMultiplier: 1,
    startingFuel: 100,
  },
  storm: {
    label: "폭풍 항해",
    description: "위험이 높지만 보상이 더 큽니다.",
    rewardMultiplier: 1.35,
    riskMultiplier: 1.35,
    startingFuel: 90,
  },
  expert: {
    label: "전문가 항해",
    description: "자원 관리와 회피 판단이 중요한 고난도 모드입니다.",
    rewardMultiplier: 1.75,
    riskMultiplier: 1.7,
    startingFuel: 80,
  },
};

export const ports: Port[] = [
  {
    id: "busan",
    name: "Busan",
    region: "Korea Strait",
    theme: "#38bdf8",
    distanceLabel: "1,200 km",
  },
  {
    id: "singapore",
    name: "Singapore",
    region: "Malacca Trade Route",
    theme: "#34d399",
    distanceLabel: "2,800 km",
  },
  {
    id: "dubai",
    name: "Dubai",
    region: "Arabian Gulf",
    theme: "#facc15",
    distanceLabel: "4,600 km",
  },
  {
    id: "rotterdam",
    name: "Rotterdam",
    region: "North Sea Logistics Lane",
    theme: "#60a5fa",
    distanceLabel: "8,300 km",
  },
];

export const contracts: Contract[] = [
  {
    id: "electronics",
    icon: "💾",
    title: "전자부품 긴급 운송",
    route: "Busan → Singapore",
    rewardCoins: 820,
    rewardGems: 8,
    risk: 24,
    description: "안정적인 보상과 낮은 리스크의 기본 계약입니다.",
  },
  {
    id: "energy",
    icon: "⚙️",
    title: "에너지 장비 수송",
    route: "Dubai → Rotterdam",
    rewardCoins: 1180,
    rewardGems: 12,
    risk: 38,
    description: "보상은 높지만 세관 검사와 항로 비용이 커집니다.",
  },
  {
    id: "medical",
    icon: "💊",
    title: "긴급 의약품 항로",
    route: "Singapore → Busan",
    rewardCoins: 1450,
    rewardGems: 18,
    risk: 46,
    description: "빠른 도착 보너스가 큰 고수익 계약입니다.",
  },
];

export const upgrades: Upgrade[] = [
  {
    key: "engine",
    title: "엔진 출력",
    description: "속도와 연료 효율을 올립니다.",
    basePrice: 420,
  },
  {
    key: "hull",
    title: "선체 장갑",
    description: "충돌과 폭풍 피해를 줄입니다.",
    basePrice: 380,
  },
  {
    key: "cargo",
    title: "화물창 확장",
    description: "계약 보상과 적재 효율을 올립니다.",
    basePrice: 460,
  },
  {
    key: "navigation",
    title: "항법 시스템",
    description: "위험 이벤트 확률을 낮춥니다.",
    basePrice: 520,
  },
];

export function getUpgradePrice(key: UpgradeKey, level: number) {
  const found = upgrades.find((upgrade) => upgrade.key === key);
  const base = found?.basePrice ?? 400;

  return base + level * 260;
}


export const shipSkins = [
  {
    id: "azure-runner",
    name: "Azure Runner",
    rarity: "Common",
    color: "#38bdf8",
    description: "균형 잡힌 기본 항해선입니다.",
  },
  {
    id: "storm-hawk",
    name: "Storm Hawk",
    rarity: "Rare",
    color: "#facc15",
    description: "폭풍 항로에 어울리는 고속 선박 스킨입니다.",
  },
  {
    id: "crimson-tide",
    name: "Crimson Tide",
    rarity: "Epic",
    color: "#fb7185",
    description: "위험 항로 보상 상자에서 얻을 수 있는 고급 스킨입니다.",
  },
  {
    id: "emerald-freighter",
    name: "Emerald Freighter",
    rarity: "Rare",
    color: "#34d399",
    description: "화물 계약에 특화된 무역선 스킨입니다.",
  },
] as const;
