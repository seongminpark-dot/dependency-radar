import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  countryCards,
  getCountryById,
  getUpgradeCost,
  pickCountryFromPack,
} from "../data/atlasData";
import type { CountryRarity, OwnedCountry } from "../types";

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

  tickIncome: () => void;
  claimIncome: () => void;
  openPack: () => void;
  clearPackResult: () => void;
  selectCountry: (id: string) => void;
  upgradeCountry: (id: string) => void;
  claimDailyReward: () => void;
  activateBoost: () => void;
  resetTycoon: () => void;
};

function getOwnedCountry(ownedCountries: OwnedCountry[], id: string) {
  return ownedCountries.find((country) => country.id === id);
}

function calculateCountryIncome(country: OwnedCountry) {
  const card = getCountryById(country.id);
  return card.baseIncome * country.level + country.cards * 2;
}

function calculateTotalIncome(ownedCountries: OwnedCountry[]) {
  return ownedCountries.reduce((total, country) => total + calculateCountryIncome(country), 0);
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

function getRarityCoinReward(rarity: CountryRarity) {
  if (rarity === "Legendary") return 2400;
  if (rarity === "Epic") return 1100;
  if (rarity === "Rare") return 520;
  return 180;
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

      tickIncome: () => {
        const state = get();
        const now = Date.now();
        const boost = state.boostUntil > now ? 2 : 1;
        const incomePerTick = calculateTotalIncome(state.ownedCountries) * boost;

        set({
          incomeBank: state.incomeBank + incomePerTick,
        });
      },

      claimIncome: () => {
        const state = get();
        const claimAmount = Math.floor(state.incomeBank);

        if (claimAmount <= 0) {
          set({
            message: "수령할 코인이 아직 없습니다.",
          });
          return;
        }

        const xpResult = applyXp(state.level, state.xp, Math.max(5, Math.floor(claimAmount / 80)));

        set({
          coins: state.coins + claimAmount,
          incomeBank: 0,
          level: xpResult.level,
          xp: xpResult.xp,
          message: `수익 ${claimAmount.toLocaleString("ko-KR")} coins 수령`,
          lastReward: `+${claimAmount.toLocaleString("ko-KR")} coins`,
        });
      },

      openPack: () => {
        const state = get();
        const packCost = 500 + state.packsOpened * 80;

        if (state.coins < packCost) {
          set({
            message: `카드팩을 열려면 ${packCost.toLocaleString("ko-KR")} coins가 필요합니다.`,
          });
          return;
        }

        const pulled = pickCountryFromPack();
        const existing = getOwnedCountry(state.ownedCountries, pulled.id);
        const xpResult = applyXp(state.level, state.xp, 35);
        const gemReward = getRarityGemReward(pulled.rarity);
        const coinReward = existing ? getRarityCoinReward(pulled.rarity) : 0;

        let nextOwnedCountries: OwnedCountry[];

        if (existing) {
          nextOwnedCountries = state.ownedCountries.map((country) =>
            country.id === pulled.id
              ? {
                  ...country,
                  cards: country.cards + 1,
                }
              : country
          );
        } else {
          nextOwnedCountries = [
            ...state.ownedCountries,
            {
              id: pulled.id,
              level: 1,
              cards: 1,
            },
          ];
        }

        set({
          coins: state.coins - packCost + coinReward,
          gems: state.gems + gemReward,
          ownedCountries: nextOwnedCountries,
          selectedCountryId: pulled.id,
          packsOpened: state.packsOpened + 1,
          level: xpResult.level,
          xp: xpResult.xp,
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
        const owned = getOwnedCountry(state.ownedCountries, id);

        if (!owned) {
          set({
            message: "먼저 국가를 해금해야 합니다.",
          });
          return;
        }

        const card = getCountryById(id);
        const cost = getUpgradeCost(owned.level, card.rarity);

        if (state.coins < cost) {
          set({
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
          message: `${card.flag} ${card.landmark} Lv.${owned.level + 1} 업그레이드`,
          lastReward: `${card.name} income up`,
        });
      },

      claimDailyReward: () => {
        const state = get();

        if (state.dailyClaimed) {
          set({
            message: "오늘의 보상은 이미 받았습니다.",
          });
          return;
        }

        set({
          coins: state.coins + 1200,
          gems: state.gems + 25,
          dailyClaimed: true,
          message: "일일 보상 1,200 coins / 25 gems 획득",
          lastReward: "Daily reward claimed",
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
        });
      },
    }),
    {
      name: "datlora-atlas-tycoon-v1",
    }
  )
);
