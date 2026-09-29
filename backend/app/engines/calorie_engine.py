"""
Calorie Engine Module for SmartCal
Implements Mifflin-St Jeor BMR, TDEE, Goal Calorie adjustment, and Macro allocations.
Calculations are strictly deterministic (No LLM for arithmetic).
"""

from typing import Dict, Any, Literal

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "very_active": 1.725
}

GOAL_ADJUSTMENTS = {
    "weight_loss": -450.0,   # Modest deficit ~450 kcal
    "maintenance": 0.0,     # Maintenance
    "weight_gain": 350.0     # Modest surplus ~350 kcal
}

def calculate_bmr(weight_kg: float, height_cm: float, age: int, sex: str) -> float:
    """
    Calculates Basal Metabolic Rate using Mifflin-St Jeor equation.
    Male: BMR = 10W + 6.25H - 5A + 5
    Female: BMR = 10W + 6.25H - 5A - 161
    """
    sex_normalized = sex.strip().lower()
    base_bmr = 10.0 * weight_kg + 6.25 * height_cm - 5.0 * age
    if sex_normalized in ["male", "m"]:
        return round(base_bmr + 5.0, 2)
    elif sex_normalized in ["female", "f"]:
        return round(base_bmr - 161.0, 2)
    else:
        # Default to average offset
        return round(base_bmr - 78.0, 2)

def calculate_tdee(bmr: float, activity_level: str) -> float:
    """
    Calculates Total Daily Energy Expenditure based on activity multiplier.
    """
    level_clean = activity_level.strip().lower().replace(" ", "_")
    multiplier = ACTIVITY_MULTIPLIERS.get(level_clean, 1.2)
    return round(bmr * multiplier, 2)

def calculate_goal_calories(tdee: float, goal: str, sex: str = "male") -> float:
    """
    Calculates target calories based on user goal.
    Enforces safe minimum boundary checks (1200 kcal for female, 1500 kcal for male).
    """
    goal_clean = goal.strip().lower().replace(" ", "_")
    adjustment = GOAL_ADJUSTMENTS.get(goal_clean, 0.0)
    target = tdee + adjustment

    # Safe minimum boundary protection
    min_calories = 1200.0 if sex.strip().lower() in ["female", "f"] else 1450.0
    return round(max(target, min_calories), 2)

def calculate_macro_targets(goal_calories: float, weight_kg: float, goal: str) -> Dict[str, float]:
    """
    Calculates daily protein, carbohydrate, fat, and fiber goals in grams.
    Protein: 1.6g - 2.0g per kg body weight depending on goal.
    Fat: 25% of total calories.
    Carbs: Remaining calories.
    Fiber: 14g per 1000 kcal.
    """
    goal_clean = goal.strip().lower().replace(" ", "_")
    if goal_clean == "weight_loss":
        protein_per_kg = 1.8
    elif goal_clean == "weight_gain":
        protein_per_kg = 1.9
    else:
        protein_per_kg = 1.5

    protein_g = round(weight_kg * protein_per_kg, 1)
    protein_cal = protein_g * 4.0

    # 25% fat allocation
    fat_cal = goal_calories * 0.25
    fat_g = round(fat_cal / 9.0, 1)

    # Remaining calories to carbs
    carb_cal = max(0.0, goal_calories - (protein_cal + fat_cal))
    carbs_g = round(carb_cal / 4.0, 1)

    # Fiber target
    fiber_g = round((goal_calories / 1000.0) * 14.0, 1)

    return {
        "protein_g": protein_g,
        "carbs_g": carbs_g,
        "fat_g": fat_g,
        "fiber_g": max(20.0, fiber_g)
    }

def calculate_remaining_calories(target_cal: float, consumed_cal: float, burned_cal: float) -> Dict[str, float]:
    """
    Calculates net consumed and remaining calories without double-counting exercise.
    """
    net_consumed = max(0.0, consumed_cal - burned_cal)
    remaining = max(0.0, target_cal - net_consumed)
    return {
        "target_cal": round(target_cal, 1),
        "consumed_cal": round(consumed_cal, 1),
        "burned_cal": round(burned_cal, 1),
        "net_consumed_cal": round(net_consumed, 1),
        "remaining_cal": round(remaining, 1)
    }
