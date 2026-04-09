import { motion } from 'framer-motion';
import { ShieldCheck, Scale, FileText } from 'lucide-react';

export function Terms() {
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
              <Scale className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Conditions Générales</h1>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Protocoles d'utilisation Nexus // Version 2.4.0</p>
          </div>

          <section className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">1. Acceptation des Termes</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              En accédant au Nexus, vous acceptez d'être lié par les présents protocoles d'utilisation. Ces conditions régissent toutes les interactions au sein de la matrice Nexus, y compris l'achat de modules technologiques et l'échange de données.
              
              Si vous n'acceptez pas ces conditions, veuillez déconnecter votre session immédiatement.
            </p>
          </section>

          <section className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">2. Sécurité des Transactions</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Toutes les transactions effectuées sur Nexus-Prime sont sécurisées par cryptage de bout en bout. Nous nous réservons le droit d'annuler tout transfert de crédits suspecté de violation des protocoles de sécurité universels.
            </p>
          </section>

          <section className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">3. Droits du Marchand</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Les vendeurs partenaires de Nexus conservent la propriété intellectuelle de leurs modules jusqu'à la finalisation du transfert de propriété lors de la livraison certifiée.
            </p>
          </section>

          <div className="text-center pt-10 text-xs text-muted-foreground font-mono opacity-50 uppercase tracking-widest">
            Dernière mise à jour : 2026.04.09 // NEXUS-LEGAL-DEPT
          </div>
        </motion.div>
      </div>
    </div>
  );
}
