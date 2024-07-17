import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     const { prompt_post } = await req.json();
//     const genAI = new GoogleGenerativeAI(process.env.YOUR_GEMINI_API_KEY || '');

//     const model = genAI.getGenerativeModel({ model: "gemini-pro"});
//     const result = await model.generateContentStream(prompt_post);
//     const response = await result.response
//     console.log(prompt_post)
//     return NextResponse.json({
//         message: response.text()
//     })
// }

export async function getDescription(prompt) {
    const genAI = new GoogleGenerativeAI(process.env.YOUR_GEMINI_API_KEY || '');

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContentStream(prompt);
    const response = await result.response
    // console.log(prompt)
    return response.text()
}