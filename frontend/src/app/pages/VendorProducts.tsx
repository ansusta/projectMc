import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Edit2, Trash2, Search, Filter, AlertCircle, ShoppingBag } from 'lucide-react';
import { produitService, Product } from '../../services/produit.service';
import { magasinService } from '../../services/magasin.service';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const VendorProducts = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const storeRes = await magasinService.getByVendeur(user!.id);
      if (storeRes.magasin) {
        setStoreId(storeRes.magasin.id);
        const prodRes = await produitService.getByMagasin(storeRes.magasin.id);
        setProducts(prodRes.produits || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('vendorDashboard.confirmDelete'))) return;
    try {
      await produitService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success(t('vendorDashboard.deleteSuccess'));
    } catch (error) {
      toast.error(t('vendorDashboard.deleteError'));
    }
  };

  const filteredProducts = products.filter(p => 
    p.nom_produit.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categorie.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-3 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-mono text-foreground tracking-widest flex items-center gap-3 italic">
              <span className="w-1.5 h-8 sm:h-10 bg-primary"></span>
              {t('vendorDashboard.profiledCatalog')}
            </h1>
            <p className="mt-1 text-primary/50 font-mono text-xs uppercase tracking-tighter">
              {t('vendorDashboard.inventoryAssets')}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative group flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
              <input 
                type="text"
                placeholder={t('catalog.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card/40 border border-border rounded-xl pl-10 pr-4 py-2 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:min-w-[220px] transition-all"
              />
            </div>
            <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="bg-primary/10 border border-primary/50 p-2 text-primary hover:bg-primary/20 transition-all rounded-xl flex items-center gap-1.5 px-3 shadow-soft whitespace-nowrap"
            >
              <Plus size={16} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider hidden sm:inline">{t('common.add')}</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-card/40 border border-border hover:border-primary/50 transition-all p-3 rounded-2xl backdrop-blur-md shadow-soft"
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 z-10 px-2 py-0.5 rounded-full text-[8px] font-mono border ${
                  product.stock > 0 ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}>
                  {product.stock > 0 ? t('vendorDashboard.inStock') : t('vendorDashboard.outOfStock')}
                </div>

                <div className="relative h-48 overflow-hidden rounded-xl bg-muted mb-4 border border-border/50 shadow-inner">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.nom_produit} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <ShoppingBag size={80} className="text-cyan-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">{product.categorie}</p>
                  <h3 className="text-foreground font-mono font-bold tracking-tight text-lg line-clamp-1 group-hover:text-primary transition-colors uppercase">{product.nom_produit}</h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-mono text-foreground tracking-widest">{product.prix} <small className="text-[10px] text-primary/50">XDN</small></span>
                    <span className="text-xs font-mono text-muted-foreground/60 uppercase">{t('product.quantity')}: {product.stock}</span>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 border border-primary/50 rounded-2xl">
                  <button 
                    onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                    className="p-3 bg-primary/20 border border-primary/50 text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-md"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-3 bg-destructive/20 border border-destructive/50 text-destructive rounded-full hover:bg-destructive hover:text-white transition-all shadow-md"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-2xl">
            <Package size={48} className="mx-auto text-muted-foreground/30 mb-4 animate-pulse" />
            <h3 className="text-muted-foreground font-mono text-sm tracking-widest uppercase italic">{t('vendorDashboard.zeroProducts')}</h3>
            <p className="text-muted-foreground/30 font-mono text-[10px] mt-2 uppercase">{t('vendorDashboard.initInventory')}</p>
          </div>
        )}
      </div>

      {/* Placeholder for Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-card border border-border p-8 rounded-2xl overflow-hidden relative shadow-lg"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Edit2 size={200} className="text-primary" />
            </div>
            <h2 className="text-2xl font-mono text-foreground mb-8 tracking-widest italic flex items-center gap-4">
                <span className="w-1 h-6 bg-primary"></span>
                {editingProduct ? t('vendorDashboard.activeModification') : t('vendorDashboard.newRecord')}
            </h2>
            
            <p className="text-muted-foreground font-mono text-xs mb-8">
                {t('vendorDashboard.secureEntryInterface')}
            </p>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="mt-8 w-full py-3 border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all font-mono uppercase text-xs tracking-[0.3em] rounded-xl"
            >
              {t('vendorDashboard.closeConsole')}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
