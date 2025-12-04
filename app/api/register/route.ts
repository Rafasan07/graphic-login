import prisma from "@/app/lib/prisma";
import { ClickPoint } from "@/app/register/page";
import { processClicks } from "@/app/utils/clicks";
import { sanitizeEmail, sanitizeUsername } from "@/app/utils/validation";
import * as argon2 from "argon2";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {

        const body = await req.json().catch(() => null);
        if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

        const {
            email,
            username,
            imageUrl,
            picturePassword,
            secretClicks,
        } = body;
        const emailSan = sanitizeEmail(email);
        if (!emailSan.ok) return NextResponse.json({ error: emailSan.error }, { status: 400 });

        const userSan = sanitizeUsername(username);
        if (!userSan.ok) return NextResponse.json({ error: userSan.error }, { status: 400 });

        const existing = await prisma.user.findUnique({ where: { email: emailSan.value } });
        if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        // Flatten arrays into a single array
        const allClicks: ClickPoint[] = [...picturePassword, ...secretClicks];
        const serializedPassword = processClicks(allClicks);
        const hashedPassword = await argon2.hash(serializedPassword);

        const user = await prisma.user.create({
            data: {
                email: emailSan.value,
                username: userSan.value,
                imageUrl: imageUrl,
                picturePassword: hashedPassword,
            },
        });
        // create session token 
        const sessionToken = crypto.randomUUID();
        await prisma.session.create({
            data: {
                token: sessionToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, username: user.username } });
        response.cookies.set("sessionToken", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });
        return response;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
