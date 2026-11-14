import { User, Project, ProjectListItem, MarketData, CompetitorData, ReportData } from './types';

const API_BASE = 'http://127.0.0.1:8000/api';

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);
  if (!res.ok) {
    let err = 'Request failed';
    try {
      const data = await res.json();
      err = data.detail || err;
    } catch {}
    throw new Error(err);
  }
  return res.json();
}

export const api = {
  // Auth
  register: (full_name: string, email: string, password: string) =>
    req<User>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password }),
    }),

  login: (email: string, password: string) =>
    req<User>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  // Projects
  createProject: (data: Partial<Project>) =>
    req<Project>('/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getProjects: (userId?: number) =>
    req<ProjectListItem[]>(userId ? `/projects?user_id=${userId}` : '/projects'),

  getProject: (id: number) => req<Project>(`/projects/${id}`),

  // Intelligence & Reports
  getMarket: (id: number) => req<MarketData>(`/projects/${id}/market`),
  getCompetitors: (id: number) => req<CompetitorData>(`/projects/${id}/competitors`),
  getReport: (id: number) => req<ReportData>(`/projects/${id}/report`),
};

