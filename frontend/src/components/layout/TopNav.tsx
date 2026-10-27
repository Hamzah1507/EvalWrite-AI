'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Menu,
  User,
  ChevronDown,
  Server,
  Database,
  LogOut,
  Shield,
} from 'lucide-react';
import { useEvaluation } from '@/context/EvaluationContext';
import { useAuth } from '@/context/AuthContext';

interface TopNavProps {
  onOpenSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Evaluation Overview',
    subtitle: 'Institutional assessment metrics, score distributions, and recent evaluations',
  },
  '/evaluate': {
    title: 'Evaluate Answer',
    subtitle: 'Submit descriptive student answers for rubric-based scoring and feedback',
  },
  '/rubrics': {
    title: 'Rubric Criteria Builder',
    subtitle: 'Define evaluation criteria, weightings, and performance levels',
  },
  '/history': {
    title: 'Submission History',
    subtitle: 'Search, audit, and filter evaluated student responses',
  },
  '/analytics': {
    title: 'Analytics & Insights',
    subtitle: 'Cohort score distributions, criteria mastery, and performance trends',
  },
};

export function TopNav({ onOpenSidebar, searchQuery, onSearchChange }: TopNavProps) {
  const pathname = usePathname();
  const pageInfo = PAGE_TITLES[pathname] || PAGE_TITLES['/'];
  const [profileOpen, setProfileOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const { backendStatus, showSampleData, setShowSampleData } = useEvaluation();
  const { user, logout } = useAuth();
  const isApiOnline = backendStatus.apiHealth === 'connected';

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'EW';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-[#E4E7E1] shadow-2xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-1 text-[#68756F] rounded-lg lg:hidden hover:text-[#26332F] hover:bg-[#EEF3F0]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#26332F] truncate tracking-tight">
            {pageInfo.title}
          </h1>
          <p className="hidden md:block text-xs text-[#68756F] truncate">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search, Data Toggle, Status, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Field */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68756F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search answers, rubrics..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] placeholder-[#68756F]/70 focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] transition-all"
          />
        </div>

        {/* Demonstration Mode Switcher */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E4E7E1] bg-[#F7F7F2] text-xs">
          <span className="text-[11px] text-[#68756F] font-medium hidden sm:inline">
            Sample Data:
          </span>
          <button
            onClick={() => setShowSampleData(!showSampleData)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              showSampleData
                ? 'bg-[#527C70] text-white shadow-2xs'
                : 'bg-slate-200 text-[#26332F] hover:bg-slate-300'
            }`}
            title="Toggle between demonstration records and live empty state"
          >
            {showSampleData ? 'Active' : 'Off (Live)'}
          </button>
        </div>

        {/* Backend API Status Popover Pill */}
        <div className="relative">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-[#E4E7E1] bg-[#F7F7F2] text-[#26332F] hover:bg-[#EEF3F0] transition-colors"
            title="Inspect backend capabilities and endpoints"
            aria-expanded={statusOpen}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isApiOnline ? 'bg-[#48735B]' : 'bg-[#B88738]'
              }`}
            />
            <span className="font-mono text-[11px]">
              API: {isApiOnline ? 'Connected' : 'Offline'}
            </span>
          </button>

          {statusOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setStatusOpen(false)}
              />
              <div className="absolute right-0 z-40 w-72 mt-2 bg-white border border-[#E4E7E1] rounded-xl shadow-lg p-3 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E4E7E1] pb-2">
                  <span className="font-bold text-[#26332F]">Backend Capabilities</span>
                  <span className="font-mono text-[10px] text-[#68756F]">127.0.0.1:8000</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Server className="w-4 h-4 text-[#48735B] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#26332F]">
                        FastAPI Service ({isApiOnline ? 'Reachable' : 'Offline'})
                      </div>
                      <p className="text-[11px] text-[#68756F]">
                        {isApiOnline
                          ? 'GET /health responded 200 OK.'
                          : 'Cannot reach http://127.0.0.1:8000.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-[#527C70] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#26332F]">Argon2id Authentication</div>
                      <p className="text-[11px] text-[#68756F]">
                        Active HttpOnly session validation on FastAPI.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Database className="w-4 h-4 text-[#68756F] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#26332F]">Data Persistence</div>
                      <p className="text-[11px] text-[#68756F]">
                        User accounts stored in SQLite (evalwrite.db).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E4E7E1] text-[10px] text-[#68756F] flex items-center justify-between">
                  <span>EvalWrite AI Core</span>
                  <span>FastAPI + Next.js</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon */}
        <button
          className="relative p-2 text-[#68756F] rounded-lg hover:text-[#26332F] hover:bg-[#EEF3F0] transition-colors"
          aria-label="Notifications"
          title="System notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#527C70]" />
        </button>

        <div className="h-5 w-px bg-[#E4E7E1] hidden sm:block" />

        {/* Profile Area */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#EEF3F0]/60 transition-colors"
            aria-expanded={profileOpen}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EEF3F0] text-[#3F655A] border border-[#D5DFDA] font-semibold text-xs shadow-2xs">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-semibold text-[#26332F] leading-tight">
                {user?.full_name || 'Academic Evaluator'}
              </span>
              <span className="block text-[10px] text-[#68756F] leading-tight">
                {user?.role || 'Evaluator'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#68756F] hidden lg:block" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 z-40 w-60 mt-2 bg-white border border-[#E4E7E1] rounded-xl shadow-lg py-1.5 text-xs">
                <div className="px-3.5 py-2.5 border-b border-[#E4E7E1]">
                  <p className="font-semibold text-[#26332F] truncate">
                    {user?.full_name || 'Academic Evaluator'}
                  </p>
                  <p className="text-[#68756F] text-[11px] truncate">
                    {user?.email || 'evaluator@evalwrite.edu'}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EEF3F0] text-[#3F655A] border border-[#D5DFDA]">
                      {user?.role || 'Lead Reviewer'}
                    </span>
                    {user?.is_demo && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FBF5EA] text-[#B88738] border border-[#F2E4CB]">
                        Local Demo
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-3.5 py-1.5 text-[11px] text-[#68756F] flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#68756F]" />
                    <span>Session: HttpOnly Cookie</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-[#E4E7E1]">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs text-[#A84B46] hover:bg-[#FBF0EF] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#A84B46]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
