import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Save, Image as ImageIcon, Layout, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { magasinService, Magasin } from '../../services/magasin.service';
import { toast } from 'sonner';

export const VendorStore = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState<Magasin | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchStore();
    }
  }, [user]);

  const fetchStore = async () => {
    try {
      const response = await magasinService.getByVendeur(user!.id);
      setStore(response.magasin);
    } catch (error) {
      console.error('Error fetching store:', error);
      // If store doesn't exist, we might want to show a "Create Store" UI
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    setSaving(true);
    try {
      await magasinService.update(store.id, {
        nom_magasin: store.nom_magasin,
        description: store.description,
        photo_url: store.photo_url,
        banner_url: store.banner_url
      });
      toast.success('Configuration du magasin mise à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!store && !loading) {
    return (
      <div className="p-8 text-center bg-gray-900 min-h-screen pt-24 text-white">
        <AlertCircle className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
        <h2 className="text-2xl font-mono mb-2 tracking-widest">MAGASIN NON TROUVÉ</h2>
        <p className="text-gray-400 font-mono mb-8 opacity-70 italic small uppercase">
            Aucun module de vente n'est associé à cette signature id numérique
        </p>
        <button className="px-6 py-2 bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 rounded-sm hover:bg-cyan-600/30 transition-all font-mono">
            INITIALISER LE MODULE MAGASIN
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-sm border border-cyan-900/30 bg-gray-900/40 p-8">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Store size={120} className="text-cyan-500" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-mono text-white tracking-widest flex items-center gap-3">
              <span className="w-2 h-8 bg-cyan-500"></span>
              CONFIGURATION MAGASIN
            </h1>
            <p className="mt-2 text-cyan-500/60 font-mono text-sm tracking-tight uppercase">
              Gestion des paramètres de l'interface de vente - ID: {store?.id.substring(0, 8)}
            </p>
          </div>
        </div>

        {/* Main Configuration Form */}
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Store Information Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="bg-gray-900/40 border border-cyan-900/20 p-6 rounded-sm backdrop-blur-sm">
                <h3 className="text-white font-mono mb-6 flex items-center gap-2 text-sm tracking-wider opacity-80 uppercase">
                  <Layout size={16} className="text-cyan-500" /> Informations Générales
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-cyan-500/70 uppercase mb-1">Nom du magasin</label>
                    <input 
                      type="text"
                      value={store?.nom_magasin || ''}
                      onChange={(e) => setStore(s => s ? {...s, nom_magasin: e.target.value} : null)}
                      className="w-full bg-black/50 border border-cyan-900/30 rounded-sm px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyan-500/70 uppercase mb-1">Description / Bio</label>
                    <textarea 
                      rows={4}
                      value={store?.description || ''}
                      onChange={(e) => setStore(s => s ? {...s, description: e.target.value} : null)}
                      className="w-full bg-black/50 border border-cyan-900/30 rounded-sm px-4 py-2 text-white font-mono focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visuals Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="bg-gray-900/40 border border-cyan-900/20 p-6 rounded-sm backdrop-blur-sm">
                <h3 className="text-white font-mono mb-6 flex items-center gap-2 text-sm tracking-wider opacity-80 uppercase">
                  <ImageIcon size={16} className="text-cyan-500" /> Identité Visuelle
                </h3>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-black border border-cyan-900/30 rounded-full mb-3 flex items-center justify-center overflow-hidden">
                      {store?.photo_url ? (
                        <img src={store.photo_url} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Store size={32} className="text-cyan-900" />
                      )}
                    </div>
                    <button type="button" className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-tighter">
                      Modifier le logo
                    </button>
                  </div>

                  <div className="p-3 border border-dashed border-cyan-900/30 rounded-sm bg-black/40">
                    <label className="block text-[10px] font-mono text-cyan-500/40 uppercase mb-2">Bannière Storefront</label>
                    <div className="h-20 bg-gray-800/50 rounded-sm flex items-center justify-center">
                      <ImageIcon size={20} className="text-cyan-900" />
                    </div>
                    <button type="button" className="w-full mt-2 text-[10px] font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-tighter">
                      Importer une bannière
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-4 border-t border-cyan-900/20">
            <button
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-cyan-600/10 border border-cyan-500/50 text-cyan-400 rounded-sm hover:bg-cyan-600/20 transition-all font-mono uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-cyan-500"></div>
              ) : (
                <Save size={18} />
              )}
              Mettre à jour le système
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
