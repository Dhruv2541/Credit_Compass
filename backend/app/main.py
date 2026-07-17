from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine
from app.models.models import Base
from app.api import auth, credit, invest

# Initialize SQLite database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Explainable AI alternative credit scoring & micro-investment advisor",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes mounting
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(credit.router, prefix=f"{settings.API_V1_STR}/credit", tags=["Credit Prediction"])
app.include_router(invest.router, prefix=f"{settings.API_V1_STR}/investment", tags=["Investment Advisor"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Credit Compass API. Navigate to /docs for Swagger documentation."}
