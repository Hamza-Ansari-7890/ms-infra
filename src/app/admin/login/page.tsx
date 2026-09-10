"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("msinfraasim@gmail.com");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const payload = await res.json();
            setError(payload?.error ?? "Invalid credentials");
            setLoading(false);
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f7f4ef" }}>
            <section style={{ width: "min(100%, 460px)", background: "#fff", padding: "2rem", borderRadius: 20, boxShadow: "0 18px 50px rgba(24,24,27,0.08)" }}>
                <p style={{ textTransform: "uppercase", color: "#7a6a4a", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "0.8rem" }}>MS Infra</p>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Admin Login</h1>
                <p style={{ marginBottom: "1.5rem", color: "#5d5d5d" }}>Sign in to manage projects, enquiries, and content.</p>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                    <label style={{ display: "grid", gap: "0.4rem" }}>
                        <span>Email</span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #d8d3ce" }} />
                    </label>

                    <label style={{ display: "grid", gap: "0.4rem" }}>
                        <span>Password</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #d8d3ce" }} />
                    </label>

                    {error ? <p style={{ color: "#b22424", fontSize: "0.92rem" }}>{error}</p> : null}

                    <button type="submit" disabled={loading} style={{ background: "#1a1a1a", color: "#fff", padding: "0.9rem 1.2rem", borderRadius: 12, fontWeight: 700 }}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>
            </section>
        </main>
    );
}
