import React, { useState, useEffect } from 'react';
import { User, Project } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { SubmitPage } from './pages/SubmitPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { MarketPage } from './pages/MarketPage';
import { CompetitorsPage } from './pages/CompetitorsPage';
import { ReportPage } from './pages/ReportPage';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // Restore authenticated session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('app_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('app_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('app_user', JSON.stringify(user));
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('app_user');
    setSelectedProjectId(null);
    setCurrentTab('home');
  };

  const handleProjectSubmitted = (project: Project) => {
    setSelectedProjectId(project.id);
    setCurrentTab('market');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // IF NOT AUTHENTICATED: Display ONLY the Auth Page
  if (!currentUser) {
    return <AuthPage onSuccess={handleLoginSuccess} />;
  }

  // AUTHENTICATED WORKSPACE
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedProjectId={selectedProjectId}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            onStart={() => {
              setCurrentTab('submit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewProjects={() => {
              setCurrentTab('projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'submit' && (
          <SubmitPage
            currentUser={currentUser}
            onSuccess={handleProjectSubmitted}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsPage
            currentUser={currentUser}
            onSelectProject={(id) => setSelectedProjectId(id)}
            onNavigateSubmit={() => {
              setCurrentTab('submit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateMarket={(id) => {
              setSelectedProjectId(id);
              setCurrentTab('market');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateCompetitors={(id) => {
              setSelectedProjectId(id);
              setCurrentTab('competitors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateReport={(id) => {
              setSelectedProjectId(id);
              setCurrentTab('report');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'market' && selectedProjectId && (
          <MarketPage
            projectId={selectedProjectId}
            onNavigateCompetitors={() => {
              setCurrentTab('competitors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateReport={() => {
              setCurrentTab('report');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'competitors' && selectedProjectId && (
          <CompetitorsPage
            projectId={selectedProjectId}
            onNavigateMarket={() => {
              setCurrentTab('market');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateReport={() => {
              setCurrentTab('report');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'report' && selectedProjectId && (
          <ReportPage
            projectId={selectedProjectId}
            onNavigateMarket={() => {
              setCurrentTab('market');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateCompetitors={() => {
              setCurrentTab('competitors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
