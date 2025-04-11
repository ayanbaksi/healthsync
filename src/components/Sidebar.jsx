"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Doctors', href: '/doctors', icon: '🧑‍⚕️' },
  { name: 'Appointments', href: '#', icon: '⏰' },
  { name: 'Settings', href: '#', icon: '⚙️' },
];

export default function ModernSidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">HealthSync</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white lg:hidden"
          >
            ✕
          </button>
        </div>
        <nav className="px-4 py-6 space-y-2">
          {navigation.map(({ name, href, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-lg mr-3">{icon}</span>
                {name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}