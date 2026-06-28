import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dependency Radar",
  description:
    "A global statistics platform for country dependency and supply-chain exposure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}