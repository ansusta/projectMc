import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, ShieldCheck, ArrowRight, ArrowLeft, Check, Lock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import { commandeService, MethodePaiement } from '../../services/commande.service';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function CheckoutPayment() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { total: cartTotal, items, isLoading: cartLoading, refresh: refreshCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<MethodePaiement>('carteVisa');
  const [isProcessing, setIsProcessing] = useState(false);
  const isPaid = useRef(false);

   const paymentMethods = [
    { id: 'carteVisa', name: t('checkout.payment.methods.visa'), icon: CreditCard, desc: t('checkout.payment.methods.visaDesc') },
    { id: 'carteDahabia', name: t('checkout.payment.methods.dahabia'), icon: ShieldCheck, desc: t('checkout.payment.methods.dahabiaDesc') },
    { id: 'paypal', name: t('checkout.payment.methods.paypal'), icon: Wallet, desc: t('checkout.payment.methods.paypalDesc') },
  ];

  useEffect(() => {
    if (!cartLoading && items.length === 0 && !isPaid.current) {
      toast.error(t('cart.emptyRedirect'));
      navigate('/catalog');
    }
  }, [items, cartLoading, navigate, t]);

  const shippingPrice = parseFloat(localStorage.getItem('checkout_shipping_price') || '0');
  const addressId = localStorage.getItem('checkout_address_id');
  const finalTotal = cartTotal + shippingPrice;

  const handleProcessPayment = async () => {
    if (!addressId) {
      toast.error(t('checkout.address.errorLoading'));
      navigate('/checkout/address');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const res = await commandeService.passer(addressId, selectedMethod);
      toast.success(t('checkout.payment.bankAuthSuccess'));
      
      localStorage.removeItem('checkout_address_id');
      localStorage.removeItem('checkout_shipping_method');
      localStorage.removeItem('checkout_shipping_price');
      
      isPaid.current = true;
      navigate('/checkout/success', { state: { orderId: res.commande_id, total: finalTotal } });
      await refreshCart();
    } catch (err: any) {
      toast.error(err.message || t('checkout.payment.bankAuthFailure'));
      navigate('/checkout/failure');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 relative px-4">
           <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 z-0"></div>
           {[
             { step: 1, label: t('cart.title'), active: true, done: true },
             { step: 2, label: t('checkout.address.title'), active: true, done: true },
             { step: 3, label: t('checkout.shipping.title'), active: true, done: true },
             { step: 4, label: t('checkout.payment.title'), active: true, done: false },
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
            <h1 className="text-3xl font-black tracking-tight">{t('checkout.payment.paymentTitle')}</h1>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id as MethodePaiement)}
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
                    {selectedMethod === method.id && <div className="p-1 bg-primary rounded-full"><Check className="text-white w-4 h-4" /></div>}
                  </div>
                </div>
              ))}
            </div>

            {selectedMethod === 'carteVisa' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest ml-1">{t('checkout.payment.cardNum')}</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="XXXX XXXX XXXX XXXX" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                      disabled={isProcessing}
                    />
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest ml-1">{t('checkout.payment.expiry')}</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest ml-1">{t('checkout.payment.cvc')}</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        placeholder="***" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                        disabled={isProcessing}
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sticky top-28">
              <h2 className="text-xl font-bold mb-6 italic">{t('checkout.payment.orderSummary')}</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>{t('cart.subtotal')}</span>
                  <span>{cartTotal.toLocaleString(i18n.language, { style: 'currency', currency: 'EUR' })}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>{t('cart.shipping')}</span>
                  <span>{shippingPrice.toLocaleString(i18n.language, { style: 'currency', currency: 'EUR' })}</span>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="flex justify-between text-2xl font-black text-primary">
                  <span>{t('cart.total')}</span>
                  <span className="tabular-nums">{finalTotal.toLocaleString(i18n.language, { style: 'currency', currency: 'EUR' })}</span>
                </div>
              </div>

              <div className="mb-8 p-4 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-[10px] text-green-500/80 leading-relaxed font-mono uppercase">
                  {t('checkout.payment.secureInfo')}
                </p>
              </div>

              <Button 
                variant="glow" 
                className="w-full h-16 font-black text-xl"
                onClick={handleProcessPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    {t('checkout.payment.processing')}
                  </>
                ) : (
                  <>
                    {t('checkout.payment.payNow')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full h-12 mt-4 hover:bg-white/5 opacity-50"
                onClick={() => navigate('/checkout/shipping')}
                disabled={isProcessing}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('checkout.shipping.back')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
