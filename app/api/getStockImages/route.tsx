import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    let images = [];
    const { blobs } = await list({
        token: process.env.Stock_Images_Blob_READ_WRITE_TOKEN,
        limit: 6
    });
    for (const blob of blobs) {
        images.push(blob.url);
    }
    return NextResponse.json({ images: images });
}
