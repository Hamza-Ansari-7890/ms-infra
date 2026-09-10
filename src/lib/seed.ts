import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.adminUser.upsert({
        where: { email },
        update: { passwordHash, name: "MS Infra Admin" },
        create: { email, name: "MS Infra Admin", passwordHash },
    });

    const projects = [
        {
            name: "MS Residency",
            slug: "ms-residency",
            status: "Launching",
            type: "Residential",
            shortDescription: "Thoughtfully designed 2 and 3 BHK residences crafted for modern urban lifestyles.",
            fullDescription: "MS Residency brings together comfort, luxury, and convenience in a carefully planned residential community. Featuring elevated design standards, sustainable materials, premium amenities, and prime connectivity, the project is built for families seeking a refined way of living in Bhiwandi.",
            location: "Bhiwandi",
            address: "Near Jain Mandir, Bhiwandi",
            priceRange: "₹39L - ₹68L",
            possession: "Immediate",
            developer: "MS Infra",
            totalUnits: 180,
            numberOfBuildings: 2,
            numberOfFloors: 16,
            areaConfigurations: "2 BHK | 3 BHK",
            featured: true,
            seoTitle: "MS Residency | Premium Apartments in Bhiwandi",
            seoDescription: "Explore MS Residency by MS Infra, a premium residential project in Bhiwandi with modern apartments, amenities, and a strategic location.",
            displayOrder: 1,
            published: true,
            mainImage: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
            amenities: ["Clubhouse", "Landscape Garden", "Power Backup", "Security", "Children's Play Area"],
            highlights: ["RERA-compliant development", "Smart home ready apartments", "High ROI potential"],
            nearbyLandmarks: ["Jain Mandir - 2 mins", "Bhiwandi Station - 6 mins", "Schools, markets and hospitals nearby"],
            locationBenefits: ["Easy connectivity", "Commercial hub access", "Family-friendly surroundings"],
        },
        {
            name: "Aman Heights",
            slug: "aman-heights",
            status: "Under Construction",
            type: "Residential",
            shortDescription: "A premium living destination designed to create a balanced and contemporary lifestyle.",
            fullDescription: "Aman Heights is crafted for discerning buyers seeking elegant spaces, thoughtful amenities, and a vibrant community atmosphere. The project combines architectural elegance with practical conveniences and gives city access without compromising on peace and comfort.",
            location: "Bhiwandi East",
            address: "Aman Road, Bhiwandi East",
            priceRange: "₹44L - ₹75L",
            possession: "Q3 2027",
            developer: "MS Infra",
            totalUnits: 240,
            numberOfBuildings: 3,
            numberOfFloors: 18,
            areaConfigurations: "2 BHK | 3 BHK | Duplex",
            featured: true,
            seoTitle: "Aman Heights by MS Infra | Bhiwandi East Residences",
            seoDescription: "Explore Aman Heights, a lifestyle-rich residential project by MS Infra in Bhiwandi East with premium amenities and elegant apartment living.",
            displayOrder: 2,
            published: true,
            mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
            amenities: ["Gymnasium", "Jogging Track", "Rainwater Harvesting", "Visitor Parking", "24/7 Security"],
            highlights: ["Large balconies", "Pet-friendly spaces", "CCTV monitored entry"],
            nearbyLandmarks: ["Bhiwandi East market - 4 mins", "School zone - 5 mins", "Hospital access - 6 mins"],
            locationBenefits: ["Excellent transport links", "Close to essential services", "Strong residential demand"],
        }
    ];

    for (const projectData of projects) {
        const existing = await prisma.project.findUnique({ where: { slug: projectData.slug } });
        if (existing) continue;

        await prisma.project.create({
            data: {
                ...projectData,
                amenities: {
                    create: projectData.amenities.map((name) => ({ name })),
                },
                highlights: {
                    create: projectData.highlights.map((text) => ({ text })),
                },
                locationBenefits: {
                    create: projectData.locationBenefits.map((title) => ({ title })),
                },
                nearbyLandmarks: {
                    create: projectData.nearbyLandmarks.map((name) => ({ name, distance: name.split(" - ")[1] ?? "Nearby" })),
                },
            },
        });
    }

    const enquiryCount = await prisma.enquiry.count();
    if (enquiryCount === 0) {
        await prisma.enquiry.create({
            data: {
                fullName: "Aisha Khan",
                mobile: "9876543210",
                email: "aisha@example.com",
                interestedProject: "MS Residency",
                preferredContactMethod: "Call",
                message: "Please share the latest configuration and pricing details for 2 BHK apartments.",
                status: "New",
            },
        });
    }
}

main()
    .then(() => console.log("Seed complete."))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
