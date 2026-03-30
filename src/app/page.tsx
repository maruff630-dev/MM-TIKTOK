"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Link as LinkIcon, Loader2, CheckCircle, Copy, ClipboardPaste } from "lucide-react";
import axios from "axios";
import NavbarSkeleton from "@/components/skeletons/NavbarSkeleton";
import StoriesSkeleton from "@/components/skeletons/StoriesSkeleton";
import VideoFeedSkeleton from "@/components/skeletons/VideoFeedSkeleton";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDownload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError("Please put a valid TikTok URL");
      return;
    }
    
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("/api/download", { url });
      
      if (response.data.status === "success") {
        setResult(response.data.data);
      } else {
        setError(response.data.message || "Failed to download video. Please try again.");
      }
    } catch (err: any) {
      setError("An error occurred while fetching the video.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.hd_url) {
      navigator.clipboard.writeText(result.hd_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      if (text.includes("tiktok.com")) {
        // Auto-trigger if valid link is pasted
        setTimeout(() => handleDownload(), 100);
      }
    } catch (err) {
      console.log("Failed to paste", err);
    }
  };

  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden bg-[#050505]">
      {/* Background Social App Skeletons (Decorative) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex flex-col blur-[1px] opacity-40">
        <NavbarSkeleton />
        <div className="flex flex-1 mt-4 px-4 overflow-hidden gap-12 justify-center">
          {/* Left Column Feed */}
          <div className="hidden lg:flex flex-col items-end gap-8 w-1/3">
            <StoriesSkeleton />
            <div className="scale-90 origin-top-right">
              <VideoFeedSkeleton />
            </div>
          </div>
          {/* Center Space for main box */}
          <div className="hidden md:flex flex-col w-1/3 opacity-20 transform -translate-y-12">
            <VideoFeedSkeleton />
          </div>
          {/* Right Column Profile */}
          <div className="hidden lg:flex flex-col items-start gap-8 w-1/3 pt-12">
            <ProfileSkeleton />
            <div className="w-full max-w-sm aspect-video bg-[#121212] rounded-2xl shimmer-dark" />
          </div>
        </div>
      </div>

      {/* Main Foreground Interface */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-12 md:py-24 animate-in fade-in duration-1000">
        
        {/* Central Hero text */}
        <div className="flex flex-col items-center mb-10 text-center animate-float">
          <div className="relative w-24 h-24 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)] mb-6 transition-transform hover:scale-105 duration-300">
            <Image 
              src="/logo.png" 
              alt="MM TIKTOK Logo" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 tracking-tight leading-tight mb-4">
            Download the Trend
          </h1>
          <p className="text-gray-400 font-medium text-lg md:text-xl max-w-lg mb-2">
            Save TikTok videos in ultra HD <span className="text-white font-bold">without watermarks</span> instantly.
          </p>
          <p className="text-gray-500 text-sm max-w-md">
            Fast, secure, and 100% free. Experience the most premium TikTok downloader built for creators.
          </p>
        </div>

        {/* Action Window */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-6">
          
          {/* Input Box */}
          <form 
            onSubmit={handleDownload} 
            className="w-full relative glass-card p-2 md:p-3 flex items-center gap-2 group hover:border-white/20 transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="pl-4 hidden sm:flex">
              <LinkIcon className="text-purple-400 w-6 h-6 animate-pulse" />
            </div>
            
            <input 
              type="url" 
              placeholder="Paste your TikTok link here..." 
              className="flex-1 bg-transparent px-4 py-3 md:py-4 outline-none text-white placeholder:text-gray-500 font-medium text-lg min-w-0"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />

            {/* Paste Button (Visible when empty) */}
            {!url && (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste Link"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-colors border border-white/5"
              >
                <ClipboardPaste className="w-4 h-4" />
                Paste
              </button>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] active:scale-[0.96] disabled:opacity-70 disabled:grayscale flex items-center justify-center min-w-[3.5rem] md:min-w-[10rem]"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="hidden md:inline text-lg">Download</span>
                  <Download className="w-6 h-6 md:hidden" />
                </>
              )}
            </button>
          </form>

          {/* Validation/Feedback Area */}
          <div className="w-full min-h-[160px] flex justify-center w-full max-w-2xl">
            {/* Error Message */}
            {error && (
              <div className="w-full bg-red-950/50 text-red-400 px-5 py-4 rounded-2xl border border-red-900/50 text-sm flex items-center justify-center animate-in fade-in slide-in-from-top-4 shadow-xl">
                <CheckCircle className="w-5 h-5 mr-3 text-red-500 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* In-Place Skeletons when fetching */}
            {loading && !error && (
              <div className="w-full glass-card animate-in fade-in slide-in-from-bottom-6">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-20 h-28 rounded-xl shimmer-dark shrink-0"></div>
                  <div className="space-y-4 w-full">
                    <div className="h-6 rounded-md shimmer-dark w-3/4"></div>
                    <div className="h-4 rounded-md shimmer-dark w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-14 rounded-xl shimmer-dark w-full bg-purple-900/10"></div>
                  <div className="h-14 rounded-xl shimmer-dark w-full bg-purple-900/10"></div>
                </div>
              </div>
            )}

            {/* Actual Result Section */}
            {result && !loading && !error && (
              <div className="w-full glass-card animate-in fade-in slide-in-from-bottom-8 flex flex-col md:flex-row gap-6 shadow-2xl border-purple-500/20">
                
                {/* Video Info Display */}
                <div className="relative w-full md:w-40 aspect-[9/16] bg-black/60 rounded-xl overflow-hidden flex shrink-0 items-center justify-center border border-white/10 group">
                  {result.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={result.cover} alt="Video cover" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                
                {/* Download Actions */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-200 text-xl line-clamp-2 leading-snug mb-2">{result.title || "TikTok Video"}</h3>
                  <p className="text-sm text-green-400 mb-6 font-medium flex items-center tracking-wide"><CheckCircle className="w-4 h-4 mr-1.5" /> High Quality Ready</p>
                  
                  <div className="flex flex-col gap-3">
                    <a href={result.hd_url || result.sd_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center py-4 px-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/50 transition-all active:scale-[0.98]">
                      <Download className="w-5 h-5 mr-3" /> Save Video (No Watermark)
                    </a>
                    {result.sd_url && (
                      <a href={result.sd_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center py-3.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl border border-white/10 transition-all active:scale-[0.98]">
                        Download Standard Quality
                      </a>
                    )}
                    <button onClick={copyToClipboard} className="w-full flex items-center justify-center py-3.5 px-4 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-medium rounded-xl transition-all border border-transparent">
                      {copied ? <CheckCircle className="w-5 h-5 mr-2 text-green-400" /> : <Copy className="w-5 h-5 mr-2" />}
                      {copied ? "Direct Link Copied!" : "Copy URL"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
