"""
SmartCal Initial Food Seed Dataset
Provides common Indian food items with nutrition per 100g and average estimated prices.
Data sources: IFCT (Indian Food Composition Tables) & public retail price averages.
"""

from typing import List, Dict, Any

INDIAN_FOOD_SEED: List[Dict[str, Any]] = [
    {
        "name": "Whole Wheat Roti",
        "aliases": ["roti", "chapati", "fulka", "phulka"],
        "category": "Grains",
        "serving_size": {"quantity": 1, "unit": "piece", "weight_g": 40.0},
        "calories": 200.0,
        "protein": 7.5,
        "carbs": 41.0,
        "fat": 1.5,
        "fiber": 6.0,
        "estimated_price_per_100g": 10.0,
        "source": "IFCT Standard",
        "confidence": "high"
    },
    {
        "name": "Cooked Steamed Rice",
        "aliases": ["rice", "chawal", "white rice", "steamed rice"],
        "category": "Grains",
        "serving_size": {"quantity": 1, "unit": "bowl", "weight_g": 150.0},
        "calories": 130.0,
        "protein": 2.7,
        "carbs": 28.0,
        "fat": 0.3,
        "fiber": 0.4,
        "estimated_price_per_100g": 7.5,
        "source": "IFCT Standard",
        "confidence": "high"
    },
    {
        "name": "Yellow Dal (Tadka)",
        "aliases": ["dal", "arhar dal", "toor dal", "yellow dal", "dal tadka"],
        "category": "Pulses & Legumes",
        "serving_size": {"quantity": 1, "unit": "bowl", "weight_g": 150.0},
        "calories": 105.0,
        "protein": 6.0,
        "carbs": 15.0,
        "fat": 2.5,
        "fiber": 3.5,
        "estimated_price_per_100g": 12.0,
        "source": "IFCT Standard",
        "confidence": "high"
    },
    {
        "name": "Rajma Curry (Kidney Beans)",
        "aliases": ["rajma", "kidney beans", "rajma gravy"],
        "category": "Pulses & Legumes",
        "serving_size": {"quantity": 1, "unit": "bowl", "weight_g": 150.0},
        "calories": 120.0,
        "protein": 7.0,
        "carbs": 18.0,
        "fat": 2.8,
        "fiber": 4.5,
        "estimated_price_per_100g": 12.5,
        "source": "IFCT Standard",
        "confidence": "high"
    },
    {
        "name": "Chole Curry (Chickpeas)",
        "aliases": ["chole", "chana masala", "kabuli chana"],
        "category": "Pulses & Legumes",
        "serving_size": {"quantity": 1, "unit": "bowl", "weight_g": 150.0},
        "calories": 135.0,
        "protein": 7.5,
        "carbs": 20.0,
        "fat": 3.5,
        "fiber": 5.0,
        "estimated_price_per_100g": 13.0,
        "source": "IFCT Standard",
        "confidence": "high"
    },
    {
        "name": "Soy Chunks (Dried Nutrela)",
        "aliases": ["soy chunks", "soya badi", "nutrela", "soya"],
        "category": "High Protein Veg",
        "serving_size": {"quantity": 50, "unit": "g", "weight_g": 50.0},
        "calories": 345.0,
        "protein": 52.0,
        "carbs": 33.0,
        "fat": 0.5,
        "fiber": 13.0,
        "estimated_price_per_100g": 20.0,
        "source": "FSSAI Nutrela Data",
        "confidence": "high"
    },
    {
        "name": "Paneer (Cottage Cheese)",
        "aliases": ["paneer", "cottage cheese"],
        "category": "Dairy",
        "serving_size": {"quantity": 100, "unit": "g", "weight_g": 100.0},
        "calories": 265.0,
        "protein": 18.3,
        "carbs": 1.2,
        "fat": 20.8,
        "fiber": 0.0,
        "estimated_price_per_100g": 40.0,
        "source": "Amul / Mother Dairy Specs",
        "confidence": "high"
    },
    {
        "name": "Fresh Curd (Dahi)",
        "aliases": ["curd", "dahi", "yoghurt", "yogurt"],
        "category": "Dairy",
        "serving_size": {"quantity": 1, "unit": "bowl", "weight_g": 150.0},
        "calories": 60.0,
        "protein": 4.0,
        "carbs": 4.5,
        "fat": 3.0,
        "fiber": 0.0,
        "estimated_price_per_100g": 10.0,
        "source": "FSSAI Dairy Dataset",
        "confidence": "high"
    },
    {
        "name": "Cow / Toned Milk",
        "aliases": ["milk", "doodh", "toned milk"],
        "category": "Dairy",
        "serving_size": {"quantity": 250, "unit": "ml", "weight_g": 250.0},
        "calories": 60.0,
        "protein": 3.2,
        "carbs": 4.7,
        "fat": 3.1,
        "fiber": 0.0,
        "estimated_price_per_100g": 6.5,
        "source": "Amul Toned Milk",
        "confidence": "high"
    },
    {
        "name": "Rolled Oats",
        "aliases": ["oats", "rolled oats", "oatmeal"],
        "category": "Grains",
        "serving_size": {"quantity": 50, "unit": "g", "weight_g": 50.0},
        "calories": 389.0,
        "protein": 13.5,
        "carbs": 66.0,
        "fat": 6.9,
        "fiber": 10.0,
        "estimated_price_per_100g": 25.0,
        "source": "Quaker / Kellogg Specs",
        "confidence": "high"
    },
    {
        "name": "Poha (Flattened Rice)",
        "aliases": ["poha", "pohe", "flattened rice"],
        "category": "Breakfast",
        "serving_size": {"quantity": 1, "unit": "plate", "weight_g": 200.0},
        "calories": 130.0,
        "protein": 2.5,
        "carbs": 26.0,
        "fat": 2.0,
        "fiber": 1.5,
        "estimated_price_per_100g": 8.0,
        "source": "IFCT Standard",
        "confidence": "high"
    },
    {
        "name": "Sattu Powder (Roasted Gram Flour)",
        "aliases": ["sattu", "chana sattu", "roasted gram powder"],
        "category": "Superfood / High Protein",
        "serving_size": {"quantity": 50, "unit": "g", "weight_g": 50.0},
        "calories": 395.0,
        "protein": 23.0,
        "carbs": 62.0,
        "fat": 5.0,
        "fiber": 14.0,
        "estimated_price_per_100g": 18.0,
        "source": "Traditional Indian Dataset",
        "confidence": "high"
    },
    {
        "name": "Roasted Chana",
        "aliases": ["roasted chana", "bhuna chana", "chana"],
        "category": "Snacks",
        "serving_size": {"quantity": 50, "unit": "g", "weight_g": 50.0},
        "calories": 360.0,
        "protein": 22.0,
        "carbs": 58.0,
        "fat": 5.2,
        "fiber": 12.0,
        "estimated_price_per_100g": 25.0,
        "source": "IFCT Standard",
        "confidence": "high"
    },
    {
        "name": "Whole Boiled Egg",
        "aliases": ["egg", "eggs", "boiled egg", "anda"],
        "category": "Eggitarian",
        "serving_size": {"quantity": 1, "unit": "piece", "weight_g": 50.0},
        "calories": 155.0,
        "protein": 12.6,
        "carbs": 1.1,
        "fat": 10.6,
        "fiber": 0.0,
        "estimated_price_per_100g": 14.0,
        "source": "USDA / NECC India",
        "confidence": "high"
    },
    {
        "name": "Raw Chicken Breast",
        "aliases": ["chicken", "chicken breast", "boneless chicken"],
        "category": "Non-Vegetarian",
        "serving_size": {"quantity": 150, "unit": "g", "weight_g": 150.0},
        "calories": 165.0,
        "protein": 31.0,
        "carbs": 0.0,
        "fat": 3.6,
        "fiber": 0.0,
        "estimated_price_per_100g": 30.0,
        "source": "Meat Market Average",
        "confidence": "high"
    },
    {
        "name": "Peanuts / Groundnuts",
        "aliases": ["peanuts", "mungfali", "groundnuts"],
        "category": "Nuts & Seeds",
        "serving_size": {"quantity": 30, "unit": "g", "weight_g": 30.0},
        "calories": 567.0,
        "protein": 25.8,
        "carbs": 16.0,
        "fat": 49.0,
        "fiber": 8.5,
        "estimated_price_per_100g": 16.0,
        "source": "IFCT Standard",
        "confidence": "high"
    },
    {
        "name": "Banana",
        "aliases": ["banana", "kela"],
        "category": "Fruits",
        "serving_size": {"quantity": 1, "unit": "piece", "weight_g": 100.0},
        "calories": 89.0,
        "protein": 1.1,
        "carbs": 22.8,
        "fat": 0.3,
        "fiber": 2.6,
        "estimated_price_per_100g": 6.0,
        "source": "Fruit Market Average",
        "confidence": "high"
    },
    {
        "name": "Apple",
        "aliases": ["apple", "seb"],
        "category": "Fruits",
        "serving_size": {"quantity": 1, "unit": "piece", "weight_g": 150.0},
        "calories": 52.0,
        "protein": 0.3,
        "carbs": 13.8,
        "fat": 0.2,
        "fiber": 2.4,
        "estimated_price_per_100g": 18.0,
        "source": "Fruit Market Average",
        "confidence": "high"
    }
]

def search_food_in_seed(query: str) -> List[Dict[str, Any]]:
    """
    Case-insensitive search in seed dataset.
    """
    q_clean = query.strip().lower()
    matches = []
    for food in INDIAN_FOOD_SEED:
        name_match = q_clean in food["name"].lower()
        alias_match = any(q_clean in alias.lower() for alias in food["aliases"])
        if name_match or alias_match:
            matches.append(food)
    return matches
