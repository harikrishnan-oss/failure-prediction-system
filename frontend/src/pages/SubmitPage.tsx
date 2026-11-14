import React, { useState } from 'react';
import { api } from '../api';
import { User, Project } from '../types';
import { Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface SubmitPageProps {
  currentUser: User | null;
  onSuccess: (project: Project) => void;
}

export const SubmitPage: React.FC<SubmitPageProps> = ({ currentUser, onSuccess }) => {
  const [category, setCategory] = useState('Startup');
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState('Web / SaaS App');
  const [industry, setIndustry] = useState('Technology');
  const [targetMarket, setTargetMarket] = useState('Global');
  const [estimatedBudget, setEstimatedBudget] = useState('$10,000 - $25,000');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [availableResources, setAvailableResources] = useState('');
  const [projectObjectives, setProjectObjectives] = useState('');

  // Category specific single field
  const [catDetail, setCatDetail] = useState('Pre-Seed Stage');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillSample = () => {
    setName('QuickDoctor AI');
    setCategory('Startup');
    setProjectType('Mobile & Web App');
    setIndustry('Healthcare');
    setTargetMarket('North America');
    setEstimatedBudget('$30,000');
    setDescription('An AI-driven mobile assistant that helps patients pre-triage symptoms and schedule immediate virtual doctor visits.');
    setProblemStatement('Patients wait over 45 minutes on average for basic triage and emergency room check-ins.');
    setProposedSolution('Instant smart conversational triage that routes severe cases to on-call doctors in under 2 minutes.');
    setTargetAudience('Young professionals and families needing quick primary care.');
    setAvailableResources('2 developers, telemedicine API license, cloud hosting.');
    setProjectObjectives('Launch MVP in 3 months and onboard 500 patient users.');
    setCatDetail('Pre-Seed / Seeking Angel Investment');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !description.trim() || !problemStatement.trim() || !proposedSolution.trim()) {
      setError('Please fill in the project name, description, problem, and solution.');
      return;
    }

    setLoading(true);
    try {
      const created = await api.createProject({
        name,
        category,
        project_type: projectType,
        industry,
        target_market: targetMarket,
        estimated_budget: estimatedBudget,
        description,
        problem_statement: problemStatement,
        proposed_solution: proposedSolution,
        target_audience: targetAudience || 'General Consumers',
        available_resources: availableResources || 'Core Team & Tools',
        project_objectives: projectObjectives || 'Launch MVP',
        category_data: { detail: catDetail },
        user_id: currentUser ? currentUser.id : undefined,
      });
      onSuccess(created);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Submit Your Project Idea</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill in your concept details below to get instant market and competitor intelligence.
          </p>
        </div>

        <button
          type="button"
          onClick={fillSample}
          className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 flex items-center space-x-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fill Demo Idea</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Category Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Select Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {['Startup', 'College Project', 'Hackathon', 'Business Proposal', 'Innovation', 'Other'].map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                  category === c
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. QuickDoctor AI"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Type</label>
            <input
              type="text"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              placeholder="e.g. Web App, Mobile App, Hardware"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Industry Sector</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Healthcare, EdTech, FinTech"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Geography</label>
            <input
              type="text"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              placeholder="e.g. North America, Global, Local"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description, Problem, Solution */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Description *</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief 1-2 sentence description of what your project does..."
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Statement *</label>
            <textarea
              rows={2}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="What main problem or pain point are you solving?"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Solution *</label>
            <textarea
              rows={2}
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              placeholder="How does your solution solve this problem?"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Audience & Budget Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. University students, Outpatient doctors"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget</label>
            <input
              type="text"
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              placeholder="e.g. $10,000 or Bootstrapped"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Available Resources</label>
            <input
              type="text"
              value={availableResources}
              onChange={(e) => setAvailableResources(e.target.value)}
              placeholder="e.g. 2 developers, cloud API"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Objectives</label>
            <input
              type="text"
              value={projectObjectives}
              onChange={(e) => setProjectObjectives(e.target.value)}
              placeholder="e.g. Launch MVP in 3 months"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dynamic Category Field */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {category} Parameter ({category === 'Startup' ? 'Funding / Revenue Stage' : category === 'College Project' ? 'Academic Department / Mentor' : category === 'Hackathon' ? 'Track Theme & Deadline' : 'Key Milestone'})
          </label>
          <input
            type="text"
            value={catDetail}
            onChange={(e) => setCatDetail(e.target.value)}
            placeholder="Additional context for this category..."
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Market & Competitors...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit & Analyze</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

