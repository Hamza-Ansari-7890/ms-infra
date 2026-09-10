"use client";

import { FormEvent, useState } from "react";

export function EnquiryForm({ defaultProject = "", projects = [] }: { defaultProject?: string; projects?: { name: string; slug: string }[] }) {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        const form = event.currentTarget;
        const formData = new FormData(form);
        const rawMobile = String(formData.get("mobile") ?? "").trim();
        const normalizedMobile = rawMobile.replace(/[\s()-]/g, "");

        if (!/^(?:\+91|91)?[6-9][0-9]{9}$/.test(normalizedMobile)) {
            setError("Please enter a valid mobile number with 10 to 15 digits.");
            setLoading(false);
            return;
        }

        const payload = Object.fromEntries(formData.entries());
        payload.mobile = normalizedMobile;

        try {
            const response = await fetch("/api/enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) {
                setError(result.error ?? "Please check the form and try again.");
                setLoading(false);
                return;
            }

            setSubmitted(true);
            form.reset();
            setMessage("Thank you. Your enquiry has been received and our team will contact you soon.");
        } catch {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                <label style={{ display: "grid", gap: "0.5rem" }}>
                    <span>Full Name</span>
                    <input name="fullName" required minLength={2} maxLength={100} pattern="[A-Za-z][A-Za-z .'-]{1,99}" autoComplete="name" style={{ padding: "0.85rem 1rem", borderRadius: 12, border: "1px solid #d9d2c9" }} />
                </label>

                <label style={{ display: "grid", gap: "0.5rem" }}>
                    <span>Mobile Number</span>
                    <input
                        type="tel"
                        name="mobile"
                        required
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="e.g. +91 98765 43210"
                        pattern="(?:\+91|91)?[6-9][0-9]{9}"
                        maxLength={16}
                        style={{ padding: "0.85rem 1rem", borderRadius: 12, border: "1px solid #d9d2c9" }}
                    />
                </label>

                <label style={{ display: "grid", gap: "0.5rem" }}>
                    <span>Email</span>
                    <input type="email" name="email" required maxLength={160} autoComplete="email" style={{ padding: "0.85rem 1rem", borderRadius: 12, border: "1px solid #d9d2c9" }} />
                </label>

                <label style={{ display: "grid", gap: "0.5rem" }}>
                    <span>Interested Project</span>
                    <select name="interestedProject" defaultValue={defaultProject} required style={{ padding: "0.85rem 1rem", borderRadius: 12, border: "1px solid #d9d2c9", background: "#fff" }}>
                        <option value="" disabled>Select a project</option>
                        {projects.map((project) => <option key={project.slug} value={project.slug}>{project.name}</option>)}
                    </select>
                </label>
            </div>

            <label style={{ display: "grid", gap: "0.5rem" }}>
                <span>Preferred Contact Method</span>
                <select name="preferredContactMethod" defaultValue="Call" style={{ padding: "0.85rem 1rem", borderRadius: 12, border: "1px solid #d9d2c9" }}>
                    <option value="Call">Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                </select>
            </label>

            <label style={{ display: "grid", gap: "0.5rem" }}>
                <span>Message</span>
                <textarea name="message" required minLength={10} maxLength={500} rows={5} style={{ padding: "0.85rem 1rem", borderRadius: 12, border: "1px solid #d9d2c9" }} />
            </label>

            {error ? <p style={{ color: "#b42318" }}>{error}</p> : null}
            {submitted ? <p style={{ color: "#166534" }}>{message}</p> : null}

            <button type="submit" disabled={loading} style={{ background: "#111", color: "#fff", borderRadius: 999, padding: "0.9rem 1.4rem", fontWeight: 700, cursor: "pointer" }}>
                {loading ? "Sending..." : "Send Enquiry"}
            </button>
        </form>
    );
}
