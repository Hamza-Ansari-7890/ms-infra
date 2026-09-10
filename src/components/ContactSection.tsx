import { EnquiryForm } from "@/components/EnquiryForm";

type ContactSectionProps = {
    projects: { name: string; slug: string }[];
    defaultProject?: string;
};

export function ContactSection({ projects, defaultProject = "" }: ContactSectionProps) {
    return (
        <section id="contact" className="home-contact-section">
            <div className="home-contact-grid">
                <div className="home-contact-copy">
                    <p className="contact-eyebrow">Contact</p>
                    <h2>Let&apos;s talk about your next address.</h2>
                    <p className="contact-intro">Tell us what you are looking for and our property advisors will help you find the right fit.</p>
                    <div className="contact-details">
                        <div><span>Phone</span><a href="tel:8856004430">8856004430</a></div>
                        <div><span>Email</span><a href="mailto:msinfravision@gmail.com">msinfravision@gmail.com</a></div>
                        <div><span>Visit</span><p>MS Residency, Ajanta Compound, Near Jain Mandir, Bhiwandi</p></div>
                    </div>
                    <div className="contact-actions">
                        <a href="tel:8856004430">Call Now</a>
                        <a href="https://wa.me/918856004430" target="_blank" rel="noreferrer">WhatsApp</a>
                    </div>
                </div>

                <div className="home-contact-form">
                    <div className="contact-form-heading">
                        <p className="contact-eyebrow">Private consultation</p>
                        <h3>Send an enquiry</h3>
                    </div>
                    <EnquiryForm defaultProject={defaultProject} projects={projects} />
                </div>
            </div>
        </section>
    );
}
