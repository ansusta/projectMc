import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Clock, CheckCircle, Truck, XCircle, ChevronRight } from 'lucide-react';
import { commandeService } from '../../services/commande.service';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const VendorOrders = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
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
      toast.success(`${t('vendorDashboard.statusUpdated')} : ${newStatus}`);
    } catch (error) {
      toast.error(t('vendorDashboard.statusUpdateError'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'payé': 
      case 'paid': 
      case 'payéé':
      case 'تم الدفع': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'en préparation': 
      case 'processing':
      case 'جاري المعالجة': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'expédié': 
      case 'shipped':
      case 'تم الشحن': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'annulé':
      case 'cancelled':
      case 'ملغاة': return 'text-red-400 border-red-500/30 bg-red-500/10';
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
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-3 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-8">
        
        <div>
          <h1 className="text-xl sm:text-3xl font-mono text-foreground tracking-widest flex items-center gap-2 sm:gap-3 italic">
            <span className="w-1.5 h-8 sm:h-10 bg-primary"></span>
            {t('vendorDashboard.incomingOrders')}
          </h1>
          <p className="mt-1 text-primary/50 font-mono text-xs uppercase tracking-tighter">
            {t('vendorDashboard.logisticsProcessing')}
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
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <h3 className="text-foreground font-mono font-bold tracking-widest text-sm mb-1 uppercase">{t('vendorDashboard.orderRef')} #{order.id.substring(0, 8)}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-primary/40 uppercase">
                      <span>{new Date(order.date_commande).toLocaleDateString(i18n.language)}</span>
                      <span className="w-1 h-1 bg-primary/20 rounded-full"></span>
                      <span>{order.items?.length || 0} {t('vendorDashboard.items')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                   <div className={`px-3 py-1 border rounded-full text-[10px] font-mono uppercase tracking-widest ${getStatusColor(order.statut)}`}>
                    {order.statut}
                  </div>
                  
                  <div className="text-right px-4 border-l border-border/50">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">{t('vendorDashboard.totalAmount')}</p>
                    <p className="text-xl font-mono text-foreground tracking-widest">{order.montant_total} <small className="text-xs">XDN</small></p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => updateStatus(order.id, t('vendorDashboard.status.processing'))}
                      className="p-2 bg-muted/30 border border-border text-primary hover:border-primary transition-colors rounded-lg shadow-sm"
                      title={t('vendorDashboard.prepare')}
                    >
                      <Clock size={16} />
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, t('vendorDashboard.status.shipped'))}
                      className="p-2 bg-muted/30 border border-border text-green-500 hover:border-green-500 transition-colors rounded-lg shadow-sm"
                      title={t('vendorDashboard.ship')}
                    >
                      <Truck size={16} />
                    </button>
                    <button 
                      className="p-2 bg-muted/30 border border-border text-foreground hover:border-primary transition-colors rounded-lg shadow-sm"
                      title={t('vendorDashboard.analysis')}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-24 bg-muted/20 border border-dashed border-border rounded-2xl">
              <Clock size={48} className="mx-auto text-muted-foreground/30 mb-4 animate-pulse" />
              <h3 className="text-muted-foreground font-mono text-sm tracking-widest uppercase italic">{t('vendorDashboard.noOrdersAwaiting')}</h3>
              <p className="text-muted-foreground/30 font-mono text-[10px] mt-2 uppercase">{t('vendorDashboard.networkVigilance')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
