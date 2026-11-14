import React from 'react';
import { User } from '../types';
import { Home, PlusCircle, FolderKanban, TrendingUp, Users, FileText, User as UserIcon, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedProjectId: number | null;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedProjectId,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            RA
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base">Project Risk Analyzer</span>
            <span className="block text-[10px] text-slate-500 font-medium">Idea & Market Validation</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              currentTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setCurrentTab('submit')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              currentTab === 'submit' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Submit Idea
          </button>

          <button
            onClick={() => setCurrentTab('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              currentTab === 'projects' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Projects
          </button>

          {/* Project Specific Tabs */}
          {selectedProjectId && (
            <>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setCurrentTab('market')}
                className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  currentTab === 'market' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Market
              </button>

              <button
                onClick={() => setCurrentTab('competitors')}
                className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  currentTab === 'competitors' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Competitors
              </button>

              <button
                onClick={() => setCurrentTab('report')}
                className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  currentTab === 'report' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Report
              </button>
            </>
          )}
        </nav>

        {/* User Auth Section */}
        <div className="flex items-center space-x-2">
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
              <UserIcon className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-800">{currentUser.full_name}</span>
              <button
                onClick={onLogout}
                title="Logout"
                className="text-slate-400 hover:text-rose-600 ml-1 p-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentTab('auth')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
