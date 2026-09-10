import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FloorPlanCarousel, ImageCarousel } from "@/components/MediaCarousel";
import { BrandLogo } from "@/components/BrandLogo";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContactSection } from "@/components/ContactSection";
import { ScrollNav } from "@/components/ScrollNav";

function isValidImageSource(value: string | null | undefined): value is string {
    return Boolean(value && (/^https?:\/\//i.test(value) || value.startsWith("/") || value.startsWith("data:image/")));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await prisma.project.findUnique({
        where: { slug },
        include: {
            amenities: true,
            highlights: true,
            locationBenefits: true,
            nearbyLandmarks: true,
            floorPlans: true,
            images: true,
        },
    });

    if (!project || !project.published) {
        notFound();
    }

    const gallery = project.images.filter((image) => image.kind === "gallery" && isValidImageSource(image.url));
    const enquiryProjects = await prisma.project.findMany({
        where: { published: true },
        select: { name: true, slug: true },
        orderBy: { name: "asc" },
    });

    return (
        <main className="project-detail" style={{ background: "#f5f1eb" }}>
            <header style={{ position: "relative", background: "linear-gradient(135deg, rgba(18,18,18,0.7), rgba(45,34,24,0.8)), url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat" }}>
                <ScrollNav className="site-nav" style={{ maxWidth: 1200, margin: "0 auto", padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
                    <Link href="/projects"><BrandLogo inverted /></Link>
                    <Link href="/projects" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", padding: "0.7rem 1rem", borderRadius: 999 }}>Back to projects</Link>
                </ScrollNav>

                <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "4rem 1.5rem 3rem", color: "#fff" }}>
                    <div style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "0.45rem 0.8rem", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>{project.status}</div>
                    <h1 style={{ fontSize: "clamp(2.6rem, 5vw, 4.4rem)", lineHeight: 1.05, marginTop: "1rem" }}>{project.name}</h1>
                    <p style={{ marginTop: "1rem", maxWidth: 700, fontSize: "1.05rem", lineHeight: 1.8, color: "rgba(255,255,255,0.9)" }}>{project.shortDescription}</p>
                </div>
            </header>

            <section className="project-detail-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem 0" }}>
                <div className="project-intro-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: "2rem" }}>
                    {(project.propertyOverview || project.fullDescription) ? (
                        <div style={{ background: "#fff", borderRadius: 28, padding: "1.5rem", boxShadow: "0 22px 55px rgba(17,17,17,0.05)" }}>
                            <p style={{ textTransform: "uppercase", letterSpacing: "0.12em", color: "#7a6a4a", fontWeight: 800 }}>Overview</p>
                            <p style={{ marginTop: "0.8rem", color: "#4e4e4e", lineHeight: 1.85 }}>{project.propertyOverview ?? project.fullDescription}</p>
                        </div>
                    ) : null}

                    <aside style={{ background: "#fff", borderRadius: 28, padding: "1.5rem", boxShadow: "0 22px 55px rgba(17,17,17,0.05)" }}>
                        <p style={{ color: "#7a6a4a", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800 }}>Price</p>
                        <h3 style={{ fontSize: "2rem", marginTop: "0.6rem" }}>{project.priceRange ?? "On request"}</h3>
                        <ul style={{ listStyle: "none", marginTop: "1.1rem", display: "grid", gap: "0.7rem", color: "#454545" }}>
                            <li>Location: {project.location}</li>
                            {project.area ? <li>Area: {project.area}</li> : null}
                        </ul>
                        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1.2rem" }}>
                            <a href="tel:8856004430" style={{ display: "inline-block", background: "#111", color: "#fff", padding: "0.9rem 1.4rem", borderRadius: 999, fontWeight: 700 }}>Call Now</a>
                            <a href="https://wa.me/918856004430" target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#f3ead7", color: "#111", padding: "0.9rem 1.4rem", borderRadius: 999, fontWeight: 700 }}>WhatsApp</a>
                        </div>
                    </aside>
                </div>
            </section>

            {gallery.length ? <ImageCarousel title="Gallery" images={gallery.map((image) => ({ id: image.id ?? image.url, url: image.url, altText: image.altText }))} /> : null}

            {project.amenities.length ? (
                <ScrollReveal>
                    <section className="detail-content-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem 0" }}>
                        <div className="detail-section-heading">
                            <p className="eyebrow">Everyday comfort</p>
                            <h2>Amenities</h2>
                        </div>
                        <div className="amenities-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.8rem" }}>
                            {project.amenities.map((item) => (
                                <div key={item.id} className="amenity-tile"><span aria-hidden="true">+</span>{item.name}</div>
                            ))}
                        </div>
                    </section>
                </ScrollReveal>
            ) : null}

            {project.floorPlans.some((plan) => isValidImageSource(plan.imageUrl)) ? (
                <FloorPlanCarousel plans={project.floorPlans.filter((plan) => isValidImageSource(plan.imageUrl)).map((plan) => ({ id: plan.id, url: plan.imageUrl! }))} />
            ) : null}

            {(project.locationBenefits.length || project.nearbyLandmarks.length) ? (
                <ScrollReveal>
                    <section className="detail-content-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem 0" }}>
                        <div className="project-benefits-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                            {project.locationBenefits.length ? (
                                <div className="detail-list-panel">
                                    <p className="eyebrow">Connected living</p>
                                    <h2>Location benefits</h2>
                                    <ul style={{ listStyle: "none", display: "grid", gap: "0.7rem", marginTop: "1rem", color: "#454545" }}>
                                        {project.locationBenefits.map((item) => <li key={item.id}><span aria-hidden="true">↗</span>{item.title}</li>)}
                                    </ul>
                                </div>
                            ) : null}

                            {project.nearbyLandmarks.length ? (
                                <div className="detail-list-panel">
                                    <p className="eyebrow">Everything within reach</p>
                                    <h2>Nearby landmarks</h2>
                                    <ul style={{ listStyle: "none", display: "grid", gap: "0.7rem", marginTop: "1rem", color: "#454545" }}>
                                        {project.nearbyLandmarks.map((item) => <li key={item.id}><span aria-hidden="true">⌖</span><strong>{item.name}</strong><small>{item.distance}</small></li>)}
                                    </ul>
                                </div>
                            ) : null}
                        </div>
                    </section>
                </ScrollReveal>
            ) : null}

            <ContactSection defaultProject={project.slug} projects={enquiryProjects} />
        </main>
    );
}
