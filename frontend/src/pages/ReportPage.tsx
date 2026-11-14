import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ReportData } from '../types';
import { Printer, ArrowLeft } from 'lucide-react';

interface ReportPageProps {
  projectId: number;
  onNavigateMarket: () => void;
  onNavigateCompetitors: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  projectId,
  onNavigateMarket,
  onNavigateCompetitors,
}) => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getReport(projectId)
      .then((data) => setReport(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-slate-500 text-sm">
        Generating summary report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <p className="text-sm text-slate-600">Report could not be generated.</p>
      </div>
    );
  }

  const { project, market, competitor_data, summary } = report;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      
      {/* Top Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateMarket}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Market View</span>
          </button>
          <button
            onClick={onNavigateCompetitors}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
          >
            Competitors
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print or Save PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 space-y-6 text-slate-900 print:border-none print:p-0">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Project Analysis Report
            </span>
            <span className="text-xs text-slate-400">
              {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{project.name}</h1>
          <p className="text-xs text-slate-500">{project.category} • {project.industry} • {project.target_market}</p>
        </div>

        {/* 1. Project Overview */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">1. Project Overview</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {project.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-bold block text-slate-900">Problem:</span>
              <p className="text-slate-600 mt-0.5">{project.problem_statement}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-bold block text-slate-900">Solution:</span>
              <p className="text-slate-600 mt-0.5">{project.proposed_solution}</p>
            </div>
          </div>
        </div>

        {/* 2. Target Market Summary */}
        {market && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">2. Target Market Intelligence</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {market.overview}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900">
                <span className="font-bold block mb-1">Key Opportunities:</span>
                <ul className="space-y-0.5">
                  {market.opportunities.map((o, i) => (
                    <li key={i}>✔ {o}</li>
                  ))}
                </ul>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-900">
                <span className="font-bold block mb-1">Industry Challenges:</span>
                <ul className="space-y-0.5">
                  {market.challenges.map((c, i) => (
                    <li key={i}>⚠ {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. Competitor Benchmarks */}
        {competitor_data && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">3. Competitor Analysis</h2>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Competition: {competitor_data.competition_level}
              </span>
            </div>
            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <strong>Market Gap:</strong> {competitor_data.gap}
            </p>

            <div className="space-y-2 pt-1">
              {competitor_data.competitors.map((c, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                    <span className="text-slate-500 font-medium">Advantage: {c.advantage}</span>
                  </div>
                  <p className="text-slate-600">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Strategic Summary & Insights */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
            Executive Summary & Verdict
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {summary}
          </p>
        </div>

      </div>

    </div>
  );
};
