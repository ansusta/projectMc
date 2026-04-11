import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, MapPin, CreditCard, ShieldCheck, Download, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockOrders } from '../lib/mock-data';
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

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find order in mock data
  const order = mockOrders.find(o => o.id === id) || mockOrders[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Button 
              variant="ghost" 
              className="mb-4 -ml-4 hover:bg-white/5 opacity-70"
              onClick={() => navigate('/customer/orders')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'Historique
            </Button>
            <div className="flex items-center gap-3 text-primary mb-2">
              <span className="text-sm font-mono tracking-[0.3em] uppercase opacity-70">Rapport de Flux détaillée</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">{order.id}</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="glass" size="lg">
              <Printer className="w-5 h-5 mr-3" />
              Imprimer Ticket
            </Button>
            <Button variant="glow" size="lg">
              <Download className="w-5 h-5 mr-3" />
              Facture PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Order Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-8">Modules Inclus</h2>
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{item.productName}</h3>
                        <p className="text-xl font-black tabular-nums">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                        <span>Quantité: {item.quantity}</span>
                        <span>•</span>
                        <span>Unité: €{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline / Progress */}
            <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                Chronologie du Signal
              </h2>
              <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                {[
                  { title: 'Commande Finalisée', date: '09 Avr 2026, 14:13', done: true },
                  { title: 'Traitement Nexus en cours', date: '09 Avr 2026, 14:45', done: true },
                  { title: 'Expédition Station Orbit', date: 'Prevu le 10 Avr', done: false },
                  { title: 'Livraison Certifiée', date: 'En attente', done: false },
                ].map((item, i) => (
                  <div key={i} className={`relative pl-10 ${item.done ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background z-10 ${
                      item.done ? 'bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-white/20'
                    }`}></div>
                    <h3 className={`font-bold ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>{item.title}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Status & Info */}
          <div className="space-y-8">
            <div className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
              <Badge className={`${statusColors[order.status]} border font-mono uppercase tracking-widest text-xs px-6 py-2 rounded-full mb-8 w-full justify-center`}>
                {statusLabels[order.status]}
              </Badge>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    Point d'Expédition
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90 font-bold">
                    {order.customer}<br />
                    123 Rue de la Matrice, Secteur 04<br />
                    16000 Alger, Algérie
                  </p>
                </div>

                <div className="h-px bg-white/5"></div>

                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
                    <CreditCard className="w-3 h-3" />
                    Protocole de Paiement
                  </h3>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-bold">Carte Visa **** 4242</p>
                      <p className="text-xs text-muted-foreground italic">Autorisation: OK-TX99</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/5"></div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Modules (Subtotal)</span>
                    <span className="tabular-nums">€{(order.total * 0.8).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Logistique Warp</span>
                    <span className="tabular-nums">€12.99</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>TVA (20%)</span>
                    <span className="tabular-nums">€{(order.total * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-primary pt-4">
                    <span>TOTAL</span>
                    <span className="tabular-nums">€{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <p className="text-[10px] text-primary leading-relaxed uppercase tracking-widest font-bold mb-4">Besoin d'aide sur cet unité ?</p>
              <Button variant="ghost" className="w-full hover:bg-primary/10 hover:text-primary transition-all text-xs border border-primary/20 h-10">
                Signaler un bug matériel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
