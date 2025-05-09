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

export const calculateRequiredCalories = (
  weight: number,
  height: number,
  age: number,
  surplus: boolean = false,
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

  // Apply surplus/deficit if needed
  if (surplus) {
    tdee += 500; // Add 500 calories for bulking
  }

  return Math.round(tdee);
};
