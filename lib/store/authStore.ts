import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'doctor' | 'assistant';
    phone?: string;
    doctorInfo?: any;
    doctorId?: string;
    subscription?: any;
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
                }
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
                set({ user: null, token: null, isAuthenticated: false });
            },
            updateUser: (user) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(user));
                }
                set({ user });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
