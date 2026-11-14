import json
import logging
from typing import Dict, Any, Tuple
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

async def analyze_project(project_data: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """
    Analyzes the submitted project and produces very concise, short, bulleted market intelligence.
    Uses Gemini API if key is present, otherwise falls back to smart concise templates.
    """
    api_key = settings.GEMINI_API_KEY.strip() if settings.GEMINI_API_KEY else ""

    if api_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"
            prompt = f"""
You are a startup and innovation market analyst.
Analyze the following project. KEEP ALL TEXT VERY SHORT, SIMPLE, AND TO THE POINT.
NO LONG PARAGRAPHS. Maximum 1-2 short sentences per field or 2-3 short bullet points.

PROJECT DETAILS:
- Name: {project_data.get('name')}
- Category: {project_data.get('category')}
- Industry: {project_data.get('industry')}
- Type: {project_data.get('project_type')}
- Target Market: {project_data.get('target_market')}
- Target Audience: {project_data.get('target_audience')}
- Problem: {project_data.get('problem_statement')}
- Solution: {project_data.get('proposed_solution')}
- Budget: {project_data.get('estimated_budget')}

RETURN STRICTLY VALID JSON:
{{
  "market": {{
    "overview": "Short 1-2 sentence overview of the market demand.",
    "characteristics": ["Short point 1 (under 8 words)", "Short point 2", "Short point 3"],
    "audience": "Short 1-2 sentence summary of who is buying/using this.",
    "opportunities": ["Opportunity 1 (short)", "Opportunity 2 (short)", "Opportunity 3 (short)"],
    "challenges": ["Challenge 1 (short)", "Challenge 2 (short)", "Challenge 3 (short)"],
    "growth": "Short 1-2 sentence summary on market growth potential."
  }},
  "competitors": {{
    "landscape": "1 short sentence describing the competitive landscape.",
    "competition_level": "Low | Medium | High",
    "gap": "1 short sentence on what current competitors are missing.",
    "summary": "2 short sentences wrapping up market feasibility.",
    "list": [
      {{
        "name": "Competitor 1",
        "description": "1 short sentence about what they do.",
        "strengths": ["Strength 1 (short)", "Strength 2 (short)"],
        "weaknesses": ["Weakness 1 (short)", "Weakness 2 (short)"],
        "advantage": "Short 1-line advantage."
      }},
      {{
        "name": "Competitor 2",
        "description": "1 short sentence about what they do.",
        "strengths": ["Strength 1 (short)", "Strength 2 (short)"],
        "weaknesses": ["Weakness 1 (short)", "Weakness 2 (short)"],
        "advantage": "Short 1-line advantage."
      }}
    ]
  }}
}}
"""
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json", "temperature": 0.2}
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    raw = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                    data = json.loads(raw)
                    return data.get("market", {}), data.get("competitors", {})
        except Exception as e:
            logger.warning(f"AI API failed ({e}), using simple fallback.")

    return _fallback_simple_analysis(project_data)


def _fallback_simple_analysis(data: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    name = data.get("name", "Project")
    industry = data.get("industry", "Technology")
    ind = industry.lower()

    if any(k in ind for k in ["health", "med"]):
        comp_name1, comp_name2 = "Epic Systems", "Teladoc Health"
        chars = ["Strict medical compliance (HIPAA).", "High demand for automated clinical tools.", "Focus on reducing doctor burnout."]
        opps = ["Automated clinical documentation.", "Affordable clinic workflow tools.", "Remote patient assistance."]
        chals = ["Regulatory compliance approval.", "High customer acquisition cost.", "Integration with legacy medical software."]
    elif any(k in ind for k in ["ed", "learn", "study"]):
        comp_name1, comp_name2 = "Coursera", "Duolingo"
        chars = ["Growing demand for interactive learning.", "Shift toward mobile micro-learning.", "AI-powered adaptive study pacing."]
        opps = ["Personalized practice exercises.", "Direct career skill certifications.", "Gamified peer learning groups."]
        chals = ["Sustaining student engagement.", "Low completion rates.", "Willingness to pay by students."]
    elif any(k in ind for k in ["fin", "pay", "bank"]):
        comp_name1, comp_name2 = "Stripe", "Plaid"
        chars = ["Fast-moving open banking adoption.", "Strict security and fraud regulations.", "Shift to embedded mobile checkout."]
        opps = ["Automated SME bookkeeping.", "Lower fee micro-transactions.", "Instant cross-border settlement."]
        chals = ["Licensing and compliance.", "User trust for sensitive funds.", "High fraud prevention overhead."]
    else:
        comp_name1, comp_name2 = "Notion", "Linear"
        chars = ["Product-led self-serve adoption.", "Expectation of clean, fast user interface.", "Shift toward automated AI features."]
        opps = ["Simple lightweight workflows.", "Affordable pricing for smaller teams.", "Niche features built for specific users."]
        chals = ["Competition from big existing apps.", "Customer churn.", "Feature overload."]

    market = {
        "overview": f"The market for {name} in {industry} is growing steadily with strong demand for simpler, faster solutions.",
        "characteristics": chars,
        "audience": f"Primary target audience includes {data.get('target_audience', 'prospective users')} seeking to solve {data.get('problem_statement', 'current friction')[:60]}.",
        "opportunities": opps,
        "challenges": chals,
        "growth": f"Moderate to high growth driven by modern digital transformation in {industry}."
    }

    competitors = {
        "landscape": f"Competitive sector with established leaders and clear room for focused, simpler alternatives.",
        "competition_level": "Medium",
        "gap": "Existing leaders offer heavy, complex software, leaving room for a simpler, specialized solution.",
        "summary": f"{name} has a strong market entry angle by focusing on ease of use and direct problem-solving.",
        "list": [
            {
                "name": comp_name1,
                "description": f"Dominant player offering broad horizontal tools in {industry}.",
                "strengths": ["Large existing customer base", "Wide feature set"],
                "weaknesses": ["Steep learning curve", "High enterprise pricing"],
                "advantage": "Established brand presence"
            },
            {
                "name": comp_name2,
                "description": f"Popular modern platform known for speed and user experience in {industry}.",
                "strengths": ["Clean user interface", "Fast adoption"],
                "weaknesses": ["Limited custom enterprise integrations", "Higher price tier"],
                "advantage": "Strong user loyalty"
            }
        ]
    }

    return market, competitors

