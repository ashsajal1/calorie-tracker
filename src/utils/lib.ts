// Storage Utils
export const setItem = (key: string, value: any): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getItem = (key: string): any => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) as string);
  }
  return null;
};

export const removeItem = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// Validation Utils
export const isValidEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
};

export const isValidPassword = (password: string): boolean => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

// String Utils
export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const toCamelCase = (str: string): string => {
  return str.replace(/-./g, (match) => match.charAt(1).toUpperCase());
};

export function formatTime(isoTimestamp: string) {
  const date = new Date(isoTimestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Calculates the required daily calorie intake based on personal metrics and goals.
 * 
 * @param weight - Weight in kilograms
 * @param height - Height in centimeters
 * @param age - Age in years
 * @param goal - Weight management goal: "weight_loss", "weight_gain", or "maintain"
 * @param gender - "male" or "female"
 * @param workStatus - Activity level: "sedentary", "moderate", "active", or "very_active"
 * @returns The calculated daily calorie requirement (rounded to nearest integer)
 */
export const calculateRequiredCalories = (
  weight: number,
  height: number,
  age: number,
  goal: "weight_loss" | "weight_gain" | "maintain",
  gender: string = "male",
  workStatus: "active" | "sedentary" | "moderate" | "very_active" = "active" // active, sedentary, moderate, very_active
): number => {
  // Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
  let bmr = 0;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Apply activity multiplier
  let activityMultiplier = 1.2; // Default for sedentary

  switch (workStatus) {
    case "sedentary":
      activityMultiplier = 1.2; // Little or no exercise
      break;
    case "moderate":
      activityMultiplier = 1.55; // Moderate exercise 3-5 days/week
      break;
    case "active":
      activityMultiplier = 1.725; // Active exercise 3-5 days/week
      break;
    case "very_active":
      activityMultiplier = 1.9; // Very active exercise 6-7 days/week
      break;
  }

  // Calculate total daily energy expenditure (TDEE)
  let tdee = bmr * activityMultiplier;

  // Apply goal-based adjustments
  switch (goal) {
    case "weight_loss":
      tdee -= 500; // Deficit of 500 calories for weight loss
      break;
    case "weight_gain":
      tdee += 500; // Surplus of 500 calories for weight gain
      break;
    case "maintain":
      // No adjustment needed for maintenance
      break;
  }

  return Math.round(tdee);
};

interface Food {
  id: string;
  name: string;
  calories: number;
  category: 'protein' | 'carbs' | 'fats' | 'vegetables' | 'fruits' | 'dairy' | 'snacks';
  servingSize: number; // in grams
  servingUnit: string;
}

export const getFoodList = (): Food[] => {
  return [
    // Proteins
    { id: 'chicken-breast', name: 'Chicken Breast', calories: 165, category: 'protein', servingSize: 100, servingUnit: 'g' },
    { id: 'salmon', name: 'Salmon', calories: 208, category: 'protein', servingSize: 100, servingUnit: 'g' },
    { id: 'eggs', name: 'Eggs', calories: 155, category: 'protein', servingSize: 100, servingUnit: 'g' },
    { id: 'tofu', name: 'Tofu', calories: 76, category: 'protein', servingSize: 100, servingUnit: 'g' },
    { id: 'lentils', name: 'Lentils', calories: 116, category: 'protein', servingSize: 100, servingUnit: 'g' },

    // Carbs
    { id: 'brown-rice', name: 'Brown Rice', calories: 112, category: 'carbs', servingSize: 100, servingUnit: 'g' },
    { id: 'quinoa', name: 'Quinoa', calories: 120, category: 'carbs', servingSize: 100, servingUnit: 'g' },
    { id: 'sweet-potato', name: 'Sweet Potato', calories: 86, category: 'carbs', servingSize: 100, servingUnit: 'g' },
    { id: 'oats', name: 'Oats', calories: 389, category: 'carbs', servingSize: 100, servingUnit: 'g' },
    { id: 'whole-wheat-bread', name: 'Whole Wheat Bread', calories: 247, category: 'carbs', servingSize: 100, servingUnit: 'g' },

    // Vegetables
    { id: 'broccoli', name: 'Broccoli', calories: 34, category: 'vegetables', servingSize: 100, servingUnit: 'g' },
    { id: 'spinach', name: 'Spinach', calories: 23, category: 'vegetables', servingSize: 100, servingUnit: 'g' },
    { id: 'carrots', name: 'Carrots', calories: 41, category: 'vegetables', servingSize: 100, servingUnit: 'g' },
    { id: 'bell-pepper', name: 'Bell Pepper', calories: 31, category: 'vegetables', servingSize: 100, servingUnit: 'g' },
    { id: 'cauliflower', name: 'Cauliflower', calories: 25, category: 'vegetables', servingSize: 100, servingUnit: 'g' },

    // Fruits
    { id: 'apple', name: 'Apple', calories: 52, category: 'fruits', servingSize: 100, servingUnit: 'g' },
    { id: 'banana', name: 'Banana', calories: 89, category: 'fruits', servingSize: 100, servingUnit: 'g' },
    { id: 'orange', name: 'Orange', calories: 47, category: 'fruits', servingSize: 100, servingUnit: 'g' },
    { id: 'blueberries', name: 'Blueberries', calories: 57, category: 'fruits', servingSize: 100, servingUnit: 'g' },
    { id: 'strawberries', name: 'Strawberries', calories: 32, category: 'fruits', servingSize: 100, servingUnit: 'g' },

    // Dairy
    { id: 'greek-yogurt', name: 'Greek Yogurt', calories: 59, category: 'dairy', servingSize: 100, servingUnit: 'g' },
    { id: 'cottage-cheese', name: 'Cottage Cheese', calories: 98, category: 'dairy', servingSize: 100, servingUnit: 'g' },
    { id: 'milk', name: 'Milk (2%)', calories: 50, category: 'dairy', servingSize: 100, servingUnit: 'ml' },
    { id: 'cheese', name: 'Cheddar Cheese', calories: 403, category: 'dairy', servingSize: 100, servingUnit: 'g' },

    // Fats
    { id: 'avocado', name: 'Avocado', calories: 160, category: 'fats', servingSize: 100, servingUnit: 'g' },
    { id: 'almonds', name: 'Almonds', calories: 579, category: 'fats', servingSize: 100, servingUnit: 'g' },
    { id: 'olive-oil', name: 'Olive Oil', calories: 884, category: 'fats', servingSize: 100, servingUnit: 'ml' },
    { id: 'peanut-butter', name: 'Peanut Butter', calories: 588, category: 'fats', servingSize: 100, servingUnit: 'g' },

    // Snacks
    { id: 'dark-chocolate', name: 'Dark Chocolate', calories: 546, category: 'snacks', servingSize: 100, servingUnit: 'g' },
    { id: 'popcorn', name: 'Popcorn', calories: 375, category: 'snacks', servingSize: 100, servingUnit: 'g' },
    { id: 'trail-mix', name: 'Trail Mix', calories: 462, category: 'snacks', servingSize: 100, servingUnit: 'g' }
  ];
};

/**
 * Calculate calories for a given food and serving size
 * @param foodId - The ID of the food
 * @param servingSize - The serving size in the food's serving unit
 * @returns The calculated calories for the given serving size
 */
export const calculateFoodCalories = (foodId: string, servingSize: number): number => {
  const food = getFoodList().find(f => f.id === foodId);
  if (!food) return 0;
  
  return Math.round((food.calories * servingSize) / food.servingSize);
};

/**
 * Get foods by category
 * @param category - The food category to filter by
 * @returns Array of foods in the specified category
 */
export const getFoodsByCategory = (category: Food['category']): Food[] => {
  return getFoodList().filter(food => food.category === category);
};
