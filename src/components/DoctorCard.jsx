'use client';

import { useState } from 'react';
import AppointmentModal from './AppointmentModal';

const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    specialization: 'Cardiologist',
    hospital: 'City Hospital',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '11',
    name: 'Dr. Jane Smith',
    specialization: 'Cardiologist',
    hospital: 'City Hospital',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '13',
    name: 'Dr. Jane Smith',
    specialization: 'Cardiologist',
    hospital: 'City Hospital',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '19',
    name: 'Dr. Jane Smith',
    specialization: 'Cardiologist',
    hospital: 'City Hospital',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '111',
    name: 'Dr. Jane Smith',
    specialization: 'Cardiologist',
    hospital: 'City Hospital',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '122',
    name: 'Dr. Jane Smith',
    specialization: 'Cardiologist',
    hospital: 'City Hospital',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  
  {
    id: '22',
    name: 'Dr. John Doe',
    specialization: 'Dermatologist',
    hospital: 'Sunrise Clinic',
    image: 'https://randomuser.me/api/portraits/men/45.jpg'
  },
  {
    id: '3',
    name: 'Dr. Priya Raj',
    specialization: 'Pediatrician',
    hospital: 'Green Valley Hospital',
    image: 'https://randomuser.me/api/portraits/women/46.jpg'
  }
];

const DoctorCard = () => {
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const filteredDoctors = mockDoctors.filter((doc) =>
    [doc.name, doc.specialization, doc.hospital]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <input
        type="text"
        placeholder="Search doctor by name, specialization, or hospital..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-800 dark:text-white"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border-white-600 dark:bg-gray-900 rounded-xl shadow-md p-5 flex flex-col items-center text-center space-y-4 hover:shadow-lg transition"
          >
            <img
              src={doc.image}
              alt={doc.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{doc.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">{doc.specialization}</p>
              <p className="text-sm text-gray-400 dark:text-gray-400">{doc.hospital}</p>
            </div>
            <button
              onClick={() => handleBook(doc)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={new Date()}
        appointment={{
          name: selectedDoctor?.name || '',
          email: '',
          phone: '',
          date: '',
          time: '',
          notes: ''
        }}
        mode="add"
      />
    </div>
  );
};

export default DoctorCard;
