import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { AmenitiesSelector } from "@/components/AmenitiesSelector";

const amenityOptions = [
    "Clubhouse",
    "Gym",
    "Swimming Pool",
    "Children's Play Area",
    "Jogging Track",
    "Landscaped Garden",
    "Power Backup",
    "24x7 Security",
    "Covered Parking",
    "Lift",
    "CCTV",
    "Sports Court",
    "Community Hall",
    "Party Lawn",
    "Mini Market",
    "Yoga Deck",
    "Water Supply",
    "EV Charging",
    "Walking Track",
    "Smart Access",
];

function normalizeSlug(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "project";
}

function isValidImageSource(value: string | null | undefined): value is string {
    return Boolean(value && (/^https?:\/\//i.test(value) || value.startsWith("/") || value.startsWith("data:image/")));
}

function parseList(value: string) {
    return Array.from(
        new Set(
            value
                .split(/\r?\n|,/) // allow comma or new line
                .map((item) => item.replace(/[•*\-]/g, "").trim())
                .filter(Boolean)
        )
    );
}

async function saveUploadedFile(file: File, folder: "gallery" | "floor-plan") {
    return uploadToCloudinary(file, `ms-infra/${folder}`);
}

function parseLandmarks(value: string) {
    return parseList(value).map((line) => {
        const [name, distance] = line.split("|").map((part) => part.trim());
        return { name: name || "Nearby landmark", distance: distance || "Nearby" };
    });
}

async function saveProject(formData: FormData) {
    "use server";
    await requireAdminSession();

    const projectId = String(formData.get("projectId") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const slug = normalizeSlug(String(formData.get("slug") ?? "") || name);

    const priceFrom = String(formData.get("priceFrom") ?? "").trim();
    const priceTo = String(formData.get("priceTo") ?? "").trim();
    const priceUnit = String(formData.get("priceUnit") ?? "L").trim();
    const priceRange = [priceFrom, priceTo].filter(Boolean).length
        ? `₹ ${[priceFrom, priceTo].filter(Boolean).join(" - ")}${priceUnit}`
        : String(formData.get("priceRange") ?? "") || null;

    const area = String(formData.get("area") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const state = String(formData.get("state") ?? "").trim();
    const shortDescription = String(formData.get("cardDescription") ?? "").trim();
    const fullDescription = String(formData.get("propertyOverview") ?? "").trim();
    const cardDescription = String(formData.get("cardDescription") ?? "").trim();
    const propertyOverview = String(formData.get("propertyOverview") ?? "").trim();
    const amenities = formData.getAll("amenities").map((value) => String(value).trim()).filter(Boolean);
    const locationBenefits = parseList(String(formData.get("locationBenefits") ?? ""));
    const nearbyLandmarks = parseLandmarks(String(formData.get("nearbyLandmarks") ?? ""));

    const galleryFiles = (formData.getAll("galleryImages") as File[])
        .filter((file) => file instanceof File && file.size > 0)
        .map((file) => ({ file, altText: file.name.replace(/\.[^.]+$/, "") }));
    const galleryUrls = await Promise.all(galleryFiles.map(async ({ file, altText }) => ({
        url: await saveUploadedFile(file, "gallery"),
        altText,
        kind: "gallery",
    })));

    const floorPlanFiles = (formData.getAll("floorPlanImages") as File[])
        .filter((file) => file instanceof File && file.size > 0)
        .map((file) => ({ file, altText: file.name.replace(/\.[^.]+$/, "") }));
    const floorPlanImages = await Promise.all(floorPlanFiles.map(async ({ file, altText }) => ({
        url: await saveUploadedFile(file, "floor-plan"),
        altText,
        kind: "floor-plan",
    })));

    const existingGalleryImages = projectId
        ? await prisma.projectImage.findMany({ where: { projectId, kind: "gallery" }, orderBy: { createdAt: "asc" } })
        : [];
    const existingFloorPlans = projectId
        ? await prisma.projectFloorPlan.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } })
        : [];
    const existingMainImage = projectId
        ? (await prisma.project.findUnique({ where: { id: projectId }, select: { mainImage: true } }))?.mainImage
        : null;
    const mainImage = galleryUrls[0]?.url || existingMainImage || existingGalleryImages[0]?.url || null;
    const location = city ? `${city}${state ? `, ${state}` : ""}` : "Bhiwandi";

    const data = {
        name,
        slug,
        status: String(formData.get("status") ?? "New Launch"),
        type: "Residential",
        area: area || null,
        city: city || null,
        state: state || null,
        shortDescription,
        fullDescription,
        cardDescription,
        propertyOverview,
        location,
        address: location,
        priceFrom: priceFrom || null,
        priceTo: priceTo || null,
        priceUnit: priceUnit || null,
        priceRange,
        possession: null,
        developer: null,
        totalUnits: null,
        numberOfBuildings: null,
        numberOfFloors: null,
        areaConfigurations: null,
        seoTitle: null,
        seoDescription: null,
        displayOrder: 0,
        featured: false,
        published: true,
        mainImage,
        brochureUrl: null,
    };

    const floorPlanProjectData = floorPlanImages.length
        ? floorPlanImages.map((image, index) => ({
            title: image.altText || `Floor plan ${index + 1}`,
            area: null,
            bedrooms: null,
            imageUrl: image.url,
            price: null,
        }))
        : existingFloorPlans.map((plan) => ({
            title: plan.title,
            area: plan.area,
            bedrooms: plan.bedrooms,
            imageUrl: plan.imageUrl,
            price: plan.price,
        }));

    const galleryImagesToSave = galleryUrls.length
        ? galleryUrls
        : existingGalleryImages.map((image) => ({ url: image.url, altText: image.altText ?? name, kind: image.kind }));

    if (!name || !city) {
        redirect("/admin/projects");
    }

    if (projectId) {
        await prisma.project.update({
            where: { id: projectId },
            data: {
                ...data,
                amenities: { deleteMany: {}, create: amenities.map((name) => ({ name })) },
                highlights: { deleteMany: {}, create: parseList(String(formData.get("highlights") ?? "")).map((text) => ({ text })) },
                locationBenefits: { deleteMany: {}, create: locationBenefits.map((title) => ({ title })) },
                nearbyLandmarks: { deleteMany: {}, create: nearbyLandmarks.map((item) => ({ name: item.name, distance: item.distance })) },
                floorPlans: { deleteMany: {}, create: floorPlanProjectData },
                images: {
                    deleteMany: {},
                    create: galleryImagesToSave.map((image) => ({
                        url: image.url,
                        altText: image.altText || name,
                        kind: image.kind,
                        isCover: image.url === mainImage,
                    })),
                },
            },
        });
    } else {
        await prisma.project.create({
            data: {
                ...data,
                amenities: { create: amenities.map((name) => ({ name })) },
                highlights: { create: parseList(String(formData.get("highlights") ?? "")).map((text) => ({ text })) },
                locationBenefits: { create: locationBenefits.map((title) => ({ title })) },
                nearbyLandmarks: { create: nearbyLandmarks.map((item) => ({ name: item.name, distance: item.distance })) },
                floorPlans: { create: floorPlanProjectData },
                images: {
                    create: galleryImagesToSave.map((image) => ({
                        url: image.url,
                        altText: image.altText || name,
                        kind: image.kind,
                        isCover: image.url === mainImage,
                    }))
                },
            },
        });
    }

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    redirect("/admin/projects");
}

async function deleteProject(formData: FormData) {
    "use server";
    await requireAdminSession();
    const projectId = String(formData.get("projectId") ?? "").trim();

    if (projectId) {
        await prisma.project.delete({ where: { id: projectId } });
    }

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    redirect("/admin/projects");
}

export default async function AdminProjectsPage({
    searchParams,
}: {
    searchParams?: Promise<{ edit?: string }>;
}) {
    await requireAdminSession();

    const params = searchParams ? await searchParams : {};
    const editingProject = params.edit
        ? await prisma.project.findUnique({
            where: { id: params.edit },
            include: {
                amenities: true,
                highlights: true,
                locationBenefits: true,
                nearbyLandmarks: true,
                floorPlans: true,
                images: true,
            },
        })
        : null;

    const projects = await prisma.project.findMany({
        orderBy: [{ featured: "desc" }, { displayOrder: "asc" }],
    });

    return (
        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <div>
                    <p style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "#7a6a4a" }}>Admin panel</p>
                    <h1 style={{ marginTop: 8, fontSize: "clamp(2rem, 4vw, 3rem)" }}>Manage projects</h1>
                </div>
                <Link href="/admin" style={{ background: "#111", color: "#fff", padding: "0.8rem 1.3rem", borderRadius: 999, fontWeight: 700 }}>Back to dashboard</Link>
            </div>

            <form action={saveProject} style={{ display: "grid", gap: "1rem", background: "#fff", borderRadius: 26, padding: "1.4rem", boxShadow: "0 24px 60px rgba(14,14,14,0.06)" }}>
                <input type="hidden" name="projectId" value={editingProject?.id ?? ""} />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                    <input name="name" defaultValue={editingProject?.name ?? ""} placeholder="Project name" required style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />
                    <select name="status" defaultValue={editingProject?.status ?? "New Launch"} style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }}>
                        <option value="New Launch">New Launch</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Ready to Move">Ready to Move</option>
                    </select>
                    <input name="area" defaultValue={editingProject?.area ?? ""} placeholder="Area" style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />
                    <input name="city" defaultValue={editingProject?.city ?? ""} placeholder="City" style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />
                    <input name="state" defaultValue={editingProject?.state ?? ""} placeholder="State" style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                    <input name="priceFrom" defaultValue={editingProject?.priceFrom ?? ""} type="number" step="0.01" placeholder="From" style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />
                    <input name="priceTo" defaultValue={editingProject?.priceTo ?? ""} type="number" step="0.01" placeholder="To" style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />
                    <select name="priceUnit" defaultValue={editingProject?.priceUnit ?? "L"} style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }}>
                        <option value="L">L</option>
                        <option value="CR">CR</option>
                        <option value="K">K</option>
                    </select>
                </div>

                <textarea name="cardDescription" defaultValue={editingProject?.cardDescription ?? editingProject?.shortDescription ?? ""} placeholder="Card description" rows={3} style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />
                <textarea name="propertyOverview" defaultValue={editingProject?.propertyOverview ?? editingProject?.fullDescription ?? ""} placeholder="Property overview" rows={5} style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    <label style={{ display: "grid", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700 }}>Amenities</span>
                        <AmenitiesSelector options={amenityOptions} selected={editingProject?.amenities.map((item) => item.name) ?? []} />
                    </label>

                    <label style={{ display: "grid", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700 }}>Location benefits</span>
                        <textarea name="locationBenefits" defaultValue={editingProject ? editingProject.locationBenefits.map((item) => item.title).join("\n") : ""} rows={10} placeholder="Add one benefit per line" style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />
                    </label>

                    <label style={{ display: "grid", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700 }}>Nearby landmarks</span>
                        <textarea name="nearbyLandmarks" defaultValue={editingProject ? editingProject.nearbyLandmarks.map((item) => `${item.name} | ${item.distance}`).join("\n") : ""} rows={10} placeholder="Name | Distance" style={{ padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd" }} />
                    </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <label style={{ display: "grid", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700 }}>Floor plans</span>
                        <input type="file" name="floorPlanImages" accept="image/*" multiple style={{ padding: "0.7rem", border: "1px solid #ddd", borderRadius: 12 }} />
                        <span style={{ color: "#666", fontSize: 13 }}>Select as many floor-plan images as required. Each image is displayed separately.</span>
                        {editingProject?.floorPlans.length ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.6rem" }}>
                                {editingProject.floorPlans.map((plan) => isValidImageSource(plan.imageUrl) ? (
                                    <div key={plan.id} style={{ position: "relative", height: 82, borderRadius: 10, overflow: "hidden", border: "1px solid #e6e0d8" }}>
                                        <Image src={plan.imageUrl} alt={plan.title} fill sizes="100px" style={{ objectFit: "cover" }} />
                                    </div>
                                ) : null)}
                            </div>
                        ) : null}
                    </label>

                    <label style={{ display: "grid", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700 }}>Gallery image</span>
                        <input type="file" name="galleryImages" accept="image/*" multiple style={{ padding: "0.7rem", border: "1px solid #ddd", borderRadius: 12 }} />
                        {editingProject?.images.length ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.6rem" }}>
                                {editingProject.images.filter((image) => image.kind === "gallery").map((image) => isValidImageSource(image.url) ? (
                                    <div key={image.id} style={{ position: "relative", height: 82, borderRadius: 10, overflow: "hidden", border: "1px solid #e6e0d8" }}>
                                        <Image src={image.url} alt={image.altText ?? editingProject.name} fill sizes="100px" style={{ objectFit: "cover" }} />
                                    </div>
                                ) : null)}
                            </div>
                        ) : null}
                    </label>
                </div>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    {editingProject ? <Link href="/admin/projects" style={{ color: "#111", fontWeight: 700 }}>Cancel edit</Link> : null}
                </div>

                <button type="submit" style={{ background: "#111", color: "#fff", padding: "0.95rem 1.5rem", borderRadius: 999, fontWeight: 800, maxWidth: 220 }}>
                    {editingProject ? "Update project" : "Add project"}
                </button>
            </form>

            <div style={{ marginTop: "2.5rem", display: "grid", gap: "1rem" }}>
                {projects.map((project) => (
                    <div key={project.id} style={{ background: "#fff", borderRadius: 20, padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", boxShadow: "0 14px 30px rgba(15,15,15,0.04)" }}>
                        <div>
                            <strong style={{ fontSize: 18 }}>{project.name}</strong>
                            <p style={{ marginTop: 6, color: "#555" }}>{project.location} · {project.status}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.7rem", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ padding: "0.35rem 0.7rem", borderRadius: 999, background: "#f3ead7", color: "#7a6a4a", fontSize: 12, fontWeight: 700 }}>{project.published ? "Published" : "Draft"}</span>
                            <Link href={`/admin/projects?edit=${project.id}`} style={{ background: "#111", color: "#fff", padding: "0.55rem 0.9rem", borderRadius: 999 }}>Edit</Link>
                            <form action={deleteProject} style={{ display: "inline" }}>
                                <input type="hidden" name="projectId" value={project.id} />
                                <button type="submit" style={{ background: "#d9485f", color: "#fff", padding: "0.55rem 0.9rem", borderRadius: 999, border: "none", cursor: "pointer" }}>Delete</button>
                            </form>
                            <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" style={{ background: "#f3e7cb", padding: "0.55rem 0.9rem", borderRadius: 999, color: "#111", fontWeight: 700 }}>View</a>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
