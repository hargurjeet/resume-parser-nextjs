import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Parser",
  description: "Upload a PDF resume and get structured data instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      {/*
        SF Pro is the system font on all Apple platforms.
        On non-Apple devices this gracefully falls to Segoe UI / Helvetica Neue.
        No font files to load — zero render-blocking.
      */}
      <head>
        <style>{`
          :root {
            --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display",
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
