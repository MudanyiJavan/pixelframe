import React, { useState } from 'react';
import { X, Package, Plus, Edit, Trash2, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ELECTRONICS_CATEGORIES } from '../types';

interface SellerDashboardProps {
  isOpen: boolean;
  sellerId: string;
  onClose: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ isOpen, sellerId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  
  // Filter products by seller
  const sellerProducts = products.filter(p => p.sellerId === sellerId);
  
  const totalRevenue = sellerProducts.reduce((sum, product) => sum + (product.price * product.sold), 0);
  const totalSold = sellerProducts.reduce((sum, product) => sum + product.sold, 0);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    specifications: {} as Record<string, string>
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addProduct({
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        brand: productForm.brand,
        stock: parseInt(productForm.stock),
        specifications: productForm.specifications,
        images: ['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg'] // Default image
      });

      setShowAddProduct(false);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        specifications: {}
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

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
                <X className="h-6 w-6" />
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
                My Products ({sellerProducts.length})
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
            {error && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

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
                      <Package className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Total Products</p>
                        <p className="text-2xl font-bold">{sellerProducts.length}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">Your Products</h4>
                  <div className="space-y-3">
                    {sellerProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div>
                            <span className="font-medium text-gray-800">{product.name}</span>
                            <div className="text-sm text-gray-600">Stock: {product.stock} | Sold: {product.sold}</div>
                          </div>
                        </div>
                        <span className="text-blue-600 font-semibold">KES {product.price.toLocaleString()}</span>
                      </div>
                    ))}
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
                        <p className="text-gray-600 text-sm">{product.category} • {product.brand}</p>
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
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {sellerProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h4>
                    <p className="text-gray-500 mb-4">Start by adding your first product to your shop</p>
                    <button
                      onClick={() => setShowAddProduct(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold"
                    >
                      Add Your First Product
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Orders</h3>
                
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h4>
                  <p className="text-gray-500">Orders from customers will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {(showAddProduct || editingProduct) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button 
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      setError('');
                    }} 
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      >
                        <option value="">Select category</option>
                        {ELECTRONICS_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                      <input 
                        type="text" 
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (KES)</label>
                      <input 
                        type="number" 
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                      <input 
                        type="number" 
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      rows={4} 
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Adding Product...' : 'Add Product'}
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