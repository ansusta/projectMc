import { motion } from 'framer-motion';
import { XCircle, ShieldAlert, RefreshCcw, Home, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';

export function OrderFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 mb-8 relative">
            <XCircle className="w-12 h-12 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl animate-pulse"></div>
          </div>

          <h1 className="text-4xl font-black tracking-tight mb-4 text-red-500">Flux de Crédit Rejeté !</h1>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed px-4">
            Le protocole de paiement a été interrompu par le réseau bancaire ou une synchronisation Nexus a échoué.
          </p>

          <div className="bg-card/20 backdrop-blur-xl border border-red-500/10 rounded-3xl p-8 mb-10 text-left space-y-4">
            <div className="flex items-center gap-3 text-red-500 font-bold mb-4">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-xl">Origine de l'Interruption</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground font-mono">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/40"></div>
                Vérification d'identité échouée (3D-Secure).
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/40"></div>
                Plafond de crédit insuffisant sur le canal.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/40"></div>
                Désynchronisation avec le fournisseur de services.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="glow" 
              size="lg" 
              className="w-full h-14 font-bold bg-red-500 text-white hover:bg-red-600 shadow-red-500/20 border-red-400/20"
              onClick={() => navigate('/checkout/payment')}
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Réessayer Transaction
            </Button>
            <Button 
              variant="glass" 
              size="lg" 
              className="w-full h-14 font-bold"
              onClick={() => navigate('/catalog')}
            >
              <Home className="w-5 h-5 mr-2" />
              Menu Principal
            </Button>
          </div>

          <p className="mt-12 text-xs text-muted-foreground font-mono uppercase tracking-widest opacity-40">
            Besoin d'assistance ? <a href="/contact" className="underline hover:text-primary transition-colors">Contacter le support Nexus</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
