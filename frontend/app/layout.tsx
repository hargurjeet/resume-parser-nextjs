import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display",
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
