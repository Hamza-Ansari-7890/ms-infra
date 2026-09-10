import { EnquiryForm } from "@/components/EnquiryForm";

export default function ContactPage() {
    return (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.15em", color: "#7a6a4a", fontWeight: 700 }}>Contact</p>
            <h1 style={{ fontSize: "clamp(2.3rem, 5vw, 3.5rem)", marginTop: 10 }}>Let’s talk about your next address.</h1>

            <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "2rem", marginTop: "2rem" }}>
                <div style={{ background: "#fff", borderRadius: 24, padding: "1.7rem" }}>
                    <h3>Reach us</h3>
                    <ul style={{ listStyle: "none", display: "grid", gap: "1rem", marginTop: "1rem" }}>
                        <li>Phone: <a href="tel:8856004430">8856004430</a></li>
                        <li>Email: <a href="mailto:msinfravision@gmail.com">msinfravision@gmail.com</a></li>
                        <li>Address: MS Residency, Ajanta Compound, Near Jain Mandir, Bhiwandi</li>
                    </ul>
                    <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <a href="tel:8856004430" style={{ background: "#111", color: "#fff", padding: "0.8rem 1.2rem", borderRadius: 999 }}>Call Now</a>
                        <a href="https://wa.me/918856004430" target="_blank" rel="noreferrer" style={{ background: "#f3e7cb", color: "#111", padding: "0.8rem 1.2rem", borderRadius: 999 }}>WhatsApp</a>
                    </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 24, padding: "1.7rem" }}>
                    <h3>Send an enquiry</h3>
                    <div style={{ marginTop: "1rem" }}>
                        <EnquiryForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
