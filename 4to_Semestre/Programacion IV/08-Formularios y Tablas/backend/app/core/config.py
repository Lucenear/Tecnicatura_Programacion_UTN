import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./food_store.db")
PORT = int(os.getenv("PORT", 8000))
