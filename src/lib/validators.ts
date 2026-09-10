import { z } from "zod";

export const enquirySchema = z.object({
    fullName: z.string().trim().min(2).max(100),
    mobile: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Enter a valid mobile number with 10 to 15 digits."),
    email: z.string().trim().email("Enter a valid email address."),
    interestedProject: z.string().trim().max(200).optional().or(z.literal("")),
    preferredContactMethod: z.enum(["Call", "WhatsApp", "Email"]),
    message: z.string().trim().min(10).max(500),
});

export const projectSchema = z.object({
    name: z.string().trim().min(2).max(150),
    slug: z.string().trim().max(150).optional().or(z.literal("")),
    status: z.string().trim().min(2).max(80),
    type: z.string().trim().min(2).max(80),
    shortDescription: z.string().trim().min(20).max(400),
    fullDescription: z.string().trim().min(40).max(4000),
    location: z.string().trim().min(2).max(120),
    address: z.string().trim().min(5).max(300),
    priceRange: z.string().trim().max(200).optional().or(z.literal("")),
    possession: z.string().trim().max(100).optional().or(z.literal("")),
    developer: z.string().trim().max(200).optional().or(z.literal("")),
    totalUnits: z.coerce.number().int().min(0).max(50000).optional().or(z.literal("")),
    numberOfBuildings: z.coerce.number().int().min(0).max(200).optional().or(z.literal("")),
    numberOfFloors: z.coerce.number().int().min(0).max(200).optional().or(z.literal("")),
    areaConfigurations: z.string().trim().max(500).optional().or(z.literal("")),
    seoTitle: z.string().trim().max(160).optional().or(z.literal("")),
    seoDescription: z.string().trim().max(320).optional().or(z.literal("")),
    displayOrder: z.coerce.number().int().min(0).max(9999).optional().or(z.literal("")),
    featured: z.string().optional(),
    published: z.string().optional(),
});

export function parseCsv(value: FormDataEntryValue | null | undefined) {
    if (!value) return [];
    return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}
