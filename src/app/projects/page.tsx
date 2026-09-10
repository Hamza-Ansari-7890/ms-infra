import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { BrandLogo } from "@/components/BrandLogo";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollNav } from "@/components/ScrollNav";

const statusFilters = ["ALL", "New Launch", "Under Construction", "Ready to Move"] as const;

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams?: Promise<{ status?: string }>;
}) {
    const params = searchParams ? await searchParams : {};
    const selectedStatus = params.status ?? "ALL";

    const where = selectedStatus === "ALL"
        ? { published: true }
        : { published: true, status: selectedStatus };

    const projects = await prisma.project.findMany({
        where,
        orderBy: [{ featured: "desc" }, { displayOrder: "asc" }],
    });

    return (
        <main className="projects-page" style={{ background: "#f4efe9", minHeight: "100vh" }}>
            <header style={{ background: "linear-gradient(120deg, rgba(18,18,18,0.7), rgba(43,35,28,0.8)), url('https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1800&q=80') center/cover no-repeat" }}>
                <ScrollNav className="site-nav" style={{ maxWidth: 1200, margin: "0 auto", padding: "1.3rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", color: "#fff" }}>
                    <Link href="/"><BrandLogo inverted /></Link>
                    <Link href="/" style={{ background: "#f1d7a8", color: "#111", padding: "0.72rem 1.1rem", borderRadius: 999, fontWeight: 700 }}>Home</Link>
                </ScrollNav>

                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>
                    <p style={{ textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, color: "#d4b36a" }}>Our portfolio</p>
                    <h1 style={{ fontSize: "clamp(2.4rem, 4vw, 4rem)", color: "#fff", marginTop: "0.6rem" }}>Premium projects, handpicked for modern living.</h1>
                </div>
            </header>

            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                    {statusFilters.map((status) => {
                        const isActive = selectedStatus === status;
                        return (
                            <Link
                                key={status}
                                href={status === "ALL" ? "/projects" : `/projects?status=${encodeURIComponent(status)}`}
                                style={{
                                    background: isActive ? "#111" : "#fff",
                                    color: isActive ? "#fff" : "#111",
                                    borderRadius: 999,
                                    padding: "0.72rem 1.1rem",
                                    fontWeight: 700,
                                    border: "1px solid rgba(17,17,17,0.08)",
                                    boxShadow: isActive ? "0 18px 40px rgba(17,17,17,0.12)" : "none",
                                }}
                            >
                                {status}
                            </Link>
                        );
                    })}
                </div>

                <ScrollReveal className="stagger-grid"><div className="stagger-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.7rem" }}>
                    {projects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.slug}`} style={{ background: "#fff", borderRadius: 28, overflow: "hidden", boxShadow: "0 26px 60px rgba(17,17,17,0.08)", border: "1px solid rgba(17,17,17,0.04)" }}>
                            <div style={{ position: "relative", height: 260 }}>
                                <Image src={project.mainImage ?? "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80"} alt={project.name} fill style={{ objectFit: "cover" }} />
                            </div>
                            <div style={{ padding: "1.3rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", alignItems: "center" }}>
                                    <strong style={{ fontSize: 20 }}>{project.name}</strong>
                                    <span style={{ background: "#f3ead7", color: "#7a6a4a", borderRadius: 999, padding: "0.3rem 0.65rem", fontSize: 12, fontWeight: 700 }}>{project.status}</span>
                                </div>
                                <p style={{ marginTop: "0.8rem", color: "#585858", lineHeight: 1.7 }}>{project.shortDescription}</p>
                                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #efeae2", paddingTop: "0.8rem" }}>
                                    <span>{project.location}</span>
                                    <strong>{project.priceRange ?? "On request"}</strong>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div></ScrollReveal>
            </section>
        </main>
    );
}
