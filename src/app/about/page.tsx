import Link from "next/link";

export default function AboutPage() {
    return (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.15em", color: "#7a6a4a", fontWeight: 700 }}>About us</p>
            <h1 style={{ fontSize: "clamp(2.3rem, 5vw, 3.5rem)", marginTop: 10 }}>A real-estate brand built around trust, design, and long-term value.</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem", marginTop: "2rem" }}>
                <div style={{ background: "#fff", borderRadius: 24, padding: "1.5rem" }}>
                    <p style={{ color: "#505050" }}>
                        MS Infra is focused on developing premium residential and lifestyle-oriented projects that blend elegant architecture, strategic locations, and everyday convenience. We believe in creating homes that support modern living while delivering long-term value for families and investors.
                    </p>
                    <p style={{ marginTop: "1rem", color: "#505050" }}>
                        With a strong understanding of Bhiwandi’s growth pattern and residential demand, we design projects that are relevant, future-ready, and thoughtfully built for the way people live today.
                    </p>
                </div>

                <div style={{ background: "#fff", borderRadius: 24, padding: "1.5rem" }}>
                    <h3>Our principles</h3>
                    <ul style={{ listStyle: "none", display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
                        <li>• Quality-first construction</li>
                        <li>• Value-focused planning</li>
                        <li>• Transparent communication</li>
                        <li>• Location-led opportunity</li>
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                {[
                    ["Location Focus", "Bhiwandi and surrounding growth corridors"],
                    ["Design-led", "Elegant, practical living spaces"],
                    ["Client-first", "Clear support from enquiry to possession"],
                ].map(([title, text]) => (
                    <div key={title} style={{ background: "#fff", borderRadius: 18, padding: "1.4rem" }}>
                        <h3>{title}</h3>
                        <p style={{ marginTop: "0.6rem", color: "#505050" }}>{text}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
                <Link href="/contact" style={{ background: "#111", color: "#fff", padding: "0.9rem 1.5rem", borderRadius: 999 }}>Contact MS Infra</Link>
            </div>
        </main>
    );
}
