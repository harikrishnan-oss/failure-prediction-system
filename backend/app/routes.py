import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import User, Project, MarketAnalysis, Competitor
from app.schemas import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    ProjectCreate,
    ProjectResponse,
    ProjectListItem,
    MarketResponse,
    CompetitorResponse,
    CompetitorItem,
    ReportResponse
)
from app.ai_service import analyze_project

logger = logging.getLogger(__name__)
api_router = APIRouter(prefix="/api")

# ----------------- AUTH ROUTES -----------------
@api_router.post("/auth/register", response_model=UserResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered. Please log in.")
    
    user = User(
        email=req.email.lower().strip(),
        password=req.password, # For academic prototype, clean direct store
        full_name=req.full_name.strip()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@api_router.post("/auth/login", response_model=UserResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return user

# ----------------- PROJECT ROUTES -----------------
@api_router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    try:
        # 1. Create project
        project = Project(
            user_id=data.user_id,
            name=data.name,
            category=data.category,
            project_type=data.project_type,
            description=data.description,
            problem_statement=data.problem_statement,
            proposed_solution=data.proposed_solution,
            target_audience=data.target_audience,
            target_market=data.target_market,
            industry=data.industry,
            estimated_budget=data.estimated_budget,
            available_resources=data.available_resources,
            project_objectives=data.project_objectives,
            category_data=data.category_data or {},
            status="completed"
        )
        db.add(project)
        db.flush()

        # 2. Run concise analysis
        proj_dict = {
            "name": project.name,
            "category": project.category,
            "project_type": project.project_type,
            "description": project.description,
            "problem_statement": project.problem_statement,
            "proposed_solution": project.proposed_solution,
            "target_audience": project.target_audience,
            "target_market": project.target_market,
            "industry": project.industry,
            "estimated_budget": project.estimated_budget
        }
        market_res, comp_res = await analyze_project(proj_dict)

        # 3. Store market analysis
        m = MarketAnalysis(
            project_id=project.id,
            overview=market_res.get("overview", "Market demand is growing."),
            characteristics=market_res.get("characteristics", []),
            audience=market_res.get("audience", project.target_audience),
            opportunities=market_res.get("opportunities", []),
            challenges=market_res.get("challenges", []),
            growth=market_res.get("growth", "Steady positive growth.")
        )
        db.add(m)

        # 4. Store competitors
        landscape = comp_res.get("landscape", "Active market with clear opportunity.")
        comp_level = comp_res.get("competition_level", "Medium")
        gap = comp_res.get("gap", "Room for a simpler, specialized solution.")

        for c in comp_res.get("list", []):
            comp = Competitor(
                project_id=project.id,
                name=c.get("name", "Competitor"),
                description=c.get("description", "Industry peer."),
                strengths=c.get("strengths", []),
                weaknesses=c.get("weaknesses", []),
                advantage=c.get("advantage", "Brand presence"),
                landscape=landscape,
                competition_level=comp_level,
                gap=gap
            )
            db.add(comp)

        db.commit()
        db.refresh(project)
        return project

    except Exception as e:
        db.rollback()
        logger.error(f"Error creating project: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/projects", response_model=List[ProjectListItem])
def list_projects(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Project)
    if user_id:
        q = q.filter(Project.user_id == user_id)
    return q.order_by(desc(Project.created_at)).all()

@api_router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p

# ----------------- ANALYSIS ROUTES -----------------
@api_router.get("/projects/{project_id}/market", response_model=MarketResponse)
def get_market(project_id: int, db: Session = Depends(get_db)):
    m = db.query(MarketAnalysis).filter(MarketAnalysis.project_id == project_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Market analysis not found")
    return m

@api_router.get("/projects/{project_id}/competitors", response_model=CompetitorResponse)
def get_competitors(project_id: int, db: Session = Depends(get_db)):
    comps = db.query(Competitor).filter(Competitor.project_id == project_id).all()
    if not comps:
        raise HTTPException(status_code=404, detail="Competitor analysis not found")
    
    first = comps[0]
    items = [
        CompetitorItem(
            name=c.name,
            description=c.description,
            strengths=c.strengths,
            weaknesses=c.weaknesses,
            advantage=c.advantage
        ) for c in comps
    ]

    return CompetitorResponse(
        project_id=project_id,
        landscape=first.landscape or "Active market landscape.",
        competition_level=first.competition_level or "Medium",
        gap=first.gap or "Room for direct problem solver.",
        competitors=items
    )

@api_router.get("/projects/{project_id}/report", response_model=ReportResponse)
def get_report(project_id: int, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    m = db.query(MarketAnalysis).filter(MarketAnalysis.project_id == project_id).first()
    comps = db.query(Competitor).filter(Competitor.project_id == project_id).all()

    comp_resp = None
    summary_text = f"Summary for {p.name}: The project addresses a clear problem in {p.industry}. Target competition is moderate, offering an opportunity to capture users with a focused, simpler solution."

    if comps:
        first = comps[0]
        items = [
            CompetitorItem(
                name=c.name,
                description=c.description,
                strengths=c.strengths,
                weaknesses=c.weaknesses,
                advantage=c.advantage
            ) for c in comps
        ]
        comp_resp = CompetitorResponse(
            project_id=project_id,
            landscape=first.landscape or "Active market landscape.",
            competition_level=first.competition_level or "Medium",
            gap=first.gap or "Room for simpler solution.",
            competitors=items
        )

    return ReportResponse(
        project=p,
        market=m,
        competitor_data=comp_resp,
        summary=summary_text
    )

@api_router.get("/health")
def health():
    return {"status": "ok"}

