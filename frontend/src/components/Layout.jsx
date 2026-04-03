import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Modern UI Ecommerce. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
