import { ArrowRight, Monitor, Cpu, Mouse, Gamepad2, HardDrive, Headphones, Truck, Gift, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { mockProducts, categories } from '../lib/mock-data';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SplineScene } from '../components/ui/splite';
import { Spotlight } from '../components/ui/spotlight';

const categoryIcons = {
  Monitor,
  Cpu,
  Mouse,
  Gamepad2,
  HardDrive,
  Headphones,
};

const categoryImages: Record<string, string> = {
  '1': '/images/categories/pc_new.jpg',         // PC
  '2': '/images/categories/components_new.jpg', // Composants
  '3': '/images/categories/peripherals_new.jpg',// Périphériques
  '4': '/images/categories/gaming_new.jpg',     // Gaming
  '5': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=2070&auto=format&fit=crop', // Stockage
  '6': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2070&auto=format&fit=crop', // Audio
};

export function Home() {
  const navigate = useNavigate();
  const featuredProducts = mockProducts.filter(p => p.featured);

  const handleAddToCart = (product: any) => {
    toast.success(`${product.name} ajouté au panier !`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      {/* Hero Section - FORCED DARK */}
      <div className="dark">
        <section className="relative overflow-hidden bg-[#0f0518] border-b border-white/5 min-h-[700px] flex items-center">
          {/* Spotlight Effect */}
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Left content (Text and Buttons) */}
              <div className="flex-1 max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-foreground to-primary/80">
                  <span className="block">Bienvenue dans votre</span>
                  <span className="block">boutique en ligne</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-xl font-light">
                  Accédez à des milliers de produits soigneusement sélectionnés, aux meilleurs prix. Une expérience d’achat fluide, sécurisée et pensée pour vous.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Button
                    size="lg"
                    variant="glow"
                    onClick={() => navigate('/catalog')}
                    className="h-14 px-8 text-lg font-semibold"
                  >
                    Explorer les produits
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="glass"
                    onClick={() => navigate('/register')}
                    className="h-14 px-8 text-lg font-semibold"
                  >
                    Devenir vendeur
                  </Button>
                </div>
              </div>

              {/* Right content (Spline Scene) */}
              <div className="flex-1 w-full h-[400px] lg:h-[600px] relative animate-in fade-in slide-in-from-right-8 duration-1000">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-transparent to-transparent pointer-events-none"></div>
        </section>
      </div>

      {/* Features Section */}
      <section className="bg-background border-y border-border/50 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-card/50 dark:bg-white/5 border border-border/50 shadow-soft hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                <Truck className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-xl mb-2">Livraison gratuite</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Dans les 58 wilayas en moins de 48h en Algérie</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-card/50 dark:bg-white/5 border border-border/50 shadow-soft hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                <Gift className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-xl mb-2">Offre exclusive</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Avantages exclusifs (cadeaux, promos) selon votre achat</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-card/50 dark:bg-white/5 border border-border/50 shadow-soft hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                <Settings className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-xl mb-2">Adapté à vos besoins</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Produits high-tech sélectionnés pour votre performance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - FORCED DARK */}
      <div className="dark">
        <section className="bg-[#0f0518] relative py-20 border-b border-white/5">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Dimensions technologiques</h2>
              <p className="text-lg text-gray-400">Naviguez à travers nos écosystèmes d'innovation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 6).map((category, index) => {
                const Icon = categoryIcons[category.icon as keyof typeof categoryIcons];
                return (
                  <button
                    key={category.id}
                    onClick={() => navigate(`/catalog?category=${category.id}`)}
                    className={`relative group overflow-hidden rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-500 text-left bg-card/20 backdrop-blur-md ${index === 0 ? 'md:col-span-2 lg:col-span-2 row-span-2' : ''}`}
                    style={{ minHeight: index === 0 ? '400px' : '250px' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] to-transparent opacity-80 z-10 transition-opacity group-hover:opacity-90"></div>
                    <div
                      className="absolute inset-0 scale-100 group-hover:scale-110 transition-transform duration-700 bg-cover bg-center opacity-40"
                      style={{ backgroundImage: `url('${categoryImages[category.id] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'}')` }}
                    ></div>

                    <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                      <div className="w-14 h-14 bg-background/50 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                        <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-colors" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-primary transition-colors">{category.name}</h3>
                      <div className="flex items-center text-sm text-gray-300 font-medium">
                        <span>{category.count} protocoles disponibles</span>
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[500px] bg-primary/5 -translate-y-1/2 blur-[100px] pointer-events-none z-0"></div>

        <div className="flex items-end justify-between mb-12 relative z-10">
          <div>
            <h2 className="text-4xl font-extrabold text-foreground mb-3 tracking-tight">recommandations pour vous</h2>
            <p className="text-lg text-muted-foreground">recommandations pour vous</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/catalog')} className="hidden sm:flex border-border hover:border-primary/50 text-foreground hover:bg-primary/5">
            Explorer le terminal
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Vendor CTA Section */}
      <div className="dark">
        <section className="relative overflow-hidden py-24 border-y border-white/5 bg-[#0f0518]">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-primary/10 blur-[100px] pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="text-center max-w-2xl mx-auto bg-card/60 backdrop-blur-xl p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <h2 className="text-4xl font-bold mb-6 text-white">Vendez avec nous</h2>
              <p className="text-lg text-gray-400 mb-10">
                Rejoignez notre plateforme et développez vos ventes en touchant des milliers de clients potentiels.
              </p>
              <Button
                size="lg"
                variant="glow"
                onClick={() => navigate('/register?role=vendor')}
                className="h-14 px-10 text-lg w-full sm:w-auto hover:-translate-y-1 transition-transform"
              >
                Intégrer le réseau
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
