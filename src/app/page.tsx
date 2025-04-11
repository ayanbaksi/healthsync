"use client";
import Calendar from '@/components/Calendar';

export default function Home() {
  return (
    <div className='dark:text-white dark:bg-gray-800"'>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Appointment Calendar</h2>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6 ">
        Click on any date to book a new appointment. View existing appointments by clicking the View button on dates with appointments.
      </p>

      <Calendar />
    </div>
  );
}