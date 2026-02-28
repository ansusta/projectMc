import { Users, ShoppingBag, Store, DollarSign, Check, X } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { salesData, mockVendors } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export function AdminDashboard() {
  const handleApproveVendor = (vendorName: string) => {
    toast.success(`${vendorName} a été approuvé !`);
  };

  const handleRejectVendor = (vendorName: string) => {
    toast.error(`${vendorName} a été rejeté.`);
  };

  const totalRevenue = 134900;
  const totalUsers = 2847;
  const totalVendors = mockVendors.length;
  const totalOrders = 1456;

  const pendingVendors = mockVendors.filter(v => v.status === 'pending');

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 text-primary mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(139,92,246,1)]"></div>
            <span className="text-xs font-black tracking-[0.4em] uppercase opacity-70 font-mono">Terminal Maître - Niveau d'accès 5</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4 selection:bg-primary/50">Centre de Commande</h1>
          <p className="text-muted-foreground text-xl max-w-2xl">Surveillance holographique globale de l'écosystème Nexus Prime</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            title="Extraction Crédit Totale"
            value={`€${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 18.2, isPositive: true }}
            className="bg-card/20 backdrop-blur-xl border-white/5 hover:border-primary/30 transition-all cursor-crosshair"
          />
          <StatCard
            title="Unités Connectées"
            value={totalUsers.toLocaleString()}
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
            className="bg-card/20 backdrop-blur-xl border-white/5 hover:border-primary/30 transition-all cursor-crosshair"
          />
          <StatCard
            title="Entités Distributrices"
            value={totalVendors}
            icon={Store}
            trend={{ value: 8.3, isPositive: true }}
            className="bg-card/20 backdrop-blur-xl border-white/5 hover:border-primary/30 transition-all cursor-crosshair"
          />
          <StatCard
            title="Transactions Warp"
            value={totalOrders.toLocaleString()}
            icon={ShoppingBag}
            trend={{ value: 15.7, isPositive: true }}
            className="bg-card/20 backdrop-blur-xl border-white/5 hover:border-primary/30 transition-all cursor-crosshair"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-card/20 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-10 shadow-[0_8px_64px_rgba(0,0,0,0.5)]">
            <h2 className="text-2xl font-black tracking-tight mb-10">Expension Financière</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff30" axisLine={false} tickLine={false} fontSize={12} fontStyle="italic" />
                <YAxis stroke="#ffffff30" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a0b2e',
                    border: '1px solid #8b5cf620',
                    borderRadius: '20px',
                    backdropFilter: 'blur(30px)',
                    boxShadow: '0 0 20px rgba(139,92,246,0.1)'
                  }}
                  cursor={{ stroke: '#8b5cf630', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8b5cf6"
                  strokeWidth={6}
                  dot={{ fill: '#8b5cf6', r: 8, strokeWidth: 0 }}
                  activeDot={{ r: 12, stroke: '#8b5cf6', strokeWidth: 4, fill: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pending Approvals */}
          <div className="bg-card/20 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h2 className="text-2xl font-black tracking-tight mb-8">Protocoles d'Enrôlement</h2>
            {pendingVendors.length > 0 ? (
              <div className="space-y-6">
                {pendingVendors.map((vendor) => (
                  <div key={vendor.id} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-primary/40 transition-all group">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{vendor.name}</h3>
                      <p className="text-sm font-mono text-muted-foreground opacity-70">{vendor.email}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleApproveVendor(vendor.name)}
                        className="flex-1 h-12 rounded-xl bg-green-500/20 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Autoriser
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRejectVendor(vendor.name)}
                        className="flex-1 h-12 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Obstruer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 opacity-30 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.3em] font-mono">File d'attente vide</p>
              </div>
            )}
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-card/20 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-12">
          <div className="p-10 border-b border-white/5 bg-white/5">
            <h2 className="text-2xl font-black tracking-tight">Index des Entités Distributrices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] font-mono">Entité</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] font-mono">Signal ID</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] font-mono">Extraction</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] font-mono">Modules</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] font-mono">Index Statut</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] font-mono">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {mockVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-10 py-6 whitespace-nowrap">
                      <div className="font-bold text-lg group-hover:text-primary transition-colors">{vendor.name}</div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <div className="text-sm font-mono opacity-50">{vendor.email}</div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <div className="font-black tabular-nums text-lg">€{vendor.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <div className="font-mono text-primary font-black">{vendor.products} <span className="text-[10px] opacity-50">UNIT</span></div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={
                          vendor.status === 'approved'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : vendor.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }
                      >
                        {vendor.status === 'approved' ? 'VALIDE' : vendor.status === 'pending' ? 'SUSPENDU' : 'REJETE'}
                      </Badge>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap text-sm">
                      <Button variant="glass" size="sm" className="h-10 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">
                        MODULER
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-card/20 backdrop-blur-xl rounded-[2rem] border border-white/5 p-10 group hover:border-primary/30 transition-all">
            <h3 className="text-xl font-extrabold mb-3">MATRICE UTILISATEURS</h3>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium">Contrôle parental et gestion des accès biologiques.</p>
            <Button variant="glass" className="w-full h-12 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary transition-all">
              PENETRER
            </Button>
          </div>
          <div className="bg-card/20 backdrop-blur-xl rounded-[2rem] border border-white/5 p-10 group hover:border-primary/30 transition-all">
            <h3 className="text-xl font-extrabold mb-3">GESTION MODULES</h3>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium">Modération holographique des signaux produits.</p>
            <Button variant="glass" className="w-full h-12 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary transition-all">
              PENETRER
            </Button>
          </div>
          <div className="bg-card/20 backdrop-blur-xl rounded-[2rem] border border-white/5 p-10 group hover:border-primary/30 transition-all">
            <h3 className="text-xl font-extrabold mb-3">ANALYSE CORE</h3>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium">Statistiques quantiques et métriques de flux.</p>
            <Button variant="glass" className="w-full h-12 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary transition-all">
              PENETRER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
