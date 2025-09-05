import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockServices } from '../data/mockData';
import { Service } from '../types';
import { mockServices } from '../data/mockData';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Use mock data if Supabase is not configured
        setServices(mockServices);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            electricians (
              rating,
              review_count,
              profiles (
                name,
                location,
                verified
              )
            )
          `)
          .eq('active', true);

        if (error) throw error;
        setServices(data || []);
      } catch (fetchError) {
        // If fetch fails, fall back to mock data
        console.warn('Supabase fetch failed, using mock data:', fetchError);
        setServices(mockServices);
      }
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedServices: Service[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        basePrice: item.base_price,
        onSitePrice: item.onsite_price,
        electricianId: item.electrician_id,
        electricianName: item.electricians?.profiles?.name || 'Unknown Electrician',
        electricianRating: item.electricians?.rating || 0,
        electricianImage: item.electricians?.profiles?.avatar_url || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
        duration: item.duration,
        availability: ['Mon-Fri: 8AM-6PM', 'Sat: 9AM-4PM'] // TODO: Get from electrician profile
      }));

      setServices(formattedServices);
    } catch (err: any) {
      console.warn('Error fetching services, using mock data:', error);
      setServices(mockServices);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: {
    serviceId: string;
    electricianId: string;
    type: 'in-shop' | 'on-site';
    location?: string;
    scheduledDate: string;
    price: number;
    notes?: string;
  }) => {
    try {
      if (!supabase) throw new Error('Database not configured');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('bookings')
        .insert({
          service_id: bookingData.serviceId,
          customer_id: user.id,
          electrician_id: bookingData.electricianId,
          booking_type: bookingData.type,
          customer_location: bookingData.location,
          scheduled_date: bookingData.scheduledDate,
          price: bookingData.price,
          notes: bookingData.notes || ''
        });

      if (error) throw error;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    createBooking
  };
};