import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../lib/mock-data';
import { Star, ShoppingCart, Heart, Flag, Minus, Plus, Package, Shield, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ProductCard } from '../components/ProductCard';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-card/20 backdrop-blur-xl p-12 rounded-3xl border border-white/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">Produit non trouvé</h2>
          <Button variant="glow" onClick={() => navigate('/catalog')}>Retour au catalogue</Button>
        </div>
      </div>
    );
  }

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    toast.success(`${quantity} × ${product.name} ajouté au panier !`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-card/20 border border-white/5 mb-6 group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-card/20 border border-white/5 hover:border-primary/50 cursor-pointer transition-all">
                  <img src={product.image} alt="" className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="mb-6">
              <Badge variant="neon" className="mb-4">{product.category}</Badge>
              <h1 className="text-4xl font-extrabold text-foreground mb-3 tracking-tight">{product.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="text-sm uppercase tracking-widest font-mono">Fournisseur:</span>
                <span className="text-primary font-bold">{product.vendor}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= product.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews} avis)</span>
            </div>

            <div className="mb-8 p-6 bg-card/20 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-5xl font-black text-foreground tabular-nums">€{product.price}</span>
                {product.originalPrice && (
                  <span className="text-2xl text-muted-foreground line-through tabular-nums">€{product.originalPrice}</span>
                )}
              </div>
              {product.originalPrice && (
                <Badge variant="destructive" className="animate-pulse">
                  Économisez €{product.originalPrice - product.price} (-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                </Badge>
              )}
            </div>

            <div className="mb-8">
              <p className="text-foreground/80 leading-relaxed text-lg">{product.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Stock */}
            <div className="mb-8">
              {product.stock > 0 ? (
                <div className="flex items-center gap-3 bg-green-500/10 w-fit px-4 py-2 rounded-full border border-green-500/20">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-green-400 text-sm font-bold uppercase tracking-wider">Interface Stock: {product.stock} unités</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-red-500/10 w-fit px-4 py-2 rounded-full border border-red-500/20">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Secteur hors stock</span>
                </div>
              )}
            </div>

            {/* Quantity */}
            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 font-mono">Configuration Quantité</label>
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
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <Button
                variant="glow"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-14 text-lg font-bold"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Initialiser l'achat
              </Button>
              <Button
                variant="glass"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className="h-14 w-14"
              >
                <Heart className={`w-6 h-6 transition-all ${isFavorite ? 'fill-primary text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' : 'text-foreground'}`} />
              </Button>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-extrabold text-foreground mb-8 tracking-tight">Modules Similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={() => toast.success('Produit ajouté !')} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

