import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSocialSignals = async (
  userGender: string,
  targetGender: string,
  personB: string,
  vibes: string[]
): Promise<AnalysisResult> => {
  const modelText = "gemini-2.5-flash";
  const modelImage = "gemini-2.5-flash-image"; 
  const vibesString = vibes.length > 0 ? vibes.join(", ") : "general lifestyle";

  // 1. TEXT ANALYSIS - HINDI PROMPT
  const promptText = `
    Context: A user (Gender: ${userGender}) wants to know what user "${personB}" (Gender: ${targetGender}) thinks of them.
    Target ("${personB}") has these vibes: ${vibesString}.
    
    Task:
    1.  **Tone**: One catchy word in **HINDI** for Person B's vibe (e.g. "Bindass", "Khatarnak", "Masoom", "Chalu", "Ameer").
    2.  **Possible Thoughts**: Generate 3 VERY SIMPLE thoughts Person B (${targetGender}) has about the User (${userGender}) in **SIMPLE HINDI**. 
        *   **Style**: Casual, Desi, blunt, maybe a bit dramatic. Like friends talking.
        *   **Examples**: 
            - "Ye ladka bohot acha hai, sapne pure karega."
            - "Isme bohot attitude hai, sudharna padega."
            - "Ye toh timepass kar raha hai."
    3.  **Relationship Forecast**: One short, spicy prediction about their future in **HINDI**.
        *   **MUST** include a relevant emoji at the end.
        *   **Examples**: "Pakka Lover Banega 😘", "Sirf Dost Rahenge 👯‍♀️", "Ye Ghost karega 👻", "Shadi Material 💍", "Bachke Rehna 🚩".
    4.  **Confidence Score**: 0-100.
    5.  **Detailed Analysis**: A simple "Final Verdict" in **HINDI**. 1-2 sentences. Direct and spicy.
    6.  **Image Description**: Create a short prompt for an image generator (Keep this prompt in English for the model). Describe a "3D animated movie style" scene featuring two characters:
        *   Character A (representing the User, Gender: ${userGender}) and Character B (representing ${personB}, Gender: ${targetGender}).
        *   Describe their expressions and the setting based on the "Vibe" and "Tone". 
        *   Make it colorful and fun.

    SAFETY: If the handle name implies hate figures or explicit content, set safetyFlag to true.
  `;

  let textResult: any = {};

  try {
    const response = await ai.models.generateContent({
      model: modelText,
      contents: promptText,
      config: {
        systemInstruction: "You are a playful vibe reader. You give simple, funny, and direct answers in SIMPLE HINDI (Devanagari). Speak like a blunt Indian friend.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tone: { type: Type.STRING, description: "One word adjective in Hindi." },
            toneEmoji: { type: Type.STRING, description: "Single emoji." },
            confidenceScore: { type: Type.INTEGER, description: "0 to 100" },
            possibleThoughts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 simple, direct opinions in Hindi."
            },
            relationshipForecast: { type: Type.STRING, description: "Future prediction in Hindi with emoji." },
            detailedAnalysis: { type: Type.STRING, description: "Short, punchy verdict in Hindi." },
            imagePrompt: { type: Type.STRING, description: "Prompt for the image generator (English)." },
            safetyFlag: { type: Type.BOOLEAN, description: "True if unsafe." }
          },
          required: ["tone", "toneEmoji", "confidenceScore", "possibleThoughts", "relationshipForecast", "safetyFlag", "imagePrompt"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    textResult = JSON.parse(jsonText);

  } catch (error) {
    console.error("Gemini Text Analysis Failed", error);
    return {
      tone: "Error",
      toneEmoji: "⚠️",
      confidenceScore: 0,
      possibleThoughts: ["Koshish jari hai..."],
      relationshipForecast: "Pata Nahi ❓",
      safetyFlag: false,
      detailedAnalysis: "Kuch gadbad ho gayi."
    };
  }

  if (textResult.safetyFlag) {
    return {
      tone: "Unsafe",
      toneEmoji: "🚫",
      confidenceScore: 0,
      possibleThoughts: [],
      relationshipForecast: "Blocked 🚫",
      safetyFlag: true,
      detailedAnalysis: "Content flagged."
    };
  }

  // 2. IMAGE GENERATION
  let imageUrl = undefined;
  try {
    const imageResponse = await ai.models.generateContent({
      model: modelImage,
      contents: {
        parts: [{ text: textResult.imagePrompt || `A fun 3D animated style illustration of a ${userGender} and a ${targetGender} hanging out, ${vibesString} style.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  } catch (error) {
    console.error("Gemini Image Generation Failed", error);
    // Continue without image if it fails
  }

  return {
    tone: textResult.tone,
    toneEmoji: textResult.toneEmoji,
    confidenceScore: textResult.confidenceScore,
    possibleThoughts: textResult.possibleThoughts,
    relationshipForecast: textResult.relationshipForecast,
    safetyFlag: false,
    detailedAnalysis: textResult.detailedAnalysis,
    imageUrl: imageUrl
  };
};
