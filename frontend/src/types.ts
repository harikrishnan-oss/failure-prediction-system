export interface User {
  id: number;
  full_name: string;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  category: string;
  project_type: string;
  description: string;
  problem_statement: string;
  proposed_solution: string;
  target_audience: string;
  target_market: string;
  industry: string;
  estimated_budget: string;
  available_resources: string;
  project_objectives: string;
  category_data: Record<string, any>;
  status: string;
  created_at: string;
  user_id?: number;
}

export interface ProjectListItem {
  id: number;
  name: string;
  category: string;
  project_type: string;
  industry: string;
  created_at: string;
}

export interface MarketData {
  id: number;
  project_id: number;
  overview: string;
  characteristics: string[];
  audience: string;
  opportunities: string[];
  challenges: string[];
  growth: string;
}

export interface CompetitorItem {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  advantage: string;
}

export interface CompetitorData {
  project_id: number;
  landscape: string;
  competition_level: string;
  gap: string;
  competitors: CompetitorItem[];
}

export interface ReportData {
  project: Project;
  market?: MarketData;
  competitor_data?: CompetitorData;
  summary: string;
}

