import { ShoppingBag, Heart, Package, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { mockOrders, mockProducts } from '../lib/mock-data';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels = {
  pending: 'En attente',
  processing: 'En cours',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export function CustomerDashboard() {
  const navigate = useNavigate();
  const recentOrders = mockOrders.slice(0, 3);
  const recommendedProducts = mockProducts.slice(0, 4);
  const totalSpent = mockOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 text-primary mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(139,92,246,1)]"></div>
            <span className="text-sm font-mono tracking-[0.3em] uppercase opacity-70">Système Operational</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Interface Client</h1>
          <p className="text-muted-foreground text-lg italic">Bienvenue dans votre centre de contrôle Nexus</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Secteurs Actifs"
            value={mockOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
            className="bg-card/40 backdrop-blur-xl border-border shadow-soft hover:shadow-md transition-all"
          />
          <StatCard
            title="Flux de Crédits"
            value={`€${totalSpent.toLocaleString()}`}
            icon={ShoppingBag}
            trend={{ value: 8, isPositive: true }}
            className="bg-card/40 backdrop-blur-xl border-border shadow-soft hover:shadow-md transition-all"
          />
          <StatCard
            title="Modules Favoris"
            value="23"
            icon={Heart}
            description="Unités mémorisées"
            className="bg-card/40 backdrop-blur-xl border-border shadow-soft hover:shadow-md transition-all"
          />
          <StatCard
            title="Index Fidélité"
            value="1,245"
            icon={TrendingUp}
            trend={{ value: 15, isPositive: true }}
            className="bg-card/40 backdrop-blur-xl border-border shadow-soft hover:shadow-md transition-all"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-soft">
              <div className="p-8 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Signal des Commandes</h2>
                    <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-widest">Derniers transferts de données</p>
                  </div>
                  <Button variant="ghost" className="hover:bg-white/10" onClick={() => navigate('/customer/orders')}>
                    Accéder à la base
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-8 hover:bg-muted/30 transition-all group">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{order.id}</p>
                        <p className="text-sm font-mono text-muted-foreground">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <Badge className={`${statusColors[order.status]} border font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full`}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="relative group/item overflow-hidden rounded-xl border border-border w-20 h-20 shadow-sm">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover transition-transform group-hover/item:scale-125 duration-500"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Index: {order.items.length} UNITE{order.items.length > 1 ? 'S' : ''}
                      </p>
                      <p className="text-2xl font-black text-foreground tabular-nums">€{order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <div className="bg-card/40 backdrop-blur-2xl rounded-2xl border border-border p-8 shadow-soft">
              <h2 className="text-xl font-bold mb-6 tracking-tight">Protocoles Rapides</h2>
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/catalog')}
                  variant="glow"
                  className="w-full h-12 justify-start pl-6"
                >
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  Initialiser Catalogue
                </Button>
                <Button
                  onClick={() => navigate('/customer/orders')}
                  variant="glass"
                  className="w-full h-12 justify-start pl-6"
                >
                  <Package className="w-5 h-5 mr-3" />
                  Base Commandes
                </Button>
                <Button
                  onClick={() => navigate('/customer/favorites')}
                  variant="glass"
                  className="w-full h-12 justify-start pl-6"
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Modules Favoris
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary/60 rounded-2xl p-8 relative overflow-hidden group shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              <h3 className="text-2xl font-black mb-3">OFFRE NEXUS</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Optimisez votre prochain transfert (-15%) avec la clé de cryptage: <span className="font-mono bg-white/20 px-2 py-0.5 rounded ml-1 font-bold">WELCOME15</span>
              </p>
              <Button className="w-full bg-white text-primary border-none hover:bg-white/90 font-bold h-12 rounded-xl">
                Injecter Code
              </Button>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Analyse Prédictive</h2>
              <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-mono mt-1">Modules suggérés par l'IA</p>
            </div>
            <Button variant="ghost" className="hover:bg-white/10" onClick={() => navigate('/catalog')}>
              Tout voir
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => toast.success('Produit ajouté au panier !')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
