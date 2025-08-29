import React, { useState } from 'react';
import { ShoppingCart, User, Search, Zap, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
  onProfileClick?: () => void;
  onOrdersClick?: () => void;
  onSellerDashboardClick?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAuthClick, 
  onProfileClick, 
  onOrdersClick, 
  onSellerDashboardClick,
  searchQuery, 
  onSearchChange 
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">PixelFrame</h1>
              <p className="text-blue-200 text-xs">Electronics & Services</p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products, services, or electricians..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white placeholder-gray-300"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="relative p-2 text-white hover:text-orange-400 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-white/20 transition-all"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                  {user.role !== 'customer' && (
                    <span className="bg-orange-500 text-xs px-2 py-1 rounded-full capitalize">
                      {user.role}
                    </span>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        onProfileClick?.();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => {
                        onOrdersClick?.();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Orders
                    </button>
                    {user.role === 'seller' && (
                      <button 
                        onClick={() => {
                          onSellerDashboardClick?.();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        My Shop
                      </button>
                    )}
                    {user.role === 'electrician' && (
                      <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                        My Services
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-white p-2"
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white placeholder-gray-300"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="space-y-4">
              <button className="w-full text-left text-white hover:text-orange-400 transition-colors">
                Cart (2)
              </button>
              {user ? (
                <>
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-blue-200 text-sm">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      onProfileClick?.();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left text-white hover:text-orange-400 transition-colors"
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => {
                      onOrdersClick?.();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left text-white hover:text-orange-400 transition-colors"
                  >
                    Orders
                  </button>
                  {user.role === 'seller' && (
                    <button 
                      onClick={() => {
                        onSellerDashboardClick?.();
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left text-white hover:text-orange-400 transition-colors"
                    >
                      My Shop
                    </button>
                  )}
                  <button onClick={handleLogout} className="w-full text-left text-red-300 hover:text-red-400 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};