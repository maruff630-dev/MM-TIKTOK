"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Menu, Info, Shield, Zap, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate real network fetch for the premium skeleton feel
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex flex-col min-h-[100dvh] relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 p-4 pb-12 pt-20">
      
      {/* Top Header Navigation */}
      <nav className="absolute top-0 left-0 right-0 w-full flex items-center justify-between p-4 px-6 md:px-8 z-50 glass">
        <Link href="/" className="p-2 rounded-full hover:bg-black/5 transition-all text-gray-700 active:scale-95">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="font-bold text-lg text-gray-800 tracking-wide">About Us</div>
        
        {/* Menu Wrapper */}
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-black/5 transition-all text-gray-700 active:scale-95">
            <Menu className="w-6 h-6" />
          </button>
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-[40]" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute top-full right-0 mt-2 w-56 glass-card p-2 flex flex-col gap-1 z-[50] animate-in slide-in-from-top-2 fade-in duration-200 shadow-2xl">
                <Link href="/" className="w-full px-4 py-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Home / Download</Link>
                <Link href="/about" className="w-full px-4 py-3 rounded-xl font-bold text-blue-600 bg-blue-50 transition-colors">About Us</Link>
                <Link href="/policy" className="w-full px-4 py-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Privacy Policy</Link>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Decorative Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col gap-6 w-full pb-20 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {loading ? (
          /* Skeletons */
          <div className="flex flex-col gap-6 w-full">
            <div className="glass-card flex flex-col items-center p-8 border border-white/60">
              <div className="w-20 h-20 rounded-full shimmer-light mb-4" />
              <div className="w-48 h-6 rounded-md shimmer-light mb-2" />
              <div className="w-24 h-4 rounded-md shimmer-light" />
            </div>
            <div className="glass-card flex flex-col p-6 gap-4">
              <div className="w-1/3 h-6 rounded-md shimmer-light" />
              <div className="w-full h-4 rounded-md shimmer-light" />
              <div className="w-full h-4 rounded-md shimmer-light" />
              <div className="w-5/6 h-4 rounded-md shimmer-light" />
            </div>
            <div className="glass-card flex flex-col p-6 gap-4">
              <div className="w-1/3 h-6 rounded-md shimmer-light" />
              <div className="w-full h-24 rounded-md shimmer-light" />
            </div>
          </div>
        ) : (
          /* Real Content */
          <>
            <div className="glass-card flex flex-col items-center p-8 text-center bg-white/80 border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(37,99,235,0.08)] transition-all">
              <div className="relative w-20 h-20 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse mb-6">
                <Image src="/logo.png" alt="Logo" fill sizes="80px" className="object-contain" priority />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">MM TIKTOK</h1>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full tracking-wide">Version 1.0.0</span>
              <p className="mt-6 text-gray-600 font-medium max-w-sm leading-relaxed">
                The most advanced, totally free, ultra-premium TikTok video downloader network. Built with love for creators and social media enthusiasts globally.
              </p>
            </div>

            <div className="glass-card flex flex-col p-6 bg-white/90 shadow-sm border-white/60 group hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Info className="w-5 h-5" /></div>
                <h2 className="text-xl font-bold text-gray-800">Our Mission</h2>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify mb-4">
                MM TIKTOK was born out of a stark necessity: the internet was flooded with mediocre video downloaders that were riddled with invasive ads, poor design, and clunky interfaces. We set out to change this narrative by building a premium, mobile-native web application that feels as smooth and professional as the actual social media platforms it interacts with. Our primary mission is to offer users a reliable, lightning-fast utility to save their favorite TikTok memories, trends, and educational clips in perfect Ultra HD quality, and absolutely watermark-free. 
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                We believe that premium software shouldn&apos;t have to cost a premium price. That&apos;s why MM TIKTOK is completely free to use. By combining beautiful glassmorphic UI design, intelligent network optimization, and secure proxy channels, we ensure that every single interaction on this platform is uninterrupted and flawless. We continually innovate on our infrastructure to provide zero-downtime downloads, instant MP3 audio extractions, and a gorgeous aesthetic that respects the modern user&apos;s eyes. Welcome to the future of media saving online.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card flex flex-col p-6 bg-white/90 shadow-sm border-white/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Shield className="w-5 h-5" /></div>
                  <h3 className="font-bold text-gray-800">Safe & Secure</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">We don&apos;t store your videos on our servers. Downloads are processed securely and streamed directly to your device. Utmost privacy guaranteed.</p>
              </div>
              
              <div className="glass-card flex flex-col p-6 bg-white/90 shadow-sm border-white/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-pink-100 rounded-lg text-pink-500"><Zap className="w-5 h-5" /></div>
                  <h3 className="font-bold text-gray-800">Ultra Lightning Fast</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">Powered by Next.js edge networking, our tool fetches and processes Ultra HD videos in milliseconds. No more waiting.</p>
              </div>
            </div>
            
            <div className="text-center py-6 text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> by MM Devs
            </div>
          </>
        )}
      </div>
    </main>
  );
}
