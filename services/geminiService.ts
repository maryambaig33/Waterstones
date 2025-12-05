import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Book } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are "Page," the AI literary concierge for Waterstones NextGen. 
      Your tone is sophisticated, knowledgeable, warm, and slightly British. 
      You help users find books, discuss themes, and offer personalized recommendations.
      If a user asks about a specific book, provide a brief, engaging summary and why they might like it.
      Keep responses concise (under 100 words) unless asked for a deep dive.
      You have access to a simulated catalog of bestsellers but can discuss any book in existence.`,
    },
  });
};

export const generateBookInsights = async (bookTitle: string, author: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a "Literary Insight" for the book "${bookTitle}" by ${author}. 
      Include 3 key themes and a "perfect for readers who love..." sentence. 
      Format as a concise Markdown list.`,
    });
    return response.text || "Insights currently unavailable.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Our literary elves are currently sleeping. Please try again later.";
  }
};

export const getMoodBasedRecommendations = async (mood: string, currentCatalog: Book[]): Promise<string> => {
  try {
    const catalogTitles = currentCatalog.map(b => `${b.title} by ${b.author}`).join(", ");
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user feels: "${mood}".
      Recommend 3 books. 
      Prioritize books from this catalog if they fit: [${catalogTitles}].
      If nothing fits well, recommend other famous books.
      Format the output as a JSON array of objects with properties: "title", "author", "reason".
      DO NOT return markdown formatting, just the raw JSON string.`,
    });
    
    let text = response.text || "[]";
    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return text;
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return "[]";
  }
};
