"""
Pytest & Unittest Compatible Test Suite for SmartCal Engines
Tests BMR, TDEE, Goal Calories, Macro Targets, MET calculations, Unit conversions,
Nutrition aggregation, Budget meal optimizer, and Suggestion engine.
"""

import unittest
import sys
import os

# Ensure backend package is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.engines.calorie_engine import (
    calculate_bmr,
    calculate_tdee,
    calculate_goal_calories,
    calculate_macro_targets,
    calculate_remaining_calories
)
from backend.app.engines.nutrition_engine import (
    normalize_quantity_to_grams,
    calculate_item_nutrition,
    aggregate_meal_nutrition
)
from backend.app.engines.activity_engine import (
    get_activity_met,
    calculate_calories_burned
)
from backend.app.engines.budget_engine import generate_budget_meal_options
from backend.app.engines.suggestion_engine import generate_daily_suggestions

class TestSmartCalEngines(unittest.TestCase):

    def test_bmr_calculation(self):
        # Male: 70kg, 175cm, 25 years old
        bmr_male = calculate_bmr(70.0, 175.0, 25, "male")
        self.assertEqual(bmr_male, 1673.75)

        # Female: 60kg, 160cm, 28 years old
        bmr_female = calculate_bmr(60.0, 160.0, 28, "female")
        self.assertEqual(bmr_female, 1299.0)

    def test_tdee_and_goal_calories(self):
        bmr = 1600.0
        tdee_sedentary = calculate_tdee(bmr, "sedentary")
        self.assertEqual(tdee_sedentary, 1920.0)

        tdee_active = calculate_tdee(bmr, "very_active")
        self.assertEqual(tdee_active, 2760.0)

        # Weight loss (modest deficit)
        loss_cal = calculate_goal_calories(tdee_active, "weight_loss", "male")
        self.assertEqual(loss_cal, 2310.0)

        # Maintenance
        maint_cal = calculate_goal_calories(tdee_active, "maintenance", "male")
        self.assertEqual(maint_cal, 2760.0)

        # Weight gain (modest surplus)
        gain_cal = calculate_goal_calories(tdee_active, "weight_gain", "male")
        self.assertEqual(gain_cal, 3110.0)

    def test_macro_targets(self):
        goal_cal = 2000.0
        weight_kg = 70.0
        macros = calculate_macro_targets(goal_cal, weight_kg, "weight_loss")
        self.assertEqual(macros["protein_g"], 126.0)  # 70 * 1.8
        self.assertEqual(macros["fat_g"], 55.6)      # (2000 * 0.25) / 9
        self.assertTrue(macros["carbs_g"] > 0)
        self.assertEqual(macros["fiber_g"], 28.0)    # (2000/1000) * 14

    def test_activity_met_calories(self):
        # 70kg person running moderate for 30 minutes
        res = calculate_calories_burned("running", 30.0, 70.0, "moderate")
        self.assertEqual(res["calories_burned"], 330.8)
        self.assertIn("Estimated Calories Burned", res["disclaimer"])

    def test_nutrition_unit_conversions(self):
        g1 = normalize_quantity_to_grams(3, "piece") # 3 rotis = 120g
        self.assertEqual(g1, 120.0)

        g2 = normalize_quantity_to_grams(1, "bowl") # 1 bowl dal = 150g
        self.assertEqual(g2, 150.0)

        # Food record per 100g
        food_rec = {
            "name": "Soy Chunks",
            "calories": 345.0,
            "protein": 52.0,
            "carbs": 33.0,
            "fat": 0.5,
            "fiber": 13.0,
            "estimated_price_per_100g": 20.0
        }
        item_nutr = calculate_item_nutrition(food_rec, 50, "grams") # 50g
        self.assertEqual(item_nutr["protein"], 26.0)
        self.assertEqual(item_nutr["calories"], 172.5)
        self.assertEqual(item_nutr["estimated_cost_inr"], 10.0)

    def test_budget_engine_optimization(self):
        # Remaining cal = 800, protein = 40g, budget = 80 INR, Vegetarian
        options = generate_budget_meal_options(800.0, 40.0, 80.0, "vegetarian")
        self.assertTrue(len(options) > 0)
        first_opt = options[0]
        self.assertTrue(first_opt["estimated_cost_inr"] <= 85.0)
        self.assertTrue(first_opt["estimated_protein_g"] > 15.0)
        self.assertIn("sources", first_opt)

    def test_suggestion_engine(self):
        sug = generate_daily_suggestions(
            target_cal=2200.0,
            consumed_cal=1500.0,
            burned_cal=200.0,
            target_protein=120.0,
            consumed_protein=75.0,
            daily_budget_inr=100.0,
            spent_budget_inr=40.0,
            goal="weight_loss"
        )
        self.assertEqual(sug["remaining_cal"], 900.0)
        self.assertEqual(sug["remaining_protein_g"], 45.0)
        self.assertEqual(sug["remaining_budget_inr"], 60.0)
        self.assertIn("headline", sug)

if __name__ == "__main__":
    unittest.main()
