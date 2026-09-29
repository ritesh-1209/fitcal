"""
Activity Calorie Engine Module for SmartCal
Uses MET-based estimation: Calories/min = MET * 3.5 * body_weight_kg / 200
Result is explicitly labeled: "Estimated Calories Burned"
"""

from typing import Dict, Any, Optional

MET_DATASET: Dict[str, Dict[str, float]] = {
    "walking": {
        "light": 2.8,
        "moderate": 3.5,
        "vigorous": 4.5
    },
    "running": {
        "light": 7.0,
        "moderate": 9.0,
        "vigorous": 11.5
    },
    "cycling": {
        "light": 4.0,
        "moderate": 6.8,
        "vigorous": 10.0
    },
    "swimming": {
        "light": 4.5,
        "moderate": 7.0,
        "vigorous": 10.0
    },
    "gym": {
        "light": 3.5,
        "moderate": 5.0,
        "vigorous": 7.5
    },
    "weight_lifting": {
        "light": 3.5,
        "moderate": 5.0,
        "vigorous": 7.0
    },
    "yoga": {
        "light": 2.5,
        "moderate": 3.3,
        "vigorous": 4.0
    },
    "sports": {
        "light": 5.0,
        "moderate": 7.0,
        "vigorous": 9.5
    },
    "badminton": {
        "light": 4.5,
        "moderate": 5.5,
        "vigorous": 7.0
    },
    "cricket": {
        "light": 3.8,
        "moderate": 5.0,
        "vigorous": 6.5
    },
    "football": {
        "light": 6.0,
        "moderate": 8.0,
        "vigorous": 10.0
    },
    "stairs": {
        "light": 6.0,
        "moderate": 8.0,
        "vigorous": 11.0
    },
    "household": {
        "light": 2.3,
        "moderate": 3.3,
        "vigorous": 4.5
    },
    "jump_rope": {
        "light": 8.0,
        "moderate": 10.0,
        "vigorous": 12.3
    }
}

def get_activity_met(activity: str, intensity: str = "moderate") -> float:
    """
    Returns the MET value for a given activity and intensity.
    Falls back to moderate MET 4.0 if activity is unknown.
    """
    act_clean = activity.strip().lower().replace(" ", "_")
    int_clean = intensity.strip().lower()

    if act_clean in MET_DATASET:
        return MET_DATASET[act_clean].get(int_clean, MET_DATASET[act_clean]["moderate"])
    
    # Partial match fallback
    for k, v in MET_DATASET.items():
        if k in act_clean or act_clean in k:
            return v.get(int_clean, v["moderate"])

    return 4.0  # Default moderate MET fallback

def calculate_calories_burned(activity: str, duration_minutes: float, weight_kg: float, intensity: str = "moderate") -> Dict[str, Any]:
    """
    Calculates estimated calories burned using standard MET formula.
    MET * 3.5 * weight_kg / 200 * duration_minutes
    """
    met = get_activity_met(activity, intensity)
    cal_per_min = (met * 3.5 * weight_kg) / 200.0
    total_burned = round(cal_per_min * duration_minutes, 1)

    return {
        "activity": activity,
        "duration_minutes": duration_minutes,
        "intensity": intensity,
        "met_value": met,
        "calories_burned": total_burned,
        "disclaimer": "Estimated Calories Burned (MET formula)"
    }
