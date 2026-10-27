'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck2,
  Sliders,
  History,
  BarChart3,
  ChevronRight,
  Database,
  Cpu,
  Radio,
  X,
  LogOut,
} from 'lucide-react';
import { useEvaluation } from '@/context/EvaluationContext';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview & assessment metrics',
  },
  {
    name: 'Evaluate Answer',
    href: '/evaluate',
    icon: FileCheck2,
    description: 'Rubric-based answer evaluation',
  },
  {
    name: 'Rubric Builder',
    href: '/rubrics',
    icon: Sliders,
    description: 'Criteria, levels & weightings',
  },
  {
    name: 'Submission History',
    href: '/history',
    icon: History,
    description: 'Audit trail & evaluated answers',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Cohort scores & criteria breakdown',
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { backendStatus } = useEvaluation();
  const { user, logout } = useAuth();
  const isApiOnline = backendStatus.apiHealth === 'connected';

  // Compute initials from user's full name
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
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#26332F]/30 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-white border-r border-[#E4E7E1] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#E4E7E1]">
          <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#527C70] text-white shadow-xs group-hover:bg-[#3F655A] transition-colors">
              <span className="font-serif font-bold text-base tracking-tight">EW</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-[#26332F] tracking-tight flex items-center gap-1.5">
                EvalWrite <span className="text-[#527C70] font-semibold">AI</span>
              </span>
              <span className="text-[11px] font-medium text-[#68756F] tracking-tight">
                Academic Assessment
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#68756F] hover:text-[#26332F] hover:bg-[#EEF3F0] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[11px] font-semibold tracking-wider text-[#68756F] uppercase">
            Platform Navigation
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#EEF3F0] text-[#3F655A] font-semibold shadow-2xs border-r-2 border-[#527C70]'
                    : 'text-[#68756F] hover:bg-[#F7F7F2] hover:text-[#26332F]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#527C70] text-white shadow-2xs'
                        : 'bg-slate-100/80 text-[#68756F] group-hover:text-[#527C70] group-hover:bg-[#EEF3F0]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="truncate leading-tight">{item.name}</p>
                    <p className="text-[11px] text-[#68756F]/80 font-normal truncate">
                      {item.description}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <ChevronRight className="w-4 h-4 text-[#527C70] shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Capabilities & Backend Status Box */}
        <div className="p-3 mx-3 mb-3 border border-[#E4E7E1] rounded-xl bg-[#F7F7F2] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#68756F] uppercase tracking-wider">
              System Services
            </span>
            <span className="font-mono text-[10px] text-[#68756F]">127.0.0.1:8000</span>
          </div>

          <div className="space-y-1.5 pt-1 text-[11px]">
            {/* 1. API Health */}
            <div className="flex items-center justify-between">
              <span className="text-[#68756F] flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#68756F]" />
                API Health
              </span>
              <span
                className={`font-medium flex items-center gap-1 ${
                  isApiOnline ? 'text-[#48735B]' : 'text-[#B88738]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isApiOnline ? 'bg-[#48735B]' : 'bg-[#B88738]'
                  }`}
                />
                {isApiOnline ? 'Connected' : 'Offline'}
              </span>
            </div>

            {/* 2. NLP Evaluation Endpoint */}
            <div className="flex items-center justify-between">
              <span className="text-[#68756F] flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-[#68756F]" />
                NLP Evaluator
              </span>
              <span className="text-[#68756F] font-medium bg-white px-1.5 py-0.5 rounded text-[10px] border border-[#E4E7E1]">
                Not Configured
              </span>
            </div>

            {/* 3. Database Persistence */}
            <div className="flex items-center justify-between">
              <span className="text-[#68756F] flex items-center gap-1.5">
                <Database className="w-3 h-3 text-[#68756F]" />
                Persistence
              </span>
              <span className="text-[#3F655A] font-medium bg-[#EEF3F0] px-1.5 py-0.5 rounded text-[10px] border border-[#D5DFDA]">
                SQLite (Auth)
              </span>
            </div>
          </div>
        </div>

        {/* User Workspace Info Footer with Sign Out */}
        <div className="p-3 border-t border-[#E4E7E1] bg-white">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EEF3F0] text-[#3F655A] font-bold text-xs border border-[#D5DFDA] shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#26332F] truncate">
                  {user?.full_name || 'Academic Evaluator'}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-[11px] text-[#68756F] truncate">
                    {user?.role || 'Evaluator'}
                  </p>
                  {user?.is_demo && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-semibold bg-[#EEF3F0] text-[#3F655A] border border-[#D5DFDA]">
                      Demo
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-[#68756F] hover:text-[#A84B46] hover:bg-[#FBF0EF] transition-colors shrink-0"
              title="Sign Out of EvalWrite"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
