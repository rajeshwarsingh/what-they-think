export interface AnalysisResult {
  tone: string;
  toneEmoji: string;
  confidenceScore: number;
  // topClues: string[]; // Removed as per request "Remove the sign"
  possibleThoughts: string[];
  relationshipForecast: string; // New: e.g. "Future lover 😘"
  safetyFlag: boolean;
  detailedAnalysis?: string; // Only available in paid tier
  imageUrl?: string; // New generated image
}

export enum AppStep {
  LANDING = 'LANDING',
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  PAYMENT_GATEWALL = 'PAYMENT_GATEWALL', // Simulated
  RESULT_BASIC = 'RESULT_BASIC',
  RESULT_DETAILED = 'RESULT_DETAILED',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface UserInput {
  userGender: string; // 'Male' or 'Female'
  targetGender: string; // 'Male' or 'Female'
  personBHandle: string; // The target
  selectedVibes: string[]; // Selected tags instead of raw text
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: UserInput;
  result: Omit<AnalysisResult, 'imageUrl'>; // Exclude image to save space
}