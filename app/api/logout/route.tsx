import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const token = (await cookies()).get("sessionToken")?.value;
    if (token) {
        await prisma.session.deleteMany({ where: { token } });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set("sessionToken", "", {
        path: "/",
        maxAge: 0,
    });
    return response
}