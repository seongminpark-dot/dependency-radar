import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function html() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>World Voyage 3D | Datlora</title>
  <meta name="description" content="Datlora World Voyage 3D는 세계 항로를 이동하며 화물 수익, 항구 통행료, 식비, 폭풍 리스크를 관리하는 캐주얼 3D 느낌 웹 게임입니다." />
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      background:
        radial-gradient(circle at 18% 12%, rgba(56,189,248,.2), transparent 30%),
        radial-gradient(circle at 78% 18%, rgba(52,211,153,.18), transparent 32%),
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
      background: rgba(5,8,22,.86);
      backdrop-filter: blur(16px);
    }
    .site-nav-inner {
      max-width: 1180px;
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
      font-weight: 900;
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
      font-weight: 750;
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 58px 24px 80px;
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
      max-width: 980px;
      margin: 20px 0 18px;
      font-size: clamp(42px, 7vw, 82px);
      line-height: 1.02;
      letter-spacing: -0.07em;
    }
    .intro {
      max-width: 850px;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.75;
      margin: 0;
    }
    .hud {
      margin-top: 28px;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 12px;
    }
    .hud-card {
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.055);
      border-radius: 20px;
      padding: 15px;
    }
    .hud-card p {
      margin: 0;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 850;
    }
    .hud-card strong {
      display: block;
      margin-top: 7px;
      color: #fff;
      font-size: 25px;
      letter-spacing: -0.05em;
      white-space: nowrap;
    }
    .game-shell {
      margin-top: 28px;
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
      height: 540px;
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
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(2,6,23,.74);
      color: #e2e8f0;
      border-radius: 18px;
      padding: 13px 15px;
      font-size: 14px;
      font-weight: 800;
      line-height: 1.55;
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
    .mobile-controls {
      margin-left: auto;
      display: flex;
      gap: 10px;
    }
    .mobile-controls button {
      min-width: 56px;
      font-size: 20px;
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
    .status-line {
      margin-top: 12px;
      color: #94a3b8;
      font-size: 13px;
      font-weight: 750;
      line-height: 1.55;
    }
    @media (max-width: 900px) {
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
        height: 480px;
      }
      .mobile-controls {
        width: 100%;
        margin-left: 0;
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
    <h1>배 한 척으로 세계 항로를 완주하세요.</h1>
    <p class="intro">
      항구를 이동하며 화물 수익을 얻고, 배값·통행료·식비·폭풍 피해를 관리하는 3D 느낌의 캐주얼 항해 게임입니다.
      공식 통계 게임은 아니지만 Datlora의 무역·이동·비용 감각을 가볍게 체험할 수 있게 만들었습니다.
    </p>

    <section class="hud">
      <div class="hud-card">
        <p>보유 자금</p>
        <strong id="cash">$900</strong>
      </div>
      <div class="hud-card">
        <p>이동 거리</p>
        <strong id="distance">0 km</strong>
      </div>
      <div class="hud-card">
        <p>현재 일차</p>
        <strong id="day">Day 1</strong>
      </div>
      <div class="hud-card">
        <p>다음 항구</p>
        <strong id="port">Singapore</strong>
      </div>
      <div class="hud-card">
        <p>최고 거리</p>
        <strong id="best">0 km</strong>
      </div>
    </section>

    <section class="game-shell">
      <div class="canvas-wrap">
        <canvas id="game" aria-label="World Voyage 3D game canvas"></canvas>
        <div class="overlay">
          <div class="message" id="message">시작 버튼을 누르세요. 방향키 또는 아래 버튼으로 항로를 바꿀 수 있습니다.</div>
        </div>
      </div>

      <div class="controls">
        <button class="primary" type="button" id="start-button">게임 시작</button>
        <button class="secondary" type="button" id="pause-button">일시정지</button>
        <button class="secondary" type="button" id="share-button">기록 공유</button>
        <a class="link-button secondary" href="/risk-lab">Risk Lab</a>
        <a class="link-button secondary" href="/challenge">Data Challenge</a>

        <div class="mobile-controls" aria-label="Mobile controls">
          <button class="secondary" type="button" id="left-button">←</button>
          <button class="secondary" type="button" id="right-button">→</button>
        </div>
      </div>

      <p class="status-line" id="share-status"></p>
    </section>

    <section class="note">
      World Voyage 3D는 실제 항만 비용이나 국가별 공식 통계를 표시하는 페이지가 아니라, Datlora 사이트 체류 시간을 늘리기 위한 캐주얼 웹 게임입니다.
      실제 통계 확인은 국가 상세 페이지와 주제별 통계 페이지를 사용하세요.
    </section>
  </main>

  <script>
    const STORAGE_KEY = "datlora.worldvoyage.v1";

    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    const cashEl = document.getElementById("cash");
    const distanceEl = document.getElementById("distance");
    const dayEl = document.getElementById("day");
    const portEl = document.getElementById("port");
    const bestEl = document.getElementById("best");
    const messageEl = document.getElementById("message");
    const shareStatusEl = document.getElementById("share-status");

    const ports = [
      { name: "Singapore", fee: 120, food: 35, income: 260 },
      { name: "Dubai", fee: 150, food: 40, income: 320 },
      { name: "Rotterdam", fee: 190, food: 55, income: 420 },
      { name: "New York", fee: 210, food: 70, income: 500 },
      { name: "Santos", fee: 160, food: 45, income: 380 },
      { name: "Cape Town", fee: 130, food: 38, income: 300 },
      { name: "Incheon", fee: 180, food: 50, income: 470 }
    ];

    const eventTypes = [
      { key: "cargo", label: "화물 계약", icon: "📦", amount: 150, color: "#34d399" },
      { key: "passenger", label: "승객 운송", icon: "🧳", amount: 95, color: "#60a5fa" },
      { key: "customs", label: "통행료", icon: "🛃", amount: -85, color: "#facc15" },
      { key: "meal", label: "식비", icon: "🍱", amount: -45, color: "#fb923c" },
      { key: "storm", label: "폭풍 피해", icon: "🌊", amount: -140, color: "#fb7185" }
    ];

    let state = null;
    let objects = [];
    let running = false;
    let paused = false;
    let gameOver = false;
    let lastTime = 0;
    let spawnTimer = 0;

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
      const bestDistance = Math.max(loadBest(), Math.floor(state.distance));
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestDistance }));
    }

    function formatMoney(value) {
      const sign = value < 0 ? "-$" : "$";
      return sign + Math.abs(Math.floor(value)).toLocaleString("ko-KR");
    }

    function updateHud() {
      cashEl.textContent = formatMoney(state.cash);
      distanceEl.textContent = Math.floor(state.distance).toLocaleString("ko-KR") + " km";
      dayEl.textContent = "Day " + state.day;
      portEl.textContent = ports[state.portIndex % ports.length].name;
      bestEl.textContent = loadBest().toLocaleString("ko-KR") + " km";
    }

    function setMessage(message) {
      messageEl.textContent = message;
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
      const y = horizon + z * h * 0.73;
      const roadHalf = w * (0.06 + z * 0.42);
      const laneGap = roadHalf / 1.35;
      const x = w / 2 + lane * laneGap;
      const scale = 0.28 + z * 1.65;

      return { x, y, scale };
    }

    function drawBackground() {
      const w = width();
      const h = height();

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#0f172a");
      sky.addColorStop(0.45, "#075985");
      sky.addColorStop(1, "#082f49");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(255,255,255,.9)";
      ctx.beginPath();
      ctx.arc(w * 0.76, h * 0.12, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,.08)";
      for (let i = 0; i < 26; i += 1) {
        const x = (i * 97 + state.distance * 0.08) % w;
        const y = h * 0.1 + (i % 5) * 23;
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      const horizon = h * 0.18;

      ctx.fillStyle = "rgba(14,165,233,.22)";
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 38, horizon);
      ctx.lineTo(w * 0.5 + 38, horizon);
      ctx.lineTo(w * 0.94, h * 0.94);
      ctx.lineTo(w * 0.06, h * 0.94);
      ctx.closePath();
      ctx.fill();

      for (let i = 0; i < 18; i += 1) {
        const z = ((i * 0.08 + state.distance * 0.0018) % 1);
        const left = project(-1.5, z);
        const right = project(1.5, z);

        ctx.strokeStyle = "rgba(255,255,255," + (0.05 + z * 0.15) + ")";
        ctx.lineWidth = 1 + z * 2;
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
      }

      [-1, 0, 1].forEach(function(lane) {
        const near = project(lane, 1);
        const far = project(lane, 0.02);
        ctx.strokeStyle = "rgba(186,230,253,.28)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(far.x, far.y);
        ctx.lineTo(near.x, near.y);
        ctx.stroke();
      });
    }

    function drawItem(item) {
      const p = project(item.lane, item.z);
      const size = 26 * p.scale;
      const type = eventTypes.find(function(t) { return t.key === item.type; }) || eventTypes[0];

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.shadowBlur = 18 * p.scale;
      ctx.shadowColor = type.color;

      ctx.fillStyle = "rgba(2,6,23,.82)";
      ctx.strokeStyle = type.color;
      ctx.lineWidth = 2;
      roundRect(-size / 2, -size / 2, size, size, 12 * p.scale);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.font = Math.max(14, 22 * p.scale) + "px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.fillText(type.icon, 0, -2 * p.scale);

      ctx.restore();
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

    function drawShip() {
      const p = project(state.lane, 0.94);
      const size = 44 * p.scale;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.shadowBlur = 24;
      ctx.shadowColor = "#67e8f9";
      ctx.font = size + "px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⛵", 0, 0);
      ctx.restore();
    }

    function drawPortGate() {
      const progress = Math.min(1, state.distanceToPort / state.portEvery);
      const z = Math.max(0.02, 1 - progress);
      const p = project(0, z);
      const nextPort = ports[state.portIndex % ports.length];

      if (z < 0.08) return;

      ctx.save();
      ctx.translate(p.x, p.y - 34 * p.scale);
      ctx.fillStyle = "rgba(15,23,42,.76)";
      ctx.strokeStyle = "rgba(125,211,252,.5)";
      ctx.lineWidth = 2;
      const boxW = 150 * p.scale;
      const boxH = 40 * p.scale;
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

    function render() {
      drawBackground();
      drawPortGate();

      objects
        .slice()
        .sort(function(a, b) { return a.z - b.z; })
        .forEach(drawItem);

      drawShip();

      if (!running || paused || gameOver) {
        ctx.save();
        ctx.fillStyle = "rgba(2,6,23,.38)";
        ctx.fillRect(0, 0, width(), height());
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "900 30px system-ui";
        const title = gameOver ? "Voyage Over" : paused ? "Paused" : "Ready";
        ctx.fillText(title, width() / 2, height() / 2 - 18);
        ctx.font = "700 15px system-ui";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText("화물은 모으고, 통행료·식비·폭풍은 피하세요.", width() / 2, height() / 2 + 18);
        ctx.restore();
      }
    }

    function randomLane() {
      return [-1, 0, 1][Math.floor(Math.random() * 3)];
    }

    function randomType() {
      const r = Math.random();
      if (r < 0.34) return "cargo";
      if (r < 0.52) return "passenger";
      if (r < 0.70) return "customs";
      if (r < 0.86) return "meal";
      return "storm";
    }

    function spawnObject() {
      objects.push({
        lane: randomLane(),
        z: 0.02,
        type: randomType(),
        hit: false
      });
    }

    function handleHit(item) {
      if (item.hit) return;
      item.hit = true;

      const type = eventTypes.find(function(t) { return t.key === item.type; }) || eventTypes[0];
      state.cash += type.amount;

      const sign = type.amount >= 0 ? "+" : "";
      setMessage(type.label + " " + sign + formatMoney(type.amount).replace("$", "") + " · 현재 자금 " + formatMoney(state.cash));

      if (state.cash <= 0) {
        endGame("자금이 바닥났습니다. 항해가 종료되었습니다.");
      }
    }

    function arrivePort() {
      const port = ports[state.portIndex % ports.length];
      const totalCost = port.fee + port.food;
      const net = port.income - totalCost;

      state.cash += net;
      state.portIndex += 1;
      state.day += 1;
      state.distanceToPort = 0;

      const sign = net >= 0 ? "+" : "-";
      setMessage(
        port.name +
        " 도착 · 화물 수익 $" +
        port.income +
        " · 통행료/식비 $" +
        totalCost +
        " · 순변화 " +
        sign +
        "$" +
        Math.abs(net)
      );

      if (state.cash <= 0) {
        endGame("항구 비용을 감당하지 못했습니다. 항해가 종료되었습니다.");
      }
    }

    function updateGame(delta) {
      if (!running || paused || gameOver) return;

      const speed = 0.00028 + Math.min(0.00022, state.distance * 0.000000015);
      const kmSpeed = 65 + Math.min(75, state.distance * 0.015);

      state.distance += kmSpeed * delta;
      state.distanceToPort += kmSpeed * delta;

      spawnTimer += delta;
      if (spawnTimer > Math.max(0.55, 1.05 - state.distance * 0.00003)) {
        spawnTimer = 0;
        spawnObject();
      }

      objects.forEach(function(item) {
        item.z += speed * delta * 1000;

        if (!item.hit && item.z > 0.84 && item.z < 1.03 && item.lane === state.lane) {
          handleHit(item);
        }
      });

      objects = objects.filter(function(item) {
        return item.z < 1.18 && !item.hit;
      });

      if (state.distanceToPort >= state.portEvery) {
        arrivePort();
      }

      saveBest();
      updateHud();
    }

    function loop(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const delta = Math.min(0.04, (timestamp - lastTime) / 1000);
      lastTime = timestamp;

      updateGame(delta);
      render();

      window.requestAnimationFrame(loop);
    }

    function startGame() {
      state = {
        cash: 900,
        distance: 0,
        distanceToPort: 0,
        portEvery: 1200,
        day: 1,
        portIndex: 0,
        lane: 0
      };

      objects = [];
      spawnTimer = 0;
      running = true;
      paused = false;
      gameOver = false;
      lastTime = 0;

      setMessage("선박 임대료를 낸 뒤 $900로 출발합니다. 화물과 승객은 수익, 통행료·식비·폭풍은 비용입니다.");
      updateHud();
    }

    function endGame(message) {
      gameOver = true;
      running = false;
      paused = false;
      saveBest();
      updateHud();
      setMessage(message + " 최종 거리 " + Math.floor(state.distance).toLocaleString("ko-KR") + " km");
    }

    function moveLeft() {
      if (!state || gameOver) return;
      state.lane = Math.max(-1, state.lane - 1);
    }

    function moveRight() {
      if (!state || gameOver) return;
      state.lane = Math.min(1, state.lane + 1);
    }

    function togglePause() {
      if (!state || gameOver) return;
      paused = !paused;
      setMessage(paused ? "일시정지되었습니다." : "항해를 재개했습니다.");
    }

    async function copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
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
      return copied;
    }

    async function shareGame() {
      const distance = state ? Math.floor(state.distance) : loadBest();
      const url = "https://datlora.com/world-voyage";
      const text =
        "Datlora World Voyage 3D에서 " +
        distance.toLocaleString("ko-KR") +
        " km 항해했습니다. 세계 항로 캐주얼 게임을 플레이해보세요: " +
        url;

      shareStatusEl.textContent = "공유 준비 중입니다.";

      try {
        if (navigator.share) {
          await navigator.share({
            title: "Datlora World Voyage 3D",
            text: text.replace(": " + url, ""),
            url: url
          });
          shareStatusEl.textContent = "공유 창을 열었습니다.";
          return;
        }

        await copyToClipboard(text);
        shareStatusEl.textContent = "공유 문구가 복사되었습니다.";
      } catch {
        shareStatusEl.textContent = "공유가 취소되었거나 복사되지 않았습니다.";
      }
    }

    window.addEventListener("resize", function() {
      resizeCanvas();
      render();
    });

    window.addEventListener("keydown", function(event) {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        moveLeft();
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        moveRight();
      }

      if (event.key === " ") {
        event.preventDefault();
        togglePause();
      }
    });

    document.getElementById("start-button").addEventListener("click", startGame);
    document.getElementById("pause-button").addEventListener("click", togglePause);
    document.getElementById("left-button").addEventListener("click", moveLeft);
    document.getElementById("right-button").addEventListener("click", moveRight);
    document.getElementById("share-button").addEventListener("click", shareGame);

    resizeCanvas();

    state = {
      cash: 900,
      distance: 0,
      distanceToPort: 0,
      portEvery: 1200,
      day: 1,
      portIndex: 0,
      lane: 0
    };

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
