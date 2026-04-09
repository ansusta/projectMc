import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, CheckCircle, XCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { toast } from 'sonner';

export const AdminStores = () => {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await adminService.getPendingStores();
      setStores(response.stores || []);
    } catch (error) {
      console.error('Error fetching pending stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (storeId: string, status: 'actif' | 'suspendu') => {
    const confirmMsg = status === 'actif' ? "Valider l'ouverture de ce magasin ?" : "Rejeter / Suspendre ce magasin ?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await adminService.validateStore(storeId, status);
      setStores(prev => prev.filter(s => s.id !== storeId));
      toast.success(status === 'actif' ? 'Magasin approuvé et activé' : 'Magasin suspendu');
    } catch (error) {
      toast.error('Échec de l\'opération de validation');
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
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-black font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl text-white tracking-[0.3em] flex items-center gap-4 italic font-bold">
              <span className="w-2 h-10 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></span>
              MODÉRATION DES MAGASINS
            </h1>
            <p className="mt-1 text-amber-500/50 text-[10px] uppercase tracking-tighter">
              Validation des protocoles commerciaux et vérification de conformité marchande
            </p>
          </div>
          <div className="text-right">
             <span className="text-amber-500 text-xs tracking-widest">{stores.length} UNITÉS EN ATTENTE</span>
          </div>
        </div>

        {/* Pending Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900/40 border border-amber-900/20 p-6 rounded-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Store size={80} className="text-amber-500" />
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-black border border-amber-900/30 rounded-full flex items-center justify-center overflow-hidden">
                    {store.photo_url ? (
                        <img src={store.photo_url} alt="Store logo" className="w-full h-full object-cover" />
                    ) : (
                        <Store size={24} className="text-amber-900" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold tracking-widest uppercase mb-1">{store.nom_magasin}</h3>
                    <p className="text-[10px] text-amber-500/60 uppercase italic flex items-center gap-1">
                        <Info size={10} /> Créé le {new Date(store.date_creation).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-8 h-20 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-xs text-gray-400 leading-relaxed italic opacity-70">
                        {store.description || "Aucune description de module fournie."}
                    </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-amber-900/20">
                    <button 
                      onClick={() => handleValidation(store.id, 'actif')}
                      className="flex-1 py-2 bg-amber-600/10 border border-amber-500/50 text-amber-500 hover:bg-amber-600/20 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={14} /> APPROUVER L'UNITÉ
                    </button>
                    <button 
                      onClick={() => handleValidation(store.id, 'suspendu')}
                      className="p-2 border border-red-900/30 text-red-500 hover:bg-red-900/10 transition-colors"
                      title="Rejeter"
                    >
                        <XCircle size={18} />
                    </button>
                    <button 
                      className="p-2 border border-gray-700 text-gray-400 hover:text-white transition-colors"
                      title="Voir Profil"
                    >
                        <ExternalLink size={18} />
                    </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {stores.length === 0 && (
          <div className="text-center py-32 bg-gray-900/10 border border-dashed border-amber-900/20 rounded-sm">
            <CheckCircle size={48} className="mx-auto text-amber-900/30 mb-4" />
            <h3 className="text-amber-500/40 text-sm tracking-[0.4em] uppercase italic">Protocole de validation à jour</h3>
            <p className="text-amber-500/20 text-[10px] mt-2 uppercase">Aucune nouvelle demande de déploiement marchand</p>
          </div>
        )}
      </div>
    </div>
  );
};
