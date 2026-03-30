import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MM TIKTOK | Free No Watermark Video Downloader",
  description: "Fast, clean, and user-friendly TikTok video downloader. Download without watermark for free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col selection:bg-blue-200 selection:text-blue-900`}>
        {children}
      </body>
    </html>
  );
}
