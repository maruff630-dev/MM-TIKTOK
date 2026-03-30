import { useState } from "react";
import Image from "next/image";
import { Download, Link as LinkIcon, Loader2, CheckCircle, ClipboardPaste, Music, AlertCircle, ArrowLeft, Menu } from "lucide-react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadingType, setDownloadingType] = useState<"video" | "mp3" | null>(null);
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
      if (url) processDownload(url);
      else setError("Clipboard access denied. Please paste manually and hit Download.");
    }
  };

  const handleDownloadFile = async (fileUrl: string, type: "video" | "mp3") => {
    setDownloadingType(type);
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: fileUrl, 
          filename: `MM_TIKTOK_${result?.title ? result.title.substring(0, 10) : "Download"}.${type === "video" ? "mp4" : "mp3"}` 
        })
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const tempUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = tempUrl;
      a.download = `MM_TIKTOK_${result?.title ? result.title.substring(0, 10) : "Download"}.${type === "video" ? "mp4" : "mp3"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(tempUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download file", err);
      // Fallback: open in new tab if blob fails
      window.open(fileUrl, "_blank");
    } finally {
      setDownloadingType(null);
    }
  };

  const hasContent = loading || result || error;

  return (
    <main className="flex flex-col min-h-[100dvh] relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 p-4 pb-12 pt-20">
      
      {/* Top Header Navigation */}
      <nav className="absolute top-0 left-0 right-0 w-full flex items-center justify-between p-4 px-6 md:px-8 z-50">
        <button 
          onClick={() => {
            setUrl("");
            setResult(null);
          }}
          className="p-2 rounded-full hover:bg-black/5 transition-all text-gray-700 active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Animated Glowing Logo */}
        <div className="relative w-10 h-10 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] animate-pulse transition-transform hover:scale-110">
          <Image 
            src="/logo.png" 
            alt="MM TIKTOK Logo" 
            fill 
            sizes="40px"
            className="object-contain" 
            priority
          />
        </div>
        
        <button className="p-2 rounded-full hover:bg-black/5 transition-all text-gray-700 active:scale-95">
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Background Decorative Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 blur-[120px] pointer-events-none transition-all duration-1000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 blur-[120px] pointer-events-none transition-all duration-1000" />

      {/* Main Foreground Container */}
      <div className={`relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${hasContent ? "pt-2 md:pt-4" : "justify-center min-h-[80dvh] -translate-y-12"}`}>
        
        {/* Header Text */}
        <div className={`flex flex-col items-center text-center transition-all duration-700 ${hasContent ? "scale-90 opacity-90 mb-6 hidden sm:flex" : "scale-100 mb-10"}`}>
          <h1 className={`font-black text-gray-900 tracking-tight transition-all duration-700 ${hasContent ? "text-2xl md:text-3xl mb-1" : "text-4xl md:text-5xl lg:text-6xl mb-3 leading-tight"}`}>
            Download TikTok Free
          </h1>
          <p className={`text-gray-600 font-medium transition-all duration-700 max-w-xl ${hasContent ? "text-sm hidden sm:block" : "text-base md:text-lg"}`}>
            The fastest tool to save TikTok videos in <span className="text-blue-600 font-bold">Ultra HD without watermark</span> and get MP3 audio instantly.
          </p>
        </div>

        {/* Central Input Box (Moves below result if hasContent) */}
        <div className={`w-full max-w-2xl flex flex-col items-center transition-all duration-700 ${hasContent ? "order-last mt-8 opacity-80 hover:opacity-100" : "order-2"}`}>
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

            {/* Combined Paste & Download Button */}
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
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <Image src="/logo.png" alt="Fallback" width={40} height={40} className="opacity-20 grayscale" />
                  </div>
                )}
                {/* Gradient overlay for text */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-12 pb-3 px-4 pointer-events-none">
                  <p className="text-white font-medium text-sm drop-shadow-md line-clamp-2 leading-snug">
                    {result.title || "Ready to save"}
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
                      <Download className="w-6 h-6 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 animate-float" />
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
                        <Music className="w-6 h-6 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 animate-float" style={{ animationDelay: "1s" }} />
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
