import type { CountryRow } from "@/lib/worldBank";
import { buildCountryStructuredData } from "@/lib/countrySeo";

export default function CountryPageStructuredData({
  row,
}: {
  row: CountryRow;
}) {
  const structuredData = buildCountryStructuredData(row);

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
