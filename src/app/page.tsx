"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Link as LinkIcon, Loader2, CheckCircle, ClipboardPaste, Music } from "lucide-react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const processDownload = async (linkToDownload: string) => {
    if (!linkToDownload.trim()) {
      setError("Please put a valid TikTok URL");
      return;
    }
    
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("/api/download", { url: linkToDownload });
      
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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processDownload(url);
  };

  const handlePasteAndDownload = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        processDownload(text);
      }
    } catch (err) {
      console.log("Failed to paste", err);
      // Fallback if clipboard access is denied
      if (url) processDownload(url);
      else setError("Clipboard access denied. Please paste manually and hit Enter.");
    }
  };

  return (
    <main className="flex flex-col min-h-[100dvh] relative overflow-hidden items-center justify-center p-4">
      {/* Background Decorative Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 blur-[120px] pointer-events-none" />

      {/* Main Foreground Container */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
        
        {/* Header Text & Logo */}
        <div className="flex flex-col items-center mb-8 text-center animate-float">
          <div className="relative w-16 h-16 drop-shadow-xl mb-4 transition-transform hover:scale-105 duration-300">
            <Image 
              src="/logo.png" 
              alt="MM TIKTOK Logo" 
              fill 
              sizes="(max-width: 768px) 64px, 64px"
              className="object-contain" 
              priority
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
            Download TikTok Videos Free
          </h1>
          <p className="text-gray-600 font-medium text-base md:text-lg max-w-xl">
            The fastest tool to save TikTok videos in <span className="text-blue-600 font-bold">Ultra HD without watermark</span> and get MP3 audio instantly.
          </p>
        </div>

        {/* Action Window */}
        <div className="w-full flex flex-col items-center gap-6">
          
          {/* Central Input Box */}
          <form 
            onSubmit={handleManualSubmit} 
            className="w-full relative glass-card p-2 flex items-center gap-2 group hover:border-blue-200 transition-all duration-300 shadow-[0_10px_40px_rgba(37,99,235,0.08)] bg-white/80"
          >
            <div className="pl-3 hidden sm:flex">
              <LinkIcon className="text-blue-500 w-5 h-5" />
            </div>
            
            <input 
              type="url" 
              placeholder="Paste your TikTok link here..." 
              className="flex-1 bg-transparent px-3 py-3 outline-none text-gray-800 placeholder:text-gray-400 font-medium text-base md:text-lg min-w-0"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />

            {/* Paste/Download Button */}
            <button
              type="button"
              onClick={handlePasteAndDownload}
              disabled={loading}
              title="Paste & Download"
              className="flex items-center gap-2 px-4 md:px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-[0.96] disabled:opacity-70 disabled:grayscale shrink-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ClipboardPaste className="w-5 h-5" />
                  <span className="hidden sm:inline">Paste</span>
                </>
              )}
            </button>
          </form>

          {/* Validation/Feedback Area */}
          <div className="w-full flex justify-center">
            {/* Error Message */}
            {error && (
              <div className="w-full bg-red-50 text-red-600 px-5 py-3 rounded-2xl border border-red-100 text-sm flex items-center justify-center animate-in fade-in slide-in-from-top-4 shadow-sm">
                <CheckCircle className="w-5 h-5 mr-3 text-red-500 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* In-Place Skeleton when fetching */}
            {loading && !error && (
              <div className="w-full max-w-lg glass-card flex flex-col items-center p-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-6" />
                <div className="w-48 h-64 rounded-xl shimmer-light shrink-0 mb-6 shadow-sm border border-gray-100"></div>
                <div className="w-3/4 h-5 rounded-md shimmer-light mb-8"></div>
                <div className="w-full space-y-3">
                  <div className="w-full h-12 rounded-xl shimmer-light"></div>
                  <div className="w-full h-12 rounded-xl shimmer-light"></div>
                </div>
              </div>
            )}

            {/* Actual Result Section */}
            {result && !loading && !error && (
              <div className="w-full max-w-lg glass-card flex flex-col items-center p-6 animate-in fade-in slide-in-from-bottom-8 shadow-xl border-blue-100/50 bg-white/90">
                
                {/* Beautifully Fit Video Thumbnail */}
                <div className="relative w-full aspect-[4/5] sm:aspect-video md:aspect-[4/3] max-h-[400px] bg-gray-50 rounded-2xl overflow-hidden flex shrink-0 items-center justify-center border border-gray-200 mb-5 shadow-inner">
                  {result.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={result.cover} 
                      alt="Video cover" 
                      className="object-contain w-full h-full backdrop-blur-sm" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Image src="/logo.png" alt="Placeholder" width={60} height={60} className="opacity-20 grayscale" />
                    </div>
                  )}
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center p-4 pointer-events-none">
                     <p className="text-white font-semibold text-sm drop-shadow-md pb-2 tracking-wide text-center px-4 line-clamp-2">
                       {result.title || "Ready to download"}
                     </p>
                  </div>
                </div>
                
                {/* Download Actions */}
                <div className="w-full flex flex-col gap-3">
                  {/* HD Video Download */}
                  {result.hd_url && (
                    <a 
                      href={result.hd_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    >
                      <Download className="w-5 h-5 mr-2" /> Download without watermark
                    </a>
                  )}
                  
                  {/* MP3 Audio Download */}
                  {result.mp3_url && (
                    <a 
                      href={result.mp3_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center py-3.5 px-6 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-2xl border-2 border-gray-200 shadow-sm transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-200"
                    >
                      <Music className="w-5 h-5 mr-2 text-pink-500" /> Download mp3
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
