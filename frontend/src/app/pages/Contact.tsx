import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Signal de contact transmis au centre de contrôle Nexus.');
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <MessageSquare className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Centre de Liaison Nexus</h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Connectez-vous avec nos agents de support et d'administration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 lg:p-12 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-8">Transmettre un Signal</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">Identifiant</label>
                  <input 
                    type="text" 
                    placeholder="Votre nom"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">Canal Email</label>
                  <input 
                    type="email" 
                    placeholder="votre@nexus.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">Sujet du Transfert</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm appearance-none">
                  <option className="bg-background">Support Technique</option>
                  <option className="bg-background">Réseau Vendeur</option>
                  <option className="bg-background">Signalement Erreur</option>
                  <option className="bg-background">Autres Protocoles</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">Message de Données</label>
                <textarea 
                  rows={5}
                  placeholder="Décrivez votre requête..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                  required
                ></textarea>
              </div>

              <Button variant="glow" size="lg" className="w-full h-14 text-lg font-bold">
                <Send className="w-5 h-5 mr-3" />
                Injecter Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Mail, label: 'Email Central', value: 'core@nexus-prime.net' },
                { icon: Phone, label: 'Liaison Vocale', value: '+213 555 123 456' },
                { icon: MapPin, label: 'Station Physique', value: 'Secteur 04, Alger' },
                { icon: MessageSquare, label: 'Chat Cybo', value: 'Disponible 24/7' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <item.icon className="w-6 h-6 text-primary mb-4" />
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">Temps de Réponse</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nos agents Nexus sont opérationnels 24h/24, 7j/7. Le temps moyen de traitement d'un signal est de <strong>1.4 millisecondes</strong> (temps de réception) et nous vous répondrons sous <strong>2.4 heures</strong> standards.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
