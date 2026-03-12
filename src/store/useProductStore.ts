import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface ProductStore {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
    deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
    persist(
        (set) => ({
            products: [],
            addProduct: (product) => set((state) => ({
                products: [...state.products, { ...product, id: crypto.randomUUID() }]
            })),
            updateProduct: (id, updatedProduct) => set((state) => ({
                products: state.products.map((p) => (p.id === id ? { ...updatedProduct, id } : p))
            })),
            deleteProduct: (id) => set((state) => ({
                products: state.products.filter((p) => p.id !== id)
            })),
        }),
        {
            name: 'imports-manos-storage',
        }
    )
);
