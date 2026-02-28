import { Package, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0a0311] border-t border-white/5 mt-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 group cursor-pointer w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-primary opacity-50 blur-md rounded-full group-hover:opacity-100 transition-opacity"></div>
                <Package className="w-6 h-6 text-white relative z-10" />
              </div>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">NEXUS</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre hub technologique premium de confiance pour découvrir le futur de l'innovation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 tracking-wide font-mono">LIENS RAPIDES</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/catalog" className="hover:text-primary transition-colors hover:pl-1">Catalogue</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors hover:pl-1">La Matrice</a></li>
              <li><a href="/vendors" className="hover:text-primary transition-colors hover:pl-1">Réseau Vendeurs</a></li>
              <li><a href="/help" className="hover:text-primary transition-colors hover:pl-1">Support Cybo</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 tracking-wide font-mono">SECTEURS</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/catalog?category=pc" className="hover:text-primary transition-colors hover:pl-1">Stations Orbit</a></li>
              <li><a href="/catalog?category=components" className="hover:text-primary transition-colors hover:pl-1">Hardware</a></li>
              <li><a href="/catalog?category=gaming" className="hover:text-primary transition-colors hover:pl-1">Simulateurs</a></li>
              <li><a href="/catalog?category=audio" className="hover:text-primary transition-colors hover:pl-1">Acoustique</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 tracking-wide font-mono">COMMUNICATIONS</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                contact@nexus-prime.net
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                Code.Comm: 890.31X
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                Néo-Paris, Secteur 7
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground flex justify-between items-center">
          <p>&copy; 2026 NEXUS. Protocoles sécurisés.</p>
          <div className="flex gap-4">
            <span className="w-2 h-2 rounded-full bg-primary/20 animate-pulse mt-1.5 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
            <span>Systèmes opérationnels</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
