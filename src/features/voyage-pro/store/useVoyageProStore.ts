import { create } from "zustand";
import { contracts, modeProfiles, shipSkins } from "../data/gameData";
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
  bestDistance: number;
  visitedPorts: number;
  reputation: number;
  level: number;
  xp: number;
  chests: number;
  dailyRewardClaimed: boolean;
  message: string;
  combo: number;
  unlockedSkins: string[];
  currentSkinId: string;
  upgrades: Record<UpgradeKey, number>;

  setMode: (mode: VoyageMode) => void;
  selectContract: (contractId: string) => void;
  startVoyage: () => void;
  completeVoyage: () => void;
  collectItem: (type: string) => void;
  hitHazard: (type: string) => void;
  useBoost: () => boolean;
  openShop: () => void;
  closeShop: () => void;
  buyUpgrade: (key: UpgradeKey, price: number) => void;
  claimDailyReward: () => void;
  openRewardChest: () => void;
  equipSkin: (skinId: string) => void;
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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getFailureState(partial: Partial<VoyageProState>) {
  const hull = partial.hull ?? 100;
  const fuel = partial.fuel ?? 100;
  const food = partial.food ?? 100;
  const coins = partial.coins ?? 0;

  if (hull <= 0) return "선체가 파손되었습니다.";
  if (fuel <= 0) return "연료가 고갈되었습니다.";
  if (food <= 0) return "식량이 고갈되었습니다.";
  if (coins < -300) return "운영 자금이 부족합니다.";

  return "";
}

function applyXp(level: number, xp: number, gain: number) {
  let nextLevel = level;
  let nextXp = xp + gain;
  let leveledUp = false;

  while (nextXp >= nextLevel * 100) {
    nextXp -= nextLevel * 100;
    nextLevel += 1;
    leveledUp = true;
  }

  return {
    level: nextLevel,
    xp: nextXp,
    leveledUp,
  };
}

function randomInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function pickRandomSkin(unlockedSkins: string[]) {
  const lockedSkins = shipSkins.filter((skin) => !unlockedSkins.includes(skin.id));

  if (lockedSkins.length === 0) return null;

  return lockedSkins[Math.floor(Math.random() * lockedSkins.length)];
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
  bestDistance: 0,
  visitedPorts: 0,
  reputation: 0,
  level: 1,
  xp: 0,
  chests: 1,
  dailyRewardClaimed: false,
  message: "계약을 선택하고 출항하세요.",
  combo: 0,
  unlockedSkins: ["azure-runner"],
  currentSkinId: "azure-runner",
  upgrades: defaultUpgrades,

  setMode: (mode) => {
    const current = get();

    if (current.phase === "voyage") {
      set({ message: "항해 중에는 모드를 바꿀 수 없습니다." });
      return;
    }

    set({
      mode,
      fuel: modeProfiles[mode].startingFuel,
      message: `${modeProfiles[mode].label} 모드 선택`,
    });
  },

  selectContract: (contractId) => {
    const contract = getSelectedContract(contractId);

    set({
      selectedContractId: contract.id,
      message: `${contract.title} 계약 선택`,
    });
  },

  startVoyage: () => {
    const current = get();
    const profile = modeProfiles[current.mode];

    set({
      phase: "voyage",
      fuel: Math.max(30, Math.min(current.fuel, profile.startingFuel)),
      food: Math.max(35, current.food),
      hull: Math.max(40, current.hull),
      combo: 0,
      message: "출항했습니다. 보상 아이템을 모으고 위험을 피하세요.",
    });
  },

  completeVoyage: () => {
    const current = get();
    const contract = getSelectedContract(current.selectedContractId);
    const profile = modeProfiles[current.mode];

    const cargoBonus = current.upgrades.cargo * 90;
    const distanceGain = 1200 + current.upgrades.engine * 180 + current.visitedPorts * 120;
    const rewardCoins = Math.round((contract.rewardCoins + cargoBonus) * profile.rewardMultiplier);
    const rewardGems = Math.round(contract.rewardGems * profile.rewardMultiplier);
    const riskCost = Math.round(contract.risk * profile.riskMultiplier * 4.5);
    const dockingCost = 120 + current.visitedPorts * 35;
    const xpGain = 80 + contract.risk + current.visitedPorts * 8;
    const xpResult = applyXp(current.level, current.xp, xpGain);
    const chestGain = current.visitedPorts > 0 && (current.visitedPorts + 1) % 3 === 0 ? 1 : 0;

    const nextCoins = current.coins + rewardCoins - riskCost - dockingCost;
    const nextGems = current.gems + rewardGems;
    const nextFuel = clamp(current.fuel + 30, 0, 130);
    const nextFood = clamp(current.food + 26, 0, 130);
    const nextHull = clamp(current.hull + 12, 0, 130);
    const nextDistance = current.distance + distanceGain;

    set({
      phase: "port",
      coins: nextCoins,
      gems: nextGems,
      fuel: nextFuel,
      food: nextFood,
      hull: nextHull,
      distance: nextDistance,
      bestDistance: Math.max(current.bestDistance, nextDistance),
      visitedPorts: current.visitedPorts + 1,
      reputation: current.reputation + 1,
      level: xpResult.level,
      xp: xpResult.xp,
      chests: current.chests + chestGain,
      combo: 0,
      message:
        `항구 도착 · ${rewardCoins} coins / ${rewardGems} gems / ${xpGain} XP 획득` +
        (xpResult.leveledUp ? " · 레벨 상승" : "") +
        (chestGain > 0 ? " · 보상 상자 +1" : ""),
    });
  },

  collectItem: (type) => {
    const current = get();

    let nextCoins = current.coins;
    let nextGems = current.gems;
    let nextFuel = current.fuel;
    let nextFood = current.food;
    let nextHull = current.hull;
    const nextCombo = current.combo + 1;
    const xpResult = applyXp(current.level, current.xp, 5);
    let message = "보상 획득";

    if (type === "coin") {
      const gain = 90 + current.combo * 15;
      nextCoins += gain;
      message = `Coins +${gain}`;
    }

    if (type === "gem") {
      const gain = current.combo >= 4 ? 3 : 2;
      nextGems += gain;
      message = `Gems +${gain}`;
    }

    if (type === "fuel") {
      nextFuel = clamp(nextFuel + 18 + current.upgrades.engine * 2, 0, 130);
      message = "연료 회복";
    }

    if (type === "food") {
      nextFood = clamp(nextFood + 16, 0, 130);
      message = "식량 회복";
    }

    if (type === "repair") {
      nextHull = clamp(nextHull + 15 + current.upgrades.hull * 2, 0, 130);
      message = "선체 회복";
    }

    if (type === "boost") {
      nextFuel = clamp(nextFuel + 6, 0, 130);
      message = "해류 부스트";
    }

    set({
      coins: nextCoins,
      gems: nextGems,
      fuel: nextFuel,
      food: nextFood,
      hull: nextHull,
      combo: nextCombo,
      level: xpResult.level,
      xp: xpResult.xp,
      message: xpResult.leveledUp ? `${message} · 레벨 상승` : message,
    });
  },

  hitHazard: (type) => {
    const current = get();
    const profile = modeProfiles[current.mode];
    const hullProtection = current.upgrades.hull * 0.08;
    const navProtection = current.upgrades.navigation * 0.06;
    const damageMultiplier = Math.max(0.58, profile.riskMultiplier - hullProtection - navProtection);

    let nextCoins = current.coins;
    let nextFuel = current.fuel;
    let nextFood = current.food;
    let nextHull = current.hull;
    let message = "위험 충돌";

    if (type === "reef") {
      const damage = Math.round(20 * damageMultiplier);
      nextHull -= damage;
      message = `암초 충돌 · 선체 -${damage}%`;
    }

    if (type === "storm") {
      const damage = Math.round(16 * damageMultiplier);
      nextHull -= damage;
      nextFuel -= 10;
      message = `폭풍 피해 · 선체 -${damage}%`;
    }

    if (type === "pirate") {
      const loss = Math.round(150 * profile.riskMultiplier);
      nextCoins -= loss;
      nextHull -= Math.round(10 * damageMultiplier);
      message = `해적 습격 · Coins -${loss}`;
    }

    if (type === "customs") {
      const loss = Math.round(110 * profile.riskMultiplier);
      nextCoins -= loss;
      message = `세관 비용 · Coins -${loss}`;
    }

    if (type === "drain") {
      nextFood -= 12;
      nextFuel -= 8;
      message = "보급 손실";
    }

    const failureMessage = getFailureState({
      coins: nextCoins,
      fuel: nextFuel,
      food: nextFood,
      hull: nextHull,
    });

    set({
      phase: failureMessage ? "result" : current.phase,
      coins: nextCoins,
      fuel: clamp(nextFuel, -30, 130),
      food: clamp(nextFood, -30, 130),
      hull: clamp(nextHull, -30, 130),
      combo: 0,
      message: failureMessage || message,
    });
  },

  useBoost: () => {
    const current = get();

    if (current.fuel < 6 || current.phase !== "voyage") {
      set({ message: "부스트를 사용할 수 없습니다." });
      return false;
    }

    set({
      fuel: current.fuel - 6,
      message: "부스트 사용",
    });

    return true;
  },

  openShop: () => {
    set({
      phase: "shop",
      message: "상점에서 선박을 강화하세요.",
    });
  },

  closeShop: () => {
    set({
      phase: "lobby",
      message: "출항 준비 완료",
    });
  },

  buyUpgrade: (key, price) => {
    const current = get();

    if (current.coins < price) {
      set({ message: "코인이 부족합니다." });
      return;
    }

    set({
      coins: current.coins - price,
      upgrades: {
        ...current.upgrades,
        [key]: current.upgrades[key] + 1,
      },
      message: "업그레이드 완료",
    });
  },

  claimDailyReward: () => {
    const current = get();

    if (current.dailyRewardClaimed) {
      set({ message: "오늘의 보상은 이미 받았습니다." });
      return;
    }

    const xpResult = applyXp(current.level, current.xp, 60);

    set({
      coins: current.coins + 600,
      gems: current.gems + 12,
      chests: current.chests + 1,
      level: xpResult.level,
      xp: xpResult.xp,
      dailyRewardClaimed: true,
      message: "일일 보상 획득 · 600 coins / 12 gems / 보상 상자 +1",
    });
  },

  openRewardChest: () => {
    const current = get();

    if (current.chests <= 0) {
      set({ message: "열 수 있는 보상 상자가 없습니다." });
      return;
    }

    const coinReward = randomInt(260, 720);
    const gemReward = randomInt(4, 18);
    const skinRoll = Math.random() < 0.28;
    const newSkin = skinRoll ? pickRandomSkin(current.unlockedSkins) : null;
    const xpResult = applyXp(current.level, current.xp, 45);

    set({
      chests: current.chests - 1,
      coins: current.coins + coinReward,
      gems: current.gems + gemReward,
      level: xpResult.level,
      xp: xpResult.xp,
      unlockedSkins: newSkin
        ? [...current.unlockedSkins, newSkin.id]
        : current.unlockedSkins,
      message: newSkin
        ? `상자 개봉 · ${coinReward} coins / ${gemReward} gems / ${newSkin.name} 스킨 해금`
        : `상자 개봉 · ${coinReward} coins / ${gemReward} gems 획득`,
    });
  },

  equipSkin: (skinId) => {
    const current = get();

    if (!current.unlockedSkins.includes(skinId)) {
      set({ message: "아직 해금되지 않은 스킨입니다." });
      return;
    }

    const skin = shipSkins.find((item) => item.id === skinId);

    set({
      currentSkinId: skinId,
      message: `${skin?.name ?? "선박"} 스킨 장착`,
    });
  },

  resetRun: () => {
    const current = get();

    set({
      phase: "lobby",
      fuel: modeProfiles[current.mode].startingFuel,
      food: 100,
      hull: 100,
      combo: 0,
      message: "새 항해를 준비합니다.",
    });
  },
}));
