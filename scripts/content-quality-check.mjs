import fs from "fs";
import path from "path";

const root = process.cwd();

const ignoredDirs = new Set([
  ".git",
  ".next",
  "node_modules",
  "out",
  "dist",
  "build",
]);

const checkedExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".txt",
  ".xml",
]);

const ignoredFileNames = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
]);

const blockedPatterns = [
  { label: "prototype", pattern: /\bprototype\b/i },
  { label: "first build", pattern: /first build/i },
  { label: "not connected", pattern: /not connected/i },
  { label: "no monetization", pattern: /no monetization/i },
  { label: "risk score", pattern: /risk score/i },
  { label: "arbitrary risk score", pattern: /arbitrary risk score/i },
  { label: "위험 점수", pattern: /위험 점수/ },
  { label: "위험도 점수", pattern: /위험도 점수/ },
  { label: "100점 만점", pattern: /100점 만점/ },
  { label: "site-health", pattern: /site-health/i },
  { label: "old vercel domain", pattern: /dependency-radar-three\.vercel\.app/i },
];

function walk(dir) {
  const results = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
      continue;
    }

    if (ignoredFileNames.has(entry.name)) continue;
    if (!checkedExtensions.has(path.extname(entry.name))) continue;

    results.push(fullPath);
  }

  return results;
}

const files = walk(root);
const matches = [];

for (const file of files) {
  const relative = path.relative(root, file);
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const item of blockedPatterns) {
      if (item.pattern.test(line)) {
        matches.push({
          file: relative,
          line: index + 1,
          label: item.label,
          text: line.trim(),
        });
      }
    }
  });
}

if (matches.length > 0) {
  console.log("CONTENT QUALITY CHECK FAILED");
  console.log("");

  for (const match of matches) {
    console.log(`${match.file}:${match.line} [${match.label}]`);
    console.log(`  ${match.text}`);
  }

  process.exit(1);
}

console.log("CONTENT QUALITY CHECK PASSED");
