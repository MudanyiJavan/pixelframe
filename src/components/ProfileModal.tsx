import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Edit2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KENYA_LOCATIONS } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  user.role === 'customer' ? 'bg-green-100 text-green-800' :
                  user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {user.role}
                </span>
                {user.verified && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">Personal Information</h4>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                <span>{loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user.name}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user.email}</div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user.phone || 'Not provided'}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                {isEditing ? (
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select location</option>
                    {KENYA_LOCATIONS.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user.location || 'Not provided'}</div>
                )}
              </div>
            </div>

            {/* Role-specific Information */}
            {user.role === 'electrician' && (
              <div className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded-xl">
                <h4 className="text-lg font-semibold text-orange-800 mb-4">Electrician Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                    <div className="px-4 py-3 bg-white rounded-lg">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.verified ? '✓ Verified' : '⏳ Pending Verification'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <div className="px-4 py-3 bg-white rounded-lg">
                      <span className="text-orange-600 font-semibold">Professional Electrician</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {user.role === 'seller' && (
              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">Seller Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                    <div className="px-4 py-3 bg-white rounded-lg">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.verified ? '✓ Verified Seller' : '⏳ Pending Verification'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shop Status</label>
                    <div className="px-4 py-3 bg-white rounded-lg">
                      <span className="text-blue-600 font-semibold">Active Shop</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};