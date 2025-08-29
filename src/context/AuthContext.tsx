import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('pixelframe_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        role: (role as any) || 'customer',
        verified: role === 'electrician' ? true : false,
        rating: role === 'electrician' ? 4.8 : undefined,
        reviewCount: role === 'electrician' ? 127 : undefined
      };
      setUser(mockUser);
      localStorage.setItem('pixelframe_user', JSON.stringify(mockUser));
      setLoading(false);
    }, 1000);
  };

  const register = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        verified: userData.role === 'electrician' ? false : true, // Electricians need verification
        rating: userData.role === 'electrician' ? 0 : undefined,
        reviewCount: userData.role === 'electrician' ? 0 : undefined
      } as User;
      setUser(newUser);
      localStorage.setItem('pixelframe_user', JSON.stringify(newUser));
      setLoading(false);
    }, 1500);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pixelframe_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};