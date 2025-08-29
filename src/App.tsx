import React, { useState, useMemo } from 'react';
import { Smartphone, Monitor, Zap, Star, TrendingUp, Shield } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ServiceCard } from './components/ServiceCard';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { ProductModal } from './components/ProductModal';
import { ProfileModal } from './components/ProfileModal';
import { OrdersModal } from './components/OrdersModal';
import { SellerDashboard } from './components/SellerDashboard';
import { CategoryFilter } from './components/CategoryFilter';
import { mockProducts, mockServices, mockElectricians } from './data/mockData';
import { Product, Service } from './types';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showSellerDashboard, setShowSellerDashboard] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredServices = useMemo(() => {
    return mockServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.electricianName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => b.electricianRating - a.electricianRating); // Sort by rating
  }, [searchQuery, selectedCategory]);

  const handleBookService = (service: Service) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (bookingData: any) => {
    console.log('Booking submitted:', bookingData);
    alert('Service booked successfully! The electrician will contact you soon.');
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    alert(`${product.name} added to cart!`);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onAuthClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowProfileModal(true)}
        onOrdersClick={() => setShowOrdersModal(true)}
        onSellerDashboardClick={() => setShowSellerDashboard(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              PixelFrame Kenya
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Your one-stop platform for electronics and professional electrical services across Kenya
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Smartphone className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Latest Electronics</h3>
                <p className="text-blue-100 text-sm">Phones, laptops, gadgets from top brands</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Zap className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Expert Services</h3>
                <p className="text-blue-100 text-sm">Certified electricians for all your needs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Shield className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
                <p className="text-blue-100 text-sm">Verified sellers and rated electricians</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8 inline-flex">
          <button
            onClick={() => {
              setActiveTab('products');
              setSelectedCategory('');
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Monitor className="h-5 w-5" />
            <span>Electronics</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('services');
              setSelectedCategory('');
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Zap className="h-5 w-5" />
            <span>Services</span>
          </button>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          activeTab={activeTab}
        />

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {activeTab === 'products' ? filteredProducts.length : filteredServices.length}
            </div>
            <div className="text-gray-600">Available {activeTab}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">Kenya</div>
            <div className="text-gray-600">Nationwide Coverage</div>
          </div>
        </div>

        {/* Content Grid */}
        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewProduct}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookService={handleBookService}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'products' && filteredProducts.length === 0) ||
          (activeTab === 'services' && filteredServices.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {activeTab === 'products' ? <Monitor className="h-16 w-16 mx-auto" /> : <Zap className="h-16 w-16 mx-auto" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No {activeTab} found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Top Electricians Section */}
      {activeTab === 'services' && (
        <section className="bg-white py-12 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Star className="h-6 w-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-gray-900">Top Rated Electricians</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockElectricians.slice(0, 3).map((electrician) => (
                <div key={electrician.id} className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 text-center">
                  <img
                    src={electrician.avatar}
                    alt={electrician.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-lg text-gray-800">{electrician.name}</h3>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{electrician.rating}</span>
                    <span className="text-gray-600">({electrician.reviewCount} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{electrician.experience} years experience</p>
                  <div className="text-xs text-gray-500">
                    {electrician.specialties.slice(0, 2).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">PixelFrame</h3>
              </div>
              <p className="text-gray-400">
                Kenya's premier electronics and electrical services platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <div>About Us</div>
                <div>Contact</div>
                <div>Support</div>
                <div>Terms of Service</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <div className="space-y-2 text-gray-400">
                <div>Mobile Phones</div>
                <div>Laptops</div>
                <div>Home Appliances</div>
                <div>Electrical Services</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div>📞 +254 700 000 000</div>
                <div>✉️ support@pixelframe.co.ke</div>
                <div>📍 Nairobi, Kenya</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PixelFrame Kenya. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <BookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        service={selectedService}
        onBooking={handleBookingSubmit}
      />
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <OrdersModal
        isOpen={showOrdersModal}
        onClose={() => setShowOrdersModal(false)}
      />
      {user?.role === 'seller' && (
        <SellerDashboard
          isOpen={showSellerDashboard}
          onClose={() => setShowSellerDashboard(false)}
          sellerId={user.id}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;