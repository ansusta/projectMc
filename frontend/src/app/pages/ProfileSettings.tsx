import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../../services/user.service';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { User, Mail, Shield, ArrowLeft, Loader2, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.nomUtilisateur || '',
    email: user?.email || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      await userService.updateProfile(user.id, {
        nom_utilisateur: formData.username,
        email: formData.email,
      });
      toast.success('Profil synchronisé avec succès.');
      await refreshUser();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la synchronisation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          variant="ghost" 
          className="mb-8 -ml-4 hover:bg-white/5 opacity-70"
          onClick={() => navigate('/customer/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Button>

        <div className="mb-12">
          <div className="flex items-center gap-3 text-secondary mb-3">
            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(34,211,238,1)]"></div>
            <span className="text-sm font-mono tracking-[0.3em] uppercase opacity-70">Configuration Système</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Paramètres du Profil</h1>
          <p className="text-muted-foreground mt-2">Gérez vos identifiants et vos protocoles de communication.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                Informations d'Identité
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest ml-1">Nom d'utilisateur</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest ml-1">Canal de Communication (Email)</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <Button variant="glow" size="lg" className="w-full h-14 font-bold" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mettre à jour le Signal'}
                </Button>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
            >
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-red-400">
                <Key className="w-5 h-5" />
                Sécurité & Chiffrement
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Pour modifier votre clé d'accès (mot de passe), un protocole de vérification par email est requis.
              </p>
              <Button variant="glass" className="w-full border-red-500/20 hover:bg-red-500/10 text-red-400">
                Réinitialiser le Mot de Passe
              </Button>
            </motion.div>
          </div>

          {/* Sidebar Status */}
          <div className="space-y-6">
            <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 relative">
                 <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
                 <span className="text-3xl font-black text-primary relative z-10">{user?.nomUtilisateur?.[0].toUpperCase()}</span>
              </div>
              <h3 className="text-xl font-bold mb-1">{user?.nomUtilisateur}</h3>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{user?.role}</p>
              
              <div className="mt-8 space-y-4 pt-8 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    <span>Statut Compte</span>
                    <span className="text-green-500 font-bold">Actif</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    <span>Niveau Sécurité</span>
                    <span className="text-secondary font-bold">Clas 4</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <div className="flex gap-4 items-start">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Votre identifiant de session est authentifié via Supabase Auth System. Ne partagez jamais vos jetons JWT.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
