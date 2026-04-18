import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ProductCard } from '../components/ProductCard';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { produitService, Product } from '../../services/produit.service';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const res = await produitService.getById(productId);
      setProduct(res.produit);
      
      // Fetch related products (same category)
      const relatedRes = await produitService.search({ 
        categorie: res.produit.type?.categorie?.nom,
        limit: 5 
      });
      setRelatedProducts(relatedRes.produits.filter(p => p.id !== productId).slice(0, 4));
      
    } catch (err) {
      toast.error(t('product.notFoundDb'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!product) return;
      await addItem(product as Product, quantity);
    } catch (err) {
      // Error handled in context
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-mono animate-pulse uppercase tracking-[0.3em]">{t('product.decrypting')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-card/20 backdrop-blur-xl p-12 rounded-3xl border border-white/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t('product.notFound')}</h2>
          <Button variant="glow" onClick={() => navigate('/catalog')}>{t('product.backToCatalog')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 mb-10 sm:mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-card/20 border border-white/5 mb-6 group">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop'}
                alt={product.nom_produit}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-card/20 border border-white/5 hover:border-primary/50 cursor-pointer transition-all">
                  <img src={product.image_url} alt="" className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="mb-4 sm:mb-6">
              {product.type?.categorie?.nom && (
                <Badge variant="neon" className="mb-3 sm:mb-4">{product.type.categorie.nom}</Badge>
              )}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground mb-2 sm:mb-3 tracking-tight">{product.nom_produit}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="text-sm uppercase tracking-widest font-mono">{t('product.supplier')}:</span>
                <span className="text-primary font-bold">{product.magasin?.nom_magasin || 'Nexus Partner'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= (product.note_moyenne || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.note_moyenne || '0'}</span>
              <span className="text-sm text-gray-500">({product.nb_avis || 0} {t('product.reviews')})</span>
            </div>

            <div className="mb-5 sm:mb-8 p-4 sm:p-6 bg-card/40 backdrop-blur-md rounded-2xl border border-border shadow-inner">
              <div className="flex items-baseline gap-3 sm:gap-4 mb-3 flex-wrap">
                <span className="text-3xl sm:text-5xl font-black text-foreground tabular-nums">{product.prix.toLocaleString(i18n.language, { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-foreground/80 leading-relaxed text-lg">{product.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Stock */}
            <div className="mb-8">
              {product.qte_dispo > 0 ? (
                <div className="flex items-center gap-3 bg-green-500/10 w-fit px-4 py-2 rounded-full border border-green-500/20">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-green-400 text-sm font-bold uppercase tracking-wider">{t('product.inStock')}: {product.qte_dispo} {t('product.units')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-red-500/10 w-fit px-4 py-2 rounded-full border border-red-500/20">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 text-sm font-bold uppercase tracking-wider">{t('product.outOfStock')}</span>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 font-mono">{t('product.qtyConfig')}</label>
              <div className="flex items-center gap-4 bg-white/5 w-fit p-1 rounded-xl border border-white/10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-white/10 rounded-lg text-foreground"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-bold tabular-nums text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-white/10 rounded-lg text-foreground"
                  onClick={() => setQuantity(Math.min(product.qte_dispo, quantity + 1))}
                  disabled={quantity >= product.qte_dispo}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Button variant="glow" onClick={handleAddToCart} disabled={product.qte_dispo === 0} className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-bold">
                <ShoppingCart className="w-5 h-5 mr-2 sm:mr-3" />
                {t('product.initPurchase')}
              </Button>
              <Button variant="glass" size="icon" onClick={() => setIsFavorite(!isFavorite)} className="h-12 sm:h-14 w-12 sm:w-14">
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${isFavorite ? 'fill-primary text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' : 'text-foreground'}`} />
              </Button>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 sm:mt-20">
            <h2 className="text-xl sm:text-3xl font-extrabold text-foreground mb-5 sm:mb-8 tracking-tight">{t('product.similarModules')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={() => toast.success(t('product.addToCartSuccess'))} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

