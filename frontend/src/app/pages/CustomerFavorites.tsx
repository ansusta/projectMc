import { Heart, Search, ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function CustomerFavorites() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Mocking favorites with the first few products
  const favoriteProducts = mockProducts.slice(0, 3);

  const handleAddToCartAll = () => {
    toast.success(t('favorites.addAllSuccess'));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Button variant="ghost" className="mb-4 sm:mb-6 -ml-3 hover:bg-muted opacity-70" onClick={() => navigate('/customer/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.dashboard')}
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-primary mb-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,1)]"></div>
                <span className="text-xs sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-70">{t('favorites.subtitle')}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{t('favorites.title')}</h1>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">{t('favorites.personalizedSelection')}</p>
            </div>

            {favoriteProducts.length > 0 && (
              <div className="flex items-center gap-3">
                <Button variant="glass" onClick={() => toast.info(t('favorites.clearCacheInfo'))}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('favorites.clearList')}
                </Button>
                <Button variant="glow" onClick={handleAddToCartAll}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('favorites.addAllToCart')}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="flex items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{t('favorites.capacity')}</p>
              <p className="text-xl font-bold">{favoriteProducts.length} / 50</p>
            </div>
            <div className="w-px h-10 bg-border hidden md:block"></div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{t('favorites.lastUpdate')}</p>
              <p className="text-xl font-bold">{t('favorites.synced')}</p>
            </div>
          </div>
          
          <div className="relative group/search w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder={t('favorites.filterPlaceholder')}
              className="bg-muted/40 border border-border rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm text-foreground"
            />
          </div>
        </div>

        {/* Favorites Grid */}
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative group"
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={(p) => toast.success(t('favorites.addedToCart', { name: p.name }))} 
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/20 rounded-2xl border border-dashed border-border shadow-inner">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6 border border-border">
              <Heart className="w-10 h-10 text-muted-foreground opacity-20" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">{t('favorites.emptyMemory')}</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-10">
              {t('favorites.emptyMemoryDesc')}
            </p>
            <Button variant="glow" size="lg" onClick={() => navigate('/catalog')}>
              {t('favorites.exploreCatalog')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
