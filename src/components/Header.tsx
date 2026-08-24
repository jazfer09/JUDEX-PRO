import React, { useState, useEffect } from 'react';
import { User, CategoryLevel, EventItem } from '../types';
import { CATEGORY_LABELS } from '../utils/formatters';
import { StorageService } from '../services/storage';
import {
  Award,
  ShieldCheck,
  UserCheck,
  Layers,
  ChevronDown,
  LogOut,
  RotateCcw,
  Sparkles,
  Check,
  Calendar,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  currentCategoryFilter: CategoryLevel | 'all';
  onSelectCategoryFilter: (category: CategoryLevel | 'all') => void;
  activeView: string;
  onChangeView: (view: string) => void;
  events: EventItem[];
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  onOpenLoginModal,
  onLogout,
  currentCategoryFilter,
  onSelectCategoryFilter,
  activeView,
  onChangeView,
  events,
  selectedEventId,
  onSelectEvent,
  onResetData,
}) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    setAllUsers(StorageService.getUsers());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const categories: Array<{ id: CategoryLevel | 'all'; label: string; count?: number }> = [
    { id: 'all', label: 'All Levels' },
    { id: 'elementary', label: 'Elementary' },
    { id: 'junior_high', label: 'Junior High School' },
    { id: 'senior_high', label: 'Senior High School' },
    { id: 'college', label: 'College' },
  ];

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#001f3f] text-white shadow-md border-b border-[#002d5c]">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#001f3f] flex items-center justify-center font-black shadow-md border border-white/20">
              <Award className="w-6 h-6 text-[#001f3f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-sans">
                  JUDEX <span className="text-sky-300 font-light">PRO</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#002d5c] text-sky-200 border border-[#003a7a]">
                  Tabulation System
                </span>
              </div>
              <p className="text-[11px] text-slate-300/80 hidden sm:block">
                Multi-Judge Scoring • Weighted Criteria • Real-time Rank Computation
              </p>
            </div>
          </div>

          {/* Event Selector (Compact) */}
          {events.length > 0 && (
            <div className="hidden lg:flex items-center gap-2 bg-[#002d5c] px-3 py-1.5 rounded-xl border border-[#003a7a]">
              <Calendar className="w-4 h-4 text-sky-300 shrink-0" />
              <span className="text-xs text-slate-200 font-medium">Active Event:</span>
              <select
                value={selectedEventId}
                onChange={(e) => onSelectEvent(e.target.value)}
                aria-label="Active Event Selection"
                className="bg-[#001f3f] text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#003a7a] focus:outline-none focus:border-sky-300 cursor-pointer max-w-[260px] truncate"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User Profile & Role Switcher */}
          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left transition cursor-pointer ${
                  currentUser.role === 'admin'
                    ? 'bg-[#002d5c] border-[#003a7a] text-white hover:bg-[#003a7a]'
                    : 'bg-[#002d5c] border-[#003a7a] text-white hover:bg-[#003a7a]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    currentUser.role === 'admin' ? 'bg-white text-[#001f3f]' : 'bg-sky-400 text-[#001f3f]'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    {currentUser.name}
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        currentUser.role === 'admin'
                          ? 'bg-white/20 text-sky-200 border border-white/30'
                          : 'bg-sky-400/20 text-sky-200 border border-sky-400/30'
                      }`}
                    >
                      {currentUser.role === 'admin' ? 'ADMIN' : 'JUDGE'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate max-w-[140px]">
                    {currentUser.title || currentUser.email}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              </button>

              {/* Quick Switch Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-[#001f3f] border border-[#003a7a] rounded-xl shadow-2xl z-50 p-2 text-white animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-[#002d5c] text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Quick Switch Profile</span>
                    <span className="text-[10px] text-sky-300 font-mono">{currentTime}</span>
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto space-y-1">
                    <div className="px-2 pt-1 text-[10px] font-bold uppercase text-slate-400">Admin Accounts</div>
                    {allUsers
                      .filter((u) => u.role === 'admin')
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#002d5c] text-left transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
                            <div>
                              <div className="font-semibold text-slate-100">{u.name}</div>
                              <div className="text-[10px] text-slate-300">{u.title || 'Admin'}</div>
                            </div>
                          </div>
                          {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-sky-300" />}
                        </button>
                      ))}

                    <div className="px-2 pt-2 text-[10px] font-bold uppercase text-slate-400">Judges (Multi-Judge)</div>
                    {allUsers
                      .filter((u) => u.role === 'judge')
                      .map((u, i) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#002d5c] text-left transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-sky-800 text-sky-200 text-[10px] font-bold flex items-center justify-center">
                              {i + 1}
                            </span>
                            <div>
                              <div className="font-semibold text-slate-100">{u.name}</div>
                              <div className="text-[10px] text-slate-300">{u.title || 'Judge'}</div>
                            </div>
                          </div>
                          {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-sky-300" />}
                        </button>
                      ))}
                  </div>

                  <div className="pt-2 border-t border-[#002d5c] flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenLoginModal();
                      }}
                      className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg text-sky-300 hover:bg-[#002d5c] flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Switch / Add Another Account
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onResetData();
                      }}
                      className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg text-amber-300 hover:bg-[#002d5c] flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Demo Data to Default
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg text-rose-300 hover:bg-[#002d5c] flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-[#001830] border-t border-[#002d5c] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 py-2">
          {/* Navigation Views */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {currentUser.role === 'judge' ? (
              <>
                <button
                  type="button"
                  onClick={() => onChangeView('judge_scoring')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'judge_scoring'
                      ? 'bg-white text-[#001f3f] shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-[#002d5c]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  My Judging Sheet
                </button>
                <button
                  type="button"
                  onClick={() => onChangeView('leaderboard')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'leaderboard'
                      ? 'bg-white text-[#001f3f] shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-[#002d5c]'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  Live Leaderboard & Ranks
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onChangeView('admin_events')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'admin_events'
                      ? 'bg-white text-[#001f3f] shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-[#002d5c]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Events & Criteria Weights
                </button>
                <button
                  type="button"
                  onClick={() => onChangeView('admin_contestants')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'admin_contestants'
                      ? 'bg-white text-[#001f3f] shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-[#002d5c]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Contestants
                </button>
                <button
                  type="button"
                  onClick={() => onChangeView('admin_judges')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'admin_judges'
                      ? 'bg-white text-[#001f3f] shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-[#002d5c]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Judges Progress
                </button>
                <button
                  type="button"
                  onClick={() => onChangeView('leaderboard')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'leaderboard'
                      ? 'bg-white text-[#001f3f] shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-[#002d5c]'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  Official Tabulation
                </button>
                <button
                  type="button"
                  onClick={() => onChangeView('judge_scoring')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'judge_scoring'
                      ? 'bg-white text-[#001f3f] shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-[#002d5c]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Judge Simulator
                </button>
              </>
            )}
          </div>

          {/* Category Level Filter Pills (Elementary, Junior High, Senior High, College) */}
          <div className="flex items-center gap-1 overflow-x-auto pt-1 md:pt-0">
            <span className="text-[11px] font-bold text-slate-300 mr-1 shrink-0 flex items-center gap-1">
              <Layers className="w-3 h-3 text-sky-300" />
              Category:
            </span>
            {categories.map((cat) => {
              const isSelected = currentCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#001f3f] font-bold shadow-xs'
                      : 'bg-[#002d5c]/70 text-slate-200 hover:bg-[#002d5c] hover:text-white border border-[#003a7a]/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
