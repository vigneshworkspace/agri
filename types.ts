
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface DiseaseAnalysisResult {
  disease: string;
  confidence: number;
  description: string;
  treatment: string[];
  prevention: string[];
}

export interface YieldPredictionParams {
  crop: string;
  acres: number | string;
  location: string;
  soilType: string;
}

export interface YieldPredictionResult {
  predictedYield: number;
  regionalAverage: number;
  insights: string[];
}

export interface MarketAnalysisResult {
  analysisText: string;
  sources: Array<{ title: string; uri: string }>;
}

export interface RecentActivity {
  id: number;
  icon: 'disease' | 'yield' | 'watering' | 'chat' | 'market';
  description: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  contact: string;
  acres: number | string;
  location: string;
  currentCrops: string;
  soilType: string;
}