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
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-background font-mono">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Admin Header */}
        <div className="relative p-6 sm:p-10 border border-primary/20 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-soft">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Activity size={120} className="text-primary sm:hidden" />
                <Activity size={180} className="text-primary hidden sm:block" />
            </div>
            <div className="relative z-10">
                <h1 className="text-2xl sm:text-4xl text-foreground font-bold tracking-[0.1em] sm:tracking-[0.2em] italic uppercase">Terminal de Commandement</h1>
                <p className="text-primary font-bold mt-2 tracking-widest text-xs opacity-70">ADMINISTRATEUR SYSTÈME - ACCÈS NIVEAU 100</p>
                <div className="mt-4 sm:mt-6 flex flex-wrap gap-3">
                    <Link to="/admin/users" className="px-4 py-2 border border-primary/40 text-primary text-[10px] hover:bg-primary/10 transition-all rounded-lg uppercase tracking-widest font-bold">Gérer les Accès</Link>
                    <Link to="/admin/stores" className="px-4 py-2 border border-primary/40 text-primary text-[10px] hover:bg-primary/10 transition-all rounded-lg uppercase tracking-widest font-bold">Vérification Marchande</Link>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 border border-border/50 rounded-2xl ${stat.bg} backdrop-blur-sm relative group cursor-default shadow-soft hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={20} className={stat.color} />
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20 group-hover:bg-primary transition-colors shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
              </div>
              <p className="text-[10px] text-foreground/40 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-3xl text-foreground font-bold mt-1 tracking-tighter">{stat.value?.toLocaleString() || '---'}</h3>
            </motion.div>
          ))}
        </div>

        {/* Financial Snapshot */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 p-5 sm:p-8 rounded-2xl shadow-soft">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5 sm:mb-8">
                <h2 className="text-base sm:text-lg text-foreground font-bold tracking-widest uppercase italic flex items-center gap-3">
                    <DollarSign className="text-green-500" /> Flux Monétaire Global (XDN)
                </h2>
                <span className="text-[10px] text-foreground/30 tracking-widest uppercase italic font-mono animate-pulse">Mise à jour en temps réel</span>
            </div>
            
            <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl sm:text-6xl font-bold text-foreground tracking-widest">{stats?.revenue?.toLocaleString() || '0'}</span>
                <span className="text-green-500 font-bold tracking-widest flex items-center gap-1">
                  <Activity size={14} /> +12.5%
                </span>
            </div>
            
            <div className="mt-8 grid grid-cols-12 gap-1 h-3 mb-4 rounded-full overflow-hidden border border-border/20">
                {[...Array(48)].map((_, i) => (
                    <div key={i} className={`h-full ${i < 30 ? 'bg-primary/50' : 'bg-muted/30'}`}></div>
                ))}
            </div>
            <p className="text-[10px] text-foreground/20 uppercase tracking-[0.2em] italic font-mono">Projection de croissance des actifs numériques calculée par le noyau prédictif</p>
        </div>

        {/* Shortcuts / Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-foreground text-[10px] font-mono uppercase tracking-[0.2em]">
            <Link to="/admin/users" className="p-6 bg-card/20 border border-border/50 rounded-xl flex items-center justify-between hover:bg-primary/10 hover:border-primary/30 transition-all group shadow-sm">
                <span className="group-hover:text-primary transition-colors">Régulariser Utilisateurs</span>
                <ChevronRight size={14} className="text-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </Link>
            <Link to="/admin/stores" className="p-6 bg-card/20 border border-border/50 rounded-xl flex items-center justify-between hover:bg-primary/10 hover:border-primary/30 transition-all group shadow-sm">
                <span className="group-hover:text-primary transition-colors">Vérifier Protocoles Magasins</span>
                <ChevronRight size={14} className="text-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </Link>
            <button className="p-6 bg-card/20 border border-border/50 rounded-xl flex items-center justify-between hover:bg-primary/10 hover:border-primary/30 transition-all group shadow-sm text-left">
                <span className="group-hover:text-primary transition-colors">Maintenance Système</span>
                <ShieldCheck size={14} className="text-foreground/20 group-hover:text-primary transition-all" />
            </button>
        </div>

      </div>
    </div>
  );
};
