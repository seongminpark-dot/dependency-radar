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
    .game {
      margin-top: 42px;
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
    .country-card {
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 28px;
      padding: 26px;
      cursor: pointer;
      text-align: left;
      color: white;
      transition: background .15s ease, transform .15s ease, border-color .15s ease;
      min-height: 210px;
    }
    .country-card:hover {
      background: rgba(255,255,255,.075);
      transform: translateY(-2px);
      border-color: rgba(129,140,248,.55);
    }
    .country-card p {
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
      .cards {
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
    <h1>어느 나라의 지표가 더 높을까요?</h1>
    <p class="intro">
      Datlora의 공식 국가 지표를 기반으로 두 나라를 비교해보세요.
      게임처럼 보이지만, 모든 문제는 실제 공식 통계 데이터를 사용합니다.
    </p>

    <section class="game">
      <span class="metric" id="metric">Loading</span>
      <h2 class="question" id="question">문제를 불러오는 중입니다.</h2>

      <div class="cards">
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

      <div class="result" id="result"></div>

      <div class="actions">
        <button class="primary" id="next-button" type="button">다음 문제</button>
        <a class="secondary" href="/topics">주제별 통계 보기</a>
        <a class="secondary" href="/compare?a=KOR&b=USA">국가 비교하기</a>
      </div>
    </section>

    <section class="note">
      이 기능은 공식 지표를 더 쉽게 이해하기 위한 데이터 챌린지입니다.
      값은 국가별 최신 제공 연도 기준이며, 정책·투자·법률 판단을 대체하지 않습니다.
    </section>
  </main>

  <script>
    let currentQuestion = null;
    let answered = false;

    const metricEl = document.getElementById("metric");
    const questionEl = document.getElementById("question");
    const leftCard = document.getElementById("left-card");
    const rightCard = document.getElementById("right-card");
    const resultEl = document.getElementById("result");
    const nextButton = document.getElementById("next-button");

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
      leftCard.classList.add("revealed");
      rightCard.classList.add("revealed");
    }

    function hideValues() {
      leftCard.classList.remove("revealed");
      rightCard.classList.remove("revealed");
    }

    async function loadQuestion() {
      answered = false;
      hideValues();

      resultEl.className = "result";
      resultEl.textContent = "";

      metricEl.textContent = "Loading";
      questionEl.textContent = "문제를 불러오는 중입니다.";

      try {
        const response = await fetch("/api/challenge", {
          cache: "no-store"
        });

        const data = await response.json();

        if (!data.ok) {
          questionEl.textContent = "현재 문제를 불러오지 못했습니다.";
          metricEl.textContent = "Data unavailable";
          return;
        }

        currentQuestion = data;

        metricEl.textContent = data.metric.labelKo;
        questionEl.textContent = data.questionKo;

        setText("left-name", flagEmoji(data.left.iso2) + " " + data.left.countryName);
        setText("left-meta", data.left.iso3);
        setText("left-value", data.left.formattedValue);
        setText("left-year", "제공 연도 " + (data.left.year || "—"));

        setText("right-name", flagEmoji(data.right.iso2) + " " + data.right.countryName);
        setText("right-meta", data.right.iso3);
        setText("right-value", data.right.formattedValue);
        setText("right-year", "제공 연도 " + (data.right.year || "—"));
      } catch {
        questionEl.textContent = "현재 문제를 불러오지 못했습니다.";
        metricEl.textContent = "Network error";
      }
    }

    function answer(side) {
      if (!currentQuestion || answered) return;

      answered = true;
      revealValues();

      const isCorrect = side === currentQuestion.correct;
      resultEl.className = isCorrect ? "result show correct" : "result show wrong";

      const prefix = isCorrect ? "정답입니다. " : "아쉽습니다. ";
      resultEl.textContent = prefix + currentQuestion.explanationKo;
    }

    leftCard.addEventListener("click", function() {
      answer("left");
    });

    rightCard.addEventListener("click", function() {
      answer("right");
    });

    nextButton.addEventListener("click", loadQuestion);

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
