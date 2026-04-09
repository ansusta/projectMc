import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Home, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 mb-8 relative">
            <ShieldAlert className="w-12 h-12 text-red-500" />
            <div className="absolute inset-0 rounded-3xl bg-red-500/20 blur-xl animate-pulse"></div>
          </div>

          <h1 className="text-8xl font-black tracking-tighter text-foreground mb-4 font-mono relative">
            404
            <span className="absolute -inset-1 text-primary opacity-20 blur-sm animate-pulse">404</span>
          </h1>

          <div className="flex items-center justify-center gap-3 text-red-500/80 mb-6 font-mono text-xs uppercase tracking-[0.3em]">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
            Signal Interrompu : Nexus-Error-04
          </div>

          <h2 className="text-2xl font-bold mb-4">Secteur Non Répertorié</h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Vous avez atteint une zone morte du Nexus. Les données que vous recherchez ont été cryptées ou déplacées vers un autre secteur.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <Button 
              variant="glow" 
              size="lg" 
              className="w-full h-14 text-lg font-bold"
              onClick={() => navigate('/')}
            >
              <Home className="w-5 h-5 mr-2" />
              Retour à la Base
            </Button>
            
            <Button 
              variant="glass" 
              size="lg" 
              className="w-full h-14 font-mono text-sm uppercase tracking-widest"
              onClick={() => navigate(-1)}
            >
              Réinitialiser Session
            </Button>
          </div>
        </motion.div>

        {/* Technical Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 opacity-30 font-mono text-[10px] uppercase tracking-widest">
          Transmis par : SYSTÈME AUTOMATISÉ NEXUS // V.0.0.1
        </div>
      </div>
    </div>
  );
}
