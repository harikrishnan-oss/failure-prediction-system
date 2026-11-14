import asyncio
import json
import httpx

BASE_URL = "http://127.0.0.1:8000"

async def test_full_pipeline():
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=30.0) as client:
        # 1. Health Check
        print("Testing GET /api/health...")
        res = await client.get("/api/health")
        print("Health response:", res.status_code, res.json())
        assert res.status_code == 200

        # 2. Submit Project
        print("\nTesting POST /api/projects...")
        sample_project = {
            "name": "NeuroLearn AI",
            "category": "College Project",
            "project_type": "Interactive Web Platform",
            "description": "An adaptive neural learning platform that personalizes STEM education exercises using real-time pupil tracking and cognitive load estimation.",
            "problem_statement": "Students experience cognitive fatigue and disorientation during online asynchronous lectures without real-time adaptive pacing.",
            "proposed_solution": "Webcam-based gaze & pupil dilation estimator that adjusts exercise difficulty and injects interactive micro-breaks.",
            "target_audience": "University students and online certification learners",
            "target_market": "Higher Education E-Learning Sector",
            "industry": "EdTech / Human-Computer Interaction",
            "estimated_budget": "$5,000 Capstone Grant",
            "available_resources": "Python OpenCV, TensorFlow Lite, FastAPI, React",
            "project_objectives": "Publish research paper and complete working prototype with 85% engagement retention",
            "category_specific_data": {
                "degree_program": "M.S. in Cognitive Computing",
                "academic_mentor": "Dr. Elena Rostova",
                "academic_year": "2026 Senior Thesis"
            },
            "user_email": "student@university.edu",
            "user_name": "Marcus Vance"
        }
        res = await client.post("/api/projects", json=sample_project)
        print("Create project status:", res.status_code)
        project_data = res.json()
        print("Created Project ID:", project_data.get("id"), "Status:", project_data.get("status"))
        assert res.status_code == 201
        project_id = project_data["id"]

        # 3. Get Project by ID
        print(f"\nTesting GET /api/projects/{project_id}...")
        res = await client.get(f"/api/projects/{project_id}")
        assert res.status_code == 200
        print("Project Name:", res.json().get("name"))

        # 4. List Projects
        print("\nTesting GET /api/projects...")
        res = await client.get("/api/projects")
        assert res.status_code == 200
        projects_list = res.json()
        print(f"Total projects in database: {len(projects_list)}")
        assert any(p["id"] == project_id for p in projects_list)

        # 5. Market Analysis
        print(f"\nTesting GET /api/projects/{project_id}/market-analysis...")
        res = await client.get(f"/api/projects/{project_id}/market-analysis")
        assert res.status_code == 200
        market = res.json()
        print("Target Market Overview preview:", market["target_market_overview"][:80], "...")
        print("Characteristics count:", len(market["market_characteristics"]))
        print("Opportunities count:", len(market["market_opportunities"]))
        print("Challenges count:", len(market["industry_challenges"]))

        # 6. Competitor Analysis
        print(f"\nTesting GET /api/projects/{project_id}/competitors...")
        res = await client.get(f"/api/projects/{project_id}/competitors")
        assert res.status_code == 200
        comp_data = res.json()
        print("Market Competition Level:", comp_data["market_competition_level"])
        print("Competitors profiled:", len(comp_data["competitors"]))
        for c in comp_data["competitors"]:
            print(f" - {c['name']}: {c['description'][:60]}...")

        # 7. Combined Analysis
        print(f"\nTesting GET /api/projects/{project_id}/analysis...")
        res = await client.get(f"/api/projects/{project_id}/analysis")
        assert res.status_code == 200
        print("Combined analysis keys:", list(res.json().keys()))

        # 8. Full Report
        print(f"\nTesting GET /api/projects/{project_id}/report...")
        res = await client.get(f"/api/projects/{project_id}/report")
        assert res.status_code == 200
        report = res.json()
        print("Report Title:", report["project_name"])
        print("Report Summary & Insights:", report["summary_and_insights"][:100], "...")

        print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())

