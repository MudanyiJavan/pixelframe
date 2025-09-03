import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'electrician';
  phone?: string;
  location?: string;
  verified?: boolean;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    role: 'customer' | 'seller' | 'electrician';
    experience?: number;
    specialties?: string[];
    baseRate?: number;
    onSiteRate?: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      // If Supabase is not configured, just set loading to false
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Only set up auth listener if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        try {
          if (session?.user) {
            await fetchUserProfile(session.user);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      if (!supabase) return;
      
      const { data: profile, error } = await supabase
        .from('profiles')
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: supabaseUser.email!,
          role: profile.role,
          phone: profile.phone,
          location: profile.location,
          verified: profile.verified,
          avatar_url: profile.avatar_url
        });
      } else {
        // No profile found, create a minimal user object
        setUser({
          id: supabaseUser.id,
          name: supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email!,
          role: 'customer',
          verified: false
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Create a fallback user object on error
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email!,
        role: 'customer',
        verified: false
      });
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Database not configured');
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    role: 'customer' | 'seller' | 'electrician';
    experience?: number;
    specialties?: string[];
    baseRate?: number;
    onSiteRate?: number;
  }) => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Database not configured');
      
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name,
          phone: userData.phone,
          location: userData.location,
          role: userData.role,
          verified: userData.role === 'customer' // Auto-verify customers
        });

      if (profileError) throw profileError;

      // If electrician, create electrician profile
      if (userData.role === 'electrician' && userData.experience && userData.baseRate && userData.onSiteRate) {
        const { error: electricianError } = await supabase
          .from('electricians')
          .insert({
            id: authData.user.id,
            experience_years: userData.experience,
            specialties: userData.specialties || [],
            base_rate: userData.baseRate,
            onsite_rate: userData.onSiteRate,
            service_areas: userData.location ? [userData.location] : []
          });

        if (electricianError) throw electricianError;
      }

    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    if (!supabase) throw new Error('Database not configured');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          phone: updates.phone,
          location: updates.location
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};