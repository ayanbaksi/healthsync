'use client';

import { useState, useEffect } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { formatDate, generateTimeSlots } from '../utils/dateUtils';

const AppointmentModal = ({ isOpen, onClose, selectedDate, mode = 'add', appointment = null }) => {
  const { addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: selectedDate ? formatDate(selectedDate) : '',
    time: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && appointment) {
      setFormData({
        id: appointment.id,
        name: appointment.name,
        phone: appointment.phone,
        email: appointment.email,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: selectedDate ? formatDate(selectedDate) : '',
        time: '',
        notes: ''
      });
    }
  }, [mode, appointment, selectedDate]);

  if (!isOpen) return null;

  const timeSlots = generateTimeSlots();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.time) newErrors.time = 'Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (mode === 'edit') {
      updateAppointment(formData);
    } else {
      const newAppointment = { ...formData, id: Date.now().toString() };
      addAppointment(newAppointment);
    }
    onClose();
  };

  const handleDelete = () => {
    if (appointment?.id) {
      deleteAppointment(appointment.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-2xl shadow-2xl p-6 space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-7  right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          Close
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold">
          {mode === 'edit' ? 'Edit Appointment' : 'Book Appointment'}
        </h2>

        {/* Form */}
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: 'Name', name: 'name', type: 'text', error: errors.name },
            { label: 'Phone', name: 'phone', type: 'text', error: errors.phone },
            { label: 'Email', name: 'email', type: 'email', error: errors.email },
          ].map(({ label, name, type, error }) => (
            <div key={name}>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={label}
                className={`w-full rounded-lg border px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
          ))}

          {/* Date */}
          <div>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time Dropdown */}
          <div>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select Time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}
          </div>

          {/* Notes */}
          <div>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notes (optional)"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 space-y-3 sm:space-y-0 sm:space-x-4">
          {mode === 'edit' && (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:underline text-sm"
            >
              Delete Appointment
            </button>
          )}
          <div className="flex flex-col sm:flex-row sm:space-x-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto mb-2 sm:mb-0 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {mode === 'edit' ? 'Update' : 'Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
