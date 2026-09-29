# SmartCal — AI-Powered Calorie, Nutrition & Budget Meal Assistant

SmartCal is a production-grade, zero-cost mobile & web MVP designed to help users calculate daily calorie/macro needs, log meals naturally with AI parsing, track physical activity expenditure, and receive **budget-optimized meal recommendations** based on live food prices in India.

---

## 🌟 Core Differentiator
Most fitness apps only track what you've already eaten. **SmartCal calculates what you can eat NEXT** by combining:
- Remaining daily calories & protein target
- Available daily food budget (e.g., ₹50, ₹75, ₹100, ₹150)
- Dietary preferences (Vegetarian, Vegan, Eggitarian, Non-Veg)
- Current Indian food market prices

---

## 🏗 System Architecture & Technology Stack

### Backend (Python / FastAPI)
- **FastAPI**: High-performance async REST API with Pydantic v2 validation.
- **Engine Modules**:
  - `calorie_engine`: Mifflin-St Jeor equation for BMR, TDEE, Goal Calories & Macro Targets.
  - `nutrition_engine`: Detailed macro breakdowns (Calories, Protein, Carbs, Fat, Fiber).
  - `activity_engine`: MET-based physical activity expenditure formula.
  - `budget_engine`: Combinatorial price-to-protein optimization solver.
  - `suggestion_engine`: Context-aware actionable daily insights.
- **AI Integration**: Google Gemini API for structured natural language meal parsing, tool-calling fitness companion, and recommendation explanations.
- **Database**: MongoDB (Atlas Free Tier / Async Motor driver / PyMongo).

### Frontend (React Native / Expo / TypeScript)
- **Expo Framework**: Cross-platform Web & Mobile app using TypeScript.
- **UI/UX**: Custom fitness glassmorphism design system, dark mode, progress rings, and micro-animations.
- **State Management**: React State & Context API with local caching support.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) & npm
- Python (3.10+)
- MongoDB (Local or MongoDB Atlas free URI)
- Free Gemini API Key (from Google AI Studio)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Unix:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Fill in your GEMINI_API_KEY and MONGODB_URI in .env

# Run FastAPI Dev Server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# or
npx expo start --web
```

### 3. Running Backend Tests
```bash
cd backend
pytest
```

---

## 📁 Project Structure
```
smartcal/
├── backend/
│   ├── app/
│   │   ├── api/          # Routers (auth, profile, meals, activities, budget, ai)
│   │   ├── engines/      # BMR, TDEE, MET, Budget Optimizer engines
│   │   ├── ai/           # Gemini API parser, tool calls & explanations
│   │   ├── db/           # Async MongoDB connection & Food seeds
│   │   ├── models/       # Pydantic schemas
│   │   └── main.py       # FastAPI application
│   ├── tests/            # Pytest suite for calculation engines
│   └── requirements.txt
├── frontend/             # React Native Expo app (14 screens)
├── docs/                 # Architecture & design specs
└── README.md
```

---

## 📊 Free-Tier & Zero-Cost Infrastructure
SmartCal is built 100% using zero-cost/free-tier tools:
- **Backend**: Render / Local Server (Free)
- **Database**: MongoDB Atlas Free Tier (512MB M0 Cluster)
- **AI**: Gemini API Free Tier (`gemini-2.5-flash`)
- **Frontend**: Expo Application (Free)

---

## 📄 License
MIT License
