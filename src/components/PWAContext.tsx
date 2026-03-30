"use client";

import { useEffect, useState } from "react";
import { DownloadCloud } from "lucide-react";

// Local build version - bump this manually when pushing structural changes
const APP_VERSION = "1.0.4";

export default function PWAContext() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // 1. Register the Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("PWA Service Worker registered", reg.scope))
          .catch((err) => console.error("PWA Service Worker registration failed", err));
      });
    }

    // 2. Poll for Version Mismatches
    const checkVersion = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.version && data.version !== APP_VERSION) {
          setUpdateAvailable(true);
        }
      } catch (err) {
        console.error("Failed to check app version", err);
      }
    };
    
    checkVersion();
  }, []);

  const handleApplyUpdate = async () => {
    // Unregister SW
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        await reg.unregister();
      }
    }
    // Delete all browser caches completely to reset state
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
    }
    // Force a fresh reload from the server
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-[99999] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-blue-600 shadow-[0_20px_50px_rgba(37,99,235,0.4)] border border-blue-400 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/50 rounded-full shrink-0">
            <DownloadCloud className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm">Update Available</span>
            <span className="text-blue-100 font-medium text-[11px] leading-tight mt-0.5">
              Get the latest cache fixes & HD video paths.
            </span>
          </div>
        </div>
        <button 
          onClick={handleApplyUpdate}
          className="ml-3 px-4 py-2 bg-white text-blue-600 border border-white hover:bg-transparent hover:text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all shrink-0"
        >
          Update
        </button>
      </div>
    </div>
  );
}
