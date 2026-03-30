import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const filename = searchParams.get("filename") || "download.mp4";

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Pass a strong desktop User-Agent to force TikTok CDN to return the highest uncompressed bitrate stream
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.tiktok.com/"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch file from TikTok CDN");

    const headers = new Headers();
    
    // Explicitly set media MIME types so Android/iOS Media Scanners detect and index them in the Gallery app
    if (filename.toLowerCase().endsWith(".mp4")) {
      headers.set("Content-Type", "video/mp4");
    } else if (filename.toLowerCase().endsWith(".mp3")) {
      headers.set("Content-Type", "audio/mpeg");
    } else {
      headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
    }

    // Pass the exact file size to the mobile browser to prevent early stream termination (which causes corrupted 'black screen' MP4 files)
    const contentLength = response.headers.get("Content-Length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    // Force browser to pop up native download manager
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    // Stream the body directly to the client
    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Proxy Download Error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to download" }, { status: 500 });
  }
}

// Keep POST for backward compatibility during transition if needed
export async function POST(req: Request) {
  try {
    const { url, filename } = await req.json();
    const downloadUrl = new URL(req.url);
    downloadUrl.searchParams.set("url", url);
    if(filename) downloadUrl.searchParams.set("filename", filename);
    
    return GET(new Request(downloadUrl.toString()));
  } catch {
    return NextResponse.json({ error: "Invalid POST body" }, { status: 400 });
  }
}
