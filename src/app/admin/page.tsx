import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export default async function AdminDashboardPage() {
    const session = await getAdminSession();
    const [totalProjects, totalEnquiries, newEnquiries, convertedEnquiries, publishedProjects, draftProjects] = await Promise.all([
        prisma.project.count(),
        prisma.enquiry.count(),
        prisma.enquiry.count({ where: { status: "New" } }),
        prisma.enquiry.count({ where: { status: "Converted" } }),
        prisma.project.count({ where: { published: true } }),
        prisma.project.count({ where: { published: false } }),
    ]);

    return (
        <main style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{ fontSize: "2.1rem", marginBottom: "1rem" }}>MS Infra Admin</h1>
            <p style={{ marginBottom: "2rem", color: "#555" }}>Logged in as {session?.name ?? "Admin"}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                {[
                    ["Total Projects", totalProjects],
                    ["Published Projects", publishedProjects],
                    ["Draft Projects", draftProjects],
                    ["Total Enquiries", totalEnquiries],
                    ["New Enquiries", newEnquiries],
                    ["Converted", convertedEnquiries],
                ].map(([label, value]) => (
                    <div key={label} style={{ background: "#fff", borderRadius: 18, padding: "1.25rem", boxShadow: "0 10px 30px rgba(16,16,16,0.05)" }}>
                        <p style={{ color: "#6b7280", textTransform: "uppercase", fontSize: 12, letterSpacing: "0.08em" }}>{label}</p>
                        <h2 style={{ fontSize: "2rem", marginTop: "0.4rem" }}>{value}</h2>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="/admin/projects" style={{ background: "#1a1a1a", color: "#fff", padding: "0.9rem 1.3rem", borderRadius: 12 }}>Manage Projects</a>
                <a href="/admin/enquiries" style={{ background: "#eee", color: "#111", padding: "0.9rem 1.3rem", borderRadius: 12 }}>View Enquiries</a>
                <form action="/api/admin/logout" method="POST"><button type="submit" style={{ background: "#8d2d2d", color: "#fff", padding: "0.9rem 1.3rem", borderRadius: 12 }}>Logout</button></form>
            </div>
        </main>
    );
}
