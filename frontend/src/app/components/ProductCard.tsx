import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../lib/mock-data';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-card/40 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:border-primary/30 transition-all duration-300 cursor-pointer relative"
    >
      <div className="relative aspect-square overflow-hidden bg-black/20">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.originalPrice && (
          <Badge variant="destructive" className="absolute top-3 left-3 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </Badge>
        )}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-lg hover:bg-black/60 hover:border-white/20 transition-all"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-gray-400 hover:text-white'}`} />
        </button>
        {product.stock < 10 && (
          <Badge variant="neon" className="absolute bottom-3 left-3 border-orange-500/50 text-orange-400 bg-orange-500/10 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
            Seulement {product.stock} restants
          </Badge>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p className="text-xs text-primary/70 font-medium mb-1 tracking-wider uppercase">{product.category}</p>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.vendor}</p>
        </div>

        <div className="flex items-center gap-1.5 bg-black/20 w-fit px-2 py-1 rounded-md border border-white/5">
          <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">€{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">€{product.originalPrice}</span>
            )}
          </div>
        </div>

        <Button
          variant="glow"
          onClick={handleAddToCart}
          className="w-full opacity-90 group-hover:opacity-100 transition-opacity"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
