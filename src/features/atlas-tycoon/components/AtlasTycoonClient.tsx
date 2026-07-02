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
import styles from "./AtlasTycoonClient.module.css";

function formatNumber(value: number) {
  return Math.floor(value).toLocaleString("ko-KR");
}

function WorldGlobe({ selectedColor }: { selectedColor: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.18;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, -0.16, 0]} scale={1.18}>
      <mesh castShadow>
        <sphereGeometry args={[1.78, 64, 64]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#082f49"
          emissiveIntensity={0.28}
          roughness={0.35}
          metalness={0.18}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.84, 64, 64]} />
        <meshBasicMaterial color={selectedColor} transparent opacity={0.12} />
      </mesh>

      {[
        [-0.9, 0.72, 1.25],
        [0.82, 0.42, 1.35],
        [-0.2, -0.54, 1.55],
        [1.15, -0.18, 0.95],
        [-1.2, -0.2, 1.0],
      ].map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.34, 0.16, 0.18]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#34d399" : "#facc15"} emissive="#052e16" emissiveIntensity={0.24} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitRings({ selectedColor }: { selectedColor: string }) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = clock.elapsedTime * 0.16;
    ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <group ref={ringRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.012, 16, 128]} />
        <meshBasicMaterial color={selectedColor} transparent opacity={0.55} />
      </mesh>

      <mesh rotation={[Math.PI / 2.25, 0, Math.PI / 5]}>
        <torusGeometry args={[2.7, 0.01, 16, 128]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.26} />
      </mesh>
    </group>
  );
}

function CountryNodes({ ownedIds }: { ownedIds: string[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      child.position.y += Math.sin(clock.elapsedTime * 1.6 + index) * 0.0009;
    });
  });

  return (
    <group ref={groupRef}>
      {countryCards.map((country, index) => {
        const angle = (index / countryCards.length) * Math.PI * 2;
        const unlocked = ownedIds.includes(country.id);
        const radius = 2.65;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 1.7) * 0.65;

        return (
          <mesh key={country.id} position={[x, y, z]} castShadow>
            <sphereGeometry args={[unlocked ? 0.11 : 0.065, 18, 18]} />
            <meshStandardMaterial
              color={unlocked ? country.color : "#475569"}
              emissive={unlocked ? country.color : "#111827"}
              emissiveIntensity={unlocked ? 0.75 : 0.1}
              roughness={0.25}
              metalness={0.22}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function AtlasScene({
  selectedColor,
  ownedIds,
}: {
  selectedColor: string;
  ownedIds: string[];
}) {
  return (
    <Canvas className={styles.canvas} shadows camera={{ position: [0, 2.35, 6.3], fov: 40 }}>
      <color attach="background" args={["#040b16"]} />
      <fog attach="fog" args={["#040b16", 8, 18]} />

      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 7, 5]} intensity={2.4} castShadow />
      <pointLight position={[-3, 3, 4]} intensity={1.6} color="#38bdf8" />
      <pointLight position={[3, 2, -3]} intensity={1.3} color="#34d399" />

      <WorldGlobe selectedColor={selectedColor} />
      <OrbitRings selectedColor={selectedColor} />
      <CountryNodes ownedIds={ownedIds} />

      <mesh position={[0, -2.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.1, 64]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.72} />
      </mesh>
    </Canvas>
  );
}

export default function AtlasTycoonClient() {
  const state = useAtlasTycoonStore((store) => store);

  const selectedCountry = getCountryById(state.selectedCountryId);
  const selectedOwned = state.ownedCountries.find((country) => country.id === state.selectedCountryId);
  const ownedIds = state.ownedCountries.map((country) => country.id);

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      useAtlasTycoonStore.getState().tickIncome();
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const xpPercent = Math.min(100, (state.xp / (state.level * 100)) * 100);

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
            <AtlasScene selectedColor={selectedCountry.color} ownedIds={ownedIds} />

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
    </div>
  );
}
