from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False, default="Project User")
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="user")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    project_type = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    proposed_solution = Column(Text, nullable=False)
    target_audience = Column(Text, nullable=False)
    target_market = Column(String(255), nullable=False)
    industry = Column(String(150), nullable=False)
    estimated_budget = Column(String(100), nullable=False)
    available_resources = Column(Text, nullable=False)
    project_objectives = Column(Text, nullable=False)
    category_data = Column(JSON, default=dict, nullable=False)
    status = Column(String(50), default="completed", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="projects")
    market = relationship("MarketAnalysis", back_populates="project", uselist=False, cascade="all, delete-orphan")
    competitors = relationship("Competitor", back_populates="project", cascade="all, delete-orphan")

class MarketAnalysis(Base):
    __tablename__ = "market_analyses"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    overview = Column(Text, nullable=False)
    characteristics = Column(JSON, default=list, nullable=False)
    audience = Column(Text, nullable=False)
    opportunities = Column(JSON, default=list, nullable=False)
    challenges = Column(JSON, default=list, nullable=False)
    growth = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="market")

class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    strengths = Column(JSON, default=list, nullable=False)
    weaknesses = Column(JSON, default=list, nullable=False)
    advantage = Column(Text, nullable=False)
    landscape = Column(Text, nullable=True)
    competition_level = Column(String(50), default="Medium")
    gap = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="competitors")

