"""
Suggestion Engine Module for SmartCal
Generates deterministic daily insight suggestions based on profile, target adherence,
remaining macros, and remaining budget.
"""

from typing import Dict, Any, List

def generate_daily_suggestions(
    target_cal: float,
    consumed_cal: float,
    burned_cal: float,
    target_protein: float,
    consumed_protein: float,
    daily_budget_inr: float,
    spent_budget_inr: float,
    goal: str = "maintenance"
) -> Dict[str, Any]:
    """
    Analyzes today's daily log metrics and constructs concise, non-medical actionable insights.
    """
    net_consumed = max(0.0, consumed_cal - burned_cal)
    remaining_cal = max(0.0, target_cal - net_consumed)
    remaining_protein = max(0.0, target_protein - consumed_protein)
    remaining_budget = max(0.0, daily_budget_inr - spent_budget_inr)

    insights: List[str] = []

    # Calorie status analysis
    cal_percentage = (consumed_cal / target_cal) * 100.0 if target_cal > 0 else 0
    if cal_percentage < 50.0:
        insights.append(f"You have {round(remaining_cal)} kcal left for today. Make sure to fuel up with a balanced meal.")
    elif cal_percentage > 105.0 and goal == "weight_loss":
        insights.append(f"You have reached your target calorie limit for today ({round(consumed_cal)} kcal consumed).")
    else:
        insights.append(f"On track! You have {round(remaining_cal)} kcal remaining today.")

    # Protein status analysis
    if remaining_protein > 15.0:
        insights.append(f"You are currently {round(remaining_protein)}g short on your daily protein target ({round(target_protein)}g).")
    else:
        insights.append(f"Great job! You have hit or are close to your protein target ({round(consumed_protein)}g logged).")

    # Budget status analysis
    if remaining_budget > 0:
        insights.append(f"Your remaining food budget for today is ₹{round(remaining_budget, 1)}.")

    headline = f"You have about {round(remaining_cal)} kcal and {round(remaining_protein)}g protein remaining. With ₹{round(remaining_budget)} left in today's food budget, check out your best meal options below."

    return {
        "headline": headline,
        "insights": insights,
        "remaining_cal": round(remaining_cal, 1),
        "remaining_protein_g": round(remaining_protein, 1),
        "remaining_budget_inr": round(remaining_budget, 1)
    }
