import { api } from './api';

export type MethodePaiement = 'carteVisa' | 'carteDahabia' | 'paypal' | 'virement' | 'cash';

export interface CommandeResponse {
    message: string;
    commande_id: string;
    montant_total: number;
    statut: string;
}

export const commandeService = {
    passer: (id_adrs: string, methode_paiement: MethodePaiement) =>
        api.post<CommandeResponse>('/commande', { id_adrs, methode_paiement }),

    getById: (id: string) => api.get<{ commande: unknown }>(`/commande/${id}`),

    getEnCours: () => api.get<{ commandes_en_cours: unknown[] }>('/commande/en-cours'),

    getHistorique: () => api.get<{ historique: unknown[] }>('/commande/historique'),

    annuler: (id: string) => api.patch<{ message: string }>(`/commande/${id}/annuler`, {}),
};
