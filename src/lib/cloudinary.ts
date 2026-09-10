import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function uploadToCloudinary(file: File, folder: string) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        const buffer = Buffer.from(await file.arrayBuffer());
        return `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto",
                transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, uploaded) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!uploaded || !uploaded.secure_url) {
                    reject(new Error("Cloudinary upload failed."));
                    return;
                }

                resolve(uploaded as { secure_url: string });
            }
        );

        uploadStream.end(buffer);
    });

    return result.secure_url;
}
