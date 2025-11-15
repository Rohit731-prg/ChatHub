import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (fileBuffer) => {

    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "image", folder },
                (error, result) => (error ? reject(error) : resolve(result))
            );
            stream.end(fileBuffer);
        });

        return {
            url: result.secure_url,
            image_id: result.public_id
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}