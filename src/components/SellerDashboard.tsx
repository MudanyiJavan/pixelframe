import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Eye, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';

interface SellerDashboardProps {
  isOpen: boolean;
  sellerId: string;
  onClose: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ isOpen, sellerId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  // Mock seller products (in real app, filter by sellerId)
  const sellerProducts = mockProducts.filter(p => p.sellerId === sellerId);
  
  const totalRevenue = sellerProducts.reduce((sum, product) => sum + (product.price * product.sold), 0);
  const totalSold = sellerProducts.reduce((sum, product) => sum + product.sold, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">My Shop</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="inline h-4 w-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="inline h-4 w-4 mr-2" />
                My Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="inline h-4 w-4 mr-2" />
                Orders
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Shop Overview</h3>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Revenue</p>
                        <p className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Products Sold</p>
                        <p className="text-2xl font-bold">{totalSold}</p>
                      </div>
                      <Package className="h-8 w-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Active Products</p>
                        <p className="text-2xl font-bold">{sellerProducts.filter(p => p.inStock).length}</p>
                      </div>
                      <Eye className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Avg Rating</p>
                        <p className="text-2xl font-bold">4.7</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800">Samsung Galaxy S24 Ultra sold</span>
                      <span className="text-green-600 font-semibold">+KES 120,000</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-800">Dell XPS 13 viewed 15 times</span>
                      <span className="text-blue-600">Today</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-orange-800">LG TV stock running low (5 left)</span>
                      <span className="text-orange-600">Warning</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">My Products</h3>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {sellerProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-6">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-800">{product.name}</h4>
                        <p className="text-gray-600 text-sm">{product.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-lg font-bold text-gray-900">
                            KES {product.price.toLocaleString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                          <span className="text-sm text-gray-600">{product.sold} sold</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'ORD001', product: 'Samsung Galaxy S24 Ultra', customer: 'John Doe', amount: 120000, status: 'completed', date: '2025-01-15' },
                    { id: 'ORD002', product: 'Dell XPS 13', customer: 'Jane Smith', amount: 85000, status: 'pending', date: '2025-01-14' },
                    { id: 'ORD003', product: 'LG 55" Smart TV', customer: 'Mike Johnson', amount: 65000, status: 'shipped', date: '2025-01-13' }
                  ].map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800">Order #{order.id}</h4>
                          <p className="text-gray-600">{order.product}</p>
                          <p className="text-sm text-gray-500">Customer: {order.customer}</p>
                          <p className="text-sm text-gray-500">Date: {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">KES {order.amount.toLocaleString()}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                  <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-600">
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (KES)</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold"
                  >
                    Add Product
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};