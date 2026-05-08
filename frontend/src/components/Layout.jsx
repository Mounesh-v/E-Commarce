import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
        &copy; {new Date().getFullYear()} Modern UI Ecommerce. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
