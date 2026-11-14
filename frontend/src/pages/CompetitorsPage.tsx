import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Project, CompetitorData } from '../types';
import { Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface CompetitorsPageProps {
  projectId: number;
  onNavigateMarket: () => void;
  onNavigateReport: () => void;
}

export const CompetitorsPage: React.FC<CompetitorsPageProps> = ({
  projectId,
  onNavigateMarket,
  onNavigateReport,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [compData, setCompData] = useState<CompetitorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getProject(projectId), api.getCompetitors(projectId)])
      .then(([p, c]) => {
        setProject(p);
        setCompData(c);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-slate-500 text-sm">
        Loading competitor analysis...
      </div>
    );
  }

  if (!project || !compData) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <p className="text-sm text-slate-600">No competitor data found for this project.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Competition: {compData.competition_level}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{project.industry} • Competitor Benchmarks</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateMarket}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
          >
            Market View
          </button>
          <button
            onClick={onNavigateReport}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1"
          >
            <span>View Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Overview & Market Gap Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Competitive Landscape
          </span>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {compData.landscape}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
            Identified Market Gap (Your Advantage)
          </span>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {compData.gap}
          </p>
        </div>
      </div>

      {/* Competitors List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Relevant Existing Competitors</h2>

        <div className="grid grid-cols-1 gap-4">
          {compData.competitors.map((comp, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900">{comp.name}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                  Direct Competitor
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">{comp.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900">
                  <span className="font-bold block mb-1">Strengths:</span>
                  <ul className="space-y-0.5">
                    {comp.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-900">
                  <span className="font-bold block mb-1">Weaknesses:</span>
                  <ul className="space-y-0.5">
                    {comp.weaknesses.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-xs text-slate-600 pt-1">
                <span className="font-bold text-slate-800">Their Advantage: </span>
                <span>{comp.advantage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button to view Report */}
      <div className="text-center pt-2">
        <button
          onClick={onNavigateReport}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center space-x-1.5"
        >
          <span>View 1-Page Summary Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

