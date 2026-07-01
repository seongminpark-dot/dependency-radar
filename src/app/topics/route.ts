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
  <title>Topics | Trade Dependency Atlas</title>
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
  </style>
</head>
<body>
  <main>
    <a class="back" href="/">← Home</a>
    <p class="top">Topics</p>
    <h1>국가를 고르기 전에, 필요한 지표부터 찾아보세요.</h1>
    <p class="intro">
      Trade Dependency Atlas는 국가별 무역, 에너지, 관세, 수입 의존도 정보를
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
