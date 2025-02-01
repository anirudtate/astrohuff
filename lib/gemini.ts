import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("gemini api key", process.env.NEXT_PUBLIC_GEMINI_API_KEY);
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

    const prompt = `As an AI astrologer, provide insights based on the following birth information and question:

Birth Details:
- Name: ${userInfo.name}
- Date of Birth: ${userInfo.birthDate}
- Time of Birth: ${userInfo.birthTime}
- Place of Birth: ${userInfo.birthPlace} (Latitude: ${userInfo.latitude}, Longitude: ${userInfo.longitude})

Question: ${question}

Please provide a thoughtful astrological analysis based on vedic astrology principles. Keep the response concise but insightful.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting astrological response:", error);
    throw new Error("Failed to get astrological insights. Please try again later.");
  }
}
