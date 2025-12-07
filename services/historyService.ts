import { AnalysisResult, UserInput, HistoryItem } from "../types";

const HISTORY_KEY = 'wtmt_app_history';

export const saveHistory = (input: UserInput, result: AnalysisResult) => {
  try {
    const existingData = localStorage.getItem(HISTORY_KEY);
    const history: HistoryItem[] = existingData ? JSON.parse(existingData) : [];

    // Create new item (exclude heavy image data)
    const { imageUrl, ...resultWithoutImage } = result;
    
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      input,
      result: resultWithoutImage
    };

    // Add to beginning of array
    const updatedHistory = [newItem, ...history];
    
    // Limit to last 50 entries to be safe
    const limitedHistory = updatedHistory.slice(0, 50);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error("Failed to save history", error);
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load history", error);
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};