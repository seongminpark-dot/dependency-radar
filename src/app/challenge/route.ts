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
      letter-spacing: -0.02em;
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
      max-width: 900px;
      font-size: clamp(42px, 7vw, 76px);
      line-height: 1.02;
      letter-spacing: -0.06em;
      margin: 22px 0;
    }
    .intro {
      max-width: 760px;
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
      background: rgba(255,255,255,.045);
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
    .question {
      margin: 22px 0 0;
      font-size: clamp(26px, 4vw, 42px);
      line-height: 1.15;
      letter-spacing: -0.04em;
      font-weight: 900;
    }
    .cards {
      margin-top: 26px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }
    .country-card,
    .option-card {
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 28px;
      padding: 26px;
      cursor: pointer;
      text-align: left;
      color: white;
      transition: background .15s ease, transform .15s ease, border-color .15s ease;
      min-height: 190px;
    }
    .country-card:hover,
    .option-card:hover {
      background: rgba(255,255,255,.075);
      transform: translateY(-2px);
      border-color: rgba(129,140,248,.55);
    }
    .country-card p,
    .option-card p {
      margin: 0;
    }
    .country-name {
      font-size: clamp(28px, 4vw, 44px);
      font-weight: 900;
      letter-spacing: -0.05em;
      line-height: 1.05;
    }
    .country-meta {
      margin-top: 14px !important;
      color: #64748b;
      font-weight: 700;
    }
    .value {
      display: none;
      margin-top: 26px !important;
      color: #c7d2fe;
      font-size: 28px;
      font-weight: 900;
    }
    .year {
      display: none;
      margin-top: 6px !important;
      color: #94a3b8;
      font-size: 13px;
    }
    .revealed .value,
    .revealed .year {
      display: block;
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
    .duel-table {
      display: none;
      margin-top: 22px;
      overflow-x: auto;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 22px;
    }
    .duel-table.show {
      display: block;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 720px;
      background: #0b0f1c;
    }
    th,
    td {
      border-bottom: 1px solid rgba(255,255,255,.08);
      padding: 14px;
      text-align: left;
      font-size: 14px;
    }
    th {
      color: #c7d2fe;
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
    @media (max-width: 760px) {
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
      .stats,
      .cards,
      .clues {
        grid-template-columns: 1fr;
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
        <a href="/sources">출처</a>
      </nav>
    </div>
  </header>

  <main>
    <p class="label">Data Challenge</p>
    <h1>공식 국가 데이터를 게임처럼 비교해보세요.</h1>
    <p class="intro">
      Datlora의 공식 국가 지표를 기반으로 만든 데이터 챌린지입니다.
      정답 수와 최고 기록은 이 브라우저에 저장되며, IP나 개인정보는 저장하지 않습니다.
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
      <button class="mode-button active" type="button" data-mode="higher-lower">
        Higher or Lower
      </button>
      <button class="mode-button" type="button" data-mode="duel">
        Country Duel
      </button>
      <button class="mode-button" type="button" data-mode="detective">
        Data Detective
      </button>
    </section>

    <section class="game">
      <span class="metric" id="metric">Loading</span>
      <h2 class="question" id="question">문제를 불러오는 중입니다.</h2>

      <div class="clues" id="clues"></div>

      <div class="cards" id="cards">
        <button class="country-card" id="left-card" type="button">
          <p class="country-name" id="left-name">—</p>
          <p class="country-meta" id="left-meta">—</p>
          <p class="value" id="left-value">—</p>
          <p class="year" id="left-year">—</p>
        </button>

        <button class="country-card" id="right-card" type="button">
          <p class="country-name" id="right-name">—</p>
          <p class="country-meta" id="right-meta">—</p>
          <p class="value" id="right-value">—</p>
          <p class="year" id="right-year">—</p>
        </button>
      </div>

      <div class="duel-table" id="duel-table"></div>

      <div class="result" id="result"></div>

      <div class="actions">
        <button class="primary" id="next-button" type="button">다음 문제</button>
        <button class="secondary" id="reset-button" type="button">기록 초기화</button>
        <a class="secondary" href="/topics">주제별 통계 보기</a>
        <a class="secondary" href="/compare?a=KOR&b=USA">국가 비교하기</a>
      </div>
    </section>

    <section class="note">
      Higher or Lower는 한 지표의 값을 비교합니다. Country Duel은 여러 지표에서 더 높은 값을 가진 국가를 맞히는 모드입니다.
      Data Detective는 지표 단서를 보고 국가를 맞히는 모드입니다. 모든 문제는 Datlora에 저장된 공식 지표를 사용합니다.
    </section>
  </main>

  <script>
    const STORAGE_KEY = "datlora.challenge.stats.v1";

    let currentMode = "higher-lower";
    let currentQuestion = null;
    let answered = false;

    const defaultStats = {
      currentStreak: 0,
      bestStreak: 0,
      totalCorrect: 0,
      totalAttempts: 0
    };

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
      return iso2
        .toUpperCase()
        .replace(/./g, function(char) {
          return String.fromCodePoint(127397 + char.charCodeAt(0));
        });
    }

    function setText(id, value) {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    }

    function revealValues() {
      document.getElementById("left-card").classList.add("revealed");
      document.getElementById("right-card").classList.add("revealed");
    }

    function hideValues() {
      document.getElementById("left-card").classList.remove("revealed");
      document.getElementById("right-card").classList.remove("revealed");
    }

    function resetVisuals() {
      hideValues();

      const resultEl = document.getElementById("result");
      resultEl.className = "result";
      resultEl.textContent = "";

      document.getElementById("clues").innerHTML = "";
      document.getElementById("duel-table").innerHTML = "";
      document.getElementById("duel-table").className = "duel-table";
    }

    function renderTwoCountryCards(left, right) {
      const cards = document.getElementById("cards");

      cards.innerHTML = \`
        <button class="country-card" id="left-card" type="button">
          <p class="country-name" id="left-name"></p>
          <p class="country-meta" id="left-meta"></p>
          <p class="value" id="left-value"></p>
          <p class="year" id="left-year"></p>
        </button>

        <button class="country-card" id="right-card" type="button">
          <p class="country-name" id="right-name"></p>
          <p class="country-meta" id="right-meta"></p>
          <p class="value" id="right-value"></p>
          <p class="year" id="right-year"></p>
        </button>
      \`;

      setText("left-name", flagEmoji(left.iso2) + " " + left.countryName);
      setText("left-meta", left.iso3);
      setText("left-value", left.formattedValue || "");
      setText("left-year", left.year ? "제공 연도 " + left.year : "");

      setText("right-name", flagEmoji(right.iso2) + " " + right.countryName);
      setText("right-meta", right.iso3);
      setText("right-value", right.formattedValue || "");
      setText("right-year", right.year ? "제공 연도 " + right.year : "");

      document.getElementById("left-card").addEventListener("click", function() {
        answer("left");
      });

      document.getElementById("right-card").addEventListener("click", function() {
        answer("right");
      });
    }

    function renderDetectiveOptions(options) {
      const cards = document.getElementById("cards");

      cards.innerHTML = options
        .map(function(option) {
          return \`
            <button class="option-card" type="button" data-iso3="\${option.iso3}">
              <p class="country-name">\${flagEmoji(option.iso2)} \${option.countryName}</p>
              <p class="country-meta">\${option.iso3}</p>
            </button>
          \`;
        })
        .join("");

      Array.from(document.querySelectorAll(".option-card")).forEach(function(button) {
        button.addEventListener("click", function() {
          answer(button.getAttribute("data-iso3"));
        });
      });
    }

    function renderClues(clues) {
      const cluesEl = document.getElementById("clues");

      cluesEl.innerHTML = clues
        .map(function(clue) {
          return \`
            <div class="clue">
              <p>\${clue.labelKo} · \${clue.year || "연도 없음"}</p>
              <strong>\${clue.formattedValue}</strong>
            </div>
          \`;
        })
        .join("");
    }

    function renderDuelTable(metrics) {
      const table = document.getElementById("duel-table");
      table.className = "duel-table show";

      table.innerHTML = \`
        <table>
          <thead>
            <tr>
              <th>지표</th>
              <th>왼쪽</th>
              <th>오른쪽</th>
              <th>더 높은 값</th>
            </tr>
          </thead>
          <tbody>
            \${metrics
              .map(function(metric) {
                const winner =
                  metric.winner === "left"
                    ? "왼쪽"
                    : metric.winner === "right"
                      ? "오른쪽"
                      : "동일";

                return \`
                  <tr>
                    <td>\${metric.labelKo}</td>
                    <td>\${metric.leftFormatted}<br /><small>\${metric.leftYear || ""}</small></td>
                    <td>\${metric.rightFormatted}<br /><small>\${metric.rightYear || ""}</small></td>
                    <td>\${winner}</td>
                  </tr>
                \`;
              })
              .join("")}
          </tbody>
        </table>
      \`;
    }

    async function loadQuestion() {
      answered = false;
      resetVisuals();

      document.getElementById("metric").textContent = "Loading";
      document.getElementById("question").textContent = "문제를 불러오는 중입니다.";

      try {
        const response = await fetch("/api/challenge?mode=" + encodeURIComponent(currentMode), {
          cache: "no-store"
        });

        const data = await response.json();

        if (!data.ok) {
          document.getElementById("question").textContent = "현재 문제를 불러오지 못했습니다.";
          document.getElementById("metric").textContent = "Data unavailable";
          return;
        }

        currentQuestion = data;

        if (data.mode === "higher-lower") {
          document.getElementById("metric").textContent = data.metric.labelKo;
          document.getElementById("question").textContent = data.questionKo;
          renderTwoCountryCards(data.left, data.right);
          return;
        }

        if (data.mode === "duel") {
          document.getElementById("metric").textContent = "Country Duel";
          document.getElementById("question").textContent = data.questionKo;
          renderTwoCountryCards(
            {
              ...data.left,
              formattedValue: data.left.score + "개 지표",
              year: "정답 공개 후 세부 지표 표시"
            },
            {
              ...data.right,
              formattedValue: data.right.score + "개 지표",
              year: "정답 공개 후 세부 지표 표시"
            }
          );
          return;
        }

        if (data.mode === "detective") {
          document.getElementById("metric").textContent = "Data Detective";
          document.getElementById("question").textContent = data.questionKo;
          renderClues(data.clues);
          renderDetectiveOptions(data.options);
          return;
        }
      } catch {
        document.getElementById("question").textContent = "현재 문제를 불러오지 못했습니다.";
        document.getElementById("metric").textContent = "Network error";
      }
    }

    function answer(value) {
      if (!currentQuestion || answered) return;

      answered = true;

      let isCorrect = false;

      if (currentQuestion.mode === "detective") {
        isCorrect = value === currentQuestion.correct;
      } else {
        isCorrect = value === currentQuestion.correct;
        revealValues();
      }

      if (currentQuestion.mode === "duel") {
        renderDuelTable(currentQuestion.metrics);
      }

      recordAnswer(isCorrect);

      const resultEl = document.getElementById("result");
      resultEl.className = isCorrect ? "result show correct" : "result show wrong";

      const prefix = isCorrect ? "정답입니다. " : "아쉽습니다. ";
      resultEl.textContent = prefix + currentQuestion.explanationKo;
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
      if (!confirm("이 브라우저에 저장된 Data Challenge 기록을 초기화할까요?")) return;

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
