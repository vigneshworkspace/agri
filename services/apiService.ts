/**
 * API Service - Connects React frontend to the FastAPI backend
 * Backend runs at http://localhost:8000
 */

// Backend API base URL - change this in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types for API responses
export interface DiseaseAnalysisResult {
    disease: string;
    confidence: number;
    treatment: string;
    severity: string;
    top_predictions: Array<{ class: string; confidence: number }>;
    recommendations: string[];
}

export interface ChatResponse {
    response: string;
    suggestions: string[];
    timestamp: string;
}

export interface HealthCheckResponse {
    status: string;
    model_loaded: boolean;
    gemini_available: boolean;
    timestamp: string;
}

/**
 * Check if the backend API is available
 */
export const checkHealth = async (): Promise<HealthCheckResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
        throw new Error('Backend API is not available');
    }
    return response.json();
};

/**
 * Analyze crop disease from an image file
 * @param imageFile - The image file to analyze
 * @param cropType - Optional crop type hint
 */
export const analyzeCropDisease = async (
    imageFile: File,
    cropType?: string
): Promise<DiseaseAnalysisResult> => {
    const formData = new FormData();
    formData.append('file', imageFile);
    if (cropType) {
        formData.append('crop_type', cropType);
    }

    const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || 'Disease analysis failed');
    }

    return response.json();
};

/**
 * Analyze crop disease from base64 image data
 * @param base64Image - Base64 encoded image data (without data URL prefix)
 * @param mimeType - The MIME type of the image
 */
export const analyzeCropDiseaseBase64 = async (
    base64Image: string,
    mimeType: string
): Promise<DiseaseAnalysisResult> => {
    // Convert base64 to blob/file
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const file = new File([blob], 'image.jpg', { type: mimeType });

    return analyzeCropDisease(file);
};

/**
 * Send a chat message to the AI assistant
 * @param message - The user's message
 * @param userId - Optional user ID
 * @param language - Preferred response language
 */
export const sendChatMessage = async (
    message: string,
    userId?: string,
    language: string = 'en'
): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
            user_id: userId,
            language,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || 'Chat request failed');
    }

    return response.json();
};

/**
 * Stream chat response (for real-time typing effect)
 * Note: Backend currently doesn't support streaming, so this simulates it
 */
export async function* streamChatResponse(
    message: string,
    userId?: string,
    language: string = 'en'
): AsyncGenerator<string> {
    const response = await sendChatMessage(message, userId, language);
    
    // Simulate streaming by yielding words one at a time
    const words = response.response.split(' ');
    for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 30));
    }
}

export default {
    checkHealth,
    analyzeCropDisease,
    analyzeCropDiseaseBase64,
    sendChatMessage,
    streamChatResponse,
};
