import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

export const genAI = async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required." });

    try {
        const result = await main(prompt);
        return res.status(200).json({ message: "AI generated successfully.", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

async function main(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text;
}