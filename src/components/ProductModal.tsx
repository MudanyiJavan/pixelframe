import React from 'react';
import { X, Star, ShoppingCart, User, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onAddToCart }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-80 object-cover rounded-xl"
              />
              {!product.inStock && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-semibold">⚠️ This product is currently out of stock</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-sm text-gray-500 font-medium">{product.brand}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-4xl font-bold text-gray-900">
                    KES {product.price.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <User className="h-4 w-4" />
                    <span>Sold by {product.sellerName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Package className="h-4 w-4" />
                    <span>{product.sold} sold</span>
                  </div>
                </div>
              </div>

              {product.inStock && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700">
                    ✅ In stock ({product.stock} available)
                    {product.stock <= 5 && (
                      <span className="ml-2 text-orange-600 font-semibold">
                        - Only {product.stock} left!
                      </span>
                    )}
                  </p>
                </div>
              )}

              <button
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2 ${
                  product.inStock
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>

          {/* Product Specifications */}
          {Object.keys(product.specifications).length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};