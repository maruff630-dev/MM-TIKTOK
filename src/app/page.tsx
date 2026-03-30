"use client";

import { useState } from "react";
import { Download, Link as LinkIcon, Loader2, ClipboardPaste, Music, AlertCircle } from "lucide-react";
import axios from "axios";
import Header from "@/components/Header";
import TikTokLogo from "@/components/TikTokLogo";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadingType, setDownloadingType] = useState<"video" | "mp3" | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    } catch (err) {
      console.error(err);
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
      if (url) processDownload(url);
      else setError("Clipboard access denied. Please paste manually and hit Download.");
    }
  };

  const handleDownloadFile = (fileUrl: string, type: "video" | "mp3") => {
    setDownloadingType(type);
    try {
      // Create a clean filename
      const titleClean = result?.title ? result.title.substring(0, 12).replace(/[^a-zA-Z0-9]/g, '_') : "Media";
      const filename = `MM_TIKTOK_${titleClean}.${type === "video" ? "mp4" : "mp3"}`;
      
      // Navigate to the edge streaming proxy which sends 'Content-Disposition: attachment'
      // This bypasses JS ArrayBuffer limits and triggers the native iOS/Android download manager seamlessly.
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(filename)}`;
      window.location.href = proxyUrl;
      
    } catch (err) {
      console.error("Failed to route to download proxy", err);
      window.open(fileUrl, "_blank");
    } finally {
      // Revert button spinning state after the native download manager prompt appears
      setTimeout(() => setDownloadingType(null), 2500);
    }
  };

  const hasContent = loading || result || error;

  return (
    <main className="flex flex-col min-h-[100dvh] relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 p-4 pb-12 pt-20">
      
      {/* Top Header Navigation */}
      <Header />

      {/* Background Decorative Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 blur-[120px] pointer-events-none transition-all duration-1000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 blur-[120px] pointer-events-none transition-all duration-1000" />

      {/* Main Foreground Container */}
      <div className={`relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${hasContent ? "pt-2 md:pt-4" : "justify-center min-h-[80dvh] -translate-y-12"}`}>
        
        {/* Header Text & Beautiful Transparent TikTok Logo */}
        <div className={`flex flex-col items-center text-center transition-all duration-700 ${hasContent ? "scale-90 opacity-90 mb-6 hidden sm:flex" : "scale-100 mb-10"}`}>
          
          {/* Glassmorphic TikTok Logo */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[22px] bg-gradient-to-tr from-[#00f2fe] via-[#4facfe] to-[#f093fb] p-[2px] mb-5 shadow-lg shadow-blue-500/20 animate-in zoom-in spin-in-12 duration-1000">
            <div className="w-full h-full bg-white/70 backdrop-blur-xl rounded-[20px] flex items-center justify-center">
              <TikTokLogo className="w-8 h-8 md:w-10 md:h-10 text-gray-900 drop-shadow-sm transition-transform hover:scale-110 duration-300" />
            </div>
          </div>

          <h1 className={`font-black text-gray-900 tracking-tight transition-all duration-700 ${hasContent ? "text-2xl md:text-3xl mb-1" : "text-4xl md:text-5xl lg:text-7xl mb-3 leading-tight"}`}>
            Download TikTok Free
          </h1>
          <p className={`text-gray-600 font-medium transition-all duration-700 max-w-xl ${hasContent ? "text-sm hidden sm:block" : "text-base md:text-lg"}`}>
            The fastest tool to save TikTok videos in <span className="text-blue-600 font-bold">Ultra HD without watermark</span> and get MP3 audio instantly.
          </p>
        </div>

        {/* Central Input Box or Reboot Button */}
        <div className={`w-full max-w-2xl flex flex-col items-center transition-all duration-700 ${hasContent ? "order-last mt-10" : "order-2"}`}>
          
          {!hasContent ? (
            <form 
              onSubmit={handleManualSubmit} 
              className="w-full relative glass-card p-2 flex items-center gap-2 transition-all duration-500 shadow-[0_10px_40px_rgba(37,99,235,0.08)] bg-white/90 border border-blue-100 hover:border-blue-300"
            >
              <div className="pl-3 hidden sm:flex">
                <LinkIcon className="text-blue-500 w-5 h-5 flex-shrink-0" />
              </div>
              
              <input 
                type="url" 
                placeholder="Paste TikTok link here..." 
                className="flex-1 bg-transparent px-3 py-3 outline-none text-gray-800 placeholder:text-gray-400 font-medium text-base min-w-0"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                onClick={handlePasteAndDownload}
                disabled={loading}
                title="Paste & Download"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-[0.96] disabled:opacity-70 flex-shrink-0 min-w-[120px]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ClipboardPaste className="w-5 h-5" />
                    <span>Paste</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            // Beautiful Reset Button shown when content is loaded
            <button
              onClick={() => {
                setUrl("");
                setResult(null);
                setLoading(false);
                setError("");
              }}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white/60 backdrop-blur-md border border-white hover:border-blue-200 text-gray-800 rounded-[2rem] font-bold text-sm md:text-base shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 active:scale-95 animate-in fade-in slide-in-from-bottom-8 overflow-hidden w-full max-w-[340px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-purple-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <LinkIcon className="w-4 h-4" />
              </div>
              Download Another Video
            </button>
          )}
        </div>

        {/* Result & Loading Area (Order 2, sits cleanly between header and input) */}
        <div className={`w-full max-w-[340px] flex flex-col items-center transition-all duration-700 order-2 origin-top ${hasContent ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0 overflow-hidden"}`}>
          
          {/* Error Message */}
          {error && (
            <div className="w-full bg-red-50 text-red-600 px-5 py-4 rounded-2xl border border-red-100 text-sm flex items-center justify-center animate-in fade-in slide-in-from-top-4 shadow-sm mb-4">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500 shrink-0" />
              <span className="font-medium text-center">{error}</span>
            </div>
          )}

          {/* Premium Skeleton Loading */}
          {loading && !error && (
            <div className="w-full glass-card flex flex-col p-4 animate-in fade-in zoom-in-95 duration-500 border border-white/60">
              <div className="w-full aspect-[9/16] rounded-xl shimmer-light overflow-hidden mb-4 relative shadow-inner">
                {/* Skeleton Overlay for Author & Title */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/10 shadow-sm" />
                    <div className="flex flex-col gap-1.5">
                      <div className="w-24 h-3.5 rounded-md bg-black/10" />
                      <div className="w-16 h-2.5 rounded-md bg-black/10" />
                    </div>
                  </div>
                  <div className="w-[85%] h-3 rounded-md bg-black/10 mt-1" />
                  <div className="w-[60%] h-3 rounded-md bg-black/10" />
                </div>
                
                {/* Simulated center floating loader icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-blue-400 animate-spin opacity-50" />
                </div>
              </div>
              <div className="flex gap-3 w-full">
                <div className="h-12 w-1/2 rounded-xl shimmer-light" />
                <div className="h-12 w-1/2 rounded-xl shimmer-light" />
              </div>
            </div>
          )}

          {/* Actual Video Result */}
          {result && !loading && !error && (
            <div className="w-full glass-card flex flex-col p-4 animate-in fade-in zoom-in-95 duration-700 shadow-2xl border-white bg-white/95">
              
              {/* 9:16 Video Thumbnail strictly bounded */}
              <div className="relative w-full aspect-[9/16] max-h-[45vh] bg-black/5 rounded-xl overflow-hidden shadow-inner flex shrink-0 items-center justify-center border border-gray-100 mb-4 group">
                {result.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={result.cover} 
                    alt="Video thumbnail" 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
                    <TikTokLogo className="w-10 h-10 text-gray-400 opacity-50" />
                  </div>
                )}
                {/* Gradient overlay for Author Profile & Title */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-24 pb-4 px-4 pointer-events-none flex flex-col justify-end">
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-2.5">
                    {result.author?.avatar ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/90 shadow-lg shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={result.author.avatar} alt="Author avatar" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/80 shadow-lg shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-bold text-sm md:text-base drop-shadow-md truncate">
                        {result.author?.nickname || "TikTok Creator"}
                      </span>
                      <span className="text-white/80 font-medium text-xs drop-shadow-md truncate">
                        @{result.author?.unique_id || "tiktok"}
                      </span>
                    </div>
                  </div>

                  {/* Video Title */}
                  <p className="text-white/95 font-medium text-xs md:text-sm drop-shadow-md line-clamp-2 leading-snug">
                    {result.title || "Ready to save format"}
                  </p>
                </div>
              </div>
              
              {/* Download Action Buttons */}
              <div className="w-full flex justify-center gap-10 mt-4 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                
                {/* Video Button Column */}
                <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => handleDownloadFile(result.hd_url || result.sd_url, "video")}
                    disabled={downloadingType !== null}
                    className="w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_8px_25px_rgba(37,99,235,0.4)] transition-all active:scale-[0.92] disabled:opacity-70 disabled:scale-100 group"
                  >
                    {downloadingType === "video" ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Download className="w-6 h-6 animate-bounce-spin-delay group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300" />
                    )}
                  </button>
                  <span className="text-sm font-bold text-gray-700">Video</span>
                </div>
                
                {/* MP3 Audio Button Column */}
                {result.mp3_url && (
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => handleDownloadFile(result.mp3_url, "mp3")}
                      disabled={downloadingType !== null}
                      className="w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_8px_25px_rgba(37,99,235,0.4)] transition-all active:scale-[0.92] disabled:opacity-70 disabled:scale-100 group"
                    >
                      {downloadingType === "mp3" ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Music className="w-6 h-6 animate-bounce-spin-delay group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: "2s" }} />
                      )}
                    </button>
                    <span className="text-sm font-bold text-gray-700">MP3</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
