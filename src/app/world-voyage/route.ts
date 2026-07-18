import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function html() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>World Voyage 3D | Datlora</title>
  <meta name="description" content="Datlora World Voyage 3D는 세계 항로를 이동하며 계약, 수익, 연료, 식량, 선체, 위험 아이템을 관리하는 3D 느낌의 항해 게임입니다." />
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 12% 12%, rgba(34,211,238,.16), transparent 28%),
        radial-gradient(circle at 84% 16%, rgba(52,211,153,.12), transparent 30%),
        radial-gradient(circle at 50% 100%, rgba(59,130,246,.10), transparent 36%),
        #04101d;
      overflow-x: hidden;
    }

    .site-nav {
      position: sticky;
      top: 0;
      z-index: 60;
      border-bottom: 1px solid rgba(255,255,255,.08);
      background: rgba(4,16,29,.86);
      backdrop-filter: blur(14px);
    }

    .site-nav-inner {
      max-width: 1240px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
    }

    .site-brand {
      color: #fff;
      text-decoration: none;
      font-size: 17px;
      font-weight: 900;
    }

    .site-menu {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }

    .site-menu a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 14px;
      font-weight: 760;
    }

    main {
      max-width: 1240px;
      margin: 0 auto;
      padding: 48px 24px 80px;
    }

    .label {
      margin: 0;
      color: #67e8f9;
      font-size: 13px;
      font-weight: 950;
      letter-spacing: .22em;
      text-transform: uppercase;
    }

    h1 {
      margin: 18px 0 14px;
      font-size: clamp(42px, 7vw, 82px);
      line-height: 1.02;
      letter-spacing: -0.07em;
      max-width: 1000px;
    }

    .intro {
      max-width: 860px;
      margin: 0;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.72;
    }

    .hud {
      margin-top: 26px;
      display: grid;
      grid-template-columns: repeat(8, minmax(0, 1fr));
      gap: 10px;
    }

    .hud-card {
      border: 1px solid rgba(255,255,255,.09);
      background:
        linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.03)),
        rgba(255,255,255,.04);
      border-radius: 18px;
      padding: 12px;
      min-height: 76px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
    }

    .hud-card p {
      margin: 0;
      font-size: 11px;
      font-weight: 850;
      color: #94a3b8;
    }

    .hud-card strong {
      display: block;
      margin-top: 7px;
      font-size: 20px;
      font-weight: 900;
      color: white;
      letter-spacing: -0.04em;
      white-space: nowrap;
    }

    .game-shell {
      margin-top: 24px;
      border: 1px solid rgba(255,255,255,.10);
      background:
        linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.025)),
        rgba(255,255,255,.03);
      border-radius: 32px;
      padding: 22px;
      box-shadow: 0 28px 90px rgba(0,0,0,.38);
    }

    .top-tools {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
      align-items: center;
    }

    button,
    .link-button {
      border: 0;
      border-radius: 15px;
      padding: 12px 15px;
      font-size: 14px;
      font-weight: 900;
      cursor: pointer;
      text-decoration: none;
    }

    .primary {
      background: #34d399;
      color: #04130d;
    }

    .secondary {
      background: #0a1628;
      color: #e2e8f0;
      border: 1px solid rgba(255,255,255,.1);
    }

    .danger {
      background: rgba(239,68,68,.12);
      color: #fecaca;
      border: 1px solid rgba(248,113,113,.25);
    }

    .canvas-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 16px;
      align-items: start;
    }

    .canvas-wrap {
      position: relative;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 28px;
      overflow: hidden;
      background: #06111f;
      min-height: 580px;
    }

    canvas {
      display: block;
      width: 100%;
      height: 580px;
      touch-action: none;
    }

    .overlay {
      position: absolute;
      left: 16px;
      right: 16px;
      top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      pointer-events: none;
    }

    .chip-stack {
      display: grid;
      gap: 8px;
      max-width: 66%;
    }

    .floating-chip {
      width: fit-content;
      max-width: 100%;
      padding: 10px 12px;
      border-radius: 16px;
      background: rgba(2,6,23,.66);
      border: 1px solid rgba(255,255,255,.1);
      color: #e2e8f0;
      font-size: 13px;
      font-weight: 830;
      line-height: 1.45;
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 24px rgba(0,0,0,.24);
    }

    .mission-chip {
      background: rgba(6,95,70,.58);
      border-color: rgba(52,211,153,.28);
      color: #d1fae5;
    }

    .message-chip {
      background: rgba(15,23,42,.7);
      color: #e2e8f0;
    }

    .compact-help {
      width: fit-content;
      padding: 10px 12px;
      border-radius: 16px;
      background: rgba(8,20,35,.72);
      border: 1px solid rgba(255,255,255,.1);
      color: #cbd5e1;
      font-size: 12px;
      font-weight: 800;
      line-height: 1.45;
      backdrop-filter: blur(10px);
    }

    .side-panel {
      display: grid;
      gap: 14px;
    }

    .panel-box {
      border: 1px solid rgba(255,255,255,.1);
      background:
        linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.025)),
        rgba(255,255,255,.03);
      border-radius: 22px;
      padding: 16px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
    }

    .panel-box h2,
    .panel-box h3 {
      margin: 0;
      font-size: 17px;
      letter-spacing: -0.03em;
    }

    .panel-box p {
      margin: 8px 0 0;
      color: #cbd5e1;
      font-size: 13px;
      line-height: 1.55;
    }

    .legend-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    .legend-tab {
      padding: 9px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.04);
      color: #e2e8f0;
      font-size: 12px;
      font-weight: 900;
      cursor: pointer;
    }

    .legend-tab.active {
      background: rgba(34,197,94,.14);
      border-color: rgba(74,222,128,.35);
      color: #dcfce7;
    }

    .legend-list {
      display: grid;
      gap: 10px;
      margin-top: 14px;
    }

    .legend-row {
      display: grid;
      grid-template-columns: 38px 1fr;
      gap: 10px;
      align-items: start;
      padding: 10px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
      border-radius: 14px;
    }

    .legend-icon {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-size: 18px;
      font-weight: 900;
      color: white;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
    }

    .legend-text strong {
      display: block;
      font-size: 13px;
      color: white;
    }

    .legend-text span {
      display: block;
      margin-top: 3px;
      font-size: 12px;
      line-height: 1.45;
      color: #cbd5e1;
    }

    .status-line {
      margin-top: 2px;
      min-height: 20px;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 760;
      line-height: 1.5;
    }

    .mini-controls {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }

    .mini-controls .key-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .key-chip {
      padding: 7px 10px;
      border-radius: 10px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      color: #e2e8f0;
      font-size: 12px;
      font-weight: 860;
    }

    .port-panel {
      display: none;
      margin-top: 16px;
      border: 1px solid rgba(125,211,252,.16);
      background:
        radial-gradient(circle at 15% 18%, rgba(14,165,233,.16), transparent 28%),
        rgba(9,19,34,.82);
      border-radius: 24px;
      padding: 20px;
    }

    .port-panel.show {
      display: block;
    }

    .port-panel h2 {
      margin: 0 0 8px;
      font-size: 28px;
      letter-spacing: -0.04em;
    }

    .port-panel p {
      margin: 8px 0;
      color: #cbd5e1;
      font-size: 14px;
      line-height: 1.6;
    }

    .choice-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 16px;
    }

    .choice-card {
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.045);
      color: #fff;
      border-radius: 18px;
      padding: 15px;
      text-align: left;
      cursor: pointer;
      min-height: 148px;
    }

    .choice-card:hover {
      border-color: rgba(52,211,153,.4);
      background: rgba(52,211,153,.08);
    }

    .choice-card.active {
      border-color: rgba(52,211,153,.6);
      background: rgba(16,185,129,.12);
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
      line-height: 1.5;
    }

    .upgrade-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }

    .note {
      margin-top: 22px;
      border: 1px solid rgba(251,191,36,.2);
      background: rgba(251,191,36,.08);
      color: #fef3c7;
      border-radius: 20px;
      padding: 16px;
      line-height: 1.65;
      font-size: 14px;
    }

    @media (max-width: 1150px) {
      .canvas-grid {
        grid-template-columns: 1fr;
      }

      .side-panel {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .hud {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    @media (max-width: 760px) {
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
        padding: 8px 10px;
        background: rgba(255,255,255,.03);
        font-size: 12px;
      }

      .hud {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .side-panel {
        grid-template-columns: 1fr;
      }

      .choice-grid {
        grid-template-columns: 1fr;
      }

      canvas {
        height: 480px;
      }

      .canvas-wrap {
        min-height: 480px;
      }

      .chip-stack {
        max-width: 100%;
      }

      .overlay {
        flex-direction: column;
      }

      .compact-help {
        width: 100%;
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
    <h1>덜 읽고, 더 플레이하는 항해 게임으로 바꿉니다.</h1>
    <p class="intro">
      계약을 싣고 항로를 바꾸며 세계를 항해하세요. 연료, 식량, 선체, 현금을 관리하고, 좋은 아이템은 챙기고 위험 아이템은 피하세요.
      설명은 줄이고, 대신 오른쪽에 한눈에 보이는 안내 패널을 넣었습니다.
    </p>

    <section class="hud">
      <div class="hud-card">
        <p>현금</p>
        <strong id="cash">$0</strong>
      </div>
      <div class="hud-card">
        <p>연료</p>
        <strong id="fuel">0%</strong>
      </div>
      <div class="hud-card">
        <p>식량</p>
        <strong id="food">0%</strong>
      </div>
      <div class="hud-card">
        <p>선체</p>
        <strong id="hull">0%</strong>
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
      <div class="top-tools">
        <button class="primary" type="button" id="start-button">새 항해 시작</button>
        <button class="secondary" type="button" id="pause-button">일시정지</button>
        <button class="secondary" type="button" id="boost-button">부스트</button>
        <button class="secondary" type="button" id="repair-button">긴급 수리 $220</button>
        <button class="secondary" type="button" id="help-button">도움말 토글</button>
        <button class="secondary" type="button" id="share-button">기록 공유</button>
      </div>

      <div class="canvas-grid">
        <div>
          <div class="canvas-wrap">
            <canvas id="game" aria-label="World Voyage 3D canvas"></canvas>

            <div class="overlay">
              <div class="chip-stack">
                <div class="floating-chip mission-chip" id="mission-chip">미션: 출발 항구에서 계약을 선택하세요.</div>
                <div class="floating-chip message-chip" id="message-chip">게임 시작을 누르면 항구 화면이 열립니다.</div>
              </div>

              <div class="compact-help">
                <div><strong>빠른 조작</strong></div>
                <div>← → 이동 · Space/W/↑ 부스트 · P 일시정지 · R 수리</div>
              </div>
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
        </div>

        <aside class="side-panel" id="help-panel">
          <section class="panel-box">
            <h2>아이템 안내</h2>
            <p>이 화면은 게임 중 계속 볼 수 있는 간단한 안내판이야. 긍정 / 위험 / 특수 아이템을 나눠서 보여준다.</p>

            <div class="legend-tabs">
              <button class="legend-tab active" type="button" data-tab="good">플러스</button>
              <button class="legend-tab" type="button" data-tab="bad">마이너스</button>
              <button class="legend-tab" type="button" data-tab="special">부스터</button>
            </div>

            <div class="legend-list" id="legend-list"></div>
          </section>

          <section class="panel-box">
            <h3>기본 규칙</h3>
            <div class="mini-controls">
              <div class="key-row">
                <span class="key-chip">계약 선택 → 출항 → 다음 항구 도착</span>
              </div>
              <div class="key-row">
                <span class="key-chip">좋은 아이템은 획득</span>
                <span class="key-chip">위험 아이템은 회피</span>
              </div>
              <div class="key-row">
                <span class="key-chip">현금 / 연료 / 식량 / 선체 모두 중요</span>
              </div>
            </div>
            <p id="share-status" class="status-line"></p>
          </section>
        </aside>
      </div>
    </section>

    <section class="note">
      World Voyage 3D는 Datlora의 무역·항로·비용 관리 콘셉트를 바탕으로 만든 캐주얼 게임입니다.
      공식 통계 수치 확인은 국가 상세 페이지와 주제별 통계 페이지를 사용하세요.
    </section>
  </main>

  <script>
    const STORAGE_KEY = "datlora.worldvoyage.cleaner.v1";

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
      missionChip: document.getElementById("mission-chip"),
      messageChip: document.getElementById("message-chip"),
      portPanel: document.getElementById("port-panel"),
      portTitle: document.getElementById("port-title"),
      portSummary: document.getElementById("port-summary"),
      contractGrid: document.getElementById("contract-grid"),
      upgradeRow: document.getElementById("upgrade-row"),
      shareStatus: document.getElementById("share-status"),
      legendList: document.getElementById("legend-list"),
      helpPanel: document.getElementById("help-panel")
    };

    const legendData = {
      good: [
        { icon: "$", title: "보너스 수익", desc: "현금을 즉시 얻습니다.", color: "#22c55e" },
        { icon: "⛽", title: "연료 드럼", desc: "연료가 회복됩니다.", color: "#3b82f6" },
        { icon: "🍱", title: "식량 상자", desc: "식량이 회복됩니다.", color: "#eab308" },
        { icon: "🔧", title: "수리 키트", desc: "선체가 회복됩니다.", color: "#8b5cf6" },
        { icon: "📦", title: "부유 화물", desc: "추가 계약 수익을 얻습니다.", color: "#16a34a" }
      ],
      bad: [
        { icon: "🛃", title: "세관 검사", desc: "현금이 감소합니다.", color: "#f97316" },
        { icon: "⛔", title: "통행료", desc: "현금이 감소합니다.", color: "#fb923c" },
        { icon: "▲", title: "암초", desc: "선체 내구도가 감소합니다.", color: "#f43f5e" },
        { icon: "☁", title: "폭풍", desc: "선체와 연료가 함께 줄 수 있습니다.", color: "#818cf8" },
        { icon: "☠", title: "해적선", desc: "현금과 선체가 함께 감소합니다.", color: "#ef4444" }
      ],
      special: [
        { icon: "➤", title: "해류 부스트", desc: "짧은 시간 속도가 증가합니다.", color: "#06b6d4" },
        { icon: "🪪", title: "통행 허가증", desc: "세관/통행료를 1회 방어합니다.", color: "#22d3ee" },
        { icon: "부", title: "부스트 버튼", desc: "직접 사용하면 속도가 증가하지만 연료를 소모합니다.", color: "#34d399" },
        { icon: "수", title: "긴급 수리", desc: "현금을 내고 선체를 빠르게 회복합니다.", color: "#f59e0b" }
      ]
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
      coin: { label: "보너스 수익", icon: "$", color: "#22c55e", kind: "good" },
      fuel: { label: "연료 드럼", icon: "⛽", color: "#3b82f6", kind: "good" },
      food: { label: "식량 상자", icon: "🍱", color: "#eab308", kind: "good" },
      repair: { label: "수리 키트", icon: "🔧", color: "#8b5cf6", kind: "good" },
      permit: { label: "통행 허가증", icon: "🪪", color: "#22d3ee", kind: "special" },
      current: { label: "해류 부스트", icon: "➤", color: "#06b6d4", kind: "special" },
      customs: { label: "세관 검사", icon: "🛃", color: "#f97316", kind: "bad" },
      toll: { label: "통행료", icon: "⛔", color: "#fb923c", kind: "bad" },
      reef: { label: "암초", icon: "▲", color: "#f43f5e", kind: "bad" },
      storm: { label: "폭풍", icon: "☁", color: "#818cf8", kind: "bad" },
      pirate: { label: "해적선", icon: "☠", color: "#ef4444", kind: "bad" },
      crate: { label: "부유 화물", icon: "📦", color: "#16a34a", kind: "good" }
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
    let legendTab = "good";

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
        boost: 0,
        shield: 0,
        permits: 0,
        contract: null,
        contractSelected: false,
        contractDelivered: 0,
        upgrades: {
          engine: 1,
          hull: 1,
          cargo: 1,
          navigation: 1
        },
        missionStage: 1,
        combo: 0,
        invulnerable: 0
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
      els.messageChip.textContent = message;
    }

    function setMission(message) {
      els.missionChip.textContent = message;
    }

    function renderLegend() {
      const data = legendData[legendTab] || [];
      els.legendList.innerHTML = "";

      data.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "legend-row";
        row.innerHTML =
          '<div class="legend-icon" style="background:' + item.color + ';">' + item.icon + '</div>' +
          '<div class="legend-text">' +
          '<strong>' + item.title + '</strong>' +
          '<span>' + item.desc + '</span>' +
          '</div>';
        els.legendList.appendChild(row);
      });

      document.querySelectorAll(".legend-tab").forEach(function(button) {
        if (button.getAttribute("data-tab") === legendTab) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      });
    }

    function updateMissionByState() {
      if (!state) {
        setMission("미션: 게임을 시작하세요.");
        return;
      }

      if (state.missionStage === 1) {
        setMission("미션: 계약을 싣고 첫 항구에 도착하세요.");
      } else if (state.missionStage === 2) {
        setMission("미션: 항구 3곳 방문 + 현금 $2,000 이상.");
      } else if (state.missionStage === 3) {
        setMission("미션: 선체 50% 이상으로 7,000 km 돌파.");
      } else {
        setMission("엔드리스 항해: 더 멀리 가고 더 큰 기록을 만드세요.");
      }
    }

    function checkMissionProgress() {
      if (!state) return;

      if (state.missionStage === 1 && state.visitedPorts >= 1 && state.contractDelivered >= 1) {
        state.cash += 350;
        state.missionStage = 2;
        setMessage("미션 1 완료 · 보너스 $350");
      }

      if (state.missionStage === 2 && state.visitedPorts >= 3 && state.cash >= 2000) {
        state.cash += 600;
        state.missionStage = 3;
        setMessage("미션 2 완료 · 보너스 $600");
      }

      if (state.missionStage === 3 && state.distance >= 7000 && state.hull >= 50) {
        state.cash += 900;
        state.missionStage = 4;
        setMessage("미션 3 완료 · 보너스 $900");
      }

      updateMissionByState();
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
      updateMissionByState();
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
      const scale = 0.2 + z * 1.75;
      return { x, y, scale };
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

    function drawSeaBackground() {
      const w = width();
      const h = height();

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#081625");
      sky.addColorStop(0.4, "#0a3e5c");
      sky.addColorStop(1, "#09304a");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(255,255,255,.92)";
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.12, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,.06)";
      for (let i = 0; i < 20; i += 1) {
        const cx = (i * 132 - state.distance * 0.08) % (w + 180) - 90;
        const cy = h * 0.1 + (i % 4) * 28;
        roundRect(cx, cy, 90, 16, 10);
        ctx.fill();
      }

      const horizon = h * 0.18;

      ctx.fillStyle = "rgba(14,165,233,.24)";
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 48, horizon);
      ctx.lineTo(w * 0.5 + 48, horizon);
      ctx.lineTo(w * 0.98, h * 0.98);
      ctx.lineTo(w * 0.02, h * 0.98);
      ctx.closePath();
      ctx.fill();

      const islandPositions = [0.08, 0.18, 0.82, 0.92];
      islandPositions.forEach(function(pos, index) {
        const x = w * pos + Math.sin(state.distance * 0.0005 + index) * 10;
        const y = h * (0.27 + (index % 2) * 0.05);

        ctx.fillStyle = "rgba(15,118,110,.35)";
        ctx.beginPath();
        ctx.ellipse(x, y, 48, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(22,163,74,.42)";
        ctx.beginPath();
        ctx.moveTo(x - 6, y - 12);
        ctx.lineTo(x + 6, y - 42);
        ctx.lineTo(x + 16, y - 8);
        ctx.closePath();
        ctx.fill();
      });

      for (let i = 0; i < 22; i += 1) {
        const z = ((i * 0.065 + state.distance * 0.0016) % 1);
        const left = project(-2.6, z);
        const right = project(2.6, z);

        ctx.strokeStyle = "rgba(255,255,255," + (0.04 + z * 0.17) + ")";
        ctx.lineWidth = 1 + z * 2.2;
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
      }

      [-2, -1, 0, 1, 2].forEach(function(lane) {
        const near = project(lane, 1);
        const far = project(lane, 0.02);
        ctx.strokeStyle = lane === 0 ? "rgba(186,230,253,.35)" : "rgba(186,230,253,.2)";
        ctx.lineWidth = lane === 0 ? 2.3 : 1.5;
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
      ctx.translate(p.x, p.y - 44 * p.scale);

      ctx.fillStyle = "rgba(15,23,42,.78)";
      ctx.strokeStyle = nextPort.theme;
      ctx.lineWidth = 2;
      const boxW = 186 * p.scale;
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

    function draw3DItem(item) {
      const p = project(item.lane, item.z);
      const meta = objectTypes[item.type];
      const size = 26 * p.scale;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = item.hit ? 0.3 : 1;
      ctx.shadowBlur = 20 * p.scale;
      ctx.shadowColor = meta.color;

      if (meta.kind === "bad") {
        ctx.fillStyle = "rgba(17,24,39,.92)";
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-size * 0.52, size * 0.45);
        ctx.lineTo(0, -size * 0.72);
        ctx.lineTo(size * 0.52, size * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        const grad = ctx.createLinearGradient(-size, -size, size, size);
        grad.addColorStop(0, "rgba(255,255,255,.16)");
        grad.addColorStop(1, meta.color);

        ctx.fillStyle = "rgba(11,18,32,.9)";
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 2.2;
        roundRect(-size / 2, -size / 2, size, size, 12 * p.scale);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = grad;
        roundRect(-size * 0.32, -size * 0.28, size * 0.64, size * 0.2, 8 * p.scale);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.font = Math.max(14, 22 * p.scale) + "px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.fillText(meta.icon, 0, -1 * p.scale);

      ctx.restore();
    }

    function drawShip() {
      const p = project(state.visualLane, 0.93);
      const bob = Math.sin(performance.now() * 0.0058) * 4;
      const tilt = (state.visualLane - state.lane) * -0.12 + state.laneTilt;
      const glow = state.boost > 0 ? "#67e8f9" : state.shield > 0 ? "#22d3ee" : "#60a5fa";

      ctx.save();
      ctx.translate(p.x, p.y + bob);
      ctx.rotate(tilt);

      const s = 1.08 * p.scale;

      ctx.shadowBlur = 22;
      ctx.shadowColor = glow;

      ctx.fillStyle = "rgba(15,23,42,.46)";
      ctx.beginPath();
      ctx.ellipse(0, 30 * s, 58 * s, 14 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      const hullGrad = ctx.createLinearGradient(0, -30 * s, 0, 34 * s);
      hullGrad.addColorStop(0, "#1e3a5f");
      hullGrad.addColorStop(1, "#0f172a");

      ctx.fillStyle = hullGrad;
      ctx.strokeStyle = "#93c5fd";
      ctx.lineWidth = 2 * s;

      ctx.beginPath();
      ctx.moveTo(-48 * s, 10 * s);
      ctx.quadraticCurveTo(-22 * s, 40 * s, 0, 40 * s);
      ctx.quadraticCurveTo(28 * s, 38 * s, 52 * s, 8 * s);
      ctx.lineTo(36 * s, 18 * s);
      ctx.lineTo(-34 * s, 18 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#e2e8f0";
      roundRect(-16 * s, -10 * s, 32 * s, 18 * s, 6 * s);
      ctx.fill();

      ctx.strokeStyle = "#dbeafe";
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(0, 18 * s);
      ctx.lineTo(0, -60 * s);
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(4 * s, -54 * s);
      ctx.lineTo(44 * s, -12 * s);
      ctx.lineTo(4 * s, 8 * s);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#bae6fd";
      ctx.beginPath();
      ctx.moveTo(-4 * s, -48 * s);
      ctx.lineTo(-34 * s, -12 * s);
      ctx.lineTo(-4 * s, 6 * s);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(0, 0, 6 * s, 0, Math.PI * 2);
      ctx.fill();

      if (state.boost > 0) {
        ctx.fillStyle = "rgba(103,232,249,.85)";
        ctx.beginPath();
        ctx.moveTo(-16 * s, 34 * s);
        ctx.lineTo(0, 66 * s);
        ctx.lineTo(16 * s, 34 * s);
        ctx.closePath();
        ctx.fill();
      }

      if (state.shield > 0) {
        ctx.strokeStyle = "rgba(34,211,238,.56)";
        ctx.lineWidth = 3 * s;
        ctx.beginPath();
        ctx.arc(0, -4 * s, 70 * s, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawOverlayState() {
      if (running && !paused && !portOpen && !gameOver) return;

      ctx.save();
      ctx.fillStyle = "rgba(2,6,23,.38)";
      ctx.fillRect(0, 0, width(), height());

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.font = "900 34px system-ui";

      let title = "Ready";
      if (portOpen) title = "Docked";
      if (paused) title = "Paused";
      if (gameOver) title = "Voyage Over";

      ctx.fillText(title, width() / 2, height() / 2 - 24);

      ctx.font = "760 15px system-ui";
      ctx.fillStyle = "#cbd5e1";

      let sub = "새 항해 시작을 눌러 항구 화면으로 이동하세요.";
      if (portOpen) sub = "계약과 업그레이드를 선택한 뒤 출항하세요.";
      if (paused) sub = "P 또는 일시정지 버튼으로 다시 시작할 수 있습니다.";
      if (gameOver) sub = "새 항해 시작을 눌러 다시 도전하세요.";

      ctx.fillText(sub, width() / 2, height() / 2 + 14);
      ctx.restore();
    }

    function render() {
      if (!state) return;

      drawSeaBackground();
      drawRouteMarker();

      objects.slice().sort(function(a, b) {
        return a.z - b.z;
      }).forEach(draw3DItem);

      drawShip();
      drawOverlayState();
    }

    function makeParticles(delta) {
      const w = width();
      const h = height();

      if (particles.length < 80) {
        for (let i = 0; i < 3; i += 1) {
          particles.push({
            x: Math.random() * w,
            y: h * (0.28 + Math.random() * 0.68),
            r: 1 + Math.random() * 2.2,
            alpha: 0.08 + Math.random() * 0.18,
            speed: 18 + Math.random() * 40
          });
        }
      }

      particles.forEach(function(p) {
        p.x -= p.speed * delta;
        if (p.x < -15) {
          p.x = w + 15;
          p.y = h * (0.28 + Math.random() * 0.68);
        }
      });
    }

    function randomLane() {
      return [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
    }

    function randomObjectType() {
      const risk = state.contract ? state.contract.risk : 0.2;
      const navigationBonus = state.upgrades.navigation * 0.025;
      const dangerChance = clamp(0.32 + risk * 0.34 - navigationBonus, 0.22, 0.52);
      const r = Math.random();

      if (r > dangerChance) {
        const good = ["coin", "fuel", "food", "repair", "permit", "current", "crate"];
        return good[Math.floor(Math.random() * good.length)];
      }

      const bad = ["customs", "toll", "reef", "storm", "pirate"];
      return bad[Math.floor(Math.random() * bad.length)];
    }

    function spawnObject() {
      objects.push({
        lane: randomLane(),
        z: 0.02,
        type: randomObjectType(),
        hit: false
      });
    }

    function applyGoodItem(type) {
      if (type === "coin") {
        const amount = 80 + state.combo * 10;
        state.cash += amount;
        state.combo += 1;
        setMessage("수익 +" + formatMoney(amount));
      }

      if (type === "crate") {
        const amount = state.contract ? 130 + state.contract.weight * 40 : 120;
        state.cash += amount;
        setMessage("부유 화물 +" + formatMoney(amount));
      }

      if (type === "fuel") {
        state.fuel = clamp(state.fuel + 22 + state.upgrades.engine * 3, 0, 130);
        setMessage("연료 회복");
      }

      if (type === "food") {
        state.food = clamp(state.food + 20, 0, 130);
        setMessage("식량 회복");
      }

      if (type === "repair") {
        state.hull = clamp(state.hull + 18 + state.upgrades.hull * 2, 0, 130);
        setMessage("선체 회복");
      }

      if (type === "permit") {
        state.permits += 1;
        setMessage("허가증 획득");
      }

      if (type === "current") {
        state.boost = Math.max(state.boost, 3.1);
        setMessage("해류 부스트");
      }
    }

    function applyBadItem(type) {
      if (state.invulnerable > 0 || state.shield > 0) {
        if (state.shield > 0) state.shield = 0;
        state.invulnerable = 0.9;
        setMessage("방어 성공");
        return;
      }

      if ((type === "customs" || type === "toll") && state.permits > 0) {
        state.permits -= 1;
        state.invulnerable = 0.8;
        setMessage("허가증 사용");
        return;
      }

      state.combo = 0;

      if (type === "customs") {
        const cost = Math.floor(115 + (state.contract ? state.contract.risk * 180 : 0));
        state.cash -= cost;
        setMessage("세관 -" + formatMoney(cost));
      }

      if (type === "toll") {
        const cost = 95 + state.visitedPorts * 12;
        state.cash -= cost;
        setMessage("통행료 -" + formatMoney(cost));
      }

      if (type === "reef") {
        const damage = Math.max(10, 26 - state.upgrades.hull * 3);
        state.hull -= damage;
        setMessage("암초 · 선체 -" + damage + "%");
      }

      if (type === "storm") {
        const damage = Math.max(12, 30 - state.upgrades.navigation * 3);
        state.hull -= damage;
        state.fuel -= 10;
        setMessage("폭풍 · 선체 -" + damage + "%");
      }

      if (type === "pirate") {
        const loss = 160 + Math.floor(Math.random() * 100);
        state.cash -= loss;
        state.hull -= 16;
        setMessage("해적 · 현금/선체 감소");
      }

      state.invulnerable = 1;
    }

    function handleHit(item) {
      if (item.hit) return;
      item.hit = true;

      const info = objectTypes[item.type];
      if (info.kind === "good" || info.kind === "special") {
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

    function triggerRouteEvent() {
      const r = Math.random();
      if (r < 0.33) {
        const bonus = 170;
        state.cash += bonus;
        setMessage("해상 보상 +" + formatMoney(bonus));
      } else if (r < 0.66) {
        state.fuel -= 14;
        state.hull -= 8;
        setMessage("엔진 과열");
      } else {
        state.shield = 5;
        setMessage("방어막 활성화");
      }
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
          setMessage("기상 레이더 보호");
        } else {
          objects.push({ lane: randomLane(), z: 0.02, type: "storm", hit: false });
          objects.push({ lane: randomLane(), z: 0.02, type: "storm", hit: false });
          setMessage("폭풍 구간");
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

    function generateContracts() {
      const currentPort = ports[state.portIndex % ports.length];

      return contractTemplates
        .slice()
        .sort(function() {
          return Math.random() - 0.5;
        })
        .slice(0, 3)
        .map(function(template, index) {
          const reward = template.reward + state.visitedPorts * 45 + Math.floor(Math.random() * 120);
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

    function renderUpgradeButtons() {
      const upgrades = [
        { key: "engine", label: "엔진", desc: "속도 증가 / 연료 효율", base: 420 },
        { key: "hull", label: "선체", desc: "충돌 피해 감소", base: 380 },
        { key: "cargo", label: "화물창", desc: "식량 효율 상승", base: 360 },
        { key: "navigation", label: "항법 장비", desc: "위험도 감소", base: 410 }
      ];

      els.upgradeRow.innerHTML = "";

      upgrades.forEach(function(upgrade) {
        const level = state.upgrades[upgrade.key];
        const cost = upgrade.base + level * 180;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "secondary";
        button.textContent = upgrade.label + " Lv." + level + " → Lv." + (level + 1) + " / " + formatMoney(cost);

        button.addEventListener("click", function() {
          if (state.cash < cost) {
            setMessage("현금 부족");
            return;
          }

          state.cash -= cost;
          state.upgrades[upgrade.key] += 1;
          setMessage(upgrade.label + " 업그레이드");
          renderUpgradeButtons();
          updateHud();
        });

        els.upgradeRow.appendChild(button);
      });
    }

    function openPortPanel(isFirstPort, reportText) {
      const port = ports[state.portIndex % ports.length];

      portOpen = true;
      paused = false;
      running = false;

      els.portPanel.className = "port-panel show";
      els.portTitle.textContent = isFirstPort ? "출발 항구 · " + port.name : "도착 항구 · " + port.name;

      if (reportText) {
        els.portSummary.textContent = reportText + " 다음 계약을 선택하고 필요하면 업그레이드하세요.";
      } else {
        els.portSummary.textContent = port.name + "에서 출항 준비 중입니다. 계약 하나를 선택하면 다음 항구 도착 시 보상을 받을 수 있습니다.";
      }

      const contracts = generateContracts();
      els.contractGrid.innerHTML = "";

      contracts.forEach(function(contract) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-card";
        button.innerHTML =
          "<h3>" + contract.icon + " " + contract.type + "</h3>" +
          "<p>항로: " + contract.from + " → " + contract.to + "</p>" +
          "<p>보상: " + formatMoney(contract.reward) + "</p>" +
          "<p>위험도: " + Math.round(contract.risk * 100) + "% · 무게 " + contract.weight + "</p>" +
          "<p>" + contract.note + "</p>";

        button.addEventListener("click", function() {
          Array.from(document.querySelectorAll(".choice-card")).forEach(function(card) {
            card.classList.remove("active");
          });

          button.classList.add("active");
          state.contract = contract;
          state.contractSelected = true;
          updateHud();
          setMessage(contract.type + " 계약 선택");
        });

        els.contractGrid.appendChild(button);
      });

      renderUpgradeButtons();
      updateHud();
      render();
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

        report += state.contract.icon + " 계약 정산 " + formatMoney(contractGain) + ". ";
        state.contract = null;
        state.contractSelected = false;
      } else {
        report += "계약 없이 도착. ";
      }

      const fee = port.fee + state.visitedPorts * 18;
      const foodCost = port.food;
      const dockingCost = fee + foodCost;

      state.cash -= dockingCost;
      state.fuel = clamp(state.fuel + port.fuel, 0, 130);
      state.food = clamp(state.food + 42, 0, 130);
      state.hull = clamp(state.hull + 12, 0, 130);
      state.visitedPorts += 1;
      state.portIndex = (state.portIndex + 1) % ports.length;
      state.routeDistance = 0;
      state.portEvery = 1550 + state.visitedPorts * 165;
      state.combo = 0;

      report += "항구 비용 " + formatMoney(dockingCost) + " 차감.";

      checkMissionProgress();
      updateHud();
      openPortPanel(false, report);
      checkGameOver();
    }

    function departPort() {
      if (!state.contract) {
        setMessage("계약을 선택하는 것이 좋습니다.");
        return;
      }

      els.portPanel.className = "port-panel";
      portOpen = false;
      running = true;
      paused = false;
      lastTime = 0;
      spawnTimer = 0;
      objects = [];
      setMessage("출항 완료");
      updateHud();
    }

    function restock() {
      const cost = 180;
      if (state.cash < cost) {
        setMessage("보급 비용 부족");
        return;
      }

      state.cash -= cost;
      state.fuel = clamp(state.fuel + 35, 0, 130);
      state.food = clamp(state.food + 35, 0, 130);
      setMessage("보급 완료");
      updateHud();
    }

    function emergencyRepair() {
      const cost = 220;
      if (!state || gameOver) return;

      if (state.cash < cost) {
        setMessage("수리 비용 부족");
        return;
      }

      state.cash -= cost;
      state.hull = clamp(state.hull + 28, 0, 130);
      setMessage("긴급 수리 완료");
      updateHud();
    }

    function checkGameOver() {
      if (!state || gameOver) return;

      if (state.hull <= 0) {
        endGame("선체 파손");
        return;
      }

      if (state.cash <= -250) {
        endGame("운영 자금 부족");
        return;
      }

      if (state.fuel <= -15) {
        endGame("연료 고갈");
        return;
      }

      if (state.food <= -15) {
        endGame("식량 고갈");
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

      updateHud();
      updateMissionByState();
      setMessage("첫 계약을 선택하세요.");
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

      setMessage(message + " · 최종 거리 " + Math.floor(state.distance).toLocaleString("ko-KR") + " km");
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
        setMessage("연료 부족");
        return;
      }

      state.boost = Math.max(state.boost, 2.5);
      state.fuel -= 4;
      setMessage("부스트 사용");
      updateHud();
    }

    function togglePause() {
      if (!state || gameOver || portOpen) return;
      paused = !paused;
      setMessage(paused ? "일시정지" : "재개");
      render();
    }

    function toggleHelpPanel() {
      if (els.helpPanel.style.display === "none") {
        els.helpPanel.style.display = "";
      } else {
        els.helpPanel.style.display = "none";
      }
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
      const url = "https://www.datlora.com/world-voyage";
      const text = "Datlora World Voyage 3D에서 " + distance.toLocaleString("ko-KR") + " km 항해했습니다: " + url;

      els.shareStatus.textContent = "공유 준비 중입니다.";

      try {
        if (navigator.share) {
          await navigator.share({
            title: "Datlora World Voyage 3D",
            text: "Datlora World Voyage 3D에서 " + distance.toLocaleString("ko-KR") + " km 항해했습니다.",
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
        makeParticles(delta);
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

      if (key === "arrowleft" || key === "a") moveLeft();
      if (key === "arrowright" || key === "d") moveRight();

      if (key === "arrowup" || key === "w" || key === " ") {
        event.preventDefault();
        useBoost();
      }

      if (key === "p") togglePause();
      if (key === "r") emergencyRepair();
      if (key === "h") toggleHelpPanel();
    });

    document.getElementById("start-button").addEventListener("click", startGame);
    document.getElementById("pause-button").addEventListener("click", togglePause);
    document.getElementById("boost-button").addEventListener("click", useBoost);
    document.getElementById("repair-button").addEventListener("click", emergencyRepair);
    document.getElementById("help-button").addEventListener("click", toggleHelpPanel);
    document.getElementById("share-button").addEventListener("click", shareGame);
    document.getElementById("depart-button").addEventListener("click", departPort);
    document.getElementById("restock-button").addEventListener("click", restock);

    document.querySelectorAll(".legend-tab").forEach(function(button) {
      button.addEventListener("click", function() {
        legendTab = button.getAttribute("data-tab") || "good";
        renderLegend();
      });
    });

    resizeCanvas();
    state = defaultState();
    updateHud();
    updateMissionByState();
    renderLegend();
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
