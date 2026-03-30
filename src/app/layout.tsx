import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MM TIKTOK | Premium Video Downloader",
  description: "Fast, clean, and user-friendly TikTok video downloader. Download without watermark for free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col selection:bg-purple-500/30 selection:text-purple-200`}>
        {children}
      </body>
    </html>
  );
}
