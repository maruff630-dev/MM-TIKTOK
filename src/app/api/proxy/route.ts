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

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch file from TikTok CDN");

    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
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
