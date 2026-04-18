import { useState, useEffect } from 'react';
import { Package, Search, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { commandeService } from '../../services/commande.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const statusColors: Record<string, string> = {
  en_cours: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completer: 'bg-green-500/20 text-green-400 border-green-500/30',
  annulee: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels: Record<string, string> = {
  en_cours: 'En cours',
  completer: 'Livrée',
  annulee: 'Annulée',
};

export function CustomerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const [histRes, enCoursRes] = await Promise.all([
          commandeService.getHistorique(),
          commandeService.getEnCours(),
        ]);
        const all = [
          ...(enCoursRes.commandes_en_cours || []),
          ...(histRes.historique || []),
        ];
        // Deduplicate by id
        const seen = new Set();
        const unique = all.filter(o => {
          if (seen.has(o.id)) return false;
          seen.add(o.id);
          return true;
        });
        // Sort by date desc
        unique.sort((a, b) => new Date(b.date_commande).getTime() - new Date(a.date_commande).getTime());
        setOrders(unique);
        setFiltered(unique);
      } catch (err: any) {
        toast.error('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(orders);
    } else {
      const q = search.toLowerCase();
      setFiltered(orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.adresse?.ville?.toLowerCase().includes(q) ||
        o.statut_commande?.toLowerCase().includes(q)
      ));
    }
  }, [search, orders]);

  const handleAnnuler = async (orderId: string) => {
    if (!window.confirm('Confirmer l\'annulation de cette commande ?')) return;
    try {
      await commandeService.annuler(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statut_commande: 'annulee' } : o));
      toast.success('Commande annulée avec succès');
    } catch (err: any) {
      toast.error(err.message || 'Impossible d\'annuler cette commande');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-mono animate-pulse uppercase tracking-widest text-sm">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

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
                <span className="text-sm font-mono tracking-[0.3em] uppercase opacity-70">{t('customerOrders.subtitle')}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{t('customerOrders.title')}</h1>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
                {orders.length} commande{orders.length !== 1 ? 's' : ''} au total
              </p>
            </div>

            <div className="relative group/search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Rechercher par ID, ville, statut..."
                className="bg-card/40 border border-border rounded-xl pl-10 pr-4 py-2 w-full md:w-72 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filtered.length > 0 ? (
            filtered.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-all group shadow-soft"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center border border-border">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-mono tracking-tight group-hover:text-primary transition-colors">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date_commande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <Badge className={`${statusColors[order.statut_commande] || 'bg-gray-500/20 text-gray-400'} border font-mono uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full`}>
                        {statusLabels[order.statut_commande] || order.statut_commande}
                      </Badge>
                      <div className="text-right border-l border-border/50 pl-4">
                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">Montant Total</p>
                        <p className="text-2xl font-black tabular-nums text-foreground">€{(order.montant_total || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  {order.ligne_commande && order.ligne_commande.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {order.ligne_commande.slice(0, 4).map((ligne: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border border-border hover:border-primary/20 transition-colors">
                          {ligne.produit?.image_url && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-border/50 shrink-0">
                              <img src={ligne.produit.image_url} alt={ligne.produit.nom_produit} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="hidden sm:block">
                            <p className="font-bold text-sm leading-tight text-foreground">{ligne.produit?.nom_produit}</p>
                            <p className="text-xs text-muted-foreground mt-1">Qté: {ligne.qte} • €{ligne.prix_at_time}</p>
                          </div>
                        </div>
                      ))}
                      {order.ligne_commande.length > 4 && (
                        <div className="w-12 h-12 rounded-xl border border-border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground font-mono">
                          +{order.ligne_commande.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      Livraison: {order.adresse?.ville || 'Non spécifiée'}, {order.adresse?.pays || ''}
                    </p>
                    <div className="flex items-center gap-3">
                      {order.statut_commande === 'en_cours' && (
                        <Button
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs rounded-xl"
                          onClick={() => handleAnnuler(order.id)}
                        >
                          Annuler
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="hover:bg-primary/10 hover:text-primary rounded-xl text-sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        Détails
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border shadow-inner">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold text-muted-foreground">
                {search ? 'Aucun résultat pour cette recherche' : 'Aucune commande pour l\'instant'}
              </p>
              {!search && (
                <Button variant="glow" size="lg" className="mt-6" onClick={() => navigate('/catalog')}>
                  Explorer le catalogue
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
