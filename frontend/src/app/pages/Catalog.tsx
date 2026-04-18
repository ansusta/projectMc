import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { categories } from '../lib/mock-data';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Filter, X, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { produitService, Product } from '../../services/produit.service';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';

export function Catalog() {
  const { addItem } = useCart();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories]); // Re-fetch when categories change

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // We pass the first selected category if any (backend supports one category filter)
      const res = await produitService.search({
        categorie: selectedCategories.length > 0 ? selectedCategories[0] : undefined
      });
      setProducts(res.produits);
    } catch (err) {
      toast.error(t('catalog.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product, 1);
    } catch (err) {}
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = products.filter(product => {
    const inPriceRange = product.prix >= priceRange[0] && product.prix <= priceRange[1];
    return inPriceRange;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.prix - b.prix;
      case 'price-desc':
        return b.prix - a.prix;
      default:
        return 0; // Backend handles sorting better, but we keep this for local filtering
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1 sm:mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs sm:text-sm font-mono tracking-widest uppercase">{t('catalog.subtitle')}</span>
            </div>
            <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight mb-1">{t('catalog.title')}</h1>
            <p className="text-sm text-muted-foreground">{sortedProducts.length} {t('catalog.products')}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="glass" onClick={() => setShowFilters(!showFilters)} className="lg:hidden h-10 sm:h-11 text-sm">
              <Filter className="w-4 h-4 mr-2" />
              {t('catalog.filters')} {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 sm:w-56 h-10 sm:h-11 bg-card/40 border-border backdrop-blur-md rounded-xl focus:ring-primary/50 text-foreground text-sm">
                <SelectValue placeholder={t('catalog.sortBy')} />
              </SelectTrigger>
              <SelectContent className="bg-background/90 backdrop-blur-xl border-border text-foreground text-sm">
                <SelectItem value="popular">{t('catalog.newest')}</SelectItem>
                <SelectItem value="price-asc">{t('catalog.priceAsc')}</SelectItem>
                <SelectItem value="price-desc">{t('catalog.priceDesc')}</SelectItem>
                <SelectItem value="rating">{t('catalog.bestRatings')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full sm:w-72 shrink-0`}>
            <div className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border p-5 sm:p-8 lg:sticky top-28 shadow-soft">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold tracking-tight">{t('catalog.filters')}</h2>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 3500]);
                  }}
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                >
                  {t('catalog.reset')}
                </button>
              </div>

              {/* Categories */}
              <div className="mb-10">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 font-mono">{t('catalog.sectors')}</h3>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center group cursor-pointer" onClick={() => toggleCategory(category.name)}>
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.name)}
                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor={category.id} className="ml-3 text-sm font-medium text-foreground/70 group-hover:text-foreground cursor-pointer transition-colors flex justify-between w-full">
                        <span>{t(category.key)}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">{category.count}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-10">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 font-mono">{t('catalog.budget')} (EUR)</h3>
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
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 font-mono">{t('catalog.availability')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center group">
                    <Checkbox id="in-stock" defaultChecked className="border-white/20 data-[state=checked]:bg-primary" />
                    <Label htmlFor="in-stock" className="ml-3 text-sm font-medium text-foreground/70 group-hover:text-foreground cursor-pointer transition-colors">
                      {t('catalog.inStock')}
                    </Label>
                  </div>
                  <div className="flex items-center group">
                    <Checkbox id="on-sale" className="border-white/20 data-[state=checked]:bg-primary" />
                    <Label htmlFor="on-sale" className="ml-3 text-sm font-medium text-foreground/70 group-hover:text-foreground cursor-pointer transition-colors">
                      {t('catalog.specialOffers')}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-card/20 backdrop-blur-md rounded-3xl border border-white/5">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-mono animate-pulse uppercase tracking-widest text-sm">{t('catalog.initFlow')}</p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 sm:gap-8">
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
                <h3 className="text-xl font-bold mb-2">{t('catalog.noSignal')}</h3>
                <p className="text-muted-foreground mb-8">{t('catalog.noSignalDesc')}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 5000]);
                  }}
                  className="border-white/10 hover:bg-white/5 text-foreground"
                >
                  {t('catalog.resetAll')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
