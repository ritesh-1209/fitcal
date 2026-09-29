# SmartCal — Architecture & Design Document

## 1. Executive Overview
SmartCal is an AI-powered Calorie, Nutrition & Budget Meal Assistant. It is designed specifically to solve the core problem: **"What can I eat NEXT that fits my remaining calories, protein requirements, dietary preferences, and tight budget?"**

## 2. Monorepo Structure
```
smartcal/
├── docs/
│   └── ARCHITECTURE.md
├── backend/
│   ├── app/
│   │   ├── api/             # REST Endpoints & Routers
│   │   ├── engines/         # Deterministic Math Engines (BMR, MET, Budget Optimizer)
│   │   │   ├── calorie_engine.py
│   │   │   ├── nutrition_engine.py
│   │   │   ├── activity_engine.py
│   │   │   ├── budget_engine.py
│   │   │   └── suggestion_engine.py
│   │   ├── ai/              # Gemini SDK, Tool Calling, Structured Output Parsers
│   │   ├── db/              # MongoDB Async Driver (Motor / PyMongo), Data Schemas
│   │   ├── models/          # Pydantic Schemas & DTOs
│   │   ├── config/          # App Settings & Env Config
│   │   └── main.py          # FastAPI Gateway Entrypoint
│   ├── requirements.txt
│   └── .env.example
├── frontend/                # React Native Expo Application
│   ├── app/
│   ├── src/
│   │   ├── components/      # UI Cards, Progress Rings, Modals, Inputs
│   │   ├── screens/         # 14 Full Mobile Screens
│   │   ├── services/        # API Client Services & Offline Storage
│   │   ├── store/           # Global State Management (Zustand / Context)
│   │   ├── types/           # TypeScript Type Definitions
│   │   └── theme/           # Color tokens, Typography, Glassmorphism
│   ├── App.tsx
│   ├── package.json
│   └── app.json
├── tests/                   # Backend Unit & Integration Tests (Pytest)
├── .env.example
└── README.md
```

## 3. Strict Separation of Concerns (Architectural Principle)
- **Deterministic Math Engines (Python Backend)**: BMR (Mifflin-St Jeor), TDEE, Goal Calories, Macro Allocation, Activity MET expenditure, Remaining Daily Target, Budget meal combination optimization.
- **AI Engine (Gemini API)**: Natural language meal parsing, tool calling for real-time user context, generating personalized recommendations explanations, conversational fitness assistant.

## 4. Data Models (MongoDB Collections)
1. `users`: Authentication & Security (`_id`, `email`, `password_hash`, `created_at`)
2. `profiles`: User Body Stats & Preferences (`user_id`, `name`, `age`, `sex`, `height_cm`, `weight_kg`, `activity_level`, `goal`, `dietary_preference`, `daily_budget_inr`, `location`)
3. `foods`: Verified Nutrition Database (`name`, `aliases`, `category`, `serving_size`, `calories`, `protein`, `carbs`, `fat`, `fiber`, `estimated_price_per_100g`, `price_updated_at`)
4. `meals`: Logged Meals (`user_id`, `date`, `meal_type`, `foods`, `total_calories`, `total_protein`, `total_carbs`, `total_fat`, `total_fiber`, `cost_est`)
5. `activities`: Logged Physical Activities (`user_id`, `date`, `activity_type`, `met_value`, `duration_minutes`, `calories_burned`)
6. `daily_logs`: Daily Summaries (`user_id`, `date`, `target_calories`, `consumed_calories`, `burned_calories`, `remaining_calories`, `budget_spent`, `remaining_budget`)
7. `price_snapshots`: Historic/Searched Prices (`food_id`, `food_name`, `price_inr`, `quantity_g`, `source`, `timestamp`)
8. `ai_conversations`: Chat Logs (`user_id`, `messages`, `timestamp`)

## 5. Technology Stack & Zero-Cost Infrastructure
- **Backend Framework**: Python 3.12+ / FastAPI + Pydantic v2
- **Database**: MongoDB Atlas Free Tier / Motor Async Driver (with Local MongoDB fallback)
- **AI LLM Integration**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`) via `google-genai` / `google-generativeai`
- **Frontend Framework**: React Native Expo with TypeScript & Expo Router / Navigation
- **Styling & Design System**: Modern Glassmorphism, Dark/Light Theme Support, Custom Micro-Animations, SVG Charts
- **Testing**: Pytest for backend calculation engines, API validation, schema verification
