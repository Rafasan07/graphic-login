import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const audio: string[] = [];

    const { blobs } = await list({
        token: process.env.Stock_Images_Blob_READ_WRITE_TOKEN,
        limit: 20,
    });
    for (const blob of blobs) {
        if (blob.url.toLowerCase().endsWith(".mp3")) {
            audio.push(blob.url);
        }
    }

    return NextResponse.json({ audio });
}