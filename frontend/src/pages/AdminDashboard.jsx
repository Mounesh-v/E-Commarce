import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LayoutDashboard, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { formatINR } from '../utils/currency';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/product').catch(() => ({ data: [] })),
          api.get('/order').catch(() => ({ data: [] }))
        ]);
        
        const productsList = productsRes.data || [];
        const ordersList = ordersRes.data || [];
        
        const revenue = ordersList.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        
        setStats({
          products: productsList.length,
          orders: ordersList.length,
          revenue
        });
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Products</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.products}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">₹</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatINR(stats.revenue)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to the Admin Area</h2>
        <p className="text-slate-500">Use this dashboard to manage your e-commerce platform.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
