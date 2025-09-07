
/**
 * Represents a single message in a chat conversation.
 */
export interface ChatMessage {
  /** The sender of the message, either the user or the AI model. */
  role: 'user' | 'model';
  /** The text content of the message. */
  text: string;
}

/**
 * Represents the result of a crop disease analysis.
 */
export interface DiseaseAnalysisResult {
  /** The name of the identified disease. */
  disease: string;
  /** The confidence level of the diagnosis, as a percentage. */
  confidence: number;
  /** A brief description of the disease. */
  description: string;
  /** A list of recommended treatment steps. */
  treatment: string[];
  /** A list of recommended prevention strategies. */
  prevention: string[];
}

/**
 * Defines the parameters required for a yield prediction request.
 */
export interface YieldPredictionParams {
  /** The type of crop being evaluated (e.g., "corn", "wheat"). */
  crop: string;
  /** The size of the farm in acres. */
  acres: number | string;
  /** The geographical location of the farm. */
  location: string;
  /** The primary soil type of the farm (e.g., "loamy", "sandy"). */
  soilType: string;
}

/**
 * Represents the result of a crop yield prediction.
 */
export interface YieldPredictionResult {
  /** The predicted yield in tons per hectare. */
  predictedYield: number;
  /** The average yield for the same crop in the region, for comparison. */
  regionalAverage: number;
  /** A list of insights and recommendations based on the prediction. */
  insights: string[];
}

/**
 * Represents the result of a market analysis for a specific crop.
 */
export interface MarketAnalysisResult {
  /** The full market analysis text, formatted with markdown. */
  analysisText: string;
  /** A list of sources used to generate the analysis. */
  sources: Array<{ title: string; uri: string }>;
}

/**
 * Represents a single recent activity performed by the user.
 */
export interface RecentActivity {
  /** A unique identifier for the activity. */
  id: number;
  /** The type of tool or feature that was used. */
  icon: 'disease' | 'yield' | 'watering' | 'chat' | 'market';
  /** A brief description of the activity. */
  description: string;
  /** The timestamp when the activity occurred. */
  timestamp: string;
}

/**
 * Represents the user's profile information.
 */
export interface UserProfile {
  /** The user's full name. */
  name: string;
  /** The user's email address. */
  email: string;
  /** The user's contact phone number. */
  contact: string;
  /** The size of the user's farm in acres. */
  acres: number | string;
  /** The geographical location of the user's farm. */
  location: string;
  /** A description of the crops currently planted by the user. */
  currentCrops: string;
  /** The primary soil type of the user's farm. */
  soilType: string;
}