import { motion } from 'framer-motion';
import { Info, MapPin, Globe, CreditCard } from 'lucide-react';

export function Legal() {
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
              <Info className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Mentions Légales</h1>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Identité du hub Nexus-Prime // Registre Interstellaire</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Éditeur</h2>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><strong className="text-foreground">Raison Sociale:</strong> Nexus-Prime Technologies</li>
                <li><strong className="text-foreground">Directeur:</strong> Cyber-Core 01</li>
                <li><strong className="text-foreground">Capital:</strong> 1.000.000.000 Crédits Nexus</li>
                <li><strong className="text-foreground">RCS:</strong> Alger B 123 456 789</li>
              </ul>
            </section>

            <section className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Siège Social</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Quartier de l'Innovation, Secteur 04<br />
                Pôle Technologique de Sidi Abdellah<br />
                Alger, Algérie<br />
                <span className="font-mono text-xs opacity-50 uppercase tracking-widest mt-4 block italic">Liaison : contact@nexus-prime.net</span>
              </p>
            </section>

            <section className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Hébergement</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ce hub est hébergé sur les serveurs décentralisés de <br />
                <strong className="text-foreground">Supabase Cloud Systems</strong>.<br />
                Data Center : Région Europe-West
              </p>
            </section>

            <section className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl border-dashed border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Propriété</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                L'ensemble du design "Nexus" et des protocoles associés sont la propriété exclusive de Nexus-Prime. Toute reproduction non autorisée sera traitée par nos agents de conformité.
              </p>
            </section>
          </div>

          <div className="text-center pt-10 text-xs text-muted-foreground font-mono opacity-50 uppercase tracking-widest">
            Protocoles juridiques mis à jour le : 2026.04.09
          </div>
        </motion.div>
      </div>
    </div>
  );
}
