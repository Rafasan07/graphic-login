import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    // logic to qury for user based on username
    const user = {
        username: "admin",
        email: "admin@gmail.com",
        imageUrl: "file.svg",
        picturePassword: "",
        secretClick: ""
    }
    return NextResponse.json({ user: user });
}
