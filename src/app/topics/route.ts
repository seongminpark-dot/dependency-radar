import { NextResponse } from "next/server";
import { topics } from "@/lib/topicContent";

export const dynamic = "force-dynamic";

function pageHtml() {
  const cards = topics
    .map(
      (topic) => `
        <a class="card" href="/topics/${topic.slug}">
          <p class="label">${topic.label}</p>
          <h2>${topic.titleKo}</h2>
          <p>${topic.descriptionKo}</p>
          <span>Open topic →</span>
        </a>
      `
    )
    .join("");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Topics | Datlora</title>
  <meta name="description" content="국가별 무역, 에너지, 관세, 수입 의존도 정보를 주제별로 탐색합니다." />
  <style>
    body {
      margin: 0;
      background: #070a14;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 80px 24px;
    }
    .top {
      color: #67e8f9;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: .22em;
      text-transform: uppercase;
    }
    h1 {
      max-width: 850px;
      font-size: clamp(38px, 6vw, 64px);
      line-height: 1.05;
      letter-spacing: -0.05em;
      margin: 22px 0;
    }
    .intro {
      max-width: 780px;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.75;
    }
    .grid {
      display: grid;
      gap: 18px;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      margin-top: 48px;
    }
    .card {
      display: block;
      text-decoration: none;
      color: white;
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.045);
      border-radius: 28px;
      padding: 26px;
      transition: background .15s ease, transform .15s ease;
    }
    .card:hover {
      background: rgba(255,255,255,.08);
      transform: translateY(-2px);
    }
    .card .label {
      color: #67e8f9;
      font-size: 13px;
      font-weight: 700;
      margin: 0 0 14px;
    }
    .card h2 {
      font-size: 24px;
      margin: 0 0 14px;
    }
    .card p {
      color: #94a3b8;
      line-height: 1.65;
      margin: 0;
    }
    .card span {
      display: inline-block;
      margin-top: 22px;
      color: #a5b4fc;
      font-weight: 700;
      font-size: 14px;
    }
    .back {
      display: inline-block;
      margin-bottom: 32px;
      color: #cbd5e1;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 16px;
      padding: 12px 16px;
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
    .site-menu a:hover {
      color: #fff;
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
        <a href="/sources">출처</a>
      </nav>
    </div>
  </header>

  <main>
    <a class="back" href="/">← 홈으로</a>
    <p class="top">Topics</p>
    <h1>국가를 고르기 전에, 필요한 지표부터 찾아보세요.</h1>
    <p class="intro">
      Datlora는 국가별 무역, 에너지, 관세, 수입 의존도 정보를
      주제별로 탐색할 수 있도록 정리합니다. 각 페이지는 공식 출처의 최신 제공 연도를 기준으로 해석합니다.
    </p>
    <section class="grid">
      ${cards}
    </section>
  </main>
</body>
</html>`;
}

export async function GET() {
  return new NextResponse(pageHtml(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
