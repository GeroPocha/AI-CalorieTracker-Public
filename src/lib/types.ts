
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  amount: number;
  unit: string;
  fat?: number;
  carbs?: number;
  protein?: number;
  timestamp: Date;
}

export interface DailyCalories {
  date: string;
  total: number;
  goal: number;
  totalFat: number;
  totalCarbs: number;
  totalProtein: number;
  fatGoal: number;
  carbsGoal: number;
  proteinGoal: number;
  entries: FoodEntry[];
}

export interface BarcodeProduct {
  name: string;
  calories: number;
  fat?: number;
  carbs?: number;
  protein?: number;
  servingSize?: number;
  servingUnit?: string;
  imageUrl?: string;
}

export interface PerplexityResponse {
  food: {
    name: string;
    amount: number;
    unit: string;
    calories: number;
    fat?: number;
    carbs?: number;
    protein?: number;
  };
  message: string;
}
