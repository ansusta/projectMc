import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Clock, CheckCircle, Truck, XCircle, ChevronRight } from 'lucide-react';
import { commandeService } from '../../services/commande.service';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const VendorOrders = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await commandeService.getByVendeur(user!.id);
      setOrders(response.commandes || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await commandeService.updateStatut(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statut: newStatus } : o));
      toast.success(`Statut mis à jour : ${newStatus}`);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'payé': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'en préparation': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'expédié': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'annulé': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-mono text-white tracking-widest flex items-center gap-3 italic">
            <span className="w-1.5 h-10 bg-cyan-500"></span>
            COMMANDES ENTRANTES
          </h1>
          <p className="mt-1 text-cyan-500/50 font-mono text-xs uppercase tracking-tighter">
            Traitement des flux logistiques et validation des transactions
          </p>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900/30 border border-cyan-900/20 hover:border-cyan-500/30 transition-all rounded-sm overflow-hidden"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-mono font-bold tracking-widest text-sm mb-1 uppercase">COMMANDE #{order.id.substring(0, 8)}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-cyan-500/40 uppercase">
                      <span>{new Date(order.date_commande).toLocaleDateString()}</span>
                      <span className="w-1 h-1 bg-cyan-900 rounded-full"></span>
                      <span>{order.items?.length || 0} ARTICLES</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                   <div className={`px-3 py-1 border rounded-full text-[10px] font-mono uppercase tracking-widest ${getStatusColor(order.statut)}`}>
                    {order.statut}
                  </div>
                  
                  <div className="text-right px-4">
                    <p className="text-[10px] font-mono text-cyan-500/40 uppercase mb-1">Montant Total</p>
                    <p className="text-xl font-mono text-white tracking-widest">{order.montant_total} <small className="text-xs">XDN</small></p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => updateStatus(order.id, 'En préparation')}
                      className="p-2 bg-gray-900 border border-cyan-900/30 text-cyan-500 hover:border-cyan-500 transition-colors rounded-sm"
                      title="Préparer"
                    >
                      <Clock size={16} />
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, 'Expédié')}
                      className="p-2 bg-gray-900 border border-cyan-900/30 text-green-500 hover:border-green-500 transition-colors rounded-sm"
                      title="Expédier"
                    >
                      <Truck size={16} />
                    </button>
                    <button 
                      className="p-2 bg-gray-900 border border-cyan-900/30 text-white hover:border-cyan-500 transition-colors rounded-sm"
                      title="Détails"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-24 bg-gray-900/20 border border-dashed border-cyan-900/30 rounded-sm">
              <Clock size={48} className="mx-auto text-cyan-900 mb-4 animate-pulse" />
              <h3 className="text-cyan-500 font-mono text-sm tracking-widest uppercase italic">Aucune commande en attente de traitement</h3>
              <p className="text-cyan-500/30 font-mono text-[10px] mt-2 uppercase">Vigilance réseau active - En attente de signaux marchands</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
