"""
Database Connection & Seed Initializer for SmartCal
Handles MongoDB Motor async client connection with graceful in-memory fallback.
"""

import os
import logging
from typing import Dict, Any, List, Optional
try:
    from app.db.food_seed import INDIAN_FOOD_SEED
except ImportError:
    from backend.app.db.food_seed import INDIAN_FOOD_SEED

logger = logging.getLogger("smartcal.db")

class InMemoryDatabase:
    """
    Fallback mock database storing collections in-memory when MongoDB URI is unreachable.
    """
    def __init__(self):
        self.collections: Dict[str, List[Dict[str, Any]]] = {
            "users": [],
            "profiles": [],
            "foods": list(INDIAN_FOOD_SEED),
            "meals": [],
            "activities": [],
            "daily_logs": [],
            "price_snapshots": [],
            "ai_conversations": []
        }

    async def get_foods(self, query: Optional[str] = None) -> List[Dict[str, Any]]:
        if not query:
            return self.collections["foods"]
        q_clean = query.lower()
        res = []
        for food in self.collections["foods"]:
            if q_clean in food["name"].lower() or any(q_clean in a.lower() for a in food.get("aliases", [])):
                res.append(food)
        return res

    async def find_food_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        q_clean = name.strip().lower()
        for food in self.collections["foods"]:
            if food["name"].lower() == q_clean or q_clean in food["name"].lower() or any(q_clean == a.lower() for a in food.get("aliases", [])):
                return food
        return None

# Global DB instance
in_memory_db = InMemoryDatabase()
motor_client = None
db = None

async def init_db():
    global motor_client, db
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/smartcal")
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        motor_client = AsyncIOMotorClient(mongo_uri, serverSelectionTimeoutMS=2000)
        # Verify connection
        await motor_client.admin.command('ping')
        db = motor_client.get_database()
        logger.info(f"Connected successfully to MongoDB Atlas / Local MongoDB: {mongo_uri}")
    except Exception as e:
        logger.warning(f"Could not connect to live MongoDB ({e}). Falling back to InMemoryDatabase for zero-cost seamless operation.")
        db = in_memory_db

def get_db():
    return db if db is not None else in_memory_db
