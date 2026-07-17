import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Credit Compass"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretjwtkeyforcreditcompass2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 Hours
    
    # DB configuration
    DATABASE_URL: str = "sqlite:///./credit_compass.db"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "https://your-github-username.github.io"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
