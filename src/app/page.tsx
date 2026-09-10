import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { HeroImageSlider } from "@/components/HeroImageSlider";
import { BrandLogo } from "@/components/BrandLogo";
import { NumberCounter } from "@/components/NumberCounter";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContactSection } from "@/components/ContactSection";
import { ScrollNav } from "@/components/ScrollNav";

export default async function HomePage() {
  const featuredProjects = await prisma.project.findMany({
    where: { published: true, featured: true },
    take: 3,
    orderBy: { displayOrder: "asc" },
  });
  const enquiryProjects = await prisma.project.findMany({
    where: { published: true },
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });

  const highlights = [
    { title: "Prime locations", text: "Projects positioned near transport, schools, and commercial hubs." },
    { title: "Thoughtful design", text: "Modern planning with comfort, light, and lifestyle in mind." },
    { title: "Transparent delivery", text: "Clear communication, trust-driven processes, and better buyer confidence." },
  ];

  return (
    <main style={{ background: "#f4efe9" }}>
      <header style={{ background: "linear-gradient(120deg, rgba(13,14,15,0.72), rgba(40,36,29,0.68)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat" }}>
        <ScrollNav className="site-nav" style={{ maxWidth: 1200, margin: "0 auto", padding: "1.3rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", gap: "1rem", position: "relative", zIndex: 1 }}>
          <BrandLogo inverted />

          <div className="site-nav-links" style={{ display: "flex", gap: "1.2rem", alignItems: "center", fontSize: 14, flexWrap: "wrap" }}>
            <a href="#home" style={{ color: "#fff", opacity: 0.88 }}>Home</a>
            <a href="#about" style={{ color: "#fff", opacity: 0.88 }}>About</a>
            <a href="#projects" style={{ color: "#fff", opacity: 0.88 }}>Projects</a>
            <a href="#contact" style={{ color: "#fff", opacity: 0.88 }}>Contact</a>
            <Link href="/projects" style={{ background: "#f1d7a8", color: "#111", padding: "0.72rem 1.1rem", borderRadius: 999, fontWeight: 700 }}>Explore</Link>
          </div>
        </ScrollNav>

        <section id="home" className="home-hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 1.5rem 6rem", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem", alignItems: "center" }}>
          <div style={{ color: "#fff" }}>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 12, opacity: 0.9 }}>Premium Residences</p>
            <h1 style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", lineHeight: 1.03, marginTop: "0.6rem" }}>Where thoughtful living meets refined investment.</h1>
            <p style={{ marginTop: "1rem", maxWidth: 560, fontSize: "1.08rem", lineHeight: 1.8, color: "rgba(255,255,255,0.88)" }}>
              Discover elegant homes, premium amenities, and growth-led locations designed for modern families and smart investors in Bhiwandi.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
              <Link href="/projects" style={{ background: "#f1d7a8", color: "#111", padding: "0.9rem 1.5rem", borderRadius: 999, fontWeight: 800 }}>Explore Projects</Link>
              <a href="tel:8856004430" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", padding: "0.9rem 1.5rem", borderRadius: 999, fontWeight: 700 }}>Call Now</a>
            </div>

            <div className="hero-stats" style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {[[25, "+", "Projects"], [12, "", "Years of expertise"], [99, "%", "Client satisfaction"]].map(([value, suffix, label]) => (
                <div key={label} style={{ minWidth: 120, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "0.9rem 1rem" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800 }}><NumberCounter value={Number(value)} suffix={String(suffix)} /></div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(14px)", borderRadius: 28, padding: "1.1rem", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.22)" }}>
            <HeroImageSlider />
          </div>
        </section>
      </header>

      <ScrollReveal className="section-reveal"><section id="projects" style={{ maxWidth: 1200, margin: "0 auto", padding: "4.5rem 1.5rem 2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ color: "#7a6a4a", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 800 }}>Featured developments</p>
            <h2 style={{ fontSize: "clamp(2rem, 3vw, 3rem)", marginTop: "0.5rem" }}>Curated homes for future-ready living</h2>
          </div>
          <Link href="/projects" style={{ color: "#111", fontWeight: 800 }}>View all projects</Link>
        </div>

        <div className="stagger-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.6rem" }}>
          {featuredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} style={{ background: "#fff", borderRadius: 26, overflow: "hidden", boxShadow: "0 26px 60px rgba(16,16,16,0.08)", border: "1px solid rgba(17,17,17,0.04)", display: "block" }}>
              <div style={{ position: "relative", height: 235 }}>
                <Image src={project.mainImage ?? "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80"} alt={project.name} fill style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: "1.3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem" }}>
                  <strong style={{ fontSize: 18 }}>{project.name}</strong>
                  <span style={{ background: "#f3ead7", color: "#7a6a4a", padding: "0.28rem 0.62rem", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{project.status}</span>
                </div>
                <p style={{ marginTop: "0.8rem", color: "#5e5d5a" }}>{project.shortDescription}</p>
                <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #efebe5", paddingTop: "0.8rem" }}>
                  <span>{project.location}</span>
                  <strong>{project.priceRange ?? "On request"}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section></ScrollReveal>

      <ScrollReveal className="section-reveal"><section style={{ background: "#f0e8df", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 2rem" }}>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, color: "#7a6a4a" }}>Why choose us</p>
            <h2 style={{ fontSize: "clamp(2rem, 3vw, 3rem)", marginTop: "0.5rem" }}>Designed for better living and stronger value.</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem" }}>
            {highlights.map((item) => (
              <div key={item.title} className="lift-card" style={{ background: "#fff", borderRadius: 22, padding: "1.5rem", boxShadow: "0 18px 44px rgba(16,16,16,0.04)" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f3ead7", display: "grid", placeItems: "center", fontWeight: 800, color: "#111", marginBottom: "0.9rem" }}>✓</div>
                <h3>{item.title}</h3>
                <p style={{ marginTop: "0.5rem", color: "#525252" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal className="section-reveal"><section id="about" style={{ maxWidth: 1200, margin: "0 auto", padding: "4.5rem 1.5rem 2.5rem" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "2rem", alignItems: "center" }}>
          <div>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, color: "#7a6a4a" }}>About MS Infra</p>
            <h2 style={{ fontSize: "clamp(2rem, 3vw, 3rem)", marginTop: "0.5rem" }}>A real-estate brand built on trust, design, and long-term value.</h2>
            <p style={{ marginTop: "1rem", color: "#4d4d4d", fontSize: "1.04rem", lineHeight: 1.85 }}>
              MS Infra is focused on developing premium residential and lifestyle-oriented projects that blend elegant architecture, strategic locations, and everyday convenience. We create homes that support modern living while delivering lasting value for families and investors.
            </p>
            <div style={{ marginTop: "1.4rem", display: "grid", gap: "0.8rem" }}>
              {[
                "Quality-first construction with a lifestyle approach",
                "Location-led investments across Bhiwandi growth corridors",
                "Transparent, customer-first communication from enquiry to possession",
              ].map((item) => (
                <div key={item} style={{ background: "#fff", borderRadius: 16, padding: "0.95rem 1rem" }}>{item}</div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", height: 430, borderRadius: 30, overflow: "hidden", boxShadow: "0 26px 60px rgba(17,17,17,0.08)" }}>
            <Image src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80" alt="Premium residential development" fill style={{ objectFit: "cover" }} />
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal className="section-reveal"><ContactSection projects={enquiryProjects} /></ScrollReveal>

      <footer style={{ background: "#0b0d0f", color: "#d9d9d9", padding: "2.2rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <BrandLogo inverted />
            <p style={{ marginTop: "0.5rem" }}>MS Residency, Ajanta Compound, Near Jain Mandir, Bhiwandi</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="tel:8856004430">Call</a>
            <a href="mailto:msinfravision@gmail.com">Email</a>
            <a href="https://wa.me/918856004430" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
