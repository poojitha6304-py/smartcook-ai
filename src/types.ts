export type PageId =
  | "home"
  | "scanner"
  | "recommendations"
  | "chatbot"
  | "explorer"
  | "about";

export type Region = "South Indian" | "North Indian" | "Andhra" | "Telangana";

export type DietType = "Vegetarian" | "Non-Vegetarian";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface DetectedIngredient {
  id: string;
  name: string;
  category: string;
  quantityNote?: string;
}

export interface Recipe {
  id: string;
  title: string;
  region: Region;
  diet: DietType;
  cookingTime: string;
  cookingMinutes: number;
  difficulty: Difficulty;
  servings: number;
  image: string;
  description: string;
  requiredIngredients: string[];
  instructions: string[];
  isCustomAI?: boolean;
}

export interface MatchedRecipe extends Recipe {
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
