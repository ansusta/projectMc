import { DollarSign, Package, ShoppingCart, TrendingUp, Plus } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { salesData, topProductsData, mockOrders } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// Move statusLabels inside component to use t()

export function VendorDashboard() {
  const { t, i18n } = useTranslation();
  
  const statusLabels = {
    pending: t('vendorDashboard.status.pending'),
    processing: t('vendorDashboard.status.processing'),
    shipped: t('vendorDashboard.status.shipped'),
    delivered: t('vendorDashboard.status.delivered'),
    cancelled: t('vendorDashboard.status.cancelled'),
  };
  const revenue = 45670;
  const activeProducts = 23;
  const pendingOrders = mockOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-3 text-primary mb-2 sm:mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(139,92,246,1)]"></div>
              <span className="text-xs sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-70">{t('vendorDashboard.merchantSector')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-1 sm:mb-2 text-foreground">{t('vendorDashboard.distributionCenter')}</h1>
            <p className="text-muted-foreground text-sm sm:text-lg italic">{t('vendorDashboard.manageModules')}</p>
          </div>
          <Button variant="glow" className="h-11 sm:h-14 px-5 sm:px-8 text-sm sm:text-lg font-bold self-start sm:self-auto">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            <span className="hidden sm:inline">{t('vendorDashboard.injectModule')}</span>
            <span className="sm:hidden">{t('vendorDashboard.injectModuleShort')}</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title={t('vendorDashboard.revenueStream')}
            value={revenue.toLocaleString(i18n.language, { style: 'currency', currency: 'EUR' })}
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
            className="bg-card/40 backdrop-blur-xl border-border shadow-soft hover:shadow-md transition-all"
          />
          <StatCard
            title={t('vendorDashboard.nexusInventory')}
            value={activeProducts}
            icon={Package}
            trend={{ value: 8, isPositive: true }}
            className="bg-card/40 backdrop-blur-xl border-border shadow-soft hover:shadow-md transition-all"
          />
          <StatCard
            title={t('vendorDashboard.salesSignals')}
            value={pendingOrders}
            icon={ShoppingCart}
            description={t('vendorDashboard.transfersRequired')}
            className="bg-card/40 backdrop-blur-xl border-border shadow-soft hover:shadow-md transition-all"
          />
          <StatCard
            title={t('vendorDashboard.expansionCurve')}
            value="+23.5%"
            icon={TrendingUp}
            trend={{ value: 4.2, isPositive: true }}
            className="bg-card/40 backdrop-blur-xl border-border shadow-soft hover:shadow-md transition-all"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-10 mb-8 sm:mb-12">
          {/* Sales Chart */}
          <div className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border p-4 sm:p-8 shadow-soft">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight mb-4 sm:mb-8">{t('vendorDashboard.salesFluctuations')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                <XAxis dataKey="month" stroke="#888888" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis stroke="#888888" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    color: 'var(--foreground)'
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
          <div className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border p-4 sm:p-8 shadow-soft">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight mb-4 sm:mb-8">{t('vendorDashboard.moduleEfficiency')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis stroke="#888888" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    color: 'var(--foreground)'
                  }}
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-soft">
          <div className="p-4 sm:p-8 border-b border-border bg-muted/30">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">{t('vendorDashboard.transactionSignal')}</h2>
            <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-widest">{t('vendorDashboard.syncedDb')}</p>
          </div>
          <div className="overflow-x-auto -mx-0">
            <table className="w-full min-w-[600px]">
              <thead className="bg-muted/20 border-b border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">{t('customerOrders.orderId') || 'ID'}</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">{t('auth.name') || 'Client'}</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">{t('customerOrders.date') || 'Date'}</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">{t('customerOrders.total') || 'Total'}</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">{t('customerOrders.status')}</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] font-mono">{t('vendorDashboard.table.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 sm:px-6 py-3 sm:py-5 whitespace-nowrap">
                      <div className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{order.id}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{order.customer}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-5 whitespace-nowrap">
                      <div className="text-xs font-mono text-muted-foreground">
                        {new Date(order.date).toLocaleDateString(i18n.language)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-5 whitespace-nowrap">
                      <div className="font-black text-foreground tabular-nums">{order.total.toLocaleString(i18n.language, { style: 'currency', currency: 'EUR' })}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-5 whitespace-nowrap">
                      <Badge className={`${statusColors[order.status]} border font-bold uppercase tracking-widest text-[10px] px-2 py-0.5 rounded-full`}>
                        {statusLabels[order.status]}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-sm">
                      <Button variant="glass" size="sm" className="h-8 sm:h-10 px-3 sm:px-5 rounded-xl hover:bg-primary hover:text-white transition-all text-xs">
                        {t('vendorDashboard.analysis')}
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
