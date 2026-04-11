import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Package } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(name, email, password, role);
      toast.success('Compte créé avec succès ! Protocoles synchronisés.');

      // Navigation is now handled based on the actual logged in state
      if (role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/customer/dashboard');
    } catch (error: any) {
      if (error.message.includes("Veuillez vous connecter manuellement")) {
        toast.info(error.message);
        navigate('/login');
      } else {
        toast.error(error.message || 'Erreur lors de la création du compte');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-primary opacity-50 blur-md rounded-full group-hover:opacity-100 transition-opacity"></div>
              <Package className="w-12 h-12 text-white relative z-10" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">NEXUS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Nouveau Profil</h1>
          <p className="text-muted-foreground font-medium">Rejoignez l'écosystème Nexus Prime</p>
        </div>

        <div className="bg-card/20 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nom Complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="Alias Operationnel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Protocol Identifier (Email)</Label>
              <Input
                id="email"
                type="email"
                placeholder="unit@nexus-prime.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Clé d'Accès</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-foreground"
              />
              <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase tracking-tighter opacity-50">Sécurité minimale: 8 fragments</p>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Catégorie d'Accès</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as 'customer' | 'vendor')} className="mt-4 space-y-3">
                <div className="flex items-center space-x-3 border border-white/5 bg-white/5 rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer group">
                  <RadioGroupItem value="customer" id="customer" className="border-white/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary" />
                  <Label htmlFor="customer" className="flex-1 cursor-pointer">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">Opérateur (Client)</div>
                    <div className="text-xs text-muted-foreground">Acquisition de ressources technologiques</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border border-white/5 bg-white/5 rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer group">
                  <RadioGroupItem value="vendor" id="vendor" className="border-white/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary" />
                  <Label htmlFor="vendor" className="flex-1 cursor-pointer">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">Fournisseur (Vendeur)</div>
                    <div className="text-xs text-muted-foreground">Distribution de modules Nexus</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-start gap-3 p-1">
              <input type="checkbox" required className="mt-1 rounded border-white/20 bg-white/5 checked:bg-primary" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Je valide les{' '}
                <a href="#" className="text-primary hover:text-white transition-colors underline decoration-primary/30 underline-offset-4">
                  Protocoles de Service
                </a>{' '}
                et la{' '}
                <a href="#" className="text-primary hover:text-white transition-colors underline decoration-primary/30 underline-offset-4">
                  Gestion des Données
                </a>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="glow"
              className="w-full h-14 text-lg font-bold"
            >
              {isLoading ? 'Initialisation...' : 'Créer le Profil Nexus'}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-muted-foreground font-medium">
            Déjà identifié ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary-foreground font-bold transition-all"
            >
              S'authentifier
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
