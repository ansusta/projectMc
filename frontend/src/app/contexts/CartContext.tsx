import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { panierService, PanierItem } from '../../services/panier.service';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartContextType {
    items: PanierItem[];
    total: number;
    count: number;
    isLoading: boolean;
    addItem: (produit_id: string, quantite?: number) => Promise<void>;
    removeItem: (produit_id: string) => Promise<void>;
    updateQuantity: (produit_id: string, quantite: number) => Promise<void>;
    refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [items, setItems] = useState<PanierItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const refresh = async () => {
        if (!user) {
            setItems([]);
            setTotal(0);
            return;
        }
        try {
            setIsLoading(true);
            const data = await panierService.get();
            setItems(data.panier?.item ?? []);
            setTotal(data.total || 0);
        } catch {
            // Silently fail — user may not be logged in
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [user]);

    const addItem = async (produit_id: string, quantite: number = 1) => {
        try {
            await panierService.add(produit_id, quantite);
            await refresh();
            toast.success('Produit ajouté au panier');
        } catch (err: any) {
            toast.error(err.message || 'Erreur lors de l\'ajout au panier');
            throw err;
        }
    };

    const removeItem = async (produit_id: string) => {
        try {
            await panierService.remove(produit_id);
            await refresh();
            toast.success('Produit retiré du panier');
        } catch (err: any) {
            toast.error(err.message || 'Erreur lors de la suppression');
            throw err;
        }
    };

    const updateQuantity = async (produit_id: string, quantite: number) => {
        try {
            await panierService.updateQuantity(produit_id, quantite);
            await refresh();
        } catch (err: any) {
            toast.error(err.message || 'Erreur lors de la mise à jour');
            throw err;
        }
    };

    const count = items.reduce((sum, item) => sum + item.qte, 0);

    return (
        <CartContext.Provider value={{ items, total, count, isLoading, addItem, removeItem, updateQuantity, refresh }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
