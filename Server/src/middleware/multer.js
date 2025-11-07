import multer from 'multer';

const storage = multer.diskStorage();
export const upload = multer({ storage });

export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded." });

        const { url, image_id } = await uploadImage(req.file.buffer);
        req.imageUrl = url;
        req.imageId = image_id;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}