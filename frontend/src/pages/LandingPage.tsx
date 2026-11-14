import React from 'react';
import { ArrowRight, Lightbulb, Users, FileText, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onViewProjects: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onViewProjects }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Smart Startup & Project Risk Analyzer
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Validate Your Ideas with Quick Market & Competitor Analysis
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Submit your startup idea, college project, hackathon concept, or business proposal. Get instant, simple, and clear insights on your target market and competitors.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <span>Submit Your Idea</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewProjects}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
          >
            Browse Submitted Projects
          </button>
        </div>
      </div>

      {/* 3 Simple Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Target Market Analysis</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Understand market size, buyer personas, growth potential, and key opportunities in short, clear summaries.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Competitor Benchmarks</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Identify existing alternatives, their main strengths, weaknesses, and your key opportunity to differentiate.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Executive 1-Page Report</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generate and print a clean, executive summary dossier for team presentations and evaluations.
          </p>
        </div>
      </div>

      {/* Who Can Submit */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <span className="font-semibold text-slate-800">Supports all innovation categories:</span>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-white border border-slate-200 rounded font-medium">Startups</span>
          <span className="px-2 py-1 bg-white border border-slate-200 rounded font-medium">College Projects</span>
          <span className="px-2 py-1 bg-white border border-slate-200 rounded font-medium">Hackathons</span>
          <span className="px-2 py-1 bg-white border border-slate-200 rounded font-medium">Business Proposals</span>
          <span className="px-2 py-1 bg-white border border-slate-200 rounded font-medium">Innovations</span>
        </div>
      </div>

    </div>
  );
};
