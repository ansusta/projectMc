import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Mail, ShieldAlert, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'client' ? 'vendeur' : 'client';
    const confirmMsg = `Changer le rôle vers ${newRole === 'vendeur' ? 'VENDEUR' : 'CLIENT'} ?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('Privilèges mis à jour');
    } catch (error) {
      toast.error('Échec de la mise à jour des droits');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-3 sm:px-6 lg:px-8 bg-background font-mono">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-8">
        
        <div>
          <h1 className="text-xl sm:text-3xl text-foreground tracking-[0.3em] flex items-center gap-4 italic font-bold">
            <span className="w-2 h-10 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"></span>
            {t('adminUsers.title')}
          </h1>
          <p className="mt-1 text-primary/50 text-[10px] uppercase tracking-tighter">
            {t('adminUsers.subtitle')}
          </p>
        </div>

        {/* Users List */}
        <div className="bg-card/20 border border-primary/20 rounded-2xl overflow-x-auto backdrop-blur-md shadow-soft">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-primary/30 bg-primary/10">
                <th className="p-4 text-primary text-[10px] uppercase tracking-widest">{t('adminUsers.identity')}</th>
                <th className="p-4 text-primary text-[10px] uppercase tracking-widest">{t('adminUsers.contact')}</th>
                <th className="p-4 text-primary text-[10px] uppercase tracking-widest">{t('adminUsers.currentRole')}</th>
                <th className="p-4 text-primary text-[10px] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-primary/10 hover:bg-primary/5 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                        <Users size={14} />
                      </div>
                      <span className="text-foreground text-sm tracking-widest">{user.nom_utilisateur || 'ANONYME'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-primary/50 text-xs">
                    <div className="flex items-center gap-2 italic">
                      <Mail size={12} className="opacity-30" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full border ${
                      user.role === 'admin' ? 'bg-primary/20 border-primary/50 text-primary' :
                      user.role === 'vendeur' ? 'bg-blue-600/20 border-blue-500 text-blue-400' :
                      'bg-muted border-border text-foreground/50'
                    } uppercase tracking-widest font-bold shadow-sm`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleRoleUpdate(user.id, user.role)}
                      disabled={user.role === 'admin'}
                      className="text-[10px] text-primary disabled:opacity-20 hover:text-primary/80 transition-colors uppercase gap-2 flex items-center justify-end w-full tracking-tighter outline-none focus:ring-1 focus:ring-primary/30 rounded-md p-1"
                    >
                      <Shield size={12} /> Modifier Privilèges
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-20 text-center opacity-30 italic text-sm text-primary uppercase tracking-[0.5em] font-mono">
              Séquence réseau vide - Aucun utilisateur détecté
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
