import React, { useState, useEffect } from 'react';
import { User, EventItem, CategoryLevel } from './types';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { JudgeScoringView } from './components/JudgeScoringView';
import { AdminEventsManager } from './components/AdminEventsManager';
import { AdminContestantsManager } from './components/AdminContestantsManager';
import { AdminJudgesManager } from './components/AdminJudgesManager';
import { TabulationLeaderboard } from './components/TabulationLeaderboard';
import { PrintTallySheet } from './components/PrintTallySheet';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [events, setEvents] = useState<EventItem[]>(() => StorageService.getEvents());
  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    const list = StorageService.getEvents();
    return list.length > 0 ? list[0].id : '';
  });

  const [categoryFilter, setCategoryFilter] = useState<CategoryLevel | 'all'>('all');
  const [activeView, setActiveView] = useState<string>(() =>
    currentUser.role === 'judge' ? 'judge_scoring' : 'leaderboard'
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [allJudges, setAllJudges] = useState<User[]>(() =>
    StorageService.getUsers().filter((u) => u.role === 'judge')
  );

  // Sync state helpers
  const refreshAppData = () => {
    const updatedEvents = StorageService.getEvents();
    setEvents(updatedEvents);
    const updatedJudges = StorageService.getUsers().filter((u) => u.role === 'judge');
    setAllJudges(updatedJudges);
    if (!updatedEvents.find((e) => e.id === selectedEventId) && updatedEvents.length > 0) {
      setSelectedEventId(updatedEvents[0].id);
    }
  };

  const handleSwitchUser = (newUser: User) => {
    setCurrentUser(newUser);
    StorageService.setCurrentUser(newUser);
    if (newUser.role === 'judge') {
      setActiveView('judge_scoring');
    } else {
      setActiveView('leaderboard');
    }
  };

  const handleLogout = () => {
    setIsLoginModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data to factory defaults? (This will restore standard pre-loaded events, contestants, and judges)')) {
      StorageService.resetToDefault();
      setCurrentUser(StorageService.getCurrentUser());
      refreshAppData();
      setCategoryFilter('all');
      setActiveView('leaderboard');
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Print view handler
  if (isPrintViewOpen && selectedEvent) {
    const data = StorageService.computeTabulation(selectedEvent.id, categoryFilter);
    return (
      <PrintTallySheet
        event={selectedEvent}
        categoryFilter={categoryFilter}
        results={data.results}
        assignedJudges={data.assignedJudges}
        onClose={() => setIsPrintViewOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-sky-200 selection:text-slate-900">
      {/* Main Header */}
      <Header
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        currentCategoryFilter={categoryFilter}
        onSelectCategoryFilter={setCategoryFilter}
        activeView={activeView}
        onChangeView={setActiveView}
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={setSelectedEventId}
        onResetData={handleResetData}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!selectedEvent ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">No Events Available</h2>
            <p className="text-xs text-slate-500 mt-2">
              Please click below to create your first competition event and set criteria weighting.
            </p>
            <button
              onClick={() => setActiveView('admin_events')}
              className="mt-4 px-5 py-2.5 bg-[#001f3f] hover:bg-[#002d5c] text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Go to Event Manager
            </button>
          </div>
        ) : (
          <>
            {activeView === 'judge_scoring' && (
              <JudgeScoringView
                currentUser={currentUser}
                event={selectedEvent}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                onScoreSubmitted={refreshAppData}
              />
            )}

            {activeView === 'admin_events' && (
              <AdminEventsManager
                events={events}
                onEventsUpdated={refreshAppData}
                allJudges={allJudges}
                selectedEventId={selectedEventId}
                onSelectEvent={setSelectedEventId}
              />
            )}

            {activeView === 'admin_contestants' && (
              <AdminContestantsManager
                event={selectedEvent}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                onContestantsUpdated={refreshAppData}
              />
            )}

            {activeView === 'admin_judges' && (
              <AdminJudgesManager
                event={selectedEvent}
                allJudges={allJudges}
                onJudgesUpdated={refreshAppData}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
              />
            )}

            {activeView === 'leaderboard' && (
              <TabulationLeaderboard
                event={selectedEvent}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                onOpenPrintView={() => setIsPrintViewOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#001f3f] border-t border-[#002d5c] py-6 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-semibold text-white">
            Judex Pro • Event Tabulation & Multi-Judge Scoring System
          </div>
          <div className="text-[11px] text-slate-300">
            Elementary • Junior High • Senior High • College Categories
          </div>
        </div>
      </footer>

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleSwitchUser}
        currentUser={currentUser}
      />
    </div>
  );
}
