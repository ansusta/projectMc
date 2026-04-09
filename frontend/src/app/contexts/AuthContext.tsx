import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../../services/auth.service';

export type UserRole = 'visitor' | 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  updateRole: (role: UserRole) => void;
  updateUser: (data: Partial<User>) => void;
}

const roleMap: Record<string, UserRole> = {
  client: 'customer',
  vendeur: 'vendor',
  admin: 'admin',
};

const TOKEN_KEY = 'auth-token';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);

    // Persist token for API calls
    localStorage.setItem(TOKEN_KEY, data.session.access_token);

    const mappedRole: UserRole = roleMap[data.role] || 'customer';
    const loggedUser: User = {
      id: data.userId,
      name: data.nomUtilisateur || data.email?.split('@')[0] || 'Utilisateur',
      email: data.email,
      role: mappedRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
    };

    setUser(loggedUser);
    localStorage.setItem('auth_user', JSON.stringify(loggedUser));
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'customer') => {
    // Map frontend role to backend role
    const backendRole = role === 'vendor' ? 'vendeur' : role === 'admin' ? 'admin' : 'client';
    
    // 1. Inscription
    await authService.register(name, email, password, backendRole);

    // 2. Tentative d'auto-connexion
    try {
      await login(email, password);
    } catch (loginError) {
      console.warn("Auto-login failed after registration:", loginError);
      // On ne jette pas l'erreur d'inscription si seule la connexion échoue (ex: confirmation email requise)
      throw new Error("Inscription réussie ! Veuillez vous connecter manuellement (vérifiez vos emails si nécessaire).");
    }
  };

  const logout = () => {
    authService.logout().catch(() => { });
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const updateRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      localStorage.setItem('auth_user', JSON.stringify(updated));
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('auth_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
