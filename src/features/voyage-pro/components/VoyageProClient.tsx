"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { contracts, getUpgradePrice, modeProfiles, ports, upgrades } from "../data/gameData";
import { useVoyageProStore } from "../store/useVoyageProStore";
import type { VoyageMode } from "../types";
import styles from "./VoyageProClient.module.css";

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    meshRef.current.position.z = Math.sin(clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]} receiveShadow>
      <planeGeometry args={[28, 42, 48, 48]} />
      <meshStandardMaterial
        color="#0ea5e9"
        emissive="#082f49"
        emissiveIntensity={0.22}
        roughness={0.42}
        metalness={0.18}
      />
    </mesh>
  );
}

function ShipModel({ mode }: { mode: VoyageMode }) {
  const groupRef = useRef<THREE.Group>(null);

  const sailColor = mode === "normal" ? "#f8fafc" : mode === "storm" ? "#fde68a" : "#fecaca";
  const glowColor = mode === "normal" ? "#67e8f9" : mode === "storm" ? "#facc15" : "#fb7185";

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    groupRef.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.08;
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.4) * 0.045;
  });

  return (
    <group ref={groupRef} position={[0, 0.05, 0]} rotation={[0, Math.PI, 0]}>
      <pointLight position={[0, 0.7, -0.6]} intensity={1.5} color={glowColor} distance={5} />

      <mesh castShadow position={[0, -0.12, 0]}>
        <boxGeometry args={[1.35, 0.34, 2.38]} />
        <meshStandardMaterial color="#0f172a" roughness={0.36} metalness={0.42} />
      </mesh>

      <mesh castShadow position={[0, 0.12, -0.08]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.08, 0.2, 1.82]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.32} metalness={0.3} />
      </mesh>

      <mesh castShadow position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.7, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.25} />
      </mesh>

      <mesh castShadow position={[0.34, 0.72, 0.02]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.48, 1.18, 3]} />
        <meshStandardMaterial color={sailColor} roughness={0.28} metalness={0.04} />
      </mesh>

      <mesh castShadow position={[-0.34, 0.58, 0.05]} rotation={[0, 0, 0.28]}>
        <coneGeometry args={[0.38, 0.92, 3]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.26} metalness={0.05} />
      </mesh>

      <mesh position={[0, -0.38, -1.25]}>
        <coneGeometry args={[0.28, 0.74, 16]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.8} transparent opacity={0.78} />
      </mesh>
    </group>
  );
}

function CargoOrb({ index, mode }: { index: number; mode: VoyageMode }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const config = useMemo(() => {
    const colors = mode === "expert"
      ? ["#fb7185", "#facc15", "#67e8f9"]
      : mode === "storm"
        ? ["#facc15", "#60a5fa", "#fb923c"]
        : ["#34d399", "#67e8f9", "#a78bfa"];

    return {
      x: (index - 1) * 1.75,
      z: -3.6 - index * 1.15,
      color: colors[index % colors.length],
    };
  }, [index, mode]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y = clock.elapsedTime * 1.4 + index;
    meshRef.current.position.y = 0.22 + Math.sin(clock.elapsedTime * 1.6 + index) * 0.13;
  });

  return (
    <mesh ref={meshRef} position={[config.x, 0.2, config.z]} castShadow>
      <dodecahedronGeometry args={[0.32, 0]} />
      <meshStandardMaterial color={config.color} emissive={config.color} emissiveIntensity={0.35} roughness={0.22} metalness={0.28} />
    </mesh>
  );
}

function PortSkyline() {
  return (
    <group position={[0, -0.15, -8.2]}>
      <mesh position={[-2.6, 0.55, 0]} castShadow>
        <boxGeometry args={[0.45, 1.2, 0.45]} />
        <meshStandardMaterial color="#0f172a" emissive="#1d4ed8" emissiveIntensity={0.12} />
      </mesh>

      <mesh position={[-1.65, 0.78, 0]} castShadow>
        <boxGeometry args={[0.42, 1.65, 0.42]} />
        <meshStandardMaterial color="#111827" emissive="#0ea5e9" emissiveIntensity={0.16} />
      </mesh>

      <mesh position={[1.1, 0.55, 0]} castShadow>
        <boxGeometry args={[0.62, 1.1, 0.5]} />
        <meshStandardMaterial color="#0f172a" emissive="#22c55e" emissiveIntensity={0.11} />
      </mesh>

      <mesh position={[2.1, 0.28, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[1.4, 0.08, 0.08]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      <mesh position={[2.72, 0.04, 0]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

function VoyageScene({ mode }: { mode: VoyageMode }) {
  const fogColor = mode === "normal" ? "#061427" : mode === "storm" ? "#111827" : "#1f1020";

  return (
    <Canvas className={styles.canvas} shadows camera={{ position: [0, 3.1, 6.6], fov: 48 }}>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 7, 21]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} castShadow />
      <pointLight position={[-3, 2.5, 2]} intensity={1.4} color="#38bdf8" />
      <pointLight position={[3, 2, -3]} intensity={1.2} color="#34d399" />

      <Ocean />
      <PortSkyline />
      <ShipModel mode={mode} />
      <CargoOrb index={0} mode={mode} />
      <CargoOrb index={1} mode={mode} />
      <CargoOrb index={2} mode={mode} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.69, -5.2]}>
        <ringGeometry args={[1.8, 1.86, 64]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.45} />
      </mesh>
    </Canvas>
  );
}

export default function VoyageProClient() {
  const state = useVoyageProStore((store) => store);
  const selectedContract = contracts.find((contract) => contract.id === state.selectedContractId) ?? contracts[0];
  const activePort = ports[state.visitedPorts % ports.length];

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
            <a href="/risk-lab">Risk Lab</a>
            <a href="/challenge">Challenge</a>
            <a href="/topics">Topics</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.heroLabel}>Voyage Pro Prototype</p>
            <h1 className={styles.title}>Datlora를 게임처럼 다시 설계합니다.</h1>
            <p className={styles.subtitle}>
              이 버전은 단순 미니게임이 아니라, 3D 항해 장면, 계약, 코인, 젬, 상점, 업그레이드, 재접속 보상으로
              확장하기 위한 고급 게임 구조의 첫 번째 빌드입니다.
            </p>
          </div>

          <aside className={styles.premiumCard}>
            <h2>Live Service Loop</h2>
            <p>
              계약 선택 → 출항 → 보상 획득 → 항구 도착 → 업그레이드 → 더 어려운 항로 도전 구조로 확장합니다.
            </p>
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
            <span>Fuel</span>
            <strong>{state.fuel}%</strong>
          </div>
          <div className={styles.resourceCard}>
            <span>Food</span>
            <strong>{state.food}%</strong>
          </div>
          <div className={styles.resourceCard}>
            <span>Hull</span>
            <strong>{state.hull}%</strong>
          </div>
          <div className={styles.resourceCard}>
            <span>Distance</span>
            <strong>{formatNumber(state.distance)} km</strong>
          </div>
        </section>

        <section className={styles.layout}>
          <div className={styles.scenePanel}>
            <VoyageScene mode={state.mode} />

            <div className={styles.sceneOverlay}>
              <div className={styles.statusChip}>
                <strong>{activePort.region}</strong>
                <br />
                다음 항구: {activePort.name} · 예상 거리 {activePort.distanceLabel}
              </div>

              <div className={styles.rankChip}>
                Reputation Lv.{state.reputation} · Ports {state.visitedPorts}
              </div>
            </div>
          </div>

          <aside className={styles.sideStack}>
            <section className={styles.panel}>
              <h2>항해 모드</h2>
              <p className={styles.panelDescription}>보상과 위험도를 조절합니다. 실제 과금은 없지만, 프리미엄 게임처럼 성장 루프를 설계합니다.</p>

              <div className={styles.modeGrid}>
                {Object.entries(modeProfiles).map(([modeKey, profile]) => (
                  <button
                    key={modeKey}
                    type="button"
                    className={`${styles.selectCard} ${state.mode === modeKey ? styles.selectCardActive : ""}`}
                    onClick={() => state.setMode(modeKey as VoyageMode)}
                  >
                    <strong>{profile.label}</strong>
                    <span>{profile.description}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.panel}>
              <h2>계약 선택</h2>
              <p className={styles.panelDescription}>보상이 높을수록 위험도도 높습니다. 이 구조가 나중에 재접속/업그레이드 동기가 됩니다.</p>

              <div className={styles.modeGrid}>
                {contracts.map((contract) => (
                  <button
                    key={contract.id}
                    type="button"
                    className={`${styles.selectCard} ${state.selectedContractId === contract.id ? styles.selectCardActive : ""}`}
                    onClick={() => state.selectContract(contract.id)}
                  >
                    <strong>
                      {contract.icon} {contract.title}
                    </strong>
                    <span>{contract.description}</span>
                    <div className={styles.contractMeta}>
                      <span className={styles.badge}>{contract.route}</span>
                      <span className={styles.badge}>{contract.rewardCoins} coins</span>
                      <span className={styles.badge}>{contract.rewardGems} gems</span>
                      <span className={styles.badge}>Risk {contract.risk}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.panel}>
              <h2>Command Deck</h2>
              <p className={styles.panelDescription}>
                현재 계약: {selectedContract.icon} {selectedContract.title}
              </p>

              <div className={styles.buttonRow}>
                <button type="button" className={`${styles.button} ${styles.primaryButton}`} onClick={state.startVoyage}>
                  출항
                </button>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.simulateArrival}>
                  항구 도착 시뮬레이션
                </button>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.openShop}>
                  상점
                </button>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.claimDailyReward}>
                  일일 보상
                </button>
              </div>

              <div className={styles.messageBar}>{state.message}</div>
            </section>

            <section className={styles.panel}>
              <h2>Ship Upgrade Shop</h2>
              <p className={styles.panelDescription}>실제 결제는 없지만, 결제형 게임처럼 성장 욕구가 보이도록 코인/젬/업그레이드 구조를 먼저 만듭니다.</p>

              <div className={styles.shopGrid}>
                {upgrades.map((upgrade) => {
                  const level = state.upgrades[upgrade.key];
                  const price = getUpgradePrice(upgrade.key, level);

                  return (
                    <div key={upgrade.key} className={styles.upgradeCard}>
                      <div className={styles.upgradeCardHeader}>
                        <strong>{upgrade.title}</strong>
                        <span>Lv.{level}</span>
                      </div>
                      <p>{upgrade.description}</p>
                      <div className={styles.buttonRow}>
                        <button
                          type="button"
                          className={`${styles.button} ${styles.secondaryButton}`}
                          onClick={() => state.buyUpgrade(upgrade.key, price)}
                        >
                          Upgrade · {formatNumber(price)} coins
                        </button>
                      </div>
                    </div>
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
