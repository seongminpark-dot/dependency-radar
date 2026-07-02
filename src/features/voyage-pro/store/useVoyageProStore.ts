import { create } from "zustand";
import { contracts, modeProfiles } from "../data/gameData";
import type { GamePhase, UpgradeKey, VoyageMode } from "../types";

type VoyageProState = {
  phase: GamePhase;
  mode: VoyageMode;
  selectedContractId: string;
  coins: number;
  gems: number;
  fuel: number;
  food: number;
  hull: number;
  distance: number;
  visitedPorts: number;
  reputation: number;
  dailyRewardClaimed: boolean;
  message: string;
  upgrades: Record<UpgradeKey, number>;

  setMode: (mode: VoyageMode) => void;
  selectContract: (contractId: string) => void;
  startVoyage: () => void;
  simulateArrival: () => void;
  openShop: () => void;
  closeShop: () => void;
  buyUpgrade: (key: UpgradeKey, price: number) => void;
  claimDailyReward: () => void;
  resetRun: () => void;
};

const defaultUpgrades: Record<UpgradeKey, number> = {
  engine: 1,
  hull: 1,
  cargo: 1,
  navigation: 1,
};

function getSelectedContract(contractId: string) {
  return contracts.find((contract) => contract.id === contractId) ?? contracts[0];
}

export const useVoyageProStore = create<VoyageProState>((set, get) => ({
  phase: "lobby",
  mode: "normal",
  selectedContractId: contracts[0]?.id ?? "",
  coins: 1200,
  gems: 25,
  fuel: 100,
  food: 100,
  hull: 100,
  distance: 0,
  visitedPorts: 0,
  reputation: 0,
  dailyRewardClaimed: false,
  message: "계약을 선택하고 출항 준비를 시작하세요.",
  upgrades: defaultUpgrades,

  setMode: (mode) => {
    const current = get();

    if (current.phase === "voyage") {
      set({
        message: "항해 중에는 모드를 바꿀 수 없습니다.",
      });
      return;
    }

    set({
      mode,
      fuel: modeProfiles[mode].startingFuel,
      message: `${modeProfiles[mode].label} 모드가 선택되었습니다.`,
    });
  },

  selectContract: (contractId) => {
    const contract = getSelectedContract(contractId);

    set({
      selectedContractId: contract.id,
      message: `${contract.title} 계약을 선택했습니다.`,
    });
  },

  startVoyage: () => {
    const current = get();
    const profile = modeProfiles[current.mode];

    set({
      phase: "voyage",
      fuel: profile.startingFuel,
      food: 100,
      hull: 100,
      message: "출항했습니다. 다음 단계에서는 실제 회피/획득 플레이 루프가 연결됩니다.",
    });
  },

  simulateArrival: () => {
    const current = get();
    const contract = getSelectedContract(current.selectedContractId);
    const profile = modeProfiles[current.mode];

    const cargoBonus = current.upgrades.cargo * 70;
    const rewardCoins = Math.round((contract.rewardCoins + cargoBonus) * profile.rewardMultiplier);
    const rewardGems = Math.round(contract.rewardGems * profile.rewardMultiplier);
    const riskCost = Math.round(contract.risk * profile.riskMultiplier * 5);

    set({
      phase: "port",
      coins: current.coins + rewardCoins - riskCost,
      gems: current.gems + rewardGems,
      fuel: Math.max(20, current.fuel - 18),
      food: Math.max(25, current.food - 14),
      hull: Math.max(30, current.hull - Math.round(contract.risk * profile.riskMultiplier * 0.35)),
      distance: current.distance + 1200 + current.upgrades.engine * 140,
      visitedPorts: current.visitedPorts + 1,
      reputation: current.reputation + 1,
      message: `항구 도착. 계약 보상 ${rewardCoins} coins / ${rewardGems} gems 획득, 위험 비용 ${riskCost} coins 차감.`,
    });
  },

  openShop: () => {
    set({
      phase: "shop",
      message: "상점에서 선박을 업그레이드할 수 있습니다.",
    });
  },

  closeShop: () => {
    set({
      phase: "lobby",
      message: "로비로 돌아왔습니다.",
    });
  },

  buyUpgrade: (key, price) => {
    const current = get();

    if (current.coins < price) {
      set({
        message: "코인이 부족합니다.",
      });
      return;
    }

    set({
      coins: current.coins - price,
      upgrades: {
        ...current.upgrades,
        [key]: current.upgrades[key] + 1,
      },
      message: "업그레이드가 완료되었습니다.",
    });
  },

  claimDailyReward: () => {
    const current = get();

    if (current.dailyRewardClaimed) {
      set({
        message: "오늘의 보상은 이미 받았습니다.",
      });
      return;
    }

    set({
      coins: current.coins + 600,
      gems: current.gems + 12,
      dailyRewardClaimed: true,
      message: "일일 보상 600 coins / 12 gems를 받았습니다.",
    });
  },

  resetRun: () => {
    set({
      phase: "lobby",
      fuel: 100,
      food: 100,
      hull: 100,
      message: "새 항해를 준비합니다.",
    });
  },
}));
