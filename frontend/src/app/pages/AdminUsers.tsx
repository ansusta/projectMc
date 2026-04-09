import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Mail, ShieldAlert, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { toast } from 'sonner';

export const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

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
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-black font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl text-white tracking-[0.3em] flex items-center gap-4 italic font-bold">
            <span className="w-2 h-10 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></span>
            CONTRÔLE DES ACCÈS
          </h1>
          <p className="mt-1 text-red-500/50 text-[10px] uppercase tracking-tighter">
            Gestion globale des identités et des niveaux de privilèges utilisateurs
          </p>
        </div>

        {/* Users List */}
        <div className="bg-gray-900/20 border border-red-900/20 rounded-sm overflow-hidden backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-red-900/30 bg-red-900/10">
                <th className="p-4 text-red-500 text-[10px] uppercase tracking-widest">Identité</th>
                <th className="p-4 text-red-500 text-[10px] uppercase tracking-widest">Contact</th>
                <th className="p-4 text-red-500 text-[10px] uppercase tracking-widest">Rôle Actuel</th>
                <th className="p-4 text-red-500 text-[10px] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-red-900/10 hover:bg-red-900/5 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-red-900/20 border border-red-900/30 flex items-center justify-center text-red-400">
                        <Users size={14} />
                      </div>
                      <span className="text-white text-sm tracking-widest">{user.nom_utilisateur || 'ANONYME'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-red-500/50 text-xs">
                    <div className="flex items-center gap-2 italic">
                      <Mail size={12} className="opacity-30" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-1 rounded-sm border ${
                      user.role === 'admin' ? 'bg-red-600/20 border-red-500 text-red-400' :
                      user.role === 'vendeur' ? 'bg-blue-600/20 border-blue-500 text-blue-400' :
                      'bg-gray-800 border-gray-600 text-gray-400'
                    } uppercase tracking-widest font-bold`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleRoleUpdate(user.id, user.role)}
                      disabled={user.role === 'admin'}
                      className="text-[10px] text-red-500 disabled:opacity-20 hover:text-red-400 transition-colors uppercase gap-2 flex items-center justify-end w-full tracking-tighter"
                    >
                      <Shield size={12} /> Modifier Privilèges
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-20 text-center opacity-30 italic text-sm text-red-500 uppercase tracking-[0.5em]">
              Séquence réseau vide - Aucun utilisateur détecté
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
