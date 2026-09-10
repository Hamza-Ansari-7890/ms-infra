import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = String(body?.email ?? "").trim().toLowerCase();
        const password = String(body?.password ?? "");

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        await setAdminSession({ id: user.id, email: user.email, name: user.name });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin login error", error);
        return NextResponse.json({ error: "Unable to login at the moment. Please try again." }, { status: 500 });
    }
}
