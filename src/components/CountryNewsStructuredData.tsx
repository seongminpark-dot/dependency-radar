import type { CountryRow } from "@/lib/worldBank";
import { buildCountryNewsStructuredData } from "@/lib/countryNewsSeo";

export default function CountryNewsStructuredData({
  row,
}: {
  row: CountryRow;
}) {
  const structuredData = buildCountryNewsStructuredData(row);

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
