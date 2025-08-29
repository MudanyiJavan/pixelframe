export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'electrician';
  avatar?: string;
  location?: string;
  phone?: string;
  verified?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  specifications: { [key: string]: string };
  inStock: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  onSitePrice: number;
  electricianId: string;
  electricianName: string;
  electricianRating: number;
  electricianImage?: string;
  duration: string;
  availability: string[];
}

export interface ElectricianProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  avatar?: string;
  certifications: string[];
  serviceAreas: string[];
  pricing: {
    baseRate: number;
    onSiteRate: number;
  };
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  electricianId: string;
  type: 'on-site' | 'in-shop';
  location?: string;
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
}

export const KENYA_LOCATIONS = [
  'Nairobi CBD',
  'Westlands',
  'Karen',
  'Kilimani',
  'Lavington',
  'Kasarani',
  'Thika',
  'Kiambu',
  'Nakuru',
  'Mombasa',
  'Kisumu',
  'Eldoret',
  'Machakos',
  'Meru',
  'Nyeri'
];

export const ELECTRONICS_CATEGORIES = [
  'Mobile Phones',
  'Laptops & Computers',
  'Audio & Video',
  'Gaming',
  'Home Appliances',
  'Cameras',
  'Accessories',
  'Smart Home',
  'Tablets',
  'Networking'
];