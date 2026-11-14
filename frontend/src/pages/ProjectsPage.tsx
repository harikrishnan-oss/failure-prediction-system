import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ProjectListItem, Project, User } from '../types';
import { FolderKanban, PlusCircle, Search, X, Calendar } from 'lucide-react';

interface ProjectsPageProps {
  currentUser: User | null;
  onSelectProject: (id: number) => void;
  onNavigateSubmit: () => void;
  onNavigateMarket: (id: number) => void;
  onNavigateCompetitors: (id: number) => void;
  onNavigateReport: (id: number) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  currentUser,
  onSelectProject,
  onNavigateSubmit,
  onNavigateMarket,
  onNavigateCompetitors,
  onNavigateReport,
}) => {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const fetchList = () => {
    setLoading(true);
    api.getProjects(currentUser ? currentUser.id : undefined)
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, [currentUser]);

  const openDetails = async (id: number) => {
    try {
      const p = await api.getProject(id);
      setModalProject(p);
    } catch (err: any) {
      alert(`Could not load details: ${err.message}`);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.industry.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Submitted Projects</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentUser ? `Projects by ${currentUser.full_name}` : 'All recently submitted projects'}
          </p>
        </div>

        <button
          onClick={onNavigateSubmit}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project Idea</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, industry, category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">Loading projects...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700 text-sm">No projects found</p>
          <p className="text-xs text-slate-400">Submit your first idea to see market and competitor insights.</p>
          <button
            onClick={onNavigateSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Submit Idea
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {filtered.map((p) => (
            <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{p.name}</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    {p.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {p.project_type} • {p.industry} • {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openDetails(p.id)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    onSelectProject(p.id);
                    onNavigateMarket(p.id);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100"
                >
                  Market
                </button>
                <button
                  onClick={() => {
                    onSelectProject(p.id);
                    onNavigateCompetitors(p.id);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100"
                >
                  Competitors
                </button>
                <button
                  onClick={() => {
                    onSelectProject(p.id);
                    onNavigateReport(p.id);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {modalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{modalProject.name}</h3>
                <span className="text-xs text-slate-500">{modalProject.category} • {modalProject.industry}</span>
              </div>
              <button
                onClick={() => setModalProject(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900 block">Description:</span>
                <p className="bg-slate-50 p-2.5 rounded-lg mt-0.5">{modalProject.description}</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Problem:</span>
                <p className="bg-slate-50 p-2.5 rounded-lg mt-0.5">{modalProject.problem_statement}</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Solution:</span>
                <p className="bg-slate-50 p-2.5 rounded-lg mt-0.5">{modalProject.proposed_solution}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-slate-900 block">Target Audience:</span>
                  <p className="bg-slate-50 p-2 rounded-lg mt-0.5">{modalProject.target_audience}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Estimated Budget:</span>
                  <p className="bg-slate-50 p-2 rounded-lg mt-0.5">{modalProject.estimated_budget}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  const id = modalProject.id;
                  setModalProject(null);
                  onSelectProject(id);
                  onNavigateMarket(id);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                View Market Analysis
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

