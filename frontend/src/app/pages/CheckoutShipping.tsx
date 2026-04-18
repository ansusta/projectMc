import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Zap, Calendar, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useCart } from '../contexts/CartContext';
import { useEffect } from 'react';

const shippingMethods = [
  {
    id: 'standard',
    name: 'Logistique Standard',
    desc: 'Livraison sous 5-7 cycles standards.',
    price: 0,
    icon: Calendar,
  },
  {
    id: 'express',
    name: 'Transfert Warp',
    desc: 'Livraison prioritaire sous 2-3 cycles.',
    price: 9.99,
    icon: Truck,
  },
  {
    id: 'nexus_prime',
    name: 'Nexus Prime Instant',
    desc: 'Livraison sous 24h avec drone porteur.',
    price: 24.99,
    icon: Zap,
  },
];

export function CheckoutShipping() {
  const navigate = useNavigate();
  const { items, isLoading: cartLoading } = useCart();
  const [selectedMethod, setSelectedMethod] = useState('standard');

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      toast.error('Votre panier est vide. Redirection vers le catalogue...');
      navigate('/catalog');
    }
  }, [items, cartLoading, navigate]);

  const handleContinue = () => {
    localStorage.setItem('checkout_shipping_method', selectedMethod);
    const method = shippingMethods.find(m => m.id === selectedMethod);
    localStorage.setItem('checkout_shipping_price', (method?.price || 0).toString());
    navigate('/checkout/payment');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 relative px-4">
           <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 z-0"></div>
           {[
             { step: 1, label: 'Panier', active: true, done: true },
             { step: 2, label: 'Adresse', active: true, done: true },
             { step: 3, label: 'Livraison', active: true, done: false },
             { step: 4, label: 'Paiement', active: false, done: false },
           ].map((s) => (
             <div key={s.step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border transition-all ${
                  s.active ? 'bg-primary border-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-background border-white/20 text-muted-foreground'
                }`}>
                  {s.done ? <Check className="w-4 h-4" /> : s.step}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${s.active ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <h1 className="text-3xl font-black tracking-tight">Vitesse de transfert</h1>

            <div className="space-y-4">
              {shippingMethods.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer relative group ${
                    selectedMethod === method.id ? 'bg-primary/10 border-primary' : 'bg-card/20 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                        selectedMethod === method.id ? 'bg-primary/20 border-primary/30' : 'bg-white/5 border-white/10'
                      }`}>
                        <method.icon className={`w-6 h-6 ${selectedMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{method.name}</p>
                        <p className="text-muted-foreground text-sm">{method.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black">{method.price === 0 ? 'GRATUIT' : `€${method.price}`}</p>
                      {selectedMethod === method.id && <Check className="text-primary w-6 h-6 ml-auto mt-2" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sticky top-28">
              <h2 className="text-xl font-bold mb-6">Résumé de l'expédition</h2>
              <div className="space-y-4 mb-8">
                <p className="text-sm text-muted-foreground">Sélectionnez le protocole de livraison optimal pour vos modules technologiques.</p>
                <div className="h-px bg-white/5"></div>
                <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-primary">
                  <span>Frais logistique</span>
                  <span>{selectedMethod === 'standard' ? '0.00' : shippingMethods.find(m => m.id === selectedMethod)?.price} €</span>
                </div>
              </div>
              <Button 
                variant="glow" 
                className="w-full h-14 font-bold text-lg"
                onClick={handleContinue}
              >
                Paiement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                className="w-full h-12 mt-4 hover:bg-white/5"
                onClick={() => navigate('/checkout/address')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Détails Adresse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
