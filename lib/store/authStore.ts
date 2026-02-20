import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'doctor' | 'assistant';
    phone?: string;
    doctorInfo?: {
        specialization?: string;
        qualification?: string;
        registrationNumber?: string;
        chamberName?: string;
        chamberAddress?: string;
    };
    doctorId?: string;
    isActive?: boolean;
    lastLogin?: string;
    subscription?: {
        plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
        startDate?: string;
        endDate?: string;
        isActive: boolean;
        maxAssistants?: number;
    };
    id?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string, remember?: boolean) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

// Helper to set/remove auth cookies for Next.js middleware
function setAuthCookies(token: string, role: string) {
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `auth-role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookies() {
    document.cookie = 'auth-token=; path=/; max-age=0';
    document.cookie = 'auth-role=; path=/; max-age=0';
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (user: User, token: string, remember: boolean = true) => {
                if (typeof window !== 'undefined') {
                    if (remember) {
                        localStorage.setItem('token', token);
                        sessionStorage.removeItem('token');
                    } else {
                        sessionStorage.setItem('token', token);
                        localStorage.removeItem('token');
                    }
                    localStorage.setItem('user', JSON.stringify(user));
                    // Set cookies for Next.js middleware auth checks
                    setAuthCookies(token, user.role);
                }
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    localStorage.removeItem('user');
                    clearAuthCookies();
                }
                set({ user: null, token: null, isAuthenticated: false });
            },
            updateUser: (user) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(user));
                    // Update role cookie in case role changed
                    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    if (token) {
                        setAuthCookies(token, user.role);
                    }
                }
                set({ user });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
