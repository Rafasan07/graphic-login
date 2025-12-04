import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const token = (await cookies()).get("sessionToken")?.value;
    if (!token)
        return NextResponse.json({ ok: false, user: null });
    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
    });
    if (!session || session.expiresAt < new Date())
        return NextResponse.json({ ok: false, user: null });
    return NextResponse.json({ ok: true, user: { id: session.user.id, email: session.user.email, username: session.user.username } });
}