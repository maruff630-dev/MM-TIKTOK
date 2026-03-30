import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("tiktok")) {
      return NextResponse.json(
        { status: "error", message: "Please provide a valid TikTok link" },
        { status: 400 }
      );
    }

    // Mobile apps (Android/iOS) typically append extra text when copying links 
    // e.g. "Check this out! https://vm.tiktok.com/XZY/"
    // We must extract only the URL from this string
    const urlMatch = url.match(/(https?:\/\/[^\s]+)/);
    const cleanUrl = urlMatch ? urlMatch[0] : url;

    // Using tikwm API (a popular free TikTok scraping API)
    const apiUrl = "https://www.tikwm.com/api/";
    
    // Tikwm expects urlencoded data or GET params. We'll use axios POST to their API.
    const response = await axios.post(apiUrl, null, {
      params: {
        url: cleanUrl,
        hd: 1, // Request HD video
      },
    });

    const scraperData = response.data;

    if (scraperData.code === 0 && scraperData.data) {
      // Success, format response to match our frontend expectations
      return NextResponse.json({
        status: "success",
        data: {
          title: scraperData.data.title,
          cover: scraperData.data.cover,
          sd_url: scraperData.data.play,
          hd_url: scraperData.data.hdplay || scraperData.data.play,
          mp3_url: scraperData.data.music,
          author: scraperData.data.author,
          images: scraperData.data.images || [], // Includes HD image URLs for photo posts
        },
      });
    } else {
      return NextResponse.json(
        { 
          status: "error", 
          message: scraperData.msg || "Failed to find video. Account might be private or link is invalid." 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("TikTok API Error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { status: "error", message: "Network error or API blocked. Try another link." },
      { status: 500 }
    );
  }
}
