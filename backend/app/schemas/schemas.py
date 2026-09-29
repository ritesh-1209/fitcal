"""
Pydantic Schemas & DTOs for SmartCal REST APIs & Gemini Validation
"""

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any

# Authentication
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str

# Profile & Onboarding
class UserProfileSchema(BaseModel):
    user_id: Optional[str] = "demo_user"
    name: str = "Fitness Enthusiast"
    age: int = Field(default=24, ge=10, le=100)
    sex: str = Field(default="male", description="male or female")
    height_cm: float = Field(default=175.0, ge=80.0, le=250.0)
    weight_kg: float = Field(default=70.0, ge=30.0, le=300.0)
    activity_level: str = Field(default="sedentary", description="sedentary, light, moderate, very_active")
    goal: str = Field(default="maintenance", description="weight_loss, maintenance, weight_gain")
    dietary_preference: str = Field(default="vegetarian", description="vegetarian, vegan, eggitarian, non-vegetarian")
    daily_budget_inr: float = Field(default=100.0, ge=10.0, le=5000.0)
    location: Optional[str] = "India"

class DailyTargetResponse(BaseModel):
    bmr: float
    tdee: float
    target_calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    daily_budget_inr: float

# Meal Parser & Logging
class ParsedFoodItem(BaseModel):
    name: str
    quantity: float
    unit: str
    calories: Optional[float] = 0.0
    protein: Optional[float] = 0.0
    carbs: Optional[float] = 0.0
    fat: Optional[float] = 0.0
    estimated_cost_inr: Optional[float] = 0.0

class NaturalLanguageMealRequest(BaseModel):
    text: str = Field(examples=["I ate 3 rotis, 1 bowl yellow dal and 250ml milk"])
    meal_type: Optional[str] = "lunch"

class MealParseResponse(BaseModel):
    original_text: str
    parsed_items: List[ParsedFoodItem]
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float
    total_cost_inr: float
    confidence_note: str

# Activity Logging
class ActivityInputSchema(BaseModel):
    activity_type: str = Field(examples=["walking", "running", "gym", "cycling"])
    duration_minutes: float = Field(ge=1.0, le=600.0)
    intensity: Optional[str] = "moderate"

class ActivityResultSchema(BaseModel):
    activity_type: str
    duration_minutes: float
    intensity: str
    met_value: float
    calories_burned: float
    disclaimer: str

# Budget Meal Recommendations
class BudgetRecommendRequest(BaseModel):
    budget_inr: Optional[float] = 100.0
    diet_preference: Optional[str] = "vegetarian"
    meal_type: Optional[str] = "any"
    goal: Optional[str] = "maintenance"

class BudgetMealOption(BaseModel):
    id: str
    title: str
    diet: str
    prep_complexity: str
    estimated_cost_inr: float
    estimated_calories: float
    estimated_protein_g: float
    estimated_carbs_g: float
    estimated_fat_g: float
    items: List[Dict[str, Any]]
    price_checked_date: str
    sources: List[str]
    ai_explanation: Optional[str] = None

# AI Assistant Chat
class AIChatRequest(BaseModel):
    message: str = Field(examples=["What meal should I eat under ₹80 with 30g protein?"])
    conversation_id: Optional[str] = "default_session"

class AIChatResponse(BaseModel):
    reply: str
    tools_called: Optional[List[str]] = []
    context_used: Optional[Dict[str, Any]] = None

# Dashboard Summary
class DashboardSummary(BaseModel):
    user_name: str
    date: str
    target_calories: float
    consumed_calories: float
    burned_calories: float
    net_consumed_calories: float
    remaining_calories: float
    target_protein_g: float
    consumed_protein_g: float
    remaining_protein_g: float
    target_carbs_g: float
    consumed_carbs_g: float
    target_fat_g: float
    consumed_fat_g: float
    daily_budget_inr: float
    spent_budget_inr: float
    remaining_budget_inr: float
    ai_insight_headline: str
    ai_insights: List[str]
