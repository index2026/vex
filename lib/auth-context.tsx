'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, School, AuthState } from './types';
import { mockUsers, mockSchools, mockPasswords } from './mock-data';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'vexlap_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    school: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuthState({
          user: parsed.user,
          school: parsed.school,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.email === email);
    
    if (!user) {
      return { success: false, error: 'البريد الإلكتروني غير مسجل' };
    }

    const correctPassword = mockPasswords[email];
    if (password !== correctPassword) {
      return { success: false, error: 'كلمة المرور غير صحيحة' };
    }

    const school = user.tenantId ? mockSchools.find((s) => s.id === user.tenantId) : null;

    const newState = {
      user,
      school: school || null,
      isAuthenticated: true,
      isLoading: false,
    };

    setAuthState(newState);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, school }));

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      user: null,
      school: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const getRedirectPath = useCallback(() => {
    if (!authState.user) return '/login';

    switch (authState.user.role) {
      case 'super_admin':
        return '/super-admin';
      case 'school_admin':
        return '/school-admin';
      case 'teacher':
        return '/teacher';
      case 'security':
        return '/gate';
      default:
        return '/login';
    }
  }, [authState.user]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        getRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
