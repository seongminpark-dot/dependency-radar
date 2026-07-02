"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
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
import type { CountryCard, OwnedCountry } from "../types";
import styles from "./AtlasTycoonClient.module.css";

type DailyMissionKey = "claimIncome" | "openPack" | "upgradeCountry";

const countryCoordinates: Record<string, { lat: number; lon: number }> = {
  kor: { lat: 36.5, lon: 127.8 },
  jpn: { lat: 36.2, lon: 138.2 },
  sgp: { lat: 1.35, lon: 103.82 },
  usa: { lat: 39.8, lon: -98.6 },
  deu: { lat: 51.2, lon: 10.4 },
  are: { lat: 24.4, lon: 54.4 },
  bra: { lat: -14.2, lon: -51.9 },
  che: { lat: 46.8, lon: 8.2 },
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

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function StarField() {
  const groupRef = useRef<THREE.Group>(null);

  const stars = useMemo(() => {
    return Array.from({ length: 72 }).map((_, index) => {
      const angle = (index / 72) * Math.PI * 2;
      const radius = 5.2 + (index % 7) * 0.36;

      return {
        x: Math.cos(angle) * radius,
        y: -2.8 + (index % 13) * 0.46,
        z: Math.sin(angle) * radius - 0.6,
        size: 0.014 + (index % 3) * 0.006,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.018;
  });

  return (
    <group ref={groupRef}>
      {stars.map((star, index) => (
        <mesh key={index} position={[star.x, star.y, star.z]}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial color={index % 5 === 0 ? "#67e8f9" : "#dbeafe"} transparent opacity={0.74} />
        </mesh>
      ))}
    </group>
  );
}

function GlobeCameraFocus({ selectedCountryId }: { selectedCountryId: string }) {
  const { camera } = useThree();

  useFrame(() => {
    const coord = countryCoordinates[selectedCountryId] ?? countryCoordinates.kor;
    const targetPoint = latLonToVector3(coord.lat, coord.lon, 1);
    const targetCameraPosition = targetPoint.clone().normalize().multiplyScalar(6.1);
    targetCameraPosition.y += 1.05;

    camera.position.lerp(targetCameraPosition, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function GlobeCore({ selectedColor }: { selectedColor: string }) {
  const globeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!globeRef.current) return;
    globeRef.current.rotation.y += 0.0018;
    globeRef.current.position.y = Math.sin(clock.elapsedTime * 0.75) * 0.035;
  });

  return (
    <group ref={globeRef}>
      <mesh castShadow>
        <sphereGeometry args={[2.02, 96, 96]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#082f49"
          emissiveIntensity={0.24}
          roughness={0.34}
          metalness={0.22}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.055, 96, 96]} />
        <meshBasicMaterial color={selectedColor} transparent opacity={0.1} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.16, 0.01, 16, 160]} />
        <meshBasicMaterial color="#dbeafe" transparent opacity={0.18} />
      </mesh>

      <mesh rotation={[Math.PI / 1.9, 0.4, 0.2]}>
        <torusGeometry args={[2.22, 0.01, 16, 160]} />
        <meshBasicMaterial color={selectedColor} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function CountryMarker({
  country,
  owned,
  selected,
  onSelect,
}: {
  country: CountryCard;
  owned?: OwnedCountry;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coord = countryCoordinates[country.id] ?? countryCoordinates.kor;
  const position = useMemo(() => latLonToVector3(coord.lat, coord.lon, 2.16), [coord.lat, coord.lon]);
  const unlocked = Boolean(owned);
  const level = owned?.level ?? 0;
  const markerSize = selected ? 0.13 : unlocked ? 0.095 : 0.055;
  const height = selected ? 0.42 : unlocked ? 0.26 + Math.min(level, 10) * 0.015 : 0.08;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const normal = position.clone().normalize();
    const pulse = Math.sin(clock.elapsedTime * 2.4) * 0.04;
    groupRef.current.position.copy(position.clone().add(normal.multiplyScalar(selected ? 0.16 + pulse : 0.06)));
  });

  return (
    <group
      ref={groupRef}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(country.id);
      }}
    >
      {selected || unlocked ? (
        <pointLight
          color={country.color}
          intensity={selected ? 2.2 : 0.9}
          distance={selected ? 3.5 : 2.1}
        />
      ) : null}

      <mesh castShadow>
        <sphereGeometry args={[markerSize, 24, 24]} />
        <meshStandardMaterial
          color={unlocked ? country.color : "#64748b"}
          emissive={unlocked ? country.color : "#111827"}
          emissiveIntensity={selected ? 0.95 : unlocked ? 0.48 : 0.12}
          roughness={0.24}
          metalness={0.28}
        />
      </mesh>

      {unlocked ? (
        <mesh position={[0, height / 2 + 0.06, 0]} castShadow>
          <boxGeometry args={[markerSize * 0.85, height, markerSize * 0.85]} />
          <meshStandardMaterial
            color={country.color}
            emissive={country.color}
            emissiveIntensity={selected ? 0.55 : 0.3}
            roughness={0.25}
            metalness={0.28}
          />
        </mesh>
      ) : null}

      {selected ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24, 0.01, 16, 48]} />
          <meshBasicMaterial color={country.color} transparent opacity={0.9} />
        </mesh>
      ) : null}
    </group>
  );
}

function RegionBands({ selectedColor }: { selectedColor: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.68, 0.008, 16, 160]} />
        <meshBasicMaterial color={selectedColor} transparent opacity={0.44} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0, Math.PI / 6]}>
        <torusGeometry args={[2.95, 0.008, 16, 160]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[Math.PI / 2.75, 0, Math.PI / 3]}>
        <torusGeometry args={[3.25, 0.006, 16, 160]} />
        <meshBasicMaterial color="#a7f3d0" transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

function IncomePulse({ selectedColor }: { selectedColor: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const scale = 1 + Math.sin(clock.elapsedTime * 1.7) * 0.04;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((item) => (
        <mesh key={item} rotation={[Math.PI / 2, 0, (Math.PI / 3) * item]}>
          <torusGeometry args={[3.48 + item * 0.18, 0.005, 12, 160]} />
          <meshBasicMaterial color={item === 0 ? selectedColor : "#67e8f9"} transparent opacity={0.11 - item * 0.02} />
        </mesh>
      ))}
    </group>
  );
}

function AtlasScene({
  selectedColor,
  ownedCountries,
  selectedCountryId,
  onSelectCountry,
}: {
  selectedColor: string;
  ownedCountries: OwnedCountry[];
  selectedCountryId: string;
  onSelectCountry: (id: string) => void;
}) {
  const ownedMap = useMemo(() => new Map(ownedCountries.map((country) => [country.id, country])), [ownedCountries]);

  return (
    <Canvas className={styles.canvas} shadows camera={{ position: [0, 2.6, 6.2], fov: 42 }}>
      <color attach="background" args={["#030814"]} />
      <fog attach="fog" args={["#030814", 8, 18]} />

      <ambientLight intensity={0.68} />
      <directionalLight position={[4, 7, 5]} intensity={2.55} castShadow />
      <pointLight position={[-3.6, 3.2, 4]} intensity={1.8} color="#38bdf8" />
      <pointLight position={[3.4, 2.4, -3.2]} intensity={1.4} color="#34d399" />

      <GlobeCameraFocus selectedCountryId={selectedCountryId} />
      <StarField />
      <GlobeCore selectedColor={selectedColor} />
      <RegionBands selectedColor={selectedColor} />
      <IncomePulse selectedColor={selectedColor} />

      {countryCards.map((country) => (
        <CountryMarker
          key={country.id}
          country={country}
          owned={ownedMap.get(country.id)}
          selected={selectedCountryId === country.id}
          onSelect={onSelectCountry}
        />
      ))}

      <mesh position={[0, -2.42, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.55, 64]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.7} />
      </mesh>
    </Canvas>
  );
}

export default function AtlasTycoonClient() {
  const state = useAtlasTycoonStore((store) => store);

  const selectedCountry = getCountryById(state.selectedCountryId);
  const selectedOwned = state.ownedCountries.find((country) => country.id === state.selectedCountryId);

  const totalIncome = useMemo(() => {
    const research = state.research ?? { logistics: 0, banking: 0, market: 0, automation: 0 };

    return state.ownedCountries.reduce((total, country) => {
      const card = getCountryById(country.id);
      return total + Math.round((card.baseIncome * country.level + country.cards * 2) * (1 + research.logistics * 0.08));
    }, 0);
  }, [state.ownedCountries, state.research]);

  const boostActive = state.boostUntil > Date.now();
  const currentIncome = boostActive ? totalIncome * 2 : totalIncome;
  const upgradeCost = selectedOwned ? getUpgradeCost(selectedOwned.level, selectedCountry.rarity) : 0;
  const packOpensByTier = state.packOpensByTier ?? { standard: 0, premium: 0, elite: 0 };
  const premiumPackCost = getPackCost("premium", packOpensByTier.premium);
  const elitePackCost = getPackCost("elite", packOpensByTier.elite);
  const xpPercent = Math.min(100, (state.xp / (state.level * 100)) * 100);
  const unlockedRegions = state.unlockedRegions ?? ["east-asia"];
  const research = state.research ?? { logistics: 0, banking: 0, market: 0, automation: 0 };

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

  const missionEntries = Object.entries(state.dailyMissions) as [
    DailyMissionKey,
    { progress: number; target: number; claimed: boolean }
  ][];

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
            <h1 className={styles.title}>세계 지도를 키우고 국가를 해금하세요.</h1>
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
              <span>Level</span>
              <strong>{state.level}</strong>
            </div>
          </div>
        </section>

        <section className={styles.gameLayout}>
          <div className={styles.globePanel}>
            <AtlasScene
              selectedColor={selectedCountry.color}
              ownedCountries={state.ownedCountries}
              selectedCountryId={state.selectedCountryId}
              onSelectCountry={state.selectCountry}
            />

            <div className={styles.globeOverlayTop}>
              <div className={styles.globeChip}>
                <strong>{selectedCountry.flag} {selectedCountry.name}</strong>
                <span>{selectedCountry.region} · {selectedCountry.rarity}</span>
              </div>

              <div className={styles.globeChip}>
                <strong>{selectedCountry.landmark}</strong>
                <span>{selectedOwned ? `Lv.${selectedOwned.level}` : "Locked"}</span>
              </div>
            </div>

            <div className={styles.globeOverlayBottom}>
              <div>
                <span>Goal</span>
                <strong>Unlock regions → upgrade landmarks → increase global income</strong>
              </div>
              <div>
                <span>Selected Bonus</span>
                <strong>{selectedCountry.bonus}</strong>
              </div>
            </div>
          </div>

          <aside className={styles.controlDeck}>
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
              <h2>Selected Nation</h2>
              <p className={styles.deckDescription}>
                {selectedCountry.flag} {selectedCountry.name} · {selectedCountry.landmark}
              </p>

              <div className={styles.actionGrid}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.primaryButton}`}
                  onClick={() => state.upgradeCountry(selectedCountry.id)}
                >
                  Landmark Upgrade
                  <small>{formatNumber(upgradeCost)} coins</small>
                </button>
              </div>
            </section>

            <section className={styles.deckCard}>
              <h2>Expansion</h2>

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

            <section className={styles.deckCard}>
              <h2>Research</h2>

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

              <div className={styles.actionGrid}>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.claimDailyReward}>
                  일일 보상
                  <small>Streak {state.streak}</small>
                </button>
              </div>
            </section>
          </aside>
        </section>

        <section className={styles.collectionDock}>
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
