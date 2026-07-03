const baseUrl = "https://datlora.com";

const okUrls = [
  "/",
  "/countries",
  "/news",
  "/issues",
  "/issues/oil-shock",
  "/issues/food-import-risk",
  "/issues/tariff-pressure",
  "/issues/supply-chain",
  "/topics",
  "/compare?a=KOR&b=USA",
  "/sources",
  "/methodology",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/labs",
  "/country/KOR",
  "/country/USA",
  "/country/JPN",
  "/country/DEU",
  "/news/country/KOR",
  "/news/country/USA",
  "/news/country/JPN",
  "/sitemap.xml",
  "/robots.txt",
];

const notFoundUrls = [
  "/site-health",
  "/country/XXX",
  "/news/country/XXX",
  "/issues/unknown-issue",
];

async function checkUrl(path, expected) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": "Datlora live URL checker",
      },
    });

    clearTimeout(timeout);

    const status = response.status;
    const passed =
      expected === "ok"
        ? status >= 200 && status < 400
        : status === 404;

    return {
      url,
      status,
      expected,
      passed,
    };
  } catch (error) {
    clearTimeout(timeout);

    return {
      url,
      status: "ERROR",
      expected,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const results = [];

for (const path of okUrls) {
  results.push(await checkUrl(path, "ok"));
}

for (const path of notFoundUrls) {
  results.push(await checkUrl(path, "404"));
}

const failed = results.filter((item) => !item.passed);

for (const item of results) {
  const mark = item.passed ? "PASS" : "FAIL";
  console.log(`${mark} ${item.status} ${item.url} expected=${item.expected}`);

  if (item.error) {
    console.log(`  ${item.error}`);
  }
}

if (failed.length > 0) {
  console.log("");
  console.log("LIVE URL CHECK FAILED");
  process.exit(1);
}

console.log("");
console.log("LIVE URL CHECK PASSED");
