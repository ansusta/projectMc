import { api } from './api';

export interface Product {
  id: string;
  nom_produit: string;
  description: string;
  prix: number;
  stock: number;
  categorie: string;
  image_url?: string;
  id_magasin: string;
  en_vente: boolean;
  date_ajout?: string;
}

export const produitService = {
  // Get all products for a specific store
  getByMagasin: (magasinId: string) => 
    api.get<{ produits: Product[] }>(`/produit/magasin/${magasinId}`),

  // Create a new product
  create: (data: Partial<Product>) =>
    api.post<{ message: string; produit: Product }>('/produit', data),

  // Update a product
  update: (id: string, data: Partial<Product>) =>
    api.patch<{ message: string; produit: Product }>(`/produit/${id}`, data),

  // Delete a product
  delete: (id: string) =>
    api.delete<{ message: string }>(`/produit/${id}`),
};
