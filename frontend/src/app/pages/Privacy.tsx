import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Globe } from 'lucide-react';

export function Privacy() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
              <Shield className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Protection des Données</h1>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Protocoles de confidentialité Nexus // RGPD-Compliance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Eye, title: 'Transparence', desc: 'Savoir exactement quelles données nous captons.' },
              { icon: Lock, title: 'Sécurité', desc: 'Cryptage AES-256 de tous vos identifiants.' },
              { icon: Globe, title: 'Souveraineté', desc: 'Vous restez maître de vos segments de données.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center">
                <item.icon className="w-8 h-8 text-secondary mx-auto mb-4" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <section className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              Collecte de segments
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Le Nexus collecte uniquement les segments de données nécessaires au bon fonctionnement de vos transferts : identifiants de session, coordonnées de livraison et historique de navigation pour optimiser vos prédictions d'achat par IA.
            </p>
          </section>

          <section className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              Conservation
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vos données sont stockées dans des serveurs cryogénisés ultra-sécurisés. Elles sont automatiquement purgées après 5 cycles standards d'inactivité, sauf instruction contraire de votre part.
            </p>
          </section>

          <div className="text-center pt-10 text-xs text-muted-foreground font-mono opacity-50 uppercase tracking-widest">
            Dernière mise à jour : 2026.04.09 // NEXUS-SECURITY-DEPT
          </div>
        </motion.div>
      </div>
    </div>
  );
}
