import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function html() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Data Challenge | Datlora</title>
  <meta name="description" content="공식 국가 통계 데이터를 기반으로 어느 나라의 지표가 더 높은지 맞히는 Datlora 데이터 챌린지입니다." />
  <style>
    body {
      margin: 0;
      background: #070a14;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
      font-weight: 800;
      letter-spacing: .22em;
      text-transform: uppercase;
      margin: 0;
    }
    h1 {
      max-width: 980px;
      font-size: clamp(42px, 7vw, 76px);
      line-height: 1.02;
      letter-spacing: -0.06em;
      margin: 22px 0;
    }
    .intro {
      max-width: 820px;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.75;
    }
    .stats {
      margin-top: 28px;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 12px;
    }
    .stat-box {
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.045);
      border-radius: 20px;
      padding: 16px;
    }
    .stat-box p {
      margin: 0;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 700;
    }
    .stat-box strong {
      display: block;
      margin-top: 8px;
      color: white;
      font-size: 28px;
      letter-spacing: -0.04em;
    }
    .modes {
      margin-top: 28px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .mode-button {
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      color: #e2e8f0;
      border-radius: 999px;
      padding: 12px 16px;
      font-weight: 850;
      cursor: pointer;
    }
    .mode-button.active {
      background: #34d399;
      color: #06130d;
      border-color: transparent;
    }
    .game {
      margin-top: 26px;
      border: 1px solid rgba(255,255,255,.1);
      background:
        radial-gradient(circle at 20% 10%, rgba(20,184,166,.16), transparent 28%),
        radial-gradient(circle at 90% 20%, rgba(99,102,241,.18), transparent 30%),
        rgba(255,255,255,.045);
      border-radius: 32px;
      padding: 28px;
    }
    .metric {
      display: inline-flex;
      border: 1px solid rgba(96,165,250,.28);
      background: rgba(59,130,246,.12);
      color: #dbeafe;
      border-radius: 999px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 750;
    }
    .scenario {
      display: none;
      margin-top: 14px;
      color: #fef3c7;
      border: 1px solid rgba(251,191,36,.25);
      background: rgba(251,191,36,.1);
      border-radius: 18px;
      padding: 14px;
      line-height: 1.6;
      font-size: 14px;
    }
    .scenario.show {
      display: block;
    }
    .question {
      margin: 22px 0 0;
      font-size: clamp(26px, 4vw, 42px);
      line-height: 1.15;
      letter-spacing: -0.04em;
      font-weight: 900;
    }
    .clues {
      margin-top: 24px;
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .clue {
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 20px;
      padding: 18px;
    }
    .clue p {
      margin: 0;
      color: #94a3b8;
      font-size: 13px;
      font-weight: 700;
    }
    .clue strong {
      display: block;
      margin-top: 10px;
      font-size: 24px;
      color: #c7d2fe;
    }
    .cards {
      margin-top: 26px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
    .cards.four {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .choice-card {
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 28px;
      padding: 24px;
      cursor: pointer;
      text-align: left;
      color: white;
      transition: background .15s ease, transform .15s ease, border-color .15s ease;
      min-height: 170px;
    }
    .choice-card:hover {
      background: rgba(255,255,255,.075);
      transform: translateY(-2px);
      border-color: rgba(129,140,248,.55);
    }
    .choice-card p {
      margin: 0;
    }
    .country-name {
      font-size: clamp(24px, 3vw, 40px);
      font-weight: 900;
      letter-spacing: -0.05em;
      line-height: 1.05;
    }
    .country-meta {
      margin-top: 14px !important;
      color: #64748b;
      font-weight: 700;
    }
    .hidden-value {
      display: none;
      margin-top: 22px !important;
      color: #c7d2fe;
      font-size: 24px;
      font-weight: 900;
    }
    .hidden-year {
      display: none;
      margin-top: 6px !important;
      color: #94a3b8;
      font-size: 13px;
    }
    .revealed .hidden-value,
    .revealed .hidden-year {
      display: block;
    }
    .factor-list {
      display: none;
      margin-top: 20px;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .factor-list.show {
      display: grid;
    }
    .factor-box {
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 18px;
      padding: 16px;
    }
    .factor-box h3 {
      margin: 0 0 10px;
      font-size: 16px;
    }
    .factor-box p {
      margin: 7px 0;
      color: #cbd5e1;
      font-size: 13px;
    }
    .result {
      margin-top: 24px;
      display: none;
      border-radius: 24px;
      padding: 20px;
      line-height: 1.7;
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.04);
    }
    .result.show {
      display: block;
    }
    .result.correct {
      border-color: rgba(52,211,153,.35);
      background: rgba(16,185,129,.12);
    }
    .result.wrong {
      border-color: rgba(248,113,113,.35);
      background: rgba(239,68,68,.12);
    }
    .actions {
      margin-top: 24px;
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
      font-weight: 850;
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
    @media (max-width: 860px) {
      .stats,
      .cards,
      .cards.four,
      .clues,
      .factor-list {
        grid-template-columns: 1fr;
      }
      .site-nav-inner {
        align-items: flex-start;
        flex-direction: column;
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
        <a href="/sources">출처</a>
      </nav>
    </div>
  </header>

  <main>
    <p class="label">Data Challenge</p>
    <h1>공식 국가 데이터를 게임처럼 비교해보세요.</h1>
    <p class="intro">
      Datlora의 공식 국가 지표를 기반으로 만든 인터랙티브 데이터 챌린지입니다.
      지표를 맞히고, 국가를 추론하고, 충격 시나리오에서 더 노출된 국가를 찾아보세요.
    </p>

    <section class="stats">
      <div class="stat-box">
        <p>현재 연속 정답</p>
        <strong id="current-streak">0</strong>
      </div>
      <div class="stat-box">
        <p>최고 기록</p>
        <strong id="best-streak">0</strong>
      </div>
      <div class="stat-box">
        <p>총 정답</p>
        <strong id="total-correct">0</strong>
      </div>
      <div class="stat-box">
        <p>총 시도</p>
        <strong id="total-attempts">0</strong>
      </div>
      <div class="stat-box">
        <p>정답률</p>
        <strong id="accuracy">0%</strong>
      </div>
    </section>

    <section class="modes">
      <button class="mode-button active" type="button" data-mode="higher-lower">Higher or Lower</button>
      <button class="mode-button" type="button" data-mode="detective">Data Detective</button>
      <button class="mode-button" type="button" data-mode="shock">Shock Scenario</button>
      <button class="mode-button" type="button" data-mode="rank-rush">Rank Rush</button>
    </section>

    <section class="game">
      <span class="metric" id="metric">Loading</span>
      <h2 class="question" id="question">문제를 불러오는 중입니다.</h2>
      <div class="scenario" id="scenario"></div>
      <div class="clues" id="clues"></div>
      <div class="cards" id="cards"></div>
      <div class="factor-list" id="factor-list"></div>
      <div class="result" id="result"></div>

      <div class="actions">
        <button class="primary" id="next-button" type="button">다음 문제</button>
        <button class="secondary" id="reset-button" type="button">기록 초기화</button>
        <a class="secondary" href="/topics">주제별 통계 보기</a>
        <a class="secondary" href="/compare?a=KOR&b=USA">국가 비교하기</a>
      </div>
    </section>

    <section class="note">
      이 챌린지는 공식 데이터를 더 쉽게 이해하기 위한 인터랙티브 콘텐츠입니다.
      Shock Scenario의 점수는 공식 지표를 조합한 게임용 비교 점수이며, 정책·투자·법률 판단을 대체하지 않습니다.
    </section>
  </main>

  <script>
    const STORAGE_KEY = "datlora.challenge.stats.v2";
    const defaultStats = {
      currentStreak: 0,
      bestStreak: 0,
      totalCorrect: 0,
      totalAttempts: 0
    };

    let currentMode = "higher-lower";
    let currentQuestion = null;
    let answered = false;

    function loadStats() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...defaultStats };
        return { ...defaultStats, ...JSON.parse(raw) };
      } catch {
        return { ...defaultStats };
      }
    }

    function saveStats(stats) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }

    function updateStatsDisplay() {
      const stats = loadStats();
      const accuracy = stats.totalAttempts > 0
        ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100)
        : 0;

      document.getElementById("current-streak").textContent = stats.currentStreak;
      document.getElementById("best-streak").textContent = stats.bestStreak;
      document.getElementById("total-correct").textContent = stats.totalCorrect;
      document.getElementById("total-attempts").textContent = stats.totalAttempts;
      document.getElementById("accuracy").textContent = accuracy + "%";
    }

    function recordAnswer(isCorrect) {
      const stats = loadStats();

      stats.totalAttempts += 1;

      if (isCorrect) {
        stats.totalCorrect += 1;
        stats.currentStreak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
      } else {
        stats.currentStreak = 0;
      }

      saveStats(stats);
      updateStatsDisplay();
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

    function resetVisuals() {
      document.getElementById("scenario").className = "scenario";
      document.getElementById("scenario").textContent = "";
      document.getElementById("clues").innerHTML = "";
      document.getElementById("cards").innerHTML = "";
      document.getElementById("cards").className = "cards";
      document.getElementById("factor-list").innerHTML = "";
      document.getElementById("factor-list").className = "factor-list";

      const resultEl = document.getElementById("result");
      resultEl.className = "result";
      resultEl.textContent = "";
    }

    function choiceCardHtml(item, answerValue, hiddenValue, hiddenYear) {
      return '<button class="choice-card" type="button" data-answer="' + escapeHtml(answerValue) + '">' +
        '<p class="country-name">' + flagEmoji(item.iso2) + " " + escapeHtml(item.countryName) + '</p>' +
        '<p class="country-meta">' + escapeHtml(item.iso3) + '</p>' +
        '<p class="hidden-value">' + escapeHtml(hiddenValue || "") + '</p>' +
        '<p class="hidden-year">' + escapeHtml(hiddenYear || "") + '</p>' +
      '</button>';
    }

    function bindAnswers() {
      Array.from(document.querySelectorAll("[data-answer]")).forEach(function(button) {
        button.addEventListener("click", function() {
          answer(button.getAttribute("data-answer"));
        });
      });
    }

    function renderTwoChoice(left, right, leftAnswer, rightAnswer) {
      const cards = document.getElementById("cards");
      cards.className = "cards";
      cards.innerHTML =
        choiceCardHtml(left, leftAnswer, left.formattedValue, left.year ? "제공 연도 " + left.year : "") +
        choiceCardHtml(right, rightAnswer, right.formattedValue, right.year ? "제공 연도 " + right.year : "");

      bindAnswers();
    }

    function renderOptions(options, correctMode) {
      const cards = document.getElementById("cards");
      cards.className = options.length >= 4 ? "cards four" : "cards";

      cards.innerHTML = options.map(function(option) {
        return choiceCardHtml(
          option,
          option.iso3,
          option.formattedValue || "",
          option.year ? "제공 연도 " + option.year : ""
        );
      }).join("");

      bindAnswers();
    }

    function renderClues(clues) {
      document.getElementById("clues").innerHTML = clues.map(function(clue) {
        return '<div class="clue">' +
          '<p>' + escapeHtml(clue.labelKo) + " · " + escapeHtml(clue.year || "연도 없음") + '</p>' +
          '<strong>' + escapeHtml(clue.formattedValue) + '</strong>' +
        '</div>';
      }).join("");
    }

    function renderShockFactors(data) {
      const factorList = document.getElementById("factor-list");
      factorList.className = "factor-list show";

      function factorBox(country) {
        return '<div class="factor-box">' +
          '<h3>' + flagEmoji(country.iso2) + " " + escapeHtml(country.countryName) + '</h3>' +
          country.factors.map(function(factor) {
            return '<p>' + escapeHtml(factor.labelKo) + ": " + escapeHtml(factor.formattedValue) + '</p>';
          }).join("") +
        '</div>';
      }

      factorList.innerHTML = factorBox(data.left) + factorBox(data.right);
    }

    function revealAllValues() {
      Array.from(document.querySelectorAll(".choice-card")).forEach(function(card) {
        card.classList.add("revealed");
      });
    }

    async function loadQuestion() {
      answered = false;
      currentQuestion = null;
      resetVisuals();

      document.getElementById("metric").textContent = "Loading";
      document.getElementById("question").textContent = "문제를 불러오는 중입니다.";

      try {
        const response = await fetch("/api/challenge?mode=" + encodeURIComponent(currentMode), {
          cache: "no-store"
        });

        const data = await response.json();

        if (!data.ok) {
          document.getElementById("metric").textContent = "Data unavailable";
          document.getElementById("question").textContent = "현재 문제를 불러오지 못했습니다.";
          return;
        }

        currentQuestion = data;
        document.getElementById("metric").textContent = data.badgeKo || "Data Challenge";
        document.getElementById("question").textContent = data.questionKo;

        if (data.mode === "higher-lower") {
          renderTwoChoice(data.left, data.right, "left", "right");
          return;
        }

        if (data.mode === "detective") {
          renderClues(data.clues);
          renderOptions(data.options, "iso3");
          return;
        }

        if (data.mode === "rank-rush") {
          renderOptions(data.options, "iso3");
          return;
        }

        if (data.mode === "shock") {
          const scenario = document.getElementById("scenario");
          scenario.className = "scenario show";
          scenario.textContent = data.scenarioKo;
          renderTwoChoice(data.left, data.right, "left", "right");
          return;
        }
      } catch {
        document.getElementById("metric").textContent = "Network error";
        document.getElementById("question").textContent = "현재 문제를 불러오지 못했습니다.";
      }
    }

    function answer(value) {
      if (!currentQuestion || answered) return;

      answered = true;

      let isCorrect = false;

      if (currentQuestion.mode === "higher-lower" || currentQuestion.mode === "shock") {
        isCorrect = value === currentQuestion.correct;
      } else {
        isCorrect = value === currentQuestion.correct;
      }

      revealAllValues();

      if (currentQuestion.mode === "shock") {
        renderShockFactors(currentQuestion);
      }

      recordAnswer(isCorrect);

      const resultEl = document.getElementById("result");
      resultEl.className = isCorrect ? "result show correct" : "result show wrong";
      resultEl.textContent = (isCorrect ? "정답입니다. " : "아쉽습니다. ") + currentQuestion.explanationKo;
    }

    Array.from(document.querySelectorAll(".mode-button")).forEach(function(button) {
      button.addEventListener("click", function() {
        currentMode = button.getAttribute("data-mode");

        Array.from(document.querySelectorAll(".mode-button")).forEach(function(item) {
          item.classList.remove("active");
        });

        button.classList.add("active");
        loadQuestion();
      });
    });

    document.getElementById("next-button").addEventListener("click", loadQuestion);

    document.getElementById("reset-button").addEventListener("click", function() {
      if (!confirm("현재 기록을 초기화할까요?")) return;

      saveStats({ ...defaultStats });
      updateStatsDisplay();
    });

    updateStatsDisplay();
    loadQuestion();
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
