"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { contracts, getUpgradePrice, modeProfiles, ports, shipSkins, upgrades } from "../data/gameData";
import { useVoyageProStore } from "../store/useVoyageProStore";
import type { UpgradeKey, VoyageMode } from "../types";
import styles from "./VoyageProClient.module.css";

type ItemType =
  | "coin"
  | "gem"
  | "fuel"
  | "food"
  | "repair"
  | "boost"
  | "reef"
  | "storm"
  | "pirate"
  | "customs"
  | "drain";

type SceneObject = {
  id: number;
  lane: number;
  z: number;
  type: ItemType;
};

type ControlRef = {
  move: number;
  boost: boolean;
  currentLane: number;
};

const itemMeta: Record<
  ItemType,
  {
    label: string;
    color: string;
    emissive: string;
    kind: "good" | "bad" | "special";
  }
> = {
  coin: { label: "Coins", color: "#22c55e", emissive: "#166534", kind: "good" },
  gem: { label: "Gems", color: "#a78bfa", emissive: "#6d28d9", kind: "good" },
  fuel: { label: "Fuel", color: "#3b82f6", emissive: "#1d4ed8", kind: "good" },
  food: { label: "Food", color: "#facc15", emissive: "#854d0e", kind: "good" },
  repair: { label: "Repair", color: "#67e8f9", emissive: "#0e7490", kind: "good" },
  boost: { label: "Boost", color: "#34d399", emissive: "#047857", kind: "special" },
  reef: { label: "Reef", color: "#fb7185", emissive: "#9f1239", kind: "bad" },
  storm: { label: "Storm", color: "#818cf8", emissive: "#3730a3", kind: "bad" },
  pirate: { label: "Pirate", color: "#ef4444", emissive: "#7f1d1d", kind: "bad" },
  customs: { label: "Customs", color: "#fb923c", emissive: "#9a3412", kind: "bad" },
  drain: { label: "Supply Loss", color: "#f97316", emissive: "#7c2d12", kind: "bad" },
};

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randomLane() {
  return [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
}

function chooseItemType(mode: VoyageMode, risk: number, navigationLevel: number): ItemType {
  const modeRisk = mode === "normal" ? 0 : mode === "storm" ? 0.1 : 0.18;
  const dangerChance = clamp(0.3 + risk / 180 + modeRisk - navigationLevel * 0.025, 0.22, 0.68);
  const roll = Math.random();

  if (roll > dangerChance) {
    const goodItems: ItemType[] = ["coin", "gem", "fuel", "food", "repair", "boost"];
    return goodItems[Math.floor(Math.random() * goodItems.length)];
  }

  const badItems: ItemType[] = ["reef", "storm", "pirate", "customs", "drain"];
  return badItems[Math.floor(Math.random() * badItems.length)];
}

function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.position.z = Math.sin(clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, -3]} receiveShadow>
      <planeGeometry args={[34, 54, 64, 64]} />
      <meshStandardMaterial
        color="#0284c7"
        emissive="#082f49"
        emissiveIntensity={0.25}
        roughness={0.38}
        metalness={0.22}
      />
    </mesh>
  );
}

function RouteLines() {
  return (
    <group position={[0, -0.67, -3]}>
      {[-2, -1, 0, 1, 2].map((lane) => (
        <mesh key={lane} position={[lane * 1.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 42]} />
          <meshBasicMaterial
            color={lane === 0 ? "#bae6fd" : "#60a5fa"}
            transparent
            opacity={lane === 0 ? 0.38 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function PortSkyline({ mode }: { mode: VoyageMode }) {
  const color = mode === "normal" ? "#38bdf8" : mode === "storm" ? "#facc15" : "#fb7185";

  return (
    <group position={[0, -0.18, -12]}>
      {[-3.2, -2.2, -1.3, 1.2, 2.1, 3.1].map((x, index) => (
        <mesh key={x} position={[x, 0.35 + (index % 3) * 0.22, 0]} castShadow>
          <boxGeometry args={[0.46, 1 + (index % 3) * 0.44, 0.5]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive={color}
            emissiveIntensity={0.12}
            roughness={0.4}
            metalness={0.25}
          />
        </mesh>
      ))}

      <mesh position={[2.8, 0.75, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[1.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

function ShipModel({
  controlRef,
  active,
  resetToken,
}: {
  controlRef: MutableRefObject<ControlRef>;
  active: boolean;
  resetToken: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const visualLaneRef = useRef(0);
  const targetLaneRef = useRef(0);

  useEffect(() => {
    visualLaneRef.current = 0;
    targetLaneRef.current = 0;
  }, [resetToken]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    if (active && controlRef.current.move !== 0) {
      targetLaneRef.current = controlRef.current.currentLane;
      controlRef.current.move = 0;
    }

    visualLaneRef.current += (targetLaneRef.current - visualLaneRef.current) * Math.min(1, delta * 9);

    groupRef.current.position.x = visualLaneRef.current * 1.2;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.06;
    groupRef.current.rotation.z =
      (targetLaneRef.current - visualLaneRef.current) * -0.16 + Math.sin(clock.elapsedTime * 1.5) * 0.025;
  });

  return (
    <group ref={groupRef} position={[0, 0.04, 2.2]} rotation={[0, Math.PI, 0]}>
      <pointLight position={[0, 0.8, -0.8]} intensity={1.8} color="#67e8f9" distance={5} />

      <mesh castShadow position={[0, -0.14, 0]}>
        <boxGeometry args={[1.36, 0.34, 2.42]} />
        <meshStandardMaterial color="#0f172a" roughness={0.32} metalness={0.42} />
      </mesh>

      <mesh castShadow position={[0, 0.12, -0.06]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.08, 0.2, 1.82]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.28} metalness={0.32} />
      </mesh>

      <mesh castShadow position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.72, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.25} />
      </mesh>

      <mesh castShadow position={[0.34, 0.72, 0.02]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.48, 1.18, 3]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} />
      </mesh>

      <mesh castShadow position={[-0.34, 0.58, 0.05]} rotation={[0, 0, 0.28]}>
        <coneGeometry args={[0.38, 0.92, 3]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.26} />
      </mesh>

      {active ? (
        <mesh position={[0, -0.38, -1.25]}>
          <coneGeometry args={[0.3, 0.78, 16]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#67e8f9"
            emissiveIntensity={0.8}
            transparent
            opacity={0.78}
          />
        </mesh>
      ) : null}
    </group>
  );
}

function SceneItem({ item }: { item: SceneObject }) {
  const meta = itemMeta[item.type];

  if (meta.kind === "bad") {
    return (
      <group position={[item.lane * 1.2, 0.02, item.z]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial
            color={meta.color}
            emissive={meta.emissive}
            emissiveIntensity={0.35}
            roughness={0.26}
            metalness={0.22}
          />
        </mesh>
      </group>
    );
  }

  if (meta.kind === "special") {
    return (
      <group position={[item.lane * 1.2, 0.08, item.z]}>
        <mesh castShadow>
          <torusGeometry args={[0.28, 0.08, 16, 32]} />
          <meshStandardMaterial
            color={meta.color}
            emissive={meta.emissive}
            emissiveIntensity={0.55}
            roughness={0.18}
            metalness={0.35}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[item.lane * 1.2, 0.06, item.z]}>
      <mesh castShadow>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={meta.color}
          emissive={meta.emissive}
          emissiveIntensity={0.38}
          roughness={0.22}
          metalness={0.32}
        />
      </mesh>
    </group>
  );
}

function GameRuntime({
  active,
  mode,
  risk,
  navigationLevel,
  controlRef,
  resetToken,
  onCollect,
  onHit,
  onArrive,
  onProgress,
  onManualBoost,
}: {
  active: boolean;
  mode: VoyageMode;
  risk: number;
  navigationLevel: number;
  controlRef: MutableRefObject<ControlRef>;
  resetToken: number;
  onCollect: (type: ItemType) => void;
  onHit: (type: ItemType) => void;
  onArrive: () => void;
  onProgress: (value: number) => void;
  onManualBoost: () => boolean;
}) {
  const objectsRef = useRef<SceneObject[]>([]);
  const idRef = useRef(1);
  const spawnRef = useRef(0);
  const progressRef = useRef(0);
  const arrivedRef = useRef(false);
  const boostTimerRef = useRef(0);
  const [objects, setObjects] = useState<SceneObject[]>([]);

  useEffect(() => {
    objectsRef.current = [];
    setObjects([]);
    spawnRef.current = 0;
    progressRef.current = 0;
    arrivedRef.current = false;
    boostTimerRef.current = 0;
    onProgress(0);
  }, [resetToken, onProgress]);

  useFrame((_, delta) => {
    if (!active || arrivedRef.current) return;

    if (controlRef.current.boost) {
      controlRef.current.boost = false;

      if (onManualBoost()) {
        boostTimerRef.current = Math.max(boostTimerRef.current, 2.4);
      }
    }

    if (boostTimerRef.current > 0) {
      boostTimerRef.current -= delta;
    }

    const modeSpeed = mode === "normal" ? 1 : mode === "storm" ? 1.12 : 1.22;
    const boostSpeed = boostTimerRef.current > 0 ? 1.55 : 1;
    const travelSpeed = 0.045 * modeSpeed * boostSpeed;

    progressRef.current = clamp(progressRef.current + delta * travelSpeed, 0, 1);
    onProgress(progressRef.current);

    spawnRef.current += delta;
    const spawnGap = Math.max(0.48, 0.9 - progressRef.current * 0.28);

    if (spawnRef.current >= spawnGap) {
      spawnRef.current = 0;

      const newItem: SceneObject = {
        id: idRef.current,
        lane: randomLane(),
        z: -12,
        type: chooseItemType(mode, risk, navigationLevel),
      };

      idRef.current += 1;
      objectsRef.current = [...objectsRef.current, newItem];
    }

    const itemSpeed = 4.7 * modeSpeed * boostSpeed;
    const hitZoneZ = 1.95;
    const currentLane = controlRef.current.currentLane;
    const nextObjects: SceneObject[] = [];

    for (const item of objectsRef.current) {
      const nextZ = item.z + delta * itemSpeed;
      const isInHitZone = nextZ > hitZoneZ - 0.42 && nextZ < hitZoneZ + 0.42;
      const hit = isInHitZone && item.lane === currentLane;

      if (hit) {
        const meta = itemMeta[item.type];

        if (meta.kind === "bad") {
          onHit(item.type);
        } else {
          onCollect(item.type);
        }

        continue;
      }

      if (nextZ < 4) {
        nextObjects.push({
          ...item,
          z: nextZ,
        });
      }
    }

    objectsRef.current = nextObjects;
    setObjects(nextObjects);

    if (progressRef.current >= 1 && !arrivedRef.current) {
      arrivedRef.current = true;
      onArrive();
    }
  });

  return (
    <>
      <Ocean />
      <RouteLines />
      <PortSkyline mode={mode} />
      <ShipModel controlRef={controlRef} active={active} resetToken={resetToken} />

      {objects.map((item) => (
        <SceneItem key={item.id} item={item} />
      ))}
    </>
  );
}

function GameScene({
  active,
  mode,
  risk,
  navigationLevel,
  controlRef,
  resetToken,
  onCollect,
  onHit,
  onArrive,
  onProgress,
  onManualBoost,
}: {
  active: boolean;
  mode: VoyageMode;
  risk: number;
  navigationLevel: number;
  controlRef: MutableRefObject<ControlRef>;
  resetToken: number;
  onCollect: (type: ItemType) => void;
  onHit: (type: ItemType) => void;
  onArrive: () => void;
  onProgress: (value: number) => void;
  onManualBoost: () => boolean;
}) {
  return (
    <Canvas className={styles.canvas} shadows camera={{ position: [0, 3.1, 6.8], fov: 48 }}>
      <color attach="background" args={[mode === "expert" ? "#1f1020" : mode === "storm" ? "#111827" : "#061427"]} />
      <fog attach="fog" args={[mode === "expert" ? "#1f1020" : "#061427", 7, 22]} />

      <ambientLight intensity={0.62} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} castShadow />
      <pointLight position={[-3, 2.5, 2]} intensity={1.4} color="#38bdf8" />
      <pointLight position={[3, 2, -3]} intensity={1.2} color="#34d399" />

      <GameRuntime
        active={active}
        mode={mode}
        risk={risk}
        navigationLevel={navigationLevel}
        controlRef={controlRef}
        resetToken={resetToken}
        onCollect={onCollect}
        onHit={onHit}
        onArrive={onArrive}
        onProgress={onProgress}
        onManualBoost={onManualBoost}
      />
    </Canvas>
  );
}

function FloatingText({ text, kind }: { text: string; kind: "good" | "bad" }) {
  return (
    <div className={`${styles.floatingText} ${kind === "bad" ? styles.floatingBad : styles.floatingGood}`}>
      {text}
    </div>
  );
}

export default function VoyageProClient() {
  const state = useVoyageProStore((store) => store);
  const controlRef = useRef<ControlRef>({
    move: 0,
    boost: false,
    currentLane: 0,
  });

  const [routeProgress, setRouteProgress] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; kind: "good" | "bad"; key: number } | null>(null);

  const selectedContract = contracts.find((contract) => contract.id === state.selectedContractId) ?? contracts[0];
  const activePort = ports[state.visitedPorts % ports.length];

  const triggerFeedback = useCallback((text: string, kind: "good" | "bad") => {
    const key = Date.now() + Math.random();
    setFeedback({ text, kind, key });

    window.setTimeout(() => {
      setFeedback((current) => (current?.key === key ? null : current));
    }, 850);
  }, []);

  const startVoyage = useCallback(() => {
    setRouteProgress(0);
    setResetToken((value) => value + 1);
    controlRef.current.currentLane = 0;
    controlRef.current.move = 0;
    controlRef.current.boost = false;
    state.startVoyage();
  }, [state]);

  const handleMove = useCallback((direction: number) => {
    const nextLane = clamp(controlRef.current.currentLane + direction, -2, 2);
    controlRef.current.currentLane = nextLane;
    controlRef.current.move = direction;
  }, []);

  const handleBoost = useCallback(() => {
    controlRef.current.boost = true;
  }, []);

  const handleCollect = useCallback(
    (type: ItemType) => {
      state.collectItem(type);
      triggerFeedback(`+ ${itemMeta[type].label}`, "good");
    },
    [state, triggerFeedback]
  );

  const handleHit = useCallback(
    (type: ItemType) => {
      state.hitHazard(type);
      triggerFeedback(`- ${itemMeta[type].label}`, "bad");
    },
    [state, triggerFeedback]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === "arrowleft" || key === "a") {
        handleMove(-1);
      }

      if (key === "arrowright" || key === "d") {
        handleMove(1);
      }

      if (key === "arrowup" || key === "w" || key === " ") {
        event.preventDefault();
        handleBoost();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleBoost, handleMove]);

  const isVoyaging = state.phase === "voyage";
  const progressPercent = Math.floor(routeProgress * 100);

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
            <a href="/voyage-pro">Voyage Pro</a>
            <a href="/risk-lab">Risk Lab</a>
            <a href="/challenge">Challenge</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.heroLabel}>Voyage Pro</p>
            <h1 className={styles.title}>세계 항로를 지배하는 프리미엄 항해 게임.</h1>
            <p className={styles.subtitle}>
              계약을 선택하고, 항해를 시작하고, 보상을 모아 선박을 성장시키세요. 더 위험한 항로일수록 더 큰 보상이 기다립니다.
            </p>
          </div>

          <aside className={styles.premiumCard}>
            <h2>Voyage Loop</h2>
            <p>계약 선택 → 출항 → 보상 획득 → 항구 도착 → 업그레이드 → 더 어려운 항로에 도전하세요.</p>
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
          <div className={styles.resourceCard}>
            <span>Captain Lv.</span>
            <strong>{state.level}</strong>
          </div>
          <div className={styles.resourceCard}>
            <span>Chests</span>
            <strong>{state.chests}</strong>
          </div>
        </section>

        <section className={styles.layout}>
          <div className={styles.scenePanel}>
            <GameScene
              active={isVoyaging}
              mode={state.mode}
              risk={selectedContract.risk}
              navigationLevel={state.upgrades.navigation}
              controlRef={controlRef}
              resetToken={resetToken}
              onCollect={handleCollect}
              onHit={handleHit}
              onArrive={state.completeVoyage}
              onProgress={setRouteProgress}
              onManualBoost={state.useBoost}
            />

            <div className={styles.sceneOverlay}>
              <div className={styles.statusChip}>
                <strong>{activePort.region}</strong>
                <br />
                다음 항구: {activePort.name} · 진행률 {progressPercent}%
                <div className={styles.progressTrack}>
                  <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className={styles.rankChip}>
                Reputation Lv.{state.reputation} · Ports {state.visitedPorts}
              </div>
            </div>

            {feedback ? <FloatingText key={feedback.key} text={feedback.text} kind={feedback.kind} /> : null}

            <div className={styles.playControls}>
              <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={() => handleMove(-1)}>
                ←
              </button>
              <button type="button" className={`${styles.button} ${styles.primaryButton}`} onClick={handleBoost}>
                Boost
              </button>
              <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={() => handleMove(1)}>
                →
              </button>
            </div>
          </div>

          <aside className={styles.sideStack}>
            <section className={styles.panel}>
              <h2>항해 모드</h2>
              <p className={styles.panelDescription}>보상과 위험도를 조절합니다. 높은 난이도일수록 더 큰 보상을 얻을 수 있습니다.</p>

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
              <p className={styles.panelDescription}>보상이 높을수록 위험도도 높습니다. 계약을 신중하게 선택하세요.</p>

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
                선택한 계약: {selectedContract.icon} {selectedContract.title}
              </p>

              <div className={styles.buttonRow}>
                <button type="button" className={`${styles.button} ${styles.primaryButton}`} onClick={startVoyage}>
                  출항
                </button>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.openShop}>
                  상점
                </button>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.claimDailyReward}>
                  일일 보상
                </button>
                <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={state.resetRun}>
                  정비
                </button>
              </div>

              <div className={styles.messageBar}>{state.message}</div>
            </section>

            <section className={styles.panel}>
              <h2>Captain Progress</h2>
              <p className={styles.panelDescription}>
                최고 거리 {formatNumber(state.bestDistance)} km · XP {state.xp}/{state.level * 100}
              </p>

              <div className={styles.levelTrack}>
                <div className={styles.levelBar} style={{ width: `${Math.min(100, (state.xp / (state.level * 100)) * 100)}%` }} />
              </div>

              <div className={styles.buttonRow}>
                <button type="button" className={`${styles.button} ${styles.primaryButton}`} onClick={state.openRewardChest}>
                  보상 상자 열기 · {state.chests}
                </button>
              </div>

              <div className={styles.skinGrid}>
                {shipSkins.map((skin) => {
                  const unlocked = state.unlockedSkins.includes(skin.id);
                  const active = state.currentSkinId === skin.id;

                  return (
                    <button
                      key={skin.id}
                      type="button"
                      className={`${styles.skinCard} ${active ? styles.skinCardActive : ""}`}
                      onClick={() => state.equipSkin(skin.id)}
                    >
                      <span className={styles.skinSwatch} style={{ background: skin.color }} />
                      <strong>{skin.name}</strong>
                      <small>{unlocked ? (active ? "장착 중" : "해금됨") : "잠김"}</small>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={styles.panel}>
              <h2>Item Guide</h2>
              <div className={styles.guideGrid}>
                <div>
                  <strong className={styles.goodText}>Positive</strong>
                  <span>Coins, Gems, Fuel, Food, Repair, Boost</span>
                </div>
                <div>
                  <strong className={styles.badText}>Danger</strong>
                  <span>Reef, Storm, Pirate, Customs, Supply Loss</span>
                </div>
              </div>
            </section>

            <section className={styles.panel}>
              <h2>Ship Upgrade Shop</h2>
              <p className={styles.panelDescription}>코인과 젬을 모아 선박 성능을 강화하고 더 높은 보상의 항로에 도전하세요.</p>

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
                          onClick={() => state.buyUpgrade(upgrade.key as UpgradeKey, price)}
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
