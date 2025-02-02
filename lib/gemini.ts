import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export interface UserBirthInfo {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
}

export async function getAstrologicalResponse(userInfo: UserBirthInfo, question: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a AI astrologer. Using vedic astrology, provide a brief and insightful answer to the user's question. Focus on the specific question asked, without listing planetary positions or general information. Keep your response in easy-to-read way.

Birth Details:
- Name: ${userInfo.name}
- Date of Birth: ${userInfo.birthDate}
- Time of Birth: ${userInfo.birthTime}
- Place of Birth: ${userInfo.birthPlace} (Latitude: ${userInfo.latitude}, Longitude: ${userInfo.longitude})

Question: ${question}

Remember:
- Be specific to the question
- No lengthy explanations about houses or planetary positions
- Use simple language
- Bold important points using **text**
- Break long responses into short paragraphs
- Focus on answering the specific question
- Avoid technical astrological terms unless necessary`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting astrological response:", error);
    throw new Error("Failed to get astrological insights. Please try again later.");
  }
}
