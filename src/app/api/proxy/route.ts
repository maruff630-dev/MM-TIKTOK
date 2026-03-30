import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url, filename } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch file");

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${filename || "download"}"`);

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Proxy Download Error:", error.message);
    return NextResponse.json({ error: "Failed to download" }, { status: 500 });
  }
}
