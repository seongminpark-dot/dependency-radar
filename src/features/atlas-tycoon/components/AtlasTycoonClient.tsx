"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  countryCards,
  getCountryById,
  getPackCost,
  getResearchCost,
  getUpgradeCost,
  regions,
  researchUpgrades,
} from "../data/atlasData";
import { useAtlasTycoonStore } from "../store/useAtlasTycoonStore";
import type { CountryCard } from "../types";
import styles from "./AtlasTycoonClient.module.css";

type DailyMissionKey = "claimIncome" | "openPack" | "upgradeCountry";

type WikiSummary = {
  originalimage?: {
    source?: string;
  };
  thumbnail?: {
    source?: string;
  };
};

function formatNumber(value: number) {
  return Math.floor(value).toLocaleString("ko-KR");
}

function getRarityClass(rarity: string) {
  if (rarity === "Legendary") return styles.legendaryCard;
  if (rarity === "Epic") return styles.epicCard;
  if (rarity === "Rare") return styles.rareCard;
  return styles.commonCard;
}

function LandmarkImmersiveView({ country }: { country: CountryCard }) {
  const [imageUrl, setImageUrl] = useState("");
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.1);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  useEffect(() => {
    let active = true;

    setImageUrl("");
    setPan({ x: 0, y: 0 });
    setZoom(1.1);

    async function loadImage() {
      try {
        const response = await fetch(
          "https://en.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(country.wikiTitle)
        );

        if (!response.ok) return;

        const data = (await response.json()) as WikiSummary;
        const source = data.originalimage?.source || data.thumbnail?.source;

        if (active && source) {
          setImageUrl(source);
        }
      } catch {
        // 이미지가 없으면 컬러 배경으로 대체합니다.
      }
    }

    loadImage();

    return () => {
      active = false;
    };
  }, [country.id, country.wikiTitle]);

  function movePan(dx: number, dy: number) {
    setPan((current) => ({
      x: Math.max(-180, Math.min(180, current.x + dx)),
      y: Math.max(-80, Math.min(80, current.y + dy)),
    }));
  }

  return (
    <section className={styles.locationViewPanel}>
      <div className={styles.locationViewHeader}>
        <div>
          <span>Location View</span>
          <strong>
            {country.flag} {country.name} · {country.landmark}
          </strong>
        </div>

        <div className={styles.locationViewBadge}>{country.region}</div>
      </div>

      <div
        className={styles.locationStage}
        onPointerDown={(event) => {
          dragRef.current = {
            x: event.clientX,
            y: event.clientY,
            panX: pan.x,
            panY: pan.y,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragRef.current) return;

          const dx = event.clientX - dragRef.current.x;
          const dy = event.clientY - dragRef.current.y;

          setPan({
            x: Math.max(-180, Math.min(180, dragRef.current.panX + dx * 0.62)),
            y: Math.max(-80, Math.min(80, dragRef.current.panY + dy * 0.38)),
          });
        }}
        onPointerUp={(event) => {
          dragRef.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${country.name} ${country.landmark}`}
            className={styles.locationImage}
            style={{
              transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
            }}
            draggable={false}
          />
        ) : (
          <div
            className={styles.locationFallback}
            style={{ background: country.color }}
          >
            <span>{country.flag}</span>
            <strong>{country.name}</strong>
          </div>
        )}

        <div className={styles.locationShade} />

        <div className={styles.locationHint}>
          드래그해서 둘러보기 · 국가를 선택하면 현장 이미지가 바뀝니다
        </div>

        <div className={styles.locationControls}>
          <button type="button" onClick={() => movePan(-38, 0)}>←</button>
          <button type="button" onClick={() => movePan(38, 0)}>→</button>
          <button type="button" onClick={() => movePan(0, -28)}>↑</button>
          <button type="button" onClick={() => movePan(0, 28)}>↓</button>
          <button type="button" onClick={() => setZoom((value) => Math.min(1.45, value + 0.08))}>+</button>
          <button type="button" onClick={() => setZoom((value) => Math.max(1.02, value - 0.08))}>-</button>
        </div>
      </div>
    </section>
  );
}

export default function AtlasTycoonClient() {
  const state = useAtlasTycoonStore((store) => store);

  const selectedCountry = getCountryById(state.selectedCountryId);
  const selectedOwned = state.ownedCountries.find((country) => country.id === state.selectedCountryId);

  const research = state.research ?? {
    logistics: 0,
    banking: 0,
    market: 0,
    automation: 0,
  };

  const unlockedRegions = state.unlockedRegions ?? ["east-asia"];
  const packOpensByTier = state.packOpensByTier ?? {
    standard: 0,
    premium: 0,
    elite: 0,
  };

  const missionData = state.dailyMissions ?? {
    claimIncome: { progress: 0, target: 1, claimed: false },
    openPack: { progress: 0, target: 1, claimed: false },
    upgradeCountry: { progress: 0, target: 1, claimed: false },
  };

  const totalIncome = useMemo(() => {
    return state.ownedCountries.reduce((total, country) => {
      const card = getCountryById(country.id);
      return total + Math.round((card.baseIncome * country.level + country.cards * 2) * (1 + research.logistics * 0.08));
    }, 0);
  }, [state.ownedCountries, research.logistics]);

  const boostActive = state.boostUntil > Date.now();
  const currentIncome = boostActive ? totalIncome * 2 : totalIncome;
  const upgradeCost = selectedOwned ? getUpgradeCost(selectedOwned.level, selectedCountry.rarity) : 0;
  const premiumPackCost = getPackCost("premium", packOpensByTier.premium);
  const elitePackCost = getPackCost("elite", packOpensByTier.elite);
  const xpPercent = Math.min(100, (state.xp / (state.level * 100)) * 100);

  const missionCopy: Record<DailyMissionKey, { title: string; reward: string }> = {
    claimIncome: {
      title: "수익 1회 수령",
      reward: "350 coins / 4 gems",
    },
    openPack: {
      title: "카드팩 1회 열기",
      reward: "500 coins / 8 gems",
    },
    upgradeCountry: {
      title: "랜드마크 1회 업그레이드",
      reward: "650 coins / 6 gems",
    },
  };

  const missionEntries = Object.entries(missionData) as [
    DailyMissionKey,
    { progress: number; target: number; claimed: boolean }
  ][];

  const roadmapClaims = state.roadmapClaims ?? {
    unlock_three: false,
    unlock_regions: false,
    reach_income: false,
    research_total: false,
    legendary_country: false,
  };

  const researchTotal = Object.values(research).reduce((total, level) => total + level, 0);
  const legendaryUnlocked = state.ownedCountries.some((country) => getCountryById(country.id).rarity === "Legendary");
  const worldCompletion = Math.round((state.ownedCountries.length / countryCards.length) * 100);

  const roadmapItems = [
    {
      key: "unlock_three" as const,
      title: "국가 3개 해금",
      goal: `${state.ownedCountries.length}/3 countries`,
      done: state.ownedCountries.length >= 3,
      reward: "2,500 coins / 20 gems",
    },
    {
      key: "unlock_regions" as const,
      title: "지역 3개 해금",
      goal: `${unlockedRegions.length}/3 regions`,
      done: unlockedRegions.length >= 3,
      reward: "5,000 coins / 35 gems",
    },
    {
      key: "reach_income" as const,
      title: "초당 수익 500 달성",
      goal: `${formatNumber(currentIncome)}/500 income`,
      done: currentIncome >= 500,
      reward: "6,500 coins / 40 gems",
    },
    {
      key: "research_total" as const,
      title: "연구 총합 Lv.8",
      goal: `${researchTotal}/8 research levels`,
      done: researchTotal >= 8,
      reward: "9,000 coins / 60 gems",
    },
    {
      key: "legendary_country" as const,
      title: "Legendary 국가 해금",
      goal: legendaryUnlocked ? "Unlocked" : "Locked",
      done: legendaryUnlocked,
      reward: "12,000 coins / 80 gems",
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      useAtlasTycoonStore.getState().tickIncome();
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <a className={styles.brand} href="/">
            Datlora
          </a>

          <nav className={styles.navLinks} aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/world-voyage">World Voyage</a>
            <a href="/atlas-tycoon">Atlas Tycoon</a>
            <a href="/risk-lab">Risk Lab</a>
            <a href="/challenge">Challenge</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.topBar}>
          <div>
            <p className={styles.label}>Datlora Atlas Tycoon</p>
            <h1 className={styles.title}>국가를 수집하고 랜드마크를 성장시키세요.</h1>
          </div>

          <div className={styles.compactStats}>
            <div>
              <span>Coins</span>
              <strong>{formatNumber(state.coins)}</strong>
            </div>
            <div>
              <span>Gems</span>
              <strong>{formatNumber(state.gems)}</strong>
            </div>
            <div>
              <span>Income</span>
              <strong>{formatNumber(currentIncome)} / sec</strong>
            </div>
            <div>
              <span>World</span>
              <strong>{worldCompletion}%</strong>
            </div>
          </div>
        </section>

        <section className={styles.gameLayout}>
          <div className={styles.stageColumn}>
            <LandmarkImmersiveView country={selectedCountry} />

            <section className={styles.countryDock}>
              <div className={styles.countryDockHeader}>
                <strong>Country Map</strong>
                <span>국가를 선택하면 현장 화면과 업그레이드 대상이 바뀝니다</span>
              </div>

              <div className={styles.countryDockGrid}>
                {countryCards.map((country) => {
                  const owned = state.ownedCountries.find((item) => item.id === country.id);

                  return (
                    <button
                      key={country.id}
                      type="button"
                      className={`${styles.countryDockCard} ${state.selectedCountryId === country.id ? styles.countryDockActive : ""}`}
                      onClick={() => state.selectCountry(country.id)}
                    >
                      <span>{country.flag}</span>
                      <strong>{country.name}</strong>
                      <small>{owned ? `Lv.${owned.level}` : "Locked"}</small>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className={styles.actionDeck}>
            <section className={styles.deckCard}>
              <h2>Selected Nation</h2>
              <p className={styles.deckDescription}>
                {selectedCountry.flag} {selectedCountry.name} · {selectedCountry.landmark}
              </p>

              <div className={styles.selectedInfoGrid}>
                <div>
                  <span>Rarity</span>
                  <strong>{selectedCountry.rarity}</strong>
                </div>
                <div>
                  <span>Income</span>
                  <strong>{selectedCountry.baseIncome} / sec</strong>
                </div>
                <div>
                  <span>Cards</span>
                  <strong>{selectedOwned?.cards ?? 0}</strong>
                </div>
                <div>
                  <span>Level</span>
                  <strong>{selectedOwned?.level ?? "Locked"}</strong>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={() => state.upgradeCountry(selectedCountry.id)}
              >
                Landmark Upgrade
                <small>{formatNumber(upgradeCost)} coins</small>
              </button>
            </section>

            <section className={styles.deckCard}>
              <h2>Command Center</h2>

              <div className={styles.actionGrid}>
                <button type="button" className={`${styles.button} ${styles.primaryButton}`} onClick={state.claimIncome}>
                  수익 받기
                  <small>{formatNumber(state.incomeBank)} coins</small>
                </button>

                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.openPremiumPack}>
                  Premium Pack
                  <small>{formatNumber(premiumPackCost)} coins</small>
                </button>

                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.openElitePack}>
                  Elite Pack
                  <small>{formatNumber(elitePackCost)} coins</small>
                </button>

                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.activateBoost}>
                  2x Boost
                  <small>10 gems</small>
                </button>
              </div>

              <div className={styles.messageBar}>{state.message}</div>
            </section>

            <section className={styles.deckCard}>
              <h2>Atlas Roadmap</h2>
              <p className={styles.deckDescription}>
                코인을 쓰는 목적은 국가 해금, 지역 확장, 연구 성장, Legendary 국가 수집입니다.
              </p>

              <div className={styles.roadmapGrid}>
                {roadmapItems.map((item) => {
                  const claimed = roadmapClaims[item.key];

                  return (
                    <div
                      key={item.key}
                      className={`${styles.roadmapItem} ${item.done ? styles.roadmapItemDone : ""}`}
                    >
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.goal} · {item.reward}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => state.claimRoadmapReward(item.key)}
                      >
                        {claimed ? "Done" : item.done ? "Claim" : "Goal"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={styles.deckCard}>
              <h2>Daily Missions</h2>
              <p className={styles.deckDescription}>Streak {state.streak}</p>

              <div className={styles.compactList}>
                {missionEntries.map(([key, mission]) => {
                  const completed = mission.progress >= mission.target;
                  const claimed = mission.claimed;

                  return (
                    <div key={key} className={`${styles.compactRow} ${completed ? styles.compactRowActive : ""}`}>
                      <div>
                        <strong>{missionCopy[key].title}</strong>
                        <span>{mission.progress}/{mission.target} · {missionCopy[key].reward}</span>
                      </div>
                      <button type="button" onClick={() => state.claimMissionReward(key)}>
                        {claimed ? "Done" : completed ? "Claim" : "..."}
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={state.claimDailyReward}
              >
                일일 보상
                <small>Streak {state.streak}</small>
              </button>
            </section>

            <section className={styles.deckCard}>
              <h2>Progress</h2>
              <p className={styles.deckDescription}>XP {state.xp}/{state.level * 100}</p>

              <div className={styles.levelTrack}>
                <div className={styles.levelBar} style={{ width: `${xpPercent}%` }} />
              </div>
            </section>
          </aside>
        </section>

        <section className={styles.systemGrid}>
          <section className={styles.systemCard}>
            <h2>Expansion</h2>
            <p>지역을 해금하면 해당 지역 국가들이 카드팩에서 등장합니다.</p>

            <div className={styles.compactList}>
              {regions.map((region) => {
                const unlocked = unlockedRegions.includes(region.id);

                return (
                  <div key={region.id} className={`${styles.compactRow} ${unlocked ? styles.compactRowActive : ""}`}>
                    <div>
                      <strong>{region.name}</strong>
                      <span>{unlocked ? "Unlocked" : `Lv.${region.requiredLevel} · ${formatNumber(region.unlockCost)} coins`}</span>
                    </div>
                    <button type="button" onClick={() => state.unlockRegion(region.id)}>
                      {unlocked ? "Open" : "Unlock"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={styles.systemCard}>
            <h2>Research</h2>
            <p>코인을 장기 성장 시스템에 투자하세요.</p>

            <div className={styles.compactList}>
              {researchUpgrades.map((upgrade) => {
                const level = research[upgrade.key] ?? 0;
                const cost = getResearchCost(upgrade.key, level);

                return (
                  <div key={upgrade.key} className={styles.compactRow}>
                    <div>
                      <strong>{upgrade.title} Lv.{level}</strong>
                      <span>{upgrade.description}</span>
                    </div>
                    <button type="button" onClick={() => state.upgradeResearch(upgrade.key)}>
                      {formatNumber(cost)}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </section>
      </main>

      {state.lastPackResult ? (
        <div className={styles.packOverlay} role="dialog" aria-modal="true">
          <div className={`${styles.packModal} ${getRarityClass(state.lastPackResult.rarity)}`}>
            <p className={styles.packKicker}>
              {state.lastPackResult.isNew ? "New Country Unlocked" : "Duplicate Card Reward"}
            </p>

            <div className={styles.bigFlag}>{state.lastPackResult.flag}</div>

            <h2>{state.lastPackResult.name}</h2>

            <div className={styles.rarityPill}>{state.lastPackResult.rarity}</div>

            <div className={styles.packRewardGrid}>
              <div>
                <span>Gems</span>
                <strong>+{state.lastPackResult.gemReward}</strong>
              </div>
              <div>
                <span>Coins</span>
                <strong>+{state.lastPackResult.coinReward}</strong>
              </div>
            </div>

            <button
              type="button"
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={state.clearPackResult}
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
