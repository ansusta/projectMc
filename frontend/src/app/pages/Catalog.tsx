import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { mockProducts, categories } from '../lib/mock-data';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Filter, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function Catalog() {
  const [priceRange, setPriceRange] = useState([0, 3500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const handleAddToCart = (product: any) => {
    toast.success(`${product.name} ajouté au panier !`);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = mockProducts.filter(product => {
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const inCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return inPriceRange && inCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.reviews - a.reviews;
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
<<<<<<< HEAD
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Catalogue produits</h1>
            <p className="text-muted-foreground">{sortedProducts.length} unités disponibles</p>
=======
            <div className="flex items-center gap-2 text-primary mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-mono tracking-widest uppercase">Base de données Nexus</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Catalogue produits</h1>
            <p className="text-muted-foreground">{sortedProducts.length} unités identifiées dans le secteur</p>
>>>>>>> 2525ffad75494f105b14c54f7ffe8cc1ee8c7de4
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="glass"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden h-11"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-56 h-11 bg-card/40 border-white/10 backdrop-blur-md rounded-xl focus:ring-primary/50 text-foreground">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent className="bg-background/90 backdrop-blur-xl border-white/10 text-foreground text-sm">
                <SelectItem value="popular">Popularité</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating">Meilleures notes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Modern Sidebar Filters */}
          <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-72 shrink-0`}>
            <div className="bg-card/30 backdrop-blur-xl rounded-3xl border border-white/5 p-8 sticky top-28 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold tracking-tight">Filtres</h2>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 3500]);
                  }}
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>

              {/* Categories */}
              <div className="mb-10">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 font-mono">SECTEURS</h3>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center group cursor-pointer" onClick={() => toggleCategory(category.name)}>
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.name)}
                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor={category.id} className="ml-3 text-sm font-medium text-foreground/70 group-hover:text-foreground cursor-pointer transition-colors flex justify-between w-full">
                        <span>{category.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">{category.count}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-10">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 font-mono">BUDGET (EUR)</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={3500}
                  step={50}
                  className="mb-6"
                />
                <div className="flex items-center justify-between text-xs font-mono font-bold text-primary">
                  <span className="bg-primary/10 px-2 py-1 rounded">{priceRange[0]} €</span>
                  <span className="bg-primary/10 px-2 py-1 rounded">{priceRange[1]} €</span>
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 font-mono">DISPONIBILITÉ</h3>
                <div className="space-y-4">
                  <div className="flex items-center group">
                    <Checkbox id="in-stock" defaultChecked className="border-white/20 data-[state=checked]:bg-primary" />
                    <Label htmlFor="in-stock" className="ml-3 text-sm font-medium text-foreground/70 group-hover:text-foreground cursor-pointer transition-colors">
                      Unités en stock
                    </Label>
                  </div>
                  <div className="flex items-center group">
                    <Checkbox id="on-sale" className="border-white/20 data-[state=checked]:bg-primary" />
                    <Label htmlFor="on-sale" className="ml-3 text-sm font-medium text-foreground/70 group-hover:text-foreground cursor-pointer transition-colors">
                      Offres spéciales
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card/20 backdrop-blur-md rounded-3xl border border-white/5 p-20 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aucun signal détecté</h3>
                <p className="text-muted-foreground mb-8">Essayez de modifier vos paramètres de recherche pour localiser d'autres produits.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 3500]);
                  }}
                  className="border-white/10 hover:bg-white/5 text-foreground"
                >
                  Réinitialiser tous les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
