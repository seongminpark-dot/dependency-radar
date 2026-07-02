import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getCountryById,
  getPackCost,
  getResearchCost,
  getUpgradeCost,
  packTiers,
  pickCountryFromPack,
  regions,
} from "../data/atlasData";
import type {
  CountryRarity,
  OwnedCountry,
  PackTier,
  RegionSlot,
  ResearchKey,
} from "../types";

type MissionKey = "claimIncome" | "openPack" | "upgradeCountry";

type DailyMission = {
  progress: number;
  target: number;
  claimed: boolean;
};

type PackResult = {
  countryId: string;
  flag: string;
  name: string;
  rarity: CountryRarity;
  isNew: boolean;
  coinReward: number;
  gemReward: number;
};

type AtlasTycoonState = {
  coins: number;
  gems: number;
  xp: number;
  level: number;
  incomeBank: number;
  selectedCountryId: string;
  ownedCountries: OwnedCountry[];
  packsOpened: number;
  dailyClaimed: boolean;
  boostUntil: number;
  message: string;
  lastReward: string;
  lastPackResult: PackResult | null;

  dailyMissions: Record<MissionKey, DailyMission>;
  lastMissionDate: string;
  lastDailyRewardDate: string;
  streak: number;

  unlockedRegions: RegionSlot[];
  research: Record<ResearchKey, number>;
  packOpensByTier: Record<PackTier, number>;

  tickIncome: () => void;
  claimIncome: () => void;
  openPack: () => void;
  openPremiumPack: () => void;
  openElitePack: () => void;
  clearPackResult: () => void;
  selectCountry: (id: string) => void;
  upgradeCountry: (id: string) => void;
  claimDailyReward: () => void;
  claimMissionReward: (key: MissionKey) => void;
  activateBoost: () => void;
  unlockRegion: (regionId: RegionSlot) => void;
  upgradeResearch: (key: ResearchKey) => void;
  resetTycoon: () => void;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function createDailyMissions(): Record<MissionKey, DailyMission> {
  return {
    claimIncome: {
      progress: 0,
      target: 1,
      claimed: false,
    },
    openPack: {
      progress: 0,
      target: 1,
      claimed: false,
    },
    upgradeCountry: {
      progress: 0,
      target: 1,
      claimed: false,
    },
  };
}

function getFreshMissions(state: Pick<AtlasTycoonState, "dailyMissions" | "lastMissionDate">) {
  const today = getTodayKey();

  if (state.lastMissionDate !== today || !state.dailyMissions) {
    return createDailyMissions();
  }

  return state.dailyMissions;
}

function advanceMission(
  missions: Record<MissionKey, DailyMission>,
  key: MissionKey,
  amount = 1
) {
  return {
    ...missions,
    [key]: {
      ...missions[key],
      progress: Math.min(missions[key].target, missions[key].progress + amount),
    },
  };
}

function getOwnedCountry(ownedCountries: OwnedCountry[], id: string) {
  return ownedCountries.find((country) => country.id === id);
}

function getSafeUnlockedRegions(state: Pick<AtlasTycoonState, "unlockedRegions">) {
  if (!state.unlockedRegions || state.unlockedRegions.length === 0) {
    return ["east-asia"] as RegionSlot[];
  }

  return state.unlockedRegions;
}

function getSafeResearch(state: Pick<AtlasTycoonState, "research">) {
  return {
    logistics: state.research?.logistics ?? 0,
    banking: state.research?.banking ?? 0,
    market: state.research?.market ?? 0,
    automation: state.research?.automation ?? 0,
  };
}

function getSafePackOpens(state: Pick<AtlasTycoonState, "packOpensByTier">) {
  return {
    standard: state.packOpensByTier?.standard ?? 0,
    premium: state.packOpensByTier?.premium ?? 0,
    elite: state.packOpensByTier?.elite ?? 0,
  };
}

function calculateCountryIncome(country: OwnedCountry) {
  const card = getCountryById(country.id);
  return card.baseIncome * country.level + country.cards * 2;
}

function calculateTotalIncome(ownedCountries: OwnedCountry[], research: Record<ResearchKey, number>) {
  const baseIncome = ownedCountries.reduce((total, country) => total + calculateCountryIncome(country), 0);
  const multiplier =
    1 +
    research.logistics * 0.08 +
    research.market * 0.05 +
    research.automation * 0.03;

  return Math.round(baseIncome * multiplier);
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

function getRarityGemReward(rarity: CountryRarity) {
  if (rarity === "Legendary") return 18;
  if (rarity === "Epic") return 9;
  if (rarity === "Rare") return 4;
  return 1;
}

function getRarityCoinReward(rarity: CountryRarity, research: Record<ResearchKey, number>) {
  const base =
    rarity === "Legendary"
      ? 2400
      : rarity === "Epic"
        ? 1100
        : rarity === "Rare"
          ? 520
          : 180;

  return Math.round(base * (1 + research.market * 0.08));
}

function getMissionReward(key: MissionKey) {
  if (key === "claimIncome") {
    return {
      coins: 350,
      gems: 4,
      xp: 30,
      label: "Income Mission",
    };
  }

  if (key === "openPack") {
    return {
      coins: 500,
      gems: 8,
      xp: 45,
      label: "Pack Mission",
    };
  }

  return {
    coins: 650,
    gems: 6,
    xp: 50,
    label: "Upgrade Mission",
  };
}

function createInitialResearch(): Record<ResearchKey, number> {
  return {
    logistics: 0,
    banking: 0,
    market: 0,
    automation: 0,
  };
}

function createInitialPackOpens(): Record<PackTier, number> {
  return {
    standard: 0,
    premium: 0,
    elite: 0,
  };
}

export const useAtlasTycoonStore = create<AtlasTycoonState>()(
  persist(
    (set, get) => ({
      coins: 850,
      gems: 30,
      xp: 0,
      level: 1,
      incomeBank: 0,
      selectedCountryId: "kor",
      ownedCountries: [
        {
          id: "kor",
          level: 1,
          cards: 1,
        },
      ],
      packsOpened: 0,
      dailyClaimed: false,
      boostUntil: 0,
      message: "국가 카드팩을 열고 세계 지도를 성장시키세요.",
      lastReward: "Starter Atlas unlocked",
      lastPackResult: null,

      dailyMissions: createDailyMissions(),
      lastMissionDate: getTodayKey(),
      lastDailyRewardDate: "",
      streak: 0,

      unlockedRegions: ["east-asia"],
      research: createInitialResearch(),
      packOpensByTier: createInitialPackOpens(),

      tickIncome: () => {
        const state = get();
        const now = Date.now();
        const research = getSafeResearch(state);
        const boost = state.boostUntil > now ? 2 : 1;
        const incomePerTick = calculateTotalIncome(state.ownedCountries, research) * boost;

        set({
          incomeBank: state.incomeBank + incomePerTick,
        });
      },

      claimIncome: () => {
        const state = get();
        const research = getSafeResearch(state);
        const claimAmount = Math.floor(state.incomeBank);
        const freshMissions = getFreshMissions(state);

        if (claimAmount <= 0) {
          set({
            dailyMissions: freshMissions,
            lastMissionDate: getTodayKey(),
            message: "수령할 코인이 아직 없습니다.",
          });
          return;
        }

        const bankingBonus = Math.round(claimAmount * research.banking * 0.05);
        const totalClaim = claimAmount + bankingBonus;
        const xpResult = applyXp(state.level, state.xp, Math.max(5, Math.floor(totalClaim / 80)));

        set({
          coins: state.coins + totalClaim,
          incomeBank: 0,
          level: xpResult.level,
          xp: xpResult.xp,
          dailyMissions: advanceMission(freshMissions, "claimIncome"),
          lastMissionDate: getTodayKey(),
          message: `수익 ${totalClaim.toLocaleString("ko-KR")} coins 수령`,
          lastReward: `+${totalClaim.toLocaleString("ko-KR")} coins`,
        });
      },

      openPack: () => {
        get().openPremiumPack();
      },

      openPremiumPack: () => {
        const state = get();
        const tier: PackTier = "premium";
        const packOpens = getSafePackOpens(state);
        const research = getSafeResearch(state);
        const unlockedRegions = getSafeUnlockedRegions(state);
        const packCost = getPackCost(tier, packOpens[tier]);
        const gemCost = packTiers[tier].gemCost;

        if (state.coins < packCost || state.gems < gemCost) {
          set({
            message: `${packTiers[tier].label}에는 ${packCost.toLocaleString("ko-KR")} coins / ${gemCost} gems가 필요합니다.`,
          });
          return;
        }

        const freshMissions = getFreshMissions(state);
        const pulled = pickCountryFromPack(tier, unlockedRegions);
        const existing = getOwnedCountry(state.ownedCountries, pulled.id);
        const xpResult = applyXp(state.level, state.xp, 45);
        const gemReward = getRarityGemReward(pulled.rarity);
        const coinReward = existing ? getRarityCoinReward(pulled.rarity, research) : 0;

        const nextOwnedCountries = existing
          ? state.ownedCountries.map((country) =>
              country.id === pulled.id
                ? {
                    ...country,
                    cards: country.cards + 1,
                  }
                : country
            )
          : [
              ...state.ownedCountries,
              {
                id: pulled.id,
                level: 1,
                cards: 1,
              },
            ];

        set({
          coins: state.coins - packCost + coinReward,
          gems: state.gems - gemCost + gemReward,
          ownedCountries: nextOwnedCountries,
          selectedCountryId: pulled.id,
          packsOpened: state.packsOpened + 1,
          packOpensByTier: {
            ...packOpens,
            [tier]: packOpens[tier] + 1,
          },
          level: xpResult.level,
          xp: xpResult.xp,
          dailyMissions: advanceMission(freshMissions, "openPack"),
          lastMissionDate: getTodayKey(),
          message: existing
            ? `${pulled.flag} ${pulled.name} 중복 카드 · 보상 ${coinReward.toLocaleString("ko-KR")} coins`
            : `${pulled.flag} ${pulled.name} 국가 해금`,
          lastReward: `${pulled.rarity} · ${pulled.name}`,
          lastPackResult: {
            countryId: pulled.id,
            flag: pulled.flag,
            name: pulled.name,
            rarity: pulled.rarity,
            isNew: !existing,
            coinReward,
            gemReward,
          },
        });
      },

      openElitePack: () => {
        const state = get();
        const tier: PackTier = "elite";
        const packOpens = getSafePackOpens(state);
        const research = getSafeResearch(state);
        const unlockedRegions = getSafeUnlockedRegions(state);
        const packCost = getPackCost(tier, packOpens[tier]);
        const gemCost = packTiers[tier].gemCost;

        if (state.coins < packCost || state.gems < gemCost) {
          set({
            message: `${packTiers[tier].label}에는 ${packCost.toLocaleString("ko-KR")} coins / ${gemCost} gems가 필요합니다.`,
          });
          return;
        }

        const freshMissions = getFreshMissions(state);
        const pulled = pickCountryFromPack(tier, unlockedRegions);
        const existing = getOwnedCountry(state.ownedCountries, pulled.id);
        const xpResult = applyXp(state.level, state.xp, 80);
        const gemReward = getRarityGemReward(pulled.rarity) + 4;
        const coinReward = existing ? getRarityCoinReward(pulled.rarity, research) : 0;

        const nextOwnedCountries = existing
          ? state.ownedCountries.map((country) =>
              country.id === pulled.id
                ? {
                    ...country,
                    cards: country.cards + 1,
                  }
                : country
            )
          : [
              ...state.ownedCountries,
              {
                id: pulled.id,
                level: 1,
                cards: 1,
              },
            ];

        set({
          coins: state.coins - packCost + coinReward,
          gems: state.gems - gemCost + gemReward,
          ownedCountries: nextOwnedCountries,
          selectedCountryId: pulled.id,
          packsOpened: state.packsOpened + 1,
          packOpensByTier: {
            ...packOpens,
            [tier]: packOpens[tier] + 1,
          },
          level: xpResult.level,
          xp: xpResult.xp,
          dailyMissions: advanceMission(freshMissions, "openPack"),
          lastMissionDate: getTodayKey(),
          message: existing
            ? `${pulled.flag} ${pulled.name} 중복 카드 · 보상 ${coinReward.toLocaleString("ko-KR")} coins`
            : `${pulled.flag} ${pulled.name} 국가 해금`,
          lastReward: `${pulled.rarity} · ${pulled.name}`,
          lastPackResult: {
            countryId: pulled.id,
            flag: pulled.flag,
            name: pulled.name,
            rarity: pulled.rarity,
            isNew: !existing,
            coinReward,
            gemReward,
          },
        });
      },

      clearPackResult: () => {
        set({
          lastPackResult: null,
        });
      },

      selectCountry: (id) => {
        set({
          selectedCountryId: id,
        });
      },

      upgradeCountry: (id) => {
        const state = get();
        const freshMissions = getFreshMissions(state);
        const owned = getOwnedCountry(state.ownedCountries, id);

        if (!owned) {
          set({
            dailyMissions: freshMissions,
            lastMissionDate: getTodayKey(),
            message: "먼저 국가를 해금해야 합니다.",
          });
          return;
        }

        const card = getCountryById(id);
        const cost = getUpgradeCost(owned.level, card.rarity);

        if (state.coins < cost) {
          set({
            dailyMissions: freshMissions,
            lastMissionDate: getTodayKey(),
            message: `업그레이드 비용 ${cost.toLocaleString("ko-KR")} coins가 필요합니다.`,
          });
          return;
        }

        const xpResult = applyXp(state.level, state.xp, 45 + owned.level * 5);

        set({
          coins: state.coins - cost,
          ownedCountries: state.ownedCountries.map((country) =>
            country.id === id
              ? {
                  ...country,
                  level: country.level + 1,
                }
              : country
          ),
          level: xpResult.level,
          xp: xpResult.xp,
          dailyMissions: advanceMission(freshMissions, "upgradeCountry"),
          lastMissionDate: getTodayKey(),
          message: `${card.flag} ${card.landmark} Lv.${owned.level + 1} 업그레이드`,
          lastReward: `${card.name} income up`,
        });
      },

      claimDailyReward: () => {
        const state = get();
        const today = getTodayKey();

        if (state.lastDailyRewardDate === today) {
          set({
            dailyClaimed: true,
            message: "오늘의 보상은 이미 받았습니다.",
          });
          return;
        }

        const yesterday = getYesterdayKey();
        const nextStreak = state.lastDailyRewardDate === yesterday ? state.streak + 1 : 1;
        const streakBonus = Math.min(7, nextStreak) * 120;

        set({
          coins: state.coins + 1200 + streakBonus,
          gems: state.gems + 25,
          dailyClaimed: true,
          lastDailyRewardDate: today,
          streak: nextStreak,
          message: `일일 보상 획득 · ${1200 + streakBonus} coins / 25 gems · Streak ${nextStreak}`,
          lastReward: `Daily reward · Streak ${nextStreak}`,
        });
      },

      claimMissionReward: (key) => {
        const state = get();
        const freshMissions = getFreshMissions(state);
        const mission = freshMissions[key];

        if (!mission) {
          set({
            message: "미션을 찾을 수 없습니다.",
          });
          return;
        }

        if (mission.claimed) {
          set({
            message: "이미 수령한 미션 보상입니다.",
          });
          return;
        }

        if (mission.progress < mission.target) {
          set({
            dailyMissions: freshMissions,
            lastMissionDate: getTodayKey(),
            message: "아직 미션이 완료되지 않았습니다.",
          });
          return;
        }

        const reward = getMissionReward(key);
        const xpResult = applyXp(state.level, state.xp, reward.xp);

        set({
          coins: state.coins + reward.coins,
          gems: state.gems + reward.gems,
          level: xpResult.level,
          xp: xpResult.xp,
          dailyMissions: {
            ...freshMissions,
            [key]: {
              ...mission,
              claimed: true,
            },
          },
          lastMissionDate: getTodayKey(),
          message: `${reward.label} 보상 수령 · ${reward.coins} coins / ${reward.gems} gems`,
          lastReward: `${reward.label} claimed`,
        });
      },

      activateBoost: () => {
        const state = get();

        if (state.gems < 10) {
          set({
            message: "부스트를 사용하려면 10 gems가 필요합니다.",
          });
          return;
        }

        set({
          gems: state.gems - 10,
          boostUntil: Date.now() + 1000 * 60 * 2,
          message: "2분 동안 생산량 2배 부스트 활성화",
          lastReward: "2x boost active",
        });
      },

      unlockRegion: (regionId) => {
        const state = get();
        const unlockedRegions = getSafeUnlockedRegions(state);

        if (unlockedRegions.includes(regionId)) {
          set({
            message: "이미 해금된 지역입니다.",
          });
          return;
        }

        const region = regions.find((item) => item.id === regionId);

        if (!region) {
          set({
            message: "지역을 찾을 수 없습니다.",
          });
          return;
        }

        if (state.level < region.requiredLevel) {
          set({
            message: `Lv.${region.requiredLevel}부터 해금할 수 있습니다.`,
          });
          return;
        }

        if (state.coins < region.unlockCost || state.gems < region.unlockGems) {
          set({
            message: `${region.name} 해금에는 ${region.unlockCost.toLocaleString("ko-KR")} coins / ${region.unlockGems} gems가 필요합니다.`,
          });
          return;
        }

        set({
          coins: state.coins - region.unlockCost,
          gems: state.gems - region.unlockGems,
          unlockedRegions: [...unlockedRegions, regionId],
          message: `${region.name} 지역 해금 완료`,
          lastReward: `${region.name} unlocked`,
        });
      },

      upgradeResearch: (key) => {
        const state = get();
        const research = getSafeResearch(state);
        const level = research[key];
        const cost = getResearchCost(key, level);
        const gemCost =
          key === "logistics"
            ? 0
            : key === "banking"
              ? 4 + level * 2
              : key === "market"
                ? 8 + level * 3
                : 12 + level * 4;

        if (state.coins < cost || state.gems < gemCost) {
          set({
            message: `연구에는 ${cost.toLocaleString("ko-KR")} coins / ${gemCost} gems가 필요합니다.`,
          });
          return;
        }

        const xpResult = applyXp(state.level, state.xp, 60 + level * 15);

        set({
          coins: state.coins - cost,
          gems: state.gems - gemCost,
          research: {
            ...research,
            [key]: level + 1,
          },
          level: xpResult.level,
          xp: xpResult.xp,
          message: `연구 업그레이드 완료 · Lv.${level + 1}`,
          lastReward: `Research ${key} Lv.${level + 1}`,
        });
      },

      resetTycoon: () => {
        set({
          coins: 850,
          gems: 30,
          xp: 0,
          level: 1,
          incomeBank: 0,
          selectedCountryId: "kor",
          ownedCountries: [
            {
              id: "kor",
              level: 1,
              cards: 1,
            },
          ],
          packsOpened: 0,
          dailyClaimed: false,
          boostUntil: 0,
          message: "Atlas Tycoon이 초기화되었습니다.",
          lastReward: "Reset complete",
          lastPackResult: null,
          dailyMissions: createDailyMissions(),
          lastMissionDate: getTodayKey(),
          lastDailyRewardDate: "",
          streak: 0,
          unlockedRegions: ["east-asia"],
          research: createInitialResearch(),
          packOpensByTier: createInitialPackOpens(),
        });
      },
    }),
    {
      name: "datlora-atlas-tycoon-v1",
    }
  )
);
