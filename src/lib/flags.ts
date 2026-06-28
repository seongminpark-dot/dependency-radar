export function getFlagEmoji(iso2?: string) {
  const code = (iso2 ?? "").trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(code)) {
    return "🏳️";
  }

  return code
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}
