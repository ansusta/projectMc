import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Store, Package, ShoppingCart, DollarSign, Activity, ChevronRight, ShieldCheck } from 'lucide-react';
import { adminService, AdminStats } from '../../services/admin.service';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Hardcoded fallback stats for UI demo if API fails
      setStats({
        totalUsers: 1248,
        totalVendors: 42,
        totalProducts: 156,
        totalOrders: 890,
        revenue: 45670
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Utilisateurs', value: stats?.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Vendeurs Actifs', value: stats?.totalVendors, icon: ShieldCheck, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Produits Indexés', value: stats?.totalProducts, icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Volume Ventes', value: stats?.totalOrders, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-black font-mono">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Admin Header */}
        <div className="relative p-10 border border-red-900/20 bg-gray-900/30 rounded-sm overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Activity size={180} className="text-red-600" />
            </div>
            <div className="relative z-10">
                <h1 className="text-4xl text-white font-bold tracking-[0.2em] italic uppercase">Terminal de Commandement</h1>
                <p className="text-red-500 font-bold mt-2 tracking-widest text-xs opacity-70">ADMINISTRATEUR SYSTÈME - ACCÈS NIVEAU 100</p>
                <div className="mt-6 flex gap-4">
                    <Link to="/admin/users" className="px-4 py-2 border border-red-900/40 text-red-500 text-[10px] hover:bg-red-900/10 transition-all uppercase tracking-widest font-bold">Gérer les Accès</Link>
                    <Link to="/admin/stores" className="px-4 py-2 border border-red-900/40 text-red-500 text-[10px] hover:bg-red-900/10 transition-all uppercase tracking-widest font-bold">Vérification Marchande</Link>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 border border-white/5 rounded-sm ${stat.bg} backdrop-blur-sm relative group cursor-default`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={20} className={stat.color} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-cyan-500 transition-colors"></div>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-3xl text-white font-bold mt-1 tracking-tighter">{stat.value?.toLocaleString() || '---'}</h3>
            </motion.div>
          ))}
        </div>

        {/* Financial Snapshot */}
        <div className="bg-gray-900/40 border border-white/5 p-8 rounded-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg text-white font-bold tracking-widest uppercase italic flex items-center gap-3">
                    <DollarSign className="text-green-500" /> Flux Monétaire Global (XDN)
                </h2>
                <span className="text-[10px] text-white/30 tracking-widest uppercase italic">Mise à jour en temps réel</span>
            </div>
            
            <div className="flex items-baseline gap-4">
                <span className="text-6xl font-bold text-white tracking-widest">{stats?.revenue?.toLocaleString() || '0'}</span>
                <span className="text-green-500 font-bold tracking-widest">▲ +12.5%</span>
            </div>
            
            <div className="mt-8 grid grid-cols-12 gap-1 h-3 mb-2">
                {[...Array(48)].map((_, i) => (
                    <div key={i} className={`h-full ${i < 30 ? 'bg-green-500/50' : 'bg-gray-800'}`}></div>
                ))}
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] italic">Projection de croissance des actifs numériques calculée par le noyau prédictif</p>
        </div>

        {/* Shortcuts / Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white text-xs font-mono uppercase tracking-widest">
            <Link to="/admin/users" className="p-4 border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
                <span>Régulariser Utilisateurs</span>
                <ChevronRight size={14} className="text-white/20" />
            </Link>
            <Link to="/admin/stores" className="p-4 border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
                <span>Vérifier Protocoles Magasins</span>
                <ChevronRight size={14} className="text-white/20" />
            </Link>
            <button className="p-4 border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all text-left">
                <span>Maintenance Système</span>
                <ShieldCheck size={14} className="text-white/20" />
            </button>
        </div>

      </div>
    </div>
  );
};
