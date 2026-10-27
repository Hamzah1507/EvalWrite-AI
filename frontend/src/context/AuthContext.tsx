'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_demo: boolean;
  created_at: string;
}

export interface DemoStatus {
  is_seeded: boolean;
  demo_email?: string | null;
  demo_password_hint?: string | null;
  environment: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  demoStatus: DemoStatus | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (fullName: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoStatus, setDemoStatus] = useState<DemoStatus | null>(null);
  const router = useRouter();

  // Fetch current user from server session (HttpOnly cookie)
  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // sends and receives HttpOnly session cookie
      });

      if (res.ok) {
        const data: User = await res.json();
        setUser(data);
        return data;
      } else {
        setUser(null);
        return null;
      }
    } catch {
      // Server unreachable or network error
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize user session and demo status on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (isMounted) {
          if (res.ok) {
            const data: User = await res.json();
            setUser(data);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      try {
        const resDemo = await fetch(`${API_BASE}/api/auth/demo-status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (isMounted && resDemo.ok) {
          const data: DemoStatus = await resDemo.json();
          setDemoStatus(data);
        }
      } catch {
        // Non-fatal if offline
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || 'Authentication failed. Please verify credentials.');
    }

    setUser(data);
    return data;
  };

  const signup = async (fullName: string, email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || 'Registration failed. Please check your details.');
    }

    setUser(data);
    return data;
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch {
      // Best-effort logout on network issue
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        demoStatus,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
