import React from 'react';
import { Star, MapPin, Clock, User } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onBookService: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookService }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={service.electricianImage || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg'}
            alt={service.electricianName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                {service.category}
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{service.electricianName}</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {service.electricianRating}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              {service.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{service.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Service Available</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Pricing Options:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In-Shop:</span>
                  <span className="text-sm font-semibold text-green-600">
                    KES {service.basePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">On-Site Visit:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    KES {service.onSitePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Availability:</h4>
              {service.availability.map((time, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {time}
                </div>
              ))}
            </div>

            <button
              onClick={() => onBookService(service)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold"
            >
              Book Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};