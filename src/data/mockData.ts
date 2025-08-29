import { Product, ElectricianProfile, Service } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Latest flagship smartphone with advanced AI features and S Pen',
    price: 120000,
    category: 'Mobile Phones',
    brand: 'Samsung',
    images: ['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg'],
    sellerId: 'seller1',
    sellerName: 'TechHub Kenya',
    stock: 15,
    sold: 8,
    rating: 4.8,
    reviewCount: 24,
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'RAM': '12GB',
      'Storage': '256GB',
      'Camera': '200MP + 50MP + 12MP + 10MP'
    },
    inStock: true
  },
  {
    id: '2',
    name: 'Dell XPS 13 Core i7 11th Gen',
    description: 'Ultra-portable laptop perfect for professionals and students',
    price: 85000,
    category: 'Laptops & Computers',
    brand: 'Dell',
    images: ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg'],
    sellerId: 'seller2',
    sellerName: 'Nairobi Electronics',
    stock: 8,
    sold: 12,
    rating: 4.6,
    reviewCount: 18,
    specifications: {
      'Processor': 'Intel Core i7-1165G7',
      'RAM': '16GB DDR4',
      'Storage': '512GB SSD',
      'Display': '13.3" FHD+'
    },
    inStock: true
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-canceling wireless headphones',
    price: 28000,
    category: 'Audio & Video',
    brand: 'Sony',
    images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
    sellerId: 'seller3',
    sellerName: 'Audio World',
    stock: 0,
    sold: 25,
    rating: 4.9,
    reviewCount: 45,
    specifications: {
      'Type': 'Over-ear, Wireless',
      'Battery': '30 hours with ANC',
      'Driver': '30mm',
      'Connectivity': 'Bluetooth 5.2, USB-C'
    },
    inStock: false
  },
  {
    id: '4',
    name: 'LG 55" 4K Smart TV',
    description: 'Crystal clear 4K display with smart TV features',
    price: 65000,
    category: 'Home Appliances',
    brand: 'LG',
    images: ['https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg'],
    sellerId: 'seller1',
    sellerName: 'TechHub Kenya',
    stock: 5,
    sold: 3,
    rating: 4.7,
    reviewCount: 12,
    specifications: {
      'Screen Size': '55 inches',
      'Resolution': '4K UHD (3840x2160)',
      'Smart TV': 'webOS',
      'HDR': 'HDR10, Dolby Vision'
    },
    inStock: true
  }
];

export const mockElectricians: ElectricianProfile[] = [
  {
    id: 'elec1',
    name: 'John Mwangi',
    email: 'john.mwangi@gmail.com',
    phone: '+254712345678',
    specialties: ['TV Repair', 'Home Wiring', 'Appliance Installation'],
    experience: 8,
    rating: 4.9,
    reviewCount: 156,
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    certifications: ['Certified Electronics Technician', 'Home Wiring Specialist'],
    serviceAreas: ['Nairobi CBD', 'Westlands', 'Karen', 'Kilimani'],
    pricing: { baseRate: 2500, onSiteRate: 4000 }
  },
  {
    id: 'elec2',
    name: 'Grace Wanjiku',
    email: 'grace.wanjiku@gmail.com',
    phone: '+254723456789',
    specialties: ['Mobile Phone Repair', 'Computer Repair', 'Networking'],
    experience: 6,
    rating: 4.8,
    reviewCount: 98,
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
    certifications: ['Mobile Repair Specialist', 'Network+ Certified'],
    serviceAreas: ['Kasarani', 'Thika', 'Kiambu', 'Nairobi CBD'],
    pricing: { baseRate: 2000, onSiteRate: 3500 }
  },
  {
    id: 'elec3',
    name: 'David Kipkemoi',
    email: 'david.kipkemoi@gmail.com',
    phone: '+254734567890',
    specialties: ['Solar Installation', 'CCTV Setup', 'Smart Home Systems'],
    experience: 10,
    rating: 4.7,
    reviewCount: 203,
    avatar: 'https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg',
    certifications: ['Solar PV Installer', 'Security Systems Certified', 'Smart Home Expert'],
    serviceAreas: ['Karen', 'Lavington', 'Westlands', 'Kiambu'],
    pricing: { baseRate: 3000, onSiteRate: 5000 }
  }
];

export const mockServices: Service[] = [
  {
    id: 'service1',
    name: 'TV Repair & Diagnostics',
    description: 'Complete TV repair service for all brands - LCD, LED, OLED',
    category: 'TV Repair',
    basePrice: 2500,
    onSitePrice: 4000,
    electricianId: 'elec1',
    electricianName: 'John Mwangi',
    electricianRating: 4.9,
    electricianImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    duration: '2-3 hours',
    availability: ['Mon-Fri: 8AM-6PM', 'Sat: 9AM-4PM']
  },
  {
    id: 'service2',
    name: 'Mobile Phone Screen Replacement',
    description: 'Professional screen replacement for all smartphone brands',
    category: 'Phone Repair',
    basePrice: 2000,
    onSitePrice: 3500,
    electricianId: 'elec2',
    electricianName: 'Grace Wanjiku',
    electricianRating: 4.8,
    electricianImage: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
    duration: '1-2 hours',
    availability: ['Mon-Sat: 9AM-7PM', 'Sun: 10AM-4PM']
  },
  {
    id: 'service3',
    name: 'Solar Panel Installation',
    description: 'Complete solar power system installation and maintenance',
    category: 'Installation',
    basePrice: 15000,
    onSitePrice: 15000,
    electricianId: 'elec3',
    electricianName: 'David Kipkemoi',
    electricianRating: 4.7,
    electricianImage: 'https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg',
    duration: '1-2 days',
    availability: ['Mon-Fri: 7AM-5PM', 'Sat: By appointment']
  }
];