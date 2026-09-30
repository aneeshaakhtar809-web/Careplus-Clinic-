'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IUser, IPatient, IDoctor, UserRole } from '@/types';

interface AuthContextType {
  user: IUser | null;
  profile: IPatient | IDoctor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, requestedRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [profile, setProfile] = useState<IPatient | IDoctor | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setProfile(data.profile || null);
          return;
        }
      }
      setUser(null);
      setProfile(null);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string, requestedRole?: UserRole) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, requestedRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      setProfile(data.profile || null);
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message || 'Network error during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: Record<string, unknown>) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      setProfile(data.profile || null);
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message || 'Network error during registration' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setProfile(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
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
