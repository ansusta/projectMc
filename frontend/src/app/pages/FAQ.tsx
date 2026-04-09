import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Zap, Radio, Database } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    icon: Zap,
    question: "Quelle est la rapidité de livraison des modules ?",
    answer: "Grâce à nos protocoles de logistique Warp, vos unités sont expédiées sous 24h et livrées en moyenne sous 2 à 4 cycles standards (jours ouvrés) en zone Nexus-Prime."
  },
  {
    icon: Radio,
    question: "Le support technique est-il assuré par des IA ?",
    answer: "Le premier niveau de support (Support Cybo) est géré par nos IA de classe 5. Pour les requêtes complexes, un agent humain prendra le relais sur le même canal."
  },
  {
    icon: Database,
    question: "Les produits sont-ils certifiés d'origine ?",
    answer: "Chaque produit vendu sur Nexus subit une vérification holographique de son code source et de ses composants avant d'être listé dans le catalogue."
  },
  {
    icon: Shield,
    question: "Puis-je retourner une unité défectueuse ?",
    answer: "Oui, vous disposez de 14 cycles après réception pour signaler une anomalie et obtenir un renvoi vers le marchand pour réparation ou échange standard."
  }
];

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 mb-6">
            <HelpCircle className="w-8 h-8 text-secondary shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Base de Connaissances</h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Réponses aux interrogations fréquentes dans le Nexus</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                    <faq.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg group-hover:text-primary transition-colors">{faq.question}</span>
                </div>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <div className="h-px bg-white/5 mb-6"></div>
                  <p className="text-muted-foreground leading-relaxed pl-14">
                    {faq.answer}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-primary/10 border border-primary/20 rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Encore des zones d'ombre ?</h3>
          <p className="text-muted-foreground mb-6">Nos agents sont prêts à synchroniser vos données.</p>
          <a href="/contact" className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all">
            Contacter le support <Radio className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
