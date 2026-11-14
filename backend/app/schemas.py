from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# User Auth Schemas
class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True

# Project Schemas
class ProjectCreate(BaseModel):
    name: str
    category: str
    project_type: str
    description: str
    problem_statement: str
    proposed_solution: str
    target_audience: str
    target_market: str
    industry: str
    estimated_budget: str
    available_resources: str
    project_objectives: str
    category_data: Optional[Dict[str, Any]] = Field(default_factory=dict)
    user_id: Optional[int] = None

class ProjectResponse(ProjectCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectListItem(BaseModel):
    id: int
    name: str
    category: str
    project_type: str
    industry: str
    created_at: datetime

    class Config:
        from_attributes = True

# Market Analysis Schema
class MarketResponse(BaseModel):
    id: int
    project_id: int
    overview: str
    characteristics: List[str]
    audience: str
    opportunities: List[str]
    challenges: List[str]
    growth: str
    created_at: datetime

    class Config:
        from_attributes = True

# Competitor Schema
class CompetitorItem(BaseModel):
    name: str
    description: str
    strengths: List[str]
    weaknesses: List[str]
    advantage: str

class CompetitorResponse(BaseModel):
    project_id: int
    landscape: str
    competition_level: str
    gap: str
    competitors: List[CompetitorItem]

# Full Report Schema
class ReportResponse(BaseModel):
    project: ProjectResponse
    market: Optional[MarketResponse]
    competitor_data: Optional[CompetitorResponse]
    summary: str

