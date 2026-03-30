"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Link as LinkIcon, Search, Loader2, CheckCircle, Copy } from "lucide-react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please put a valid TikTok URL");
      return;
    }
    
    setError("");
    setLoading(true);
    setResult(null);

    try {
      // Calling our mock Next.js API route that handles the download request
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

  return (
    <main className="flex flex-col items-center justify-between min-h-screen pb-24 md:pb-12 pt-12 px-6">
      
      {/* Header / Logo */}
      <div className="flex flex-col items-center mt-8 z-10">
        <div className="relative w-28 h-28 md:w-36 md:h-36 drop-shadow-xl mb-4 transition-transform hover:scale-105 duration-300">
          <Image 
            src="/logo.png" 
            alt="MM TIKTOK Logo" 
            fill 
            className="object-contain" 
            priority
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 tracking-tight">
          MM TIKTOK
        </h1>
        <p className="mt-2 text-blue-900/70 font-medium text-sm md:text-base text-center max-w-sm">
          Download TikTok videos fast, clean, and without watermarks.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl flex flex-col items-center mt-8 mb-auto overflow-hidden">
        
        {/* Error Message */}
        {error && (
          <div className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-2xl border border-red-100 mb-6 text-sm flex items-center shadow-sm animate-in fade-in slide-in-from-top-4">
            <CheckCircle className="w-5 h-5 mr-2 text-red-500 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="w-full glass-card animate-in fade-in slide-in-from-bottom-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-2xl shimmer shrink-0"></div>
              <div className="space-y-3 w-full">
                <div className="h-5 rounded-md shimmer w-3/4"></div>
                <div className="h-4 rounded-md shimmer w-1/2"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-12 rounded-xl shimmer w-full"></div>
              <div className="h-12 rounded-xl shimmer w-full"></div>
            </div>
          </div>
        )}

        {/* Result Area */}
        {result && !loading && (
          <div className="w-full glass-card animate-in fade-in slide-in-from-bottom-8">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Video Preview Thumbnail placeholder */}
              <div className="relative w-full md:w-32 aspect-[9/16] bg-blue-50 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-blue-100">
                {result.cover ? (
                   /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={result.cover} alt="Video cover" className="object-cover w-full h-full" />
                ) : (
                  <Loader2 className="w-8 h-8 text-blue-300 animate-spin" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                   <p className="text-white text-xs truncate font-medium">Video Preview</p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-gray-800 text-lg line-clamp-2 leading-snug mb-2">{result.title || "TikTok Video"}</h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Ready to save</p>
                
                <div className="flex flex-col gap-3">
                  <a href={result.hd_url || result.sd_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]">
                    <Download className="w-5 h-5 mr-2" /> Download HD (No Watermark)
                  </a>
                  {result.sd_url && (
                    <a href={result.sd_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl border border-gray-200 shadow-sm transition-all active:scale-[0.98]">
                      Download SD
                    </a>
                  )}
                  <button onClick={copyToClipboard} className="w-full flex items-center justify-center py-3.5 px-4 bg-transparent hover:bg-blue-50 text-blue-700 font-semibold rounded-2xl transition-all border border-transparent hover:border-blue-100">
                    {copied ? <CheckCircle className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                    {copied ? "Link Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Input Field - Bottom-centered for mobile, center for desktop */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-0 md:static md:bottom-auto md:w-full md:max-w-2xl bg-white/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-gray-100 md:border-none shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-none z-50">
        <form onSubmit={handleDownload} className="relative max-w-2xl mx-auto w-full md:glass-card md:p-2 md:pl-6 rounded-3xl flex items-center shadow-xl shadow-blue-900/5 bg-white md:bg-white/80 border border-gray-200 md:border-white/50 p-2 pl-4">
          <LinkIcon className="text-gray-400 w-6 h-6 shrink-0" />
          <input 
            type="url" 
            placeholder="Paste TikTok link here..." 
            className="flex-1 bg-transparent px-4 py-3 md:py-4 outline-none text-gray-700 placeholder:text-gray-400 font-medium text-base"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 md:px-8 md:py-4 rounded-2xl font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.96] disabled:opacity-70 flex items-center justify-center min-w-[3rem]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="hidden md:inline">Download</span>}
            {!loading && <Download className="w-6 h-6 md:hidden" />}
          </button>
        </form>
      </div>

    </main>
  );
}
