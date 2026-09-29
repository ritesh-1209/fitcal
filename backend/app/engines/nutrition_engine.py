"""
Nutrition Engine Module for SmartCal
Handles food item unit conversion, macro aggregation, and meal nutrition arithmetic.
"""

from typing import List, Dict, Any

# Unit conversion reference table to grams/ml
UNIT_CONVERSIONS = {
    "g": 1.0,
    "gram": 1.0,
    "grams": 1.0,
    "kg": 1000.0,
    "ml": 1.0,
    "l": 1000.0,
    "liter": 1000.0,
    "piece": 40.0,      # Average roti/small food item weight
    "pieces": 40.0,
    "roti": 40.0,
    "bowl": 150.0,     # Standard Indian bowl (katori) ~150g/ml
    "bowls": 150.0,
    "katori": 150.0,
    "plate": 250.0,    # Standard plate portion (poha, rice) ~250g
    "cup": 200.0,      # Standard cup ~200g/ml
    "glass": 250.0,    # Standard glass ~250ml
    "scoop": 30.0,     # Protein powder scoop ~30g
    "tbsp": 15.0,
    "tablespoon": 15.0,
    "tsp": 5.0,
    "teaspoon": 5.0,
    "unit": 50.0
}

def normalize_quantity_to_grams(quantity: float, unit: str) -> float:
    """
    Converts a given quantity and unit into equivalent weight in grams/milliliters.
    """
    u_clean = unit.strip().lower()
    multiplier = UNIT_CONVERSIONS.get(u_clean, 100.0)
    return quantity * multiplier

def calculate_item_nutrition(food_record: Dict[str, Any], quantity: float, unit: str) -> Dict[str, float]:
    """
    Calculates nutrition for a specific food item based on quantity and database base record (per 100g).
    """
    weight_g = normalize_quantity_to_grams(quantity, unit)
    factor = weight_g / 100.0

    cal_base = food_record.get("calories", 0.0)
    p_base = food_record.get("protein", 0.0)
    c_base = food_record.get("carbs", 0.0)
    f_base = food_record.get("fat", 0.0)
    fib_base = food_record.get("fiber", 0.0)

    price_base = food_record.get("estimated_price_per_100g", 0.0)

    return {
        "weight_g": round(weight_g, 1),
        "calories": round(cal_base * factor, 1),
        "protein": round(p_base * factor, 1),
        "carbs": round(c_base * factor, 1),
        "fat": round(f_base * factor, 1),
        "fiber": round(fib_base * factor, 1),
        "estimated_cost_inr": round(price_base * factor, 1)
    }

def aggregate_meal_nutrition(items_nutrition: List[Dict[str, float]]) -> Dict[str, float]:
    """
    Aggregates list of food item nutrition outputs into total meal macros.
    """
    total_cal = sum(item.get("calories", 0.0) for item in items_nutrition)
    total_p = sum(item.get("protein", 0.0) for item in items_nutrition)
    total_c = sum(item.get("carbs", 0.0) for item in items_nutrition)
    total_f = sum(item.get("fat", 0.0) for item in items_nutrition)
    total_fib = sum(item.get("fiber", 0.0) for item in items_nutrition)
    total_cost = sum(item.get("estimated_cost_inr", 0.0) for item in items_nutrition)

    return {
        "calories": round(total_cal, 1),
        "protein": round(total_p, 1),
        "carbs": round(total_c, 1),
        "fat": round(total_f, 1),
        "fiber": round(total_fib, 1),
        "estimated_cost_inr": round(total_cost, 1)
    }
