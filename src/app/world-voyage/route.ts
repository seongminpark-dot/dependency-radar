import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function html() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>World Voyage 3D | Datlora</title>
  <meta name="description" content="Datlora World Voyage 3D는 세계 항로를 이동하며 화물 계약, 항구 비용, 연료, 식량, 선체 내구도, 폭풍과 해적 리스크를 관리하는 3D 느낌의 캐주얼 항해 게임입니다." />
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      background:
        radial-gradient(circle at 15% 10%, rgba(34,211,238,.2), transparent 28%),
        radial-gradient(circle at 84% 18%, rgba(52,211,153,.16), transparent 34%),
        radial-gradient(circle at 50% 100%, rgba(59,130,246,.12), transparent 40%),
        #050816;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      overflow-x: hidden;
    }
    .site-nav {
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid rgba(255,255,255,.1);
      background: rgba(5,8,22,.88);
      backdrop-filter: blur(16px);
    }
    .site-nav-inner {
      max-width: 1220px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }
    .site-brand {
      color: #fff;
      text-decoration: none;
      font-size: 17px;
      font-weight: 950;
    }
    .site-menu {
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
    }
    .site-menu a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 14px;
      font-weight: 760;
    }
    main {
      max-width: 1220px;
      margin: 0 auto;
      padding: 54px 24px 82px;
    }
    .label {
      margin: 0;
      color: #67e8f9;
      font-size: 13px;
      font-weight: 950;
      letter-spacing: .24em;
      text-transform: uppercase;
    }
    h1 {
      max-width: 1050px;
      margin: 20px 0 18px;
      font-size: clamp(42px, 7vw, 82px);
      line-height: 1.02;
      letter-spacing: -0.07em;
    }
    .intro {
      max-width: 900px;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.75;
      margin: 0;
    }
    .hud {
      margin-top: 28px;
      display: grid;
      grid-template-columns: repeat(8, minmax(0, 1fr));
      gap: 10px;
    }
    .hud-card {
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.055);
      border-radius: 18px;
      padding: 13px;
      min-height: 78px;
    }
    .hud-card p {
      margin: 0;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 850;
    }
    .hud-card strong {
      display: block;
      margin-top: 7px;
      color: #fff;
      font-size: 21px;
      letter-spacing: -0.05em;
      white-space: nowrap;
    }
    .game-shell {
      margin-top: 26px;
      border: 1px solid rgba(255,255,255,.12);
      background:
        linear-gradient(135deg, rgba(255,255,255,.075), rgba(255,255,255,.025)),
        rgba(255,255,255,.035);
      border-radius: 34px;
      padding: 24px;
      box-shadow: 0 32px 90px rgba(0,0,0,.38);
    }
    .canvas-wrap {
      position: relative;
      border-radius: 28px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.1);
      background: #071120;
    }
    canvas {
      display: block;
      width: 100%;
      height: 570px;
      touch-action: none;
    }
    .overlay {
      position: absolute;
      left: 18px;
      right: 18px;
      bottom: 18px;
      display: grid;
      gap: 10px;
      pointer-events: none;
    }
    .message {
      width: fit-content;
      max-width: 100%;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(2,6,23,.78);
      color: #e2e8f0;
      border-radius: 18px;
      padding: 13px 15px;
      font-size: 14px;
      font-weight: 850;
      line-height: 1.55;
      backdrop-filter: blur(14px);
    }
    .mission-box {
      width: fit-content;
      max-width: 100%;
      border: 1px solid rgba(52,211,153,.25);
      background: rgba(6,95,70,.36);
      color: #d1fae5;
      border-radius: 18px;
      padding: 11px 13px;
      font-size: 13px;
      font-weight: 850;
      line-height: 1.5;
      backdrop-filter: blur(14px);
    }
    .controls {
      margin-top: 18px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }
    button,
    .link-button {
      border: 0;
      border-radius: 16px;
      padding: 13px 16px;
      font-size: 14px;
      font-weight: 950;
      cursor: pointer;
      text-decoration: none;
    }
    .primary {
      background: #34d399;
      color: #04130d;
    }
    .secondary {
      background: #0b1220;
      color: #e2e8f0;
      border: 1px solid rgba(255,255,255,.12);
    }
    .danger {
      background: rgba(239,68,68,.15);
      color: #fecaca;
      border: 1px solid rgba(248,113,113,.3);
    }
    .mobile-controls {
      margin-left: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .mobile-controls button {
      min-width: 52px;
      font-size: 18px;
    }
    .port-panel {
      display: none;
      margin-top: 18px;
      border: 1px solid rgba(125,211,252,.22);
      background:
        radial-gradient(circle at 18% 20%, rgba(14,165,233,.16), transparent 30%),
        rgba(15,23,42,.78);
      border-radius: 24px;
      padding: 20px;
    }
    .port-panel.show {
      display: block;
    }
    .port-panel h2 {
      margin: 0 0 10px;
      font-size: 28px;
      letter-spacing: -0.04em;
    }
    .port-panel p {
      margin: 8px 0;
      color: #cbd5e1;
      line-height: 1.6;
      font-size: 14px;
      font-weight: 720;
    }
    .choice-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .choice-card {
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.055);
      color: #fff;
      border-radius: 18px;
      padding: 15px;
      text-align: left;
      cursor: pointer;
      min-height: 150px;
    }
    .choice-card:hover {
      border-color: rgba(52,211,153,.45);
      background: rgba(52,211,153,.08);
    }
    .choice-card.active {
      border-color: rgba(52,211,153,.65);
      background: rgba(16,185,129,.14);
    }
    .choice-card h3 {
      margin: 0;
      font-size: 16px;
      letter-spacing: -0.02em;
    }
    .choice-card p {
      margin: 8px 0 0;
      font-size: 13px;
      color: #cbd5e1;
    }
    .upgrade-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }
    .status-line {
      margin-top: 12px;
      min-height: 20px;
      color: #94a3b8;
      font-size: 13px;
      font-weight: 760;
      line-height: 1.55;
    }
    .note {
      margin-top: 22px;
      border: 1px solid rgba(251,191,36,.24);
      background: rgba(251,191,36,.09);
      color: #fef3c7;
      border-radius: 22px;
      padding: 17px;
      line-height: 1.65;
      font-size: 14px;
    }
    @media (max-width: 1050px) {
      .hud {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .choice-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 720px) {
      .site-nav-inner {
        flex-direction: column;
        align-items: flex-start;
      }
      .site-menu {
        gap: 10px;
      }
      .site-menu a {
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 999px;
        padding: 8px 11px;
        background: rgba(255,255,255,.04);
        font-size: 12px;
      }
      .hud {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      canvas {
        height: 500px;
      }
      .mobile-controls {
        width: 100%;
        margin-left: 0;
      }
      h1 {
        font-size: 42px;
      }
    }
  </style>
</head>
<body>
  <header class="site-nav">
    <div class="site-nav-inner">
      <a class="site-brand" href="/">Datlora</a>
      <nav class="site-menu" aria-label="Main navigation">
        <a href="/#country-search">국가 검색</a>
        <a href="/topics">주제별 통계</a>
        <a href="/compare?a=KOR&b=USA">국가 비교</a>
        <a href="/challenge">데이터 챌린지</a>
        <a href="/risk-lab">Risk Lab</a>
        <a href="/world-voyage">World Voyage 3D</a>
        <a href="/sources">출처</a>
      </nav>
    </div>
  </header>

  <main>
    <p class="label">World Voyage 3D</p>
    <h1>화물 계약을 싣고 세계 항로를 살아남으세요.</h1>
    <p class="intro">
      방향키로 항로를 바꾸고, 부스트로 위기를 피하고, 항구에서 계약과 업그레이드를 선택하세요.
      연료, 식량, 선체 내구도, 현금이 모두 떨어지면 항해가 끝납니다.
    </p>

    <section class="hud">
      <div class="hud-card">
        <p>현금</p>
        <strong id="cash">$900</strong>
      </div>
      <div class="hud-card">
        <p>연료</p>
        <strong id="fuel">100%</strong>
      </div>
      <div class="hud-card">
        <p>식량</p>
        <strong id="food">100%</strong>
      </div>
      <div class="hud-card">
        <p>선체</p>
        <strong id="hull">100%</strong>
      </div>
      <div class="hud-card">
        <p>거리</p>
        <strong id="distance">0 km</strong>
      </div>
      <div class="hud-card">
        <p>방문 항구</p>
        <strong id="ports">0</strong>
      </div>
      <div class="hud-card">
        <p>계약</p>
        <strong id="contract">없음</strong>
      </div>
      <div class="hud-card">
        <p>최고 거리</p>
        <strong id="best">0 km</strong>
      </div>
    </section>

    <section class="game-shell">
      <div class="canvas-wrap">
        <canvas id="game" aria-label="World Voyage 3D advanced game canvas"></canvas>
        <div class="overlay">
          <div class="mission-box" id="mission">미션: 첫 항구에서 계약을 선택하고 출항하세요.</div>
          <div class="message" id="message">게임 시작을 누르면 첫 항구에서 계약과 업그레이드를 선택합니다.</div>
        </div>
      </div>

      <div class="controls">
        <button class="primary" type="button" id="start-button">새 항해 시작</button>
        <button class="secondary" type="button" id="pause-button">일시정지</button>
        <button class="secondary" type="button" id="boost-button">부스트</button>
        <button class="secondary" type="button" id="repair-button">긴급 수리 $220</button>
        <button class="secondary" type="button" id="share-button">기록 공유</button>
        <a class="link-button secondary" href="/risk-lab">Risk Lab</a>

        <div class="mobile-controls" aria-label="Mobile controls">
          <button class="secondary" type="button" id="left-button">←</button>
          <button class="secondary" type="button" id="right-button">→</button>
          <button class="secondary" type="button" id="mobile-boost-button">⚡</button>
        </div>
      </div>

      <section class="port-panel" id="port-panel">
        <h2 id="port-title">항구</h2>
        <p id="port-summary"></p>

        <div class="choice-grid" id="contract-grid"></div>

        <div class="upgrade-row" id="upgrade-row"></div>

        <div class="upgrade-row">
          <button class="primary" type="button" id="depart-button">출항</button>
          <button class="secondary" type="button" id="restock-button">연료·식량 보급 $180</button>
        </div>
      </section>

      <p class="status-line" id="share-status"></p>
    </section>

    <section class="note">
      이 게임은 실제 항만 비용이나 국가별 공식 통계를 그대로 표시하는 페이지가 아니라, Datlora의 무역·항로·비용 관리 콘셉트를 바탕으로 만든 캐주얼 웹 게임입니다.
      공식 수치는 국가 상세 페이지와 주제별 통계 페이지에서 확인하세요.
    </section>
  </main>

  <script>
    const STORAGE_KEY = "datlora.worldvoyage.advanced.v1";

    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    const els = {
      cash: document.getElementById("cash"),
      fuel: document.getElementById("fuel"),
      food: document.getElementById("food"),
      hull: document.getElementById("hull"),
      distance: document.getElementById("distance"),
      ports: document.getElementById("ports"),
      contract: document.getElementById("contract"),
      best: document.getElementById("best"),
      message: document.getElementById("message"),
      mission: document.getElementById("mission"),
      shareStatus: document.getElementById("share-status"),
      portPanel: document.getElementById("port-panel"),
      portTitle: document.getElementById("port-title"),
      portSummary: document.getElementById("port-summary"),
      contractGrid: document.getElementById("contract-grid"),
      upgradeRow: document.getElementById("upgrade-row")
    };

    const ports = [
      { name: "Busan", region: "Korea", fee: 80, food: 28, fuel: 75, theme: "#38bdf8" },
      { name: "Singapore", region: "Southeast Asia", fee: 135, food: 42, fuel: 92, theme: "#34d399" },
      { name: "Dubai", region: "Middle East", fee: 165, food: 48, fuel: 105, theme: "#facc15" },
      { name: "Rotterdam", region: "Europe", fee: 210, food: 58, fuel: 118, theme: "#60a5fa" },
      { name: "New York", region: "North America", fee: 235, food: 72, fuel: 132, theme: "#a78bfa" },
      { name: "Santos", region: "Brazil", fee: 175, food: 46, fuel: 96, theme: "#4ade80" },
      { name: "Cape Town", region: "South Africa", fee: 155, food: 44, fuel: 88, theme: "#fb923c" },
      { name: "Incheon", region: "Korea", fee: 185, food: 52, fuel: 104, theme: "#22d3ee" }
    ];

    const contractTemplates = [
      { type: "전자부품", icon: "💾", reward: 520, risk: 0.18, weight: 1, note: "수익 안정적" },
      { type: "에너지 장비", icon: "⚙️", reward: 650, risk: 0.28, weight: 2, note: "세관 검사 확률 증가" },
      { type: "냉장 식품", icon: "🥭", reward: 720, risk: 0.34, weight: 2, note: "식량 관리 중요" },
      { type: "긴급 의약품", icon: "💊", reward: 820, risk: 0.38, weight: 1, note: "빠른 도착 보너스" },
      { type: "고가 기계", icon: "🏗️", reward: 980, risk: 0.46, weight: 3, note: "해적·폭풍 리스크 큼" }
    ];

    const objectTypes = {
      coin: { label: "보너스 수익", icon: "$", color: "#34d399", kind: "good" },
      fuel: { label: "연료 드럼", icon: "⛽", color: "#60a5fa", kind: "good" },
      food: { label: "식량 상자", icon: "🍱", color: "#facc15", kind: "good" },
      repair: { label: "수리 키트", icon: "🔧", color: "#a78bfa", kind: "good" },
      permit: { label: "통행 허가증", icon: "🪪", color: "#22d3ee", kind: "good" },
      current: { label: "해류 부스트", icon: "➤", color: "#67e8f9", kind: "good" },
      customs: { label: "세관 검사", icon: "🛃", color: "#fb923c", kind: "bad" },
      toll: { label: "항로 통행료", icon: "⛔", color: "#f97316", kind: "bad" },
      reef: { label: "암초", icon: "▲", color: "#fb7185", kind: "bad" },
      storm: { label: "폭풍", icon: "☁", color: "#818cf8", kind: "bad" },
      pirate: { label: "해적선", icon: "☠", color: "#ef4444", kind: "bad" },
      crate: { label: "부유 화물", icon: "📦", color: "#4ade80", kind: "good" }
    };

    let state = null;
    let objects = [];
    let particles = [];
    let running = false;
    let paused = false;
    let portOpen = false;
    let gameOver = false;
    let lastTime = 0;
    let spawnTimer = 0;
    let weatherTimer = 0;
    let eventTimer = 0;

    function defaultState() {
      return {
        cash: 1200,
        fuel: 100,
        food: 100,
        hull: 100,
        distance: 0,
        routeDistance: 0,
        portEvery: 1550,
        visitedPorts: 0,
        portIndex: 0,
        lane: 0,
        visualLane: 0,
        laneTilt: 0,
        speed: 1,
        boost: 0,
        shield: 0,
        permits: 0,
        reputation: 0,
        contract: null,
        contractSelected: false,
        contractDelivered: 0,
        day: 1,
        upgrades: {
          engine: 1,
          hull: 1,
          cargo: 1,
          navigation: 1
        },
        combo: 0,
        missionStage: 1
      };
    }

    function loadBest() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return 0;
        const parsed = JSON.parse(raw);
        return Number(parsed.bestDistance || 0);
      } catch {
        return 0;
      }
    }

    function saveBest() {
      if (!state) return;
      const bestDistance = Math.max(loadBest(), Math.floor(state.distance));
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestDistance }));
    }

    function formatMoney(value) {
      const sign = value < 0 ? "-$" : "$";
      return sign + Math.abs(Math.floor(value)).toLocaleString("ko-KR");
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function setMessage(message) {
      els.message.textContent = message;
    }

    function updateMission() {
      if (!state) {
        els.mission.textContent = "미션: 게임을 시작하세요.";
        return;
      }

      if (state.missionStage === 1) {
        els.mission.textContent = "미션 1: 계약 화물을 싣고 첫 항구에 도착하세요.";
      } else if (state.missionStage === 2) {
        els.mission.textContent = "미션 2: 항구 3곳을 방문하고 현금 $2,000 이상을 유지하세요.";
      } else if (state.missionStage === 3) {
        els.mission.textContent = "미션 3: 선체 50% 이상으로 7,000 km를 넘기세요.";
      } else {
        els.mission.textContent = "엔드리스 항해: 더 멀리 이동하고 더 높은 기록을 만드세요.";
      }
    }

    function checkMissionProgress() {
      if (!state) return;

      if (state.missionStage === 1 && state.visitedPorts >= 1 && state.contractDelivered >= 1) {
        state.cash += 350;
        state.missionStage = 2;
        setMessage("미션 1 완료 · 보너스 $350 지급");
      }

      if (state.missionStage === 2 && state.visitedPorts >= 3 && state.cash >= 2000) {
        state.cash += 600;
        state.reputation += 1;
        state.missionStage = 3;
        setMessage("미션 2 완료 · 보너스 $600 · 평판 +1");
      }

      if (state.missionStage === 3 && state.distance >= 7000 && state.hull >= 50) {
        state.cash += 900;
        state.reputation += 2;
        state.missionStage = 4;
        setMessage("미션 3 완료 · 보너스 $900 · 엔드리스 항해 개방");
      }

      updateMission();
    }

    function updateHud() {
      if (!state) return;

      els.cash.textContent = formatMoney(state.cash);
      els.fuel.textContent = Math.round(state.fuel) + "%";
      els.food.textContent = Math.round(state.food) + "%";
      els.hull.textContent = Math.round(state.hull) + "%";
      els.distance.textContent = Math.floor(state.distance).toLocaleString("ko-KR") + " km";
      els.ports.textContent = String(state.visitedPorts);
      els.contract.textContent = state.contract ? state.contract.icon + " " + state.contract.type : "없음";
      els.best.textContent = loadBest().toLocaleString("ko-KR") + " km";
      updateMission();
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(320, Math.floor(rect.width * ratio));
      canvas.height = Math.max(360, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function width() {
      return canvas.clientWidth;
    }

    function height() {
      return canvas.clientHeight;
    }

    function project(lane, z) {
      const w = width();
      const h = height();
      const horizon = h * 0.18;
      const y = horizon + z * h * 0.75;
      const roadHalf = w * (0.045 + z * 0.47);
      const laneGap = roadHalf / 2.15;
      const x = w / 2 + lane * laneGap;
      const scale = 0.2 + z * 1.7;

      return { x, y, scale, laneGap };
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function drawBackground() {
      const w = width();
      const h = height();
      const dayTone = Math.sin(state.distance * 0.00028) * 0.5 + 0.5;

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, dayTone > 0.42 ? "#0f172a" : "#020617");
      sky.addColorStop(0.45, dayTone > 0.42 ? "#075985" : "#111827");
      sky.addColorStop(1, "#082f49");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = dayTone > 0.42 ? "rgba(255,255,255,.88)" : "rgba(147,197,253,.75)";
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.12, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,.08)";
      for (let i = 0; i < 34; i += 1) {
        const x = (i * 83 + state.distance * 0.05) % w;
        const y = h * 0.08 + (i % 7) * 22;
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(56,189,248,.12)";
      for (let i = 0; i < 8; i += 1) {
        const x = (i * 170 - state.distance * 0.14) % (w + 240) - 120;
        const y = h * 0.18 + (i % 4) * 32;
        roundRect(x, y, 92, 16, 8);
        ctx.fill();
      }

      const horizon = h * 0.18;

      ctx.fillStyle = "rgba(14,165,233,.24)";
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 42, horizon);
      ctx.lineTo(w * 0.5 + 42, horizon);
      ctx.lineTo(w * 0.97, h * 0.97);
      ctx.lineTo(w * 0.03, h * 0.97);
      ctx.closePath();
      ctx.fill();

      for (let i = 0; i < 22; i += 1) {
        const z = ((i * 0.065 + state.distance * 0.0017) % 1);
        const left = project(-2.6, z);
        const right = project(2.6, z);

        ctx.strokeStyle = "rgba(255,255,255," + (0.04 + z * 0.18) + ")";
        ctx.lineWidth = 1 + z * 2.4;
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
      }

      [-2, -1, 0, 1, 2].forEach(function(lane) {
        const near = project(lane, 1);
        const far = project(lane, 0.02);

        ctx.strokeStyle = lane === 0 ? "rgba(186,230,253,.34)" : "rgba(186,230,253,.2)";
        ctx.lineWidth = lane === 0 ? 2.4 : 1.6;
        ctx.beginPath();
        ctx.moveTo(far.x, far.y);
        ctx.lineTo(near.x, near.y);
        ctx.stroke();
      });

      particles.forEach(function(p) {
        ctx.fillStyle = "rgba(224,242,254," + p.alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawRouteMarker() {
      if (!state) return;

      const progress = clamp(state.routeDistance / state.portEvery, 0, 1);
      const nextPort = ports[state.portIndex % ports.length];
      const z = Math.max(0.04, 1 - progress);

      if (z < 0.08) return;

      const p = project(0, z);

      ctx.save();
      ctx.translate(p.x, p.y - 42 * p.scale);

      ctx.fillStyle = "rgba(15,23,42,.78)";
      ctx.strokeStyle = nextPort.theme;
      ctx.lineWidth = 2;
      const boxW = 180 * p.scale;
      const boxH = 44 * p.scale;
      roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 14 * p.scale);
      ctx.fill();
      ctx.stroke();

      ctx.font = Math.max(10, 13 * p.scale) + "px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#e0f2fe";
      ctx.fillText("Next Port: " + nextPort.name, 0, 0);

      ctx.restore();
    }

    function drawObject(item) {
      const p = project(item.lane, item.z);
      const type = objectTypes[item.type] || objectTypes.coin;
      const size = 25 * p.scale;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = item.hit ? 0.25 : 1;
      ctx.shadowBlur = 18 * p.scale;
      ctx.shadowColor = type.color;

      if (type.kind === "bad") {
        ctx.fillStyle = "rgba(30,41,59,.86)";
        ctx.strokeStyle = type.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.75);
        ctx.lineTo(size * 0.7, size * 0.55);
        ctx.lineTo(-size * 0.7, size * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(2,6,23,.84)";
        ctx.strokeStyle = type.color;
        ctx.lineWidth = 2.4;
        roundRect(-size / 2, -size / 2, size, size, 12 * p.scale);
        ctx.fill();
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.font = Math.max(14, 22 * p.scale) + "px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.fillText(type.icon, 0, -1 * p.scale);

      if (item.type === "pirate") {
        ctx.fillStyle = "rgba(239,68,68,.35)";
        ctx.beginPath();
        ctx.arc(0, size * 0.54, size * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function drawShip() {
      const p = project(state.visualLane, 0.93);
      const bob = Math.sin(performance.now() * 0.006) * 4;
      const tilt = (state.visualLane - state.lane) * -0.12 + state.laneTilt;
      const shieldGlow = state.shield > 0 ? 1 : 0;
      const invGlow = state.invulnerable > 0 ? 1 : 0;

      ctx.save();
      ctx.translate(p.x, p.y + bob);
      ctx.rotate(tilt);

      ctx.shadowBlur = 22 + shieldGlow * 20 + invGlow * 20;
      ctx.shadowColor = shieldGlow ? "#22d3ee" : invGlow ? "#facc15" : "#67e8f9";

      const s = 1.05 * p.scale;

      ctx.fillStyle = "rgba(15,23,42,.55)";
      ctx.beginPath();
      ctx.ellipse(0, 24 * s, 54 * s, 13 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#67e8f9";
      ctx.lineWidth = 2.2 * s;

      ctx.beginPath();
      ctx.moveTo(-46 * s, 9 * s);
      ctx.quadraticCurveTo(-25 * s, 36 * s, 0, 38 * s);
      ctx.quadraticCurveTo(31 * s, 36 * s, 51 * s, 7 * s);
      ctx.lineTo(30 * s, 18 * s);
      ctx.lineTo(-30 * s, 18 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(0, 18 * s);
      ctx.lineTo(0, -58 * s);
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(4 * s, -52 * s);
      ctx.lineTo(42 * s, -10 * s);
      ctx.lineTo(4 * s, 8 * s);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#bae6fd";
      ctx.beginPath();
      ctx.moveTo(-4 * s, -46 * s);
      ctx.lineTo(-34 * s, -8 * s);
      ctx.lineTo(-4 * s, 7 * s);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(0, 4 * s, 5 * s, 0, Math.PI * 2);
      ctx.fill();

      if (state.boost > 0) {
        ctx.fillStyle = "rgba(103,232,249,.8)";
        ctx.beginPath();
        ctx.moveTo(-18 * s, 32 * s);
        ctx.lineTo(0, 62 * s);
        ctx.lineTo(18 * s, 32 * s);
        ctx.closePath();
        ctx.fill();
      }

      if (state.shield > 0) {
        ctx.strokeStyle = "rgba(34,211,238,.58)";
        ctx.lineWidth = 3 * s;
        ctx.beginPath();
        ctx.arc(0, -6 * s, 68 * s, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawPauseOverlay() {
      if (running && !paused && !portOpen && !gameOver) return;

      ctx.save();
      ctx.fillStyle = "rgba(2,6,23,.42)";
      ctx.fillRect(0, 0, width(), height());

      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 34px system-ui";

      let title = "Ready";
      if (portOpen) title = "Port Docked";
      if (paused) title = "Paused";
      if (gameOver) title = "Voyage Over";

      ctx.fillText(title, width() / 2, height() / 2 - 26);

      ctx.font = "750 15px system-ui";
      ctx.fillStyle = "#cbd5e1";

      let sub = "계약을 선택하고 출항하세요.";
      if (paused) sub = "P 또는 일시정지 버튼으로 재개할 수 있습니다.";
      if (gameOver) sub = "새 항해 시작을 눌러 다시 도전하세요.";

      ctx.fillText(sub, width() / 2, height() / 2 + 14);
      ctx.restore();
    }

    function render() {
      if (!state) return;

      drawBackground();
      drawRouteMarker();

      objects
        .slice()
        .sort(function(a, b) { return a.z - b.z; })
        .forEach(drawObject);

      drawShip();
      drawPauseOverlay();
    }

    function randomLane() {
      return [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
    }

    function randomObjectType() {
      const contractRisk = state.contract ? state.contract.risk : 0.2;
      const navigationBonus = state.upgrades.navigation * 0.025;
      const dangerChance = clamp(0.32 + contractRisk * 0.35 - navigationBonus, 0.22, 0.52);
      const r = Math.random();

      if (r > dangerChance) {
        const good = ["coin", "fuel", "food", "repair", "permit", "current", "crate"];
        return good[Math.floor(Math.random() * good.length)];
      }

      const bad = ["customs", "toll", "reef", "storm", "pirate"];
      return bad[Math.floor(Math.random() * bad.length)];
    }

    function spawnObject() {
      const lane = randomLane();
      const type = randomObjectType();

      objects.push({
        lane: lane,
        z: 0.02,
        type: type,
        hit: false,
        wobble: Math.random() * Math.PI * 2
      });
    }

    function makeParticles(delta) {
      const w = width();
      const h = height();

      if (particles.length < 80) {
        for (let i = 0; i < 3; i += 1) {
          particles.push({
            x: Math.random() * w,
            y: h * (0.25 + Math.random() * 0.72),
            r: 1 + Math.random() * 2.3,
            alpha: 0.08 + Math.random() * 0.18,
            speed: 18 + Math.random() * 42
          });
        }
      }

      particles.forEach(function(p) {
        p.x -= p.speed * delta;
        if (p.x < -20) {
          p.x = w + 20;
          p.y = h * (0.25 + Math.random() * 0.72);
        }
      });
    }

    function applyGoodItem(type) {
      if (type === "coin") {
        const amount = 80 + state.combo * 10;
        state.cash += amount;
        state.combo += 1;
        setMessage("보너스 수익 +" + formatMoney(amount).replace("$", "$") + " · 콤보 " + state.combo);
      }

      if (type === "crate") {
        const amount = state.contract ? 130 + state.contract.weight * 40 : 120;
        state.cash += amount;
        state.combo += 1;
        setMessage("부유 화물 회수 +" + formatMoney(amount).replace("$", "$"));
      }

      if (type === "fuel") {
        state.fuel = clamp(state.fuel + 22 + state.upgrades.engine * 3, 0, 130);
        setMessage("연료 보급 +" + (22 + state.upgrades.engine * 3) + "%");
      }

      if (type === "food") {
        state.food = clamp(state.food + 20, 0, 130);
        setMessage("식량 보급 +20%");
      }

      if (type === "repair") {
        state.hull = clamp(state.hull + 18 + state.upgrades.hull * 2, 0, 130);
        setMessage("선체 수리 +" + (18 + state.upgrades.hull * 2) + "%");
      }

      if (type === "permit") {
        state.permits += 1;
        setMessage("통행 허가증 획득 · 세관/통행료 1회 방어");
      }

      if (type === "current") {
        state.boost = Math.max(state.boost, 3.2);
        setMessage("해류 부스트 발동 · 속도 증가");
      }
    }

    function applyBadItem(type) {
      if (state.invulnerable > 0 || state.shield > 0) {
        if (state.shield > 0) state.shield = 0;
        setMessage("방어막으로 위험을 막았습니다.");
        state.invulnerable = 1.1;
        return;
      }

      if ((type === "customs" || type === "toll") && state.permits > 0) {
        state.permits -= 1;
        setMessage("통행 허가증 사용 · 비용을 막았습니다.");
        state.invulnerable = 0.8;
        return;
      }

      state.combo = 0;

      if (type === "customs") {
        const cost = Math.floor(115 + (state.contract ? state.contract.risk * 180 : 0));
        state.cash -= cost;
        setMessage("세관 검사 비용 -" + formatMoney(cost).replace("$", "$"));
      }

      if (type === "toll") {
        const cost = 95 + state.visitedPorts * 12;
        state.cash -= cost;
        setMessage("항로 통행료 -" + formatMoney(cost).replace("$", "$"));
      }

      if (type === "reef") {
        const damage = Math.max(10, 26 - state.upgrades.hull * 3);
        state.hull -= damage;
        setMessage("암초 충돌 · 선체 -" + damage + "%");
      }

      if (type === "storm") {
        const damage = Math.max(12, 30 - state.upgrades.navigation * 3);
        state.hull -= damage;
        state.fuel -= 10;
        setMessage("폭풍 통과 · 선체 -" + damage + "% · 연료 -10%");
      }

      if (type === "pirate") {
        const loss = 160 + Math.floor(Math.random() * 100);
        const damage = 16;
        state.cash -= loss;
        state.hull -= damage;
        setMessage("해적 습격 · 현금 -" + formatMoney(loss).replace("$", "$") + " · 선체 -" + damage + "%");
      }

      state.invulnerable = 1.05;
    }

    function handleHit(item) {
      if (item.hit) return;

      item.hit = true;
      const info = objectTypes[item.type];

      if (info.kind === "good") {
        applyGoodItem(item.type);
      } else {
        applyBadItem(item.type);
      }

      checkGameOver();
    }

    function updateObjects(delta) {
      const routeMultiplier = 1 + state.visitedPorts * 0.035;
      const engineBonus = state.upgrades.engine * 0.04;
      const boostBonus = state.boost > 0 ? 0.7 : 0;
      const lowFuelPenalty = state.fuel <= 0 ? -0.45 : 0;
      const speed = Math.max(0.45, 1 + engineBonus + boostBonus + lowFuelPenalty) * routeMultiplier;

      const zSpeed = (0.30 + state.distance * 0.000006) * speed;

      objects.forEach(function(item) {
        item.z += zSpeed * delta;
        item.wobble += delta * 3;

        if (!item.hit && item.z > 0.84 && item.z < 1.04 && item.lane === state.lane) {
          handleHit(item);
        }
      });

      objects = objects.filter(function(item) {
        return item.z < 1.18 && !item.hit;
      });
    }

    function updateResources(delta) {
      const routeMultiplier = 1 + state.visitedPorts * 0.03;
      const engineEfficiency = 1 - state.upgrades.engine * 0.035;
      const foodEfficiency = 1 - state.upgrades.cargo * 0.02;

      state.fuel -= delta * 1.15 * routeMultiplier * engineEfficiency;
      state.food -= delta * 0.82 * routeMultiplier * foodEfficiency;

      if (state.boost > 0) {
        state.boost -= delta;
        state.fuel -= delta * 2.3;
      }

      if (state.invulnerable > 0) {
        state.invulnerable -= delta;
      }

      if (state.shield > 0) {
        state.shield -= delta;
      }

      if (state.fuel <= 0) {
        state.hull -= delta * 3.5;
      }

      if (state.food <= 0) {
        state.cash -= delta * 18;
      }

      state.fuel = clamp(state.fuel, -20, 130);
      state.food = clamp(state.food, -20, 130);
      state.hull = clamp(state.hull, -20, 130);
    }

    function updateMovement(delta) {
      const diff = state.lane - state.visualLane;
      state.visualLane += diff * Math.min(1, delta * 9);
      state.laneTilt = diff * -0.08;
    }

    function updateDistance(delta) {
      const engineBonus = state.upgrades.engine * 4;
      const boostBonus = state.boost > 0 ? 48 : 0;
      const lowFuelPenalty = state.fuel <= 0 ? -38 : 0;
      const kmPerSecond = Math.max(28, 72 + engineBonus + boostBonus + lowFuelPenalty + state.visitedPorts * 3);

      state.distance += kmPerSecond * delta;
      state.routeDistance += kmPerSecond * delta;
    }

    function updateGame(delta) {
      if (!running || paused || portOpen || gameOver) return;

      makeParticles(delta);
      updateMovement(delta);
      updateDistance(delta);
      updateResources(delta);
      updateObjects(delta);

      spawnTimer += delta;
      weatherTimer += delta;
      eventTimer += delta;

      const spawnGap = Math.max(0.38, 0.88 - state.visitedPorts * 0.025 - state.distance * 0.000012);

      if (spawnTimer >= spawnGap) {
        spawnTimer = 0;
        spawnObject();

        if (Math.random() < 0.18 + state.visitedPorts * 0.01) {
          spawnObject();
        }
      }

      if (weatherTimer >= 17) {
        weatherTimer = 0;
        if (Math.random() < 0.5) {
          state.shield = 4.5;
          setMessage("기상 레이더 작동 · 4.5초 방어막 활성화");
        } else {
          objects.push({ lane: randomLane(), z: 0.02, type: "storm", hit: false, wobble: 0 });
          objects.push({ lane: randomLane(), z: 0.02, type: "storm", hit: false, wobble: 1 });
          setMessage("기상 경보 · 폭풍 구간 진입");
        }
      }

      if (eventTimer >= 24) {
        eventTimer = 0;
        triggerRouteEvent();
      }

      if (state.routeDistance >= state.portEvery) {
        arriveAtPort();
      }

      checkMissionProgress();
      checkGameOver();
      saveBest();
      updateHud();
    }

    function triggerRouteEvent() {
      const r = Math.random();

      if (r < 0.33) {
        const bonus = 170 + state.reputation * 50;
        state.cash += bonus;
        setMessage("해상 구조 지원 보상 +" + formatMoney(bonus).replace("$", "$"));
      } else if (r < 0.66) {
        state.fuel = clamp(state.fuel - 14, -20, 130);
        state.hull = clamp(state.hull - 8, -20, 130);
        setMessage("엔진 과열 · 연료 -14% · 선체 -8%");
      } else {
        state.shield = 5;
        setMessage("우호 항로 진입 · 5초 방어막 활성화");
      }
    }

    function generateContracts() {
      const currentPort = ports[state.portIndex % ports.length];

      return contractTemplates
        .slice()
        .sort(function() { return Math.random() - 0.5; })
        .slice(0, 3)
        .map(function(template, index) {
          const distanceBonus = state.visitedPorts * 45;
          const reward = template.reward + distanceBonus + Math.floor(Math.random() * 120);
          const risk = clamp(template.risk + state.visitedPorts * 0.025 - state.upgrades.navigation * 0.015, 0.1, 0.68);

          return {
            id: currentPort.name + "-" + template.type + "-" + index,
            type: template.type,
            icon: template.icon,
            reward: reward,
            risk: risk,
            weight: template.weight,
            note: template.note,
            from: currentPort.name,
            to: ports[(state.portIndex + 1 + index) % ports.length].name
          };
        });
    }

    function openPortPanel(isFirstPort, financialReport) {
      const port = ports[state.portIndex % ports.length];
      portOpen = true;
      paused = false;
      running = false;

      els.portPanel.className = "port-panel show";
      els.portTitle.textContent = isFirstPort ? "출발 항구 · " + port.name : "도착 항구 · " + port.name;

      let summary = "";

      if (financialReport) {
        summary =
          financialReport +
          " 현재 현금 " +
          formatMoney(state.cash) +
          ". 다음 계약을 선택하고 필요하면 업그레이드하세요.";
      } else {
        summary =
          port.name +
          "에서 출항 준비 중입니다. 계약 하나를 선택하면 다음 항구 도착 시 보상을 받을 수 있습니다.";
      }

      els.portSummary.textContent = summary;

      const contracts = generateContracts();
      els.contractGrid.innerHTML = "";

      contracts.forEach(function(contract) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-card";
        button.innerHTML =
          "<h3>" +
          contract.icon +
          " " +
          contract.type +
          "</h3>" +
          "<p>항로: " +
          contract.from +
          " → " +
          contract.to +
          "</p>" +
          "<p>보상: " +
          formatMoney(contract.reward) +
          "</p>" +
          "<p>위험도: " +
          Math.round(contract.risk * 100) +
          "% · 무게 " +
          contract.weight +
          "</p>" +
          "<p>" +
          contract.note +
          "</p>";

        button.addEventListener("click", function() {
          Array.from(document.querySelectorAll(".choice-card")).forEach(function(card) {
            card.classList.remove("active");
          });

          button.classList.add("active");
          state.contract = contract;
          state.contractSelected = true;
          updateHud();
          setMessage(contract.type + " 계약 선택 · 다음 항구 도착 시 보상 " + formatMoney(contract.reward));
        });

        els.contractGrid.appendChild(button);
      });

      renderUpgradeButtons();
      updateHud();
      render();
    }

    function renderUpgradeButtons() {
      const upgrades = [
        {
          key: "engine",
          label: "엔진 업그레이드",
          desc: "속도 증가, 연료 효율 개선",
          base: 420
        },
        {
          key: "hull",
          label: "선체 강화",
          desc: "암초·폭풍 피해 감소",
          base: 380
        },
        {
          key: "cargo",
          label: "화물창 확장",
          desc: "식량 소모 감소, 계약 안정성 증가",
          base: 360
        },
        {
          key: "navigation",
          label: "항법 장비",
          desc: "위험 이벤트 확률 감소",
          base: 410
        }
      ];

      els.upgradeRow.innerHTML = "";

      upgrades.forEach(function(upgrade) {
        const level = state.upgrades[upgrade.key];
        const cost = upgrade.base + level * 180;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "secondary";
        button.textContent = upgrade.label + " Lv." + level + " → Lv." + (level + 1) + " / " + formatMoney(cost);

        button.title = upgrade.desc;

        button.addEventListener("click", function() {
          if (state.cash < cost) {
            setMessage("현금이 부족합니다. 필요 금액 " + formatMoney(cost));
            return;
          }

          state.cash -= cost;
          state.upgrades[upgrade.key] += 1;
          setMessage(upgrade.label + " 완료 · " + upgrade.desc);
          renderUpgradeButtons();
          updateHud();
        });

        els.upgradeRow.appendChild(button);
      });
    }

    function arriveAtPort() {
      const port = ports[state.portIndex % ports.length];
      let report = "";
      let contractGain = 0;

      if (state.contract) {
        const conditionBonus = state.hull >= 70 ? Math.floor(state.contract.reward * 0.18) : 0;
        const delayPenalty = state.food <= 10 || state.fuel <= 10 ? Math.floor(state.contract.reward * 0.18) : 0;
        contractGain = state.contract.reward + conditionBonus - delayPenalty;
        state.cash += contractGain;
        state.contractDelivered += 1;

        report +=
          state.contract.icon +
          " " +
          state.contract.type +
          " 계약 정산 " +
          formatMoney(contractGain) +
          ". ";

        state.contract = null;
        state.contractSelected = false;
      } else {
        report += "계약 없이 도착했습니다. ";
      }

      const fee = port.fee + state.visitedPorts * 18;
      const foodCost = port.food;
      const dockingCost = fee + foodCost;

      state.cash -= dockingCost;
      state.fuel = clamp(state.fuel + port.fuel, 0, 130);
      state.food = clamp(state.food + 42, 0, 130);
      state.hull = clamp(state.hull + 12, 0, 130);
      state.visitedPorts += 1;
      state.day += 1;
      state.portIndex = (state.portIndex + 1) % ports.length;
      state.routeDistance = 0;
      state.portEvery = 1550 + state.visitedPorts * 165;
      state.combo = 0;

      report +=
        "항구 비용 " +
        formatMoney(dockingCost) +
        " 차감. 연료와 식량을 일부 보급했습니다.";

      checkMissionProgress();
      updateHud();
      openPortPanel(false, report);
      checkGameOver();
    }

    function departPort() {
      if (!state.contractSelected) {
        setMessage("출항 전에 계약 하나를 선택하는 것이 좋습니다. 그래도 출항하려면 계약 없이 한 번 더 누르세요.");
        state.contractSelected = true;
        return;
      }

      els.portPanel.className = "port-panel";
      portOpen = false;
      running = true;
      paused = false;
      lastTime = 0;
      spawnTimer = 0;
      objects = [];
      setMessage("출항했습니다. 화물·연료·식량은 모으고, 암초·폭풍·해적·세관은 피하세요.");
      updateHud();
    }

    function restock() {
      const cost = 180;

      if (!state || state.cash < cost) {
        setMessage("보급 비용이 부족합니다. 필요 금액 " + formatMoney(cost));
        return;
      }

      state.cash -= cost;
      state.fuel = clamp(state.fuel + 35, 0, 130);
      state.food = clamp(state.food + 35, 0, 130);
      setMessage("연료·식량 보급 완료 · " + formatMoney(cost) + " 사용");
      updateHud();
    }

    function emergencyRepair() {
      if (!state || gameOver) return;

      const cost = 220;

      if (state.cash < cost) {
        setMessage("긴급 수리 비용이 부족합니다. 필요 금액 " + formatMoney(cost));
        return;
      }

      state.cash -= cost;
      state.hull = clamp(state.hull + 28, 0, 130);
      setMessage("긴급 수리 완료 · 선체 +28%");
      updateHud();
    }

    function checkGameOver() {
      if (!state || gameOver) return;

      if (state.hull <= 0) {
        endGame("선체가 파손되어 항해가 종료되었습니다.");
        return;
      }

      if (state.cash <= -250) {
        endGame("운영 자금이 부족해 항해가 종료되었습니다.");
        return;
      }

      if (state.fuel <= -15) {
        endGame("연료가 완전히 고갈되어 항해가 종료되었습니다.");
        return;
      }

      if (state.food <= -15) {
        endGame("식량이 완전히 고갈되어 항해가 종료되었습니다.");
      }
    }

    function startGame() {
      state = defaultState();
      objects = [];
      particles = [];
      running = false;
      paused = false;
      portOpen = false;
      gameOver = false;
      lastTime = 0;
      spawnTimer = 0;
      weatherTimer = 0;
      eventTimer = 0;

      setMessage("새 항해 시작 · 첫 계약을 선택하고 출항하세요.");
      updateHud();
      openPortPanel(true, null);
    }

    function endGame(message) {
      gameOver = true;
      running = false;
      paused = false;
      portOpen = false;
      els.portPanel.className = "port-panel";
      saveBest();
      updateHud();

      const finalDistance = Math.floor(state.distance).toLocaleString("ko-KR");
      setMessage(message + " 최종 거리 " + finalDistance + " km · 방문 항구 " + state.visitedPorts + "곳");
    }

    function moveLeft() {
      if (!state || gameOver || portOpen) return;
      state.lane = Math.max(-2, state.lane - 1);
    }

    function moveRight() {
      if (!state || gameOver || portOpen) return;
      state.lane = Math.min(2, state.lane + 1);
    }

    function useBoost() {
      if (!state || gameOver || portOpen) return;

      if (state.fuel <= 4) {
        setMessage("연료가 부족해서 부스트를 사용할 수 없습니다.");
        return;
      }

      state.boost = Math.max(state.boost, 2.5);
      state.fuel -= 4;
      setMessage("부스트 사용 · 연료 -4%");
      updateHud();
    }

    function togglePause() {
      if (!state || gameOver || portOpen) return;

      paused = !paused;
      setMessage(paused ? "일시정지되었습니다." : "항해를 재개했습니다.");
      render();
    }

    function copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(function() {
          return true;
        });
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();

      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);

      return Promise.resolve(copied);
    }

    async function shareGame() {
      const distance = state ? Math.floor(state.distance) : loadBest();
      const url = "https://datlora.com/world-voyage";
      const text =
        "Datlora World Voyage 3D에서 " +
        distance.toLocaleString("ko-KR") +
        " km 항해했습니다. 세계 항로 캐주얼 게임을 플레이해보세요: " +
        url;

      els.shareStatus.textContent = "공유 준비 중입니다.";

      try {
        if (navigator.share) {
          await navigator.share({
            title: "Datlora World Voyage 3D",
            text: text.replace(": " + url, ""),
            url: url
          });

          els.shareStatus.textContent = "공유 창을 열었습니다.";
          return;
        }

        await copyToClipboard(text);
        els.shareStatus.textContent = "공유 문구가 복사되었습니다.";
      } catch {
        els.shareStatus.textContent = "공유가 취소되었거나 복사되지 않았습니다.";
      }
    }

    function loop(timestamp) {
      if (!lastTime) lastTime = timestamp;

      const delta = Math.min(0.045, (timestamp - lastTime) / 1000);
      lastTime = timestamp;

      if (state) {
        updateGame(delta);
        render();
      }

      window.requestAnimationFrame(loop);
    }

    window.addEventListener("resize", function() {
      resizeCanvas();
      render();
    });

    window.addEventListener("keydown", function(event) {
      const key = event.key.toLowerCase();

      if (key === "arrowleft" || key === "a") {
        moveLeft();
      }

      if (key === "arrowright" || key === "d") {
        moveRight();
      }

      if (key === "arrowup" || key === "w" || key === " ") {
        event.preventDefault();
        useBoost();
      }

      if (key === "p") {
        togglePause();
      }

      if (key === "r") {
        emergencyRepair();
      }
    });

    document.getElementById("start-button").addEventListener("click", startGame);
    document.getElementById("pause-button").addEventListener("click", togglePause);
    document.getElementById("boost-button").addEventListener("click", useBoost);
    document.getElementById("repair-button").addEventListener("click", emergencyRepair);
    document.getElementById("share-button").addEventListener("click", shareGame);
    document.getElementById("left-button").addEventListener("click", moveLeft);
    document.getElementById("right-button").addEventListener("click", moveRight);
    document.getElementById("mobile-boost-button").addEventListener("click", useBoost);
    document.getElementById("depart-button").addEventListener("click", departPort);
    document.getElementById("restock-button").addEventListener("click", restock);

    resizeCanvas();
    state = defaultState();
    updateHud();
    render();
    window.requestAnimationFrame(loop);
  </script>
</body>
</html>`;
}

export async function GET() {
  return new NextResponse(html(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
