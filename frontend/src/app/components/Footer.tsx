import { Package, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 group cursor-pointer w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-primary opacity-50 blur-md rounded-full group-hover:opacity-100 transition-opacity"></div>
                <Package className="w-6 h-6 text-white relative z-10" />
              </div>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 dark:from-white dark:to-white/70">NEXUS</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Votre hub technologique premium de confiance pour découvrir le futur de l'innovation.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-text-primary mb-4 tracking-wider text-xs uppercase">LIENS RAPIDES</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/catalog" className="hover:text-primary transition-colors hover:pl-1">Catalogue</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors hover:pl-1">FAQ / Support</Link></li>
              <li><Link to="/vendors" className="hover:text-primary transition-colors hover:pl-1">Réseau Vendeurs</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors hover:pl-1">Nous Contacter</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-text-primary mb-4 tracking-wider text-xs uppercase">SECTEURS</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/catalog?category=pc" className="hover:text-primary transition-colors hover:pl-1">Stations Orbit</Link></li>
              <li><Link to="/catalog?category=components" className="hover:text-primary transition-colors hover:pl-1">Hardware</Link></li>
              <li><Link to="/catalog?category=gaming" className="hover:text-primary transition-colors hover:pl-1">Simulateurs</Link></li>
              <li><Link to="/catalog?category=audio" className="hover:text-primary transition-colors hover:pl-1">Acoustique</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-text-primary mb-4 tracking-wider text-xs uppercase">CONTACT</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-border">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                contact@nexus-prime.net
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-border">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                +213 (0) 555 123 456
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-border">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                Alger, Algérie
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-secondary flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 NEXUS. Protocoles sécurisés.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-primary">Conditions</Link>
            <Link to="/privacy" className="hover:text-primary">Confidentialité</Link>
            <Link to="/legal" className="hover:text-primary">Mentions</Link>
          </div>
          <div className="flex gap-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            <span>Systèmes opérationnels</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
