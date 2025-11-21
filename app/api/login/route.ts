import { sanitizeEmail, sanitizeUsername } from "@/app/utils/validation";
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
            secretClick,
        } = body;
        console.log('Login called with:', body);
        const emailSan = sanitizeEmail(email);
        if (!emailSan.ok) return NextResponse.json({ error: emailSan.error }, { status: 400 });

        const userSan = sanitizeUsername(username);
        if (!userSan.ok) return NextResponse.json({ error: userSan.error }, { status: 400 });

        const existing = await prisma?.user.findUnique({ where: { email: emailSan.value } });
        if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

        // const user = await prisma.user.create({
        //     data: { email: emailSan.value, displayName: userSan.value },
        // });
        console.log('Log in user:', {
            email: emailSan.value, username: userSan.value, imageUrl,
            picturePassword,
            secretClick,
        });

        return NextResponse.json({ ok: true, id: 1 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
