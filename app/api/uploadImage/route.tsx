import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const blob = await put(file.name, file, {
        access: 'public',
    });
    return NextResponse.json({ url: blob.url });
    // Just return a placeholder response
}