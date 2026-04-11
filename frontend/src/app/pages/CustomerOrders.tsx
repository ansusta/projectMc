import { Package, Search, ChevronRight, ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockOrders } from '../lib/mock-data';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

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

export function CustomerOrders() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <Button 
            variant="ghost" 
            className="mb-6 -ml-4 hover:bg-muted opacity-70"
            onClick={() => navigate('/customer/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 text-primary mb-3">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,1)]"></div>
                <span className="text-sm font-mono tracking-[0.3em] uppercase opacity-70">Journal des Flux</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Historique des Commandes</h1>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Gérez et suivez vos transferts d'unités Nexus</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group/search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Rechercher une commande..."
                  className="bg-card/40 border border-border rounded-xl pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                />
              </div>
              <Button variant="glass" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {mockOrders.length > 0 ? (
            mockOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-all group shadow-soft"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center border border-border">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-mono tracking-tight group-hover:text-primary transition-colors">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <Badge className={`${statusColors[order.status]} border font-mono uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full`}>
                        {statusLabels[order.status]}
                      </Badge>
                      <div className="text-right border-l border-border/50 pl-4">
                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">Montant Total</p>
                        <p className="text-2xl font-black tabular-nums text-foreground">€{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-muted/30 rounded-xl p-3 border border-border hover:border-primary/20 transition-colors cursor-pointer group/item">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-border/50 shrink-0">
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="hidden sm:block">
                          <p className="font-bold text-sm leading-tight text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground mt-1">Qté: {item.quantity} • €{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
                      Destination: {order.customer} // Localisation Certifiée
                    </p>
                    <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary rounded-xl">
                      Détails de l'unité
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border shadow-inner">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold text-muted-foreground">Aucune commande détectée dans ce secteur</p>
              <Button variant="glow" size="lg" className="mt-6" onClick={() => navigate('/catalog')}>
                Initialiser Catalogue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
