import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_FILE = BASE_DIR / "food_store.db"
DEFAULT_DB_URL = f"sqlite:///{DB_FILE}"

raw_url = os.getenv("DATABASE_URL", DEFAULT_DB_URL)
if raw_url.startswith("sqlite:///./"):
    db_name = raw_url.replace("sqlite:///./", "")
    DATABASE_URL = f"sqlite:///{BASE_DIR / db_name}"
else:
    DATABASE_URL = raw_url

PORT = int(os.getenv("PORT", 8000))
SECRET_KEY = os.getenv("SECRET_KEY", "tp9_food_store_secret_key_programacion_iv")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
