import React, { useState } from 'react';
import { X, Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!isOpen || !user) return null;

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ORD-2025-001',
      productName: 'Samsung Galaxy S24 Ultra',
      productImage: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
      price: 120000,
      quantity: 1,
      status: 'shipped',
      orderDate: '2025-01-10',
      estimatedDelivery: '2025-01-17',
      seller: 'TechHub Kenya'
    },
    {
      id: 'ORD-2025-002',
      productName: 'Sony WH-1000XM5 Headphones',
      productImage: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      price: 28000,
      quantity: 1,
      status: 'delivered',
      orderDate: '2025-01-05',
      seller: 'Audio World'
    },
    {
      id: 'ORD-2025-003',
      productName: 'Dell XPS 13 Core i7',
      productImage: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
      price: 85000,
      quantity: 1,
      status: 'pending',
      orderDate: '2025-01-14',
      estimatedDelivery: '2025-01-21',
      seller: 'Nairobi Electronics'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Package className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Orders Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600">{mockOrders.length}</div>
              <div className="text-blue-700 text-sm">Total Orders</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockOrders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-green-700 text-sm">Delivered</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mockOrders.filter(o => o.status === 'shipped').length}
              </div>
              <div className="text-purple-700 text-sm">In Transit</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-orange-600">
                KES {mockOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0).toLocaleString()}
              </div>
              <div className="text-orange-700 text-sm">Total Spent</div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-800">{order.productName}</h4>
                        <p className="text-gray-600 text-sm">Order #{order.id}</p>
                        <p className="text-gray-600 text-sm">Sold by {order.seller}</p>
                        <p className="text-gray-600 text-sm">Ordered on {new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 mb-2">
                          KES {(order.price * order.quantity).toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Qty: {order.quantity}</span>
                        {order.estimatedDelivery && order.status !== 'delivered' && (
                          <span className="text-sm text-blue-600">
                            Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>

                    {/* Order Progress */}
                    <div className="mt-4 flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${order.status !== 'cancelled' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className="flex-1 h-1 bg-gray-200 rounded">
                        <div 
                          className={`h-full rounded transition-all duration-500 ${
                            order.status === 'delivered' ? 'bg-green-500 w-full' :
                            order.status === 'shipped' ? 'bg-purple-500 w-3/4' :
                            order.status === 'confirmed' ? 'bg-blue-500 w-1/2' :
                            order.status === 'pending' ? 'bg-yellow-500 w-1/4' :
                            'bg-red-500 w-0'
                          }`}
                        ></div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mockOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500">Start shopping to see your orders here!</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={selectedOrder.productImage}
                    alt={selectedOrder.productName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">{selectedOrder.productName}</h4>
                    <p className="text-gray-600">Order #{selectedOrder.id}</p>
                    <p className="text-gray-600">Quantity: {selectedOrder.quantity}</p>
                    <p className="text-xl font-bold text-gray-900 mt-2">
                      KES {(selectedOrder.price * selectedOrder.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seller:</span>
                    <span className="font-medium">{selectedOrder.seller}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                  {selectedOrder.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Delivery:</span>
                      <span className="font-medium">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {selectedOrder.status === 'delivered' && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">Order Completed!</h5>
                    <p className="text-green-700 text-sm">
                      Your order has been successfully delivered. We hope you're satisfied with your purchase!
                    </p>
                    <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Rate Product
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};