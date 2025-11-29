import cloudinary from "../config/cloudinary"

export const uploadImageForMessage = async (file) => {
    try {
        const result = await cloudinary.uploader.upload_stream(file, {
            resource_type: 'image',
            folder: 'chathub',
        });

        return result
    } catch (error) {
        return error
    }
}