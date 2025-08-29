import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock } from 'lucide-react';
import { Service, KENYA_LOCATIONS } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onBooking: (bookingData: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, service, onBooking }) => {
  const [bookingType, setBookingType] = useState<'in-shop' | 'on-site'>('in-shop');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      serviceId: service.id,
      electricianId: service.electricianId,
      type: bookingType,
      location: bookingType === 'on-site' ? customerLocation : 'Electrician\'s Shop',
      scheduledDate: `${selectedDate} ${selectedTime}`,
      price: bookingType === 'on-site' ? service.onSitePrice : service.basePrice,
      notes
    };

    onBooking(bookingData);
    onClose();
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
            <div className="mt-2 flex items-center space-x-2">
              <img
                src={service.electricianImage}
                alt={service.electricianName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-gray-700">{service.electricianName}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Service Location:
              </label>
              <div className="grid grid-cols-1 gap-3">
                <label className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  bookingType === 'in-shop' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="bookingType"
                    value="in-shop"
                    checked={bookingType === 'in-shop'}
                    onChange={(e) => setBookingType(e.target.value as 'in-shop' | 'on-site')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Visit Electrician's Shop</span>
                      <span className="font-semibold text-green-600">
                        KES {service.basePrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Bring your device to the electrician's workshop
                    </p>
                  </div>
                </label>

                <label className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  bookingType === 'on-site' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="bookingType"
                    value="on-site"
                    checked={bookingType === 'on-site'}
                    onChange={(e) => setBookingType(e.target.value as 'in-shop' | 'on-site')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">On-Site Visit</span>
                      <span className="font-semibold text-blue-600">
                        KES {service.onSitePrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Electrician comes to your location
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Location Selection for On-Site */}
            {bookingType === 'on-site' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Your Location
                </label>
                <select
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Select your area</option>
                  {KENYA_LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Preferred Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your issue or any specific requirements..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Electrician:</span>
                  <span>{service.electricianName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="capitalize">{bookingType === 'on-site' ? 'On-Site Visit' : 'In Shop'}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                  <span>Total Price:</span>
                  <span>KES {(bookingType === 'on-site' ? service.onSitePrice : service.basePrice).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};