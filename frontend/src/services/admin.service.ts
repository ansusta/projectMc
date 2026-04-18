import { api } from './api';

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  // Detailed breakdown
  clients?: { total: number; actifs: number; suspendus: number; bannis: number };
  commandes?: { total: number; en_cours: number; completees: number; annulees: number; revenu_total: number };
  magasins?: { total: number; actifs: number; en_attente_validation: number };
}

export const adminService = {
  // Get platform-wide stats
  getStats: () => api.get<AdminStats>('/admin/stats'),

  // User management
  getAllUsers: () => api.get<{ users: any[] }>('/admin/users'),
  updateUserRole: (userId: string, role: string) => 
    api.patch<{ message: string }>(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId: string) => 
    api.delete<{ message: string }>(`/admin/users/${userId}`),

  // Store management (Validation)
  getPendingStores: () => api.get<{ stores: any[] }>('/admin/stores/pending'),
  validateStore: (storeId: string, status: 'actif' | 'suspendu') => 
    api.patch<{ message: string }>(`/admin/stores/${storeId}/validate`, { status }),
};
