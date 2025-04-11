"use client";

import { useState } from "react";
import { getDaysInMonth, getFirstDayOfMonth, getMonthName } from "../utils/dateUtils";
import { useAppointments } from "../context/AppointmentContext";
import AppointmentModal from "./AppointmentModal";
import AppointmentList from "./AppointmentList";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewAppointments, setViewAppointments] = useState(false);

  const { appointments } = useAppointments();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleViewAppointments = (day) => {
    const viewDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(viewDate);
    setViewAppointments(true);
  };

  const getAppointmentsForDay = (day) => {
    const dayDate = new Date(currentYear, currentMonth, day);
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === dayDate.getDate() &&
        appointmentDate.getMonth() === dayDate.getMonth() &&
        appointmentDate.getFullYear() === dayDate.getFullYear()
      );
    });
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate(new Date(appointment.date));
    setModalMode("edit");
    setViewAppointments(false);
    setModalOpen(true);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(
      <div key={`empty-${i}`} className="h-12 sm:h-16 md:h-20 lg:h-24 rounded-md bg-gray-50 dark:bg-gray-800/40"></div>
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayAppointments = getAppointmentsForDay(day);
    const isToday =
      new Date().getDate() === day &&
      new Date().getMonth() === currentMonth &&
      new Date().getFullYear() === currentYear;

    days.push(
      <div
        key={day}
        className={`h-12 sm:h-16 md:h-20 lg:h-24 rounded-md border border-gray-200 dark:border-gray-700 p-1 sm:p-2 overflow-hidden transition-all cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md ${
          isToday
            ? "bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700"
            : "bg-white dark:bg-gray-800"
        }`}
        onClick={() => handleDayClick(day)}
      >
        <div className="flex justify-between items-center">
          <span
            className={`text-xs sm:text-sm font-medium ${
              isToday
                ? "bg-primary-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {day}
          </span>
          {dayAppointments.length > 0 && (
            <button
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              onClick={(e) => {
                e.stopPropagation();
                handleViewAppointments(day);
              }}
            >
              <span className="hidden sm:inline text-xs font-medium">Summary</span>
              <svg
                className="w-4 h-4 sm:hidden"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <path d="M13 2v7h7" />
                <line x1="9" y1="15" x2="15" y2="15" />
                <line x1="9" y1="19" x2="15" y2="19" />
                <line x1="9" y1="11" x2="9" y2="11" />
              </svg>
            </button>
          )}
        </div>
        <div className="mt-1 space-y-1">
          {dayAppointments.slice(0, 1).map((appointment) => (
            <div
              key={appointment.id}
              className="text-xs p-0.5 sm:p-1 rounded bg-primary-100 dark:bg-primary-800/40 border border-primary-200 dark:border-primary-700/40 truncate cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleEditAppointment(appointment);
              }}
            >
              <span className="hidden xs:inline font-medium text-primary-800 dark:text-primary-300">
                {appointment.time}
              </span>
              <span className="xs:hidden">
                <svg className="w-3 h-3 inline mr-0.5 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span className="xs:ml-1">{appointment.name}</span>
            </div>
          ))}
          {dayAppointments.length > 1 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span className="hidden xs:inline">+ {dayAppointments.length - 1} more</span>
              <span className="xs:hidden flex items-center">
                <svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z" />
                  <path d="M17 8h6" />
                  <path d="M23 14h-6" />
                </svg>
                {dayAppointments.length}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const shortWeekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-label="Previous month"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-2 py-1 sm:px-3 text-xs sm:text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-label="Next month"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-500 dark:text-gray-400 py-1 sm:py-2"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{shortWeekdays[index]}</span>
          </div>
        ))}
        {days}
      </div>

      {modalOpen && (
        <AppointmentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedDate={selectedDate}
          mode={modalMode}
          appointment={selectedAppointment}
        />
      )}

      {viewAppointments && selectedDate && (
        <AppointmentList
          isOpen={viewAppointments}
          onClose={() => setViewAppointments(false)}
          selectedDate={selectedDate}
          onEditAppointment={handleEditAppointment}
        />
      )}
    </div>
  );
};

export default Calendar;