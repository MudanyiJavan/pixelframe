import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery?: string;
  seller: string;
  deliveryAddress: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            name,
            images
          ),
          profiles:seller_id (
            name
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders: Order[] = data.map((item: any) => ({
        id: item.id,
        productName: item.products?.name || 'Unknown Product',
        productImage: item.products?.images?.[0] || 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
        price: item.total_price,
        quantity: item.quantity,
        status: item.status,
        orderDate: item.created_at,
        estimatedDelivery: item.estimated_delivery,
        seller: item.profiles?.name || 'Unknown Seller',
        deliveryAddress: item.delivery_address
      }));

      setOrders(formattedOrders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    productId: string;
    sellerId: string;
    quantity: number;
    unitPrice: number;
    deliveryAddress: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // 7 days from now

      const { error } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          product_id: orderData.productId,
          seller_id: orderData.sellerId,
          quantity: orderData.quantity,
          unit_price: orderData.unitPrice,
          total_price: orderData.unitPrice * orderData.quantity,
          delivery_address: orderData.deliveryAddress,
          estimated_delivery: estimatedDelivery.toISOString().split('T')[0]
        });

      if (error) throw error;
      await fetchOrders(); // Refresh orders list
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder
  };
};