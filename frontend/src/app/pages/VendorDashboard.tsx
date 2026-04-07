import { DollarSign, Package, ShoppingCart, TrendingUp, Plus } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { salesData, topProductsData, mockOrders } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels = {
  pending: 'En attente',
  processing: 'En cours',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export function VendorDashboard() {
  const revenue = 45670;
  const activeProducts = 23;
  const pendingOrders = mockOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 text-primary mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(139,92,246,1)]"></div>
              <span className="text-sm font-mono tracking-[0.3em] uppercase opacity-70">Secteur Marchand Alpha</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Centre de Distribution</h1>
            <p className="text-muted-foreground text-lg">Gérez vos modules et optimisez votre flux de données</p>
          </div>
          <Button variant="glow" className="h-14 px-8 text-lg font-bold">
            <Plus className="w-5 h-5 mr-3" />
            Injecter Nouveau Module
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Flux de Revenus"
            value={`€${revenue.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
            className="bg-card/20 backdrop-blur-xl border-white/5"
          />
          <StatCard
            title="Inventaire Nexus"
            value={activeProducts}
            icon={Package}
            trend={{ value: 8, isPositive: true }}
            className="bg-card/20 backdrop-blur-xl border-white/5"
          />
          <StatCard
            title="Signaux de Vente"
            value={pendingOrders}
            icon={ShoppingCart}
            description="Transferts requis"
            className="bg-card/20 backdrop-blur-xl border-white/5"
          />
          <StatCard
            title="Courbe d'Expansion"
            value="+23.5%"
            icon={TrendingUp}
            trend={{ value: 4.2, isPositive: true }}
            className="bg-card/20 backdrop-blur-xl border-white/5"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Sales Chart */}
          <div className="bg-card/20 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Fluctuations des Ventes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a0b2e',
                    border: '1px solid #ffffff10',
                    borderRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    color: 'white'
                  }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  dot={{ fill: '#8b5cf6', r: 6, strokeWidth: 0 }}
                  activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2, fill: '#0a0311' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Chart */}
          <div className="bg-card/20 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Efficacité des Modules</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a0b2e',
                    border: '1px solid #ffffff10',
                    borderRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    color: 'white'
                  }}
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card/20 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="p-8 border-b border-white/5 bg-white/5">
            <h2 className="text-2xl font-bold tracking-tight">Signal des Transactions</h2>
            <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-widest">Base de données synchronisée</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">ID Fragment</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">Unité Identifiée</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">Date Cycle</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">Volume Crédit</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">Index Statut</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">{order.id}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{order.customer}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-mono text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="font-black text-foreground tabular-nums text-lg">€{order.total}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <Badge className={`${statusColors[order.status]} border font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full`}>
                        {statusLabels[order.status]}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm">
                      <Button variant="glass" size="sm" className="h-10 px-6 rounded-xl hover:bg-primary hover:text-white transition-all">
                        Analyse
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
