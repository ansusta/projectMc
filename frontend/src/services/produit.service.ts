import { api } from './api';

export interface Produit {
    id: string;
    nom_produit: string;
    description: string;
    prix: number;
    qte_dispo: number;
    image_url: string;
    date_ajout: string;
    note_moyenne?: string | null;
    nb_avis?: number;
    type?: { nom: string; categorie?: { nom: string } };
    magasin?: { id?: string; nom_magasin: string; description?: string };
}

export interface ProduitsResponse {
    produits: Produit[];
    total: number;
    page: number;
    limit: number;
}

export const produitService = {
    getAll: (params?: { search?: string; categorie?: string; page?: number; limit?: number }) => {
        const qs = new URLSearchParams();
        if (params?.search) qs.set('search', params.search);
        if (params?.categorie) qs.set('categorie', params.categorie);
        if (params?.page) qs.set('page', String(params.page));
        if (params?.limit) qs.set('limit', String(params.limit));
        return api.get<ProduitsResponse>(`/produit?${qs.toString()}`);
    },

    getById: (id: string) =>
        api.get<{ produit: Produit }>(`/produit/${id}`),
};
