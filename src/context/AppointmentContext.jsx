'use client'
import { createContext, useContext, useReducer, useEffect } from 'react';


const AppointmentContext = createContext();

const appointmentReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [...state.appointments, action.payload]
      };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(appointment => 
          appointment.id === action.payload.id ? action.payload : appointment
        )
      };
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(appointment => 
          appointment.id !== action.payload
        )
      };
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: action.payload
      };
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notification: null
      };
    default:
      return state;
  }
};

export const AppointmentProvider = ({ children }) => {
  const initialState = {
    appointments: [],
    notification: null
  };

  useEffect(() => {
    try {
      const savedAppointments = localStorage.getItem('appointments');
      if (savedAppointments) {
        dispatch({
          type: 'ADD_APPOINTMENT',
          payload: JSON.parse(savedAppointments)
        });
      }
    } catch (error) {
      console.error("Failed to load appointments from localStorage", error);
    }
  }, []);

  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  // Save appointments to localStorage when they change
  useEffect(() => {
    if (state.appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(state.appointments));
    }
  }, [state.appointments]);

  const addAppointment = (appointment) => {
    dispatch({
      type: 'ADD_APPOINTMENT',
      payload: {
        ...appointment,
        id: Date.now().toString() 
      }
    });
    showNotification(`Appointment booked successfully for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`);
  };

  const updateAppointment = (appointment) => {
    dispatch({
      type: 'UPDATE_APPOINTMENT',
      payload: appointment
    });
    showNotification(`Appointment updated successfully`);
  };

  const deleteAppointment = (id) => {
    dispatch({
      type: 'DELETE_APPOINTMENT',
      payload: id
    });
    showNotification(`Appointment deleted successfully`);
  };

  const showNotification = (message) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: message
    });
    
    // Auto-dismiss notification after 3 seconds
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, 3000);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments: state.appointments,
        notification: state.notification,
        addAppointment,
        updateAppointment,
        deleteAppointment
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => useContext(AppointmentContext);