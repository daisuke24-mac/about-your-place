import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getDescription(prompt) {
    const genAI = new GoogleGenerativeAI(process.env.YOUR_GEMINI_API_KEY || '');

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContentStream(prompt);
    const response = await result.response
    return response.text()
}