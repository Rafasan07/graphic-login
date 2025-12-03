import { sanitizeEmail, sanitizeUsername } from "@/app/utils/validation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";




export async function POST(req: NextRequest) {
    try {

        const body = await req.json().catch(() => null);
        if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

        const { email } = body;
        const emailSan = sanitizeEmail(email);
        if (!emailSan.ok) return NextResponse.json({ error: emailSan.error }, { status: 400 });

        const user = await prisma.user.findUnique({
            where: { email: emailSan.value },
        });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

        return NextResponse.json({ ok: true, imageUrl: user.imageUrl });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}