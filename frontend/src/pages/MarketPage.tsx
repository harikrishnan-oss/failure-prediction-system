import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Project, MarketData } from '../types';
import { TrendingUp, Users, FileText, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface MarketPageProps {
  projectId: number;
  onNavigateCompetitors: () => void;
  onNavigateReport: () => void;
}

export const MarketPage: React.FC<MarketPageProps> = ({
  projectId,
  onNavigateCompetitors,
  onNavigateReport,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getProject(projectId), api.getMarket(projectId)])
      .then(([p, m]) => {
        setProject(p);
        setMarket(m);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-slate-500 text-sm">
        Loading simple market intelligence...
      </div>
    );
  }

  if (!project || !market) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <p className="text-sm text-slate-600">No market data found for this project.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      
      {/* Project Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              {project.category}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{project.industry} • {project.target_market}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateCompetitors}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1"
          >
            <span>Competitors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNavigateReport}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
          >
            Report
          </button>
        </div>
      </div>

      {/* 1. Target Market Overview */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
          1. Target Market Overview
        </span>
        <p className="text-sm text-slate-800 leading-relaxed font-medium">
          {market.overview}
        </p>
      </div>

      {/* 2. Market Characteristics */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          2. Key Market Characteristics
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {market.characteristics.map((c, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800 font-medium">
              • {c}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Target Audience */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block">
          3. Target Audience
        </span>
        <p className="text-sm text-slate-800 leading-relaxed font-medium">
          {market.audience}
        </p>
      </div>

      {/* 4 & 5: Opportunities & Challenges in 2 crisp side-by-side cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Opportunities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
            4. Market Opportunities
          </span>
          <div className="space-y-1.5 pt-1">
            {market.opportunities.map((o, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-medium">
                ✔ {o}
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
            5. Industry Challenges
          </span>
          <div className="space-y-1.5 pt-1">
            {market.challenges.map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-rose-50 text-rose-900 text-xs font-medium">
                ⚠ {c}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Growth Potential */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
          6. Market Growth Potential
        </span>
        <p className="text-sm text-slate-800 leading-relaxed font-medium">
          {market.growth}
        </p>
      </div>

      {/* Next step button */}
      <div className="text-center pt-2">
        <button
          onClick={onNavigateCompetitors}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center space-x-1.5"
        >
          <span>Continue to Competitor Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

