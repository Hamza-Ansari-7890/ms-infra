import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
    fullName: z.string().trim().regex(/^[A-Za-z][A-Za-z .'-]{1,99}$/, "Enter a valid name."),
    mobile: z.string().trim().regex(/^(?:\+91|91)?[6-9][0-9]{9}$/, "Enter a valid Indian mobile number."),
    email: z.string().trim().email("Enter a valid email."),
    interestedProject: z.string().trim().max(200).optional().or(z.literal("")),
    preferredContactMethod: z.enum(["Call", "WhatsApp", "Email"]),
    message: z.string().trim().min(10).max(500),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation failed." }, { status: 400 });
        }

        const data = parsed.data;
        const normalizedMobile = data.mobile.replace(/[\s()-]/g, "");

        if (!/^(?:\+91|91)?[6-9][0-9]{9}$/.test(normalizedMobile)) {
            return NextResponse.json({ error: "Please enter a valid Indian mobile number." }, { status: 400 });
        }

        let project = null;

        if (data.interestedProject) {
            project = await prisma.project.findFirst({
                where: { OR: [{ name: data.interestedProject }, { slug: data.interestedProject }] },
            });
        }

        await prisma.enquiry.create({
            data: {
                fullName: data.fullName,
                mobile: normalizedMobile,
                email: data.email,
                interestedProject: data.interestedProject || project?.name || null,
                projectId: project?.id ?? null,
                preferredContactMethod: data.preferredContactMethod,
                message: data.message,
                source: "Website form",
                status: "New",
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Enquiry creation failed", error);
        return NextResponse.json({ error: "Unable to submit enquiry." }, { status: 500 });
    }
}
