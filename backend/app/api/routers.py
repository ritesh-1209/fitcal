"""
FastAPI Route Handlers for SmartCal REST APIs
Includes Auth, Profile, Dashboard, Meals, Activities, Budget Optimization, and AI Companion.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any, Optional
from datetime import datetime

try:
    from app.schemas.schemas import (
        UserRegisterRequest, UserLoginRequest, TokenResponse,
        UserProfileSchema, DailyTargetResponse,
        NaturalLanguageMealRequest, MealParseResponse,
        ActivityInputSchema, ActivityResultSchema,
        BudgetRecommendRequest, BudgetMealOption,
        AIChatRequest, AIChatResponse,
        DashboardSummary
    )
    from app.engines.calorie_engine import (
        calculate_bmr, calculate_tdee, calculate_goal_calories,
        calculate_macro_targets, calculate_remaining_calories
    )
    from app.engines.activity_engine import calculate_calories_burned
    from app.engines.budget_engine import generate_budget_meal_options
    from app.engines.suggestion_engine import generate_daily_suggestions
    from app.ai.gemini_service import parse_meal_text, explain_budget_recommendation, chat_with_fitness_assistant
    from app.db.food_seed import INDIAN_FOOD_SEED, search_food_in_seed
    from app.db.connection import get_db
except ImportError:
    from backend.app.schemas.schemas import (
        UserRegisterRequest, UserLoginRequest, TokenResponse,
        UserProfileSchema, DailyTargetResponse,
        NaturalLanguageMealRequest, MealParseResponse,
        ActivityInputSchema, ActivityResultSchema,
        BudgetRecommendRequest, BudgetMealOption,
        AIChatRequest, AIChatResponse,
        DashboardSummary
    )
    from backend.app.engines.calorie_engine import (
        calculate_bmr, calculate_tdee, calculate_goal_calories,
        calculate_macro_targets, calculate_remaining_calories
    )
    from backend.app.engines.activity_engine import calculate_calories_burned
    from backend.app.engines.budget_engine import generate_budget_meal_options
    from backend.app.engines.suggestion_engine import generate_daily_suggestions
    from backend.app.ai.gemini_service import parse_meal_text, explain_budget_recommendation, chat_with_fitness_assistant
    from backend.app.db.food_seed import INDIAN_FOOD_SEED, search_food_in_seed
    from backend.app.db.connection import get_db

router = APIRouter()

# In-memory store for active session state (demo zero-cost state)
STATE_STORE = {
    "profile": UserProfileSchema(
        user_id="user_123",
        name="Ritesh",
        age=24,
        sex="male",
        height_cm=175.0,
        weight_kg=72.0,
        activity_level="light",
        goal="weight_loss",
        dietary_preference="vegetarian",
        daily_budget_inr=100.0,
        location="India"
    ),
    "meals_today": [
        {
            "id": "meal_1",
            "text": "3 rotis and 1 bowl yellow dal",
            "calories": 345.0,
            "protein": 13.5,
            "carbs": 56.0,
            "fat": 4.0,
            "cost_inr": 30.0,
            "timestamp": "08:30 AM"
        }
    ],
    "activities_today": [
        {
            "id": "act_1",
            "activity_type": "walking",
            "duration_minutes": 30.0,
            "intensity": "moderate",
            "calories_burned": 132.3,
            "timestamp": "07:00 AM"
        }
    ],
    "spending_today": 30.0
}

def get_current_targets(prof: UserProfileSchema) -> DailyTargetResponse:
    bmr = calculate_bmr(prof.weight_kg, prof.height_cm, prof.age, prof.sex)
    tdee = calculate_tdee(bmr, prof.activity_level)
    target_cal = calculate_goal_calories(tdee, prof.goal, prof.sex)
    macros = calculate_macro_targets(target_cal, prof.weight_kg, prof.goal)

    return DailyTargetResponse(
        bmr=bmr,
        tdee=tdee,
        target_calories=target_cal,
        protein_g=macros["protein_g"],
        carbs_g=macros["carbs_g"],
        fat_g=macros["fat_g"],
        fiber_g=macros["fiber_g"],
        daily_budget_inr=prof.daily_budget_inr
    )

# --- AUTH ---
@router.post("/auth/register", response_model=TokenResponse)
async def register_user(req: UserRegisterRequest):
    return TokenResponse(
        access_token="mock_jwt_token_smartcal_register_success",
        token_type="bearer",
        user_id="user_123",
        name=req.name
    )

@router.post("/auth/login", response_model=TokenResponse)
async def login_user(req: UserLoginRequest):
    return TokenResponse(
        access_token="mock_jwt_token_smartcal_login_success",
        token_type="bearer",
        user_id="user_123",
        name=STATE_STORE["profile"].name
    )

# --- PROFILE ---
@router.get("/profile", response_model=UserProfileSchema)
async def get_profile():
    return STATE_STORE["profile"]

@router.put("/profile", response_model=UserProfileSchema)
async def update_profile(prof: UserProfileSchema):
    STATE_STORE["profile"] = prof
    return STATE_STORE["profile"]

@router.get("/profile/targets", response_model=DailyTargetResponse)
async def get_targets():
    return get_current_targets(STATE_STORE["profile"])

# --- DASHBOARD ---
@router.get("/dashboard", response_model=DashboardSummary)
async def get_dashboard():
    prof = STATE_STORE["profile"]
    targets = get_current_targets(prof)

    consumed_cal = sum(m["calories"] for m in STATE_STORE["meals_today"])
    consumed_p = sum(m["protein"] for m in STATE_STORE["meals_today"])
    consumed_c = sum(m["carbs"] for m in STATE_STORE["meals_today"])
    consumed_f = sum(m["fat"] for m in STATE_STORE["meals_today"])
    spent_budget = sum(m.get("cost_inr", 0.0) for m in STATE_STORE["meals_today"])

    burned_cal = sum(a["calories_burned"] for a in STATE_STORE["activities_today"])

    rem_calc = calculate_remaining_calories(targets.target_calories, consumed_cal, burned_cal)
    rem_p = max(0.0, targets.protein_g - consumed_p)
    rem_budget = max(0.0, prof.daily_budget_inr - spent_budget)

    sug = generate_daily_suggestions(
        target_cal=targets.target_calories,
        consumed_cal=consumed_cal,
        burned_cal=burned_cal,
        target_protein=targets.protein_g,
        consumed_protein=consumed_p,
        daily_budget_inr=prof.daily_budget_inr,
        spent_budget_inr=spent_budget,
        goal=prof.goal
    )

    return DashboardSummary(
        user_name=prof.name,
        date=datetime.now().strftime("%A, %b %d"),
        target_calories=targets.target_calories,
        consumed_calories=consumed_cal,
        burned_calories=burned_cal,
        net_consumed_calories=rem_calc["net_consumed_cal"],
        remaining_calories=rem_calc["remaining_cal"],
        target_protein_g=targets.protein_g,
        consumed_protein_g=round(consumed_p, 1),
        remaining_protein_g=round(rem_p, 1),
        target_carbs_g=targets.carbs_g,
        consumed_carbs_g=round(consumed_c, 1),
        target_fat_g=targets.fat_g,
        consumed_fat_g=round(consumed_f, 1),
        daily_budget_inr=prof.daily_budget_inr,
        spent_budget_inr=round(spent_budget, 1),
        remaining_budget_inr=round(rem_budget, 1),
        ai_insight_headline=sug["headline"],
        ai_insights=sug["insights"]
    )

# --- MEALS ---
@router.post("/ai/parse-meal", response_model=MealParseResponse)
async def parse_meal(req: NaturalLanguageMealRequest):
    return parse_meal_text(req.text)

@router.post("/meals")
async def log_meal(parse_res: MealParseResponse):
    meal_record = {
        "id": f"meal_{len(STATE_STORE['meals_today']) + 1}",
        "text": parse_res.original_text,
        "calories": parse_res.total_calories,
        "protein": parse_res.total_protein,
        "carbs": parse_res.total_carbs,
        "fat": parse_res.total_fat,
        "cost_inr": parse_res.total_cost_inr,
        "timestamp": datetime.now().strftime("%I:%M %p")
    }
    STATE_STORE["meals_today"].append(meal_record)
    return {"status": "success", "meal": meal_record}

@router.get("/meals/today")
async def get_today_meals():
    return {"meals": STATE_STORE["meals_today"]}

# --- ACTIVITIES ---
@router.post("/activities", response_model=ActivityResultSchema)
async def log_activity(req: ActivityInputSchema):
    prof = STATE_STORE["profile"]
    res = calculate_calories_burned(
        activity=req.activity_type,
        duration_minutes=req.duration_minutes,
        weight_kg=prof.weight_kg,
        intensity=req.intensity or "moderate"
    )
    act_record = {
        "id": f"act_{len(STATE_STORE['activities_today']) + 1}",
        "activity_type": req.activity_type,
        "duration_minutes": req.duration_minutes,
        "intensity": req.intensity or "moderate",
        "calories_burned": res["calories_burned"],
        "timestamp": datetime.now().strftime("%I:%M %p")
    }
    STATE_STORE["activities_today"].append(act_record)

    return ActivityResultSchema(
        activity_type=req.activity_type,
        duration_minutes=req.duration_minutes,
        intensity=req.intensity or "moderate",
        met_value=res["met_value"],
        calories_burned=res["calories_burned"],
        disclaimer=res["disclaimer"]
    )

@router.get("/activities/today")
async def get_today_activities():
    return {"activities": STATE_STORE["activities_today"]}

# --- BUDGET RECOMMENDATIONS ---
@router.post("/budget/recommend", response_model=List[BudgetMealOption])
async def recommend_budget_meals(req: BudgetRecommendRequest):
    prof = STATE_STORE["profile"]
    dash = await get_dashboard()

    rem_cal = dash.remaining_calories
    rem_p = dash.remaining_protein_g
    budget = req.budget_inr if req.budget_inr and req.budget_inr > 0 else dash.remaining_budget_inr
    diet = req.diet_preference or prof.dietary_preference

    options = generate_budget_meal_options(
        remaining_cal=rem_cal,
        remaining_protein=rem_p,
        remaining_budget_inr=budget,
        diet_preference=diet,
        meal_type=req.meal_type or "any"
    )

    results = []
    for opt in options:
        explanation = explain_budget_recommendation(opt, rem_cal, rem_p, budget)
        results.append(BudgetMealOption(
            id=opt["id"],
            title=opt["title"],
            diet=opt["diet"],
            prep_complexity=opt["prep_complexity"],
            estimated_cost_inr=opt["estimated_cost_inr"],
            estimated_calories=opt["estimated_calories"],
            estimated_protein_g=opt["estimated_protein_g"],
            estimated_carbs_g=opt["estimated_carbs_g"],
            estimated_fat_g=opt["estimated_fat_g"],
            items=opt["items"],
            price_checked_date=opt["price_checked_date"],
            sources=opt["sources"],
            ai_explanation=explanation
        ))
    return results

# --- AI COMPANION ---
@router.post("/ai/chat", response_model=AIChatResponse)
async def chat_ai(req: AIChatRequest):
    prof = STATE_STORE["profile"].model_dump()
    dash = (await get_dashboard()).model_dump()

    res = chat_with_fitness_assistant(req.message, prof, dash)
    return AIChatResponse(
        reply=res["reply"],
        tools_called=res["tools_called"],
        context_used=res["context_used"]
    )

# --- FOOD SEARCH ---
@router.get("/foods/search")
async def search_foods(q: str = ""):
    return {"foods": search_food_in_seed(q)}

# --- PROGRESS ---
@router.get("/progress")
async def get_progress():
    return {
        "weight_history": [
            {"date": "Mon", "weight_kg": 72.8},
            {"date": "Tue", "weight_kg": 72.5},
            {"date": "Wed", "weight_kg": 72.3},
            {"date": "Thu", "weight_kg": 72.1},
            {"date": "Fri", "weight_kg": 72.0}
        ],
        "calorie_adherence_percent": 94.0,
        "protein_adherence_percent": 88.0,
        "average_daily_spend_inr": 68.5,
        "weekly_summary": {
            "avg_calories": 2150,
            "avg_protein_g": 98.0,
            "total_activities_logged": 5,
            "total_meals_logged": 16
        }
    }
