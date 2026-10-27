'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { SearchProvider, useSearch } from '@/context/SearchContext';
import { EvaluationProvider } from '@/context/EvaluationContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function InnerAppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  // Protect private application routes server-side session check
  useEffect(() => {
    if (!isLoading && !user && !isAuthRoute) {
      const destination = pathname ? `/login?next=${encodeURIComponent(pathname)}` : '/login';
      router.replace(destination);
    }
  }, [isLoading, user, isAuthRoute, pathname, router]);

  // If on login or signup route, render clean auth layout without app shell
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Loading state while verifying server session
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F2] text-[#26332F]">
        <div className="w-8 h-8 border-2 border-[#527C70] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-[#68756F]">Verifying institutional session...</p>
      </div>
    );
  }

  // If unauthenticated on protected route, show transition state while redirect fires
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F2] text-[#26332F]">
        <p className="text-xs font-medium text-[#68756F]">Redirecting to secure login...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F7F2] font-sans text-[#26332F] antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <TopNav
          onOpenSidebar={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 bg-[#F7F7F2]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EvaluationProvider>
        <SearchProvider>
          <InnerAppShell>{children}</InnerAppShell>
        </SearchProvider>
      </EvaluationProvider>
    </AuthProvider>
  );
}
