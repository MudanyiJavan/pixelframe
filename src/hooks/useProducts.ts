import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockProducts } from '../data/mockData';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Use mock data if Supabase is not configured
        setProducts(mockProducts);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            profiles:seller_id (
              name,
              location,
              verified
            )
          `)
          .gt('stock', 0) // Only show products in stock
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (fetchError) {
        // If fetch fails, fall back to mock data
        console.warn('Supabase fetch failed, using mock data:', fetchError);
        setProducts(mockProducts);
      }

      const formattedProducts: Product[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        brand: item.brand,
        images: item.images.length > 0 ? item.images : ['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg'],
        sellerId: item.seller_id,
        sellerName: item.profiles?.name || 'Unknown Seller',
        stock: item.stock,
        sold: item.sold,
        rating: 4.5, // TODO: Calculate from reviews
        reviewCount: 0, // TODO: Count from reviews
        specifications: item.specifications || {},
        inStock: item.stock > 0
      }));

      setProducts(formattedProducts);
    } catch (err: any) {
      console.warn('Error fetching products, using mock data:', error);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    specifications?: Record<string, any>;
    images?: string[];
  }) => {
    try {
      if (!supabase) throw new Error('Database not configured');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('products')
        .insert({
          ...productData,
          seller_id: user.id
        });

      if (error) throw error;
      await fetchProducts(); // Refresh products list
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      if (!supabase) throw new Error('Database not configured');
      
      const { error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          category: updates.category,
          brand: updates.brand,
          stock: updates.stock,
          specifications: updates.specifications,
          images: updates.images
        })
        .eq('id', productId);

      if (error) throw error;
      await fetchProducts(); // Refresh products list
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      if (!supabase) throw new Error('Database not configured');
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      await fetchProducts(); // Refresh products list
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};