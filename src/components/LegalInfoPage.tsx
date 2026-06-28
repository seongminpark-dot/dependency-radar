"use client";

import { useEffect, useState } from "react";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";
type PageType = "sources" | "privacy" | "terms" | "disclaimer";

const languageLabels: Record<Language, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

const common = {
  ko: {
    back: "← 메인 대시보드로 돌아가기",
    contact: "문의",
    emailText: "데이터 오류, 협업, 서비스 문의는 아래 이메일로 연락해 주세요.",
  },
  en: {
    back: "← Back to main dashboard",
    contact: "Contact",
    emailText: "For data corrections, collaboration, or service inquiries, contact the email below.",
  },
  ja: {
    back: "← メインダッシュボードに戻る",
    contact: "お問い合わせ",
    emailText: "データ修正、協業、サービスのお問い合わせは下記メールまでご連絡ください。",
  },
  zh: {
    back: "← 返回主仪表板",
    contact: "联系",
    emailText: "如需数据更正、合作或服务咨询，请通过以下邮箱联系。",
  },
  es: {
    back: "← Volver al panel principal",
    contact: "Contacto",
    emailText: "Para correcciones de datos, colaboración o consultas del servicio, contacte al correo siguiente.",
  },
  fr: {
    back: "← Retour au tableau de bord",
    contact: "Contact",
    emailText: "Pour toute correction de données, collaboration ou demande de service, contactez l’e-mail ci-dessous.",
  },
  de: {
    back: "← Zurück zum Hauptdashboard",
    contact: "Kontakt",
    emailText: "Für Datenkorrekturen, Zusammenarbeit oder Serviceanfragen kontaktieren Sie bitte die folgende E-Mail.",
  },
};

const pages = {
  sources: {
    ko: {
      title: "데이터 출처",
      intro: "Dependency Radar는 World Bank 공개 지표와 Natural Earth 지도 경계 데이터를 사용합니다. 일부 값은 가독성을 위해 재구성, 번역, 정렬, 필터링 또는 시각화될 수 있습니다.",
      sections: [
        {
          title: "World Bank Open Data",
          body: "국가별 에너지, 연료, 식량, 수입, 관세, 물류 지표는 World Bank API에서 가져옵니다. 각 값에는 가능한 경우 최신 제공 연도가 함께 표시됩니다.",
        },
        {
          title: "지도 데이터",
          body: "세계 지도 시각화는 Natural Earth 지도 경계 데이터를 world-atlas 패키지를 통해 사용합니다. Natural Earth 데이터는 public domain으로 제공됩니다.",
        },
        {
          title: "승인 관계 없음",
          body: "Dependency Radar는 The World Bank, Natural Earth, OpenStreetMap, Vercel, Upstash와 제휴, 후원, 승인 관계가 없습니다.",
        },
      ],
    },
    en: {
      title: "Data Sources",
      intro: "Dependency Radar uses public World Bank indicators and Natural Earth map boundary data. Some values may be reformatted, translated, sorted, filtered, or visualized for readability.",
      sections: [
        {
          title: "World Bank Open Data",
          body: "Country-level energy, fuel, food, import, tariff, and logistics indicators are retrieved from the World Bank API. Each value includes the latest available year when possible.",
        },
        {
          title: "Map boundary data",
          body: "The world map visualization uses Natural Earth boundary data through the world-atlas package. Natural Earth data is public domain.",
        },
        {
          title: "No endorsement",
          body: "Dependency Radar is not affiliated with, sponsored by, or endorsed by The World Bank, Natural Earth, OpenStreetMap, Vercel, or Upstash.",
        },
      ],
    },
    ja: {
      title: "データ出典",
      intro: "Dependency RadarはWorld Bankの公開指標とNatural Earthの地図境界データを使用します。",
      sections: [
        { title: "World Bank Open Data", body: "エネルギー、燃料、食料、輸入、関税、物流指標はWorld Bank APIから取得されます。" },
        { title: "地図データ", body: "世界地図はNatural Earthの境界データをworld-atlas経由で使用します。" },
        { title: "承認関係なし", body: "Dependency Radarは各データ提供者から後援、承認、提携を受けていません。" },
      ],
    },
    zh: {
      title: "数据来源",
      intro: "Dependency Radar 使用 World Bank 公共指标和 Natural Earth 地图边界数据。",
      sections: [
        { title: "World Bank Open Data", body: "能源、燃料、食品、进口、关税和物流指标来自 World Bank API。" },
        { title: "地图边界数据", body: "世界地图使用 Natural Earth 边界数据，并通过 world-atlas 包加载。" },
        { title: "无背书关系", body: "Dependency Radar 未获得数据提供方的赞助、认可或官方背书。" },
      ],
    },
    es: {
      title: "Fuentes de datos",
      intro: "Dependency Radar utiliza indicadores públicos del World Bank y datos de límites cartográficos de Natural Earth.",
      sections: [
        { title: "World Bank Open Data", body: "Los indicadores de energía, combustibles, alimentos, importaciones, aranceles y logística se obtienen desde la API del World Bank." },
        { title: "Datos del mapa", body: "La visualización del mapa mundial usa datos de Natural Earth mediante el paquete world-atlas." },
        { title: "Sin respaldo oficial", body: "Dependency Radar no está afiliado, patrocinado ni respaldado por los proveedores de datos." },
      ],
    },
    fr: {
      title: "Sources des données",
      intro: "Dependency Radar utilise des indicateurs publics de la World Bank et des données cartographiques Natural Earth.",
      sections: [
        { title: "World Bank Open Data", body: "Les indicateurs d’énergie, combustibles, alimentation, importations, droits de douane et logistique proviennent de l’API World Bank." },
        { title: "Données cartographiques", body: "La carte mondiale utilise les données Natural Earth via le package world-atlas." },
        { title: "Aucune approbation", body: "Dependency Radar n’est pas affilié, sponsorisé ou approuvé par les fournisseurs de données." },
      ],
    },
    de: {
      title: "Datenquellen",
      intro: "Dependency Radar verwendet öffentliche World-Bank-Indikatoren und Natural-Earth-Kartendaten.",
      sections: [
        { title: "World Bank Open Data", body: "Energie-, Brennstoff-, Lebensmittel-, Import-, Zoll- und Logistikindikatoren werden über die World-Bank-API abgerufen." },
        { title: "Kartendaten", body: "Die Weltkarte verwendet Natural-Earth-Grenzdaten über das Paket world-atlas." },
        { title: "Keine offizielle Unterstützung", body: "Dependency Radar ist nicht mit den Datenanbietern verbunden, gesponsert oder offiziell unterstützt." },
      ],
    },
  },
  privacy: {
    ko: {
      title: "개인정보처리방침",
      intro: "Dependency Radar는 사이트 기능 제공에 필요한 최소한의 정보만 사용하도록 설계되었습니다.",
      sections: [
        { title: "접속 국가 표시 및 방문 카운터", body: "호스팅 플랫폼에서 제공하는 대략적인 국가 코드를 사용해 방문 국가를 표시하고 국가별 누적 방문 횟수를 집계합니다. 중복 방문은 포함됩니다. IP 주소 전체는 저장하지 않습니다." },
        { title: "언어 설정", body: "사용자가 언어를 직접 변경하면 브라우저의 localStorage에 언어 선택이 저장될 수 있습니다." },
        { title: "이메일 문의", body: "이메일로 문의하는 경우 이메일 주소와 메시지 내용은 문의 응답 목적으로만 사용됩니다." },
      ],
    },
    en: {
      title: "Privacy Policy",
      intro: "Dependency Radar is designed to use only the minimum information needed to provide site features.",
      sections: [
        { title: "Visitor country display and counter", body: "The site uses an approximate country code from the hosting platform to display visitor countries and count cumulative visits by country. Duplicate visits are included. Full IP addresses are not stored." },
        { title: "Language preference", body: "If a user changes the language manually, the selected language may be stored in the browser localStorage." },
        { title: "Email inquiries", body: "If you contact us by email, your email address and message are used only to respond to your inquiry." },
      ],
    },
    ja: {
      title: "プライバシーポリシー",
      intro: "Dependency Radarは必要最小限の情報のみを使用するよう設計されています。",
      sections: [
        { title: "訪問国カウンター", body: "ホスティング環境の国コードを使って国別の訪問回数を集計します。IPアドレス全体は保存しません。" },
        { title: "言語設定", body: "言語を変更した場合、ブラウザに設定が保存されることがあります。" },
        { title: "メール問い合わせ", body: "メール内容は問い合わせ対応の目的で使用されます。" },
      ],
    },
    zh: {
      title: "隐私政策",
      intro: "Dependency Radar 仅使用提供功能所需的最低限度信息。",
      sections: [
        { title: "访问国家计数器", body: "网站使用托管平台提供的国家代码统计按国家累计访问次数。包含重复访问，不存储完整 IP 地址。" },
        { title: "语言偏好", body: "用户手动更改语言时，浏览器可能保存该设置。" },
        { title: "邮件联系", body: "邮件地址和内容仅用于回复咨询。" },
      ],
    },
    es: {
      title: "Política de privacidad",
      intro: "Dependency Radar usa solo la información mínima necesaria para sus funciones.",
      sections: [
        { title: "Contador por país", body: "El sitio usa un código de país aproximado para contar visitas acumuladas por país. Incluye visitas duplicadas y no almacena la IP completa." },
        { title: "Preferencia de idioma", body: "La selección de idioma puede guardarse en el navegador." },
        { title: "Consultas por correo", body: "El correo y el mensaje se usan solo para responder la consulta." },
      ],
    },
    fr: {
      title: "Politique de confidentialité",
      intro: "Dependency Radar utilise uniquement les informations minimales nécessaires.",
      sections: [
        { title: "Compteur par pays", body: "Le site utilise un code pays approximatif pour compter les visites cumulées par pays. Les visites répétées sont incluses et l’adresse IP complète n’est pas stockée." },
        { title: "Préférence de langue", body: "La langue choisie peut être enregistrée dans le navigateur." },
        { title: "Contact par e-mail", body: "L’e-mail et le message servent uniquement à répondre à la demande." },
      ],
    },
    de: {
      title: "Datenschutzerklärung",
      intro: "Dependency Radar verwendet nur die minimal notwendigen Informationen.",
      sections: [
        { title: "Besucherzähler nach Land", body: "Die Website nutzt einen ungefähren Ländercode, um kumulierte Besuche nach Land zu zählen. Doppelte Besuche sind enthalten; vollständige IP-Adressen werden nicht gespeichert." },
        { title: "Spracheinstellung", body: "Die gewählte Sprache kann im Browser gespeichert werden." },
        { title: "E-Mail-Anfragen", body: "E-Mail-Adresse und Nachricht werden nur zur Beantwortung verwendet." },
      ],
    },
  },
  terms: {
    ko: {
      title: "이용약관",
      intro: "Dependency Radar는 공개 통계 정보를 교육, 연구, 참고 목적으로 제공합니다.",
      sections: [
        { title: "서비스 이용", body: "사용자는 사이트를 합법적이고 비방해적인 방식으로 이용해야 합니다." },
        { title: "데이터 정확성", body: "데이터는 제3자 공개 데이터셋에 기반하므로 지연, 수정, 누락이 있을 수 있습니다." },
        { title: "금지 행위", body: "사이트를 방해하거나 데이터를 왜곡하여 제공자의 승인처럼 표현해서는 안 됩니다." },
      ],
    },
    en: {
      title: "Terms of Use",
      intro: "Dependency Radar provides public statistical information for educational, research, and reference purposes.",
      sections: [
        { title: "Use of service", body: "Users should use the site in a lawful and non-disruptive way." },
        { title: "Data accuracy", body: "The service relies on third-party public datasets, which may be delayed, revised, incomplete, or unavailable." },
        { title: "No misuse", body: "Users should not disrupt the website or misrepresent data providers as endorsing the site." },
      ],
    },
    ja: { title: "利用規約", intro: "Dependency Radarは教育・研究・参考目的で公開統計を提供します。", sections: [{ title: "利用", body: "合法的かつ非妨害的に利用してください。" }, { title: "データ精度", body: "第三者データのため遅延、修正、欠落があり得ます。" }, { title: "禁止事項", body: "データ提供者の承認を装ってはいけません。" }] },
    zh: { title: "使用条款", intro: "Dependency Radar 提供用于教育、研究和参考的公开统计信息。", sections: [{ title: "使用", body: "用户应合法且不干扰地使用本网站。" }, { title: "数据准确性", body: "数据可能延迟、修订、缺失或不可用。" }, { title: "禁止行为", body: "不得误导性地表示数据提供方认可本网站。" }] },
    es: { title: "Términos de uso", intro: "Dependency Radar ofrece estadísticas públicas para educación, investigación y referencia.", sections: [{ title: "Uso", body: "El sitio debe usarse de forma legal y no disruptiva." }, { title: "Precisión de datos", body: "Los datos pueden estar retrasados, revisados o incompletos." }, { title: "Uso indebido", body: "No se debe tergiversar el respaldo de los proveedores de datos." }] },
    fr: { title: "Conditions d’utilisation", intro: "Dependency Radar fournit des statistiques publiques à des fins éducatives, de recherche et de référence.", sections: [{ title: "Utilisation", body: "Le site doit être utilisé légalement et sans perturbation." }, { title: "Exactitude des données", body: "Les données peuvent être retardées, révisées ou incomplètes." }, { title: "Usage interdit", body: "Ne présentez pas les fournisseurs comme approuvant le site." }] },
    de: { title: "Nutzungsbedingungen", intro: "Dependency Radar bietet öffentliche Statistiken für Bildung, Forschung und Referenz.", sections: [{ title: "Nutzung", body: "Die Website muss rechtmäßig und störungsfrei genutzt werden." }, { title: "Datenqualität", body: "Daten können verzögert, geändert oder unvollständig sein." }, { title: "Missbrauch", body: "Datenanbieter dürfen nicht als Unterstützer dargestellt werden." }] },
  },
  disclaimer: {
    ko: {
      title: "면책 고지",
      intro: "Dependency Radar는 정보 제공, 교육, 연구 목적의 사이트입니다.",
      sections: [
        { title: "전문 조언 아님", body: "이 사이트는 투자, 법률, 무역, 관세, 물류, 정책, 사업 의사결정에 대한 전문 조언이 아닙니다." },
        { title: "제3자 데이터", body: "데이터는 공개 제3자 출처에서 가져오며 지연, 수정, 누락 또는 형식 차이가 있을 수 있습니다." },
        { title: "승인 관계 없음", body: "데이터 제공자는 Dependency Radar를 후원, 승인, 보증하지 않습니다." },
      ],
    },
    en: {
      title: "Disclaimer",
      intro: "Dependency Radar is for informational, educational, and research purposes only.",
      sections: [
        { title: "Not professional advice", body: "The site is not investment, legal, trade, customs, logistics, policy, or business advice." },
        { title: "Third-party data", body: "Data comes from public third-party sources and may be delayed, revised, missing, or formatted differently." },
        { title: "No endorsement", body: "Data providers do not sponsor, endorse, or approve Dependency Radar." },
      ],
    },
    ja: { title: "免責事項", intro: "Dependency Radarは情報提供、教育、研究目的のサイトです。", sections: [{ title: "専門的助言ではありません", body: "投資、法律、貿易、物流、政策助言ではありません。" }, { title: "第三者データ", body: "データには遅延、修正、欠落があり得ます。" }, { title: "承認関係なし", body: "データ提供者は本サイトを承認していません。" }] },
    zh: { title: "免责声明", intro: "Dependency Radar 仅用于信息、教育和研究目的。", sections: [{ title: "非专业建议", body: "本网站不构成投资、法律、贸易、物流或政策建议。" }, { title: "第三方数据", body: "数据可能延迟、修订、缺失或格式不同。" }, { title: "无背书", body: "数据提供方不赞助、认可或批准本网站。" }] },
    es: { title: "Aviso legal", intro: "Dependency Radar es solo para fines informativos, educativos y de investigación.", sections: [{ title: "No es asesoramiento profesional", body: "No es asesoramiento de inversión, legal, comercial, logístico o político." }, { title: "Datos de terceros", body: "Los datos pueden estar retrasados, revisados o incompletos." }, { title: "Sin respaldo", body: "Los proveedores de datos no patrocinan ni aprueban Dependency Radar." }] },
    fr: { title: "Avertissement", intro: "Dependency Radar est uniquement destiné à l’information, l’éducation et la recherche.", sections: [{ title: "Pas de conseil professionnel", body: "Ce n’est pas un conseil financier, juridique, commercial, logistique ou politique." }, { title: "Données tierces", body: "Les données peuvent être retardées, révisées ou incomplètes." }, { title: "Aucune approbation", body: "Les fournisseurs ne sponsorisent ni n’approuvent Dependency Radar." }] },
    de: { title: "Haftungsausschluss", intro: "Dependency Radar dient nur Informations-, Bildungs- und Forschungszwecken.", sections: [{ title: "Keine professionelle Beratung", body: "Es ist keine Anlage-, Rechts-, Handels-, Logistik- oder Politikberatung." }, { title: "Daten Dritter", body: "Daten können verzögert, geändert oder unvollständig sein." }, { title: "Keine Unterstützung", body: "Datenanbieter unterstützen oder genehmigen Dependency Radar nicht." }] },
  },
};

function getSavedLanguage(): Language {
  if (typeof window === "undefined") return "ko";
  const saved = localStorage.getItem("dependency-radar-language");
  if (saved === "ko" || saved === "en" || saved === "ja" || saved === "zh" || saved === "es" || saved === "fr" || saved === "de") return saved;
  return "ko";
}

export default function LegalInfoPage({ pageType }: { pageType: PageType }) {
  const [language, setLanguage] = useState<Language>("ko");

  useEffect(() => {
    setLanguage(getSavedLanguage());
  }, []);

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    localStorage.setItem("dependency-radar-language", nextLanguage);
  }

  const page = pages[pageType][language];
  const c = common[language];

  return (
    <main className="min-h-screen bg-[#070914] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <a href="/" className="text-sm text-indigo-300 hover:text-white">
            {c.back}
          </a>

          <select
            value={language}
            onChange={(event) => changeLanguage(event.target.value as Language)}
            className="rounded-full border border-white/15 bg-[#111524] px-4 py-2 text-sm text-white outline-none"
          >
            {Object.entries(languageLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <h1 className="mt-8 text-4xl font-bold">{page.title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">{page.intro}</p>

        {pageType === "sources" ? (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">World Bank indicator codes</h2>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-white/[0.06] text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Indicator</th>
                    <th className="px-5 py-4">Code</th>
                    <th className="px-5 py-4">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Energy net imports", "EG.IMP.CONS.ZS", "Energy imports, net percentage of energy use"],
                    ["Fuel import share", "TM.VAL.FUEL.ZS.UN", "Fuel imports as a share of merchandise imports"],
                    ["Food import share", "TM.VAL.FOOD.ZS.UN", "Food imports as a share of merchandise imports"],
                    ["Imports/GDP", "NE.IMP.GNFS.ZS", "Imports of goods and services as a share of GDP"],
                    ["Total imports USD", "NE.IMP.GNFS.CD", "Imports of goods and services in current US dollars"],
                    ["Tariff rate", "TM.TAX.MRCH.WM.AR.ZS", "Weighted mean tariff rate"],
                    ["Logistics index", "LP.LPI.OVRL.XQ", "Logistics Performance Index overall score"],
                  ].map(([name, code, meaning]) => (
                    <tr key={code} className="border-t border-white/10">
                      <td className="px-5 py-4 font-semibold text-white">{name}</td>
                      <td className="px-5 py-4 font-mono text-indigo-200">{code}</td>
                      <td className="px-5 py-4 text-slate-300">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <div className="mt-8 space-y-6">
          {page.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{section.body}</p>
            </section>
          ))}

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">{c.contact}</h2>
            <p className="mt-3 leading-7 text-slate-300">{c.emailText}</p>
            <a
              href="mailto:kevinsmp123@gmail.com"
              className="mt-3 inline-block text-lg font-semibold text-indigo-200 hover:text-white"
            >
              kevinsmp123@gmail.com
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
