import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#9e2d50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ระบบสนับสนุนการตัดสินใจเลือกวิธีคุมกำเนิด รพ.สต.",
  description:
    "WHO Medical Eligibility Criteria (MEC 6th Edition) Decision Support System for Primary Care (รพ.สต.)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Noto+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#faf5f6] text-[#28161c] antialiased min-h-screen flex flex-col selection:bg-[#ffbdca] selection:text-[#7e1339]">
        {children}
      </body>
    </html>
  );
}
