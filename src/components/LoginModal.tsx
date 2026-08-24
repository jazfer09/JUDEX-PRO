import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';
import { ShieldCheck, UserCheck, KeyRound, LogIn, Sparkles, X, UserPlus } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  currentUser?: User;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('judge');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states for manual login or create
  const [emailInput, setEmailInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const admins = users.filter((u) => u.role === 'admin');
  const judges = users.filter((u) => u.role === 'judge');

  const handleQuickSelect = (user: User) => {
    StorageService.setCurrentUser(user);
    onLoginSuccess(user);
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === emailInput.trim().toLowerCase() &&
        (!u.passcode || u.passcode === passcodeInput.trim())
    );

    if (user) {
      StorageService.setCurrentUser(user);
      onLoginSuccess(user);
      onClose();
    } else {
      setErrorMessage('Invalid email or passcode. You can also pick from the Quick Select profiles below.');
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) {
      setErrorMessage('Please provide a name and email.');
      return;
    }

    const newUser = StorageService.addUser({
      name: nameInput.trim(),
      email: emailInput.trim(),
      role: selectedRoleTab,
      title: titleInput.trim() || (selectedRoleTab === 'admin' ? 'Event Administrator' : 'Official Judge'),
      passcode: passcodeInput.trim() || '1234',
    });

    setUsers(StorageService.getUsers());
    StorageService.setCurrentUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="login-modal-box"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden text-slate-900"
      >
        {/* Modal Header */}
        <div className="bg-[#001f3f] text-white p-5 flex items-center justify-between border-b border-[#002d5c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#002d5c] border border-[#003a7a] flex items-center justify-center text-white">
              <KeyRound className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Account Access & Role Selection</h3>
              <p className="text-xs text-slate-300">
                Log in as an <span className="text-sky-300 font-semibold">Event Admin</span> or{' '}
                <span className="text-sky-300 font-semibold">Official Judge</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#002d5c] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* 1-Click Quick Profile Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#001f3f]" />
                Quick 1-Click Profiles (Ready for Testing)
              </span>
            </div>

            {/* Admin Section */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#001f3f]" />
                Admin / Organizer Profiles (Can Add Events, Criteria % & Contestants):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {admins.map((admin) => (
                  <button
                    key={admin.id}
                    onClick={() => handleQuickSelect(admin)}
                    className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#001f3f] transition text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#001f3f] text-white font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                      ADM
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">{admin.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{admin.title || 'Event Admin'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Judges Section */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1">
                <UserCheck className="w-4 h-4 text-[#001f3f]" />
                Multiple Judge Profiles (Score & Evaluate Performances):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {judges.map((judge, idx) => (
                  <button
                    key={judge.id}
                    onClick={() => handleQuickSelect(judge)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#001f3f] transition text-left cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#002d5c] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      J{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">{judge.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{judge.departmentSchool || 'Judge'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold">Or Custom Login / Register</span>
            </div>
          </div>

          {/* Tab Switch: Login vs Create */}
          <div className="flex border border-slate-200 rounded-xl p-1 bg-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsCreatingNew(false);
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                !isCreatingNew ? 'bg-white text-[#001f3f] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Existing Account Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreatingNew(true);
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                isCreatingNew ? 'bg-white text-[#001f3f] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add / Register User
            </button>
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {errorMessage}
            </div>
          )}

          {!isCreatingNew ? (
            <form onSubmit={handleManualLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@tabulate.org or judge1@tabulate.org"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Passcode / PIN</label>
                <input
                  type="password"
                  placeholder="Enter passcode (e.g. admin123 or judge1)"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#001f3f] hover:bg-[#002d5c] text-white font-bold text-sm rounded-xl transition shadow-sm cursor-pointer"
              >
                Sign In to System
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateAccount} className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoleTab('judge')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                    selectedRoleTab === 'judge'
                      ? 'bg-slate-100 border-[#001f3f] text-[#001f3f]'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Judge Role
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoleTab('admin')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                    selectedRoleTab === 'admin'
                      ? 'bg-slate-100 border-[#001f3f] text-[#001f3f]'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Admin Role
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Judge Maria Santos"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. judge.maria@school.edu"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title / Affiliation (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Faculty / Dance Adjudicator"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Set Passcode</label>
                <input
                  type="password"
                  placeholder="e.g. 1234"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#001f3f] hover:bg-[#002d5c] text-white font-bold text-sm rounded-xl transition shadow-sm cursor-pointer"
              >
                Create and Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
