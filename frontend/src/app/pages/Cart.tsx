import { Minus, Plus, Trash2, ArrowRight, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, isLoading, updateQuantity, removeItem } = useCart();
  const { t } = useTranslation();

  const subtotal = total;
  const shipping = subtotal > 0 ? 10 : 0; // Fixed shipping for now
  const tax = subtotal * 0.2;
  const finalTotal = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }
    
    if (!user) {
      toast.info("Prêt à passer à l'étape supérieure ? Connectez-vous ou créez un compte pour finaliser votre commande.");
      navigate('/register');
      return;
    }

    navigate('/checkout/address');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-mono animate-pulse uppercase tracking-widest text-sm">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-5 sm:mb-8">{t('cart.title')}</h1>

        {items.length === 0 ? (
          <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-16 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <ShoppingCart className="w-12 h-12 text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">{t('cart.empty')}</h2>
            <p className="text-muted-foreground mb-8">{t('cart.emptyDesc')}</p>
            <Button variant="glow" onClick={() => navigate('/catalog')}>
              {t('cart.exploreCatalog')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.produit.id} className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 transition-all hover:border-primary/30 group">
                  <div className="flex gap-4 sm:gap-6">
                    <div className="relative overflow-hidden rounded-xl w-20 h-20 sm:w-32 sm:h-32 shrink-0">
                      <img src={item.produit.image_url} alt={item.produit.nom_produit} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 sm:mb-2 gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">{item.produit.nom_produit}</h3>
                          <p className="text-xs text-muted-foreground font-mono">SECTEUR: {item.produit.type?.categorie?.nom || 'Inconnu'}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.produit.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-3 sm:mt-4 flex-wrap gap-3">
                        <div className="flex items-center gap-2 sm:gap-4 bg-muted/30 p-1 rounded-xl border border-border">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.produit.id, item.qte - 1)}
                            disabled={item.qte <= 1}
                            className="h-9 w-9 hover:bg-white/10"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-10 text-center font-bold tabular-nums">{item.qte}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.produit.id, item.qte + 1)}
                            disabled={item.qte >= item.produit.qte_dispo}
                            className="h-9 w-9 hover:bg-white/10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg sm:text-2xl font-black text-foreground tabular-nums">
                            €{(item.prix_at_time * item.qte).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">UNIT: €{item.prix_at_time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-5 sm:p-8 lg:sticky top-28 shadow-soft">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5 sm:mb-8 tracking-tight">{t('cart.subtotal')}</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>{t('cart.subtotal')} ({items.reduce((sum, item) => sum + item.qte, 0)} {t('cart.items')})</span>
                    <span className="tabular-nums">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>{t('cart.shipping')}</span>
                    <span className="tabular-nums">€{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>TVA (20%)</span>
                    <span className="tabular-nums">€{tax.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-2xl font-black text-foreground">
                    <span>{t('cart.total')}</span>
                    <span className="tabular-nums">€{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  variant="glow"
                  className="w-full h-14 text-lg font-bold mb-4"
                >
                  {t('cart.checkout')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  variant="glass"
                  onClick={() => navigate('/catalog')}
                  className="w-full h-12"
                >
                  {t('cart.continueShopping')}
                </Button>

                <div className="mt-8 p-6 bg-primary/10 rounded-2xl border border-primary/20">
                  <p className="text-sm text-primary font-bold">
                    🎉 Livraison gratuite activée au-delà de 100€
                  </p>
                  {subtotal < 100 && (
                    <p className="text-xs text-primary/70 mt-2 font-mono">
                      DELTA REQUIS: €{(100 - subtotal).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
