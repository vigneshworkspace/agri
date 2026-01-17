
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { YieldPredictionParams, UserProfile, MarketAnalysisResult } from '../types';
import * as ApiService from './apiService';

// Access the API key from environment variables (works in both local and Vercel)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (window as any).APP_CONFIG?.API_KEY;

// A more robust check for a valid key. It must exist, not be the placeholder, and have a valid Gemini API key format
const hasValidApiKey = API_KEY && API_KEY !== 'YOUR_GEMINI_API_KEY' && API_KEY.startsWith('AIza') && API_KEY.length === 39;

// Conditionally initialize the AI client only if the key is valid
const ai = hasValidApiKey ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Check if we should use the local backend API instead of Gemini directly
const USE_LOCAL_BACKEND = true; // Set to true to use predict.py backend

if (!hasValidApiKey && !USE_LOCAL_BACKEND) {
    console.warn("Valid Gemini API key not found in config.js. The app will use mock data. To get a real API key, visit https://aistudio.google.com/app/apikey");
}

if (USE_LOCAL_BACKEND) {
    console.log("🌾 Using local backend API at http://localhost:8000");
}

// --- MOCK DATA for development without API key ---
const useMockData = !hasValidApiKey && !USE_LOCAL_BACKEND;

const mockChatResponse = "As an AI assistant, I can help with crop management, disease diagnosis, and yield optimization. How can I assist you today?";
const mockDiseaseAnalysis = {
    disease: "Tomato Late Blight",
    confidence: 95.2,
    description: "Late blight is a destructive disease of tomatoes and potatoes caused by the oomycete Phytophthora infestans.",
    treatment: ["Apply fungicides containing mancozeb or chlorothalonil.", "Remove and destroy infected plants immediately.", "Ensure proper spacing for air circulation."],
    prevention: ["Plant resistant cultivars.", "Avoid overhead watering.", "Rotate crops regularly."]
};
const mockYieldPrediction = {
    predictedYield: 7.5,
    regionalAverage: 6.8,
    insights: ["Your soil type is highly compatible with the selected crop.", "The current rainfall is slightly below optimal; consider supplemental irrigation.", "Temperature is within the ideal range for this growth stage."]
};
const mockMarketAnalysis: MarketAnalysisResult = {
    analysisText: `**Trend:** Stable with slight upward potential.\n\n**Forecast:** Prices are expected to rise by 2-4% in the next quarter due to increased export demand.\n\n**Key Factors:**\n- Favorable weather conditions in competing regions.\n- Recent government trade agreements.\n\n**Recommendation:** Hold. Consider selling in 2-3 weeks for potentially higher returns.`,
    sources: [
        { title: "Global Crop Market Report - AgriNews", uri: "#" },
        { title: "Trade Agreement Impact on Corn Prices - Finance Daily", uri: "#" },
    ]
};


// --- CHAT SERVICE ---
let chat: Chat | null = null;
let currentLanguage: string = 'en';

export const startChat = (profile?: UserProfile, language: string = 'en'): Chat => {
    // Reset chat if language changed
    if (chat && currentLanguage !== language) {
        chat = null;
    }
    
    if (chat) {
        return chat;
    }
    
    currentLanguage = language;
    
    if (!ai) {
        throw new Error("Cannot start chat session without a valid API key.");
    }

    // Language name mapping for better context
    const languageNames: Record<string, string> = {
        'en': 'English',
        'hi': 'Hindi (हिंदी)',
        'bn': 'Bengali (বাংলা)',
        'ta': 'Tamil (தமிழ்)',
        'te': 'Telugu (తెలుగు)', 
        'mr': 'Marathi (मराठी)',
        'gu': 'Gujarati (ગુજરાતી)',
        'kn': 'Kannada (ಕನ್ನಡ)',
        'ml': 'Malayalam (മലയാളം)',
        'pa': 'Punjabi (ਪੰਜਾਬੀ)'
    };

    const selectedLanguage = languageNames[language] || 'English';

    let systemInstruction = `You are AgriAssist Pro, a friendly and knowledgeable AI assistant for farmers. Provide concise, actionable advice on agriculture, covering topics like crop diseases, soil management, irrigation, and yield prediction. Always be supportive and clear.

IMPORTANT: The user has selected ${selectedLanguage} as their preferred language. Please respond in ${selectedLanguage}. If the user writes in English but has selected another language, respond in the selected language (${selectedLanguage}).`;

    if (profile) {
        const profileParts = [
            profile.acres ? `- Farm size: ${profile.acres} acres` : null,
            profile.location ? `- Location: ${profile.location}` : null,
            profile.soilType ? `- Primary soil type: ${profile.soilType.charAt(0).toUpperCase() + profile.soilType.slice(1)}` : null,
            profile.currentCrops ? `- Currently planted crops: ${profile.currentCrops}` : null,
        ].filter(p => p !== null);

        if (profileParts.length > 0) {
            const profileContext = [
                "Here is some context about the farmer you are assisting:",
                ...profileParts
            ].join("\n");
            systemInstruction += `\n\n${profileContext}\n\nTailor your advice to this specific context whenever possible.`;
        }
    }

    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
};

export async function* streamChatResponse(message: string, profile?: UserProfile, language: string = 'en') {
    // Use local backend for chat
    if (USE_LOCAL_BACKEND) {
        try {
            const userId = profile?.id || 'anonymous';
            for await (const chunk of ApiService.streamChatResponse(message, userId, language)) {
                yield chunk;
            }
            return;
        } catch (error) {
            console.error('Backend chat error:', error);
            yield `Sorry, I couldn't connect to the backend server. Please make sure it's running at http://localhost:8000. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
            return;
        }
    }
    
    if (useMockData) {
        for (const word of mockChatResponse.split(" ")) {
            await new Promise(res => setTimeout(res, 50));
            yield word + " ";
        }
        return;
    }

    const chatInstance = startChat(profile, language);
    const result = await chatInstance.sendMessageStream({ message });

    for await (const chunk of result) {
        yield chunk.text;
    }
}

export const resetChat = () => {
    chat = null;
    currentLanguage = 'en';
};

// --- DISEASE DETECTION SERVICE ---
// This now uses the local FastAPI backend with real ML model
export const analyzeCropDisease = async (base64Image: string, mimeType: string): Promise<any> => {
    // Always use local backend for disease detection (real ML model)
    if (USE_LOCAL_BACKEND) {
        try {
            const result = await ApiService.analyzeCropDiseaseBase64(base64Image, mimeType);
            // Transform backend response to match expected frontend format
            return {
                disease: result.predicted_class,
                confidence: result.confidence,
                description: `Detected ${result.predicted_class} with ${result.confidence}% confidence. Severity: ${result.severity}`,
                treatment: [result.treatment],
                prevention: result.recommendations,
            };
        } catch (error) {
            console.error('Backend API error:', error);
            // Fall back to mock data if backend fails
            await new Promise(res => setTimeout(res, 500));
            return {
                ...mockDiseaseAnalysis,
                disease: "API Error - Please ensure backend is running",
                description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure the backend server is running at http://localhost:8000`,
            };
        }
    }
    
    if (useMockData || !ai) {
        await new Promise(res => setTimeout(res, 2000));
        return mockDiseaseAnalysis;
    }
    
    const imagePart = { inlineData: { data: base64Image, mimeType } };
    const textPart = { text: `Analyze this image of a plant. Identify any diseases, provide a confidence score, a brief description, and suggest detailed treatment and prevention methods. Respond in JSON format.` };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    disease: { type: Type.STRING },
                    confidence: { type: Type.NUMBER },
                    description: { type: Type.STRING },
                    treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
                    prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            }
        }
    });
    
    return JSON.parse(response.text);
};


// --- YIELD PREDICTION SERVICE ---
export const predictYield = async (params: YieldPredictionParams): Promise<any> => {
    if (useMockData || !ai) {
        await new Promise(res => setTimeout(res, 1500));
        return mockYieldPrediction;
    }

    const prompt = `
        Predict the crop yield for a farm based on the following factors. Assume typical weather conditions for the given location.
        - Crop: ${params.crop}
        - Location: ${params.location}
        - Farm Size (in acres): ${params.acres}
        - Soil Type: ${params.soilType}

        Provide the predicted yield in tons per hectare, the regional average for this crop, and 2-3 key insights or recommendations based on this data.
        Respond in JSON format.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    predictedYield: { type: Type.NUMBER, description: "Predicted yield in tons per hectare." },
                    regionalAverage: { type: Type.NUMBER, description: "Regional average yield for this crop in tons per hectare." },
                    insights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable insights for the farmer." },
                }
            }
        }
    });

    return JSON.parse(response.text);
};

// --- SMART WATERING SERVICE ---
export const getWateringAdvice = async (crop: string, moisture: number, threshold: number): Promise<string> => {
    if (useMockData || !ai) {
        await new Promise(res => setTimeout(res, 1000));
        return moisture < threshold
            ? `Soil moisture is below your threshold. It's recommended to irrigate your ${crop} field soon. The current weather is clear, making it a good time to water.`
            : `Soil moisture is currently adequate for your ${crop}. No immediate watering is needed. Continue monitoring levels.`;
    }

    const prompt = `
        A farmer is growing ${crop}.
        The current soil moisture is ${moisture}%.
        The set threshold for watering is ${threshold}%.
        Provide a concise watering recommendation (2-3 sentences).
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
};

// --- MARKET ADVISOR SERVICE ---
export const getMarketAnalysis = async (crop: string, location: string): Promise<MarketAnalysisResult> => {
    if (useMockData || !ai) {
        await new Promise(res => setTimeout(res, 2500));
        return mockMarketAnalysis;
    }

    const prompt = `
        Provide a concise market analysis for ${crop} focused on the ${location} region, using the most current data available.
        Your analysis must include the following sections with clear markdown headings:
        - **Trend:** (e.g., Rising, Falling, Stable)
        - **Forecast:** A short-term price forecast (e.g., for the next 2-4 weeks).
        - **Key Factors:** 2-3 bullet points on what is influencing the price.
        - **Recommendation:** A clear, actionable recommendation for a farmer (e.g., Sell Now, Hold, Watch Closely).

        Keep the language clear and direct for a farmer.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        title: chunk.web.title || "Untitled Source",
        uri: chunk.web.uri,
    })).filter(source => source.uri) || [];
    
    return {
        analysisText: response.text,
        sources: sources,
    };
};