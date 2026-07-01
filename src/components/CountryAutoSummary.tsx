"use client";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";
type LooseCountryRow = Record<string, unknown>;

type Stat = {
  value: number;
  year: string;
};

type MetricKey =
  | "importsGdp"
  | "fuelImportShare"
  | "foodImportShare"
  | "tariffRate"
  | "logisticsIndex"
  | "energyImportPercent";

type MetricConfig = {
  key: MetricKey;
  labelKo: string;
  labelEn: string;
  unit: "%" | "index";
};

type AnalyzedMetric = MetricConfig & {
  value: number;
  year: string;
  levelKo: string;
  levelEn: string;
  sentenceKo: string;
  sentenceEn: string;
};

const metricConfigs: MetricConfig[] = [
  {
    key: "importsGdp",
    labelKo: "수입/GDP",
    labelEn: "Imports/GDP",
    unit: "%",
  },
  {
    key: "fuelImportShare",
    labelKo: "연료 수입 비중",
    labelEn: "Fuel import share",
    unit: "%",
  },
  {
    key: "foodImportShare",
    labelKo: "식량 수입 비중",
    labelEn: "Food import share",
    unit: "%",
  },
  {
    key: "tariffRate",
    labelKo: "관세율",
    labelEn: "Tariff rate",
    unit: "%",
  },
  {
    key: "logisticsIndex",
    labelKo: "물류지수",
    labelEn: "Logistics index",
    unit: "index",
  },
  {
    key: "energyImportPercent",
    labelKo: "에너지 순수입",
    labelEn: "Net energy imports",
    unit: "%",
  },
];

function normalizeLanguage(language?: string): Language {
  const supported = ["ko", "en", "ja", "zh", "es", "fr", "de"];

  if (language && supported.includes(language)) {
    return language as Language;
  }

  return "ko";
}

function readStat(row: LooseCountryRow | null | undefined, key: MetricKey): Stat | null {
  if (!row) return null;

  const raw = row[key];

  if (raw === null || raw === undefined || raw === "") return null;

  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return null;

    return {
      value: raw,
      year: "",
    };
  }

  if (typeof raw !== "object") return null;

  const stat = raw as Record<string, unknown>;
  const value = Number(stat.value);

  if (!Number.isFinite(value)) return null;

  const year =
    typeof stat.year === "string" || typeof stat.year === "number"
      ? String(stat.year)
      : "";

  return {
    value,
    year,
  };
}

function formatValue(value: number, unit: MetricConfig["unit"], language: Language) {
  const locale = language === "ko" ? "ko-KR" : "en-US";

  const formatted = value.toLocaleString(locale, {
    maximumFractionDigits: 2,
  });

  if (unit === "%") return `${formatted}%`;

  return formatted;
}

function analyzeMetric(
  key: MetricKey,
  value: number,
  labelKo: string,
  labelEn: string
) {
  if (key === "importsGdp") {
    if (value >= 70) {
      return {
        levelKo: "매우 높은 편",
        levelEn: "very high",
        sentenceKo: `${labelKo}가 매우 높아 경제가 해외 공급과 강하게 연결되어 있습니다.`,
        sentenceEn: `${labelEn} is very high, suggesting strong exposure to external supply flows.`,
      };
    }

    if (value >= 40) {
      return {
        levelKo: "높은 편",
        levelEn: "high",
        sentenceKo: `${labelKo}가 높은 편이라 해외 공급 변화에 대한 연결도가 큽니다.`,
        sentenceEn: `${labelEn} is high, indicating meaningful exposure to external supply conditions.`,
      };
    }

    if (value >= 20) {
      return {
        levelKo: "중간 수준",
        levelEn: "moderate",
        sentenceKo: `${labelKo}는 중간 수준으로, 경제 규모 대비 수입 연결도가 일정하게 존재합니다.`,
        sentenceEn: `${labelEn} is moderate relative to the size of the economy.`,
      };
    }

    return {
      levelKo: "낮은 편",
      levelEn: "low",
      sentenceKo: `${labelKo}는 낮은 편으로, 경제 규모 대비 수입 비중이 크지 않습니다.`,
      sentenceEn: `${labelEn} is relatively low compared with the size of the economy.`,
    };
  }

  if (key === "fuelImportShare") {
    if (value >= 25) {
      return {
        levelKo: "매우 높은 편",
        levelEn: "very high",
        sentenceKo: `${labelKo}이 매우 높아 에너지 가격과 공급망 변화에 민감할 수 있습니다.`,
        sentenceEn: `${labelEn} is very high, which may increase sensitivity to energy price and supply shocks.`,
      };
    }

    if (value >= 10) {
      return {
        levelKo: "높은 편",
        levelEn: "high",
        sentenceKo: `${labelKo}이 높은 편이라 연료 관련 무역 노출도가 큽니다.`,
        sentenceEn: `${labelEn} is high, showing notable fuel-related trade exposure.`,
      };
    }

    return {
      levelKo: "낮거나 중간 수준",
      levelEn: "low to moderate",
      sentenceKo: `${labelKo}은 낮거나 중간 수준으로 표시됩니다.`,
      sentenceEn: `${labelEn} is shown as low to moderate.`,
    };
  }

  if (key === "foodImportShare") {
    if (value >= 15) {
      return {
        levelKo: "높은 편",
        levelEn: "high",
        sentenceKo: `${labelKo}이 높은 편이라 식량·농산물 수입 의존도를 함께 볼 필요가 있습니다.`,
        sentenceEn: `${labelEn} is high, so food and agricultural import exposure should be reviewed carefully.`,
      };
    }

    if (value >= 7) {
      return {
        levelKo: "중간 수준",
        levelEn: "moderate",
        sentenceKo: `${labelKo}은 중간 수준으로 해석할 수 있습니다.`,
        sentenceEn: `${labelEn} is moderate.`,
      };
    }

    return {
      levelKo: "낮은 편",
      levelEn: "low",
      sentenceKo: `${labelKo}은 낮은 편으로 표시됩니다.`,
      sentenceEn: `${labelEn} is relatively low.`,
    };
  }

  if (key === "tariffRate") {
    if (value >= 10) {
      return {
        levelKo: "높은 편",
        levelEn: "high",
        sentenceKo: `${labelKo}이 높은 편이라 무역 장벽과 수입 비용을 함께 해석해야 합니다.`,
        sentenceEn: `${labelEn} is high, so trade barriers and import costs should be considered.`,
      };
    }

    if (value >= 3) {
      return {
        levelKo: "중간 수준",
        levelEn: "moderate",
        sentenceKo: `${labelKo}은 중간 수준으로 표시됩니다.`,
        sentenceEn: `${labelEn} is moderate.`,
      };
    }

    return {
      levelKo: "낮은 편",
      levelEn: "low",
      sentenceKo: `${labelKo}은 낮은 편으로 표시됩니다.`,
      sentenceEn: `${labelEn} is relatively low.`,
    };
  }

  if (key === "logisticsIndex") {
    if (value >= 3.5) {
      return {
        levelKo: "강한 편",
        levelEn: "strong",
        sentenceKo: `${labelKo}가 강한 편이라 무역·물류 처리 역량이 비교적 우수한 것으로 볼 수 있습니다.`,
        sentenceEn: `${labelEn} is strong, suggesting relatively solid trade and logistics capacity.`,
      };
    }

    if (value >= 2.7) {
      return {
        levelKo: "중간 수준",
        levelEn: "moderate",
        sentenceKo: `${labelKo}는 중간 수준으로 표시됩니다.`,
        sentenceEn: `${labelEn} is moderate.`,
      };
    }

    return {
      levelKo: "낮은 편",
      levelEn: "low",
      sentenceKo: `${labelKo}가 낮은 편이라 물류 성과를 다른 지표와 함께 확인해야 합니다.`,
      sentenceEn: `${labelEn} is relatively low, so logistics performance should be checked with other indicators.`,
    };
  }

  if (key === "energyImportPercent") {
    if (value >= 50) {
      return {
        levelKo: "높은 에너지 수입 노출",
        levelEn: "high energy import exposure",
        sentenceKo: `${labelKo}이 높아 에너지 수입 노출도가 큰 편입니다.`,
        sentenceEn: `${labelEn} is high, indicating strong energy import exposure.`,
      };
    }

    if (value > 0) {
      return {
        levelKo: "에너지 순수입 상태",
        levelEn: "net energy importer",
        sentenceKo: `${labelKo}이 양수라 에너지 순수입 구조로 볼 수 있습니다.`,
        sentenceEn: `${labelEn} is positive, indicating a net energy import position.`,
      };
    }

    return {
      levelKo: "에너지 순수출 또는 낮은 순수입",
      levelEn: "net energy exporter or low net imports",
      sentenceKo: `${labelKo}이 0 이하라 에너지 순수출 또는 낮은 순수입 구조로 볼 수 있습니다.`,
      sentenceEn: `${labelEn} is zero or negative, suggesting net energy exports or low net imports.`,
    };
  }

  return {
    levelKo: "확인 가능",
    levelEn: "available",
    sentenceKo: `${labelKo} 값을 확인할 수 있습니다.`,
    sentenceEn: `${labelEn} is available.`,
  };
}

function buildAnalyzedMetrics(
  row: LooseCountryRow | null | undefined
): AnalyzedMetric[] {
  return metricConfigs
    .map((metric) => {
      const stat = readStat(row, metric.key);

      if (!stat) return null;

      const analysis = analyzeMetric(
        metric.key,
        stat.value,
        metric.labelKo,
        metric.labelEn
      );

      return {
        ...metric,
        value: stat.value,
        year: stat.year,
        ...analysis,
      };
    })
    .filter((item): item is AnalyzedMetric => Boolean(item));
}

function buildLeadSentence({
  countryName,
  analyzed,
  language,
}: {
  countryName: string;
  analyzed: AnalyzedMetric[];
  language: Language;
}) {
  const isKo = language === "ko";

  const imports = analyzed.find((item) => item.key === "importsGdp");
  const fuel = analyzed.find((item) => item.key === "fuelImportShare");
  const food = analyzed.find((item) => item.key === "foodImportShare");
  const tariff = analyzed.find((item) => item.key === "tariffRate");

  if (isKo) {
    const parts: string[] = [];

    if (imports) {
      parts.push(`수입/GDP는 ${imports.levelKo}`);
    }

    if (fuel) {
      parts.push(`연료 수입 비중은 ${fuel.levelKo}`);
    }

    if (food) {
      parts.push(`식량 수입 비중은 ${food.levelKo}`);
    }

    if (tariff) {
      parts.push(`관세율은 ${tariff.levelKo}`);
    }

    if (parts.length === 0) {
      return `${countryName}의 공식 지표가 일부 제공되고 있으며, 각 지표는 출처별 최신 제공 연도를 기준으로 해석해야 합니다.`;
    }

    return `${countryName}은 공식 데이터 기준으로 ${parts.join(", ")}입니다. 아래 요약은 수치를 임의로 추정하지 않고 제공된 공식값만 설명합니다.`;
  }

  const parts: string[] = [];

  if (imports) {
    parts.push(`imports/GDP is ${imports.levelEn}`);
  }

  if (fuel) {
    parts.push(`fuel import share is ${fuel.levelEn}`);
  }

  if (food) {
    parts.push(`food import share is ${food.levelEn}`);
  }

  if (tariff) {
    parts.push(`tariff rate is ${tariff.levelEn}`);
  }

  if (parts.length === 0) {
    return `${countryName} has partial official indicators available. Each value should be interpreted using the latest source year shown.`;
  }

  return `${countryName} shows the following official-data profile: ${parts.join(", ")}. This summary describes available official values without artificial estimates.`;
}

export default function CountryAutoSummary({
  row,
  countryName,
  language,
}: {
  row?: LooseCountryRow | null;
  iso3?: string;
  countryName?: string;
  language?: string;
}) {
  const lang = normalizeLanguage(language);
  const isKo = lang === "ko";
  const resolvedCountryName = countryName || (isKo ? "이 국가" : "This country");
  const analyzed = buildAnalyzedMetrics(row);

  if (analyzed.length === 0) {
    return null;
  }

  const leadSentence = buildLeadSentence({
    countryName: resolvedCountryName,
    analyzed,
    language: lang,
  });

  return (
    <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            {isKo ? "자동 요약" : "Auto summary"}
          </p>
          <h3 className="mt-3 text-2xl font-bold text-white">
            {isKo ? "공식 지표 기반 국가 요약" : "Country summary from official indicators"}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-xs font-semibold text-slate-300">
          {isKo ? "추정값 없음 · 공식값만 사용" : "No estimates · official values only"}
        </div>
      </div>

      <p className="mt-5 max-w-5xl text-sm leading-7 text-cyan-50/85">
        {leadSentence}
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {analyzed.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  {isKo ? item.labelKo : item.labelEn}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.year
                    ? isKo
                      ? `제공 연도 ${item.year}`
                      : `Source year ${item.year}`
                    : isKo
                      ? "제공 연도 확인 중"
                      : "Source year unavailable"}
                </p>
              </div>

              <p className="whitespace-nowrap text-lg font-bold text-indigo-200">
                {formatValue(item.value, item.unit, lang)}
              </p>
            </div>

            <p className="mt-3 text-sm font-semibold text-cyan-200">
              {isKo ? item.levelKo : item.levelEn}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              {isKo ? item.sentenceKo : item.sentenceEn}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-cyan-50/60">
        {isKo
          ? "이 요약은 Datlora가 보유한 공식 지표를 설명 문장으로 변환한 것입니다. 정책, 투자, 법률 판단을 대체하지 않습니다."
          : "This summary converts available official indicators into explanatory text. It does not replace policy, investment, or legal judgment."}
      </p>
    </section>
  );
}
