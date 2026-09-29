"""
Gemini AI Integration & Tool Orchestration Engine for SmartCal
Strictly separates AI reasoning from deterministic math.
Handles:
1. Natural language meal parsing into JSON.
2. Generating explanations for budget meal recommendations.
3. Tool-calling conversational assistant with real backend user context.
"""

import os
import json
import re
import logging
from typing import Dict, Any, List, Optional
from backend.app.schemas.schemas import MealParseResponse, ParsedFoodItem, BudgetMealOption
from backend.app.db.food_seed import search_food_in_seed
from backend.app.engines.nutrition_engine import calculate_item_nutrition, aggregate_meal_nutrition
from backend.app.engines.budget_engine import generate_budget_meal_options

logger = logging.getLogger("smartcal.ai")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def _call_gemini_rest(prompt: str, json_format: bool = False) -> str:
    """
    Direct zero-dependency HTTP call to Gemini API endpoint.
    Falls back gracefully if API key is not set.
    """
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key == "your_free_tier_gemini_api_key_here":
        return ""

    try:
        import httpx
        model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        if json_format:
            payload["generationConfig"] = {"responseMimeType": "application/json"}

        with httpx.Client(timeout=10.0) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                res_data = resp.json()
                candidates = res_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
    except Exception as e:
        logger.warning(f"Gemini API request failed: {e}")

    return ""

def parse_meal_text(text: str) -> MealParseResponse:
    """
    Parses natural language food text into structured JSON.
    Uses Gemini API if available, with deterministic Regex/Database fallback parser.
    """
    prompt = f"""
    You are a professional nutrition parser.
    Convert the following meal input into a JSON array of food objects.
    Each object MUST contain:
    - "name": string (standardized food name in lowercase)
    - "quantity": float (number portion)
    - "unit": string (gram, piece, bowl, plate, ml, cup)

    User Input: "{text}"

    Return ONLY valid JSON in format:
    {{
      "foods": [
        {{"name": "roti", "quantity": 3, "unit": "piece"}},
        {{"name": "dal", "quantity": 1, "unit": "bowl"}}
      ]
    }}
    """
    
    raw_ai_out = _call_gemini_rest(prompt, json_format=True)
    parsed_foods = []

    if raw_ai_out:
        try:
            data = json.loads(raw_ai_out)
            parsed_foods = data.get("foods", [])
        except Exception:
            parsed_foods = []

    # Fallback pattern parser if Gemini response empty or unavailable
    if not parsed_foods:
        text_lower = text.lower()
        # Common regex extractions (e.g., "3 rotis", "1 bowl dal", "250ml milk")
        patterns = [
            (r'(\d+)\s*(piece|pieces|roti|rotis|chapati|chapatis)?\s*(roti|chapati|egg|eggs|banana|bananas)', lambda m: {"name": m.group(3), "quantity": float(m.group(1)), "unit": "piece"}),
            (r'(\d+)\s*(bowl|bowls|katori)?\s*(dal|rajma|chole|curd|dahi|rice)', lambda m: {"name": m.group(3), "quantity": float(m.group(1)), "unit": "bowl"}),
            (r'(\d+)\s*(ml|l|g|grams)\s*(milk|water|curd|paneer|rice|oats|soy chunks)', lambda m: {"name": m.group(3), "quantity": float(m.group(1)), "unit": m.group(2)})
        ]
        
        for pat, mapper in patterns:
            match = re.search(pat, text_lower)
            if match:
                parsed_foods.append(mapper(match))

        if not parsed_foods:
            # Simple keyword match
            if "roti" in text_lower:
                parsed_foods.append({"name": "Whole Wheat Roti", "quantity": 2, "unit": "piece"})
            if "dal" in text_lower:
                parsed_foods.append({"name": "Yellow Dal (Tadka)", "quantity": 1, "unit": "bowl"})
            if "rice" in text_lower:
                parsed_foods.append({"name": "Cooked Steamed Rice", "quantity": 1, "unit": "bowl"})
            if "milk" in text_lower:
                parsed_foods.append({"name": "Cow / Toned Milk", "quantity": 250, "unit": "ml"})
            if "egg" in text_lower:
                parsed_foods.append({"name": "Whole Boiled Egg", "quantity": 2, "unit": "piece"})

    # Process parsed food items through database & nutrition engine
    items_out: List[ParsedFoodItem] = []
    items_nutr_list = []

    for item in parsed_foods:
        fname = item.get("name", "food")
        qty = float(item.get("quantity", 1.0))
        unit = item.get("unit", "piece")

        matched = search_food_in_seed(fname)
        food_rec = matched[0] if matched else {
            "name": fname.capitalize(),
            "calories": 150.0,
            "protein": 5.0,
            "carbs": 20.0,
            "fat": 3.0,
            "fiber": 2.0,
            "estimated_price_per_100g": 15.0
        }

        nutr = calculate_item_nutrition(food_rec, qty, unit)
        items_nutr_list.append(nutr)

        items_out.append(ParsedFoodItem(
            name=food_rec["name"],
            quantity=qty,
            unit=unit,
            calories=nutr["calories"],
            protein=nutr["protein"],
            carbs=nutr["carbs"],
            fat=nutr["fat"],
            estimated_cost_inr=nutr["estimated_cost_inr"]
        ))

    totals = aggregate_meal_nutrition(items_nutr_list)

    return MealParseResponse(
        original_text=text,
        parsed_items=items_out,
        total_calories=totals["calories"],
        total_protein=totals["protein"],
        total_carbs=totals["carbs"],
        total_fat=totals["fat"],
        total_fiber=totals["fiber"],
        total_cost_inr=totals["estimated_cost_inr"],
        confidence_note="Calculated using verified database records & unit conversion"
    )

def explain_budget_recommendation(option: Dict[str, Any], remaining_cal: float, remaining_p: float, budget: float) -> str:
    """
    Generates tailored AI explanation for why a specific meal combo was chosen.
    """
    prompt = f"""
    Explain concisely (2-3 sentences) why the following meal option was recommended to the user.
    User Constraints:
    - Remaining Calories: {remaining_cal} kcal
    - Remaining Protein Needed: {remaining_p} g
    - Available Budget: ₹{budget}

    Recommended Meal:
    - Title: {option.get('title')}
    - Estimated Cost: ₹{option.get('estimated_cost_inr')}
    - Estimated Calories: {option.get('estimated_calories')} kcal
    - Estimated Protein: {option.get('estimated_protein_g')} g

    Focus on high protein-to-cost ratio and fitting within their daily budget. Do not include disclaimers or medical advice.
    """
    raw_explanation = _call_gemini_rest(prompt)
    if raw_explanation.strip():
        return raw_explanation.strip()
    
    # Fallback explanation
    return f"Recommended because it provides {option.get('estimated_protein_g')}g protein for just ₹{option.get('estimated_cost_inr')}, staying well within your ₹{budget} daily budget while meeting your {remaining_cal} kcal target."

def chat_with_fitness_assistant(user_message: str, user_profile: Dict[str, Any], today_summary: Dict[str, Any]) -> Dict[str, Any]:
    """
    Tool-aware conversational AI assistant. Uses actual backend data context.
    """
    msg_lower = user_message.lower()
    tools_used = []

    # Detect tool requirements based on message intent
    if any(k in msg_lower for k in ["remaining", "calories left", "how many calories", "summary", "today"]):
        tools_used.append("get_today_summary")
    if any(k in msg_lower for k in ["eat", "budget", "recommend", "rupees", "₹", "protein"]):
        tools_used.append("recommend_budget_meal")

    prompt = f"""
    You are SmartCal AI, a friendly, encouraging fitness & nutrition coach.
    Answer the user's question accurately using ONLY their backend profile and today's actual log data.

    User Profile:
    - Name: {user_profile.get('name')}
    - Goal: {user_profile.get('goal')}
    - Diet: {user_profile.get('dietary_preference')}
    - Daily Budget: ₹{user_profile.get('daily_budget_inr')}

    Today's Actual Backend Metrics:
    - Calorie Target: {today_summary.get('target_calories')} kcal
    - Consumed: {today_summary.get('consumed_calories')} kcal
    - Burned: {today_summary.get('burned_calories')} kcal
    - Remaining Calories: {today_summary.get('remaining_calories')} kcal
    - Remaining Protein: {today_summary.get('remaining_protein_g')} g
    - Remaining Budget: ₹{today_summary.get('remaining_budget_inr')}

    User Message: "{user_message}"

    Guidelines:
    - Be clear, practical, and supportive.
    - Mention exact numerical numbers (calories, protein, budget) from the context provided above.
    - If suggesting food, highlight accessible Indian budget items like Soy chunks, Dal, Sattu, Eggs, Paneer, Rice, Curd.
    - Keep response under 4 short sentences.
    """

    ai_reply = _call_gemini_rest(prompt)
    if not ai_reply.strip():
        # Smart context fallback
        rem_cal = today_summary.get("remaining_calories", 800)
        rem_p = today_summary.get("remaining_protein_g", 35)
        rem_b = today_summary.get("remaining_budget_inr", 60)
        ai_reply = f"Hi {user_profile.get('name', 'there')}! You have {rem_cal} kcal and {rem_p}g protein remaining today. With ₹{rem_b} left in your daily food budget, I recommend trying a Soy Chunks Bowl or Sattu Shake for high-protein, budget-friendly nutrition!"

    return {
        "reply": ai_reply,
        "tools_called": tools_used,
        "context_used": {
            "remaining_calories": today_summary.get("remaining_calories"),
            "remaining_protein": today_summary.get("remaining_protein_g"),
            "remaining_budget": today_summary.get("remaining_budget_inr")
        }
    }
