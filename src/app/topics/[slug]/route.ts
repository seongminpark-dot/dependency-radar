import { NextResponse } from "next/server";
import { getTopic, topics } from "@/lib/topicContent";

export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function topicHtml(slug: string) {
  const topic = getTopic(slug);

  if (!topic) return null;

  const questions = topic.questionsKo
    .map((question) => `<li>${escapeHtml(question)}</li>`)
    .join("");

  const indicators = topic.indicatorsKo
    .map((indicator) => `<span>${escapeHtml(indicator)}</span>`)
    .join("");

  const otherTopics = topics
    .filter((item) => item.slug !== topic.slug)
    .map((item) => `<a href="/topics/${item.slug}">${escapeHtml(item.titleKo)}</a>`)
    .join("");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(topic.titleEn)} | Trade Dependency Atlas</title>
  <meta name="description" content="${escapeHtml(topic.descriptionEn)}" />
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
    a {
      color: inherit;
    }
    .back {
      display: inline-block;
      margin-bottom: 34px;
      color: #cbd5e1;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 16px;
      padding: 12px 16px;
    }
    .label {
      color: #67e8f9;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: .22em;
      text-transform: uppercase;
      margin: 0;
    }
    h1 {
      max-width: 900px;
      font-size: clamp(38px, 6vw, 64px);
      line-height: 1.05;
      letter-spacing: -0.05em;
      margin: 22px 0;
    }
    .intro {
      max-width: 850px;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.75;
    }
    .notice {
      margin-top: 34px;
      border: 1px solid rgba(96,165,250,.28);
      background: rgba(59,130,246,.12);
      border-radius: 28px;
      padding: 24px;
      color: #dbeafe;
      line-height: 1.7;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px;
      margin-top: 36px;
    }
    .box {
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.045);
      border-radius: 28px;
      padding: 26px;
    }
    .box h2 {
      margin: 0 0 18px;
      font-size: 24px;
    }
    li {
      margin: 12px 0;
      color: #cbd5e1;
      line-height: 1.6;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .chips span,
    .links a {
      display: inline-block;
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 16px;
      padding: 12px 14px;
      color: #e2e8f0;
      text-decoration: none;
      font-size: 14px;
      font-weight: 650;
    }
    .cta {
      margin-top: 36px;
      border: 1px solid rgba(16,185,129,.28);
      background: rgba(16,185,129,.12);
      border-radius: 28px;
      padding: 26px;
    }
    .cta a {
      display: inline-block;
      margin-top: 18px;
      margin-right: 10px;
      border-radius: 16px;
      background: #34d399;
      color: #06130d;
      text-decoration: none;
      font-weight: 800;
      padding: 12px 16px;
    }
    .links {
      margin-top: 36px;
    }
    .links div {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }
    @media (max-width: 760px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main>
    <a class="back" href="/topics">← Topics</a>
    <p class="label">${escapeHtml(topic.label)}</p>
    <h1>${escapeHtml(topic.titleKo)}</h1>
    <p class="intro">${escapeHtml(topic.descriptionKo)}</p>

    <section class="notice">
      <strong>공식 출처 기준</strong><br />
      ${escapeHtml(topic.sourceKo)}<br />
      ${escapeHtml(topic.sourceEn)}
    </section>

    <section class="grid">
      <div class="box">
        <h2>이 페이지에서 확인할 질문</h2>
        <ul>${questions}</ul>
      </div>
      <div class="box">
        <h2>관련 지표</h2>
        <div class="chips">${indicators}</div>
      </div>
    </section>

    <section class="cta">
      <h2>국가별 상세 데이터로 이동</h2>
      <p>
        특정 국가의 실제 수치가 필요하면 국가 상세 페이지에서 World Bank,
        UN Comtrade, WITS/WTO, EIA 데이터를 함께 확인하세요.
      </p>
      <a href="/">국가 검색하기 →</a>
      <a href="/country/KOR">대한민국 보기</a>
      <a href="/country/USA">United States 보기</a>
    </section>

    <section class="links">
      <h2>다른 주제 보기</h2>
      <div>${otherTopics}</div>
    </section>
  </main>
</body>
</html>`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const html = topicHtml(slug);

  if (!html) {
    return new NextResponse("Topic not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
