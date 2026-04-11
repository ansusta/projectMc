import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, ArrowLeft, Loader2, Home, Building2, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { adresseService, Adresse } from '../../services/adresse.service';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function AddressManager() {
  const navigate = useNavigate();
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [newAddress, setNewAddress] = useState({
    numero_rue: '',
    nom_rue: '',
    complement_adresse: '',
    code_postal: '',
    ville: '',
    region: '',
    pays: 'France',
  });

  useEffect(() => {
    loadAdresses();
  }, []);

  const loadAdresses = async () => {
    try {
      setIsLoading(true);
      const data = await adresseService.getAdresses();
      setAdresses(data.adresses);
    } catch (err: any) {
      toast.error('Erreur lors du chargement des secteurs de livraison');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await adresseService.addAdresse(newAddress);
      toast.success('Nouveau point de chute synchronisé');
      setAdresses([...adresses, res.adresse]);
      setShowAddForm(false);
      setNewAddress({
        numero_rue: '',
        nom_rue: '',
        complement_adresse: '',
        code_postal: '',
        ville: '',
        region: '',
        pays: 'France',
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adresseService.deleteAdresse(id);
      setAdresses(adresses.filter(a => a.id !== id));
      toast.success('Secteur supprimé de la matrice');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            className="mb-6 -ml-4 hover:bg-white/5 opacity-70"
            onClick={() => navigate('/customer/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 text-primary mb-3">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,1)]"></div>
                <span className="text-sm font-mono tracking-[0.3em] uppercase opacity-70">Carnet de Coordonnées</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight">Mes Points de Livraison</h1>
              <p className="text-muted-foreground mt-2">Gérez vos secteurs d'expedition pour des transferts optimisés.</p>
            </div>

            <Button 
                variant="glow" 
                size="lg"
                onClick={() => setShowAddForm(true)}
                className="hidden md:flex h-14 font-bold"
            >
                <Plus className="w-5 h-5 mr-3" />
                Nouveau Secteur
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Adresses List */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse border border-white/5"></div>
                ))}
              </div>
            ) : adresses.length === 0 ? (
              <div className="text-center py-20 bg-card/10 rounded-3xl border border-dashed border-white/10">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-xl font-bold text-muted-foreground">Aucun secteur enregistré</p>
                <Button variant="glass" className="mt-6" onClick={() => setShowAddForm(true)}>
                  Ajouter ma première adresse
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {adresses.map((addr, index) => (
                    <motion.div 
                      key={addr.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 group hover:border-primary/30 transition-all shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                            <Home className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-1">{addr.numero_rue} {addr.nom_rue}</h3>
                            <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">{addr.code_postal} {addr.ville}</p>
                            <p className="text-sm text-muted-foreground/60 mt-1">{addr.pays}</p>
                            {addr.complement_adresse && (
                              <p className="text-xs italic text-primary/70 mt-3 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10 inline-block">
                                {addr.complement_adresse}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                          onClick={() => handleDelete(addr.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Side Form / Info */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {showAddForm ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card/30 backdrop-blur-2xl border border-primary/20 rounded-3xl p-8 sticky top-12 shadow-[0_0_50px_rgba(139,92,246,0.1)]"
                >
                    <h2 className="text-2xl font-bold mb-8">Nouveau Secteur</h2>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">N°</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                            value={newAddress.numero_rue}
                            onChange={e => setNewAddress({...newAddress, numero_rue: e.target.value})}
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Voie / Rue</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                            value={newAddress.nom_rue}
                            onChange={e => setNewAddress({...newAddress, nom_rue: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Complément (Appt, Etage...)</label>
                        <input 
                          type="text" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={newAddress.complement_adresse}
                          onChange={e => setNewAddress({...newAddress, complement_adresse: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Code Postal</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
                            value={newAddress.code_postal}
                            onChange={e => setNewAddress({...newAddress, code_postal: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Ville</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                            value={newAddress.ville}
                            onChange={e => setNewAddress({...newAddress, ville: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Pays / Univers</label>
                        <input 
                          type="text" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={newAddress.pays}
                          onChange={e => setNewAddress({...newAddress, pays: e.target.value})}
                          required
                        />
                      </div>

                      <div className="flex gap-3 pt-6">
                        <Button 
                            type="submit" 
                            variant="glow" 
                            className="flex-1 h-12"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Synchroniser'}
                        </Button>
                        <Button 
                            type="button" 
                            variant="glass" 
                            className="h-12"
                            onClick={() => setShowAddForm(false)}
                        >
                            Annuler
                        </Button>
                      </div>
                    </form>
                </motion.div>
              ) : (
                <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sticky top-12">
                   <h2 className="text-xl font-bold mb-6">Informations</h2>
                   <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Globe className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          La suppression d'une adresse n'affecte pas vos transferts en cours de trajet.
                        </p>
                      </div>
                      <div className="flex items-start gap-4">
                        <Building2 className="w-5 h-5 text-secondary shrink-0 mt-1" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Chaque secteur enregistré permet de calculer instantanément les protocoles logistiques lors de vos achats.
                        </p>
                      </div>
                   </div>
                   <Button 
                    variant="glass" 
                    className="w-full h-14 mt-10 md:hidden"
                    onClick={() => setShowAddForm(true)}
                   >
                     <Plus className="w-5 h-5 mr-3" />
                     Ajouter Adresse
                   </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
