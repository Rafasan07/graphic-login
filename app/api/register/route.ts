import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // You can log the request body if you want
    const body = await req.json();
    console.log('Request body:', body);

    // Just return a placeholder response
    return NextResponse.json({ message: 'Login API placeholder works!' });
}