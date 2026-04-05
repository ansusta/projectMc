import { Search, ShoppingCart, User, Menu, Heart, Package, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Badge } from './ui/badge';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavbarProps {
  cartItemsCount?: number;
  onMenuClick?: () => void;
}

export function Navbar({ cartItemsCount = 0, onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'vendor':
        return '/vendor/dashboard';
      case 'customer':
        return '/customer/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="lg:hidden text-foreground hover:text-primary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary opacity-50 blur-md rounded-full group-hover:opacity-100 transition-opacity"></div>
                <Package className="w-8 h-8 text-white relative z-10" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">NEXUS</span>
            </button>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Rechercher dans la matrice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:bg-white/10 transition-all rounded-xl"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/customer/favorites')}
                className="relative"
              >
                <Heart className="w-5 h-5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/customer/cart')}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-blue-600 text-white text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Languages className="w-5 h-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/90 backdrop-blur-xl border-white/10">
                <DropdownMenuItem className="focus:bg-primary/20 cursor-pointer">Français (FR)</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/20 cursor-pointer">English (EN)</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/20 cursor-pointer text-right">العربية (AR)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hover:bg-white/10 rounded-full pr-4 pl-1">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden md:inline font-medium text-foreground">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(getDashboardRoute())}>
                    Dashboard
                  </DropdownMenuItem>
                  {user.role === 'customer' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/customer/orders')}>
                        Mes commandes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/customer/favorites')}>
                        Mes favoris
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === 'vendor' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/vendor/products')}>
                        Mes produits
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/vendor/orders')}>
                        Commandes reçues
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/customer/profile')}>
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')} className="hover:bg-white/5">
                  Connexion
                </Button>
                <Button variant="glow" onClick={() => navigate('/register')}>
                  S'inscrire
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </form>
      </div>
    </nav>
  );
}
