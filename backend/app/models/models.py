from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    signals = relationship("AlternativeSignals", back_populates="user", uselist=False, cascade="all, delete-orphan")
    predictions = relationship("CreditPrediction", back_populates="user", cascade="all, delete-orphan")
    assessments = relationship("RiskAssessment", back_populates="user", cascade="all, delete-orphan")
    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")

class AlternativeSignals(Base):
    __tablename__ = "alternative_signals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    monthly_savings_rate = Column(Float, nullable=False)
    rent_delays = Column(Integer, nullable=False)
    utility_delays = Column(Integer, nullable=False)
    active_subscriptions = Column(Integer, nullable=False)
    debt_to_income = Column(Float, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="signals")

class CreditPrediction(Base):
    __tablename__ = "credit_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    credit_score = Column(Integer, nullable=False)
    probability = Column(Float, nullable=False)
    shap_contributions_json = Column(String, nullable=False)  # JSON-encoded array of feature impacts
    calculated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="predictions")

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    raw_responses_json = Column(String, nullable=False)  # JSON-encoded responses key-value map
    risk_tier = Column(String, nullable=False)  # 'Conservative', 'Moderate', 'Aggressive'
    assessed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="assessments")

class Portfolio(Base):
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    risk_tier = Column(String, nullable=False)
    allocation_bonds = Column(Float, nullable=False)
    allocation_etfs = Column(Float, nullable=False)
    allocation_equities = Column(Float, nullable=False)
    allocation_crypto = Column(Float, nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="portfolios")
