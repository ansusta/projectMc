import { useState } from 'react';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { mockProducts } from '../lib/mock-data';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CartItem {
  product: typeof mockProducts[0];
  quantity: number;
}

export function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: mockProducts[0], quantity: 1 },
    { product: mockProducts[2], quantity: 2 },
  ]);

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, item.quantity + delta)) }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(items => items.filter(item => item.product.id !== productId));
    toast.success('Produit retiré du panier');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }
    navigate('/checkout/address');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-5 sm:mb-8">Panier d'achat</h1>

        {cartItems.length === 0 ? (
          <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-16 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <ShoppingCart className="w-12 h-12 text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-8">Propulsez votre setup avec nos modules technologiques.</p>
            <Button variant="glow" onClick={() => navigate('/catalog')}>
              Explorer le catalogue
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 transition-all hover:border-primary/30 group">
                  <div className="flex gap-4 sm:gap-6">
                    <div className="relative overflow-hidden rounded-xl w-20 h-20 sm:w-32 sm:h-32 shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 sm:mb-2 gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">{item.product.name}</h3>
                          <p className="text-xs text-muted-foreground font-mono">CODE: {item.product.vendor}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
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
                            onClick={() => updateQuantity(item.product.id, -1)}
                            disabled={item.quantity <= 1}
                            className="h-9 w-9 hover:bg-white/10"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-10 text-center font-bold tabular-nums">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="h-9 w-9 hover:bg-white/10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg sm:text-2xl font-black text-foreground tabular-nums">
                            €{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">UNIT: €{item.product.price}</p>
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
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5 sm:mb-8 tracking-tight">Récapitulatif</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Sous-total ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} articles)</span>
                    <span className="tabular-nums">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Logistique Warp</span>
                    <span className="tabular-nums">€{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>TVA (20%)</span>
                    <span className="tabular-nums">€{tax.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-2xl font-black text-foreground">
                    <span>Total</span>
                    <span className="tabular-nums">€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  variant="glow"
                  className="w-full h-14 text-lg font-bold mb-4"
                >
                  Procéder au paiement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  variant="glass"
                  onClick={() => navigate('/catalog')}
                  className="w-full h-12"
                >
                  Continuer mes achats
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

function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
