// app/layout.js
"use client";

import './globals.css';
import { AppointmentProvider } from '@/context/AppointmentContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Initialize dark mode
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full`}>
      <body className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <AppointmentProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />            
            <div className="flex flex-col flex-1 w-full overflow-y-auto dark:bg-gray-900 lg:ml-64">
              <Header 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 my-4">
                {children}
              </main>
            </div>
          </div>
        </AppointmentProvider>
      </body>
    </html>
  );
}