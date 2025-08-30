import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          location: string | null;
          role: 'customer' | 'seller' | 'electrician';
          verified: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string | null;
          location?: string | null;
          role?: 'customer' | 'seller' | 'electrician';
          verified?: boolean;
          avatar_url?: string | null;
        };
        Update: {
          name?: string;
          phone?: string | null;
          location?: string | null;
          role?: 'customer' | 'seller' | 'electrician';
          verified?: boolean;
          avatar_url?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          brand: string;
          images: string[];
          seller_id: string;
          stock: number;
          sold: number;
          specifications: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category: string;
          brand: string;
          images?: string[];
          seller_id: string;
          stock: number;
          specifications?: Record<string, any>;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          brand?: string;
          images?: string[];
          stock?: number;
          specifications?: Record<string, any>;
        };
      };
      electricians: {
        Row: {
          id: string;
          specialties: string[];
          experience_years: number;
          rating: number;
          review_count: number;
          certifications: string[];
          service_areas: string[];
          base_rate: number;
          onsite_rate: number;
          availability: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          specialties?: string[];
          experience_years: number;
          certifications?: string[];
          service_areas?: string[];
          base_rate: number;
          onsite_rate: number;
          availability?: string[];
        };
        Update: {
          specialties?: string[];
          experience_years?: number;
          certifications?: string[];
          service_areas?: string[];
          base_rate?: number;
          onsite_rate?: number;
          availability?: string[];
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          electrician_id: string;
          base_price: number;
          onsite_price: number;
          duration: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          category: string;
          electrician_id: string;
          base_price: number;
          onsite_price: number;
          duration: string;
          active?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          category?: string;
          base_price?: number;
          onsite_price?: number;
          duration?: string;
          active?: boolean;
        };
      };
      bookings: {
        Row: {
          id: string;
          service_id: string;
          customer_id: string;
          electrician_id: string;
          booking_type: 'in-shop' | 'on-site';
          customer_location: string | null;
          scheduled_date: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          price: number;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          service_id: string;
          customer_id: string;
          electrician_id: string;
          booking_type: 'in-shop' | 'on-site';
          customer_location?: string | null;
          scheduled_date: string;
          price: number;
          notes?: string;
        };
        Update: {
          booking_type?: 'in-shop' | 'on-site';
          customer_location?: string | null;
          scheduled_date?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          price?: number;
          notes?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          product_id: string;
          seller_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          delivery_address: string;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          product_id: string;
          seller_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          delivery_address: string;
          estimated_delivery?: string | null;
        };
        Update: {
          quantity?: number;
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          delivery_address?: string;
          estimated_delivery?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          reviewer_id: string;
          reviewee_id: string | null;
          product_id: string | null;
          order_id: string | null;
          booking_id: string | null;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          reviewer_id: string;
          reviewee_id?: string | null;
          product_id?: string | null;
          order_id?: string | null;
          booking_id?: string | null;
          rating: number;
          comment?: string;
        };
        Update: {
          rating?: number;
          comment?: string;
        };
      };
    };
  };
}