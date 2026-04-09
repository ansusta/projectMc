import { Heart, Search, ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockProducts } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function CustomerFavorites() {
  const navigate = useNavigate();
  // Mocking favorites with the first few products
  const favoriteProducts = mockProducts.slice(0, 3);

  const handleAddToCartAll = () => {
    toast.success('Tous les favoris ont été ajoutés au panier !');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            className="mb-6 -ml-4 hover:bg-white/5 opacity-70"
            onClick={() => navigate('/customer/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 text-primary mb-3">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,1)]"></div>
                <span className="text-sm font-mono tracking-[0.3em] uppercase opacity-70">Unités Mémorisées</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight">Modules Favoris</h1>
              <p className="text-muted-foreground mt-2">Votre sélection personnalisée de technologies Nexus</p>
            </div>

            {favoriteProducts.length > 0 && (
              <div className="flex items-center gap-3">
                <Button variant="glass" onClick={() => toast.info('Nettoyage du cache favoris...')}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vider la liste
                </Button>
                <Button variant="glow" onClick={handleAddToCartAll}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Tout ajouter au panier
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Capacité</p>
              <p className="text-xl font-bold">{favoriteProducts.length} / 50</p>
            </div>
            <div className="w-px h-10 bg-white/5 hidden md:block"></div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Dernière MaJ</p>
              <p className="text-xl font-bold">Synchronisé</p>
            </div>
          </div>
          
          <div className="relative group/search w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filtrer mes favoris..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm text-foreground"
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
                  onAddToCart={(p) => toast.success(`${p.name} ajouté au panier !`)} 
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-card/10 rounded-3xl border border-dashed border-white/10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
              <Heart className="w-10 h-10 text-muted-foreground opacity-20" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Mémoire vide</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-10">
              Vous n'avez pas encore mémorisé de modules. Explorez le catalogue pour ajouter des unités à votre base de favoris.
            </p>
            <Button variant="glow" size="lg" onClick={() => navigate('/catalog')}>
              Explorer le catalogue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
