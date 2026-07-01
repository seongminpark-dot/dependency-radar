import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// datlora.risklab.powerup.v1

function html() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Risk Lab | Datlora</title>
  <meta name="description" content="Datlora Risk Lab은 공식 국가 지표를 기반으로 공급망, 에너지, 식량, 관세 충격 시나리오를 플레이하는 데이터 게임입니다." />
  <style>
    body {
      margin: 0;
      background:
        radial-gradient(circle at 15% 15%, rgba(20,184,166,.16), transparent 30%),
        radial-gradient(circle at 80% 10%, rgba(99,102,241,.18), transparent 35%),
        #070a14;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      overflow-x: hidden;
    }
    .site-nav {
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid rgba(255,255,255,.1);
      background: rgba(7,10,20,.86);
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
      font-weight: 850;
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
      font-weight: 700;
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 70px 24px;
    }
    .label {
      color: #67e8f9;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: .24em;
      text-transform: uppercase;
      margin: 0;
    }
    h1 {
      max-width: 980px;
      font-size: clamp(44px, 7vw, 82px);
      line-height: 1.02;
      letter-spacing: -0.07em;
      margin: 22px 0;
    }
    .intro {
      max-width: 850px;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.75;
    }
    .hud {
      margin-top: 30px;
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 12px;
    }
    .hud-card {
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.05);
      border-radius: 20px;
      padding: 16px;
    }
    .hud-card p {
      margin: 0;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 800;
    }
    .hud-card strong {
      display: block;
      margin-top: 8px;
      color: white;
      font-size: 30px;
      letter-spacing: -0.05em;
    }
    .lab {
      margin-top: 30px;
      border: 1px solid rgba(255,255,255,.1);
      background:
        linear-gradient(135deg, rgba(255,255,255,.07), rgba(255,255,255,.025)),
        rgba(255,255,255,.035);
      border-radius: 34px;
      padding: 30px;
      box-shadow: 0 30px 90px rgba(0,0,0,.35);
    }
    .scenario-bar {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 20px;
      align-items: start;
    }
    .scenario-pill {
      display: inline-flex;
      width: fit-content;
      border: 1px solid rgba(96,165,250,.3);
      background: rgba(59,130,246,.14);
      color: #dbeafe;
      border-radius: 999px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 900;
    }
    .scenario-title {
      margin: 18px 0 0;
      font-size: clamp(26px, 4vw, 44px);
      line-height: 1.08;
      letter-spacing: -0.05em;
      font-weight: 950;
    }
    .scenario-desc {
      margin: 14px 0 0;
      color: #cbd5e1;
      line-height: 1.65;
    }
    .objective {
      border: 1px solid rgba(251,191,36,.25);
      background: rgba(251,191,36,.1);
      color: #fef3c7;
      border-radius: 22px;
      padding: 18px;
      line-height: 1.6;
      max-width: 320px;
      font-size: 14px;
      font-weight: 750;
    }
    .arena {
      margin-top: 34px;
      perspective: 1300px;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 22px;
      transform-style: preserve-3d;
    }
    .risk-card {
      position: relative;
      border: 1px solid rgba(255,255,255,.12);
      background:
        radial-gradient(circle at 25% 20%, rgba(52,211,153,.16), transparent 32%),
        radial-gradient(circle at 90% 90%, rgba(99,102,241,.14), transparent 35%),
        #0b0f1c;
      border-radius: 30px;
      padding: 26px;
      min-height: 330px;
      color: white;
      text-align: left;
      cursor: pointer;
      transform: rotateX(7deg) rotateY(-7deg);
      transition: transform .2s ease, border-color .2s ease, background .2s ease, box-shadow .2s ease;
      overflow: hidden;
    }
    .risk-card:nth-child(2) {
      transform: rotateX(3deg) rotateY(0deg) translateY(-10px);
    }
    .risk-card:nth-child(3) {
      transform: rotateX(7deg) rotateY(7deg);
    }
    .risk-card:hover {
      transform: rotateX(0deg) rotateY(0deg) translateY(-8px) scale(1.02);
      border-color: rgba(52,211,153,.55);
      box-shadow: 0 25px 70px rgba(16,185,129,.12);
    }
    .risk-card.revealed.correct {
      border-color: rgba(52,211,153,.65);
      box-shadow: 0 25px 70px rgba(16,185,129,.2);
    }
    .risk-card.revealed.wrong {
      border-color: rgba(248,113,113,.55);
    }
    .orb {
      position: absolute;
      right: -35px;
      top: -35px;
      width: 120px;
      height: 120px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(96,165,250,.35), transparent 70%);
      filter: blur(2px);
    }
    .country-name {
      position: relative;
      margin: 0;
      font-size: clamp(28px, 4vw, 44px);
      line-height: 1.05;
      letter-spacing: -0.05em;
      font-weight: 950;
    }
    .country-meta {
      position: relative;
      margin: 14px 0 0;
      color: #64748b;
      font-size: 14px;
      font-weight: 800;
    }
    .risk-score {
      display: none;
      margin-top: 34px;
    }
    .risk-score strong {
      display: block;
      color: #c7d2fe;
      font-size: 38px;
      letter-spacing: -0.05em;
    }
    .risk-score span {
      display: block;
      color: #94a3b8;
      margin-top: 6px;
      font-size: 13px;
    }
    .risk-card.revealed .risk-score {
      display: block;
    }
    .factor-list {
      display: none;
      margin-top: 22px;
      gap: 10px;
    }
    .risk-card.revealed .factor-list {
      display: grid;
    }
    .factor {
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.035);
      border-radius: 14px;
      padding: 10px 12px;
    }
    .factor p {
      margin: 0;
      color: #cbd5e1;
      font-size: 12px;
      font-weight: 750;
    }
    .factor strong {
      display: block;
      color: #e0e7ff;
      margin-top: 6px;
      font-size: 14px;
    }
    .result {
      display: none;
      margin-top: 26px;
      border-radius: 24px;
      padding: 20px;
      border: 1px solid rgba(255,255,255,.1);
      line-height: 1.7;
    }
    .result.show {
      display: block;
    }
    .result.correct {
      background: rgba(16,185,129,.12);
      border-color: rgba(52,211,153,.35);
      color: #d1fae5;
    }
    .result.wrong {
      background: rgba(239,68,68,.12);
      border-color: rgba(248,113,113,.35);
      color: #fee2e2;
    }
    .actions {
      margin-top: 26px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .actions button,
    .actions a {
      border: 0;
      border-radius: 16px;
      padding: 13px 16px;
      text-decoration: none;
      font-weight: 900;
      cursor: pointer;
      font-size: 14px;
    }
    .primary {
      background: #34d399;
      color: #06130d;
    }
    .secondary {
      background: #0b0f1c;
      color: #e2e8f0;
      border: 1px solid rgba(255,255,255,.1) !important;
    }
    .share-status {
      margin: 12px 0 0;
      min-height: 22px;
      color: #a7f3d0;
      font-size: 13px;
      font-weight: 800;
      line-height: 1.5;
    }
    .share-status.muted {
      color: #94a3b8;
    }
    .share-status.error {
      color: #fecaca;
    }
    .timer-shell {
      margin-top: 22px;
      height: 12px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(15,23,42,.75);
      border-radius: 999px;
      overflow: hidden;
    }
    .timer-bar {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #34d399, #67e8f9);
      border-radius: 999px;
      transition: width .18s linear, background .18s ease;
    }
    .timer-bar.warn {
      background: linear-gradient(90deg, #facc15, #fb923c);
    }
    .timer-bar.danger {
      background: linear-gradient(90deg, #fb7185, #ef4444);
    }
    .stage-banner {
      display: none;
      margin-top: 16px;
      border: 1px solid rgba(125,211,252,.22);
      background: rgba(14,165,233,.1);
      color: #e0f2fe;
      border-radius: 20px;
      padding: 15px 16px;
      font-size: 14px;
      font-weight: 900;
      line-height: 1.55;
    }
    .stage-banner.show {
      display: block;
      animation: stagePop .42s ease both;
    }
    .stage-banner.good {
      border-color: rgba(52,211,153,.32);
      background: rgba(16,185,129,.12);
      color: #d1fae5;
    }
    .stage-banner.bad {
      border-color: rgba(248,113,113,.32);
      background: rgba(239,68,68,.12);
      color: #fee2e2;
    }
    .risk-card.locked {
      pointer-events: none;
      opacity: .82;
    }
    @keyframes stagePop {
      from {
        transform: translateY(8px) scale(.98);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
    .note {
      margin-top: 28px;
      border: 1px solid rgba(251,191,36,.25);
      background: rgba(251,191,36,.1);
      color: #fef3c7;
      border-radius: 24px;
      padding: 18px;
      line-height: 1.65;
      font-size: 14px;
    }
    @media (max-width: 900px) {
      .hud,
      .cards,
      .scenario-bar {
        grid-template-columns: 1fr;
      }
      .risk-card,
      .risk-card:nth-child(2),
      .risk-card:nth-child(3) {
        transform: none;
      }
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
    <p class="label">Risk Lab</p>
    <h1>세계 공급망 충격을 데이터로 플레이하세요.</h1>
    <p class="intro">
      Risk Lab은 Datlora의 공식 국가 지표를 조합해 만든 2.5D 시나리오 게임입니다.
      유가, 식량, 관세, 물류 충격이 발생했을 때 어느 국가가 더 노출되는지 추론해보세요.
    </p>

    <section class="hud">
      <div class="hud-card">
        <p>현재 점수</p>
        <strong id="score">0</strong>
      </div>
      <div class="hud-card">
        <p>최고 점수</p>
        <strong id="best-score">0</strong>
      </div>
      <div class="hud-card">
        <p>라운드</p>
        <strong id="round">1</strong>
      </div>
      <div class="hud-card">
        <p>콤보</p>
        <strong id="combo">0</strong>
      </div>
      <div class="hud-card">
        <p>생명</p>
        <strong id="lives">3</strong>
      </div>
      <div class="hud-card">
        <p>제한 시간</p>
        <strong id="timer">18초</strong>
      </div>
    </section>

    <section class="lab">
      <div class="scenario-bar">
        <div>
          <span class="scenario-pill" id="scenario-label">Loading</span>
          <h2 class="scenario-title" id="scenario-title">시나리오를 불러오는 중입니다.</h2>
          <p class="scenario-desc" id="scenario-desc"></p>
        </div>
        <div class="objective" id="objective">가장 노출도가 높은 국가를 선택하세요.</div>
      </div>

      <div class="timer-shell" aria-hidden="true">
        <div class="timer-bar" id="timer-bar"></div>
      </div>
      <div class="stage-banner" id="stage-banner"></div>

      <div class="arena">
        <div class="cards" id="cards"></div>
      </div>

      <div class="result" id="result"></div>

      <div class="actions">
        <button class="primary" type="button" id="next-button">다음 라운드</button>
        <button class="secondary" type="button" id="new-run-button">새 게임</button>
        <button class="secondary" type="button" id="share-button">최고 기록 공유</button>
        <a class="secondary" href="/challenge">Data Challenge</a>
        <a class="secondary" href="/world-voyage">World Voyage 3D</a>
        <a class="secondary" href="/topics">주제별 통계</a>
      </div>
      <p class="share-status muted" id="share-status" aria-live="polite"></p>
    </section>

    <section class="note">
      Risk Lab의 점수는 공식 지표를 조합한 게임용 비교 점수입니다.
      실제 정책, 투자, 법률 판단을 대체하지 않으며, 국가별 노출도를 이해하기 위한 인터랙티브 콘텐츠입니다.
    </section>
  </main>

  <script>
    const STORAGE_KEY = "datlora.risklab.v1";

    let state = {
      score: 0,
      round: 1,
      combo: 0,
      lives: 3,
      bestScore: 0
    };

    let current = null;
    let answered = false;
    let timerId = null;
    let timeLeft = 18;
    let timeLimit = 18;

    function loadBest() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return 0;
        const parsed = JSON.parse(raw);
        return Number(parsed.bestScore || 0);
      } catch {
        return 0;
      }
    }

    function saveBest() {
      const bestScore = Math.max(state.bestScore, state.score);
      state.bestScore = bestScore;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestScore }));
    }

    function updateHud() {
      document.getElementById("score").textContent = state.score;
      document.getElementById("best-score").textContent = state.bestScore;
      document.getElementById("round").textContent = state.round;
      document.getElementById("combo").textContent = state.combo;
      document.getElementById("lives").textContent = "♥".repeat(state.lives) || "0";
      updateTimerHud();
    }

    function getRoundTimeLimit() {
      return Math.max(8, 18 - Math.floor((state.round - 1) / 3) * 2);
    }

    function getDifficultyLabel() {
      if (state.round >= 13) return "난이도 HARD";
      if (state.round >= 7) return "난이도 MEDIUM";
      return "난이도 EASY";
    }

    function updateTimerHud() {
      const timer = document.getElementById("timer");
      const bar = document.getElementById("timer-bar");

      if (timer) {
        timer.textContent = Math.max(0, Math.ceil(timeLeft)) + "초";
      }

      if (bar) {
        const percent = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));
        bar.style.width = percent + "%";

        if (percent <= 25) {
          bar.className = "timer-bar danger";
        } else if (percent <= 50) {
          bar.className = "timer-bar warn";
        } else {
          bar.className = "timer-bar";
        }
      }
    }

    function stopTimer() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function startTimer() {
      stopTimer();

      timeLimit = getRoundTimeLimit();
      timeLeft = timeLimit;
      updateTimerHud();

      timerId = window.setInterval(function() {
        if (answered || state.lives <= 0) {
          stopTimer();
          return;
        }

        timeLeft = Math.max(0, timeLeft - 0.2);
        updateTimerHud();

        if (timeLeft <= 0) {
          handleTimeOut();
        }
      }, 200);
    }

    function setStageBanner(message, type) {
      const banner = document.getElementById("stage-banner");
      if (!banner) return;

      banner.textContent = message || "";

      if (!message) {
        banner.className = "stage-banner";
        return;
      }

      banner.className = "stage-banner show " + (type || "");
    }

    function lockCards() {
      Array.from(document.querySelectorAll(".risk-card")).forEach(function(card) {
        card.classList.add("locked");
      });
    }

    function getShareScore() {
      return Math.max(Number(state.bestScore || 0), Number(state.score || 0));
    }

    function setShareStatus(message, isError) {
      const status = document.getElementById("share-status");
      if (!status) return;

      status.textContent = message || "";

      if (!message) {
        status.className = "share-status muted";
        return;
      }

      status.className = isError ? "share-status error" : "share-status";
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

    async function shareRiskLab() {
      saveBest();
      updateHud();

      const bestScore = getShareScore();
      const publicUrl = "https://datlora.com/risk-lab";
      const scoreText = bestScore.toLocaleString("ko-KR");
      const fullText =
        "Datlora Risk Lab 최고 점수 " +
        scoreText +
        "점. 공식 국가 데이터로 공급망 충격을 플레이해보세요: " +
        publicUrl;

      setShareStatus("공유 준비 중입니다.", false);

      try {
        if (navigator.share) {
          await navigator.share({
            title: "Datlora Risk Lab",
            text:
              "Datlora Risk Lab 최고 점수 " +
              scoreText +
              "점. 공식 국가 데이터로 공급망 충격을 플레이해보세요.",
            url: publicUrl
          });

          setShareStatus("공유 창을 열었습니다.", false);
          return;
        }

        const copied = await copyToClipboard(fullText);

        if (copied) {
          setShareStatus("공유 문구가 복사되었습니다. 원하는 곳에 붙여넣으면 됩니다.", false);
          return;
        }

        throw new Error("Copy failed");
      } catch (error) {
        if (error && error.name === "AbortError") {
          setShareStatus("공유가 취소되었습니다.", true);
          return;
        }

        try {
          await copyToClipboard(fullText);
          setShareStatus("공유 문구가 복사되었습니다. 원하는 곳에 붙여넣으면 됩니다.", false);
        } catch {
          setShareStatus("복사가 되지 않았습니다. 주소창의 링크를 직접 복사해 주세요.", true);
        }
      }
    }

    function flagEmoji(iso2) {
      if (!iso2 || iso2.length !== 2) return "";
      return iso2.toUpperCase().replace(/./g, function(char) {
        return String.fromCodePoint(127397 + char.charCodeAt(0));
      });
    }

    function escapeHtml(value) {
      return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function factorHtml(factors) {
      return factors.map(function(factor) {
        return '<div class="factor">' +
          '<p>' + escapeHtml(factor.labelKo) + '</p>' +
          '<strong>' + escapeHtml(factor.formattedValue) + '</strong>' +
        '</div>';
      }).join("");
    }

    function cardHtml(country) {
      return '<button class="risk-card" type="button" data-iso3="' + escapeHtml(country.iso3) + '">' +
        '<div class="orb"></div>' +
        '<p class="country-name">' + flagEmoji(country.iso2) + " " + escapeHtml(country.countryName) + '</p>' +
        '<p class="country-meta">' + escapeHtml(country.iso3) + '</p>' +
        '<div class="risk-score">' +
          '<strong>' + escapeHtml(country.scoreLabel) + '</strong>' +
          '<span>Scenario exposure score</span>' +
        '</div>' +
        '<div class="factor-list">' + factorHtml(country.factors) + '</div>' +
      '</button>';
    }

    async function loadRound() {
      answered = false;
      stopTimer();
      timeLimit = getRoundTimeLimit();
      timeLeft = timeLimit;
      updateTimerHud();
      setStageBanner("", "");

      document.getElementById("result").className = "result";
      document.getElementById("result").textContent = "";
      document.getElementById("cards").innerHTML = "";
      document.getElementById("scenario-label").textContent = "Loading";
      document.getElementById("scenario-title").textContent = "시나리오를 불러오는 중입니다.";
      document.getElementById("scenario-desc").textContent = "";
      document.getElementById("objective").textContent = "가장 노출도가 높은 국가를 선택하세요.";
      setShareStatus("", false);

      try {
        const response = await fetch("/api/risk-lab", { cache: "no-store" });
        const data = await response.json();

        if (!data.ok) {
          document.getElementById("scenario-label").textContent = "Data unavailable";
          document.getElementById("scenario-title").textContent = "시나리오를 불러오지 못했습니다.";
          return;
        }

        current = data;

        document.getElementById("scenario-label").textContent = data.scenario.labelKo;
        document.getElementById("scenario-title").textContent = data.scenario.titleKo;
        document.getElementById("scenario-desc").textContent = data.scenario.descriptionKo;
        document.getElementById("objective").textContent =
          data.scenario.objectiveKo + " · " + getDifficultyLabel() + " · 제한 " + getRoundTimeLimit() + "초";

        document.getElementById("cards").innerHTML = data.countries.map(cardHtml).join("");

        Array.from(document.querySelectorAll(".risk-card")).forEach(function(card) {
          card.addEventListener("click", function() {
            answer(card.getAttribute("data-iso3"));
          });
        });
        startTimer();
      } catch {
        document.getElementById("scenario-label").textContent = "Network error";
        document.getElementById("scenario-title").textContent = "시나리오를 불러오지 못했습니다.";
      }
    }

    function revealCards(selectedIso3) {
      Array.from(document.querySelectorAll(".risk-card")).forEach(function(card) {
        const iso3 = card.getAttribute("data-iso3");
        card.classList.add("revealed");

        if (iso3 === current.correctIso3) {
          card.classList.add("correct");
        } else if (iso3 === selectedIso3) {
          card.classList.add("wrong");
        }
      });
    }

    function handleTimeOut() {
      if (!current || answered || state.lives <= 0) return;

      answered = true;
      stopTimer();
      lockCards();
      revealCards(null);

      state.lives -= 1;
      state.combo = 0;

      const result = document.getElementById("result");
      result.className = "result show wrong";
      result.textContent = "시간 초과입니다. " + current.explanationKo;

      setStageBanner("시간 초과 · 생명 -1", "bad");

      saveBest();
      updateHud();

      if (state.lives <= 0) {
        result.textContent += " 게임이 종료되었습니다. 새 게임을 시작해보세요.";
      }
    }

    function answer(selectedIso3) {
      if (!current || answered || state.lives <= 0) return;

      answered = true;
      stopTimer();
      lockCards();

      const isCorrect = selectedIso3 === current.correctIso3;
      revealCards(selectedIso3);

      const result = document.getElementById("result");

      if (isCorrect) {
        const remainingSeconds = Math.max(0, Math.ceil(timeLeft));
        const timeBonus = remainingSeconds * 8;
        const stageBonus = state.round % 5 === 0 ? 250 + state.round * 10 : 0;
        const gained = 100 + state.combo * 25 + state.round * 5 + timeBonus + stageBonus;

        state.score += gained;
        state.combo += 1;

        result.className = "result show correct";
        result.textContent =
          "정답입니다. " +
          current.explanationKo +
          " 기본/콤보/라운드/시간 보너스 합계 +" +
          gained +
          "점";

        if (stageBonus > 0) {
          setStageBanner("Stage Clear · 5라운드 보너스 +" + stageBonus + "점", "good");
        } else if (state.combo >= 3) {
          setStageBanner("Combo x" + state.combo + " · 연속 정답 보너스가 커지고 있습니다.", "good");
        } else {
          setStageBanner("시간 보너스 +" + timeBonus + "점", "good");
        }
      } else {
        state.lives -= 1;
        state.combo = 0;
        result.className = "result show wrong";
        result.textContent = "아쉽습니다. " + current.explanationKo;
        setStageBanner("오답 · 생명 -1 · 콤보 초기화", "bad");
      }

      saveBest();
      updateHud();

      if (state.lives <= 0) {
        result.textContent += " 게임이 종료되었습니다. 새 게임을 시작해보세요.";
      }
    }

    function nextRound() {
      if (state.lives <= 0) return;
      stopTimer();
      state.round += 1;
      updateHud();
      loadRound();
    }

    function newRun() {
      stopTimer();

      state = {
        score: 0,
        round: 1,
        combo: 0,
        lives: 3,
        bestScore: loadBest()
      };

      timeLimit = getRoundTimeLimit();
      timeLeft = timeLimit;

      updateHud();
      loadRound();
    }

    document.getElementById("next-button").addEventListener("click", nextRound);
    document.getElementById("new-run-button").addEventListener("click", newRun);
    document.getElementById("share-button").addEventListener("click", shareRiskLab);

    state.bestScore = loadBest();
    updateHud();
    loadRound();
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
