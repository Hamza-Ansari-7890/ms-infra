import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "ms_infra_admin_session";

export type SessionPayload = {
    userId: string;
    email: string;
    name: string;
    expiresAt: number;
};

function signSession(payload: SessionPayload) {
    const secret = process.env.SESSION_SECRET ?? "development-secret";
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
    return `${encoded}.${signature}`;
}

function verifySignedSession(token: string): SessionPayload | null {
    const secret = process.env.SESSION_SECRET ?? "development-secret";
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    const expectedSignature = createHmac("sha256", secret).update(encoded).digest("base64url");
    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSignature);
    if (a.length !== b.length) return null;

    if (!timingSafeEqual(a, b)) return null;

    try {
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
        if (!payload.userId || !payload.email || payload.expiresAt < Date.now()) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}

export async function getAdminSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySignedSession(token);
}

export async function requireAdminSession() {
    const session = await getAdminSession();
    if (!session) {
        redirect("/admin/login");
    }
    return session;
}

export async function setAdminSession(user: { id: string; email: string; name: string }) {
    const cookieStore = await cookies();
    const payload: SessionPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        expiresAt: Date.now() + 1000 * 60 * 60 * 8,
    };
    const token = signSession(payload);
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
    });
}

export async function clearAdminSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminUser() {
    const session = await getAdminSession();
    if (!session) return null;

    try {
        return await prisma.adminUser.findUnique({ where: { id: session.userId } });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return null;
        }
        throw error;
    }
}
