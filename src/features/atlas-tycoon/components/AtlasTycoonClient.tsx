"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  countryCards,
  getCountryById,
  getUpgradeCost,
} from "../data/atlasData";
import { useAtlasTycoonStore } from "../store/useAtlasTycoonStore";
import type { CountryCard, OwnedCountry } from "../types";
import styles from "./AtlasTycoonClient.module.css";

function formatNumber(value: number) {
  return Math.floor(value).toLocaleString("ko-KR");
}

function getRarityClass(rarity: string) {
  if (rarity === "Legendary") return styles.legendaryCard;
  if (rarity === "Epic") return styles.epicCard;
  if (rarity === "Rare") return styles.rareCard;
  return styles.commonCard;
}

function getNodePosition(index: number, total: number, radius = 2.75) {
  const angle = (index / total) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(angle * 1.8) * 0.58;

  return new THREE.Vector3(x, y, z);
}

function StarField() {
  const groupRef = useRef<THREE.Group>(null);

  const stars = useMemo(() => {
    return Array.from({ length: 34 }).map((_, index) => {
      const angle = (index / 34) * Math.PI * 2;
      const radius = 4.2 + (index % 5) * 0.42;
      return {
        x: Math.cos(angle) * radius,
        y: -1.7 + (index % 9) * 0.42,
        z: Math.sin(angle) * radius - 1.2,
        size: 0.018 + (index % 3) * 0.008,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.025;
  });

  return (
    <group ref={groupRef}>
      {stars.map((star, index) => (
        <mesh key={index} position={[star.x, star.y, star.z]}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial color={index % 4 === 0 ? "#67e8f9" : "#dbeafe"} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function WorldGlobe({ selectedColor }: { selectedColor: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.16;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]} scale={1.12}>
      <mesh castShadow>
        <sphereGeometry args={[1.72, 64, 64]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#082f49"
          emissiveIntensity={0.28}
          roughness={0.34}
          metalness={0.18}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.78, 64, 64]} />
        <meshBasicMaterial color={selectedColor} transparent opacity={0.12} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.92, 0.01, 16, 128]} />
        <meshBasicMaterial color="#dbeafe" transparent opacity={0.18} />
      </mesh>

      <mesh rotation={[Math.PI / 1.9, 0.4, 0.2]}>
        <torusGeometry args={[1.98, 0.01, 16, 128]} />
        <meshBasicMaterial color={selectedColor} transparent opacity={0.2} />
      </mesh>

      {[
        [-0.9, 0.72, 1.25],
        [0.82, 0.42, 1.35],
        [-0.2, -0.54, 1.55],
        [1.15, -0.18, 0.95],
        [-1.2, -0.2, 1.0],
        [0.2, 0.96, -1.2],
        [-0.7, -0.78, -1.1],
      ].map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.28, 0.12, 0.16]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#34d399" : "#facc15"}
            emissive="#052e16"
            emissiveIntensity={0.26}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitRings({ selectedColor }: { selectedColor: string }) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = clock.elapsedTime * 0.13;
    ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.06;
  });

  return (
    <group ref={ringRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.52, 0.012, 16, 128]} />
        <meshBasicMaterial color={selectedColor} transparent opacity={0.5} />
      </mesh>

      <mesh rotation={[Math.PI / 2.25, 0, Math.PI / 5]}>
        <torusGeometry args={[2.94, 0.01, 16, 128]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.22} />
      </mesh>

      <mesh rotation={[Math.PI / 2.8, 0, Math.PI / 3]}>
        <torusGeometry args={[3.28, 0.008, 16, 128]} />
        <meshBasicMaterial color="#a7f3d0" transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

function LandmarkNode({
  country,
  owned,
  index,
  total,
  selected,
}: {
  country: CountryCard;
  owned?: OwnedCountry;
  index: number;
  total: number;
  selected: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const position = useMemo(() => getNodePosition(index, total, selected ? 2.88 : 2.72), [index, total, selected]);
  const unlocked = Boolean(owned);
  const level = owned?.level ?? 0;
  const height = unlocked ? 0.34 + Math.min(level, 8) * 0.055 : 0.14;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position.y + Math.sin(clock.elapsedTime * 1.4 + index) * 0.035;
    groupRef.current.rotation.y = clock.elapsedTime * 0.45 + index;
  });

  if (!unlocked) {
    return (
      <group ref={groupRef} position={[position.x, position.y, position.z]}>
        <mesh castShadow>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#475569" emissive="#111827" emissiveIntensity={0.12} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <pointLight color={country.color} intensity={selected ? 1.5 : 0.7} distance={selected ? 3.6 : 2.2} />

      <mesh position={[0, -0.08, 0]} castShadow>
        <cylinderGeometry args={[selected ? 0.18 : 0.13, selected ? 0.2 : 0.15, 0.08, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.3} />
      </mesh>

      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[selected ? 0.18 : 0.14, height, selected ? 0.18 : 0.14]} />
        <meshStandardMaterial
          color={country.color}
          emissive={country.color}
          emissiveIntensity={selected ? 0.56 : 0.34}
          metalness={0.24}
          roughness={0.26}
        />
      </mesh>

      <mesh position={[0, height + 0.08, 0]} castShadow>
        <coneGeometry args={[selected ? 0.16 : 0.12, selected ? 0.28 : 0.2, 4]} />
        <meshStandardMaterial
          color={selected ? "#f8fafc" : country.color}
          emissive={country.color}
          emissiveIntensity={selected ? 0.42 : 0.22}
        />
      </mesh>

      {selected ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.34, 0.012, 16, 64]} />
          <meshBasicMaterial color={country.color} transparent opacity={0.75} />
        </mesh>
      ) : null}
    </group>
  );
}

function IncomePulse({ selectedColor }: { selectedColor: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const scale = 1 + Math.sin(clock.elapsedTime * 1.8) * 0.06;
    groupRef.current.scale.setScalar(scale);
    groupRef.current.rotation.y = clock.elapsedTime * 0.22;
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((item) => (
        <mesh key={item} rotation={[Math.PI / 2, 0, (Math.PI / 3) * item]}>
          <torusGeometry args={[3.55 + item * 0.18, 0.006, 12, 128]} />
          <meshBasicMaterial color={item === 0 ? selectedColor : "#67e8f9"} transparent opacity={0.14 - item * 0.025} />
        </mesh>
      ))}
    </group>
  );
}

function AtlasScene({
  selectedColor,
  ownedCountries,
  selectedCountryId,
}: {
  selectedColor: string;
  ownedCountries: OwnedCountry[];
  selectedCountryId: string;
}) {
  const ownedMap = useMemo(() => new Map(ownedCountries.map((country) => [country.id, country])), [ownedCountries]);

  return (
    <Canvas className={styles.canvas} shadows camera={{ position: [0, 2.35, 6.3], fov: 40 }}>
      <color attach="background" args={["#040b16"]} />
      <fog attach="fog" args={["#040b16", 8, 18]} />

      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 7, 5]} intensity={2.5} castShadow />
      <pointLight position={[-3, 3, 4]} intensity={1.7} color="#38bdf8" />
      <pointLight position={[3, 2, -3]} intensity={1.4} color="#34d399" />

      <StarField />
      <WorldGlobe selectedColor={selectedColor} />
      <OrbitRings selectedColor={selectedColor} />
      <IncomePulse selectedColor={selectedColor} />

      {countryCards.map((country, index) => (
        <LandmarkNode
          key={country.id}
          country={country}
          owned={ownedMap.get(country.id)}
          index={index}
          total={countryCards.length}
          selected={selectedCountryId === country.id}
        />
      ))}

      <mesh position={[0, -2.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.45, 64]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.76} />
      </mesh>
    </Canvas>
  );
}

export default function AtlasTycoonClient() {
  const state = useAtlasTycoonStore((store) => store);

  const selectedCountry = getCountryById(state.selectedCountryId);
  const selectedOwned = state.ownedCountries.find((country) => country.id === state.selectedCountryId);

  const totalIncome = useMemo(() => {
    return state.ownedCountries.reduce((total, country) => {
      const card = getCountryById(country.id);
      return total + card.baseIncome * country.level + country.cards * 2;
    }, 0);
  }, [state.ownedCountries]);

  const boostActive = state.boostUntil > Date.now();
  const currentIncome = boostActive ? totalIncome * 2 : totalIncome;
  const upgradeCost = selectedOwned ? getUpgradeCost(selectedOwned.level, selectedCountry.rarity) : 0;
  const packCost = 500 + state.packsOpened * 80;
  const xpPercent = Math.min(100, (state.xp / (state.level * 100)) * 100);

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
        <section className={styles.hero}>
          <div>
            <p className={styles.label}>Datlora Atlas Tycoon</p>
            <h1 className={styles.title}>국가를 해금하고 세계 지도를 성장시키세요.</h1>
            <p className={styles.subtitle}>
              국가 카드팩을 열고, 랜드마크를 업그레이드하고, 자동 생산량을 높여 더 큰 세계 지도를 완성하세요.
            </p>
          </div>

          <aside className={styles.statusCard}>
            <p>Global Income</p>
            <strong>{formatNumber(currentIncome)} / sec</strong>
            <p style={{ marginTop: 10 }}>{boostActive ? "2x Boost Active" : "Standard Production"}</p>
          </aside>
        </section>

        <section className={styles.resourceGrid}>
          <div className={styles.resourceCard}>
            <span>Coins</span>
            <strong>{formatNumber(state.coins)}</strong>
          </div>
          <div className={styles.resourceCard}>
            <span>Gems</span>
            <strong>{formatNumber(state.gems)}</strong>
          </div>
          <div className={styles.resourceCard}>
            <span>Banked</span>
            <strong>{formatNumber(state.incomeBank)}</strong>
          </div>
          <div className={styles.resourceCard}>
            <span>Level</span>
            <strong>{state.level}</strong>
          </div>
          <div className={styles.resourceCard}>
            <span>Countries</span>
            <strong>{state.ownedCountries.length}</strong>
          </div>
          <div className={styles.resourceCard}>
            <span>Packs</span>
            <strong>{state.packsOpened}</strong>
          </div>
        </section>

        <section className={styles.layout}>
          <div className={styles.worldPanel}>
            <AtlasScene
              selectedColor={selectedCountry.color}
              ownedCountries={state.ownedCountries}
              selectedCountryId={state.selectedCountryId}
            />

            <div className={styles.worldOverlay}>
              <div className={styles.chip}>
                <strong>{selectedCountry.flag} {selectedCountry.name}</strong>
                <br />
                {selectedCountry.landmark} · {selectedCountry.rarity}
              </div>

              <div className={`${styles.chip} ${styles.boostChip}`}>
                Income {formatNumber(currentIncome)} / sec
              </div>
            </div>

            <div className={styles.worldFooter}>
              <div className={styles.footerBox}>
                <span>Selected Country</span>
                <strong>{selectedCountry.name}</strong>
              </div>
              <div className={styles.footerBox}>
                <span>Landmark</span>
                <strong>{selectedCountry.landmark}</strong>
              </div>
              <div className={styles.footerBox}>
                <span>Bonus</span>
                <strong>{selectedCountry.bonus}</strong>
              </div>
            </div>
          </div>

          <aside className={styles.sideStack}>
            <section className={styles.panel}>
              <h2>Command Center</h2>
              <p className={styles.panelDescription}>수익을 수령하고 카드팩을 열어 국가를 해금하세요.</p>

              <div className={styles.buttonRow}>
                <button type="button" className={`${styles.button} ${styles.primaryButton}`} onClick={state.claimIncome}>
                  수익 받기
                </button>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.openPack}>
                  카드팩 열기 · {formatNumber(packCost)}
                </button>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.claimDailyReward}>
                  일일 보상
                </button>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.activateBoost}>
                  2x Boost · 10 gems
                </button>
              </div>

              <div className={styles.messageBar}>{state.message}</div>

              <div className={styles.packReveal}>
                <strong>Latest Reward</strong>
                <span>{state.lastReward}</span>
              </div>
            </section>

            <section className={styles.panel}>
              <h2>Captain Progress</h2>
              <p className={styles.panelDescription}>XP {state.xp}/{state.level * 100}</p>

              <div className={styles.levelTrack}>
                <div className={styles.levelBar} style={{ width: `${xpPercent}%` }} />
              </div>
            </section>

            <section className={styles.panel}>
              <h2>Selected Landmark</h2>
              <p className={styles.panelDescription}>
                {selectedCountry.flag} {selectedCountry.name} · {selectedCountry.landmark}
              </p>

              <div className={styles.buttonRow}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.primaryButton}`}
                  onClick={() => state.upgradeCountry(selectedCountry.id)}
                >
                  업그레이드 · {formatNumber(upgradeCost)} coins
                </button>
              </div>
            </section>

            <section className={styles.panel}>
              <h2>Country Collection</h2>
              <div className={styles.countryGrid}>
                {countryCards.map((country) => {
                  const owned = state.ownedCountries.find((item) => item.id === country.id);

                  return (
                    <button
                      key={country.id}
                      type="button"
                      className={`${styles.countryCard} ${state.selectedCountryId === country.id ? styles.countryCardActive : ""}`}
                      onClick={() => state.selectCountry(country.id)}
                    >
                      <div className={styles.countryHeader}>
                        <strong>{country.flag} {country.name}</strong>
                        <span>{owned ? `Lv.${owned.level}` : "Locked"}</span>
                      </div>

                      <div className={styles.countryMeta}>
                        <span className={styles.badge}>{country.rarity}</span>
                        <span className={styles.badge}>{country.baseIncome} / sec</span>
                        <span className={styles.badge}>Cards {owned?.cards ?? 0}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
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
