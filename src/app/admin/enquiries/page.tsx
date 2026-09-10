import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminEnquiriesPage() {
    await requireAdminSession();
    const enquiries = await prisma.enquiry.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
            <h1>Enquiries</h1>
            <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
                {enquiries.map((enquiry) => (
                    <div key={enquiry.id} style={{ background: "#fff", borderRadius: 18, padding: "1rem 1.2rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                            <div>
                                <strong>{enquiry.fullName}</strong>
                                <p>{enquiry.email} · {enquiry.mobile}</p>
                            </div>
                            <span style={{ background: "#f3e7cb", padding: "0.4rem 0.7rem", borderRadius: 999 }}>{enquiry.status}</span>
                        </div>
                        <p style={{ marginTop: "0.7rem" }}>{enquiry.message}</p>
                        <p style={{ marginTop: "0.5rem", color: "#666" }}>Project: {enquiry.interestedProject ?? "General enquiry"}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
